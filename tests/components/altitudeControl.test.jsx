/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';

import AltitudeControl, { ALTITUDE_SEGMENTS } from '../../src/components/common/AltitudeControl.jsx';
import { useStore } from '../../src/store/index.js';
import { DEFAULT_DETAIL_LEVEL, DETAIL_LEVELS } from '../../src/store/uiSlice.js';

afterEach(cleanup);

// Reset the persisted pref to the default before each test so they don't bleed.
beforeEach(() => {
  useStore.getState().setDetailLevel(DEFAULT_DETAIL_LEVEL);
});

describe('AltitudeControl — the 3-segment progressive-disclosure control', () => {
  test('renders three segments (Overview / Detail / Engine)', () => {
    const { getAllByRole } = render(<AltitudeControl />);
    const radios = getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(radios.map(r => r.textContent)).toEqual(['Overview', 'Detail', 'Engine']);
  });

  test('the default rung (guided / Overview) is checked', () => {
    const { getByText } = render(<AltitudeControl />);
    expect(getByText('Overview').getAttribute('aria-checked')).toBe('true');
    expect(getByText('Detail').getAttribute('aria-checked')).toBe('false');
  });

  test('clicking a segment writes the pref (and re-checks)', () => {
    const { getByText } = render(<AltitudeControl />);
    fireEvent.click(getByText('Engine'));
    expect(useStore.getState().userPrefs.detailLevel).toBe('expert');
    expect(getByText('Engine').getAttribute('aria-checked')).toBe('true');
    expect(getByText('Overview').getAttribute('aria-checked')).toBe('false');

    fireEvent.click(getByText('Detail'));
    expect(useStore.getState().userPrefs.detailLevel).toBe('standard');
  });

  test('the segment levels map to the three valid detail levels', () => {
    expect(ALTITUDE_SEGMENTS.map(s => s.level)).toEqual(DETAIL_LEVELS);
  });

  test('setDetailLevel rejects an invalid level (cannot wedge the pref)', () => {
    useStore.getState().setDetailLevel('expert');
    // @ts-expect-error — deliberately bad input
    useStore.getState().setDetailLevel('nonsense');
    expect(useStore.getState().userPrefs.detailLevel).toBe('expert');
  });

  test('the control reflects an externally-set pref', () => {
    useStore.getState().setDetailLevel('standard');
    const { getByText } = render(<AltitudeControl />);
    expect(getByText('Detail').getAttribute('aria-checked')).toBe('true');
  });
});
