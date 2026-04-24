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
import React, { useCallback, useState, useRef, useEffect, lazy, Suspense } from 'react';
import { ChevronRight, ChevronLeft, Zap, Settings, ArrowLeft, Save } from 'lucide-react';
import { useStore } from '../store/index.js';
import { selectTierForGrid, selectCurrentCatalog, selectTierInstitutionNames, selectIsManualTier } from '../store/selectors.js';
import { saves as savesService } from '../lib/saves.js';
import ConfigurationPanel from './ConfigurationPanel';
import InstitutionalGrid from './InstitutionalGrid';
import ServicesTogglePanel from './ServicesTogglePanel';
import TradeDynamicsPanel from './TradeDynamicsPanel';
import { GOLD, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, BORDER2, CARD, PARCH, CARD_HDR, sans, serif_, SP, R, FS } from './theme.js';

// Lazy-load OutputContainer — 457 kB chunk deferred until settlement is generated
const OutputContainer = lazy(() => import('./OutputContainer'));

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
    hint: 'Force or exclude specific institutions. The generator uses your toggles as hard constraints — forced institutions always appear, excluded ones never do.',
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

// ── Mode selector ────────────────────────────────────────────────────────────

function ModeSelector({ mode, onModeChange, large = false }) {
  const modes = [
    { id: 'quick',    label: 'Quick Generate',    desc: 'Minimal config — set the foundations and go', Icon: Zap,      longDesc: 'Pick a tier, culture, and terrain. Everything else is randomized. Best for drop-in NPC stops.' },
    { id: 'advanced', label: 'Advanced Generate', desc: 'Full configuration, step by step',            Icon: Settings, longDesc: 'Walk through general config, institutions, services, and trade. Full control over the probability space.' },
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
            style={{
              flex: large ? '1 1 280px' : '1 1 200px',
              maxWidth: large ? 360 : 260,
              padding: large ? `${SP.xxl}px ${SP.xl}px` : `${SP.xl - 2}px ${SP.lg}px`,
              background: active ? GOLD_BG : CARD,
              border: `2px solid ${active ? GOLD : BORDER2}`,
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

function SaveToLibraryButton({ settlement, canSave, isMobile }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!settlement || saving) return;
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
      alert('Failed to save: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!canSave) {
    return (
      <button disabled style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        padding: isMobile ? '13px 24px' : '10px 24px',
        background: '#8a8a8a', color: '#fff', border: 'none', borderRadius: R.md,
        cursor: 'not-allowed', fontFamily: sans, fontSize: FS.md, fontWeight: 700,
        opacity: 0.5,
      }}>
        <Save size={15} /> Sign in to save
      </button>
    );
  }

  return (
    <button onClick={handleSave} disabled={saving || saved} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      padding: isMobile ? '13px 24px' : '10px 24px',
      background: saved ? '#2a7a2a' : '#1a4a2a',
      color: '#fff', border: 'none', borderRadius: R.md,
      cursor: saving || saved ? 'default' : 'pointer',
      fontFamily: sans, fontSize: FS.md, fontWeight: 700,
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      transition: 'all 0.2s',
    }}>
      <Save size={15} />
      {saved ? '✓ Saved to Library' : saving ? 'Saving...' : 'Save to Library'}
    </button>
  );
}

// ── Main wizard component ────────────────────────────────────────────────────

export default function GenerateWizard({ isMobile }) {
  // Store state
  const settlement    = useStore(s => s.settlement);
  const config        = useStore(s => s.config);
  const wizardStep    = useStore(s => s.wizardStep);
  const wizardMode    = useStore(s => s.wizardMode);
  const loadedFromSave = useStore(s => s.loadedFromSave);
  const importedNeighbour = useStore(s => s.importedNeighbour);
  const canSave       = useStore(s => s.canSave());
  const authTier      = useStore(s => s.auth.tier);
  const authRole      = useStore(s => s.auth.role);
  const aiSettlement  = useStore(s => s.aiSettlement);

  // Store actions
  const generate        = useStore(s => s.generateSettlement);
  const setWizardStep   = useStore(s => s.setWizardStep);
  const setWizardMode   = useStore(s => s.setWizardMode);
  const clearLoadedFromSave = useStore(s => s.clearLoadedFromSave);
  const clearNeighbour  = useStore(s => s.clearNeighbour);
  const clearSettlement = useStore(s => s.clearSettlement);

  // Local state for back navigation
  const [showOutput, setShowOutput] = useState(true);

  // Sync showOutput when a new settlement is generated (handles Workshop's own generate button)
  const prevSettlementRef = useRef(null);
  useEffect(() => {
    if (settlement && settlement !== prevSettlementRef.current) {
      setShowOutput(true);
      prevSettlementRef.current = settlement;
    }
  }, [settlement]);

  const handleGenerate = useCallback(() => {
    try {
      generate();
      clearLoadedFromSave();
      setShowOutput(true); // show output after generation
    } catch (e) {
      console.error('GENERATE ERROR:', e);
      alert('Error: ' + e.message);
    }
  }, [generate, clearLoadedFromSave]);

  /** Navigate back to the wizard, keeping the settlement in memory */
  const handleBack = useCallback(() => {
    setShowOutput(false);
  }, []);

  /** Start fresh — clear the settlement and return to wizard */
  const handleNewSettlement = useCallback(() => {
    if (clearSettlement) clearSettlement();
    setShowOutput(false);
    setWizardStep(0);
  }, [clearSettlement, setWizardStep]);

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

  // Card picker: no mode selected yet and no settlement — show ONLY the two mode cards.
  // User must pick Quick or Advanced before any config UI appears.
  if (!wizardMode && !settlement) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl, maxWidth: 860, margin: '0 auto', padding: `${SP.xl}px 0` }}>
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
        {authTier === 'anon' && (
          <div style={{ padding: `${SP.sm + 2}px ${SP.lg}px`, background: '#fef9ee', border: `1px solid ${GOLD}`, borderLeft: `4px solid ${GOLD}`, borderRadius: R.lg - 1, fontSize: FS.sm, color: SECOND, textAlign: 'center' }}>
            Free mode: generating Thorp, Hamlet, or Village. Sign in for all settlement tiers.
          </div>
        )}
        <ModeSelector mode={wizardMode} onModeChange={setWizardMode} large />
      </div>
    );
  }

  // "Change mode" back button — shown above the mode-specific UI once a card is picked.
  const ChangeModeBar = () => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      padding: `${SP.sm}px ${SP.md}px`,
      background: CARD_HDR,
      border: `1px solid ${BORDER}`,
      borderRadius: R.md,
      fontSize: FS.sm, color: SECOND,
    }}>
      <button
        onClick={() => setWizardMode(null)}
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
        {wizardMode === 'quick' ? 'Quick Generate' : 'Advanced Generate'}
      </span>
    </div>
  );

  // Quick mode: General Config only, then generate.
  // Renders the SAME ConfigurationPanel as Advanced step 0 — just no further steps.
  if (wizardMode === 'quick' && !settlement) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl, maxWidth: 760, margin: '0 auto', padding: `${SP.xl}px 0` }}>
        <ChangeModeBar />

        {authTier === 'anon' && (
          <div style={{ padding: `${SP.sm + 2}px ${SP.lg}px`, background: '#fef9ee', border: `1px solid ${GOLD}`, borderLeft: `4px solid ${GOLD}`, borderRadius: R.lg - 1, fontSize: FS.sm, color: SECOND }}>
            Free mode: generating Thorp, Hamlet, or Village. Sign in for all settlement tiers.
          </div>
        )}

        {/* Helper banner — explains Quick is one-screen */}
        <div style={{
          padding: `${SP.sm + 2}px ${SP.lg}px`, background: '#fef9ee',
          border: `1px solid ${GOLD}`, borderLeft: `4px solid ${GOLD}`,
          borderRadius: R.lg - 1, fontSize: FS.sm, color: SECOND, lineHeight: 1.5,
        }}>
          <strong style={{ fontFamily: serif_ }}>Quick Generate</strong>
          {' — '}Set the foundations and hit Generate. Everything else is randomized.
          Switch to <strong>Advanced Generate</strong> for institution toggles, services, and trade dynamics.
        </div>

        <div
          data-onboard-highlight={onboardingActive && onboardingStep === 0 ? 'true' : undefined}
          style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, overflow: 'hidden' }}
        >
          <div style={{ padding: `${SP.md}px ${SP.lg}px`, background: CARD_HDR, borderBottom: `1px solid ${BORDER2}` }}>
            <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK }}>General Configuration</span>
          </div>
          <div style={{ padding: `${SP.lg}px 0 0` }}>
            <ConfigurationPanel />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          data-onboard-highlight={onboardingActive && onboardingStep === 1 ? 'true' : undefined}
          style={{
            width: '100%', padding: isMobile ? `${SP.xl}px 0` : `${SP.xl - 2}px 0`,
            background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
            color: '#fff', border: 'none', borderRadius: R.lg + 2, cursor: 'pointer',
            fontFamily: serif_,
            fontSize: isMobile ? 22 : FS.xxl, fontWeight: 600, letterSpacing: '0.02em',
            boxShadow: '0 4px 20px rgba(160,118,42,0.45)',
            transition: 'opacity 0.15s, transform 0.1s',
          }}
        >
          Generate Settlement
        </button>
      </div>
    );
  }

  // Advanced mode: step-by-step wizard (custom mode removed — folded into Compendium)
  const isAdvanced = wizardMode === 'advanced';
  const currentStepDef = STEPS[wizardStep] || STEPS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Change-mode bar (collapse after first generation) */}
      {!settlement && <ChangeModeBar />}

      {/* Banners */}
      {loadedFromSave && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fdf8ee', border: '2px solid #b8860b', borderRadius: 8, padding: '10px 14px' }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>&#128203;</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#5a3a00' }}>Config loaded: {loadedFromSave.name}</span>
            {loadedFromSave.tier && <span style={{ fontSize: 12, color: '#8a6020', marginLeft: 8 }}>{loadedFromSave.tier}</span>}
          </div>
          <button onClick={clearLoadedFromSave} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(184,134,11,0.15)', border: '1px solid #b8860b', color: '#5a3a00', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>&times;</button>
        </div>
      )}

      {importedNeighbour && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f0faf2', border: '2px solid #4a8a60', borderRadius: 8, padding: '10px 14px' }}>
          <span style={{ fontSize: 16 }}>&#127760;</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1a5a28' }}>Neighbour active: {importedNeighbour.name}</span>
            <span style={{ fontSize: 12, color: '#4a8a60', marginLeft: 8 }}>{importedNeighbour.tier}</span>
          </div>
          <button onClick={clearNeighbour} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(74,138,96,0.15)', border: '1px solid #4a8a60', color: '#1a5a28', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>&times;</button>
        </div>
      )}

      {/* Step indicator + hint (advanced mode, pre-generation) */}
      {isAdvanced && !settlement && (
        <>
          <StepIndicator currentStep={wizardStep} totalSteps={STEPS.length} />

          {/* Contextual hint for current step */}
          <div style={{
            padding: `${SP.sm + 2}px ${SP.lg}px`, background: '#fef9ee',
            border: `1px solid ${GOLD}`, borderLeft: `4px solid ${GOLD}`,
            borderRadius: R.lg - 1, fontSize: FS.md, color: SECOND, lineHeight: 1.5,
          }}>
            <strong style={{ fontFamily: serif_ }}>
              Step {wizardStep + 1}: {currentStepDef.label}
            </strong>
            {' — '}{currentStepDef.hint}
          </div>

          {/* Current step content */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, overflow: 'hidden' }}>
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
                  padding: `${SP.sm + 2}px ${SP.xl}px`, background: GOLD_BG,
                  border: `1px solid ${GOLD}`, borderRadius: R.lg, cursor: 'pointer',
                  fontFamily: sans, fontSize: FS.md, fontWeight: 600, color: GOLD,
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
                  fontFamily: sans, fontSize: FS.md, fontWeight: 700, color: '#fff',
                }}
              >
                Ready to Generate <ChevronRight size={16} />
              </button>
            )}
          </div>
        </>
      )}

      {/* Generate button — visible for quick mode with settlement (Regenerate),
          advanced mode after final step, or any mode with existing settlement. */}
      {(settlement || (isAdvanced && wizardStep >= STEPS.length)) && (
        <button
          onClick={handleGenerate}
          style={{
            width: '100%', padding: isMobile ? `${SP.lg}px 0` : `${SP.lg - 2}px 0`,
            background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
            color: '#fff', border: 'none', borderRadius: R.lg + 2, cursor: 'pointer',
            fontFamily: serif_,
            fontSize: isMobile ? FS.xxl : FS.xxl - 1, fontWeight: 600, letterSpacing: '0.02em',
            boxShadow: '0 3px 14px rgba(160,118,42,0.45)',
            transition: 'opacity 0.15s, transform 0.1s',
          }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.92'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          {settlement ? 'Regenerate Settlement' : 'Generate Settlement'}
        </button>
      )}

      {/* Output + export buttons */}
      {settlement && showOutput && (
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

            <div style={{ display: 'flex', gap: SP.xs }}>
              {canSave && (
                <button
                  onClick={async () => {
                    try {
                      await savesService.save({
                        name: settlement.name || 'Untitled Settlement',
                        tier: settlement.tier || 'unknown',
                        settlement,
                      });
                    } catch (e) { console.error('Save failed:', e); }
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: SP.xs,
                    padding: `${SP.sm}px ${SP.md}px`,
                    background: 'rgba(42,122,42,0.2)',
                    border: '1px solid rgba(42,122,42,0.4)',
                    borderRadius: R.md, cursor: 'pointer',
                    color: '#4a8a4a', fontSize: FS.sm, fontWeight: 600, fontFamily: sans,
                  }}
                  title="Save settlement"
                >
                  <Save size={14} /> Save
                </button>
              )}
              <button
                onClick={handleNewSettlement}
                style={{
                  display: 'flex', alignItems: 'center', gap: SP.xs,
                  padding: `${SP.sm}px ${SP.md}px`,
                  background: GOLD,
                  border: 'none',
                  borderRadius: R.md, cursor: 'pointer',
                  color: '#fff', fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
                }}
              >
                <Zap size={14} /> New
              </button>
            </div>
          </div>

          <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: MUTED, fontFamily: sans }}>Loading settlement view...</div>}>
            <OutputContainer />
          </Suspense>

          {/* Save to library */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: SP.xs }}>
            <SaveToLibraryButton settlement={settlement} canSave={canSave} isMobile={isMobile} />
          </div>
        </>
      )}

      {/* When settlement exists but user navigated back — show re-view option */}
      {settlement && !showOutput && (
        <div style={{
          padding: `${SP.md}px ${SP.lg}px`, background: '#f0faf2',
          border: '1px solid #4a8a60', borderRadius: R.lg,
          display: 'flex', alignItems: 'center', gap: SP.md,
        }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: FS.md, fontWeight: 700, color: '#1a5a28' }}>
              Last generated: {settlement.name || 'Untitled'}
            </span>
            <span style={{ fontSize: FS.sm, color: '#4a8a60', marginLeft: SP.sm }}>
              {settlement.tier}
            </span>
          </div>
          <button
            onClick={() => setShowOutput(true)}
            style={{
              padding: `${SP.sm}px ${SP.lg}px`, background: '#2a7a2a',
              color: '#fff', border: 'none', borderRadius: R.md,
              cursor: 'pointer', fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
            }}
          >
            View Settlement
          </button>
        </div>
      )}
    </div>
  );
}
