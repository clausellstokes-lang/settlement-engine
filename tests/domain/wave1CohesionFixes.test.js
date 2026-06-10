/**
 * tests/domain/wave1CohesionFixes.test.js — Cohesion Remediation Wave 1.
 *
 * Pins the simulation-wiring fixes from docs/COHESION_REMEDIATION_PLAN.md Wave 1:
 * the organic-condition routing (per-archetype templates, not a hard-coded pair),
 * polarity-aware causal bands, graded prosperity on resilience, the Lightly Defended
 * legitimacy step, the arcane-instability magic gate, NPC category aliases,
 * merchant_wealth retirement, and the cold_war_sanctions expiry.
 */

import { describe, it, expect } from 'vitest';
import { deriveActiveCondition } from '../../src/domain/activeConditions.js';
import { deriveSystemVariable, deriveCausalState, pressuresOn } from '../../src/domain/causalState.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { collectThreatSources } from '../../src/domain/threatProfile.js';
import { computePublicLegitimacy } from '../../src/generators/factionDynamics.js';
import { deriveNpcProfile } from '../../src/domain/npcProfile.js';

// ── 1. Organic conditions route per-archetype (the misroute fix) ─────────────
describe('organic conditions route by archetype template, not a hard-coded pair', () => {
  it('a famine condition without explicit affectedSystems routes to food_security', () => {
    const c = deriveActiveCondition({ archetype: 'famine' });
    expect(c.affectedSystems).toContain('food_security');
    expect(c.affectedSystems).toContain('labor_capacity');
  });

  it('a plague condition routes to healing_capacity', () => {
    const c = deriveActiveCondition({ archetype: 'plague' });
    expect(c.affectedSystems).toContain('healing_capacity');
  });

  it('crime pressure routes to criminal_opportunity', () => {
    const c = deriveActiveCondition({ archetype: 'regional_criminal_pressure' });
    expect(c.affectedSystems).toContain('criminal_opportunity');
  });

  it('an explicitly provided affectedSystems array still wins (the precedence the fix relies on)', () => {
    const c = deriveActiveCondition({ archetype: 'famine', affectedSystems: ['social_trust'] });
    expect(c.affectedSystems).toEqual(['social_trust']);
  });
});

// ── 2. Polarity-aware bands ───────────────────────────────────────────────────
describe('criminal_opportunity bands by polarity (high crime is a PROBLEM, not surplus)', () => {
  const crimeRidden = {
    name: 'T', tier: 'town', population: 2000, config: {},
    economicState: { safetyProfile: { blackMarketCapture: 80 } },
    powerStructure: { factions: [{ faction: 'The Veiled Hand', category: 'criminal', power: 70 }] },
    institutions: [], activeConditions: [],
  };

  it('a crime-ridden town reads a problem band, never surplus/adequate', () => {
    const v = deriveSystemVariable('criminal_opportunity', crimeRidden);
    expect(v.score).toBeGreaterThan(65); // crime is genuinely high...
    expect(['strained', 'critical', 'collapsed']).toContain(v.band); // ...and reads as a problem
  });

  it('pressuresOn flags the crime-ridden town', () => {
    expect(pressuresOn(crimeRidden)).toContain('criminal_opportunity');
  });

  it('higher-is-better variables band unchanged (surplus food still reads surplus side)', () => {
    const fed = {
      name: 'T', tier: 'town', population: 2000, config: {},
      economicState: { foodSecurity: { deficitPct: 0, surplusPct: 60, foodRatio: 1.6, storageMonths: 6 } },
      powerStructure: { factions: [] }, institutions: [], activeConditions: [],
    };
    const v = deriveSystemVariable('food_security', fed);
    expect(['surplus', 'adequate']).toContain(v.band);
  });

  it('summary buckets agree with the polarity-adjusted band', () => {
    const state = deriveCausalState(crimeRidden);
    const band = state.bands.criminal_opportunity;
    expect(state.summary[band]).toContain('criminal_opportunity');
  });
});

// ── 3. Graded prosperity on resilience ────────────────────────────────────────
describe('resilience grades the REAL prosperity vocabulary (middle tiers no longer zero)', () => {
  const at = (prosperity) => deriveSystemState({ economicState: { prosperity } }).resilience.value;

  it('orders strictly across the canonical tiers', () => {
    expect(at('Wealthy')).toBeGreaterThan(at('Comfortable'));
    expect(at('Comfortable')).toBeGreaterThan(at('Moderate'));
    expect(at('Moderate')).toBeGreaterThan(at('Poor'));
    expect(at('Poor')).toBeGreaterThan(at('Struggling'));
  });

  it('the middle tiers actually contribute (Poor is no longer identical to Moderate)', () => {
    expect(at('Poor')).not.toBe(at('Moderate'));
    expect(at('Comfortable')).not.toBe(at('Moderate'));
  });
});

// ── 4. Lightly Defended legitimacy step ──────────────────────────────────────
describe('Lightly Defended contributes to legitimacy (the DEFENSE_CONTRIB hole)', () => {
  const eco = { prosperity: 'Moderate' };
  it('sits between Vulnerable and Defensible', () => {
    const lightly    = computePublicLegitimacy(eco, 'Lightly Defended', 'town').score;
    const vulnerable = computePublicLegitimacy(eco, 'Vulnerable', 'town').score;
    const defensible = computePublicLegitimacy(eco, 'Defensible', 'town').score;
    expect(lightly).toBeGreaterThan(vulnerable);
    expect(lightly).toBeLessThan(defensible);
  });
});

// ── 5. Arcane-instability magic gate ─────────────────────────────────────────
describe('arcane_instability requires live magic (no wild-magic threats in mundane towns)', () => {
  const town = (config, magical) => ({
    name: 'T', tier: 'town', population: 2000, config,
    defenseProfile: { scores: { military: 50, monster: 50, internal: 60, economic: 60, magical } },
    institutions: [], powerStructure: { factions: [] }, activeConditions: [],
  });
  const arcaneThreats = (s) => collectThreatSources(s).filter(t => t.inferredType === 'arcane_instability');

  it('a dead-magic world raises NO wild-magic threat despite magical defense 0', () => {
    expect(arcaneThreats(town({ magicExists: false, priorityMagic: 0 }, 0))).toHaveLength(0);
  });

  it('a mundane low-magic village raises NO wild-magic threat', () => {
    expect(arcaneThreats(town({ priorityMagic: 15 }, 5))).toHaveLength(0);
  });

  it('a magic-heavy town with weak arcane defenses DOES read instability', () => {
    expect(arcaneThreats(town({ priorityMagic: 80 }, 20)).length).toBeGreaterThan(0);
  });
});

// ── 6. NPC category aliases ──────────────────────────────────────────────────
describe('npcProfile maps the vocabulary npcGenerator actually emits', () => {
  const settlement = { name: 'T', institutions: [], powerStructure: { factions: [] }, npcs: [] };
  const npcWith = (category) => ({ id: 'n1', name: 'Master Aldric', importance: 'key', category });

  it("category 'crafts' gets the craft templates (not generic 'other')", () => {
    const crafts = deriveNpcProfile(npcWith('crafts'), settlement);
    const craft  = deriveNpcProfile(npcWith('craft'), settlement);
    const other  = deriveNpcProfile(npcWith('zzz_unknown'), settlement);
    expect(JSON.stringify(crafts.leverage)).toBe(JSON.stringify(craft.leverage));
    expect(JSON.stringify(crafts.leverage)).not.toBe(JSON.stringify(other.leverage));
  });

  it("'magic' maps to arcane and 'noble' to government", () => {
    const magic  = deriveNpcProfile(npcWith('magic'), settlement);
    const arcane = deriveNpcProfile(npcWith('arcane'), settlement);
    const noble  = deriveNpcProfile(npcWith('noble'), settlement);
    const gov    = deriveNpcProfile(npcWith('government'), settlement);
    expect(JSON.stringify(magic.leverage)).toBe(JSON.stringify(arcane.leverage));
    expect(JSON.stringify(noble.leverage)).toBe(JSON.stringify(gov.leverage));
  });
});

// ── 7. merchant_wealth retirement + cold_war_sanctions expiry ────────────────
describe('merchant_wealth is retired from every template (orphan channel)', () => {
  for (const archetype of ['trade_route_cut', 'regional_route_disruption', 'regional_tax_revenue_disruption', 'regional_service_disruption']) {
    it(`${archetype} routes economic bite through trade_connectivity`, () => {
      const c = deriveActiveCondition({ archetype });
      expect(c.affectedSystems).not.toContain('merchant_wealth');
      expect(c.affectedSystems).toContain('trade_connectivity');
    });
  }
});

describe('cold_war_sanctions is no longer immortal', () => {
  it('carries the template expiry', () => {
    const c = deriveActiveCondition({ archetype: 'cold_war_sanctions' });
    expect(c.duration.expiresAtTicks).toBe(8);
  });
});
