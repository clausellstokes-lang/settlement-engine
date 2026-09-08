/** @vitest-environment jsdom */
/**
 * tests/components/gatheredAdjudication.test.jsx — THE GATHERED ADJUDICATION
 * SCREEN + the Herald's one-line pointer (realm directive 7 / J-D7, wave F).
 *
 * WHAT IS PINNED, and why each pin exists:
 *
 *   1. GATHERED, NEVER CHAINED — a saturated tick's several majors render as
 *      several rows inside ONE dialog, and ruling one row does NOT close or
 *      re-mount the surface. The failure this prevents is the modal conga line
 *      the directive names by hand ("never a sequential modal chain").
 *   2. ONE VOCABULARY — accept and refuse call the EXISTING proposal verbs with
 *      the existing arguments. A fork here would give the realm two adjudication
 *      paths with two receipts.
 *   3. NOTHING DROPS ON DISMISSAL — closing the screen calls onClose and writes
 *      NOTHING through either proposal writer, which is the whole mechanism by
 *      which a dismissed matter survives.
 *   4. ACCESSIBILITY — a real modal (role/aria-modal/labelled), focus moved
 *      inside on open, Escape closes, and every verdict reachable and operable
 *      from the keyboard alone.
 *   5. THE POINTER CANNOT LIE — the Herald's adjudication door states the count
 *      the screen would list, carries no per-item work surface, and its door
 *      re-opens the screen.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

const store = vi.hoisted(() => ({
  applyWorldPulseProposal: vi.fn(),
  dismissWorldPulseProposal: vi.fn(),
  canonizeCampaignWorld: vi.fn(),
  resolveIntervalMajors: vi.fn(),
  savedSettlements: [],
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(store),
}));

// The Herald's realm-verb composer is a separate door with its own store reads;
// stub it so the pointer pins measure THIS door's own structure.
vi.mock('../../src/components/map/RealmVerbComposer.jsx', () => ({
  default: () => <div data-testid="realm-verb-composer" />,
}));

import GatheredAdjudication from '../../src/components/map/GatheredAdjudication.jsx';
import HeraldAdjudication from '../../src/components/map/HeraldAdjudication.jsx';

function proposal(id, headline, { tick = 4 } = {}) {
  return {
    id,
    status: 'pending',
    tick,
    createdAt: `2026-01-0${Math.min(9, tick)}T00:00:00.000Z`,
    headline,
    summary: `${headline} summary`,
    severity: 0.84,
    reasons: ['A recorded reason'],
    outcome: { id: `${id}:outcome`, candidateType: 'relationship_label_change' },
  };
}

/** A SATURATED TICK: three campaign-altering matters raised at once. */
const SATURATED = [
  proposal('p-coup', 'The captain seizes the seat', { tick: 2 }),
  proposal('p-war', 'The rivals march', { tick: 4 }),
  proposal('p-schism', 'The temple splits', { tick: 5 }),
];

const campaign = (proposals = SATURATED, tick = 4) => ({
  id: 'campaign-1',
  name: 'The realm',
  worldState: {
    canonizedAt: '2026-01-01T00:00:00.000Z',
    tick,
    proposals,
    simulationRules: {},
    pulseHistory: [],
  },
});

beforeEach(() => {
  store.applyWorldPulseProposal.mockReset().mockResolvedValue({ id: 'ok', status: 'applied' });
  store.dismissWorldPulseProposal.mockReset().mockResolvedValue({ id: 'ok', status: 'dismissed' });
  store.savedSettlements = [];
});

afterEach(cleanup);

describe('GATHERED, never a chain', () => {
  test('a saturated tick renders every matter as a row inside ONE surface', () => {
    render(<GatheredAdjudication open campaign={campaign()} sinceTick={1} onClose={vi.fn()} />);

    const dialogs = screen.getAllByRole('dialog');
    expect(dialogs).toHaveLength(1);
    const rows = screen.getAllByTestId('gathered-decision-row');
    expect(rows).toHaveLength(3);
    for (const row of rows) expect(dialogs[0].contains(row)).toBe(true);
    // Every headline is readable at once — no "next" step, no per-item modal.
    for (const p of SATURATED) expect(within(dialogs[0]).getByText(p.headline)).toBeTruthy();
  });

  test('rows are OLDEST FIRST and mark what was already waiting', () => {
    render(<GatheredAdjudication open campaign={campaign()} sinceTick={3} onClose={vi.fn()} />);
    const rows = screen.getAllByTestId('gathered-decision-row');
    expect(rows.map(r => r.getAttribute('data-held'))).toEqual(['true', 'false', 'false']);
    expect(within(rows[0]).getByText(/Still waiting from an earlier advance/)).toBeTruthy();
    expect(within(rows[1]).getByText(/Raised this advance/)).toBeTruthy();
  });

  test('ruling ONE row leaves the gathered surface standing (never a chain)', async () => {
    render(<GatheredAdjudication open campaign={campaign()} sinceTick={1} onClose={vi.fn()} />);
    const surfaceBefore = screen.getByTestId('gathered-adjudication');

    fireEvent.click(screen.getAllByTitle('Let this stand')[0]);
    await waitFor(() => expect(store.applyWorldPulseProposal).toHaveBeenCalledTimes(1));

    // The SAME DOM node is still mounted, still holding the other two matters.
    expect(screen.getByTestId('gathered-adjudication')).toBe(surfaceBefore);
    expect(screen.getAllByTestId('gathered-decision-row')).toHaveLength(3);
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
  });
});

describe('ONE VOCABULARY — the existing proposal verbs', () => {
  test('accept routes through applyWorldPulseProposal with the row id', async () => {
    render(<GatheredAdjudication open campaign={campaign()} sinceTick={1} onClose={vi.fn()} />);
    fireEvent.click(screen.getAllByTitle('Let this stand')[0]);
    await waitFor(() => expect(store.applyWorldPulseProposal)
      .toHaveBeenCalledWith('campaign-1', 'p-coup'));
    expect(store.dismissWorldPulseProposal).not.toHaveBeenCalled();
  });

  test('refuse routes through dismissWorldPulseProposal with the row id', async () => {
    render(<GatheredAdjudication open campaign={campaign()} sinceTick={1} onClose={vi.fn()} />);
    fireEvent.click(screen.getAllByTitle('Refuse this')[1]);
    await waitFor(() => expect(store.dismissWorldPulseProposal)
      .toHaveBeenCalledWith('campaign-1', 'p-war'));
    expect(store.applyWorldPulseProposal).not.toHaveBeenCalled();
  });

  test('a stale no-op from the writer is reported, never dressed as a verdict', async () => {
    store.applyWorldPulseProposal.mockResolvedValue(null);
    render(<GatheredAdjudication open campaign={campaign()} sinceTick={1} onClose={vi.fn()} />);
    fireEvent.click(screen.getAllByTitle('Let this stand')[0]);
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
  });
});

describe('NOTHING DROPS — dismissal writes nothing', () => {
  test('closing with matters unruled calls onClose and touches neither writer', () => {
    const onClose = vi.fn();
    render(<GatheredAdjudication open campaign={campaign()} sinceTick={1} onClose={onClose} />);

    fireEvent.click(screen.getByText('Set the rest aside'));

    expect(onClose).toHaveBeenCalledTimes(1);
    // The anchor for these two negatives is the assertion above: the exit really
    // was invoked, so "no writer ran" is about the WRITERS, not about a dead click.
    // anchored: onClose was proven called on the line above, so the surface is live.
    expect(store.applyWorldPulseProposal).not.toHaveBeenCalled();
    // anchored: same live-surface proof as the line above.
    expect(store.dismissWorldPulseProposal).not.toHaveBeenCalled();
  });

  test('the exit states the promise the held docket keeps', () => {
    render(<GatheredAdjudication open campaign={campaign()} sinceTick={1} onClose={vi.fn()} />);
    expect(screen.getByTestId('gathered-held-promise').textContent)
      .toContain('Three matters stay on the docket and return when time next moves.');
  });

  test('an empty docket says so and offers a plain close', () => {
    render(<GatheredAdjudication open campaign={campaign([])} sinceTick={1} onClose={vi.fn()} />);
    expect(screen.queryAllByTestId('gathered-decision-row')).toHaveLength(0);
    expect(screen.getByText(/Every matter is settled\. The realm runs on its own/)).toBeTruthy();
    expect(screen.getByTestId('gathered-held-promise').textContent).toBe('Every matter is settled.');
    expect(screen.getByText('Close')).toBeTruthy();
  });
});

describe('ACCESSIBILITY — a real modal, rulable from the keyboard', () => {
  test('it is a labelled modal dialog', () => {
    render(<GatheredAdjudication open campaign={campaign()} sinceTick={1} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const labelId = dialog.getAttribute('aria-labelledby');
    expect(document.getElementById(labelId).textContent).toBe('The realm awaits your judgment');
  });

  test('focus moves INSIDE the dialog when it opens', async () => {
    render(<GatheredAdjudication open campaign={campaign()} sinceTick={1} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  });

  test('Escape closes the screen (the held docket takes the rest)', async () => {
    const onClose = vi.fn();
    render(<GatheredAdjudication open campaign={campaign()} sinceTick={1} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  test('a verdict is reachable and operable with the keyboard alone', async () => {
    render(<GatheredAdjudication open campaign={campaign()} sinceTick={1} onClose={vi.fn()} />);
    const verdict = screen.getAllByTitle('Let this stand')[0];
    verdict.focus();
    expect(document.activeElement).toBe(verdict);
    // A real <button> activates on Enter/Space; jsdom does not synthesize the
    // click, so the contract pinned here is that the control IS a native button
    // in the tab order carrying the handler (not a div with onClick).
    expect(verdict.tagName).toBe('BUTTON');
    expect(verdict.tabIndex).not.toBe(-1);
    fireEvent.click(verdict);
    await waitFor(() => expect(store.applyWorldPulseProposal).toHaveBeenCalled());
  });

  test('open={false} renders nothing at all', () => {
    const { container } = render(
      <GatheredAdjudication open={false} campaign={campaign()} sinceTick={1} onClose={vi.fn()} />,
    );
    expect(container.innerHTML).toBe('');
  });
});

describe('THE HERALD POINTER — a line, not a second desk', () => {
  test('the adjudication door states the count the screen would list', () => {
    render(<HeraldAdjudication campaign={campaign()} />);
    const pointer = screen.getByTestId('adjudication-pointer');
    expect(pointer.textContent).toContain('Three matters await the realm’s judgment.');
  });

  test('the door carries NO per-item work surface', () => {
    render(<HeraldAdjudication campaign={campaign()} />);
    const desk = screen.getByText('Pending Decisions').closest('section');
    // The anchor: the pointer IS rendered inside this very section, so the section
    // is live and correctly found — the absences below are about the CARDS.
    expect(within(desk).getByTestId('adjudication-pointer')).toBeTruthy();
    // anchored: the pointer was just found inside this same section (line above).
    expect(desk.textContent).not.toContain('The captain seizes the seat');
    expect(screen.queryByTitle('Apply proposal')).toBeNull();
    expect(screen.queryByTitle('Dismiss proposal')).toBeNull();
  });

  test('the door re-opens the gathered screen', () => {
    const onOpen = vi.fn();
    render(<HeraldAdjudication campaign={campaign()} onOpenGatheredDocket={onOpen} />);
    fireEvent.click(screen.getByTitle('Open the matters awaiting judgment'));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  test('with no docket the door says the realm runs on its own', () => {
    render(<HeraldAdjudication campaign={campaign([])} />);
    expect(screen.getByTestId('adjudication-pointer').textContent)
      .toContain('No decision awaits you.');
  });

  test('the count is REALM-WIDE, not narrowed by the paper’s focus strip', () => {
    // A focused edition must not shrink the pointer's number below what the
    // gathered screen lists, or the DM is told two matters wait and finds three.
    render(<HeraldAdjudication campaign={campaign()} focusId="nowhere" focusName="Nowhere" />);
    expect(screen.getByTestId('adjudication-pointer').textContent)
      .toContain('Three matters await the realm’s judgment.');
  });
});
