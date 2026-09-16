/**
 * @vitest-environment jsdom
 *
 * tests/ui/whileYouWereAway.test.jsx — the M10b "while you were away" digest banner
 * (components-dossier-4). Pins the self-gate, the busy → digest → error faces, the
 * quiet-advance fallback, the scope guard, and the dismiss wire.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

afterEach(cleanup);

let storeState = {};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  return { useStore };
});

const { default: WhileYouWereAway } = await import('../../src/components/map/WhileYouWereAway.jsx');

function setStore(over) {
  storeState = { activeCampaignId: 'camp-1', dismissLivingCatchUp: vi.fn(), livingCatchUp: null, ...over };
  return storeState;
}

describe('WhileYouWereAway digest banner', () => {
  test('self-gates to nothing when there is no digest', () => {
    setStore({ livingCatchUp: null });
    const { queryByTestId } = render(<WhileYouWereAway campaignId="camp-1" />);
    expect(queryByTestId('while-you-were-away')).toBeNull();
  });

  test('self-gates when the digest is for a DIFFERENT campaign (no stale cross-campaign banner)', () => {
    setStore({ livingCatchUp: { campaignId: 'other', weeksCaughtUp: 3, majors: [], error: null } });
    const { queryByTestId } = render(<WhileYouWereAway campaignId="camp-1" />);
    expect(queryByTestId('while-you-were-away')).toBeNull();
  });

  test('renders a busy indicator while the catch-up runs', () => {
    setStore({ livingCatchUp: { campaignId: 'camp-1', status: 'running', weeksCaughtUp: 0 } });
    const { getByTestId } = render(<WhileYouWereAway campaignId="camp-1" />);
    const el = getByTestId('while-you-were-away');
    expect(el.getAttribute('role')).toBe('status');
    expect(el.textContent).toMatch(/catching the realm up/i);
  });

  test('renders the weeks + major beats of a settled catch-up', () => {
    setStore({ livingCatchUp: { campaignId: 'camp-1', weeksCaughtUp: 4, capped: false, majors: ['The War of the Two Rivers ignites'], error: null } });
    const { getByTestId } = render(<WhileYouWereAway campaignId="camp-1" />);
    const el = getByTestId('while-you-were-away');
    expect(el.textContent).toMatch(/while you were away/i);
    expect(el.textContent).toMatch(/4 weeks/);
    expect(el.textContent).toMatch(/The War of the Two Rivers ignites/);
  });

  test('a quiet advance still confirms weeks passed', () => {
    setStore({ livingCatchUp: { campaignId: 'camp-1', weeksCaughtUp: 1, capped: false, majors: [], error: null } });
    const { getByTestId } = render(<WhileYouWereAway campaignId="camp-1" />);
    const el = getByTestId('while-you-were-away');
    expect(el.textContent).toMatch(/1 week/);
    expect(el.textContent).toMatch(/advanced quietly/i);
  });

  test('surfaces a failure — never swallows it', () => {
    setStore({ livingCatchUp: { campaignId: 'camp-1', weeksCaughtUp: 2, capped: false, majors: [], error: 'kernel exploded' } });
    const { getByTestId } = render(<WhileYouWereAway campaignId="camp-1" />);
    const text = getByTestId('while-you-were-away').textContent;
    // C2 (misc): the register sentence and the raw diagnostic are now SEPARATE —
    // the sentence stays in the world's voice, the detail is still never swallowed.
    expect(text).toMatch(/stopped early/i);
    expect(text).toMatch(/kernel exploded/);
    expect(text).not.toMatch(/stopped early[^.]*kernel exploded/i); // never spliced mid-sentence
  });

  test('notes when the catch-up was capped — and tells the TRUTH about the cap', () => {
    setStore({ livingCatchUp: { campaignId: 'camp-1', weeksCaughtUp: 26, capped: true, majors: [], error: null } });
    const text = render(<WhileYouWereAway campaignId="camp-1" />).getByTestId('while-you-were-away').textContent;
    expect(text).toMatch(/more time had passed/i);
    // C3 finding 11: past the cap the realm lives the FIRST capped weeks and the
    // remainder is skipped for good (owner ruling: calendar-advances-past-cap).
    expect(text).toMatch(/lived the first 26 weeks/i);
    // The old misleading halves must stay out: the weeks shown are not the most
    // recent, and the skipped span cannot be run later.
    expect(text).not.toMatch(/most recent/i);
    expect(text).not.toMatch(/run the rest/i);
  });

  test('the dismiss button clears the digest', () => {
    const store = setStore({ livingCatchUp: { campaignId: 'camp-1', weeksCaughtUp: 3, capped: false, majors: [], error: null } });
    const { getByLabelText } = render(<WhileYouWereAway campaignId="camp-1" />);
    fireEvent.click(getByLabelText('Dismiss the catch-up summary'));
    expect(store.dismissLivingCatchUp).toHaveBeenCalledTimes(1);
  });
});
