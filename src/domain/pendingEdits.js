/**
 * domain/pendingEdits.js — Queue-based edit primitive with cascade preview.
 *
 * The dossier is the surface the DM edits, not a read-only view.
 * To make that safe, the
 * engine needs a queue of pending changes plus a cascade-preview that
 * shows what downstream effects each edit triggers before commit.
 *
 * Pure-functional, store-agnostic, idempotent. The UI layer (a future
 * pending-changes drawer + a CascadePreviewPanel) reads + writes
 * through this module.
 *
 * Edit shape:
 *   {
 *     id:        string         — uuid-ish, stable for revert
 *     kind:      EditKind       — see EDIT_KINDS below
 *     payload:   any            — kind-specific (renameNPC: { npcId, newName })
 *     ts:        number         — monotonic timestamp from edit clock
 *     reverted?: boolean        — soft-revert (kept in history)
 *   }
 *
 * Cascade-preview shape:
 *   {
 *     summaryLines:        string[]  — "+1 institution", "viability shifted +0.04"
 *     downstreamCounts:    { npcs?, hooks?, factions?, linkedSaves? }
 *     narrativeImpact:     'none' | 'regenerate-needed' | 'progression-suggested'
 *     warnings:            string[]
 *   }
 *
 * The cascade preview is the most important piece. Today's
 * narrative-drift modal asks "do you want to regenerate?" without
 * showing what changes. This module returns the structured delta the
 * UI can render side-by-side with the live dossier.
 */

/** @typedef {'rename-npc' | 'rename-faction' | 'rename-settlement'
 *           | 'add-institution' | 'remove-institution'
 *           | 'add-resource' | 'remove-resource'
 *           | 'add-stressor' | 'remove-stressor'
 *           | 'edit-prose'} EditKind */

export const EDIT_KINDS = Object.freeze([
  'rename-npc', 'rename-faction', 'rename-settlement',
  'add-institution', 'remove-institution',
  'add-resource', 'remove-resource',
  'add-stressor', 'remove-stressor',
  'edit-prose',
]);

const _editKindSet = new Set(EDIT_KINDS);

// Deterministic short discriminator (FNV-1a). The edit id must be stable for the
// same (kind, payload, clock) because the edit queue is PERSISTED — Math.random
// here put non-determinism into persisted state and broke replay/idempotency.
function shortHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).padStart(7, '0').slice(0, 6);
}

// ── Construction ──────────────────────────────────────────────────────

/** Build a new pending-edit. Pure; no side effects. */
export function buildEdit(kind, payload, clock = 0) {
  if (!_editKindSet.has(kind)) {
    throw new Error(`pendingEdits: unknown kind "${kind}"`);
  }
  return Object.freeze({
    id: `edit_${clock}_${shortHash(`${kind}:${JSON.stringify(payload || {})}:${clock}`)}`,
    kind,
    payload: Object.freeze({ ...(payload || {}) }),
    ts: clock,
    reverted: false,
  });
}

// ── Queue operations ─────────────────────────────────────────────────

/** Append an edit. Returns a new queue (does not mutate). */
export function appendEdit(queue, edit) {
  if (!Array.isArray(queue)) return [edit];
  return [...queue, edit];
}

/** Mark a queue entry as reverted (soft delete — kept for history). */
export function revertEdit(queue, editId) {
  if (!Array.isArray(queue)) return [];
  return queue.map(e => e.id === editId ? { ...e, reverted: true } : e);
}

/** Discard a queue entry entirely (hard delete). */
export function dropEdit(queue, editId) {
  if (!Array.isArray(queue)) return [];
  return queue.filter(e => e.id !== editId);
}

/** Reduce to the active (non-reverted) edits only. */
export function activeEdits(queue) {
  if (!Array.isArray(queue)) return [];
  return queue.filter(e => !e.reverted);
}

/** True if the queue has unapplied work the user can commit/revert. */
export function hasPending(queue) {
  return activeEdits(queue).length > 0;
}

// ── Cascade preview ───────────────────────────────────────────────────

/**
 * Compute the cascade preview for the current pending queue against
 * the live settlement. This is pure; the UI calls it whenever the
 * queue changes and renders the result in a side panel.
 *
 * The preview is *coarse* — it summarizes counts and impact bands,
 * not a full re-simulation. A full re-sim is what `commit()` does.
 *
 * @param {Object} settlement — live settlement (pre-edit state)
 * @param {Array}  queue      — pending edits to preview
 * @returns {Object} preview as documented above
 */
export function previewCascade(settlement, queue) {
  const edits = activeEdits(queue);
  const out = {
    summaryLines: [],
    downstreamCounts: {},
    narrativeImpact: 'none',
    warnings: [],
  };
  if (!edits.length) return out;
  if (!settlement || typeof settlement !== 'object') {
    out.warnings.push('No settlement to preview against.');
    return out;
  }

  let netInstitutions = 0;
  let netResources = 0;
  let netStressors = 0;
  let renames = 0;
  let proseEdits = 0;
  let structuralCount = 0;

  for (const e of edits) {
    switch (e.kind) {
      case 'add-institution':    netInstitutions += 1; structuralCount += 1; break;
      case 'remove-institution': netInstitutions -= 1; structuralCount += 1; break;
      case 'add-resource':       netResources += 1; structuralCount += 1; break;
      case 'remove-resource':    netResources -= 1; structuralCount += 1; break;
      case 'add-stressor':       netStressors += 1; structuralCount += 1; break;
      case 'remove-stressor':    netStressors -= 1; structuralCount += 1; break;
      case 'rename-npc':
      case 'rename-faction':
      case 'rename-settlement':
        renames += 1;
        break;
      case 'edit-prose':
        proseEdits += 1;
        break;
      default:
        // unknown kinds were rejected at buildEdit() — defensive only
        break;
    }
  }

  if (netInstitutions !== 0) {
    out.summaryLines.push(
      `${netInstitutions > 0 ? '+' : ''}${netInstitutions} institution${Math.abs(netInstitutions) === 1 ? '' : 's'}`
    );
  }
  if (netResources !== 0) {
    out.summaryLines.push(
      `${netResources > 0 ? '+' : ''}${netResources} resource${Math.abs(netResources) === 1 ? '' : 's'}`
    );
  }
  if (netStressors !== 0) {
    out.summaryLines.push(
      `${netStressors > 0 ? '+' : ''}${netStressors} stressor${Math.abs(netStressors) === 1 ? '' : 's'}`
    );
  }
  if (renames > 0) {
    out.summaryLines.push(`${renames} rename${renames === 1 ? '' : 's'}`);
  }
  if (proseEdits > 0) {
    out.summaryLines.push(`${proseEdits} prose edit${proseEdits === 1 ? '' : 's'}`);
  }

  // Downstream counts — approximate, drawn from the live settlement.
  out.downstreamCounts.npcs = Array.isArray(settlement.npcs) ? settlement.npcs.length : 0;
  out.downstreamCounts.factions = Array.isArray(settlement.factions) ? settlement.factions.length : 0;
  out.downstreamCounts.hooks = Array.isArray(settlement.plotHooks)
    ? settlement.plotHooks.length
    : Array.isArray(settlement.hooks) ? settlement.hooks.length : 0;
  // linkedSaves count is unknown to this module (it doesn't see the saved
  // list); the UI layer fills this in by walking savedSettlements.

  // Narrative impact:
  //   - any structural edit on a narrated save => regenerate-needed
  //   - >2 prose edits on a narrated save => progression-suggested
  //   - rename only => progression-suggested (drift detector handles)
  //   - prose edits in raw mode => none
  const isNarrated = !!settlement._narrative || !!settlement.aiSettlement || !!settlement.narrativeNotes;
  if (isNarrated) {
    if (structuralCount > 0) {
      out.narrativeImpact = 'regenerate-needed';
    } else if (proseEdits > 2 || renames > 0) {
      out.narrativeImpact = 'progression-suggested';
    }
  }

  // Warnings — surface the things the DM should think about.
  if (structuralCount > 0 && isNarrated) {
    out.warnings.push(
      'Structural change on a narrated save — the narrative layer will need regeneration to stay coherent.'
    );
  }
  if (netInstitutions < 0 && Math.abs(netInstitutions) >= 2) {
    out.warnings.push(
      'Removing multiple institutions may leave hooks and NPCs without anchors.'
    );
  }

  return out;
}
