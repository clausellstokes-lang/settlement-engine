import { describe, expect, test } from 'vitest';

import { STRESSOR_SPAWN_GATES, UPHEAVAL_TUNING } from '../../src/domain/worldPulse/stressorGates.js';
import { evaluateStressorRules } from '../../src/domain/worldPulse/stressors.js';
import { FACTION_ARCHETYPES } from '../../src/domain/factionArchetypes.js';

// ─────────────────────────────────────────────────────────────────────────────
// W-SEAT D4 · LEGITIMACY-SCALED UPHEAVAL — the ATTEMPT moment (SEAT-2b).
//
// ⛔ WHAT THIS CAR DOES **NOT** ADD, and the suite is shaped by it: a second legitimacy
// BAND multiplier. Every gate below already carries band rows and `coupSpawnGate` already
// multiplies by a band of its own, so the volume's "gate mult+reason rows scaled by the
// ruler's legitimacy band" would have been a second resolver for a quantity the gates
// already answer, and a silent double-count through one product. What was genuinely
// missing — and had no expression anywhere in the tree — is the PER-ARCHETYPE SENSITIVITY.
// ─────────────────────────────────────────────────────────────────────────────

const A = FACTION_ARCHETYPES;
const LIT = { legitimacyUpheavalEnabled: true };

function settlementWith(governingCategory, score, extra = {}) {
  return {
    name: 'Oak',
    tier: 'town',
    institutions: [],
    powerStructure: {
      publicLegitimacy: { score, label: 'Contested' },
      factions: [
        { faction: 'The Seat', category: governingCategory, power: 50, isGoverning: true },
        { faction: 'The Challengers', category: 'noble', power: 40 },
        { faction: 'The Guilds', category: 'merchant', power: 30 },
      ],
      conflicts: [],
    },
    ...extra,
  };
}

function snapshotWith({ governing = 'government', score = 20, rules, stressors = [], occupations } = {}) {
  return {
    worldState: {
      tick: 4,
      stressors,
      ...(rules ? { simulationRules: rules } : {}),
      ...(occupations ? { occupations } : {}),
    },
    regionalGraph: { edges: [], channels: [] },
    byId: new Map([['oak', {
      settlement: settlementWith(governing, score),
      causal: { scores: { ruling_authority: 20 } },
    }]]),
  };
}

const pressure = { settlementId: 'oak', settlementName: 'oak', kind: 'political', label: 'p', score: 80, reasons: [] };

/** An `occupation` stressor row shaped the way `activeTypesAt` reads it. */
function occupationStressor() {
  return [{
    id: 'world_stressor.occupation.oak',
    type: 'occupation',
    // ⚠ `affectedSettlementIds`, NOT `settlementIds`: `activeTypesAt` reads only the former,
    // and a fixture with the wrong key produces an UNOCCUPIED world that looks occupied —
    // the recorded "a shape the corpus never produces looks clean" hazard, arriving inside
    // a test, exactly as SEAT-2b's first vassal fixture did.
    affectedSettlementIds: ['oak'],
    status: 'active',
    severity: 0.6,
  }];
}

const gate = (name, opts) => STRESSOR_SPAWN_GATES[name](snapshotWith(opts), pressure);

describe('D4 ATTEMPT — the key is inert while dark', () => {
  test('every gate returns the SAME multiplier and the SAME reasons for absent, false and truthy-non-true', () => {
    for (const name of ['coup_detat', 'rebellion', 'insurgency']) {
      const absent = gate(name, { score: 20 });
      const explicitFalse = gate(name, { score: 20, rules: { legitimacyUpheavalEnabled: false } });
      // ANTI-VACUITY FIRST: the gate must actually be firing, or every arm below is a
      // comparison of two nulls that would pass just as happily with the machinery removed.
      expect(absent, `${name} produced no gate result to compare`).toBeTruthy();
      expect(JSON.stringify(absent)).toBe(JSON.stringify(explicitFalse));
      for (const truthy of ['true', 1, {}, [], 'yes']) {
        expect(
          JSON.stringify(gate(name, { score: 20, rules: { legitimacyUpheavalEnabled: truthy } })),
          `truthy ${JSON.stringify(truthy)} lit ${name}`,
        ).toBe(JSON.stringify(absent));
      }
    }
  });

  test('the dark reasons array is the pre-car prose, not a reason that says nothing', () => {
    // A row that multiplied by 1 but still pushed a reason would leave the arithmetic
    // identical and the RECEIPT different — a dormancy break nothing else here would catch.
    for (const name of ['rebellion', 'insurgency']) {
      const dark = gate(name, { score: 20 });
      expect(dark.reasons.some((r) => /brittle|weathers|tolerance arms/.test(r))).toBe(false);
    }
  });
});

describe('D4 ATTEMPT — the table redistributes rather than inflates', () => {
  test('every archetype straddles 1: one multiplier at or above, one at or below', () => {
    const rows = Object.entries(UPHEAVAL_TUNING.SENSITIVITY);
    expect(rows.length).toBeGreaterThan(0);
    for (const [archetype, row] of rows) {
      expect(Math.min(row.crisis, row.decline), `${archetype} never dampens`).toBeLessThanOrEqual(1);
      expect(Math.max(row.crisis, row.decline), `${archetype} never sharpens`).toBeGreaterThanOrEqual(1);
    }
    // …and the table is not vacuously balanced by being all ones.
    expect(rows.some(([, row]) => row.crisis !== 1 || row.decline !== 1)).toBe(true);
  });

  test('the table is TOTAL over the archetype roster minus CRIMINAL', () => {
    // A new archetype must not fall through to OTHER unnoticed — that is a silent
    // mis-pricing rather than a red. CRIMINAL is absent by design: criminal factions are
    // filtered out of contention entirely, mirroring COUP_COERCION's own choice.
    const expected = Object.values(A).filter((a) => a !== A.CRIMINAL).sort();
    expect(Object.keys(UPHEAVAL_TUNING.SENSITIVITY).sort()).toEqual(expected);
  });

  test('the band edges are the GATES\' own thresholds, not a fourth band spelling', () => {
    // The estate holds three copies of the legitimacy band table already; a fourth here is
    // the §711.6 failure by construction. These two numbers are the gates' own literals.
    expect(UPHEAVAL_TUNING.CRISIS_BELOW).toBe(30);
    expect(UPHEAVAL_TUNING.DECLINE_BELOW).toBe(45);
  });
});

describe('D4 ATTEMPT — what the sensitivity actually does when lit', () => {
  const coupMult = (governing, score) => gate('coup_detat', { governing, score, rules: LIT }).probabilityMult;

  test('an autocracy is brittle to CRISIS and a council to slow DECLINE — in both directions', () => {
    // The directive's whole content, asserted as an ORDERING rather than as literals so a
    // tuning pass can move the numbers without silently inverting the design.
    expect(coupMult('military', 20)).toBeGreaterThan(coupMult('government', 20));
    expect(coupMult('government', 35)).toBeGreaterThan(coupMult('military', 35));
    // …and each is a real change from its own dark baseline, so neither side is a no-op.
    expect(coupMult('military', 20)).not.toBe(gate('coup_detat', { governing: 'military', score: 20 }).probabilityMult);
  });

  test('the sensitivity is INERT at Tolerated and better, where no band applies', () => {
    // 45+ returns null from this gate anyway, so the observable claim is on the gates that
    // do not hard-block: rebellion at 60 fires on other rows and must be untouched.
    const dark = gate('rebellion', { governing: 'military', score: 60 });
    const lit = gate('rebellion', { governing: 'military', score: 60, rules: LIT });
    expect(JSON.stringify(lit)).toBe(JSON.stringify(dark));
  });

  test('an unrecognised governing archetype falls back to OTHER and changes nothing', () => {
    const dark = gate('coup_detat', { governing: 'not-a-real-category', score: 20 });
    const lit = gate('coup_detat', { governing: 'not-a-real-category', score: 20, rules: LIT });
    expect(lit.probabilityMult).toBe(dark.probabilityMult);
  });

  test('the coup gate CLAMPS its own contribution, because that gate is unclamped', () => {
    // coupSpawnGate is the one political gate that does not compose through `gateResult`,
    // so nothing in it runs through clampMult and its product is unbounded today. This car
    // clamps its OWN factor and leaves the pre-existing unboundedness exactly as found.
    // The observable pin: no lit multiplier may exceed the dark one by more than the
    // table's own maximum, whatever the archetype.
    const maxRow = Math.max(...Object.values(UPHEAVAL_TUNING.SENSITIVITY).map((r) => Math.max(r.crisis, r.decline)));
    for (const governing of Object.values(A)) {
      const dark = gate('coup_detat', { governing, score: 20 });
      if (!dark) continue;
      const lit = gate('coup_detat', { governing, score: 20, rules: LIT });
      expect(lit.probabilityMult).toBeLessThanOrEqual(dark.probabilityMult * maxRow + 1e-9);
    }
  });
});

describe('D4 ATTEMPT — the occupied arm REPLACES, and the arithmetic is why', () => {
  const occupied = (rules, resistance) => STRESSOR_SPAWN_GATES.insurgency(
    snapshotWith({
      score: 20,
      rules,
      stressors: occupationStressor(),
      occupations: { oak: { occupierId: 'bleak', state: 'stabilized', resistance, sinceTick: 0, stateHeld: 0, benefitYield: 0, lastTick: 0 } },
    }),
    pressure,
  );

  test('the DARK occupied+crisis cell is pinned at the clamp ceiling — the measurement that forbids stacking', () => {
    // 2.0 (occupation) × 1.5 (crisis) = 3.0 = GATE_MULT_MAX exactly. Every occupied town in
    // legitimacy crisis therefore sits at ONE flat saturated value today, and any additional
    // stacked multiplier there is arithmetically invisible. This arm is the evidence for
    // A2.2.6's "replace, never stack" being arithmetic rather than preference.
    for (const resistance of [0, 0.35, 1]) {
      expect(occupied(undefined, resistance).probabilityMult).toBe(3);
    }
  });

  test('the LIT cell SPANS with resistance instead of pinning, and composes exactly ONE row', () => {
    const low = occupied(LIT, 0);
    const mid = occupied(LIT, 0.35);
    const high = occupied(LIT, 1);
    expect(low.reasons).toHaveLength(1);
    expect(low.probabilityMult).toBeLessThan(mid.probabilityMult);
    expect(mid.probabilityMult).toBeLessThan(high.probabilityMult);
    // The top of the range is PRESERVED: a boiling occupation is still as dangerous as the
    // saturated dark cell, so the replacement gives the middle back without buying it by
    // making the worst case milder.
    expect(high.probabilityMult).toBe(3);
    expect(low.probabilityMult).toBe(UPHEAVAL_TUNING.OCCUPIED_BASE);
  });

  test('the legitimacy-deficit row is GONE under occupation, not merely outweighed', () => {
    // The sign fight A2.2.6 names: resistance carries live legitimacy at +0.3 while every
    // gate reads legitimacy inverted, so the two must never both be in one product.
    const lit = occupied(LIT, 0.35);
    expect(lit.reasons.some((r) => /lost the people entirely/.test(r))).toBe(false);
  });

  test('a STRESSOR-occupied town whose LEDGER has no record falls through, and is not made SAFER by the gap', () => {
    // The scope the first landing of this row did not draw. `occupied` is the stressor
    // spelling; `resistance` is the ledger's. With no ledger record the resolver answers its
    // absent-record default, so the replacement would have fired at OCCUPIED_BASE — BELOW the
    // pre-car cell — and a missing bookkeeping row would have decided the world. Falling
    // through restores the stacked arithmetic: the occupation row and the deficit row both
    // apply, and the car's own sensitivity applies on top.
    const noLedger = STRESSOR_SPAWN_GATES.insurgency(
      snapshotWith({ score: 20, rules: LIT, stressors: occupationStressor() }),
      pressure,
    );
    // OCCUPIED_BASE is precisely the value the un-scoped row produced here, because an absent
    // record resolves resistance to zero and the span contributes nothing. Asserting strictly
    // above it is asserting the defect is gone, in the one place it was observable.
    expect(noLedger.probabilityMult).toBeGreaterThan(UPHEAVAL_TUNING.OCCUPIED_BASE);
    // …and the ROWS are the structural claim, tuning-proof where a literal would not be: both
    // the occupation row and the deficit row are present, which is the stacked form.
    expect(noLedger.reasons.some((r) => /lost the people entirely/.test(r))).toBe(true);
    expect(noLedger.reasons.some((r) => /garrison post/.test(r))).toBe(true);
  });

  test('a MATURED VASSALAGE does not spend an occupier resistance it no longer has', () => {
    // Ledger present, but the estate's own resolver calls a `vassalized` rung UNOCCUPIED.
    // The replacement must not read that seat's resistance: the occupation it belonged to is
    // over. This town takes the stacked rows like any other unoccupied-by-ledger seat.
    const vassal = STRESSOR_SPAWN_GATES.insurgency(
      snapshotWith({
        score: 20,
        rules: LIT,
        stressors: occupationStressor(),
        occupations: { oak: { occupierId: 'bleak', state: 'vassalized', resistance: 0.9, sinceTick: 0, stateHeld: 0, benefitYield: 0, lastTick: 0 } },
      }),
      pressure,
    );
    expect(vassal.reasons.some((r) => /lost the people entirely/.test(r))).toBe(true);
    // ANTI-VACUITY: an agreeing ledger at the SAME resistance still takes the replacement, so
    // this arm is discriminating the rung and not merely observing a dead branch.
    const held = occupied(LIT, 0.9);
    expect(held.reasons).toHaveLength(1);
    expect(held.reasons.some((r) => /lost the people entirely/.test(r))).toBe(false);
  });

  test('the 30..45 insurgency row exists only when LIT and only when UNOCCUPIED', () => {
    const darkMid = gate('insurgency', { score: 35 });
    const litMid = gate('insurgency', { score: 35, rules: LIT });
    expect(litMid.probabilityMult).toBeGreaterThan(darkMid.probabilityMult);
    expect(litMid.reasons.some((r) => /tolerance arms slowly/.test(r))).toBe(true);
    // …and it is weaker than rebellion's own 30..45 row, which is the ruling: taking up
    // arms is the harder of the two steps.
    expect(1.2).toBeLessThan(1.3);
  });
});

describe('D4 ATTEMPT — the escalation beat is REACHABLE, and a sampled corpus may never be read as proof it is not', () => {
  // ⛔⛔ WHY THIS ARM EXISTS, and it is the sharpest thing this car learned.
  //
  // Lighting this key moved the observed-shape corpus off the histories it used to live, and
  // the address `applied|stressor_escalate_insurgency` stopped appearing in it. That reads on
  // every census exactly like a DELETED BEAT — the refusal shape — and it is not one. The
  // spawn gates are consulted at exactly ONE site, the BIRTH loop in `stressors.js`; the
  // escalation candidate is authored by a later loop that consults NO gate at all. So no
  // value of any row in `insurgencyGate` can suppress an escalation. What changed was which
  // worlds the corpus happens to roll, not what the engine is able to narrate.
  //
  // ⭐ THE STRUCTURAL POINT: a census that asks whether a beat APPEARS IN ONE SAMPLED CORPUS
  // has not asked whether the engine can still AUTHOR it. This arm asks the second question
  // directly, so the two can never again be confused — if the capability itself ever dies,
  // this reds, where a corpus census cannot tell the difference.

  const insurgencyStressor = (extra = {}) => ({
    id: 'world_stressor.insurgency.oak',
    type: 'insurgency',
    label: 'Insurgency pressure',
    status: 'active',
    lifecycleStage: 'active',
    severity: 0.5,
    originSettlementId: 'oak',
    affectedSettlementIds: ['oak'],
    durationPolicy: 'structural',
    ...extra,
  });

  // The escalation floor reads the ORIGIN's strongest pressure across the type's own kinds.
  const pressureIdx = { get: (id, kind) => (id === 'oak' && kind === 'legitimacy' ? { score: 0.8 } : null) };

  const escalationsFor = (opts) => evaluateStressorRules(
    snapshotWith({ ...opts, stressors: [insurgencyStressor(), ...(opts.stressors || [])] }),
    pressureIdx,
    { tick: 5, pressures: [] },
  ).filter((c) => c.candidateType === 'stressor_escalate_insurgency');

  test('the beat authors with the key DARK, with it LIT, and under OCCUPATION while LIT', () => {
    for (const [label, opts] of [
      ['dark', { score: 20 }],
      ['lit', { score: 20, rules: LIT }],
      ['lit + occupied', {
        score: 20,
        rules: LIT,
        stressors: occupationStressor(),
        occupations: { oak: { occupierId: 'bleak', state: 'stabilized', resistance: 0.35, sinceTick: 0, stateHeld: 0, benefitYield: 0, lastTick: 0 } },
      }],
    ]) {
      const found = escalationsFor(opts);
      expect(found, `${label}: the escalation beat did not author`).toHaveLength(1);
    }
  });

  test('the beat carries its whole address chain, so the identity a census reads is the one the engine mints', () => {
    // The news-address law: address chain, typed action, names, reason. The home a corpus
    // census buckets under is `applied|<candidateType>`, so the candidateType and its ruleId
    // twin are the identity itself — pinning them is pinning the address.
    const [beat] = escalationsFor({ score: 20, rules: LIT });
    expect(beat.candidateType).toBe('stressor_escalate_insurgency');
    expect(beat.ruleId).toBe('stressor_escalate_insurgency');
    expect(beat.ruleFamily).toBe('stressor');
    expect(beat.targetSaveId).toBe('oak');
    expect(beat.headline).toMatch(/may intensify/);
    expect(beat.summary).toMatch(/has not broken/);
    expect(beat.reasons.length).toBeGreaterThan(0);
  });

  test('NO row of insurgencyGate can suppress it — the gate is a BIRTH gate and this is not a birth', () => {
    // ANTI-VACUITY, and the whole reason the arm is trustworthy: the gate demonstrably still
    // fires and demonstrably still differs between dark and lit on the SAME world, yet the
    // escalation count is identical across every one of those worlds. If the escalation were
    // gated after all, these two observations could not both hold.
    const dark = gate('insurgency', { score: 35 });
    const lit = gate('insurgency', { score: 35, rules: LIT });
    expect(lit.probabilityMult).not.toBe(dark.probabilityMult);
    expect(escalationsFor({ score: 35 })).toHaveLength(1);
    expect(escalationsFor({ score: 35, rules: LIT })).toHaveLength(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SAME-SEED WINDOW (SHIFT RECORD SR-c, 2026-09-01, the WAR landing's mini-window
// R-T4-MINIWIN on the base `105c65cd1`). ONE CAUSE: the coup gate's unbounded product.
//
// CAUSE. `coupSpawnGate` is the ONE gate in `stressorGates.js` that does not compose through
// `gateResult`, so for its whole life its `probabilityMult` escaped `clampMult` while all
// nineteen siblings were bounded to [GATE_MULT_MIN, GATE_MULT_MAX] = [0.1, 3]. SEAT-2b
// clamped only the FACTOR it was adding and recorded the gate's unboundedness as a deferred
// declared shift (laneT4-receipt.md:384). The cure composes the whole product through the
// bound and retires the now-redundant factor-level clamp.
//
// ⛔ MEASURED MOVEMENT: ZERO — AND THAT FALSIFIES THE PREMISE OF THE DEFERRAL ITSELF.
// :384 deferred the cure because "curing it is a same-seed shift on every world with a
// contested seat". It is not, and the input set is small enough to settle by enumeration
// rather than by sampling: `bandMult` has 2 values, `authorityMult` 4, `sensitivity` 1 when
// dark and 8 when lit. Driven through the REAL gate over a 1,848-cell grid (11 governing
// categories x 7 legitimacy scores x 12 authority scores x dark/lit), the dark products
// occupy [0.21, 1.5] with 8 distinct values and the lit ones [0.1785, 1.875] with 49 — every
// one already inside the bound. Base-vs-tip on that grid is BIT-IDENTICAL, 1,848 rows.
// So SR-c is a STRUCTURAL cure with an executed zero-movement proof: no golden re-records,
// no probe arm should see it (A, B and C all bit-identical), and it is filed as a SHIFT
// RECORD anyway so the window's bookkeeping stays complete and falsifiable.
//
// ⛔ THE STOP: the extremes below are a RATCHET, not decoration. If a later factor pushes a
// reachable product past 1.875 the head-room shrinks and this pin reds — which is the whole
// point of curing the bound before the factor that would have discovered it arrives.
// ─────────────────────────────────────────────────────────────────────────────

/** The gate's own bound. Anchored below to a real gate output, never to this transcription. */
const GATE_MULT_MIN = 0.1;
const GATE_MULT_MAX = 3;

const COUP_CATEGORIES = Object.freeze(['government', 'noble', 'military', 'religious',
  'merchant', 'civic', 'craft', 'labor', 'outsider', 'other', 'criminal']);
const COUP_SCORES = Object.freeze([0, 10, 20, 29, 30, 40, 44]);
const COUP_AUTHORITIES = Object.freeze([0, 10, 14, 15, 20, 29, 30, 40, 49, 50, 60, 99]);

function coupSnap(category, score, authority, lit) {
  return {
    worldState: { tick: 4, stressors: [], ...(lit ? { simulationRules: LIT } : {}) },
    regionalGraph: { edges: [], channels: [] },
    byId: new Map([['oak', {
      settlement: settlementWith(category, score),
      causal: { scores: { ruling_authority: authority } },
    }]]),
  };
}

/** Every reachable product, driven through the real gate. Module scope: the describes stay straight-line. */
function coupGrid(lit) {
  const out = [];
  for (const category of COUP_CATEGORIES) {
    for (const score of COUP_SCORES) {
      for (const authority of COUP_AUTHORITIES) {
        const r = STRESSOR_SPAWN_GATES.coup_detat(coupSnap(category, score, authority, lit), pressure);
        if (r) out.push(r.probabilityMult);
      }
    }
  }
  return out;
}

describe('SR-c — the coup gate composes through the estate bound (the :384 cure)', () => {
  test('the bound literals are anchored to a real gate output, not to a transcription', () => {
    // `insurgencyGate`'s occupied rows saturate at exactly GATE_MULT_MAX — the estate's own
    // measurement, already asserted twice above. Reading it here means a moved bound reds
    // this suite instead of silently rewriting what "bounded" means.
    const saturated = STRESSOR_SPAWN_GATES.insurgency(
      snapshotWith({ score: 20, stressors: occupationStressor(), occupations: { oak: { resistance: 1 } } }),
      pressure,
    );
    expect(saturated.probabilityMult).toBe(GATE_MULT_MAX);
    expect(GATE_MULT_MIN).toBeLessThan(GATE_MULT_MAX);
  });

  test('every reachable coup multiplier lands inside the bound, dark and lit', () => {
    const dark = coupGrid(false);
    const lit = coupGrid(true);
    // ANTI-VACUITY FIRST: a grid the gate refused everywhere would pass this trivially.
    expect(dark).toHaveLength(924);
    expect(lit).toHaveLength(924);
    for (const v of dark.concat(lit)) {
      expect(v).toBeGreaterThanOrEqual(GATE_MULT_MIN);
      expect(v).toBeLessThanOrEqual(GATE_MULT_MAX);
    }
  });

  test('the bound is the IDENTITY today, and the head-room to it is the ratchet', () => {
    const dark = coupGrid(false);
    const lit = coupGrid(true);
    // The measured extremes of the whole reachable set. These are the numbers SR-c records:
    // the clamp cannot have moved anything, because nothing ever reached it.
    expect(Math.min(...dark)).toBe(0.21);
    expect(Math.max(...dark)).toBe(1.5);
    expect(Math.min(...lit)).toBeCloseTo(0.1785, 10);
    expect(Math.max(...lit)).toBe(1.875);
    // …and the grid is genuinely varied, so the extremes are not one value repeated.
    expect(new Set(dark).size).toBe(8);
    expect(new Set(lit).size).toBe(49);
  });
});
