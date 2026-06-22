/**
 * EventComposer — Pick an event, optionally preview, then apply.
 *
 * Available in both phases. In draft mode the same engine runs but
 * nothing is logged ("see what would happen"). In canon mode applying
 * adds a timeline entry. The store handlers gate the log persistence;
 * this UI is identical in both modes. Preview is a look-ahead, not a
 * gate — Apply is always offered. On a narrated save, a successful
 * apply raises the StaleNarrativeModal (the prose no longer matches).
 */

import { useState, useMemo } from 'react';
import { X, Check } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { EVENT_REGISTRY } from '../../domain/events/registry.js';
import { inferImportance } from '../../domain/entities/npcs.js';
import { rolesForInstitution, importanceForRole, influenceForImportance } from '../../domain/roles/roleCatalog.js';
import { factionCompendium } from '../../domain/factions/factionCatalog.js';
import { buildInstitutionCatalog } from '../../domain/institutions/institutionCatalog.js';
import { buildStressorPickerItems } from '../../domain/stressorPicker.js';
import { RULING_POWER_CAUSES, governingFactionOf } from '../../domain/rulingPower.js';
import { EXPORT_GOODS_BY_TIER } from '../../data/tradeGoodsData.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { institutionHasTag, TAG } from '../../lib/entities.js';
import StaleNarrativeModal from '../StaleNarrativeModal.jsx';
import { INK, MUTED, BORDER, CARD, sans, FS, SP, R, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { buildTargetOptions, labelOfTarget, PARTY, PARTY_BG } from './eventComposer/helpers.js';
import { PreviewPanel } from './eventComposer/PreviewPanel.jsx';
import { BatchCart } from './eventComposer/BatchCart.jsx';
import { Field } from './eventComposer/Field.jsx';
import { EventComposerTargetField } from './eventComposer/EventComposerTargetField.jsx';
import {
  RELATIONSHIP_OPTIONS, RELATIONSHIP_LABELS,
  NON_AUTHORABLE_EVENTS, STRESSOR_SEVERITY_VALUES, CUSTOM_RESOURCE_OPTION,
  inputStyle, selectStyle,
} from './eventComposer/EventComposerConstants.js';

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
  // Staleness wiring: a committed change on a NARRATED save makes the AI
  // prose out of date, so a successful apply raises StaleNarrativeModal.
  // Boolean selector — the narrative blobs are large and we only need "is
  // there one". Nothing can go stale on a raw (never-narrated) save.
  const narrated = useStore(s => !!(s.aiSettlement || s.aiDailyLife));

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
  const [staleNotice, setStaleNotice] = useState(null);        // post-apply "narrative is now stale" modal: null | { label }
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
  // Narrow deps to exactly what factionCompendium reads (powerStructure.factions
  // with a top-level factions fallback) so this catalog doesn't recompute on
  // every unrelated settlement re-allocation in edit mode.
  const factionGroups = useMemo(
    () => factionCompendium(settlement),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settlement?.powerStructure?.factions, settlement?.factions],
  );
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
    // Narrow deps to what this reads — the faction list + which one is seated.
    // governingFactionOf keys off the per-faction `f.isGoverning` flag FIRST,
    // then falls back to powerStructure.governingName. `isGoverning` lives on
    // objects inside the factions array, so the `factions` reference dep already
    // covers it: every seat change is an immutable update that mints a fresh
    // array (and fresh faction objects), re-running this memo. governingName is
    // listed for the fallback path.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settlement?.powerStructure?.factions, settlement?.powerStructure?.governingName]);
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
    // the user previewed) over building a new event. Apply no longer
    // requires a preview (preview is an optional look-ahead, not a gate),
    // so applyEvent(buildEvent()) is the normal path whenever the user
    // applies directly.
    const entry = pendingPreview?.event
      ? applyPendingPreview()
      : applyEvent(buildEvent());
    setTarget('');
    setDesc('');
    setPartyCaused(false);
    setDestroyConfirm('');
    setSwapWithNpcId('');
    setCustomResourceName('');
    // Post-apply staleness notice: the event committed (and stays committed
    // regardless of what the modal answers) — on a narrated save the AI
    // prose was written against the previous state, so offer regenerate /
    // continue-with-raw. Raw saves have nothing to go stale. A clock-bound
    // settlement only QUEUED the event (entry.queued) — nothing changed yet,
    // so the narrative isn't stale until the next World Pulse resolves it.
    if (entry && !entry.queued && narrated) {
      setStaleNotice({ label: EVENT_REGISTRY[evType]?.label || evType });
    }
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
        Make Changes
      </div>
      <div style={{ fontSize: FS.xxs, fontFamily: sans, color: MUTED, marginTop: -2, marginBottom: SP.sm, lineHeight: 1.4 }}>
        {phase === 'canon'
          ? 'In-world events write to the campaign timeline.'
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

        <EventComposerTargetField
          type={type}
          target={target}
          setTarget={setTarget}
          spec={spec}
          settlement={settlement}
          setAddCategory={setAddCategory}
          setStressorPick={setStressorPick}
          stressorPick={stressorPick}
          setCustomResourceName={setCustomResourceName}
          customResourceName={customResourceName}
          setSwapWithNpcId={setSwapWithNpcId}
          swapWithNpcId={swapWithNpcId}
          institutionCatalogItems={institutionCatalogItems}
          institutionCategories={institutionCategories}
          stressorPickerItems={stressorPickerItems}
          rulingPowerOptions={rulingPowerOptions}
          factionGroups={factionGroups}
          tradeGoodSuggestions={tradeGoodSuggestions}
          resourceCatalogOptions={resourceCatalogOptions}
          npcSwapGroups={npcSwapGroups}
        />

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
                This settlement has no criminal organization. Add one (e.g. a Thieves&rsquo; Guild) before imposing corruption.
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
          <Field label="Handling" hint={tradeEntrepot ? 'Re-exported through the warehouses, listed as (transit)' : 'Produced locally'}>
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
            stressorSeverity === 'severe' ? 'A defining crisis; expect cascades' :
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
            powerCause === 'election'   ? 'A fresh mandate. Legitimacy starts warmer' :
            powerCause === 'conquest'   ? 'Imposed from outside. Legitimacy starts cold' :
            powerCause === 'succession' ? 'The line held; the household reorders' :
            powerCause === 'appointment'? 'Installed by a higher authority' :
                                          'Seized by force. Loyalties re-sworn at swordpoint'
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
              <input value={role} onChange={e => setRole(e.target.value)} placeholder="optional" aria-label="Role" style={inputStyle} />
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
          <input value={description} onChange={e => setDesc(e.target.value)} placeholder="e.g. burned during a brawl" aria-label="Description" style={inputStyle} />
        </Field>

        {/* §8 M3b — party attribution. A canonical "the party did this" flag. */}
        <label
          htmlFor="event-party-caused"
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
            id="event-party-caused"
            type="checkbox"
            checked={partyCaused}
            onChange={e => setPartyCaused(e.target.checked)}
            aria-label="Caused by the party"
            style={{ margin: 0 }}
          />
          Caused by the party
        </label>
      </div>

      <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.sm }}>
        <Button variant="primary" size="sm" onClick={onPreview} disabled={!canSubmit}>
          Preview
        </Button>
        {(() => {
          // Apply is always offered — preview is an optional look-ahead, not
          // a gate. With a preview pending, Apply commits exactly the
          // previewed event (audit invariant); without one it applies the
          // form as built, so it honors the same canSubmit rule as Preview.
          // The Destroy confirm gate follows the event that would actually
          // apply (the previewed one if pending, else the picked type).
          const isDestroy = (pendingPreview?.event?.type || type) === 'DESTROY_SETTLEMENT';
          const destroyOk = !isDestroy || destroyConfirm.trim() === (settlement?.name || '').trim();
          const applyOk = destroyOk && (pendingPreview ? true : canSubmit);
          return (
            <>
              {isDestroy && (
                <div style={{ width: '100%', marginTop: 6, padding: '8px 10px', border: `1px solid ${swatch.danger}`, borderRadius: R.sm, background: swatch.dangerBg }}>
                  <div style={{ fontSize: FS.xs, fontWeight: 800, color: swatch.danger, marginBottom: 5, lineHeight: 1.4 }}>
                    ⚠ This destroys {settlement?.name || 'the settlement'}. Services go dark, institutions are impaired, and partner relationships sour. Recoverable only by deliberate action.
                  </div>
                  <input
                    value={destroyConfirm}
                    onChange={(e) => setDestroyConfirm(e.target.value)}
                    placeholder={`Type "${settlement?.name || ''}" to confirm`}
                    aria-label="Type the settlement name to confirm destruction"
                    style={{ width: '100%', padding: '5px 8px', border: `1px solid ${swatch.danger}`, borderRadius: 4, fontSize: FS.sm, fontFamily: sans, color: INK, background: CARD, boxSizing: 'border-box' }}
                  />
                </div>
              )}
              <Button
                variant={isDestroy ? 'danger' : 'success'}
                size="sm"
                icon={<Check size={11} />}
                onClick={onApply}
                disabled={!applyOk}
              >
                {isDestroy ? 'Destroy settlement' : (phase === 'canon' ? 'Apply to Timeline' : 'Apply')}
              </Button>
              {pendingPreview && (
                <Button variant="secondary" size="sm" icon={<X size={11} />} onClick={() => { dismissPreview(); setDestroyConfirm(''); }}>
                  Cancel
                </Button>
              )}
            </>
          );
        })()}
        <Button
          variant="gold"
          size="sm"
          onClick={() => { setStaged(prev => [...prev, buildEvent()]); setTarget(''); setDesc(''); setPartyCaused(false); setSwapWithNpcId(''); setCustomResourceName(''); }}
          disabled={!canSubmit}
        >
          + Add to batch
        </Button>
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
          onApply={() => {
            const r = applyBatch(staged);
            if (r?.ok) {
              // One staleness notice for the whole batch — the modal fires
              // once per apply click, never once per staged event. Skip it when
              // the batch only queued (clock-bound): nothing changed yet.
              if (narrated && !r.queuedOnly) setStaleNotice({ label: `${staged.length} changes` });
              setStaged([]);
            }
          }}
        />
      )}

      <StaleNarrativeModal
        open={!!staleNotice}
        changeLabel={staleNotice?.label}
        onClose={() => setStaleNotice(null)}
      />

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
