/**
 * strategyMoves.test.js — HB-1's vocabulary battery, and the REFUSED deletion's positive
 * record.
 *
 * ⭐ THE EMITTER IS THE DENOMINATOR. The frozen totality is checked against what the
 * enumeration ACTUALLY emits, across every exported scoring objective, in both directions.
 * A hand list checked against another hand list proves only that someone typed twice.
 *
 * ⛔⛔ THE VOLUME ASKED FOR A DELETION TWICE AND BOTH ASKS DIED ON MEASUREMENT. The first
 * ("delete the whole `else if` arm") died because the arm FIRES through `'defend'`, a move
 * the enumeration emits unconditionally. The corrected second ("delete the
 * `move === 'fortify' ||` disjunct ALONE") died at OWNER_DECISION_QUEUE.md §38 to the very
 * instrument the volume nominated as its own check: the disjunct's proof assumed the
 * deciding site's inputs are limited to EMITTED moves, and they are not. A ratified
 * same-seed golden calls that site with the token DIRECTLY.
 *
 * ⭐ THE LAST CASE IS THE POSITIVE RECORD OF THAT REFUSAL, and it is written as a
 * three-way comparison rather than a value pin: the non-emitted token reads the SAME as its
 * live disjunct sibling, and a token satisfying NO arm reads exactly 1. Deleting the
 * disjunct collapses the first into the second, which is precisely what would move the two
 * ratified goldens. This case reds on that edit without knowing either golden's number.
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

/**
 * THE ONE REGISTERED FOREIGN TOKEN. It belongs to the MOBILIZATION vocabulary, the emitter
 * never produces it, and the ruling-bloc decision load nonetheless branches on it because a
 * live ratified consumer passes it straight in. Named here so the last case can compare
 * against it without restating either golden's recorded number.
 */
const REGISTERED_FOREIGN_TOKEN = 'fortify';

/** A token no arm of the decision load matches — the fall-through control. */
const FALL_THROUGH_TOKEN = 'zzz_not_a_move';

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

describe('HB-1 — the closed strategy-move vocabulary and the REFUSED disjunct deletion', () => {
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

  test('⛔⛔ THE REGISTERED FOREIGN TOKEN IS NON-EMITTED AND ITS DISJUNCT IS LIVE', () => {
    // STEP 1 — the half of the volume's proof that HELD. No emitted move satisfies the
    // disjunct, so a membership scan over this vocabulary can never see the token. That
    // blindness is exactly how the deletion survived two review rounds.
    const live = emittedTotality();
    expect(live.length).toBeGreaterThan(5);
    expect(live).toEqual([...STRATEGY_MOVES].sort());
    // the two lines above prove `live` is the non-empty emitted totality and equal to the
    // anchored: frozen vocabulary, so an emptied enumeration reds there rather than here
    expect(live).not.toContain(REGISTERED_FOREIGN_TOKEN);
    // anchored: the equality one line up holds this export non-empty and identical to the
    expect(ALL_MOVE_TOKENS).not.toContain(REGISTERED_FOREIGN_TOKEN);
    // STEP 2 — the half that DIED. The deciding site's inputs are not limited to emitted
    // moves: a live ratified consumer passes the token straight in, and the arm is a
    // DISJUNCTION whose other operand is an emitted move. Both operands therefore reach
    // the same loading row, and the token's value is the sibling's value — not neutral.
    const world = politicsWorld('survival', 0);
    const span = SETTLEMENT_POLITICS_TUNING.DECISION_LOAD_SPAN;
    const sibling = blocDecisionFactor(world, 'S1', POLITICS_ITEM, 'defend');
    expect(sibling).toBeGreaterThan(1);
    expect(sibling).toBeLessThanOrEqual(1 + span);
    // ⛔ THE THREE-WAY COMPARISON THAT REDS THE REFUTED EDIT, written without restating
    // either golden's recorded number: the registered foreign token agrees with its live
    // sibling, and a token satisfying NO arm is exactly neutral. Deleting
    // `move === 'fortify' ||` collapses the first into the second and moves two RATIFIED
    // same-seed goldens, whose re-recording is forbidden outright.
    expect(blocDecisionFactor(world, 'S1', POLITICS_ITEM, REGISTERED_FOREIGN_TOKEN)).toBe(sibling);
    expect(blocDecisionFactor(world, 'S1', POLITICS_ITEM, FALL_THROUGH_TOKEN)).toBe(1);
    expect(sibling).not.toBe(1);
  });
});
