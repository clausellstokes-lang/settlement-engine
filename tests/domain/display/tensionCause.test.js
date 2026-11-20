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
  if (kind === 'guild_conflict' && facts.guild === false) return { cause: 'withoutItsHouse', sentence: table.withoutItsHouse };
  const held = table.causes.filter((c) => TENSION_CAUSE_HOLDS[c.holds](record, facts) && !c.wordings.some((w) => w.includes('{power}')));
  const r1 = held.filter((c) => c.rank === 1);
  const tier = r1.length ? r1 : held.filter((c) => c.rank === 2);
  const name = String(record?.name ?? '');
  const cause = tier.length ? pickVariant(tier, `${name}::held::${kind}`) : undefined;
  return { cause: cause ? cause.id : 'plain', sentence: pickVariant(cause ? cause.wordings : table.plain, `${name}::cause::${kind}`) };
};

/** @param {any} record */
const sentencesOf = (record) => (record.history?.currentTensions || []).map((/** @type {any} */ t) => tensionCauseSentenceOf(record, t));

describe('the key: the town\'s name and the trouble\'s kind, never the seed', () => {
  it('the same document with its seed deleted prints the same sentences', () => {
    let tables = 0;
    for (const [seed, record] of births) {
      const shared = structuredClone(record);
      delete shared._seed;
      delete shared._config;
      expect(shared._seed, seed).toBeUndefined();
      const own = sentencesOf(record);
      expect(sentencesOf(shared), seed).toEqual(own);
      tables += own.filter((s) => s !== null).length;
    }
    expect(tables).toBeGreaterThan(0);
  });
  it('a different seed under the same name and the same facts prints the same sentence', () => {
    const base = { name: 'Ashford', institutions: [{ name: 'Black market' }, { name: 'Town watch' }, { name: 'Garrison' }], powerStructure: { factions: [] } };
    const one = tensionCauseSentenceOf({ ...base, _seed: 'a-seed' }, { type: 'crime_wave' });
    for (const s of ['another-seed', 'hxd-city-7', '']) expect(tensionCauseSentenceOf({ ...base, _seed: s }, { type: 'crime_wave' })).toBe(one);
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
    for (const [seed, record] of births) {
      for (const t of record.history?.currentTensions || []) {
        const s = tensionCauseSentenceOf(record, t);
        if (!Object.hasOwn(TENSION_CAUSES, t.type)) { expect(s, `${seed} ${t.type}`).toBeNull(); continue; }
        const own = [...TENSION_CAUSES[t.type].causes.flatMap((c) => c.wordings), ...TENSION_CAUSES[t.type].plain, /** @type {any} */ (TENSION_CAUSES[t.type]).withoutItsHouse];
        expect(own, `${seed} ${t.type}`).toContain(s);
      }
    }
  });
});

describe('the pick, as measured', () => {
  it('on every born town and every kind of the table, the sentence is the measure\'s pick', () => {
    let n = 0;
    for (const [seed, record] of births) {
      for (const kind of Object.keys(TENSION_CAUSES)) {
        expect(tensionCauseSentenceOf(record, { type: kind }), `${seed} ${kind}`).toBe(expectedOf(record, kind).sentence);
        n++;
      }
    }
    expect(n).toBe(births.length * 8);
  });
  it('rank 2 speaks only where no rank-1 cause holds; plain only where none holds', () => {
    // a kept, paid force and no criminal power: crime_wave's rank 1 holds nothing
    const bare = { name: 'Ashford', institutions: [{ name: 'Town watch' }, { name: 'Garrison' }], powerStructure: { factions: [] } };
    expect(expectedOf(bare, 'crime_wave').cause).toBe('plain');
    expect(tensionCauseSentenceOf(bare, { type: 'crime_wave' })).toBe(pickVariant(TENSION_CAUSES.crime_wave.plain, 'Ashford::cause::crime_wave'));
    const market = { ...bare, institutions: [...bare.institutions, { name: 'Black market' }] };
    const bm = /** @type {any} */ (TENSION_CAUSES.crime_wave.causes.find((c) => c.id === 'black_market'));
    expect(tensionCauseSentenceOf(market, { type: 'crime_wave' })).toBe(pickVariant(bm.wordings, 'Ashford::cause::crime_wave'));
    // no force kept: rank 1 (no_force) speaks over the black market
    const noForce = { ...market, institutions: [{ name: 'Black market' }] };
    const nf = /** @type {any} */ (TENSION_CAUSES.crime_wave.causes.find((c) => c.id === 'no_force'));
    expect(tensionCauseSentenceOf(noForce, { type: 'crime_wave' })).toBe(pickVariant(nf.wordings, 'Ashford::cause::crime_wave'));
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
    expect(typeof table.withoutItsHouse).toBe('string');
    expect(tensionCauseSentenceOf(record, quarrel)).toBe(table.withoutItsHouse);
  });
  it('a guildless document never prints a guild cause or plain line, whatever holds; a guild restores the ranks', () => {
    const table = /** @type {any} */ (TENSION_CAUSES.guild_conflict);
    const guildless = { name: 'Ashford', institutions: [{ name: 'Annual fair' }, { name: 'Caravanserai' }], powerStructure: { factions: [{ faction: 'Merchant League', category: 'economy', isGoverning: true, powerLabel: 'Dominant' }] } };
    expect(factsOf(guildless).guild).toBe(false);
    expect(tensionCauseSentenceOf(guildless, { type: 'guild_conflict' })).toBe(table.withoutItsHouse);
    const withGuild = { ...guildless, powerStructure: { factions: [...guildless.powerStructure.factions, { faction: 'Weavers Guild', category: 'economy', powerLabel: 'Minor' }] } };
    expect(factsOf(withGuild).guild).toBe(true);
    expect(tensionCauseSentenceOf(withGuild, { type: 'guild_conflict' })).toBe(expectedOf(withGuild, 'guild_conflict').sentence);
    expect(tensionCauseSentenceOf(withGuild, { type: 'guild_conflict' })).not.toBe(table.withoutItsHouse);
  });
});

describe('{power}: filled only by the sides table\'s own fill', () => {
  it('merchants_rule does not hold while the fill is not built: the governing trade power alone prints plain', () => {
    const record = { name: 'Ashford', institutions: [], powerStructure: { factions: [{ faction: 'Merchant League', category: 'economy', isGoverning: true, powerLabel: 'Dominant' }] } };
    expect(TENSION_CAUSE_HOLDS.governedByTrade(record, factsOf(record))).toBe(true);
    expect(tensionCauseSentenceOf(record, { type: 'outside_debt' })).toBe(pickVariant(TENSION_CAUSES.outside_debt.plain, 'Ashford::cause::outside_debt'));
  });
  it('no sentence of any born town prints the slot', () => {
    for (const [seed, record] of births) {
      for (const kind of Object.keys(TENSION_CAUSES)) expect(String(tensionCauseSentenceOf(record, { type: kind })), `${seed} ${kind}`).not.toContain(POWER_SLOT);
    }
  });
});

describe('a house is matched by its catalogue identity on the live roster, never by a custom name', () => {
  const force = [{ name: 'Town watch' }, { name: 'Garrison' }];
  const blackMarketLines = /** @type {any} */ (TENSION_CAUSES.crime_wave.causes.find((c) => c.id === 'black_market')).wordings;
  it('a custom house named "Black Market Tavern" does not print the black market\'s line', () => {
    for (const extra of [{ isCustom: true }, { source: 'custom' }, {}]) {
      const record = { name: 'Ashford', institutions: [...force, { name: 'Black Market Tavern', ...extra }], powerStructure: { factions: [] } };
      expect(blackMarketLines, JSON.stringify(extra)).not.toContain(tensionCauseSentenceOf(record, { type: 'crime_wave' }));
    }
    const real = { name: 'Ashford', institutions: [...force, { name: 'Black market' }], powerStructure: { factions: [] } };
    expect(blackMarketLines).toContain(tensionCauseSentenceOf(real, { type: 'crime_wave' }));
  });
  it('a ruined black market does not print the black market\'s line', () => {
    const record = { name: 'Ashford', institutions: [...force, { name: 'Black market', status: 'ruined' }], powerStructure: { factions: [] } };
    expect(blackMarketLines).not.toContain(tensionCauseSentenceOf(record, { type: 'crime_wave' }));
  });
});
