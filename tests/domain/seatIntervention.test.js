/**
 * tests/domain/seatIntervention.test.js — W-SEAT D9 (SEAT-2c)'s home.
 *
 * ⭐ THESE GREENS ARE DISCOVERY-GRADE, NOT REGRESSION-GRADE, AND THE DISTINCTION IS THE
 * ONE SEAT-1 ASKED EVERY LATER CAR TO STATE. Two arms below measure a live behaviour that
 * the tree does NOT have today and the prose already claims it does:
 *
 *   1. `pulseKernel.js` says of `interventionAdjFor` — "the arriving army tilts the verdict
 *      it reaches in time; a column that arrives after the verdict marched to yesterday's
 *      coup." There was no time term in that function at all. The BASE arm below proves a
 *      six-week-distant column tilted the verdict exactly as hard as the neighbour across
 *      the ford, which is the sentence being false.
 *   2. `interventionLegitimacy` computes and rounds a `legitimacyCost` whose only consumer
 *      tree-wide is a news TAG that reads its sibling flag. `LEGIT_COST_UNINVITED: 0.45`
 *      priced nothing: an army that came uninvited paid exactly what an invited one paid.
 *
 * The rest are the dormancy and identity pins the seat family owes at every car.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  SEAT_INTERVENTION_TUNING,
  seatInterventionLit,
  seatSuitorsFor,
  seatMarchTicks,
  seatColumnArrived,
  seatColumnKeep01,
} from '../../src/domain/worldPulse/seatIntervention.js';
import {
  advanceIntervention,
  interventionAdjFor,
  interventionLedger,
  interventionLegitimacy,
  CONVERGENCE_TUNING,
  INTERVENTION_SIDES,
} from '../../src/domain/worldPulse/convergence.js';
import { foreignSeatOf } from '../../src/domain/rulingPowerSeat.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const TOWN = 'ford';
const OVERLORD = 'crown';
const NEIGHBOUR = 'delve';

const SEAT_LIT = { warLayerEnabled: true, interventionEnabled: true, foreignSeatEnabled: true };
const SEAT_DARK = { warLayerEnabled: true, interventionEnabled: true };

// ── Fixtures ────────────────────────────────────────────────────────────────

function settlementOf(name, factions) {
  return {
    name, tier: 'city', population: 9000,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { prosperity: 'Wealthy', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 45, label: 'Strained' },
      factions: factions || [{ faction: 'Town Council', category: 'civic', power: 50, isGoverning: true }],
      conflicts: [],
    },
    npcs: [], activeConditions: [],
  };
}

function snapshotOf(worldState, extra = {}) {
  const byId = new Map([
    [TOWN, { id: TOWN, name: 'Ferrywater', settlement: settlementOf('Ferrywater', [
      { faction: 'Town Council', category: 'civic', power: 40, isGoverning: true },
      { faction: 'The Garrison', category: 'military', power: 36 },
    ]) }],
    [OVERLORD, { id: OVERLORD, name: 'Crownhold', settlement: settlementOf('Crownhold') }],
    [NEIGHBOUR, { id: NEIGHBOUR, name: 'Delvemoor', settlement: settlementOf('Delvemoor') }],
  ]);
  return { byId, settlements: [...byId.values()], worldState, regionalGraph: { edges: [], channels: [] }, ...extra };
}

/** The `vassalized` rung whose relationship relabel never landed — one of the two EDGE-LESS
 *  seat bases, and therefore one of the two the widening exists for. */
const rungWorld = (rules = SEAT_LIT) => ({
  simulationRules: rules,
  occupations: { [TOWN]: { occupierId: OVERLORD, state: 'vassalized', resistance: 0.1 } },
});

/** Subordinating treaty ties alone — the other EDGE-LESS basis. */
const treatyWorld = (rules = SEAT_LIT) => ({
  simulationRules: rules,
  spatialLedgers: {
    treaties: {
      t1: {
        victorId: OVERLORD, loserId: TOWN,
        terms: Array.from({ length: 4 }, () => ({ type: 'tribute', complianceState: 'honored' })),
      },
    },
  },
});

const EDGE_CANDIDATES = Object.freeze([{ otherId: NEIGHBOUR, relType: 'trade_partner' }]);

// ── (1) The gate, and dormancy by REFERENCE + by EXACT ONE ──────────────────

describe('SEAT-2c — the gate is the SEAT key, and dark is the identity', () => {
  it('reads foreignSeatEnabled with the strict === true idiom, refusing every truthy non-true', () => {
    // ⛔ The positive spelling is what the engine-gated-key census can SEE; a negative-
    // polarity early return reads identically at runtime and is invisible to it. SEAT-1
    // paid a red for that and the scar rides every seat-family read site.
    expect(seatInterventionLit({ simulationRules: { foreignSeatEnabled: true } })).toBe(true);
    for (const truthy of ['true', 1, {}, [], 'yes']) {
      expect(seatInterventionLit({ simulationRules: { foreignSeatEnabled: truthy } }), String(truthy)).toBe(false);
    }
    expect(seatInterventionLit({ simulationRules: {} })).toBe(false);
    expect(seatInterventionLit({})).toBe(false);
    expect(seatInterventionLit(null)).toBe(false);
  });

  it('DARK: the suitor list is the SAME ARRAY REFERENCE, not an equal copy', () => {
    // Reference identity, not deep equality: it is what makes the widening incapable of
    // perturbing iteration order or allocation on a preset-lit intervention world.
    const ws = rungWorld(SEAT_DARK);
    expect(seatSuitorsFor(ws, snapshotOf(ws), TOWN, EDGE_CANDIDATES)).toBe(EDGE_CANDIDATES);
  });

  it('DARK: the keep factor is EXACTLY 1 for every record shape, including garbage', () => {
    // `x * 1 === x` is bit-exact for every finite double — that is the whole reason the
    // dark share can be claimed byte-identical rather than merely close.
    const ws = { simulationRules: SEAT_DARK };
    for (const rec of [
      { interId: OVERLORD, target: TOWN, invited: false, sinceTick: 0 },
      { interId: OVERLORD, target: TOWN, invited: true, sinceTick: 99 },
      {}, null, undefined, { sinceTick: 'nonsense' },
    ]) {
      expect(seatColumnKeep01(ws, rec, 40), JSON.stringify(rec)).toBe(1);
    }
  });

  it('LIT but seatless: the suitor list is still the same reference', () => {
    const ws = { simulationRules: SEAT_LIT };
    expect(seatSuitorsFor(ws, snapshotOf(ws), TOWN, EDGE_CANDIDATES)).toBe(EDGE_CANDIDATES);
  });
});

// ── (2) The eligibility rule, and its live population MEASURED ──────────────

describe('SEAT-2c — the eligibility rule: an edge OR a seat', () => {
  it('the two EDGE-LESS bases are admitted, and they are the ones the mover is blind to', () => {
    for (const [label, world] of [['occupation_rung_vassalized', rungWorld()], ['treaty_subordinating_ties', treatyWorld()]]) {
      const snapshot = snapshotOf(world);
      // The premise: this basis genuinely resolves a seat whose patron holds NO edge.
      expect(foreignSeatOf(world, snapshot, TOWN)?.basis, label).toBe(label);
      const widened = seatSuitorsFor(world, snapshot, TOWN, EDGE_CANDIDATES);
      expect(widened, label).not.toBe(EDGE_CANDIDATES);
      expect(widened.map((c) => c.otherId), label).toEqual([OVERLORD, NEIGHBOUR].sort());
      expect(widened.find((c) => c.otherId === OVERLORD)?.relType, label).toBe('vassal');
    }
  });

  it('a seat whose patron is ALREADY an edge neighbour adds nothing — the same reference', () => {
    // This is what makes the double-admission failure structurally impossible rather than
    // merely untested: a court cannot be counted twice because the second copy is refused
    // before the array is ever rebuilt.
    const world = rungWorld();
    const candidates = [{ otherId: OVERLORD, relType: 'allied' }, { otherId: NEIGHBOUR, relType: 'rival' }];
    expect(seatSuitorsFor(world, snapshotOf(world), TOWN, candidates)).toBe(candidates);
  });

  it('the widened list stays codepoint-sorted, so the mover\'s iteration stays deterministic', () => {
    const world = rungWorld();
    const widened = seatSuitorsFor(world, snapshotOf(world), TOWN, EDGE_CANDIDATES);
    const ids = widened.map((c) => c.otherId);
    expect([...ids].sort()).toEqual(ids);
  });

  it('a settlement is never its own suitor', () => {
    const world = { simulationRules: SEAT_LIT, occupations: { [TOWN]: { occupierId: TOWN, state: 'vassalized' } } };
    expect(seatSuitorsFor(world, snapshotOf(world), TOWN, EDGE_CANDIDATES)).toBe(EDGE_CANDIDATES);
  });
});

// ── (3) THE DISCOVERY ARM: the mover admits a suitor it could not see ───────

describe('SEAT-2c — the mover, driven: an edge-less overlord reaches the contest', () => {
  const coupStressor = () => ({
    id: 'world_stressor.coup_detat.ford', type: 'coup_detat', severity: 0.55, peakSeverity: 0.55,
    originSettlementId: TOWN, affectedSettlementIds: [TOWN],
    originContext: { sponsorSettlementId: null },
  });
  // Every fork rolls 0 so the loaded dice always fire: this pin is about WHO the rule makes
  // available, not about the rarity of the roll (the CS-B3 fixture's own reasoning).
  const certainRng = { fork: () => ({ random: () => 0 }) };

  /** Drive the real mover N ticks over a world whose ONLY foreign tie to the contested
   *  town is the `vassalized` rung — no relationship edge anywhere. */
  function drive(rules, ticks) {
    let worldState = { ...rungWorld(rules), tick: 1, stressors: [coupStressor()] };
    const snapshot = snapshotOf(worldState);
    const census = [];
    for (let t = 1; t <= ticks; t += 1) {
      worldState = { ...worldState, stressors: [coupStressor()] };
      const r = advanceIntervention({
        snapshot, worldState, graph: { edges: [], channels: [] }, rng: certainRng, tick: t, now: '2026-01-01T00:00:00.000Z',
      });
      worldState = r.worldState;
      const ledger = interventionLedger(worldState) || {};
      census.push(Object.keys(ledger).sort().map((k) => `${ledger[k].interId}->${ledger[k].target}:${ledger[k].side}:${ledger[k].motive}`));
    }
    return { census, worldState };
  }

  it('BASE (seat key dark): no edge ⇒ no suitor ⇒ the ledger never opens', () => {
    // The defect, stated as a measurement: an overlord that holds this town by the ladder's
    // own top rung is invisible to the mover, because the mover can only see edges.
    expect(drive(SEAT_DARK, 4).census).toEqual([[], [], [], []]);
  });

  it('LIT: the overlord commits, once, as an INVITED incumbent-prop on preserve_order', () => {
    const { census, worldState } = drive(SEAT_LIT, 4);
    expect(census[0]).toEqual([`${OVERLORD}->${TOWN}:incumbent:preserve_order`]);
    // ⭐ ANTI-VACUITY: the admitted suitor must be able to SCORE. Labelling it with an
    // invented relType would have scored no motive at all and the arm would have passed
    // every existence census while admitting a court that can never act.
    const ledger = interventionLedger(worldState) || {};
    const rows = Object.values(ledger);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ interId: OVERLORD, target: TOWN, side: INTERVENTION_SIDES.INCUMBENT, invited: true });
    // CONSERVED COLUMNS (A1.2.13's first item): the widened rule must not let a court field
    // a second army. One court, one column, across every tick.
    for (const tick of census) expect(tick).toHaveLength(1);
  });
});

// ── (4) The march — hop-priced through the estate's ONE march derivation ────

describe('SEAT-2c — the march delay', () => {
  it('no spatial canon ⇒ 0 ticks: an aspatial world keeps its instant answer', () => {
    expect(seatMarchTicks({ spatialDigest: { distanceMatrix: {} } }, OVERLORD, TOWN)).toBe(0);
    expect(seatMarchTicks({ spatialCanonVersion: 1 }, OVERLORD, TOWN)).toBe(0);
    expect(seatMarchTicks(null, OVERLORD, TOWN)).toBe(0);
  });

  it('same settlement, and an UNMAPPED pair, both yield 0 — no path ⇒ no surcharge', () => {
    // The second half is `hopDelayTicks`'s own documented discipline, taken verbatim: the
    // alternative (an unreachable pair never arriving) would silently delete an
    // intervention the mover lawfully committed.
    const ws = { spatialCanonVersion: 1, spatialDigest: { distanceMatrix: {}, settlementIds: [] } };
    expect(seatMarchTicks(ws, TOWN, TOWN)).toBe(0);
    expect(seatMarchTicks(ws, OVERLORD, TOWN)).toBe(0);
  });

  it('a column that has not arrived tilts NOTHING, and one that has keeps its share', () => {
    // A step, not a ramp: an army is at the contest or on the road. There is no fractional
    // column, and a coup that resolves first is decided without it.
    const ws = { simulationRules: SEAT_LIT };
    const rec = { interId: OVERLORD, target: TOWN, invited: true, sinceTick: 10 };
    // With no digest the march is 0 ticks, so arrival is immediate at the commit tick.
    expect(seatColumnArrived(ws, rec, 10)).toBe(true);
    // A caller with NO clock cannot judge the march and keeps the pre-D9 answer.
    expect(seatColumnArrived(ws, rec, null)).toBe(true);
    expect(seatColumnKeep01(ws, rec, null)).toBe(1);
  });

  // ⛔ THE ARMS ABOVE CANNOT DISCOVER ANYTHING ABOUT THE MARCH — with no digest the delay
  // is always 0 and `arrived` is always true, so a green there says only that the aspatial
  // path is untouched. These drive a REAL digest, and they are the arms that would red if
  // the march term were deleted.
  it('DISCOVERY: the march is monotone in distance, and a distant column is NOT at the contest', () => {
    const digestWorld = (cost) => ({
      simulationRules: SEAT_LIT,
      spatialCanonVersion: 1,
      spatialDigest: {
        settlementIds: [OVERLORD, TOWN, NEIGHBOUR],
        distanceMatrix: {
          [OVERLORD]: { [TOWN]: cost, [NEIGHBOUR]: 1 },
          [TOWN]: { [OVERLORD]: cost, [NEIGHBOUR]: 1 },
          [NEIGHBOUR]: { [OVERLORD]: cost, [TOWN]: 1 },
        },
      },
    });
    // MONOTONE, and never falling: the estate's own `armyMarchWeeks` is the derivation, so
    // this pins that the reuse is real rather than a second march math wearing its name.
    const ticks = [1, 2, 4, 8, 16].map((c) => seatMarchTicks(digestWorld(c), OVERLORD, TOWN));
    expect(ticks).toEqual([...ticks].sort((a, b) => a - b));
    expect(ticks[0]).toBeGreaterThan(0);
    expect(ticks[ticks.length - 1]).toBeGreaterThan(ticks[0]);

    // THE STEP, on a far column: nothing until it lands, its whole invited share after.
    const far = digestWorld(8);
    const march = seatMarchTicks(far, OVERLORD, TOWN);
    const rec = { interId: OVERLORD, target: TOWN, invited: true, sinceTick: 10 };
    expect(seatColumnArrived(far, rec, 10 + march - 1)).toBe(false);
    expect(seatColumnKeep01(far, rec, 10 + march - 1)).toBe(0);
    expect(seatColumnArrived(far, rec, 10 + march)).toBe(true);
    expect(seatColumnKeep01(far, rec, 10 + march)).toBe(1);

    // ⭐ THE SENTENCE `pulseKernel` ALREADY WROTE, NOW TRUE: the near neighbour reaches the
    // verdict the far overlord misses, on the same tick, from the same commitment.
    const near = { interId: NEIGHBOUR, target: TOWN, invited: true, sinceTick: 10 };
    const nearMarch = seatMarchTicks(far, NEIGHBOUR, TOWN);
    expect(nearMarch).toBeLessThan(march);
    expect(seatColumnKeep01(far, near, 10 + nearMarch)).toBe(1);
    expect(seatColumnKeep01(far, rec, 10 + nearMarch)).toBe(0);
  });

  it('DISCOVERY: the distant column\'s tilt is absent from the verdict read, then present', () => {
    // The same fact at the CONSUMER, because a keep factor nobody multiplies is a number,
    // not a behaviour.
    const ws = (tick) => [{
      simulationRules: SEAT_LIT,
      spatialCanonVersion: 1,
      spatialDigest: {
        settlementIds: [OVERLORD, TOWN],
        distanceMatrix: { [OVERLORD]: { [TOWN]: 8 }, [TOWN]: { [OVERLORD]: 8 } },
      },
      spatialLedgers: {
        interventions: {
          'crown:ford': {
            interId: OVERLORD, target: TOWN, side: 'incumbent', motive: 'preserve_order',
            invited: true, strength: 60, sinceTick: 10, lastTick: 10,
          },
        },
      },
    }, tick];
    const [world] = ws(0);
    const march = seatMarchTicks(world, OVERLORD, TOWN);
    expect(interventionAdjFor(world, TOWN, 10 + march - 1)).toBe(0);
    expect(interventionAdjFor(world, TOWN, 10 + march)).toBe(CONVERGENCE_TUNING.PHOLD_WEIGHT);
    // BASE: with the seat key dark the same far column tilts at FULL weight from the tick
    // it commits — the defect, stated as a measurement.
    const dark = { ...world, simulationRules: SEAT_DARK };
    expect(interventionAdjFor(dark, TOWN, 10)).toBe(CONVERGENCE_TUNING.PHOLD_WEIGHT);
  });
});

// ── (5) The welcome — the price that was computed and never charged ─────────

describe('SEAT-2c — uninvited entry finally costs something', () => {
  it('THE HOLE, MEASURED: the legitimacy price is nine times higher uninvited and reaches nothing', () => {
    // A discovery arm about the BASE tree, kept because it is the reason this half exists.
    const invited = interventionLegitimacy({ side: INTERVENTION_SIDES.INCUMBENT, invited: true });
    const uninvited = interventionLegitimacy({ side: INTERVENTION_SIDES.CHALLENGER, invited: false });
    expect(uninvited.legitimacyCost).toBeGreaterThan(invited.legitimacyCost * 8);
    // ...and the ONLY consumer of that record anywhere outside its own unit test reads the
    // SIBLING flag for a news tag. The cost itself is spent nowhere. Proven by source scan
    // rather than by assertion, so the day someone charges it, this pin is what tells them
    // to come back and delete it.
    const convergenceSrc = readFileSync(join(ROOT, 'src/domain/worldPulse/convergence.js'), 'utf8');
    const chargeSites = convergenceSrc.split('\n').filter((l) => /legitimacyCost/.test(l) && !/^\s*\*/.test(l));
    expect(chargeSites.map((l) => l.trim()), 'legitimacyCost is still declared and never spent')
      .toEqual(['legitimacyCost: round4(cost),']);
  });

  it('an UNINVITED arrived column keeps less of its share than an invited one', () => {
    const ws = { simulationRules: SEAT_LIT };
    const base = { interId: OVERLORD, target: TOWN, sinceTick: 0 };
    expect(seatColumnKeep01(ws, { ...base, invited: true }, 5)).toBe(1);
    expect(seatColumnKeep01(ws, { ...base, invited: false }, 5)).toBe(SEAT_INTERVENTION_TUNING.UNINVITED_TILT_KEEP01);
    expect(SEAT_INTERVENTION_TUNING.UNINVITED_TILT_KEEP01).toBeGreaterThan(0);
    expect(SEAT_INTERVENTION_TUNING.UNINVITED_TILT_KEEP01).toBeLessThan(1);
  });

  it('⛔ the keep factor is DECLARED, never derived from the legitimacy price', () => {
    // §711.6: a legitimacy PRICE is a standing debit on a court; a tilt KEEP is a
    // dimensionless factor on a strength share. `1 - LEGIT_COST_UNINVITED` happens to equal
    // this number today, and that coincidence is stated in the leaf's own header on
    // settlementPolitics.js's precedent. This pin makes the fold impossible to land
    // quietly: the leaf may not so much as name the convergence tuning.
    const leafSrc = readFileSync(join(ROOT, 'src/domain/worldPulse/seatIntervention.js'), 'utf8');
    const code = leafSrc.split('\n').filter((l) => !/^\s*(\*|\/\/)/.test(l)).join('\n');
    // THE LIVENESS ANCHOR (EP-1), and it is not ceremony: the subject here is a
    // COMMENT-STRIPPED source string, so the two ways this negative could go vacuous are the
    // leaf being renamed/moved and the strip regex eating the whole body. Both leave `code`
    // empty or tiny, and a bare not.toMatch passes happily on an empty string. Asserting the
    // tuning constant IS still in the stripped source proves the subject is the real leaf's
    // real code before the exclusion is allowed to mean anything.
    expect(code, 'the stripped leaf source no longer contains its own tuning constant — the subject drifted, so the exclusion below would be vacuous').toMatch(/UNINVITED_TILT_KEEP01/);
    // anchored: the assertion directly above proves `code` is the live, non-empty, stripped leaf source travelling the same read path, so this exclusion cannot pass by the subject having drifted away
    expect(code).not.toMatch(/LEGIT_COST|CONVERGENCE_TUNING/);
    // And the coincidence itself, asserted so a tuning pass that breaks it is VISIBLE here
    // rather than silently making the header's comment a lie.
    expect(SEAT_INTERVENTION_TUNING.UNINVITED_TILT_KEEP01)
      .toBeCloseTo(1 - CONVERGENCE_TUNING.LEGIT_COST_UNINVITED, 10);
  });
});

// ── (6) The adj read: bit identity when dark, and the discount when lit ─────

describe('SEAT-2c — interventionAdjFor', () => {
  const ledgerOf = (rows) => ({ spatialLedgers: { interventions: rows } });
  const twoColumns = {
    'crown:ford': { interId: OVERLORD, target: TOWN, side: 'incumbent', motive: 'preserve_order', invited: false, strength: 60, sinceTick: 1, lastTick: 1 },
    'delve:ford': { interId: NEIGHBOUR, target: TOWN, side: 'incumbent', motive: 'preserve_order', invited: true, strength: 40, sinceTick: 1, lastTick: 1 },
  };

  it('DARK: passing a tick changes nothing — bit-identical to the pre-D9 read', () => {
    const ws = { simulationRules: SEAT_DARK, ...ledgerOf(twoColumns) };
    const without = interventionAdjFor(ws, TOWN);
    const withTick = interventionAdjFor(ws, TOWN, 40);
    expect(withTick).toBe(without);
    // And the value is the un-discounted one: both columns back the incumbent, so the net
    // share is 1 and the term is the full PHOLD_WEIGHT.
    expect(without).toBe(CONVERGENCE_TUNING.PHOLD_WEIGHT);
  });

  it('the DARK share arithmetic is bit-identical across a swept grid, never merely close', () => {
    // The predecessor's lesson, applied: a single hand-picked pair is a coin flip about a
    // bit-identity claim. `(s/total) * 1` and `s/total` must agree on EVERY cell.
    let cells = 0;
    for (let a = 1; a <= 120; a += 1) {
      for (let b = 1; b <= 120; b += 1) {
        const rows = {
          'crown:ford': { ...twoColumns['crown:ford'], strength: a },
          'delve:ford': { ...twoColumns['delve:ford'], strength: b },
        };
        const ws = { simulationRules: SEAT_DARK, ...ledgerOf(rows) };
        expect(interventionAdjFor(ws, TOWN, 40)).toBe(interventionAdjFor(ws, TOWN));
        cells += 1;
      }
    }
    expect(cells).toBe(14400);
  });

  it('LIT: the uninvited column\'s share is discounted, so the tilt falls', () => {
    const dark = interventionAdjFor({ simulationRules: SEAT_DARK, ...ledgerOf(twoColumns) }, TOWN, 40);
    const lit = interventionAdjFor({ simulationRules: SEAT_LIT, ...ledgerOf(twoColumns) }, TOWN, 40);
    expect(lit).toBeLessThan(dark);
    expect(lit).toBeGreaterThan(0);
    // The arithmetic, spelled: 0.6 of the strength is uninvited and keeps 0.55; 0.4 is
    // invited and keeps all of it.
    const expected = CONVERGENCE_TUNING.PHOLD_WEIGHT * (0.6 * SEAT_INTERVENTION_TUNING.UNINVITED_TILT_KEEP01 + 0.4);
    expect(lit).toBeCloseTo(expected, 4);
  });

  it('LIT with no records is still exactly 0 — the layer cannot invent a tilt', () => {
    expect(interventionAdjFor({ simulationRules: SEAT_LIT }, TOWN, 40)).toBe(0);
    expect(interventionAdjFor({ simulationRules: SEAT_LIT, ...ledgerOf({}) }, TOWN, 40)).toBe(0);
  });
});
