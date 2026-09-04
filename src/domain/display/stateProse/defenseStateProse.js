/**
 * domain/display/stateProse/defenseStateProse.js — DESK CAR 12: THE DEFENSE DESK.
 *
 * The fourth desk module, and the FIRST PRODUCTION USE OF THE DM'S-PEN PROJECTION.
 *
 *   DS-DEF-3  Defense › Public order banner — `safetyProfile.{safetyLabel, safetyDesc}`
 *
 * ── WHY THIS BLOCK ALONE, AND WHY DS-DEF-1 IS NOT HERE ───────────────────────────────
 *
 * DS-DEF-3 and DS-DEF-1 are the leaf's two DM-PEN blocks and were planned as one car,
 * because they share ONE new risk: the DM's-pen projection has never run in production.
 * DS-DEF-1 turned out to carry a SECOND, unrelated risk, so it was split out rather than
 * bundled — two independent risks under one green prove neither.
 *
 * DS-DEF-1's readiness lens keys on `STRONG · ADEQUATE · WEAK · CRITICAL`, which is exactly
 * `defenseScoreBands.scoreBand(n)` — free, already on this tab, an exact 1:1. But it needs
 * the OVERALL defence score, and that mean (`avgScore`) is a four-line pure function
 * stranded in two heavy modules: `pdf/lib/viewModelPrimitives.js` drags 293,079 B and
 * `domain/display/dossierViewModel.js` drags 278,633 B (measured transitively against the
 * first-paint closure). A third hand-rolled copy is precisely what
 * `parityContract.js`'s `defense.scoreAvg` pin exists to prevent. So DS-DEF-1 waits on a
 * SMALL LIFT of `avgScore` into a cheap leaf — `defenseScoreBands.js` is its natural home,
 * being the defence-score band module and already free here — which is its own act because
 * it touches the PDF call sites and the parity contract.
 *
 * ── THE DM'S PEN, AND WHY THIS DESK CANNOT OVERWRITE IT ──────────────────────────────
 *
 * `safetyProfile.safetyDesc` is a DM-EDITABLE field (declared in
 * `dmFieldProjection.DM_EDITABLE_SETTLEMENT_PROSE_PATHS`, and named by
 * `DM_FIELD_FRAMED_BY_BLOCK['DS-DEF-3']`). An implementer wiring "the corpus supplies this
 * section's prose" the obvious way overwrites the DM's sentence and does it silently,
 * because the machine sentence is a perfectly good sentence. So this desk returns the
 * corpus line through `projectBesideDmField`, which has NOWHERE TO PUT A WRITE: it hands
 * back the DM's string BY IDENTITY and offers the machine line as a separate adjacent
 * field.
 * ⚠ THAT MODULE HAD ZERO RUNTIME CALLERS BEFORE THIS CAR. It is unit-tested and had never
 * been exercised in production, so it was treated as unproven machinery and PROVEN by
 * execution before being leaned on: 8/8 framed paths declared editable, the field returned
 * by identity, `beside` null when the corpus is silent, and — the pin that matters — the
 * wired field's bytes identical to the dark field's bytes. The desk test re-proves all of
 * it here rather than citing that run.
 *
 * ── THE THREE LENSES, ALL WITH MEASURED PRODUCERS ────────────────────────────────────
 *   THE LABEL (5 pools)  `safetyProfile.js` writes exactly `Very Safe · Safe · Moderate ·
 *                        Unsafe · Dangerous`. An EXACT 1:1 with the five pools.
 *   THE COMPOUND (1)     Under a crisis the generator REWRITES the label into a compound
 *                        form — `Controlled — Occupation Curfew`, `Tense — Active Siege`,
 *                        `Desperate — Famine Conditions`. The corpus wrote a pool named
 *                        `COMPOUND override (a crisis stress has rewritten the label)` for
 *                        exactly that, the same anticipation `layer DORMANT` shows. It is
 *                        detected by the em dash the compound form carries, never by a list
 *                        of crisis names that would need maintaining.
 *   FIRST SURVEY (1)     A framing pool, and its basis is a measurement: `safetyLabel` has
 *                        ZERO writers under `src/domain/worldPulse/`, so the reading is
 *                        never re-judged once generated. The qualification is therefore
 *                        always true of it — which is why the corpus wrote it as a framing
 *                        line rather than a state-keyed one, exactly like DS-STR-1's
 *                        "Overview's own section framing".
 *
 * @enforced-by tests/domain/defenseStateProseDesk.test.js
 */
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../../data/dossierStateProse/defense.generated.js';
import { projectBesideDmField } from './dmFieldProjection.js';
import { readStateProse } from './stateProseKernel.js';
import { legibilityRung } from './legibilityRung.js';

/**
 * The desk's corpus, typed at the import boundary — the generated leaves stay PURE DATA.
 * @type {import('./stateProseKernel.js').StateProseCorpus}
 */
const CORPUS = /** @type {import('./stateProseKernel.js').StateProseCorpus} */ (
  /** @type {unknown} */ (DOSSIER_STATE_PROSE_DEFENSE)
);

/**
 * THE SHAPES THIS DESK BELIEVES ITS SLOTS HAVE, mirroring §0c's Shape column. DS-DEF-3's
 * variants name `{settlement}` and nothing else — measured, all seven pools.
 * @type {Readonly<Record<string, string>>}
 */
export const SLOT_FILL_SHAPES = Object.freeze({ settlement: 'proper' });

/**
 * This desk owns NO literal fill table, and says so rather than omitting the field — the
 * projection contract's guard treats an exported string map as a candidate fill table and
 * refuses one this does not name.
 * @type {Readonly<Record<string, Readonly<Record<string, string>>>>}
 */
export const SLOT_FILL_TABLES = Object.freeze({});

/** The pool that qualifies the reading as a first look. See the docblock for its basis. */
const FIRST_SURVEY_POOL = 'First-Survey qualification (the reading is a first look)';
/** The pool for a label a crisis has rewritten. */
const COMPOUND_POOL = 'COMPOUND override (a crisis stress has rewritten the label)';

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * A `proper` fill, or `undefined` — mirroring `fillShapeViolation`'s PROPER branch.
 * @param {string} value @returns {string|undefined}
 */
function properFill(value) {
  if (!value) return undefined;
  if (/[—–]/.test(value)) return undefined;
  if (/[.!?]\s|[.!?]$/.test(value)) return undefined;
  if (/[0-9]/.test(value)) return undefined;
  if (/[a-z]+_[a-z]+/.test(value)) return undefined;
  return /^[A-Z]/.test(value) ? value : undefined;
}

/**
 * Has a crisis rewritten the label? The compound form the generator builds is
 * `"<strain> — <crisis>"`, so the EM DASH is the marker. Detecting the dash rather than
 * listing the crisis names is deliberate: the list would need maintaining and a new crisis
 * would silently read as an ordinary label, which is the quiet-degradation shape.
 * @param {unknown} safetyLabel @returns {boolean}
 */
export function isCompoundSafetyLabel(safetyLabel) {
  return /[—–]/.test(text(safetyLabel));
}

/**
 * DS-DEF-3's label pool key. A compound label goes to the COMPOUND pool; a clean label to
 * its own; anything the corpus does not carry renders NOTHING rather than falling into a
 * neighbouring band, because a safety band is a claim about whether the streets are safe.
 * @param {unknown} safetyLabel @returns {string|null}
 */
export function publicOrderPoolKey(safetyLabel) {
  const label = text(safetyLabel);
  if (!label) return null;
  if (isCompoundSafetyLabel(label)) return COMPOUND_POOL;
  return CORPUS['DS-DEF-3'].pools[label] ? label : null;
}

/**
 * DS-DEF-3's first-survey qualification. It applies whenever there is a reading to qualify:
 * `safetyLabel` is written at generation and has no world-pulse writer, so it is never
 * re-judged and the qualification is always true of it.
 * @param {unknown} safetyLabel @returns {string|null}
 */
export function firstSurveyPoolKey(safetyLabel) {
  return text(safetyLabel) ? FIRST_SURVEY_POOL : null;
}

/**
 * THE DESK. Returns the public-order banner's two rungs, each already projected BESIDE the
 * DM's own sentence rather than over it.
 *
 * Each returned entry is the `projectBesideDmField` shape — `{ field, beside, hasField }` —
 * and NOT a bare rung, deliberately: a composer that receives a rung can render it wherever
 * it likes, including in the position the DM's field occupies. Handing back the projection
 * means the only thing the caller can do with the machine line is put it BESIDE.
 *
 * @param {{name?: string, economicState?: {safetyProfile?: {safetyLabel?: unknown,
 *   safetyDesc?: unknown}|null}|null}|null|undefined} settlement
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<{publicOrder: object|null, firstSurvey: object|null}>}
 */
export function defenseStateProse(settlement, options = {}) {
  const safety = settlement?.economicState?.safetyProfile || {};
  const label = safety.safetyLabel;
  const slots = { settlement: properFill(text(settlement?.name)) };

  /** @param {string|null} poolKey */
  const line = (poolKey) => (poolKey
    ? readStateProse(CORPUS, 'DS-DEF-3', poolKey, { ...options, slots })
    : null);

  const orderKey = publicOrderPoolKey(label);
  const surveyKey = firstSurveyPoolKey(label);
  const orderLine = line(orderKey);
  const surveyLine = line(surveyKey);

  return Object.freeze({
    // THE DM'S FIELD IS THE SUBJECT OF BOTH PROJECTIONS. `safetyDesc` is the DM's sentence
    // about public order, so both corpus lines sit beside the same field.
    publicOrder: orderKey
      ? Object.freeze({
        ...projectBesideDmField(safety.safetyDesc, orderLine?.text ?? null),
        rung: legibilityRung(text(label), orderLine, []),
      })
      : null,
    firstSurvey: surveyKey
      ? Object.freeze({
        ...projectBesideDmField(safety.safetyDesc, surveyLine?.text ?? null),
        rung: legibilityRung('', surveyLine, []),
      })
      : null,
  });
}
