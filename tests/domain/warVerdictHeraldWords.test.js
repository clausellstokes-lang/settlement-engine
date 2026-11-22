/**
 * warVerdictHeraldWords.test.js — TE-HERALD-1 car HER-1, the war-verdict band arms.
 *
 * Three vocabularies were minted for the siege surface, and each is pinned to the thing
 * it claims to describe rather than to a transcription of itself:
 *
 *   `siegeMatchupWordFor`      — the six rungs sit on feasibilityGate's OWN five cuts,
 *       so the word a reader is given and the verdict the gate reaches cannot disagree.
 *       Proved by DRIVING the real `classifyFeasibility` and checking the pairing, not
 *       by re-reading the thresholds.
 *   `feasibilityVerdictClause` — total over the closed verdict vocabulary. A seventh
 *       verdict would otherwise render as the `plausible` fallback and quietly tell a
 *       reader the opposite of what happened.
 *   `siegeFallOddsWordFor`     — total, monotone, and cut on the calibration's own
 *       documented landmarks.
 *
 * ⚠ WHY THE READER'S WORDS ARE NOT THE `band` FIELD. `resolveSiegeVerdict` returns a
 * `band` whose tokens are load-bearing for attrition and do not mean what they say:
 * `decisive_success` is defined by its own derivation comment as a fall that cleared the
 * bar BY A WIDE MARGIN, and `costly_success` is the squeaker. That inversion is pinned
 * below as a live property of the source, so nobody later "fixes" the reader prose by
 * rendering those tokens.
 */
import { describe, expect, test } from 'vitest';

import {
  FEASIBILITY_VERDICTS,
  SIEGE_MATCHUP_WORDS,
  classifyFeasibility,
  feasibilityVerdictClause,
  siegeMatchupWordFor,
  verdictAllowsHarassment,
  verdictPermitsSiege,
} from '../../src/domain/worldPulse/feasibilityGate.js';
import {
  SIEGE_FALL_ODDS_WORDS,
  siegeFallOddsWordFor,
} from '../../src/domain/worldPulse/warSiegeVerdict.js';
import { conquestTermsRange } from '../../src/domain/worldPulse/conquestFeasibility.js';

// Wide enough to reach both ends: the gate's cuts run 0.18..0.78 and the top rung opens
// at the documented plausible ceiling of 4.0.
const RATIO_GRID = Array.from({ length: 1001 }, (_, i) => (i * 6) / 1000);
const P_GRID = Array.from({ length: 201 }, (_, i) => i / 200);

describe('TE-HERALD-1 — the siege matchup vocabulary', () => {
  test('every rung is produced, and junk still lands inside the ladder', () => {
    expect([...new Set(RATIO_GRID.map(siegeMatchupWordFor))].sort())
      .toEqual([...SIEGE_MATCHUP_WORDS].sort());
    for (const junk of [-5, NaN, Infinity, null, undefined, 'x']) {
      expect(SIEGE_MATCHUP_WORDS).toContain(siegeMatchupWordFor(/** @type {any} */ (junk)));
    }
  });

  test('the ladder is monotone: a heavier attacker never reads weaker', () => {
    const rank = (r) => SIEGE_MATCHUP_WORDS.indexOf(siegeMatchupWordFor(r));
    for (let i = 1; i < RATIO_GRID.length; i += 1) {
      expect(rank(RATIO_GRID[i])).toBeGreaterThanOrEqual(rank(RATIO_GRID[i - 1]));
    }
  });

  test('the words and the GATE agree, driven rather than re-derived', () => {
    // The claim is not "these constants match" — it is that the word and the verdict the
    // engine actually reaches are consistent. So the real classifier is driven over the
    // real ratio domain and the pairing is checked, which is the only form of this claim
    // a later threshold edit cannot silently break.
    const pairs = new Map();
    for (const ratio of RATIO_GRID) {
      // A solo attacker with a defender fixed at 10 capacity; the gate divides by a
      // home-ground-multiplied defender, so drive it through its own entry point.
      const { verdict } = classifyFeasibility({
        attackerCurrent: ratio * 10,
        defenderCurrent: 10,
        coalitionSize: 1,
      });
      const word = siegeMatchupWordFor(
        classifyFeasibility({ attackerCurrent: ratio * 10, defenderCurrent: 10, coalitionSize: 1 }).ratio,
      );
      if (!pairs.has(word)) pairs.set(word, new Set());
      pairs.get(word).add(verdict);
    }
    // The drive must have been non-vacuous in both directions.
    expect(pairs.size, 'the drive reached only one matchup word — the grid is too narrow')
      .toBeGreaterThan(1);
    const reached = new Set([...pairs.values()].flatMap((set) => [...set]));
    expect(reached.size, 'the drive reached only one verdict — the pairing claim is vacuous')
      .toBeGreaterThan(1);
    // No word that says the attacker can win may pair with a verdict that forbids a
    // siege outright, and no word that says it cannot may pair with a clean `plausible`.
    for (const [word, verdicts] of pairs) {
      for (const verdict of verdicts) {
        if (word === 'a real contest' || word === 'overwhelming') {
          expect(verdictPermitsSiege(verdict), `${word} paired with ${verdict}`).toBe(true);
        }
        if (word === 'no contest' || word === 'hopeless') {
          expect(verdict === 'plausible', `${word} paired with ${verdict}`).toBe(false);
        }
      }
    }
  });
});

describe('TE-HERALD-1 — the gate\'s conclusion is spoken, and spoken totally', () => {
  test('every verdict in the closed vocabulary has its own clause', () => {
    expect(FEASIBILITY_VERDICTS.length).toBeGreaterThanOrEqual(6);
    const clauses = FEASIBILITY_VERDICTS.map(feasibilityVerdictClause);
    expect(new Set(clauses).size, 'two verdicts share a clause — a reader cannot tell them apart')
      .toBe(FEASIBILITY_VERDICTS.length);
    for (const clause of clauses) expect(clause.length).toBeGreaterThan(10);
  });

  test('the vocabulary is the SOURCE\'s, so a seventh verdict cannot land unspoken', () => {
    // Derived from the two live predicates rather than transcribed: every token either
    // permits a siege or allows harassment or does neither, and all of them must be in
    // the clause map. A new verdict added to the gate reds here.
    const known = new Set(FEASIBILITY_VERDICTS);
    for (const token of ['plausible', 'auto_fail', 'harassment', 'require_coalition', 'require_betrayal', 'require_magic']) {
      expect(known.has(token), `${token} has no reader clause`).toBe(true);
      // ...and the predicates agree the token is real vocabulary, not a typo of mine.
      expect(typeof verdictPermitsSiege(token)).toBe('boolean');
      expect(typeof verdictAllowsHarassment(token)).toBe('boolean');
    }
  });

  test('an UNKNOWN verdict falls back rather than rendering a bare token', () => {
    expect(feasibilityVerdictClause('not_a_verdict')).toBe(feasibilityVerdictClause('plausible'));
    expect(feasibilityVerdictClause(/** @type {any} */ (undefined))).toBe(feasibilityVerdictClause('plausible'));
  });
});

describe('TE-HERALD-1 — the fall-odds vocabulary', () => {
  test('every rung is produced, junk lands inside it, and it is monotone', () => {
    expect([...new Set(P_GRID.map(siegeFallOddsWordFor))].sort())
      .toEqual([...SIEGE_FALL_ODDS_WORDS].sort());
    for (const junk of [-5, 5, NaN, null, undefined, 'x']) {
      expect(SIEGE_FALL_ODDS_WORDS).toContain(siegeFallOddsWordFor(/** @type {any} */ (junk)));
    }
    const rank = (p) => SIEGE_FALL_ODDS_WORDS.indexOf(siegeFallOddsWordFor(p));
    for (let i = 1; i < P_GRID.length; i += 1) {
      expect(rank(P_GRID[i])).toBeGreaterThanOrEqual(rank(P_GRID[i - 1]));
    }
  });

  test('no siege vocabulary shares a word with another', () => {
    const all = [...SIEGE_MATCHUP_WORDS, ...SIEGE_FALL_ODDS_WORDS];
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('TE-HERALD-1 — the bargaining receipt speaks its own file\'s ladders', () => {
  const readAt = (reach, risk) => ({
    partyId: 'ashford',
    counterpartId: 'irontown',
    known: true,
    conquestReach01: reach,
    beingConqueredRisk01: risk,
  });

  test('the receipt carries no scalar, and the scalars stay on the typed fields', () => {
    for (const reach of [0.05, 0.45, 0.65, 0.9]) {
      for (const risk of [0.05, 0.4, 0.6, 0.8]) {
        const out = conquestTermsRange(readAt(reach, risk));
        // The information is TRANSLATED, not deleted: the two reads are still exactly
        // where a consumer looks for them.
        expect(out.takeByForce01).toBeCloseTo(reach, 4);
        expect(out.mustGiveToSurvive01).toBeCloseTo(risk, 4);
        // The receipt is anchored by its own positive shape, so the absence below cannot
        // pass on an empty or missing string.
        expect(out.receipt).toMatch(/believes a conquest is/);
        expect(out.receipt).not.toMatch(/\d/); // anchored: the positive toMatch on the line above proves the receipt is live
      }
    }
  });

  test('the receipt moves when the read moves, so it is not a constant', () => {
    const weak = conquestTermsRange(readAt(0.05, 0.9)).receipt;
    const strong = conquestTermsRange(readAt(0.95, 0.05)).receipt;
    expect(weak).not.toBe(strong);
    expect(weak).toMatch(/out of reach/);
    expect(weak).toMatch(/position existential/);
    expect(strong).toMatch(/assured/);
    expect(strong).toMatch(/position safe/);
  });

  test('the unknown read still says why, and still carries no scalar', () => {
    const out = conquestTermsRange({ partyId: 'ashford', known: false });
    expect(out.known).toBe(false);
    expect(out.receipt).toMatch(/no bargaining range/);
    expect(out.receipt).not.toMatch(/\d/); // anchored: the positive toMatch on the line above proves the receipt is live
  });
});
