/**
 * tests/joins/resourceChainCatalog.test.js — F32 join harness for RESOURCE_CHAINS.
 *
 * generateResourceAnalysis (resourceGenerator.js) matches settlement institutions
 * to resource chains BY TAG now, not by exact name-literal. That fixes the class
 * of bug where a chain's processing list carried strings that exist in NO catalog
 * — 'granar' (typo), 'Salt merchant', 'Cheesemaker' — so the chain could never be
 * exploited and the phantom names rendered verbatim into the dossier/PDF gap rows.
 *
 * Nothing pinned that vocabulary, so it rotted silently. This is that pin:
 *   1. every RESOURCE_CHAINS.processingTags value is a tag the institutional
 *      catalog actually DECLARES (an invented tag matches no institution — a dead
 *      capability the analysis pretends to have);
 *   2. every processingInstitutions display name RESOLVES under the same resolver
 *      the runtime matcher uses — a real catalog institution name, or a keyword
 *      the backfill turns into ≥1 canonical tag (so it can never be a mute phantom
 *      like 'granar', which resolves to nothing);
 *   3. every chain is REACHABLE: some real catalog institution satisfies the exact
 *      runtime matcher (institutionSupportsChain) — no chain is orphaned.
 */
import { describe, it, expect } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { RESOURCE_CHAINS } from '../../src/data/resourceChains.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { institutionTags } from '../../src/lib/entities.js';
import { institutionSupportsChain } from '../../src/generators/resourceGenerator.js';

// ── Catalog vocabulary (the runtime ground truth) ──────────────────────────────
// The tags the catalog declares, and the institutions (name + declared tags) a
// settlement can actually generate. institutionSupportsChain sees exactly these.
function collectCatalogInstitutions() {
  const out = new Map(); // name -> {name, tags}
  for (const tier of Object.values(institutionalCatalog)) {
    for (const category of Object.values(tier)) {
      if (!category || typeof category !== 'object') continue;
      for (const [name, spec] of Object.entries(category)) {
        if (!spec || typeof spec !== 'object') continue;
        if (!out.has(name)) out.set(name, { name, tags: Array.isArray(spec.tags) ? spec.tags : [] });
      }
    }
  }
  return [...out.values()];
}
const CATALOG_INSTITUTIONS = collectCatalogInstitutions();
const CATALOG_NAMES = new Set(CATALOG_INSTITUTIONS.map((i) => i.name));
const CATALOG_TAGS = new Set(CATALOG_INSTITUTIONS.flatMap((i) => i.tags));

const chains = Object.entries(RESOURCE_CHAINS).map(([key, c]) => ({ key, ...c }));

describe('F32 — RESOURCE_CHAINS processingTags ⊆ catalog tag vocabulary', () => {
  it('every processingTags value is a tag the catalog actually declares', () => {
    const offenders = [];
    for (const c of chains) {
      for (const t of c.processingTags || []) {
        if (!CATALOG_TAGS.has(t)) offenders.push(`${c.key}: "${t}"`);
      }
    }
    // An invented tag matches no institution — the chain would advertise a
    // processing capability the engine can never fulfil.
    expect(offenders, `chains with ungoverned processingTags: ${JSON.stringify(offenders)}`).toEqual([]);
  });

  it('every chain declares a processingTags array (the field is not optional)', () => {
    const missing = chains.filter((c) => !Array.isArray(c.processingTags)).map((c) => c.key);
    expect(missing).toEqual([]);
  });
});

describe('F32 — processingInstitutions display names resolve (no phantom labels)', () => {
  it('every display name is a catalog institution OR keyword-resolves to ≥1 canonical tag', () => {
    const phantoms = [];
    for (const c of chains) {
      for (const name of c.processingInstitutions || []) {
        const resolves = CATALOG_NAMES.has(name) || institutionTags(name).length > 0;
        if (!resolves) phantoms.push(`${c.key}: "${name}"`);
      }
    }
    // 'granar', 'Salt merchant', 'Cheesemaker' (and the empty-tag labels 'Baker',
    // 'Winery', 'Herbalist', 'Alchemist', 'Bathhouse', 'Stable') used to land here.
    expect(phantoms, `display names that resolve to nothing: ${JSON.stringify(phantoms)}`).toEqual([]);
  });

  it('the specific phantoms the finding named are gone', () => {
    const all = chains.flatMap((c) => c.processingInstitutions || []);
    // 'Town granary' is the anchor — 'granar' was the typo FOR it, so the corrected
    // name travels the exact path the phantom used to. A flattened list that came
    // back empty (the field renamed, the table re-shaped) reds here.
    for (const gone of ['granar', 'Salt merchant', 'Cheesemaker']) {
      expectAbsentWithAnchor(
        all, gone, 'Town granary', `"${gone}" must be corrected to a real catalog name`,
      );
    }
    // and their real replacements are present
    const grain = RESOURCE_CHAINS.grain.processingInstitutions;
    expect(grain).toContain('Town granary');
    expect(RESOURCE_CHAINS.desertSalt.processingInstitutions).toContain('Salt works');
    expect(RESOURCE_CHAINS.livestock.processingInstitutions).toContain('Dairy farmer');
  });
});

describe('F32 — every chain is reachable under the runtime matcher', () => {
  it('some real catalog institution satisfies institutionSupportsChain for each chain', () => {
    const orphans = [];
    for (const c of chains) {
      const reachable = CATALOG_INSTITUTIONS.some((inst) => institutionSupportsChain(inst, c));
      if (!reachable) orphans.push(c.key);
    }
    // A chain no catalog institution can process is dead: it can only ever be
    // 'unexploited', and its processors render as a permanent gap.
    expect(orphans, `orphaned chains (no catalog processor): ${JSON.stringify(orphans)}`).toEqual([]);
  });
});

describe('F32 — pins are not vacuous', () => {
  it('the catalog and chain corpora are non-trivial', () => {
    expect(chains.length).toBeGreaterThanOrEqual(20);
    expect(CATALOG_NAMES.size).toBeGreaterThanOrEqual(100);
    expect(CATALOG_TAGS.size).toBeGreaterThanOrEqual(20);
    // Tags are actually exercised (not every chain is empty-tagged).
    expect(chains.filter((c) => (c.processingTags || []).length > 0).length).toBeGreaterThanOrEqual(15);
  });
});
