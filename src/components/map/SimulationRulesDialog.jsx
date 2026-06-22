import { cloneElement, isValidElement, useId, useState } from 'react';
import { Eye, Settings2, X } from 'lucide-react';

import { useStore } from '../../store/index.js';
import {
  DEFAULT_SIMULATION_RULES,
  SIMULATION_RULE_PRESETS,
  normalizeSimulationRules,
} from '../../domain/worldPulse/index.js';
import {
  BODY, BORDER, BORDER2, CARD, CARD_ALT, ELEV, FS, GOLD, GOLD_BG, INK, MUTED, R, RED, SP, sans,
} from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import PageHeader from '../primitives/PageHeader.jsx';
import useDialogFocusTrap from '../primitives/useDialogFocusTrap.js';

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

// ── UX Phase 4 — the THREE living-world system gates ─────────────────────────
// These default to FALSE (see DEFAULT_SIMULATION_RULES) and, until this dialog
// shipped, had NO UI toggle ANYWHERE, leaving the premium war/strategy/religion
// engine unreachable. Each carries a one-line "what it does" plus the byte-
// identical-when-off promise. They render in a separate "advanced" group below the
// 12 core toggles, and (unlike the core toggles, which are on-unless-explicitly-
// false) are shown as OFF unless explicitly true, matching their false default.
//
// Tier note: the dialog only renders for canManageCampaigns (paying) users, so the
// tier gate lives UPSTREAM (RealmDashboard handles the free/anon locked state and
// any pricing-moment prompts). These are in-app subsystem opt-ins, never a tier
// wall, so there is no flat denial to soften here.
const ADVANCED_GATES = [
  ['warLayerEnabled', 'War layer',
    'Armies march, sieges form, conquests change rulers. Off = no war fronts (byte-identical to today).'],
  ['settlementStrategyEnabled', 'Settlement strategy',
    'Settlements choose to defend, deploy, or sue for peace. Off = no strategy candidates.'],
  ['religionDynamicsEnabled', 'Religion dynamics',
    'Deities contest converts and gain seats, but only once a settlement carries a primary deity. Off or deity-free equals no faith drift.'],
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
      background: checked ? GOLD_BG : CARD,
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

// A gate row with a one-line "what it does" description. Distinct from Toggle:
// (1) it shows OFF unless explicitly `true` (these gates default false), and
// (2) it carries the explanatory copy the plan requires for each living-world gate.
function GateToggle({ checked, label, description, onChange }) {
  const controlId = useId();
  return (
    <label htmlFor={controlId} style={{
      display: 'grid',
      gap: 4,
      padding: '10px 12px',
      border: `1px solid ${checked ? GOLD : BORDER2}`,
      borderRadius: R.md,
      background: checked ? GOLD_BG : CARD,
      cursor: 'pointer',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          id={controlId}
          type="checkbox"
          aria-label={label}
          checked={checked}
          onChange={event => onChange(event.target.checked)}
        />
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>{label}</span>
        {/* Second channel beyond border/fill hue (P7): an explicit On/Off word so
            the enabled state never reads on color alone. */}
        <span style={{
          marginLeft: 'auto',
          color: checked ? GOLD : MUTED,
          fontFamily: sans,
          fontSize: FS.xxs,
          fontWeight: 950,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {checked ? 'On' : 'Off'}
        </span>
      </span>
      <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, lineHeight: 1.4 }}>
        {description}
      </span>
    </label>
  );
}

// A disclosure group header — a real button with aria-expanded controlling a
// region, so the Detail / Engine altitudes collapse without trapping focus. The
// caret + the open/closed word carry the state in two channels (P7), never on a
// rotation alone. `summary` is quiet scent describing what is inside while closed.
function DisclosureHeader({ open, onToggle, regionId, title, summary }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={regionId}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: SP.sm,
        width: '100%',
        padding: `${SP.sm}px ${SP.md}px`,
        border: `1px solid ${BORDER2}`,
        borderRadius: R.md,
        background: CARD,
        color: INK,
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span aria-hidden style={{ color: GOLD, fontFamily: sans, fontSize: FS.xs, fontWeight: 950 }}>
        {open ? '▾' : '▸'}
      </span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span style={{ display: 'block', color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 950 }}>
          {title}
        </span>
        {summary && (
          <span style={{ display: 'block', marginTop: 2, color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750, lineHeight: 1.4 }}>
            {summary}
          </span>
        )}
      </span>
      <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {open ? 'Hide' : 'Show'}
      </span>
    </button>
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
  // Progressive disclosure: the presets (Overview) stay open; the fine-grained
  // toggles (Detail) and the advanced living-world gates (Engine) collapse into
  // disclosure groups so the dialog reads as three altitudes, not one flat scroll.
  // Default the deeper groups closed; all field wiring is untouched when expanded.
  const [detailOpen, setDetailOpen] = useState(false);
  const [engineOpen, setEngineOpen] = useState(false);

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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
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
                      background: selected ? GOLD_BG : CARD,
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

          {/* ── DETAIL altitude: the propagation/intensity/migration selects and
              the 12 fine-grained subsystem toggles, behind a disclosure so the
              dialog opens on presets, not a wall of switches. ───────────────── */}
          <div style={{ display: 'grid', gap: SP.sm }}>
            <DisclosureHeader
              open={detailOpen}
              onToggle={() => setDetailOpen(o => !o)}
              regionId={`${titleId}-detail`}
              title="Detail toggles"
              summary="Propagation, intensity, migration, and the twelve subsystem switches."
            />
            {detailOpen && (
              <div id={`${titleId}-detail`} style={{ display: 'grid', gap: SP.lg }}>
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
              </div>
            )}
          </div>

          {/* ── ENGINE altitude — UX Phase 4 living-world systems ─────────────
              The three premium gates (war / strategy / religion) that had no
              UI toggle anywhere until now. Each defaults OFF and is byte-
              identical when off. This is the fix that makes the premium engine
              reachable. Now behind its own disclosure as the deepest altitude. */}
          <div style={{ display: 'grid', gap: SP.sm }}>
            <DisclosureHeader
              open={engineOpen}
              onToggle={() => setEngineOpen(o => !o)}
              regionId={`${titleId}-engine`}
              title="Engine gates (advanced)"
              summary="Opt-in living-world subsystems, off by default and byte-identical to today while off."
            />
            {engineOpen && (
              <div id={`${titleId}-engine`} style={{
                display: 'grid',
                gap: SP.sm,
                padding: SP.md,
                border: `1px solid ${GOLD}`,
                borderRadius: R.md,
                background: GOLD_BG,
              }}>
                <div style={{ display: 'grid', gap: 2 }}>
                  <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 950 }}>
                    Living-world systems (advanced)
                  </div>
                  <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750, lineHeight: 1.4 }}>
                    Opt-in subsystems, off by default. Each is byte-identical to today while off. Turn one on and the realm starts moving.
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                  gap: SP.sm,
                }}>
                  {ADVANCED_GATES.map(([key, label, description]) => (
                    <GateToggle
                      key={key}
                      label={label}
                      description={description}
                      checked={draft[key] === true}
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
