/**
 * legitimacyUpheavalDormancy.byteIdentity.test.js — W-SEAT SEAT-2b's CONSTITUTIONAL PIN.
 *
 * `legitimacyUpheavalEnabled` is VIRTUAL — absent from DEFAULT_SIMULATION_RULES and from
 * every preset spread — so a world that never lights it must be BYTE-IDENTICAL to a world
 * built before the sensitivity table existed. A key is a byte, and THE PROMISE is that a
 * seed is a starting world forever.
 *
 * ── WHAT THIS FLAG LIGHTS, AND WHY THAT SHAPES THE FILE ──────────────────────
 * It lights no layer and writes no state. It changes a PROBABILITY MULTIPLIER on three
 * spawn gates that already exist, which means its lit difference is a stressor that is or
 * is not born on a given tick — and, downstream of that, a different roll consumed from
 * the same stream. So the honest comparator is the WHOLE composed world over many ticks,
 * not the gate's return value: a gate arm can be pinned in a unit test (and is, in
 * legitimacyUpheaval.test.js) without saying anything about whether the pulse moved.
 *
 * ⛔ NO NORMALIZER (design A1.19). Every arm compares RAW `JSON.stringify`; normalising
 * would launder the very bytes this bar exists to compare. Every comparison is paired with
 * an ANTI-VACUITY arm proving the same instrument CAN see a difference — this program has
 * measured that a dormancy instrument can pass by comparing nothing.
 *
 * ── WHAT THIS FILE CANNOT PROVE, SAID PLAINLY ────────────────────────────────
 * The honest comparator for "the tip did not move the dark path" is BASE-dormant vs
 * TIP-dormant across two worktrees, and a test file runs against its own tree only.
 * Everything expressible in one tree is pinned here; the cross-worktree half is OWED AT
 * THE LANDING ACT, exactly as SEAT-1's and SEAT-2a's were.
 */
import { describe, expect, it } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-02-02T00:00:00.000Z';
const SEAT = 'a';
const NEIGHBOUR = 'b';

/**
 * Two settlements, and the first is put in open legitimacy crisis with a strong military
 * challenger and NO occupier — so every precondition of the coup and rebellion gates except
 * the sensitivity is satisfied and the flag is the only thing left that can decide. An
 * instrument that cannot reach the branch cannot prove anything about it.
 *
 * The governing seat is `government` on purpose: that archetype's DECLINE multiplier is the
 * largest in the table, so the lit run has the best chance of visibly diverging — an
 * anti-vacuity arm is only as good as the cell it drives.
 * @param {Record<string, unknown>} [rulesPatch]
 */
function makeFixture(rulesPatch = {}) {
  const settlement = (/** @type {string} */ name, /** @type {string} */ tier, /** @type {any} */ power) => ({
    name,
    tier,
    population: tier === 'city' ? 14000 : 1400,
    config: { tradeRouteAccess: 'road', terrainType: 'plains' },
    institutions: [{ name: 'Granary', status: 'active' }],
    economicState: {
      primaryExports: [],
      primaryImports: [],
      prosperity: tier === 'city' ? 'Moderate' : 'Struggling',
      incomeSources: [{ source: 'Agricultural Rents', percentage: 60, desc: 'rents' }],
      foodSecurity: {
        dailyNeed: 2800, dailyProduction: 2100, surplusPct: 0, deficitPct: 25,
        storageMonths: 0.4, importDependency: 0.6, resilienceScore: 22,
      },
    },
    powerStructure: power,
    npcs: [],
    activeConditions: [],
  });
  const saves = [
    {
      id: SEAT,
      name: 'Ashford',
      phase: 'canon',
      settlement: settlement('Ashford', 'town', {
        publicLegitimacy: { score: 34, label: 'Contested', govMultiplier: 0.8 },
        governingName: 'Town Council',
        government: 'Town Council',
        factions: [
          { faction: 'Town Council', category: 'government', power: 22, isGoverning: true },
          { faction: 'Ashford Garrison', category: 'military', power: 58 },
          { faction: 'Merchant Guilds', category: 'merchant', power: 31 },
        ],
        conflicts: [],
      }),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
    {
      id: NEIGHBOUR,
      name: 'Bleakstone',
      phase: 'canon',
      settlement: settlement('Bleakstone', 'city', {
        publicLegitimacy: { score: 62, label: 'Approved', govMultiplier: 1.15 },
        governingName: 'City Council',
        government: 'City Council',
        factions: [
          { faction: 'City Council', category: 'government', power: 46, isGoverning: true },
          { faction: 'Bleakstone Legion', category: 'military', power: 38 },
        ],
        conflicts: [],
      }),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
  ];
  const campaign = {
    id: 'd4-attempt-dormancy',
    name: 'D4 Attempt Dormancy',
    settlementIds: [SEAT, NEIGHBOUR],
    worldState: {
      rngSeed: 'd4-attempt-dormancy-seed',
      tick: 0,
      calendar: { elapsedWeeks: 12, elapsedMonths: (12 * 3) / 13, month: 3, year: 1, season: 'spring' },
      simulationRules: { stressorsEnabled: true, ...rulesPatch },
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.a.b', from: NEIGHBOUR, to: SEAT, relationshipType: 'trade_partner' }],
    }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  return { campaign, saves };
}

/** Run N weekly ticks, threading state, and return the composed final state. */
function run(/** @type {Record<string, unknown>} */ rulesPatch, ticks = 12) {
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
 * ⚠ A virtual key means a campaign writing `{ legitimacyUpheavalEnabled: false }` carries a
 * byte a campaign writing `{}` does not, and the normalizer persists it. That difference is
 * not a leak; it IS the reason the key is virtual. This asks the honest question — "does
 * lighting-or-not-lighting it move THE WORLD" — and the arm below pins that the rules
 * object is the only thing that moved, so setting it aside can never hide a real difference.
 * @param {{ worldState: any, settlements: unknown, wizardNews: unknown }} composed
 */
function worldWithoutRules(composed) {
  const { simulationRules, ...worldState } = composed.worldState;
  return { worldState, settlements: composed.settlements, wizardNews: composed.wizardNews };
}

describe('legitimacyUpheavalEnabled — raw-byte dormancy', () => {
  it('a world that never names the key is byte-identical to one that names it FALSE', () => {
    const absent = run({});
    const explicitFalse = run({ legitimacyUpheavalEnabled: false });
    expect(JSON.stringify(worldWithoutRules(absent))).toBe(JSON.stringify(worldWithoutRules(explicitFalse)));
  });

  it('and the rules object is the ONLY thing that differs, so setting it aside hides nothing', () => {
    const absent = run({});
    const explicitFalse = run({ legitimacyUpheavalEnabled: false });
    // anchored: the persisted false key IS the virtual-key byte, and the arm above proves
    // everything else matched — so this negative cannot go vacuous, it is the complement.
    expect(JSON.stringify(absent.worldState.simulationRules))
      .not.toBe(JSON.stringify(explicitFalse.worldState.simulationRules));
  });

  it('every truthy NON-TRUE value lights nothing — the strict `=== true` read', () => {
    const absent = JSON.stringify(worldWithoutRules(run({})));
    for (const truthy of ['true', 1, {}, [], 'yes']) {
      expect(
        JSON.stringify(worldWithoutRules(run({ legitimacyUpheavalEnabled: truthy }))),
        `truthy ${JSON.stringify(truthy)} lit the layer`,
      ).toBe(absent);
    }
  });

  it('THE KEY WRITES NOTHING ANYWHERE, lit or dark — the layer owns no state', () => {
    // The certification row claims zero stateKeys. This is that claim, measured: no key
    // whose name mentions the layer appears in the serialized world in EITHER arm.
    for (const patch of [{}, { legitimacyUpheavalEnabled: true }]) {
      // ⚠ THE RULES OBJECT IS SET ASIDE HERE AND THAT IS THE POINT OF THE ARM, not a
      // loophole: the FLAG itself is a rules byte by construction and its presence there is
      // the whole reason the key is virtual. The question this asks is whether the LAYER
      // writes anything — a ledger, a field, an id — anywhere in the world it governs.
      // ⛔ AND THE FIXTURE'S OWN NAMES ARE KEPT CLEAR OF THE SCANNED TOKENS. The first draft
      // seeded this world with `legitimacy-upheaval-dormancy-seed`, and the seed is
      // serialized into `worldState.rngSeed` — so the scan matched the fixture's own name and
      // reddened against nothing. That is the recorded unscoped-scanner hazard (SEAT-1's
      // `posture` key-path scan hit the same class), and the cure is the same one: a scanner
      // that can match its own harness proves nothing about the layer.
      const serialized = JSON.stringify(worldWithoutRules(run(patch)));
      // anchored: the same string is asserted non-empty and world-shaped by the arms above,
      // so an empty or malformed run cannot make this negative pass by accident.
      expect(serialized.length).toBeGreaterThan(1000);
      // The two negatives below are each anchored ON THEIR OWN LINE, because the walker reads
      // the assertion line or the ONE line above it and a paragraph four lines up is a
      // rationale nobody's tooling can see. The anchor itself is the positive two lines down:
      // the same string must still contain the fixture's own settlement, so a run that
      // produced nothing cannot pass these two by absence.
      // anchored: paired with the world-size assertion above and the Ashford assertion below
      expect(serialized).not.toContain('upheaval');
      // anchored: paired with the world-size assertion above and the Ashford assertion below
      expect(serialized).not.toContain('sensitivity');
      expect(serialized).toContain('Ashford');
    }
  });

  it('ANTI-VACUITY: the same comparator SEES the lit run diverge', () => {
    // Without this arm every green above could mean the instrument compared nothing. The
    // lit run must differ from the dark one somewhere in the composed world — a different
    // spawn roll, a different stressor, a different downstream draw.
    const dark = JSON.stringify(worldWithoutRules(run({})));
    const lit = JSON.stringify(worldWithoutRules(run({ legitimacyUpheavalEnabled: true })));
    expect(lit).not.toBe(dark);
  });
});
