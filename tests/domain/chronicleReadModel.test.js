/**
 * tests/domain/chronicleReadModel.test.js — THE CHRONICLE zoom pyramid pins.
 *
 * Pins (design §1, §3, §4, §7):
 *  · EMPTY OFF-STATE: a fresh world (no pulseHistory) ⇒ null chronicle / empty gate.
 *  · SPAN-SCALING: a 1-week advance opens at events-only; a 1-year advance at the
 *    full pyramid (headline+chapters+threads+events).
 *  · SEASON-FRAME PIN: chapterSeasons agrees with the engine's seasonForTick.
 *  · DELTA-FIRST: population/tier/relationship deltas aggregate from the outcomes'
 *    own carried deltas.
 *  · DETERMINISM: same world ⇒ byte-identical chronicle JSON.
 */

import { describe, it, expect } from 'vitest';

import {
  hasChronicle, latestChronicle, chronicleForAdvance, chapterSeasons, deltaFirst, QUIET_FALLBACK,
} from '../../src/domain/display/chronicleReadModel.js';
import { advanceEntries, nodesFromRecord } from '../../src/domain/display/chronicleGraph.js';
import { seasonForTick } from '../../src/domain/worldPulse/worldState.js';

describe('chronicleReadModel — empty off-state (§7)', () => {
  it('a fresh world has no chronicle', () => {
    expect(hasChronicle({})).toBe(false);
    expect(hasChronicle({ pulseHistory: [] })).toBe(false);
    expect(latestChronicle({})).toBeNull();
  });
});

describe('chronicleReadModel — span scaling (§1)', () => {
  const outcome = (id, sev = 0.4) => ({ id, headline: id, targetSaveId: 'A', severity: sev });
  it('a 1-week advance opens at events-only', () => {
    const ws = { pulseHistory: [{ tick: 1, selectedOutcomes: [outcome('o1')], impactDigest: [] }] };
    const c = latestChronicle(ws);
    expect(c.spanLabel).toBe('week');
    expect(c.altitudes).toEqual(['events']);
    expect(c.eventCount).toBe(1);
  });
  it('a 1-year advance opens at the full pyramid', () => {
    const ws = { pulseHistory: [{ tick: 52, selectedOutcomes: [outcome('o1', 0.9), outcome('o2', 0.3)], impactDigest: [] }] };
    const c = latestChronicle(ws);
    expect(c.spanLabel).toBe('year');
    expect(c.altitudes).toEqual(['headline', 'chapters', 'threads', 'events']);
    expect(c.threads.length).toBeGreaterThanOrEqual(1);
    expect(c.headline).toContain('The year');
  });
});

describe('chronicleReadModel — season frame pin (§1, matches the engine)', () => {
  it('chapterSeasons agrees with seasonForTick for the weeks a span crosses', () => {
    // A year advance from week 0 to 52 crosses spring→winter of year 1.
    const chapters = chapterSeasons(0, 52);
    const seasons = chapters.map(c => c.season);
    expect(seasons).toEqual(['spring', 'summer', 'autumn', 'winter']);
    // Each chapter's (season, year) equals the engine's derivation at a week inside it.
    for (const ch of chapters) {
      const probeWeek = { spring: 5, summer: 18, autumn: 31, winter: 44 }[ch.season];
      const eng = seasonForTick(probeWeek);
      expect(ch.season).toBe(eng.season);
      expect(ch.year).toBe(eng.year);
    }
  });
  it('a within-season span yields one chapter', () => {
    expect(chapterSeasons(1, 4)).toHaveLength(1); // weeks 2..4 all spring
  });
});

describe('chronicleReadModel — delta-first (§3)', () => {
  it('aggregates population, tier, and relationship deltas from the outcomes', () => {
    const record = {
      tick: 13,
      selectedOutcomes: [
        { id: 'o1', headline: 'boom', populationDeltas: { A: 120, B: -30 }, targetSaveId: 'A' },
        { id: 'o2', headline: 'rise', tierChange: { from: 2, to: 3 }, targetSaveId: 'A' },
        { id: 'o3', headline: 'war', proposalPayload: { kind: 'relationship_label_change', relationshipKey: 'A::C', toType: 'hostile' }, applyMode: 'proposal' },
      ],
      impactDigest: [],
    };
    const d = deltaFirst(nodesFromRecord(record));
    expect(d.population.rose).toContain('A');
    expect(d.population.fell).toContain('B');
    expect(d.population.net).toBe(90);
    expect(d.tiers).toEqual([{ id: 'A', from: 2, to: 3 }]);
    expect(d.relationships).toEqual([{ key: 'A::C', kind: 'war-declared' }]);
    expect(d.hasContent).toBe(true);
  });
});

describe('chronicleReadModel — quiet-advance framing variety (content-vt-2)', () => {
  // A no-thread advance (empty outcomes) hits the quiet fallback; span > 13 weeks
  // ⇒ 'year'. Vary the newest tick to vary the frame seed.
  const quietYear = (tick) => latestChronicle({ pulseHistory: [
    { tick: 4, selectedOutcomes: [], impactDigest: [] },
    { tick, selectedOutcomes: [], impactDigest: [] },
  ] }).headline;

  it('every quiet frame names its span and reads as a sentence; index 0 is the original', () => {
    for (const [span, pool] of Object.entries(QUIET_FALLBACK)) {
      expect(pool[0], `${span} canonical`).toBe(`The ${span} passed quietly.`);
      expect(pool.length, `${span} has variety`).toBeGreaterThanOrEqual(2);
      for (const line of pool) {
        expect(line.includes(span), `${span}: "${line}" names the span`).toBe(true);
        expect(/[.!?]$/.test(line), `${span}: "${line}" terminal punct`).toBe(true);
      }
    }
  });

  it('DETERMINISM: the same advance always frames the quiet line the same way', () => {
    expect(quietYear(60)).toBe(quietYear(60));
    // And it is one of the year pool's lines (facts unchanged, only framing).
    expect(QUIET_FALLBACK.year).toContain(quietYear(60));
  });

  it('ANTI-REPETITION: across advances the quiet frame reaches the whole pool', () => {
    const seen = new Set();
    for (let t = 20; t < 320; t++) seen.add(quietYear(t));
    expect(seen.size).toBe(QUIET_FALLBACK.year.length);
  });

  it('a POPULATED advance still reuses the persisted thread title (register-safe, unchanged)', () => {
    const ws = { pulseHistory: [{ tick: 52, selectedOutcomes: [{ id: 'o', headline: 'War at the ford', targetSaveId: 'A', severity: 0.9 }], impactDigest: [] }] };
    expect(latestChronicle(ws).headline).toBe('The year: War at the ford');
  });
});

describe('chronicleReadModel — determinism (§7)', () => {
  it('same world ⇒ byte-identical chronicle', () => {
    const ws = { pulseHistory: [
      { tick: 13, selectedOutcomes: [{ id: 'b', headline: 'B', targetSaveId: 'X', severity: 0.6 }, { id: 'a', headline: 'A', targetSaveId: 'X', severity: 0.7 }], impactDigest: [{ id: 'i', headline: 'I', settlementIds: ['X'] }] },
      { tick: 26, selectedOutcomes: [{ id: 'c', headline: 'C', targetSaveId: 'Y' }], impactDigest: [] },
    ] };
    const a = JSON.stringify(advanceEntries(ws).map(chronicleForAdvance));
    const b = JSON.stringify(advanceEntries(ws).map(chronicleForAdvance));
    expect(a).toBe(b);
  });
});
