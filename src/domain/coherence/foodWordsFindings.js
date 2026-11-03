/**
 * domain/coherence/foodWordsFindings.js — THE FOOD WORDS AGREE WITH THE FOOD RECORD.
 *
 * Fix shape C of docs/GENERATION_ROOT_CAUSES_2026-11-02.md (appendix 1, cure 6): no sentence
 * may say surplus, stores, reserves or starving unless the food record agrees. The record is
 * the one answer (src/generators/economy/foodBalance.js :: deriveFoodRecord, stored at
 * economicState.foodSecurity.foodRecord); this reads the text a DM reads against it.
 *
 * Standalone by design (FOOD lane, chair ruling 1 / acceptance 6): the chair wires it into
 * the generation receipt. Pure: a function of the settlement and the text only.
 */

/**
 * @typedef {Object} FoodWordsFinding
 * @property {'surplus_without_surplus'|'starving_without_deficit'|'reserve_days_disagree'|'no_reserves_with_stores'} code
 * @property {string} sentence  the offending sentence, trimmed
 * @property {string} detail    what the record says instead
 */

/** Food-surplus wording: the place is said to grow more than it eats. */
const SURPLUS_WORDS = /\b(?:farm|grain|food|agricultural|harvest) surplus\b|\bSubsistence with (?:minor )?surplus\b|\bruns a reliable surplus\b/i;
/** Starvation wording. */
const STARVING_WORDS = /\bstarving\b/i;
/** A count of days of food or reserves. */
const RESERVE_DAYS = /\b(\d+) days of (?:food left|food in store|reserves)\b/i;
/** A claim that no food is stored. */
const NO_RESERVES = /\bNo food reserves\b|\bholds no food\b|\bNo reserves\b/i;

/**
 * @param {unknown} settlement
 * @returns {{ band: string, storageMonths: number, growsMoreThanEats: boolean } | null}
 */
function recordOf(settlement) {
  const s = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: unknown } | null } | null } | null | undefined} */ (settlement);
  const r = /** @type {{ band?: unknown, storageMonths?: unknown, growsMoreThanEats?: unknown } | null | undefined} */ (s?.economicState?.foodSecurity?.foodRecord);
  if (!r || typeof r !== 'object') return null;
  return {
    band: typeof r.band === 'string' ? r.band : '',
    storageMonths: typeof r.storageMonths === 'number' && Number.isFinite(r.storageMonths) ? r.storageMonths : 0,
    growsMoreThanEats: r.growsMoreThanEats === true,
  };
}

/**
 * Every sentence of `renderedText` that says something about food the record contradicts.
 * A settlement with no record (a save older than it) yields no findings: there is nothing to
 * hold the words to.
 * @param {unknown} settlement
 * @param {string} renderedText
 * @returns {FoodWordsFinding[]}
 */
export function foodWordsFindings(settlement, renderedText) {
  const record = recordOf(settlement);
  if (!record) return [];
  /** @type {FoodWordsFinding[]} */
  const findings = [];
  const sentences = String(renderedText || '').split(/(?<=[.?])\s+|\n+/).map((x) => x.trim()).filter(Boolean);
  const storeDays = Math.round(record.storageMonths * 30);
  const hungry = record.band === 'deficit' || record.band === 'famine';
  for (const sentence of sentences) {
    if (!record.growsMoreThanEats && SURPLUS_WORDS.test(sentence)) {
      findings.push({ code: 'surplus_without_surplus', sentence, detail: 'The place grows less than it eats.' });
    }
    if (!hungry && STARVING_WORDS.test(sentence)) {
      findings.push({ code: 'starving_without_deficit', sentence, detail: `The food band is ${record.band}.` });
    }
    const days = RESERVE_DAYS.exec(sentence);
    if (days) {
      const said = Number(days[1]);
      if (Math.abs(said - storeDays) > Math.max(2, Math.round(storeDays / 10))) {
        findings.push({ code: 'reserve_days_disagree', sentence, detail: `The stores hold about ${storeDays} days.` });
      }
    }
    if (record.storageMonths >= 1 && NO_RESERVES.test(sentence)) {
      findings.push({ code: 'no_reserves_with_stores', sentence, detail: `The stores hold ${record.storageMonths} months.` });
    }
  }
  return findings;
}

export default foodWordsFindings;
