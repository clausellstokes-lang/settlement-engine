/**
 * @vitest-environment jsdom
 *
 * tests/pdf/timelineLigatureDefuse.test.js — ligature defusing at the Timeline
 * chapter's engine-prose render boundaries.
 *
 * The bundled Lora subset mis-renders the `fi`/`fl`/`ff`/`ffi`/`ffl` OpenType
 * ligatures (the ligated glyph drops the dotted-i, so "fi" prints as "f").
 * Every engine string the Timeline hands to a react-pdf <Text> — the event
 * summary, the description, the delta explanations, and the faction
 * responses/hooks (all of which carry entity names like factions and
 * settlements) — must pass through `safe()`, which slips a zero-width
 * non-joiner (U+200C) between the offending pairs.
 *
 * Before the fix, Timeline rendered these raw; an event touching "the Goldfinch
 * Guild" or "the conflict" printed a mangled name. These tests assert a ZWNJ
 * now appears in the rendered text of each boundary.
 */
import { describe, test, expect } from 'vitest';
import { Timeline } from '../../src/pdf/sections/Timeline.jsx';

const ZWNJ = '‌';

// Collect every string leaf from a react-pdf element tree. When a node is a
// function-component element (e.g. <Entry/>), call the function with its props
// so its subtree is expanded — react-pdf primitives (View/Text) carry a string
// `type`, so the walker stops descending into them as host elements.
function collectText(node, out = []) {
  if (node == null || node === false || node === true) return out;
  if (typeof node === 'string') { out.push(node); return out; }
  if (typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const c of node) collectText(c, out); return out; }
  if (typeof node?.type === 'function') {
    collectText(node.type({ ...node.props }), out);
    return out;
  }
  const children = node?.props?.children;
  if (children != null) collectText(children, out);
  return out;
}

const vm = {
  eventLog: [{
    appliedAt: 1700000000000,
    narrativeSummary: 'The Goldfinch Guild fixed the toll.',
    event: {
      type: 'edict',
      inWorldDate: 'first of Flamerule',
      description: 'A flight of fines fell on the river craft.',
    },
    deltas: [
      { explanation: 'Trade affluence fell sharply', before: 'flush', after: 'thin' },
    ],
    factionResponses: [
      { factionName: 'The Goldfinch Guild', response: 'They affirm the fine.', hookSeed: 'a fleet of informants' },
    ],
  }],
};

describe('Timeline — engine prose defuses ligatures at every Text boundary', () => {
  const text = collectText(Timeline({ settlement: {}, narrativeMode: false, vm })).join('');

  test('the event summary "fixed" gets a ZWNJ', () => {
    expect(text).toContain(`f${ZWNJ}i`); // "fixed"
  });

  test('the description "flight"/"fines" gets a ZWNJ', () => {
    expect(text).toContain(`f${ZWNJ}l`); // "flight"
  });

  test('the in-world date "Flamerule"/"first" gets a ZWNJ', () => {
    // "first" -> f<ZWNJ>i, proving the date label also routes through safe().
    expect(text).toContain(`f${ZWNJ}i`);
  });

  test('a delta explanation "affluence"/"flush" gets a ZWNJ', () => {
    expect(text).toContain(`f${ZWNJ}f`); // "affluence" / "flush"
  });

  test('a faction name "Goldfinch" gets a ZWNJ', () => {
    expect(text).toContain(`f${ZWNJ}i`); // "Goldfinch"
  });

  test('a faction response "affirm" and hook "fleet" get a ZWNJ', () => {
    expect(text).toContain(`f${ZWNJ}f`); // "affirm"
    expect(text).toContain(`f${ZWNJ}l`); // "fleet"
  });

  test('stripping ZWNJ restores the original visible prose', () => {
    const visible = text.replaceAll(ZWNJ, '');
    expect(visible).toContain('The Goldfinch Guild fixed the toll.');
    expect(visible).toContain('A flight of fines fell on the river craft.');
    expect(visible).toContain('The Goldfinch Guild');
    expect(visible).toContain('a fleet of informants');
  });
});
