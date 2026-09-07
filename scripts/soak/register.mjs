/**
 * register.mjs — THE SOAK REGISTER (SOAKCHAIN Car 4; DESIGN_HORIZON §1.6, §4.1).
 *
 * ⛔ THE GAP IT CLOSES. SK-5's bands read a `deterministicFirings` field nobody wrote and
 * no run was ever COMPARED against a previous one. The 300-year curve the tuning sitting
 * signs against — "the re-run must plateau, not explode slower" — had no home to be frozen
 * in, so "did it get worse?" was a question the estate could ask only by hand, from memory.
 * This is the home: typed figures, each with a DIRECTION, compared cell by cell.
 *
 * ⛔⛔ THE GROWTH DOOR IS GOVERNED, AND THAT IS THE WHOLE OF ⟦A22 E6⟧⟦CHAIR-R6⟧. The
 * design's own `SOAK_REGISTER_ALLOW_DEBT=<figure>` clause was listed in a CLI parenthesis
 * and defined NOWHERE. An env var plus a free-text note is the weakest of the estate's four
 * growth doors (beside TUNEREG's `DECLARED_GROWTH`, WRWALKER's `--rebank --charter` and
 * GOLDEN's signed record) and would have let a runaway be banked BY NOTE — the exact class
 * this register exists to refuse. So raising a `shrink` figure or lowering a `floor` figure
 * costs a `--charter=§NNN` AND a note of at least 60 characters, appends a `debtHistory`
 * row, and joins a shrink-only population the plain `--compare` prints as a HOLD line
 * forever after. SOAK-4's "accept the honest red" is the ONLY sanctioned use before the
 * sitting.
 *
 * ⚠ RE-MEASURE, DO NOT INHERIT. No LEDGER figure is ever typed into this register. The
 * first clean run IS the freeze act, and CI never writes the register — it writes a
 * PROPOSAL that the chair mints on a clean tree.
 */

export const REGISTER_VERSION = 1;

/**
 * The closed vocabulary of figure directions (finite semantics). Every cell figure declares
 * exactly one, and the comparison it gets follows from that word alone.
 *
 *   shrink   fails on `>`   — a count that may only fall
 *   floor    fails on `<`   — a minimum that may only rise
 *   band     fails on `|Δ| > band × committed` — a stochastic figure with a tolerance
 *   exact    fails on inequality — a categorical, e.g. a settlement's shape
 *   ceiling  fails on `>`   — a host-observability bound, evaluated ONLY by the solo job
 *   report   never fails    — carried for the reader, never a gate
 */
export const FIGURE_DIRECTIONS = Object.freeze(['shrink', 'floor', 'band', 'exact', 'ceiling', 'report']);

/**
 * A settlement's century-scale SHAPE. The register pins the shape `exact` because a place
 * that changes from plateauing to running away has changed in a way no numeric band can
 * express — "it bifurcates" is the sentence the tuning desk needs, not a percentage.
 */
export const SETTLEMENT_SHAPES = Object.freeze(['plateau', 'runaway', 'floored', 'died', 'other']);

/** The findings `compareRegister` can produce. One kind per direction it can violate. */
export const REGISTER_FINDING_KINDS = Object.freeze([
  'grew', 'fell_below_floor', 'outside_band', 'shape_changed', 'over_ceiling', 'missing',
]);

/** A century, in years — the window `runaway` and `plateau` are measured over. */
const CENTURY = 100;
/** Half a century, the window `floored` proves flatness over. */
const HALF_CENTURY = 50;
const RUNAWAY_MULTIPLE = 50;
const FLOORED_START_FRACTION = 0.2;
const FLOORED_FLATNESS = 0.02;
const PLATEAU_FLATNESS = 0.05;

const finite = (value) => (Number.isFinite(Number(value)) ? Number(value) : null);

/** `<profile>/<caseId>` — the register's cell key, spelled once. */
export function cellKeyOf({ profile, caseId }) {
  return `${String(profile || '')}/${String(caseId || '')}`;
}

/**
 * Classify one settlement's population series over the horizon.
 *
 * ⚠ THE WINDOWS ARE ABSOLUTE, NOT FRACTIONAL. "One century earlier" is 100 entries back,
 * because a 300-year run and a 100-year run must not mean different things by the same
 * word. A series shorter than a century cannot answer the question and is `other`.
 *
 * @param {number[]} series population at each year, in year order
 * @param {{died?: boolean}} [flags]
 * @returns {'plateau'|'runaway'|'floored'|'died'|'other'}
 */
export function settlementShapeOf(series, { died = false } = {}) {
  const values = (Array.isArray(series) ? series : []).map(finite).filter((value) => value !== null);
  if (!values.length) return 'other';
  const final = values[values.length - 1];
  if (final === 0 && died) return 'died';
  if (values.length <= CENTURY) return 'other';
  const start = values[0];
  const centuryAgo = values[values.length - 1 - CENTURY];
  const halfCenturyAgo = values[values.length - 1 - HALF_CENTURY];
  if (centuryAgo > 0 && final > centuryAgo * RUNAWAY_MULTIPLE) return 'runaway';
  const flooredLow = start > 0 && final <= start * FLOORED_START_FRACTION;
  const flooredFlat = halfCenturyAgo !== undefined
    && Math.abs(final - halfCenturyAgo) <= Math.abs(final || 1) * FLOORED_FLATNESS;
  if (flooredLow && flooredFlat) return 'floored';
  const plateaued = Math.abs(final - centuryAgo) <= Math.abs(final || 1) * PLATEAU_FLATNESS;
  if (plateaued) return 'plateau';
  return 'other';
}

/**
 * Derive every register figure from ONE annotated receipt (the output of
 * `./evaluate.mjs`'s `evaluateReceipt`, whose annotation states whether the run may be
 * frozen at all).
 *
 * ⛔ IT DERIVES, IT DOES NOT ACCEPT. Nothing here reads a figure a human typed; every
 * number comes from the receipt's own series. "Re-measure, do not inherit."
 *
 * @param {object} annotatedReceipt
 * @returns {{figures: Record<string, {value: unknown, direction: string, band?: number, ceiling?: number}>,
 *            identity: object, shapes: Record<string, string>}}
 */
export function deriveRegisterFigures(annotatedReceipt) {
  const receipt = annotatedReceipt || {};
  const ids = Array.isArray(receipt?.behavioral?.settlementIds)
    ? receipt.behavioral.settlementIds.map(String)
    : [];
  const yearly = Array.isArray(receipt?.behavioral?.yearly) ? receipt.behavioral.yearly : [];
  // Per-settlement series, read from the state vectors the behavioural fold already carries.
  const seriesById = {};
  for (const id of ids) seriesById[id] = [];
  for (const year of yearly) {
    const vectors = year?.stateVectors || {};
    for (const id of ids) {
      const population = finite(vectors?.[id]?.population);
      if (population !== null) seriesById[id].push(population);
    }
  }
  const diedById = {};
  const finalDied = Array.isArray(receipt?.finalDiedFlags) ? receipt.finalDiedFlags : [];
  ids.forEach((id, index) => { diedById[id] = Boolean(finalDied[index]); });

  const shapes = {};
  for (const id of ids) shapes[id] = settlementShapeOf(seriesById[id], { died: diedById[id] });
  const shapeCount = (kind) => Object.values(shapes).filter((shape) => shape === kind).length;

  const startTotal = (Array.isArray(receipt?.startPopulations) ? receipt.startPopulations : [])
    .reduce((sum, value) => sum + (finite(value) || 0), 0);
  const finalTotal = (Array.isArray(receipt?.finalPopulations) ? receipt.finalPopulations : [])
    .reduce((sum, value) => sum + (finite(value) || 0), 0);
  const finalPopulations = Array.isArray(receipt?.finalPopulations) ? receipt.finalPopulations : [];
  const unlawfulZeroCount = finalPopulations
    .filter((value, index) => finite(value) === 0 && !finalDied[index]).length;
  const realmBytes = (Array.isArray(receipt?.yearlyRealmBytes) ? receipt.yearlyRealmBytes : [])
    .map(finite).filter((value) => value !== null);
  const liveness = receipt?.liveness || {};
  const reported = liveness?.reported || {};
  const failuresOfKind = (kind) => (Array.isArray(liveness?.failures) ? liveness.failures : [])
    .filter((failure) => failure?.kind === kind).length;

  const figures = {
    'realm.runawayCount': { value: shapeCount('runaway'), direction: 'shrink' },
    'realm.flooredCount': { value: shapeCount('floored'), direction: 'shrink' },
    'realm.unlawfulZeroCount': { value: unlawfulZeroCount, direction: 'shrink' },
    // "It bifurcates" — a realm that both runs away and floors at once is the single
    // sentence the tuning desk most needs, so it is its own shrink-only figure.
    'realm.bifurcated': { value: (shapeCount('runaway') >= 1 && shapeCount('floored') >= 1) ? 1 : 0, direction: 'shrink' },
    'realm.ratio': { value: startTotal > 0 ? finalTotal / startTotal : 0, direction: 'band', band: 0.25 },
    'liveness.minDistinctTypesPerDecade': { value: finite(reported.minDistinctTypesPerDecade) ?? 0, direction: 'floor' },
    'liveness.minEventsPerSettlementDecade': { value: finite(reported.minEventsPerSettlementDecade) ?? 0, direction: 'floor' },
    'liveness.minHashMovesPerDecade': { value: finite(reported.minHashMovesPerDecade) ?? 0, direction: 'floor' },
    'liveness.silentDecades': { value: failuresOfKind('silent'), direction: 'shrink' },
    'liveness.frozenDecades': { value: failuresOfKind('frozen'), direction: 'shrink' },
    'bytes.maxRealmBytes': { value: realmBytes.length ? Math.max(...realmBytes) : 0, direction: 'band', band: 0.10 },
    // ⚠ HOST-OBSERVABILITY, and it is a CEILING rather than a band for that reason: it is
    // evaluated ONLY by the solo job step and NEVER by the pool (SK-2A), because eight
    // pooled workers sharing memory bandwidth would convict a cell for being fast company.
    'cost.peakHeapUsedBytes': { value: finite(receipt?.peakHeapUsedBytes) ?? 0, direction: 'ceiling', ceiling: 838_860_800 },
    'cost.primaryMs': { value: finite(receipt?.runDurationsMs?.primary) ?? 0, direction: 'report' },
  };
  for (const id of ids) {
    figures[`population.${id}.shape`] = { value: shapes[id], direction: 'exact' };
    const series = seriesById[id];
    figures[`population.${id}.final`] = { value: series.length ? series[series.length - 1] : 0, direction: 'band', band: 0.10 };
  }
  // A byte reading at a few named years, so a mid-run blowout that recovers by the horizon
  // is visible. The years are chosen from the run's OWN length, never hardcoded.
  for (const year of [100, 200, 300]) {
    if (realmBytes.length >= year) {
      figures[`bytes.realmBytesAtYear.${year}`] = { value: realmBytes[year - 1], direction: 'band', band: 0.10 };
    }
  }

  return {
    figures,
    shapes,
    identity: {
      seed: String(receipt?.seed || ''),
      years: finite(receipt?.years) ?? 0,
      settlements: finite(receipt?.settlements) ?? 0,
      // ⭐ THE LIGHTING IS MANDATORY ON THE IDENTITY (§4.7 R10). Without it a lit-overlay
      // figure could masquerade as a shipped-preset one, and the whole register would be
      // evidence about a world nobody can name.
      lighting: receipt?.subsystems?.rules?.demographicsEnabled === true
        ? { demographicsEnabled: true }
        : { demographicsEnabled: false },
      receiptSchemaVersion: finite(receipt?.schemaVersion) ?? 0,
      settlementIds: ids,
    },
  };
}

/** Does a measured value violate its committed figure's direction? */
function violationOf(committed, measured) {
  const direction = String(committed?.direction || '');
  const before = committed?.value;
  const after = measured?.value;
  if (direction === 'report') return null;
  if (direction === 'exact') {
    return before === after ? null : { kind: 'shape_changed', detail: `${JSON.stringify(before)} → ${JSON.stringify(after)}` };
  }
  const from = finite(before);
  const to = finite(after);
  if (from === null || to === null) {
    return { kind: 'missing', detail: `a ${direction} figure needs two numbers; committed ${JSON.stringify(before)}, measured ${JSON.stringify(after)}` };
  }
  if (direction === 'shrink' && to > from) return { kind: 'grew', detail: `${from} → ${to} (shrink-only)` };
  if (direction === 'floor' && to < from) return { kind: 'fell_below_floor', detail: `${from} → ${to} (floor)` };
  if (direction === 'ceiling') {
    const ceiling = finite(committed?.ceiling) ?? from;
    return to > ceiling ? { kind: 'over_ceiling', detail: `${to} over the ceiling ${ceiling}` } : null;
  }
  if (direction === 'band') {
    const band = finite(committed?.band) ?? 0;
    const tolerance = Math.abs(from) * band;
    return Math.abs(to - from) > tolerance
      ? { kind: 'outside_band', detail: `${from} → ${to} (|Δ| ${Math.abs(to - from).toFixed(4)} > ${band} × committed = ${tolerance.toFixed(4)})` }
      : null;
  }
  return null;
}

/**
 * Compare a committed cell against a measured one.
 *
 * ⚠ `ceiling` FIGURES ARE EVALUATED ONLY WHEN THE CALLER SAYS THE RUN WAS SOLO (SK-2A). A
 * pooled run's peak heap is a statement about its NEIGHBOURS, and grading it would break
 * the in-pool ≡ solo determinism proof by construction.
 *
 * @param {object} committed the register's cell (`{ figures: {...} }`)
 * @param {object} measured `deriveRegisterFigures`'s output
 * @param {{solo?: boolean}} [options]
 * @returns {Array<{figure: string, kind: string, direction: string, committed: unknown, measured: unknown, detail: string}>}
 */
export function compareRegister(committed, measured, { solo = false } = {}) {
  const committedFigures = committed?.figures || {};
  const measuredFigures = measured?.figures || {};
  const findings = [];
  for (const figure of Object.keys(committedFigures)) {
    const row = committedFigures[figure];
    if (row?.direction === 'ceiling' && !solo) continue;
    if (!Object.prototype.hasOwnProperty.call(measuredFigures, figure)) {
      findings.push({
        figure,
        kind: 'missing',
        direction: String(row?.direction || ''),
        committed: row?.value,
        measured: undefined,
        detail: `the run produced no ${figure}; a figure that stops being measured is not a figure that improved`,
      });
      continue;
    }
    const violation = violationOf(row, measuredFigures[figure]);
    if (violation) {
      findings.push({
        figure,
        kind: violation.kind,
        direction: String(row?.direction || ''),
        committed: row?.value,
        measured: measuredFigures[figure]?.value,
        detail: `${figure} ${violation.detail}`,
      });
    }
  }
  return findings;
}

/**
 * Which figures a refreeze would move UPWARD against a shrink, or DOWNWARD against a floor —
 * the debt set the governed door exists to price. Empty means the write is an ordinary
 * re-measurement and needs no charter.
 */
export function debtFiguresOf(committed, measured) {
  return compareRegister(committed, measured, { solo: true })
    .filter((finding) => finding.kind === 'grew' || finding.kind === 'fell_below_floor')
    .map((finding) => finding.figure);
}

/**
 * Apply a refreeze to one cell, PURELY. Returns the next register; the caller writes it.
 *
 * Every upward `shrink` move and downward `floor` move appends a `debtHistory` row, so the
 * set of figures ever banked in the wrong direction is itself a shrink-only population — the
 * plain `--compare` prints it as a standing HOLD line and a later reader can see, without
 * archaeology, exactly which numbers were allowed to get worse and under whose charter.
 *
 * @param {object} register the parsed register
 * @param {{key: string, measured: object, frozenAtSha: string, measuredBy: string,
 *          date: string, note: string, charter?: string, debtFigures?: string[]}} input
 */
export function applyRefreeze(register, {
  key, measured, frozenAtSha, measuredBy, date, note, charter = '', debtFigures = [],
}) {
  const cells = { ...(register?.cells || {}) };
  const previous = cells[key] || {};
  const debtHistory = Array.isArray(previous.debtHistory) ? [...previous.debtHistory] : [];
  for (const figure of debtFigures) {
    debtHistory.push({
      figure,
      from: previous?.figures?.[figure]?.value,
      to: measured?.figures?.[figure]?.value,
      charter: String(charter),
      seat: String(measuredBy),
      date: String(date),
    });
  }
  cells[key] = {
    frozenAtSha: String(frozenAtSha),
    measuredBy: String(measuredBy),
    date: String(date),
    note: String(note),
    identity: measured.identity,
    figures: measured.figures,
    ...(debtHistory.length ? { debtHistory } : {}),
  };
  return { ...register, registerVersion: REGISTER_VERSION, cells };
}

/** Is a cell frozen, or is it the genesis scaffold waiting for its first clean run? */
export function cellIsFrozen(cell) {
  return Boolean(cell && cell.frozenAtSha && Object.keys(cell.figures || {}).length > 0);
}

/**
 * Why a receipt may not mint a cell. Empty means it may.
 *
 * ⛔ §13 C7: a cell designed to FAIL `population_bounded` cannot mint. The DARK twin — the
 * 300y×12s run under `--lighting demographicsEnabled=false` that re-creates the runaway on
 * purpose — is CAPACITY's negative control and is cited in the shift record's evidence, NOT
 * frozen here.
 */
export function mintRefusals(annotatedReceipt) {
  const receipt = annotatedReceipt || {};
  const refusals = [];
  if (receipt.passed !== true) refusals.push('the run did not pass — a register cell is minted from a clean run or not at all');
  if ((receipt.deterministicFirings ?? 1) !== 0) refusals.push('a deterministic-class tripwire fired — the run is not clean');
  if (receipt.rolling === true) refusals.push('a rolling run is additive and never freezes');
  if (receipt.restored === true) refusals.push('a restored run computes no official figure');
  if (receipt.fullInstrument !== true) refusals.push('not the FULL instrument at build-complete-dark');
  // ⛔⛔ A BLIND ROW IS NAMED, NOT SUMMARISED (M1-F1). `fullInstrument` already closes the
  // door on this receipt, but "not the FULL instrument" is the same sentence a three-year
  // run gets, and the two are not the same problem: one measured less than everything, the
  // other could not measure a DETERMINISTIC row at all because the field it keys on is on no
  // receipt the writer produces. A cell frozen from such a run would bank a curve certified
  // by an instrument that never ran, so the refusal says which row went dark.
  const blind = (Array.isArray(receipt.notExecutable) ? receipt.notExecutable : [])
    .filter((row) => row && row.source === 'tripwire-registry');
  if (blind.length) {
    refusals.push(
      `${blind.length} deterministic tripwire row(s) could not run — `
      + `${blind.map((row) => `${row.name} (${row.reason})`).join('; ')}`,
    );
  }
  return refusals;
}
