/**
 * domain/crisisLifecycle.js — ONE authored crisis, THREE representations,
 * ONE transition vocabulary.
 *
 * A crisis lives as (1) the settlement's stress-container ENTRY (what the
 * dossier and the generation-era stress consumers read), (2) the promoted
 * activeCondition (what the causal substrate reads), and (3) the roaming
 * campaign STRESSOR twin (what the world pulse ages). Before this
 * module the three were kept agreeing by hand-maintained conventions at four
 * chokepoints — the severity drift, the undo-twin gap, and the
 * never-resolving local entry were each found (and individually patched) in
 * that seam. This module is the structural cure: every transition flows
 * through ONE function that returns the settlement-side changes and the
 * campaign-side instruction TOGETHER:
 *
 *   crisisOnset / crisisEscalate — APPLY_STRESSOR: container upsert +
 *       stressorEdits record + condition promotion; twinDirective 'inject'.
 *   crisisResolve                — RESOLVE_STRESSOR: container removal +
 *       condition wind-down + stressorEdits suppression; twinDirective
 *       'resolve'. resolveCrisisLocally is the same settlement half driven
 *       by an ORGANIC world-pulse resolution (the twin already ended itself).
 *   crisisWithdraw               — undo: composes the 'withdraw'/'restore'
 *       directive from the popped log entry. The settlement-side scrub stays
 *       in events/undoEvent.js (it must also reverse non-crisis events);
 *       crisisTwinFor is the pre-event twin snapshot that scrub restores from.
 *
 * The DOMAIN stays campaign-agnostic: a twinDirective is a declarative
 * instruction ({ action: 'inject'|'resolve'|'withdraw'|'restore', … }) the
 * store consumes at ONE chokepoint each way (settlementSlice's applyEvent
 * consumer and undoLastEvent's withdraw call), so the bridge can no longer
 * forget the twin — a new crisis event type lands in CRISIS_EVENT_TYPES here
 * and the store obeys its directive by construction.
 * tests/joins/crisisTripleSync.test.js enforces the agreement property and
 * (by comment-stripped source scan) that no file outside this one writes the
 * trio directly.
 *
 * Pure functions — no store, no React, no I/O, no timestamps, no rng.
 */

import { withActiveCondition, withEventConditionsSynced } from './activeConditions.js';
import { archetypeForStressor, promoteStressorsToConditions } from './conditionPromotion.js';
import { STRESSOR_CATALOG, normalizeStressor } from './worldPulse/stressors.js';
import { GEN_TO_PULSE_TYPE, pulseTypeForStressorKey } from './stressorPicker.js';
import { deepClone } from './clone.js';

/** The event types whose settlement handlers are crisis-lifecycle transitions.
 *  settlementSlice gates its twin snapshot + directive consumer on this list —
 *  adding a crisis event type here is what wires its twin by construction. */
export const CRISIS_EVENT_TYPES = Object.freeze(['APPLY_STRESSOR', 'RESOLVE_STRESSOR']);

/** The authored stressor type a crisis event names (payload first, targetId
 *  fallback — the composer's contract). Empty string when the event names none. */
function authoredCrisisType(/** @type {any} */ event) {
  return String(event?.payload?.stressorType || event?.targetId || '').trim();
}

// Display label for a slug-ish target id ('under_siege' -> 'under siege') —
// mutate.js's labelFromTarget, duplicated tiny + local to keep this module
// import-cycle-free (mutate.js imports THIS module).
function labelFromTarget(/** @type {any} */ targetId) {
  const tail = /** @type {any} */ (String(targetId || '').split('.').pop());
  return tail.replace(/_/g, ' ');
}

// Loose catalog alias map mirrored from stressors.js canonicalAffectedSystems
// (kept tiny + local: importing the private helper would mean exporting it
// just for this fallback path).
const STRESSOR_SYSTEM_ALIASES = Object.freeze({
  faction_stability: 'faction_power',
  law_order: 'criminal_opportunity',
  tax_revenue: 'trade_connectivity',
});

// Case-insensitive stressor-type comparison — the same tolerance the
// container upserts and the wind-down's matchesEntry use.
const stressTypeEq = (/** @type {any} */ a, /** @type {any} */ b) => String(a || '').toLowerCase() === String(b || '').toLowerCase();

// Content identity for a bare-object stress entry — type, falling back to
// display name for legacy untyped entries; an entry with neither falls back
// to the object itself (reference identity). assembleSettlement dual-writes
// the SAME object under stress + stressors, but a JSON save/load round-trip
// breaks the aliasing — two content-identical twins that reference dedupe
// (Set) counted as distinct entries.
const stressEntryIdentity = (/** @type {any} */ st) => String(st?.type || st?.name || '').toLowerCase() || st;

/**
 * Normalized view of config.stressorEdits — the EDITOR-authored stressor
 * deltas the generation re-applies (resolveStress's post-roll overlay —
 * resourceEdits' architecture):
 *   { added }    full stress entries authored by APPLY_STRESSOR, re-applied
 *                verbatim (upsert by type) so the authored stressor — not
 *                just its promoted condition — survives a regeneration. The
 *                stress ENTRY is a derivation output the pipeline re-rolls
 *                from config; without the record it vanished on the first
 *                applyChange while the condition survived via
 *                config.eventConditions, and the dossier showed a crisis
 *                with no stressor behind it;
 *   { resolved } stressor types RESOLVE_STRESSOR (or an organic world-pulse
 *                resolution) ended — a suppression list, so resolving a
 *                CONFIG-FORCED stressor (selectedStresses / stressType)
 *                stays resolved across regens instead of the re-rolled twin
 *                re-minting a fresh GENERATION condition once the eased
 *                config.eventConditions record expires.
 * The transitions keep the two lists mutually agreeing (an onset clears the
 * type's resolved record; a resolve strikes the type's added entry).
 */
function stressorEditsOf(/** @type {any} */ config) {
  const se = config?.stressorEdits || {};
  return {
    added: Array.isArray(se.added) ? se.added : [],
    resolved: Array.isArray(se.resolved) ? se.resolved : [],
  };
}

/**
 * Dual-write a stressorEdits update to BOTH config and _config (when
 * present) — withCustomTradeGoods' discipline; see mutate.js for why.
 * (stressorEdits is genuine user input, deliberately NOT in
 * settlementSlice's DERIVED_CONFIG_KEYS strip.)
 */
function withStressorEdits(/** @type {any} */ s, /** @type {any} */ stressorEdits) {
  const next = { ...s, config: { ...(s.config || {}), stressorEdits } };
  if (s._config && typeof s._config === 'object') {
    next._config = { ...s._config, stressorEdits };
  }
  return next;
}

// ── Transitions ────────────────────────────────────────────────────────────

/**
 * Crisis ONSET (APPLY_STRESSOR). Three settlement writes + the twin directive:
 *   1. the stress entry lands in the settlement's stress container (the same
 *      shape the Roster's add-stressor correction uses), so the dossier and
 *      the generation-era stress consumers see it;
 *   2. the SAME entry is recorded in config.stressorEdits.added (dual-written
 *      to _config), because the live container is a derivation output a
 *      regeneration re-rolls from config — resolveStress's post-roll overlay
 *      re-applies the record so the authored stressor survives applyChange
 *      alongside the condition below;
 *   3. the engine consequence: the SAME promotion channel generation uses
 *      (conditionPromotion) maps the stressor to its condition archetype.
 *      Types with no promotion rule (custom stressors, exotic catalog types)
 *      fall back to a generic custom_crisis condition carrying the world-pulse
 *      catalog's affectedSystems where known.
 * The twinDirective ('inject') instructs the store to register the roaming
 * world-pulse twin in canon campaigns — the settlement half stays
 * campaign-agnostic.
 *
 * @param {{ settlement: any, event: any }} args
 * @returns {{ settlement: Object, twinDirective: Object|null }}
 */
export function crisisOnset({ settlement: s, event }) {
  const type = authoredCrisisType(event);
  if (!type) return { settlement: s, twinDirective: null };
  const label = event.payload?.label || labelFromTarget(type);
  const severity = Math.max(0, Math.min(1, Number(event.payload?.severity ?? 0.6)));

  // First existing ARRAY container wins (same probe removedThreat uses).
  // Pipeline settlements carry a SINGLE stressor as a bare object,
  // dual-written under stress + stressors (assembleSettlement) — the old
  // `|| 'stress'` fallback CLOBBERED that object with a fresh one-entry
  // array under `stress` and left the stale twin under `stressors`. Lift
  // the object(s) into the working list and write the merged array back to
  // EVERY key that held one; a settlement with no container at all gets the
  // editor's canonical `stress` array.
  const arrayKey = ['stressors', 'stress', 'stresses'].find(k => Array.isArray(s[k]));
  const objectKeys = arrayKey ? [] : ['stressors', 'stress', 'stresses']
    .filter(k => s[k] && typeof s[k] === 'object');
  const writeKeys = arrayKey ? [arrayKey] : objectKeys.length ? objectKeys : ['stress'];
  // Lift by CONTENT identity, not reference: a round-tripped settlement holds
  // content-identical twins under stress + stressors, and the old Set dedupe
  // kept both — upserting a DUPLICATE entry into every container key.
  const lifted = objectKeys.map(k => s[k]);
  const list = arrayKey ? s[arrayKey] : lifted.filter((st, i) =>
    lifted.findIndex(o => stressEntryIdentity(o) === stressEntryIdentity(st)) === i);
  // Match by type; the display-name fallback only rescues legacy entries
  // that never recorded one — matching a TYPED entry by label would let a
  // custom stressor labeled 'Famine' overwrite the famine entry's type and
  // detach it from every type-keyed consumer (pulse twin, picker filter).
  const existingIdx = list.findIndex((/** @type {any} */ st) =>
    String(st?.type || '').toLowerCase() === type.toLowerCase()
    || (!st?.type && String(st?.name || '').toLowerCase() === label.toLowerCase()));
  const entry = {
    type,
    name: label,
    label,
    severity,
    description: event.description || (existingIdx === -1 ? '' : list[existingIdx]?.description || ''),
    source: 'event',
    addedByEventId: event.id,
    ...(event.payload?.isCustom ? { isCustom: true } : {}),
  };
  // Upsert, not keep-old: re-authoring an existing stressor type refreshes the
  // local entry to the NEW authored severity/label/source. The roaming twin
  // (the 'inject' directive below) already upserts at the new severity;
  // keeping the old local entry made the representations disagree.
  const merged = existingIdx === -1
    ? [...list, entry]
    : list.map((/** @type {any} */ st, /** @type {any} */ i) => (i === existingIdx ? { ...st, ...entry } : st));
  let next = { ...s };
  for (const k of writeKeys) next[k] = merged;

  // The authored onset is ALSO recorded in config.stressorEdits (dual-written
  // to _config — the resourceEdits discipline; see stressorEditsOf). The
  // stress entry above is a derivation output a regeneration re-rolls from
  // config; resolveStress re-applies the record as a post-roll overlay so
  // the dossier keeps showing the stressor behind the surviving condition.
  // Upsert by type (re-authoring refreshes the record the way the live
  // upsert refreshes the entry); clearing the type's `resolved` suppression
  // lets a re-authored crisis return after a RESOLVE_STRESSOR.
  const edits = stressorEditsOf(s.config);
  const recordIdx = edits.added.findIndex((/** @type {any} */ e) => stressTypeEq(e?.type, type));
  next = withStressorEdits(next, {
    added: recordIdx === -1
      ? [...edits.added, entry]
      : edits.added.map((/** @type {any} */ e, /** @type {any} */ i) => (i === recordIdx ? entry : e)),
    resolved: edits.resolved.filter((/** @type {any} */ t) => !stressTypeEq(t, type)),
  });

  const archetype = archetypeForStressor(entry);
  if (archetype) {
    // The richer path: famine -> famine, plague -> plague, coup -> faction
    // challenge, ... (idempotent; collapses per archetype). The origin carries
    // the AUTHORED provenance — without it the promotion stamped GENERATION
    // and dropped the event id (the provenance lie the coup wave fixed).
    return {
      settlement: promoteStressorsToConditions(next, {
        sourceEventType: 'APPLY_STRESSOR',
        eventId: event.id,
        detail: `${label} began.`,
        archetype,
      }),
      twinDirective: twinDirectiveForEvent(event),
    };
  }
  const catalogSystems = (/** @type {any} */ (STRESSOR_CATALOG)[type]?.affectedSystems || [])
    .map((/** @type {any} */ sys) => /** @type {any} */ (STRESSOR_SYSTEM_ALIASES)[sys] || sys);
  return {
    settlement: withActiveCondition(next, {
      archetype: 'custom_crisis',
      label,
      description: event.description || `${label} grips the settlement.`,
      severity,
      ...(catalogSystems.length ? { affectedSystems: [...new Set(catalogSystems)] } : {}),
      triggeredAt: { sourceEventType: 'APPLY_STRESSOR', sourceEventTargetId: type },
      causes: [{ source: 'event', eventId: event.id, detail: `${label} began.` }],
    }),
    twinDirective: twinDirectiveForEvent(event),
  };
}

/**
 * Crisis ESCALATION is an onset of an existing type: the container upsert,
 * the stressorEdits record refresh, the promotion re-evaluation, and the
 * twin's 'inject' upsert (stable id — no stacking) ARE the escalation. One
 * implementation, two names, so callers say what they mean and the two
 * transitions can never drift apart.
 */
export function crisisEscalate(/** @type {any} */ args) {
  return crisisOnset(args);
}

/**
 * The shared settlement half of every resolution. Removes the matching
 * stress entry (same container probe crisisOnset uses) and winds down the
 * conditions that crisis promoted — both the directly stamped one
 * (triggeredAt.sourceEventTargetId, the custom_crisis path) and the
 * archetype the type promotes to (the conditionPromotion path). Wind-down is
 * 'easing' + a near-term expiry rather than outright removal, so the
 * substrate sees a crisis trailing off instead of vanishing without trace;
 * the resolution carries its provenance on the condition's causes. The
 * wind-down does NOT require a live stress entry: on a legacy save
 * regenerated before config.stressorEdits existed, the entry was re-rolled
 * away while the promoted condition survived via config.eventConditions —
 * resolving by type still finds it. The resolution is itself recorded in
 * config.stressorEdits (strike the type's added entry, suppress the type) so
 * a resolved CONFIG-FORCED stressor stays resolved across regenerations. A
 * target matching neither an entry nor a condition is a settlement no-op.
 *
 * `types` is the candidate vocabulary (one authored type for events; the
 * pulse type + its generation aliases for organic resolutions). `origin`
 * names who ended it: { kind: 'event', eventId } or { kind: 'world_pulse' }.
 */
function windDownCrisis(/** @type {any} */ s, /** @type {any} */ { types, label: labelOverride, origin }) {
  const candidates = (types || []).map((/** @type {any} */ t) => String(t || '').trim()).filter(Boolean);
  if (!candidates.length) return { settlement: s, removed: null, wound: false };
  const lower = (/** @type {any} */ v) => String(v || '').toLowerCase();
  const candSet = new Set(candidates.map(lower));
  // Type OR display-name match, case-insensitive — the picker passes the
  // entry's type when it has one, its name for legacy untyped entries.
  const matchesEntry = (/** @type {any} */ st) => candSet.has(lower(st?.type)) || candSet.has(lower(st?.name));
  // EVERY array container is cleared, not just the first: crisisOnset
  // writes the merged array to each key that held the bare object
  // (stress + stressors), and a JSON round-trip breaks their aliasing — the
  // old first-key-only removal left a stale twin raging under the other key.
  const arrayKeys = ['stressors', 'stress', 'stresses'].filter(k => Array.isArray(s[k]));
  // A missing array entry is NOT a full no-op: the stress entry is a
  // derivation output that a regeneration re-rolls away, while the promoted
  // condition survives via config.eventConditions — so the condition must
  // stay resolvable after a what-if. No matching entry AND no matching
  // condition below → settlement no-op.
  let removed = null;
  let next = s;
  for (const containerKey of arrayKeys) {
    const list = s[containerKey];
    const idx = list.findIndex(matchesEntry);
    if (idx === -1) continue;
    removed = removed || list[idx];
    next = { ...next, [containerKey]: list.filter((/** @type {any} */ _, /** @type {any} */ i) => i !== idx) };
  }
  if (!removed) {
    // Pipeline settlements carry a SINGLE stressor as a bare object,
    // dual-written under stress + stressors (assembleSettlement) — the array
    // probe above never sees it, which made resolving a GENERATOR-rolled
    // crisis a stressor no-op (an easing condition beside a still-raging
    // stressor). Match and clear that shape too; nulling the keys mirrors
    // the no-stress generated shape.
    const objectKeys = ['stressors', 'stress', 'stresses'].filter(k =>
      s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) && matchesEntry(s[k]));
    if (objectKeys.length) {
      removed = s[objectKeys[0]];
      next = { ...s };
      for (const k of objectKeys) next[k] = null;
    }
  }
  const label = labelOverride || removed?.label || removed?.name || labelFromTarget(candidates[0]);
  const resolutionCause = origin?.kind === 'event'
    ? { source: 'event', eventId: origin.eventId, detail: `${label} was resolved.` }
    : { source: 'world_pulse', detail: `${label} has passed.` };

  // Wind down what the crisis promoted. Matching mirrors crisisOnset's two
  // write paths: the direct stamp (custom_crisis / authored onset) and the
  // promotion archetype. No clearing precedent exists in the event layer, so
  // the wind-down sets status 'easing' with a short remaining duration (the
  // documented fallback) instead of deleting evolved state outright.
  const archetype = archetypeForStressor(removed)
    || candidates.map((/** @type {any} */ t) => archetypeForStressor({ type: t })).find(Boolean)
    || null;
  // A local resolution never winds down a CAMPAIGN-owned condition: one
  // whose ORIGIN cause is a regional channel or the world pulse belongs to
  // that layer (it resolves through its own UI/twin and is preserved across
  // local edits by preserveWorldConditions). Winding it here would stamp an
  // event cause onto it, recruiting it into config.eventConditions — and the
  // record would resurrect it after the campaign layer resolved it. Origin =
  // the FIRST cause: onsets write their provenance first; later causes are
  // appended receipts. Event- and generation-born conditions (and bare
  // legacy ones with no causes) are local and stay resolvable.
  const locallyOwned = (/** @type {any} */ c) => {
    const condOrigin = String(c?.causes?.[0]?.source ?? '');
    return condOrigin === '' || condOrigin === 'event' || condOrigin === 'generation';
  };
  const matchesCrisis = (/** @type {any} */ c) => {
    if (!c || !locallyOwned(c)) return false;
    const stamped = candSet.has(lower(c.triggeredAt?.sourceEventTargetId));
    return stamped || (archetype != null && c.archetype === archetype);
  };
  let wound = false;
  const conditions = (next.activeConditions || []).map((/** @type {any} */ c) => {
    if (!matchesCrisis(c)) return c;
    wound = true;
    const elapsed = Number(c.duration?.elapsedTicks) || 0;
    const cap = c.duration?.expiresAtTicks;
    return {
      ...c,
      status: 'easing',
      duration: {
        ...(c.duration || {}),
        elapsedTicks: elapsed,
        // Trail off within ~2 ticks; never EXTEND a condition already closer
        // to expiry than that.
        expiresAtTicks: typeof cap === 'number' ? Math.min(cap, elapsed + 2) : elapsed + 2,
      },
      causes: [
        ...(Array.isArray(c.causes) ? c.causes : []),
        resolutionCause,
      ],
    };
  });
  if (wound) next = { ...next, activeConditions: conditions };
  // Record the resolution in config.stressorEdits (dual-written to _config):
  // strike the type's authored `added` entry so the overlay stops re-applying
  // it, and add the type to the `resolved` suppression list so a
  // CONFIG-FORCED stressor (selectedStresses / stressType) stays resolved
  // across regenerations — without it the re-rolled stressor re-minted a
  // fresh GENERATION condition ~2 ticks after the eased
  // config.eventConditions record expired. EVERY candidate alias is recorded
  // (plus the removed entry's own type): resolveStress's suppression matches
  // the GENERATION vocabulary the re-roll mints ('under_siege'), while an
  // organic twin resolves under the PULSE type ('siege') — an entry-less
  // wind-down that recorded only candidates[0] left a config-forced legacy
  // crisis free to re-mint. A no-match resolve records nothing — the
  // settlement no-op posture above.
  if (removed || wound) {
    const resolvedTypes = [removed?.type, ...candidates]
      .map(t => String(t || '').trim()).filter(Boolean)
      .filter((t, i, arr) => arr.findIndex(o => stressTypeEq(o, t)) === i);
    const edits = stressorEditsOf(next.config);
    const added = edits.added.filter((/** @type {any} */ e) => !resolvedTypes.some(t => stressTypeEq(e?.type, t)));
    const missing = resolvedTypes.filter(t => !edits.resolved.some((/** @type {any} */ r) => stressTypeEq(r, t)));
    if (added.length !== edits.added.length || missing.length) {
      next = withStressorEdits(next, {
        added,
        resolved: [...edits.resolved, ...missing],
      });
    }
  }
  return { settlement: next, removed, wound };
}

/**
 * Crisis RESOLUTION (RESOLVE_STRESSOR) — the inverse of crisisOnset: an
 * authored crisis ENDS. Settlement half via windDownCrisis (see its doc);
 * the twinDirective ('resolve') instructs the store to resolve the roaming
 * world-pulse twin (canon campaigns), mirroring the inject directive. A
 * settlement no-op still emits the directive — the registry deltas land the
 * same way (guard upstream: batch.js eventConsumes hard-validates the
 * target, the composer's picker offers the live stressors), and resolving an
 * unregistered roaming type is itself a campaign no-op.
 *
 * @param {{ settlement: any, event: any }} args
 * @returns {{ settlement: Object, twinDirective: Object|null }}
 */
export function crisisResolve({ settlement, event }) {
  const type = authoredCrisisType(event);
  if (!type) return { settlement, twinDirective: null };
  const { settlement: next } = windDownCrisis(settlement, {
    types: [type],
    label: event.payload?.label,
    origin: { kind: 'event', eventId: event.id },
  });
  return { settlement: next, twinDirective: twinDirectiveForEvent(event) };
}

/**
 * The settlement half of an ORGANIC resolution — the world pulse resolved
 * the roaming twin itself (decay, counterforces, a coup verdict), so there
 * is no event and no directive: the origin settlement's local
 * representations wind down to match the world. This closes the asymmetry
 * the D-wave deferred (owner decision 2026-06-11: SYNC IT) — the dossier
 * stops showing a crisis the world already ended, and the stressorEdits
 * suppression keeps a config-forced re-roll from resurrecting it on the
 * next regeneration. Candidate vocabulary spans the twin's pulse type AND
 * its generation aliases (the local entry of an authored 'under_siege'
 * carries the gen key while its twin roams as 'siege'). Identity no-op when
 * nothing local matches (most pulse-born crises have no local entry).
 * Finishes with the eventConditions re-sync — the projection chokepoint
 * mutateSettlement runs for events — so an eased EVENT-promoted condition's
 * record follows (status easing + the world_pulse receipt survive
 * regeneration).
 *
 * @param {import('./settlement.schema.js').SimSettlement} settlement   the origin settlement
 * @param {import('./settlement.schema.js').SimStressor} twin         the resolved roaming stressor record
 * @returns {Object} new settlement (same reference when nothing matched)
 */
export function resolveCrisisLocally(settlement, twin) {
  const roamingType = String(twin?.type || '').trim();
  if (!settlement || !roamingType) return settlement;
  const genKeys = Object.keys(GEN_TO_PULSE_TYPE)
    .filter(genKey => /** @type {any} */ (GEN_TO_PULSE_TYPE)[genKey] === roamingType);
  const { settlement: next, removed, wound } = windDownCrisis(settlement, {
    types: [roamingType, ...genKeys],
    label: twin?.label,
    origin: { kind: 'world_pulse' },
  });
  if (!removed && !wound) return settlement;
  return withEventConditionsSynced(next);
}

// ── Twin directives (the campaign half, declaratively) ─────────────────────

/**
 * The roaming-twin instruction a crisis event carries. The store consumes
 * this at ONE chokepoint (settlementSlice.applyEvent) instead of hand-rolling
 * per event type:
 *   { action: 'inject',  stressor: { type, label, severity } }  onset/escalate
 *   { action: 'resolve', type }                                  resolution
 * Returns null for non-crisis events and for crisis events naming no type.
 * The injected type is alias-mapped (under_siege -> siege); a custom
 * stressor with no roaming analog injects under its own key
 * (normalizeStressor tolerates unknown types).
 */
export function twinDirectiveForEvent(/** @type {any} */ event) {
  const type = authoredCrisisType(event);
  if (!type) return null;
  if (event.type === 'APPLY_STRESSOR') {
    const roamingType = pulseTypeForStressorKey(type) || type;
    return {
      action: 'inject',
      stressor: {
        type: roamingType,
        label: event.payload?.label || undefined,
        severity: Number(event.payload?.severity ?? 0.6),
      },
    };
  }
  if (event.type === 'RESOLVE_STRESSOR') {
    return { action: 'resolve', type };
  }
  return null;
}

/**
 * Crisis WITHDRAWAL (undo) — the directive composition for undoLastEvent:
 * undoing an onset must withdraw the twin the inject directive registered
 * ('withdraw' — restoring the snapshotted copy an upsert overwrote, when one
 * exists), and undoing a resolution must un-resolve the twin from the
 * snapshot ('restore'). The snapshot is the `campaignTwin` crisisTwinFor
 * stamped onto logEntry.undo BEFORE the forward directive ran; the
 * spread/re-ignited guards and the legacy-entry fallback live in the store
 * consumer (campaignSlice.undoCampaignStressorBridge). The settlement-side
 * scrub is events/undoEvent.js — this composes only the campaign half.
 * Returns null for non-crisis log entries.
 *
 * @param {any} logEntry  the popped entry
 * @returns {{ action: 'withdraw'|'restore', type: string, twin: Object|null }|null}
 */
export function crisisWithdraw(logEntry) {
  const event = logEntry?.event;
  const type = authoredCrisisType(event);
  if (!type) return null;
  const twin = logEntry?.undo?.campaignTwin ?? null;
  if (event.type === 'APPLY_STRESSOR') return { action: 'withdraw', type, twin };
  if (event.type === 'RESOLVE_STRESSOR') return { action: 'restore', type, twin };
  return null;
}

/**
 * The roaming campaign twin a crisis event's directive is about to touch —
 * matched exactly the way the 'resolve' consumer matches (alias-mapped type,
 * ACTIVE, affecting this save), read from the PRE-event campaign so
 * applyEvent can stamp it onto logEntry.undo and crisisWithdraw can compose
 * the restore. Returns the raw stored record (cloned), or null when no
 * active twin exists yet.
 *
 * @param {any[]} worldStressors  campaign.worldState.stressors
 * @param {any} event
 * @param {string|number} settlementId
 * @returns {Object|null}
 */
export function crisisTwinFor(worldStressors, event, settlementId) {
  const authoredType = authoredCrisisType(event);
  const roamingType = pulseTypeForStressorKey(authoredType) || authoredType;
  if (!roamingType) return null;
  const sid = String(settlementId || '');
  const raw = (worldStressors || []).find(st => {
    const n = normalizeStressor(st);
    return n.status === 'active'
      && String(n.type).toLowerCase() === String(roamingType).toLowerCase()
      && (String(n.originSettlementId || '') === sid
        || (n.affectedSettlementIds || []).map(String).includes(sid));
  });
  return raw ? deepClone(raw) : null;
}
