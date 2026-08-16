/**
 * seedLedger.mjs — THE SENSITIVE-SEED LEDGER AND ITS DURABLE HOME (SK-6; ODQ §143.4).
 *
 * Finding density per CELL, persisted per soak run, so re-soak ordering runs
 * density-descending: the interesting seeds become the fast alarm.
 *
 * ⭐ THE HOME, NAMED (the charter's explicit compile obligation):
 *
 *     ${XDG_STATE_HOME:-$HOME/.local/state}/settlementforge/soak/
 *         seed-ledger.json
 *         capsules/<capsule-id>/
 *
 * Chosen because it is (a) outside both trees, (b) outside every archive — the archive is
 * deleted after the run, (c) outside `/tmp`, so a reboot does not take it, (d) an
 * XDG-conventional location the owner can find, back up or delete deliberately, and
 * (e) overridable by `SETTLEMENTFORGE_SOAK_STATE` for a lane that needs isolation.
 * The RESOLVED ABSOLUTE PATH is stamped in every report header.
 *
 * ⛔ AN UNWRITABLE HOME IS A HARD REFUSAL AT STARTUP WITH THE PATH NAMED — never a silent
 * fallback to a volatile directory. A ledger that silently moves is worse than no ledger:
 * the density it reports would be the density of whatever survived, and nobody would know.
 *
 * ⛔⛔ A CANCELLED OR SUPERSEDED RUN NEVER UPDATES DENSITY. A cancelled run has completed
 * only the SENSITIVE HEAD, so crediting it inflates exactly the historic seeds and starves
 * the never-fired tail — survivorship bias manufactured by the cancellation policy itself.
 *
 * ⛔ KEYS ARE THE FULL CELL IDENTITY — seed × config row × shape — never the bare seed
 * string, which smears density across configs. The key IS the census key (the
 * banked-failure identity law).
 */

/** Non-persisting statuses. Only `complete` may move density. */
export const CREDITING_STATUS = 'complete';
export const NON_CREDITING_STATUSES = Object.freeze(['cancelled', 'superseded', 'errored', 'partial']);

/**
 * ⚠ DERIVED-WITH-RATIONALE, and MARKED UNSOAKED (§43). The decay exists so an early
 * accident does not pin the ordering forever. At the default, a single firing drops below
 * a fresh single firing after ~10 clean runs of the same cell — one full ladder cycle.
 *
 * ⛔ NO OBSERVED FIRING DISTRIBUTION EXISTS YET, because nothing has soaked. The value is
 * signed provisionally and RE-DERIVED at the first clean full instrument, folded into the
 * same chair-signed act SK-5's band freeze already requires. Two unsoaked constants, one
 * re-derivation.
 */
export const HALF_LIFE_BAND = Object.freeze({ min: 5, max: 20, default: 10, unsoaked: true });

export function resolveStateHome(env = process.env, home = env.HOME || '') {
  if (String(env.SETTLEMENTFORGE_SOAK_STATE || '').trim()) {
    return String(env.SETTLEMENTFORGE_SOAK_STATE).replace(/\/+$/, '');
  }
  const base = String(env.XDG_STATE_HOME || '').trim() || `${home}/.local/state`;
  return `${base.replace(/\/+$/, '')}/settlementforge/soak`;
}

export function ledgerPath(stateHome) { return `${stateHome}/seed-ledger.json`; }
export function capsulesRoot(stateHome) { return `${stateHome}/capsules`; }

/**
 * The startup check. `probe` reports whether the home is writable; a refusal NAMES the
 * resolved absolute path, because "could not write the ledger" without a path is a
 * message nobody can act on.
 */
export function assertHomeWritable(stateHome, probe) {
  if (probe(stateHome)) return [];
  return [
    `REFUSED: the soak state home ${stateHome} is not writable. This is a HARD REFUSAL and `
    + 'not a fallback: a ledger that silently relocates reports the density of whatever '
    + 'survived, and nobody would know it had moved. Create the directory, fix its '
    + 'permissions, or set SETTLEMENTFORGE_SOAK_STATE to a writable path.',
  ];
}

/** The FULL cell identity. Never the bare seed. */
export function densityKey(cell) {
  return [cell.seed, cell.years, cell.settlements, cell.rowId].map(String).join('::');
}

/** A finding's identity for KNOWN-deduplication: tripwire + cell + tick band. */
export function findingKey(firing, cell) {
  return [firing.id, densityKey(cell), firing.tickBand ?? 'unknown'].map(String).join('|');
}

export function emptyLedger() {
  return { kind: 'soak_seed_ledger', version: 1, runs: 0, cells: {} };
}

/**
 * Fold one run's findings into the ledger.
 *
 * @param {object} ledger
 * @param {{status: string, findings: Array<object>, cells: Array<object>, standingCapsules?: string[]}} run
 * @returns {{ledger: object, credited: boolean, reason: string|null, known: string[], fresh: string[]}}
 */
export function recordRun(ledger, run) {
  if (run.status !== CREDITING_STATUS) {
    // ⛔ BYTE-IDENTICAL. Not "mostly unchanged" — a cancelled run must leave no trace at
    // all, or the survivorship bias creeps in one field at a time.
    return {
      ledger,
      credited: false,
      reason: `run status ${run.status} does not credit density (a cancelled run completed only the sensitive head)`,
      known: [],
      fresh: [],
    };
  }
  const standing = new Set(run.standingCapsules || []);
  const next = { ...ledger, runs: ledger.runs + 1, cells: { ...ledger.cells } };
  const known = [];
  const fresh = [];
  for (const cell of run.cells) {
    const key = densityKey(cell);
    const prior = next.cells[key] || { density: 0, lastRun: 0, firings: 0 };
    next.cells[key] = { ...prior, lastRun: next.runs };
  }
  for (const firing of run.findings) {
    const cell = run.cells.find((entry) => densityKey(entry) === densityKey(firing.cell));
    if (!cell) continue;
    const key = densityKey(cell);
    const identity = findingKey(firing, cell);
    // ⚠ A REPEAT FIRING OF A KNOWN FINDING IS NOT FRESH DENSITY. Same tripwire, same cell,
    // same tick band, standing capsule open — counting it again would rank a cell by how
    // long its one open bug has been open.
    if (standing.has(identity)) { known.push(identity); continue; }
    fresh.push(identity);
    const prior = next.cells[key];
    next.cells[key] = { ...prior, density: prior.density + 1, firings: prior.firings + 1 };
  }
  return { ledger: next, credited: true, reason: null, known, fresh };
}

/** Density decayed by runs elapsed since the cell last fired. */
export function decayedDensity(entry, currentRun, halfLife = HALF_LIFE_BAND.default) {
  const since = Math.max(0, Number(currentRun) - Number(entry.lastRun || 0));
  return Number(entry.density || 0) * (0.5 ** (since / halfLife));
}

/**
 * Re-soak ordering: density-descending, ties broken by the KEY so the order is total and
 * reproducible.
 *
 * ⛔ ORDERING NEVER TRUNCATES. The full grid always completes behind the sensitive head,
 * so a seed that has never fired can still earn its first entry. Truncating here would
 * make the ledger self-fulfilling: only historic seeds would ever be measured again.
 */
export function orderCells(cells, ledger, halfLife = HALF_LIFE_BAND.default) {
  return [...cells].sort((a, b) => {
    const da = decayedDensity(ledger.cells[densityKey(a)] || {}, ledger.runs, halfLife);
    const db = decayedDensity(ledger.cells[densityKey(b)] || {}, ledger.runs, halfLife);
    if (db !== da) return db - da;
    return densityKey(a) < densityKey(b) ? -1 : 1;
  });
}
