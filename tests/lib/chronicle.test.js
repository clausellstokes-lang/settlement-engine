/**
 * tests/lib/chronicle.test.js - Tier 3.8 coverage.
 */

import { describe, test, expect } from 'vitest';
import {
  CHRONICLE_LIMITS,
  createChronicleEntry,
  rotateToSummary,
  appendChronicleEntry,
} from '../../src/lib/chronicle.js';

describe('CHRONICLE_LIMITS', () => {
  test('exposes the canonical tier caps', () => {
    expect(CHRONICLE_LIMITS.free).toBe(5);
    expect(CHRONICLE_LIMITS.premium).toBe(Infinity);
    expect(CHRONICLE_LIMITS.elevated).toBe(Infinity);
  });
});

describe('createChronicleEntry()', () => {
  test('builds a full-mode entry with id + createdAt + payloads', () => {
    const entry = createChronicleEntry({
      reason: 'initial',
      aiSettlement: { thesis: 'X' },
      aiDailyLife: { x: 1 },
    });
    expect(entry.mode).toBe('full');
    expect(entry.reason).toBe('initial');
    expect(entry.thesis).toBe('X');
    expect(entry.summaryText).toBe('X');
    expect(entry.aiSettlement).toEqual({ thesis: 'X' });
    expect(entry.aiDailyLife).toEqual({ x: 1 });
    expect(typeof entry.id).toBe('string');
    expect(entry.id.length).toBeGreaterThan(0);
    expect(entry.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test('summary mode nulls heavy payloads', () => {
    const entry = createChronicleEntry({
      reason: 'revert',
      aiSettlement: { thesis: 'Y' },
      aiDailyLife: { x: 1 },
      mode: 'summary',
    });
    expect(entry.mode).toBe('summary');
    expect(entry.aiSettlement).toBeNull();
    expect(entry.aiDailyLife).toBeNull();
    expect(entry.thesis).toBe('Y');
  });

  test('handles nullish thesis', () => {
    const entry = createChronicleEntry({
      reason: 'initial', aiSettlement: null, aiDailyLife: null,
    });
    expect(entry.thesis).toBe('');
  });
});

describe('rotateToSummary()', () => {
  test('rotates a full entry to summary', () => {
    const full = createChronicleEntry({
      reason: 'initial', aiSettlement: { thesis: 'X' }, aiDailyLife: { x: 1 },
    });
    const summary = rotateToSummary(full);
    expect(summary.mode).toBe('summary');
    expect(summary.aiSettlement).toBeNull();
    expect(summary.aiDailyLife).toBeNull();
    expect(summary.thesis).toBe('X');
  });

  test('returns the entry unchanged if already summary', () => {
    const summary = createChronicleEntry({
      reason: 'initial', aiSettlement: { thesis: 'X' }, aiDailyLife: { x: 1 }, mode: 'summary',
    });
    expect(rotateToSummary(summary)).toBe(summary);
  });

  test('handles nullish entry', () => {
    expect(rotateToSummary(null)).toBeNull();
  });
});

describe('appendChronicleEntry()', () => {
  function makeFull(reason) {
    return createChronicleEntry({
      reason, aiSettlement: { thesis: reason }, aiDailyLife: { x: 1 },
    });
  }

  test('newest entry is at index 0', () => {
    const a = makeFull('initial');
    const b = makeFull('regenerate');
    const out = appendChronicleEntry([a], b);
    expect(out[0]).toBe(b);
    expect(out[1]).toBe(a);
  });

  test('does not mutate the input list', () => {
    const a = makeFull('initial');
    const list = [a];
    const before = JSON.stringify(list);
    appendChronicleEntry(list, makeFull('regenerate'));
    expect(JSON.stringify(list)).toBe(before);
  });

  test('rotates older full entries to summary once over the limit', () => {
    const entries = [
      makeFull('e1'), makeFull('e2'), makeFull('e3'), makeFull('e4'), makeFull('e5'),
    ];
    const out = appendChronicleEntry(entries, makeFull('e6'), { limit: 3 });
    // Newest 3 stay full; older entries become summary.
    expect(out.slice(0, 3).every(e => e.mode === 'full')).toBe(true);
    expect(out.slice(3).every(e => e.mode === 'summary')).toBe(true);
  });

  test('no limit = no rotation', () => {
    const entries = [makeFull('e1'), makeFull('e2')];
    const out = appendChronicleEntry(entries, makeFull('e3'));
    expect(out.every(e => e.mode === 'full')).toBe(true);
  });

  test('handles nullish chronicle', () => {
    const e = makeFull('initial');
    expect(appendChronicleEntry(null, e)).toEqual([e]);
  });

  test('summary entries do not count against the limit', () => {
    const summary1 = createChronicleEntry({
      reason: 'r1', aiSettlement: { thesis: 's1' }, aiDailyLife: null, mode: 'summary',
    });
    const out = appendChronicleEntry([summary1, makeFull('e1')], makeFull('e2'), { limit: 1 });
    // The full entry beyond the limit gets rotated; summary remains.
    const fullCount = out.filter(e => e.mode === 'full').length;
    expect(fullCount).toBe(1);
  });
});
