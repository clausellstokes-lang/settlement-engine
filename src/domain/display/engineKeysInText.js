/**
 * domain/display/engineKeysInText.js — AN ENGINE KEY INSIDE A GENERATED SENTENCE.
 *
 * ── THE DEFECT, AND WHY IT IS NOT CURED WHERE IT IS WRITTEN (browser pass 3, 2026-09-19) ─
 * `computeActiveChains` composes four upstream notes by joining CHAIN IDS into a sentence:
 *
 *   `Needs imported ${missingUpstream.join(', ')}: no local source`
 *
 * so a desert town's Economics tab read "↑ Needs imported warehouse_logistics: no local
 * source" — an engine identifier inside an English sentence, two lines under a node that
 * already said "Import: Storage & Logistics" for the very same chain.
 *
 * ⛔ THE NOTE IS GENERATED TEXT, so re-wording it at the producer would move the golden
 * master and re-spell the string on every saved world. That is a different car with a
 * different door (§934.22 keeps the record of what a same-seed text move costs). The estate's
 * standing answer to this exact shape is the one `institutionDisplayName.js` states: A PRINT
 * GOES THROUGH A SEAM, A MATCH NEVER DOES. The note is a print — nothing keys on it — so the
 * ids are resolved to words at the two mounts that render it, and `chain.upstreamNote`,
 * `upstreamMissing` and `upstreamWeak` keep the spellings every reader of the MODEL expects.
 *
 * ⛔ IT TAKES THE CHAIN TABLE AS AN ARGUMENT AND IMPORTS NO DATA, DELIBERATELY. Both mounts
 * already build a `chainId -> definition` lookup off `SUPPLY_CHAIN_NEEDS` for their own
 * nodes; importing that table HERE would put ~390 kB of the lazy goods namespace behind
 * every module that reads `domain/display/*` — including `src/pdf`, whose worker-bundle
 * ceiling is priced on every gate run. Passing the lookup keeps this leaf pure and keeps the
 * corpus exactly where it is already paid for. Same refusal, same reason, as the resource and
 * institution seams beside it.
 */
import { tokenCase } from './labelCase.js';

/**
 * A lower_snake_case identifier: two or more segments, lower-case only. Every chain and
 * resource id in the catalogues has this shape, and no English word in these sentences does.
 */
const ENGINE_KEY = /\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g;

/**
 * Every engine key in a generated sentence, resolved to a word.
 *
 * ⛔ THE RESOLVER IS GIVEN THE MATCH'S OFFSET, AND IT IS NOT A CONVENIENCE. The same key
 * needs a different case at the two places it appears: 'Desert_salt:' opens the gap row and
 * wants a capital, while "…lacks access to desert_salt" sits mid-sentence and wants none.
 * A seam that decided this itself would be guessing at grammar it cannot see; the caller
 * knows which of its two strings it is rendering.
 *
 * @param {unknown} text a generated sentence that may carry engine keys
 * @param {(id: string, index: number) => string} resolve the word for one key
 * @returns {unknown} the sentence in words, or the input unchanged
 */
export function engineKeysInText(text, resolve) {
  if (typeof text !== 'string' || !text) return text;
  return text.replace(ENGINE_KEY, (id, index) => resolve(id, index) || id);
}

/**
 * An upstream note with its chain ids replaced by the chains' own labels.
 *
 * An id the table does not name falls back to `tokenCase`, so a custom or retired chain reads
 * as a phrase rather than as an identifier — the fallback is the point, since the note is
 * composed from whatever ids the world carries and this seam can never be told to fail.
 *
 * @param {unknown} note the generated note, verbatim from the chain record
 * @param {Record<string, { label?: unknown }>} [chainDefs] chainId → chain definition
 * @returns {unknown} the note with words where the ids were, or the input unchanged
 */
export function supplyChainNoteInWords(note, chainDefs = {}) {
  return engineKeysInText(note, (id) => {
    const label = chainDefs?.[id]?.label;
    // A chain's label is a NAME ('Storage & Logistics') and keeps its capitals wherever it
    // lands, so this caller ignores the offset the general seam offers.
    return typeof label === 'string' && label ? label : String(tokenCase(id));
  });
}

export default engineKeysInText;
