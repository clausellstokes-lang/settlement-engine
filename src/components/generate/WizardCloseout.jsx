/**
 * WizardCloseout.jsx — wizard close-out summary.
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

import { useMemo } from 'react';
import { useStore } from '../../store/index.js';
import { buildRegistry } from '../../lib/customRegistry.js';
import {
  GOLD_TXT, GOLD_BG, INK, BODY, MUTED, BORDER, CARD, CARD_HDR, sans, serif_, FS, SP, R,
} from '../theme.js';

/** Title-case a config enum value; collapse any `random*` value to "Random". */
function humanize(v) {
  if (v == null || v === '') return '–';
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

/** A config enum is "at default" when unset or a `random*` value — i.e. the
 *  user left it for the simulator to roll. Used to compute the delta-from-
 *  default that the recap leads with. */
function isDefaultEnum(v) {
  return v == null || v === '' || /^random/i.test(String(v));
}

/**
 * Build the close-out summary from the live config + toggle maps. Pure.
 *
 * Ranked around the DELTA from a default roll, not the absolute config — the
 * single highest-signal fact at generate-time is how far the user steered the
 * simulator (P3 emphasize-change). `deltas` collects every deliberate deviation
 * (non-random enums, emphasized priorities, forced/excluded counts, a chosen
 * campaign/deity); when it's empty the config is fully procedural and the recap
 * says so. The baseline enum chips are still returned (`facts`) but as a
 * secondary row — the verification detail, not the focal point.
 *
 * @param {Object} config  — the generation config (configSlice `config`).
 * @param {Object} toggles — { institutionToggles, servicesToggles, goodsToggles, campaignName, deityName }.
 * @returns {{ facts, emphasis, forced, excluded, constraintParts: string[], procedural: boolean, place: string|null }}
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

  // Place-in-Region intent (written by PlaceInRegionCard). The card writes IDs;
  // the resolved display names are threaded in via `toggles` so this stays pure.
  const hasCampaign = !!config.targetCampaignId;
  const hasDeity    = !!config.primaryDeityRef;
  let place = null;
  if (hasCampaign || hasDeity) {
    const parts = [];
    if (hasCampaign) parts.push(toggles.campaignName || 'a campaign');
    if (hasDeity) parts.push(`patron ${toggles.deityName || 'deity'}`);
    place = parts.join(' · ');
  }

  // Manual hard constraints, as a compact human phrase ("3 forced · 2 excluded").
  const constraintParts = [];
  if (forced) constraintParts.push(`${forced} forced`);
  if (excluded) constraintParts.push(`${excluded} excluded`);

  // Non-default enum picks — the user explicitly chose these rather than letting
  // the simulator roll them, so they count as deliberate steering.
  const nonDefaultEnums = [
    ['Tier',        config.settType],
    ['Culture',     config.culture],
    ['Trade route', config.tradeRouteAccess],
    ['Threat',      config.monsterThreat],
  ].filter(([, v]) => !isDefaultEnum(v));
  const magicOff = config.magicExists === false;

  const procedural =
    emphasis.length === 0 && forced === 0 && excluded === 0 &&
    nonDefaultEnums.length === 0 && !magicOff && !place;

  return {
    facts: [
      { label: 'Tier',        value: humanize(config.settType) },
      { label: 'Culture',     value: humanize(config.culture) },
      { label: 'Trade route', value: humanize(config.tradeRouteAccess) },
      { label: 'Threat',      value: humanize(config.monsterThreat) },
      { label: 'Magic',       value: magicOff ? 'Off' : 'On' },
    ],
    emphasis: emphasis.length ? emphasis : null,
    forced,
    excluded,
    constraintParts,
    place,
    procedural,
  };
}

export default function WizardCloseout() {
  const config              = useStore(s => s.config);
  const institutionToggles  = useStore(s => s.institutionToggles);
  const servicesToggles     = useStore(s => s.servicesToggles);
  const goodsToggles        = useStore(s => s.goodsToggles);
  const campaigns           = useStore(s => s.campaigns || []);
  const customContent       = useStore(s => s.customContent);

  // Resolve the Place-in-Region intent IDs → display names here (the builder
  // stays pure: it receives names, not the store). Deity names come from the
  // same custom registry PlaceInRegionCard reads.
  const campaignName = config.targetCampaignId
    ? (campaigns.find(c => c.id === config.targetCampaignId)?.name || null)
    : null;
  const deityName = useMemo(() => {
    if (!config.primaryDeityRef) return null;
    try {
      const list = buildRegistry(customContent || {}).listCustom('deities');
      return list.find(d => d.refId === config.primaryDeityRef)?.name || null;
    } catch { return null; }
  }, [config.primaryDeityRef, customContent]);

  const summary = buildCloseoutSummary(config, {
    institutionToggles, servicesToggles, goodsToggles, campaignName, deityName,
  });

  return (
    <div
      role="group"
      aria-label="Configuration summary"
      style={{
        border: `1px solid ${BORDER}`, borderRadius: R.lg,
        overflow: 'hidden', marginBottom: SP.sm,
        background: CARD,
        // Subordinate to the Generate button below; border + header tint fence
        // it without a shadow that would over-elevate a review card (P5).
      }}
    >
      <div style={{
        padding: `${SP.sm + 1}px ${SP.lg}px`, background: CARD_HDR,
        borderBottom: `1px solid ${BORDER}`,
      }}>
        {/* Keyword-first eyebrow demoted; the readiness verb is chrome, not the
            scannable content. */}
        <span style={{ fontSize: FS.xs, color: MUTED, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Ready to generate
        </span>
      </div>

      <div style={{ padding: `${SP.md}px ${SP.lg}px`, fontFamily: sans }}>
        {/* FOCAL line — the delta from a default roll (P3/P6). What the GM
            deliberately steered is the largest, boldest, top-most fact; the
            baseline enum chips below are the secondary verification row. When
            nothing deviates, the headline says so outright. */}
        {summary.procedural ? (
          <div style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK, lineHeight: 1.3 }}>
            Fully procedural
            <span style={{ display: 'block', fontFamily: sans, fontSize: FS.sm, fontWeight: 400, color: BODY, marginTop: 2 }}>
              The simulator decides everything. Steer it with the controls above.
            </span>
          </div>
        ) : (
          <div style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK, lineHeight: 1.35 }}>
            {summary.emphasis && (
              <span>{summary.emphasis.join(' · ')}-led</span>
            )}
            {summary.constraintParts.length > 0 && (
              <span>{summary.emphasis ? ', ' : ''}{summary.constraintParts.join(' · ')}</span>
            )}
            {summary.place && (
              <span style={{ display: 'block', fontFamily: sans, fontSize: FS.sm, fontWeight: 600, color: GOLD_TXT, marginTop: 2 }}>
                Placed in {summary.place}
              </span>
            )}
            {!summary.emphasis && summary.constraintParts.length === 0 && !summary.place && (
              // Deviated only via non-default enum picks (e.g. a fixed Tier);
              // those are the chips below — name the steering plainly here.
              <span style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 400, color: BODY }}>
                Generating from your chosen foundations below.
              </span>
            )}
          </div>
        )}

        {/* Secondary verification row — the baseline enums, demoted to quiet
            chips beneath the focal delta. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs, marginTop: SP.sm }}>
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
      </div>
    </div>
  );
}
