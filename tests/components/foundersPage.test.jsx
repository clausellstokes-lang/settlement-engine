/** @vitest-environment jsdom */
/**
 * foundersPage.test.jsx — the /founders seat-lineage page renders its dignified
 * all-unclaimed pre-launch state with NO backend (THE FOUNDER LANE).
 *
 * With no Supabase configured, the lineage read fails closed to []; the page must
 * still render all 30 seats as Open (the offer IS the content pre-launch) and leak
 * no holder identity.
 */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import FoundersPage from '../../src/components/founders/FoundersPage.jsx';
import { FOUNDER_SEAT_CAP } from '../../src/lib/founderSeats.js';

afterEach(cleanup);

describe('FoundersPage — all-unclaimed pre-launch state', () => {
  test('renders every one of the 30 seats as Open with no backend', () => {
    const { getAllByText, queryByText } = render(<FoundersPage onNavigate={() => {}} />);
    // One "Seat NN" mark per seat.
    const marks = getAllByText(/^Seat \d\d$/);
    expect(marks).toHaveLength(FOUNDER_SEAT_CAP);
    // Every seat reads "Open"; none is held.
    expect(getAllByText('Open')).toHaveLength(FOUNDER_SEAT_CAP);
    // The status line reflects an all-open lineage, not a claimed count.
    expect(queryByText(new RegExp(`All ${FOUNDER_SEAT_CAP} seats are open`))).not.toBeNull();
    expect(queryByText(/seats claimed/)).toBeNull();
  });

  test('leaks no holder identity in the all-unclaimed state', () => {
    const { queryByText } = render(<FoundersPage onNavigate={() => {}} />);
    // No held-since line and no "see their worlds" link when nothing is claimed.
    expect(queryByText(/Held since/)).toBeNull();
    expect(queryByText(/See their worlds/)).toBeNull();
    expect(queryByText(/Lineage:/)).toBeNull();
  });

  test('offers the conviction CTA and a pointer to the license terms', () => {
    const { queryByText } = render(<FoundersPage onNavigate={() => {}} />);
    expect(queryByText('Claim a Founder seat')).not.toBeNull();
    expect(queryByText(/license & transfer terms/i)).not.toBeNull();
  });
});
