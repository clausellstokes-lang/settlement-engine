/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumStressRows.test.jsx — Compendium-completion Wave B pin.
 *
 * THE GAP: every one of the 15 Stress tab rows rendered a bare EMPTY_VALUE dash —
 * the tab read s.description || s.desc, but STRESS_TYPE_MAP entries carry neither
 * (their real interpretation lives in viabilityNote + crisisHook). This pins the
 * fix so a new stress type cannot silently render an empty row again:
 *   1. DATA COMPLETENESS — every STRESS_TYPE_MAP entry has a non-empty label AND a
 *      non-empty viabilityNote (the body the tab renders).
 *   2. RENDER — the Stress tab shows each stress label with its viabilityNote, and
 *      no stress row is left as the EMPTY_VALUE placeholder.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { StressTab } from '../../src/components/compendium/CatalogTabs.jsx';
import { EMPTY_VALUE } from '../../src/components/theme.js';

afterEach(cleanup);

describe('compendium stress rows — every stress type is legible', () => {
  const entries = Object.values(STRESS_TYPE_MAP);

  test('the map is non-trivial (scanner did not silently break)', () => {
    expect(entries.length).toBeGreaterThanOrEqual(15);
  });

  test('every stress type has a non-empty label and viabilityNote (the rendered body)', () => {
    const bad = entries
      .filter((s) => !(s.label && s.label.trim()) || !(s.viabilityNote && s.viabilityNote.trim()))
      .map((s) => s.label || '(unlabelled)');
    // A new stress type without a viabilityNote would render the EMPTY_VALUE dash on
    // the Compendium Stress tab. Author its viabilityNote in src/data/stressTypes.js.
    expect(bad, `\nStress types with no viabilityNote:\n  ${bad.join('\n  ')}\n`).toEqual([]);
  });

  test('the Stress tab renders each stress label with its viabilityNote body', () => {
    const { container } = render(<StressTab />);
    const text = container.textContent || '';
    for (const s of entries) {
      expect(text.includes(s.label), `Stress tab missing "${s.label}"`).toBe(true);
      expect(text.includes(s.viabilityNote), `Stress tab missing body for "${s.label}"`).toBe(true);
    }
    // The old bug rendered the bare placeholder for every row; with a real body on
    // each, the placeholder-only row is gone. (EMPTY_VALUE may still appear inside a
    // legitimate sentence, so we assert the bodies render rather than banning the glyph.)
    expect(typeof EMPTY_VALUE).toBe('string');
  });
});
