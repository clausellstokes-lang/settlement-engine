/**
 * sessionCommandRuntime.js — the live tab/store command boundary.
 *
 * This singleton gives independently-rendered manual and Surveyor surfaces one
 * in-session replay journal. Store callers pass their Zustand `get` function as
 * `journalScope`, isolating test/embedded store instances; Surveyor uses the
 * default app-session bucket. This runtime itself promises only session replay;
 * a command-specific adapter may additionally claim durable server identity
 * and reports that stronger state in its receipt. Canon-event and structured-
 * import adapters already use that stronger command-specific authority.
 */

import {
  createCommandExecutor,
  createMemoryCommandJournal,
} from './executeCommand.js';
import { commandJournalKey } from './commandEnvelope.js';
import { standardCommandRegistry } from './standardCommandRegistry.js';

const journal = createMemoryCommandJournal();
const executor = createCommandExecutor({
  registry: standardCommandRegistry,
  journal,
});

export function executeSessionCommand(command, context) {
  return executor.execute(command, context);
}

/** Test/logout lifecycle hook. Passing a scope clears only that store instance. */
export function clearSessionCommandJournal(scope = null) {
  journal.clear(scope);
}

export function sessionCommandJournalEntries(scope = null) {
  return journal.entries(scope);
}

/**
 * Forget one in-session receipt at an explicit durable-reconciliation boundary.
 * Canon recovery calls this only after its journal read classifies an applied
 * row or proves absence; structured-import recovery delegates classification
 * to its idempotent command RPC. The server journal remains authoritative; this
 * only removes the local replay shortcut.
 */
export function forgetSessionCommandReceipt(command, scope = null) {
  journal.release(commandJournalKey(command), scope);
}
