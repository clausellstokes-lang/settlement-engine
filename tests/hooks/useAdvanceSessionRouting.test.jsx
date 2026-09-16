/** @vitest-environment jsdom */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const harness = vi.hoisted(() => ({
  advanceCampaignWorld: vi.fn(),
  resolveIntervalMajors: vi.fn(),
  undoLastPulse: vi.fn(),
  canonizeCampaignWorld: vi.fn(),
}));

vi.mock('../../src/lib/flags.js', () => ({
  flag: name => name === 'advanceMultiTick',
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(harness),
}));

import { useAdvanceSession } from '../../src/hooks/useAdvanceSession.js';

function setup() {
  const openInspectorAt = vi.fn();
  const showToast = vi.fn();
  const hook = renderHook(() => useAdvanceSession({
    activeCampaignId: 'campaign-1',
    worldPulseInterval: 'one_month',
    openInspectorAt,
    showToast,
  }));
  return { hook, openInspectorAt, showToast };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('advance-to-Herald routing', () => {
  test('a paused initial advance lands on the blocking Decisions address', async () => {
    harness.advanceCampaignWorld.mockResolvedValue({
      status: 'paused',
      ticksDone: 2,
      ticksTotal: 4,
    });
    const { hook, openInspectorAt } = setup();

    await act(async () => {
      await hook.result.current.performAdvanceRealm();
    });

    expect(openInspectorAt.mock.calls.map(([section]) => section)).toEqual([
      'dashboard',
      'adjudication',
    ]);
    expect(hook.result.current.advanceSession.phase).toBe('paused');
  });

  test('a resumed interval that pauses again returns to Decisions', async () => {
    harness.resolveIntervalMajors.mockResolvedValue({
      status: 'paused',
      ticksDone: 3,
      ticksTotal: 4,
    });
    const { hook, openInspectorAt } = setup();

    await act(async () => {
      await hook.result.current.handleResumeAdvance({});
    });

    expect(openInspectorAt.mock.calls.map(([section]) => section)).toEqual([
      'dashboard',
      'adjudication',
    ]);
    expect(hook.result.current.advanceSession.phase).toBe('paused');
  });

  test('a completed advance remains on the changed-results Briefing address', async () => {
    harness.advanceCampaignWorld.mockResolvedValue({
      ok: true,
      autoApplied: [
        { id: 'mechanical-earlier', recordMode: 'state_only' },
        { id: 'suppressed-earlier', recordMode: 'suppression_only' },
        { id: 'public-earlier' },
      ],
      // The final tick happened to be quiet. The toast must count the full
      // interval aggregate while excluding its hidden record-mode lanes.
      pulseRecord: { autoAppliedCount: 0 },
      proposals: [],
    });
    const { hook, openInspectorAt, showToast } = setup();

    await act(async () => {
      await hook.result.current.performAdvanceRealm();
    });

    expect(openInspectorAt).toHaveBeenCalledTimes(1);
    expect(openInspectorAt).toHaveBeenCalledWith('dashboard');
    expect(showToast).toHaveBeenCalledWith(
      'success',
      'Realm advanced: 1 drift, 0 proposal(s)',
    );
    expect(hook.result.current.advanceSession.phase).toBe('idle');
  });
});
