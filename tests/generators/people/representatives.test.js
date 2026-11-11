/**
 * representatives.test.js — THE REPRESENTATIVE GENERATOR (the people car, PEOPLE-1 CAST, step 2;
 * docs/chair/2026-11-07/BRIEF-PEOPLE-1-CAST-2026-11-07.md §1, rulings R-P1 c, R-P2, M-2, M-4).
 *
 * The owner's charter (ODQ §934.105): "one person per institution. They act as the face." The
 * claims: one card per face-bearing house and zero duplicates on the golden 525 and the soak
 * 1,000's first 200; the seat always faced (housed, the hall's, or minted); ids stable across
 * two births; the same seed the identical cast; the house-face count per tier inside PEOPLE-0
 * §1's measured envelope (docs/chair/2026-11-07/PEOPLE-INVENTORY-2026-11-07.md).
 *
 * BUDGETS: the two corpus arms birth 525 and 200 full settlements; each carries an explicit
 * per-test budget at its measured cost (the 525 ran in ~75 s, the 200 in ~45 s on the lane's
 * machine), never the suite-wide timeout.
 */
import { describe, expect, it } from 'vitest';
import { goldenCorpus } from '../../helpers/goldenMasterCorpus.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';
import { FACE_SEAT, faceOfInstitution, familyOfInstitution, isFabricInstitution } from '../../../src/data/institutionalCatalog.js';
import { governingFactionOf, nameOf } from '../../../src/domain/rulingPower.js';
import { SEAT_CARD_ID, YIELDS_TO, seatHouseOf, dualHatHouseOf, officeTitleFor } from '../../../src/generators/people/representatives.js';
import { seatMintTitleFor } from '../../../src/generators/people/mintTitles.js';
import { isVeiledPower, veiledOfInstitution } from '../../../src/domain/people/cardVeil.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/**
 * PEOPLE-0 §1 on the soak 1,000: the FACE column's minimum, and its maximum plus the JUDGMENT
 * column's (0 / 2 / 4 / 9 / 16 / 21), because R-P1 made ten of the judgment families and the
 * weight-3 market row faces that PEOPLE-0's face column did not count (measured at this suite's
 * birth: a town of the first 200 carries 41 house faces against the face column's 40).
 */
const ENVELOPE = Object.freeze({
  thorp: [0, 5], hamlet: [0, 10], village: [3, 23], town: [7, 49], city: [18, 91], metropolis: [46, 104],
});

/** The houses the registry says carry a face on this roster, in roster order, plus the seat's building where it is the seat. */
function expectedFaceHouses(settlement) {
  const seat = seatHouseOf(settlement.institutions);
  const names = [];
  const houses = (settlement.institutions || []).filter((house) => house && !isFabricInstitution(house));
  const facedFamilies = new Set(houses.filter((h) => typeof faceOfInstitution(h) === 'string' && faceOfInstitution(h) !== FACE_SEAT)
    .map((h) => familyOfInstitution(h)?.key));
  (settlement.institutions || []).forEach((house, index) => {
    if (!house || isFabricInstitution(house)) return;
    const face = faceOfInstitution(house);
    if (!face) return;
    if (face === FACE_SEAT) { if (seat && seat.index === index) names.push(house.name); return; }
    // one person, one face (M-1b): the resident priest yields to the church where the church rolls
    const family = familyOfInstitution(house)?.key;
    if (family && YIELDS_TO[family] && facedFamilies.has(YIELDS_TO[family])) return;
    names.push(house.name);
  });
  return { names, seat };
}

/** The claims every settlement of both corpora must hold. @param {any} s */
function assertCast(s, label) {
  const cards = s.npcs.filter((n) => n.institution);
  const governingName = nameOf(governingFactionOf(s));
  const hat = governingName ? dualHatHouseOf(s.institutions, governingFactionOf(s)) : null;
  const houseCards = cards.filter((n) => n.institution.kind === 'house');
  const { names, seat } = expectedFaceHouses(s);
  // one card per face house and no house twice (the cards are DRAWN in roster order; the stored
  // array is re-sorted by relevance by npcStructure.js :: enrichNPCsWithStructure, as today's was)
  expect([...houseCards.map((n) => n.institution.key)].sort(), `${label}: one card per face house`).toEqual([...names].sort());
  expect(new Set(s.npcs.map((n) => n.id)).size, `${label}: ids are unique`).toBe(s.npcs.length);
  expect(new Set(houseCards.map((n) => n.institution.key)).size, `${label}: no house faced twice`).toBe(houseCards.length);
  for (const card of cards) {
    expect(typeof card.title === 'string' && card.title.length > 0, `${label}: ${card.id} carries a title`).toBe(true);
    expect(card.memberships, `${label}: ${card.id} memberships`).toEqual(expect.any(Array));
    // anchored positively: an id is the house's slug (or the seat's / a power's mint), never today's `npc_<index>`
    expect(card.id, `${label}: ids derive from the house, never an index`).toMatch(/^npc_[a-z][a-z0-9_]*$/);
    // today's record body, every field the surfaces read
    // COHERENCE-POWERS re-key (the dual hat): the governing power's first, where a house leads, carries the
    // office in its `role` beside its house's title; every other card's role is its title (M-1b)
    if (hat && card.memberships.some((m) => m.power === governingName && m.rank === 1)) {
      expect(card.role, `${label}: ${card.id} the leader's office`).toBe(officeTitleFor(governingName, s.tier));
    } else expect(card.role, `${label}: ${card.id} role is the title (M-1b)`).toBe(card.title);
    // FIX-PUBLIC-VEIL: the veil bit is stamped at birth, a boolean, and equal to the one predicate read on the FINAL record
    expect(typeof card.institution.veiled, `${label}: ${card.id} carries the veil bit`).toBe('boolean');
    expect(card.institution.veiled, `${label}: ${card.id}'s bit is the predicate's on the record`).toBe(veiledOfInstitution(card.institution, s));
    // FIX-PUBLIC-VEIL (the second seat, option (B)): a veiled face is BORN with an opaque id — never its house's slug
    if (card.institution.veiled) {
      expect(card.id, `${label}: a veiled face's id is opaque`).toMatch(/^npc_veiled_[0-9a-f]{16}(_\d+)?$/);
    } else if (card.id !== SEAT_CARD_ID) {
      expect(card.id.startsWith('npc_veiled_'), `${label}: an open face keeps its readable id`).toBe(false);
    }
    for (const key of ['name', 'gender', 'role', 'category', 'personality', 'physical', 'plotHooks', 'influence', 'power', 'presentation']) {
      expect(card, `${label}: ${card.id} carries ${key}`).toHaveProperty(key);
    }
  }
  // the seat is always faced: the governing house's face, the hall's, or the mint
  const governing = nameOf(governingFactionOf(s));
  if (governing) {
    // M-1b (the owner, 07:1x UTC): the card's ROLE is its title — the pool's seat role is the key
    // the seat's pools were drawn through, so the seat is found by its house (or its mint), not by role
    const seated = cards.filter((n) => (seat ? n.institution.key === seat.house.name : n.id === SEAT_CARD_ID));
    for (const n of seated) expect(n.role, `${label}: the seat's role is its title (M-1b)`).toBe(n.title);
    // COHERENCE-POWERS re-key: where a house leads (the dual hat) and no seat house rolls, no seat is minted
    expect(seated.length, `${label}: exactly one seat face (${seat ? seat.kind : hat ? 'none: a house leads' : 'minted'})`).toBe(!seat && hat ? 0 : 1);
    // the SEAT mint by its id (the `other` powers' mints of step 3 are `kind: 'power'` too)
    const mint = cards.find((n) => n.id === SEAT_CARD_ID);
    if (seat || hat) expect(mint, `${label}: no seat mint beside a seat house or a leading house`).toBeUndefined();
    else {
      expect(mint.id).toBe(SEAT_CARD_ID);
      // FIX-PUBLIC-VEIL (re-keyed with the cause): the mint's institution carries its veil bit, the governing power's
      expect(mint.institution).toEqual({ kind: 'power', key: governing, family: null, title: seatMintTitleFor(governing).title,
        veiled: isVeiledPower(governingFactionOf(s)) });
    }
    if (seat?.kind === 'hall') expect(seated[0].title, `${label}: the hall's face is the seat, titled from the power`).toBe(seatMintTitleFor(governing).title);
  }
  return { houseFaces: houseCards.length, minted: cards.some((n) => n.institution.kind === 'power') };
}

describe('the people car — the representative generator (step 2)', () => {
  it('one card per face house, zero duplicates, the seat always faced: the golden 525', () => {
    let faces = 0;
    for (const row of goldenCorpus()) {
      const { _seed, ...cfg } = row;
      const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
      faces += assertCast(s, `${row.settType}/${_seed}`).houseFaces;
    }
    expect(faces, 'the corpus births a cast').toBeGreaterThan(525);
  }, 240_000);

  it("one card per face house, zero duplicates, the seat always faced, the envelope: the soak 1,000's first 200", async () => {
    await ensureLaws();
    const perTier = Object.fromEntries(TIERS.map((t) => [t, []]));
    let minted = 0;
    for (let i = 0; i < 200; i += 1) {
      const s = birth(i).settlement;
      const { houseFaces, minted: m } = assertCast(s, `soak1k-${i}`);
      perTier[s.tier].push(houseFaces);
      if (m) minted += 1;
    }
    for (const tier of TIERS) {
      const [lo, hi] = ENVELOPE[tier];
      expect(Math.min(...perTier[tier]), `${tier} min house faces`).toBeGreaterThanOrEqual(lo);
      expect(Math.max(...perTier[tier]), `${tier} max house faces`).toBeLessThanOrEqual(hi);
    }
    // R-P2's measured need: the mint fires only below the town (PEOPLE-0: never above the village without a hall)
    expect(minted, 'the seat is minted somewhere on the first 200').toBeGreaterThan(0);
  }, 180_000);

  it('ids are stable across two births of the same seed and roster, and the cast is identical', async () => {
    await ensureLaws();
    for (const i of [0, 1, 3, 5]) {
      const a = birth(i).settlement;
      const b = birth(i).settlement;
      expect(b.npcs.map((n) => n.id)).toEqual(a.npcs.map((n) => n.id));
      expect(JSON.stringify(b.npcs)).toBe(JSON.stringify(a.npcs));
    }
  }, 60_000);

  it('a different seed on the same config is a different cast of the same houses', () => {
    const row = goldenCorpus().find((c) => c.settType === 'town');
    const { _seed, ...cfg } = row;
    const a = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
    const b = generateSettlementPipeline(cfg, null, { seed: `${_seed}-other`, customContent: {} });
    const facesA = a.npcs.filter((n) => n.institution).map((n) => n.name);
    const facesB = b.npcs.filter((n) => n.institution).map((n) => n.name);
    expect(facesA.length).toBeGreaterThan(5);
    // anchored: the two casts are the same length only by coincidence of roster; the names differ
    expect(facesA.join('|')).not.toBe(facesB.join('|'));
  }, 30_000);
});

describe('FIX-PUBLIC-VEIL (the second seat) — a veiled face\'s opaque id is salted by the record\'s seed and stable for it', () => {
  it('the same seed mints the same opaque ids; another seed mints others; no id spells its house', () => {
    const cfg = { settType: 'city', culture: 'germanic', stressTypes: ['infiltrated'] };
    const idsOf = (seed) => generateSettlementPipeline(cfg, null, { seed, customContent: {} }).npcs
      .filter((n) => n.institution?.veiled === true).map((n) => [n.institution.key, n.id]);
    const a = idsOf('veil-a'); const again = idsOf('veil-a'); const b = idsOf('veil-b');
    expect(a.length, 'anchored: the city carries veiled faces').toBeGreaterThan(2);
    expect(again).toEqual(a);
    const bByKey = new Map(b);
    const shared = a.filter(([key]) => bByKey.has(key));
    expect(shared.length, 'anchored: the two seeds share a veiled house').toBeGreaterThan(0);
    for (const [key, id] of shared) expect(bByKey.get(key), `${key}: another seed, another id`).not.toBe(id);
    // anchored: `a` is the veiled cards' id list, non-empty by the shared-house assertion above
    for (const [key, id] of a) expect(id).not.toContain(String(key).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)[0]);
  });
});
