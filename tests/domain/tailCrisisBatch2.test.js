/**
 * TAIL-CRISIS batch 2 (READ-ALL, 2026-11-14; the chair's ruling K3, the seat TAIL-CRISIS-2): THE QUICK GUIDE'S SCOPE LINE
 * NAMES ONLY THE RULE, THE HOUSES AND THE GROUND THE TOWN HOLDS (`domain/summary/settlementQuickGuide.js ::
 * scopeAgainstRule`). One collected test on births of the census's own seeds (CENSUS-3 seedcfg.mjs, the r2r-/r2s- arms,
 * copied): each FALSE pair is a (seed, clause) the town printed at 9c07f7461 and must not print now, with what prints in
 * its place; each KEEP pair is a true sibling that must still print.
 *   scope      the quick guide's culture scope line (READ-ALL's 35 quick-guide rows)
 *   vantages   the succession void's trade and official vantages claim no office (the chair's note K11)
 *   stores     the Tonight sheet's stores line says what a famine or a siege with a gap is doing to them (K1, K7)
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { cultureScopeLine } from '../../src/domain/summary/settlementQuickGuide.js';
import { composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';
import { crisisSummaryForSurface } from '../../src/domain/crisis/crisisSummaryVantage.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

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

/** [seed, clause that must NOT print, what the line prints in its place] (READ-ALL row ids in the comments) */
const FALSE = [
  // estates: an elder's, a priest's or a council's rule, no lord and no landed power standing (09631 03978 09633 09630 09632 09626)
  ['r2s-plague_onset-hamlet-1', 'run by its estates', 'Germanic-inspired: built in timber and stone.'],
  ['r2r-village-21', 'run by its estates', 'built in timber and stone.'],
  ['r2s-under_siege-metropolis-0', 'run by guild and estate', 'Germanic-inspired: built in timber and stone.'],
  ['r2s-under_siege-city-3', 'run by guild and estate', 'built in timber and stone.'],
  ['r2r-thorp-45', 'run by its estates', 'built in timber and stone.'],
  // under an occupation: who holds the place (09628 B03858 18585 18583 18459 12540 10066 10049 10048)
  ['r2s-occupied-village-0', 'run by its estates', 'built in timber and stone, held, for now, by another power.'],
  ['r2s-occupied-city-0', 'run by guild and estate', 'held, for now, by another power.'],
  ['r2s-occupied-hamlet-0', 'held by clan and caravan', 'built on clan lines, held, for now, by another power.'], // TAIL-CRISIS-4 (K19): re-keyed by identity (no herds, no pasture)
  ['r2s-occupied-metropolis-2', 'held by clan and caravan', 'built on clan lines, held, for now, by another power.'],
  ['r2s-occupied-metropolis-3', 'under temple and guild', 'in quarters by trade, held, for now, by another power.'],
  ['r2r-thorp-24', 'run by patronage and law', 'Latin-inspired, and it shows: held, for now, by another power.'],
  ['r2r-thorp-27', 'run by civic association', 'built on riverside ground, held, for now, by another power.'],
  ['r2s-occupied-metropolis-1', 'run by civic association', 'on hillside ground, held, for now, by another power.'],
  ['r2s-occupied-metropolis-0', 'run by civic association', 'in forest country, held, for now, by another power.'],
  // patronage and law under household consensus or elders: custom (12545 12542)
  ['r2r-thorp-54', 'run by patronage and law', 'Latin-inspired: run by custom more than by law.'],
  ['r2s-religious_conversion-thorp-3', 'run by patronage and law', 'run by custom more than by law.'],
  // civic association under an elder, a headman or a household council (03984 10044 03987 10045 10072 10046)
  ['r2s-under_siege-thorp-2', 'run by civic association', 'built on hillside ground.'],
  ['r2s-under_siege-village-2', 'run by civic association', 'built on mountain ground.'],
  ['r2s-recently_betrayed-thorp-0', 'run by civic association', 'built on the open plain.'],
  ['r2s-famine-thorp-0', 'run by civic association', 'built on riverside ground.'],
  ['r2r-hamlet-12', 'run by civic association', 'built in forest country.'],
  ['r2s-politically_fractured-hamlet-3', 'run by civic association', 'built on the open plain.'],
  // the harbour with no docks (10071 10054)
  ['r2s-indebted-village-3', 'built around the harbour', 'built on the coast.'],
  ['r2s-mass_migration-hamlet-1', 'built around the harbour', 'Greek-inspired, built on the coast.'],
  // a hall that no roster holds (15013 03970 15016 15015 15026 03969)
  ['r2s-indebted-thorp-1', 'built around the hall', 'built on kin, oath and the assembly.'],
  ['r2s-recently_betrayed-thorp-1', 'built around the hall', 'built on kin, oath and the assembly.'],
  ['r2s-infiltrated-hamlet-2', 'built around the hall', 'built on kin, oath and the assembly.'],
  ['r2r-hamlet-28', 'built around the hall', 'built by the water, on kin, oath and the assembly.'],
  ['r2s-mass_migration-hamlet-2', 'built around the hall', 'built by the water, on kin, oath and the assembly.'],
  ['r2s-succession_void-hamlet-1', 'built around the hall', 'built by the water, on kin, oath and the assembly.'],
  // every guild power Suppressed (03971)
  ['r2r-metropolis-14', 'under temple and guild', 'in quarters by trade, under the temple.'],
  // timber in the desert (18124 18128)
  ['r2r-thorp-10', 'timber compounds', 'built in compounds on land held in common, kin by kin.'],
  ['r2r-thorp-51', 'timber compounds', 'built in compounds on land held in common, kin by kin.'],
];

/** [seed, a true sibling that must still print] */
const KEEP = [
  ['r2r-thorp-4', 'built in timber and stone, and run by its estates.'], // a lord's or a landed power's town
  ['r2r-town-17', 'and run by guild and estate.'],
  ['r2r-village-36', 'and run by patronage and law.'],
  ['r2r-town-8', 'and run by civic association.'],
  ['r2s-plague_onset-village-1', 'held by clan and caravan.'], // READ-ALL 03974, struck: the Elder Council governs, the crossroads trades
  ['r2r-town-9', 'built around the Town hall, on kin, oath and the assembly.'],
  ['r2r-metropolis-13', 'built around the agora and the harbour'],
  ['r2r-thorp-23', 'built in timber compounds'],
  ['r2r-town-4', 'under temple and guild.'],
];

/** @param {any} s */
const stores = (s) => (composeTonightSheet(s).facts.find((f) => f.id === 'food') || { text: '' }).text;

/** @param {any} s */
const vantages = (s) => [].concat(s.stress || []).flatMap((e) => ['cover', 'overview', 'defence', 'tonight'].map((k) => crisisSummaryForSurface(e, s.name, /** @type {any} */ (k)) || '')).join(' ');

/** [seed, surface, the line as it printed at 9c07f7461, what prints now] */
const NOW = [
  // K11: a hamlet, a village and a thorp with no office on the roster
  ['r2s-succession_void-hamlet-2', vantages, 'and each office does as it sees fit meanwhile.', 'until the seat is filled, and meanwhile everyone does as they see fit.'],
  ['r2s-succession_void-village-0', vantages, 'and each office does as it sees fit meanwhile.', 'until the seat is filled, and meanwhile everyone does as they see fit.'],
  ['r2s-succession_void-thorp-0', vantages, 'now runs itself, and no one has the standing to make them answer.', 'has the standing to make anyone answer.'],
  // K1/K7 (READ-ALL 18671): the granary under a famine, and under a siege that leaves a gap
  ['r2s-famine-town-2', stores, 'about five months of grain.', 'Stores: a granary, about five months of grain, and the famine is eating into them.'],
  ['r2s-famine-town-3', stores, 'about three months of grain.', 'Stores: a granary, about three months of grain, and the famine is eating into them.'],
  ['r2s-under_siege-town-0', stores, 'about seven months of grain.', 'Stores: a granary, about seven months of grain, and the siege is eating into them.'],
  ['r2s-under_siege-city-0', stores, 'about nine months of grain.', 'Stores: a granary, about nine months of grain, and the siege is eating into them.'],
];
/** [seed, surface, a true line that must still print] */
const STILL = [
  ['r2r-town-0', stores, 'of grain.'], // no famine, no siege
];

describe('TAIL-CRISIS batch 2: the stores line', () => {
  it('each line prints as the record now bears it, not as it printed before', () => {
    const failures = collectSeedFailures(NOW, ([seed, surface, before, now]) => {
      const text = /** @type {(s: any) => string} */ (surface)(birth(/** @type {string} */ (seed)));
      expectAbsentWithAnchor(text, before, now, String(seed));
    });
    expectNoSeedFailures(failures, 'a line printed as before, or not as the record now bears it');
  }, 300000);
  it('every STILL line prints', () => {
    const failures = collectSeedFailures(STILL, ([seed, surface, kept]) => {
      expect(/** @type {(s: any) => string} */ (surface)(birth(/** @type {string} */ (seed))), /** @type {string} */ (seed)).toContain(kept);
    });
    expectNoSeedFailures(failures, 'a STILL line no longer prints');
  }, 300000);
});

describe('TAIL-CRISIS batch 2: the scope line names only what the town holds', () => {
  it('no FALSE clause prints, and its place is taken by the line the record bears', () => {
    const failures = collectSeedFailures(FALSE, ([seed, gone, instead]) => {
      const line = cultureScopeLine(birth(seed));
      expectAbsentWithAnchor(line, gone, instead, seed);
    });
    expectNoSeedFailures(failures, 'a FALSE clause printed, or its place was not taken');
  }, 300000);
  it('every KEEP sibling still prints', () => {
    const failures = collectSeedFailures(KEEP, ([seed, kept]) => {
      expect(cultureScopeLine(birth(seed)), seed).toContain(kept);
    });
    expectNoSeedFailures(failures, 'a KEEP sibling no longer prints');
  }, 300000);
});
