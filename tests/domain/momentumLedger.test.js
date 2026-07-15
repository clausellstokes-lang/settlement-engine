/**
 * momentumLedger.test.js — W-MOMENTUM Stage 1 PIN BATTERY (design §1/§6).
 *
 * The commitment ledger: the bounded course taxonomy, deposits-are-reads (loudness the
 * measure), and the fold discipline copied from the credibility ledger — decay-all-to-now,
 * id-sorted deterministic deposits, clamp, prune, drop-when-empty, serialize-compare, and
 * the DORMANT-⇒-byte-identical gate.
 */
import { describe, it, expect } from 'vitest';
import {
  momentumActive,
  courseKeyOf,
  parseCourseKey,
  commitmentLedgerKey,
  splitCommitmentKey,
  decayedCommitmentStock,
  commitmentStockOf,
  commitmentDepositsFor,
  advanceCommitments,
  MOMENTUM_TUNING,
  COURSE_KINDS,
} from '../../src/domain/worldPulse/momentum.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';

// A live-info, momentum-lit worldState skeleton (beliefsActive + the virtual flag).
const LIT = { infoMode: 'unreliable', momentumEnabled: true };
const litWorld = (/** @type {Record<string, unknown>} */ over = {}) => ({
  spatialCanonVersion: 1,
  simulationRules: LIT,
  spatialLedgers: {},
  ...over,
});

describe('W-MOMENTUM Stage 1 — the gate (dormancy)', () => {
  it('is dark unless beliefsActive AND the virtual flag are both set', () => {
    expect(momentumActive(null)).toBe(false);
    expect(momentumActive({ spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable' } })).toBe(false); // no flag
    expect(momentumActive({ spatialCanonVersion: 1, simulationRules: { infoMode: 'omniscient', momentumEnabled: true } })).toBe(false); // omniscient
    expect(momentumActive({ simulationRules: LIT })).toBe(false); // no spatial marker
    expect(momentumActive(litWorld())).toBe(true);
  });

  it('every entry point is a byte-neutral no-op when dark', () => {
    const dark = { spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable' }, deployments: { a: { targetId: 'b' } } };
    expect(commitmentDepositsFor(dark)).toEqual([]);
    expect(advanceCommitments({ worldState: dark, tick: 3 })).toEqual({ worldState: dark, changed: false });
    expect(commitmentStockOf(dark, 'a', 'war:b', 3)).toBe(0);
  });
});

describe('W-MOMENTUM Stage 1 — the bounded course taxonomy (typed, never freetext)', () => {
  it('mints only the closed kinds; a freetext course is refused', () => {
    expect(courseKeyOf({ kind: 'war', target: 'b' })).toBe('war:b');
    expect(courseKeyOf({ kind: 'peace', target: 'b' })).toBe('peace:b');
    expect(courseKeyOf({ kind: 'campaign', target: 'b' })).toBe('campaign:b');
    expect(courseKeyOf({ kind: 'blockade', port: 'p' })).toBe('blockade:p');
    expect(courseKeyOf({ kind: 'contest', target: 'b', side: 'x' })).toBe('contest:b|x');
    // Refusals: unknown kind, missing subject.
    expect(courseKeyOf({ kind: 'vendetta', target: 'b' })).toBeNull();
    expect(courseKeyOf({ kind: 'war' })).toBeNull();
    expect(courseKeyOf({ kind: 'contest', target: 'b' })).toBeNull();
    expect(courseKeyOf({ kind: 'blockade' })).toBeNull();
    // Every declared kind is representable.
    for (const k of COURSE_KINDS) expect(typeof k).toBe('string');
  });

  it('parseCourseKey inverts courseKeyOf; malformed keys are null', () => {
    expect(parseCourseKey('war:b')).toEqual({ kind: 'war', target: 'b', side: null });
    expect(parseCourseKey('contest:b|x')).toEqual({ kind: 'contest', target: 'b', side: 'x' });
    expect(parseCourseKey('vendetta:b')).toBeNull();
    expect(parseCourseKey('war:')).toBeNull();
    expect(parseCourseKey('war')).toBeNull();
    expect(parseCourseKey('contest:b|')).toBeNull();
  });

  it('ledger keys round-trip through split; a malformed course refuses a key', () => {
    expect(commitmentLedgerKey('actorA', 'war:b')).toBe('actorA>war:b');
    expect(commitmentLedgerKey('', 'war:b')).toBeNull();
    expect(commitmentLedgerKey('actorA', 'nonsense')).toBeNull();
    expect(splitCommitmentKey('actorA>war:b')).toEqual({ actorId: 'actorA', courseKey: 'war:b' });
    expect(splitCommitmentKey('actorA>contest:b|x')).toEqual({ actorId: 'actorA', courseKey: 'contest:b|x' });
    expect(splitCommitmentKey('no-separator')).toBeNull();
  });
});

describe('W-MOMENTUM Stage 1 — deposits are READS, loudness the measure', () => {
  it('a live siege, a blockade, and a covert campaign each deposit into their typed course', () => {
    const ws = litWorld({
      deployments: { A: { targetId: 'B', role: 'siege' } },
      warPosture: {},
      spatialLedgers: {
        navalTransit: { A: { role: 'blockade', ownerId: 'A', targetId: 'P' } },
        campaignPlans: { C: { targetId: 'D' } },
      },
    });
    const deposits = commitmentDepositsFor(ws);
    const byCourse = new Map(deposits.map((d) => [`${d.actorId}>${d.courseKey}:${d.kind}`, d.magnitude01]));
    expect(byCourse.get('A>war:B:siege')).toBe(MOMENTUM_TUNING.LOUD_SIEGE);
    expect(byCourse.get('A>blockade:P:blockade')).toBe(MOMENTUM_TUNING.LOUD_BLOCKADE);
    expect(byCourse.get('C>campaign:D:campaign')).toBe(MOMENTUM_TUNING.LOUD_CAMPAIGN);
  });

  it('INCITEMENT: rousing your own population (overt high-rung mobilization) deposits MORE than a covert one — the owner\'s scenario', () => {
    const overt = commitmentDepositsFor(litWorld({
      deployments: { A: { targetId: 'B', role: 'siege' } },
      warPosture: { A: { state: 'mobilized', covert: false } },
    })).find((d) => d.kind === 'incitement');
    const covert = commitmentDepositsFor(litWorld({
      deployments: { A: { targetId: 'B', role: 'siege' } },
      warPosture: { A: { state: 'mobilized', covert: true } },
    })).find((d) => d.kind === 'incitement');
    expect(overt).toBeTruthy();
    expect(covert).toBeTruthy();
    expect(/** @type {{magnitude01:number}} */ (overt).magnitude01)
      .toBeGreaterThan(/** @type {{magnitude01:number}} */ (covert).magnitude01);
    // Overt full mobilization is the LOUDEST deposit (>= a live siege).
    expect(/** @type {{magnitude01:number}} */ (overt).magnitude01).toBeGreaterThanOrEqual(MOMENTUM_TUNING.LOUD_SIEGE);
  });

  it('an intervention deposits quieter than a full siege (deniable vs banners in the field)', () => {
    const intv = commitmentDepositsFor(litWorld({ deployments: { A: { targetId: 'B', role: 'intervene' } } }))
      .find((d) => d.kind === 'siege');
    expect(/** @type {{magnitude01:number}} */ (intv).magnitude01).toBe(MOMENTUM_TUNING.LOUD_INTERVENTION);
    expect(MOMENTUM_TUNING.LOUD_INTERVENTION).toBeLessThan(MOMENTUM_TUNING.LOUD_SIEGE);
  });
});

describe('W-MOMENTUM Stage 1 — the fold (credibility discipline, verbatim)', () => {
  const siegeWorld = () => litWorld({ deployments: { A: { targetId: 'B', role: 'siege' } } });

  it('deposits accumulate stock over ticks; the receipts are capped', () => {
    let ws = siegeWorld();
    for (let t = 0; t < 3; t++) ws = /** @type {any} */ (advanceCommitments({ worldState: ws, tick: t }).worldState);
    const ledger = /** @type {Record<string, any>} */ (getSpatialLedger(ws, 'commitments'));
    const entry = ledger['A>war:B'];
    expect(entry.stock).toBeGreaterThan(MOMENTUM_TUNING.LOUD_SIEGE); // >1 deposit accumulated
    expect(Array.isArray(entry.deposits)).toBe(true);
    expect(entry.deposits.length).toBeLessThanOrEqual(MOMENTUM_TUNING.RECEIPT_CAP);
    expect(entry.deposits.length).toBe(3);
  });

  it('the receipt list never exceeds RECEIPT_CAP across many ticks', () => {
    let ws = siegeWorld();
    for (let t = 0; t < MOMENTUM_TUNING.RECEIPT_CAP + 5; t++) ws = /** @type {any} */ (advanceCommitments({ worldState: ws, tick: t }).worldState);
    const entry = /** @type {Record<string, any>} */ (getSpatialLedger(ws, 'commitments'))['A>war:B'];
    expect(entry.deposits.length).toBe(MOMENTUM_TUNING.RECEIPT_CAP);
  });

  it('stock clamps to STOCK_MAX under sustained loud deposits', () => {
    let ws = siegeWorld();
    for (let t = 0; t < 200; t++) ws = /** @type {any} */ (advanceCommitments({ worldState: ws, tick: t }).worldState);
    const entry = /** @type {Record<string, any>} */ (getSpatialLedger(ws, 'commitments'))['A>war:B'];
    expect(entry.stock).toBeLessThanOrEqual(MOMENTUM_TUNING.STOCK_MAX);
    expect(entry.stock).toBeGreaterThan(MOMENTUM_TUNING.STOCK_MAX - 2);
  });

  it('a deposit fold is permutation-independent (id-sorted, clamp-commutative)', () => {
    const deposits = [
      { actorId: 'A', courseKey: 'war:B', kind: 'siege', magnitude01: 0.5 },
      { actorId: 'A', courseKey: 'war:B', kind: 'incitement', magnitude01: 0.8 },
      { actorId: 'C', courseKey: 'campaign:D', kind: 'campaign', magnitude01: 0.4 },
    ];
    const forward = advanceCommitments({ worldState: litWorld(), tick: 1, deposits }).worldState;
    const reversed = advanceCommitments({ worldState: litWorld(), tick: 1, deposits: [...deposits].reverse() }).worldState;
    expect(JSON.stringify(getSpatialLedger(/** @type {any} */ (forward), 'commitments')))
      .toBe(JSON.stringify(getSpatialLedger(/** @type {any} */ (reversed), 'commitments')));
  });

  it('the stock decays by half-life without reinforcement, and prunes when spent (drop-when-empty ⇒ byte-identical-dormant)', () => {
    // Seed one deposit, then advance many empty ticks — the course fades and the ledger drops.
    let ws = /** @type {any} */ (advanceCommitments({
      worldState: litWorld(), tick: 0,
      deposits: [{ actorId: 'A', courseKey: 'war:B', kind: 'siege', magnitude01: 1 }],
    }).worldState);
    const seeded = getSpatialLedger(ws, 'commitments');
    expect(seeded).toBeTruthy();
    // Half-life at HALF_LIFE_TICKS: stock ~halves.
    const halved = decayedCommitmentStock(/** @type {any} */ (seeded)['A>war:B'], MOMENTUM_TUNING.HALF_LIFE_TICKS);
    expect(halved).toBeCloseTo(/** @type {any} */ (seeded)['A>war:B'].stock * 0.5, 4);
    // Advance far past MAX_LOOKBACK with NO new deposits ⇒ the mark is spent ⇒ the whole
    // namespace drops ⇒ byte-identical to a dormant world.
    const spent = advanceCommitments({ worldState: ws, tick: MOMENTUM_TUNING.MAX_LOOKBACK_TICKS + 1, deposits: [] });
    expect(getSpatialLedger(/** @type {any} */ (spent.worldState), 'commitments')).toBeUndefined();
    expect(spent.worldState).not.toHaveProperty('spatialLedgers.commitments');
  });

  it('a fold that changes nothing reports changed:false (serialize-compare)', () => {
    // A world with no deposit sources: the ledger stays null, the fold is a no-op.
    const ws = litWorld();
    const r = advanceCommitments({ worldState: ws, tick: 5, deposits: [] });
    expect(r.changed).toBe(false);
    expect(r.worldState).toBe(ws);
  });
});
