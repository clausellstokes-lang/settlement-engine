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
 *   5. THE SELF-CHECK (the chair's E70, item 3): under the seat law `seatHolderFindings` checks the chain's person
 *      against the HOLDER. Red first on the six (a false `seat_outside_governing_faction`); the converse, a person truly
 *      outside the holder's house (the holder's top ladder rung named for the old house's person), still raises it.
 *   8. THE TONIGHT SHEET (the chair's E81, item 2): on the four of the six whose hooks still list the old house's person,
 *      the sheet prints NO office word for that person after the transfer; the office word sits on the holder's first.
 *   9. BOTH SIDES OF U5-STALE BY NAME (the chair's E81, item 1): the hat MOVES (the old holder's dual-hat first loses it,
 *      the winner's first takes it); a CROWN's sovereign KEEPS it; a council's OWN person (no other house's first) KEEPS it.
 *   6. THE RULER CARD'S CAPTION (the chair's E70, item 4, the chair's wording): "Holds the seat of {form}." on the
 *      holder's card, only where the holder stands apart, never for a veiled holder (then today's card).
 *
 * @enforced-by this test
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

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
import { governingFactionOf, transferRulingPower } from '../../../src/domain/rulingPower.js';
import { holderOf } from '../../../src/domain/seat/holderOfSeat.js';
import { rankIn } from '../../../src/domain/people/membership.js';
import { derivePowerStrata, deciderOf, outrankingRivalOf, rulingChainOf } from '../../../src/domain/dossier/powerStrata.js';
import { seatHolderFindings } from '../../../src/domain/coherence/seatHolderFindings.js';
import { ThePowers } from '../../../src/components/new/tabs/power/PowerStrata.jsx';
import { ladderFactionKeyOf } from '../../../src/domain/townMap/ladderRead.js';
import { seatCandidatesOf, seatHouseFaceOf } from '../../../src/domain/dossier/seatHolder.js';
import { seatHouseName } from '../../../src/domain/dossier/powerSupport.js';
import { cardHatsOf } from '../../../src/domain/people/cardPowers.js';
import { composeTonightSheet } from '../../../src/domain/summary/tonightSheet.js';
import { expectPresentThenAbsent } from '../../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

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
  findings: seatHolderFindings(s),
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

describe('1. RED FIRST: the six kept-form transfers, through U5-STALE: every surface names the holder\'s person', () => {
  // THE SIX (the probe's kept-form transfers whose chain named the old house's person), every word a literal. One plain
  // test runs every row through collectSeedFailures (the lighting walker parks a row-parameter `each`; seedLoopTotality).
  // U5-STALE (the chair's E77): the transfer moves the office hat (the form's rank-1 membership and the office word) from
  // the old house's person to the holder's first, so the record's ONE hat-wearer is the holder's, and every surface that
  // reads the hat agrees: the chain, the seat's candidates (the Institutions seat-house face), the cards, the tonight sheet.
  it('the six: each form kept, the seat passed to Merchant Guilds, the hat on the holder\'s first, named by every surface', () => {
    build(true);
    expectNoSeedFailures(collectSeedFailures([
      { settType: 'town', seed: 'u7p-town-8', form: 'Town Mayor', oldHouse: 'Craft Guilds', oldPerson: 'Judith Weber', oldTitle: 'the smelt master', person: 'Felix Naumann', hats: 'the senior guild master and Mayor' },
      { settType: 'metropolis', seed: 'u7p-metropolis-15', form: 'Democratic assembly', oldHouse: 'The Merchant Bloc', oldPerson: 'Dietrich Engel', oldTitle: 'the exchange master', person: 'Josefine Wolf', hats: 'the senior guild master and Speaker of the Assembly' },
      { settType: 'metropolis', seed: 'u7p-metropolis-21', form: 'Grand Council', oldHouse: 'The Trade Compact', oldPerson: 'Dietmar Uhl', oldTitle: 'the exchange master', person: 'Christine Jäger', hats: 'the senior guild master and Lord Mayor' },
      { settType: 'metropolis', seed: 'u7p-metropolis-26', form: 'Grand Council', oldHouse: 'The Commercial Circle', oldPerson: 'Brunhild Steiner', oldTitle: 'the exchange master', person: 'Gertrude Moser', hats: 'the senior guild master and Lord Mayor' },
      { settType: 'metropolis', seed: 'u7p-metropolis-27', form: 'Grand Council', oldHouse: 'The Guild Alliance', oldPerson: 'Conrad Brandt', oldTitle: 'the exchange master', person: 'Katharina Rosenfeld', hats: 'the senior guild master and Lord Mayor' },
      { settType: 'metropolis', seed: 'u7p-metropolis-28', form: 'Grand Council', oldHouse: 'The Trade Compact', oldPerson: 'Josef Frank', oldTitle: 'the exchange master', person: 'Notburga Weber', hats: 'the senior guild master and Lord Mayor' },
    ], ({ settType, seed, form, oldHouse, oldPerson, oldTitle, person, hats }) => {
      const born = bear(settType, seed);
      expect(seatLaw.resolveSeatLawVersion(born), `${seed}: born under the seat law`).toBe(2);
      expect(holderOf(born, OWNER).holderName, `${seed}: the holder before the transfer`).toBe(oldHouse);
      expect(holderOf(born, OWNER).person?.name, `${seed}: the hat-wearer before the transfer`).toBe(oldPerson);
      const after = dmTransfer(born, seed, TAKER);
      // the kept form: the governing row stays, the holder moves
      expect(governingFactionOf(after)?.faction, `${seed}: the form is kept`).toBe(form);
      expect(holderOf(after, OWNER).holderName, `${seed}: the holder after the transfer (owner)`).toBe(TAKER);
      expect(holderOf(after, READER).holderName, `${seed}: the holder after the transfer (reader)`).toBe(TAKER);
      const card = (name) => (after.npcs || []).find((n) => n?.name === name);
      // the record's one hat-wearer is the holder's first
      expect(holderOf(after, OWNER).person?.name, `${seed}: the record's hat-wearer`).toBe(person);
      expect(rankIn(card(person), TAKER), `${seed}: the hat-wearer is the holder's first`).toBe(1);
      expect(rankIn(card(person), form), `${seed}: the hat-wearer holds the form's first place`).toBe(1);
      expect(cardHatsOf(card(person)), `${seed}: the holder's first wears the office`).toBe(hats);
      expect(cardHatsOf(card(oldPerson)), `${seed}: the old house's person wears the house title alone`).toBe(oldTitle);
      // anchored: the born record holds the old person in the form's first place (asserted above), so the after list's lacking them is the transfer's
      expectPresentThenAbsent(seatCandidatesOf(born).map((n) => n.name), seatCandidatesOf(after).map((n) => n.name), oldPerson, `${seed}: the old house's person leaves the seat`);
      // the surfaces
      const chain = rulingChainOf(after);
      expect(chain.npc?.name, `${seed}: the chain names the holder's person`).toBe(person);
      expect(chain.power?.name, `${seed}: the chain's power is the form (the office)`).toBe(form);
      expect(chain.faction?.name, `${seed}: the chain's faction is the holder`).toBe(TAKER);
      expect(rulingChainOf(after, OWNER).npc?.name, `${seed}: the owner's chain`).toBe(person);
      expect(seatHouseFaceOf(after, seatHouseName(after.institutions || []))?.name, `${seed}: the Institutions seat-house face`).toBe(person);
      expect(composeTonightSheet(after).people.find((p) => p.why === 'seat')?.name, `${seed}: the tonight sheet's seat row`).toBe(person);
      expect(derivePowerStrata(after).powers.find((p) => p.role === 'ruler')?.name, `${seed}: the ruler entry is the holder`).toBe(TAKER);
    }), 'the six kept-form transfers');
  }, 300_000);
});

describe('1b. the 24 lit births held by kind (R3) whose person moved under E70 do not move: the page reads the hat-wearer', () => {
  // The chair's E76 measure: every one of the 24 is bucket (i), the hat-wearer in no house but the form. Under E77 the
  // page reads that one fact. ONE differential: the chain's person on the lit record is the law-1 read of the same record.
  it('the 24: the chain names the record\'s hat-wearer, as law 1 reads it; the four that named nobody name their office person', () => {
    build(true);
    expectNoSeedFailures(collectSeedFailures([
      { settType: 'town', seed: 'u7p-town-2', office: 'Beatrix Eisenberg' },
      { settType: 'town', seed: 'u7p-town-25', office: 'Oskar Moser' },
      { settType: 'town', seed: 'u7p-town-26', office: 'Adalbero Schulz' },
      { settType: 'town', seed: 'u7p-town-30', office: 'Richardis Braun' },
      { settType: 'town', seed: 'u7p-town-39', office: 'Ottilia Vogel' },
      { settType: 'city', seed: 'u7p-city-2', office: 'Luise Braun' },
      { settType: 'city', seed: 'u7p-city-4', office: 'Gunter Vogel' },
      { settType: 'city', seed: 'u7p-city-5', office: 'Oskar Forster' },
      { settType: 'city', seed: 'u7p-city-7', office: 'Andreas Gärtner' },
      { settType: 'city', seed: 'u7p-city-8', office: 'Oda Uhl' },
      { settType: 'city', seed: 'u7p-city-9', office: 'Cunigund Schmitt' },
      { settType: 'city', seed: 'u7p-city-10', office: 'Liutbirg Brandt' },
      { settType: 'city', seed: 'u7p-city-11', office: 'Benedikt Fischer' },
      { settType: 'city', seed: 'u7p-city-12', office: 'Cyriak Lange' },
      { settType: 'city', seed: 'u7p-city-18', office: 'Xavier Wenzel' },
      { settType: 'city', seed: 'u7p-city-21', office: 'Diemut Vogt' },
      { settType: 'city', seed: 'u7p-city-25', office: 'Elfriede Forster' },
      { settType: 'city', seed: 'u7p-city-29', office: 'Josef Kern' },
      { settType: 'city', seed: 'u7p-city-32', office: 'Uto Lenz' },
      { settType: 'city', seed: 'u7p-city-33', office: 'Simon Huber' },
      { settType: 'city', seed: 'u7p-city-34', office: 'Fastrada Steinberg' },
      { settType: 'city', seed: 'u7p-city-35', office: 'Diemut Krause' },
      { settType: 'city', seed: 'u7p-city-38', office: 'Walburga Jäger' },
      { settType: 'city', seed: 'u7p-city-39', office: 'Judith Keller' },
    ], ({ settType, seed, office }) => {
      const born = bear(settType, seed);
      expect(seatLaw.resolveSeatLawVersion(born), `${seed}: born lit`).toBe(2);
      expect(holderOf(born, READER).rule, `${seed}: the holder by kind`).toBe('R3');
      const chain = rulingChainOf(born);
      expect(chain.faction?.name, `${seed}: the chain's faction is the holder`).toBe(TAKER);
      expect(chain.npc?.name, `${seed}: the chain names the hat-wearer`).toBe(office);
      expect(JSON.stringify(chain.npc), `${seed}: the person is the law-1 read`).toBe(JSON.stringify(rulingChainOf(withLaw(born, null)).npc));
    }), 'the 24 R3 births');
  }, 300_000);
});

describe('2. a veiled holder: the reads to a reader are today\'s', () => {
  it('u7p-town-8, the Merchant Guilds hidden, then criminal: the reader reads today\'s chain (the record\'s hat-wearer, Felix Naumann, under the form)', () => {
    build(true);
    const after = dmTransfer(bear('town', 'u7p-town-8'), 'u7p-town-8', TAKER);
    expectNoSeedFailures(collectSeedFailures([
      { kind: 'hidden', mark: { hidden: true } },
      { kind: 'criminal', mark: { category: 'criminal' } },
    ], ({ kind, mark }) => {
      const town = veiled(after, TAKER, mark);
      expect(holderOf(town, OWNER).holderName, `${kind}: the owner still reads the holder`).toBe(TAKER);
      expect(holderOf(town, READER).holderName, `${kind}: the reader is refused the holder`).toBeNull();
      expect(reads(town), `${kind}: the reader's four reads are today's`).toBe(today(() => reads(town)));
      expect(reads(town, READER), `${kind}: the reader's, named`).toBe(today(() => reads(town, READER)));
      expect(rulingChainOf(town).npc?.name, `${kind}: the reader's chain names the record's hat-wearer`).toBe('Felix Naumann');
      expect(rulingChainOf(town).faction?.name, `${kind}: the reader's faction`).toBe('Town Mayor');
      // anchored: the owner's chain names the holder (the before list), so the reader's lacking it is the veil's work
      expectPresentThenAbsent([rulingChainOf(town, OWNER).faction?.name], [rulingChainOf(town).faction?.name], TAKER, `${kind}: the reader is never told the veiled holder`);
      expect(rulingChainOf(town, OWNER).npc?.name, `${kind}: the owner's chain names the holder's person`).toBe('Felix Naumann');
    }), 'the veiled holder, both veils');
  }, 60_000);
});

describe('3. law 1: byte-identical, the holder unread', () => {
  it('the six born dark, after the same transfer: the reads with the holder read equal the reads without it', () => {
    build(false);
    expectNoSeedFailures(collectSeedFailures([
      { settType: 'town', seed: 'u7p-town-8' },
      { settType: 'metropolis', seed: 'u7p-metropolis-15' },
      { settType: 'metropolis', seed: 'u7p-metropolis-21' },
      { settType: 'metropolis', seed: 'u7p-metropolis-26' },
      { settType: 'metropolis', seed: 'u7p-metropolis-27' },
      { settType: 'metropolis', seed: 'u7p-metropolis-28' },
    ], ({ settType, seed }) => {
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
    }), 'law 1 on the six');
  }, 300_000);
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

describe('5. the self-check: no false finding on the six, and a person truly outside the seat\'s house still raises it', () => {
  it('the six after the transfer: no finding; u7p-town-1 (R4), the seat\'s top rung named for a person outside it: seat_outside_governing_faction', () => {
    build(true);
    expectNoSeedFailures(collectSeedFailures([
      { settType: 'town', seed: 'u7p-town-8', person: 'Felix Naumann' },
      { settType: 'metropolis', seed: 'u7p-metropolis-15', person: 'Josefine Wolf' },
      { settType: 'metropolis', seed: 'u7p-metropolis-21', person: 'Christine Jäger' },
      { settType: 'metropolis', seed: 'u7p-metropolis-26', person: 'Gertrude Moser' },
      { settType: 'metropolis', seed: 'u7p-metropolis-27', person: 'Katharina Rosenfeld' },
      { settType: 'metropolis', seed: 'u7p-metropolis-28', person: 'Notburga Weber' },
    ], ({ settType, seed, person }) => {
      const after = dmTransfer(bear(settType, seed), seed, TAKER);
      expect(rulingChainOf(after).npc?.name, `${seed}: the chain's person`).toBe(person);
      expect(seatHolderFindings(after).map((f) => f.code), `${seed}: the hat-wearer raises no finding`).toEqual([]);
    }), 'the six, the self-check');
    // the converse: a lit place whose office holds itself (no holder apart), its top ladder rung named for a person of
    // another house only, who is not of the seat's house
    const town = bear('town', 'u7p-town-1');
    expect(holderOf(town, OWNER).holder, 'the office holds itself').toBeNull();
    expect(housesOf(town, 'Martin Schäfer'), 'the rung\'s person is of the Merchant Guilds alone').toEqual([TAKER]);
    const laddered = { ...town, npcLadder: { factions: { [ladderFactionKeyOf(governingFactionOf(town))]: { rungs: [{ npcId: 'u7.rung', name: 'Martin Schäfer', standing: 1 }] } } } };
    expect(rulingChainOf(laddered).npc?.name, 'the converse chain names the rung').toBe('Martin Schäfer');
    expect(seatHolderFindings(laddered).filter((f) => f.code === 'seat_outside_governing_faction'), 'a person outside the seat\'s house still raises it')
      .toEqual([{ code: 'seat_outside_governing_faction', detail: 'Martin Schäfer is not of Town Council' }]);
  }, 300_000);
});

describe('7. U5-STALE\'s controls: a law-1 place is untouched; a holder with no person leaves the hat unworn', () => {
  it('u7p-town-8 born dark: the same transfer leaves every card as it was', () => {
    build(false);
    const born = bear('town', 'u7p-town-8');
    expect(seatLaw.resolveSeatLawVersion(born), 'born dark').toBe(1);
    const after = dmTransfer(born, 'u7p-town-8', TAKER);
    expect(JSON.stringify(after.npcs), 'law 1: the cards are byte-identical').toBe(JSON.stringify(born.npcs));
  }, 60_000);
  it('u7p-town-8 born lit, the Merchant Guilds with no first: the old house\'s person loses the hat, nobody wears it, the seat reads unfilled', () => {
    build(true);
    const born = bear('town', 'u7p-town-8');
    const headless = { ...born, npcs: (born.npcs || []).map((n) => (rankIn(n, TAKER) === 1
      ? { ...n, memberships: n.memberships.map((m) => (m.power === TAKER ? { ...m, rank: 2 } : m)) } : n)) };
    const after = dmTransfer(headless, 'u7p-town-8', TAKER);
    expect(holderOf(after, OWNER).holderName, 'the holder').toBe(TAKER);
    expect(cardHatsOf((after.npcs || []).find((n) => n?.name === 'Judith Weber')), 'the old house\'s person wears the house title alone').toBe('the smelt master');
    expect(seatCandidatesOf(after).map((n) => n.name), 'nobody wears the hat').toEqual([]);
    const chain = rulingChainOf(after);
    expect(chain.npc, 'the chain names nobody').toBeNull();
    expect(chain.absence?.line, 'the seat reads unfilled').toBe('No named seat-holder stands in the record. The chain ends, honestly, at the power.');
  }, 60_000);
});

/** The Power tab's seat cards as printed (`PowerStrata.jsx :: ThePowers` over `derivePowerStrata`), as text. */
const cardsOf = (s) => renderToStaticMarkup(React.createElement(ThePowers, { settlement: s, powers: derivePowerStrata(s).powers, factionSupport: new Map() }))
  .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

describe('6. the holder\'s ruler card says whose seat it holds, never for a veiled holder', () => {
  it('u7p-town-8 after the transfer: "Holds the seat of the Town Mayor."; veiled, or under law 1, today\'s card', () => {
    build(true);
    const after = dmTransfer(bear('town', 'u7p-town-8'), 'u7p-town-8', TAKER);
    const lit = cardsOf(after);
    expect(lit, 'the holder\'s card').toContain('Ruler Merchant Guilds');
    expect(lit, 'the caption, the chair\'s wording').toContain('Holds the seat of the Town Mayor.');
    const hidden = veiled(after, TAKER, { hidden: true });
    expect(cardsOf(hidden), 'a veiled holder: today\'s card').toBe(today(() => cardsOf(hidden)));
    expect(cardsOf(hidden), 'a veiled holder: the form is the ruler').toContain('Ruler Town Mayor');
    // anchored: the lit card carries the caption (asserted above), so the veiled card's lacking it is the veil's work
    expectPresentThenAbsent(lit, cardsOf(hidden), 'Holds the seat of', 'the veiled holder\'s card names no seat');
    const dark = withLaw(after, null);
    expect(cardsOf(dark), 'law 1: today\'s card').toBe(today(() => cardsOf(dark)));
    // anchored: the same record under the seat law carries the caption (asserted above)
    expectPresentThenAbsent(lit, cardsOf(dark), 'Holds the seat of', 'law 1 names no seat');
  }, 60_000);
});

/** Every string of a composed sheet, with its path. */
const stringsOf = (v, path = 'sheet', out = []) => {
  if (typeof v === 'string') out.push({ path, text: v });
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) stringsOf(x, `${path}.${k}`, out);
  return out;
};

describe('8. the tonight sheet names the old house\'s person by no office word after the transfer', () => {
  it('the four whose hooks list the old person: the office word sits on the holder\'s first alone', () => {
    build(true);
    expectNoSeedFailures(collectSeedFailures([
      { seed: 'u7p-metropolis-15', oldPerson: 'Dietrich Engel', person: 'Josefine Wolf', word: 'Speaker of the Assembly' },
      { seed: 'u7p-metropolis-21', oldPerson: 'Dietmar Uhl', person: 'Christine Jäger', word: 'Lord Mayor' },
      { seed: 'u7p-metropolis-26', oldPerson: 'Brunhild Steiner', person: 'Gertrude Moser', word: 'Lord Mayor' },
      { seed: 'u7p-metropolis-28', oldPerson: 'Josef Frank', person: 'Notburga Weber', word: 'Lord Mayor' },
    ], ({ seed, oldPerson, person, word }) => {
      const born = bear('metropolis', seed);
      const was = composeTonightSheet(born);
      expect(was.people.find((p) => p.why === 'seat'), `${seed}: before, the seat row is the old house's person in the office`)
        .toMatchObject({ name: oldPerson, role: word });
      const sheet = composeTonightSheet(dmTransfer(born, seed, TAKER));
      // the old person is still on the sheet, as a hook's source (the anchor: the read below is live)
      expect(sheet.hooks.map((h) => h.source), `${seed}: the old house's person is a hook's source`).toContain(oldPerson);
      expect(sheet.people.find((p) => p.why === 'seat'), `${seed}: the seat row is the holder's first in the office`)
        .toMatchObject({ name: person, role: word });
      // every string of the sheet that carries the office word is the holder's seat row's role, and nothing else
      expect(stringsOf(sheet).filter((x) => x.text.includes(word)).map((x) => x.path), `${seed}: where the office word prints`)
        .toEqual([`sheet.people.${sheet.people.findIndex((p) => p.why === 'seat')}.role`]);
      // the old person's hook as printed: the source's name and the hook's text, no office word
      const hook = sheet.hooks.find((h) => h.source === oldPerson);
      expect(Object.keys(hook), `${seed}: a hook prints its text and its source`).toEqual(['text', 'source']);
      // anchored: the born sheet printed the office word beside the old person (asserted above), so its lacking it now is the transfer's
      expectPresentThenAbsent(`${was.people.find((p) => p.why === 'seat').name} ${was.people.find((p) => p.why === 'seat').role}`, `${hook.source} ${hook.text}`, word, `${seed}: the old person's line carries no office word`);
    }), 'the four, the tonight sheet');
  }, 300_000);
});

/** A crowned city (Royal Authority) under the seat law, its sovereign and a guild's first: the kept crown's fixture. */
const crownCity = () => ({
  name: 'Harrowgate', tier: 'city', config: { _seatLawVersion: 2 },
  economicState: { prosperity: 'Wealthy', incomeSources: [{ source: 'Market Taxes', percentage: 45 }, { source: 'Guild Fees', percentage: 20 }] },
  powerStructure: {
    government: 'Royal Authority', governingName: 'Royal Authority',
    factions: [
      { faction: 'Royal Authority', category: 'noble', power: 30, isGoverning: true, modifiers: [] },
      { faction: 'Merchant Guilds', category: 'economy', power: 28, modifiers: [] },
      { faction: 'Noble Houses', category: 'noble', power: 22, modifiers: [] },
    ],
    factionRelationships: [], publicLegitimacy: { score: 40, label: 'Contested', govMultiplier: 0.8 }, stability: 'Holding', recentConflict: 'None of note.',
  },
  npcs: [
    { id: 'npc_king', name: 'Aldric Vane', role: 'King', title: 'the sovereign', memberships: [{ power: 'Royal Authority', rank: 1, share: 0, veiled: false }, { power: 'Noble Houses', rank: 3, share: 0, veiled: false }] },
    { id: 'npc_gm', name: 'Corin Marsh', role: 'the guildmaster', title: 'the guildmaster', memberships: [{ power: 'Merchant Guilds', rank: 1, share: 1, veiled: false }] },
  ],
});

describe('9. U5-STALE, both sides by name: the hat moves off the old house\'s person, and stays on the office\'s own', () => {
  it('MOVES: u7p-town-8, Judith Weber (the Craft Guilds\' first) loses the Mayor\'s hat, Felix Naumann (the Merchant Guilds\' first) takes it', () => {
    build(true);
    const born = bear('town', 'u7p-town-8');
    const after = dmTransfer(born, 'u7p-town-8', TAKER);
    const card = (s, name) => (s.npcs || []).find((n) => n?.name === name);
    expect(rankIn(card(born, 'Judith Weber'), 'Craft Guilds'), 'the old holder\'s first').toBe(1);
    expect(rankIn(card(born, 'Judith Weber'), 'Town Mayor'), 'before: she wears the hat').toBe(1);
    expect(rankIn(card(after, 'Judith Weber'), 'Town Mayor'), 'after: she does not').toBeUndefined();
    expect(cardHatsOf(card(after, 'Judith Weber')), 'after: her own title alone').toBe('the smelt master');
    expect(rankIn(card(after, 'Felix Naumann'), 'Town Mayor'), 'after: the winner\'s first wears it').toBe(1);
    expect(cardHatsOf(card(after, 'Felix Naumann')), 'after: both his hats').toBe('the senior guild master and Mayor');
  }, 60_000);
  it('KEEPS, THE CROWN: Royal Authority kept by the Merchant Guilds; Aldric Vane, the sovereign (no other house\'s first), keeps it; Corin Marsh does not take it', () => {
    const r = transferRulingPower(crownCity(), 'Merchant Guilds', { cause: 'coup', seatCircumstances: ['trade_wealth'] });
    expect(r.error, 'the transfer applied').toBeNull();
    const after = r.settlement;
    expect(after.powerStructure.government, 'the crown is kept').toBe('Royal Authority');
    expect(holderOf(after, OWNER).holderName, 'the holder').toBe(TAKER);
    const card = (name) => (after.npcs || []).find((n) => n?.name === name);
    expect(rankIn(card('Aldric Vane'), 'Royal Authority'), 'the sovereign keeps the crown').toBe(1);
    expect(card('Aldric Vane')?.role, 'his office word').toBe('King');
    expect(rankIn(card('Corin Marsh'), 'Royal Authority'), 'the taker\'s keeper takes no crown').toBeUndefined();
    expect(holderOf(after, OWNER).person?.name, 'the crown\'s person').toBe('Aldric Vane');
  });
  it('KEEPS, THE COUNCIL\'S OWN PERSON: u7p-town-1, Konrad Berger (the Town Council\'s own Mayor, no other house\'s first) keeps the hat', () => {
    build(true);
    const born = bear('town', 'u7p-town-1');
    const card = (s, name) => (s.npcs || []).find((n) => n?.name === name);
    expect(holderOf(born, OWNER).rule, 'before: the office holds itself').toBe('R4');
    expect(rankIn(card(born, 'Konrad Berger'), 'Town Council'), 'before: he wears the hat').toBe(1);
    expect(rankIn(card(born, 'Konrad Berger'), TAKER), 'a Merchant Guilds member, not its first').toBeNull();
    const after = dmTransfer(born, 'u7p-town-1', TAKER);
    expect(governingFactionOf(after)?.faction, 'the form is kept').toBe('Town Council');
    expect(holderOf(after, OWNER).holderName, 'the holder').toBe(TAKER);
    expect(rankIn(card(after, 'Konrad Berger'), 'Town Council'), 'after: he still wears it').toBe(1);
    expect(cardHatsOf(card(after, 'Konrad Berger')), 'after: both his hats').toBe(cardHatsOf(card(born, 'Konrad Berger')));
    expect(rulingChainOf(after).npc?.name, 'the chain names him').toBe('Konrad Berger');
  }, 60_000);
});
