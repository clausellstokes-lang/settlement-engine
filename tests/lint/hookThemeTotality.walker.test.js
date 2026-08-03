/**
 * hookThemeTotality.walker.test.js — HABITAT REMOVAL for VOCABULARY ROT
 * (wave HK-1, docs/DESIGN_HOOK_NONREDUNDANCY.md §3).
 *
 * THE CLASS: src/generators/hookThemes.js names the dramatic BEAT of every
 * authored hook template so the retention layer can tell "two actors, one story"
 * from "two stories". A theme map is a PARALLEL structure — nothing in the
 * language ties it to the pools it describes — so it rots in three silent ways:
 *
 *   1. a NEW authored template lands untagged      ⇒ it answers `untyped`, is
 *      exempt from theme retention forever, and the repeat it was written to
 *      avoid comes back invisibly;
 *   2. a template's PROSE is edited (a typo fix is enough)  ⇒ its key no longer
 *      folds to the map's key, and the tag silently detaches from live content;
 *   3. a theme is invented at the tagging site ('mystery', 'trouble')  ⇒ the
 *      closed vocabulary the finite-semantics law requires quietly becomes an
 *      open one, and dedup starts comparing incomparable buckets.
 *
 * None of the three fails anything at runtime: an untagged hook is merely
 * retained, which is the SAFE direction, which is exactly why the rot is
 * invisible. So the vocabulary is held structurally instead — by EXACT SET
 * EQUALITY in both directions against the live pools. Add a template without a
 * tag and this reds; edit a template's prose without moving its tag and this
 * reds; delete a template and leave its tag and this reds.
 *
 * WHY BOTH DIRECTIONS: a one-directional "every tag resolves" check passes
 * happily while half the pool is untagged, and a one-directional "every template
 * is tagged" check passes while the map carries rows for prose that no longer
 * exists. Only equality catches both, and only equality makes the failure
 * message name the exact drifted strings.
 *
 * WHY THIS IS NOT A GENERATION TEST: it reads two authored data tables and one
 * pure lookup. No RNG, no pipeline, no seeds — so the seed-totality and
 * anchored-negative idioms that govern generation trees do not apply here, and
 * every assertion below is a set comparison whose subject is proven live by the
 * non-vacuity floors in the first test.
 */
import { describe, expect, test } from 'vitest';
import { NPC_FACTION_LOYALTY, STRESS_ECONOMIC_EFFECTS } from '../../src/data/npcData.js';
import {
  HOOK_THEMES,
  UNTYPED,
  THEME_OF_REL_ARCHETYPE,
  hookThemeKey,
  isHookTheme,
  taggedTemplates,
  themeOfText,
  themeOfRelArchetype,
} from '../../src/generators/hookThemes.js';

/** Every authored loyalty template the generator can draw, in pool order. */
const livePoolTemplates = Object.values(NPC_FACTION_LOYALTY).flat();
/** Every relationship archetype the generator can stamp. */
const liveArchetypeKeys = Object.keys(STRESS_ECONOMIC_EFFECTS);

const sortedUnique = (/** @type {string[]} */ xs) => [...new Set(xs)].sort();

describe('HK-1 hook-theme vocabulary — totality against the live pools', () => {
  test('guard-the-guard: the pools and the map are all live and populated', () => {
    // Every equality below is vacuously true against empty sets. If an import
    // silently resolved to nothing (a rename, a barrel reshuffle, a data file
    // emptied), these floors red FIRST and name the cause, instead of the set
    // comparisons passing on two empty arrays. Floors are the measured sizes at
    // HK-1; they tighten toward reality and are never lowered to admit a budget.
    expect(livePoolTemplates.length, 'NPC_FACTION_LOYALTY resolved empty or tiny').toBeGreaterThanOrEqual(80);
    expect(liveArchetypeKeys.length, 'STRESS_ECONOMIC_EFFECTS resolved empty or tiny').toBeGreaterThanOrEqual(18);
    expect(taggedTemplates().length, 'hookThemes taggedTemplates() resolved empty').toBeGreaterThanOrEqual(80);
    expect(HOOK_THEMES.length, 'the closed vocabulary resolved empty').toBeGreaterThanOrEqual(20);
  });

  test('TOTALITY: the tagged template set EQUALS the live loyalty pool, both directions', () => {
    const live = sortedUnique(livePoolTemplates);
    const tagged = sortedUnique(taggedTemplates());
    const untagged = live.filter((t) => !tagged.includes(t));
    const orphaned = tagged.filter((t) => !live.includes(t));
    expect(
      untagged,
      `\nAuthored loyalty template(s) with NO theme tag. Every authored template must`
      + ` carry exactly one theme from the closed set, or it is invisible to hook`
      + ` retention forever. Add a row to AUTHORED_HOOK_THEMES in`
      + ` src/generators/hookThemes.js for each:\n${untagged.map((t) => `  + ${t}`).join('\n')}\n`,
    ).toEqual([]);
    expect(
      orphaned,
      `\nTheme row(s) whose template is no longer in src/data/npcData.js`
      + ` NPC_FACTION_LOYALTY. Either the prose was edited (move the tag with it —`
      + ` the key is the exact string) or the template was deleted (delete its`
      + ` row):\n${orphaned.map((t) => `  - ${t}`).join('\n')}\n`,
    ).toEqual([]);
  });

  test('TOTALITY: the relationship archetype tags EQUAL the live archetype keys, both directions', () => {
    const tagged = sortedUnique(Object.keys(THEME_OF_REL_ARCHETYPE));
    const live = sortedUnique(liveArchetypeKeys);
    expect(
      live.filter((k) => !tagged.includes(k)),
      'relationship archetype(s) in STRESS_ECONOMIC_EFFECTS with no theme in THEME_OF_REL_ARCHETYPE',
    ).toEqual([]);
    expect(
      tagged.filter((k) => !live.includes(k)),
      'THEME_OF_REL_ARCHETYPE row(s) naming an archetype that no longer exists',
    ).toEqual([]);
  });

  test('CLOSURE: every assigned theme is a member of the closed vocabulary', () => {
    const assigned = [
      ...taggedTemplates().map((t) => themeOfText(t)),
      ...Object.values(THEME_OF_REL_ARCHETYPE),
    ];
    const outsiders = sortedUnique(assigned.filter((theme) => !isHookTheme(theme)));
    expect(
      outsiders,
      `\nTheme value(s) outside HOOK_THEMES. Closure is the law (finite semantics):`
      + ` a new beat is a VOCABULARY AMENDMENT to HOOK_THEMES, reviewed, never an`
      + ` ad-hoc string at the tagging site:\n${outsiders.join('\n')}\n`,
    ).toEqual([]);
    // The sentinel is not a theme. If it ever became one, `untyped` hooks would
    // start being deduped against each other — the exact thing HK-LAW-3 forbids.
    expect(isHookTheme(UNTYPED), 'UNTYPED must never be a member of the closed vocabulary').toBe(false);
  });

  test('EXACTLY ONE theme per template: no key collides, no template is tagged twice', () => {
    const templates = taggedTemplates();
    const keys = templates.map((t) => hookThemeKey(t));
    const collisions = keys
      .map((k, i) => ({ k, t: templates[i] }))
      .filter(({ k }, i) => keys.indexOf(k) !== i);
    expect(
      collisions,
      `\nTwo theme rows fold to the SAME lookup key, so one silently shadows the`
      + ` other and "exactly one theme per template" is broken:\n`
      + `${collisions.map(({ k, t }) => `  key ${JSON.stringify(k)} ← ${t}`).join('\n')}\n`,
    ).toEqual([]);
    // Every live template resolves to a real theme — the walker's own round-trip
    // through the public classifier, not through the private map.
    const unresolved = livePoolTemplates.filter((t) => !isHookTheme(themeOfText(t)));
    expect(unresolved, 'live template(s) that themeOfText() does not classify').toEqual([]);
  });

  test('HK-LAW-3: free prose and near-miss prose are UNTYPED — the lookup is exact, never fuzzy', () => {
    // The liveness anchor for every negative below: a real template DOES classify
    // through this same call, so "untyped" here measures exactness rather than a
    // dead lookup table.
    const anchorTemplate = livePoolTemplates[0];
    expect(themeOfText(anchorTemplate), 'anchor: a real template must classify').toBe(
      themeOfText(anchorTemplate),
    );
    expect(isHookTheme(themeOfText(anchorTemplate)), 'anchor: a real template must classify to a theme').toBe(true);

    // A DM's own sentence.
    expect(themeOfText('The reeve owes my players a favour and knows it.')).toBe(UNTYPED);
    // A PREFIX of a real template: a prefix/substring matcher would classify this.
    expect(themeOfText(anchorTemplate.slice(0, Math.floor(anchorTemplate.length / 2)))).toBe(UNTYPED);
    // A real template with ONE word changed: a similarity matcher would classify this.
    expect(themeOfText(anchorTemplate.replace(/\b\w+\b/, 'Xyzzy'))).toBe(UNTYPED);
    // A real template with EXTRA prose appended — a DM extending an authored hook
    // keeps their edit out of machine taste.
    expect(themeOfText(`${anchorTemplate} My players already know this.`)).toBe(UNTYPED);
    // Empty / non-string input never invents a theme.
    expect(themeOfText('')).toBe(UNTYPED);
    expect(themeOfText(null)).toBe(UNTYPED);
    expect(themeOfText(undefined)).toBe(UNTYPED);
    expect(themeOfRelArchetype('no_such_archetype')).toBe(UNTYPED);
    expect(themeOfRelArchetype(null)).toBe(UNTYPED);
  });

  test('the fold is case/whitespace/edge-punctuation tolerant and nothing more', () => {
    const template = livePoolTemplates[0];
    const theme = themeOfText(template);
    expect(isHookTheme(theme)).toBe(true);
    // The same folding the exact-text dedup layer applies, so a hook the
    // aggregator considers one string is one theme here too.
    expect(themeOfText(template.toUpperCase())).toBe(theme);
    expect(themeOfText(`  ${template.replace(/ /g, '  ')}  `)).toBe(theme);
    expect(themeOfText(`"${template}"`)).toBe(theme);
    // …and NOT more: interior punctuation is content, not noise.
    expect(themeOfText(template.replace(/\./g, ','))).toBe(UNTYPED);
  });
});
