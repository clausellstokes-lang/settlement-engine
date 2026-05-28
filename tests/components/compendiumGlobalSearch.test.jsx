/** @vitest-environment jsdom */
/**
 * compendiumGlobalSearch.test.jsx — contract over P139 / CP-4 UI.
 *
 * Pins:
 *   • Hidden when the flag is off (pure additive drop-in).
 *   • Renders the search box when enabled.
 *   • Typing surfaces cross-tab results from the real search index.
 *   • Clicking a result fires onSelect(entry) + COMPENDIUM_SEARCH analytics.
 *   • Empty state shown when nothing matches.
 *
 * flags + analytics are mocked; the pure search index runs for real so
 * the test doubles as an integration check of the index wiring.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

const flagMock = vi.fn(() => true);
vi.mock('../../src/lib/flags.js', () => ({ flag: (...a) => flagMock(...a) }));

const trackSpy = vi.fn();
vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { track: (...a) => trackSpy(...a) },
  EVENTS: { COMPENDIUM_SEARCH: 'compendium_search' },
}));

import CompendiumGlobalSearch from '../../src/components/compendium/CompendiumGlobalSearch.jsx';

const LABEL = 'Search the whole Compendium';

describe('CompendiumGlobalSearch', () => {
  beforeEach(() => {
    flagMock.mockReturnValue(true);
    trackSpy.mockClear();
  });
  afterEach(() => cleanup());

  it('renders nothing when the flag is off', () => {
    flagMock.mockReturnValue(false);
    const { container } = render(<CompendiumGlobalSearch onSelect={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the search input when enabled', () => {
    render(<CompendiumGlobalSearch onSelect={() => {}} />);
    expect(screen.getByLabelText(LABEL)).toBeTruthy();
  });

  it('surfaces cross-tab results as the user types', () => {
    render(<CompendiumGlobalSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByLabelText(LABEL), { target: { value: 'theocracy' } });
    expect(screen.getByText('Theocracy')).toBeTruthy();
  });

  it('calls onSelect and fires analytics when a result is clicked', () => {
    const onSelect = vi.fn();
    render(<CompendiumGlobalSearch onSelect={onSelect} />);
    fireEvent.change(screen.getByLabelText(LABEL), { target: { value: 'theocracy' } });
    fireEvent.click(screen.getByText('Theocracy'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ term: 'Theocracy', tab: 'power' });
    expect(trackSpy).toHaveBeenCalledWith(
      'compendium_search',
      expect.objectContaining({ term: 'Theocracy', tab: 'power' }),
    );
  });

  it('shows an empty state when nothing matches', () => {
    render(<CompendiumGlobalSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByLabelText(LABEL), { target: { value: 'zzzznomatch' } });
    expect(screen.getByText(/No matches for/)).toBeTruthy();
  });
});
