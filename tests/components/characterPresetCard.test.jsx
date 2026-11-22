/** @vitest-environment jsdom */
/**
 * characterPresetCard.test.jsx — the merged Character card (chips + always-on
 * sliders). Applying a character writes the SAME config patch the legacy
 * SliderPanel dropdown wrote (archetypePatch) — the proof that the Create reorg
 * is byte-identical to generation. Also pins:
 *   • the three-state active-chip derivation (Random / archetype / Custom);
 *   • picking an archetype snaps the sliders + clears Random;
 *   • dragging a slider clears Random and yields Custom;
 *   • the sliders + Random/Custom chips render only in Advanced.
 */

import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import {
  archetypePatch,
  ARCHETYPES,
} from '../../src/components/generate/characterPresets.js';

const updateConfig = vi.fn();
const setRandomSliderMode = vi.fn();
const setCustomSlidersExplicit = vi.fn();
// Mutable store backing both the selector hook and the three states under test.
const state = {
  config: { magicExists: true },
  randomSliderMode: true,
  customSlidersExplicit: false,
  updateConfig,
  setRandomSliderMode,
  setCustomSlidersExplicit,
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(state); }
  useStore.getState = () => state;
  return { useStore };
});

import CharacterPresetCard, {
  activeArchetypeKey,
  activeChipKey,
} from '../../src/components/generate/CharacterPresetCard.jsx';

afterEach(cleanup);
beforeEach(() => {
  updateConfig.mockClear();
  setRandomSliderMode.mockClear();
  setCustomSlidersExplicit.mockClear();
  state.config = { magicExists: true };
  state.randomSliderMode = true;
  state.customSlidersExplicit = false;
});

describe('archetypePatch — byte-identical config mapping', () => {
  it('returns the exact priority + threat values for a known archetype', () => {
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

describe('active-chip derivation — the three states', () => {
  it('Random when randomSliderMode is on, regardless of slider values', () => {
    // Even values that exactly match an archetype read as Random while on.
    const merchant = archetypePatch('merchant_republic');
    expect(activeChipKey(merchant, true)).toBe('__random__');
  });

  it('the matched archetype when not random and values match a preset', () => {
    const theocracy = archetypePatch('theocracy');
    expect(activeArchetypeKey(theocracy)).toBe('theocracy');
    expect(activeChipKey(theocracy, false)).toBe('theocracy');
  });

  it('Custom when not random and no preset matches', () => {
    const off = { priorityEconomy: 51, priorityMilitary: 50, priorityMagic: 50, priorityReligion: 50, priorityCriminal: 50 };
    expect(activeArchetypeKey(off)).toBeNull();
    expect(activeChipKey(off, false)).toBe('__custom__');
  });

  it('default 50s read as Balanced when Custom was not explicitly chosen', () => {
    const defaults = { priorityEconomy: 50, priorityMilitary: 50, priorityMagic: 50, priorityReligion: 50, priorityCriminal: 50 };
    expect(activeArchetypeKey(defaults)).toBe('balanced');
    expect(activeChipKey(defaults, false)).toBe('balanced');
  });

  it('explicit Custom wins the Balanced/default tie (the unreachable-Custom fix)', () => {
    const defaults = { priorityEconomy: 50, priorityMilitary: 50, priorityMagic: 50, priorityReligion: 50, priorityCriminal: 50 };
    // Without the flag the default 50s collide with `balanced`; the flag lets the
    // Custom chip win that collision so Custom is reachable from the default state.
    expect(activeChipKey(defaults, false, true)).toBe('__custom__');
  });

  it('an explicit Custom click wins even when values exactly match a preset', () => {
    // Pick an archetype, then click Custom: the explicit intent wins so Custom
    // lights up, rather than the matched archetype staying lit (which would make
    // the Custom click feel ignored). The flag is cleared by any archetype/Random.
    const theocracy = archetypePatch('theocracy');
    expect(activeChipKey(theocracy, false, true)).toBe('__custom__');
  });

  it('Random always wins, even with the explicit-Custom flag set', () => {
    const defaults = { priorityEconomy: 50, priorityMilitary: 50, priorityMagic: 50, priorityReligion: 50, priorityCriminal: 50 };
    expect(activeChipKey(defaults, true, true)).toBe('__random__');
  });
});

describe('CharacterPresetCard — applies the patch', () => {
  it('clicking a character writes its archetypePatch via updateConfig', () => {
    render(<CharacterPresetCard advanced />);
    fireEvent.click(screen.getByText('Theocracy'));
    expect(updateConfig).toHaveBeenCalledWith(archetypePatch('theocracy'));
    // Picking a character leaves random-slider mode (so the shape takes effect)
    // and clears any explicit-Custom intent so the chosen chip lights up.
    expect(setRandomSliderMode).toHaveBeenCalledWith(false);
    expect(setCustomSlidersExplicit).toHaveBeenCalledWith(false);
  });

  it('the Random chip turns random mode on, clears Custom intent, and leaves values', () => {
    state.randomSliderMode = false;
    render(<CharacterPresetCard advanced />);
    fireEvent.click(screen.getByRole('button', { name: /Random/ }));
    expect(setRandomSliderMode).toHaveBeenCalledWith(true);
    expect(setCustomSlidersExplicit).toHaveBeenCalledWith(false);
    expect(updateConfig).not.toHaveBeenCalled();
  });

  it('the Custom chip enters manual mode + sets explicit intent without altering values', () => {
    render(<CharacterPresetCard advanced />);
    fireEvent.click(screen.getByRole('button', { name: /Custom/ }));
    expect(setRandomSliderMode).toHaveBeenCalledWith(false);
    expect(setCustomSlidersExplicit).toHaveBeenCalledWith(true);
    expect(updateConfig).not.toHaveBeenCalled();
  });

  it('clicking Custom from the default state lights up Custom, not Balanced', () => {
    // The reachability fix end-to-end: default config (all 50s, randomSliderMode
    // off) + explicit Custom intent must show the Custom chip pressed, never
    // Balanced, even though 50s exact-match `balanced`.
    state.randomSliderMode = false;
    state.customSlidersExplicit = true;
    state.config = { magicExists: true, priorityEconomy: 50, priorityMilitary: 50, priorityMagic: 50, priorityReligion: 50, priorityCriminal: 50 };
    render(<CharacterPresetCard advanced />);
    expect(screen.getByRole('button', { name: /Custom/ }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: /^Balanced$/ }).getAttribute('aria-pressed')).toBe('false');
  });

  it('dragging a slider clears Random and writes the new value (yielding Custom)', () => {
    state.randomSliderMode = true;
    render(<CharacterPresetCard advanced />);
    const economy = screen.getByLabelText('Economy');
    fireEvent.change(economy, { target: { value: '73' } });
    // Leaves Random...
    expect(setRandomSliderMode).toHaveBeenCalledWith(false);
    // ...and writes the dragged value, which deviates from every preset (Custom).
    expect(updateConfig).toHaveBeenCalledWith({ priorityEconomy: 73 });
    expect(activeChipKey({ priorityEconomy: 73 }, false)).toBe('__custom__');
  });
});

describe('CharacterPresetCard — Basic vs Advanced surface', () => {
  it('Advanced renders the priority sliders + Random/Custom chips', () => {
    render(<CharacterPresetCard advanced />);
    expect(screen.getByLabelText('Economy')).toBeTruthy();
    // Default state is Random, so the chip reads "✓ Random" (active glyph).
    expect(screen.getByRole('button', { name: /Random/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Custom/ })).toBeTruthy();
  });

  it('Basic renders archetypes only — no sliders, no Random/Custom chips', () => {
    render(<CharacterPresetCard />);
    expect(screen.queryByLabelText('Economy')).toBeNull();
    expect(screen.queryByRole('button', { name: /Random/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /Custom/ })).toBeNull();
    // Archetype chips still present.
    expect(screen.getByText('Theocracy')).toBeTruthy();
  });

  it('hides the Magic slider when magic does not exist in the world', () => {
    state.config = { magicExists: false };
    render(<CharacterPresetCard advanced />);
    expect(screen.queryByLabelText('Magic')).toBeNull();
    expect(screen.getByLabelText('Economy')).toBeTruthy();
  });
});
