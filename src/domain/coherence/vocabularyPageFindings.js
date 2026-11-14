/**
 * domain/coherence/vocabularyPageFindings.js — THE REGISTERED-WORD FINDINGS of a page (W2-B-DECLARE item 2; named
 * for what they are by the second seat, REVIEW-W2B F1: a list of the sentences that use a REGISTERED word the town
 * makes false — not every false line a reader finds; its recall is scored against the cold list at every tip). The
 * chair's record 288, ruling 3: "B's first measure runs the walker's own matcher, with the new vocabularies,
 * over every VISIBLE sentence of the rendered dossiers against each town's leaves: a sentence that names what
 * the town lacks, or denies what it has, is a finding, whether or not anyone has named its pattern").
 *
 * A member of the rendered-dossier arm (W2-A-LEAVES's page battery registers it): the same input as
 * `pageCensusFindings` — the record and its rendered views (`'Group/Tab'` → its lines) — and one finding per
 * (view, sentence, word):
 *   names    the sentence names a registered word (`registeredWords.js :: REGISTERED_WORDS`) the town makes
 *            false (`absent`): a thing it lacks, a state not in force, a size it is not, a count it does not hold;
 *   denies   the sentence denies a thing or a state the town HAS.
 * The matcher is the walker's own (`thingsNamedIn`, `thingsDeniedIn`, `newWordsNamedIn`, `newWordsDeniedIn`);
 * the town's leaves are the vocabulary's readers (`factsOf`), the live roster's names and, for a count, the
 * record's own list. A word read in another sense is a row in the reader's register with its reason; this
 * check is never loosened to pass a line.
 *
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/coherence/vocabularyPageFindings.test.js
 */
import { factsOf } from '../facts/factsOf.js';
import { liveInstitutionNames } from '../facts/institutions.js';
import {
  onPageList, NEW_WORDS, THINGS, newWordsDeniedIn, newWordsNamedIn, presentForDenial, sentencesOf, thingsDeniedIn, thingsNamedIn,
} from '../facts/registeredWords.js';

/**
 * @typedef {object} VocabularyFinding
 * @property {'VOCAB'} row
 * @property {string} view the view the sentence was printed in (`'Systems/Economics'`)
 * @property {string} word the registered word's id (`walls`, `siege`, `powersCount`, …)
 * @property {'names'|'denies'} side
 * @property {string} quote the sentence
 * @property {string} detail what the town holds instead
 */

/**
 * @param {Record<string, unknown> | null | undefined} settlement the record
 * @param {Readonly<Record<string, ReadonlyArray<string>>>} views the rendered dossier
 * @returns {VocabularyFinding[]}
 */
export function vocabularyPageFindings(settlement, views) {
  const record = settlement || {};
  const facts = factsOf(record);
  const names = liveInstitutionNames(record);
  /** @type {Map<string, boolean>} */ const absentThing = new Map();
  const thingAbsent = (/** @type {string} */ id) => {
    if (!absentThing.has(id)) absentThing.set(id, !!THINGS[id].absent(facts, names));
    return absentThing.get(id) === true;
  };
  /** @type {VocabularyFinding[]} */ const out = [];
  const seen = new Set();
  /** @param {string} view @param {string} word @param {'names'|'denies'} side @param {string} quote @param {string} detail */
  const push = (view, word, side, quote, detail) => {
    const k = `${view}\t${word}\t${side}\t${quote}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ row: 'VOCAB', view, word, side, quote: quote.slice(0, 300), detail });
  };
  for (const [view, lines] of Object.entries(views || {})) {
    for (const line of lines || []) {
      if (typeof line !== 'string' || line.startsWith('[STYLE]')) continue;
      for (const sentence of sentencesOf(line)) {
        // The walker's own floor (presumedThings.shared.mjs, the printed-record arm: `text.length < 15`):
        // a heading or a chip names no claim. Not a tuning value: the measure reads what the walker reads.
        if (sentence.length < 15) continue;
        // the hand-written things left the page list at the precision read (`THINGS[id].pageWithdrawn`), but for a kept narrow phrase (F7: `onPageList`); arm 2 of the walker reads them
        for (const id of thingsNamedIn(sentence)) if (onPageList(THINGS[id], sentence) && thingAbsent(id)) push(view, id, 'names', sentence, `the town lacks: ${id}`);
        for (const id of thingsDeniedIn(sentence)) if (!THINGS[id].pageWithdrawn && presentForDenial(id, facts, names)) push(view, id, 'denies', sentence, `the town has: ${id}`);
        for (const id of newWordsNamedIn(sentence)) {
          // the precision read withdrew its family from the page list (its reason is on the word), but for a kept narrow phrase (F7)
          if (!onPageList(NEW_WORDS[id], sentence)) continue;
          if (NEW_WORDS[id].absent(facts, names, record, sentence)) push(view, id, 'names', sentence, `false here: ${id} (${NEW_WORDS[id].leaf})`);
        }
        for (const id of newWordsDeniedIn(sentence)) {
          if (NEW_WORDS[id].pageWithdrawn) continue;
          if (!NEW_WORDS[id].absent(facts, names, record, sentence)) push(view, id, 'denies', sentence, `in force here: ${id}`);
        }
      }
    }
  }
  return out;
}
