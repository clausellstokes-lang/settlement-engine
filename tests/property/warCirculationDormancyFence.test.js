/**
 * warCirculationDormancyFence.test.js — the WC-0E two-flag dormancy fence for
 * `warCirculationEnabled` and `contributionLedgerEnabled` (LGT-P13-FENCES, L-HOMES car 3).
 *
 * ⭐⭐ ONE FILE FOR TWO KEYS, BECAUSE THEY SHARE ONE GATE. `contributionLedgerActive`
 * (`worldPulse/contributionLedger.js`) reads BOTH by name with the strict `=== true` idiom
 * and ANDs them: `warCirculationEnabled` gates the war-circulation LAYER,
 * `contributionLedgerEnabled` gates this ledger within it. Splitting the fence would give
 * each key half a conjunction and neither the cell where the other is dark — the shape in
 * which a deleted guard hides behind a surviving one.
 *
 * ⛔ THE HONEST DORMANCY CLAIM FOR THIS LANE IS UNUSUAL AND IS STATED RATHER THAN DRESSED
 * UP. The wave landed record shapes, a fail-closed normalizer and this gate, and NO WRITER:
 * the module calls `setSpatialLedger` zero times, and — measured in fence 3 below — nothing
 * in `src/` imports it at all. So the lit world is byte-identical to the dark one, and the
 * fence's job is to pin THAT, not to invent a difference. A fence that manufactured one
 * would be measuring some other subsystem.
 *
 * ⭐ WHICH MAKES FENCE 2 A HANDOFF TRIPWIRE, deliberately, on the estate's own GR-0 idiom:
 * the day WC-1 lands the writer — troops-lent credit at the levy edge, supplies credit at
 * shipment arrival — the lit run stops being byte-identical and this file REDS. That red is
 * the signal that the lane acquired a world, and the fence is then re-cut around the writer.
 * It is not a test to soften.
 *
 * ⛔ THE DARK HALF AND ITS LIT-MUTANT CONTROL, in every fence. "Nothing happened" is
 * trivially true of a harness that does nothing, so fence 2's identity claim is anchored by
 * a SIBLING flag driven through the identical harness and shown to move the world — the
 * comparator is proven able to see a difference before it is trusted to report none.
 *
 * ⛔ NO 64-HEX LITERAL IS AUTHORED HERE. Every hash is computed in-file from two live runs.
 * `tests/lint/goldenFreeze.walker.test.js` treats a pinned 64-hex literal under
 * `tests/property/` as a recorded corpus constant owing a `.golden-freeze-register.json`
 * row, and the register is UNFROZEN — no measured field may carry a value until the freeze
 * act signs it.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { contributionLedgerActive } from '../../src/domain/worldPulse/contributionLedger.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const NOW = '2026-02-02T00:00:00.000Z';
const LEAF = 'src/domain/worldPulse/contributionLedger.js';

/** @param {unknown} value */
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// ── THE GATE-POLARITY CENSUS ──────────────────────────────────────────────────────────

/**
 * Every value a rules key can carry that is NOT `true`. `absent` is the shape every campaign
 * that never lights these keys actually holds; `1` and `'true'` are the truthy-non-true
 * probes the strict read exists to refuse — the spellings a hand-edited save, a legacy
 * normalizer or a coerced query param produces.
 * @type {ReadonlyArray<readonly [string, Record<string, unknown>]>}
 */
const DARK_VALUES = Object.freeze([
  ['absent', {}],
  ['false', { value: false }],
  ['one', { value: 1 }],
  ['string_true', { value: 'true' }],
  ['object', { value: {} }],
]);

/** @param {string} key @param {Record<string, unknown>} cell */
const spell = (key, cell) => ('value' in cell ? { [key]: cell.value } : {});

describe('WC-0E FENCE 1 — the two-flag gate-polarity census, with the lit mutant as control', () => {
  test('the LIT MUTANT: both keys true, spelled as literals, opens the gate', () => {
    // The control comes FIRST so no refusal below can pass because the gate is simply broken.
    // ⚠ Both keys are spelled as LITERALS rather than through a computed member: a computed
    // access attributes to no key, the same class the CQ5 gate census warns about one layer in.
    expect(contributionLedgerActive({ warCirculationEnabled: true, contributionLedgerEnabled: true }))
      .toBe(true);
  });

  test('every cell where either conjunct is not exactly true is DARK', () => {
    const cells = [];
    for (const [layerLabel, layer] of DARK_VALUES) {
      for (const [ledgerLabel, ledger] of DARK_VALUES) {
        cells.push([`layer=${layerLabel} ledger=${ledgerLabel}`, {
          ...spell('warCirculationEnabled', layer),
          ...spell('contributionLedgerEnabled', ledger),
        }]);
      }
      // The half-lit cells: one conjunct genuinely true, the other in every dark spelling.
      cells.push([`layer=${layerLabel} ledger=LIT`, {
        ...spell('warCirculationEnabled', layer), contributionLedgerEnabled: true,
      }]);
      cells.push([`layer=LIT ledger=${layerLabel}`, {
        warCirculationEnabled: true, ...spell('contributionLedgerEnabled', layer),
      }]);
    }
    // 5×5 grid + 2 half-lit rows per dark value: the census is non-empty by construction, and
    // this arm says the size out loud so a collapsed loop cannot pass as a green.
    expect(cells.length).toBe(DARK_VALUES.length * DARK_VALUES.length + DARK_VALUES.length * 2);
    for (const [label, rules] of cells) {
      expect(contributionLedgerActive(rules), `${label} lit the lane`).toBe(false);
    }
  });

  test('a missing or non-object rules bag is dark, never permissive', () => {
    for (const junk of [undefined, null, 0, '', 'true', [], [1], () => true]) {
      expect(contributionLedgerActive(/** @type {never} */ (junk)),
        `${JSON.stringify(String(junk))} lit the lane`).toBe(false);
    }
  });
});

// ── THE WORLD, AND WHAT LIGHTING THE LANE DOES TO IT ──────────────────────────────────

/** @param {string} name @param {string} tier */
function settlement(name, tier) {
  return {
    name,
    tier,
    population: tier === 'city' ? 14000 : 1400,
    config: { tradeRouteAccess: 'road', terrainType: 'plains' },
    institutions: [{ name: 'Granary', status: 'active' }],
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
  };
}

/** @param {Record<string, unknown>} rulesPatch */
function makeFixture(rulesPatch) {
  const saves = [
    {
      id: 'a', name: 'Ashford', phase: 'canon', settlement: settlement('Ashford', 'town'),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
    {
      id: 'b', name: 'Bleakstone', phase: 'canon', settlement: settlement('Bleakstone', 'city'),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
  ];
  const campaign = {
    id: 'wc0e-dormancy',
    name: 'War Circulation Dormancy',
    settlementIds: ['a', 'b'],
    worldState: {
      rngSeed: 'wc0e-dormancy-seed',
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

/** Run N weekly ticks through the REAL pulse, threading state, and compose the final world. */
function run(/** @type {Record<string, unknown>} */ rulesPatch, ticks = 6) {
  let { campaign, saves } = makeFixture(rulesPatch);
  let wizardNews = campaign.wizardNews;
  for (let t = 0; t < ticks; t += 1) {
    const r = simulateCampaignWorldPulse({
      campaign: { ...campaign, wizardNews }, saves, interval: 'one_week', now: NOW,
    });
    const updates = new Map((r.settlementUpdates || []).map((/** @type {any} */ u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph };
    wizardNews = r.wizardNews;
  }
  return { worldState: campaign.worldState, settlements: saves.map((s) => s.settlement), wizardNews };
}

/**
 * THE WORLD ITSELF, with the rules object set aside — the `treasuryDormancy.byteIdentity`
 * discipline, and for its reason. Both keys are VIRTUAL: a campaign that writes
 * `{ warCirculationEnabled: false }` carries a key a campaign writing `{}` does not, and the
 * normalizer persists it. That difference is not a leak, it IS why the keys are virtual
 * (CR-WR10-C's ruled fork). The honest question for a virtual key is whether lighting it
 * moves THE WORLD, and the arm below pins that the rules object is the only thing that moved.
 * @param {{ worldState: any, settlements: unknown, wizardNews: unknown }} composed
 */
function worldWithoutRules(composed) {
  const { simulationRules, ...worldState } = composed.worldState;
  return { worldState, settlements: composed.settlements, wizardNews: composed.wizardNews };
}

const DARK = Object.freeze({ warCirculationEnabled: false, contributionLedgerEnabled: false });
const LIT = Object.freeze({ warCirculationEnabled: true, contributionLedgerEnabled: true });

describe('WC-0E FENCE 2 — lighting the lane moves NO world byte, and the comparator can see', () => {
  test('the ANTI-VACUITY CONTROL first: the same harness DOES see a flag that writes', () => {
    // A sibling virtual key on the identical fixture, driven through the identical composer.
    // Without this the identity arm below would hold just as well over two crashed runs.
    const quiet = worldWithoutRules(run({}));
    const writing = worldWithoutRules(run({ treasuryEnabled: true }));
    expect(hash(writing) === hash(quiet),
      'a flag known to open a ledger on every settlement moved nothing — this harness is inert')
      .toBe(false);
  });

  test('BOTH KEYS LIT is byte-identical to both dark, over six weekly ticks', () => {
    // ⭐ THE HANDOFF TRIPWIRE. This is true because the lane has no writer; the day WC-1 lands
    // one, this arm REDS, and that red is the signal rather than a regression to soften.
    const dark = worldWithoutRules(run({ ...DARK }));
    const lit = worldWithoutRules(run({ ...LIT }));
    expect(hash(lit)).toBe(hash(dark));
    // …and the two HALF-LIT cells are the same world too, so neither key alone reaches a byte.
    expect(hash(worldWithoutRules(run({ warCirculationEnabled: true })))).toBe(hash(dark));
    expect(hash(worldWithoutRules(run({ contributionLedgerEnabled: true })))).toBe(hash(dark));
  });

  test('an ABSENT pair and an explicitly FALSE pair are the same world', () => {
    // The strict `=== true` gate's own claim, at world scale rather than at the predicate.
    expect(hash(worldWithoutRules(run({})))).toBe(hash(worldWithoutRules(run({ ...DARK }))));
  });
});

// ── WHY FENCE 2 HOLDS: THE LANE HAS NO CONSUMER ───────────────────────────────────────

/** @param {string} dir @param {string[]} out */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith('.js') || full.endsWith('.jsx')) out.push(full);
  }
  return out;
}

/** Files under `src/` carrying a real import edge to `basename`, by relative path. */
function importersOf(/** @type {string} */ basename) {
  const needle = new RegExp(`from\\s+['"][^'"]*/${basename}['"]`);
  return walk(join(ROOT, 'src'))
    .filter((full) => needle.test(readFileSync(full, 'utf8')))
    .map((full) => relative(ROOT, full))
    .sort();
}

describe('WC-0E FENCE 3 — the structural reason the lit world is the dark world', () => {
  test('the scanner is live: it finds the importers of a module that IS imported', () => {
    // GUARD-THE-GUARD. An emptied or mis-rooted scan would report "no importers" for every
    // module in the tree and make fence 3 a green about nothing.
    expect(importersOf('simulationRules.js').length).toBeGreaterThan(5);
  });

  test('no module in src/ imports the contribution ledger — the lane is unreachable', () => {
    expect(importersOf('contributionLedger.js')).toEqual([]);
    // And the leaf itself is where the two by-name gate reads live, so the keys are really
    // gated by this module and not by some other spelling elsewhere.
    const leaf = readFileSync(join(ROOT, LEAF), 'utf8');
    expect(leaf.includes('r.warCirculationEnabled === true')).toBe(true);
    expect(leaf.includes('r.contributionLedgerEnabled === true')).toBe(true);
  });

  test('the leaf writes no spatial ledger — the wave landed shapes, never a writer', () => {
    const leaf = readFileSync(join(ROOT, LEAF), 'utf8');
    expect(leaf.includes('setSpatialLedger(')).toBe(false);
    // GUARD-THE-GUARD, the other direction: the token this arm looks for really is the estate's
    // spelling, and a module that does write one is found by the same test.
    const writer = readFileSync(join(ROOT, 'src/domain/worldPulse/vengeanceLicense.js'), 'utf8');
    expect(writer.includes('setSpatialLedger(')).toBe(true);
  });
});

describe('WC-0E FENCE 4 — the dark claim survives the day the default lights', () => {
  test('every rules object in this file is built here, so no arm inherits a default', () => {
    // THE POINT OF THE CAR. When a preset writes either key, a fence resting on "the default
    // is dark" would silently begin measuring a lit world and go on passing. These constants
    // are literals in this file; the dark arms keep exercising darkness for as long as the
    // gate exists.
    expect(DARK).toEqual({ warCirculationEnabled: false, contributionLedgerEnabled: false });
    expect(LIT).toEqual({ warCirculationEnabled: true, contributionLedgerEnabled: true });
    expect(DARK_VALUES.map(([label]) => label))
      .toEqual(['absent', 'false', 'one', 'string_true', 'object']);
  });
});
