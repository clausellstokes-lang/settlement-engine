/**
 * tests/domain/dossier/powerSupport.test.js
 *
 * The Power tab institution-support web (owner order 2026-07-22) and, since X-45 (the owner,
 * 2026-11-02: "every institution backs powers, some inherently back multiple where appropriate
 * … make sure that it still balances out to the power ranking … it doesn't end up becoming
 * redundant or a double counting … catalog every institution and make those judgment calls
 * individually"), THE BACKING CATALOGUE behind it (`data/institutionBacking.js`). These pins
 * hold, over REAL full-pipeline settlements and over fixtures:
 *   - the catalogue places every name the generator can write, with no orphan row, shares
 *     that sum to one over known archetypes, integer weights 0 to 3, a fallback that is never
 *     the only share, and no reason line (the owner: the row naming the powers is plenty); a
 *     split stays the exception;
 *   - every house stands behind at least one power, under each power it has a share for and
 *     no other; its shares never exceed one (no double counting), and the ledger lands no
 *     more weight than the houses carry;
 *   - the exact mark takes a house whole; the seat takes the government share whatever its
 *     tag; the Craft Guilds are read as the craft power despite their economy tag; a merchant
 *     council that is the seat does not hoover up both halves of a market; a lapsed share goes
 *     to the fallback or nowhere; a house with nothing landed answers to the seat at no weight;
 *   - the DM's own list replaces every derived reason, split equally, an empty list meaning
 *     nobody;
 *   - every basis phrase is drawn from the FROZEN finite vocabulary; the web is deterministic.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import {
  deriveFactionSupport, institutionBackers, houseBacksOf, backingLedger,
  parseBacksValue, formatBacksValue, BACKS_SEPARATOR, SUPPORT_BASIS,
} from '../../../src/domain/dossier/powerSupport.js';
import {
  BACKING_ARCHETYPES, BACKING_ROWS, backingRowFor, backingFamilyKeys, catalogueNamesByFamily,
} from '../../../src/data/institutionBacking.js';
import { INSTITUTION_FAMILIES, INSTITUTION_TIERS } from '../../../src/data/institutionalCatalog.js';
import { applyUserEdit } from '../../../src/domain/userEdits.js';
import { governingFactionOf, nameOf } from '../../../src/domain/rulingPower.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });

const CASES = [
  { label: 'city', config: { settType: 'city', culture: 'germanic', terrainOverride: 'hills', tradeRouteAccess: 'road' }, seed: 'support-city' },
  { label: 'town', config: { settType: 'town', terrain: 'river' }, seed: 'support-town' },
  { label: 'village', config: { settType: 'village', terrain: 'grassland', tradeRouteAccess: 'road' }, seed: 'support-village' },
];

// Serialize a support map to a comparable, order-stable structure.
function serialize(map) {
  return [...map.entries()].map(([faction, edges]) => [
    faction,
    edges.map((e) => ({ name: e.name, basis: e.basis, why: e.why })),
  ]);
}

// The finite set of legal basis phrases.
const LEGAL_WHY = new Set([SUPPORT_BASIS.founded, SUPPORT_BASIS.default, SUPPORT_BASIS.authored, ...Object.values(SUPPORT_BASIS.aligned)]);
const KINDS = ['founded', 'aligned', 'default', 'authored'];

// ── THE CATALOGUE ────────────────────────────────────────────────────────────────────────

describe('THE BACKING CATALOGUE (X-45): one judgment call per family, arithmetic that cannot double count', () => {
  const placeable = new Set();
  for (const fam of INSTITUTION_FAMILIES) {
    for (const tier of INSTITUTION_TIERS) {
      const at = fam.at?.[tier];
      if (at) placeable.add(String(at.name || fam.shared?.name || ''));
    }
  }
  placeable.delete('');

  test('every placeable name resolves to a row, and no row is an orphan', () => {
    expect(placeable.size).toBeGreaterThan(250);
    const missing = [...placeable].filter((n) => !backingRowFor(n));
    expect(missing).toEqual([]);
    const families = catalogueNamesByFamily();
    const orphans = backingFamilyKeys().filter((k) => !families.has(k));
    expect(orphans).toEqual([]);
    expect(backingFamilyKeys().length).toBe(families.size);
  });

  test('every tier entry names a tier of its own family, and resolves case-insensitively', () => {
    const families = catalogueNamesByFamily();
    for (const [key, row] of Object.entries(BACKING_ROWS)) {
      for (const name of Object.keys(row.at || {})) expect(families.get(key), `${key} :: at ${name}`).toContain(name);
    }
    expect(backingRowFor('parish CHURCH')).toEqual(backingRowFor('Parish church'));
    expect(backingRowFor('Parish church').weight).toBe(2);
    expect(backingRowFor('Access to parish church').weight).toBe(0); // the church is elsewhere
    expect(backingRowFor('Not a house')).toBeNull();
    expect(backingRowFor(null)).toBeNull();
  });

  test('shares sum to one over known archetypes; weights are integers 0 to 3; a fallback is a known archetype and never the only share; no row carries a reason line', () => {
    for (const name of placeable) {
      const row = backingRowFor(name);
      const sum = Object.values(row.shares).reduce((a, b) => a + b, 0);
      expect(Math.abs(sum - 1), `${name}: shares sum to ${sum}`).toBeLessThan(1e-9);
      for (const [arch, share] of Object.entries(row.shares)) {
        expect(BACKING_ARCHETYPES, `${name}: ${arch}`).toContain(arch);
        expect(share).toBeGreaterThan(0);
      }
      expect(Number.isInteger(row.weight) && row.weight >= 0 && row.weight <= 3, `${name}: weight ${row.weight}`).toBe(true);
      if (row.fallback) {
        expect(BACKING_ARCHETYPES, `${name}: fallback ${row.fallback}`).toContain(row.fallback);
        // a fallback may merge into a named share (the seat takes the lord's share where no
        // lord is seated); it is pointless only as the sole share, which can never lapse into itself
        const only = Object.keys(row.shares);
        expect(only.length === 1 && only[0] === row.fallback, `${name}: the fallback is its only share`).toBe(false);
      }
      expect(row.why, `${name}: a reason line (the owner: the row naming the powers is plenty)`).toBeUndefined();
      expect(row.at).toBeUndefined(); // the tier entry is laid over, never handed out
    }
  });

  test('a split is the exception: fewer than a third of the families back more than one archetype', () => {
    const keys = backingFamilyKeys();
    const split = keys.filter((k) => Object.keys(BACKING_ROWS[k].shares).length > 1);
    expect(split.length).toBeGreaterThan(0);
    expect(split.length / keys.length).toBeLessThan(1 / 3);
  });
});

// ── THE RULES, on a fixture ──────────────────────────────────────────────────────────────

const ruled = () => ({
  powerStructure: { factions: [
    { faction: 'Town Council', category: 'government', power: 40, isGoverning: true },
    { faction: 'Merchant Guilds', category: 'economy', power: 30 },
    { faction: 'Craft Guilds', category: 'economy', power: 10 }, // the economy tag, read as the craft power
    { faction: 'Military/Guard', category: 'military', power: 20 },
  ] },
  institutions: [
    { name: 'Docks/port facilities' },                               // merchant 0.6, government 0.4: two powers
    { name: 'Cooper' },                                              // craft, whole: the Craft Guilds, not the merchants
    { name: 'Wayside shrine' },                                      // religious, no fallback, no faith seated: the default
    { name: 'Mills (2-5)' },                                         // noble, fallback government: lands on the seat
    { name: 'Great cathedral', factionSource: 'military/guard' },   // the exact mark, spelled loosely, takes it whole
    { name: 'A house nobody catalogued', priorityCategory: 'economy' }, // the stranger: the economy tag, whole
  ],
});

describe('houseBacksOf — the per-house truth (X-45)', () => {
  test('the catalogue lands each share on the leader of its archetype, the seat taking the government share', () => {
    const backs = houseBacksOf(ruled());
    expect(backs.get('Docks/port facilities')).toEqual([
      { faction: 'Merchant Guilds', basis: 'aligned', why: SUPPORT_BASIS.aligned.merchant, share: 0.6, weight: 2 },
      { faction: 'Town Council', basis: 'aligned', why: SUPPORT_BASIS.aligned.government, share: 0.4, weight: 2 },
    ]);
    expect(backs.get('Cooper')).toEqual([
      { faction: 'Craft Guilds', basis: 'aligned', why: SUPPORT_BASIS.aligned.craft, share: 1, weight: 1 },
    ]);
  });

  test('a lapsed share goes to the fallback, or to the seat at no weight', () => {
    const backs = houseBacksOf(ruled());
    expect(backs.get('Mills (2-5)')).toEqual([
      { faction: 'Town Council', basis: 'aligned', why: SUPPORT_BASIS.aligned.government, share: 1, weight: 1 },
    ]);
    expect(backs.get('Wayside shrine')).toEqual([
      { faction: 'Town Council', basis: 'default', why: SUPPORT_BASIS.default, share: 0, weight: 1 },
    ]);
  });

  test('the exact mark takes the house whole, matched to the roster spelling; a stranger follows its economy tag', () => {
    const backs = houseBacksOf(ruled());
    expect(backs.get('Great cathedral')).toEqual([
      { faction: 'Military/Guard', basis: 'founded', why: SUPPORT_BASIS.founded, share: 1, weight: 3 },
    ]);
    expect(backs.get('A house nobody catalogued')).toEqual([
      { faction: 'Merchant Guilds', basis: 'aligned', why: SUPPORT_BASIS.aligned.merchant, share: 1, weight: 1 },
    ]);
  });

  test('a merchant council that is the seat takes the government share, and the merchant share only when no other merchant power is seated', () => {
    const two = {
      powerStructure: { factions: [
        { faction: 'Merchant Guild Council', category: 'economy', power: 25, isGoverning: true },
        { faction: 'Merchant Guilds', category: 'economy', power: 20 },
      ] },
      institutions: [{ name: 'Docks/port facilities' }],
    };
    expect(houseBacksOf(two).get('Docks/port facilities').map((b) => [b.faction, b.share])).toEqual([
      ['Merchant Guilds', 0.6], ['Merchant Guild Council', 0.4],
    ]);
    const one = { ...two, powerStructure: { factions: [two.powerStructure.factions[0]] } };
    const [only] = houseBacksOf(one).get('Docks/port facilities');
    expect(only.faction).toBe('Merchant Guild Council');
    expect(only.share).toBeCloseTo(1, 9);
    expect(only.why).toBe(SUPPORT_BASIS.aligned.merchant); // the larger share lands first and keeps its phrase
  });

  test('no ruler, no default: a house with nothing landed backs nobody, and institutionBackers leaves it out', () => {
    const s = ruled();
    delete s.powerStructure.factions[0].isGoverning;
    expect(houseBacksOf(s).get('Wayside shrine')).toEqual([]);
    expect(institutionBackers(s).has('Wayside shrine')).toBe(false);
    expect(institutionBackers(s).get('Docks/port facilities')).toEqual(['Merchant Guilds', 'Town Council']);
  });

  test('the DM word replaces every derived reason, split equally, matched to the roster spelling; an empty word means nobody', () => {
    const s = ruled();
    applyUserEdit(s.institutions[0], 'backs', 'town council · Military/Guard · Nobody Known');
    expect(houseBacksOf(s).get('Docks/port facilities')).toEqual([
      { faction: 'Town Council', basis: 'authored', why: SUPPORT_BASIS.authored, share: 0.5, weight: 2 },
      { faction: 'Military/Guard', basis: 'authored', why: SUPPORT_BASIS.authored, share: 0.5, weight: 2 },
    ]);
    const web = deriveFactionSupport(s);
    expect(web.get('Town Council').map((e) => [e.name, e.basis])).toEqual([
      ['Docks/port facilities', 'authored'], ['Mills (2-5)', 'aligned'], ['Wayside shrine', 'default'],
    ]);
    expect(web.get('Military/Guard').map((e) => [e.name, e.basis])).toEqual([
      ['Docks/port facilities', 'authored'], ['Great cathedral', 'founded'],
    ]);
    expect(web.get('Merchant Guilds').map((e) => e.name)).toEqual(['A house nobody catalogued']);
    applyUserEdit(s.institutions[0], 'backs', '');
    expect(houseBacksOf(s).get('Docks/port facilities')).toEqual([]);
    expect(institutionBackers(s).has('Docks/port facilities')).toBe(false);
    expect(deriveFactionSupport(s).get('Town Council').map((e) => e.name)).toEqual(['Mills (2-5)', 'Wayside shrine']);
  });

  test('the spelling helpers: one line, middle dots, trimmed, deduplicated', () => {
    expect(formatBacksValue(['Town Council', ' Merchant Guilds ', 'town council'])).toBe(`Town Council${BACKS_SEPARATOR}Merchant Guilds`);
    expect(parseBacksValue('Town Council · Merchant Guilds')).toEqual(['Town Council', 'Merchant Guilds']);
    expect(parseBacksValue('a, b; c\nd')).toEqual(['a', 'b', 'c', 'd']);
    expect(parseBacksValue('')).toEqual([]);
    expect(parseBacksValue(undefined)).toEqual([]);
    expect(formatBacksValue([])).toBe('');
  });

  test('degrades to an empty map on missing input', () => {
    expect(houseBacksOf(undefined).size).toBe(0);
    expect(houseBacksOf({}).size).toBe(0);
    expect(institutionBackers({}).size).toBe(0);
    expect(institutionBackers(/** @type {any} */ (null)).size).toBe(0);
  });
});

// ── THE LEDGER ───────────────────────────────────────────────────────────────────────────

describe('backingLedger — what the catalogue implies against what generation decided', () => {
  test('lands share times weight on each power, never more weight than the houses carry, and reads the gap and the rank agreement', () => {
    const ledger = backingLedger(ruled());
    const by = Object.fromEntries(ledger.rows.map((r) => [r.faction, r]));
    // Docks 2 × (0.6 | 0.4), Cooper 1, Mills 1 to the seat, the cathedral 3 to the guard, the stranger 1 to the merchants.
    expect(by['Merchant Guilds'].backed).toBeCloseTo(2.2, 9);
    expect(by['Town Council'].backed).toBeCloseTo(1.8, 9);
    expect(by['Craft Guilds'].backed).toBeCloseTo(1, 9);
    expect(by['Military/Guard'].backed).toBeCloseTo(3, 9);
    expect(by['Town Council'].governing).toBe(true);
    expect(by['Town Council'].archetype).toBe('government');
    expect(by['Craft Guilds'].archetype).toBe('craft');
    expect(ledger.rows.reduce((a, r) => a + r.implied, 0)).toBeCloseTo(100, 9);
    expect(ledger.houses).toBe(6);
    expect(ledger.weighed).toBe(9);
    expect(ledger.lapsed).toBe(1); // the shrine, at no weight
    expect(ledger.distance).toBeCloseTo(20, 9);
    expect(ledger.rank).toBeCloseTo(0.2, 9);
  });

  test('degrades: no factions, no rows, no rank', () => {
    const empty = backingLedger({});
    expect(empty.rows).toEqual([]);
    expect(empty.rank).toBeNull();
    expect(empty.distance).toBe(0);
  });
});

// ── REAL SETTLEMENTS ─────────────────────────────────────────────────────────────────────

describe('deriveFactionSupport — the power support web over real settlements', () => {
  for (const { label, config, seed } of CASES) {
    test(`${label}: derives a non-empty, well-typed support web`, () => {
      const s = gen(config, seed);
      const map = deriveFactionSupport(s);

      // Every power faction gets a bucket (present even if empty).
      const factionNames = (s.powerStructure?.factions || []).map(nameOf).filter(Boolean);
      for (const fn of factionNames) expect(map.has(fn)).toBe(true);

      // The web is not empty: at least one faction has >= 1 supporting institution.
      const total = [...map.values()].reduce((n, edges) => n + edges.length, 0);
      expect(total).toBeGreaterThan(0);

      // Every edge is well-formed and its `why` is from the FROZEN vocabulary.
      for (const [, edges] of map) {
        for (const e of edges) {
          expect(typeof e.name).toBe('string');
          expect(e.name.length).toBeGreaterThan(0);
          expect(KINDS).toContain(e.basis);
          expect(LEGAL_WHY.has(e.why)).toBe(true);
          // F24 copy law: no dashes in the typed phrases.
          expect(/[—–]/.test(e.why)).toBe(false);
        }
      }
    });

    test(`${label}: deterministic — same settlement and same seed yield the same web`, () => {
      const s1 = gen(config, seed);
      expect(serialize(deriveFactionSupport(s1))).toEqual(serialize(deriveFactionSupport(s1)));
      const s2 = gen(config, seed);
      expect(serialize(deriveFactionSupport(s2))).toEqual(serialize(deriveFactionSupport(s1)));
    });

    test(`${label}: every house backs a power, under each power it has a share for and no other, and no house is spent twice (X-45)`, () => {
      const s = gen(config, seed);
      const map = deriveFactionSupport(s);
      const backs = houseBacksOf(s);
      expect(nameOf(governingFactionOf(s))).toBeTruthy(); // the pipeline always seats a ruler
      const listed = new Map(); // house object -> the powers it is listed under
      for (const [faction, edges] of map) {
        for (const e of edges) {
          const list = listed.get(e.institution) || [];
          expect(list, `${e.name} is listed twice under ${faction}`).not.toContain(faction); // anchored: the list is matched against the house own backs below
          list.push(faction);
          listed.set(e.institution, list);
        }
      }
      for (const inst of s.institutions) {
        const own = backs.get(inst.name) || [];
        expect(own.length, `${inst.name} backs nobody`).toBeGreaterThan(0);
        expect([...(listed.get(inst) || [])].sort()).toEqual(own.map((b) => b.faction).sort());
        const spent = own.reduce((a, b) => a + b.share, 0);
        expect(spent, `${inst.name} is spent ${spent} times`).toBeLessThanOrEqual(1 + 1e-9);
        for (const b of own) {
          expect(b.share).toBeGreaterThanOrEqual(0);
          expect(Number.isInteger(b.weight) && b.weight >= 0 && b.weight <= 3).toBe(true);
          if (b.basis === 'default') { expect(b.share).toBe(0); expect(own.length).toBe(1); }
        }
      }
      const ledger = backingLedger(s);
      const landed = ledger.rows.reduce((a, r) => a + r.backed, 0);
      expect(landed).toBeLessThanOrEqual(ledger.weighed + 1e-9);
      expect(landed + ledger.lapsed).toBeCloseTo(ledger.weighed, 6);
      expect(ledger.distance).toBeGreaterThanOrEqual(0);
      expect(ledger.distance).toBeLessThanOrEqual(100);
      if (ledger.rank != null) { expect(ledger.rank).toBeGreaterThanOrEqual(-1); expect(ledger.rank).toBeLessThanOrEqual(1); }
    });

    test(`${label}: founded edges are exact factionSource matches`, () => {
      const s = gen(config, seed);
      const map = deriveFactionSupport(s);
      for (const [faction, edges] of map) {
        for (const e of edges) {
          if (e.basis !== 'founded') continue;
          expect(String(e.institution.factionSource || '').trim().toLowerCase())
            .toBe(faction.trim().toLowerCase());
        }
      }
    });
  }

  test('degrades safely on missing / malformed input', () => {
    expect(deriveFactionSupport(undefined).size).toBe(0);
    expect(deriveFactionSupport({}).size).toBe(0);
    expect(deriveFactionSupport({ powerStructure: { factions: [] }, institutions: [] }).size).toBe(0);
    // Factions present, no institutions -> buckets exist but are empty.
    const m = deriveFactionSupport({ powerStructure: { factions: [{ faction: 'A', category: 'economy' }] }, institutions: [] });
    expect(m.get('A')).toEqual([]);
  });
});

describe('institutionBackers — the names alone (X-40, the owner 2026-11-01)', () => {
  test('every edge of deriveFactionSupport appears once under its house, strongest share first, and nothing else does', () => {
    const settlement = {
      powerStructure: { factions: [
        { faction: 'Religious Authorities', category: 'religious', power: 55 },
        { faction: 'Merchant Council', category: 'merchant', power: 40 },
      ] },
      institutions: [
        { name: 'Great cathedral', factionSource: 'Religious Authorities' },
        { name: 'Counting house', factionSource: 'Merchant Council' },
        { name: 'Hermit shrine' }, // a stranger with no tag, no ruler seated: backs nobody
      ],
    };
    const web = deriveFactionSupport(settlement);
    const inverse = institutionBackers(settlement);
    const expected = new Map();
    for (const [faction, edges] of web) for (const edge of edges) {
      const list = expected.get(edge.institution.name) || [];
      list.push(faction); expected.set(edge.institution.name, list);
    }
    expect([...inverse.entries()]).toEqual([...expected.entries()]);
    expect(inverse.get('Great cathedral')).toEqual(['Religious Authorities']);
    expect(inverse.get('Counting house')).toEqual(['Merchant Council']);
    expect(inverse.has('Hermit shrine')).toBe(false); // anchored on the two houses above
  });
});
