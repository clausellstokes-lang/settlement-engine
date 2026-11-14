/**
 * presumeCorpusSeeds.test.js — COHERENCE-PRESUME's red-first proofs, one per cure (the charter
 * `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §1). Each case names a line that printed
 * in a corpus town lacking the thing it names, at the lane's base (99bcc6944), and the seed that
 * printed it. The case births that seed with the browser's configuration and asserts the line no
 * longer prints there while the thing is absent (the walker's own arm-2 reading). Each case was red
 * before its cure. The corpus-wide proof is tests/lint/presumedThings.walker.test.js.
 */
import { describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { liveInstitutionNames } from '../../src/domain/facts/institutions.js';
import { corpusConfig, printedAbsent } from '../lint/presumedThings.shared.mjs';

/** [the line's fragment, the thing, the corpus seed that printed it absent at the base] */
const CASES = [
  ['outfits town militias', 'militia', 'presume-town-103'],
  ['outfit the militias', 'militia', 'presume-town-0'],
  ['Sells surplus at the weekly market', 'market', 'presume-village-22'],
  ['Supplies the market with ducks', 'market', 'presume-village-32'],
  ['from the docks and the builders', 'docks', 'presume-city-12'],
  ['how many are in the garrison', 'garrison', 'presume-town-18'],
  ['take your business to a money-changer', 'bank', 'presume-city-18'],
  ['Emergency granary reserves', 'granary', 'presume-village-13'],
  ['every purse in the market', 'market', 'presume-village-51'],
  ['The garrison commander is a political actor', 'garrison', 'presume-town-111'],
  ['knows the watch rota', 'watch', 'presume-village-48'],
  ['A money changer sits', 'bank', 'presume-town-111'],
  ['a counting house, its brass', 'bank', 'presume-city-41'],
  ['merchant stalls, money changers', 'bank', 'presume-town-0'],
  ['at the market cross', 'market', 'presume-village-12'],
  ['The Watch Captain', 'watch', 'presume-village-0'],
  ['preferential market positions', 'market', 'presume-village-52'],
  ['the market quarter', 'market', 'presume-village-24'],
  ['Temple granaries blessed', 'granary', 'presume-village-19'],
  // the culture lines (the hand-back's §3 item 1; the owner's standing order withdrew their bank)
  ['Harbor and hinterland goods me', 'docks', 'presume-town-111'],
  ['An agora by the harbor, civic', 'docks', 'presume-town-62'],
  ['Where the state reaches, enclo', 'granary', 'presume-village-23'],
  ['Regulated markets, guild broke', 'granary', 'presume-village-28'],
  ['a hall-and-market axis organiz', 'market', 'presume-village-38'],
  ['a raised ceremonial precinct o', 'market', 'presume-village-53'],
  ['occupational quarters cluster', 'market', 'presume-village-32'],
  ['the market street terminates a', 'market', 'presume-village-27'],
  ['A palisaded core is surrounded', 'market', 'presume-village-41'],
  ['A planned civic axis links gat', 'market', 'presume-village-43'],
  ['A temple, court, or fortified', 'market', 'presume-village-39'],
  ['Dense masonry quarters open on', 'market', 'presume-village-59'],
  ['Shaded lanes connect inward-lo', 'market', 'presume-village-4'],
  ['Timber-framed street houses cl', 'market', 'presume-village-1'],
  ['Judges, market officers, endow', 'market', 'presume-village-4'],
  ['Caravan organization, brokerag', 'market', 'presume-village-17'],
  ['Contract, warehousing, market', 'market', 'presume-village-12'],
  ['Estate dues, weekly markets, a', 'market', 'presume-village-1'],
  ['Landing places and halls serve', 'market', 'presume-village-13'],
  ['Large periodic markets, profes', 'market', 'presume-village-51'],
  ['Market exchange operates besid', 'market', 'presume-village-0'],
  ['A ritual plaza at the centre,', 'market', 'presume-village-51'],
  ['Professional guards and mercen', 'mercenary', 'presume-town-77'],
  ['A militia tradition supports a', 'militia', 'presume-village-1'],
  ['Militia and professional troop', 'militia', 'presume-village-27'],
  ['Ditches, banks, timber rampart', 'walls', 'presume-village-0'],
  ['ringworks, timber ramparts, an', 'walls', 'presume-village-5'],
  // the denial side (the chair's ruling A): a line that denies a thing the town has
  ['No law, bring coin', 'law', 'presume-town-4'],
  ['no official recourse', 'law', 'presume-town-4'],
  // the one reported row (the hand-back's §3 item 4): narrativeText's mass-migration line
  ['share the streets and the market', 'market', 'presume-village-38'],
  // COHERENCE-POWERS-2 item 2: the creditor tie's counting-house, drawn by a council of a kind's Merchant Council
  ['approved in', 'bank', 'presume-town-72'],
];

/** @param {string} seed */
const birth = (seed) => {
  const tier = seed.split('-')[1];
  const record = generateSettlementPipeline({ ...corpusConfig(tier) }, null, { seed, customContent: {} });
  return printedAbsent(record, factsOf(record), liveInstitutionNames(record));
};

describe('COHERENCE-PRESUME: a cured line no longer prints where its thing is absent', () => {
  // one parameterless test over the rows (the sovereignty census parks a file that calls `each`)
  test('every case\'s seed prints its line only where the thing stands', () => {
    const still = CASES.flatMap(([fragment, thing, seed]) => birth(seed)
      .filter((h) => h.thing === thing && h.sentence.includes(fragment))
      .map((h) => `${seed} :: ${thing} :: ${h.path} :: ${h.sentence.slice(0, 120)}`));
    expect(still).toEqual([]);
  }, 600_000);
});
