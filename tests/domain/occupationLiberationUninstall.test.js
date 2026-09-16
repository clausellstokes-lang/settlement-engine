import { describe, expect, test } from 'vitest';

import {
  OCCUPATION_LIFT_KIND,
  installOccupationAuthority,
  liftOccupationAuthority,
} from '../../src/domain/worldPulse/applyWorldPulseOccupationAuthority.js';
import { evaluateOccupations, occupationLiftTransfer } from '../../src/domain/worldPulse/occupation.js';
import { RULING_POWER_CAUSES, transferRulingPower } from '../../src/domain/rulingPower.js';
import { legitimateRemnantOf } from '../../src/domain/rulingPowerSeat.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { applyStressEventFactions } from '../../src/generators/power/stressFactions.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

// ─────────────────────────────────────────────────────────────────────────────
// W-SEAT SEAT-5 — LIBERATION UN-INSTALLS (volume §3-D7, amendment A1.1.4/A1.1.5).
//
// THE DEFECT THIS CURES was CONFIRMED BY ABSENCE: both `occupation_lifted` producers
// were condition-only, and tree-wide NO writer removes a modifier from any faction, so a
// liberated town's roster kept the foreign authority governing and its locals disarmed
// forever while its own prose said "the settlement reclaims its own authority". These arms
// are DISCOVERY-grade against that absence, not regression-grade: nothing here passed
// before the car, and the dark column below is what the whole tree did until it landed.
//
// ─────────────────────────────────────────────────────────────────────────────
// SAME-SEED WINDOW (SHIFT RECORD SR-b, 2026-09-01, the WAR landing's mini-window
// R-T4-MINIWIN on the base `105c65cd1`). ONE CAUSE: the military predicate.
//
// CAUSE. `applyWorldPulseOccupationAuthority.isMilitaryFaction` asked a DIFFERENT question
// from the generator whose transform it exists to reproduce. It read
// `category === 'military' || /\b(milit|guard|garrison|warrior|legion|soldier)\b/`; the
// generator (`generators/power/stressFactions.js`, the `ke('occupied')` arm) reads
// `name.includes('military') || name.includes('guard')`. laneT4-receipt.md:257-261 found it,
// called the file's parity comment false, and deferred the cure to a declared-shift window.
// This is that window.
//
// WHICH SIDE WAS DECLARED TRUE — THE GENERATOR'S — and the record states it because the
// choice decides which probe moves. A generator-side cure would move the 600-settlement
// generation corpus (probe A) and the espionage fence's 360-corpus; the sim-side cure moves
// only the war path (probe C). Sim-side was taken: this family's chartered purpose is to
// COPY the generator, and widening the generator is a same-seed generation act inside the
// owner's tuning carve-out.
//
// MEASURED, not asserted. 13 of a 23-name corpus disagreed, and the `category` clause was
// the main cause rather than the regex: every generated faction carries a category from
// `inferFactionCategory`, whose `military` bucket is sixteen keywords wide. The sim
// therefore disarmed to x0.3 a class the generator only suppresses to x0.82 — including the
// generator's OWN 'Occupation Authority' (20 -> 6) and 'Resistance Network' (8 -> 2) rows,
// which the generator explicitly exempts by name.
//
// MOVEMENT SCOPE — ZERO on every launched world, and it is PROVEN rather than argued.
// `isMilitaryFaction` has exactly ONE caller (`installOccupationAuthority`), reachable only
// from `applyWorldPulse.js`'s `cause === 'conquest'` branch; `cause: 'conquest'` is minted at
// exactly one site tree-wide (`warDeployment.js:823`), reachable only under
// `warLayerEnabled`, which is `false` in DEFAULT_SIMULATION_RULES and overridden by NO named
// preset. Probes A and B cannot reach it at all; probe C reaches it only on a war-LIT arm.
// The in-tree instruments that DO move are this file's conquest fixture and
// `warDeployment.test.js`'s Z1 arm — both moved in this same act, cause cited, and the
// fixture's military row is renamed to a name BOTH predicates call military so the SEAT-5
// ordering discovery survives on its own merits instead of on the defect.
//
// ⛔ THE STOP: this predicate moving again outside a recorded window is a STOP, never a
// re-record. The generator's own narrow matcher is the docketed OWNER-GATED half.
// ─────────────────────────────────────────────────────────────────────────────

const LIT = { simulationRules: { foreignSeatEnabled: true } };
const DARK = { simulationRules: {} };

/** The roster a real conquest produces, built by running the REAL install chain. */
function conquered() {
  const base = {
    id: 'townA',
    name: 'Ashford',
    tier: 'town',
    powerStructure: {
      factions: [
        { faction: 'Town Council', power: 40, isGoverning: true, category: 'government' },
        { faction: 'The Town Guard', power: 25, isGoverning: false, category: 'military' },
        { faction: 'Merchant Guilds', power: 20, isGoverning: false, category: 'merchant' },
        { faction: 'Temple of Light', power: 15, isGoverning: false, category: 'religious' },
      ],
      publicLegitimacy: { score: 62, label: 'Approved', govMultiplier: 1.15 },
    },
  };
  const installed = installOccupationAuthority(base, 'Ironhold');
  return transferRulingPower(installed, 'Ironhold', { cause: 'conquest', tick: 10 }).settlement;
}

const byName = (s, name) => s.powerStructure.factions.find((f) => f.faction === name);
const mods = (f) => [...(f?.modifiers || [])];

describe('SEAT-5 — the un-install is inert while the seat key is dark', () => {
  test('no payload is minted for absent, false, or truthy-non-true keys', () => {
    const s = conquered();
    expect(occupationLiftTransfer(DARK, { settlement: s }, 20)).toBeNull();
    expect(occupationLiftTransfer({ simulationRules: { foreignSeatEnabled: false } }, { settlement: s }, 20)).toBeNull();
    for (const truthy of ['true', 1, {}, [], 'yes']) {
      expect(occupationLiftTransfer({ simulationRules: { foreignSeatEnabled: truthy } }, { settlement: s }, 20)).toBeNull();
    }
    expect(occupationLiftTransfer(null, { settlement: s }, 20)).toBeNull();
  });

  test('the lift returns the SAME REFERENCE for any payload without the typed marker', () => {
    const s = conquered();
    // BY REFERENCE, not by deep equality: a payload-less transfer must not even copy the
    // roster, so the dark path is byte-identical by construction rather than by arithmetic.
    expect(liftOccupationAuthority(s, null)).toBe(s);
    expect(liftOccupationAuthority(s, { cause: 'appointment' })).toBe(s);
    expect(liftOccupationAuthority(s, { cause: 'coup', occupationLift: 'occupation_lift' })).toBe(s);
    expect(liftOccupationAuthority(s, { occupationLift: OCCUPATION_LIFT_KIND })).not.toBe(s);
  });

  test('a roster with nothing to lift is returned by reference even WITH the marker', () => {
    const clean = { powerStructure: { factions: [{ faction: 'Council', power: 50, isGoverning: true }] } };
    expect(liftOccupationAuthority(clean, { occupationLift: OCCUPATION_LIFT_KIND })).toBe(clean);
  });
});

describe('SEAT-5 — what the lit un-install actually does to the roster', () => {
  test('the installed occupier row is removed and every occupation marker is stripped', () => {
    const s = conquered();
    expect(s.powerStructure.factions.some((f) => mods(f).includes('occupier'))).toBe(true);
    const lifted = liftOccupationAuthority(s, { occupationLift: OCCUPATION_LIFT_KIND });
    expect(lifted.powerStructure.factions.some((f) => mods(f).includes('occupier'))).toBe(false);
    // Every marker is asserted as a TRANSITION, never as a bare absence: the conquered
    // roster is proved to carry it first, so a green here measures removal rather than a
    // roster that drifted out from under the test.
    for (const marker of ['occupied', 'disarmed']) {
      expectPresentThenAbsent(
        s.powerStructure.factions.flatMap(mods),
        lifted.powerStructure.factions.flatMap(mods),
        marker,
      );
    }
    // The town's own factions all survive — only the foreign row leaves.
    expect(lifted.powerStructure.factions).toHaveLength(s.powerStructure.factions.length - 1);
  });

  test('the RESTORE IS ASYMMETRIC, and each half is asserted for its own measured reason', () => {
    const s = conquered();
    const lifted = liftOccupationAuthority(s, { occupationLift: OCCUPATION_LIFT_KIND });
    // `disarmed` names ONE factor (×0.3) and the generator never writes it, so it inverts.
    expect(byName(s, 'The Town Guard').power).toBe(8);
    expect(byName(lifted, 'The Town Guard').power).toBe(27);
    // `occupied` names TWO factors (×0.6 governing, ×0.82 civic) and the discriminator
    // `isGoverning` is destroyed by the crowning, so the power is deliberately LEFT.
    // Inverting it would fabricate the discriminator and over-restore.
    for (const name of ['Merchant Guilds', 'Temple of Light']) {
      expect(byName(lifted, name).power).toBe(byName(s, name).power);
    }
  });

  test('the disarm inversion is a DECLARED ESTIMATE with a bounded round-trip error', () => {
    // The cut is Math.max(0, Math.round(p × 0.3)) — lossy in the small. The bound is
    // asserted as a PROPERTY over the whole 0..100 domain rather than sampled, because a
    // sampled claim about rounding is a coin flip (the recorded 26.51 % lesson).
    for (let p = 0; p <= 100; p += 1) {
      const cut = Math.max(0, Math.round(p * 0.3));
      const s = {
        powerStructure: { factions: [{ faction: 'Guard', power: cut, isGoverning: false, modifiers: ['disarmed'] }] },
      };
      const back = liftOccupationAuthority(s, { occupationLift: OCCUPATION_LIFT_KIND }).powerStructure.factions[0].power;
      expect(Math.abs(back - p)).toBeLessThanOrEqual(2);
      expect(back).toBeGreaterThanOrEqual(0);
      expect(back).toBeLessThanOrEqual(100);
    }
  });

  test('INERT-NOT-CRASH on absent and garbage rosters', () => {
    const marker = { occupationLift: OCCUPATION_LIFT_KIND };
    expect(liftOccupationAuthority(null, marker)).toBeNull();
    expect(liftOccupationAuthority({}, marker)).toEqual({});
    const garbage = { powerStructure: { factions: [null, 7, { faction: 'X', modifiers: 'not-an-array' }] } };
    expect(() => liftOccupationAuthority(garbage, marker)).not.toThrow();
  });
});

describe('SEAT-5 — THE PROMISE: a generation-occupied roster is not damage to repair', () => {
  // `src/generators/power/stressFactions.js` writes `occupied` on the GOVERNING row only,
  // mints its own "Occupation Authority"/"Resistance Network" rows, writes NO `disarmed`,
  // and leaves the civic and noble cuts UNMARKED. Those cuts are the world's starting
  // truth. The un-install keys on the `occupier` MODIFIER — which the generator never
  // writes — so the sim's own row is the only thing it can remove.
  const generated = () => ({
    powerStructure: {
      factions: [
        { faction: 'Town Council', power: 24, isGoverning: true, modifiers: ['occupied'] },
        { faction: 'Occupation Authority', power: 20, isGoverning: false },
        { faction: 'Resistance Network', power: 8, isGoverning: false },
      ],
      publicLegitimacy: { score: 30 },
    },
  });

  test('the generator\'s own rows all survive and NO generated power is handed back', () => {
    const before = generated();
    const after = liftOccupationAuthority(before, { occupationLift: OCCUPATION_LIFT_KIND });
    expect(after.powerStructure.factions.map((f) => f.faction))
      .toEqual(['Town Council', 'Occupation Authority', 'Resistance Network']);
    expect(after.powerStructure.factions.map((f) => f.power)).toEqual([24, 20, 8]);
    // Only the marker moves — the town is genuinely no longer occupied.
    expect(mods(after.powerStructure.factions[0])).toEqual([]);
  });
});

describe('SEAT-5 — the remnant is chosen on the LIFTED roster (the ordering pin)', () => {
  test('the occupier does not pick the town\'s next government from beyond the grave', () => {
    const s = conquered();
    const onCut = legitimateRemnantOf(s);
    const onLifted = legitimateRemnantOf(liftOccupationAuthority(s, { occupationLift: OCCUPATION_LIFT_KIND }));
    // THE DISCOVERY: these DISAGREE on a real conquest fixture. The garrison ranks below
    // the merchants only because the occupier disarmed it; restoring it puts it on top.
    expect(onCut.faction).toBe('Merchant Guilds');
    expect(onLifted.faction).toBe('The Town Guard');
    // And the payload the producers emit takes the LIFTED answer.
    expect(occupationLiftTransfer(LIT, { settlement: s }, 20).toPowerName).toBe('The Town Guard');
  });

  test('no legitimate remnant ⇒ no payload, rather than a seat invented for the town', () => {
    const bare = installOccupationAuthority(
      { powerStructure: { factions: [{ faction: 'Town Council', power: 40, isGoverning: true }] } },
      'Ironhold',
    );
    const crowned = transferRulingPower(bare, 'Ironhold', { cause: 'conquest', tick: 3 }).settlement;
    expect(occupationLiftTransfer(LIT, { settlement: crowned }, 9)).toBeNull();
  });
});

describe('SEAT-5 — the cause stays inside the frozen vocabulary (A1.1.5)', () => {
  test('the emitted cause is a RULING_POWER_CAUSES member', () => {
    const payload = occupationLiftTransfer(LIT, { settlement: conquered() }, 20);
    expect(RULING_POWER_CAUSES).toContain(payload.cause);
    expect(payload.cause).toBe('appointment');
  });

  test('and the pin has teeth: an out-of-vocabulary cause is SILENTLY coerced to a coup', () => {
    // rulingPower.js:402. This is the fabrication landmine A1.1.5 names — it does not
    // throw, it mis-narrates, and a liberation that ever reached it would be recorded as a
    // coup forever. The arm exists so the vocabulary assertion above cannot be vacuous.
    const s = conquered();
    const honest = transferRulingPower(s, 'Merchant Guilds', { cause: 'liberation', tick: 20 }).settlement;
    const coup = transferRulingPower(s, 'Merchant Guilds', { cause: 'coup', tick: 20 }).settlement;
    expect(JSON.stringify(honest)).toBe(JSON.stringify(coup));
  });
});

describe('SEAT-5 — the applier chain end to end', () => {
  test('a lit liberation seats the remnant, un-retypes the seat, and un-occupies the roster', () => {
    const s = conquered();
    const payload = occupationLiftTransfer(LIT, { settlement: s }, 20);
    // Verbatim the applyWorldPulse.js arm: lift, then transfer.
    const result = transferRulingPower(liftOccupationAuthority(s, payload), payload.toPowerName, {
      cause: payload.cause, tick: payload.tick, losers: [],
    });
    expect(result.error).toBeNull();
    const after = result.settlement;
    expect(after.powerStructure.factions.some((f) => mods(f).includes('occupier'))).toBe(false);
    expect(after.powerStructure.factions.some((f) => mods(f).includes('occupied'))).toBe(false);
    expect(after.powerStructure.factions.some((f) => mods(f).includes('disarmed'))).toBe(false);
    const governing = after.powerStructure.factions.find((f) => f.isGoverning);
    // The seat was retyped `occupation` by the conquest; the liberation retypes it back to
    // the remnant's own archetype. Nothing in the roster still reads as foreign authority.
    expect(governing.category).not.toBe('occupation');
    // The town's own former government survives ONLY here — it is the record the receipt
    // may honestly cite, and it is capped at six, so it is evictable. Stated, not claimed.
    expect(after.powerStructure.previousGovernments.map((g) => g.label)).toContain('Town Council');
  });

  test('a DARK liberation leaves the conquered roster exactly as it was', () => {
    const s = conquered();
    const payload = occupationLiftTransfer(DARK, { settlement: s }, 20);
    expect(payload).toBeNull();
    expect(liftOccupationAuthority(s, payload)).toBe(s);
  });
});

describe('SEAT-5 — driven through evaluateOccupations (the producer, not the leaf)', () => {
  function worldWith({ lit }) {
    const settlement = (name, factions) => ({
      name,
      tier: 'town',
      population: 4000,
      config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
      institutions: [],
      economicState: { prosperity: 'Struggling', primaryExports: [], primaryImports: [] },
      powerStructure: { publicLegitimacy: { score: 30, label: 'Contested' }, factions, conflicts: [] },
      npcs: [],
      activeConditions: [],
    });
    const occupiedFactions = installOccupationAuthority(
      {
        powerStructure: {
          factions: [
            { faction: 'Town Council', power: 40, isGoverning: true, category: 'government' },
            { faction: 'The Town Guard', power: 25, isGoverning: false, category: 'military' },
            { faction: 'Merchant Guilds', power: 20, isGoverning: false, category: 'merchant' },
          ],
        },
      },
      'Ironhold',
    ).powerStructure.factions;
    const saves = [
      { id: 'a', name: 'Ashford', phase: 'canon', settlement: settlement('Ashford', occupiedFactions), campaignState: { phase: 'canon', eventLog: [], locks: {} } },
      { id: 'b', name: 'Ironhold', phase: 'canon', settlement: settlement('Ironhold', [{ faction: 'Crown', power: 60, isGoverning: true }]), campaignState: { phase: 'canon', eventLog: [], locks: {} } },
    ];
    const worldState = {
      rngSeed: 'seat5-seed',
      tick: 9,
      relationshipStates: {},
      // A CONTESTED occupation with maximal resistance and no garrison present collapses
      // outright on the next pass (occupation.js's `curTier === 'contested' && s <= COLLAPSE_THRESHOLD`).
      occupations: { a: { occupierId: 'b', state: 'contested', sinceTick: 1, stateHeld: 6, resistance: 1, benefitYield: 0, lastTick: 8 } },
      ...(lit ? { simulationRules: { foreignSeatEnabled: true } } : {}),
    };
    const campaign = { id: 'seat5', settlementIds: ['a', 'b'], worldState, regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }) };
    const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
    return { snapshot, worldState, graph: campaign.regionalGraph };
  }

  const run = (lit) => {
    const { snapshot, worldState, graph } = worldWith({ lit });
    return evaluateOccupations({
      snapshot, worldState, graph, deployments: {}, warOutcomes: [], returnOutcomes: [],
      tick: 9, rules: { warLayerEnabled: true, ...(lit ? { foreignSeatEnabled: true } : {}) },
    });
  };

  test('the collapse fires, and ONLY the lit run carries a restoration payload', () => {
    const dark = run(false);
    const lit = run(true);
    const liftedOf = (r) => r.outcomes.filter((o) => o.candidateType === 'occupation_lifted');
    // ANTI-VACUITY: the instrument must have something to compare. The occupation must
    // actually collapse and leave the ledger on BOTH runs, or the arms below mean nothing.
    expect(liftedOf(dark)).toHaveLength(1);
    expect(liftedOf(lit)).toHaveLength(1);
    expect(dark.occupations.a).toBeUndefined();
    expect(lit.occupations.a).toBeUndefined();

    expect(liftedOf(dark)[0].powerTransfer).toBeUndefined();
    const transfer = liftedOf(lit)[0].powerTransfer;
    expect(transfer).toMatchObject({ cause: 'appointment', occupationLift: OCCUPATION_LIFT_KIND, tick: 9 });
    expect(RULING_POWER_CAUSES).toContain(transfer.cause);
  });

  test('the DARK outcome list is byte-identical to the pre-car one, key for key', () => {
    // The only difference a dark run may show is the ABSENCE of the new key. Compared as
    // raw JSON with no normalizer, so a re-ordered key would red.
    const dark = run(false);
    const lit = run(true);
    const strip = (o) => { const { powerTransfer, ...rest } = o; return rest; };
    expect(JSON.stringify(dark.outcomes)).toBe(JSON.stringify(lit.outcomes.map(strip)));
    // …and the lit run is genuinely different, so the comparator is not comparing nothing.
    expect(JSON.stringify(dark.outcomes)).not.toBe(JSON.stringify(lit.outcomes));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SR-b — THE MILITARY PREDICATE IS THE GENERATOR'S (cause :261, the mini-window).
//
// ⭐ THE AGREEMENT ARM BELOW DRIVES BOTH REAL IMPLEMENTATIONS RATHER THAN TRANSCRIBING
// EITHER. A pin that re-spells the generator's rule inside the test is a SECOND SPELLING
// of the shared quantity — the §711.6 failure this whole cure exists to close — and it
// would go on passing after the generator's own matcher moved. So the generator's real
// `applyStressEventFactions` is run against the sim's real `installOccupationAuthority`
// on the same roster, and the two cut DECISIONS are compared.
// ─────────────────────────────────────────────────────────────────────────────

/** One non-governing faction, cut by the SIM's install. Returns its row. */
const simCut = (name, power) => installOccupationAuthority(
  { powerStructure: { factions: [
    { faction: 'Town Council', power: 40, isGoverning: true, category: 'government' },
    { faction: name, power, isGoverning: false, category: 'military' },
  ] } },
  'Ironhold',
).powerStructure.factions.find((f) => f.faction === name);

/** The same faction, cut by the GENERATOR's own `occupied` stress arm. Returns its row. */
const genCut = (name, power) => {
  const factions = [
    { faction: 'Town Council', power: 40, isGoverning: true },
    { faction: name, power },
  ];
  applyStressEventFactions(factions, (k) => k === 'occupied', null, false, {}, []);
  return factions.find((f) => f.faction === name);
};

// The corpus is module-scope and the arms below are straight-line `test` statements: a
// loop at describe-statement position parks the whole file in the lighting census
// (SUITE_NOT_STRAIGHT_LINE), which is T8's §875.2 lesson paid once already.
const PREDICATE_CORPUS = Object.freeze([
  'The Garrison', 'Town Guard', 'City Guards', 'City Watch', 'Military Order',
  'Mercenary Company', 'Occupation Authority', 'Resistance Network', 'War Council',
  'Knightly Order', 'Soldiers of the Vale', 'The Legion', 'Warrior Lodge',
  'Adventurers Charter', 'Monster Hunter Lodge', 'Huscarl Retinue', 'Merchant Guilds',
]);

describe('SEAT-5 — the install asks the GENERATOR question about a military faction', () => {
  test('the row laneT4 measured: a category-military name the generator spares takes the CIVIC cut', () => {
    // 'The Garrison' is `inferFactionCategory` military and generator-CIVIC — the exact row
    // laneT4-receipt.md:257-261 measured at 8 by the sim and 21 by the generator. Both say 21
    // now, and the marker moves with the cut: a civic cut is `occupied`, never `disarmed`.
    const row = simCut('The Garrison', 25);
    expect(row.power).toBe(21);
    expect(mods(row)).toEqual(['occupied']);
    expect(genCut('The Garrison', 25).power).toBe(21);
  });

  test('the cure is a NARROWING and not a deletion: a name both sides call military is still disarmed', () => {
    const row = simCut('Town Guard', 25);
    expect(row.power).toBe(8);
    expect(mods(row)).toEqual(['disarmed']);
    expect(genCut('Town Guard', 25).power).toBe(8);
  });

  test('the generator OWN occupation rows are no longer gutted by a pulse re-conquest', () => {
    // A generation-occupied town later pulse-conquered used to have the generator's two
    // protected rows disarmed to 6 and 2. They now take the civic cut the generator's own
    // exemption would have spared them entirely — a residual named in the source comment,
    // and a x0.82 that is no longer a x0.3.
    expect(simCut('Occupation Authority', 20).power).toBe(16);
    expect(simCut('Resistance Network', 8).power).toBe(7);
  });

  test('sim and generator agree on the DISARM DECISION for every name in the corpus', () => {
    // ⚠ THE COMPARISON IS THE DECISION, NOT THE RESULTING POWER, and the difference is a
    // measurement rather than a convenience: on 'Occupation Authority' and 'Resistance
    // Network' the generator applies NEITHER cut (its by-name exemption leaves them at 25)
    // while this install has no exemption and applies the civic x0.82. That residual is
    // named in the source comment as NOT mirrored; it is a different cause from this record's
    // and comparing raw powers here would silently fold the two together.
    // At power 25 the three answers are distinct — 8 disarmed, 21 civic, 25 exempt.
    const genDisarmed = (n) => genCut(n, 25).power === 8;
    const simDisarmed = (n) => mods(simCut(n, 25)).includes('disarmed');
    // ANTI-VACUITY FIRST: the corpus must contain both answers, or agreement is trivial.
    expect(new Set(PREDICATE_CORPUS.map(genDisarmed)).size).toBe(2);
    for (const name of PREDICATE_CORPUS) {
      expect([name, simDisarmed(name)]).toEqual([name, genDisarmed(name)]);
    }
  });

  test('and the agreement is falsifiable: the retired predicate disagreed on fourteen', () => {
    // NO RE-IMPLEMENTATION. The retired rule's FIRST clause was `category === 'military'`,
    // and every faction `simCut` builds carries exactly that category — so the old sim
    // disarmed all seventeen of these while the generator disarms three. The control is
    // therefore a count over the generator's real answers, which cannot rot into fiction.
    const generatorDisarms = PREDICATE_CORPUS.filter((n) => genCut(n, 25).power === 8);
    expect(generatorDisarms).toHaveLength(3);
    expect(PREDICATE_CORPUS.length - generatorDisarms.length).toBe(14);
  });
});
