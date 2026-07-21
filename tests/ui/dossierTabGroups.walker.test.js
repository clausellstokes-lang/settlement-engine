/**
 * tests/ui/dossierTabGroups.walker.test.js — SB5: no rich state without a
 * surface, made structural for the dossier tab facade.
 *
 * The Relationships regression (P102/D-1): a tab declared in TAB_GROUPS.world
 * with a working renderTab case was never registered in the resolver's
 * allTabs, so the facade silently dropped it — a rich relational state with NO
 * surface, found by hand, not by a gate. This walker closes that class with
 * the set-equality idiom over the SOURCE (render-free, so no store/jsdom):
 *
 *   declared  = every tab id listed in a TAB_GROUPS group's `tabs` array;
 *   registered = every `{ id: '…', label: … }` tab object in the file
 *                (the static TABS list + the conditional allTabs additions).
 *
 * The two sets must be EQUAL: a declared-but-unregistered tab is the
 * Relationships bug again (the resolver drops it); a registered-but-ungrouped
 * tab can never surface through the group facade at all. Both directions red.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const src = readFileSync(join(ROOT, 'src/components/OutputContainer.jsx'), 'utf8');

// The declared universe: TAB_GROUPS' tabs arrays (the exported freeze block).
const groupsBlock = src.match(/export const TAB_GROUPS = Object\.freeze\(\{[\s\S]*?\}\);/);
const declared = groupsBlock
  ? [...groupsBlock[0].matchAll(/tabs:\s*\[([^\]]*)\]/g)]
      .flatMap((m) => [...m[1].matchAll(/'([a-z_]+)'/g)].map((x) => x[1]))
  : [];

// The registered universe: tab objects `{ id: '…', label: … }` anywhere in the
// file — the shape both the static TABS list and every conditional allTabs
// addition use (verified 24 ⇄ 24 at pin time; anti-vacuity below guards the
// regex against silently matching nothing after a refactor).
const registered = [...src.matchAll(/\{\s*id:\s*'([a-z_]+)',\s*label:/g)].map((m) => m[1]);

describe('dossier tab facade walker (SB5 — declared ⇄ registered)', () => {
  test('anti-vacuity: both scans found a substantial tab population', () => {
    expect(groupsBlock, 'TAB_GROUPS export block not found — update the walker regex with the refactor').not.toBeNull();
    expect(declared.length).toBeGreaterThan(15);
    expect(registered.length).toBeGreaterThan(15);
  });

  test('every declared tab is registered and every registered tab belongs to a group', () => {
    const declaredSet = [...new Set(declared)].sort();
    const registeredSet = [...new Set(registered)].sort();
    // A mismatch reads directly: an id only in `declared` is the Relationships
    // bug (add its allTabs registration); an id only in `registered` is an
    // unreachable tab (add it to a TAB_GROUPS group, or remove it).
    expect(registeredSet).toEqual(declaredSet);
  });
});
