/**
 * traditionsKernel.test.js — THE TRADITIONS mover mechanism pins (ENGINE LIFT #4, T-2).
 *
 * The dormancy byte-identity + the end-to-end lit anti-vacuity live in
 * tests/property/traditionsDormancyGolden.test.js. THIS file pins the mechanisms in
 * isolation, driving the exported advanceTraditions over a PRE-SEEDED ledger (so the
 * window + scale + deity are controlled, not minted): the §3 occurrence window + skip,
 * the §4 success ladder (outcomeForDraw thresholds + successScore monotonicity), the §5
 * write-bounded effects (prosperity band-step / legitimacy score / conservation-preserving
 * faith share), and occurrence idempotency (ONE outcome per tradition per year).
 */
import { describe, it, expect } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  advanceTraditions, successScore, outcomeForDraw, TRADITION_OUTCOME, fairTradePulse,
} from '../../src/domain/worldPulse/traditionsKernel.js';

const NOW = '2026-01-01T00:00:00.000Z';
const SID = 'a';

/** A complete TraditionRec with controllable window/scale/deity/streak. */
function makeRec(o = {}) {
  return {
    id: o.id || 'tradition.ashford.0',
    coreMotif: o.coreMotif || { element: 'harvest', act: 'feast' },
    name: o.name || 'The Harvest Feast',
    foundedYear: o.foundedYear ?? 1,
    window: o.window || { startWeekOfYear: 10, weeks: 1 },
    scaleBand: o.scaleBand ?? 4,
    ownerKey: o.ownerKey ?? null,
    ownerKind: o.ownerKind ?? null,
    deityRef: o.deityRef ?? null,
    expression: o.expression || { trappings: ['bonfires'], epithet: 'kept since the first furrow' },
    mutationLog: o.mutationLog || [],
    lastHeldYear: o.lastHeldYear ?? null,
    lastOutcome: o.lastOutcome ?? null,
    suppressedBy: o.suppressedBy ?? null,
    adoptedFrom: o.adoptedFrom ?? null,
  };
}

/** A settlement with controllable economy / legitimacy / conditions. */
function town(o = {}) {
  return {
    name: 'Ashford', tier: 'city', population: 9000,
    economicState: { prosperity: o.prosperity || 'Comfortable' },
    powerStructure: { publicLegitimacy: { score: o.legit ?? 55 }, factions: [] },
    activeConditions: o.activeConditions || [],
  };
}

/**
 * Run ONE traditions tick over a pre-seeded ledger. `weeks` sets the calendar
 * (seasonForTick(weeks) ⇒ year/weekOfYear); `recs` is the settlement's seeded set.
 */
function runTick({ settlement, recs, rngSeed = 's', weeks = 9, tick = 10, stressors = [], religionStates = null }) {
  // Steady state: the settlement already carries its mirror matching the sidecar, so
  // PASS 2 self-heal is a no-op unless an occurrence changes a record (the real pulse
  // writes both at the mint tick). A test that wants the mint-mirror path omits it.
  const s = { ...settlement, traditions: recs };
  const snapshot = { settlements: [{ id: SID, name: s.name || 'Town', settlement: s }] };
  /** @type {Record<string, unknown>} */
  const worldState = {
    rngSeed, tick,
    calendar: { elapsedWeeks: weeks },
    simulationRules: { traditionsEnabled: true },
    stressors,
    spatialLedgers: { traditions: { [SID]: recs } },
  };
  if (religionStates) worldState.religionStates = religionStates;
  const settlementUpdates = [{ saveId: SID, settlement: s }];
  const res = advanceTraditions({ snapshot, worldState, settlementUpdates, tick, now: NOW });
  const ledgers = res.worldState?.spatialLedgers?.traditions || {};
  return {
    res,
    ledger: ledgers[SID],
    updated: res.settlementUpdates.find((u) => String(u.saveId) === SID)?.settlement,
    religionStates: res.worldState?.religionStates,
    news: res.newsEntries,
  };
}

/** Find an rngSeed whose (score, draw) resolves the given outcome for a rec/settlement. */
function findSeed(wantOutcome, rec, settlement, year = 1) {
  for (let i = 0; i < 800; i += 1) {
    const rngSeed = `seek-${i}`;
    const score = successScore({ rec, settlement, worldState: { rngSeed }, sid: SID, year, warTypes: new Set() });
    const r = createPRNG(`${rngSeed}::tradition:${rec.id}:${year}`).random();
    if (outcomeForDraw(score, r) === wantOutcome) return rngSeed;
  }
  throw new Error(`no seed produced ${wantOutcome}`);
}

describe('§4 outcomeForDraw — the threshold ladder (a lower draw is a better festival)', () => {
  const s = 0.55;
  it('maps each band exactly', () => {
    expect(outcomeForDraw(s, s - 0.25 - 0.01)).toBe(TRADITION_OUTCOME.TRIUMPH); // r < score−0.25
    expect(outcomeForDraw(s, s - 0.10)).toBe(TRADITION_OUTCOME.GOOD); // score−0.25 ≤ r < score
    expect(outcomeForDraw(s, s + 0.10)).toBe(TRADITION_OUTCOME.MODEST); // score ≤ r < score+0.15
    expect(outcomeForDraw(s, s + 0.20)).toBe(TRADITION_OUTCOME.TROUBLED); // score+0.15 ≤ r < score+0.30
    expect(outcomeForDraw(s, s + 0.50)).toBe(TRADITION_OUTCOME.FAILURE); // r ≥ score+0.30
  });
});

describe('§4 successScore — the weighting moves in the designed directions', () => {
  const rec = makeRec({ scaleBand: 3 });
  const base = { rec, worldState: { rngSeed: 'fixed' }, sid: SID, year: 1, warTypes: new Set() };
  it('prosperity lifts the score (Wealthy > Subsistence)', () => {
    const hi = successScore({ ...base, settlement: town({ prosperity: 'Wealthy' }) });
    const lo = successScore({ ...base, settlement: town({ prosperity: 'Poor' }) });
    expect(hi).toBeGreaterThan(lo);
  });
  it('a scale-vs-means mismatch sinks the score', () => {
    const grand = makeRec({ scaleBand: 6 });
    const matched = makeRec({ scaleBand: 2 });
    const s1 = successScore({ ...base, rec: grand, settlement: town({ prosperity: 'Poor' }) });
    const s2 = successScore({ ...base, rec: matched, settlement: town({ prosperity: 'Poor' }) });
    expect(s1).toBeLessThan(s2);
  });
  it('a failure streak sinks; a triumph streak lifts', () => {
    const settlement = town({ prosperity: 'Comfortable' });
    const failStreak = successScore({ ...base, rec: makeRec({ scaleBand: 3, lastOutcome: 'failure' }), settlement });
    const clean = successScore({ ...base, rec: makeRec({ scaleBand: 3 }), settlement });
    const triumphStreak = successScore({ ...base, rec: makeRec({ scaleBand: 3, lastOutcome: 'triumph' }), settlement });
    expect(failStreak).toBeLessThan(clean);
    expect(triumphStreak).toBeGreaterThan(clean);
  });
  it('a wartime stressor penalizes; the score stays clamped in [0.05, 0.95]', () => {
    const settlement = town({ prosperity: 'Wealthy' });
    const peace = successScore({ ...base, settlement });
    const war = successScore({ ...base, settlement, warTypes: new Set(['wartime']) });
    expect(war).toBeLessThan(peace);
    expect(peace).toBeLessThanOrEqual(0.95);
    expect(successScore({ ...base, rec: makeRec({ scaleBand: 6 }), settlement: town({ prosperity: 'Subsistence' }) })).toBeGreaterThanOrEqual(0.05);
  });
});

describe('§3 occurrence — the calendar window', () => {
  it('does NOT fire outside the window (same refs, changed=false)', () => {
    const recs = [makeRec({ window: { startWeekOfYear: 10, weeks: 1 } })];
    const out = runTick({ settlement: town(), recs, weeks: 5 }); // week 5 ≠ window 10
    expect(out.res.changed).toBe(false);
    expect(out.ledger[0].lastHeldYear).toBe(null);
  });
  it('fires when the window opens and lastHeldYear < year — stamps outcome + lastHeldYear', () => {
    const recs = [makeRec({ window: { startWeekOfYear: 10, weeks: 1 } })];
    const out = runTick({ settlement: town(), recs, weeks: 9 }); // week 10, year 1
    expect(out.res.changed).toBe(true);
    expect(out.ledger[0].lastHeldYear).toBe(1);
    expect(['triumph', 'good', 'modest', 'troubled', 'failure']).toContain(out.ledger[0].lastOutcome);
    expect(out.news.length).toBeGreaterThan(0);
    expect(out.news[0].impactKind).toBe('tradition');
  });
  it('a two-week window fires on either of its weeks', () => {
    const recs = [makeRec({ window: { startWeekOfYear: 10, weeks: 2 } })];
    const w10 = runTick({ settlement: town(), recs, weeks: 9 });
    const w11 = runTick({ settlement: town(), recs, weeks: 10 });
    expect(w10.ledger[0].lastHeldYear).toBe(1);
    expect(w11.ledger[0].lastHeldYear).toBe(1);
  });
});

describe('§3 skip — hard stress / desperate economy ⇒ CANCELLED', () => {
  it('a desperate economy (Subsistence) cancels the observance', () => {
    const recs = [makeRec()];
    const out = runTick({ settlement: town({ prosperity: 'Subsistence', legit: 50 }), recs, weeks: 9 });
    expect(out.ledger[0].lastOutcome).toBe(TRADITION_OUTCOME.CANCELLED);
    // §5: cancelled costs the seat 1 legitimacy (the interim rule until T-3 owners).
    expect(out.updated.powerStructure.publicLegitimacy.score).toBe(49);
  });
  it('a hard per-settlement stressor (plague) cancels', () => {
    const recs = [makeRec()];
    const plague = [{ id: 'condition.plague.x', archetype: 'plague', label: 'Plague', severity: 0.8 }];
    const out = runTick({ settlement: town({ activeConditions: plague }), recs, weeks: 9 });
    expect(out.ledger[0].lastOutcome).toBe(TRADITION_OUTCOME.CANCELLED);
  });
  it('a realm siege stressor affecting the settlement cancels', () => {
    const recs = [makeRec()];
    const siege = [{ type: 'siege', lifecycleStage: 'active', affectedSettlementIds: [SID] }];
    const out = runTick({ settlement: town(), recs, weeks: 9, stressors: siege });
    expect(out.ledger[0].lastOutcome).toBe(TRADITION_OUTCOME.CANCELLED);
  });
});

describe('§5 effects — write-bounded economy + legitimacy', () => {
  it('a TRIUMPH steps prosperity +1 and legitimacy +3', () => {
    const rec = makeRec({ scaleBand: 4 });
    const settlement = town({ prosperity: 'Comfortable', legit: 55 }); // rank 4
    const seed = findSeed(TRADITION_OUTCOME.TRIUMPH, rec, settlement);
    const out = runTick({ settlement, recs: [rec], rngSeed: seed, weeks: 9 });
    expect(out.ledger[0].lastOutcome).toBe(TRADITION_OUTCOME.TRIUMPH);
    expect(out.updated.economicState.prosperity).toBe('Prosperous'); // 4 → 5
    expect(out.updated.powerStructure.publicLegitimacy.score).toBe(58); // 55 → 58
  });
  it('a FAILURE steps prosperity −1 and legitimacy −3', () => {
    const rec = makeRec({ scaleBand: 4 });
    const settlement = town({ prosperity: 'Comfortable', legit: 55 });
    const seed = findSeed(TRADITION_OUTCOME.FAILURE, rec, settlement);
    const out = runTick({ settlement, recs: [rec], rngSeed: seed, weeks: 9 });
    expect(out.ledger[0].lastOutcome).toBe(TRADITION_OUTCOME.FAILURE);
    expect(out.updated.economicState.prosperity).toBe('Moderate'); // 4 → 3
    expect(out.updated.powerStructure.publicLegitimacy.score).toBe(52); // 55 → 52
  });
});

describe('content/voice — tradition beat reasons stay in house voice (content-2)', () => {
  it('no design-doc § reference or mechanism jargon reaches a user-facing beat reason', () => {
    const cancelled = runTick({ settlement: town({ prosperity: 'Subsistence', legit: 50 }), recs: [makeRec()], weeks: 9 });
    const rec = makeRec({ scaleBand: 4 });
    const stlm = town({ prosperity: 'Comfortable', legit: 55 });
    const seed = findSeed(TRADITION_OUTCOME.TRIUMPH, rec, stlm);
    const triumph = runTick({ settlement: stlm, recs: [rec], rngSeed: seed, weeks: 9 });

    const reasons = [...(cancelled.news || []), ...(triumph.news || [])].flatMap((n) => n.reasons || []);
    expect(reasons.length).toBeGreaterThan(0);
    for (const r of reasons) {
      expect(r).not.toMatch(/§/);
      expect(r.toLowerCase()).not.toMatch(/success roll|half weight|notable floor|rumor net|applicator/);
    }
  });
});

describe('§16 (Wave C) — the fair trade-lane pulse', () => {
  const fairRec = (o = {}) => makeRec({ id: 'tradition.ashford.fair', coreMotif: { element: 'harvest', act: 'fair' }, name: 'The Harvest Fair', scaleBand: 4, ...o });
  const onRoute = (route) => ({ ...town({ prosperity: 'Comfortable', legit: 55 }), config: { tradeRouteAccess: route } });

  it('fairTradePulse: a fair GOOD-or-better on a trade lane earns +1; else 0', () => {
    const fair = fairRec();
    const feast = makeRec({ coreMotif: { element: 'harvest', act: 'feast' } });
    // fires: fair, GOOD-or-better, connective route (major crossroads / standard road)
    expect(fairTradePulse(fair, onRoute('crossroads'), TRADITION_OUTCOME.TRIUMPH)).toBe(1);
    expect(fairTradePulse(fair, onRoute('road'), TRADITION_OUTCOME.GOOD)).toBe(1);
    // does NOT fire: modest/troubled/failure, isolated route, non-fair act, no route
    expect(fairTradePulse(fair, onRoute('road'), TRADITION_OUTCOME.MODEST)).toBe(0);
    expect(fairTradePulse(fair, onRoute('isolated'), TRADITION_OUTCOME.TRIUMPH)).toBe(0);
    expect(fairTradePulse(feast, onRoute('road'), TRADITION_OUTCOME.TRIUMPH)).toBe(0);
    expect(fairTradePulse(fair, town({}), TRADITION_OUTCOME.TRIUMPH)).toBe(0); // no config ⇒ no lane
  });

  it('a fair TRIUMPH on a trade lane steps prosperity +2 (standard +1 AND the trade pulse +1)', () => {
    const rec = fairRec();
    const settlement = onRoute('road');
    const seed = findSeed(TRADITION_OUTCOME.TRIUMPH, rec, settlement);
    const out = runTick({ settlement, recs: [rec], rngSeed: seed, weeks: 9 });
    expect(out.ledger[0].lastOutcome).toBe(TRADITION_OUTCOME.TRIUMPH);
    expect(out.updated.economicState.prosperity).toBe('Wealthy'); // rank 4 → 6 (Comfortable → Wealthy)
  });

  it('a fair GOOD on a trade lane steps prosperity +1 (the trade pulse alone; GOOD normally 0)', () => {
    const rec = fairRec();
    const settlement = onRoute('crossroads');
    const seed = findSeed(TRADITION_OUTCOME.GOOD, rec, settlement);
    const out = runTick({ settlement, recs: [rec], rngSeed: seed, weeks: 9 });
    expect(out.ledger[0].lastOutcome).toBe(TRADITION_OUTCOME.GOOD);
    expect(out.updated.economicState.prosperity).toBe('Prosperous'); // rank 4 → 5
  });

  it('BYTE-IDENTITY: an ISOLATED fair triumph steps prosperity +1 only (no trade lane)', () => {
    const rec = fairRec();
    const settlement = onRoute('isolated');
    const seed = findSeed(TRADITION_OUTCOME.TRIUMPH, rec, settlement);
    const out = runTick({ settlement, recs: [rec], rngSeed: seed, weeks: 9 });
    expect(out.ledger[0].lastOutcome).toBe(TRADITION_OUTCOME.TRIUMPH);
    expect(out.updated.economicState.prosperity).toBe('Prosperous'); // 4 → 5 (the standard step only)
  });
});

describe('§5 effects — conservation-preserving faith share', () => {
  it('a deity-flavored TRIUMPH shifts one share point patron↑ / largest-other↓ (sum preserved)', () => {
    const rec = makeRec({ scaleBand: 4, deityRef: 'deity.dawn' });
    const settlement = town({ prosperity: 'Comfortable' });
    const religion = { [SID]: { deities: { 'deity.dawn': { share: 60, standing: 'ascendant' }, 'deity.dusk': { share: 40, standing: 'established' } } } };
    const seed = findSeed(TRADITION_OUTCOME.TRIUMPH, rec, settlement);
    const out = runTick({ settlement, recs: [rec], rngSeed: seed, weeks: 9, religionStates: religion });
    const deities = out.religionStates[SID].deities;
    expect(deities['deity.dawn'].share).toBe(61);
    expect(deities['deity.dusk'].share).toBe(39);
    expect(deities['deity.dawn'].share + deities['deity.dusk'].share).toBe(100); // conserved
  });
  it('a single-deity pantheon cannot conserve a nudge ⇒ no faith change', () => {
    const rec = makeRec({ scaleBand: 4, deityRef: 'deity.dawn' });
    const settlement = town({ prosperity: 'Comfortable' });
    const religion = { [SID]: { deities: { 'deity.dawn': { share: 100, standing: 'ascendant' } } } };
    const seed = findSeed(TRADITION_OUTCOME.TRIUMPH, rec, settlement);
    const out = runTick({ settlement, recs: [rec], rngSeed: seed, weeks: 9, religionStates: religion });
    expect(out.religionStates[SID].deities['deity.dawn'].share).toBe(100); // untouched
  });
});

describe('§3 idempotency — ONE outcome per tradition per year', () => {
  it('a second tick in the same window/year does NOT re-resolve (changed=false, ledger stable)', () => {
    const rec = makeRec({ window: { startWeekOfYear: 10, weeks: 1 } });
    const first = runTick({ settlement: town(), recs: [rec], weeks: 9, rngSeed: 'idem' });
    expect(first.res.changed).toBe(true);
    const stampedYear = first.ledger[0].lastHeldYear;
    const stampedOutcome = first.ledger[0].lastOutcome;
    // Re-run at the same week/year, carrying the stamped ledger forward.
    const second = runTick({ settlement: town(), recs: first.ledger, weeks: 9, rngSeed: 'idem' });
    expect(second.res.changed).toBe(false);
    expect(second.news.length).toBe(0);
    expect(second.ledger[0].lastHeldYear).toBe(stampedYear);
    expect(second.ledger[0].lastOutcome).toBe(stampedOutcome);
  });
  it('the NEXT year re-opens the window (a fresh outcome)', () => {
    const rec = makeRec({ window: { startWeekOfYear: 10, weeks: 1 } });
    const y1 = runTick({ settlement: town(), recs: [rec], weeks: 9, rngSeed: 'yr' });
    expect(y1.ledger[0].lastHeldYear).toBe(1);
    // Year 2, same week-of-year: elapsedWeeks 10 + 52 = 62.
    const y2 = runTick({ settlement: town(), recs: y1.ledger, weeks: 61, rngSeed: 'yr' });
    expect(y2.res.changed).toBe(true);
    expect(y2.ledger[0].lastHeldYear).toBe(2);
  });
});
