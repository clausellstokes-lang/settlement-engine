/**
 * faceHonorifics.test.js — THE HONORIFIC REGISTRY IS TOTAL AND EXACT (PEOPLE-6 LINKS step 2).
 *
 * Every title a face can be born with (the census's `face` on every catalog row, the seat mint's
 * table, the `other` mint's table) has exactly one honorific in src/data/faceHonorifics.js, and the
 * registry names no title that no face can carry. The owner's and the chair's named forms are pinned.
 */
import { describe, it, expect } from 'vitest';
import { FACE_HONORIFICS, FACE_HONORIFICS_BY_CULTURE, FACE_HONORIFICS_INLAND, honorificOfTitle } from '../../src/data/faceHonorifics.js';
import { CULTURES } from '../../src/data/worldFactOptions.js';
import { cardHonorificOf } from '../../src/domain/people/cardDoor.js';
import { faceRows } from '../../src/data/institutionalCatalog.js';
import { SEAT_MINT_TITLES, OTHER_MINT_ROWS, headOf } from '../../src/generators/people/mintTitles.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const bornTitles = () => {
  const out = new Set();
  for (const r of faceRows()) if (r.face && r.face !== 'seat') out.add(r.face);
  for (const t of Object.values(SEAT_MINT_TITLES)) out.add(t);
  for (const r of Object.values(OTHER_MINT_ROWS)) out.add(r.title);
  return out;
};

describe('the honorific registry', () => {
  it('names every title a face can be born with, and no other', () => {
    const born = bornTitles();
    const named = new Set(Object.keys(FACE_HONORIFICS));
    expect([...born].filter((t) => !named.has(t))).toEqual([]);
    expect([...named].filter((t) => !born.has(t))).toEqual([]);
    expect(named.size).toBe(212);
  });

  it('every pool holds one to five forms, each capitalised, gendered forms carrying both', () => {
    let forms = 0;
    for (const [title, pool] of Object.entries(FACE_HONORIFICS)) {
      expect(pool.length >= 1 && pool.length <= 5, title).toBe(true);
      for (const h of pool) {
        for (const f of typeof h === 'string' ? [h] : [h.male, h.female]) expect(/^[A-Z]/.test(f), title).toBe(true);
        forms += 1;
      }
    }
    expect(forms).toBe(373);
  });

  it('the pick is deterministic and reaches every form of a pool', () => {
    const seen = new Set();
    for (let i = 0; i < 200; i += 1) seen.add(honorificOfTitle('the priest', 'male', `npc_${i}::Parish church`));
    expect([...seen].sort()).toEqual(['Father', 'Pastor', 'Reverend', 'Vicar']);
    expect(honorificOfTitle('the priest', 'male', 'npc_robert::Parish church')).toBe(honorificOfTitle('the priest', 'male', 'npc_robert::Parish church'));
    const seenF = new Set();
    for (let i = 0; i < 200; i += 1) seenF.add(honorificOfTitle('the priest', 'female', `npc_${i}::Parish church`));
    expect([...seenF].sort()).toEqual(['Mother', 'Pastor', 'Reverend', 'Vicar']);
  });

  it("pins the owner's and the chair's named forms as each pool's canonical (seedless) form", () => {
    const want = {
      'the priest': 'Pastor', 'the mayor': 'Mayor', 'the abbot': 'Abbot', 'the bishop': 'Bishop',
      'the militia captain': 'Captain', 'the watch captain': 'Captain', 'the watch sergeant': 'Sergeant',
      'the watch commander': 'Commander', 'the garrison commander': 'Commander', 'the castellan': 'Castellan',
      'the magistrate': 'Magistrate', 'the harbour master': 'Harbourmaster', 'the customs collector': 'Collector',
      'the mint master': 'Mintmaster', 'the senior guild master': 'Guildmaster', 'the master smith': 'Master Smith',
      'the master weaver': 'Master Weaver', 'the master baker': 'Master Baker', 'the steward': 'Steward',
      'the reeve': 'Reeve', 'the headman': 'Headman', 'the eldest': 'Elder', 'the innkeeper': 'Innkeeper',
      'the ferryman': 'Ferryman', 'the guildmaster of thieves': 'Guildmaster',
      'the fence': 'Fence', 'the smuggler': 'Smuggler', "the revolt's leader": 'Leader of the revolt',
    };
    for (const [title, form] of Object.entries(want)) expect(honorificOfTitle(title), title).toBe(form);
    // POWERS-9 (re-keyed by identity, the cause: a gendered trade word follows the person, pf#250): the alewife's named
    // form is the woman's; a man (and the seedless masculine default) reads the pool's own "Brewster"
    expect(honorificOfTitle('the alewife', 'female')).toBe('Alewife');
    expect(honorificOfTitle('the alewife', 'male')).toBe('Brewster');
  });

  it('resolves the gendered forms by the card gender, the masculine by default', () => {
    expect(honorificOfTitle('the monarch', 'female')).toBe('Queen');
    expect(honorificOfTitle('the monarch', 'male')).toBe('King');
    expect(honorificOfTitle('the monarch')).toBe('King');
  });

  it("the seat mint's fallback and an unregistered title fall back to their own words", () => {
    expect(honorificOfTitle(headOf('Oak Moot'))).toBe('Head of Oak Moot');
    expect(honorificOfTitle('the ferry-warden')).toBe('Ferry-warden');
    expect(honorificOfTitle('')).toBe('');
    expectAbsentWithAnchor(Object.keys(FACE_HONORIFICS), 'the ferry-warden', 'the ferryman', 'an unregistered title');
  });
});

// MERGE-CAR (the chair's ruling on the soak's A-11 mover at the people car's tip: "Master of the Harbour" printed for the
// harbour master's face on LANDLOCKED metropolises): the pick is guarded by the settlement's coast, display-only.
describe("the harbour master's pool is the one its coast admits (A-11)", () => {
  const harbourCard = { id: 'npc_h', name: 'Ada Reed', institution: { kind: 'house', key: "Harbour master's office", name: "Harbour master's office", title: 'the harbour master' } };
  const place = (terrainType, tradeRouteAccess) => ({ config: { terrainType, tradeRouteAccess }, institutions: [] });
  const seeds = Array.from({ length: 40 }, (_, i) => `seed-${i}`);
  it('a settlement with NO coast (inland, or a river port) reads Dockmaster or Wharfinger, never a harbour form', () => {
    expect(FACE_HONORIFICS_INLAND['the harbour master']).toEqual(['Dockmaster', 'Wharfinger']);
    const inland = new Set(seeds.map((seed) => honorificOfTitle('the harbour master', null, seed, { coastal: false })));
    expect([...inland].sort()).toEqual(['Dockmaster', 'Wharfinger']);
    // the card resolver reads the coast from the record: a river port is not a coast
    for (const s of [place('plains', 'river'), place('mountains', 'road')]) {
      const h = cardHonorificOf(harbourCard, s);
      expect(['Dockmaster', 'Wharfinger'], JSON.stringify(s.config)).toContain(h);
    }
    // anchored: the harbour forms exist in the registry, and the inland pick names neither
    expectAbsentWithAnchor([...inland], 'Master of the Harbour', 'Dockmaster', 'a harbour form an inland harbour master never reads');
    expectAbsentWithAnchor([...inland], 'Harbourmaster', 'Wharfinger', 'a harbour form an inland harbour master never reads');
  });
  it('a COASTAL settlement, and a card read with no place, keep the registry\'s pool: Harbourmaster or Master of the Harbour', () => {
    const coastal = new Set(seeds.map((seed) => honorificOfTitle('the harbour master', null, seed, { coastal: true })));
    expect([...coastal].sort()).toEqual(['Harbourmaster', 'Master of the Harbour']);
    expect(['Harbourmaster', 'Master of the Harbour']).toContain(cardHonorificOf(harbourCard, place('coastal', 'port')));
    expect(['Harbourmaster', 'Master of the Harbour']).toContain(cardHonorificOf(harbourCard));
    // the guard is the harbour's alone: an inland place leaves every other title's pool as the registry holds it
    expect(Object.keys(FACE_HONORIFICS_INLAND)).toEqual(['the harbour master']);
  });
});

// WRITE-TITLES-14 (WAVE-RULINGS item 14): the settlement's culture picks the culture's own pool for an office it names;
// any other culture, title or place reads the registry's pool — the fallback, display-only.
describe("the settlement's culture picks its own word for the office (item 14)", () => {
  const seeds = Array.from({ length: 40 }, (_, i) => `seed-${i}`);
  const formsOf = (title, gender, place) => [...new Set(seeds.map((seed) => honorificOfTitle(title, gender, seed, place)))].sort();
  it("the owner's two: a Norse place's lord and headman read Jarl, a Celtic place's priest reads Druid", () => {
    expect(formsOf('the lord', 'male', { culture: 'norse' })).toEqual(['Jarl']);
    expect(formsOf('the headman', 'female', { culture: 'norse' })).toEqual(['Jarl']);
    expect(formsOf('the priest', 'female', { culture: 'celtic' })).toEqual(['Druid']);
    expect(honorificOfTitle('the priest', 'female', 'seed-1', { culture: 'norse' })).toBe('Gydja');
    expect(honorificOfTitle('the priest', 'male', 'seed-1', { culture: 'norse' })).toBe('Godi');
  });
  it("a title the culture names no form for reads the registry's pool", () => {
    expect(formsOf('the mayor', 'male', { culture: 'celtic' })).toEqual(formsOf('the mayor', 'male'));
    expect(formsOf('the priest', 'male', { culture: 'germanic' })).toEqual(['Father', 'Pastor', 'Reverend', 'Vicar']);
  });
  it("a culture with no pool, 'mixed', an unknown key and no culture all read the registry's pool", () => {
    for (const culture of ['mixed', 'random_culture', 'atlantean', null, undefined]) {
      expect(formsOf('the lord', 'female', { culture }), String(culture)).toEqual(['Lady']);
      expect(formsOf('the priest', 'male', { culture }), String(culture)).toEqual(['Father', 'Pastor', 'Reverend', 'Vicar']);
    }
    expect(formsOf('the lord', 'female')).toEqual(['Lady']);
    // east_asian names the lord alone: its priest reads the registry
    expect(formsOf('the priest', 'male', { culture: 'east_asian' })).toEqual(['Father', 'Pastor', 'Reverend', 'Vicar']);
  });
  it('the coast guard and the culture read compose: an inland Norse harbour master is still a Dockmaster or Wharfinger', () => {
    expect(formsOf('the harbour master', null, { coastal: false, culture: 'norse' })).toEqual(['Dockmaster', 'Wharfinger']);
  });
  it("the card door reads the settlement's culture through the one culture read, and falls back without one", () => {
    const lordCard = { id: 'npc_l', name: 'Sigrid Ulfsdottir', gender: 'female', institution: { kind: 'power', key: 'Noble Houses', name: 'Noble Houses', title: 'the lord' } };
    const priestCard = { id: 'npc_p', name: 'Bran Mac Lir', gender: 'male', institution: { kind: 'house', key: 'Parish church', name: 'Parish church', title: 'the priest' } };
    expect(cardHonorificOf({ ...lordCard, gender: 'male' }, { config: { culture: 'norse' }, institutions: [] })).toBe('Jarl');
    expect(cardHonorificOf(lordCard, { config: { culture: 'steppe' }, institutions: [] })).toBe('Khatun');
    // the materialized identity is the second leg, for a config-stripped save
    expect(cardHonorificOf(priestCard, { culturalIdentity: { key: 'celtic' }, institutions: [] })).toBe('Druid');
    // no settlement culture, no settlement, and a 'mixed' place: the registry
    expect(cardHonorificOf(lordCard, { config: {}, institutions: [] })).toBe('Lady');
    expect(cardHonorificOf(lordCard)).toBe('Lady');
    expect(cardHonorificOf(lordCard, { config: { culture: 'mixed' }, culturalIdentity: { key: 'mixed' }, institutions: [] })).toBe('Lady');
  });
});

// WRITE-TITLES-14: THE CULTURE TABLE IS PINNED WHOLE — every (culture, title) variant, read through the resolver and the card door
// by both genders; a culture or title added, dropped or re-worded reds here and names itself.
describe('every culture-keyed honorific is pinned (item 14)', () => {
  // the LEADERSHIP, FAITH and WARDEN titles the item admits; a culture pool on any other title reds
  const SCOPE = new Set([
    'the eldest', 'the village elder', 'the headman', 'the lord', 'the mayor', 'the monarch', 'the governor', 'the royal governor',
    'the occupying governor', 'the war-leader', 'the priest', 'the elder priest', 'the high priest',
    'the commander', 'the garrison commander', 'the watch captain', 'the watch commander',
  ]);
  /** culture → title → [masculine form, feminine form] */
  const PINS = {
    germanic: { 'the mayor': ['Burgomaster', 'Burgomaster'] },
    latin: {
      'the lord': ['Dominus', 'Domina'], 'the high priest': ['Pontifex', 'Pontifex'], 'the watch captain': ['Tribune', 'Tribune'],
      'the watch commander': ['Prefect', 'Prefect'], 'the garrison commander': ['Prefect', 'Prefect'],
    },
    celtic: {
      'the headman': ['Chieftain', 'Chieftain'], 'the priest': ['Druid', 'Druid'], 'the elder priest': ['Druid', 'Druid'],
      'the high priest': ['Druid', 'Druid'],
    },
    arabic: {
      'the eldest': ['Sheikh', 'Sheikh'], 'the village elder': ['Sheikh', 'Sheikh'], 'the headman': ['Sheikh', 'Sheikh'],
      'the lord': ['Emir', 'Emir'], 'the governor': ['Wali', 'Wali'], 'the royal governor': ['Wali', 'Wali'],
      'the priest': ['Imam', 'Imam'], 'the elder priest': ['Imam', 'Imam'], 'the garrison commander': ['Qaid', 'Qaid'],
    },
    norse: {
      'the lord': ['Jarl', 'Jarl'], 'the headman': ['Jarl', 'Jarl'], 'the priest': ['Godi', 'Gydja'],
      'the elder priest': ['Godi', 'Gydja'], 'the high priest': ['Godi', 'Gydja'],
    },
    slavic: {
      'the eldest': ['Starosta', 'Starosta'], 'the village elder': ['Starosta', 'Starosta'], 'the headman': ['Starosta', 'Starosta'],
      'the lord': ['Boyar', 'Boyarina'], 'the war-leader': ['Voivode', 'Voivode'], 'the commander': ['Voivode', 'Voivode'],
      'the garrison commander': ['Voivode', 'Voivode'], 'the governor': ['Voivode', 'Voivode'],
    },
    mesoamerican: { 'the lord': ['Tlatoani', 'Tlatoani'], 'the monarch': ['Huey Tlatoani', 'Huey Tlatoani'], 'the priest': ['Tlamacazqui', 'Tlamacazqui'] },
    south_asian: {
      'the headman': ['Mukhiya', 'Mukhiya'], 'the lord': ['Raja', 'Rani'], 'the monarch': ['Maharaja', 'Maharani'], 'the priest': ['Purohit', 'Purohit'],
    },
    steppe: {
      'the lord': ['Khan', 'Khatun'], 'the war-leader': ['Noyan', 'Noyan'], 'the occupying governor': ['Darughachi', 'Darughachi'],
      'the priest': ['Shaman', 'Shaman'],
    },
    east_asian: { 'the lord': ['Daimyo', 'Daimyo'] },
    greek: { 'the mayor': ['Archon', 'Archon'], 'the commander': ['Strategos', 'Strategos'], 'the high priest': ['Hierophant', 'Hierophant'] },
  };
  const seeds = Array.from({ length: 24 }, (_, i) => `seed-${i}`);

  it('names only canonical cultures and only registered titles in scope; every canonical culture names one', () => {
    expect(Object.keys(FACE_HONORIFICS_BY_CULTURE).sort()).toEqual(Object.keys(PINS).sort());
    for (const culture of Object.keys(FACE_HONORIFICS_BY_CULTURE)) {
      expect(CULTURES, culture).toContain(culture);
      for (const title of Object.keys(FACE_HONORIFICS_BY_CULTURE[culture])) {
        expect(Object.keys(FACE_HONORIFICS), `${culture} ${title}`).toContain(title);
        expect(SCOPE.has(title), `${culture} ${title}`).toBe(true);
      }
    }
    expect(Object.keys(FACE_HONORIFICS_BY_CULTURE).sort()).toEqual([...CULTURES].sort());
    expect(Object.values(PINS).reduce((n, t) => n + Object.keys(t).length, 0)).toBe(47);
  });

  it('every (culture, title) reads exactly its pinned forms by gender, through the resolver and the card door', () => {
    for (const [culture, titles] of Object.entries(PINS)) {
      expect(Object.keys(FACE_HONORIFICS_BY_CULTURE[culture]).sort(), culture).toEqual(Object.keys(titles).sort());
      for (const [title, [male, female]] of Object.entries(titles)) {
        const at = `${culture} ${title}`;
        expect([...new Set(seeds.map((seed) => honorificOfTitle(title, 'male', seed, { culture })))], at).toEqual([male]);
        expect([...new Set(seeds.map((seed) => honorificOfTitle(title, 'female', seed, { culture })))], at).toEqual([female]);
        expect(honorificOfTitle(title, undefined, undefined, { culture }), at).toBe(male);
        const card = { id: 'npc_x', name: 'A B', gender: 'female', institution: { kind: 'house', key: 'K', name: 'K', title } };
        expect(cardHonorificOf(card, { config: { culture }, institutions: [] }), at).toBe(female);
        // the same card on a settlement with no culture reads the registry's pool, never the culture's form
        const fallback = cardHonorificOf(card, { config: {}, institutions: [] });
        expect(fallback, at).toBe(honorificOfTitle(title, 'female', 'npc_x::K'));
      }
    }
  });
});
