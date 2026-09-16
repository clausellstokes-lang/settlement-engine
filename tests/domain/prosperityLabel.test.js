/**
 * tests/domain/prosperityLabel.test.js — the tolerant prosperity read
 * (components-dossier-library-3). economicState.prosperity is a STRING label; the
 * old `prosperity?.tier` read was always undefined, so the SummaryTabV2 / TableView
 * prosperity + stressors block never rendered. This pin nails the string shape.
 */

import { describe, it, expect } from 'vitest';
import { prosperityLabel } from '../../src/domain/summary/tonightAtTheTable.js';
import { PROSPERITY_OPTIONS } from '../../src/components/gallery/galleryUtils.js';

describe('prosperityLabel — tolerant read', () => {
  it('reads the STRING label the generator actually produces (the real shape)', () => {
    for (const label of PROSPERITY_OPTIONS) {
      expect(prosperityLabel(label)).toBe(label);
    }
    // the exact regression: a plain string was previously read as `.tier` ⇒ '' ⇒ hidden.
    expect(prosperityLabel('Prosperous')).toBe('Prosperous');
  });

  it('tolerates a defensive { tier } object shape without breaking', () => {
    expect(prosperityLabel({ tier: 'Wealthy' })).toBe('Wealthy');
    expect(prosperityLabel({ tier: 3 })).toBe('3');
  });

  it('returns empty string for absent / unreadable prosperity', () => {
    expect(prosperityLabel(undefined)).toBe('');
    expect(prosperityLabel(null)).toBe('');
    expect(prosperityLabel('')).toBe('');
    expect(prosperityLabel({})).toBe('');
    expect(prosperityLabel({ tier: null })).toBe('');
    expect(prosperityLabel(42)).toBe('');
  });
});
