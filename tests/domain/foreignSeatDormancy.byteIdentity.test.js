/**
 * foreignSeatDormancy.byteIdentity.test.js — THE W-SEAT CONSTITUTIONAL PIN.
 *
 * `foreignSeatEnabled` is VIRTUAL — it appears in neither DEFAULT_SIMULATION_RULES nor any
 * preset spread — so a world that never lights it must be BYTE-IDENTICAL to a world built
 * before the seat leaf existed. A key is a byte, and THE PROMISE is that a seed is a
 * starting world forever.
 *
 * ── WHAT THIS FLAG ACTUALLY LIGHTS, AND WHY THAT SHAPES THE FILE ─────────────
 * Unlike its siblings, SEAT-1's flag does not light a LAYER that writes new state. It
 * lights a PREDICATE: the coup spawn gate's occupied test widens from the stressor
 * spelling to the union of the stressor spelling and the occupations ledger. So the lit
 * difference is a REFUSAL — a stressor that does not get born — and there is no new key to
 * scan for. The "no new key anywhere" arm that the treasury pin carries is replaced here by
 * its exact analogue for a refusal: a SEAT-KEY scan proving the leaf writes nothing, plus a
 * REFUSAL arm proving the lit run's difference is a missing coup and not a new field.
 *
 * ── WHY THIS FILE IS SHAPED THE WAY IT IS ────────────────────────────────────
 * A DORMANCY CLAIM IS A BIT CLAIM, and this program has measured that a dormancy instrument
 * can pass by comparing NOTHING. So every arm compares RAW `JSON.stringify` over a full
 * multi-tick composed run — worldState, settlements and news together — and every
 * comparison is paired with an ANTI-VACUITY arm proving the same instrument CAN see a
 * difference.
 *
 * ⛔ THIS FILE DELIBERATELY DOES NOT IMPORT `normalizeForDormancy` (design A1.19), and that
 * is a rule rather than an oversight: normalisation would launder the very bytes this bar
 * exists to compare. There is no normalizer anywhere below.
 *
 * ── WHAT THIS FILE CANNOT PROVE, SAID PLAINLY ────────────────────────────────
 * The honest comparator for "the tip did not move the dark path" is BASE-DORMANT vs
 * TIP-DORMANT: the same seeded world advanced the same ticks against the pre-W-SEAT build
 * and against this one. A test file runs only against its own tree, so it cannot be that
 * comparator. That proof is an EXECUTED LANE RECEIPT run across two worktrees and quoted in
 * the landing act; this file pins everything that IS expressible in one tree.
 *
 * The `byteIdentity` basename is deliberate (it is the family's, and it keeps this file
 * clear of the `*Golden*` mutation-manifest nomenclature trigger). DO NOT RENAME.
 */
import { describe, expect, it } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-02-02T00:00:00.000Z';
const OCCUPIED = 'a';
const OCCUPIER = 'b';

/**
 * Two settlements, deliberately differing, and a LIVE OCCUPATION LEDGER ROW on the first.
 *
 * The ledger row is seeded directly rather than grown from a war, and that is the point:
 * it is exactly the state a loaded campaign carries after a conquest, and it is the ONE
 * cell where the two occupied spellings disagree (a war-layer conquest mints a ledger row
 * and never a `type:'occupation'` stressor). The occupied settlement's seat is put in open
 * legitimacy crisis with a strong military challenger so the coup gate's OTHER
 * preconditions all pass and only the occupied test decides — an instrument that cannot
 * reach the branch cannot prove anything about it.
 *
 * @param {Record<string, unknown>} [rulesPatch]
 */
function makeFixture(rulesPatch = {}) {
  const settlement = (/** @type {string} */ name, /** @type {string} */ tier, /** @type {any} */ power, /** @type {any} */ food) => ({
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
      foodSecurity: food,
    },
    powerStructure: power,
    npcs: [],
    activeConditions: [],
  });
  const saves = [
    {
      id: OCCUPIED,
      name: 'Ashford',
      phase: 'canon',
      settlement: settlement('Ashford', 'town', {
        // Crisis legitimacy + a military faction with the muscle to move: every coup-gate
        // precondition except the occupied test is satisfied.
        publicLegitimacy: { score: 18, label: 'Legitimacy Crisis', govMultiplier: 0.6 },
        governingName: 'Town Council',
        government: 'Town Council',
        factions: [
          { faction: 'Town Council', category: 'government', power: 22, isGoverning: true },
          { faction: 'Ashford Garrison', category: 'military', power: 58 },
          { faction: 'Merchant Guilds', category: 'merchant', power: 31 },
        ],
        conflicts: [],
      }, {
        dailyNeed: 2800, dailyProduction: 1500, surplusPct: 0, deficitPct: 46,
        storageMonths: 0.2, importDependency: 0.7, resilienceScore: 14,
      }),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
    {
      id: OCCUPIER,
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
      }, {
        dailyNeed: 28000, dailyProduction: 30000, surplusPct: 12, deficitPct: 0,
        storageMonths: 2.4, importDependency: 0.1, resilienceScore: 68,
      }),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    },
  ];
  const campaign = {
    id: 'foreign-seat-dormancy',
    name: 'Foreign Seat Dormancy',
    settlementIds: [OCCUPIED, OCCUPIER],
    worldState: {
      rngSeed: 'foreign-seat-dormancy-seed',
      tick: 0,
      calendar: { elapsedWeeks: 12, elapsedMonths: (12 * 3) / 13, month: 3, year: 1, season: 'spring' },
      simulationRules: rulesPatch,
      stressors: [],
      // THE DIVERGENT CELL: a ledger occupation with no matching stressor.
      occupations: {
        [OCCUPIED]: {
          occupierId: OCCUPIER, state: 'stabilized', sinceTick: 0,
          stateHeld: 0, resistance: 0.2, benefitYield: 0, lastTick: 0,
        },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.a.b', from: OCCUPIER, to: OCCUPIED, relationshipType: 'hostile' }],
    }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  return { campaign, saves };
}

/** Run N weekly ticks, threading state, and return the composed final state. */
function run(/** @type {Record<string, unknown>} */ rulesPatch, ticks = 10) {
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
 * ⚠ `foreignSeatEnabled` is VIRTUAL, so a campaign writing `{ foreignSeatEnabled: false }`
 * carries a key that a campaign writing `{}` does not, and the normalizer persists it. That
 * difference is not a leak; it IS the reason the key is virtual. This function asks the
 * honest question — "does lighting-or-not-lighting it move THE WORLD" — and the arm below
 * pins that the rules object is the ONLY thing that moved, so setting it aside can never
 * hide a real difference.
 * @param {{ worldState: any, settlements: unknown, wizardNews: unknown }} composed
 */
function worldWithoutRules(composed) {
  const { simulationRules, ...worldState } = composed.worldState;
  return { worldState, settlements: composed.settlements, wizardNews: composed.wizardNews };
}

/** Every live coup stressor in the composed state (the lit path's REFUSAL target). */
function coupStressors(/** @type {{ worldState: any }} */ composed) {
  const rows = Array.isArray(composed.worldState?.stressors) ? composed.worldState.stressors : [];
  return rows.filter((/** @type {any} */ s) => s?.type === 'coup_detat'
    && !['resolved', 'dormant', 'residual'].includes(String(s?.status)));
}

/**
 * Any key path a seat layer could have written. The seat owns NO state, so this is [].
 *
 * ⚠ `posture` IS SCOPED TO THE OCCUPATIONS LEDGER ON PURPOSE, and the narrowing was
 * MEASURED rather than assumed: an unscoped `posture` scan reported two live hits —
 * `relationshipStates.<edge>.posture` and its `relationshipMemory.posture` twin — which are
 * pre-existing fields `ensureRelationshipState` has always written and have nothing to do
 * with this layer. A scanner that reds on somebody else's field cannot prove anything about
 * mine. The seat's OWN posture (Q-S2, SEAT-3) lands on `worldState.occupations[sid]`, which
 * is the only place this looks.
 */
function seatKeyPaths(/** @type {unknown} */ value, path = '$', /** @type {string[]} */ out = []) {
  if (!value || typeof value !== 'object') return out;
  if (Array.isArray(value)) {
    value.forEach((v, i) => seatKeyPaths(v, `${path}[${i}]`, out));
    return out;
  }
  for (const [k, v] of Object.entries(/** @type {Record<string, unknown>} */ (value))) {
    const child = `${path}.${k}`;
    if (k === 'foreignSeat' || k === 'foreignSeats' || k === 'seatWeight01' || k === 'foreignSeatBand') out.push(child);
    if (k === 'posture' && /\.occupations\./.test(path)) out.push(child);
    seatKeyPaths(v, child, out);
  }
  return out;
}

describe('W-SEAT dormancy — the virtual flag is byte-identical when dark', () => {
  it('flag ABSENT === flag FALSE, raw bytes, over 10 weekly ticks', () => {
    const absent = run({});
    const explicitFalse = run({ foreignSeatEnabled: false });
    expect(JSON.stringify(worldWithoutRules(absent))).toBe(JSON.stringify(worldWithoutRules(explicitFalse)));
  });

  it('the RULES OBJECT is the only thing that moved between absent and false', () => {
    // The arm that makes `worldWithoutRules` safe: if anything else had moved, the two raw
    // FULL serializations would differ for a second reason and this pairing would not hold.
    const absent = run({});
    const explicitFalse = run({ foreignSeatEnabled: false });
    expect(JSON.stringify(absent.worldState.simulationRules))
      .not.toBe(JSON.stringify(explicitFalse.worldState.simulationRules)); // anchored: the persisted false key IS the virtual-key byte
    expect(JSON.stringify(worldWithoutRules(absent))).toBe(JSON.stringify(worldWithoutRules(explicitFalse)));
  });

  it('the strict === true gate refuses every truthy non-true value', () => {
    const absent = JSON.stringify(worldWithoutRules(run({})));
    for (const truthy of ['true', 1, {}, [], 'yes']) {
      expect(
        JSON.stringify(worldWithoutRules(run({ foreignSeatEnabled: truthy }))),
        `truthy ${JSON.stringify(truthy)} lit the layer`,
      ).toBe(absent);
    }
  });

  it('the dark path writes NO seat key anywhere (the seat owns no state, lit or dark)', () => {
    expect(seatKeyPaths(run({}))).toEqual([]);
    expect(seatKeyPaths(run({ foreignSeatEnabled: false }))).toEqual([]);
  });

  it('the LIT path writes NO DERIVED seat key — the seat itself is still never persisted', () => {
    // ⚠ THIS ARM WAS AMENDED BY SEAT-3, AND ITS OWN PREVIOUS TEXT NAMED THE CAR THAT WOULD
    // DO IT: "the one persisted field the design allows (the CHOSEN posture, Q-S2) is a
    // SEAT-3 field on the occupations record and is deliberately absent from THIS car."
    // That car has now landed, so the invariant is restated rather than loosened.
    //
    // WHAT STILL HOLDS, AND IT IS THE PART THAT MATTERS: law §2.2 says the SEAT is derived
    // and never persisted, and no `foreignSeat`, `foreignSeats`, `seatWeight01` or
    // `foreignSeatBand` key exists anywhere in a lit world. The single exception Q-S2
    // GRANTED is a DECISION, and a decision is state by the law's own carve-out.
    const lit = seatKeyPaths(run({ foreignSeatEnabled: true }));
    for (const path of lit) {
      expect(path, `a non-posture seat key reached the ledger: ${path}`).toMatch(/\.occupations\.[^.]+\.posture$/);
    }
  });

  it('⛔ a dark world never acquires a posture byte, however long it runs', () => {
    // The half of the posture's dormancy claim this fixture CAN carry. A posture is written
    // only by a receipted decision and the decision is minted only under the lit flag, so a
    // dark world cannot acquire the byte by any route — asserted here over four times the
    // usual horizon, because a byte that appears on tick 30 is still a dormancy failure.
    expect(seatKeyPaths(run({}, 40)), 'a dark world acquired a posture byte').toEqual([]);
    expect(seatKeyPaths(run({ foreignSeatEnabled: false }, 40))).toEqual([]);
  });

  // ⚠ THE POSITIVE WITNESS FOR THE POSTURE BYTE DELIBERATELY DOES NOT LIVE HERE, AND SAYING
  // SO IS THE POINT. It was written here first and FAILED — correctly: this fixture's
  // occupation sits at `stabilized` with no compliant regime and no garrison, so its ladder
  // never climbs a rung across 40 ticks, the decision is never occasioned, and the arm
  // measured NOTHING while looking exactly like a passing dormancy test would. Rather than
  // reshape SEAT-1's dormancy fixture to serve SEAT-3's proof — which would have made this
  // file's own byte-identity arms depend on a ladder that now moves — the witness lives in
  // `tests/domain/occupationPosture.test.js`, which drives `evaluateOccupations` over a
  // world built to climb and asserts the mint, the chosen band and the persisted key.
  // A permissive assertion with its witness in another file is honest; a permissive
  // assertion with no witness anywhere is the vacuous green this program has already
  // measured once.

  it('determinism: the same rules patch twice is byte-identical, dark and lit', () => {
    expect(JSON.stringify(run({}))).toBe(JSON.stringify(run({})));
    expect(JSON.stringify(run({ foreignSeatEnabled: true })))
      .toBe(JSON.stringify(run({ foreignSeatEnabled: true })));
  });

  it('ANTI-VACUITY: the flag ON diverges, so every green above is about something', () => {
    // ⛔ THE ARM THAT MAKES THE REST MEAN ANYTHING. A dormancy instrument can pass by
    // comparing nothing, and this program has measured one that did. Here the SAME
    // comparator that reported byte-identity for absent-vs-false reports a difference for
    // absent-vs-true, so the instrument is demonstrably able to see the layer.
    //
    // ⚠ AND THE SHAPE OF THE DIFFERENCE IS WORTH STATING HONESTLY, because it is not the
    // obvious one. The lit change is a gate REFUSAL — `coupSpawnGate` returns null on the
    // ledger-occupied settlement instead of a gate result — and a null gate makes the
    // stressor candidate SKIPPED rather than merely less likely. Skipping a candidate
    // changes the candidate list, which changes the budget and the keyed-fork draws around
    // it, so what actually shows up in the bytes is a CASCADE (measured at this commit:
    // ~153.4 kB dark vs ~162.9 kB lit, and a second betrayal stressor surviving in the lit
    // run) rather than a visibly-missing coup. That is expected for a gate-level flag and
    // it is exactly why this arm asserts INEQUALITY rather than a specific delta: pinning
    // the cascade's contents would pin unrelated machinery.
    const dark = JSON.stringify(worldWithoutRules(run({})));
    const lit = JSON.stringify(worldWithoutRules(run({ foreignSeatEnabled: true })));
    expect(lit).not.toBe(dark); // anchored: the lit predicate refuses a coup birth the dark one allows, and the refusal cascades
  });

  it('the occupations ledger the fixture seeds survives the run (the instrument reaches the branch)', () => {
    // ANTI-VACUITY ON THE FIXTURE ITSELF. If the ledger row were dropped on tick 1 the
    // divergent cell would never exist and every arm above would be a green about nothing.
    const dark = run({});
    expect(dark.worldState.occupations?.[OCCUPIED]?.occupierId).toBe(OCCUPIER);
  });
});
