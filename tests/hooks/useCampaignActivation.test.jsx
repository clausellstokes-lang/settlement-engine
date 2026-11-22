/** @vitest-environment jsdom */
/**
 * useCampaignActivation.test.jsx — the Realm empty state's activation handlers.
 *
 * THE DEFECT (2026-09-18): `onCreateCampaign` asked the store to mint a campaign
 * and, when the store refused because campaigns are Cartographer's, ENDED in a
 * toast — "Upgrade to Cartographer to create campaigns." — that named an upgrade
 * and offered no way to reach one. The desktop Realm's palette put that button in
 * front of exactly the viewers the store would refuse.
 *
 * The palette no longer offers the button to a non-entitled viewer (it renders
 * the locked gate instead), so this is now the defensive second line: whatever
 * surface reaches the refusal, the click lands somewhere. The toast still speaks,
 * because a route change on its own is silent about WHY the page moved.
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const storeState = { createCampaign: vi.fn() };
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeState);
  useStore.getState = () => storeState;
  return { useStore };
});

import { useCampaignActivation } from '../../src/hooks/useCampaignActivation.js';

function setup({ activeCampaigns = [] } = {}) {
  const handleSelectCampaign = vi.fn();
  const showToast = vi.fn();
  const onNavigate = vi.fn();
  const { result } = renderHook(() => useCampaignActivation({
    activeCampaigns, handleSelectCampaign, showToast, onNavigate,
  }));
  return { result, handleSelectCampaign, showToast, onNavigate };
}

beforeEach(() => {
  storeState.createCampaign = vi.fn();
});

describe('useCampaignActivation', () => {
  test('a refused create routes to pricing instead of dead-ending in a toast', () => {
    storeState.createCampaign.mockReturnValue(null);
    const { result, handleSelectCampaign, showToast, onNavigate } = setup();

    act(() => result.current.onCreateCampaign());

    expect(onNavigate).toHaveBeenCalledWith('pricing');
    expect(showToast).toHaveBeenCalledWith('info', expect.stringMatching(/Cartographer/));
    // The refusal never selects a campaign that was not made.
    expect(handleSelectCampaign).not.toHaveBeenCalled();
    const [, text] = showToast.mock.calls[0];
    // anchored: the assertion above proves this same toast names Cartographer, so the absent "Upgrade to" opening is a rewritten line rather than a toast that never fired
    expect(text).not.toMatch(/^Upgrade to/);
  });

  test('a successful create selects the new campaign and routes nowhere', () => {
    storeState.createCampaign.mockReturnValue('camp-9');
    const { result, handleSelectCampaign, showToast, onNavigate } = setup();

    act(() => result.current.onCreateCampaign());

    expect(handleSelectCampaign).toHaveBeenCalledWith('camp-9');
    expect(showToast).toHaveBeenCalledWith('success', expect.stringMatching(/Campaign created/));
    // anchored: the select above proves the success path ran, so the absent
    // navigation is the entitled path staying put rather than an inert hook.
    expect(onNavigate).not.toHaveBeenCalled();
  });

  test('onSelectCampaign activates the first selectable campaign', () => {
    const { result, handleSelectCampaign } = setup({ activeCampaigns: [{ id: 'a' }, { id: 'b' }] });
    act(() => result.current.onSelectCampaign());
    expect(handleSelectCampaign).toHaveBeenCalledWith('a');
    expect(result.current.hasCampaigns).toBe(true);
  });
});
