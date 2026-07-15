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
import {
  navalStrengthOf, hasWarNavy, navalCapability01, isNavalInstitution, NAVAL_TUNING,
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
