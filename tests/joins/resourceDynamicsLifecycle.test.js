/**
 * resourceDynamicsLifecycle.test.js — W-DISCOVERY STAGE 3: the verification sweep.
 *
 * The lifecycle-path pins the design §4 demands beyond the mover/writer units:
 *   • UNDO round-trip / purity — the writer never mutates its input (undo restores
 *     prior bytes by construction) and the mover is deterministic (paused-resume
 *     re-derives byte-identically).
 *   • REGEN durability — an organic discovery survives a full regeneration via the
 *     resourceEdits overlay, exactly as a DM ADD does.
 *   • structuralFingerprint does NOT false-flag a dynamics-written roster.
 *   • THE MINE FOUNDS ITSELF — a discovery feeds the institutionLifecycle gap
 *     detector a build target, no extra wiring.
 *   • EMPTY-ROSTER tolerance — removal to empty survives every downstream reader
 *     (resolveNearbyCommodities, foodGenerator, economy derivation).
 */
import { describe, test, expect } from 'vitest';

import {
  evaluateResourceDynamics,
  applyResourceMembershipOutcomeToSettlement,
} from '../../src/domain/worldPulse/resourceDynamicsKernel.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { stripDerivedConfigKeys } from '../../src/store/settlementSlice.js';
import { extractReducedFingerprint, extractSettlementFingerprint } from '../../src/lib/structuralFingerprint.js';
import { detectInstitutionGaps } from '../../src/domain/worldPulse/institutionLifecycle.js';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';
import { generateEconomicState } from '../../src/generators/economy/economicState.js';
import { resolveNearbyCommodities } from '../../src/generators/resourceGenerator.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';

const SEED = 're-rt-1';
const BASE_CFG = { settType: 'town', culture: 'germanic', tradeRouteAccess: 'road', monsterThreat: 'frontier' };
const gen = (config, seed, customContent = {}) =>
  generateSettlementPipeline(config, null, { seed, customContent });
const buildNextConfig = (settlement) => ({ ...(settlement?._config || stripDerivedConfigKeys(settlement?.config) || {}) });

const discoverOutcome = (resource) => ({ id: 'o.d', targetSaveId: 'a', severity: 0.5, candidateType: 'resource_discovery', headline: `${resource} found`, summary: 's', resourceMembership: { saveId: 'a', resource, op: 'add' }, metadata: { tick: 100 } });
const removeOutcome = (resource) => ({ id: 'o.r', targetSaveId: 'a', severity: 0.5, candidateType: 'resource_removal', headline: `${resource} gone`, summary: 's', resourceMembership: { saveId: 'a', resource, op: 'remove' }, metadata: { tick: 100 } });

function deepFreeze(o) {
  if (o && typeof o === 'object') { Object.freeze(o); for (const k of Object.keys(o)) deepFreeze(o[k]); }
  return o;
}
const rngStub = { fork: () => ({ random: () => 0 }) };
const snapshotWith = (settlement, id = 'a') => ({ settlements: [{ id, name: id, settlement }] });

// ── 1. UNDO round-trip / purity ────────────────────────────────────────────────
describe('undo round-trip — the writer + mover are pure (paused-resume safe)', () => {
  test('the writer never mutates its input (undo restores prior bytes)', () => {
    const s = gen(BASE_CFG, SEED);
    const before = JSON.parse(JSON.stringify(s));
    // Deep-frozen input: any in-place mutation throws in strict mode.
    expect(() => applyResourceMembershipOutcomeToSettlement(deepFreeze(s), discoverOutcome('grain_fields'))).not.toThrow();
    // The input object is byte-identical after the write — the pre-discovery state
    // (what an undo restores) is intact.
    expect(s).toEqual(before);
  });

  test('the mover is deterministic — same inputs re-derive identical candidates', () => {
    const settlement = {
      config: { terrainType: 'mountain', tradeRouteAccess: 'road', nearbyResources: ['iron_deposits'], nearbyResourcesDepleted: ['iron_deposits'] },
    };
    const ws = { tick: 400, simulationRules: { resourceDynamicsEnabled: true }, settlementTickStates: { a: { resourceDynamics: { depletedSince: { iron_deposits: 0 } } } } };
    const a = evaluateResourceDynamics(ws, snapshotWith(settlement), { get: () => ({ score: 0 }) }, { tick: 400, rng: rngStub });
    const b = evaluateResourceDynamics(ws, snapshotWith(settlement), { get: () => ({ score: 0 }) }, { tick: 400, rng: rngStub });
    expect(a.candidates).toEqual(b.candidates);
    expect(a.worldState.settlementTickStates).toEqual(b.worldState.settlementTickStates);
  });
});

// ── 2. REGEN durability ─────────────────────────────────────────────────────────
describe('regen durability — an organic discovery survives full regeneration', () => {
  test('discover organically → regenerate → the node persists via resourceEdits (like a DM ADD)', () => {
    const s1 = gen(BASE_CFG, SEED);
    expect(s1.config.nearbyResources).not.toContain('grain_fields');

    const discovered = applyResourceMembershipOutcomeToSettlement(s1, discoverOutcome('grain_fields'));
    // The regen-surviving delta, dual-written config + _config (== the DM ADD shape).
    expect(discovered.config.resourceEdits.added).toContainEqual({ key: 'grain_fields', custom: false });
    expect(discovered._config.resourceEdits.added).toContainEqual({ key: 'grain_fields', custom: false });

    // A full regeneration (exactly how applyChange rebuilds its input) keeps the node.
    const s2 = gen(buildNextConfig(discovered), SEED);
    expect(s2.config.nearbyResources).toContain('grain_fields');
    // And the delta rides forward — chained what-ifs keep working.
    expect(s2._config.resourceEdits.added).toContainEqual({ key: 'grain_fields', custom: false });
  });

  test('an organic REMOVAL suppression survives regeneration (a worked-out vein stays gone)', () => {
    const s1 = gen(BASE_CFG, SEED);
    // coal_deposits is rolled for this seed and is an exhaustible seam — the
    // literal worked-out vein this case is named for.
    expect(s1.config.nearbyResources).toContain('coal_deposits');
    const removed = applyResourceMembershipOutcomeToSettlement(s1, removeOutcome('coal_deposits'));
    expect(removed._config.resourceEdits.removedNative).toContain('coal_deposits');
    const s2 = gen(buildNextConfig(removed), SEED);
    expect(s2.config.nearbyResources).not.toContain('coal_deposits');
  });

  test('native exhaustion preserves a same-name custom add across regeneration', () => {
    const customContent = {
      resources: [{
        localUid: 'custom-iron',
        definitionId: 'definition:custom-iron',
        revisionId: 'revision:custom-iron:1',
        name: 'iron_deposits',
        category: 'mineral',
        essential: true,
      }],
    };
    const config = {
      ...BASE_CFG,
      nearbyResourcesRandom: false,
      nearbyResourcesState: {},
      resourceEdits: {
        added: [{ key: 'iron_deposits', custom: true }],
      },
    };
    const generated = gen(config, 'resource-membership-identity', customContent);
    const discovered = applyResourceMembershipOutcomeToSettlement(
      generated,
      discoverOutcome('iron_deposits'),
    );
    const exhausted = applyResourceMembershipOutcomeToSettlement(
      discovered,
      removeOutcome('iron_deposits'),
    );
    const regenerated = gen(
      buildNextConfig(exhausted),
      'resource-membership-identity',
      customContent,
    );

    expect(regenerated.config.nearbyResources)
      .toContain('iron_deposits');
    expect(regenerated.config.nearbyResourcesCustom)
      .toContain('iron_deposits');
    expect(regenerated.config.nearbyResourcesNative)
      .not.toContain('iron_deposits');
    expect(regenerated._config.resourceEdits.added).toEqual([
      { key: 'iron_deposits', custom: true },
    ]);
    expect(regenerated._config.resourceEdits.removedNative)
      .toEqual(['iron_deposits']);
  });
});

// ── 3. structuralFingerprint no false-flag ──────────────────────────────────────
describe('structuralFingerprint — a dynamics-written roster fingerprints cleanly', () => {
  test('reduced + full fingerprints of a discovery-written settlement are valid (never throw / null)', () => {
    const s1 = gen(BASE_CFG, SEED);
    const discovered = applyResourceMembershipOutcomeToSettlement(s1, discoverOutcome('grain_fields'));
    const reduced = extractReducedFingerprint(discovered);
    const full = extractSettlementFingerprint(discovered);
    expect(reduced).toBeTruthy();
    expect(full).toBeTruthy();
    // The resource_strike condition surfaces as a valid condition entry (archetype +
    // band), never prose — the fingerprint stays privacy-safe + well-formed.
    expect(full.conditions.some((c) => c.archetype === 'resource_strike')).toBe(true);
  });
});

// ── 4. THE MINE FOUNDS ITSELF ───────────────────────────────────────────────────
describe('the mine founds itself — a discovery feeds the gap detector a build target', () => {
  test('discovering iron with no works emits a downstream build gap for it', () => {
    const base = {
      tier: 'town', population: 1500, tradeRoute: 'road',
      config: { terrainType: 'plains', tradeRouteAccess: 'road', nearbyResources: ['grain_fields'] },
      institutions: [{ name: 'Town hall', required: true, category: 'civic' }, { name: 'Market', category: 'trade' }],
      economicState: { prosperity: 'Comfortable', activeChains: [], primaryExports: [] },
      activeConditions: [],
    };
    const gapsBefore = detectInstitutionGaps(base).map((g) => g.name);
    const discovered = applyResourceMembershipOutcomeToSettlement(base, discoverOutcome('iron_deposits'));
    const gapsAfter = detectInstitutionGaps(discovered);
    // The discovery opened new build targets the detector now proposes — the mine
    // (or a downstream iron chain) is among them, referencing the local resource.
    expect(gapsAfter.length).toBeGreaterThan(gapsBefore.length);
    expect(gapsAfter.some((g) => /iron|smelt|mine/i.test(`${g.name} ${g.reason}`))).toBe(true);
  });

  test('a custom-only native namesake cannot found built-in iron institutions', () => {
    const customOnly = {
      tier: 'town', population: 1500, tradeRoute: 'road',
      config: {
        terrainType: 'plains',
        tradeRouteAccess: 'road',
        nearbyResources: ['iron_deposits'],
        nearbyResourcesNative: [],
        nearbyResourcesCustom: ['iron_deposits'],
        nearbyResourcesNativeDepleted: [],
      },
      institutions: [
        { name: 'Town hall', required: true, category: 'civic' },
        { name: 'Market', category: 'trade' },
      ],
      economicState: {
        prosperity: 'Comfortable',
        activeChains: [],
        primaryExports: [],
      },
      activeConditions: [],
    };
    const dualOwner = {
      ...customOnly,
      config: {
        ...customOnly.config,
        nearbyResourcesNative: ['iron_deposits'],
      },
    };

    expect(detectInstitutionGaps(customOnly)).toEqual([]);
    expect(
      detectInstitutionGaps(dualOwner)
        .some(gap => /iron|smelt|mine/i.test(`${gap.name} ${gap.reason}`)),
    ).toBe(true);
  });
});

// ── 5. EMPTY-ROSTER tolerance (the owner-named zero-resource hazard) ─────────────
describe('empty-roster tolerance — remove to empty, every reader survives', () => {
  test('resolveNearbyCommodities + foodGenerator + economy derivation all survive an empty roster', () => {
    const base = {
      tier: 'town', population: 1500, tradeRoute: 'road',
      config: { terrainType: 'plains', tradeRouteAccess: 'road', nearbyResources: ['iron_deposits'] },
      institutions: [{ name: 'Town hall', required: true, category: 'civic' }, { name: 'Market', category: 'trade' }],
      economicState: { prosperity: 'Comfortable', activeChains: [], primaryExports: [] },
      activeConditions: [],
    };
    const emptied = applyResourceMembershipOutcomeToSettlement(base, removeOutcome('iron_deposits'));
    expect(emptied.config.nearbyResources).toEqual([]);
    const cfg = emptied.config;

    expect(() => resolveNearbyCommodities(cfg, 'plains')).not.toThrow();
    expect(Array.isArray(resolveNearbyCommodities(cfg, 'plains'))).toBe(true);
    expect(() => generateFoodSecurity('town', base.institutions, cfg)).not.toThrow();
    // The economy derivation is a generation function — run it inside a seeded RNG
    // context (as the pipeline does); the empty roster must not crash it.
    setActiveRng({ random: () => 0 });
    try {
      expect(() => generateEconomicState('town', base.institutions, 'road', {}, cfg)).not.toThrow();
    } finally {
      clearActiveRng();
    }
  });
});
