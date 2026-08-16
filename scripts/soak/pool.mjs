/**
 * pool.mjs — THE SEED GRID, THE WORKER BAND, AND THE COMPARISON SURFACE (SK-1; ODQ §141.1).
 *
 * ⛔ THE POOL-INDEPENDENCE INVARIANT IS THE WHOLE POINT. A soak grid is embarrassingly
 * parallel only if the grid itself is a PURE FUNCTION OF THE CONFIG — never of N, of
 * core count, or of scheduling. The moment worker count reaches the grid, "the same
 * seed run in-pool and solo" stops being a well-formed claim, because the two runs are
 * no longer the same run. `grid()` therefore takes the config and nothing else, and its
 * pin runs it at N = 1, 3 and 8 and demands the identical ordered array.
 *
 * ⛔ AND THE COMPARISON SURFACE IS DEFINED HERE, NOT LEFT TO A READER. §141.1's
 * determinism-under-workers proof compares (a) the full per-year composite-hash
 * SEQUENCE — every year, not the end state, because a mid-run divergence that
 * reconverges by the horizon hides from a final-hash-only comparison — and (b) the
 * receipt MINUS a closed, enumerated volatile list.
 *
 * ⚠⚠ THE VOLATILE LIST IS SPELLED AS AN EXCLUSION, NEVER AS AN ALLOWLIST. A receipt
 * field added later is COMPARED until somebody deliberately excludes it. An allowlist
 * would silently stop watching every new field, which is the direction that fails open.
 *
 * PURE: no clock, no rng, no filesystem, no child processes. The runner does the I/O.
 */

/**
 * Host-observability fields, as dotted paths. Everything else on a receipt is
 * compared. Wall-clock and memory vary by host and by pool pressure BY NATURE; they
 * are recorded as observability metadata and never enter a pass/fail.
 *
 * ⚠ `__tickIndexStats` is NOT here, and must never be added: the engine's module-scope
 * cache counters are host-observability by nature (they differ warm-vs-cold across the
 * twelve module-scope caches an engine restart starts cold), they appear in NO receipt,
 * and naming them in a volatile list would invite somebody to put them ON one first.
 */
export const VOLATILE_RECEIPT_FIELDS = Object.freeze([
  'yearlyMs',
  'structuredCloneMs',
  'heapUsedBytes',
  'peakHeapUsedBytes',
  'runDurationsMs',
  'completedAt',
  'isolatedWorker.timingsMs',
  'isolatedWorker.runtime.workerThreadId',
  'isolatedWorker.runtime.parentThreadId',
  'isolatedWorker.runtime.transport',
]);

/**
 * ⭐ §141.1's own measurement is the derivation home, and it is quoted rather than
 * re-derived: "peak RSS per world measured under 800 MB", "~8-way on this machine".
 * The band is COMPUTED AT LAUNCH from the host, never frozen as a constant, which is
 * what makes it portable (§131) instead of machine-specific.
 */
export const PER_WORLD_RSS_BAND_BYTES = 800 * 1024 * 1024;

/**
 * @param {{freeMemBytes: number, cpus: number, perWorldRssBand?: number}} host
 * @returns {number} at least 1, at most `cpus - 1`, and never more worlds than memory
 */
export function workerCount({ freeMemBytes, cpus, perWorldRssBand = PER_WORLD_RSS_BAND_BYTES }) {
  const byMemory = Math.floor(Number(freeMemBytes) / Number(perWorldRssBand));
  const byCores = Math.max(1, Number(cpus) - 1);
  return Math.max(1, Math.min(byMemory, byCores));
}

/**
 * A stable, order-preserving key for one cell. The FULL cell identity, never the bare
 * seed: bare-seed keys smear finding density across configs (SK-6 depends on this).
 */
export function cellKey(cell) {
  return [
    cell.seed,
    cell.years,
    cell.settlements,
    cell.rowId,
  ].map((part) => String(part)).join('::');
}

/**
 * THE GRID — a pure function of the config. Enumeration order is the nested loop
 * order below and nothing else.
 *
 * @param {{seeds: string[], years: number, settlements: number,
 *          rows?: Array<{id: string, rules?: Record<string, unknown>}>}} config
 * @returns {Array<Record<string, unknown>>}
 */
export function grid(config) {
  const seeds = Array.isArray(config?.seeds) ? config.seeds : [];
  const rows = Array.isArray(config?.rows) && config.rows.length
    ? config.rows
    : [{ id: 'preset', rules: {} }];
  const years = Number(config?.years);
  const settlements = Number(config?.settlements);
  const cells = [];
  for (const seed of seeds) {
    for (const row of rows) {
      const cell = {
        seed: String(seed),
        years,
        settlements,
        rowId: String(row.id),
        rules: row.rules || {},
      };
      cells.push({ ...cell, key: cellKey(cell) });
    }
  }
  return cells;
}

/** Read a dotted path without `?.` chains, so the exclusion list stays declarative. */
function at(object, path) {
  let node = object;
  for (const segment of path.split('.')) {
    if (!node || typeof node !== 'object') return undefined;
    node = node[segment];
  }
  return node;
}

/**
 * Strip the volatile fields from a receipt COPY. Everything not named survives — the
 * fail-CLOSED direction.
 * @param {Record<string, unknown>} receipt
 */
export function comparisonSurface(receipt, volatileFields = VOLATILE_RECEIPT_FIELDS) {
  const copy = JSON.parse(JSON.stringify(receipt ?? {}));
  for (const path of volatileFields) {
    const segments = path.split('.');
    let node = copy;
    for (let i = 0; i < segments.length - 1 && node && typeof node === 'object'; i += 1) {
      node = node[segments[i]];
    }
    if (node && typeof node === 'object') delete node[segments[segments.length - 1]];
  }
  return copy;
}

/**
 * The determinism verdict for one seed run twice — in-pool and solo.
 * Returns the empty array when the two runs are the same run.
 * @returns {string[]}
 */
export function compareRuns(inPool, solo, volatileFields = VOLATILE_RECEIPT_FIELDS) {
  const findings = [];
  const left = Array.isArray(inPool?.yearlyHashes) ? inPool.yearlyHashes : [];
  const right = Array.isArray(solo?.yearlyHashes) ? solo.yearlyHashes : [];
  if (left.length === 0 || right.length === 0) {
    // A comparison over two empty sequences would PASS, which is the vacuity this
    // estate convicts everywhere else. It is a finding, not a pass.
    findings.push('yearly hash sequence is empty on one side — the comparison would be vacuous');
  }
  if (left.length !== right.length) {
    findings.push(`yearly hash sequence length ${left.length} vs ${right.length}`);
  }
  for (let year = 0; year < Math.min(left.length, right.length); year += 1) {
    if (left[year] !== right[year]) {
      findings.push(`composite hash diverged at year ${year + 1}`);
      break;
    }
  }
  const a = JSON.stringify(comparisonSurface(inPool, volatileFields));
  const b = JSON.stringify(comparisonSurface(solo, volatileFields));
  if (a !== b) {
    const keys = new Set([
      ...Object.keys(comparisonSurface(inPool, volatileFields)),
      ...Object.keys(comparisonSurface(solo, volatileFields)),
    ]);
    const moved = [...keys].filter((key) => JSON.stringify(at(comparisonSurface(inPool, volatileFields), key))
      !== JSON.stringify(at(comparisonSurface(solo, volatileFields), key)));
    findings.push(`receipt differs outside the volatile list: ${moved.join(', ') || '(nested)'}`);
  }
  return findings;
}
