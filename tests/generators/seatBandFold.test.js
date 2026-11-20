/**
 * tests/generators/seatBandFold.test.js — UK, THE CORRECTED KEYWORD UNDER THE SEAT LAW (brief
 * docs/chair/2026-11-20/content/seat/briefs/UK-BAND.md; builder BUK2, SEAT-6's lane; the measure
 * briefs/MEASURE-UK-REPORT.md).
 *
 * `npcGenerator.js :: powerBandOfRole` matched keywords written with underscores ('guild_master',
 * 'council_member') against pool roles written with spaces ('Guild Master', 'Council Member'), so the
 * Guild Master, the Thieves Guild Master and the Council Member fell to the lowest band. The trial's fold
 * (f4a434660: '_' and ' ' fold alike, both sides) lands ONLY where the born config carries the seat law
 * (`src/domain/seat/seatLaw.js :: seatsByHolder`); a caller that hands no config reads the OLD law.
 *
 * The arms, in the brief's order:
 *   (1) per moved role: under the law the band moves (Guild Master, Thieves Guild Master -> high; Council
 *       Member -> moderate), without it (absent, 1, the string '2', an unshipped 3, no config) it does not;
 *   (2) the place-size case: a TOWN born under the law (and a city for the thieves' guildmaster): the cards
 *       of those roles read their corrected band; the same seed born dark reads them low; the one `_rng()`
 *       call of `generateNPCPowerLevel` holds (every card's id and name pair across the two births);
 *   (3) the old law byte-identical: births with the law absent, 1 and the string '2' (and every pool role's
 *       band read with no law) equal the digests the base fb937f369 produced, RECORDED before any edit;
 *   (5) `castPowers.js :: raiseToOfficeBand`'s base-office-role read (SEAT-5-HANDBACK item 39) unharmed:
 *       every tier's seat role reads the same band with and without the law, and the raise is the base's.
 */
import { createHash } from 'node:crypto';
import { beforeAll, describe, expect, test } from 'vitest';
import { powerBandOfRole } from '../../src/generators/npcGenerator.js';
import { raiseToOfficeBand } from '../../src/generators/people/castPowers.js';
import { POOL_BY_TITLE, POOL_BY_SHELF, SEAT_ROLE_BY_TIER } from '../../src/generators/people/poolMap.js';
import { OTHER_MINT_ROWS } from '../../src/generators/people/mintTitles.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const LAW = Object.freeze({ _seatLawVersion: 2 });
/** every config that reads the OLD law: absent, 1, a string, an unshipped version, and no config at all */
const OLD_LAWS = [['absent', {}], ['1', { _seatLawVersion: 1 }], ['"2"', { _seatLawVersion: '2' }], ['3', { _seatLawVersion: 3 }], ['no config', undefined]];
const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');

/** a born card's pool role, read off its title (people/poolMap.js :: POOL_BY_TITLE, then the `other` mint's rows) */
const ROLE_OF_TITLE = new Map(Object.entries(POOL_BY_TITLE).map(([title, row]) => [title, row[0]]));
for (const row of Object.values(OTHER_MINT_ROWS)) if (!ROLE_OF_TITLE.has(row.title)) ROLE_OF_TITLE.set(row.title, row.role);

/** @param {string} size @param {string} seed @param {Record<string, unknown>} [law] */
const born = (size, seed, law = {}) => generateSettlementPipeline({ ...birthConfig({ ...DEFAULT_CONFIG, settType: size }), ...law }, null, { seed, customContent: {} });
/** @param {any} t @param {string} role */
const cardsOf = (t, role) => (t.npcs || []).filter((c) => ROLE_OF_TITLE.get(c.title) === role);

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('(1) per moved role: the band moves under the law, and only under it', () => {
  const MOVED = [['Guild Master', 'high'], ['Thieves Guild Master', 'high'], ['Council Member', 'moderate']];
  test('Guild Master and Thieves Guild Master read high, Council Member moderate, under the law', () => {
    for (const [role, band] of MOVED) {
      expect(powerBandOfRole(role, LAW), role).toBe(band);
      expect(powerBandOfRole(role, { config: LAW }), `${role}: a settlement carrying the law in its config`).toBe(band);
    }
  });
  test('each of the three reads low without the law (absent, 1, "2", 3, no config)', () => {
    for (const [role] of MOVED) {
      for (const [label, config] of OLD_LAWS) expect(powerBandOfRole(role, config), `${role}: ${label}`).toBe('low');
      expect(powerBandOfRole(role), `${role}: one argument`).toBe('low');
    }
  });
  test('the fold moves nothing the old law already read: a keyword spelled with a space, and a role with no keyword', () => {
    for (const [role, band] of [['Crime Lord', 'high'], ['Guard Captain', 'high'], ['Priest', 'moderate'], ['Elder', 'low'], ['Healer', 'low'], ['', 'low'], [null, 'low']]) {
      expect(powerBandOfRole(role, LAW), String(role)).toBe(band);
      expect(powerBandOfRole(role), String(role)).toBe(band);
    }
  });
});

describe('(2) the place-size case: a town born under the law prints the corrected band on the cards', () => {
  /** @type {Record<string, { law: any, dark: any }>} */
  const B = {};
  beforeAll(() => {
    for (const [size, seed] of [['town', 'uk-town-17'], ['city', 'uk-city-5']]) B[seed] = { law: born(size, seed, LAW), dark: born(size, seed) };
  });
  test('uk-town-17 (a town) under the law: every Guild Master card reads high, every Council Member card moderate or above', () => {
    const { law } = B['uk-town-17'];
    expect(law.config._seatLawVersion, 'the born config carries the law').toBe(2);
    const gm = cardsOf(law, 'Guild Master'); const cm = cardsOf(law, 'Council Member');
    expect(gm.length, 'the town holds a Guild Master card').toBeGreaterThan(0);
    expect(cm.length, 'the town holds a Council Member card').toBeGreaterThan(0);
    for (const c of gm) expect(c.influence, `${c.id} ${c.title}`).toBe('high');
    for (const c of cm) expect(['moderate', 'high'], `${c.id} ${c.title}`).toContain(c.influence);
  });
  test('uk-town-17 born dark: the same roles still read low (the old law)', () => {
    const { dark } = B['uk-town-17'];
    expect(dark.config._seatLawVersion, 'dark: no law key').toBeUndefined();
    expect(cardsOf(dark, 'Guild Master').some((c) => c.influence === 'low'), 'a Guild Master card reads low').toBe(true);
    expect(cardsOf(dark, 'Council Member').every((c) => c.influence === 'low'), 'every Council Member card reads low').toBe(true);
  });
  test('uk-city-5 (a city) under the law: the guildmaster of thieves reads high; dark, low', () => {
    const { law, dark } = B['uk-city-5'];
    const lit = cardsOf(law, 'Thieves Guild Master'); const off = cardsOf(dark, 'Thieves Guild Master');
    expect(lit.length, 'the city holds a Thieves Guild Master card').toBeGreaterThan(0);
    for (const c of lit) expect(c.influence, `${c.id} ${c.title}`).toBe('high');
    for (const c of off) expect(c.influence, `${c.id} ${c.title}`).toBe('low');
  });
  test('the one `_rng()` call holds: every card pairs by id and name across the two births, and only a moved role\'s band moves', () => {
    for (const { law, dark } of Object.values(B)) {
      expect(law.npcs.map((c) => `${c.id}=${c.name}`)).toEqual(dark.npcs.map((c) => `${c.id}=${c.name}`));
      const moved = law.npcs.filter((c, i) => c.influence !== dark.npcs[i].influence).map((c) => ROLE_OF_TITLE.get(c.title));
      expect(moved.length, 'some card moved').toBeGreaterThan(0);
      for (const role of moved) expect(['Guild Master', 'Thieves Guild Master', 'Council Member']).toContain(role);
    }
  });
});

describe('(3) the old law is byte-identical to the base', () => {
  // RECORDED at the base fb937f369, by this arm's own `sha`, before npcGenerator.js was edited.
  const RECORDED = {
    roles: 163,
    bands: '15d294631ec0416996df997a4d661d0f8c8c000fc77d112276952c10cbe8a00d',
    'uk-town-17:absent': '073f85398de4bd0a6f24cca2b7ba5bb989f19a001c02e496e5df224bd6cac5b3',
    'uk-town-17:1': 'd0e868dce96c7a75d13677f8fe48e35f45177db7bef841582e558b00c8143c93',
    'uk-town-17:"2"': '0b8b8fdcd58a32494b3add7ae533750472373e73f407e1b7bdc67aed0620f75e',
    'uk-city-5:absent': '4b3e6d9f06961a640f1d03b7633db9effd0a0f75a3abcc41cd2b3358c37f6351',
    'uk-city-5:1': '52d6a6c06c4459cb4e28f7d119940263cea65581a6926f8f26a8eb028f384095',
    'uk-city-5:"2"': '521f348dc43451abcce00ecce62bea0030515939b584586f9d2e7ef382caec29',
  };
  /** every pool role the estate draws a card through: the title table, the shelf table, the `other` mint, the seats */
  const ROLES = [...new Set([...Object.values(POOL_BY_TITLE).map((r) => r[0]), ...Object.values(POOL_BY_SHELF).map((r) => r[0]),
    ...Object.values(OTHER_MINT_ROWS).map((r) => r.role), ...Object.values(SEAT_ROLE_BY_TIER),
    'Wealthiest Merchant', 'Guild Archmage', 'City Watch Chief', 'High Priest', 'Garrison Commander', 'Chief Magistrate', 'Corrupt Official'])].sort();
  test('every pool role\'s band with no law, 1, "2", 3 or no config equals the base\'s', () => {
    for (const [label, config] of OLD_LAWS) {
      expect(sha(ROLES.map((role) => [role, powerBandOfRole(role, config)])), label).toBe(RECORDED['bands']);
    }
    expect(ROLES.length).toBe(RECORDED['roles']);
  });
  test('a town (uk-town-17) and a city (uk-city-5) born with the law absent, 1 or "2" equal the base, byte for byte', () => {
    for (const [size, seed] of [['town', 'uk-town-17'], ['city', 'uk-city-5']]) {
      for (const [label, law] of [['absent', {}], ['1', { _seatLawVersion: 1 }], ['"2"', { _seatLawVersion: '2' }]]) {
        expect(sha(born(size, seed, law)), `${seed}:${label}`).toBe(RECORDED[`${seed}:${label}`]);
      }
    }
  });
});

describe('(5) raiseToOfficeBand reads the base office role, unharmed (SEAT-5-HANDBACK item 39)', () => {
  // RECORDED at the base fb937f369: the office role's band and the raise of a low card (power 2) through it.
  const BASE_OFFICE = { Elder: 'low', Mayor: 'high', Governor: 'high' };
  const BASE_RAISE = { Elder: ['low', 2], Mayor: ['high', 9], Governor: ['high', 9] };
  test('every tier\'s seat role reads one band with and without the law', () => {
    for (const [tier, role] of Object.entries(SEAT_ROLE_BY_TIER)) {
      expect(powerBandOfRole(role), `${tier}: ${role}`).toBe(BASE_OFFICE[role]);
      expect(powerBandOfRole(role, LAW), `${tier}: ${role}: the fold moves no office role`).toBe(BASE_OFFICE[role]);
    }
  });
  test('raiseToOfficeBand(a low card, the office role) is the base\'s for Elder, Mayor and Governor', () => {
    for (const role of Object.keys(BASE_RAISE)) {
      const card = { influence: 'low', power: 2 };
      raiseToOfficeBand(card, role);
      expect([card.influence, card.power], role).toEqual(BASE_RAISE[role]);
    }
  });
});
