/**
 * tests/domain/seat/seatContest.test.js — U4, THE CONTEST (CS3, CS4, CS5, DARK): under the seat law the power that
 * holds the seat never contests its own seat; the contest's kind read and the circumstance factors light together
 * behind ONE dial that lands dark (SEAT-1 train 1; brief docs/chair/2026-11-20/content/seat/briefs/U4-CONTEST.md, its
 * CURE and SEAT-3's dispatch additions).
 *
 * Every fixture is hand-built, carries `_seatLawVersion: 2` on its law arm and is run without it as well; every one is
 * a town-size or city-size seat (COMMON's size line: the contest bites at town size). The arms, in the brief's order:
 *   (1) a merchant-held City Council (the holder Merchant Guilds by R2): before, Merchant Guilds is a challenger; under
 *       the law it is not, and the fourth heaviest takes the third place; without the law, unchanged; the office row
 *       stays the incumbent with its own power figure;
 *   (2) a Ducal Governorship held by its noble house (R3): the house leaves the field;
 *   (3) a town whose only challenger is its holder: no challengers, `coupRiskLabel` Stable, `resolveCoupVerdict` the
 *       plot collapsing (no invented contender);
 *   (4) `factionStanding.js :: annotateFactionStanding`'s partial call reads the law its seat hands (the contender set
 *       it computes, read off the real `coupContenders` through a spy; not the prose), and a seat that hands no law
 *       reads the old one (fail closed);
 *   (5) the dial lit (the flip, 2026-11-23; dark until that day): every factor reads 1 and the kind read is the
 *       contest's, so each weight is its power times its kind's coercion, the old law's arithmetic;
 *   (6) the circumstance reads on hand-built records, each held and not held, and none reads a hidden fact;
 *   (7) a planted lit dial (the seat-law wiring test's seam: `vi.doMock` of the dial's module, the product dial never
 *       touched) shows craft-led lifting a craft guild into the three, and the kind read lighting with it;
 *   (8) the craft variant (RULINGS (9) 4, SEAT-3's dispatch additions): under the law with the dial lit, a craft
 *       contender's plot reads `merchant_cabal`, never `palace_coup`; under the old law, today's read;
 *   (9) the old law is byte-identical: the same fixture, its law absent, 1, a string or garbage, against the JSON the
 *       base (d61c05637) produced for it, recorded before this unit's code.
 */
import { describe, test, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { coupContenders, coupRiskLabel, resolveCoupVerdict, COUP_COERCION } from '../../../src/domain/rulingPowerCoup.js';
import { holderOf } from '../../../src/domain/seat/holderOfSeat.js';
import { factionArchetype } from '../../../src/domain/factionArchetypes.js';
import { SEAT_CIRCUMSTANCES, contestKindOf } from '../../../src/domain/seat/seatTable.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const CIRC_PATH = '../../../src/domain/seat/seatCircumstances.js';
const circumstances = () => import(CIRC_PATH);

// ── fixtures ───────────────────────────────────────────────────────────────────────────────────────────────

/** A card the served document keeps whole (U3's idiom). */
const card = (id, name, role, memberships) => ({
  id, name, role, title: role,
  institution: { kind: 'power', key: memberships[0]?.power || '', family: null, title: role, veiled: false },
  memberships: memberships.map((m) => ({ share: 0, veiled: false, ...m })),
});

/**
 * A seat and the powers beside it. `seatOf` is the seat's person's memberships (rank 1 in the seat by default).
 * @param {object} o
 */
const town = ({
  tier = 'town', government, governingCategory = 'government', govPower = 30, govMultiplier = 0.9,
  powers, seatOf = null, legitimacy = {}, extra = {},
}) => ({
  name: 'Brackenford',
  tier,
  powerStructure: {
    government,
    governingName: government,
    factions: [
      { faction: government, category: governingCategory, power: govPower, isGoverning: true, modifiers: [] },
      ...powers.map((p) => ({ modifiers: [], ...p })),
    ],
    factionRelationships: [],
    publicLegitimacy: { score: 55, label: 'Tolerated', govMultiplier, ...legitimacy },
  },
  npcs: [card('npc_seat', 'Hilde Brandt', 'Mayor', seatOf || [{ power: government, rank: 1 }])],
  ...extra,
});

/** The same record with its config carrying `version` (and its `_config` echo), or with no law at all. */
const withLaw = (s, version) => {
  const { config, _config, ...rest } = s;
  if (version === undefined) return rest;
  const bag = { ...(config || {}), _seatLawVersion: version };
  return { ...rest, config: bag, _config: bag };
};
const LAW = 2;

const names = (contest) => contest.challengers.map((c) => c.name);

/** (1)'s town: a City Council whose Mayor heads the Merchant Guilds (the dual hat, R2). */
const merchantCityCouncil = ({ craftCategory = 'craft', quietPower = 9 } = {}) => town({
  tier: 'city',
  government: 'City Council',
  seatOf: [{ power: 'City Council', rank: 1 }, { power: 'Merchant Guilds', rank: 1 }],
  powers: [
    { faction: 'Merchant Guilds', category: 'economy', power: 25 },
    { faction: 'Noble Houses', category: 'noble', power: 20 },
    { faction: 'Temple of the Dawn', category: 'religious', power: 15 },
    { faction: 'Craft Guilds', category: craftCategory, power: 14 },
    { faction: 'Quiet Circle', category: 'arcane', power: quietPower, hidden: true },
  ],
});

/** The proposal's figures (SEAT-1-PROPOSAL.md section (5); RULINGS: the owner's to sign), as the plant lights them. */
const PROPOSED = Object.freeze({
  factors: Object.freeze({
    craft_led: Object.freeze({ craft: 1.5 }),
    trade_wealth: Object.freeze({ merchant: 1.15 }),
    strong_faith: Object.freeze({ religious: 1.25 }),
    martial_pressure: Object.freeze({ noble: 1.15 }),
    hunger: Object.freeze({ labor: 1.4 }),
    mandate: Object.freeze({ noble: 1.3, craft: 1.2 }),
    outside_debt: Object.freeze({ outsider: 1.4, merchant: 1.15 }),
    occupation: Object.freeze({ outsider: 1.2 }),
  }),
  productCeiling: 1.6,
});

/**
 * Re-import a module with the dial's module replaced by a LIT one: `seatLawWiring.test.js :: boundaryWithLitSeatLaw`'s
 * seam. The product dial is never touched; the real module's reads are kept, and only the dial (and, where given, the
 * table) is planted. Torn down with the module registry.
 */
async function withLitDial(modulePath, table = null) {
  vi.resetModules();
  vi.doMock(CIRC_PATH, async (importOriginal) => {
    const actual = await importOriginal();
    return { ...actual, SEAT_CONTEST_LIT: true, ...(table ? { SEAT_CIRCUMSTANCE_TUNING: table } : {}) };
  });
  return import(modulePath);
}

afterEach(() => {
  vi.doUnmock(CIRC_PATH);
  vi.doUnmock('../../../src/domain/rulingPowerCoup.js');
  vi.resetModules();
});

// ── (1) the holder leaves the challengers ───────────────────────────────────────────────────────────────────

describe('(1) a merchant-held City Council: the holder leaves the challengers, the fourth takes the third place', () => {
  test('the holder is Merchant Guilds by R2 (the precondition, read through the built leaf)', () => {
    const h = holderOf(withLaw(merchantCityCouncil(), LAW), { audience: 'owner' });
    expect(h).toMatchObject({ rule: 'R2', holderName: 'Merchant Guilds' });
  });

  test('without the law Merchant Guilds contests its own seat; under it, it does not and Craft Guilds is third', () => {
    const s = merchantCityCouncil();
    expect(names(coupContenders(withLaw(s, undefined)))).toEqual(['Merchant Guilds', 'Noble Houses', 'Temple of the Dawn']);
    expect(names(coupContenders(withLaw(s, 1)))).toEqual(['Merchant Guilds', 'Noble Houses', 'Temple of the Dawn']);
    const lawful = coupContenders(withLaw(s, LAW));
    expect(names(lawful)).toEqual(['Noble Houses', 'Temple of the Dawn', 'Craft Guilds']);
    expect(lawful.challengers.find((c) => c.name === 'Craft Guilds')).toEqual({ name: 'Craft Guilds', archetype: 'craft', power: 14, weight: 11.9 });
  });

  test('the office row stays the incumbent with its own power figure; no share moves', () => {
    const s = merchantCityCouncil();
    const before = coupContenders(withLaw(s, undefined));
    const lawful = coupContenders(withLaw(s, LAW));
    expect(lawful.governing).toBe(before.governing);
    const { gated: _g1, ...incBefore } = before.incumbent;
    const { gated: _g2, ...incLawful } = lawful.incumbent;
    expect(incLawful).toEqual(incBefore);
    expect(incLawful).toEqual({ name: 'City Council', power: 30, govMultiplier: 0.9, amplifiedWeight: 27 });
    // the record is read, never written: every row's power is what it was
    expect(s.powerStructure.factions.map((f) => f.power)).toEqual([30, 25, 20, 15, 14, 9]);
  });
});

// ── (2) a noble house's own governorship ────────────────────────────────────────────────────────────────────

describe('(2) a Ducal Governorship held by its noble house: the house leaves the field', () => {
  const ducal = () => town({
    government: 'Ducal Governorship', governingCategory: 'noble',
    powers: [
      { faction: 'House Valeric', category: 'noble', power: 24 },
      { faction: 'Merchant Guilds', category: 'economy', power: 20 },
      { faction: 'Temple of the Dawn', category: 'religious', power: 15 },
      { faction: 'Town Watch', category: 'military', power: 10 },
    ],
  });

  test('the holder is House Valeric by R3 (the seat of a noble kind, its leading open noble power)', () => {
    expect(holderOf(withLaw(ducal(), LAW), { audience: 'owner' })).toMatchObject({ rule: 'R3', holderName: 'House Valeric' });
  });

  test('before it leads the field; under the law it is gone and the Town Watch takes the third place', () => {
    expect(names(coupContenders(withLaw(ducal(), undefined)))).toEqual(['House Valeric', 'Merchant Guilds', 'Temple of the Dawn']);
    expect(names(coupContenders(withLaw(ducal(), LAW)))).toEqual(['Merchant Guilds', 'Temple of the Dawn', 'Town Watch']);
  });
});

// ── (3) the only challenger is the holder ───────────────────────────────────────────────────────────────────

describe('(3) a town whose only challenger is its holder: no challengers, Stable, the plot collapses', () => {
  const lone = () => town({
    tier: 'town',
    government: 'Merchant Council',
    powers: [
      { faction: 'Merchant Guilds', category: 'economy', power: 40 },
      { faction: 'Thieves Guild', category: 'criminal', power: 20 },
      { faction: 'Hedge Witches', category: 'arcane', power: 3 },
    ],
  });
  const rng = () => ({ random: () => 0.99 });

  test('without the law the Merchant Guilds stand alone in the field', () => {
    const before = coupContenders(withLaw(lone(), undefined));
    expect(names(before)).toEqual(['Merchant Guilds']);
    expect(coupRiskLabel(before)).not.toBe('Stable');
  });

  test('under the law the field is empty and nobody is invented to fill it', () => {
    const s = withLaw(lone(), LAW);
    expect(holderOf(s, { audience: 'owner' }).holderName).toBe('Merchant Guilds');
    const lawful = coupContenders(s);
    expect(lawful.challengers).toEqual([]);
    expect(coupRiskLabel(lawful)).toBe('Stable');
    const verdict = resolveCoupVerdict({ settlement: s, rng: rng() });
    expect(verdict).toMatchObject({ holds: true, pHold: 1, winner: null, challengers: [] });
    expect(verdict.reason).toBe('No power is strong enough to move against the seat. The plot collapses on its own.');
  });
});

// ── (4) the partial caller hands the law ────────────────────────────────────────────────────────────────────

describe('(4) annotateFactionStanding\'s partial call reads the law its seat hands, and fails closed without it', () => {
  /** The roster as the power step hands it: governing first, a merchant seat whose own guild outweighs it. */
  const roster = () => [
    { faction: 'Merchant Council', category: 'government', power: 30, isGoverning: true, desc: '' },
    { faction: 'Merchant Guilds', category: 'economy', power: 40, desc: '' },
    { faction: 'Noble Houses', category: 'noble', power: 18, desc: '' },
    { faction: 'Temple of the Dawn', category: 'religious', power: 12, desc: '' },
  ];
  const publicLegitimacy = { score: 52, label: 'Tolerated', govMultiplier: 0.9 };

  /** annotateFactionStanding re-imported over a spy that wraps the REAL coupContenders; returns what it computed. */
  async function partialContestOf(seat) {
    vi.resetModules();
    const calls = [];
    vi.doMock('../../../src/domain/rulingPowerCoup.js', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        coupContenders: (settlement) => {
          const result = actual.coupContenders(settlement);
          calls.push({ settlement, result });
          return result;
        },
      };
    });
    const { annotateFactionStanding } = await import('../../../src/generators/power/factionStanding.js');
    annotateFactionStanding(roster(), { body: 'garrison' }, seat);
    expect(calls, 'the partial call ran once').toHaveLength(1);
    return calls[0];
  }

  test('a seat that hands the law: the holder (Merchant Guilds, R3) leaves the field the standing line reads', async () => {
    const { settlement, result } = await partialContestOf({ publicLegitimacy, config: { _seatLawVersion: LAW } });
    expect(settlement.config?._seatLawVersion, 'the partial settlement carries the law').toBe(LAW);
    expect(names(result)).toEqual(['Noble Houses', 'Temple of the Dawn']);
    expect(coupRiskLabel(result)).toBe('Holding');
  });

  test('a seat that hands no law reads the old one: the holder still contests (fail closed)', async () => {
    const { result } = await partialContestOf({ publicLegitimacy });
    expect(names(result)).toEqual(['Merchant Guilds', 'Noble Houses', 'Temple of the Dawn']);
    expect(coupRiskLabel(result)).toBe('Contested');
  });
});

// ── (5) the dial lit ────────────────────────────────────────────────────────────────────────────────────────

describe('(5) the dial is lit: every factor 1, the kind read the contest\'s, the weights the old law\'s arithmetic', () => {
  test('the dial is lit and every factor of the registered table reads 1', async () => {
    const C = await circumstances();
    // the lit dial (the flip, 2026-11-23): this arm pinned the contest dark until that day
    expect(C.SEAT_CONTEST_LIT, 'the contest was lit with the seat\'s law at the flip; reverting it is the same one line').toBe(true);
    expect(Object.keys(C.SEAT_CIRCUMSTANCE_TUNING.factors)).toEqual([...SEAT_CIRCUMSTANCES]);
    for (const [circ, row] of Object.entries(C.SEAT_CIRCUMSTANCE_TUNING.factors)) {
      for (const [kind, factor] of Object.entries(row)) expect(factor, `${circ} -> ${kind}`).toBe(1);
    }
    for (const kind of Object.keys(COUP_COERCION)) {
      expect(C.circumstanceFactorOf(kind, [...SEAT_CIRCUMSTANCES], C.SEAT_CIRCUMSTANCE_TUNING), kind).toBe(1);
    }
  });

  test('the proposed figures are written beside the table, in its register row, as the owner\'s unsigned proposal', () => {
    const register = JSON.parse(readFileSync(join(ROOT, 'tests/lint/.tuning-register.json'), 'utf8'));
    const row = register.tables['src/domain/seat/seatCircumstances.js#SEAT_CIRCUMSTANCE_TUNING'];
    expect(row, 'the table has its register row').toBeTruthy();
    expect(row).toMatchObject({ status: 'draft', signedAt: null });
    for (const [circ, kinds] of Object.entries(PROPOSED.factors)) {
      for (const [kind, figure] of Object.entries(kinds)) expect(row.note).toContain(`factors.${circ}.${kind} ${figure}`);
    }
    expect(row.note).toContain(`productCeiling ${PROPOSED.productCeiling}`);
  });

  test('under the law, lit: the kind read is the contest\'s (a hidden power reads criminal and leaves, an economy craft guild reads craft)', () => {
    // the holder leaves; a craft guild filed under `economy` and a hidden (non-criminal) arcane circle stand beside it
    const s = merchantCityCouncil({ craftCategory: 'economy', quietPower: 13 });
    const before = coupContenders(withLaw(s, undefined));
    const lawful = coupContenders(withLaw(s, LAW));
    // the lit contest (the flip, 2026-11-23): Quiet Circle stood third, read by today's kind, until that day
    expect(names(lawful)).toEqual(['Noble Houses', 'Temple of the Dawn', 'Craft Guilds']);
    for (const c of lawful.challengers) {
      const row = s.powerStructure.factions.find((f) => f.faction === c.name);
      expect(c.archetype, c.name).toBe(contestKindOf(row));
    }
    // every weight the law computes is the old law's arithmetic for the same power under its kind: every factor 1
    const old = new Map();
    for (const f of s.powerStructure.factions.slice(1)) {
      const one = coupContenders(withLaw({ ...s, powerStructure: { ...s.powerStructure, factions: [s.powerStructure.factions[0], f] } }, undefined));
      if (one.challengers[0]) old.set(one.challengers[0].name, one.challengers[0].weight);
    }
    for (const c of lawful.challengers) expect(c.weight, c.name).toBe(Math.round(c.power * COUP_COERCION[c.archetype] * 100) / 100);
    // a power whose kind the contest reads as today's weighs what the old law gave it
    const todaysKind = lawful.challengers.filter((c) => {
      const row = s.powerStructure.factions.find((f) => f.faction === c.name);
      return contestKindOf(row) === factionArchetype(row);
    });
    expect(names({ challengers: todaysKind })).toEqual(['Noble Houses', 'Temple of the Dawn']);
    for (const c of todaysKind) expect(c.weight, c.name).toBe(old.get(c.name));
    expect(before.challengers.map((c) => c.weight)).toEqual(before.challengers.map((c) => old.get(c.name)));
  });
});

// ── (6) the circumstance reads ──────────────────────────────────────────────────────────────────────────────

describe('(6) the circumstances: each a pure read of what the town records, held and not held', () => {
  /** A calm town that holds none of the eight. */
  const calm = (over = {}) => {
    const base = town({
      government: 'Town Council',
      powers: [
        { faction: 'Merchant Guilds', category: 'economy', power: 30 },
        { faction: 'Craft Guilds', category: 'craft', power: 12 },
        { faction: 'Noble Houses', category: 'noble', power: 20 },
      ],
      legitimacy: { isContested: false, isLegitimacyCrisis: false },
    });
    return {
      ...base,
      config: { settType: 'town', priorityReligion: 50, priorityMilitary: 50, stressTypes: [] },
      economicState: {
        prosperity: 'Moderate',
        incomeSources: [{ source: 'Agriculture', percentage: 60 }, { source: 'Market Taxes', percentage: 40 }],
        foodSecurity: { label: 'Self-Sufficient' },
      },
      ...over,
    };
  };
  const heldBy = async (s) => (await circumstances()).seatCircumstancesOf(s);
  const withPowers = (s, mutate) => ({ ...s, powerStructure: { ...s.powerStructure, factions: mutate(s.powerStructure.factions.map((f) => ({ ...f }))) } });
  const withStress = (type) => (s) => ({ ...s, config: { ...s.config, stressTypes: [type] } });

  test('the calm town holds none of the eight', async () => {
    expect(await heldBy(calm())).toEqual([]);
  });

  const CASES = [
    ['craft_led', 'a craft power at least four fifths of the strongest merchant power',
      (s) => withPowers(s, (fs) => fs.map((f) => (f.faction === 'Craft Guilds' ? { ...f, power: 24 } : f)))],
    ['craft_led', 'guild fees at a quarter of the income with a craft power standing',
      (s) => ({ ...s, economicState: { ...s.economicState, incomeSources: [{ source: 'Guild Fees', percentage: 25 }, { source: 'Agriculture', percentage: 75 }] } })],
    ['trade_wealth', 'a prosperous town whose largest income is a trade source',
      (s) => ({ ...s, economicState: { ...s.economicState, prosperity: 'Prosperous', incomeSources: [{ source: 'Market Taxes', percentage: 55 }, { source: 'Agriculture', percentage: 45 }] } })],
    ['strong_faith', 'the faith priority at 70', (s) => ({ ...s, config: { ...s.config, priorityReligion: 70 } })],
    ['strong_faith', 'the religious_conversion stress', withStress('religious_conversion')],
    ['martial_pressure', 'the under_siege stress', withStress('under_siege')],
    ['martial_pressure', 'the military priority at 70', (s) => ({ ...s, config: { ...s.config, priorityMilitary: 70 } })],
    ['hunger', 'the famine stress (on the settlement\'s own stress record)', (s) => ({ ...s, stress: { type: 'famine' } })],
    ['hunger', 'a food deficit', (s) => ({ ...s, economicState: { ...s.economicState, foodSecurity: { label: 'Deficit' } } })],
    ['mandate', 'a contested legitimacy', (s) => ({ ...s, powerStructure: { ...s.powerStructure, publicLegitimacy: { ...s.powerStructure.publicLegitimacy, isContested: true } } })],
    ['mandate', 'a vacant seat', (s) => withPowers(s, (fs) => fs.map((f) => (f.isGoverning ? { ...f, modifiers: ['vacant'] } : f)))],
    ['mandate', 'the succession_void stress (on a stressor row)', (s) => ({ ...s, stressors: [{ type: 'succession_void' }] })],
    ['outside_debt', 'the indebted stress', withStress('indebted')],
    ['outside_debt', 'a power named for creditors', (s) => withPowers(s, (fs) => [...fs, { faction: 'Crown Creditors', category: 'economy', power: 8, modifiers: [] }])],
    ['occupation', 'the occupied stress', withStress('occupied')],
    ['occupation', 'a power carrying the occupied modifier', (s) => withPowers(s, (fs) => fs.map((f) => (f.faction === 'Noble Houses' ? { ...f, modifiers: ['occupied'] } : f)))],
  ];

  test('each circumstance is held on its own planted record, and on nothing else (16 cases)', async () => {
    for (const [circ, what, plant] of CASES) expect(await heldBy(plant(calm())), `${circ} on ${what}`).toEqual([circ]);
  });

  test('none reads a hidden fact: the infiltrated stress, a hidden creditor, a veiled craft power', async () => {
    expect(await heldBy(withStress('infiltrated')(calm()))).toEqual([]);
    expect(await heldBy(withPowers(calm(), (fs) => [...fs, { faction: 'Crown Creditors', category: 'economy', power: 8, hidden: true, modifiers: [] }]))).toEqual([]);
    expect(await heldBy(withPowers(calm(), (fs) => fs.map((f) => (f.faction === 'Craft Guilds' ? { ...f, power: 40, hidden: true } : f))))).toEqual([]);
    expect(await heldBy(withPowers(calm(), (fs) => fs.map((f) => (f.faction === 'Noble Houses' ? { ...f, modifiers: ['occupied'], hidden: true } : f))))).toEqual([]);
  });

  test('the read is a read: a deep-frozen record is answered, twice the same, in the closed list\'s order', async () => {
    const freeze = (v) => { if (v && typeof v === 'object' && !Object.isFrozen(v)) { Object.freeze(v); for (const k of Object.keys(v)) freeze(v[k]); } return v; };
    const s = freeze({ ...withStress('occupied')(calm()), stress: { type: 'famine' } });
    const first = await heldBy(s);
    expect(first).toEqual(['hunger', 'occupation']);
    expect(await heldBy(s)).toEqual(first);
    expect(await heldBy(null)).toEqual([]);
  });
});

// ── (7) a planted lit dial ──────────────────────────────────────────────────────────────────────────────────

describe('(7) a planted lit dial (the seat-law seam): craft-led lifts a craft guild into the three', () => {
  /** A town council (the office holds itself, R4) with a craft guild standing fourth and no merchant power. */
  const guildTown = () => town({
    government: 'Town Council',
    powers: [
      { faction: 'Noble Houses', category: 'noble', power: 20 },
      { faction: 'Temple of the Dawn', category: 'religious', power: 21 },
      { faction: 'Town Watch', category: 'military', power: 16 },
      { faction: 'Craft Guilds', category: 'economy', power: 20 },
    ],
    extra: { config: { priorityReligion: 50, priorityMilitary: 50 } },
  });

  test('dark (the shipped dial): the craft guild stands fourth under the law, as without it', async () => {
    const C = await circumstances();
    const s = withLaw(guildTown(), LAW);
    expect(C.seatCircumstancesOf(s)).toEqual(['craft_led']);
    expect(holderOf(s, { audience: 'owner' }).holder).toBeNull();
    expect(names(coupContenders(s))).toEqual(['Noble Houses', 'Temple of the Dawn', 'Town Watch']);
  });

  test('lit with the shipped table (every factor 1): the kind read lights, the craft guild reads craft and stays out', async () => {
    const lit = await withLitDial('../../../src/domain/rulingPowerCoup.js');
    const contest = lit.coupContenders(withLaw(guildTown(), LAW));
    expect(names(contest)).toEqual(['Noble Houses', 'Temple of the Dawn', 'Town Watch']);
  });

  test('lit with the proposed figures: craft-led lifts the craft guild into the three (first, at 20 x 0.85 x 1.5)', async () => {
    const lit = await withLitDial('../../../src/domain/rulingPowerCoup.js', PROPOSED);
    const contest = lit.coupContenders(withLaw(guildTown(), LAW));
    expect(names(contest)).toEqual(['Craft Guilds', 'Noble Houses', 'Temple of the Dawn']);
    expect(contest.challengers[0]).toEqual({ name: 'Craft Guilds', archetype: 'craft', power: 20, weight: 25.5 });
  });

  test('lit, the kind read reads a hidden power criminal (out of the field) and an economy craft guild craft', async () => {
    const lit = await withLitDial('../../../src/domain/rulingPowerCoup.js');
    const contest = lit.coupContenders(withLaw(merchantCityCouncil({ craftCategory: 'economy', quietPower: 13 }), LAW));
    expect(names(contest)).toEqual(['Noble Houses', 'Temple of the Dawn', 'Craft Guilds']);
    expect(contest.challengers[2]).toEqual({ name: 'Craft Guilds', archetype: 'craft', power: 14, weight: 11.9 });
  });

  test('a lit dial moves nothing under the old law', async () => {
    const lit = await withLitDial('../../../src/domain/rulingPowerCoup.js', PROPOSED);
    for (const s of [guildTown(), merchantCityCouncil({ craftCategory: 'economy', quietPower: 13 })]) {
      expect(JSON.stringify(lit.coupContenders(withLaw(s, undefined)))).toBe(JSON.stringify(coupContenders(withLaw(s, undefined))));
    }
  });
});

// ── (8) the craft variant ───────────────────────────────────────────────────────────────────────────────────

describe('(8) the craft variant: lit, a craft-led plot is the guild cabal it narrates today, never a palace coup', () => {
  /** A town council (no holder) whose heaviest challenger is a craft guild that reads craft today too. */
  const craftLed = () => town({
    government: 'Town Council',
    powers: [
      { faction: 'Craft Guilds', category: 'craft', power: 40 },
      { faction: 'Noble Houses', category: 'noble', power: 18 },
      { faction: 'Temple of the Dawn', category: 'religious', power: 12 },
    ],
  });
  const snapshotOf = (s) => ({ byId: new Map([['s1', { settlement: s }]]), regionalGraph: { edges: [] }, worldState: { stressors: [] } });
  const variantOf = (mod, s) => mod.interpretStressorOrigin('coup_detat', 's1', snapshotOf(s), 4).variant;

  test('lit (the shipped dial): under the law merchant_cabal; without the law today\'s read (palace_coup)', async () => {
    const mod = await import('../../../src/domain/worldPulse/stressorDynamics.js');
    expect(variantOf(mod, withLaw(craftLed(), undefined))).toBe('palace_coup');
    // the lit dial (the flip, 2026-11-23): the plot under the law read palace_coup until that day
    expect(variantOf(mod, withLaw(craftLed(), LAW))).toBe('merchant_cabal');
  });

  test('lit under the law: merchant_cabal; lit under the old law: today\'s palace_coup', async () => {
    const lit = await withLitDial('../../../src/domain/worldPulse/stressorDynamics.js');
    expect(variantOf(lit, withLaw(craftLed(), LAW))).toBe('merchant_cabal');
    expect(variantOf(lit, withLaw(craftLed(), undefined))).toBe('palace_coup');
  });
});

// ── (9) the old law, byte for byte ──────────────────────────────────────────────────────────────────────────

describe('(9) the old law is byte-identical to the base', () => {
  // `coupContenders` on merchantCityCouncil() at the base d61c05637, before this unit's code (recorded by the builder).
  const BASE_JSON = '{"governing":{"faction":"City Council","category":"government","power":30,"isGoverning":true,"modifiers":[]},"challengers":[{"name":"Merchant Guilds","archetype":"merchant","power":25,"weight":23.75},{"name":"Noble Houses","archetype":"noble","power":20,"weight":22},{"name":"Temple of the Dawn","archetype":"religious","power":15,"weight":15}],"incumbent":{"name":"City Council","power":30,"govMultiplier":0.9,"amplifiedWeight":27,"gated":true}}';

  test('the law absent, 1, the string "2" (a foreign value) or an unshipped 3 reads the old law, byte for byte', () => {
    for (const [label, version] of [['absent', undefined], ['1', 1], ['"2"', '2'], ['3', 3]]) {
      expect(JSON.stringify(coupContenders(withLaw(merchantCityCouncil(), version))), label).toBe(BASE_JSON);
    }
  });

  test('a partial settlement with no config at all (the old partial call\'s shape) reads the old law', () => {
    const s = merchantCityCouncil();
    expect(JSON.stringify(coupContenders({ powerStructure: s.powerStructure }))).toBe(BASE_JSON);
  });
});
