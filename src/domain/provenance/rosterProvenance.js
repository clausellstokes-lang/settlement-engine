/**
 * domain/provenance/rosterProvenance.js — THE ONE read-side provenance record.
 *
 * WHY THIS EXISTS (atlas economy-family gap 11b, R-5b item #10)
 * Two independent writers stamp "who did this" onto a settlement's roster and
 * they have never agreed on a spelling:
 *
 *   A. the COMPOSER lane (a DM event through domain/events/applyEvent) stamps
 *      `createdByEventId` / `removedByEventId` / `destroyedByEventId`;
 *   B. the WORLD-PULSE lane (a seeded advance, or a proposal armed from one)
 *      stamps `createdByWorldPulseOutcomeId` / `foundedByWorldPulseOutcomeId` /
 *      `reopenedByWorldPulseOutcomeId` / `closedByWorldPulseOutcomeId` /
 *      `removedByWorldPulseOutcomeId` / `demotedByWorldPulseOutcomeId`, plus the
 *      `_worldPulse*` booleans and `worldPulseFate` / `builtReason` /
 *      `remnantReason`.
 *
 * NOBODY READ EITHER. A pulse-built forge and a DM-added one both rendered with
 * the generation fallback tint and no badge — indistinguishable from a town the
 * player had never touched. This module is the join that closes that gap.
 *
 * THE MERGE IS READ-SIDE ONLY — deliberately, for three load-bearing reasons:
 *   1. `createdByEventId` / `causeEventId` / `removedByEventId` are the exact
 *      keys undoLastEvent's scrub machinery matches on (events/undoEvent.js,
 *      withoutEventCreations + stripImpairmentsForEvent). Renaming or
 *      consolidating them breaks undo for every already-persisted eventLog entry.
 *   2. `institutionHistory` is an ENGINE INPUT: worldPulse/institutionLifecycle's
 *      priorLifecycleCounts counts entries by `fate` under a 24-entry cap and
 *      damps build/close probability with the result. Any write-side merge that
 *      adds, renames, or evicts entries is seeded-advance drift under THE PROMISE.
 *   3. Legacy saved rows carry the old stamps forever, so the read side has to
 *      join both families regardless — a write-side merge buys nothing.
 *
 * So: nothing here is ever persisted, and nothing here is read by the engine.
 * The record is derived per call, absent-tolerant in every branch (a fully
 * unstamped legacy row lands 'unknown' rather than throwing), and safe on a
 * regen-fresh roster where every institution is plain generation output.
 *
 * PURITY / LAYERING: a leaf. It imports the zero-import custom-content authority
 * and the zero-import kernel slugify and nothing else — no store, no generators,
 * no catalog. That keeps it free to ride a lazily-loaded display chunk without
 * re-parenting a heavier module into the eager first-paint closure.
 */

import { isMaterializedCustomContent } from '../content/customContentSemanticAuthority.js';
import { slugify } from '../../kernel/slugify.js';

/**
 * Where a roster row came from, or what last happened to it.
 * 'dm-realm-order' is the DM's SHIFT_TIER verb, which reuses the world-pulse
 * apply path verbatim under a namespaced outcome id — see DM_REALM_ORDER_PREFIX.
 * @typedef {'generation'|'dm-event'|'world-pulse'|'dm-realm-order'|'custom'|'unknown'} ProvenanceOrigin
 */
/** @typedef {'event'|'pulse-outcome'|null} ProvenanceRefKind */
/** @typedef {{ origin: ProvenanceOrigin, refKind: ProvenanceRefKind, refId: string|null, sourceTag: string|null, reason: string|null }} ProvenanceCreation */
/** @typedef {{ fate: string|null, origin: ProvenanceOrigin, refKind: ProvenanceRefKind, refId: string|null, reason: string|null }} ProvenanceLifecycle */
/** @typedef {{ events: ReadonlyArray<Record<string, unknown>>, pulse: ReadonlyArray<Record<string, unknown>> }} ProvenanceTrails */
/**
 * @typedef {{
 *   kind: 'institution'|'resource',
 *   created: ProvenanceCreation,
 *   lastLifecycle: ProvenanceLifecycle|null,
 *   trails: ProvenanceTrails
 * }} RosterProvenance
 */

/**
 * The DM's SHIFT_TIER verb (events/mutateEntities.shiftTier) reuses the organic
 * tier-apply path so the roster surgery and the histories stay byte-identical to
 * an organic tier change — but it namespaces its synthetic outcome id so the two
 * lanes remain TELLABLE APART on the read side. This prefix is the whole tell;
 * it is pinned in tests/domain/provenance/rosterProvenance.test.js.
 */
export const DM_REALM_ORDER_PREFIX = 'dm_shift_tier:';

/** The composer verbs whose event log entries are a resource's event trail. */
export const RESOURCE_EVENT_TYPES = Object.freeze([
  'ADD_RESOURCE', 'REMOVE_RESOURCE', 'DEPLETE_RESOURCE', 'RECOVERED_RESOURCE',
]);

/** Statuses that mean "this row is no longer standing". */
const INACTIVE_STATUSES = Object.freeze(['removed', 'destroyed', 'remnant', 'ruined']);

/** @type {ProvenanceTrails} */
const NO_TRAILS = Object.freeze({ events: Object.freeze([]), pulse: Object.freeze([]) });

/**
 * Boolean-only adapter for the shared custom-content authority — the SAME
 * mechanical boundary institutionClassify.js wraps, and for the same reason: the
 * shared predicate is a `value is Record<string, unknown>` type guard, so calling
 * it directly on an already-Record parameter narrows the NEGATIVE branch to
 * `never` and every subsequent field read becomes a strict-mode error. Wrapping
 * it in a plain boolean keeps the runtime authority and the types both intact.
 * @param {Record<string, unknown>} value @returns {boolean}
 */
function isCustomRow(value) {
  return isMaterializedCustomContent(value);
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function asRecord(value) {
  return (value && typeof value === 'object' && !Array.isArray(value))
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** A non-empty trimmed string, or null. Absent-tolerance lives here.
 * @param {unknown} value @returns {string|null} */
function textOrNull(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}

/** @param {unknown} value @returns {ReadonlyArray<unknown>} */
function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/** The roster's own key form — the SAME slug mutateWorld's resolveRosterKey /
 * slugEq compare with (kernel slugify, underscore separator). Never hand-rolled:
 * a bespoke matcher is the faction-key defect class in resource clothing.
 * @param {unknown} value @returns {string} */
function rosterSlug(value) {
  return slugify(value, { sep: '_' });
}

/** A world-pulse outcome id tells whether the touch was organic or DM-ordered.
 * @param {string|null} outcomeId @returns {'world-pulse'|'dm-realm-order'} */
function originForOutcomeId(outcomeId) {
  return outcomeId && outcomeId.startsWith(DM_REALM_ORDER_PREFIX)
    ? 'dm-realm-order'
    : 'world-pulse';
}

/** @param {ProvenanceOrigin} origin @param {ProvenanceRefKind} refKind
 * @param {string|null} refId @param {string|null} sourceTag @param {string|null} reason
 * @returns {ProvenanceCreation} */
function creation(origin, refKind, refId, sourceTag, reason) {
  return { origin, refKind, refId, sourceTag, reason };
}

// ── Institutions ────────────────────────────────────────────────────────────

/**
 * Creation slot, in precedence order. The order is not arbitrary — each step is
 * the only writer of the field it reads:
 *
 *   1. CUSTOM outranks everything. ✦ semantics are an ownership boundary, not a
 *      badge: worldPulse/tierOutcomeApply and institutionLifecycle both refuse to
 *      touch a materialized custom row at all, so a custom row wearing a pulse
 *      stamp is a legacy artifact, not an attribution.
 *   2. `createdByEventId` — minted ONLY by mutateEntities.addInstitution for a
 *      genuinely new row (the idempotent un-remove branch deliberately does not
 *      stamp it, which is exactly why undo can use it).
 *   3. `source` — written ONLY by generation (generators/steps/assembleInstitutions).
 *      No world-pulse writer ever sets it, so its presence is proof of a
 *      generation birth. It is read BEFORE the pulse ids on purpose: a
 *      GENERATION-born institution that a later promotion REACTIVATES picks up
 *      `createdByWorldPulseOutcomeId` from tierOutcomeApply's reactivation branch
 *      (`inst.createdByWorldPulseOutcomeId || outcome.id`). Reading the pulse id
 *      first would relabel the town's original granary as world-grown. A
 *      reactivation is a lifecycle touch, not a birth.
 *   4. the pulse CREATION ids — foundedBy… (moral founding) then createdBy…
 *      (economic build / tier addition / entrepôt). A `dm_shift_tier:` prefix
 *      makes it the DM's realm order rather than the world's own doing.
 *   5. the pulse creation BOOLEANS alone, for rows whose outcome carried no id
 *      (`outcome.id || null` is a real branch in every pulse writer).
 *   6. otherwise 'unknown' — a fully unstamped legacy row, honestly labelled.
 *
 * @param {Record<string, unknown>} inst @returns {ProvenanceCreation}
 */
function institutionCreation(inst) {
  if (isCustomRow(inst)) {
    return creation('custom', null, null, textOrNull(inst.source), null);
  }
  const eventId = textOrNull(inst.createdByEventId);
  if (eventId) return creation('dm-event', 'event', eventId, null, null);

  const sourceTag = textOrNull(inst.source);
  if (sourceTag) return creation('generation', null, null, sourceTag, null);

  const builtReason = textOrNull(inst.builtReason);
  const outcomeId = textOrNull(inst.foundedByWorldPulseOutcomeId)
    || textOrNull(inst.createdByWorldPulseOutcomeId);
  if (outcomeId) {
    return creation(originForOutcomeId(outcomeId), 'pulse-outcome', outcomeId, null, builtReason);
  }
  if (inst._worldPulseFounded === true
    || inst._worldPulseEconomyBuilt === true
    || inst._worldPulseTierAdded === true) {
    return creation('world-pulse', 'pulse-outcome', null, null, builtReason);
  }
  return creation('unknown', null, null, null, null);
}

/**
 * Latest lifecycle touch, or null when the row has never been closed, removed,
 * demoted or reopened.
 *
 * THE STANDING GUARD comes first because the pulse reopen branch does NOT clear
 * the stamps its own earlier closure wrote (institutionLifecycle's `restored`
 * object keeps `closedByWorldPulseOutcomeId` and `remnantReason`). Reading a
 * closure stamp off a currently-ACTIVE institution would report a shuttering
 * that has since been undone.
 *
 * THE TIE-BREAK: a row can carry both a composer removal stamp and a pulse
 * closure stamp (a DM closes it, a later pulse-era save still holds the old
 * remnant fields, or vice versa). Current `status` decides, because status is
 * what the last writer actually left behind: 'removed'/'destroyed' is the
 * composer's own STATUS_REMOVED vocabulary, 'remnant'/'ruined' is the pulse's.
 *
 * THE RAISING CASE: the pulse `found` verb has two branches, and only the NEW
 * one is a birth. Re-founding an institution that had fallen writes
 * `foundedByWorldPulseOutcomeId` onto a row that already existed, exactly as the
 * reopen branch does — so when the creation slot has already attributed the row
 * to something else, that same stamp is the row's LATEST TOUCH, not its origin.
 * Comparing against the creation slot's refId is what keeps a genuinely
 * pulse-founded row from reporting its own birth twice. HONEST LIMIT: when the
 * founding outcome carried no id at all (`outcome.id || null` is a real branch
 * in every pulse writer), the two slots both hold null and the raising is
 * indistinguishable from a birth — the record stays silent rather than guessing.
 *
 * @param {Record<string, unknown>} inst
 * @param {ProvenanceCreation} created the already-decided creation slot
 * @returns {ProvenanceLifecycle|null}
 */
function institutionLastLifecycle(inst, created) {
  const status = String(inst.status ?? '').toLowerCase();
  const standing = inst._worldPulseInactive !== true && !INACTIVE_STATUSES.includes(status);
  const reopenedId = textOrNull(inst.reopenedByWorldPulseOutcomeId);
  if (standing) {
    if (reopenedId) {
      return {
        fate: 'reopened',
        origin: originForOutcomeId(reopenedId),
        refKind: 'pulse-outcome',
        refId: reopenedId,
        reason: textOrNull(inst.builtReason),
      };
    }
    const refoundedId = textOrNull(inst.foundedByWorldPulseOutcomeId);
    if (refoundedId && created.refId !== refoundedId) {
      return {
        fate: 'founded',
        origin: originForOutcomeId(refoundedId),
        refKind: 'pulse-outcome',
        refId: refoundedId,
        reason: textOrNull(inst.builtReason),
      };
    }
    return null;
  }

  const eventRemovalId = textOrNull(inst.removedByEventId) || textOrNull(inst.destroyedByEventId);
  const pulseClosureId = textOrNull(inst.closedByWorldPulseOutcomeId)
    || textOrNull(inst.removedByWorldPulseOutcomeId)
    || textOrNull(inst.demotedByWorldPulseOutcomeId);
  const fate = textOrNull(inst.worldPulseFate);
  const pulseReason = textOrNull(inst.remnantReason) || textOrNull(inst.removedReason);

  const composerWins = eventRemovalId
    && (!pulseClosureId || status === 'removed' || status === 'destroyed');
  if (composerWins) {
    return {
      fate: status === 'destroyed' ? 'destroyed' : 'removed',
      origin: 'dm-event',
      refKind: 'event',
      refId: eventRemovalId,
      reason: null,
    };
  }
  if (pulseClosureId || fate) {
    return {
      fate,
      origin: originForOutcomeId(pulseClosureId),
      refKind: pulseClosureId ? 'pulse-outcome' : null,
      refId: pulseClosureId,
      reason: pulseReason,
    };
  }
  return null;
}

/**
 * THE READ-SIDE JOIN for one institution. Pure, absent-tolerant, never throws.
 * @param {unknown} institution @returns {RosterProvenance}
 */
export function institutionProvenanceOf(institution) {
  const inst = asRecord(institution);
  const created = institutionCreation(inst);
  return {
    kind: 'institution',
    created,
    lastLifecycle: institutionLastLifecycle(inst, created),
    // Institutions carry their stamps on the row itself; there is no per-row
    // journal to walk, so the trails stay empty by construction.
    trails: NO_TRAILS,
  };
}

// ── Resources ───────────────────────────────────────────────────────────────

/** @param {unknown} entry @returns {Record<string, unknown>} */
function logEntryEvent(entry) {
  return asRecord(asRecord(entry).event);
}

/**
 * THE READ-SIDE JOIN for one resource key — deliberately weaker than the
 * institution join, and honest about it.
 *
 * A resource roster key carries NO per-key stamp: both writers funnel through
 * the same `{ key, custom }` resourceEdits shape, and resourceDynamicsKernel
 * says so out loud ("organic ≡ forced" — an organic draw writes the identical
 * record a forced ADD_RESOURCE writes). Per-entry attribution is therefore
 * impossible, and faking one would be a false claim on a DM-facing surface.
 *
 * So the record reports BOTH TRAILS and decides `created.origin` only when
 * exactly one of them can account for the key being present at all. Neither
 * journal carries a tick (resourceHistory entries are
 * `{resource,state,outcomeId,reason}`; eventLog entries are wall-clock
 * `appliedAt` on a different clock), so cross-journal ORDERING is undecidable
 * for every already-saved row — which is why `lastLifecycle` is always null
 * here. The trails are the honest API; a "last changed by X" line is not.
 *
 * `eventLog` is canon-mode-only and is reset by regeneration / uncanonize
 * (settlementSlice), so an absent log degrades to an empty events trail rather
 * than an exception.
 *
 * @param {unknown} key the roster key (catalog slug or verbatim custom label)
 * @param {unknown} settlement
 * @param {{ eventLog?: unknown }} [options]
 * @returns {RosterProvenance}
 */
export function resourceProvenanceOf(key, settlement, options = {}) {
  const s = asRecord(settlement);
  const config = asRecord(s.config);
  const wanted = rosterSlug(key);

  /** @type {Array<Record<string, unknown>>} */
  const events = [];
  /** @type {Array<Record<string, unknown>>} */
  const pulse = [];
  if (wanted) {
    for (const entry of asArray(options.eventLog)) {
      const event = logEntryEvent(entry);
      if (!RESOURCE_EVENT_TYPES.includes(String(event.type ?? ''))) continue;
      if (rosterSlug(event.targetId) !== wanted) continue;
      events.push(asRecord(entry));
    }
    for (const entry of asArray(s.resourceHistory)) {
      const row = asRecord(entry);
      if (rosterSlug(row.resource) !== wanted) continue;
      pulse.push(row);
    }
  }
  /** @type {ProvenanceTrails} */
  const trails = { events, pulse };

  const isCustom = wanted !== '' && asArray(config.nearbyResourcesCustom)
    .some(label => rosterSlug(label) === wanted);
  if (isCustom) {
    return { kind: 'resource', created: creation('custom', null, null, null, null), lastLifecycle: null, trails };
  }

  // "Attributes the key's PRESENCE" — an opening, not any touch. A depletion or
  // a strike explains a key's STATE, never how it got onto the roster.
  const addedByEvent = events.find(entry => String(logEntryEvent(entry).type ?? '') === 'ADD_RESOURCE');
  const discoveredByPulse = pulse.find(row => String(row.state ?? '') === 'discovered');
  if (addedByEvent && !discoveredByPulse) {
    const eventId = textOrNull(logEntryEvent(addedByEvent).id);
    return {
      kind: 'resource',
      created: creation('dm-event', 'event', eventId, null, null),
      lastLifecycle: null,
      trails,
    };
  }
  if (discoveredByPulse && !addedByEvent) {
    const outcomeId = textOrNull(discoveredByPulse.outcomeId);
    return {
      kind: 'resource',
      created: creation(originForOutcomeId(outcomeId), 'pulse-outcome', outcomeId, null, textOrNull(discoveredByPulse.reason)),
      lastLifecycle: null,
      trails,
    };
  }
  // Nothing accounts for it (generation-born, or the log was reset), or BOTH do
  // and no ordering exists to break the tie. Either way: 'unknown', trails shown.
  return { kind: 'resource', created: creation('unknown', null, null, null, null), lastLifecycle: null, trails };
}
