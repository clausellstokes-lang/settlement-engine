/**
 * tests/helpers/safetyKindDetectors.js — BAR4-SAFETY (BRIEF-BAR4 amendment K): THE THREE KINDS' DETECTORS, pure functions
 * over a town's RECORD and its PRINTED LINES (a page's text, one line a row: the census's dump, or the record's own prose
 * fields where a test has no render). Each returns EVERY instance of its kind: the state that makes a line false, and the
 * line printing in it. The lines DECLARE what they claim in the tables below (one row a claim: its words and its value);
 * the detector reads the claims against the record's ONE settled fact and against each other.
 *
 *   F1 · HOW THE GUARD IS PAID: the settled fact is `facts/guardPay.js :: guardPayOf` (the funded gate, or an unpaid rota).
 *   F2 · WHETHER THE BESIEGERS MOVE: the settled fact is `facts/siegeMotion.js :: siegeMotionOf` (the siege condition's
 *        own status, the one the stressor desk's direction pool reads).
 *   F3 · WHETHER CRIME HAS A STRUCTURE: the settled fact is `facts/criminalStructureKey.js :: criminalStructureKeyOf`.
 *
 * Pure: no draw, no clock, no write. Used by the census count (scratch) and by `tests/domain/bar4SafetyKinds.test.js`.
 */

/** F1: the claims a line makes of the guard's pay. `full` = paid and kept; `short` = paid late or short; `unpaid` = no pay at all. */
export const GUARD_PAY_CLAIMS = Object.freeze([
  Object.freeze({ re: /\b(?:watch|garrison|guard|militia)\b[^.]*\bwell paid\b/i, pay: 'full' }),
  Object.freeze({ re: /\b(?:watch|garrison|guard|militia)\b[^.]*\bpaid in full\b/i, pay: 'full' }),
  Object.freeze({ re: /\birregular pay\b/i, pay: 'short' }),
  Object.freeze({ re: /\bchronically underpaid\b/i, pay: 'short' }),
  Object.freeze({ re: /\bThe guard has not been paid this month\b/, pay: 'short' }),
  Object.freeze({ re: /\bfall short on the watch's wages\b/i, pay: 'short' }),
  Object.freeze({ re: /\bNobody is paid, and the households hold the rota\b/, pay: 'unpaid' }),
  Object.freeze({ re: /\bA rota of unpaid householders\b/, pay: 'unpaid' }),
  Object.freeze({ re: /\bUnpaid neighbours who take turns\b/, pay: 'unpaid' }),
]);

/** F2: the claims a line makes of a siege's motion. */
export const SIEGE_MOTION_CLAIMS = Object.freeze([
  Object.freeze({ re: /\bbesiegers draw closer\b/i, motion: 'advancing' }),
  Object.freeze({ re: /\bsiege of .+ is tightening\b/i, motion: 'advancing' }),
  Object.freeze({ re: /\bbesiegers around .+ have not moved\b/i, motion: 'holding' }),
  Object.freeze({ re: /\bthe lines outside do not move\b/i, motion: 'holding' }),
  Object.freeze({ re: /\bNeither side of .+ siege is gaining\b/i, motion: 'holding' }),
  Object.freeze({ re: /\bbesiegers have drawn back\b/i, motion: 'easing' }),
  Object.freeze({ re: /\bas the siege loosens\b/i, motion: 'easing' }),
]);

/** F3: the claims a line makes of crime's structure. `none` denies any; `organized` claims an organised one. */
export const CRIME_STRUCTURE_CLAIMS = Object.freeze([
  Object.freeze({ re: /\bNo criminal infrastructure\b/, structure: 'none' }),
  Object.freeze({ re: /\borganised crime has crowded out\b/i, structure: 'organized' }),
]);

/** @param {ReadonlyArray<string>} lines @param {ReadonlyArray<{ re: RegExp }>} table */
const claimsIn = (lines, table) => lines.flatMap((line) => table.filter((c) => c.re.test(line)).map((c) => ({ line, claim: c })));

/**
 * F1. Every line whose pay claim the settled fact denies, and every page with two pay values.
 * @param {unknown} pay the settled fact (`guardPayOf(record)`: 'full' | 'short' | 'unpaid' | null)
 * @param {ReadonlyArray<string>} lines the page's lines
 * @returns {Array<{ kind: 'F1', line: string, said: string, fact: unknown, why: string }>}
 */
export function guardPayInstances(pay, lines) {
  const said = claimsIn(lines, GUARD_PAY_CLAIMS);
  const values = new Set(said.map((s) => /** @type {{ pay: string }} */ (s.claim).pay));
  const out = [];
  for (const s of said) {
    const v = /** @type {{ pay: string }} */ (s.claim).pay;
    if (pay != null && v !== pay) out.push({ kind: /** @type {const} */ ('F1'), line: s.line, said: v, fact: pay, why: 'the settled fact says otherwise' });
    else if (values.size > 1) out.push({ kind: /** @type {const} */ ('F1'), line: s.line, said: v, fact: pay, why: 'the page gives the pay two values' });
  }
  return out;
}

/**
 * F2. Every line whose siege-motion claim the settled fact denies, and every page with two motions.
 * @param {unknown} motion the settled fact (`siegeMotionOf(record)`: 'advancing' | 'holding' | 'easing' | null)
 * @param {ReadonlyArray<string>} lines
 * @returns {Array<{ kind: 'F2', line: string, said: string, fact: unknown, why: string }>}
 */
export function siegeMotionInstances(motion, lines) {
  const said = claimsIn(lines, SIEGE_MOTION_CLAIMS);
  const values = new Set(said.map((s) => /** @type {{ motion: string }} */ (s.claim).motion));
  const out = [];
  for (const s of said) {
    const v = /** @type {{ motion: string }} */ (s.claim).motion;
    if (motion != null && v !== motion) out.push({ kind: /** @type {const} */ ('F2'), line: s.line, said: v, fact: motion, why: 'the settled fact says otherwise' });
    else if (motion == null && values.size > 1) out.push({ kind: /** @type {const} */ ('F2'), line: s.line, said: v, fact: motion, why: 'the page gives the siege two motions' });
  }
  return out;
}

/**
 * F3. Every denial of a criminal structure where the record holds one (the key, a criminal income row, a covert criminal
 * service), and every claim of organised crime where the key reads no organisation.
 * @param {{ key: unknown, criminalIncome: boolean, covertService: boolean }} held the record's readings
 * @param {ReadonlyArray<string>} lines
 * @returns {Array<{ kind: 'F3', line: string, said: string, fact: unknown, why: string }>}
 */
export function crimeStructureInstances(held, lines) {
  const out = [];
  for (const s of claimsIn(lines, CRIME_STRUCTURE_CLAIMS)) {
    const v = /** @type {{ structure: string }} */ (s.claim).structure;
    if (v === 'none' && (held.key != null || held.criminalIncome || held.covertService)) {
      out.push({ kind: /** @type {const} */ ('F3'), line: s.line, said: v, fact: held, why: 'the record holds a criminal structure' });
    }
    if (v === 'organized' && held.key !== 'organized' && held.key !== 'semi-organized') {
      out.push({ kind: /** @type {const} */ ('F3'), line: s.line, said: v, fact: held, why: 'the key reads no organisation' });
    }
  }
  return out;
}

/**
 * The record's crime readings F3 needs beside the key: a criminal income row with a share, a covert criminal service.
 * @param {any} record @returns {{ criminalIncome: boolean, covertService: boolean }}
 */
export function crimeReadingsOf(record) {
  const income = Array.isArray(record?.economicState?.incomeSources) ? record.economicState.incomeSources : [];
  const services = record?.availableServices?.criminal;
  return {
    criminalIncome: income.some((/** @type {any} */ r) => r?.isCriminal === true && Number(r?.percentage) > 0),
    covertService: Array.isArray(services) && services.some((/** @type {any} */ x) => x?.institution === '(covert)'),
  };
}
