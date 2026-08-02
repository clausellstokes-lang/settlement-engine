/**
 * WR-9's additive v5 receipt section.
 *
 * This module owns the closed spellings used by the collector and the behavioral
 * oracle. It validates address totality only; share envelopes and the six-force
 * acceptance bands belong to the later WR-9 tuning wave. Keeping that boundary
 * explicit prevents a structurally complete but unobserved section from earning
 * a behavioral claim.
 */

/** @typedef {Record<string, unknown>} UnknownRecord */

/** The additive WR-9 observation carried by a v5 soak receipt. */
export const WAR_CONVERGENCE_OBSERVATION_VERSION = 1;

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
    terminationDecidingTermHistogram: zeroCountMap(
      WAR_TERMINATION_DECIDING_TERM_KEYS,
    ),
    flagCertificationRows: WAR_RULINGS_FLAG_KEYS.map((rule) => ({
      rule,
      ruleState: 'unknown',
      verdict: 'UNOBSERVED',
    })),
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
  validateHistogram(
    'terminationDecidingTermHistogram',
    WAR_TERMINATION_DECIDING_TERM_KEYS,
  );

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

  return { ok: errors.length === 0, errors, observation };
}

/** @param {ReadonlyArray<string>} keys @returns {Record<string, number>} */
const emptyTotals = (keys) => Object.fromEntries(keys.map((key) => [key, 0]));

/** @param {Record<string, number>} counts @returns {number} */
const sumCounts = (counts) => Object.values(counts)
  .reduce((total, count) => total + count, 0);

/**
 * Grade WR-9 instrumentation across the release corpus. Share envelopes and the
 * six force-specific acceptance bands land in WR-9 itself; this wall claims
 * instrumentation only, never tuning.
 *
 * @param {unknown[]} rawReceipts
 * @param {number} expectedEnvelopeSchemaVersion
 * @returns {Array<{
 *   id: string,
 *   label: string,
 *   passed: boolean,
 *   observed: unknown,
 *   threshold: unknown,
 * }>}
 */
export function evaluateWarConvergenceInstrumentation(
  rawReceipts,
  expectedEnvelopeSchemaVersion,
) {
  const receipts = Array.isArray(rawReceipts) ? rawReceipts.map(asRecord) : [];
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
  const decidingTermTotals = emptyTotals(WAR_TERMINATION_DECIDING_TERM_KEYS);
  /** @type {Record<string, { on: number, alive: number, silent: number, unobserved: number }>} */
  const flagTotals = Object.fromEntries(WAR_RULINGS_FLAG_KEYS.map((rule) => [
    rule,
    { on: 0, alive: 0, silent: 0, unobserved: 0 },
  ]));

  if (shapePassed) {
    for (const { validation } of parsed) {
      const observation = /** @type {UnknownRecord} */ (validation.observation);
      for (const key of WAR_ENDING_KEYS) {
        endingTotals[key] += Number(asRecord(observation.endingsMix)[key]);
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
        requiredDecidingTerms: WAR_TERMINATION_DECIDING_TERM_KEYS,
        requiredFlagRows: WAR_RULINGS_FLAG_KEYS,
      },
    },
    {
      id: 'war_convergence.non_vacuous',
      label: 'the endings mix and deciding-term histogram both contain measured war evidence',
      passed: shapePassed && endingsObserved > 0 && decidingTermsObserved > 0,
      observed: {
        endingsObserved,
        endingTotals,
        decidingTermsObserved,
        decidingTermTotals,
      },
      threshold: { minEndingsObserved: 1, minDecidingTermsObserved: 1 },
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
  ];
}
