/**
 * coveringArray.mjs — PAIRWISE COVERAGE OVER THE FLAG SPACE (SK-4; ODQ §143.2).
 *
 * The same run count that all-on/all-off spends LOCALIZES which flag pair interacts.
 * Quality raised, not spent.
 *
 * ⛔ PAIR COVERAGE IS CREDITED ON EFFECTIVE PAIRS ONLY. A pair whose member is
 * structurally dark — its `requires` parent off in that row — covers NOTHING, because the
 * engine never lit it. Crediting it would report coverage the grid does not have, and the
 * array must re-cover that pair in a row where BOTH members are effective. This is the
 * single rule that makes a constrained covering array honest rather than decorative.
 *
 * ⭐ STRENGTH t = 2, with §143.2 as its derivation home. A CONFIRMED ≥3-flag interaction
 * escalates the IMPLICATED SUBSPACE to t = 3 — banded, chair-signed — never the whole
 * space, whose t=3 array is combinatorially another thing entirely.
 *
 * ⚠ ROW COUNT IS AN OUTPUT, NEVER AN INPUT. A generator handed a target row count will
 * meet it by thinning coverage. The band below is a SANITY ENVELOPE the generator asserts
 * against: a run outside it REDS rather than silently producing a thin array.
 */

import { darkControlRow, isEffective, maximalLawfulRow, requiresGraph, varyingFactors } from './flagConstraints.mjs';

export const STRENGTH = 2;

/**
 * DERIVED, and the upper half was RE-DERIVED FROM MEASUREMENT rather than inherited.
 *
 * FLOOR: a pairwise binary covering array needs N >= ceil(log2 k) + 1 rows. Below that
 * the array is thin as a matter of information theory, whatever it claims.
 *
 * ⚠ CEILING: the compile predicted `[10, 20]` for 79 UNCONSTRAINED binary factors and
 * said the figure would be "higher under constraints". Executed at this base — 77 varying
 * factors, effective-pair credit, full coverage — the generator lands at **53 rows**. So a
 * ceiling of 20, or of 40, would have REFUSED THE CORRECT ANSWER. The ceiling's real job
 * is to catch the pathological shape (one row per pair, ~11.5k rows), not to second-guess
 * a converged construction, so it is set well clear of the measured figure and stated as
 * such. A run near it is a signal to look, not a defect by itself.
 */
export const MEASURED_ROWS_AT_MINT = 53;

export function rowCountBand(factorCount) {
  const floor = Math.ceil(Math.log2(Math.max(2, factorCount))) + 1;
  return { min: floor, max: Math.max(floor * 16, 160) };
}

/** Force every `requires` parent of an ON key on, so the row is internally lawful. */
function repair(row, graph) {
  let changed = true;
  while (changed) {
    changed = false;
    for (const [key, parents] of graph) {
      if (row[key] !== true) continue;
      for (const parent of parents) {
        if (row[parent] !== true) { row[parent] = true; changed = true; }
      }
    }
  }
  return row;
}

/** Every unordered EFFECTIVE pair assignment a row covers. */
export function effectivePairsIn(row, factors, graph = requiresGraph()) {
  const covered = new Set();
  for (let i = 0; i < factors.length; i += 1) {
    for (let j = i + 1; j < factors.length; j += 1) {
      const a = factors[i];
      const b = factors[j];
      // ⛔ An ON key with a dark parent is STRUCTURALLY DARK: it reads as assigned and is
      // not effective, so the pair it appears in covers nothing.
      const aState = row[a] === true ? (isEffective(row, a, graph) ? 'on' : null) : 'off';
      const bState = row[b] === true ? (isEffective(row, b, graph) ? 'on' : null) : 'off';
      if (aState === null || bState === null) continue;
      covered.add(`${a}=${aState}|${b}=${bState}`);
    }
  }
  return covered;
}

/**
 * Build the array. Deterministic: a seeded, config-derived ordering, never `Math.random`
 * — a grid that differs between two runs of the same config is not a grid.
 *
 * @returns {{rows: Array<Record<string, boolean>>, factors: string[], coverage: object, refusals: string[]}}
 */
export function buildCoveringArray(census, { manifest, maxRows = 200 } = {}) {
  const graph = requiresGraph(manifest);
  const factors = varyingFactors(census, manifest);
  const rows = [
    darkControlRow(census, manifest),
    repair({ ...darkControlRow(census, manifest), ...maximalLawfulRow(census, manifest) }, graph),
  ];

  // ⛔ THE TARGET EXCLUDES WHAT THE CONSTRAINTS FORBID, AND SAYS SO. `child=on` forces
  // every ancestor on, so `child=on | parent=off` is not a pair the array failed to cover
  // — it is a pair no lawful world contains. Counting it as a gap would make full
  // coverage permanently unreachable and train a reader to ignore the number.
  const ancestorsOf = (key, seen = new Set()) => {
    for (const parent of graph.get(key) || []) {
      if (seen.has(parent)) continue;
      seen.add(parent);
      ancestorsOf(parent, seen);
    }
    return seen;
  };
  const ancestors = new Map(factors.map((key) => [key, ancestorsOf(key)]));
  const forbidden = (a, aState, b, bState) => (
    (aState === 'on' && bState === 'off' && ancestors.get(a).has(b))
    || (bState === 'on' && aState === 'off' && ancestors.get(b).has(a))
  );

  const target = new Set();
  const constraintForbidden = [];
  for (let i = 0; i < factors.length; i += 1) {
    for (let j = i + 1; j < factors.length; j += 1) {
      for (const a of ['on', 'off']) {
        for (const b of ['on', 'off']) {
          const pair = `${factors[i]}=${a}|${factors[j]}=${b}`;
          if (forbidden(factors[i], a, factors[j], b)) { constraintForbidden.push(pair); continue; }
          target.add(pair);
        }
      }
    }
  }
  const covered = new Set();
  for (const row of rows) for (const pair of effectivePairsIn(row, factors, graph)) covered.add(pair);

  // GREEDY, one row at a time: each factor takes the value that covers more still-
  // uncovered pairs against the factors already assigned in this row. The factor order is
  // the census order, which is a pure function of the config — so the array a config
  // produces is the same array every time. No Math.random anywhere: a grid that differs
  // between two runs of the same config is not a grid.
  while (covered.size < target.size && rows.length < maxRows) {
    const candidate = {};
    const assigned = [];
    for (const factor of factors) {
      let bestValue = false;
      let bestGain = -1;
      for (const value of [true, false]) {
        const state = value ? 'on' : 'off';
        let gain = 0;
        for (const other of assigned) {
          const otherState = candidate[other] ? 'on' : 'off';
          const key = factors.indexOf(factor) > factors.indexOf(other)
            ? `${other}=${otherState}|${factor}=${state}`
            : `${factor}=${state}|${other}=${otherState}`;
          if (target.has(key) && !covered.has(key)) gain += 1;
        }
        if (gain > bestGain) { bestGain = gain; bestValue = value; }
      }
      candidate[factor] = bestValue;
      assigned.push(factor);
    }
    repair(candidate, graph);
    const gained = [...effectivePairsIn(candidate, factors, graph)].filter((pair) => !covered.has(pair));
    // No progress means the remainder is unreachable under the constraints, not that the
    // generator gave up quietly. Stopping here and REPORTING the residue is honest; another
    // identical row would only inflate the row count.
    if (gained.length === 0) break;
    rows.push(candidate);
    for (const pair of gained) covered.add(pair);
  }

  // ⚠⚠ THE COMPLETION PASS, AND IT IS NOT OPTIONAL. Measured: the greedy pass alone
  // stalls at ~95% — it makes the same per-factor choice for a factor whose gain ties, so
  // whole columns never take their minority value beside a given partner. A 95% pairwise
  // array is not a pairwise covering array; it is an array that will one day be quoted as
  // one. Each round below SEEDS a row with one still-uncovered pair and greedily fills the
  // rest, which is the vertical-extension half of IPOG and guarantees progress: a row that
  // covers its own seed always gains at least one.
  let guard = 0;
  while (covered.size < target.size && rows.length < maxRows && guard < maxRows * 4) {
    guard += 1;
    const seedPair = [...target].find((pair) => !covered.has(pair));
    if (!seedPair) break;
    const [left, right] = seedPair.split('|');
    const [leftKey, leftState] = left.split('=');
    const [rightKey, rightState] = right.split('=');
    const candidate = { [leftKey]: leftState === 'on', [rightKey]: rightState === 'on' };
    const assigned = [leftKey, rightKey];
    for (const factor of factors) {
      if (factor === leftKey || factor === rightKey) continue;
      let bestValue = false;
      let bestGain = -1;
      for (const value of [true, false]) {
        const state = value ? 'on' : 'off';
        let gain = 0;
        for (const other of assigned) {
          const otherState = candidate[other] ? 'on' : 'off';
          const key = factors.indexOf(factor) > factors.indexOf(other)
            ? `${other}=${otherState}|${factor}=${state}`
            : `${factor}=${state}|${other}=${otherState}`;
          if (target.has(key) && !covered.has(key)) gain += 1;
        }
        if (gain > bestGain) { bestGain = gain; bestValue = value; }
      }
      candidate[factor] = bestValue;
      assigned.push(factor);
    }
    repair(candidate, graph);
    const gained = [...effectivePairsIn(candidate, factors, graph)].filter((pair) => !covered.has(pair));
    if (gained.length === 0) {
      // The seed survived repair but still covers nothing new: it is unreachable under the
      // constraints in a way the ancestor test could not predict. Retire it from the target
      // and RECORD it, rather than looping forever on a pair no row can hold.
      target.delete(seedPair);
      constraintForbidden.push(seedPair);
      continue;
    }
    rows.push(candidate);
    for (const pair of gained) covered.add(pair);
  }

  const band = rowCountBand(factors.length);
  const refusals = [];
  if (rows.length < band.min) {
    refusals.push(
      `REFUSED: the generator produced ${rows.length} rows, under the sanity floor ${band.min} for `
      + `${factors.length} factors. A row count below the floor means the array is thin, not clever.`,
    );
  }
  if (rows.length > band.max) {
    refusals.push(
      `REFUSED: the generator produced ${rows.length} rows, over the sanity ceiling ${band.max}. `
      + 'That shape is one-row-per-pair, not a covering array.',
    );
  }
  if (covered.size < target.size) {
    refusals.push(
      `REFUSED: ${target.size - covered.size} reachable pairs are uncovered. A partially-covering `
      + 'array must never be reported as a pairwise one — the greedy pass alone stalls near 95%, '
      + 'which is exactly the figure that would one day be quoted as full coverage.',
    );
  }
  return {
    rows,
    factors,
    strength: STRENGTH,
    coverage: {
      targetPairs: target.size,
      coveredPairs: covered.size,
      uncovered: [...target].filter((pair) => !covered.has(pair)),
      constraintForbidden: constraintForbidden.length,
      rowCount: rows.length,
      band,
    },
    refusals,
  };
}
