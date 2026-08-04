/**
 * WR-9's additive v5 receipt section.
 *
 * This module owns the closed spellings used by the collector and the behavioral
 * oracle, and — since the WR-9 build wave — the DURATION vocabulary and the
 * declared envelope table those spellings are graded against. Keeping the
 * address wall and the envelope wall in one module is deliberate: an envelope
 * that could be authored against a key the totality validator does not know
 * would be an acceptance band nobody could ever fill.
 *
 * ⛔ NOTHING HERE IS RATIFIED. §7 of the war-rulings architecture names "WR-9
 * envelope shapes" as an owner-signed tuning row, and THE PROMISE binds: bands
 * are owner-SIGNED and versioned. Every number in `WAR_CONVERGENCE_TUNING` is
 * RAW-AUTHORED and UNSOAKED, in the same idiom as WR-7c's `RATIFICATION_TUNING`
 * and `COMPROMISE_ROUND_TUNING`. They deliberately do NOT live in
 * src/domain/tuning/proposedSoakBands.js, whose gate (scripts/check-tuning-bands.mjs)
 * requires status EXACTLY 'RATIFIED' — putting them there would forge a
 * signature this wave has no authority to give.
 *
 * ⛔ NO PERSISTED WORLD STATE. WR-9's lifecycle clause allows envelopes,
 * certification rows and receipt fields ONLY. This module imports no world
 * state, and the observation it describes lives exclusively inside the soak
 * receipt JSON.
 */

import {
  createEmptyWarForceEvidence,
  evaluateWarConvergenceForces,
  validateWarForceEvidence,
} from './warConvergenceForces.js';

/** @typedef {Record<string, unknown>} UnknownRecord */

/**
 * The additive WR-9 observation carried by a v5 soak receipt.
 *
 * v2 (the WR-9 build wave) adds `warDurationHistogram`. v3 (WR-9r) adds the
 * `unmeasured` duration cell. v4 (WR-9c) adds `forceEvidence`, the address the six
 * force cells grade. v5 (WR-9d) adds `endingsUnclassified` and
 * `decidingTermSampling`, the two addresses the collector's own honesty needs.
 * Every bump is EXACT rather than tolerant on the same principle: a v1 observation
 * has no duration address at all, a v2 one has no address for a LOST duration, a v3
 * one has no address for any force reading, and a v4 one has no address for a close
 * the classifier COULD NOT READ, so silently accepting one would let an envelope
 * grade a corpus it could not actually read. Each bump is the version arm of the
 * repair that motivated it, and refusing to bump would have contradicted this
 * paragraph's own law.
 *
 * WHY v5 EXISTS, MEASURED. Before WR-9d, `foldWarEndings` had NO production
 * consumer (only its own test) and `UNCLASSIFIED_MAX_SHARE` below appeared EXACTLY
 * ONCE in the whole repository — its own declaration. The collector produces
 * unclassified closes on every real corpus, and with nowhere to put them the
 * endings envelope could not tell "no war closed" from "every close was unreadable"
 * — precisely the WR-9r blindness, one dimension over.
 *
 * NOTHING IS ORPHANED, MEASURED RATHER THAN ASSERTED. Re-measured on 2026-08-04 at
 * `cb1ea74f`: the local receipt corpus under `artifacts/soak/` is gitignored
 * (`git ls-files artifacts` is EMPTY, so none of it is committed), and
 * `grep -l warConvergence -r artifacts/` returns NOTHING — no observation of any
 * version exists on disk to orphan, at v1, v2, v3 or v4.
 */
export const WAR_CONVERGENCE_OBSERVATION_VERSION = 5;

/**
 * The closed reasons a war close may fail to classify, declared HERE because this
 * module owns the address wall. It is a deliberate second spelling of
 * warEndingClassifier's own vocabulary rather than an import: that module imports
 * `WAR_ENDING_KEYS` from this one, so importing back would close a module cycle —
 * the shape that produced the dist chunk-cycle TDZ class. The two lists are pinned
 * identical in the test against the real module (WR-9c's J-WR9C-1 idiom).
 * @type {ReadonlyArray<string>}
 */
export const WAR_ENDING_UNCLASSIFIED_KEYS = Object.freeze([
  'not_a_closed_war',
  'no_terminal_evidence',
  'razing_road_unreconstructable',
]);

/**
 * Closed war-ending vocabulary from WR-9. The two punitive-sack paths stay
 * separate because their ratio is itself evidence about the vengeance-license
 * economy; folding them into one `punitive_sack` bucket would erase that claim.
 * @type {ReadonlyArray<string>}
 */
export const WAR_ENDING_KEYS = Object.freeze([
  'terms',
  'exhaustion',
  'ruler_change',
  'fragmentation',
  'annihilation',
  'conquest',
  'punitive_sack_initiation',
  'punitive_sack_vengeance',
]);

/** The four terms in WR-1's termination read. */
export const WAR_TERMINATION_DECIDING_TERM_KEYS = Object.freeze([
  'cause',
  'cost_to_continue',
  'cost_to_stop',
  'momentum',
]);

/**
 * THE WAR-DURATION VOCABULARY (WR-9 obligation 1: "tail and no infinity").
 *
 * The three lengths are the amendment's own three words — "most wars short, some
 * long, a few generational" — kept verbatim so a reader can trace each band back
 * to the sentence that authorized it. They are exported SEPARATELY as
 * `WAR_DURATION_LENGTH_BANDS` because the envelope's shares are denominated in
 * measured lengths, and deriving that denominator from an independent list
 * rather than by filtering the full vocabulary keeps the share arithmetic from
 * being a statement about its own map.
 *
 * THE OTHER TWO CELLS ARE DIAGNOSES, NOT LENGTHS, AND THEY ARE DIFFERENT
 * DIAGNOSES (CR-WR9-A, vetoable — UNMEASURABLE IS ITS OWN DIAGNOSIS):
 *
 *   `unresolved` counts wars still alive when the horizon ended — the
 *   no-infinity criterion ("a single year-300 war reds exactly as the trillion-
 *   person settlement did"). An INFINITE duration belongs here and not in
 *   `unmeasured`, because a war with no end is not a lost reading: it IS the
 *   alive-at-horizon war, stated in the only number that can state it.
 *
 *   `unmeasured` counts closes whose duration could not be read at all —
 *   absent, null, NaN, non-numeric or negative. WR-9r added it because without
 *   it the bander defaulted every one of those to `short`, `short` counted as
 *   RESOLVED, and a corpus of forty wars whose durations were entirely lost
 *   passed all five WR-9 checks with a short share of 1.0. A histogram that
 *   cannot say "I could not read this" will always say "short" instead.
 *
 * Keeping both inside the histogram rather than beside it means the totality
 * validator polices them for free.
 *
 * DENOMINATED IN 52-WEEK YEARS. WR-0c item (4) landed on 2026-08-02: current
 * treaties persist `treatyTicksPerYear: 52`, identity-pinned to
 * `INTERVAL_WEEKS.one_year`, and persisted legacy treaties keep their explicit
 * twelve-tick provenance marker rather than being silently rescaled. That ruling
 * is what unblocked these envelopes; the calendar named here is the canonical
 * one, never the legacy cadence.
 * @type {ReadonlyArray<string>}
 */
export const WAR_DURATION_LENGTH_BANDS = Object.freeze([
  'short',
  'long',
  'generational',
]);

/**
 * The full duration vocabulary: the three measured lengths, then the two
 * diagnoses. `unmeasured` is appended LAST so the addition is purely additive —
 * every pre-existing index keeps its meaning — and so a reader meets the three
 * words of the amendment before either failure cell.
 * @type {ReadonlyArray<string>}
 */
export const WAR_DURATION_BANDS = Object.freeze([
  ...WAR_DURATION_LENGTH_BANDS,
  'unresolved',
  'unmeasured',
]);

/**
 * ⛔ RAW-AUTHORED, UNSOAKED, UNRATIFIED — the WR-9 envelope table (§7 tuning row).
 * One table per wave is the house idiom. Every number below is a first authored
 * guess at the SHAPE the amendment describes, not a measurement: no soak has run
 * against them, and the owner has signed none of them. They exist so the
 * envelope is a number somebody can argue with rather than a sentence nobody can
 * execute.
 */
export const WAR_CONVERGENCE_TUNING = Object.freeze({
  /** A war shorter than this many 52-week years is `short`. */
  DURATION_SHORT_MAX_YEARS: 3,
  /** A war at least this many 52-week years old is `generational` (a human span). */
  DURATION_GENERATIONAL_MIN_YEARS: 25,
  /** The tail: `short` must carry at least this share of resolved wars. */
  DURATION_SHORT_MIN_SHARE: 0.4,
  /** …and `generational` at most this share — a tail, never the body. */
  DURATION_GENERATIONAL_MAX_SHARE: 0.1,
  /**
   * NO INFINITY. Wars still alive at the horizon, as an absolute count. Zero is
   * not a tuning choice — it is the amendment's own criterion — but it is
   * carried here so the envelope reads from one table rather than a literal.
   */
  UNRESOLVED_AT_HORIZON_MAX: 0,
  /**
   * NO LOST MEASUREMENTS. Closes whose duration could not be read at all, as an
   * absolute count. STRICT BY DESIGN and — unlike the number above it — this one
   * IS a tuning choice rather than an amendment criterion: it is zero because an
   * instrument that has never been run has no evidence entitling it to a
   * tolerance, not because a real corpus was measured and found perfect.
   *
   * ⛔ REVISITABLE WITH EVIDENCE AT THE TUNING WAVE. When the collector lands and
   * a full-horizon soak reports a real unmeasured rate, this threshold is the
   * correct place to argue about it — with the measurement in hand, owner-signed
   * like every other band. Until then a single lost duration must red, because
   * the alternative is a histogram that quietly reports its own blindness as a
   * short war.
   */
  UNMEASURED_DURATIONS_MAX: 0,
  /**
   * "One path carrying nearly all endings means the others are decoration"
   * (L's own criterion): no single ending key may exceed this share.
   */
  ENDING_DOMINANCE_MAX_SHARE: 0.6,
  /** …and at least this many of the eight keys must be observed at all. */
  ENDING_MIN_DISTINCT_KEYS: 4,
  /**
   * R2's licence economy is graded by the initiation-vs-vengeance RATIO, not by
   * either count alone. The band is wide because it is unmeasured; it exists to
   * catch a degenerate economy (all initiations, or all vengeance) rather than
   * to tune one.
   */
  SACK_VENGEANCE_MIN_SHARE_OF_SACKS: 0.15,
  SACK_VENGEANCE_MAX_SHARE_OF_SACKS: 0.85,
  /**
   * An instrument whose unclassified closes outnumber this share of all closes
   * is not measuring the world, it is failing to read it — and a histogram that
   * passed under that condition would be the greenwash this wave exists to
   * prevent.
   */
  UNCLASSIFIED_MAX_SHARE: 0.1,
});

/**
 * The duration band for a war of `years` 52-week years. TOTAL over every input:
 * this is the single writer of the duration vocabulary, and every return names a
 * cell in `WAR_DURATION_BANDS`.
 *
 * ⚠️⚠️ THE ROUTING IS THE REPAIR (WR-9r). This function used to answer `short`
 * for undefined, null, NaN, '', a non-numeric string, a negative number AND
 * Infinity, and the aggregation counted `short` as RESOLVED — so a corpus of
 * forty wars whose durations were entirely lost passed the duration envelope
 * with a short share of 1.0, and an INFINITE duration inverted the very
 * no-infinity criterion it should have tripped. The docstring that stood here
 * claimed the `non_vacuous` wall would refuse such a corpus; that claim was
 * executed and found FALSE, which is why the wall named below now exists.
 *
 *   - unreadable (undefined, null, NaN, '', a non-numeric string, negative,
 *     -Infinity, or any non-number) → `unmeasured`, refused by
 *     `war_convergence.duration_measured`.
 *   - `Infinity` → `unresolved`, refused by the no-infinity criterion inside
 *     `war_convergence.duration_envelope`. An endless war is a HORIZON fact
 *     stated as a number, not a lost reading.
 *   - anything finite and non-negative → its length band.
 *
 * ⚠️ THE HORIZON-RELATIVE ARM IS OWED, NOT BUILT (CR-WR9-C). The ruling also
 * routes "any duration exceeding the case horizon" to `unresolved`. That needs
 * each case's own horizon, which this pure bander is not given, and it lands with
 * the collector at WR-9d. Today only `Infinity` reaches `unresolved` from here;
 * a census that knows a war outlived its horizon must hand this function
 * `Infinity` to say so.
 *
 * @param {unknown} years
 * @returns {string} one of WAR_DURATION_BANDS
 */
export function warDurationBandFor(years) {
  // `Number(null)`, `Number('')` and `Number(false)` are all 0 — a coercion that
  // would hand the shortest possible war to the least possible evidence. Only a
  // real number, or a string with something in it, is allowed to become one.
  const value = typeof years === 'number'
    ? years
    : (typeof years === 'string' && years.trim() !== '' ? Number(years) : Number.NaN);
  if (Number.isNaN(value)) return 'unmeasured';
  if (value === Number.POSITIVE_INFINITY) return 'unresolved';
  if (value < 0) return 'unmeasured';
  if (value < WAR_CONVERGENCE_TUNING.DURATION_SHORT_MAX_YEARS) return 'short';
  if (value >= WAR_CONVERGENCE_TUNING.DURATION_GENERATIONAL_MIN_YEARS) return 'generational';
  return 'long';
}

/**
 * Every feature flag introduced by the compiled WR program. WR-4/5 ride earlier
 * flags and WR-9 is an instrument, so neither invents a row of its own.
 * `dispositionChannelsEnabled` is the corrected WR-2 name, not the superseded
 * greenfield spelling in the original flag table.
 */
export const WAR_RULINGS_FLAG_KEYS = Object.freeze([
  'warTerminationEnabled',
  'dispositionChannelsEnabled',
  'lineageClaimEnabled',
  'coalitionLedgerEnabled',
  'envoyDiplomacyEnabled',
  'conquestDoctrineEnabled',
  'sovereigntyTradeEnabled',
]);

/** The selected subsystem-certification fields embedded in the WR-9 receipt. */
export const WAR_FLAG_RULE_STATES = Object.freeze(['on', 'off', 'unknown']);
export const WAR_FLAG_CERTIFICATION_VERDICTS = Object.freeze([
  'ALIVE',
  'DORMANT_BY_CONFIG',
  'SILENT',
  'UNOBSERVED',
]);

/** @param {unknown} value @returns {UnknownRecord} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {UnknownRecord} */ (value)
    : {}
);

/** @param {ReadonlyArray<string>} keys @returns {Record<string, number>} */
const zeroCountMap = (keys) => Object.fromEntries(keys.map((key) => [key, 0]));

/**
 * Start a WR-9 collector without duplicating any closed-vocabulary spelling.
 * The empty value is structurally valid but deliberately INELIGIBLE: its
 * histograms are vacuous and every flag row is UNOBSERVED. A collector has to
 * replace those observations with measured evidence before certification can
 * pass.
 */
export function createEmptyWarConvergenceObservation() {
  return {
    schemaVersion: WAR_CONVERGENCE_OBSERVATION_VERSION,
    kind: 'war_convergence_observation',
    endingsMix: zeroCountMap(WAR_ENDING_KEYS),
    // v5: the closes the classifier could NOT read. An endings mix without this
    // beside it is a histogram that reports its own blindness as an empty world.
    endingsUnclassified: zeroCountMap(WAR_ENDING_UNCLASSIFIED_KEYS),
    warDurationHistogram: zeroCountMap(WAR_DURATION_BANDS),
    terminationDecidingTermHistogram: zeroCountMap(
      WAR_TERMINATION_DECIDING_TERM_KEYS,
    ),
    // v5: the deciding-term histogram's declared resolution. `samples` 0 with an
    // empty declaration is the honest empty state — a collector replaces it.
    decidingTermSampling: { decidingTermSample: '', samples: 0 },
    flagCertificationRows: WAR_RULINGS_FLAG_KEYS.map((rule) => ({
      rule,
      ruleState: 'unknown',
      verdict: 'UNOBSERVED',
    })),
    // WR-9c's force address. The forces leaf owns its own vocabulary, builder and
    // totality wall, so the address wall and the envelope wall still sit in one
    // module — that module is just the one that grades it.
    forceEvidence: createEmptyWarForceEvidence(),
  };
}

/**
 * Validate one additive v5 WR-9 observation. This is a shape and totality wall,
 * not an envelope oracle: it proves that every ending, deciding term, and WR
 * feature flag has an address. The behavioral evaluator separately refuses
 * vacuous histograms and unobserved/all-silent flag coverage.
 *
 * @param {unknown} raw
 * @returns {{ ok: boolean, errors: string[], observation: UnknownRecord|null }}
 */
export function validateWarConvergenceObservation(raw) {
  /** @type {string[]} */
  const errors = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      ok: false,
      errors: ['warConvergence must be an object.'],
      observation: null,
    };
  }
  const observation = asRecord(raw);
  if (observation.schemaVersion !== WAR_CONVERGENCE_OBSERVATION_VERSION) {
    errors.push(
      `warConvergence.schemaVersion must be ${WAR_CONVERGENCE_OBSERVATION_VERSION}.`,
    );
  }
  if (observation.kind !== 'war_convergence_observation') {
    errors.push('warConvergence.kind must be war_convergence_observation.');
  }

  /**
   * @param {string} field
   * @param {ReadonlyArray<string>} keys
   */
  const validateHistogram = (field, keys) => {
    const rawHistogram = observation[field];
    if (!rawHistogram || typeof rawHistogram !== 'object' || Array.isArray(rawHistogram)) {
      errors.push(`warConvergence.${field} must be an object.`);
      return;
    }
    const histogram = asRecord(rawHistogram);
    const expected = new Set(keys);
    for (const key of keys) {
      const count = histogram[key];
      if (!Object.prototype.hasOwnProperty.call(histogram, key)) {
        errors.push(`warConvergence.${field} is missing ${key}.`);
      } else if (!Number.isInteger(count) || Number(count) < 0) {
        errors.push(`warConvergence.${field}.${key} must be a non-negative integer.`);
      }
    }
    for (const key of Object.keys(histogram)) {
      if (!expected.has(key)) {
        errors.push(`warConvergence.${field} has unknown key ${key}.`);
      }
    }
  };

  validateHistogram('endingsMix', WAR_ENDING_KEYS);
  validateHistogram('endingsUnclassified', WAR_ENDING_UNCLASSIFIED_KEYS);
  validateHistogram('warDurationHistogram', WAR_DURATION_BANDS);
  validateHistogram(
    'terminationDecidingTermHistogram',
    WAR_TERMINATION_DECIDING_TERM_KEYS,
  );

  // The sampling declaration is a SHAPE wall, not a value wall: this module has no
  // business ruling on what resolution a collector achieved, only on whether it
  // said. A receipt that carries deciding terms while declaring no sample at all is
  // the one combination refused outright — that is an instrument quoting a
  // precision it never claimed.
  const sampling = observation.decidingTermSampling;
  if (!sampling || typeof sampling !== 'object' || Array.isArray(sampling)) {
    errors.push('warConvergence.decidingTermSampling must be an object.');
  } else {
    const declared = asRecord(sampling);
    if (typeof declared.decidingTermSample !== 'string') {
      errors.push('warConvergence.decidingTermSampling.decidingTermSample must be a string.');
    }
    if (!Number.isInteger(declared.samples) || Number(declared.samples) < 0) {
      errors.push('warConvergence.decidingTermSampling.samples must be a non-negative integer.');
    }
    if (Number(declared.samples) > 0 && String(declared.decidingTermSample) === '') {
      errors.push(
        'warConvergence.decidingTermSampling must name its sample once any deciding term is counted.',
      );
    }
  }

  if (!Array.isArray(observation.flagCertificationRows)) {
    errors.push('warConvergence.flagCertificationRows must be an array.');
  } else {
    const expected = new Set(WAR_RULINGS_FLAG_KEYS);
    /** @type {Set<string>} */
    const seen = new Set();
    for (const [index, rawRow] of observation.flagCertificationRows.entries()) {
      if (!rawRow || typeof rawRow !== 'object' || Array.isArray(rawRow)) {
        errors.push(`warConvergence.flagCertificationRows[${index}] must be an object.`);
        continue;
      }
      const row = asRecord(rawRow);
      const rule = typeof row.rule === 'string' ? row.rule : '';
      if (!expected.has(rule)) {
        errors.push(
          `warConvergence.flagCertificationRows[${index}].rule is unknown: ${String(row.rule)}.`,
        );
      } else if (seen.has(rule)) {
        errors.push(`warConvergence.flagCertificationRows duplicates ${rule}.`);
      }
      if (rule) seen.add(rule);
      if (!WAR_FLAG_RULE_STATES.includes(/** @type {string} */ (row.ruleState))) {
        errors.push(
          `warConvergence.flagCertificationRows[${index}].ruleState must be one of: ${WAR_FLAG_RULE_STATES.join(', ')}.`,
        );
      }
      if (!WAR_FLAG_CERTIFICATION_VERDICTS.includes(
        /** @type {string} */ (row.verdict),
      )) {
        errors.push(
          `warConvergence.flagCertificationRows[${index}].verdict must be one of: ${WAR_FLAG_CERTIFICATION_VERDICTS.join(', ')}.`,
        );
      }
      if ((row.ruleState === 'off') !== (row.verdict === 'DORMANT_BY_CONFIG')) {
        errors.push(
          `warConvergence.flagCertificationRows[${index}] must pair off with DORMANT_BY_CONFIG, and only that pair.`,
        );
      }
      if (row.ruleState === 'unknown' && row.verdict !== 'UNOBSERVED') {
        errors.push(
          `warConvergence.flagCertificationRows[${index}] cannot claim ${String(row.verdict)} from an unknown rule state.`,
        );
      }
    }
    for (const rule of WAR_RULINGS_FLAG_KEYS) {
      if (!seen.has(rule)) {
        errors.push(`warConvergence.flagCertificationRows is missing ${rule}.`);
      }
    }
  }

  // The force address is policed by the module that grades it, and its errors
  // arrive already carrying their receipt path so this wall stays one list.
  errors.push(...validateWarForceEvidence(observation.forceEvidence));

  return { ok: errors.length === 0, errors, observation };
}

/** @param {ReadonlyArray<string>} keys @returns {Record<string, number>} */
const emptyTotals = (keys) => Object.fromEntries(keys.map((key) => [key, 0]));

/** @param {Record<string, number>} counts @returns {number} */
const sumCounts = (counts) => Object.values(counts)
  .reduce((total, count) => total + count, 0);

/**
 * Grade WR-9 instrumentation across the release corpus: the address wall, the
 * non-vacuity wall, the flag-coverage wall, and — since the WR-9 build wave —
 * the duration and endings ENVELOPES — and, since WR-9c, the six force cells,
 * which live in warConvergenceForces.js and are composed into the array returned
 * below. THE PRESENT TENSE IS NOW EARNED: WR-9r corrected this sentence to
 * future-tense because the file did not exist and its own name appeared nowhere
 * else in the tree; WR-9c built it, so the claim is restored to the present and
 * the occurrence-counting clause is deleted rather than re-counted — a count of
 * mentions goes stale the moment anything imports the module.
 *
 * ⛔ THE ENVELOPES ARE UNRATIFIED and both will honestly FAIL at HEAD: the soak
 * runs `full_simulation`, in which every declared WR flag is false, so a rerun
 * today produces an all-zero mix and an all-zero duration histogram. That
 * failure is CORRECT EVIDENCE of the sequencing state, not a defect to engineer
 * around, and no check here may be weakened to make it reachable.
 *
 * ⚠️⚠️ FORCE 3 IS UNOBSERVED AT HEAD AND THE WHOLE CERTIFICATE FALLS WITH IT.
 * `war_convergence.force_3_ruler_change_rises_with_duration` has no substrate to
 * read and cannot be filled by any corpus, so the `war_convergence_instrumented`
 * property is unearnable until the engine grows one. That is the acceptance
 * harness reporting an unmet obligation of amendment L, not a defect of this
 * module; the forces leaf's header states the measurement.
 *
 * ⚠️ CR-WR9-C, THE INSTRUMENTED-CASE WIDENING (WR-9d). This used to be handed
 * `releaseCases` only. It is now handed every receipt at an INSTRUMENTED HORIZON —
 * release AND research — because a 300-year research case measures exactly the war
 * convergence this instrument exists to read, and dropping it discarded evidence
 * the corpus had already paid for. The horizon years arrive as an argument rather
 * than being imported: `behavioralContract.js` owns `CERTIFICATION_HORIZONS` and
 * imports THIS module, so reading them back would close a module cycle.
 *
 * The ruling's other half — "the unresolved-at-horizon wall keyed to each case's
 * OWN horizon" — is discharged at COLLECTION time, not here. The collector marks a
 * war unresolved when it is still alive in the last year THAT case ran, so a
 * 100-year case and a 300-year case each report against their own clock and this
 * sum needs no horizon constant at all.
 *
 * @param {unknown[]} rawReceipts
 * @param {number} expectedEnvelopeSchemaVersion
 * @param {ReadonlyArray<number>|null} [instrumentedHorizonYears] the case horizons
 *   this corpus grades. Null or omitted ⇒ every receipt is graded, which is what a
 *   caller that has already selected its cases wants.
 * @returns {Array<{
 *   id: string,
 *   label: string,
 *   passed: boolean,
 *   observed: unknown,
 *   threshold: unknown,
 *   state?: string,
 *   unobservedReason?: string,
 * }>} the envelope cells, the three wall cells (`duration_measured`,
 *   `endings_classified`, `non_vacuous`), then the six force cells. The
 *   last two fields are carried only by the force cells, whose third verdict state
 *   (UNOBSERVED) a boolean cannot express.
 */
export function evaluateWarConvergenceInstrumentation(
  rawReceipts,
  expectedEnvelopeSchemaVersion,
  instrumentedHorizonYears = null,
) {
  const allReceipts = Array.isArray(rawReceipts) ? rawReceipts.map(asRecord) : [];
  // The selection is by HORIZON, never by "carries an observation": a case that
  // reached an instrumented horizon and carries no WR-9 section is exactly the
  // failure `war_convergence.receipt_shape` exists to name, and filtering it out
  // here would let it escape the wall by being invisible to it.
  const horizons = Array.isArray(instrumentedHorizonYears)
    ? instrumentedHorizonYears.map((years) => Number(years))
    : null;
  const receipts = horizons
    ? allReceipts.filter((receipt) => horizons.includes(Number(receipt.years)))
    : allReceipts;
  const parsed = receipts.map((receipt) => ({
    receipt,
    validation: validateWarConvergenceObservation(receipt.warConvergence),
  }));
  const invalidCases = parsed
    .filter(({ receipt, validation }) => (
      receipt.schemaVersion !== expectedEnvelopeSchemaVersion || !validation.ok
    ))
    .map(({ receipt, validation }) => ({
      caseId: String(receipt.caseId || ''),
      envelopeSchemaVersion: receipt.schemaVersion ?? null,
      errors: validation.errors,
    }));
  const shapePassed = receipts.length > 0 && invalidCases.length === 0;
  const endingTotals = emptyTotals(WAR_ENDING_KEYS);
  const unclassifiedTotals = emptyTotals(WAR_ENDING_UNCLASSIFIED_KEYS);
  const durationTotals = emptyTotals(WAR_DURATION_BANDS);
  const decidingTermTotals = emptyTotals(WAR_TERMINATION_DECIDING_TERM_KEYS);
  /** @type {Record<string, { on: number, alive: number, silent: number, unobserved: number }>} */
  const flagTotals = Object.fromEntries(WAR_RULINGS_FLAG_KEYS.map((rule) => [
    rule,
    { on: 0, alive: 0, silent: 0, unobserved: 0 },
  ]));
  /** @type {unknown[]} */
  const forceEvidences = [];

  if (shapePassed) {
    for (const { validation } of parsed) {
      const observation = /** @type {UnknownRecord} */ (validation.observation);
      forceEvidences.push(observation.forceEvidence);
      for (const key of WAR_ENDING_KEYS) {
        endingTotals[key] += Number(asRecord(observation.endingsMix)[key]);
      }
      for (const key of WAR_ENDING_UNCLASSIFIED_KEYS) {
        unclassifiedTotals[key] += Number(asRecord(observation.endingsUnclassified)[key]);
      }
      for (const key of WAR_DURATION_BANDS) {
        durationTotals[key] += Number(asRecord(observation.warDurationHistogram)[key]);
      }
      for (const key of WAR_TERMINATION_DECIDING_TERM_KEYS) {
        decidingTermTotals[key] += Number(
          asRecord(observation.terminationDecidingTermHistogram)[key],
        );
      }
      for (const rawRow of /** @type {UnknownRecord[]} */ (
        observation.flagCertificationRows
      )) {
        const row = asRecord(rawRow);
        const totals = flagTotals[String(row.rule)];
        if (!totals) continue;
        if (row.ruleState === 'on') totals.on += 1;
        if (row.verdict === 'ALIVE') totals.alive += 1;
        if (row.verdict === 'SILENT') totals.silent += 1;
        if (row.verdict === 'UNOBSERVED') totals.unobserved += 1;
      }
    }
  }

  const endingsObserved = sumCounts(endingTotals);
  const decidingTermsObserved = sumCounts(decidingTermTotals);
  // The duration envelope grades MEASURED wars against the tail shape, and keeps
  // both failure cells out of the denominator. A war still burning at the
  // horizon is not a long war, it is the no-infinity failure; a war whose
  // duration was never read is not a short war, it is a blind instrument. Either
  // one averaged into the tail would hide exactly the thing it is evidence of.
  const durationResolved = WAR_DURATION_LENGTH_BANDS
    .reduce((total, band) => total + durationTotals[band], 0);
  const durationUnmeasured = durationTotals.unmeasured;
  const durationMeasuredPassed = shapePassed
    && durationUnmeasured <= WAR_CONVERGENCE_TUNING.UNMEASURED_DURATIONS_MAX;
  const shortShare = durationResolved > 0
    ? durationTotals.short / durationResolved
    : 0;
  const generationalShare = durationResolved > 0
    ? durationTotals.generational / durationResolved
    : 0;
  const durationEnvelopePassed = shapePassed
    && durationResolved > 0
    && durationTotals.unresolved <= WAR_CONVERGENCE_TUNING.UNRESOLVED_AT_HORIZON_MAX
    && shortShare >= WAR_CONVERGENCE_TUNING.DURATION_SHORT_MIN_SHARE
    && generationalShare <= WAR_CONVERGENCE_TUNING.DURATION_GENERATIONAL_MAX_SHARE;
  // The endings envelope answers L's own criterion — "one path carrying nearly
  // all endings means the others are decoration" — and, separately, whether R2's
  // licence economy runs on both roads or has collapsed onto one.
  const distinctEndingKeys = WAR_ENDING_KEYS
    .filter((key) => endingTotals[key] > 0).length;
  const dominantShare = endingsObserved > 0
    ? Math.max(...WAR_ENDING_KEYS.map((key) => endingTotals[key])) / endingsObserved
    : 1;
  const sacksObserved = endingTotals.punitive_sack_initiation
    + endingTotals.punitive_sack_vengeance;
  const vengeanceShareOfSacks = sacksObserved > 0
    ? endingTotals.punitive_sack_vengeance / sacksObserved
    : 0;
  // A world that burned nothing has no licence economy to grade, and a vacuous
  // ratio must not be read as a healthy one: the sack band applies only where
  // sacks were actually observed, and the non-vacuity wall is what refuses a
  // corpus with no endings at all.
  const sackRatioPassed = sacksObserved === 0
    || (vengeanceShareOfSacks >= WAR_CONVERGENCE_TUNING.SACK_VENGEANCE_MIN_SHARE_OF_SACKS
      && vengeanceShareOfSacks <= WAR_CONVERGENCE_TUNING.SACK_VENGEANCE_MAX_SHARE_OF_SACKS);
  const endingsEnvelopePassed = shapePassed
    && endingsObserved > 0
    && distinctEndingKeys >= WAR_CONVERGENCE_TUNING.ENDING_MIN_DISTINCT_KEYS
    && dominantShare <= WAR_CONVERGENCE_TUNING.ENDING_DOMINANCE_MAX_SHARE
    && sackRatioPassed;
  // THE ENDINGS-SIDE TWIN OF `duration_measured` (WR-9d). Its denominator is every
  // COUNTED CLOSE — classified plus unclassified — because the share that matters is
  // "of the wars that ended, how many could this instrument actually read", and
  // dividing by the classified ones alone would be the self-referential denominator
  // that always answers 1.0.
  const closesCounted = endingsObserved + sumCounts(unclassifiedTotals);
  const unclassifiedShare = closesCounted > 0
    ? sumCounts(unclassifiedTotals) / closesCounted
    : 0;
  const endingsClassifiedPassed = shapePassed
    && unclassifiedShare <= WAR_CONVERGENCE_TUNING.UNCLASSIFIED_MAX_SHARE;
  const flagCoveragePassed = shapePassed && WAR_RULINGS_FLAG_KEYS.every((rule) => {
    const totals = flagTotals[rule];
    return totals.alive > 0
      && totals.unobserved === 0;
  });
  return [
    {
      id: 'war_convergence.receipt_shape',
      label: 'every release case carries the total WR-9 observation in the additive v5 envelope',
      passed: shapePassed,
      observed: { cases: receipts.length, invalidCases },
      threshold: {
        envelopeSchemaVersion: expectedEnvelopeSchemaVersion,
        observationSchemaVersion: WAR_CONVERGENCE_OBSERVATION_VERSION,
        requiredEndings: WAR_ENDING_KEYS,
        requiredUnclassifiedReasons: WAR_ENDING_UNCLASSIFIED_KEYS,
        requiredDurationBands: WAR_DURATION_BANDS,
        requiredDecidingTerms: WAR_TERMINATION_DECIDING_TERM_KEYS,
        requiredFlagRows: WAR_RULINGS_FLAG_KEYS,
      },
    },
    // ⚠ A GREEN HERE DOES NOT MEAN THE INSTRUMENT RAN (WR-9c, ruling N2). This cell
    // says only that nothing which WAS counted came back unreadable; a corpus that
    // counted no wars at all satisfies it vacuously, and `war_convergence.non_vacuous`
    // is the wall that refuses that corpus. Read the two together or read neither.
    {
      id: 'war_convergence.duration_measured',
      label: 'every closed war handed the histogram a duration it could actually read',
      passed: durationMeasuredPassed,
      observed: { durationUnmeasured, durationTotals },
      threshold: {
        maxUnmeasuredDurations: WAR_CONVERGENCE_TUNING.UNMEASURED_DURATIONS_MAX,
        strictByDesign: true,
        revisitableWithEvidenceAtTuningWave: true,
        ratified: false,
      },
    },
    {
      id: 'war_convergence.duration_envelope',
      label: 'war durations form a tail with no infinity — mostly short, generational rare, none alive at the horizon',
      passed: durationEnvelopePassed,
      observed: {
        durationTotals,
        durationResolved,
        shortShare,
        generationalShare,
        unresolvedAtHorizon: durationTotals.unresolved,
      },
      threshold: {
        minResolvedWars: 1,
        maxUnresolvedAtHorizon: WAR_CONVERGENCE_TUNING.UNRESOLVED_AT_HORIZON_MAX,
        minShortShare: WAR_CONVERGENCE_TUNING.DURATION_SHORT_MIN_SHARE,
        maxGenerationalShare: WAR_CONVERGENCE_TUNING.DURATION_GENERATIONAL_MAX_SHARE,
        calendar: '52-week years (WR-0c item 4: current treaties, never the legacy twelve-tick cadence)',
        ratified: false,
      },
    },
    {
      id: 'war_convergence.endings_envelope',
      label: 'no single ending carries the mix, enough endings are reachable, and both sack roads stay live',
      passed: endingsEnvelopePassed,
      observed: {
        endingTotals,
        endingsObserved,
        distinctEndingKeys,
        dominantShare,
        sacksObserved,
        vengeanceShareOfSacks,
      },
      threshold: {
        minDistinctEndingKeys: WAR_CONVERGENCE_TUNING.ENDING_MIN_DISTINCT_KEYS,
        maxDominantShare: WAR_CONVERGENCE_TUNING.ENDING_DOMINANCE_MAX_SHARE,
        minVengeanceShareOfSacks: WAR_CONVERGENCE_TUNING.SACK_VENGEANCE_MIN_SHARE_OF_SACKS,
        maxVengeanceShareOfSacks: WAR_CONVERGENCE_TUNING.SACK_VENGEANCE_MAX_SHARE_OF_SACKS,
        ratified: false,
      },
    },
    // ⚠ A GREEN HERE DOES NOT MEAN THE INSTRUMENT RAN, on the same principle as
    // `duration_measured` above: it says only that the closes which WERE counted
    // were readable. A corpus that closed no war at all satisfies it vacuously and
    // `war_convergence.non_vacuous` is the wall that refuses that corpus.
    {
      id: 'war_convergence.endings_classified',
      label: 'every closed war handed the endings mix a road the classifier could actually read',
      passed: endingsClassifiedPassed,
      observed: {
        closesCounted,
        classified: endingsObserved,
        unclassified: sumCounts(unclassifiedTotals),
        unclassifiedShare,
        unclassifiedTotals,
      },
      threshold: {
        maxUnclassifiedShare: WAR_CONVERGENCE_TUNING.UNCLASSIFIED_MAX_SHARE,
        reasonsAreDistinctDiagnoses: WAR_ENDING_UNCLASSIFIED_KEYS,
        ratified: false,
      },
    },
    {
      id: 'war_convergence.non_vacuous',
      label: 'the endings mix, duration histogram and deciding-term histogram all contain measured war evidence',
      passed: shapePassed
        && endingsObserved > 0
        && durationResolved > 0
        && decidingTermsObserved > 0,
      observed: {
        endingsObserved,
        endingTotals,
        durationResolved,
        durationTotals,
        decidingTermsObserved,
        decidingTermTotals,
      },
      threshold: {
        minEndingsObserved: 1,
        minResolvedDurations: 1,
        minDecidingTermsObserved: 1,
      },
    },
    {
      id: 'war_convergence.flag_coverage',
      label: 'every WR feature flag is alive somewhere and never unobserved in the release matrix',
      passed: flagCoveragePassed,
      observed: { cases: receipts.length, flags: flagTotals },
      threshold: {
        minAliveCasesPerFlag: 1,
        maxUnobservedCasesPerFlag: 0,
      },
    },
    // The six force cells, composed INSIDE this array so the behavioral oracle
    // needs no second call and neither module has to know the other exists. Force 6
    // is handed the endings totals THIS function already computed rather than
    // recomputing them, so the two readings can never disagree.
    ...evaluateWarConvergenceForces({
      shapePassed,
      forceEvidences,
      endingTotals,
      endingsObserved,
    }),
  ];
}
