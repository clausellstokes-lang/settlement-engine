/**
 * @vitest-environment jsdom
 *
 * settlementMapSkinPicker.test.jsx — THE SKIN REGISTRY picker (THE ILLUSTRATED TOWN, IT-4).
 *
 * The lens switcher (SettlementMapEditControls → MapLensSwitcher) is the SELECT half of the closed
 * seam: saved bespoke skins are listed AFTER the base lenses under a rubric divider, each labelled
 * with its OWN saved name, and picking one calls the SAME onPickLens the base lenses use (the pane
 * then persists it via withStyleLens and every surface resolves it through resolveActiveStyle).
 * Pins: base lenses always render; saved skins render under a divider with the active one
 * highlighted; a skin click fires onPickLens(skinId); NO skins ⇒ no divider (byte-identical chrome).
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import SettlementMapEditControls from '../../src/components/townMap/SettlementMapEditControls.jsx';
import { TOWN_MAP_LENS_IDS } from '../../src/design/townMapStyles.js';

afterEach(cleanup);

const baseProps = {
  editing: false, showLegend: false, legendPrefs: { showLabels: false, showLegend: false },
  hasEdits: false, districts: [], lensPersisted: true,
  onReroll() {}, onToggleLabels() {}, onToggleLegend() {}, onReset() {},
};

describe('skin picker — saved skins under the rubric divider', () => {
  it('lists the base lenses AND the saved skins (with their own labels), active one highlighted', () => {
    const onPickLens = vi.fn();
    render(
      <SettlementMapEditControls
        {...baseProps}
        styleIds={TOWN_MAP_LENS_IDS}
        bespokeSkins={[{ id: 'neon-noir', label: 'Neon Noir' }, { id: 'sun-bleached', label: 'Sun Bleached' }]}
        activeLens="neon-noir"
        onPickLens={onPickLens}
      />,
    );
    // base lenses present…
    expect(document.querySelector('[data-town-lens="parchment"]')).toBeTruthy();
    expect(document.querySelector('[data-town-lens="illustrated"]')).toBeTruthy();
    // …the divider and the saved skins present, labelled by their saved name…
    expect(document.querySelector('[data-town-lens-divider]')).toBeTruthy();
    const skinBtn = document.querySelector('[data-town-skin="neon-noir"]');
    expect(skinBtn).toBeTruthy();
    expect(skinBtn.textContent).toContain('Neon Noir');
    expect(document.querySelector('[data-town-skin="sun-bleached"]').textContent).toContain('Sun Bleached');
    // the active skin is highlighted (aria-pressed), a base lens is not.
    expect(skinBtn.getAttribute('aria-pressed')).toBe('true');
    expect(document.querySelector('[data-town-lens="parchment"]').getAttribute('aria-pressed')).toBe('false');
  });

  it('picking a saved skin fires onPickLens with the SKIN id (the same handler base lenses use)', () => {
    const onPickLens = vi.fn();
    render(
      <SettlementMapEditControls
        {...baseProps}
        styleIds={TOWN_MAP_LENS_IDS}
        bespokeSkins={[{ id: 'neon-noir', label: 'Neon Noir' }]}
        activeLens="parchment"
        onPickLens={onPickLens}
      />,
    );
    fireEvent.click(document.querySelector('[data-town-skin="neon-noir"]'));
    expect(onPickLens).toHaveBeenCalledWith('neon-noir');
  });

  it('NO saved skins ⇒ no divider, no skin buttons (byte-identical chrome — dormancy)', () => {
    render(
      <SettlementMapEditControls
        {...baseProps}
        styleIds={TOWN_MAP_LENS_IDS}
        bespokeSkins={[]}
        activeLens="parchment"
        onPickLens={() => {}}
      />,
    );
    expect(document.querySelector('[data-town-lens-divider]')).toBeNull();
    expect(document.querySelector('[data-town-skin]')).toBeNull();
    expect(document.querySelector('[data-town-lens="parchment"]')).toBeTruthy();
  });
});
