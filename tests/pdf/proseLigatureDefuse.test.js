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
