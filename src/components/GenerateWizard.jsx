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
import { useStore } from '../store/index.js';
import { track, EVENTS } from '../lib/analytics.js';
// UX overhaul Phase 6 — the Create fork (Basic/Advanced ModeSelector + the linear
// step wizard) collapses into ONE layered ConfigurationPanel. The old per-step
// panels (Institutions/Services/Trade) are absorbed into its Deep-constraints
// collapsibles, each keeping its wizard step id so funnel analytics still fire.
import LayeredConfigurationPanel from './generate/LayeredConfigurationPanel.jsx';
import WizardCloseout from './generate/WizardCloseout.jsx';
import WizardNextSteps from './generate/WizardNextSteps.jsx';
import { INK, MUTED, SECOND, BORDER, CARD, sans, serif_, SP, R, FS, PAGE_MAX, CHROME } from './theme.js';
import { t } from '../copy/index.js';
import { anonAtCap } from '../lib/anonGenCounter.js';
import { ConfirmDialog } from './primitives/Dialog.jsx';
import Button from './primitives/Button.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import { ChangeModeBar } from './generate/ChangeModeBar.jsx';
import { ModeSelector } from './generate/ModeSelector.jsx';
import { SaveToLibraryButton } from './generate/SaveToLibraryButton.jsx';
import BuyThisDossier from './BuyThisDossier.jsx';
import { WizardEmptyState } from './generate/WizardEmptyState.jsx';
import { WizardLoadedBanners } from './generate/WizardLoadedBanners.jsx';
import { WizardOutputToolbar } from './generate/WizardOutputToolbar.jsx';
import ExportDraftButton from './generate/ExportDraftButton.jsx';
import { ClerkNote, ClerkNoteStrong } from './generate/ClerkNote.jsx';
import { readDraft, clearDraft } from '../lib/pendingSaveDraft.js';

// Lazy-load OutputContainer — 457 kB chunk deferred until settlement is generated
const OutputContainer = lazy(() => import('./OutputContainer'));
// P100 — pipeline reveal overlay (tiny, but stays lazy so non-generating
// surfaces don't pay for the playback animator).
const PipelineReveal = lazy(() => import('./generate/PipelineReveal.jsx'));

// ── Step definitions ─────────────────────────────────────────────────────────
// The linear step wizard collapsed into LayeredConfigurationPanel (UX overhaul
// Phase 6); the step ids (config / institutions / services / trade) now live on
// its Deep-constraints collapsibles, which fire wizard_step_viewed as they open.

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

  // Analytics: the linear step wizard collapsed into the layered Create panel
  // (UX overhaul Phase 6). LayeredConfigurationPanel now fires wizard_step_viewed
  // for each section (config / institutions / services / trade) as it is opened —
  // it is the SOLE emitter, so no competing per-step fire lives here. Here we seed
  // the abandonment session with the always-mounted `config` step so
  // wizard_abandoned still reports a meaningful last step when the user leaves
  // without generating.
  useEffect(() => {
    if (settlement) return;
    visitedSteps.current.add('config');
    if (lastViewedStep.current == null) lastViewedStep.current = 'config';
  }, [settlement]);

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
            {/* The interrupted-save recovery, as a rubric-headed clerk's note
                (Deep Craft cluster 1 — no tinted wash; the rubric speaks). */}
            <ClerkNote
              rubric="A save was interrupted"
              actions={
                <>
                  <Button variant="primary" size="sm" onClick={handleRestoreDraft}>Restore</Button>
                  <Button variant="ghost" size="sm" onClick={handleDismissDraft}>Discard</Button>
                </>
              }
            >
              Your unsaved {restorableDraft.tier && restorableDraft.tier !== 'unknown' ? `${restorableDraft.tier} ` : ''}
              {restorableDraft.name && restorableDraft.name !== 'Untitled Settlement'
                ? `"${restorableDraft.name}"` : 'settlement'} is still here.
            </ClerkNote>
          </div>
        )}
        <WizardEmptyState
          showHomeHero={showHomeHero}
          showModePicker={showModePicker}
          setWizardMode={setWizardMode}
          onSignIn={onSignIn}
          onNavigate={onNavigate}
        />
      </>
    );
  }

  // ── ONE layered Create panel (UX overhaul Phase 6) ──────────────────────────
  // The Basic/Advanced fork collapsed: any selected mode, pre-generation, renders
  // the single LayeredConfigurationPanel (Character preset → Foundations →
  // Fine-tune → Deep constraints → Place in Region). Size is NOT gated — free
  // accounts generate up to metropolis. Anonymous users never reach here (the
  // hero generates instantly; the mode picker is signed-in only). This restores
  // master's single-surface config stage (base of record); the linear stepped
  // wizard it replaced was the 0168e287-merge regression.
  if (!settlement) {
    return (
      // Cap the config stage to the shared page width — mirrors the dossier
      // branch (PAGE_MAX, below) so the input view is framed, not full-bleed (P12).
      <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: SP.xl, padding: `${SP.xl}px 0` }}>
        {/* Mode switch (Basic ⇄ Advanced) + the null/Create-exit path. The live
            store has no entryPath, so this is the plain setWizardMode binding
            (setWizardMode(null) exits to the Create landing). */}
        <ChangeModeBar mode={wizardMode} onChangeMode={setWizardMode} />

        <WizardLoadedBanners
          loadedFromSave={loadedFromSave}
          clearLoadedFromSave={clearLoadedFromSave}
          importedNeighbour={importedNeighbour}
          clearNeighbour={clearNeighbour}
        />

        {/* Instructional intro — the canonical PageHeader idiom (eyebrow + serif
            title + italic subtitle). The only saturated-gold mass on this page is
            the Generate button (P4 one-focal-point). as="h2": the app chrome owns
            the page h1. Mode-specific guidance rides the subtitle. */}
        <PageHeader
          as="h2"
          size="sm"
          eyebrow={t('generate.introEyebrow')}
          title={t('generate.introTitle')}
          subtitle={wizardMode === 'advanced'
            ? t('generate.introSubtitleAdvanced')
            : t('generate.introSubtitleBasic')}
        />

        <div data-onboard-highlight={onboardingActive && onboardingStep === 0 ? 'true' : undefined}>
          {/* showPlaceInRegion is a conscious decision (census A3): the
              Place-in-Region layer is a KEEP control that master's base-of-record
              composition renders in Advanced (the panel internally gates it to
              advanced-on-desktop, so Basic never shows it regardless). */}
          <LayeredConfigurationPanel
            mode={wizardMode === 'advanced' ? 'advanced' : 'basic'}
            showPlaceInRegion={wizardMode === 'advanced'}
          />
        </div>

        {/* Pre-commit recap — Advanced only. Basic's "pick and go" needs no
            review step; Advanced, where the user set real constraints, gets a
            "Ready to generate" summary so Generate reads as a confirmation. */}
        {wizardMode === 'advanced' && <WizardCloseout />}

        {/* First-generation failures land HERE too (P10). The store re-throws
            before it ever sets `settlement`, so on a failed first roll the
            pre-generate branch re-renders — without this block the click was a
            silent dead-end. Carried by the Deep Craft clerk's-note idiom (no
            tinted wash); the Generate button below is the retry affordance. */}
        {generateError && (
          <ClerkNote role="alert" rubric={t('generate.notes.errorRubric')}>
            {generateError}
          </ClerkNote>
        )}

        {/* The single primary CTA on the pre-generate region — styled entirely by
            the Button primitive (no re-skinning gradient/shadow), so it reads as
            the one focal point (P4) with the canonical primary look. */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleGenerate}
          data-onboard-highlight={onboardingActive && onboardingStep === 1 ? 'true' : undefined}
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

  // ── Post-generation: the dossier view (and the navigated-back recall). ──────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Regenerate moved into the sticky toolbar (beside New). The re-roll
          error alert stays here so a failed regenerate surfaces above the
          dossier. */}
      {settlement && generateError && (
        <ClerkNote
          role="alert"
          rubric={t('generate.notes.errorRubric')}
          style={{ marginTop: SP.sm }}
        >
          {generateError}
        </ClerkNote>
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
                toolbar above stays full-width.
                THE ARRIVAL (Deep Craft H1): the oc-arrival orchestration lays
                the dossier down as a composed document (organic.css; presentation
                only — content is fully in the DOM at t=0, instant under
                reduced-motion, and it replays on any dossier re-mount, e.g.
                returning via View Settlement — the document is re-delivered). */}
            <div className="oc-arrival" style={{ maxWidth: PAGE_MAX, margin: '0 auto', width: '100%' }}>
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
            <BuyThisDossier settlement={settlement} saveId={activeSaveId} onSignIn={onSignIn} onNavigate={onNavigate} size="lg" />
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
          {/* The last-generated recall, as a clerk's note (green wash retired). */}
          <ClerkNote
            rubric="Last generated"
            actions={
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowOutput(true)}
              >
                View Settlement
              </Button>
            }
          >
            <ClerkNoteStrong>{settlement.name || 'Untitled'}</ClerkNoteStrong>
            {' · '}{settlement.tier}
          </ClerkNote>

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
