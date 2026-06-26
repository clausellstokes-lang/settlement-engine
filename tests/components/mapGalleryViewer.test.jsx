/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import CampaignStatePanel from '../../src/components/gallery/CampaignStatePanel.jsx';
import MapGalleryDetail from '../../src/components/gallery/MapGalleryDetail.jsx';

afterEach(cleanup);

/**
 * Finding (1) — the orphaned "World clock" section. The owner can enable
 * worldClock alone, and the snapshot serializes it, but the viewer had no
 * renderer for it: a worldClock-only share rendered an empty living-world panel.
 * The panel now carries a WorldClockSection, so the in-world date/tick shows.
 */
describe('CampaignStatePanel — worldClock section', () => {
  test('renders the in-world date and tick when snapshot.worldClock is present', () => {
    render(
      <CampaignStatePanel
        sections={['worldClock']}
        snapshot={{ worldClock: { tick: 7, calendar: { year: 3, month: 5, season: 'autumn', elapsedMonths: 28 } } }}
      />,
    );
    // The panel renders (not null) AND the clock values are shown read-only.
    expect(screen.getByTestId('campaign-state-panel')).toBeTruthy();
    expect(screen.getByText('World Clock')).toBeTruthy();
    expect(screen.getByText('Year 3')).toBeTruthy();
    expect(screen.getByText('Month 5')).toBeTruthy();
    expect(screen.getByText('Autumn')).toBeTruthy();
    expect(screen.getByText('Tick 7')).toBeTruthy();
  });

  test('a worldClock-only share with no clock data renders nothing (self-gates)', () => {
    const { container } = render(
      <CampaignStatePanel sections={['worldClock']} snapshot={{ dashboard: { realmArcLines: [] } }} />,
    );
    expect(container.firstChild).toBeNull();
  });
});

/**
 * Finding (2) — the maps import affordance ignored the viewer's premium tier. A
 * non-premium viewer (importEligible false) must NOT get an enabled Import
 * button: they get the calm premium notice plus a "See plans" upgrade next-step.
 */
describe('MapGalleryDetail — viewer-premium import gate', () => {
  const baseDetail = { slug: 'm-1', name: 'Ashfen Reach', kind: 'map_with_campaign', members: [] };

  test('a non-premium viewer sees the premium upgrade framing, not an enabled Import', () => {
    const onUpgrade = vi.fn();
    render(
      <MapGalleryDetail
        detail={baseDetail}
        onBack={() => {}}
        onImport={() => {}}
        importEligible={false}
        importNotice="Importing maps is a premium feature."
        onUpgrade={onUpgrade}
      />,
    );
    // No enabled import button for a non-premium viewer.
    expect(screen.queryByText('Import map and settlements')).toBeNull();
    // The calm premium framing + upgrade next-step stand in for it.
    expect(screen.getByText('Importing maps is a premium feature.')).toBeTruthy();
    expect(screen.getByText('See plans')).toBeTruthy();
  });

  test('a premium viewer with owner opt-in gets the enabled Import button', () => {
    render(
      <MapGalleryDetail
        detail={baseDetail}
        onBack={() => {}}
        onImport={() => {}}
        importEligible
        importNotice={null}
      />,
    );
    expect(screen.getByText('Import map and settlements')).toBeTruthy();
  });
});
