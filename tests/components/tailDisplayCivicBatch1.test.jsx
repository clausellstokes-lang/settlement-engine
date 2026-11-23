/** @vitest-environment jsdom */
/**
 * TAIL-DISPLAY-CIVIC · BATCH 1 (READ-ALL, the chair's ruling X2 of 2026-11-14; the rows by id in
 * docs/chair/2026-11-14/tail/TAIL-DISPLAY-CIVIC-HANDBACK.md). One collected test, on births of the census's own seeds
 * (CENSUS-3 seedcfg.mjs :: cfgFor, the r2r-/r2s- arms verbatim); every CURED pair red at the base f663a2699, every KEEP
 * pair green before and after.
 *
 *  - THE PUBLIC'S LEGITIMACY HAS ONE HOME (X2; NOLANE-2's item-legit patch, re-applied): the Foundations row printed the
 *    causal ladder's word ("Adequate" beside the Power tab's "Tolerated", 149 towns; every town's row disagreed in
 *    word); it prints the record's own label (`powerStructure.publicLegitimacy.label`).
 *  - UNDER AN OCCUPATION THE HALL DOES NOT GOVERN ALONE (19252 19466 19516 19333 19240): the governance account's seat
 *    sentence said "The Elder Council governs Amarkota." beside the Occupation Authority the occupied stress adds; it
 *    says the hall governs under it (28 towns). RE-KEYED BY IDENTITY at the merge into lane/tail-powers (the chair's ruling
 *    P28): the declared twin of P4 (TAIL-POWERS-2) stands in those sentences: "<the hall> answers to the occupiers of <place>."
 *  - THE SAFETY CAUSE IS NAMED BY WHAT LOWERED IT (B05826 B05840 06098 06102 B05843 06101 06043): "crime" named as the
 *    legitimacy's cause where the safety label names a crisis ("Strained — Mass Migration"); it reads "insecurity", or
 *    "the curfew" under an occupation's curfew alone. A plain label keeps "crime".
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { governanceAccountOf, governanceStressTypesOf } from '../../src/domain/display/governanceAccount.js';
import { resolvePrimaryStress } from '../../src/generators/stressPriority.js';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's cfgFor, its r2r- and r2s- arms. @param {string} seed */
function born(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  const cfg = m ? { ...DEFAULT_CONFIG, ...DIALS, settType: m[1] } : null;
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  const conf = cfg || { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  return generateSettlementPipeline(birthConfig(conf), null, { seed, customContent: {} });
}
afterEach(cleanup);
/** @param {any} s */
const account = (s) => governanceAccountOf(s, { primaryStress: resolvePrimaryStress(governanceStressTypesOf(s)) })?.text || '';
/** The Foundations row's word. @param {any} s @param {string} label */
function foundationsWord(s, label) {
  const { container } = render(<SubstrateTab settlement={s} />);
  const row = [...container.querySelectorAll('[data-substrate-row]')].find((r) => r.firstChild?.textContent === label);
  const word = row ? row.lastChild.textContent : null;
  cleanup();
  return word;
}

// [seed, the sentence that must not print, what prints in its place]
const ACCOUNT_CURED = [
  ['r2s-occupied-thorp-1', 'The Elder Council governs Amarkota.', 'The Elder Council answers to the occupiers of Amarkota.'],
  ['r2s-occupied-metropolis-0', 'Chrissopetra is governed by the Grand Guild Consortium.', 'The Grand Guild Consortium answers to the occupiers of Chrissopetra.'],
  ['r2r-thorp-24', 'The Household Council governs Sanctaminus.', 'The Household Council answers to the occupiers of Sanctaminus.'],
  ['r2s-mass_migration-town-0', 'Crime is the reason.', 'Insecurity is the reason.'],
  // the lit birth's value (THE FLIP, 2026-11-23): r2r-city-3's seat stands Contested lit (Tolerated before), so the slot's
  // sentence is the Contested one; it names insecurity, not crime (was 'Crime is the reason.' / 'Insecurity is the reason.')
  ['r2r-city-3', 'Crime has left the City-State Council\'s right to rule contested in Androntopia.', 'Insecurity has left the City-State Council\'s right to rule contested in Androntopia.'],
  ['r2s-occupied-thorp-1', 'Poverty and crime have cost the Elder Council its standing.', 'Poverty and insecurity have cost the Elder Council its standing.'],
  ['r2r-thorp-24', 'Poverty and crime are the reason.', 'Poverty and the curfew are the reason.'],
];
// [seed, the true sibling that must still print]
const ACCOUNT_KEPT = [
  // RE-PICKED BY THE PREMISE (THE FLIP, CLOSE-6 F-FORTUNE-2, 2026-11-23; CLOSE-6's ruling: a KEEP is its case's form): the case
  // is a true crime sibling (a plain safety label keeps "crime"). Lit, r2r-city-0's cause is weak defences, and no r2r-city of
  // 200 nor census r2s town prints the form; r2r-hamlet-161 is the lowest r2r seed of 200 whose account prints it (161, 196)
  // (was r2r-city-0, 'Crime keeps Goraka from more than tolerating the Merchant City Council.')
  ['r2r-hamlet-161', 'Crime keeps Dar-al-serai from more than tolerating the Elder Council.'],
  ['r2r-city-1', 'The Military City Council governs Pengill.'],
  ['r2r-city-11', 'The Merchant oligarchy governs Puripat.'],
];
// [seed, the Foundations word that must not print, the record's label that prints]
const LEGIT_CURED = [
  // the lit birth's value (THE FLIP, 2026-11-23): the record reads 'Approved' lit (was 'Tolerated'); the causal ladder
  // still bands it 'adequate', so the town still meets the case (the ladder's word is not the record's)
  ['r2s-infiltrated-thorp-0', 'Adequate', 'Approved'],
  ['r2r-hamlet-0', 'Collapsed', 'Legitimacy crisis'],
];

const SEEN = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...ACCOUNT_CURED, ...ACCOUNT_KEPT, ...LEGIT_CURED].map((r) => r[0]))) SEEN.set(seed, born(seed));
}, 600000);

describe('batch 1: the governance account and the Foundations legitimacy row say what the record holds', () => {
  test('the cured account sentences no longer print, and their twins do', () => {
    const wrong = [];
    for (const [seed, gone, now] of ACCOUNT_CURED) {
      const text = account(SEEN.get(seed));
      if (text.includes(gone) && !text.includes(now)) wrong.push(`${seed}: still "${gone}"`);
      if (!text.includes(now)) wrong.push(`${seed}: no "${now}"`);
    }
    expect(wrong).toEqual([]);
  });
  test('the true siblings still print', () => {
    expect(ACCOUNT_KEPT.filter(([seed, kept]) => !account(SEEN.get(seed)).includes(kept))).toEqual([]);
  });
  test('the Foundations legitimacy row prints the record\'s label', () => {
    const rows = LEGIT_CURED.map(([seed, gone, now]) => ({ seed, gone, now, word: foundationsWord(SEEN.get(seed), 'Public legitimacy'),
      record: SEEN.get(seed).powerStructure.publicLegitimacy.label }));
    expect(rows.filter((r) => r.word !== r.now).map((r) => `${r.seed}: ${r.word} (record ${r.record})`)).toEqual([]);
  });
  test('keep: the Food row still prints its one home\'s word', () => {
    expect(foundationsWord(SEEN.get('r2r-hamlet-0'), 'Food')).toBe('Deficit');
  });
});
