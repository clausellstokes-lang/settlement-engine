/** @vitest-environment jsdom */
/**
 * tests/ui/worldMapToastStability.test.jsx — UI perf-honesty lane.
 *
 * WorldMap.jsx's WorldMapToolbar is React.memo'd, and its `handleApplyPreset`
 * prop comes from useRealmInspector, which derives it via
 * useCallback([..., showToast]). If `showToast` is recreated every WorldMap
 * render (a plain in-component function), handleApplyPreset gets a new identity
 * every render, and the memo'd toolbar re-renders on every keystroke/tick —
 * defeating the memo. The fix stabilizes showToast with useCallback in
 * WorldMap.jsx.
 *
 * This test pins the invariant the fix relies on, exercising the REAL
 * useRealmInspector hook (not a stand-in):
 *   • a STABLE showToast (the fixed shape) → a STABLE handleApplyPreset across
 *     re-renders → a memo'd consumer of that prop does NOT re-render;
 *   • an UNSTABLE showToast (the bug shape) → handleApplyPreset changes identity
 *     → the memo'd consumer DOES re-render.
 * The contrast proves the test is not theater: it fails if showToast stability
 * stops mattering.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { memo, useCallback, useRef, useState } from 'react';

import { useRealmInspector } from '../../src/hooks/useRealmInspector.js';

afterEach(cleanup);

// A memo'd leaf that records how many times it actually rendered, keyed only on
// the handleApplyPreset prop — exactly the toolbar's situation.
let presetConsumerRenders = 0;
const PresetConsumer = memo(function PresetConsumer({ handleApplyPreset }) {
  presetConsumerRenders += 1;
  // Touch the prop so it isn't tree-shaken / lint-removed.
  return <div data-testid="preset-consumer" data-has-handler={typeof handleApplyPreset === 'function'} />;
});

// Common inert deps for useRealmInspector. canManageCampaigns=true so the
// one-shot locked-preview effect doesn't open the inspector and churn state.
const baseArgs = {
  canManageCampaigns: true,
  pendingMapWorkspace: null,
  activeCampaign: null,
  activeCampaignId: 'camp-1',
  consumeMapWorkspace: () => null,
  updateCampaignSimulationRules: () => Promise.resolve(),
  onNavigate: () => {},
};

describe('WorldMap toast stability → memo holds', () => {
  test('a STABLE showToast keeps handleApplyPreset stable; the memo consumer does not re-render', () => {
    presetConsumerRenders = 0;
    let forceRerender;

    function Host() {
      const [, setTick] = useState(0);
      forceRerender = () => setTick(t => t + 1);
      // Stable showToast — the FIXED WorldMap shape (useCallback, empty deps).
      const showToast = useCallback(() => {}, []);
      const { handleApplyPreset } = useRealmInspector({ ...baseArgs, showToast });
      return <PresetConsumer handleApplyPreset={handleApplyPreset} />;
    }

    render(<Host />);
    const initial = presetConsumerRenders;
    expect(initial).toBeGreaterThan(0);

    // A parent re-render unrelated to the toolbar (the keystroke/tick case).
    act(() => { forceRerender(); });
    act(() => { forceRerender(); });

    // The memo held: no extra renders of the preset consumer.
    expect(presetConsumerRenders).toBe(initial);
  });

  test('an UNSTABLE showToast changes handleApplyPreset identity; the memo consumer re-renders (the bug)', () => {
    presetConsumerRenders = 0;
    let forceRerender;

    function Host() {
      const [, setTick] = useState(0);
      forceRerender = () => setTick(t => t + 1);
      // Unstable showToast — a NEW function every render (the pre-fix shape).
      const toastRef = useRef(null);
      const showToast = () => { toastRef.current = Date.now(); };
      const { handleApplyPreset } = useRealmInspector({ ...baseArgs, showToast });
      return <PresetConsumer handleApplyPreset={handleApplyPreset} />;
    }

    render(<Host />);
    const initial = presetConsumerRenders;

    act(() => { forceRerender(); });

    // The memo was defeated: the consumer re-rendered because the prop changed.
    expect(presetConsumerRenders).toBeGreaterThan(initial);
  });
});
