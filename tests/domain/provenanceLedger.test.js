/**
 * provenanceLedger.test.js — THE PROVENANCE LEDGER writer pins.
 *
 * Pins (design: engine finale #1):
 *   · SINGLE-WRITER — only provenanceKernel.js writes the 'provenance' spatialLedger.
 *   · CONE EXACTNESS — a constructed 3-step causal chain yields the exact recorded cone.
 *   · SIZE GOVERNOR — the ledger never exceeds MAX_PROVENANCE_EDGES; lowest-tick evicts.
 *   · WRITER BASICS — flag-off no-op, sorted keys, self-edge/dup drop, durable-id scope.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  recordProvenanceLedger, collectProvenanceEdges, provenanceLedgerActive,
  MAX_PROVENANCE_EDGES,
} from '../../src/domain/worldPulse/provenanceKernel.js';
import { buildRecordedEdges, recordedDescendants } from '../../src/domain/display/chronicleGraph.js';
import { setSpatialLedger } from '../../src/domain/spatial/distanceRead.js';

const LIT = { simulationRules: { provenanceLedgerEnabled: true } };

// ── SINGLE-WRITER ────────────────────────────────────────────────────────────
describe('provenance ledger — single-writer discipline', () => {
  it('only provenanceKernel.js writes setSpatialLedger(..., \'provenance\')', () => {
    const ROOT = join(process.cwd(), 'src', 'domain');
    /** @param {string} dir @param {string[]} out */
    const walk = (dir, out = []) => {
      for (const e of readdirSync(dir)) {
        const p = join(dir, e);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (/\.js$/.test(p) && !/\.test\./.test(p)) out.push(p);
      }
      return out;
    };
    // Mirror the spatialLedgerCoverage walker's write regex, keyed to 'provenance'.
    const RE = /setSpatialLedger\s*\(\s*[^,]+,\s*['"]provenance['"]/g;
    const writers = walk(ROOT).filter((p) => RE.test(readFileSync(p, 'utf8')));
    expect(writers.map((p) => p.replace(ROOT, 'src/domain')))
      .toEqual(['src/domain/worldPulse/provenanceKernel.js']);
  });
});

// ── CONE EXACTNESS ───────────────────────────────────────────────────────────
describe('provenance ledger — cone exactness (a 3-step chain yields the exact cone)', () => {
  // A(decree/root) → B → C, wired by causedBy; A, B, C carry DISJOINT entity keys,
  // so ONLY the recorded edges connect them (entity-key inference would find nothing).
  const outcomes = [
    { id: 'A', type: 'realm_verb', proposalPayload: { kind: 'realm_verb_order' }, targetSaveId: 'sA' },
    { id: 'B', type: 'condition', causedBy: 'A', targetSaveId: 'sB' },
    { id: 'C', type: 'condition', causedBy: 'B', targetSaveId: 'sC' },
  ];
  const durableIds = new Set(['A', 'B', 'C']);

  it('the writer records B←A and C←B (roots carry no self entry)', () => {
    const ws = recordProvenanceLedger(LIT, { outcomes, newsEntries: [], durableIds, tick: 300 });
    const ledger = ws.spatialLedgers.provenance;
    expect(Object.keys(ledger).sort()).toEqual(['B', 'C']);
    expect(ledger.B.parents).toEqual(['A']);
    expect(ledger.C.parents).toEqual(['B']);
    expect(ledger.B.tick).toBe(300);
  });

  it('the recorded transitive cone of A is EXACTLY {B, C}', () => {
    const ws = recordProvenanceLedger(LIT, { outcomes, newsEntries: [], durableIds, tick: 300 });
    const edges = buildRecordedEdges(ws.spatialLedgers.provenance);
    expect(recordedDescendants('A', edges)).toEqual(['B', 'C']);
    expect(recordedDescendants('B', edges)).toEqual(['C']);
    expect(recordedDescendants('C', edges)).toEqual([]);
  });

  it('scope restricts the cone to co-advance ids (a grandchild outside scope drops out)', () => {
    const edges = buildRecordedEdges({ B: { parents: ['A'] }, C: { parents: ['B'] } });
    // C excluded from scope ⇒ cone of A is just {B} (walk still traverses through B).
    expect(recordedDescendants('A', edges, new Set(['A', 'B']))).toEqual(['B']);
  });
});

// ── SIZE GOVERNOR ────────────────────────────────────────────────────────────
describe('provenance ledger — size governor (horizon compaction)', () => {
  it('caps at MAX_PROVENANCE_EDGES, evicting the lowest tick first', () => {
    // Seed a prior ledger AT the cap: one edge per tick 1..MAX.
    /** @type {Record<string, { parents: string[], type: string, tick: number }>} */
    const prior = {};
    for (let t = 1; t <= MAX_PROVENANCE_EDGES; t++) prior[`old_${t}`] = { parents: ['p'], type: 'x', tick: t };
    const ws = setSpatialLedger({ ...LIT }, 'provenance', prior);
    // Record ONE fresh high-tick edge ⇒ MAX+1 ⇒ must compact back to MAX.
    const fresh = [{ id: 'fresh', type: 'condition', causedBy: 'q' }];
    const next = recordProvenanceLedger(ws, {
      outcomes: fresh, newsEntries: [], durableIds: new Set(['fresh']), tick: MAX_PROVENANCE_EDGES + 1,
    });
    const led = next.spatialLedgers.provenance;
    expect(Object.keys(led).length).toBe(MAX_PROVENANCE_EDGES);
    expect(led.fresh, 'the fresh high-tick edge survives').toBeTruthy();
    expect(led.old_1, 'the lowest-tick edge is evicted').toBeUndefined();
    expect(led.old_2, 'the next-lowest survives (only one was over the cap)').toBeTruthy();
  });
});

// ── WRITER BASICS ────────────────────────────────────────────────────────────
describe('provenance ledger — writer basics', () => {
  const outcomes = [{ id: 'X', type: 'condition', causedBy: 'root' }];
  const durableIds = new Set(['X']);

  it('is a pure no-op when the flag is absent (dormant ⇒ same reference, no key)', () => {
    const ws = { simulationRules: {} };
    const next = recordProvenanceLedger(ws, { outcomes, newsEntries: [], durableIds, tick: 5 });
    expect(next).toBe(ws);
    expect(provenanceLedgerActive(ws)).toBe(false);
  });

  it('records nothing (no key) when the flag is on but no durable receipt has a parent', () => {
    const next = recordProvenanceLedger(LIT, { outcomes: [{ id: 'X' }], newsEntries: [], durableIds, tick: 5 });
    expect(next).toBe(LIT);
  });

  it('scopes to durable receipt ids (an off-record outcome is not recorded)', () => {
    const off = [{ id: 'offRecord', type: 'condition', causedBy: 'root' }];
    const next = recordProvenanceLedger(LIT, { outcomes: off, newsEntries: [], durableIds: new Set(['X']), tick: 5 });
    expect(next).toBe(LIT); // nothing in scope ⇒ no write
  });

  it('collectProvenanceEdges dedupes parents and drops self-edges, sorted', () => {
    const edges = collectProvenanceEdges({
      outcomes: [{ id: 'X', causedBy: ['b', 'a', 'X', 'b'], sourceEventId: 'a' }],
      newsEntries: [], durableIds: new Set(['X']), tick: 9,
    });
    expect(edges.X.parents).toEqual(['a', 'b']); // sorted, deduped, self 'X' dropped
  });

  it('serializes with sorted keys (byte-stable regardless of insertion order)', () => {
    const ws = recordProvenanceLedger(LIT, {
      outcomes: [{ id: 'zeta', causedBy: 'p' }, { id: 'alpha', causedBy: 'p' }],
      newsEntries: [], durableIds: new Set(['zeta', 'alpha']), tick: 1,
    });
    expect(Object.keys(ws.spatialLedgers.provenance)).toEqual(['alpha', 'zeta']);
  });
});
