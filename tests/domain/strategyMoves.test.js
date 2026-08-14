/**
 * strategyMoves.test.js — HB-1's vocabulary battery, and the disjunct deletion's
 * behaviour-identity proof in its CORRECTED form.
 *
 * ⭐ THE EMITTER IS THE DENOMINATOR. The frozen totality is checked against what the
 * enumeration ACTUALLY emits, across every exported scoring objective, in both directions.
 * A hand list checked against another hand list proves only that someone typed twice.
 *
 * ⛔ THE COMPILE'S PROOF OF THE DELETION WAS FALSE AND THE VOLUME RETRACTED IT. The arm at
 * the bloc decision load is a DISJUNCTION and it FIRES, through the move the enumeration
 * emits unconditionally — so deleting the whole arm would have deleted live behaviour and
 * the implementer would have read the resulting golden red as an error somewhere else. The
 * corrected proof is two steps, and the second checks the first rather than replacing it:
 * an executed enumeration showing no emitted move satisfies the REMOVED DISJUNCT, and then
 * the surviving arm shown still live on the move that always kept it alive.
 */
import { describe, expect, test } from 'vitest';

import {
  ALL_MOVE_TOKENS,
  MARTIAL_HISTORY_MOVES,
  NON_MARTIAL_HISTORY_MOVES,
  STRATEGY_MOVES,
} from '../../src/domain/worldPulse/strategyMoves.js';
import { enumerateMoves } from '../../src/domain/worldPulse/settlementStrategy.js';
import {
  DEFAULT_SCORING_OBJECTIVE,
  SCORING_OBJECTIVES,
  leverNamesOf,
} from '../../src/domain/worldPulse/scoringObjective.js';
import {
  blocDecisionFactor,
  SETTLEMENT_POLITICS_TUNING,
} from '../../src/domain/worldPulse/settlementPolitics.js';

/** The pre-wave membership of the chooser's local martial predicate, transcribed ONCE here
 *  so the derived subset can be proved to reproduce it exactly. This is the ONLY place the
 *  old spelling survives, and it exists to be compared against, never to be read. */
const PRE_WAVE_MARTIAL_SET = Object.freeze([
  'credit', 'defend', 'deploy', 'hold', 'missionize', 'opportunity', 'prestige', 'sue_for_peace',
]);

/** A minimal enumeration frame. No world, no store — the emitter is pure over its args. */
function emitted(objective, { hostileTargets = ['T1'], homeBesieged = false } = {}) {
  return enumerateMoves({
    sId: 'S1',
    ctx: {
      hostileTargets,
      homeBesieged,
      vassalBesieged: false,
      besieging: homeBesieged ? [] : hostileTargets,
    },
    aggressiveness: 1.1,
    strengthFor: (id) => (id === 'S1' ? 0.7 : 0.4),
    exhaustion: 0.2,
    objective,
  }).map((row) => row.move);
}

/** Every move any exported objective can emit, across both hostility postures. */
function emittedTotality() {
  const out = new Set();
  for (const objective of [DEFAULT_SCORING_OBJECTIVE, ...Object.values(SCORING_OBJECTIVES)]) {
    for (const hostileTargets of [['T1'], []]) {
      for (const homeBesieged of [true, false]) {
        for (const move of emitted(objective, { hostileTargets, homeBesieged })) out.add(move);
      }
    }
  }
  return [...out].sort();
}

/** The politics harness shape borrowed from the existing pins battery. */
const POLITICS_ITEM = Object.freeze({
  id: 'S1',
  settlement: {
    powerStructure: {
      factions: [
        { faction: 'Noble House', power: 60, isGoverning: true },
        { faction: 'Merchant League', power: 40 },
      ],
    },
  },
});

function politicsWorld(end, strain) {
  return {
    simulationRules: { settlementPoliticsEnabled: true, factionCompetitionEnabled: true },
    politicsLedgers: {
      S1: {
        blocs: [{
          id: 'merchant_league+noble_house',
          members: ['Merchant League', 'Noble House'],
          glue: [{ type: 'concession', detail: '' }],
          end,
          strain,
          sinceTick: 0,
        }],
      },
    },
  };
}

describe('HB-1 — the closed strategy-move vocabulary and the corrected disjunct deletion', () => {
  test('⭐ THE EMITTER IS THE DENOMINATOR — the frozen totality equals what the enumeration emits', () => {
    const live = emittedTotality();
    expect(live.length).toBeGreaterThan(5);
    expect(
      [...STRATEGY_MOVES].sort(),
      'the frozen totality no longer equals the emitter\'s own set. The enumeration is the'
      + ' denominator: re-derive the export from it, never the other way round.',
    ).toEqual(live);
  });

  test('the union equals the emitted totality TODAY, and both are frozen', () => {
    expect([...ALL_MOVE_TOKENS]).toEqual([...STRATEGY_MOVES]);
    expect(Object.isFrozen(STRATEGY_MOVES)).toBe(true);
    expect(Object.isFrozen(ALL_MOVE_TOKENS)).toBe(true);
    // The two are SEPARATE arrays, not one binding twice: an amending volume moves the
    // union and leaves the emitted set alone, and that is impossible if they are the same
    // object.
    expect(ALL_MOVE_TOKENS).not.toBe(STRATEGY_MOVES);
  });

  test('the vocabulary is codepoint-sorted and duplicate-free', () => {
    expect([...STRATEGY_MOVES]).toEqual([...STRATEGY_MOVES].sort());
    expect(new Set(STRATEGY_MOVES).size).toBe(STRATEGY_MOVES.length);
    expect(STRATEGY_MOVES.every((move) => typeof move === 'string' && move.length > 0)).toBe(true);
  });

  test('the martial-history subset is a PROPER subset of exactly eight', () => {
    expect(MARTIAL_HISTORY_MOVES).toHaveLength(8);
    for (const move of MARTIAL_HISTORY_MOVES) expect(STRATEGY_MOVES).toContain(move);
    expect(MARTIAL_HISTORY_MOVES.length).toBeLessThan(STRATEGY_MOVES.length);
    expect(MARTIAL_HISTORY_MOVES.length + NON_MARTIAL_HISTORY_MOVES.length)
      .toBe(STRATEGY_MOVES.length);
  });

  test('the three exclusions are named, and all three ARE emitted moves', () => {
    // The whole reason the retirement was refused: these are not absent from the vocabulary,
    // they are deliberately absent from the PREDICATE. Retiring the predicate into the
    // totality would add a martial reason to three moves that carry none.
    expect([...NON_MARTIAL_HISTORY_MOVES].sort()).toEqual(['embargo', 'legitimacy', 'reroute']);
    for (const move of NON_MARTIAL_HISTORY_MOVES) {
      expect(STRATEGY_MOVES, `${move} left the vocabulary`).toContain(move);
      // The exact-eight length pin above holds the predicate collection non-empty.
      // anchored: the line directly above proves this same move IS in the vocabulary
      expect(MARTIAL_HISTORY_MOVES, `${move} entered the martial predicate`).not.toContain(move);
    }
  });

  test('the DERIVED subset reproduces the pre-wave membership EXACTLY', () => {
    // R21's whole argument, executed: drift prevention is bought without touching
    // behaviour. If these ever disagree, the swap changed which moves record a martial
    // reason — live behaviour on the estate's most contended chooser.
    expect([...MARTIAL_HISTORY_MOVES].sort()).toEqual([...PRE_WAVE_MARTIAL_SET].sort());
  });

  test('the scoring objective\'s lever keys are all MEMBERS of the vocabulary, from the test side', () => {
    // The collision contract forbids the shared leaf a dependency, so the objective is NOT
    // imported by it; the containment is pinned HERE instead.
    const levers = new Set();
    for (const objective of Object.values(SCORING_OBJECTIVES)) {
      for (const name of leverNamesOf(objective)) levers.add(name);
    }
    expect(levers.size).toBeGreaterThan(0);
    for (const lever of levers) {
      expect(STRATEGY_MOVES, `the lever ${lever} is outside the frozen vocabulary`).toContain(lever);
    }
  });

  test('THE DISJUNCT DELETION IS BEHAVIOUR-IDENTICAL, and the surviving arm is still LIVE', () => {
    // STEP 1 — the executed enumeration. The removed operand compared against a token the
    // emitter never produces, so the disjunction's truth value is unchanged move-for-move.
    const live = emittedTotality();
    expect(live.length).toBeGreaterThan(5);
    expect(live).toEqual([...STRATEGY_MOVES].sort());
    // the two lines above prove `live` is the non-empty emitted totality and equal to the
    // anchored: frozen vocabulary, so an emptied enumeration reds there rather than here
    expect(live).not.toContain('fortify');
    // anchored: the equality one line up holds this export non-empty and identical to the
    expect(ALL_MOVE_TOKENS).not.toContain('fortify');
    // STEP 2 — the CHECK on that reasoning. The arm is live through the move that always
    // kept it alive, so deleting the whole arm (the compile's ruling) would have deleted
    // behaviour that fires for every settlement with a ruling bloc.
    const span = SETTLEMENT_POLITICS_TUNING.DECISION_LOAD_SPAN;
    const survival = blocDecisionFactor(politicsWorld('survival', 0), 'S1', POLITICS_ITEM, 'defend');
    expect(survival).toBeGreaterThan(1);
    expect(survival).toBeLessThanOrEqual(1 + span);
    // …and the deleted token now reads as any unhandled move does: exactly neutral.
    expect(blocDecisionFactor(politicsWorld('survival', 0), 'S1', POLITICS_ITEM, 'fortify')).toBe(1);
  });
});
