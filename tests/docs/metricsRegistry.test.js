/**
 * metricsRegistry.test.js — the metrics-layer completeness pin (Wave E1).
 *
 * docs/METRICS_REGISTRY.md declares the standing questions the analytics sink
 * must answer. This pin converts it from prose into a gate-checked contract, the
 * enforcement-claims philosophy applied to metrics:
 *
 *   1. Every event named on a metric's "Source events:" line MUST exist in EVENTS
 *      (a typo or a deleted event fails here, not silently in a dashboard).
 *   2. Every event listed under "## Exempt events" MUST exist in EVENTS (no phantom
 *      exemptions).
 *   3. COVERAGE: every EVENTS member is EITHER a source event of some metric OR on
 *      the exempt list. Adding an event forces the author to wire a metric or mark
 *      it exempt — an event can't exist with no stated analytical purpose.
 *   4. Each metric carries the full required shape (Question / Source events /
 *      Denominator / Cell grid / Suppression floor).
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { EVENTS } from '../../src/lib/analyticsEvents.js';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const REGISTRY = path.join(REPO, 'docs', 'METRICS_REGISTRY.md');

const backtickTokens = (line) => Array.from(line.matchAll(/`([a-z][a-z0-9_]{2,63})`/g)).map(m => m[1]);

function loadRegistry() {
  const text = fs.readFileSync(REGISTRY, 'utf8');
  const lines = text.split('\n');

  const sourceEvents = new Set();
  let inExempt = false;
  const exemptEvents = new Set();
  const labelCounts = { Question: 0, 'Source events': 0, Denominator: 0, 'Cell grid': 0, 'Suppression floor': 0 };

  for (const line of lines) {
    if (/^##\s+Exempt events\s*$/.test(line)) { inExempt = true; continue; }
    if (inExempt && /^##\s+/.test(line)) inExempt = false; // a later section would end it (none today)

    // Per-metric required-label bookkeeping (bolded `- **Label:**`).
    for (const label of Object.keys(labelCounts)) {
      if (new RegExp(`\\*\\*${label}:\\*\\*`).test(line)) labelCounts[label] += 1;
    }

    if (/\*\*Source events:\*\*/.test(line)) {
      for (const t of backtickTokens(line)) sourceEvents.add(t);
    } else if (inExempt && line.trim().startsWith('-')) {
      for (const t of backtickTokens(line)) exemptEvents.add(t);
    }
  }
  return { text, sourceEvents, exemptEvents, labelCounts };
}

describe('metrics registry', () => {
  const eventVals = new Set(Object.values(EVENTS));
  const { sourceEvents, exemptEvents, labelCounts } = loadRegistry();

  it('registry file exists and declares at least the seed metrics', () => {
    expect(labelCounts['Source events']).toBeGreaterThanOrEqual(7);
  });

  it('every source event exists in EVENTS', () => {
    const unknown = [...sourceEvents].filter(e => !eventVals.has(e));
    expect(unknown).toEqual([]);
  });

  it('every exempt event exists in EVENTS', () => {
    const unknown = [...exemptEvents].filter(e => !eventVals.has(e));
    expect(unknown).toEqual([]);
  });

  it('coverage: every EVENTS member is a metric source or explicitly exempt', () => {
    const accounted = new Set([...sourceEvents, ...exemptEvents]);
    const missing = [...eventVals].filter(e => !accounted.has(e));
    expect(missing).toEqual([]);
  });

  it('an event is not both a source and exempt (clean bookkeeping)', () => {
    const overlap = [...sourceEvents].filter(e => exemptEvents.has(e));
    expect(overlap).toEqual([]);
  });

  it('every metric carries the full required shape', () => {
    const n = labelCounts['Source events'];
    expect(labelCounts.Question).toBe(n);
    expect(labelCounts.Denominator).toBe(n);
    expect(labelCounts['Cell grid']).toBe(n);
    expect(labelCounts['Suppression floor']).toBe(n);
  });
});
