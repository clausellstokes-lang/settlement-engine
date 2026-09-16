/** @vitest-environment jsdom */
/**
 * tests/components/chronicleScrollback.test.jsx — UX Phase 5 Chronicle scrollback.
 *
 * Pins: multiple ticks render, scrubbing selects a tick, the per-tick
 * compareCausalState diff shows for that tick, clicking a headline highlights the
 * affected node, and a fresh campaign self-gates to the empty state.
 */
import { afterEach, describe, expect, test, vi, beforeEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

const setSelectedSettlementId = vi.fn();
let STORE = { setSelectedSettlementId };
vi.mock('../../src/store/index.js', () => ({ useStore: selector => selector(STORE) }));

import ChronicleScrollback from '../../src/components/map/ChronicleScrollback.jsx';

beforeEach(() => { setSelectedSettlementId.mockClear(); });
afterEach(() => { cleanup(); });

const campaign = {
  id: 'c1',
  name: 'The Reach',
  chronicles: [
    { id: 'ch7', tick: 7, prose: 'The siege of Bram broke at last.' },
  ],
  worldState: {
    pulseHistory: [
      {
        tick: 5,
        selectedOutcomes: [
          { id: 'o5', headline: 'Ashford marches on Bram', summary: 'An army deploys.', targetSaveId: 'b', severity: 0.6 },
        ],
        impactDigest: [],
      },
      {
        tick: 7,
        selectedOutcomes: [
          { id: 'o7', headline: 'Bram falls', summary: 'The walls broke.', targetSaveId: 'b', severity: 0.8 },
        ],
        impactDigest: [],
      },
    ],
  },
};

const nameFor = (id) => ({ a: 'Ashford', b: 'Bram' }[String(id)] || String(id));

describe('ChronicleScrollback — empty self-gating', () => {
  test('renders the empty state for a fresh campaign', () => {
    STORE = { setSelectedSettlementId };
    render(<ChronicleScrollback campaign={{ id: 'fresh', worldState: {} }} nameFor={nameFor} />);
    expect(screen.getByTestId('chronicle-scrollback-empty')).toBeTruthy();
    expect(screen.queryByTestId('chronicle-scrollback')).toBeNull();
  });
});

describe('ChronicleScrollback — scrubbable timeline', () => {
  test('renders multiple ticks and defaults to the newest', () => {
    STORE = { setSelectedSettlementId };
    render(<ChronicleScrollback campaign={campaign} nameFor={nameFor} />);
    expect(screen.getByTestId('chronicle-scrollback')).toBeTruthy();
    // The newest entry is selected by default — its prose + headline show.
    expect(screen.getAllByText('week 8 of spring, year 1').length).toBeGreaterThan(0);
    expect(screen.getByText(/The siege of Bram broke/)).toBeTruthy();
    expect(screen.getByText('Bram falls')).toBeTruthy();
    // The older tick (5) is on the rail but not the selected body.
    expect(screen.queryByText('Ashford marches on Bram')).toBeNull();
  });

  test('scrubbing to an older tick selects it', () => {
    STORE = { setSelectedSettlementId };
    render(<ChronicleScrollback campaign={campaign} nameFor={nameFor} />);
    // Click the older entry's calendar-labelled rail button.
    fireEvent.click(screen.getByRole('button', { name: 'week 6 of spring, year 1' }));
    expect(screen.getByText('Ashford marches on Bram')).toBeTruthy();
    expect(screen.queryByText('Bram falls')).toBeNull();
  });

  test('clicking a headline highlights the affected node', () => {
    STORE = { setSelectedSettlementId };
    render(<ChronicleScrollback campaign={campaign} nameFor={nameFor} />);
    fireEvent.click(screen.getByTestId('chronicle-headline'));
    expect(setSelectedSettlementId).toHaveBeenCalledWith('b');
  });

  test('projects legacy climb-down analytics before rendering a pulse headline', () => {
    STORE = { setSelectedSettlementId };
    const momentumCampaign = {
      id: 'momentum',
      worldState: {
        pulseHistory: [{
          tick: 7,
          selectedOutcomes: [{
            id: 'm7', kind: 'momentum_climb_down', headline: 'Aldermoor abandons the war',
            summary: 'Commitment 3.2× its cliff; price 0.62.', severity: 0.6,
          }],
          impactDigest: [],
        }],
      },
    };
    const { container } = render(<ChronicleScrollback campaign={momentumCampaign} nameFor={nameFor} />);
    expect(container.textContent).toContain('The court held to the war too long; reversing course carried a real political price.');
    // anchored: the exact authored projection above proves the selected headline body rendered.
    expect(container.textContent).not.toMatch(/3\.2|0\.62|×|\b(?:commitment|cliff)\b/i);
  });

  test('the selection ANCHORS TO ITS TICK when a new advance prepends a frame (SB2)', () => {
    STORE = { setSelectedSettlementId };
    const { rerender } = render(<ChronicleScrollback campaign={campaign} nameFor={nameFor} />);
    // The DM scrubs back to tick 5…
    fireEvent.click(screen.getByRole('button', { name: 'week 6 of spring, year 1' }));
    expect(screen.getByText('Ashford marches on Bram')).toBeTruthy();
    // …then an advance lands while the panel is open: the newest-first timeline
    // grows at the FRONT (tick 9 prepends). A positional index would now point
    // at tick 7; the tick anchor must keep tick 5 selected.
    const grown = {
      ...campaign,
      worldState: {
        pulseHistory: [
          ...campaign.worldState.pulseHistory,
          { tick: 9, selectedOutcomes: [{ id: 'o9', headline: 'A new dawn', summary: '', targetSaveId: 'a', severity: 0.2 }], impactDigest: [] },
        ],
      },
    };
    rerender(<ChronicleScrollback campaign={grown} nameFor={nameFor} />);
    expect(screen.getAllByText('week 6 of spring, year 1').length).toBeGreaterThan(0);
    expect(screen.getByText('Ashford marches on Bram')).toBeTruthy();
    expect(screen.queryByText('Bram falls')).toBeNull();
  });

  test('parked at the newest, the view FOLLOWS a new advance (the default keeps live)', () => {
    STORE = { setSelectedSettlementId };
    const { rerender } = render(<ChronicleScrollback campaign={campaign} nameFor={nameFor} />);
    expect(screen.getAllByText('week 8 of spring, year 1').length).toBeGreaterThan(0);
    const grown = {
      ...campaign,
      worldState: {
        pulseHistory: [
          ...campaign.worldState.pulseHistory,
          { tick: 9, selectedOutcomes: [{ id: 'o9', headline: 'A new dawn', summary: '', targetSaveId: 'a', severity: 0.2 }], impactDigest: [] },
        ],
      },
    };
    rerender(<ChronicleScrollback campaign={grown} nameFor={nameFor} />);
    expect(screen.getAllByText('week 10 of spring, year 1').length).toBeGreaterThan(0);
    expect(screen.getByText('A new dawn')).toBeTruthy();
  });
});

describe('ChronicleScrollback — per-tick compareCausalState diff', () => {
  test('shows the causal diff for the selected tick when snapshots are supplied', () => {
    STORE = { setSelectedSettlementId };
    // Before/after causal snapshots keyed by tick — compareCausalState reads scores.
    const causalByTick = new Map([
      [7, {
        before: { scores: { social_trust: 0.6 }, bands: { social_trust: 'stable' } },
        after:  { scores: { social_trust: 0.3 }, bands: { social_trust: 'strained' } },
      }],
    ]);
    render(<ChronicleScrollback campaign={campaign} nameFor={nameFor} causalByTick={causalByTick} />);
    expect(screen.getByTestId('chronicle-causal-diff')).toBeTruthy();
    expect(screen.getAllByText(/social trust/i).length).toBeGreaterThan(0);
  });

  test('no diff block when no snapshots are supplied', () => {
    STORE = { setSelectedSettlementId };
    render(<ChronicleScrollback campaign={campaign} nameFor={nameFor} />);
    expect(screen.queryByTestId('chronicle-causal-diff')).toBeNull();
  });
});
