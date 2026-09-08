/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumPresets.test.jsx — Compendium-completion Wave E pin.
 *
 * THE GAP: four of the seven simulation presets (Quiet Local, Realistic Regional,
 * Static Campaign, Narrative Campaign) rendered the identical line "lights no endgame
 * systems (quiet)", giving a DM zero basis to choose among them. Now each preset
 * carries an authored summary + the distinguishing axes (intensity, autonomy).
 *   1. Every preset has a non-empty summary, intensity, and humanized autonomy label,
 *      and the summaries are all distinct.
 *   2. The Living World tab renders each preset's summary + intensity axis.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { SystemsHub } from '../../src/components/compendium/RegistryHubs.jsx';

afterEach(cleanup);

describe('compendium presets — the quiet presets are distinguishable', () => {
  test('every preset carries a distinct summary + intensity + autonomy label', () => {
    expect(CD.presets.length).toBe(7);
    const summaries = CD.presets.map((p) => p.summary);
    for (const p of CD.presets) {
      expect(p.summary && p.summary.trim().length, `${p.id} summary`).toBeGreaterThan(0);
      expect(p.intensity && p.intensity.trim().length, `${p.id} intensity`).toBeGreaterThan(0);
      expect(p.autonomyLabel && p.autonomyLabel.trim().length, `${p.id} autonomyLabel`).toBeGreaterThan(0);
    }
    // No two presets share a summary (the quiet-preset ambiguity is gone).
    expect(new Set(summaries).size).toBe(summaries.length);
  });

  test('the Living World tab renders each preset summary + intensity', () => {
    const { container } = render(<SystemsHub />);
    const text = container.textContent || '';
    for (const p of CD.presets) {
      expect(text.includes(p.summary), `Living World tab missing summary for "${p.id}"`).toBe(true);
      expect(text.includes(p.intensity), `Living World tab missing intensity for "${p.id}"`).toBe(true);
    }
  });
});
