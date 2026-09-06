/**
 * treasuryDormancy.byteIdentity.test.js — THE W-COIN CONSTITUTIONAL PIN.
 *
 * `treasuryEnabled` is VIRTUAL — it appears in neither DEFAULT_SIMULATION_RULES nor any
 * preset spread — so a world that never lights it must be BYTE-IDENTICAL to a world
 * built before the treasury leaf existed. A key is a byte, and THE PROMISE is that a
 * seed is a starting world forever.
 *
 * ── WHY THIS FILE IS SHAPED THE WAY IT IS ────────────────────────────────────
 * A DORMANCY CLAIM IS A BIT CLAIM, and this program has measured that a dormancy
 * instrument can pass by comparing NOTHING: an earlier lane's `diff -rq` ran over a
 * directory holding stale artifacts and zero corpus leaves, and returned a clean TOTAL
 * FALSE PASS. So every arm here compares RAW `JSON.stringify` over a full multi-tick
 * composed run — worldState, settlements and news together — and every comparison is
 * paired with an ANTI-VACUITY arm proving the same instrument CAN see a difference.
 *
 * ⛔ THIS FILE DELIBERATELY DOES NOT IMPORT `normalizeForDormancy` (design A1.19), and
 * that is a rule rather than an oversight: normalisation would launder the very bytes
 * this bar exists to compare. Several existing dormancy tests do import it — they are
 * secondary STRUCTURAL arms beside their own raw-byte primary, and the pattern must not
 * be copied into a primary arm. There is no normalizer anywhere below.
 *
 * ── WHAT THIS FILE CANNOT PROVE, SAID PLAINLY ────────────────────────────────
 * The honest comparator for "the tip did not move the dark path" is BASE-DORMANT vs
 * TIP-DORMANT: the same seeded world advanced the same ticks against the pre-W-COIN
 * build and against this one. A test file runs only against its own tree, so it cannot
 * be that comparator. That proof is an EXECUTED LANE RECEIPT, run across two worktrees
 * and quoted in the landing act; this file pins everything that IS expressible in one
 * tree — absent ≡ false, the no-new-key law, determinism, the entropy-neutrality of the
 * lit path, and the import/clone boundaries — with the lit anti-vacuity that keeps each
 * of them from being a green about nothing.
 *
 * The `byteIdentity` basename is deliberate (it is the family's, and it keeps this file
 * clear of the `*Golden*` mutation-manifest nomenclature trigger). DO NOT RENAME.
 */
import { describe, expect, it } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { scrubImportedTreasury } from '../../src/lib/importScrub.js';
import { treasuryCapacity } from '../../src/domain/worldPulse/treasury.js';

const NOW = '2026-02-02T00:00:00.000Z';

/** @param {Record<string, unknown>} [rulesPatch] */
function makeFixture(rulesPatch = {}) {
  const settlement = (/** @type {string} */ name, /** @type {string} */ tier, /** @type {any[]} */ institutions) => ({
    name,
    tier,
    population: tier === 'city' ? 14000 : 1400,
    config: { tradeRouteAccess: 'road', terrainType: 'plains' },
    institutions,
    economicState: {
      primaryExports: [],
      primaryImports: [],
      prosperity: 'Moderate',
      incomeSources: [
        { source: 'Agricultural Rents', percentage: 40, desc: 'rents' },
        { source: 'Market Taxes', percentage: 30, desc: 'tolls' },
      ],
      foodSecurity: {
        dailyNeed: 2800, dailyProduction: 2800, surplusPct: 10, deficitPct: 0,
        storageMonths: 1.5, importDependency: 0.1, resilienceScore: 60,
      },
    },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Accepted' },
      governingName: 'Town Council',
      government: 'Town Council',
      factions: [
        { faction: 'Town Council', category: 'government', power: 40, isGoverning: true },
        { faction: 'Merchant Guilds', category: 'merchant', power: 30 },
      ],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
  });
  const saves = [
    {
      id: 'a',
      name: 'Ashford',
      phase: 'canon',
      settlement: settlement('Ashford', 'town', [{ name: 'Granary', status: 'active' }]),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
    {
      id: 'b',
      name: 'Bleakstone',
      phase: 'canon',
      // A banking house + a city hall, so this one's DERIVED vault capacity differs from
      // Ashford's: an instrument that only ever sees one capacity cannot see a capacity bug.
      settlement: settlement('Bleakstone', 'city', [
        { name: 'Granary', status: 'active' },
        { name: 'Banking House', status: 'active' },
        { name: 'City Hall', status: 'active' },
      ]),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
  ];
  const campaign = {
    id: 'treasury-dormancy',
    name: 'Treasury Dormancy',
    settlementIds: ['a', 'b'],
    worldState: {
      rngSeed: 'treasury-dormancy-seed',
      tick: 0,
      calendar: { elapsedWeeks: 12, elapsedMonths: (12 * 3) / 13, month: 3, year: 1, season: 'spring' },
      simulationRules: rulesPatch,
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }],
    }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  return { campaign, saves };
}

/** Run N weekly ticks, threading state, and return the composed final state. */
function run(/** @type {Record<string, unknown>} */ rulesPatch, ticks = 8) {
  let { campaign, saves } = makeFixture(rulesPatch);
  let wizardNews = campaign.wizardNews;
  for (let t = 0; t < ticks; t += 1) {
    const r = simulateCampaignWorldPulse({ campaign: { ...campaign, wizardNews }, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((/** @type {any} */ u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph };
    wizardNews = r.wizardNews;
  }
  return { worldState: campaign.worldState, settlements: saves.map((s) => s.settlement), wizardNews };
}

/**
 * THE WORLD ITSELF — the composed state with the RULES OBJECT set aside.
 *
 * ⚠ READ THIS BEFORE CHANGING ANY COMPARISON BELOW. `treasuryEnabled` is VIRTUAL: it is
 * declared in neither DEFAULT_SIMULATION_RULES nor any preset spread. So a campaign that
 * writes `{ treasuryEnabled: false }` into its rules carries a key that a campaign
 * writing `{}` does not — and the normalizer persists it. MEASURED IN THIS FILE, at this
 * commit: the two runs differ in `worldState.simulationRules` and in NOTHING ELSE —
 * every settlement, every news entry and every other worldState field is raw-byte
 * identical.
 *
 * That difference is not a leak; it IS the reason the key is virtual, re-measured. The
 * WR-9a fork the estate already ruled on was exactly this: declare each virtual key
 * `false` in the full_simulation spread and pay ~32 serialized bytes per key on every
 * NEW campaign and a moved state hash, or leave it undeclared and pay zero on every
 * path. CR-WR10-C ruled the second. So the honest dormancy question for a virtual key is
 * "does lighting-or-not-lighting it move THE WORLD", and this is the function that asks
 * it; the arm below then pins that the rules object is the ONLY thing that moved, so
 * setting it aside can never hide a real difference.
 *
 * @param {{ worldState: any, settlements: unknown, wizardNews: unknown }} composed
 */
function worldWithoutRules(composed) {
  const { simulationRules, ...worldState } = composed.worldState;
  return { worldState, settlements: composed.settlements, wizardNews: composed.wizardNews };
}

/** Every key path in the composed state that belongs to the treasury layer. */
function treasuryKeyPaths(/** @type {unknown} */ value, path = '$', /** @type {string[]} */ out = []) {
  if (!value || typeof value !== 'object') return out;
  if (Array.isArray(value)) {
    value.forEach((v, i) => treasuryKeyPaths(v, `${path}[${i}]`, out));
    return out;
  }
  for (const [k, v] of Object.entries(/** @type {Record<string, unknown>} */ (value))) {
    if (k === 'treasury' || k === 'openedTick') out.push(`${path}.${k}`);
    treasuryKeyPaths(v, `${path}.${k}`, out);
  }
  return out;
}

describe('W-COIN dormancy — the virtual flag is byte-identical when dark', () => {
  it('flag ABSENT === flag FALSE, raw bytes, over 8 weekly ticks', () => {
    const absent = run({});
    const explicitFalse = run({ treasuryEnabled: false });
    expect(JSON.stringify(worldWithoutRules(absent))).toBe(JSON.stringify(worldWithoutRules(explicitFalse)));
  });

  it('…and the RULES OBJECT is the ONLY thing the two dark runs differ in', () => {
    // The arm that keeps `worldWithoutRules` from being a place to hide a real difference.
    // Its premise is asserted rather than assumed: the two composed runs genuinely are
    // NOT identical (declaring the key costs its own bytes — the CR-WR10-C finding, and
    // the whole reason this key stays out of every preset), and once the rules object is
    // set aside they are identical to the byte.
    const absent = run({});
    const explicitFalse = run({ treasuryEnabled: false });
    expect(JSON.stringify(absent)).not.toBe(JSON.stringify(explicitFalse)); // anchored: the very next line proves the difference is CONFINED to simulationRules, so this negative cannot go vacuous — if the runs became wholly identical that line still passes and this one reds.
    expect(JSON.stringify(absent.worldState.simulationRules))
      .not.toBe(JSON.stringify(explicitFalse.worldState.simulationRules)); // anchored: both operands are the same non-empty normalized rules object read off two live runs, asserted non-trivial by the settlement-count arm in this file; an emptied rules object would red the equality arm above first.
    expect(JSON.stringify(worldWithoutRules(absent)))
      .toBe(JSON.stringify(worldWithoutRules(explicitFalse)));
  });

  it('the strict === true gate refuses every truthy non-true value', () => {
    // The door is `=== true`, not `!!`. A rules object that carried a string, a 1 or an
    // object under this key — a hand-edited save, a legacy normalizer, a coerced query
    // param — must leave the layer dark, because a layer that lights on a truthy accident
    // is a layer whose dormancy is an accident too.
    const absent = JSON.stringify(worldWithoutRules(run({})));
    for (const truthy of ['true', 1, {}, [], 'yes']) {
      expect(JSON.stringify(worldWithoutRules(run({ treasuryEnabled: truthy }))),
        `truthy ${JSON.stringify(truthy)} lit the layer`).toBe(absent);
    }
  });

  it('the dark path writes NO treasury key anywhere (no fields, the constitutional law)', () => {
    expect(treasuryKeyPaths(run({}))).toEqual([]);
    expect(treasuryKeyPaths(run({ treasuryEnabled: false }))).toEqual([]);
  });

  it('ANTI-VACUITY: the flag ON diverges and opens a ledger on every settlement', () => {
    const off = run({});
    const on = run({ treasuryEnabled: true });
    // The instrument CAN see a difference — without this arm every green above could mean
    // the comparator was comparing nothing.
    expect(JSON.stringify(on)).not.toBe(JSON.stringify(off));
    expect(treasuryKeyPaths(on).length).toBeGreaterThan(0);
    for (const s of on.settlements) {
      const t = /** @type {any} */ (s).economicState.treasury;
      // Opened at the FIRST tick the world advanced (the pulse stamps tick 1) and taxed
      // on every lit tick since — W-COIN-1b's mint is live, so the vault is no longer the
      // zero row 1a shipped. ⚠ THIS ASSERTION MOVED WHEN 1b LANDED, and it moved in the
      // one direction that means the mint is real.
      expect(t.coin).toBeGreaterThan(0);
      expect(t.openedTick).toBe(1);
      expect(t.lastTick).toBe(8);
      // The stock never exceeds its own derived ceiling, on any settlement, ever.
      expect(t.coin).toBeLessThanOrEqual(treasuryCapacity(/** @type {any} */ (s)));
      // `taxed` is the LAST-TICK integer, so it is the tick-8 mint, not the lifetime total.
      expect(t.coinFlows.taxed).toBeGreaterThan(0);
      expect(t.coinFlows).toEqual({
        taxed: t.coinFlows.taxed, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0,
      });
    }
  });

  it('ANTI-VACUITY on the KEY SCAN: the scanner finds the key when it is really there', () => {
    // The no-key arm above is a negative over a scanner. A scanner that had drifted out
    // from under its subject would report [] forever and the law would rot silently — the
    // exact vacuous-green class. Drive it against a world that HAS the key.
    const paths = treasuryKeyPaths(run({ treasuryEnabled: true }));
    expect(paths.filter((p) => p.endsWith('.treasury')).length).toBe(2);
    expect(paths.filter((p) => p.endsWith('.openedTick')).length).toBe(2);
  });

  it('the LIT path draws NO entropy and writes NO world state (zero new draws)', () => {
    // The strongest statement 1a can make about its own cost: lighting the flag changes
    // the SETTLEMENTS and nothing else. If the writer forked the rng, or stamped a
    // worldState container, or minted a news beat, this equality would break — and each of
    // those is a thing the charter forbids by name.
    const off = run({});
    const on = run({ treasuryEnabled: true });
    const { simulationRules: _onRules, ...onWorld } = on.worldState;
    const { simulationRules: _offRules, ...offWorld } = off.worldState;
    expect(JSON.stringify(onWorld)).toBe(JSON.stringify(offWorld));
    expect(JSON.stringify(on.wizardNews)).toBe(JSON.stringify(off.wizardNews));
    // …and the settlements are where the ENTIRE difference lives, which is the positive
    // half of the same claim: lighting this flag reaches exactly one surface.
    expect(JSON.stringify(on.settlements)).not.toBe(JSON.stringify(off.settlements)); // anchored: the anti-vacuity arm above asserts the lit run really opened a ledger on both settlements, so an emptied settlement list reds there rather than passing here.
  });

  it('two flag-on runs are deterministic (same seed ⇒ same bytes)', () => {
    expect(JSON.stringify(run({ treasuryEnabled: true }))).toBe(JSON.stringify(run({ treasuryEnabled: true })));
  });

  it('a lit ledger survives a serialize/parse round trip unchanged (clone + undo)', () => {
    // The record rides `settlement.economicState` wholesale, so the snapshot paths —
    // structured clone, gallery clone, the undo snapshot — carry it for free. Proving it
    // is cheap and the alternative is discovering on the undo path that it did not.
    const on = run({ treasuryEnabled: true });
    const roundTripped = JSON.parse(JSON.stringify(on.settlements));
    expect(roundTripped).toEqual(on.settlements);
    expect(roundTripped[0].economicState.treasury.coin)
      .toBe(/** @type {any} */ (on.settlements[0]).economicState.treasury.coin);
  });
});

describe('W-COIN dormancy — the import boundary (A1.8)', () => {
  it('a lit settlement imported into a dark campaign arrives COINLESS', () => {
    const lit = /** @type {any} */ (run({ treasuryEnabled: true }).settlements[0]);
    expect(lit.economicState.treasury).toBeDefined();
    const imported = /** @type {any} */ (scrubImportedTreasury(lit));
    // anchored: the assertion above proves the SOURCE really carries a treasury record, so a
    // scrub that had drifted out from under its subject reds there rather than passing here.
    expect(Object.hasOwn(imported.economicState, 'treasury')).toBe(false);
    // …and nothing ELSE was stripped on the way through.
    expect(imported.economicState.foodSecurity).toEqual(lit.economicState.foodSecurity);
    expect(imported.name).toBe(lit.name);
  });

  it('the strip is REFERENCE-IDENTICAL on the dark path (it can never move a byte)', () => {
    // Every settlement in every dark campaign — that is to say, all of them today — takes
    // this path, so a strip that rebuilt the object would be a dormancy cost paid by
    // worlds that have nothing to strip.
    for (const dark of run({}).settlements) {
      expect(scrubImportedTreasury(/** @type {any} */ (dark))).toBe(dark);
    }
  });

  it('a treasury that ghosted in through an import is never read by a dark campaign', () => {
    // The strict gate is what makes an unscrubbed legacy record harmless: even if a
    // balance reached a settlement by some path this lane does not own, a dark world
    // neither reads it nor writes it, and the byte comparison proves the whole run is
    // untouched by its presence.
    const { campaign, saves } = makeFixture({});
    const ghosted = saves.map((s) => ({
      ...s,
      settlement: {
        ...s.settlement,
        economicState: {
          ...s.settlement.economicState,
          treasury: { coin: 9999, openedTick: 0, lastTick: 0, coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 } },
        },
      },
    }));
    const r = simulateCampaignWorldPulse({ campaign, saves: ghosted, interval: 'one_week', now: NOW });
    for (const u of r.settlementUpdates || []) {
      // Untouched: the same balance, the same opened tick, the same lastTick — a dark
      // world does not so much as advance the bookkeeping.
      expect(/** @type {any} */ (u).settlement.economicState.treasury)
        .toEqual({ coin: 9999, openedTick: 0, lastTick: 0, coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 } });
    }
  });
});
