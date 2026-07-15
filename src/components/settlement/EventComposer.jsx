/**
 * EventComposer — Pick an event, optionally preview, then apply.
 *
 * Available in both phases. In draft mode the same engine runs but
 * nothing is logged ("see what would happen"). In canon mode applying
 * adds a timeline entry. The store handlers gate the log persistence;
 * this UI is identical in both modes. Preview is a look-ahead, not a
 * gate — Apply is always offered. On a narrated save, a successful
 * apply raises the StaleNarrativeModal (the prose no longer matches).
 *
 * The per-event-type inputs live in cohesive presentational modules under
 * ./eventComposer/*; all state lives here in the parent and threads down as
 * props, and event assembly is the pure ./eventComposer/buildEvent.js. The host
 * stays a thin orchestrator under the 600-line ratchet.
 */

import { useState, useMemo, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { AFFORDANCE_MANIFEST, authorableVerbs, criminalOrgOptions, vetoProse } from '../../domain/events/affordanceManifest.js';
import { eventStalenessKey } from '../../domain/events/stalenessKey.js';
// registryFull = registry + composer prose (description/targetPrompt) — see
// registryProse.js; registry.js alone carries only the eager pipeline fields.
import { EVENT_REGISTRY } from '../../domain/events/registryFull.js';
import { rolesForInstitution, importanceForRole } from '../../domain/roles/roleCatalog.js';
import { factionCompendium } from '../../domain/factions/factionCatalog.js';
import { buildInstitutionCatalog } from '../../domain/institutions/institutionCatalog.js';
import { buildStressorPickerItems } from '../../domain/stressorPicker.js';
import { GOODS_MODIFIERS_BY_TIER } from '../../data/tradeGoodsData.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { WAR_STRESSOR_TYPES, INFILTRATION_STRESSOR_TYPES } from '../../domain/worldPulse/warStressorTypes.js';
import StaleNarrativeModal from '../StaleNarrativeModal.jsx';
import { MUTED, BORDER, CARD, sans, FS, SP, R, swatch } from '../theme.js';
import { PARTY, PARTY_BG, campaignPeerOptions } from './eventComposer/helpers.js';
import { PreviewPanel } from './eventComposer/PreviewPanel.jsx';
import { BatchCart } from './eventComposer/BatchCart.jsx';
import { Field } from './eventComposer/Field.jsx';
import { EventComposerTargetField } from './eventComposer/EventComposerTargetField.jsx';
import { AddNpcTraitFields } from './eventComposer/AddNpcTraitFields.jsx';
import { EventComposerCorruptionFields } from './eventComposer/EventComposerCorruptionFields.jsx';
import { EventComposerSecondaryFields } from './eventComposer/EventComposerSecondaryFields.jsx';
import { EventComposerRelationshipExtras } from './eventComposer/EventComposerRelationshipExtras.jsx';
import { EventComposerTierField, clampTierDirection } from './eventComposer/EventComposerTierField.jsx';
import { EventComposerDeityField, canStageDeityEvent } from './eventComposer/EventComposerDeityField.jsx';
import { EventComposerLinkNeighbourField, linkableSiblings } from './eventComposer/EventComposerLinkNeighbourField.jsx';
import { ComposerNavigator } from './eventComposer/ComposerNavigator.jsx';
import { ApplyControls } from './eventComposer/ApplyControls.jsx';
import { buildEvent, mintComposeEventId } from './eventComposer/buildEvent.js';
import {
  RELATIONSHIP_OPTIONS, RELATIONSHIP_LABELS, CUSTOM_RESOURCE_OPTION,
  inputStyle, selectStyle,
} from './eventComposer/EventComposerConstants.js';

// onLink (= SettlementDetail's handleLink) is threaded in only so the folded
// LINK_NEIGHBOUR pseudo-event can delegate to the neighbour-link cascade. With no
// onLink handler wired the LINK_NEIGHBOUR entry simply does not appear — the whole
// feature ships dormant until the fenced SettlementDetail.jsx passes it through.
export default function EventComposer({ onLink = null }) {
  const phase     = useStore(s => s.phase);
  const settlement = useStore(s => s.settlement);
  const previewEvent = useStore(s => s.previewEvent);
  const applyEvent   = useStore(s => s.applyEvent);
  const dismissPreview = useStore(s => s.dismissPreview);
  const pendingPreview = useStore(s => s.pendingPreview);
  const previewBatch   = useStore(s => s.previewEventBatch);
  const applyBatch     = useStore(s => s.applyEventBatch);
  const pendingBatchPreview = useStore(s => s.pendingBatchPreview);
  const dismissBatchPreview = useStore(s => s.dismissBatchPreview);
  // Target-first / SuccessorPrompt injection (Composer V2 §4): an intent staged
  // from anywhere populates THIS form (the one source of truth), then clears.
  const composerIntent = useStore(s => s.composerIntent);
  const stageComposerIntent = useStore(s => s.stageComposerIntent);
  // Queued-vs-now (§5): clock-bound canon settlements queue to the next advance.
  const isClockBound = useStore(s => (typeof s.isSettlementClockBound === 'function' ? s.isSettlementClockBound : null));
  // Staleness wiring: a committed change on a NARRATED save makes the AI
  // prose out of date, so a successful apply raises StaleNarrativeModal.
  // Boolean selector — the narrative blobs are large and we only need "is
  // there one". Nothing can go stale on a raw (never-narrated) save.
  const narrated = useStore(s => !!(s.aiSettlement || s.aiDailyLife));
  const customContent = useStore(s => s.customContent);
  // Faith seam — premium custom-content entitlement gates the deity field; the
  // pricing-moment seam opens the purchase modal for a free/anon upsell.
  const canUseCustom = useStore(s => (typeof s.canUseCustomContent === 'function' ? s.canUseCustomContent() : false));
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  // LINK_NEIGHBOUR + OPENED_TRADE_ROUTE campaign-peer targeting read the library.
  const savedSettlements = useStore(s => s.savedSettlements);
  const activeSaveId = useStore(s => s.activeSaveId);
  const campaigns = useStore(s => s.campaigns);

  const [type, setType]         = useState('ADD_INSTITUTION');
  const [target, setTarget]     = useState('');
  const [description, setDesc]  = useState('');
  // Compose-session-stable event id (§5 IDENTITY): minted once per composition;
  // dial turns never re-mint. Re-minted on verb change / apply / add-to-batch.
  const [sessionEventId, setSessionEventId] = useState(() => mintComposeEventId());
  // Injected-composition provenance (SuccessorPrompt stages 'world_event').
  const [causeOverride, setCauseOverride] = useState('');
  // A veto refusal from the last Apply — the blocking-refusal surface (§2).
  const [applyRefusal, setApplyRefusal] = useState(null);
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
  // ADD_NPC descriptive traits — surfaced verbatim on the NPC read card. Optional.
  const [npcFlaw, setNpcFlaw]               = useState('');
  const [npcTemperament, setNpcTemperament] = useState('');
  const [npcGoals, setNpcGoals]             = useState('');
  const [npcConstraint, setNpcConstraint]   = useState('');
  const [npcSecret, setNpcSecret]           = useState('');
  // Severity + axis are intentionally hidden from the DM — the 0-100 "math"
  // confused more than it clarified. Impair Institution / Impair Faction apply a
  // standard moderate setback to legitimacy; these values feed buildEvent below.
  const severity  = 0.7;        // IMPAIR_INSTITUTION / IMPAIR_FACTION (+ legacy DAMAGE_INSTITUTION)
  const dimension = 'legitimacy';
  const [staged, setStaged]         = useState([]);            // batch: staged changes not yet applied
  const [destroyConfirm, setDestroyConfirm] = useState('');    // §9c: type-the-name gate for Destroy Settlement
  const [relationshipType, setRelationshipType] = useState(''); // §9b/g/h: neighbour relationship for dispute/alliance/trade
  const [criminalOrg, setCriminalOrg] = useState('');          // IMPOSE_CORRUPTION: the criminal organization to link the NPC to
  const [corruptScope, setCorruptScope] = useState('individual'); // IMPOSE_CORRUPTION: individual | individual_institution
  const [stressorPick, setStressorPick] = useState(null);     // APPLY_STRESSOR: the picked catalog item
  const [stressorSeverity, setStressorSeverity] = useState('moderate'); // APPLY_STRESSOR: word-banded severity
  const [instigatorNeighbour, setInstigatorNeighbour] = useState('');   // APPLY_STRESSOR: war/infiltration instigator
  const [instigatorRelationship, setInstigatorRelationship] = useState('rival'); // APPLY_STRESSOR: infiltration souring level
  const [tradeTarget, setTradeTarget] = useState('');          // OPENED_TRADE_ROUTE: optional campaign-peer target
  const [powerCause, setPowerCause] = useState('coup');       // CHANGE_RULING_POWER: how power changes hands
  const [reliefMagnitude, setReliefMagnitude] = useState('measured'); // FORCE_RELIEF / OFFER_CREDIT: word-banded share of the above-floor surplus
  const [tradeDirection, setTradeDirection] = useState('export'); // ADD_TRADE_GOOD: export | import
  const [tradeEntrepot, setTradeEntrepot] = useState(false);   // ADD_TRADE_GOOD: transit through the warehouses
  const [customResourceName, setCustomResourceName] = useState(''); // ADD_RESOURCE: free-text custom name
  const [swapWithNpcId, setSwapWithNpcId] = useState('');      // PROMOTE_NPC / DEMOTE_NPC: the same-faction counterpart
  const [tierDirection, setTierDirection] = useState('promotion'); // SHIFT_TIER: promotion | demotion
  const [deityRef, setDeityRef] = useState('');               // SET_PRIMARY_DEITY / IMPOSE_CULT: picked deity ref
  const [deityMode, setDeityMode] = useState('assign');       // SET_PRIMARY_DEITY / IMPOSE_CULT: assign | remove
  const [cultRemoveRef, setCultRemoveRef] = useState('');     // IMPOSE_CULT: the cult to drop
  const [partnerSaveId, setPartnerSaveId] = useState('');     // LINK_NEIGHBOUR: the partner settlement save
  const [linkRelType, setLinkRelType] = useState('neutral');  // LINK_NEIGHBOUR: the link relationship
  const [staleNotice, setStaleNotice] = useState(null);        // post-apply "narrative is now stale" modal: null | { label }
  const [addCategory, setAddCategory] = useState('');          // ADD_INSTITUTION: category of the picked catalog item

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
  // CHANGE_RULING_POWER — the manifest's seat gate (wraps governingFactionOf;
  // the same targets transferRulingPower will accept — same-function law).
  const rulingPowerOptions = useMemo(
    () => AFFORDANCE_MANIFEST.CHANGE_RULING_POWER.targetOptions(settlement),
    [settlement],
  );
  // ADD_TRADE_GOOD — datalist suggestions: every catalogued export label
  // across all tiers (free text still wins; the label is the storage format).
  const tradeGoodSuggestions = useMemo(() => {
    const names = new Set();
    for (const tierGoods of Object.values(GOODS_MODIFIERS_BY_TIER || {})) {
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
  // IMPOSE_CORRUPTION — the manifest's wrap over readCorruptionClimate: the
  // EXACT list the imposeCorruption handler resolves against (the old inline
  // comment-mirror filter is retired — same-function law).
  const criminalOrgs = useMemo(() => criminalOrgOptions(settlement), [settlement]);
  // OPENED_TRADE_ROUTE — other active-campaign members of the active save, so a
  // trade route can open with any campaign peer, not only a linked neighbour.
  const campaignSettlementOptions = useMemo(
    () => campaignPeerOptions(campaigns || [], savedSettlements || [], activeSaveId),
    [campaigns, savedSettlements, activeSaveId],
  );

  const spec = EVENT_REGISTRY[type];
  const needsTarget = !!spec?.requiresTarget;
  // ADD_RESOURCE's "Custom resource…" option holds the real target in the
  // companion text input; the swap events also need their counterpart picked.
  const effectiveTarget = type === 'ADD_RESOURCE' && target === CUSTOM_RESOURCE_OPTION
    ? customResourceName
    : target;
  // OPENED_TRADE_ROUTE may target a campaign peer instead of a linked neighbour;
  // when one is picked it satisfies the target requirement (and overrides the id).
  const resolvedTarget = (type === 'OPENED_TRADE_ROUTE' && tradeTarget.trim())
    ? tradeTarget.trim()
    : effectiveTarget;
  // War / infiltration stressor detection drives the optional instigator inputs.
  const stressorKey = String(stressorPick?.key || target || '').toLowerCase();
  const isWarStressor = WAR_STRESSOR_TYPES.includes(stressorKey);
  const isInfiltrationStressor = INFILTRATION_STRESSOR_TYPES.includes(stressorKey);
  const isDeityEvent = type === 'SET_PRIMARY_DEITY' || type === 'IMPOSE_CULT';
  const isLinkNeighbour = type === 'LINK_NEIGHBOUR';
  // LINK_NEIGHBOUR is a folded pseudo-event (not in EVENT_REGISTRY): it only
  // appears when an onLink handler is wired AND there is at least one other saved
  // settlement to link to. Apply delegates to onLink, never to applyEvent.
  const canLinkNeighbour = !!onLink && !!settlement && linkableSiblings(savedSettlements, settlement, activeSaveId).length > 0;
  // The manifest predicate is part of the submit gate: an unavailable verb
  // cannot be staged, and its reasons render below (grayed-with-reason, §2).
  const verbEntry = AFFORDANCE_MANIFEST[type] || null;
  const verbCtx = { canUseCustom, campaignPeerCount: campaignSettlementOptions.length };
  const verbAvailability = (!isLinkNeighbour && verbEntry && !verbEntry.foldedInto && settlement)
    ? verbEntry.predicate(settlement, verbCtx)
    : { available: true, reasons: [], unlocks: [] };
  const canSubmit = verbAvailability.available
    && (!needsTarget || resolvedTarget.trim().length > 0)
    && !((type === 'PROMOTE_NPC' || type === 'DEMOTE_NPC') && !swapWithNpcId)
    && !(isLinkNeighbour && !partnerSaveId)
    && !(isDeityEvent && !canStageDeityEvent({ type, settlement, deityRef, deityMode, cultRemoveRef, customContent, canUseCustom }));
  // Queued-vs-now (§5): surfaced plainly instead of silently queueing.
  const queuesToNextAdvance = phase === 'canon' && !!activeSaveId && !!isClockBound && isClockBound(activeSaveId);

  // THE STALENESS LAW (§5): the current composition's key. The preview pane is
  // valid iff its stored key AND its settlement reference both still match.
  const currentKey = settlement && canSubmit && !isLinkNeighbour
    ? eventStalenessKey(assembleEvent())
    : '';
  const isStale = !!pendingPreview
    && (pendingPreview._previewKey !== currentKey || pendingPreview._forSettlement !== settlement);

  // Composer-intent consumption (§4): an intent staged from anywhere (entity
  // card, SuccessorPrompt) populates the FORM — the one source of truth — and
  // the live preview derives from it like any hand-built composition.
  // Syncing an EXTERNAL staged intent into form state is the one legitimate
  // shape here: the intent arrives from outside the component (SuccessorPrompt,
  // entity cards) exactly once, and the effect immediately consumes+clears it.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!composerIntent) return;
    const { type: iType, target: iTarget, fields } = composerIntent;
    if (iType && EVENT_REGISTRY[iType]) switchType(iType);
    if (iTarget != null && iTarget !== '') setTarget(String(iTarget));
    const f = fields || {};
    if (f.role != null) setRole(String(f.role));
    if (f.institutionId != null) setInstitutionId(String(f.institutionId));
    if (f.quality != null) setQuality(String(f.quality));
    if (f.importance != null) setImportance(String(f.importance));
    if (f.description != null) setDesc(String(f.description));
    if (f.causeOverride != null) setCauseOverride(String(f.causeOverride));
    stageComposerIntent(null);
    // switchType/setters are stable; the intent object is the real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composerIntent]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // LIVE PREVIEW (§5): benchmarked 2026-07-14 — runEventPipeline is p50≈0.4ms,
  // p95<1.6ms on a metropolis WITH faction responses (two orders of magnitude
  // under a frame), so the pane re-derives the FULL pipeline on every form
  // change (150ms debounce), no skipFactionResponses tiering needed.
  useEffect(() => {
    if (!currentKey || !settlement) return undefined;
    const t = setTimeout(() => {
      const pp = useStore.getState().pendingPreview;
      if (pp && pp._previewKey === currentKey && pp._forSettlement === settlement) return;
      previewEvent(assembleEvent());
    }, 150);
    return () => clearTimeout(t);
    // currentKey is derived from the ENTIRE form payload; previewEvent is a
    // stable zustand action; assembleEvent's other inputs are captured by key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey, settlement]);

  if (!settlement) return null;

  // Derive a sensible institution list for the institution-pickers.
  const institutionOptions = (settlement.institutions || [])
    .map(i => ({ id: i.id || i.name, name: i.name || i.id }))
    .filter(o => o.id && o.name);

  // The ONE verb-change chokepoint (select dropdown, navigator chips, staged
  // intents): resets every per-type field and re-mints the compose-session id
  // (a different verb IS a different composition — §5 identity).
  function switchType(v) {
    setType(v); setTarget(''); setAddCategory(''); setDestroyConfirm('');
    setRelationshipType((RELATIONSHIP_OPTIONS[v] || [])[0] || '');
    setCriminalOrg(''); setCorruptScope('individual'); setStressorPick(null);
    setStressorSeverity('moderate'); setInstigatorNeighbour(''); setInstigatorRelationship('rival');
    setTradeTarget(''); setPowerCause('coup'); setTradeDirection('export'); setTradeEntrepot(false);
    setCustomResourceName(''); setSwapWithNpcId(''); setTierDirection('promotion');
    setDeityRef(''); setDeityMode('assign'); setCultRemoveRef('');
    setNpcFlaw(''); setNpcTemperament(''); setNpcGoals(''); setNpcConstraint(''); setNpcSecret('');
    setPartnerSaveId(''); setLinkRelType('neutral');
    setCauseOverride(''); setApplyRefusal(null);
    setSessionEventId(mintComposeEventId());
  }

  // Thin closure: thread the form state into the pure buildEvent assembler. The
  // tier direction is pre-clamped so the shown option and the staged event agree.
  function assembleEvent() {
    return buildEvent({
      type, target, effectiveTarget, settlement, phase,
      sessionEventId, causeOverride,
      addCategory, severity, dimension,
      importance, role, institutionId,
      npcFlaw, npcTemperament, npcGoals, npcConstraint, npcSecret,
      quality, relationshipType, criminalOrg, criminalOrgs, corruptScope,
      stressorPick, stressorSeverity, powerCause, reliefMagnitude,
      tradeDirection, tradeEntrepot, swapWithNpcId,
      tierDirection: clampTierDirection(settlement, tierDirection),
      customContent, deityRef, deityMode, cultRemoveRef,
      isWarStressor, isInfiltrationStressor, instigatorNeighbour, instigatorRelationship, tradeTarget,
      partyCaused, description,
    });
  }

  function onPreview() {
    previewEvent(assembleEvent());
  }

  function resetAfterApply() {
    setTarget('');
    setDesc('');
    setPartyCaused(false);
    setDestroyConfirm('');
    setSwapWithNpcId('');
    setCustomResourceName('');
    setCauseOverride('');
    setSessionEventId(mintComposeEventId()); // next composition = next identity
  }

  function onApply() {
    // LINK_NEIGHBOUR — delegate to onLink (handleLink), which runs the full
    // bidirectional neighbour-link cascade. Never builds/stages an event.
    if (isLinkNeighbour) {
      const partner = (savedSettlements || []).find(s => String(s.id) === String(partnerSaveId));
      if (onLink && partner) onLink(partner, linkRelType);
      setPartnerSaveId('');
      setLinkRelType('neutral');
      return;
    }
    // §9c — Destroy Settlement is drastic + recoverable-only-by-effort, so it
    // requires typing the settlement name to confirm. Block apply until it matches.
    if (type === 'DESTROY_SETTLEMENT' && destroyConfirm.trim() !== (settlement?.name || '').trim()) return;
    // THE STALENESS LAW (§5): the apply-prefers-pendingPreview bypass is
    // RETIRED. Apply ALWAYS commits the freshly-built form event; when the
    // form and settlement are unchanged since the last preview this is the
    // previewed event byte-for-byte (same session id, same payload) — the
    // audit's preview↔commit identity now holds BY CONSTRUCTION of the key,
    // and an edited form can never commit a stale preview.
    const evType = type;
    const entry = applyEvent(assembleEvent());
    // Handler-veto channel (§2): the world refused — a blocking refusal, not
    // a commit. Keep the form (the DM will retarget), surface the reason.
    if (entry && entry.ok === false && entry.veto) {
      // Keyed to THIS composition: the box hides by derivation the moment the
      // form (and so the key) moves — no state-clearing effect needed.
      setApplyRefusal({ ...entry.veto, forKey: currentKey });
      return;
    }
    setApplyRefusal(null);
    resetAfterApply();
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
        <Zap size={12} />
        Make Changes
      </div>
      <div style={{ fontSize: FS.xxs, fontFamily: sans, color: MUTED, marginTop: -2, marginBottom: SP.sm, lineHeight: 1.4 }}>
        {phase === 'canon'
          ? 'In-world events write to the campaign timeline.'
          : 'Draft: nothing is logged yet. Stage changes and preview their effect before you canonize.'}
      </div>

      {/* §4 — nobody ever meets the catalog: pressures rail + target-first +
          family browse + search, all projections of the affordance manifest. */}
      <ComposerNavigator
        settlement={settlement}
        ctx={verbCtx}
        onPickVerb={switchType}
        onPickTargetVerb={(t, targetId) => { switchType(t); if (targetId) setTarget(String(targetId)); }}
      />

      <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Field label="Event">
          <select value={type} onChange={e => switchType(e.target.value)} aria-label="Event type" style={selectStyle}>
            {/* Predicate-driven verb list (§2): the manifest's authorable verbs.
                Grayed-with-reason beats absent — an unavailable verb renders
                disabled with WHY, so unavailability teaches instead of hiding.
                (Folded types never list; their cards live in the manifest.) */}
            {authorableVerbs().map(v => {
              const p = v.predicate(settlement, verbCtx);
              return (
                <option key={v.type} value={v.type} disabled={!p.available}>
                  {v.label}{p.available ? '' : ` — ${p.reasons[0] || 'unavailable'}`}
                </option>
              );
            })}
            {/* LINK_NEIGHBOUR — folded "Link a neighbour" pseudo-event (no registry
                entry): shown only when an onLink handler is wired and a partner exists. */}
            {canLinkNeighbour && <option value="LINK_NEIGHBOUR">Link a neighbour</option>}
          </select>
          {!verbAvailability.available && (
            <span style={{ fontSize: FS.xxs, fontStyle: 'italic', color: MUTED, maxWidth: 260, lineHeight: 1.4 }}>
              {[...verbAvailability.reasons, ...verbAvailability.unlocks].join(' ')}
            </span>
          )}
        </Field>

        {/* The deity / tier / link fields override or replace the target, so the
            vestigial free-text Target is suppressed for those kinds. */}
        {!isDeityEvent && type !== 'SHIFT_TIER' && !isLinkNeighbour && (
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
        )}

        {/* IMPOSE_CORRUPTION — which criminal organization + how far the rot reaches */}
        {type === 'IMPOSE_CORRUPTION' && (
          <EventComposerCorruptionFields
            criminalOrgs={criminalOrgs}
            criminalOrg={criminalOrg}
            setCriminalOrg={setCriminalOrg}
            corruptScope={corruptScope}
            setCorruptScope={setCorruptScope}
          />
        )}

        {/* SET_PRIMARY_DEITY / IMPOSE_CULT — the patron + cult inputs (premium-gated) */}
        {isDeityEvent && (
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

        {/* SHIFT_TIER — force a one-step promotion/demotion (only legal moves shown) */}
        {type === 'SHIFT_TIER' && (
          <EventComposerTierField
            settlement={settlement}
            tierDirection={tierDirection}
            setTierDirection={setTierDirection}
          />
        )}

        {/* LINK_NEIGHBOUR — pick a partner save + relationship (delegates to onLink) */}
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

        {/* Per-type secondary inputs: trade direction/handling, stressor severity,
            ruling-power cause, and the read-only KILL_NPC importance. */}
        <EventComposerSecondaryFields
          type={type}
          tradeDirection={tradeDirection}
          setTradeDirection={setTradeDirection}
          tradeEntrepot={tradeEntrepot}
          setTradeEntrepot={setTradeEntrepot}
          stressorSeverity={stressorSeverity}
          setStressorSeverity={setStressorSeverity}
          powerCause={powerCause}
          setPowerCause={setPowerCause}
          reliefMagnitude={reliefMagnitude}
          setReliefMagnitude={setReliefMagnitude}
          settlement={settlement}
          target={target}
        />

        {/* Optional relationship extras: war/infiltration instigator, trade peer */}
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
            KILL_NPC does not ask — it derives from the selected NPC (shown by
            EventComposerSecondaryFields). */}
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

        {/* ADD_NPC — the descriptive traits surfaced on the NPC read card. */}
        {type === 'ADD_NPC' && (
          <AddNpcTraitFields
            flaw={npcFlaw} setFlaw={setNpcFlaw}
            temperament={npcTemperament} setTemperament={setNpcTemperament}
            goals={npcGoals} setGoals={setNpcGoals}
            constraint={npcConstraint} setConstraint={setNpcConstraint}
            secret={npcSecret} setSecret={setNpcSecret}
          />
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
                  <option value="">— Pick a role —</option>
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
              <option value="">— None —</option>
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

        {/* Description is not meaningful for the delegate-only LINK_NEIGHBOUR. */}
        {!isLinkNeighbour && (
          <Field label="Description" hint="optional">
            <input value={description} onChange={e => setDesc(e.target.value)} placeholder="e.g. burned during a brawl" aria-label="Description" style={inputStyle} />
          </Field>
        )}

        {/* §8 M3b — party attribution. A canonical "the party did this" flag. */}
        {!isLinkNeighbour && (
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
        )}
      </div>

      <ApplyControls
        type={type}
        phase={phase}
        isLinkNeighbour={isLinkNeighbour}
        canSubmit={canSubmit}
        settlement={settlement}
        destroyConfirm={destroyConfirm}
        setDestroyConfirm={setDestroyConfirm}
        pendingPreview={pendingPreview}
        dismissPreview={dismissPreview}
        onPreview={onPreview}
        onApply={onApply}
        onAddToBatch={() => { setStaged(prev => [...prev, assembleEvent()]); setTarget(''); setDesc(''); setPartyCaused(false); setSwapWithNpcId(''); setCustomResourceName(''); setSessionEventId(mintComposeEventId()); }}
      />

      {/* Handler-veto refusal (§2): the world refused the last Apply — blocking. */}
      {applyRefusal && applyRefusal.forKey === currentKey && (
        <div style={{
          marginTop: SP.sm, padding: '8px 10px', border: `1px solid ${swatch.danger}`,
          borderRadius: R.sm, background: swatch.dangerBg,
          fontSize: FS.xs, fontFamily: sans, color: swatch.danger, fontWeight: 700, lineHeight: 1.4,
        }}>
          ✕ The world refuses: {vetoProse(applyRefusal.code, applyRefusal.detail)}
        </div>
      )}

      {/* Queued-vs-now (§5): plainly said, never silent. */}
      {queuesToNextAdvance && (
        <div style={{ marginTop: 6, fontSize: FS.xxs, fontFamily: sans, color: MUTED, fontStyle: 'italic' }}>
          Clock-bound campaign: applied changes queue and resolve at the next World Pulse advance.
        </div>
      )}

      {pendingPreview && <PreviewPanel preview={pendingPreview} stale={isStale} queued={queuesToNextAdvance} />}

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
