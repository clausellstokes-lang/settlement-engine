/**
 * pageCensusFindings.test.js — every row of the rendered-dossier arm reds on its planted fault, and a clean
 * dossier reads none (W2-A-LEAVES, 2026-11-12; the second wave's charter §0 item 6 (iii)). The plants are the
 * census's own shapes: two lines of one rendered dossier, or a line and the record field it contradicts.
 */
import { describe, expect, test } from 'vitest';
import { PAGE_CENSUS_ROWS, RETIRED_PAGE_CENSUS_ROWS, pageCensusFindings, viewsOfSurfaces } from '../../../src/domain/coherence/pageCensusFindings.js';
import { coherenceBattery } from '../../../src/domain/coherence/coherenceBattery.js';
import { poolMemberTexts } from '../../helpers/drawnProse.js';
import { CRIME_LINE_DISQUALIFIERS } from '../../../src/domain/display/stateProse/crimeLineDisqualifiers.js';
import { OUTSIDER_IMPRESSIONS } from '../../../src/data/dailyLife/outsiderImpressions.js';
import { FOOD_CULTURE } from '../../../src/data/dailyLife/foodCulture.js';
import { COMMONER_RESENTMENTS } from '../../../src/data/dailyLife/commonerResentments.js';

/** A corpus line, computed (never typed): the pool's first member with the town's name in its slots. */
const corpusLine = (leaf, blockId, poolKey) => poolMemberTexts({ leaf, blockId, poolKey, slots: { settlement: 'Brindle', seat: 'hall' } })[0];
/** A crime line the table declares false where no official is in pay, found by its declaration (re-keyed by identity,
 * TAIL-CLOSE-DISPLAY-1: the move 91592cbf re-said ADVANCING's lines so none presumes a bought official, and the table
 * declares none of them; RECOVERING's line that the criminals own officials carries the declaration). */
const REC_POOL = 'capture pressure RECOVERING (strong security, prosperity)';
const OWNS_OFFICIALS = Object.values(CRIME_LINE_DISQUALIFIERS[`DS-POW-6::${REC_POOL}`]).find((d) => d.falseWhere === 'no official in pay');
const CAPTURE = poolMemberTexts({ leaf: 'power', blockId: 'DS-POW-6', poolKey: REC_POOL, slots: { settlement: 'Brindle', seat: 'hall' } })
  .find((t) => OWNS_OFFICIALS && t.startsWith(OWNS_OFFICIALS.opens.replace('{settlement}', 'Brindle')));
/** ADVANCING's line that presumes no buyer ("each season it gets easier to buy an official"), found, not typed. */
const CAPTURE_TRUE = poolMemberTexts({ leaf: 'power', blockId: 'DS-POW-6', poolKey: 'capture pressure ADVANCING (weak security, poor prosperity)', slots: { settlement: 'Brindle', seat: 'hall' } })
  .find((t) => !/one at a time|never paid/.test(t));
/** A card who answers to a criminal house through their office (REVIEW-W2A F3). */
const OFFICIAL = { name: 'Panayot Pavlov', allegiance: { house: 'Smuggling network', vector: 'greed', via: 'office' } };
const HOUSES = corpusLine('economy', 'DS-ECO-12', 'INCOME WEIGHT: the religious houses');
const MAGIC = corpusLine('economy', 'DS-ECO-12', 'INCOME WEIGHT: the practice of magic');
// rows 1a and 1b RETIRED (the chair's ruling V13, 2026-11-15): the SECURE pool no longer prints either sentence (e056fbfb)
const SETTLED = corpusLine('defense', 'DS-DEF-2', 'Beasts & Monsters: settled, defenses beyond the need');

const NO_ARCANE = 'Arcane Support None · No arcane practitioners on the rolls';
/** R24-A1 (CLOSE-7): the visitor line that says no healer stands here, the pool's own words (found, not typed). */
const NO_HEALER_H7 = OUTSIDER_IMPRESSIONS['services.healing'].find((l) => l.id === 'H7').text;
/** R24-A2 (CLOSE-7): the fare line that says portions are small, the pool's own words (found, not typed). */
const PORTIONS = FOOD_CULTURE.strained.find((l) => l.id === 'T3').text;
/** CLOSE-7 THE MIRROR (R24d): a fare line of a fed band, the pool's own words */
const ENOUGH = FOOD_CULTURE.adequate.find((l) => l.id === 'A3').text;
/** A Food endurance line as the Defense tab prints it (its label, then the leaf's sentence). @param {string} sentence */
const ENDURANCE = (sentence) => `Food endurance: ${sentence}`;
/** A record whose trade brings iron and whose terrain needs clay that no trade brings (REVIEW-W2A F1). */
const NEEDS_CLAY = { economicState: { primaryImports: ['Iron'] }, resourceAnalysis: { imports: { critical: ['clay'] } } };
/** A desert place with a fish market and no water: an oasis gives no fish (B1(i), R24b). */
const DESERT_FISH_MARKET = { config: { terrainType: 'desert', tradeRouteAccess: 'desert_road', nearbyResources: ['oasis_water'] }, institutions: [{ name: 'Fish market', source: 'generated' }] };
/** @type {Record<string, { views: Record<string, string[]>, record?: Record<string, unknown> }>} */
const PLANTS = {
  P2siege: { views: { 'Systems/Defense': [ENDURANCE('the granary carries the town for about three months at full rations.')] }, record: { economicState: { foodSecurity: { hasSiege: false } } } },
  P3source: { views: { 'Systems/Defense': [NO_ARCANE], 'Systems/Magic': ['Reliance on magic: Relied upon'] } },
  P4: { views: { 'Systems/Power': ['Three powers stand almost level in Brindle.'] }, record: { powerStructure: { factions: [{ power: 80 }, { power: 30 }, { power: 25 }] } } },
  P5false: { views: { 'Systems/Power': ['Free of the criminals', CAPTURE] }, record: { powerStructure: { criminalCaptureState: 'none' } } },
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
  // R24-A1 (CLOSE-7): H7, the pool's own words, beside a priest who heals on the live roster
  NOHEAL: { views: { 'World/Daily Life': [NO_HEALER_H7] }, record: { institutions: [{ name: 'Priest (resident)' }], availableServices: { healing: [{ name: 'Healing', desc: '', institution: 'Priest (resident)' }] } } },
  // R24-A2 (CLOSE-7): the fare's "Portions are small" beside a Food Security that prints Secure
  FOODSEC: { views: { 'World/Daily Life': [PORTIONS] }, record: { economicState: { foodSecurity: { foodRecord: { band: 'secure', gapPct: 0, normalImportPct: 20 } } } } },
  // CLOSE-7 THE MIRROR (R24d): the fare's "they eat enough" beside a Food Security that prints Famine
  FEDFARE: { views: { 'World/Daily Life': [ENOUGH] }, record: { economicState: { foodSecurity: { foodRecord: { band: 'famine', gapPct: 60, normalImportPct: 20 } } } } },
  // B1(i) (RULING-R24, R24b): a fish market printed in a desert whose route and resources give no fish
  B1land: { views: { 'World/Institutions': ['Fish market'] }, record: DESERT_FISH_MARKET },
};

describe('the rendered-dossier arm: one planted fault per row', () => {
  test('every row has a plant, and every plant reds its own row and no other', () => {
    for (const line of [CAPTURE, CAPTURE_TRUE, HOUSES, MAGIC, SETTLED]) expect(typeof line).toBe('string');
    expect(Object.keys(PLANTS).sort()).toEqual(Object.keys(PAGE_CENSUS_ROWS).sort());
    for (const [row, plant] of Object.entries(PLANTS)) {
      const rows = pageCensusFindings({ tier: 'town', ...(plant.record || {}) }, plant.views).map((f) => f.row);
      expect({ row, rows }).toEqual({ row, rows: [row] });
    }
  });
  test('the controls: each plant with its contradicting half removed reads nothing', () => {
    const halves = {
      P5false: { 'Systems/Power': ['Free of the criminals'] },
      P10: { 'World/Institutions': ['The watch hold the gates at night.'] },
      NEW2: { 'Systems/Economics': PLANTS.NEW2.views['Systems/Economics'] },
      NOHEAL: PLANTS.NOHEAL.views, // R24-A1: the line with no care at hand is true
      FOODSEC: PLANTS.FOODSEC.views, // R24-A2: with no food ledger printed, the line contradicts nothing
      FEDFARE: PLANTS.FEDFARE.views, // the mirror: with no food ledger printed, the line contradicts nothing
    };
    // row 5a re-read: the same line is true where an official is in pay; the line that presumes no buyer is true at none
    expect(pageCensusFindings({ tier: 'town', npcs: [OFFICIAL], powerStructure: { criminalCaptureState: 'none' } }, PLANTS.P5false.views)).toEqual([]);
    expect(pageCensusFindings({ tier: 'town', powerStructure: { criminalCaptureState: 'none' } }, { 'Systems/Power': ['Free of the criminals', CAPTURE_TRUE] })).toEqual([]);
    // the ring's note: "bought officials" with no official in pay reds; with one it reads nothing
    const RING = ['Criminal structure: Organized syndicate', 'Crime here answers to one ring. It keeps the streets quiet because trouble brings the law, lives on protection money and the officials it pays, and anyone who needs something from it can bargain.'];
    expect(pageCensusFindings({ tier: 'town' }, { 'Systems/Defense': RING }).map((f) => f.row)).toEqual(['P5false']);
    expect(pageCensusFindings({ tier: 'town', npcs: [OFFICIAL] }, { 'Systems/Defense': RING })).toEqual([]);
    // row 6 re-read: the Imports line printing only what trade brings reads nothing beside the same need
    expect(pageCensusFindings({ tier: 'town', ...NEEDS_CLAY }, { 'Systems/Economics': ['Imports', 'Iron'] })).toEqual([]);
    for (const [row, views] of Object.entries(halves)) expect({ row, found: pageCensusFindings({ tier: 'town' }, views) }).toEqual({ row, found: [] });
    expect(pageCensusFindings({ tier: 'town' }, PLANTS.P14.views)).toEqual([]);
    // R24-A1: beside a birth alone, a rite, or care only by "Access to", no one here tends the sick: the line reads nothing
    for (const [name, institution] of [['Birth assistance', 'Midwife'], ['Religious services', 'Priest (resident)'], ['Herbal remedies', 'Access to apothecary']]) {
      expect(pageCensusFindings({ tier: 'town', institutions: [{ name: institution }], availableServices: { healing: [{ name, desc: '', institution }] } }, PLANTS.NOHEAL.views), name).toEqual([]);
    }
    // R24-A1: a sick house by name, with no service drawn, is care at hand
    expect(pageCensusFindings({ tier: 'town', institutions: [{ name: 'Small hospital' }] }, PLANTS.NOHEAL.views).map((f) => f.row)).toEqual(['NOHEAL']);
    // R24-A2: a shortage line beside a printed "Pressured" is coherent (R24a (a)); a price-only grievance beside "Secure" is true
    const fed = (/** @type {string} */ band, /** @type {number} */ gapPct) => ({ tier: 'town', economicState: { foodSecurity: { foodRecord: { band, gapPct, normalImportPct: 20 } } } });
    expect(pageCensusFindings(fed('secure', 1), PLANTS.FOODSEC.views)).toEqual([]);
    expect(pageCensusFindings(fed('pressured', 8), PLANTS.FOODSEC.views)).toEqual([]);
    const price = COMMONER_RESENTMENTS.food.find((l) => l.id === 'F6').text;
    expect(pageCensusFindings(fed('secure', 0), { 'World/Daily Life': [price] })).toEqual([]);
    expect(pageCensusFindings(fed('surplus', 0), PLANTS.FOODSEC.views).map((f) => f.row)).toEqual(['FOODSEC']);
    // THE MIRROR (R24d): a line of plenty beside a printed Pressured is inside its bound; beside a printed Deficit it reds
    expect(pageCensusFindings(fed('pressured', 8), PLANTS.FEDFARE.views)).toEqual([]);
    expect(pageCensusFindings(fed('deficit', 45), PLANTS.FEDFARE.views).map((f) => f.row)).toEqual(['FEDFARE']);
    // B1(i): the same fish market beside fishing grounds, or on a river route, or in the hills, reads nothing
    const land = (/** @type {Record<string, unknown>} */ config) => ({ tier: 'town', ...DESERT_FISH_MARKET, config: { ...DESERT_FISH_MARKET.config, ...config } });
    expect(pageCensusFindings(land({ nearbyResources: ['oasis_water', 'fishing_grounds'] }), PLANTS.B1land.views)).toEqual([]);
    expect(pageCensusFindings(land({ tradeRouteAccess: 'river' }), PLANTS.B1land.views)).toEqual([]);
    expect(pageCensusFindings(land({ terrainType: 'hills' }), PLANTS.B1land.views)).toEqual([]);
    expect(pageCensusFindings({ tier: 'town', economicState: { foodSecurity: { hasSiege: true } } }, PLANTS.P20.views)).toEqual([]);
    // row 2: besieged, the indicative is true; outside a siege, the condition reads nothing
    expect(pageCensusFindings({ tier: 'town', economicState: { foodSecurity: { hasSiege: true } } }, PLANTS.P2siege.views)).toEqual([]);
    expect(pageCensusFindings({ tier: 'town', economicState: { foodSecurity: { hasSiege: false } } }, {
      'Systems/Defense': [ENDURANCE('No granary: under siege the outlying fields would be lost; household stores would carry the town for about three months at full rations.')],
    })).toEqual([]);
  });
  test('a re-defined row is RETIRED BY NAME with its reason, never reported, and its replacement is a row (the chair, 2026-11-12)', () => {
    expect(Object.keys(RETIRED_PAGE_CENSUS_ROWS)).toEqual(['P2', 'P3any', 'P6', 'P5a', 'P1a', 'P1b']);
    for (const [id, [pattern, reason, replacedBy]] of Object.entries(RETIRED_PAGE_CENSUS_ROWS)) {
      expect(PAGE_CENSUS_ROWS[id]).toBeUndefined();
      expect(pattern.length).toBeGreaterThan(0);
      if (replacedBy === null) {
        // a row retired with NO replacement: only where the cure made its falsehood impossible (the chair's V13)
        expect(reason).toMatch(/the chair's ruling of 2026-11-15, V13/);
        expect(reason).toMatch(/no line of the corpus says/);
      } else {
        expect(PAGE_CENSUS_ROWS[replacedBy]).toBeTruthy();
        expect(reason).toMatch(/the chair's ruling of 2026-11-1[23]/);
      }
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
      'Systems/Defense': [NO_ARCANE], 'Systems/Magic': ['Reliance on magic: Relied upon · supplied by House of worship and Multiple monasteries', 'Availabilitycommon'],
    })).toEqual([]);
    // P3source counts a source printed with a catalogue range or condition, or one house named twice (REVIEW-W2A F2)
    for (const bad of ['Parish churches (10-30) and Cathedral (10,000+ only)', 'Dream parlors (high magic)', "Mages' guild, Cathedral, House of worship and Cathedral"]) {
      expect(pageCensusFindings({ tier: 'town' }, { 'Systems/Magic': [`Reliance on magic: Integral · supplied by ${bad}`] }).map((f) => f.row)).toEqual(['P3source']);
    }
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
