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

import { sourcesNamedIn } from '../foodways.js';
import { CLAIMS_STARVING, recordAllowsStarving } from '../foodSurplus.js';

/**
 * @typedef {Object} FoodWordsFinding
 * @property {'surplus_without_surplus'|'starving_without_deficit'|'reserve_days_disagree'|'no_reserves_with_stores'|'source_not_held'} code
 * @property {string} sentence  the offending sentence, trimmed
 * @property {string} detail    what the record says instead
 */

/** Food-surplus wording: the place is said to grow more than it eats. */
const SURPLUS_WORDS = /\b(?:farm|grain|food|agricultural|harvest) surplus\b|\bSubsistence with (?:minor )?surplus\b|\bruns a reliable surplus\b/i;
/**
 * A requirement clause ("Requires grain surplus.", the Maltster's description): it says what an
 * institution NEEDS, not that the place holds it, so its surplus words are no claim — licensed
 * as R7 licenses a "Needs X" row (FOOD-EXPORTS residue, the chair's ruling 2026-11-04). The
 * clause runs to the next sentence or clause break; what follows is still read.
 */
const REQUIREMENT_CLAUSE = /\bRequires\b[^.;:·]*/gi;
/** Starvation wording: the starving rule's own words (domain/foodSurplus.js, F3 FOOD-WORDS). */
const STARVING_WORDS = CLAIMS_STARVING;
/** A count of days of food or reserves. */
const RESERVE_DAYS = /\b(\d+) days of (?:food left|food in store|reserves)\b/i;
/** A sentence about what the place eats: the foodways line and its kin. */
const TABLE_WORDS = /\bthe (?:local )?table\b|\bmeals\b/i;
/**
 * A "Needs X" row's lead clause (the Economics supply rows: "Needs Grain · affects: meals,
 * ale, lodging"). It says the place LACKS X, so the sources it names are no claim to hold
 * them; the clause runs to the row's first " · " or " - " separator, and what follows is
 * still read (soak R7, docs/SOAK_1000_2026-11-03.md §4b).
 */
const NEEDS_CLAUSE = /^Needs\b.*?(?=\s+[·–-]\s+|$)/i;
/** A claim that no food is stored. */
const NO_RESERVES = /\bNo food reserves\b|\bholds no food\b|\bNo reserves\b/i;

/**
 * @param {unknown} settlement
 * @returns {{ band: string, storageMonths: number, growsMoreThanEats: boolean, foodSources: string[] | null } | null}
 */
function recordOf(settlement) {
  const s = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: unknown } | null } | null } | null | undefined} */ (settlement);
  const r = /** @type {{ band?: unknown, storageMonths?: unknown, growsMoreThanEats?: unknown, foodSources?: unknown } | null | undefined} */ (s?.economicState?.foodSecurity?.foodRecord);
  if (!r || typeof r !== 'object') return null;
  return {
    band: typeof r.band === 'string' ? r.band : '',
    storageMonths: typeof r.storageMonths === 'number' && Number.isFinite(r.storageMonths) ? r.storageMonths : 0,
    growsMoreThanEats: r.growsMoreThanEats === true,
    // FOOD-3: a record older than the sources list cannot be held to named sources.
    foodSources: Array.isArray(r.foodSources) ? r.foodSources.map(String) : null,
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
  const hungry = recordAllowsStarving(record);
  for (const sentence of sentences) {
    if (!record.growsMoreThanEats && SURPLUS_WORDS.test(sentence.replace(REQUIREMENT_CLAUSE, ''))) {
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
    if (record.foodSources && TABLE_WORDS.test(sentence)) {
      const held = new Set(record.foodSources);
      const lacking = sourcesNamedIn(sentence.replace(NEEDS_CLAUSE, '')).filter((source) => !held.has(source));
      if (lacking.length) {
        findings.push({ code: 'source_not_held', sentence, detail: `The place has no ${lacking.join(' or ')} source.` });
      }
    }
    if (record.storageMonths >= 1 && NO_RESERVES.test(sentence)) {
      findings.push({ code: 'no_reserves_with_stores', sentence, detail: `The stores hold ${record.storageMonths} months.` });
    }
  }
  return findings;
}

export default foodWordsFindings;
