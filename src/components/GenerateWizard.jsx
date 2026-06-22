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
import { INK, MUTED, SECOND, sans, serif_, SP, R, FS, swatch, PAGE_MAX, DANGER_BORDER } from './theme.js';
import { t } from '../copy/index.js';
import { anonAtCap } from '../lib/anonGenCounter.js';
import { ConfirmDialog } from './primitives/Dialog.jsx';
import Button from './primitives/Button.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import { ChangeModeBar } from './generate/ChangeModeBar.jsx';
import { SaveToLibraryButton } from './generate/SaveToLibraryButton.jsx';
import BuyThisDossier from './BuyThisDossier.jsx';
import { WizardEmptyState } from './generate/WizardEmptyState.jsx';
import { WizardLoadedBanners } from './generate/WizardLoadedBanners.jsx';
import { WizardOutputToolbar } from './generate/WizardOutputToolbar.jsx';

// Lazy-load OutputContainer — 457 kB chunk deferred until settlement is generated
const OutputContainer = lazy(() => import('./OutputContainer'));
// Pipeline reveal overlay (tiny, but stays lazy so non-generating
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
  const entryPath     = useStore(s => s.entryPath);
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
  const setEntryPath    = useStore(s => s.setEntryPath);
  const resetConfig     = useStore(s => s.resetConfig);
  const clearLoadedFromSave = useStore(s => s.clearLoadedFromSave);
  const clearNeighbour  = useStore(s => s.clearNeighbour);
  const clearSettlement = useStore(s => s.clearSettlement);

  // Pipeline reveal state. When `pipelineRevealActive` is
  // true, the dossier is hidden behind the reveal overlay. Once the
  // overlay's playback completes it calls dismissPipelineReveal and the
  // dossier appears.
  const pipelineRevealActive = useStore(s => s.pipelineRevealActive);
  const dismissPipelineReveal = useStore(s => s.dismissPipelineReveal);

  // Local state for back navigation
  const [showOutput, setShowOutput] = useState(true);
  const [generateError, setGenerateError] = useState(null);
  const [pendingExit, setPendingExit] = useState(null); // 'back' | 'new' — RNG unsaved-exit confirm

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
  // for each section (config / institutions / services / trade) as it is opened.
  // Here we seed the abandonment session with the always-mounted `config` step so
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
    // Anonymous daily cap. Regeneration counts against the same
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
    if (kind === 'back') {
      // Back → where you generated from, choices intact. Instant generation has
      // no config screen, so it returns to the Create landing; basic/advanced
      // keep their wizardMode + config so you can tweak and re-roll.
      if (entryPath === 'instant') { setWizardMode(null); setWizardStep(0); }
    } else {
      // New Draft → the SAME path you chose, but fresh: configs are cleared so
      // none of your prior choices carry over.
      setWizardMode(entryPath === 'instant' ? null : (entryPath || wizardMode || null));
      resetConfig();
      setWizardStep(0);
    }
  }, [clearSettlement, setWizardMode, setWizardStep, entryPath, wizardMode, resetConfig]);

  const requestExit = useCallback((kind) => {
    // Unsaved + generated → warn before discarding the random draft.
    if (settlement && !activeSaveId) { setPendingExit(kind); return; }
    doExit(kind);
  }, [settlement, activeSaveId, doExit]);

  /** Back — one step, to the config you generated from (choices intact). */
  const handleBack = useCallback(() => requestExit('back'), [requestExit]);

  /** New — start fresh from the Create landing. */
  const handleNewSettlement = useCallback(() => requestExit('new'), [requestExit]);

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
      <WizardEmptyState
        showHomeHero={showHomeHero}
        showModePicker={showModePicker}
        isMobile={isMobile}
        setWizardMode={setWizardMode}
        authTier={authTier}
        onSignIn={onSignIn}
        onNavigate={onNavigate}
      />
    );
  }

  // ── ONE layered Create panel (UX overhaul Phase 6) ──────────────────────────
  // The Basic/Advanced fork collapsed: any selected mode, pre-generation, renders
  // the single LayeredConfigurationPanel (Character preset → Foundations →
  // Fine-tune → Deep constraints → Place in Region). Size is NOT gated — free
  // accounts generate up to metropolis. Anonymous users never reach here (the
  // hero generates instantly; the mode picker is signed-in only).
  if (!settlement) {
    return (
      // Cap the config stage to the shared page width — mirrors the dossier
      // branch (PAGE_MAX, below) so the input view is framed, not full-bleed (P12).
      <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: SP.xl, padding: `${SP.xl}px 0` }}>
        <ChangeModeBar mode={wizardMode} onChangeMode={(m) => { if (m) setEntryPath(m); setWizardMode(m); }} />

        {/* The anon-in-panel "Free mode generates Thorp/Hamlet/Village" banner
            was removed: anon users never pick a mode, so this config-panel branch
            is unreachable for them (dead code), and its tier list contradicted
            the hero's ('hamlet/village/town') and the real cap ('town'). */}

        <WizardLoadedBanners
          loadedFromSave={loadedFromSave}
          clearLoadedFromSave={clearLoadedFromSave}
          importedNeighbour={importedNeighbour}
          clearNeighbour={clearNeighbour}
        />

        {/* Instructional intro — the canonical PageHeader idiom (eyebrow + serif
            title + italic subtitle), shared with the standalone surfaces. The
            only saturated-gold mass on this page is the Generate button (P4
            one-focal-point); the small-size header carries the section label
            without out-shouting it. Mode-specific guidance rides the subtitle. */}
        <PageHeader
          size="sm"
          eyebrow={t('generate.introEyebrow')}
          title={t('generate.introTitle')}
          subtitle={wizardMode === 'advanced'
            ? t('generate.introSubtitleAdvanced')
            : t('generate.introSubtitleBasic')}
        />

        <div data-onboard-highlight={onboardingActive && onboardingStep === 0 ? 'true' : undefined}>
          <LayeredConfigurationPanel mode={wizardMode === 'advanced' ? 'advanced' : 'basic'} />
        </div>

        {/* Pre-commit recap — Advanced only. Basic's "pick and go" needs no
            review step; Advanced, where the user set real constraints, gets a
            "Ready to generate" summary so Generate reads as a confirmation. */}
        {wizardMode === 'advanced' && <WizardCloseout />}

        {/* First-generation failures land HERE too. The store re-throws before it
            ever sets `settlement`, so on a failed first roll the pre-generate
            branch re-renders — without this block the error had no DOM home and
            the click was a silent dead-end (P10). The Generate button below is the
            retry affordance. */}
        {generateError && (
          <div role="alert" style={{
            padding: `${SP.sm}px ${SP.md}px`,
            background: swatch.dangerBg,
            border: `1px solid ${DANGER_BORDER}`,
            borderRadius: R.md,
            color: swatch.danger,
            fontFamily: sans,
            fontSize: FS.sm,
          }}>
            {generateError}
          </div>
        )}

        {/* The single primary CTA on the pre-generate region — styled entirely by
            the Button primitive (no re-skinning gradient/shadow/raw font), so it
            reads as the one focal point (P4) with the canonical primary look. */}
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Regenerate — a SUBORDINATE control. The dossier below is the post-reveal
          hero (P1/P9); re-rolling discards the current draft, so it must not
          out-shout the content the reveal just earned. It's a quiet right-aligned
          secondary, not a full-width gold band. Save (below the dossier) is the
          single primary post-generate action. */}
      {/* Regenerate moved into the sticky toolbar (beside New). The re-roll error
          alert stays here so a failed regenerate surfaces above the dossier. */}
      {settlement && generateError && (
        <div role="alert" style={{
          marginTop: SP.sm,
          padding: `${SP.sm}px ${SP.md}px`,
          background: swatch.dangerBg,
          border: `1px solid ${DANGER_BORDER}`,
          borderRadius: R.md,
          color: swatch.danger,
          fontFamily: sans,
          fontSize: FS.sm,
        }}>
          {generateError}
        </div>
      )}

      {/* Pipeline reveal overlay. Renders only when the flag is on,
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
          />

          <Suspense fallback={
            // Minimal dossier skeleton (a couple of header/stat bars at page
            // width) so the rare cold-load reads as the dossier assembling, not
            // a bare "loading" line (P9/P10).
            <div aria-hidden="true" style={{ maxWidth: PAGE_MAX, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: SP.md, padding: `${SP.lg}px 0` }}>
              <div style={{ height: 28, width: '40%', borderRadius: R.md, background: MUTED, opacity: 0.35 }} />
              <div style={{ height: 14, width: '60%', borderRadius: R.sm, background: MUTED, opacity: 0.25 }} />
              <div style={{ display: 'flex', gap: SP.md, marginTop: SP.sm }}>
                {[0,1,2].map(i => <div key={i} style={{ flex: 1, height: 64, borderRadius: R.md, background: MUTED, opacity: 0.2 }} />)}
              </div>
            </div>
          }>
            {/* Cap the dossier body to the shared page width so it
                doesn't sprawl edge-to-edge on wide screens; the sticky nav
                toolbar above stays full-width. */}
            <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', width: '100%' }}>
              <OutputContainer hideHeader />
            </div>
          </Suspense>

          {/* Save to library — the single primary post-generate action. "Buy this
              dossier" sits beside it as the quiet one-time-purchase alternative,
              hoisted from the dossier action band so the two commit actions live
              together. Save leads; Buy is the neighbour. */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap', paddingTop: SP.xs }}>
            <SaveToLibraryButton
              settlement={settlement}
              canSave={canSave}
              isMobile={isMobile}
              onSignIn={onSignIn}
            />
            <BuyThisDossier settlement={settlement} />
          </div>

          {/* The post-generate "what's next" checklist now lives folded into the
              PostGenCoach card (mounted at the App level) so it floats as one
              dismissible helper instead of a second in-page block. */}
        </>
      )}

      {/* When settlement exists but user navigated back — re-view + start-new.
          The full Basic/Advanced picker lives on the Create landing; offering a
          second copy of it here was a redundant entry point, so "Start a new
          settlement" simply returns there (Regenerate above still re-rolls the
          same config). */}
      {settlement && !showOutput && (
        // "You navigated back" is not a success EVENT, so it loses the green
        // bordered card (a fourth distinct border treatment for a non-success
        // state). A borderless spacing-grouped row carries it instead — name+tier
        // text on the left, the two nav controls on the right (P5). "View" is the
        // lead action (primary); "Start new" is the subordinate reset.
        <div style={{
          padding: `${SP.sm}px ${SP.xs}px`,
          display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <span style={{ fontSize: FS.md, fontWeight: 700, color: INK }}>
              Last generated: {settlement.name || 'Untitled'}
            </span>
            <span style={{ fontSize: FS.sm, color: MUTED, marginLeft: SP.sm }}>
              {settlement.tier}
            </span>
          </div>
          <div style={{ display: 'flex', gap: SP.sm }}>
            <Button variant="secondary" size="sm" onClick={handleNewSettlement}>
              Start a new settlement
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowOutput(true)}>
              View Settlement
            </Button>
          </div>
        </div>
      )}

      {/* Leave-confirm — rendered once at the top level so it works whether the
          dossier is showing or the user has navigated back. */}
      <ConfirmDialog
        open={!!pendingExit}
        tone="warning"
        title="Leave this settlement?"
        body="This settlement is not saved yet. It is randomly generated, so the exact result will not come back. Your configuration stays, so you can roll it again."
        confirmLabel={pendingExit === 'new' ? 'Discard and start new' : 'Discard and go back'}
        onConfirm={() => doExit(pendingExit)}
        onCancel={() => setPendingExit(null)}
      />
    </div>
  );
}
