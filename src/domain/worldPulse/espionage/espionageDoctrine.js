/**
 * espionageDoctrine.js — ES-0: WHO A COURT SPIES ON, HOW, HOW OFTEN, AND HOW IT TREATS
 * THE PEOPLE IT SENDS — read off the two alignment axes and nothing else.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.9. The `readConquestIntent` house idiom: closed word
 * tables in, closed words out, one frozen tuning, sorted totality exports, and an
 * `unknown` arm produced ONLY at the RESOLUTION gate (no court, no readable words) —
 * never as a flattering default for a court whose axes simply read balanced.
 *
 * ⭐ ITS ONLY IMPORT IS THE SHARED LAW VOCABULARY, AND THAT IS A PINNED PROPERTY (the
 * sovereigntyAppraisal geometry). Both alignment WORDS arrive as ARGUMENTS; the leaf
 * reaches for exactly one thing, `lawWord.js`, which is itself import-free. So this
 * module's whole transitive closure is two files. The pin in
 * tests/domain/espionageDoctrine.test.js asserts the exact import SET rather than
 * emptiness — a stronger statement, because it names what is allowed instead of
 * forbidding everything and then being relaxed the first time something is needed.
 *
 * ⚠ WHERE `lawWordFor` LIVES, AND WHY IT IS NOT HERE. The ES-0 charter named this file
 * as the mint site for the estate's single law-band spelling. Measured against the live
 * tree that is the wrong home: `warSeatBooks.js` (WAR) must import it, and
 * tests/lint/couplingInclusion.walker.test.js would then either count this module as
 * unlayered debt or license a WAR-to-INFORMATION coupling for a four-line ladder. That
 * walker's own argument for its two SP substrate leaves applies word for word — a shared
 * vocabulary "every layer spells against" is not a port, and giving it a family "would
 * make every layer's reading of a band word a cross-layer coupling, which is hosting by
 * another name". So `lawWordFor` is minted ONCE in src/domain/worldPulse/lawWord.js,
 * beside `bandFamilies.js` and `bandedStock.js`, and is imported here like anywhere
 * else. CR-ES-3's substance is untouched: one mint, one vocabulary, the consumer
 * spelling, the both-vocab equality pin. JUDGMENT, vetoable — the veto restores the
 * charter's file assignment and owes a coupling-registry row for the WAR read.
 *
 * WHAT THIS LEAF DELIBERATELY DOES NOT DO. §3.9 gives the doctrine receipt permission to
 * quote `deriveSystemVariable('law_order', s).contributors` SENTENCES as prose. It does
 * not happen here, and the omission is DECLARED rather than forgotten: those sentences
 * carry raw scores in their text, which a runtime receipt must never speak (L5), and
 * gathering worldState-side prose is the DOCTRINE STAGE's job
 * (`espionageDoctrineStage.js`, ES-5 — the conquestDoctrineStage split). This leaf takes
 * words and returns words.
 *
 * PURE: no rng, no clock, no store, no world read.
 */
import { LAW_WORDS, lawWordFor } from '../lawWord.js';

export { LAW_WORDS, lawWordFor };

/** Who a court considers a legitimate target. Codepoint-sorted totality export. */
export const DOCTRINE_TARGETINGS = Object.freeze(['all_courts', 'foes_only', 'rivals_and_foes']);

/** How it travels. Codepoint-sorted totality export. */
export const DOCTRINE_METHODS = Object.freeze(['lawful', 'lawless']);

/** How it treats the people it sends and the people it catches. Sorted. */
export const DOCTRINE_EMPLOYMENTS = Object.freeze(['lenient', 'strict']);

/**
 * Every constant the doctrine reads. Raw-authored PROPOSALS until the owner signs them
 * at the soak redo (L5, THE PROMISE) — no value here is ratified.
 */
export const ESPIONAGE_DOCTRINE_TUNING = Object.freeze({
  // J-ES-10, doctrine-LOCAL, and one vetoable pair rather than a second spelling. The
  // estate pair (0.67/0.33, lawWord.js) stays exactly where it is. The reason for a
  // local pair is arithmetic: the seat-archetype term alone reaches 0.632 at its most
  // lawful and 0.348 at its most lawless (executed over GOV_LAW_BAND through squash01),
  // so a doctrine banded on the estate pair would look inert on archetype-driven worlds.
  ORDER_EDGES: Object.freeze({ lawful: 0.60, lawless: 0.40 }),
  // The cadence composition. A court's appetite for sending spies at all: the base is
  // the balanced-balanced court and each axis pushes it. Lawful-benevolent lowest,
  // lawless-malicious highest (§3.9), and both extremes land inside 0..1 by ARITHMETIC
  // rather than by a clamp — a clamp doing real work here would be hiding a weight.
  FREQ_BASE: 0.4,
  FREQ_BY_ORDER: Object.freeze({ lawful: -0.15, balanced: 0, lawless: 0.15 }),
  FREQ_BY_NATURE: Object.freeze({ benevolent: -0.2, balanced: 0, malicious: 0.2 }),
});

/**
 * WHO IS WATCHED. Keyed on the MORAL axis alone, and that is the design: a benevolent
 * court watches only what threatens it; a malicious one watches its friends too — which
 * is why §3.3's friend-case catch exists at all.
 * @type {Readonly<Record<string, string>>}
 */
const TARGETING_BY_NATURE = Object.freeze({
  benevolent: 'foes_only',
  balanced: 'rivals_and_foes',
  malicious: 'all_courts',
});

/**
 * HOW IT TRAVELS. Keyed on the LAW axis, and the mapping is deliberately ASYMMETRIC:
 * only an actively `lawless` court takes the hidden ways (the `covert_envoy`
 * HIDDEN_PATH_KINDS franchise, ES-1). A `balanced` court keeps to lawful covers, so
 * hidden-way missions stay the exception. The method set §3.9 closes has exactly two
 * members, and mapping the middle rung to `lawless` would make hidden ways the world's
 * normal case.
 * @type {Readonly<Record<string, string>>}
 */
const METHOD_BY_ORDER = Object.freeze({
  lawful: 'lawful',
  balanced: 'lawful',
  lawless: 'lawless',
});

/**
 * HOW IT EMPLOYS. `strict` vets carefully, abandons less, pays ransoms; `lenient` hires
 * hurriedly and is abandonment-prone (feeding the existing `abandoned_to_captivity`
 * grievance). A court earns `strict` by being lawful OR benevolent — either an order
 * that keeps its own procedures, or a conscience that will not spend a person cheaply.
 * A court that is neither is `lenient`.
 * @param {string} orderWord @param {string} natureWord @returns {'strict'|'lenient'}
 */
function employmentFor(orderWord, natureWord) {
  return orderWord === 'lawful' || natureWord === 'benevolent' ? 'strict' : 'lenient';
}

/** Four-decimal rounding, the house spelling, kept local because this leaf stays thin.
 *  @param {number} value @returns {number} */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/**
 * The doctrine that could not be read, produced ONLY at the resolution gate (the
 * `judgeSovereigntySale` pattern). Every closed-word field is null rather than a
 * plausible default: a court the caller could not resolve has no doctrine, and
 * answering `balanced` would make silence look like a moderate temperament.
 *
 * @param {unknown} why a short, quotable reason — it lands verbatim in the receipt.
 * @returns {{ known: false, targeting: null, method: null, frequency01: null,
 *   employment: null, receipt: string }}
 */
export function unknownDoctrine(why) {
  const reason = String(why || 'unreadable');
  return Object.freeze({
    known: /** @type {false} */ (false),
    targeting: null,
    method: null,
    frequency01: null,
    employment: null,
    receipt: `No espionage doctrine can be read for this court: ${reason}.`,
  });
}

/**
 * @typedef {Object} EspionageDoctrine
 * @property {boolean} known
 * @property {string|null} targeting    a DOCTRINE_TARGETINGS member when known
 * @property {string|null} method       a DOCTRINE_METHODS member when known
 * @property {number|null} frequency01  dispatch cadence weight when known
 * @property {string|null} employment   a DOCTRINE_EMPLOYMENTS member when known
 * @property {string} receipt           doctrine WORDS only, never a number (L5)
 */

/**
 * THE COURT'S ESPIONAGE DOCTRINE, off both alignment axes.
 *
 * @param {{ courtId?: unknown, orderWord?: unknown, natureWord?: unknown }} input
 *   `orderWord` is a `lawWordFor` word (the caller bands the axis at
 *   ESPIONAGE_DOCTRINE_TUNING.ORDER_EDGES); `natureWord` is a `natureWordFor` word.
 * @returns {EspionageDoctrine}
 */
export function readEspionageDoctrine(input) {
  const row = input && typeof input === 'object' ? input : {};
  const courtId = String(row.courtId ?? '').trim();
  const orderWord = String(row.orderWord ?? '');
  const natureWord = String(row.natureWord ?? '');
  // THE RESOLUTION GATE, and the only place `unknown` is minted. A caller that could not
  // find the court, or could not band an axis (`natureWordFor` answers `unknown` for a
  // non-finite malice reading), gets a doctrine that says so.
  if (!courtId) return unknownDoctrine('no court was named');
  if (!LAW_WORDS.includes(orderWord)) return unknownDoctrine(`the order axis reads ${orderWord || 'nothing'}`);
  if (!(natureWord in TARGETING_BY_NATURE)) return unknownDoctrine(`the moral axis reads ${natureWord || 'nothing'}`);

  const targeting = TARGETING_BY_NATURE[natureWord];
  const method = METHOD_BY_ORDER[orderWord];
  const employment = employmentFor(orderWord, natureWord);
  const T = ESPIONAGE_DOCTRINE_TUNING;
  const orderShift = /** @type {Readonly<Record<string, number>>} */ (T.FREQ_BY_ORDER)[orderWord];
  const natureShift = /** @type {Readonly<Record<string, number>>} */ (T.FREQ_BY_NATURE)[natureWord];
  const frequency01 = round4(Math.max(0, Math.min(1, T.FREQ_BASE + orderShift + natureShift)));
  return Object.freeze({
    known: true,
    targeting,
    method,
    frequency01,
    employment,
    // WORDS ONLY. frequency01 is a control scalar and never enters prose (L5, and the
    // banded-runtime no-decimal pin). The reader learns the court's character, not its
    // coefficients.
    receipt: `A ${natureWord}, ${orderWord} court: it watches ${targeting.replace(/_/g, ' ')},`
      + ` travels by ${method} means, and holds its agents ${employment === 'strict' ? 'to account' : 'loosely'}.`,
  });
}
