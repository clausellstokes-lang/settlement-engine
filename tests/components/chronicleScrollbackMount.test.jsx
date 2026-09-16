/** @vitest-environment jsdom */
/**
 * tests/components/chronicleScrollbackMount.test.jsx — Wave R-2 Lane A
 * (atlas queue #19 / gap 13): ChronicleScrollback has a PRODUCTION mount.
 *
 * The atlas found the scrubbable chronicle reader built, tested green, and
 * imported by NOTHING in src/ — 23 of 24 entries of a paid record were
 * write-only while WizardNewsPanel rendered chronicles[0] alone. These pins
 * hold the cure in place:
 *
 *   • MOUNT: WizardNewsPanel renders the scrollback (unmounting it again
 *     re-reds this file — the production-importer guard the atlas asked for).
 *   • FULL HISTORY: the second chronicle entry is REACHABLE by scrubbing —
 *     the exact prose that was unreadable before this wave.
 *   • HONEST EMPTY STATE: a fresh campaign shows the self-gated empty copy,
 *     not a broken panel.
 *   • GATING PARITY: the store mock below carries NO auth/tier state at all.
 *     The records' write side is gated (sign-in + server-side credits); the
 *     records themselves exist only on the owner's campaign. Reading them
 *     requires record presence and nothing else — rendering the full history
 *     from a bare store proves the reader added no tier wall of its own,
 *     exactly matching how chronicles[0] was gated before.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../src/lib/campaignChronicle.js', () => ({
  requestCampaignChronicle: vi.fn(),
}));
vi.mock('../../src/lib/analytics.js', () => ({
  EVENTS: { WIZARD_NEWS_PANEL_OPENED: 'wizard_news_panel_opened' },
  track: vi.fn(),
}));

// Deliberately bare: savedSettlements + the two write actions the panel wires,
// and the scrollback's highlight action. NO auth, NO tier, NO entitlement —
// the gating-parity pin depends on this store staying bare.
const STORE = {
  savedSettlements: [],
  appendCampaignChronicle: vi.fn(),
  setCreditBalance: vi.fn(),
  setSelectedSettlementId: vi.fn(),
};
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(STORE) }));

import WizardNewsPanel from '../../src/components/map/WizardNewsPanel.jsx';

afterEach(() => cleanup());

const NEWEST_PROSE = 'The siege of Bram broke at last.';
const OLDER_PROSE = 'A quiet season of trade held the roads.';

function campaignWithHistory() {
  return {
    id: 'camp-1',
    name: 'The Reach',
    settlementIds: [],
    wizardNews: { currentTick: 7, entries: [] },
    chronicles: [
      { id: 'ch7', tick: 7, prose: NEWEST_PROSE },
      { id: 'ch5', tick: 5, prose: OLDER_PROSE },
    ],
    worldState: {
      pulseHistory: [
        {
          tick: 5,
          interval: 'one_week',
          selectedOutcomes: [
            { id: 'o5', headline: 'Ashford marches on Bram', summary: 'An army deploys.', targetSaveId: 'b', severity: 0.6 },
          ],
          impactDigest: [],
        },
        {
          tick: 7,
          interval: 'one_week',
          selectedOutcomes: [
            { id: 'o7', headline: 'Bram falls', summary: 'The walls broke.', targetSaveId: 'b', severity: 0.8 },
          ],
          impactDigest: [],
        },
      ],
    },
  };
}

describe('WizardNewsPanel mounts ChronicleScrollback (atlas queue #19)', () => {
  test('the scrollback renders with records, defaulting to the newest entry', () => {
    render(<WizardNewsPanel campaign={campaignWithHistory()} />);
    expect(screen.getByTestId('chronicle-scrollback')).toBeTruthy();
    expect(screen.getByText(NEWEST_PROSE)).toBeTruthy();
    // The scrubber knows the whole history, not just entry [0].
    expect(screen.getByText('1 of 2')).toBeTruthy();
  });

  test('FULL HISTORY: scrubbing reaches the second chronicle entry (the pre-fix write-only prose)', () => {
    render(<WizardNewsPanel campaign={campaignWithHistory()} />);
    expect(screen.queryByText(OLDER_PROSE)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Older chronicle entry' }));
    expect(screen.getByText(OLDER_PROSE)).toBeTruthy();
    expect(screen.getByText('2 of 2')).toBeTruthy();
  });

  test('HONEST EMPTY STATE: a fresh campaign self-gates to the empty copy', () => {
    render(
      <WizardNewsPanel
        campaign={{ id: 'fresh', name: 'New Realm', settlementIds: [], wizardNews: { currentTick: 0, entries: [] }, worldState: {} }}
      />,
    );
    expect(screen.getByTestId('chronicle-scrollback-empty')).toBeTruthy();
    expect(screen.queryByTestId('chronicle-scrollback')).toBeNull();
  });

  test('GATING PARITY: the full paid record reads from record presence alone (bare store, no tier state)', () => {
    // The mocked store above has no auth/tier/entitlement keys. If the mount
    // ever grows a tier wall the records themselves are not gated by, this
    // render (or the scrub) fails — that is the parity contract.
    expect(Object.keys(STORE).sort()).toEqual([
      'appendCampaignChronicle', 'savedSettlements', 'setCreditBalance', 'setSelectedSettlementId',
    ]);
    render(<WizardNewsPanel campaign={campaignWithHistory()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Older chronicle entry' }));
    expect(screen.getByText(OLDER_PROSE)).toBeTruthy();
  });
});
