/**
 * castPowers.test.js — THE POWERS' PEOPLE (the people car, PEOPLE-1 CAST, step 3;
 * docs/chair/2026-11-07/BRIEF-PEOPLE-1-CAST-2026-11-07.md §1, rulings R-P3, R-P4, R-P5).
 *
 * The claims: every membership names a power that exists; a house's shares sum to at most one;
 * the two floors hold on the golden 525 (the governing power's first is the seat's face; a
 * non-governing power's first is its own landmark); the snake deal gives both claimants people
 * where the archetype has two or more houses, on a fixture with two military claimants; no
 * sole-claimant power with a house of its archetype on the roster is at zero; the minted
 * `other` face exists for every `other` power; determinism.
 *
 * BUDGET: the 525 arm births 525 full settlements under an explicit per-test budget at its
 * measured cost (~80 s), never the suite-wide timeout.
 */
import { describe, expect, it } from 'vitest';
import { goldenCorpus } from '../../helpers/goldenMasterCorpus.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';
import { backingArchetypeOf, dealDoubledNiches, houseBacksOf } from '../../../src/domain/dossier/powerSupport.js';
import { backingRowFor } from '../../../src/data/institutionBacking.js';
import { faceOfInstitution } from '../../../src/data/institutionalCatalog.js';
import { FACTION_ARCHETYPES as A } from '../../../src/domain/factionArchetypes.js';
import { governingFactionOf, nameOf } from '../../../src/domain/rulingPower.js';
import { OTHER_CARD_PREFIX, RANKS, assignCastPowers, rollWeightOf } from '../../../src/generators/people/castPowers.js';
import { SEAT_CARD_ID, seatHouseOf } from '../../../src/generators/people/representatives.js';
import { otherMintRowFor } from '../../../src/generators/people/mintTitles.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

/** Two military claimants (the density law's doubled niche), one seat, four military houses. */
const FIXTURE = Object.freeze({
  tier: 'city',
  config: { culture: 'germanic' },
  powerStructure: {
    factions: [
      { faction: 'Elder Council', category: 'government', power: 40, isGoverning: true },
      { faction: 'Military/Guard', category: 'military', power: 35 },
      { faction: 'The Shield Compact', category: 'military', power: 25 },
    ],
  },
  institutions: [
    { name: 'Citadel', category: 'Defense' },
    { name: 'Barracks', category: 'Defense' },
    { name: 'Mercenary quarter', category: 'Defense' },
    { name: "Veteran's lodge", category: 'Defense' },
    { name: 'Mayor and council', category: 'Government' },
  ],
});

const landingsOf = (map, house) => (map.get(house) || []).filter((b) => b.share > 0).map((b) => `${b.faction}:${b.share}`);
const shareSum = (list) => Math.round(list.reduce((a, b) => a + b.share, 0) * 1000) / 1000;

/** The claims every settlement must hold. @param {any} s @param {string} label */
function assertPowers(s, label) {
  const powers = (s.powerStructure?.factions || []).map((f) => nameOf(f));
  const powerSet = new Set(powers);
  const governing = nameOf(governingFactionOf(s));
  const cards = s.npcs.filter((n) => n.institution);
  const seat = seatHouseOf(s.institutions);
  for (const card of cards) {
    const sum = shareSum(card.memberships);
    expect(sum, `${label}: ${card.id} shares ≤ 1`).toBeLessThanOrEqual(1.0001);
    for (const m of card.memberships) {
      expect(powerSet.has(m.power), `${label}: ${card.id} names a power that exists (${m.power})`).toBe(true);
      expect([1, 2, 3, null], `${label}: ${card.id} rank`).toContain(m.rank);
      expect(m.share, `${label}: ${card.id} share > 0`).toBeGreaterThan(0);
    }
    expect(new Set(card.memberships.map((m) => m.power)).size, `${label}: ${card.id} one membership per power`).toBe(card.memberships.length);
  }
  // the ranks: at most one of each per power, 1..n contiguous, at most three
  for (const power of powers) {
    const ranked = cards.flatMap((c) => c.memberships.filter((m) => m.power === power && m.rank)).map((m) => m.rank).sort();
    expect(ranked.length, `${label}: ${power} ranks at most ${RANKS}`).toBeLessThanOrEqual(RANKS);
    expect(ranked, `${label}: ${power} ranks are 1..n`).toEqual(ranked.map((_, i) => i + 1));
    const members = cards.filter((c) => c.memberships.some((m) => m.power === power));
    expect(ranked.length, `${label}: ${power} ranks the faces it has`).toBe(Math.min(RANKS, members.length));
  }
  // FLOOR 1 — the governing power's first is the seat's face
  if (governing) {
    const first = cards.find((c) => c.memberships.some((m) => m.power === governing && m.rank === 1));
    if (seat) {
      const seatCard = cards.find((c) => c.institution.kind === 'house' && c.institution.key === seat.house.name);
      if (seatCard?.memberships.some((m) => m.power === governing)) expect(first?.id, `${label}: floor 1, the seat first`).toBe(seatCard.id);
    } else {
      expect(first?.id, `${label}: floor 1, the minted seat first`).toBe(SEAT_CARD_ID);
    }
  }
  // R-P4 — every non-governing `other` power has its minted face, a member whole and first (the
  // governing power's face is the seat whatever its archetype: a v1 thorp's "Town Mayor" is `other`)
  for (const f of s.powerStructure?.factions || []) {
    const name = nameOf(f);
    if (backingArchetypeOf(f) !== A.OTHER || name === governing) continue;
    const mint = cards.find((c) => c.institution.kind === 'power' && c.institution.key === name);
    expect(mint, `${label}: the other power ${name} has its minted face`).toBeDefined();
    expect(mint.id.startsWith(OTHER_CARD_PREFIX)).toBe(true);
    expect(mint.title).toBe(otherMintRowFor(name).title);
    expect(mint.memberships).toEqual([{ power: name, rank: 1, share: 1 }]);
  }
  // PEOPLE-LAND re-key, cause M-2 (the shim out): the shim's `factionAffiliation` / `secondaryAffiliation` are no
  // fields of a returned card; the memberships are the card's powers, each naming a power on the roster.
  const rosterNames = new Set((s.powerStructure?.factions || []).map(nameOf));
  for (const card of cards) {
    for (const field of ['factionAffiliation', 'secondaryAffiliation', 'linkedFactionIds', 'factionGoal', 'densityRungRole']) {
      expect(Object.hasOwn(card, field), `${label}: ${card.id} still carries the retired ${field}`).toBe(false);
    }
    for (const m of card.memberships) expect(rosterNames.has(m.power), `${label}: ${card.id} membership ${m.power} is on the roster`).toBe(true);
  }
  return cards;
}

describe('the people car — the powers\' people (step 3)', () => {
  it('the snake deal: two military claimants split the archetype\'s houses by weight, alternately, the higher figure first (R-P3)', () => {
    const before = houseBacksOf(FIXTURE);
    expect(landingsOf(before, 'Citadel')).toEqual(['Military/Guard:0.6', 'Elder Council:0.4']);
    expect(landingsOf(before, 'Barracks')).toEqual(['Military/Guard:1']);
    expect(landingsOf(before, "Veteran's lodge")).toEqual(['Military/Guard:1']);
    expect(landingsOf(before, 'The Shield Compact')).toEqual([]);
    const after = dealDoubledNiches(FIXTURE, before);
    // weight order: Citadel 3, Barracks 2, Mercenary quarter 2 (roster order), Veteran's lodge 1
    expect(landingsOf(after, 'Citadel')).toEqual(['Military/Guard:0.6', 'Elder Council:0.4']);
    expect(landingsOf(after, 'Barracks')).toEqual(['The Shield Compact:1']);
    expect(landingsOf(after, 'Mercenary quarter')).toEqual(['Military/Guard:0.5', 'Elder Council:0.5']);
    expect(landingsOf(after, "Veteran's lodge")).toEqual(['The Shield Compact:1']);
    // no double count: every house's shares still sum to one; the input map is untouched
    for (const house of FIXTURE.institutions.map((i) => i.name)) {
      expect(shareSum(after.get(house)), house).toBe(shareSum(before.get(house)));
    }
    expect(landingsOf(before, 'Barracks')).toEqual(['Military/Guard:1']);
    // the seat's house is not dealt (its largest share is government, the ruler's by rule)
    expect(landingsOf(after, 'Mayor and council')).toEqual(['Elder Council:1']);
    expect(backingRowFor('Mercenary quarter')?.weight).toBe(2);
  });

  it('both claimants get people where the archetype has two or more houses; borrowing is refused with one', () => {
    const one = { ...FIXTURE, institutions: [{ name: 'Citadel' }, { name: 'Mayor and council' }] };
    const dealt = dealDoubledNiches(one, houseBacksOf(one));
    expect(landingsOf(dealt, 'Citadel')).toEqual(['Military/Guard:0.6', 'Elder Council:0.4']);
    expectAbsentWithAnchor([...dealt.values()].flat().map((b) => b.faction), 'The Shield Compact', 'Military/Guard');
  });

  it('the ruler is the government archetype\'s first claimant: a second civic power is dealt the government houses, the seat\'s own house kept (R-P3)', () => {
    const civic = {
      ...FIXTURE,
      powerStructure: { factions: [
        { faction: 'Elder Council', category: 'government', power: 40, isGoverning: true },
        { faction: "People's Council", category: 'civic', power: 30 },
      ] },
      institutions: [
        { name: 'Mayor and council' }, { name: 'Courthouse' }, { name: 'Small prison/stocks' }, { name: 'Town granary' },
      ],
    };
    const before = houseBacksOf(civic);
    expect(landingsOf(before, 'Courthouse')).toEqual(['Elder Council:1']);
    expect(landingsOf(before, 'Town granary')).toEqual(['Elder Council:1']);
    const after = dealDoubledNiches(civic, before);
    // weight order over the dealt houses (the seat's own house is kept out): Courthouse 2, Town granary 2 (roster), Small prison 1
    expect(landingsOf(after, 'Mayor and council')).toEqual(['Elder Council:1']);
    expect(landingsOf(after, 'Courthouse')).toEqual(['Elder Council:1']);
    expect(landingsOf(after, 'Town granary')).toEqual(["People's Council:1"]);
    // the prison (weight 1) is the third dealt house: the ruler's again (its lapsed military share merged by the fallback)
    expect(landingsOf(after, 'Small prison/stocks')).toEqual(['Elder Council:1']);
  });

  it('the roll weight: share × house weight, 0.5 for weight 0, 1 for a minted face', () => {
    expect(rollWeightOf(0.6, 3)).toBeCloseTo(1.8);
    expect(rollWeightOf(1, 0)).toBe(0.5);
    expect(rollWeightOf(1, null)).toBe(1);
  });

  it('memberships, floors, the other mint and the shim on the golden 525; no sole power with a house of its archetype is at zero', () => {
    let zeroWithHouse = 0; let powersSeen = 0; let mints = 0;
    for (const row of goldenCorpus()) {
      const { _seed, ...cfg } = row;
      const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
      const cards = assertPowers(s, `${row.settType}/${_seed}`);
      mints += cards.filter((c) => c.institution.kind === 'power').length;
      // a sole claimant of its archetype with a house whose largest share is that archetype on the roster
      const factions = s.powerStructure?.factions || [];
      const ruler = nameOf(governingFactionOf(s));
      const archCount = new Map();
      for (const f of factions) if (nameOf(f) !== ruler) archCount.set(backingArchetypeOf(f), (archCount.get(backingArchetypeOf(f)) || 0) + 1);
      for (const f of factions) {
        const name = nameOf(f); const arch = backingArchetypeOf(f);
        if (name === ruler || arch === A.OTHER || archCount.get(arch) !== 1) continue;
        // a house with no face gives no person (the revised census: the wayside shrine is untended, a
        // market is the town's own function), so only a FACE-bearing house of the archetype counts
        const hasHouse = (s.institutions || []).some((inst) => {
          const r = backingRowFor(inst?.name); if (!r || !faceOfInstitution(inst)) return false;
          const largest = Object.entries(r.shares).sort((x, y) => y[1] - x[1])[0];
          return largest && largest[0] === arch && !inst.factionSource;
        });
        if (!hasHouse) continue;
        powersSeen += 1;
        if (!cards.some((c) => c.memberships.some((m) => m.power === name))) zeroWithHouse += 1;
      }
    }
    expect(powersSeen, 'sole powers with a house of their archetype are counted').toBeGreaterThan(200);
    expect(zeroWithHouse, 'no sole power with a house of its archetype is at zero').toBe(0);
    expect(mints, 'the corpus mints faces').toBeGreaterThan(0);
  }, 300_000);

  it('determinism: the same seed gives the same memberships and ranks, twice', async () => {
    await ensureLaws();
    for (const i of [4, 5, 17]) {
      const a = birth(i).settlement; const b = birth(i).settlement;
      const sig = (s) => JSON.stringify(s.npcs.map((n) => [n.id, n.memberships, n.title])); // PEOPLE-LAND: the shim's fields retired (M-2)
      expect(sig(b)).toBe(sig(a));
      assertPowers(a, `soak1k-${i}`);
    }
  }, 90_000);

  it('assignCastPowers without a stream ranks by weight alone and still holds the floors', () => {
    const cards = [
      { id: 'npc_citadel', institution: { kind: 'house', key: 'Citadel', family: 'Citadel', title: 'the castellan' }, memberships: [] },
      { id: 'npc_barracks', institution: { kind: 'house', key: 'Barracks', family: 'Barracks', title: 'the garrison commander' }, memberships: [] },
      { id: 'npc_mayor_and_council', institution: { kind: 'house', key: 'Mayor and council', family: 'Mayor and council', title: 'the mayor' }, memberships: [] },
    ];
    const out = assignCastPowers(FIXTURE, cards, null);
    const by = Object.fromEntries(out.map((c) => [c.id, c.memberships]));
    expect(by.npc_mayor_and_council).toEqual([{ power: 'Elder Council', rank: 1, share: 1 }]);
    expect(by.npc_citadel).toEqual([{ power: 'Military/Guard', rank: 1, share: 0.6 }, { power: 'Elder Council', rank: 2, share: 0.4 }]);
    expect(by.npc_barracks).toEqual([{ power: 'The Shield Compact', rank: 1, share: 1 }]);
  });
});
