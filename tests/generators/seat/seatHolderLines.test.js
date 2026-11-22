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
const sw = vi.hoisted(() => ({ lit: false, off: false, passOff: false, holder: /** @type {null | ((s: any) => any)} */ (null), standingCalls: /** @type {any[]} */ ([]), passCalls: /** @type {any[]} */ ([]), bandCalls: /** @type {any[]} */ ([]) }));

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
    // THE FINAL-RECORD PASS (E65): off with the new paths (arm 5) or alone (`passOff`, arm 6); each call records what it saw
    settleSeatHolderToRecord: (/** @type {any} */ record) => {
      if (sw.off || sw.passOff) return undefined;
      sw.passCalls.push({ npcs: Array.isArray(record?.npcs) ? record.npcs.length : 0, conflicted: JSON.stringify(record?.powerStructure?.factionRelationships || []).includes(' Even so, ') });
      return actual.settleSeatHolderToRecord(record);
    },
  };
});
// FAULT (b)'s guard (E65 (3)): every office band `people/castPowers.js :: raiseToOfficeBand` asks for, read again under the law's fold.
vi.mock('../../../src/generators/npcGenerator.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return {
    ...actual,
    powerBandOfRole: (/** @type {any} */ role, /** @type {any} */ config) => {
      const band = actual.powerBandOfRole(role, config);
      if (String(new Error().stack).includes('castPowers.js')) sw.bandCalls.push({ role, band, lawBand: actual.powerBandOfRole(role, { _seatLawVersion: 2 }) });
      return band;
    },
  };
});

import * as seatLaw from '../../../src/domain/seat/seatLaw.js';
import * as circ from '../../../src/domain/seat/seatCircumstances.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { computeFactionRelationships } from '../../../src/generators/factionDynamics.js';
import { settleSeatHolderToRecord } from '../../../src/generators/power/factionStanding.js';
import { holderOf } from '../../../src/domain/seat/holderOfSeat.js';
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

afterEach(() => { sw.lit = false; sw.off = false; sw.passOff = false; sw.holder = null; sw.standingCalls = []; sw.passCalls = []; sw.bandCalls = []; });

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
    expect(row(after).narrative, 'W1 on the form<->holder row').toBe('Whoever comes before the Merchant oligarchy comes before the Merchant Guilds.');
    // anchored: the pre-U6 row said the holder works under the form's rules
    expectPresentThenAbsent(row(before).narrative, row(after).narrative, 'work under the rules', 'the form<->holder row');
    expect(holder(after).desc, 'W3 on the holder row').toContain('They are the ones who sit in the Merchant oligarchy, and its word is theirs.');
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
    expect(holder(after).desc, 'W3 on the holder row').toContain('They hold the Guild Council, and nothing it decides is decided without them.');
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

/** The leaf paths at which two records differ. @param {any} a @param {any} b @param {string} [at] @returns {string[]} */
function diffPaths(a, b, at = '') {
  if (a === b) return [];
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return [at];
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  return keys.flatMap((k) => diffPaths(a[k], b[k], at ? `${at}.${k}` : k));
}

describe('U6 (6): THE FINAL-RECORD PASS (E65): the holder known only on the final record (R2)', () => {
  it('u6p-village-3 (a village): the Merchant Guilds hold the Elder Council by R2; W1 and W3 land, and the pass runs after the cast and before the conflicts read the row', () => {
    build(true);
    sw.off = true;
    const before = born('village', 'u6p-village-3');
    sw.off = false;
    const after = born('village', 'u6p-village-3');
    expect(holderOf(/** @type {any} */ (after), { audience: 'owner' }).rule, 'the holder is the person\'s first power (R2)').toBe('R2');
    const row = (/** @type {any} */ s) => s.powerStructure.factionRelationships.find((/** @type {any} */ r) => r.pair.includes('Elder Council') && r.pair.includes('Merchant Guilds'));
    const holder = (/** @type {any} */ s) => s.powerStructure.factions.find((/** @type {any} */ f) => f.faction === 'Merchant Guilds');
    expect(row(after).narrative, 'W1, then the conflicts\' clause on the rewritten row')
      .toBe("The Elder Council's seats are filled by the Merchant Guilds. Even so, the two are now at odds over blame for a costly failure last season.");
    // anchored: the pre-U6 row had the seat need the holder's taxes and loans
    expectPresentThenAbsent(row(before).narrative, row(after).narrative, 'needs the taxes and loans', 'the R2 form<->holder row');
    expect(holder(after).desc, 'W3 on the R2 holder').toBe('Established merchant community; fund civic works. They sit in the Elder Council themselves, and its rulings are their own.');
    // THE ORDERING PROOF (E65 (e)): the pass ran once, on a record whose people were cast, before `withConflictRelations` wrote its clause
    expect(sw.passCalls.length, 'the pass ran once on the lit birth').toBe(1);
    expect(sw.passCalls[0].npcs, 'the people were cast when the pass ran').toBeGreaterThan(0);
    expect(sw.passCalls[0].conflicted, 'no conflict clause was on the rows when the pass ran').toBe(false);
    expect(row(after).narrative.includes(' Even so, '), 'the conflicts read the rewritten row after it').toBe(true);
  });

  it('u6p-village-18 (a village): a RANK-2 holder (the Military Party) takes W3 in place of "always at the table"', () => {
    build(true);
    sw.off = true;
    const before = born('village', 'u6p-village-18');
    sw.off = false;
    const after = born('village', 'u6p-village-18');
    const holder = (/** @type {any} */ s) => s.powerStructure.factions.find((/** @type {any} */ f) => f.faction === 'Military Party');
    expect(after.powerStructure.factions.indexOf(holder(after)), 'the holder stands at rank 2').toBe(2);
    expect(holder(after).desc, 'W3 at rank 2').toContain("They are the ones who sit in the Headman's Authority, and its word is theirs.");
    // anchored: the pre-U6 rank-2 holder was "always at the table"
    expectPresentThenAbsent(holder(before).desc, holder(after).desc, 'They are always at the table, but cannot set their own terms.', 'the rank-2 holder');
  });

  it('"always at the table" stays on a rank-2 power that does NOT hold; one row a seat', () => {
    plant('Merchant Guilds');
    const record = { config: LIT, _seed: 'u6-plant', powerStructure: { factionRelationships: [], factions: [
      { faction: 'Royal Authority', isGoverning: true, power: 40, category: 'government', desc: 'The crown.' },
      { faction: 'Merchant Guilds', power: 30, category: 'economy', desc: 'Traders. They operate in the shadow of the Royal Authority, close enough to matter and too far behind to lead.' },
      { faction: 'Craft Guilds', power: 20, category: 'economy', desc: 'Makers. They are always at the table, but cannot set their own terms.' },
    ] } };
    settleSeatHolderToRecord(record);
    const [, merc, craft] = record.powerStructure.factions;
    expect(craft.desc, 'the rank-2 power that does not hold keeps its line').toBe('Makers. They are always at the table, but cannot set their own terms.');
    expect(merc.desc.startsWith('Traders. They '), 'the holder\'s W3 stands where its rank line stood').toBe(true);
    expect(record.powerStructure.factions.filter((f) => /They (?:hold|sit in|govern through|are the ones who sit in) the Royal Authority/.test(f.desc)).length, 'one row a seat').toBe(1);
    // anchored: the holder's rank line is gone
    expectPresentThenAbsent('Traders. They operate in the shadow of the Royal Authority, close enough to matter and too far behind to lead.', merc.desc, 'They operate in the shadow of', 'the planted holder');
  });

  it('it draws nothing from the stream (E65 (a)): a lit birth with the pass off differs only in the rows it rewrites', () => {
    build(true);
    sw.passOff = true;
    const off = born('village', 'u6p-village-3');
    sw.passOff = false;
    const on = born('village', 'u6p-village-3');
    const moved = diffPaths(JSON.parse(JSON.stringify(off)), JSON.parse(JSON.stringify(on)));
    expect(moved.length, 'the pass moved the record').toBeGreaterThan(0);
    expect(moved.filter((p) => !/^powerStructure\.(factionRelationships\.\d+\.narrative|factions\.\d+\.desc)$/.test(p)), 'nothing else moved').toEqual([]);
  });
});

describe('U6 (7): FAULT (b) GUARD (E65 (3)): the law\'s fold leaves raiseToOfficeBand unchanged', () => {
  it('six lit births, one a size: every office band castPowers asks for reads the same under the fold', () => {
    build(true);
    for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) born(settType, `u6b-${settType}-0`);
    expect(sw.bandCalls.length, 'castPowers asked for office bands').toBeGreaterThan(0);
    expect(sw.bandCalls.filter((c) => c.band !== c.lawBand), 'no office band moves under the law\'s fold (fault (b) unreachable)').toEqual([]);
  });
});
