/**
 * pactAmendment.test.js — the standing instrument, its lineage, and the two doors that
 * change it without minting a second document.
 *
 * THE LOAD-BEARING CLAIM here is negative and it is about the WAR DOOR: widening the §13
 * stacking axis to family × beneficiary must cost the war-end path exactly nothing. A
 * war-end term carries no `beneficiary` key, so its cell is the bare `family|` it always
 * was, and two war-end terms of one family still collide. That is asserted directly rather
 * than argued, because "the other door is unchanged" is the kind of claim that is true when
 * written and false three edits later.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  PACT_ENDINGS,
  PACT_LINEAGE_ACTS,
  PACT_PROVENANCE,
  absorbWarEndIntoStandingPact,
  amendPactInstrument,
  appendLineage,
  closeTermsBrokenByWar,
  lineageOf,
  provenanceOf,
  stackingCellOf,
  termIdOf,
} from '../../src/domain/worldPulse/pactAmendment.js';
import { pactWorld } from '../helpers/pactFixture.js';

/** A term as the WAR door writes one: no beneficiary key at all. */
const warTerm = (type, family, over = {}) => ({
  type, family, magnitude: 0.4, mintedTick: 5, expiresTick: 500, ...over,
});
/** A term as the PEACETIME door writes one: a beneficiary, always. */
const pactTerm = (type, family, beneficiary, over = {}) => ({
  ...warTerm(type, family, over), beneficiary,
});

const legacyTreaty = (terms) => ({
  parties: ['A', 'B'], mintedTick: 5, terms, complianceState: 'honored',
});

describe('the closed vocabularies', () => {
  test('acts, endings and provenance are frozen and codepoint-ordered', () => {
    expect(PACT_LINEAGE_ACTS).toEqual(['amended', 'broken_by_war', 'formed', 'war_ended']);
    expect(PACT_ENDINGS).toEqual([
      'broken_by_war', 'expired_unanswered', 'no_overlap', 'refused', 'signed',
    ]);
    expect(PACT_PROVENANCE).toEqual(['converted', 'dictated', 'negotiated', 'renewed']);
    for (const list of [PACT_LINEAGE_ACTS, PACT_ENDINGS, PACT_PROVENANCE]) {
      expect(Object.isFrozen(list)).toBe(true);
    }
  });
});

describe('PROVENANCE and LINEAGE are RESOLVED AT READ, never written back', () => {
  test('a legacy record with no provenance reads `dictated` and stays unmarked', () => {
    const treaty = legacyTreaty([warTerm('tribute', 'economic')]);
    expect(provenanceOf(treaty)).toBe('dictated');
    // The read did not materialize the default onto the record — the V-5 discipline.
    expect(Object.prototype.hasOwnProperty.call(treaty, 'provenance')).toBe(false);
  });

  test('an invented provenance word resolves to the legacy default rather than surviving', () => {
    expect(provenanceOf({ provenance: 'improvised' })).toBe('dictated');
    expect(provenanceOf({ provenance: 'negotiated' })).toBe('negotiated');
    expect(provenanceOf(null)).toBe('dictated');
  });

  test('a legacy record with no lineage reads ONE implied `formed` act, and stays unmarked', () => {
    const treaty = legacyTreaty([warTerm('tribute', 'economic')]);
    const history = lineageOf(treaty);
    expect(history).toHaveLength(1);
    expect(history[0].act).toBe('formed');
    expect(history[0].tick).toBe(5);
    expect(Object.prototype.hasOwnProperty.call(treaty, 'lineage')).toBe(false);
  });
});

describe('TERM IDENTITY — derived, never stored, and unique per stacking cell', () => {
  test('the beneficiary is PART of the id, which is what a reciprocal sheet needs', () => {
    // ⚠ THE MEASURED DEFECT this asserts against: with a `type.mintedTick` id, the two
    // legs of a grain-for-ore sheet — one type, one tick, opposed beneficiaries — got the
    // SAME name, and the lineage recorded one clause twice while the instrument carried
    // two. Caught by driving a real reciprocal signing, not by reading the code.
    const toA = pactTerm('resource_share', 'economic', 'A');
    const toB = pactTerm('resource_share', 'economic', 'B');
    expect(termIdOf(toA)).not.toBe(termIdOf(toB));
    expect(termIdOf(toA)).toBe('resource_share.A.5');
  });

  test('a war-end term lands on the empty beneficiary segment', () => {
    expect(termIdOf(warTerm('tribute', 'economic'))).toBe('tribute..5');
  });
});

describe('THE STACKING CELL — and the war door is measurably unchanged', () => {
  test('two war-end terms of one family still COLLIDE, exactly as before', () => {
    expect(stackingCellOf(warTerm('tribute', 'economic')))
      .toBe(stackingCellOf(warTerm('reparations', 'economic')));
    expect(stackingCellOf(warTerm('tribute', 'economic'))).toBe('economic|');
  });

  test('two peacetime terms of one family with OPPOSED beneficiaries do not', () => {
    expect(stackingCellOf(pactTerm('resource_share', 'economic', 'A')))
      .not.toBe(stackingCellOf(pactTerm('resource_share', 'economic', 'B')));
  });

  test('a peacetime term never collides with a war-end term of the same family', () => {
    expect(stackingCellOf(pactTerm('resource_share', 'economic', 'A')))
      .not.toBe(stackingCellOf(warTerm('tribute', 'economic')));
  });
});

describe('AMENDMENT — the append that keeps one instrument per pair', () => {
  test('a free cell is added and the act is recorded with its term ids', () => {
    const treaty = legacyTreaty([warTerm('non_aggression', 'security')]);
    const result = amendPactInstrument({
      treaty, terms: [pactTerm('resource_share', 'economic', 'A')], tick: 40,
    });
    expect(result.added).toHaveLength(1);
    expect(result.refused).toHaveLength(0);
    expect(result.treaty.terms).toHaveLength(2);
    const history = lineageOf(result.treaty);
    expect(history[history.length - 1]).toMatchObject({
      act: 'amended', tick: 40, termIds: ['resource_share.A.5'],
    });
  });

  test('THE STACKING REFUSAL is receipted with its cell named, never silently dropped', () => {
    const treaty = legacyTreaty([pactTerm('resource_share', 'economic', 'A')]);
    const result = amendPactInstrument({
      treaty, terms: [pactTerm('resource_share', 'economic', 'A')], tick: 40,
    });
    expect(result.added).toHaveLength(0);
    expect(result.refused).toHaveLength(1);
    expect(result.refused[0].cell).toBe('economic|A');
    expect(result.refused[0].receipt).toContain('term_refused_stacking');
  });

  test('a WHOLLY refused amendment leaves the record byte-identical', () => {
    const treaty = legacyTreaty([pactTerm('resource_share', 'economic', 'A')]);
    const before = JSON.stringify(treaty);
    const result = amendPactInstrument({
      treaty, terms: [pactTerm('resource_share', 'economic', 'A')], tick: 40,
    });
    expect(result.treaty).toBe(treaty);
    expect(JSON.stringify(result.treaty)).toBe(before);
  });

  test('a LAPSED clause occupies nothing — the pair is not blocked forever', () => {
    const treaty = legacyTreaty([pactTerm('resource_share', 'economic', 'A', { expiresTick: 30 })]);
    const result = amendPactInstrument({
      treaty, terms: [pactTerm('resource_share', 'economic', 'A', { mintedTick: 40 })], tick: 40,
    });
    expect(result.added).toHaveLength(1);
    expect(result.refused).toHaveLength(0);
  });

  test('a partial amendment adds what it can and refuses the rest, in one act', () => {
    const treaty = legacyTreaty([pactTerm('resource_share', 'economic', 'A')]);
    const result = amendPactInstrument({
      treaty,
      terms: [
        pactTerm('resource_share', 'economic', 'A'),
        pactTerm('non_aggression', 'security', 'both'),
      ],
      tick: 40,
    });
    expect(result.added).toHaveLength(1);
    expect(result.refused).toHaveLength(1);
    expect(lineageOf(result.treaty).filter((e) => e.act === 'amended')).toHaveLength(1);
  });

  test('an act outside the closed vocabulary appends NOTHING', () => {
    const treaty = legacyTreaty([]);
    expect(appendLineage(treaty, { act: 'improvised', tick: 1 })).toBe(treaty);
  });
});

describe('THE WAR-OVERTAKEN CLOSURE — the `broken_by_war` producer', () => {
  const negotiated = {
    parties: ['A', 'B'],
    mintedTick: 5,
    provenance: 'negotiated',
    complianceState: 'honored',
    terms: [
      pactTerm('resource_share', 'economic', 'A'),
      warTerm('tribute', 'economic', { mintedTick: 1 }),
    ],
    lineage: [{ act: 'formed', tick: 5, termIds: ['resource_share.A.5'] }],
  };

  const worldWith = (flag) => pactWorld({ flag, treaties: { 'A>B': JSON.parse(JSON.stringify(negotiated)) } });

  test('DARK: it reads nothing and returns the SAME worldState reference', () => {
    const dark = worldWith(undefined);
    const result = closeTermsBrokenByWar({ worldState: dark, aId: 'A', bId: 'B', tick: 60 });
    expect(result.worldState).toBe(dark);
    expect(result.closed).toHaveLength(0);
    expect(result.receipt).toBe('');
  });

  test('LIT: only the NEGOTIATED clauses end — a dictated one on the same paper survives', () => {
    const result = closeTermsBrokenByWar({ worldState: worldWith(true), aId: 'A', bId: 'B', tick: 60 });
    expect(result.closed).toEqual(['resource_share.A.5']);
    const treaty = result.worldState.spatialLedgers.treaties['A>B'];
    expect(treaty.terms.map((t) => t.type)).toEqual(['tribute']);
    const last = lineageOf(treaty).at(-1);
    expect(last.act).toBe('broken_by_war');
    expect(last.ending).toBe('broken_by_war');
    expect(result.receipt).toContain('ended what they had written down in peace');
  });

  test('it mints EXACTLY ONCE — a second pass over the closed instrument does nothing', () => {
    const first = closeTermsBrokenByWar({ worldState: worldWith(true), aId: 'A', bId: 'B', tick: 60 });
    const second = closeTermsBrokenByWar({ worldState: first.worldState, aId: 'A', bId: 'B', tick: 61 });
    expect(second.worldState).toBe(first.worldState);
    expect(second.closed).toHaveLength(0);
  });

  test('it finds the pair in EITHER direction, and refuses a pair with no instrument', () => {
    expect(closeTermsBrokenByWar({ worldState: worldWith(true), aId: 'B', bId: 'A', tick: 60 }).closed)
      .toEqual(['resource_share.A.5']);
    expect(closeTermsBrokenByWar({ worldState: worldWith(true), aId: 'A', bId: 'Z', tick: 60 }).closed)
      .toHaveLength(0);
  });

  test('an ALREADY-LAPSED negotiated clause is not closed twice by the war', () => {
    const lapsed = pactWorld({
      flag: true,
      treaties: {
        'A>B': {
          ...negotiated,
          terms: [pactTerm('resource_share', 'economic', 'A', { expiresTick: 30 })],
        },
      },
    });
    expect(closeTermsBrokenByWar({ worldState: lapsed, aId: 'A', bId: 'B', tick: 60 }).closed)
      .toHaveLength(0);
  });
});

describe('THE WAR DOOR SEAM — the one edit peaceTerms.js takes', () => {
  const ledgerWith = () => ({ 'A>B': legacyTreaty([warTerm('tribute', 'economic')]) });

  test('DARK: it returns false before reading, so PASS 1 runs byte-identically', () => {
    const ledger = ledgerWith();
    const before = JSON.stringify(ledger);
    const absorbed = absorbWarEndIntoStandingPact({
      ledger, worldState: pactWorld({}), victorId: 'A', loserId: 'B', tick: 60,
    });
    expect(absorbed).toBe(false);
    expect(JSON.stringify(ledger)).toBe(before);
  });

  test('LIT with NO standing instrument: false, and the ledger is untouched', () => {
    const ledger = {};
    expect(absorbWarEndIntoStandingPact({
      ledger, worldState: pactWorld({ flag: true }), victorId: 'A', loserId: 'B', tick: 60,
    })).toBe(false);
    expect(Object.keys(ledger)).toHaveLength(0);
  });

  test('LIT with a standing instrument: the war end is ABSORBED as a lineage act', () => {
    const ledger = ledgerWith();
    expect(absorbWarEndIntoStandingPact({
      ledger, worldState: pactWorld({ flag: true }), victorId: 'A', loserId: 'B', tick: 60,
    })).toBe(true);
    const history = lineageOf(ledger['A>B']);
    expect(history.at(-1)).toMatchObject({ act: 'war_ended', tick: 60 });
    // The legacy record's implied `formed` act was materialized alongside it, so the
    // history a reader gets back is TOTAL rather than starting mid-story.
    expect(history[0].act).toBe('formed');
    expect(history).toHaveLength(2);
  });

  test('it finds the standing instrument in the LOSER-first direction too', () => {
    const ledger = { 'B>A': legacyTreaty([warTerm('tribute', 'economic')]) };
    expect(absorbWarEndIntoStandingPact({
      ledger, worldState: pactWorld({ flag: true }), victorId: 'A', loserId: 'B', tick: 60,
    })).toBe(true);
  });
});
