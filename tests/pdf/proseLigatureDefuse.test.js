/**
 * @vitest-environment jsdom
 *
 * tests/pdf/proseLigatureDefuse.test.js — the prose + entity-ref render
 * boundaries deliver their string VERBATIM.
 *
 * ⚠ INVERTED 2026-09-01. These boundaries were found bypassing the string
 * chokepoint entirely (ProseText plain segments rendered the raw token value;
 * EntityRef rendered the resolved label / fallback raw), and the fix routed them
 * through `safe()`/`noLig()` — which at the time inserted a zero-width
 * non-joiner (U+200C) into every f-cluster to defuse a `liga` GSUB lookup. So
 * this suite asserted a ZWNJ appeared, as proof the routing had happened.
 *
 * The v2 font re-cut removed those lookups (pinned in
 * tests/build/fontsAndMeta.test.js §3d), and U+200C turned out to be covered by
 * NO embedded face — so the marker this suite looked for was itself splitting
 * the text onto a non-embedded Helvetica. The insertion is gone.
 *
 * ⭐ The ROUTING is still what matters, so it is still pinned — via the stronger
 * assertion: each boundary's string arrives at the leaf byte-identical, with no
 * joiner. A boundary that stopped calling the chokepoint, or a chokepoint that
 * started mutating again, reds here either way.
 */
import { describe, test, expect } from 'vitest';
import { ProseText } from '../../src/pdf/primitives/ProseText.jsx';
import { EntityRef } from '../../src/pdf/primitives/EntityRef.jsx';
import { NotableNPCs } from '../../src/pdf/sections/NotableNPCs.jsx';

const ZWNJ = '‌';

// Collect every string leaf from a react-pdf element tree.
function collectText(node, out = []) {
  if (node == null || node === false) return out;
  if (typeof node === 'string') { out.push(node); return out; }
  if (Array.isArray(node)) { for (const c of node) collectText(c, out); return out; }
  const children = node?.props?.children;
  if (children != null) collectText(children, out);
  return out;
}

describe('ProseText — plain segments render verbatim', () => {
  test('a non-token prose stretch reaches the leaf byte-identical', () => {
    // No entity tokens ⇒ a single plain segment, the path that bypassed noLig.
    const tree = ProseText({ text: 'The first fleet sailed at dawn.' });
    const text = collectText(tree).join('');
    // Byte-identical: the chokepoint is transparent, and inserts no joiner.
    expect(text).toBe('The first fleet sailed at dawn.');
    // anchored: the toBe above pins the whole leaf text — a dead boundary reds there.
    expect(text).not.toContain(ZWNJ);
  });
});

describe('EntityRef — labels render verbatim', () => {
  const index = {
    resolve: (id) => (id === 'faction.goldfinch'
      ? { anchor: 'faction-goldfinch', currentName: 'The Goldfinch Guild' }
      : null),
  };

  test('a resolved link label reaches the leaf byte-identical', () => {
    const node = EntityRef({ id: 'faction.goldfinch', index });
    const text = collectText(node).join('');
    expect(text).toBe('The Goldfinch Guild');
    // anchored: the toBe above pins the whole leaf text — a dead boundary reds there.
    expect(text).not.toContain(ZWNJ);
  });

  test('an unresolved fallback reaches the leaf byte-identical', () => {
    const node = EntityRef({ id: 'faction.gone', index, fallback: 'the conflict' });
    const text = collectText(node).join('');
    expect(text).toBe('the conflict');
    // anchored: the toBe above pins the whole leaf text — a dead boundary reds there.
    expect(text).not.toContain(ZWNJ);
  });
});

// Deep collector: unlike collectText (which stops at un-rendered component
// elements), this EXECUTES function components (they're plain, hookless render
// functions here) so we reach the leaf <Text> strings inside FullCard/TextRow.
// Nodes that throw (e.g. a primitive needing context we didn't supply) are
// skipped rather than aborting the walk.
function deepText(node, out = []) {
  if (node == null || node === false || node === true) return out;
  if (typeof node === 'string') { out.push(node); return out; }
  if (typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const c of node) deepText(c, out); return out; }
  if (typeof node !== 'object') return out;
  if (typeof node.type === 'function') {
    try { deepText(node.type(node.props || {}), out); }
    catch { /* skip a node we can't execute standalone */ }
    return out;
  }
  const children = node?.props?.children;
  if (children != null) deepText(children, out);
  return out;
}

describe('NotableNPCs — body prose renders verbatim (FullCard)', () => {
  // Build the minimal vm the section reads: a single top-power NPC whose body
  // fields ALL carry f-ligature clusters. These render on the flagship per-NPC
  // FullCard and previously bypassed noLig (blurb via stripZwnj; personality /
  // appearance / secret / relationship via a bare String(value)).
  function vmWithNpc(npc) {
    const all = [npc];
    return {
      npcs: { sorted: all, all },
      entityIndex: null, // no index ⇒ TextRow takes its plain (non-ProseText) branch
    };
  }

  test('a rendered NPC blurb and name reach the leaf byte-identical', () => {
    const npc = {
      id: 'npc.x', name: 'Griffin Bellwether', title: 'the Fletcher',
      power: 9,
      blurb: 'She holds the fortified gatehouse and fields a stiff militia.',
    };
    const tree = NotableNPCs({ settlement: {}, vm: vmWithNpc(npc) });
    const text = deepText(tree).join("");
    // The blurb's f-clusters (fortified, fields, stiff, fletcher) survive intact.
    // anchored: the two toContain below prove the blurb and name rendered.
    expect(text).not.toContain(ZWNJ);
    expect(text).toContain('fortified gatehouse');
    // The name ("Griffin" = the old ffi case) reaches the leaf verbatim.
    expect(text).toContain('Griffin Bellwether');
  });

  test('personality / appearance / secret / relationship prose all render verbatim', () => {
    const npc = {
      id: 'npc.y', name: 'Flora', power: 8,
      personality: 'Fiercely efficient; a fixer who never reflects.',
      appearance: 'A fine, fluid gait and a fitted officer coat.',
      motivation: 'To fortify the guild.',
      secrets: ['She falsified the fief ledgers to shield a friend.'],
      relationships: [{ with: 'The Guild', type: 'affiliate', description: 'a fickle, shifting truce' }],
    };
    const tree = NotableNPCs({ settlement: {}, vm: vmWithNpc(npc) });
    const text = deepText(tree).join("");
    // Every body field's content reaches the leaf verbatim, joiner-free.
    // anchored: the four toContain below prove every body field rendered.
    expect(text).not.toContain(ZWNJ);
    expect(text).toContain('Fiercely efficient');
    expect(text).toContain('fitted officer coat');
    expect(text).toContain('falsified the fief ledgers');
    expect(text).toContain('fickle, shifting truce');
  });
});
