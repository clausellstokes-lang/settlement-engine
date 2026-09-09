/**
 * cancel.mjs — PID-EXACT CANCELLATION (SK-7; ODQ §143.1).
 *
 * ⛔⛔ NEVER A PATTERN-MATCHED KILL. `pkill -f` has returned a SIBLING LANE'S WORKERS as
 * SKIPS in this estate — it is a recorded hazard and it has bitten. A soak runner and a
 * sibling executor's vitest workers can share command-line text; a pattern that matches
 * "the soak" matches them too, and the sibling's run dies with no error anyone can trace
 * back here.
 *
 * So the pool records its OWN child PIDs and process group at spawn, and cancellation
 * signals exactly those. The ledger is written eagerly, so a cancellation arriving before
 * the run finishes still has exact children to signal.
 *
 * ⚠ AND IT VERIFIES OWNERSHIP BEFORE SIGNALLING. A PID is reused by the OS; a stale ledger
 * entry can name a PID that now belongs to something else entirely. Each PID is checked
 * against the recorded process group before it is signalled — an unowned PID is SKIPPED
 * and reported, never signalled on the assumption that the ledger is fresh.
 */

export const CANCEL_SIGNAL = 'SIGTERM';

/**
 * Decide what to signal. PURE — returns the plan so a test can assert it without spawning
 * anything, and so the runner can log exactly what it is about to do.
 *
 * @param {{pids: Array<{pid: number, key: string, pgid?: number}>, pgid: number,
 *          owner: (pid: number) => number|null}} input
 * @returns {{signal: string[], skipped: Array<{pid: number, why: string}>}}
 */
export function cancellationPlan({ pids, pgid, owner }) {
  const signal = [];
  const skipped = [];
  for (const row of pids || []) {
    const actual = owner(row.pid);
    if (actual == null) {
      skipped.push({ pid: row.pid, why: 'process is gone — nothing to signal' });
      continue;
    }
    // ⛔ THE OWNERSHIP CHECK. A PID the OS has recycled belongs to somebody else now, and
    // signalling it would kill an unrelated process on the strength of a stale ledger.
    if (actual !== pgid) {
      skipped.push({ pid: row.pid, why: `process group ${actual} is not this pool's ${pgid} — the PID was recycled` });
      continue;
    }
    signal.push(row.pid);
  }
  return { signal, skipped };
}

/**
 * Execute a cancellation plan. `send` is injected so the test drives the real decision
 * path without signalling anything.
 */
export function cancel({ pids, pgid, owner, send }) {
  const plan = cancellationPlan({ pids, pgid, owner });
  const sent = [];
  for (const pid of plan.signal) {
    send(pid, CANCEL_SIGNAL);
    sent.push(pid);
  }
  return { ...plan, sent, signalName: CANCEL_SIGNAL };
}

/**
 * The refusal that keeps the law from being re-litigated by a hurried operator. Any
 * cancellation expressed as a COMMAND PATTERN rather than a PID set is refused by name.
 */
export function refusePatternKill(spec) {
  const text = String(spec || '');
  if (/pkill|killall|-f\s|pgrep/.test(text)) {
    return [
      `REFUSED: "${text}" is a pattern-matched kill. Cancellation is PID-EXACT — the pool `
      + 'records its own children at spawn and signals exactly those. A pattern that matches '
      + 'this soak also matches a sibling lane\'s workers, which has already returned them as '
      + 'SKIPS in this estate.',
    ];
  }
  return [];
}
