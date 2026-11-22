/**
 * relationHeraldWords.test.js — TE-HERALD-1 car HER-3, the relationship band arm.
 *
 * ONE ladder serves the whole relationship family's 0..1 standing scalars — trust,
 * resentment, burden, endurance, strain, dependency, salience, attrition, a confidence
 * gap. It is homed in `relationshipState.js` because that is the module all three rule
 * surfaces already import, so the shared home costs no new coupling and there is no
 * second copy to drift.
 *
 * ⚠ ITS CUTS ARE A READING CONVENTION, NOT A CLAIM, and this file pins that honestly:
 * these axes carry no engine-named interior landmark (every rule gates them at its own
 * ad-hoc threshold), so the cuts are plain quarters, nothing branches on them, and the
 * test below asserts the CONVENTION rather than pretending to check a calibration.
 *
 * ⭐ THE SECOND HALF IS THE ONE THAT MATTERS. The scalars were removed from prose, so
 * the live surfaces are driven and checked to carry NO scalar shape at all — the four
 * detector classes of the prose-numerics census, applied to the OUTPUT rather than to
 * the source. A source-shaped cure (a float laundered through a differently-named
 * helper) passes the census and fails here.
 */
import { describe, expect, test } from 'vitest';

import {
  RELATION_LEVEL_WORDS,
  relationLevelWordFor,
  relationshipKeyFromEdge,
} from '../../src/domain/worldPulse/relationshipState.js';
import { buildRelationshipPostures } from '../../src/domain/worldPulse/relationshipMemory.js';

const GRID = Array.from({ length: 201 }, (_, i) => i / 200);

describe('TE-HERALD-1 — the relationship level ladder', () => {
  test('every rung is produced across the 0..1 domain', () => {
    expect([...new Set(GRID.map(relationLevelWordFor))].sort())
      .toEqual([...RELATION_LEVEL_WORDS].sort());
  });

  test('junk lands inside the vocabulary rather than emitting undefined at a reader', () => {
    for (const junk of [-5, 5, NaN, Infinity, -Infinity, null, undefined, 'x', {}]) {
      expect(RELATION_LEVEL_WORDS).toContain(relationLevelWordFor(/** @type {any} */ (junk)));
    }
  });

  test('the ladder is monotone and frozen with no duplicate rung', () => {
    const rank = (v) => RELATION_LEVEL_WORDS.indexOf(relationLevelWordFor(v));
    for (let i = 1; i < GRID.length; i += 1) {
      expect(rank(GRID[i])).toBeGreaterThanOrEqual(rank(GRID[i - 1]));
    }
    expect(Object.isFrozen(RELATION_LEVEL_WORDS)).toBe(true);
    expect(new Set(RELATION_LEVEL_WORDS).size).toBe(RELATION_LEVEL_WORDS.length);
  });

  test('the cuts are the declared quarter convention, asserted from both sides', () => {
    for (const cut of [0.25, 0.5, 0.75]) {
      expect(relationLevelWordFor(cut - 1e-9)).not.toBe(relationLevelWordFor(cut));
    }
    expect(relationLevelWordFor(0)).toBe(RELATION_LEVEL_WORDS[0]);
    expect(relationLevelWordFor(1)).toBe(RELATION_LEVEL_WORDS[3]);
  });
});

describe('TE-HERALD-1 — the posture reasons speak words, and the gate is the band', () => {
  const relState = (patch) => ({
    relationshipType: 'rival',
    trust: 0.1,
    resentment: 0.1,
    fear: 0.1,
    dependency: 0.1,
    leverage: 0.1,
    pactStrength: 0.1,
    tradeBalance: 0.5,
    militaryBurden: 0.1,
    obligationFatigue: 0.1,
    overlordWeaknessStreak: 0,
    aidBurden: 0.1,
    memories: [],
    ...patch,
  });
  /**
   * Drive the REAL posture builder over a one-edge world.
   *
   * ⚠ THE KEY IS DERIVED, NOT SPELLED, and the first draft of this file proved why: it
   * hardcoded `'ashford|irontown'`, `ensureRelationshipState` found nothing at that key,
   * and every assertion below ran against DEFAULTS instead of the state it thought it
   * was setting. Two arms passed for the wrong reason and one failed for the wrong
   * reason. `relationshipKeyFromEdge` is the source's own answer to "what is this edge
   * called", so the fixture cannot drift from it.
   */
  const linesOf = (patch) => {
    const edge = { from: 'ashford', to: 'irontown', relationshipType: patch.relationshipType || 'rival' };
    const key = relationshipKeyFromEdge(edge);
    const postures = buildRelationshipPostures({
      worldState: { tick: 5, relationshipStates: { [key]: relState(patch) } },
      regionalGraph: { edges: [edge] },
      currentTick: 5,
    });
    expect(postures.length, 'the one-edge world produced no posture at all — the fixture is wrong')
      .toBe(1);
    return postures.flatMap((row) => (Array.isArray(row.reasons) ? row.reasons : []));
  };

  test('the fixture really reaches the state it sets (the control for every arm below)', () => {
    // If the key were wrong again, this reads the DEFAULT rival state and this arm reds
    // before any of the prose claims can pass for the wrong reason.
    const high = linesOf({ resentment: 0.95 }).join(' | ');
    const low = linesOf({ resentment: 0.05, trust: 0.05, dependency: 0.05 }).join(' | ');
    expect(high).not.toBe(low);
  });

  test('a high-resentment posture is stated in words with no scalar shape', () => {
    const lines = linesOf({ resentment: 0.92 });
    expect(lines.length, 'the view produced no posture prose — the pin would be vacuous')
      .toBeGreaterThan(0);
    const joined = lines.join(' | ');
    expect(joined).toMatch(/High resentment shapes the posture\./);
    // The four census detector classes, applied to the OUTPUT.
    expect(joined).not.toMatch(/\d+\.\d{2}/); // anchored: lines.length > 0 and the positive toMatch above assert THIS string is live
    expect(joined).not.toMatch(/\d\s*%/); // anchored: same live `joined` the positive toMatch above matched
    expect(joined).not.toMatch(/×\s*\d|\d\s*×/); // anchored: same live `joined` the positive toMatch above matched
    expect(joined).not.toMatch(/\((?:0|1)\.\d+\)/); // anchored: same live `joined` the positive toMatch above matched
  });

  test('high trust and dependency are stated the same way', () => {
    const trust = linesOf({ relationshipType: 'trade_partner', trust: 0.9 }).join(' | ');
    expect(trust).toMatch(/High trust keeps the relationship functional\./);
    expect(trust).not.toMatch(/\d+\.\d{2}/); // anchored: the positive toMatch on the line above proves `trust` is live
    const dep = linesOf({ relationshipType: 'trade_partner', dependency: 0.95 }).join(' | ');
    expect(dep).toMatch(/Dependency makes the relationship materially unequal\./);
    expect(dep).not.toMatch(/\d+\.\d{2}/); // anchored: the positive toMatch on the line above proves `dep` is live
  });

  test('BELOW the gate the sentence is absent entirely, so the gate really is the band', () => {
    // This is the control that makes "the gate is the band" a measured claim: the word
    // "High" is honest only because the line cannot appear below the threshold.
    const quiet = linesOf({ resentment: 0.49, trust: 0.1, dependency: 0.1 }).join(' | ');
    // LIVENESS FIRST: the below-gate posture still produces prose, so the absence below is
    // the GATE's doing and not an empty collection.
    expect(quiet.length, 'the below-gate posture produced no prose at all').toBeGreaterThan(0);
    expect(quiet).not.toMatch(/High resentment/); // anchored: `quiet` asserted non-empty above, and `loud` two lines down produces the line from the SAME helper
    const loud = linesOf({ resentment: 0.51 }).join(' | ');
    expect(loud).toMatch(/High resentment/);
  });
});
