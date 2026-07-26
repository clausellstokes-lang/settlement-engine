/**
 * settlementPendingEditWriters.js — lazy domain writers for staged dossier edits.
 *
 * The public settlement slice loads this module only when a reviewed batch is
 * committed. Keeping the writer behind that user-action boundary preserves the
 * first-paint ratchet without weakening the transaction contract: payloads are
 * admitted by pendingEditIntents, then independently checked here against live
 * state before an existing store action performs or persists the mutation.
 */

import { validateNpcFacet } from '../domain/npc/npcFacetContract.js';
import { recordCanonFlavorEntryImpl } from './settlementRenameHelpers.js';

const TABLE_SOURCE = 'table';
const TABLE_AUTHORABLE_EVENT_TYPES = new Set([
  'RESOLVE_STRESSOR',
  'APPLY_STRESSOR',
  'EXPOSE_CORRUPTION',
]);
const STASIS_REASONS = new Set([
  'journey',
  'imprisoned',
  'missing',
  'sequestered',
]);
const SEAT_FIELDS = new Set([
  'institutionId',
  'factionLink',
  'factionAffiliation',
  'settlementId',
  'role',
  'linkedInstitutionIds',
  'linkedFactionIds',
]);

/**
 * @param {string} reason
 * @returns {{ ok:false, status:'failed', reason:string }}
 */
function refusal(reason) {
  return { ok: false, status: 'failed', reason };
}

/**
 * Apply one NPC operation to the unique NPC named by durable id.
 *
 * Rich native roles are deliberately not overwritten by the bounded role
 * archetype; `npc.facets.role` is the simulation declaration, while `npc.role`
 * remains the authored display identity.
 *
 * @param {Function} get
 * @param {Function} set
 * @param {{ kind?:string, payload?:Record<string, any> }} edit
 * @returns {{ ok:boolean, status:'applied'|'queued'|'failed', reason:string|null }}
 */
export function applyNpcOp(get, set, edit) {
  const kind = edit?.kind;
  const payload = edit?.payload || {};
  let changed = false;
  let reason = 'writer_refused';
  let rescueCaptorId = null;

  set((state) => {
    const matches = (state.settlement?.npcs || []).filter(
      (npc) => String(npc?.id ?? '') === String(payload.npcId ?? ''),
    );
    if (matches.length !== 1) {
      reason = matches.length ? 'npc_target_ambiguous' : 'npc_target_missing';
      return;
    }
    const npc = matches[0];

    if (kind === 'edit-npc') {
      if (!validateNpcFacet(payload.facetKind, payload.value).ok) {
        reason = 'npc_facet_invalid';
        return;
      }
      if (npc.facets?.[payload.facetKind] === payload.value) {
        reason = 'no_effect';
        return;
      }
      npc.facets = {
        ...(npc.facets || {}),
        [payload.facetKind]: payload.value,
      };
      if (payload.facetKind === 'temperament') {
        npc.personality = {
          ...(npc.personality || {}),
          dominant: payload.value,
        };
      } else if (payload.facetKind === 'goal') {
        npc.goal = {
          ...(npc.goal || {}),
          short: payload.value,
        };
      }
    } else if (kind === 'reassign-npc') {
      const target = payload.target;
      const fields = target && typeof target === 'object'
        ? Object.keys(target)
        : [];
      if (!fields.length || fields.some((field) => !SEAT_FIELDS.has(field))) {
        reason = 'npc_assignment_field_invalid';
        return;
      }
      const hasChange = Object.entries(target).some(
        ([field, value]) => JSON.stringify(npc[field]) !== JSON.stringify(value),
      );
      if (!hasChange) {
        reason = 'no_effect';
        return;
      }
      Object.assign(npc, target);
    } else if (kind === 'stasis-npc') {
      if (!STASIS_REASONS.has(payload.reason)) {
        reason = 'stasis_reason_invalid';
        return;
      }
      if (npc.stasis?.reason === payload.reason) {
        reason = 'no_effect';
        return;
      }
      npc.stasis = { reason: payload.reason };
    } else if (kind === 'return-npc') {
      if (!npc.stasis) {
        reason = 'npc_not_in_stasis';
        return;
      }
      delete npc.stasis;
    } else if (kind === 'ransom-npc' || kind === 'rescue-npc') {
      const whereabouts = npc.whereabouts;
      if (whereabouts?.state !== 'hostage') {
        reason = 'npc_not_hostage';
        return;
      }
      npc.whereabouts = {
        ...whereabouts,
        partyRelease: kind === 'ransom-npc' ? 'ransom' : 'rescue',
      };
      if (kind === 'rescue-npc') {
        rescueCaptorId = String(whereabouts.placeId || '');
      }
    } else if (kind === 'champion-npc') {
      if (typeof payload.contestId !== 'string' || !payload.contestId) {
        reason = 'contest_id_required';
        return;
      }
      if (npc.contestBacking === payload.contestId) {
        reason = 'no_effect';
        return;
      }
      npc.contestBacking = payload.contestId;
    } else if (kind === 'recall-npc') {
      const whereabouts = npc.whereabouts;
      if (!['traveling', 'visiting'].includes(whereabouts?.state)) {
        reason = 'npc_not_recallable';
        return;
      }
      npc.whereabouts = { ...whereabouts, recall: true };
    } else {
      reason = 'kind_not_supported';
      return;
    }

    changed = true;
    reason = null;
  });

  if (!changed) return refusal(reason);
  get().persistActiveSaveEdit?.();

  // Rescue consequences use the existing party-impact path. It stays behind a
  // second lazy boundary because only one successful operation needs it.
  if (rescueCaptorId) {
    import('./roadsRescueInflame.js')
      .then((module) => module.fireRescueInflame(get, rescueCaptorId))
      .catch(() => {});
  }
  const queued = ['ransom-npc', 'rescue-npc', 'champion-npc', 'recall-npc']
    .includes(kind);
  return {
    ok: true,
    status: queued ? 'queued' : 'applied',
    reason: null,
  };
}

/**
 * Apply one closed Session Ledger directive through the established canon
 * actions. Free text remains flavor; every mechanical field is reconstructed
 * and validated at admission before this writer sees it.
 *
 * @param {Function} get
 * @param {Function} set
 * @param {{ id?:string, payload?:Record<string, any> }} edit
 */
export function applyTableEvent(get, set, edit) {
  const directive = edit?.payload?.directive;
  if (!directive || typeof directive !== 'object') {
    return refusal('table_event_incomplete');
  }
  const intentId = String(edit?.id || '');

  if (directive.dispatch === 'flavor') {
    const entry = directive.entry || {};
    if (entry.source !== TABLE_SOURCE) return refusal('table_source_required');
    const existing = (get().eventLog || []).find(
      (candidate) => String(candidate?.sourceIntentId || '') === intentId,
    );
    if (existing) {
      return {
        ok: true,
        status: 'applied',
        reason: null,
        receipt: existing,
      };
    }
    const recorded = recordCanonFlavorEntryImpl(get, set, {
      type: typeof entry.type === 'string' ? entry.type : 'TABLE_INCIDENT',
      narrativeSummary: typeof entry.narrativeSummary === 'string'
        ? entry.narrativeSummary
        : '',
      source: TABLE_SOURCE,
      sourceIntentId: intentId,
    });
    if (!recorded) return refusal('canon_required');
    get().persistActiveSaveEdit?.();
    return {
      ok: true,
      status: 'applied',
      reason: null,
      receipt: (get().eventLog || []).find(
        (candidate) => candidate?.sourceIntentId === intentId,
      ) || null,
    };
  }

  if (directive.dispatch !== 'applyEvent') {
    return refusal('table_dispatch_invalid');
  }
  const rawEvent = directive.event || {};
  if (rawEvent.source !== TABLE_SOURCE) return refusal('table_source_required');
  if (!TABLE_AUTHORABLE_EVENT_TYPES.has(rawEvent.type)) {
    return refusal('table_event_type_invalid');
  }

  const eventId = rawEvent.id || `table.${intentId}`;
  const existingLog = (get().eventLog || []).find(
    (entry) => String(entry?.event?.id || '') === String(eventId),
  );
  const existingQueue = (get().campaigns || [])
    .flatMap((campaign) => campaign?.worldState?.pendingEvents || [])
    .find((entry) => String(entry?.event?.id || '') === String(eventId));
  if (existingLog || existingQueue) {
    return {
      ok: true,
      status: existingQueue ? 'queued' : 'applied',
      reason: null,
      receipt: existingLog || existingQueue,
    };
  }

  const result = get().applyEvent?.({ ...rawEvent, id: eventId });
  if (!result || result.ok === false || result.queued === false) {
    return {
      ...refusal(
        result?.before?.reason || result?.veto?.code || 'event_refused',
      ),
      receipt: result || null,
    };
  }
  return {
    ok: true,
    status: result.queued === true ? 'queued' : 'applied',
    reason: null,
    receipt: result.receipts?.[0] || result,
  };
}

/**
 * Total non-rename router used by the transaction coordinator.
 *
 * @param {Function} get
 * @param {Function} set
 * @param {{ kind?:string, payload?:Record<string, any> }} edit
 */
export function applyEditOp(get, set, edit) {
  if (edit?.kind === 'table-event') return applyTableEvent(get, set, edit);
  return applyNpcOp(get, set, edit);
}
