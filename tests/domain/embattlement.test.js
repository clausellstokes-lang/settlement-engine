/**
 * embattlement.test.js — Phase 5.5 mover M1: EMBATTLEMENT ROUTING (the wave's proof).
 *
 * Gates proven here:
 *   - HYSTERESIS never flip-flops on a jitter fixture (enter>X, exit<Y, min dwell);
 *   - the embattlement scalar is a GRADED cost, never a boolean threshold gate
 *     (chooseRoute's danger surcharge is affine in the level scalar);
 *   - risk-tolerance re-score determinism (a danger-reader takes the safe road, a
 *     danger-ignorer the cheap dangerous one — reproducibly);
 *   - candidate-route derivation from the frozen digest gates (the §II.4 cache),
 *     memoized + deterministic — no keystone amendment;
 *   - banditry fork determinism + boundedness (sporadic, non-catastrophic);
 *   - DORMANT byte-identity (no marker ⇒ the advance is a no-op, no ledger);
 *   - a 10-year embattled-border soak stays bounded.
 */
import { describe, expect, it } from 'vitest';
import {
  EMBATTLEMENT_TUNING,
  OCCUPATION_TERM,
  embattlementActive,
  rampThreat,
  stepEmbattlement,
  advanceEmbattlement,
  embattlementLevel,
  riskToleranceFromAlignment,
  scoreRoute,
  chooseRoute,
  banditryLoss,
  occupationTermOf,
} from '../../src/domain/spatial/embattlement.js';
import { candidateRoutes, K_CANDIDATES } from '../../src/domain/spatial/distanceRead.js';

const T = EMBATTLEMENT_TUNING;

// ── A minimal, fully-consistent hand digest: a diamond a—b—d / a—c—d where the
//    b-road is cheaper (the tempting dangerous route) and the c-road longer/safer.
function diamondDigest() {
  return {
    spatialCanonVersion: 1,
    settlementIds: ['a', 'b', 'c', 'd'],
    gates: [
      { between: ['a', 'b'], cost: 100 },
      { between: ['b', 'd'], cost: 100 },
      { between: ['a', 'c'], cost: 120 },
      { between: ['c', 'd'], cost: 120 },
    ],
    distanceMatrix: {
      a: { b: 100, c: 120, d: 200 },
      b: { a: 100, d: 100, c: 220 },
      c: { a: 120, d: 120, b: 220 },
      d: { a: 200, b: 100, c: 120 },
    },
    tiers: {
      a: { b: 1, c: 1, d: 2 },
      b: { a: 1, d: 1, c: 2 },
      c: { a: 1, d: 1, b: 2 },
      d: { b: 1, c: 1, a: 2 },
    },
  };
}

/** A worldState with the given per-settlement embattlement levels (phase embattled). */
function worldWithLevels(levels) {
  /** @type {Record<string, unknown>} */
  const embattlement = {};
  for (const [id, level] of Object.entries(levels)) {
    embattlement[id] = { level, phase: 'embattled', sinceTick: 0, lastTick: 0 };
  }
  return { spatialCanonVersion: 1, spatialLedgers: { embattlement } };
}

/** A tiny deterministic rng exposing the kernel PRNG's `.random()` surface. The
 *  seed is bit-mixed (splitmix-style) so consecutive seeds give well-spread draws. */
function seededRng(seed) {
  let s = (seed >>> 0) || 1;
  s = Math.imul(s ^ (s >>> 16), 2246822507) >>> 0;
  s = Math.imul(s ^ (s >>> 13), 3266489909) >>> 0;
  s = (s ^ (s >>> 16)) >>> 0 || 1;
  return {
    random() {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    },
  };
}

describe('M1 embattlement — the ramp', () => {
  it('an active siege alone clears ENTER even against maximal security', () => {
    const t = rampThreat({ besieged: true, security01: 1 });
    expect(t).toBeGreaterThan(T.ENTER_THRESHOLD);
  });

  it('a fresh (contested) occupation clears ENTER at realistic low security', () => {
    const t = rampThreat({ occupationState: 'contested', security01: 0.2 });
    expect(t).toBeGreaterThan(T.ENTER_THRESHOLD);
    // A settled vassal barely registers.
    expect(rampThreat({ occupationState: 'vassalized', security01: 0.5 })).toBeLessThan(T.EXIT_THRESHOLD);
  });

  it('high crime ALONE never embattles a region (it only sustains)', () => {
    expect(rampThreat({ crime01: 1, security01: 0 })).toBeLessThan(T.ENTER_THRESHOLD);
    // War exhaustion alone likewise sustains, never initiates.
    expect(rampThreat({ warExhaustion01: 1, security01: 0 })).toBeLessThan(T.ENTER_THRESHOLD);
  });

  it('crime below the floor contributes nothing; security relief is capped', () => {
    expect(rampThreat({ crime01: T.CRIME_FLOOR })).toBe(rampThreat({ crime01: 0 }));
    // Even infinite security cannot relieve more than SECURITY_MAX_RELIEF off a siege.
    const siege = rampThreat({ besieged: true, security01: 0 });
    const siegeSecure = rampThreat({ besieged: true, security01: 1 });
    expect(siege - siegeSecure).toBeCloseTo(T.SECURITY_MAX_RELIEF, 10);
  });

  it('occupationTermOf maps the ladder and is 0 for unknown/liberated', () => {
    expect(occupationTermOf('contested')).toBe(OCCUPATION_TERM.contested);
    expect(occupationTermOf('liberated')).toBe(0);
    expect(occupationTermOf(null)).toBe(0);
  });
});

describe('M1 embattlement — hysteresis (the co-built brake) never flip-flops', () => {
  it('a threat jittering INSIDE the deadband never changes phase (from calm)', () => {
    const jitter = [0.44, 0.5, 0.41, 0.49, 0.42, 0.5, 0.4, 0.48, 0.45, 0.5, 0.41, 0.47];
    let prior = null;
    for (let i = 0; i < jitter.length; i++) {
      const rec = stepEmbattlement(prior, jitter[i], i);
      // Deadband [EXIT, ENTER] ⇒ a never-latched region stays calm, level decays to nothing.
      if (rec) expect(rec.phase).toBe('calm');
      prior = rec;
    }
  });

  it('once latched, a threat jittering inside the deadband stays embattled (dwell + deadband)', () => {
    // Latch it with a spike, then jitter inside the band for 20 ticks.
    let rec = stepEmbattlement(null, 0.9, 0);
    expect(rec.phase).toBe('embattled');
    const jitter = [0.5, 0.41, 0.49, 0.42, 0.5, 0.4, 0.48, 0.45, 0.5, 0.41, 0.47, 0.43, 0.5, 0.4, 0.46, 0.44, 0.5, 0.42, 0.48, 0.41];
    for (let i = 0; i < jitter.length; i++) {
      rec = stepEmbattlement(rec, jitter[i], i + 1);
      expect(rec.phase).toBe('embattled'); // never exits (never < EXIT_THRESHOLD)
    }
  });

  it('a threat oscillating ACROSS the enter threshold latches ONCE, never oscillates back', () => {
    // Around ENTER (0.55) but always above EXIT (0.30): enters once, then holds.
    const seq = [0.52, 0.58, 0.53, 0.6, 0.51, 0.57, 0.5, 0.59, 0.52];
    let rec = null;
    let transitions = 0;
    let prevPhase = 'calm';
    for (let i = 0; i < seq.length; i++) {
      rec = stepEmbattlement(rec, seq[i], i);
      if (rec.phase !== prevPhase) { transitions += 1; prevPhase = rec.phase; }
    }
    expect(transitions).toBe(1); // calm → embattled, and never back
    expect(rec.phase).toBe('embattled');
  });

  it('exits only after the minimum dwell, then decays as a continuous scalar', () => {
    let rec = stepEmbattlement(null, 0.9, 0); // latch at tick 0
    // Threat immediately drops below EXIT, but the dwell holds it embattled.
    for (let i = 1; i < T.MIN_DWELL_TICKS; i++) {
      rec = stepEmbattlement(rec, 0, i);
      expect(rec.phase).toBe('embattled');
    }
    rec = stepEmbattlement(rec, 0, T.MIN_DWELL_TICKS); // dwell satisfied ⇒ exits
    expect(rec.phase).toBe('calm');
    const beforeDecay = rec.level;
    rec = stepEmbattlement(rec, 0, T.MIN_DWELL_TICKS + 1);
    expect(rec.level).toBeLessThan(beforeDecay); // decays, doesn't snap to 0
  });
});

describe('M1 embattlement — the scalar is a GRADED cost, never a boolean gate', () => {
  it('chooseRoute danger surcharge is AFFINE in the level scalar (no threshold step)', () => {
    const digest = diamondDigest();
    const cost = (lvl) => chooseRoute(digest, worldWithLevels({ b: lvl }), 'a', 'd', 0.0001).effectiveCost;
    // A danger-ignoring mover (rt≈0) always takes the cheap b-road; its danger
    // surcharge scales LINEARLY with b's level — three points are collinear, so the
    // level is consumed as a continuous slope, never a step at some threshold.
    const p0 = cost(0.2);
    const p1 = cost(0.5);
    const p2 = cost(0.8);
    const slopeA = (p1 - p0) / 0.3;
    const slopeB = (p2 - p1) / 0.3;
    expect(slopeA).toBeCloseTo(slopeB, 6);
    expect(p2).toBeGreaterThan(p0); // more danger ⇒ strictly more cost (monotone)
  });

  it('embattlementLevel is a total 0..1 read (0 when dormant/absent)', () => {
    expect(embattlementLevel(null, 'x')).toBe(0);
    expect(embattlementLevel({}, 'x')).toBe(0);
    expect(embattlementLevel(worldWithLevels({ x: 0.7 }), 'x')).toBeCloseTo(0.7, 10);
  });
});

describe('M1 embattlement — cheap-vs-safe route re-score (risk tolerance)', () => {
  it('derives candidate routes from the frozen gates (primary + safe detour)', () => {
    const digest = diamondDigest();
    const routes = candidateRoutes(digest, 'a', 'd');
    expect(routes.length).toBe(2);
    expect(routes[0]).toEqual({ path: ['a', 'b', 'd'], cost: 200 }); // cheapest
    expect(routes[1]).toEqual({ path: ['a', 'c', 'd'], cost: 240 }); // the detour
    // Memoized: the same pair returns the identical cached array.
    expect(candidateRoutes(digest, 'a', 'd')).toBe(routes);
    // A rebuilt-but-equal digest re-derives the same values (pure function).
    expect(candidateRoutes(diamondDigest(), 'a', 'd')).toEqual(routes);
    expect(K_CANDIDATES).toBeGreaterThanOrEqual(2);
  });

  it('a danger-READING mover takes the safe road; a danger-IGNORING one the cheap dangerous one', () => {
    const digest = diamondDigest();
    const world = worldWithLevels({ b: 0.9 }); // the cheap b-road is embattled
    const reader = chooseRoute(digest, world, 'a', 'd', 1); // lawful/seasoned
    const ignorer = chooseRoute(digest, world, 'a', 'd', 0); // chaotic/rusty
    expect(reader.path).toEqual(['a', 'c', 'd']); // longer, safer
    expect(ignorer.path).toEqual(['a', 'b', 'd']); // cheaper, dangerous
    // Deterministic across repeats.
    expect(chooseRoute(digest, world, 'a', 'd', 1).path).toEqual(reader.path);
  });

  it('risk tolerance derives from settlementAlignment lawfulness (bounded, ordered)', () => {
    const lawful = riskToleranceFromAlignment({ lawfulness01: 1 });
    const chaotic = riskToleranceFromAlignment({ lawfulness01: 0 });
    const neutral = riskToleranceFromAlignment({ lawfulness01: 0.5 });
    expect(lawful).toBeCloseTo(1, 10);
    expect(chaotic).toBeCloseTo(T.RISK_FLOOR, 10);
    expect(neutral).toBeGreaterThan(chaotic);
    expect(neutral).toBeLessThan(lawful);
    expect(riskToleranceFromAlignment(null)).toBeGreaterThanOrEqual(T.RISK_FLOOR);
  });

  it('scoreRoute sums danger over the traversed hops (excludes the origin)', () => {
    const world = worldWithLevels({ a: 0.9, b: 0.5, d: 0.3 });
    const scored = scoreRoute(['a', 'b', 'd'], world, 200, 1, 100);
    expect(scored.danger).toBeCloseTo(0.5 + 0.3, 10); // a (origin) not counted
    expect(scored.effectiveCost).toBeCloseTo(200 + 1 * T.DANGER_PENALTY * 100 * 0.8, 4);
  });

  it('an unreachable / unmapped pair yields no route', () => {
    const digest = diamondDigest();
    expect(chooseRoute(digest, worldWithLevels({}), 'a', 'zzz', 1)).toBeNull();
    expect(candidateRoutes(digest, 'a', 'zzz')).toEqual([]);
  });
});

describe('M1 embattlement — banditry (seeded, sporadic, bounded)', () => {
  it('is deterministic given the forked rng', () => {
    const a = banditryLoss({ channelStrength: 1, dangerLevel: 0.8, rng: seededRng(42) });
    const b = banditryLoss({ channelStrength: 1, dangerLevel: 0.8, rng: seededRng(42) });
    expect(a).toEqual(b);
  });

  it('never fires without danger, and is BOUNDED + non-catastrophic when it does', () => {
    // Danger 0 ⇒ never fires (channel intact).
    for (let s = 1; s <= 50; s++) {
      expect(banditryLoss({ channelStrength: 1, dangerLevel: 0, rng: seededRng(s) }).fired).toBe(false);
    }
    let fires = 0;
    for (let s = 1; s <= 400; s++) {
      const r = banditryLoss({ channelStrength: 1, dangerLevel: 0.9, rng: seededRng(s) });
      if (r.fired) fires += 1;
      expect(r.loss).toBeGreaterThanOrEqual(0);
      expect(r.loss).toBeLessThanOrEqual(T.BANDITRY_MAX_LOSS); // non-catastrophic
      expect(r.delivered).toBeGreaterThanOrEqual(1 - T.BANDITRY_MAX_LOSS);
      expect(r.delivered).toBeLessThanOrEqual(1);
    }
    // Sporadic: most shipments pass even through maximal danger.
    expect(fires / 400).toBeLessThanOrEqual(T.BANDITRY_CHANCE + 0.02);
    expect(fires).toBeGreaterThan(0);
  });
});

describe('M1 embattlement — advance + dormancy', () => {
  it('DORMANT (no spatial marker) ⇒ the advance is a no-op, no ledger materializes', () => {
    expect(embattlementActive({})).toBe(false);
    const out = advanceEmbattlement({ threats: { x: 0.9 }, worldState: {}, tick: 3 });
    expect(out).toEqual({ next: null, changed: false });
    // A pre-existing ledger is PRESERVED untouched off the marker (never deleted).
    const prior = { x: { level: 0.4, phase: 'embattled', sinceTick: 0, lastTick: 0 } };
    const out2 = advanceEmbattlement({ threats: { x: 0.9 }, worldState: { spatialLedgers: { embattlement: prior } }, tick: 3 });
    expect(out2.changed).toBe(false);
    expect(out2.next).toBe(prior);
  });

  it('materializes sparsely (only threatened regions) + is codepoint-ordered', () => {
    const world = { spatialCanonVersion: 1 };
    const out = advanceEmbattlement({ threats: { z: 0.9, a: 0, m: 0.9 }, worldState: world, tick: 0 });
    expect(out.changed).toBe(true);
    expect(Object.keys(out.next)).toEqual(['m', 'z']); // 'a' (calm, no threat) pruned; sorted
    expect(out.next.m.phase).toBe('embattled');
  });

  it('a run that graduates every region back to calm drops the key', () => {
    let world = { spatialCanonVersion: 1 };
    let out = advanceEmbattlement({ threats: { x: 0.9 }, worldState: world, tick: 0 });
    world = { ...world, spatialLedgers: { ...world.spatialLedgers, embattlement: out.next } };
    // Long calm stretch ⇒ dwell satisfied, level decays below MIN_LEVEL ⇒ pruned.
    for (let i = 1; i < 120 && out.next; i++) {
      out = advanceEmbattlement({ threats: { x: 0 }, worldState: world, tick: i });
      world = out.next ? { ...world, spatialLedgers: { ...world.spatialLedgers, embattlement: out.next } } : world;
    }
    expect(out.next).toBeNull(); // the whole ledger drops back to absent
  });

  it('10-year embattled-border soak stays BOUNDED (level ∈ [0,1], phase valid, sparse)', () => {
    let world = { spatialCanonVersion: 1 };
    const ids = ['border_a', 'border_b', 'interior_c'];
    for (let tick = 0; tick < 520; tick++) { // ~10 years of weekly ticks
      // A churning border (siege on/off) + a calm interior.
      const wave = Math.sin(tick / 7);
      const threats = {
        border_a: 0.5 + 0.5 * wave,           // oscillates across the thresholds
        border_b: wave > 0 ? 0.9 : 0.2,        // hard on/off siege
        interior_c: 0.1,                       // never embattled
      };
      const out = advanceEmbattlement({ threats, worldState: world, tick });
      const led = out.next || {};
      for (const id of Object.keys(led)) {
        const rec = led[id];
        expect(rec.level).toBeGreaterThanOrEqual(0);
        expect(rec.level).toBeLessThanOrEqual(1);
        expect(['calm', 'embattled']).toContain(rec.phase);
        expect(ids).toContain(id);
      }
      expect(Object.keys(led).length).toBeLessThanOrEqual(ids.length); // never unbounded
      world = { ...world, spatialLedgers: { ...world.spatialLedgers, embattlement: out.next || undefined } };
    }
  });

  it('is deterministic: the same threat sequence yields byte-identical ledgers', () => {
    const run = () => {
      let world = { spatialCanonVersion: 1 };
      const snaps = [];
      for (let tick = 0; tick < 40; tick++) {
        const out = advanceEmbattlement({ threats: { x: (tick % 5) / 5, y: 0.9 }, worldState: world, tick });
        world = { ...world, spatialLedgers: { ...world.spatialLedgers, embattlement: out.next || undefined } };
        snaps.push(JSON.stringify(out.next ?? null));
      }
      return snaps.join('|');
    };
    expect(run()).toBe(run());
  });
});
