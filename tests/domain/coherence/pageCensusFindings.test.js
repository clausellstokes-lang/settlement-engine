/**
 * pageCensusFindings.test.js — every row of the rendered-dossier arm reds on its planted fault, and a clean
 * dossier reads none (W2-A-LEAVES, 2026-11-12; the second wave's charter §0 item 6 (iii)). The plants are the
 * census's own shapes: two lines of one rendered dossier, or a line and the record field it contradicts.
 */
import { describe, expect, test } from 'vitest';
import { PAGE_CENSUS_ROWS, RETIRED_PAGE_CENSUS_ROWS, pageCensusFindings, viewsOfSurfaces } from '../../../src/domain/coherence/pageCensusFindings.js';
import { coherenceBattery } from '../../../src/domain/coherence/coherenceBattery.js';
import { poolMemberTexts } from '../../helpers/drawnProse.js';

/** A corpus line, computed (never typed): the pool's first member with the town's name in its slots. */
const corpusLine = (leaf, blockId, poolKey) => poolMemberTexts({ leaf, blockId, poolKey, slots: { settlement: 'Brindle', seat: 'hall' } })[0];
const CAPTURE = corpusLine('power', 'DS-POW-6', 'capture pressure ADVANCING (weak security, poor prosperity)');
const HOUSES = corpusLine('economy', 'DS-ECO-12', 'INCOME WEIGHT: the religious houses');
const MAGIC = corpusLine('economy', 'DS-ECO-12', 'INCOME WEIGHT: the practice of magic');
const SECURE = poolMemberTexts({ leaf: 'economy', blockId: 'DS-ECO-9', poolKey: 'SECURE', slots: { settlement: 'Brindle' } });
// the SECURE pool's members the arm's 1a and 1b rows read, found by the rows themselves (no sentence typed here)
const ONLY_JUST = SECURE.find((t) => pageCensusFindings({}, { 'Systems/Economics': [t, 'It grows more than it eats.'] }).some((f) => f.row === 'P1a'));
const SMALL_MARGIN = SECURE.find((t) => pageCensusFindings({ economicState: { foodSecurity: { foodRecord: { normalImportPct: 40 } } } }, { 'Systems/Economics': [t] }).some((f) => f.row === 'P1b'));
const SETTLED = corpusLine('defense', 'DS-DEF-2', 'Beasts & Monsters: settled, defenses beyond the need');

const NO_ARCANE = 'Arcane Support None · No arcane practitioners on the rolls';
/** A Food endurance line as the Defense tab prints it (its label, then the leaf's sentence). @param {string} sentence */
const ENDURANCE = (sentence) => `Food endurance: ${sentence}`;
/** A record whose trade brings iron and whose terrain needs clay that no trade brings (REVIEW-W2A F1). */
const NEEDS_CLAY = { economicState: { primaryImports: ['Iron'] }, resourceAnalysis: { imports: { critical: ['clay'] } } };
/** @type {Record<string, { views: Record<string, string[]>, record?: Record<string, unknown> }>} */
const PLANTS = {
  P1a: { views: { 'Systems/Economics': [ONLY_JUST, 'It grows more than it eats.'] } },
  P1b: { views: { 'Systems/Economics': [SMALL_MARGIN] }, record: { economicState: { foodSecurity: { foodRecord: { normalImportPct: 40 } } } } },
  P2siege: { views: { 'Systems/Defense': [ENDURANCE('the granary carries the town for about three months at full rations.')] }, record: { economicState: { foodSecurity: { hasSiege: false } } } },
  P3source: { views: { 'Systems/Defense': [NO_ARCANE], 'Systems/Magic': ['Reliance on magic: Relied upon'] } },
  P4: { views: { 'Systems/Power': ['Three powers stand almost level in Brindle.'] }, record: { powerStructure: { factions: [{ power: 80 }, { power: 30 }, { power: 25 }] } } },
  P5a: { views: { 'Systems/Power': ['Free of the criminals', CAPTURE] } },
  P5b: { views: { 'Systems/Defense': ['Criminal structure: Diffuse', 'Underworld: the Night Hands'] } },
  P6need: { views: { 'Systems/Economics': ['Imports', 'ClayIron'] }, record: NEEDS_CLAY },
  P7a: { views: { 'World/History': ['Origin:was founded by a band of veteran soldiers', 'Founded by:a merchant consortium'] } },
  P7b: { views: { 'Summary/Overview': ['Settlement Origin▲', 'No wharf stands on this shore.'], 'World/History': ['Origin:grew as a trading port'] } },
  P8any: { views: { 'Systems/Faith': ['Brindle has no church of its own.'], 'Systems/Economics': [HOUSES] } },
  P9: { views: { 'Systems/Defense': ['Beasts & Monsters', 'Critical▼', SETTLED] } },
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
  NEW2: { views: { 'Systems/Defense': [NO_ARCANE], 'Systems/Economics': [MAGIC] } },
};

describe('the rendered-dossier arm: one planted fault per row', () => {
  test('every row has a plant, and every plant reds its own row and no other', () => {
    for (const line of [CAPTURE, HOUSES, MAGIC, SETTLED, ONLY_JUST, SMALL_MARGIN]) expect(typeof line).toBe('string');
    expect(Object.keys(PLANTS).sort()).toEqual(Object.keys(PAGE_CENSUS_ROWS).sort());
    for (const [row, plant] of Object.entries(PLANTS)) {
      const rows = pageCensusFindings({ tier: 'town', ...(plant.record || {}) }, plant.views).map((f) => f.row);
      expect({ row, rows }).toEqual({ row, rows: [row] });
    }
  });
  test('the controls: each plant with its contradicting half removed reads nothing', () => {
    const halves = {
      P1a: { 'Systems/Economics': [ONLY_JUST] },
      P5a: { 'Systems/Power': ['Free of the criminals'] },
      P10: { 'World/Institutions': ['The watch hold the gates at night.'] },
      NEW2: { 'Systems/Economics': PLANTS.NEW2.views['Systems/Economics'] },
    };
    // row 6 re-read: the Imports line printing only what trade brings reads nothing beside the same need
    expect(pageCensusFindings({ tier: 'town', ...NEEDS_CLAY }, { 'Systems/Economics': ['Imports', 'Iron'] })).toEqual([]);
    for (const [row, views] of Object.entries(halves)) expect({ row, found: pageCensusFindings({ tier: 'town' }, views) }).toEqual({ row, found: [] });
    expect(pageCensusFindings({ tier: 'town' }, PLANTS.P14.views)).toEqual([]);
    expect(pageCensusFindings({ tier: 'town', economicState: { foodSecurity: { hasSiege: true } } }, PLANTS.P20.views)).toEqual([]);
    // row 2: besieged, the indicative is true; outside a siege, the condition reads nothing
    expect(pageCensusFindings({ tier: 'town', economicState: { foodSecurity: { hasSiege: true } } }, PLANTS.P2siege.views)).toEqual([]);
    expect(pageCensusFindings({ tier: 'town', economicState: { foodSecurity: { hasSiege: false } } }, {
      'Systems/Defense': [ENDURANCE('No granary: under siege the outlying fields would be lost; household stores would carry the town for about three months at full rations.')],
    })).toEqual([]);
  });
  test('a re-defined row is RETIRED BY NAME with its reason, never reported, and its replacement is a row (the chair, 2026-11-12)', () => {
    expect(Object.keys(RETIRED_PAGE_CENSUS_ROWS)).toEqual(['P2', 'P3any', 'P6']);
    for (const [id, [pattern, reason, replacedBy]] of Object.entries(RETIRED_PAGE_CENSUS_ROWS)) {
      expect(PAGE_CENSUS_ROWS[id]).toBeUndefined();
      expect(PAGE_CENSUS_ROWS[replacedBy]).toBeTruthy();
      expect(pattern.length).toBeGreaterThan(0);
      expect(reason).toMatch(/the chair's ruling of 2026-11-1[23]/);
    }
    // row 6's retired shape: a true gap beside an Imports line that does not print its good reads nothing; the gap
    // beside its good on the Imports line is now read as the IMPORT's fault (P6need), from the record's need list
    expect(pageCensusFindings({ tier: 'town', ...NEEDS_CLAY }, {
      'Systems/Economics': ['Imports', 'Iron'], 'Systems/Resources': ['No clay reaches the potter.'],
    })).toEqual([]);
    expect(pageCensusFindings({ tier: 'town', ...NEEDS_CLAY }, {
      'Systems/Economics': ['Imports', 'ClayIron'], 'Systems/Resources': ['No clay reaches the potter.'],
    }).map((f) => f.row)).toEqual(['P6need']);
    expect(RETIRED_PAGE_CENSUS_ROWS.P2[1]).toMatch(/owner's design/);
    // row 3's retired shapes: a reliance whose source is named, and magic common with no reliance, read nothing
    expect(pageCensusFindings({ tier: 'town' }, {
      'Systems/Defense': [NO_ARCANE], 'Systems/Magic': ['Reliance on magic: Relied upon · supplied by Parish church and Multiple monasteries', 'Availabilitycommon'],
    })).toEqual([]);
    // the retired row's own shape (two durations, outside a siege, in the condition) reads nothing now
    expect(pageCensusFindings({ tier: 'town', economicState: { foodSecurity: { hasSiege: false } } }, {
      'Systems/Economics': ['Stores: a granary of about a year of grain'],
      'Systems/Defense': [ENDURANCE('the granary would carry the town for about three months at full rations.')],
    })).toEqual([]);
  });
  test('registered in the page battery: a rendered view reds `page-census`; surfaces that are not views read nothing', () => {
    const surfaces = { 'Systems/Defense': PLANTS.P13.views['Systems/Defense'].join('\n'), economics: 'They eat more slowly and less comfortably and go on.' };
    expect(viewsOfSurfaces(surfaces)).toEqual({ 'Systems/Defense': PLANTS.P13.views['Systems/Defense'] });
    const found = coherenceBattery({ tier: 'town' }, surfaces, { only: ['page-census'] });
    expect(found).toEqual([{ check: 'page-census', surface: 'page', quote: 'They eat more slowly and less comfortably and go on. They go on.', detail: 'P13: ' }]);
    expect(coherenceBattery({ tier: 'town' }, { economics: surfaces.economics }, { only: ['page-census'] })).toEqual([]);
  });
});
