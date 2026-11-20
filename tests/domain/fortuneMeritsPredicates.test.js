/**
 * fortuneMeritsPredicates.test.js — U5a, THE MERITS OF RULE'S PREDICATES (FORTUNE-3, the chair's seven conditions of
 * 2026-11-20 15:30 UTC and its rulings of 16:45 and 18:38 UTC), on BUILT records, DARK.
 *
 * ⭐ WHAT THIS FILE PROVES (the brief's arms (c) and (e), the ruling (C), and the rulings of 19:33 and 19:38 UTC):
 *   (c) each predicate of `src/domain/fortune/fortuneMerits.js` on built records: a catastrophe at the window's edge
 *       counts and one past it does not; one whose kind is among today's tensions does not; one the legacy generator
 *       calls unresolved does not; the merit counts only upward, never below the Tolerated cut, never with a tension of
 *       the ruler's kinds; one reason never reaches Endorsed; under law 1 (no marker) nothing counts and nothing moves;
 *       and NO capture rung and NO governing power is read: every rung of the ladder, and a tension naming the seat,
 *       give the same merits and the same score.
 *   (e) CONDITION 4: every unresolved annotation `deriveLegacyAnnotations` writes is matched; the same annotation in a
 *       made-up wording of the same meaning is NOT (the pin: re-voicing the line outside the one list reds here); the
 *       list is the legacy generator's own (re-exported by it, the same frozen object as the data leaf's).
 *   (C) the step starts from `score - (breakdown.merits ?? 0)`: run twice, it returns equal results.
 * (The brief's arm (d), condition 5's trait lists, is RETIRED with the principled merit: the chair's ruling of 19:38.)
 *
 * Every expectation is COMPUTED from `FORTUNE_LAW_TUNING`, `LEGITIMACY_CUTS`, the predicates and the generator's own
 * list; none is quoted.
 *
 * @enforced-by this test
 */
import { describe, expect, it } from 'vitest';

import {
  isUnresolvedLegacyNote,
  meritedLegitimacy,
  meritsOf,
  rulerTroubled,
  settleMeritsOfRule,
  weatheredCatastrophe,
  MERIT_NAMES,
} from '../../src/domain/fortune/fortuneMerits.js';
import {
  FORTUNE_LAW_CONFIG_KEY,
  FORTUNE_LAW_TUNING,
  SIZE_RELATIVE_FORTUNE_LAW_VERSION,
} from '../../src/domain/fortune/fortuneLaw.js';
import { LEGITIMACY_CUTS } from '../../src/data/bandLadders.js';
import { UNRESOLVED_LEGACY_WORDINGS } from '../../src/data/legacyUnresolvedWordings.js';
import {
  UNRESOLVED_LEGACY_WORDINGS as GENERATOR_WORDINGS,
  deriveLegacyAnnotations,
} from '../../src/generators/legacyGenerator.js';
import { legitimacyBandFor, withCaptureRelations } from '../../src/generators/factionDynamics.js';
import { CAPTURE_RUNGS } from '../../src/data/people/dmPowerLines.js';
import { settleStandingToLegitimacy } from '../../src/generators/power/rosterText.js';

const STANDING = /** @type {any} */ (FORTUNE_LAW_TUNING.standing);
const SEAMS = { bandFor: legitimacyBandFor, recapture: withCaptureRelations, restand: settleStandingToLegitimacy };
const SEAT = 'Town Council';
const KIND = STANDING.weatheredSeverity;

/** A legitimacy object of the birth's shape at a score, with its terms. @param {number} score @param {Record<string, number>} [terms] */
const legitimacyAt = (score, terms = { prosperity: 0, safety: 0, defense: 0, food: 0 }) => {
  const band = legitimacyBandFor(score);
  return {
    score, label: band.label, color: band.color, bg: band.bg, breakdown: { ...terms },
    govMultiplier: band.govMultiplier, crimMultiplier: band.crimMultiplier,
    isEndorsed: band.isEndorsed, isApproved: band.isApproved, isTolerated: band.isTolerated, isContested: band.isContested,
    isLegitimacyCrisis: band.isLegitimacyCrisis, governanceFractured: band.governanceFractured,
  };
};

/**
 * A built record: a seat, a history and a standing.
 * @param {{ score?: number, terms?: Record<string, number>, events?: any[], tensions?: any[], notes?: any[],
 *   capture?: string, law?: unknown, seat?: string }} [o]
 */
const recordOf = (o = {}) => ({
  config: o.law === undefined ? { [FORTUNE_LAW_CONFIG_KEY]: SIZE_RELATIVE_FORTUNE_LAW_VERSION } : o.law === null ? {} : { [FORTUNE_LAW_CONFIG_KEY]: o.law },
  history: { historicalEvents: o.events ?? [], currentTensions: o.tensions ?? [], legacyAnnotations: o.notes ?? [] },
  powerStructure: {
    governingName: o.seat ?? SEAT,
    factions: [{ faction: o.seat ?? SEAT, power: 60, isGoverning: true, desc: '' }],
    criminalCaptureState: o.capture ?? 'none',
    publicLegitimacy: legitimacyAt(o.score ?? LEGITIMACY_CUTS.tolerated, o.terms),
  },
});
const catastrophe = (yearsAgo, templateType = 'flood', name = 'The Flood') => ({ name, severity: KIND, yearsAgo, templateType, type: 'disaster' });

describe('U5a (c) — the predicates on built records', () => {
  it('weathered: a catastrophe at the window\'s edge counts, one past it does not, a lesser grade does not', () => {
    const edge = STANDING.weatheredWithinYears;
    expect(weatheredCatastrophe(recordOf({ events: [catastrophe(edge)] }))?.yearsAgo).toBe(edge);
    expect(weatheredCatastrophe(recordOf({ events: [catastrophe(edge + 1)] }))).toBe(null);
    expect(weatheredCatastrophe(recordOf({ events: [{ ...catastrophe(1), severity: `not ${KIND}` }] }))).toBe(null);
  });

  it('weathered: a catastrophe whose kind is among today\'s tensions does not count', () => {
    const ev = catastrophe(5);
    expect(weatheredCatastrophe(recordOf({ events: [ev], tensions: [{ type: ev.templateType, factions: [] }] }))).toBe(null);
  });

  it('weathered: a catastrophe the legacy generator calls unresolved does not count; another annotation of it does', () => {
    const ev = catastrophe(5);
    const unresolved = { eventName: ev.name, yearsAgo: ev.yearsAgo, annotation: `x ${UNRESOLVED_LEGACY_WORDINGS[0]}: y` };
    expect(weatheredCatastrophe(recordOf({ events: [ev], notes: [unresolved] }))).toBe(null);
    const other = { ...unresolved, annotation: 'x hit the settlement hard: y' };
    expect(weatheredCatastrophe(recordOf({ events: [ev], notes: [other] }))?.name).toBe(ev.name);
    // the annotation is matched to ITS event by name and age: an unresolved line about another event leaves this one weathered
    const elsewhere = { ...unresolved, yearsAgo: ev.yearsAgo + 1 };
    expect(weatheredCatastrophe(recordOf({ events: [ev], notes: [elsewhere] }))?.name).toBe(ev.name);
  });

  it('the ruler is troubled by a tension of the ruler\'s kinds, NEVER by which power governs or by a capture rung', () => {
    expect(rulerTroubled(recordOf())).toBe(false);
    for (const kind of STANDING.rulerTroubleKinds) expect(rulerTroubled(recordOf({ tensions: [{ type: kind, factions: [] }] }))).toBe(true);
    // the seat-match is gone (it read which power governs): a tension naming the seat, of no ruler's kind, is no trouble
    expect(rulerTroubled(recordOf({ tensions: [{ type: 'a quarrel of no kind', factions: [SEAT] }] }))).toBe(false);
    const named = (/** @type {string} */ seat) => settleMeritsOfRule(recordOf({ seat, events: [catastrophe(2)], tensions: [{ type: 'a quarrel of no kind', factions: [SEAT] }] }), SEAMS).powerStructure.publicLegitimacy;
    expect(named(SEAT)).toEqual(named('Someone Else'));
    expect(CAPTURE_RUNGS.length).toBeGreaterThan(2);
    for (const rung of CAPTURE_RUNGS) expect(rulerTroubled(recordOf({ capture: rung }))).toBe(false);
  });

  it('the capture rung is never read: every rung of the ladder, the same merits and the same score', () => {
    const settle = (/** @type {string} */ rung) => settleMeritsOfRule(recordOf({ events: [catastrophe(2)], capture: rung }), SEAMS);
    const plain = settle(CAPTURE_RUNGS[0]);
    expect(plain.powerStructure.publicLegitimacy.breakdown.merits).toBeGreaterThan(0);
    for (const rung of CAPTURE_RUNGS) {
      const rec = settle(rung);
      expect(meritsOf(rec)).toEqual(meritsOf(plain));
      expect(rec.powerStructure.publicLegitimacy).toEqual(plain.powerStructure.publicLegitimacy);
    }
  });

  it('meritsOf names the merits in the fixed order, only under the law, only at Tolerated or better, never with trouble', () => {
    const both = { events: [catastrophe(3)] };
    expect(meritsOf(recordOf(both))).toEqual([...MERIT_NAMES]);
    expect(meritsOf(recordOf())).toEqual([]);
    expect(meritsOf(recordOf({ ...both, law: null }))).toEqual([]);
    expect(meritsOf(recordOf({ ...both, law: 1 }))).toEqual([]);
    expect(meritsOf(recordOf({ ...both, law: '2' }))).toEqual([]);
    expect(meritsOf(recordOf({ ...both, score: LEGITIMACY_CUTS.tolerated - 1 }))).toEqual([]);
    expect(meritsOf(recordOf({ ...both, tensions: [{ type: STANDING.rulerTroubleKinds[0], factions: [] }] }))).toEqual([]);
  });
});

describe('U5a (c) — the arithmetic: only upward, the Tolerated gate, the two-reason guard', () => {
  /** the rule, computed from the table: the score a base reaches with n merits and its positive terms */
  const expected = (base, n, positiveTerms) => {
    const raised = Math.max(0, Math.min(100, base + STANDING.meritPoints * n));
    return raised >= LEGITIMACY_CUTS.endorsed && n + positiveTerms < STANDING.endorsedMinReasons
      ? Math.max(base, LEGITIMACY_CUTS.endorsed - 1) : raised;
  };

  it('every base from the gate to 100, with one merit and two, with and without a positive term', () => {
    for (let base = LEGITIMACY_CUTS.tolerated; base <= 100; base++) {
      for (const names of [[], [...MERIT_NAMES]]) {
        for (const terms of [{ prosperity: 0, safety: 0, defense: 0, food: 0 }, { prosperity: 1, safety: 0, defense: 0, food: 0 }]) {
          const pl = legitimacyAt(base, terms);
          const next = meritedLegitimacy(pl, names, legitimacyBandFor);
          const want = expected(base, names.length, Object.values(terms).filter((v) => v > 0).length);
          expect(next.score).toBe(want);
          expect(next.score).toBeGreaterThanOrEqual(base);
          // the stored band IS the band of the stored score, the whole tuple, through the one band derivation
          const { score, breakdown, ...tuple } = next;
          expect(tuple).toEqual((({ score: _s, breakdown: _b, ...rest }) => rest)(legitimacyAt(want)));
          expect(Object.keys(next)).toEqual(Object.keys(pl));
          if (want === base) expect(next).toBe(pl);
          else expect(breakdown).toEqual({ ...terms, merits: want - base });
        }
      }
    }
  });

  it('one reason never reaches Endorsed; the merit and a positive term can', () => {
    const at = LEGITIMACY_CUTS.endorsed - STANDING.meritPoints;
    const lone = meritedLegitimacy(legitimacyAt(at), [...MERIT_NAMES], legitimacyBandFor);
    expect(lone.isEndorsed).toBe(false);
    expect(lone.score).toBe(LEGITIMACY_CUTS.endorsed - 1);
    const twoReasons = meritedLegitimacy(legitimacyAt(at, { prosperity: 1, safety: 0, defense: 0, food: 0 }), [...MERIT_NAMES], legitimacyBandFor);
    expect(twoReasons.isEndorsed).toBe(true);
  });

  it('no merit: the same object, no `merits` key', () => {
    const pl = legitimacyAt(LEGITIMACY_CUTS.approved);
    expect(meritedLegitimacy(pl, [], legitimacyBandFor)).toBe(pl);
  });
});

describe('U5a (C) — the step starts from score - merits: run twice, the same', () => {
  it('a weathered catastrophe: one run moves it, a second moves nothing more', () => {
    const rec = recordOf({ events: [catastrophe(2)] });
    const before = rec.powerStructure.publicLegitimacy;
    const once = settleMeritsOfRule(rec, SEAMS);
    const first = JSON.stringify(once);
    expect(once.powerStructure.publicLegitimacy.score).toBe(before.score + MERIT_NAMES.length * STANDING.meritPoints);
    const twice = settleMeritsOfRule(once, SEAMS);
    expect(JSON.stringify(twice)).toBe(first);
    expect(twice.powerStructure.publicLegitimacy).toBe(once.powerStructure.publicLegitimacy);
  });

  it('a record whose stored merits no longer hold (the ruler now troubled) falls back to its base', () => {
    const rec = settleMeritsOfRule(recordOf({ events: [catastrophe(2)] }), SEAMS);
    const base = rec.powerStructure.publicLegitimacy.score - rec.powerStructure.publicLegitimacy.breakdown.merits;
    rec.history.currentTensions = [{ type: STANDING.rulerTroubleKinds[0], factions: [] }];
    const out = settleMeritsOfRule(rec, SEAMS);
    expect(out.powerStructure.publicLegitimacy.score).toBe(base);
    expect('merits' in out.powerStructure.publicLegitimacy.breakdown).toBe(false);
  });

  it('under law 1 (no marker, 1, garbage) the record is returned untouched, not one key read past the law', () => {
    for (const law of [null, 1, '2', 3]) {
      const rec = recordOf({ events: [catastrophe(2)], law });
      const text = JSON.stringify(rec);
      const out = settleMeritsOfRule(rec, SEAMS);
      expect(out).toBe(rec);
      expect(JSON.stringify(out)).toBe(text);
    }
  });
});

describe('U5a (e) — CONDITION 4: the legacy clause reads no free text', () => {
  /** a record whose legitimacy is fractured and whose political event the generator calls unresolved */
  const legacyRecord = () => {
    const ev = { name: 'The Usurpation', type: 'political', severity: KIND, yearsAgo: 12, lastingEffects: [] };
    return {
      ev,
      history: { historicalEvents: [ev] },
      settlement: { config: {}, economicState: {}, powerStructure: { factions: [], publicLegitimacy: legitimacyAt(LEGITIMACY_CUTS.contested - 1) } },
    };
  };

  it('the list is ONE object: the data leaf\'s, re-exported by the legacy generator, frozen', () => {
    expect(GENERATOR_WORDINGS).toBe(UNRESOLVED_LEGACY_WORDINGS);
    expect(Object.isFrozen(UNRESOLVED_LEGACY_WORDINGS)).toBe(true);
    expect(UNRESOLVED_LEGACY_WORDINGS.length).toBeGreaterThan(0);
  });

  it('every unresolved annotation the generator writes is matched; the same meaning re-worded is not', () => {
    const { ev, history, settlement } = legacyRecord();
    const notes = deriveLegacyAnnotations(history, settlement);
    const unresolved = notes.filter((n) => UNRESOLVED_LEGACY_WORDINGS.some((w) => n.annotation.includes(w)));
    expect(unresolved.length).toBeGreaterThan(0);
    for (const note of unresolved) {
      expect(isUnresolvedLegacyNote(note, ev)).toBe(true);
      // the PIN: the line re-voiced outside the one list (a made-up wording of the same meaning) is not read
      const reworded = { ...note, annotation: UNRESOLVED_LEGACY_WORDINGS.reduce((text, w) => text.split(w).join('left damage nobody ever mended'), note.annotation) };
      expect(reworded.annotation).not.toBe(note.annotation);
      expect(isUnresolvedLegacyNote(reworded, ev)).toBe(false);
      // and the catastrophe is then (wrongly) weathered: re-voicing the generator's line without the list moves standing
      const rec = recordOf({ events: [{ ...ev, templateType: 'usurpation' }], notes: [reworded] });
      expect(weatheredCatastrophe(rec)?.name).toBe(ev.name);
      expect(weatheredCatastrophe(recordOf({ events: [{ ...ev, templateType: 'usurpation' }], notes: [note] }))).toBe(null);
    }
  });
});
