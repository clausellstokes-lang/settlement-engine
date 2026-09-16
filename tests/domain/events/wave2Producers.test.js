/**
 * tests/domain/events/wave2Producers.test.js — Cohesion Remediation Wave 2.
 *
 * The dead consequence trees get producers: EXPOSE_CORRUPTION promotes
 * corruption_exposed; losing/crippling a food anchor promotes food_anchor_lost;
 * REMOVED_THREAT clears the stressor and promotes siege_lifted for sieges;
 * STARTED_RIOT leaves a durable aftermath; DEPLETE/RECOVERED_RESOURCE write the
 * formats the generators actually read, and the food math respects depletion.
 */

import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';
import { deriveAllActiveConditions } from '../../../src/domain/activeConditions.js';
import { generateFoodSecurity } from '../../../src/generators/foodGenerator.js';

const NOW = '2026-06-10T00:00:00.000Z';
const apply = (settlement, event) => mutateSettlement({ settlement, event: { id: 'e1', ...event }, now: NOW });
const archetypes = (s) => deriveAllActiveConditions(s).map(c => c.archetype);

const town = (extra = {}) => ({
  name: 'Town',
  institutions: [
    { id: 'i1', name: 'Town granary' },
    { id: 'i2', name: 'Sawmill' },
    { id: 'i3', name: "Thieves' Guild", category: 'criminal' },
    { id: 'i4', name: 'City Watch' },
  ],
  powerStructure: { factions: [{ id: 'f1', name: 'City Watch' }] },
  factions: [],
  npcs: [],
  activeConditions: [],
  config: { nearbyResources: ['fishing_grounds', 'managed_forest'] },
  ...extra,
});

describe('EXPOSE_CORRUPTION promotes a durable corruption_exposed condition', () => {
  it('faction/institution path', () => {
    const next = apply(town(), { type: 'EXPOSE_CORRUPTION', targetId: "Thieves' Guild" });
    expect(archetypes(next)).toContain('corruption_exposed');
  });

  it('corrupt-NPC path', () => {
    const s = town({
      npcs: [{
        id: 'npc1', name: 'Captain Vex', corrupt: true, corruptionVector: 'greed',
        corruptTies: { criminalInstitution: "Thieves' Guild" }, factionAffiliation: 'City Watch', timesExposed: 0,
      }],
    });
    const next = apply(s, { type: 'EXPOSE_CORRUPTION', targetId: 'Captain Vex' });
    expect(archetypes(next)).toContain('corruption_exposed');
  });
});

describe('food anchors promote food_anchor_lost', () => {
  it('removing the granary raises the crisis', () => {
    const next = apply(town(), { type: 'REMOVE_INSTITUTION', targetId: 'Town granary' });
    expect(archetypes(next)).toContain('food_anchor_lost');
  });

  it('severe damage to the granary raises it; light impairment does not', () => {
    const damaged = apply(town(), { type: 'DAMAGE_INSTITUTION', targetId: 'Town granary', payload: { severity: 0.8 } });
    expect(archetypes(damaged)).toContain('food_anchor_lost');
    const light = apply(town(), { type: 'IMPAIR_INSTITUTION', targetId: 'Town granary', payload: { severity: 0.4 } });
    expect(archetypes(light)).not.toContain('food_anchor_lost');
  });

  it('a sawmill is not a food anchor', () => {
    const next = apply(town(), { type: 'REMOVE_INSTITUTION', targetId: 'Sawmill' });
    expect(archetypes(next)).not.toContain('food_anchor_lost');
  });
});

describe('REMOVED_THREAT clears the stressor and lifts sieges', () => {
  it('removes the matched siege stressor and promotes siege_lifted', () => {
    const s = town({ stressors: [{ name: 'Siege of the river gate', type: 'siege', severity: 0.8 }] });
    const next = apply(s, { type: 'REMOVED_THREAT', targetId: 'siege' });
    expect(next.stressors).toHaveLength(0);
    expect(archetypes(next)).toContain('siege_lifted');
  });

  it('a non-siege threat removal does not promote siege_lifted', () => {
    const s = town({ stressors: [{ name: 'Bandit raids on the east road', type: 'bandit_raids', severity: 0.6 }] });
    const next = apply(s, { type: 'REMOVED_THREAT', targetId: 'bandit_raids' });
    expect(next.stressors).toHaveLength(0);
    expect(archetypes(next)).not.toContain('siege_lifted');
  });
});

describe('STARTED_RIOT leaves a durable aftermath', () => {
  it('promotes the residual condition with riot framing + explicit systems', () => {
    const next = apply(town(), { type: 'STARTED_RIOT', targetId: 'Lower Quarter', payload: { severity: 0.6 } });
    const cond = deriveAllActiveConditions(next).find(c => c.label === 'Riot aftermath');
    expect(cond).toBeTruthy();
    expect(cond.affectedSystems).toContain('criminal_opportunity');
    expect(cond.affectedSystems).toContain('public_legitimacy');
  });
});

describe('resource depletion writes what the generators read — and recovery clears it', () => {
  it('DEPLETE_RESOURCE writes the canonical key + the depleted array', () => {
    const next = apply(town(), { type: 'DEPLETE_RESOURCE', targetId: 'fishing_grounds' });
    expect(next.config.nearbyResourcesState.fishing_grounds).toBe('depleted');
    expect(next.config.nearbyResourcesDepleted).toContain('fishing_grounds');
  });

  it('RECOVERED_RESOURCE clears both formats', () => {
    const depleted = apply(town(), { type: 'DEPLETE_RESOURCE', targetId: 'fishing_grounds' });
    const recovered = apply(depleted, { type: 'RECOVERED_RESOURCE', targetId: 'fishing_grounds' });
    expect(recovered.config.nearbyResourcesState.fishing_grounds).toBe('allow');
    expect(recovered.config.nearbyResourcesDepleted).not.toContain('fishing_grounds');
  });

  it('the food math respects depletion (a depleted fishing ground feeds no one)', () => {
    const config = {
      tradeRouteAccess: 'road', terrainType: 'coastal', monsterThreat: 'heartland',
      nearbyResources: ['fishing_grounds'], priorityMagic: 0, _population: 900,
    };
    const fed = generateFoodSecurity('village', [], config);
    const starved = generateFoodSecurity('village', [], { ...config, nearbyResourcesDepleted: ['fishing_grounds'] });
    expect(starved.dailyProduction).toBeLessThan(fed.dailyProduction);
  });
});
