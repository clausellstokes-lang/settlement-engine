/**
 * plainEditRuntime.js — the lazy application seam for the plain edit (EM-C4a).
 *
 * The settlement store owns the writer; this module owns command construction,
 * execution and compatibility mapping. Keeping that orchestration here prevents the
 * store slice from becoming a second command executor, and it is its OWN file because
 * standardCommandRegistry.js statically imports every adapter spec while
 * sessionCommandRuntime.js statically imports the registry: folding this into the
 * adapter would close that cycle. The estate already pays exactly this price for
 * pendingEditCommit.js / pendingEditCommitRuntime.js.
 *
 * ⛔ It is the SEVENTH row of the walker's frozen DISPATCH_SURFACE, declared in the
 * same landing (tests/application/commands/commandRegistry.walker.test.js).
 */

import {
  plainEditCommand,
  plainEditFacadeResult,
} from './adapters/plainEditApply.js';
import { executeSessionCommand } from './sessionCommandRuntime.js';

/**
 * @param {object} scope exact, owner-scoped, captured BEFORE this import
 * @param {{ journalScope: object|Function,
 *           readContext: () => { ownerKey:string|null, saveId:string|null,
 *                                revision?:string|null, sourceFingerprint?:string|null },
 *           applyPlainEdit: (request:object) => Promise<object>,
 *           now?: string }} dependencies
 */
export async function runPlainEditCommand(scope, dependencies) {
  const command = plainEditCommand(scope, {
    now: dependencies.now || new Date().toISOString(),
  });
  const receipt = await executeSessionCommand(command, {
    ...dependencies.readContext(),
    journalScope: dependencies.journalScope,
    actions: {
      applyPlainEditToDraft: dependencies.applyPlainEdit,
    },
  });
  return plainEditFacadeResult(receipt);
}
