/**
 * roadmapLedger.test.js — the R-30 PUBLIC ROADMAP guard.
 *
 * The load-bearing pin is CLAIMS-PARITY: the roadmap page renders EXACTLY the committed
 * ledger and nothing else (no hand-typed roadmap item in the page source), and the
 * ledger promises no dates. Also pins the entry schema and the display ordering.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  ROADMAP_LEDGER,
  ROADMAP_STATUSES,
  ROADMAP_STATUS_LABELS,
  isValidRoadmapEntry,
  orderedRoadmap,
} from '../../src/data/roadmapLedger.js';

const PAGE_SRC = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../../src/components/howto/RoadmapPage.jsx'),
  'utf8',
);

describe('the ledger schema', () => {
  it('every entry is valid and carries a known status', () => {
    expect(ROADMAP_LEDGER.length).toBeGreaterThan(0);
    for (const entry of ROADMAP_LEDGER) {
      expect(isValidRoadmapEntry(entry)).toBe(true);
      expect(ROADMAP_STATUSES).toContain(entry.status);
      expect(ROADMAP_STATUS_LABELS[entry.status]).toBeTruthy();
    }
  });

  it('has no duplicate ids', () => {
    const ids = ROADMAP_LEDGER.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('promises no dates (house voice: honest status, never a delivery date)', () => {
    for (const entry of ROADMAP_LEDGER) {
      const text = `${entry.title} ${entry.summary}`;
      expect(text).not.toMatch(/\b20\d\d\b/); // no year
      expect(text).not.toMatch(/\b(Q[1-4]|January|February|March|April|May|June|July|August|September|October|November|December)\b/);
    }
  });
});

describe('display ordering', () => {
  it('orderedRoadmap returns every valid entry, available-first', () => {
    const ordered = orderedRoadmap();
    expect(ordered.length).toBe(ROADMAP_LEDGER.filter(isValidRoadmapEntry).length);
    const rank = (s) => ROADMAP_STATUSES.indexOf(s);
    for (let i = 1; i < ordered.length; i++) {
      expect(rank(ordered[i - 1].status)).toBeGreaterThanOrEqual(rank(ordered[i].status));
    }
  });

  it('drops an invalid entry rather than rendering it', () => {
    const withBad = [...ROADMAP_LEDGER, { id: 'bad', title: '', summary: '', status: 'nope' }];
    expect(orderedRoadmap(withBad).length).toBe(orderedRoadmap().length);
  });
});

describe('CLAIMS-PARITY: the page renders only the ledger', () => {
  it('reads the ledger through orderedRoadmap and maps over it', () => {
    expect(PAGE_SRC).toMatch(/orderedRoadmap\(\)/);
    expect(PAGE_SRC).toMatch(/entries\.map\(/);
  });

  it('hard-codes no ledger item title in the page source (titles come only from data)', () => {
    for (const entry of ROADMAP_LEDGER) {
      expect(PAGE_SRC).not.toContain(entry.title);
    }
  });
});
