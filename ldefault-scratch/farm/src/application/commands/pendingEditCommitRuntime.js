/**
 * Lazy application seam for the pending-edit command.
 *
 * The settlement store owns selection and its established transaction writer;
 * this module owns command construction, execution, and compatibility mapping.
 * Keeping that orchestration here prevents the store slice from becoming a
 * second command executor while preserving the authoring-only lazy boundary.
 */

import {
  pendingEditCommitCommand,
  pendingEditFacadeResult,
} from './adapters/pendingEditCommit.js';
import { executeSessionCommand } from './sessionCommandRuntime.js';

/**
 * @param {object} scope exact owner-scoped selection captured before this import
 * @param {{
 *   journalScope: object|Function,
 *   readContext: () => {
 *     ownerKey:string|null,
 *     saveId:string|null,
 *     revision?:string|null,
 *     sourceFingerprint?:string|null,
 *   },
 *   commit: (selection:object) => Promise<object>|object,
 *   now?: string,
 * }} dependencies
 */
export async function runPendingEditCommitCommand(scope, dependencies) {
  const command = pendingEditCommitCommand(scope, {
    now: dependencies.now || new Date().toISOString(),
  });
  const receipt = await executeSessionCommand(command, {
    ...dependencies.readContext(),
    journalScope: dependencies.journalScope,
    actions: {
      commitPendingEditScope: dependencies.commit,
    },
  });
  return pendingEditFacadeResult(receipt);
}
