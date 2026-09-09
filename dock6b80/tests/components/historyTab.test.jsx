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

function openMajorEvents(count = 1) {
  fireEvent.click(screen.getByText(`Major Historical Events (${count})`));
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
