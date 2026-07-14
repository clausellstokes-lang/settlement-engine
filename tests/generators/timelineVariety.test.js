/**
 * timelineVariety.test.js — [generators-domain-6].
 *
 * The history timeline had two variety defects:
 *   1. Category → template used find() (FIRST match), so a category always emitted
 *      the SAME arc — no within-category variety.
 *   2. Events carried the CATEGORY as their .type and the final dedup keyed on it,
 *      so every settlement was capped at ~one event per category (~8 total) —
 *      city/metropolis could never reach their 12/20 event budget.
 *
 * The fix: a seeded pick among all still-unused matching templates (variety +
 * budget), events carry a stable templateType, and the dedup keys on templateType
 * (with a name-collision guard). 10 new templates deepen the pools.
 */

import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { TIMELINE_CATEGORY_TYPES } from '../../src/generators/historyGenerator.js';
import { HISTORICAL_EVENTS_DATA, EVENT_TYPE_NAMES } from '../../src/data/historyData.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });

describe('generators-domain-6 — timeline variety + budget', () => {
  it('STRUCTURAL — every category template type is a real HISTORICAL_EVENTS_DATA type with a title', () => {
    const known = new Set(HISTORICAL_EVENTS_DATA.map((e) => e.type));
    for (const [cat, types] of Object.entries(TIMELINE_CATEGORY_TYPES)) {
      for (const t of types) {
        expect(known.has(t), `${cat} references unknown template type '${t}'`).toBe(true);
        expect(EVENT_TYPE_NAMES[t], `template '${t}' has no chapter title`).toBeTruthy();
      }
    }
  });

  it('within-category variety — the economic category yields many distinct arcs (was 1 pre-fix)', () => {
    const economicTitles = new Set();
    for (let i = 0; i < 60; i++) {
      const s = gen({ settType: 'city', terrainOverride: ['plains', 'coastal', 'hills'][i % 3] }, `var-${i}`);
      for (const e of s.history?.historicalEvents || []) {
        if (e.type === 'economic') economicTitles.add(e.name);
      }
    }
    expect(economicTitles.size).toBeGreaterThan(3);
  });

  it('budget — a metropolis timeline can exceed the old ~8 category cap', () => {
    let max = 0;
    for (let i = 0; i < 120; i++) {
      const s = gen({ settType: 'metropolis', terrainOverride: ['plains', 'coastal', 'mountain', 'forest'][i % 4] }, `budget-${i}`);
      max = Math.max(max, (s.history?.historicalEvents || []).length);
    }
    expect(max).toBeGreaterThan(8);
  });

  it('no two events in one timeline ever share a chapter title (cross-type collision guard)', () => {
    for (let i = 0; i < 80; i++) {
      const s = gen({ settType: 'metropolis', terrainOverride: ['plains', 'coastal', 'mountain'][i % 3] }, `dup-${i}`);
      const names = (s.history?.historicalEvents || []).map((e) => e.name);
      expect(new Set(names).size, `duplicate title in seed dup-${i}: ${names.join(', ')}`).toBe(names.length);
    }
  });

  it('same-seed determinism — identical timelines across two runs', () => {
    const a = gen({ settType: 'metropolis', terrainOverride: 'plains' }, 'det-x');
    const b = gen({ settType: 'metropolis', terrainOverride: 'plains' }, 'det-x');
    const names = (s) => (s.history?.historicalEvents || []).map((e) => e.name);
    expect(names(a)).toEqual(names(b));
  });
});
