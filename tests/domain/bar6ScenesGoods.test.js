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
import { GOODS } from '../helpers/pageLaws/law6.mjs';
import { PROSE_FORMS } from '../../src/data/people/powerSentenceName.js';
import { ARRIVAL_SENSES } from '../../src/data/arrivalProse.js';
import { FACT_DIMENSIONS, declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { GOOD_TRADES, tradeAtWorkOf } from '../../src/domain/facts/tradeAtWork.js';
import { EXPORTED_GOODS, goodExportedOf } from '../../src/domain/facts/goodExported.js';
import { legitimacyCrisisOf } from '../../src/domain/facts/legitimacyCrisis.js';

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
    expect(tradeAtWorkOf({ institutions: [], economicState: { localProduction: ['dairy'] } }, 'dairy')).toBe(true);
    expect(tradeAtWorkOf({ institutions: [{ name: 'Tailor' }] }, 'cloth')).toBe(false);
    expect(tradeAtWorkOf({ institutions: [{ name: 'Weavers/Textile workers' }] }, 'cloth')).toBe(true);
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
    const goods = /^(trade at work: (dairy|cloth|ironwork|spice)|exported: )/;
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
});
