/**
 * domain/display/stateProse/crimeLineDisqualifiers.js — THE CRIME DESK'S LINES AND WHAT MAKES EACH FALSE
 * (W2-A-LEAVES-2, 2026-11-13; REVIEW-W2A F3; the chair's ruling: "each line of the crime desk carries the
 * disqualifier for the stored state that makes it false, and the true lines print again").
 *
 * WHY THIS FILE. The first seat silenced the capture-pressure lens wherever the hall's stored state was `none`
 * (cure 5a): 288 lines left the page, and by the review's read 92 of them were plainly true and 164 not refuted.
 * The owner's design is the opposite: a line is in its pool unless something about the town makes IT false, and
 * that disqualifier is declared ON THE LINE. The lines are the corpus's (`RECEIPT_POOLS_DOSSIER_STATE.md`, the
 * writing lane's alone), and the vocabulary has no atom yet for the two facts they turn on, so the declarations
 * live here, keyed by each line's identity (its block, its pool, its `vid`, and the words it opens with, which
 * the suite holds against the corpus so a re-generated corpus cannot shift a declaration onto another line), and
 * the desks enforce them AT THE DRAW: the kernel draws, uniformly, among the lines no declaration strikes. The
 * hand-back asks the writing lane to carry each declaration onto its variant and the instrument lane to give the
 * vocabulary its two atoms; this table then goes.
 *
 * THE TWO FACTS, each read from its one home:
 *   - AN OFFICIAL IN A CRIMINAL'S PAY: the cast (`facts/officialsInPay.js`: by office, or a member of the ruling
 *     power), or the hall's own rung at `corrupted`/`capture`. Measured on the census's 720: at the
 *     hall's stored state `none`, 41 of 585 towns hold one, so the stored state alone cannot decide a line about
 *     bought officials (the chair's example, "bought officials where the hall is free", would have struck the
 *     line in those 41 where the page's own "Who answers to whom" shows the official in partnership).
 *   - NO AGENT IN THE HALL: the hall's stored rung (`powerStructure.criminalCaptureState`) at `none` or
 *     `adversarial`, the two rungs the hall card writes for "nobody at its head answers to the criminals"
 *     (`data/people/dmPowerLines.js :: CAPTURE_LINES`).
 *
 * Pure: no randomness, no clock, no write. Every view is built once per block, pool and admitted set.
 */
import { officialsInCriminalPayOf } from '../../facts/officialsInPay.js';

/** The hall's rungs at which the criminals hold it. */
const HALL_HELD = Object.freeze(['corrupted', 'capture']);

/** The facts a declaration may name, and how each strikes a line. */
export const CRIME_LINE_FACTS = Object.freeze({
  // the criminals holding the hall (`corrupted`, `capture`: an agent at its head, or the second and the third, or a
  // criminal ruling power) is itself an official in their pay
  'no official in pay': (/** @type {CrimeLineFacts} */ f) => f.officialsInPay === 0 && !HALL_HELD.includes(f.captureState),
  'an official in pay': (/** @type {CrimeLineFacts} */ f) => f.officialsInPay > 0 || HALL_HELD.includes(f.captureState),
  'no agent in the hall': (/** @type {CrimeLineFacts} */ f) => f.captureState === 'none' || f.captureState === 'adversarial',
});

/** @typedef {{ officialsInPay: number, captureState: string }} CrimeLineFacts */
/** @typedef {{ opens: string, falseWhere: keyof typeof CRIME_LINE_FACTS, says: string }} CrimeLineDeclaration */

/** @param {string} opens @param {keyof typeof CRIME_LINE_FACTS} falseWhere @param {string} says @returns {Readonly<CrimeLineDeclaration>} */
const line = (opens, falseWhere, says) => Object.freeze({ opens, falseWhere, says });

/**
 * THE DECLARATIONS: `<block>::<pool>` → `vid` → what the line opens with, the fact that makes it false, and what
 * it says that the fact contradicts. A line not named here presumes neither fact.
 * @type {Readonly<Record<string, Readonly<Record<number, Readonly<CrimeLineDeclaration>>>>>}
 */
export const CRIME_LINE_DISQUALIFIERS = Object.freeze({
  'DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity)': Object.freeze({
    1: line('Criminal money is reaching the officials of {settlement} one at a time', 'no official in pay', 'officials are taking criminal money'),
    3: line('Officials at {settlement} are spending money their posts never paid them', 'no official in pay', 'officials are taking criminal money'),
  }),
  'DS-POW-6::capture pressure RECOVERING (strong security, prosperity)': Object.freeze({
    1: line('The criminals at {settlement} are losing their grip on the hall', 'no agent in the hall', 'the criminals had a grip on the hall'),
    2: line('The approach was made at {settlement} and did not take', 'an official in pay', 'no official was bought'),
    3: line('The criminals at {settlement} still own a few officials', 'no official in pay', 'the criminals own officials'),
  }),
  'DS-DEF-4::capture equilibrium': Object.freeze({
    1: line('The {seat} at {settlement} and the criminal interest have found a line and both keep to it; nothing is bought here', 'an official in pay', 'nothing is bought'),
  }),
  'DS-DEF-4::capture none': Object.freeze({
    2: line('There is a criminal interest at {settlement} with the means to reach into the hall and it has not', 'an official in pay', 'the criminals have reached no one'),
    3: line('Whatever is run at {settlement} is run outside the hall, and business with the hall is straight', 'an official in pay', 'business with the hall is straight'),
  }),
});

/**
 * The two facts for one record.
 * @param {{ npcs?: unknown, powerStructure?: { criminalCaptureState?: unknown } | null } | null | undefined} settlement
 * @returns {CrimeLineFacts}
 */
export function crimeLineFactsOf(settlement) {
  return {
    officialsInPay: officialsInCriminalPayOf(settlement).length,
    captureState: String(settlement?.powerStructure?.criminalCaptureState ?? ''),
  };
}

/** @type {Map<unknown, Map<string, unknown>>} */
const VIEWS = new Map();

/**
 * The corpus as the draw sees it for one block and these facts: each declared pool keeps the lines no
 * declaration strikes; every other pool, and every other block, is the corpus's own object.
 * @template T
 * @param {T} corpus the desk's corpus (block id → block)
 * @param {string} blockId
 * @param {CrimeLineFacts} facts
 * @returns {T}
 */
export function corpusAdmittingCrimeLines(corpus, blockId, facts) {
  const c = /** @type {Record<string, { pools?: Record<string, ReadonlyArray<{ vid?: unknown }>> } & Record<string, unknown>>} */ (/** @type {unknown} */ (corpus));
  const block = c?.[blockId];
  if (!block?.pools) return corpus;
  /** @type {Record<string, ReadonlyArray<{ vid?: unknown }>>} */ const pools = {};
  /** @type {string[]} */ const struck = [];
  for (const [key, declared] of Object.entries(CRIME_LINE_DISQUALIFIERS)) {
    const [b, pool] = [key.slice(0, key.indexOf('::')), key.slice(key.indexOf('::') + 2)];
    const variants = block.pools[pool];
    if (b !== blockId || !Array.isArray(variants)) continue;
    const kept = variants.filter((v) => {
      const d = typeof v?.vid === 'number' ? declared[v.vid] : undefined;
      const out = Boolean(d && CRIME_LINE_FACTS[d.falseWhere](facts));
      if (out) struck.push(`${pool}#${v.vid}`);
      return !out;
    });
    if (kept.length !== variants.length) pools[pool] = Object.freeze(kept);
  }
  if (!struck.length) return corpus;
  const id = struck.join('|');
  let byCorpus = VIEWS.get(corpus);
  if (!byCorpus) { byCorpus = new Map(); VIEWS.set(corpus, byCorpus); }
  const held = byCorpus.get(`${blockId}|${id}`);
  if (held) return /** @type {T} */ (held);
  const view = Object.freeze({ ...c, [blockId]: Object.freeze({ ...block, pools: Object.freeze({ ...block.pools, ...pools }) }) });
  byCorpus.set(`${blockId}|${id}`, view);
  return /** @type {T} */ (/** @type {unknown} */ (view));
}
