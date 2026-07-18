/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumHubs.test.jsx — the Compendium (#20) render + reachability suite.
 *
 * Asserts the dashboard + every new registry hub renders from the generated
 * drift-contract artifact, and that the tier-band drift is corrected on screen.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';

afterEach(cleanup);

const storeState = { getCustomContentCount: () => 0 };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

function clickTab(container, label) {
  const btn = [...container.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(label));
  if (!btn) throw new Error(`tab not found: ${label}`);
  fireEvent.click(btn);
}

describe('Compendium — dashboard + registry hubs', () => {
  it('opens on the Overview dashboard with source-rendered catalog counts', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone />);
    const text = container.textContent;
    // The demo world + at least the operations and deities counts, from the artifact.
    expect(text).toContain(CD.meta.demoWorld.name);
    expect(text).toContain(String(CD.operations.count));
    expect(text).toContain(String(CD.deities.count));
  });

  it('the Operations hub is the op registry public (read/propose/write, every class)', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone />);
    clickTab(container, 'Operations');
    const text = container.textContent;
    expect(text).toContain('applyEvent');            // a real canon op renders
    expect(text.toLowerCase()).toContain('reads');    // the S-stage story
    expect(text.toLowerCase()).toContain('proposes');
    expect(text.toLowerCase()).toContain('writes');
    expect(text).toContain(String(CD.operations.count));
    // The by-class tally is present.
    for (const k of Object.keys(CD.operations.byKlass)) expect(text).toContain(k);
  });

  it('the Living World hub renders the REAL 16 vars / 9 pressures (drift killed)', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone />);
    clickTab(container, 'Living World');
    const text = container.textContent;
    expect(text).toContain(String(CD.causal.variableCount)); // 16
    expect(text).toContain(String(CD.pressures.count));      // 9
    // The real pressure kinds (not the stale "military, economic, social" list).
    expect(text).toContain(CD.pressures.kinds[0]);           // 'food'
  });

  it('Tiers render the corrected engine population bands (Thorp 8, not 20-80)', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone />);
    clickTab(container, 'Tiers');
    const text = container.textContent;
    const thorp = CD.tiers.find((t) => t.id === 'thorp');
    expect(text).toContain(`${thorp.min.toLocaleString()}–${thorp.max.toLocaleString()}`);
    expect(text).not.toContain('20-80'); // the old, wrong, hand-typed band
  });

  it('Deities, Lenses, Facets, Calamity, and the A–Z index all render', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone />);
    clickTab(container, 'Deities');
    expect(container.textContent).toContain(CD.deities.entries[0].name);
    clickTab(container, 'Map Lenses');
    expect(container.textContent).toContain(CD.lenses.entries[0].label);
    clickTab(container, 'Facets');
    expect(container.textContent.toLowerCase()).toContain('interior');
    clickTab(container, 'Calamity');
    expect(container.textContent).toContain(CD.calamity.flavors[0].title);
    clickTab(container, 'A–Z Index');
    expect(container.textContent.toLowerCase()).toContain('alphabetical');
  });
});
