/**
 * phraseRepetitionEnvelope.js — SP-E. THE PHRASE-REPETITION ENVELOPE, A SOAK INSTRUMENT.
 *
 * ITS OWN LEAF, DELIBERATELY. The war lane's WR-9 instruments live in
 * warConvergenceContract.js, which measures 953 raw lines at this commit and is the
 * certification directory's hottest shared file. SP-E's collision map says additive files
 * only, no edits there — so this lands beside it rather than inside it.
 *
 * ── THE QUESTION IT ANSWERS ─────────────────────────────────────────────────────
 *
 * The frequency-scaled floor (SP-E's walker) proves a pool is DEEP. Depth is not the same
 * claim as VARIETY: a pool of twelve variants whose picker keeps landing on the same three
 * reads to a player exactly like a pool of three. The floor is a property of the corpus; this
 * is a property of what a town actually HEARD over a season, which is the only place the
 * defect is visible.
 *
 * So the measure is not "how many variants exist" but "of the lines this settlement was told
 * in one season, how many were something it had already been told".
 *
 *     repeatShare = (sampled - distinct) / sampled     per settlement, per season window
 *
 * A collapsed pool drives that toward 1. A healthy chronic pool sits well below the ceiling
 * because the picker keeps finding voices the season has not spent.
 *
 * ── WHY A CEILING AND NOT A TWO-SIDED BAND (declared, not omitted) ──────────────
 *
 * The estate's dead-band law wants both sides of a band to live. This one is ONE-SIDED BY
 * DESIGN and the reason is recorded here rather than left to read as an oversight: a repeat
 * share of zero is the ideal outcome, not a defect. A lower bound would punish a wave for
 * authoring depth, which inverts the incentive the whole SP-6 floor program exists to create.
 * The lower side is declared-empty with that reason; the upper side is the band the owner
 * signs.
 *
 * ── THE POWER PROBLEM, AND WHY WINDOWS ARE COUNTED AS WELL AS MEASURED ──────────
 *
 * A window that sampled two lines cannot tell a deep pool from a collapsed one — the measure
 * is noise at that size, and an instrument averaging such windows in would dilute a real
 * collapse until it passed. Windows below `POWERED_WINDOW_MINIMUM` are therefore EXCLUDED and
 * COUNTED, and a report with no powered window at all is reported as carrying NO EVIDENCE
 * rather than as a pass. An instrument that cannot fail is not a guardrail; the estate has
 * already paid for that lesson once, in the hand-picked bounds this leaf's helper
 * (tests/helpers/distributionEnvelope.js) was written to replace.
 *
 * PURE. No world state, no store, no PRNG, no clock. Its ONE import is the estate's
 * cross-device-stable string comparator: a certification read that sorted through the host's
 * ICU tables could order two towns differently on two machines and hand the owner a different
 * receipt for the same soak. Consumed by nothing at land time — dark by construction (the
 * lane-P precedent). The soak wires it; SP-E proves it.
 */
import { compareCodepoint } from '../deterministicSort.js';

/**
 * THE SEASON WINDOW, in weeks. SP-E §7 tuning row; owner-signed at the soak redo.
 *
 * It MIRRORS the calendar's own quarter (`WEEKS_PER_SEASON` in
 * src/domain/worldPulse/worldState.js, a module-private constant that is not exported). The
 * correspondence is pinned by this leaf's walker rather than imported, because a certification
 * instrument that silently followed a calendar change would re-band itself without anyone
 * signing the new band.
 */
export const SEASON_WINDOW_WEEKS = 13;

/**
 * THE ENVELOPE CEILING. SP-E §7 tuning row; UNRATIFIED until the owner signs it at the soak
 * redo, and therefore deliberately absent from src/domain/tuning/proposedSoakBands.js (whose
 * every row must carry status 'RATIFIED' — see scripts/check-tuning-bands.mjs).
 *
 * The value is derived, not guessed. Sampling a pool of depth d uniformly n times leaves an
 * expected distinct count of d(1 - (1 - 1/d)^n). At the shallowest floor a chronic kind may
 * hold (eight voices) across a thirteen-week season that is 6.6 distinct lines — a repeat
 * share near 0.49. A pool collapsed to a single voice yields 0.92. The ceiling sits between
 * them, nearer the collapse, so an ordinary season never grazes it and a collapse cannot hide.
 */
export const PHRASE_REPETITION_CEILING = 0.75;

/**
 * The smallest sample a window must carry before its measurement is treated as evidence. Four,
 * because four is the shallowest floor any authored pool may sit at (a rare `major` kind): a
 * window that heard fewer lines than the SHALLOWEST pool holds cannot distinguish depth from
 * collapse, whatever it measures.
 */
export const POWERED_WINDOW_MINIMUM = 4;

/**
 * @typedef {object} PhraseReceipt
 * @property {string|number} settlementId  the town that was told the line
 * @property {number} tick                 the week it was told, in engine weeks
 * @property {string} line                 the RENDERED sentence, after interpolation
 */

/**
 * @typedef {object} RepetitionWindow
 * @property {string} settlementId   normalized to a string key
 * @property {number} window         the season index (floor(tick / windowWeeks))
 * @property {number} sampled        lines the settlement was told in the window
 * @property {number} distinct       how many of them were different
 * @property {number} repeatShare    (sampled - distinct) / sampled, 0 when sampled is 0
 * @property {boolean} powered       whether the window carries enough sample to be evidence
 */

/**
 * @typedef {object} RepetitionOptions
 * @property {number} [windowWeeks]  season width; defaults to SEASON_WINDOW_WEEKS
 */

/**
 * Is this a receipt this instrument can read? A malformed entry is DROPPED rather than
 * defaulted, because a receipt with no settlement or no tick has no window to belong to, and
 * inventing one would file a real town's line under a fictional season.
 * @param {unknown} candidate
 * @returns {candidate is PhraseReceipt}
 */
function isReadable(candidate) {
  if (!candidate || typeof candidate !== 'object') return false;
  const row = /** @type {Record<string, unknown>} */ (candidate);
  const idOk = typeof row.settlementId === 'string' || typeof row.settlementId === 'number';
  const tickOk = typeof row.tick === 'number' && Number.isFinite(row.tick);
  const lineOk = typeof row.line === 'string' && row.line.trim() !== '';
  return idOk && tickOk && lineOk;
}

/**
 * Bucket rendered receipts into per-settlement, per-season windows and measure each one.
 *
 * Deterministic in every respect a certification read must be: the output is sorted by
 * settlement then window, so two runs over the same receipts in a different ORDER produce
 * byte-identical rows.
 *
 * @param {Iterable<unknown>} receipts
 * @param {RepetitionOptions} [options]
 * @returns {RepetitionWindow[]}
 */
export function phraseRepetitionWindows(receipts, options = {}) {
  const width = options.windowWeeks == null ? SEASON_WINDOW_WEEKS : options.windowWeeks;
  if (!Number.isInteger(width) || width < 1) {
    throw new Error(
      `phraseRepetitionEnvelope: windowWeeks must be a positive integer (got ${JSON.stringify(width)});`
      + ' a zero or fractional season would file every line in one bucket and the measure would'
      + ' report a repeat share for a window that never existed',
    );
  }

  // A NESTED MAP, NOT A COMPOSITE STRING KEY. Joining the settlement id and the window into
  // one string needs a separator that can never occur in a settlement id, and choosing one is
  // how this estate has repeatedly ended up with a raw NUL byte authored into a source file
  // (it happened again in this very function, and the byte-scan caught it). Two levels of Map
  // need no separator at all and cannot collide by construction.
  /** @type {Map<string, Map<number, string[]>>} */
  const buckets = new Map();
  for (const candidate of receipts) {
    if (!isReadable(candidate)) continue;
    const settlementId = String(candidate.settlementId);
    const window = Math.floor(candidate.tick / width);
    let byWindow = buckets.get(settlementId);
    if (!byWindow) {
      byWindow = new Map();
      buckets.set(settlementId, byWindow);
    }
    const lines = byWindow.get(window);
    if (lines) lines.push(candidate.line);
    else byWindow.set(window, [candidate.line]);
  }

  /** @type {RepetitionWindow[]} */
  const out = [];
  for (const [settlementId, byWindow] of buckets) {
    for (const [window, lines] of byWindow) {
      const sampled = lines.length;
      const distinct = new Set(lines).size;
      out.push({
        settlementId,
        window,
        sampled,
        distinct,
        repeatShare: sampled === 0 ? 0 : (sampled - distinct) / sampled,
        powered: sampled >= POWERED_WINDOW_MINIMUM,
      });
    }
  }
  return out.sort((a, b) => (
    a.settlementId === b.settlementId
      ? a.window - b.window
      : compareCodepoint(a.settlementId, b.settlementId)
  ));
}

/**
 * The windows that breach the ceiling, as violation ROWS. Unpowered windows are never
 * violations: they carry no evidence in either direction.
 * @param {ReadonlyArray<RepetitionWindow>} windows
 * @param {number} [ceiling]
 * @returns {RepetitionWindow[]}
 */
export function phraseRepetitionViolations(windows, ceiling = PHRASE_REPETITION_CEILING) {
  return windows.filter((row) => row.powered && row.repeatShare > ceiling);
}

/**
 * @typedef {object} RepetitionReport
 * @property {RepetitionWindow[]} windows       every measured window, sorted
 * @property {number} poweredWindows            how many carry enough sample to be evidence
 * @property {number} unpoweredWindows          how many were excluded, so the exclusion is visible
 * @property {number|null} worstRepeatShare     the highest powered share, or null with no evidence
 * @property {RepetitionWindow[]} violations    powered windows above the ceiling
 * @property {boolean} carriesEvidence          false when no window was powered
 * @property {boolean} withinEnvelope           true only when there IS evidence and none breached
 * @property {number} ceiling                   the ceiling this report was graded against
 */

/**
 * THE INSTRUMENT. Grade a season's rendered receipts against the authored envelope.
 *
 * `withinEnvelope` is false when the report carries NO EVIDENCE, not true. A soak that
 * produced too few lines to measure has not demonstrated variety; reporting that as a pass is
 * exactly the vacuous green this estate keeps paying for.
 *
 * @param {Iterable<unknown>} receipts
 * @param {RepetitionOptions & { ceiling?: number }} [options]
 * @returns {RepetitionReport}
 */
export function phraseRepetitionReport(receipts, options = {}) {
  const ceiling = options.ceiling == null ? PHRASE_REPETITION_CEILING : options.ceiling;
  if (!(Number.isFinite(ceiling) && ceiling > 0 && ceiling < 1)) {
    throw new Error(
      `phraseRepetitionEnvelope: ceiling must lie strictly inside (0, 1) (got ${JSON.stringify(ceiling)});`
      + ' a ceiling of 1 can never be breached and a ceiling of 0 is breached by any repeat at all',
    );
  }
  const windows = phraseRepetitionWindows(receipts, options);
  const powered = windows.filter((row) => row.powered);
  const violations = phraseRepetitionViolations(windows, ceiling);
  const worstRepeatShare = powered.length
    ? powered.reduce((worst, row) => (row.repeatShare > worst ? row.repeatShare : worst), 0)
    : null;
  return {
    windows,
    poweredWindows: powered.length,
    unpoweredWindows: windows.length - powered.length,
    worstRepeatShare,
    violations,
    carriesEvidence: powered.length > 0,
    withinEnvelope: powered.length > 0 && violations.length === 0,
    ceiling,
  };
}
