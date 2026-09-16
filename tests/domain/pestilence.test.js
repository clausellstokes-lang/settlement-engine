/**
 * pestilence.test.js — Phase 5.5 mover M11a: PESTILENCE (the traveling plague), the
 * pure-engine proof. Gates proven here:
 *   - the CARE COUNTERFORCE reads the roster (never a toggle), stacks with DIMINISHING
 *     within- and cross-category returns, is CAPPED, and a temple city is NEVER immune;
 *   - ONSET scales up with density/tier + trade volume + import pressure, down with care,
 *     floored (no immunity) and ceiled (no certainty);
 *   - PROPAGATION lands a front at hopWeeks LATENCY (incubateUntil = tick + weeks) along
 *     trade + shipment (hot) carriers, seeded per-edge — deterministic;
 *   - ALL THREE co-built BRAKES: the per-tick SPREAD BOUND (cascade cap + no same-tick
 *     cascade), the CARE CAP, and the RECOVERY FLOOR (every record eventually clears);
 *   - the graded scalar READS (level / temple pulse / army hazard) are graded, never
 *     boolean; army contraction is seeded + bounded;
 *   - DORMANT byte-identity (no marker ⇒ the advance is a no-op, no ledger);
 *   - a 20-YEAR PORT-SEEDED TWO-REGION SOAK: the front walks the network at consistent
 *     arrival ticks, care-rich clears faster than care-poor, every record clears (NO
 *     perma-front), the ledger stays bounded.
 */
import { describe, expect, it } from 'vitest';
import {
  EPIDEMIC_TUNING,
  epidemicActive,
  classifyCareRoster,
  careCapacity,
  onsetProbability,
  materializationSeverity,
  advancePestilence,
  pestilenceLevel,
  pestilenceTemplePulse,
  armyPlagueHazard,
  armyContraction,
} from '../../src/domain/spatial/pestilence.js';
import { createPRNG } from '../../src/kernel/prng.js';

const T = EPIDEMIC_TUNING;

// A deterministic rng stub: every fork yields random()=v (0 ⇒ always fire, ~1 ⇒ never).
const constRng = (v) => ({ fork: () => ({ random: () => v }) });
const ALWAYS = constRng(0);
const NEVER = constRng(0.999);

const MARKER = { spatialCanonVersion: 1 };
const inst = (name) => ({ name });

// A defaulted inputs builder for advancePestilence (all callbacks overridable).
function inputs(over = {}) {
  return {
    worldState: over.worldState || MARKER,
    seedIds: over.seedIds || [],
    seedSeverityOf: over.seedSeverityOf || (() => 0.7),
    stressorActiveAt: over.stressorActiveAt || (() => true),
    neighboursOf: over.neighboursOf || (() => []),
    density01Of: over.density01Of || (() => 0.5),
    tradeVolume01Of: over.tradeVolume01Of || (() => 0.4),
    importVolume01Of: over.importVolume01Of || (() => 0.2),
    care01Of: over.care01Of || (() => 0),
    rng: over.rng || ALWAYS,
    tick: over.tick ?? 0,
  };
}

describe('M11a pestilence — the care counterforce (roster read, capped, never immune)', () => {
  it('classifies the four categories from institution NAMES (a no-magic world lacks druids/alchemists)', () => {
    const roster = classifyCareRoster([
      inst('Grand Temple'), inst('Wayside Chapel'), inst('Small hospital'),
      inst('The Infirmary'), inst("Druids' grove"), inst('The Apothecary'), inst('Alchemist guild'),
      inst('The Smithy'), inst('Town Hall'), // non-care — ignored
    ]);
    expect(roster.church).toBe(2); // temple + chapel
    expect(roster.healingHouse).toBe(2); // hospital + infirmary
    expect(roster.druid).toBe(1); // grove
    expect(roster.alchemist).toBe(2); // apothecary + alchemist
  });

  it('a no-care roster yields 0 relief', () => {
    expect(careCapacity(classifyCareRoster([inst('The Smithy'), inst('Barracks')]))).toBe(0);
  });

  it('stacks with DIMINISHING returns within a category (a 2nd healer is worth less)', () => {
    const one = careCapacity({ church: 0, healingHouse: 1, druid: 0, alchemist: 0 });
    const two = careCapacity({ church: 0, healingHouse: 2, druid: 0, alchemist: 0 });
    const three = careCapacity({ church: 0, healingHouse: 3, druid: 0, alchemist: 0 });
    expect(two).toBeGreaterThan(one);
    expect(three).toBeGreaterThan(two);
    expect(two - one).toBeGreaterThan(three - two); // diminishing
  });

  it('cross-category stacking is SUB-ADDITIVE (each category chips the remaining gap)', () => {
    const church = careCapacity({ church: 1, healingHouse: 0, druid: 0, alchemist: 0 });
    const heal = careCapacity({ church: 0, healingHouse: 1, druid: 0, alchemist: 0 });
    const both = careCapacity({ church: 1, healingHouse: 1, druid: 0, alchemist: 0 });
    expect(both).toBeGreaterThan(church);
    expect(both).toBeGreaterThan(heal);
    expect(both).toBeLessThan(church + heal); // sub-additive (diminishing cross-category)
  });

  it('is CAPPED below CARE_MAX_RELIEF (< 1): a temple city RESISTS, is NEVER immune', () => {
    const maxed = careCapacity({ church: 50, healingHouse: 50, druid: 50, alchemist: 50 });
    expect(maxed).toBeGreaterThan(0);
    expect(maxed).toBeLessThan(T.CARE_MAX_RELIEF);
    expect(T.CARE_MAX_RELIEF).toBeLessThan(1);
    // and onset under maximal care is still strictly positive (never immune):
    expect(onsetProbability({ density01: 0, tradeVolume01: 0, importVolume01: 0, care01: maxed }))
      .toBeGreaterThanOrEqual(T.ONSET_FLOOR);
    expect(T.ONSET_FLOOR).toBeGreaterThan(0);
  });
});

describe('M11a pestilence — onset scaling', () => {
  it('rises with density/tier, trade volume, and import pressure', () => {
    const base = onsetProbability({ density01: 0, tradeVolume01: 0, importVolume01: 0, care01: 0 });
    expect(onsetProbability({ density01: 1, tradeVolume01: 0, importVolume01: 0, care01: 0 })).toBeGreaterThan(base);
    expect(onsetProbability({ density01: 0, tradeVolume01: 1, importVolume01: 0, care01: 0 })).toBeGreaterThan(base);
    expect(onsetProbability({ density01: 0, tradeVolume01: 0, importVolume01: 1, care01: 0 })).toBeGreaterThan(base);
  });
  it('falls with care and is bounded to [FLOOR, CEIL]', () => {
    const hot = onsetProbability({ density01: 1, tradeVolume01: 1, importVolume01: 1, care01: 0 });
    const cooled = onsetProbability({ density01: 1, tradeVolume01: 1, importVolume01: 1, care01: 0.5 });
    expect(cooled).toBeLessThan(hot);
    expect(hot).toBeLessThanOrEqual(T.ONSET_CEIL);
    expect(cooled).toBeGreaterThanOrEqual(T.ONSET_FLOOR);
  });
  it('materialization severity is attenuated + density-scaled + floored', () => {
    const sev = materializationSeverity({ sourceSeverity: 0.9, density01: 0.5 });
    expect(sev).toBeGreaterThanOrEqual(T.SEVERITY_FLOOR);
    expect(sev).toBeLessThan(0.9); // arrives attenuated
    expect(materializationSeverity({ sourceSeverity: 0, density01: 0 })).toBe(T.SEVERITY_FLOOR);
  });
});

describe('M11a pestilence — dormancy byte-identity', () => {
  it('no marker ⇒ a no-op: no ledger, no materialization, prior preserved by reference', () => {
    const prior = { spatialLedgers: { epidemic: { a: { phase: 'active', level: 0.5, arrivedTick: 0, incubateUntil: 0, sinceTick: 0, lastTick: 0, activeSince: 0, refractoryUntil: 0, sourceId: '' } } } };
    const r = advancePestilence(inputs({ worldState: prior, seedIds: ['a'], rng: ALWAYS }));
    expect(r.changed).toBe(false);
    expect(r.materializations).toEqual([]);
    expect(r.next).toBe(prior.spatialLedgers.epidemic); // untouched reference
  });
  it('no marker AND no ledger ⇒ next null, changed false', () => {
    const r = advancePestilence(inputs({ worldState: {}, seedIds: ['a'] }));
    expect(r).toEqual({ next: null, changed: false, materializations: [], clearances: [] });
  });
});

describe('M11a pestilence — propagation at hopWeeks latency', () => {
  const twoNode = (weeks, hot = false) => ({
    neighboursOf: (id) => (id === 'a' ? [{ to: 'b', edgeId: 'e.a.b', weeks, hot }] : []),
  });

  it('a seed lands an INCUBATING front at the neighbour at incubateUntil = tick + weeks', () => {
    const r = advancePestilence(inputs({ seedIds: ['a'], tick: 10, rng: ALWAYS, ...twoNode(3) }));
    expect(r.next.a.phase).toBe('active');
    expect(r.next.b.phase).toBe('incubating');
    expect(r.next.b.incubateUntil).toBe(13); // 10 + 3
    expect(r.materializations).toEqual([]); // nothing takes hold until it lands
  });

  it('onset resolves only once the incubation elapses — then it materializes', () => {
    // Tick 0: seed a, front reaches b (weeks=2 ⇒ incubateUntil 2).
    let ws = { ...MARKER };
    let r = advancePestilence(inputs({ worldState: ws, seedIds: ['a'], tick: 0, rng: ALWAYS, ...twoNode(2) }));
    ws = { ...MARKER, spatialLedgers: { epidemic: r.next } };
    // Tick 1: still incubating (1 < 2), no materialization.
    r = advancePestilence(inputs({ worldState: ws, seedIds: ['a'], tick: 1, rng: ALWAYS, ...twoNode(2) }));
    expect(r.next.b.phase).toBe('incubating');
    expect(r.materializations).toEqual([]);
    ws = { ...MARKER, spatialLedgers: { epidemic: r.next } };
    // Tick 2: incubation elapsed ⇒ onset fires ⇒ b takes hold + materializes.
    r = advancePestilence(inputs({ worldState: ws, seedIds: ['a'], tick: 2, rng: ALWAYS, ...twoNode(2) }));
    expect(r.next.b.phase).toBe('active');
    expect(r.materializations.map((m) => m.id)).toContain('b');
  });

  it('a FAILED onset fizzles (recovering + refractory), no materialization', () => {
    // b already incubating and landed; NEVER rng ⇒ onset fails.
    const ws = { ...MARKER, spatialLedgers: { epidemic: {
      a: { phase: 'active', level: 0.6, arrivedTick: 0, incubateUntil: 0, sinceTick: 0, lastTick: 5, activeSince: 0, refractoryUntil: 0, sourceId: '' },
      b: { phase: 'incubating', level: 0, arrivedTick: 1, incubateUntil: 2, sinceTick: 1, lastTick: 1, activeSince: 1, refractoryUntil: 0, sourceId: 'a' },
    } } };
    const r = advancePestilence(inputs({ worldState: ws, seedIds: ['a'], tick: 3, rng: NEVER, neighboursOf: () => [] }));
    expect(r.next.b.phase).toBe('recovering');
    expect(r.next.b.refractoryUntil).toBe(3 + T.REFRACTORY_TICKS);
    expect(r.materializations).toEqual([]);
  });

  it('the HOT (shipment) carrier spreads harder than a plain trade road', () => {
    // A source level low enough that the plain edge misses but the hot edge fires, at a
    // draw between the two probabilities.
    const level = 0.5;
    const pPlain = T.SPREAD_BASE * level;
    const pHot = T.SPREAD_BASE * level * T.SPREAD_HOT_MULT;
    const between = (pPlain + pHot) / 2;
    const seedWs = { ...MARKER, spatialLedgers: { epidemic: {
      a: { phase: 'active', level, arrivedTick: 0, incubateUntil: 0, sinceTick: 0, lastTick: 0, activeSince: 0, refractoryUntil: 0, sourceId: '' },
    } } };
    const rng = constRng(between);
    const plain = advancePestilence(inputs({ worldState: seedWs, seedIds: ['a'], tick: 1, rng,
      neighboursOf: (id) => (id === 'a' ? [{ to: 'b', edgeId: 'e.a.b', weeks: 1, hot: false }] : []) }));
    const hot = advancePestilence(inputs({ worldState: seedWs, seedIds: ['a'], tick: 1, rng,
      neighboursOf: (id) => (id === 'a' ? [{ to: 'b', edgeId: 'e.a.b', weeks: 1, hot: true }] : []) }));
    expect(plain.next.b).toBeUndefined(); // plain road: draw ≥ p ⇒ misses
    expect(hot.next.b?.phase).toBe('incubating'); // hot carrier: draw < p ⇒ fires
  });
});

describe('M11a pestilence — the co-built brakes', () => {
  it('SPREAD BOUND: at most SPREAD_CASCADE_CAP new seedings per tick', () => {
    const many = Array.from({ length: T.SPREAD_CASCADE_CAP + 5 }, (_, i) => ({ to: `n${i}`, edgeId: `e${i}`, weeks: 1, hot: false }));
    const r = advancePestilence(inputs({ seedIds: ['a'], tick: 0, rng: ALWAYS,
      neighboursOf: (id) => (id === 'a' ? many : []) }));
    const incubating = Object.values(r.next).filter((rec) => rec.phase === 'incubating');
    expect(incubating.length).toBe(T.SPREAD_CASCADE_CAP); // bounded
  });

  it('NO same-tick cascade: a node seeded THIS tick does not also spread THIS tick', () => {
    // a → b (fires); b → c. c must NOT be seeded the same tick b is.
    const r = advancePestilence(inputs({ seedIds: ['a'], tick: 0, rng: ALWAYS,
      neighboursOf: (id) => (id === 'a' ? [{ to: 'b', edgeId: 'e.a.b', weeks: 1, hot: false }]
        : id === 'b' ? [{ to: 'c', edgeId: 'e.b.c', weeks: 1, hot: false }] : []) }));
    expect(r.next.b?.phase).toBe('incubating');
    expect(r.next.c).toBeUndefined();
  });

  it('RECOVERY FLOOR: an ever-active front FORCE-recovers after RECOVERY_FLOOR_TICKS and clears', () => {
    // Seed a; stressor never resolves (stressorActiveAt always true) — only the recovery
    // floor can end it. Drive well past the floor; the record must reach recovering then prune.
    let ws = { ...MARKER };
    let sawClearance = false;
    for (let t = 0; t < T.RECOVERY_FLOOR_TICKS + 40; t++) {
      const r = advancePestilence(inputs({ worldState: ws, seedIds: ['a'], tick: t, rng: ALWAYS,
        stressorActiveAt: () => true, neighboursOf: () => [] }));
      if (r.clearances.some((c) => c.id === 'a')) sawClearance = true;
      ws = r.next ? { ...MARKER, spatialLedgers: { epidemic: r.next } } : { ...MARKER };
    }
    expect(sawClearance).toBe(true);
    // After the floor + relaxation, drop the seed and confirm it prunes to empty (no perma-front).
    let ws2 = ws;
    for (let t = T.RECOVERY_FLOOR_TICKS + 40; t < T.RECOVERY_FLOOR_TICKS + 90; t++) {
      const r = advancePestilence(inputs({ worldState: ws2, seedIds: [], tick: t, rng: NEVER,
        stressorActiveAt: () => false, neighboursOf: () => [] }));
      ws2 = r.next ? { ...MARKER, spatialLedgers: { epidemic: r.next } } : { ...MARKER };
    }
    expect(ws2.spatialLedgers?.epidemic).toBeUndefined(); // cleared — NO perma-plague
  });

  it('CLEARANCE when the underlying stressor resolves (the existing counterforce won)', () => {
    const ws = { ...MARKER, spatialLedgers: { epidemic: {
      a: { phase: 'active', level: 0.6, arrivedTick: 0, incubateUntil: 0, sinceTick: 0, lastTick: 4, activeSince: 0, refractoryUntil: 0, sourceId: '' },
    } } };
    const r = advancePestilence(inputs({ worldState: ws, seedIds: [], tick: 5, rng: NEVER,
      stressorActiveAt: () => false, neighboursOf: () => [] }));
    expect(r.next.a.phase).toBe('recovering');
    expect(r.clearances.map((c) => c.id)).toContain('a');
  });
});

describe('M11a pestilence — the graded scalar reads (never a boolean)', () => {
  const ws = { spatialLedgers: { epidemic: {
    active: { phase: 'active', level: 0.8, arrivedTick: 0, incubateUntil: 0, sinceTick: 0, lastTick: 0, activeSince: 0, refractoryUntil: 0, sourceId: '' },
    incub: { phase: 'incubating', level: 0, arrivedTick: 0, incubateUntil: 5, sinceTick: 0, lastTick: 0, activeSince: 0, refractoryUntil: 0, sourceId: '' },
  } } };
  it('pestilenceLevel returns the graded level for active, 0 for incubating/absent', () => {
    expect(pestilenceLevel(ws, 'active')).toBe(0.8);
    expect(pestilenceLevel(ws, 'incub')).toBe(0);
    expect(pestilenceLevel(ws, 'nowhere')).toBe(0);
  });
  it('temple pulse is proportional and reverts to 0 with the level', () => {
    expect(pestilenceTemplePulse(ws, 'active')).toBeGreaterThan(0);
    expect(pestilenceTemplePulse(ws, 'active')).toBeLessThanOrEqual(T.TEMPLE_PULSE_MAX);
    expect(pestilenceTemplePulse(ws, 'nowhere')).toBe(0); // reverts on clearance
  });
  it('army hazard is a graded scalar weighted by risk tolerance (not a gate)', () => {
    const cautious = armyPlagueHazard(ws, 'active', 1);
    const rash = armyPlagueHazard(ws, 'active', 0.2);
    expect(cautious).toBeGreaterThan(rash); // a lawful commander reads it truer
    expect(rash).toBeGreaterThan(0); // still graded, never zeroed to a boolean
  });
  it('army contraction is seeded + bounded (fires under load, spares on a miss)', () => {
    expect(armyContraction({ level01: 0.8, rng: { random: () => 0 } }).contracted).toBe(true);
    expect(armyContraction({ level01: 0.8, rng: { random: () => 0.999 } }).contracted).toBe(false);
    const c = armyContraction({ level01: 1, rng: { random: () => 0 } });
    expect(c.impairment).toBeLessThanOrEqual(T.ARMY_STRENGTH_IMPAIR_MAX);
    expect(armyContraction({ level01: 0 }).contracted).toBe(false); // no plague ⇒ no roll
  });
});

describe('M11a pestilence — 20-year port-seeded two-region soak', () => {
  // Two regions strung on a line through a PORT hub. Region A (care-POOR) is seeded; the
  // front walks A → port → B (care-RICH). We model the stressor lifecycle by clearing a
  // node's stressor faster where care is high (the existing counterforce, abstracted): a
  // node stays "stressor active" for a care-scaled dwell after it takes hold.
  const CHAIN = ['a1', 'a2', 'port', 'b1', 'b2'];
  const CARE = { a1: 0, a2: 0, port: 0.15, b1: 0.3, b2: 0.3 }; // B is care-rich (resists harder, clears faster)
  const nbMap = {
    a1: [{ to: 'a2', edgeId: 'e.a1.a2', weeks: 2, hot: false }],
    a2: [{ to: 'port', edgeId: 'e.a2.port', weeks: 2, hot: false }],
    port: [{ to: 'b1', edgeId: 'e.port.b1', weeks: 1, hot: true }], // the port ships fast+hot
    b1: [{ to: 'b2', edgeId: 'e.b1.b2', weeks: 2, hot: false }],
    b2: [],
  };

  it('the front walks the network, care-rich clears faster, every record eventually clears', () => {
    let ws = { ...MARKER };
    const takeHoldTick = { a1: 0 }; // id → tick it took hold (the seed took hold at tick 0)
    const clearedTick = {}; // id → tick its stressor cleared
    // stressorActiveAt: a node's stressor is "active" from take-hold until a care-scaled dwell.
    const dwellFor = (id) => Math.round(10 + (1 - CARE[id]) * 24); // care-rich ⇒ shorter survival
    const rng = createPRNG('pest-20y');

    const YEARS = 20;
    const TICKS = YEARS * 52; // weekly ticks
    for (let t = 0; t < TICKS; t++) {
      const activeIds = new Set(
        Object.keys(takeHoldTick).filter((id) => clearedTick[id] == null));
      const r = advancePestilence({
        worldState: ws,
        seedIds: t === 0 ? ['a1'] : [...activeIds].sort(),
        seedSeverityOf: () => 0.7,
        stressorActiveAt: (id) => activeIds.has(String(id)),
        neighboursOf: (id) => nbMap[id] || [],
        density01Of: () => 0.6,
        tradeVolume01Of: () => 0.5,
        importVolume01Of: (id) => (id === 'b1' ? 0.8 : 0.2), // the port feeds b1 hot
        care01Of: (id) => CARE[id] ?? 0,
        rng,
        tick: t,
      });
      for (const m of r.materializations) {
        if (takeHoldTick[m.id] == null) takeHoldTick[m.id] = t;
      }
      // Advance the abstracted stressor lifecycle: clear a node once its dwell elapses.
      for (const id of Object.keys(takeHoldTick)) {
        if (clearedTick[id] == null && t - takeHoldTick[id] >= dwellFor(id)) clearedTick[id] = t;
      }
      ws = r.next ? { ...MARKER, spatialLedgers: { epidemic: r.next } } : { ...MARKER };
    }

    // The front WALKED to the far region (arrival ordering respects the hop latencies).
    expect(takeHoldTick.a2).toBeGreaterThan(takeHoldTick.a1 ?? -1);
    expect(takeHoldTick.port).toBeGreaterThan(takeHoldTick.a2);
    expect(takeHoldTick.b1).toBeGreaterThan(takeHoldTick.port);
    expect(takeHoldTick.b2).toBeGreaterThan(takeHoldTick.b1); // walked the full chain into the far region
    // CARE-RICH clears FASTER than care-poor (shorter survival under the temple/hospital).
    const survival = (id) => clearedTick[id] - takeHoldTick[id];
    expect(survival('b2')).toBeLessThan(survival('a1'));
    // EVERY record eventually clears — NO perma-front (the ledger drains to empty).
    expect(ws.spatialLedgers?.epidemic).toBeUndefined();
    // The ledger stayed BOUNDED (never blew up past the small chain).
    // (checked implicitly by the drain; assert the chain was fully reached)
    for (const id of CHAIN) expect(takeHoldTick[id]).toBeGreaterThanOrEqual(0);
  });

  it('is deterministic — two identical soaks agree byte-for-byte on the arrival schedule', () => {
    const arrivalsFor = () => {
      let ws = { ...MARKER };
      const takeHold = {};
      const rng = createPRNG('m11a-det');
      for (let t = 0; t < 260; t++) {
        const active = new Set(Object.keys(takeHold));
        const r = advancePestilence({
          worldState: ws, seedIds: t === 0 ? ['a1'] : [...active].sort(),
          seedSeverityOf: () => 0.7, stressorActiveAt: () => true,
          neighboursOf: (id) => nbMap[id] || [], density01Of: () => 0.6,
          tradeVolume01Of: () => 0.5, importVolume01Of: () => 0.3, care01Of: (id) => CARE[id] ?? 0,
          rng, tick: t,
        });
        for (const m of r.materializations) if (takeHold[m.id] == null) takeHold[m.id] = t;
        ws = r.next ? { ...MARKER, spatialLedgers: { epidemic: r.next } } : { ...MARKER };
      }
      return takeHold;
    };
    expect(JSON.stringify(arrivalsFor())).toBe(JSON.stringify(arrivalsFor()));
  });
});

describe('M11a pestilence — FIX #3: a dense re-seed cycle drains (no cluster-level perma-front)', () => {
  // The original soak (above) used a FORWARD-ONLY LINE, so its single wave ran off the end and
  // died — it structurally could not exercise a re-seed CYCLE. The real kernel's carriers CLOSE
  // cycles: tradeNeighbours is bidirectional AND M2 shipment edges are directed producer→consumer,
  // so a circular supply loop (n0→n1→…→n15→n0) is an ordinary neighboursOf topology. A rotating
  // front on such a cycle re-enters nodes it already burned; whether it DRAINS turns on the
  // settlement-level refractory outlasting the wave's lap time. (NB: a purely BIDIRECTIONAL ring
  // self-drains — the two counter-waves ANNIHILATE where they meet — so the perma-front needs a
  // net-DIRECTED cycle; the fix's cleared-refractory is what guarantees the drain either way.)
  //
  // BEFORE the fix, a cleared node's record pruned after only the level-decay accident (~26 ticks),
  // shorter than this cycle's lap, so the wave lapped forever: the ledger NEVER emptied and the
  // plague re-materialized ~1300+ times over this horizon. WITH CLEARED_REFRACTORY_TICKS (40) the
  // cleared node stays refractory past the lap, the wave catches its own tail, and the ledger drains.
  it('a directed 16-node supply-loop, care-poor, drains to EMPTY within a bounded horizon', () => {
    const N = 16;
    const DWELL = 8; // the materialized disease_outbreak's episodic active lifetime (care-poor)
    // The directed carrier cycle (a circular shipment loop): each node's only carrier is the hot
    // edge to the next node — n0→n1→…→n15→n0.
    const nbMap = {};
    for (let i = 0; i < N; i++) {
      nbMap[`n${i}`] = [{ to: `n${(i + 1) % N}`, edgeId: `ship.n${i}.n${(i + 1) % N}`, weeks: 1, hot: true }];
    }
    let ws = { ...MARKER };
    // The abstracted stressor lifecycle: a node's disease_outbreak is "active" from take-hold for
    // DWELL ticks, then ages out (each re-materialization renews it) — the same modelling the soak uses.
    const stressorUntil = {};
    let totalMaterializations = 0;
    let everInfected = 0;
    const HORIZON = 5 * 52; // 5 years weekly — comfortably past the measured drain (~tick 76)
    for (let t = 0; t < HORIZON; t++) {
      const stressorActive = (id) => stressorUntil[id] != null && t < stressorUntil[id];
      const r = advancePestilence({
        worldState: ws,
        seedIds: t === 0 ? ['n0'] : Object.keys(stressorUntil).filter(stressorActive).sort(),
        seedSeverityOf: () => 0.8,
        stressorActiveAt: (id) => stressorActive(String(id)),
        neighboursOf: (id) => nbMap[id] || [],
        density01Of: () => 0.9, // dense
        tradeVolume01Of: () => 0.6,
        importVolume01Of: () => 0.3,
        care01Of: () => 0, // care-POOR (no counterforce relief)
        rng: ALWAYS, // every spread + onset fires — the worst case for the drain
        tick: t,
      });
      if (t === 0) stressorUntil.n0 = DWELL;
      for (const m of r.materializations) { stressorUntil[m.id] = t + DWELL; totalMaterializations += 1; everInfected += 1; }
      ws = r.next ? { ...MARKER, spatialLedgers: { epidemic: r.next } } : { ...MARKER };
    }
    // The cycle WAS infected (non-vacuous: the wave walked the whole loop at least once).
    expect(everInfected).toBeGreaterThanOrEqual(N - 1);
    // NO perma-front: the epidemic ledger DRAINS TO EMPTY (pre-fix it never emptied — the wave lapped).
    expect(ws.spatialLedgers?.epidemic).toBeUndefined();
    // Re-materialization is BOUNDED — the plague did not re-mint endlessly (pre-fix: ~1300+ over this
    // horizon; a handful of laps at most here).
    expect(totalMaterializations).toBeLessThan(60);
  });
});

describe('M11a pestilence — activation gate', () => {
  it('epidemicActive tracks the spatial-canon marker only', () => {
    expect(epidemicActive({ spatialCanonVersion: 1 })).toBe(true);
    expect(epidemicActive({ spatialCanonVersion: 0 })).toBe(false);
    expect(epidemicActive({})).toBe(false);
    expect(epidemicActive(null)).toBe(false);
  });
});
