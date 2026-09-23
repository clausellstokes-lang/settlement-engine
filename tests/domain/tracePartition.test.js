/**
 * tests/domain/tracePartition.test.js — EM-R5's acceptance battery for the generation
 * trace's partition by step (design §22 ruling 8, as §22.1 correction 4 amends it).
 *
 * ⛔ THREE CONSTRUCTION RULES (packet §6), each with its own instrument:
 *   1. `it`, `test` and `describe` are bound EXACTLY ONCE each, never re-bound, not even as
 *      a callback parameter: the sovereignty-lighting census resolves an opener only where
 *      the module binds the word once, and a stray `(it) =>` parks the whole file.
 *   2. Every set an arm iterates is IMPORTED from its producer and every record is DERIVED by
 *      running the real generator, never a local literal copy of a table, which is the shape
 *      `tests/lint/contractTestAntiVacuity.walker.test.js` Rule 2 convicts.
 *   3. Negative assertions are anchored: each carries `// anchored:` on ONE line immediately
 *      above the `expect` itself — a wrapped marker anchors nothing.
 */
import { describe, it, expect } from 'vitest';
import {
  TRACE_STEP_ORDER, TRACE_SUBJECTS, MIXED_TRACE_STEPS,
  traceSubjectKey, carriedTraceSteps, partitionTrace,
} from '../../src/domain/edit/tracePartition.js';
import { RECORD_CLASSES } from '../../src/domain/edit/recordRegister.js';
import { getStepOrder } from '../../src/generators/pipeline.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

/** The floor the whole file rests on: an empty walk would make every set equality vacuous. */
const STRIDE_FLOOR = 63;

/** The HELD class, READ FROM ITS PRODUCER rather than re-typed here. */
const HELD = new Set(Object.keys(RECORD_CLASSES).filter((key) => RECORD_CLASSES[key] === 'HELD'));

/** The step half of a declared `step::targetType` pair. */
const stepOf = (pair) => pair.slice(0, pair.indexOf('::'));

/** The subjects a step declares, computed from the imported register. */
const subjectsOf = (step) => Object.keys(TRACE_SUBJECTS)
  .filter((pair) => stepOf(pair) === step).map((pair) => TRACE_SUBJECTS[pair]);

/** Entries compared without their clock, so a re-stamp is not read as a difference. */
const withoutClock = (rows) => JSON.stringify(rows.map((entry) => ({ ...entry, ts: 0 })));

/**
 * THE STRIDE, derived in-test from the golden master's own corpus: the FIRST row of each
 * (settType, terrainOverride) pair among the grid rows, then every non-grid row. No fixture
 * is committed — a second spelling of the corpus is how two instruments come to disagree
 * about which world they measured while both report green.
 */
function stride63() {
  const all = goldenCorpus();
  const seen = new Set();
  const head = [];
  for (const row of all.slice(0, 504)) {
    const key = `${row.settType}|${row.terrainOverride}`;
    if (seen.has(key)) continue;
    seen.add(key);
    head.push(row);
  }
  return [...head, ...all.slice(504)];
}

const ROWS = stride63();
const LABELS = ROWS.map(keyOf);

/** Generated through the real pipeline, exactly as the golden master calls it. */
const RECORDS = ROWS.map((row) => {
  const { _seed: pinnedSeed, ...cfg } = row;
  return generateSettlementPipeline(cfg, null, { seed: pinnedSeed, customContent: {} });
});

describe('EM-R5 — the generation trace partitioned by every step about a held key', () => {
  it('A1 — every entry carries its step and its subject, over the whole corpus', () => {
    const bad = [];
    let entries = 0;
    for (const record of RECORDS) {
      for (const entry of record.simulationTrace) {
        entries += 1;
        if (typeof entry.step !== 'string' || !entry.step) bad.push('step');
        if (typeof entry.targetType !== 'string' || !entry.targetType) bad.push('targetType');
        if (typeof entry.targetId !== 'string' || !entry.targetId) bad.push('targetId');
        if (traceSubjectKey(entry) === null) bad.push(`${entry.step}::${entry.targetType}`);
      }
    }
    expect(bad).toEqual([]);
    expect(entries).toBeGreaterThan(0);
    expect(RECORDS.length).toBeGreaterThanOrEqual(STRIDE_FLOOR);
  });

  it('A2 — every step emits ONE CONTIGUOUS RUN, which is what makes a run the substitution unit', () => {
    const broken = [];
    RECORDS.forEach((record, index) => {
      const seen = new Set();
      let previous = null;
      for (const entry of record.simulationTrace) {
        if (entry.step === previous) continue;
        if (seen.has(entry.step)) broken.push(`${LABELS[index]}:${entry.step}`);
        seen.add(entry.step);
        previous = entry.step;
      }
    });
    expect(broken).toEqual([]);
    expect(RECORDS.length).toBeGreaterThanOrEqual(STRIDE_FLOOR);
  });

  it('A3 — the deterministic clock IS the entry position, which is why the partition re-stamps it', () => {
    const off = [];
    for (const record of RECORDS) {
      record.simulationTrace.forEach((entry, index) => { if (entry.ts !== index) off.push(index); });
    }
    expect(off).toEqual([]);
    expect(RECORDS.length).toBeGreaterThanOrEqual(STRIDE_FLOOR);
  });

  it('A4 — the step order and the subject register are total against their producers, both ways', () => {
    expect(TRACE_STEP_ORDER).toEqual(getStepOrder());
    const emitted = new Set();
    for (const record of RECORDS) {
      for (const entry of record.simulationTrace) emitted.add(`${entry.step}::${entry.targetType}`);
    }
    const declared = new Set(Object.keys(TRACE_SUBJECTS));
    expect([...emitted].filter((pair) => !declared.has(pair))).toEqual([]);
    expect(Object.values(TRACE_SUBJECTS)
      .filter((subject) => !Object.prototype.hasOwnProperty.call(RECORD_CLASSES, subject))).toEqual([]);
    expect(emitted.size).toBeGreaterThan(0);
  });

  it('A5 — with nothing held the partition IS the derivation, by identity, so the goldens cannot move', () => {
    const recorded = RECORDS[0].simulationTrace;
    const derived = RECORDS[0].simulationTrace;
    expect(partitionTrace(recorded, derived, new Set())).toBe(derived);
    expect(partitionTrace(recorded, derived, new Set(['economicState']))).toBe(derived);
    expect(carriedTraceSteps(new Set()).size).toBe(0);
    const held = partitionTrace(recorded, derived, HELD);
    // anchored: THE COUNTERFORCE — the length assertion below proves a real array came back
    expect(held).not.toBe(derived);
    expect(held.length).toBeGreaterThan(0);
  });

  it('A6 — the carried set is the ten steps whose entries are about a held key, both ways', () => {
    const carried = carriedTraceSteps(HELD);
    const expected = new Set(Object.keys(TRACE_SUBJECTS)
      .filter((pair) => HELD.has(TRACE_SUBJECTS[pair])).map(stepOf));
    expect([...carried].sort()).toEqual([...expected].sort());
    expect(carried.size).toBe(10);
    const mixed = [...new Set(Object.keys(TRACE_SUBJECTS).map(stepOf))].filter((step) => subjectsOf(step)
      .some((subject) => HELD.has(subject)) && subjectsOf(step).some((subject) => !HELD.has(subject)));
    expect(mixed.sort()).toEqual(Object.keys(MIXED_TRACE_STEPS).sort());
    // anchored: the size assertion above proves a real bag carries ten, so this emptiness is a filter
    expect([...carriedTraceSteps(new Set(['stress', 'isolationSupport']))]).toEqual([]);
  });

  it('A7 — a carried step is restored and a deriving step is not, and the record is never aliased', () => {
    const carried = carriedTraceSteps(HELD);
    const notRestored = [];
    const notReStamped = [];
    const aliased = [];
    RECORDS.forEach((record, index) => {
      const recorded = record.simulationTrace;
      const derived = structuredClone(recorded.filter((entry) => !carried.has(entry.step)));
      const out = partitionTrace(recorded, derived, HELD);
      if (withoutClock(out) !== withoutClock(recorded)) notRestored.push(LABELS[index]);
      if (out.some((entry, position) => entry.ts !== position)) notReStamped.push(LABELS[index]);
      const nested = new Set();
      for (const entry of recorded) { nested.add(entry.causes); nested.add(entry.downstreamEffects); }
      if (out.some((entry) => recorded.includes(entry)
        || nested.has(entry.causes) || nested.has(entry.downstreamEffects))) aliased.push(LABELS[index]);
    });
    expect(notRestored).toEqual([]);
    expect(notReStamped).toEqual([]);
    // anchored: the restore assertion above proves the carry ran, so the NESTED arrays are the alias
    expect(aliased).toEqual([]);
    expect(RECORDS.length).toBeGreaterThanOrEqual(STRIDE_FLOOR);
  });

  it('A8 — an entry whose step the runner does not register is carried in the declared tail', () => {
    const recorded = RECORDS[0].simulationTrace;
    const legacy = {
      step: 'legacyStep', targetType: 'institution', targetId: 'institution.x',
      result: 'selected', causes: [], downstreamEffects: [], ts: 9000,
    };
    const out = partitionTrace([...recorded, legacy], recorded, HELD);
    expect(out[out.length - 1].step).toBe('legacyStep');
    expect(out[out.length - 1].ts).toBe(out.length - 1);
    // anchored: the tail assertions above are what make this absence before the tail meaningful
    expect(out.slice(0, -1).some((entry) => entry.step === 'legacyStep')).toBe(false);
  });
});
