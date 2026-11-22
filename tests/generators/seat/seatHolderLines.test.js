/**
 * seatHolderLines.test.js — A HOLDER IS NOT "UNDER" THE OFFICE IT HOLDS (SEAT-10's U6, CS12; brief
 * `docs/chair/2026-11-20/content/seat/briefs/U6-PROSE.md`, the chair's rulings of 2026-11-22 07:21Z and 07:37Z).
 *
 * THE ARMS, in the brief's order:
 *   (1) FAULT (c), red first on its witness: the power step's standing (`rulingStructure.js` -> `annotateFactionStanding`)
 *       reads the coup off the BORN config, so its `contestedBy` is the law's field, not law 1's. FAULT (b) has no witness
 *       in 600 lit births (526 office raises, 0 with a band the law's fold moves: the office roles are Elder, Mayor and
 *       Governor, which fold to themselves), so by the brief it is reported, not cured, and has no arm here.
 *   (2) A lit birth whose holder stands apart prints a W1 line on the form<->holder row and a W3 line on the holder row, and
 *       no "work under the rules" / no rank-1 line ("in the shadow of", "The gap between them", "Behind") there; the holder's
 *       "and expect council access in return." does not print, its claim closed at its own sentence's end.
 *   (3) A veiled holder keeps today's lines. (4) The licensed pair takes W2.
 *   (5) Under law 1 the record is byte-identical to the pre-U6 tree, as a differential in one tree: law 1 against law 1
 *       with the new code paths forced off (`sw.off`: the born config stripped from the three calls that carry it, and the
 *       gate read as null). No stored digest.
 *
 * THE LIT BUILD is planted as `tests/domain/seat/seatLawSavedTown.test.js` plants it: the seat's dial and its mint
 * (`seatLaw.js`) and the contest's dial (`seatCircumstances.js :: SEAT_CONTEST_LIT`), each read live off one switch.
 *
 * @enforced-by this test
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

/** The switches, read live by the mocks: the build (`lit`), the new paths forced off (`off`), a holder planted (`holder`). */
const sw = vi.hoisted(() => ({ lit: false, off: false, holder: /** @type {null | ((s: any) => any)} */ (null), standingCalls: /** @type {any[]} */ ([]) }));

vi.mock('../../../src/domain/seat/seatLaw.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return {
    ...actual,
    get NEW_SETTLEMENT_SEAT_LAW_VERSION() { return sw.lit ? actual.HOLDER_SEAT_LAW_VERSION : actual.DEFAULT_SEAT_LAW_VERSION; },
    newSettlementSeatLaw: () => (sw.lit ? { [actual.SEAT_LAW_CONFIG_KEY]: actual.HOLDER_SEAT_LAW_VERSION } : {}),
  };
});
vi.mock('../../../src/domain/seat/seatCircumstances.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return { ...actual, get SEAT_CONTEST_LIT() { return sw.lit; } };
});
// A planted holding (arms 3 and 4), else the real read.
vi.mock('../../../src/domain/seat/holderOfSeat.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return { ...actual, holderOf: (/** @type {any} */ s, /** @type {any} */ o) => (sw.holder ? sw.holder(s) : actual.holderOf(s, o)) };
});
// THE NEW PATHS FORCED OFF (arm 5): the gate reads null, and the born config leaves the two calls that carry it.
vi.mock('../../../src/generators/factionDynamics.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return {
    ...actual,
    seatHolderApartOf: (/** @type {any[]} */ ...a) => (sw.off ? null : actual.seatHolderApartOf(...a)),
    computeFactionRelationships: (/** @type {any[]} */ ...a) => actual.computeFactionRelationships(...(sw.off ? a.slice(0, 7) : a)),
  };
});
// The standing's seat, recorded at the POWER STEP's call (arm 1), and its born config stripped when the paths are off.
vi.mock('../../../src/generators/power/factionStanding.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return {
    ...actual,
    annotateFactionStanding: (/** @type {any[]} */ factions, /** @type {any} */ force, /** @type {any} */ seat = null) => {
      const { config: _born, ...rest } = seat || {};
      const handed = seat && sw.off ? rest : seat;
      if (String(new Error().stack).includes('rulingStructure.js')) {
        sw.standingCalls.push({ seat: handed, roster: factions.map((/** @type {any} */ f) => ({ ...f })) });
      }
      return actual.annotateFactionStanding(factions, force, handed);
    },
  };
});

import * as seatLaw from '../../../src/domain/seat/seatLaw.js';
import * as circ from '../../../src/domain/seat/seatCircumstances.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { computeFactionRelationships } from '../../../src/generators/factionDynamics.js';
import { coupContenders, coupRiskLabel } from '../../../src/domain/rulingPowerCoup.js';
import { SEAT_HOLDER_LINES } from '../../../src/data/seatHolderLines.js';
import { expectPresentThenAbsent } from '../../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

await loadGenerationLawPayloads();

/** @param {boolean} lit */
function build(lit) {
  sw.lit = lit;
  expect(seatLaw.NEW_SETTLEMENT_SEAT_LAW_VERSION, `the ${lit ? 'LIT' : 'DARK'} build's seat dial`)
    .toBe(lit ? seatLaw.HOLDER_SEAT_LAW_VERSION : seatLaw.DEFAULT_SEAT_LAW_VERSION);
  expect(circ.SEAT_CONTEST_LIT, 'the contest dial').toBe(lit);
}

/** A germanic birth at a size, on the build the arm stands on. @param {string} settType @param {string} seed */
const born = (settType, seed) => generateSettlementPipeline(birthConfig({ settType, culture: 'germanic' }), null, { seed, customContent: {} });

/** The contest's first challenger, read as the standing reads it. @param {any[]} roster @param {any} seat */
function contestedByOf(roster, seat) {
  const reading = coupContenders(/** @type {any} */ ({ powerStructure: { factions: roster, publicLegitimacy: seat?.publicLegitimacy }, ...(seat?.config ? { config: seat.config } : {}) }));
  return coupRiskLabel(reading) === 'Contested' ? (reading.challengers[0]?.name ?? null) : null;
}

afterEach(() => { sw.lit = false; sw.off = false; sw.holder = null; sw.standingCalls = []; });

describe('U6 (1): FAULT (c), the power step reads the coup under the born law', () => {
  it('the lit witness u6f-town-18: law 1 names Landed Gentry, the law names no one, and the step reads the law', () => {
    build(true);
    born('town', 'u6f-town-18');
    expect(sw.standingCalls.length, 'the power step annotated the roster').toBeGreaterThan(0);
    const law2 = { _seatLawVersion: 2 };
    const witness = sw.standingCalls.find((c) => contestedByOf(c.roster, { publicLegitimacy: c.seat?.publicLegitimacy }) === 'Landed Gentry');
    expect(witness, 'a power-step call where law 1 reads Landed Gentry contesting').toBeTruthy();
    expect(contestedByOf(witness.roster, { publicLegitimacy: witness.seat?.publicLegitimacy, config: law2 }), 'the law reads no contest there').toBe(null);
    for (const c of sw.standingCalls) {
      expect(seatLaw.seatsByHolder(c.seat?.config), 'the power step hands annotateFactionStanding the born config').toBe(true);
      expect(contestedByOf(c.roster, c.seat), 'the standing reads the law\'s contestedBy').toBe(contestedByOf(c.roster, { ...c.seat, config: law2 }));
    }
  });
});

describe('U6 (2): a lit holder apart is the office, never under it', () => {
  it('u6t-city-4 (a city): the Merchant Guilds hold the Merchant oligarchy', () => {
    build(true);
    sw.off = true;
    const before = born('city', 'u6t-city-4');
    sw.off = false;
    const after = born('city', 'u6t-city-4');
    const row = (/** @type {any} */ s) => s.powerStructure.factionRelationships.find((/** @type {any} */ r) => r.pair.includes('Merchant oligarchy') && r.pair.includes('Merchant Guilds'));
    const holder = (/** @type {any} */ s) => s.powerStructure.factions.find((/** @type {any} */ f) => f.faction === 'Merchant Guilds');
    expect(after.powerStructure.factions.find((/** @type {any} */ f) => f.isGoverning).faction, 'the form').toBe('Merchant oligarchy');
    expect(row(after).narrative, 'W1 on the form<->holder row').toBe('The Merchant oligarchy is how this place is ruled, and the Merchant Guilds rule through it.');
    // anchored: the pre-U6 row said the holder works under the form's rules
    expectPresentThenAbsent(row(before).narrative, row(after).narrative, 'work under the rules', 'the form<->holder row');
    expect(holder(after).desc, 'W3 on the holder row').toContain('They govern through the Merchant oligarchy, and what it orders is their order.');
    // anchored: the pre-U6 holder row stood in the form's shadow
    expectPresentThenAbsent(holder(before).desc, holder(after).desc, 'They operate in the shadow of', 'the holder row');
  });

  it('u6t-town-22 (a town): the holder takes no "expect council access", its claim closed at its own sentence', () => {
    build(true);
    sw.off = true;
    const before = born('town', 'u6t-town-22');
    sw.off = false;
    const after = born('town', 'u6t-town-22');
    const holder = (/** @type {any} */ s) => s.powerStructure.factions.find((/** @type {any} */ f) => f.faction === 'Merchant Guilds');
    expect(holder(after).desc.startsWith('Established merchant community; fund civic works. '), 'the claim keeps its first clause, closed').toBe(true);
    expect(holder(after).desc, 'W3 on the holder row').toContain("They hold the Guild Council's seat, and answer for what it does.");
    // anchored: the pre-U6 holder row asked for access to the seat it holds
    expectPresentThenAbsent(holder(before).desc, holder(after).desc, 'and expect council access in return.', 'the holder row\'s claim');
  });
});

/** A planted roster (arms 3 and 4): a form and a merchant power, the merchant planted as its holder. */
const ROSTER = () => [
  { faction: 'Royal Authority', isGoverning: true, power: 40, category: 'government' },
  { faction: 'Merchant Guilds', power: 30, category: 'economy' },
];
const LIT = { _seatLawVersion: 2 };
/** @param {any[]} roster @param {unknown} [config] */
const relationsOf = (roster, config) => computeFactionRelationships(roster, 'city', {}, { score: 50 }, [], null, null, config).map((/** @type {any} */ r) => r.narrative);
/** @param {any} row */
const plant = (row) => { sw.holder = (/** @type {any} */ s) => ({ rule: 'R2', holder: s.powerStructure.factions.find((/** @type {any} */ f) => f.faction === row), kind: 'merchant', holderName: row }); };

describe('U6 (3): a veiled holder keeps today\'s lines', () => {
  it('a hidden holder: the row is today\'s, as under law 1', () => {
    plant('Merchant Guilds');
    const open = relationsOf(ROSTER(), LIT);
    const veiled = ROSTER(); veiled[1].hidden = true;
    const kept = relationsOf(veiled, LIT);
    // anchored: the open holder takes W1; the hidden one does not
    expectPresentThenAbsent(open, kept, 'The Royal Authority is the office here, and the Merchant Guilds hold it. They came to it by trade, and the money that runs this place passes through their hands.', 'a hidden holder');
    expect(kept, 'the hidden holder\'s rows are law 1\'s').toEqual(relationsOf(veiled));
  });
});

describe('U6 (4): the licensed pair takes W2', () => {
  it('a merchant holding a Royal Authority (pairLicense: licensed): W1, then W2', () => {
    plant('Merchant Guilds');
    expect(relationsOf(ROSTER(), LIT), 'W1 and W2 on the licensed pair').toContain(
      'The Royal Authority is the office here, and the Merchant Guilds hold it. They came to it by trade, and the money that runs this place passes through their hands.');
    expect(SEAT_HOLDER_LINES.licensed[0], 'W2 is the chair\'s line').toBe('They came to it by trade, and the money that runs this place passes through their hands.');
  });
});

describe('U6 (5): under law 1 not one byte moves', () => {
  it('four births (a town, a village, a city, and the lit witness seed born dark), law 1, against law 1 with the new paths off', () => {
    // every row run and collected, never an `each` (sovereigntyLightingContract's park debt only shrinks)
    expectNoSeedFailures(collectSeedFailures([['town', 'u6d-town-0'], ['village', 'u6d-village-0'], ['city', 'u6d-city-0'], ['city', 'u6t-city-4']], ([settType, seed]) => {
      build(false);
      sw.off = false;
      const on = born(settType, seed);
      expect(seatLaw.seatsByHolder(on), `${seed}: the birth is law 1`).toBe(false);
      sw.off = true;
      const off = born(settType, seed);
      expect(JSON.stringify(on), `${seed}: the law-1 record is byte-identical with the new paths off`).toBe(JSON.stringify(off));
    }), 'the law-1 differential');
  });
});
