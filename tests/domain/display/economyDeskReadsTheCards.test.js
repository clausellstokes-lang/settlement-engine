/**
 * economyDeskReadsTheCards.test.js — W2-C-LEAVES-3, the chair's ruling P1-c (2026-11-13): DS-ECO-11's exploitation line
 * read the resource analysis's filing while the Resources tab's cards print the chain leaf's grade (P1, P1-a, P1-b): in
 * 161 towns of the census's 720 at 9bcf0127a (187 after P1-a and P1-b) the line spoke of a card the page prints at
 * another grade ("… nothing in the town takes it out of the ground" beside a working chain).
 * The ONE READ: the selector (`economyStateProse.js :: leadingExploitation`) is handed `validationOnPage.js ::
 * exploitationForDesk`, the cards as the page reads them: a card moved to Unexploited is not offered (its pool's
 * "{institution}" would name a house the town keeps), a Partial row only where the town sells the raw good and still
 * lacks a house that finishes it (the Partial pool says the raw material leaves unfinished and is sold), and every
 * row's houses are the ones still needed here.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { leadingExploitation } from '../../../src/domain/display/stateProse/economyStateProse.js';
import { exploitationForDesk, exploitationGroupsShown } from '../../../src/domain/display/validationOnPage.js';
import { economyDeskRead } from '../../../src/components/new/economyDeskRead.js';

/** The app's own shape, as the reader REVIEW-R2-STAGES born its towns (render.rr2s.jsx :: cfgFor). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rr2s-(\w+)-([a-z_+]+)-([a-z_]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};
const READER_SEEDS = [
  'rr2s-thorp-calm-rand-1', 'rr2s-thorp-famine-rand-1', 'rr2s-thorp-calm-port-1', 'rr2s-hamlet-calm-rand-1',
  'rr2s-hamlet-under_siege-rand-1', 'rr2s-hamlet-plague_onset-rand-1', 'rr2s-village-calm-port-1', 'rr2s-village-famine-rand-1',
  'rr2s-village-monster_pressure-rand-1', 'rr2s-town-calm-rand-1', 'rr2s-town-under_siege-rand-1', 'rr2s-town-plague_onset-rand-1',
  'rr2s-town-indebted-port-1', 'rr2s-city-calm-rand-1', 'rr2s-city-famine-rand-1', 'rr2s-city-under_siege+famine-rand-1',
  'rr2s-city-occupied-rand-1', 'rr2s-metropolis-calm-rand-1', 'rr2s-metropolis-wartime-rand-1', 'rr2s-metropolis-plague_onset-port-1',
];
const BUCKET = /** @type {const} */ ({ unexploited: 'unexploited', partiallyExploited: 'partial', fullyExploited: 'full' });

describe('DS-ECO-11\'s exploitation line reads the grade the cards print (P1-c)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: a worked card is not "unexploited" to the desk; a Partial row needs a raw good sold and a house still missing; the houses are the ones still needed', () => {
    /** @param {Record<string, object[]>} exploitation @param {string[]} houses @param {string[]} exports @param {object[]} [chains] */
    const town = (exploitation, houses, exports, chains = []) => ({ name: 'Testford', config: { nearbyResources: ['grazing_land', 'managed_forest'] },
      institutions: houses.map((name) => ({ name })), economicState: { activeChains: chains, primaryExports: exports },
      resourceAnalysis: { exploitation, gaps: [] } });
    const WOOL = { rawResource: 'wool', exportValue: 'medium', processingInstitutions: ["Weavers' guild", "Dyers' guild", 'Fulling mill'], finalProducts: ['cloth'] };
    const TIMBER = { rawResource: 'timber', exportValue: 'high', processingInstitutions: ['Sawmill', "Carpenters' guild"] };
    const running = [{ chainId: 'timber', resourceInputKey: 'managed_forest', resourceInputAvailable: true, status: 'running', processingInstitutions: ['Carpenter'] }];
    expect(leadingExploitation(exploitationForDesk(town({ unexploited: [TIMBER] }, ['Carpenter'], [], running))), 'worked timber: not the unexploited pool').toBeNull();
    const sold = leadingExploitation(exploitationForDesk(town({ partiallyExploited: [WOOL] }, ['Weavers/Textile workers'], ['Raw wool'])));
    expect(sold?.bucket).toBe('partiallyExploited');
    expect(sold?.row.processingInstitutions, 'the houses still needed: the weavers stand').toEqual(["Dyers' guild", 'Fulling mill']);
    expect(leadingExploitation(exploitationForDesk(town({ partiallyExploited: [WOOL] }, ['Weavers/Textile workers'], []))), 'no raw good sold: no Partial line').toBeNull();
    expect(leadingExploitation(exploitationForDesk(town({ partiallyExploited: [WOOL] }, ['Weaver', 'Dyer', 'Fuller'], ['Raw wool']))), 'every finisher stands: no Partial line').toBeNull();
  });

  test('on the reader\'s twenty towns: the line\'s grade is the card\'s, and the drawn sentence is of that pool', () => {
    /** @type {string[]} */ const faults = [];
    for (const seed of READER_SEEDS) {
      const town = birthApp(seed);
      const lead = leadingExploitation(exploitationForDesk(town));
      const desk = /** @type {any} */ (economyDeskRead(town, { publicDossier: false, playerView: false, publicSite: 'economy:resources', tier: town.tier })).exploitation;
      if (!lead) { if (desk) faults.push(`${seed}: a line with no row`); continue; }
      const shown = exploitationGroupsShown(town);
      const card = Object.entries(shown).find(([, xs]) => xs.some((x) => x.card.rawResource === lead.row.rawResource));
      if (!card || card[0] !== BUCKET[lead.bucket]) faults.push(`${seed}: the line speaks of ${lead.row.rawResource} as ${lead.bucket}, the card prints ${card?.[0]}`);
      if (desk && !String(desk.provenance?.poolKey).includes(lead.bucket)) faults.push(`${seed}: drawn from ${desk.provenance?.poolKey}`);
    }
    expect(faults).toEqual([]);
  }, 240000);

  test('the reader\'s town: the hides a Tanner (established) works are not "unexploited" to the desk (rr2s-city-occupied-rand-1)', () => {
    const town = birthApp('rr2s-city-occupied-rand-1');
    expect(leadingExploitation(town.resourceAnalysis)?.bucket, 'anchored: the filing leads with the hides').toBe('unexploited');
    const lead = leadingExploitation(exploitationForDesk(town));
    expect(lead?.row.rawResource === 'animal hides' && lead.bucket === 'unexploited').toBe(false);
  }, 60000);
});
