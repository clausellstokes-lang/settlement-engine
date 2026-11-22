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

import {
  CAMPAIGN_HORIZON_YEARS,
  LIVENESS_FLOOR,
  MOTION_FLOOR_01,
  MOVING_SHARE_FLOOR,
  WALL_TIME_TREND,
  YEARLY_BYTES_PER_SETTLEMENT_CEILING as INVARIANT_YEARLY_BYTES_CEILING,
  foldDecades,
  livenessVerdict,
  nonFinitePaths,
} from '../audit/soakInvariants.mjs';

export const TRIPWIRE_CLASSES = Object.freeze(['deterministic', 'host-observability']);

/**
 * ⭐ INHERITED VERBATIM, and now by IMPORT rather than by a second literal. The rationale
 * is `scripts/audit/whole-world-soak.mjs`'s own: "~900KB/settlement is a wide envelope over
 * the measured ~150KB/settlement at 6y (≈385KB/settlement extrapolated to 30y)". The soak
 * asserts it per run; the registry watches it per cell. It is RE-EXPORTED under its
 * existing name because the registry pin imports it from HERE — one envelope, one spelling,
 * and the seam moves without moving any consumer (DESIGN_HORIZON §1.6).
 */
export const YEARLY_BYTES_PER_SETTLEMENT_CEILING = INVARIANT_YEARLY_BYTES_CEILING;

/**
 * ⭐ ALSO INHERITED, from the same script's wall-time trend check (`q4 <= q1 * 8 + 50`) and
 * now from the same one home. Machine-tolerant by design, which is exactly why it is
 * HOST-OBSERVABILITY here and not a finding.
 */
export const WALL_TIME_TREND_FACTOR = WALL_TIME_TREND.factor;
export const WALL_TIME_TREND_SLACK_MS = WALL_TIME_TREND.slackMs;

const finite = (value) => typeof value === 'number' && Number.isFinite(value);

/**
 * Is a receipt field present at all — a top-level name, or a dotted path into the envelope?
 *
 * ⛔⛔ THE THIRD STATUS EXISTS BECAUSE ABSENCE AND CLEANLINESS READ ALIKE OTHERWISE
 * (§206.2b, and M1-F1 measured the cost). A detector that hits its own
 * `Array.isArray(receipt?.x) ? … : []` guard on a field NO WRITER SHIPS reads a
 * zero-length series, takes its "did not observe" early return, and answers `[]` —
 * indistinguishable from a world that behaved. That is a WEAK ZERO of exactly the class
 * `non_finite_ledger_figure` above already paid for once, and the cure is the same one:
 * say what was not measured, positively, with the field on its face.
 *
 * `null` counts as absent: a receipt that wrote the key and nothing into it carried no
 * evidence either, and grading the two apart would be a distinction without a measurement.
 *
 * ⭐⭐ AND THE PATH MAY BE NESTED (§909 car 2). `capacity_realm_load` keys on
 * `behavioral.yearly[last].realmDemography{}` — an ADDITIVE key that
 * `behavioral-observation.mjs` ships CONDITIONALLY, through the conditional shorthand spread
 * of `realmDemography` in the yearly row it returns, so a v4 receipt, and any receipt whose
 * world ran the demographic term dark, simply lacks it. Its detector then hit
 * `if (!reading || typeof reading !== 'object') return []` and answered `[]` — the SAME weak
 * zero its two siblings paid for one level up, one level down. Grading only TOP-LEVEL fields
 * left exactly that hole, so the path is the unit now.
 *
 * ⛔⛔ AND "CARRIED" IS THE SHAPE THE ROW READS, NOT MERELY A KEY THAT EXISTS (§909 car 5).
 * The emptiness law was written into the `[last]` branch alone, so a BARE name was admitted
 * on `cursor[key] != null` and nothing else — and a lit receipt carrying
 * `yearlyPopulations: []` graded both series rows EXECUTABLE, let them take their own
 * `pops.length < 150` early return, and certified `fullInstrument` over two rows that could
 * not observe. That is this file's own weak zero, one floor further down, with the cure
 * comment sitting over it. Three statements now hold at EVERY segment:
 *
 *   `null`/`undefined`   absent — a receipt that wrote the key and nothing into it carried no
 *                        evidence, and grading the two apart is a distinction without a
 *                        measurement.
 *   an EMPTY ARRAY       absent, bare names included — a run that observed no years carried
 *                        no evidence about any of them.
 *   the DECLARED SHAPE   a segment may say what the row reads off it, and a value of another
 *                        shape is absent rather than a silent clean: `[last]` is a non-empty
 *                        ARRAY, walked to its final row (every capacity row reads the last
 *                        observed year and nothing else, so the path says so out loud rather
 *                        than letting a reader guess); `{}` is a non-array OBJECT with at
 *                        least one own key, which is what a row keyed on `reading.loadRatio01`
 *                        actually needs. `realmDemography = 42` and `realmDemography = {}`
 *                        are both readings the row cannot read, and both used to pass.
 *
 * ⚠ THE SHAPE IS DECLARED, NEVER INFERRED, and that is the whole reason it is grammar. A law
 * that simply refused every primitive terminal would make a future row keyed on a scalar
 * (`settlements`, whose own `Number(…) || 0` guard is the same weak zero) permanently
 * NOT-EXECUTABLE and indistinguishable from an honest instrument gap — a false report bought
 * to close a true one. A bare segment still means "present and not empty", and a row that
 * needs more says which.
 */
const REQUIRE_SEGMENT = /^([A-Za-z_$][\w$]*)(\[last\]|\{\})?$/;

/** The shape vocabulary a `requires` segment may declare. Closed, and convicted when wrong. */
const REQUIRE_SHAPES = Object.freeze(['[last]', '{}']);

/** Is this a well-formed `requires` path? A malformed one is a registry DEFECT, not a miss. */
const requirePathIsWellFormed = (path) => typeof path === 'string'
  && path.trim() === path
  && path.length > 0
  && path.split('.').every((segment) => REQUIRE_SEGMENT.test(segment));

const receiptCarries = (receipt, path) => {
  if (!requirePathIsWellFormed(path)) return false;
  let cursor = receipt;
  for (const segment of path.split('.')) {
    const [, key, shape] = REQUIRE_SEGMENT.exec(segment);
    if (cursor == null
      || typeof cursor !== 'object'
      || !Object.prototype.hasOwnProperty.call(cursor, key)
      || cursor[key] == null) return false;
    cursor = cursor[key];
    // THE EMPTINESS LAW, AT EVERY SEGMENT AND NOT ONLY UNDER `[last]` (§909 car 5).
    if (Array.isArray(cursor) && !cursor.length) return false;
    if (shape === '[last]') {
      if (!Array.isArray(cursor)) return false;
      cursor = cursor[cursor.length - 1];
      if (cursor == null) return false;
    } else if (shape === '{}') {
      if (typeof cursor !== 'object' || Array.isArray(cursor) || !Object.keys(cursor).length) return false;
    }
  }
  return true;
};

const meanOf = (list, from, to) => {
  const slice = list.slice(Math.floor(list.length * from), Math.floor(list.length * to));
  return slice.reduce((sum, value) => sum + value, 0) / Math.max(1, slice.length);
};

/**
 * ⚠ THE TWO CAPACITY HORIZONS, SPELLED ONCE EACH IN THIS FILE (§909 car 5). Each was written
 * twice — into the row's `band` prose and into its detector's early return — and the row now
 * declares the same figure to the evaluator as well, so a third spelling would have been the
 * five-homes defect arriving inside the guard that refuses it. NO VALUE MOVED: 150 and 100
 * are the figures the detectors already took their early returns at. The campaign horizon
 * the envelope row grades is NOT here: it has an importable home already
 * (`soakInvariants.mjs`'s `CAMPAIGN_HORIZON_YEARS`) and this file reads it from there.
 */
const PLATEAU_HORIZON_YEARS = 150;
const FLOOR_THAW_HORIZON_YEARS = 100;

/** How many observed years a receipt's top-level population series carries. */
const observedPopulationYears = (receipt) => (Array.isArray(receipt?.yearlyPopulations)
  ? receipt.yearlyPopulations.length
  : 0);

/**
 * THE REGISTRY. Each row: a stable `id` (the census key — the banked-failure identity
 * law), its `class`, its band with a `home`, and a pure `detect(receipt)` returning the
 * firings it found.
 *
 * Two OPTIONAL declarations carry §206.2b's third status, and they are DIFFERENT
 * statements that a single early return used to blur into one silence:
 *
 *   `gate(receipt)`   the row is NOT APPLICABLE to this receipt — a capacity row on a DARK
 *                     cell measured the right thing about a term that was not running. It
 *                     is silent by design and owes no ledger entry.
 *   `requires: []`    the receipt FIELD PATHS without which the row's silence is not a
 *                     MEASUREMENT. Absent ⇒ the row is NOT-EXECUTABLE and says so with the
 *                     path named; it does NOT answer `[]`. A path is a top-level name
 *                     (`yearlyPopulations[last]`) or a dotted walk into the envelope, each
 *                     segment optionally declaring the SHAPE the row reads off it — `[last]`
 *                     the last row of a non-empty series, `{}` an object with a reading in it
 *                     (`behavioral.yearly[last].realmDemography{}` — §909 car 2, because the
 *                     same weak zero lives one level down; §909 car 5 for the shape).
 *   `horizon: {}`     the run length below which this row OBSERVED NOTHING — `required` years
 *                     against what `observed(receipt)` counts. A row whose detector takes its
 *                     own "the run was too short" early return did RUN: it is neither a
 *                     finding nor NOT-EXECUTABLE, it is COMPLETE BUT INCONCLUSIVE, and it
 *                     says so in the `observability` channel rather than answering a silent
 *                     `[]` a reader would take for a plateau (§909 car 5).
 *
 * ⛔ THE GATE LIVES ON THE ROW, NOT INSIDE `detect`, AND THAT IS THE WHOLE REASON IT MOVED.
 * While the demographics gate was the detector's own first line, an ungated blindness and a
 * gated dark cell produced the identical `[]`, so no caller could tell "the term was off"
 * from "the field the row keys on does not exist". One spelling, on the row, where the
 * evaluator can read it.
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
      const live = nonFinitePaths(receipt);
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
    // (the `everyAlive` check in whole-world-soak.mjs, the 2026-07-31 law). Without the
    // died-flag exception
    // this row reports every lawful death as a finding, and a registry that cries wolf
    // on the correct behaviour is worse than an absent one.
    home: 'whole-world-soak.mjs\'s `everyAlive` check — the remnant law, honoured verbatim (cited by symbol at §909 car 5: the line number here was 313 lines stale)',
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
    home: 'whole-world-soak.mjs\'s `YEARLY_BYTES_PER_SETTLEMENT_CEILING * SETTLEMENTS` check, INHERITED verbatim — never a second spelling',
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
    id: 'liveness_floor',
    class: 'deterministic',
    band: `${LIVENESS_FLOOR.minDistinctTypesPerDecade} distinct typed events, `
      + `${LIVENESS_FLOOR.minHashMovesPerDecade} composite moves and `
      + `${LIVENESS_FLOOR.minEventsPerSettlementDecade} event per settlement, per FULL decade`,
    // ⛔⛔ THE ROW ALWAYS FOLDS LIVE, AND THAT IS THE WHOLE DESIGN (⟦A14 P9⟧). The fold is
    // pure and cheap, so there is no reason to trust a writer. Two computation paths for one
    // verdict would let the SAME world convict or pass depending on which soak version wrote
    // the receipt, and a writer-side `failures: []` would silence the fold completely — the
    // exact vacuity `non_finite_ledger_figure` above already paid for once. An ARCHIVED
    // receipt therefore still convicts, because the evidence the fold needs
    // (`behavioral.yearly[].eventTypeCounts` and `yearlyHashes`) survives serialization
    // intact. The writer-side `receipt.liveness` block is a CROSS-CHECK: when it disagrees
    // with the live fold the row names the schema version that wrote it.
    home: 'scripts/audit/soakInvariants.mjs LIVENESS_FLOOR — Car 0 measured the distinct-type floor as max(6, floor(0.5 x 20)) over 43 decades of five series whose leanest carried 20; the hash-move and event floors are the observed 10/10 and the definitional 1',
    detect: (receipt) => {
      const yearly = Array.isArray(receipt?.behavioral?.yearly) ? receipt.behavioral.yearly : [];
      const hashes = Array.isArray(receipt?.yearlyHashes) ? receipt.yearlyHashes : [];
      const settlements = Number(receipt?.settlements) || 0;
      if (!yearly.length || !hashes.length || !settlements) return [];
      const years = Number(receipt?.years) || Math.min(yearly.length, hashes.length);
      const verdict = livenessVerdict(
        foldDecades({
          yearlyEventTypeCounts: yearly.map((row) => row?.eventTypeCounts),
          yearlyHashes: hashes,
          yearlyMajorCounts: yearly.map((row) => row?.majorEventCount),
          settlements,
        }),
        { years, settlements },
      );
      // A run below one full decade did not measure liveness; §206.2b forbids reading that
      // silence as either a pass or a finding.
      if (!verdict.executable) return [];
      const out = verdict.failures.map((failure) => `${failure.kind}: ${failure.detail}`);
      const written = receipt?.liveness;
      if (written && typeof written === 'object' && Array.isArray(written.failures)) {
        const live = verdict.failures.map((failure) => `${failure.kind}@${failure.decade}`).join(',');
        const claimed = written.failures.map((failure) => `${failure?.kind}@${failure?.decade}`).join(',');
        if (live !== claimed) {
          out.push(
            `liveness_writer_disagrees: the receipt's own liveness block (receiptSchemaVersion `
            + `${receipt?.schemaVersion == null ? 'absent' : receipt.schemaVersion}) lists `
            + `[${claimed || 'none'}] where the live fold finds [${live || 'none'}]`,
          );
        }
      }
      return out;
    },
  }),
  // ═══════════════════════════════════════════════════════════════════════════
  // CAPACITY C3 — THE CAPACITY ROWS. Arm B of the engine wall: receipts only.
  // ═══════════════════════════════════════════════════════════════════════════
  // ⛔⛔ EVERY ROW BELOW IS NOT-EXECUTABLE ON A DARK CELL, AND THAT IS A RULING RATHER
  // THAN CAUTION (the integrator's §13 C8 rider). The demographic term ships DARK, so a
  // capacity row that ran anyway would convict every dark soak of failing to plateau a
  // model that was never running. Its CONSEQUENCE is recorded here rather than discovered
  // later: the DARK twin — the run that RE-CREATES the runaway — can never be convicted by
  // these rows. It is convicted by the EXISTING realm-population-bounded check and by
  // `unbounded_growth`, and the signing record must cite those rather than these.
  //
  // ⚠ THE GATE READS `subsystems.rules.demographicsEnabled`, CONFIRMED PRESENT: the soak
  // writes `rules: runA.simulationRules` into the `subsystems` block of `receiptBody`
  // (`whole-world-soak.mjs`), so this is a field that exists, not one hoped for. CITED BY
  // SYMBOL, because the line number this comment carried was already stale when it shipped
  // and staled twice more while nobody could see it.
  //
  // ⭐⭐ AND THE FOURTH DESIGNED ROW IS ARMED AT §909 CAR 3 — the design's own §2.5 C3
  // prediction, discharged. It shipped unarmed on TWO recorded grounds and only the second
  // was ever true.
  //
  // The FIRST was false when it was written (§907 car 3 re-measured it): it said
  // `behavioral.yearly[].motion` "does not exist… no `motion` block at all". IT EXISTS.
  // `scripts/audit/behavioral-observation.mjs` writes `motion: { populationTransitions,
  // populationMoved, prosperityTransitions, prosperityMoved, powerTransitions, powerMoved }`
  // on EVERY yearly row, and has since `37459391a` (2026-07-28) — five weeks before C3
  // landed (`d02c5acde`, 2026-09-03).
  //
  // The SECOND was true and is now discharged: the row's band is the envelope suite's own
  // STATE MOTION bar, and its one home was `tests/domain/demographicsEnvelope.test.js`, a
  // test file this directory must not import. Re-typing `0.05` here would have been a
  // SECOND SPELLING of one envelope — the five-homes defect this file's own header refuses.
  // §909 car 3 lifted `MOVING_SHARE_FLOOR` and `MOTION_FLOOR_01` into
  // `scripts/audit/soakInvariants.mjs` beside `LIVENESS_FLOOR`, and BOTH former homes now
  // import them, so the row below stands on the same bar the suite grades and the two
  // cannot drift apart. The motion floor stopped being spelled twice in the same act.
  //
  // ⭐ AND IT WAS NOT ARMED BLIND — the verdict was measured first, on real receipts, and
  // reproduces the C3 figures exactly. On the 300-year lit `research-lit-4s` receipt it is
  // SILENT: over the customer horizon the population term moved 110 of 120 settlement-year
  // transitions (share 0.9167); at year 30 exactly, 3 of 4 (0.75); across all 300 years,
  // 1079 of 1200 (0.8992), with NO year at zero and NO year below the bar. On a fresh lit
  // 30-year run it is SILENT at 110 of 120 (0.9167). That agrees in shape with the envelope
  // suite's own 170 of 180 (0.9444) on a different fixture.
  //
  // The property goes on being measured in the unconditional chain too, by
  // `tests/domain/demographicsEnvelope.test.js`'s STATE MOTION arm — one bar, two readings,
  // and now they are the same bar.
  Object.freeze({
    id: 'capacity_plateau',
    class: 'deterministic',
    band: `over >= ${PLATEAU_HORIZON_YEARS} observed years: |y_last - y_mid| / y_mid <= 0.05, and every century multiplier < 50`,
    home: 'tests/domain/demographicsCure.test.js:108-149 — the cure suite\'s own plateau clauses, INHERITED verbatim so the soak and the unit pin cannot disagree about what a plateau is',
    gate: (receipt) => receipt?.subsystems?.rules?.demographicsEnabled === true,
    // ⛔⛔ MEASURED BLIND, SAID SO, AND CURED AT §909 (M1-F1, CONFIRMED twice by independent
    // execution). `whole-world-soak.mjs` BUILT both series per run and shipped only the
    // FINAL row (`finalPopulations`, `finalDiedFlags`); until §909 no written receipt had
    // ever carried `yearlyPopulations`. On the 300-year research receipt this row therefore
    // answered `[]` while the same detector, fed the series rebuilt from
    // `behavioral.yearly[].stateVectors[id].population`, convicts all four settlements
    // (8319@149 → 10869@299; 202 → 1017; 324 → 244; 38 → 159). The unit pin was green
    // throughout because its fixture PLANTS the field — the estate's own "a fixture can be
    // the only writer of the SHAPE" hazard, live. §909 ships both series ADDITIVELY on v5
    // (no version integer moved), so a receipt written from that landing forward EXECUTES
    // this row.
    //
    // ⚠ `requires` STAYS, AND THAT IS THE POINT OF IT. Every receipt already on disk still
    // lacks both fields, and its silence must keep grading NOT-EXECUTABLE rather than
    // clean — a reading a freeze gate can act on and a silent `[]` is not. The `requires`
    // channel, not the schema integer, is what tells a pre-§909 receipt from a later one.
    //
    // ⚠ THE DIED FLAGS ARE REQUIRED TOO, AND NOT AS SYMMETRY. Without them the remnant law
    // has no exception list and this row would convict every lawful death — a series
    // shipped alone would be worse than no series at all.
    //
    // ⭐ AND THE SHAPE IS DECLARED (§909 car 5). `[last]` says what the detector reads —
    // `pops[last]`, the final observed year — so `yearlyPopulations: []` and a
    // `yearlyPopulations` that is not a series at all are ABSENT rather than admitted into
    // the early return below, which is where the weak zero had its last floor.
    requires: ['yearlyPopulations[last]', 'yearlyDiedFlags[last]'],
    // ⛔ AND A RUN TOO SHORT TO OBSERVE SAYS SO (§909 car 5). Below the horizon this row's
    // detector answers `[]` by its own guard — the correct verdict, and one no reader can
    // tell from a plateau it measured. The row is COMPLETE BUT INCONCLUSIVE, in
    // `observability`, with the two figures on its face.
    horizon: Object.freeze({ required: PLATEAU_HORIZON_YEARS, observed: observedPopulationYears }),
    detect: (receipt) => {
      const pops = Array.isArray(receipt?.yearlyPopulations) ? receipt.yearlyPopulations : [];
      // A run under the plateau horizon did not observe a plateau; reading that silence as
      // either a pass or a finding is the §206.2b error the liveness row already paid for,
      // and the row's `horizon` above is what stops it reading as either.
      if (pops.length < PLATEAU_HORIZON_YEARS) return [];
      const died = Array.isArray(receipt?.yearlyDiedFlags) ? receipt.yearlyDiedFlags : [];
      const last = pops.length - 1;
      const mid = Math.floor(last / 2);
      const out = [];
      const count = Array.isArray(pops[last]) ? pops[last].length : 0;
      for (let i = 0; i < count; i += 1) {
        // A settlement that DIED is not required to plateau; it has no head count to hold.
        if (died[last] && died[last][i]) continue;
        const yMid = Number(pops[mid]?.[i]);
        const yLast = Number(pops[last]?.[i]);
        if (!finite(yMid) || !finite(yLast) || yMid <= 0) continue;
        if (Math.abs(yLast - yMid) / yMid > 0.05) {
          out.push(`settlement ${i} never plateaued: ${yMid} at year ${mid} against ${yLast} at year ${last}`);
        }
        for (let y = 100; y <= last; y += 100) {
          const from = Number(pops[y - 100]?.[i]);
          const to = Number(pops[y]?.[i]);
          if (!finite(from) || !finite(to) || from <= 0) continue;
          if (to / from >= 50) {
            out.push(`settlement ${i} century multiplier ${(to / from).toFixed(1)} over years ${y - 100} to ${y}`);
          }
        }
      }
      return out;
    },
  }),
  Object.freeze({
    id: 'capacity_floor_thaw',
    class: 'deterministic',
    band: `no LIVING settlement holds one head count across its last ${FLOOR_THAW_HORIZON_YEARS} observed years`,
    home: 'tests/domain/demographicsFloor.test.js — the floored-six unfreeze. The pre-cure defect had TWO halves and the bounded check only ever saw one: a settlement frozen at 200 for a century is as broken as one at 2.9e13, and it fires nothing',
    gate: (receipt) => receipt?.subsystems?.rules?.demographicsEnabled === true,
    // The SAME blindness as its sibling above, found the same way and cured in the same
    // §909 landing: on the real 300-year receipt the row is correctly silent once the series
    // is rebuilt (nothing is frozen), but as shipped it could not have said otherwise about
    // any world. `requires` stays for the archived receipts, exactly as above.
    requires: ['yearlyPopulations[last]', 'yearlyDiedFlags[last]'],
    horizon: Object.freeze({ required: FLOOR_THAW_HORIZON_YEARS, observed: observedPopulationYears }),
    detect: (receipt) => {
      const pops = Array.isArray(receipt?.yearlyPopulations) ? receipt.yearlyPopulations : [];
      if (pops.length < FLOOR_THAW_HORIZON_YEARS) return [];
      const died = Array.isArray(receipt?.yearlyDiedFlags) ? receipt.yearlyDiedFlags : [];
      const last = pops.length - 1;
      const from = last - 100;
      const out = [];
      const count = Array.isArray(pops[last]) ? pops[last].length : 0;
      for (let i = 0; i < count; i += 1) {
        if (died[last] && died[last][i]) continue;
        const held = Number(pops[from]?.[i]);
        if (!finite(held)) continue;
        let frozen = true;
        for (let y = from + 1; y <= last && frozen; y += 1) {
          if (Number(pops[y]?.[i]) !== held) frozen = false;
        }
        if (frozen) out.push(`settlement ${i} held ${held} souls unchanged from year ${from} to year ${last}`);
      }
      return out;
    },
  }),
  Object.freeze({
    id: 'capacity_realm_load',
    class: 'deterministic',
    band: 'final realmDemography.loadRatio01 in [0.6, 1.05], and binding.granary + binding.walls === settlements',
    home: 'src/domain/worldPulse/demographicsObservation.js observeRealmDemography — the realm reading the engine already writes; the band is the cure suite\'s own plateau window (0.6 floor, 1.05 overshoot allowance) read at realm scale',
    gate: (receipt) => receipt?.subsystems?.rules?.demographicsEnabled === true,
    // ⚠ THE GAP WAS ONE LEVEL DOWN, AND §909 CAR 2 CLOSED IT. This row keys on `behavioral`,
    // which the writer DOES ship, so it was never unreachable the way its two siblings were
    // — but `requires` graded TOP-LEVEL fields only, and the field this row actually stands
    // on is `yearly[last].realmDemography`: an ADDITIVE key `behavioral-observation.mjs`
    // ships CONDITIONALLY, through the conditional shorthand spread of `realmDemography` in
    // its yearly row. On a receipt that lacks it the detector hit
    // `if (!reading …) return []` and answered a silent clean, which is the identical weak
    // zero one level down. The path is declared now, so that silence grades NOT-EXECUTABLE.
    //
    // ⭐ AND `{}` DECLARES WHAT THE DETECTOR READS OFF IT (§909 car 5): an object with a
    // reading in it. `realmDemography = 42` and `realmDemography = {}` both fall through the
    // `if (!reading || typeof reading !== 'object')` guard below — the first silently, the
    // second into a non-finite finding — so the row says which shape its silence depends on
    // rather than accepting any value that is merely not null.
    //
    // ⛔ AND THIS RE-GRADES ARCHIVED RECEIPTS, WHICH IS THE POINT AND IS DECLARED, NOT
    // SMUGGLED. Any receipt whose demographics gate is LIT but whose last observed year
    // carries no `realmDemography` moves from "clean" to "the row could not run" and its
    // `fullInstrument` goes false. A DARK receipt is untouched: `gate` is read BEFORE
    // `requires` (see `evaluateTripwires`), so a legitimately dark cell stays NOT APPLICABLE
    // and owes no ledger entry. The two measured cases both keep their grade — the 300-year
    // `research-lit-4s` receipt and a lit 30-year run each carry the key.
    requires: ['behavioral.yearly[last].realmDemography{}'],
    detect: (receipt) => {
      const yearly = Array.isArray(receipt?.behavioral?.yearly) ? receipt.behavioral.yearly : [];
      // The observation is an ADDITIVE key: a v4 receipt simply lacks it, and a consumer
      // must read that as an instrument gap rather than a finding.
      const reading = yearly.length ? yearly[yearly.length - 1]?.realmDemography : null;
      if (!reading || typeof reading !== 'object') return [];
      const out = [];
      const load = Number(reading.loadRatio01);
      if (!finite(load) || load < 0.6 || load > 1.05) {
        out.push(`realm load ${finite(load) ? load.toFixed(4) : 'non-finite'} outside the plateau window [0.6, 1.05]`);
      }
      const settlements = Number(receipt?.settlements) || 0;
      const granary = Number(reading.binding?.granary) || 0;
      const walls = Number(reading.binding?.walls) || 0;
      if (settlements && granary + walls !== settlements) {
        out.push(`binding census ${granary} granary + ${walls} walls does not account for ${settlements} settlements`);
      }
      return out;
    },
  }),
  Object.freeze({
    id: 'capacity_envelope_30y',
    class: 'deterministic',
    band: `over the first ${CAMPAIGN_HORIZON_YEARS} observed years: populationMoved / populationTransitions >= ${MOVING_SHARE_FLOOR}, a transition counted as moved at ${MOTION_FLOOR_01} of the head count`,
    home: 'tests/domain/demographicsEnvelope.test.js — the CAPACITY C3 envelope suite\'s own STATE MOTION arm. Both bars were lifted to scripts/audit/soakInvariants.mjs at §909 car 3 and BOTH homes import them, so this row and that arm cannot disagree about what motion is',
    // ⛔ GATED LIKE ITS THREE SIBLINGS, AND FOR THE SAME REASON RATHER THAN FOR SYMMETRY.
    // The bar's derivation home runs the DEMOGRAPHIC kernel, so it is a bar about that
    // model's visible motion. A dark world moves its head counts by a different term
    // (populationDynamics' raw proportional growth), and grading that world at this bar
    // would be a category error dressed as a wider net. Measured on the fresh 30-year DARK
    // receipt the share is 84 of 120 (0.70) — comfortably above the bar, so the gate costs
    // no finding today; it costs a claim this row is not entitled to make.
    gate: (receipt) => receipt?.subsystems?.rules?.demographicsEnabled === true,
    // The `motion` block is per-yearly-row and uniformly written by one observer, so its
    // presence on the LAST observed row is the honest witness that the series carries it at
    // all — a pre-`37459391a` receipt lacks it on every row, and that silence must grade
    // NOT-EXECUTABLE rather than clean.
    requires: ['behavioral.yearly[last].motion{}'],
    // ⛔ THE HORIZON IS DECLARED FOR THE SAME REASON ITS TWO SIBLINGS DECLARE THEIRS (§909
    // car 5). A 29-year run answers `[]` here on the guard below, and a 29-year run is a
    // legitimate useful-horizon run — so refusing it as NOT-EXECUTABLE would be false and
    // leaving it silent would be the weak zero. It is COMPLETE BUT INCONCLUSIVE.
    horizon: Object.freeze({
      required: CAMPAIGN_HORIZON_YEARS,
      observed: (receipt) => (Array.isArray(receipt?.behavioral?.yearly) ? receipt.behavioral.yearly.length : 0),
    }),
    detect: (receipt) => {
      const yearly = Array.isArray(receipt?.behavioral?.yearly) ? receipt.behavioral.yearly : [];
      // A run shorter than the customer horizon did not observe the window this row grades;
      // reading that silence as a pass or a finding is the §206.2b error twice paid for, and
      // the row's `horizon` above is what keeps it from reading as either.
      if (yearly.length < CAMPAIGN_HORIZON_YEARS) return [];
      let transitions = 0;
      let moved = 0;
      for (const year of yearly.slice(0, CAMPAIGN_HORIZON_YEARS)) {
        transitions += Number(year?.motion?.populationTransitions) || 0;
        moved += Number(year?.motion?.populationMoved) || 0;
      }
      // ⛔⛔ A ZERO DENOMINATOR IS A FINDING, NOT A SILENCE, AND THAT IS THE WHOLE LESSON OF
      // THIS LANE APPLIED TO ITS OWN NEW ROW. `moved / 0` would answer `[]` — the exact weak
      // zero §909 exists to close, and it would arrive here through the back door of an
      // arithmetic guard. The observer counts one transition per settlement per year that
      // has a previous-year record, so zero across the whole horizon means the instrument
      // reported nothing: measured 4 per year on both real receipts, 0 rows at zero in 300
      // years and in 30. It is unreachable on an honest run and named on a broken one.
      if (!transitions) {
        return [`the motion instrument reported ZERO settlement-year transitions over the first ${CAMPAIGN_HORIZON_YEARS} observed years — this row measured nothing`];
      }
      const share = moved / transitions;
      return share < MOVING_SHARE_FLOOR
        ? [`only ${moved} of ${transitions} settlement-year transitions moved the head count over the first ${CAMPAIGN_HORIZON_YEARS} years (share ${share.toFixed(4)}, floor ${MOVING_SHARE_FLOOR}). A population term still inside a campaign is a term no reader can see, whatever it does at three hundred years`]
        : [];
    },
  }),
  Object.freeze({
    id: 'tick_duration_blowout',
    class: 'host-observability',
    band: `Q4 > Q1 × ${WALL_TIME_TREND_FACTOR} + ${WALL_TIME_TREND_SLACK_MS}ms`,
    home: 'whole-world-soak.mjs\'s `wallTimeTrendVerdict` call, INHERITED verbatim; machine-tolerant BY DESIGN',
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
 *
 * ⛔⛔ AND THERE ARE THREE CHANNELS, NOT TWO (§206.2b, M1-F1). `notExecutable` carries the
 * rows that COULD NOT RUN — a row whose declared `requires` field is absent from the
 * receipt is listed there with the field named, and its detector is NOT called at all,
 * because calling it would produce the very `[]` that hid the defect. A row the receipt's
 * own state says does not apply (`gate`) is silent and lists nothing: not applicable and
 * not measurable are different facts, and this estate has already paid for reading them as
 * one.
 *
 * ⚠⚠ AND `observability` CARRIES TWO KINDS SINCE §909 CAR 5, WHICH IS WHY EVERY ENTRY SAYS
 * WHICH IT IS. The channel was keyed on the row's CLASS — host-observability firings and
 * nothing else. A DETERMINISTIC row that ran and could not conclude, because the run was
 * shorter than the horizon it grades, now rides the same channel with `inconclusive: true`
 * on it. The alternatives were both false: `notExecutable` would fail `fullInstrument` on
 * every legitimate 30-year receipt for a property the design does not give it, and silence
 * is the weak zero this landing exists to close. A reader must never take an `inconclusive`
 * entry for a host-observability note, so the flag is on the entry rather than in the
 * caller's head.
 *
 * @returns {{findings: Array<object>, observability: Array<object>,
 *            notExecutable: Array<{id: string, class: string, reason: string}>}}
 */
export function evaluateTripwires(receipt) {
  const findings = [];
  const observability = [];
  const notExecutable = [];
  for (const row of TRIPWIRES) {
    if (typeof row.gate === 'function' && !row.gate(receipt)) continue;
    const missing = (Array.isArray(row.requires) ? row.requires : [])
      .filter((field) => !receiptCarries(receipt, field));
    if (missing.length) {
      notExecutable.push({
        id: row.id,
        class: row.class,
        reason: `requires ${missing.map((field) => `receipt.${field}`).join(', ')} — absent from this receipt`,
      });
      continue;
    }
    // ⛔ THE HORIZON IS READ AFTER `requires` AND BEFORE THE VERDICT, AND THE ORDER IS THE
    // STATEMENT. A row that could not run has nothing to say about how long the run was, so
    // it must not also be reported inconclusive; a row that CAN run and grades a window the
    // run never reached did run, and its `[]` is not a measurement of the world.
    if (row.horizon && typeof row.horizon.observed === 'function') {
      const observed = Number(row.horizon.observed(receipt)) || 0;
      if (observed < row.horizon.required) {
        observability.push({
          id: row.id,
          class: row.class,
          inconclusive: true,
          detail: `horizon: ${observed} years observed, ${row.horizon.required} required`,
        });
      }
    }
    for (const detail of row.detect(receipt)) {
      const firing = { id: row.id, class: row.class, detail };
      if (row.class === 'deterministic') findings.push(firing);
      else observability.push(firing);
    }
  }
  return { findings, observability, notExecutable };
}

/**
 * ═══ THE REACHABILITY WALKER — THE CLASS, NOT THE INSTANCE ═══════════════════════════
 *
 * ⛔⛔ TWO ROWS SHIPPED BLIND AND A THIRD WAS REFUSED ON A MECHANISM THAT WAS ITSELF WRONG.
 * `capacity_envelope_30y` was REFUSED at C3 for keying on a field the writer "did not
 * write" — and the field was there all along (see the C3 block above). Its two siblings
 * shipped keyed on fields that genuinely are not written, and nothing caught them, because
 * the check was a person remembering rather than a machine. A guess about reachability was
 * wrong in BOTH directions in the same landing, which is the whole argument for measuring it.
 * These three functions are that check as machinery: what each row READS off the receipt,
 * read from the row's own source; what the writer WRITES, read from the writer's own source;
 * and the difference, which is the set of rows that can never fire on anything.
 *
 * ⛔ IT TEXT-READS, AND IT IMPORTS NO WRITER MODULE. `scripts/soak/**` is an ARM_B_ROOT of
 * the engine/telemetry wall (`./evaluate.mjs`'s header); importing `whole-world-soak.mjs`
 * from here would drag the engine across it. The caller hands over the writer's SOURCE.
 *
 * ⚠ AND IT READS COMMENTS TOO, DELIBERATELY. `String(fn)` carries a detector's comments, so
 * a `receipt.foo` written in prose inside a detector is counted as a read. That errs toward
 * checking MORE fields than the row truly touches and never fewer, which is the only
 * direction a guard may err in.
 */

/**
 * The top-level receipt fields ONE row reads, from its `detect`, `gate` and `horizon.observed`
 * source text.
 *
 * ⚠ THE HORIZON READER IS SCANNED TOO (§909 car 5), for the same reason the gate is: a row
 * may read a series to say how much of it there was, and a walker that graded only the
 * detector would clear a row on a field it also touches somewhere the walker never looked.
 *
 * @param {{detect?: Function, gate?: Function, horizon?: {observed?: Function}}} row
 * @returns {{fields: string[], unreadable: string|null}} `unreadable` names a row this
 *   walker refuses to grade rather than passing by default.
 */
export function tripwireFieldsRead(row) {
  const source = `${String(row?.detect || '')}\n${String(row?.gate || '')}\n${String(row?.horizon?.observed || '')}`;
  const fields = new Set();
  for (const match of source.matchAll(/receipt\s*\??\.\s*([A-Za-z_$][\w$]*)/g)) fields.add(match[1]);
  // THE ONE DOCUMENTED ACCESSOR IDIOM, and it is documented because `negative_stock` uses
  // it: `for (const field of ['a', 'b']) … receipt?.[field]`. A computed read whose key list
  // is NOT visible in the same source is reported UNREADABLE — a walker that silently
  // skipped it would grade a row it cannot see and call the registry sound.
  if (/receipt\s*\??\.\s*\[/.test(source)) {
    const literals = [...source.matchAll(/for\s*\(\s*const\s+[A-Za-z_$][\w$]*\s+of\s*\[([^\]]*)\]/g)]
      .flatMap((loop) => [...loop[1].matchAll(/['"]([A-Za-z_$][\w$]*)['"]/g)].map((entry) => entry[1]));
    if (!literals.length) {
      return {
        fields: [...fields],
        unreadable: 'a computed `receipt[…]` read whose key list is not a literal array in the same detector',
      };
    }
    for (const literal of literals) fields.add(literal);
  }
  return { fields: [...fields], unreadable: null };
}

/**
 * The keys of ONE object literal, from the character just past its opening brace to the
 * brace that closes it — a depth-1 scan, so a nested literal's keys are not counted as the
 * outer literal's own. Shared by both writer readers below (§909 car 2 inserted it BETWEEN
 * `receiptWriterFields` and the JSDoc that documented it, and §909 car 5 gave each function
 * back its own block: a comment describing the function under it is the cheapest true
 * statement in a file, and the cheapest false one).
 *
 * @param {string} source the module text
 * @param {number} afterOpener index of the first character inside the literal
 * @returns {Set<string>}
 */
function literalKeysFrom(source, afterOpener) {
  const fields = new Set();
  let depth = 1;
  for (const raw of source.slice(afterOpener).split('\n')) {
    const line = raw.replace(/\/\/.*$/, '');
    const trimmed = line.trim();
    if (depth === 1) {
      // `key:`, `...(FLAG ? { key: … } : {})`, and the bare `key,` shorthand — the third
      // matters because `failures` and `frozenTail` ship that way and `throw_or_assert`
      // keys on the first of them.
      const keyed = trimmed.match(/^(?:\.\.\.\([^)]*\?\s*\{\s*)?([A-Za-z_$][\w$]*)\s*:/);
      if (keyed) fields.add(keyed[1]);
      const shorthand = trimmed.match(/^([A-Za-z_$][\w$]*)\s*,\s*$/);
      if (shorthand) fields.add(shorthand[1]);
      // ⛔ AND THE CONDITIONAL SHORTHAND SPREAD, WHICH THIS SCANNER MISSED AND §909 CAR 2
      // MEASURED. `behavioral-observation.mjs` ships the key this walker was extended
      // to grade as `...(realmDemography ? { realmDemography } : {})` — a spread whose
      // payload is SHORTHAND, so the colon pattern above does not see it and the bare-key
      // pattern does not either. Without this line the walker reported the observer as not
      // writing `realmDemography` at all: a false unreachable on the one path the car
      // exists to ground, which is precisely how a guard earns being deleted.
      const spreadShorthand = trimmed.match(/^\.\.\.\([^)]*\?\s*\{\s*([A-Za-z_$][\w$]*)\s*\}/);
      if (spreadShorthand) fields.add(spreadShorthand[1]);
    }
    for (const character of line) {
      if (character === '{') depth += 1;
      else if (character === '}') depth -= 1;
    }
    if (depth <= 0) break;
  }
  return fields;
}

/**
 * The top-level keys the soak's receipt writer actually ships, read from its source.
 *
 * ⚠ BOTH OBJECT LITERALS ARE READ, and the second is not decoration: `nonFiniteFigures` is
 * added in `const receipt = { ...receiptBody, nonFiniteFigures }`, one statement after the
 * body closes. A walker that read only `receiptBody` would report
 * `non_finite_ledger_figure` as keyed on an unwritten field — a THIRD unreachable row that
 * is not unreachable at all, and the kind of false positive that gets a guard deleted.
 *
 * @param {string} writerSource the text of `scripts/audit/whole-world-soak.mjs`
 * @returns {string[]}
 */
export function receiptWriterFields(writerSource) {
  const source = String(writerSource || '');
  const fields = new Set();
  for (const opener of ['const receiptBody = {', 'const receipt = {']) {
    const start = source.indexOf(opener);
    if (start === -1) continue;
    for (const key of literalKeysFrom(source, start + opener.length)) fields.add(key);
  }
  return [...fields];
}

/**
 * The keys a NESTED writer ships — every object literal it `return`s, unioned (§909 car 2).
 *
 * ⛔⛔ AND ITS BOUND IS STATED HERE RATHER THAN LEFT TO BE DISCOVERED. This is a LEXICAL
 * key census, not a resolution: it proves that `realmDemography` is a key this module
 * SHIPS somewhere, and it does NOT prove that it nests under `yearly` under `behavioral`.
 * Following that chain means resolving `buildBehavioralObservation`'s call graph across two
 * modules from text, which this walker cannot do and must not pretend to. What it DOES
 * refuse is the defect class that actually bit twice in one landing — a row keyed on a
 * name NO writer writes at all — and the estate's rule for a guard's error direction is
 * satisfied in the reachable half: the FIRST segment is graded against the receipt writer's
 * own top-level key set, exactly as strictly as any other row's read.
 *
 * ⚠ WHERE IT IS WEAK IT IS WEAK TOWARD SILENCE, and that is why the runtime channel is not
 * built on it: `receiptCarries` walks the REAL receipt, segment by segment, and a path that
 * this walker admitted but the envelope does not actually carry still grades NOT-EXECUTABLE
 * at evaluation time, with the path on its face.
 *
 * @param {string} nestedSource the text of a module that builds a nested receipt section
 *   (`scripts/audit/behavioral-observation.mjs` is the only one today)
 * @returns {string[]}
 */
export function nestedWriterFields(nestedSource) {
  const source = String(nestedSource || '');
  const fields = new Set();
  const opener = 'return {';
  let at = source.indexOf(opener);
  while (at !== -1) {
    for (const key of literalKeysFrom(source, at + opener.length)) fields.add(key);
    at = source.indexOf(opener, at + opener.length);
  }
  return [...fields];
}

/**
 * Every row's read set graded against the writer's key set.
 *
 * ⭐ AND EVERY DECLARED `requires` PATH IS GRADED TOO (§909 car 2), not only the fields the
 * detector text happens to mention. The two are different statements: a read is what the
 * row TOUCHES, a require is what the row says its silence DEPENDS ON, and a require naming
 * a path no writer produces is a promise the registry cannot keep. The first segment is
 * graded against the receipt writer's top-level key set; the rest against `nestedSource`.
 *
 * ⛔ A NESTED PATH WITH NO NESTED SOURCE IS UNREADABLE, NEVER PASSED. A walker that graded
 * `behavioral` and shrugged at `yearly[last].realmDemography` would report a clean sheet
 * about the exact level where the remaining weak zero lived, which is how a guard earns
 * being deleted. Caller supplies the source or the walker refuses the row.
 *
 * ⛔⛔ AND THE TWO CHANNELS ARE INDEPENDENT, WHICH THEY WERE NOT (§909 car 5). A row whose
 * DETECTOR could not be read — a computed `receipt[…]` with no literal key list — used to
 * `continue` past the `requires` loop entirely, so a row with an unreadable detector and a
 * requirement naming a path NO writer produces landed in `unreadable` and NOWHERE ELSE,
 * while this header claimed every declared requirement was graded. The two statements are
 * different: a READ is what the row touches, a REQUIRE is what the row says its silence
 * depends on, and the second is knowable from the row's own declaration whatever the
 * detector's source looks like. Both are graded now, always.
 *
 * @param {Array<object>} rows
 * @param {string} writerSource
 * @param {string|null} [nestedSource] the text of the nested-section writer
 *   (`scripts/audit/behavioral-observation.mjs`); required once any row declares a dotted
 *   `requires` path
 * @returns {{written: string[], unreachable: Array<{id: string, field: string}>,
 *            unreachablePaths: Array<{id: string, path: string, segment: string}>,
 *            unreadable: Array<{id: string, reason: string}>}}
 */
export function tripwireFieldReach(rows, writerSource, nestedSource = null) {
  const written = new Set(receiptWriterFields(writerSource));
  const nested = nestedSource == null ? null : new Set(nestedWriterFields(nestedSource));
  const unreachable = [];
  const unreachablePaths = [];
  const unreadable = [];
  for (const row of rows) {
    const read = tripwireFieldsRead(row);
    if (read.unreadable) {
      // The READ channel refuses this row — its field set is partial by construction, so
      // grading it would clear reads the walker cannot see. The REQUIRE channel below is
      // unaffected: it reads the row's own declaration, not its detector's text.
      unreadable.push({ id: row.id, reason: read.unreadable });
    } else {
      for (const field of read.fields.sort()) {
        if (!written.has(field)) unreachable.push({ id: row.id, field });
      }
    }
    for (const path of (Array.isArray(row.requires) ? row.requires : [])) {
      if (!requirePathIsWellFormed(path)) {
        unreachablePaths.push({ id: row.id, path: String(path), segment: String(path) });
        continue;
      }
      const keys = path.split('.').map((segment) => REQUIRE_SEGMENT.exec(segment)[1]);
      if (!written.has(keys[0])) {
        unreachablePaths.push({ id: row.id, path, segment: keys[0] });
        continue;
      }
      if (keys.length === 1) continue;
      if (nested === null) {
        unreadable.push({
          id: row.id,
          reason: `a nested \`requires\` path (${path}) and no nested-writer source to ground it in`,
        });
        continue;
      }
      const missing = keys.slice(1).find((key) => !nested.has(key));
      if (missing) unreachablePaths.push({ id: row.id, path, segment: missing });
    }
  }
  return { written: [...written].sort(), unreachable, unreachablePaths, unreadable };
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
    if (row.gate !== undefined && typeof row.gate !== 'function') defects.push(`${row.id}: gate is declared and is not a function`);
    if (row.requires !== undefined && (!Array.isArray(row.requires) || !row.requires.length
      || row.requires.some((field) => typeof field !== 'string' || !field.trim()))) {
      defects.push(`${row.id}: requires is declared and is not a non-empty list of field names`);
    } else if (Array.isArray(row.requires)) {
      // ⭐ AND THE PATH SHAPE IS CONVICTED HERE (§909 car 2), because `receiptCarries`
      // answers FALSE for a malformed path — so a typo (`behavioral..yearly`,
      // `yearly[0]`, a stray space) would make the row permanently NOT-EXECUTABLE on
      // every receipt and read exactly like an honest instrument gap.
      for (const path of row.requires) {
        if (!requirePathIsWellFormed(path)) {
          defects.push(`${row.id}: requires path "${path}" is not a dotted field path (name, name${REQUIRE_SHAPES.join(' or name')})`);
        }
      }
    }
    // ⭐ AND A HORIZON IS CONVICTED THE SAME WAY (§909 car 5). A row that declares one and
    // gets the shape wrong would report nothing at all — a guard silently disarmed is the
    // class this registry exists to refuse, so a malformed `horizon` is named here.
    if (row.horizon !== undefined
      && (typeof row.horizon !== 'object' || row.horizon === null
        || typeof row.horizon.observed !== 'function'
        || !(typeof row.horizon.required === 'number' && Number.isFinite(row.horizon.required))
        || row.horizon.required <= 0)) {
      defects.push(`${row.id}: horizon is declared and is not { required: a positive number, observed: a function }`);
    }
    // The clock scan reads the GATE and the HORIZON READER as well as the detector: moving
    // a row's applicability test — or its run-length reading — onto the row must not open a
    // door the class boundary closed.
    if (row.class === 'deterministic'
      && /Date\.now|performance\.now|memoryUsage/.test(`${String(row.detect)}${String(row.gate || '')}${String(row.horizon?.observed || '')}`)) {
      defects.push(`${row.id}: a DETERMINISTIC row reads a clock or the heap — it belongs in host-observability`);
    }
  }
  return defects;
}
