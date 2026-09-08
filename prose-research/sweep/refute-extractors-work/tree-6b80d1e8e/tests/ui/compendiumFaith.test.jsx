/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumFaith.test.jsx — Compendium-completion Wave C1 pin.
 *
 * THE GAP: the compendium promised "the same alignment / temperament / rank
 * vocabulary applies" but defined no axis value; and the cult->minor->major rise was
 * documented nowhere. The doctrine (no premade roster) makes the FOUR AXES the deity
 * entry. This pins:
 *   1. CD.faith carries the doctrine framing + all four axes, each with lines
 *      projected from the engine's DEITY_AXIS_EFFECTS single source (never re-typed).
 *   2. The Arcane tab renders the authorship line, each axis, each effect line, and
 *      the derived-temperament note.
 *   3. The Pantheon Rank ladder copy stays BOUND to PANTHEON_TUNING: the seat/tick
 *      numbers the readings state equal the engine tuning, so a tuning change reds.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { ArcaneTab } from '../../src/components/compendium/CatalogTabs.jsx';
import { PANTHEON_TUNING } from '../../src/domain/worldPulse/pantheon.js';
import { getMagicLevel } from '../../src/data/constants.js';

afterEach(cleanup);

describe('compendium faith — the deity axes are the doctrine entry (no roster)', () => {
  test('CD.faith carries framing + all four axes with non-empty lines', () => {
    expect(CD.faith.authorship.trim().length).toBeGreaterThan(0);
    expect(CD.faith.temperNote.trim().length).toBeGreaterThan(0);
    const ids = CD.faith.axes.map((a) => a.id);
    expect(ids).toEqual(['alignment', 'law', 'rank', 'temperament']);
    for (const a of CD.faith.axes) {
      expect(a.label.trim().length, `${a.id} label`).toBeGreaterThan(0);
      expect(a.lines.length, `${a.id} lines`).toBeGreaterThanOrEqual(2);
      for (const line of a.lines) expect(line.trim().length, `${a.id} line`).toBeGreaterThan(0);
    }
    // Doctrine: the framing says there is no premade roster.
    expect(CD.faith.authorship.toLowerCase()).toContain('no premade roster');
  });

  test('the Arcane tab renders the framing, every axis, every line, and the temper note', () => {
    const { container } = render(<ArcaneTab />);
    const text = container.textContent || '';
    expect(text.includes(CD.faith.authorship)).toBe(true);
    expect(text.includes(CD.faith.temperNote)).toBe(true);
    for (const a of CD.faith.axes) {
      expect(text.includes(a.label), `Arcane tab missing axis "${a.label}"`).toBe(true);
      for (const line of a.lines) expect(text.includes(line), `Arcane tab missing line "${line}"`).toBe(true);
    }
  });

  test('the Pantheon Rank copy is bound to PANTHEON_TUNING (a tuning change reds it)', () => {
    // The readings state: cult->minor at two seats, minor->major at four, a change
    // holds for two ticks, at most two ranks change per tick. If the engine tuning
    // moves, this reds so the copy in bandLadders.js gets revisited.
    expect(PANTHEON_TUNING.MINOR_PROMOTE).toBe(2);
    expect(PANTHEON_TUNING.MAJOR_PROMOTE).toBe(4);
    expect(PANTHEON_TUNING.TIER_HOLD_TICKS).toBe(2);
    expect(PANTHEON_TUNING.MAX_TIER_CHANGES_PER_TICK).toBe(2);
    const rank = CD.bandLadders.find((l) => l.id === 'pantheon-rank');
    expect(rank, 'pantheon-rank ladder present').toBeTruthy();
    expect(rank.levels.map((x) => x.name)).toEqual(['Cult', 'Minor', 'Major']);
  });
});

describe('compendium magic — the magic level + legality ladders', () => {
  test('the Magic Level thresholds are bound to getMagicLevel (a change reds the copy)', () => {
    // The Magic Level ladder readings state 0 none, <=25 low, <=65 medium, else high.
    expect(getMagicLevel(0)).toBe('none');
    expect(getMagicLevel(25)).toBe('low');
    expect(getMagicLevel(65)).toBe('medium');
    expect(getMagicLevel(66)).toBe('high');
  });

  test('the Magic Level + Magic Legality ladders render on the Arcane tab', () => {
    const level = CD.bandLadders.find((l) => l.id === 'magic-level');
    const legality = CD.bandLadders.find((l) => l.id === 'magic-legality');
    expect(level && legality, 'both magic ladders present').toBeTruthy();
    expect(level.levels.map((x) => x.name)).toEqual(['None', 'Low', 'Medium', 'High']);
    expect(legality.levels.map((x) => x.name)).toEqual(['Forbidden', 'Restricted', 'Regulated', 'Tolerated', 'Celebrated']);
    const { container } = render(<ArcaneTab />);
    const text = container.textContent || '';
    for (const l of [level, legality]) {
      expect(text.includes(l.concept), `Arcane tab missing "${l.concept}"`).toBe(true);
      for (const lvl of l.levels) expect(text.includes(lvl.name), `Arcane tab missing rung "${lvl.name}"`).toBe(true);
    }
  });
});
