/**
 * tests/domain/foreignSeatResolver.test.js — W-SEAT SEAT-1's unit home.
 *
 * The volume's new-file bill is 2 for the whole W-SEAT program (the unit home and the
 * dormancy byte-identity pin); both land in this car, batched, so the lighting census is
 * re-measured once rather than twice.
 *
 * ⚠ THESE GREENS ARE REGRESSION-GRADE, NOT DISCOVERY-GRADE, AND SAYING SO IS THE POINT
 * (A1.2.15). `foreignSeatOf` has NO production consumer at SEAT-1 — it is written, pinned,
 * and unreached, exactly as the design intends — so every arm below proves the resolver
 * answers what it was specified to answer, and NONE of them can discover that a live
 * decision moved. SEAT-2a wires the resolver into the seat books and the decision choke and
 * carries the discovery-grade lit proof. A green here means "the law is written correctly",
 * never "the world changed".
 *
 * The ONE exception is the occupied-predicate delta below, which IS a discovery arm: it
 * measures two live spellings against each other and found them divergent in both
 * directions.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  foreignSeatOf,
  occupationRegimeOf,
  legitimateRemnantOf,
  vassalOverlordOf,
  GRIP_SCALE,
  SEAT_TUNING,
  OCCUPATION_RUNGS,
} from '../../src/domain/rulingPowerSeat.js';
import { OCCUPATION_TUNING } from '../../src/domain/worldPulse/occupation.js';
import { STRESSOR_SPAWN_GATES, activeTypesAt } from '../../src/domain/worldPulse/stressorGates.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// ── Fixtures ────────────────────────────────────────────────────────────────

const OCCUPIER = 'ironhold';
const TOWN = 'town';

/** A seat exposed enough that only the occupied test decides the coup gate. */
function exposedSettlement() {
  return {
    powerStructure: {
      governingName: 'Town Council',
      publicLegitimacy: { score: 22, label: 'Legitimacy Crisis', govMultiplier: 0.6 },
      factions: [
        { faction: 'Town Council', power: 30, isGoverning: true },
        { faction: 'Garrison', power: 55, category: 'military' },
      ],
    },
  };
}

function snapshotFor(worldState) {
  return {
    byId: new Map([[TOWN, {
      id: TOWN,
      settlement: exposedSettlement(),
      causal: { scores: { ruling_authority: 20 } },
    }]]),
    settlements: [{ id: TOWN, name: 'Town' }, { id: OCCUPIER, name: 'Ironhold' }],
    worldState,
  };
}

const ledgerWorld = (state, resistance = 0.2) => ({
  occupations: { [TOWN]: { occupierId: OCCUPIER, state, resistance } },
});
const stressorWorld = () => ({
  stressors: [{ id: 's1', type: 'occupation', status: 'active', affectedSettlementIds: [TOWN] }],
});

const coupGate = STRESSOR_SPAWN_GATES.coup_detat;
const PRESSURE = { settlementId: TOWN, score: 0.8 };
/** true when the gate REFUSES the birth. */
const gateBlocks = (worldState) => coupGate(snapshotFor(worldState), PRESSURE) === null;

// ── The pinned second spelling ──────────────────────────────────────────────

describe('SEAT-1 — the mirrored ladder', () => {
  it('OCCUPATION_RUNGS equals occupation.js STATE_LADDER, so the second spelling cannot drift', () => {
    // The seat leaf mirrors the rung order rather than importing occupation.js (a heavy
    // tick kernel) into a read leaf. Pinned rather than shared — the same treatment
    // warSeatBooks.seatAddressFactionId gives realmFactionPulseId.
    expect([...OCCUPATION_RUNGS]).toEqual([...OCCUPATION_TUNING.STATE_LADDER]);
  });

  it('GRIP_SCALE is its OWN table and is not the benefit scale', () => {
    // §711.6: a numeric table with two meanings acquires a different unit at every
    // consumer. GRIP is political reach; BENEFIT is economic yield. They MUST differ at
    // the bottom of the ladder — a contested occupation yields nothing and still commands
    // the town at spearpoint — and `vassalized` is absent from GRIP by A1.1.8's ruling.
    expect(GRIP_SCALE.contested).not.toBe(OCCUPATION_TUNING.STATE_BENEFIT_SCALE.contested); // anchored: benefit is 0.0 at contested, grip is not
    expect(GRIP_SCALE.contested).toBeGreaterThan(0);
    expect(OCCUPATION_TUNING.STATE_BENEFIT_SCALE.contested).toBe(0);
    expect(Object.keys(GRIP_SCALE).sort()).toEqual(['contested', 'extractive', 'stabilized', 'unstable']);
    expect(Object.prototype.hasOwnProperty.call(GRIP_SCALE, 'vassalized')).toBe(false);
  });
});

// ── The resolver ────────────────────────────────────────────────────────────

describe('SEAT-1 — foreignSeatOf, the one seat read', () => {
  it('is INERT-NOT-CRASH on every absent or garbage world', () => {
    for (const ws of [null, undefined, {}, 42, 'x', [], { occupations: null }, { occupations: 'x' }, { occupations: { [TOWN]: null } }]) {
      expect(foreignSeatOf(ws, null, TOWN), `garbage world ${JSON.stringify(ws)}`).toBeNull();
    }
    expect(foreignSeatOf({}, {}, '')).toBeNull();
  });

  it('an occupation below the top rung seats the occupier WITH PRIMACY', () => {
    const seat = foreignSeatOf(ledgerWorld('stabilized'), snapshotFor(ledgerWorld('stabilized')), TOWN);
    expect(seat).toMatchObject({
      regime: 'occupation',
      patronSettlementId: OCCUPIER,
      primacy: true,
      rung: 'stabilized',
      basis: 'occupations_ledger',
    });
    expect(seat.weight01).toBeGreaterThan(0);
    expect(SEAT_TUNING.BANDS.map((b) => b.band)).toContain(seat.band);
  });

  it('grip climbs the ladder and falls with resistance', () => {
    const gripAt = (state, resistance) => foreignSeatOf(
      ledgerWorld(state, resistance), snapshotFor(ledgerWorld(state, resistance)), TOWN,
    ).grip01;
    expect(gripAt('contested', 0)).toBeLessThan(gripAt('unstable', 0));
    expect(gripAt('unstable', 0)).toBeLessThan(gripAt('extractive', 0));
    expect(gripAt('extractive', 0)).toBeLessThan(gripAt('stabilized', 0));
    // A town in open revolt is not held, whatever the rung says.
    expect(gripAt('stabilized', 0.9)).toBeLessThan(gripAt('stabilized', 0.1));
    expect(gripAt('stabilized', 1)).toBe(0);
  });

  it('A1.1.8 — the `vassalized` rung resolves VASSALAGE, never occupation primacy', () => {
    // The ladder's top rung never exits the ledger (the sale machinery needs the row), so
    // a presence-only predicate would keep a matured vassal under occupation primacy — and
    // under W-COIN's zero-tax rule — forever, making `cultivate` the road to permanent
    // maximal domination and inverting the owner's design.
    const ws = ledgerWorld('vassalized', 0.1);
    const seat = foreignSeatOf(ws, snapshotFor(ws), TOWN);
    expect(seat.regime).toBe('vassalage');
    expect(seat.primacy).toBe(false);
    expect(occupationRegimeOf(ws, TOWN)).toMatchObject({ occupied: false, ledgerPresent: true });
  });

  it('an unknown rung is held at the contested floor, never silently freed', () => {
    const ws = { occupations: { [TOWN]: { occupierId: OCCUPIER, state: 'nonsense', resistance: 0 } } };
    expect(occupationRegimeOf(ws, TOWN)).toMatchObject({ occupied: true, rung: 'contested' });
  });

  it('a vassal EDGE on which the settlement is the junior seats the overlord by weight', () => {
    const edge = { id: 'e1', from: OCCUPIER, to: TOWN, relationshipType: 'vassal' };
    const worldState = {
      relationshipStates: {
        e1: {
          relationshipType: 'vassal', overlordSaveId: OCCUPIER, vassalSaveId: TOWN,
          leverage: 0.82, dependency: 0.82, pactStrength: 0.58, fear: 0.48, resentment: 0.48,
        },
      },
    };
    const snapshot = { ...snapshotFor(worldState), regionalGraph: { edges: [edge], channels: [] } };
    const seat = foreignSeatOf(worldState, snapshot, TOWN);
    expect(seat).toMatchObject({ regime: 'vassalage', patronSettlementId: OCCUPIER, primacy: false, basis: 'vassal_edge' });
    expect(seat.weight01).toBeGreaterThan(0);
  });

  it('the SENIOR side of a vassal edge has no seat over it', () => {
    const edge = { id: 'e1', from: OCCUPIER, to: TOWN, relationshipType: 'vassal' };
    const worldState = {
      relationshipStates: { e1: { relationshipType: 'vassal', overlordSaveId: OCCUPIER, vassalSaveId: TOWN } },
    };
    const snapshot = { byId: new Map(), settlements: [], worldState, regionalGraph: { edges: [edge], channels: [] } };
    expect(foreignSeatOf(worldState, snapshot, OCCUPIER)).toBeNull();
  });

  it('a subordinating treaty tie ALONE is capped at `present` — pressure, not a seat', () => {
    // Chair ruling (§3-D1), owner-vetoable: influence without a compact never reaches the
    // `strong` band however many terms are owed.
    const worldState = {
      spatialLedgers: {
        treaties: {
          t1: {
            victorId: OCCUPIER, loserId: TOWN,
            terms: Array.from({ length: 8 }, () => ({ type: 'tribute', complianceState: 'honored' })),
          },
        },
      },
    };
    const seat = foreignSeatOf(worldState, snapshotFor(worldState), TOWN);
    expect(seat).toMatchObject({ regime: 'vassalage', patronSettlementId: OCCUPIER, basis: 'treaty_subordinating_ties', primacy: false });
    expect(seat.weight01).toBeLessThanOrEqual(SEAT_TUNING.TREATY_ONLY_CEILING);
    expect(['present', 'marginal']).toContain(seat.band);
  });

  it('a NON-subordinating treaty term seats nobody (resource_share is extraction, not subordination)', () => {
    const worldState = {
      spatialLedgers: { treaties: { t1: { victorId: OCCUPIER, loserId: TOWN, terms: [{ type: 'resource_share' }] } } },
    };
    expect(foreignSeatOf(worldState, snapshotFor(worldState), TOWN)).toBeNull();
  });

  it('an occupation EXTINGUISHES a rival treaty seat (A1.2.15 multi-patron)', () => {
    const worldState = {
      ...ledgerWorld('extractive'),
      spatialLedgers: { treaties: { t1: { victorId: 'creditor', loserId: TOWN, terms: [{ type: 'tribute' }] } } },
    };
    const seat = foreignSeatOf(worldState, snapshotFor(worldState), TOWN);
    expect(seat.patronSettlementId).toBe(OCCUPIER);
    expect(seat.regime).toBe('occupation');
  });

  it('is deterministic and writes nothing', () => {
    const worldState = ledgerWorld('stabilized');
    const before = JSON.stringify(worldState);
    const a = foreignSeatOf(worldState, snapshotFor(worldState), TOWN);
    const b = foreignSeatOf(worldState, snapshotFor(worldState), TOWN);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(JSON.stringify(worldState)).toBe(before);
  });

  it('the leaf holds no rng, no clock, and no writer (source arm)', () => {
    const src = readFileSync(join(ROOT, 'src/domain/rulingPowerSeat.js'), 'utf8');
    expect(/Math\.random/.test(src)).toBe(false);
    expect(/\bnew Date\b|Date\.now/.test(src)).toBe(false);
    expect(/setSpatialLedger/.test(src)).toBe(false);
  });
});

// ── The remnant ─────────────────────────────────────────────────────────────

describe('SEAT-1 — legitimateRemnantOf (A1.1.9)', () => {
  const withFactions = (factions) => ({ powerStructure: { governingName: 'Occupation Authority', factions } });

  it('is the strongest faction that is neither the crowned seat nor the occupier', () => {
    const remnant = legitimateRemnantOf(withFactions([
      { faction: 'Occupation Authority', power: 60, isGoverning: true },
      { faction: 'Ironhold occupation authority', power: 90, category: 'occupation', modifiers: ['occupier'] },
      { faction: 'Merchant League', power: 45 },
      { faction: 'Temple', power: 30 },
    ]));
    expect(remnant?.faction).toBe('Merchant League');
  });

  it('excludes the occupier by ARCHETYPE — the shape the sim actually mints', () => {
    // `applyWorldPulseOccupationAuthority` mints the occupier row with
    // `category: 'occupation'`, and `factionArchetype` reads category first.
    const remnant = legitimateRemnantOf(withFactions([
      { faction: 'Occupation Authority', power: 60, isGoverning: true },
      { faction: 'Ironhold occupation authority', power: 90, category: 'occupation', modifiers: ['occupier'] },
      { faction: 'Temple', power: 30 },
    ]));
    expect(remnant?.faction).toBe('Temple');
  });

  it('does NOT exclude on the `occupier` MODIFIER alone, and that is deliberate', () => {
    // ⚠ THIS PINS AN ABSENCE, AND THE ABSENCE WAS MEASURED RATHER THAN CHOSEN.
    // A `modifiers.includes('occupier')` belt was written here and removed:
    // `scripts/check-observed-shape-readers.mjs` measured it as a read of a key NO
    // GENERATOR PRODUCES (modifiers is sim-written only), so on a generated world the
    // arm is dead and can only degrade to its default. The estate carries that identity
    // as accepted debt in five files and its ratchet law forbids adding a sixth, so the
    // redundant belt was not worth a new inventory row. A row carrying the modifier but
    // NOT the archetype is a shape the estate never mints; if one ever appears, this
    // assertion is what will say so.
    const remnant = legitimateRemnantOf(withFactions([
      { faction: 'Occupation Authority', power: 60, isGoverning: true },
      { faction: 'Foreign Garrison', power: 90, category: 'military', modifiers: ['occupier'] },
      { faction: 'Temple', power: 30 },
    ]));
    expect(remnant?.faction).toBe('Foreign Garrison');
  });

  it('breaks a power tie on codepoint order, never locale collation', () => {
    const remnant = legitimateRemnantOf(withFactions([
      { faction: 'Occupation Authority', power: 60, isGoverning: true },
      { faction: 'Temple', power: 40 },
      { faction: 'Merchant League', power: 40 },
    ]));
    expect(remnant?.faction).toBe('Merchant League');
  });

  it('is null when nothing legitimate is left, and total on garbage', () => {
    expect(legitimateRemnantOf(withFactions([{ faction: 'Occupation Authority', power: 60, isGoverning: true }]))).toBeNull();
    for (const bad of [null, undefined, {}, 42, { powerStructure: null }, { powerStructure: { factions: 'x' } }]) {
      expect(legitimateRemnantOf(bad)).toBeNull();
    }
  });
});

// ── The resolver collapse ───────────────────────────────────────────────────

describe('SEAT-1 — the vassalOverlordOf collapse (law §2.1)', () => {
  it('preserves the traditions/relations.js semantics VERBATIM across every rung', () => {
    // The surviving semantics: the OCCUPATIONS LEDGER, the `vassalized` rung only, the
    // `occupierId` key. ⚠ NOT `overlordId` — a plausible-looking wrong key once reported a
    // zero for a whole sweep (tests/domain/advanceEpochStampSurvival.test.js:582).
    for (const rung of OCCUPATION_RUNGS) {
      const ws = ledgerWorld(rung);
      expect(vassalOverlordOf(ws, TOWN), rung).toBe(rung === 'vassalized' ? OCCUPIER : null);
    }
    expect(vassalOverlordOf({}, TOWN)).toBeNull();
    expect(vassalOverlordOf({ occupations: { [TOWN]: { state: 'vassalized', overlordId: OCCUPIER } } }, TOWN)).toBeNull();
    for (const bad of [null, undefined, 42, { occupations: 'x' }]) expect(vassalOverlordOf(bad, TOWN)).toBeNull();
  });

  it('exactly ONE exported vassalOverlordOf survives under src/ (source arm)', () => {
    const seat = readFileSync(join(ROOT, 'src/domain/rulingPowerSeat.js'), 'utf8');
    const occupation = readFileSync(join(ROOT, 'src/domain/worldPulse/occupation.js'), 'utf8');
    const relations = readFileSync(join(ROOT, 'src/domain/traditions/relations.js'), 'utf8');
    expect(/export function vassalOverlordOf/.test(seat)).toBe(true);
    expect(/export function vassalOverlordOf/.test(occupation)).toBe(false);
    expect(/function vassalOverlordOf/.test(relations)).toBe(false);
    expect(/import \{ vassalOverlordOf \} from '\.\.\/rulingPowerSeat\.js'/.test(relations)).toBe(true);
  });
});

// ── THE DISCOVERY ARM: the occupied-predicate delta (A1.1.2's measurement) ──

describe('SEAT-1 — the occupied-predicate delta, MEASURED', () => {
  /**
   * ⚠ THIS IS THE ONE DISCOVERY-GRADE BLOCK IN THIS FILE. A1.1.2 forbids assuming the
   * ledger and stressor spellings agree ("the move is ruled, not assumed"), so the delta is
   * measured here before the move is allowed to land, and the measurement is kept as a
   * standing pin rather than thrown away with the commit that used it.
   */
  const CELLS = [
    { name: 'neither', world: () => ({}), stressor: false, ledger: false },
    { name: 'ledger-only (a war-layer conquest)', world: () => ledgerWorld('stabilized'), stressor: false, ledger: true },
    { name: 'stressor-only (a generation/pressure birth)', world: stressorWorld, stressor: true, ledger: false },
    { name: 'both', world: () => ({ ...ledgerWorld('stabilized'), ...stressorWorld() }), stressor: true, ledger: true },
  ];

  it('the two spellings DIVERGE in both directions over the four-cell matrix', () => {
    for (const cell of CELLS) {
      const worldState = cell.world();
      expect(activeTypesAt(snapshotFor(worldState), TOWN).has('occupation'), `${cell.name}: stressor`).toBe(cell.stressor);
      expect(occupationRegimeOf(worldState, TOWN).occupied, `${cell.name}: ledger`).toBe(cell.ledger);
    }
    // Both directions are populated — that is the divergence, stated as an assertion.
    expect(CELLS.some((c) => c.ledger && !c.stressor)).toBe(true);
    expect(CELLS.some((c) => c.stressor && !c.ledger)).toBe(true);
  });

  it('DARK: the coup gate keeps the stressor spelling verbatim, ledger or no ledger', () => {
    for (const cell of CELLS) {
      const worldState = cell.world();
      expect(gateBlocks(worldState), `${cell.name}: flag absent`).toBe(cell.stressor);
      expect(gateBlocks({ ...worldState, simulationRules: { foreignSeatEnabled: false } }), `${cell.name}: flag false`).toBe(cell.stressor);
    }
  });

  it('DARK: the strict === true gate refuses every truthy non-true value', () => {
    for (const truthy of ['true', 1, {}, [], 'yes']) {
      expect(
        gateBlocks({ ...ledgerWorld('stabilized'), simulationRules: { foreignSeatEnabled: truthy } }),
        `truthy ${JSON.stringify(truthy)} lit the predicate`,
      ).toBe(false);
    }
  });

  it('LIT: the predicate is the UNION — it only ever blocks MORE, never fewer', () => {
    for (const cell of CELLS) {
      const worldState = { ...cell.world(), simulationRules: { foreignSeatEnabled: true } };
      expect(gateBlocks(worldState), `${cell.name}: lit`).toBe(cell.stressor || cell.ledger);
      // The superset law, asserted per cell rather than argued in prose.
      if (cell.stressor) expect(gateBlocks(worldState), `${cell.name}: lit must still block`).toBe(true);
    }
  });

  it('LIT: the ledger-only cell is the CURE — a coup no longer spawns under a live occupier', () => {
    const dark = ledgerWorld('stabilized');
    const lit = { ...dark, simulationRules: { foreignSeatEnabled: true } };
    expect(gateBlocks(dark)).toBe(false);
    expect(gateBlocks(lit)).toBe(true);
  });

  it('LIT: a matured vassal is NOT occupied, so its coup gate stays open', () => {
    const lit = { ...ledgerWorld('vassalized', 0.1), simulationRules: { foreignSeatEnabled: true } };
    expect(gateBlocks(lit)).toBe(false);
  });
});
