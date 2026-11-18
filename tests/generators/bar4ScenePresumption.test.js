// THE GUARD OF KIND A1, THE SCENE'S PRESUMPTION (BAR4-SCENES, BRIEF-BAR4's amendment K4, 2026-11-16).
//
// THE DETECTOR (tests/helpers/scenePresumption.js :: scenePresumptionFindings) reads every arrival sense line and every
// general-desk line that SHOWS a thing against the town's present state: the trade's house not marked stopped or short,
// timber at hand for the whole place sawing, the herds not the famine's failed source, a market not stopped, a house that
// offers enchanting, no inn where newcomers are "sent to the monks". Over the census's 720 (CENSUS-3 seeds.txt's rule:
// 60 random towns of each size, and four of each size for each of the fifteen crises, born in seedcfg.mjs's shape) it
// must find NOTHING, and on a constructed record it MUST fire (the positive control: it cannot go blind).
//
// The printed lines read are the record's arrival scene and the general desk's lines (the owner's read, every section),
// the two writers of the kind. Measured at the base 8aef8e7d46 (the census's dump of the Overview): the counts are in
// docs/chair/2026-11-16/bar4/BAR4-SCENES-HANDBACK.md.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { scenePresumptionFindings, PRESUMES } from '../helpers/scenePresumption.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { composeArrivalScene } from '../../src/generators/narrative/arrivalScene.js';
import { ARRIVAL_SENSES } from '../../src/data/arrivalProse.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset',
  'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** The census's 720, by its own rule. */
const SEEDS = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...CRISES.flatMap((crisis) => SIZES.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-${crisis}-${size}-${i}`))),
];

/** CENSUS-3 seedcfg.mjs's r2r-/r2s- arms, verbatim in shape. @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  throw new Error(`a guard seed is a census seed: ${seed}`);
}

/** Every string a desk read returns, flattened. @param {unknown} v @param {string[]} out @returns {string[]} */
const stringsOf = (v, out = []) => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) for (const x of v) stringsOf(x, out);
  else if (v && typeof v === 'object') for (const x of Object.values(v)) stringsOf(x, out);
  return out;
};

/**
 * THE KIND'S REMAINDER, FROZEN SHRINK-ONLY (BAR4-SCENES hand-back, "what is left", item 1): the detector's `house at work`
 * presumption still finds these towns at the tip, a sense line whose every house the page marks short of its input
 * (the fish market "Short of fish.", the potter "Short of clay.", the quarry "Short of stone.", the alchemist "Short of its
 * materials."). Not yet cured: the cure needs an atom over the house's own mark (`crisisStoppedRow.js :: rowMarkText`,
 * a display leaf the facts cannot import). A town leaves this list when it is cured; none may join it.
 */
// BAR4-SCENES-2 (2026-11-16, the chair's ruling HW1): EMPTY. The 16 towns of the 720 the remainder read after the join (and 11 of the
// fresh 300) are cured: the scene's lines declare `trade at work: <trade>` (`facts/tradeAtWork.js`, on the one fact the page's mark
// reads, `houseInputAtHand.js :: housesShortOf`) and the siege or the famine where the page marks a house stopped or scarce.
const HOUSE_AT_WORK_LEFT = Object.freeze(/** @type {string[]} */ ([]));

/** @type {Map<string, { town: any, lines: string[] }>} */
const BORN = new Map();
/** @type {any} */ let born0 = null;

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { generalDeskLines } = await import('../../src/components/new/generalDeskRead.js');
  await boundary.loadGenerationLawPayloads();
  born0 = (/** @type {string} */ seed) => {
    const town = generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} });
    let desk = [];
    try { desk = stringsOf(generalDeskLines(town, { publicDossier: false, playerView: false, tier: town?.tier })); } catch { /* a desk that throws prints nothing */ }
    return { town, lines: [String(town.arrivalScene || ''), ...desk] };
  };
  for (const seed of SEEDS) BORN.set(seed, born0(seed));
}, 1800000);

describe('kind A1: no arrival or overview line shows what the town\'s present state denies', () => {
  it('the census\'s 720 are 720', () => {
    expect(SEEDS.length).toBe(720);
    expect(new Set(SEEDS).size).toBe(720);
  });

  it('the detector finds no instance in any of the 720 (a finding names the line, its presumption and the state)', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const b = BORN.get(seed);
      if (!b) throw new Error(`${seed}: not born`);
      const found = scenePresumptionFindings(b.town, b.lines)
        .filter((f) => !(f.presumes === 'house at work' && HOUSE_AT_WORK_LEFT.includes(seed)));
      if (found.length) throw new Error(found.map((f) => `${f.presumes}: "${f.line}" (${f.state})`).join(' | '));
    });
    expectNoSeedFailures(failures, 'kind A1 over the census 720');
  });

  it('the frozen remainder still fires where it is listed (a town cured leaves the list: shrink-only)', () => {
    const still = HOUSE_AT_WORK_LEFT.filter((seed) => {
      const b = BORN.get(seed);
      return !!b && scenePresumptionFindings(b.town, b.lines).some((f) => f.presumes === 'house at work');
    });
    expect(still).toEqual([...HOUSE_AT_WORK_LEFT]);
  });

  it('POSITIVE CONTROL: on a town stripped of its timber, herds, market and enchanters, every presumption fires', () => {
    const b = /** @type {{ town: any }} */ (BORN.get('r2s-famine-hamlet-3'));
    const name = b.town.name;
    const town = {
      ...b.town,
      config: { ...b.town.config, nearbyResources: [], nearbyResourcesNative: [], nearbyResourcesState: {} },
      economicState: { ...b.town.economicState, primaryImports: [], necessityImports: [],
        foodSecurity: { ...b.town.economicState.foodSecurity, foodRecord: { ...(b.town.economicState.foodSecurity?.foodRecord || {}), failedSource: 'livestock' } } },
      availableServices: { ...b.town.availableServices, magic: [], lodging: [{ name: 'Rooms', desc: 'A bed.', institution: 'Inn' }] },
      institutions: (b.town.institutions || []).filter((/** @type {any} */ i) => !/market|fair|bazaar/i.test(String(i?.name))),
    };
    const lines = [
      `The smell of sawn timber is everywhere in ${name}, and so is the sawdust.`,
      'Drovers push their herds along the road, and the whole place smells of the pens.',
      `Magic is a trade in ${name} like any other: signs offer enchanting and identification by the hour.`,
      `Buying and selling at ${name} is done face to face at the market with no guild between seller and buyer.`,
      `Anyone new to ${name} who needs a meal or a bed is sent to the monks.`,
    ];
    const fired = new Set(scenePresumptionFindings(town, lines).map((f) => f.presumes));
    expect([...fired].sort()).toEqual(['enchanting', 'herds live', 'market open', 'monks lodge', 'timber reaches the saws']);
    // and each presumption is a reader the table names (no presumption without a reader)
    for (const p of fired) expect(typeof PRESUMES[/** @type {keyof typeof PRESUMES} */ (p)]).toBe('function');
  });

  // BAR4-SCENES-2 (2026-11-16, the chair's ruling of 09:07: a twin whose STATE IS REACHABLE stays though neither population
  // draws it, and ONE constructed record proves it). The saws' twin prints in none of the 720 and none of the fresh 300; its
  // state (the timber sense's "rasp of the saws" slot drawn where no timber is at hand) is reached here: r2r-hamlet-12 draws
  // the rasp line on the arrival scene's own stream; stripped of its timber, the SAME slot prints the twin and every other
  // beat of the scene is unchanged (a twin keeps its slot and spends no redraw).
  it('REACHABLE: the saws\' twin prints in the slot where the rasp line is drawn and no timber is at hand', () => {
    const b = /** @type {{ town: any }} */ (BORN.get('r2r-hamlet-12'));
    const scene = (/** @type {any} */ s) => {
      setActiveRng(createPRNG('bar4-scenes-2-saws-0').fork('arrival-scene'));
      try { return String(composeArrivalScene(s)); } finally { clearActiveRng(); }
    };
    const timber = /** @type {any} */ (ARRIVAL_SENSES.find((/** @type {any} */ x) => x.key === 'timber'));
    const rasp = timber.dominant.find((/** @type {any} */ l) => l?.needs?.includes('timber reaches the saws') && !l.twinOf && /rasp/.test(String(l.text('{name}'))));
    const twin = timber.dominant.find((/** @type {any} */ l) => l?.twinOf === rasp.text('{name}'));
    const raspLine = String(rasp.text(b.town.name)); const twinLine = String(twin.text(b.town.name));
    // stripped of its timber by every road the one reader reads (`houseInputAtHand.js`): no timber ground, no timber made or bought,
    // and its woodcutter's camp ruined (off the live roster that produces; still a name the picker reads, so the slot is the same)
    const stripped = { ...b.town, config: { ...b.town.config, nearbyResources: [], nearbyResourcesNative: [], nearbyResourcesState: {} },
      economicState: { ...b.town.economicState, primaryImports: [], necessityImports: [], localProduction: [] },
      institutions: b.town.institutions.map((/** @type {any} */ i) => (/woodcutter/i.test(String(i?.name)) ? { ...i, _worldPulseInactive: true } : i)) };
    expect(factsOf(b.town).timberReachesSawmill).toBe(true);
    expect(factsOf(stripped).timberReachesSawmill).toBe(false);
    const before = scene(b.town); const after = scene(stripped);
    expect(before).toContain(raspLine);
    expect(after).toContain(twinLine);
    expectAbsentWithAnchor(after, raspLine, twinLine, 'the stripped town prints the twin in the rasp line\'s slot');
    expect(after).toBe(before.replace(raspLine, twinLine));
  });

  // BAR4-SCENES-2 (HW1): the `house at work` presumption cannot go blind: on r2r-village-34, whose one kiln house is the Potter the
  // page marks "Short of clay.", a kiln line fires it, and the gate's atom reads the same town as no kiln trade at work.
  it('POSITIVE CONTROL (house at work): a kiln line beside a potter the page marks short fires, and the atom agrees', () => {
    const b = /** @type {{ town: any }} */ (BORN.get('r2r-village-34'));
    const kilns = /** @type {any} */ (ARRIVAL_SENSES.find((/** @type {any} */ x) => x.key === 'kilns'));
    const line = String(kilns.lines.find((/** @type {any} */ l) => l?.needs?.includes('trade at work: kilns')).text(b.town.name));
    expect(scenePresumptionFindings(b.town, [line]).map((f) => f.presumes)).toEqual(['house at work']);
    expect(factsOf(b.town).tradeAtWork('kilns')).toBe(false);
  });

  // BAR4-SCENES-2 (2026-11-16, the chair's MU1: a twin whose state is reachable stays, proved by a constructed record). Each twin the
  // ruling HW1 added or widened is proved reachable at once: a census town whose sense slot draws the twin's original on a stream of
  // the scene's own, put in the state that refuses the original (every house of the trade short, or the siege, or the famine),
  // prints the twin in that slot.
  // SEAM-SCENES (2026-11-17, BRIEF-BAR6-SEAM item 1, the seam's MUST; the filter BAR6-SCENES put on this arm is gone): a good's twins
  // (the forge, the cloth, the butter, the wood, the spice, the leather) are proved here as the four trades' are: their trade is the good
  // the original declares (`trade at work: <good>`), and `refusing` and `atWork` read its houses from `tradeAtWork.js :: GOOD_TRADES`
  // as they read `TRADE_HOUSES`; a good a page's list names (the Exports, an import) is struck from that list where the gaps alone
  // leave it at work. A twin this arm convicts is a fault of the line, never of the arm.
  it('REACHABLE (MU1): every twin of the trades at work prints where its original is drawn and the town\'s state refuses it', async () => {
    const { TRADE_HOUSES, GOOD_TRADES } = await import('../../src/domain/facts/tradeAtWork.js');
    const own = (/** @type {object} */ o, /** @type {string} */ k) => Object.prototype.hasOwnProperty.call(o, k);
    /** a trade's house words: the four trades' (`TRADE_HOUSES`) or a good's (`GOOD_TRADES[].houses`) */
    const wordsOf = (/** @type {string} */ key) => /** @type {any} */ (own(TRADE_HOUSES, key) ? TRADE_HOUSES : {})[key] || /** @type {any} */ (GOOD_TRADES)[key]?.houses || [];
    /** @param {unknown} x @returns {string} a list item's own words */
    const itemText = (x) => (typeof x === 'string' ? x : String(/** @type {any} */ (x)?.name ?? /** @type {any} */ (x)?.good ?? /** @type {any} */ (x)?.source ?? ''));
    const { canonStressors } = await import('../../src/domain/canonicalAccessors.js');
    const { CHAIN_RAW_INPUT, houseInputAtHand } = await import('../../src/domain/facts/houseInputAtHand.js');
    const scene = (/** @type {any} */ town, /** @type {string} */ stream) => {
      setActiveRng(createPRNG(stream).fork('arrival-scene'));
      try { return String(composeArrivalScene(town)); } finally { clearActiveRng(); }
    };
    const atStart = (/** @type {string} */ w, /** @type {string} */ n) => new RegExp(`(^|[^a-z])${w}`).test(n);
    /** the record in the state that refuses the original: every house of the trade short (a gap no reading answers), or a crisis */
    const refusing = (/** @type {any} */ town, /** @type {string} */ key, /** @type {string} */ state) => {
      const withCrisis = (/** @type {string} */ type) => { const list = [...canonStressors(town), { type }]; return { ...town, stress: list, stressors: list }; };
      if (state === 'siege') return withCrisis('under_siege');
      if (state === 'hunger') return withCrisis('famine');
      const words = wordsOf(key);
      const houses = (town.institutions || []).filter((/** @type {any} */ i) => words.some((/** @type {string} */ w) => atStart(w, String(i?.name).toLowerCase())));
      /** each house gapped on an input this town's own reading calls missing (`houseInputAtHand`): the record's own short */
      const gapped = (/** @type {any} */ base) => {
        const gaps = houses.map((/** @type {any} */ h) => {
          const key2 = Object.keys(CHAIN_RAW_INPUT).find((k) => houseInputAtHand(base, k, h, { rawResource: CHAIN_RAW_INPUT[k] }) === 'missing');
          return key2 ? { chain: CHAIN_RAW_INPUT[key2], institution: h.name, kind: 'missing', impact: `${h.name} exists but lacks access to ${CHAIN_RAW_INPUT[key2]}`, severity: 'high' } : null;
        }).filter(Boolean);
        return { ...base, resourceAnalysis: { ...base.resourceAnalysis, gaps: [...(base.resourceAnalysis?.gaps || []), ...gaps] } };
      };
      const gappedTown = gapped(town);
      if (factsOf(gappedTown).tradeAtWork(key) === false) return gappedTown;
      const good = /** @type {any} */ (GOOD_TRADES)[key];
      // a market house's trade IS the route: where the gaps alone leave the trade at work, the road is cut too (isolated)
      if (!good) return gapped({ ...town, config: { ...town.config, tradeRouteAccess: 'isolated' } });
      // SEAM-SCENES (2026-11-17): a good no house makes is at work by the page's lists: struck from the imports, then from the Exports
      const unlisted = (/** @type {unknown} */ v) => (Array.isArray(v) ? v : []).filter((x) => !(good.listed && good.listed.test(itemText(x))));
      const noImports = { ...gappedTown, economicState: { ...gappedTown.economicState, primaryImports: unlisted(gappedTown.economicState?.primaryImports) } };
      if (factsOf(noImports).tradeAtWork(key) === false) return noImports;
      return { ...noImports, economicState: { ...noImports.economicState, primaryExports: unlisted(noImports.economicState?.primaryExports) } };
    };
    const twins = ARRIVAL_SENSES.flatMap((/** @type {any} */ sense) => ['lines', 'dominant'].flatMap((field) => sense[field].filter((/** @type {any} */ t) => t?.twinOf).map((/** @type {any} */ t) => {
      const original = sense[field].find((/** @type {any} */ o) => o && typeof o === 'object' && !o.twinOf && String(o.text('{name}')) === t.twinOf);
      const atoms = [...(original?.needs || []), ...(original?.excludes || [])];
      // the trade the slot's original declares: the four trades by their sense's key (as before); a good by its own key (SEAM-SCENES)
      const trade = own(TRADE_HOUSES, sense.key) ? sense.key
        : atoms.map((/** @type {string} */ a) => a.replace(/^trade at work: /, '')).find((/** @type {string} */ k) => own(GOOD_TRADES, k));
      const state = (t.needs || []).includes('crisis: under_siege') ? 'siege' : (t.needs || []).includes('crisis: hunger') && sense.key === 'bread' ? 'hunger'
        // BAR8-SCENES (2026-11-17, BR23 (1); re-keyed by identity): a twin that itself NEEDS the trade at work is the twin of another
        // state (the small working quarry: a thorp's or a hamlet's tier), never of the trade short; its reach is held by
        // `tests/generators/bar8Scenes.test.js`
        : atoms.some((/** @type {string} */ a) => a.startsWith('trade at work')) && !(t.excludes || []).includes('enchanting') && !(t.needs || []).some((/** @type {string} */ a) => a.startsWith('trade at work')) && trade ? 'short' : null;
      return state && (state !== 'siege' || sense.key === 'horses') ? { key: sense.key, trade: trade || sense.key, sense, field, pool: sense[field], original, twin: t, state } : null;
    }))).filter(Boolean);
    expect(twins.length, 'the twins of the trades at work').toBeGreaterThan(20);
    // SEAM-SCENES (2026-11-17): every good's twin is in the arm's proof: the seventeen the filter had put outside it, and the seam's own
    const GOODS_TWINS = twins.filter((/** @type {any} */ x) => x.state === 'short' && own(GOOD_TRADES, x.trade)).length;
    expect(GOODS_TWINS, 'the goods\' twins the arm proves').toBeGreaterThanOrEqual(17);
    const streams = Array.from({ length: 60 }, (_, i) => `bar4-scenes-2-mu1-${i}`);
    /** the town with its trade at work again: its trade houses' gaps and its spent grounds struck (the slot then draws the original) */
    const atWork = (/** @type {any} */ town, /** @type {string} */ key) => {
      const words = wordsOf(key);
      const of = (/** @type {any} */ g) => words.some((/** @type {string} */ w) => atStart(w, String(g?.institution).toLowerCase()));
      return { ...town, config: { ...town.config, nearbyResourcesDepleted: [] }, resourceAnalysis: { ...town.resourceAnalysis, gaps: (town.resourceAnalysis?.gaps || []).filter((/** @type {any} */ g) => !of(g)) } };
    };
    const speaks = (/** @type {any[]} */ pool, /** @type {any} */ town, /** @type {string} */ scene0) => pool.some((l) => l && scene0.includes(String((typeof l === 'function' ? l : l.text)(town.name))));
    /** a town whose trade words are struck from its exports and income: its sense then speaks from the `lines` pool (`chooseSense`) */
    const ordinary = (/** @type {any} */ town, /** @type {any} */ sense) => {
      const traded = (/** @type {unknown} */ w) => sense.trade.some((/** @type {string} */ t) => atStart(t, String(typeof w === 'string' ? w : /** @type {any} */ (w)?.source).toLowerCase()));
      const e = town.economicState || {};
      return { ...town, economicState: { ...e, primaryExports: (e.primaryExports || []).filter((/** @type {unknown} */ w) => !traded(w)), incomeSources: (e.incomeSources || []).filter((/** @type {unknown} */ w) => !traded(w)) } };
    };
    const unproved = twins.filter((/** @type {any} */ x) => ![...BORN.values()].some(({ town: born, lines }) => {
      // a town whose scene speaks from this pool (its sense and its field the ones the slot draws from), or, for a `lines` pool no
      // census town reaches, a town of the same sense that speaks from its `dominant` pool, its trade words struck
      let town = born;
      if (!speaks(x.pool, born, String(lines[0]))) {
        if (x.field !== 'lines' || !speaks(x.sense.dominant, born, String(lines[0]))) return false;
        town = ordinary(born, x.sense);
      }
      const base = x.state === 'short' ? atWork(town, x.trade) : town;
      const rec = refusing(base, x.trade, x.state);
      if (x.state === 'short' && factsOf(rec).tradeAtWork(x.trade) !== false) return false;
      return streams.some((st) => scene(base, st).includes(String(x.original.text(town.name))) && scene(rec, st).includes(String(x.twin.text(town.name))));
    })).map((/** @type {any} */ x) => `${x.key} (${x.state}): ${x.twin.text('{name}')}`);
    expect(unproved).toEqual([]);
  }, 900000);

  it('THE COPIES ARE THE TABLES\' OWN: the chains\' raw inputs, the timber chains and the trades\' house words, word for word', async () => {
    const { RESOURCE_CHAINS } = await import('../../src/data/resourceChains.js');
    const { CHAIN_RAW_INPUT } = await import('../../src/domain/facts/houseInputAtHand.js');
    const { TIMBER_CHAINS } = await import('../../src/domain/facts/timberAtHand.js');
    const { TRADE_HOUSES } = await import('../../src/domain/facts/tradeAtWork.js');
    const { FACT_DIMENSIONS } = await import('../../src/domain/facts/factVocabulary.js');
    expect(CHAIN_RAW_INPUT).toEqual(Object.fromEntries(Object.entries(RESOURCE_CHAINS).map(([k, c]) => [k, /** @type {any} */ (c).rawResource])));
    for (const [key, chain] of TIMBER_CHAINS) expect(/** @type {any} */ (chain).rawResource).toBe(/** @type {any} */ (RESOURCE_CHAINS)[/** @type {string} */ (key)].rawResource);
    for (const [key, words] of Object.entries(TRADE_HOUSES)) expect(words).toEqual(/** @type {any} */ (ARRIVAL_SENSES.find((/** @type {any} */ x) => x.key === key)).institutions);
    // BAR5-THINGS (2026-11-16, LAW 4 "the kilns"): the kiln trade's two kinds join the keys (`tradeAtWork.js :: KILN_KINDS`)
    const { KILN_KINDS } = await import('../../src/domain/facts/tradeAtWork.js');
    // BAR6-SCENES (2026-11-16, LAW 6 rule 6b; re-keyed by identity): the goods a scene shows join the keys (`tradeAtWork.js :: GOOD_TRADES`)
    const { GOOD_TRADES } = await import('../../src/domain/facts/tradeAtWork.js');
    // BAR8-SCENES (2026-11-17, BR17; re-keyed by identity): the two keys of the mark's worst state join them (`tradeAtWork.js ::
    // IN_FULL` on the ironwork, `FISH_TAKEN_HERE`)
    const { IN_FULL, FISH_TAKEN_HERE } = await import('../../src/domain/facts/tradeAtWork.js');
    // BAR8-DESKS-2 (2026-11-18, the chair's ruling BR34; re-keyed by identity): `building`, the building houses by catalogue id
    // (`tradeAtWork.js :: BUILDING_HOUSE_IDS`), joins the keys; it has no house words (no arrival sense opens it)
    expect([.../** @type {any} */ (FACT_DIMENSIONS)['trade at work'].keys].sort()).toEqual([...Object.keys(TRADE_HOUSES), ...Object.keys(KILN_KINDS), ...Object.keys(GOOD_TRADES), `ironwork${IN_FULL}`, FISH_TAKEN_HERE, 'building'].sort());
  });

});
