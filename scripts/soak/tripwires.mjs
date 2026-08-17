/**
 * tripwires.mjs — THE CLOSED, TYPED TRIPWIRE REGISTRY (SK-2A; ODQ §141.2).
 *
 * ⛔⛔ THE TWO-CLASS SPLIT IS LOAD-BEARING FOR SK-1, NOT TIDINESS. Eight pooled workers
 * sharing memory bandwidth fire duration and memory tripwires that a solo run does not.
 * An unsplit registry therefore BREAKS the in-pool ≡ solo determinism proof by
 * construction — the harness would convict itself of non-determinism for being fast.
 *
 *   DETERMINISTIC       state-derived; fires identically in-pool and solo.
 *                       ONLY this class mints findings and capsules.
 *   HOST-OBSERVABILITY  wall-clock and RSS. Recorded as observability metadata,
 *                       EXCLUDED from every determinism comparison, never a finding by
 *                       itself. Cost findings ride the perf lane.
 *
 * ⛔ NEW CLASSES ARE ADDED BY REGISTRY ROW, NEVER BY INLINE CHECK. The recorded
 * hazard-registry lesson: a new class costs its row or the guard is invisible — and this
 * estate has already paid for learning it once.
 *
 * ⭐ EVERY THRESHOLD IS A BAND WITH A DERIVATION HOME (§42/§43, §131), and the two that
 * already exist in the tree are INHERITED VERBATIM rather than re-minted. A second
 * spelling of one envelope is the five-homes defect this estate refuses everywhere else.
 *
 * PURE, AND PROVABLY SO. No DETERMINISTIC row may read `Date.now`, `performance.now` or
 * `process.memoryUsage` — asserted by source-scanning each row's own detector function,
 * so the class boundary is machinery rather than a naming convention.
 */

export const TRIPWIRE_CLASSES = Object.freeze(['deterministic', 'host-observability']);

/**
 * ⭐ INHERITED VERBATIM from `scripts/audit/whole-world-soak.mjs:582` and its in-code
 * rationale at `:578-581`: "~900KB/settlement is a wide envelope over the measured
 * ~150KB/settlement at 6y (≈385KB/settlement extrapolated to 30y)". The soak asserts it
 * per run; the registry watches it per cell. ONE envelope, one spelling.
 */
export const YEARLY_BYTES_PER_SETTLEMENT_CEILING = 900_000;

/**
 * ⭐ ALSO INHERITED VERBATIM, from the same script's wall-time trend check
 * (`q4 <= q1 * 8 + 50`). It is machine-tolerant by design, which is exactly why it is
 * HOST-OBSERVABILITY here and not a finding.
 */
export const WALL_TIME_TREND_FACTOR = 8;
export const WALL_TIME_TREND_SLACK_MS = 50;

const finite = (value) => typeof value === 'number' && Number.isFinite(value);

/** Every non-finite number in the receipt, as dotted paths — the soak's own scan idiom. */
function nonFiniteFigures(node, path = '$', out = [], seen = new Set()) {
  if (out.length >= 5) return out;
  if (typeof node === 'number') {
    if (!Number.isFinite(node)) out.push(`${path} = ${node}`);
    return out;
  }
  if (!node || typeof node !== 'object' || seen.has(node)) return out;
  seen.add(node);
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i += 1) nonFiniteFigures(node[i], `${path}[${i}]`, out, seen);
    return out;
  }
  for (const key of Object.keys(node)) nonFiniteFigures(node[key], `${path}.${key}`, out, seen);
  return out;
}

const meanOf = (list, from, to) => {
  const slice = list.slice(Math.floor(list.length * from), Math.floor(list.length * to));
  return slice.reduce((sum, value) => sum + value, 0) / Math.max(1, slice.length);
};

/**
 * THE REGISTRY. Each row: a stable `id` (the census key — the banked-failure identity
 * law), its `class`, its band with a `home`, and a pure `detect(receipt)` returning the
 * firings it found.
 */
export const TRIPWIRES = Object.freeze([
  Object.freeze({
    id: 'throw_or_assert',
    class: 'deterministic',
    band: 'zero tolerance',
    home: 'the soak\'s own `failures` array — a failed assertion IS the finding',
    detect: (receipt) => (Array.isArray(receipt?.failures) ? receipt.failures : [])
      .map((name) => `assertion failed: ${name}`),
  }),
  Object.freeze({
    id: 'non_finite_ledger_figure',
    class: 'deterministic',
    band: 'zero tolerance',
    // ⛔⛔ THE MEASUREMENT MOVED TO THE WRITER, AND THAT IS THE WHOLE ROW (ODQ §213.3
    // member 3; RS-1 §7.4 measured the defect). `JSON.stringify` writes `null` for `NaN`
    // and for both infinities, so a row that only re-scanned a receipt READ BACK FROM DISK
    // could never fire on the class it names: its zero across 177 cells was a WEAK zero —
    // not "no figure was non-finite" but "nothing was asked". The soak now censuses the
    // receipt on the LIVE object, before serialization, and records the dotted paths as
    // STRINGS, which survive the round trip intact.
    home: 'whole-world-soak.mjs `findBadNumber`, taken at the WRITER on the live receipt and carried as `receipt.nonFiniteFigures`; the live re-scan is retained for the in-process caller',
    detect: (receipt) => {
      // The writer-side census: authoritative for any receipt parsed from disk, because it
      // is the only evidence that survives `JSON.stringify`.
      const recorded = Array.isArray(receipt?.nonFiniteFigures) ? receipt.nonFiniteFigures : [];
      // ⚠ AND THE LIVE SCAN IS KEPT, NOT REPLACED. A caller that hands this row an
      // IN-MEMORY receipt (a test, a future in-process evaluation) still holds native
      // `NaN`s, and that path is not vacuous at all. Dropping it would trade one blind
      // spot for another. A receipt written BEFORE the writer-side census has no recorded
      // half, and the missing `nonFiniteFigures` key is itself the statement that this
      // class went unmeasured for it; the row does not manufacture a finding out of that
      // absence, because doing so would convict every archived receipt in the estate of a
      // defect none of them can be shown to have.
      const live = nonFiniteFigures(receipt);
      return [...new Set([...recorded.map(String), ...live])]
        .slice(0, 5)
        .map((line) => `non-finite figure ${line}`);
    },
  }),
  Object.freeze({
    id: 'population_collapse',
    class: 'deterministic',
    band: 'zero tolerance, REMNANTS EXCEPTED',
    // ⚠ THE REMNANT LAW OR NOTHING. A properly-died settlement legitimately holds zero
    // (whole-world-soak.mjs:559, the 2026-07-31 law). Without the died-flag exception
    // this row reports every lawful death as a finding, and a registry that cries wolf
    // on the correct behaviour is worse than an absent one.
    home: 'whole-world-soak.mjs:559, the remnant law, honoured verbatim',
    detect: (receipt) => {
      const populations = Array.isArray(receipt?.finalPopulations) ? receipt.finalPopulations : [];
      const died = Array.isArray(receipt?.finalDiedFlags) ? receipt.finalDiedFlags : [];
      const out = [];
      for (let i = 0; i < populations.length; i += 1) {
        if (populations[i] === 0 && !died[i]) out.push(`settlement ${i} collapsed to zero with no lifecycleDiedAtTick`);
      }
      return out;
    },
  }),
  Object.freeze({
    id: 'negative_stock',
    class: 'deterministic',
    band: 'zero tolerance',
    home: 'a stock is a count; a negative count is a defect, not a band question',
    detect: (receipt) => {
      const out = [];
      for (const field of ['finalPopulations', 'startPopulations', 'stressorCounts', 'yearlyBytes']) {
        const list = Array.isArray(receipt?.[field]) ? receipt[field] : [];
        list.forEach((value, index) => {
          if (finite(value) && value < 0) out.push(`${field}[${index}] is negative (${value})`);
        });
      }
      return out;
    },
  }),
  Object.freeze({
    id: 'unbounded_growth',
    class: 'deterministic',
    band: `${YEARLY_BYTES_PER_SETTLEMENT_CEILING} bytes × settlements`,
    home: 'whole-world-soak.mjs:578-582, INHERITED verbatim — never a second spelling',
    detect: (receipt) => {
      const bytes = Array.isArray(receipt?.yearlyBytes) ? receipt.yearlyBytes.filter(finite) : [];
      const settlements = Number(receipt?.settlements) || 0;
      if (!bytes.length || !settlements) return [];
      const ceiling = YEARLY_BYTES_PER_SETTLEMENT_CEILING * settlements;
      const max = Math.max(...bytes);
      return max >= ceiling
        ? [`serialized state ${max} >= house envelope ${ceiling} (${settlements} settlements)`]
        : [];
    },
  }),
  Object.freeze({
    id: 'tick_duration_blowout',
    class: 'host-observability',
    band: `Q4 > Q1 × ${WALL_TIME_TREND_FACTOR} + ${WALL_TIME_TREND_SLACK_MS}ms`,
    home: 'whole-world-soak.mjs:590, INHERITED verbatim; machine-tolerant BY DESIGN',
    detect: (receipt) => {
      const ms = Array.isArray(receipt?.yearlyMs) ? receipt.yearlyMs.filter(finite) : [];
      if (ms.length < 4) return [];
      const q1 = meanOf(ms, 0, 0.25);
      const q4 = meanOf(ms, 0.75, 1);
      return q4 > q1 * WALL_TIME_TREND_FACTOR + WALL_TIME_TREND_SLACK_MS
        ? [`per-year wall time Q1 ${q1.toFixed(1)}ms → Q4 ${q4.toFixed(1)}ms`]
        : [];
    },
  }),
  Object.freeze({
    id: 'memory_watermark',
    class: 'host-observability',
    band: 'peak heap ≥ the per-world RSS band',
    home: '§141.1\'s own measurement: "peak RSS per world measured under 800 MB"',
    detect: (receipt) => {
      const peak = Number(receipt?.peakHeapUsedBytes);
      return finite(peak) && peak >= 800 * 1024 * 1024
        ? [`peak heap ${(peak / 1e6).toFixed(0)}MB reached the per-world band`]
        : [];
    },
  }),
]);

export const TRIPWIRE_IDS = Object.freeze(TRIPWIRES.map((row) => row.id));

/** Rows of one class, in registry order. */
export function tripwiresOfClass(klass) {
  return TRIPWIRES.filter((row) => row.class === klass);
}

/**
 * Evaluate every row against one receipt.
 *
 * ⛔ ONLY THE DETERMINISTIC CLASS MINTS FINDINGS. Host-observability rows land in
 * `observability`, are attached to reports as metadata, and never gate anything.
 */
export function evaluateTripwires(receipt) {
  const findings = [];
  const observability = [];
  for (const row of TRIPWIRES) {
    for (const detail of row.detect(receipt)) {
      const firing = { id: row.id, class: row.class, detail };
      if (row.class === 'deterministic') findings.push(firing);
      else observability.push(firing);
    }
  }
  return { findings, observability };
}

/**
 * The registry's own defect scan, exported so the pin and any future walker convict
 * identically rather than each re-deriving the rule.
 * @returns {string[]} empty means the registry is sound
 */
export function tripwireRegistryDefects(rows = TRIPWIRES) {
  const defects = [];
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.id)) defects.push(`${row.id}: duplicate registry id`);
    seen.add(row.id);
    if (!TRIPWIRE_CLASSES.includes(row.class)) defects.push(`${row.id}: class ${row.class} is outside the vocabulary`);
    if (!String(row.home || '').trim()) defects.push(`${row.id}: threshold has no derivation home`);
    if (!String(row.band || '').trim()) defects.push(`${row.id}: no band`);
    if (typeof row.detect !== 'function') defects.push(`${row.id}: no detector`);
    if (row.class === 'deterministic' && /Date\.now|performance\.now|memoryUsage/.test(String(row.detect))) {
      defects.push(`${row.id}: a DETERMINISTIC row reads a clock or the heap — it belongs in host-observability`);
    }
  }
  return defects;
}
