/**
 * FAULTS-PEOPLE (BRIEF-FAULTS of 2026-11-18, the seat FAULTS-PEOPLE): the two faults on people's cards.
 *
 * 14e · A TRADE'S HOOK ON A SOLDIER. The economy pool's lines presume a trade (a shop, customers, a rival in business, a
 * batch); a crisis bias dealt them to garrison commanders, watch and militia captains (C5296: "They have evidence of
 * price-fixing across the whole market." on the garrison commander of bar0-city-under_siege+famine-rand-47). The fact is
 * the card's own house AND seats: a card whose house is a standing force's (a Defense house of the military's priority
 * that hires out for no coin) and that sits on no power of trade holds no line of the economy pool but the six true of
 * any holder (`npcData.js :: ECONOMY_HOOKS_TRUE_OF_ANY_HOLDER`), read after the seats land
 * (`people/personHooks.js :: truePersonHooks`). NEGATIVE: C5328 and C5358 (a castellan and a watch commander on the
 * merchant oligarchy) keep theirs; a mercenary company's captain keeps a customers line.
 *
 * FR5 · THE FISHMONGER'S TALK. "Talks about the boats, the catch and who has been in today; …" (the master fishmonger's
 * welcoming row) prints only where a catch is landed in the town (`trade at work: fish taken here`); where none is (the
 * fish bought in, or none comes) the row keeps its slot and prints its twin
 * (`titleSecretsPresentations.js :: TITLE_LINE_TWINS`, settled in `people/poolMap.js :: settleTitleLines`).
 *
 * The module's new exports are read off its namespace, so at the base (where they do not exist) each test fails on its
 * own assertion rather than the file on an import.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import * as NPC_DATA from '../../src/data/npcData.js';
import * as TITLE_LINES from '../../src/data/people/titleSecretsPresentations.js';
import { truePersonHooks } from '../../src/generators/people/personHooks.js';
import { settleTitleLines } from '../../src/generators/people/poolMap.js';
import { tradeAtWorkOf } from '../../src/domain/facts/tradeAtWork.js';
import { plotHookText } from '../../src/lib/proseSeams.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's seed shapes (PAGE-COPY `seedcfg.mjs`: the 720's `r2r-`/`r2s-` and the bar's `bar0-`) @param {string} seed */
function born(seed) {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-\\d+$`));
  let cfg;
  if (m) cfg = { ...DEFAULT_CONFIG, ...DIALS, settType: m[1] };
  else if ((m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-\\d+$`)))) cfg = { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  else if ((m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-\\d+$`)))) {
    cfg = { ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true };
  } else throw new Error(`no configuration for ${seed}`);
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

beforeAll(async () => { await loadGenerationLawPayloads(); });

// ── 14e ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
const anyHolder = () => /** @type {ReadonlySet<unknown> | undefined} */ (/** @type {any} */ (NPC_DATA).ECONOMY_HOOKS_TRUE_OF_ANY_HOLDER);
// the pool's rows not named true of any holder, as texts (the set holds the pool's own rows)
const tradeLines = () => new Set(NPC_DATA.NPC_FACTION_LOYALTY.economy.filter((l) => !(anyHolder()?.has(l))).map((l) => plotHookText(l).trim()));
const FOR_HIRE = new Set(['free_company_hall', 'mercenary_quarter', 'hireling_hall']);
/** the test's own reading of "keeps no trade" (the card's house and seats) @param {any} s @param {any} npc */
function keepsNoTrade(s, npc) {
  const house = (s.institutions || []).find((h) => h?.name === npc?.institution?.key);
  if (!house || house.category !== 'Defense' || house.priorityCategory !== 'military' || FOR_HIRE.has(house.catalogId)) return false;
  const kind = new Map((s.powerStructure?.factions || []).flatMap((f) => [f.name, f.faction].filter(Boolean).map((n) => [n, f.category])));
  return !(npc.memberships || []).some((m) => ['economy', 'crafts'].includes(kind.get(m?.power)));
}

// the towns where a trade's line stood on a soldier at the seat's base (every one of the 900 of the seat's populations)
const SOLDIER_TOWNS = [
  'r2r-hamlet-16', 'r2r-town-1', 'r2r-town-7', 'r2s-famine-village-1', 'r2s-famine-village-3', 'r2s-indebted-village-0',
  'r2s-indebted-town-0', 'r2s-indebted-city-3', 'r2s-mass_migration-town-0', 'r2s-mass_migration-city-0', 'r2s-mass_migration-city-3',
  'bar0-city-under_siege+famine-rand-47', 'bar0-city-under_siege+famine-rand-28', 'bar0-city-under_siege+famine-rand-29',
  'bar0-city-under_siege+famine-rand-32', 'bar0-city-under_siege+famine-rand-34', 'bar0-city-under_siege+famine-rand-36',
  'bar0-village-famine-rand-37', 'bar0-village-famine-rand-40', 'bar0-city-under_siege+famine-rand-40',
];

describe("FAULTS-PEOPLE 14e · a trade's hook is not dealt to a card that keeps no trade", () => {
  it('names the economy lines true of any holder (six), every one a line of the pool', () => {
    const set = anyHolder();
    expect(set, 'npcData.js :: ECONOMY_HOOKS_TRUE_OF_ANY_HOLDER').toBeInstanceOf(Set);
    expect(set?.size).toBe(6);
    const pool = NPC_DATA.NPC_FACTION_LOYALTY.economy;
    for (const row of set ?? []) expect(pool.includes(/** @type {any} */ (row)), plotHookText(row)).toBe(true);
    // a trade's own line is not among them (the pool's shop and its customers); a debt bought up is
    const named = new Set([...(set ?? [])].map((row) => plotHookText(row).trim()));
    expect(named.has('They have evidence of price-fixing across the whole market. Publishing it helps their competition as much as their customers.')).toBe(false);
    expect(named.has("Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in.")).toBe(true);
  });

  it('over the towns where it stood: no soldier who keeps no trade holds a trade line, and each keeps one hook', () => {
    const trade = tradeLines();
    let soldiers = 0;
    const failures = collectSeedFailures(SOLDIER_TOWNS, (seed) => {
      const s = born(seed);
      for (const n of s.npcs) {
        if (!keepsNoTrade(s, n)) continue;
        soldiers += 1;
        const hooks = (n.plotHooks || []).map((h) => plotHookText(h).trim());
        expect(hooks.length, `${seed}: ${n.name} (${n.role}) keeps one hook (R7: no card left without one)`).toBe(1);
        expect(trade.has(hooks[0]), `${seed}: ${n.name}, ${n.role} @ ${n.institution?.key} holds "${hooks[0]}"`).toBe(false);
      }
    });
    expectNoSeedFailures(failures, "a trade's hook on a soldier");
    expect(soldiers, 'liveness: the towns hold soldiers who keep no trade').toBeGreaterThan(SOLDIER_TOWNS.length);
  }, 600_000);

  it('NEGATIVE (C5328, C5358): a castellan and a watch commander on the merchant oligarchy keep their trade lines', () => {
    const s = born('bar0-city-under_siege+famine-rand-47');
    const hookOf = (/** @type {string} */ role) => plotHookText(s.npcs.find((n) => n.role === role)?.plotHooks?.[0]).trim();
    expect(hookOf('the castellan')).toBe("A business rival has offered them a partnership with terms so good it must be a trap. They can't find the trap.");
    expect(hookOf('the watch commander')).toBe('A buyer has paid them in advance for a whole season of goods, far above the price, and will not say what the goods are for.');
    // C5296 beside them: the garrison commander (one seat, the Garrison Bloc) no longer holds the market's price-fixing
    expect(hookOf('the garrison commander'), 'the garrison commander keeps one hook').not.toBe('');
    expect(hookOf('the garrison commander')).not.toMatch(/price-fixing/); // anchored: the card's one hook is pinned non-empty on the line above, beside its two siblings printed in full
  }, 120_000);

  /** a constructed record: one card of a house, its seats, its hook @param {any} house @param {string[]} seats @param {string} hook */
  const record = (house, seats, hook) => ({
    tier: 'town',
    institutions: [house, { name: 'Weekly market', category: 'Economy' }],
    powerStructure: { factions: [{ faction: 'Merchant guild', category: 'economy' }, { faction: 'War council', category: 'military' }] },
    npcs: [{ id: 'npc-1', name: 'Ada', title: 'the garrison commander', category: 'military', institution: { key: house.name }, memberships: seats.map((power) => ({ power })), plotHooks: [hook] }],
  });
  const GARRISON = { name: 'Garrison', category: 'Defense', priorityCategory: 'military', catalogId: 'garrison' };
  const COMPANY = { name: 'Free company hall', category: 'Defense', priorityCategory: 'military', catalogId: 'free_company_hall' };
  const SHOP = 'A lender has bought the note on their shop and wants it settled by the end of the month.';
  const DEBTS = "Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in.";

  it('a constructed garrison commander on no seat of trade: the shop line is refused and the card redraws a line that is no trade', () => {
    const out = truePersonHooks(/** @type {any} */ (record(GARRISON, ['War council'], SHOP)), 'none');
    const hook = plotHookText(out?.[0]?.plotHooks?.[0]).trim();
    expect(hook).not.toBe(SHOP);
    expect(hook).not.toBe('');
    expect(tradeLines().has(hook), hook).toBe(false);
  });

  it('NEGATIVES: a seat of trade, a company for hire, a line true of any holder: each keeps its hook', () => {
    const keep = (/** @type {any} */ r) => plotHookText(truePersonHooks(r, 'none')?.[0]?.plotHooks?.[0]).trim();
    expect(keep(record(GARRISON, ['War council', 'Merchant guild'], SHOP))).toBe(SHOP);
    expect(keep(record(COMPANY, ['War council'], SHOP))).toBe(SHOP);
    expect(keep(record(GARRISON, ['War council'], DEBTS))).toBe(DEBTS);
  });
});

// ── FR5 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
const FISHMONGER = 'the master fishmonger';
const WELCOMING = TITLE_LINES.TITLE_PRESENTATIONS[FISHMONGER].find((r) => r.disposition === 'welcoming');
const BOATS = 'Talks about the boats, the catch and who has been in today; a good ear for market news.';
const twinOf = () => /** @type {any} */ (TITLE_LINES).TITLE_LINE_TWINS?.presentation?.[WELCOMING?.impression ?? '']?.behaviour;

// the towns of the seat's populations where the welcoming row was dealt: no catch landed (the fish bought in, or none) and
// a catch landed (the town's own water)
const FISH_TOWNS = [
  'r2r-town-29', 'r2r-metropolis-28', 'r2r-metropolis-45', 'r2r-metropolis-58', 'r2s-recently_betrayed-city-2',
  'r2s-monster_pressure-city-3', 'r2s-slave_revolt-town-0', 'bar0-town-occupied-rand-45', 'bar0-metropolis-calm-rand-45',
  'bar0-village-calm-rand-47',
  'r2r-village-2', 'r2r-town-15', 'r2r-city-55', 'r2r-metropolis-8', 'bar0-city-under_siege+famine-rand-45', 'bar0-village-calm-rand-32',
];

describe("FAULTS-PEOPLE FR5 · the fishmonger talks of the boats and the catch only where a catch is landed", () => {
  it("the row's twin is written for the welcoming row, and names no boat and no catch", () => {
    expect(WELCOMING?.behaviour).toBe(BOATS);
    const twin = twinOf();
    expect(typeof twin, 'titleSecretsPresentations.js :: TITLE_LINE_TWINS').toBe('string');
    expect(twin).not.toMatch(/\bboats?\b|\bcatch\b/); // anchored: the twin is pinned a string on the line above, and the row it twins is pinned to the boats two lines up
  });

  it('over the towns where the row was dealt: the boats where the catch is landed, the twin where it is not', () => {
    const arms = { landed: 0, none: 0 };
    const failures = collectSeedFailures(FISH_TOWNS, (seed) => {
      const s = born(seed);
      const card = s.npcs.find((n) => n.title === FISHMONGER && n.presentation?.impression === WELCOMING?.impression);
      expect(card, `${seed}: the master fishmonger's welcoming row`).toBeTruthy();
      const landed = tradeAtWorkOf(s, 'fish taken here');
      expect(typeof landed, `${seed}: the catch is answered`).toBe('boolean');
      if (landed) { arms.landed += 1; expect(card?.presentation?.behaviour, `${seed}: a catch is landed`).toBe(BOATS); }
      else { arms.none += 1; expect(card?.presentation?.behaviour, `${seed}: no catch is landed`).toBe(twinOf()); }
      expect(card?.presentation?.disposition, `${seed}: the row keeps its slot`).toBe('welcoming');
    });
    expectNoSeedFailures(failures, "the fishmonger's talk");
    expect(arms.landed, 'liveness: a town that lands its catch').toBeGreaterThan(0);
    expect(arms.none, 'liveness: a town that lands none').toBeGreaterThan(0);
  }, 600_000);

  /** a constructed town whose catch is landed or not @param {boolean | undefined} landed */
  const town = (landed) => ({ facts: /** @type {any} */ ({ water: { navigable: true }, tradeAtWork: (/** @type {string} */ k) => (k === 'fish taken here' ? landed : undefined) }), boundaries: {}, held: null });

  it('settleTitleLines on a constructed card: the twin in the slot where no catch is landed; the boats where it is', () => {
    const none = settleTitleLines({ presentation: { ...WELCOMING } }, FISHMONGER, town(false));
    expect(none.presentation).toEqual({ ...WELCOMING, behaviour: twinOf() });
    const landed = settleTitleLines({ presentation: { ...WELCOMING } }, FISHMONGER, town(true));
    expect(landed.presentation).toEqual({ ...WELCOMING });
  });

  it("NEGATIVES: the fishmonger's other rows, and another title's row, are untouched where no catch is landed", () => {
    for (const row of TITLE_LINES.TITLE_PRESENTATIONS[FISHMONGER].filter((r) => r !== WELCOMING)) {
      expect(settleTitleLines({ presentation: { ...row } }, FISHMONGER, town(false)).presentation).toEqual({ ...row });
    }
    const plain = TITLE_LINES.TITLE_PRESENTATIONS['the fishmonger'].find((r) => r.disposition === 'welcoming');
    expect(settleTitleLines({ presentation: { ...plain } }, 'the fishmonger', town(false)).presentation).toEqual({ ...plain });
  });
});
