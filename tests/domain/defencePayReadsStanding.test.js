/**
 * defencePayReadsStanding.test.js — COHERENCE-UPKEEP-6, the chair's ruling 1(b) on REVIEW-UPKEEP-2 (H1, H2):
 * ONE LABEL SPEAKS FOR PAY. Every sentence about paying for defence reads the standing label (the label
 * with no crisis in force) through its one home, `keep.js :: standingLabelOf` / `keepOfRecord`: the
 * PDF's money line (`threatAssessment.js`, the Economic Survival row) and the guard assessment's purse
 * lines (`safetyProfile.js :: keptGuardLine`, called at `economicState.js`). A town saved before the
 * standing label existed reads as it did (its line is the stored score's, unchanged).
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

  test('RED-FIRST: the money line reads the standing label, not the supply score', () => {
    // A Prosperous city in a famine, its supply score low: money enough for a long crisis.
    const rich = moneyLine(record(30, { prosperity: 'Struggling', prosperityStanding: 'Prosperous' }));
    expect(rich).toBe(moneyLine(record(90, { prosperity: 'Prosperous', prosperityStanding: 'Prosperous' })));
    expect(rich.startsWith('Money enough to ride out a long crisis')).toBe(true);
    // A Poor town with a full supply score: the defenders already paid late.
    const poor = moneyLine(record(90, { prosperity: 'Poor', prosperityStanding: 'Poor' }));
    expect(poor.startsWith('The defenders are already paid late')).toBe(true);
    expect(moneyLine(record(90, { prosperity: 'Moderate', prosperityStanding: 'Moderate' })).startsWith('Money enough for a short crisis')).toBe(true);
    expect(moneyLine(record(90, { prosperity: 'Comfortable', prosperityStanding: 'Comfortable' })).startsWith('Money enough for a short crisis'), 'the rungs the purse lines read').toBe(true);
    expect(moneyLine(record(90, { prosperity: 'Struggling', prosperityStanding: 'Struggling' })).startsWith('There is no money')).toBe(true);
  });

  test('a town saved before the standing label existed reads its stored score, as before', () => {
    expect(moneyLine(record(70, { prosperity: 'Struggling' })).startsWith('Money enough to ride out a long crisis')).toBe(true);
    expect(moneyLine(record(30, { prosperity: 'Wealthy' })).startsWith('The defenders are already paid late')).toBe(true);
  });
});
