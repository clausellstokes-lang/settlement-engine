/**
 * tests/domain/seat/holderOfSeat.test.js — U3 (CS2, CS11): WHO HOLDS THIS SEAT, READ FROM THE RECORD AND NEVER
 * STORED, with the rule that answered and an explicit audience (SEAT-1 train 1; brief
 * docs/chair/2026-11-20/content/seat/briefs/U3-HOLDER.md, its CURE and SEAT-3's dispatch additions).
 *
 * The arms, in the brief's order (every fixture hand-built; one fixture of each rule arm is a town):
 *   (1) each rule answers its own fixture and only it;
 *   (2) the order: R2 over R3 where both could answer; R1 over R2 where both could;
 *   (3) two transfers in sequence through the real `transferRulingPower`: R1 names the second taker, never the first;
 *       and the one shape that leaves two takers' edges on the current form (a third transfer back to a form the record
 *       held before), which the leaf settles by the transfer's own `recentConflict` sentence;
 *   (4) the audience: a criminal holder installed by `transferRulingPower` (the DM's CHANGE_RULING_POWER path) is named
 *       for 'owner' and refused for 'reader'; a `hidden: true` row the same; a holder whose row the served document
 *       (`publicSafe.js :: toPublicSafe`, read-only use) does not hold is refused for 'reader';
 *   (5) a missing or unknown audience reads as 'reader' (fail closed);
 *   (6) a civic seat with no dual-hat house -> R4; a Feudal Appointee whose appointee heads no house -> R5, no name;
 *   (7) CS22 (c) on the person (the chair, 10:28Z): where the holder took a crowned seat (Royal Authority, through the
 *       real `transferRulingPower`), the keeper of that power's heaviest house is never answered as the seat's person;
 *       the seat's own card is, and `personRule` says so ('crown');
 *   (8) the leaf is a read: it writes nothing (a deep-frozen record) and answers the same twice; the R5 list is
 *       `representatives.js :: APPOINTED_GOVERNMENTS`, restated (that module is a generator), pinned equal here.
 */
import { describe, test, expect } from 'vitest';
import { holderOf, APPOINTED_SEAT_FORMS, isCrownedForm } from '../../../src/domain/seat/holderOfSeat.js';
import { transferRulingPower } from '../../../src/domain/rulingPower.js';
import { toPublicSafe } from '../../../src/domain/display/publicSafe.js';
import { APPOINTED_GOVERNMENTS } from '../../../src/generators/people/representatives.js';
import { GOVERNMENT_FAMILY } from '../../../src/data/cultureOfficeTitles.js';

// ── fixtures ───────────────────────────────────────────────────────────────────────────────────────────────

/** A card the served document keeps whole: its house public (`veiled: false`), each membership stamped. */
const card = (id, name, role, memberships) => ({
  id, name, role, title: role,
  institution: { kind: 'power', key: memberships[0]?.power || '', family: null, title: role, veiled: false },
  memberships: memberships.map((m) => ({ share: 0, veiled: false, ...m })),
});

/** A town with a civic seat (Town Council), its Mayor ranked first of it, and three open powers beside it. */
const civicTown = ({ tier = 'town', mayor = [{ power: 'Town Council', rank: 1 }], extra = [], npcs = null, government = 'Town Council', governingCategory = 'government', relationships = [] } = {}) => ({
  name: 'Brackenford',
  tier,
  powerStructure: {
    government,
    governingName: government,
    factions: [
      { faction: government, category: governingCategory, power: 30, isGoverning: true, modifiers: [] },
      { faction: 'Merchant Guilds', category: 'economy', power: 25, modifiers: [] },
      { faction: 'Noble Houses', category: 'noble', power: 20, modifiers: [] },
      { faction: 'Temple of the Dawn', category: 'religious', power: 15, modifiers: [] },
      ...extra,
    ],
    factionRelationships: relationships,
    publicLegitimacy: { score: 55, label: 'Tolerated', govMultiplier: 1 },
  },
  npcs: npcs || [card('npc_mayor', 'Hilde Brandt', 'Mayor', mayor)],
});

/** Transfer through the real door, asserting it applied (a refused transfer would make every arm vacuous). */
const transfer = (s, winner, opts = { cause: 'coup' }) => {
  const r = transferRulingPower(s, winner, opts);
  expect(r.error, `transfer to ${winner}`).toBeNull();
  return r.settlement;
};

const deepFreeze = (v) => {
  if (v && typeof v === 'object' && !Object.isFrozen(v)) { Object.freeze(v); for (const k of Object.keys(v)) deepFreeze(v[k]); }
  return v;
};

const OWNER = { audience: 'owner' };
const READER = { audience: 'reader' };

// ── (1) each rule answers its own fixture ──────────────────────────────────────────────────────────────────

describe('(1) each rule answers its own fixture, and only it (town-size fixtures)', () => {
  test('R1: the taker of the last transfer (a town council taken by its merchants, through the real transfer)', () => {
    const s = transfer(civicTown(), 'Merchant Guilds');
    expect(s.powerStructure.government).toBe('Merchant City Council');
    const h = holderOf(s, OWNER);
    expect(h.rule).toBe('R1');
    expect(h.holderName).toBe('Merchant Guilds');
    expect(h.holder).toBe(s.powerStructure.factions.find((f) => f.faction === 'Merchant Guilds'));
    expect(h.kind).toBe('merchant');
    expect(h.refused).toBe(false);
  });

  test('R2: the power whose first member is the seat-holder (the dual hat)', () => {
    const s = civicTown({ mayor: [{ power: 'Town Council', rank: 1 }, { power: 'Merchant Guilds', rank: 1 }] });
    const h = holderOf(s, OWNER);
    expect(h.rule).toBe('R2');
    expect(h.holderName).toBe('Merchant Guilds');
    expect(h.person?.name).toBe('Hilde Brandt');
    expect(h.kind).toBe('merchant');
  });

  test('R2 reads the seat-holder less anyone ousted (the filter powerStrata.js :: liveSeatCandidatesOf adds)', () => {
    const s = civicTown({ npcs: [
      { ...card('npc_old', 'Wendel Kurz', 'Mayor', [{ power: 'Town Council', rank: 1 }, { power: 'Noble Houses', rank: 1 }]), ousted: true },
      card('npc_mayor', 'Hilde Brandt', 'Mayor', [{ power: 'Town Council', rank: null }, { power: 'Merchant Guilds', rank: 1 }]),
    ] });
    const h = holderOf(s, OWNER);
    expect(h.person?.name).toBe('Hilde Brandt');
    expect(h.rule).toBe('R2');
    expect(h.holderName).toBe('Merchant Guilds');
  });

  test('R3: a seat of a kind with no dual hat: the leading open power of that kind (by power, then name)', () => {
    const s = civicTown({
      government: 'Military Council', governingCategory: 'military',
      mayor: [{ power: 'Military Council', rank: 1 }],
      extra: [
        { faction: 'Militia Muster', category: 'military', power: 22, modifiers: [] },
        { faction: 'Town Watch', category: 'military', power: 22, modifiers: [] },
        { faction: 'Black Lantern', category: 'military', power: 40, hidden: true, modifiers: [] },
      ],
    });
    const h = holderOf(s, OWNER);
    expect(h.rule).toBe('R3');
    // the hidden one is heavier but not open; the tie at 22 goes by codepoint name order
    expect(h.holderName).toBe('Militia Muster');
    expect(h.kind).toBe('military');
  });

  test('R4: a civic seat whose holder heads no other power: the office holds itself', () => {
    const h = holderOf(civicTown(), OWNER);
    expect(h).toMatchObject({ rule: 'R4', holder: null, holderName: null, kind: 'government', refused: false });
    expect(h.person?.name).toBe('Hilde Brandt');
  });

  test('R5: an appointed form whose appointee heads no house: "appointed", nobody named', () => {
    const s = civicTown({ government: 'Feudal Appointee', governingCategory: 'government', mayor: [{ power: 'Feudal Appointee', rank: 1 }] });
    // no noble power may stand beside it, or R3 (a noble seat) would answer first
    s.powerStructure.factions = s.powerStructure.factions.filter((f) => f.faction !== 'Noble Houses');
    const h = holderOf(s, OWNER);
    expect(h).toMatchObject({ rule: 'R5', holder: null, holderName: null, kind: 'noble' });
    expect(h.person?.name).toBe('Hilde Brandt');
  });

  test('none: a record with no governing seat', () => {
    const s = civicTown();
    s.powerStructure.factions = s.powerStructure.factions.map((f) => ({ ...f, isGoverning: false }));
    s.powerStructure.governingName = '';
    expect(holderOf(s, OWNER)).toMatchObject({ rule: 'none', holder: null, holderName: null, person: null, kind: null });
  });
});

// ── (2) the order ──────────────────────────────────────────────────────────────────────────────────────────

describe('(2) the order', () => {
  test('R2 over R3: the dual-hat house holds even where an open power of the seat\'s own kind stands', () => {
    const s = civicTown({
      government: 'Military Council', governingCategory: 'military',
      mayor: [{ power: 'Military Council', rank: 1 }, { power: 'Merchant Guilds', rank: 1 }],
      extra: [{ faction: 'Town Watch', category: 'military', power: 22, modifiers: [] }],
    });
    const h = holderOf(s, OWNER);
    expect(h.rule).toBe('R2');
    expect(h.holderName).toBe('Merchant Guilds');
  });

  test('R1 over R2: the taker of the transfer holds even where the person heads another power', () => {
    // the person ranked first of the NEW form, as a cast regeneration after the transfer could write it
    const s = transfer(civicTown({ mayor: [
      { power: 'Town Council', rank: 1 }, { power: 'Merchant Guilds', rank: 1 }, { power: 'Ducal Governorship', rank: 1 },
    ] }), 'Noble Houses');
    expect(s.powerStructure.government).toBe('Ducal Governorship');
    const h = holderOf(s, OWNER);
    expect(h.person?.name).toBe('Hilde Brandt');
    expect(h.rule).toBe('R1');
    expect(h.holderName).toBe('Noble Houses');
  });
});

// ── (3) two transfers ──────────────────────────────────────────────────────────────────────────────────────

describe('(3) transfers in sequence through the real transferRulingPower', () => {
  test('two transfers: R1 names the second taker, never the first (whose edge the record still holds)', () => {
    const once = transfer(civicTown(), 'Merchant Guilds');
    const twice = transfer(once, 'Noble Houses');
    expect(twice.powerStructure.government).toBe('Ducal Governorship');
    // the first taker's edge survives, re-keyed onto the new form, its narrative naming the old one
    const first = twice.powerStructure.factionRelationships.find((r) => r.pair.includes('Merchant Guilds'));
    expect(first.pair).toEqual(['Ducal Governorship', 'Merchant Guilds']);
    expect(first.narrative).toBe('Merchant Guilds is the power behind the merchant city council. The seat answers to them now.');
    const h = holderOf(twice, OWNER);
    expect(h.rule).toBe('R1');
    expect(h.holderName).toBe('Noble Houses');
  });

  test('two takers on the current form (a third transfer back to a form held before): the transfer\'s own sentence decides', () => {
    // Coin Exchange carries a birth edge with the seat, at the HEAD of the list, so the third transfer rewrites it in place
    // as the power-behind edge: array order alone would name the stale first taker (Merchant Guilds), whose edge sits later
    const start = civicTown({
      extra: [{ faction: 'Coin Exchange', category: 'merchant', power: 18, modifiers: [] }],
      relationships: [{ pair: ['Town Council', 'Coin Exchange'], type: 'competitive', direction: 'stable', narrative: 'They haggle over the market dues.' }],
    });
    const third = transfer(transfer(transfer(start, 'Merchant Guilds'), 'Noble Houses'), 'Coin Exchange');
    expect(third.powerStructure.government).toBe('Merchant City Council');
    const behind = third.powerStructure.factionRelationships
      .filter((r) => r.narrative?.endsWith('is the power behind the merchant city council. The seat answers to them now.'))
      .map((r) => r.pair.find((n) => n !== 'Merchant City Council'));
    expect(behind).toEqual(['Coin Exchange', 'Merchant Guilds']);
    const h = holderOf(third, OWNER);
    expect(h.rule).toBe('R1');
    expect(h.holderName).toBe('Coin Exchange');
  });
});

// ── (4) the audience ───────────────────────────────────────────────────────────────────────────────────────

describe('(4) the audience', () => {
  const withCriminal = () => civicTown({ extra: [{ faction: 'The Shadow Hand', category: 'criminal', power: 18, modifiers: [] }] });
  const withHidden = () => civicTown({ extra: [{ faction: 'Iron Circle', category: 'military', power: 22, hidden: true, modifiers: [] }] });

  test('a criminal holder installed by transferRulingPower (the DM\'s CHANGE_RULING_POWER path): named for the owner, refused for the reader', () => {
    const s = transfer(withCriminal(), 'The Shadow Hand');
    const owner = holderOf(s, OWNER);
    expect(owner).toMatchObject({ rule: 'R1', holderName: 'The Shadow Hand', kind: 'criminal', refused: false });
    const reader = holderOf(s, READER);
    expect(reader).toMatchObject({ rule: 'R1', holder: null, holderName: null, refused: true });
    // the office and the person stand; the kind is the office's own (the form), never the refused holder's
    expect(reader.person).toBe(owner.person);
    expect(reader.kind).toBe('criminal');
    // the served document keeps the criminal row (only a hidden row leaves): refused there too
    const served = toPublicSafe(s);
    expect(served.powerStructure.factions.map((f) => f.faction)).toContain('The Shadow Hand');
    expect(holderOf(served, READER)).toMatchObject({ rule: 'R1', holder: null, refused: true });
  });

  test('a hidden: true holder: named for the owner, refused for the reader', () => {
    const s = transfer(withHidden(), 'Iron Circle');
    expect(holderOf(s, OWNER)).toMatchObject({ rule: 'R1', holderName: 'Iron Circle', refused: false });
    expect(holderOf(s, READER)).toMatchObject({ rule: 'R1', holder: null, holderName: null, refused: true });
  });

  test('a holder whose row the served document does not hold (toPublicSafe drops the hidden row and masks its name): refused for the reader', () => {
    const s = transfer(withHidden(), 'Iron Circle');
    const served = toPublicSafe(s);
    // non-vacuous: the served document still carries the power-behind edge, its taker masked, and holds no row for it
    const edge = served.powerStructure.factionRelationships.find((r) => /is the power behind the/.test(r.narrative || ''));
    expect(edge.pair).toEqual([served.powerStructure.government, 'an unseen interest']);
    expect(served.powerStructure.factions.map((f) => f.faction)).toEqual(['Military Council', 'Merchant Guilds', 'Noble Houses', 'Temple of the Dawn']);
    const reader = holderOf(served, READER);
    expect(reader).toMatchObject({ rule: 'R1', holder: null, holderName: null, refused: true });
  });

  test('a served document with an open holder: the reader is told it (the refusal is not blanket)', () => {
    const served = toPublicSafe(transfer(civicTown(), 'Merchant Guilds'));
    expect(holderOf(served, READER)).toMatchObject({ rule: 'R1', holderName: 'Merchant Guilds', refused: false });
  });

  test('the reader refuses a dual-hat house that is criminal (R2), and the person stands', () => {
    const s = civicTown({
      extra: [{ faction: 'The Shadow Hand', category: 'criminal', power: 18, modifiers: [] }],
      mayor: [{ power: 'Town Council', rank: 1 }, { power: 'The Shadow Hand', rank: 1 }],
    });
    expect(holderOf(s, OWNER)).toMatchObject({ rule: 'R2', holderName: 'The Shadow Hand' });
    const reader = holderOf(s, READER);
    expect(reader).toMatchObject({ rule: 'R2', holder: null, holderName: null, refused: true, kind: 'government' });
    expect(reader.person?.name).toBe('Hilde Brandt');
  });

  test('the reader never answers a veiled face as the person (a card whose house is veiled or unstamped)', () => {
    const s = civicTown({ npcs: [
      { ...card('npc_veiled_0123456789abcdef', 'Corvin Ash', 'Mayor', [{ power: 'Town Council', rank: 1 }]), institution: { kind: 'power', key: 'Town Council', family: null, title: 'Mayor', veiled: true } },
      card('npc_mayor', 'Hilde Brandt', 'Mayor', [{ power: 'Town Council', rank: null }]),
    ] });
    expect(holderOf(s, OWNER).person?.name).toBe('Corvin Ash');
    expect(holderOf(s, READER).person?.name).toBe('Hilde Brandt');
  });
});

// ── (5) the missing audience ───────────────────────────────────────────────────────────────────────────────

describe('(5) a missing or unknown audience reads as the reader (fail closed)', () => {
  const s = () => transfer(civicTown({ extra: [{ faction: 'The Shadow Hand', category: 'criminal', power: 18, modifiers: [] }] }), 'The Shadow Hand');
  const cases = [
    ['no options', undefined],
    ['empty options', {}],
    ['an unknown audience', { audience: 'dm' }],
    ['a near miss', { audience: 'Owner' }],
  ];
  for (const [label, options] of cases) {
    test(label, () => {
      const settlement = s();
      expect(holderOf(settlement, options)).toEqual(holderOf(settlement, READER));
      expect(holderOf(settlement, options)).toMatchObject({ rule: 'R1', holder: null, refused: true });
    });
  }
});

// ── (6) the office ─────────────────────────────────────────────────────────────────────────────────────────

describe('(6) nobody outside: the office, or the one who appoints', () => {
  test('a civic seat with no dual-hat house -> R4, at a village and at a town', () => {
    expect(holderOf(civicTown({ tier: 'village', government: 'Elder Council', mayor: [{ power: 'Elder Council', rank: 1 }] }), OWNER).rule).toBe('R4');
    expect(holderOf(civicTown(), OWNER).rule).toBe('R4');
  });

  test('a Feudal Appointee whose appointee heads no house -> R5, no name (and an " Ascendant" form reads as its form)', () => {
    for (const government of ['Feudal Appointee', 'Feudal Appointee Ascendant']) {
      const s = civicTown({ government, mayor: [{ power: government, rank: 1 }] });
      s.powerStructure.factions = s.powerStructure.factions.filter((f) => f.faction !== 'Noble Houses');
      expect(holderOf(s, OWNER)).toMatchObject({ rule: 'R5', holder: null, holderName: null });
      expect(holderOf(s, READER)).toMatchObject({ rule: 'R5', holder: null, holderName: null, refused: false });
    }
  });
});

// ── (7) CS22 (c): the crown wears one hat ──────────────────────────────────────────────────────────────────

describe('(7) CS22 (c): the keeper of the taker\'s heaviest house is never the crowned seat\'s person', () => {
  // the keeper of Noble Houses' heaviest house, ranked first of the new crown form as a cast regeneration could write it,
  // beside the seat's own card (a member of the seat, titled by the office)
  const keeper = () => card('npc_keeper', 'Ottokar Hale', 'Lord of the Manor', [{ power: 'Noble Houses', rank: 1 }, { power: 'Royal Authority', rank: 1 }]);
  const seatCard = () => card('npc_seat', 'Magda Roth', 'Governor', [{ power: 'Royal Authority', rank: null }]);

  test('Royal Authority taken by its noble house: the seat\'s own card is the person, the keeper never', () => {
    const s = transfer(civicTown({ tier: 'city', government: 'City Council', npcs: [keeper(), seatCard()] }), 'Noble Houses');
    expect(s.powerStructure.government).toBe('Royal Authority');
    for (const options of [OWNER, READER]) {
      const h = holderOf(s, options);
      expect(h).toMatchObject({ rule: 'R1', holderName: 'Noble Houses', personRule: 'crown' });
      expect(h.person?.name).toBe('Magda Roth');
    }
  });

  test('the keeper alone in the seat: the person is nobody, never the keeper', () => {
    const s = transfer(civicTown({ tier: 'city', government: 'City Council', npcs: [keeper()] }), 'Noble Houses');
    const h = holderOf(s, OWNER);
    expect(h).toMatchObject({ rule: 'R1', holderName: 'Noble Houses', person: null, personRule: 'crown' });
  });

  test('control: a form that is not crowned (Ducal Governorship, a town) keeps the keeper as the person', () => {
    const k = card('npc_keeper', 'Ottokar Hale', 'Lord of the Manor', [{ power: 'Noble Houses', rank: 1 }, { power: 'Ducal Governorship', rank: 1 }]);
    const s = transfer(civicTown({ npcs: [k] }), 'Noble Houses');
    expect(s.powerStructure.government).toBe('Ducal Governorship');
    const h = holderOf(s, OWNER);
    expect(h).toMatchObject({ rule: 'R1', holderName: 'Noble Houses', personRule: 'seat' });
    expect(h.person?.name).toBe('Ottokar Hale');
  });

  test('the crown test: Royal Authority where the sovereign row writes a crown word; no other form today', () => {
    expect(isCrownedForm('Royal Authority', 'city')).toBe(true);
    expect(isCrownedForm('Royal Authority', 'metropolis')).toBe(true);
    expect(isCrownedForm('Royal Authority Ascendant', 'city')).toBe(true);
    // the smallest sizes' sovereign word (Chieftain) is not a crown word
    expect(isCrownedForm('Royal Authority', 'village')).toBe(false);
    const others = Object.keys(GOVERNMENT_FAMILY).filter((form) => form !== 'Royal Authority' && isCrownedForm(form, 'metropolis'));
    expect(others).toEqual([]);
  });
});

// ── (8) a read, and the restated list ──────────────────────────────────────────────────────────────────────

describe('(8) a pure read', () => {
  test('writes nothing (a deep-frozen record) and answers the same twice, for both audiences', () => {
    const s = deepFreeze(transfer(civicTown({ mayor: [{ power: 'Town Council', rank: 1 }, { power: 'Merchant Guilds', rank: 1 }] }), 'Noble Houses'));
    for (const options of [OWNER, READER]) expect(holderOf(s, options)).toEqual(holderOf(s, options));
  });

  test('the R5 list is representatives.js :: APPOINTED_GOVERNMENTS, member for member, and the title table\'s appointed family', () => {
    expect([...APPOINTED_SEAT_FORMS]).toEqual([...APPOINTED_GOVERNMENTS]);
    expect(Object.keys(GOVERNMENT_FAMILY).filter((form) => GOVERNMENT_FAMILY[form] === 'appointed').sort()).toEqual([...APPOINTED_GOVERNMENTS].sort());
  });
});
