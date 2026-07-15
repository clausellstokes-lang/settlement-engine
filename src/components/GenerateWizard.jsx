/**
 * GenerateWizard.jsx — Step-by-step settlement creation wizard.
 *
 * Replaces the old GenerateView with three modes:
 *   Quick    — minimal config, one-click generation
 *   Advanced — full config (one step at a time, not all at once)
 *   Custom   — full workshop for manual entry (premium)
 *
 * Each step shows only its own content, with contextual help in the
 * sidebar/footer drawn from the Compendium and How to Use content.
 * Steps are navigated with Next/Back, not all visible simultaneously.
 *
 * Reads all state from the Zustand store — zero props.
 */
import { useCallback, useState, useRef, useEffect, lazy, Suspense } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useStore } from '../store/index.js';
import { track, EVENTS } from '../lib/analytics.js';
import ConfigurationPanel from './ConfigurationPanel';
import InstitutionalGrid from './InstitutionalGrid';
import ServicesTogglePanel from './ServicesTogglePanel';
import TradeDynamicsPanel from './TradeDynamicsPanel';
import WizardCloseout from './generate/WizardCloseout.jsx';
import WizardNextSteps from './generate/WizardNextSteps.jsx';
import { GOLD, INK, MUTED, SECOND, BORDER, BORDER2, CARD, CARD_HDR, sans, serif_, SP, R, FS, swatch, PAGE_MAX, CHROME } from './theme.js';
import { t } from '../copy/index.js';
import { flag } from '../lib/flags.js';
import { anonAtCap } from '../lib/anonGenCounter.js';
import { ConfirmDialog } from './primitives/Dialog.jsx';
import Button from './primitives/Button.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import DesktopOnlyGate from './primitives/DesktopOnlyGate.jsx';
import useIsMobile from '../hooks/useIsMobile.js';
import { ChangeModeBar } from './generate/ChangeModeBar.jsx';
import { ModeSelector } from './generate/ModeSelector.jsx';
import { StepIndicator } from './generate/StepIndicator.jsx';
import { SaveToLibraryButton } from './generate/SaveToLibraryButton.jsx';
import BuyThisDossier from './BuyThisDossier.jsx';
import { WizardEmptyState } from './generate/WizardEmptyState.jsx';
import { WizardChipRow } from './generate/WizardChipRow.jsx';
import { WizardLoadedBanners } from './generate/WizardLoadedBanners.jsx';
import { WizardOutputToolbar } from './generate/WizardOutputToolbar.jsx';
import { WizardCommitBand } from './generate/WizardCommitBand.jsx';
import ExportDraftButton from './generate/ExportDraftButton.jsx';
import { readDraft, clearDraft } from '../lib/pendingSaveDraft.js';

// Lazy-load OutputContainer — 457 kB chunk deferred until settlement is generated
const OutputContainer = lazy(() => import('./OutputContainer'));
// P100 — pipeline reveal overlay (tiny, but stays lazy so non-generating
// surfaces don't pay for the playback animator).
const PipelineReveal = lazy(() => import('./generate/PipelineReveal.jsx'));

// ── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'config',
    label: 'General Configuration',
    hint: 'Set the foundations: tier, trade route, culture, threat level, and priority sliders. These shape the probability space for everything downstream.',
  },
  {
    id: 'institutions',
    label: 'Institutions',
    hint: 'Force or exclude specific institutions. The generator uses your toggles as hard constraints. Forced institutions always appear, excluded ones never do.',
  },
  {
    id: 'services',
    label: 'Available Services',
    hint: 'Services are provided by institutions. Force a service to guarantee it appears; exclude it to prevent it. Missing institutions may be added to satisfy forced services.',
  },
  {
    id: 'trade',
    label: 'Trade Dynamics',
    hint: 'Control which goods your settlement exports and imports. These feed into supply chains, economic viability, and cross-settlement trade dependencies.',
  },
];

// Stable step id for analytics. Past the last real step the advanced wizard
// shows the "Ready to Generate" close-out, which has no STEPS entry — give it
// its own coarse id so wizard_step_viewed / wizard_abandoned stay meaningful.
const stepIdFor = (index) => STEPS[index]?.id || 'closeout';

// duration → coarse dwell band (taxonomy §Banding vocabularies). Derived
// inline so the analytics prop stays coarse (no raw millisecond values).
const dwellBand = (ms) => {
  if (ms < 5000) return 'lt_5s';
  if (ms < 15000) return '5_15s';
  if (ms < 60000) return '15_60s';
  if (ms < 300000) return '1_5m';
  if (ms < 1800000) return '5_30m';
  return 'gt_30m';
};

// ── Main wizard component ────────────────────────────────────────────────────

export default function GenerateWizard({ isMobile, onSignIn, onNavigate }) {
  // Store state
  const settlement    = useStore(s => s.settlement);
  const activeSaveId  = useStore(s => s.activeSaveId);
  const config        = useStore(s => s.config);
  const wizardStep    = useStore(s => s.wizardStep);
  const wizardMode    = useStore(s => s.wizardMode);
  const loadedFromSave = useStore(s => s.loadedFromSave);
  const importedNeighbour = useStore(s => s.importedNeighbour);
  const canSave       = useStore(s => s.canSave());
  const authTier      = useStore(s => s.auth.tier);
  const _authRole      = useStore(s => s.auth.role);
  const _aiSettlement  = useStore(s => s.aiSettlement);

  // Store actions
  const generate        = useStore(s => s.generateSettlement);
  const setWizardStep   = useStore(s => s.setWizardStep);
  const setWizardMode   = useStore(s => s.setWizardMode);
  const clearLoadedFromSave = useStore(s => s.clearLoadedFromSave);
  const clearNeighbour  = useStore(s => s.clearNeighbour);
  const clearSettlement = useStore(s => s.clearSettlement);
  const setSettlement   = useStore(s => s.setSettlement);

  // P100 / X-1 — Pipeline reveal state. When `pipelineRevealActive` is
  // true, the dossier is hidden behind the reveal overlay. Once the
  // overlay's playback completes it calls dismissPipelineReveal and the
  // dossier appears.
  const pipelineRevealActive = useStore(s => s.pipelineRevealActive);
  const dismissPipelineReveal = useStore(s => s.dismissPipelineReveal);

  // Live viewport check (not the isMobile prop): the Advanced hard-constraint
  // panels gate to desktop below, and the gate must react to rotation/resize.
  const mobileViewport = useIsMobile();

  // Local state for back navigation
  const [showOutput, setShowOutput] = useState(true);
  const [generateError, setGenerateError] = useState(null);
  const [pendingExit, setPendingExit] = useState(null); // 'back' | 'new' — RNG unsaved-exit confirm
  // Recoverable unsaved dossier. If a save stalled and the user reloaded to
  // recover, the generated settlement is gone from the store (never persisted)
  // but a draft survives in localStorage. Read once at init; the restore banner
  // only renders in the empty state (no settlement), so no mount effect is needed.
  const [restorableDraft, setRestorableDraft] = useState(() => readDraft());

  // ── Analytics: wizard-funnel session bookkeeping ─────────────────────────
  // Plain refs so they never trigger renders. `generatedThisSession` flips
  // true the first time the user fires Generate, suppressing wizard_abandoned.
  // `visitedSteps` accumulates the distinct step ids seen; `wizardMountAt`
  // anchors the dwell band for abandonment. All fire-and-forget, additive.
  const generatedThisSession = useRef(false);
  const visitedSteps = useRef(new Set());
  // Stamped in the mount effect below (not during render — Date.now() is
  // impure) so the dwell band in wizard_abandoned measures from first mount.
  const wizardMountAt = useRef(0);
  const lastViewedStep = useRef(null);

  // Sync showOutput when a new settlement is generated.
  const prevSettlementRef = useRef(null);
  useEffect(() => {
    if (settlement && settlement !== prevSettlementRef.current) {
      setShowOutput(true);
      prevSettlementRef.current = settlement;
    }
  }, [settlement]);

  // P144 / A-4 — Wizard step focus management. When the advanced wizard
  // advances or retreats a step, keyboard + screen-reader users were left
  // on the now-clicked (or now-disabled) nav button with no signal that
  // the step changed. On each step *change* (not initial mount) we move
  // focus to the new step's heading — made programmatically focusable via
  // tabIndex=-1 and labelled "Step N of M: …" — so the change is both
  // announced and navigable. Additive; gated on wizardStepFocus.
  const stepHeadingRef = useRef(null);
  const prevWizardStepRef = useRef(wizardStep);
  useEffect(() => {
    const advanced = wizardMode === 'advanced';
    if (advanced && !settlement && prevWizardStepRef.current !== wizardStep) {
      stepHeadingRef.current?.focus();
    }
    prevWizardStepRef.current = wizardStep;
  }, [wizardStep, wizardMode, settlement]);

  // Analytics: wizard_step_viewed. Fires on each step transition in the
  // advanced, pre-generation wizard (the only mode with multiple steps).
  // Additive + fire-and-forget; never touches navigation. Direction is
  // derived from the previous step seen by THIS effect so it tracks the
  // step the user actually lands on (including the close-out at STEPS.length).
  const prevAnalyticsStepRef = useRef(null);
  useEffect(() => {
    if (wizardMode !== 'advanced' || settlement) return;
    const prev = prevAnalyticsStepRef.current;
    if (prev === wizardStep) return;
    const stepId = stepIdFor(wizardStep);
    try {
      track(EVENTS.WIZARD_STEP_VIEWED, {
        step_id: stepId,
        step_index: wizardStep,
        mode: 'advanced',
        direction: prev == null ? 'next' : (wizardStep >= prev ? 'next' : 'back'),
      });
    } catch { /* analytics must never affect the wizard */ }
    visitedSteps.current.add(stepId);
    lastViewedStep.current = stepId;
    prevAnalyticsStepRef.current = wizardStep;
  }, [wizardStep, wizardMode, settlement]);

  // Analytics: wizard_abandoned. Fires once on pagehide OR unmount when the
  // user left the wizard without generating this session. Mount-only effect
  // (refs hold the live session state) so it registers/cleans the listener
  // exactly once. Self-deduped via `fired` so pagehide-then-unmount can't
  // double-count. Additive + fire-and-forget.
  useEffect(() => {
    wizardMountAt.current = Date.now();
    let fired = false;
    const emitAbandon = () => {
      if (fired) return;
      if (generatedThisSession.current) return;
      // Nothing meaningful to report if the wizard was never really entered.
      if (visitedSteps.current.size === 0 && lastViewedStep.current == null) return;
      fired = true;
      try {
        track(EVENTS.WIZARD_ABANDONED, {
          last_step_id: lastViewedStep.current || 'closeout',
          steps_visited_count: visitedSteps.current.size,
          dwell_ms_band: dwellBand(Date.now() - wizardMountAt.current),
        });
      } catch { /* analytics must never throw */ }
    };
    const onPageHide = () => emitAbandon();
    if (typeof window !== 'undefined') {
      window.addEventListener('pagehide', onPageHide);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('pagehide', onPageHide);
      }
      emitAbandon();
    };
  }, []);

  const handleGenerate = useCallback(() => {
    // Tier 7.2 — anonymous daily cap. Regeneration counts against the same
    // 3/day allowance as the first generation (enforced in the store), so
    // when an anon is already at cap, route to the sign-in/unlock flow
    // rather than dead-clicking — generateSettlement would no-op anyway.
    if (authTier === 'anon' && anonAtCap()) {
      if (typeof onSignIn === 'function') onSignIn();
      return;
    }
    setGenerateError(null);
    // Analytics (additive, fire-and-forget): generation_started. Read coarse
    // config enums + toggle counts from a fresh store snapshot so we never
    // add a render-triggering subscription. Mark the session as having
    // generated so wizard_abandoned won't fire on unmount.
    generatedThisSession.current = true;
    try {
      const st = useStore.getState();
      const cfg = st.config || {};
      const inst = st.institutionToggles || {};
      let forced = 0, excluded = 0;
      for (const v of Object.values(inst)) {
        if (v?.require) forced++;
        if (v?.forceExclude) excluded++;
      }
      track(EVENTS.GENERATION_STARTED, {
        mode: st.wizardMode || 'basic',
        tier: cfg.settType,
        culture: cfg.culture,
        trade_route_access: cfg.tradeRouteAccess,
        monster_threat: cfg.monsterThreat,
        magic_exists: !!cfg.magicExists,
        forced_institution_count: forced,
        excluded_institution_count: excluded,
        has_trade_overrides: Object.keys(st.goodsToggles || {}).length > 0,
      });
    } catch { /* analytics must never affect generation */ }
    try {
      generate();
      clearLoadedFromSave();
      setShowOutput(true); // show output after generation
    } catch (e) {
      console.error('GENERATE ERROR:', e);
      setGenerateError(`Error: ${e.message || e}`);
    }
  }, [generate, clearLoadedFromSave, authTier, onSignIn]);

  /**
   * Exit the generated dossier. `back` returns to the config you generated
   * from (choices persist in the store; the RNG draft is dropped). `new` goes
   * all the way to the Create landing (mode picker + instant generation). The
   * draft is randomized, so a generated-but-unsaved settlement is gated behind
   * a confirm first — the exact rolled result won't come back.
   */
  const doExit = useCallback((kind) => {
    setPendingExit(null);
    if (clearSettlement) clearSettlement();
    setShowOutput(false);
    if (kind === 'new') {
      setWizardMode(null);   // → Create landing: mode picker + instant generation
      setWizardStep(0);
    }
  }, [clearSettlement, setWizardMode, setWizardStep]);

  const requestExit = useCallback((kind) => {
    // Warn before discarding an unsaved random draft — but only when the user
    // actually has a save path to lose it to. Anonymous visitors have NO Save
    // affordance (the anon model is ephemeral by design: roll freely, sign in
    // to keep), so a "you'll lose your draft" confirm is misleading friction —
    // and it stranded the "New returns to a fresh state" flow behind a dialog
    // the anon path never expects (the e2e regression, mobile-safari + chromium).
    if (settlement && !activeSaveId && authTier !== 'anon') { setPendingExit(kind); return; }
    doExit(kind);
  }, [settlement, activeSaveId, authTier, doExit]);

  /** Back — one step, to the config you generated from (choices intact). */
  const handleBack = useCallback(() => requestExit('back'), [requestExit]);

  /** New — start fresh from the Create landing. */
  const handleNewSettlement = useCallback(() => requestExit('new'), [requestExit]);

  // ── Scroll-padding so the pinned chrome never hides a dossier control ──
  // While the dossier is on screen, two stacked sticky bars pin to the top of
  // the window scroller: the app header and the WizardOutputToolbar (pinned at
  // the header's height on mobile so the two STACK). A focus move or anchored
  // scroll into a dossier section would otherwise land the target flush under
  // that chrome, hiding the very control the user jumped to. scroll-padding-top
  // on the document element (the real scroller) reserves the chrome's height so
  // those scrolls stop just below it. Scoped to the visible-dossier window and
  // fully reverted on teardown so other views keep the default behaviour. (B4b.)
  const dossierVisible = !!settlement && showOutput && !pipelineRevealActive;
  useEffect(() => {
    if (!dossierVisible || typeof document === 'undefined') return undefined;
    const root = document.documentElement;
    const prev = root.style.scrollPaddingTop;
    const mobilePad = CHROME.headerMobile + CHROME.toolbarHeight;
    root.style.scrollPaddingTop = isMobile ? `${mobilePad}px` : `${CHROME.scrollPadDesktop}px`;
    return () => { root.style.scrollPaddingTop = prev; };
  }, [dossierVisible, isMobile]);

  // Restore the recovered dossier into the store. The draft is kept (not cleared)
  // until a save actually lands, so a second stall/reload can recover again.
  const handleRestoreDraft = useCallback(() => {
    if (!restorableDraft?.settlement) return;
    if (typeof setSettlement === 'function') setSettlement(restorableDraft.settlement);
    setShowOutput(true);
    setRestorableDraft(null);
  }, [restorableDraft, setSettlement]);

  const handleDismissDraft = useCallback(() => {
    clearDraft();
    setRestorableDraft(null);
  }, []);

  // Onboarding coach step tracking
  const onboardingActive = useStore(s => s.onboardingActive);
  const onboardingStep = useStore(s => s.onboardingStep);
  const advanceOnboarding = useStore(s => s.advanceOnboarding);

  // Auto-advance step 0 → 1 when user picks a tier (config.settType changes from 'random')
  useEffect(() => {
    if (!onboardingActive) return;
    if (onboardingStep !== 0) return;
    if (config.settType && config.settType !== 'random') {
      advanceOnboarding();
    }
  }, [onboardingActive, onboardingStep, config.settType, advanceOnboarding]);

  // Auto-advance step 1 → 2 when a settlement is first generated
  useEffect(() => {
    if (!onboardingActive) return;
    if (onboardingStep >= 2) return;
    if (settlement) {
      // Jump straight to "explore" regardless of whether tier was touched
      useStore.getState().setOnboardingStep(2);
    }
  }, [onboardingActive, onboardingStep, settlement]);

  // Empty state: no mode selected yet AND no settlement.
  //
  //   - Anonymous: HomeHero is the only surface. Anon users never see
  //     the Basic/Advanced mode picker — they go from hero → dossier
  //     in one click. Quick/Advanced are gated behind signup because
  //     they expose institution toggles, services, and the full
  //     probability space; selling that complexity to a first-time
  //     visitor would dilute the funnel.
  //   - Signed-in: HomeHero serves as "Welcome back" instant
  //     generation (full size ladder). Below the hero we expose the
  //     Basic/Advanced mode picker as the "want more control?" path.
  const showHomeHero = !wizardMode && !settlement;
  // /create shows the instant-generation hero to everyone. The Basic / Advanced
  // mode cards are gated to signed-in users: anonymous visitors get instant
  // generation (hamlet / village / town) only and must sign in (free) to reach
  // Basic and Advanced. Custom Generate was removed entirely.
  const showModePicker = !wizardMode && !settlement && authTier !== 'anon';

  if (!wizardMode && !settlement) {
    return (
      <>
        {restorableDraft && (
          <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', width: '100%', padding: `${SP.md}px 0 0` }}>
            <div style={{
              background: swatch['#FDF8EE'], border: '2px solid #b8860b', borderRadius: 8,
              padding: '12px 16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center',
              gap: 12, justifyContent: 'space-between',
            }}>
              <div style={{ fontFamily: sans, fontSize: FS.sm, color: swatch['#5A3A00'], flex: '1 1 280px' }}>
                <strong>A save was interrupted.</strong>{' '}
                Your unsaved {restorableDraft.tier && restorableDraft.tier !== 'unknown' ? `${restorableDraft.tier} ` : ''}
                {restorableDraft.name && restorableDraft.name !== 'Untitled Settlement'
                  ? `"${restorableDraft.name}"` : 'settlement'} is still here.
              </div>
              <div style={{ display: 'flex', gap: SP.sm }}>
                <Button variant="primary" size="sm" onClick={handleRestoreDraft}>Restore</Button>
                <Button variant="ghost" size="sm" onClick={handleDismissDraft}>Discard</Button>
              </div>
            </div>
          </div>
        )}
        <WizardEmptyState
          showHomeHero={showHomeHero}
          showModePicker={showModePicker}
          isMobile={isMobile}
          wizardMode={wizardMode}
          setWizardMode={setWizardMode}
          authTier={authTier}
          onSignIn={onSignIn}
          onNavigate={onNavigate}
        />
      </>
    );
  }

  // Basic mode (renamed from 'quick' in the comprehensive review):
  // General Config only, then generate. Renders the SAME ConfigurationPanel
  // as Advanced step 0 — just no further steps. Layout matches Advanced
  // (full-width, no maxWidth) so step 1 reads as the same surface in
  // both modes; the only difference between Basic and Advanced is what
  // comes AFTER step 1, not the width of step 1 itself.
  if (wizardMode === 'basic' && !settlement) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl, padding: `${SP.xl}px 0` }}>
        <ChangeModeBar mode={wizardMode} onChangeMode={setWizardMode} />

        {/* Canonical config-stage header (replaces the gold helper banner).
            as="h2": the app chrome already renders the wordmark as the page h1. */}
        <PageHeader
          as="h2"
          size="sm"
          eyebrow={t('generate.introEyebrow')}
          title={t('generate.introTitle')}
          subtitle={t('generate.introSubtitleBasic')}
        />

        <div
          style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, overflow: 'hidden' }}
        >
          <div style={{ padding: `${SP.md}px ${SP.lg}px`, background: CARD_HDR, borderBottom: `1px solid ${BORDER2}` }}>
            <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK }}>General Configuration</span>
          </div>
          <div style={{ padding: `${SP.lg}px 0 0`, background: CARD }}>
            <ConfigurationPanel />
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleGenerate}
          style={{
            padding: isMobile ? `${SP.xl}px 0` : `${SP.xl - 2}px 0`,
            background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
            color: swatch.white, border: 'none', borderRadius: R.lg + 2,
            fontFamily: serif_,
            fontSize: isMobile ? 22 : FS.xxl, fontWeight: 600, letterSpacing: '0.02em',
            boxShadow: '0 4px 20px rgba(160,118,42,0.45)',
            transition: 'opacity 0.15s, transform 0.1s',
          }}
        >
          Generate Draft
        </Button>
        <p className="sf-readable-strip" style={{
          alignSelf: 'center',
          marginTop: SP.sm, marginBottom: 0, textAlign: 'center',
          fontSize: FS.sm, color: SECOND, fontFamily: serif_, fontStyle: 'italic',
          lineHeight: 1.5,
        }}>
          {t('generate.subline')}
        </p>
      </div>
    );
  }

  // (Custom Generate / the Workshop was removed. Anonymous users never reach a
  // config landing — the hero generates instantly; Basic/Advanced are signed-in
  // only.)

  // Advanced mode: step-by-step wizard.
  const isAdvanced = wizardMode === 'advanced';
  const currentStepDef = STEPS[wizardStep] || STEPS[0];

  // P119 / W-1 — Wizard chrome diet. When the flag is on, collapse the
  // ChangeModeBar + two full-width banners into a single chip row. The
  // step indicator + step hint banner also collapse into one combined
  // header (rendered by the step content already).
  const chromeDiet = flag('wizardChromeDiet');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Change-mode bar (collapse after first generation OR when diet is on) */}
      {!settlement && !chromeDiet && <ChangeModeBar mode={wizardMode} onChangeMode={setWizardMode} />}

      {/* P119 — Combined chip row when diet is on. A single max-32px-tall
          strip with: an inline "Advanced ⇄ Quick" toggle, a config-loaded
          chip, a neighbour-active chip. All three were previously full
          banner rows; now they fit in one. */}
      {chromeDiet && !settlement && (
        <WizardChipRow
          wizardMode={wizardMode}
          setWizardMode={setWizardMode}
          loadedFromSave={loadedFromSave}
          clearLoadedFromSave={clearLoadedFromSave}
          importedNeighbour={importedNeighbour}
          clearNeighbour={clearNeighbour}
        />
      )}

      {/* Banners — only when the chrome diet is off (legacy path) */}
      {!chromeDiet && (
        <WizardLoadedBanners
          loadedFromSave={loadedFromSave}
          clearLoadedFromSave={clearLoadedFromSave}
          importedNeighbour={importedNeighbour}
          clearNeighbour={clearNeighbour}
        />
      )}

      {/* Step indicator + hint (advanced mode, pre-generation). Bounded to real
          steps — at wizardStep === STEPS.length the "Ready to Generate" state owns
          the view (WizardCloseout below), so this block must not render a ghost
          "Step N+1" banner with empty content and duplicate nav. */}
      {isAdvanced && !settlement && wizardStep < STEPS.length && (
        <>
          {/* Canonical config-stage header, mounted once above the step
              indicator. as="h2": the app chrome owns the page h1. */}
          <PageHeader
            as="h2"
            size="sm"
            eyebrow={t('generate.introEyebrow')}
            title={t('generate.introTitle')}
            subtitle={t('generate.introSubtitleAdvanced')}
          />

          <StepIndicator currentStep={wizardStep} totalSteps={STEPS.length} />

          {/* Contextual hint for current step */}
          <div style={{
            padding: `${SP.sm + 2}px ${SP.lg}px`, background: swatch['#FEF9EE'],
            border: `1px solid ${GOLD}`, borderLeft: `4px solid ${GOLD}`,
            borderRadius: R.lg - 1, fontSize: FS.md, color: SECOND, lineHeight: 1.5,
          }}>
            <strong style={{ fontFamily: serif_ }}>
              Step {wizardStep + 1}: {currentStepDef.label}
            </strong>
            {' — '}{currentStepDef.hint}
          </div>

          {/* Current step content. P144 / A-4 — the step-change effect
              moves focus to this labelled region so a step swap is both
              announced (aria-label "Step N of M: …") and navigable for
              keyboard users. outline:none stops the programmatic focus
              from drawing a stray ring on this non-tabbable container. */}
          <div
            ref={stepHeadingRef}
            tabIndex={-1}
            role="group"
            aria-label={`Step ${wizardStep + 1} of ${STEPS.length}: ${currentStepDef.label}`}
            style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, overflow: 'hidden', outline: 'none', background: CARD }}
          >
            <div style={{ padding: `${SP.lg - 2}px ${SP.lg}px`, background: CARD_HDR, borderBottom: `1px solid ${BORDER2}` }}>
              <span style={{ fontFamily: serif_, fontSize: FS.xl, fontWeight: 600, color: INK }}>
                {currentStepDef.label}
              </span>
            </div>
            <div style={{ padding: 0 }}>
              {wizardStep === 0 && <ConfigurationPanel />}
              {/* Mobile + Advanced: the hard-constraint editors (Institutions,
                  Services, Trade) are raw authoring tools with no readable
                  preview to teaser, so on a phone they get the plain "best on
                  desktop" gate. Step 0 stays fully usable; the nav buttons
                  below keep the gated steps walkable. The constraints roll
                  from working defaults until refined on a larger screen. */}
              {wizardStep >= 1 && wizardStep <= 3 && (
                mobileViewport ? (
                  <div style={{ padding: SP.lg }} data-testid="deep-constraints-mobile-gate">
                    <DesktopOnlyGate
                      title="Hard constraints are best set on desktop"
                      message="Forcing or forbidding specific institutions, services, and trade goods needs the full constraint console, which has room to work on a larger screen. On your phone you can pick a character, set the foundations, and generate a draft. The simulator rolls these constraints from working defaults until you refine them on desktop."
                    />
                  </div>
                ) : (
                  <>
                    {wizardStep === 1 && <InstitutionalGrid />}
                    {wizardStep === 2 && <ServicesTogglePanel />}
                    {wizardStep === 3 && <TradeDynamicsPanel />}
                  </>
                )
              )}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: SP.sm + 2, justifyContent: 'space-between' }}>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setWizardStep(Math.max(0, wizardStep - 1))}
              disabled={wizardStep === 0}
              icon={<ChevronLeft size={16} />}
            >
              Back
            </Button>

            {wizardStep < STEPS.length - 1 ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setWizardStep(wizardStep + 1)}
                trailingIcon={<ChevronRight size={16} />}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setWizardStep(STEPS.length)}
                trailingIcon={<ChevronRight size={16} />}
              >
                Ready to Generate
              </Button>
            )}
          </div>
        </>
      )}

      {/* P145 / W-2 — close-out summary. Only in the advanced wizard's
          final "Ready to Generate" state (pre-generation); recaps the
          four steps of config before the commit. Self-gates on the flag. */}
      {isAdvanced && wizardStep >= STEPS.length && !settlement && (
        <WizardCloseout />
      )}

      {/* Generate commit band — the pre-generate close-out commit only. Once a
          settlement exists, re-rolling lives in the sticky toolbar's quiet
          Regenerate (beside New), so the just-earned dossier below is never
          out-shouted by a second full-width gold band. */}
      {!settlement && isAdvanced && wizardStep >= STEPS.length && (
        <WizardCommitBand
          isMobile={isMobile}
          handleGenerate={handleGenerate}
          generateError={generateError}
        />
      )}

      {/* Regenerate moved into the sticky toolbar (beside New). The re-roll
          error alert stays here so a failed regenerate surfaces above the
          dossier. */}
      {settlement && generateError && (
        <div role="alert" style={{
          marginTop: SP.sm,
          padding: `${SP.sm}px ${SP.md}px`,
          background: swatch.dangerBg,
          border: '1px solid #e8b0b0',
          borderRadius: R.md,
          color: swatch.danger,
          fontFamily: sans,
          fontSize: FS.sm,
        }}>
          {generateError}
        </div>
      )}

      {/* P100 — pipeline reveal overlay. Renders only when the flag is on,
          a settlement was just generated, and the slice flagged the reveal
          as active. Dismisses itself by calling dismissPipelineReveal()
          when its playback completes. */}
      {pipelineRevealActive && settlement && (
        <Suspense fallback={null}>
          <PipelineReveal onComplete={dismissPipelineReveal} />
        </Suspense>
      )}

      {/* Output + export buttons. Hidden behind the reveal overlay during
          playback so the user's first dossier view is uninterrupted by
          the overlay dismissing on top of it. */}
      {settlement && showOutput && !pipelineRevealActive && (
        <>
          {/* ── Back navigation toolbar ──────────────────────────── */}
          <WizardOutputToolbar
            settlement={settlement}
            isMobile={isMobile}
            handleBack={handleBack}
            handleGenerate={handleGenerate}
            handleNewSettlement={handleNewSettlement}
            maxWidth={PAGE_MAX}
          />

          <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: MUTED, fontFamily: sans }}>Loading settlement view...</div>}>
            {/* P139 — cap the dossier body to the shared page width so it
                doesn't sprawl edge-to-edge on wide screens; the sticky nav
                toolbar above stays full-width. */}
            <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', width: '100%' }}>
              <OutputContainer hideHeader />
            </div>
          </Suspense>

          {/* Save to library — the primary post-generate action. Export PDF sits
              beside it for export-capable tiers (Cartographer / Founder /
              elevated), who can export the unsaved draft directly; it self-hides
              for free + anon (who save first, or take the hero Buy CTA). */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: SP.sm, flexWrap: 'wrap', paddingTop: SP.xs }}>
            <SaveToLibraryButton
              settlement={settlement}
              canSave={canSave}
              isMobile={isMobile}
              onSignIn={onSignIn}
            />
            {/* Buy this dossier — the anonymous/free one-time purchase CTA,
                mirrored from master's Save row (B4a). Self-gates by tier/config
                (hidden for export-capable tiers), so it never competes with the
                Save/Export primaries when they apply. */}
            <BuyThisDossier settlement={settlement} onSignIn={onSignIn} onNavigate={onNavigate} size="lg" />
            <ExportDraftButton />
          </div>

          {/* P134 / W-4 — post-generate "what's next" guide. Closes out the
              post-generate flow (mirrors WizardCloseout's pre-generate
              close-out) with a state-aware next-step checklist. Self-gates
              on the flag; guidance only, so it never competes with the
              canonical Save / Export / New controls above. */}
          <WizardNextSteps />

          <ConfirmDialog
            open={!!pendingExit}
            tone="warning"
            title="Leave this settlement?"
            body="This settlement hasn't been saved yet. It's randomly generated, so the exact result won't come back, though your configuration is kept so you can regenerate."
            confirmLabel={pendingExit === 'new' ? 'Discard and start new' : 'Discard and go back'}
            onConfirm={() => doExit(pendingExit)}
            onCancel={() => setPendingExit(null)}
          />
        </>
      )}

      {/* When settlement exists but user navigated back — show re-view option + mode picker */}
      {settlement && !showOutput && (
        <>
          <div style={{
            padding: `${SP.md}px ${SP.lg}px`, background: swatch.successBg,
            border: '1px solid #4a8a60', borderRadius: R.lg,
            display: 'flex', alignItems: 'center', gap: SP.md,
          }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: FS.md, fontWeight: 700, color: swatch.success }}>
                Last generated: {settlement.name || 'Untitled'}
              </span>
              <span style={{ fontSize: FS.sm, color: swatch['#4A8A60'], marginLeft: SP.sm }}>
                {settlement.tier}
              </span>
            </div>
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowOutput(true)}
            >
              View Settlement
            </Button>
          </div>

          {/* Mode picker — let the user start fresh in either generation mode.
              Picking a mode here clears the current settlement so the wizard
              re-enters its empty state in the chosen mode. The Regenerate
              button above stays available for "same config, new roll". */}
          <div style={{
            padding: `${SP.lg}px ${SP.lg}px ${SP.md}px`,
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: R.lg,
          }}>
            <div style={{ textAlign: 'center', marginBottom: SP.md }}>
              <div style={{ fontFamily: serif_, fontSize: FS.xl, fontWeight: 700, color: INK, marginBottom: SP.xs }}>
                Or start a new settlement
              </div>
              <div style={{ fontFamily: sans, fontSize: FS.sm, color: MUTED }}>
                Pick a mode to begin a fresh generation. Your last settlement remains saved above.
              </div>
            </div>
            <ModeSelector
              mode={wizardMode}
              onModeChange={(newMode) => {
                if (clearSettlement) clearSettlement();
                setWizardMode(newMode);
                setWizardStep(0);
                setShowOutput(false);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
