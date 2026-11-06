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
 * ONE NOTE SET PER BLOCK (RUNG-2 LANDING phase D, the chair's R-D1): a pass that derives a block
 * runs its draws inside `withLedgerBlock(block, fn)`. Its notes carry the block's key, and a LATER
 * pass that re-derives the same block REPLACES them — the earlier pass's notes leave the ledger
 * when the re-derivation opens, so the ledger never accumulates notes of a superseded computation
 * (rung 2E: the provisional economy's safety line, re-derived by `economyReconcilePass.js` after
 * walls were added, left a 'no walls' note for a line the record never printed).
 *
 * Import-free (the kernel imports it). Pure apart from the module-level slots it manages.
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
 * @property {boolean} [colour] the line (or its pool) is marked `colour` (R-AO): read, presumes
 *   nothing — no atom for the self-check, counted as declared by `declared-share`
 * @property {Record<string, unknown>} [ctx] the per-line context a context atom needs (`npc`)
 * @property {string} resolvedBy 'drawn' | 'twin' | 'argmax' | 'none' | 'kept' (a refused or unanswered
 *   line the site printed anyway, R-AM)
 * @property {string} [block] the block whose derivation drew the line (`withLedgerBlock`, R-D1)
 */

/** @type {LedgerEntry[] | null} */
let active = null;

/** @type {string | null} the block the running pass derives (`withLedgerBlock`), or null */
let activeBlock = null;

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
  const previousBlock = activeBlock;
  active = ledger;
  activeBlock = null; // a nested birth's ledger is not the outer pass's block
  try {
    return { result: fn(), ledger };
  } finally {
    active = previous;
    activeBlock = previousBlock;
  }
}

/**
 * Run a pass that derives `block`: the notes an EARLIER derivation of the same block left in the
 * open ledger are removed first (the pass replaces them), and every note made during `fn` carries
 * the block's key. With no ledger open it is a plain call.
 * @template T
 * @param {string} block the key of the block the pass owns (`economicState`, …)
 * @param {() => T} fn
 * @returns {T}
 */
export function withLedgerBlock(block, fn) {
  if (active === null) return fn();
  for (let i = active.length - 1; i >= 0; i -= 1) {
    if (active[i].block === block) active.splice(i, 1);
  }
  const previousBlock = activeBlock;
  activeBlock = block;
  try {
    return fn();
  } finally {
    activeBlock = previousBlock;
  }
}

/**
 * Note one drawn line in the open ledger (a no-op when none is open).
 * @param {LedgerEntry} entry
 */
export function notePresumption(entry) {
  if (active !== null) active.push(activeBlock === null ? entry : { ...entry, block: activeBlock });
}
