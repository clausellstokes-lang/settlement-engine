/**
 * evaluate.mjs — THE CALLER THE TRIPWIRE REGISTRY NEVER HAD (SOAKCHAIN Car 2;
 * DESIGN_HORIZON §1.6, §4.1).
 *
 * ⛔ THE GAP, MEASURED BEFORE IT WAS CLOSED. Nothing in any committed pipeline evaluated
 * `population_collapse`, `negative_stock`, `unbounded_growth` or `memory_watermark`
 * (CONFIRMED by grep across every workflow and every script). The registry was a complete,
 * typed, tested instrument that no run ever pointed at a receipt. A detector with no caller
 * is not a guard — it is a guard-shaped file, and its zero findings are a WEAK zero of
 * exactly the kind `non_finite_ledger_figure`'s own history already paid for.
 *
 * ⛔ IT IMPORTS `./tripwires.mjs` AND NOTHING ELSE FROM THE ESTATE. `scripts/soak/**` is an
 * ARM_B_ROOT of the engine/telemetry wall, so an import specifier naming `worldPulse`,
 * `worldState`, `generateSettlementPipeline` or `simulationRules` from this directory REDS.
 * This file reads receipts — plain JSON that has already left the engine — so it needs no
 * engine contact at all, and the wall is structural rather than remembered.
 *
 * THE ANNOTATION IS THE POINT. SK-5's `freezeBlockers` (`./curveBands.mjs:66-80`) reads
 * `deterministicFirings`, `fullInstrument`, `provisional`, `rolling`, `restored` and
 * `behavioralPropertiesPassing` — six fields NOBODY WROTE, so the band capsule was
 * unfreezeable not because a precondition failed but because no run ever stated whether it
 * held. `evaluateReceipt` writes exactly those six and no more, so a clean run becomes
 * freezable as a matter of executed evidence.
 */

import { evaluateTripwires } from './tripwires.mjs';

/** The receipt kind that is the full watchdog; anything else is a probe or a fragment. */
export const FULL_INSTRUMENT_KIND = 'whole_world_soak';

/** The restore probe's kind, which states its own fix-loop-only status (§141, generalized). */
export const RESTORE_PROBE_KIND = 'whole_world_soak_restore_probe';

/**
 * Evaluate ONE receipt and annotate it for the freeze gate.
 *
 * ⚠ `behavioralPropertiesPassing` DEFAULTS TO ABSENT, NOT TO FALSE AND NOT TO TRUE. The
 * behavioral contract is graded by a different instrument entirely; a caller that has not
 * run it has not learned that it failed, and it has not learned that it passed either.
 * Omitting the key leaves `freezeBlockers` reporting "a behavioral-contract property did
 * not pass", which is the correct refusal — silence is not a claim.
 *
 * `fullInstrument` is derived and not asserted: the receipt must be the watchdog's own
 * kind, must not be a restored run, and must carry an EMPTY `notExecutable` ledger. A run
 * that could not execute an assertion measured less than the full instrument, and §206.2b's
 * third status exists precisely so that fact is legible instead of looking like a pass.
 *
 * ⛔⛔ AND THE LEDGER HAS TWO WRITERS NOW, WHICH IS THE WHOLE OF M1-F1's CURE. The soak
 * writes `receipt.notExecutable` for the assertions IT could not run. The tripwire registry
 * knows a second class the soak cannot: a DETERMINISTIC row keyed on a field no writer
 * ships. Before this fold, such a row answered `[]`, the ledger stayed empty, and the
 * receipt graded `fullInstrument: true` while two of its three capacity rows were
 * structurally blind — a receipt certifying the completeness of an instrument that had not
 * run. The evaluator's rows are APPENDED, each stamped `source: 'tripwire-registry'` so no
 * reader can mistake them for something the soak claimed, and `fullInstrument` reads both
 * halves. A blind row now costs the freeze exactly what a failed precondition costs it.
 *
 * @param {object} receipt a parsed soak receipt
 * @param {{profile?: string, rolling?: boolean, restored?: boolean,
 *          behavioralPropertiesPassing?: boolean|null}} [options]
 * @returns {{findings: Array<object>, observability: Array<object>,
 *            notExecutable: Array<object>, deterministicFirings: number, annotated: object}}
 */
export function evaluateReceipt(receipt, {
  profile = '',
  rolling = false,
  restored = false,
  behavioralPropertiesPassing = null,
} = {}) {
  const { findings, observability, notExecutable: rowsNotExecutable } = evaluateTripwires(receipt);
  const deterministicFirings = findings.length;
  const isRestored = restored === true || receipt?.kind === RESTORE_PROBE_KIND;
  const notExecutable = Array.isArray(receipt?.notExecutable) ? receipt.notExecutable : null;
  const folded = rowsNotExecutable.map((row) => ({
    name: `tripwire ${row.id}`,
    reason: row.reason,
    source: 'tripwire-registry',
  }));
  const fullInstrument = receipt?.kind === FULL_INSTRUMENT_KIND
    && !isRestored
    && Array.isArray(notExecutable)
    && notExecutable.length === 0
    && folded.length === 0;

  const annotated = {
    ...receipt,
    // ⚠ THE LEDGER IS EXTENDED, NEVER REPLACED, and it is the one key outside the
    // freezeBlockers set this function may touch — because it is not an annotation at all,
    // it is the same ledger the writer opened, continued by the only reader that can see
    // this class. A receipt that carried no ledger and has a blind row GAINS the key: the
    // alternative is a receipt that stays silent about the thing it most needs to say.
    ...(notExecutable === null && folded.length === 0
      ? {}
      : { notExecutable: [...(notExecutable || []), ...folded] }),
    // The six fields freezeBlockers reads, and no more (§4.1's finite-semantics clause:
    // "the `evaluateReceipt` annotation (the `freezeBlockers` key set, no more)").
    deterministicFirings,
    fullInstrument,
    // A rolling run measures a mid-build tip and a restored run computes no official
    // figure; either makes the reading PROVISIONAL by the same reasoning.
    provisional: rolling === true || isRestored,
    rolling: rolling === true,
    restored: isRestored,
    ...(behavioralPropertiesPassing === null ? {} : { behavioralPropertiesPassing: behavioralPropertiesPassing === true }),
    ...(profile ? { evaluatedProfile: String(profile) } : {}),
  };

  return { findings, observability, notExecutable: folded, deterministicFirings, annotated };
}

/**
 * The child-receipt paths a realm-scale aggregate names, resolved against the aggregate's
 * OWN directory — `caseReceipts` is written relative to the aggregate, so resolving them
 * against the process cwd would read the wrong files or none at all.
 *
 * @param {object} aggregate a parsed `realm_scale_evidence` document
 * @param {string} aggregateDir the directory the aggregate was read from
 * @returns {string[]}
 */
export function aggregateReceiptPaths(aggregate, aggregateDir) {
  const listed = Array.isArray(aggregate?.caseReceipts) ? aggregate.caseReceipts : [];
  return listed
    .filter((entry) => typeof entry === 'string' && entry.length > 0)
    .map((entry) => `${aggregateDir}/${entry}`);
}

/**
 * Fold many per-cell evaluations into one report. Deterministic findings are the verdict;
 * the observability array rides along as metadata and never gates anything (SK-2A) — it
 * carries host-observability firings AND, since §909 car 5, the DETERMINISTIC rows that ran
 * and could not conclude because the run was shorter than the horizon they grade, each
 * carrying `inconclusive: true`. Neither kind gates; a reader that needs to tell them apart
 * reads the flag rather than the row's class.
 *
 * @param {Array<{key: string, findings: Array<object>, observability: Array<object>}>} rows
 */
export function summarizeEvaluations(rows) {
  const findings = [];
  const observability = [];
  for (const row of rows) {
    for (const firing of row.findings) findings.push({ ...firing, cellKey: row.key });
    for (const firing of row.observability) observability.push({ ...firing, cellKey: row.key });
  }
  return {
    kind: 'soak_tripwire_evaluation',
    cells: rows.length,
    deterministicFirings: findings.length,
    findings,
    observability,
    // ⛔ THE CLEAN LINE IS A MEASUREMENT, NOT A DEFAULT. An empty roster over zero cells is
    // not a clean run — it is a run that evaluated nothing, and the two must not read alike.
    clean: rows.length > 0 && findings.length === 0,
  };
}
