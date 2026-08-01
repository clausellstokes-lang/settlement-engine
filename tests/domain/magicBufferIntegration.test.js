/**
 * magicBufferIntegration.test.js — W-K slice K3 THE DISASTER BUFFER at the
 * calamityKernel seam (binding law docs/DESIGN_MAGIC_ECONOMY.md §5, §10; law 8).
 *
 * The model file proves the arithmetic. This file proves the arithmetic is WIRED, that
 * wiring it changed nothing while the lane is dark, and that the two corners the design
 * pre-answers are genuinely reachable in worlds the generator actually makes.
 *
 * The strike is driven through `advanceCalamity` with the same controlled rng the
 * calamity integration suite uses, because a real hazard fires about once every fifteen
 * realm-years and a buffer pin that waited for one would never run.
 *
 * WHAT IS PROVEN HERE:
 *   1. DORMANCY, BY OBJECT IDENTITY. Flag off ⇒ the worldState comes back as the SAME
 *      REFERENCE, no ledger key exists, and no receipt carries a relief block.
 *   2. THE CONVERSION IS REAL. Lit, the same strike fells fewer institutions, kills
 *      fewer people, and draws the granary down in the same outcome.
 *   3. CONSERVATION END TO END. The granary a settlement lost equals the granary the
 *      receipt says it paid, and the reserve the ledger lost equals the reserve the
 *      receipt says it paid.
 *   4. THE LEDGER. Drop-when-empty, JSON round-trip, and the dwell applied on read.
 *   5. THE SECOND-SHOCK WINDOW, through the real path: a settlement whose reserve was
 *      drawn by an earlier disaster measurably mitigates less than a rested one.
 *   6. CONJUNCTION REACHABILITY, censused over a real generated corpus.
 *   7. THE GATE IS K2's, proven both behaviourally and by a source scan.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { advanceCalamity } from '../../src/domain/worldPulse/calamityKernel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import {
  MAGIC_BUFFER_LEDGER, readMagicBufferLedger, readBufferCharge01, bufferMagic01,
  writeMagicBufferLedger, isBufferRecordEmpty,
} from '../../src/domain/worldPulse/magicBufferApply.js';
import { MAGIC_BUFFER_TUNING } from '../../src/domain/worldPulse/magicBufferModel.js';
import {
  MAGIC_REGIME_LEDGER, REGIME_INDUSTRIAL, REGIME_SUBSISTENCE, regimeForEconomy,
} from '../../src/domain/worldPulse/magicRegimeModel.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveCausalState } from '../../src/domain/causalState.js';
import { economyHealthScore } from '../../src/domain/worldPulse/institutionLifecycle.js';
import { WAVE_SUBSYSTEM_ROWS } from '../../src/domain/certification/subsystemRowsWaves.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const NOW = '2026-01-01T00:00:00.000Z';
const STRUCK = 'thornwood';
const IDS = [STRUCK, 'midvale'];

// A rich, deeply magical city with a THIN granary. The granary depth is chosen, not
// incidental: a six-month store absorbs the whole bill on its own and the ward reserve
// is never touched, which would leave the ledger pins with nothing to read. Half a month
// makes the granary run out mid-payment and the wards cover the remainder, which is the
// two-stock split §5 describes and the state the second-shock window is measured from.
const THIN_GRANARY_MONTHS = 0.5;

function struckSettlement() {
  return {
    name: 'Thornwood', tier: 'city', population: 5000,
    config: { terrainType: 'forest', priorityMagic: 90, magicExists: true },
    institutions: [
      { name: 'Town hall', required: true, category: 'civic' },
      { name: 'Water source', required: true, category: 'infrastructure' },
      { name: 'Blacksmith', category: 'crafts' },
      { name: 'Inn', category: 'lodging' },
      { name: 'Tavern', category: 'lodging' },
      { name: "Mages' guild", category: 'magic' },
    ],
    economicState: {
      primaryExports: ['iron tools'], primaryImports: [],
      activeChains: [{ resource: { name: 'iron ore' }, processingInstitutions: ['Blacksmith'], outputs: ['iron tools'] }],
      foodSecurity: { storageMonths: THIN_GRANARY_MONTHS },
    },
    powerStructure: { publicLegitimacy: { score: 60 }, factions: [], conflicts: [] },
    npcs: [], activeConditions: [], populationHistory: [],
  };
}

const plainSettlement = (name) => ({
  name, tier: 'town', population: 1500, config: { terrainType: 'plains' },
  institutions: [{ name: 'Market', category: 'trade' }],
  economicState: { primaryExports: [], primaryImports: ['iron tools'], activeChains: [] },
  activeConditions: [], npcs: [],
});

// A prosperous causal reading, which is what K2's regime ladder actually reads. The
// four keys are economyHealthScore's own, so the fixture cannot drift away from the
// function that grades it.
const RICH_CAUSAL = {
  scores: {
    trade_connectivity: 90, labor_capacity: 90, infrastructure_condition: 90, food_security: 90,
  },
};

/** A key-aware rng: fire at Thornwood only, take the widest strike, floor every other draw. */
function stubRng() {
  const val = (key) => {
    const m = /^disaster:([^:]+):\d+$/.exec(key);
    if (m) return m[1] === STRUCK ? 0 : 0.99;
    if (/^disaster:k:/.test(key)) return 0.99;
    return 0;
  };
  const make = (key) => ({ random: () => val(key), fork: (k) => make(k) });
  return { fork: (k) => make(k) };
}

/**
 * @param {{ lit?: boolean, regime?: string|null, priorCharge?: { charge01: number, year: number }|null }} options
 */
function runStrike({ lit = false, regime = REGIME_INDUSTRIAL, priorCharge = null } = {}) {
  const settlements = [
    { id: STRUCK, name: 'Thornwood', settlement: struckSettlement(), causal: RICH_CAUSAL },
    { id: 'midvale', name: 'Midvale', settlement: plainSettlement('Midvale'), causal: RICH_CAUSAL },
  ];
  const snapshot = {
    settlements,
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'e.t.m', from: STRUCK, to: 'midvale', relationshipType: 'trade_partner' }],
      channels: [],
    }),
  };
  /** @type {Record<string, unknown>} */
  const spatialLedgers = {};
  if (lit && regime) spatialLedgers[MAGIC_REGIME_LEDGER] = { [STRUCK]: { regime, sinceTick: 0 } };
  if (priorCharge) spatialLedgers[MAGIC_BUFFER_LEDGER] = { [STRUCK]: priorCharge };
  const worldState = {
    tick: 52,
    simulationRules: { disastersEnabled: true, ...(lit ? { magicEconomyEnabled: true } : {}) },
    ...(Object.keys(spatialLedgers).length ? { spatialLedgers } : {}),
  };
  const result = advanceCalamity({
    settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })),
    worldState,
    snapshot,
    digest: null,
    pIndex: { get: () => ({ score: 0.4 }) },
    rules: worldState.simulationRules,
    rng: stubRng(),
    season: 'spring',
    prevWeeks: 51, weeks: 52, tick: 52, now: NOW,
  });
  const strike = result.receipts.find((r) => r.kind === 'strike');
  const settlement = result.settlementUpdates.find((u) => u.saveId === STRUCK)?.settlement;
  return { result, worldState, strike, settlement };
}

describe('K3 the disaster buffer at the calamity seam', () => {
  it('1. DORMANCY: dark, the wiring is invisible down to object identity', () => {
    const dark = runStrike({ lit: false });
    // The strike itself definitely happened, which is what stops this pin from being a
    // statement about a run in which nothing occurred.
    expect(dark.strike).toBeTruthy();
    expect(Number(dark.strike?.deaths)).toBeGreaterThan(0);

    // THE STRONGEST AVAILABLE FORM: the kernel hands back the SAME worldState object it
    // was given, so no key could have materialized behind the dark switch even in
    // principle.
    expect(dark.result.worldState).toBe(dark.worldState);
    expect(readMagicBufferLedger(dark.result.worldState)).toBeNull();
    expect(dark.strike).toHaveProperty('targets');
    expect(dark.strike).toHaveProperty('severedExports');
    // anchored: the two assertions above prove this receipt is live and fully shaped, so the missing relief block reads as a dark buffer rather than an absent receipt
    expect(dark.strike).not.toHaveProperty('relief');

    // The granary is untouched: a dark buffer bills nobody.
    expect(dark.settlement?.economicState?.foodSecurity?.storageMonths).toBe(THIN_GRANARY_MONTHS);
  });

  it('2. THE CONVERSION IS REAL: lit, the same strike costs less and the stocks pay', () => {
    const dark = runStrike({ lit: false });
    const lit = runStrike({ lit: true });

    expect(lit.strike).toBeTruthy();
    expect(lit.strike?.relief).toBeTruthy();
    const relief = /** @type {Record<string, number|string|boolean|string[]>} */ (lit.strike?.relief);

    // FEWER PEOPLE DIE AND FEWER LEAVE, and at least one institution is left standing.
    expect(Number(lit.strike?.deaths)).toBeLessThan(Number(dark.strike?.deaths));
    expect(Number(lit.strike?.exodus)).toBeLessThan(Number(dark.strike?.exodus));
    expect(Number(lit.strike?.k)).toBeLessThan(Number(dark.strike?.k));
    expect(Array.isArray(relief.spared) ? relief.spared.length : 0).toBeGreaterThan(0);

    // AND THE DAMAGE DID NOT VANISH: it moved into the stocks, in the same outcome.
    expect(Number(relief.paidStoresMonths)).toBeGreaterThan(0);
    expect(Number(relief.paidWardCharge)).toBeGreaterThan(0);
    expect(String(relief.note)).toContain('granaries paid');

    // The institutions the wards kept are genuinely absent from the fallen set.
    const fell = /** @type {string[]} */ (lit.strike?.targets || []);
    const spared = /** @type {string[]} */ (relief.spared || []);
    for (const name of spared) {
      expect(fell.length).toBeGreaterThan(0);
      // anchored: the assertion above proves the fallen list is non-empty, so a spared name missing from it means kept rather than nothing-struck
      expect(fell).not.toContain(name);
    }
  });

  it('3. CONSERVATION END TO END: the stocks lost exactly what the receipt says they paid', () => {
    const lit = runStrike({ lit: true });
    const relief = /** @type {Record<string, number>} */ (lit.strike?.relief);

    // THE GRANARY. The settlement's own food store fell by exactly the billed months,
    // to the tenth of a month the estate rounds this field to.
    const after = Number(lit.settlement?.economicState?.foodSecurity?.storageMonths);
    const drawn = Math.round((THIN_GRANARY_MONTHS - after) * 10) / 10;
    expect(drawn).toBe(Math.round(Number(relief.paidStoresMonths) * 10) / 10);
    expect(after).toBeLessThan(THIN_GRANARY_MONTHS);

    // THE RESERVE. The ledger holds exactly the charge the receipt says survived.
    const ledger = readMagicBufferLedger(lit.result.worldState);
    expect(ledger).toBeTruthy();
    const record = /** @type {{ charge01: number, year: number }} */ (
      /** @type {Record<string, unknown>} */ (ledger)[STRUCK]
    );
    expect(record.charge01).toBe(Number(relief.chargeAfter));
    expect(record.charge01).toBeCloseTo(1 - Number(relief.paidWardCharge), 6);

    // AND THE SUM IS HONEST: the two billed shares equal the relief that was bought.
    const billed = Number(
      ((Number(relief.paidStoresMonths) / MAGIC_BUFFER_TUNING.STORES_MONTHS_PER_UNIT)
        + (Number(relief.paidWardCharge) / MAGIC_BUFFER_TUNING.WARD_CHARGE_PER_UNIT)).toFixed(2),
    );
    expect(billed).toBeCloseTo(Number(relief.reliefUnits), 1);
  });

  it('4. THE LEDGER: drop-when-empty, JSON round-trip, and the dwell applied on read', () => {
    // A rested realm writes NOTHING, because a full reserve is what an untouched
    // settlement already reads. That is the byte-identity half of dormancy from the
    // other side: a healed world is indistinguishable from one that never spent.
    const full = writeMagicBufferLedger({ spatialLedgers: { other: { keep: 1 } } }, {
      a: { charge01: 1, year: 3 },
    });
    expect(full.spatialLedgers).toHaveProperty('other');
    // anchored: the assertion above proves the sibling sub-ledger survived, so the drop removed one key rather than the whole namespace
    expect(full).not.toHaveProperty('spatialLedgers.magicBuffer');
    expect(isBufferRecordEmpty({ charge01: 1, year: 3 })).toBe(true);
    expect(isBufferRecordEmpty({ charge01: 0.4, year: 3 })).toBe(false);

    // The whole namespace goes when this was the last sub-ledger. The same input with a
    // surviving record keeps the namespace, which is the liveness half of the pair.
    const lastOut = writeMagicBufferLedger(
      { spatialLedgers: { magicBuffer: { a: { charge01: 0.2, year: 1 } } } }, {},
    );
    expect(writeMagicBufferLedger({ spatialLedgers: {} }, { a: { charge01: 0.2, year: 1 } }))
      .toHaveProperty('spatialLedgers.magicBuffer');
    // anchored: the assertion above proves this writer does produce the namespace, so its absence here is a drop rather than a writer that never writes
    expect(lastOut).not.toHaveProperty('spatialLedgers');

    // JSON ROUND-TRIP: a persisted world reads back the identical reserve.
    const lit = runStrike({ lit: true });
    const reloaded = JSON.parse(JSON.stringify(lit.result.worldState));
    expect(readMagicBufferLedger(reloaded)).toEqual(readMagicBufferLedger(lit.result.worldState));
    const year = 2;
    expect(readBufferCharge01(reloaded, STRUCK, { year, economy01: 0.9 }))
      .toBe(readBufferCharge01(lit.result.worldState, STRUCK, { year, economy01: 0.9 }));

    // THE DWELL IS APPLIED ON READ, so a world that sat unopened recovers the same
    // amount as one that ticked through the years.
    const world = { spatialLedgers: { magicBuffer: { [STRUCK]: { charge01: 0.2, year: 0 } } } };
    const poor = readBufferCharge01(world, STRUCK, { year: 4, economy01: 0 });
    const rich = readBufferCharge01(world, STRUCK, { year: 4, economy01: 1 });
    expect(poor).toBeGreaterThan(0.2);
    expect(rich).toBeGreaterThan(poor);
    // An id the ledger does not know reads a FULL reserve, not a zero one.
    expect(readBufferCharge01(world, 'nobody', { year: 4, economy01: 0.5 })).toBe(1);
  });

  it('5. THE SECOND-SHOCK WINDOW: a drawn reserve mitigates measurably less', () => {
    const rested = runStrike({ lit: true });
    // The same city, same seed, same strike, but its reserve was spent by an earlier
    // disaster in the same year, so the dwell has returned nothing yet.
    const drawn = runStrike({ lit: true, priorCharge: { charge01: 0.15, year: 52 } });

    const restedRelief = /** @type {Record<string, number>} */ (rested.strike?.relief);
    const drawnRelief = /** @type {Record<string, number>} */ (drawn.strike?.relief);
    expect(Number(drawnRelief.mitigation)).toBeLessThan(Number(restedRelief.mitigation));
    expect(Number(drawn.strike?.deaths)).toBeGreaterThan(Number(rested.strike?.deaths));
    expect(Number(drawn.strike?.exodus)).toBeGreaterThan(Number(rested.strike?.exodus));

    // anchored: the rested run mitigated something, so "the drawn run mitigated less" is a comparison rather than two zeroes
    expect(Number(restedRelief.mitigation)).toBeGreaterThan(0);
  });

  it('6. CONJUNCTION REACHABILITY: the high-magic, high-economy cell occurs in real corpora', () => {
    // THE HAZARD THIS PIN EXISTS FOR: a pin over a conjunction that never occurs is
    // vacuously green forever. The design pre-answers it by asserting the cell is
    // reachable, so the census is run against settlements the real pipeline made,
    // reading the two axes through the exact functions the buffer reads them through.
    const TIERS = ['thorp', 'village', 'town', 'city', 'metropolis'];
    const CULTURES = ['germanic', 'arabic', 'celtic', 'norse'];
    const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain'];
    const ACCESS = ['road', 'river', 'port', 'isolated'];
    const DIALS = [0, 15, 40, 55, 70, 85, 100];

    /** @type {Array<{ magic01: number, economy01: number, regime: string }>} */
    const corpus = [];
    const seeds = Array.from({ length: 280 }, (_unused, i) => i);
    const failures = collectSeedFailures(seeds, (i) => {
      const settlement = generateSettlementPipeline({
        settType: TIERS[i % TIERS.length],
        culture: CULTURES[(i * 3) % CULTURES.length],
        terrainOverride: TERRAINS[(i * 5) % TERRAINS.length],
        tradeRouteAccess: ACCESS[(i * 7) % ACCESS.length],
        priorityMagic: DIALS[i % DIALS.length],
        magicExists: true,
      }, null, { seed: `k3-reach-${i}`, customContent: {} });
      const magic01 = bufferMagic01(settlement);
      const economy01 = economyHealthScore(deriveCausalState(settlement).scores);
      expect(Number.isFinite(magic01) && magic01 >= 0 && magic01 <= 1).toBe(true);
      expect(Number.isFinite(economy01) && economy01 >= 0 && economy01 <= 1).toBe(true);
      corpus.push({ magic01, economy01, regime: regimeForEconomy(economy01) });
    });
    expectNoSeedFailures(failures, 'every generated settlement yields both buffer axes in range');

    // BOTH AXES MOVE. A constant axis would make every cell claim below meaningless,
    // and this is exactly how the first measurement of this corpus went wrong: with the
    // magic dial left at its default every settlement read the same middle band.
    expect(new Set(corpus.map((row) => row.magic01)).size).toBeGreaterThan(1);
    expect(new Set(corpus.map((row) => row.regime)).size).toBeGreaterThan(1);

    // THE CELL THE DESIGN NAMES: high magic together with a genuinely funded regime.
    const highMagicHighEconomy = corpus.filter(
      (row) => row.magic01 >= 0.66 && row.regime !== REGIME_SUBSISTENCE,
    );
    expect(highMagicHighEconomy.length).toBeGreaterThan(0);
    // And its top rung, which is where the gate is worth the most.
    expect(corpus.filter((row) => row.magic01 >= 0.66 && row.regime === 'patronized').length)
      .toBeGreaterThan(0);

    // A MEASURED FACT, PINNED SO NOBODY LATER WRITES A VACUOUS CONJUNCTION ON TOP OF IT:
    // the INDUSTRIAL rung is not reachable at genesis. Across 280 generated settlements
    // the economy reading tops out around 0.67, well below the 0.84 entry threshold, so
    // industrial magic is something a settlement GROWS into over played years and never
    // something it is born with. A future pin that asserted an industrial cell in a
    // generated corpus would be green only by accident of a tuning change.
    const topEconomy = Math.max(...corpus.map((row) => row.economy01));
    expect(topEconomy).toBeLessThan(0.84);
    expect(corpus.filter((row) => row.regime === REGIME_INDUSTRIAL).length).toBe(0);
  });

  it('7. THE GATE IS K2\'s: the regime moves the mitigation, and K3 derives no gate', () => {
    const industrial = runStrike({ lit: true, regime: REGIME_INDUSTRIAL });
    const subsistence = runStrike({ lit: true, regime: REGIME_SUBSISTENCE });
    // Both receipts must exist before either is read, or a missing relief block would
    // surface as a TypeError rather than as the failed comparison this pin is about.
    expect(industrial.strike?.relief).toBeTruthy();
    expect(subsistence.strike?.relief).toBeTruthy();
    const top = Number(/** @type {Record<string, number>} */ (industrial.strike.relief).mitigation);
    const base = Number(/** @type {Record<string, number>} */ (subsistence.strike.relief).mitigation);

    // Same settlement, same magic, same economy reading, same seed: only the REGIME
    // differs, so a difference here can only have come through K2's gate.
    expect(top).toBeGreaterThan(base);
    // anchored: the base run still mitigated something, so the comparison is between two live readings
    expect(base).toBeGreaterThan(0);

    // AND STRUCTURALLY (law 3, ONE GATE FORMULA): neither K3 file contains a gate
    // derivation of its own. The scan is over the source rather than the behaviour
    // because a second gate would most likely appear as a helpful local fallback that
    // agreed with K2 on the day it was written and drifted afterwards.
    for (const file of ['magicBufferModel.js', 'magicBufferApply.js']) {
      const source = readFileSync(join(ROOT, 'src/domain/worldPulse', file), 'utf8');
      const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      // The liveness anchor comes FIRST here: comment-stripping is exactly the step that
      // could hand the two negatives below an empty string to be vacuously true about.
      expect(code).toMatch(/export function|export const/);
      expect(code).toMatch(/clamp01/);
      // anchored: the two assertions above prove the stripped source still holds this file's live code, so an absent match is a real absence
      expect(code, `${file} must not restate the regime thresholds`).not.toMatch(/MAGIC_REGIME_TUNING/);
      // anchored: same stripped-source liveness anchors as the assertion above
      expect(code, `${file} must not name a regime word`).not.toMatch(/'(subsistence|funded|patronized|industrial)'/);
    }
  });

  it('declares its ledger key on the certification row it shares', () => {
    const row = WAVE_SUBSYSTEM_ROWS.find((entry) => entry.rule === 'magicEconomyEnabled');
    expect(row).toBeTruthy();
    expect(row?.aliveness.stateKeys).toContain(`spatialLedgers.${MAGIC_BUFFER_LEDGER}`);
    expect(row?.module).toContain('magicBufferApply.js');
    // The row's claim is only honest if a lit run actually materializes the key.
    const lit = runStrike({ lit: true });
    expect(readMagicBufferLedger(lit.result.worldState)).toBeTruthy();
  });
});
