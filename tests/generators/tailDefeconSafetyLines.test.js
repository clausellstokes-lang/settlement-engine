/**
 * tests/generators/tailDefeconSafetyLines.test.js — TAIL-DEFECON batch 1 (2026-11-14; the READ-ALL worklist of the
 * DEFECON group, `docs/chair/2026-11-14/tail/TAIL-DEFECON-HANDBACK.md`): the safety profile's lines say only what the
 * record holds. Each GONE pair is a census town (the 720's configuration) that printed the sentence where its own
 * record makes it false, red at the base bcad1a358; each names what prints in its place, or that the slot is silent by
 * design. Each KEEP pair is a town where the original is true, and still prints it.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { settleCrimeLinesToSignal, NO_WATCH_SMALL } from '../../src/generators/safetyProfile.js';

// The census's 720 configuration (SECOND-WAVE-CENSUS births.mjs): every random dial on.
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function censusBirth(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
}
/** Every line the safety profile stores (what the Defense and Economics tabs print from it). */
function safetyText(s) {
  const sp = s.economicState?.safetyProfile ?? {};
  return [sp.safetyDesc, sp.guardEffectivenessDesc, sp.economicDragDesc, ...(sp.crimeTypes ?? []).map((c) => c.desc), ...(sp.plotHooks ?? [])].filter(Boolean).join('\n');
}

const SILENT = null;
/**
 * The no-watch line's opening sentence, COMPUTED from the generator's own pool (safetyProfile.js :: NO_WATCH_SMALL, its
 * third member) rather than spelled here (TAIL-CLOSE-TESTS-C). It is generator text, never drawn from a state leaf (the
 * anchor walker aligns it against DS-DEF-3 Moderate vid 5 by coincidence), so drawnProse.js would assert the wrong
 * sentence; taking it from the shipped pool keeps the same town and the same claim, and a rewording moves both.
 */
const NOBODY_PAID = NO_WATCH_SMALL[2].split('. ')[0];
/** [row, seed, the sentence that must NOT print, what prints instead (SILENT: the slot is silent by design)] */
const GONE = [
  ['23466', 'r2r-village-49', 'the local guard sees to that', 'Visitors can walk anywhere at any hour, and there is little crime.'],
  ['16568', 'r2r-hamlet-54', 'whoever controls their street', 'Residents protect themselves through their neighbours, or by paying whoever is strongest.'],
  ['07373', 'r2s-under_siege-town-3', 'Everyone comes and goes by the gates', 'The gates are shut against the siege, and the town watch holds them.'],
  ['07371', 'r2s-under_siege-city-1', 'Everyone comes and goes by the gates', 'The gates are shut against the siege, and the garrison and city watch hold them.'],
  ['20612', 'r2s-wartime-city-1', 'The garrison and city watch is well paid', 'The garrison and city watch are well paid, well equipped and patrol properly.'],
  ['20616', 'r2r-city-38', 'The garrison and city watch walks the usual rounds', 'The garrison and city watch walk the usual rounds.'],
  ['18786', 'r2s-mass_migration-village-1', 'enforcers who can be bought', "The adventurers' charter hall takes bounty work against threats"],
  ['B14103', 'r2s-occupied-thorp-1', NOBODY_PAID, 'No one of the place is paid to keep order; the occupiers keep their own.'],
  ['02876', 'r2s-wartime-town-2', "A part from the wizard's tower", SILENT],
  ['B03371', 'r2s-under_siege-metropolis-2', 'smuggling operation moves contraband through the settlement', 'The siege has shut the roads, so what contraband is already inside is hoarded and sold dear'],
  // TAIL-CORPUS-DEF-5: the twin re-keyed to its cure's words (no stored food on the Defense tab: defenseWordsFindings)
  ['05801', 'r2s-under_siege-thorp-2', 'Controlled goods (grain, salt, preserved meat)', "What food there is goes to whoever can pay the holder's price."],
  ['18708', 'r2s-insurgency-thorp-2', 'insurgent supporters and those who keep order', "Confrontations between the rebels' supporters and those loyal to the current authority."],
  ['16495', 'r2s-religious_conversion-thorp-0', 'Religious buildings, land, and endowments', SILENT],
  // BAR6-CRIME, 2026-11-16 (the chair's SV1): re-keyed by identity to its cure's words (the army's contracts, no crown named)
  ['18752', 'r2s-wartime-thorp-3', "Suppliers adulterating grain and leather sold to the army's contracts", 'Deserters passing through need food and discretion, and some here give both.'], // TAIL-DISPLAY-CIVIC-3 V3, re-keyed by identity: an isolated thorp sells nothing to an army's buyers
  ['03039', 'r2s-wartime-thorp-3', 'A small industry has emerged to provide all three', 'Deserters passing through need food and discretion, and some here give both.'],
  ['B27552', 'r2s-wartime-thorp-3', 'Wealthy families paying poorer ones', SILENT],
  ['09343', 'r2s-mass_migration-thorp-3', 'Forged residence documents', 'A way onward, sold quietly to newcomers who were told to move on.'], // TAIL-DISPLAY-CIVIC-3 V3, re-keyed by identity: no bed presumed
  ['09714', 'r2r-village-55', 'the stalls that pay their fees', 'With the siege closed round the place, what goods are left change hands in back rooms and after dark'],
  ['09714', 'r2r-thorp-10', 'the stalls that pay their fees', 'Goods change hands here in back rooms and after dark, and nobody accounts for them.'],
  ['18208', 'r2s-infiltrated-thorp-3', 'Some goods change hands here without a licence', 'A little changes hands here quietly, between neighbours, and no one reckons it up.'],
  ['15308', 'r2r-village-53', 'has filled the power vacuum', "keeps its own order where the civil authority's reach fails, and extracts a price for it."],
  ['14654', 'r2s-plague_onset-village-3', 'No single dominant organisation', 'Petty theft, minor fraud, and opportunistic violence are persistent, driven by too many people with too little'],
];
/** The liveness anchor of each SILENT pair: a sibling crime line the same profile really prints. */
const LIVE = {
  'r2s-wartime-town-2': 'Alchemists and other magical practitioners who operate outside legal channels',
  'r2s-religious_conversion-thorp-0': 'False conversion declarations sold or arranged for a fee',
  'r2s-wartime-thorp-3': 'Deserters passing through need food and discretion',
};
/** [row, seed, a true sibling that must still print] */
const KEEP = [
  ['23466', 'r2r-hamlet-11', 'and there is little crime; the '],
  ['16568', 'r2r-village-10', 'whoever controls their street'],
  ['07371', 'r2s-occupied-town-2', 'Everyone comes and goes by the gates'],
  ['20612', 'r2s-famine-town-1', 'The town watch is well paid and well equipped, but hunger is eroding the order it keeps.'], // TAIL-DISPLAY-CIVIC-3 V3, re-keyed by identity: the famine's twin
  ['20616', 'r2s-recently_betrayed-town-3', 'The town watch walks the usual rounds'],
  ['18786', 'r2s-religious_conversion-town-0', 'exists on paper'],
  ['B14103', 'r2s-under_siege-thorp-2', NOBODY_PAID],
  ['02876', 'r2r-town-51', "A part from the wizard's tower"],
  ['B03371', 'r2s-infiltrated-town-2', 'smuggling operation moves contraband through the settlement'],
  ['05801', 'r2r-village-58', 'Controlled goods (grain, salt, preserved meat)'],
  ['18708', 'r2r-thorp-25', 'insurgent supporters and'],
  ['16495', 'r2s-religious_conversion-hamlet-1', 'Religious buildings, land, and endowments'],
  // RE-KEYED BY IDENTITY (DEBT-1, 2026-11-17): SEAM-DESKS (2026-11-17) took the leather out of the same line
  // (safetyProfile.js, the war profiteering crime: "the grain and provisions"); the same row, the same town, the line's own words
  ['18752', 'r2s-wartime-village-3', "Suppliers adulterating the grain and provisions sold to the army's contracts"], // BAR6-CRIME, 2026-11-16 (SV1): re-keyed by identity
  ['09343', 'r2s-mass_migration-village-3', 'Forged residence documents'],
  ['09714', 'r2s-plague_onset-village-3', 'the stalls that pay their fees'],
  ['18208', 'r2r-village-12', 'Some goods change hands here without a licence'],
  ['14654', 'r2r-village-58', 'No single dominant organisation'],
];

const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...GONE, ...KEEP].map((r) => r[1]))) towns[seed] = safetyText(censusBirth(seed));
}, 600000);

describe('TAIL-DEFECON batch 1: the safety lines say only what the record holds', () => {
  for (const [row, seed, gone, instead] of GONE) {
    test(`#${row} ${seed}: not "${gone}"; ${instead === SILENT ? 'silent by design' : `"${instead}"`}`, () => {
      expectAbsentWithAnchor(towns[seed], gone, instead === SILENT ? LIVE[seed] : instead, `#${row} ${seed}`);
      if (instead !== SILENT) expect(towns[seed]).toContain(instead);
    });
  }
  for (const [row, seed, kept] of KEEP) {
    test(`#${row} ${seed} keeps "${kept}"`, () => expect(towns[seed]).toContain(kept));
  }
  test('#15308 keeps the vacuum line where a criminal seat governs', () => {
    const desc = "The thieves' guild has filled the power vacuum left by absent or failed civil authority. It provides a form of order and extracts a price for it.";
    const e = { safetyProfile: { crimeTypes: [{ type: 'Criminal governance', desc }] }, activeChains: [] };
    const seats = [{ faction: "Thieves' Guild", category: 'criminal', isGoverning: true }];
    expect(settleCrimeLinesToSignal(e, { seats, estate: [] }).safetyProfile.crimeTypes[0].desc).toBe(desc);
  });
});
