/**
 * warConvergenceForces.test.js — WR-9c's six force cells, pinned.
 *
 * THE SHAPE OF THIS SUITE. Each force gets one case proving its verdict STATES —
 * that PASS, FAIL and UNOBSERVED are all reachable and all distinct — and each cell
 * that claims catching power gets a MUTANT: evidence moved exactly one way, with
 * the neighbouring cells asserted still green so the red is specific.
 *
 * WHY THE ENGINE CONSTANTS ARE IMPORTED HERE AND NOT THERE. The forces leaf declares
 * its own copies of two engine vocabularies so production code carries zero
 * worldPulse import edges (a certification module pulling the demographics chain
 * into the behavioral oracle's bundle is how the dist chunk-cycle class starts).
 * The COUPLING still has to be enforced, so it is enforced here, against the real
 * modules: a rename in warCosts.js or a retune in demographicsWar.js reds this file
 * rather than silently splitting one vocabulary into two.
 */
import { describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  WAR_CONVERGENCE_FORCE_IDS,
  WAR_CONVERGENCE_FORCE_TUNING,
  WAR_FORCE_HOME_FRONT_DURATION_BANDS,
  WAR_FORCE_STATES,
  WAR_FORCE_UNOBSERVED_REASONS,
  WAR_TERMINAL_ENDING_KEYS,
  createEmptyWarForceEvidence,
  evaluateWarConvergenceForces,
  validateWarForceEvidence,
} from '../../src/domain/certification/warConvergenceForces.js';
import { WAR_ENDING_KEYS } from '../../src/domain/certification/warConvergenceContract.js';
import { WAR_HOME_FRONT_DURATION_BANDS } from '../../src/domain/worldPulse/warCosts.js';
import { WAR_DEMOGRAPHIC_TUNING } from '../../src/domain/worldPulse/demographicsWar.js';
import { COMPROMISE_ROUND_TUNING } from '../../src/domain/worldPulse/compromiseRound.js';

const [FORCE_1, FORCE_2, FORCE_3, FORCE_4, FORCE_5, FORCE_6] = WAR_CONVERGENCE_FORCE_IDS;

/** A force address that makes every FILLABLE cell pass, as the shipped fixture does. */
function healthyEvidence() {
  return {
    homeFrontByDurationBand: {
      opening: { samples: 4, scoreTotal: 0.8 },
      sustained: { samples: 3, scoreTotal: 1.2 },
      protracted: { samples: 2, scoreTotal: 1.4 },
    },
    capabilityReadings: { readings: 20, atCollapse: 3 },
    compromiseWideningSequences: [[0.06, 0.13, 0.21], [0.06, 0.06, 0.18]],
    coalitionFragmentation: { fragmentations: 2, pairwisePeaces: 5 },
  };
}

/** An endings mix whose terminal share sits under force 6's ceiling. */
function healthyEndings() {
  return {
    terms: 8,
    exhaustion: 4,
    ruler_change: 3,
    fragmentation: 3,
    annihilation: 1,
    conquest: 1,
    punitive_sack_initiation: 1,
    punitive_sack_vengeance: 1,
  };
}

/** Grade one corpus and return the rows keyed by id. */
function grade({ evidence = healthyEvidence(), endings = healthyEndings(), shapePassed = true } = {}) {
  const endingTotals = { ...Object.fromEntries(WAR_ENDING_KEYS.map((key) => [key, 0])), ...endings };
  const endingsObserved = Object.values(endingTotals).reduce((total, count) => total + count, 0);
  const rows = evaluateWarConvergenceForces({
    shapePassed,
    forceEvidences: evidence === null ? [] : [evidence],
    endingTotals,
    endingsObserved,
  });
  return Object.fromEntries(rows.map((row) => [row.id, row]));
}

describe('WR-9c force cells — vocabulary and totality', () => {
  it('returns exactly six rows, in declared order, every one in the closed state vocabulary', () => {
    const rows = evaluateWarConvergenceForces({
      shapePassed: true,
      forceEvidences: [healthyEvidence()],
      endingTotals: healthyEndings(),
      endingsObserved: 22,
    });
    // TOTALITY: a force can be PASS, FAIL or UNOBSERVED. It can never be MISSING —
    // an omitted force is a force nobody will ever build.
    expect(rows.map((row) => row.id)).toEqual([...WAR_CONVERGENCE_FORCE_IDS]);
    expect(rows).toHaveLength(6);
    for (const row of rows) {
      expect(WAR_FORCE_STATES).toContain(row.state);
      expect(row.passed).toBe(row.state === 'PASS');
      expect(typeof row.label).toBe('string');
      expect(row.label.length).toBeGreaterThan(0);
      if (row.state === 'UNOBSERVED') {
        expect(WAR_FORCE_UNOBSERVED_REASONS).toContain(row.unobservedReason);
      } else {
        expect(row.unobservedReason).toBe('');
      }
    }
  });

  it('keeps every id under the war_convergence prefix, which is what makes them binding', () => {
    // The prefix is what puts these cells in the group that earns
    // `war_convergence_instrumented` (behavioralContract's CHECK_GROUP_PROPERTIES).
    // A force cell filed under any other prefix would grade nothing.
    for (const id of WAR_CONVERGENCE_FORCE_IDS) {
      expect(id.startsWith('war_convergence.force_')).toBe(true);
    }
    expect(new Set(WAR_CONVERGENCE_FORCE_IDS).size).toBe(WAR_CONVERGENCE_FORCE_IDS.length);
  });

  it('an UNOBSERVED cell is NOT a passing cell, and says why in a closed token', () => {
    const empty = grade({ evidence: createEmptyWarForceEvidence(), endings: {} });
    // Every gradable cell is UNOBSERVED-with-reason on an empty corpus, and NOT ONE
    // of them reads as a pass. This is the distinction the whole wave rests on.
    for (const id of [FORCE_1, FORCE_2, FORCE_4, FORCE_5, FORCE_6]) {
      expect(empty[id].state).toBe('UNOBSERVED');
      expect(empty[id].passed).toBe(false);
      expect(empty[id].unobservedReason).toBe('no_evidence_carried');
    }
    // ...and the substrate-less force is a DIFFERENT diagnosis, never merged with it.
    expect(empty[FORCE_3].unobservedReason).toBe('no_substrate_in_tree');
  });

  it('refuses to read anything at all when the receipt shape itself failed', () => {
    // A corpus the address wall rejected has not supplied evidence, it has supplied
    // a defect. Nothing here may launder that into a measurement.
    const broken = grade({ shapePassed: false });
    for (const id of WAR_CONVERGENCE_FORCE_IDS) {
      expect(broken[id].passed).toBe(false);
      expect(broken[id].state).toBe('UNOBSERVED');
    }
  });
});

describe('WR-9c force cells — the vocabularies are coupled to the engine, not copied from it', () => {
  it('force 1 bands are character-identical to warCosts.js WAR_HOME_FRONT_DURATION_BANDS', () => {
    expect([...WAR_FORCE_HOME_FRONT_DURATION_BANDS]).toEqual([...WAR_HOME_FRONT_DURATION_BANDS]);
    // Shortest-first ORDER is load bearing: force 1 walks these in sequence and a
    // reversed list would invert the acceleration claim into its opposite.
    expect([...WAR_FORCE_HOME_FRONT_DURATION_BANDS]).toEqual(['opening', 'sustained', 'protracted']);
  });

  it('force 2 has a real engine floor behind it — the lane brief said it did not', () => {
    // ⚠️⚠️ THE CORRECTION, PINNED SO IT CANNOT BE RE-LOST. WR-9c's brief recorded
    // that force 2's "P4 capability floor" returned ZERO greps and "may not exist as
    // a declared floor", and ruled that the cell state that absence as its finding.
    // It exists. demographicsWar.js — docstring line one: "WAVE P4 (THE WORLD'S
    // HAND)" — declares it, and warCapabilityOf clamps to it. The brief's grep set
    // did not contain the constant's real spelling.
    expect(typeof WAR_DEMOGRAPHIC_TUNING.CAPABILITY_FLOOR).toBe('number');
    expect(WAR_DEMOGRAPHIC_TUNING.CAPABILITY_FLOOR).toBeGreaterThan(0);
    expect(WAR_DEMOGRAPHIC_TUNING.CAPABILITY_FLOOR).toBeLessThan(1);
    // The cell's threshold names that substrate rather than asserting an absence.
    const cell = grade()[FORCE_2];
    expect(cell.threshold.engineSubstrate).toMatch(/CAPABILITY_FLOOR/);
  });

  it('force 4 grades the same series widenAcceptance produces, and its cap is real', () => {
    // The cell walks `widening01` values; the engine's own ceiling bounds them, so a
    // series that exceeded the cap would be evidence of a different defect.
    expect(typeof COMPROMISE_ROUND_TUNING.WIDENING_CAP_01).toBe('number');
    for (const series of healthyEvidence().compromiseWideningSequences) {
      for (const step of series) {
        expect(step).toBeLessThanOrEqual(COMPROMISE_ROUND_TUNING.WIDENING_CAP_01);
      }
    }
  });

  it('force 6 grades a strict subset of the closed endings vocabulary', () => {
    for (const key of WAR_TERMINAL_ENDING_KEYS) {
      expect(WAR_ENDING_KEYS).toContain(key);
    }
    expect(WAR_TERMINAL_ENDING_KEYS.length).toBeLessThan(WAR_ENDING_KEYS.length);
    // The negotiated roads are the complement and must never be counted as terminal.
    expectAbsentWithAnchor(
      [...WAR_TERMINAL_ENDING_KEYS],
      'terms',
      'conquest',
      'a treaty is the opposite of a terminal resolution',
    );
  });
});

describe('WR-9c force 1 — home-front acceleration', () => {
  it('passes when mean pressure never falls as the war lengthens', () => {
    const cell = grade()[FORCE_1];
    expect(cell.state).toBe('PASS');
    expect(cell.observed.byBand.opening.meanScore).toBeCloseTo(0.2, 10);
    expect(cell.observed.byBand.protracted.meanScore).toBeCloseTo(0.7, 10);
    expect(cell.observed.inversions).toEqual([]);
  });

  it('MUTANT — a protracted war that hurts LESS than an opening one reds the cell', () => {
    const evidence = healthyEvidence();
    evidence.homeFrontByDurationBand.protracted = { samples: 2, scoreTotal: 0.2 };
    const rows = grade({ evidence });
    expect(rows[FORCE_1].state).toBe('FAIL');
    expect(rows[FORCE_1].observed.inversions).toEqual(['sustained->protracted']);
    // SPECIFIC: nothing else moved.
    expect(rows[FORCE_2].state).toBe('PASS');
    expect(rows[FORCE_4].state).toBe('PASS');
    expect(rows[FORCE_5].state).toBe('PASS');
    expect(rows[FORCE_6].state).toBe('PASS');
  });

  it('a corpus that only ever reached one band cannot claim acceleration either way', () => {
    const evidence = healthyEvidence();
    evidence.homeFrontByDurationBand.sustained = { samples: 0, scoreTotal: 0 };
    evidence.homeFrontByDurationBand.protracted = { samples: 0, scoreTotal: 0 };
    const cell = grade({ evidence })[FORCE_1];
    // NOT a pass (it proved nothing) and NOT a fail (it disproved nothing): the
    // repair is a longer horizon, and the reason says so.
    expect(cell.state).toBe('UNOBSERVED');
    expect(cell.unobservedReason).toBe('insufficient_spread');
    expect(cell.threshold.minBandsObserved)
      .toBe(WAR_CONVERGENCE_FORCE_TUNING.HOME_FRONT_MIN_BANDS_OBSERVED);
  });
});

describe('WR-9c force 2 — capability collapse reachable', () => {
  it('passes when the floor is reached without being the ordinary condition', () => {
    const cell = grade()[FORCE_2];
    expect(cell.state).toBe('PASS');
    expect(cell.observed.collapseShare).toBeCloseTo(0.15, 10);
  });

  it('MUTANT — a floor nothing ever reaches reds, because reachability is the claim', () => {
    const evidence = healthyEvidence();
    evidence.capabilityReadings = { readings: 20, atCollapse: 0 };
    const rows = grade({ evidence });
    expect(rows[FORCE_2].state).toBe('FAIL');
    expect(rows[FORCE_2].observed.atCollapse).toBe(0);
    expect(rows[FORCE_1].state).toBe('PASS');
  });

  it('MUTANT — a world starved into the floor as its weather reds the other way', () => {
    const evidence = healthyEvidence();
    evidence.capabilityReadings = { readings: 20, atCollapse: 19 };
    const cell = grade({ evidence })[FORCE_2];
    expect(cell.state).toBe('FAIL');
    expect(cell.observed.collapseShare)
      .toBeGreaterThan(WAR_CONVERGENCE_FORCE_TUNING.CAPABILITY_COLLAPSE_MAX_SHARE);
  });
});

describe('WR-9c force 3 — the force with no substrate', () => {
  it('is UNOBSERVED on every corpus, and names both halves of the measurement', () => {
    const healthy = grade()[FORCE_3];
    const empty = grade({ evidence: createEmptyWarForceEvidence(), endings: {} })[FORCE_3];
    // No corpus can move it, which is exactly what "no substrate" means.
    expect(healthy.state).toBe('UNOBSERVED');
    expect(empty.state).toBe('UNOBSERVED');
    expect(healthy).toEqual(empty);
    expect(healthy.unobservedReason).toBe('no_substrate_in_tree');
    expect(healthy.observed.halfPresent).toMatch(/seat transitions are persisted/);
    expect(healthy.observed.halfMissing)
      .toMatch(/no seat-transition row carries a war id, a war age, or a war opening tick/);
    // The repair is named as an ENGINE change, so nobody tries to collector their
    // way out of it — and the lifecycle clause that forbids it this wave is cited.
    expect(healthy.threshold.requiresEngineChange).toBe(true);
    expect(healthy.threshold.forbiddenThisWave).toMatch(/NO persisted world state/);
  });

  it('has no address in the observation, because an address would be a promise', () => {
    // Force 3 deliberately owns no key in the force evidence: a slot a collector
    // could see would imply a collector could fill it, and nothing can.
    expect(Object.keys(createEmptyWarForceEvidence()).sort()).toEqual([
      'capabilityReadings',
      'coalitionFragmentation',
      'compromiseWideningSequences',
      'homeFrontByDurationBand',
    ]);
  });
});

describe('WR-9c force 4 — the widening is monotone', () => {
  it('passes when every recorded round series only ever widens', () => {
    const cell = grade()[FORCE_4];
    expect(cell.state).toBe('PASS');
    expect(cell.observed.sequencesGraded).toBe(2);
    expect(cell.observed.roundsGraded).toBe(6);
    expect(cell.observed.narrowings).toEqual([]);
  });

  it('MUTANT — one narrowing round in one series reds the cell and names it', () => {
    const evidence = healthyEvidence();
    evidence.compromiseWideningSequences = [[0.06, 0.13, 0.21], [0.06, 0.18, 0.09]];
    const rows = grade({ evidence });
    expect(rows[FORCE_4].state).toBe('FAIL');
    expect(rows[FORCE_4].observed.narrowings).toEqual([
      { sequence: 1, step: 2, from: 0.18, to: 0.09 },
    ]);
    // SPECIFIC: the neighbouring forces are untouched.
    expect(rows[FORCE_1].state).toBe('PASS');
    expect(rows[FORCE_2].state).toBe('PASS');
    expect(rows[FORCE_5].state).toBe('PASS');
  });

  it('a one-round series has no round-OVER-round to be monotone in', () => {
    const evidence = healthyEvidence();
    evidence.compromiseWideningSequences = [[0.06], [0.13]];
    const cell = grade({ evidence })[FORCE_4];
    expect(cell.state).toBe('UNOBSERVED');
    expect(cell.unobservedReason).toBe('insufficient_spread');
    expect(cell.observed.sequencesObserved).toBe(2);
    expect(cell.observed.sequencesGraded).toBe(0);
  });

  it('never merges the series of two cases into one sequence', () => {
    // A widening series belongs to ONE pair in ONE case. Folding two cases by
    // concatenating the numbers would manufacture a narrowing at every seam, so the
    // fold concatenates SERIES and never their contents.
    const rows = evaluateWarConvergenceForces({
      shapePassed: true,
      forceEvidences: [
        { ...healthyEvidence(), compromiseWideningSequences: [[0.06, 0.30]] },
        { ...healthyEvidence(), compromiseWideningSequences: [[0.06, 0.12]] },
      ],
      endingTotals: healthyEndings(),
      endingsObserved: 22,
    });
    const cell = rows.find((row) => row.id === FORCE_4);
    expect(cell.observed.sequencesGraded).toBe(2);
    expect(cell.state).toBe('PASS');
  });
});

describe('WR-9c force 5 — fragmentation produces pairwise peaces', () => {
  it('passes when every fragmentation left at least one pairwise peace behind it', () => {
    const cell = grade()[FORCE_5];
    expect(cell.state).toBe('PASS');
    expect(cell.observed.peacesPerFragmentation).toBeCloseTo(2.5, 10);
  });

  it('MUTANT — a coalition that dissolved into nothing reds the cell', () => {
    const evidence = healthyEvidence();
    evidence.coalitionFragmentation = { fragmentations: 3, pairwisePeaces: 2 };
    const rows = grade({ evidence });
    expect(rows[FORCE_5].state).toBe('FAIL');
    expect(rows[FORCE_5].observed.requiredPairwisePeaces).toBe(3);
    expect(rows[FORCE_4].state).toBe('PASS');
  });

  it('MUTANT — pairwise peaces with no fragmentation behind them are incoherent, not absent', () => {
    const evidence = healthyEvidence();
    evidence.coalitionFragmentation = { fragmentations: 0, pairwisePeaces: 4 };
    const cell = grade({ evidence })[FORCE_5];
    // Half the pair was counted and half was not. That is a FAIL (the census is
    // broken), never an UNOBSERVED (nothing was counted).
    expect(cell.state).toBe('FAIL');
    expect(cell.unobservedReason).toBe('');
  });
});

describe('WR-9c force 6 — terminal resolution rare but present', () => {
  it('passes on a mix where the terminal roads are live but not the body', () => {
    const cell = grade()[FORCE_6];
    expect(cell.state).toBe('PASS');
    expect(cell.observed.terminalCount).toBe(4);
    expect(cell.observed.terminalShare).toBeCloseTo(4 / 22, 10);
  });

  it('MUTANT — a world that only ever ends wars by force reds the rarity ceiling', () => {
    const cell = grade({ endings: { terms: 1, conquest: 10, punitive_sack_vengeance: 5 } })[FORCE_6];
    expect(cell.state).toBe('FAIL');
    expect(cell.observed.terminalShare)
      .toBeGreaterThan(WAR_CONVERGENCE_FORCE_TUNING.TERMINAL_RESOLUTION_MAX_SHARE);
  });

  it('MUTANT — a world where no war ever ends terminally reds the presence floor', () => {
    const cell = grade({ endings: { terms: 12, exhaustion: 8, ruler_change: 4 } })[FORCE_6];
    expect(cell.state).toBe('FAIL');
    expect(cell.observed.terminalCount).toBe(0);
    expect(cell.observed.terminalShare).toBe(0);
  });

  it('answers vocabulary_drift rather than a false zero when a terminal key has no address', () => {
    const endings = healthyEndings();
    delete endings.conquest;
    // The grader is handed a totals map with no `conquest` key at all. Summing
    // absent keys as zero would understate the terminal share and could PASS a
    // corpus on a vocabulary that had drifted underneath it.
    const rows = evaluateWarConvergenceForces({
      shapePassed: true,
      forceEvidences: [healthyEvidence()],
      endingTotals: endings,
      endingsObserved: 21,
    });
    const cell = rows.find((row) => row.id === FORCE_6);
    expect(cell.state).toBe('UNOBSERVED');
    expect(cell.unobservedReason).toBe('vocabulary_drift');
    expect(cell.observed.missingKeys).toEqual(['conquest']);
  });
});

describe('WR-9c force evidence — the totality wall over the address', () => {
  it('accepts the empty address and every counter starts at zero', () => {
    const empty = createEmptyWarForceEvidence();
    expect(validateWarForceEvidence(empty)).toEqual([]);
    for (const band of WAR_FORCE_HOME_FRONT_DURATION_BANDS) {
      expect(empty.homeFrontByDurationBand[band]).toEqual({ samples: 0, scoreTotal: 0 });
    }
    expect(empty.capabilityReadings).toEqual({ readings: 0, atCollapse: 0 });
    expect(empty.compromiseWideningSequences).toEqual([]);
    expect(empty.coalitionFragmentation).toEqual({ fragmentations: 0, pairwisePeaces: 0 });
  });

  it('polices the address key by key, exactly as the histograms are policed', () => {
    const missing = createEmptyWarForceEvidence();
    delete missing.homeFrontByDurationBand.protracted;
    expect(validateWarForceEvidence(missing).join(' '))
      .toMatch(/homeFrontByDurationBand is missing protracted/);

    const unknown = createEmptyWarForceEvidence();
    unknown.homeFrontByDurationBand.eternal = { samples: 1, scoreTotal: 1 };
    expect(validateWarForceEvidence(unknown).join(' '))
      .toMatch(/homeFrontByDurationBand has unknown key eternal/);

    const stray = createEmptyWarForceEvidence();
    stray.rulerChangeByDuration = { buckets: [] };
    expect(validateWarForceEvidence(stray).join(' '))
      .toMatch(/forceEvidence has unknown key rulerChangeByDuration/);

    const fractional = createEmptyWarForceEvidence();
    fractional.capabilityReadings.readings = 1.5;
    expect(validateWarForceEvidence(fractional).join(' '))
      .toMatch(/capabilityReadings\.readings must be a non-negative integer/);

    const impossible = createEmptyWarForceEvidence();
    impossible.capabilityReadings = { readings: 2, atCollapse: 5 };
    expect(validateWarForceEvidence(impossible).join(' '))
      .toMatch(/atCollapse cannot exceed readings/);

    const negative = createEmptyWarForceEvidence();
    negative.coalitionFragmentation.pairwisePeaces = -1;
    expect(validateWarForceEvidence(negative).join(' '))
      .toMatch(/coalitionFragmentation\.pairwisePeaces must be a non-negative integer/);

    const badSeries = createEmptyWarForceEvidence();
    badSeries.compromiseWideningSequences = [['0.2']];
    expect(validateWarForceEvidence(badSeries).join(' '))
      .toMatch(/compromiseWideningSequences\[0\] must contain only finite non-negative numbers/);
  });

  it('refuses a non-object address rather than reading it as empty', () => {
    for (const raw of [undefined, null, 'evidence', 7, []]) {
      expect(validateWarForceEvidence(raw)).toEqual(['warConvergence.forceEvidence must be an object.']);
    }
  });
});
