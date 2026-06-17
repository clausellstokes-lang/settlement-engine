import { cloneElement, isValidElement, useId, useState } from 'react';
import { Eye, Settings2, X } from 'lucide-react';

import { useStore } from '../../store/index.js';
import {
  DEFAULT_SIMULATION_RULES,
  SIMULATION_RULE_PRESETS,
  normalizeSimulationRules,
} from '../../domain/worldPulse/index.js';
import {
  BODY, BORDER, BORDER2, CARD, CARD_ALT, ELEV, FS, GOLD, INK, MUTED, R, RED, SP, sans,
} from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';

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

const TOGGLES = [
  ['emergentEventsEnabled', 'Emergents'],
  ['stressorsEnabled', 'Stressors'],
  ['relationshipDynamicsEnabled', 'Relationships'],
  ['npcAgencyEnabled', 'NPC agency'],
  ['factionCompetitionEnabled', 'Factions'],
  ['populationDynamicsEnabled', 'Population'],
  ['migrationFlowsEnabled', 'Migration flows'],
  ['tradeFlowsEnabled', 'Trade flows'],
  ['resourceDriftEnabled', 'Resources'],
  ['tierDriftEnabled', 'Promotion/demotion'],
  ['institutionLifecycleEnabled', 'Institution lifecycle'],
  ['majorChangesRequireProposal', 'Major proposals'],
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

function Select({ id, value, options, onChange }) {
  return (
    <select
      id={id}
      value={value}
      onChange={event => onChange(event.target.value)}
      style={{
        width: '100%',
        minHeight: 36,
        padding: `${SP.xs}px ${SP.sm}px`,
        border: `1px solid ${BORDER}`,
        borderRadius: R.md,
        background: CARD,
        color: INK,
        fontFamily: sans,
        fontSize: FS.sm,
        fontWeight: 800,
      }}
    >
      {options.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
    </select>
  );
}

function Toggle({ checked, label, onChange }) {
  const controlId = useId();
  return (
    <label htmlFor={controlId} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minHeight: 32,
      padding: '6px 8px',
      border: `1px solid ${BORDER2}`,
      borderRadius: R.md,
      background: checked ? 'rgba(201,162,76,0.12)' : CARD,
      color: INK,
      fontFamily: sans,
      fontSize: FS.xs,
      fontWeight: 850,
      cursor: 'pointer',
    }}>
      <input
        id={controlId}
        type="checkbox"
        aria-label={label}
        checked={checked}
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
      borderRadius: R.md,
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
  const [draft, setDraft] = useState(() => normalizeSimulationRules(campaign?.worldState?.simulationRules));
  const [busy, setBusy] = useState(false);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [previewResult, setPreviewResult] = useState(null);
  const [error, setError] = useState(null);

  const presets = Object.values(SIMULATION_RULE_PRESETS);
  const activePreset = SIMULATION_RULE_PRESETS[draft.presetId] || null;
  const previewOutcomes = previewResult?.pulseRecord?.selectedOutcomes || previewResult?.selected || [];

  const setField = (key, value) => {
    setDraft(current => normalizeSimulationRules({ ...current, [key]: value }));
    setPreviewResult(null);
  };

  const applyPreset = (presetId) => {
    const preset = SIMULATION_RULE_PRESETS[presetId];
    if (!preset) return;
    setDraft(normalizeSimulationRules(preset.rules));
    setPreviewResult(null);
  };

  const runPreview = async () => {
    if (!campaign?.id || previewBusy) return;
    setPreviewBusy(true);
    setError(null);
    try {
      const result = await Promise.resolve(previewWorldPulse(campaign.id, 'one_month', { simulationRules: draft }));
      setPreviewResult(result);
      if (!result) setError('Preview could not be generated.');
    } catch (err) {
      setError(`Preview failed: ${err?.message || err}`);
    } finally {
      setPreviewBusy(false);
    }
  };

  const save = async () => {
    if (!campaign?.id || busy) return;
    setBusy(true);
    setError(null);
    try {
      await updateRules(campaign.id, draft);
      onClose?.();
    } catch (err) {
      setError(`Rules could not be saved: ${err?.message || err}`);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setDraft(normalizeSimulationRules(DEFAULT_SIMULATION_RULES));
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
        role="dialog"
        aria-modal="true"
        aria-label="Simulation rules"
        style={{
          width: 'min(100%, 640px)',
          maxHeight: 'min(92vh, 760px)',
          overflow: 'auto',
          border: `1px solid ${BORDER}`,
          borderRadius: R.lg,
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
            borderRadius: R.lg,
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
            <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.lg, lineHeight: 1.2, fontWeight: 900 }}>
              Simulation Rules
            </h2>
            <div style={{ marginTop: 4, color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 750 }}>
              {[campaign?.name || 'Campaign', activePreset?.label || 'Custom'].join(' - ')}
            </div>
          </div>
          <IconButton
            Icon={X}
            label="Close simulation rules"
            onClick={onClose}
            tone="ghost"
            size="lg"
          />
        </header>

        <div style={{ padding: SP.lg, display: 'grid', gap: SP.lg }}>
          {error && (
            <div style={{
              border: '1px solid rgba(197,74,74,0.45)',
              borderRadius: R.md,
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
              Preset
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
              gap: SP.sm,
            }}>
              {presets.map(preset => {
                const selected = draft.presetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    style={{
                      display: 'grid',
                      gap: 5,
                      minHeight: 74,
                      padding: SP.sm,
                      textAlign: 'left',
                      border: `1px solid ${selected ? GOLD : BORDER2}`,
                      borderRadius: R.md,
                      background: selected ? 'rgba(201,162,76,0.12)' : CARD,
                      color: INK,
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 950 }}>
                      {preset.label}
                    </span>
                    <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750, lineHeight: 1.35 }}>
                      {preset.summary}
                    </span>
                  </button>
                );
              })}
            </div>
            {!activePreset && (
              <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
                Custom
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))',
            gap: SP.md,
          }}>
            <Field label="Propagation">
              <Select value={draft.propagationMode} options={PROPAGATION_OPTIONS} onChange={value => setField('propagationMode', value)} />
            </Field>
            <Field label="Intensity">
              <Select value={draft.intensity} options={INTENSITY_OPTIONS} onChange={value => setField('intensity', value)} />
            </Field>
            <Field label="Migration">
              <Select value={draft.migrationMode} options={MIGRATION_OPTIONS} onChange={value => setField('migrationMode', value)} />
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
                onChange={value => setField(key, value)}
              />
            ))}
          </div>

          <div style={{
            display: 'grid',
            gap: SP.sm,
            padding: SP.md,
            border: `1px solid ${BORDER}`,
            borderRadius: R.md,
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
                disabled={!campaign?.id}
              >
                Preview
              </Button>
            </div>
            {previewResult ? (
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
              <div style={{ border: `1px dashed ${BORDER2}`, borderRadius: R.md, padding: SP.sm, color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
                No preview yet.
              </div>
            )}
          </div>

          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: SP.sm, flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={reset} disabled={busy}>Reset</Button>
            <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
            <Button variant="primary" onClick={save} busy={busy}>Save</Button>
          </footer>
        </div>
      </section>
    </div>
  );
}
