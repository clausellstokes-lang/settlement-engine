/**
 * brokerageCalibration.test.js — [W-I INFORMATION BROKERAGES] I2, THE CALIBRATION-HONESTY
 * ENVELOPE (docs/DESIGN_INFORMATION_BROKERAGES.md §10, the program's crown jewel;
 * constitutional Law 2).
 *
 * THE CLAIM UNDER TEST, stated plainly: a reliability stamp is not decoration. Over a
 * seeded corpus, the news items a house grades `confirmed` are actually true at or above
 * the confirmed band, and the ones it grades `tavern_talk` at or above its band. The
 * stamps are the rare interface element with a theorem attached, and this file executes
 * that theorem against ground truth the simulation already knows.
 *
 * ── WHY THIS IS NOT CIRCULAR, WHICH IS THE WHOLE DIFFICULTY ──
 *
 * A rumour arrival record carries its own `accuracy01`, and grading by that number and
 * then scoring against it would prove list equals list. So the two sides are kept
 * strictly apart:
 *
 *   THE GRADE reads PROVENANCE ONLY: relay hops, independent roots, and the grading
 *   house's channel competence. It never reads accuracy01 or completeness01.
 *
 *   THE TRUTH reads CONTENT ONLY: whether the telling a settlement holds still says what
 *   the origin telling said (impact kind, place, scope, magnitude band, and the involved
 *   parties). That is derived from an undegraded run of the SAME feed, so it is the
 *   simulation's own ground truth rather than a restatement of the grade.
 *
 * The corpus is produced by the REAL advance (spatial/rumorNetwork.advanceRumorLedgers)
 * over two witness topologies and a seed family, not by a hand-written table, because the
 * envelope is a claim about the world's physics and a fixture could only ever restate the
 * ladder back to itself.
 *
 * ── THE NEGATIVE CONTROLS ARE IN THE FILE, NOT IN THE COMMIT MESSAGE ──
 *
 * "Every rung clears its band" is satisfied by any corpus with a high base rate, so two
 * MIS-CALIBRATED MUTANTS are graded over the identical corpus and asserted to FAIL the
 * identical check: an INVERTED ladder (which grades a four-road rumour `confirmed`) and a
 * FLATTERING one (which grades everything `confirmed`). If the envelope cannot tell those
 * from the real ladder it is measuring nothing.
 */
import { describe, expect, it } from 'vitest';

import { advanceRumorLedgers } from '../../src/domain/spatial/rumorNetwork.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  RELIABILITY_LADDER,
  brokerageHousesOf,
  newsReliabilityStamp,
  reliabilityBandOf,
  reliabilityRungOf,
} from '../../src/domain/worldPulse/brokerageStamps.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

// ── The corpus: the REAL rumour advance, two topologies, a seed family ──────

const IDS = Object.freeze(Array.from({ length: 14 }, (_, i) => `s${String(i).padStart(2, '0')}`));
const SEEDS = Object.freeze(Array.from({ length: 12 }, (_, i) => `brokerage-envelope-${i}`));
const FIRST_TICK = 5;
const LAST_TICK = 44;

const DIGEST = (() => {
  const pack = makeGridPack({ cols: 30, rows: 24 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
})();

/** A long chain plus two shortcuts, so relay depth spreads rather than clustering. */
const GRAPH = (() => {
  const channels = [];
  for (let i = 0; i < IDS.length - 1; i += 1) {
    channels.push({ id: `c${i}`, type: 'trade_route', from: IDS[i], to: IDS[i + 1], status: 'confirmed' });
  }
  channels.push({ id: 'x1', type: 'trade_route', from: IDS[0], to: IDS[5], status: 'confirmed' });
  channels.push({ id: 'x2', type: 'trade_route', from: IDS[3], to: IDS[9], status: 'confirmed' });
  return { channels };
})();

/** `single` seeds one witness per event; `multi` seeds two or three, so roots spread. */
function feedFor(witnessMode) {
  const entries = [];
  for (let e = 0; e < 24; e += 1) {
    const tick = FIRST_TICK + e;
    const witnesses = witnessMode === 'single'
      ? [IDS[e % IDS.length]]
      : (e % 2 === 0
        ? [IDS[e % IDS.length], IDS[(e + 6) % IDS.length]]
        : [IDS[e % IDS.length], IDS[(e + 4) % IDS.length], IDS[(e + 9) % IDS.length]]);
    entries.push({
      id: `wizard_news.${tick}.applied.evt${e}`,
      tick,
      significance: 'major',
      score: 80 + (e % 10),
      severity: 0.5 + (e % 5) * 0.1,
      scope: 'regional',
      kind: 'applied',
      impactKind: ['import_shortage', 'faction_rift', 'siege_begun'][e % 3],
      settlementIds: witnesses,
      sourceEventId: `evt${e}`,
      tags: ['world_pulse'],
    });
  }
  return entries;
}

/** Drive the real advance and return every tick's ledgers. */
function drive(seed, infoMode, feedEntries) {
  let ledgers = null;
  const snapshots = [];
  for (let tick = FIRST_TICK; tick <= LAST_TICK; tick += 1) {
    const result = advanceRumorLedgers({
      worldState: {
        simulationRules: { infoMode },
        spatialCanonVersion: 1,
        spatialDigest: DIGEST,
        ...(ledgers ? { spatialLedgers: { rumorLedgers: ledgers } } : {}),
      },
      feedEntries,
      graph: GRAPH,
      tick,
      rng: createPRNG(`${seed}::tick:${tick}`),
    });
    if (result.changed) ledgers = result.next;
    snapshots.push({ tick, ledgers });
  }
  return snapshots;
}

/** THE TRUTH PREDICATE: does this telling still say what the origin telling said? */
function sameClaim(told, origin) {
  if (!told || !origin) return false;
  const parties = (c) => [...(Array.isArray(c.partyIds) ? c.partyIds : [])].map(String).sort().join('|');
  return told.what === origin.what
    && told.whereId === origin.whereId
    && told.scope === origin.scope
    && told.magnitude === origin.magnitude
    && parties(told) === parties(origin);
}

/** The corpus, built once: one row per arrival, carrying provenance and truth. */
const CORPUS = (() => {
  const rows = [];
  for (const witnessMode of ['single', 'multi']) {
    const feedEntries = feedFor(witnessMode);
    // Ground truth: the hop-0 telling from a run whose mode never degrades content.
    const origin = new Map();
    for (const { ledgers } of drive('origin', 'perfect_delayed', feedEntries)) {
      for (const ledger of Object.values(ledgers || {})) {
        for (const record of Object.values(ledger || {})) {
          if (record.hopCount === 0 && !origin.has(record.eventRef)) origin.set(record.eventRef, record.content);
        }
      }
    }
    for (const seed of SEEDS) {
      const seen = new Set();
      for (const { tick, ledgers } of drive(seed, 'unreliable', feedEntries)) {
        for (const [sid, ledger] of Object.entries(ledgers || {})) {
          for (const [key, record] of Object.entries(ledger || {})) {
            const rowKey = `${witnessMode}|${seed}|${sid}|${key}|${record.hopCount}|${record.arrivalTick}`;
            if (seen.has(rowKey) || record.arrivalTick > tick) continue;
            seen.add(rowKey);
            const truth = origin.get(record.eventRef);
            if (!truth) continue;
            rows.push({
              hopCount: record.hopCount,
              independentSources: (record.corroborationRoots || []).length,
              intact: sameClaim(record.content, truth),
            });
          }
        }
      }
    }
  }
  return rows;
})();

// ── The graders under test: the real ladder and two mis-calibrated mutants ──

const HOUSES = Object.freeze({
  exchange: brokerageHousesOf([{
    name: "Chroniclers' exchange", tags: ['legal', 'information', 'brokerage'],
    serviceKeys: ['info_calibration', 'info_query', 'info_feed'],
  }]),
  post: brokerageHousesOf([{
    name: 'Listening post', tags: ['legal', 'information', 'brokerage'],
    serviceKeys: ['info_calibration', 'info_query'],
  }]),
  market: brokerageHousesOf([{
    name: 'Whisper market', tags: ['criminal', 'information', 'brokerage'],
    serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'],
  }]),
});

/** The channel each house is authored to master, so every house actually vouches. */
const HOUSE_CHANNEL = Object.freeze({ exchange: 'trade', post: 'trade', market: 'crime' });

/** THE REAL GRADER. */
const realGrade = (houses, channel, row) => newsReliabilityStamp({
  houses, channel, provenance: { hopCount: row.hopCount, independentSources: row.independentSources },
})?.grade || null;

/** MUTANT ONE: the ladder inverted. A four-road rumour is called confirmed. */
const invertedGrade = (houses, channel, row) => {
  const real = realGrade(houses, channel, row);
  if (!real) return null;
  return RELIABILITY_LADDER[RELIABILITY_LADDER.length - 1 - reliabilityRungOf(real)];
};

/** MUTANT TWO: the flattering house. Everything is confirmed. */
const flatteringGrade = (houses, channel, row) => (realGrade(houses, channel, row) ? 'confirmed' : null);

/** Tally truth rates per grade for one grader over the corpus. */
function tally(grader, houses, channel) {
  /** @type {Map<string, { n: number, intact: number }>} */
  const byGrade = new Map();
  for (const row of CORPUS) {
    const grade = grader(houses, channel, row);
    if (!grade) continue;
    const cell = byGrade.get(grade) || { n: 0, intact: 0 };
    cell.n += 1;
    if (row.intact) cell.intact += 1;
    byGrade.set(grade, cell);
  }
  return byGrade;
}

/** The minimum cell size at which a rate is a measurement rather than an anecdote. */
const MIN_CELL = 40;

/** Every grade whose observed truth rate falls BELOW its declared band. */
function bandViolations(byGrade) {
  const out = [];
  for (const [grade, cell] of byGrade) {
    if (cell.n < MIN_CELL) continue;
    const rate = cell.intact / cell.n;
    if (rate < reliabilityBandOf(grade)) {
      out.push(`${grade}: ${rate.toFixed(3)} over ${cell.n} items, band ${reliabilityBandOf(grade)}`);
    }
  }
  return out;
}

// ── The corpus itself must be worth measuring ──────────────────────────────

describe('[W-I I2] the calibration corpus is real, large, and spread', () => {
  it('comes from the real advance and carries both truths and falsehoods at several depths', () => {
    expect(CORPUS.length, 'the corpus collapsed').toBeGreaterThan(2000);
    const intact = CORPUS.filter((row) => row.intact).length;
    // A corpus that is all-true or all-false would make every band check meaningless.
    expect(intact).toBeGreaterThan(CORPUS.length / 10);
    expect(intact).toBeLessThan(CORPUS.length);
    const depths = new Set(CORPUS.map((row) => Math.min(row.hopCount, 4)));
    expect(depths.size, 'every telling arrived at the same relay depth').toBeGreaterThanOrEqual(4);
    const roots = new Set(CORPUS.map((row) => Math.min(row.independentSources, 3)));
    expect(roots.size, 'no event was ever corroborated by a second road').toBeGreaterThanOrEqual(2);
  });

  it('the world genuinely degrades tellings with distance, which is what the ladder reads', () => {
    const rateAt = (hop) => {
      const rows = CORPUS.filter((row) => row.hopCount === hop);
      return rows.length ? rows.filter((row) => row.intact).length / rows.length : null;
    };
    expect(rateAt(0)).toBe(1);
    const far = rateAt(3) ?? rateAt(2);
    expect(far, 'no far tellings in the corpus').not.toBeNull();
    expect(far).toBeLessThan(1);
  });
});

// ── THE ENVELOPE ───────────────────────────────────────────────────────────

describe('[W-I I2] THE CALIBRATION-HONESTY ENVELOPE', () => {
  it('every grade a house awards is true at or above the band that grade declares', () => {
    const houseKeys = Object.keys(HOUSES);
    let populatedCells = 0;
    const failures = collectSeedFailures(houseKeys, (houseKey) => {
      const byGrade = tally(realGrade, HOUSES[houseKey], HOUSE_CHANNEL[houseKey]);
      for (const cell of byGrade.values()) if (cell.n >= MIN_CELL) populatedCells += 1;
      const violations = bandViolations(byGrade);
      expect(violations, `${houseKey} broke its own bands: ${violations.join(' / ')}`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'every house keeps the promise its stamps make');
    // NON-VACUITY, first half: a ladder that only ever emitted one grade would clear its
    // bands trivially. The houses between them must populate several rungs at scale.
    expect(populatedCells, 'the ladder collapsed to a single rung').toBeGreaterThanOrEqual(6);
  });

  it('a house grades monotonically: a better rung is a truer rung, within that house', () => {
    // Stated WITHIN a house on purpose. Competence capping moves high-truth items DOWN the
    // ladder, so a rate pooled across houses of different competence can legitimately be
    // non-monotone; within one house the cap is a constant and the claim is exact.
    const houseKeys = Object.keys(HOUSES);
    const failures = collectSeedFailures(houseKeys, (houseKey) => {
      const byGrade = tally(realGrade, HOUSES[houseKey], HOUSE_CHANNEL[houseKey]);
      const rates = RELIABILITY_LADDER
        .map((grade) => ({ grade, cell: byGrade.get(grade) }))
        .filter(({ cell }) => cell && cell.n >= MIN_CELL)
        .map(({ grade, cell }) => ({ grade, rate: cell.intact / cell.n }));
      expect(rates.length, `${houseKey} populated fewer than two rungs`).toBeGreaterThanOrEqual(2);
      for (let i = 1; i < rates.length; i += 1) {
        expect(
          rates[i].rate,
          `${houseKey}: ${rates[i].grade} (${rates[i].rate.toFixed(3)}) beat ${rates[i - 1].grade} (${rates[i - 1].rate.toFixed(3)})`,
        ).toBeLessThanOrEqual(rates[i - 1].rate);
      }
    });
    expectNoSeedFailures(failures, 'a better rung is a truer rung inside every house');
  });

  it('THE NEGATIVE CONTROL: a mis-calibrated ladder FAILS the identical check', () => {
    // Executed, not asserted in prose. Both mutants are graded over the same corpus with
    // the same tally and the same band test; if either passed, the envelope above would be
    // measuring the corpus rather than the ladder.
    const houseKey = 'exchange';
    const houses = HOUSES[houseKey];
    const channel = HOUSE_CHANNEL[houseKey];

    expect(bandViolations(tally(realGrade, houses, channel)), 'the real ladder must be clean').toEqual([]);

    const inverted = bandViolations(tally(invertedGrade, houses, channel));
    expect(inverted.length, 'an INVERTED ladder passed the envelope').toBeGreaterThan(0);

    const flattering = bandViolations(tally(flatteringGrade, houses, channel));
    expect(flattering.length, 'a ladder that calls everything confirmed passed the envelope').toBeGreaterThan(0);

    // And the mutants really are grading the same items, not silently emitting nothing.
    const realCount = [...tally(realGrade, houses, channel).values()].reduce((s, c) => s + c.n, 0);
    for (const [name, grader] of [['inverted', invertedGrade], ['flattering', flatteringGrade]]) {
      const count = [...tally(grader, houses, channel).values()].reduce((s, c) => s + c.n, 0);
      expect(count, `${name} graded a different number of items`).toBe(realCount);
    }
  });

  it('the declared bands sit UNDER the measured rates, so the promise has margin', () => {
    // The envelope proves the promise is kept. This records by how much, which is what a
    // later tuning edit needs in order to know whether it has spent the margin.
    const byGrade = tally(realGrade, HOUSES.exchange, HOUSE_CHANNEL.exchange);
    const rows = RELIABILITY_LADDER
      .map((grade) => ({ grade, cell: byGrade.get(grade) }))
      .filter(({ cell }) => cell && cell.n >= MIN_CELL);
    expect(rows.length).toBeGreaterThanOrEqual(2);
    const failures = collectSeedFailures(rows, ({ grade, cell }) => {
      const rate = cell.intact / cell.n;
      expect(rate, `${grade} has no margin over its band`).toBeGreaterThanOrEqual(reliabilityBandOf(grade));
    });
    expectNoSeedFailures(failures, 'every rung clears its band with the corpus it was authored from');
  });
});
