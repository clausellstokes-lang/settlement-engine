/**
 * pageCensusFindings.test.js — every row of the rendered-dossier arm reds on its planted fault, and a clean
 * dossier reads none (W2-A-LEAVES, 2026-11-12; the second wave's charter §0 item 6 (iii)). The plants are the
 * census's own shapes: two lines of one rendered dossier, or a line and the record field it contradicts.
 */
import { describe, expect, test } from 'vitest';
import { PAGE_CENSUS_ROWS, pageCensusFindings, viewsOfSurfaces } from '../../../src/domain/coherence/pageCensusFindings.js';
import { coherenceBattery } from '../../../src/domain/coherence/coherenceBattery.js';

const NO_ARCANE = 'Arcane Support None · No arcane practitioners on the rolls';
/** @type {Record<string, { views: Record<string, string[]>, record?: Record<string, unknown> }>} */
const PLANTS = {
  P1a: { views: { 'Systems/Economics': ['Brindle is fed, but only just.', 'It grows more than it eats.'] } },
  P1b: { views: { 'Systems/Economics': ['Brindle feeds itself with a small margin.'] }, record: { economicState: { foodSecurity: { foodRecord: { normalImportPct: 40 } } } } },
  P2: { views: { 'Systems/Economics': ['Stores: a granary of about a year of grain'], 'Systems/Defense': ['Food endurance: the town could hold for three months at full rations'] } },
  P3any: { views: { 'Systems/Defense': [NO_ARCANE], 'Systems/Magic': ['Reliance on magic: Relied upon'] } },
  P4: { views: { 'Systems/Power': ['Three powers stand almost level in Brindle.'] }, record: { powerStructure: { factions: [{ power: 80 }, { power: 30 }, { power: 25 }] } } },
  P5a: { views: { 'Systems/Power': ['Free of the criminals', 'Criminal money is reaching the officials of Brindle one at a time, because the town is poor and its streets are badly watched, and a bribe goes a long way here.'] } },
  P5b: { views: { 'Systems/Defense': ['Criminal structure: Diffuse', 'Underworld: the Night Hands'] } },
  P6: { views: { 'Systems/Economics': ['Imports', 'Iron, salt'], 'Systems/Resources': ['No iron reaches the smithy.'] } },
  P7a: { views: { 'World/History': ['Origin:was founded by a band of veteran soldiers', 'Founded by:a merchant consortium'] } },
  P7b: { views: { 'Summary/Overview': ['Settlement Origin▲', 'No wharf stands on this shore.'], 'World/History': ['Origin:grew as a trading port'] } },
  P8any: { views: { 'Systems/Faith': ['Brindle has no church of its own.'], 'Systems/Economics': ["Faith carries real weight in Brindle's money. What the religious houses take in and spend is a large part of the town's business."] } },
  P9: { views: { 'Systems/Defense': ['Beasts & Monsters', 'Critical▼', 'There is very little in the country around Brindle and there are substantial works facing it; whatever the walls here are for, it is not the creatures.'] } },
  P10: { views: { 'World/Institutions': ['The watch hold the gates at night.'], 'Systems/Defense': ['Unfortified. No perimeter walls.'] } },
  P11: { views: { 'Systems/Economics': ['Iron ore · From the hills'] }, record: { config: { nearbyResources: ['timber'] }, economicState: { activeChains: [{ label: 'Ironworking', resource: 'Iron ore', resourceKey: 'iron_deposits' }] } } },
  F4: { views: { 'Systems/Economics': ['Local quarry provides dressed stone for the town.'] }, record: { institutions: [{ name: 'Tavern' }] } },
  P13: { views: { 'Systems/Defense': ['They eat more slowly and less comfortably and go on. They go on.'] } },
  P14: { views: { 'Systems/Economics': ['The urban food supply depends on the carts.'] }, record: { tier: 'hamlet' } },
  P16three: { views: { 'Systems/Power': ['The ruling three of Brindle', 'Head · the Elder', 'Second · the Priest'] } },
  P16powers: { views: { 'Systems/Power': ['The Powers (3)', 'The Powers (5)'] } },
  P17: { views: { 'Systems/Economics': ['Produced locally', 'Grain, Mill access'] } },
  P18: { views: { 'World/NPCs': ['Brother Anselm, Temple (1-3)'] } },
  P19: { views: { 'World/History': ['Tannery operating on stockpiles only: 2 inputs missing (hides, bark)'] } },
  P20: { views: { 'Systems/Defense': ['Under siege the outlying fields are lost first.'] }, record: { economicState: { foodSecurity: { hasSiege: false } } } },
  NEW1: { views: { 'Summary/Overview': ['Brindle', 'Town · Council · underdefended', 'Defense', 'Fortress'] } },
  NEW2: { views: { 'Systems/Defense': [NO_ARCANE], 'Systems/Economics': ["Magic carries real weight in Brindle's money. What the town's practitioners charge for, and what they buy, is a large part of its business."] } },
};

describe('the rendered-dossier arm: one planted fault per row', () => {
  test('every row has a plant, and every plant reds its own row and no other', () => {
    expect(Object.keys(PLANTS).sort()).toEqual(Object.keys(PAGE_CENSUS_ROWS).sort());
    for (const [row, plant] of Object.entries(PLANTS)) {
      const rows = pageCensusFindings({ tier: 'town', ...(plant.record || {}) }, plant.views).map((f) => f.row);
      expect({ row, rows }).toEqual({ row, rows: [row] });
    }
  });
  test('the controls: each plant with its contradicting half removed reads nothing', () => {
    const halves = {
      P1a: { 'Systems/Economics': ['Brindle is fed, but only just.'] },
      P5a: { 'Systems/Power': ['Free of the criminals'] },
      P10: { 'World/Institutions': ['The watch hold the gates at night.'] },
      NEW2: { 'Systems/Economics': PLANTS.NEW2.views['Systems/Economics'] },
    };
    for (const [row, views] of Object.entries(halves)) expect({ row, found: pageCensusFindings({ tier: 'town' }, views) }).toEqual({ row, found: [] });
    expect(pageCensusFindings({ tier: 'town' }, PLANTS.P14.views)).toEqual([]);
    expect(pageCensusFindings({ tier: 'town', economicState: { foodSecurity: { hasSiege: true } } }, PLANTS.P20.views)).toEqual([]);
  });
  test('registered in the page battery: a rendered view reds `page-census`; surfaces that are not views read nothing', () => {
    const surfaces = { 'Systems/Defense': PLANTS.P13.views['Systems/Defense'].join('\n'), economics: 'They eat more slowly and less comfortably and go on.' };
    expect(viewsOfSurfaces(surfaces)).toEqual({ 'Systems/Defense': PLANTS.P13.views['Systems/Defense'] });
    const found = coherenceBattery({ tier: 'town' }, surfaces, { only: ['page-census'] });
    expect(found).toEqual([{ check: 'page-census', surface: 'page', quote: 'They eat more slowly and less comfortably and go on. They go on.', detail: 'P13: ' }]);
    expect(coherenceBattery({ tier: 'town' }, { economics: surfaces.economics }, { only: ['page-census'] })).toEqual([]);
  });
});
