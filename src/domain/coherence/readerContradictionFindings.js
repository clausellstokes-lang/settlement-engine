/**
 * domain/coherence/readerContradictionFindings.js — THE READER'S CONTRADICTIONS: three checks
 * that read two rendered statements of one record side by side (lane RUNG1B-F9, 2026-11-04;
 * the chair's end-to-end reading of 2026-11-04).
 *
 * Each check is a second answer printed beside the one record:
 *
 *   grade-vs-food            the Overview's food band reads an active famine and the Defense
 *                            tab grades "Disasters & Famine" Adequate or better.
 *   magic-absent-prose       the Magic tab's envelope reads "Availability absent" and a
 *                            sentence on the same tab asserts magic or practitioners.
 *   crime-denied-and-listed  the Defense tab denies criminal infrastructure (DS-DEF-4's
 *                            `structure null` pool, or the static no-organised-crime line)
 *                            beside a non-empty "Active criminal operations" list, or beside
 *                            a running criminal supply chain on the Economics tab.
 *
 * They read RENDERED surfaces by their tab ids (`overview`, `defense`, `magic`, `economics`),
 * so they belong to the page battery (coherenceBattery.js), never to the record battery the
 * generation receipt runs. Each answers at most one finding per settlement. Pure.
 */

/** @typedef {{ quote: string, detail: string }} ReaderFinding */

/** @param {unknown} v @returns {string} */
const textOf = (v) => (typeof v === 'string' ? v : '');

/** The Overview's food band for an active famine (`FOOD_SECURITY_BANDS.famine`, statusCased). */
const FAMINE_BAND = /Food Security\s+Deficit\s+[—-]\s+active famine/i;
/** The Defense tab's readiness row and its grade word, at Adequate or above. */
const DISASTER_GRADE = /Disasters & Famine\s*\n\s*(Adequate|Strong|Robust)\b[^\n]*/i;

/**
 * grade-vs-food: one finding when the Overview prints the active-famine band and the Defense
 * tab grades the Disasters & Famine row Adequate or better.
 * @param {Readonly<Record<string, string>>} surfaces
 * @returns {ReaderFinding[]}
 */
export function gradeVsFoodFindings(surfaces) {
  const overview = textOf(surfaces?.overview);
  const defense = textOf(surfaces?.defense);
  if (!FAMINE_BAND.test(overview)) return [];
  const grade = defense.match(DISASTER_GRADE);
  if (!grade) return [];
  return [{
    quote: grade[0].replace(/\s+/g, ' ').trim(),
    detail: `Overview reads "${overview.match(FAMINE_BAND)?.[0]}"; the grade reads ${grade[1]}`,
  }];
}

const AVAILABILITY_ABSENT = /\bAvailability absent\b/;
/** A sentence that says magic or its practitioners are here. */
const ASSERTS_MAGIC = /There is magic at|\bpractitioners?\b|\bthe arcane went away\b/i;

/**
 * magic-absent-prose: one finding when the Magic tab's envelope reads availability absent and
 * a sentence on the tab asserts magic or a practitioner.
 * @param {Readonly<Record<string, string>>} surfaces
 * @returns {ReaderFinding[]}
 */
export function magicAbsentProseFindings(surfaces) {
  const magic = textOf(surfaces?.magic);
  if (!AVAILABILITY_ABSENT.test(magic)) return [];
  const sentence = magic.split(/(?<=[.!?])\s+|\n+/).map((x) => x.trim()).find((x) => ASSERTS_MAGIC.test(x));
  return sentence ? [{ quote: sentence, detail: 'availability absent' }] : [];
}

/** DS-DEF-4's `structure null` variants and the tab's static no-organised-crime line. */
const CRIME_DENIAL = /No criminal infrastructure has been identified[^.]*\.|goes wrong one thing at a time and belongs to whoever did it|met with genuine incomprehension|No organized criminal infrastructure detected\./;
const OPERATIONS_LIST = /Active criminal operations\s*\n\s*\S/;
/** A criminal supply chain chip whose status runs (`supplyChainStatus`: Operational, Running, Transhipment hub). */
const RUNNING_CRIMINAL_CHAIN = /Criminal supply chains\s*\n[^\n]*·\s*(?:Operational|Running|Transhipment hub)\b/;

/**
 * crime-denied-and-listed: one finding when the Defense tab denies criminal infrastructure
 * beside a non-empty operations list or a running criminal supply chain.
 * @param {Readonly<Record<string, string>>} surfaces
 * @returns {ReaderFinding[]}
 */
export function crimeDeniedAndListedFindings(surfaces) {
  const defense = textOf(surfaces?.defense);
  const denial = defense.match(CRIME_DENIAL);
  if (!denial) return [];
  const listed = OPERATIONS_LIST.test(defense);
  const chain = textOf(surfaces?.economics).match(RUNNING_CRIMINAL_CHAIN);
  if (!listed && !chain) return [];
  return [{
    quote: denial[0],
    detail: [listed ? 'Active criminal operations listed' : '', chain ? `criminal supply chain: ${chain[0].split('\n').pop()?.trim()}` : '']
      .filter(Boolean).join('; '),
  }];
}
