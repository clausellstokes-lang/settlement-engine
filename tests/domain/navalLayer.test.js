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
  navalCapability01, isNavalInstitution, NAVAL_TUNING,
  navalRecordOf, planConvoy, convoyTransitWeeks, convoyEV, stormMultOf,
  convoyCapacityAvailable, seaEdgesOfPath, seaLaneCapacityOf,
} from '../../src/domain/spatial/navalLayer.js';
import {
  blockadeInterceptsSupply, blockadeRunRoll, planBlockade, blockadeStrangulationOf, activeBlockadeTargets,
} from '../../src/domain/spatial/navalLayer.js';
import { navalStrengthOf, hasWarNavy } from '../../src/domain/worldPulse/navalStrength.js';
import { advanceSupplyShipments, rankSupplySources, supplyInterdictionLevel } from '../../src/domain/spatial/supplyShipments.js';
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

// ── Stage 4 — THE BLOCKADE ("a blockade is the same as a siege") ─────────────────
/** A blockade record targeting `port`, owned by `owner`. */
function blockade(owner, port) {
  return {
    armyId: owner, role: 'blockade', ownerId: owner, cargoId: null, originId: owner,
    destId: port, targetId: port, path: [owner, port], departTick: 0, arrivalTick: 4,
    position01: 1, strength: 60, cargoStrength: 0, readiness: 0.6, supplyQuality: 1, funding: 0.5, lastTick: 0,
  };
}

describe('W-NAVY Stage 4 — blockadeInterceptsSupply (the sea-cut seam, byte-safe when dark)', () => {
  it('NO navalTransit ledger ⇒ false (the supply layer stays byte-identical)', () => {
    const digest = portDigest();
    expect(blockadeInterceptsSupply({}, digest, 'isle', 'main')).toBe(false);
    expect(activeBlockadeTargets({}).size).toBe(0);
  });
  it('a blockaded port reads its sea approaches as hostile-to-destination', () => {
    const digest = portDigest();
    const ws = { spatialCanonVersion: 1, spatialLedgers: { navalTransit: { main: blockade('main', 'isle') } } };
    // main is a sea approach of isle ⇒ intercepts supply into isle.
    expect(blockadeInterceptsSupply(ws, digest, 'isle', 'main')).toBe(true);
    // A non-blockaded port is untouched.
    expect(blockadeInterceptsSupply(ws, digest, 'main', 'isle')).toBe(false);
    expect(activeBlockadeTargets(ws).get('isle')?.has('main')).toBe(true);
  });
});

describe('W-NAVY Stage 4 — blockade-running (M7 smuggle vs the fleet gate)', () => {
  it('a strong blockading fleet drives the run chance toward zero; no fleet ⇒ the base chance', () => {
    expect(blockadeRunRoll({ fleetGate01: 1 }).probability).toBe(0);       // an ironclad blockade
    expect(blockadeRunRoll({ fleetGate01: 0 }).probability).toBeGreaterThan(0); // no fleet ⇒ base
    // A seeded runner: with a weak fleet a low draw slips through; a high draw is caught.
    expect(blockadeRunRoll({ fleetGate01: 0, rng: { random: () => 0.1 } }).ran).toBe(true);
    expect(blockadeRunRoll({ fleetGate01: 0, rng: { random: () => 0.9 } }).ran).toBe(false);
  });
});

describe('W-NAVY Stage 4 — blockadeStrangulationOf + planBlockade', () => {
  it('a blockade strangles commerce (a 0..1 economic-pressure read); planBlockade sails', () => {
    const digest = portDigest();
    const ws = { spatialCanonVersion: 1, spatialLedgers: { navalTransit: { main: blockade('main', 'isle') } } };
    expect(blockadeStrangulationOf(ws, 'isle')).toBeGreaterThan(0);
    expect(blockadeStrangulationOf(ws, 'main')).toBe(0);
    const plan = planBlockade(digest, {}, { ownerId: 'main', targetId: 'isle', ownerStrength: 60, departTick: 1 });
    expect(plan && 'record' in plan).toBe(true);
    expect(plan.record.role).toBe('blockade');
    expect(plan.record.targetId).toBe('isle');
  });
});

describe('W-NAVY Stage 4 — the both-cut law (blockade alone strangles; land + sea starves)', () => {
  // The M8 port-supply topology: a port fed by a LAND producer and a SEA producer.
  function portSupplyDigest() {
    const cols = 6, rows = 3, n = cols * rows;
    const h = new Array(n), biome = new Array(n).fill(4), r = new Array(n).fill(0), p = new Array(n), c = new Array(n);
    const idx = (col, row) => row * cols + col;
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) { const i = idx(col, row); p[i] = [col * 50, row * 50]; h[i] = col === 3 ? 10 : 40; }
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
      const i = idx(col, row); const nb = [];
      if (col > 0) nb.push(idx(col - 1, row)); if (col < cols - 1) nb.push(idx(col + 1, row));
      if (row > 0) nb.push(idx(col, row - 1)); if (row < rows - 1) nb.push(idx(col, row + 1));
      c[i] = nb;
    }
    const placements = [
      { id: 'port', cellId: idx(2, 1), institutions: [DOCK] },
      { id: 'seasrc', cellId: idx(4, 1), institutions: [DOCK] },
      { id: 'landsrc', cellId: idx(0, 1), institutions: [] },
    ];
    return buildSpatialDigest({ pack: { cells: { h, biome, r, p, c } }, placements, seaLanes: true });
  }
  // Drive the supply layer with the SAME blockade-aware callbacks the supply kernel now uses.
  function interdiction(digest, landSevered, blockadeWs) {
    const rankedSources = rankSupplySources(digest, 'port', ['landsrc', 'seasrc']);
    const links = [{ settlementId: 'port', institutionId: 'smithy', input: 'iron', rankedSources, bufferWeeks: 0, critical: true }];
    const out = advanceSupplyShipments({
      links, worldState: { spatialCanonVersion: 1, spatialDigest: digest }, digest, tick: 5,
      sourceSeveredFor: (destId, srcId) => landSevered.has(srcId) || blockadeInterceptsSupply(blockadeWs, digest, destId, srcId),
      hostileToDestinationFor: (destId, gateId) => blockadeInterceptsSupply(blockadeWs, digest, destId, gateId),
      riskToleranceFor: () => 1,
    });
    return supplyInterdictionLevel(out.next ? { spatialCanonVersion: 1, spatialLedgers: { supplyShipments: out.next } } : { spatialCanonVersion: 1 }, 'port');
  }

  it('blockade ALONE ⇒ sea cut but land feeds (not starving); land siege + blockade ⇒ starves', () => {
    const digest = portSupplyDigest();
    const blockadeWs = { spatialCanonVersion: 1, spatialLedgers: { navalTransit: { enemy: blockade('enemy', 'port') } } };
    const noBlockade = { spatialCanonVersion: 1 };
    // Both fed, no cut.
    expect(interdiction(digest, new Set(), noBlockade)).toBe(0);
    // Blockade ALONE: the sea source is cut, but the LAND source keeps the port fed (strangled, not starved).
    expect(interdiction(digest, new Set(), blockadeWs)).toBe(0);
    // Combined arms: land siege (landsrc severed) + blockade (seasrc cut) ⇒ both axes gone ⇒ starves.
    expect(interdiction(digest, new Set(['landsrc']), blockadeWs)).toBe(1);
    // Land siege ALONE (no blockade): the SEA keeps it fed.
    expect(interdiction(digest, new Set(['landsrc']), noBlockade)).toBe(0);
  });
});
