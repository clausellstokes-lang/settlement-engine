/**
 * tests/generators/resourceAnalysisCoupling.test.js — F32 behavior pins.
 *
 * Before F32, generateNarratives fed generateResourceAnalysis the whole terrain
 * slice (TERRAIN_DATA[terrain].allowedResources) as "nearby resources", so the
 * resource-analysis section was IDENTICAL for every settlement on a terrain —
 * decoupled from the resources that settlement actually rolled. resolveNearby
 * Commodities now maps the settlement's real config.nearbyResources through to
 * commodity/key tokens, and evaluateEconomicActivity reconciles those against
 * each chain's rawResource. These pins lock the coupling in:
 *   - same terrain + different nearby resources ⇒ different active-chain sets;
 *   - a depleted node contributes nothing;
 *   - the analysis is a pure function of (terrain, config, institutions).
 */
import { describe, it, expect } from 'vitest';
import {
  generateResourceAnalysis,
  resolveNearbyCommodities,
} from '../../src/generators/resourceGenerator.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getCompatibleResources } from '../../src/generators/terrainHelpers.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const TERRAIN = 'mountain'; // allows stone_quarry, mountain_timber, iron_deposits, …

const activeKeys = (analysis) =>
  (analysis.resourceChains || []).map((c) => c.chainKey).sort();

const analyze = (config, institutions = []) =>
  generateResourceAnalysis(
    TERRAIN,
    resolveNearbyCommodities(config, TERRAIN),
    [],
    institutions,
    config,
  );

describe('F32 — resource analysis couples to the settlement, not just the terrain', () => {
  it('two settlements on the same terrain with different nearby resources get different active chains', () => {
    const stoneTown = analyze({ nearbyResources: ['stone_quarry'] });
    const timberTown = analyze({ nearbyResources: ['mountain_timber'] });

    const stoneChains = activeKeys(stoneTown);
    const timberChains = activeKeys(timberTown);

    // The tautology this kills: identical terrain used to force identical chains.
    expect(stoneChains).not.toEqual(timberChains);
    expect(stoneChains).toEqual(['stone']);
    // Each exclusion is anchored by the chain the roster DID activate: 'stone' proves
    // the quarry roster produced a live chain set, 'timber' the same for the forest
    // roster. An analysis that stopped returning chains entirely now reds.
    expectAbsentWithAnchor(stoneChains, 'timber', 'stone', 'quarry roster activates stone only');
    expectAbsentWithAnchor(stoneChains, 'gemstones', 'stone', 'quarry roster activates stone only');
    expect(timberChains).toContain('timber');
    expectAbsentWithAnchor(timberChains, 'stone', 'timber', 'forest roster activates timber only');
  });

  it('a commodity reconciles with its chain rawResource across vocabularies (iron ← iron_deposits)', () => {
    // config key 'iron_deposits' → commodity 'iron' → chain rawResource 'iron ore'
    // (the normalized substring bridge). It only surfaces where terrain allows it;
    // stone_quarry's 'stone' commodity must NOT masquerade as iron.
    const commodities = resolveNearbyCommodities({ nearbyResources: ['iron_deposits'] }, TERRAIN);
    expect(commodities).toContain('iron');
    expect(commodities).toContain('iron_deposits');
    expectAbsentWithAnchor(commodities, 'stone', 'iron', 'iron_deposits resolves to iron, never stone');
  });

  it('river clay activates ceramics, never the stone-quarry chain', () => {
    const config = { nearbyResources: ['river_clay'] };
    const commodities = resolveNearbyCommodities(config, 'riverside');
    const analysis = generateResourceAnalysis(
      'riverside',
      commodities,
      [],
      [{ name: 'Potter', tags: ['trade'] }],
      config,
    );

    expect(commodities).toContain('clay');
    expectAbsentWithAnchor(commodities, 'stone', 'clay', 'river clay resolves to clay, never stone');
    expect(activeKeys(analysis)).toContain('clay');
    expectAbsentWithAnchor(activeKeys(analysis), 'stone', 'clay', 'river clay activates ceramics, never the quarry chain');
  });

  it('treats a riverside port as river geography for resource eligibility', () => {
    const compatibility = Object.fromEntries(
      getCompatibleResources('port', 'riverside')
        .map(resource => [resource.key, resource.compatible]),
    );

    expect(compatibility.river_fish).toBe(true);
    expect(compatibility.river_mills).toBe(true);
    expect(compatibility.fishing_grounds).toBe(false);
    expect(compatibility.deep_harbour).toBe(false);
    expect(compatibility.shipbuilding_timber).toBe(false);
  });

  it('does not report local quarry stone as a critical import', () => {
    const settlement = generateSettlementPipeline(
      {
        settType: 'town',
        culture: 'germanic',
        terrainOverride: 'riverside',
        tradeRouteAccess: 'river',
        nearbyResourcesRandom: false,
        nearbyResources: ['stone_quarry'],
        nearbyResourcesNative: ['stone_quarry'],
        nearbyResourcesNativeDepleted: [],
        resourceState: { stone_quarry: 'allow' },
      },
      null,
      { seed: 'riverside-stone-audit', customContent: {} },
    );

    expect(activeKeys(settlement.resourceAnalysis)).toEqual(['stone']);
    // The critical-import list is genuinely populated for this seed ('metals' is one of
    // nine entries), so asserting a live sibling FIRST stops the stone exclusion below
    // from passing on an empty join — the vacuity this pin would otherwise hide.
    const criticalImports = settlement.resourceAnalysis.imports.critical.join(' ');
    expect(criticalImports).toMatch(/\bmetals\b/);
    // anchored: the metals assertion above proves imports.critical is live and populated
    expect(criticalImports).not.toMatch(/\bstone\b/i);
    expect(
      settlement.generationCoherenceReceipt.checks.find(
        check => check.id === 'resource_truth',
      ),
    ).toMatchObject({
      status: 'pass',
      findings: [],
    });
  });

  it('does not turn optional chain opportunities into hard resource dependencies', () => {
    const settlement = generateSettlementPipeline(
      {
        settType: 'village',
        culture: 'slavic',
        terrainOverride: 'plains',
        tradeRouteAccess: 'isolated',
        monsterThreat: 'plagued',
        contentProfile: 'grim',
        magicExists: true,
        priorityMagic: 90,
        priorityEconomy: 19,
        priorityMilitary: 18,
        priorityReligion: 98,
        priorityCriminal: 95,
      },
      null,
      { seed: 'intent-20', customContent: {} },
    );
    const diagnostics = [
      ...(settlement.economicViability.issues || []),
      ...(settlement.economicViability.warnings || []),
      ...(settlement.economicViability.suggestions || []),
    ];
    const prose = JSON.stringify(diagnostics);

    // This settlement DOES earn diagnostics (the isolated stockpile dependency), so the
    // blob is live prose rather than the '[]' an empty list would serialize to — which
    // would satisfy both exclusions below without proving anything.
    expect(prose).toMatch(/Isolated: Stockpile Dependency/);
    // anchored: the stockpile-dependency assertion above proves `prose` is a live, non-empty blob
    expect(prose).not.toMatch(/stone quarry[^.]*requires iron ore/i);
    // anchored: same live-diagnostics blob asserted immediately above
    expect(prose).not.toMatch(/parish church[^.]*requires hot springs/i);
    expect(
      diagnostics.filter(item => item.category === 'Resource Access'),
    ).toEqual([]);
    expect(
      settlement.generationCoherenceReceipt.checks.find(
        check => check.id === 'resource_truth',
      ),
    ).toMatchObject({
      status: 'pass',
      findings: [],
    });
  });
});

describe('F32 — depleted resources are excluded from the analysis', () => {
  it('a depleted node drops its chain while a live sibling keeps it (nearbyResourcesDepleted)', () => {
    const both = analyze({ nearbyResources: ['stone_quarry', 'mountain_timber'] });
    const stoneDepleted = analyze({
      nearbyResources: ['stone_quarry', 'mountain_timber'],
      nearbyResourcesDepleted: ['stone_quarry'],
    });

    expect(activeKeys(both)).toContain('stone');
    expect(activeKeys(both)).toContain('timber');
    // Worked-out quarry ⇒ no stone chain; the timber sibling is untouched — and that
    // untouched sibling is exactly the anchor proving the analysis still ran.
    expectAbsentWithAnchor(activeKeys(stoneDepleted), 'stone', 'timber', 'depleted quarry drops only its own chain');
    expect(activeKeys(stoneDepleted)).toContain('timber');
    expect(stoneDepleted.resourceConditions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'stone_quarry',
          type: 'exhaustible',
          condition: 'depleted',
          randomDepletionEligible: true,
        }),
        expect.objectContaining({
          key: 'mountain_timber',
          type: 'renewable',
          condition: 'available',
          randomDepletionEligible: true,
        }),
      ]),
    );
    expect(stoneDepleted.conditionNotes.join(' ')).toMatch(/quarry face is exhausted/i);
  });

  it('the manual state map is honoured too (nearbyResourcesState: depleted)', () => {
    const depletedViaState = analyze({
      nearbyResources: ['stone_quarry', 'mountain_timber'],
      nearbyResourcesState: { stone_quarry: 'depleted' },
    });
    expectAbsentWithAnchor(activeKeys(depletedViaState), 'stone', 'timber', 'manual depleted state drops only its own chain');
    expect(activeKeys(depletedViaState)).toContain('timber');
  });

  it('keeps native and exact custom depletion separate behind one label', () => {
    const customOnly = resolveNearbyCommodities({
      nearbyResources: ['iron_deposits'],
      nearbyResourcesNative: [],
      nearbyResourcesNativeDepleted: [],
      nearbyResourcesCustom: ['iron_deposits'],
      nearbyResourcesDepleted: ['iron_deposits'],
    }, TERRAIN);
    expect(customOnly).toEqual([]);

    const nativeBesideDepletedCustom = resolveNearbyCommodities({
      nearbyResources: ['iron_deposits'],
      nearbyResourcesNative: ['iron_deposits'],
      nearbyResourcesNativeDepleted: [],
      nearbyResourcesCustom: ['iron_deposits'],
      nearbyResourcesDepleted: ['iron_deposits'],
    }, TERRAIN);
    expect(nativeBesideDepletedCustom).toEqual(
      expect.arrayContaining(['iron_deposits', 'iron']),
    );
  });

  it('does not replace an all-depleted native roster with terrain defaults', () => {
    const commodities = resolveNearbyCommodities({
      nearbyResources: ['iron_deposits'],
      nearbyResourcesNative: ['iron_deposits'],
      nearbyResourcesNativeDepleted: ['iron_deposits'],
      nearbyResourcesDepleted: ['iron_deposits'],
    }, TERRAIN);

    expect(commodities).toEqual([]);
  });

  it('falls back to the terrain default only when the roster is empty/unresolvable', () => {
    // No rolled roster → terrain allowedResources (old behavior preserved).
    const fallback = resolveNearbyCommodities({ nearbyResources: [] }, TERRAIN);
    expect(fallback.length).toBeGreaterThan(0);
    // An unknown key resolves to nothing → also falls back rather than crashing.
    const unknown = resolveNearbyCommodities({ nearbyResources: ['not_a_real_resource'] }, TERRAIN);
    expect(unknown.length).toBeGreaterThan(0);
  });
});

describe('F32 — analysis is deterministic (pure function of inputs)', () => {
  it('same config + institutions twice ⇒ byte-identical analysis', () => {
    const config = { nearbyResources: ['stone_quarry', 'mountain_timber', 'iron_deposits'] };
    const insts = [{ name: 'Blacksmith', tags: ['metalwork'] }, { name: 'Stone quarry', tags: ['trade'] }];
    const a = generateResourceAnalysis(TERRAIN, resolveNearbyCommodities(config, TERRAIN), [], insts, config);
    const b = generateResourceAnalysis(TERRAIN, resolveNearbyCommodities(config, TERRAIN), [], insts, config);
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
  });

  it('resolveNearbyCommodities is order-stable for a fixed config', () => {
    const config = { nearbyResources: ['iron_deposits', 'stone_quarry'] };
    expect(resolveNearbyCommodities(config, TERRAIN)).toEqual(resolveNearbyCommodities(config, TERRAIN));
  });
});
