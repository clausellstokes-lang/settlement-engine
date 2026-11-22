/**
 * @vitest-environment jsdom
 *
 * tests/pdf/timelineLigatureDefuse.test.js — the Timeline chapter's
 * engine-prose render boundaries deliver their string VERBATIM.
 *
 * ⚠ INVERTED 2026-09-01. Timeline used to render these boundaries raw, and the
 * fix routed each through `safe()` — which at the time slipped a zero-width
 * non-joiner (U+200C) into every f-cluster to defuse a `liga` GSUB lookup in the
 * pre-v2 faces. This suite asserted the joiner appeared, as proof of routing.
 * The v2 re-cut removed the lookups (pinned in
 * tests/build/fontsAndMeta.test.js §3d) and U+200C is covered by NO embedded
 * face, so the marker was itself splitting text onto a non-embedded Helvetica.
 * The insertion is gone; the routing still matters and is still pinned.
 *
 * ⭐ THE INVERSION MADE THESE STRICTLY STRONGER. The old assertions searched for
 * `f<ZWNJ>i` in the JOINED text of the whole chapter, so a single boundary could
 * satisfy all six — they could not tell which boundary produced the hit. Each
 * test now names the actual source string it expects at the leaf, which is a
 * real per-boundary assertion the marker form could not express.
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

describe('Timeline — engine prose renders verbatim at every Text boundary', () => {
  const text = collectText(Timeline({ settlement: {}, narrativeMode: false, vm })).join('');

  // ⭐ The inversion made these assertions STRONGER, not merely opposite. The
  // old ones looked for `f<ZWNJ>i` anywhere in the JOINED text of the whole
  // chapter, so any one boundary could satisfy all six — a green that could not
  // distinguish which boundary it came from. Naming the actual source string per
  // boundary is what the old marker could not do.
  test('the event summary reaches the leaf verbatim', () => {
    expect(text).toContain('The Goldfinch Guild fixed the toll.');
  });

  test('the description reaches the leaf verbatim', () => {
    expect(text).toContain('A flight of fines fell on the river craft.');
  });

  test('the in-world date label routes through the chokepoint verbatim', () => {
    expect(text).toContain('first of Flamerule');
  });

  test('a delta explanation reaches the leaf verbatim', () => {
    expect(text).toContain('Trade affluence fell sharply');
  });

  test('a faction name reaches the leaf verbatim', () => {
    expect(text).toContain('The Goldfinch Guild');
  });

  test('a faction response and hook reach the leaf verbatim', () => {
    expect(text).toContain('They affirm the fine.');
    expect(text).toContain('a fleet of informants');
  });

  test('no boundary emits a zero-width non-joiner', () => {
    // U+200C is covered by NONE of the eight embedded faces; one anywhere in the
    // chapter splits that run onto a non-embedded Helvetica.
    // anchored: six sibling tests pin exact source strings against this SAME `text`.
    expect(text).not.toContain(ZWNJ);
  });
});
