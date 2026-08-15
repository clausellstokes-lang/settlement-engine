/**
 * receipt.test.js — Track K §C2 conformance pin for the unified Receipt type.
 *
 * The North Star (docs/TRACK_K_DESIGN.md §C2): one Receipt type unifies the two
 * receipt vocabularies that predate it — the generation-time Trace and the
 * eventLog / snapshot entries the store carried loosely (§C1). A Receipt is a
 * DERIVED view: stored shapes (settlement.simulationTrace, the eventLog) stay
 * canonical, and nothing here persists or migrates.
 *
 * This pin enforces:
 *   1. Schema conformance — every receiptFromTrace output validates against the
 *      Receipt schema (id/source/kind/causes/effects/tick), walked across a
 *      3-config generated corpus.
 *   2. Closed `kind` set — the kind vocabulary is exactly trace.js's target-type
 *      set (RECEIPT_KINDS === ALLOWED_TARGET_TYPES); every kind PRODUCED across
 *      generation + the event/edit builders is a member. An unknown kind, or a
 *      drift between the two sets, fails the pin.
 *   3. Verbatim cause/effect reuse — receiptFromTrace carries the trace's own
 *      TraceCause[] / TraceEffect[] through without remapping.
 *   4. The other two builders (receiptFromEventLogEntry, the makeReceipt-built
 *      'edit' receipt) emit schema-conformant Receipts on closed-set kinds.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  receiptFromTrace,
  makeReceipt,
  getTraces,
  RECEIPT_KINDS,
  RECEIPT_SOURCES,
  ALLOWED_TARGET_TYPES,
} from '../../src/domain/trace.js';
import { receiptFromEventLogEntry } from '../../src/domain/events/mutate.js';

// ── 3-config generated corpus ───────────────────────────────────────────────
// Spans the tier spectrum × culture × terrain × trade so the traces cover a
// broad slice of the kind vocabulary (institution/faction/npc/resource/
// supply_chain/condition/history). Deterministic seed + headless customContent.
const CONFIGS = [
  { settType: 'village', culture: 'germanic',      terrain: 'river',   tradeRouteAccess: 'road' },
  { settType: 'town',    culture: 'celtic',        terrain: 'swamp',   tradeRouteAccess: 'river' },
  { settType: 'city',    culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' },
];
const SEED = 'receipt-conformance-2026-07';
const CORPUS = CONFIGS.map(c => generateSettlementPipeline(c, null, { seed: SEED, customContent: {} }));

// The enumerated closed vocabulary. Justification per entry:
//   institution/faction/npc/resource/stressor/supply_chain/threat/condition/
//   history — the targetType values GENERATION traces actually emit (grep
//   'targetType:' across src/generators/steps).
//   service/hook/district — declared in trace.js's ALLOWED_TARGET_TYPES for
//   traces authored elsewhere; kept in the set so the two stay identical.
//   event — the store's applyEvent / DESTROY_SETTLEMENT receipt kind.
const EXPECTED_KINDS = [
  'institution', 'faction', 'npc', 'resource', 'stressor',
  'service', 'supply_chain', 'threat', 'hook', 'event',
  'condition', 'district', 'history',
];

const KIND_SET = new Set(RECEIPT_KINDS);

// ── Schema walk ─────────────────────────────────────────────────────────────

/** @param {any} c */
function isTraceCause(c) {
  return !!c && typeof c === 'object'
    && typeof c.source === 'string'
    && (c.effect === undefined || typeof c.effect === 'string')
    && (c.reason === undefined || typeof c.reason === 'string');
}
/** @param {any} e */
function isTraceEffect(e) {
  return !!e && typeof e === 'object'
    && typeof e.target === 'string'
    && (e.effect === undefined || typeof e.effect === 'string')
    && (e.reason === undefined || typeof e.reason === 'string');
}

/** Full schema walk over one Receipt. @param {any} r */
function assertReceipt(r) {
  expect(r && typeof r === 'object' && !Array.isArray(r), `not a receipt object: ${JSON.stringify(r)}`).toBe(true);
  expect(RECEIPT_SOURCES).toContain(r.source);
  expect(typeof r.id, 'id is a string').toBe('string');
  // id === `${source}:${targetId}:${n}` — leads with the source, ends with the ordinal.
  expect(r.id.startsWith(`${r.source}:`), `id must lead with source: ${r.id}`).toBe(true);
  expect(/:\d+$/.test(r.id), `id must end with :<n>: ${r.id}`).toBe(true);
  expect(KIND_SET.has(r.kind), `kind "${r.kind}" is outside the closed set`).toBe(true);
  expect(Array.isArray(r.causes), 'causes is an array').toBe(true);
  expect(Array.isArray(r.effects), 'effects is an array').toBe(true);
  for (const c of r.causes) expect(isTraceCause(c), `malformed cause: ${JSON.stringify(c)}`).toBe(true);
  for (const e of r.effects) expect(isTraceEffect(e), `malformed effect: ${JSON.stringify(e)}`).toBe(true);
  expect(r.tick === null || typeof r.tick === 'number', 'tick is number|null').toBe(true);
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('Track K §C2 — Receipt conformance', () => {
  test('the corpus generated real traces to walk', () => {
    for (const s of CORPUS) {
      expect(getTraces(s).length, 'a config produced no traces').toBeGreaterThan(0);
    }
  });

  test('every receiptFromTrace output validates against the Receipt schema', () => {
    let walked = 0;
    for (const s of CORPUS) {
      getTraces(s).forEach((trace, i) => {
        const r = receiptFromTrace(trace, i);
        assertReceipt(r);
        // The id target segment is the trace's own targetId; source is generation.
        expect(r.source).toBe('generation');
        expect(r.id).toBe(`generation:${trace.targetId}:${i}`);
        walked += 1;
      });
    }
    expect(walked, 'no receipts walked').toBeGreaterThan(0);
  });

  test('receiptFromTrace reuses the trace cause/effect arrays verbatim', () => {
    for (const s of CORPUS) {
      for (const trace of getTraces(s)) {
        const r = receiptFromTrace(trace);
        // Same TraceCause / TraceEffect shape, unremapped: kind is the targetType,
        // causes are the trace's causes, effects are its downstreamEffects.
        expect(r.kind).toBe(trace.targetType);
        expect(r.causes).toEqual(trace.causes || []);
        expect(r.effects).toEqual(trace.downstreamEffects || []);
        expect(r.tick).toBeNull();
      }
    }
  });

  test('receiptFromTrace(null/garbage) is null, never a malformed receipt', () => {
    expect(receiptFromTrace(null)).toBeNull();
    expect(receiptFromTrace(undefined)).toBeNull();
    expect(receiptFromTrace(/** @type {any} */ ('not-a-trace'))).toBeNull();
  });
});

describe('Track K §C2 — the kind vocabulary is a closed set', () => {
  test('RECEIPT_KINDS is exactly trace.js\'s target-type vocabulary (drift guard)', () => {
    expect([...RECEIPT_KINDS].sort()).toEqual([...EXPECTED_KINDS].sort());
    // The two vocabularies must never drift apart: adding a trace target type
    // without the matching kind (or vice versa) fails here.
    expect(new Set(RECEIPT_KINDS)).toEqual(ALLOWED_TARGET_TYPES);
    expect(RECEIPT_KINDS.length).toBe(ALLOWED_TARGET_TYPES.size);
  });

  test('every kind PRODUCED across sources is a member of the closed set', () => {
    /** @type {Set<string>} */
    const produced = new Set();
    // Generation lane.
    for (const s of CORPUS) {
      for (const trace of getTraces(s)) produced.add(receiptFromTrace(trace).kind);
    }
    // Event lane + edit lane (the store's other two receipt kinds).
    produced.add(receiptFromEventLogEntry({ event: { id: 'e', type: 'X' } }).kind);
    produced.add(makeReceipt({ source: 'edit', kind: 'history', targetId: 'snap' }).kind);

    // Corpus must be diverse enough to actually exercise the vocabulary.
    expect(produced.size, 'corpus produced too few distinct kinds to be meaningful').toBeGreaterThanOrEqual(4);
    for (const kind of produced) {
      expect(KIND_SET.has(kind), `produced kind "${kind}" is not in RECEIPT_KINDS`).toBe(true);
    }
  });
});

describe('Track K §C2 — event + edit builders emit conformant receipts', () => {
  test('receiptFromEventLogEntry: nested EventLogEntry — event is cause, deltas are effects', () => {
    const logEntry = {
      event: { id: 'evt-1', type: 'DAMAGE_INSTITUTION', targetId: 'institution.granary', payload: {} },
      appliedAt: '2026-07-09T00:00:00.000Z',
      deltas: [
        { key: 'resilience', before: 60, after: 52, change: -8, severity: 'moderate', explanation: 'Resilience fell noticeably' },
        { key: 'volatility', before: 30, after: 41, change: 11, severity: 'moderate', explanation: 'Volatility rose noticeably' },
      ],
      narrativeSummary: 'The granary was damaged.',
    };
    const r = receiptFromEventLogEntry(logEntry);
    assertReceipt(r);
    expect(r.source).toBe('event');
    expect(r.kind).toBe('event');
    expect(r.id).toBe('event:evt-1:0');
    expect(r.tick).toBeNull();
    // The event is the single cause.
    expect(r.causes).toEqual([
      { source: 'DAMAGE_INSTITUTION', effect: 'targets institution.granary', reason: 'The granary was damaged.' },
    ]);
    // Each moved dimension is one signed effect.
    expect(r.effects).toEqual([
      { target: 'resilience', effect: '-8', reason: 'Resilience fell noticeably' },
      { target: 'volatility', effect: '+11', reason: 'Volatility rose noticeably' },
    ]);
  });

  test('receiptFromEventLogEntry: flat DESTROY_SETTLEMENT entry (no nested event, no deltas)', () => {
    const flat = {
      id: 'evt-d', type: 'DESTROY_SETTLEMENT', targetId: 'meteor',
      timestamp: '2026-07-09T00:00:00.000Z', narrativeSummary: 'Testford was destroyed: meteor.',
    };
    const r = receiptFromEventLogEntry(flat, 3);
    assertReceipt(r);
    expect(r.source).toBe('event');
    expect(r.kind).toBe('event');
    expect(r.id).toBe('event:evt-d:3');
    expect(r.causes[0].source).toBe('DESTROY_SETTLEMENT');
    expect(r.effects).toEqual([]);
  });

  test('receiptFromEventLogEntry(null/garbage) is null', () => {
    expect(receiptFromEventLogEntry(null)).toBeNull();
    expect(receiptFromEventLogEntry(undefined)).toBeNull();
  });

  test('makeReceipt composes the stable id and an edit/history receipt', () => {
    const r = makeReceipt({
      source: 'edit',
      kind: 'history',
      targetId: 'snap_123',
      causes: [{ source: 'edit', effect: 'manual', reason: 'Snapshot' }],
    });
    assertReceipt(r);
    expect(r.id).toBe('edit:snap_123:0');
    expect(r.source).toBe('edit');
    expect(r.kind).toBe('history');
    expect(r.effects).toEqual([]);
    expect(r.tick).toBeNull();
    // ordinal disambiguator flows into the id.
    expect(makeReceipt({ source: 'pulse', kind: 'threat', targetId: 't', n: 5, tick: 12 }).id).toBe('pulse:t:5');
  });
});
