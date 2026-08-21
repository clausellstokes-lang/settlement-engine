/**
 * magicWorksAt.js — DOES MAGIC FUNCTION IN THIS PLACE? The estate's one neutral answer.
 *
 * THE LIFT (ES-0, docs/DESIGN_FP_ARCH_ES.md §2 ⟨F7⟩; the R-BLD-5 `magicAssertionText.js`
 * precedent exactly). The predicate below was authored inside `warMagicGate.js` as
 * `warMagicFunctions` for MG-3b, and it was never war-specific: it answers a question
 * about a SETTLEMENT, not about a siege. The espionage layer's magical-transmission pair
 * gate asks the same question of a home and a stop, so the body moves here under a
 * neutral name and `warMagicGate.js` re-exports it under its war-era name. The LOGIC is
 * transplanted verbatim — same accessor, same guard, same polarity — so every war-lane
 * caller and every golden is byte-identical by construction.
 *
 * ⚠ THE NAME IS DELIBERATE AND THE TWIN IS NAMED HERE SO NO SWEEP EVER CONFLATES THEM.
 * A module-PRIVATE `magicFunctionsAt(magicById, id)` already exists at
 * src/domain/spatial/teleportEdges.js. It has a DIFFERENT ARITY (two arguments, a
 * magicById map plus an id) and DIFFERENT SEMANTICS (a defensive `!== false` read over
 * that map, with no present guard at all). This export is `magicWorksAt(item)` precisely
 * so that a future grep for one can never silently answer with the other — the
 * `operativeNotoriety01` / `riskToleranceOf` collision lesson, applied before the
 * collision. `magicWorksAt` was measured ZERO-HIT across src/ and tests/ before minting.
 *
 * THE THREE INGREDIENTS ARE ALL LOAD-BEARING:
 *   1. THE `magicLedger` ACCESSOR, never a raw config poke — one reader for the axis.
 *   2. THE PRESENT GUARD (`ledger.present === true &&`). The neutral envelope for an
 *      UN-GENERATED settlement is itself `magicExists:false`, so an unguarded read would
 *      declare every config-less fixture in the estate mundane and move goldens that have
 *      nothing to do with magic. Only a settlement that actually CARRIES a magic axis and
 *      asserts magic absent reads false.
 *   3. BOTH SHAPES. A worldSnapshot item (`{ settlement }`) and a bare settlement both
 *      read correctly, because the war layer and the errand layer pass different shapes.
 *
 * ⛔ MUST NOT BE REPLACED BY, and none of these is an existence gate:
 *   - `realmMagicIsMundane` / `realmMagicDefault` — MG-LAW-1, a UI default, prohibited in
 *     its own docblock.
 *   - the magic BAND — MG-LAW-4, because the DM's authored glowing city must survive.
 *   - `magicEconomyActive` — that is the PRICE gate (W-K), and it is dark.
 *
 * PURE: no rng, no clock, no store, no tier read.
 */
import { magicLedger } from '../magicLedger.js';

/**
 * Does magic FUNCTION for this settlement?
 *
 * @param {{ settlement?: unknown }|null|undefined} item a worldSnapshot item
 *   (`{ settlement }`), a bare settlement, or nullish.
 * @returns {boolean} false ONLY when the settlement carries a magic axis that says so.
 */
export function magicWorksAt(item) {
  const settlement = item?.settlement || item || null;
  const ledger = magicLedger(/** @type {Parameters<typeof magicLedger>[0]} */ (settlement));
  return !(ledger.present === true && ledger.magicExists === false);
}
