/**
 * @vitest-environment jsdom
 *
 * Data & Privacy campaign wipes must await the canonical store action's confirmed
 * persistence mode and reject on a failed subset. The store-level companion test
 * pins that failed rows remain visible and retryable.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, within } from '@testing-library/react';

afterEach(cleanup);

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_target, key) => String(key) }),
}));
vi.mock('../../src/lib/saves.js', () => ({
  saves: { delete: vi.fn(), list: vi.fn().mockResolvedValue([]) },
  newSaveId: () => 'test-save-id',
}));

let dataSectionProps = null;
vi.mock('../../src/components/account/AccountDataPrivacySection.jsx', () => ({
  default: (props) => {
    dataSectionProps = props;
    return null;
  },
}));

const storeState = {
  auth: {
    user: { id: 'u1', email: 'tester@example.com' },
    tier: 'free',
    role: 'user',
    displayName: 'Tester',
    avatarUrl: '',
    emailNotifications: true,
    modelPreference: null,
  },
  creditBalance: 0,
  isElevated: () => false,
  isDeveloper: () => false,
  savedSettlements: [],
  campaigns: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }],
  maxSaves: () => 3,
  canSave: () => true,
  importAccountData: vi.fn().mockResolvedValue({ ok: true }),
  authSignOut: vi.fn(),
  setAuth: vi.fn(),
  authGetSecurityQuestionIds: vi.fn().mockResolvedValue([]),
  authSetSecurityAnswers: vi.fn().mockResolvedValue(undefined),
  removeSavedSettlement: vi.fn(),
  clearSavedSettlements: vi.fn(),
  withSettlementDeletionLock: vi.fn(),
  deleteCampaign: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

beforeEach(() => {
  dataSectionProps = null;
  storeState.deleteCampaign.mockReset();
});

async function mountDataSection() {
  const AccountPage = (await import('../../src/components/AccountPage.jsx')).default;
  render(<AccountPage onNavigateAdmin={() => {}} />);
  const nav = document.querySelector('nav[aria-label="Account settings"]');
  fireEvent.click(within(nav).getByRole('button', { name: 'Data' }));
  expect(dataSectionProps).not.toBeNull();
  return dataSectionProps;
}

describe('AccountPage — confirmed campaign wipe', () => {
  test('awaits every persisted delete and requests confirmed-persistence mode', async () => {
    const resolvers = new Map();
    storeState.deleteCampaign.mockImplementation(id => new Promise(resolve => {
      resolvers.set(id, resolve);
    }));
    const props = await mountDataSection();
    let settled = false;
    const wipe = props.onDeleteAllCampaigns().then(() => {
      settled = true;
    });

    await Promise.resolve();
    expect(settled).toBe(false);
    for (const id of ['c1', 'c2']) {
      resolvers.get(id)();
    }
    await Promise.resolve();
    expect(settled).toBe(false);
    resolvers.get('c3')();
    await wipe;

    expect(storeState.deleteCampaign.mock.calls).toEqual([
      ['c1', { awaitPersistence: true }],
      ['c2', { awaitPersistence: true }],
      ['c3', { awaitPersistence: true }],
    ]);
  });

  test('rejects with an aggregate partial-failure message', async () => {
    storeState.deleteCampaign.mockImplementation(id => (
      id === 'c2'
        ? Promise.reject(new Error('cloud delete failed'))
        : Promise.resolve({ ok: true })
    ));
    const props = await mountDataSection();

    await expect(props.onDeleteAllCampaigns()).rejects.toThrow(/1 of 3 campaigns/);
    expect(storeState.deleteCampaign).toHaveBeenCalledTimes(3);
  });
});
