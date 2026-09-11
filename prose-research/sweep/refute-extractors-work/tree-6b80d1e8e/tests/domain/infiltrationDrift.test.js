/**
 * infiltrationDrift.test.js — the battery for W-OPS car O5.
 *
 * ⭐⭐ THE DISCIPLINE. This car's deliverable is a PROPERTY — "no sequence of
 * depth-priced drifts erodes a person's authored core past the bound" — and a battery
 * that checked that property against its own algebra would prove the predicate
 * self-consistent while discovering nothing about whether the ENGINE obeys it. So the
 * bound is verified two ways that can disagree: the predicate's closed form, and a
 * simulation driven through the REAL `foldLivedExperience` and the REAL
 * `writeAxisDrift`, over hundreds of periods, at quanta on both sides of the cliff.
 * When those two agree to four decimals the property is about the engine.
 *
 * ⭐ AND THE CENSUS ARMS ARE DRIVEN FROM THE REAL VOCABULARIES:
 * `foreignGuestHold.FOREIGN_GUEST_HOLD_CLOSE_REASONS`, `livedExperienceCatalog`'s own
 * 31-kind table, `characterDrift`'s floor and clamp, `bandedStock.decayTowardNeutral`,
 * `infiltrationDepth.INFILTRATION_LEVELS`. If any of them moves, the row that leaned
 * on it REDS, which is the whole reason a census is written in code.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`: a loop-registered
 * suite is TEST_UNREGISTERED to the lighting census and its assertions are then
 * evidence nowhere, however green vitest reports it. ⚠ AND EVERY TITLE IS A SINGLE
 * ONE-LINE LITERAL: a title built with `+` is a BinaryExpression, which the census
 * credits as nothing while vitest runs it exactly like any other arm (car O4's
 * finding, ten blind arms in one file).
 *
 * @enforced-by this test
 */
import { describe, expect, test } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

import {
  ADMITTED_CUSTODY_EXITS,
  CUSTODY_EXITS,
  CUSTODY_PARK_CLASSES,
  DEPTH_EXPOSURE_BANDS,
  DEPTH_EXPOSURE_OF,
  DEPTH_EXPOSURE_WORDS,
  DEPTH_PRICING_LAW,
  EQUILIBRIUM_REGIMES,
  INFILTRATION_DRIFT_PROVENANCE,
  INFILTRATION_LEVELS_MIRROR,
  PARKED_CUSTODY_EXITS,
  PARKED_CUSTODY_EXIT_KINDS,
  PLAN_REFUSALS,
  UNBOUNDED_EXPOSURE_WORD,
  aggregateErosionBound,
  ambientEquilibrium,
  custodyExitQualification,
  depthBandOf,
  depthErosionLedger,
  depthExposurePlan,
  erosionCeiling,
  goingNativeVerdict,
  orderedHostVector,
  viceWardReachability,
} from '../../src/domain/worldPulse/espionage/infiltrationDrift.js';

import {
  INFILTRATION_LEVELS,
  INFILTRATION_LEVEL_NAMES,
} from '../../src/domain/worldPulse/espionage/infiltrationDepth.js';
import {
  MATERIALIZATION_EPSILON,
  MAX_AXIS_OFFSET,
  SPECTRUM_HALF_SPAN,
  axisOffsetOf,
  characterDriftOf,
  effectiveCharacter,
} from '../../src/domain/npc/characterDrift.js';
import {
  AMBIENT_CADENCE_TICKS,
  FUNNEL_TUNING,
  foldLivedExperience,
} from '../../src/domain/npc/livedExperienceFunnel.js';
import {
  LIVED_EXPERIENCE_KINDS,
  PARADIGM_AXIS_IDS,
  PULL_BANDS,
  experienceRowOf,
} from '../../src/domain/npc/livedExperienceCatalog.js';
import { collectLivedExperience } from '../../src/domain/npc/livedExperienceSources.js';
import { decayTowardNeutral } from '../../src/domain/worldPulse/bandedStock.js';
import {
  FOREIGN_GUEST_HOLD_CAUSES,
  FOREIGN_GUEST_HOLD_CLOSE_REASONS,
  FOREIGN_GUEST_HOLD_COVERT_CAUSE,
} from '../../src/domain/worldPulse/foreignGuestHold.js';
import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const LEAF = join(ROOT, 'src', 'domain', 'worldPulse', 'espionage', 'infiltrationDrift.js');
const LEAF_REL = 'src/domain/worldPulse/espionage/infiltrationDrift.js';
const LEAF_SOURCE = readFileSync(LEAF, 'utf8');

/** Source with block and line comments stripped, so a prose mention cannot pass for code. */
const LEAF_CODE = LEAF_SOURCE.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/**
 * Code with string literals blanked as well. The door MUST be named in the module —
 * that is how the flag car finds its address — so a scan that only stripped comments
 * would refuse the leaf for doing the very thing it is supposed to do. What must be
 * absent is a READ, and a read cannot hide inside a quoted string.
 */
const LEAF_LOGIC = LEAF_CODE.replace(/'(?:[^'\\]|\\.)*'/g, "''").replace(/`(?:[^`\\]|\\.)*`/g, '``');

/** Every binding the leaf declares in real code — the collection the injection arms scan. */
const LEAF_DECLARED = [...LEAF_CODE.matchAll(/(?:^|\s)(?:const|let|function)\s+([A-Za-z_][A-Za-z0-9_]*)/g)]
  .map((match) => match[1]);

/** The retention over one period, MEASURED through the estate's one decay shape. */
function retentionOver(periodTicks) {
  return decayTowardNeutral(1, 0, periodTicks, FUNNEL_TUNING.decayBand);
}

const CADENCE_RETENTION = retentionOver(AMBIENT_CADENCE_TICKS);
const TICK_RETENTION = retentionOver(1);

/**
 * Drive the REAL funnel: one ambient emission per period, at the given per-emission
 * span, for `periods` periods, and report where the offset comes to rest.
 */
function simulateRest({ spanTicks, periods, periodTicks = AMBIENT_CADENCE_TICKS, axes = ['MERCY'] }) {
  const npc = { id: 'npc_1', name: 'Ilva Rooke', role: 'clerk', character: { axes: {} } };
  let worldState = { simulationRules: { characterDriftEnabled: true, npcConsequencesEnabled: true } };
  for (let step = 1; step <= periods; step += 1) {
    const tick = step * periodTicks;
    const entries = [{
      kind: 'dwell_milieu',
      settlementId: 'set_a',
      settlementSeed: 'seed_a',
      npc,
      eventId: `dwell.host.m1.${tick}`,
      spanTicks,
      pulls: axes.map((axisId) => ({ axisId, pole: 'vice', band: 'faint' })),
    }];
    worldState = foldLivedExperience({ worldState, entries, tick }).worldState;
  }
  const map = characterDriftOf(worldState);
  const wnpcId = Object.keys(map)[0];
  return {
    worldState,
    npc,
    wnpcId: wnpcId || null,
    offsets: Object.fromEntries(axes.map((axisId) => [
      axisId, wnpcId ? Math.abs(axisOffsetOf(worldState, wnpcId, axisId)) : 0,
    ])),
  };
}

/** Every (kind, pull) row of the real experience table, with its reachability. */
function catalogPullRows() {
  const rows = [];
  for (const kind of LIVED_EXPERIENCE_KINDS) {
    const row = experienceRowOf(kind);
    for (const pull of row.pulls) {
      rows.push({ kind, axisId: pull.axisId, pole: pull.pole, reachable: !row.sourceUnverified });
    }
  }
  return rows;
}

/** Every .js file under src/, for the darkness census. */
function srcFiles(dir, out = []) {
  for (const name of readdirSync(dir).sort(compareCodepoint)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) srcFiles(full, out);
    else if (name.endsWith('.js') || name.endsWith('.jsx')) out.push(full);
  }
  return out;
}

const HOST_VECTOR = Object.freeze([
  Object.freeze({ axisId: 'CANDOR', pole: 'vice', band: 'faint' }),
  Object.freeze({ axisId: 'MERCY', pole: 'vice', band: 'heavy' }),
  Object.freeze({ axisId: 'TRUST', pole: 'vice', band: 'firm' }),
  Object.freeze({ axisId: 'CHEER', pole: 'vice', band: 'heavy' }),
  Object.freeze({ axisId: 'JUSTICE', pole: 'vice', band: 'firm' }),
]);

describe('the depth ladder is O3 rungs zipped with the pack words, never a second roster', () => {
  test('every ladder row names the rung the infiltration ladder already named, in level order', () => {
    expect(DEPTH_EXPOSURE_BANDS.map((row) => row.name)).toEqual([...INFILTRATION_LEVEL_NAMES]);
    expect(DEPTH_EXPOSURE_BANDS.map((row) => row.level)).toEqual(INFILTRATION_LEVELS.map((r) => r.level));
  });

  test('the mirrored rung roster reconciles against car O3 real ladder, name for name', () => {
    expect(INFILTRATION_LEVELS_MIRROR.map((row) => row.name)).toEqual(INFILTRATION_LEVELS.map((row) => row.name));
    expect(INFILTRATION_LEVELS_MIRROR.map((row) => row.level)).toEqual(INFILTRATION_LEVELS.map((row) => row.level));
    expect(INFILTRATION_LEVELS_MIRROR).toHaveLength(INFILTRATION_LEVELS.length);
  });

  test('the exposure words are the registers pack five, in the order the pack wrote them', () => {
    expect([...DEPTH_EXPOSURE_WORDS]).toEqual(['faint', 'light', 'full', 'deep', 'immersed']);
    expect(DEPTH_EXPOSURE_BANDS.map((row) => row.exposure)).toEqual([...DEPTH_EXPOSURE_WORDS]);
  });

  test('breadth is one host axis per rung, derived from the rung index and not authored', () => {
    expect(DEPTH_EXPOSURE_BANDS.map((row) => row.breadth)).toEqual([1, 2, 3, 4, 5]);
  });

  test('F11 bounds every rung short of immersed, and immersed alone carries bounded false', () => {
    expect(UNBOUNDED_EXPOSURE_WORD).toBe('immersed');
    expect(DEPTH_EXPOSURE_BANDS.filter((row) => !row.bounded).map((row) => row.name)).toEqual(['seated']);
    expect(DEPTH_EXPOSURE_BANDS.filter((row) => row.bounded)).toHaveLength(4);
  });

  test('a rung resolves by name or by level number, and an unknown depth resolves to null', () => {
    expect(depthBandOf('rooted').exposure).toBe('full');
    expect(depthBandOf(4).name).toBe('seated');
    expect(depthBandOf('immersed')).toBeNull();
    expect(depthBandOf('')).toBeNull();
    expect(depthBandOf(9)).toBeNull();
  });

  test('the exposure lookup is total over the rung names the infiltration ladder carries', () => {
    for (const name of INFILTRATION_LEVEL_NAMES) expect(typeof DEPTH_EXPOSURE_OF[name]).toBe('string');
    expect(Object.keys(DEPTH_EXPOSURE_OF)).toHaveLength(INFILTRATION_LEVELS.length);
  });
});

describe('the erosion bound is a two-regime step function, and the ceiling is epsilon over retention', () => {
  test('the ceiling reproduces the registers pack figure for a source emitting once a season', () => {
    const ceiling = erosionCeiling({ epsilon: MATERIALIZATION_EPSILON, retention: CADENCE_RETENTION });
    expect(ceiling).toBeCloseTo(0.2648657735898238, 12);
    expect((ceiling / MATERIALIZATION_EPSILON) - 1).toBeCloseTo(0.0594630943, 8);
  });

  test('a source emitting every tick has under half a percent of headroom, not six', () => {
    const ceiling = erosionCeiling({ epsilon: MATERIALIZATION_EPSILON, retention: TICK_RETENTION });
    expect(ceiling).toBeCloseTo(0.25111328425856194, 12);
    expect((ceiling / MATERIALIZATION_EPSILON) - 1).toBeLessThan(0.005);
  });

  test('a quantum at the floor rests at the floor whatever the half-life band is signed to', () => {
    for (const band of ['a_season', 'a_year', 'a_few_years', 'a_decade', 'a_generation']) {
      const retention = decayTowardNeutral(1, 0, AMBIENT_CADENCE_TICKS, band);
      const read = ambientEquilibrium({ quantum: MATERIALIZATION_EPSILON, epsilon: MATERIALIZATION_EPSILON, retention });
      expect(read.regime).toBe('floor_reset');
      expect(read.equilibrium).toBe(MATERIALIZATION_EPSILON);
    }
  });

  test('one step over the ceiling leaves the floor-reset regime for the linear one', () => {
    const ceiling = erosionCeiling({ epsilon: MATERIALIZATION_EPSILON, retention: CADENCE_RETENTION });
    const under = ambientEquilibrium({ quantum: ceiling * 0.999, epsilon: MATERIALIZATION_EPSILON, retention: CADENCE_RETENTION });
    const over = ambientEquilibrium({ quantum: ceiling * 1.001, epsilon: MATERIALIZATION_EPSILON, retention: CADENCE_RETENTION });
    expect(under.regime).toBe('floor_reset');
    expect(over.regime).toBe('linear');
    expect(under.equilibrium).toBeLessThan(0.27);
    expect(over.equilibrium).toBeGreaterThan(4.5);
  });

  test('there is no quantum whose rest point lands between one band and the ceiling', () => {
    const gap = [];
    for (let step = 0; step <= 4000; step += 1) {
      const quantum = (step / 4000) * 0.6;
      const read = ambientEquilibrium({ quantum, epsilon: MATERIALIZATION_EPSILON, retention: CADENCE_RETENTION });
      if (read.equilibrium > 0.27 && read.equilibrium < 1) gap.push(quantum);
    }
    expect(gap).toEqual([]);
  });

  test('the two regime words are the only two, and both are reachable from real inputs', () => {
    expect([...EQUILIBRIUM_REGIMES]).toEqual(['floor_reset', 'linear']);
    const seen = new Set([
      ambientEquilibrium({ quantum: 0.25, epsilon: MATERIALIZATION_EPSILON, retention: CADENCE_RETENTION }).regime,
      ambientEquilibrium({ quantum: 0.5, epsilon: MATERIALIZATION_EPSILON, retention: CADENCE_RETENTION }).regime,
    ]);
    expect([...seen].sort(compareCodepoint)).toEqual(['floor_reset', 'linear']);
  });
});

describe('the predicate is verified against the real funnel, not against its own algebra', () => {
  test('a floor quantum emitted every season rests exactly where the predicate says it does', () => {
    const predicted = ambientEquilibrium({
      quantum: MATERIALIZATION_EPSILON, epsilon: MATERIALIZATION_EPSILON, retention: CADENCE_RETENTION,
    });
    const measured = simulateRest({ spanTicks: AMBIENT_CADENCE_TICKS, periods: 300 });
    expect(predicted.equilibrium).toBe(MATERIALIZATION_EPSILON);
    expect(measured.offsets.MERCY).toBeCloseTo(predicted.equilibrium, 4);
  });

  test('a quantum one week over the cadence rests where the linear fixed point says it does', () => {
    const quantum = MATERIALIZATION_EPSILON * (14 / AMBIENT_CADENCE_TICKS);
    const predicted = ambientEquilibrium({
      quantum, epsilon: MATERIALIZATION_EPSILON, retention: CADENCE_RETENTION,
    });
    const measured = simulateRest({ spanTicks: 14, periods: 600 });
    expect(predicted.regime).toBe('linear');
    expect(measured.offsets.MERCY).toBeCloseTo(predicted.equilibrium, 2);
  });

  test('a quantum twice the floor runs to the clamp the funnel actually enforces', () => {
    const predicted = ambientEquilibrium({
      quantum: 2 * MATERIALIZATION_EPSILON, epsilon: MATERIALIZATION_EPSILON, retention: CADENCE_RETENTION,
    });
    const measured = simulateRest({ spanTicks: 2 * AMBIENT_CADENCE_TICKS, periods: 400 });
    expect(predicted.equilibrium).toBeGreaterThan(MAX_AXIS_OFFSET);
    expect(measured.offsets.MERCY).toBe(MAX_AXIS_OFFSET);
  });

  test('the same floor quantum emitted every tick still rests at the floor, cadence-invariantly', () => {
    const measured = simulateRest({ spanTicks: AMBIENT_CADENCE_TICKS, periods: 400, periodTicks: 1 });
    expect(measured.offsets.MERCY).toBe(MATERIALIZATION_EPSILON);
  });

  test('breadth moves the aggregate and never moves any single axis off the floor', () => {
    const axes = ['CANDOR', 'CHEER', 'MERCY', 'TRUST'];
    const measured = simulateRest({ spanTicks: AMBIENT_CADENCE_TICKS, periods: 300, axes });
    for (const axisId of axes) expect(measured.offsets[axisId]).toBe(MATERIALIZATION_EPSILON);
    const total = axes.reduce((sum, axisId) => sum + measured.offsets[axisId], 0);
    expect(total).toBeCloseTo(axes.length * MATERIALIZATION_EPSILON, 10);
  });

  test('a soul held at the floor on one axis still reads as its authored core banded', () => {
    const measured = simulateRest({ spanTicks: AMBIENT_CADENCE_TICKS, periods: 300 });
    const entry = characterDriftOf(measured.worldState)[measured.wnpcId];
    const chart = effectiveCharacter(measured.npc, entry);
    expect(chart.axes.MERCY).toBeUndefined();
  });
});

describe('the aggregate bound holds at every rung under the derived tuning, and only just', () => {
  test('the whole ladder holds when the per-axis quantum is exactly one floor quantum', () => {
    const ledger = depthErosionLedger({
      quantumPerAxis: MATERIALIZATION_EPSILON,
      epsilon: MATERIALIZATION_EPSILON,
      retention: CADENCE_RETENTION,
      clamp: MAX_AXIS_OFFSET,
    });
    expect(ledger).toHaveLength(INFILTRATION_LEVELS.length);
    for (const row of ledger) {
      expect(row.holds).toBe(true);
      expect(row.worst).toBe(MATERIALIZATION_EPSILON);
      expect(row.aggregate).toBeCloseTo(row.breadth * MATERIALIZATION_EPSILON, 10);
    }
  });

  test('the aggregate grows linearly in breadth, which is what makes breadth signable', () => {
    const ledger = depthErosionLedger({
      quantumPerAxis: MATERIALIZATION_EPSILON,
      epsilon: MATERIALIZATION_EPSILON,
      retention: CADENCE_RETENTION,
      clamp: MAX_AXIS_OFFSET,
    });
    const deltas = ledger.slice(1).map((row, index) => row.aggregate - ledger[index].aggregate);
    for (const delta of deltas) expect(delta).toBeCloseTo(MATERIALIZATION_EPSILON, 10);
  });

  test('a six percent depth multiplier is the last one that holds at seasonal cadence', () => {
    const ok = depthErosionLedger({
      quantumPerAxis: MATERIALIZATION_EPSILON * 1.059,
      epsilon: MATERIALIZATION_EPSILON,
      retention: CADENCE_RETENTION,
      clamp: MAX_AXIS_OFFSET,
    });
    const bad = depthErosionLedger({
      quantumPerAxis: MATERIALIZATION_EPSILON * 1.06,
      epsilon: MATERIALIZATION_EPSILON,
      retention: CADENCE_RETENTION,
      clamp: MAX_AXIS_OFFSET,
    });
    expect(ok.every((row) => row.holds)).toBe(true);
    expect(bad.every((row) => row.holds === false)).toBe(true);
    expect(bad[0].worst).toBeGreaterThan(4);
  });

  test('at per-tick cadence the last multiplier that holds is under one half of one percent', () => {
    const ok = depthErosionLedger({
      quantumPerAxis: MATERIALIZATION_EPSILON * 1.0044,
      epsilon: MATERIALIZATION_EPSILON,
      retention: TICK_RETENTION,
      clamp: MAX_AXIS_OFFSET,
    });
    const bad = depthErosionLedger({
      quantumPerAxis: MATERIALIZATION_EPSILON * 1.0045,
      epsilon: MATERIALIZATION_EPSILON,
      retention: TICK_RETENTION,
      clamp: MAX_AXIS_OFFSET,
    });
    expect(ok.every((row) => row.holds)).toBe(true);
    expect(bad.every((row) => row.worst === MAX_AXIS_OFFSET)).toBe(true);
  });

  test('the aggregate read sums across source families per axis, which a per-term read cannot', () => {
    const oneFamily = aggregateErosionBound({
      perAxisQuanta: { MERCY: MATERIALIZATION_EPSILON },
      epsilon: MATERIALIZATION_EPSILON,
      retention: CADENCE_RETENTION,
      clamp: MAX_AXIS_OFFSET,
    });
    const twoFamilies = aggregateErosionBound({
      perAxisQuanta: { MERCY: 2 * MATERIALIZATION_EPSILON },
      epsilon: MATERIALIZATION_EPSILON,
      retention: CADENCE_RETENTION,
      clamp: MAX_AXIS_OFFSET,
    });
    expect(oneFamily.holds).toBe(true);
    expect(twoFamilies.holds).toBe(false);
    expect(twoFamilies.clampBinds).toBe(true);
    expect(twoFamilies.violations).toEqual(['MERCY']);
  });

  test('the clamp is reported as part of the answer rather than as a separate consolation', () => {
    const read = aggregateErosionBound({
      perAxisQuanta: { MERCY: 1 },
      epsilon: MATERIALIZATION_EPSILON,
      retention: CADENCE_RETENTION,
      clamp: MAX_AXIS_OFFSET,
    });
    expect(read.perAxis[0].equilibrium).toBe(MAX_AXIS_OFFSET);
    expect(read.clampBinds).toBe(true);
    expect(read.holds).toBe(false);
  });

  test('a chart resting at the clamp reads as the spectrum extreme and hides its true size', () => {
    const read = aggregateErosionBound({
      perAxisQuanta: { MERCY: 1 },
      epsilon: MATERIALIZATION_EPSILON,
      retention: CADENCE_RETENTION,
      clamp: MAX_AXIS_OFFSET,
    });
    expect(read.worst).toBe(MAX_AXIS_OFFSET);
    expect(SPECTRUM_HALF_SPAN).toBeLessThan(MAX_AXIS_OFFSET);
  });

  test('an empty chart has an empty aggregate rather than a guessed one', () => {
    const read = aggregateErosionBound({
      perAxisQuanta: {}, epsilon: MATERIALIZATION_EPSILON, retention: CADENCE_RETENTION, clamp: MAX_AXIS_OFFSET,
    });
    expect(read.holds).toBe(true);
    expect(read.aggregate).toBe(0);
    expect(read.worstAxis).toBe('');
  });
});

describe('the plan prices depth as breadth and hands the funnel one period at a time', () => {
  test('each rung takes a strictly wider prefix of the host chart than the rung below it', () => {
    const widths = DEPTH_EXPOSURE_BANDS.map((row) => depthExposurePlan({
      level: row.name,
      dwellTicks: 5 * AMBIENT_CADENCE_TICKS,
      cadenceTicks: AMBIENT_CADENCE_TICKS,
      hostVector: HOST_VECTOR,
      bandLadder: PULL_BANDS,
    }).pulls.length);
    expect(widths).toEqual([1, 2, 3, 4, 5]);
  });

  test('the band words on the host pulls are passed through the plan untouched', () => {
    const plan = depthExposurePlan({
      level: 'seated',
      dwellTicks: 5 * AMBIENT_CADENCE_TICKS,
      cadenceTicks: AMBIENT_CADENCE_TICKS,
      hostVector: HOST_VECTOR,
      bandLadder: PULL_BANDS,
    });
    expect(plan.pulls.map((pull) => pull.band).sort(compareCodepoint))
      .toEqual(HOST_VECTOR.map((pull) => pull.band).sort(compareCodepoint));
  });

  test('the span is one whole period whatever the dwell, never the cumulative stay', () => {
    for (const dwell of [13, 26, 39, 520]) {
      const plan = depthExposurePlan({
        level: 'seated',
        dwellTicks: dwell,
        cadenceTicks: AMBIENT_CADENCE_TICKS,
        hostVector: HOST_VECTOR,
        bandLadder: PULL_BANDS,
      });
      expect(plan.spanTicks).toBe(AMBIENT_CADENCE_TICKS);
      expect(plan.cadences).toBe(Math.floor(dwell / AMBIENT_CADENCE_TICKS));
    }
  });

  test('the prefix is taken in a pinned total order, so vector arrival order cannot change it', () => {
    const forwards = depthExposurePlan({
      level: 'observer',
      dwellTicks: AMBIENT_CADENCE_TICKS,
      cadenceTicks: AMBIENT_CADENCE_TICKS,
      hostVector: HOST_VECTOR,
      bandLadder: PULL_BANDS,
    });
    const backwards = depthExposurePlan({
      level: 'observer',
      dwellTicks: AMBIENT_CADENCE_TICKS,
      cadenceTicks: AMBIENT_CADENCE_TICKS,
      hostVector: [...HOST_VECTOR].reverse(),
      bandLadder: PULL_BANDS,
    });
    expect(forwards.pulls).toEqual(backwards.pulls);
    expect(forwards.pulls.map((pull) => pull.axisId)).toEqual(['CHEER', 'MERCY']);
  });

  test('the ordering is strongest band first and then axis id, both keys exercised', () => {
    const ordered = orderedHostVector(HOST_VECTOR, PULL_BANDS);
    expect(ordered.map((pull) => pull.axisId)).toEqual(['CHEER', 'MERCY', 'JUSTICE', 'TRUST', 'CANDOR']);
  });

  test('a rung reaching further than the host chart reports what it got, not what it wanted', () => {
    const plan = depthExposurePlan({
      level: 'seated',
      dwellTicks: AMBIENT_CADENCE_TICKS,
      cadenceTicks: AMBIENT_CADENCE_TICKS,
      hostVector: HOST_VECTOR.slice(0, 2),
      bandLadder: PULL_BANDS,
    });
    expect(plan.breadth).toBe(5);
    expect(plan.exposed).toBe(2);
    expect(plan.pulls).toHaveLength(2);
  });

  test('a partial period emits nothing at all rather than a pull the funnel would refuse', () => {
    const plan = depthExposurePlan({
      level: 'rooted',
      dwellTicks: AMBIENT_CADENCE_TICKS - 1,
      cadenceTicks: AMBIENT_CADENCE_TICKS,
      hostVector: HOST_VECTOR,
      bandLadder: PULL_BANDS,
    });
    expect(plan.emit).toBe(false);
    expect(plan.refusal).toBe('short_of_cadence');
    expect(plan.pulls).toHaveLength(0);
  });

  test('every refusal word the plan can return is a member of the closed vocabulary', () => {
    const seen = [
      depthExposurePlan({ level: 'nowhere' }).refusal,
      depthExposurePlan({ level: 'rooted', dwellTicks: 99, cadenceTicks: AMBIENT_CADENCE_TICKS, hostVector: [], bandLadder: PULL_BANDS }).refusal,
      depthExposurePlan({ level: 'rooted', dwellTicks: 1, cadenceTicks: AMBIENT_CADENCE_TICKS, hostVector: HOST_VECTOR, bandLadder: PULL_BANDS }).refusal,
      depthExposurePlan({ level: 'rooted', dwellTicks: 99, cadenceTicks: 0, hostVector: HOST_VECTOR, bandLadder: PULL_BANDS }).refusal,
    ];
    expect(seen).toEqual(['unknown_level', 'no_host_vector', 'short_of_cadence', 'sub_floor_span']);
    for (const word of seen) expect(PLAN_REFUSALS).toContain(word);
  });

  test('a plan emitted every tick for a year still leaves every axis resting on the floor', () => {
    const plan = depthExposurePlan({
      level: 'seated',
      dwellTicks: 52,
      cadenceTicks: AMBIENT_CADENCE_TICKS,
      hostVector: HOST_VECTOR,
      bandLadder: PULL_BANDS,
    });
    const axes = plan.pulls.map((pull) => pull.axisId);
    const measured = simulateRest({ spanTicks: plan.spanTicks, periods: 260, periodTicks: 1, axes });
    for (const axisId of axes) expect(measured.offsets[axisId]).toBe(MATERIALIZATION_EPSILON);
  });
});

describe('going native has no road, and the property is what proves it', () => {
  test('FIDELITY carries no reachable vice-ward pull anywhere in the real experience table', () => {
    const reach = viceWardReachability(catalogPullRows(), PARADIGM_AXIS_IDS);
    expect(reach.byAxis.FIDELITY.viceReachable).toBe(0);
    expect(reach.byAxis.FIDELITY.vice).toBe(1);
    expect(reach.unreachableAxes).toContain('FIDELITY');
  });

  test('eight of the seventeen catalog axes cannot be darkened by any reachable source', () => {
    const reach = viceWardReachability(catalogPullRows(), PARADIGM_AXIS_IDS);
    expect(PARADIGM_AXIS_IDS).toHaveLength(17);
    expect(reach.unreachableAxes).toHaveLength(8);
    expect([...reach.unreachableAxes]).toEqual([
      'COURAGE', 'FIDELITY', 'FORBEARANCE', 'GENEROSITY', 'INDUSTRY', 'PROTECTION', 'PRUDENCE', 'TEMPER',
    ]);
  });

  test('three axes carry no pull of either sign, so nothing in a life touches them at all', () => {
    const reach = viceWardReachability(catalogPullRows(), PARADIGM_AXIS_IDS);
    expect([...reach.silentAxes]).toEqual(['INDUSTRY', 'PROTECTION', 'TEMPER']);
  });

  test('the going-native verdict on FIDELITY is no road, and it is not merely out of reach', () => {
    const reach = viceWardReachability(catalogPullRows(), PARADIGM_AXIS_IDS);
    const verdict = goingNativeVerdict({
      axisId: 'FIDELITY', reachability: reach, corePosition: 2, ambientBound: MATERIALIZATION_EPSILON,
    });
    expect(verdict.verdict).toBe('no_road');
    expect(verdict.hasRoad).toBe(false);
  });

  test('an axis that does have a road is still event only, because ambient rests at a quarter band', () => {
    const reach = viceWardReachability(catalogPullRows(), PARADIGM_AXIS_IDS);
    const verdict = goingNativeVerdict({
      axisId: 'MERCY', reachability: reach, corePosition: 1, ambientBound: MATERIALIZATION_EPSILON,
    });
    expect(verdict.hasRoad).toBe(true);
    expect(verdict.verdict).toBe('event_only');
  });

  test('a neutral core is the one case ambient pull can move off its own pole', () => {
    const reach = viceWardReachability(catalogPullRows(), PARADIGM_AXIS_IDS);
    const verdict = goingNativeVerdict({
      axisId: 'MERCY', reachability: reach, corePosition: 0, ambientBound: MATERIALIZATION_EPSILON,
    });
    expect(verdict.ambientCrosses).toBe(true);
    expect(verdict.verdict).toBe('reachable');
  });

  test('the reachability read counts only rows whose axis the catalog roster actually carries', () => {
    const reach = viceWardReachability(
      [{ axisId: 'NOT_AN_AXIS', pole: 'vice', reachable: true }], PARADIGM_AXIS_IDS,
    );
    expect(Object.keys(reach.byAxis)).toHaveLength(PARADIGM_AXIS_IDS.length);
    expect(reach.unreachableAxes).toHaveLength(PARADIGM_AXIS_IDS.length);
  });
});

describe('the custody exit census, against the vocabularies that actually close a hold', () => {
  test('the persisted close vocabulary is four words and the charter names only one of them', () => {
    expect([...FOREIGN_GUEST_HOLD_CLOSE_REASONS]).toEqual(['release', 'escape', 'death', 'pardon']);
    const charterExits = ['extraction', 'burn', 'root_permanently', 'ride_the_r4_arc', 'ransom', 'pardon', 'confession'];
    const shared = FOREIGN_GUEST_HOLD_CLOSE_REASONS.filter((reason) => charterExits.includes(reason));
    expect(shared).toEqual(['pardon']);
  });

  test('every admitted exit names a close reason the persisted vocabulary really carries', () => {
    for (const row of CUSTODY_EXITS) {
      expect(FOREIGN_GUEST_HOLD_CLOSE_REASONS).toContain(String(row.closeReason));
    }
    expect(CUSTODY_EXITS).toHaveLength(2);
  });

  test('both admitted exits are closed by a human act, and the rows say so in a field', () => {
    for (const row of CUSTODY_EXITS) expect(row.writerIsHumanAct).toBe(true);
  });

  test('the covert hold cause is the fifth of five, and it opens rather than closes', () => {
    expect(FOREIGN_GUEST_HOLD_CAUSES).toHaveLength(5);
    expect(FOREIGN_GUEST_HOLD_COVERT_CAUSE).toBe('caught_spying');
    expectAbsentWithAnchor(
      FOREIGN_GUEST_HOLD_CLOSE_REASONS,
      FOREIGN_GUEST_HOLD_COVERT_CAUSE,
      'pardon',
      'the covert cause opens a hold and is not a way out of one',
    );
  });

  test('five exits are parked and every park class in the roster is used by a real row', () => {
    expect(PARKED_CUSTODY_EXITS).toHaveLength(5);
    const used = [...new Set(PARKED_CUSTODY_EXITS.map((row) => String(row.parkClass)))].sort(compareCodepoint);
    expect(used).toEqual([...CUSTODY_PARK_CLASSES].sort(compareCodepoint));
  });

  test('every parked row carries its evidence and the one act that would unblock it', () => {
    for (const row of PARKED_CUSTODY_EXITS) {
      expect(CUSTODY_PARK_CLASSES).toContain(String(row.parkClass));
      expect(String(row.evidence).length).toBeGreaterThan(80);
      expect(String(row.unblockingAct).length).toBeGreaterThan(20);
    }
  });

  test('root permanently is parked as an unreachable quantity, not as a missing family', () => {
    const row = PARKED_CUSTODY_EXITS.find((entry) => entry.kind === 'root_permanently');
    expect(row.parkClass).toBe('unreachable_quantity');
    const reach = viceWardReachability(catalogPullRows(), PARADIGM_AXIS_IDS);
    expect(reach.byAxis.FIDELITY.viceReachable).toBe(0);
  });

  test('ransom is the one park with a dated road rather than a ruling owed', () => {
    const row = PARKED_CUSTODY_EXITS.find((entry) => entry.kind === 'ransom');
    expect(row.parkClass).toBe('road_unbuilt');
  });

  test('the admitted and parked rosters are disjoint and the qualification test is total', () => {
    for (const kind of ADMITTED_CUSTODY_EXITS) {
      expectAbsentWithAnchor(
        PARKED_CUSTODY_EXIT_KINDS, kind, 'ransom',
        'an admitted exit may never also appear on the parked roster',
      );
    }
    for (const kind of [...ADMITTED_CUSTODY_EXITS, ...PARKED_CUSTODY_EXIT_KINDS]) {
      expect(custodyExitQualification(kind)).not.toBeNull();
    }
  });

  test('an exit this file has never heard of resolves to no verdict rather than to a guess', () => {
    expect(custodyExitQualification('walked_out')).toBeNull();
    expect(custodyExitQualification('')).toBeNull();
    expect(custodyExitQualification(undefined)).toBeNull();
  });
});

describe('the leaf is dark, injected, and has no opinion of its own about the drift machinery', () => {
  test('no module under src imports this leaf, and the census is executed over the tree', () => {
    const importers = srcFiles(join(ROOT, 'src'))
      .filter((file) => relative(ROOT, file) !== LEAF_REL)
      .filter((file) => /infiltrationDrift/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(ROOT, file));
    expect(importers).toEqual([]);
  });

  test('the leaf imports nothing at all, so no sibling darkness arm can be reddened by it', () => {
    const imports = [...LEAF_SOURCE.matchAll(/^import\s[^;]*?from\s+'([^']+)'/gm)].map((match) => match[1]);
    expect(imports).toEqual([]);
  });

  test('the leaf declares no floor, no clamp and no decay band of its own', () => {
    expectAbsentWithAnchor(
      LEAF_DECLARED, 'MATERIALIZATION_EPSILON', 'DEPTH_EXPOSURE_WORDS',
      'the materialization floor is car L2 constant and reaches this leaf as an argument',
    );
    expectAbsentWithAnchor(
      LEAF_DECLARED, 'MAX_AXIS_OFFSET', 'DEPTH_EXPOSURE_BANDS',
      'the per-axis clamp is car L2 constant and reaches this leaf as an argument',
    );
    expectAbsentWithAnchor(
      LEAF_DECLARED, 'AMBIENT_CADENCE_TICKS', 'DEPTH_PRICING_LAW',
      'the ambient cadence is car L3 constant and reaches this leaf as an argument',
    );
    expectAbsentWithAnchor(
      LEAF_LOGIC, 'decayBand', 'DEPTH_PRICING_LAW',
      'the half-life band is car L3 choice and this leaf never names one',
    );
  });

  test('the leaf opens no transcendental site, so the same seed replays the same on any engine', () => {
    for (const banned of ['Math.pow', 'Math.exp', 'Math.log', 'Math.sin', 'Math.cos', 'Math.atan']) {
      expectAbsentWithAnchor(
        LEAF_LOGIC, banned, 'Math.floor',
        'the transcendental ratchet refuses new engine-dependent last bits in src/domain',
      );
    }
    expectAbsentWithAnchor(
      LEAF_LOGIC, '**', 'Math.min',
      'the exponent operator is a transcendental site under the same ratchet',
    );
  });

  test('the leaf reaches no world state, no clock, no randomness and no store', () => {
    for (const banned of ['worldState', 'Math.random', 'Date.', 'simulationRules']) {
      expectAbsentWithAnchor(
        LEAF_LOGIC, banned, 'retention',
        'every quantity this leaf needs arrives as an argument, never as a reach',
      );
    }
  });

  test('no flag is minted here, and the door is named so the flag car has an address', () => {
    expect(INFILTRATION_DRIFT_PROVENANCE.door).toMatch(/infiltrationDepthEnabled/);
    // THE GATE READ IS THE HAZARD, NOT STRICT EQUALITY. A bare `=== true` on a plain
    // boolean field is ordinary care; what must be absent is a read of any virtual
    // flag by name, which is what would light this leaf without its register row.
    // The door is NAMED in a string and that is required, so the scan runs over code
    // with string literals blanked — otherwise the arm would refuse the address.
    expect(LEAF_CODE).toMatch(/infiltrationDepthEnabled/);
    expectAbsentWithAnchor(
      LEAF_LOGIC, 'Enabled', 'INFILTRATION_DRIFT_PROVENANCE',
      'the door is named in a string and never read in code',
    );
    expect(INFILTRATION_DRIFT_PROVENANCE.consumers).toMatch(/NONE/);
  });

  test('the magic gate cannot be grazed because no term here touches a magic quantity', () => {
    const lowered = LEAF_SOURCE.toLowerCase();
    // ⚠ `mana` IS NOT ON THIS LIST AND THAT IS DELIBERATE. It is a substring of
    // `writerIsHumanAct` (huMAN Act), so banning it guards the LIST rather than the
    // PROPERTY — the estate's own substring-ban class, caught here by the arm reddening
    // on an honest field name. A banned token must be long enough to be a word.
    for (const banned of ['magic', 'arcane', 'sorcer', 'thaumat']) {
      expectAbsentWithAnchor(
        lowered, banned, 'exposure',
        'the one magic gate cannot be grazed by a term this leaf does not carry',
      );
    }
  });

  test('nothing in the pricing ladder is signed, and the provenance says so out loud', () => {
    expect(DEPTH_PRICING_LAW.signedBy).toBeNull();
    expect(INFILTRATION_DRIFT_PROVENANCE.signedBy).toBeNull();
    expect(INFILTRATION_DRIFT_PROVENANCE.status).toMatch(/OWNER-UNSIGNED/);
    expect(INFILTRATION_DRIFT_PROVENANCE.ownerRows.length).toBeGreaterThanOrEqual(4);
  });

  // ⛔⛔ THE GUARD FOR A CLASS THAT HAS ALREADY BITTEN THREE SIBLING CARS. Two arms in
  // the W-LIVES family scan every file under src/ for the RAW substring of their own
  // leaf names with NO comment stripping, so a car that merely CITES one of those
  // leaves reds a dormancy claim it never touched; two others strip comments first,
  // per car L5's ruling that a citation is not a dependency. Measured at this car's
  // base, three W-OPS leaves already red one of them and no receipt records it. This
  // leaf therefore cites the W-LIVES leaves BY DESCRIPTION, and this arm is what stops
  // a later editor restoring the filenames and taking a sibling's green with them.
  test('the leaf names no W-LIVES leaf in raw source and no W-LIVES writer in code', () => {
    for (const banned of ['livedExperience', 'characterDrift']) {
      expectAbsentWithAnchor(
        LEAF_SOURCE, banned, 'W-LIVES',
        'the two un-amended closure arms scan raw source, so even a comment costs a sibling',
      );
    }
    // ⚠ LEAF_CODE, NOT LEAF_LOGIC, AND THE DIFFERENCE IS THE WHOLE ARM. The sibling
    // arms strip comments and leave STRING LITERALS standing, so a writer named in a
    // provenance string reds them exactly as a read would. This car learned that twice
    // in one sitting — a `door:` string and a park row both convicted it — so the scan
    // here matches what those arms actually do rather than what a read would be.
    for (const banned of ['knownCharacter', 'effectiveCharacter', 'characterAsSeenBy', 'applyAxisDrift', 'writeAxisDrift']) {
      expectAbsentWithAnchor(
        LEAF_CODE, banned, 'DEPTH_PRICING_LAW',
        'the comment-stripping closure arms leave strings standing, so a named writer costs a green',
      );
    }
  });

  test('the leaf spells codepoint order the same way the estate does', () => {
    const words = ['b', 'A', 'a', 'B', 'Z_a', 'Z'];
    const mine = [...words].sort((a, b) => (a < b ? -1 : (a > b ? 1 : 0)));
    expect(mine).toEqual([...words].sort(compareCodepoint));
  });
});

describe('a watch on the landed milieu adapter, whose cumulative span is what the plan replaces', () => {
  // ⚠ THIS ARM IS A WATCH, NOT A GATE. It pins a measured property of car L4's
  // `milieuEntries` — that it emits EVERY TICK with a span that grows with the length
  // of the stay — because that is the shape car O5's plan exists to replace. If it
  // ever REDS, the adapter was cured: read finding O5-A in the O5 receipt before
  // deleting the arm, and re-measure the bound rather than assuming it improved.
  test('a hostage under the real adapter reaches the clamp on the host axis within a year', () => {
    const npc = {
      id: 'npc_1',
      name: 'Ilva Rooke',
      role: 'clerk',
      character: { axes: {} },
      whereabouts: { state: 'hostage', placeId: 'set_host', sinceTick: 0, missionId: 'm1' },
    };
    let worldState = { simulationRules: { characterDriftEnabled: true, npcConsequencesEnabled: true } };
    for (let tick = 1; tick <= 52; tick += 1) {
      const entries = collectLivedExperience({
        tick,
        worldState,
        homes: [{ placeId: 'set_a', placeSeed: 'seed_a', cast: [npc], patronRef: '' }],
        milieuVectorOf: () => [{ axisId: 'MERCY', pole: 'vice', band: 'faint' }],
      });
      worldState = foldLivedExperience({ worldState, entries, tick }).worldState;
    }
    const wnpcId = Object.keys(characterDriftOf(worldState))[0];
    expect(Math.abs(axisOffsetOf(worldState, wnpcId, 'MERCY'))).toBe(MAX_AXIS_OFFSET);
  });

  test('the same soul under this car plan rests at one floor quantum over the same year', () => {
    const plan = depthExposurePlan({
      level: 'rooted',
      dwellTicks: 52,
      cadenceTicks: AMBIENT_CADENCE_TICKS,
      hostVector: [{ axisId: 'MERCY', pole: 'vice', band: 'faint' }],
      bandLadder: PULL_BANDS,
    });
    const measured = simulateRest({ spanTicks: plan.spanTicks, periods: 52, periodTicks: 1 });
    expect(measured.offsets.MERCY).toBe(MATERIALIZATION_EPSILON);
  });

  test('the difference between the two is the span, and nothing else in either call', () => {
    const plan = depthExposurePlan({
      level: 'rooted',
      dwellTicks: 39,
      cadenceTicks: AMBIENT_CADENCE_TICKS,
      hostVector: [{ axisId: 'MERCY', pole: 'vice', band: 'faint' }],
      bandLadder: PULL_BANDS,
    });
    expect(plan.spanTicks).toBe(AMBIENT_CADENCE_TICKS);
    expect(plan.cadences).toBe(3);
    const cumulative = simulateRest({ spanTicks: 3 * AMBIENT_CADENCE_TICKS, periods: 52, periodTicks: 1 });
    const perPeriod = simulateRest({ spanTicks: plan.spanTicks, periods: 52, periodTicks: 1 });
    expect(cumulative.offsets.MERCY).toBe(MAX_AXIS_OFFSET);
    expect(perPeriod.offsets.MERCY).toBe(MATERIALIZATION_EPSILON);
  });
});
