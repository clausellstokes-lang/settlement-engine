/** @vitest-environment jsdom */
/**
 * STYLE-2 SW-12 (ledger D·8, 2026-11-09): the Chronicler's Letter names the window it
 * covers in the realm's calendar, to the week — never "tick {n} → {m}".
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector({ markCampaignLettersRead: () => {} }),
}));

import ChroniclersLetterPanel from '../../src/components/map/ChroniclersLetterPanel.jsx';

afterEach(cleanup);

describe('ChroniclersLetterPanel — the span header in the reader\'s words', () => {
  test('the window reads as two calendar weeks', () => {
    const campaign = { id: 'c1', lastReadTick: 2, wizardNews: { currentTick: 6, entries: [] }, worldState: {} };
    render(<ChroniclersLetterPanel campaign={campaign} />);
    expect(screen.getByText('week 3 of spring, year 1 to week 7 of spring, year 1')).toBeTruthy();
    expect(screen.queryByText(/tick \d+ →/)).toBeNull();
  });
});
