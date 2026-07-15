/**
 * @vitest-environment jsdom
 *
 * tests/ui/accountPage.deleteAllSettlements.test.jsx — Data & Privacy bulk
 * delete must not report false success.
 *
 * handleDeleteAllSettlements used to run the server deletes through
 * Promise.allSettled WITHOUT inspecting the results, then clear local state
 * unconditionally — a failed server delete looked like a clean wipe and the
 * row resurrected at next sign-in. The contract pinned here:
 *
 *   1. every id is sent to savesService.delete;
 *   2. if EVERY server delete fulfilled, local state is cleared wholesale;
 *   3. if ANY server delete rejected, only the server-confirmed rows leave
 *      local state (the failed rows stay visible — they still exist on the
 *      server) and the handler REJECTS so the confirm UI can't present a
 *      wipe that didn't happen.
 *
 * The AccountDataPrivacySection child is mocked to capture the
 * onDeleteAllSettlements prop, so the handler is exercised directly — its
 * rejection is the assertion target, not an unhandled escape through the
 * child's confirm flow.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, fireEvent, within } from '@testing-library/react';

afterEach(cleanup);

// Analytics is fire-and-forget; stub it so mounting the real sections stays
// quiet (mirrors accountPage.smoke.test.jsx).
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Saves service — the server leg under test. delete is re-pointed per test.
const deleteMock = vi.fn();
vi.mock('../../src/lib/saves.js', () => ({
  saves: { delete: (...args) => deleteMock(...args) },
  newSaveId: () => 'test-save-id',
}));

// Capture the Data & Privacy section's props instead of rendering the real
// confirm flow; the handler contract is what's under test.
let dataSectionProps = null;
vi.mock('../../src/components/account/AccountDataPrivacySection.jsx', () => ({
  default: (props) => { dataSectionProps = props; return null; },
}));

// Store mock — a signed-in free user with three saved settlements. Mirrors
// the smoke test's singleton-selector pattern.
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
  savedSettlements: [{ id: 's1' }, { id: 's2' }, { id: 's3' }],
  campaigns: [],
  maxSaves: () => 3,
  canSave: () => true,
  importAccountData: vi.fn().mockResolvedValue({ ok: true }),
  authSignOut: vi.fn(),
  setAuth: vi.fn(),
  authGetSecurityQuestionIds: vi.fn().mockResolvedValue([]),
  authSetSecurityAnswers: vi.fn().mockResolvedValue(undefined),
  removeSavedSettlement: vi.fn(),
  clearSavedSettlements: vi.fn(),
  deleteCampaign: vi.fn(),
  productPrefs: {
    defaultDetailLevel: 'guided', galleryPublicDefault: false, shareDefault: 'unlisted',
    playerViewDefault: false, pdfStyle: 'classic', aiPolishDefault: false, campaignMapAutosave: true,
  },
  setProductPref: vi.fn(),
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
  deleteMock.mockReset();
  storeState.removeSavedSettlement.mockClear();
  storeState.clearSavedSettlements.mockClear();
});

async function mountDataSection() {
  const AccountPage = (await import('../../src/components/AccountPage.jsx')).default;
  render(<AccountPage onNavigateAdmin={() => {}} />);
  const nav = document.querySelector('nav[aria-label="Account settings"]');
  fireEvent.click(within(nav).getByRole('button', { name: 'Data' }));
  expect(dataSectionProps).not.toBeNull();
  return dataSectionProps;
}

describe('AccountPage — handleDeleteAllSettlements server-result inspection', () => {
  test('all server deletes succeed → every id deleted server-side, local state cleared', async () => {
    deleteMock.mockResolvedValue(undefined);
    const props = await mountDataSection();

    await expect(props.onDeleteAllSettlements()).resolves.toBeUndefined();

    expect(deleteMock.mock.calls.map(c => c[0]).sort()).toEqual(['s1', 's2', 's3']);
    expect(storeState.clearSavedSettlements).toHaveBeenCalledTimes(1);
  });

  test('a failed server delete → handler rejects, local state keeps the failed row', async () => {
    deleteMock.mockImplementation(id =>
      id === 's2' ? Promise.reject(new Error('row-level security violation')) : Promise.resolve()
    );
    const props = await mountDataSection();

    // The handler must NOT report success: a swallowed failure here means the
    // confirm UI shows a clean wipe while s2 survives on the server and
    // resurrects at next sign-in.
    await expect(props.onDeleteAllSettlements()).rejects.toThrow(/1 of 3/);

    // Wholesale clear must not run — that would drop s2 locally too.
    expect(storeState.clearSavedSettlements).not.toHaveBeenCalled();
    // Only the server-confirmed rows leave local state.
    const removed = storeState.removeSavedSettlement.mock.calls.map(c => c[0]).sort();
    expect(removed).toEqual(['s1', 's3']);
  });
});
