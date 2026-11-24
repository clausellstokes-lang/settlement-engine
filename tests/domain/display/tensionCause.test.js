/**
 * PAGE-7, CAUSES-DATA (the brief at 9e4ba24b6, rules 3, 4, 6 and 7's third arm; the chair's rulings of 15:18):
 * `src/domain/display/tensionCause.js :: tensionCauseSentenceOf`, through `tensionCauseHolds.js`.
 *   - THE KEY (a security rule): the same document with its seed deleted prints the same sentences;
 *   - null for a kind with no table;
 *   - THE PICK, as measured: the rank-1 causes that hold, by keyed hash on `<name>::held::<kind>`; only if none, rank 2;
 *     else plain; the wording by keyed hash on `<name>::cause::<kind>`. Every expected sentence is COMPUTED from the data
 *     file and `pickVariant` (`tests/helpers/drawnProse.js`'s way), never quoted;
 *   - `{power}`: a cause whose wordings hold it does not hold where the sides table's fill cannot fill it (not built at
 *     9e4ba24b6: it never holds), and no sentence ever prints the slot;
 *   - a custom house named "Black Market Tavern" does not print the black market's line; a ruined black market does not.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { pickVariant } from '../../../src/kernel/proseHash.js';
import { TENSION_CAUSES } from '../../../src/data/tensionCauses.js';
import { TENSION_CAUSE_HOLDS } from '../../../src/domain/display/tensionCauseHolds.js';
import { POWER_SLOT, tensionCauseSentenceOf } from '../../../src/domain/display/tensionCause.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOf } from '../../../src/domain/facts/factVocabulary.js';
import { solePowerNameOf } from '../../../src/data/tensionSidePower.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { toPublicSafe } from '../../../src/domain/display/publicSafe.js';
import { orderForceOf } from '../../../src/domain/facts/orderForce.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** @type {Array<[string, any]>} */ let births = [];

beforeAll(async () => {
  const { generateSettlementPipeline } = await import('../../../src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import('../../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../../src/store/configSlice.js');
  await loadGenerationLawPayloads();
  births = SIZES.flatMap((size) => [0, 1, 2].map((i) => {
    const seed = `hxd-${size}-${i}`;
    return /** @type {[string, any]} */ ([seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} })]);
  }));
}, 120000);

/** The measure's pick, spelled independently from the data file (sim.mjs's loop). @param {any} record @param {string} kind */
const expectedOf = (record, kind) => {
  const table = TENSION_CAUSES[kind];
  const facts = factsOf(record);
  if (kind === 'guild_conflict' && facts.guild === false) return { cause: 'withoutItsHouse', sentence: table.withoutItsHouse.text };
  const held = table.causes.filter((c) => TENSION_CAUSE_HOLDS[c.holds](record, facts) && (!c.power || solePowerNameOf(record, c.power) !== null));
  const r1 = held.filter((c) => c.rank === 1);
  const tier = r1.length ? r1 : held.filter((c) => c.rank === 2);
  const name = String(record?.name ?? '');
  const cause = tier.length ? pickVariant(tier, `${name}::held::${kind}`) : undefined;
  const text = /** @type {any} */ (pickVariant(cause ? cause.wordings : table.plain, `${name}::cause::${kind}`)).text;
  return { cause: cause ? cause.id : 'plain', sentence: cause?.power ? text.split('{power}').join(solePowerNameOf(record, cause.power, text.startsWith('{power}'))) : text };
};

/** @param {any} record */
const sentencesOf = (record) => (record.history?.currentTensions || []).map((/** @type {any} */ t) => tensionCauseSentenceOf(record, t));

describe('the key: the town\'s name and the trouble\'s kind, never the seed', () => {
  it('the same document with its seed deleted prints the same sentences', () => {
    let tables = 0;
    const failures = collectSeedFailures(births, ([seed, record]) => {
      const shared = structuredClone(record);
      delete shared._seed;
      delete shared._config;
      expect(shared._seed, seed).toBeUndefined();
      const own = sentencesOf(record);
      expect(sentencesOf(shared), seed).toEqual(own);
      tables += own.filter((/** @type {unknown} */ x) => x !== null).length;
    });
    expectNoSeedFailures(failures, 'seed deleted, same sentences');
    expect(tables).toBeGreaterThan(0);
  });
  it('a different seed under the same name and the same facts prints the same sentence', () => {
    const base = { name: 'Ashford', institutions: [{ name: 'Black market' }, { name: 'Town watch' }, { name: 'Garrison' }], powerStructure: { factions: [] } };
    const one = tensionCauseSentenceOf({ ...base, _seed: 'a-seed' }, { type: 'crime_wave' });
    for (const s of ['another-seed', 'hxd-city-7', '']) expect(tensionCauseSentenceOf({ ...base, _seed: s }, { type: 'crime_wave' })).toBe(one);
  });
});

describe('the declared draw (addendum 3): every line a cause can print is admitted wherever the cause holds', () => {
  it('on every born town, every wording of every cause that holds, every guild line and withoutItsHouse, admits', () => {
    let checked = 0;
    const failures = collectSeedFailures(births, ([seed, record]) => {
      const facts = factsOf(record);
      const bad = [];
      for (const [kind, table] of Object.entries(TENSION_CAUSES)) {
        const held = table.causes.filter((c) => TENSION_CAUSE_HOLDS[c.holds](record, facts));
        const lines = [...held.flatMap((c) => c.wordings), ...table.plain];
        const t = /** @type {any} */ (table);
        if (t.withoutItsHouse && facts.guild === false) lines.splice(0, lines.length, t.withoutItsHouse);
        for (const l of lines) { checked++; const v = declarationAdmits(declarationOf(l), facts); if (!v.admitted) bad.push(`${kind}: ${l.text} — ${JSON.stringify(v.refused)}`); }
      }
      expect(bad, seed).toEqual([]);
    });
    expectNoSeedFailures(failures, 'declared lines admitted where they can print');
    expect(checked).toBeGreaterThan(births.length * 8);
  });
});

describe('a kind with no table', () => {
  it('reads null', () => {
    const record = births[0][1];
    for (const type of ['generational_divide', 'popular_uprising', 'no_such_kind', '', undefined]) {
      expect(tensionCauseSentenceOf(record, { type })).toBeNull();
    }
    expect(tensionCauseSentenceOf(record, null)).toBeNull();
    expect(tensionCauseSentenceOf(record, { type: 'constructor' })).toBeNull();
  });
  it('every tension of a born town with a table prints a sentence of its kind; every other reads null', () => {
    const failures = collectSeedFailures(births, ([seed, record]) => {
      for (const t of record.history?.currentTensions || []) {
        const s = tensionCauseSentenceOf(record, t);
        if (!Object.hasOwn(TENSION_CAUSES, t.type)) { expect(s, `${seed} ${t.type}`).toBeNull(); continue; }
        const own = [...TENSION_CAUSES[t.type].causes.flatMap((c) => c.wordings), ...TENSION_CAUSES[t.type].plain, /** @type {any} */ (TENSION_CAUSES[t.type]).withoutItsHouse].filter(Boolean).map((l) => l.text);
        expect(own.some((w) => w === s || (w.includes('{power}') && new RegExp(`^${w.split('{power}').map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.+')}$`).test(String(s)))), `${seed} ${t.type}: ${s}`).toBe(true);
      }
    });
    expectNoSeedFailures(failures, 'every tension prints its own kind\'s sentence');
  });
});

describe('the pick, as measured', () => {
  it('on every born town and every kind of the table, the sentence is the measure\'s pick', () => {
    let n = 0;
    const failures = collectSeedFailures(births, ([seed, record]) => {
      for (const kind of Object.keys(TENSION_CAUSES)) {
        expect(tensionCauseSentenceOf(record, { type: kind }), `${seed} ${kind}`).toBe(expectedOf(record, kind).sentence);
        n++;
      }
    });
    expectNoSeedFailures(failures, 'the measure\'s pick');
    expect(n).toBe(births.length * 8);
  });
  it('rank 2 speaks only where no rank-1 cause holds; plain only where none holds', () => {
    // a kept, paid force and no criminal power: crime_wave's rank 1 holds nothing
    const bare = { name: 'Ashford', institutions: [{ name: 'Town watch' }, { name: 'Garrison' }], powerStructure: { factions: [] } };
    expect(expectedOf(bare, 'crime_wave').cause).toBe('plain');
    expect(tensionCauseSentenceOf(bare, { type: 'crime_wave' })).toBe(pickVariant(TENSION_CAUSES.crime_wave.plain, 'Ashford::cause::crime_wave')?.text);
    const market = { ...bare, institutions: [...bare.institutions, { name: 'Black market' }] };
    const bm = /** @type {any} */ (TENSION_CAUSES.crime_wave.causes.find((c) => c.id === 'black_market'));
    expect(tensionCauseSentenceOf(market, { type: 'crime_wave' })).toBe(pickVariant(bm.wordings, 'Ashford::cause::crime_wave').text);
    // no force kept: rank 1 (no_force) speaks over the black market
    const noForce = { ...market, institutions: [{ name: 'Black market' }] };
    const nf = /** @type {any} */ (TENSION_CAUSES.crime_wave.causes.find((c) => c.id === 'no_force'));
    expect(tensionCauseSentenceOf(noForce, { type: 'crime_wave' })).toBe(pickVariant(nf.wordings, 'Ashford::cause::crime_wave').text);
  });
});

describe('the guild quarrel without its guild (addendum 2, the chair\'s 15:35): read before the ranks', () => {
  it('hxd-hamlet-29, the one guildless guild quarrel of 900, prints withoutItsHouse and no cause or plain line', async () => {
    const { generateSettlementPipeline } = await import('../../../src/generators/generateSettlementPipeline.js');
    const { birthConfig } = await import('../../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../../src/store/configSlice.js');
    const record = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'hamlet' }), null, { seed: 'hxd-hamlet-29', customContent: {} });
    expect(factsOf(record).guild).toBe(false);
    const quarrel = (record.history?.currentTensions || []).find((/** @type {any} */ t) => t.type === 'guild_conflict');
    expect(quarrel).toBeTruthy();
    const table = /** @type {any} */ (TENSION_CAUSES.guild_conflict);
    expect(typeof table.withoutItsHouse.text).toBe('string');
    expect(tensionCauseSentenceOf(record, quarrel)).toBe(table.withoutItsHouse.text);
  });
  it('a guildless document never prints a guild cause or plain line, whatever holds; a guild restores the ranks', () => {
    const table = /** @type {any} */ (TENSION_CAUSES.guild_conflict);
    const guildless = { name: 'Ashford', institutions: [{ name: 'Annual fair' }, { name: 'Caravanserai' }], powerStructure: { factions: [{ faction: 'Merchant League', category: 'economy', isGoverning: true, powerLabel: 'Dominant' }] } };
    expect(factsOf(guildless).guild).toBe(false);
    expect(tensionCauseSentenceOf(guildless, { type: 'guild_conflict' })).toBe(table.withoutItsHouse.text);
    const withGuild = { ...guildless, powerStructure: { factions: [...guildless.powerStructure.factions, { faction: 'Weavers Guild', category: 'economy', powerLabel: 'Minor' }] } };
    expect(factsOf(withGuild).guild).toBe(true);
    expect(tensionCauseSentenceOf(withGuild, { type: 'guild_conflict' })).toBe(expectedOf(withGuild, 'guild_conflict').sentence);
    expect(tensionCauseSentenceOf(withGuild, { type: 'guild_conflict' })).not.toBe(table.withoutItsHouse.text);
  });
});

describe('{power}: filled only by the sides table\'s own fill', () => {
  const mr = /** @type {any} */ (TENSION_CAUSES.outside_debt.causes.find((c) => c.id === 'merchants_rule'));
  it('one economy power governing: merchants_rule holds and its slot takes that power\'s name as a sentence takes it', () => {
    const record = { name: 'Ashford', institutions: [], powerStructure: { factions: [{ faction: 'Merchant League', category: 'economy', isGoverning: true, powerLabel: 'Dominant' }] } };
    expect(TENSION_CAUSE_HOLDS.governedByTrade(record, factsOf(record))).toBe(true);
    const w = pickVariant(mr.wordings, 'Ashford::cause::outside_debt').text;
    expect(tensionCauseSentenceOf(record, { type: 'outside_debt' })).toBe(w.split(POWER_SLOT).join(/** @type {string} */ (solePowerNameOf(record, 'ruler'))));
  });
  it('two economy powers, one governing (addendum 4): merchants_rule holds and names the GOVERNING power', () => {
    const record = { name: 'Ashford', institutions: [], powerStructure: { factions: [{ faction: 'Merchant League', category: 'economy', isGoverning: true, powerLabel: 'Dominant' }, { faction: 'Weavers Guild', category: 'economy', powerLabel: 'Minor' }] } };
    expect(TENSION_CAUSE_HOLDS.governedByTrade(record, factsOf(record))).toBe(true);
    const w = pickVariant(mr.wordings, 'Ashford::cause::outside_debt').text;
    expect(tensionCauseSentenceOf(record, { type: 'outside_debt' })).toBe(w.split(POWER_SLOT).join(/** @type {string} */ (solePowerNameOf(record, 'ruler'))));
  });
  it('no sentence of any born town prints the slot', () => {
    const printed = births.flatMap(([, record]) => Object.keys(TENSION_CAUSES).map((kind) => String(tensionCauseSentenceOf(record, { type: kind }))));
    expect(printed.length).toBe(births.length * 8);
    expect(printed.filter((x) => x.includes(POWER_SLOT))).toEqual([]);
  });
});

describe('a house is matched by its catalogue identity on the live roster, never by a custom name', () => {
  const force = [{ name: 'Town watch' }, { name: 'Garrison' }];
  const blackMarketLines = /** @type {any} */ (TENSION_CAUSES.crime_wave.causes.find((c) => c.id === 'black_market')).wordings.map((/** @type {any} */ l) => l.text);
  it('a custom house named "Black Market Tavern" does not print the black market\'s line', () => {
    for (const extra of [{ isCustom: true }, { source: 'custom' }, {}]) {
      const record = { name: 'Ashford', institutions: [...force, { name: 'Black Market Tavern', ...extra }], powerStructure: { factions: [] } };
      const said = tensionCauseSentenceOf(record, { type: 'crime_wave' });
      expect(TENSION_CAUSES.crime_wave.plain.map((l) => l.text), JSON.stringify(extra)).toContain(said);
      expectAbsentWithAnchor(blackMarketLines, said, blackMarketLines[0], `custom house ${JSON.stringify(extra)}`);
    }
    const real = { name: 'Ashford', institutions: [...force, { name: 'Black market' }], powerStructure: { factions: [] } };
    expect(blackMarketLines).toContain(tensionCauseSentenceOf(real, { type: 'crime_wave' }));
  });
  it('a ruined black market does not print the black market\'s line', () => {
    const record = { name: 'Ashford', institutions: [...force, { name: 'Black market', status: 'ruined' }], powerStructure: { factions: [] } };
    const said = tensionCauseSentenceOf(record, { type: 'crime_wave' });
    expect(TENSION_CAUSES.crime_wave.plain.map((l) => l.text)).toContain(said);
    expectAbsentWithAnchor(blackMarketLines, said, blackMarketLines[0], 'a ruined black market');
  });
});

// CAUSES-PARITY B (PAGE-10, the chair's NOT-EXACT branch: measures/page-10/parity/paycut.mjs found payCut's served restatement
// differs at 14 of 900): force_unpaid_or_cut holds on its SERVED arms alone (volunteers, pay short or unpaid), never on
// `orderForce.payCut`, which reads `npcs[].settlementCondition` (no shared read serves it).
describe('force_unpaid_or_cut holds on its served arms alone (CAUSES-PARITY B)', () => {
  const ROW = /** @type {any} */ (TENSION_CAUSES.crime_wave.causes.find((c) => c.id === 'force_unpaid_or_cut'));
  /** a fully paid garrison; a soldier whose card carries the hard-times condition (payCut on the owner record) */
  const cut = () => ({
    name: 'Ashford', institutions: [{ name: 'Garrison' }], powerStructure: { factions: [] },
    defenseProfile: { economicGates: { military: 1.2 } },
    npcs: [{ id: 'n1', name: 'Sergeant Vell', category: 'military', settlementCondition: 'economic_stress' }],
  });
  it('a kept, fully paid force whose soldier carries economic_stress: payCut is true, the row does not hold, owner == served', () => {
    const record = cut();
    const facts = factsOf(record);
    expect(orderForceOf(record).payCut).toBe(true);
    expect(facts.orderForce.pay).toBe('full');
    expect(TENSION_CAUSE_HOLDS[ROW.holds](record, facts)).toBe(false);
    expect(tensionCauseSentenceOf(record, { type: 'crime_wave' })).toBe(tensionCauseSentenceOf(toPublicSafe(record), { type: 'crime_wave' }));
  });
  it('the served arms still hold it: volunteers (a militia alone), pay short', () => {
    const militia = { ...cut(), institutions: [{ name: 'Militia' }], npcs: [] };
    const short = { ...cut(), defenseProfile: { economicGates: { military: 0.6 } }, npcs: [] };
    for (const [label, record] of /** @type {Array<[string, any]>} */ ([['volunteers', militia], ['short', short]])) {
      expect(TENSION_CAUSE_HOLDS[ROW.holds](record, factsOf(record)), label).toBe(true);
    }
  });
  describe('the three plain-toPublicSafe faults (PAGE-9 caf3509e7, build/CAUSES-WIRING-PARITY/pairs.2026-11-20.txt)', () => {
    // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2r-city-19 and r2s-wartime-metropolis-2 lit carry no payCut on the owner record (the purse lifted);
    // of the census plan's 720 the lowest r2r-city reborn with payCut and a crime wave is city-57 (alone of 0..59), and no
    // metropolis of the plan is, so the wartime fault's row takes the plan's other such city, r2s-recently_betrayed-city-1
    // (A JUDGEMENT, AT ANOTHER SIZE; the plan's r2s and r2r-metropolis births hold two: it and r2s-religious_conversion-city-0)
    const WANT = ['r2r-city-57', 'r2s-religious_conversion-city-0', 'r2s-recently_betrayed-city-1'];
    /** @type {Array<[string, any]>} */ let faults = [];
    beforeAll(async () => {
      const { generateSettlementPipeline } = await import('../../../src/generators/generateSettlementPipeline.js');
      const { birthConfig, loadGenerationLawPayloads } = await import('../../../src/domain/density/densityCreateBoundary.js');
      const { DEFAULT_CONFIG } = await import('../../../src/store/configSlice.js');
      const { censusPlan, configOf } = await import('../../components/pageCensusWalk.shared.mjs');
      await loadGenerationLawPayloads();
      faults = censusPlan('r2').filter((r) => WANT.includes(r.seed)).map((row) => /** @type {[string, any]} */ ([row.seed,
        generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} })]));
    }, 120000);
    it('each is reborn with payCut on the owner record, and its crime_wave sentence is the same on plain toPublicSafe', () => {
      expect(faults.map(([seed]) => seed).sort()).toEqual([...WANT].sort());
      for (const [seed, doc] of faults) {
        expect(orderForceOf(doc).payCut, seed).toBe(true);
        const t = doc.history.currentTensions.find((/** @type {any} */ x) => x.type === 'crime_wave');
        expect(t, seed).toBeTruthy();
        expect(tensionCauseSentenceOf(toPublicSafe(doc), t), seed).toBe(tensionCauseSentenceOf(doc, t));
      }
    });
  });
});

// CAUSES-PARITY-2 F (PAGE-12; the first brief's F, the chair's (3)): THE LAW ON A BORN PLACE. hxd-city-138 (born as
// measures/page-7/sim.mjs births it) holds crime_wave by its black market alone, and the black market is its one hideable
// house. On the gallery's hiding read (toPublicSafe, then the veil's default set) the house is gone and the served page prints
// what the same place born WITHOUT the house (its twin: the record with the black market removed) prints; the owner's page
// keeps the black market's own wording.
describe('a hidden house prints what the place without it prints (CAUSES-PARITY-2 F)', () => {
  it('hxd-city-138: served == the house-free twin; the owner keeps the black market\'s wording', async () => {
    const { generateSettlementPipeline } = await import('../../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../../src/store/configSlice.js');
    const { applyVeil, defaultVeilFor, resolveVeil } = await import('../../../src/domain/display/galleryVeil.js');
    const { isHideableHouse } = await import('../../../src/domain/people/cardVeil.js');
    const { CAUSE_HOUSES } = await import('../../../src/domain/facts/causeHouses.js');
    const { atomHolds } = await import('../../../src/domain/facts/factVocabulary.js');
    await loadGenerationLawPayloads();
    const doc = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: 'hxd-city-138', customContent: {} }));
    const hide = (/** @type {any} */ r) => { const pub = toPublicSafe(r); return applyVeil(pub, resolveVeil(defaultVeilFor(pub), null)); };
    const isBlackMarket = (/** @type {any} */ i) => CAUSE_HOUSES.blackMarket.has(String(i?.name ?? '').trim().toLowerCase());
    const row = /** @type {any} */ (TENSION_CAUSES.crime_wave.causes.find((c) => c.id === 'black_market'));
    const t = doc.history.currentTensions.find((/** @type {any} */ x) => x.type === 'crime_wave');
    expect(t).toBeTruthy();
    // the place: its one hideable house is the black market, and the owner prints the black market's wording
    expect(doc.institutions.filter((/** @type {any} */ i) => isHideableHouse(i)).map((/** @type {any} */ i) => isBlackMarket(i))).toEqual([true]);
    expect(row.wordings.map((/** @type {any} */ w) => w.text)).toContain(tensionCauseSentenceOf(doc, t));
    expect(atomHolds('house: black_market', /** @type {any} */ (factsOf(doc)))).toBe(true);
    // the hiding read: the house is gone, the row does not hold, its declared atom reads no
    const served = hide(doc);
    const t2 = served.history.currentTensions.find((/** @type {any} */ x) => x.type === 'crime_wave');
    expect(served.institutions.some(isBlackMarket)).toBe(false);
    expect(TENSION_CAUSE_HOLDS[row.holds](served, factsOf(served))).toBe(false);
    expect(atomHolds('house: black_market', /** @type {any} */ (factsOf(served)))).toBe(false);
    // the twin: the same place with the house removed
    const twin = structuredClone(doc);
    twin.institutions = twin.institutions.filter((/** @type {any} */ i) => !isBlackMarket(i));
    expect(twin.institutions.length).toBe(doc.institutions.length - 1);
    const plain = tensionCauseSentenceOf(twin, t);
    expect(tensionCauseSentenceOf(served, t2)).toBe(plain);
    expect(tensionCauseSentenceOf(hide(twin), t2)).toBe(plain);
    expect(tensionCauseSentenceOf(doc, t)).not.toBe(plain);
  }, 120000);
});
