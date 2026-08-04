/**
 * warEndingClassifier.test.js — WR-9's endings classifier, pinned.
 *
 * WHAT THIS FILE IS FOR. WR-9 grades a closed eight-key endings vocabulary, and
 * five of those eight keys exist NOWHERE in the engine as emitted tokens. The
 * classifier is therefore the only thing standing between the envelope and a
 * histogram of permanent zeros wearing a passing shape. These pins hold three
 * properties the module would otherwise be free to lose silently:
 *
 *   1. TOTALITY — every one of the eight keys is REACHABLE from a fact record.
 *      If a future edit makes one unreachable, this file reds rather than the
 *      envelope quietly grading a seven-key world.
 *   2. NO SILENT BUCKETING — an unclassifiable close returns null with a named
 *      reason. Defaulting it to `terms` would let the dominance envelope pass on
 *      a corpus whose endings were never read, which is the exact greenwash the
 *      envelope exists to prevent.
 *   3. THE TWO SACK ROADS NEVER COLLAPSE — their ratio is R2's licence-economy
 *      health metric, so a fold that merged them would erase the claim.
 *
 * GUARD-THE-GUARD. The road reader works by RE-MINTING the razing outcome id and
 * comparing for equality. A reader that accepted any id containing the word
 * would pass every positive test here, so this file also drives it with a
 * WRONG-RAZER id and a hand-built lookalike and requires both to be refused.
 */

import { describe, expect, it } from 'vitest';

import {
  RAZING_ROADS,
  razingOutcomeIdFor,
} from '../../src/domain/worldPulse/razing.js';
import { WAR_ENDING_KEYS } from '../../src/domain/certification/warConvergenceContract.js';
import {
  RULER_CHANGE_ENDING_FAMILIES,
  WAR_ENDING_EVIDENCE,
  WAR_ENDING_PRECEDENCE,
  WAR_ENDING_UNCLASSIFIED_REASONS,
  classifyWarEnding,
  foldWarEndings,
  razingRoadOf,
} from '../../src/domain/certification/warEndingClassifier.js';

const RAZER = 'town.ashford';
const VICTIM = 'town.thornwall';
const TICK = 412;

/** A razing outcome minted exactly as razingExecution.js mints it. */
function razingOutcome(road, { razerId = RAZER, victimId = VICTIM, tick = TICK } = {}) {
  return {
    id: razingOutcomeIdFor({ road, razerId, victimId, tick }),
    candidateType: 'razing',
    targetSaveId: victimId,
    tick,
  };
}

/** A closed war between the same pair, with whatever terminal evidence a case needs. */
function closedWar(extra = {}) {
  return {
    attackerId: RAZER,
    defenderId: VICTIM,
    closed: true,
    terminalOutcomes: [],
    ...extra,
  };
}

describe('WR-9 endings classifier — totality over the closed vocabulary', () => {
  // One fact record per key. This table IS the totality proof: it is asserted
  // against WAR_ENDING_KEYS below, so a new key with no reachable fixture reds.
  const REACHES = [
    ['punitive_sack_vengeance', closedWar({ terminalOutcomes: [razingOutcome('vengeance')] })],
    ['punitive_sack_initiation', closedWar({ terminalOutcomes: [razingOutcome('initiation')] })],
    ['conquest', closedWar({
      terminalOutcomes: [{ id: 'world_outcome.conquest.x.9', candidateType: 'conquest', targetSaveId: VICTIM, tick: TICK }],
    })],
    ['annihilation', closedWar({ loserDied: true })],
    ['fragmentation', closedWar({ coalitionFragmented: true })],
    ['ruler_change', closedWar({ seatTransitionFamily: 'successor_repudiates_war' })],
    ['exhaustion', closedWar({ peaceReason: 'exhaustion' })],
    ['terms', closedWar({ treatyWritten: true })],
  ];

  it('reaches every key in WAR_ENDING_KEYS, and the table covers exactly that set', () => {
    expect([...REACHES.map(([key]) => key)].sort()).toEqual([...WAR_ENDING_KEYS].sort());
    for (const [key, fact] of REACHES) {
      const verdict = classifyWarEnding(fact);
      expect(verdict.ending, `${key} became unreachable`).toBe(key);
      expect(verdict.reason).toBe('');
      expect(verdict.evidence).toBe(WAR_ENDING_EVIDENCE[key]);
    }
  });

  it('names an evidence channel for every key, and nothing else', () => {
    expect(Object.keys(WAR_ENDING_EVIDENCE).sort()).toEqual([...WAR_ENDING_KEYS].sort());
    for (const key of WAR_ENDING_KEYS) {
      expect(WAR_ENDING_EVIDENCE[key].length).toBeGreaterThan(20);
    }
  });

  it('declares a precedence that is a permutation of the vocabulary, sacks first', () => {
    expect([...WAR_ENDING_PRECEDENCE].sort()).toEqual([...WAR_ENDING_KEYS].sort());
    expect(WAR_ENDING_PRECEDENCE.slice(0, 2)).toEqual([
      'punitive_sack_vengeance',
      'punitive_sack_initiation',
    ]);
    expect(WAR_ENDING_PRECEDENCE[WAR_ENDING_PRECEDENCE.length - 1]).toBe('terms');
  });
});

describe('WR-9 endings classifier — the two sack roads stay separate', () => {
  it('classifies the two roads to two different keys from ids that differ only by road', () => {
    const vengeance = classifyWarEnding(closedWar({ terminalOutcomes: [razingOutcome('vengeance')] }));
    const initiation = classifyWarEnding(closedWar({ terminalOutcomes: [razingOutcome('initiation')] }));
    expect(vengeance.ending).toBe('punitive_sack_vengeance');
    expect(initiation.ending).toBe('punitive_sack_initiation');
    expect(vengeance.ending === initiation.ending).toBe(false);
    expect(RAZING_ROADS.length).toBe(2);
  });

  it('lets the sack outrank a co-occurring treaty, so the licence economy is never masked', () => {
    const both = closedWar({
      terminalOutcomes: [razingOutcome('vengeance')],
      treatyWritten: true,
      peaceReason: 'exhaustion',
    });
    expect(classifyWarEnding(both).ending).toBe('punitive_sack_vengeance');
  });
});

describe('WR-9 endings classifier — the road is recovered by reconstruction, not by parsing', () => {
  it('recovers each road from a correctly minted id', () => {
    for (const road of RAZING_ROADS) {
      expect(razingRoadOf(razingOutcome(road), RAZER)).toBe(road);
    }
  });

  it('MUTANT: an id minted for a DIFFERENT razer does not reconstruct', () => {
    const foreign = razingOutcome('vengeance', { razerId: 'town.elsewhere' });
    expect(razingRoadOf(foreign, RAZER)).toBe('');
    const verdict = classifyWarEnding(closedWar({ terminalOutcomes: [foreign] }));
    expect(verdict.ending).toBe(null);
    expect(verdict.reason).toBe('razing_road_unreconstructable');
  });

  it('MUTANT: a hand-built lookalike that merely CONTAINS a road word is refused', () => {
    const lookalike = {
      id: `world_outcome.razing.vengeance.${RAZER}.${VICTIM}.${TICK + 1}`,
      candidateType: 'razing',
      targetSaveId: VICTIM,
      tick: TICK,
    };
    expect(razingRoadOf(lookalike, RAZER)).toBe('');
    expect(classifyWarEnding(closedWar({ terminalOutcomes: [lookalike] })).reason)
      .toBe('razing_road_unreconstructable');
  });

  it('MUTANT: an unreconstructable razing is never rescued by a co-occurring treaty', () => {
    const verdict = classifyWarEnding(closedWar({
      terminalOutcomes: [razingOutcome('vengeance', { razerId: 'town.elsewhere' })],
      treatyWritten: true,
    }));
    expect(verdict.ending).toBe(null);
    expect(verdict.reason).toBe('razing_road_unreconstructable');
  });
});

describe('WR-9 endings classifier — it never silently buckets', () => {
  it('refuses a closed war with no terminal evidence instead of calling it terms', () => {
    const verdict = classifyWarEnding(closedWar());
    expect(verdict.ending).toBe(null);
    expect(verdict.reason).toBe('no_terminal_evidence');
    expect(verdict.evidence).toBe('');
  });

  it('refuses a war the census did not judge closed', () => {
    expect(classifyWarEnding({ attackerId: RAZER, closed: false }).reason).toBe('not_a_closed_war');
    expect(classifyWarEnding({}).reason).toBe('not_a_closed_war');
    expect(classifyWarEnding(null).reason).toBe('not_a_closed_war');
  });

  it('refuses the escalating successor family, which is the same machinery ending nothing', () => {
    const escalation = closedWar({ seatTransitionFamily: 'successor_escalates_war' });
    expect(classifyWarEnding(escalation).ending).toBe(null);
    expect(RULER_CHANGE_ENDING_FAMILIES.includes('successor_escalates_war')).toBe(false);
    expect(RULER_CHANGE_ENDING_FAMILIES.length).toBe(4);
  });

  it('refuses a peace reason that is not exhaustion', () => {
    expect(classifyWarEnding(closedWar({ peaceReason: 'mediation' })).ending).toBe(null);
  });

  it('keeps every unclassified reason in the closed set', () => {
    expect([...WAR_ENDING_UNCLASSIFIED_REASONS]).toEqual([
      'not_a_closed_war',
      'no_terminal_evidence',
      'razing_road_unreconstructable',
    ]);
  });
});

describe('WR-9 endings classifier — the fold carries its own honesty', () => {
  it('addresses every key, and reports classified and unclassified side by side', () => {
    const folded = foldWarEndings([
      closedWar({ terminalOutcomes: [razingOutcome('vengeance')] }),
      closedWar({ terminalOutcomes: [razingOutcome('initiation')] }),
      closedWar({ treatyWritten: true }),
      closedWar(),
      closedWar({ terminalOutcomes: [razingOutcome('vengeance', { razerId: 'town.elsewhere' })] }),
      { closed: false },
    ]);
    expect(Object.keys(folded.endingsMix).sort()).toEqual([...WAR_ENDING_KEYS].sort());
    expect(folded.endingsMix.punitive_sack_vengeance).toBe(1);
    expect(folded.endingsMix.punitive_sack_initiation).toBe(1);
    expect(folded.endingsMix.terms).toBe(1);
    expect(folded.classifiedTotal).toBe(3);
    expect(folded.unclassifiedTotal).toBe(3);
    expect(folded.unclassified).toEqual({
      not_a_closed_war: 1,
      no_terminal_evidence: 1,
      razing_road_unreconstructable: 1,
    });
  });

  it('is vacuous-safe: an empty corpus folds to an addressed all-zero histogram', () => {
    const folded = foldWarEndings([]);
    expect(Object.keys(folded.endingsMix).sort()).toEqual([...WAR_ENDING_KEYS].sort());
    expect(Object.values(folded.endingsMix).reduce((a, b) => a + b, 0)).toBe(0);
    expect(folded.classifiedTotal).toBe(0);
    expect(folded.unclassifiedTotal).toBe(0);
  });
});
