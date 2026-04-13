/**
 * GenerateWizard.jsx — Step-by-step settlement creation wizard.
 *
 * Replaces the old GenerateView with three modes:
 *   Quick    — minimal config, one-click generation
 *   Advanced — full config (one step at a time, not all at once)
 *   Custom   — blank template for manual entry (future)
 *
 * Each step shows only its own content, with contextual help in the
 * sidebar/footer drawn from the Compendium and How to Use content.
 * Steps are navigated with Next/Back, not all visible simultaneously.
 *
 * Reads all state from the Zustand store — zero props.
 */
import React, { useCallback } from 'react';
import { Download, Sparkles, Map, FileText, ChevronRight, ChevronLeft, Zap, Settings, Pencil } from 'lucide-react';
import { useStore } from '../store/index.js';
import { selectTierForGrid, selectCurrentCatalog, selectTierInstitutionNames, selectIsManualTier } from '../store/selectors.js';
import { generateSettlementPDF } from '../utils/generateSettlementPDF.js';
import { downloadNarrativePrompt, downloadMapPrompt } from '../utils/promptExporters.js';
import ConfigurationPanel from './ConfigurationPanel';
import InstitutionalGrid from './InstitutionalGrid';
import ServicesTogglePanel from './ServicesTogglePanel';
import TradeDynamicsPanel from './TradeDynamicsPanel';
import OutputContainer from './OutputContainer';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, BORDER2, CARD, PARCH, CARD_HDR, sans, serif_, SP, R, FS } from './theme.js';

function downloadJSON(settlement) {
  if (!settlement) return;
  const blob = new Blob([JSON.stringify(settlement, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `${(settlement.name || 'settlement').replace(/\s+/g, '_')}.json`,
  });
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
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

function ModeSelector({ mode, onModeChange }) {
  const modes = [
    { id: 'quick', label: 'Quick Generate', desc: 'Randomised with sensible defaults', Icon: Zap },
    { id: 'advanced', label: 'Advanced', desc: 'Full configuration, step by step', Icon: Settings },
    { id: 'custom', label: 'Custom Template', desc: 'Blank template, fill your own fields', Icon: Pencil },
  ];

  return (
    <div style={{ display: 'flex', gap: SP.md, justifyContent: 'center', flexWrap: 'wrap', padding: `${SP.sm}px 0` }}>
      {modes.map(({ id, label, desc, Icon }) => {
        const active = mode === id;
        const disabled = id === 'custom';
        return (
          <button
            key={id}
            onClick={() => !disabled && onModeChange(id)}
            disabled={disabled}
            style={{
              flex: '1 1 200px', maxWidth: 260,
              padding: `${SP.xl - 2}px ${SP.lg}px`,
              background: active ? GOLD_BG : CARD,
              border: `2px solid ${active ? GOLD : BORDER2}`,
              borderRadius: R.lg, cursor: disabled ? 'not-allowed' : 'pointer',
              textAlign: 'center',
              opacity: disabled ? 0.45 : 1,
              transition: 'all 0.2s',
            }}
          >
            <Icon size={24} color={active ? GOLD : MUTED} style={{ marginBottom: 6 }} />
            <div style={{ fontSize: FS.lg, fontWeight: 700, fontFamily: serif_, color: active ? INK : SECOND }}>
              {label}
            </div>
            <div style={{ fontSize: FS.sm, color: MUTED, marginTop: SP.xs }}>{desc}</div>
            {disabled && <div style={{ fontSize: FS.xxs, color: GOLD, marginTop: 6, fontWeight: 600 }}>Coming Soon</div>}
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

// ── Main wizard component ────────────────────────────────────────────────────

export default function GenerateWizard({ isMobile }) {
  // Store state
  const settlement    = useStore(s => s.settlement);
  const config        = useStore(s => s.config);
  const wizardStep    = useStore(s => s.wizardStep);
  const wizardMode    = useStore(s => s.wizardMode);
  const loadedFromSave = useStore(s => s.loadedFromSave);
  const importedNeighbour = useStore(s => s.importedNeighbour);
  const canExport     = useStore(s => s.canExport());
  const authTier      = useStore(s => s.auth.tier);
  const aiSettlement  = useStore(s => s.aiSettlement);

  // Store actions
  const generate        = useStore(s => s.generateSettlement);
  const setWizardStep   = useStore(s => s.setWizardStep);
  const setWizardMode   = useStore(s => s.setWizardMode);
  const clearLoadedFromSave = useStore(s => s.clearLoadedFromSave);
  const clearNeighbour  = useStore(s => s.clearNeighbour);

  const handleGenerate = useCallback(() => {
    try {
      generate();
      clearLoadedFromSave();
    } catch (e) {
      console.error('GENERATE ERROR:', e);
      alert('Error: ' + e.message);
    }
  }, [generate, clearLoadedFromSave]);

  // Quick mode: skip steps, go straight to generate
  if (wizardMode === 'quick' && !settlement) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl, maxWidth: 600, margin: '0 auto', padding: `${SP.xl}px 0` }}>
        <ModeSelector mode={wizardMode} onModeChange={setWizardMode} />

        <div style={{ textAlign: 'center', padding: `${SP.xl}px 0` }}>
          <p style={{ fontSize: 14, color: SECOND, fontFamily: sans, lineHeight: 1.6 }}>
            Generate a fully randomised settlement with sensible defaults.
            No configuration needed — just click and discover your world.
          </p>
        </div>

        {authTier === 'anon' && (
          <div style={{ padding: `${SP.sm + 2}px ${SP.lg}px`, background: '#fef9ee', border: `1px solid ${GOLD}`, borderLeft: `4px solid ${GOLD}`, borderRadius: R.lg - 1, fontSize: FS.sm, color: SECOND }}>
            Free mode: generating Thorp, Hamlet, or Village. Sign in for all settlement tiers.
          </div>
        )}

        <button onClick={handleGenerate} style={{
          width: '100%', padding: isMobile ? `${SP.xl}px 0` : `${SP.xl - 2}px 0`,
          background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
          color: '#fff', border: 'none', borderRadius: R.lg + 2, cursor: 'pointer',
          fontFamily: serif_,
          fontSize: isMobile ? 22 : FS.xxl, fontWeight: 600, letterSpacing: '0.02em',
          boxShadow: '0 4px 20px rgba(160,118,42,0.45)',
          transition: 'opacity 0.15s, transform 0.1s',
        }}>
          Generate Settlement
        </button>
      </div>
    );
  }

  // Advanced mode: step-by-step wizard
  const isAdvanced = wizardMode === 'advanced';
  const currentStepDef = STEPS[wizardStep] || STEPS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Mode selector (collapse after first generation) */}
      {!settlement && <ModeSelector mode={wizardMode} onModeChange={setWizardMode} />}

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

      {/* Generate button — visible when on final step or quick mode with settlement */}
      {(!isAdvanced || wizardStep >= STEPS.length || settlement) && (
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
      {settlement && (
        <>
          <OutputContainer />

          {/* Export buttons — premium only for PDF/JSON */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: isMobile ? SP.sm : SP.sm + 2, paddingTop: SP.xs }}>
            {[
              { label: 'Save/Export JSON', Icon: Download, action: () => downloadJSON(settlement), color: '#1a4a2a', premium: true },
              { label: 'Narrative AI Prompt', Icon: Sparkles, action: () => downloadNarrativePrompt(settlement), color: '#5a3a8a', premium: true },
              { label: 'Map AI Prompt', Icon: Map, action: () => downloadMapPrompt(settlement), color: '#8a3a1a', premium: true },
              { label: 'Export PDF', Icon: FileText, action: () => generateSettlementPDF(aiSettlement ? { ...settlement, _aiNarrative: aiSettlement } : settlement), color: '#7a1a1a', premium: true },
            ].map(({ label, Icon, action, color, premium }) => {
              const locked = premium && !canExport;
              return (
                <button
                  key={label}
                  onClick={locked ? undefined : action}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: isMobile ? `${FS.md}px ${SP.xl - 2}px` : `9px ${SP.xl - 2}px`,
                    width: isMobile ? '100%' : 'auto',
                    background: locked ? '#8a8a8a' : color,
                    color: '#fff', border: 'none', borderRadius: R.md, cursor: locked ? 'not-allowed' : 'pointer',
                    fontFamily: sans, fontSize: FS.md, fontWeight: 700,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    opacity: locked ? 0.5 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  <Icon size={14} />
                  {label}
                  {locked && <span style={{ fontSize: FS.xxs, marginLeft: SP.xs }}>PRO</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
