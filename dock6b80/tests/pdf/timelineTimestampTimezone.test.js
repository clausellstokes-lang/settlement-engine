/**
 * tests/pdf/timelineTimestampTimezone.test.js — the Timeline chapter's applied-at
 * stamp must not read the exporting machine's timezone.
 *
 * The stamp is the FALLBACK label: an entry whose event carries no `inWorldDate`
 * prints `appliedAt` through toLocaleString. The locale was pinned ('en-US') but
 * the zone was not, so the same event log rendered a different stamp — and across
 * a midnight boundary a different calendar DAY — depending on where the export ran.
 *
 * The pin drives the REAL chapter render under a non-UTC process zone (Node
 * re-reads process.env.TZ on assignment), so it fails the moment `timeZone` is
 * dropped from the options object.
 */
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { Timeline } from '../../src/pdf/sections/Timeline.jsx';

// Collect every string leaf from a react-pdf element tree, expanding function
// components (the walker idiom from timelineLigatureDefuse.test.js).
function collectText(node, out = []) {
  if (node == null || node === false || node === true) return out;
  if (typeof node === 'string') { out.push(node); return out; }
  if (typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const c of node) collectText(c, out); return out; }
  if (typeof node?.type === 'function') { collectText(node.type({ ...node.props }), out); return out; }
  const children = node?.props?.children;
  if (children != null) collectText(children, out);
  return out;
}

// 23:30 UTC on 5 March 2026 — deliberately across midnight in Asia/Tokyo (which
// reads it as 08:30 on the 6th), so a host-zone render differs in the DAY too.
const APPLIED_AT = '2026-03-05T23:30:00.000Z';

// No inWorldDate ⇒ the chapter falls back to the wall-clock stamp under test.
const vm = {
  eventLog: [{
    appliedAt: APPLIED_AT,
    narrativeSummary: 'The council levied a toll.',
    event: { type: 'edict' },
  }],
};

const render = () => collectText(Timeline({ settlement: {}, narrativeMode: false, vm })).join('');

describe('Timeline — the applied-at stamp is zone-pinned, not host-local', () => {
  const originalTz = process.env.TZ;
  afterAll(() => { process.env.TZ = originalTz; });

  test('renders the UTC stamp while the process sits in Asia/Tokyo', () => {
    process.env.TZ = 'Asia/Tokyo';
    const text = render();
    expect(text).toContain('Mar 5, 2026');
    expect(text).toContain('11:30 PM');
    // The Tokyo-local reading of the same instant must NOT appear.
    expect(text).not.toContain('Mar 6, 2026');
    expect(text).not.toContain('8:30 AM');
  });

  test('renders the SAME stamp from a second, opposite-sign zone', () => {
    process.env.TZ = 'America/Los_Angeles';
    const text = render();
    expect(text).toContain('Mar 5, 2026');
    expect(text).toContain('11:30 PM');
    expect(text).not.toContain('3:30 PM');
  });

  test('two zones produce byte-identical chapter text', () => {
    process.env.TZ = 'Asia/Tokyo';
    const tokyo = render();
    process.env.TZ = 'America/Los_Angeles';
    const la = render();
    expect(tokyo).toBe(la);
  });
});

describe('Timeline — an in-world date still wins over the wall-clock stamp', () => {
  const originalTz = process.env.TZ;
  beforeAll(() => { process.env.TZ = 'Asia/Tokyo'; });
  afterAll(() => { process.env.TZ = originalTz; });

  test('the chapter prints the in-world date and no machine timestamp', () => {
    const dated = { eventLog: [{ appliedAt: APPLIED_AT, narrativeSummary: 'A levy.', event: { type: 'edict', inWorldDate: 'first of Flamerule' } }] };
    const text = collectText(Timeline({ settlement: {}, narrativeMode: false, vm: dated })).join('').replaceAll('‌', '');
    expect(text).toContain('first of Flamerule');
    expect(text).not.toContain('Mar 5, 2026');
  });
});
