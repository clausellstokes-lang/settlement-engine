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
    // Newest tick (7) is selected by default — its prose + headline show.
    expect(screen.getByText(/Tick 7/)).toBeTruthy();
    expect(screen.getByText(/The siege of Bram broke/)).toBeTruthy();
    expect(screen.getByText('Bram falls')).toBeTruthy();
    // The older tick (5) is on the rail but not the selected body.
    expect(screen.queryByText('Ashford marches on Bram')).toBeNull();
  });

  test('scrubbing to an older tick selects it', () => {
    STORE = { setSelectedSettlementId };
    render(<ChronicleScrollback campaign={campaign} nameFor={nameFor} />);
    // Click the tick-5 rail button (role=group + aria-pressed toggle, not a tab).
    fireEvent.click(screen.getByRole('button', { name: 'Tick 5' }));
    expect(screen.getByText('Ashford marches on Bram')).toBeTruthy();
    expect(screen.queryByText('Bram falls')).toBeNull();
  });

  test('clicking a headline highlights the affected node', () => {
    STORE = { setSelectedSettlementId };
    render(<ChronicleScrollback campaign={campaign} nameFor={nameFor} />);
    fireEvent.click(screen.getByTestId('chronicle-headline'));
    expect(setSelectedSettlementId).toHaveBeenCalledWith('b');
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
