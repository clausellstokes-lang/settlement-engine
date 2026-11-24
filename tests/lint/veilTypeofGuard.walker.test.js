/**
 * veilTypeofGuard.walker.test.js — 212 HOLDS NO NULL-BLIND TYPE GUARD (R4I-SQL-2's second cure; the chair's N106, 2026-11-23;
 * brief R4I-SQL-2 ADDENDUM 2, (d)).
 *
 * THE FAULT IT PINS: in SQL, `jsonb_typeof(e -> 'power') <> 'number'` is NULL where the key is ABSENT (jsonb_typeof(NULL) is
 * NULL, and NULL <> 'number' is NULL), so a guard `not exists (... where <that>)` PASSED an entry with no `power` and 212 ::
 * _gallery_veil_roster_choices wrote equal shares onto powers that never had one (both lists: master's top-level factions[] and
 * powerStructure.factions[]), where the twin (galleryRosterChoices.js: `typeof f.power === 'number'`) wrote none. The cure reads
 * `is distinct from 'number'`, which is TRUE on an absent key.
 *
 * THE RULE: no line of supabase/migrations/212_share_veil_later_cures.sql holds `jsonb_typeof(` of a KEY LOOKUP (`->`, `#>`)
 * compared by `<>` or `!=` outside a coalesce (a `coalesce(jsonb_typeof(...), ...)` has no NULL to be blind to). THE INVENTORY
 * is every such comparison that stands, each with the reason its NULL is unreachable; it only SHRINKS: a new one reds by its
 * text, and an entry no longer found reds until it is struck.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MIGRATION = 'supabase/migrations/212_share_veil_later_cures.sql';

/** `jsonb_typeof(` of an argument holding a key lookup, closed, then compared by `<>` or `!=` (one call, no nested parens). */
const NULL_BLIND = /jsonb_typeof\(([^()]*(?:->|#>)[^()]*)\)\s*(?:<>|!=)/g;

/** Every null-blind comparison of a SQL text (comment lines skipped), by its matched text, with its line's text. */
function nullBlindGuards(sql) {
  const out = [];
  for (const line of sql.split('\n')) {
    if (/^\s*--/.test(line)) continue;
    for (const m of line.matchAll(NULL_BLIND)) out.push({ match: m[0], line: line.trim() });
  }
  return out;
}

/** THE INVENTORY: match text -> the reason its NULL is unreachable. Only shrinks. */
const INVENTORY = Object.freeze({
  "jsonb_typeof(r0 -> 'pair') <>": 'power.relation.entry, R3-CURE-4 (a husk is a tell): `r0` is a relation of `pub` that HOLDS (`r0 @> e`) a served relation `e` already held to `jsonb_typeof(e -> \'pair\') = \'array\'` with at least one entry; jsonb containment of a non-empty array value requires an array under the same key, so `r0 -> \'pair\'` is an array there and never absent',
});

describe('212 holds no null-blind type guard (N106)', () => {
  const found = nullBlindGuards(readFileSync(join(ROOT, MIGRATION), 'utf8'));

  it('every jsonb_typeof(<key lookup>) compared by <> or != is in the inventory, with its reason', () => {
    const unknown = found.filter((g) => !Object.prototype.hasOwnProperty.call(INVENTORY, g.match)).map((g) => `${g.match}   (${g.line.slice(0, 160)})`);
    expect(unknown).toEqual([]);
  });

  it('the inventory only shrinks: every entry is still found exactly once (a cured one is struck)', () => {
    const counts = Object.fromEntries(Object.keys(INVENTORY).map((k) => [k, found.filter((g) => g.match === k).length]));
    expect(counts).toEqual(Object.fromEntries(Object.keys(INVENTORY).map((k) => [k, 1])));
  });

  it('THE CONTROLS: the scanner finds the cured fault, and passes the cure and a coalesce', () => {
    const planted = "  and not exists (select 1 from jsonb_array_elements(s -> 'factions') e where jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'power') <> 'number') then";
    expect(nullBlindGuards(planted).map((g) => g.match)).toEqual(["jsonb_typeof(e -> 'power') <>"]);
    expect(nullBlindGuards("x #> '{a,b}' and jsonb_typeof(s #> '{a,b}') != 'array'").length).toBe(1);
    expect(nullBlindGuards(planted.replace("<> 'number'", "is distinct from 'number'"))).toEqual([]);
    expect(nullBlindGuards("where coalesce(jsonb_typeof(e -> 'category'), 'none') <> 'string'")).toEqual([]);
    expect(nullBlindGuards("  -- jsonb_typeof(e -> 'power') <> 'number' in a comment")).toEqual([]);
    expect(nullBlindGuards("if jsonb_typeof(ent) <> 'string' then continue; end if;")).toEqual([]);
  });
});
