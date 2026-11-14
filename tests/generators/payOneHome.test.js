/**
 * payOneHome.test.js — COHERENCE-UPKEEP-6, the chair's rulings A and B on the third read
 * (REVIEW-UPKEEP-65cb03ef1, 1b-H1, 1b-L1, 1b-M2).
 *
 * A. ONE HOME FOR PAY ON EVERY SURFACE: every sentence that says what the town can pay reads ONE home,
 *    the Economic Survival row's band (`defenseScoreBands.js :: economicSurvivalBandOf`), itself paid at the
 *    standing label: the PDF's money line and the guard assessment's purse clauses (the tab's row reads the
 *    same band). The guard line is written after the defence profile, so it can read it.
 * B. HIRED SWORDS ONLY WHERE HIRED: "Hired swords back the garrison" prints only where a contracted company
 *    stands on the roster (the defence home's mercenary bucket); a charter hall or a free company hall is not one.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildThreatAssessment } from '../../src/domain/display/threatAssessment.js';
import { scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { prosperityInCrisisLine } from '../../src/domain/display/prosperityInCrisis.js';
import { partitionDefenseInstitutions } from '../../src/domain/institutions/defenseInstitutionBuckets.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const MONEY = { STRONG: 'Money enough to ride out a long crisis', ADEQUATE: 'Money enough for a short crisis', WEAK: 'The defenders are already paid late', CRITICAL: 'There is no money' };
const SWORDS = 'Hired swords back the garrison';

/** @type {any[]} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const stress of [null, 'famine', 'under_siege', 'wartime']) {
    for (const tier of ['town', 'city', 'metropolis']) {
      for (let i = 0; i < 12; i++) {
        const seed = `pay6-${stress || 'calm'}-${tier}-${i}`;
        const cfg = stress
          ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier, selectedStresses: [stress], selectedStressesRandom: false })
          : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier });
        births.push({ seed, s: generateSettlementPipeline(cfg, null, { seed, customContent: {} }) });
      }
    }
  }
}, 600000);

describe('one home for pay (ruling A)', () => {
  test('RED-FIRST: the PDF money line speaks for the Economic Survival band', () => {
    const bad = [];
    for (const { seed, s } of births) {
      const band = scoreBand(s.defenseProfile.scores.economic);
      const line = buildThreatAssessment(s).find((row) => row.label === 'Economic Survival').assess;
      if (!line.startsWith(MONEY[band])) bad.push([seed, s.defenseProfile.scores.economic, band, line.slice(0, 40)]);
    }
    expect(bad).toEqual([]);
  });

  test('RED-FIRST: the guard\'s purse clause speaks for the same band (no purse kept short where the band is Strong)', () => {
    let swords = 0;
    const bad = [];
    for (const { seed, s } of births) {
      const desc = s.economicState.safetyProfile.guardEffectivenessDesc;
      if (!desc.includes(SWORDS)) continue;
      swords += 1;
      const band = scoreBand(s.defenseProfile.scores.economic);
      const short = desc.includes(`${SWORDS} when the purse allows.`);
      if (short !== (band !== 'STRONG')) bad.push([seed, s.defenseProfile.scores.economic, band, short]);
    }
    expect(swords, 'anchored: the corpus prints hired swords').toBeGreaterThan(5);
    expect(bad).toEqual([]);
  });
});

describe('hired swords only where hired (ruling B)', () => {
  test('RED-FIRST: no "hired swords" without a contracted company on the roster', () => {
    const bad = [];
    let contracted = 0;
    for (const { seed, s } of births) {
      const hired = partitionDefenseInstitutions(s.institutions).mercenary.length > 0;
      const desc = s.economicState.safetyProfile.guardEffectivenessDesc;
      if (hired && desc.includes(SWORDS)) contracted += 1;
      if (!hired && desc.includes(SWORDS)) bad.push([seed, s.institutions.filter((i) => /company|charter|merc|hire/i.test(i.name)).map((i) => i.name)]);
    }
    expect(contracted, 'anchored: hired swords still print beside a contracted company').toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  test('the reviewer\'s seed rv2-under_siege-town-1 (a free company hall and a charter hall, no company) prints no hired swords', () => {
    const cfg = birthConfig({ ...DEFAULT_CONFIG, settType: 'town', selectedStresses: ['under_siege'], selectedStressesRandom: false });
    const s = generateSettlementPipeline(cfg, null, { seed: 'rv2-under_siege-town-1', customContent: {} });
    expect(s.institutions.some((i) => /free company hall/i.test(i.name)), 'anchored: the free company hall stands').toBe(true);
    // anchored: the line above pins the roster this claim is about, so a drifted birth reds there
    expect(s.economicState.safetyProfile.guardEffectivenessDesc.includes(SWORDS)).toBe(false);
  });
});

// COHERENCE-UPKEEP-7, the chair's ruling on the third read's 1b-M3 (202 of its 1,200 births printed "every coin goes
// on food" or "the war takes most of the money" beside "money enough to ride out a long crisis"): where the two
// prosperity words differ, the sentence that says what the town can pay says the money was laid by before the
// crisis, in ONE clause, the crisis named through the two-label sentence's own home
// (`prosperityInCrisis.js :: laidByBeforeCrisis`). A town whose words agree reads as before.
describe('the money laid by before the crisis (1b-M3)', () => {
  const LAID = / laid by before the [a-z ,]+[:;]/;
  test('RED-FIRST: a can-pay money line names the crisis it was laid by before, exactly where the two words differ', () => {
    const bad = [];
    let laid = 0;
    let plain = 0;
    for (const { seed, s } of births) {
      const line = buildThreatAssessment(s).find((row) => row.label === 'Economic Survival').assess;
      const canPay = line.startsWith(MONEY.STRONG) || line.startsWith(MONEY.ADEQUATE);
      const differ = prosperityInCrisisLine(s) !== null;
      const says = LAID.test(line);
      if (canPay && differ) laid += 1;
      if (canPay && !differ) plain += 1;
      if (says !== (canPay && differ)) bad.push([seed, s.economicState.prosperity, s.economicState.prosperityStanding, line.slice(0, 90)]);
    }
    expect(laid, 'anchored: crisis births whose money line can pay').toBeGreaterThan(10);
    expect(plain, 'anchored: births whose two words agree keep the plain line').toBeGreaterThan(10);
    expect(bad).toEqual([]);
  });

  test('RED-FIRST: the reviewer\'s rv2-famine-city-0 reads the clause beside the hunger line', () => {
    const cfg = birthConfig({ ...DEFAULT_CONFIG, settType: 'city', selectedStresses: ['famine'], selectedStressesRandom: false });
    const s = generateSettlementPipeline(cfg, null, { seed: 'rv2-famine-city-0', customContent: {} });
    expect(prosperityInCrisisLine(s), 'anchored: the two words differ in this famine').not.toBeNull();
    expect(buildThreatAssessment(s).find((row) => row.label === 'Economic Survival').assess)
      .toBe('Money enough to ride out a long crisis, laid by before the famine: emergency measures can be paid for, and the garrison kept paid while it lasts.');
  });
});
