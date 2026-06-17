/**
 * dataVocabularyCoverage.test.js — A+ data-schema.5.
 *
 * catalogTagGovernance.test.js (P1.6 / data-schema.1) proves the institution
 * catalog's tags are fully governed by entityTags.TAG. But the same stringly-
 * typed drift class lives in the OTHER classified data files — resources carry a
 * `category`, trade goods carry a `category` + a commodity axis — and the tag
 * vocabulary can rot the opposite way too: a TAG.* constant that nothing emits
 * and no query can select (dead schema that implies a capability the engine
 * never had). This file generalizes the coverage invariant to ALL classified
 * data and adds the orphan-tag guard, so the whole vocabulary stays honest.
 *
 * Axes pinned here:
 *   - RESOURCE_DATA.category        ⊆ a closed set {land, special, subterranean, water}
 *   - trade-good .category          ⊆ GOODS_CATEGORIES (the file's own declared vocab)
 *   - COMMODITY_CATEGORY_MAP values ⊆ a closed set (snapshot; new types surface for review)
 *   - every entityTags.TAG.*        is REACHABLE (catalog-declared ∨ in a TAG_GROUPS
 *                                    bundle ∨ produced by the keyword-backfill) — no orphans
 *
 * Note on services: institutionServices.js carries NO classification axis
 * (entries are { on, p, desc } keyed by service + institution name) — there is
 * no tag/category field to govern, so it is intentionally not walked here.
 */
import { describe, expect, test } from 'vitest';
import { TAG, TAG_GROUPS } from '../../src/data/entityTags.js';
import { INSTITUTION_KEYWORD_TAGS } from '../../src/lib/entities.js';
import * as catalog from '../../src/data/institutionalCatalog.js';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';
import {
  GOODS_CATEGORIES,
  EXPORT_GOODS_BY_TIER,
  IMPORT_GOODS_BY_TIER,
  COMMODITY_CATEGORY_MAP,
} from '../../src/data/tradeGoodsData.js';

// ── Resources ──────────────────────────────────────────────────────────────
// The resource category axis is a small closed set. Pinning it exactly means a
// new/typo'd category (e.g. 'aquatic' instead of 'water') fails the gate instead
// of silently producing a resource no generator branch handles.
const RESOURCE_CATEGORIES = new Set(['land', 'special', 'subterranean', 'water']);

describe('data-schema.5 — RESOURCE_DATA category coverage', () => {
  test('every resource category is in the closed set', () => {
    const offenders = Object.entries(RESOURCE_DATA)
      .filter(([, r]) => !RESOURCE_CATEGORIES.has(r.category))
      .map(([k, r]) => `${k}:${r.category}`);
    expect(offenders, `resources with ungoverned category: ${JSON.stringify(offenders)}`).toEqual([]);
  });

  test('the closed set is exactly what the data uses (no dead category)', () => {
    const used = new Set(Object.values(RESOURCE_DATA).map((r) => r.category));
    expect([...used].sort()).toEqual([...RESOURCE_CATEGORIES].sort());
  });

  test('pin is not vacuous', () => {
    expect(Object.keys(RESOURCE_DATA).length).toBeGreaterThanOrEqual(20);
  });
});

// ── Trade goods ──────────────────────────────────────────────────────────────
// Walk every good across both directions and all tiers. A tier is an object
// keyed by good-name → good record; older shapes may be arrays — handle both.
function* allGoods(byTier) {
  for (const tier of Object.values(byTier || {})) {
    if (Array.isArray(tier)) yield* tier;
    else if (tier && typeof tier === 'object') yield* Object.values(tier);
  }
}

describe('data-schema.5 — trade-good category coverage', () => {
  const vocab = new Set(Object.values(GOODS_CATEGORIES));

  test('every good.category is a GOODS_CATEGORIES value', () => {
    const offenders = [];
    for (const src of [EXPORT_GOODS_BY_TIER, IMPORT_GOODS_BY_TIER]) {
      for (const g of allGoods(src)) {
        if (g && g.category != null && !vocab.has(g.category)) {
          offenders.push(`${g.name ?? '?'}:${g.category}`);
        }
      }
    }
    expect(offenders, `goods with ungoverned category: ${JSON.stringify(offenders)}`).toEqual([]);
  });

  test('pin is not vacuous (goods are actually walked)', () => {
    let n = 0;
    for (const g of allGoods(EXPORT_GOODS_BY_TIER)) if (g) n++;
    expect(n).toBeGreaterThanOrEqual(20);
  });

  // COMMODITY_CATEGORY_MAP is a SEPARATE axis (commodity type, not GOODS_CATEGORIES).
  // It has no declared enum, so we pin it as a closed snapshot: adding a new
  // commodity type is surfaced for deliberate review instead of slipping in.
  const COMMODITY_TYPES = new Set([
    'craft', 'fish', 'fuel', 'grain', 'herbs', 'iron',
    'luxury', 'precious_metal', 'salt', 'stone', 'textile', 'timber',
  ]);
  test('COMMODITY_CATEGORY_MAP values are the pinned closed set', () => {
    const used = new Set(Object.values(COMMODITY_CATEGORY_MAP || {}));
    expect([...used].sort()).toEqual([...COMMODITY_TYPES].sort());
  });
});

// ── Orphan tags ──────────────────────────────────────────────────────────────
// A tag is REACHABLE if some consumer can put it on an entity that a query then
// selects: it is declared on a catalog entry, OR bundled in a TAG_GROUPS group,
// OR produced by the institution keyword-backfill. A TAG.* reachable by none of
// these is dead vocabulary — nothing emits it, no query selects it.
function collectCatalogTags(node, out = new Set()) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node.tags)) for (const t of node.tags) out.add(t);
  for (const k of Object.keys(node)) collectCatalogTags(node[k], out);
  return out;
}

describe('data-schema.5 — no orphan tags in entityTags.TAG', () => {
  const reachable = new Set();
  for (const t of collectCatalogTags(catalog)) reachable.add(t);
  for (const group of Object.values(TAG_GROUPS)) for (const t of group) reachable.add(t);
  for (const rule of INSTITUTION_KEYWORD_TAGS) for (const t of rule.tags) reachable.add(t);

  test('every TAG.* value is reachable (declared, grouped, or backfilled)', () => {
    const orphans = Object.values(TAG).filter((t) => !reachable.has(t));
    expect(
      orphans,
      `orphan tags (no catalog entry, group, or keyword rule emits them): ${JSON.stringify(orphans)} — wire into a TAG_GROUPS bundle / keyword rule, or delete from TAG`,
    ).toEqual([]);
  });

  test('reachability inputs are non-trivial (guards against a vacuous pass)', () => {
    expect(Object.values(TAG).length).toBeGreaterThanOrEqual(40);
    expect(INSTITUTION_KEYWORD_TAGS.length).toBeGreaterThanOrEqual(10);
    expect(Object.keys(TAG_GROUPS).length).toBeGreaterThanOrEqual(5);
  });
});
