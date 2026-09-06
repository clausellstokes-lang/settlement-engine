/**
 * tests/domain/causalStateWallsAndLiftPolarity.test.js — two remediation pins.
 *
 * (1) PHANTOM WALLS: deriveDefenseReadiness (and mapProfile's
 *     deriveDefensiveTerrain) used to grant the +6 "walled" bonus whenever
 *     /wall|rampart|palisade/i matched JSON.stringify(defenseProfile) — but the
 *     generated profile ALWAYS contains the literal key "walls" (even walls: []),
 *     so EVERY settlement read as walled. Pin: an unwalled settlement gets NO
 *     walls bonus / no fortified banding; a genuinely walled one still does.
 *
 * (2) LIFT POLARITY: occupation_lifted is the documented polarity clone of
 *     siege_lifted (a POSITIVE liberation event), but the condition loops in
 *     derivePublicLegitimacy / deriveDefenseReadiness / deriveLawOrder compared
 *     the archetype to siege_lifted ONLY, so liberation ERODED the very systems
 *     it should restore. Pin: occupation_lifted raises legitimacy / defense /
 *     law-order; pressure conditions still lower them.
 */

import { describe, it, expect } from 'vitest';
import { deriveSystemVariable, defenseProfileHasWalls } from '../../src/domain/causalState.js';
import { deriveMapProfile, defensiveTerrainBands } from '../../src/domain/mapProfile.js';

// Fresh object per call — causalState memoizes derivations on settlement identity.
const town = ({ defenseProfile, activeConditions = [], institutions = [] } = {}) => ({
  name: 'T', tier: 'town', population: 2000,
  config: { monsterThreat: 'safe', terrain: 'plain' },
  defenseProfile,
  institutions,
  powerStructure: { factions: [] },
  activeConditions,
});

// The generated profile shape: `institutions.walls` is ALWAYS present (the
// classified walls group from defenseGenerator), empty when nothing is built —
// exactly the shape the old stringify-regex false-matched on.
const profile = (walls) => ({
  readiness: { score: 50, label: 'adequate' },
  scores: { military: 50, monster: 50, internal: 50, economic: 50, magical: 50 },
  institutions: { walls, garrison: [], militia: [] },
});

describe('phantom walls: the +6 bonus follows the walls DATA, not JSON.stringify', () => {
  // Landed W2b causalState wave — needs causalState.defenseProfileHasWalls
  it('an unwalled settlement (walls: []) gets NO walled contributor', () => {
    const v = deriveSystemVariable('defense_readiness', town({ defenseProfile: profile([]) }));
    expect(v.contributors.some(c => c.effect === 'walled')).toBe(false);
    expect(v.score).toBe(50); // neutral readiness, no phantom +6
  });

  it('a walled settlement still gets the +6 walled bonus', () => {
    const v = deriveSystemVariable('defense_readiness',
      town({ defenseProfile: profile([{ name: 'Massive Walls' }]) }));
    expect(v.contributors.some(c => c.effect === 'walled')).toBe(true);
    expect(v.score).toBe(56);
  });

  it('an explicit hasWalls flag still counts', () => {
    const v = deriveSystemVariable('defense_readiness',
      town({ defenseProfile: { ...profile([]), hasWalls: true } }));
    expect(v.contributors.some(c => c.effect === 'walled')).toBe(true);
  });

  // Landed W2b causalState wave — needs causalState.defenseProfileHasWalls
  it('defenseProfileHasWalls reads data shapes, never key names', () => {
    expect(defenseProfileHasWalls(null)).toBe(false);
    expect(defenseProfileHasWalls({ walls: [] })).toBe(false);
    expect(defenseProfileHasWalls({ institutions: { walls: [] } })).toBe(false);
    expect(defenseProfileHasWalls({ institutions: { walls: [{ name: 'Palisade' }] } })).toBe(true);
    expect(defenseProfileHasWalls({ walls: [{ name: 'Rampart' }] })).toBe(true);
    expect(defenseProfileHasWalls({ hasWalls: true })).toBe(true);
  });
});

describe('phantom walls: mapProfile defensive terrain banding', () => {
  const bands = defensiveTerrainBands();

  // Landed W2b causalState wave — needs causalState.defenseProfileHasWalls
  it('an unwalled plains settlement with a defenseProfile is NOT banded sheltered/fortified', () => {
    const m = deriveMapProfile(town({ defenseProfile: profile([]) }));
    expect(bands.indexOf(m.outputs.defensiveTerrain)).toBeLessThan(bands.indexOf('sheltered'));
  });

  it('a genuinely walled settlement still bands sheltered or better', () => {
    const m = deriveMapProfile(town({ defenseProfile: profile([{ name: 'City Wall' }]) }));
    expect(bands.indexOf(m.outputs.defensiveTerrain)).toBeGreaterThanOrEqual(bands.indexOf('sheltered'));
  });
});

// Landed W2b causalState wave — needs causalState lift-polarity re-port (occupation_lifted/siege_lifted lifts)
describe('occupation_lifted polarity: liberation is a LIFT, not a pressure', () => {
  const lifted = () => [{ archetype: 'occupation_lifted', severity: 0.3 }];

  it('raises public_legitimacy (was: eroded it)', () => {
    const base = deriveSystemVariable('public_legitimacy', town());
    const v = deriveSystemVariable('public_legitimacy', town({ activeConditions: lifted() }));
    expect(v.score).toBeGreaterThan(base.score);
    const c = v.contributors.find(x => String(x.source).includes('occupation_lifted'));
    expect(c.effect).toBe('lift');
    expect(c.magnitude ?? c.weight ?? c.delta).not.toBeLessThan(0);
  });

  it('raises defense_readiness (was: taxed it)', () => {
    const base = deriveSystemVariable('defense_readiness', town({ defenseProfile: profile([]) }));
    const v = deriveSystemVariable('defense_readiness',
      town({ defenseProfile: profile([]), activeConditions: lifted() }));
    expect(v.score).toBeGreaterThan(base.score);
    expect(v.contributors.some(x => x.effect === 'recovering')).toBe(true);
  });

  it('raises law_order when a recovery condition declares it (latent seam)', () => {
    const cond = [{ archetype: 'occupation_lifted', severity: 0.3, affectedSystems: ['law_order'] }];
    const base = deriveSystemVariable('law_order', town());
    const v = deriveSystemVariable('law_order', town({ activeConditions: cond }));
    expect(v.score).toBeGreaterThan(base.score);
    expect(v.contributors.some(x => x.effect === 'restored')).toBe(true);
  });

  it('raises food_security when a recovery condition declares it (was: taxed it)', () => {
    // The siege_lifted template declares food_security among its affectedSystems,
    // and deriveFoodSecurity had no conditionDirection() gate — so a just-relieved
    // siege read as a food PRESSURE (-) and narrated the supply as worsening.
    const cond = [{ archetype: 'siege_lifted', severity: 0.3, affectedSystems: ['food_security'] }];
    const base = deriveSystemVariable('food_security', town());
    const v = deriveSystemVariable('food_security', town({ activeConditions: cond }));
    expect(v.score).toBeGreaterThan(base.score);
    const c = v.contributors.find(x => String(x.source).includes('siege_lifted'));
    expect(c.delta).toBeGreaterThan(0);
    expect(c.effect).toBe('lift');
  });

  it('raises trade_connectivity when a recovery condition declares it (was: cut it)', () => {
    const cond = [{ archetype: 'occupation_lifted', severity: 0.3, affectedSystems: ['trade_connectivity'] }];
    const base = deriveSystemVariable('trade_connectivity', town());
    const v = deriveSystemVariable('trade_connectivity', town({ activeConditions: cond }));
    expect(v.score).toBeGreaterThan(base.score);
    const c = v.contributors.find(x => String(x.source).includes('occupation_lifted'));
    expect(c.delta).toBeGreaterThan(0);
    expect(c.effect).toBe('restored');
  });

  it('moves ruling_authority by its DECLARED affectedSystem (was: keyed on the wrong variable, moved 0)', () => {
    // deriveRulingAuthority scanned public_legitimacy/faction_power and only fired for
    // corruption_exposed, so a condition declaring ruling_authority moved it by nothing.
    const lift = [{ archetype: 'occupation_lifted', severity: 0.4, affectedSystems: ['ruling_authority'] }];
    const base = deriveSystemVariable('ruling_authority', town());
    const up = deriveSystemVariable('ruling_authority', town({ activeConditions: lift }));
    expect(up.score).toBeGreaterThan(base.score);                                 // liberation restores authority
    const pressure = [{ archetype: 'government_overthrown', severity: 0.4, affectedSystems: ['ruling_authority'] }];
    const down = deriveSystemVariable('ruling_authority', town({ activeConditions: pressure }));
    expect(down.score).toBeLessThan(base.score);                                  // a coup undermines it
  });

  it('siege_lifted stays positive and pressure conditions stay negative', () => {
    const siege = deriveSystemVariable('defense_readiness',
      town({ defenseProfile: profile([]), activeConditions: [{ archetype: 'siege_lifted', severity: 0.3 }] }));
    expect(siege.score).toBeGreaterThan(50);

    const drained = deriveSystemVariable('defense_readiness',
      town({ defenseProfile: profile([]), activeConditions: [{ archetype: 'reinforcement_cost', severity: 0.4 }] }));
    expect(drained.score).toBeLessThan(50);
  });
});
