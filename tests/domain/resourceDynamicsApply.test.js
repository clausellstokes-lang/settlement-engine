/**
 * resourceDynamicsApply.test.js — W-DISCOVERY STAGE 2: the application write.
 *
 * Pins the ONE writer (applyResourceMembershipOutcomeToSettlement) + the surgical
 * reconcile: membership, the regen-surviving resourceEdits delta (dual-written
 * config + _config), the calamity-precedent production reconcile in BOTH directions,
 * the typed resource_strike/vein_exhausted condition (+ its economic_capacity
 * polarity), FORCE ≡ ORGANIC receipt parity, and the empty-roster tolerance.
 */
import { describe, it, expect } from 'vitest';

import {
  applyResourceMembershipOutcomeToSettlement,
  reconcileProductionAfterResourceChange,
} from '../../src/domain/worldPulse/resourceDynamicsKernel.js';
import { addResource } from '../../src/domain/events/mutateWorld.js';
import { deriveSystemVariable } from '../../src/domain/causalState.js';
import { resolveNearbyCommodities } from '../../src/generators/resourceGenerator.js';
import { computeActiveChains } from '../../src/generators/computeActiveChains.js';

const SMITHS = [
  { name: 'Town hall', required: true, category: 'civic' },
  { name: 'Blacksmith', category: 'crafts' },
  { name: 'Smelter', category: 'industry' },
  { name: 'Iron mine', category: 'industry' },
];

/** A town wired to smelt iron IF it has the ore (the raw_extraction.smelting chain). */
const smithTown = (nearbyResources, over = {}) => ({
  name: 'Ashford', tier: 'town', population: 1500, tradeRoute: 'road',
  config: {
    terrainType: 'plains',
    tradeRouteAccess: 'road',
    nearbyResources: [...nearbyResources],
    nearbyResourcesNative: [...nearbyResources],
    nearbyResourcesCustom: [],
  },
  _config: { terrainType: 'plains', tradeRouteAccess: 'road' },
  institutions: SMITHS,
  economicState: { prosperity: 'Comfortable', activeChains: [], primaryExports: [], primaryImports: [] },
  activeConditions: [],
  ...over,
});

const discoverOutcome = (resource, id = 'out.disc') => ({
  id, targetSaveId: 'a', severity: 0.5, candidateType: 'resource_discovery',
  headline: `${resource} discovered`, summary: 'A strike.',
  resourceMembership: { saveId: 'a', resource, op: 'add' }, metadata: { tick: 100 },
});
const removeOutcome = (resource, id = 'out.rem') => ({
  id, targetSaveId: 'a', severity: 0.5, candidateType: 'resource_removal',
  headline: `${resource} worked out`, summary: 'A dead vein.',
  resourceMembership: { saveId: 'a', resource, op: 'remove' }, metadata: { tick: 100 },
});

// ── 1. DISCOVERY write ─────────────────────────────────────────────────────────
describe('the writer — discovery', () => {
  const applied = applyResourceMembershipOutcomeToSettlement(smithTown(['grain_fields']), discoverOutcome('iron_deposits'));

  it('appends membership + marks it abundant', () => {
    expect(applied.config.nearbyResources).toContain('iron_deposits');
    expect(applied.config.nearbyResourcesNative).toContain('iron_deposits');
    expect(applied.config.nearbyResourcesState.iron_deposits).toBe('abundant');
  });
  it('records the regen-surviving resourceEdits delta, dual-written to _config', () => {
    expect(applied.config.resourceEdits.added).toContainEqual({ key: 'iron_deposits', custom: false });
    expect(applied._config.resourceEdits.added).toContainEqual({ key: 'iron_deposits', custom: false });
  });
  it('appends a resourceHistory entry', () => {
    expect(applied.resourceHistory.at(-1)).toMatchObject({ resource: 'iron_deposits', state: 'discovered' });
  });
  it('plants the bounded positive resource_strike condition', () => {
    const c = applied.activeConditions.find((x) => x.archetype === 'resource_strike');
    expect(c, 'resource_strike planted').toBeTruthy();
    expect(c.duration.expiresAtTicks, 'bounded (capped duration — no snowball)').toBeGreaterThan(0);
  });
  it('the surgical reconcile activates the iron chain + adds its export next tick', () => {
    const cids = applied.economicState.activeChains.map((c) => `${c.needKey}.${c.chainId}`);
    expect(cids).toContain('raw_extraction.smelting');
    expect(applied.economicState.primaryExports.some((e) => /iron/i.test(e))).toBe(true);
  });
});

// ── 2. REMOVAL write ───────────────────────────────────────────────────────────
describe('the writer — removal', () => {
  // Start with iron in the roster AND its chain stamped (as generation would).
  const seed = smithTown(['grain_fields', 'iron_deposits']);
  seed.economicState.activeChains = computeActiveChains(SMITHS, ['grain_fields', 'iron_deposits'], 'town', 'road', [], [], 50);
  seed.economicState.primaryExports = ['Refined iron ingots', 'Grain'];
  const applied = applyResourceMembershipOutcomeToSettlement(seed, removeOutcome('iron_deposits'));

  it('strikes membership + records the removed suppression (dual-written)', () => {
    expect(applied.config.nearbyResources).not.toContain('iron_deposits');
    expect(applied.config.nearbyResourcesNative)
      .not.toContain('iron_deposits');
    expect(applied.config.resourceEdits.removedNative)
      .toContain('iron_deposits');
    expect(applied._config.resourceEdits.removedNative)
      .toContain('iron_deposits');
  });
  it('plants the negative vein_exhausted condition (bounded)', () => {
    const c = applied.activeConditions.find((x) => x.archetype === 'vein_exhausted');
    expect(c, 'vein_exhausted planted').toBeTruthy();
    expect(c.duration.expiresAtTicks).toBeGreaterThan(0);
  });
  it('the surgical reconcile deactivates the iron chain + prunes its export', () => {
    const cids = applied.economicState.activeChains.map((c) => `${c.needKey}.${c.chainId}`);
    expect(cids).not.toContain('raw_extraction.smelting');
    expect(applied.economicState.primaryExports.some((e) => /refined iron/i.test(e))).toBe(false);
  });
});

// ── 3. Reconcile is a no-op when the change activates/deactivates nothing ───────
describe('reconcile — identity when nothing moves', () => {
  it('refreshes terrain production even when no runnable chain changes', () => {
    const s = smithTown(['grain_fields']);
    const eco = s.economicState;
    // gemstone_deposits with no lapidary institution activates no chain, but
    // its terrain commodity is still a canonical regional-production change.
    const out = reconcileProductionAfterResourceChange(eco, {
      settlement: { ...s, config: { ...s.config, nearbyResources: ['grain_fields', 'gemstone_deposits'] } },
      oldResources: ['grain_fields'], newResources: ['grain_fields', 'gemstone_deposits'],
      oldDepleted: [], newDepleted: [],
    });
    expect(out).not.toBe(eco);
    expect(out.activeChains).toEqual([]);
    expect(out.localProduction).toEqual(['grain', 'flour', 'luxury']);
  });
});

// ── 4. FORCE ≡ ORGANIC (receipt parity) ────────────────────────────────────────
describe('force ≡ organic — same downstream shape, differing only in provenance', () => {
  it('a DM ADD_RESOURCE and an organic discovery leave the same membership + resourceEdits.added', () => {
    const base = smithTown(['grain_fields']);
    const organic = applyResourceMembershipOutcomeToSettlement(base, discoverOutcome('iron_deposits'));
    const forced = addResource(smithTown(['grain_fields']), { type: 'ADD_RESOURCE', targetId: 'iron_deposits', id: 'dm1' });
    expect(organic.config.nearbyResources).toEqual(forced.config.nearbyResources);
    expect(organic.config.nearbyResourcesNative)
      .toEqual(forced.config.nearbyResourcesNative);
    expect(organic.config.resourceEdits.added).toEqual(forced.config.resourceEdits.added);
    // Provenance differs: only the organic path plants a condition.
    expect(organic.activeConditions.some((c) => c.archetype === 'resource_strike')).toBe(true);
    expect((forced.activeConditions || []).some((c) => c.archetype === 'resource_strike')).toBe(false);
  });
});

describe('native/custom same-name membership', () => {
  it('organic native exhaustion preserves the exact custom namesake', () => {
    const collision = smithTown(['iron_deposits']);
    collision.config.nearbyResourcesCustom = ['iron_deposits'];
    collision.config.nearbyResourceDefinitions = [{
      name: 'iron_deposits',
      customDefinitionId: 'definition:resources:custom-iron',
    }];
    collision.config.nearbyResourceDefinitionsDepleted = [{
      name: 'iron_deposits',
      customDefinitionId: 'definition:resources:custom-iron',
    }];
    collision.config.nearbyResourcesNativeDepleted = [];
    collision.config.nearbyResourcesDepleted = ['iron_deposits'];
    collision.config.resourceEdits = {
      depletedCustomDefinitionIds: ['definition:resources:custom-iron'],
    };
    const applied = applyResourceMembershipOutcomeToSettlement(
      collision,
      removeOutcome('iron_deposits', 'out.collision'),
    );

    expect(applied.config.nearbyResources).toEqual(['iron_deposits']);
    expect(applied.config.nearbyResourcesNative).toEqual([]);
    expect(applied.config.nearbyResourcesCustom).toEqual(['iron_deposits']);
    expect(applied.config.resourceEdits.removed).toEqual([]);
    expect(applied.config.resourceEdits.removedNative)
      .toEqual(['iron_deposits']);
    expect(applied.config.nearbyResourceDefinitionsDepleted)
      .toEqual(collision.config.nearbyResourceDefinitionsDepleted);
    expect(applied.config.nearbyResourcesDepleted)
      .toEqual(['iron_deposits']);
    expect(applied.config.resourceEdits.depletedCustomDefinitionIds)
      .toEqual(['definition:resources:custom-iron']);
  });

  it('native discovery does not recover an exact depleted custom namesake', () => {
    const customOnly = smithTown([]);
    customOnly.config.nearbyResources = ['iron_deposits'];
    customOnly.config.nearbyResourcesNative = [];
    customOnly.config.nearbyResourcesCustom = ['iron_deposits'];
    customOnly.config.nearbyResourcesNativeDepleted = [];
    customOnly.config.nearbyResourcesDepleted = ['iron_deposits'];
    customOnly.config.nearbyResourceDefinitionsDepleted = [{
      name: 'iron_deposits',
      customDefinitionId: 'definition:resources:custom-iron',
    }];
    customOnly.config.resourceEdits = {
      depletedCustomDefinitionIds: ['definition:resources:custom-iron'],
    };

    const applied = applyResourceMembershipOutcomeToSettlement(
      customOnly,
      discoverOutcome('iron_deposits', 'out.collision-discovery'),
    );

    expect(applied.config.nearbyResourcesNative).toEqual(['iron_deposits']);
    expect(applied.config.nearbyResourcesNativeDepleted).toEqual([]);
    expect(applied.config.nearbyResourcesDepleted).toEqual(['iron_deposits']);
    expect(applied.config.nearbyResourceDefinitionsDepleted)
      .toEqual(customOnly.config.nearbyResourceDefinitionsDepleted);
    expect(applied.config.resourceEdits.depletedCustomDefinitionIds)
      .toEqual(['definition:resources:custom-iron']);
  });

  it('native discovery/removal preserves a same-name custom add receipt', () => {
    const customOnly = smithTown([]);
    customOnly.config.nearbyResources = ['iron_deposits'];
    customOnly.config.nearbyResourcesNative = [];
    customOnly.config.nearbyResourcesCustom = ['iron_deposits'];
    customOnly.config.resourceEdits = {
      added: [{ key: 'iron_deposits', custom: true }],
    };

    const discovered = applyResourceMembershipOutcomeToSettlement(
      customOnly,
      discoverOutcome('iron_deposits', 'out.native-discovery'),
    );
    expect(discovered.config.resourceEdits.added).toEqual([
      { key: 'iron_deposits', custom: true },
      { key: 'iron_deposits', custom: false },
    ]);

    const exhausted = applyResourceMembershipOutcomeToSettlement(
      discovered,
      removeOutcome('iron_deposits', 'out.native-removal'),
    );
    expect(exhausted.config.resourceEdits.added).toEqual([
      { key: 'iron_deposits', custom: true },
    ]);
    expect(exhausted.config.resourceEdits.removedNative)
      .toEqual(['iron_deposits']);
  });
});

// ── 5. THE CONDITION moves economic_capacity in the right direction (end-to-end) ──
// The writer plants vein_exhausted declaring economic_capacity (the default drain — the
// design's "economic_capacity moves through conditions", the removal side); resource_strike
// is a bounded MARKER (affectedSystems []) whose upside flows through the boom seam +
// reconcile, so it leaves economic_capacity at baseline. economic_capacity reads
// prosperity + conditions (NOT activeChains), so the reconcile does not perturb it.
describe('economic_capacity polarity (writer-planted conditions)', () => {
  const cap = (s) => deriveSystemVariable('economic_capacity', s).score;
  it('applying a removal DRAINS economic_capacity below baseline (vein_exhausted)', () => {
    const before = smithTown(['iron_deposits'], { economicState: { prosperity: 'Comfortable', economicComplexity: 'diversified', activeChains: computeActiveChains(SMITHS, ['iron_deposits'], 'town', 'road', [], [], 50), primaryExports: [] } });
    const after = applyResourceMembershipOutcomeToSettlement(before, removeOutcome('iron_deposits'));
    expect(after.activeConditions.some((c) => c.archetype === 'vein_exhausted')).toBe(true);
    expect(cap(after)).toBeLessThan(cap(before));
  });
  it('applying a discovery leaves economic_capacity at baseline (resource_strike is a marker)', () => {
    const before = smithTown(['grain_fields']);
    const after = applyResourceMembershipOutcomeToSettlement(before, discoverOutcome('iron_deposits'));
    expect(after.activeConditions.some((c) => c.archetype === 'resource_strike')).toBe(true);
    expect(cap(after)).toBe(cap(before));
  });
});

// ── 5b. THE :714 GUARD (structural prevention) — planted conditions are BOUNDED ──
describe('condition-boundedness — the :714 immortal hazard is closed at the plant site', () => {
  it('both planted conditions carry a finite, bounded expiresAtTicks (never null/immortal)', () => {
    const disc = applyResourceMembershipOutcomeToSettlement(smithTown(['grain_fields']), discoverOutcome('iron_deposits'));
    const rem = applyResourceMembershipOutcomeToSettlement(smithTown(['iron_deposits']), removeOutcome('iron_deposits'));
    for (const s of [disc, rem]) {
      for (const c of s.activeConditions) {
        if (c.archetype !== 'resource_strike' && c.archetype !== 'vein_exhausted') continue;
        expect(Number.isFinite(c.duration.expiresAtTicks), `${c.archetype} must be bounded`).toBe(true);
        expect(c.duration.expiresAtTicks).toBeGreaterThan(0);
      }
    }
  });
});

// ── 6. EMPTY-ROSTER tolerance (the owner-named zero-resource hazard) ────────────
describe('empty-roster tolerance — remove the last resource', () => {
  it('removing the only resource yields [] and resolveNearbyCommodities survives (terrain fallback)', () => {
    const applied = applyResourceMembershipOutcomeToSettlement(smithTown(['iron_deposits']), removeOutcome('iron_deposits'));
    expect(applied.config.nearbyResources).toEqual([]);
    // The reader tolerates the empty roster — falls back to the terrain default, never throws.
    expect(() => resolveNearbyCommodities(applied.config, 'plains')).not.toThrow();
    const commodities = resolveNearbyCommodities(applied.config, 'plains');
    expect(Array.isArray(commodities)).toBe(true);
  });
});
