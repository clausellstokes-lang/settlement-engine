/**
 * tests/domain/tailDefeconDisplayLines.test.js — TAIL-DEFECON-D batch 1 (2026-11-15; the READ-ALL worklists of the
 * DEFECON group and of DISPLAY-ECON's Outlook rows (the chair's D11), `docs/chair/2026-11-14/tail/TAIL-DEFECON-D-HANDBACK.md`):
 * the Defense tab's and the Outlook's lines say only what the record holds. Each GONE pair is a census town (the 720's
 * configuration) that printed the sentence where its own record makes it false, red at the base 345f13157; each names
 * what prints in its place. Each KEEP pair is a town where the original is true, and still prints it.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { criminalOpNote, deriveCriminalStructure, deriveSupportingCapabilities, foodEnduranceLine } from '../../src/domain/display/defenseDisplay.js';
import { deriveViability } from '../../src/domain/display/dossierViewModel.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// The census's 720 configuration (SECOND-WAVE-CENSUS births.mjs): every random dial on.
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function censusBirth(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
}
/** The lines this batch's writers print: the Outlook, the supporting rows' notes, the criminal structure and operations, food endurance. */
function displayText(s) {
  const ops = (s.economicState?.safetyProfile?.criminalInstitutions ?? []).map((c) => (typeof c === 'string' ? c : c?.name));
  return [deriveViability(s).summary, ...deriveSupportingCapabilities(s).map((c) => c.note), deriveCriminalStructure(s)?.note,
    ...ops.map((n) => criminalOpNote(n)), foodEnduranceLine(s)?.sentence].filter(Boolean).join('\n');
}

/** [row, seed, the sentence that must NOT print, what prints instead] */
const GONE = [
  ['00585', 'r2r-thorp-27', 'buying in what its own land and trades do not provide', 'gets through the year on its own land and trades, and goes without what they do not provide.'],
  ['00628', 'r2s-plague_onset-thorp-0', 'and the difference arrives', 'grows less than it eats, and part of the difference arrives'],
  ['14073', 'r2s-plague_onset-hamlet-2', 'Much of what', 'eats is brought in by road; its own land does not produce enough.'],
  ['14072', 'r2s-slave_revolt-thorp-1', 'Much of what', 'eats is brought in by river; its own land does not produce enough.'],
  ['14075', 'r2s-plague_onset-thorp-1', 'Much of what', 'eats is brought in from outside; its own land does not produce enough.'],
  ['01134', 'r2s-slave_revolt-town-0', 'keeps order and pays its way', 'eats is brought in by river; its own land does not produce enough.'],
  ['B13779', 'r2s-plague_onset-thorp-0', 'the sick are tended by their own families', "No healer's house stands here; the sick are tended by one of the place's own."],
  ['B02441', 'r2r-city-2', 'A criminal operation with a hold on part of the place or its trade.', 'A quarter given over to pleasure: a trade that runs at the edge of the law.'],
  ['B00162', 'r2s-occupied-town-1', 'criminal ring decides what crime is allowed', 'Crime here is run as a business: its money passes through shops that look honest, and whoever runs it keeps out of sight.'],
  ['B11428', 'r2s-plague_onset-village-3', 'It keeps the streets quiet', 'One criminal ring decides what crime is allowed here.'],
  ['09264', 'r2s-plague_onset-thorp-0', 'for about two months at full rations', 'household stores would carry the thorp for about a month and a half at full rations'],
];
/** [row, seed, a true sibling that must still print] */
const KEEP = [
  ['00585', 'r2r-thorp-6', 'buying in what its own land and trades do not provide'],
  ['00628', 'r2r-thorp-16', 'cannot feed itself: part of its food comes in by road.'],
  ['01134', 'r2r-town-17', 'keeps order and pays its way, but it has to buy food'],
  ['B13779', 'r2r-thorp-0', 'No healer is kept here; the sick are tended by their own families.'],
  ['B02441', 'r2r-city-2', 'Operates unlicensed gambling.'],
  ['B00162', 'r2r-town-7', 'One criminal ring decides what crime is allowed here.'],
  ['B11428', 'r2r-town-0', 'It keeps the streets quiet because trouble brings the law'],
  // the lit birth's value (THE FLIP, 2026-11-23, both birth laws lit): the granary's months moved (was "about five months")
  ['09264', 'r2r-town-0', 'the granary would carry the town for about six months at full rations'],
];

const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...GONE, ...KEEP].map((r) => r[1]))) towns[seed] = displayText(censusBirth(seed));
}, 600000);

describe('TAIL-DEFECON-D batch 1: the Defense tab\'s and the Outlook\'s lines say only what the record holds', () => {
  for (const [row, seed, gone, instead] of GONE) {
    test(`#${row} ${seed}: not "${gone}"; "${instead}"`, () => {
      expectAbsentWithAnchor(towns[seed], gone, instead, `#${row} ${seed}`);
    });
  }
  for (const [row, seed, kept] of KEEP) {
    test(`#${row} ${seed} keeps "${kept}"`, () => expect(towns[seed]).toContain(kept));
  }
});
