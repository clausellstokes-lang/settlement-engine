/** @vitest-environment jsdom */
/**
 * foundingWorlds.test.jsx — the create-landing sample strip pins.
 *
 * The cards render the Mossgate / Black Crag / Cnocby sample trio (imported
 * from src/data/sampleSettlements.js — the same source the Library empty-state
 * uses), and 'Fork this sample' drives the SAME fork wiring as the Library
 * (SettlementsPanel.forkSample): the sample's config loaded WITHOUT its seed, then
 * generateSettlement(seed) with a user-suffixed seed, then navigate. (Walk W1, owner
 * order 2026-07-21, ledger 13da1e95.) The seed left the config patch on 2026-09-16:
 * a `seed` in the persisted config made the pipeline refuse every later generation
 * in that browser (tests/store/generateStrayConfigSeed.test.js runs the real path).
 *
 * ⚠ AND THE CALL GAINED A SECOND ARGUMENT ON 2026-09-19 (owner ruling, ODQ
 * §934.24(b)): a fork of a curated sample is a CURATED SEED, not a free generation,
 * so it declares `{ intent: 'sampleFork' }` and the generation lane reads that to
 * skip the anonymous daily cap AND to leave the day's allowance unspent. The intent
 * is an ARGUMENT and never a config key — the config is persisted, so an exemption
 * stamped there would outlive the fork that earned it, which is the same shape as
 * the `seed` bug above. The patch assertion below still refuses a `seed`, and now
 * refuses an `intent` beside it.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GENERATION_INTENT_SAMPLE_FORK } from '../../src/lib/generationIntent.js';

const actions = {
  generateSettlement: vi.fn(() => Promise.resolve({ name: 'x', tier: 'town' })),
  updateConfig: vi.fn(),
  auth: { tier: 'premium' },
  lastRefusal: null,
  clearRefusal: vi.fn(),
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(actions); }
  useStore.getState = () => actions;
  return { useStore };
});
// The strip no longer reads the counter at all: the gate lives in the generation
// lane (ODQ §934.24(c) — four surfaces used to hand-roll this check, three of them
// answering a refusal by navigating with nothing said). The mock is kept so the
// module graph is unchanged if anything downstream still pulls it in.
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
    const { SAMPLE_SETTLEMENTS, forkConfigFor, forkSeedFor } = await import('../../src/data/sampleSettlements.js');
    const { migrateConfig } = await import('../../src/components/settlements/helpers.js');
    const first = SAMPLE_SETTLEMENTS[0];

    render(<FoundingWorlds onNavigate={onNavigate} />);
    const forkButtons = screen.getAllByRole('button', { name: /Fork this sample/i });
    fireEvent.click(forkButtons[0]);

    // No auth.user in the mock → the seed suffix is 'anon' (forkSeedFor default).
    const seed = forkSeedFor(first, undefined);
    expect(actions.updateConfig).toHaveBeenCalledWith(
      expect.objectContaining({ ...migrateConfig(forkConfigFor(first)), _forkedFromSample: first.id }),
    );
    // The seed is the generation ARGUMENT and never rides the config patch.
    const patch = actions.updateConfig.mock.calls.at(-1)[0];
    expect(Object.hasOwn(patch, 'seed')).toBe(false);
    expect(Object.hasOwn(patch, 'intent'), 'the intent rode the PERSISTED config').toBe(false);
    await waitFor(() => expect(actions.generateSettlement)
      .toHaveBeenCalledWith(seed, { intent: GENERATION_INTENT_SAMPLE_FORK }));
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith('generate'));
  });
});
