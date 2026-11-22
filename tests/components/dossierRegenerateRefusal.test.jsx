/** @vitest-environment jsdom */
/**
 * dossierRegenerateRefusal.test.jsx — THE DOSSIER'S REGENERATE SAYS WHY IT STOPPED.
 *
 * ── THE DEFECT (REVIEW-P F3, the anonymous public-path walk, 2026-09-20) ───────
 * ⛔ NO GATE REFUSES SILENTLY (owner ruling, ODQ §934.24(c)). Every OTHER generation
 * surface had been threaded through primitives/RefusalNotice.jsx; the dossier — the
 * surface a visitor reaches LAST, after the forge has already worked — had no mount
 * at all. The walk measured it exactly: after one generation and two rerolls
 * (`sf.anon.gens = {"date":"2026-09-20","full":1,"reroll":2}`) a fourth click on the
 * sticky toolbar's "↻ Regenerate draft" left the settlement unchanged (Anyuan →
 * Anyuan), set `lastRefusal = {"reason":"dailyCap","vars":null}` on the store, and
 * rendered ZERO role="alert" / role="status" nodes. The button stayed enabled and its
 * label never changed. The receipt is `cap-desktop-r4.png`: a completely unchanged
 * screen.
 *
 * ── WHAT IS PROVED HERE ────────────────────────────────────────────────────────
 * The dossier branch is MOUNTED with a settlement on screen, the toolbar's own
 * control is CLICKED, the store's `generateSettlement` behaves exactly as the lane
 * does at a gate (records a reason, returns null), and the rendered words are read
 * back off the DOM. The copy is derived through `refusalCopy`, never typed here, so a
 * re-worded sentence moves this file's expectations with it.
 *
 * THE ARM CARRIES ITS CONTROLS: with nothing refused the dossier stays quiet (so the
 * assertion is a real absence rather than an unmounted surface), and a recorded reason
 * SUPPRESSES the generic re-roll error line — two alerts for one click is the doubling
 * F12 found on /create, and it must not be re-introduced here.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { REFUSAL_REASONS, refusalOf } from '../../src/lib/refusalReasons.js';
import { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import { t } from '../../src/copy/index.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn(), homepageView: vi.fn(), anonGenerationCompleted: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));
vi.mock('../../src/lib/flags.js', () => ({ flag: vi.fn(() => false) }));
vi.mock('../../src/lib/anonGenCounter.js', () => ({
  anonAtCap: vi.fn(() => false), anonFullRemaining: () => 1, anonRerollRemaining: () => 2,
}));
vi.mock('../../src/lib/saves.js', () => ({ saves: { save: vi.fn(() => Promise.resolve()) } }));
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false, getIsMobile: () => false }));
// The dossier BODY is not the subject: it is a lazy chunk with its own store surface,
// and mounting it would make this arm a measurement of OutputContainer. The toolbar,
// the notice and the handler between them are what is on trial.
vi.mock('../../src/components/OutputContainer.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/generate/SaveToLibraryButton.jsx', () => ({ SaveToLibraryButton: () => null }));
vi.mock('../../src/components/BuyThisDossier.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/generate/ExportDraftButton.jsx', () => ({ default: () => null }));

const SETTLEMENT = { name: 'Anyuan', tier: 'village', population: 624 };

/** One mutable store; every selector reads it live, as the app's does. */
const storeState = {
  settlement: SETTLEMENT,
  activeSaveId: null,
  config: { settType: 'random' },
  wizardStep: 0,
  wizardMode: null,
  loadedFromSave: null,
  importedNeighbour: null,
  pipelineRevealActive: false,
  auth: { tier: 'anon', user: null, role: 'user' },
  aiSettlement: null,
  lastRefusal: null,
  institutionToggles: {},
  goodsToggles: {},
  canSave: () => false,
  generateSettlement: vi.fn(),
  clearRefusal: vi.fn(() => { storeState.lastRefusal = null; }),
  setWizardStep: vi.fn(),
  setWizardMode: vi.fn(),
  clearLoadedFromSave: vi.fn(),
  clearNeighbour: vi.fn(),
  clearSettlement: vi.fn(),
  dismissPipelineReveal: vi.fn(),
  setSettlement: vi.fn(),
  updateConfig: vi.fn(),
  setRandomSliderMode: vi.fn(),
  setPurchaseModalOpen: vi.fn(),
  isTierAllowed: () => true,
  canCustomizePreGeneration: () => true,
  maxSaves: () => 0,
  isElevated: () => false,
  savedSettlements: [],
  selectedSettlementId: null,
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

/**
 * The lane's own behaviour at a gate: record the reason, stamp the click that earned
 * it, return null. The stamp matters here — the toolbar's notice renders only what
 * THIS surface raised, so a mock that dropped `at` would measure the unkeyed path and
 * miss a wizard that had stopped naming itself.
 */
const refusesWith = (reason, vars = null) => vi.fn(async (_seed, options) => {
  storeState.lastRefusal = refusalOf(reason, vars, options?.at ?? null);
  return null;
});

const capWords = () => refusalCopy(REFUSAL_REASONS.DAILY_CAP);

async function renderDossier() {
  const GenerateWizard = (await import('../../src/components/GenerateWizard.jsx')).default;
  render(<GenerateWizard isMobile={false} onSignIn={() => {}} onNavigate={() => {}} />);
  return screen.getByRole('button', { name: /regenerate draft/i });
}

beforeEach(() => {
  storeState.settlement = SETTLEMENT;
  storeState.lastRefusal = null;
  storeState.generateSettlement = vi.fn();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('The dossier toolbar — the fourth regenerate is not a dead click', () => {
  test('a spent allowance is ANNOUNCED where the reader clicked', async () => {
    storeState.generateSettlement = refusesWith(REFUSAL_REASONS.DAILY_CAP);
    fireEvent.click(await renderDossier());

    const said = (await screen.findByRole('alert')).textContent;
    expect(said).toContain(capWords().rubric);
    expect(said).toContain('free settlements are spent');
  });

  test('the toolbar raises exactly ONE notice, not two', async () => {
    storeState.generateSettlement = refusesWith(REFUSAL_REASONS.DAILY_CAP);
    fireEvent.click(await renderDossier());

    await screen.findByRole('alert');
    expect(
      screen.getAllByRole('alert'),
      'one click painted more than one live region on the dossier',
    ).toHaveLength(1);
  });

  test('the TIER refusal reaches the dossier too, with its own sentence', async () => {
    storeState.generateSettlement = refusesWith(REFUSAL_REASONS.TIER, { size: 'City', max: 'Town' });
    fireEvent.click(await renderDossier());

    const said = (await screen.findByRole('alert')).textContent;
    expect(said).toContain(refusalCopy(REFUSAL_REASONS.TIER, { size: 'City', max: 'Town' }).rubric);
    // The sentence resolved to real words rather than to a dotted key or a leftover
    // placeholder — RefusalNotice renders NOTHING for a reason it cannot resolve, so
    // this is what separates "said it" from "said the key".
    // anchored: `said` is proven on the line above to carry the tier rubric, so this is a real absence in a real notice.
    expect(said).not.toMatch(/refusals\.|\{[a-z]+\}/i);
  });

  test('CONTROL: with nothing refused the dossier is quiet', async () => {
    storeState.generateSettlement = vi.fn(async () => SETTLEMENT);
    fireEvent.click(await renderDossier());

    expect(storeState.lastRefusal).toBeNull();
    // anchored: the click above is proven to have run the forge and recorded nothing,
    // so an empty alert set here is silence rather than an unmounted surface.
    expect(storeState.generateSettlement).toHaveBeenCalled();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  test('CONTROL: a recorded reason suppresses the generic re-roll error line', async () => {
    // A throw leaves BOTH: the lane records the reason before it re-throws, and the
    // wizard's catch sets its own generateError. Only the reason is said.
    vi.spyOn(console, 'error').mockImplementation(() => {});
    storeState.generateSettlement = vi.fn(async () => {
      storeState.lastRefusal = refusalOf(REFUSAL_REASONS.STALE_BUILD);
      throw new Error('Failed to fetch dynamically imported module');
    });
    fireEvent.click(await renderDossier());

    const said = (await screen.findByRole('alert')).textContent;
    expect(said).toContain(refusalCopy(REFUSAL_REASONS.STALE_BUILD).rubric);
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    // anchored: `said` is proven on the two lines above to be a real, resolved notice,
    // so the absence below is the generic line being suppressed rather than nothing
    // having rendered at all.
    expectAbsentWithAnchor(said, t('errors.generateFail'), refusalCopy(REFUSAL_REASONS.STALE_BUILD).rubric,
      'the generic re-roll error line rendered beside the recorded reason');
  });
});
