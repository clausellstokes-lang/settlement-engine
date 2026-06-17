/**
 * categoryGovernance.test.js — A+ data-schema.4 (re-scoped: GOVERN, don't collapse).
 *
 * The roadmap originally proposed collapsing the institution grouping axis
 * (category, TitleCase) and the faction-role axis (priorityCategory, lowercase)
 * into one catalog-derived source, on the assumption they were redundant. They
 * are NOT: ~1/3 of the 301 catalog entries deliberately diverge (a Crafts-grouped
 * masons' guild is priorityCategory 'government'; an Economy-grouped armoury is
 * 'military'). The two axes encode different information and the runtime faction
 * matcher (economicGenerator's OR-chain) reads BOTH on purpose. Collapsing them
 * would silently drop matches and discard intent.
 *
 * So instead of collapsing, this pins the dual-axis design so it can't drift
 * SILENTLY — the actual failure mode the roadmap cares about (a vocabulary the
 * generator never produces, or a faction role that can no longer match anything):
 *
 *   - both axes are closed sets, declared in src/data/categoryVocabulary.js, and
 *     the catalog uses exactly those values (no freelance key, no dead vocab);
 *   - every faction role (powerData.FACTION_DESCRIPTORS) stays MATCHABLE through
 *     at least one axis — the prevention pin;
 *   - the cascade grouping walk (CASCADE_GROUPING_ORDER) reaches every live
 *     grouping;
 *   - the only entries without a priorityCategory are the documented physical
 *     fortifications (not factions).
 */
import { describe, expect, test } from 'vitest';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { INSTITUTION_GROUPINGS, PRIORITY_CATEGORIES } from '../../src/data/categoryVocabulary.js';
import { FACTION_DESCRIPTORS } from '../../src/data/powerData.js';
import { CASCADE_GROUPING_ORDER } from '../../src/generators/cascadeGenerator.js';

// Flatten tier -> grouping -> name -> entry into rows carrying both axes.
const rows = [];
for (const [tier, groups] of Object.entries(institutionalCatalog)) {
  for (const [grouping, insts] of Object.entries(groups)) {
    for (const [name, e] of Object.entries(insts)) {
      rows.push({ tier, grouping, name, priorityCategory: e?.priorityCategory });
    }
  }
}

const usedGroupings = new Set(rows.map((r) => r.grouping));
const usedPriority = new Set(rows.map((r) => r.priorityCategory).filter((p) => p != null));
const declaredGroupings = new Set(INSTITUTION_GROUPINGS);
const declaredPriority = new Set(PRIORITY_CATEGORIES);

describe('data-schema.4 — institution grouping axis (closed set)', () => {
  test('every catalog grouping key is declared in INSTITUTION_GROUPINGS', () => {
    const freelance = [...usedGroupings].filter((g) => !declaredGroupings.has(g)).sort();
    expect(freelance, `undeclared grouping keys: ${JSON.stringify(freelance)}`).toEqual([]);
  });

  test('no declared grouping is dead (declared set == used set)', () => {
    expect([...declaredGroupings].sort()).toEqual([...usedGroupings].sort());
  });

  test('pin is not vacuous', () => {
    expect(rows.length).toBeGreaterThanOrEqual(250);
    expect(usedGroupings.size).toBeGreaterThanOrEqual(10);
  });
});

describe('data-schema.4 — faction-role (priorityCategory) axis (closed set)', () => {
  test('every entry priorityCategory (when present) is declared in PRIORITY_CATEGORIES', () => {
    const freelance = [...usedPriority].filter((p) => !declaredPriority.has(p)).sort();
    expect(freelance, `undeclared priorityCategory values: ${JSON.stringify(freelance)}`).toEqual([]);
  });

  test('no declared priorityCategory is dead (declared set == used set)', () => {
    expect([...declaredPriority].sort()).toEqual([...usedPriority].sort());
  });

  // Physical fortifications ("Palisade or earthworks") are structures, not
  // factions, so they carry NO priorityCategory by design. Allowlist them by
  // name so a NEW role-less entry (a likely authoring mistake) is surfaced.
  test('the only entries without a priorityCategory are the documented fortifications', () => {
    const missing = rows.filter((r) => r.priorityCategory == null).map((r) => r.name);
    const unexpected = [...new Set(missing)].filter((n) => n !== 'Palisade or earthworks');
    expect(unexpected, `entries missing priorityCategory that are not allowlisted: ${JSON.stringify(unexpected)}`).toEqual([]);
  });
});

describe('data-schema.4 — faction roles stay matchable (the prevention pin)', () => {
  const roles = Object.keys(FACTION_DESCRIPTORS);
  const matchable = new Set([
    ...PRIORITY_CATEGORIES,
    ...INSTITUTION_GROUPINGS.map((g) => g.toLowerCase()),
  ]);

  test('FACTION_DESCRIPTORS is the expected closed role set', () => {
    expect(roles.slice().sort()).toEqual(
      ['criminal', 'economy', 'government', 'magic', 'military', 'other', 'religious'],
    );
  });

  test('every role (except the catch-all "other") matches via priorityCategory OR grouping', () => {
    // This is the core invariant: a role that names neither a priorityCategory
    // value nor a grouping key can NEVER match an institution — a silent
    // false-negative (the constants.js resilience-dial failure mode). E.g.
    // 'religious' is carried by the 'Religious' grouping (entries are
    // priorityCategory 'religion'); 'military' by the 'military' priorityCategory
    // (the grouping is 'Defense'). Both must stay reachable.
    const dead = roles.filter((r) => r !== 'other' && !matchable.has(r));
    expect(dead, `faction roles that can match NO institution: ${JSON.stringify(dead)}`).toEqual([]);
  });
});

describe('data-schema.4 — cascade reaches every live grouping', () => {
  test('CASCADE_GROUPING_ORDER includes every grouping the catalog uses', () => {
    const order = new Set(CASCADE_GROUPING_ORDER);
    const unreachable = [...usedGroupings].filter((g) => !order.has(g)).sort();
    expect(unreachable, `groupings the cascade never seeds: ${JSON.stringify(unreachable)}`).toEqual([]);
  });

  test('the only cascade key beyond live groupings is the reserved "Essential"', () => {
    const extra = CASCADE_GROUPING_ORDER.filter((g) => !usedGroupings.has(g)).sort();
    expect(extra).toEqual(['Essential']);
  });
});
