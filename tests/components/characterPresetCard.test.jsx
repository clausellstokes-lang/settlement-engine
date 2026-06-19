/** @vitest-environment jsdom */
/**
 * characterPresetCard.test.jsx — the promoted Character preset (UX overhaul
 * Phase 6). Applying a character writes the SAME config patch the legacy
 * SliderPanel dropdown wrote (archetypePatch) — the proof that the Create reorg
 * is byte-identical to generation. Also pins that archetypePatch returns the
 * exact priority + threat values for a known archetype.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { archetypePatch, ARCHETYPES } from '../../src/components/generate/characterPresets.js';

const updateConfig = vi.fn();
const setRandomSliderMode = vi.fn();
const state = {
  config: { magicExists: true },
  updateConfig,
  setRandomSliderMode,
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(state); }
  useStore.getState = () => state;
  return { useStore };
});

import CharacterPresetCard from '../../src/components/generate/CharacterPresetCard.jsx';

afterEach(cleanup);

describe('archetypePatch — byte-identical config mapping', () => {
  it('returns the exact priority + threat values for a known archetype', () => {
    // Merchant Republic from the verbatim-extracted table.
    expect(archetypePatch('merchant_republic')).toEqual({
      priorityEconomy: 82,
      priorityMilitary: 38,
      priorityMagic: 42,
      priorityReligion: 32,
      priorityCriminal: 62,
      monsterThreat: 'heartland',
    });
  });

  it('covers all 17 archetypes', () => {
    expect(ARCHETYPES).toHaveLength(17);
    for (const a of ARCHETYPES) expect(archetypePatch(a.key)).not.toBeNull();
  });

  it('returns null for an unknown key', () => {
    expect(archetypePatch('not_a_real_archetype')).toBeNull();
  });
});

describe('CharacterPresetCard — applies the patch', () => {
  it('clicking a character writes its archetypePatch via updateConfig', () => {
    render(<CharacterPresetCard />);
    fireEvent.click(screen.getByText('Theocracy'));
    expect(updateConfig).toHaveBeenCalledWith(archetypePatch('theocracy'));
    // Picking a character leaves random-slider mode (so the shape takes effect).
    expect(setRandomSliderMode).toHaveBeenCalledWith(false);
  });
});
