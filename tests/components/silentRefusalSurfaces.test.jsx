/** @vitest-environment jsdom */
/**
 * silentRefusalSurfaces.test.jsx — THE THREE SURFACES THE CURE HAD NOT REACHED.
 *
 * ── THE CLASS, AND WHY IT SURVIVED ITS OWN CURE ────────────────────────────────
 * ⛔ NO GATE REFUSES SILENTLY (owner ruling, ODQ §934.24(c)). The generation lane
 * records WHY it refused and four surfaces were wired to render it. Three were not,
 * and an adversarial review of the second wave found each one with a receipt:
 *
 *   generate/LayeredConfigurationPanel.jsx  SeedField.forge — `await generate(seed)`
 *     with no null check, no catch, and a `finally` that cleared the spinner. A visitor
 *     typing an exact seed at their cap watched the button think, and stop.
 *   HomeHero.jsx — turned the null into a hand-made throw, so the catch rendered
 *     `errors.forgeStart` ("The forge stalled… Try once more") OVER the recorded
 *     reason. "Try once more" is false advice at a cap: the retry cannot succeed.
 *   SettlementsPanel.jsx — answered EVERY null with the purchase modal, so a spent
 *     allowance or a failed chunk was shown a checkout for a problem money does not fix.
 *
 * ── WHAT IS PROVED HERE ────────────────────────────────────────────────────────
 * Each surface is MOUNTED and CLICKED, with the store's `generateSettlement` behaving
 * exactly as the lane does — recording a reason and returning null — and the rendered
 * words are read back off the DOM. The copy is derived through `refusalCopy`, never
 * typed here, so a re-worded sentence moves this file's expectations with it.
 *
 * EACH ARM CARRIES ITS CONTROL: a real THROW must still reach `errors.forgeStart`, and
 * the purchase modal must still open for the one reason that has a door to sell.
 *
 * ⚠ ONE ARM IS NOT ABOUT SILENCE, and it is here because it is the same click. The
 * Library's fork also omitted the curated-seed INTENT (ODQ §934.24(b)) that its twin on
 * /create passes, so the same fork spent the day's allowance on one surface and was
 * exempt on the other. Pinned beside the refusal arms rather than in a file of its own:
 * one mount, one click, two properties of the same handler.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { GENERATION_INTENT_SAMPLE_FORK } from '../../src/lib/generationIntent.js';
import { REFUSAL_REASONS, refusalOf } from '../../src/lib/refusalReasons.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import { t } from '../../src/copy/index.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

vi.mock('../../src/components/home/WelcomeBackCard.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/AnonTierTeaser.jsx', () => ({ default: () => null }));
// The Create panel's heavy Deep-constraints editors are not the subject here and each
// wants a store surface of its own; SeedField is what is on trial. Stubbed to nothing so
// the arm measures the seed field's refusal wiring rather than a mount budget.
vi.mock('../../src/components/InstitutionalGrid.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/ServicesTogglePanel.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/TradeDynamicsPanel.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/generate/PlaceInRegionCard.jsx', () => ({ default: () => null }));
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false, getIsMobile: () => false }));
vi.mock('../../src/lib/anonGenCounter.js', () => ({
  anonAtCap: () => false,
  anonFullRemaining: () => 1,
  anonRerollRemaining: () => 2,
}));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { homepageView: vi.fn(), anonGenerationCompleted: vi.fn(), track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));
vi.mock('../../src/lib/staleDeploy.js', () => ({
  recoverFromChunkError: async () => 'none',
  isChunkLoadError: () => false,
}));
vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    list: vi.fn(() => Promise.resolve([])),
    mutateBatch: vi.fn(() => Promise.resolve()),
    save: vi.fn(() => Promise.resolve('save-1')),
    reactivateFreeSettlement: vi.fn(() => Promise.resolve({ ok: true })),
  },
}));

/**
 * ONE mutable store for all three surfaces. Every selector reads it live, and each
 * surface's own `setState` after the await is what re-renders it — exactly the sequence
 * that decides whether the reader ever sees the reason.
 */
const storeState = {
  generateSettlement: vi.fn(),
  updateConfig: vi.fn(),
  setWizardMode: vi.fn(),
  setSelectedSettlementId: vi.fn(),
  setRandomSliderMode: vi.fn(),
  setInstitutionToggles: vi.fn(),
  setCategoryToggles: vi.fn(),
  setGoodsToggles: vi.fn(),
  setServiceToggles: vi.fn(),
  setSettlement: vi.fn(),
  setLoadedFromSave: vi.fn(),
  clearLoadedFromSave: vi.fn(),
  setPurchaseModalOpen: vi.fn(),
  setActiveSaveId: vi.fn(),
  applyCosmeticRename: vi.fn(),
  setSavedSettlements: vi.fn(() => true),
  clearSavedSettlements: vi.fn(),
  canUseCustomContent: () => false,
  getCustomContentCount: () => 0,
  canCustomizePreGeneration: () => true,
  isTierAllowed: () => true,
  maxSaves: () => 0,
  canSave: () => false,
  isElevated: () => false,
  auth: { tier: 'anon', user: null, displayName: null },
  config: { ...DEFAULT_CONFIG },
  lastSeed: null,
  lastRefusal: null,
  clearRefusal: vi.fn(() => { storeState.lastRefusal = null; }),
  savedSettlements: [],
  savedSettlementsLoaded: false,
  savedSettlementsOwnerId: null,
  savedSettlementsHydrationGeneration: 0,
  selectedSettlementId: null,
  clearSelectedSettlementId: vi.fn(),
  campaigns: [],
  createCampaign: vi.fn(),
  renameCampaign: vi.fn(),
  deleteCampaign: vi.fn(),
  toggleCampaignCollapsed: vi.fn(),
  addToCampaign: vi.fn(),
  removeFromCampaign: vi.fn(),
  getCampaignMembershipBlock: vi.fn(),
  getSettlementDeletionBlock: vi.fn(),
  canonizeSavedSettlement: vi.fn(),
  setActiveCampaign: vi.fn(),
  advanceCampaignWorld: vi.fn(),
  discoverCampaignRegionalChannels: vi.fn(),
  setRegionalChannelStatus: vi.fn(),
  applyQueuedRegionalImpact: vi.fn(),
  ignoreQueuedRegionalImpact: vi.fn(),
  resolveRegionalImpact: vi.fn(),
  advanceCampaignRegionalImpacts: vi.fn(),
  applyAllQueuedRegionalImpacts: vi.fn(),
  ignoreAllQueuedRegionalImpacts: vi.fn(),
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

/** The lane's own behaviour at a gate: record the reason, return null. */
const refusesWith = (reason, vars = null) => vi.fn(async () => {
  storeState.lastRefusal = refusalOf(reason, vars);
  return null;
});

const capWords = () => refusalCopy(REFUSAL_REASONS.DAILY_CAP);

beforeEach(() => {
  storeState.lastRefusal = null;
  storeState.generateSettlement = vi.fn();
  storeState.setPurchaseModalOpen = vi.fn();
  storeState.auth = { tier: 'anon', user: null, displayName: null };
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('HomeHero — a gate is not a stall', () => {
  test('a refusal renders the RECORDED reason, not the generic failure', async () => {
    storeState.generateSettlement = refusesWith(REFUSAL_REASONS.DAILY_CAP);
    const HomeHero = (await import('../../src/components/HomeHero.jsx')).default;
    render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /forge a /i }));

    const said = (await screen.findByRole('alert')).textContent;
    expect(said).toContain(capWords().rubric);
    expect(said).toContain('free settlements are spent');
    // anchored: `said` is proven on the two lines above to carry the cap's own rubric
    // and sentence, so the absence below is a real absence in a real notice.
    expectAbsentWithAnchor(said, t('errors.forgeStart'), capWords().rubric,
      'the generic stall sentence overwrote the recorded reason');
  });

  test('CONTROL: a real throw still reaches errors.forgeStart', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    storeState.generateSettlement = vi.fn(async () => { throw new Error('engine unavailable'); });
    const HomeHero = (await import('../../src/components/HomeHero.jsx')).default;
    render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /forge a /i }));
    expect((await screen.findByRole('alert')).textContent).toContain(t('errors.forgeStart'));
  });
});

describe('SeedField — the exact-seed forge says why it stopped', () => {
  // SeedField is ADVANCED-only (the panel mounts it behind `advanced &&`).
  async function renderPanel() {
    const Panel = (await import('../../src/components/generate/LayeredConfigurationPanel.jsx')).default;
    return render(<Panel mode="advanced" showPlaceInRegion={false} />);
  }

  test('a refusal on an exact seed is announced where the reader typed it', async () => {
    storeState.generateSettlement = refusesWith(REFUSAL_REASONS.DAILY_CAP);
    await renderPanel();
    fireEvent.change(screen.getByLabelText('Exact seed'), { target: { value: 'ABC-123' } });
    fireEvent.click(screen.getByRole('button', { name: /forge seed/i }));

    const said = (await screen.findByRole('alert')).textContent;
    expect(said).toContain(capWords().rubric);
    expect(storeState.generateSettlement).toHaveBeenCalledWith('ABC-123');
  });

  test('CONTROL: with nothing refused the field is quiet', async () => {
    storeState.generateSettlement = vi.fn(async () => ({ name: 'Forged', tier: 'town' }));
    await renderPanel();
    fireEvent.change(screen.getByLabelText('Exact seed'), { target: { value: 'ABC-123' } });
    fireEvent.click(screen.getByRole('button', { name: /forge seed/i }));
    expect(storeState.lastRefusal).toBeNull();
    // anchored: the forge above is proven to have run and recorded nothing, so an empty
    // alert set here means silence rather than an unmounted surface.
    expect(screen.queryByRole('alert')).toBeNull();
  });
});

describe('The Library fork — a null is not always a price, and a fork is not a generation', () => {
  async function renderPanel() {
    const SettlementsPanel = (await import('../../src/components/SettlementsPanel.jsx')).default;
    render(<SettlementsPanel onNavigate={() => {}} />);
    return (await screen.findAllByRole('button', { name: /fork this sample/i }))[0];
  }

  test('a CAP refusal is said, and no checkout is opened', async () => {
    storeState.generateSettlement = refusesWith(REFUSAL_REASONS.DAILY_CAP);
    fireEvent.click(await renderPanel());

    const said = (await screen.findByRole('alert')).textContent;
    expect(said).toContain(capWords().rubric);
    expect(
      storeState.setPurchaseModalOpen,
      'a spent daily allowance was answered with a checkout',
    ).not.toHaveBeenCalled();
  });

  test('the fork declares its curated-seed INTENT, as the create strip already did', async () => {
    // ⛔ THE SAME CLICK ON TWO SURFACES MUST COST THE SAME (ODQ §934.24(b)). FoundingWorlds
    // has passed the intent since the ruling; this door had not, so forking Mossgate from
    // the Library spent the day's allowance while forking it from /create did not.
    storeState.generateSettlement = vi.fn(async () => ({ name: 'Forked', tier: 'town' }));
    fireEvent.click(await renderPanel());

    await waitFor(() => expect(storeState.generateSettlement).toHaveBeenCalledTimes(1));
    const [seed, options] = storeState.generateSettlement.mock.calls[0];
    expect(typeof seed, 'the seed is still the generation ARGUMENT').toBe('string');
    expect(options, 'the Library fork is capped like an ordinary generation')
      .toEqual({ intent: GENERATION_INTENT_SAMPLE_FORK });
    // …and it never rides the persisted config, where it would outlive the fork.
    const patch = storeState.updateConfig.mock.calls.at(-1)[0];
    expect(Object.hasOwn(patch, 'intent'), 'the INTENT reached the persisted config').toBe(false);
  });

  test('CONTROL: the TIER refusal still opens the door it can actually sell', async () => {
    storeState.generateSettlement = refusesWith(REFUSAL_REASONS.TIER, { size: 'City', max: 'Town' });
    fireEvent.click(await renderPanel());

    await screen.findByRole('alert');
    expect(storeState.setPurchaseModalOpen).toHaveBeenCalledWith(true);
  });
});
