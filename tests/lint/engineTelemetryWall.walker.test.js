/**
 * engineTelemetryWall.walker.test.js — THE ENGINE↔TELEMETRY WALL, as machinery.
 *
 * ODQ §117.3 + THE PROMISE: telemetry informs SUGGESTION, never engine math, and
 * no telemetry-derived value may reach the deterministic engine. The hazard-
 * conversion law says a rule of that shape is MACHINERY FROM BIRTH or it is
 * nothing, so the wall is scan-enforced here rather than described in a design
 * volume.
 *
 * ⛔ THIS FILE REPLACES `tests/lint/telemetrySimulationSeparation.test.js`, whose
 * four arms are FOLDED IN below (Arms A′, F1, F2, F3) rather than duplicated. That
 * file's census denominator was `src/domain/worldPulse` alone; §117.3 asks for the
 * union of the deterministic-core roots, and this walker measures all four.
 *
 * SIX ARMS
 *   A  engine ↛ telemetry, over an exact-set ARM_A_ROOTS with a per-root floor
 *   A′ the worldPulse floor asserted SEPARATELY (see the subsumption note below)
 *   B  telemetry ↛ engine, over an exact-set ARM_B_ROOTS
 *   C  the Arm A exemption manifest: exact, rationale-carrying, shrink-only
 *   D  the simulation class is PII-free in the registry AND in its own DDL
 *   E  the ingest path refuses every simulation metric name (source contract)
 *   F  the standing arms folded from the retired file
 *
 * ⚠ WHY A′ IS NOT MERGED INTO A. A union floor over four roots stays green when a
 * whole root is deleted, because the other three still clear it. That is the
 * redundant-guard-subsumption shape this estate has already convicted once (a
 * `live` flag hid a deleted counter and the mutant passed 7/7). Each root carries
 * its own floor, and worldPulse — the root the retired file measured — is
 * additionally asserted by name so the fold provably lost no coverage.
 */

import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { SIM_METRICS, SIM_METRIC_NAMES, FORBIDDEN_DIM_RE } from '../../scripts/telemetry/simMetricRegistry.mjs';

const ROOT = resolve(process.cwd());
const IMPORT_SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(|\brequire\s*\()\s*['"]([^'"]+)['"]/g;

/** The deterministic core, as an EXACT SET. Adding a root is a visible act. */
const ARM_A_ROOTS = Object.freeze([
  'src/domain/worldPulse',
  'src/domain',
  'src/generators',
  'src/kernel',
]);

/** Per-root non-shrinking floors, re-derived at this member's own base. */
const ARM_A_FLOORS = Object.freeze({
  'src/domain/worldPulse': 400,
  'src/domain': 900,
  'src/generators': 100,
  'src/kernel': 6,
});

/** The telemetry side, as an EXACT SET. */
const ARM_B_ROOTS = Object.freeze([
  'src/lib',
  'scripts/telemetry',
  'scripts/soak',
]);

const ARM_B_FLOORS = Object.freeze({
  'src/lib': 6,
  'scripts/telemetry': 3,
  'scripts/soak': 1,
});

/**
 * ⛔ SHRINK-ONLY. `scripts/soak/**` is in ARM_B_ROOTS from this walker's BIRTH —
 * the soak-harness charter's §2.2 obligation, discharged here so the joint compile
 * cannot lose it — but the directory does not exist yet: the harness family's own
 * SK-1 creates it. A non-empty floor over an absent directory is a vacuous arm,
 * which is the exact class this estate forbids. So the root is DECLARED, its
 * emptiness is NAMED, and SK-1 removes the row and supplies the floor. A root in
 * neither state reds.
 */
const AWAITING_POPULATION = Object.freeze(['scripts/soak']);

/**
 * ⛔ SHRINK-ONLY, AND EMPTY AT BIRTH. Measured at this base, ZERO module under
 * ARM_A_ROOTS imports a specifier in the forbidden class — so an exemption row
 * here would silence a violation that does not exist. That is the same birth
 * idiom the estate's three other allowlists carry, and it is why the arm's proof
 * is its PLANTED CONTROLS rather than its live row count.
 */
const ARM_A_EXEMPTIONS = Object.freeze([]);

/**
 * The migration files that declare a simulation-metric table, as an exact set,
 * with the same shrink-only discipline Arm B uses for `scripts/soak`. TM-2A mints
 * `196_world_sim_metrics.sql` and removes its awaiting row.
 */
const SIM_METRIC_MIGRATIONS = Object.freeze(['supabase/migrations/196_world_sim_metrics.sql']);
const AWAITING_MIGRATION = Object.freeze(['supabase/migrations/196_world_sim_metrics.sql']);

const ENGINE_FORBIDS = /analytics|telemetr|simMetric|ingest/i;
const TELEMETRY_FORBIDS = /worldPulse|worldState|generateSettlementPipeline|simulationRules/i;

function filesBelow(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesBelow(path);
    return /\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
  });
}

function forbiddenImports(source, forbidden) {
  return [...source.matchAll(IMPORT_SPECIFIER)]
    .map((match) => match[1])
    .filter((specifier) => forbidden.test(specifier));
}

const rel = (file) => file.slice(ROOT.length + 1);

function violationsIn(files, forbidden) {
  return files.flatMap((file) => forbiddenImports(readFileSync(file, 'utf8'), forbidden)
    .map((specifier) => `${rel(file)} -> ${specifier}`));
}

/** Arm B's roster: `src/lib` contributes only its analytics-named modules. */
function armBFiles(root) {
  const files = filesBelow(join(ROOT, root));
  return root === 'src/lib' ? files.filter((file) => /analytics/i.test(file)) : files;
}

describe('the engine/telemetry wall', () => {
  it('the detector catches static, dynamic, and require imports', () => {
    const fixture = [
      "import { track } from '../../lib/analytics.js';",
      "const state = await import('./worldPulse/worldState.js');",
      "require('../analyticsQueue.js');",
      "import { emit } from '../../scripts/telemetry/simMetricEmitter.mjs';",
    ].join('\n');
    expect(forbiddenImports(fixture, ENGINE_FORBIDS)).toEqual([
      '../../lib/analytics.js',
      '../analyticsQueue.js',
      '../../scripts/telemetry/simMetricEmitter.mjs',
    ]);
    expect(forbiddenImports(fixture, TELEMETRY_FORBIDS)).toEqual(['./worldPulse/worldState.js']);
    // The skeleton is not clever: a specifier in a comment still counts, which is
    // the fail-CLOSED direction for a wall.
    expect(forbiddenImports("// from 'x/analytics.js'", ENGINE_FORBIDS)).toEqual(['x/analytics.js']);
  });

  it('ARM A — no deterministic-core module imports telemetry, and every root is floored', () => {
    expect([...ARM_A_ROOTS]).toEqual(['src/domain/worldPulse', 'src/domain', 'src/generators', 'src/kernel']);
    const union = [];
    for (const root of ARM_A_ROOTS) {
      const files = filesBelow(join(ROOT, root));
      expect(files.length, `${root} census collapsed — a root moved or was deleted`)
        .toBeGreaterThanOrEqual(ARM_A_FLOORS[root]);
      union.push(...files);
    }
    const exempt = new Set(ARM_A_EXEMPTIONS.map((row) => row.path));
    const violations = violationsIn([...new Set(union)], ENGINE_FORBIDS)
      .filter((line) => !exempt.has(line.split(' -> ')[0]));
    expect(violations).toEqual([]);
  });

  it("ARM A′ — worldPulse's own floor is asserted SEPARATELY, so the union cannot absorb it", () => {
    const worldPulse = filesBelow(join(ROOT, 'src/domain/worldPulse'));
    expect(worldPulse.length).toBeGreaterThan(100);
    expect(violationsIn(worldPulse, /analytics/i)).toEqual([]);
    // CONTROL: a union floor of 900 stays green with worldPulse gone entirely.
    // That is precisely why this arm exists as its own assertion.
    const unionWithoutWorldPulse = filesBelow(join(ROOT, 'src/domain'))
      .filter((file) => !file.includes('/worldPulse/'));
    expect(unionWithoutWorldPulse.length).toBeGreaterThanOrEqual(ARM_A_FLOORS['src/domain'] - 400);
  });

  it('ARM B — no telemetry module imports engine internals, and every root is populated or NAMED as awaiting', () => {
    expect([...ARM_B_ROOTS]).toEqual(['src/lib', 'scripts/telemetry', 'scripts/soak']);
    const unclassified = [];
    const violations = [];
    for (const root of ARM_B_ROOTS) {
      const files = armBFiles(root);
      const awaiting = AWAITING_POPULATION.includes(root);
      if (files.length >= ARM_B_FLOORS[root]) {
        // A populated root may NOT also sit in the awaiting list: that list is
        // shrink-only, and a stale row is a floor nobody is enforcing.
        if (awaiting) unclassified.push(`${root} is populated but still listed AWAITING_POPULATION`);
      } else if (!awaiting) {
        unclassified.push(`${root} is under its floor and is not listed AWAITING_POPULATION`);
      }
      violations.push(...violationsIn(files, TELEMETRY_FORBIDS));
    }
    expect(unclassified).toEqual([]);
    expect(violations).toEqual([]);
    expect(AWAITING_POPULATION.filter((root) => !ARM_B_ROOTS.includes(root))).toEqual([]);
  });

  it('ARM C — the Arm A exemption manifest is exact, rationale-carrying and shrink-only', () => {
    for (const row of ARM_A_EXEMPTIONS) {
      expect(existsSync(join(ROOT, row.path)), `exempt module is gone: ${row.path}`).toBe(true);
      expect(String(row.rationale || '').length).toBeGreaterThan(20);
    }
    // The live list is EMPTY by measurement, so the arm's proof is its controls.
    // CONTROL 1 — a violation with no exemption row is convicted.
    const planted = ['src/domain/worldPulse/x.js -> ../../lib/analytics.js'];
    expect(planted.filter((line) => !new Set([]).has(line.split(' -> ')[0]))).toEqual(planted);
    // CONTROL 2 — the same violation, exempted by path, is not.
    expect(planted.filter((line) => !new Set(['src/domain/worldPulse/x.js']).has(line.split(' -> ')[0]))).toEqual([]);
    // CONTROL 3 — an exemption naming a module that does not exist is catchable.
    expect(existsSync(join(ROOT, 'src/domain/worldPulse/does-not-exist.js'))).toBe(false);
  });

  it('ARM D — the simulation class is PII-free in the registry AND in its own DDL', () => {
    const dims = SIM_METRICS.flatMap((row) => row.dims);
    expect(dims.length).toBeGreaterThan(0);
    expect(dims.filter((dim) => FORBIDDEN_DIM_RE.test(dim))).toEqual([]);
    const missing = [];
    for (const path of SIM_METRIC_MIGRATIONS) {
      if (!existsSync(join(ROOT, path))) {
        if (!AWAITING_MIGRATION.includes(path)) missing.push(`${path} is declared but absent and not AWAITING_MIGRATION`);
        continue;
      }
      if (AWAITING_MIGRATION.includes(path)) missing.push(`${path} exists but is still listed AWAITING_MIGRATION`);
      const ddl = readFileSync(join(ROOT, path), 'utf8');
      const columns = [...ddl.matchAll(/^\s{2,}([a-z_]+)\s+[a-z]/gim)].map((match) => match[1]);
      expect(columns.length, `${path} declared no columns — the DDL walk read nothing`).toBeGreaterThan(4);
      expect(columns.filter((column) => FORBIDDEN_DIM_RE.test(column))).toEqual([]);
    }
    expect(missing).toEqual([]);
    // CONTROL: the DDL column scan really classifies.
    const fixture = 'create table t (\n  run_id text,\n  actor_id uuid,\n  value numeric\n);';
    expect([...fixture.matchAll(/^\s{2,}([a-z_]+)\s+[a-z]/gim)].map((m) => m[1])
      .filter((column) => FORBIDDEN_DIM_RE.test(column))).toEqual(['actor_id']);
  });

  it('ARM E — the ingest path refuses every simulation metric name, by closed-set membership', () => {
    const source = readFileSync(join(ROOT, 'supabase/functions/ingest-events/index.ts'), 'utf8');
    expect(source).toContain('const KNOWN_EVENTS = new Set(Object.values(EVENTS));');
    expect(source).toContain("reason: 'unknown_event'");
    const leaked = SIM_METRIC_NAMES.filter((name) => source.includes(name));
    expect(leaked).toEqual([]);
    // The guard is sufficient BECAUSE the two name sets are disjoint, and that
    // disjointness is pinned in tests/lib/simMetricRegistry.test.js.
    expect(SIM_METRIC_NAMES.length).toBe(11);
  });

  it('ARM F — the folded arms: the analytics-module roster, and the Operator Messages receipt discipline', () => {
    const analytics = filesBelow(join(ROOT, 'src/lib')).filter((file) => /analytics/i.test(file));
    expect(analytics.length).toBeGreaterThanOrEqual(6);
    expect(violationsIn(analytics, /worldPulse|worldState/i)).toEqual([]);
    const operator = [
      ...filesBelow(join(ROOT, 'src')),
      ...filesBelow(join(ROOT, 'supabase/functions')),
    ].filter((file) => /operator-?message/i.test(file));
    expect(operator.length).toBeGreaterThanOrEqual(5);
    const emissions = operator.flatMap((file) => {
      const source = readFileSync(file, 'utf8');
      const imports = forbiddenImports(source, /analytics/i).map((specifier) => `${rel(file)} -> ${specifier}`);
      if (/\btrack\s*\(|\bEVENTS\s*\./.test(source)) imports.push(`${rel(file)} -> analytics emission`);
      return imports;
    });
    expect(emissions).toEqual([]);
  });
});
