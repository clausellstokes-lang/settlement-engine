/**
 * InstitutionsTab — the Systems group's "Institutions" sub-tab (owner addendum T1-14,
 * 2026-10-30, RULINGS-T1; docs/UX_CONSOLIDATION_2026-10-30.md), INVERTED by the owner's word
 * of 2026-11-01 (X-35): "give the general description for each institution ... and then list
 * off underneath that in like a subtitle each of the services that it renders, each of those
 * services ties to a hyperlink that is appropriate to the services tab. This is the inverse of
 * how the services tab does things."
 *
 * So every institution of the settlement leads with WHAT IT IS — the catalogue's own
 * description of the house (`inst.desc`, the tier's variant the engine chose), else the
 * authored identity one-liner (institutionVocabulary.js) — and beneath it, as a subtitle, the
 * services it renders as DOORS: each name an EntityLink to the Services tab, where the row
 * itself (its description, its chain chip, its reasons) lives. The join is the same as before —
 * the `availableServices` rows the Services tab renders, on the row's own `institution` field
 * (the engine's raw roster name). THE HOUSE WEARS ONE STATUS TAG beside its name (the owner,
 * 2026-11-01, X-41): the worst state across what it renders, impaired over reduced over
 * vulnerable (`tabHelpers.js :: computeChainSets`), and the doors carry none. Under the
 * description, THE BACKS LINE (X-40): the powers the house stands behind, each a door to the
 * Power tab, read off the same web the Power tab prints the other way round
 * (`powerSupport.js :: institutionBackers`). No category cards: the Services tab already groups
 * by service category, and this page's one job is the other axis, house by house. An
 * institution with no service row still appears, with its description and no subtitle.
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
import { identityForInstitution } from '../../../domain/display/institutionVocabulary.js';
import { institutionProvenanceOf } from '../../../domain/provenance/rosterProvenance.js';
import { PROXY_SERVICE_HOSTS } from '../../../data/servicesData.js';
import { entityAnchor, entityIdFor, serviceEntityOf } from '../../../domain/dossier/entityLinks.js';
import { institutionBackers } from '../../../domain/dossier/powerSupport.js';
import { factionIdFromName } from '../../../lib/entities.js';
import { useEntityFocus } from '../../dossier/useEntityFocus.js';
import { MentionText } from '../../ProseParagraph.jsx';
import EntityLink from '../../primitives/EntityLink.jsx';
import InfoPill from '../../primitives/InfoPill.jsx';
import { SECTION_HELP } from '../../../copy/sectionHelp.js';

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

// THE LEGEND ROW IS GONE (X-38/X-42, the owner, 2026-11-02): its key — history, you, the
// living world, a dependency — is the second sentence of the page's ? pill
// (copy/sectionHelp.js :: institutions); each badge keeps its own title.

/** Every service row as `{ svc }`, flattened out of the category map the generator writes. */
function serviceRows(availableServices) {
  if (Array.isArray(availableServices)) return availableServices.filter((svc) => svc && typeof svc === 'object');
  if (!availableServices || typeof availableServices !== 'object') return [];
  return Object.values(availableServices).flatMap((list) => (Array.isArray(list) ? list : []))
    .filter((svc) => svc && typeof svc === 'object');
}

/**
 * The roster with each house's own service rows and the powers it backs (X-40), sorted by
 * category then by the DISPLAYED name (§934.13: sorting by the raw key files 'House of
 * worship' under P). The ONE raw-name read of the join serves both lists, so the label seam's
 * census count for this file does not move.
 * @param {{institutions?: unknown, availableServices?: unknown, powerStructure?: unknown}} settlement
 */
export function institutionsWithServices(settlement) {
  const rows = serviceRows(settlement?.availableServices);
  const backers = institutionBackers(/** @type {any} */ (settlement) || {});
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
    .map((inst) => {
      const key = String(inst.name || '');
      return {
        inst,
        category: String(inst.category || ''),
        label: institutionDisplayName(inst),
        services: byInstitution.get(key) || [],
        backs: backers.get(key) || [],
      };
    })
    .sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label));
}

function statusOf(svc, sets) {
  const name = String(svc.name || '');
  const inst = String(svc.institution || '');
  if (sets.impaired.has(name) || sets.impaired.has(inst)) return { label: 'Impaired', color: '#8b1a1a', rank: 3 };
  if (sets.degraded.has(name) || sets.degraded.has(inst)) return { label: 'Reduced', color: swatch['#8A4010'], rank: 2 };
  if (sets.vulnerable.has(name) || sets.vulnerable.has(inst)) return { label: 'Vulnerable', color: swatch['#7A5010'], rank: 1 };
  return null;
}

/**
 * The ONE tag a house wears (X-41): the worst state across the services it renders, impaired
 * over reduced over vulnerable; null when every service stands.
 * @param {Array<{ name?: unknown, institution?: unknown }>} services
 * @param {{ impaired: Set<string>, degraded: Set<string>, vulnerable: Set<string> }} sets
 */
export function houseStatus(services, sets) {
  let worst = null;
  for (const svc of services) {
    const status = statusOf(svc, sets);
    if (status && (!worst || status.rank > worst.rank)) worst = status;
  }
  return worst;
}

/**
 * The house's general description (X-35): the catalogue's own line for this instance when the
 * engine wrote one, else the authored identity one-liner, else nothing (a custom house with no
 * description honestly prints no line).
 * @param {{ desc?: unknown, name?: string }} inst
 * @returns {string|null}
 */
export function institutionDescription(inst) {
  const own = typeof inst?.desc === 'string' ? inst.desc.trim() : '';
  return own || identityForInstitution(inst) || null;
}

/**
 * One institution: what it is, then the doors to the services it renders (X-35). Mounted by the
 * tab and, through its own card, by the dossier search (BUILD-W2-SEARCH U2). `sets` is the
 * tab's chain-status reading (`computeChainSets`).
 */
export function InstitutionCard({ inst, category, label, services, sets, backs = [] }) {
  const mobile = useIsMobile();
  const isCustom = inst.source === 'custom' || inst.isCustom === true;
  const badge = institutionBadge(inst);
  // X-20 (c): the card is always open; a link to the house scrolls it to the top.
  const { ref: focusRef } = useEntityFocus(entityIdFor('institution', inst));
  const selfId = entityIdFor('institution', inst);
  const description = institutionDescription(inst);
  const status = houseStatus(services, sets);
  return (
    <section ref={focusRef} id={entityAnchor('institution', inst)} data-testid="institution-card" style={{
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
        {/* THE HOUSE'S ONE TAG (X-41): the worst state across what it renders. */}
        {status && <span data-testid="institution-status" style={{ fontSize: chromeFontSize(FS.micro, mobile), fontWeight: 800, color: status.color, background: `${status.color}18`, padding: '0 5px', letterSpacing: '0.04em' }}>{status.label}</span>}
      </div>
      {/* WHAT IT IS, FIRST (X-35): the house's general description leads every card. */}
      {description && (
        <p data-testid="institution-desc" style={{ fontSize: proseFontSize(FS.xs, mobile), color: swatch.inkMag3, lineHeight: 1.4, margin: '2px 0 0' }}><MentionText text={description} selfId={selfId} /></p>
      )}
      {/* THE BACKS LINE (X-40): who the house contributes to, each name a door to the Power
          tab. A wrapping row like the doors below (the name-list census reads it as no list). */}
      {backs.length > 0 && (
        <div data-testid="institution-backs" style={{ display: 'flex', alignItems: 'baseline', gap: '2px 8px', flexWrap: 'wrap', marginTop: 4, fontSize: proseFontSize(FS.xs, mobile), color: swatch.inkMag3 }}>
          <span>Backs</span>
          {backs.map((faction) => (
            <EntityLink key={faction} id={factionIdFromName(faction) || faction} type="faction" fallback={faction} style={{ color: swatch.inkMag, fontWeight: 600 }} />
          ))}
        </div>
      )}
      {/* THE SUBTITLE OF DOORS (X-35): each service the house renders, as a link that opens the
          Services tab with that row at the top (ServiceItem is the sink, X-20 (c)). The row's
          own description stays on the Services tab — the inverse of that tab, not a copy of it.
          The doors carry no status pill (X-41): the house wears the one tag above. A WRAPPING
          row, so a long name moves whole to the next line (the name-list census reads a
          wrapping chip row as no list). */}
      {services.length > 0 && (
        <div data-testid="institution-services" style={{ display: 'flex', alignItems: 'baseline', gap: '2px 10px', flexWrap: 'wrap', marginTop: 6 }}>
          <span style={{ fontSize: chromeFontSize(FS.nano, mobile), fontWeight: 800, letterSpacing: '0.06em', color: MUTED }}>Services</span>
          {services.map((svc, j) => {
            const entity = serviceEntityOf(svc);
            return (
              <span key={`${entity.id}-${j}`} data-testid="institution-service" style={{ fontSize: FS['12.5'] }}>
                <EntityLink id={entityIdFor('service', entity)} type="service" fallback={institutionDisplayName(svc.name)} style={{ color: swatch.inkMag, fontWeight: 600 }} />
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function InstitutionsTab({ settlement }) {
  const houses = useMemo(() => institutionsWithServices(settlement), [settlement]);
  const sets = useMemo(() => computeChainSets(settlement || {}), [settlement]);
  if (!houses.length) return <Empty message="No institutions are recorded for this settlement." />;

  return (
    <div style={{ padding: '14px 18px' }}>
      {/* THE PAGE'S ONE MARK (X-42): the ? pill, right-aligned above the houses; the page has no
          title of its own (the tab names it), and no sentence about itself (X-38). */}
      <div data-testid="institutions-header" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
        <InfoPill text={SECTION_HELP.institutions} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {houses.map(({ inst, category, label, services, backs }, i) => (
          <InstitutionCard key={`${inst.name}-${i}`} inst={inst} category={category} label={label} services={services} backs={backs} sets={sets} />
        ))}
      </div>
      {/* The campaign-only stale-window note closes the page (the block law, X-16 rung 6). */}
      <EconomyFreshnessNote settlement={settlement} variant="catalog" />
    </div>
  );
}
