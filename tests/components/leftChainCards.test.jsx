/** @vitest-environment jsdom */
/**
 * leftChainCards.test.jsx — LEFT-CHAIN (the sixth chair's BRIEF-LEFT, 2026-11-17; rows L18, L5, L27, L7; vetoable by the
 * owner): THE CHAIN CARD SAYS WHO WORKS THE CHAIN NOW, AND ITS LISTS FOLLOW THE MARKS. THIS FILE REDS WHEN
 *   (a) L18, THE CHAIR'S RULING BR10 (3) AS AMENDED: over the census's 720, the 150 and the thirty, a chain card whose From
 *       is a spent ground (`resourceDepleted`, the "(depleted)" its From prints) lists under "Via" a source house WHOSE OWN
 *       GROUNDS HOLD THAT GROUND (`houseKinds.js :: SOURCE_GROUNDS`) that the supply rule reads at work
 *       (`supplyStory.js :: sourceStoryOf`, story `local`): the seventeen mines of the chair's list (each on spent iron
 *       beside a live seam of its own kind) by name, on the rendered tab too; or the POSITIVE ANCHOR goes: a mine on its
 *       only, spent ground (r2r-town-12, r2r-village-51) IS listed on its spent card, and IS marked short; or THE NEGATIVE
 *       goes: a source house at work on a ground of its own that is not the card's (a charcoal burner on live wood on a spent
 *       coal card, r2s-famine-city-2; a salt works on live salt flats on a spent fishery's card, r2s-famine-town-2) KEEPS
 *       its place on the card.
 *       DATED NOTE (2026-11-17, LEFT-CHAIN): the brief's wording of this arm ("a source house whose story is `local`",
 *       any source house) is SUPERSEDED by the chair's message of 19:09 UTC amending BR10 (3) to the narrower reading: a
 *       maker of the chain's goods on a ground of its own is true on the card (the wide wording dropped 58 such houses
 *       and emptied 43 cards of the 720). The arm is re-worded to the amended rule, and the negative stands beside it;
 *   (b) L5 and L27: over the 720 and the 150, an output of a working chain card, an Exports pill or a "Produced locally"
 *       pill names a good whose every maker on the live roster (`tradeListDisplay.js :: houseMakesGoodNamed`) carries the
 *       page's short mark (`crisisStoppedRow.js :: rowShortOf`), a good the town's own live ground yields apart (the
 *       pills' rule (ii)); or L5's three anchors lose the outputs a maker printed bare bears out;
 *   (c) L7: where every smelting or working house of the metal trade is marked short and a mine of the trade is at work
 *       (r2r-metropolis-24, r2s-monster_pressure-metropolis-2), the metal share does not print its twin
 *       (`incomeLineSiblings.js :: METAL_FORGE_IDLE_LINE`, its declaration admitted by the town's facts), on the rendered
 *       tab; or the twin prints where a smith works (bar0-hamlet-calm-rand-29, the 150's town of the row, its smith fed
 *       since the supply rule's births: the line as before);
 *   (d) N4: the owner's page and the shared page (`toPublicSafe`, and the share veil over it, `projectShareVeil`) read a
 *       card's houses and outputs, the trade lists and the metal share otherwise, over the three populations; or a rendered
 *       anchor's cards print otherwise on the two.
 * At the seat's base (e0242a12a) (a) finds the seventeen mines and (c) finds the two towns' bare share: both red.
 */
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { describe, expect, test, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { chainFlowFacts } from '../../src/components/new/SupplyChainsPanel.jsx';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { chainPrintName } from '../../src/domain/display/chainPrintName.js';
import { chainOutputsOnCard, incomeDescShown } from '../../src/domain/display/economicsCrisisMarks.js';
import { houseMakesGoodNamed, tradeListsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { rowShortOf } from '../../src/domain/display/crisisStoppedRow.js';
import { institutionHouseLabel } from '../../src/domain/display/institutionDisplayName.js';
import { chainAsShown } from '../../src/domain/display/chainStateShown.js';
import { chainYieldRefused } from '../../src/domain/chainYield.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { idOfHouse, sourceStoryOf } from '../../src/domain/facts/supplyStory.js';
import { SOURCE_GROUNDS } from '../../src/domain/facts/houseKinds.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { filterDeclared } from '../../src/domain/facts/drawDeclared.js';
import { resourceShortageImport } from '../../src/domain/resourceSemantics.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { RESOURCE_DATA } from '../../src/data/goods/identity.js';
import * as incomeLines from '../../src/generators/economy/incomeLineSiblings.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

await loadGenerationLawPayloads();
afterEach(() => cleanup());

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset',
  'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** The census's 720, in its own order of shapes. */
const CENSUS = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...CRISES.flatMap((c) => SIZES.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-${c}-${size}-${i}`))),
];
/** The 150 (BIRTH-3's `seeds.w150.txt`) and the sixth read's thirty (its ten shapes, `rand-42..44`). */
const WIDE = fs.readFileSync(path.resolve(__dirname, '../../docs/chair/2026-11-17/birth/birth3/seeds.w150.txt'), 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
const THIRTY = [...new Set(WIDE.map((s) => s.replace(/-rand-\d+$/, '')))].flatMap((shape) => [42, 43, 44].map((n) => `${shape}-rand-${n}`));
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** PAGE-COPY seedcfg.mjs's r2r-, r2s- and bar0- arms, verbatim in shape. @param {string} seed */
const born = (seed) => {
  let m = /^r2r-(\w+)-\d+$/.exec(seed);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] }), null, { seed, customContent: {} });
  m = /^r2s-(\w+)-(\w+)-\d+$/.exec(seed);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
  m = /^bar0-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/.exec(seed);
  if (!m) throw new Error(`not a seed of the three populations: ${seed}`);
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};
const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, born(seed)); return towns.get(seed); };

/** THE CHAIR'S SEVENTEEN (the worklist's head, measured over the 720 at 4a9735d2f9): each mine's one chain, "Iron & Metalwork", on spent iron. */
const SEVENTEEN = ['r2r-town-45', 'r2r-metropolis-9', 'r2r-metropolis-15', 'r2r-metropolis-17', 'r2r-metropolis-24', 'r2r-metropolis-29',
  'r2r-metropolis-37', 'r2r-metropolis-40', 'r2r-metropolis-57', 'r2s-indebted-metropolis-2', 'r2s-infiltrated-metropolis-1',
  'r2s-infiltrated-metropolis-2', 'r2s-insurgency-metropolis-0', 'r2s-insurgency-metropolis-3', 'r2s-monster_pressure-metropolis-2',
  'r2s-politically_fractured-metropolis-1', 'r2s-succession_void-city-0'];
/** A mine on its only, spent iron ground, worked out and marked (measured at the base). */
const ON_ITS_ONLY_SPENT_GROUND = ['r2r-town-12', 'r2r-village-51'];
/** L7's towns at the base (the row's five hamlets and the 150's town are fed since the supply rule's births). */
const FORGE_IDLE = ['r2r-metropolis-24', 'r2s-monster_pressure-metropolis-2'];
const SMITH_WORKS = 'bar0-hamlet-calm-rand-29';
/** L5's anchors: an output a maker printed bare bears out, which the fact's wider short set took off the card. */
const L5_ANCHORS = [
  ['bar0-hamlet-calm-rand-33', 'Horse & Animal Trade', 'Draft horses'],
  ['bar0-hamlet-calm-rand-34', 'Foraging & Smallholding', 'Honey and beeswax'],
  ['bar0-village-famine-rand-36', 'Herbalism & Remedies', 'Herbal remedies'],
];

/** @param {any} s */
const instNamesOf = (s) => (s?.institutions || []).map((/** @type {any} */ i) => i?.name || '');
/** The names a chain card prints under "Via", as the tab reads them. @param {any} s @param {any} chain */
const viaOf = (s, chain) => chainFlowFacts(chain, instNamesOf(s), chainPrintName(chain, s), s).institutions.map((/** @type {{ name: string }} */ h) => h.name);
/** The live source houses of a ground the supply rule reads at work, by the card's label. @param {any} s @param {string} ground */
const atWorkSourceLabels = (s, ground) => new Map((s?.institutions || [])
  .filter((/** @type {any} */ i) => i && typeof i.name === 'string' && (SOURCE_GROUNDS[idOfHouse(i)] || []).includes(ground)
    && sourceStoryOf(s, i, resourceShortageImport)?.story === 'local')
  .map((/** @type {any} */ i) => [institutionHouseLabel(i.name), i.name]));

/** (a)'s instances in one town (BR10 (3) amended: a source house of the card's own spent ground). @param {any} s @returns {string[]} */
function spentCardsListingWorkers(s) {
  /** @type {string[]} */
  const out = [];
  for (const chain of s?.economicState?.activeChains || []) {
    if (chain?.resourceDepleted !== true) continue;
    const working = atWorkSourceLabels(s, String(chain.resourceKey || ''));
    for (const name of viaOf(s, chain)) if (working.has(name)) out.push(`${chain.label} · ${working.get(name)}`);
  }
  return out;
}

/** THE NEGATIVE (BR10 (3) amended): a source house at work on a ground of its own keeps its place on a spent card of another ground. */
const MAKERS_ON_THEIR_OWN_GROUND = [
  ['r2s-famine-city-2', 'Fuel & Heating', 'charcoal_burner'],
  ['r2s-famine-town-2', 'Fishing & Seafood', 'salt_works'],
];
/** A ground each maker's row of SOURCE_GROUNDS holds (the liveness anchor of the row it reads): the woodland, the salt flats. */
const OWN_GROUND_OF = /** @type {Record<string, string>} */ ({ charcoal_burner: 'managed_forest', salt_works: 'salt_flats' });

const WORKING_STATES = new Set(['running', 'operational', 'productive', 'thriving']);
/** @param {string} x */
const fold = (x) => String(x).toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
/** @param {string} x */
const bare = (x) => String(x).replace(/\s*\(.*?\)\s*/g, ' ').trim();
/** FR23 (1): the page's own transit mark on a printed pill (`tradeListDisplay.js :: tradeMarkOf`'s `(transit)`). @param {string} good */
const transitPill = (good) => /\(transit\)/.test(String(good));
/** FR23 (1): the transit pills the arm passed over, with their town, for its count. @type {Array<[any, string]>} */
const transitPassed = [];
/** (b)'s instances in one town. @param {any} s @returns {string[]} */
function goodsOfShortMakers(s) {
  const live = liveInstitutions(s).filter((/** @type {any} */ i) => i && typeof i.name === 'string' && i.name);
  const spent = new Set((s?.config?.nearbyResourcesDepleted || []).map(String));
  const landGoods = new Set((s?.config?.nearbyResources || []).filter((/** @type {string} */ k) => !spent.has(k))
    .flatMap((/** @type {string} */ k) => [...(RESOURCE_DATA[k]?.tradeGoods || []), ...(RESOURCE_DATA[k]?.commodities || [])].map(fold)));
  /** @param {string} good */
  const everyMakerShort = (good) => {
    if (landGoods.has(fold(bare(good)))) return null;
    const makers = live.filter((/** @type {any} */ i) => houseMakesGoodNamed(bare(good), i.name, s));
    return makers.length > 0 && makers.every((/** @type {any} */ i) => rowShortOf(s, 'house', i) !== null) ? makers.map((/** @type {any} */ i) => i.name).join(' + ') : null;
  };
  /** @type {string[]} */
  const out = [];
  for (const chain of s?.economicState?.activeChains || []) {
    if (chainYieldRefused(chain) || !WORKING_STATES.has(String(chainAsShown(chain, s)?.status ?? chain.status))) continue;
    for (const good of chainOutputsOnCard(chain, s)) { const m = everyMakerShort(good); if (m) out.push(`${chain.label} outputs ${good} · ${m}`); }
  }
  const lists = tradeListsAsPrinted(s);
  for (const [head, goods] of /** @type {Array<[string, string[]]>} */ ([['Exports', lists.exports], ['Produced locally', lists.local]])) {
    for (const good of goods) {
      // FAULTS-BIRTH, the chair's ruling FR23 (1) (2026-11-18): A PILL THE PAGE PRINTS AS TRANSIT IS PASSING TRADE AND CLAIMS NO
      // MAKER IN THE TOWN. "(transit)" is the entrepôt's mark (`computeActiveChains.js` §3: "a transit good passes through
      // untouched"); the page prints it where the chain's carrier is passing trade (`chainCarrier.js :: chainCarrierOf`:
      // `transit`), so the maker rule does not reach it (r2r-village-2's "Furs and pelts (transit)" beside its idle lodge).
      // Read off the printed list itself, never by a second reading of the chain.
      if (transitPill(good)) { transitPassed.push([s, good]); continue; }
      const m = everyMakerShort(good); if (m) out.push(`${head} ${good} · ${m}`);
    }
  }
  return out;
}

/** The metal share as the tab prints it, with the tab's own caller (`EconomicsTab.jsx`). @param {any} s */
const metalShareOf = (s) => (s?.economicState?.incomeSources || []).filter((/** @type {any} */ x) => x?.source === 'Iron & Metalwork')
  .map((/** @type {any} */ x) => incomeDescShown(s, x, incomeLines.ordinaryIncomeLineOf));

/** Everything this seat's readings print in one town (d). @param {any} s */
const readingOf = (s) => JSON.stringify({
  cards: (s?.economicState?.activeChains || []).map((/** @type {any} */ c) => [c?.label, viaOf(s, c), chainOutputsOnCard(c, s)]),
  lists: tradeListsAsPrinted(s), metal: metalShareOf(s),
});

describe('LEFT-CHAIN: the chain card says who works the chain now, and its lists follow the marks', () => {
  test('(a) L18 (BR10 (3)): no card on a spent ground lists a source house at work, over the 720, the 150 and the thirty', () => {
    /** @type {string[]} */
    const found = [];
    const failures = collectSeedFailures([...CENSUS, ...WIDE, ...THIRTY], (seed) => {
      for (const x of spentCardsListingWorkers(town(seed))) found.push(`${seed} · ${x}`);
    });
    expectNoSeedFailures(failures, 'every town is born and read');
    expect(found).toEqual([]);
  }, 1_800_000);

  test('(a) the seventeen mines: at work on a live seam, and off their spent iron card on the rendered tab', () => {
    const failures = collectSeedFailures(SEVENTEEN, (seed) => {
      const s = town(seed);
      const mine = (s.institutions || []).find((/** @type {any} */ i) => idOfHouse(i) === 'mine');
      expect(mine, `${seed}: the mine stands`).toBeTruthy();
      expect(sourceStoryOf(s, mine, resourceShortageImport)?.story, `${seed}: the supply rule reads the mine at work`).toBe('local');
      const iron = (s.economicState?.activeChains || []).find((/** @type {any} */ c) => c?.label === 'Iron & Metalwork' && c?.resourceDepleted === true);
      expect(iron, `${seed}: the spent iron card`).toBeTruthy();
      expect(viaOf(s, iron).length, `${seed}: the card still names its other houses`).toBeGreaterThan(0);
      // anchored: the line above holds this same Via non-empty, so the card is live and names its other houses
      expect(viaOf(s, iron), `${seed}: the card's Via`).not.toContain(institutionHouseLabel(mine.name));
      const via = viaOnTab(s, chainPrintName(iron, s).label);
      expect(via, `${seed}: the tab prints the card's Via`).not.toBeNull();
      expect(via, `${seed}: the rendered Via names the card's first other house (the anchor)`).toContain(institutionHouseLabel(viaOf(s, iron)[0]));
      expect(via, `${seed}: the rendered card`).not.toMatch(/\bMine\b/); // anchored: the line above holds the rendered Via naming the card's first other house
    });
    expectNoSeedFailures(failures, 'every one of the seventeen');
  }, 600_000);

  test('(a) POSITIVE ANCHOR: a mine on its only, spent ground is listed on its spent card and marked short', () => {
    const failures = collectSeedFailures(ON_ITS_ONLY_SPENT_GROUND, (seed) => {
      const s = town(seed);
      const mine = (s.institutions || []).find((/** @type {any} */ i) => idOfHouse(i) === 'mine' || idOfHouse(i) === 'mine_open_cast');
      expect(mine, `${seed}: the mine stands`).toBeTruthy();
      expect(['idle', 'bought'], `${seed}: the mine is worked out`).toContain(sourceStoryOf(s, mine, resourceShortageImport)?.story);
      expect(rowShortOf(s, 'house', mine), `${seed}: the mine is marked`).not.toBeNull();
      const iron = (s.economicState?.activeChains || []).find((/** @type {any} */ c) => c?.label === 'Iron & Metalwork' && c?.resourceDepleted === true);
      expect(viaOf(s, iron), `${seed}: the mine is listed`).toContain(institutionHouseLabel(mine.name));
      expect(viaOnTab(s, chainPrintName(iron, s).label), `${seed}: the rendered card names it`).toMatch(/\bMine\b/);
    });
    expectNoSeedFailures(failures, 'both anchors');
  }, 600_000);

  test('(a) THE NEGATIVE (BR10 (3) amended): a maker at work on a ground of its own keeps its place on a spent card of another ground', () => {
    const failures = collectSeedFailures(MAKERS_ON_THEIR_OWN_GROUND, ([seed, label, id]) => {
      const s = town(seed);
      const chain = (s.economicState?.activeChains || []).find((/** @type {any} */ c) => c?.label === label);
      expect(chain?.resourceDepleted, `${seed}: ${label} is on a spent ground`).toBe(true);
      const house = (s.institutions || []).find((/** @type {any} */ i) => idOfHouse(i) === id);
      expect(sourceStoryOf(s, house, resourceShortageImport)?.story, `${seed}: the ${id} is at work`).toBe('local');
      expectAbsentWithAnchor(SOURCE_GROUNDS[id], chain.resourceKey, OWN_GROUND_OF[id], `${seed}: the card's ground is not the ${id}'s own`);
      expect(viaOf(s, chain), `${seed}: the ${id} keeps its place`).toContain(institutionHouseLabel(house.name));
      expect(viaOnTab(s, chainPrintName(chain, s).label), `${seed}: the rendered card names it`).toContain(institutionHouseLabel(house.name).split(' ')[0]);
    });
    expectNoSeedFailures(failures, 'both negatives');
  }, 600_000);

  test('(b) L5 and L27: no output and no pill names a good whose every maker is marked short, over the 720 and the 150', () => {
    /** @type {string[]} */
    const found = [];
    const failures = collectSeedFailures([...CENSUS, ...WIDE], (seed) => {
      for (const x of goodsOfShortMakers(town(seed))) found.push(`${seed} · ${x}`);
    });
    expectNoSeedFailures(failures, 'every town is born and read');
    expect(found).toEqual([]);
    // FR23 (1): the transit pills passed over (the anchor), each on an entrepôt chain of its town that carries the good
    expect(transitPassed.length, 'transit pills the arm passed over').toBeGreaterThan(0);
    const unborne = transitPassed.filter(([t, good]) => !(t?.economicState?.activeChains || [])
      .some((/** @type {any} */ c) => c?.entrepot === true && (c.outputs || []).some((/** @type {string} */ o) => fold(o) === fold(bare(good)))));
    expect(unborne.map(([t, good]) => `${t?.name} · ${good}`), 'a transit pill no entrepôt chain of its town carries').toEqual([]);
    console.log(`FR23 (1): transit pills passed over: ${transitPassed.length} in ${new Set(transitPassed.map(([t]) => t)).size} towns`);
  }, 1_800_000);

  test('(b) L5 ANCHORS: an output a maker printed bare bears out stays on its card', () => {
    const failures = collectSeedFailures(L5_ANCHORS, ([seed, label, good]) => {
      const s = town(seed);
      const chain = (s.economicState?.activeChains || []).find((/** @type {any} */ c) => c?.label === label);
      expect(chain, `${seed}: ${label}`).toBeTruthy();
      expect(chainOutputsOnCard(chain, s), `${seed}: ${label}'s outputs`).toContain(good);
      const makers = liveInstitutions(s).filter((/** @type {any} */ i) => houseMakesGoodNamed(good, i.name, s));
      expect(makers.some((/** @type {any} */ i) => rowShortOf(s, 'house', i) === null), `${seed}: a maker of ${good} printed bare`).toBe(true);
    });
    expectNoSeedFailures(failures, 'the three anchors');
  }, 600_000);

  test('(c) L7: the metal share takes its twin beside an idle forge and a mine at work; a working smith keeps the line', () => {
    const twin = incomeLines.METAL_FORGE_IDLE_LINE;
    const decl = [...incomeLines.INCOME_STATE_SIBLINGS[incomeLines.IRON_IMPORTED_LINE]].find((x) => x.text === twin);
    expect(decl, 'the twin is declared in its family').toBeTruthy();
    const failures = collectSeedFailures(FORGE_IDLE, (seed) => {
      const s = town(seed);
      expect(metalShareOf(s), `${seed}: the share's line`).toEqual([twin]);
      // the twin's own atoms, read as a line of its own (`filterDeclared` passes over a twin: its family's original is drawn)
      expect(filterDeclared([{ text: decl.text, needs: decl.needs, excludes: decl.excludes }], { facts: factsOf(s), poolId: 'leftChain:L7', drawKind: 'A' }).length, `${seed}: the twin's atoms hold`).toBe(1);
      expect(textOnTab(s), `${seed}: the tab prints the twin`).toContain(twin);
    });
    expectNoSeedFailures(failures, 'both towns');
    const s = town(SMITH_WORKS);
    expect(metalShareOf(s), `${SMITH_WORKS}: the smith works; the line as before`).toEqual([incomeLines.METAL_WORKED_LINE]);
    expectAbsentWithAnchor(textOnTab(s), twin, incomeLines.METAL_WORKED_LINE, `${SMITH_WORKS}: the tab prints the worked line, not the twin`);
    /** @type {string[]} */
    const elsewhere = [];
    const all = collectSeedFailures([...CENSUS, ...WIDE, ...THIRTY], (seed) => {
      if (FORGE_IDLE.includes(seed)) return;
      if (metalShareOf(town(seed)).includes(twin)) elsewhere.push(seed);
    });
    expectNoSeedFailures(all, 'every town is born and read');
    expect(elsewhere, 'the twin prints in no other town of the three populations (measured at the cure)').toEqual([]);
  }, 1_800_000);

  test('(d) N4: the owner\'s page and the shared page read the cards, the lists and the metal share alike', () => {
    /** @type {string[]} */
    const found = [];
    const failures = collectSeedFailures([...CENSUS, ...WIDE, ...THIRTY], (seed) => {
      const s = town(seed);
      const a = readingOf(s);
      if (readingOf(toPublicSafe(structuredClone(s))) !== a) found.push(`${seed} · public`);
      if (readingOf(projectShareVeil(toPublicSafe(structuredClone(s)), null)) !== a) found.push(`${seed} · the share veil`);
    });
    expectNoSeedFailures(failures, 'every town is born and read');
    expect(found).toEqual([]);
    const rendered = collectSeedFailures([...SEVENTEEN.slice(0, 3), ...ON_ITS_ONLY_SPENT_GROUND, ...FORGE_IDLE], (seed) => {
      const s = town(seed);
      expect(cardsOnTab(projectShareVeil(toPublicSafe(structuredClone(s)), null), { publicDossier: true, playerView: true }), `${seed}: the shared tab's cards`)
        .toEqual(cardsOnTab(s, { playerView: true }));
    });
    expectNoSeedFailures(rendered, 'the rendered anchors');
  }, 1_800_000);
});

/** The Economics tab's text. @param {any} s @param {Record<string, unknown>} [props] */
function textOnTab(s, props = {}) {
  const { container, unmount } = render(<EconomicsTab settlement={s} narrativeNote={null} {...props} />);
  const text = (container.textContent || '').replace(/\s+/g, ' ');
  unmount();
  return text;
}

/** Each chain card's text on the rendered tab, by its "Via" label's card. @param {any} s @param {Record<string, unknown>} [props] */
function cardsOnTab(s, props = {}) {
  const { container, unmount } = render(<EconomicsTab settlement={s} narrativeNote={null} {...props} />);
  const cards = [...container.querySelectorAll('div')].filter((d) => d.textContent === 'Via')
    .map((d) => (d.parentElement?.parentElement?.parentElement?.textContent || '').replace(/\s+/g, ' ').trim());
  unmount();
  return cards;
}

/** The "Via" text of the rendered card whose title is `label`, or null. @param {any} s @param {string} label */
function viaOnTab(s, label) {
  const { container, unmount } = render(<EconomicsTab settlement={s} narrativeNote={null} />);
  let via = null;
  for (const d of [...container.querySelectorAll('div')].filter((x) => x.textContent === 'Via')) {
    const card = d.parentElement?.parentElement?.parentElement;
    const title = card?.querySelector('span[style*="font-weight: 700"]')?.textContent || '';
    if (title === label) { via = d.nextElementSibling?.textContent ?? ''; break; }
  }
  unmount();
  return via;
}
