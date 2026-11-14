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
 * description, THE BACKS LINE (X-40, X-45): the powers the house stands behind — every house at
 * least one, where the settlement has a ruler, and more than one where more than one reason
 * holds — each a door to the Power tab, read off the one per-house truth the Power tab's web is
 * built from (`powerSupport.js :: houseBacksOf`). THE DM EDITS IT (X-45): a viewer who may
 * author, in edit mode, toggles the roster's powers on the line; the authored list wears the ✎
 * mark and replaces every derived reason, and "As the engine has it" lets it go. The edit rides
 * the house's own edit record (`applyUserEditAction('institution', index, 'backs', …)`), so it
 * is saved with the settlement and reverted like any other. No category cards: the Services tab already groups
 * by service category, and this page's one job is the other axis, house by house. An
 * institution with no service row still appears, with its description and no subtitle.
 *
 * THE FABRIC OF THE PLACE (X-46 car 3; the chair's ruling, 2026-11-04): the rows that are the
 * place rather than a house with a power behind it (the dwellings, the well, the walk to another
 * village's church: `institutionalCatalog.js :: isFabricInstitution`) are not houses. They stay
 * on this page, in their own group at the foot of the list under "The fabric of the place",
 * without a Backs line; the houses' stack above holds houses only.
 *
 * The provenance badges and their legend moved here from the Overview's Institutions
 * block, which is CUT (T1-15): this tab is the roster's one home (R2), and the badges are
 * the engine's answer to "who put this here" (R7). Same audience as the Services tab: every
 * fact here is public roster and catalogue data, so no public or player gate applies.
 */
import { useMemo, useState } from 'react';
import { FS, swatch, MUTED, GOLD_TINT, GOLD_DEEP } from '../../theme.js';
import { useStore } from '../../../store/index.js';
import Button from '../../primitives/Button.jsx';
import { Empty } from '../Primitives';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import { literaryTitle, tokenCase } from '../labelLadder.js';
import { computeChainSets } from '../tabHelpers';
// The rows can shift with an economy event exactly as the Services tab's do, so the page carries
// the same freshness note (economyReadModelCoverage: COVERED; chair ruling 5, 2026-10-30).
import EconomyFreshnessNote from '../EconomyFreshnessNote.jsx';
import { institutionHouseLabel } from '../../../domain/display/institutionDisplayName.js';
import { identityForInstitution } from '../../../domain/display/institutionVocabulary.js';
import { institutionProvenanceOf } from '../../../domain/provenance/rosterProvenance.js';
import { isFabricInstitution } from '../../../data/institutionalCatalog.js';
import { entityAnchor, entityIdFor, serviceEntityOf } from '../../../domain/dossier/entityLinks.js';
import { formatBacksValue, houseBacksOf } from '../../../domain/dossier/powerSupport.js';
import { walkUserEdits } from '../../../domain/userEdits.js';
import { factionIdFromName } from '../../../lib/entities.js';
import { cardOfficeOf, facesByHouse } from '../../../domain/people/cardPowers.js';
import { seatHouseFaceOf } from '../../../domain/dossier/seatHolder.js';
import { connectionOf } from '../../../domain/people/seatKeeperDisplay.js';
import { nameOf } from '../../../domain/rulingPower.js';
import { useEntityFocus } from '../../dossier/useEntityFocus.js';
import { MentionText } from '../../ProseParagraph.jsx';
import EntityLink from '../../primitives/EntityLink.jsx';
import InfoPill from '../../primitives/InfoPill.jsx';
import { SECTION_HELP } from '../../../copy/sectionHelp.js';
import { FLUSH, FLUSH_PAGE, FLUSH_STACK } from '../../../design/flush.js';

// ── The institution provenance badge (R-5b item #10), moved from OverviewTab ──────────
// The badge reads the ONE derived provenance record (domain/provenance/rosterProvenance.js),
// which joins the composer's *ByEventId stamps and the world-pulse's
// *ByWorldPulseOutcomeId stamps into a single answer to "who put this here". Nothing is
// persisted: the record is derived per render. 'forced' (the player force-added it at
// generation) wears the same YOU mark as a DM event, and the legend says so once.
const PROVENANCE_TONE = { you:'#2d7a44', world:'#2a6b6b', auto:'#2a3a7a', none:'#6b5340' };

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
  // ROUND THREE, ruling (b) (the chair, 2026-11-13; ROUND-3-CUT §7 (b)): "REQ" was the generator's
  // provenance (a row the tier's catalogue requires), run onto the house's name: machinery, not a fact
  // of the place. It leaves the roster; the row is unbadged, like an unstamped generated row.
  if (created.sourceTag === 'required') return { label:null, color:PROVENANCE_TONE.none, title:undefined };
  // R2-CODE-B item 2 (the cold list REVIEW-W2A-3 #893 #894: "Hedge wizard YOU" with no house added by
  // the user): `source: 'forced'` is written by every generator that forces a row — the user's toggle
  // AND the isolation pass (isolationGenerator.js, `forcedByIsolation`). The record's own word for the
  // user's hand is `forcedByToggle` (assembleInstitutions.js, every toggle path); only that wears YOU.
  // A row the generator forced makes no claim of who added it, like an unstamped generated row.
  if (created.sourceTag === 'forced') {
    return inst?.forcedByToggle === true
      ? { label:'YOU', color:PROVENANCE_TONE.you, title:'Added by you' }
      : { label:null, color:PROVENANCE_TONE.none, title:undefined };
  }
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
  const backers = houseBacksOf(/** @type {any} */ (settlement) || {});
  // PEOPLE-6 LINKS: each house's face, the card whose `institution.key` is the row's name.
  const faces = facesByHouse(/** @type {any} */ (settlement)?.npcs);
  // X-45: the houses the DM spoke for, through the settlement-level walk of the edit records
  const spoken = new Set();
  for (const edit of walkUserEdits(settlement)) if (edit.kind === 'institution' && edit.path === 'backs') spoken.add(edit.entityIndex);
  /** @type {Map<string, object[]>} */
  const byInstitution = new Map();
  for (const svc of rows) {
    const key = String(svc.institution || '');
    if (!key) continue;
    // RS-19 is now kept in the RECORD (lane REVIEW-INTAKE unit 2): no row credits a proxy
    // host, because the twelve former proxies own their menus, so every row joins its house.
    if (!byInstitution.has(key)) byInstitution.set(key, []);
    byInstitution.get(key).push(svc);
  }
  // The roster is read straight off `settlement.institutions`, so every key below is read on
  // the institution shape itself (the observed-shape scan grounds the receiver that way).
  return (Array.isArray(settlement?.institutions) ? settlement.institutions : [])
    .filter(Boolean)
    .map((inst, i) => {
      const key = String(inst.name || '');
      return {
        inst,
        category: String(inst.category || ''),
        // ROUND THREE, ruling (a) (ROUND-3-CUT §7 (a)): the card names the house by its label, the one
        // display leaf every surface reads: no catalogue count range, household range, gate or
        // condition ("Dwellings (1-8)" reads "Dwellings"; "Inn (multiple)" reads "Inns"), the in-world
        // qualifiers kept. The raw name stays the join key (`key` above) and the React key.
        label: institutionHouseLabel(inst),
        services: byInstitution.get(key) || [],
        backs: backers.get(key) || [],
        // PEOPLE-6 LINKS: the house's representative (null for a house with no face)
        // COHERENCE-POWERS (cure (i)): the seat's house where a house leads is faced by the leader
        face: faces.get(key) || seatHouseFaceOf(/** @type {never} */ (settlement), key) || null,
        // COHERENCE-POWERS: the face is the seat holder's, not this house's own (it names both hats)
        seatFaced: !faces.get(key) && !!seatHouseFaceOf(/** @type {never} */ (settlement), key),
        // X-45: the DM spoke, even to say nobody (the mark outlives an emptied list)
        authored: spoken.has(i),
        // X-46 car 3: the place, not a house (its own group at the foot of the tab)
        fabric: isFabricInstitution(inst),
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

/** The roster's power names, in the roster's order (the choices the backs editor offers). */
export function rosterPowerNames(settlement) {
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  return factions.map((f) => nameOf(f)).filter(Boolean);
}

/**
 * THE BACKS EDITOR (X-45): the roster's powers as toggles, Done writes the house's `backs` edit
 * as one line of names, "As the engine has it" reverts it. Chips are the Button primitive (the
 * raw-button baseline holds), in a WRAPPING row (the name-list census reads it as no list).
 */
function BacksEditor({ label, powers, selected, authored, onDone, onRevert, onClose }) {
  const mobile = useIsMobile();
  const [chosen, setChosen] = useState(() => new Set(selected));
  const toggle = (name) => setChosen((prev) => { const next = new Set(prev); if (next.has(name)) next.delete(name); else next.add(name); return next; });
  return (
    <div data-testid="institution-backs-editor" style={{ display: 'flex', alignItems: 'center', gap: '4px 6px', flexWrap: 'wrap', marginTop: 4 }}>
      {powers.map((name) => (
        <Button key={name} variant={chosen.has(name) ? 'gold' : 'secondary'} size="sm" aria-pressed={chosen.has(name)} onClick={() => toggle(name)}>
          {name}
        </Button>
      ))}
      <Button variant="primary" size="sm" onClick={() => onDone(powers.filter((name) => chosen.has(name)))} aria-label={`Done editing who ${label} backs`}>Done</Button>
      {authored && <Button variant="ghost" size="sm" onClick={onRevert}>As the engine has it</Button>}
      <Button variant="ghost" size="sm" onClick={onClose} aria-label={`Stop editing who ${label} backs`}>Cancel</Button>
      <span style={{ fontSize: chromeFontSize(FS.xxs, mobile), color: MUTED, flexBasis: '100%' }}>Who this house stands behind. Your choice replaces the original.</span>
    </div>
  );
}

/**
 * One institution: what it is, the powers it backs, then the doors to the services it renders
 * (X-35, X-40, X-45). Mounted by the tab and, through its own card, by the dossier search
 * (BUILD-W2-SEARCH U2). `sets` is the tab's chain-status reading (`computeChainSets`); `backs`
 * is the house's list from `houseBacksOf`; `canAuthor` and `index` arm the editor. `fabric` (X-46
 * car 3) marks the place rather than a house: no Backs line and no editor.
 */
export function InstitutionCard({ inst, category, label, services, sets, backs = [], authored = false, canAuthor = false, index = -1, powers = [], fabric = false, face = null, seatFaced: seatFacedRow = false, settlement = null }) {
  const mobile = useIsMobile();
  // COHERENCE-POWERS: a face that is not this house's own (the seat's house, faced by the dual-hat leader)
  const seatFaced = seatFacedRow && !!face && !!cardOfficeOf(face);
  // COHERENCE-POWERS-3 (F7): the empty seat's keeper in the caretaker's form; a disambiguated name's title once
  const connection = face && face.name ? connectionOf(face, settlement, seatFaced) : { name: '', tail: '' };
  const isCustom = inst.source === 'custom' || inst.isCustom === true;
  const badge = institutionBadge(inst);
  // X-20 (c): the card is always open; a link to the house scrolls it to the top.
  const { ref: focusRef } = useEntityFocus(entityIdFor('institution', inst));
  const selfId = entityIdFor('institution', inst);
  const description = institutionDescription(inst);
  const status = houseStatus(services, sets);
  // X-45: the editor is offered to a viewer who may author, in edit mode, on a house the
  // roster can address (the NPC card's own gate, `authorEditMode`).
  const editMode = useStore((s) => s.editMode);
  const applyUserEditAction = useStore((s) => s.applyUserEditAction);
  const revertUserEditAction = useStore((s) => s.revertUserEditAction);
  const [editingBacks, setEditingBacks] = useState(false);
  const mayEditBacks = !fabric && canAuthor && editMode && index >= 0 && powers.length > 0;
  return (
    <section ref={focusRef} id={entityAnchor('institution', inst)} data-testid="institution-card" style={{
      ...FLUSH, padding: '8px 11px', background: swatch['#FAF8F4'],
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
      {/* THE FACE ROW (PEOPLE-6 LINKS, the owner's word of 2026-11-07): the house's representative
          as "Pastor Robert Thomas" — the honorific of its title (src/data/faceHonorifics.js), then
          the full name — a door to its NPC card (EntityLink, by the card's own id). A house with no
          face shows no row. The row opens on the word "Connection:" (the owner, 2026-11-09,
          OWNER-WORDS-DOSSIER item 1), outside the door, so the link's name stays the face's alone. */}
      {face && face.name && (
        <div data-testid="institution-face" style={{ marginTop: 4, fontSize: proseFontSize(FS.xs, mobile), color: swatch.inkMag3 }}>
          <span data-testid="institution-face-label">Connection:</span>{' '}
          {/* COHERENCE-POWERS: the seat's house faced by the dual-hat leader names both hats: "Reeve Egilbert Neumann, the miller" */}
          <EntityLink id={entityIdFor('npc', face, String(face.name))} type="npc" fallback={connection.name} verbatim style={{ color: swatch.inkMag, fontWeight: 600 }} />
          {connection.tail}
        </div>
      )}
      {/* THE BACKS LINE (X-40, X-45): who the house contributes to, each name a door to the Power
          tab; the ✎ mark when the DM named them; the pencil when the DM may. A wrapping row like
          the doors below (the name-list census reads it as no list). */}
      {!fabric && (backs.length > 0 || authored || mayEditBacks) && (
        <div data-testid="institution-backs" style={{ display: 'flex', alignItems: 'baseline', gap: '2px 8px', flexWrap: 'wrap', marginTop: 4, fontSize: proseFontSize(FS.xs, mobile), color: swatch.inkMag3 }}>
          <span>Backs</span>
          {backs.map((back) => (
            <EntityLink key={back.faction} id={factionIdFromName(back.faction) || back.faction} type="faction" fallback={back.faction} style={{ color: swatch.inkMag, fontWeight: 600 }} />
          ))}
          {backs.length === 0 && <span style={{ fontStyle: 'italic' }}>nobody</span>}
          {authored && <span data-testid="institution-backs-authored" title="Named by you" style={{ fontSize: chromeFontSize(FS.nano, mobile), fontWeight: 800, color: PROVENANCE_TONE.you }}>✎ YOU</span>}
          {mayEditBacks && !editingBacks && (
            <Button variant="ghost" size="sm" onClick={() => setEditingBacks(true)} aria-label={`Edit who ${label} backs`} style={{ padding: '0 6px', minHeight: 0 }}>✎ Edit</Button>
          )}
        </div>
      )}
      {mayEditBacks && editingBacks && (
        <BacksEditor
          label={label}
          powers={powers}
          selected={backs.map((b) => b.faction)}
          authored={authored}
          onDone={(names) => { applyUserEditAction?.('institution', index, 'backs', formatBacksValue(names)); setEditingBacks(false); }}
          onRevert={() => { revertUserEditAction?.('institution', index, 'backs'); setEditingBacks(false); }}
          onClose={() => setEditingBacks(false)}
        />
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
                <EntityLink id={entityIdFor('service', entity)} type="service" fallback={institutionHouseLabel(svc.name)} style={{ color: swatch.inkMag, fontWeight: 600 }} />
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function InstitutionsTab({ settlement, canAuthor = false }) {
  const entries = useMemo(() => institutionsWithServices(settlement), [settlement]);
  const houses = useMemo(() => entries.filter((entry) => !entry.fabric), [entries]);
  const fabric = useMemo(() => entries.filter((entry) => entry.fabric), [entries]);
  const sets = useMemo(() => computeChainSets(settlement || {}), [settlement]);
  // X-45: the editor's choices and each house's address in the roster (the edit action's index).
  const powers = useMemo(() => rosterPowerNames(settlement), [settlement]);
  const roster = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  if (!entries.length) return <Empty message="No institutions are recorded for this settlement." />;

  return (
    <div style={FLUSH_PAGE}>
      {/* THE PAGE'S ONE MARK (X-42): the ? pill, right-aligned above the houses; the page has no
          title of its own (the tab names it), and no sentence about itself (X-38). */}
      <div data-testid="institutions-header" style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 12px' }}>
        <InfoPill text={SECTION_HELP.institutions} />
      </div>
      {/* THE FLUSH RULE (X-44): the houses sit edge to edge, parted by their own hairlines. */}
      <div data-testid="institutions-stack" style={FLUSH_STACK}>
        {houses.map(({ inst, category, label, services, backs, authored, face, seatFaced }, i) => (
          <InstitutionCard key={`${inst.name}-${i}`} inst={inst} category={category} label={label} services={services} backs={backs} authored={authored} sets={sets}
            canAuthor={canAuthor} index={roster.indexOf(inst)} powers={powers} face={face} seatFaced={seatFaced} settlement={settlement} />
        ))}
      </div>
      {/* THE FABRIC OF THE PLACE (X-46 car 3): the dwellings, the well, the church walk — the place
          itself, not a house; its own group at the foot, no Backs line. */}
      {fabric.length > 0 && (
        <section data-testid="institutions-fabric">
          <div data-testid="institutions-fabric-heading" style={{ ...literaryTitle(FS.sm), color: MUTED, padding: '10px 12px 4px' }}>The fabric of the place</div>
          <div style={FLUSH_STACK}>
            {fabric.map(({ inst, category, label, services }, i) => (
              <InstitutionCard key={`fabric-${i}`} inst={inst} category={category} label={label} services={services} sets={sets} fabric />
            ))}
          </div>
        </section>
      )}
      {/* The campaign-only stale-window note closes the page (the block law, X-16 rung 6). */}
      <EconomyFreshnessNote settlement={settlement} variant="catalog" />
    </div>
  );
}
