import { describe, expect, it } from 'vitest';

import { RESOURCE_CHAINS } from '../../src/data/resourceData.js';
import { TERRAIN_DATA } from '../../src/data/geographyData.js';
import {
  terrainAllowsResource,
  terrainSynonymsFor,
  generateResourceAnalysis,
} from '../../src/generators/resourceGenerator.js';

// The INSTITUTION half of the resource-chain join (processingInstitutions /
// processingTags → catalog) is pinned by tests/joins/resourceChainCatalog.test.js
// (our tag-based join, F32). This file pins the TERRAIN half: a chain classifies
// as active only if its rawResource ALSO resolves to the terrain that holds it.
// rawResource is an idealized DISPLAY string ("copper ore", "gemstones") that
// renders verbatim in the gap/critical report, while TERRAIN_DATA.allowedResources
// names the same material with its own token ("copper", "gemstone_deposits"). The
// plain substring join left four chains matching NO terrain, so a mountain with
// gemstone_deposits + a Jewelers' guild reported no gem processing, export, or
// gap. terrainAllowsResource bridges the two with a synonym table WITHOUT
// renaming the display string. Pin it so a vocabulary rename, a new chain, or a
// dropped synonym reds the gate instead of silently killing a chain.
describe('joins: RESOURCE_CHAINS raw resources resolve to a terrain vocabulary', () => {
  const terrains = Object.values(TERRAIN_DATA);
  const resolvesToSomeTerrain = (rawResource) =>
    terrains.some((t) => terrainAllowsResource(t.allowedResources, rawResource));

  it('the harness sees terrains (not vacuous)', () => {
    expect(terrains.length).toBeGreaterThan(5);
    expect(terrains.every((t) => Array.isArray(t.allowedResources) && t.allowedResources.length > 0)).toBe(true);
  });

  it('every raw resource resolves to at least one terrain (no permanently-dormant chain)', () => {
    const dormant = Object.entries(RESOURCE_CHAINS)
      .filter(([, c]) => !resolvesToSomeTerrain(c.rawResource))
      .map(([k, c]) => `${k}:${c.rawResource}`)
      .sort();
    // flax, grapes, and animal hides used to match NO terrain vocabulary; they were
    // woken as content — flax + hides added to plains, grapes to hills (geographyData).
    // Every chain now has a terrain home. A new chain with none reds here — add its
    // resource to the appropriate terrain's allowedResources (and reseed the golden),
    // don't just exempt it.
    expect(dormant).toEqual([]);
  });

  it('the woken content chains resolve to their terrains', () => {
    // flax + hides live on plains, grapes on hills. flax and grapes match their
    // vocabulary token verbatim; "animal hides" maps to the "hides" token via the
    // synonym table.
    expect(terrainAllowsResource(TERRAIN_DATA.plains.allowedResources, 'flax')).toBe(true);
    expect(terrainAllowsResource(TERRAIN_DATA.plains.allowedResources, 'animal hides')).toBe(true);
    expect(terrainAllowsResource(TERRAIN_DATA.hills.allowedResources, 'grapes')).toBe(true);
    expect(terrainSynonymsFor('animal hides')).toContain('hides');
  });

  it('the four vocabulary-mismatch chains now resolve via the synonym table', () => {
    // These matched NO terrain under the plain substring join — the reported bug:
    //   copper ore↔copper · gold/silver ore↔precious_metals ·
    //   gemstones↔gemstone_deposits · glass sand↔glass_sand
    for (const raw of ['copper ore', 'gold/silver ore', 'gemstones', 'glass sand']) {
      expect(resolvesToSomeTerrain(raw), `"${raw}" should resolve to a terrain`).toBe(true);
      expect(terrainSynonymsFor(raw).length, `"${raw}" needs a synonym token`).toBeGreaterThan(0);
    }
  });

  it('the synonym translates at the matcher — it never renames the displayed rawResource', () => {
    expect(RESOURCE_CHAINS.copperOre.rawResource).toBe('copper ore');
    expect(RESOURCE_CHAINS.preciousMetals.rawResource).toBe('gold/silver ore');
    expect(RESOURCE_CHAINS.gemstones.rawResource).toBe('gemstones');
    expect(RESOURCE_CHAINS.sand.rawResource).toBe('glass sand');
  });

  it('"glass sand" resolves to silica (glass_sand), not generic coastal sand', () => {
    // The synonym is deliberately narrow: a coastal settlement with building sand
    // is not a glassmaking site, so the "sand" chain must not activate there.
    const coastal = TERRAIN_DATA.coastal.allowedResources;
    expect(coastal).toContain('sand');
    expect(terrainAllowsResource(coastal, 'glass sand')).toBe(false);
  });
});

// End-to-end proof through the real generateResourceAnalysis. The
// mountain/hills/desert cases are terrains the old golden-master corpus never
// exercised (it swept a dead `terrain` key); the v3 corpus now covers them, and
// this direct guard survives any manifest regeneration. The processor roster
// uses OUR catalog names (post-F32 processingInstitutions are real catalog ids).
describe('resource analysis: terrain-vocabulary chains classify (cycle-5 miss regression)', () => {
  const nearby = (t) => TERRAIN_DATA[t].allowedResources.slice(0, 7);
  const processors = [
    { name: 'Mine' }, { name: 'Smelter' }, { name: "Jewelers' guild" },
    { name: "Goldsmiths' guild" }, { name: "Coppersmiths' guild" }, { name: 'Glassblower' },
    { name: "Weavers' guild" }, { name: 'Linen workshop' }, { name: 'Tannery' },
    { name: "Leatherworkers' guild" }, { name: 'Vintner' }, { name: "Vintners' guild" },
  ];
  const analyze = (terrain) => generateResourceAnalysis(terrain, nearby(terrain), [], processors, {});
  const classify = (ra, chainKey, rawResource) => ({
    active: ra.resourceChains.some((c) => c.chainKey === chainKey),
    exploited: [...ra.exploitation.fullyExploited, ...ra.exploitation.partiallyExploited]
      .some((c) => c.rawResource === rawResource),
    exported: ra.exports.some((e) => e.chain === rawResource),
    wronglyCritical: ra.imports.critical.includes(rawResource),
  });

  it('a mountain with gem + precious deposits processes and exports them (not a gap)', () => {
    const ra = analyze('mountain');
    for (const [key, raw] of [['gemstones', 'gemstones'], ['preciousMetals', 'gold/silver ore']]) {
      const r = classify(ra, key, raw);
      expect(r.active, `${key} active`).toBe(true);
      expect(r.exploited, `${key} exploited`).toBe(true);
      expect(r.exported, `${key} exported`).toBe(true);
      expect(r.wronglyCritical, `${key} must NOT be reported as a critical import`).toBe(false);
    }
  });

  it('a hills settlement processes copper ore (synonym) and grapes (woken content)', () => {
    const ra = analyze('hills');
    for (const [key, raw] of [['copperOre', 'copper ore'], ['grapes', 'grapes']]) {
      const r = classify(ra, key, raw);
      expect(r.active, `${key} active`).toBe(true);
      expect(r.exploited, `${key} exploited`).toBe(true);
      expect(r.wronglyCritical, `${key} not critical`).toBe(false);
    }
  });

  it('a plains settlement grows flax and works hides (woken content chains)', () => {
    const ra = analyze('plains');
    for (const [key, raw] of [['flax', 'flax'], ['hides', 'animal hides']]) {
      const r = classify(ra, key, raw);
      expect(r.active, `${key} active`).toBe(true);
      expect(r.exploited, `${key} exploited`).toBe(true);
      expect(r.exported, `${key} exported`).toBe(true);
      expect(r.wronglyCritical, `${key} not critical`).toBe(false);
    }
  });

  it('waking flax/hides on plains does not deactivate grain, livestock, or wool', () => {
    // The content swap replaced only non-activating tokens (barley, leather), so
    // every chain plains already worked must still be active.
    const activeKeys = analyze('plains').resourceChains.map((c) => c.chainKey);
    for (const k of ['grain', 'livestock', 'wool']) {
      expect(activeKeys, `${k} must remain active on plains`).toContain(k);
    }
  });

  it('a desert with glass sand processes it', () => {
    const r = classify(analyze('desert'), 'sand', 'glass sand');
    expect(r.active).toBe(true);
    expect(r.exploited).toBe(true);
    expect(r.wronglyCritical).toBe(false);
  });

  it('the synonym table is inert where the material is absent (no phantom chains on plains)', () => {
    // Plains holds none of copper/gems/precious/glass; the synonym table must not
    // conjure them.
    const activeKeys = analyze('plains').resourceChains.map((c) => c.chainKey);
    for (const k of ['copperOre', 'preciousMetals', 'gemstones', 'sand']) {
      expect(activeKeys, `${k} must not activate on plains`).not.toContain(k);
    }
  });

  it('nearby matching reconciles tokens (OUR rule): riverside "freshwater fish" feeds the fish chain', () => {
    // Deliberate divergence from their tree: their nearby side is EXACT membership
    // (+ synonyms); ours reconciles normalized tokens (tokensReconcile) because the
    // production caller passes resource KEYS + commodity tokens, not display strings.
    // Under our rule 'freshwater fish' ⊇ 'fish' legitimately activates the fish
    // chain on riverside. Pinned so a matcher change is a conscious decision.
    const riverside = TERRAIN_DATA.riverside.allowedResources.slice(0, 7);
    expect(riverside).toContain('freshwater fish');
    const active = generateResourceAnalysis('riverside', riverside, [], [], {}).resourceChains.map((c) => c.chainKey);
    expect(active).toContain('fish');
  });
});
