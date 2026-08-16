/**
 * simMetricEmitter.test.js — the soak-receipt transform is total, pure, PII-free,
 * and structurally outside the deterministic core (ODQ §117a, §117.3, §120.2).
 *
 * ⚠ THE FIXTURE IS AUTHORED, NEVER CAPTURED. §145.2/§146 forbid running any soak
 * before this family lands, so `tests/fixtures/simSoakReceiptFixture.json` is
 * written from the receipt's declared schema. That makes the recorded
 * compile-fixture hazard live: a fixture whose arrays are empty makes every yearly
 * transform emit zero rows and every arm pass vacuously. The FIRST pin therefore
 * asserts the fixture's own arity — three years, a closed war, a completed
 * succession, a non-empty failure arm — BEFORE any transform output is asserted at
 * all.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  emit,
  emitRows,
  emittedDimViolations,
  SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS,
} from '../../scripts/telemetry/simMetricEmitter.mjs';
import { simMetricsByEpoch } from '../../scripts/telemetry/simMetricRegistry.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const EMITTER = join(ROOT, 'scripts/telemetry/simMetricEmitter.mjs');
const FIXTURE = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/simSoakReceiptFixture.json'), 'utf8'));
const IDENTITY = { runId: 'run-1', sourceSha: 'a'.repeat(40), seedFamily: 'fixture', profile: 'cert30' };

/** The four roots a telemetry module may never reach, transitively. */
const CORE_ROOTS = ['src/domain', 'src/generators', 'src/kernel', 'src/store'];

/**
 * ⛔ THE ONE MEASURED EDGE, ENUMERATED RATHER THAN WISHED AWAY.
 * `src/lib/analyticsEvents.js` — the home of the ONE name contract this class
 * shares with the product taxonomy — imports `EDIT_KINDS` from
 * `src/domain/pendingEdits.js`. So importing `EVENT_NAME_RE` (which the compile
 * refuses to fork by name) unavoidably drags one `src/domain` path into the
 * closure. It is accepted, not silenced, and the acceptance is guarded two ways
 * below: the row must still be REACHED (no stale exemptions) and the accepted
 * module must import NOTHING ITSELF, so it cannot carry engine behaviour into
 * telemetry no matter what it later grows.
 */
const ACCEPTED_CORE_EDGES = Object.freeze(['src/domain/pendingEdits.js']);
const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(|\brequire\s*\()\s*['"]([^'"]+)['"]/g;

/** Walk the emitter's transitive relative-import closure. */
function importClosure(entry, seen = new Set()) {
  if (seen.has(entry)) return seen;
  seen.add(entry);
  for (const match of readFileSync(entry, 'utf8').matchAll(SPECIFIER)) {
    if (!match[1].startsWith('.')) continue;
    importClosure(resolve(dirname(entry), match[1]), seen);
  }
  return seen;
}

describe('the simulation metric emitter', () => {
  it('runs against a fixture that can execute its own defect, and is TOTAL over both epochs', () => {
    // ── the fixture's own arity, asserted first ──────────────────────────────
    expect(FIXTURE.clean.behavioral.yearly.length).toBeGreaterThanOrEqual(3);
    expect(FIXTURE.clean.warConvergenceCensus.closedWars).toBeGreaterThanOrEqual(1);
    expect(FIXTURE.clean.behavioral.yearly
      .reduce((total, year) => total + year.succession.completions, 0)).toBeGreaterThanOrEqual(1);
    expect(FIXTURE.clean.stressorCounts.length).toBe(FIXTURE.clean.behavioral.yearly.length);
    expect(FIXTURE.withFailures.failures.length).toBeGreaterThanOrEqual(1);
    expect(FIXTURE.clean.behavioral.yearly
      .every((year) => year.phraseRepetition.observations > 0)).toBe(true);
    // ── and only then, the transform ────────────────────────────────────────
    const rows = emitRows(FIXTURE.clean, IDENTITY);
    const failed = emitRows(FIXTURE.withFailures, IDENTITY);
    const emitted = new Set([...rows, ...failed].map((entry) => entry.metric));
    for (const epoch of ['run', 'year']) {
      for (const metric of simMetricsByEpoch(epoch)) {
        expect(emitted.has(metric.name), `${metric.name} emitted no row from either fixture arm`).toBe(true);
      }
    }
    // ⭐ `sim_finding` is TOTAL over the failing arm and SILENT on the clean one,
    // and that asymmetry is the point: a clean soak that still published findings
    // would be inventing them. Asserting the union alone would hide it.
    expect(rows.filter((entry) => entry.metric === 'sim_finding')).toEqual([]);
    expect(failed.filter((entry) => entry.metric === 'sim_finding').length).toBeGreaterThan(0);
    const years = new Set(rows.filter((entry) => entry.epoch_kind === 'year').map((entry) => entry.epoch_index));
    expect([...years].sort()).toEqual([0, 1, 2]);
    expect(rows.filter((entry) => entry.epoch_kind === 'run')
      .every((entry) => entry.epoch_index === 0)).toBe(true);
  });

  it('emits no PII dimension and no dimension the registry did not declare', () => {
    const rows = [...emitRows(FIXTURE.clean, IDENTITY), ...emitRows(FIXTURE.withFailures, IDENTITY)];
    expect(rows.length).toBeGreaterThan(0);
    expect(emittedDimViolations(rows)).toEqual([]);
    // CONTROL: the emitted-side scan is a real gate, not a restatement of the
    // registry pin — a row the transform invented must convict.
    expect(emittedDimViolations([{ metric: 'sim_event_tempo', dims: { session_id: 'x' } }])).toEqual([
      'sim_event_tempo: emitted PII dim session_id',
    ]);
  });

  it('REFUSES an unsupported receipt schemaVersion instead of parsing it best-effort', () => {
    expect([...SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS]).toEqual([4, 5]);
    expect(() => emitRows({ ...FIXTURE.clean, schemaVersion: 6 }, IDENTITY))
      .toThrow(/unsupported soak receipt schemaVersion 6/);
    expect(() => emitRows({ ...FIXTURE.clean, schemaVersion: 4 }, IDENTITY)).not.toThrow();
    // Run identity is required, never invented from the environment.
    expect(() => emitRows(FIXTURE.clean, { runId: 'r' })).toThrow(/runId and sourceSha/);
  });

  it('is DETERMINISTIC — two emissions of one receipt are byte-identical', () => {
    expect(emit(FIXTURE.clean, IDENTITY)).toBe(emit(FIXTURE.clean, IDENTITY));
    const source = readFileSync(EMITTER, 'utf8').split('\n')
      .filter((line) => !line.trimStart().startsWith('*') && !line.trimStart().startsWith('/*'));
    expect(source.filter((line) => /Date\.now\(|Math\.random\(|process\.env|readFileSync/.test(line))).toEqual([]);
  });

  it('has an import closure that reaches NO module of the deterministic core beyond ONE enumerated leaf', () => {
    const closure = [...importClosure(EMITTER)].map((file) => relative(ROOT, file));
    expect(closure.length).toBeGreaterThan(1);
    const reached = closure.filter((file) => CORE_ROOTS.some((root) => file.startsWith(root)));
    expect(reached.filter((file) => !ACCEPTED_CORE_EDGES.includes(file))).toEqual([]);
    // SHRINK-ONLY: an acceptance whose edge is gone is a stale silencer.
    expect(ACCEPTED_CORE_EDGES.filter((file) => !reached.includes(file))).toEqual([]);
    // …AND the accepted leaf must import NOTHING, which is what makes it safe.
    for (const file of ACCEPTED_CORE_EDGES) {
      expect([...readFileSync(join(ROOT, file), 'utf8').matchAll(SPECIFIER)].map((m) => m[1])).toEqual([]);
    }
    // CONTROL: the walk really classifies — a core path in the same shape convicts.
    expect(['src/domain/worldPulse/worldState.js']
      .filter((file) => CORE_ROOTS.some((root) => file.startsWith(root)))
      .filter((file) => !ACCEPTED_CORE_EDGES.includes(file))).toEqual([
      'src/domain/worldPulse/worldState.js',
    ]);
  });
});
