/**
 * Lazy command-plane entry for one structured-import draft.
 *
 * The store captures owner/campaign freshness before loading this module. This
 * runtime constructs the stable envelope, optionally clears one unknown local
 * receipt for an explicit server replay check, and invokes the shared command
 * executor. It does not own persistence or mutate Zustand.
 */

import { importReconciliationCommand } from './adapters/importReconciliationApply.js';
import {
  executeSessionCommand,
  forgetSessionCommandReceipt,
} from './sessionCommandRuntime.js';

/**
 * @param {object} draft
 * @param {{
 *   ownerId:string,
 *   importSessionId:string,
 *   sourceChecksum:string,
 *   journalScope:object|Function,
 *   now?:string|null,
 *   reconcileDurable?:boolean,
 *   apply:(command:object)=>Promise<object>|object,
 * }} dependencies
 */
export async function runImportReconciliationCommand(draft, dependencies) {
  const command = importReconciliationCommand(draft, {
    accountId: dependencies.ownerId,
    importSessionId: dependencies.importSessionId,
    requestedAt: dependencies.now || null,
  });
  if (dependencies.reconcileDurable === true) {
    forgetSessionCommandReceipt(command, dependencies.journalScope);
  }
  return executeSessionCommand(command, {
    ownerId: dependencies.ownerId,
    campaignId: command.targets.campaignId,
    saveId: command.targets.saveId,
    sourceFingerprint: dependencies.sourceChecksum,
    journalScope: dependencies.journalScope,
    actions: {
      applyImportReconciliationCommand: dependencies.apply,
    },
  });
}
