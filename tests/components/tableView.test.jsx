/** @vitest-environment jsdom */
/**
 * tableView.test.jsx - P142 / D-6 contract over the phone Table View.
 *
 * Pins:
 *   • Renders the settlement name, the tension line, stressor chips, and the
 *     reused "Tonight at the table" cheat-sheet entries.
 *   • Closes via the X button, via Escape, and via backdrop click - but NOT
 *     when the inner card itself is clicked (stopPropagation).
 *
 * TableView is presentational (settlement + onClose props, no store/flag
 * reads), so no mocks are needed - the caller owns the flag/pref gating.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';

import TableView from '../../src/components/TableView.jsx';

const fixture = () => ({
  name: 'Hollowmere',
  tier: 'village',
  population: 320,
  economicState: { prosperity: { tier: 'struggling' } },
  pressureSentence: 'The reeve runs a quiet skim and the harvest is failing.',
  stressors: [{ label: 'Failing harvest' }],
  npcs: [{ name: 'Maren', role: 'Reeve', importance: 'major', secret: 'skims the tithe' }],
  plotHooks: [{ title: 'The Salt Debt', tier: 'A', body: 'A caravan master calls in a favor.' }],
});

describe('TableView', () => {
  let onClose;
  beforeEach(() => { onClose = vi.fn(); });
  afterEach(() => cleanup());

  it('renders name, tension line, stressors, and cheat-sheet entries', () => {
    render(<TableView settlement={fixture()} onClose={onClose} />);
    expect(screen.getByText('Hollowmere')).toBeTruthy();
    expect(screen.getByText('The reeve runs a quiet skim and the harvest is failing.')).toBeTruthy();
    expect(screen.getByText('Failing harvest')).toBeTruthy();
    // Reused tonightAtTheTable entries.
    expect(screen.getByText('Maren')).toBeTruthy();
    expect(screen.getByText('NPC')).toBeTruthy();
    expect(screen.getByText('The Salt Debt')).toBeTruthy();
    expect(screen.getByText('HOOK')).toBeTruthy();
  });

  it('falls back gracefully when there are no entries', () => {
    render(<TableView settlement={{ name: 'Barebones' }} onClose={onClose} />);
    expect(screen.getByText('Barebones')).toBeTruthy();
    expect(screen.getByText(/No table-night entries derived yet/i)).toBeTruthy();
  });

  it('calls onClose when the X button is clicked', () => {
    render(<TableView settlement={fixture()} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close table view'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape', () => {
    render(<TableView settlement={fixture()} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on backdrop click but not on inner-card click', () => {
    render(<TableView settlement={fixture()} onClose={onClose} />);
    // Inner card click is swallowed by stopPropagation.
    fireEvent.click(screen.getByText('Hollowmere'));
    expect(onClose).not.toHaveBeenCalled();
    // Backdrop is the dialog element itself.
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
