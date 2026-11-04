/**
 * domain/facts/presumptionLedger.js — THE BIRTH-LOCAL LEDGER OF DRAWN LINES (CENSUS-1b wave 1,
 * item 4; `docs/DESIGN_POOL_CENSUS.md` §3.4).
 *
 * Every line drawn through `drawDeclared` or the kernel's draw is noted here as `(pool, lineId,
 * atoms)`, with the surface it serves. The ledger is NOT persisted: a caller opens one around a
 * birth (or a render), and `presumptionCheck.js :: presumptionFindings(record, ledger)` re-asserts
 * every declared atom against the FINAL record with the same reader the draw used. A line that
 * declares nothing is noted too (atoms `[]`), which is what the soak's `declared-share` divides by.
 *
 * ONE ACTIVE LEDGER AT A TIME, like the pipeline's active RNG: `withPresumptionLedger(fn)` sets
 * it for the call and restores the previous one after, so nested births keep their own. With no
 * ledger open, noting is a no-op and costs one null check — a birth outside the soak pays nothing.
 *
 * Import-free (the kernel imports it). Pure apart from the one module-level slot it manages.
 */

/**
 * @typedef {object} LedgerEntry
 * @property {string} pool the pool's id (`DS-GEN-13::MARKET-OPEN`, `npcData:NPC_FACTION_GOALS`, …)
 * @property {string|number} lineId the line's stable id (a vid, an index, or its text)
 * @property {ReadonlyArray<string>} atoms the atoms the line declared, as written (empty = none)
 * @property {string} surface the DM-facing surface the draw serves (`dossier`, `npcs`, …)
 * @property {'K'|'R'|'H'|'T'|'A'} drawKind
 * @property {boolean} [crisisScoped] the pool opted into the crisis dimension
 * @property {ReadonlyArray<string>} [poolDeclares] the pool's own atoms
 * @property {Record<string, unknown>} [ctx] the per-line context a context atom needs (`npc`)
 * @property {string} resolvedBy 'drawn' | 'twin' | 'argmax' | 'none'
 */

/** @type {LedgerEntry[] | null} */
let active = null;

/** @returns {LedgerEntry[] | null} the ledger open now, or null */
export function activePresumptionLedger() {
  return active;
}

/**
 * Run `fn` with a fresh ledger open; the ledger is returned beside the result.
 * @template T
 * @param {() => T} fn
 * @param {LedgerEntry[]} [ledger] an existing ledger to append to
 * @returns {{ result: T, ledger: LedgerEntry[] }}
 */
export function withPresumptionLedger(fn, ledger = []) {
  const previous = active;
  active = ledger;
  try {
    return { result: fn(), ledger };
  } finally {
    active = previous;
  }
}

/**
 * Note one drawn line in the open ledger (a no-op when none is open).
 * @param {LedgerEntry} entry
 */
export function notePresumption(entry) {
  if (active !== null) active.push(entry);
}
