import { describe, expect, test } from 'vitest';

import {
  coalitionStandingTransitionEvidence,
  mergeWarCoalitionEvidence,
} from '../../src/domain/worldPulse/warCoalitionPulse.js';

const expenditure = (tick, band = 'present', joinedTick = 4) => ({
  id: `expenditure.${tick}`,
  kind: 'coalition_expenditure_read',
  tick,
  settlementId: 'member',
  counterpartId: 'caller',
  targetId: 'enemy',
  joinedTick,
  band,
});

const stayed = (tick, joinedTick = 4) => ({
  id: `stayed.${tick}`,
  kind: 'coalition_stayed',
  tick,
  settlementId: 'member',
  counterpartId: 'caller',
  thirdPartyId: 'enemy',
  targetId: 'enemy',
  joinedTick,
});

describe('WR-6 pulse evidence admission', () => {
  test('canonical union is order-free, deduped, and drops malformed facts', () => {
    expect(mergeWarCoalitionEvidence(
      [stayed(5), expenditure(5)],
      [expenditure(5), { kind: 'coalition_stayed', tick: 5 }],
    ).map((row) => row.kind)).toEqual([
      'coalition_expenditure_read',
      'coalition_stayed',
    ]);
  });

  test('⚠️ A MISSING GROUP IS AN EMPTY GROUP — the invariant CR-PK-1 rests on', () => {
    // THIS PIN EXISTS BECAUSE A LANE STOPPED ON ITS NEGATION. WZ-2 recorded the
    // pulse kernel's two `no-useless-assignment` errors as unfixable, reasoning
    // that dropping `let reasonCoalitionEvidence = []` would "hand `undefined`
    // to mergeWarCoalitionEvidence on the peace-dark path". The kernel's two
    // reassignments turned out to be unconditional (a bare lexical block is not
    // an `if`), so that path does not exist — but the deeper answer is that it
    // would not have mattered, because this function reads every group through
    // `Array.isArray(group) ? group : []`.
    //
    // So the guarantee is pinned HERE, at the consumer, rather than left as a
    // fact about one caller's control flow. Any future edit that DOES make a
    // kernel assignment conditional is safe by this contract, and an edit that
    // breaks the contract reds here instead of silently changing a merge.
    const rows = [stayed(5), expenditure(5)];
    const withEmpties = mergeWarCoalitionEvidence([], rows, [], []);
    const withUndefineds = mergeWarCoalitionEvidence(undefined, rows, undefined, undefined);
    const withNulls = mergeWarCoalitionEvidence(null, rows, null, null);
    // Non-vacuity: the shared group is REAL, so this is not four empty lists
    // agreeing with each other (the self-referential-pin class).
    expect(withEmpties.map((row) => row.kind)).toEqual([
      'coalition_expenditure_read',
      'coalition_stayed',
    ]);
    expect(withUndefineds).toEqual(withEmpties);
    expect(withNulls).toEqual(withEmpties);
    // And the degenerate case both spellings share: no groups at all.
    expect(mergeWarCoalitionEvidence(undefined, undefined)).toEqual([]);
    expect(mergeWarCoalitionEvidence()).toEqual([]);
  });

  test('cost speaks first above quiet and only when its band worsens', () => {
    const worldState = {
      pulseHistory: [{
        tick: 5,
        warCoalitionEvidence: [expenditure(5, 'present')],
      }],
    };
    expect(coalitionStandingTransitionEvidence({}, [expenditure(4, 'quiet')])).toEqual([]);
    expect(coalitionStandingTransitionEvidence({}, [expenditure(5, 'present')]))
      .toEqual([expenditure(5, 'present')]);
    expect(coalitionStandingTransitionEvidence(worldState, [expenditure(6, 'present')])).toEqual([]);
    expect(coalitionStandingTransitionEvidence(worldState, [expenditure(6, 'pressing')]))
      .toEqual([expenditure(6, 'pressing')]);
  });

  test('stay speaks once per exact joined episode and can speak in a later episode', () => {
    const worldState = {
      pulseHistory: [{ tick: 5, warCoalitionEvidence: [stayed(5, 4)] }],
    };
    expect(coalitionStandingTransitionEvidence(worldState, [stayed(6, 4)])).toEqual([]);
    expect(coalitionStandingTransitionEvidence(worldState, [stayed(9, 8)]))
      .toEqual([stayed(9, 8)]);
  });
});
