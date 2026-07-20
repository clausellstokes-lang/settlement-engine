/** @vitest-environment jsdom */
/**
 * foundingWorlds.test.jsx — R-2 Founding Worlds surface pins.
 *
 * The cards render the registry, and forging one drives the store's basic-forge
 * path with the seed's exact config (the ForgeExactButton idiom) so the user gets
 * the EXACT world the claims-parity probe proved.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';

const actions = {
  generateSettlement: vi.fn(() => Promise.resolve()),
  updateConfig: vi.fn(),
  setWizardMode: vi.fn(),
  setRandomSliderMode: vi.fn(),
  auth: { tier: 'premium' },
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(actions); }
  useStore.getState = () => actions;
  return { useStore };
});
vi.mock('../../src/lib/anonGenCounter.js', () => ({ anonAtCap: () => false }));

function installMatchMedia() {
  window.matchMedia = vi.fn((q) => ({ media: q, matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} }));
}

async function load() {
  vi.resetModules();
  return (await import('../../src/components/generate/FoundingWorlds.jsx')).default;
}

afterEach(cleanup);

describe('FoundingWorlds', () => {
  test('renders a card per founding seed with its title + claims', async () => {
    installMatchMedia();
    const FoundingWorlds = await load();
    const { FOUNDING_SEEDS } = await import('../../src/data/foundingSeeds.js');
    render(<FoundingWorlds onNavigate={() => {}} />);
    for (const s of FOUNDING_SEEDS) {
      expect(screen.getByText(s.title)).toBeTruthy();
    }
    // A representative claim is on screen (proven by the probe).
    expect(screen.getByText(/Legitimacy Crisis/i)).toBeTruthy();
  });

  test('forging a world drives the basic-forge path with the seed and preset', async () => {
    installMatchMedia();
    const onNavigate = vi.fn();
    const FoundingWorlds = await load();
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { archetypePatch } = await import('../../src/components/generate/characterPresets.js');
    const { FOUNDING_SEEDS } = await import('../../src/data/foundingSeeds.js');
    const first = FOUNDING_SEEDS[0];

    render(<FoundingWorlds onNavigate={onNavigate} />);
    const forgeButtons = screen.getAllByRole('button', { name: /Forge this world/i });
    fireEvent.click(forgeButtons[0]);

    expect(actions.setWizardMode).toHaveBeenCalledWith('basic');
    expect(actions.setRandomSliderMode).toHaveBeenCalledWith(true);
    expect(actions.updateConfig).toHaveBeenCalledWith(
      expect.objectContaining({ ...DEFAULT_CONFIG, settType: first.settType, ...archetypePatch(first.archetype) }),
    );
    await waitFor(() => expect(actions.generateSettlement).toHaveBeenCalledWith(first.seed));
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith('generate'));
  });
});
