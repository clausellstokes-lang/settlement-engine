/**
 * EventComposer — Pick an event, see preview, confirm/cancel.
 *
 * Available in both phases. In draft mode the same engine runs but
 * nothing is logged ("see what would happen"). In canon mode applying
 * adds a timeline entry. The store handlers gate the log persistence;
 * this UI is identical in both modes.
 */

import { useState, useMemo } from 'react';
import { Zap, Flame, Trash2, Plus, MapPinOff, AlertOctagon, X, Check } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { EVENT_REGISTRY } from '../../domain/events/registry.js';
import { inferImportance } from '../../domain/entities/npcs.js';
import { validateBatch } from '../../domain/events/batch.js';
import { rolesForInstitution, importanceForRole, influenceForImportance } from '../../domain/roles/roleCatalog.js';
import { factionCompendium } from '../../domain/factions/factionCatalog.js';
import { buildInstitutionCatalog } from '../../domain/institutions/institutionCatalog.js';
import { buildStressorPickerItems } from '../../domain/stressorPicker.js';
import { RULING_POWER_CAUSES, governingFactionOf } from '../../domain/rulingPower.js';
import { canonExports, canonImports, canonStressors } from '../../domain/canonicalAccessors.js';
import { EXPORT_GOODS_BY_TIER } from '../../data/tradeGoodsData.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { institutionHasTag, TAG } from '../../lib/entities.js';
import CatalogPicker from './CatalogPicker.jsx';
import { GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, FS, SP, R, swatch } from '../theme.js';

const _TYPE_ICONS = {
  ADD_INSTITUTION:    Plus,
  REMOVE_INSTITUTION: Trash2,
  DAMAGE_INSTITUTION: Flame,
  DEPLETE_RESOURCE:   AlertOctagon,
  CUT_TRADE_ROUTE:    MapPinOff,
};

// Code-review fix: target field used to be a free-text input. The user
// shouldn't have to TYPE the name of an NPC they want to kill — the NPC
// is already in the dossier. This map declares which dossier collection
// to pull the target dropdown from for each event type. ADD_*
// (institution / npc) and CUT_TRADE_ROUTE genuinely have no source list
// (the user is naming something new), so they keep the text input.
const TARGET_ENTITY_BY_EVENT = Object.freeze({
  ADD_INSTITUTION:      null,           // new entity — free text
  ADD_FACTION:          null,           // new entity — free-text name
  REMOVE_INSTITUTION:   'institutions',
  DAMAGE_INSTITUTION:   'institutions',
  IMPAIR_INSTITUTION:   'institutions',
  ADD_NPC:              null,           // new entity — free text
  KILL_NPC:             'npcs',
  IMPOSE_CORRUPTION:    'npcs',          // pick the clean NPC to turn; criminal org picked below
  ASSIGN_NPC_TO_ROLE:   'npcs',
  IMPAIR_FACTION:       'factions',
  RESTORE_FACTION:      'factions',     // recover a faction that is currently impaired
  EXPOSE_CORRUPTION:    'factions',     // or institutions; pick factions as the dominant case
  RESTORE_INSTITUTION:  'institutions', // recover an institution that is currently impaired
  DEPLETE_RESOURCE:     'resources',
  RECOVERED_RESOURCE:   'resources',    // recover a resource the campaign already depleted
  CUT_TRADE_ROUTE:      null,           // route names aren't tracked as entities — free text
  SETTLEMENT_DISPUTE:   'neighbours',   // §9b — pick a linked neighbour
  BROKERED_ALLIANCE:    'neighbours',   // §9g
  OPENED_TRADE_ROUTE:   'neighbours',   // §9h
  // Editor roster wave.
  RESOLVE_STRESSOR:     'stressors',    // pick one of the settlement's current stressors
  ADD_TRADE_GOOD:       null,           // new label — free text + datalist suggestions below
  REMOVE_TRADE_GOOD:    'tradeGoods',   // union of exports / imports / transit
  ADD_RESOURCE:         null,           // catalog select + custom name (custom UI below)
  REMOVE_RESOURCE:      'resources',
  PROMOTE_NPC:          null,           // faction-grouped NPC pair picker (custom UI below)
  DEMOTE_NPC:           null,
});

// §9b/§9g/§9h — relationship events target a neighbouring settlement and set a
// relationship type. The per-event option list drives the relationship dropdown;
// these events are only offered when the settlement has linked neighbours.
const RELATIONSHIP_OPTIONS = Object.freeze({
  SETTLEMENT_DISPUTE: ['neutral', 'rival', 'cold_war', 'hostile'],
  BROKERED_ALLIANCE:  ['allied'],
  OPENED_TRADE_ROUTE: ['allied', 'client', 'patron', 'trade_partners'],
});
const RELATIONSHIP_LABELS = Object.freeze({
  neutral: 'Neutral', rival: 'Rival', cold_war: 'Cold War', hostile: 'Hostile',
  allied: 'Allied', client: 'Client', patron: 'Patron', trade_partners: 'Trade Partners',
});

// Events the DM cannot hand-author from the Make Changes dropdown. They stay in
// the registry — and the world engine still produces them via simulation /
// regional propagation — they're just not one-click authorable here:
//   - KILL_LEADER folds into KILL_NPC (consequences derive from the NPC).
//   - REFUGEE_WAVE / PLAGUE / RAID_OR_MONSTER_ATTACK / REMOVED_THREAT /
//     STARTED_RIOT are authored via Stressors in the Roster below, not as
//     one-off events — a stressor IS the ongoing condition these represented.
//   - DAMAGE_INSTITUTION duplicated IMPAIR_INSTITUTION once the severity slider
//     was hidden, so Impair Institution is the single "weaken it" action.
const NON_AUTHORABLE_EVENTS = new Set([
  'KILL_LEADER',
  'CUT_TRADE_ROUTE',          // §9b — replaced by Settlement Dispute (neighbour + relationship)
  'DAMAGE_INSTITUTION',
  'REFUGEE_WAVE',
  'PLAGUE',
  'RAID_OR_MONSTER_ATTACK',
  'REMOVED_THREAT',
  'STARTED_RIOT',
]);

/** Build {id, name} options from a dossier collection for the target dropdown. */
function buildTargetOptions(settlement, collectionKey) {
  if (!collectionKey || !settlement) return [];
  let list;
  switch (collectionKey) {
    case 'institutions': list = settlement.institutions || []; break;
    case 'npcs':         list = settlement.npcs || []; break;
    case 'factions':     list = settlement.powerStructure?.factions || []; break;
    case 'neighbours':   {
      const net = settlement.neighbourNetwork || settlement.neighbourLinks || [];
      list = net.map((l) => ({ id: l.name || l.neighbourName || l.id, name: l.name || l.neighbourName || l.id }));
      break;
    }
    case 'resources':    {
      // Nearby resources are stored as keys in nearbyResources (config) and
      // sometimes additionally on settlement.resources. Combine + dedupe.
      const fromConfig = (settlement.config?.nearbyResources || []).map(k => ({ id: k, name: k }));
      const fromList   = (settlement.resources || []).map(r => ({
        id: r.id || r.key || r.name,
        name: r.name || r.id || r.key,
      }));
      list = [...fromList, ...fromConfig];
      break;
    }
    case 'stressors':    {
      // canonStressors covers the mutation's full probe: the array containers
      // AND the bare-object shape pipeline settlements carry (assembleSettlement
      // dual-writes the single rolled stressor as a bare object under stress +
      // stressors). The old Array.isArray-only probe returned [] for every
      // pipeline-generated settlement, so Resolve Stressor fell back to free
      // text instead of offering the live crisis.
      list = canonStressors(settlement).filter(Boolean).map(st => ({
        id: st.type || st.name || st.label,
        name: st.label || st.name || st.type,
      }));
      break;
    }
    case 'tradeGoods':   {
      // Union of the canonical export/import lists + transit, tolerant of
      // legacy {name, good} object entries the Roster editor writes.
      const ec = settlement.economicState || {};
      const labels = [
        ...canonExports(settlement),
        ...canonImports(settlement),
        ...(Array.isArray(ec.transit) ? ec.transit : []),
      ]
        .map(e => (typeof e === 'string' ? e : e?.name || e?.good || ''))
        .filter(Boolean);
      list = labels.map(l => ({ id: l, name: l }));
      break;
    }
    default: return [];
  }
  // Normalize to {id, name}, dedupe by id, keep insertion order.
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const id = item.id || item.faction || item.name;
    const name = item.name || item.faction || item.id;
    if (!id || !name) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id: String(id), name: String(name) });
  }
  return out;
}

export default function EventComposer() {
  const phase     = useStore(s => s.phase);
  const settlement = useStore(s => s.settlement);
  const previewEvent = useStore(s => s.previewEvent);
  const applyEvent   = useStore(s => s.applyEvent);
  const applyPendingPreview = useStore(s => s.applyPendingPreview);
  const dismissPreview = useStore(s => s.dismissPreview);
  const pendingPreview = useStore(s => s.pendingPreview);
  const previewBatch   = useStore(s => s.previewEventBatch);
  const applyBatch     = useStore(s => s.applyEventBatch);
  const pendingBatchPreview = useStore(s => s.pendingBatchPreview);
  const dismissBatchPreview = useStore(s => s.dismissBatchPreview);

  const [type, setType]         = useState('ADD_INSTITUTION');
  const [target, setTarget]     = useState('');
  const [description, setDesc]  = useState('');
  // §8 M3b — "Caused by the party" attribution. Off by default; when set, the
  // event is tagged party-caused (cause: 'party_action' + partyCaused: true) so
  // the timeline/Chronicle can distinguish "the table did this" from "the world
  // did this", and — in a canon campaign — the world engine ripples it (Phase 2).
  const [partyCaused, setPartyCaused] = useState(false);
  // Per-event payload fields for the new event types. Each is rendered
  // conditionally (only shown when the active event type uses it) so
  // the form stays uncluttered for simple events.
  const [importance, setImportance] = useState('notable');     // ADD_NPC, KILL_NPC
  const [role, setRole]             = useState('');           // ADD_NPC, ASSIGN_NPC_TO_ROLE
  const [institutionId, setInstitutionId] = useState('');     // ADD_NPC, ASSIGN_NPC_TO_ROLE
  const [quality, setQuality]       = useState('competent');   // ASSIGN_NPC_TO_ROLE
  // Severity + axis are intentionally hidden from the DM — the 0-100 "math"
  // confused more than it clarified. Impair Institution / Impair Faction apply a
  // standard moderate setback to legitimacy; these values feed buildEvent below.
  // To re-expose: turn these back into useState and restore the Dimension /
  // Severity <Field>s that used to live in the form.
  const severity  = 0.7;        // IMPAIR_INSTITUTION / IMPAIR_FACTION (+ legacy DAMAGE_INSTITUTION)
  const dimension = 'legitimacy';
  const [staged, setStaged]         = useState([]);            // batch: staged changes not yet applied
  const [destroyConfirm, setDestroyConfirm] = useState('');    // §9c: type-the-name gate for Destroy Settlement
  const [relationshipType, setRelationshipType] = useState(''); // §9b/g/h: neighbour relationship for dispute/alliance/trade
  const [criminalOrg, setCriminalOrg] = useState('');          // IMPOSE_CORRUPTION: the criminal organization to link the NPC to
  const [stressorPick, setStressorPick] = useState(null);     // APPLY_STRESSOR: the picked catalog item
  const [stressorSeverity, setStressorSeverity] = useState('moderate'); // APPLY_STRESSOR: word-banded severity
  const [powerCause, setPowerCause] = useState('coup');       // CHANGE_RULING_POWER: how power changes hands
  const [tradeDirection, setTradeDirection] = useState('export'); // ADD_TRADE_GOOD: export | import
  const [tradeEntrepot, setTradeEntrepot] = useState(false);   // ADD_TRADE_GOOD: transit through the warehouses
  const [customResourceName, setCustomResourceName] = useState(''); // ADD_RESOURCE: free-text custom name
  const [swapWithNpcId, setSwapWithNpcId] = useState('');      // PROMOTE_NPC / DEMOTE_NPC: the same-faction counterpart
  const hasNeighbours = (settlement?.neighbourNetwork?.length || settlement?.neighbourLinks?.length || 0) > 0;
  const [addCategory, setAddCategory] = useState('');          // ADD_INSTITUTION: category of the picked catalog item
  const customContent = useStore(s => s.customContent);

  // Catalog sources for the catalog-backed "Add" events. Institutions come
  // from the full institutional catalog + the user's Compendium, minus what's
  // already here; factions from the descriptor database, grouped + filtered.
  const institutionCatalogItems = useMemo(
    () => buildInstitutionCatalog(settlement?.institutions || [], customContent?.institutions || []),
    [settlement?.institutions, customContent?.institutions],
  );
  const institutionCategories = useMemo(
    () => [...new Set(institutionCatalogItems.map(i => i.category).filter(Boolean))].sort(),
    [institutionCatalogItems],
  );
  const factionGroups = useMemo(() => factionCompendium(settlement), [settlement]);
  // APPLY_STRESSOR — the FULL stressor vocabulary: generation types +
  // campaign-only types (rebellion, market shock, criminal corridor, magical
  // instability, coup d'état) + the user's custom stressors, deduped.
  const stressorPickerItems = useMemo(() => buildStressorPickerItems(
    settlement?.stressors || settlement?.stress || settlement?.stresses || [],
    customContent?.stressors || [],
  ), [settlement?.stressors, settlement?.stress, settlement?.stresses, customContent?.stressors]);
  // CHANGE_RULING_POWER — every faction except the one already on the seat.
  const rulingPowerOptions = useMemo(() => {
    const governing = governingFactionOf(settlement);
    return (settlement?.powerStructure?.factions || [])
      .filter(f => f && f !== governing)
      .map(f => ({ id: String(f.faction || f.name || ''), name: String(f.faction || f.name || '') }))
      .filter(o => o.id);
  }, [settlement]);
  // ADD_TRADE_GOOD — datalist suggestions: every catalogued export label
  // across all tiers (free text still wins; the label is the storage format).
  const tradeGoodSuggestions = useMemo(() => {
    const names = new Set();
    for (const tierGoods of Object.values(EXPORT_GOODS_BY_TIER || {})) {
      for (const name of Object.keys(tierGoods || {})) names.add(name);
    }
    return [...names].sort((a, b) => a.localeCompare(b));
  }, []);
  // ADD_RESOURCE — catalog entries not already worked nearby. Shows the
  // label, stores the underscore key (the config format).
  const resourceCatalogOptions = useMemo(() => {
    const present = new Set(settlement?.config?.nearbyResources || []);
    return Object.entries(RESOURCE_DATA)
      .filter(([key]) => !present.has(key))
      .map(([key, def]) => ({ id: key, name: def.label || key }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [settlement?.config?.nearbyResources]);
  // PROMOTE_NPC / DEMOTE_NPC — NPCs grouped by faction affiliation, keeping
  // only factions with at least two members (the swap needs a counterpart).
  const npcSwapGroups = useMemo(() => {
    const byFaction = new Map();
    for (const npc of settlement?.npcs || []) {
      const faction = npc?.factionAffiliation;
      if (!faction || !npc?.name) continue;
      if (!byFaction.has(faction)) byFaction.set(faction, []);
      byFaction.get(faction).push({ id: String(npc.id || npc.name), name: npc.name });
    }
    return [...byFaction.entries()]
      .filter(([, npcs]) => npcs.length >= 2)
      .map(([faction, npcs]) => ({ faction, npcs }))
      .sort((a, b) => a.faction.localeCompare(b.faction));
  }, [settlement?.npcs]);
  const hasSwapPairs = npcSwapGroups.length > 0;
  // IMPOSE_CORRUPTION — criminal organizations present in the settlement (same CRIMINAL-tag
  // detector the corruption domain uses, so the picker matches what the engine recognizes).
  const criminalOrgs = useMemo(
    () => (settlement?.institutions || [])
      // Match the domain's isCriminalInstitution exactly (tag/name backfill OR criminal category),
      // so the picker offers precisely what the handler accepts.
      .filter(i => institutionHasTag(i, TAG.CRIMINAL) || /criminal/i.test(String(i?.category || '')))
      .map(i => i.name).filter(Boolean),
    [settlement?.institutions],
  );

  if (!settlement) return null;
  const spec = EVENT_REGISTRY[type];
  const needsTarget = !!spec?.requiresTarget;
  // ADD_RESOURCE's "Custom resource…" option holds the real target in the
  // companion text input; the swap events also need their counterpart picked.
  const effectiveTarget = type === 'ADD_RESOURCE' && target === CUSTOM_RESOURCE_OPTION
    ? customResourceName
    : target;
  const canSubmit = (!needsTarget || effectiveTarget.trim().length > 0)
    && !((type === 'PROMOTE_NPC' || type === 'DEMOTE_NPC') && !swapWithNpcId);

  // Derive a sensible institution list for the institution-pickers.
  const institutionOptions = (settlement.institutions || [])
    .map(i => ({ id: i.id || i.name, name: i.name || i.id }))
    .filter(o => o.id && o.name);

  function buildEvent() {
    const payload = {};
    if (type === 'ADD_INSTITUTION' && addCategory) payload.category = addCategory;
    if (type === 'DAMAGE_INSTITUTION') payload.severity = severity;
    if (type === 'ADD_NPC') {
      payload.importance = importance;
      if (role) payload.role = role;
    }
    if (type === 'KILL_NPC') {
      // Derive the consequence tier from the NPC itself rather than asking the
      // DM to re-state what the dossier already knows. Both the state math
      // (registry KILL_NPC.stateDeltas) and the entity mutation read this, so
      // a pillar's death isn't silently down-graded to "notable".
      const npc = (settlement.npcs || []).find(
        n => String(n.id || n.name) === String(target),
      );
      if (npc) payload.importance = npc.importance || inferImportance(npc);
    }
    if (type === 'ADD_NPC' && institutionId) {
      payload.linkedInstitutionIds = [institutionId];
    }
    if (type === 'ASSIGN_NPC_TO_ROLE') {
      payload.quality = quality;
      if (role)          payload.role = role;
      if (institutionId) payload.institutionId = institutionId;
      // Importance + influence come from the role the NPC fills (the
      // institution's role catalogue), not a separate question.
      const inst = institutionId
        ? (settlement.institutions || []).find(i => String(i.id || i.name) === String(institutionId))
        : null;
      const roleOpts = inst ? rolesForInstitution(inst) : [];
      const imp = roleOpts.length ? importanceForRole(role, roleOpts) : null;
      if (imp) {
        payload.importance = imp;
        payload.influence  = influenceForImportance(imp);
      }
    }
    if (type === 'IMPAIR_INSTITUTION' || type === 'IMPAIR_FACTION') {
      payload.dimension = dimension;
      payload.severity  = severity;
    }
    if (RELATIONSHIP_OPTIONS[type]) {
      payload.relationshipType = relationshipType || RELATIONSHIP_OPTIONS[type][0];
    }
    if (type === 'IMPOSE_CORRUPTION') {
      const org = criminalOrg || criminalOrgs[0];
      if (org) payload.criminalInstitution = org;
    }
    if (type === 'APPLY_STRESSOR') {
      payload.stressorType = stressorPick?.key || target.trim();
      payload.label = stressorPick?.name || labelOfTarget(target);
      payload.severity = STRESSOR_SEVERITY_VALUES[stressorSeverity] ?? 0.6;
      if (stressorPick?.isCustom) payload.isCustom = true;
    }
    if (type === 'CHANGE_RULING_POWER') {
      payload.cause = powerCause || 'coup';
    }
    if (type === 'RESOLVE_STRESSOR') {
      payload.stressorType = target.trim();
      const opt = buildTargetOptions(settlement, 'stressors').find(o => o.id === target);
      if (opt) payload.label = opt.name;
    }
    if (type === 'ADD_TRADE_GOOD') {
      payload.direction = tradeDirection;
      payload.entrepot = tradeDirection === 'export' && tradeEntrepot;
      payload.label = target.trim();
    }
    if (type === 'ADD_RESOURCE' && target === CUSTOM_RESOURCE_OPTION) {
      payload.isCustom = true;
    }
    if (type === 'PROMOTE_NPC' || type === 'DEMOTE_NPC') {
      payload.swapWithNpcId = swapWithNpcId;
    }
    return {
      id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      targetId: effectiveTarget.trim(),
      payload,
      // Party-caused events carry a distinct cause so the timeline/Chronicle and
      // (in canon campaigns) the world engine can treat them as the table's doing.
      cause: partyCaused ? 'party_action' : (phase === 'canon' ? 'player_action' : 'authoring'),
      partyCaused: partyCaused || undefined,
      description: description.trim() || undefined,
    };
  }

  function onPreview() {
    previewEvent(buildEvent());
  }

  function onApply() {
    // §9c — Destroy Settlement is drastic + recoverable-only-by-effort, so it
    // requires typing the settlement name to confirm. Block apply until it matches.
    const evType = pendingPreview?.event?.type || type;
    if (evType === 'DESTROY_SETTLEMENT' && destroyConfirm.trim() !== (settlement?.name || '').trim()) return;
    // Audit fix: prefer committing the pending preview (the exact event
    // the user previewed) over building a new event. Falls back to
    // applyEvent(buildEvent()) only if no preview is pending — which
    // shouldn't happen in normal flow because the Apply button is only
    // visible after a preview.
    if (pendingPreview?.event) {
      applyPendingPreview();
    } else {
      applyEvent(buildEvent());
    }
    setTarget('');
    setDesc('');
    setPartyCaused(false);
    setDestroyConfirm('');
    setSwapWithNpcId('');
    setCustomResourceName('');
  }

  return (
    <div data-anchor="event-composer" style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.md,
      padding: SP.sm, marginTop: SP.sm,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: FS.xs, fontWeight: 800, fontFamily: sans,
        color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: SP.sm,
      }}>
        <Zap size={12} />
        Make Changes
      </div>
      <div style={{ fontSize: FS.xxs, fontFamily: sans, color: MUTED, marginTop: -2, marginBottom: SP.sm, lineHeight: 1.4 }}>
        {phase === 'canon'
          ? "In-world events write to the campaign timeline. The Roster and Tune edits below are corrections, with no timeline entry."
          : 'Draft: nothing is logged yet. Stage changes and preview their effect before you canonize.'}
      </div>

      <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Field label="Event">
          <select value={type} onChange={e => { const v = e.target.value; setType(v); setTarget(''); setAddCategory(''); setDestroyConfirm(''); setRelationshipType((RELATIONSHIP_OPTIONS[v] || [])[0] || ''); setCriminalOrg(''); setStressorPick(null); setStressorSeverity('moderate'); setPowerCause('coup'); setTradeDirection('export'); setTradeEntrepot(false); setCustomResourceName(''); setSwapWithNpcId(''); }} style={selectStyle}>
            {Object.entries(EVENT_REGISTRY)
              /* Hide non-authorable events from the DM action list (see
                 NON_AUTHORABLE_EVENTS): the folded leader event, the stressor-
                 equivalent events (authored via the Roster's Stressors), and
                 Damage Institution (redundant with Impair). All stay in the
                 registry for back-compat + world-engine simulation.
                 §9b/g/h — relationship events only appear when the settlement
                 has linked neighbours to act on. */
              .filter(([k]) => !NON_AUTHORABLE_EVENTS.has(k))
              .filter(([k]) => !RELATIONSHIP_OPTIONS[k] || hasNeighbours)
              /* The standing swap needs two NPCs in one faction — hide the
                 promote/demote events when no faction has a pair to swap. */
              .filter(([k]) => !['PROMOTE_NPC', 'DEMOTE_NPC'].includes(k) || hasSwapPairs)
              .map(([k, s]) => (
                <option key={k} value={k}>{s.label}</option>
              ))}
          </select>
        </Field>

        {(() => {
          // Catalog-backed adds. Institutions come from the catalog picker
          // (searchable, filtered to what's not already here); factions from
          // the descriptor compendium, grouped by category and filtered the
          // same way. Both set the event target to the chosen name — no free
          // typing of names the engine already knows.
          if (type === 'ADD_INSTITUTION') {
            return (
              <Field label="Institution" hint={target ? `Adding: ${target}` : 'Pick from the catalog'}>
                {target && (
                  <div style={pickedChipStyle}>
                    <span>{target}</span>
                    <button onClick={() => { setTarget(''); setAddCategory(''); }} title="Clear" style={chipClearBtn}><X size={11} /></button>
                  </div>
                )}
                <CatalogPicker
                  closeOnPick
                  items={institutionCatalogItems}
                  onAdd={(item) => { setTarget(item.name); setAddCategory(item.category || 'civic'); }}
                  placeholder="Search institutions..."
                  categoryFilters={institutionCategories}
                  triggerLabel={target ? 'Pick a different institution' : undefined}
                />
              </Field>
            );
          }
          if (type === 'APPLY_STRESSOR') {
            return (
              <Field label="Stressor" hint={target ? `Applying: ${stressorPick?.name || target}` : 'Pick from the full catalog (incl. custom)'}>
                {target && (
                  <div style={pickedChipStyle}>
                    <span>{stressorPick?.name || target}</span>
                    <button onClick={() => { setTarget(''); setStressorPick(null); }} title="Clear" style={chipClearBtn}><X size={11} /></button>
                  </div>
                )}
                <CatalogPicker
                  closeOnPick
                  items={stressorPickerItems}
                  onAdd={(item) => { setTarget(item.key); setStressorPick(item); }}
                  placeholder="Search stressors..."
                  categoryFilters={['Settlement', 'Campaign', 'Custom']}
                  triggerLabel={target ? 'Pick a different stressor' : undefined}
                />
              </Field>
            );
          }
          if (type === 'CHANGE_RULING_POWER') {
            return (
              <Field label="New ruling power" hint={spec?.targetPrompt}>
                <select value={target} onChange={e => setTarget(e.target.value)} style={selectStyle}>
                  <option value="">, Pick a faction -</option>
                  {rulingPowerOptions.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
                {rulingPowerOptions.length === 0 && (
                  <span style={{ fontSize: FS.xxs, fontStyle: 'italic', color: MUTED, opacity: 0.8 }}>
                    No other faction holds power here — add a faction first.
                  </span>
                )}
              </Field>
            );
          }
          if (type === 'ADD_FACTION') {
            return (
              <Field label="Faction" hint="Choose a faction that isn't here yet">
                <select value={target} onChange={e => setTarget(e.target.value)} style={selectStyle}>
                  <option value="">Select a faction</option>
                  {factionGroups.map(g => (
                    <optgroup key={g.category} label={g.label}>
                      {g.options.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
                    </optgroup>
                  ))}
                </select>
                {factionGroups.length === 0 && (
                  <span style={{ fontSize: FS.xxs, fontStyle: 'italic', color: MUTED, opacity: 0.8 }}>
                    Every catalogued faction is already present. Name a new one in Description.
                  </span>
                )}
              </Field>
            );
          }
          // ADD_TRADE_GOOD — free text with catalog suggestions; the label is
          // the storage format, so anything typed is a valid good.
          if (type === 'ADD_TRADE_GOOD') {
            return (
              <Field label="Good" hint={spec?.targetPrompt}>
                <input
                  list="event-trade-good-suggestions"
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  placeholder="Type a label or pick a suggestion"
                  style={inputStyle}
                />
                <datalist id="event-trade-good-suggestions">
                  {tradeGoodSuggestions.map(n => <option key={n} value={n} />)}
                </datalist>
              </Field>
            );
          }
          // ADD_RESOURCE — catalog select (label shown, underscore key stored)
          // plus a "Custom resource…" escape hatch with a free-text name.
          if (type === 'ADD_RESOURCE') {
            return (
              <Field label="Resource" hint={target === CUSTOM_RESOURCE_OPTION ? 'Name the custom resource' : spec?.targetPrompt}>
                <select
                  value={target}
                  onChange={e => { setTarget(e.target.value); setCustomResourceName(''); }}
                  style={selectStyle}
                >
                  <option value="">, Pick a resource -</option>
                  {resourceCatalogOptions.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                  <option value={CUSTOM_RESOURCE_OPTION}>Custom resource…</option>
                </select>
                {target === CUSTOM_RESOURCE_OPTION && (
                  <input
                    value={customResourceName}
                    onChange={e => setCustomResourceName(e.target.value)}
                    placeholder='e.g. "Moonpetal grove"'
                    style={{ ...inputStyle, marginTop: 4 }}
                  />
                )}
              </Field>
            );
          }
          // PROMOTE_NPC / DEMOTE_NPC — pick the NPC (grouped by faction), then
          // the same-faction counterpart they swap standing with.
          if (type === 'PROMOTE_NPC' || type === 'DEMOTE_NPC') {
            const pickedGroup = npcSwapGroups.find(g => g.npcs.some(n => n.id === target));
            const counterparts = pickedGroup ? pickedGroup.npcs.filter(n => n.id !== target) : [];
            return (
              <>
                <Field label="NPC" hint={spec?.targetPrompt}>
                  <select
                    value={target}
                    onChange={e => { setTarget(e.target.value); setSwapWithNpcId(''); }}
                    style={selectStyle}
                  >
                    <option value="">, Pick an NPC -</option>
                    {npcSwapGroups.map(g => (
                      <optgroup key={g.faction} label={g.faction}>
                        {g.npcs.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </Field>
                <Field
                  label={type === 'PROMOTE_NPC' ? 'Displaces' : 'Displaced by'}
                  hint="Same faction — the two swap standing"
                >
                  <select
                    value={swapWithNpcId}
                    onChange={e => setSwapWithNpcId(e.target.value)}
                    style={selectStyle}
                    disabled={!target}
                  >
                    <option value="">, Pick the counterpart -</option>
                    {counterparts.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </Field>
              </>
            );
          }
          // Code-review fix: source the target from existing dossier
          // entities rather than asking the user to type a name that
          // must match. Falls back to a text input for ADD_* events
          // (new entities) and route-type events that aren't in the
          // dossier as discrete records.
          const collectionKey = TARGET_ENTITY_BY_EVENT[type];
          const targetOpts = buildTargetOptions(settlement, collectionKey);
          if (collectionKey && targetOpts.length > 0) {
            return (
              <Field label="Target" hint={spec?.targetPrompt}>
                <select
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">, Pick a {collectionKey.replace(/s$/, '')} -</option>
                  {targetOpts.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </Field>
            );
          }
          // No collection or empty list → keep the free text input so
          // the user can still author an event (e.g. ADD_NPC of a brand
          // new NPC, CUT_TRADE_ROUTE without a tracked route record).
          return (
            <Field label="Target" hint={spec?.targetPrompt}>
              <input
                value={target}
                onChange={e => setTarget(e.target.value)}
                placeholder={spec?.targetPrompt || 'optional'}
                style={inputStyle}
              />
            </Field>
          );
        })()}

        {/* IMPOSE_CORRUPTION — which criminal organization gets its hooks into the NPC */}
        {type === 'IMPOSE_CORRUPTION' && (
          criminalOrgs.length > 0 ? (
            <Field label="Criminal organization" hint="The organization that corrupts the chosen NPC">
              <select value={criminalOrg || criminalOrgs[0]} onChange={e => setCriminalOrg(e.target.value)} style={selectStyle}>
                {criminalOrgs.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
          ) : (
            <Field label="Criminal organization" hint="No criminal organization in this settlement to corrupt through">
              <div style={{ fontSize: FS.xxs, fontFamily: sans, color: MUTED, padding: '6px 0' }}>
                This settlement has no criminal organization — add one (e.g. a Thieves&rsquo; Guild) before imposing corruption.
              </div>
            </Field>
          )
        )}

        {/* ADD_TRADE_GOOD — direction, plus entrepôt handling for exports */}
        {type === 'ADD_TRADE_GOOD' && (
          <Field label="Direction" hint={tradeDirection === 'import' ? 'The settlement buys this in' : 'The settlement sells this outward'}>
            <select
              value={tradeDirection}
              onChange={e => { setTradeDirection(e.target.value); if (e.target.value !== 'export') setTradeEntrepot(false); }}
              style={selectStyle}
            >
              <option value="export">Export</option>
              <option value="import">Import</option>
            </select>
          </Field>
        )}
        {type === 'ADD_TRADE_GOOD' && tradeDirection === 'export' && (
          <Field label="Handling" hint={tradeEntrepot ? 'Re-exported through the warehouses — listed as "(transit)"' : 'Produced locally'}>
            <select
              value={tradeEntrepot ? 'transit' : 'local'}
              onChange={e => setTradeEntrepot(e.target.value === 'transit')}
              style={selectStyle}
            >
              <option value="local">Local production</option>
              <option value="transit">Entrepôt transit</option>
            </select>
          </Field>
        )}

        {/* APPLY_STRESSOR — word-banded severity (no 0-100 math at the table) */}
        {type === 'APPLY_STRESSOR' && (
          <Field label="Severity" hint={
            stressorSeverity === 'severe' ? 'A defining crisis — expect cascades' :
            stressorSeverity === 'minor'  ? 'A pressure, not yet a catastrophe'   :
                                            'A serious, active crisis'
          }>
            <select value={stressorSeverity} onChange={e => setStressorSeverity(e.target.value)} style={selectStyle}>
              <option value="minor">Minor</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </Field>
        )}

        {/* CHANGE_RULING_POWER — how power changes hands shapes the aftermath */}
        {type === 'CHANGE_RULING_POWER' && (
          <Field label="How" hint={
            powerCause === 'election'   ? 'A fresh mandate — legitimacy starts warmer' :
            powerCause === 'conquest'   ? 'Imposed from outside — legitimacy starts cold' :
            powerCause === 'succession' ? 'The line held; the household reorders' :
            powerCause === 'appointment'? 'Installed by a higher authority' :
                                          'Seized by force — loyalties re-sworn at swordpoint'
          }>
            <select value={powerCause} onChange={e => setPowerCause(e.target.value)} style={selectStyle}>
              {RULING_POWER_CAUSES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </Field>
        )}

        {/* §9b/§9g/§9h — relationship type for neighbour-targeted events */}
        {RELATIONSHIP_OPTIONS[type] && (
          <Field label="New relationship" hint="Sets this settlement's relationship with the chosen neighbour">
            <select value={relationshipType || RELATIONSHIP_OPTIONS[type][0]} onChange={e => setRelationshipType(e.target.value)} style={selectStyle}>
              {RELATIONSHIP_OPTIONS[type].map(r => <option key={r} value={r}>{RELATIONSHIP_LABELS[r] || r}</option>)}
            </select>
          </Field>
        )}

        {/* ADD_NPC defines a NEW NPC, so its importance is a real choice.
            KILL_NPC does not ask — it derives from the selected NPC below. */}
        {type === 'ADD_NPC' && (
          <Field label="Importance" hint={
            importance === 'pillar' ? 'Death creates major consequences' :
            importance === 'key'    ? 'Meaningful effect on linked entity' :
            importance === 'notable'? 'Small modifier on linked entity'   :
                                      'Flavor only. No engine effect'
          }>
            <select value={importance} onChange={e => setImportance(e.target.value)} style={selectStyle}>
              <option value="minor">Minor</option>
              <option value="notable">Notable</option>
              <option value="key">Key</option>
              <option value="pillar">Pillar</option>
            </select>
          </Field>
        )}

        {/* KILL_NPC: importance is pulled from the chosen NPC and shown
            read-only, so the DM sees the consequence tier before applying. */}
        {type === 'KILL_NPC' && target && (() => {
          const npc = (settlement.npcs || []).find(
            n => String(n.id || n.name) === String(target),
          );
          if (!npc) return null;
          const imp = npc.importance || inferImportance(npc);
          return (
            <Field label="Importance (from this NPC)" hint={
              imp === 'pillar' ? 'Pillar. Death shakes the settlement.' :
              imp === 'key'    ? 'Key. Meaningful effect on linked entity.' :
              imp === 'notable'? 'Notable. Small modifier on linked entity.' :
                                 'Minor. No engine effect.'
            }>
              <div style={{
                padding: '4px 8px', border: `1px solid ${BORDER}`, borderRadius: R.sm,
                fontSize: FS.xs, fontFamily: sans, color: INK, minWidth: 180,
                background: swatch['#FAF8F4'], fontWeight: 700,
                textTransform: 'capitalize', display: 'flex', alignItems: 'center',
              }}>
                {imp}
              </div>
            </Field>
          );
        })()}

        {(type === 'ADD_NPC' || type === 'ASSIGN_NPC_TO_ROLE') && (() => {
          // ASSIGN into a known institution: roles come from that institution's
          // catalogue (you can only fill seats it offers), and importance +
          // influence derive from the chosen role. ADD_NPC (inventing a person)
          // and ASSIGN with no institution keep free text.
          const inst = (type === 'ASSIGN_NPC_TO_ROLE' && institutionId)
            ? (settlement.institutions || []).find(i => String(i.id || i.name) === String(institutionId))
            : null;
          const roleOpts = inst ? rolesForInstitution(inst) : [];
          if (roleOpts.length > 0) {
            const derivedImp = importanceForRole(role, roleOpts);
            return (
              <Field label="Role" hint={role ? `Importance: ${derivedImp}` : 'Roles available at this institution'}>
                <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle}>
                  <option value="">, Pick a role -</option>
                  {roleOpts.map(r => <option key={r.role} value={r.role}>{r.role}</option>)}
                </select>
              </Field>
            );
          }
          return (
            <Field label="Role" hint="e.g. High Priestess, Watch Captain">
              <input value={role} onChange={e => setRole(e.target.value)} placeholder="optional" style={inputStyle} />
            </Field>
          );
        })()}

        {(type === 'ADD_NPC' || type === 'ASSIGN_NPC_TO_ROLE') && institutionOptions.length > 0 && (
          <Field label="Institution" hint="link this NPC to an institution">
            <select value={institutionId} onChange={e => setInstitutionId(e.target.value)} style={selectStyle}>
              <option value="">, None</option>
              {institutionOptions.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </Field>
        )}

        {type === 'ASSIGN_NPC_TO_ROLE' && (
          <Field label="Quality" hint={
            quality === 'popular'           ? 'High legitimacy boost'   :
            quality === 'competent'         ? 'Solid capacity recovery' :
            quality === 'weak'              ? 'Minimal recovery'        :
            quality === 'corrupt'           ? 'Capacity up, legitimacy hit' :
                                              'Faction-controlled appointment'
          }>
            <select value={quality} onChange={e => setQuality(e.target.value)} style={selectStyle}>
              <option value="weak">Weak</option>
              <option value="competent">Competent</option>
              <option value="popular">Popular</option>
              <option value="corrupt">Corrupt</option>
              <option value="faction_captured">Faction-captured</option>
            </select>
          </Field>
        )}

        {(type === 'IMPAIR_INSTITUTION' || type === 'IMPAIR_FACTION') && (
          <span style={{ fontSize: FS.xxs, fontStyle: 'italic', color: MUTED, opacity: 0.85, alignSelf: 'center', maxWidth: 240, lineHeight: 1.4 }}>
            Applies a standard setback. Pick the target and (optionally) note what happened.
          </span>
        )}

        <Field label="Description" hint="optional">
          <input value={description} onChange={e => setDesc(e.target.value)} placeholder="e.g. burned during a brawl" style={inputStyle} />
        </Field>

        {/* §8 M3b — party attribution. A canonical "the party did this" flag. */}
        <label
          title="Mark this change as a direct result of the party's actions. In a canon campaign it also ripples through the world."
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-end',
            padding: '5px 9px', borderRadius: R.sm, cursor: 'pointer',
            border: `1px solid ${partyCaused ? PARTY : BORDER}`,
            background: partyCaused ? PARTY_BG : 'transparent',
            color: partyCaused ? PARTY : MUTED, fontSize: FS.xs, fontFamily: sans, fontWeight: 700,
          }}
        >
          <input
            type="checkbox"
            checked={partyCaused}
            onChange={e => setPartyCaused(e.target.checked)}
            style={{ margin: 0 }}
          />
          Caused by the party
        </label>
      </div>

      <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.sm }}>
        <button onClick={onPreview} disabled={!canSubmit} style={primaryBtn(!canSubmit)}>
          Preview
        </button>
        <button
          onClick={() => { setStaged(prev => [...prev, buildEvent()]); setTarget(''); setDesc(''); setPartyCaused(false); setSwapWithNpcId(''); setCustomResourceName(''); }}
          disabled={!canSubmit}
          style={{
            padding: '5px 12px', background: 'transparent', color: GOLD,
            border: `1px solid ${GOLD}`, borderRadius: R.sm,
            fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
            cursor: canSubmit ? 'pointer' : 'not-allowed', opacity: canSubmit ? 1 : 0.5,
          }}
        >
          + Add to batch
        </button>
        {pendingPreview && (() => {
          const isDestroy = pendingPreview.event?.type === 'DESTROY_SETTLEMENT';
          const destroyOk = !isDestroy || destroyConfirm.trim() === (settlement?.name || '').trim();
          return (
            <>
              {isDestroy && (
                <div style={{ width: '100%', marginTop: 6, padding: '8px 10px', border: `1px solid ${swatch.danger}`, borderRadius: R.sm, background: swatch.dangerBg }}>
                  <div style={{ fontSize: FS.xs, fontWeight: 800, color: swatch.danger, marginBottom: 5, lineHeight: 1.4 }}>
                    ⚠ This destroys {settlement?.name || 'the settlement'} — services go dark, institutions are impaired, and partner relationships sour. Recoverable, but only by deliberate action.
                  </div>
                  <input
                    value={destroyConfirm}
                    onChange={(e) => setDestroyConfirm(e.target.value)}
                    placeholder={`Type "${settlement?.name || ''}" to confirm`}
                    style={{ width: '100%', padding: '5px 8px', border: `1px solid ${swatch.danger}`, borderRadius: 4, fontSize: FS.sm, fontFamily: sans, color: INK, background: CARD, boxSizing: 'border-box' }}
                  />
                </div>
              )}
              <button onClick={onApply} disabled={!destroyOk} style={{ ...confirmBtn, ...(isDestroy ? { background: swatch.danger, borderColor: swatch.danger } : {}), opacity: destroyOk ? 1 : 0.5, cursor: destroyOk ? 'pointer' : 'not-allowed' }}>
                <Check size={11} /> {isDestroy ? 'Destroy settlement' : (phase === 'canon' ? 'Apply to Timeline' : 'Apply')}
              </button>
              <button onClick={() => { dismissPreview(); setDestroyConfirm(''); }} style={cancelBtn}>
                <X size={11} /> Cancel
              </button>
            </>
          );
        })()}
      </div>

      {pendingPreview && <PreviewPanel preview={pendingPreview} />}

      {staged.length > 0 && (
        <BatchCart
          staged={staged}
          settlement={settlement}
          phase={phase}
          pendingBatchPreview={pendingBatchPreview}
          onRemove={(i) => setStaged(prev => prev.filter((_, idx) => idx !== i))}
          onClear={() => { setStaged([]); dismissBatchPreview(); }}
          onPreview={() => previewBatch(staged)}
          onApply={() => { const r = applyBatch(staged); if (r?.ok) setStaged([]); }}
        />
      )}

      {/* Roster & Tune was removed (owner decision, 2026-06-11): its four
          sections were redundant — or worse — next to the event catalog.
          Stressors wrote bare stress entries (no condition, no roaming twin),
          Resources wrote resourceAnalysis.availableResources (a surface the
          chains never read; the events write the real config keys), Trade
          Goods duplicated the ADD/REMOVE_TRADE_GOOD events without
          provenance, and post-generation priority re-tuning is premise
          editing that canon changes should not do (the pre-generation
          sliders live on in the Configuration panel). Institutions made the
          same exit earlier: one place to author a change, not two. */}
    </div>
  );
}

function PreviewPanel({ preview }) {
  if (!preview) return null;
  const { deltas, factionResponses, narrativeSummary, warnings } = preview;
  const partyCaused = !!(preview.event?.partyCaused || preview.event?.cause === 'party_action');
  return (
    <div style={{
      marginTop: SP.sm, padding: SP.sm,
      background: CARD, border: `1px solid ${GOLD}`, borderRadius: R.sm,
    }}>
      {partyCaused && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 6,
          padding: '2px 8px', borderRadius: 999,
          background: PARTY_BG, color: PARTY, border: `1px solid ${PARTY}`,
          fontSize: FS.xxs, fontFamily: sans, fontWeight: 800, letterSpacing: '0.04em',
        }}>
          ⚔ Party-caused
        </div>
      )}
      <div style={{ fontSize: FS.sm, fontFamily: sans, color: INK, fontWeight: 700, marginBottom: 4 }}>
        {narrativeSummary || 'Preview'}
      </div>
      {warnings?.length > 0 && (
        <ul style={{ margin: '4px 0', paddingLeft: 18, color: swatch.danger, fontSize: FS.xs, fontFamily: sans }}>
          {warnings.map((w, i) => <li key={i}>{w.message}</li>)}
        </ul>
      )}
      {deltas?.length > 0 && (
        <div style={{ marginTop: 6 }}>
          {deltas.map((d, i) => <DeltaRow key={i} d={d} />)}
        </div>
      )}
      {factionResponses?.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{
            fontSize: FS.xxs, color: MUTED, fontWeight: 800, fontFamily: sans,
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4,
          }}>
            Faction responses
          </div>
          {factionResponses.map((r, i) => (
            <div key={i} style={{
              fontSize: FS.xs, fontFamily: sans, color: INK, lineHeight: 1.5, marginBottom: 4,
            }}>
              <strong style={{ color: GOLD }}>{r.factionName}:</strong> {r.response}
              {r.hookSeed && (
                <div style={{ color: SECOND, fontStyle: 'italic', marginTop: 2 }}>
                  Hook seed: {r.hookSeed}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeltaRow({ d }) {
  const arrow = d.change > 0 ? '↑' : '↓';
  const sevColor = d.severity === 'major' ? '#8b1a1a' : d.severity === 'moderate' ? '#a0762a' : MUTED;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: FS.xs, fontFamily: sans, color: INK, lineHeight: 1.5,
    }}>
      <span style={{ color: sevColor, fontWeight: 800, minWidth: 12 }}>{arrow}</span>
      <span>{d.explanation}</span>
      <span style={{ color: MUTED, marginLeft: 'auto' }}>
        {d.before} → {d.after}
      </span>
    </div>
  );
}

function labelOfTarget(targetId) {
  const tail = String(targetId || '').split('.').pop();
  return tail.replace(/_/g, ' ');
}

/**
 * BatchCart — the staging area for "multiple simultaneous changes". Lists the
 * staged events, surfaces blocking cross-reference warnings live (a change
 * that targets an entity neither in the settlement nor earlier in the batch),
 * and offers one Preview + one Apply for the whole set.
 */
function BatchCart({ staged, settlement, phase, pendingBatchPreview, onRemove, onClear, onPreview, onApply }) {
  const validation = validateBatch(settlement, staged);
  const blocks = (validation.warnings || []).filter(w => w.severity === 'block');
  return (
    <div style={{
      marginTop: SP.sm, padding: SP.sm,
      background: swatch['#FAF8F4'], border: `1px solid ${GOLD}`, borderRadius: R.sm,
    }}>
      <div style={{
        fontSize: FS.xs, fontWeight: 800, color: MUTED, fontFamily: sans,
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs,
      }}>
        Staged changes ({staged.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {staged.map((e, i) => (
          <div key={e.id || i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: FS.xs, fontFamily: sans, color: INK }}>
            <span style={{ fontWeight: 700, minWidth: 16, color: GOLD }}>{i + 1}.</span>
            <span style={{ flex: 1 }}>
              {EVENT_REGISTRY[e.type]?.label || e.type}{e.targetId ? `: ${labelOfTarget(e.targetId)}` : ''}
            </span>
            <button onClick={() => onRemove(i)} title="Remove" style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 2, display: 'flex' }}>
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      {blocks.length > 0 && (
        <ul style={{ margin: '6px 0 0', paddingLeft: 16, color: swatch.danger, fontSize: FS.xxs, fontFamily: sans }}>
          {blocks.map((w, i) => <li key={i}>{w.message}</li>)}
        </ul>
      )}
      {pendingBatchPreview?.systemStateDeltas?.length > 0 && (
        <div style={{ marginTop: 6 }}>
          {pendingBatchPreview.systemStateDeltas.map((d, i) => <DeltaRow key={i} d={d} />)}
        </div>
      )}
      <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.sm }}>
        <button onClick={onPreview} style={primaryBtn(false)}>Preview batch</button>
        <button
          onClick={onApply}
          disabled={blocks.length > 0}
          style={{ ...confirmBtn, opacity: blocks.length > 0 ? 0.5 : 1, cursor: blocks.length > 0 ? 'not-allowed' : 'pointer' }}
        >
          <Check size={11} /> {phase === 'canon' ? `Apply ${staged.length} to timeline` : `Apply all (${staged.length})`}
        </button>
        <button onClick={onClear} style={cancelBtn}>Clear</button>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: FS.xxs, fontFamily: sans, color: MUTED }}>
      {label}
      {children}
      {hint && <span style={{ fontStyle: 'italic', color: MUTED, opacity: 0.7 }}>{hint}</span>}
    </label>
  );
}

// Party-attribution accent — a heraldic crimson, distinct from the gold brand
// accent and the purple AI-narrative tint, so "the party did this" reads clearly.
const PARTY = '#8a2f4a';
const PARTY_BG = '#f7ebf0';

// APPLY_STRESSOR severity words → engine severity. Words at the table,
// numbers in the engine (same posture as the hidden impair sliders).
const STRESSOR_SEVERITY_VALUES = Object.freeze({ minor: 0.35, moderate: 0.6, severe: 0.85 });

// ADD_RESOURCE — sentinel select value for "name a custom resource"; the real
// target comes from the companion text input while this is picked.
const CUSTOM_RESOURCE_OPTION = '__custom_resource__';

const inputStyle = {
  padding: '4px 8px', border: `1px solid ${BORDER}`, borderRadius: R.sm,
  fontSize: FS.xs, fontFamily: sans, color: INK, minWidth: 180, background: '#fff',
};
const selectStyle = { ...inputStyle, minWidth: 180 };
const pickedChipStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4,
  padding: '3px 8px', border: `1px solid ${GOLD}`, borderRadius: R.sm,
  fontSize: FS.xs, fontFamily: sans, color: INK, fontWeight: 700, background: swatch['#FAF8F4'],
};
const chipClearBtn = {
  background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 0, display: 'flex', lineHeight: 1,
};

function primaryBtn(disabled) {
  return {
    padding: '5px 12px',
    background: disabled ? '#eee' : GOLD,
    color: disabled ? '#999' : '#fff',
    border: 'none', borderRadius: R.sm,
    fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}
const confirmBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '5px 12px', background: '#1a5a28', color: '#fff',
  border: 'none', borderRadius: R.sm,
  fontSize: FS.xs, fontWeight: 700, fontFamily: sans, cursor: 'pointer',
};
const cancelBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '5px 12px', background: '#fff', color: INK,
  border: `1px solid ${BORDER}`, borderRadius: R.sm,
  fontSize: FS.xs, fontWeight: 700, fontFamily: sans, cursor: 'pointer',
};
