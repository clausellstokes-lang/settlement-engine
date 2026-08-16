/**
 * coveringArrayCoverage.test.js — SK-4's proof surface (sk-b; ODQ §143.2).
 *
 * ⛔⛔ SK.U4 ORDERS THE ARMS. The recorded compile-fixture hazard is a fixture whose
 * parameters make the defect unreachable: base ≡ cure, and a green meaningless pin. For
 * the EFFECTIVE-PAIR rule the defect is "a pair credited on a structurally dark key", so
 * the FIRST assertion below is the FIXTURE'S OWN SHAPE — that a row exists in which a key
 * reads ON and is not effective. Only then is any coverage number read.
 */

import { describe, expect, it } from 'vitest';

import {
  CONSTRAINT_KINDS,
  CONSTRAINT_MANIFEST,
  OWNER_GATED_ABSENT,
  darkControlRow,
  isEffective,
  manifestDefects,
  maximalLawfulRow,
  requiresGraph,
  varyingFactors,
} from '../../scripts/soak/flagConstraints.mjs';
import {
  MEASURED_ROWS_AT_MINT,
  STRENGTH,
  buildCoveringArray,
  effectivePairsIn,
  rowCountBand,
} from '../../scripts/soak/coveringArray.mjs';
import { flagDomainCensus } from '../../scripts/audit/soakRules.mjs';
import {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';
import {
  EFFECTIVE_ROW,
  FIXTURE_CENSUS,
  FIXTURE_MANIFEST,
  INEFFECTIVE_ROW,
} from '../fixtures/soakFlagRegistryFixture.js';

const liveCensus = () => flagDomainCensus({
  defaults: DEFAULT_SIMULATION_RULES,
  presets: SIMULATION_RULE_PRESETS,
  virtualKeys: ENGINE_GATED_VIRTUAL_RULE_KEYS,
});

describe('the covering array and its constraint manifest', () => {
  it('SK.U4 — the FIXTURE can execute its own defect, asserted before any coverage number', () => {
    const graph = requiresGraph(FIXTURE_MANIFEST);
    expect([...(graph.get('child') || [])]).toEqual(['parent']);
    // THE DISTINGUISHING CASE EXISTS: `child` reads ON and is NOT effective, because its
    // parent is off. Without this row the effective-pair rule has nothing to discriminate
    // and every arm below would pass for the wrong reason.
    expect(INEFFECTIVE_ROW.child).toBe(true);
    expect(isEffective(INEFFECTIVE_ROW, 'child', graph)).toBe(false);
    expect(isEffective(EFFECTIVE_ROW, 'child', graph)).toBe(true);
    // …and a key with no parents is effective exactly when it is on.
    expect(isEffective(INEFFECTIVE_ROW, 'loner', graph)).toBe(true);
    expect(isEffective({ loner: false }, 'loner', graph)).toBe(false);
  });

  it('a pair on a structurally dark key COVERS NOTHING, and the lawful row re-covers it', () => {
    const graph = requiresGraph(FIXTURE_MANIFEST);
    const factors = varyingFactors(FIXTURE_CENSUS, FIXTURE_MANIFEST);
    // The excluded key and the non-boolean key are both gone; the other three remain.
    expect(factors).toEqual(['parent', 'loner', 'child']);
    const ineffective = effectivePairsIn(INEFFECTIVE_ROW, factors, graph);
    const effective = effectivePairsIn(EFFECTIVE_ROW, factors, graph);
    // ⛔ THE RULE: `child=on` earns NO credit in the row where its parent is dark.
    expect([...ineffective].filter((pair) => pair.includes('child=on'))).toEqual([]);
    // The same assignment, made lawful, DOES earn it — so the rule discriminates rather
    // than simply never crediting the key.
    expect([...effective].filter((pair) => pair.includes('child=on')).sort())
      .toEqual(['loner=on|child=on', 'parent=on|child=on']);
    // The dark-parent row still credits everything that WAS effective in it.
    expect([...ineffective].sort()).toEqual(['parent=off|loner=on']);
  });

  it('the manifest is typed, sourced, rationale-carrying and SHRINK-GUARDED', () => {
    const census = liveCensus();
    expect(manifestDefects(census)).toEqual([]);
    for (const row of CONSTRAINT_MANIFEST) {
      expect(CONSTRAINT_KINDS).toContain(row.kind);
      expect(String(row.source).length).toBeGreaterThan(10);
      expect(String(row.rationale).length).toBeGreaterThan(20);
    }
    // The guard convicts a row whose key no longer exists — a constraint pointing at
    // nothing is the shape this arm exists to catch, and it caught one on its first run.
    const stale = [...CONSTRAINT_MANIFEST, {
      kind: 'requires', key: 'aFlagThatWasDeleted', parents: ['warLayerEnabled'],
      source: 'a stale row left behind by a deletion',
      rationale: 'this rationale is long enough to pass the length arm on its own',
    }];
    expect(manifestDefects(census, stale)).toEqual([
      'aFlagThatWasDeleted: named by a requires row but absent from the live flag census',
    ]);
    // ⭐ THE DECLARED ABSENCE. `neutralNeighborsEnabled` is OWNER-GATED and is not in the
    // census at all, so an exclusion row for it would point at nothing. It is recorded as
    // an absence with its own guard: if it ever ENTERS the census, that reds and somebody
    // decides deliberately instead of the flag drifting into the grid.
    expect(OWNER_GATED_ABSENT.map((row) => row.key)).toEqual(['neutralNeighborsEnabled']);
    expect(census.union.filter((key) => key === 'neutralNeighborsEnabled')).toEqual([]);
    expect(manifestDefects({ ...census, union: [...census.union, 'neutralNeighborsEnabled'] })).toEqual([
      'neutralNeighborsEnabled: declared ABSENT from the flag census but is now present — it must become a live exclusion row or a grid axis, deliberately',
    ]);
  });

  it('the flag domain is ENUMERATED FROM THE REGISTRY, and its arithmetic closes', () => {
    const census = liveCensus();
    // 25 normalizer-governed + 32 preset-declared-but-ungoverned + 22 engine-gated virtual.
    expect(census.governed.length).toBe(25);
    expect(census.ungoverned.length).toBe(32);
    expect(census.virtual.length).toBe(22);
    expect(census.overlap).toEqual([]);
    expect(census.union.length).toBe(79);
    expect(census.governed.length + census.ungoverned.length + census.virtual.length).toBe(census.union.length);
    // 54 of 79 sit outside the normalizer's fail-closed coercion — the measured content of
    // "the normalizer is NOT the oracle", and the reason the manifest had to be minted.
    expect(census.union.length - census.governed.length).toBe(54);
    expect(census.nonBoolean.length).toBe(13);
  });

  it('all-on is recast as the MAXIMAL-LAWFUL row, and all-off stays the dark control', () => {
    const census = liveCensus();
    const maximal = maximalLawfulRow(census);
    const dark = darkControlRow(census);
    const graph = requiresGraph();
    // Every varying key is on, and every one of them is EFFECTIVE — which is what
    // separates a maximal-lawful row from a literal all-on row over a space containing
    // derived and owner-gated keys.
    const notEffective = varyingFactors(census).filter((key) => !isEffective(maximal, key, graph));
    expect(notEffective).toEqual([]);
    // The excluded keys are absent from BOTH rows, not merely set false in them.
    for (const key of ['majorChangesRequireProposal', 'religionDynamicsEnabled', 'presetId', 'schemaVersion']) {
      expect(Object.prototype.hasOwnProperty.call(maximal, key), `${key} leaked into the maximal row`).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(dark, key), `${key} leaked into the dark control`).toBe(false);
    }
    expect(Object.values(dark).filter((value) => value !== false)).toEqual([]);
  });

  it('the array covers EVERY reachable pair, is deterministic, and refuses a thin one', () => {
    const census = liveCensus();
    const built = buildCoveringArray(census);
    expect(STRENGTH).toBe(2);
    expect(built.refusals).toEqual([]);
    // FULL coverage of the reachable target, not "most of it".
    expect(built.coverage.uncovered).toEqual([]);
    expect(built.coverage.coveredPairs).toBe(built.coverage.targetPairs);
    expect(built.coverage.targetPairs).toBeGreaterThan(10000);
    // Constraint-forbidden pairs are REPORTED, never counted as gaps — `child=on` forces
    // its ancestors on, so a pair asking for the parent off is not a miss.
    expect(built.coverage.constraintForbidden).toBeGreaterThan(0);
    // The row count is an OUTPUT inside a band, and the band was re-derived from this
    // measurement rather than inherited: the compile's [10,20] was for the unconstrained
    // space and would have refused the correct answer.
    const band = rowCountBand(built.factors.length);
    expect(built.coverage.rowCount).toBeGreaterThanOrEqual(band.min);
    expect(built.coverage.rowCount).toBeLessThanOrEqual(band.max);
    expect(MEASURED_ROWS_AT_MINT).toBeGreaterThan(20);
    // DETERMINISM: the same config yields the identical array, every time. No Math.random,
    // no host input — a grid that differs between two runs of one config is not a grid.
    expect(JSON.stringify(buildCoveringArray(census).rows)).toBe(JSON.stringify(built.rows));
    // Row 0 is the dark control and row 1 is maximal-lawful, by construction.
    expect(Object.values(built.rows[0]).filter((value) => value !== false)).toEqual([]);
    expect(Object.values(built.rows[1]).filter((value) => value !== true)).toEqual([]);
    // A THIN array is refused rather than silently reported — the arm that stops a 95%
    // construction from one day being quoted as pairwise.
    const thin = buildCoveringArray(census, { maxRows: 3 });
    expect(thin.refusals.length).toBeGreaterThan(0);
    expect(thin.refusals.join(' ')).toContain('uncovered');
  });
});
