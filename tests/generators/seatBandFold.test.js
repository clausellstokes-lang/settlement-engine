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
 *       of those roles read their corrected band; the same seed born dark (law 1 FORCED) reads them low; the
 *       one `_rng()` call of `generateNPCPowerLevel` holds (every card's id and name pair across the two births);
 *   (3) the old law is the old expression, by a differential in ONE tree and with NO stored digest (UK-FOLLOW,
 *       the chair's 22:01Z ruling on SEAT-9 item 81: goldens are the owner's, and a lane adds none):
 *       (a) every role the lists and the fold can meet reads, under absent, 1, '2', 3 and no config, the band of
 *           a local restatement of the OLD expression; under the law it differs on EXACTLY a declared set;
 *       (b) a town and a city born with the key truly ABSENT (stripped off `birthConfig`'s output) and born
 *           with law 1 forced deep-equal, the one config key excepted, and that key is the only difference;
 *   (4) UK (b), in its own commit and droppable: the stem 'wealthiest merchant' beside 'wealthy_merchant', under
 *       the same law: Wealthiest Merchant reads moderate under the law only (its card, the luxury merchant, in a city);
 *   (5) `castPowers.js :: raiseToOfficeBand`'s base-office-role read (SEAT-5-HANDBACK item 39) unharmed:
 *       every tier's seat role reads the same band with and without the law, and the raise is the base's.
 *
 * NO ARM LEANS ON THE DEFAULT (UK-FOLLOW cure 2). Every arm whose meaning is "under law 1" or "dark" forces
 * law 1 in its own config (`DARK`) or strips the key itself (arm 3 (b)); none reads what `birthConfig` mints
 * today, and none pins what a NEW place is born with (that pin is `seatLawWiring.test.js`'s, on the flip's list).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { powerBandOfRole } from '../../src/generators/npcGenerator.js';
import { raiseToOfficeBand } from '../../src/generators/people/castPowers.js';
import { POOL_BY_TITLE, POOL_BY_SHELF, SEAT_ROLE_BY_TIER } from '../../src/generators/people/poolMap.js';
import { OTHER_MINT_ROWS } from '../../src/generators/people/mintTitles.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { SEAT_LAW_CONFIG_KEY, resolveSeatLawVersion } from '../../src/domain/seat/seatLaw.js';

const LAW = Object.freeze({ _seatLawVersion: 2 });
/** dark, FORCED: law 1 in the config itself, never what `birthConfig` mints today (UK-FOLLOW cure 2) */
const DARK = Object.freeze({ _seatLawVersion: 1 });
/** every config that reads the OLD law: absent, 1, a string, an unshipped version, and no config at all */
const OLD_LAWS = [['absent', {}], ['1', { _seatLawVersion: 1 }], ['"2"', { _seatLawVersion: '2' }], ['3', { _seatLawVersion: 3 }], ['no config', undefined]];

/** a born card's pool role, read off its title (people/poolMap.js :: POOL_BY_TITLE, then the `other` mint's rows) */
const ROLE_OF_TITLE = new Map(Object.entries(POOL_BY_TITLE).map(([title, row]) => [title, row[0]]));
for (const row of Object.values(OTHER_MINT_ROWS)) if (!ROLE_OF_TITLE.has(row.title)) ROLE_OF_TITLE.set(row.title, row.role);

/** a birth under the law its caller NAMES (no default: a dark birth forces `DARK`)
 *  @param {string} size @param {string} seed @param {Record<string, unknown>} law */
const born = (size, seed, law) => generateSettlementPipeline({ ...birthConfig({ ...DEFAULT_CONFIG, settType: size }), ...law }, null, { seed, customContent: {} });
/** a birth with the law key truly ABSENT: stripped off `birthConfig`'s output explicitly, so it never reads the dial
 *  @param {string} size @param {string} seed */
const bornAbsent = (size, seed) => {
  const { [SEAT_LAW_CONFIG_KEY]: _minted, ...config } = birthConfig({ ...DEFAULT_CONFIG, settType: size });
  return generateSettlementPipeline(config, null, { seed, customContent: {} });
};
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
    for (const [size, seed] of [['town', 'uk-town-17'], ['city', 'uk-city-5']]) B[seed] = { law: born(size, seed, LAW), dark: born(size, seed, DARK) };
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
    expect(resolveSeatLawVersion(dark), 'dark: law 1 is in force').toBe(1);
    expect(cardsOf(dark, 'Guild Master').some((c) => c.influence === 'low'), 'a Guild Master card reads low').toBe(true);
    const cm = cardsOf(dark, 'Council Member');
    expect(cm.length, 'the dark town holds a Council Member card').toBeGreaterThan(0);
    expect(cm.every((c) => c.influence === 'low'), 'every Council Member card reads low').toBe(true);
  });
  test('uk-city-5 (a city) under the law: the guildmaster of thieves reads high; dark, low', () => {
    const { law, dark } = B['uk-city-5'];
    const lit = cardsOf(law, 'Thieves Guild Master'); const off = cardsOf(dark, 'Thieves Guild Master');
    expect(lit.length, 'the city holds a Thieves Guild Master card').toBeGreaterThan(0);
    for (const c of lit) expect(c.influence, `${c.id} ${c.title}`).toBe('high');
    expect(off.length, 'the dark city holds a Thieves Guild Master card').toBeGreaterThan(0);
    for (const c of off) expect(c.influence, `${c.id} ${c.title}`).toBe('low');
  });
  test('the one `_rng()` call holds: every card pairs by id and name across the two births, and only a moved role\'s band moves', () => {
    for (const { law, dark } of Object.values(B)) {
      expect(law.npcs.map((c) => `${c.id}=${c.name}`)).toEqual(dark.npcs.map((c) => `${c.id}=${c.name}`));
      const moved = law.npcs.filter((c, i) => c.influence !== dark.npcs[i].influence).map((c) => ROLE_OF_TITLE.get(c.title));
      expect(moved.length, 'some card moved').toBeGreaterThan(0);
      for (const role of moved) expect(['Guild Master', 'Thieves Guild Master', 'Council Member', 'Wealthiest Merchant' /* UK (b), arm 4 */]).toContain(role);
    }
  });
});

describe('(3) the old law is the old expression: every role\'s band, and a birth with the key absent equals one with law 1', () => {
  // NO STORED DIGEST (UK-FOLLOW, the chair's 22:01Z ruling on SEAT-9 item 81): goldens are the owner's, and a
  // lane adds none. The old law is held by a differential in ONE tree instead.
  /** the OLD expression, restated locally: lower-case `includes` over the two literal lists, no fold, no stem */
  const OLD_HIGH = ['mayor', 'lord', 'governor', 'bishop', 'archmage', 'guild_master', 'captain', 'commander', 'crime lord'];
  const OLD_MID = ['council_member', 'priest', 'wealthy_merchant', 'wizard', 'knight', 'magister', 'sergeant'];
  /** @param {unknown} role */
  const oldBand = (role) => {
    const r = String(role || '').toLowerCase();
    return OLD_HIGH.some((kw) => r.includes(kw)) ? 'high' : OLD_MID.some((kw) => r.includes(kw)) ? 'moderate' : 'low';
  };
  /** every pool role the estate draws a card through: the title table, the shelf table, the `other` mint, the seats */
  const ROLES = [...new Set([...Object.values(POOL_BY_TITLE).map((r) => r[0]), ...Object.values(POOL_BY_SHELF).map((r) => r[0]),
    ...Object.values(OTHER_MINT_ROWS).map((r) => r.role), ...Object.values(SEAT_ROLE_BY_TIER),
    'Wealthiest Merchant', 'Guild Archmage', 'City Watch Chief', 'High Priest', 'Garrison Commander', 'Chief Magistrate', 'Corrupt Official'])].sort();
  /** every role string the lists and the fold can meet */
  const EVERY_ROLE = [...new Set([
    ...OLD_HIGH, ...OLD_MID, // the 9 HIGH and 7 MID keywords as written
    'wealthiest merchant', // the stem's row
    'Mayor', 'Lord', 'Governor', 'Bishop', 'Archmage', 'Guild Master', 'Captain', 'Commander', 'Crime Lord', // spaced, capitalised
    'Council Member', 'Priest', 'Wealthy Merchant', 'Wizard', 'Knight', 'Magister', 'Sergeant',
    'Thieves Guild Master', 'Wealthiest Merchant',
    'guild master', 'thieves guild master', 'council member', 'COUNCIL MEMBER', 'wealthy merchant', // spaced, other cases
    ...ROLES, // the pool roles
    'Elder', 'Healer', 'Blacksmith', 'guildmaster', 'Wealthy-Merchant', '', // a handful that match nothing
  ])];
  /** the ONLY roles whose band the law moves, and where to: the spaced forms that meet an underscored keyword, and the stem */
  const MOVED_UNDER_LAW = {
    'Guild Master': 'high', 'guild master': 'high', 'Thieves Guild Master': 'high', 'thieves guild master': 'high',
    'Council Member': 'moderate', 'council member': 'moderate', 'COUNCIL MEMBER': 'moderate',
    'Wealthy Merchant': 'moderate', 'wealthy merchant': 'moderate',
    'Wealthiest Merchant': 'moderate', 'wealthiest merchant': 'moderate',
  };
  test('(a) every role reads the old expression under absent, 1, "2", 3 and no config; under the law EXACTLY the declared set moves', () => {
    expect(EVERY_ROLE.length, 'the role list').toBeGreaterThan(ROLES.length);
    expect(ROLES.length, 'the pool roles').toBeGreaterThan(0);
    const oldSide = collectSeedFailures(EVERY_ROLE, (role) => {
      for (const [label, config] of OLD_LAWS) expect(powerBandOfRole(role, config), `${role}: ${label}`).toBe(oldBand(role));
    });
    expectNoSeedFailures(oldSide, 'every role under every old-law config reads the old expression');
    const lawSide = collectSeedFailures(EVERY_ROLE, (role) => {
      const band = powerBandOfRole(role, LAW);
      if (Object.hasOwn(MOVED_UNDER_LAW, role)) {
        expect(band, `${role}: the law moves it to its declared band`).toBe(MOVED_UNDER_LAW[role]);
        expect(band, `${role}: and that band is not the old one`).not.toBe(oldBand(role));
      } else {
        expect(band, `${role}: not declared, so the law must not move it`).toBe(oldBand(role));
      }
    });
    expectNoSeedFailures(lawSide, 'under the law, exactly the declared roles move');
    const moved = EVERY_ROLE.filter((role) => powerBandOfRole(role, LAW) !== oldBand(role)).sort();
    expect(moved, 'the moved set, both directions').toEqual(Object.keys(MOVED_UNDER_LAW).sort());
  });
  test('(b) a town (uk-town-17) and a city (uk-city-5) born with the key absent equal the same seeds born under law 1, the key excepted', () => {
    /** every path at which two records differ */
    const diffPaths = (a, b, path = '', out = []) => {
      if (Object.is(a, b)) return out;
      if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
        for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diffPaths(a[k], b[k], path ? `${path}.${k}` : k, out);
        return out;
      }
      out.push(path);
      return out;
    };
    /** a record with the law key removed from its config and the config's `_config` echo */
    const withoutKey = (t) => {
      const drop = (c) => { if (!c) return c; const { [SEAT_LAW_CONFIG_KEY]: _key, ...rest } = c; return rest; };
      return { ...t, config: drop(t.config), _config: drop(t._config) };
    };
    const CASES = [['town', 'uk-town-17'], ['city', 'uk-city-5']];
    const failures = collectSeedFailures(CASES, ([size, seed]) => {
      const absent = bornAbsent(size, seed); const one = born(size, seed, DARK);
      expect(Object.hasOwn(absent.config, SEAT_LAW_CONFIG_KEY), `${seed}: the key is truly absent`).toBe(false);
      expect(one.config[SEAT_LAW_CONFIG_KEY], `${seed}: law 1 forced`).toBe(1);
      expect(withoutKey(absent), `${seed}: the whole record, the key excepted`).toEqual(withoutKey(one));
      const paths = diffPaths(absent, one);
      expect(paths, `${seed}: the config carries the one difference`).toContain(`config.${SEAT_LAW_CONFIG_KEY}`);
      for (const path of paths) expect(path.split('.').pop(), `${seed}: ${path} is the law key and nothing else`).toBe(SEAT_LAW_CONFIG_KEY);
    });
    expectNoSeedFailures(failures, 'every birth with the key absent equals its law-1 twin, the key excepted');
  });
});

describe('(4) UK (b), its own arm: the stem \'wealthiest merchant\' reads moderate under the law only', () => {
  test('Wealthiest Merchant reads moderate under the law, and low without it (absent, 1, "2", 3, no config)', () => {
    expect(powerBandOfRole('Wealthiest Merchant', LAW)).toBe('moderate');
    expect(powerBandOfRole('Wealthiest Merchant', { config: LAW }), 'a settlement carrying the law in its config').toBe('moderate');
    for (const [label, config] of OLD_LAWS) expect(powerBandOfRole('Wealthiest Merchant', config), label).toBe('low');
    expect(powerBandOfRole('wealthy_merchant'), 'the old keyword still reads moderate under the old law').toBe('moderate');
  });
  test('uk-city-5 under the law: the luxury merchant (the Wealthiest Merchant\'s card) reads moderate or above; dark, low', () => {
    const law = born('city', 'uk-city-5', LAW); const dark = born('city', 'uk-city-5', DARK);
    const lit = cardsOf(law, 'Wealthiest Merchant'); const off = cardsOf(dark, 'Wealthiest Merchant');
    expect(lit.length, 'the city holds a Wealthiest Merchant card').toBeGreaterThan(0);
    for (const c of lit) expect(['moderate', 'high'], `${c.id} ${c.title}`).toContain(c.influence);
    expect(off.length, 'the dark city holds a Wealthiest Merchant card').toBeGreaterThan(0);
    for (const c of off) expect(c.influence, `${c.id} ${c.title}`).toBe('low');
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
