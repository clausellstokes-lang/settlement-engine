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
 *   (9) U4-CURE (the chair, 13:50Z; brief U4-CURE.md, cure 2): the leaf's static import closure reaches no
 *       `spatial/cohesionWeave.js`, so `rulingPowerCoup.js`'s import of it widens no surface's reach of the
 *       "fear on candidates" identity (`writerReach.walker`); the veil read it uses instead of `cardVeil.js`
 *       (`seatTable.js :: isVeiledRow`) answers `cardVeil.js :: isVeiledPower`'s answer on every row shape here.
 *  (10) U4-CURE2 Step 2, as SEAT-5's addendum amends it (CS11): for every audience that is not the owner's ('reader',
 *       missing, null, '', 'public', 'dm'), `holderOf` on a SERVED document (`publicSafe.js :: toPublicSafe`, read-only
 *       use as in (4)) names no criminal and no hidden power anywhere in its answer (`holderName` and `person`
 *       included). Town-size fixtures whose last transfer's taker is (a) criminal, (b) hidden, (c) open beside a
 *       criminal power's symbiotic/stable edge on the same form; and (d) a born-shape town whose seat has a
 *       symbiotic/stable edge with its military power and no transfer on record, which answers no R1.
 *  (11) U4-CURE2 Step 1′ (the chair 14:44Z, Addendum 2): ONE matcher (`transferSentenceSays`) and ONE frozen list
 *       (`TRANSFER_WORDINGS`) read both of the transfer's sentences; the real `transferRulingPower`, on every cause with
 *       and without the demotion, writes only wordings the list holds; a town in the frozen wording still reads its
 *       taker when a made-up new wording stands first in the list; (a) a born seat's symbiotic/stable edge with its
 *       military power names no taker; (c) the DM's faction rename after a transfer
 *       (`store/settlementRenameHelpers.js :: renameFactionImpl` -> `factionRename.js :: applyFactionRenameToSettlement`):
 *       renaming the taker, or a bystander, leaves R1 the right power for the owner and the reader.
 *  (12) U4-CURE2 Addendum 3 (the chair 15:17Z, FAIL CLOSED INSIDE THE LEAF): renaming the SEAT after a transfer leaves
 *       an edge on the seat's pair in a frozen wording written for ANOTHER form, and no edge for the current one: R1
 *       answers NOBODY, for the owner and the reader, with no fall-through to R2 or R3 (it answered R3 Coin Exchange for
 *       Merchant Guilds before). Condition 1: "nobody" is an omission: `dossier/powerStrata.js :: derivePowerStrata`, on
 *       the record and on the served document, names the seat's form, says nothing of a vacant seat, and lists the
 *       contest's contenders with no holder removed.
 */
import { describe, test, expect } from 'vitest';
import { holderOf, APPOINTED_SEAT_FORMS, isCrownedForm, TRANSFER_WORDINGS, transferSentenceSays, transferTakerOf } from '../../../src/domain/seat/holderOfSeat.js';
import { transferRulingPower, RULING_POWER_CAUSES } from '../../../src/domain/rulingPower.js';
import { applyFactionRenameToSettlement } from '../../../src/domain/factionRename.js';
import { derivePowerStrata } from '../../../src/domain/dossier/powerStrata.js';
import { coupContenders } from '../../../src/domain/rulingPowerCoup.js';
import { SEAT_LAW_CONFIG_KEY, HOLDER_SEAT_LAW_VERSION } from '../../../src/domain/seat/seatLaw.js';
import { toPublicSafe } from '../../../src/domain/display/publicSafe.js';
import { APPOINTED_GOVERNMENTS } from '../../../src/generators/people/representatives.js';
import { GOVERNMENT_FAMILY } from '../../../src/data/cultureOfficeTitles.js';
import { isVeiledRow } from '../../../src/domain/seat/seatTable.js';
import { isVeiledPower } from '../../../src/domain/people/cardVeil.js';
import { moduleClosure } from '../../../scripts/lib/module-closure.mjs';

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

// ── (9) U4-CURE: the leaf's closure, and the veil read it holds ────────────────────────────────────────────

describe('(9) the leaf reaches no cohesionWeave.js (writerReach), and its veil read is cardVeil.js\'s', () => {
  test('the static import closure of seat/holderOfSeat.js holds no spatial/cohesionWeave.js', () => {
    const entry = new URL('../../../src/domain/seat/holderOfSeat.js', import.meta.url).pathname;
    const closure = [...moduleClosure(entry)];
    expect(closure.length, 'the closure walk found the leaf\'s own imports').toBeGreaterThan(5);
    expect(closure.filter((f) => f.endsWith('/src/domain/spatial/cohesionWeave.js'))).toEqual([]);
    expect(closure.filter((f) => f.endsWith('/src/domain/people/cardVeil.js'))).toEqual([]);
  });

  test('seatTable.js :: isVeiledRow answers cardVeil.js :: isVeiledPower on every row shape the holder reads', () => {
    const rows = [
      ...civicTown({ extra: [
        { faction: 'The Quiet Hand', category: 'criminal', power: 12, modifiers: [] },
        { faction: 'The Shadow Ledger', category: 'CRIMINAL', power: 8, modifiers: [] },
        { faction: 'Gilded Infiltrators', category: 'economy', power: 9, hidden: true, modifiers: [] },
        { faction: 'Open Cutpurses', category: 'economy', power: 7, hidden: 'true', modifiers: [] },
      ] }).powerStructure.factions,
      null, undefined, 'Merchant Guilds', [], {}, { category: 7 },
    ];
    const differ = rows.filter((r) => isVeiledRow(r) !== isVeiledPower(r));
    expect(differ).toEqual([]);
    expect(rows.filter((r) => isVeiledRow(r)).length, 'the veiled rows are read veiled').toBe(3);
  });
});

// ── (10) CS11 on the served document ───────────────────────────────────────────────────────────────────────

describe('(10) CS11: on a SERVED document, no audience but the owner\'s is told a criminal or a hidden power', () => {
  const CRIMINAL = 'The Shadow Hand';
  const HIDDEN = 'Velvet Ledger';
  /** Every audience that is not the owner's, as `holderOf` is handed it (an unknown or missing one reads as the reader). */
  const NON_OWNER = [
    ['\'reader\'', { audience: 'reader' }],
    ['missing (no options)', undefined],
    ['missing (empty options)', {}],
    ['null', { audience: null }],
    ['\'\'', { audience: '' }],
    ['\'public\'', { audience: 'public' }],
    ['\'dm\'', { audience: 'dm' }],
  ];
  /** The forbidden names, wherever they stand in the answer (`holderName` and `person` included). */
  const named = (answer) => [CRIMINAL, HIDDEN].filter((name) => JSON.stringify(answer).includes(name));

  /**
   * A town (town size) with a criminal power and a hidden power beside its open ones; the seat's card holds a
   * membership in each, stamped veiled as a born card's is (the served document drops both).
   */
  const town = (relationships = [], extra = []) => civicTown({
    extra: [
      { faction: CRIMINAL, category: 'criminal', power: 18, modifiers: [] },
      { faction: HIDDEN, category: 'economy', power: 16, hidden: true, modifiers: [] },
      ...extra,
    ],
    relationships,
    npcs: [card('npc_mayor', 'Hilde Brandt', 'Mayor', [
      { power: 'Town Council', rank: 1 }, { power: CRIMINAL, rank: 3, veiled: true }, { power: HIDDEN, rank: 2, veiled: true },
    ])],
  });
  /** The criminal power's symbiotic/stable edge with the seat, as a born town may carry it. */
  const criminalEdge = { pair: ['Town Council', CRIMINAL], type: 'symbiotic', direction: 'stable', narrative: 'The Town Council looks away and The Shadow Hand keeps the docks quiet; each needs the other.' };
  /** The open taker's own edge with the seat, at the HEAD of the list, so a transfer rewrites it in place. */
  const merchantEdge = { pair: ['Town Council', 'Merchant Guilds'], type: 'competitive', direction: 'stable', narrative: 'They haggle over the market dues.' };

  /** Each non-owner audience on the served document: no forbidden name, and the answer `expected` asks for. */
  const servedAnswersHold = (s, expected) => {
    const served = toPublicSafe(s);
    for (const [label, options] of NON_OWNER) {
      const h = holderOf(served, options);
      expect(named(h), `audience ${label}`).toEqual([]);
      expected(h, label);
    }
  };

  test('(a) the last transfer\'s taker is a criminal power', () => {
    const s = transfer(town(), CRIMINAL);
    // non-vacuous: the owner is told it on the record, and the served document still holds its row
    expect(holderOf(s, OWNER)).toMatchObject({ rule: 'R1', holderName: CRIMINAL });
    expect(toPublicSafe(s).powerStructure.factions.map((f) => f.faction)).toContain(CRIMINAL);
    servedAnswersHold(s, (h, label) => expect(h, `audience ${label}`).toMatchObject({ rule: 'R1', holder: null, holderName: null, refused: true }));
  });

  test('(b) the last transfer\'s taker is a hidden power', () => {
    const s = transfer(town(), HIDDEN);
    expect(holderOf(s, OWNER)).toMatchObject({ rule: 'R1', holderName: HIDDEN });
    servedAnswersHold(s, (h, label) => expect(h, `audience ${label}`).toMatchObject({ rule: 'R1', holder: null, holderName: null, refused: true }));
  });

  /** The served document's symbiotic/stable edges on the current form, by the other power (masked names as served). */
  const symbioticOnForm = (s) => {
    const served = toPublicSafe(s);
    const form = served.powerStructure.government;
    return served.powerStructure.factionRelationships
      .filter((r) => r.pair.includes(form) && r.type === 'symbiotic' && r.direction === 'stable')
      .map((r) => r.pair.find((n) => n !== form));
  };
  const toldTheMerchants = (h, label) => expect(h, `audience ${label}`).toMatchObject({ rule: 'R1', holderName: 'Merchant Guilds', refused: false });

  test('(c) an open taker beside a criminal power\'s symbiotic/stable edge on the same form (born; the transfer\'s sentence stands)', () => {
    const s = transfer(town([merchantEdge, criminalEdge]), 'Merchant Guilds');
    expect(symbioticOnForm(s)).toEqual(['Merchant Guilds', CRIMINAL]);
    servedAnswersHold(s, toldTheMerchants);
  });

  test('(c) the same, where a later writer has replaced the transfer\'s sentence', () => {
    const s = transfer(town([merchantEdge, criminalEdge]), 'Merchant Guilds');
    s.powerStructure.recentConflict = 'The river tolls are disputed again.';
    expect(symbioticOnForm(s)).toEqual(['Merchant Guilds', CRIMINAL]);
    servedAnswersHold(s, toldTheMerchants);
  });

  test('(c) the same, where the criminal power held the seat by the transfer before', () => {
    const s = transfer(transfer(town(), CRIMINAL), 'Merchant Guilds');
    expect(symbioticOnForm(s)).toEqual([CRIMINAL, 'Merchant Guilds']);
    servedAnswersHold(s, toldTheMerchants);
  });

  test('(d) a born-shape town whose seat has a symbiotic/stable edge with its MILITARY power, and no transfer on record', () => {
    const s = town(
      [{ pair: ['Town Council', 'Town Watch'], type: 'symbiotic', direction: 'stable', narrative: 'The Town Council gives the orders and the Town Watch carries them out; each needs the other to stay strong.' }],
      [{ faction: 'Town Watch', category: 'military', power: 22, modifiers: [] }],
    );
    expect(s.powerStructure.previousGovernments).toBeUndefined();
    expect(s.powerStructure.recentConflict).toBeUndefined();
    expect(symbioticOnForm(s)).toEqual(['Town Watch']);
    // non-vacuous: on the record, the seat's person carries both forbidden names (the served document drops them)
    expect(named(holderOf(s, OWNER))).toEqual([CRIMINAL, HIDDEN]);
    servedAnswersHold(s, (h, label) => {
      expect(h.rule, `audience ${label}`).not.toBe('R1');
      expect(h, `audience ${label}`).toMatchObject({ rule: 'R4', holder: null, refused: false });
      expect(h.person?.name, `audience ${label}`).toBe('Hilde Brandt');
    });
  });
});

// ── (11) Step 1′: one matcher, one frozen list ─────────────────────────────────────────────────────────────

describe('(11) Step 1′: the transfer\'s sentences are read through ONE matcher against ONE frozen list of wordings', () => {
  const edgeOf = (s, taker) => s.powerStructure.factionRelationships.find((r) => r.pair.includes(s.powerStructure.government) && r.pair.includes(taker));

  test('the real transferRulingPower, on every cause with and without the demotion, writes only wordings the list holds', () => {
    let runs = 0;
    for (const cause of RULING_POWER_CAUSES) {
      for (const demoteIncumbent of [false, true]) {
        const s = transfer(civicTown(), 'Merchant Guilds', { cause, demoteIncumbent });
        const form = s.powerStructure.government;
        const label = `${cause}, demoteIncumbent ${demoteIncumbent}`;
        expect(transferSentenceSays(edgeOf(s, 'Merchant Guilds').narrative, 'edge', 'Merchant Guilds', form), `${label}: the edge`).toBe(true);
        expect(transferSentenceSays(s.powerStructure.recentConflict, 'conflict', 'Merchant Guilds', form), `${label}: recentConflict`).toBe(true);
        // the matcher reads the taker, the form and the sentence: none of them is a wildcard
        expect(transferSentenceSays(edgeOf(s, 'Merchant Guilds').narrative, 'edge', 'Noble Houses', form), label).toBe(false);
        expect(transferSentenceSays(edgeOf(s, 'Merchant Guilds').narrative, 'edge', 'Merchant Guilds', 'Town Council'), label).toBe(false);
        expect(transferSentenceSays(s.powerStructure.recentConflict, 'edge', 'Merchant Guilds', form), label).toBe(false);
        expect(holderOf(s, OWNER)).toMatchObject({ rule: 'R1', holderName: 'Merchant Guilds' });
        runs += 1;
      }
    }
    expect(runs).toBe(RULING_POWER_CAUSES.length * 2);
  });

  test('U5: the real transferRulingPower UNDER THE SEAT LAW (the form kept), on every cause with and without the demotion, writes only wordings the list holds', () => {
    let runs = 0;
    for (const cause of RULING_POWER_CAUSES) {
      for (const demoteIncumbent of [false, true]) {
        const s = transfer({ ...civicTown(), config: { [SEAT_LAW_CONFIG_KEY]: HOLDER_SEAT_LAW_VERSION } }, 'Merchant Guilds', { cause, demoteIncumbent });
        const form = s.powerStructure.government;
        const label = `law, ${cause}, demoteIncumbent ${demoteIncumbent}`;
        expect(form, label).toBe('Town Council'); // kept: a civic seat taken by its merchants
        expect(transferSentenceSays(edgeOf(s, 'Merchant Guilds').narrative, 'edge', 'Merchant Guilds', form), `${label}: the edge`).toBe(true);
        expect(transferSentenceSays(s.powerStructure.recentConflict, 'conflict', 'Merchant Guilds', form), `${label}: recentConflict`).toBe(true);
        expect(transferSentenceSays(s.powerStructure.recentConflict, 'conflict', 'Noble Houses', form), label).toBe(false);
        expect(holderOf(s, OWNER)).toMatchObject({ rule: 'R1', holderName: 'Merchant Guilds' });
        runs += 1;
      }
    }
    expect(runs).toBe(RULING_POWER_CAUSES.length * 2);
  });

  test('the list is frozen, and holds the edge sentence once and the transfer\'s own line in its five wordings (U5 added the kept form\'s two)', () => {
    expect(Object.isFrozen(TRANSFER_WORDINGS)).toBe(true);
    expect(TRANSFER_WORDINGS.every((w) => Object.isFrozen(w))).toBe(true);
    expect(TRANSFER_WORDINGS.filter((w) => w.sentence === 'edge').length).toBe(1);
    expect(TRANSFER_WORDINGS.filter((w) => w.sentence === 'conflict').length).toBe(5);
    // the chair's cure (1), 16:43Z: the retired edge's ONE fixed wording, a class of its own, never an 'edge' row
    expect(TRANSFER_WORDINGS.filter((w) => w.sentence === 'retiredEdge').length).toBe(1);
    expect(TRANSFER_WORDINGS.length).toBe(7);
  });

  /** A made-up new wording, put FIRST in the list (a later rewording, added beside the frozen ones). */
  const NEW_FIRST = [
    { sentence: 'edge', wording: '{taker} now steers the {form}; the seat bends to them.' },
    { sentence: 'conflict', wording: '{taker} took the {form} from the {from}.' },
    ...TRANSFER_WORDINGS,
  ];

  test('a town in the frozen wording still reads its taker when a made-up NEW wording stands first in the list', () => {
    const once = transfer(civicTown(), 'Merchant Guilds');
    expect(transferTakerOf(once, once.powerStructure.government, NEW_FIRST)).toBe('Merchant Guilds');
    // the two-taker shape of arm (3): the tie-break (the transfer's own line) still reads through the longer list
    const third = transfer(transfer(transfer(civicTown({
      extra: [{ faction: 'Coin Exchange', category: 'merchant', power: 18, modifiers: [] }],
      relationships: [{ pair: ['Town Council', 'Coin Exchange'], type: 'competitive', direction: 'stable', narrative: 'They haggle over the market dues.' }],
    }), 'Merchant Guilds'), 'Noble Houses'), 'Coin Exchange');
    expect(transferTakerOf(third, third.powerStructure.government, NEW_FIRST)).toBe('Coin Exchange');
    expect(transferTakerOf(third, third.powerStructure.government)).toBe('Coin Exchange');
  });

  test('the list is live: a town in the made-up wording reads its taker only through a list that holds it', () => {
    const s = structuredClone(transfer(civicTown(), 'Merchant Guilds'));
    edgeOf(s, 'Merchant Guilds').narrative = 'Merchant Guilds now steers the merchant city council; the seat bends to them.';
    expect(transferTakerOf(s, s.powerStructure.government)).toBeNull();
    expect(transferTakerOf(s, s.powerStructure.government, NEW_FIRST)).toBe('Merchant Guilds');
  });

  test('(a) a born seat\'s symbiotic/stable edge with its military power, no transfer on record, names NOBODY as taker', () => {
    for (const [tier, government, military] of [['town', 'Town Council', 'Town Watch'], ['hamlet', 'Elder Council', 'Military Party']]) {
      const s = civicTown({
        tier, government, mayor: [{ power: government, rank: 1 }],
        extra: [{ faction: military, category: 'military', power: 22, modifiers: [] }],
        relationships: [{ pair: [government, military], type: 'symbiotic', direction: 'stable', narrative: `The ${government} gives the orders and the ${military} carries them out; each needs the other to stay strong.` }],
      });
      expect(transferTakerOf(s, government), tier).toBeNull();
      for (const options of [OWNER, READER]) expect(holderOf(s, options).rule, tier).not.toBe('R1');
      expect(holderOf(toPublicSafe(s), READER).rule, tier).not.toBe('R1');
    }
  });

  describe('(c) a power the DM renames after a transfer (store/settlementRenameHelpers.js :: renameFactionImpl -> factionRename.js :: applyFactionRenameToSettlement)', () => {
    /** The rename, as the store's producer applies it (in place, on its own copy). */
    const renamed = (s, oldName, newName) => {
      const next = structuredClone(s);
      expect(applyFactionRenameToSettlement(next, oldName, newName).changed).toBe(true);
      return next;
    };
    for (const cause of ['coup', 'election']) {
      test(`${cause}: renaming the TAKER: the owner and the reader are told the renamed taker (the right power)`, () => {
        const s = renamed(transfer(civicTown(), 'Merchant Guilds', { cause, demoteIncumbent: false }), 'Merchant Guilds', 'The Gilded Compact');
        expect(s.powerStructure.factions.map((f) => f.faction)).toContain('The Gilded Compact');
        expect(holderOf(s, OWNER)).toMatchObject({ rule: 'R1', holderName: 'The Gilded Compact', refused: false });
        expect(holderOf(toPublicSafe(s), READER)).toMatchObject({ rule: 'R1', holderName: 'The Gilded Compact', refused: false });
      });

      test(`${cause}: renaming a BYSTANDER: R1 stands on the taker`, () => {
        const s = renamed(transfer(civicTown(), 'Merchant Guilds', { cause, demoteIncumbent: false }), 'Noble Houses', 'The Gilded Compact');
        expect(holderOf(s, OWNER)).toMatchObject({ rule: 'R1', holderName: 'Merchant Guilds', refused: false });
        expect(holderOf(toPublicSafe(s), READER)).toMatchObject({ rule: 'R1', holderName: 'Merchant Guilds', refused: false });
      });
    }
  });
});

// ── (12) Addendum 3: a transfer the read cannot attribute answers nobody ───────────────────────────────────

describe('(12) Addendum 3: renaming the SEAT after a transfer: R1 answers NOBODY, never a wrong power', () => {
  /** Coin Exchange (merchant, 40) outweighs the taker Merchant Guilds (31 after the transfer): R3's wrong answer before. */
  const renamedSeat = (cause) => {
    const start = civicTown({ extra: [{ faction: 'Coin Exchange', category: 'merchant', power: 40, modifiers: [] }] });
    const s = structuredClone(transfer(start, 'Merchant Guilds', { cause, demoteIncumbent: false }));
    expect(holderOf(s, OWNER)).toMatchObject({ rule: 'R1', holderName: 'Merchant Guilds' });
    expect(applyFactionRenameToSettlement(s, s.powerStructure.government, 'The Gilded Compact').changed).toBe(true);
    expect(s.powerStructure.government).toBe('The Gilded Compact');
    return s;
  };
  const NOBODY = { rule: 'R1', holder: null, holderName: null, refused: false };

  for (const cause of ['coup', 'election']) {
    test(`${cause}: the owner and the reader (record and served) are told nobody, not Coin Exchange`, () => {
      const s = renamedSeat(cause);
      expect(holderOf(s, OWNER)).toMatchObject(NOBODY);
      expect(holderOf(s, READER)).toMatchObject(NOBODY);
      expect(holderOf(toPublicSafe(s), READER)).toMatchObject(NOBODY);
      expect(holderOf(toPublicSafe(s), OWNER)).toMatchObject(NOBODY);
      // the office stands: its kind is the seat's own (the merchant form), never a power's
      expect(holderOf(s, OWNER).kind).toBe('merchant');
    });
  }

  test('control: the rule needs an edge in a transfer wording on the seat\'s pair (a born seat\'s edge never fires it)', () => {
    const born = civicTown({
      extra: [{ faction: 'Town Watch', category: 'military', power: 22, modifiers: [] }],
      relationships: [{ pair: ['Town Council', 'Town Watch'], type: 'symbiotic', direction: 'stable', narrative: 'The Town Council gives the orders and the Town Watch carries them out; each needs the other to stay strong.' }],
    });
    expect(holderOf(born, OWNER).rule).toBe('R4');
    // two transfers: the first taker's edge carries the old form's wording, but the current form's edge is there
    const twice = transfer(transfer(civicTown(), 'Merchant Guilds'), 'Noble Houses');
    expect(holderOf(twice, OWNER)).toMatchObject({ rule: 'R1', holderName: 'Noble Houses' });
  });

  test('condition 1: derivePowerStrata, on the record and served, names the seat\'s form, says no seat is vacant, and removes no holder', () => {
    const s = renamedSeat('coup');
    s.config = { [SEAT_LAW_CONFIG_KEY]: HOLDER_SEAT_LAW_VERSION };
    const oldLaw = (doc) => ({ ...doc, config: {} });
    for (const [label, doc] of [['record', s], ['served', toPublicSafe(s)]]) {
      const strata = derivePowerStrata(doc);
      expect(strata.powers[0], label).toMatchObject({ name: 'The Gilded Compact', role: 'ruler' });
      const said = JSON.stringify(strata.powers) + JSON.stringify(strata.roster.map(({ faction: _f, ...row }) => row));
      expect(said, label).toContain('The Gilded Compact');
      // anchored: `said` is live, the line above proves it carries the seat's form, so the vacancy check reads real text
      expect(said, label).not.toMatch(/vacant|empty|unheld|no one holds|nobody holds/i);
      // the contest's contenders, no holder removed: the old law's list (which removes none)
      const contenders = strata.powers.filter((p) => p.role === 'contender').map((p) => p.name);
      expect(contenders, label).toEqual(coupContenders(oldLaw(doc)).challengers.map((c) => c.name));
      expect(contenders, label).toContain('Coin Exchange');
      expect(contenders, label).toContain('Merchant Guilds');
    }
  });
});
