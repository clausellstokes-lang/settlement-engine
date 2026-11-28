/**
 * bar7Scenes.test.js — BAR7-SCENES's guard (the chair's BRIEF-BAR7, section BAR7-SCENES, 2026-11-17; vetoable by the owner).
 *
 * A scene shows no trade its houses cannot work and no market the crisis has emptied (LAW 8 rule 8k), and the war's overview
 * row yields to the purse (LAW 9 rule 9g.margin's pair; the chair's PM1). Each arm reads a named town of the sixth read's
 * thirty or the wide read's 150 (born in REVIEW-BAR-0's bar0- shape, as `tests/domain/bar6SeamEcon.test.js` births them),
 * with an anchor that the record still holds the premise, or a planted record:
 *   (1) 8k.trade: the generic `trade at work: kilns` key is answered by a house that fires a kiln, a glass furnace only where
 *       no such house stands (`tradeAtWork.js :: KILN_FURNACE_ONLY`; bar0-metropolis-calm-rand-32);
 *   (2) 8k.market: the "busy market" history line is refused under the crises that stop, starve or empty a market
 *       (REVIEW-BAR-6 C45015, bar0-village-famine-rand-43); a calm town with a market still admits it;
 *   (3) 9g.margin: the losing war's requisition row denies no margin where the purse holds one (C15153, bar0-city-wartime-rand-43);
 *   (4) LOW: precedent wants a law the page does not print as collapsed (C20639); the siege's work party names no defence (C19996);
 *   (5) the arrival pools: the dyer's twin, the tanners' twin noun, the smiths' twins, the brought-in twin, the tanners' lines.
 * Each FAILS at the joined line's 17f760584 and passes at this seat's tip.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { ARRIVAL_PEOPLE, ARRIVAL_SENSES } from '../../src/data/arrivalProse.js';
import { POLITICAL_FLAVOR, PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { KILN_FURNACE_ONLY, TRADE_HOUSES, tradeAtWorkOf } from '../../src/domain/facts/tradeAtWork.js';
import { housesShortOf } from '../../src/domain/facts/houseInputAtHand.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** seedcfg.mjs's bar0- arm, verbatim in shape (as `tests/domain/bar6SeamEcon.test.js`). @param {string} seed */
const born = (seed) => {
  const m = new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-\\d+$`).exec(seed);
  if (!m) throw new Error(`no shape for ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */
const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, born(seed)); return towns.get(seed); };
/** @param {any} line @returns {string} */
const textOfLine = (line) => { try { return String(typeof line === 'function' ? line('{name}') : typeof line?.text === 'function' ? line.text('{name}') : line?.text); } catch { return String(line?.text ?? line); } };
/** @param {string} key */
const sense = (key) => /** @type {any} */ (ARRIVAL_SENSES.find((/** @type {any} */ s) => s.key === key));
/** @param {any[]} pool @param {RegExp} re */
const rowOf = (pool, re) => { const row = pool.find((l) => re.test(textOfLine(l))); expect(row, String(re)).toBeTruthy(); return row; };
/** @param {any} row @param {any} record */
const admits = (row, record) => declarationAdmits(declarationOf(row), /** @type {any} */ (factsOf(record)), { crisisScoped: false }).admitted;

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);

describe('BAR7-SCENES item 1 (8k.trade): the generic kilns key is answered by a house that fires a kiln', () => {
  // RE-KEYED BY IDENTITY 2026-11-17 (the chair's rehearsal on the line's a55162cfa0, which holds BIRTH-1): the anchor was
  // bar0-metropolis-calm-rand-32 (REVIEW-BAR-6's town: a Potter, a Brickmaker and a Charcoal burner all short beside working
  // Glassmakers), and BIRTH-1 now feeds its Potter. The same claim on a planted record of that town's houses and gaps, on no route
  // (it cannot buy in): no seat in flight lifts it
  const gap = (/** @type {string} */ institution, /** @type {string} */ chain) => ({ chain, institution, kind: 'missing', impact: `${institution} exists but lacks access to ${chain}`, severity: 'high' });
  const shortKilns = () => ({ tier: 'metropolis', config: { tradeRouteAccess: 'isolated', nearbyResources: [] },
    institutions: ['Potter', 'Brickmaker', 'Charcoal burner', 'Glassmakers'].map((name) => ({ name })),
    economicState: { primaryImports: ['Glass sand'], primaryExports: [] },
    resourceAnalysis: { gaps: [gap('Potter', 'clay'), gap('Brickmaker', 'clay'), gap('Charcoal burner', 'mountain_timber')] } });
  test('rand-32\'s houses, planted: the Potter, the Brickmaker and the Charcoal burner all short beside working Glassmakers: no "kilns are lit"', () => {
    const s = shortKilns();
    const short = housesShortOf(s);
    // the premise, held by the planted record: every house that fires a kiln is short; the glass house stands and is not
    for (const h of ['Potter', 'Brickmaker', 'Charcoal burner']) expect(short.has(h), h).toBe(true);
    expect(short.has('Glassmakers')).toBe(false);
    expect(tradeAtWorkOf(s, 'kilns')).toBe(false);
    const pool = sense('kilns').dominant;
    const lit = rowOf(pool, /^The kilns are lit all through the day/);
    const cold = rowOf(pool, /are lit only now and then, and most days the lanes are cold/);
    expect(admits(lit, s)).toBe(false);
    expect(admits(cold, s)).toBe(true); // its twin keeps the slot
  });

  test('planted: a glass furnace answers the kilns only where no house that fires a kiln stands', () => {
    for (const w of KILN_FURNACE_ONLY) expect(TRADE_HOUSES.kilns).toContain(w);
    const sand = { economicState: { primaryImports: ['Glass sand'] } }; // the glassmakers' sand brought in: not short
    const glass = { name: 'Glassmakers' };
    expect(housesShortOf({ ...sand, institutions: [glass] }).size).toBe(0);
    expect(tradeAtWorkOf({ ...sand, institutions: [glass] }, 'kilns')).toBe(true); // the glass furnace is the only kiln house: it answers
    expect(tradeAtWorkOf({ institutions: [glass] }, 'kilns')).toBe(false); // and it reads its own short mark ("Short of glass sand.")
    expect(tradeAtWorkOf({ institutions: [{ name: 'Charcoal burner' }] }, 'kilns')).toBe(true); // BAR5-THINGS's reading kept
    expect(tradeAtWorkOf({ ...sand, institutions: [{ name: 'Potter' }, glass] }, 'kilns')).toBe(true); // a potter with its clay
  });
});

describe('BAR7-SCENES item 2 (8k.market): no busy market under the crises that stop, starve or empty a market', () => {
  const row = () => rowOf(/** @type {any[]} */ (POLITICAL_FLAVOR.stable), /Outsiders see a busy market/);
  test('C45015 · bar0-village-famine-rand-43: the famine village whose only market is a fish market prints no busy market', () => {
    const s = town('bar0-village-famine-rand-43');
    // the premise, still held: a famine, a market house stands, the fish failed
    expect((Array.isArray(s.stress) ? s.stress : [s.stress]).map((/** @type {any} */ x) => x?.type)).toContain('famine');
    expect(factsOf(s).market).toBe(true);
    // the slot prints the stable pool's admitted argmax
    // BAR8-SCENES (2026-11-17, K's 12c; re-keyed by identity): the anchor was the stable pool's "… travellers remember the place kindly"
    // row, which the famine now refuses ("long and steady" under a live hard crisis); the slot prints the pool's next admitted argmax
    expectAbsentWithAnchor(String(s.history?.historicalCharacter || ''), 'busy market', 'No great event marks this place', 'the history character slot');
    expect(admits(row(), s)).toBe(false);
  });
  test('planted: refused under a famine, a siege and an outbreak; admitted in a calm town with a market', () => {
    const base = town('bar0-village-famine-rand-43');
    const calm = { ...base, stress: [] };
    expect(admits(row(), calm)).toBe(true);
    for (const type of ['famine', 'under_siege', 'plague_onset']) expect(admits(row(), { ...base, stress: [{ type }] }), type).toBe(false);
  });
});

describe('BAR7-SCENES item 3 (9g.margin, the chair\'s PM1): the war\'s requisition row denies no margin the purse holds', () => {
  const losing = (/** @type {string} */ prosperity) => /** @type {any[]} */ (PRESSURE_SENTENCES.wartime({ name: 'Quirigich', govFaction: 'Merchant Guild Council', warGoesWell: false, prosperity }))[0];
  // RE-PICKED BY THE PREMISE (THE FLIP, CLOSE-6 F-FORTUNE, 2026-11-23): lit (2bc483fc8, the fortune law on), rand-43's purse reads
  // Moderate. Re-scanned bar0-city-wartime-rand-0..199 lit for the case's own predicate (prosperity Comfortable; a losing war by
  // the crisis summary, stressNarrative.js :: wartimeGoesWell false; the slot drew the losing pool's requisition row, whose two
  // branches both name the order): 170 179; 170 is the first (was rand-43)
  test('C15153 · bar0-city-wartime-rand-170: a Comfortable purse; the row names the requisition and says no "cannot afford" or "running thin"', () => {
    const s = town('bar0-city-wartime-rand-170');
    expect(String(s.economicState?.prosperity)).toBe('Comfortable');
    expect(String(s.pressureSentence)).toContain('signed a requisition order last week');
    for (const denial of ['cannot afford', 'running thin']) expectAbsentWithAnchor(String(s.pressureSentence), denial, 'signed a requisition order last week', 'the war row');
  });
  test('planted: Comfortable and above take the twin; Moderate and below keep "cannot afford … running thin"', () => {
    for (const p of ['Comfortable', 'Prosperous', 'Wealthy']) {
      const t = String(losing(p).text);
      expect(t, p).toContain('requisition order');
      for (const denial of ['cannot afford', 'running thin']) expectAbsentWithAnchor(t, denial, 'signed a requisition order last week', p);
    }
    for (const p of ['Moderate', 'Poor', 'Struggling']) expect(String(losing(p).text), p).toMatch(/cannot afford and could not refuse[^]*running thin/);
    expect(declarationOf(losing('Comfortable')).excludes).toContain('legitimacy crisis'); // the row keeps its declaration
  });
});

describe('BAR7-SCENES item 4 (LOW): a calm-times overview line under a siege', () => {
  test('C20639: "disputes settled by precedent" is refused where the page prints the law Collapsed', () => {
    const row = /** @type {any} */ (POLITICAL_FLAVOR.stable).find((/** @type {any} */ l) => typeof l?.text === 'function' && String(l.text).includes('Records here are kept carefully'));
    expect(row).toBeTruthy();
    expect(declarationOf(row).needs).toContain('law: ≥ strained');
  });
  test('C19996: the siege\'s work party names no defence', () => {
    const twin = rowOf(/** @type {any[]} */ (Object.values(ARRIVAL_PEOPLE).flat()), /^A work party gathers/);
    for (const noun of ['defences', 'walls', 'palisade', 'garrison']) expectAbsentWithAnchor(textOfLine(twin), noun, 'A work party gathers with tools on their shoulders', 'the siege work party');
  });
});

describe('BAR7-SCENES item 5: the arrival pools the seam left', () => {
  test('(a) the dyer\'s twin excludes the key its original needs: where cloth is made and no dyer works, the slot is kept', () => {
    const pool = sense('cloth').lines;
    const original = rowOf(pool, /^A dyer walks past/);
    const twin = rowOf(pool, /^Someone walks past with a measuring cord/);
    expect(declarationOf(original).needs).toEqual(['trade at work: dyed cloth']);
    expect(declarationOf(twin).excludes).toEqual(['trade at work: dyed cloth']);
    const weavers = { institutions: [{ name: 'Weavers' }] }; // cloth made, no dyer
    expect(tradeAtWorkOf(weavers, 'cloth')).toBe(true);
    expect(admits(original, weavers)).toBe(false);
    expect(admits(twin, weavers)).toBe(true);
  });
  test('(b) the tanners\' dominant twin says no tier noun (a hamlet\'s tanner reaches the pool)', () => {
    const twin = rowOf(sense('tanners').dominant, /^Hardly a hide hangs drying/);
    expect(textOfLine(twin)).not.toMatch(/\b(thorp|hamlet|village|town|city|metropolis)\b/); // anchored: the row was found by its own words through rowOf, which asserts it, so the text is live
    const hamlet = { tier: 'hamlet', institutions: [{ name: 'Tanner' }], economicState: { primaryExports: [] } };
    expect(tradeAtWorkOf({ ...hamlet, institutions: [{ name: 'Saddler' }] }, 'leather')).toBe(false);
  });
  test('(c) where a Smelter not short stands and no smith works, no admitted twin of the smiths says the place has no iron', () => {
    const smelter = { institutions: [{ name: 'Smelter' }], economicState: { primaryImports: ['Iron ore'] } }; // its ore brought in: not short
    expect(housesShortOf(smelter).size).toBe(0);
    expect(tradeAtWorkOf(smelter, 'ironwork')).toBe(false);
    const said = [...sense('smiths').lines, ...sense('smiths').dominant].filter((l) => l?.twinOf && admits(l, smelter)).map(textOfLine);
    expect(said.length).toBeGreaterThanOrEqual(2);
    for (const t of said) expect(t).not.toMatch(/\bno iron\b/); // anchored: `said` is asserted to hold at least two admitted twins just above
  });
  // (d) re-keyed 2026-11-17 (the chair's second-reader note): the twin named "the shops", and r2r-village-26 of the 720 printed it;
  // the same claim (little cloth made here, what is sold brought in) is now read on a wording that presumes no shop, at any tier
  test('(d) the brought-in twin says first that little cloth is made here, and names no road and no shop (a village prints it)', () => {
    const twin = rowOf(sense('cloth').dominant, /was brought in from elsewhere/);
    expect(textOfLine(twin)).toMatch(/^Little cloth is made here/);
    expect(textOfLine(twin)).not.toMatch(/\broad\b|\bcarts?\b|\bshops?\b/); // anchored: the same text is asserted to open "Little cloth is made here" just above
    expect(declarationOf(twin).needs ?? []).not.toContainEqual(expect.stringMatching(/^tier/)); // no band: true at every tier
  });
  test('(e) the tanners\' lines show the pits at work only where a tanner has its hides; each twin keeps the slot', () => {
    const pool = sense('tanners').lines;
    const originals = pool.filter((/** @type {any} */ l) => !l?.twinOf);
    expect(originals.length).toBe(4);
    const saddler = { tier: 'village', institutions: [{ name: 'Saddler' }], economicState: { primaryExports: [] } }; // opens the pool, no tanner
    expect(tradeAtWorkOf(saddler, 'leather')).toBe(false);
    for (const o of originals) {
      expect(declarationOf(o).needs, textOfLine(o)).toContain('trade at work: leather');
      const twin = pool.find((/** @type {any} */ t) => t?.twinOf === textOfLine(o));
      expect(twin, textOfLine(o)).toBeTruthy();
      expect(admits(o, saddler)).toBe(false);
      expect(admits(twin, saddler)).toBe(true);
    }
    // RE-KEYED BY IDENTITY 2026-11-17 (the chair's rehearsal on a55162cfa0): the anchor was bar0-village-calm-rand-31 of the 150, its
    // one Tannery "Short of its materials." under "Downwind of the tanning pits …"; BIRTH-1 now brings its hides in. The same claim on
    // a planted village of that Tannery and its gaps, on no route
    const tannery = { tier: 'village', config: { tradeRouteAccess: 'isolated', nearbyResources: [] }, institutions: [{ name: 'Tannery' }],
      economicState: { primaryImports: [], primaryExports: [] },
      resourceAnalysis: { gaps: ['livestock', 'animal hides'].map((chain) => ({ chain, institution: 'Tannery', kind: 'missing', impact: `Tannery exists but lacks access to ${chain}`, severity: 'high' })) } };
    expect(housesShortOf(tannery).has('Tannery')).toBe(true);
    expect(tradeAtWorkOf(tannery, 'leather')).toBe(false);
    for (const o of originals) {
      expect(admits(o, tannery), textOfLine(o)).toBe(false);
      expect(admits(pool.find((/** @type {any} */ t) => t?.twinOf === textOfLine(o)), tannery), textOfLine(o)).toBe(true);
    }
  });
});

// a planted state kept apart from the seeds: every named town of this file is born once
test('the named towns are born in the bar0- shape', () => {
  expectNoSeedFailures(collectSeedFailures(['bar0-village-famine-rand-43', 'bar0-city-wartime-rand-170'], (seed) => {
    if (!town(seed)?.name) throw new Error(`${seed}: not born`);
  }), 'born');
});
