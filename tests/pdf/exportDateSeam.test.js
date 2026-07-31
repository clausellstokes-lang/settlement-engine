/**
 * tests/pdf/exportDateSeam.test.js — the export-date seam, one shape across all
 * three cover artifacts.
 *
 * The generation date is the one non-reproducible byte on a cover. The World Book
 * has always made it injectable (generateWorldBook opts.now); the settlement Cover
 * and the campaign PDF read the wall clock with no seam, so neither cover could be
 * rendered reproducibly by a fixture. These pins hold the seam open on all three
 * and prove the DEFAULT still reads the wall clock (no behavior change for callers
 * that pass nothing).
 *
 * The jsPDF lane is asserted by inflating the painted content streams and reading
 * the drawn TEXT — a content assertion, never a byte-identity comparison (this
 * file's sibling doctrine in generateWorldBook.js's header).
 */
import { describe, test, expect } from 'vitest';
import { readFileSync, rmSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { Cover } from '../../src/pdf/sections/Cover.jsx';
import { generateCampaignPDF } from '../../src/utils/generateCampaignPDF.js';

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

/** The visible text a jsPDF document painted, from its inflated content streams. */
function paintedText(pdfPath) {
  const raw = readFileSync(pdfPath).toString('latin1');
  let out = '';
  let idx = 0;
  while ((idx = raw.indexOf('stream', idx)) !== -1) {
    let start = idx + 'stream'.length;
    while (raw[start] === '\r' || raw[start] === '\n') start += 1;
    const end = raw.indexOf('endstream', start);
    if (end === -1) break;
    const chunk = Buffer.from(raw.slice(start, end), 'latin1');
    try { out += inflateSync(chunk).toString('latin1'); } catch { out += chunk.toString('latin1'); }
    idx = end + 'endstream'.length;
  }
  return out;
}

const settlement = { name: 'Ashford', tier: 'town', population: 1800 };
const vm = { summary: { identity: { name: 'Ashford', tier: 'town', population: 1800 } }, overview: {} };

describe('settlement Cover — the export date is injectable', () => {
  test('an injected label is the date the cover prints', () => {
    const text = collectText(Cover({ settlement, vm, now: 'Cyfrin 1, 2026' })).join(' ');
    expect(text).toContain('Cyfrin 1, 2026');
  });

  test('omitting it keeps the wall-clock read (the default is unchanged)', () => {
    const text = collectText(Cover({ settlement, vm })).join(' ');
    const wallClock = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    expect(text).toContain(wallClock);
  });
});

describe('campaign PDF — the export date is injectable (the World Book seam)', () => {
  const campaign = { id: 'c1', name: 'Seam Probe', settlementIds: ['a'] };
  const saves = [{ id: 'a', name: 'Ashford', settlement }];

  test('an injected label reaches the painted cover byline', () => {
    const file = 'campaign-seam-probe.pdf';
    try {
      generateCampaignPDF(campaign, saves, { now: 'Cyfrin 1, 2026' });
      const text = paintedText(file);
      expect(text).toContain('Generated Cyfrin 1, 2026');
      // The wall clock is NOT consulted when a label is injected.
      expect(text).not.toContain(new Date().toLocaleDateString('en-US'));
    } finally {
      rmSync(file, { force: true });
    }
  });

  test('omitting it keeps the wall-clock byline (the default is unchanged)', () => {
    const file = 'campaign-seam-probe.pdf';
    try {
      generateCampaignPDF(campaign, saves);
      expect(paintedText(file)).toContain(`Generated ${new Date().toLocaleDateString('en-US')}`);
    } finally {
      rmSync(file, { force: true });
    }
  });
});
