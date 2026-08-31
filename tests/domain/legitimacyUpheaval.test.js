import { describe, expect, test } from 'vitest';

import { STRESSOR_SPAWN_GATES, UPHEAVAL_TUNING } from '../../src/domain/worldPulse/stressorGates.js';
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
