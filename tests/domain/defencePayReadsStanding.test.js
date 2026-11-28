/**
 * defencePayReadsStanding.test.js — COHERENCE-UPKEEP-6, the chair's ruling 1(b) on REVIEW-UPKEEP-2 (H1, H2):
 * ONE LABEL SPEAKS FOR PAY. Every sentence about paying for defence reads the standing label (the label
 * with no crisis in force) through its one home, `keep.js :: standingLabelOf` / `keepOfRecord`: the
 * PDF's money line (`threatAssessment.js`, the Economic Survival row) and the guard assessment's purse
 * lines (`safetyProfile.js :: keptGuardLine`, called at `economicState.js`). The PDF's money line reads
 * its row's own score, which is paid at the standing label (the cure of 0c0e8f99f; see the test).
 */
import { describe, expect, test } from 'vitest';
import { buildThreatAssessment } from '../../src/domain/display/threatAssessment.js';
import { standingLabelOf, keepOfRecord, keepOf } from '../../src/domain/facts/keep.js';

const roster = [{ name: 'Town walls', category: 'Defense' }, { name: 'Garrison', category: 'Defense' }, { name: 'Town watch', category: 'Defense' }];
/** A record as the generator stores it; only the fields the row reads. */
const record = (economic, economicState) => ({
  institutions: roster, config: { monsterThreat: 'heartland' },
  defenseProfile: { scores: { military: 70, monster: 50, internal: 50, economic, disaster: 50 } },
  economicState: { safetyProfile: {}, ...economicState },
});
const moneyLine = (r) => buildThreatAssessment(r).find((row) => row.label === 'Economic Survival').assess;

describe('one label speaks for pay (ruling 1(b))', () => {
  test('the one home answers the standing label, and the printed one where a record has none', () => {
    expect(standingLabelOf({ prosperity: 'Struggling', prosperityStanding: 'Prosperous' })).toBe('Prosperous');
    expect(standingLabelOf({ prosperity: 'Poor' })).toBe('Poor');
    expect(keepOfRecord({ prosperity: 'Struggling', prosperityStanding: 'Prosperous' })).toEqual(keepOf('Prosperous'));
  });

  // Re-keyed at COHERENCE-UPKEEP-6's cure of 0c0e8f99f (the thirty-town read of ruling 1(c)): keyed to the
  // standing label, the money line disagreed with its own row's badge and with the screen's row. It reads its
  // row's OWN score, which is itself paid at the standing label (keepOfRecord): one label speaks through it.
  test('the money line speaks for the same number as its row\'s badge, in every record shape', () => {
    const rowOf = (r) => buildThreatAssessment(r).find((row) => row.label === 'Economic Survival');
    for (const [economic, words] of [[90, 'Money enough to ride out a long crisis'], [50, 'Money enough for a short crisis'], [30, 'The defenders are already paid late'], [10, 'There is no money']]) {
      for (const es of [{ prosperity: 'Struggling', prosperityStanding: 'Prosperous' }, { prosperity: 'Poor', prosperityStanding: 'Poor' }, { prosperity: 'Wealthy' }]) {
        const row = rowOf(record(economic, es));
        expect(row.assess.startsWith(words), `${economic} ${JSON.stringify(es)}`).toBe(true);
        expect(row.color, 'anchored: one number, one colour').toBe(rowOf(record(economic, { prosperity: 'Moderate' })).color);
      }
    }
  });
});
