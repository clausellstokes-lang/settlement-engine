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
import { ChevronRight, ChevronLeft, Zap, Settings, ArrowLeft, Save } from 'lucide-react';
import { useStore } from '../store/index.js';
import { saves as savesService } from '../lib/saves.js';
import { track, EVENTS } from '../lib/analytics.js';
import ConfigurationPanel from './ConfigurationPanel';
import InstitutionalGrid from './InstitutionalGrid';
import ServicesTogglePanel from './ServicesTogglePanel';
import TradeDynamicsPanel from './TradeDynamicsPanel';
import WizardCloseout from './generate/WizardCloseout.jsx';
import WizardNextSteps from './generate/WizardNextSteps.jsx';
import { GOLD, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, BORDER2, CARD, CARD_HDR, sans, serif_, SP, R, FS, swatch, PAGE_MAX } from './theme.js';
import { t } from '../copy/index.js';
import { flag } from '../lib/flags.js';
import { anonAtCap } from '../lib/anonGenCounter.js';
import { backgroundImageUrl, MODE_BACKGROUNDS } from '../config/pageBackgrounds.js';
import { ConfirmDialog } from './primitives/Dialog.jsx';
import HomeHero from './HomeHero.jsx';
// P128 / H-2 — Sample dossier proof card. Self-gates on flag +
// anonymous + no settlement yet; renders nothing once any of those
// flip. Mounted directly below HomeHero so anon visitors see proof of
// the moat without scrolling.
const HomeSampleDossier = lazy(() => import('./home/HomeSampleDossier.jsx'));

// Lazy-load OutputContainer — 457 kB chunk deferred until settlement is generated
const OutputContainer = lazy(() => import('./OutputContainer'));
// P100 — pipeline reveal overlay (tiny, but stays lazy so non-generating
// surfaces don't pay for the playback animator).
const PipelineReveal = lazy(() => import('./generate/PipelineReveal.jsx'));

// "Change mode" back button — shown above the mode-specific UI once a card
// is picked. Module-scope so React Compiler can memoize without seeing it
// reborn on every render of the parent wizard.
function ChangeModeBar({ mode, onChangeMode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      padding: `${SP.sm}px ${SP.md}px`,
      background: CARD_HDR,
      border: `1px solid ${BORDER}`,
      borderRadius: R.md,
      fontSize: FS.sm, color: SECOND,
    }}>
      <button
        onClick={() => onChangeMode(null)}
        style={{
          display: 'flex', alignItems: 'center', gap: SP.xs,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: GOLD, fontFamily: sans, fontSize: FS.sm, fontWeight: 600, padding: 0,
        }}
      >
        <ChevronLeft size={14} /> Change mode
      </button>
      <span style={{ color: MUTED }}>·</span>
      <span style={{ fontFamily: serif_, fontWeight: 600, color: INK }}>
        {mode === 'basic' ? 'Basic Generate' : 'Advanced Generate'}
      </span>
    </div>
  );
}

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

// ── Mode selector ────────────────────────────────────────────────────────────

function ModeSelector({ mode, onModeChange, large = false }) {
  // The wizard exposes two named generation modes:
  //   - Basic    (formerly "Quick"): one-screen config + Generate.
  //     The hero's instant generation routes here under the hood so
  //     a user landing on the wizard sees the same shape.
  //   - Advanced: step-by-step config with institution toggles,
  //     services, and trade dynamics.
  // (Custom Generate / the Workshop was removed.) The HomeHero's instant
  // generation is its OWN surface (homepage card with size-picker chips),
  // not a mode listed here. Anonymous users see the hero only — these mode
  // cards are gated to signed-in users (Basic/Advanced require a free sign-in).
  const modes = [
    { id: 'basic',    label: 'Basic Generate',    desc: 'One screen. Set the foundations and go', Icon: Zap,      longDesc: 'Pick a tier, culture, and terrain. Everything else is randomized. Produces a draft you can refine, save, and canonize.' },
    { id: 'advanced', label: 'Advanced Generate', desc: 'Full configuration, step by step',         Icon: Settings, longDesc: 'Walk through general config, institutions, services, and trade. Full control over the probability space. Produces a draft you can refine, save, and canonize.' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: large ? SP.xl : SP.md,
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: large ? `${SP.xxl}px 0` : `${SP.sm}px 0`,
    }}>
      {modes.map(({ id, label, desc, Icon, longDesc }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            onClick={() => onModeChange(id)}
            className={large ? `mode-card-bg${active ? ' is-active' : ''}` : undefined}
            style={{
              flex: large ? '1 1 280px' : '1 1 200px',
              maxWidth: large ? 360 : 260,
              padding: large ? `${SP.xxl}px ${SP.xl}px` : `${SP.xl - 2}px ${SP.lg}px`,
              ...(large
                ? { '--card-bg': backgroundImageUrl(MODE_BACKGROUNDS[id]) }
                : { background: active ? GOLD_BG : CARD }),
              border: `2px solid ${(large || active) ? GOLD : BORDER2}`,
              borderRadius: R.lg,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
              boxShadow: large ? '0 4px 16px rgba(28,20,9,0.08)' : 'none',
            }}
            onMouseOver={e => {
              if (!large) return;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(160,118,42,0.25)';
              e.currentTarget.style.borderColor = GOLD;
            }}
            onMouseOut={e => {
              if (!large) return;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(28,20,9,0.08)';
              e.currentTarget.style.borderColor = active ? GOLD : BORDER2;
            }}
          >
            <Icon size={large ? 40 : 24} color={active ? GOLD : (large ? GOLD : MUTED)} style={{ marginBottom: large ? SP.md : 6 }} />
            <div style={{
              fontSize: large ? FS.xxl : FS.lg,
              fontWeight: 700,
              fontFamily: serif_,
              color: active ? INK : (large ? INK : SECOND),
            }}>
              {label}
            </div>
            <div style={{ fontSize: large ? FS.md : FS.sm, color: MUTED, marginTop: SP.xs }}>{desc}</div>
            {large && (
              <div style={{ fontSize: FS.sm, color: SECOND, marginTop: SP.md, lineHeight: 1.5, fontStyle: 'italic' }}>
                {longDesc}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div style={{ display: 'flex', gap: R.md, justifyContent: 'center', padding: `${SP.sm}px 0` }}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === currentStep ? 28 : 10,
            height: 10,
            borderRadius: R.sm + 1,
            background: i === currentStep ? GOLD : i < currentStep ? 'rgba(160,118,42,0.5)' : BORDER2,
            transition: 'all 0.3s',
          }}
        />
      ))}
    </div>
  );
}

// ── Save to library button ──────────────────────────────────────────────────

function SaveToLibraryButton({ settlement, canSave, isMobile, onSignIn }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleSave = async () => {
    if (!settlement || saving) return;
    setSaveError(null);
    setSaving(true);
    try {
      await savesService.save({
        name: settlement.name || 'Untitled Settlement',
        tier: settlement.tier || 'unknown',
        settlement,
        config: settlement._config || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('Save failed:', e);
      setSaveError(`Failed to save: ${e.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  // P101 / X-3 — Save-as-signup. When the user can't save (anonymous,
  // or hit the per-tier cap), instead of a disabled tombstone we render
  // an active "free account" door. Clicking stashes the current dossier
  // as a pending intent, opens the AuthModal, and on success the auth
  // intent registry fires savesService.save with the same payload —
  // the user lands back to a saved settlement.
  if (!canSave) {
    const handleSignupSave = () => {
      if (typeof onSignIn === 'function') onSignIn();
      // Lazy-load to avoid pulling authIntents into the wizard bundle
      // until the user actually clicks the button.
      import('../lib/authIntents.js').then(({ setPending, INTENTS }) => {
        setPending(INTENTS.SAVE_SETTLEMENT, {
          name: settlement.name || 'Untitled Settlement',
          tier: settlement.tier || 'unknown',
          settlement,
          config: settlement._config || null,
        });
        // Analytics + auth flow open
        import('../lib/analytics.js').then(({ Funnel, EVENTS }) => {
          Funnel.track(EVENTS.SAVE_BUTTON_CLICKED, { tier: settlement.tier });
          Funnel.track(EVENTS.SAVE_SIGNUP_INTENT_OPENED, { tier: settlement.tier });
        });
      });
    };

    return (
      <button
        onClick={handleSignupSave}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          padding: isMobile ? '13px 24px' : '12px 24px',
          background: swatch.white,
          color: GOLD, fontWeight: 700,
          border: `1.5px solid ${GOLD}`,
          borderBottom: `2px solid ${GOLD}`,
          borderRadius: R.md,
          cursor: 'pointer',
          fontFamily: sans, fontSize: FS.md,
          boxShadow: '0 1px 0 rgba(140,111,50,0.15)',
          transition: 'all 0.15s',
        }}
        title="We'll save your dossier as soon as you're in."
      >
        <Save size={15} />
        Save this town. Free account →
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.xs }}>
      <button onClick={handleSave} disabled={saving || saved} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        padding: isMobile ? '13px 24px' : '10px 24px',
        background: saved ? '#2a7a2a' : '#1a4a2a',
        color: swatch.white, border: 'none', borderRadius: R.md,
        cursor: saving || saved ? 'default' : 'pointer',
        fontFamily: sans, fontSize: FS.md, fontWeight: 700,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        transition: 'all 0.2s',
      }}>
        <Save size={15} />
        {saved ? '✓ Saved to Library' : saving ? 'Saving...' : 'Save to Library'}
      </button>
      {saveError && (
        <div style={{ color: swatch.danger, fontSize: FS.xs, fontFamily: sans, maxWidth: 420, textAlign: 'center' }}>
          {saveError}
        </div>
      )}
    </div>
  );
}

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl, maxWidth: 860, margin: '0 auto', padding: `${SP.xl}px 0` }}>
        {showHomeHero && (
          <>
            <HomeHero onSignIn={onSignIn} onNavigate={onNavigate} />
            <Suspense fallback={null}>
              <HomeSampleDossier />
            </Suspense>
          </>
        )}
        {!showHomeHero && (
          <div style={{ textAlign: 'center', padding: `${SP.md}px 0` }}>
            <h2 style={{
              fontFamily: serif_,
              fontSize: isMobile ? FS.xxl : 32,
              fontWeight: 700,
              color: INK,
              margin: 0,
              marginBottom: SP.sm,
            }}>
              Create a Settlement
            </h2>
            <p style={{
              fontFamily: sans,
              fontSize: FS.md,
              color: MUTED,
              margin: 0,
            }}>
              Choose a generation mode to get started.
            </p>
          </div>
        )}
        {showModePicker && (
          <>
            <div className="sf-readable-strip" style={{ alignSelf: 'center', textAlign: 'center', fontSize: FS.sm, color: SECOND }}>
              Want full control? Use one of the modes below.
            </div>
            <ModeSelector mode={wizardMode} onModeChange={setWizardMode} large />
          </>
        )}
        {/* Anonymous visitors get instant generation (the hero) only; Basic and
            Advanced are gated to signed-in users. Surface the (free) path so the
            gate is discoverable rather than a silently-missing feature. */}
        {!showModePicker && authTier === 'anon' && (
          <div className="sf-readable-strip" style={{ alignSelf: 'center', textAlign: 'center', fontSize: FS.sm, color: SECOND }}>
            Want full control?{' '}
            <button
              onClick={onSignIn}
              style={{ background: 'transparent', border: 'none', padding: 0, color: GOLD, fontWeight: 700, fontFamily: sans, fontSize: FS.sm, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign in (free)
            </button>
            {' '}to unlock Basic &amp; Advanced generation.
          </div>
        )}
      </div>
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

        {authTier === 'anon' && (
          <div style={{ padding: `${SP.sm + 2}px ${SP.lg}px`, background: swatch['#FEF9EE'], border: `1px solid ${GOLD}`, borderLeft: `4px solid ${GOLD}`, borderRadius: R.lg - 1, fontSize: FS.sm, color: SECOND }}>
            Free mode: generating Thorp, Hamlet, or Village. Sign in for all settlement tiers.
          </div>
        )}

        {/* Helper banner — explains Basic is one-screen */}
        <div style={{
          padding: `${SP.sm + 2}px ${SP.lg}px`, background: swatch['#FEF9EE'],
          border: `1px solid ${GOLD}`, borderLeft: `4px solid ${GOLD}`,
          borderRadius: R.lg - 1, fontSize: FS.sm, color: SECOND, lineHeight: 1.5,
        }}>
          <strong style={{ fontFamily: serif_ }}>Basic Generate</strong>
          {', '}Set the foundations and hit Generate. Everything else is randomized.
          Switch to <strong>Advanced Generate</strong> for institution toggles, services, and trade dynamics.
        </div>

        <div
          data-onboard-highlight={onboardingActive && onboardingStep === 0 ? 'true' : undefined}
          style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, overflow: 'hidden' }}
        >
          <div style={{ padding: `${SP.md}px ${SP.lg}px`, background: CARD_HDR, borderBottom: `1px solid ${BORDER2}` }}>
            <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK }}>General Configuration</span>
          </div>
          <div style={{ padding: `${SP.lg}px 0 0`, background: CARD }}>
            <ConfigurationPanel />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          data-onboard-highlight={onboardingActive && onboardingStep === 1 ? 'true' : undefined}
          style={{
            width: '100%', padding: isMobile ? `${SP.xl}px 0` : `${SP.xl - 2}px 0`,
            background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
            color: swatch.white, border: 'none', borderRadius: R.lg + 2, cursor: 'pointer',
            fontFamily: serif_,
            fontSize: isMobile ? 22 : FS.xxl, fontWeight: 600, letterSpacing: '0.02em',
            boxShadow: '0 4px 20px rgba(160,118,42,0.45)',
            transition: 'opacity 0.15s, transform 0.1s',
          }}
        >
          Generate Draft
        </button>
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
        <div style={{
          display: 'flex', alignItems: 'center', gap: SP.sm,
          padding: `${SP.xs}px ${SP.sm}px`,
          flexWrap: 'wrap', fontSize: FS.xs,
        }}>
          {wizardMode === 'advanced' && (
            <button
              onClick={() => setWizardMode('basic')}
              style={{
                padding: '3px 9px', fontSize: FS.xxs, fontWeight: 700,
                background: swatch.white, border: `1px solid ${BORDER}`,
                borderRadius: 12, color: SECOND,
                cursor: 'pointer', fontFamily: sans,
              }}
            >
              Switch to Basic →
            </button>
          )}
          {loadedFromSave && (
            <span style={{
              padding: '3px 9px', fontSize: FS.xxs, fontWeight: 700,
              background: CARD_HDR, border: `1px solid ${BORDER}`,
              borderRadius: 12, color: swatch['#5A3A00'],
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              📋 {loadedFromSave.name}
              <button
                onClick={clearLoadedFromSave}
                style={{
                  background: 'transparent', border: 'none',
                  color: swatch['#5A3A00'], cursor: 'pointer', padding: 0,
                  fontSize: FS.xs, fontWeight: 700,
                }}
                aria-label="Clear loaded config"
              >×</button>
            </span>
          )}
          {importedNeighbour && (
            <span style={{
              padding: '3px 9px', fontSize: FS.xxs, fontWeight: 700,
              background: swatch['#E2EEDB'], border: '1px solid #4a8a60',
              borderRadius: 12, color: swatch.success,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              🌐 {importedNeighbour.name}
              <button
                onClick={clearNeighbour}
                style={{
                  background: 'transparent', border: 'none',
                  color: swatch.success, cursor: 'pointer', padding: 0,
                  fontSize: FS.xs, fontWeight: 700,
                }}
                aria-label="Clear neighbour"
              >×</button>
            </span>
          )}
        </div>
      )}

      {/* Banners — only when the chrome diet is off (legacy path) */}
      {!chromeDiet && loadedFromSave && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: swatch['#FDF8EE'], border: '2px solid #b8860b', borderRadius: 8, padding: '10px 14px' }}>
          <span style={{ fontSize: FS['16'], flexShrink: 0 }}>&#128203;</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: FS.md, fontWeight: 700, color: swatch['#5A3A00'] }}>Config loaded: {loadedFromSave.name}</span>
            {loadedFromSave.tier && <span style={{ fontSize: FS.sm, color: swatch['#8A6020'], marginLeft: 8 }}>{loadedFromSave.tier}</span>}
          </div>
          <button onClick={clearLoadedFromSave} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(184,134,11,0.15)', border: '1px solid #b8860b', color: swatch['#5A3A00'], cursor: 'pointer', fontSize: FS['16'], fontWeight: 700 }}>&times;</button>
        </div>
      )}

      {!chromeDiet && importedNeighbour && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: swatch.successBg, border: '2px solid #4a8a60', borderRadius: 8, padding: '10px 14px' }}>
          <span style={{ fontSize: FS['16'] }}>&#127760;</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: FS.md, fontWeight: 700, color: swatch.success }}>Neighbour active: {importedNeighbour.name}</span>
            <span style={{ fontSize: FS.sm, color: swatch['#4A8A60'], marginLeft: 8 }}>{importedNeighbour.tier}</span>
          </div>
          <button onClick={clearNeighbour} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(74,138,96,0.15)', border: '1px solid #4a8a60', color: swatch.success, cursor: 'pointer', fontSize: FS['16'], fontWeight: 700 }}>&times;</button>
        </div>
      )}

      {/* Step indicator + hint (advanced mode, pre-generation). Bounded to real
          steps — at wizardStep === STEPS.length the "Ready to Generate" state owns
          the view (WizardCloseout below), so this block must not render a ghost
          "Step N+1" banner with empty content and duplicate nav. */}
      {isAdvanced && !settlement && wizardStep < STEPS.length && (
        <>
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
            {', '}{currentStepDef.hint}
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
              {wizardStep === 1 && <InstitutionalGrid />}
              {wizardStep === 2 && <ServicesTogglePanel />}
              {wizardStep === 3 && <TradeDynamicsPanel />}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: SP.sm + 2, justifyContent: 'space-between' }}>
            <button
              onClick={() => setWizardStep(Math.max(0, wizardStep - 1))}
              disabled={wizardStep === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: R.md,
                padding: `${SP.sm + 2}px ${SP.xl}px`, background: CARD_HDR,
                border: `1px solid ${BORDER}`, borderRadius: R.lg,
                cursor: wizardStep === 0 ? 'not-allowed' : 'pointer',
                opacity: wizardStep === 0 ? 0.4 : 1,
                fontFamily: sans, fontSize: FS.md, fontWeight: 600, color: SECOND,
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {wizardStep < STEPS.length - 1 ? (
              <button
                onClick={() => setWizardStep(wizardStep + 1)}
                style={{
                  display: 'flex', alignItems: 'center', gap: R.md,
                  padding: `${SP.sm + 2}px ${SP.xl}px`, background: GOLD,
                  border: `1px solid ${GOLD}`, borderRadius: R.lg, cursor: 'pointer',
                  fontFamily: sans, fontSize: FS.md, fontWeight: 700, color: swatch.white,
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setWizardStep(STEPS.length)}
                style={{
                  display: 'flex', alignItems: 'center', gap: R.md,
                  padding: `${SP.sm + 2}px ${SP.xl}px`, background: GOLD,
                  border: 'none', borderRadius: R.lg, cursor: 'pointer',
                  fontFamily: sans, fontSize: FS.md, fontWeight: 700, color: swatch.white,
                }}
              >
                Ready to Generate <ChevronRight size={16} />
              </button>
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

      {/* Generate button — visible for quick mode with settlement (Regenerate),
          advanced mode after final step, or any mode with existing settlement. */}
      {(settlement || (isAdvanced && wizardStep >= STEPS.length)) && (
        <div>
          <button
            onClick={handleGenerate}
            style={{
              width: '100%', padding: isMobile ? `${SP.lg}px 0` : `${SP.lg - 2}px 0`,
              background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
              color: swatch.white, border: 'none', borderRadius: R.lg + 2, cursor: 'pointer',
              fontFamily: serif_,
              fontSize: isMobile ? FS.xxl : FS.xxl - 1, fontWeight: 600, letterSpacing: '0.02em',
              boxShadow: '0 3px 14px rgba(160,118,42,0.45)',
              transition: 'opacity 0.15s, transform 0.1s',
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.92'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            {settlement ? 'Regenerate Draft' : 'Generate Draft'}
          </button>
          {!settlement && (
            <p className="sf-readable-strip" style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: SP.sm, marginBottom: 0, textAlign: 'center',
              fontSize: FS.sm, color: SECOND, fontFamily: serif_, fontStyle: 'italic',
              lineHeight: 1.5,
            }}>
              {t('generate.subline')}
            </p>
          )}
          {generateError && (
            <div style={{
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
          <div style={{
            display: 'flex', alignItems: 'center', gap: SP.md,
            padding: `${SP.md}px ${SP.lg}px`,
            background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
            borderRadius: R.lg,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            position: 'sticky', top: isMobile ? 0 : 52, zIndex: 40,
          }}>
            <button
              onClick={handleBack}
              style={{
                display: 'flex', alignItems: 'center', gap: SP.xs,
                padding: `${SP.sm}px ${SP.md}px`,
                background: 'rgba(160,118,42,0.15)',
                border: `1px solid rgba(160,118,42,0.3)`,
                borderRadius: R.md, cursor: 'pointer',
                color: GOLD, fontSize: FS.sm, fontWeight: 600, fontFamily: sans,
              }}
              title="Back to configuration"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: FS.lg, fontWeight: 700, fontFamily: serif_,
                color: GOLD, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {settlement.name || 'Untitled Settlement'}
              </div>
              <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {settlement.tier || 'Settlement'} &middot; Pop. {settlement.population?.toLocaleString?.() || '?'}
              </div>
            </div>

            {/* Save UX consolidation (code-review fix): there was a
                second, smaller save button here that called
                savesService.save directly with no error toast, no
                "saved" feedback, and no canSave server-side gate.
                Removed — the SaveToLibraryButton lower in the page
                is the single canonical save action. Two save buttons
                pointing at the same outcome was confusing and meant
                users frequently clicked the worse one. */}
            <div style={{ display: 'flex', gap: SP.xs }}>
              <button
                onClick={handleNewSettlement}
                style={{
                  display: 'flex', alignItems: 'center', gap: SP.xs,
                  padding: `${SP.sm}px ${SP.md}px`,
                  background: GOLD,
                  border: 'none',
                  borderRadius: R.md, cursor: 'pointer',
                  color: swatch.white, fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
                }}
              >
                <Zap size={14} /> New
              </button>
            </div>
          </div>

          <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: MUTED, fontFamily: sans }}>Loading settlement view...</div>}>
            {/* P139 — cap the dossier body to the shared page width so it
                doesn't sprawl edge-to-edge on wide screens; the sticky nav
                toolbar above stays full-width. */}
            <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', width: '100%' }}>
              <OutputContainer hideHeader />
            </div>
          </Suspense>

          {/* Save to library */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: SP.xs }}>
            <SaveToLibraryButton
              settlement={settlement}
              canSave={canSave}
              isMobile={isMobile}
              onSignIn={onSignIn}
            />
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
            <button
              onClick={() => setShowOutput(true)}
              style={{
                padding: `${SP.sm}px ${SP.lg}px`, background: swatch['#2A7A2A'],
                color: swatch.white, border: 'none', borderRadius: R.md,
                cursor: 'pointer', fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
              }}
            >
              View Settlement
            </button>
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
