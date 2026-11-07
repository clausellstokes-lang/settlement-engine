/**
 * tests/domain/dossier/seatHolder.test.js — WHO RULES HAS ONE ANSWER (lane RULERS,
 * 2026-11-03; root-cause trace failure 5, fix shape B's interim seat fix).
 *
 * The Power tab's seat is the governing faction's member whose ROLE is one of the
 * generator's own head-of-government titles (npcGenerator.js :: TIER_MANDATORY_ROLES
 * makes Elder, Mayor, Governor), matched as whole words, in the generator's own
 * precedence (Governor over Mayor over Elder). Never a person of another faction,
 * never an unnamed office stand-in ("The " + a role). Nobody qualifies: the seat
 * reads empty, once.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { rulingChainOf } from '../../../src/domain/dossier/powerStrata.js';
import { governingFactionOf, nameOf } from '../../../src/domain/rulingPower.js';
import { seatHolderFindings } from '../../../src/domain/coherence/seatHolderFindings.js';
import { SEAT_TITLES, TIER_HEAD } from '../../../src/domain/dossier/seatHolder.js';
import { readFileSync } from 'node:fs';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** @type {Array<{ seed: string, tier: string, s: any }>} */
const corpus = [];

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const tier of TIERS) {
    for (let i = 0; i < 20; i += 1) {
      const seed = `rulers-${tier}-${i}`;
      corpus.push({ seed, tier, s: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier }), null, { seed, customContent: {} }) });
    }
  }
}, 120_000);

// Premise re-stated by identity with its cause (LANDING-7 lane G, second seat, ruling R-G1, 2026-11-06):
// since 6da7d3f64 (RUNG1-TRUTH unit D) a non-royal succession_void names its claimants from the noble
// pool, so the old name test (/claimant/i) counted 0 vacancies and the vacancy limb passed vacuously.
// A vacancy is the record's own fact: the governing faction's `vacant` modifier, which the stressor
// writes (stressFactions.js :: applyStressEventFactions) and powerStrata.js :: rulingChainOf reads.
const isClaimantVacancy = (s) => (governingFactionOf(s)?.modifiers || []).includes('vacant');

describe('the seat over 120 generated settlements (twenty per tier, fixed seeds)', () => {
  it('every settlement seats exactly one named person of the governing faction, or reads its claimant vacancy once', () => {
    const misses = [];
    let seated = 0;
    let vacant = 0;
    for (const { seed, s } of corpus) {
      const chain = rulingChainOf(s);
      const gov = nameOf(governingFactionOf(s));
      if (isClaimantVacancy(s)) {
        vacant += 1;
        if (chain.npc || chain.absence?.kind !== 'missing_seat') misses.push(`${seed}: vacancy misread`);
        continue;
      }
      const npc = chain.npc ? (s.npcs || []).find((n) => n.name === chain.npc.name) : null;
      if (!npc) { misses.push(`${seed}: nobody seated`); continue; }
      if (npc.factionAffiliation !== gov) misses.push(`${seed}: ${npc.name} is of ${npc.factionAffiliation}, not ${gov}`);
      if (/^The\s/.test(npc.name)) misses.push(`${seed}: stand-in ${npc.name}`);
      seated += 1;
    }
    expect(misses).toEqual([]);
    expect(vacant, 'fixture premise: the corpus holds a vacant seat (rulers-thorp-11 among them)').toBeGreaterThan(0);
    expect(seated + vacant).toBe(120);
  });

  // Re-keyed by identity with its cause (PEOPLE-2 CAST-DERIVED, 2026-11-07): the people car's cast
  // records who holds the seat — the governing power's RANK-1 FACE (people/castPowers.js floor 1:
  // the seat house's face or the seat minted from the governing power) — and a representative's
  // role is its institution's title (M-1b: "the eldest", "the headman", "the reeve"), so the old
  // premise "the role reads Elder" no longer names the seat. Every tier, not only the thorp.
  it('every settlement that is not a claimant vacancy seats the governing power\'s rank-1 face', () => {
    const live = corpus.filter(({ s }) => !isClaimantVacancy(s));
    expect(live.length).toBeGreaterThan(100);
    const misses = live.map(({ seed, s }) => {
      const gov = nameOf(governingFactionOf(s));
      const npc = (s.npcs || []).find((n) => n.name === rulingChainOf(s).npc?.name);
      return npc && (npc.memberships || []).some((m) => m.power === gov && m.rank === 1) ? null : `${seed}:${npc?.title ?? 'none'}`;
    }).filter(Boolean);
    expect(misses).toEqual([]);
  });

  it('every thorp and hamlet that is not a claimant vacancy seats the governing power\'s FIRST, whose role is its title (M-1b)', () => {
    // Kept by MERGE-234 (the chair's ruling: lane 2's seat code, proven by lane 1's thorp/hamlet seat-line arm too).
    // 2026-11-07 PEOPLE-1 CAST (M-1b, the owner: a representative's ROLE is its institution's title and its standing
    // in each power its RANK): the seat is the card ranked first in the governing power — 'the eldest', 'the headman',
    // 'the household elder' at a thorp or hamlet (the census's titles and the R-P2 mint table), never 'Elder'.
    const small = corpus.filter(({ tier, s }) => (tier === 'thorp' || tier === 'hamlet') && !isClaimantVacancy(s));
    expect(small.length).toBeGreaterThan(30);
    const misses = [];
    for (const { seed, s } of small) {
      const gov = nameOf(governingFactionOf(s));
      const npc = rulingChainOf(s).npc;
      const card = npc ? (s.npcs || []).find((n) => n.name === npc.name) : null;
      if (!card) { misses.push(`${seed}: nobody seated`); continue; }
      if (card.role !== card.title) misses.push(`${seed}: role ${card.role} is not the title ${card.title}`);
      if (!(card.memberships || []).some((m) => m.power === gov && m.rank === 1)) misses.push(`${seed}: ${card.name} is not ${gov}'s first`);
    }
    expect(misses).toEqual([]);
  });

  it('seatHolderFindings is empty over the 120', () => {
    const found = corpus.flatMap(({ seed, s }) => seatHolderFindings(s).map((f) => `${seed}: ${f.code}`));
    expect(found).toEqual([]);
  });
});

/** A crafted roster: the governing Town Council and a noble Manor Household. */
function crafted(npcs) {
  return {
    id: 'settlement.seatburg',
    name: 'Seatburg',
    powerStructure: {
      government: 'council',
      factions: [
        { faction: 'Town Council', power: 50, category: 'government', isGoverning: true },
        { faction: 'Manor Household', power: 30, category: 'noble' },
        { faction: 'Thieves Guild', power: 20, category: 'criminal' },
      ],
    },
    npcs,
  };
}

describe('the tier\'s own head wins (chair ruling c, 2026-11-03)', () => {
  // Fixture re-seated by identity rulers-city-9/-12 -> rulers-city-5/-9 (LANDING-7 lane G, 2026-11-06):
  // Register VII lit (3420d01e3, X-46 car 4; first-parent bisect: green at fb5edb7f5, red from
  // 3420d01e3) re-draws the city rosters, so the two cities whose governing faction holds a Governor
  // beside its Mayor are now -5 and -9 (2 of the 20, the mechanism still fires); the assertion is unchanged.
  // Re-keyed by identity with its cause (PEOPLE-2 CAST-DERIVED, 2026-11-07): the generator no longer
  // mints a Mayor and a Governor into one governing faction (the people car: one face per house,
  // roles are titles, M-1b), so the premise "two cities hold both heads" is gone from the corpus.
  // The seat is the seat house's face or the minted seat — never a second head — in every city.
  it('every city seats its seat house\'s face (or the minted seat), and no second card holds the governing power\'s rank 1', () => {
    const cities = corpus.filter(({ tier, s }) => tier === 'city' && !isClaimantVacancy(s));
    expect(cities.length).toBe(20);
    const misses = cities.map(({ seed, s }) => {
      const gov = nameOf(governingFactionOf(s));
      const firsts = (s.npcs || []).filter((n) => (n.memberships || []).some((m) => m.power === gov && m.rank === 1));
      const seated = rulingChainOf(s).npc?.name;
      return firsts.length === 1 && firsts[0].name === seated && (firsts[0].institution?.kind === 'house' || firsts[0].id === 'npc_seat') ? null : `${seed}:${firsts.length}`;
    }).filter(Boolean);
    expect(misses).toEqual([]);
  });

  it('the tier decides: a metropolis seats its Governor, a city its Mayor, and another head seats only when the tier\'s own is absent', () => {
    const mayor = { id: 'm', name: 'Hypatia Kamytzes', role: 'Mayor', factionAffiliation: 'Town Council' };
    const governor = { id: 'g', name: 'Ioannikios Alexios', role: 'Governor', factionAffiliation: 'Town Council' };
    const elder = { id: 'e', name: 'Idunn Haraldsson', role: 'Elder', factionAffiliation: 'Town Council' };
    const at = (tier, npcs) => rulingChainOf({ ...crafted(npcs), tier }).npc?.name;
    expect(at('city', [governor, mayor])).toBe('Hypatia Kamytzes');
    expect(at('metropolis', [mayor, governor])).toBe('Ioannikios Alexios');
    expect(at('hamlet', [mayor, elder])).toBe('Idunn Haraldsson');
    expect(at('city', [elder, governor])).toBe('Ioannikios Alexios');
  });
});

describe('the seat resolver, crafted rosters', () => {
  it('never seats an office stand-in or a person of another faction — the seat reads empty once', () => {
    const s = crafted([
      { id: 'a', name: 'The Lord Mayor', role: 'Lord Mayor', factionAffiliation: 'Manor Household' },
      { id: 'b', name: 'Vesna Krol', role: 'Clerk', factionAffiliation: 'Town Council' },
    ]);
    const chain = rulingChainOf(s);
    expect(chain.npc).toBeNull();
    expect(chain.absence?.kind).toBe('unrecorded');
  });

  it('a stand-in inside the governing faction is not seated either', () => {
    const chain = rulingChainOf(crafted([{ id: 'a', name: 'The Mayor', role: 'Mayor', factionAffiliation: 'Town Council' }]));
    expect(chain.npc).toBeNull();
    expect(chain.absence?.kind).toBe('unrecorded');
  });

  it('seats the Elder, and prefers Governor over Mayor over Elder', () => {
    const elder = { id: 'e', name: 'Idunn Haraldsson', role: 'Elder', factionAffiliation: 'Town Council' };
    const mayor = { id: 'm', name: 'Hypatia Kamytzes', role: 'Mayor', factionAffiliation: 'Town Council' };
    const governor = { id: 'g', name: 'Ioannikios Alexios', role: 'Governor', factionAffiliation: 'Town Council' };
    expect(rulingChainOf(crafted([elder])).npc?.name).toBe('Idunn Haraldsson');
    expect(rulingChainOf(crafted([elder, mayor])).npc?.name).toBe('Hypatia Kamytzes');
    expect(rulingChainOf(crafted([elder, mayor, governor])).npc?.name).toBe('Ioannikios Alexios');
  });

  it('matches whole words in the role: Chief Magistrate, Crime Lord and a farmer titled Elder are not the seat', () => {
    const chain = rulingChainOf(crafted([
      { id: 'c', name: 'Aldo Brun', role: 'Chief Magistrate', factionAffiliation: 'Town Council' },
      { id: 'k', name: 'Rook Danner', role: 'Crime Lord', factionAffiliation: 'Town Council' },
      { id: 'f', name: 'Mira Holt', role: 'Widowed Farmer', title: 'Elder', factionAffiliation: 'Town Council' },
    ]));
    expect(chain.npc).toBeNull();
    expect(chain.absence?.kind).toBe('unrecorded');
  });
});

describe('the seat titles mirror the generator', () => {
  it('the head each tier mandates in npcGenerator.js TIER_MANDATORY_ROLES is a seat title', () => {
    const src = readFileSync(new URL('../../../src/generators/npcGenerator.js', import.meta.url), 'utf8');
    const block = src.slice(src.indexOf('const TIER_MANDATORY_ROLES = {'), src.indexOf('};', src.indexOf('const TIER_MANDATORY_ROLES = {')));
    const heads = [...block.matchAll(/^\s*(\w+):\s*\['([^']+)'/gm)].map((m) => [m[1], m[2]]);
    expect(heads.map(([tier]) => tier)).toEqual(TIERS);
    for (const [tier, head] of heads) expect(SEAT_TITLES, `${tier} head ${head}`).toContain(head);
    expect(Object.fromEntries(heads), 'TIER_HEAD mirrors each tier\'s mandated head').toEqual({ ...TIER_HEAD });
  });
});

describe('seatHolderFindings, planted faults', () => {
  const base = () => corpus.find(({ tier, s }) => tier === 'village' && !isClaimantVacancy(s)).s;

  // Re-keyed by identity with its cause (PEOPLE-2 CAST-DERIVED, 2026-11-07): the village's seat is its
  // rank-1 face, titled from its house ("the headman", "the reeve"), not a role reading Mayor — a
  // planted Mayor no longer shares the seated card's title. The second seat-holder is planted the
  // way the cast records the seat: a second card ranked first in the governing power.
  it('finds a second seat-holder planted in the governing faction', () => {
    const s = base();
    const gov = nameOf(governingFactionOf(s));
    const planted = { ...s, npcs: [...s.npcs, { id: 'npc.planted.mayor', name: 'Second Mayor', role: 'Mayor', memberships: [{ power: gov, rank: 1, share: 1 }] }] };
    expect(seatHolderFindings(s)).toEqual([]);
    expect(seatHolderFindings(planted).length).toBeGreaterThanOrEqual(1);
  });

  it('finds a stand-in planted in the seat office', () => {
    const s = crafted([{ id: 'a', name: 'The Mayor', role: 'Mayor', factionAffiliation: 'Town Council' }]);
    expect(seatHolderFindings(s).map((f) => f.code)).toContain('seat_stand_in');
  });
});
