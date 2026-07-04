/**
 * @vitest-environment jsdom
 *
 * tests/pdf/proseLigatureDefuse.test.js — ligature defusing at the prose +
 * entity-ref render boundaries.
 *
 * The bundled Lora subset mis-renders the `fi`/`fl`/`ff`/`ffi`/`ffl` OpenType
 * ligatures (the ligated glyph drops the dotted-i, so "fi" prints as "f"). Every
 * string handed to a react-pdf <Text>/<Link> must pass through `safe()`/`noLig()`,
 * which slips a zero-width non-joiner (U+200C) between the offending pairs.
 *
 * Two boundaries previously bypassed it:
 *   - ProseText plain (non-ref) segments rendered the raw token value.
 *   - EntityRef rendered the resolved label / fallback raw.
 *
 * These tests assert a ZWNJ now appears in the rendered text of both.
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

describe('ProseText — plain segments defuse ligatures', () => {
  test('a non-token prose stretch with "fi" gets a ZWNJ', () => {
    // No entity tokens ⇒ a single plain segment, the path that bypassed noLig.
    const tree = ProseText({ text: 'The first fleet sailed at dawn.' });
    const text = collectText(tree).join('');
    expect(text).toContain(ZWNJ);
    // The visible characters survive (ZWNJ is invisible) once stripped.
    expect(text.replaceAll(ZWNJ, '')).toBe('The first fleet sailed at dawn.');
  });
});

describe('EntityRef — labels defuse ligatures', () => {
  const index = {
    resolve: (id) => (id === 'faction.goldfinch'
      ? { anchor: 'faction-goldfinch', currentName: 'The Goldfinch Guild' }
      : null),
  };

  test('a resolved link label with "fi" gets a ZWNJ', () => {
    const node = EntityRef({ id: 'faction.goldfinch', index });
    const text = collectText(node).join('');
    expect(text).toContain(ZWNJ);
    expect(text.replaceAll(ZWNJ, '')).toBe('The Goldfinch Guild');
  });

  test('an unresolved fallback with "fl" gets a ZWNJ', () => {
    const node = EntityRef({ id: 'faction.gone', index, fallback: 'the conflict' });
    const text = collectText(node).join('');
    expect(text).toContain(ZWNJ);
    expect(text.replaceAll(ZWNJ, '')).toBe('the conflict');
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

describe('NotableNPCs — body prose defuses ligatures (FullCard)', () => {
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

  test('a rendered NPC blurb containing "fortified" carries the defusing ZWNJ', () => {
    const npc = {
      id: 'npc.x', name: 'Griffin Bellwether', title: 'the Fletcher',
      power: 9,
      blurb: 'She holds the fortified gatehouse and fields a stiff militia.',
    };
    const tree = NotableNPCs({ settlement: {}, vm: vmWithNpc(npc) });
    const text = deepText(tree).join("");
    // The blurb's fi/ff/fl clusters (fortified, fields, stiff, fletcher) are defused.
    expect(text).toContain(ZWNJ);
    // Specifically: the "fi" in "fortified" is broken by a ZWNJ.
    expect(text).toContain(`fortif${ZWNJ}ied`);
    // And the visible copy survives once the invisible joiner is stripped.
    expect(text.replaceAll(ZWNJ, '')).toContain('fortified gatehouse');
    // The name ("Griffin" = ffi ligature) is defused too, not left as tofu.
    expect(text).toContain(`Grif${ZWNJ}f${ZWNJ}in`);
    expect(text.replaceAll(ZWNJ, '')).toContain('Griffin Bellwether');
  });

  test('personality / appearance / secret / relationship prose all defuse', () => {
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
    const stripped = text.replaceAll(ZWNJ, '');
    // Every body field's visible content survives…
    expect(stripped).toContain('Fiercely efficient');
    expect(stripped).toContain('fitted officer coat');
    expect(stripped).toContain('falsified the fief ledgers');
    expect(stripped).toContain('fickle, shifting truce');
    // …and each carried at least one defusing joiner (they all have f-clusters).
    expect(text).toContain(`falsif${ZWNJ}ied`); // fi in "falsified"
    expect(text).toContain(`f${ZWNJ}ickle`);    // fi in "fickle"
  });
});
