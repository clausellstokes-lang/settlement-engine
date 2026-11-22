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
import { CULTURE_PROFILES } from '../../src/data/cultureProfiles.js';
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
      ['crafts', 'criminal', 'economy', 'government', 'magic', 'military', 'noble', 'other', 'religious'],
    );
  });

  // Roles reachable NOT through institution matching but through the emergent
  // NPC-cluster / DM-compendium naming path (factionGrouping's descriptor pick ->
  // FACTION_DESCRIPTORS[dominantCategory]). 'noble' is a faction category
  // surfaced on generated noble factions but has no institution
  // grouping/priorityCategory, so it is matchable through that path rather than
  // the institution OR-chain below. Kept as a named allowlist so a genuinely
  // dead role (no consumer at all) still trips.
  const NON_INSTITUTION_MATCHABLE = new Set(['noble']);

  test('every role (except the catch-all "other") matches via an institution axis OR the faction-naming path', () => {
    // The core invariant: a role that names neither a priorityCategory value nor a
    // grouping key can NEVER match an institution — a silent false-negative (the
    // constants.js resilience-dial failure mode). E.g. 'religious' is carried by the
    // 'Religious' grouping (entries are priorityCategory 'religion'); 'military' by
    // the 'military' priorityCategory (the grouping is 'Defense'). Both must stay
    // reachable. 'noble' is reached through the faction-naming path, not institutions,
    // so it is allowlisted (see NON_INSTITUTION_MATCHABLE).
    const dead = roles.filter(
      (r) => r !== 'other' && !matchable.has(r) && !NON_INSTITUTION_MATCHABLE.has(r),
    );
    expect(dead, `faction roles that can match NO institution and are not allowlisted: ${JSON.stringify(dead)}`).toEqual([]);
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

// ── THE CULTURE-BIAS KEY RATCHET (T8, ODQ §759.5) ────────────────────────────────
// `cultureInstitutionMultiplier` weights a culture's institution likelihood by matching
// its `institutionBias.categories` keys against the GROUPING text and its `.keywords`
// keys against the institution NAME — both by lowercased substring. A key that matches
// nothing is not an error anywhere: the loop simply never multiplies, so the authored
// intent is silently absent and every world looks fine. §759.5 measured three such keys;
// the walker below measured FOURTEEN, and the gap is the reason the ratchet exists at all.
//
// ⚠ WHY THE DEAD KEYS ARE FROZEN RATHER THAN FIXED OR DELETED. Both cures are out of a
// lane's hands and for the same reason: a bias weight is a TUNING VALUE.
//   - RETARGETING is a tuning-signature change. `Agriculture` plainly means the Economy
//     shelf (it holds the dairy farmers, salt works, quarries and mines), but retargeting
//     it would make three cultures' agrarian bias REAL for the first time and move
//     generated institution distributions. Worse, mesoamerican already declares
//     `Economy: 1.07` beside `Agriculture: 1.07`, so a retarget COMPOUNDS to 1.07 × 1.07
//     rather than restating the intent — the boundary is the owner's, not a lane's.
//   - DELETING drops authored intent that three cultures were written with.
// So the fourteen are inventoried, each with its reason, and the set can only SHRINK. A
// new dead key reds immediately; a cured one forces its row out of this list, which is the
// §761.3 named-exception idiom applied to data instead of prose.
const KNOWN_DEAD_BIAS_KEYS = Object.freeze([
  // culture         kind         key             what it was reaching for
  ['celtic', 'categories', 'Agriculture'], //     the Economy shelf's husbandry rows
  ['celtic', 'keywords', 'livestock'], //         no catalog name contains it
  ['slavic', 'categories', 'Agriculture'], //     as celtic
  ['slavic', 'keywords', 'timber'], //            the sawmills are named 'Sawmill'
  ['east_asian', 'keywords', 'canal'], //         no canal institution exists
  ['east_asian', 'keywords', 'garden'], //        no garden institution exists
  ['mesoamerican', 'categories', 'Agriculture'], // and it would COMPOUND with Economy 1.07
  ['mesoamerican', 'keywords', 'temple'], //      the sacred rows are named otherwise
  ['mesoamerican', 'keywords', 'garden'], //      as east_asian
  ['mesoamerican', 'keywords', 'causeway'], //    no causeway institution exists
  ['mesoamerican', 'keywords', 'reservoir'], //   no reservoir institution exists
  ['south_asian', 'keywords', 'temple'], //       as mesoamerican
  ['steppe', 'keywords', 'horse'], //             the stables are named 'Stable master' etc.
  ['steppe', 'keywords', 'pasture'], //           no pasture institution exists
]);

// Hoisted to module scope: the lighting census's straight-line law (G2, the eighth cut)
// admits only declarations inside a describe block — a `for…of` at statement position parks
// the file whole (SUITE_NOT_STRAIGHT_LINE), which is the census refusing to guess, not a bug.
// The walk below is a pure move from the §759.5 suite; `rows` above is computed the same way.
const groupingText = INSTITUTION_GROUPINGS.map((g) => String(g).toLowerCase());
const nameText = rows.map((r) => r.name.toLowerCase());
const matches = (kind, key) => {
  const needle = String(key).toLowerCase();
  return kind === 'categories'
    ? groupingText.some((g) => g.includes(needle))
    : nameText.some((n) => n.includes(needle));
};
const liveKeys = [];
const deadKeys = [];
for (const [culture, profile] of Object.entries(CULTURE_PROFILES)) {
  const bias = profile?.institutionBias;
  if (!bias) continue;
  for (const kind of ['categories', 'keywords']) {
    for (const key of Object.keys(bias[kind] || {})) {
      (matches(kind, key) ? liveKeys : deadKeys).push([culture, kind, key]);
    }
  }
}

describe('§759.5 — every culture-bias key can match something (shrink-only)', () => {
  test('the census is live — most keys DO match, so an empty dead set would mean something', () => {
    // ANCHOR. Without this, "no new dead keys" would pass just as happily if
    // CULTURE_PROFILES were emptied, the grouping vocabulary renamed, or the catalog
    // failed to load — the vacuity class tests/helpers/anchoredNegatives.js exists for.
    expect(liveKeys.length).toBeGreaterThanOrEqual(60);
    expect(liveKeys.length + deadKeys.length).toBe(81);
    expect(nameText.length).toBeGreaterThanOrEqual(250);
  });

  test('the dead set is EXACTLY the frozen inventory — new ones red, cured ones must be removed', () => {
    const live = deadKeys.map((r) => r.join('|')).sort();
    const frozen = KNOWN_DEAD_BIAS_KEYS.map((r) => r.join('|')).sort();
    expect(
      live,
      'a culture-bias key changed its liveness. A NEW dead key means an authored bias silently '
      + 'does nothing — fix the key or the vocabulary. A key that came ALIVE means its row must '
      + 'leave KNOWN_DEAD_BIAS_KEYS, so the win is banked and the list can only shrink. '
      + 'Retargeting a dead key to a live grouping is a TUNING change and is owner-signed.',
    ).toEqual(frozen);
  });

  test('the detector is not vacuous — it convicts a planted dead key and clears a planted live one', () => {
    expect(matches('categories', 'Agriculture')).toBe(false); // the real one
    expect(matches('categories', 'Economy')).toBe(true); // the shelf it was reaching for
    expect(matches('keywords', 'definitely-not-an-institution')).toBe(false);
    expect(matches('keywords', 'smith')).toBe(true); // Blacksmith, Resident smith (part-time)
  });
});
