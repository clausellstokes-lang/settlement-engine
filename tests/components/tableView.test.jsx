/** @vitest-environment jsdom */
/**
 * tableView.test.jsx — P142 / D-6 contract over the phone Table View.
 *
 * Pins:
 *   • Renders the settlement name and the one Tonight sheet (X-51): the crisis or the
 *     pressure line, the people, the facts and the hooks, all from the record.
 *   • Closes via the X button, via Escape (the shared focus trap), and via a
 *     backdrop mousedown — but NOT when the inner card is interacted with. The
 *     backdrop is a role="presentation" scrim that dismisses only on a mousedown
 *     of the scrim itself (currentTarget); role="dialog" sits on the panel and
 *     is focus-trapped by useDialogFocusTrap (M12).
 *
 * TableView is presentational (settlement + onClose props, no store/flag
 * reads), so no mocks are needed — the caller owns the flag/pref gating.
 */

import { CRISIS_SUMMARY_VANTAGES } from '../../src/domain/crisis/crisisSummaryVantage.js';
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
  // Real generator shapes: NPC secret is an object; plot hooks come from the
  // collectPlotHooks sources (here, a conflict), not a phantom settlement.plotHooks.
  npcs: [{ name: 'Maren', role: 'Reeve', power: 9, secret: { what: 'skims the tithe' } }],
  conflicts: [{ parties: ['The Salt Debt'], intensity: 'high', plotHooks: ['A caravan master calls in a favor.'] }],
});

describe('TableView', () => {
  let onClose;
  beforeEach(() => { onClose = vi.fn(); });
  afterEach(() => cleanup());

  it('renders the one Tonight sheet: the pressure line with no crisis, the person and the hook from the record', () => {
    render(<TableView settlement={fixture()} onClose={onClose} />);
    expect(screen.getByText('Hollowmere')).toBeTruthy();
    // X-51: with no active crisis the sheet opens on the record's pressure sentence.
    expect(screen.getByText('The reeve runs a quiet skim and the harvest is failing.')).toBeTruthy();
    expect(screen.getByText('A caravan master calls in a favor.')).toBeTruthy();
    expect(document.querySelectorAll('[data-tonight-sheet]').length).toBe(1);
  });

  it('opens on the active crisis when the record carries one', () => {
    render(<TableView settlement={{ ...fixture(), stress: [{ type: 'famine', label: 'Famine' }] }} onClose={onClose} />);
    // W4 PEOPLE second seat (#29, WAVE-RULINGS item 2): Tonight prints the crisis from the OFFICIAL vantage,
    // `<type>. <line>`, read from the vantage table so a re-wording moves the pin with it.
    const official = CRISIS_SUMMARY_VANTAGES.famine.official.replace(/\{name\}/g, 'Hollowmere');
    expect(screen.getByText(`Famine. ${official}`)).toBeTruthy();
  });

  it('a bare record renders the sheet with nothing invented', () => {
    render(<TableView settlement={{ name: 'Barebones' }} onClose={onClose} />);
    expect(screen.getByText('Barebones')).toBeTruthy();
    const sheet = document.querySelector('[data-tonight-sheet]');
    expect(sheet.textContent).toBe('What the players test firstDefence No walls and no standing force.');
  });

  it('calls onClose when the X button is clicked', () => {
    render(<TableView settlement={fixture()} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close Tonight'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape', () => {
    render(<TableView settlement={fixture()} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on a backdrop mousedown but not on inner-card interaction', () => {
    render(<TableView settlement={fixture()} onClose={onClose} />);
    // A mousedown inside the panel bubbles to the backdrop, but its target is
    // not the scrim itself (currentTarget), so it does not dismiss.
    fireEvent.mouseDown(screen.getByText('Hollowmere'));
    expect(onClose).not.toHaveBeenCalled();
    // The presentational scrim is the dialog panel's parent; a mousedown on the
    // scrim itself dismisses.
    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.mouseDown(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
