/** @vitest-environment jsdom */
/**
 * launchLock.upsells.test.jsx - the pre-launch lockout over the in-product upsell CTAs.
 *
 * THE OWNER (2026-09-16): "disable all purchase buttons on the website until we are
 * ready to launch. People can make accounts but temporarily, all buttons for purchase
 * including subscriptions are to have a pill that says available at launch."
 *
 * purchasesOpen() (src/lib/launchGate.js) is NOT mocked here, so this test build is
 * CLOSED: every upsell CTA below must render disabled with the "Available at launch"
 * pill inside it. The open (post-launch) behavior of the same controls stays pinned by
 * their own suites, which mock the gate open (lockedDestination, versionsTab,
 * deityAssignmentPanel, heraldMobileCompanion). Where a component also renders a
 * control that is NOT a purchase (the premium Instant World toggle, the anonymous
 * Realm sign-in, a premium viewer's gallery Import, the lapsed patron's Remove), that
 * control is pinned live in the same closed build, so the gate is shown to be scoped
 * rather than blanket.
 *
 * The render setups (store shapes, props, child stubs) are the ones the components'
 * existing suites use.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';

// ── Shared mocks ─────────────────────────────────────────────────────────────
// One mutable store object behind every selector (each test resets it).
const state = {};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(state); }
  useStore.getState = () => state;
  useStore.subscribe = () => () => {};
  return { useStore };
});
function setStore(next) {
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, next);
}

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));
vi.mock('../../src/lib/pricingMoments.js', () => ({ triggerPricingMoment: vi.fn() }));

// GalleryDetail's heavy children (the galleryDetailRestore stubs).
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/lib/seoDossier.js', () => ({ setSharedDossierMeta: vi.fn() }));
vi.mock('../../src/components/PublicDossierView.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryComments.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryMoreByCreator.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryImage.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryReactionChips.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryReportDialog.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/VoteButton.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/AlivenessBadge.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/ShareToGallery.jsx', () => ({ default: () => null }));

import { purchasesOpen } from '../../src/lib/launchGate.js';
import { CustomContentUpsell } from '../../src/components/compendium/CustomContentGate.jsx';
import PlaceInRegionCard from '../../src/components/generate/PlaceInRegionCard.jsx';
import InstantWorldEntry from '../../src/components/instant/InstantWorldEntry.jsx';
import LockedDestination from '../../src/components/primitives/LockedDestination.jsx';
import DeityAssignmentPanel from '../../src/components/settlement/DeityAssignmentPanel.jsx';
import { EventComposerDeityField } from '../../src/components/settlement/eventComposer/EventComposerDeityField.jsx';
import FaithSection from '../../src/components/settlement/FaithSection.jsx';
import GalleryDetail from '../../src/components/gallery/GalleryDetail.jsx';
import RealmDashboard from '../../src/components/map/RealmDashboard.jsx';

const PILL = 'Available at launch';

/** The control is disabled and the pill sits INSIDE it. */
function expectLockedWithPill(button) {
  expect(button.tagName).toBe('BUTTON');
  expect(button.disabled).toBe(true);
  expect(within(button).getByText(PILL)).toBeTruthy();
  expect(button.querySelector('[data-launch-pill]')?.textContent).toBe(PILL);
}

/** A non-purchase control stays live and wears no pill. */
function expectLiveWithoutPill(button) {
  expect(button.tagName).toBe('BUTTON');
  expect(button.disabled).toBe(false);
  expect(button.querySelector('[data-launch-pill]')).toBeNull();
}

beforeEach(() => setStore({}));
afterEach(() => cleanup());

describe('launch lock: the build under test is closed', () => {
  it('purchasesOpen() is false here, so every assertion below measures the closed state', () => {
    expect(purchasesOpen()).toBe(false);
  });
});

describe('launch lock: upsell CTAs are disabled and wear the pill while purchases are closed', () => {
  it('CustomContentUpsell: "Upgrade to Premium" (signed-in free user)', () => {
    setStore({ setPurchaseModalOpen: vi.fn() });
    render(<CustomContentUpsell existingCount={0} isAnon={false} />);
    expectLockedWithPill(screen.getByText('Upgrade to Premium', { selector: 'button' }));
  });

  // The ANONYMOUS arm used to be a bare sentence with no control at all. It now
  // carries both doors, and they are governed differently on purpose: making an
  // account is not a purchase and stays live, while the tier door is the same
  // conversion CTA every sibling renders and closes until launch.
  it('CustomContentUpsell: the anonymous tier door is locked, its Sign in is not', () => {
    setStore({ setPurchaseModalOpen: vi.fn() });
    render(<CustomContentUpsell existingCount={0} isAnon />);
    expectLockedWithPill(screen.getByText('See Cartographer', { selector: 'button' }));
    expectLiveWithoutPill(screen.getByText('Sign in', { selector: 'button' }));
  });

  it('PlaceInRegionCard: the non-premium "Upgrade" teaser CTA', () => {
    setStore({
      config: {},
      updateConfig: () => {},
      campaigns: [],
      customContent: {},
      canUseCustomContent: () => false,
      setPurchaseModalOpen: vi.fn(),
    });
    render(<PlaceInRegionCard />);
    expectLockedWithPill(screen.getByText('Upgrade', { selector: 'button' }));
  });

  it('InstantWorldEntry: the non-premium "See Cartographer" reach is locked, the premium toggle is not', () => {
    const base = {
      isElevated: () => false,
      instantWorld: vi.fn(),
      instantWorldBusy: false,
      setPurchaseModalOpen: vi.fn(),
      setActivePricingMoment: vi.fn(),
      displayPrefs: { realmMagicChoice: 'yes' },
      setRealmMagicChoice: vi.fn(),
    };
    setStore({ ...base, auth: { tier: 'free' } });
    render(<InstantWorldEntry />);
    const reach = screen.getByTestId('instant-world-open');
    expect(reach.textContent).toMatch(/^See Cartographer/);
    expectLockedWithPill(reach);
    // The Realm sidebar is narrower than label plus pill: the locked reach must be
    // able to wrap the pill under its label, or the card clips both ends ("ee
    // Premium", owner orders 2026-09-17). The premium toggle below stays unwrapped.
    expect(reach.style.flexWrap).toBe('wrap');

    // The premium user's open button is not a purchase: live, no pill, same label.
    cleanup();
    setStore({ ...base, auth: { tier: 'premium' } });
    render(<InstantWorldEntry />);
    const toggle = screen.getByTestId('instant-world-open');
    expect(toggle.textContent).toBe('Build a realm');
    expectLiveWithoutPill(toggle);
    expect(toggle.style.flexWrap).toBe('');
  });

  it('LockedDestination: the upsell CTA ("See Cartographer" on the Versions tab)', () => {
    setStore({ setPurchaseModalOpen: vi.fn() });
    render(
      <LockedDestination
        feature="Version history"
        eyebrow="Cartographer · Version history"
        headline="Every change, on a timeline you can roll back."
        body="Auto-snapshot on canonize, manual snapshot on demand."
        ctaLabel="See Cartographer"
      />,
    );
    // The pitch still renders; only the purchase CTA is locked.
    expect(screen.getByText('Every change, on a timeline you can roll back.')).toBeTruthy();
    expectLockedWithPill(screen.getByText('See Cartographer', { selector: 'button' }));
  });

  it('DeityAssignmentPanel: the free-tier "Upgrade to premium" upsell', () => {
    setStore({
      settlement: { tier: 'town', config: {} },
      customContent: { deities: [] },
      setPrimaryDeity: vi.fn(),
      imposeCult: vi.fn(),
      canUseCustomContent: () => false,
      setPurchaseModalOpen: vi.fn(),
    });
    render(<DeityAssignmentPanel />);
    const upsell = screen.getByTestId('deity-assignment-upsell');
    expectLockedWithPill(within(upsell).getByText('Upgrade to premium', { selector: 'button' }));
  });

  it('DeityAssignmentPanel: the lapsed renew "Upgrade to premium" is locked, the SHED Remove stays live', () => {
    setStore({
      settlement: {
        tier: 'town',
        config: {
          primaryDeityRef: 'deity:lu_aur:aurelion',
          primaryDeitySnapshot: { name: 'Aurelion', alignmentAxis: 'good', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun' },
        },
      },
      customContent: { deities: [] },
      setPrimaryDeity: vi.fn(),
      imposeCult: vi.fn(),
      canUseCustomContent: () => false,
      setPurchaseModalOpen: vi.fn(),
    });
    render(<DeityAssignmentPanel />);
    expect(screen.getByTestId('deity-assignment-readonly')).toBeTruthy();
    expectLockedWithPill(screen.getByText('Upgrade to premium', { selector: 'button' }));
    // Removing owned faith content is not a purchase.
    expectLiveWithoutPill(screen.getByTestId('lapsed-clear-patron'));
  });

  it('EventComposerDeityField: the patron and cult "Upgrade to premium" upsells', () => {
    const props = {
      settlement: { tier: 'town', config: {} },
      customContent: {},
      canUseCustom: false,
      setPurchaseModalOpen: vi.fn(),
      deityRef: '',
      setDeityRef: vi.fn(),
      deityMode: 'assign',
      setDeityMode: vi.fn(),
      cultRemoveRef: '',
      setCultRemoveRef: vi.fn(),
    };
    for (const type of ['SET_PRIMARY_DEITY', 'IMPOSE_CULT']) {
      render(<EventComposerDeityField type={type} {...props} />);
      expectLockedWithPill(screen.getByText('Upgrade to premium', { selector: 'button' }));
      cleanup();
    }
  });

  it('FaithSection: the free-tier teaser "Awaken the pantheon" CTA', () => {
    setStore({
      auth: { tier: 'free' },
      isElevated: () => false,
      setPurchaseModalOpen: vi.fn(),
      setActivePricingMoment: vi.fn(),
    });
    render(<FaithSection settlement={{ config: {} }} />);
    expect(screen.getByTestId('faith-teaser')).toBeTruthy();
    expectLockedWithPill(screen.getByText(/^Awaken the pantheon/, { selector: 'button' }));
  });

  it('GalleryDetail: the non-premium "Import (premium)" step is locked, the premium Import is not', () => {
    setStore({ savedSettlements: [] });
    const dossier = {
      id: 'd1', slug: 'x', name: 'Xtown',
      settlement: { name: 'Xtown', population: 500, config: { terrain: 'forest' } },
      tags: [], importable: true, netVotes: 0, viewCount: 0, commentCount: 0,
      voteState: {}, reactionState: {},
    };
    render(<GalleryDetail dossier={dossier} auth={{ user: { id: 'u1' }, tier: 'free' }} onNavigate={vi.fn()} onVote={vi.fn()} />);
    expectLockedWithPill(screen.getByText('Import (premium)', { selector: 'button' }));

    cleanup();
    render(<GalleryDetail dossier={dossier} auth={{ user: { id: 'u1' }, tier: 'premium' }} onNavigate={vi.fn()} onVote={vi.fn()} onImport={vi.fn()} />);
    expectLiveWithoutPill(screen.getByText('Import', { selector: 'button' }));
  });

  it('RealmDashboard: the tier door is locked for both tiers, the anonymous sign-in is not', () => {
    setStore({ savedSettlements: [], setActivePricingMoment: vi.fn() });
    render(<RealmDashboard campaign={null} canManageCampaigns={false} tier="free" onUpgrade={vi.fn()} />);
    expect(screen.getByTestId('realm-dashboard-locked')).toBeTruthy();
    expectLockedWithPill(screen.getByText('See Cartographer', { selector: 'button' }));

    // The anonymous viewer gets BOTH doors, governed differently: the tier door
    // is the same conversion CTA and closes with it, while signing in (making an
    // account) is not a purchase and stays live. The old single CTA read "Sign
    // in to unlock the Realm", which was live but untrue — signing in does not
    // unlock the Realm.
    cleanup();
    render(<RealmDashboard campaign={null} canManageCampaigns={false} tier="anon" onUpgrade={vi.fn()} onSignIn={vi.fn()} />);
    expectLockedWithPill(screen.getByText('See Cartographer', { selector: 'button' }));
    expectLiveWithoutPill(screen.getByText('Sign in', { selector: 'button' }));
  });
});
