/** @vitest-environment jsdom */
/**
 * tests/components/advanceReport.test.jsx — THE CHRONICLE advance-report surface.
 *
 * Pins (design docs/DESIGN_CHRONICLE_LEGIBILITY.md):
 *  · a fresh campaign self-gates to the empty invitation (byte-identical off-state);
 *  · a populated advance renders the delta lead + threads + the ALWAYS-PRESENT
 *    decree section;
 *  · zero decrees still render the decree section (never absent — owner ruling);
 *  · §5b: two conflicting decrees render as ONE cluster naming the conflict;
 *  · clicking a receipt highlights the affected settlement on the map.
 */
import { afterEach, describe, expect, test, vi, beforeEach } from 'vitest';
import { cleanup, render, screen, fireEvent, within } from '@testing-library/react';

const setSelectedSettlementId = vi.fn();
const STORE = { setSelectedSettlementId };
vi.mock('../../src/store/index.js', () => ({ useStore: selector => selector(STORE) }));

import AdvanceReport from '../../src/components/map/AdvanceReport.jsx';

beforeEach(() => { setSelectedSettlementId.mockClear(); });
afterEach(() => { cleanup(); });

describe('AdvanceReport — empty off-state', () => {
  test('a fresh campaign renders the empty invitation', () => {
    render(<AdvanceReport campaign={{ id: 'c1', worldState: { pulseHistory: [] } }} />);
    expect(screen.getByTestId('advance-report-empty')).toBeTruthy();
    expect(screen.queryByTestId('advance-report')).toBeNull();
  });
});

describe('AdvanceReport — populated report', () => {
  const campaign = {
    id: 'c1',
    settlementIds: ['A'],
    worldState: {
      pulseHistory: [{
        tick: 52,
        selectedOutcomes: [
          { id: 'o_war', candidateType: 'stressor_birth_siege', severity: 0.8, headline: 'The siege of A', summary: 'Walls tested.', stressor: { id: 's1', type: 'siege', affectedSettlementIds: ['A'] }, targetSaveId: 'A', settlementIds: ['A'] },
        ],
        impactDigest: [],
      }],
    },
  };

  test('renders the report with a delta lead, a thread, and the decree section', () => {
    render(<AdvanceReport campaign={campaign} nameFor={(id) => `Town ${id}`} />);
    expect(screen.getByTestId('advance-report')).toBeTruthy();
    expect(screen.getByTestId('chronicle-thread')).toBeTruthy();
    // The decree section is ALWAYS present, even with no decrees.
    const section = screen.getByTestId('chronicle-decree-section');
    expect(section).toBeTruthy();
    expect(within(section).getByText(/no orders this advance/i)).toBeTruthy();
  });

  test('the year advance opens at the full pyramid (headline visible)', () => {
    render(<AdvanceReport campaign={campaign} />);
    // The scrubber header shows the span-scaled headline ("The year: ...").
    // Tick 52 renders as its calendar phrase (fix wave 3: no bare engine tick).
    expect(screen.getByText(/the year to the spring of year 2/i)).toBeTruthy();
  });

  test('translates size and relationship deltas without tier or kebab tokens', () => {
    const translatedCampaign = {
      id: 'c-translation',
      settlementIds: ['A', 'B'],
      worldState: {
        pulseHistory: [{
          tick: 1,
          selectedOutcomes: [
            {
              id: 'size-change',
              headline: 'A grew beyond its old bounds',
              targetSaveId: 'A',
              tierChange: { from: 'large_town', to: 'city' },
            },
            {
              id: 'relationship-change',
              headline: 'A and B went to war',
              targetSaveId: 'A',
              relationshipKey: 'A:B',
              proposalPayload: {
                kind: 'relationship_label_change',
                relationshipKey: 'A:B',
                toType: 'hostile',
              },
            },
          ],
          impactDigest: [],
        }],
      },
    };

    const { container } = render(
      <AdvanceReport campaign={translatedCampaign} nameFor={(id) => (
        id === 'A' ? 'Aldermoor' : 'Briarwatch'
      )} />,
    );

    expect(screen.getByText('Aldermoor: Size Large town → City')).toBeTruthy();
    expect(screen.getByText('war declared')).toBeTruthy();
    expect(container.textContent).not.toMatch(/\btier\b|large_town|war-declared/i);
  });
});

describe('AdvanceReport — decree section (§5 / §5b)', () => {
  test('two conflicting decrees render as ONE cluster naming the conflict', () => {
    const campaign = {
      id: 'c2', settlementIds: ['A'],
      worldState: {
        pulseHistory: [{
          tick: 52,
          selectedOutcomes: [
            { id: 'realm_verb.granary_order.g.5.aaaa', applyMode: 'proposal', headline: 'You ordered the granaries filled', targetSaveId: 'A', tierChange: { from: 2, to: 3 } },
            { id: 'realm_verb.embargo.g.30.bbbb', applyMode: 'proposal', headline: 'You embargoed A', targetSaveId: 'A', tierChange: { from: 3, to: 2 } },
          ],
          impactDigest: [],
        }],
      },
    };
    render(<AdvanceReport campaign={campaign} />);
    const clusters = screen.getAllByTestId('chronicle-decree-cluster');
    expect(clusters).toHaveLength(1);
    // The conflict is named, and both decrees live inside the ONE cluster.
    expect(within(clusters[0]).getByText(/conflicting/i)).toBeTruthy();
    expect(within(clusters[0]).getAllByTestId('chronicle-decree')).toHaveLength(2);
  });

  test('a decree with no downstream effect is reported as an honest null', () => {
    const campaign = {
      id: 'c3', settlementIds: ['L'],
      worldState: {
        pulseHistory: [{
          tick: 52,
          selectedOutcomes: [
            { id: 'realm_verb.rename.g.5.eeee', applyMode: 'proposal', headline: 'You renamed a hamlet', targetSaveId: 'L' },
          ],
          impactDigest: [],
        }],
      },
    };
    render(<AdvanceReport campaign={campaign} />);
    expect(screen.getByText(/no measurable downstream effect/i)).toBeTruthy();
  });
});

describe('AdvanceReport — receipts clickable', () => {
  test('clicking a receipt highlights the affected settlement', () => {
    const campaign = {
      id: 'c4', settlementIds: ['A'],
      worldState: {
        pulseHistory: [{
          tick: 1, // a 1-week advance opens at events-only
          selectedOutcomes: [
            { id: 'o1', headline: 'A stirs', summary: 'Something moved.', targetSaveId: 'A', settlementIds: ['A'], severity: 0.4 },
          ],
          impactDigest: [],
        }],
      },
    };
    render(<AdvanceReport campaign={campaign} nameFor={(id) => `Town ${id}`} />);
    const receipts = screen.getAllByTestId('chronicle-receipt');
    fireEvent.click(receipts[0]);
    expect(setSelectedSettlementId).toHaveBeenCalledWith('A');
  });

  test('a mechanical root without an edge does not advertise a public cause trace', () => {
    const campaign = {
      id: 'c-mechanical-root',
      settlementIds: ['A'],
      worldState: {
        pulseHistory: [{
          tick: 1,
          selectedOutcomes: [{
            id: 'public-o1',
            headline: 'A stirs',
            targetSaveId: 'A',
            settlementIds: ['A'],
          }],
          impactDigest: [],
        }],
        spatialLedgers: {
          provenance: {
            'mechanical.population.a.1': {
              parents: [],
              type: 'population_growth',
              tick: 1,
              receiptClass: 'mechanical',
            },
          },
        },
      },
    };
    render(<AdvanceReport campaign={campaign} />);
    expect(screen.queryByTestId('cause-walk-trigger')).toBeNull();
    expect(screen.getByText(/causal links between events are inferred/i)).toBeTruthy();
  });
});
