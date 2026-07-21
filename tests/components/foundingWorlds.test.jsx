/** @vitest-environment jsdom */
/**
 * foundingWorlds.test.jsx — the create-landing sample strip pins.
 *
 * The cards render the Mossgate / Black Crag / Thornwell sample trio (imported
 * from src/data/sampleSettlements.js — the same source the Library empty-state
 * uses), and 'Fork this sample' drives the SAME fork wiring as the Library
 * (SettlementsPanel.forkSample): the sample's config loaded with a user-suffixed
 * seed, then generateSettlement(seed), then navigate. (Walk W1, owner order
 * 2026-07-21, ledger 13da1e95.)
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';

const actions = {
  generateSettlement: vi.fn(() => Promise.resolve({ name: 'x', tier: 'town' })),
  updateConfig: vi.fn(),
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
  test('renders a card per sample settlement with its name and a fork control', async () => {
    installMatchMedia();
    const FoundingWorlds = await load();
    const { SAMPLE_SETTLEMENTS } = await import('../../src/data/sampleSettlements.js');
    render(<FoundingWorlds onNavigate={() => {}} />);
    for (const s of SAMPLE_SETTLEMENTS) {
      expect(screen.getByText(s.name)).toBeTruthy();
    }
    expect(screen.getAllByRole('button', { name: /Fork this sample/i })).toHaveLength(SAMPLE_SETTLEMENTS.length);
  });

  test('forking a sample drives the library fork path with the user-suffixed seed', async () => {
    installMatchMedia();
    const onNavigate = vi.fn();
    const FoundingWorlds = await load();
    const { SAMPLE_SETTLEMENTS, forkSeedFor } = await import('../../src/data/sampleSettlements.js');
    const { migrateConfig } = await import('../../src/components/settlements/helpers.js');
    const first = SAMPLE_SETTLEMENTS[0];

    render(<FoundingWorlds onNavigate={onNavigate} />);
    const forkButtons = screen.getAllByRole('button', { name: /Fork this sample/i });
    fireEvent.click(forkButtons[0]);

    // No auth.user in the mock → the seed suffix is 'anon' (forkSeedFor default).
    const seed = forkSeedFor(first, undefined);
    expect(actions.updateConfig).toHaveBeenCalledWith(
      expect.objectContaining({ ...migrateConfig(first.config), seed, _forkedFromSample: first.id }),
    );
    await waitFor(() => expect(actions.generateSettlement).toHaveBeenCalledWith(seed));
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith('generate'));
  });
});
