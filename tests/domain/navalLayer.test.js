/**
 * navalLayer.test.js — W-NAVY (DESIGN_NAVY.md) the pure-leaf behaviour suite.
 *
 * Stage 1 — THE NAVY: naval strength DERIVED (never persisted) from port geography (isPort)
 * ∧ a war-capable maritime institution (the Facet Law), scaled by economy tier + rented by
 * prosperity affordability; a parallel read, 0 for a non-port or a docks-only port.
 */
import { describe, expect, it } from 'vitest';

import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { isPort } from '../../src/domain/spatial/distanceRead.js';
import { ARMY_ROLES, armyRecordOf, armyMarchWeeks } from '../../src/domain/spatial/armyTransit.js';
import {
  navalStrengthOf, hasWarNavy, navalCapability01, isNavalInstitution, NAVAL_TUNING,
  navalRecordOf, planConvoy, convoyTransitWeeks, convoyEV, stormMultOf,
  convoyCapacityAvailable, seaEdgesOfPath, seaLaneCapacityOf,
} from '../../src/domain/spatial/navalLayer.js';
import { makeIslandPack } from '../fixtures/spatialPackFixtures.js';

const DOCK = { name: 'Docks/port facilities', tags: ['port', 'trade'] };
const SHIPYARD = { name: 'Shipyard', tags: ['transport', 'shipbuilding', 'port'] };
// A custom, genre-blind institution declaring naval capability through the facet chokepoint.
const DRYDOCK_GUILD = { name: 'The Tidewater Compact', facets: { institutionFunction: 'naval' } };

/** An island digest whose 'main' and 'isle' seats are both ports. */
function portDigest() {
  const { pack, placements } = makeIslandPack();
  return buildSpatialDigest({ pack, placements, seaLanes: true });
}

/** A snapshot item with the given institutions, tier, and prosperity. */
function item(institutions, { tier = 'town', prosperity = 'Comfortable' } = {}) {
  return { settlement: { tier, institutions, economicState: { prosperity } } };
}

describe('W-NAVY Stage 1 — isNavalInstitution (the Facet Law: declared ?? tag ?? name pattern)', () => {
  it('a Shipyard (shipbuilding tag) is war-capable; plain Docks are not', () => {
    expect(isNavalInstitution(SHIPYARD)).toBe(true);
    expect(isNavalInstitution(DOCK)).toBe(false);       // water access, not a war navy
    expect(isNavalInstitution({ name: 'Granary' })).toBe(false);
  });
  it('a custom institution DECLARING facet:institutionFunction:naval counts (genre-blind)', () => {
    expect(isNavalInstitution(DRYDOCK_GUILD)).toBe(true);
    // The same via a facet TAG spelling.
    expect(isNavalInstitution({ name: 'Grey Harbour League', tags: ['facet:institutionFunction:naval'] })).toBe(true);
  });
  it('the name pattern catches a dockyard/admiralty; string rows match by name', () => {
    expect(isNavalInstitution({ name: 'Royal Dockyard' })).toBe(true);
    expect(isNavalInstitution('Admiralty House')).toBe(true);
    expect(isNavalInstitution('Docks/port facilities')).toBe(false);
  });
  it('an inactive/destroyed naval institution does NOT count (standing only)', () => {
    expect(isNavalInstitution({ ...SHIPYARD, status: 'destroyed' })).toBe(false);
    expect(isNavalInstitution({ ...SHIPYARD, _worldPulseInactive: true })).toBe(false);
  });
});

describe('W-NAVY Stage 1 — navalCapability01 (bounded presence)', () => {
  it('rises with war-capable institutions, hard-capped (no unbounded stacking)', () => {
    expect(navalCapability01([])).toBe(0);
    expect(navalCapability01([DOCK])).toBe(0);
    expect(navalCapability01([SHIPYARD])).toBeCloseTo(NAVAL_TUNING.CAPABILITY_PER_INST, 5);
    expect(navalCapability01([SHIPYARD, SHIPYARD, SHIPYARD])).toBe(NAVAL_TUNING.CAPABILITY_CAP);
  });
});

describe('W-NAVY Stage 1 — navalStrengthOf (derived, parallel, never persisted)', () => {
  it('a non-port has NO navy (0), whatever its institutions', () => {
    const digest = portDigest();
    expect(isPort(digest, 'landlocked')).toBe(false);
    expect(navalStrengthOf(digest, item([SHIPYARD]), 'landlocked')).toBe(0);
  });

  it('a PORT with only docks fields NO war navy (Port only — the hasPort branch)', () => {
    const digest = portDigest();
    expect(isPort(digest, 'main')).toBe(true);
    expect(navalStrengthOf(digest, item([DOCK]), 'main')).toBe(0);
    expect(hasWarNavy(digest, item([DOCK]), 'main')).toBe(false);
  });

  it('a PORT with a shipyard fields a real war navy (> 0), on the land 0..~100 scale', () => {
    const digest = portDigest();
    const s = navalStrengthOf(digest, item([SHIPYARD]), 'main');
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThanOrEqual(NAVAL_TUNING.STRENGTH_BASE);
    expect(hasWarNavy(digest, item([SHIPYARD]), 'main')).toBe(true);
  });

  it('a custom Drydock-Guild port fields a navy (the facet chokepoint reaches the water)', () => {
    const digest = portDigest();
    expect(navalStrengthOf(digest, item([DRYDOCK_GUILD]), 'main')).toBeGreaterThan(0);
  });

  it('strength scales UP with economy tier and DOWN with poverty (affordability idiom)', () => {
    const digest = portDigest();
    const metro = navalStrengthOf(digest, item([SHIPYARD], { tier: 'metropolis', prosperity: 'Wealthy' }), 'main');
    const town = navalStrengthOf(digest, item([SHIPYARD], { tier: 'town', prosperity: 'Comfortable' }), 'main');
    const poorThorp = navalStrengthOf(digest, item([SHIPYARD], { tier: 'thorp', prosperity: 'Subsistence' }), 'main');
    expect(metro).toBeGreaterThan(town);
    expect(town).toBeGreaterThan(poorThorp);
    expect(poorThorp).toBeGreaterThan(0); // even a poor thorp's yard fields SOME squadron
  });

  it('is a PURE parallel read — same inputs, same number; no digest mutation', () => {
    const digest = portDigest();
    const a = navalStrengthOf(digest, item([SHIPYARD]), 'main');
    const b = navalStrengthOf(digest, item([SHIPYARD]), 'main');
    expect(a).toBe(b);
    expect(digest.reserved.seaLanes).toBeTruthy(); // untouched
  });
});

describe('W-NAVY Stage 2 — the role-coercion FIX (armyRecordOf extends, not coerces)', () => {
  it('a convoy/blockade role SURVIVES armyRecordOf (no silent degrade to march)', () => {
    // THE NAMED TRAP: before the fix, an unknown role coerced to 'march'. Extended.
    expect(armyRecordOf({ armyId: 'x', role: 'convoy', path: ['a', 'b'] })?.role).toBe('convoy');
    expect(armyRecordOf({ armyId: 'x', role: 'blockade', path: ['a', 'b'] })?.role).toBe('blockade');
    // A genuinely-unknown role still coerces to march (the allow-list holds).
    expect(armyRecordOf({ armyId: 'x', role: 'teleport', path: ['a'] })?.role).toBe('march');
    // The land roles are byte-unchanged.
    expect(armyRecordOf({ armyId: 'x', role: 'reinforcement', path: ['a'] })?.role).toBe('reinforcement');
    expect(armyRecordOf({ armyId: 'x', role: 'retreat', path: ['a'] })?.role).toBe('retreat');
    expect(ARMY_ROLES.CONVOY).toBe('convoy');
    expect(ARMY_ROLES.BLOCKADE).toBe('blockade');
  });
});

describe('W-NAVY Stage 2 — navalRecordOf (owner ≠ cargo; the allied convoy)', () => {
  it('parses a convoy record carrying BOTH ids; rejects a land (non-naval) record', () => {
    const nr = navalRecordOf({
      armyId: 'navyPort', role: 'convoy', ownerId: 'navyPort', cargoId: 'allyHome',
      originId: 'navyPort', destId: 'isle', path: ['navyPort', 'isle'], cargoStrength: 40,
      strength: 55, departTick: 3, arrivalTick: 7,
    });
    expect(nr).toBeTruthy();
    expect(nr.mode).toBe('sea');
    expect(nr.ownerId).toBe('navyPort');
    expect(nr.cargoId).toBe('allyHome');        // OWNER ≠ CARGO (the allied convoy)
    expect(nr.cargoStrength).toBe(40);
    expect(nr.role).toBe('convoy');
    // A march record is NOT a naval record.
    expect(navalRecordOf({ armyId: 'x', role: 'march', path: ['a', 'b'] })).toBeNull();
  });
});

describe('W-NAVY Stage 2 — planConvoy (the sea lift)', () => {
  it('mints a convoy record main→isle over the sea lane, carrying owner + cargo', () => {
    const digest = portDigest();
    const out = planConvoy(digest, { spatialCanonVersion: 1 }, {
      ownerId: 'main', cargoId: 'allyHome', destId: 'isle',
      ownerStrength: 60, cargoStrength: 45, readiness01: 0.6, departTick: 2,
    });
    expect(out && 'record' in out).toBe(true);
    const rec = out.record;
    expect(rec.role).toBe(ARMY_ROLES.CONVOY);
    expect(rec.mode).toBe('sea');
    expect(rec.ownerId).toBe('main');
    expect(rec.cargoId).toBe('allyHome');
    expect(rec.cargoStrength).toBe(45);
    expect(rec.path[0]).toBe('main');
    expect(rec.path[rec.path.length - 1]).toBe('isle');
    expect(rec.arrivalTick).toBeGreaterThan(rec.departTick);
    // The route actually sails (≥1 sea edge).
    expect(seaEdgesOfPath(digest, rec.path).length).toBeGreaterThanOrEqual(1);
  });

  it('returns null when the pair is not sea-reachable (a land-only route is no convoy)', () => {
    const digest = portDigest();
    // main → itself, and a bogus dest, are not convoyable.
    expect(planConvoy(digest, {}, { ownerId: 'main', cargoId: 'c', destId: 'main', ownerStrength: 1, cargoStrength: 1, departTick: 0 })).toBeNull();
  });

  it('a convoy is FASTER than the equivalent land march (the sea advantage is deliberate)', () => {
    // Same base hop-time: CONVOY_SPEED_FACTOR 1.2 < ARMY_SPEED_FACTOR 1.5.
    expect(convoyTransitWeeks(10, 0.5)).toBeLessThan(armyMarchWeeks(10, 0.5));
    expect(convoyTransitWeeks(0, 0.5)).toBe(0);
    expect(convoyTransitWeeks(3, 0.5)).toBeGreaterThanOrEqual(1);
  });
});

describe('W-NAVY Stage 2 — the storm-season convoy EV (winter crossings rare)', () => {
  it('convoy EV is LOWER in winter than summer (the storm law prices up the passage)', () => {
    const digest = portDigest();
    const winterMult = stormMultOf(digest, 'winter');
    const summerMult = stormMultOf(digest, 'summer');
    expect(winterMult).toBeGreaterThan(summerMult); // 2.5 vs 1.0
    const winter = convoyEV({ cargoStrength: 50, threat01: 0.3, stormMult: winterMult });
    const summer = convoyEV({ cargoStrength: 50, threat01: 0.3, stormMult: summerMult });
    expect(winter).toBeLessThan(summer);
  });
  it('threat discounts the EV (speed against ruin); a safe calm crossing is worth most', () => {
    const safe = convoyEV({ cargoStrength: 50, threat01: 0, stormMult: 1 });
    const risky = convoyEV({ cargoStrength: 50, threat01: 0.8, stormMult: 1 });
    expect(safe).toBeGreaterThan(risky);
  });
});

describe('W-NAVY Stage 2 — capacity (the FIRST consumer of SEA_LANE_CAPACITY, deferral-visible)', () => {
  it('a lane full of convoys DEFERS a new crossing (deferral is visible, not silent)', () => {
    const digest = portDigest();
    const cap = seaLaneCapacityOf(digest);
    expect(cap).toBeGreaterThan(0);
    // Fill the main|isle lane to capacity with active convoys.
    /** @type {Record<string, any>} */
    const active = {};
    for (let i = 0; i < cap; i++) {
      active[`c${i}`] = { armyId: `n${i}`, role: 'convoy', ownerId: `n${i}`, cargoId: `a${i}`, path: ['main', 'isle'], strength: 1, cargoStrength: 1, departTick: 0, arrivalTick: 5 };
    }
    // The lane is now full ⇒ a new convoy over it defers.
    const avail = convoyCapacityAvailable(digest, active, ['main', 'isle']);
    expect(avail.available).toBe(false);
    expect(avail.fullEdge).toBe('isle|main');
    // planConvoy surfaces the deferral (visible), not null and not a silent mint.
    const out = planConvoy(digest, {}, {
      ownerId: 'main', cargoId: 'x', destId: 'isle', ownerStrength: 1, cargoStrength: 1,
      departTick: 6, activeRecords: active,
    });
    expect(out && 'deferred' in out).toBe(true);
    expect(out.deferred).toBe('capacity');
  });

  it('an empty lane has headroom (a convoy mints)', () => {
    const digest = portDigest();
    expect(convoyCapacityAvailable(digest, {}, ['main', 'isle']).available).toBe(true);
  });
});
