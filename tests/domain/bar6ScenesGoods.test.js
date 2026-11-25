// THE GUARD OF BAR6-SCENES (BRIEF-BAR6 seat BAR6-SCENES; B2's L4, 2026-11-16): A SCENE SHOWS NO GOOD, NO EASE AND NO TRAFFIC THE
// TOWN CANNOT GIVE; the pressure sentence calls no town in a legitimacy crisis loyal and names no power by its roster label.
//
// THE DETECTOR (`scenesFindings`, below) reads a born town's own arrival scene and pressure sentence against the record, by the
// AUDITOR'S OWN RULES, never by the facts the cure made (so that a fact gone wrong cannot certify itself):
//   6b       a good shown (`tests/helpers/pageLaws/law6.mjs :: GOODS`: its words, its makers, its trade words) where no house of
//            the roster makes it and neither Produced locally nor the Exports name it (herbs and spice also where brought in,
//            past no siege: the auditor's own exception); a good sent "on the road out" that the Exports do not carry; the
//            chisels on stone beside a stone ground the resources call unworked (the page's "No one here works the stone");
//   9e       "Nobody in X sells enchanting … done quietly" beside a working chain whose outputs name enchanting;
//   9f       "The settlement is loyal." beside a public legitimacy in its crisis band;
//   7d       a work party heading out under a siege; laden porters counted in where no route reaches;
//   10h      a roster label with a prose form (`PROSE_FORMS`) printed inside the pressure sentence.
// Over the census's 720 (CENSUS-3 seeds.txt's rule) it must find NOTHING, and on records made from the read's own rows
// (REVIEW-WIDE-6 C219863, C39804, C84094, C15780, C32780, C76517, C94460, C150831; F's 10h row) it MUST fire.
//
// The counts before and after over the 150, the 720 and the fresh 300 (the auditors' runners) are in
// docs/chair/2026-11-16/bar6/BAR6-SCENES-HANDBACK.md.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { GOODS } from '../helpers/pageLaws/law6.mjs';
import { PROSE_FORMS } from '../../src/data/people/powerSentenceName.js';
import { ARRIVAL_SENSES } from '../../src/data/arrivalProse.js';
import { FACT_DIMENSIONS, declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { GOOD_TRADES, tradeAtWorkOf } from '../../src/domain/facts/tradeAtWork.js';
import { EXPORTED_GOODS, goodExportedOf } from '../../src/domain/facts/goodExported.js';
import { legitimacyCrisisOf } from '../../src/domain/facts/legitimacyCrisis.js';
import { nativeSemanticNames } from '../../src/domain/content/customContentSemanticAuthority.js'; // SEAM-SCENES (2026-11-17): the picker's own names
import { resolveGenerationWorldLaw } from '../../src/generators/generationContext.js'; // SEAM-SCENES (2026-11-17): the picker's own magic

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

// ── THE DETECTOR: the auditor's rules over the record, never the facts the cure made ──
const OUT_SCENE = /\b(road out|carted out|for market abroad)\b/i; // law6.mjs's own
const NEGATED = /\b(no|not|nobody|none|empty|nearly bare|once|gone|thin|half empty|given up|short|little)\b/i; // law6.mjs's own
const CHISELS = /\bchisels? on stone\b/i;
const QUIETLY = /\bNobody in .+ sells enchanting by the hour, and what magic is done here is done quietly\b/;
const LOYAL = /\bThe settlement is loyal\b/;
const HEADS_OUT = /\bheads out together, singing\b/i;
const PORTERS = /\bPorters bent under loaded frames file past\b/;

/** @param {unknown} v @returns {string[]} */
const list = (v) => (Array.isArray(v) ? v : []).map((x) => (typeof x === 'string' ? x : String(/** @type {any} */ (x)?.name ?? /** @type {any} */ (x)?.source ?? '')));
/** @param {any} town */
const stressTypes = (town) => (Array.isArray(town?.stress) ? town.stress : [town?.stress]).map((s) => s?.type).filter(Boolean);

/**
 * Every instance of the seat's rules in one town. @param {any} town
 * @returns {Array<{ rule: string, line: string, why: string }>}
 */
export function scenesFindings(town) {
  /** @type {Array<{ rule: string, line: string, why: string }>} */ const out = [];
  const houses = list(town?.institutions).filter((n) => !/^access to\b/i.test(n));
  const eco = town?.economicState || {};
  const exports = list(eco.primaryExports); const produced = list(eco.localProduction); const imports = list(eco.primaryImports ?? eco.imports);
  const siege = stressTypes(town).includes('under_siege');
  const route = String(town?.config?.tradeRouteAccess || '');
  const sentences = String(town?.arrivalScene || '').split(/(?<=\.)\s+/).filter(Boolean);
  for (const s of sentences) {
    const goodsRead = !(/ · /.test(s) || NEGATED.test(s)); // law6.mjs reads no negated sentence for a good
    for (const [key, g] of goodsRead ? Object.entries(GOODS) : []) {
      const m = g.word.exec(s); if (!m) continue;
      const made = [...produced, ...exports].some((e) => g.trade.test(e)) || houses.some((h) => g.maker.test(h));
      if (OUT_SCENE.test(s) && !exports.some((e) => g.trade.test(e))) {
        const shown = Object.values(GOODS).filter((h) => h.word.test(s));
        if (!shown.some((h) => exports.some((e) => h.trade.test(e)))) out.push({ rule: '6b-out', line: s, why: `sends ${m[0]} out; the exports carry none` });
      } else if (!made && !((key === 'herbs' || key === 'spice') && imports.some((e) => g.trade.test(e)) && !siege)) {
        out.push({ rule: '6b-nomaker', line: s, why: `shows ${m[0]}; no house makes it and no list names it` });
      } else continue;
      break;
    }
    const stoneIdle = (town?.resourceAnalysis?.gaps || []).some((/** @type {any} */ g) => !g?.institution && /stone/i.test(String(g?.chain)) && /not being processed/.test(String(g?.impact)))
      && !exports.some((e) => /\bstone\b/i.test(e)) && !houses.some((h) => /quarry|mason|stonecutter/i.test(h));
    if (CHISELS.test(s) && stoneIdle) out.push({ rule: '6b-denied', line: s, why: 'chisels on stone; the stone is unworked' });
    if (QUIETLY.test(s) && (eco.activeChains || []).some((/** @type {any} */ c) => /^(running|operational|entrepot|vulnerable|magically_sustained)$/.test(String(c?.status)) && list(c?.outputs).some((o) => /enchant/i.test(o)))) {
      out.push({ rule: '9e.quietly', line: s, why: 'an enchanting chain is at work' });
    }
    if (HEADS_OUT.test(s) && siege) out.push({ rule: '7d', line: s, why: 'heads out under a siege' });
    if (PORTERS.test(s) && route === 'isolated') out.push({ rule: '7d', line: s, why: 'laden porters where no route reaches' });
  }
  const pressure = String(town?.pressureSentence || '');
  if (LOYAL.test(pressure) && town?.powerStructure?.publicLegitimacy?.isLegitimacyCrisis === true) out.push({ rule: '9f', line: pressure, why: 'a legitimacy crisis' });
  for (const label of Object.keys(PROSE_FORMS)) if (pressure.includes(label)) out.push({ rule: '10h', line: pressure, why: `the roster label "${label}" as a name` });
  return out;
}

/** @type {Map<string, any>} */
const BORN = new Map();

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of SEEDS) BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
}, 1800000);

describe('BAR6-SCENES: no scene shows a good, an ease or a traffic the town cannot give; the pressure sentence reads the town', () => {
  it('the census\'s 720 are 720', () => {
    expect(SEEDS.length).toBe(720);
    expect(new Set(SEEDS).size).toBe(720);
  });

  it('the detector finds no instance in any of the 720 (a finding names the rule, the line and the state)', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const town = BORN.get(seed);
      if (!town) throw new Error(`${seed}: not born`);
      const found = scenesFindings(town);
      if (found.length) throw new Error(found.map((f) => `${f.rule}: "${f.line.slice(0, 160)}" (${f.why})`).join(' | '));
    });
    expectNoSeedFailures(failures, 'BAR6-SCENES over the census 720');
  });

  it('POSITIVE CONTROL: the read\'s own rows, on records made to hold each state, every rule fires', () => {
    const base = BORN.get('r2s-under_siege-thorp-0');
    const town = {
      ...base,
      config: { ...base.config, tradeRouteAccess: 'isolated' },
      stress: [{ type: 'under_siege' }, { type: 'wartime' }],
      institutions: [{ name: 'Common grazing land' }, { name: 'Mine (open cast)' }, { name: 'Hedge wizard' }],
      economicState: { ...base.economicState, primaryExports: ['Sacred wood'], localProduction: ['honey'], primaryImports: ['Spices'],
        activeChains: [{ status: 'operational', outputs: ['Enchanting services'] }] },
      resourceAnalysis: { ...base.resourceAnalysis, gaps: [{ chain: 'stone', impact: 'Raw resource available but not being processed' }] },
      arrivalScene: [
        'Someone is churning butter in a doorway, and the rhythm of it carries.', // C219863
        'Bolts of cloth and bales of wool fill the carts waiting on the road out.', // C39804
        'The chink of chisels on stone carries on the wind.', // C84094
        'Spice and drying herbs scent every lane, and the stalls are piled with them.', // C15780
        'Nobody in Kallipolis sells enchanting by the hour, and what magic is done here is done quietly.', // C32780
        'A work party heads out together, singing, with tools on their shoulders.', // C94460
        'Porters bent under loaded frames file past, and someone counts them in.', // C150831
      ].join(' '),
      pressureSentence: 'The last thing Military/Guard and its rivals agreed on in Xochiatl was that the disagreement should not be allowed to reach the streets. The settlement is loyal.', // F 10h; C76517
      powerStructure: { ...base.powerStructure, publicLegitimacy: { isLegitimacyCrisis: true, label: 'Legitimacy Crisis' } },
    };
    const rules = new Set(scenesFindings(town).map((f) => f.rule));
    expect([...rules].sort()).toEqual(['10h', '6b-denied', '6b-nomaker', '6b-out', '7d', '9e.quietly', '9f']);
  });
});

describe('the facts the cure made', () => {
  it('the goods join the trades\' keys, and the exported goods and the legitimacy their own atoms', () => {
    for (const key of Object.keys(GOOD_TRADES)) expect(FACT_DIMENSIONS['trade at work'].keys).toContain(key);
    expect([...FACT_DIMENSIONS.exported.keys].sort()).toEqual(Object.keys(EXPORTED_GOODS).sort());
    expect(FACT_DIMENSIONS['legitimacy crisis'].home).toBe('legitimacyCrisis');
  });

  it('each good reads the page\'s own lists: a maker not short, a list that names it, an import past no siege; never a grazing name', () => {
    expect(tradeAtWorkOf({ institutions: [{ name: 'Common grazing land' }] }, 'dairy')).toBe(false);
    expect(tradeAtWorkOf({ institutions: [{ name: 'Dairy farmer' }] }, 'dairy')).toBe(true);
    expect(tradeAtWorkOf({ institutions: [], economicState: { primaryExports: ['Cheese'] } }, 'dairy')).toBe(true);
    expect(tradeAtWorkOf({ institutions: [], economicState: { localProduction: ['dairy'] } }, 'dairy')).toBe(false); // the raw list is not the page's
    expect(tradeAtWorkOf({ institutions: [{ name: 'Tailor' }] }, 'cloth')).toBe(false);
    // SEAM-SCENES (2026-11-17, BRIEF-BAR6-SEAM item 4): BAR6-MARKS's wider reading of "short" (a house wanting its input by trade,
    // `houseInputAtHand.js :: housesWantingTradeInput`) marks a weaver with no wool "Short of wool."; the record gives it its wool
    // (an import, in a quiet town), so the claim (a maker not short) is the one this case always made
    expect(tradeAtWorkOf({ institutions: [{ name: 'Weavers/Textile workers' }], economicState: { primaryImports: ['Wool'] } }, 'cloth')).toBe(true);
    expect(tradeAtWorkOf({ institutions: [{ name: 'Weavers/Textile workers' }] }, 'cloth')).toBe(false); // and no wool at all: short, as the page marks it
    expect(tradeAtWorkOf({ institutions: [{ name: 'Mine (open cast)' }] }, 'cut stone')).toBe(false);
    expect(tradeAtWorkOf({ institutions: [{ name: 'Stone quarry' }] }, 'cut stone')).toBe(true);
    expect(tradeAtWorkOf({ institutions: [], economicState: { primaryImports: ['Spices'] } }, 'spice')).toBe(true);
    expect(tradeAtWorkOf({ institutions: [], economicState: { primaryImports: ['Spices'] }, stress: [{ type: 'under_siege' }] }, 'spice')).toBe(false);
    expect(goodExportedOf({ economicState: { primaryExports: ['Raw wool'] } }, 'cloth')).toBe(true);
    expect(goodExportedOf({ economicState: { primaryExports: ['Sacred wood'] } }, 'cloth')).toBe(false);
    expect(legitimacyCrisisOf({ powerStructure: { publicLegitimacy: { isLegitimacyCrisis: true } } })).toBe(true);
    expect(legitimacyCrisisOf({ powerStructure: { publicLegitimacy: { isLegitimacyCrisis: false } } })).toBe(false);
    expect(legitimacyCrisisOf({})).toBeUndefined();
  });

  it('every new twin is admitted where its original is refused for its good (a twin keeps the slot: no pool falls mute)', () => {
    const town = BORN.get('r2r-village-0');
    const bare = { ...town, institutions: [{ name: 'Common grazing land' }, { name: 'Tailor' }], economicState: { ...town.economicState, primaryExports: [], localProduction: [], primaryImports: [], activeChains: [] } };
    const facts = factsOf(bare);
    const goods = /^(trade at work: (dairy|cloth|dyed cloth|ironwork|spice|woodwork|leather)|exported: )/; // SEAM-SCENES (2026-11-17): the leather and the dyer's kind join
    // the kilns' twin of the crates is BAR5-THINGS's: unanswered (and so refused with its original) where no kiln house stands, by design
    const pairs = ARRIVAL_SENSES.filter((/** @type {any} */ sense) => sense.key !== 'kilns').flatMap((/** @type {any} */ sense) => ['lines', 'dominant'].flatMap((field) => sense[field]
      .filter((/** @type {any} */ t) => t && typeof t === 'object' && t.twinOf)
      .map((/** @type {any} */ t) => ({ twin: t, original: sense[field].find((/** @type {any} */ o) => o && typeof o === 'object' && !o.twinOf && String(o.text('{name}')) === t.twinOf) }))
      .filter((/** @type {any} */ x) => x.original && (x.original.needs || []).some((/** @type {string} */ a) => goods.test(a)))));
    expect(pairs.length).toBeGreaterThan(10);
    const unadmitted = pairs.filter((/** @type {any} */ x) => {
      const refused = !declarationAdmits(declarationOf(x.original), /** @type {any} */ (facts)).admitted;
      const twinOk = declarationAdmits(declarationOf(x.twin), /** @type {any} */ (facts)).admitted;
      const twinNeedsMore = (x.twin.needs || []).length > 0; // a twin that keeps a need of its own (a market, a smith, cloth made) redraws where it fails
      return refused && !twinOk && !twinNeedsMore;
    }).map((/** @type {any} */ x) => x.twin.twinOf);
    expect(unadmitted).toEqual([]);
  });

  // SEAM-SCENES (2026-11-17, BRIEF-BAR6-SEAM items 2 and 9): the leather is the tanners' own, and the cloth is split by what its
  // houses do to it: a dyer answers only the dyeing (bar0-city-wartime-rand-33's bolts "drying" beside weavers and a fuller "Short of
  // wool." and a dyer at work), the cloth made wants a weaver, a textile house or a fuller not short.
  it('SEAM: a dyer answers the dyeing and not the cloth made; the tanners\' leather reads their short mark; the kinds are the houses\' own', async () => {
    const { CLOTH_KINDS } = await import('../../src/domain/facts/tradeAtWork.js');
    const dyerAlone = { institutions: [{ name: 'Weavers/Textile workers' }, { name: 'Fuller' }, { name: 'Dyer' }] }; // no wool: both makers short
    expect(tradeAtWorkOf(dyerAlone, 'cloth')).toBe(false);
    expect(tradeAtWorkOf(dyerAlone, 'dyed cloth')).toBe(true);
    expect(tradeAtWorkOf({ institutions: [{ name: 'Weavers/Textile workers' }], economicState: { primaryImports: ['Wool'] } }, 'dyed cloth')).toBe(false);
    expect(tradeAtWorkOf({ institutions: [{ name: 'Tanners' }] }, 'leather')).toBe(false); // "Short of hides."
    expect(tradeAtWorkOf({ institutions: [{ name: 'Tanners' }], economicState: { primaryImports: ['Hides'] } }, 'leather')).toBe(true);
    expect(tradeAtWorkOf({ institutions: [{ name: 'Saddler' }] }, 'leather')).toBe(false); // a saddler sews leather; it tans none
    expect(tradeAtWorkOf({ institutions: [{ name: 'Saddler' }], economicState: { primaryExports: ['Tanned leather'] } }, 'leather')).toBe(true);
    // a smelter makes the iron and works none: it answers no forge line (r2r-metropolis-20's "The hammering of the forges" beside
    // Blacksmiths and Specialized metalworkers "Short of iron." and a Smelter alone not short)
    expect(tradeAtWorkOf({ institutions: [{ name: 'Smelter' }], economicState: { primaryImports: ['Iron ore'] } }, 'ironwork')).toBe(false);
    expect(tradeAtWorkOf({ institutions: [{ name: 'Smelter' }, { name: 'Blacksmith' }], economicState: { primaryImports: ['Iron'] } }, 'ironwork')).toBe(true);
    expectAbsentWithAnchor(GOOD_TRADES.ironwork.houses, 'smelter', 'blacksmith', 'the forge trade is the smith\'s, not the smelter\'s');
    const cloth = /** @type {any} */ (ARRIVAL_SENSES.find((/** @type {any} */ x) => x.key === 'cloth')).institutions;
    expect([...CLOTH_KINDS.cloth, ...CLOTH_KINDS['dyed cloth']].sort()).toEqual(cloth.filter((/** @type {string} */ w) => !['tailor', 'clothier', 'draper'].includes(w)).sort());
    const tanners = /** @type {any} */ (ARRIVAL_SENSES.find((/** @type {any} */ x) => x.key === 'tanners')).institutions;
    for (const w of GOOD_TRADES.leather.houses) expect(tanners).toContain(w);
    // every cloth line that shows dyeing declares the dyer's kind, and every line that shows cloth made the makers'
    const lines = ['lines', 'dominant'].flatMap((f) => /** @type {any} */ (ARRIVAL_SENSES.find((/** @type {any} */ x) => x.key === 'cloth'))[f])
      .filter((/** @type {any} */ l) => l && typeof l === 'object' && !l.twinOf);
    for (const l of lines) {
      const t = String(l.text('{name}'));
      if (/\bdye/i.test(t)) expect(l.needs, t).toContain('trade at work: dyed cloth');
      else if (/\b(loom|fulling|hang drying)\b/i.test(t)) expect(l.needs, t).toContain('trade at work: cloth');
    }
  });

  // SEAM-SCENES (2026-11-17, BRIEF-BAR6-SEAM item 6: B7 HELD BY A TEST). A twin never leaves a pool under three lines: over a fixed
  // sample of sixty of the 720 (five of each size, two of each crisis), every arrival sense pool a town can reach admits three
  // lines (an original, or its twin where the original is refused), or no fewer than it admitted at afa46d644 where that was
  // already under three (FLOOR_AT_AFA: measured over the same seeds born at afa46d644, the base of the round BAR6; the fish
  // lines want a fish food source by CENSUS-2f's design, the kilns' dominant pool BAR5-THINGS's unanswered kinds).
  const FLOOR_SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const FLOOR_SAMPLE = [...FLOOR_SIZES.flatMap((z) => [0, 1, 2, 3, 4].map((i) => `r2r-${z}-${i}`)),
    ...CRISES.flatMap((c, i) => [`r2s-${c}-${FLOOR_SIZES[i % 6]}-0`, `r2s-${c}-${FLOOR_SIZES[(i + 3) % 6]}-1`])];
  const FLOOR_AT_AFA = Object.freeze(/** @type {Record<string, number>} */ ({
  'r2r-thorp-0 fish.lines': 2,
  'r2r-thorp-3 fish.lines': 2,
  'r2r-hamlet-0 livestock.lines': 2,
  'r2r-hamlet-2 smiths.dominant': 0,
  'r2r-hamlet-2 arms.dominant': 1,
  'r2r-village-0 fish.lines': 0,
  'r2r-village-1 fish.lines': 0,
  'r2r-village-4 smiths.dominant': 0,
  'r2r-town-0 fish.lines': 0,
  'r2r-city-0 fish.lines': 0,
  'r2r-city-1 fish.lines': 0,
  'r2r-city-1 kilns.dominant': 1,
  'r2r-city-3 fish.lines': 0,
  'r2r-city-4 kilns.dominant': 1,
  'r2r-metropolis-0 kilns.dominant': 1,
  'r2r-metropolis-1 fish.lines': 0,
  'r2r-metropolis-2 fish.lines': 0,
  'r2r-metropolis-3 fish.lines': 0,
  'r2r-metropolis-4 fish.lines': 0,
  'r2r-metropolis-4 faith.dominant': 2,
  'r2s-famine-thorp-0 fish.lines': 2,
  'r2s-famine-town-1 bread.dominant': 0,
  'r2s-famine-town-1 fish.lines': 0,
  'r2s-indebted-hamlet-0 smiths.dominant': 0,
  'r2s-indebted-hamlet-0 kilns.dominant': 1,
  'r2s-infiltrated-metropolis-1 fish.lines': 0,
  'r2s-insurgency-town-0 faith.dominant': 2,
  'r2s-mass_migration-city-0 kilns.dominant': 1,
  'r2s-monster_pressure-metropolis-0 fish.lines': 0,
  'r2s-monster_pressure-metropolis-0 faith.dominant': 1,
  'r2s-monster_pressure-metropolis-0 market.lines': 2,
  'r2s-monster_pressure-village-1 smiths.dominant': 0,
  'r2s-occupied-town-1 faith.dominant': 1,
  'r2s-occupied-town-1 market.lines': 2,
  'r2s-politically_fractured-metropolis-1 fish.lines': 0,
  'r2s-recently_betrayed-town-0 fish.lines': 0,
  'r2s-religious_conversion-city-0 fish.lines': 0,
  'r2s-slave_revolt-metropolis-0 fish.lines': 0,
  'r2s-slave_revolt-metropolis-0 faith.dominant': 2,
  'r2s-under_siege-hamlet-0 livestock.lines': 2,
  'r2s-under_siege-city-1 market.lines': 2,
  'r2s-wartime-village-0 smiths.dominant': 0,
  'r2s-wartime-metropolis-1 faith.dominant': 2,
  }));
  /** the lines each reachable sense pool admits (the picker's own reach, `arrivalScene.js :: chooseSense`) @param {any} town */
  const admittedByPool = (town) => {
    const lower = (/** @type {unknown} */ v) => String(v ?? '').toLowerCase();
    const atStart = (/** @type {string[]} */ fr, /** @type {string[]} */ names) => fr.some((f) => { const re = new RegExp(`(^|[^a-z])${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`); return names.some((n) => re.test(n)); });
    const names = nativeSemanticNames(town.institutions || []).map(lower).filter((/** @type {string} */ n) => !['access to ', 'traveling ', 'travelling '].some((p) => n.startsWith(p)));
    const e = town.economicState || {};
    const words = [...(e.primaryExports || []), ...(e.incomeSources || []).map((/** @type {any} */ x) => (typeof x === 'string' ? x : x?.source))].map(lower);
    const facts = /** @type {any} */ (factsOf(town));
    /** @type {Record<string, number>} */ const out = {};
    for (const sense of /** @type {any[]} */ (ARRIVAL_SENSES)) {
      if (sense.arcane && resolveGenerationWorldLaw(null, town?.config || {})?.magicEnabled !== true) continue;
      if (!atStart(sense.institutions, names)) continue;
      const dominant = sense.trade.length > 0 && sense.dominant.length > 0 && atStart(sense.trade, words);
      if (!dominant && sense.lines.length === 0) continue;
      const pool = sense[dominant ? 'dominant' : 'lines'];
      const ok = (/** @type {any} */ l) => declarationAdmits(declarationOf(l), facts).admitted;
      // BAR8-SCENES (2026-11-17, the chair's grant under BR23; re-keyed by identity): a line may have two twins, and the draw answers by
      // the first ADMITTED one (`arrivalScene.js :: drawAdmitted`), so a line holds its slot where ANY of its twins is admitted
      // RE-KEYED BY IDENTITY 2026-11-18 (BAR8-SCENES-3, BR25 (3)): the draw now answers by the LAST admitted twin, else the first
      // (the narrower state); which twin answers does not move the count: the slot is held where ANY twin is admitted, as before
      const twins = (/** @type {any} */ l) => (typeof l === 'object' ? pool.filter((/** @type {any} */ t) => t && t.twinOf === String(l.text('{name}'))) : []);
      out[`${sense.key}.${dominant ? 'dominant' : 'lines'}`] = pool.filter((/** @type {any} */ l) => !(l && typeof l === 'object' && l.twinOf))
        .filter((/** @type {any} */ l) => ok(l) || twins(l).some(ok)).length;
    }
    return out;
  };

  it('B7: no arrival pool a town of the sample can reach admits fewer than three lines, or fewer than at afa46d644 (SEAM-SCENES item 6)', () => {
    expect(FLOOR_SAMPLE.length).toBe(60);
    for (const z of FLOOR_SIZES) expect(FLOOR_SAMPLE.some((s) => s.includes(`-${z}-`))).toBe(true);
    for (const c of CRISES) expect(FLOOR_SAMPLE.some((s) => s.startsWith(`r2s-${c}-`))).toBe(true);
    const reached = new Set();
    const failures = collectSeedFailures(FLOOR_SAMPLE, (seed) => {
      const town = BORN.get(seed);
      if (!town) throw new Error(`${seed}: not born`);
      const thin = Object.entries(admittedByPool(town)).filter(([pool, n]) => {
        reached.add(pool);
        const was = FLOOR_AT_AFA[`${seed} ${pool}`];
        return n < 3 && (was === undefined || n < was);
      });
      if (thin.length) throw new Error(thin.map(([pool, n]) => `${pool} admits ${n} (afa46d644: ${FLOOR_AT_AFA[`${seed} ${pool}`] ?? '3 or more'})`).join(' | '));
    });
    expectNoSeedFailures(failures, 'B7 over the sample of sixty');
    for (const pool of ['smiths.lines', 'smiths.dominant', 'tanners.dominant', 'cloth.lines', 'cloth.dominant']) expect(reached.has(pool), pool).toBe(true);
  });

  // BAR7-SCENES (BRIEF-BAR7 item 5f, 2026-11-17): the three pools SEAM-SCENES left outside its sample. The kilns' dominant pool of
  // r2s-religious_conversion-metropolis-0 admitted ONE at the joined line (17f760584): the generic kilns key answered by a glass
  // furnace beside short clay kilns refused every twin; it holds three. The arms' dominant pool of r2r-village-18 and
  // r2s-insurgency-village-2 admitted ONE: the racks' new twin makes it two, the most a twin can give a village there (the
  // tier bands of W2-FIX-DATA-4 keep the blades and the war's carts to a town; a third line would be drawn and move the draw)
  // RE-ANCHORED (CLOSE-7 ANCHORS, by cause): after the BATCH merge (e9b726cdf) r2s-religious_conversion-metropolis-0 reaches its kilns
  // only as `lines` (its houses unchanged, its trade words moved), and so do -1 to -3, so the dominant pool is not reached in this
  // crisis's metropolises of the 720. Re-picked by this file's own census (SEEDS): the first r2s metropolis whose kilns' dominant
  // pool is reached, r2s-famine-metropolis-0 (a judgement: the same arm and size, another crisis). The assertion is word for word.
  it('B7 (BAR7-SCENES): the kilns hold three in r2s-famine-metropolis-0; the arms\' villages keep two, not one', () => {
    expect(admittedByPool(BORN.get('r2s-famine-metropolis-0'))['kilns.dominant']).toBeGreaterThanOrEqual(3);
    expectNoSeedFailures(collectSeedFailures(['r2r-village-18', 'r2s-insurgency-village-2'], (seed) => {
      const n = admittedByPool(BORN.get(seed))['arms.dominant'];
      if (!(n >= 2)) throw new Error(`${seed}: arms.dominant admits ${n} (17f760584: 1)`);
    }), 'B7 (BAR7-SCENES): the arms\' villages');
  });

  // the smiths' `lines` pool in a town whose only iron house is a Smelter short of iron (no smith house; bar0-town-occupied-rand-31 of
  // the wide read kept ONE line of four at the joined line): three of its twins name no smith, so it keeps three
  it('B7: the smiths\' lines keep three where the only iron house is a Smelter short of iron (no smith stands)', () => {
    const base = BORN.get('r2r-village-0');
    const town = { ...base, institutions: [{ name: 'Smelter' }], config: { ...base.config, nearbyResources: [], nearbyResourcesDepleted: [] },
      economicState: { ...base.economicState, primaryImports: [], primaryExports: [], localProduction: [] }, resourceAnalysis: { ...base.resourceAnalysis, gaps: [] } };
    const facts = /** @type {any} */ (factsOf(town));
    expect(facts.hasInstitution('smith')).toBe(false);
    expect(tradeAtWorkOf(town, 'ironwork')).toBe(false);
    expect(admittedByPool(town)['smiths.lines']).toBeGreaterThanOrEqual(3);
  });

  it('TW1 (the chair, 2026-11-16): where EVERY smith is marked short, the forge line is refused and its twin keeps the slot', async () => {
    const { CHAIN_RAW_INPUT, houseInputAtHand, housesShortOf } = await import('../../src/domain/facts/houseInputAtHand.js');
    const base = BORN.get('r2r-village-0');
    const smith = { name: 'Blacksmith' };
    const bare = { ...base, institutions: [smith], config: { ...base.config, nearbyResources: [], nearbyResourcesDepleted: [] },
      economicState: { ...base.economicState, primaryImports: [], primaryExports: ['Quality tools'], localProduction: ['iron'] }, resourceAnalysis: { ...base.resourceAnalysis, gaps: [] } };
    const key = Object.keys(CHAIN_RAW_INPUT).find((k) => houseInputAtHand(bare, k, smith, { rawResource: CHAIN_RAW_INPUT[k] }) === 'missing');
    expect(key, 'a raw input the bare smith lacks').toBeTruthy();
    const town = { ...bare, resourceAnalysis: { ...bare.resourceAnalysis, gaps: [{ chain: CHAIN_RAW_INPUT[/** @type {string} */ (key)], institution: 'Blacksmith', kind: 'missing', impact: 'Blacksmith exists but lacks access to its input', severity: 'high' }] } };
    expect(housesShortOf(town).has('Blacksmith')).toBe(true);
    expect(tradeAtWorkOf(town, 'ironwork')).toBe(false); // a list that names iron does not override the mark
    const pool = /** @type {any} */ (ARRIVAL_SENSES.find((/** @type {any} */ x) => x.key === 'smiths')).lines;
    const original = pool.find((/** @type {any} */ l) => l && typeof l === 'object' && !l.twinOf);
    const twin = pool.find((/** @type {any} */ l) => l && typeof l === 'object' && l.twinOf === String(original.text('{name}')));
    const facts = /** @type {any} */ (factsOf(town));
    expect(declarationAdmits(declarationOf(original), facts).admitted).toBe(false);
    expect(declarationAdmits(declarationOf(twin), facts).admitted).toBe(true);
  });
});
