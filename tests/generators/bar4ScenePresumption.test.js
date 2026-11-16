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
const HOUSE_AT_WORK_LEFT = Object.freeze(['r2r-hamlet-10', 'r2r-village-34', 'r2r-village-45', 'r2r-village-49', 'r2r-town-3', 'r2r-town-6',
  'r2r-town-29', 'r2r-town-50', 'r2r-city-14', 'r2r-city-18', 'r2r-metropolis-58', 'r2s-indebted-village-1', 'r2s-insurgency-town-2']);

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

});
