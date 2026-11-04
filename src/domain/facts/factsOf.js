/**
 * domain/facts/factsOf.js — ONE FACT, ONE HOME (CENSUS-1 wave 0; `docs/DESIGN_POOL_CENSUS.md` §1).
 *
 * `factsOf(record).<fact>` is the one answer to each atomic fact a drawn line may presume. Every
 * getter reads the record AS IT IS NOW (the live roster, the current crisis container): nothing
 * is cached, so a late write is seen by the next read, which is what the birth self-check
 * (`cert:false-presumption`) re-asserts against the FINAL record.
 *
 * Each fact's logic lives in its own module beside this one; this file only names them. A
 * competing reader elsewhere in the tree is retired TO the module (a re-export shim where the
 * old name is imported widely), never re-implemented beside it.
 *
 * Pure: no randomness, no clock, no write.
 */
import { crisisOf } from './crisisKind.js';

/**
 * @param {object | null | undefined} record a settlement record
 * @param {{ worldStressors?: ReadonlyArray<unknown> | null, settlementId?: unknown }} [options]
 *   the world's pulse stressors for the crisis fact (a lone record carries none)
 */
export function factsOf(record, options = {}) {
  return Object.freeze({
    /** fact 1: the crisis kinds, families and the one siege reading */
    get crisis() { return crisisOf(record, options); },
  });
}
