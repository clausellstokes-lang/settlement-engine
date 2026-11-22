/**
 * seatChainHolder.test.js — UNDER THE SEAT LAW THE RULING CHAIN NAMES THE HOLDER AND ITS PERSON, NOT THE FORM'S OLD
 * HOUSE (U7, CS13; SEAT-10's brief `docs/chair/2026-11-20/content/seat/briefs/U7-PAGE.md`, builder BU7).
 *
 * THE FAULT (`docs/chair/2026-11-20/content/seat/u7probe/`): after a kept-form transfer on the DM's road
 * (`mutateSettlementChecked` with `CHANGE_RULING_POWER`) the form row stays governing and `holderOf` names a new
 * holder, but `dossier/powerStrata.js :: rulingChainOf` took its person from the governing row, so it named the OLD
 * house's person as ruler: 6 of the 11 kept-form transfers on 160 lit germanic births. The six are pinned below.
 *
 * THE LIT BUILD IS PLANTED, AS `seatLawSavedTown.test.js` PLANTS IT: the seat's dial (`seatLaw.js ::
 * NEW_SETTLEMENT_SEAT_LAW_VERSION` and its mint) and the contest's (`seatCircumstances.js :: SEAT_CONTEST_LIT`) are
 * mocked on one live switch, the real readers kept. A third seam, `holderOfSeat.js :: holderOf`, can be told to answer
 * NOBODY (`seam.nobody`): with no holder the four reads take the governing row exactly as they did before U7, so
 * "today's chain" is read in this one tree, never from a stored digest.
 *
 * THE ARMS, in the brief's order:
 *   1. RED FIRST: the probe's six seeds, each after its DM-road kept-form transfer on the lit build. Today's chain
 *      names the old house's person; the cured chain names the holder's, by a literal, a member of the holder's house.
 *   2. A VEILED HOLDER (hidden, or criminal by category): the reads to a reader are today's; the owner's name it.
 *   3. LAW 1: the reads are byte-identical to the reads with the holder unread, on dark births that DO hold a holder
 *      apart; the control (the same seam on the lit record) moves them, so the differential can see.
 *   4. THE HOLDER IS THE FORM'S OWN ROW (R4, the office holds itself): the reads are the law-1 reads of the same record.
 *
 * @enforced-by this test
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

/** THE ONE SWITCH between the two builds, and the holder seam, read live by the mocked modules below. */
const dial = vi.hoisted(() => ({ lit: false }));
const seam = vi.hoisted(() => ({ nobody: false }));

// The seat's dial and its mint, planted (the real reader kept): lit, the seat law; dark, the default.
vi.mock('../../../src/domain/seat/seatLaw.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return {
    ...actual,
    get NEW_SETTLEMENT_SEAT_LAW_VERSION() {
      return dial.lit ? actual.HOLDER_SEAT_LAW_VERSION : actual.DEFAULT_SEAT_LAW_VERSION;
    },
    newSettlementSeatLaw: () => (dial.lit ? { [actual.SEAT_LAW_CONFIG_KEY]: actual.HOLDER_SEAT_LAW_VERSION } : {}),
  };
});
// The contest's dial, planted (the table kept: every factor 1, L1).
vi.mock('../../../src/domain/seat/seatCircumstances.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return { ...actual, get SEAT_CONTEST_LIT() { return dial.lit; } };
});
// The holder seam: the real read, or (seam.nobody) the same read with no holder named.
vi.mock('../../../src/domain/seat/holderOfSeat.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return {
    ...actual,
    holderOf: (s, o) => {
      const held = actual.holderOf(s, o);
      return seam.nobody ? { ...held, holder: null, holderName: null } : held;
    },
  };
});

import * as seatLaw from '../../../src/domain/seat/seatLaw.js';
import * as circ from '../../../src/domain/seat/seatCircumstances.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { mutateSettlementChecked } from '../../../src/domain/events/mutate.js';
import { governingFactionOf } from '../../../src/domain/rulingPower.js';
import { holderOf } from '../../../src/domain/seat/holderOfSeat.js';
import { rankIn } from '../../../src/domain/people/membership.js';
import { derivePowerStrata, deciderOf, outrankingRivalOf, rulingChainOf } from '../../../src/domain/dossier/powerStrata.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../../helpers/anchoredNegatives.js';

await loadGenerationLawPayloads();

const KEY = '_seatLawVersion';
const OWNER = { audience: 'owner' };
const READER = { audience: 'reader' };
const NOW = '2026-01-01T00:00:00.000Z';
const TAKER = 'Merchant Guilds';

/**
 * Put the graph on a build and prove it is that build (the guard at the top of every arm).
 * @param {boolean} lit
 */
function build(lit) {
  dial.lit = lit;
  seam.nobody = false;
  expect(seatLaw.NEW_SETTLEMENT_SEAT_LAW_VERSION, `the ${lit ? 'LIT' : 'DARK'} build's seat dial`)
    .toBe(lit ? seatLaw.HOLDER_SEAT_LAW_VERSION : seatLaw.DEFAULT_SEAT_LAW_VERSION);
  expect(birthConfig({ settType: 'town', culture: 'germanic' })[KEY], 'a birth on this build mints its dial').toBe(lit ? 2 : undefined);
  expect(circ.SEAT_CONTEST_LIT, 'the contest dial').toBe(lit);
  const factors = Object.values(circ.SEAT_CIRCUMSTANCE_TUNING.factors).flatMap((row) => Object.values(row));
  expect(factors.length, 'the circumstance table has factors').toBeGreaterThan(0);
  expect(factors.every((f) => f === 1), 'a factor of SEAT_CIRCUMSTANCE_TUNING is not 1 (that is LP, not L1)').toBe(true);
}

afterEach(() => { dial.lit = false; seam.nobody = false; });

/** The probe's birth, exactly (`u7probe/probe.mjs`). */
const bear = (settType, seed) => generateSettlementPipeline(birthConfig({ settType, culture: 'germanic' }), null, { seed, customContent: {} });

/** The DM's road: the seat passed to `target` (`u7probe/probe.mjs`'s event, exactly). */
function dmTransfer(s, seed, target) {
  const res = mutateSettlementChecked({ settlement: s, event: { id: `u7p.dm.${seed}`, type: 'CHANGE_RULING_POWER', targetId: target, payload: {} }, now: NOW });
  expect(res.veto, `${seed}: the DM's road is not vetoed`).toBeFalsy();
  return res.settlement;
}

/** The same world under another law: both config echoes stamped (or stripped, `v` null). */
function withLaw(s, v) {
  const bag = (b) => {
    if (!b || typeof b !== 'object') return b;
    const { [KEY]: _drop, ...rest } = b;
    return v == null ? rest : { ...rest, [KEY]: v };
  };
  return { ...s, config: bag(s.config), ...(s._config ? { _config: bag(s._config) } : {}) };
}

/** The four reads, as one comparable text. */
const reads = (s, options) => JSON.stringify({
  chain: rulingChainOf(s, options),
  strata: derivePowerStrata(s, options).powers,
  roster: derivePowerStrata(s, options).roster.map((r) => [r.name, r.isPower, r.powerRole]),
  decider: deciderOf(s, options),
  rival: outrankingRivalOf(s, options),
});

/** `fn` read with the holder unread: the reads as they stood before U7. */
function today(fn) {
  const was = seam.nobody;
  seam.nobody = true;
  try { return fn(); } finally { seam.nobody = was; }
}

/** The name of a card's houses, as the probe reads them. */
const housesOf = (s, name) => {
  const p = (s.npcs || []).find((n) => n?.name === name);
  return p ? [...new Set((p.memberships || []).map((m) => m.power))] : [];
};

/** The holder's row made veiled, the rest of the record as it stands. */
const veiled = (s, holder, mark) => ({
  ...s,
  powerStructure: {
    ...s.powerStructure,
    factions: s.powerStructure.factions.map((f) => (f?.faction === holder ? { ...f, ...mark } : f)),
  },
});

/** THE SIX (the probe's kept-form transfers whose chain named the old house's person), every word a literal. */
const SIX = [
  { settType: 'town', seed: 'u7p-town-8', form: 'Town Mayor', oldHouse: 'Craft Guilds', oldPerson: 'Judith Weber', person: 'Felix Naumann' },
  { settType: 'metropolis', seed: 'u7p-metropolis-15', form: 'Democratic assembly', oldHouse: 'The Merchant Bloc', oldPerson: 'Dietrich Engel', person: 'Josefine Wolf' },
  { settType: 'metropolis', seed: 'u7p-metropolis-21', form: 'Grand Council', oldHouse: 'The Trade Compact', oldPerson: 'Dietmar Uhl', person: 'Christine Jäger' },
  { settType: 'metropolis', seed: 'u7p-metropolis-26', form: 'Grand Council', oldHouse: 'The Commercial Circle', oldPerson: 'Brunhild Steiner', person: 'Gertrude Moser' },
  { settType: 'metropolis', seed: 'u7p-metropolis-27', form: 'Grand Council', oldHouse: 'The Guild Alliance', oldPerson: 'Conrad Brandt', person: 'Katharina Rosenfeld' },
  { settType: 'metropolis', seed: 'u7p-metropolis-28', form: 'Grand Council', oldHouse: 'The Trade Compact', oldPerson: 'Josef Frank', person: 'Notburga Weber' },
];

describe('1. RED FIRST: the probe\'s six kept-form transfers name the holder\'s person', () => {
  it.each(SIX)('$seed: $form kept, the seat from $oldHouse to Merchant Guilds; the chain names $person', ({ settType, seed, form, oldHouse, oldPerson, person }) => {
    build(true);
    const born = bear(settType, seed);
    expect(seatLaw.resolveSeatLawVersion(born), `${seed}: born under the seat law`).toBe(2);
    expect(holderOf(born, OWNER).holderName, `${seed}: the holder before the transfer`).toBe(oldHouse);
    const after = dmTransfer(born, seed, TAKER);
    // the kept form: the governing row stays, the holder moves
    expect(governingFactionOf(after)?.faction, `${seed}: the form is kept`).toBe(form);
    expect(holderOf(after, OWNER).holderName, `${seed}: the holder after the transfer (owner)`).toBe(TAKER);
    expect(holderOf(after, READER).holderName, `${seed}: the holder after the transfer (reader)`).toBe(TAKER);

    // today's chain: the old house's person, of the old house and not of the holder's
    const was = today(() => rulingChainOf(after));
    expect(was.npc?.name, `${seed}: today's chain names the old house's person`).toBe(oldPerson);
    expect(housesOf(after, oldPerson), `${seed}: today's person is of the old house`).toContain(oldHouse);
    expectAbsentWithAnchor(housesOf(after, oldPerson), TAKER, oldHouse, `${seed}: today's person holds no place in the holder's house`);

    // the cure: the form stays the power; the holder is the faction; its person is the holder's, by a literal
    const chain = rulingChainOf(after);
    expect(chain.npc?.name, `${seed}: the chain names the holder's person`).toBe(person);
    expect(chain.power?.name, `${seed}: the chain's power is the form (the office)`).toBe(form);
    expect(chain.faction?.name, `${seed}: the chain's faction is the holder`).toBe(TAKER);
    expect(housesOf(after, person), `${seed}: the person is of the holder's house`).toContain(TAKER);
    expect(rankIn((after.npcs || []).find((n) => n?.name === person), TAKER), `${seed}: the person is the holder's first`).toBe(1);
    // anchored: today's chain names the old person (asserted above), so the before list holds it
    expectPresentThenAbsent([was.npc?.name], [chain.npc?.name], oldPerson, `${seed}: the old house's person leaves the chain`);
    // the owner's own document reads the same holder here
    expect(rulingChainOf(after, OWNER).npc?.name, `${seed}: the owner's chain`).toBe(person);
    // THE POWERS: the ruler entry is the holder
    expect(derivePowerStrata(after).powers.find((p) => p.role === 'ruler')?.name, `${seed}: the ruler entry is the holder`).toBe(TAKER);
  }, 60_000);
});

describe('2. a veiled holder: the reads to a reader are today\'s', () => {
  it.each([
    { kind: 'hidden', mark: { hidden: true } },
    { kind: 'criminal', mark: { category: 'criminal' } },
  ])('u7p-town-8, the Merchant Guilds $kind: the reader reads today\'s chain, Judith Weber', ({ kind, mark }) => {
    build(true);
    const after = dmTransfer(bear('town', 'u7p-town-8'), 'u7p-town-8', TAKER);
    const town = veiled(after, TAKER, mark);
    expect(holderOf(town, OWNER).holderName, `${kind}: the owner still reads the holder`).toBe(TAKER);
    expect(holderOf(town, READER).holderName, `${kind}: the reader is refused the holder`).toBeNull();
    expect(reads(town), `${kind}: the reader's four reads are today's`).toBe(today(() => reads(town)));
    expect(reads(town, READER), `${kind}: the reader's, named`).toBe(today(() => reads(town, READER)));
    expect(rulingChainOf(town).npc?.name, `${kind}: the reader's chain`).toBe('Judith Weber');
    expect(rulingChainOf(town).faction?.name, `${kind}: the reader's faction`).toBe('Town Mayor');
    // anchored: the owner's chain names the holder (the before list), so the reader's lacking it is the veil's work
    expectPresentThenAbsent([rulingChainOf(town, OWNER).faction?.name], [rulingChainOf(town).faction?.name], TAKER, `${kind}: the reader is never told the veiled holder`);
    expect(rulingChainOf(town, OWNER).npc?.name, `${kind}: the owner's chain names the holder's person`).toBe('Felix Naumann');
  }, 60_000);
});

describe('3. law 1: byte-identical, the holder unread', () => {
  it.each(SIX)('$seed born dark, after the same transfer: the reads with the holder read equal the reads without it', ({ settType, seed }) => {
    build(false);
    const born = bear(settType, seed);
    expect(seatLaw.resolveSeatLawVersion(born), `${seed}: born dark`).toBe(1);
    const after = dmTransfer(born, seed, TAKER);
    // the holder is there to read (holderOf does not gate on the law), so the stand-down is the law's
    const owned = holderOf(after, OWNER).holderName;
    expect(owned === null ? [] : [owned], `${seed}: a holder stands apart on the law-1 record`).toHaveLength(1);
    expect(reads(after), `${seed}: law 1, the reader's`).toBe(today(() => reads(after)));
    expect(reads(after, OWNER), `${seed}: law 1, the owner's`).toBe(today(() => reads(after, OWNER)));
    // the control: the same record under the seat law, and the seam moves the reads
    const lit = withLaw(after, 2);
    expect(seatLaw.resolveSeatLawVersion(lit), `${seed}: the control is law 2`).toBe(2);
    expect(reads(lit, OWNER), `${seed}: the control moves (the differential can see)`).not.toBe(today(() => reads(lit, OWNER))); // anchored: the same seam on the law-2 twin moves the reads, so the law-1 equality above is not vacuous
  }, 60_000);
});

describe('4. the holder is the form\'s own row: unchanged', () => {
  it('u7p-town-1 born lit: the office holds itself (R4); the reads are the law-1 reads of the same record', () => {
    build(true);
    const born = bear('town', 'u7p-town-1');
    expect(seatLaw.resolveSeatLawVersion(born), 'born lit').toBe(2);
    const held = holderOf(born, OWNER);
    expect(held.rule, 'the office holds itself').toBe('R4');
    expect(held.holder, 'no holder apart from the form').toBeNull();
    expect(reads(born), 'the reader\'s reads are law 1\'s').toBe(reads(withLaw(born, null)));
    expect(reads(born, OWNER), 'the owner\'s reads are law 1\'s').toBe(reads(withLaw(born, null), OWNER));
    const chain = rulingChainOf(born);
    expect(chain.power?.name, 'the power').toBe('Town Council');
    expect(chain.faction?.name, 'the faction is the form\'s own row').toBe('Town Council');
    expect(chain.npc?.name, 'the person').toBe('Konrad Berger');
  }, 60_000);
});
