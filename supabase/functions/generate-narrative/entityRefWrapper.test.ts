/**
 * entityRefWrapper.test.ts — the deno-side boundary test for the pronoun-link
 * contract extension (deno task test:edge / CI deno-tests job).
 *
 * Names are the server's job (wrapProse). Pronouns are the clerk's: under the
 * deploy-gated prompt contract it emits ⟦pronoun:<entityName>|<word>⟧, and this
 * module VALIDATES each anchor against the real entity set and rewrites it to the
 * stable id — or unwraps it to plain text (fail-open). No live model call is
 * involved: these fixtures stand in for the clerk's output, exactly like the
 * other edge tests fixture the model boundary.
 */
import { assertEquals, assertStringIncludes } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import {
  wrapEntityRefsInProse,
  collectPronounResolver,
  normalizePronounTokens,
  stripTokens,
} from './entityRefWrapper.ts';

function settlement() {
  return {
    name: 'Hollowmere',
    id: 'settlement.hollowmere',
    thesis:
      'Jon Aldermere holds the docks; ⟦pronoun:Jon Aldermere|he⟧ answers to the Iron Guild, and ⟦pronoun:Iron Guild|they⟧ own the coin.',
    npcs: [{ id: 'npc.jon_aldermere', name: 'Jon Aldermere' }],
    powerStructure: { factions: [{ faction: 'Iron Guild' }] },
  };
}

Deno.test('collectPronounResolver mirrors the client index id set (incl. the settlement)', () => {
  const { nameToId, linkableIds } = collectPronounResolver(settlement());
  assertEquals(nameToId.get('jon aldermere'), 'npc.jon_aldermere');
  assertEquals(nameToId.get('iron guild'), 'faction.iron_guild');
  assertEquals(nameToId.get('hollowmere'), 'settlement.hollowmere');
  assertEquals(linkableIds.has('faction.iron_guild'), true);
});

Deno.test('normalizePronounTokens rewrites a NAME anchor to the stable id', () => {
  const r = collectPronounResolver(settlement());
  const out = String(normalizePronounTokens('… ⟦pronoun:Jon Aldermere|he⟧ …', r));
  assertStringIncludes(out, '⟦pronoun:npc.jon_aldermere|he⟧');
});

Deno.test('normalizePronounTokens unwraps an UNKNOWN anchor to the bare word (fail-open)', () => {
  const r = collectPronounResolver(settlement());
  assertEquals(normalizePronounTokens('and ⟦pronoun:Nobody|he⟧ left', r), 'and he left');
});

Deno.test('normalizePronounTokens is idempotent (already-resolved id anchor is kept)', () => {
  const r = collectPronounResolver(settlement());
  const once = String(normalizePronounTokens('x ⟦pronoun:Iron Guild|they⟧ y', r));
  assertEquals(normalizePronounTokens(once, r), once);
  assertStringIncludes(once, '⟦pronoun:faction.iron_guild|they⟧');
});

Deno.test('wrapEntityRefsInProse: pronoun anchors → ids, names wrapped, both in one thesis', () => {
  const s = settlement();
  wrapEntityRefsInProse(s);
  // pronoun links resolved to ids…
  assertStringIncludes(s.thesis, '⟦pronoun:npc.jon_aldermere|he⟧');
  assertStringIncludes(s.thesis, '⟦pronoun:faction.iron_guild|they⟧');
  // …and the NAMES in the same thesis wrapped as NAME links.
  assertStringIncludes(s.thesis, '⟦entity:npc.jon_aldermere|Jon Aldermere⟧');
  assertStringIncludes(s.thesis, '⟦entity:faction.iron_guild|Iron Guild⟧');
});

Deno.test('secret.what is sanitized (kept raw) — the editable field never carries a token', () => {
  const s = settlement() as Record<string, any>;
  s.npcs[0].secret = { what: 'A plot ⟦pronoun:Jon Aldermere|his⟧ coin funds.' };
  wrapEntityRefsInProse(s);
  assertEquals(s.npcs[0].secret.what, 'A plot his coin funds.');
  assertEquals(s.npcs[0].secret.what.includes('⟦'), false);
});

Deno.test('stripTokens collapses every entity/pronoun token to its display text', () => {
  assertEquals(stripTokens('⟦entity:npc.jon|Jon⟧ and ⟦pronoun:npc.jon|he⟧ go.'), 'Jon and he go.');
});
