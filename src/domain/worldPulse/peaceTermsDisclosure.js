/**
 * peaceTermsDisclosure.js — IN-0C, THE DISCLOSURE SIGNING CREDIT.
 *
 * One pure read. It writes nothing, persists nothing, draws no rng, and deposits no
 * marker: the disclosure signings that fall due for credit THIS tick are DERIVED from
 * persisted treaty state every tick, and that purity is the whole exactly-once
 * mechanism. A predicate that reads nothing it writes cannot double-count under replay,
 * so this wave adds no pending-credit ledger, no second pass and no stage move.
 *
 * ── THE WINDOW, AND WHY IT IS EXACTLY ONE TICK WIDE ─────────────────────────────
 * The statecraft stage runs BEFORE the treaty stage, so a term minted at `T` is
 * invisible to this reader until `T+1`, when `mintedTick === T` and `T === (T+1) - 1`
 * matches exactly once. At `T+2` it no longer matches. Re-advancing `T` from the same
 * persisted state yields the same set.
 *
 * DECLARED BOUNDARY (not a defect): a treaty pruned before `T+1` earns no credit. That
 * is correct — the instrument did not survive to be believed — and it is pinned.
 *
 * ── THE FAMILY, NOT THE WORD ────────────────────────────────────────────────────
 * The predicate keys on the catalog family `informational`, never on the literal type
 * `'disclosure'` (the derive-don't-restate law). `disclosure` is that family's sole
 * member today; a future informational clause joins the credit the day it lands rather
 * than the day someone remembers to widen a list, and the singleton is pinned so the
 * widening is a visible act.
 *
 * ⚠ THE PREDICATE IS OVER THE TERM'S OWN `mintedTick`, NEVER THE TREATY'S `signedTick`.
 * All five mint doors stamp `mintedTick` onto the term literal, so the predicate is
 * TOTAL; `signedTick` is written on the TREATY by one door only, and a predicate over it
 * would be the recorded "an enumeration on the credit side fails open" class.
 *
 * ⚠ IMPORTS ARE CONFINED TO THIS PORT ON PURPOSE (chair rulings CR-ORIENT-C /
 * CR-IN0C-OPT2). CW-0w's inventory keys on the (importer, imported) PAIR, so a NEW
 * module reading across a port is a new unlicensed coupling however well-trodden that
 * port is. Every import below is GRAMMAR-internal, unlayered, or outside the scan.
 * The compelled feed's fidelity ladder reads INFORMATION's own tuning and therefore
 * lives in `informationStatecraft.js`, not here.
 *
 * @enforced-by tests/domain/informationStatecraftPins.test.js
 */

import { TERM_CATALOG } from './peaceTermsCatalog.js';
import { treatyOrientationOf } from './treatyOrientation.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * The disclosure signings that fall due for credit THIS tick.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {number} tick
 * @returns {Array<{ id: string, kind: 'proven_true' }>}
 */
export function disclosureSigningCredits(worldState, tick) {
  /** @type {Array<{ id: string, kind: 'proven_true' }>} */
  const out = [];
  const due = Number(tick) - 1;
  if (!Number.isFinite(due)) return out;
  const ledger = asObject(getSpatialLedger(
    /** @type {Record<string, unknown>} */ (worldState), 'treaties',
  ));
  for (const key of Object.keys(ledger).sort()) {
    const treaty = asObject(ledger[key]);
    const terms = Array.isArray(treaty.terms) ? treaty.terms : [];
    // Read the orientation ONCE per instrument — every clause on one treaty shares it.
    const orientation = treatyOrientationOf(treaty);
    // FAIL CLOSED. A treaty that cannot say who owes it credits nobody: never a
    // placeholder, and never the four-character string "undefined". `resolved: false`
    // and an empty `obligorId` are the same guard by treatyOrientation's own contract.
    const obligorId = orientation.obligorId;
    if (!obligorId) continue;
    for (const raw of terms) {
      const term = asObject(raw);
      const spec = TERM_CATALOG[String(term.type)];
      if (!spec || spec.family !== 'informational') continue;
      if (Number(term.mintedTick) !== due) continue;
      // NOT deduplicated here: the consumer's existing fold owns aggregation, and a
      // second aggregation rule would be a second law. `magnitude01` is omitted so the
      // credit takes the consumer's existing default — this wave mints no new magnitude.
      out.push({ id: obligorId, kind: 'proven_true' });
    }
  }
  return out;
}
