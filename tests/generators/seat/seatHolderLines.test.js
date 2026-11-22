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
 *   (6) The final-record pass (E65): the holder known only on the final record. (7) Fault (b)'s guard: the law's fold
 *       leaves `raiseToOfficeBand` unchanged. (8) The ladder's totality: every rank line is one the pass recognises.
 *       (9) A named gap: `regenSection("npcs")` re-runs no final-record pass.
 *
 * CLOSE-3 unit (1), "VACANT" (brief `docs/chair/2026-11-21/eighth/close/briefs/VACANT.md`, the chair's E131): where the seat
 * stands EMPTY the holder says it held the seat (W3v, W1v: `SEAT_HOLDER_LINES.standingVacant`, `.relationVacant`), never
 * that it sits in it:
 *   (10) RED FIRST, the re-count's ten seeds: the page says the seat is empty, no W3 or W1 prints, the holder row carries
 *        W3v and the form<->holder row W1v.
 *   (11) THE TOOTH, a census of lit births of every size and the re-count's nineteen vacant seeds: no empty seat carries
 *        W1 or W3, no held seat W1v or W3v, and `seatHolderFindings` returns neither new code.
 *   (12) THE FINDINGS JUDGE: `seat_vacant_held_line` and `seat_held_vacant_line` on planted records, each gone with its line.
 *   (13) THE POOLS VERBATIM: the two twins are the chair's six lines.
 *
 * THE LIT BUILD is planted as `tests/domain/seat/seatLawSavedTown.test.js` plants it: the seat's dial and its mint
 * (`seatLaw.js`) and the contest's dial (`seatCircumstances.js :: SEAT_CONTEST_LIT`), each read live off one switch. Arms
 * (10) and (11) are born as the re-count births them, with FORTUNE LIT TOO: fortune's dial and its mint (`fortuneLaw.js`),
 * read live off its own switch (`sw.fortune`), off by default so the arms above are unmoved.
 *
 * @enforced-by this test
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

/** The switches, read live by the mocks: the build (`lit`), fortune's dial (`fortune`), the new paths forced off (`off`), a holder planted (`holder`). */
const sw = vi.hoisted(() => ({ lit: false, fortune: false, off: false, passOff: false, holder: /** @type {null | ((s: any) => any)} */ (null), standingCalls: /** @type {any[]} */ ([]), passCalls: /** @type {any[]} */ ([]), bandCalls: /** @type {any[]} */ ([]) }));

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
// VACANT (arms 10 and 11): fortune's dial and its mint, lit on their own switch, as the re-count's births were
vi.mock('../../../src/domain/fortune/fortuneLaw.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return {
    ...actual,
    get NEW_SETTLEMENT_FORTUNE_LAW_VERSION() { return sw.fortune ? actual.SIZE_RELATIVE_FORTUNE_LAW_VERSION : actual.DEFAULT_FORTUNE_LAW_VERSION; },
    newSettlementFortuneLaw: () => (sw.fortune ? { [actual.FORTUNE_LAW_CONFIG_KEY]: actual.SIZE_RELATIVE_FORTUNE_LAW_VERSION } : {}),
  };
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
import * as fortuneLaw from '../../../src/domain/fortune/fortuneLaw.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline, regenNPCsPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { computeFactionRelationships, seatHolderApartOf, seatHolderLinesOf } from '../../../src/generators/factionDynamics.js';
import { governanceAccountOf } from '../../../src/domain/display/governanceAccount.js';
import { seatHolderFindings } from '../../../src/domain/coherence/seatHolderFindings.js';
import { LADDER, RANK_STANDINGS, annotateFactionStanding, settleSeatHolderToRecord } from '../../../src/generators/power/factionStanding.js';
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

afterEach(() => { sw.lit = false; sw.fortune = false; sw.off = false; sw.passOff = false; sw.holder = null; sw.standingCalls = []; sw.passCalls = []; sw.bandCalls = []; });

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
  it('five births (a town, a village, a city, and two lit witness seeds born dark, one an R2 seat), law 1, against law 1 with the new paths and the final-record pass off', () => {
    // every row run and collected, never an `each` (sovereigntyLightingContract's park debt only shrinks)
    expectNoSeedFailures(collectSeedFailures([['town', 'u6d-town-0'], ['village', 'u6d-village-0'], ['city', 'u6d-city-0'], ['city', 'u6t-city-4'], ['village', 'u6p-village-3']], ([settType, seed]) => {
      build(false);
      sw.off = false;
      const on = born(settType, seed);
      expect(seatLaw.seatsByHolder(on), `${seed}: the birth is law 1`).toBe(false);
      sw.off = true;
      const off = born(settType, seed);
      expect(JSON.stringify(on), `${seed}: the law-1 record is byte-identical with the new paths off`).toBe(JSON.stringify(off));
      expect(diffPaths(JSON.parse(JSON.stringify(on)), JSON.parse(JSON.stringify(off))), `${seed}: 0 differences of any kind`).toEqual([]);
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

describe('U6 (8): THE LADDER\'S TOTALITY (E70 (a)): every rank line the ladder writes is one the pass recognises', () => {
  it('a grid of rosters drives every branch of the rank ladder; each rank line it writes is matched whole by RANK_STANDINGS, and every LADDER row is reached', () => {
    /** @type {Set<string>} */
    const reached = new Set();
    /** @type {string[]} */
    const unread = [];
    const keys = Object.keys(LADDER);
    /** @param {Array<{ faction: string, power: number, isGoverning?: boolean }>} roster */
    const drive = (roster) => {
      const rows = roster.map((f) => ({ ...f, desc: '' }));
      annotateFactionStanding(rows, { body: 'garrison' }, null);
      rows.forEach((row, rank) => {
        if (rank === 0 || !row.desc) return;
        const at = RANK_STANDINGS.findIndex((re) => re.exec(row.desc)?.[0] === row.desc);
        if (at < 0) unread.push(row.desc); else reached.add(keys[at]);
      });
    };
    for (const top of ['Alpha Council', 'Alpha Hall']) for (const p1 of [38, 30, 20]) for (const d2 of [1, 4, 8, 12]) for (const p3 of [p1 - d2 - 1, 3]) {
      drive([{ faction: top, power: 40, isGoverning: true }, { faction: 'Beta Band', power: p1 }, { faction: 'Gamma Band', power: p1 - d2 }, { faction: 'Delta Band', power: p3 }]);
    }
    // the unnamed head (the ladder's no-name branches), two rows so the second is also the last
    for (const p1 of [38, 30, 20]) drive([{ faction: '', power: 40, isGoverning: true }, { faction: 'Beta Band', power: p1 }]);
    expect(unread, 'a rank line the pass does not recognise (a reworded or a new ladder line)').toEqual([]);
    // the contested line needs a coup reading to be written; it is the ladder's constant, and the pass reads it
    expect(RANK_STANDINGS.some((re) => re.exec(LADDER.contested[0])?.[0] === LADDER.contested[0]), 'the contested line is recognised').toBe(true);
    reached.add('contested');
    expect([...reached].sort(), 'every LADDER row is reached by the grid').toEqual([...keys].sort());
  });
});

describe('U6 (9): A NAMED GAP (E70 (b)): regenSection("npcs") re-runs no final-record pass', () => {
  it('u6p-village-3 (a village, R2): the people regenerated, the holder stands, and its lines are the birth\'s, carried, not re-derived', () => {
    build(true);
    const birth = born('village', 'u6p-village-3');
    sw.passCalls = [];
    const { _preservation, ...parts } = /** @type {any} */ (regenNPCsPipeline(birth, birth.config, { seed: 'u6r-0' }));
    const after = { ...birth, ...parts };
    // THE GAP, NAMED: `generateSettlementPipeline.js :: regenNPCsPipeline` calls none of the final passes (keepOneDominant,
    // settleClergyToFinalRoster, settleArcaneToPractitioners, settleSeatHolderToRecord); its power structure is the record's,
    // carried. It is harmless while a regen cannot move the holder (measured: 0 moves in 201 regens of 67 lit R2 places); the
    // day it can, this arm reds on the holder below, and the lines would name the old holder.
    expect(sw.passCalls.length, 'the regen ran no final-record pass').toBe(0);
    const held = holderOf(/** @type {any} */ (after), { audience: 'owner' });
    expect([held.rule, held.holderName], 'the regenerated people seat the same holder').toEqual(['R2', 'Merchant Guilds']);
    const row = (/** @type {any} */ s) => s.powerStructure.factionRelationships.find((/** @type {any} */ r) => r.pair.includes('Elder Council') && r.pair.includes('Merchant Guilds')).narrative;
    const desc = (/** @type {any} */ s) => s.powerStructure.factions.find((/** @type {any} */ f) => f.faction === 'Merchant Guilds').desc;
    expect(row(after), 'the form<->holder row is the birth\'s').toBe(row(birth));
    expect(desc(after), 'the holder row is the birth\'s').toBe(desc(birth));
    expect(desc(after), 'and it still says the holder holds the seat').toContain('They sit in the Elder Council themselves, and its rulings are their own.');
  });
});

/** The four laws lit, as the re-count's births were: the seat's dial and the contest's (`build`), and fortune's. */
function buildFortune() {
  build(true);
  sw.fortune = true;
  expect(fortuneLaw.NEW_SETTLEMENT_FORTUNE_LAW_VERSION, 'the fortune dial').toBe(fortuneLaw.SIZE_RELATIVE_FORTUNE_LAW_VERSION);
}

/** A birth as the re-count births it (no culture). @param {string} settType @param {string} seed */
const bornBare = (settType, seed) => generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });

/** What the governance account prints where the chain's `missing_seat` holds (`governanceAccount.js :: governanceAccountOf`). */
const EMPTY_SEAT = 'No one holds the seat at';

/** The holder's line pools, each by its wording's name. */
const HELD_POOLS = Object.freeze({ standing: 'W3', relation: 'W1' });
const VACANT_POOLS = Object.freeze({ standingVacant: 'W3v', relationVacant: 'W1v' });

/**
 * Every holder line a record prints, filled for its own row (`factionDynamics.js :: seatHolderLinesOf`): each non-form row's
 * description as the holder (W3, W3v), and each relation row that names the form, the other power as the holder (W1, W1v).
 * @param {any} s @returns {Array<{ name: string, at: string }>}
 */
function holderLinesOn(s) {
  const factions = Array.isArray(s?.powerStructure?.factions) ? s.powerStructure.factions : [];
  const form = factions.find((/** @type {any} */ f) => f?.isGoverning);
  /** @type {Array<{ name: string, at: string }>} */
  const out = [];
  if (!form) return out;
  for (const f of factions) {
    if (!f || f === form || typeof f.desc !== 'string') continue;
    for (const pool of /** @type {const} */ (['standing', 'standingVacant'])) {
      if (seatHolderLinesOf(pool, { form, holder: f }).some((line) => f.desc.includes(line))) out.push({ name: pool === 'standing' ? HELD_POOLS.standing : VACANT_POOLS.standingVacant, at: f.faction });
    }
  }
  for (const row of Array.isArray(s.powerStructure.factionRelationships) ? s.powerStructure.factionRelationships : []) {
    const other = Array.isArray(row?.pair) && row.pair.includes(form.faction) ? row.pair.find((/** @type {string} */ n) => n !== form.faction) : null;
    if (!other) continue;
    for (const pool of /** @type {const} */ (['relation', 'relationVacant'])) {
      if (seatHolderLinesOf(pool, { form, holder: { faction: other } }).some((line) => String(row.narrative).includes(line))) out.push({ name: pool === 'relation' ? HELD_POOLS.relation : VACANT_POOLS.relationVacant, at: `${form.faction}<->${other}` });
    }
  }
  return out;
}

/** The re-count's ten (`close-3/VACANT-RECOUNT.md`): the page says the seat is empty and a holder line said it is held. */
const VACANT_HELD = Object.freeze([['town', 'vh-town-98'], ['city', 'vh-city-33'], ['city', 'vh-city-46'], ['city', 'vh-city-63'], ['metropolis', 'vh-metropolis-4'],
  ['metropolis', 'vh-metropolis-7'], ['metropolis', 'vh-metropolis-11'], ['metropolis', 'vh-metropolis-33'], ['metropolis', 'vh-metropolis-46'], ['metropolis', 'vh-metropolis-60']]);
/** The re-count's other nine empty seats, with no holder apart. */
const VACANT_UNHELD = Object.freeze([['thorp', 'vh-thorp-0'], ['thorp', 'vh-thorp-37'], ['thorp', 'vh-thorp-44'], ['thorp', 'vh-thorp-70'], ['thorp', 'vh-thorp-87'],
  ['hamlet', 'vh-hamlet-73'], ['village', 'vh-village-52'], ['town', 'vh-town-45'], ['town', 'vh-town-61']]);

describe('VACANT (10): RED FIRST, the re-count\'s ten seeds: an empty seat\'s holder says it held the seat', () => {
  it('on each, the page says the seat is empty, no W3 or W1 prints, the holder row carries W3v and the form<->holder row W1v', () => {
    // every seed run and collected, never an `each`
    expectNoSeedFailures(collectSeedFailures(VACANT_HELD, ([settType, seed]) => {
      buildFortune();
      const s = bornBare(settType, seed);
      expect(governanceAccountOf(s, {})?.text, `${seed}: the page says the seat is empty`).toContain(EMPTY_SEAT);
      const apart = seatHolderApartOf(s.powerStructure.factions, s, s);
      expect(apart, `${seed}: a holder stands apart`).toBeTruthy();
      const printed = holderLinesOn(s);
      const row = s.powerStructure.factionRelationships.find((/** @type {any} */ r) => r.pair.includes(apart.form.faction) && r.pair.includes(apart.holder.faction));
      const faults = [
        ...printed.filter((p) => p.name === 'W3' || p.name === 'W1').map((p) => `${p.name} on ${p.at}`),
        ...(printed.some((p) => p.name === 'W3v' && p.at === apart.holder.faction) ? [] : [`no W3v on ${apart.holder.faction}`]),
        ...(!row || printed.some((p) => p.name === 'W1v' && p.at === `${apart.form.faction}<->${apart.holder.faction}`) ? [] : [`no W1v on ${apart.form.faction}<->${apart.holder.faction}`]),
      ];
      // anchored: the page's empty seat and the holder apart are asserted above, and W3v (W1v where the row stands) is required here
      expect(faults.join('; '), `${seed}: the holder's lines on an empty seat`).toBe('');
    }), 'the empty seat\'s holder lines');
  }, 120_000); // its own budget, carrying the measured figure (VACANT, 2026-11-22): ten births in 3.9 s in a run of this file's VACANT arms
});

/** The census's births: `vh-<size>-0` to `vh-<size>-19` for every size, and the re-count's nineteen empty seats, each once. */
const CENSUS = Object.freeze([...new Map([
  ...['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].flatMap((settType) => Array.from({ length: 20 }, (_, i) => [settType, `vh-${settType}-${i}`])),
  ...VACANT_HELD, ...VACANT_UNHELD,
].map(([settType, seed]) => [seed, [settType, seed]])).values()]);

describe('VACANT (11): THE TOOTH, a census of lit births: the holder\'s lines agree with the page\'s seat', () => {
  it('no empty seat carries W1 or W3, no held seat W1v or W3v, and seatHolderFindings returns neither new code', () => {
    let empty = 0;
    let emptyApart = 0;
    // every birth run and collected, never an `each`
    expectNoSeedFailures(collectSeedFailures(CENSUS, ([settType, seed]) => {
      buildFortune();
      const s = bornBare(settType, seed);
      const vacant = String(governanceAccountOf(s, {})?.text || '').includes(EMPTY_SEAT);
      if (vacant) empty += 1;
      if (vacant && seatHolderApartOf(s.powerStructure.factions, s, s)) emptyApart += 1;
      const wrong = holderLinesOn(s).filter((p) => (vacant ? p.name in { W3: 1, W1: 1 } : p.name in { W3v: 1, W1v: 1 })).map((p) => `${p.name} on ${p.at}`);
      // anchored: the liveness count below asserts ten or more empty seats with a holder apart, whose W3v this same read finds (arm 10)
      expect(wrong.join('; '), `${seed}: ${vacant ? 'an empty seat' : 'a held seat'}'s holder lines`).toBe('');
      const codes = seatHolderFindings(s).map((f) => f.code).filter((c) => c === 'seat_vacant_held_line' || c === 'seat_held_vacant_line');
      // anchored: arm 12 reds each code on its planted record, so the judge is live
      expect(codes, `${seed}: the findings judge`).toEqual([]);
    }), 'the census of the holder\'s lines');
    expect(empty, 'the census holds empty seats').toBeGreaterThanOrEqual(19);
    expect(emptyApart, 'LIVENESS: empty seats with a holder apart').toBeGreaterThanOrEqual(10);
  }, 120_000); // its own budget, carrying the measured figure (VACANT, 2026-11-22): 135 births (19 empty seats, 10 with a holder apart) in 20.0 s in a run of this file's VACANT arms; about 36.7 s on a CI runner (distribution.test.js's measured factor), over the default 20 s
});

/** A planted record (U6 (6)'s shape): the Royal Authority the form, the Merchant Guilds its planted holder. @param {boolean} vacant @param {string} holderDesc */
const plantedSeat = (vacant, holderDesc) => ({ config: LIT, _seed: 'vacant-plant', powerStructure: { factionRelationships: [], factions: [
  { faction: 'Royal Authority', isGoverning: true, power: 40, category: 'government', desc: 'The crown.', ...(vacant ? { modifiers: ['vacant'] } : {}) },
  { faction: 'Merchant Guilds', power: 30, category: 'economy', desc: holderDesc },
] } });
/** @param {any} record @returns {string[]} */
const newCodesOf = (record) => seatHolderFindings(record).map((f) => f.code).filter((c) => c === 'seat_vacant_held_line' || c === 'seat_held_vacant_line');

describe('VACANT (12): THE FINDINGS JUDGE: a holder line that contradicts the seat is a finding', () => {
  it('a vacant seat with W3 on the holder reds seat_vacant_held_line; a held seat with W3v reds seat_held_vacant_line; each line removed, the code goes', () => {
    plant('Merchant Guilds');
    const roster = plantedSeat(false, '').powerStructure.factions;
    const pair = { form: roster[0], holder: roster[1] };
    const w3 = seatHolderLinesOf('standing', pair)[0];
    const w3v = seatHolderLinesOf('standingVacant', pair)[0];
    expect(w3, 'the W3 filled').toBe("They hold the Royal Authority's seat, and answer for what it does.");
    expect(w3v, 'the W3v filled').toBe("They held the Royal Authority's seat, and it stands empty now.");
    expect(governanceAccountOf(plantedSeat(true, 'Traders.'), {})?.text, 'the planted vacant seat is the page\'s empty seat').toContain(EMPTY_SEAT);
    expect(newCodesOf(plantedSeat(true, `Traders. ${w3}`)), 'W3 on an empty seat').toEqual(['seat_vacant_held_line']);
    // anchored: the same record with the line reds just above
    expect(newCodesOf(plantedSeat(true, 'Traders.')), 'the W3 removed, the code goes').toEqual([]);
    expect(newCodesOf(plantedSeat(false, `Traders. ${w3v}`)), 'W3v on a held seat').toEqual(['seat_held_vacant_line']);
    // anchored: the same record with the line reds just above
    expect(newCodesOf(plantedSeat(false, 'Traders.')), 'the W3v removed, the code goes').toEqual([]);
  });
});

describe('VACANT (13): THE POOLS VERBATIM', () => {
  it('the two vacant twins are the chair\'s six lines, byte for byte', () => {
    expect(SEAT_HOLDER_LINES.standingVacant, 'W3v').toEqual([
      "They held the {form's} seat, and it stands empty now.",
      'They sat in the {form} until its seat fell empty.',
      'The {form} was theirs, and no one sits in its seat today.',
    ]);
    expect(SEAT_HOLDER_LINES.relationVacant, 'W1v').toEqual([
      'The {form} is the office here, and the seat {holder} held in it stands empty.',
      '{holder} sat in the {form} until its seat fell empty.',
      "The {form's} seat was filled by {holder}, and no one fills it now.",
    ]);
  });
});
