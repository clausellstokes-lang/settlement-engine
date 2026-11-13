/**
 * W2-FIX-DATA-HISTORY (2026-11-13) — the history, culture and arrival lines of the data lane's seventh seat, each item a
 * describe of its own, each with its GUARD: a fixed town, born in the app's own shape (the configuration panel: Random
 * off, the ticked list), in which the cured line must not print, beside the town in which it still does.
 *
 * ITEM A (ROUND-3-CUT-INCREMENT ww-543, ww-572, ww-1524; CENSUS-2's `historyDescVariants.js :: economic_disparity`,
 * 46 towns): the Economic Divide is merchants against labourers, and the trade dispute "touched every merchant and every
 * purse in town"; each printed in hamlets the market home reads none in. Each needs a market
 * (`historyGenerator.js :: HISTORY_TEMPLATE_RECORD_DECLARATIONS`), the divide and the crash its pool falls to as past
 * events too.
 *
 * ITEM C (the review of the data lane, L4; ROUND-3-CUT-INCREMENT ww-254, ww-724, ww-752, ww-754, ww-755, ww-756): the
 * occupation's legacy (collaborators and resisters, a former occupier officer) printed in towns whose timeline holds no
 * occupation; it is set aside there (`historyData.js :: tensionHeldByTimeline`), and the former officer is not said
 * under an occupation in force.
 *
 * ITEM L (the first cut's #267, round two's #368; ROUND-3-CUT-INCREMENT ww-1489): the shortage's lead said a town "runs
 * mostly" on its first export's trade where that trade is a sliver of its income; it reads the income shares now
 * (`historyData.js :: livelihoodLead`).
 *
 * ITEM D (the review of the data lane, L4: "... successive stages of expansion", "The main street ends at the administrative
 * precinct", "... organized neighborhoods"; CENSUS-2 kind c): thirteen architectural details that name a larger place's
 * wards, quarters, squares, market streets, civic centre or agora declare their size, each with a small-place twin
 * (`cultureProfiles.js :: CULTURE_LINE_SIBLINGS`), resolved at the materializer (which answers the tier).
 *
 * ITEM B (ROUND-3-CUT-INCREMENT ww-10, ww-345; CENSUS-2 kinds a and c on `cultureProfiles.js :: foodways`): the foodways
 * reader (`domain/foodways.js :: composeFoodwaysLine`) keeps a culture sentence only where it names no food source the
 * place lacks and no market where none stands; three sentences said what it could not see (herding and farming, the
 * neighbourhood vendors, an urban supply from shared waterworks). They now speak in its own words, or name nothing false.
 *
 * ITEM E (CENSUS-2's `historyGenerator.js :: generateRelationshipEvent` writer; ROUND-3-CUT-INCREMENT ww-26, ww-90): the
 * resource events named what the town lacks (civic buildings or a cathedral in a village of 89, a quarrymen's guild, the
 * merchant guilds of a hamlet, a district of a thorp, extraction and a mining contract with no mine); their texts resolve
 * through `historyData.js :: HISTORY_DESC_SIBLINGS` where the event is written (`sizedResourceEvent`). And two timeline
 * hooks declare: the plague's healer (`healer`) and the wild magic's district (`tier: ≥ town`).
 *
 * ITEM F (ROUND-3-CUT-INCREMENT ww-541; CENSUS-2 kinds a and b on `arrivalProse.js` and `inlandDescriptions.js`): lanes of
 * trades in a hamlet, a merchant bargaining where no market stands, planks waiting for carts on a road a siege has cut,
 * and an inland fish stall's fish "brought in by cart" at a steady price under a siege.
 *
 * ITEM G (ROUND-3-CUT-INCREMENT pf-160, ww-1230, ww-1261; CENSUS-2 historyData.js factions): the ailing ruler naming a
 * successor under an elders' council; a warehouse the roster lacks; an open hunt for agents while the infiltration goes
 * unseen; the temple's beneficiaries where no temple stands.
 *
 * THIS FILE REDS WHEN: a cured line prints again in its guard town, or a declaration is dropped or turned.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { HISTORY_TEMPLATE_RECORD_DECLARATIONS, trueToRecordAt } from '../../src/generators/historyGenerator.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { CULTURE_LINE_SIBLINGS } from '../../src/data/cultureProfiles.js';
import { HISTORICAL_EVENTS_DATA, TENSIONS_THAT_NEED_THEIR_OWN_EVENT, tensionHeldByTimeline, livelihoodLead, sizedResourceEvent } from '../../src/data/historyData.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** A reader's town re-born in the app's own shape (the seed's tier and ticked crises). */
const born = (/** @type {string} */ seed) => {
  const [, settType, crises, route] = /** @type {RegExpMatchArray} */ (seed.match(/^r[a-z0-9]+-(\w+?)-([a-z_+]+)(?:-([a-z_]+))?-\d+$/));
  const selectedStresses = crises === 'calm' ? [] : crises.split('+');
  const routed = route && route !== 'rand' ? { tradeRouteAccess: route } : {}; // REVIEW-R2-STAGES' rr2s-<size>-<crises>-<rand|route>-1
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...routed, settType, selectedStressesRandom: false, selectedStresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** Every history sentence of a record (the timeline's and the tensions'). */
const historyText = (/** @type {any} */ s) => JSON.stringify([s.history.historicalEvents, s.history.currentTensions]);
const townWith = (/** @type {string[]} */ houses) => factsOf({ tier: 'village', institutions: houses.map((name) => ({ name, tags: name === 'Weekly market' ? ['market'] : [] })), config: {} });

describe('W2-FIX-DATA-HISTORY item A: merchants only where a market stands', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('the divide, the dispute and the crash declare the market they presume', () => {
    expect(HISTORY_TEMPLATE_RECORD_DECLARATIONS.economic_disparity).toEqual({ needs: ['market'], timeline: true });
    expect(HISTORY_TEMPLATE_RECORD_DECLARATIONS.trade_dispute).toEqual({ needs: ['market'], timeline: false });
    expect(HISTORY_TEMPLATE_RECORD_DECLARATIONS.market_crash).toEqual({ needs: ['market'], timeline: true });
  });

  it('refused where the market home reads none, admitted where it reads one', () => {
    const none = townWith([]); const market = townWith(['Weekly market']);
    expect(market.market, 'the fixture holds a market').toBe(true);
    for (const type of ['economic_disparity', 'trade_dispute', 'market_crash']) {
      expect(trueToRecordAt({ type }, none, true), `${type}: no market`).toBe(false);
      expect(trueToRecordAt({ type }, market, true), `${type}: a market`).toBe(true);
    }
    expect(trueToRecordAt({ type: 'economic_disparity' }, none, false), 'the divide as a past event').toBe(false);
    expect(trueToRecordAt({ type: 'trade_dispute' }, none, false), 'the dispute is judged as a tension only').toBe(true);
  });

  // GUARDS: the readers' own towns (ww-543 and ww-572; ww-1524), each a hamlet with no market
  for (const [seed, words] of /** @type {const} */ ([
    ['rww-hamlet-succession_void-1', ['The merchants are getting richer', 'A merchant is funding both', 'The merchant class prospers', 'The Economic Divide']],
    ['rww-hamlet-calm-1', ['every merchant and every purse', 'Merchants tied to the old partner']],
  ])) {
    it(`${seed}: no merchant of the divide or the dispute where no market stands, and the town keeps its history`, () => {
      const s = born(seed);
      expect(factsOf(s).market, `${seed} has no market`).toBe(false);
      const text = historyText(s);
      expect(words.filter((w) => text.includes(w))).toEqual([]);
      expect(s.history.currentTensions.length, 'the town still carries a current tension').toBeGreaterThan(0);
    }, 60_000);
  }
});

describe('W2-FIX-DATA-HISTORY item C: the occupation\'s legacy only where the timeline holds the occupation', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const OCCUPATION_WORDS = /collaborat|resistance fighters|resistance famil|occupier/i;

  it('the legacy needs its own past; every other tension stands as before', () => {
    expect(TENSIONS_THAT_NEED_THEIR_OWN_EVENT).toEqual(['occupation_legacy']);
    expect(tensionHeldByTimeline({ type: 'occupation_legacy' }, [{ templateType: 'religious_tension' }])).toBe(false);
    expect(tensionHeldByTimeline({ type: 'occupation_legacy' }, [{ templateType: 'occupation_legacy', yearsAgo: 120 }])).toBe(true);
    expect(tensionHeldByTimeline({ type: 'great_fire' }, [])).toBe(true);
    const officer = HISTORICAL_EVENTS_DATA.find((e) => e.type === 'occupation_legacy')?.plotHooks?.find((h) => typeof h === 'object');
    expect(officer).toEqual({ text: 'A former occupier officer has returned under a false identity', excludes: ['crisis: occupied'] });
  });

  // GUARDS: the readers' own towns with no occupation on the timeline (a thorp under a siege, ww-254; a calm city, ww-752..756)
  for (const seed of ['rww-thorp-under_siege-1', 'rww-city-calm-1', 'rww-hamlet-under_siege-1']) {
    it(`${seed}: no tension speaks of collaborators or an occupier, and the town keeps a tension`, () => {
      const s = born(seed);
      expect(s.history.historicalEvents.some((/** @type {any} */ e) => e.templateType === 'occupation_legacy'), 'no occupation on the timeline').toBe(false);
      expect(JSON.stringify(s.history.currentTensions)).not.toMatch(OCCUPATION_WORDS);
      expect(s.history.currentTensions.length).toBeGreaterThan(0);
    }, 60_000);
  }
  it('rpf-thorp-occupied-13: under an occupation in force no "former occupier officer" is told, and its Occupation keeps its account', () => {
    const s = born('rpf-thorp-occupied-13');
    expect(factsOf(s).crisis.kinds).toContain('occupied');
    const own = s.history.historicalEvents.find((/** @type {any} */ e) => e.templateType === 'occupation_legacy');
    expect(own, 'the past Occupation on the timeline').toBeTruthy();
    expect(historyText(s)).not.toContain('former occupier officer');
  }, 60_000);
});

describe('W2-FIX-DATA-HISTORY item L: the lead says what the town lives on by its income shares', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const inc = (/** @type {[string, number][]} */ rows) => rows.map(([source, percentage]) => ({ source, percentage }));

  it('"mostly" only where the trade is the largest source and more than half; the largest, among the trades, or nothing', () => {
    expect(livelihoodLead('timber', inc([['Timber Trade', 61], ['Market Taxes', 39]]))).toBe('Life here runs mostly on the timber trade, and that trade is under strain.');
    expect(livelihoodLead('timber', inc([['Timber Trade', 40], ['Market Taxes', 35], ['Guild Fees', 25]]))).toBe('The timber trade is the largest the place lives by, and it is under strain.');
    expect(livelihoodLead('timber', inc([['Agricultural Rents', 92], ['Timber Trade', 8]]))).toBe('Among the trades the place lives by, the timber trade is under strain.');
    expect(livelihoodLead('wool', inc([['Agricultural Rents', 92], ['Timber Trade', 8]])), 'no wool income: no lead').toBe('');
    expect(livelihoodLead('salt', inc([['Agricultural Rents', 100]])), 'no income source of that trade').toBe('');
    expect(livelihoodLead(null, inc([['Timber Trade', 100]]))).toBe('');
  });

  it('rr2s-village-famine-rand-1 (#267): timber is a sliver of the income, so the town does not "run mostly" on it', () => {
    const s = born('rr2s-village-famine-rand-1');
    const timber = (s.economicState.incomeSources || []).find((/** @type {any} */ r) => r.source === 'Timber Trade');
    expect(timber && timber.percentage, 'timber is a lesser source here').toBeLessThan(50);
    const text = historyText(s);
    expect(text).not.toContain('runs mostly on the timber trade');
    expect(text).toContain('Among the trades the place lives by, the timber trade is under strain.');
  }, 60_000);
});

describe('W2-FIX-DATA-HISTORY item D: a culture detail of a larger place does not print in a small one', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const LARGE = /older wards|principal square|civic center|market streets|merchant quarter|successive stages of expansion|ward gates, shop fronts|administrative precinct|organized neighborhoods|workshop lanes layer|occupational quarters|busiest civic ground|approaches to the agora/;

  it('each of the thirteen declares its size and has a twin for the smaller places', () => {
    const mine = Object.entries(CULTURE_LINE_SIBLINGS).filter(([k]) => LARGE.test(k));
    expect(mine.length).toBe(13);
    for (const [, [own, twin]] of mine) {
      expect(own.needs.some((a) => /^tier: ≥ (village|town)$/.test(a)), own.text).toBe(true);
      expect(twin.twinOf).toBe(own.text);
      expect(twin.needs.length === 1 && /^tier: ≤ (hamlet|village)$/.test(twin.needs[0]), twin.text).toBe(true);
      expect(LARGE.test(twin.text), twin.text).toBe(false);
    }
  });

  // GUARDS: the readers' small towns that printed a larger place's detail at the base
  for (const seed of ['rww-thorp-under_siege-1', 'rww-hamlet-succession_void-1', 'rpf-thorp-occupied-13', 'rw3-thorp-famine-1', 'rr2s-village-calm-port-1']) {
    it(`${seed}: its detail (record, PDF, arrival) names no larger place's ground, and it keeps one`, () => {
      const s = born(seed);
      expect(['thorp', 'hamlet', 'village']).toContain(s.tier);
      expect(String(s.culturalIdentity.architecturalDetail)).not.toMatch(LARGE);
      expect(String(s.arrivalScene)).not.toMatch(LARGE);
      expect(String(s.culturalIdentity.architecturalDetail).length).toBeGreaterThan(0);
    }, 60_000);
  }
});

describe('W2-FIX-DATA-HISTORY item B: the culture\'s foodways sentence only where the place\'s own table makes it true', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const foodways = (/** @type {any} */ s) => String(s.economicState?.foodSecurity?.foodRecord?.foodwaysLine || '');
  for (const [seed, words, why] of /** @type {const} */ ([
    ['rww-thorp-calm-1', /Herding and mixed farming|Herds and field grain/, 'a thorp that eats game (ww-10)'],
    ['rww-thorp-monster_pressure-1', /neighborhood vendors|Public ovens/, 'a thorp with no market and no neighbourhoods'],
    ['rww-hamlet-succession_void-1', /urban food supply|waterworks/, 'a hamlet of 31'],
  ])) {
    it(`${seed}: ${why} reads no such sentence, and keeps a foodways line`, () => {
      const s = born(seed);
      expect(foodways(s)).not.toMatch(words);
      expect(foodways(s).length).toBeGreaterThan(0);
    }, 60_000);
  }
  it('the herds and the grain are named in the reader\'s own source words', async () => {
    const { sourcesNamedIn } = await import('../../src/domain/foodways.js');
    expect(sourcesNamedIn('Herds and field grain set a strongly seasonal food calendar.').sort()).toEqual(['grain', 'livestock']);
  });
});

describe('W2-FIX-DATA-HISTORY item E: the resource events and two timeline hooks say only what the town holds', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const village = (/** @type {string[]} */ houses, tier = 'village') => factsOf({ tier, institutions: houses.map((name) => ({ name })), config: {} });

  it('each text resolves to its twin, or is dropped, where the town makes it false', () => {
    const construction = { description: "A period of ambitious stone construction transformed the settlement's character. Civic buildings or a cathedral raised from local quarry stone. The quarry workers became a political force.", lastingEffects: ["Quarrymen's guild retains unusual civic influence"], plotHooks: [] };
    const small = sizedResourceEvent(construction, village([]));
    expect(small.description).not.toMatch(/civic buildings|cathedral/i);
    expect(small.lastingEffects).toEqual(["The quarrymen's families retain unusual civic influence"]);
    expect(sizedResourceEvent(construction, village(['Craft guilds (5-15)', 'Parish church'], 'town'))).toEqual(construction);
    expect(sizedResourceEvent(construction, village(['Craft guilds (5-15)'], 'town')).description, 'a town with no house of worship: no cathedral').toBe("A period of ambitious stone construction transformed the settlement's character. Its civic buildings were raised from local quarry stone. The quarry workers became a political force.");
    const arcane = { description: 'A catastrophic or transformative event tied to the local ley line concentration occurred, permanently altering a district of the settlement and the lives of its inhabitants.', lastingEffects: ['Affected district retains residual magical effects', 'Arcane regulatory body established with unusual local authority'], plotHooks: [] };
    expect(sizedResourceEvent(arcane, village([], 'thorp')).lastingEffects).toEqual(['The affected ground retains residual magical effects']);
    const iron = { description: 'Rights to the local iron deposits became the subject of a prolonged dispute between the settlement and a rival lord. The outcome shaped who controls extraction to this day.', lastingEffects: ['Fortified extraction sites established during the dispute'], plotHooks: ['A rival family claims their ancestor was cheated out of the original mining contract'] };
    const noMine = sizedResourceEvent(iron, village([]));
    expect(noMine.description).toMatch(/who holds those rights to this day/);
    expect(noMine.lastingEffects).toEqual([]);
    expect(noMine.plotHooks).toEqual(['A rival family claims their ancestor was cheated out of the original rights to the deposits']);
    expect(sizedResourceEvent(iron, village(['Mine (shaft)']))).toEqual(iron);
  });

  it('the plague\'s healer and the wild magic\'s district declare what they presume', () => {
    const hooks = HISTORICAL_EVENTS_DATA.flatMap((e) => e.plotHooks || []).filter((h) => typeof h === 'object');
    expect(hooks).toContainEqual({ text: 'A healer who profited enormously during the plague is being asked how they stayed untouched', needs: ['healer'] });
    expect(hooks).toContainEqual({ text: 'The affected district is slowly spreading its strangeness, and the authorities are pretending otherwise', needs: ['tier: ≥ town'] });
  });

  // GUARDS: the readers' towns that printed them at the base
  for (const [seed, words] of /** @type {const} */ ([
    ['rww-village-religious_conversion-1', /Civic buildings or a cathedral|Quarrymen's guild/], // ww-90, a village of 89
    ['rw3-thorp-famine-1', /the merchant guilds negotiated/],
    ['rww-hamlet-succession_void-1', /controls extraction|original mining contract|Fortified extraction sites|affected district/],
    ['rpf-village-occupied-13', /A healer who profited/],
  ])) {
    it(`${seed}: no history line names what the town lacks`, () => {
      const s = born(seed);
      expect(historyText(s)).not.toMatch(words);
      expect(s.history.historicalEvents.length).toBeGreaterThan(0);
    }, 60_000);
  }
});

describe('W2-FIX-DATA-HISTORY item F: the arrival and the inland fish stall say only what the town holds', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('the four arrival lines declare, and the inland stall names no cart and no steady price', async () => {
    const { ARRIVAL_PEOPLE, ARRIVAL_SENSES } = await import('../../src/data/arrivalProse.js');
    const { INLAND_DESCRIPTIONS } = await import('../../src/data/inlandDescriptions.js');
    const decl = (/** @type {any} */ row) => ({ needs: row.needs || [], excludes: row.excludes || [] });
    const said = (/** @type {any[]} */ pool, /** @type {string} */ start) => pool.find((r) => typeof r === 'object' && String(r.text('X')).startsWith(start));
    expect(decl(said(ARRIVAL_PEOPLE.east_asian, 'Each lane seems'))).toEqual({ needs: ['tier: ≥ town'], excludes: [] });
    expect(decl(said(ARRIVAL_PEOPLE.east_asian, 'Tea is poured'))).toEqual({ needs: ['market'], excludes: [] });
    expect(decl(said(ARRIVAL_PEOPLE.arabic, 'A merchant swears'))).toEqual({ needs: ['market'], excludes: [] });
    const timber = ARRIVAL_SENSES.find((/** @type {any} */ s) => s.key === 'timber');
    expect(decl(said(timber.dominant, 'Stacks of seasoning planks'))).toEqual({ needs: [], excludes: ['crisis: under_siege'] });
    expect(INLAND_DESCRIPTIONS['village|Economy|Fish market']).not.toMatch(/brought in by cart|price holds/);
  });
  it('rww-hamlet-succession_void-1 (ww-541): a hamlet of 31 is told of no lanes of trades', () => {
    const s = born('rww-hamlet-succession_void-1');
    expect(String(s.arrivalScene)).not.toContain('Each lane seems to keep to its own trade');
    expect(String(s.arrivalScene)).toMatch(/\S/);
  }, 60_000);
});

describe('W2-FIX-DATA-HISTORY item G: the succession, the shortage, the purge and the pilgrimage say what the town holds', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('the declarations', () => {
    const rows = HISTORICAL_EVENTS_DATA.find((e) => e.type === 'succession_crisis')?.plotHooks?.filter((h) => typeof h === 'object') || [];
    for (const r of rows) expect(r.excludes).toEqual(['ruler: council', 'ruler: elder', 'crisis: succession_void']);
    expect(HISTORY_TEMPLATE_RECORD_DECLARATIONS.infiltration_fear).toEqual({ excludes: ['crisis: infiltrated'], timeline: false });
    expect(HISTORY_TEMPLATE_RECORD_DECLARATIONS.pilgrimage_surge).toEqual({ needs: ['institution: temple'], timeline: false });
    expect(JSON.stringify(HISTORICAL_EVENTS_DATA)).not.toContain('A warehouse full of the scarce goods');
  });
  for (const [seed, words] of /** @type {const} */ ([
    ['rpf-hamlet-occupied-13', /The ailing ruler wants a final errand/], // pf-160: a Household Council
    ['rww-village-under_siege-1', /A warehouse full of the scarce goods/], // ww-1230: no warehouse
    ['rww-metropolis-infiltrated-1', /Talk of enemy agents in the settlement|enemy agents within the settlement/], // ww-1261: nobody there knows
  ])) {
    it(`${seed}: no such line, and the town keeps a tension`, () => {
      const s = born(seed);
      // the current tensions (the infiltration's past Purge may stand on the timeline: a town may have hunted agents before)
      expect(JSON.stringify(s.history.currentTensions)).not.toMatch(words);
      expect(s.history.currentTensions.length).toBeGreaterThan(0);
    }, 60_000);
  }
});
