/**
 * bar8Scenes.test.js — BAR8-SCENES's guard (the chair's BRIEF-BAR8, section SCENES, 2026-11-17; ruling BR17; vetoable by the owner).
 *
 * A scene of a trade at work reads every mark that stops or thins that trade, and who takes the fish. Each arm reads a named town
 * of the seventh read's thirty (seeds `bar0-<shape>-rand-45..47`) or the wide read's 150 (`rand-27..41`), born in REVIEW-BAR-0's
 * bar0- shape (as `tests/generators/bar7Scenes.test.js` births them), with an anchor that the record still holds the premise and a
 * positive town beside each negative one (N7):
 *   (1) 11e.stalls: a house the leaf leaves bare under a siege, every chain of which the page prints Impaired, is not at work
 *       (`tradeAtWork.js :: houseAtWork`; C5157, bar0-city-under_siege+famine-rand-47); the same shape's rand-45 keeps its stalls;
 *   (2) 12b: the boom rows and the war's right-side row want the ironwork IN FULL (`trade at work: ironwork in full`): every smith
 *       "Curtailed by the war." in bar0-city-wartime-rand-45 (C7246, C7242); unmarked smiths (bar0-metropolis-calm-rand-45) keep them;
 *   (3) 11b: the racks and the gutting want the fish TAKEN here (`trade at work: fish taken here`): a fish market alone over an
 *       exhausted river fishery (bar0-town-occupied-rand-45 C36591, bar0-metropolis-calm-rand-45 C19722); a fishing community on
 *       its live water (bar0-thorp-calm-rand-45) keeps them;
 *   (4) 15a: the endless carts want a place of a village's size or more (`tier: ≥ village`; C15891, bar0-hamlet-calm-rand-45);
 *       a village whose stone is at work (bar0-village-calm-rand-45) keeps them;
 *   (5) 9g.food-soft (the chair's item 7): "nobody looks hungry" wants the food band secure or better (`food: ≥ secure`): a
 *       prosperous metropolis at "pressured" (bar0-metropolis-calm-rand-29) refuses it; one at "secure" (rand-45) keeps it.
 * Each FAILS at the round's base 2f8f64f7b and passes at this seat's tip.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { ARRIVAL_SENSES, ARRIVAL_TENSIONS } from '../../src/data/arrivalProse.js';
import { POLITICAL_FLAVOR, PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { FISH_TAKEN_HERE, GOOD_TRADES, IN_FULL, tradeAtWorkOf } from '../../src/domain/facts/tradeAtWork.js';
import { housesShortOf } from '../../src/domain/facts/houseInputAtHand.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { chainStateShown } from '../../src/domain/display/chainStateShown.js';
import { crisisOf } from '../../src/domain/facts/crisisKind.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { composeArrivalScene } from '../../src/generators/narrative/arrivalScene.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { canonStressors } from '../../src/domain/canonicalAccessors.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** seedcfg.mjs's bar0- arm, verbatim in shape (as `tests/generators/bar7Scenes.test.js`). @param {string} seed */
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
/** @param {any} row @param {any} record @param {boolean} [scoped] */
const admits = (row, record, scoped = false) => declarationAdmits(declarationOf(row), /** @type {any} */ (factsOf(record)), { crisisScoped: scoped }).admitted;
/** @param {any} record @param {RegExp} re */
const housesNamed = (record, re) => liveInstitutions(record).filter((/** @type {any} */ h) => re.test(String(h?.name || '')));

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);

describe('BAR8-SCENES item 1a (11e.stalls): a house the siege leaves bare with every chain Impaired is not at work', () => {
  const pool = () => sense('arcane').dominant;
  test('C5157, bar0-city-under_siege+famine-rand-47: the Wizard\'s tower, every reagent chain Impaired: no stalls of reagents', () => {
    const s = town('bar0-city-under_siege+famine-rand-47');
    // the premise, held by the record: a siege; the tower stands, unmarked by the leaf, and every chain it runs prints Impaired
    expect(crisisOf(s).has('under_siege')).toBe(true);
    const [tower] = housesNamed(s, /^Wizard's tower$/);
    expect(tower).toBeTruthy();
    expect(rowMarkText(s, 'house', tower)).toBe(null);
    const chains = s.economicState.activeChains.filter((/** @type {any} */ c) => (c.processingInstitutions || []).includes(tower.name));
    expect(chains.length).toBeGreaterThan(0);
    for (const c of chains) expect(chainStateShown(c, s), c.chainId).toBe('impaired');
    expect(tradeAtWorkOf(s, 'arcane')).toBe(false);
    expect(admits(rowOf(pool(), /^Stalls sell reagents in stoppered jars/), s)).toBe(false);
    expect(admits(rowOf(pool(), /^The reagent stalls are half bare/), s)).toBe(true); // its twin keeps the slot
  });
  test('the same shape\'s rand-45 (a siege too): an arcane house at work keeps its stalls', () => {
    const s = town('bar0-city-under_siege+famine-rand-45');
    expect(crisisOf(s).has('under_siege')).toBe(true);
    expect(tradeAtWorkOf(s, 'arcane')).toBe(true);
    expect(admits(rowOf(pool(), /^Stalls sell reagents in stoppered jars/), s)).toBe(true);
  });
});

describe('BAR8-SCENES item 2 (12b): the boom rows want the ironwork in full', () => {
  const pool = () => sense('smiths').dominant;
  const BOOM = [/^Forge smoke hangs over everything here/, /^Racks of new ironwork stand outside the workshops/];
  const TWINS = [/^Only a little forge smoke rises here/, /^The racks outside the workshops stand mostly empty/];
  const warRows = () => /** @type {any[]} */ (PRESSURE_SENTENCES.wartime({ name: '{name}', warGoesWell: true }));
  test('C7246, C7242, bar0-city-wartime-rand-45: every smiths\' house marked by the war: no forges at full work', () => {
    const s = town('bar0-city-wartime-rand-45');
    const smiths = housesNamed(s, /smith|metalworker|foundry|armou?rer/i).filter((/** @type {any} */ h) => GOOD_TRADES.ironwork.houses.some((w) => new RegExp(`(^|[^a-z])${w}`).test(String(h.name).toLowerCase())));
    // the premise: the smiths stand, some not short (the plain key holds: the mild rows keep it), every one carries a mark
    expect(smiths.length).toBeGreaterThan(0);
    const short = housesShortOf(s);
    expect(smiths.some((/** @type {any} */ h) => !short.has(h.name))).toBe(true);
    for (const h of smiths) expect(rowMarkText(s, 'house', h), h.name).toMatch(/^Curtailed by the war\./);
    expect(tradeAtWorkOf(s, 'ironwork')).toBe(true);
    expect(tradeAtWorkOf(s, `ironwork${IN_FULL}`)).toBe(false);
    for (const re of BOOM) expect(admits(rowOf(pool(), re), s), String(re)).toBe(false);
    for (const re of TWINS) expect(admits(rowOf(pool(), re), s), String(re)).toBe(true);
    expect(admits(rowOf(warRows(), /keeps the forges of .* running day and night/), s)).toBe(false);
    // a mild row keeps the plain key (K's `.mild`: true of a forge that works what it holds)
    expect(admits(rowOf(pool(), /^The hammering of the forges echoes through all of/), s)).toBe(true);
  });
  test('bar0-metropolis-calm-rand-45: smiths at work and unmarked: the boom rows stand', () => {
    const s = town('bar0-metropolis-calm-rand-45');
    expect(tradeAtWorkOf(s, `ironwork${IN_FULL}`)).toBe(true);
    for (const re of BOOM) expect(admits(rowOf(pool(), re), s), String(re)).toBe(true);
    expect(admits(rowOf(warRows(), /keeps the forges of .* running day and night/), s)).toBe(true);
  });
});

describe('BAR8-SCENES item 3 (11b): the racks and the gutting want the fish taken here', () => {
  const pool = () => sense('fish').dominant;
  for (const [seed, id] of [['bar0-town-occupied-rand-45', 'C36591'], ['bar0-metropolis-calm-rand-45', 'C19722']]) {
    test(`${id}, ${seed}: a fish market alone over an exhausted river fishery, salted fish bought in`, () => {
      const s = town(seed);
      // the premise: no taker of fish stands; the river fishery is spent; the imports bring salted fish for it
      expect(housesNamed(s, /fisher|fishing/i)).toEqual([]);
      expect(housesNamed(s, /^Fish market$/).length).toBe(1);
      expect(s.config.nearbyResourcesDepleted).toContain('river_fish');
      expect(s.economicState.primaryImports.some((/** @type {any} */ x) => /^Salted fish \(.*exhausted\)$/.test(String(x?.name ?? x)))).toBe(true);
      expect(tradeAtWorkOf(s, 'fish')).toBe(true); // the market sells fish: the plain key holds
      expect(tradeAtWorkOf(s, FISH_TAKEN_HERE)).toBe(false);
      expect(admits(rowOf(pool(), /^Racks of drying fish line the way in/), s)).toBe(false);
      expect(admits(rowOf(pool(), /seems to be gutting, salting or selling fish/), s)).toBe(false);
      expect(admits(rowOf(pool(), /^Half of .* has worked fish all its life/), s)).toBe(true); // the twins keep the slots
    });
  }
  test('bar0-thorp-calm-rand-45: a fishing community on its live water: the catch is taken here', () => {
    const s = town('bar0-thorp-calm-rand-45');
    expect(housesNamed(s, /^Fishing community$/).length).toBe(1);
    expect(tradeAtWorkOf(s, FISH_TAKEN_HERE)).toBe(true);
    expect(admits(rowOf(pool(), /seems to be gutting, salting or selling fish/), s)).toBe(true);
  });
});

describe('BAR8-SCENES item 6 (15a): an endless line of carts wants a village\'s size or more', () => {
  const row = () => rowOf(sense('stone').dominant, /^Laden carts from the workings grind along the road/);
  test('C15891, bar0-hamlet-calm-rand-45: a hamlet whose stone is at work: no endless line', () => {
    const s = town('bar0-hamlet-calm-rand-45');
    expect(s.tier).toBe('hamlet');
    expect(tradeAtWorkOf(s, 'stone')).toBe(true);
    expect(admits(row(), s, true)).toBe(false);
  });
  test('bar0-village-calm-rand-45: a village whose stone is at work keeps it', () => {
    const s = town('bar0-village-calm-rand-45');
    expect(s.tier).toBe('village');
    expect(tradeAtWorkOf(s, 'stone')).toBe(true);
    expect(admits(row(), s, true)).toBe(true);
  });
});

describe('BAR8-SCENES item 7 (9g.food-soft): "nobody looks hungry" wants the food band secure or better', () => {
  const row = () => rowOf(/** @type {any[]} */ (ARRIVAL_TENSIONS.prosperous), /nobody looks hungry/);
  /** @param {any} s */
  const band = (s) => { const f = /** @type {any} */ (factsOf(s)); return f.famine?.shownBand ?? f.famine?.band; };
  test('bar0-metropolis-calm-rand-29: a prosperous metropolis whose food band is pressured', () => {
    const s = town('bar0-metropolis-calm-rand-29');
    expect(String(s.economicState.prosperity).toLowerCase()).toMatch(/^(prosperous|wealthy)$/);
    expect(band(s)).toBe('pressured');
    expect(admits(row(), s)).toBe(false);
  });
  test('bar0-metropolis-calm-rand-45: a prosperous metropolis whose food band is secure keeps it', () => {
    const s = town('bar0-metropolis-calm-rand-45');
    expect(band(s)).toBe('secure');
    expect(admits(row(), s)).toBe(true);
  });
});

// ---- AFTER THE CHAIR'S RULING BR23 (2026-11-17): three twins given by name; the arrival draw answers by a line's first ADMITTED
// twin (`arrivalScene.js :: drawAdmitted`), the history's cascade by a row's `twinKey` (`historyCoherence.js :: flavorOf`). Each
// twin prints where its premise holds and is refused where it does not; no state admits two twins of one line.
// RE-KEYED BY IDENTITY 2026-11-18 (BAR8-SCENES-3, ruling BR25 (3)): the draw now answers by a line's LAST admitted twin, else its
// first (a later twin is the narrower state), and the empty road is back at its base declaration (no tier exclusion): in a thorp
// or a hamlet whose stone is at work outside a siege the road and the small cart are BOTH admitted, and the cart answers. The
// claim "one twin answers each state" now stands on the draw's answer (the scene as printed), not on disjoint declarations.
/** @param {any[]} pool @param {any} original @returns {any[]} its twins, by template or by key */
const twinsOf = (pool, original) => {
  const own = typeof original?.twinKey === 'string' ? original.twinKey : textOfLine(original);
  return pool.filter((l) => l && typeof l === 'object' && typeof l.twinOf === 'string' && l.twinOf === own);
};

describe('BR23 (1): the small working quarry', () => {
  const pool = () => sense('stone').dominant;
  const laden = () => rowOf(pool(), /^Laden carts from the workings/);
  const small = () => rowOf(pool(), /^A laden cart or two comes down from the workings in a day, and no more\.$/);
  const empty = () => rowOf(pool(), /^The road from the workings is empty of carts/);
  /** the scene of a record over sixty streams of the scene's own, joined */
  const scenes = (/** @type {any} */ record) => Array.from({ length: 60 }, (_, i) => {
    setActiveRng(createPRNG(`bar8-scenes-3-stone-${i}`).fork('arrival-scene'));
    try { return String(composeArrivalScene(record)); } finally { clearActiveRng(); }
  }).join('\n');
  /** the stone pool's slots the record admits: a line admitted, or any twin of it (as `bar6ScenesGoods.test.js` B7 counts) */
  const slots = (/** @type {any} */ record) => pool().filter((/** @type {any} */ l) => !l.twinOf).filter((/** @type {any} */ l) => admits(l, record, true) || twinsOf(pool(), l).some((t) => admits(t, record, true))).length;
  const ROAD = 'The road from the workings is empty of carts.';
  const CART = 'A laden cart or two comes down from the workings in a day, and no more.';
  // RE-KEYED BY IDENTITY 2026-11-18 (BAR8-SCENES-3, BR25 (3)): the order of the two twins is now the draw's rule (the later, the
  // narrower state, answers where both are admitted): the small cart needs the trade at work and a small place; the road needs nothing
  test('the endless line has exactly the two twins (the new one last in the pool, so no row\'s argmax id moves; the later is the narrower)', () => {
    expect(twinsOf(pool(), laden())).toEqual([empty(), small()]);
    expect(pool()[pool().length - 1]).toBe(small());
    expect(declarationOf(empty()).needs ?? []).toEqual([]);
    expect(declarationOf(small()).needs).toEqual(['trade at work: stone', 'tier: ≤ hamlet']);
  });
  // RE-KEYED BY IDENTITY 2026-11-18 (BAR8-SCENES-3, BR25 (3)): the old anchor was the road's refusal by the tier ([false, true,
  // false]); the road is admitted here again, so the same claim (a cart or two prints, never the empty road) stands on the scene
  test('C15891, bar0-hamlet-calm-rand-45: a hamlet whose stone is at work prints a cart or two, never the empty road', () => {
    const s = town('bar0-hamlet-calm-rand-45');
    expect(tradeAtWorkOf(s, 'stone')).toBe(true);
    expect(crisisOf(s).has('under_siege')).toBe(false);
    expect([admits(laden(), s, true), admits(small(), s, true), admits(empty(), s, true)]).toEqual([false, true, true]);
    expectAbsentWithAnchor(scenes(s), ROAD, CART);
  });
  // BAR8-SCENES-3 (BR25 (3), 2026-11-18): THE TWO STATES NO TWIN COVERED (rule R7). The same hamlet planted (a) with every ground
  // it has spent (its stone idle) and (b) under a siege over its stone at work: the empty road keeps the slot, the small cart is
  // refused, and the pool holds three slots. Both FAIL at 55b954f98 (the road refused by the tier: no twin admitted, two slots)
  // RE-KEYED BY IDENTITY 2026-11-18 (FAULTS-WATCH item 4 (a), BR25 (5)): rand-45's only stone house is a Stone quarry, which the
  // page marks "Stopped by the siege." under the planted siege, so its stone is no longer at work there; the siege arm's state
  // (a hamlet under a siege, its stone at work) is planted with the quarry's row read as a Mine (open cast), a stone house the
  // siege curtails ("Curtailed by the siege.": it works what it holds), the rest of the record as born
  /** @param {any} s */
  const quarryAsMine = (s) => ({ ...s, institutions: (s.institutions || []).map((/** @type {any} */ i) => (i?.catalogId === 'stone_quarry' ? { ...i, name: 'Mine (open cast)', catalogId: 'mine_open_cast' } : i)) });
  for (const [label, plant] of /** @type {Array<[string, (s: any) => any]>} */ ([
    ['its stone idle (every ground spent)', (s) => ({ ...s, config: { ...s.config, nearbyResourcesDepleted: [...(s.config.nearbyResources || [])] } })],
    ['its stone at work under a siege', (s) => { const list = [...canonStressors(s), { type: 'under_siege' }]; return quarryAsMine({ ...s, stress: list, stressors: list }); }],
  ])) {
    test(`bar0-hamlet-calm-rand-45 planted, ${label}: the empty road prints, never the small cart, and the pool holds three slots`, () => {
      const born0 = town('bar0-hamlet-calm-rand-45');
      expect(scenes(born0)).toContain(CART); // the stone pool is in play: the unplanted hamlet's slot draws the endless line
      const s = plant(born0);
      expect(s.tier).toBe('hamlet');
      expect(tradeAtWorkOf(s, 'stone')).toBe(label.includes('siege'));
      expect(crisisOf(s).has('under_siege')).toBe(label.includes('siege'));
      expect([admits(laden(), s, true), admits(small(), s, true), admits(empty(), s, true)]).toEqual([false, false, true]);
      expectAbsentWithAnchor(scenes(s), CART, ROAD);
      expect(slots(s)).toBe(3);
    });
  }
  test('bar0-city-wartime-rand-31: the stone not at work: the empty road, not the small cart', () => {
    const s = town('bar0-city-wartime-rand-31');
    expect(tradeAtWorkOf(s, 'stone')).toBe(false);
    expect([admits(laden(), s, true), admits(small(), s, true), admits(empty(), s, true)]).toEqual([false, false, true]);
  });
  // RE-KEYED BY IDENTITY 2026-11-18 (FAULTS-WATCH item 4 (a), BR25 (5)): rand-46's Stone quarry is "Stopped by the siege." on the
  // page, so its stone is not at work; the same claim stands on rand-36, whose Mine the siege curtails (its stone at work)
  test('bar0-city-under_siege+famine-rand-36: a siege over stone at work: the empty road keeps the slot', () => {
    const s = town('bar0-city-under_siege+famine-rand-36');
    expect(crisisOf(s).has('under_siege')).toBe(true);
    expect(tradeAtWorkOf(s, 'stone')).toBe(true);
    expect([admits(laden(), s, true), admits(small(), s, true), admits(empty(), s, true)]).toEqual([false, false, true]);
  });
  test('bar0-village-calm-rand-45: a village whose stone is at work keeps the endless line (a twin is reached only where it is refused)', () => {
    const s = town('bar0-village-calm-rand-45');
    expect([admits(laden(), s, true), admits(small(), s, true)]).toEqual([true, false]);
  });
});

describe('BR23 (3): enchanting offered, the arcane trade not at work', () => {
  const pool = () => sense('arcane').dominant;
  const trade = () => rowOf(pool(), /^Magic is a trade in .* like any other/);
  const noSign = () => rowOf(pool(), /^No sign in .* offers enchanting by the hour/);
  // RE-WORDED BY NAME 2026-11-18 (BAR8-SCENES-3, BR25 (2), VETOABLE): was "Signs in {name} still offer enchanting by the hour, …"
  const slow = () => rowOf(pool(), /^Magic is still a trade in .*: the signs still offer it by the hour, but the work is slow and dear/);
  /** @param {any} s */
  const states = (s) => [admits(trade(), s), admits(noSign(), s), admits(slow(), s)];
  test('the trade line has exactly the two twins (the new one last in the pool)', () => {
    expect(twinsOf(pool(), trade())).toEqual([noSign(), slow()]);
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35): "last in the pool" recorded the append of 2026-11-17, not a
    // law; L2 APPENDED three lines after it. The law is the twins' order above (the LAST admitted twin answers, `arrivalScene.js ::
    // drawAdmitted`), kept, and the twin keeps the index it was born at (6), so no row's id moved
    expect(pool().indexOf(slow())).toBe(6);
  });
  test('C5157\'s town, bar0-city-under_siege+famine-rand-47: enchanting offered, the tower impaired by the siege', () => {
    const s = town('bar0-city-under_siege+famine-rand-47');
    expect(/** @type {any} */ (factsOf(s)).enchanting).toBe(true);
    expect(tradeAtWorkOf(s, 'arcane')).toBe(false);
    expect(states(s)).toEqual([false, false, true]);
  });
  // BAR8-SCENES-3 (BR25 (2), 2026-11-18): the reader's H2. The atom `enchanting` reads enchant OR identif (`sceneSupply.js ::
  // ENCHANTING`); this town's only arcane service is "Arcane identification", and the twin said "still offer enchanting". Its
  // words now, word for word, and the services it names are only those the page lists (FAILS at 55b954f98: it named enchanting)
  test('the twin word for word; in bar0-city-under_siege+famine-rand-47 (identification only) it names no service the page does not list', () => {
    expect(slow().text('Ashford')).toBe('Magic is still a trade in Ashford: the signs still offer it by the hour, but the work is slow and dear for want of what it takes.');
    const s = town('bar0-city-under_siege+famine-rand-47');
    const listed = Object.values(s.availableServices || {}).flatMap((rows) => (Array.isArray(rows) ? rows : []).map((/** @type {any} */ r) => String(r?.name ?? ''))).filter((n) => /enchant|identif/i.test(n));
    expect(listed).toEqual(['Arcane identification']); // the premise: identification only
    expect(admits(slow(), s)).toBe(true);
    const SERVICES = ['enchant', 'identif'];
    const named = SERVICES.filter((w) => slow().text(s.name).toLowerCase().includes(w));
    expect(named.filter((w) => !listed.some((n) => n.toLowerCase().includes(w)))).toEqual([]);
    // the same reading convicts the old words (the arm can fail)
    const OLD = `Signs in ${s.name} still offer enchanting by the hour, but the work is slow and dear for want of what it takes.`;
    expect(SERVICES.filter((w) => OLD.toLowerCase().includes(w)).filter((w) => !listed.some((n) => n.toLowerCase().includes(w)))).toEqual(['enchant']);
  });
  test('bar0-city-under_siege+famine-rand-46: enchanting offered and the arcane trade at work: the original', () => {
    const s = town('bar0-city-under_siege+famine-rand-46');
    expect(tradeAtWorkOf(s, 'arcane')).toBe(true);
    expect(states(s)).toEqual([true, false, false]);
  });
  test('bar0-town-calm-rand-46: no enchanting offered: the "No sign" twin', () => {
    const s = town('bar0-town-calm-rand-46');
    expect(/** @type {any} */ (factsOf(s)).enchanting).toBe(false);
    expect(states(s)).toEqual([false, true, false]);
  });
});

describe('BR23 (2), K\'s 12c: the long and steady history under a live hard crisis', () => {
  const pool = () => /** @type {any[]} */ (POLITICAL_FLAVOR.stable);
  const row = () => { const r = pool().find((l) => l && typeof l === 'object' && l.twinKey === 'stable: long and steady'); expect(r).toBeTruthy(); return r; };
  const twin = () => { const t = twinsOf(pool(), row()); expect(t.length).toBe(1); expect(pool()[pool().length - 1]).toBe(t[0]); return t[0]; }; // last in the pool: no row's argmax id moves
  const events = (/** @type {any[]} */ majors) => majors.map((name) => ({ name, severity: 'major', type: 'political' }));
  test('C36585, bar0-town-occupied-rand-45: occupied: the row refused, its twin admitted, and no branch of the twin calls the past steady', () => {
    const s = town('bar0-town-occupied-rand-45');
    expect(crisisOf(s).has('occupied')).toBe(true);
    expect(admits(row(), s, true)).toBe(false);
    expect(admits(twin(), s, true)).toBe(true);
    // each branch word for word: none calls the past steady (K's 12c reads "long and steady", "history here is quiet", …)
    expect(twin().text(events([]))).toBe('No great event marks its past, and what it faces now may be the first');
    expect(twin().text(events(['Succession Crisis']))).toBe('The Succession Crisis is the one great event in its past, and what it faces now may be the second');
    // the row's true branch (two great events) is the twin's own
    expect(twin().text(events(['Succession Crisis', 'Great Fire']))).toBe(row().text(events(['Succession Crisis', 'Great Fire'])));
  });
  test('bar0-metropolis-calm-rand-45: no hard crisis: the row admitted, its twin refused', () => {
    const s = town('bar0-metropolis-calm-rand-45');
    expect(['under_siege', 'famine', 'occupied', 'plague_onset', 'wartime'].some((k) => crisisOf(s).has(k))).toBe(false);
    expect(admits(row(), s, true)).toBe(true);
    expect(admits(twin(), s, true)).toBe(false);
  });
});
