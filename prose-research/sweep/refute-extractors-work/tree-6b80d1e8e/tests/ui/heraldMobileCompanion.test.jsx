/** @vitest-environment jsdom */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const readModelSpy = vi.hoisted(() => vi.fn());

vi.mock('../../src/lib/flags.js', () => ({
  flag: name => name === 'heraldCommandBrief',
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: Object.assign(
    selector => selector({
      canUseCustomContent: () => true,
      setActivePricingMoment: vi.fn(),
    }),
    {
      getState: () => ({
        canUseCustomContent: () => true,
        setActivePricingMoment: vi.fn(),
      }),
    },
  ),
}));

vi.mock('../../src/lib/pricingMoments.js', () => ({
  triggerPricingMoment: vi.fn(),
}));

vi.mock('../../src/domain/realm/realmItemReadModel.js', () => ({
  buildRealmItemReadModel: (...args) => readModelSpy(...args),
}));

vi.mock('../../src/components/map/HeraldBody.jsx', () => ({
  default: ({ section }) => <div data-testid={`mobile-legacy-${section}`}>{section}</div>,
}));

import RealmMobileGate from '../../src/components/map/RealmMobileGate.jsx';

const pendingDecision = {
  id: 'realm-item:decision:proposal-1',
  source: { primaryClass: 'proposal', classes: ['proposal'] },
  headline: 'The guilds await a ruling',
  summary: '',
  tick: 7,
  topic: { primary: 'trade', tags: ['proposal'] },
  temporal: { phase: 'planned' },
  resolution: { state: 'unresolved' },
  operational: { state: 'active' },
  workflow: { kind: 'proposal' },
  epistemic: { class: 'pending_decision' },
  attention: {
    class: 'blocking_decision',
    blocking: true,
    urgency: 1,
    significance: 0.8,
    reason: 'A realm decision is unresolved and awaits the GM.',
  },
  subjects: [],
  affectedEntities: [],
  cause: {
    state: 'unavailable',
    available: false,
    rootRecordId: null,
    receiptId: null,
    reason: 'No recorded cause receipt is available for this source.',
  },
  compatibility: { heraldSection: 'adjudication' },
  payload: { sourceRecord: {} },
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('flagged mobile Herald companion', () => {
  test.each([
    ['free', /Upgrade to run the Realm/i],
    ['anon', /Sign in to unlock the Realm/i],
  ])('keeps the established locked Dashboard and makes no Decisions promise to a %s viewer', async (tier, ctaName) => {
    const onUpgrade = vi.fn();
    readModelSpy.mockReturnValue({
      items: [pendingDecision],
      ranked: [pendingDecision],
    });

    render(
      <RealmMobileGate
        campaign={{ id: 'campaign-1', worldState: {} }}
        saves={[]}
        canManageCampaigns={false}
        tier={tier}
        onUpgrade={onUpgrade}
        nameById={new Map()}
      />,
    );

    // RealmDashboard intentionally remains a separate lazy chunk. Under the
    // repository's parallel transform load it can settle after Testing Library's
    // one-second default even though the isolated render is immediate.
    expect(await screen.findByTestId(
      'realm-dashboard-locked',
      {},
      { timeout: 3000 },
    )).toBeTruthy();
    expect(screen.getByText('The Realm comes alive with Cartographer')).toBeTruthy();
    expect(screen.getByText(/keeps the Realm's locked preview/i)).toBeTruthy();
    expect(screen.getByText(/Live decisions are not available on this account/i)).toBeTruthy();
    expect(screen.queryByText(/answer decisions/i)).toBeNull();
    expect(screen.queryByTestId('herald-mobile-companion')).toBeNull();
    expect(screen.queryByRole('button', { name: /^Decisions/ })).toBeNull();
    expect(readModelSpy).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: ctaName }));
    expect(onUpgrade).toHaveBeenCalledTimes(1);
  });

  test('reads the Briefing, opens the existing Decisions body, and returns to its origin', async () => {
    const memberSaves = [{ id: 'save-1', settlement: { name: 'Marchwall' } }];
    readModelSpy.mockReturnValue({
      items: [pendingDecision],
      ranked: [pendingDecision],
    });

    render(
      <RealmMobileGate
        campaign={{ id: 'campaign-1', worldState: {} }}
        saves={memberSaves}
        canManageCampaigns
        tier="premium"
        nameById={new Map([['save-1', 'Marchwall']])}
      />,
    );

    expect(await screen.findByTestId('herald-mobile-companion')).toBeTruthy();
    expect(screen.getByText(/read the briefing and answer decisions/i)).toBeTruthy();
    expect(screen.queryByText(/read-only look/i)).toBeNull();
    expect(screen.getByText('The guilds await a ruling')).toBeTruthy();
    expect(screen.getByText('A realm decision is unresolved and awaits the GM.')).toBeTruthy();
    expect(readModelSpy).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'campaign-1' }),
      { saves: memberSaves, canUseCustom: true },
    );

    const body = screen.getByTestId('herald-mobile-body');
    body.scrollTop = 63;
    const origin = screen.getByRole('button', { name: /review decision/i });
    origin.focus();
    fireEvent.click(origin);
    await waitFor(() => expect(screen.getByTestId('mobile-legacy-adjudication')).toBeTruthy());

    const returnButton = screen.getByRole('button', { name: /return to briefing/i });
    fireEvent.click(returnButton);
    await waitFor(() => {
      expect(screen.getByText('The guilds await a ruling')).toBeTruthy();
      expect(body.scrollTop).toBe(63);
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /review decision/i }));
    });
  });

  test('exposes all four touch-safe task tabs in the phone gate', async () => {
    readModelSpy.mockReturnValue({ items: [], ranked: [] });
    render(
      <RealmMobileGate
        campaign={{ id: 'campaign-1', worldState: {} }}
        saves={[]}
        canManageCampaigns
        tier="premium"
        nameById={new Map()}
      />,
    );

    await screen.findByTestId('herald-mobile-companion');
    expect(screen.getByRole('button', { name: /^Briefing/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /^Stories/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /^Plans/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /^Decisions/ })).toBeTruthy();
  });
});
