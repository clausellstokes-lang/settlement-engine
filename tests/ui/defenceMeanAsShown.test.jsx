/** @vitest-environment jsdom */
/**
 * defenceMeanAsShown.test.jsx — P9b-2 (the tenth chair's G68 on the second reader of 119-C, findings 4 and 5): EVERY DEFENCE
 * MEAN READS THE SCORES AS PRINTED, AND A SCORE THAT IS NOT A NUMBER IS NOT MADE ONE.
 * (P1) `SummaryTab.jsx`'s Defense tile averaged five STORED keys: soak1k-14 printed "Systems average: Critical" where the mean
 * of the scores as printed (`beastsReadiness.js :: scoresAsShown`, the five other means' leaf, P9b) bands Weak. THE ORACLE is
 * the canonical posture every other surface prints (`dossierViewModel.js :: deriveDefensePosture`), read beside the tile.
 * (P2) on a hand-made record (settled country, a monster score that is not a number, no readiness label) the mean went from
 * null to 40, and the PDF's `defenseHeadline` printed "Defences: no walls and no organized force." where the line was silent.
 * RED FIRST at 12c77ae3f: both.
 */
import React from 'react';
import { beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import SummaryTab from '../../src/components/new/SummaryTab.jsx';
import { deriveDefensePosture } from '../../src/domain/display/dossierViewModel.js';
import { avgScore, scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { scoresAsShown } from '../../src/domain/facts/beastsReadiness.js';
import { defenseHeadline } from '../../src/pdf/lib/headlines.js';
import { statusCase } from '../../src/components/new/labelLadder.js';
import { birth as soakBirth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

beforeAll(async () => { await ensureLaws(); }, 120000);

describe('P1: the Summary tab\'s Defense tile reads the mean of the scores as printed', () => {
  test('soak1k-14: the tile\'s "Systems average" is the band of the canonical mean (Weak), not of the stored five (Critical)', () => {
    const s = soakBirth(14).settlement;
    const canon = deriveDefensePosture(s).scoreAvg;
    expect(statusCase(scoreBand(canon))).toBe('Weak'); // not vacuous: the mean as printed bands Weak here
    const st = s.defenseProfile.scores;
    expect(scoreBand(Math.round((st.military + st.monster + st.internal + st.economic + st.magical) / 5))).toBe('critical'); // the stored five's band, the fault
    const { container } = render(<SummaryTab settlement={s} />);
    const text = container.textContent || '';
    cleanup();
    expect(text.match(/Systems average: (\w+)/)?.[1]).toBe(statusCase(scoreBand(canon)));
  }, 120000);
});

describe('P2: a score that is not a number is not made one', () => {
  const record = { config: { monsterThreat: 'heartland' }, defenseProfile: { scores: { monster: 'unknown' } } };
  test('settled country, a non-numeric monster score, no readiness label: the bag passes through, the mean stays null, the headline stays silent', () => {
    const scores = record.defenseProfile.scores;
    expect(scoresAsShown(record, scores)).toBe(scores);
    expect(avgScore(scoresAsShown(record, scores))).toBe(null);
    expect(deriveDefensePosture(record).scoreAvg).toBe(null);
    expect(defenseHeadline({ readiness: null, scoreAvg: avgScore(scoresAsShown(record, scores)) })).toBe(null);
  });
  test('control: a numeric score in settled country is still read against the need (0 -> the adequate cut)', () => {
    const numeric = { config: { monsterThreat: 'heartland' }, defenseProfile: { scores: { monster: 0, military: 10 } } };
    expect(scoresAsShown(numeric, numeric.defenseProfile.scores).monster).toBeGreaterThan(0);
  });
});
