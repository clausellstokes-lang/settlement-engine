/**
 * @vitest-environment jsdom
 *
 * useCampaignAdvance.test.jsx — experience-product-fit-2: the Library "Advance
 * Time" refusal surface. A typed refusal must map to plain GM text (never a silent
 * no-op); a PAUSED advance is a navigation, not an error; a clean advance navigates
 * to the Realm.
 */

import { describe, test, expect, vi, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';

import { useCampaignAdvance, ADVANCE_REFUSAL_TEXT } from '../../src/components/settlements/useCampaignAdvance.js';
import { ADVANCE_TIME_NAV_TARGET } from '../../src/components/settlements/advanceTimeTarget.js';
import { ADVANCE_ERROR_TEXT } from '../../src/hooks/useRealmInspector.js';

afterEach(cleanup);

function setup(advanceResult) {
  const advanceCampaignWorld = vi.fn(async () => advanceResult);
  const setActiveCampaign = vi.fn();
  const onNavigate = vi.fn();
  const hook = renderHook(() => useCampaignAdvance({ advanceCampaignWorld, setActiveCampaign, onNavigate }));
  return { hook, advanceCampaignWorld, setActiveCampaign, onNavigate };
}

describe('useCampaignAdvance — typed refusals speak', () => {
  test('a clean advance navigates to the Realm and sets no error', async () => {
    const { hook, setActiveCampaign, onNavigate } = setup({ ok: true });
    await act(async () => { await hook.result.current.handleAdvanceCampaignTime('c1'); });
    expect(setActiveCampaign).toHaveBeenCalledWith('c1');
    expect(onNavigate).toHaveBeenCalledWith(ADVANCE_TIME_NAV_TARGET.view);
    expect(hook.result.current.advanceError).toBe(null);
  });

  test('the Library twin ADVANCE_REFUSAL_TEXT stays identical to the map source ADVANCE_ERROR_TEXT', () => {
    // Deliberately duplicated to keep the Library route off the map's useRealmInspector
    // chunk (zero eager bytes) — this pin catches drift between the twins.
    expect(ADVANCE_REFUSAL_TEXT).toEqual(ADVANCE_ERROR_TEXT);
  });

  test('a world_frozen refusal shows its plain-language message and does NOT navigate', async () => {
    const { hook, setActiveCampaign, onNavigate } = setup({ ok: false, reason: 'world_frozen' });
    await act(async () => { await hook.result.current.handleAdvanceCampaignTime('c1'); });
    expect(hook.result.current.advanceError).toBe(ADVANCE_REFUSAL_TEXT.world_frozen);
    expect(setActiveCampaign).not.toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();
  });

  test('advance_paused is a navigation (park a decision), not an error', async () => {
    const { hook, setActiveCampaign, onNavigate } = setup({ ok: false, reason: 'advance_paused' });
    await act(async () => { await hook.result.current.handleAdvanceCampaignTime('c1'); });
    expect(hook.result.current.advanceError).toBe(null);
    expect(setActiveCampaign).toHaveBeenCalledWith('c1');
    expect(onNavigate).toHaveBeenCalledWith(ADVANCE_TIME_NAV_TARGET.view);
  });

  test('an unmapped reason falls back to a generic message (never silent)', async () => {
    const { hook, onNavigate } = setup({ ok: false, reason: 'not_entitled' });
    await act(async () => { await hook.result.current.handleAdvanceCampaignTime('c1'); });
    expect(hook.result.current.advanceError).toBeTruthy();
    expect(onNavigate).not.toHaveBeenCalled();
  });
});
