/**
 * bandFamilies.test.js — SP-A. The two minted families' behaviour contract.
 *
 * The STRUCTURAL half of this wave's claim (that nothing else in the tree spells these
 * ladders, and that the two families are disjoint from every other frozen band
 * vocabulary) is a source scan and lives in tests/lint/spBandFamilies.walker.test.js.
 * This file pins what the family DOES: the order, the fail-closed rank, and the two
 * shapes the pacing governor's input grammar is made of.
 *
 * THE SIGNIFICANCE ORDER IS PINNED AGAINST THE LIVE REGISTRY, not against a literal
 * this file also owns. `eventProse.js` already carries the three classes on real kind
 * rows, and if this family disagreed with the rows the estate actually speaks, the mint
 * would be a second spelling wearing a canonical file's name.
 */
import { describe, expect, test } from 'vitest';
import {
  SIGNIFICANCE_CLASSES,
  SEVERITY_LADDER,
  significanceRankOf,
  severityRankOf,
  admitsSignificance,
  sectionCapShape,
} from '../../src/domain/worldPulse/bandFamilies.js';
import * as eventProse from '../../src/domain/worldPulse/eventProse.js';

describe('SP-6a — the ONE significance family', () => {
  test('three classes, ascending, and the rank is a total order', () => {
    expect(SIGNIFICANCE_CLASSES).toEqual(['routine', 'notable', 'major']);
    expect(SIGNIFICANCE_CLASSES.map(significanceRankOf)).toEqual([0, 1, 2]);
    expect(Object.isFrozen(SIGNIFICANCE_CLASSES)).toBe(true);
  });

  test('THE BORROW IS REAL: every significance the live kind registries speak is a member', () => {
    // The refutation this wave landed: the compiled architecture recorded 'routine' as
    // absent from the tree. It is not — it is authored on live kind rows. If the family
    // had been minted as a two-valued scale, those rows would have been outside their
    // own canonical vocabulary from the first commit.
    //
    // The registry set is DISCOVERED from the module's exports rather than transcribed,
    // so a seventh registry is covered the day it lands (the filename-anchored-denominator
    // class: a hand list goes vacuous the moment the tree grows past it).
    const registries = Object.entries(eventProse)
      .filter(([name, value]) => /_KIND_REGISTRY$/.test(name) && Array.isArray(value));
    expect(registries.length, 'no kind registries found — this pin would prove nothing').toBeGreaterThanOrEqual(6);
    const spoken = new Set();
    for (const [, rows] of registries) {
      for (const row of rows) spoken.add(row.significance);
    }
    expect(spoken.size, 'the registries parsed empty — this pin would prove nothing').toBeGreaterThanOrEqual(2);
    expect(spoken.has('routine'), "'routine' is live on the kind registries today").toBe(true);
    for (const word of [...spoken].sort()) {
      expect(SIGNIFICANCE_CLASSES, `${word} is spoken by a live registry`).toContain(word);
    }
  });

  test('an unknown class THROWS — the governor may not throttle by a fallback', () => {
    expect(() => significanceRankOf('critical')).toThrow(/unknown significance class/);
    expect(() => significanceRankOf(undefined)).toThrow(/unknown significance class/);
    // …and the same call works on a real class, so the throw measures a refusal.
    expect(significanceRankOf('notable')).toBe(1);
  });

  test('the significance-FLOOR shape is at-or-above, both directions', () => {
    expect(admitsSignificance('major', 'notable')).toBe(true);
    expect(admitsSignificance('notable', 'notable')).toBe(true);
    expect(admitsSignificance('routine', 'notable')).toBe(false);
    expect(admitsSignificance('routine', 'routine')).toBe(true);
  });

  test('the section-CAP shape is TOTAL: a missing class is refused, never defaulted', () => {
    const caps = sectionCapShape({ routine: 2, notable: 4, major: 12 });
    expect(caps).toEqual({ routine: 2, notable: 4, major: 12 });
    expect(Object.isFrozen(caps)).toBe(true);
    // A missing class silently means "unlimited", which is exactly how depth becomes
    // wallpaper — so the shape refuses it. The success above proves the call shape works.
    expect(() => sectionCapShape({ notable: 4, major: 12 })).toThrow(/exactly once/);
    expect(() => sectionCapShape({ routine: 2, notable: 4, major: 12, chronic: 1 })).toThrow(/exactly once/);
    expect(() => sectionCapShape({})).toThrow(/exactly once/);
    expect(() => sectionCapShape({ routine: 0.5, notable: 4, major: 12 })).toThrow(/non-negative integer/);
    expect(() => sectionCapShape({ routine: -1, notable: 4, major: 12 })).toThrow(/non-negative integer/);
    // Zero is a legitimate cap ("this desk prints no routine beats"); it is not a miss.
    expect(sectionCapShape({ routine: 0, notable: 4, major: 12 }).routine).toBe(0);
  });
});

describe('SP-6b — the ONE severity ladder', () => {
  test('four rungs, ascending, total order', () => {
    expect(SEVERITY_LADDER).toEqual(['glancing', 'telling', 'grave', 'ruinous']);
    expect(SEVERITY_LADDER.map(severityRankOf)).toEqual([0, 1, 2, 3]);
    expect(Object.isFrozen(SEVERITY_LADDER)).toBe(true);
  });

  test('an unknown rung THROWS', () => {
    expect(() => severityRankOf('severe')).toThrow(/unknown severity rung/);
    expect(() => severityRankOf('major')).toThrow(/unknown severity rung/);
    expect(severityRankOf('grave')).toBe(2);
  });

  test('THE TWO FAMILIES SHARE NO WORD — reading the wrong ladder is impossible by spelling', () => {
    const overlap = SEVERITY_LADDER.filter((w) => SIGNIFICANCE_CLASSES.includes(w));
    // Both arrays are asserted non-empty and exact above, so this intersection measures
    // real disjointness rather than a comparison against an empty set.
    expect(SIGNIFICANCE_CLASSES.length + SEVERITY_LADDER.length).toBe(7);
    expect(overlap).toEqual([]);
  });
});
