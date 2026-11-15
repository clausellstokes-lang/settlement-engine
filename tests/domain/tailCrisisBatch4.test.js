/**
 * TAIL-CRISIS batch 4 (READ-ALL, 2026-11-14; the seat TAIL-CRISIS-3; the chair's ruling K12): THE CRISIS PAGE'S STAKES SAY
 * ONLY WHAT THE RECORD BEARS, WITH A VERB (`domain/crisis/crisisPage.js :: stakeShown`), AND A SUPPRESSED FAITH HAS NO VOICE
 * (`domain/dossier/faithReading.js :: factionLine`). One collected test on births of the census's own seeds (CENSUS-3
 * seedcfg.mjs, the r2r-/r2s- arms, copied): each FALSE pair is a (seed, words) the town printed at the base and must not
 * print now, with what prints in its place; each KEEP pair a true sibling that prints at both.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { composeCrisisPage, CRISIS_PAGE_COPY } from '../../src/domain/crisis/crisisPage.js';
import { faithLinesOf, faithReadingOf } from '../../src/domain/dossier/faithReading.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** @type {Map<string, any>} */
const born = new Map();
/** @type {(seed: string) => any} */
let birth;

beforeAll(async () => {
  const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  await loadGenerationLawPayloads();
  birth = (seed) => {
    if (born.has(seed)) return born.get(seed);
    let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
    let cfg;
    if (m) cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
    else {
      m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
      if (!m) throw new Error(`no configuration for ${seed}`);
      cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
    }
    const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    born.set(seed, s);
    return s;
  };
}, 120000);

/** The stakes rows as the PDF prints them, and the faith lines, joined. @param {any} s */
const page = (s) => [
  ...composeCrisisPage(s).flatMap((sec) => sec.stakes.map((k) => `${k.factionId} ${CRISIS_PAGE_COPY.stake[k.stake]} · ${k.reason}`)),
  ...faithLinesOf(faithReadingOf(s), { tierNoun: s.tier }),
].join('\n');

/** [seed, words that must NOT print, what prints in their place] (READ-ALL row ids) */
const FALSE = [
  ['r2s-famine-town-1', 'Merchant Guilds no stake yet', 'Merchant Guilds are already at odds · in their own quarrel with Merchant oligarchy'], // B12521
  ['r2s-famine-city-0', 'Noble Families no stake yet', 'Noble Families are already at odds · in their own quarrel with Royal Authority'], // B13860
  ['r2s-famine-metropolis-2', 'The Arcane Circle no stake yet', 'The Arcane Circle is already at odds · in its own quarrel with City-State Council'], // B18039
  ['r2s-mass_migration-city-1', 'Merchant Guild Council no stake yet', 'Merchant Guild Council must answer for it · it governs here'], // 13199
  ['r2s-mass_migration-city-3', 'Democratic assembly no stake yet', 'Democratic assembly must answer for it · it governs here'], // 06464
  ['r2s-mass_migration-city-2', 'Merchant oligarchy no stake yet', 'Merchant oligarchy must answer for it · it governs here'], // 13370
  ['r2r-hamlet-32', "Creditor's Representative no stake yet", "Creditor's Representative has no stake yet · it could side with either camp"], // K12: the verb
  ['r2r-village-57', 'Craft Guilds no stake yet', 'Craft Guilds have no stake yet · they could side with either camp'], // K12: the verb, agreeing
  ['r2s-religious_conversion-metropolis-1', 'A small voice in the metropolis’s affairs belongs to the New Faith Community.', 'The New Faith Community is suppressed in the metropolis.'], // 03046
  ['r2r-town-21', 'A small voice in the town’s affairs belongs to the Religious Authorities.', 'The Religious Authorities are suppressed in the town.'], // 03046's shape
];

/** [seed, a true sibling that must still print] */
const KEEP = [
  ['r2s-famine-town-1', 'Merchant oligarchy loses · its own people feel the crisis first'], // a stake the record holds keeps its words
  ['r2s-famine-city-0', 'Military/Guard gains · the military gains in a vacuum of governance'],
  ['r2r-town-1', 'A voice in the town’s affairs belongs to the Religious Authorities.'], // a Minor faith keeps its voice
];

describe('TAIL-CRISIS batch 4: the stakes say what the record bears; a suppressed faith has no voice', () => {
  it('no FALSE words print, and the line the record bears prints in their place', () => {
    for (const [seed, gone, instead] of FALSE) {
      const text = page(birth(seed));
      expect(text, seed).not.toContain(gone);
      expect(text, seed).toContain(instead);
    }
  }, 300000);
  it('every KEEP sibling still prints', () => {
    for (const [seed, kept] of KEEP) expect(page(birth(seed)), seed).toContain(kept);
  }, 300000);
});
