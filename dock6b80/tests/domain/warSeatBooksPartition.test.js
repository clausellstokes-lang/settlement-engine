/**
 * warSeatBooksPartition.test.js — W-SEAT SEAT-2a: the seat books are a PARTITION,
 * the fourth (foreign) book joins it, and no consumer hand-sums weight names again.
 *
 * ⛔ WHY THIS FILE EXISTS, stated so nobody deletes it as duplicate coverage.
 * `warSeatBooks.test.js` pins what the THREE weights mean. This pins the shape they
 * live in. ODQ §823 ordered `warTermination.blendBooksTerm` cured FIRST because it
 * re-normalized by its own computed total: a fourth weight it did not know about
 * would neither throw nor NaN — it would silently redistribute that weight's mass
 * across the three it did know, moving every war-termination term with no receipt
 * admitting it. A defensive line was the most dangerous line in the family. The
 * cure is structural (read the partition, never the field names), so the guard has
 * to be structural too: a SOURCE SCAN, not another value assertion.
 *
 * The greens here are DISCOVERY-grade, not regression-grade (A1.2.15 makes that a
 * per-car declaration): SEAT-1's resolver had no production consumer, so its greens
 * could only say "nothing moved". This car gives it nine, and the arms below show
 * the lit path CHANGING a consumer's answer — the envoy intent, the sale intent,
 * the interest label and the partition itself.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  PRIVATE_BOOK_KINDS,
  SEAT_BOOK_KINDS,
  readWarSeatBooks,
  seatBooksPartition,
} from '../../src/domain/worldPulse/warSeatBooks.js';
import {
  ARMY_ENVOY_INTENT_TUNING,
  deriveArmyEnvoyIntent,
} from '../../src/domain/worldPulse/armyTransitKernel.js';
import {
  collapseSeatBooksUnderThreat,
} from '../../src/domain/worldPulse/conquestFeasibility.js';
import { SOVEREIGNTY_BOOKS_INTERESTS } from '../../src/domain/worldPulse/sovereigntyIntent.js';

const SRC_ROOT = path.resolve(fileURLToPath(new URL('../../src', import.meta.url)));

const RULES = Object.freeze({ settlementPoliticsEnabled: true, factionCompetitionEnabled: true });

function ruler(id = 'ruler', name = 'Lady Arin', overrides = {}) {
  return {
    id,
    name,
    importance: 'pillar',
    factionAffiliation: 'Crown',
    personality: { dominant: 'principled', flaw: 'patient', modifier: 'diplomatic' },
    facets: { alignment: 'lawful_good', goal: 'protect_followers' },
    ...overrides,
  };
}

function item({ id = 'a', name = 'Aster', legitimacy = 30, npcs = [ruler()] } = {}) {
  return {
    id,
    name,
    settlement: {
      name,
      tier: 'city',
      npcs,
      powerStructure: {
        governingName: 'Crown',
        publicLegitimacy: { score: legitimacy },
        previousGovernments: [],
        factions: [
          { id: 'fac.crown', faction: 'Crown', power: 55, isGoverning: true },
          { id: 'fac.rival', faction: 'Rival House', power: 45 },
        ],
      },
    },
  };
}

function snap(items) {
  return { settlements: items, byId: new Map(items.map((e) => [String(e.id), e])) };
}

function ladder(top, stock = 7) {
  return { factions: { 'fac.crown': { rungs: [top] } }, npcs: { [top]: { stock } } };
}

/**
 * A town held at spearpoint by a court that has its own seated ruler. The occupier's
 * ruler is deliberately a WARMONGER so its direction is visibly different from the
 * occupied court's peaceable one — a foreign book that voted the same way would make
 * every arm below a green about nothing.
 */
function occupiedWorld({ lit = false, rung = 'extractive', resistance = 0.1 } = {}) {
  const warlord = ruler('ruler', 'Warlord Kesh', {
    personality: { dominant: 'ruthless', flaw: 'vengeful', modifier: 'proud' },
    facets: { alignment: 'chaotic_evil', goal: 'punish_rivals' },
  });
  return {
    snapshot: snap([item(), item({ id: 'o', name: 'Gloamhold', legitimacy: 80, npcs: [warlord] })]),
    worldState: {
      simulationRules: { ...RULES, ...(lit ? { foreignSeatEnabled: true } : {}) },
      spatialLedgers: { npcLadder: { a: ladder('a:ruler'), o: ladder('o:ruler') } },
      occupations: { a: { occupierId: 'o', state: rung, resistance } },
    },
  };
}

function readOccupied(options = {}) {
  const { worldState, snapshot } = occupiedWorld(options);
  return readWarSeatBooks({ worldState, snapshot, actorId: 'a', opponentId: 'b' });
}

// ── THE PARTITION ITSELF ─────────────────────────────────────────────────────

describe('SEAT-2a — the books are a partition', () => {
  it('enumerates exactly four books, three of them private, in a stable order', () => {
    expect(SEAT_BOOK_KINDS).toEqual(['realm', 'seat', 'patron', 'foreign']);
    expect(PRIVATE_BOOK_KINDS).toEqual(['seat', 'patron', 'foreign']);
    const part = seatBooksPartition({ settlementWeight01: 0.6, seatWeight01: 0.4 });
    expect(part.books.map((b) => b.kind)).toEqual(SEAT_BOOK_KINDS);
    expect(part.books.filter((b) => b.private).map((b) => b.kind)).toEqual(PRIVATE_BOOK_KINDS);
  });

  it('is INERT on absent and on garbage rather than producing a NaN mass', () => {
    for (const input of [null, undefined, {}, [], 'books', 7]) {
      const part = seatBooksPartition(input);
      expect(Number.isFinite(part.total01), `input ${JSON.stringify(input)}`).toBe(true);
      expect(part.total01).toBe(0);
      expect(part.closed).toBe(false); // anchored: an EMPTY record is not a closed partition, and saying so is the point
    }
    const junk = seatBooksPartition({ settlementWeight01: 'x', seatWeight01: NaN, patronWeight01: Infinity });
    expect(junk.total01).toBe(0);
  });

  it('closes to 1 on the DARK path and on the LIT path alike', () => {
    const dark = seatBooksPartition(readOccupied({ lit: false }));
    const lit = seatBooksPartition(readOccupied({ lit: true }));
    expect(dark.closed).toBe(true);
    expect(lit.closed).toBe(true);
    // anchored: closure is not the same claim as "the foreign book is absent" —
    // the lit partition closes WITH a non-zero fourth book, which is the fact the
    // silent-redistribution defect was hiding.
    expect(dark.foreignMass01).toBe(0);
    expect(lit.foreignMass01).toBeGreaterThan(0);
  });

  it('⭐ THE BIT-IDENTITY CLAIM, SWEPT — and the near-miss that a single sample hides', () => {
    // `blendBooksTerm` is module-private, so this proves the ALGEBRA it relies on.
    //
    // ⚠ THIS ARM WAS WRITTEN AS TWO HAND-PICKED DOUBLES FIRST AND THE NEGATIVE
    // CONTROL FAILED — the "wrong" form happened to be bit-identical for that one
    // pair. MEASURED over a 39,601-cell sweep: distributing the private mass into
    // two products changes the last bit in 26.5% of cells and looks IDENTICAL in
    // the other 73.5%. That is §713.3's law in miniature (one leaf of 29 moved on
    // floating-point associativity; 28 rounded the same, so a smaller corpus would
    // have shipped the drift), and it is why this arm sweeps rather than samples:
    // a single sample of this claim is a coin flip weighted 3:1 toward a false pass.
    let zeroProductBroke = 0;
    let distributedDiffered = 0;
    let cells = 0;
    for (let i = 1; i < 200; i += 1) {
      for (let j = 1; j < 200; j += 1) {
        const own = (i / 199) * 0.9 + 0.05;
        const realm = 1 - own;
        const realmTerm = j / 199;
        const privateTerm = 1 - realmTerm;
        const before = (realmTerm * realm + privateTerm * own) / (realm + own);
        // THE SHIPPED FORM: one extra product whose weight is exactly zero.
        const shipped = (realmTerm * realm + privateTerm * own + 0.6421 * 0) / (realm + own + 0);
        if (!Object.is(before, shipped)) zeroProductBroke += 1;
        // THE REJECTED FORM: the same mass, distributed into two products.
        const half = own * 0.37;
        const distributed = (realmTerm * realm + privateTerm * half + privateTerm * (own - half)) / (realm + own);
        if (!Object.is(before, distributed)) distributedDiffered += 1;
        cells += 1;
      }
    }
    expect(cells).toBe(39601);
    // The claim: a zero-weighted fourth product is bit-exact EVERYWHERE.
    expect(zeroProductBroke).toBe(0);
    // The control: the rejected form is genuinely different, and the file is not
    // asserting a property that no arrangement of doubles could violate.
    expect(distributedDiffered).toBeGreaterThan(cells / 5);
  });

  it('the DARK producer is byte-identical whether the key is absent, false, or truthy-not-true', () => {
    const absent = JSON.stringify(readOccupied({ lit: false }));
    for (const truthy of ['true', 1, {}, [], 'yes']) {
      const { worldState, snapshot } = occupiedWorld({ lit: false });
      worldState.simulationRules.foreignSeatEnabled = truthy;
      expect(
        JSON.stringify(readWarSeatBooks({ worldState, snapshot, actorId: 'a', opponentId: 'b' })),
        `truthy ${JSON.stringify(truthy)} lit the books`,
      ).toBe(absent);
    }
  });

  it('a LIT flag with NO seat substrate is still byte-identical to dark', () => {
    // The gate is not the only thing holding the layer down: with no occupation and
    // no vassal edge the resolver returns null and the record is unchanged. Without
    // this arm the dormancy claim would rest entirely on the flag read.
    const free = (lit) => {
      const worldState = {
        simulationRules: { ...RULES, ...(lit ? { foreignSeatEnabled: true } : {}) },
        spatialLedgers: { npcLadder: { a: ladder('a:ruler') } },
      };
      return JSON.stringify(readWarSeatBooks({ worldState, snapshot: snap([item()]), actorId: 'a', opponentId: 'b' }));
    };
    expect(free(true)).toBe(free(false));
  });
});

// ── THE DISCOVERY ARM: the lit path moves real consumers ─────────────────────

describe('SEAT-2a — the foreign book is DISCOVERED by its consumers, not merely computed', () => {
  it('lights a fourth book, relabels the interest, and shrinks the books it competes with', () => {
    const dark = readOccupied({ lit: false });
    const lit = readOccupied({ lit: true });

    expect(dark.foreignWeight01).toBe(0);
    expect(dark.interestKind).toBe('seat');
    expect(lit.foreignWeight01).toBeGreaterThan(0);
    expect(lit.interestKind).toBe('foreign');
    expect(lit.foreignSeatId).toBe('o');
    expect(lit.foreignRegime).toBe('occupation');
    expect(lit.foreignPrimacy).toBe(true);
    expect(lit.foreignSeatName).toBe('Gloamhold');
    expect(lit.foreignRung).toBe('extractive');

    // The legitimate seat's book is still COMPUTED, not displaced — the competition
    // the owner's directive describes has to be visible in the record to be narratable.
    expect(lit.seatWeight01).toBeGreaterThan(0);
    expect(lit.seatWeight01).toBeLessThan(dark.seatWeight01);
    expect(lit.settlementWeight01).toBeLessThan(dark.settlementWeight01);
  });

  it('votes with the OCCUPIER\'s own direction, not the occupied ruler\'s', () => {
    const lit = readOccupied({ lit: true });
    // The occupied court is peaceable (protect_followers, lawful_good); the occupier
    // is a warmonger. If the foreign book had borrowed the local ruler's character —
    // which is exactly what a silent three-book redistribution does — these would agree.
    expect(lit.foreignContinueBias01).toBeGreaterThan(lit.continueBias01);
    expect(lit.foreignPeaceBias01).toBeLessThan(lit.peaceBias01);
  });

  it('carries an occupied court\'s envoy over PRIVATE_BOOK_MIN that three books left under it', () => {
    // The measured consumer change. `deriveArmyEnvoyIntent` gated on `seat + patron`,
    // so an occupied court's private mass excluded the one power actually deciding and
    // its terms_shop/imprison intents were SUPPRESSED — an absence, the failure shape
    // nothing ever reds on.
    const books = { ...readOccupied({ lit: true }), continueBias01: 0.2, peaceBias01: 0.8 };
    const partition = seatBooksPartition(books);
    expect(partition.domesticPrivateMass01).toBeLessThan(ARMY_ENVOY_INTENT_TUNING.PRIVATE_BOOK_MIN);
    expect(partition.privateMass01).toBeGreaterThanOrEqual(ARMY_ENVOY_INTENT_TUNING.PRIVATE_BOOK_MIN);
    const intent = deriveArmyEnvoyIntent({ armyId: 'a', targetId: 'b', frontSinceTick: 3, books });
    expect(intent?.privateGoals).toEqual(['terms_shop']);
  });

  it('VASSALAGE competes as a scalar and leaves the label domestic (law §2.3)', () => {
    // The ruling this car records: `foreign` wins the interest label by ORDERING
    // (primacy), never by out-weighing anything. A matured vassal has a real book and
    // no primacy, so its overlord shows up as a weight and a band, not as the decider.
    const { worldState, snapshot } = occupiedWorld({ lit: true, rung: 'vassalized' });
    const read = readWarSeatBooks({ worldState, snapshot, actorId: 'a', opponentId: 'b' });
    expect(read.foreignRegime).toBe('vassalage');
    expect(read.foreignPrimacy).toBe(false);
    expect(read.foreignWeight01).toBeGreaterThan(0);
    expect(read.interestKind).toBe('seat'); // anchored: NOT 'foreign' — the whole point of the ruling
  });

  it('attaches the foreign book in the UNSEATED branch too (A1.1.7)', () => {
    const { worldState, snapshot } = occupiedWorld({ lit: true });
    worldState.spatialLedgers.npcLadder.a = { factions: {}, npcs: {} };
    const read = readWarSeatBooks({ worldState, snapshot, actorId: 'a', opponentId: 'b' });
    expect(read.securityBand).toBe('unseated');
    expect(read.foreignWeight01).toBeGreaterThan(0);
    expect(read.settlementWeight01).toBeLessThan(1); // anchored: the old branch returned a flat 1 under a live occupation
    expect(read.interestKind).toBe('foreign');
    expect(seatBooksPartition(read).closed).toBe(true);
  });

  it('the foreign book does NOT collapse under an existential threat, and the partition still closes', () => {
    // "A ruler of ashes rules nothing" is true of the LOCAL seat, which dies with the
    // realm. An occupier's book is held in another town by a court this threat does not
    // touch. Folding it would make an occupied town's decisions become MORE its own the
    // closer it came to being conquered, which is backwards.
    const books = { settlementWeight01: 0.3, seatWeight01: 0.3, patronWeight01: 0, foreignWeight01: 0.4 };
    const doomed = { known: true, beingConqueredRisk01: 1, threatBand: 'overwhelming' };
    const folded = collapseSeatBooksUnderThreat(books, doomed);
    expect(folded.collapsed).toBe(true);
    expect(folded.seatWeight01).toBeLessThan(0.3);
    expect(folded.foreignWeight01).toBe(0.4); // anchored: untouched, by ruling
    expect(seatBooksPartition(folded).closed).toBe(true);
  });
});

// ── THE STRUCTURAL GUARD: nobody hand-sums weight names again ────────────────

describe('SEAT-2a — the no-hand-sum law, enforced by a source scan', () => {
  /** @type {string[]} */
  const files = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir).sort()) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (full.endsWith('.js')) files.push(full);
    }
  }(SRC_ROOT));

  /**
   * ⛔ THE TWO LICENSED SITES, EACH FOR A STATED REASON — and this list may only
   * ever SHRINK. `warSeatBooks.js` owns the partition. `conquestFeasibility.js`
   * declares "no imports at all" in its own module header, an older constraint that
   * wins, so it names the fourth weight literally and carries a paragraph saying so.
   */
  const LICENSED = Object.freeze([
    'domain/worldPulse/warSeatBooks.js',
    'domain/worldPulse/conquestFeasibility.js',
  ]);

  it('no file outside the two licensed ones combines two book weights arithmetically', () => {
    const offenders = [];
    for (const full of files) {
      const rel = path.relative(SRC_ROOT, full).split(path.sep).join('/');
      if (LICENSED.includes(rel)) continue;
      const source = readFileSync(full, 'utf8');
      // Two weight names inside one expression, joined by `+`, `Math.max` or `Math.min`.
      const combining = /(seatWeight01|patronWeight01|foreignWeight01|settlementWeight01)[^;\n]{0,80}?(\+|Math\.(?:max|min)\()[^;\n]{0,80}?(seatWeight01|patronWeight01|foreignWeight01|settlementWeight01)/;
      if (combining.test(source)) offenders.push(rel);
    }
    // anchored: the scan is only meaningful if it can SEE the licensed sites, so
    // prove that first — a scan that matches nothing anywhere proves nothing here.
    const warSeat = readFileSync(path.join(SRC_ROOT, 'domain/worldPulse/warSeatBooks.js'), 'utf8');
    expect(/seatWeight01[^;\n]{0,80}?\+[^;\n]{0,80}?patronWeight01/.test(warSeat)).toBe(true);
    expect(offenders).toEqual([]);
  });

  it('the licensed list only shrinks: every entry still exists and still needs its licence', () => {
    for (const rel of LICENSED) {
      const source = readFileSync(path.join(SRC_ROOT, rel), 'utf8');
      expect(source, `${rel} no longer reads a book weight — drop it from LICENSED`)
        .toMatch(/seatWeight01|foreignWeight01/);
    }
  });
});

// ── THE VOCABULARY: four values, admitted everywhere they are branched on ────

describe('SEAT-2a — the interestKind vocabulary is four values, and every brancher knows', () => {
  const CONSUMERS = Object.freeze({
    'domain/worldPulse/warRulingsEvidence.js': "['realm', 'seat', 'patron', 'foreign']",
    'domain/worldPulse/warPeaceDecision.js': "['realm', 'seat', 'patron', 'foreign']",
  });

  it('the sovereignty vocabulary admits the fourth kind rather than rewriting it to realm', () => {
    expect(SOVEREIGNTY_BOOKS_INTERESTS).toEqual(['realm', 'seat', 'patron', 'foreign']);
  });

  it('every enumerated brancher lists all four, so none silently falls through', () => {
    for (const [rel, expected] of Object.entries(CONSUMERS)) {
      const source = readFileSync(path.join(SRC_ROOT, rel), 'utf8');
      expect(source, `${rel} still enumerates a shorter interest list`).toContain(expected);
      expect(source, `${rel} kept the three-value list somewhere`)
        // anchored: the toContain two lines up is the liveness anchor — it asserts the FOUR-value list IS present in this very `source` string, so a drift that renamed, moved or emptied the file reds there first and this exclusion can never pass on an absent subject
        .not.toContain("['realm', 'seat', 'patron']");
    }
  });

  it('the producer emits only vocabulary members, in every regime it can resolve', () => {
    const seen = new Set([
      readOccupied({ lit: false }).interestKind,
      readOccupied({ lit: true }).interestKind,
      readOccupied({ lit: true, rung: 'vassalized' }).interestKind,
      readOccupied({ lit: true, rung: 'contested', resistance: 0.9 }).interestKind,
    ]);
    for (const kind of seen) expect(SEAT_BOOK_KINDS).toContain(kind);
    expect(seen.has('foreign')).toBe(true); // anchored: the set is not vacuously all-'seat'
  });
});
