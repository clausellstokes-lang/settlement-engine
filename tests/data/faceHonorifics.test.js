/**
 * faceHonorifics.test.js — THE HONORIFIC REGISTRY IS TOTAL AND EXACT (PEOPLE-6 LINKS step 2).
 *
 * Every title a face can be born with (the census's `face` on every catalog row, the seat mint's
 * table, the `other` mint's table) has exactly one honorific in src/data/faceHonorifics.js, and the
 * registry names no title that no face can carry. The owner's and the chair's named forms are pinned.
 */
import { describe, it, expect } from 'vitest';
import { FACE_HONORIFICS, FACE_HONORIFICS_INLAND, honorificOfTitle } from '../../src/data/faceHonorifics.js';
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
      'the ferryman': 'Ferryman', 'the alewife': 'Alewife', 'the guildmaster of thieves': 'Guildmaster',
      'the fence': 'Fence', 'the smuggler': 'Smuggler', "the revolt's leader": 'Leader of the revolt',
    };
    for (const [title, form] of Object.entries(want)) expect(honorificOfTitle(title), title).toBe(form);
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
