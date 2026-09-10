/**
 * catalogTagGovernance.test.js — A+ P1.6.
 *
 * entityTags.TAG calls itself "the canonical tag vocabulary for mechanical
 * entities", but 27 of the 42 tag strings the institutionalCatalog actually uses
 * were ungoverned freelance values (isKnownTag silently passed them — a stringly-
 * typed drift surface). This pin asserts EVERY catalog tag is a TAG member, so a
 * typo'd or freelance tag fails the gate instead of silently slipping through.
 */
import { describe, expect, test } from 'vitest';
import { TAG, isKnownTag } from '../../src/data/entityTags.js';
import * as catalog from '../../src/data/institutionalCatalog.js';

function collectTags(node, out = new Set()) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node.tags)) for (const t of node.tags) out.add(t);
  for (const k of Object.keys(node)) collectTags(node[k], out);
  return out;
}

const catalogTags = [...collectTags(catalog)].sort();
const governed = new Set(Object.values(TAG));

describe('institutionalCatalog tags are fully governed by entityTags.TAG', () => {
  test('every distinct catalog tag is a TAG member (42/42)', () => {
    const ungoverned = catalogTags.filter(t => !governed.has(t));
    expect(ungoverned, `ungoverned catalog tags: ${JSON.stringify(ungoverned)}`).toEqual([]);
  });

  test('isKnownTag() is total over real catalog data', () => {
    for (const t of catalogTags) expect(isKnownTag(t), `not known: ${t}`).toBe(true);
  });

  test('the catalog actually uses a non-trivial set of tags (pin is not vacuous)', () => {
    expect(catalogTags.length).toBeGreaterThanOrEqual(40);
  });
});
