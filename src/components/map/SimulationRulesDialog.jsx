import { cloneElement, isValidElement, useId, useMemo, useState } from 'react';
import { Eye, Settings2, X } from 'lucide-react';

import { useStore } from '../../store/index.js';
import {
  SIMULATION_RULE_PRESETS, normalizeSimulationRules, worldProgressionOf, } from '../../domain/worldPulse/simulationRules.js';
import { validateSimulationProfile } from '../../domain/worldPulse/simulationProfile.js';
import { DomainRows, EngineWaves, WorldLawAxes } from './SimulationRulesAxes.jsx';
import {
  BODY, BORDER, BORDER2, CARD, CARD_ALT, ELEV, FS, GOLD, GOLD_BG, INK, MUTED, RED, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { t } from '../../copy/index.js';
import IconButton from '../primitives/IconButton.jsx';
import PageHeader from '../primitives/PageHeader.jsx';
import { useDialogFocusTrap } from '../primitives/useDialogFocusTrap.js';
import DisclosureHeader from './SimulationRulesDisclosure.jsx';

/*
 * Dialog v2 (Phase 5.5 CL-0, design §11): preset-picker-prominent, then the
 * five world-law AXIS cards, then the per-domain tri-state rows, with the
 * fine-grained subsystem switches behind the Detail disclosure.
 *
 * THE COPY LAW (binding, §11): every control describes a FICTIONAL ASSUMPTION
 * about the world — "time is frozen", "news is always accurate", "trade adjusts
 * on its own" — never an engine mechanism. The DM chooses what kind of world;
 * the engine chooses the implementation.
 *
 * Preserved from RP-1 verbatim: the focus trap (useDialogFocusTrap) and the
 * mid-advance write guard (banner + disabled Save + the belt-and-braces check
 * in save()); tests/ui/simulationRulesDialog.writeGuard.test.jsx pins both.
 */

const PROPAGATION_OPTIONS = [
  ['full', 'Full regional'],
  ['first_order', 'First order'],
  ['local', 'Local only'],
  ['off', 'Off'],
];

const INTENSITY_OPTIONS = [
  ['conservative', 'Conservative'],
  ['normal', 'Normal'],
  ['dramatic', 'Dramatic'],
];

const MIGRATION_OPTIONS = [
  ['roll', 'Roll outcome'],
  ['void', 'Into void'],
  ['distributed', 'Distribute'],
  ['concentrated', 'Concentrate'],
];

// The fine-grained subsystem switches that stay behind Detail. Diplomacy,
// trade, migration, faith, war, and ambition moved UP into the tri-state
// domain rows; the approval flag moved up into the "Who decides" axis.
const TOGGLES = [
  ['emergentEventsEnabled', 'Emergents'],
  ['stressorsEnabled', 'Stressors'],
  ['npcAgencyEnabled', 'NPC agency'],
  ['factionCompetitionEnabled', 'Factions'],
  ['populationDynamicsEnabled', 'Population'],
  ['resourceDriftEnabled', 'Resources'],
  ['tierDriftEnabled', 'Promotion/demotion'],
  ['institutionLifecycleEnabled', 'Institution lifecycle'],
];

// The §11 preset grid: the four control-layer presets. The legacy trio
// (quiet_local / realistic_regional / dramatic_campaign) stays resolvable in
// SIMULATION_RULE_PRESETS — old saves keep their identity and the realm
// toolbar chips keep working — but this grid tells the §11 story. Richer,
// fiction-level card copy lives HERE (lazy chunk) so the entry-closure preset
// catalog carries only its short summaries.
const GRID_PRESETS = [
  ['static_campaign', 'A recorded world: nothing moves unless you move it.'],
  ['narrative_campaign', 'An authored world that reacts and proposes, but never takes over.'],
  ['living_realm', 'Routine life runs itself; the major turns still ask you first.'],
  ['full_simulation', 'The whole engine: war, faith, trade, and politics act on their own.'],
];

function human(value) {
  return String(value || '').replace(/_/g, ' ');
}

function rulesKeyFor(campaign) {
  return JSON.stringify(normalizeSimulationRules(campaign?.worldState?.simulationRules));
}

function Field({ label, children }) {
  const controlId = useId();
  return (
    // htmlFor associates the label with the cloned control's injected id; the
    // rule's static nesting check can't see through the custom child component.
    // eslint-disable-next-line jsx-a11y/label-has-for
    <label htmlFor={controlId} style={{ display: 'grid', gap: 6, minWidth: 0 }}>
      <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
        {label}
      </span>
      {isValidElement(children) ? cloneElement(children, { id: controlId }) : children}
    </label>
  );
}

function Select({ id, value, options, onChange, disabled = false }) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={event => onChange(event.target.value)}
      style={{
        width: '100%',
        minHeight: 36,
        padding: `${SP.xs}px ${SP.sm}px`,
        border: `1px solid ${BORDER}`,
        background: CARD,
        color: INK,
        fontFamily: sans,
        fontSize: FS.sm,
        fontWeight: 800,
        opacity: disabled ? 0.85 : 1,
        cursor: disabled ? 'default' : undefined,
      }}
    >
      {options.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
    </select>
  );
}

function Toggle({ checked, label, onChange, disabled = false }) {
  const controlId = useId();
  return (
    <label htmlFor={controlId} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minHeight: 32,
      padding: '6px 8px',
      border: `1px solid ${BORDER2}`,
      background: checked ? GOLD_BG : CARD,
      color: INK,
      fontFamily: sans,
      fontSize: FS.xs,
      fontWeight: 850,
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.85 : 1,
    }}>
      <input
        id={controlId}
        type="checkbox"
        aria-label={label}
        checked={checked}
        disabled={disabled}
        onChange={event => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{
      display: 'grid',
      gap: 2,
      minWidth: 0,
      padding: SP.sm,
      border: `1px solid ${BORDER2}`,
      background: CARD,
    }}>
      <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 850, textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 950 }}>
        {value}
      </span>
    </div>
  );
}

export default function SimulationRulesDialog({ open, campaign, onClose }) {
  if (!open) return null;
  return (
    <SimulationRulesDialogContent
      key={`${campaign?.id || 'campaign'}:${rulesKeyFor(campaign)}`}
      campaign={campaign}
      onClose={onClose}
    />
  );
}

function SimulationRulesDialogContent({ campaign, onClose }) {
  const updateRules = useStore(s => s.updateCampaignSimulationRules);
  const previewWorldPulse = useStore(s => s.previewCampaignWorldPulse);
  // While this campaign's advance is in flight the store no-ops the rules write
  // (it would be clobbered by the advance's wholesale worldState replace), so a
  // Save would silently drop the GM's edit. Subscribe to the advanceInFlight LIST
  // itself (not the stable isAdvanceInFlight fn ref) so the disable + hint re-render
  // the instant an advance starts or ends — same membership test the store uses.
  const advanceInFlightList = useStore(s => s.advanceInFlight);
  const advanceBlocked = !!(
    campaign?.id
    && Array.isArray(advanceInFlightList)
    && advanceInFlightList.some(id => String(id) === String(campaign.id))
  );
  // Trap focus inside the modal, close on Escape, and restore focus to the
  // trigger on unmount (a11y: the dialog previously closed only on outside
  // mousedown — no Escape, no focus containment). This content only mounts while
  // the dialog is open, so the hook's `open` flag is always true here.
  const dialogRef = useDialogFocusTrap(true, onClose);
  const titleId = useId();
  const [draft, setDraft] = useState(() => normalizeSimulationRules(campaign?.worldState?.simulationRules));
  const [busy, setBusy] = useState(false);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [previewResult, setPreviewResult] = useState(null);
  const [error, setError] = useState(null);
  // Progressive disclosure: presets + axes + domain rows stay open; the
  // fine-grained Detail toggles collapse. Detail defaults closed.
  const [detailOpen, setDetailOpen] = useState(false);

  const activePreset = SIMULATION_RULE_PRESETS[draft.presetId] || null;
  const previewOutcomes = previewResult?.pulseRecord?.selectedOutcomes || previewResult?.selected || [];

  // The dependency-gating record for the CURRENT draft — coercions as data
  // (validateSimulationProfile), consumed for the honest disabled states.
  const gating = useMemo(() => validateSimulationProfile(draft), [draft]);
  const frozen = worldProgressionOf(draft) === 'frozen';
  const frozenAutonomyLaw = gating.coercions.find(c => c.law === 'frozen_world_pauses_autonomy') || null;

  const setFields = (patch) => {
    setDraft(current => {
      const merged = { ...current, ...patch };
      // Store-seam mirror: Diplomacy OFF cascades War + Ambition off; War ON locks Ambition on.
      if (!merged.relationshipDynamicsEnabled) { merged.warLayerEnabled = false; merged.settlementStrategyEnabled = false; }
      if (merged.warLayerEnabled) merged.settlementStrategyEnabled = true;
      return normalizeSimulationRules(merged);
    });
    setPreviewResult(null);
  };
  const setField = (key, value) => setFields({ [key]: value });

  // Domain rows write the flags (the booleans REMAIN the storage; the tri-state
  // is the read model). The faith row pair-writes its legacy mirror so the
  // canonical write survives the normalizer's legacy-wins lockstep — same fix
  // as LivingWorldGates (verified: a lone faithSpreadEnabled write is dropped).
  const setDomainEnabled = (domain, enabled) => {
    if (domain === 'religion') {
      setFields({ faithSpreadEnabled: enabled, religionDynamicsEnabled: enabled });
      return;
    }
    const flagByDomain = {
      diplomacy: 'relationshipDynamicsEnabled',
      trade: 'tradeFlowsEnabled',
      migration: 'migrationFlowsEnabled',
      war: 'warLayerEnabled',
      strategy: 'settlementStrategyEnabled',
      seasons: 'seasonsEnabled',
    };
    setField(flagByDomain[domain], enabled);
  };

  const applyPreset = (presetId) => {
    const preset = SIMULATION_RULE_PRESETS[presetId];
    if (!preset) return;
    setDraft(normalizeSimulationRules(preset.rules));
    setPreviewResult(null);
  };

  const runPreview = async () => {
    if (!campaign?.id || previewBusy || frozen) return;
    setPreviewBusy(true);
    setError(null);
    try {
      const result = await Promise.resolve(previewWorldPulse(campaign.id, 'one_month', { simulationRules: draft }));
      setPreviewResult(result);
      if (!result) setError(t('errors.previewFail'));
    } catch (err) {
      setError(t('errors.previewFail'));
    } finally {
      setPreviewBusy(false);
    }
  };

  const save = async () => {
    if (!campaign?.id || busy) return;
    // The store no-ops the rules write while the realm advances; refuse here so
    // Save never reports success over a dropped write. The button is also disabled
    // off advanceBlocked — this is the belt-and-braces guard.
    if (advanceBlocked) { setError(t('errors.realmAdvancingSaveLater')); return; }
    setBusy(true);
    setError(null);
    try {
      await updateRules(campaign.id, draft);
      onClose?.();
    } catch (err) {
      setError(t('errors.rulesSaveFail'));
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    // normalize({}) is the untouched-campaign default — it carries NO profile
    // keys, so resetting a legacy campaign never materializes the profile.
    setDraft(normalizeSimulationRules({}));
    setPreviewResult(null);
  };

  return (
    <div
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose?.();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 310,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SP.lg,
        background: 'rgba(27,20,8,0.46)',
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          width: 'min(100%, 680px)',
          maxHeight: 'min(92vh, 800px)',
          overflow: 'auto',
          border: `1px solid ${BORDER}`,
          background: CARD_ALT,
          boxShadow: ELEV[3],
        }}
      >
        <header style={{
          display: 'flex',
          alignItems: 'center',
          gap: SP.md,
          padding: `${SP.lg}px ${SP.lg}px ${SP.md}px`,
          borderBottom: `1px solid ${BORDER}`,
          background: CARD,
        }}>
          <div style={{
            width: 34,
            height: 34,
            border: `1px solid ${BORDER}`,
            background: CARD_ALT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: GOLD,
            flexShrink: 0,
          }}>
            <Settings2 size={17} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            {/* PageHeader carries the title/subtitle in the shared header idiom
                (serif title, italic subtitle); the gold Settings2 chip and the
                IconButton close stay in this header row. */}
            <PageHeader
              size="sm"
              as="h2"
              id={titleId}
              title="Simulation rules"
              subtitle={(
                <span>
                  {campaign?.name || 'Campaign'}
                  <span style={{ margin: '0 0.4em', color: MUTED }}>·</span>
                  {activePreset?.label || 'Custom'}
                </span>
              )}
              actions={(
                <IconButton
                  Icon={X}
                  label="Close simulation rules"
                  onClick={onClose}
                  tone="ghost"
                  size="lg"
                />
              )}
            />
          </div>
        </header>

        <div style={{ padding: SP.lg, display: 'grid', gap: SP.lg }}>
          {advanceBlocked && (
            <div
              data-testid="rules-advance-blocked" role="status" aria-live="polite"
              style={{ border: `1px solid ${GOLD}`, padding: SP.sm, background: GOLD_BG, color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}
            >
              The realm is advancing. Give it a moment, then save your rules.
            </div>
          )}
          {error && (
            <div style={{
              border: '1px solid rgba(197,74,74,0.45)',
              padding: SP.sm,
              background: 'rgba(197,74,74,0.08)',
              color: RED,
              fontFamily: sans,
              fontSize: FS.xs,
              fontWeight: 850,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gap: SP.sm }}>
            <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
              What kind of world is this?
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
              gap: SP.sm,
            }}>
              {GRID_PRESETS.map(([presetId, cardCopy]) => {
                const preset = SIMULATION_RULE_PRESETS[presetId];
                const selected = draft.presetId === presetId;
                return (
                  <button
                    key={presetId}
                    type="button"
                    onClick={() => applyPreset(presetId)}
                    disabled={advanceBlocked}
                    style={{
                      display: 'grid',
                      gap: 5,
                      minHeight: 74,
                      padding: SP.sm,
                      textAlign: 'left',
                      border: `1px solid ${selected ? GOLD : BORDER2}`,
                      background: selected ? GOLD_BG : CARD,
                      color: INK,
                      cursor: advanceBlocked ? 'default' : 'pointer',
                      opacity: advanceBlocked ? 0.85 : 1,
                    }}
                  >
                    <span style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 950 }}>
                      {preset.label}
                    </span>
                    <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750, lineHeight: 1.35 }}>
                      {cardCopy}
                    </span>
                  </button>
                );
              })}
            </div>
            {!GRID_PRESETS.some(([presetId]) => presetId === draft.presetId) && (
              <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
                {activePreset ? `${activePreset.label} (a classic preset)` : 'Custom: this world follows its own laws.'}
              </div>
            )}
          </div>

          {/* ── The five world-law AXES (§11) + the per-domain tri-state rows.
              Extracted to SimulationRulesAxes.jsx (max-lines discipline, same
              split as SimulationRulesDisclosure). */}
          <WorldLawAxes
            draft={draft}
            advanceBlocked={advanceBlocked}
            frozenAutonomyLaw={frozenAutonomyLaw}
            onSetField={setField}
            spatialMapped={!!campaign?.worldState?.spatialCanonVersion}
          />
          <DomainRows
            draft={draft}
            advanceBlocked={advanceBlocked}
            onSetDomain={setDomainEnabled}
          />
          {/* ── The nine engine-wave gates (W-R2-LIGHT): the deep anti-stasis
              systems the world-alive presets light, exposed individually so a DM
              can compose their own world. War-coupled waves lock until War is lit. */}
          <EngineWaves
            draft={draft}
            advanceBlocked={advanceBlocked}
            spatialMapped={!!campaign?.worldState?.spatialCanonVersion}
            onSetField={setField}
          />

          {/* ── DETAIL altitude: the propagation/intensity/migration selects and
              the remaining fine-grained subsystem toggles, behind a disclosure. */}
          <div style={{ display: 'grid', gap: SP.sm }}>
            <DisclosureHeader
              open={detailOpen}
              onToggle={() => setDetailOpen(o => !o)}
              regionId={`${titleId}-detail`}
              title="Detail toggles"
              summary="Propagation, intensity, migration, and the eight subsystem switches."
            />
            {detailOpen && (
              <div id={`${titleId}-detail`} style={{ display: 'grid', gap: SP.lg }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))',
                  gap: SP.md,
                }}>
                  <Field label="Propagation">
                    <Select value={draft.propagationMode} options={PROPAGATION_OPTIONS} disabled={advanceBlocked} onChange={value => setField('propagationMode', value)} />
                  </Field>
                  <Field label="Intensity">
                    <Select value={draft.intensity} options={INTENSITY_OPTIONS} disabled={advanceBlocked} onChange={value => setField('intensity', value)} />
                  </Field>
                  <Field label="Migration">
                    <Select value={draft.migrationMode} options={MIGRATION_OPTIONS} disabled={advanceBlocked} onChange={value => setField('migrationMode', value)} />
                  </Field>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
                  gap: SP.sm,
                }}>
                  {TOGGLES.map(([key, label]) => (
                    <Toggle
                      key={key}
                      label={label}
                      checked={draft[key] !== false}
                      disabled={advanceBlocked}
                      onChange={value => setField(key, value)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gap: SP.sm,
            padding: SP.md,
            border: `1px solid ${BORDER}`,
            background: CARD,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 950 }}>
                  One Month Preview
                </div>
                <div style={{ marginTop: 2, color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750 }}>
                  {human(draft.propagationMode)} / {human(draft.intensity)} / {human(draft.migrationMode)}
                </div>
              </div>
              <Button
                variant="gold"
                size="sm"
                icon={<Eye size={13} />}
                onClick={runPreview}
                busy={previewBusy}
                disabled={!campaign?.id || frozen}
                title={frozen ? 'Time is frozen. There is nothing to preview until it thaws.' : undefined}
              >
                Preview
              </Button>
            </div>
            {frozen ? (
              <div data-testid="rules-frozen-note" style={{ border: `1px dashed ${BORDER2}`, padding: SP.sm, color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
                Time is frozen: the world will not advance (the Advance action is disabled) until you set Time back to “On your mark”. Everything is preserved exactly as it stands.
              </div>
            ) : previewResult ? (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 110px), 1fr))',
                  gap: SP.sm,
                }}>
                  <Metric label="Candidates" value={previewResult.pulseRecord?.candidateCount ?? previewResult.candidates?.length ?? 0} />
                  <Metric label="Selected" value={previewResult.pulseRecord?.selectedCount ?? previewOutcomes.length} />
                  <Metric label="Applied" value={previewResult.pulseRecord?.autoAppliedCount ?? previewResult.autoApplied?.length ?? 0} />
                  <Metric label="Proposals" value={previewResult.pulseRecord?.proposalCount ?? previewResult.proposals?.length ?? 0} />
                </div>
                {previewOutcomes.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {previewOutcomes.slice(0, 5).map(outcome => (
                      <div
                        key={outcome.id}
                        style={{
                          display: 'flex',
                          gap: 8,
                          alignItems: 'center',
                          minWidth: 0,
                          color: BODY,
                          fontFamily: sans,
                          fontSize: FS.xs,
                          fontWeight: 800,
                        }}
                      >
                        <span style={{ color: GOLD, fontWeight: 950 }}>{human(outcome.ruleFamily || outcome.type)}</span>
                        <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{outcome.headline || human(outcome.candidateType)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ border: `1px dashed ${BORDER2}`, padding: SP.sm, color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
                No preview yet.
              </div>
            )}
          </div>

          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: SP.sm, flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={reset} disabled={busy}>Reset</Button>
            <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
            <Button
              variant="primary"
              onClick={save}
              busy={busy}
              disabled={advanceBlocked}
              title={advanceBlocked ? 'The realm is advancing. Give it a moment, then save your rules.' : undefined}
            >
              Save
            </Button>
          </footer>
        </div>
      </section>
    </div>
  );
}
