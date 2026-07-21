/** @vitest-environment jsdom */
/**
 * tests/components/timelapsePanel.test.jsx — V-3 TimelapsePanel lifecycle pins (SB2).
 *
 * The shared `timelapseTick` is driven by TWO surfaces: this panel (mount ⇒
 * latest tick; scrub ⇒ any tick) and the town map's "Show the years" toggle
 * (SettlementMapEditControls — tick = the live week). The panel's unmount used to
 * write a blanket null, silently discarding the town toggle's selection. Pins:
 * unmount RESTORES the pre-mount tick — null when none (live view returns
 * exactly), the toggle's week when one stood.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

const setTimelapseTick = vi.fn((t) => { STORE.timelapseTick = t; });
let STORE = { timelapseTick: null, setTimelapseTick };
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(STORE) }));

import TimelapsePanel from '../../src/components/map/TimelapsePanel.jsx';

beforeEach(() => { setTimelapseTick.mockClear(); });
afterEach(() => { cleanup(); });

const campaign = {
  name: 'The Reach',
  worldState: {
    pulseHistory: [
      { tick: 4, selectedOutcomes: [], impactDigest: [] },
      { tick: 8, selectedOutcomes: [], impactDigest: [] },
    ],
  },
};

describe('TimelapsePanel — the shared tick survives a visit', () => {
  test('mount activates at the latest tick; unmount returns to live (null pre-mount)', () => {
    STORE = { timelapseTick: null, setTimelapseTick };
    const { unmount } = render(<TimelapsePanel campaign={campaign} />);
    expect(setTimelapseTick).toHaveBeenCalledWith(8);
    unmount();
    expect(setTimelapseTick).toHaveBeenLastCalledWith(null);
  });

  test('unmount RESTORES a pre-mount tick (the town "Show the years" selection survives)', () => {
    // The town toggle set the shared tick to its live week (30) before the DM
    // opened the Timelapse section.
    STORE = { timelapseTick: 30, setTimelapseTick };
    const { unmount } = render(<TimelapsePanel campaign={campaign} />);
    expect(setTimelapseTick).toHaveBeenCalledWith(8); // the panel still activates
    unmount();
    // The old blanket null discarded the toggle; the fix restores its week.
    expect(setTimelapseTick).toHaveBeenLastCalledWith(30);
  });

  test('an empty history renders the empty state and never writes the tick on mount', () => {
    STORE = { timelapseTick: null, setTimelapseTick };
    const { getByTestId } = render(<TimelapsePanel campaign={{ name: 'Fresh', worldState: {} }} />);
    expect(getByTestId('timelapse-empty')).toBeTruthy();
    expect(setTimelapseTick).not.toHaveBeenCalledWith(expect.any(Number));
  });
});
