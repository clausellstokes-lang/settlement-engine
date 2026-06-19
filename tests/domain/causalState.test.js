/**
 * tests/domain/causalState.test.js — Tier 2.4 substrate contract.
 *
 * Pins:
 *   - SYSTEM_VARIABLES catalog stability (the 14 names).
 *   - causalBand boundaries (surplus ≥75, adequate ≥55, strained ≥35,
 *     critical ≥15, else collapsed).
 *   - defaultScoreForCausalBand round-trips through causalBand.
 *   - deriveSystemVariable produces canonical SystemVariable shape.
 *   - deriveCausalState envelope: variables + bands + scores + summary.
 *   - Active conditions actually affect their declared affectedSystems.
 *   - No mutation of input settlement.
 *   - Real-settlement integration: city-tier generated settlement
 *     produces all 14 variables with valid bands.
 *   - Composition with Phase 16: a settlement carrying a 'plague'
 *     condition shows worse food_security / healing_capacity than
 *     a baseline without the condition.
 */

import { describe, it, expect } from 'vitest';
import {
  SYSTEM_VARIABLES,
  CAUSAL_BANDS,
  causalBand,
  defaultScoreForCausalBand,
  deriveSystemVariable,
  deriveCausalState,
  bandForVariable,
  pressuresOn,
  summarizeCausalState,
  supportedSystemVariables,
} from '../../src/domain/causalState.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// ── Canonical catalog ──────────────────────────────────────────────────

describe('SYSTEM_VARIABLES', () => {
  it('exposes 15 canonical variable names', () => {
    expect(SYSTEM_VARIABLES).toHaveLength(15);
  });

  it('contains every variable named in the Tier 2.4 roadmap', () => {
    const set = new Set(SYSTEM_VARIABLES);
    for (const name of [
      'food_security', 'labor_capacity', 'public_legitimacy',
      'ruling_authority', 'faction_power', 'trade_connectivity',
      'healing_capacity', 'defense_readiness', 'criminal_opportunity',
      'religious_authority', 'housing_pressure', 'infrastructure_condition',
      'magical_stability', 'social_trust',
    ]) {
      expect(set.has(name), `missing canonical variable: ${name}`).toBe(true);
    }
  });

  it('is frozen', () => {
    expect(Object.isFrozen(SYSTEM_VARIABLES)).toBe(true);
  });
});

describe('CAUSAL_BANDS', () => {
  it('exposes 5 canonical band names', () => {
    expect(CAUSAL_BANDS).toEqual(['surplus', 'adequate', 'strained', 'critical', 'collapsed']);
  });
});

// ── Score → band conversion ────────────────────────────────────────────

describe('causalBand()', () => {
  it('respects the canonical boundaries', () => {
    expect(causalBand(0)).toBe('collapsed');
    expect(causalBand(14)).toBe('collapsed');
    expect(causalBand(15)).toBe('critical');
    expect(causalBand(29)).toBe('critical');
    expect(causalBand(30)).toBe('strained');
    expect(causalBand(49)).toBe('strained');
    expect(causalBand(50)).toBe('adequate');
    expect(causalBand(74)).toBe('adequate');
    expect(causalBand(75)).toBe('surplus');
    expect(causalBand(100)).toBe('surplus');
  });

  it('clamps out-of-range scores', () => {
    expect(causalBand(-1)).toBe('collapsed');
    expect(causalBand(999)).toBe('surplus');
  });

  it('treats non-numeric input as neutral (adequate)', () => {
    expect(causalBand(null)).toBe('adequate');
    expect(causalBand(undefined)).toBe('adequate');
    expect(causalBand('high')).toBe('adequate');
  });
});

describe('defaultScoreForCausalBand()', () => {
  it('round-trips through causalBand for every band', () => {
    for (const band of CAUSAL_BANDS) {
      expect(causalBand(defaultScoreForCausalBand(band))).toBe(band);
    }
  });
});

// ── Single-variable derivation ─────────────────────────────────────────

describe('deriveSystemVariable()', () => {
  it('returns null for unknown variable', () => {
    expect(deriveSystemVariable('not_a_thing', {})).toBeNull();
  });

  it('returns neutral score (50/adequate) for nullish settlement', () => {
    const v = deriveSystemVariable('food_security', null);
    expect(v.score).toBe(50);
    expect(v.band).toBe('adequate');
    expect(v.contributors).toEqual([]);
  });

  it('produces the canonical SystemVariable shape', () => {
    const v = deriveSystemVariable('food_security', {});
    expect(v).toHaveProperty('variable', 'food_security');
    expect(typeof v.score).toBe('number');
    expect(CAUSAL_BANDS).toContain(v.band);
    expect(Array.isArray(v.contributors)).toBe(true);
  });

  it('clamps scores to 0..100', () => {
    // A settlement with every penalty stacked.
    const s = {
      activeConditions: [
        { archetype: 'plague', severity: 1.0 },
        { archetype: 'food_anchor_lost', severity: 1.0 },
      ],
      economicState: {
        activeChains: [
          { needKey: 'food_security', chainId: 'x', label: 'x', status: 'collapsing' },
        ],
        foodSecurity: { deficitPct: 60 },
      },
    };
    const v = deriveSystemVariable('food_security', s);
    expect(v.score).toBeGreaterThanOrEqual(0);
    expect(v.score).toBeLessThanOrEqual(100);
  });
});

// ── Per-variable behavior ──────────────────────────────────────────────

describe('food_security derivation', () => {
  it('drops with a non-stable food chain', () => {
    const baseline = deriveSystemVariable('food_security', {
      economicState: {
        activeChains: [{ needKey: 'food_security', chainId: 'x', label: 'x', status: 'operational' }],
      },
    });
    const disrupted = deriveSystemVariable('food_security', {
      economicState: {
        activeChains: [{ needKey: 'food_security', chainId: 'x', label: 'x', status: 'collapsing' }],
      },
    });
    expect(disrupted.score).toBeLessThan(baseline.score);
  });

  it('drops further with an active plague condition', () => {
    const noPlague = deriveSystemVariable('food_security', {
      economicState: { activeChains: [{ needKey: 'food_security', chainId: 'x', label: 'x', status: 'operational' }] },
      activeConditions: [],
    });
    const withPlague = deriveSystemVariable('food_security', {
      economicState: { activeChains: [{ needKey: 'food_security', chainId: 'x', label: 'x', status: 'operational' }] },
      activeConditions: [{ archetype: 'plague', severity: 0.6 }],
    });
    expect(withPlague.score).toBeLessThan(noPlague.score);
    expect(withPlague.contributors.some(c => /plague/i.test(c.reason))).toBe(true);
  });

  it('honors generator-emitted food-security band hints', () => {
    const surplus = deriveSystemVariable('food_security', {
      economicState: { foodSecurity: { surplusPct: 50 } },
    });
    const deficit = deriveSystemVariable('food_security', {
      economicState: { foodSecurity: { deficitPct: 30 } },
    });
    expect(surplus.score).toBeGreaterThan(deficit.score);
  });
});

describe('public_legitimacy derivation', () => {
  it('reads directly from powerStructure.publicLegitimacy.score', () => {
    const high = deriveSystemVariable('public_legitimacy', {
      powerStructure: { publicLegitimacy: { score: 90, label: 'Endorsed' } },
    });
    const low = deriveSystemVariable('public_legitimacy', {
      powerStructure: { publicLegitimacy: { score: 20, label: 'Legitimacy Crisis' } },
    });
    expect(high.score).toBeGreaterThan(low.score);
    expect(high.band).toBe('surplus');
    expect(low.band).toBe('critical');
  });

  it('drops under a corruption_exposed condition', () => {
    const clean = deriveSystemVariable('public_legitimacy', {
      powerStructure: { publicLegitimacy: { score: 60, label: 'Approved' } },
      activeConditions: [],
    });
    const exposed = deriveSystemVariable('public_legitimacy', {
      powerStructure: { publicLegitimacy: { score: 60, label: 'Approved' } },
      activeConditions: [{ archetype: 'corruption_exposed', severity: 0.7 }],
    });
    expect(exposed.score).toBeLessThan(clean.score);
  });
});

describe('criminal_opportunity derivation', () => {
  it('rises with a strong criminal faction', () => {
    const lowCrime = deriveSystemVariable('criminal_opportunity', {
      powerStructure: { factions: [{ faction: 'Town Council', power: 35 }] },
    });
    const highCrime = deriveSystemVariable('criminal_opportunity', {
      powerStructure: { factions: [
        { faction: 'Town Council', power: 35 },
        { faction: "Thieves' Guild", power: 60 },
      ]},
    });
    expect(highCrime.score).toBeGreaterThan(lowCrime.score);
  });

  it('rises further with a corruption_exposed condition', () => {
    const noCondition = deriveSystemVariable('criminal_opportunity', {
      powerStructure: { factions: [{ faction: "Thieves' Guild", power: 40 }] },
      activeConditions: [],
    });
    const withCondition = deriveSystemVariable('criminal_opportunity', {
      powerStructure: { factions: [{ faction: "Thieves' Guild", power: 40 }] },
      activeConditions: [{ archetype: 'corruption_exposed', severity: 0.7 }],
    });
    expect(withCondition.score).toBeGreaterThan(noCondition.score);
  });
});

describe('trade_connectivity derivation', () => {
  it('rises with a major trade route', () => {
    const isolated = deriveSystemVariable('trade_connectivity', {
      config: { tradeRouteAccess: 'none' },
    });
    const connected = deriveSystemVariable('trade_connectivity', {
      config: { tradeRouteAccess: 'major' },
    });
    expect(connected.score).toBeGreaterThan(isolated.score);
  });

  it('drops with a trade_route_cut condition', () => {
    const flowing = deriveSystemVariable('trade_connectivity', {
      config: { tradeRouteAccess: 'major' },
      activeConditions: [],
    });
    const cut = deriveSystemVariable('trade_connectivity', {
      config: { tradeRouteAccess: 'major' },
      activeConditions: [{ archetype: 'trade_route_cut', severity: 0.7 }],
    });
    expect(cut.score).toBeLessThan(flowing.score);
  });

  // Wave 5 #2: the chain filter keyed 'trade' but the real need-group key
  // is 'trade_entrepot' — the whole trade-chain block was dead, so these
  // contributions are NEW relative to every score derived before the fix.
  const tradeChain = (over = {}) => ({
    needKey: 'trade_entrepot',
    needLabel: 'Trade & entrepôt',
    chainId: 'crossroads_trade',
    label: 'Crossroads trade',
    entrepot: true,
    status: 'entrepot',
    processingInstitutions: ['Caravanserai'],
    ...over,
  });

  it('a stable trade_entrepot chain contributes +5 (the formerly dead block is live)', () => {
    const base = deriveSystemVariable('trade_connectivity', {
      config: { tradeRouteAccess: 'road' },
      economicState: { activeChains: [] },
    });
    const withChain = deriveSystemVariable('trade_connectivity', {
      config: { tradeRouteAccess: 'road' },
      economicState: { activeChains: [tradeChain()] },
    });
    expect(withChain.score).toBe(base.score + 5);
    const contributor = withChain.contributors.find(c => c.source === 'chain.trade_entrepot.crossroads_trade');
    expect(contributor).toBeTruthy();
    expect(contributor.delta).toBe(5);
  });

  it('a blocked (legacy "unexploited") trade chain costs -18', () => {
    const base = deriveSystemVariable('trade_connectivity', {
      config: { tradeRouteAccess: 'road' },
      economicState: { activeChains: [] },
    });
    const blocked = deriveSystemVariable('trade_connectivity', {
      config: { tradeRouteAccess: 'road' },
      economicState: { activeChains: [tradeChain({ status: 'unexploited' })] },
    });
    expect(blocked.score).toBe(base.score - 18);
  });

  it('a strained trade chain costs -8', () => {
    const base = deriveSystemVariable('trade_connectivity', {
      config: { tradeRouteAccess: 'road' },
      economicState: { activeChains: [] },
    });
    const strained = deriveSystemVariable('trade_connectivity', {
      config: { tradeRouteAccess: 'road' },
      economicState: { activeChains: [tradeChain({ status: 'vulnerable' })] },
    });
    expect(strained.score).toBe(base.score - 8);
  });
});

describe('housing_pressure derivation', () => {
  // Wave 5 #4: /migrant/ does not substring-match 'mass_migration', so the
  // generation stress type never registered as housing pressure (the score
  // is inverted: lower = more pressure).
  it('a mass_migration stressor strains housing', () => {
    const calm = deriveSystemVariable('housing_pressure', { population: 1800, stressors: [] });
    const influx = deriveSystemVariable('housing_pressure', {
      population: 1800,
      stressors: [{ type: 'mass_migration', name: 'Mass Migration', severity: 0.6 }],
    });
    expect(influx.score).toBeLessThan(calm.score);
    expect(influx.contributors.some(c => c.source === 'stressors.refugee')).toBe(true);
  });

  it('a refugee_influx stressor still strains housing (no regression)', () => {
    const calm = deriveSystemVariable('housing_pressure', { population: 1800, stressors: [] });
    const influx = deriveSystemVariable('housing_pressure', {
      population: 1800,
      stressors: [{ type: 'refugee_influx', name: 'Refugee Influx' }],
    });
    expect(influx.score).toBeLessThan(calm.score);
  });

  // Wave 7 #2b: migration that arrives as a CONDITION (regional spread /
  // authored migration event) carried no housing consequence — the deriver
  // read stressor regexes only. The condition path is modest (severity*12 vs
  // the stressor's flat 18) and yields to the stressor when both are present:
  // promotion mints the same archetype FROM that stressor, so counting both
  // would double-penalize one crisis. The scan is gated on the affectedSystems
  // contract (the regional_migration_pressure template declares
  // housing_pressure), not on the archetype name — what the explanation/AI
  // surfaces list is exactly what the substrate charges.
  it('a regional_migration_pressure condition strains housing modestly', () => {
    const calm = deriveSystemVariable('housing_pressure', { population: 1800, stressors: [] });
    const wave = deriveSystemVariable('housing_pressure', {
      population: 1800,
      stressors: [],
      activeConditions: [{ archetype: 'regional_migration_pressure', severity: 0.5 }],
    });
    expect(wave.score).toBeLessThan(calm.score);
    expect(calm.score - wave.score).toBeLessThan(18); // modest: below the stressor term
    expect(wave.contributors.some(c => /^condition\.regional_migration_pressure\./.test(c.source))).toBe(true);
  });

  it('a condition that does not declare housing_pressure contributes nothing', () => {
    const calm = deriveSystemVariable('housing_pressure', { population: 1800, stressors: [] });
    const shock = deriveSystemVariable('housing_pressure', {
      population: 1800,
      stressors: [],
      // regional_information_shock affects legitimacy/trust/factions — no
      // housing_pressure in its affectedSystems, so the scan skips it.
      activeConditions: [{ archetype: 'regional_information_shock', severity: 0.9 }],
    });
    expect(shock.score).toBe(calm.score);
  });

  it('stressor + promoted condition together never double-count the crisis', () => {
    const stressorOnly = deriveSystemVariable('housing_pressure', {
      population: 1800,
      stressors: [{ type: 'mass_migration', name: 'Mass Migration', severity: 0.6 }],
    });
    const both = deriveSystemVariable('housing_pressure', {
      population: 1800,
      stressors: [{ type: 'mass_migration', name: 'Mass Migration', severity: 0.6 }],
      activeConditions: [{ archetype: 'regional_migration_pressure', severity: 0.6 }],
    });
    expect(both.score).toBe(stressorOnly.score);
    expect(both.contributors.filter(c => c.effect === 'influx')).toHaveLength(1);
  });
});

describe('magical_stability derivation (Wave 7)', () => {
  // The magical_instability condition archetype (promoted from the
  // magical_instability / magic_deadzone stressor family) is the first
  // condition able to reach magical_stability — pin the scan.
  it('drops under a magical_instability condition, attributed to the condition', () => {
    const calm = deriveSystemVariable('magical_stability', {
      config: { magicLevel: 'medium' }, activeConditions: [],
    });
    const unstable = deriveSystemVariable('magical_stability', {
      config: { magicLevel: 'medium' },
      activeConditions: [{ archetype: 'magical_instability', severity: 0.7 }],
    });
    expect(unstable.score).toBeLessThan(calm.score);
    expect(unstable.contributors.some(c => /^condition\.magical_instability\./.test(c.source))).toBe(true);
  });

  it('ignores conditions that do not tag magical_stability', () => {
    const base = deriveSystemVariable('magical_stability', {
      config: { magicLevel: 'medium' }, activeConditions: [],
    });
    const plagued = deriveSystemVariable('magical_stability', {
      config: { magicLevel: 'medium' },
      activeConditions: [{ archetype: 'plague', severity: 0.9 }],
    });
    expect(plagued.score).toBe(base.score);
  });
});

describe('public_legitimacy — monsterThreat term (Wave 7)', () => {
  const town = (monsterThreat, readinessScore) => ({
    name: 'T', tier: 'town', population: 2000,
    config: { monsterThreat },
    defenseProfile: {
      readiness: { score: readinessScore, label: 'x' },
      scores: { military: 50, monster: 50, internal: 50, economic: 50, magical: 50 },
    },
    powerStructure: { publicLegitimacy: { score: 60, label: 'Approved' }, factions: [] },
    activeConditions: [],
  });

  it('plagued threat over a weak defense pays a small legitimacy price', () => {
    const weak = deriveSystemVariable('public_legitimacy', town('plagued', 20));
    const safe = deriveSystemVariable('public_legitimacy', town('safe', 20));
    expect(weak.score).toBeLessThan(safe.score);
    const term = weak.contributors.find(c => c.source === 'config.monsterThreat');
    expect(term).toBeTruthy();
    expect(term.reason).toMatch(/cannot protect/);
  });

  it('a strong garrison under the same threat pays nothing (protection delivered)', () => {
    const strong = deriveSystemVariable('public_legitimacy', town('plagued', 80));
    const safe = deriveSystemVariable('public_legitimacy', town('safe', 80));
    expect(strong.score).toBe(safe.score);
    expect(strong.contributors.some(c => c.source === 'config.monsterThreat')).toBe(false);
  });

  it('no measured defense profile means no penalty (legacy saves unchanged)', () => {
    const legacy = deriveSystemVariable('public_legitimacy', {
      config: { monsterThreat: 'plagued' },
      powerStructure: { publicLegitimacy: { score: 60, label: 'Approved' }, factions: [] },
    });
    expect(legacy.contributors.some(c => c.source === 'config.monsterThreat')).toBe(false);
  });
});

describe('healing_capacity derivation', () => {
  it('rises with healing institutions present', () => {
    const empty = deriveSystemVariable('healing_capacity', { institutions: [] });
    const hospital = deriveSystemVariable('healing_capacity', {
      institutions: [
        { name: 'Temple of Light' },
        { name: 'Healer\'s Lodge' },
        { name: 'Apothecary' },
      ],
    });
    expect(hospital.score).toBeGreaterThan(empty.score);
  });

  it('drops under a plague condition', () => {
    const baseline = deriveSystemVariable('healing_capacity', {
      institutions: [{ name: 'Temple of Light' }],
      activeConditions: [],
    });
    const plagued = deriveSystemVariable('healing_capacity', {
      institutions: [{ name: 'Temple of Light' }],
      activeConditions: [{ archetype: 'plague', severity: 0.7 }],
    });
    expect(plagued.score).toBeLessThan(baseline.score);
  });
});

describe('labor_capacity derivation', () => {
  it('scales with population', () => {
    const tiny = deriveSystemVariable('labor_capacity', { population: 100 });
    const large = deriveSystemVariable('labor_capacity', { population: 5000 });
    expect(large.score).toBeGreaterThan(tiny.score);
  });

  it('drops under a plague condition', () => {
    const noPlague = deriveSystemVariable('labor_capacity', {
      population: 1000,
      activeConditions: [],
    });
    const withPlague = deriveSystemVariable('labor_capacity', {
      population: 1000,
      activeConditions: [{ archetype: 'plague', severity: 0.7 }],
    });
    expect(withPlague.score).toBeLessThan(noPlague.score);
  });
});

// ── Composer ───────────────────────────────────────────────────────────

describe('deriveCausalState()', () => {
  it('returns variables / bands / scores / summary', () => {
    const state = deriveCausalState({});
    expect(state).toHaveProperty('variables');
    expect(state).toHaveProperty('bands');
    expect(state).toHaveProperty('scores');
    expect(state).toHaveProperty('summary');
  });

  it('covers every SYSTEM_VARIABLES entry', () => {
    const state = deriveCausalState({});
    for (const name of SYSTEM_VARIABLES) {
      expect(state.variables[name], `missing variable: ${name}`).toBeTruthy();
      expect(state.bands[name]).toBeTruthy();
      expect(typeof state.scores[name]).toBe('number');
    }
  });

  it('summary groups every variable into exactly one band bucket', () => {
    const state = deriveCausalState({
      powerStructure: { publicLegitimacy: { score: 30, label: 'Contested' } },
    });
    const flat = [
      ...state.summary.surplus,
      ...state.summary.adequate,
      ...state.summary.strained,
      ...state.summary.critical,
      ...state.summary.collapsed,
    ];
    expect(new Set(flat).size).toBe(15);
  });

  it('every band value is canonical', () => {
    const state = deriveCausalState({
      powerStructure: { publicLegitimacy: { score: 60, label: 'Approved' } },
    });
    for (const name of SYSTEM_VARIABLES) {
      expect(CAUSAL_BANDS).toContain(state.bands[name]);
    }
  });

  it('produces neutral baseline for nullish settlement', () => {
    const state = deriveCausalState(null);
    for (const name of SYSTEM_VARIABLES) {
      expect(state.scores[name]).toBe(50);
      expect(state.bands[name]).toBe('adequate');
    }
  });

  it('does not mutate the settlement', () => {
    const s = {
      name: 'Pristine',
      activeConditions: [{ archetype: 'plague', severity: 0.6 }],
      powerStructure: { publicLegitimacy: { score: 60, label: 'Approved' } },
    };
    const before = JSON.stringify(s);
    deriveCausalState(s);
    expect(JSON.stringify(s)).toBe(before);
  });
});

// ── Diagnostic helpers ─────────────────────────────────────────────────

describe('bandForVariable()', () => {
  it('returns the band for a known variable', () => {
    const s = { powerStructure: { publicLegitimacy: { score: 90, label: 'Endorsed' } } };
    expect(bandForVariable(s, 'public_legitimacy')).toBe('surplus');
  });

  it('returns null for unknown variable', () => {
    expect(bandForVariable({}, 'not_a_thing')).toBeNull();
  });
});

describe('pressuresOn()', () => {
  it('returns variables at strained/critical/collapsed', () => {
    const s = {
      powerStructure: { publicLegitimacy: { score: 10, label: 'Legitimacy Crisis' } },
    };
    const pressures = pressuresOn(s);
    expect(Array.isArray(pressures)).toBe(true);
    expect(pressures).toContain('public_legitimacy');
  });
});

describe('summarizeCausalState()', () => {
  it('produces a default line when everything is adequate', () => {
    const lines = summarizeCausalState({});
    expect(Array.isArray(lines)).toBe(true);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('mentions critical or collapsed variables', () => {
    const s = {
      powerStructure: { publicLegitimacy: { score: 5, label: 'Legitimacy Crisis' } },
    };
    const lines = summarizeCausalState(s);
    expect(lines.some(l => /Critical|Collapsed/i.test(l))).toBe(true);
  });
});

describe('supportedSystemVariables()', () => {
  it('returns a copy of the canonical list', () => {
    const list = supportedSystemVariables();
    expect(list).toHaveLength(15);
    expect(list).not.toBe(SYSTEM_VARIABLES);  // copy, not the frozen original
  });
});

// ── Real-settlement integration ────────────────────────────────────────

describe('deriveCausalState() — real generated settlement', () => {
  it('produces a complete substrate against a city-tier settlement', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'causalState-real-city-A', customContent: {} },
    );
    const state = deriveCausalState(settlement);
    for (const name of SYSTEM_VARIABLES) {
      expect(state.variables[name].variable).toBe(name);
      expect(CAUSAL_BANDS).toContain(state.bands[name]);
      expect(state.scores[name]).toBeGreaterThanOrEqual(0);
      expect(state.scores[name]).toBeLessThanOrEqual(100);
    }
  });

  it('plague condition makes food_security and healing_capacity worse', () => {
    const baseline = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'causalState-plague-compare', customContent: {} },
    );
    const plagued = {
      ...baseline,
      activeConditions: [
        ...(baseline.activeConditions || []),
        { archetype: 'plague', severity: 0.7 },
      ],
    };

    const baseFood = deriveSystemVariable('food_security', baseline).score;
    const plagueFood = deriveSystemVariable('food_security', plagued).score;
    expect(plagueFood).toBeLessThan(baseFood);

    const baseHealing = deriveSystemVariable('healing_capacity', baseline).score;
    const plagueHealing = deriveSystemVariable('healing_capacity', plagued).score;
    expect(plagueHealing).toBeLessThan(baseHealing);

    // labor_capacity also takes a hit.
    const baseLabor = deriveSystemVariable('labor_capacity', baseline).score;
    const plagueLabor = deriveSystemVariable('labor_capacity', plagued).score;
    expect(plagueLabor).toBeLessThan(baseLabor);
  });

  it('contributors are populated where structural inputs exist', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'causalState-contributors', customContent: {} },
    );
    const state = deriveCausalState(settlement);
    // At least one variable should have non-empty contributors.
    const variableWithContributors = Object.values(state.variables)
      .find(v => v.contributors.length > 0);
    expect(variableWithContributors).toBeTruthy();
    // Contributors should reference structured sources.
    for (const c of variableWithContributors.contributors) {
      expect(typeof c.source).toBe('string');
      expect(typeof c.effect).toBe('string');
      expect(typeof c.delta).toBe('number');
      expect(typeof c.reason).toBe('string');
    }
  });
});

// ── P3.3b Stage 1a: the two defense dead reads now reach the substrate ───────
// defenseGenerator persists readiness.score (numeric); causalState reads it plus
// the persisted defense scores. Previously def.readinessScore / def.infrastructureScore
// were read but no generator produced them (dead reads — readiness had no fallback).
describe('defense_readiness reads the persisted numeric readiness (P3.3b Stage 1a)', () => {
  const town = (readinessScore) => ({
    name: 'T', tier: 'town', population: 2000,
    config: { monsterThreat: 'safe' },
    defenseProfile: {
      readiness: { score: readinessScore, label: 'x' },
      scores: { military: 50, monster: 50, internal: 50, economic: 50, magical: 50 },
    },
    powerStructure: { factions: [] }, activeConditions: [],
  });

  it('a high-readiness fortress scores higher defense_readiness than an undefended town', () => {
    expect(deriveSystemVariable('defense_readiness', town(90)).score)
      .toBeGreaterThan(deriveSystemVariable('defense_readiness', town(10)).score);
  });

  it('the measured-readiness contributor fires (was a dead def.readinessScore read)', () => {
    const v = deriveSystemVariable('defense_readiness', town(90));
    expect(v.contributors.some(c => c.source === 'defenseProfile.readiness.score')).toBe(true);
  });
});

describe('infrastructure_condition anchors to the persisted defense scores (P3.3b Stage 1a)', () => {
  const town = (military, economic) => ({
    name: 'T', tier: 'town', population: 2000,
    config: {},
    defenseProfile: {
      scores: { military, economic, monster: 50, internal: 50, magical: 50 },
      readiness: { score: 50, label: 'x' },
    },
    institutions: [], powerStructure: { factions: [] }, activeConditions: [],
  });

  it('strong fortifications + logistics raise infrastructure_condition over weak ones', () => {
    expect(deriveSystemVariable('infrastructure_condition', town(90, 90)).score)
      .toBeGreaterThan(deriveSystemVariable('infrastructure_condition', town(10, 10)).score);
  });

  it('the measured contributor fires from defenseProfile.scores (was a dead infrastructureScore read)', () => {
    const v = deriveSystemVariable('infrastructure_condition', town(90, 90));
    expect(v.contributors.some(c => c.source === 'defenseProfile.scores')).toBe(true);
  });

  it('falls back to institution-count inference when no defense profile (legacy save)', () => {
    const dense = { institutions: Array.from({ length: 16 }, (_, i) => ({ id: `i${i}`, name: `Inst ${i}` })), powerStructure: { factions: [] } };
    const thin  = { institutions: [{ id: 'i1', name: 'Inst' }], powerStructure: { factions: [] } };
    const denseV = deriveSystemVariable('infrastructure_condition', dense);
    expect(denseV.score).toBeGreaterThan(deriveSystemVariable('infrastructure_condition', thin).score);
    expect(denseV.contributors.some(c => c.source === 'institutions')).toBe(true);
  });
});
