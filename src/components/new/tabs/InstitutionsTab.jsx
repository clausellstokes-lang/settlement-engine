/**
 * InstitutionsTab — the Systems group's "Institutions" sub-tab (owner addendum T1-14,
 * 2026-10-30, RULINGS-T1; docs/UX_CONSOLIDATION_2026-10-30.md).
 *
 * Every institution of the settlement, and under each the services it provides. The rows
 * are the SAME `availableServices` rows the Services tab renders, joined on the row's own
 * `institution` field (the engine's raw roster name), with the same status reading
 * (`tabHelpers.js :: computeChainSets`): name, status pill, one-line description. No
 * category cards: the Services tab already groups by service category, and this page's one
 * job is the other axis, house by house. An institution with no service row still appears,
 * with its own description line.
 *
 * The provenance badges and their legend moved here from the Overview's Institutions
 * block, which is CUT (T1-15): this tab is the roster's one home (R2), and the badges are
 * the engine's answer to "who put this here" (R7). Same audience as the Services tab: every
 * fact here is public roster and catalogue data, so no public or player gate applies.
 */
import { useMemo } from 'react';
import { FS, swatch, MUTED, GOLD_TINT, GOLD_DEEP } from '../../theme.js';
import { Empty } from '../Primitives';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import { literaryTitle, tokenCase } from '../labelLadder.js';
import { computeChainSets } from '../tabHelpers';
// The rows can shift with an economy event exactly as the Services tab's do, so the page carries
// the same freshness note (economyReadModelCoverage: COVERED; chair ruling 5, 2026-10-30).
import EconomyFreshnessNote from '../EconomyFreshnessNote.jsx';
import { institutionDisplayName } from '../../../domain/display/institutionDisplayName.js';
import { institutionProvenanceOf } from '../../../domain/provenance/rosterProvenance.js';
import { PROXY_SERVICE_HOSTS } from '../../../data/servicesData.js';

// ── The institution provenance badge (R-5b item #10), moved from OverviewTab ──────────
// The badge reads the ONE derived provenance record (domain/provenance/rosterProvenance.js),
// which joins the composer's *ByEventId stamps and the world-pulse's
// *ByWorldPulseOutcomeId stamps into a single answer to "who put this here". Nothing is
// persisted: the record is derived per render. 'forced' (the player force-added it at
// generation) wears the same YOU mark as a DM event, and the legend says so once.
const PROVENANCE_TONE = { you:'#2d7a44', world:'#2a6b6b', required:'#a0762a', auto:'#2a3a7a', none:'#6b5340' };

/** @param {object} inst */
export function institutionBadge(inst) {
  const { created } = institutionProvenanceOf(inst);
  // A DM realm order (SHIFT_TIER) reaches the roster through the world-pulse apply path,
  // but the hand on it is still the player's.
  if (created.origin === 'dm-event' || created.origin === 'dm-realm-order') {
    return { label:'YOU', color:PROVENANCE_TONE.you, title:'Added by you' };
  }
  if (created.origin === 'world-pulse') {
    return {
      label:'WORLD', color:PROVENANCE_TONE.world,
      title: created.reason ? `Grown by the living world. ${created.reason}` : 'Grown by the living world',
    };
  }
  if (created.sourceTag === 'required') return { label:'REQ', color:PROVENANCE_TONE.required, title:'Historically required' };
  if (created.sourceTag === 'forced') return { label:'YOU', color:PROVENANCE_TONE.you, title:'Added by you' };
  if (created.sourceTag === 'auto-resolved') return { label:'→', color:PROVENANCE_TONE.auto, title:'Auto-resolved dependency' };
  // Unstamped legacy rows stay unbadged rather than being guessed at. Custom rows are
  // skinned gold by the caller's own ✦ branch.
  return { label:null, color:PROVENANCE_TONE.none, title:undefined };
}

const LEGEND = [
  ['REQ', PROVENANCE_TONE.required, 'Historically required'],
  ['YOU', PROVENANCE_TONE.you, 'Added by you'],
  ['→', PROVENANCE_TONE.auto, 'Auto-resolved dependency'],
  ['WORLD', PROVENANCE_TONE.world, 'Grown by the living world'],
  ['✦', GOLD_DEEP, 'custom'],
];

/** Every service row as `{ svc }`, flattened out of the category map the generator writes. */
function serviceRows(availableServices) {
  if (Array.isArray(availableServices)) return availableServices.filter((svc) => svc && typeof svc === 'object');
  if (!availableServices || typeof availableServices !== 'object') return [];
  return Object.values(availableServices).flatMap((list) => (Array.isArray(list) ? list : []))
    .filter((svc) => svc && typeof svc === 'object');
}

/**
 * The roster with each house's own service rows, sorted by category then by the DISPLAYED
 * name (§934.13: sorting by the raw key files 'House of worship' under P).
 * @param {{institutions?: unknown, availableServices?: unknown}} settlement
 */
export function institutionsWithServices(settlement) {
  const rows = serviceRows(settlement?.availableServices);
  /** @type {Map<string, object[]>} */
  const byInstitution = new Map();
  for (const svc of rows) {
    const key = String(svc.institution || '');
    if (!key) continue;
    // VERIFIER F14 (RS-19): a PROXY host (a Sewage system, a Housing row, a Massive prison)
    // only surfaces another house's menu. The Services tab names no institution for those rows,
    // so this page lists none of them under the proxy; the house keeps its own card. The host's
    // name alone answers it, as in serviceComponents.jsx :: viaProxy.
    if (PROXY_SERVICE_HOSTS[key.toLowerCase()]) continue;
    if (!byInstitution.has(key)) byInstitution.set(key, []);
    byInstitution.get(key).push(svc);
  }
  // The roster is read straight off `settlement.institutions`, so every key below is read on
  // the institution shape itself (the observed-shape scan grounds the receiver that way).
  return (Array.isArray(settlement?.institutions) ? settlement.institutions : [])
    .filter(Boolean)
    .map((inst) => ({
      inst,
      category: String(inst.category || ''),
      label: institutionDisplayName(inst),
      services: byInstitution.get(String(inst.name || '')) || [],
    }))
    .sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label));
}

function statusOf(svc, sets) {
  const name = String(svc.name || '');
  const inst = String(svc.institution || '');
  if (sets.impaired.has(name) || sets.impaired.has(inst)) return { label: 'Impaired', color: '#8b1a1a' };
  if (sets.degraded.has(name) || sets.degraded.has(inst)) return { label: 'Reduced', color: '#8a4010' };
  if (sets.vulnerable.has(name) || sets.vulnerable.has(inst)) return { label: 'Vulnerable', color: '#7a5010' };
  return null;
}

export default function InstitutionsTab({ settlement }) {
  const mobile = useIsMobile();
  const houses = useMemo(() => institutionsWithServices(settlement), [settlement]);
  const sets = useMemo(() => computeChainSets(settlement || {}), [settlement]);
  if (!houses.length) return <Empty message="No institutions are recorded for this settlement." />;

  return (
    <div style={{ padding: '14px 18px' }}>
      <EconomyFreshnessNote settlement={settlement} variant="catalog" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {houses.map(({ inst, category, label, services }, i) => {
          const isCustom = inst.source === 'custom' || inst.isCustom === true;
          const badge = institutionBadge(inst);
          return (
            <section key={`${inst.name}-${i}`} data-testid="institution-card" style={{
              padding: '8px 11px', background: swatch['#FAF8F4'],
              ...(isCustom ? { ...GOLD_TINT, borderWidth: 1, borderStyle: 'solid' } : { border: `1px solid ${badge.color}30`, borderLeft: `3px solid ${badge.color}` }),
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span title={isCustom ? 'Your custom content' : badge.title} style={{ ...literaryTitle(FS.sm), color: swatch.inkMag }}>
                  {label}
                </span>
                {isCustom
                  ? <span style={{ fontSize: chromeFontSize(FS.nano, mobile), fontWeight: 800, color: GOLD_DEEP, letterSpacing: '0.04em' }}>✦</span>
                  : (badge.label && <span title={badge.title} style={{ fontSize: chromeFontSize(FS.nano, mobile), fontWeight: 800, color: badge.color, letterSpacing: '0.04em' }}>{badge.label}</span>)}
                {category && <span style={{ fontSize: chromeFontSize(FS.xxs, mobile), color: MUTED }}>{tokenCase(category)}</span>}
              </div>
              {services.length === 0 && inst.desc && (
                <p style={{ fontSize: proseFontSize(FS.xs, mobile), color: swatch.inkMag3, lineHeight: 1.4, margin: '2px 0 0' }}>{inst.desc}</p>
              )}
              {services.map((svc, j) => {
                const status = statusOf(svc, sets);
                return (
                  <div key={`${svc.name}-${j}`} data-testid="institution-service" style={{ padding: '4px 0 0 10px', borderLeft: `2px solid ${status?.color || '#d8c8a0'}`, marginTop: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: FS['12.5'], fontWeight: 600, color: swatch.inkMag }}>{institutionDisplayName(svc.name)}</span>
                      {status && <span style={{ fontSize: chromeFontSize(FS.micro, mobile), fontWeight: 800, color: status.color, background: `${status.color}18`, padding: '0 5px', letterSpacing: '0.04em' }}>{status.label}</span>}
                    </div>
                    {svc.desc && <p style={{ fontSize: proseFontSize(FS.xs, mobile), color: swatch.inkMag3, lineHeight: 1.3, margin: '1px 0 0' }}>{svc.desc}</p>}
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 12, paddingTop: 8, borderTop: '1px solid #f0e8d8', fontSize: proseFontSize(FS.xxs, mobile), color: MUTED, flexWrap: 'wrap' }}>
        {LEGEND.map(([lbl, c, desc]) => (
          <span key={lbl}><span style={{ color: c, fontWeight: 800 }}>{lbl}</span> = {desc}</span>
        ))}
      </div>
    </div>
  );
}
