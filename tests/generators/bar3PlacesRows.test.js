/**
 * tests/generators/bar3PlacesRows.test.js — BAR3-PLACES (REVIEW-BAR-3 and the wide read, 2026-11-15; the seat's directions
 * H1-H4 and H6): the rows of the seat's four groups, cured at their writers and read on births (the census's own seeds and
 * the readers' towns, born as the census bears them, CENSUS-3 seedcfg.mjs). Each CURED row names the line that must no
 * longer print in that town AND what prints in its place (asserted first); each KEEP row is a true sibling that must still
 * print. Every CURED row was red at the base (59185b62a): that seed's record held the old line.
 *
 * - H2 the crown (stressTypes.js, stressNarrative.js, narrativeData.js, narrativeText.js, crisisSummaryVantage.js): the war's
 *   lines name no crown and no kingdom (a city-state at war answers to no higher lord); the army's officers instead.
 * - H1 the arrival and the crisis (arrivalProse.js, narrativeData.js, stressInstitutionEffects.js): no runner out of a shut
 *   gate, no herd on the road and no lanes of stalls under a siege, no broker of far goods where no market stands, no wine
 *   shop, no cloth in every yard, no living from the ground claimed, no covert grain route under a siege (its twin).
 * - H3 the history (historyGenerator.js): no trade list's mark inside history prose; a trade collapse at the founding takes
 *   its founding twin.
 * - H4 the houses (institutionDescVariants.js, institutionalCatalog.js, supplyChainData.js): no beer sent across the region,
 *   no seigniorage revenue claimed, no royal charter, no northern furs.
 * - H6 the tensions (narrativeText.js, narrativeGenerator.js): no one kind of tension, no stability, no power over the seat.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { CRISIS_SUMMARY_POOLS } from '../../src/domain/crisis/crisisSummaryVantage.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';
import { presumptionFindings } from '../../src/domain/facts/presumptionCheck.js';
import { TROUBLE_HOOKS } from '../../src/data/troubleHooks.js';
import { ARRIVAL_PEOPLE, ARRIVAL_SENSES } from '../../src/data/arrivalProse.js';
import { textOf } from '../../src/domain/facts/textOf.js';

/**
 * RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): "what prints instead" on an
 * arrival slot, COMPUTED from the slot's own pool export, never quoted: any of its lines but the flagged words (`{name}` any name).
 * The reader's town stays the guard town; the slot is shown live whichever of its lines the draw lands on.
 * @param {ReadonlyArray<any>} pool @param {RegExp} gone @returns {RegExp}
 */
const slotOf = (pool, gone) => new RegExp(pool.map((l) => { const t = textOf(l); return String(typeof t === 'function' ? t('@@NAME@@') : t); })
  .filter((t) => !gone.test(t)).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').split('@@NAME@@').join('[^"]+?')).join('|'));

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own configuration for its two seed families (CENSUS-3 seedcfg.mjs, r2r- and r2s-). @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  // the bar's own read (REVIEW-BAR-0 render.bar0.jsx's cfgFor, its bar0- arm, as CENSUS-3 seedcfg.mjs copies it)
  m = seed.match(/^bar0-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/);
  if (m) {
    const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
  }
  m = /** @type {RegExpMatchArray} */ (seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/));
  return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
};
/** @type {Map<string, any>} */
const births = new Map();
/** @param {string} seed @returns {any} */
const born = (seed) => {
  if (!births.has(seed)) births.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return births.get(seed);
};
/** Every string the record holds, joined (the rows below live in several fields: origin, arrival, foodways, houses). @param {string} seed */
const textOfRecord = (seed) => JSON.stringify(born(seed));

describe('BAR3-PLACES: the rows read the town', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  /** [row, seed, must not print, what prints instead] */
  const CURED = /** @type {Array<[string, string, RegExp, RegExp]>} */ ([
    ['C8742 no crown officer', 'r2r-hamlet-5', /A crown officer has arrived/, /An army requisition officer has arrived with orders/],
    ['C8717 no kingdom (profit)', 'r2s-wartime-village-0', /is in a kingdom at war/, /is at war and doing well out of it/],
    ['C8717 class: no kingdom (loss)', 'r2r-hamlet-53', /is in a kingdom fighting/, /is fighting a war it may not win/],
    ['C8717 class: no crown requisition', 'r2r-hamlet-53', /on crown requisition/, /Supply caravans pass through on army requisition\./],
    ['H2 class: no crown receipts', 'r2r-hamlet-5', /when the crown returns them/, /the receipts do not say when the army returns them\./],
    ['H2 class: no crown colours', 'r2s-wartime-town-0', /clerk in crown colours/, /a clerk with an army seal records what comes and goes\. This is a war.s traffic, not trade.s\./],
    ['H2 class: no crown paying', 'r2s-wartime-city-1', /the crown is paying/, /and the war chest is paying\./],
    ['C4391 no runner out of a shut gate', 'r2s-under_siege-metropolis-2', /A runner comes out of the small side gate/, /A face shows at the grille of the small side gate, sees your group, and is gone\./],
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): the anchor was the line then drawn on the slot; the reader's
    // town keeps the guard, the slot computed from its pool's export (`slotOf`)
    ['C30302 no wine shop', 'r2r-city-3', /at a wine shop/, slotOf(ARRIVAL_PEOPLE.greek, /at a wine shop/)],
    ['C2300 not every yard', 'r2r-city-20', /across every yard/, /Bolts of cloth hang drying in long bright strips across the yards\./],
    // BAR4-SCENES-2 (2026-11-16, re-keyed by identity; the chair's ruling HW1): r2r-city-18's one stone house, its every ground spent, is
    // "Short of stone." on the page, so the living-from-the-ground line takes its twin on the slot; the flagged words stay out
    ['C0013 no living from the ground', 'r2r-city-18', /lives on what comes out of the ground/, /living used to come out of the ground, and the workings stand quiet now\./],
    ['C53735 no press of the lane', 'r2r-hamlet-20', /press of the lane/, /The smell of incense drifts out into the lane\./],
    ['C35876 no export decisions', 'r2r-city-44', /caused by export decisions/, /the famine was made worse by decisions taken by/],
    ['C29348 no beer across the region', 'r2r-town-28', /sends beer across the region/, /It keeps the taverns stocked, and stands among the larger buyers/],
    ['C29348 class: no wider region', 'r2r-town-18', /and the wider region\. It eats grain/, /supplying the town's taverns\. It eats grain/],
    ['C13819 no seigniorage revenue claimed', 'r2r-city-13', /Significant ongoing revenue via seigniorage/, /Its seigniorage is revenue while precious metal reaches the dies\./],
    ['H2/H4 class: no royal charter', 'r2r-town-1', /Requires noble or royal charter/, /under the charter of whoever rules\. Revenue for the granting authority while metal comes in\./],
    ['C14378 no northern furs', 'r2r-city-0', /Furs originate in frontier/, /Furs travel from the hunting grounds through trading posts/],
    ['C15699 no trade built upon at the founding', 'r2s-succession_void-hamlet-2', /was built upon failed|what it was collapsed|depended on failed/, /The trade the settlement was founded to serve failed within its first few years/],
    ['C24238 no one kind of tension', 'r2r-city-36', /The tensions here are the domestic kind/, /Beside whatever else divides it, its oldest quarrels are the domestic kind/],
    ['C24620 no stability claimed', 'r2r-city-18', /Stable enough that its tensions/, /Its oldest tensions are the slow kind/],
    // BAR3-CLOSE-SWEEP-A (2026-11-15): re-keyed by identity from r2r-town-8, whose theocratic note the defecon branch's
    // declared cure withdraws (7a4b48a84, BAR3-DEFECON-HANDBACK `flags.theocraticEconomy`: its tithes row, 12%, is not
    // the income record's largest); r2r-town-54 (a Strong Feudal Appointee beside Strong Religious Authorities) is the
    // one town of the census's 720 that still prints the note (BAR3-DEFECON-2-HANDBACK: 16 -> 1)
    ['C18651 no power over the seat', 'r2r-town-54', /holds more practical power than whoever holds the official seat/, /has a say the official seat must reckon with/],
    ['C5938 no grain by a covert route under a siege', 'bar0-city-under_siege+famine-rand-8', /through a covert route/, /before the siege closed the roads, and is selling it at triple the official price after dark/],
    ['C8742 the sovereign city: no crown officer', 'bar0-city-wartime-rand-7', /A crown officer has arrived/, /An army requisition officer has arrived with orders/],
    ['C8717 the sovereign city: no kingdom', 'bar0-city-wartime-rand-7', /is in a kingdom/, /is at war and doing well out of it/],
    ['C34091 the sovereign city: no kingdom', 'bar0-city-wartime-rand-13', /is in a kingdom/, /is at war and doing well out of it/],
    ['C31794 no trade mark inside the history', 'bar0-town-occupied-rand-7', /\(taxed by occupation\) and property/, /A speculative frenzy in [^"(]*(\([a-z]+\) )?and property collapsed/],
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): the anchor was the line then drawn on the slot; the reader's
    // town keeps the guard, the slot computed from its pool's export (`slotOf`)
    ['C30302 no wine shop (the town read)', 'bar0-town-occupied-rand-7', /at a wine shop/, slotOf(ARRIVAL_PEOPLE.greek, /at a wine shop/)],
    ['C30299 no busy streets under the occupation', 'bar0-town-occupied-rand-7', /the streets are busy/, /The market is open, the streets are orderly/],
    ['C15699 no trade built upon at the founding (the town read)', 'bar0-hamlet-under_siege-rand-8', /was built upon failed/, /The trade the settlement was founded to serve failed within its first few years/],
    ['C4391 no runner out of a shut gate (the town read)', 'bar0-city-under_siege+famine-rand-12', /A runner comes out of the small side gate/, /A face shows at the grille of the small side gate/],
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): the anchor was the line then drawn on the slot; the reader's
    // town keeps the guard, the slot computed from its pool's export (`slotOf`)
    ['C13758 no herd across the road under a siege', 'bar0-hamlet-under_siege-rand-6', /A dog drives a handful/, slotOf(/** @type {any} */ (ARRIVAL_SENSES.find((s) => s.key === 'livestock')).lines, /A dog drives a handful/)],
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): the anchor was the line then drawn on the slot; the reader's
    // town keeps the guard, the slot computed from its pool's export (`slotOf`)
    ['C13759 no lanes of stalls in a besieged hamlet', 'bar0-hamlet-under_siege-rand-6', /Each lane of stalls/, slotOf(ARRIVAL_PEOPLE.south_asian, /Each lane of stalls/)],
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): the anchor was the line then drawn on the slot; the reader's
    // town keeps the guard, the slot computed from its pool's export (`slotOf`)
    ['C24627 no broker of far goods with no market', 'bar0-thorp-calm-rand-7', /matching buyers to goods from routes/, slotOf(ARRIVAL_PEOPLE.arabic, /matching buyers to goods from routes/)],
  ]);
  it('the flagged line no longer prints, and its slot says what the record bears (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([id, seed, gone, instead]) => {
      const text = textOfRecord(seed);
      expect(text, `${id} ${seed}: what prints instead`).toMatch(instead);
      expect(text, `${id} ${seed}: the flagged line`).not.toMatch(gone); // anchored: the line above asserts the slot printed
    }), 'the flagged line no longer prints');
  });

  /** [row, seed, the true sibling that must still print] */
  const KEEP = /** @type {Array<[string, string, RegExp]>} */ ([
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-hamlet-18 -> r2r-thorp-79, a calm census thorp
    ['H1: the herd on the road where no siege stands', 'r2r-thorp-79', /A dog drives a handful of animals across the road, and you wait for them\./],
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-city-32 -> r2r-town-4, a south-asian market town
    ['H1: the lanes of stalls in a market town', 'r2r-town-4', /Each lane of stalls has someone who speaks for it, and they are all speaking at once\./],
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2s-monster_pressure-city-0 -> r2r-metropolis-62, an arabic market town
    // with a road open (tailHistoryBatch4.test.js's KEEP takes the same address)
    ['H1: the broker of far goods where a market stands', 'r2r-metropolis-62', /A broker sits in the shade, matching buyers to goods from routes you have never travelled\./],
    ['H1: the covert grain route where no siege stands', 'r2r-city-44', /through a covert route and selling them at triple the official price after dark/],
  ]);
  it('the true siblings still print (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([id, seed, kept]) => {
      expect(textOfRecord(seed), `${id} ${seed}`).toMatch(kept);
    }), 'the true siblings still print');
  });

  it('H2: the wartime vantage pools name no crown and no kingdom (the page-only lines; every surface)', () => {
    const lines = Object.values(CRISIS_SUMMARY_POOLS.wartime).flatMap((col) => Object.values(col));
    expect(lines.length).toBeGreaterThan(10);
    expect(lines.filter((l) => /\b(crown|kingdom)/i.test(String(l)))).toEqual([]);
    expect(lines).toContain('On the roads near {name} you meet army carts and the army\'s officers, and give way to both.');
  });
});

/**
 * BAR3-PLACES-2 batch 1 (2026-11-15; the rows routed to the seat after its first holder's last turn), each red at the
 * merged line (f1a55f558, the line at 52f0a1684 merged): C6485 the profiteer's empty slot (crisisCast.js) says only what
 * the cast bears; C24313 the household elder's late twins (institutionDescVariants.js) claim no "no office, no title"
 * under the council that governs; C4510 the famine hook (stressTypes.js) names no good its holder may lack; C36830 the war's
 * profit text (stressNarrative.js) claims no merchants getting rich (the merchant power the war hurts).
 * BAR3-CLOSE-SWEEP-B (2026-11-16, letter d): C6485's new line is reworded in the style law's form ("no one on the roster
 * is named" -> "no one is named for it": the struck phrase "on the roster"); its towns and its truth unchanged.
 */
describe('BAR3-PLACES-2: the routed rows read the town', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  /** [row, seed, must not print, what prints instead] */
  const CURED = /** @type {Array<[string, string, RegExp, RegExp]>} */ ([
    ['C6485 the profiteer under the war (the read town)', 'bar0-city-wartime-rand-6', /"role":"profiteer","reason":"no power gains"/, /"role":"profiteer","reason":"no one is named for it"/],
    ['C6485 the profiteer under the war (a thorp)', 'r2r-thorp-11', /"role":"profiteer","reason":"no power gains"/, /"role":"profiteer","reason":"no one is named for it"/],
    ['C6485 the profiteer beside a power the contracts made rich', 'r2s-wartime-metropolis-0', /"role":"profiteer","reason":"no power gains"/, /"role":"profiteer","reason":"no one is named for it"/],
    ['C6485 class: the profiteer under a debt', 'r2s-indebted-city-2', /"role":"profiteer","reason":"no power gains"/, /"role":"profiteer","reason":"no one is named for it"/],
    ['C24313 no office, no title, no vote under a council (the read town)', 'bar0-thorp-calm-rand-6', /No office, no title, no vote/, /A single household head is the door people knock on first when a thing has to be settled\."/],
    ['C24313 under the Elder Council', 'r2r-thorp-2', /No office, no title, no vote/, /A single household head is the door people knock on first when a thing has to be settled\."/],
    ['C24313 under the Household Council', 'r2s-succession_void-thorp-2', /No office, no title, no vote/, /A single household head is the door people knock on first when a thing has to be settled\."/],
    ['C24313 class: no title under a council', 'r2r-thorp-28', /No formal appointment, no title/, /One household head is the person everyone goes to first when something needs deciding\."/],
    ['C4510 no food named for the fishmonger of a failed fishery', 'r2s-famine-city-0', /A grain merchant has food, enough to matter/, /A grain merchant has stores laid in before the shortage, enough to matter\./],
    ['C4510 (a metropolis)', 'r2s-famine-metropolis-1', /A grain merchant has food, enough to matter/, /A grain merchant has stores laid in before the shortage, enough to matter\./],
    ['C4510 class: the miller', 'r2s-famine-village-2', /A grain merchant has food, enough to matter/, /A grain merchant has stores laid in before the shortage, enough to matter\./],
    ['C36830 no merchants getting rich beside a merchant power the war hurts', 'r2s-wartime-village-0', /merchants with the right friends/, /and those with the right friends are getting rich\./],
    ['C36830 (the read city)', 'bar0-city-wartime-rand-14', /merchants with the right friends/, /and those with the right friends are getting rich\./],
    ['C36830 class: a metropolis', 'r2s-wartime-metropolis-0', /merchants with the right friends/, /and those with the right friends are getting rich\./],
  ]);
  it('the flagged line no longer prints, and its slot says what the record bears (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([id, seed, gone, instead]) => {
      const text = textOfRecord(seed);
      expect(text, `${id} ${seed}: what prints instead`).toMatch(instead);
      expect(text, `${id} ${seed}: the flagged line`).not.toMatch(gone); // anchored: the line above asserts the slot printed
    }), 'the flagged line no longer prints');
  });

  /** [row, seed, the true sibling that must still print] */
  const KEEP = /** @type {Array<[string, string, RegExp]>} */ ([
    ['C6485: the exploiter of a natural crisis keeps its own absence', 'r2r-thorp-38', /"role":"exploiter","reason":"no power gains"/],
    ['C24313: the habit twin stands under a council', 'r2r-thorp-5', /One head of household is heard first on the settlement's common matters, out of habit and with no appointment\. Nobody named them to it\."/],
    ['C4510: the mill-less famine keeps its own twin', 'r2r-thorp-17', /Someone here still has food put by, enough to matter\./],
  ]);
  it('the true siblings still print (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([id, seed, kept]) => {
      expect(textOfRecord(seed), `${id} ${seed}`).toMatch(kept);
    }), 'the true siblings still print');
  });
});

/**
 * BAR3-PLACES-2 batch 2 (2026-11-15; the first holder's "left", items 3 and 4), each red at the line before it (batch 1's
 * tree): C30340 the river origin (settlementOriginProse.js) says where the place stands, not why it was founded; C34042 the
 * war going the town's way (narrativeText.js) names the army's contracts, no trade that "has never paid better"; C36357's
 * measure, the foodways' one-source frames (foodways.js) claim the place's own food, not "most meals" nor the whole table.
 */
describe('BAR3-PLACES-2 batch 2: the origin, the war and the table read the town', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  /** [row, seed, must not print, what prints instead] */
  const CURED = /** @type {Array<[string, string, RegExp, RegExp]>} */ ([
    ['C30340 no founding cause on the bank (the read town)', 'bar0-town-occupied-rand-7', /Founded on the bank, where the current/, /It stands on the bank, and the current does the hauling/],
    ['C30340 (a thorp)', 'r2r-thorp-41', /Founded on the bank, where the current/, /It stands on the bank, and the current does the hauling/],
    ['C30340 (a city at war)', 'r2s-wartime-city-3', /Founded on the bank, where the current/, /It stands on the bank, and the current does the hauling/],
    ['C34042 no trade that never paid better (the read city)', 'bar0-city-wartime-rand-13', /trade has never paid better/, /(running day and night on the army's contracts|lives on the army's contracts), and the place now needs the war/],
    ['C34042 (a village)', 'r2s-wartime-village-0', /trade has never paid better/, /(running day and night on the army's contracts|lives on the army's contracts), and the place now needs the war/],
    ['C34042 (a metropolis)', 'r2s-wartime-metropolis-0', /trade has never paid better/, /(running day and night on the army's contracts|lives on the army's contracts), and the place now needs the war/],
    ['C36357 class: not most meals where its own food is under half (a besieged thorp)', 'r2s-under_siege-thorp-0', /"foodwaysLine":"Most meals start from/, /"foodwaysLine":"Its own food is /],
    ['C36357 class: (a metropolis fed by magic)', 'r2s-under_siege-metropolis-1', /"foodwaysLine":"Most meals start from/, /"foodwaysLine":"Its own food is /],
    ['C36357 class: not the whole table (a village)', 'r2r-village-21', /"foodwaysLine":"The table rests on/, /"foodwaysLine":"What it puts on the table itself is /],
  ]);
  it('the flagged line no longer prints, and its slot says what the record bears (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([id, seed, gone, instead]) => {
      const text = textOfRecord(seed);
      expect(text, `${id} ${seed}: what prints instead`).toMatch(instead);
      expect(text, `${id} ${seed}: the flagged line`).not.toMatch(gone); // anchored: the line above asserts the slot printed
    }), 'the flagged line no longer prints');
  });

  /** [row, seed, the true sibling that must still print] */
  const KEEP = /** @type {Array<[string, string, RegExp]>} */ ([
    ['C30340: the river pool\'s first line stands', 'r2r-thorp-22', /Built along the river: water access shapes every economic decision\./],
    ['C36357: the two-source frame stands', 'r2r-thorp-12', /"foodwaysLine":"Bread from the home fields and the day's catch anchor the table\./],
  ]);
  it('the true siblings still print (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([id, seed, kept]) => {
      expect(textOfRecord(seed), `${id} ${seed}`).toMatch(kept);
    }), 'the true siblings still print');
  });
});

/**
 * BAR3-PLACES-3 (2026-11-15; the second holder's "left", items 1 and 2), each CURED row red at 808d2bb37: C54896 the Great
 * Harvest Compact's hook (historyGenerator.js) claims no shortage now (it printed "the current shortage" where the food
 * record holds none: 16 of 19 on the census's 720); C13868 the guild war's sabotage hook (historyData.js, both copies)
 * declares the guild "both guilds" presumes, so the birth's self-check re-reads it on the FINAL record. The read hamlet's
 * guild is a faction of the power structure when its history is written and gone by the end of its birth (a late write:
 * the declaration cannot refuse the line at the draw; the self-check now names it, and the late write is named for the chair).
 * THE SIEGE (the chair, 21:45 UTC): its description (stressTypes.js, stressTypesMeta.js) said "Field work and trade have stopped"
 * where the food record still grows a part (14 to 43 in a hundred) in all 31 siege towns of the 720: trade by road, gate and
 * water stops; a part is still produced. (The siege's food note in foodBalance.js is the economy seat's cure: the chair, 22:27 UTC.)
 */
describe('BAR3-PLACES-3: the compact and the guild war read the town', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  const GUILD_HOOKS = 'historyData:HISTORICAL_EVENTS_DATA.plotHooks:guild_conflict';
  const GUILD_POOL = 'troubleHooks:TROUBLE_HOOKS:guild_conflict'; // HOOKS-BUILD (2026-11-20): the live quarrel's hooks are its kind's pool
  /** The birth's own ledger and its self-check's findings on the final record, for the guild war's hooks. @param {string} seed */
  const guildHookCheck = (seed) => {
    /** @type {any[]} */
    const ledger = [];
    const { result } = withPresumptionLedger(() => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }), ledger);
    const mine = ledger.filter((e) => e.pool === GUILD_HOOKS || e.pool === GUILD_POOL);
    return { record: result, text: JSON.stringify(result), noted: mine, findings: presumptionFindings(result, mine) };
  };

  /** [row, seed, must not print, what prints instead] */
  const CURED = /** @type {Array<[string, string, RegExp, RegExp]>} */ ([
    ['C54896 no shortage claimed where the food record holds none (a secure hamlet)', 'r2r-hamlet-17', /the current shortage makes that clause valuable/, /first refusal on grain sales, and in a lean year that clause is worth fighting over/],
    ['the siege: no field work stopped where a part is still grown (a besieged town)', 'r2s-under_siege-town-0', /Field work and trade have stopped/, /Trade by road, gate and water has stopped, only part of the usual food is still produced here/],
  ]);
  it('the flagged line no longer prints, and its slot says what the record bears (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([id, seed, gone, instead]) => {
      const text = textOfRecord(seed);
      expect(text, `${id} ${seed}: what prints instead`).toMatch(instead);
      expect(text, `${id} ${seed}: the flagged line`).not.toMatch(gone); // anchored: the line above asserts the slot printed
    }), 'the flagged line no longer prints');
  });

  it("C13868: the read hamlet's sabotage hook declares the guild, and the self-check reads its absence on the final record", () => {
    const { text, findings } = guildHookCheck('bar0-hamlet-under_siege-rand-6');
    expect(text, 'the hook the reader met is on the record').toMatch(/Someone is sabotaging both guilds to destabilize the market for a third party/);
    expect(findings.map((f) => f.atom), 'the guild atom fails on the final record (a late write, named)').toContain('guild');
  });

  /** [row, seed, the true sibling that must still print] */
  const KEEP = /** @type {Array<[string, string, RegExp]>} */ ([
    ["C54896: the compact's other hook stands", 'r2r-hamlet-17', /The original compact was signed under duress; someone wants that history exposed/],
    ['the siege: its sibling, the famine\'s own description, stands', 'r2s-famine-village-0', /No one can earn a normal living while the famine lasts, and every coin goes on food\./],
  ]);
  it('the true siblings still print (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([id, seed, kept]) => {
      expect(textOfRecord(seed), `${id} ${seed}`).toMatch(kept);
    }), 'the true siblings still print');
  });

  // HOOKS-BUILD (PAGE-7, 2026-11-20): the live quarrel's hook copy went; its three hooks are the kind's pool's, and the
  // sabotage line stands in that pool with its guild declared. Red at the pool's landing as written before (the copy no
  // longer prints at r2r-town-0, by the pool's rank); the arm now reads the pool.
  it("C13868 KEEP: where two guilds stand the live quarrel's hooks are its pool's, drawn through the ledger, the sabotage line declares its guild, and every guild atom holds", () => {
    const { record, noted, findings } = guildHookCheck('r2r-town-0');
    const hooks = record.history?.currentTensions?.find((t) => t.type === 'guild_conflict')?.plotHooks || [];
    expect(hooks.length, "the live quarrel's three hooks").toBe(3);
    expect(hooks.filter((h) => !TROUBLE_HOOKS.guild_conflict.some((r) => r.text === h)), 'each a line of the pool').toEqual([]);
    expect(noted.filter((e) => e.pool === GUILD_POOL).length, 'each drawn through the ledger').toBe(3);
    expect(TROUBLE_HOOKS.guild_conflict.find((r) => r.text.startsWith('Someone is sabotaging both sides'))?.needs, 'the sabotage line declares its guild').toContain('guild');
    expect(findings.filter((f) => f.atom === 'guild'), 'every guild atom holds on the final record').toEqual([]);
  });
});
