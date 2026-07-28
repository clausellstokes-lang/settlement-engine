/** @vitest-environment jsdom */
/**
 * wizardBackOrigin.test.jsx — Back returns to the ENTRY origin.
 *
 * Owner order (2026-07-22): instant random generation → Back must return to the
 * instant-generation page; advanced-config generation → Back must return to the
 * advanced config. The Create flow's back-target is decided by `wizardMode`
 * after `doExit('back')` clears the draft (null → Create landing / instant hero;
 * a mode → that config panel). Two properties make the origin honored:
 *
 *   1. Back NEVER re-stamps wizardMode — `doExit('back')` clears the draft but
 *      leaves the mode untouched, so whatever origin the user came from is kept
 *      (instant stays null; advanced stays 'advanced'). Pinned by pressing the
 *      real Back control for both origins.
 *   2. The two origins render distinct surfaces — null → the instant/Create
 *      landing (hero + mode picker); 'advanced' → the advanced config panel —
 *      so preserving the mode lands the user back where they entered.
 *
 * (HomeHero's instant roll keeps wizardMode null — see homeHeroInstantOrigin —
 * so instant-origin + property 1 + property 2 == "Back → instant page".)
 */

import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

// Fire-and-forget / environment helpers.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));
vi.mock('../../src/lib/flags.js', () => ({ flag: vi.fn(() => false) }));
vi.mock('../../src/lib/anonGenCounter.js', () => ({ anonAtCap: vi.fn(() => false) }));
vi.mock('../../src/lib/saves.js', () => ({ saves: { save: vi.fn(() => Promise.resolve()) } }));

// HomeHero → a marker so the instant/Create-landing surface is identifiable.
vi.mock('../../src/components/HomeHero.jsx', () => ({ default: () => <div>home-hero-instant</div> }));
vi.mock('../../src/components/generate/FoundingWorlds.jsx', () => ({ default: () => null }));

// Post-generation dossier siblings — heavy; stub to keep the Back control (from
// the real WizardOutputToolbar) the focus of the dossier render.
vi.mock('../../src/components/OutputContainer', () => ({ default: () => <div>dossier-body</div> }));
vi.mock('../../src/components/generate/PipelineReveal.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/generate/SaveToLibraryButton.jsx', () => ({ SaveToLibraryButton: () => null }));
vi.mock('../../src/components/BuyThisDossier.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/generate/ExportDraftButton.jsx', () => ({ default: () => null }));

// The advanced config panel's heavy children (mirrors generateWizardFocus): the
// panel + WizardCloseout themselves render for real, their children as markers.
vi.mock('../../src/components/ConfigurationPanel', () => ({ default: () => <div>config-panel</div> }));
vi.mock('../../src/components/ConfigurationPanel.jsx', () => ({ default: () => <div>config-panel</div> }));
vi.mock('../../src/components/InstitutionalGrid.jsx', () => ({ default: () => <div>institutions-panel</div> }));
vi.mock('../../src/components/ServicesTogglePanel.jsx', () => ({ default: () => <div>services-panel</div> }));
vi.mock('../../src/components/TradeDynamicsPanel.jsx', () => ({ default: () => <div>trade-panel</div> }));
vi.mock('../../src/components/generate/CharacterPresetCard.jsx', () => ({ default: () => <div>character-card</div> }));
vi.mock('../../src/components/generate/PlaceInRegionCard.jsx', () => ({ default: () => <div>place-in-region</div> }));

const storeState = {
  settlement: null,
  activeSaveId: null,
  config: { settType: 'town' },
  wizardStep: 0,
  wizardMode: null,
  loadedFromSave: null,
  importedNeighbour: null,
  canSave: () => false,
  auth: { tier: 'anon', role: 'user' },
  aiSettlement: null,
  pipelineRevealActive: false,
  generateSettlement: vi.fn(),
  setWizardStep: vi.fn(),
  setWizardMode: vi.fn(),
  clearLoadedFromSave: vi.fn(),
  clearNeighbour: vi.fn(),
  clearSettlement: vi.fn(),
  setSettlement: vi.fn(),
  dismissPipelineReveal: vi.fn(),
  institutionToggles: {},
  goodsToggles: {},
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

async function renderWizard() {
  const GenerateWizard = (await import('../../src/components/GenerateWizard.jsx')).default;
  return render(<GenerateWizard isMobile={false} onSignIn={() => {}} onNavigate={() => {}} />);
}

// Reset per test — the store is a shared singleton across the module's mocks.
function resetStore() {
  Object.assign(storeState, {
    settlement: null,
    activeSaveId: null,
    wizardMode: null,
    auth: { tier: 'anon', role: 'user' },
  });
  vi.clearAllMocks();
}

describe('GenerateWizard — Back returns to the entry origin', () => {
  beforeEach(resetStore);
  afterEach(cleanup);

  it('INSTANT origin: pressing Back keeps wizardMode null (returns to the instant page)', async () => {
    storeState.settlement = { name: 'Rollton', tier: 'town', population: 1200 };
    storeState.wizardMode = null;   // instant origin
    storeState.auth = { tier: 'anon', role: 'user' }; // anon skips the unsaved-draft confirm

    await renderWizard();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    // Draft dropped, but the (null) instant origin is preserved — no mode stamp.
    expect(storeState.clearSettlement).toHaveBeenCalled();
    expect(storeState.setWizardMode).not.toHaveBeenCalled();
  });

  it('ADVANCED origin: pressing Back keeps wizardMode "advanced" (returns to advanced config)', async () => {
    storeState.settlement = { name: 'Craftbury', tier: 'town', population: 1200 };
    storeState.wizardMode = 'advanced';   // advanced-config origin
    storeState.auth = { tier: 'anon', role: 'user' };

    await renderWizard();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(storeState.clearSettlement).toHaveBeenCalled();
    expect(storeState.setWizardMode).not.toHaveBeenCalled();
  });

  it('null origin renders the instant/Create-landing surface (where instant-Back lands)', async () => {
    storeState.settlement = null;
    storeState.wizardMode = null;
    storeState.auth = { tier: 'free', role: 'user' }; // signed-in shows the mode picker too

    await renderWizard();
    expect(await screen.findByText('home-hero-instant')).toBeTruthy();
    expect(screen.getByText('Basic Generate')).toBeTruthy();
  });

  it('"advanced" origin renders the advanced config surface, NOT the instant hero', async () => {
    storeState.settlement = null;
    storeState.wizardMode = 'advanced';
    storeState.auth = { tier: 'free', role: 'user' };

    await renderWizard();
    expect(await screen.findByText('Generate Draft')).toBeTruthy();
    expect(screen.queryByText('home-hero-instant')).toBeNull();
  });
});
