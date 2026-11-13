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
import * as __fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { goldenCorpus } from '../../helpers/goldenMasterCorpus.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';
import { backingArchetypeOf, dealDoubledNiches, houseBacksOf, RULER_KINDS } from '../../../src/domain/dossier/powerSupport.js';
import { backingRowFor } from '../../../src/data/institutionBacking.js';
import { faceOfInstitution } from '../../../src/data/institutionalCatalog.js';
import { FACTION_ARCHETYPES as A } from '../../../src/domain/factionArchetypes.js';
import { governingFactionOf, nameOf } from '../../../src/domain/rulingPower.js';
import { OTHER_CARD_PREFIX, RANKS, assignCastPowers, rollWeightOf } from '../../../src/generators/people/castPowers.js';
import { houseKindOf, SEAT_CARD_ID, seatHouseOf } from '../../../src/generators/people/representatives.js';
import { otherMintRowFor } from '../../../src/generators/people/mintTitles.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { isVeiledPower, veiledOfPower, VEILED_CARD_PREFIX } from '../../../src/domain/people/cardVeil.js';
import { isSeatVacant } from '../../../src/domain/people/seatKeeper.js';
import { coupContenders } from '../../../src/domain/rulingPowerCoup.js';
import { stressPowerRowOf } from '../../../src/domain/people/stressPowerFaces.js';
import { leaderHouseOf, officeLiteralOf } from '../../helpers/dualHatOracle.js'; // COHERENCE-POWERS-3 (F9): the expectation's own oracle, literals

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
      // COHERENCE-POWERS re-key (the dual hat, the chair's ruling of 2026-11-11): the one membership at share 0 is
      // the leader's office — the governing power's first, held whatever its house backs. COHERENCE-POWERS-5 (N8;
      // REVIEW-POWERS-2): restored to its strictness, re-keyed BY IDENTITY: every membership is a share > 0, but the
      // dual-hat leader's office (a house's face carrying the office in its role, first of the governing power), which
      // is exactly 0 where its house backs elsewhere and > 0 where it backs the governing power
      const office = m.power === governing && m.rank === 1 && card.institution?.kind === 'house' && card.role !== card.title;
      // COHERENCE-POWERS-6 (item 6; REVIEW-POWERS-2 N8): a share of exactly +0 is the DUAL-HAT OFFICE's signature and no one
      // else's — the office is the one member a house joins at no weight (the office held whatever its house backs). The old
      // arm `Object.is(m.share, 0)` INSIDE `m.share === 0` was a tautology (it could red only on -0, which the else arm also
      // catches). Strict and tested: a clean +0 on any OTHER membership reds here; a -0, NaN or negative anywhere reds on the
      // else arm (none is > 0). Made stricter, never looser.
      if (Object.is(m.share, 0)) expect(office, `${label}: ${card.id} only the dual-hat office sits at share exactly +0 (${m.power})`).toBe(true);
      else expect(m.share, `${label}: ${card.id} share > 0 (${m.power})`).toBeGreaterThan(0);
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
  // FLOOR 1 — the governing power's first is the dual-hat leader's face (COHERENCE-POWERS re-key: the house the
  // leader comes from, its office in `role`), else the seat's face as before (a government that sends its own man)
  const hat = governing ? leaderHouseOf(s.institutions, nameOf(governingFactionOf(s)), backingArchetypeOf(governingFactionOf(s))) : null;
  if (hat) {
    const first = cards.find((c) => c.memberships.some((m) => m.power === governing && m.rank === 1));
    expect(first?.institution, `${label}: floor 1, the dual hat first`).toMatchObject({ kind: 'house', key: hat });
    expect(first.role, `${label}: the leader's office`).toBe(officeLiteralOf(governing, s.tier));
    expect(cards.some((c) => c.id === SEAT_CARD_ID), `${label}: no seat minted where a house leads`).toBe(false);
  } else if (governing) {
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
    // FIX-PUBLIC-VEIL (the second seat, re-keyed with the cause): a hidden or criminal power's face is born
    // with the opaque id (people/cardVeil.js :: veiledCardIdFor, salted by the record's seed); an open one keeps
    // its power-slug id
    if (isVeiledPower(f)) {
      expect(mint.id).toMatch(new RegExp(`^${VEILED_CARD_PREFIX}[0-9a-f]{16}(_\\d+)?$`));
    } else expect(mint.id.startsWith(OTHER_CARD_PREFIX)).toBe(true);
    expect(mint.title).toBe(otherMintRowFor(name).title);
    // FIX-PUBLIC-VEIL (re-keyed with the cause): the membership carries THAT power's veil bit
    expect(mint.memberships).toEqual([{ power: name, rank: 1, share: 1, veiled: isVeiledPower(f) }]);
  }
  // FIX-PUBLIC-VEIL (the chair's ruling, the same law per entry): every membership is stamped at birth,
  // a boolean equal to the one predicate applied to THAT power on the final record
  for (const card of cards) {
    for (const m of card.memberships) {
      expect(typeof m.veiled, `${label}: ${card.id} -> ${m.power} carries the veil bit`).toBe('boolean');
      expect(m.veiled, `${label}: ${card.id} -> ${m.power}'s bit is the predicate's`).toBe(veiledOfPower(m.power, s));
    }
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

  it('the ruler is its own kind\'s first claimant: a Church Council beside Religious Authorities is dealt the churches first, heaviest first (COHERENCE-POWERS, rule A)', () => {
    const church = {
      tier: 'town',
      config: { culture: 'germanic' },
      powerStructure: { factions: [
        { faction: 'Church Council', category: 'religious', power: 30, isGoverning: true },
        { faction: 'Religious Authorities', category: 'religious', power: 20 },
      ] },
      institutions: [{ name: 'Parish church' }, { name: 'Great cathedral' }, { name: 'Parish churches (2-5)' }, { name: 'Mayor and council' }],
    };
    const before = houseBacksOf(church);
    // the raw landing is unchanged: a ruler competes for its own kind only when no other power of it is seated
    expect(landingsOf(before, 'Great cathedral')).toEqual(['Religious Authorities:1']);
    const after = dealDoubledNiches(church, before);
    // weight order: Great cathedral 3, Parish church 2 (roster first), Parish churches 2 — the ruler picks first
    expect(landingsOf(after, 'Great cathedral')).toEqual(['Church Council:1']);
    expect(landingsOf(after, 'Parish church')).toEqual(['Religious Authorities:1']);
    expect(landingsOf(after, 'Parish churches (2-5)')).toEqual(['Church Council:1']);
    expect(landingsOf(after, 'Mayor and council')).toEqual(['Church Council:1']);
    // a criminal ruler is not its kind's claimant (the veil; the chair's ruling of 2026-11-11)
    const corrupt = { ...church, powerStructure: { factions: [
      { faction: 'Corrupt Council', category: 'criminal', power: 30, isGoverning: true },
      { faction: "Thieves' Guild", category: 'criminal', power: 20 },
    ] }, institutions: [{ name: 'Front businesses' }, { name: 'Mayor and council' }] };
    expect(landingsOf(dealDoubledNiches(corrupt, houseBacksOf(corrupt)), 'Front businesses')).toEqual(landingsOf(houseBacksOf(corrupt), 'Front businesses'));
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

  it('N8 (COHERENCE-POWERS-6 item 6): the share arm names the +0 the dual-hat office\'s alone — a planted +0 off the office reds, and a -0 on the office reds', async () => {
    await ensureLaws();
    const base = birth(5).settlement;
    const govName = nameOf(governingFactionOf(base));
    const isOffice = (c, m) => m.power === govName && m.rank === 1 && c.institution?.kind === 'house' && c.role !== c.title;
    // the control: the real record passes the arm
    expect(() => assertPowers(JSON.parse(JSON.stringify(base)), 'N8-control')).not.toThrow();
    const plantShare = (pred, value) => {
      const s = JSON.parse(JSON.stringify(base));
      for (const c of s.npcs) for (const m of (c.memberships || [])) if (pred(c, m)) { m.share = value; return s; }
      return null;
    };
    // (a) a clean +0 on a POSITIVE non-office membership: the zero arm reds — a +0 is the dual-hat office's alone. The
    // shareSum arm is unmoved (a lowered share keeps the sum <= 1). With the arm made meaningful the +0 case has a live
    // assertion of its own (the old arm reached the +0 only inside `m.share === 0`, where Object.is could not fail).
    const planted = plantShare((c, m) => m.share > 0 && !isOffice(c, m), 0);
    expect(planted, 'the fixture has a positive non-office membership to move').toBeTruthy();
    expect(() => assertPowers(planted, 'N8-plant-nonoffice-zero')).toThrow();
    // (b) a -0 on the office membership held at 0 (where its house backs elsewhere): never accepted, however it is spelled
    const negZero = plantShare((c, m) => Object.is(m.share, 0) && isOffice(c, m), -0);
    if (negZero) expect(() => assertPowers(negZero, 'N8-plant-office-negzero')).toThrow();
  }, 90_000);

  it('REVIEW-POWERS-FU item 6 plants', async () => {
    await ensureLaws();
    const report = [];
    for (const i of [5, 4, 17, 2, 9, 11, 23, 31]) {
      const base = birth(i).settlement;
      const gov = nameOf(governingFactionOf(base));
      const isOffice = (c, m) => m.power === gov && m.rank === 1 && c.institution?.kind === 'house' && c.role !== c.title;
      const office = base.npcs.find((c) => (c.memberships || []).some((m) => isOffice(c, m)));
      const om = office && office.memberships.find((m) => isOffice(office, m));
      const tries = (label, mutate) => {
        const s = JSON.parse(JSON.stringify(base)); const ok = mutate(s); if (!ok) { report.push(`${i} ${label}: n/a`); return; }
        let red = false; try { assertPowers(s, label); } catch { red = true; }
        report.push(`${i} ${label}: ${red ? 'RED' : 'green'}`);
      };
      tries('control', () => true);
      report.push(`${i} office=${office ? office.id : 'none'} share=${om ? (Object.is(om.share, 0) ? '+0' : om.share) : '-'}`);
      // F1: the office card made a non-office by title (role === title) while its share is +0 -> must red
      tries('F1 office loses its office word, share +0', (s) => { const c = s.npcs.find((x) => x.id === office?.id); const m = c && c.memberships.find((x) => x.power === gov && x.rank === 1); if (!m) return false; m.share = 0; c.role = c.title; return true; });
      // F2: +0 on the governing power's SECOND member -> must red
      tries('F2 +0 on the governing second', (s) => { for (const c of s.npcs) for (const m of c.memberships || []) if (m.power === gov && m.rank === 2) { m.share = 0; return true; } return false; });
      // F3: +0 on the office card's OTHER membership (its house's own power) -> must red
      tries('F3 +0 on the office card in another power', (s) => { const c = s.npcs.find((x) => x.id === office?.id); const m = c && c.memberships.find((x) => x.power !== gov); if (!m) return false; m.share = 0; return true; });
      // F4: +0 on a minted face (a power's own card) -> must red
      tries('F4 +0 on a minted face', (s) => { const c = s.npcs.find((x) => x.institution?.kind === 'power'); if (!c) return false; c.memberships[0].share = 0; return true; });
      // F5: the office at -0 -> must red
      tries('F5 office at -0', (s) => { const c = s.npcs.find((x) => x.id === office?.id); const m = c && c.memberships.find((x) => isOffice(c, x)); if (!m) return false; m.share = -0; return true; });
    }
    __fs.writeFileSync('/home/user/wt/item6.out', 'ITEM6\n' + report.join('\n') + '\n');
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
    // FIX-PUBLIC-VEIL (re-keyed with the cause): each membership carries its power's veil bit (none of the
    // fixture's three powers is hidden or criminal)
    // COHERENCE-POWERS-2 (re-keyed with the cause, the chair's ruling of 2026-11-12 item 1 (ii)): a civic ruler whose town has no
    // trade or landed house is led from its heaviest open house of another kind (representatives.js :: dualHatHouseOf), so the
    // castellan leads the Elder Council with both hats and the office's hall is its second
    expect(by.npc_mayor_and_council).toEqual([{ power: 'Elder Council', rank: 2, share: 1, veiled: false }]);
    expect(by.npc_citadel).toEqual([{ power: 'Military/Guard', rank: 1, share: 0.6, veiled: false }, { power: 'Elder Council', rank: 1, share: 0.4, veiled: false }]);
    expect(by.npc_barracks).toEqual([{ power: 'The Shield Compact', rank: 1, share: 1, veiled: false }]);
    // and a hidden power's membership is stamped veiled (the stress infiltrator's shape)
    const hidden = { ...FIXTURE, powerStructure: { ...FIXTURE.powerStructure,
      factions: FIXTURE.powerStructure.factions.map((f) => (f.faction === 'The Shield Compact' ? { ...f, hidden: true } : f)) } };
    const barracks = assignCastPowers(hidden, [{ ...cards[1], memberships: [] }], null)[0];
    expect(barracks.memberships).toEqual([{ power: 'The Shield Compact', rank: 1, share: 1, veiled: true }]);
  });
});

/**
 * THE GUILD'S PUSH (the allegiance train, car 2, ALLEGIANCE-CAR2, 2026-11-08; the design §3.2, §4 I-5 and I-13; the
 * chair's J-11: "the push never moves FLOOR 1 or FLOOR 2. Only the weighted ranks move"). Written red-first: at car
 * 1's tip (7395b5dab) `GUILD_PUSH_TUNING` and `guildPushOf` do not exist and `rankPowers` takes no tuning, so every
 * arm below reds; the floor checker reds on a planted floor breach (its control).
 */
describe('the guild\'s push (car 2): I-5 the floors hold under a maximal push; I-13 keyed', () => {
  const SLICE = Array.from({ length: 240 }, (_, i) => i).filter((i) => i % 6 === 4 || i % 6 === 5);
  /** @type {Map<number, any>} */
  const BORN = new Map();
  const born = async () => { await ensureLaws(); for (const i of SLICE) if (!BORN.has(i)) BORN.set(i, birth(i).settlement); return SLICE.map((i) => ({ i, s: BORN.get(i) })); };
  const MAXIMAL = Object.freeze({ strength: 1e6, strengthFull: 30, organized: 1e6, max: 1e6 });
  const NONE = Object.freeze({ strength: 0, strengthFull: 30, organized: 0, max: 1 });

  /** Re-deal a born town's ranks under a push tuning: the cast's memberships re-landed, its allegiances kept. */
  async function redeal(s, i, tuning, drop = null) {
    const { landMemberships, rankPowers } = await import('../../../src/generators/people/castPowers.js');
    const { createPRNG } = await import('../../../src/kernel/prng.js');
    const cast = JSON.parse(JSON.stringify(s.npcs)).filter((n) => n.id !== drop);
    const view = { tier: s.tier, institutions: s.institutions, powerStructure: s.powerStructure, economicState: s.economicState, config: s.config, _seed: s._seed };
    const landed = landMemberships(view, cast, createPRNG(`push-${i}`), s._seed);
    const plan = landed.plan;
    const floors = new Map();
    if (plan) {
      for (const power of plan.powers) {
        const pool = plan.members.get(power);
        if (!pool.length) continue;
        const picks = [];
        const isGov = power === plan.governing;
        // COHERENCE-POWERS re-key: the governing power's first is the dual-hat leader's face where a house leads
        const rulerRow = isGov ? governingFactionOf(view) : null;
        const hat = rulerRow ? leaderHouseOf(view.institutions, nameOf(rulerRow), backingArchetypeOf(rulerRow)) : null;
        const hatCard = hat ? cast.find((c) => c.institution?.kind === 'house' && c.institution.key === hat) : null;
        const f1 = isGov
          ? (hatCard ? { card: hatCard } : pool.find((m) => (plan.seatKey ? m.card.institution?.key === plan.seatKey && m.card.institution?.kind === 'house' : m.card.id === SEAT_CARD_ID)))
          : pool.find((m) => m.card.institution?.kind === 'power' && m.card.institution?.key === power);
        if (f1) picks.push(f1.card.id);
        // FLOOR 2: a ruler of a kind whose first is not of its kind seats its heaviest kind house; else the landmark
        const kindOf = (m) => (m.card.institution?.kind === 'house' ? houseKindOf({ name: m.card.institution.key }) : null);
        const rk = rulerRow ? backingArchetypeOf(rulerRow) : null;
        const kin = isGov && RULER_KINDS.includes(rk) && !(f1 && kindOf(f1) === rk)
          ? pool.filter((m) => m.weight !== null && kindOf(m) === rk && !m.card.institution?.veiled && !picks.includes(m.card.id))
            .sort((x, y) => (y.weight - x.weight) || (y.share - x.share) || (x.at - y.at))[0]
          : null;
        const landmark = kin || pool.filter((m) => m.largest && m.weight !== null && !picks.includes(m.card.id))
          .sort((x, y) => (y.weight - x.weight) || (y.share - x.share) || (x.at - y.at))[0];
        if (landmark && picks.length < RANKS) picks.push(landmark.card.id);
        floors.set(power, picks);
      }
    }
    const out = rankPowers(view, landed, tuning);
    return { out, floors, view };
  }
  /** power -> [rank-1 id, rank-2 id, rank-3 id] */
  const ranksOf = (cards) => {
    const by = new Map();
    for (const c of cards) for (const m of c.memberships || []) if (m.rank) { if (!by.has(m.power)) by.set(m.power, []); by.get(m.power)[m.rank - 1] = c.id; }
    return by;
  };
  /**
   * I-5 by the deal: every power's floor picks hold their ranks (FLOOR 1 rank 1; FLOOR 2 the next). COHERENCE-POWERS-6
   * (item 2): in a vacancy the keeper (the governing power's first) leads no contender and no succession power — its rank
   * there is re-dealt to the next member (keeperLeavesTheContest / keeperLeavesTheClaim). So a floor pick equal to the
   * keeper's own card, on such a power, is not required to hold: the oracle mirrors the ruled re-deal.
   */
  const floorFindings = (cards, floors, view) => {
    const ranks = ranksOf(cards); const out = [];
    const governing = nameOf(governingFactionOf(view));
    const keeper = ranks.get(governing)?.[0] || null;
    const reDealt = new Set();
    if (view && isSeatVacant(view) && keeper) {
      for (const c of coupContenders(view).challengers) reDealt.add(c.name);
      for (const f of view.powerStructure?.factions || []) if (stressPowerRowOf(view, f)?.stress === 'succession_void') reDealt.add(nameOf(f));
    }
    for (const [power, picks] of floors) picks.forEach((id, k) => {
      if (reDealt.has(power) && id === keeper) return; // the keeper left this power's lead (item 2)
      if ((ranks.get(power) || [])[k] !== id) out.push(`${power} rank ${k + 1}: ${(ranks.get(power) || [])[k]} where the floor is ${id}`);
    });
    return out;
  };

  it('the dials: a draft table of four leaves, and the push of a clean card is 1, an agent\'s within [1, max]', async () => {
    const { GUILD_PUSH_TUNING, guildPushOf } = await import('../../../src/generators/people/castPowers.js');
    expect(GUILD_PUSH_TUNING).toEqual({ strength: 0.6, strengthFull: 30, organized: 0.4, max: 2.0 });
    expect(Object.isFrozen(GUILD_PUSH_TUNING)).toBe(true);
    const s = { powerStructure: { factions: [{ faction: "Thieves' Guild", category: 'criminal', power: 15 }] }, institutions: [] };
    const agent = { allegiance: { power: "Thieves' Guild", house: 'Rookery', vector: 'greed', via: 'office', handler: 'h', share: 0.15 } };
    expect(guildPushOf({}, s)).toBe(1);
    // 1 + 0.6·(15 ÷ 30) + 0.4·organized, organized = 0.25 (the independent power's bonus; no criminal house)
    expect(guildPushOf(agent, s)).toBeCloseTo(1 + 0.6 * 0.5 + 0.4 * 0.25, 10);
    expect(guildPushOf(agent, s, { organized: 1, tuning: { ...GUILD_PUSH_TUNING, strength: 5 } })).toBe(2);
    expect(guildPushOf({ allegiance: { ...agent.allegiance, power: null } }, s, { organized: 1 })).toBeCloseTo(1.4, 10);
  });

  it('I-5: under a MAXIMAL push every floor holds on the soak slice, and the push is live (it moves weighted ranks)', async () => {
    const rows = await born();
    let floorsSeen = 0; let moved = 0; const agentWeighted = { none: 0, max: 0 };
    const found = [];
    for (const { i, s } of rows) {
      if (!(s.npcs || []).some((n) => n.allegiance)) continue;
      const max = await redeal(s, i, MAXIMAL);
      const none = await redeal(s, i, NONE);
      found.push(...floorFindings(max.out, max.floors, max.view).map((f) => `${i} ${f}`));
      floorsSeen += [...max.floors.values()].reduce((a, p) => a + p.length, 0);
      const rm = ranksOf(max.out); const rn = ranksOf(none.out);
      for (const [power, ids] of rm) if (JSON.stringify(ids) !== JSON.stringify(rn.get(power))) moved += 1;
      const agents = new Set(max.out.filter((c) => c.allegiance).map((c) => c.id));
      const weighted = (r, floors) => [...r].reduce((a, [p, ids]) => a + ids.filter((id, k) => k >= (floors.get(p) || []).length && agents.has(id)).length, 0);
      agentWeighted.max += weighted(rm, max.floors); agentWeighted.none += weighted(rn, none.floors);
    }
    expect(found).toEqual([]);
    expect(floorsSeen).toBeGreaterThan(200);
    expect(moved, 'the maximal push moves some power\'s weighted ranks').toBeGreaterThan(5);
    expect(agentWeighted.max, 'agents hold more weighted ranks under the push').toBeGreaterThan(agentWeighted.none);
  }, 180_000);

  it('I-5\'s control: the floor checker reds on a planted floor breach', async () => {
    const rows = await born();
    const { i, s } = rows.find(({ s }) => (s.npcs || []).some((n) => n.allegiance));
    const { out, floors, view } = await redeal(s, i, MAXIMAL);
    const [power, picks] = [...floors].find(([, p]) => p.length);
    const holder = out.find((c) => c.id === picks[0]);
    const other = out.find((c) => c.id !== picks[0] && (c.memberships || []).some((m) => m.power === power));
    const planted = out.map((c) => JSON.parse(JSON.stringify(c)));
    const swap = (id, rank) => { const m = planted.find((c) => c.id === id).memberships.find((x) => x.power === power); m.rank = rank; };
    const was = other.memberships.find((m) => m.power === power).rank;
    swap(holder.id, was); swap(other.id, 1);
    expect(floorFindings(planted, floors, view).length).toBeGreaterThan(0);
  }, 180_000);

  it('I-13: removing a card leaves every other card\'s push, and the ranks of every power it held no membership in, byte-identical', async () => {
    const { guildPushOf } = await import('../../../src/generators/people/castPowers.js');
    const rows = await born();
    let compared = 0;
    for (const { i, s } of rows.slice(0, 20)) {
      const victim = (s.npcs || []).find((n) => n.institution?.kind === 'house' && !n.allegiance && (n.memberships || []).length);
      if (!victim) continue;
      const whole = await redeal(s, i, undefined);
      const less = await redeal(s, i, undefined, victim.id);
      const held = new Set((whole.out.find((c) => c.id === victim.id)?.memberships || []).map((m) => m.power));
      const rw = ranksOf(whole.out); const rl = ranksOf(less.out);
      for (const [power, ids] of rw) {
        if (held.has(power)) continue;
        expect(`${i} ${power} ${JSON.stringify(rl.get(power))}`).toBe(`${i} ${power} ${JSON.stringify(ids)}`);
        compared += 1;
      }
      for (const c of less.out) expect(guildPushOf(c, s)).toBe(guildPushOf(whole.out.find((x) => x.id === c.id), s));
    }
    expect(compared).toBeGreaterThan(50);
  }, 180_000);
});
