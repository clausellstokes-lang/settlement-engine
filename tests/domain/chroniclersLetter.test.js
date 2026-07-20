/**
 * chroniclersLetter.test.js — VISION V-2 THE CHRONICLER'S LETTER (+ R-16/R-17).
 *
 * The deterministic composer diffs the news since lastReadTick, groups by the
 * house categories, prioritizes by significance, degrades to a quiet-week grace,
 * lights the R-16 "world deepened" section only on a flag delta vs a recorded
 * baseline, and renders portable text (R-17).
 */
import { describe, it, expect } from 'vitest';
import { composeChroniclersLetter, letterToPlainText, enabledFlagsOf } from '../../src/domain/display/chroniclersLetter.js';

const feed = {
  currentTick: 10,
  entries: [
    { id: 'w1', tick: 8, significance: 'major', impactKind: 'conflict_pressure', headline: 'The border burns', summary: 'Levies march.' },
    { id: 'a1', tick: 6, significance: 'notable', impactKind: 'authority_instability', headline: 'The council fractures' },
    { id: 't1', tick: 9, significance: 'notable', impactKind: 'import_shortage', headline: 'Grain runs short' },
    { id: 'm1', tick: 7, significance: 'major', impactKind: 'generosity_relief', headline: 'Aid reaches the starving' },
    { id: 'f1', tick: 5, significance: 'notable', impactKind: 'religious_pressure', headline: 'A new rite spreads' },
    { id: 'old', tick: 3, significance: 'major', impactKind: 'conflict_pressure', headline: 'An old war' },
  ],
};

describe('V-2 — the diff, grouping, and priority', () => {
  const letter = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4 });

  it('diffs only beats newer than lastReadTick', () => {
    expect(letter.sinceTick).toBe(4);
    expect(letter.throughTick).toBe(10);
    expect(letter.counts.total).toBe(5); // the tick-3 'old' beat is excluded
    expect(letter.empty).toBe(false);
  });

  it('routes beats to the house sections', () => {
    const byId = Object.fromEntries(letter.sections.map((s) => [s.id, s.lines.map((l) => l.id)]));
    expect(byId.wars).toEqual(['w1']);
    expect(byId.courts).toEqual(['a1']);
    expect(byId.trade).toEqual(['t1']);
    expect(byId.traditions).toEqual(['f1']);
    expect(byId.mercy).toEqual(['m1']);
    expect(letter.sections.map((s) => s.id)).toEqual(['wars', 'courts', 'trade', 'traditions', 'mercy']); // reading order, no sundry
  });

  it('orders MAJOR before NOTABLE within a section', () => {
    const two = { currentTick: 5, entries: [
      { id: 'n', tick: 4, significance: 'notable', impactKind: 'conflict_pressure', headline: 'A skirmish' },
      { id: 'M', tick: 2, significance: 'major', impactKind: 'conflict_pressure', headline: 'A rout' },
    ] };
    const l = composeChroniclersLetter({ wizardNews: two, lastReadTick: 0 });
    expect(l.sections[0].lines.map((x) => x.id)).toEqual(['M', 'n']); // major first despite lower tick
    expect(l.counts).toEqual({ major: 1, notable: 1, total: 2 });
  });

  it('is deterministic — a second compose is byte-identical', () => {
    expect(JSON.stringify(composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4 }))).toBe(JSON.stringify(letter));
  });
});

describe('V-2 — the empty-diff grace', () => {
  it('reads quiet (empty, a quiet greeting, no sections) when nothing is new', () => {
    const l = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 10 });
    expect(l.empty).toBe(true);
    expect(l.sections).toEqual([]);
    expect(l.counts.total).toBe(0);
    expect(l.greeting.toLowerCase()).toMatch(/quiet|still|without event/);
  });
});

describe('V-2 R-16 — the "world deepened" section', () => {
  const rules = { warLayerEnabled: true, faithSpreadEnabled: true, seasonsEnabled: false };

  it('is DARK when no flags-seen baseline is recorded (flagsSeen null)', () => {
    const l = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4, simulationRules: rules, flagsSeen: null });
    expect(l.deepened).toBeNull();
  });

  it('lights only the newly-enabled flags vs the recorded baseline', () => {
    const l = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4, simulationRules: rules, flagsSeen: ['warLayerEnabled'] });
    expect(l.deepened).not.toBeNull();
    expect(l.deepened.flags).toEqual(['faithSpreadEnabled']); // warLayerEnabled already seen; seasons is off
  });

  it('stays dark when the baseline already covers every enabled flag', () => {
    const l = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4, simulationRules: rules, flagsSeen: ['warLayerEnabled', 'faithSpreadEnabled'] });
    expect(l.deepened).toBeNull();
  });

  it('enabledFlagsOf returns the sorted enabled boolean keys', () => {
    expect(enabledFlagsOf({ b: true, a: true, c: false })).toEqual(['a', 'b']);
    expect(enabledFlagsOf(null)).toEqual([]);
  });
});

describe('V-2 R-17 — the shareable text export', () => {
  it('renders the letter to deterministic house-voiced text', () => {
    const letter = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4 });
    const text = letterToPlainText(letter);
    expect(text).toContain('THE CHRONICLER’S LETTER');
    expect(text).toContain('The border burns');
    expect(text).toContain('OF MERCY GIVEN');
    expect(text).toContain(letter.closing);
    expect(letterToPlainText(letter)).toBe(text); // deterministic
  });
});
