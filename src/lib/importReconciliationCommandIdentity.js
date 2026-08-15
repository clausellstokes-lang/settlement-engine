/**
 * Stable command identity for structured-import reconciliation.
 *
 * This module is deliberately smaller than the preview/execution engine. The
 * standard command registry may import it eagerly without also pulling hostile
 * export parsing, candidate ranking, or review-session logic into unrelated
 * command consumers.
 */

import { commandIdForValue } from '../application/commands/commandEnvelope.js';
import {
  cleanText,
  deepFreeze,
  detachedRecord,
  isRecord,
  sourceIdOf,
} from './importReconciliationShared.js';

/**
 * Produce the exact fields the production adapter passes through
 * `makeCommandEnvelope`. Identity includes owner, source checksum, proposal,
 * destination, and the reviewed membership base. Source campaign content never
 * appears in the id.
 *
 * @param {unknown} draft
 * @param {{accountId?:unknown,ownerKey?:unknown,sessionEpoch?:unknown,
 *   requestedAt?:unknown,importSessionId?:unknown}} [context]
 */
export function reconciliationDraftToCommandFields(draft, context = {}) {
  if (!isRecord(draft) || !cleanText(draft.draftId) || !cleanText(draft.kind)) {
    throw new TypeError('A valid reconciliation command draft is required.');
  }
  const accountId = sourceIdOf(context.accountId);
  const ownerKey = cleanText(context.ownerKey) || null;
  if (!accountId && !ownerKey) {
    throw new TypeError('The command draft requires an accountId or ownerKey.');
  }
  const expected = isRecord(draft.expected) ? draft.expected : {};
  const targets = isRecord(draft.targets) ? draft.targets : {};
  const ownerIdentity = accountId || ownerKey;
  const campaignId = sourceIdOf(targets.campaignId);
  const sourceChecksum = cleanText(expected.sourceChecksum);
  const existingSaveId = sourceIdOf(targets.saveId);
  const createdSaveId = draft.kind === 'import.settlement.create-and-attach'
    ? deterministicImportSaveId({
        ownerIdentity,
        sourceChecksum,
        campaignId,
        proposalId: draft.proposalId,
      })
    : null;
  const saveId = existingSaveId || createdSaveId;
  const identity = {
    ownerIdentity,
    kind: draft.kind,
    campaignId,
    saveId,
    sourceChecksum,
    proposalId: draft.proposalId,
    draftId: draft.draftId,
    membershipCampaignIds: Array.isArray(expected.membershipCampaignIds)
      ? [...expected.membershipCampaignIds].map(String).sort()
      : [],
  };
  return deepFreeze(detachedRecord({
    schemaVersion: 1,
    commandId: commandIdForValue('import-reconciliation', identity),
    kind: draft.kind,
    provenance: 'manual',
    ownerRef: accountId ? { accountId } : { ownerKey },
    targets: {
      campaignId,
      saveId,
      draftId: draft.draftId,
    },
    expected: {
      sourceFingerprint: sourceChecksum || null,
      membershipCampaignIds: identity.membershipCampaignIds,
    },
    params: draft.params || {},
    correlation: {
      importSessionId: cleanText(context.importSessionId) || null,
      proposalId: draft.proposalId,
      draftId: draft.draftId,
    },
    requestedAt: cleanText(context.requestedAt) || null,
  }));
}

/**
 * Produce a deterministic owner-scoped UUID for a create draft. The row id must
 * exist before the server transaction so command replay and a lost-response
 * recovery refer to the same settlement without storing source content.
 */
export function deterministicImportSaveId({
  ownerIdentity,
  sourceChecksum,
  campaignId,
  proposalId,
}) {
  const source = [
    ownerIdentity,
    sourceChecksum,
    campaignId,
    proposalId,
  ].map(value => String(value || '')).join('\u0000');
  let hex = '';
  for (let salt = 0; salt < 4; salt += 1) {
    let hash = (0x811c9dc5 ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
    const salted = `${salt}:${source}`;
    for (let index = 0; index < salted.length; index += 1) {
      hash ^= salted.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    hex += hash.toString(16).padStart(8, '0');
  }
  const variant = ((Number.parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `${variant}${hex.slice(17, 20)}`,
    hex.slice(20, 32),
  ].join('-');
}
