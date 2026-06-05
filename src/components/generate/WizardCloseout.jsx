/**
 * WizardCloseout.jsx — P145 / W-2 wizard close-out summary.
 *
 * The advanced wizard's final ("Ready to Generate") state used to be a
 * bare button: the user walked through four steps of configuration and
 * got no recap of what they'd set before committing to a generation.
 * This card closes out the flow with a human-readable summary —
 * tier / culture / trade route / threat / magic, any priority emphasis,
 * and a count of manual force/exclude constraints — so the Generate
 * click reads as a confirmation, not a leap into the unknown.
 *
 * Reads config + toggles from the store. The pure summary builder
 * is exported so it can be unit-tested without a DOM.
 */

import { useStore } from '../../store/index.js';
import {
  GOLD, GOLD_BG, INK, BODY, MUTED, BORDER, CARD, CARD_HDR, sans, serif_, FS, SP, R,
} from '../theme.js';

/** Title-case a config enum value; collapse any `random*` value to "Random". */
function humanize(v) {
  if (v == null || v === '') return '—';
  const s = String(v);
  if (/^random/i.test(s)) return 'Random';
  return s
    .split('_')
    .map(w => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

// [configKey, label] for the five priority sliders (0–100, 50 = baseline).
const PRIORITY_FIELDS = [
  ['priorityEconomy',  'Economy'],
  ['priorityMilitary', 'Military'],
  ['priorityMagic',    'Magic'],
  ['priorityReligion', 'Religion'],
  ['priorityCriminal', 'Criminal'],
];

// A slider is "emphasized" once it sits meaningfully above the baseline.
const EMPHASIS_THRESHOLD = 65;

/** Count {forced, excluded} across a toggle map. `forceKey` is the
 *  per-entry flag that marks a forced item (`require` for institutions,
 *  `force` for services/goods); exclusion is always `forceExclude`. */
function countConstraints(map, forceKey) {
  let forced = 0;
  let excluded = 0;
  for (const v of Object.values(map || {})) {
    if (!v || typeof v !== 'object') continue;
    if (v[forceKey]) forced++;
    if (v.forceExclude) excluded++;
  }
  return { forced, excluded };
}

/**
 * Build the close-out summary from the live config + toggle maps. Pure.
 *
 * @param {Object} config  — the generation config (configSlice `config`).
 * @param {Object} toggles — { institutionToggles, servicesToggles, goodsToggles }.
 * @returns {{ facts: Array<{label,value}>, emphasis: string[]|null, forced: number, excluded: number }}
 */
export function buildCloseoutSummary(config = {}, toggles = {}) {
  const inst  = countConstraints(toggles.institutionToggles, 'require');
  const svc   = countConstraints(toggles.servicesToggles,    'force');
  const goods = countConstraints(toggles.goodsToggles,       'force');

  const forced   = inst.forced   + svc.forced   + goods.forced;
  const excluded = inst.excluded + svc.excluded + goods.excluded;

  const emphasis = PRIORITY_FIELDS
    .map(([k, label]) => ({ label, value: config[k] ?? 50 }))
    .filter(p => p.value >= EMPHASIS_THRESHOLD)
    .sort((a, b) => b.value - a.value)
    .map(p => p.label);

  return {
    facts: [
      { label: 'Tier',        value: humanize(config.settType) },
      { label: 'Culture',     value: humanize(config.culture) },
      { label: 'Trade route', value: humanize(config.tradeRouteAccess) },
      { label: 'Threat',      value: humanize(config.monsterThreat) },
      { label: 'Magic',       value: config.magicExists === false ? 'Off' : 'On' },
    ],
    emphasis: emphasis.length ? emphasis : null,
    forced,
    excluded,
  };
}

export default function WizardCloseout() {
  const config              = useStore(s => s.config);
  const institutionToggles  = useStore(s => s.institutionToggles);
  const servicesToggles     = useStore(s => s.servicesToggles);
  const goodsToggles        = useStore(s => s.goodsToggles);

  const summary = buildCloseoutSummary(config, {
    institutionToggles, servicesToggles, goodsToggles,
  });

  const constraintLine = summary.forced === 0 && summary.excluded === 0
    ? 'No manual constraints — fully procedural.'
    : `${summary.forced} forced · ${summary.excluded} excluded`;

  return (
    <div
      role="group"
      aria-label="Configuration summary"
      style={{
        border: `1px solid ${BORDER}`, borderRadius: R.lg,
        overflow: 'hidden', marginBottom: SP.sm,
        background: CARD,
        boxShadow: '0 2px 10px rgba(27,20,8,0.08)',
      }}
    >
      <div style={{
        padding: `${SP.sm + 1}px ${SP.lg}px`, background: CARD_HDR,
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <span style={{
          fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK,
        }}>
          Ready to generate
        </span>
        <span style={{ fontSize: FS.xs, color: MUTED, marginLeft: SP.sm }}>
          Review your configuration, then generate.
        </span>
      </div>

      <div style={{ padding: `${SP.md}px ${SP.lg}px`, fontFamily: sans }}>
        {/* Fact chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
          {summary.facts.map(f => (
            <span key={f.label} style={{
              display: 'inline-flex', alignItems: 'baseline', gap: 5,
              padding: '3px 10px', background: GOLD_BG,
              border: `1px solid ${BORDER}`, borderRadius: 12,
              fontSize: FS.xs,
            }}>
              <span style={{ color: MUTED, fontWeight: 600 }}>{f.label}</span>
              <span style={{ color: INK, fontWeight: 700 }}>{f.value}</span>
            </span>
          ))}
        </div>

        {/* Priority emphasis */}
        <div style={{ marginTop: SP.sm, fontSize: FS.sm, color: BODY }}>
          <span style={{ color: MUTED, fontWeight: 600 }}>Priorities: </span>
          {summary.emphasis
            ? <span style={{ color: INK, fontWeight: 600 }}>{summary.emphasis.join(' · ')}</span>
            : <span>Balanced</span>}
        </div>

        {/* Manual constraints */}
        <div style={{ marginTop: 2, fontSize: FS.sm, color: BODY }}>
          <span style={{ color: MUTED, fontWeight: 600 }}>Constraints: </span>
          <span style={{ color: summary.forced || summary.excluded ? GOLD : BODY, fontWeight: 600 }}>
            {constraintLine}
          </span>
        </div>
      </div>
    </div>
  );
}
