/**
 * habitVocabulary.js — HB-0. THE HABIT FAMILY'S TWO FROZEN VOCABULARIES: the closed
 * CIRCUMSTANCE-CLASS set the learning key is filed under, and the HOLD band ladder a
 * doctrine sheet reads a stock through.
 *
 * PURE. No world state, no store, no PRNG, no clock. Zero callers at land time — dark by
 * construction (the WR-10 dark-instrument precedent), exactly as `bandFamilies.js` was.
 *
 * ── THE BORROW CENSUS (J-WR-10-B: a mint records what it looked for) ─────────────
 *
 * MEASURED at code-of-record `6784bf62`, each of the twelve class tokens scanned as a
 * quoted literal across 2,116 files under `src/`: ALL TWELVE RETURNED ZERO HITS. The
 * rejected twelfth candidate `ordinary` returned ELEVEN (narrativeGenerator,
 * coalitionRatification, demographicsRates ×3, envoyRatificationStage ×2 and others), so
 * `unpressed` carries the total-fallback role instead — a word no other ladder speaks
 * cannot be read by mistake, which is the same argument `bandFamilies.js` makes for its
 * severity ladder.
 *
 * The class NAMES are minted here. Every class DEFINITION borrows an existing typed read
 * and mints no second spelling of any band: the stressor catalog and the war stressor
 * types, the ratification verdicts and ballot decisions, the drama-class registry, the
 * causal bands, the demographic overflow bands, the primary relationship types, the
 * embattlement level, and the pact answer clock. That classifier — `circumstanceClassOf`
 * — is NOT built here and its absence is recorded rather than silent: HB-0 is pure and
 * cannot read a world, and no HB wave charter assigns the classifier a home. It is first
 * needed at HB-2's writer, and it is docketed for that compile.
 *
 * ⚠ THE OCCUPANCY MIX IS OWED ELSEWHERE, BY RULING. Chair question Q2 attached a
 * class-occupancy measurement on generated worlds to HB-0; that measurement needs a
 * classifier, a stock and a graded close, and none of the three exists at this wave.
 * OWNER_DECISION_QUEUE.md §36 (CR-HB-Q2) re-aims it to HB-2 with its reopen trigger
 * intact — if the total fallback exceeds roughly seventy per cent of classified
 * decisions, the chair reopens the vocabulary before HB-4 spends it.
 *
 * ── THE HOLD LADDER IS A ONE-DIRECTIONAL BORROW, NOT A COPY (R9) ────────────────
 *
 * MEASURED: `dispositionLedger`'s channel ladder is declared `const`, not `export const`;
 * it is an array of OBJECTS carrying an exclusive threshold and a name; and it is ordered
 * ASCENDING BY THRESHOLD, consumed as a `find` over that threshold — which works only
 * because THE INDEX IS THE RANK. Its one outward path is the `BANDS` member of the
 * exported `DISPOSITION_CHANNEL_TUNING`. So there is no both-sides import to make and no
 * second array to keep equal to a first: HB DERIVES, and a rename or a reorder upstream
 * reds this family's own walker rather than silently re-spelling a doctrine sheet.
 *
 * ⚠ The compile's warning that the ladder is codepoint-sorted is INVERTED and the
 * correction is worth keeping here: the rank is derived FROM the threshold order, never
 * from a sort.
 *
 * @enforced-by tests/domain/habitVocabulary.test.js
 */
import { DISPOSITION_CHANNEL_TUNING } from '../dispositionLedger.js';

/**
 * THE CLOSED CIRCUMSTANCE-CLASS SET, CODEPOINT-SORTED for totality (the house idiom).
 * ⛔ This is NOT a precedence order. Reading an index here as a rank inverts the meaning —
 * the exact trap `espionageMath.js` names in-source about its mission grades.
 * @type {readonly string[]}
 */
export const CIRCUMSTANCE_CLASSES = Object.freeze([
  'coalition_called',
  'crowding_pressed',
  'faith_contested',
  'legitimacy_shaken',
  'rival_ascendant',
  'route_menaced',
  'siege_pressed',
  'stores_thin',
  'terms_offered',
  'trade_contested',
  'unpressed',
  'war_open',
]);

/**
 * THE PRECEDENCE ORDER, MOST ACUTE FIRST — declared, never derived. A classifier walks
 * this array and returns the first match, so the last member is the TOTAL FALLBACK and
 * the classifier can never return null, "unknown", or two classes at once.
 * @type {readonly string[]}
 */
export const CIRCUMSTANCE_PRECEDENCE = Object.freeze([
  'siege_pressed',
  'war_open',
  'terms_offered',
  'coalition_called',
  'faith_contested',
  'legitimacy_shaken',
  'stores_thin',
  'crowding_pressed',
  'trade_contested',
  'route_menaced',
  'rival_ascendant',
  'unpressed',
]);

/** The member of the precedence order that fires when nothing else does. */
export const TOTAL_FALLBACK_CLASS = CIRCUMSTANCE_PRECEDENCE[CIRCUMSTANCE_PRECEDENCE.length - 1];

/**
 * THE OWNER-SIGNED CEILING (refinement 9). Twelve is a CEILING, not a target: the
 * directive's words are "initial set at most 12 classes; growth by owner-signed addition
 * only". A thirteenth class is an owner gate, not an edit — which is why the vocabulary
 * carries TWO assertions rather than one. The count pin catches drift; this pin refuses
 * it.
 */
export const HABIT_CLASS_CEILING = 12;

/**
 * THE HOLD BAND LADDER, ASCENDING — DERIVED by projection from the disposition channel
 * tuning's own band table rather than transcribed, so the borrow can never become a
 * private copy. See the header: the borrow is one-directional by measurement, not by
 * preference.
 * @type {readonly string[]}
 */
export const HABIT_HOLD_BANDS = Object.freeze(
  DISPOSITION_CHANNEL_TUNING.BANDS.map((band) => String(band.name)),
);

/**
 * Rung name to rank. THE INDEX IS THE RANK, and it is meaningful only while the source
 * table stays threshold-ascending — which this family's walker asserts, because a
 * reordering upstream would invert every doctrine sheet in the world silently.
 * @type {Readonly<Record<string, number>>}
 */
export const HOLD_RANK = Object.freeze(
  Object.fromEntries(HABIT_HOLD_BANDS.map((name, index) => [name, index])),
);

/**
 * Rank of a hold rung. THROWS on an unknown rung: a silent fallback would file a sheet
 * line at whatever rank the fallback chose, and a reader would trust it.
 * @param {string} rung
 * @returns {number}
 */
export function holdRankOf(rung) {
  const rank = typeof rung === 'string' ? HOLD_RANK[rung] : undefined;
  if (rank === undefined) {
    throw new Error(
      `habitVocabulary: unknown hold rung ${JSON.stringify(rung)} — the ladder is`
      + ` [${HABIT_HOLD_BANDS.join(', ')}] and it is borrowed whole, never re-spelled`,
    );
  }
  return rank;
}

/**
 * Is `token` a member of the closed class vocabulary? The one membership question a
 * consumer is allowed to ask, so no surface re-derives the set from a string compare.
 * @param {unknown} token
 * @returns {boolean}
 */
export function isCircumstanceClass(token) {
  return typeof token === 'string' && CIRCUMSTANCE_CLASSES.includes(token);
}
