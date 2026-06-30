/**
 * EventComposer — Pick an event, optionally preview, then stage it.
 *
 * Available in both phases. In draft mode the same engine runs but
 * nothing is logged ("see what would happen"). In canon mode the staged
 * event adds a timeline entry when the queue commits. Preview is a
 * look-ahead, not a gate — Apply is always offered.
 *
 * Apply no longer commits immediately: it STAGES the assembled event in the
 * per-settlement change-queue (ChangeQueuePanel above). The queue's
 * "Save N changes" replays each order through the same applyEvent path and
 * persists atomically, then soft-refreshes the dossier. The post-commit
 * staleness notice fires from that commit seam (SettlementDetail), not here.
 */

import { useState, useMemo } from 'react';
import { X, Check } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { EVENT_REGISTRY } from '../../domain/events/registry.js';
import { rolesForInstitution, importanceForRole } from '../../domain/roles/roleCatalog.js';
import { factionCompendium } from '../../domain/factions/factionCatalog.js';
import { buildInstitutionCatalog } from '../../domain/institutions/institutionCatalog.js';
import { buildStressorPickerItems } from '../../domain/stressorPicker.js';
import { deriveOnsetSeverity } from '../../domain/state/deriveStressorSeverity.js';
import { WAR_STRESSOR_TYPES, INFILTRATION_STRESSOR_TYPES } from '../../domain/worldPulse/warStressorTypes.js';
import { governingFactionOf } from '../../domain/rulingPower.js';
import { EXPORT_GOODS_BY_TIER } from '../../data/tradeGoodsData.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { institutionHasTag, TAG } from '../../lib/entities.js';
import { INK, MUTED, BORDER, CARD, sans, FS, SP, R, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { campaignPeerOptions, PARTY, PARTY_BG } from './eventComposer/helpers.js';
import { PreviewPanel } from './eventComposer/PreviewPanel.jsx';
import { BatchCart } from './eventComposer/BatchCart.jsx';
import { Field } from './eventComposer/Field.jsx';
import { EventComposerTargetField } from './eventComposer/EventComposerTargetField.jsx';
import { EventComposerRelationshipExtras } from './eventComposer/EventComposerRelationshipExtras.jsx';
import { EventComposerTierField, clampTierDirection } from './eventComposer/EventComposerTierField.jsx';
import { EventComposerCorruptionFields } from './eventComposer/EventComposerCorruptionFields.jsx';
import { EventComposerDeityField, canStageDeityEvent } from './eventComposer/EventComposerDeityField.jsx';
import { EventComposerSecondaryFields } from './eventComposer/EventComposerSecondaryFields.jsx';
import { EventComposerLinkNeighbourField, linkableSiblings } from './eventComposer/EventComposerLinkNeighbourField.jsx';
import { buildEvent as assembleEvent } from './eventComposer/buildEvent.js';
import { AddNpcTraitFields } from './eventComposer/AddNpcTraitFields.jsx';
import {
  RELATIONSHIP_OPTIONS, RELATIONSHIP_LABELS,
  NON_AUTHORABLE_EVENTS, CUSTOM_RESOURCE_OPTION,
  inputStyle, selectStyle,
} from './eventComposer/EventComposerConstants.js';

// onLink (= SettlementDetail's handleLink) is threaded in only so the folded
// "Link a neighbour" dropdown entry can reuse the exact link cascade (stage a
// `link` order standalone / full applyLink clock-bound). When it is absent the
// LINK_NEIGHBOUR entry simply does not appear.
export default function EventComposer({ onLink = null }) {
  const phase     = useStore(s => s.phase);
  const settlement = useStore(s => s.settlement);
  const previewEvent = useStore(s => s.previewEvent);
  const dismissPreview = useStore(s => s.dismissPreview);
  const pendingPreview = useStore(s => s.pendingPreview);
  const previewBatch   = useStore(s => s.previewEventBatch);
  const pendingBatchPreview = useStore(s => s.pendingBatchPreview);
  const dismissBatchPreview = useStore(s => s.dismissBatchPreview);
  // Change-queue wiring: Apply now STAGES the assembled event (it commits at the
  // queue's "Save N changes", not on this click). The event is built exactly as
  // before so the committed event is byte-identical to a direct apply. The
  // post-commit staleness notice moves to ChangeQueuePanel's commit seam
  // (SettlementDetail.onQueueCommitted) — nothing mutates on this click.
  const queueChange = useStore(s => s.queueChange);
  // Scope (Phase 4a — STANDALONE only): the change-queue stages ONLY for
  // non-clock-bound settlements. A clock-bound canon campaign member surrenders
  // its timeline to the world pulse — applyEvent there redirects the event into
  // the pulse queue, so staging it on the (hidden) change-queue would let a
  // staged event silently redirect. For those, Apply commits IMMEDIATELY through
  // applyEvent (which performs the world-pulse redirect), exactly as before the
  // change-queue existed. The campaign queue path is Phase 4b.
  const applyEvent = useStore(s => s.applyEvent);
  const isSettlementClockBound = useStore(s => s.isSettlementClockBound);
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
  // ADD_NPC descriptive traits — free text, optional. These mirror exactly what
  // the NPC read card shows (npcComponents NPCInlineCard via normalizeNpcTraits):
  // flaw, temperament (personality.dominant), goal, constraint, secret. Without
  // them an authored NPC rendered those rows empty.
  const [npcFlaw, setNpcFlaw] = useState(''), [npcTemperament, setNpcTemperament] = useState('');
  const [npcGoals, setNpcGoals] = useState(''), [npcConstraint, setNpcConstraint] = useState('');
  const [npcSecret, setNpcSecret] = useState('');
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
  const [corruptScope, setCorruptScope] = useState('individual'); // IMPOSE_CORRUPTION: individual | individual_institution
  const [stressorPick, setStressorPick] = useState(null);     // APPLY_STRESSOR: the picked catalog item
  // APPLY_STRESSOR severity is no longer DM-picked: the onset's hardness is a
  // CONSEQUENCE of the settlement's preexisting pressure, derived in the domain
  // (deriveStressorSeverity) when the composer omits it. No state, no dropdown.
  const [powerCause, setPowerCause] = useState('coup');       // CHANGE_RULING_POWER: how power changes hands
  const [tradeDirection, setTradeDirection] = useState('export'); // ADD_TRADE_GOOD: export | import
  const [tradeEntrepot, setTradeEntrepot] = useState(false);   // ADD_TRADE_GOOD: transit through the warehouses
  const [customResourceName, setCustomResourceName] = useState(''); // ADD_RESOURCE: free-text custom name
  const [swapWithNpcId, setSwapWithNpcId] = useState('');      // PROMOTE_NPC / DEMOTE_NPC: the same-faction counterpart
  const [tierDirection, setTierDirection] = useState('promotion'); // SHIFT_TIER: promote up / demote down one tier
  // SET_PRIMARY_DEITY / IMPOSE_CULT (the folded "Patron & Cults" card). deityMode is
  // 'assign' (pick a deity ref) or 'remove' (clear the patron / drop a named cult).
  const [deityRef, setDeityRef] = useState('');
  const [deityMode, setDeityMode] = useState('assign');
  const [cultRemoveRef, setCultRemoveRef] = useState('');
  // LINK_NEIGHBOUR (the folded "Link a neighbour" card): pick a partner save + a
  // relationship; Apply delegates to onLink (handleLink), never to applyEvent.
  const [partnerSaveId, setPartnerSaveId] = useState('');
  const [linkRelType, setLinkRelType] = useState('neutral');
  const hasNeighbours = (settlement?.neighbourNetwork?.length || settlement?.neighbourLinks?.length || 0) > 0;
  const [addCategory, setAddCategory] = useState('');          // ADD_INSTITUTION: category of the picked catalog item
  const customContent = useStore(s => s.customContent);
  // Premium gate for deity authoring/assignment (the simulation is the gate), and
  // the purchase modal opener for the upsell — both consumed by EventComposerDeityField.
  const canUseCustom = useStore(s => (typeof s.canUseCustomContent === 'function' ? s.canUseCustomContent() : false));
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const [instigatorNeighbour, setInstigatorNeighbour] = useState(''); // #1 APPLY_STRESSOR: optional war instigator
  const [instigatorRelationship, setInstigatorRelationship] = useState('rival'); // #3 APPLY_STRESSOR (infiltrated): souring level
  const [tradeTarget, setTradeTarget] = useState('');          // #6 OPENED_TRADE_ROUTE: optional campaign-settlement target
  // #6 — the active campaign's OTHER settlements (so a trade route can open with
  // any campaign member, not only a pre-linked neighbour); see campaignPeerOptions.
  const activeSaveId = useStore(s => s.activeSaveId);
  // True when this settlement is bound to a canonized campaign clock: Apply then
  // commits immediately (world-pulse redirect) instead of staging on the queue.
  const clockBound = !!(activeSaveId != null && typeof isSettlementClockBound === 'function' && isSettlementClockBound(activeSaveId));
  const campaigns = useStore(s => s.campaigns);
  const savedSettlements = useStore(s => s.savedSettlements);
  // A clock-bound member's Apply lands on the world pulse; while that campaign's
  // advance is in flight the store no-ops the write (the advance replaces worldState
  // wholesale and would clobber it). Surface that here so the form DISABLES submit
  // and shows why, instead of silently swallowing a GM action with no recovery.
  // Subscribe to the advanceInFlight LIST itself (not the stable isAdvanceInFlight fn
  // ref) so the disable + hint re-render the instant an advance starts or ends — same
  // membership test the store uses.
  const advanceInFlightList = useStore(s => s.advanceInFlight);
  const boundCampaign = useMemo(() => (clockBound ? campaigns.find(c => (c.settlementIds || []).some(id => String(id) === String(activeSaveId))) : null), [clockBound, campaigns, activeSaveId]);
  const advanceBusy = !!(boundCampaign && Array.isArray(advanceInFlightList) && advanceInFlightList.some(id => String(id) === String(boundCampaign.id)));
  const campaignSettlementOptions = useMemo(
    () => campaignPeerOptions(campaigns, savedSettlements, activeSaveId),
    [campaigns, savedSettlements, activeSaveId],
  );

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
  // EXPOSE_CORRUPTION only acts on a corrupt, not-yet-ousted NPC; the mutation
  // no-ops otherwise. Offer the action solely when there is such a target, so a
  // clean pick (or a free-typed name on an empty list) can never move the dials
  // and narrate with no real state behind it.
  const hasCorruptNpcs = useMemo(
    () => (settlement?.npcs || []).some(n => n?.corrupt === true && !n?.ousted),
    [settlement?.npcs],
  );
  // APPLY_STRESSOR onset severity is DERIVED from the settlement's preexisting
  // pressure, not picked at the table. Surface the derived word read-only so the
  // DM sees the consequence the state produces (the engine reads the number).
  const derivedOnset = useMemo(() => {
    const sev = deriveOnsetSeverity(settlement);
    const word = sev >= 0.7 ? 'critical' : sev >= 0.55 ? 'strained' : 'calm';
    return { sev, word };
  }, [settlement]);

  if (!settlement) return null;
  const spec = EVENT_REGISTRY[type];
  const needsTarget = !!spec?.requiresTarget;
  // LINK_NEIGHBOUR is a folded pseudo-event (not in EVENT_REGISTRY): it only
  // appears when an onLink handler is wired AND there is at least one other saved
  // settlement to link to. Apply delegates to onLink, so it is never previewed,
  // batched, or routed through buildEvent.
  const canLinkNeighbour = !!onLink && linkableSiblings(savedSettlements, settlement, activeSaveId).length > 0;
  const isLinkNeighbour = type === 'LINK_NEIGHBOUR';
  // ADD_RESOURCE's "Custom resource…" option holds the real target in the
  // companion text input; the swap events also need their counterpart picked.
  const effectiveTarget = type === 'ADD_RESOURCE' && target === CUSTOM_RESOURCE_OPTION
    ? customResourceName
    : target;
  // #6 — OPENED_TRADE_ROUTE is satisfied by EITHER a linked neighbour OR a
  // chosen campaign-settlement target, so the target requirement is met when
  // either is set.
  const resolvedTarget = (type === 'OPENED_TRADE_ROUTE' && tradeTarget.trim())
    ? tradeTarget.trim()
    : effectiveTarget;
  const canSubmit = (!needsTarget || resolvedTarget.trim().length > 0)
    && !((type === 'PROMOTE_NPC' || type === 'DEMOTE_NPC') && !swapWithNpcId)
    // Deity events: refuse a no-op or unseatable imposition before it can stage
    // (the same guards the setPrimaryDeity / imposeCult store actions enforce).
    && !((type === 'SET_PRIMARY_DEITY' || type === 'IMPOSE_CULT')
      && !canStageDeityEvent({ type, settlement, deityRef, deityMode, cultRemoveRef, customContent, canUseCustom }))
    // LINK_NEIGHBOUR needs a partner picked.
    && !(isLinkNeighbour && !partnerSaveId)
    // Block submit while this member's campaign is advancing — the store would no-op
    // the apply, and the composer lives on a different surface from the Advance button
    // so the two can be open at once.
    && !advanceBusy;
  // #1 — the optional instigator dropdown only makes sense for a WAR-type
  // stressor (siege / wartime / occupation / betrayal). Detect via the picked
  // catalog key (falling back to the free-typed target).
  const isWarStressor = type === 'APPLY_STRESSOR'
    && WAR_STRESSOR_TYPES.includes(String(stressorPick?.key || target || '').toLowerCase());
  // #3 — an INFILTRATION stressor likewise takes an optional instigator, but
  // sours the named neighbour to a lighter, DM-configurable relationship.
  const isInfiltrationStressor = type === 'APPLY_STRESSOR'
    && INFILTRATION_STRESSOR_TYPES.includes(String(stressorPick?.key || target || '').toLowerCase());

  // Derive a sensible institution list for the institution-pickers.
  const institutionOptions = (settlement.institutions || [])
    .map(i => ({ id: i.id || i.name, name: i.name || i.id }))
    .filter(o => o.id && o.name);

  // buildEvent (the per-type payload assembly) lives in eventComposer/buildEvent.js;
  // this thin closure threads the form state in so the parent stays under the ratchet.
  // SHIFT_TIER's direction is clamped to a legal move (clampTierDirection) so the
  // staged event matches what the Direction field shows (the handler also no-ops an
  // out-of-bounds shift, so a queue replay past the cap/floor stays harmless).
  function buildEvent() {
    return assembleEvent({
      type, target, effectiveTarget, settlement, phase,
      addCategory, severity, dimension,
      importance, role, institutionId,
      npcFlaw, npcTemperament, npcGoals, npcConstraint, npcSecret,
      quality, relationshipType, criminalOrg, criminalOrgs, corruptScope,
      stressorPick, powerCause,
      tradeDirection, tradeEntrepot, swapWithNpcId, tierDirection: clampTierDirection(settlement, tierDirection),
      customContent, deityRef, deityMode, cultRemoveRef,
      isWarStressor, isInfiltrationStressor, instigatorNeighbour, instigatorRelationship, tradeTarget,
      partyCaused, description,
    });
  }

  function onPreview() {
    previewEvent(buildEvent());
  }

  function onApply() {
    // LINK_NEIGHBOUR — delegate to onLink (handleLink), which stages the `link`
    // change-queue order for a standalone save or applies the full cascade
    // immediately for a clock-bound member. Never builds/stages an event.
    if (isLinkNeighbour) {
      const partner = (savedSettlements || []).find(s => String(s.id) === String(partnerSaveId));
      if (onLink && partner) onLink(partner, linkRelType);
      setPartnerSaveId('');
      setLinkRelType('neutral');
      return;
    }
    // §9c — Destroy Settlement is drastic + recoverable-only-by-effort, so it
    // requires typing the settlement name to confirm. Block apply until it matches.
    const evType = pendingPreview?.event?.type || type;
    if (evType === 'DESTROY_SETTLEMENT' && destroyConfirm.trim() !== (settlement?.name || '').trim()) return;
    // Build the event exactly as a direct apply would: prefer the previewed
    // event (the exact thing the DM saw) over re-building, preserving the
    // preview==apply byte-identity invariant. Then STAGE it instead of
    // committing — the queue's "Save N changes" runs the same applyEvent later.
    const builtEvent = pendingPreview?.event || buildEvent();
    if (activeSaveId) {
      const spec = EVENT_REGISTRY[evType];
      const humanLabel = (() => {
        try { return spec?.narrate?.(builtEvent, settlement) || spec?.label || evType; }
        catch { return spec?.label || evType; }
      })();
      // Clock-bound campaign member: apply immediately (applyEvent redirects to
      // the world-pulse queue). Standalone: stage on the change-queue.
      if (clockBound) applyEvent(builtEvent);
      else queueChange(activeSaveId, { type: 'event', humanLabel, payload: { event: builtEvent } });
      if (pendingPreview?.event) dismissPreview();
    }
    setTarget('');
    setDesc('');
    setPartyCaused(false);
    setDestroyConfirm('');
    setSwapWithNpcId('');
    setCustomResourceName('');
    setInstigatorNeighbour('');
    setInstigatorRelationship('rival');
    setTradeTarget('');
    setDeityRef('');
    setDeityMode('assign');
    setCultRemoveRef('');
    // The staleness notice moves to COMMIT time (nothing has mutated here yet —
    // see ChangeQueuePanel's onCommitted seam in SettlementDetail).
  }

  return (
    <div
      data-anchor="event-composer"
      id="event-composer"
      // Programmatic-focus target: the NextActionRail's "Apply an event" rung
      // enters edit mode then focuses this composer (it is otherwise unreachable
      // from the rail without a hunt down the Workshop). tabIndex={-1} makes the
      // container focusable without adding it to the natural tab order.
      tabIndex={-1}
      style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.md,
      padding: SP.sm, marginTop: SP.sm,
      outline: 'none',
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
          <select value={type} onChange={e => { const v = e.target.value; setType(v); setTarget(''); setAddCategory(''); setDestroyConfirm(''); setRelationshipType((RELATIONSHIP_OPTIONS[v] || [])[0] || ''); setCriminalOrg(''); setStressorPick(null); setPowerCause('coup'); setTradeDirection('export'); setTradeEntrepot(false); setCustomResourceName(''); setSwapWithNpcId(''); setRole(''); setInstitutionId(''); setNpcFlaw(''); setNpcTemperament(''); setNpcGoals(''); setNpcConstraint(''); setNpcSecret(''); setInstigatorNeighbour(''); setTradeTarget(''); setTierDirection('promotion'); setDeityRef(''); setDeityMode('assign'); setCultRemoveRef(''); setPartnerSaveId(''); setLinkRelType('neutral'); }} style={selectStyle}>
            {Object.entries(EVENT_REGISTRY)
              /* Hide non-authorable events from the DM action list (see
                 NON_AUTHORABLE_EVENTS): the folded leader event, the stressor-
                 equivalent events (authored via the Roster's Stressors), and
                 Damage Institution (redundant with Impair). All stay in the
                 registry for back-compat + world-engine simulation.
                 §9b/g/h — relationship events only appear when the settlement
                 has linked neighbours to act on. #6 — OPENED_TRADE_ROUTE is the
                 exception: it can target any OTHER campaign settlement, so it
                 also appears when the active save has campaign peers. */
              .filter(([k]) => !NON_AUTHORABLE_EVENTS.has(k))
              .filter(([k]) => !RELATIONSHIP_OPTIONS[k] || hasNeighbours
                || (k === 'OPENED_TRADE_ROUTE' && campaignSettlementOptions.length > 0))
              /* The standing swap needs two NPCs in one faction — hide the
                 single Promote/Demote NPC action when no faction has a pair to
                 swap. DEMOTE_NPC is hidden via NON_AUTHORABLE_EVENTS (folded in). */
              .filter(([k]) => k !== 'PROMOTE_NPC' || hasSwapPairs)
              /* Expose Corruption acts only on a corrupt NPC — hide it when the
                 settlement has none, so the action can never be a no-op. */
              .filter(([k]) => k !== 'EXPOSE_CORRUPTION' || hasCorruptNpcs)
              .map(([k, s]) => (
                <option key={k} value={k}>{s.label}</option>
              ))}
            {/* LINK_NEIGHBOUR — folded "Link a neighbour" card. A pseudo-event (no
                registry entry): shown only when an onLink handler is wired and a
                linkable sibling save exists. */}
            {canLinkNeighbour && <option value="LINK_NEIGHBOUR">Link a neighbour</option>}
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

        {/* SHIFT_TIER — promote or demote one size tier (the folded "Settlement
            Size" card). Only the legal move(s) appear. */}
        {type === 'SHIFT_TIER' && (
          <EventComposerTierField
            settlement={settlement}
            tierDirection={tierDirection}
            setTierDirection={setTierDirection}
          />
        )}

        {/* SET_PRIMARY_DEITY / IMPOSE_CULT — the folded "Patron & Cults" card. */}
        {(type === 'SET_PRIMARY_DEITY' || type === 'IMPOSE_CULT') && (
          <EventComposerDeityField
            type={type}
            settlement={settlement}
            customContent={customContent}
            canUseCustom={canUseCustom}
            setPurchaseModalOpen={setPurchaseModalOpen}
            deityRef={deityRef}
            setDeityRef={setDeityRef}
            deityMode={deityMode}
            setDeityMode={setDeityMode}
            cultRemoveRef={cultRemoveRef}
            setCultRemoveRef={setCultRemoveRef}
          />
        )}

        {/* LINK_NEIGHBOUR — the folded "Link a neighbour" card. */}
        {isLinkNeighbour && (
          <EventComposerLinkNeighbourField
            settlement={settlement}
            savedSettlements={savedSettlements}
            activeSaveId={activeSaveId}
            partnerSaveId={partnerSaveId}
            setPartnerSaveId={setPartnerSaveId}
            linkRelType={linkRelType}
            setLinkRelType={setLinkRelType}
          />
        )}

        {/* IMPOSE_CORRUPTION — which criminal organization corrupts the NPC, and how
            far the rot reaches (extracted to keep the composer under the ratchet) */}
        {type === 'IMPOSE_CORRUPTION' && (
          <EventComposerCorruptionFields
            criminalOrgs={criminalOrgs}
            criminalOrg={criminalOrg}
            setCriminalOrg={setCriminalOrg}
            corruptScope={corruptScope}
            setCorruptScope={setCorruptScope}
          />
        )}

        {/* ADD_TRADE_GOOD direction/handling, APPLY_STRESSOR onset, and
            CHANGE_RULING_POWER "how" — extracted to hold the line ratchet. */}
        <EventComposerSecondaryFields
          type={type}
          tradeDirection={tradeDirection}
          setTradeDirection={setTradeDirection}
          tradeEntrepot={tradeEntrepot}
          setTradeEntrepot={setTradeEntrepot}
          derivedOnset={derivedOnset}
          powerCause={powerCause}
          setPowerCause={setPowerCause}
          settlement={settlement}
          target={target}
        />

        {/* #1 war-stressor instigator + #6 trade-route campaign target — both
            optional, settlement-local relationship effects. */}
        <EventComposerRelationshipExtras
          type={type}
          settlement={settlement}
          isWarStressor={isWarStressor}
          isInfiltrationStressor={isInfiltrationStressor}
          instigatorNeighbour={instigatorNeighbour}
          setInstigatorNeighbour={setInstigatorNeighbour}
          instigatorRelationship={instigatorRelationship}
          setInstigatorRelationship={setInstigatorRelationship}
          tradeTarget={tradeTarget}
          setTradeTarget={setTradeTarget}
          campaignSettlementOptions={campaignSettlementOptions}
        />

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

        {/* ADD_NPC descriptive traits — the same flaw / temperament / goal /
            constraint / secret the NPC read card shows. All optional. */}
        {type === 'ADD_NPC' && (
          <AddNpcTraitFields
            flaw={npcFlaw} setFlaw={setNpcFlaw} temperament={npcTemperament} setTemperament={setNpcTemperament}
            goals={npcGoals} setGoals={setNpcGoals} constraint={npcConstraint} setConstraint={setNpcConstraint}
            secret={npcSecret} setSecret={setNpcSecret} />
        )}

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

      {advanceBusy && (
        <p style={{ margin: `${SP.sm}px 0 0`, fontSize: FS.xs, color: MUTED }}>
          The realm is advancing. Give it a moment, then apply this change.
        </p>
      )}

      <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.sm }}>
        {/* Link creation is a structural change-queue order, not a previewable
            event, so Preview is suppressed for it (Apply delegates to onLink). */}
        <Button variant="primary" size="sm" onClick={onPreview} disabled={!canSubmit || isLinkNeighbour}>
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
                {isDestroy ? 'Destroy settlement' : isLinkNeighbour ? 'Link a neighbour' : (phase === 'canon' ? 'Apply to Timeline' : 'Apply')}
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
          onClick={() => { setStaged(prev => [...prev, buildEvent()]); setTarget(''); setDesc(''); setPartyCaused(false); setSwapWithNpcId(''); setCustomResourceName(''); setInstigatorNeighbour(''); setTradeTarget(''); }}
          disabled={!canSubmit || isLinkNeighbour}
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
            // Batch apply now ENQUEUES one order per staged event (spec §2.2
            // option a). The flush replays each through applyEvent in order, so
            // forward references between staged events resolve exactly as the
            // old applyEventBatch's serial re-run did. Nothing commits here.
            if (activeSaveId) {
              for (const ev of staged) {
                const spec = EVENT_REGISTRY[ev?.type];
                const humanLabel = (() => {
                  try { return spec?.narrate?.(ev, settlement) || spec?.label || ev?.type; }
                  catch { return spec?.label || ev?.type; }
                })();
                // Clock-bound: apply each immediately (world-pulse redirect);
                // standalone: stage on the change-queue.
                if (clockBound) applyEvent(ev);
                else queueChange(activeSaveId, { type: 'event', humanLabel, payload: { event: ev } });
              }
            }
            dismissBatchPreview();
            setStaged([]);
          }}
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
