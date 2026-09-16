/**
 * commandContext.js — live capabilities and freshness at the execution boundary.
 *
 * The command is serializable intent. The context is deliberately not: it holds
 * the current owner/target observations and injected terminal writers. Keeping
 * the two separate prevents callbacks or store references from leaking into
 * queues, logs, or server payloads.
 */

/** @param {unknown} value @returns {string|null} */
function optionalId(value) {
  return value == null || value === '' ? null : String(value);
}

/**
 * Normalize the live context an executor may inspect.
 *
 * `journalScope` is an opaque object/function used only to isolate in-memory
 * replay records (for example, one Zustand store instance). It is never written
 * into a command or receipt.
 */
export function makeCommandContext(fields = {}) {
  return {
    ownerId: optionalId(fields.ownerId),
    ownerKey: optionalId(fields.ownerKey),
    saveId: optionalId(fields.saveId),
    campaignId: optionalId(fields.campaignId),
    revision: optionalId(fields.revision),
    sourceFingerprint: optionalId(fields.sourceFingerprint),
    sessionEpoch: optionalId(fields.sessionEpoch),
    actions: fields.actions && typeof fields.actions === 'object'
      ? fields.actions
      : {},
    now: optionalId(fields.now),
    journalScope: (
      fields.journalScope
      && (
        typeof fields.journalScope === 'object'
        || typeof fields.journalScope === 'function'
      )
    ) ? fields.journalScope : null,
  };
}

/**
 * Check identity before consulting the replay journal. This prevents a receipt
 * created for owner/save A from being revealed or reused while B is active.
 */
export function checkCommandIdentity(command, context) {
  if (command.ownerRef?.accountId) {
    if (!context.ownerId) {
      return { ok: false, status: 'stale', reason: 'owner_context_missing' };
    }
    if (context.ownerId !== command.ownerRef.accountId) {
      return { ok: false, status: 'stale', reason: 'owner_changed' };
    }
  }
  if (command.ownerRef?.ownerKey) {
    if (!context.ownerKey) {
      return { ok: false, status: 'stale', reason: 'owner_context_missing' };
    }
    if (context.ownerKey !== command.ownerRef.ownerKey) {
      return { ok: false, status: 'stale', reason: 'owner_changed' };
    }
  }
  if (command.targets?.saveId) {
    if (!context.saveId) {
      return { ok: false, status: 'stale', reason: 'save_context_missing' };
    }
    if (context.saveId !== command.targets.saveId) {
      return { ok: false, status: 'stale', reason: 'save_changed' };
    }
  }
  if (command.targets?.campaignId) {
    if (!context.campaignId) {
      return { ok: false, status: 'stale', reason: 'campaign_context_missing' };
    }
    if (context.campaignId !== command.targets.campaignId) {
      return { ok: false, status: 'stale', reason: 'campaign_changed' };
    }
  }
  return { ok: true };
}

/**
 * Check behavior-bearing source observations only after a completed replay has
 * been ruled out. A command naturally changes its own source revision; replay
 * must therefore find its receipt before comparing the old precondition again.
 */
export function checkCommandFreshness(command, context) {
  const checks = [
    ['revision', 'revision_changed'],
    ['sourceFingerprint', 'source_changed'],
    ['sessionEpoch', 'session_changed'],
  ];
  for (const [field, reason] of checks) {
    const expected = command.expected?.[field];
    if (expected == null) continue;
    if (context[field] == null) {
      return { ok: false, status: 'stale', reason: `${field}_missing` };
    }
    if (String(context[field]) !== String(expected)) {
      return { ok: false, status: 'stale', reason };
    }
  }
  return { ok: true };
}
