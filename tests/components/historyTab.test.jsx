/** @vitest-environment jsdom */
/**
 * historyTab.test.jsx — Major Historical Events card honesty pins.
 *
 * The card used to render `description.slice(0,55) + '…'` as its ONLY body
 * and never rendered `evt.name` at all — virtually every event (descriptions
 * run 66–117 chars) showed a mid-word fragment and the expanded block never
 * revealed the rest. These pins lock the fix: the event's name is the card
 * title (type label when unnamed) and the description always reads in full.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { HistoryTab } from '../../src/components/new/tabs/HistoryTab.jsx';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const LONG_DESC =
  'Rights to the local iron deposits became the subject of a prolonged dispute between the settlement and a rival lord.';

function settlementWith(events) {
  return {
    name: 'Briarwatch',
    history: {
      age: 140,
      founding: null,
      historicalCharacter: '',
      eventsTimeline: [],
      currentTensions: [],
      historicalEvents: events,
    },
  };
}

afterEach(cleanup);

// The events fold is OPEN on first paint since the timeline became its header (chair ruling
// H6, 2026-10-30), so no click is needed; this asserts the fold's title is there instead.
function openMajorEvents(count = 1) {
  expect(screen.getByText(`Major Historical Events (${count})`)).toBeTruthy();
}

describe('HistoryTab Major Historical Events card', () => {
  it('renders the event name as the title and the >55-char description in full', () => {
    expect(LONG_DESC.length).toBeGreaterThan(55);
    render(<HistoryTab settlement={settlementWith([{
      type: 'economic',
      name: 'The Iron Dispute',
      description: LONG_DESC,
      yearsAgo: 38,
      severity: 'major',
      lastingEffects: ['Iron production rights still legally contested'],
      plotHooks: ['An old deed to the iron rights has resurfaced'],
      anchored: false,
    }])} />);
    openMajorEvents();

    expect(screen.getByText('The Iron Dispute')).toBeTruthy();
    expect(screen.getByText(LONG_DESC)).toBeTruthy();
    // The old mid-word snippet must be gone.
    expect(screen.queryByText(`${LONG_DESC.slice(0, 55)}…`)).toBeNull();
  });

  it('keeps the full description readable when the card is expanded', () => {
    render(<HistoryTab settlement={settlementWith([{
      type: 'economic',
      name: 'The Iron Dispute',
      description: LONG_DESC,
      yearsAgo: 38,
      lastingEffects: ['Iron production rights still legally contested'],
      plotHooks: [],
    }])} />);
    openMajorEvents();

    fireEvent.click(screen.getByText(LONG_DESC)); // expand the card
    expect(screen.getByText(LONG_DESC)).toBeTruthy();
    expect(screen.getByText('Iron production rights still legally contested')).toBeTruthy();
  });

  it('falls back to the type label as title when the event has no name', () => {
    render(<HistoryTab settlement={settlementWith([{
      type: 'economic',
      description: LONG_DESC,
      yearsAgo: 12,
    }])} />);
    openMajorEvents();

    expect(screen.getByText('Economic')).toBeTruthy();
    expect(screen.getByText(LONG_DESC)).toBeTruthy();
  });

  it('renders a campaign-era stamp (stressor aftermath shape) whole', () => {
    const campaignDesc =
      'The Saltmarsh Banditry gripped the settlement during the campaign and has passed into memory — burned waystations linger.';
    render(<HistoryTab settlement={settlementWith([{
      campaignEventId: 'campaign.echo-1.4',
      campaignEra: true,
      tick: 4,
      yearsAgo: 0,
      name: 'The Saltmarsh Banditry',
      type: 'external_threat',
      description: campaignDesc,
      severity: 'major',
      lastingEffects: ['burned waystations'],
      plotHooks: [],
      anchored: true,
    }])} />);
    openMajorEvents();

    expect(screen.getByText('The Saltmarsh Banditry')).toBeTruthy();
    expect(screen.getByText(campaignDesc)).toBeTruthy();
  });
});

/**
 * THE CONSOLIDATED HISTORY PAGE (chair rulings H1, H5-H9; X-2, 2026-10-30): no count span in
 * the header (the section titles carry the counts), no Recent Events slice (the Chronicle owns
 * the feed), the timeline drawn once as the events' header with ONE still-relevant mark (the
 * big dot), Founding open on first paint, and no inline plot hooks on tensions or events.
 */
describe('HistoryTab — the consolidated page', () => {
  const town = () => ({
    name: 'Briarwatch',
    history: {
      age: 140,
      founding: { reason: 'A ford on the salt road', foundedBy: 'Three drover families' },
      historicalCharacter: 'A town that never forgave the flood.',
      eventsTimeline: [
        { type: 'economic', yearsAgo: 38, anchored: true },
        { type: 'military', yearsAgo: 90, anchored: false },
      ],
      currentTensions: [{ type: 'guild_conflict', description: 'The tanners and the dyers share one stream.', severity: 'major', plotHooks: ['A dyer asks the party to foul the tannery outflow.'] }],
      historicalEvents: [
        { type: 'economic', name: 'The Iron Dispute', description: LONG_DESC, yearsAgo: 38, anchored: true, lastingEffects: ['Rights still contested'], plotHooks: ['An old deed to the iron rights has resurfaced.'] },
        { type: 'military', name: 'The Long Siege', description: 'The walls held for a winter.', yearsAgo: 90, anchored: false, plotHooks: [] },
      ],
    },
  });
  const recent = [{ id: 'e1', title: 'Market burned', summary: 'The east market burned in the night.', source: 'world' }];

  it('the header carries no count span, and no Recent Events slice renders', () => {
    const { container } = render(<HistoryTab settlement={town()} recentEvents={recent} />);
    const text = container.textContent;
    const anchor = 'Major Historical Events (2)';
    expect(text).toContain(anchor);
    expect(text).toContain('Current Tensions (1)');
    expectAbsentWithAnchor(text, 'historical events ·', anchor, 'H1 count span');
    expectAbsentWithAnchor(text, 'Recent Events', anchor, 'H5 Recent Events');
    expectAbsentWithAnchor(text, 'The east market burned in the night.', anchor, 'H5 feed row');
  });

  it('the timeline is the events block\'s header, with one still-relevant mark', () => {
    const { container } = render(<HistoryTab settlement={town()} />);
    const timeline = screen.getByTestId('history-timeline');
    // Drawn once, inside the events fold, above the first card.
    expect(container.querySelectorAll('[data-testid="history-timeline"]')).toHaveLength(1);
    const text = container.textContent;
    const follows = (a, b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(follows(screen.getByText('Major Historical Events (2)'), timeline)).toBe(true);
    expect(follows(timeline, screen.getByText('The Iron Dispute'))).toBe(true);
    // The big dot says "still relevant" in its own title; the legend mark and the banner are gone.
    expect(timeline.querySelector('[title*="still relevant today"]')).toBeTruthy();
    expectAbsentWithAnchor(text, 'Still relevant today ()', 'The Iron Dispute', 'H6 legend defect');
    expectAbsentWithAnchor(text, 'Still relevant today', 'The Iron Dispute', 'H9 anchored banner');
  });

  it('Founding is open on first paint, and tensions and events carry no plot hooks', () => {
    const { container } = render(<HistoryTab settlement={town()} />);
    expect(screen.getByText('A ford on the salt road')).toBeTruthy();
    fireEvent.click(screen.getByText(LONG_DESC)); // expand the event: lasting effects only
    const text = container.textContent;
    expect(text).toContain('Rights still contested');
    expectAbsentWithAnchor(text, 'A dyer asks the party to foul the tannery outflow.', 'The tanners and the dyers share one stream.', 'H7 tension hooks (X-2)');
    expectAbsentWithAnchor(text, 'An old deed to the iron rights has resurfaced.', 'Rights still contested', 'H9 event hooks (X-2)');
    expectAbsentWithAnchor(text, 'Plot hooks', 'Rights still contested', 'the inline hooks kicker');
  });
});
