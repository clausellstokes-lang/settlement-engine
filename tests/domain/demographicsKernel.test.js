/**
 * demographicsKernel.test.js — WAVE P1, THE STEP, THE SEAM, AND THE DORMANCY FENCE.
 *
 * The cure pin itself (the 300-year plateau and its reverted negative control) lives in
 * tests/domain/demographicsCure.test.js, which needs a module mock this file must not
 * carry. Everything else about the step is here:
 *
 *   • DORMANCY BY OBJECT IDENTITY. Not a deep-equal: the SAME references back, so a
 *     wired-but-dark engine cannot allocate, let alone write. Plus a FENCED golden over
 *     a multi-tick lifecycle-lit / demographics-dark run, so a future edit that starts
 *     writing under dark reds even if it happens to preserve identity at the seam.
 *   • THE SEAM. The demographic step runs at settlementLifecycleKernel and is gated by
 *     its OWN flag, so it neither inherits nor is blocked by the lifecycle switch.
 *   • SEED-FAMILY DETERMINISM. Never a single seed: a whole family, two passes each.
 *   • DRAW ACCOUNTING. Exactly two draws per stepping settlement on its own keyed
 *     fork, zero for a skipped one, and zero ambient Math.random anywhere.
 *   • THE H3 FLOOR. A town reduced to its cast never buries a named soul.
 *   • THE RECEIPT. It names every term, in prose, and survives a JSON round trip.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';
import { advanceDemographics } from '../../src/domain/worldPulse/demographicsKernel.js';
import { advanceSettlementLifecycle } from '../../src/domain/worldPulse/settlementLifecycleKernel.js';
import {
  densityCeilingOf, effectiveBoundOf, foodCapacityOf,
} from '../../src/domain/worldPulse/demographicsRates.js';
import { residentNamedNpcCount } from '../../src/domain/worldPulse/npcReplacement.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// ── Fixtures ─────────────────────────────────────────────────────────────────
function place({
  id = 'Ashford', tier = 'town', terrain = 'plains', population = 1200,
  dailyProduction = 6000, importDependency = 0.2, deficitPct = 0, named = 0,
} = {}) {
  return {
    population,
    tier,
    name: id,
    config: { tier, terrainType: terrain },
    economicState: {
      foodSecurity: {
        dailyNeed: population * 2,
        dailyProduction,
        deficitPct,
        surplusPct: 5,
        importDependency,
        storageMonths: 6,
        resilienceScore: 60,
      },
    },
    npcs: Array.from({ length: named }, (_, i) => ({ id: `${id}_npc_${i}` })),
  };
}

/** The realm the fence and the determinism family both drive. */
const REALM = Object.freeze([
  ['Ashford', { tier: 'town', terrain: 'plains', population: 1200, dailyProduction: 6000 }],
  ['Brackwater', { tier: 'hamlet', terrain: 'riverside', population: 320, dailyProduction: 1600 }],
  ['Cairnhold', { tier: 'thorp', terrain: 'mountain', population: 40, dailyProduction: 300 }],
  ['Dunmarch', { tier: 'city', terrain: 'hills', population: 7000, dailyProduction: 30000 }],
  ['Elderfen', { tier: 'village', terrain: 'forest', population: 700, dailyProduction: 2600 }],
  ['Fallowmere', { tier: 'metropolis', terrain: 'coastal', population: 30000, dailyProduction: 130000 }],
]);

const realmUpdates = () => REALM.map(([id, spec]) => ({ saveId: id, settlement: place({ id, ...spec }) }));
const snapshotOf = (updates) => ({
  settlements: updates.map((u) => ({ id: u.saveId, name: u.saveId, settlement: u.settlement })),
});
const LIT = { simulationRules: { demographicsEnabled: true } };
const DARK = { simulationRules: {} };

/** Run the kernel forward `ticks` ticks on one seed. Returns the final updates. */
function run({ seed, ticks, worldState, updates = realmUpdates() }) {
  let live = updates;
  /** @type {Array<object>} */
  const receipts = [];
  for (let t = 1; t <= ticks; t += 1) {
    const rng = createPRNG(`${seed}::tick:${t}::one_week`);
    const r = advanceDemographics({
      snapshot: snapshotOf(live), worldState, settlementUpdates: live, rng, tick: t,
    });
    live = r.settlementUpdates;
    receipts.push(...r.receipts);
  }
  return { live, receipts };
}

const popsOf = (updates) => updates.map((u) => `${u.saveId}:${u.settlement.population}`).join('|');
const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);

// ═══════════════════════════════════════════════════════════════════════════════
describe('DORMANCY — dark is a no-op by OBJECT IDENTITY, not by deep equality', () => {
  test('the kernel hands back the SAME worldState and settlementUpdates references', () => {
    const updates = realmUpdates();
    const snapshot = snapshotOf(updates);
    const worldState = { simulationRules: {}, spatialLedgers: { satellites: {} } };
    const r = advanceDemographics({
      snapshot, worldState, settlementUpdates: updates, rng: createPRNG('any'), tick: 9,
    });
    expect(r.worldState === worldState, 'worldState must be the SAME object, not an equal copy').toBe(true);
    expect(r.settlementUpdates === updates, 'settlementUpdates must be the SAME array').toBe(true);
    expect(r.changed).toBe(false);
    expect(r.receipts).toEqual([]);
    expect(r.newsEntries).toEqual([]);
    // And the settlement objects themselves are untouched by identity.
    expect(r.settlementUpdates[0] === updates[0]).toBe(true);
    expect(r.settlementUpdates[0].settlement === updates[0].settlement).toBe(true);
  });

  test('the LIFECYCLE HOST seam is dark-transparent by identity too', () => {
    const updates = realmUpdates();
    const worldState = { simulationRules: {} };
    const r = advanceSettlementLifecycle({
      snapshot: snapshotOf(updates), worldState, settlementUpdates: updates,
      pIndex: null, rng: createPRNG('any'), tick: 4, now: null,
    });
    expect(r.worldState === worldState).toBe(true);
    expect(r.settlementUpdates === updates).toBe(true);
    expect(r.changed).toBe(false);
    expect(r.receipts).toEqual([]);
  });

  test('NEGATIVE CONTROL for the identity pins: lit, the SAME call allocates and writes', () => {
    // Without this control the two assertions above would pass just as well against a
    // function that never does anything at all.
    const updates = realmUpdates();
    const r = advanceDemographics({
      snapshot: snapshotOf(updates), worldState: LIT, settlementUpdates: updates,
      rng: createPRNG('seed-a::tick:1::one_week'), tick: 1,
    });
    expect(r.settlementUpdates === updates, 'lit, the array must be a fresh clone').toBe(false);
    expect(r.changed).toBe(true);
    expect(r.receipts.length).toBeGreaterThan(0);
  });

  test('THE FENCED DORMANCY GOLDEN: eight ticks of the LIT lifecycle lane with demographics DARK', () => {
    // FENCED, and the fence value is EXECUTED EVIDENCE rather than a recording of
    // whatever the code happened to do. At authoring time (2026-08-01, wave P1) the
    // PRE-WIRE kernel was extracted read-only from HEAD (`git show HEAD:...`) and this
    // exact eight-tick fixture was run through BOTH it and the wired version:
    //     PRE-WIRE   2b2d754f4aed09fd
    //     POST-WIRE  2b2d754f4aed09fd
    // So this literal is the pre-wire output, not a post-hoc snapshot of the new code.
    // It fences the WHOLE host advance, not just the seam: the satellite lane, the
    // peakTier stamp and the tributary all ride in it while the demographic step is
    // dormant. Do NOT re-record it to make a red go away. A move here means either the
    // demographic step started writing behind its own dark flag (a defect) or the
    // settlement-lifecycle lane changed for its own documented reason (state the cause,
    // then re-record).
    const FROZEN = '2b2d754f4aed09fd';
    let live = realmUpdates();
    let worldState = { simulationRules: { settlementLifecycleEnabled: true } };
    const trace = [];
    for (let t = 1; t <= 8; t += 1) {
      const r = advanceSettlementLifecycle({
        snapshot: snapshotOf(live), worldState, settlementUpdates: live,
        pIndex: null, rng: createPRNG(`fence::tick:${t}::one_week`), tick: t, now: null,
      });
      live = r.settlementUpdates;
      worldState = r.worldState;
      trace.push({ tick: t, changed: r.changed, receipts: r.receipts, pops: popsOf(live) });
    }
    expect(sha({ trace, worldState })).toBe(FROZEN);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('THE SEAM — one flag each, and neither inherits the other', () => {
  test('demographics LIT with the lifecycle lane DARK still steps, and receipts ride out', () => {
    const updates = realmUpdates();
    const r = advanceSettlementLifecycle({
      snapshot: snapshotOf(updates),
      worldState: { simulationRules: { demographicsEnabled: true } },
      settlementUpdates: updates, pIndex: null,
      rng: createPRNG('seed-a::tick:1::one_week'), tick: 1, now: null,
    });
    expect(r.receipts.length).toBeGreaterThan(0);
    expect(r.receipts.every((x) => x.kind === 'demographic_step')).toBe(true);
  });

  test('BOTH lit: the demographic receipts survive alongside the satellite lane receipts', () => {
    const updates = realmUpdates();
    const r = advanceSettlementLifecycle({
      snapshot: snapshotOf(updates),
      worldState: { simulationRules: { demographicsEnabled: true, settlementLifecycleEnabled: true } },
      settlementUpdates: updates, pIndex: null,
      rng: createPRNG('seed-a::tick:1::one_week'), tick: 1, now: null,
    });
    const demographic = r.receipts.filter((x) => x.kind === 'demographic_step');
    expect(demographic.length).toBeGreaterThan(0);
    expect(r.changed).toBe(true);
    // The population write reached the host's own settlementUpdates, not a copy left behind.
    const moved = r.settlementUpdates.some((u, i) => u.settlement.population !== updates[i].settlement.population);
    expect(moved).toBe(true);
  });

  test('THE RAW GROWTH LINE IS REPLACED: populationDynamics mints no growth candidate when lit', async () => {
    const { evaluatePopulationDynamics } = await import('../../src/domain/worldPulse/populationDynamics.js');
    const items = REALM.map(([id, spec]) => ({
      id, name: id, settlement: place({ id, ...spec }), activeConditions: [],
    }));
    const snapshot = { settlements: items, regionalGraph: { edges: [] } };
    // A pressure index of nothing is the prosperous world: stability 1, the biggest
    // positive rate the lane can produce. This is the exact line that compounded.
    const pIndex = { get: () => undefined };

    const dark = evaluatePopulationDynamics(snapshot, pIndex, {
      tick: 1, interval: 'one_year', simulationRules: { populationDynamicsEnabled: true },
    });
    const grewDark = dark.filter((c) => c.candidateType === 'population_growth');
    expect(grewDark.length, 'the control must actually produce growth, or the pin below is vacuous')
      .toBeGreaterThan(0);

    const lit = evaluatePopulationDynamics(snapshot, pIndex, {
      tick: 1, interval: 'one_year',
      simulationRules: { populationDynamicsEnabled: true, demographicsEnabled: true },
    });
    expect(lit.filter((c) => c.candidateType === 'population_growth').length).toBe(0);
  });

  test('only the GROWTH side is replaced: decline and emigration still ride their own lane', async () => {
    const { evaluatePopulationDynamics } = await import('../../src/domain/worldPulse/populationDynamics.js');
    const items = REALM.map(([id, spec]) => ({
      id, name: id, settlement: place({ id, ...spec }),
      activeConditions: [{ archetype: 'famine', severity: 0.9 }],
    }));
    const snapshot = { settlements: items, regionalGraph: { edges: [] } };
    const pIndex = { get: () => ({ score: 0.9 }) };
    const lit = evaluatePopulationDynamics(snapshot, pIndex, {
      tick: 1, interval: 'one_year',
      simulationRules: { populationDynamicsEnabled: true, demographicsEnabled: true, migrationFlowsEnabled: false },
    });
    const shrinking = lit.filter((c) => c.metadata.populationKind !== 'growth');
    expect(shrinking.length, 'the decline lane is UNCHANGED in P1 and must still fire').toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('DETERMINISM — a seed family, two passes each, never a single seed', () => {
  const SEED_FAMILY = Object.freeze(['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel']);

  test('every seed in the family replays byte-identically on a second pass', () => {
    const failures = collectSeedFailures(SEED_FAMILY, (seed) => {
      const a = run({ seed, ticks: 40, worldState: LIT });
      const b = run({ seed, ticks: 40, worldState: LIT });
      expect(popsOf(a.live)).toBe(popsOf(b.live));
      expect(sha(a.receipts)).toBe(sha(b.receipts));
    });
    expectNoSeedFailures(failures, 'the demographic step replays exactly for every seed in the family');
  });

  test('the family is not degenerate: different seeds reach different worlds', () => {
    const outcomes = new Set(SEED_FAMILY.map((seed) => popsOf(run({ seed, ticks: 40, worldState: LIT }).live)));
    // A restriction pinned on ONE seed is vacuous; a family that all lands on the same
    // number means the fork key is not reading the seed at all.
    expect(outcomes.size, 'every seed produced the same realm: the fork is not seeded').toBeGreaterThan(1);
  });

  test('a settlement is not correlated with its neighbours: each rides its OWN keyed fork', () => {
    const twins = [
      { saveId: 'Aaa', settlement: place({ id: 'Aaa', population: 1200 }) },
      { saveId: 'Bbb', settlement: place({ id: 'Bbb', population: 1200 }) },
    ];
    const { live } = run({ seed: 'twin', ticks: 300, worldState: LIT, updates: twins });
    expect(live[0].settlement.population === live[1].settlement.population,
      'two identical settlements drew the SAME stream: the fork key is not per-settlement').toBe(false);
  });

  test('STRUCTURAL PURITY SCAN: neither leaf reaches for a clock, a locale, or ambient randomness', () => {
    // A double-pass equality is blind to state whose period matches the pass count, so
    // purity is scanned at SOURCE as well as measured at runtime.
    for (const rel of [
      'src/domain/worldPulse/demographicsKernel.js',
      'src/domain/worldPulse/demographicsRates.js',
    ]) {
      const src = readFileSync(join(ROOT, rel), 'utf8');
      expect(src.length, `${rel} read empty`).toBeGreaterThan(0);
      const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      for (const banned of ['Math.random', 'Date.now', 'new Date', 'toLocaleString', 'localeCompare', 'unseededRandom']) {
        expect(code.includes(banned), `${rel} reaches for ${banned}`).toBe(false);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('DRAW ACCOUNTING — one keyed fork, exactly two draws, no ambient randomness', () => {
  function countingRng() {
    const forks = [];
    const draws = [];
    return {
      forks,
      draws,
      fork: (key) => {
        forks.push(key);
        return { random: () => { draws.push(key); return 0.5; } };
      },
    };
  }

  test('each stepping settlement forks exactly once, on the design key, and draws exactly twice', () => {
    const updates = realmUpdates();
    const rng = countingRng();
    advanceDemographics({
      snapshot: snapshotOf(updates), worldState: LIT, settlementUpdates: updates, rng, tick: 7,
    });
    expect(rng.forks).toEqual(REALM.map(([id]) => `demographics:${id}`));
    expect(rng.draws.length, 'births then deaths, and nothing else').toBe(REALM.length * 2);
    for (const [id] of REALM) {
      expect(rng.draws.filter((k) => k === `demographics:${id}`).length).toBe(2);
    }
  });

  test('a settlement the step skips spends NO stream, and cannot move its neighbours', () => {
    const updates = [
      { saveId: 'Empty', settlement: place({ id: 'Empty', population: 0 }) },
      { saveId: 'Ruined', settlement: { ...place({ id: 'Ruined', population: 900 }), lifecycleStatus: 'remnant' } },
      { saveId: 'Alive', settlement: place({ id: 'Alive', population: 1200 }) },
    ];
    const rng = countingRng();
    advanceDemographics({
      snapshot: snapshotOf(updates), worldState: LIT, settlementUpdates: updates, rng, tick: 7,
    });
    expect(rng.forks).toEqual(['demographics:Alive']);
    expect(rng.draws.length).toBe(2);
  });

  test('the kernel never reaches for an ambient PRNG, even with no rng supplied at all', () => {
    const real = Math.random;
    let ambient = 0;
    Math.random = () => { ambient += 1; return real(); };
    try {
      const updates = realmUpdates();
      advanceDemographics({
        snapshot: snapshotOf(updates), worldState: LIT, settlementUpdates: updates, rng: null, tick: 3,
      });
      run({ seed: 'ambient', ticks: 20, worldState: LIT });
    } finally {
      Math.random = real;
    }
    expect(ambient, 'a draw here would shift every seeded stream downstream').toBe(0);
  });

  test('an rng-less call is TOTAL and conservative: it floors both terms rather than rounding up', () => {
    const updates = [{ saveId: 'Ashford', settlement: place({ population: 1200 }) }];
    const r = advanceDemographics({
      snapshot: snapshotOf(updates), worldState: LIT, settlementUpdates: updates, rng: null, tick: 3,
    });
    // 1200 * 0.00085 = 1.02 births, 1200 * 0.0006 = 0.72 deaths: floors are 1 and 0.
    expect(r.receipts[0].births).toBe(1);
    expect(r.receipts[0].deaths).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('J-P2 — natural mortality has no off switch, measured on the happiest town', () => {
  test('a zero-pressure prosperous settlement buries somebody in EVERY window', () => {
    // Prosperous: fields far beyond its need, no deficit, plenty of ground. Pressure is
    // low enough that neither the strain nor the deficit term contributes anything, so
    // any death observed here comes from the floor and nowhere else.
    const rich = place({ id: 'Paradise', population: 2000, dailyProduction: 90000, deficitPct: 0 });
    const bound = effectiveBoundOf(foodCapacityOf(rich, LIT, 'Paradise'), densityCeilingOf(rich));
    expect(2000 / bound.bound, 'the fixture must be genuinely uncrowded').toBeLessThan(0.5);

    const WINDOW = 52;
    const failures = collectSeedFailures(['w1', 'w2', 'w3', 'w4', 'w5', 'w6'], (seed) => {
      let live = [{ saveId: 'Paradise', settlement: rich }];
      for (let w = 0; w < 6; w += 1) {
        let buried = 0;
        for (let i = 1; i <= WINDOW; i += 1) {
          const t = w * WINDOW + i;
          const r = advanceDemographics({
            snapshot: snapshotOf(live), worldState: LIT, settlementUpdates: live,
            rng: createPRNG(`${seed}::tick:${t}::one_week`), tick: t,
          });
          live = r.settlementUpdates;
          buried += r.receipts.reduce((sum, x) => sum + x.deaths, 0);
        }
        expect(buried, `seed ${seed} window ${w}: nobody died in a whole year`).toBeGreaterThan(0);
      }
    });
    expectNoSeedFailures(failures, 'even paradise ages: every yearly window buries somebody');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('THE H3 FLOOR — the engine starves the number, never the cast (law 3)', () => {
  test('a settlement already at its cast count never falls below it, however hard it starves', () => {
    // Head count equals the named cast exactly, and the world is in total famine.
    // A birth can lift it to cast+1 and the anonymous newcomer may then die, which is
    // the model working; what may NEVER happen is a draw reaching past the pool into
    // the cast, or a head count under the floor.
    const cast = 24;
    const doomed = place({
      id: 'Lastditch', tier: 'village', population: cast, dailyProduction: 1,
      importDependency: 0, deficitPct: 95, named: cast,
    });
    expect(residentNamedNpcCount(doomed)).toBe(cast);

    const failures = collectSeedFailures(['h1', 'h2', 'h3', 'h4'], (seed) => {
      let live = [{ saveId: 'Lastditch', settlement: doomed }];
      for (let t = 1; t <= 520; t += 1) {
        const r = advanceDemographics({
          snapshot: snapshotOf(live), worldState: LIT, settlementUpdates: live,
          rng: createPRNG(`${seed}::tick:${t}::one_week`), tick: t,
        });
        live = r.settlementUpdates;
        expect(live[0].settlement.population, `seed ${seed} tick ${t}: the cast was starved`)
          .toBeGreaterThanOrEqual(cast);
        for (const receipt of r.receipts) {
          expect(receipt.namedFloor).toBe(cast);
          expect(receipt.deaths, `seed ${seed} tick ${t}: the draw reached past the anonymous pool`)
            .toBeLessThanOrEqual(receipt.before - receipt.namedFloor);
          expect(receipt.after).toBeGreaterThanOrEqual(cast);
        }
      }
    });
    expectNoSeedFailures(failures, 'the named cast is never in the death lottery');
  });

  test('at exactly cast size the death term is structurally ZERO, whatever the draw says', () => {
    // The pool is empty, so there is no lottery to lose. Run every seed of a family to
    // show it is the ARITHMETIC and not a lucky roll.
    const cast = 24;
    const atFloor = place({
      id: 'Lastditch', tier: 'village', population: cast, dailyProduction: 1,
      importDependency: 0, deficitPct: 95, named: cast,
    });
    const failures = collectSeedFailures(['f1', 'f2', 'f3', 'f4', 'f5', 'f6'], (seed) => {
      const live = [{ saveId: 'Lastditch', settlement: atFloor }];
      const r = advanceDemographics({
        snapshot: snapshotOf(live), worldState: LIT, settlementUpdates: live,
        rng: createPRNG(`${seed}::tick:1::one_week`), tick: 1,
      });
      for (const receipt of r.receipts) expect(receipt.deaths).toBe(0);
    });
    expectNoSeedFailures(failures, 'a settlement reduced to its cast buries nobody');
  });

  test('NEGATIVE CONTROL: the SAME famine on a town with no cast does kill people', () => {
    // Without this the pin above would pass for the boring reason that the fixture
    // never dies at all.
    const castless = place({
      id: 'Lastditch', tier: 'village', population: 24, dailyProduction: 1,
      importDependency: 0, deficitPct: 95, named: 0,
    });
    let live = [{ saveId: 'Lastditch', settlement: castless }];
    let buried = 0;
    for (let t = 1; t <= 520; t += 1) {
      const r = advanceDemographics({
        snapshot: snapshotOf(live), worldState: LIT, settlementUpdates: live,
        rng: createPRNG(`control::tick:${t}::one_week`), tick: t,
      });
      live = r.settlementUpdates;
      buried += r.receipts.reduce((sum, x) => sum + x.deaths, 0);
    }
    expect(buried, 'the famine fixture must be lethal, or the H3 pin proves nothing').toBeGreaterThan(0);
  });

  test('the draw is taken against the anonymous pool, so a big cast shrinks the lottery', () => {
    const heavy = place({ id: 'Courtly', population: 400, named: 300, deficitPct: 90, dailyProduction: 10 });
    const light = place({ id: 'Courtly', population: 400, named: 0, deficitPct: 90, dailyProduction: 10 });
    const step = (settlement) => {
      let live = [{ saveId: 'Courtly', settlement }];
      let buried = 0;
      for (let t = 1; t <= 260; t += 1) {
        const r = advanceDemographics({
          snapshot: snapshotOf(live), worldState: LIT, settlementUpdates: live,
          rng: createPRNG(`pool::tick:${t}::one_week`), tick: t,
        });
        live = r.settlementUpdates;
        buried += r.receipts.reduce((sum, x) => sum + x.deaths, 0);
      }
      return buried;
    };
    expect(step(heavy)).toBeLessThan(step(light));
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('THE RECEIPT — every term named, in prose, and portable', () => {
  test('the min(K, D) diagnosis names WHICH wall binds, on two fixtures that differ only in that', () => {
    const granaryBound = place({ id: 'Thinfields', tier: 'town', terrain: 'plains', population: 1400, dailyProduction: 3400, importDependency: 0 });
    const wallBound = place({ id: 'Cragfast', tier: 'town', terrain: 'mountain', population: 1400, dailyProduction: 90000, importDependency: 0 });
    const updates = [
      { saveId: 'Thinfields', settlement: granaryBound },
      { saveId: 'Cragfast', settlement: wallBound },
    ];
    const r = advanceDemographics({
      snapshot: snapshotOf(updates), worldState: LIT, settlementUpdates: updates,
      rng: createPRNG('diag::tick:1::one_week'), tick: 1,
    });
    const byId = new Map(r.receipts.map((x) => [x.id, x]));
    expect(byId.get('Thinfields').binding).toBe('granary');
    expect(byId.get('Cragfast').binding).toBe('walls');
    expect(byId.get('Thinfields').line.includes('granaries are the wall')).toBe(true);
    expect(byId.get('Cragfast').line.includes('walls are the wall')).toBe(true);
    // Both carry BOTH numbers, so a reader can see the bound that did not bind.
    for (const receipt of r.receipts) {
      expect(receipt.foodCapacity).toBeGreaterThan(0);
      expect(receipt.densityCeiling).toBeGreaterThan(0);
      expect(receipt.bound).toBe(Math.min(receipt.foodCapacity, receipt.densityCeiling));
    }
  });

  test('the line is in-world prose with locale-independent counts and no engine tokens', () => {
    const updates = [{ saveId: 'Ashford', settlement: place({ population: 12000, tier: 'city', dailyProduction: 60000 }) }];
    const r = advanceDemographics({
      snapshot: snapshotOf(updates), worldState: LIT, settlementUpdates: updates,
      rng: createPRNG('prose::tick:1::one_week'), tick: 1,
    });
    const line = r.receipts[0].line;
    expect(line.startsWith('Ashford counts ')).toBe(true);
    // Grouped by the engine's locale-independent formatter, never toLocaleString.
    expect(line.includes('12,0')).toBe(true);
    expect(line.includes('born')).toBe(true);
    expect(line.includes('buried')).toBe(true);
    expect(line.includes('percent of it')).toBe(true);
    // anchored: the five positive assertions directly above prove this same `line` is present, non-empty and fully composed, so an emptied or renamed field cannot make the negative vacuous.
    expect(line).not.toMatch(/pressure01|birth01|death01|K_food|D_tier|undefined|NaN/);
  });

  test('the whole receipt survives a JSON round trip unchanged (it is pure data)', () => {
    const updates = realmUpdates();
    const r = advanceDemographics({
      snapshot: snapshotOf(updates), worldState: LIT, settlementUpdates: updates,
      rng: createPRNG('rt::tick:1::one_week'), tick: 1,
    });
    expect(r.receipts.length).toBeGreaterThan(0);
    expect(JSON.parse(JSON.stringify(r.receipts))).toEqual(r.receipts);
  });

  test('the written settlement survives a JSON round trip, and the next tick reads it the same', () => {
    // THE ALIAS TRAP, honoured: a reload-only defect is invisible to an in-memory pin,
    // so the second tick is driven off a re-serialized world.
    const seed = 'roundtrip';
    let live = realmUpdates();
    for (let t = 1; t <= 30; t += 1) {
      const r = advanceDemographics({
        snapshot: snapshotOf(live), worldState: LIT, settlementUpdates: live,
        rng: createPRNG(`${seed}::tick:${t}::one_week`), tick: t,
      });
      live = JSON.parse(JSON.stringify(r.settlementUpdates));
    }
    const inMemory = run({ seed, ticks: 30, worldState: LIT }).live;
    expect(popsOf(live)).toBe(popsOf(inMemory));
  });

  test('the population history entry is bounded and readable', () => {
    const { live } = run({ seed: 'hist', ticks: 60, worldState: LIT });
    for (const u of live) {
      const history = u.settlement.populationHistory || [];
      expect(history.length).toBeLessThanOrEqual(12);
      const last = history[history.length - 1];
      if (!last) continue;
      expect(typeof last.reason).toBe('string');
      expect(last.reason.includes('born')).toBe(true);
      expect(String(last.outcomeId).startsWith('demographics.')).toBe(true);
      expect(last.population).toBe(u.settlement.population);
    }
  });

  test('a still week writes nothing at all: no history entry, no clone', () => {
    // Births exactly matching deaths must not churn the record.
    const updates = [{ saveId: 'Ashford', settlement: place({ population: 1200 }) }];
    const r = advanceDemographics({
      snapshot: snapshotOf(updates), worldState: LIT, settlementUpdates: updates, rng: null, tick: 1,
    });
    // With no rng both terms floor: 1 born, 0 buried, so this one DID move.
    expect(r.changed).toBe(true);
    const still = advanceDemographics({
      snapshot: snapshotOf(updates), worldState: LIT,
      settlementUpdates: [{ saveId: 'Tiny', settlement: place({ id: 'Tiny', population: 10, dailyProduction: 400 }) }],
      rng: null, tick: 1,
    });
    expect(still.changed).toBe(false);
    expect(still.receipts).toEqual([]);
  });
});
