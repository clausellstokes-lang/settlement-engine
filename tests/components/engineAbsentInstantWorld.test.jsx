/**
 * @vitest-environment jsdom
 */
/**
 * engineAbsentInstantWorld.test.jsx — instant world in a build that carries no engine
 * (ENGINE-5 unit 2, path b).
 *
 * `composeInstantWorld` is synchronous by design and runs the whole pipeline per member, so a
 * VITE_ENGINE_REMOTE build cannot build a realm or rebuild a shared one. The realm builder's
 * Generate control is the launch teaser for a non-staff viewer and says the path's one plain
 * sentence to staff, composing nothing either way; the shared world's page says it too (the
 * teaser's words for non-staff, the failure heading for staff) and never loads the composer.
 * Never a crash, never a blank.
 */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { storeRef, composer } = vi.hoisted(() => ({ storeRef: { current: {} }, composer: { loads: 0 } }));
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeRef.current); }
  useStore.getState = () => storeRef.current;
  return { useStore };
});
vi.mock('../../src/lib/instantWorld/composeInstantWorld.js', () => {
  composer.loads += 1;
  return {
    loadGenerationLawPayloads: async () => {},
    composeInstantWorld: () => { throw Object.assign(new Error('no engine'), { code: 'engine_local_absent' }); },
  };
});

import InstantWorldEntry from '../../src/components/instant/InstantWorldEntry.jsx';
import WorldPage from '../../src/components/WorldPage.jsx';
import { encodeWorldCode } from '../../src/lib/worldCode.js';
import { AVAILABLE_AT_LAUNCH } from '../../src/components/primitives/AvailableAtLaunchPill.jsx';
import { INSTANT_WORLD_ABSENT } from '../../src/lib/engineAbsentPaths.js';

afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

function mountEntry({ staff }) {
  const instantWorld = vi.fn().mockResolvedValue({ ok: true });
  storeRef.current = {
    auth: { tier: 'premium' },
    isElevated: () => staff,
    instantWorld,
    instantWorldBusy: false,
    setPurchaseModalOpen: vi.fn(),
    setActivePricingMoment: vi.fn(),
    displayPrefs: { realmMagicChoice: 'yes' },
    setRealmMagicChoice: vi.fn(),
  };
  render(<InstantWorldEntry />);
  fireEvent.click(screen.getByTestId('instant-world-open'));
  return { instantWorld };
}

describe('the realm builder in a build without an engine', () => {
  it('non-staff: Generate is the launch teaser; its click opens the dialog with the path sentence and composes nothing', async () => {
    vi.stubEnv('VITE_ENGINE_REMOTE', 'true');
    const { instantWorld } = mountEntry({ staff: false });
    const cta = screen.getByTestId('instant-world-generate');
    expect(cta.getAttribute('data-launch-gated')).toBe('');
    fireEvent.click(cta);
    const dialog = await screen.findByRole('dialog');
    expect(dialog.textContent).toContain(AVAILABLE_AT_LAUNCH);
    expect(dialog.textContent).toContain(INSTANT_WORLD_ABSENT);
    expect(screen.queryByRole('dialog', { name: 'Does magic exist in these lands?' })).toBeNull();
    expect(instantWorld).not.toHaveBeenCalled();
  });

  it('staff: Generate says the path sentence and composes nothing', () => {
    vi.stubEnv('VITE_ENGINE_REMOTE', 'true');
    const { instantWorld } = mountEntry({ staff: true });
    const cta = screen.getByTestId('instant-world-generate');
    expect(cta.hasAttribute('data-launch-gated')).toBe(false);
    fireEvent.click(cta);
    expect(screen.getByRole('alert').textContent).toBe(INSTANT_WORLD_ABSENT);
    expect(screen.queryByRole('dialog', { name: 'Does magic exist in these lands?' })).toBeNull();
    expect(instantWorld).not.toHaveBeenCalled();
  });

  it('flag off: Generate asks the magic question as before', () => {
    mountEntry({ staff: false });
    const cta = screen.getByTestId('instant-world-generate');
    expect(cta.hasAttribute('data-launch-gated')).toBe(false);
    fireEvent.click(cta);
    expect(screen.getByRole('dialog', { name: 'Does magic exist in these lands?' })).toBeTruthy();
  });
});

describe('a shared world\'s page in a build without an engine', () => {
  const code = encodeWorldCode({ seed: 'engine5-shared', basicConfig: { realmSize: 'small' } });

  it('non-staff: the teaser\'s words and the path sentence; the composer is never loaded', async () => {
    vi.stubEnv('VITE_ENGINE_REMOTE', 'true');
    storeRef.current = { isElevated: () => false };
    const before = composer.loads;
    render(<WorldPage code={code} />);
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(AVAILABLE_AT_LAUNCH));
    expect(screen.getByText(INSTANT_WORLD_ABSENT)).toBeTruthy();
    expect(composer.loads).toBe(before);
  });

  it('staff: the failure heading and the path sentence', async () => {
    vi.stubEnv('VITE_ENGINE_REMOTE', 'true');
    storeRef.current = { isElevated: () => true };
    render(<WorldPage code={code} />);
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 }).textContent).toBe("The world couldn't be rebuilt."));
    expect(screen.getByText(INSTANT_WORLD_ABSENT)).toBeTruthy();
  });
});
