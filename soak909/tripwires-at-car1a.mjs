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
  LIVENESS_FLOOR,
  WALL_TIME_TREND,
  YEARLY_BYTES_PER_SETTLEMENT_CEILING as INVARIANT_YEARLY_BYTES_CEILING,
  foldDecades,
  livenessVerdict,
  nonFinitePaths,
} from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneB6/scripts/audit/soakInvariants.mjs';

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
 * Is a TOP-LEVEL receipt field present at all?
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
 */
const receiptCarries = (receipt, field) => receipt != null
  && typeof receipt === 'object'
  && Object.prototype.hasOwnProperty.call(receipt, field)
  && receipt[field] != null;

const meanOf = (list, from, to) => {
  const slice = list.slice(Math.floor(list.length * from), Math.floor(list.length * to));
  return slice.reduce((sum, value) => sum + value, 0) / Math.max(1, slice.length);
};

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
 *   `requires: []`    the top-level receipt fields WITHOUT WHICH THE ROW'S SILENCE IS NOT A
 *                     MEASUREMENT. Absent ⇒ the row is NOT-EXECUTABLE and says so with the
 *                     field named; it does NOT answer `[]`.
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
  // writes `rules: runA.simulationRules` into its subsystem block
  // (`whole-world-soak.mjs:1050-1052`), so this is a field that exists, not one hoped for.
  //
  // ⛔ AND THE FOURTH DESIGNED ROW IS STILL NOT HERE — BUT NOT FOR THE REASON THIS COMMENT
  // USED TO GIVE, WHICH WAS FALSE WHEN IT WAS WRITTEN (§907 car 3, re-measured).
  //
  // It said `behavioral.yearly[].motion` "does not exist… no `motion` block at all". IT
  // EXISTS. `scripts/audit/behavioral-observation.mjs:1016-1023` writes
  // `motion: { populationTransitions, populationMoved, prosperityTransitions,
  // prosperityMoved, powerTransitions, powerMoved }` on EVERY yearly row, and has since
  // `37459391a` (2026-07-28) — five weeks before C3 landed (`d02c5acde`, 2026-09-03). The
  // real 300-year receipt carries it: `behavioral.yearly[29].motion` is
  // `{ populationTransitions: 4, populationMoved: 3, … }`. The refusal's stated MECHANISM
  // was wrong; the row is refused now on a different ground, and this one is measured.
  //
  // ⛔ THE GROUND IS THE THRESHOLD'S HOME, NOT THE FIELD. The row's band is the envelope
  // suite's own STATE MOTION bar — `MOVING_SHARE_FLOOR = 0.05` over transitions counted at
  // `MOTION_FLOOR_01 = 0.0025` — and its ONE home today is
  // `tests/domain/demographicsEnvelope.test.js:45,:47`, a test file this directory must not
  // import. Re-typing `0.05` here would be a SECOND SPELLING of one envelope, which is the
  // five-homes defect this registry's own header refuses in its fourth paragraph; the
  // motion floor is already spelled twice (`behavioral-observation.mjs:957` inline and the
  // suite's constant) and a third would make it worse. ARMING THE ROW IS THEREFORE ONE ACT
  // AWAY AND THE ACT IS THE CHAIR'S: lift `MOVING_SHARE_FLOOR` (and, while there, the motion
  // floor) into `scripts/audit/soakInvariants.mjs` beside `LIVENESS_FLOOR`, then import it
  // here as `YEARLY_BYTES_PER_SETTLEMENT_CEILING` and `WALL_TIME_TREND` already are.
  //
  // ⭐ AND WHAT THE ROW WOULD SAY IS MEASURED RATHER THAN GUESSED, so the chair is not
  // asked to arm an instrument blind. Run against the real 300-year receipt at the
  // envelope's own bar it is SILENT, and explainably so from the receipt's own figures:
  // over the customer horizon the population term moved 110 of 120 settlement-year
  // transitions (share 0.9167); at year 30 exactly, 3 of 4 (0.75); across all 300 years,
  // 0.8992, with NO year at zero and NO year below the 0.05 bar. That agrees in shape with
  // the envelope suite's own 170 of 180 (0.9444) on a different fixture.
  //
  // The property is measured meanwhile in the unconditional chain, by
  // `tests/domain/demographicsEnvelope.test.js`'s STATE MOTION arm.
  Object.freeze({
    id: 'capacity_plateau',
    class: 'deterministic',
    band: 'over >= 150 observed years: |y_last - y_mid| / y_mid <= 0.05, and every century multiplier < 50',
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
    requires: ['yearlyPopulations', 'yearlyDiedFlags'],
    detect: (receipt) => {
      const pops = Array.isArray(receipt?.yearlyPopulations) ? receipt.yearlyPopulations : [];
      // A run under 150 years did not observe a plateau; reading that silence as either a
      // pass or a finding is the §206.2b error the liveness row already paid for.
      if (pops.length < 150) return [];
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
    band: 'no LIVING settlement holds one head count across its last 100 observed years',
    home: 'tests/domain/demographicsFloor.test.js — the floored-six unfreeze. The pre-cure defect had TWO halves and the bounded check only ever saw one: a settlement frozen at 200 for a century is as broken as one at 2.9e13, and it fires nothing',
    gate: (receipt) => receipt?.subsystems?.rules?.demographicsEnabled === true,
    // The SAME blindness as its sibling above, found the same way and cured in the same
    // §909 landing: on the real 300-year receipt the row is correctly silent once the series
    // is rebuilt (nothing is frozen), but as shipped it could not have said otherwise about
    // any world. `requires` stays for the archived receipts, exactly as above.
    requires: ['yearlyPopulations', 'yearlyDiedFlags'],
    detect: (receipt) => {
      const pops = Array.isArray(receipt?.yearlyPopulations) ? receipt.yearlyPopulations : [];
      if (pops.length < 100) return [];
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
    // ⚠ NO `requires`, AND THE ASYMMETRY IS DELIBERATE. This row keys on `behavioral`, which
    // the writer DOES ship — it is reachable, and it executes on the real receipt. Its own
    // remaining gap is one level down (`yearly[last].realmDemography`, an ADDITIVE key a v4
    // receipt simply lacks), and `requires` grades TOP-LEVEL fields only. Widening it to
    // dotted paths is a real question and is left to the chair rather than smuggled in here:
    // it would re-grade archived receipts, which is a different act from curing a row that
    // could never fire on any receipt at all.
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
 *
 * ⛔⛔ AND THERE ARE THREE CHANNELS, NOT TWO (§206.2b, M1-F1). `notExecutable` carries the
 * rows that COULD NOT RUN — a row whose declared `requires` field is absent from the
 * receipt is listed there with the field named, and its detector is NOT called at all,
 * because calling it would produce the very `[]` that hid the defect. A row the receipt's
 * own state says does not apply (`gate`) is silent and lists nothing: not applicable and
 * not measurable are different facts, and this estate has already paid for reading them as
 * one.
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
 * The top-level receipt fields ONE row reads, from its `detect` and `gate` source text.
 *
 * @param {{detect?: Function, gate?: Function}} row
 * @returns {{fields: string[], unreadable: string|null}} `unreadable` names a row this
 *   walker refuses to grade rather than passing by default.
 */
export function tripwireFieldsRead(row) {
  const source = `${String(row?.detect || '')}\n${String(row?.gate || '')}`;
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
    let depth = 1;
    for (const raw of source.slice(start + opener.length).split('\n')) {
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
      }
      for (const character of line) {
        if (character === '{') depth += 1;
        else if (character === '}') depth -= 1;
      }
      if (depth <= 0) break;
    }
  }
  return [...fields];
}

/**
 * Every row's read set graded against the writer's key set.
 *
 * @param {Array<object>} rows
 * @param {string} writerSource
 * @returns {{written: string[], unreachable: Array<{id: string, field: string}>,
 *            unreadable: Array<{id: string, reason: string}>}}
 */
export function tripwireFieldReach(rows, writerSource) {
  const written = new Set(receiptWriterFields(writerSource));
  const unreachable = [];
  const unreadable = [];
  for (const row of rows) {
    const read = tripwireFieldsRead(row);
    if (read.unreadable) {
      unreadable.push({ id: row.id, reason: read.unreadable });
      continue;
    }
    for (const field of read.fields.sort()) {
      if (!written.has(field)) unreachable.push({ id: row.id, field });
    }
  }
  return { written: [...written].sort(), unreachable, unreadable };
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
    }
    // The clock scan reads the GATE as well as the detector: moving a row's applicability
    // test onto the row must not open a door the class boundary closed.
    if (row.class === 'deterministic' && /Date\.now|performance\.now|memoryUsage/.test(`${String(row.detect)}${String(row.gate || '')}`)) {
      defects.push(`${row.id}: a DETERMINISTIC row reads a clock or the heap — it belongs in host-observability`);
    }
  }
  return defects;
}
