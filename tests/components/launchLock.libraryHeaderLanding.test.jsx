/** @vitest-environment jsdom */
/**
 * tests/components/launchLock.libraryHeaderLanding.test.jsx - the pre-launch lockout on
 * the Library, the desktop header and the landing (group library-header-landing).
 *
 * THE OWNER (2026-09-16): "disable all purchase buttons on the website until we are
 * ready to launch. People can make accounts but temporarily, all buttons for purchase
 * including subscriptions are to have a pill that says available at launch."
 *
 * The controls this file holds, each rendered in the state that shows it:
 *   1. SaveQuotaMeter's free-tier Upgrade (its anon Sign in sibling stays live);
 *   2. SettlementCard's "Free a slot or Upgrade" recovery button on a frozen row;
 *   3. SettlementCard's kebab-menu row "Advance time and run campaigns. Upgrade";
 *   4. the header's free-tier Upgrade, a row of the account menu on the painted arrow's
 *      blank plate (owner orders 2026-09-16: the header is the owner's painting, so
 *      credits, Upgrade and Admin moved into the plate's menu; App.jsx still decides the
 *      tier and passes the lock);
 *   5. LandingBelowFold's realm CTA, See Cartographer.
 *
 * CLOSED is the default and is exercised with launchGate.js REAL and unmocked: nothing
 * in the test env sets VITE_PURCHASES_OPEN, so purchasesOpen() is false. Each closed arm
 * asserts the control is disabled, the pill sits INSIDE it, and a click routes nowhere.
 *
 * OPEN is exercised through the gate's real switch, the build env: vi.stubEnv sets
 * VITE_PURCHASES_OPEN=true for one test, which is exactly how launch opens purchases
 * (a Vercel env change plus a redeploy). Each open arm asserts the control is enabled,
 * wears no pill, and routes as it did before the lockout.
 *
 * The App mount follows tests/components/landingFooterMigration.test.jsx (the store,
 * route, supabase, stripe and creditLedger mocks, and why the leaf creditLedger mock
 * exists). The mocked store also carries the three campaign block readers
 * SettlementCard calls during render (the tests/ui/frozenExportRightsFloor.test.jsx idiom).
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import { AVAILABLE_AT_LAUNCH } from '../../src/components/primitives/AvailableAtLaunchPill.jsx';
import { purchasesOpen } from '../../src/lib/launchGate.js';
import { landing } from '../../src/copy/landing.js';

const H = vi.hoisted(() => ({
  route: { view: 'compendium', params: {}, legacy: false, notFound: false },
  isMobile: false,
  storeState: null,
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: {},
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

vi.mock('../../src/hooks/useRoute.js', () => ({
  useRoute: () => H.route,
  navigate: vi.fn(),
  replacePath: vi.fn(),
}));

vi.mock('../../src/lib/supabase.js', () => ({
  hasStoredAuthToken: () => false,
  isConfigured: false,
  supabase: { auth: { getUser: () => Promise.resolve({ data: { user: null } }) } },
}));

vi.mock('../../src/hooks/useIsMobile', () => ({ default: () => H.isMobile }));

vi.mock('../../src/lib/stripe.js', () => ({
  checkCheckoutResult: () => null,
  fetchCreditBalance: () => Promise.resolve(0),
}));

// App.jsx's mount effect dynamically imports the real stripe.js past the mock above;
// mocking the leaf keeps its creditLedger import from landing after jsdom teardown
// (the full measurement is recorded in landingFooterMigration.test.jsx).
vi.mock('../../src/lib/creditLedger.js', () => ({
  fetchCreditBalanceFromLedger: () => Promise.resolve(0),
}));

vi.mock('../../src/components/pricing/PricingMomentCard.jsx', () => ({
  default: () => null,
}));

vi.mock('../../src/components/account/OperatorMessagesProvider.jsx', () => ({
  useOperatorMessages: () => ({ unreadCount: 0, refresh: vi.fn(async () => []) }),
}));

vi.mock('../../src/components/CompendiumPanel.jsx', () => ({
  default: () => <div data-testid="compendium-view">compendium</div>,
}));

function makeState(overrides = {}) {
  return {
    authModalOpen: false,
    setAuthModalOpen: vi.fn(),
    auth: { tier: 'free', displayName: 'Wanderer Test', role: null, user: { id: 'u-free' }, loading: false },
    isElevated: () => false,
    wizardMode: null,
    settlement: null,
    initAuth: vi.fn(),
    authSignOut: vi.fn(),
    onboardingNudge: null,
    clearOnboardingNudge: vi.fn(),
    purchaseModalOpen: false,
    setPurchaseModalOpen: vi.fn(),
    setCreditBalance: vi.fn(),
    creditBalance: 0,
    loadCampaigns: vi.fn(),
    loadCustomContentFromCloud: vi.fn(() => Promise.resolve()),
    migrateLocalCustomContentToCloud: vi.fn(() => Promise.resolve()),
    clearCloudCustomContent: vi.fn(),
    setActivePricingMoment: vi.fn(),
    canSave: () => true,
    activeSaveId: null,
    savedSettlements: [],
    campaignSyncError: null,
    clearCampaignSyncError: vi.fn(),
    // SettlementCard's render-time campaign reads (mutationBlocks).
    advanceInFlight: [],
    campaignMutationLocks: [],
    getSettlementDeletionBlock: () => null,
    getCampaignMutationBlock: () => null,
    getCampaignMembershipBlock: () => null,
    ...overrides,
  };
}

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(H.storeState);
  useStore.getState = () => H.storeState;
  return { useStore };
});

import App from '../../src/App.jsx';
import { navigate } from '../../src/hooks/useRoute.js';
import SaveQuotaMeter from '../../src/components/settlements/SaveQuotaMeter.jsx';
import { SettlementCard } from '../../src/components/settlements/SettlementCard.jsx';
import LandingBelowFold from '../../src/components/home/LandingBelowFold.jsx';

beforeEach(() => {
  H.route = { view: 'compendium', params: {}, legacy: false, notFound: false };
  H.isMobile = false;
  H.storeState = makeState();
  window.history.replaceState(null, '', '/compendium');
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

const openPurchases = () => vi.stubEnv('VITE_PURCHASES_OPEN', 'true');

/** The pill a control wears, or null. */
const pillIn = (control) => control.querySelector('[data-launch-pill]');

/** Asserts a control is locked: disabled, with the pill and its words inside it. */
function expectLocked(control) {
  expect(control.tagName).toBe('BUTTON');
  if (control.getAttribute('role') === 'menuitem') {
    // A locked MENU row is aria-disabled, not native-disabled, so the menu's arrow keys still
    // reach it and it reads its pill (WAI-ARIA APG); its click does nothing (asserted by
    // each arm).
    expect(control.getAttribute('aria-disabled')).toBe('true');
  } else {
    expect(control.disabled).toBe(true);
  }
  expect(pillIn(control)).toBeTruthy();
  expect(within(control).getByText(AVAILABLE_AT_LAUNCH)).toBeTruthy();
}

/** Asserts a control is live: enabled and wearing no pill (its label is the anchor). */
function expectLive(control, label) {
  expect(control.tagName).toBe('BUTTON');
  expect(control.textContent).toBe(label);
  expect(control.disabled).toBe(false);
  expect(control.hasAttribute('aria-disabled')).toBe(false);
  expect(pillIn(control)).toBeNull();
}

const cardProps = {
  allModifiers: new Map(),
  onView: vi.fn(),
  deleteId: null,
  setDeleteId: vi.fn(),
  deleteConfirmed: vi.fn(),
  campaigns: [],
  addToCampaign: vi.fn(),
  removeFromCampaign: vi.fn(),
  onCanonize: vi.fn(),
  currentCampaignId: null,
};

const draftSave = {
  id: 's-draft', name: 'Greenhollow', tier: 'town', timestamp: Date.now(),
  campaignState: { phase: 'draft' },
  settlement: { config: { monsterThreat: 'safe', tradeRouteAccess: 'road' } },
};

/** A frozen row whose owner has no free active slot: the recovery line renders. */
const frozenSave = { ...draftSave, id: 's-frozen', name: 'Stoneford', accessState: 'inactive_plan' };

function renderCard(props) {
  return render(<table><tbody><SettlementCard {...cardProps} {...props} /></tbody></table>);
}

const FREE_A_SLOT = 'Free a slot or Upgrade';

/** Open the header's account plate and return its Upgrade row (still a `header button`). */
async function headerUpgrade() {
  fireEvent.click(await screen.findByRole('button', { name: 'Account menu, Wanderer Test' }));
  const row = within(screen.getByRole('menu')).getByRole('menuitem', { name: /^Upgrade/ });
  expect(row.closest('header'), 'the menu stays inside the header').toBeTruthy();
  return row;
}
const MENU_UPGRADE = 'Advance time and run campaigns. Upgrade';

describe('closed (the default build): every purchase control here is locked and wears the pill', () => {
  test('the gate is closed in this test env, so the arms below measure the real default', () => {
    expect(purchasesOpen()).toBe(false);
  });

  test('SaveQuotaMeter: the free-tier Upgrade is disabled with the pill, and a click does not route', () => {
    const onUpgrade = vi.fn();
    render(<SaveQuotaMeter tier="free" used={3} max={3} onUpgrade={onUpgrade} />);
    const upgrade = screen.getByText('Upgrade', { selector: 'button' });
    expectLocked(upgrade);
    fireEvent.click(upgrade);
    expect(onUpgrade).not.toHaveBeenCalled();
  });

  test('SaveQuotaMeter: the anon Sign in is not a purchase and stays live', () => {
    const onSignIn = vi.fn();
    render(<SaveQuotaMeter tier="anon" used={0} max={0} onSignIn={onSignIn} />);
    const signIn = screen.getByText('Sign in', { selector: 'button' });
    expectLive(signIn, 'Sign in');
    fireEvent.click(signIn);
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  test('SettlementCard: "Free a slot or Upgrade" on a frozen row is disabled with the pill', () => {
    const onNavigate = vi.fn();
    renderCard({ s: frozenSave, canReactivate: false, onReactivate: vi.fn(), onNavigate });
    const recovery = screen.getByText(FREE_A_SLOT, { selector: 'button' });
    expectLocked(recovery);
    fireEvent.click(recovery);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  test('SettlementCard: the free-tier menu row "Advance time and run campaigns. Upgrade" is disabled with the pill', () => {
    const onNavigate = vi.fn();
    renderCard({ s: draftSave, canManageCampaigns: false, onNavigate });
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }));
    const row = screen.getByText(MENU_UPGRADE, { selector: 'button' });
    expectLocked(row);
    fireEvent.click(row);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  test('App header: the free-tier Upgrade is disabled with the pill, and a click does not route', async () => {
    render(<App />);
    const upgrade = await headerUpgrade();
    expectLocked(upgrade);
    navigate.mockClear();
    fireEvent.click(upgrade);
    expect(navigate).not.toHaveBeenCalledWith('pricing');
  });

  test('LandingBelowFold: See Cartographer is disabled with the pill, and a click does not route', () => {
    const onNavigate = vi.fn();
    render(<LandingBelowFold isMobile={false} onNavigate={onNavigate} />);
    const cta = screen.getByText(landing.realm.cta, { selector: 'button' });
    expectLocked(cta);
    fireEvent.click(cta);
    expect(onNavigate).not.toHaveBeenCalledWith('pricing');
    // The pricing links are information, not purchases, and stay live.
    const pricingLink = screen.getByText(landing.voice.pricingLink, { selector: 'button' });
    expectLive(pricingLink, landing.voice.pricingLink);
  });
});

describe('open (VITE_PURCHASES_OPEN=true): every control behaves exactly as before the lockout', () => {
  test('the build env switch opens the gate', () => {
    openPurchases();
    expect(purchasesOpen()).toBe(true);
  });

  test('SaveQuotaMeter: Upgrade is enabled, pill-free, and routes', () => {
    openPurchases();
    const onUpgrade = vi.fn();
    render(<SaveQuotaMeter tier="free" used={3} max={3} onUpgrade={onUpgrade} />);
    const upgrade = screen.getByText('Upgrade', { selector: 'button' });
    expectLive(upgrade, 'Upgrade');
    fireEvent.click(upgrade);
    expect(onUpgrade).toHaveBeenCalledTimes(1);
  });

  test('SettlementCard: "Free a slot or Upgrade" is enabled, pill-free, and routes to pricing', () => {
    openPurchases();
    const onNavigate = vi.fn();
    renderCard({ s: frozenSave, canReactivate: false, onReactivate: vi.fn(), onNavigate });
    const recovery = screen.getByText(FREE_A_SLOT, { selector: 'button' });
    expectLive(recovery, FREE_A_SLOT);
    expect(recovery.style.flexWrap).toBe('');
    fireEvent.click(recovery);
    expect(onNavigate).toHaveBeenCalledWith('pricing');
  });

  test('SettlementCard: the menu upgrade row is enabled, pill-free, closes the menu and routes to pricing', () => {
    openPurchases();
    const onNavigate = vi.fn();
    renderCard({ s: draftSave, canManageCampaigns: false, onNavigate });
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }));
    const row = screen.getByText(MENU_UPGRADE, { selector: 'button' });
    expectLive(row, MENU_UPGRADE);
    expect(row.style.flexWrap).toBe('');
    fireEvent.click(row);
    expect(onNavigate).toHaveBeenCalledWith('pricing');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  test('App header: Upgrade is enabled, pill-free, and routes to pricing', async () => {
    openPurchases();
    render(<App />);
    const upgrade = await headerUpgrade();
    expectLive(upgrade, 'Upgrade');
    navigate.mockClear();
    fireEvent.click(upgrade);
    expect(navigate).toHaveBeenCalledWith('pricing');
  });

  test('LandingBelowFold: See Cartographer is enabled, pill-free, and routes to pricing', () => {
    openPurchases();
    const onNavigate = vi.fn();
    render(<LandingBelowFold isMobile={false} onNavigate={onNavigate} />);
    const cta = screen.getByText(landing.realm.cta, { selector: 'button' });
    expectLive(cta, landing.realm.cta);
    fireEvent.click(cta);
    expect(onNavigate).toHaveBeenCalledWith('pricing');
  });
});
