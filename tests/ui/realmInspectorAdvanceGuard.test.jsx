/** @vitest-environment jsdom */
/**
 * tests/ui/realmInspectorAdvanceGuard.test.jsx — advance-guard-ui.
 *
 * The store no-ops updateCampaignSimulationRules while its campaign's advance is in
 * flight (the multi-tick advance replaces worldState wholesale and would clobber the
 * write). So useRealmInspector.handleApplyPreset must REFUSE mid-advance rather than
 * fire a write the store silently drops and then report a false "Applied …" success.
 *
 * The hook subscribes to the advanceInFlight LIST (not the isAdvanceInFlight fn ref)
 * so the block re-renders the instant an advance starts or ends; these tests drive
 * that list through the store mock.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';

afterEach(cleanup);

// Store mock — the hook reads s.advanceInFlight. Tests mutate this to flip the guard.
const storeState = { advanceInFlight: [] };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

import { useRealmInspector } from '../../src/hooks/useRealmInspector.js';

function makeArgs(overrides = {}) {
  return {
    canManageCampaigns: true,
    pendingMapWorkspace: null,
    pendingSimulationRules: false,
    consumeSimulationRules: () => false,
    activeCampaign: { id: 'camp-1' },
    activeCampaignId: 'camp-1',
    consumeMapWorkspace: () => null,
    updateCampaignSimulationRules: vi.fn(() => Promise.resolve({})),
    onNavigate: () => {},
    showToast: vi.fn(),
    ...overrides,
  };
}

function Probe({ args, onHook }) {
  const hook = useRealmInspector(args);
  onHook(hook);
  return null;
}

describe('useRealmInspector — advance guard on the rules edit', () => {
  test('handleApplyPreset refuses (no store write, info toast) while this campaign advances', async () => {
    storeState.advanceInFlight = ['camp-1'];
    const args = makeArgs();
    let hook;
    render(<Probe args={args} onHook={(h) => { hook = h; }} />);

    expect(hook.rulesEditBlocked).toBe(true);

    await act(async () => {
      await hook.handleApplyPreset('quiet_local');
    });

    // The write never goes out (it would be a silent store no-op), and the user gets
    // the "realm is advancing" line instead of a false "Applied …" success.
    expect(args.updateCampaignSimulationRules).not.toHaveBeenCalled();
    expect(args.showToast).toHaveBeenCalledWith('info', expect.stringMatching(/realm is advancing/i));
  });

  test('handleApplyPreset applies normally when no advance is in flight', async () => {
    storeState.advanceInFlight = [];
    const args = makeArgs();
    let hook;
    render(<Probe args={args} onHook={(h) => { hook = h; }} />);

    expect(hook.rulesEditBlocked).toBe(false);

    await act(async () => {
      await hook.handleApplyPreset('quiet_local');
    });

    expect(args.updateCampaignSimulationRules).toHaveBeenCalledTimes(1);
    expect(args.showToast).toHaveBeenCalledWith('success', expect.stringMatching(/preset/i));
  });

  test('is not blocked when a DIFFERENT campaign is advancing', () => {
    storeState.advanceInFlight = ['camp-other'];
    const args = makeArgs();
    let hook;
    render(<Probe args={args} onHook={(h) => { hook = h; }} />);
    expect(hook.rulesEditBlocked).toBe(false);
  });
});
