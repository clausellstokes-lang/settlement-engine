/**
 * settlementLifecycleKernel.test.js — W-LIFECYCLE Stage 1: the SATELLITE LANE pins
 * (docs/DESIGN_SETTLEMENT_LIFECYCLE.md §1 + §4).
 *
 * Every §4 pin the satellite lane owns:
 *   • CONSERVATION AT EVERY EDGE — Σ(parent + orbit) EXACT across found / grow /
 *     starve-return / converge (the realm-wide Σ property pin, satellite edges).
 *   • CAPS + CADENCE — counts bounded by parent tier; armed-but-capped is
 *     DEFERRAL-VISIBLE (a receipt, never a silent swallow).
 *   • DETERMINISTIC CONVERGENCE — codepoint-ordered pair scan, seeded draw;
 *     identical inputs ⇒ identical outputs.
 *   • TRIBUTARY BOUNDEDNESS — the parent's modifier is ONE capped lift condition.
 *   • NO-SUDDEN-DEATH (satellite scale) — the starve dwell must elapse first.
 *   • CHARTER-PENDING IS VISIBLE — receipt + news + record flags, never a silent cap.
 *   • CATCH-UP INTEGRITY — dwell is tick-STAMP arithmetic; an M10b one-interval
 *     collapse (tick jump) still reads the elapsed dwell.
 *   • THE SCARCITY LAW (satellite half) — a dead steading leaves NO remnant record.
 *   • THE FATES BOUNDARY — satellite records structurally carry no npc roster.
 *   • DORMANCY — flag absent ⇒ same references, zero forks (rng-throw probe).
 *   • PURITY — the mover never mutates its deep-frozen inputs.
 *   • peakTier (stage-2 substrate) — monotone write-once-upward, dual-written
 *     config + _config, absent-tolerated, frozen on remnants.
 */
import { describe, expect, it } from 'vitest';

import { createPRNG } from '../../src/kernel/prng.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { appendWizardNewsEntries } from '../../src/domain/region/index.js';
import { SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import {
  SETTLEMENT_LIFECYCLE_TUNING,
  advanceSettlementLifecycle,
  satelliteTributary01,
  satellitesOf,
  seedingDrive,
  stepSeeding,
  settlementLifecycleActive,
  drawSteadingName,
  mintSteading,
} from '../../src/domain/worldPulse/settlementLifecycleKernel.js';
import {
  applyLineageBirthsToGraph,
  buildLineageMemberBirth,
  lineageMemberSaveId,
} from '../../src/domain/worldPulse/lineageMemberBirth.js';

const T = SETTLEMENT_LIFECYCLE_TUNING;
const NOW = '2026-01-01T00:00:00.000Z';

// ── Fixture helpers ────────────────────────────────────────────────────────────
function town(id, { tier = 'town', population = 4800, prosperity = 'Prosperous', conditions = [], peakTier, lifecycleStatus, withRaw = false } = {}) {
  return {
    name: `${id}-name`, tier, population, culture: 'germanic',
    ...(lifecycleStatus ? { lifecycleStatus } : {}),
    config: {
      terrainType: 'plains', tradeRouteAccess: 'road', tier, settType: tier,
      ...(peakTier ? { peakTier } : {}),
      ...(lifecycleStatus ? { lifecycleStatus } : {}),
    },
    ...(withRaw ? { _config: { tier } } : {}),
    economicState: { prosperity },
    powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
    activeConditions: conditions,
    populationHistory: [],
    npcs: [],
  };
}

const boomCond = { id: 'condition.boom.t', archetype: 'boom', label: 'Boom', severity: 0.4, affectedSystems: [] };

function makeWorld({ settlements, lit = true, ledger = null, tick = 300 }) {
  const items = Object.entries(settlements).map(([id, s]) => ({ id, name: s.name, settlement: s }));
  const snapshot = { settlements: items };
  const updates = items.map((it) => ({ saveId: it.id, settlement: it.settlement }));
  const worldState = {
    tick,
    simulationRules: lit ? { settlementLifecycleEnabled: true } : {},
    ...(ledger ? { spatialLedgers: { satellites: ledger } } : {}),
  };
  return { snapshot, updates, worldState, tick };
}

const pIndexOf = (scores = {}) => ({ get: (id, kind) => ({ score: scores[`${id}:${kind}`] ?? 0 }) });

/** Σ population across the parent updates + every satellite record. */
function totalPopulation(updates, worldState) {
  const settlementPop = updates.reduce((s, u) => s + (u.settlement?.population || 0), 0);
  const led = worldState.spatialLedgers?.satellites || {};
  let orbit = 0;
  for (const entry of Object.values(led)) {
    for (const rec of Object.values(entry.steadings || {})) orbit += rec.population || 0;
  }
  return settlementPop + orbit;
}

/** Drive the mover N ticks over a mutable world; returns the final state + all receipts/news. */
function drive({ settlements, ticks, lit = true, ledger = null, startTick = 300, scores = {}, seed = 'lc-test', tickStep = 1 }) {
  let { snapshot, updates, worldState } = makeWorld({ settlements, lit, ledger, tick: startTick });
  const rng = createPRNG(seed);
  const receipts = [];
  const news = [];
  let tick = startTick;
  for (let i = 0; i < ticks; i += 1) {
    const out = advanceSettlementLifecycle({
      snapshot, worldState, settlementUpdates: updates, pIndex: pIndexOf(scores), rng, tick, now: NOW,
    });
    worldState = { ...out.worldState, tick };
    updates = out.settlementUpdates;
    receipts.push(...out.receipts);
    news.push(...out.newsEntries);
    // Refresh the snapshot from the updates (the pulse does this between ticks).
    snapshot = { settlements: updates.map((u) => ({ id: u.saveId, name: u.settlement?.name, settlement: u.settlement })) };
    tick += tickStep;
  }
  return { worldState, updates, receipts, news, tick };
}

// ── DORMANCY ───────────────────────────────────────────────────────────────────
describe('dormancy (the constitutional gate)', () => {
  it('flag absent ⇒ the mover is a complete no-op: SAME references, zero forks', () => {
    const { snapshot, updates, worldState, tick } = makeWorld({
      settlements: { a: town('a', { conditions: [boomCond] }) }, lit: false,
    });
    const throwingRng = { fork: () => { throw new Error('dormant mover must not fork'); } };
    const out = advanceSettlementLifecycle({
      snapshot, worldState, settlementUpdates: updates, pIndex: pIndexOf(), rng: throwingRng, tick, now: NOW,
    });
    expect(out.changed).toBe(false);
    expect(out.worldState).toBe(worldState);
    expect(out.settlementUpdates).toBe(updates);
    expect(out.newsEntries).toEqual([]);
    expect(out.receipts).toEqual([]);
  });

  it('settlementLifecycleActive reads the virtual flag fail-closed', () => {
    expect(settlementLifecycleActive({ simulationRules: { settlementLifecycleEnabled: true } })).toBe(true);
    expect(settlementLifecycleActive({ simulationRules: {} })).toBe(false);
    expect(settlementLifecycleActive({ simulationRules: { settlementLifecycleEnabled: 'yes' } })).toBe(false);
    expect(settlementLifecycleActive({})).toBe(false);
    expect(settlementLifecycleActive(null)).toBe(false);
  });
});

// ── PURITY ─────────────────────────────────────────────────────────────────────
describe('purity (the undo round-trip substrate)', () => {
  it('the mover never mutates its deep-frozen inputs', () => {
    const deepFreeze = (o) => {
      if (o && typeof o === 'object' && !Object.isFrozen(o)) {
        Object.freeze(o);
        for (const v of Object.values(o)) deepFreeze(v);
      }
      return o;
    };
    const ledger = { a: { seedAcc: 0.75, steadings: {} } };
    const { snapshot, updates, worldState, tick } = makeWorld({
      settlements: { a: town('a', { conditions: [boomCond] }) }, lit: true, ledger,
    });
    deepFreeze(snapshot); deepFreeze(updates); deepFreeze(worldState);
    const out = advanceSettlementLifecycle({
      snapshot, worldState, settlementUpdates: updates, pIndex: pIndexOf(), rng: createPRNG('pure'), tick, now: NOW,
    });
    // It FIRED (the probe is not vacuous) and returned NEW objects.
    expect(out.changed).toBe(true);
    expect(out.worldState).not.toBe(worldState);
  });
});

// ── SEEDING: the integrator + the founding ─────────────────────────────────────
describe('seeding (§1: §H-loaded, integrator + cooldown, conserved at birth)', () => {
  it('the drive is §H-loaded: boom + strike + prosperity + pressure + inflow', () => {
    const quiet = seedingDrive({ settlement: town('a', { prosperity: 'Poor', population: 1000 }), pIndex: pIndexOf(), parentId: 'a', tick: 10 });
    const loaded = seedingDrive({
      settlement: town('a', {
        conditions: [boomCond, { id: 'c2', archetype: 'resource_strike', label: 'Strike', severity: 0.4, affectedSystems: [], triggeredAt: { sourceEventTargetId: 'iron_deposits' } }],
      }),
      pIndex: pIndexOf(), parentId: 'a', tick: 10,
    });
    expect(loaded.drive).toBeGreaterThan(quiet.drive);
    expect(loaded.boom).toBe(true);
    expect(loaded.strike?.triggeredAt?.sourceEventTargetId).toBe('iron_deposits');
    // A moderate drive plateaus BELOW the floor (E0-rare by construction).
    let acc = 0;
    for (let i = 0; i < 200; i += 1) acc = stepSeeding(acc, quiet.drive);
    expect(acc).toBeLessThan(T.SEED_FLOOR);
  });

  it('a founding DEBITS the parent exactly (conservation at birth) and stamps provenance + resourceKey', () => {
    const strikeCond = { id: 'c2', archetype: 'resource_strike', label: 'Strike', severity: 0.4, affectedSystems: [], triggeredAt: { sourceEventTargetId: 'iron_deposits' } };
    const settlements = { a: town('a', { conditions: [boomCond, strikeCond] }) };
    const before = 4800;
    const { worldState, updates, receipts } = drive({
      settlements, ticks: 1, ledger: { a: { seedAcc: 0.8, steadings: {} } },
    });
    const sats = satellitesOf(worldState.spatialLedgers.satellites, 'a');
    expect(sats.length).toBe(1);
    const rec = sats[0];
    expect(rec.provenance).toBe('resource_strike');
    expect(rec.resourceKey).toBe('iron_deposits');
    expect(rec.tier).toBe('thorp');
    expect(rec.population).toBeGreaterThanOrEqual(T.FOUNDERS_MIN);
    // Σ EXACT: the founding (and the same-tick first grow transfer) moved people,
    // never minted them.
    expect(totalPopulation(updates, worldState)).toBe(before);
    // THE FATES BOUNDARY: a satellite record carries NO npc roster, structurally.
    expect('npcs' in rec).toBe(false);
    expect(receipts.some((r) => r.kind === 'satellite_founded')).toBe(true);
  });

  it('caps by parent tier are enforced and DEFERRAL-VISIBLE when armed at cap', () => {
    const steadings = {};
    for (let i = 0; i < T.SATELLITE_CAPS.town; i += 1) {
      steadings[`steading.a.${i}`] = {
        id: `steading.a.${i}`, name: `S${i}`, parentId: 'a', tier: 'thorp', population: 20,
        foundedTick: 100, provenance: 'growth', orbit: i + 2, inflow: 20, backing01: 0.5, history: [],
      };
    }
    const { worldState, receipts } = drive({
      settlements: { a: town('a', { conditions: [boomCond] }) }, ticks: 1,
      ledger: { a: { seedAcc: 0.8, steadings } },
    });
    const sats = satellitesOf(worldState.spatialLedgers.satellites, 'a');
    expect(sats.length).toBe(T.SATELLITE_CAPS.town); // no founding past the cap
    const deferred = receipts.find((r) => r.kind === 'satellite_deferred');
    expect(deferred, 'armed-at-cap must be receipted (deferral-visible)').toBeTruthy();
    expect(deferred.reason).toBe('cap');
  });

  it('a sub-town parent never seeds (town+ only)', () => {
    const { worldState } = drive({
      settlements: { v: town('v', { tier: 'village', population: 850, conditions: [boomCond] }) },
      ticks: 1, ledger: { v: { seedAcc: 0.9, steadings: {} } },
    });
    expect(satellitesOf(worldState.spatialLedgers?.satellites || null, 'v').length).toBe(0);
  });

  it('the founding never drags the parent below its own tier floor', () => {
    // A town sitting AT its floor has no headroom — no founding, even fully armed.
    const { worldState, updates } = drive({
      settlements: { a: town('a', { population: 905, conditions: [boomCond] }) },
      ticks: 1, ledger: { a: { seedAcc: 0.9, steadings: {} } },
    });
    expect(satellitesOf(worldState.spatialLedgers?.satellites || null, 'a').length).toBe(0);
    expect(updates[0].settlement.population).toBe(905);
  });
});

// ── PRECARITY: grow / starve / converge ────────────────────────────────────────
describe('precarity (§1: grow, starve → quickly die, converge — all conserved)', () => {
  const steadingOf = (id, { population = 30, orbit = 0, foundedTick = 100, starvingSince } = {}) => ({
    id, name: `Stead-${id}`, parentId: 'a', tier: 'thorp', population,
    foundedTick, provenance: 'growth', orbit, inflow: population, backing01: 0.5,
    ...(starvingSince != null ? { starvingSince } : {}), history: ['Founded.'],
  });

  it('GROW transfers from the parent (conserved) and promotes thorp → hamlet at the population threshold', () => {
    const settlements = { a: town('a') };
    const ledger = { a: { steadings: { 's1': steadingOf('s1', { population: 59 }) } } };
    const before = 4800 + 59;
    const { worldState, updates, receipts } = drive({ settlements, ticks: 3, ledger });
    const sats = satellitesOf(worldState.spatialLedgers.satellites, 'a');
    expect(sats[0].population).toBeGreaterThanOrEqual(61);
    expect(sats[0].tier).toBe('hamlet');
    expect(totalPopulation(updates, worldState)).toBe(before);
    expect(receipts.some((r) => r.kind === 'satellite_promoted' && r.tier === 'hamlet')).toBe(true);
  });

  it('STARVE requires the dwell (no sudden death) and the residual flows BACK to the parent (conserved)', () => {
    // Poor parent + high trade pressure ⇒ backing below the starve floor.
    const settlements = { a: town('a', { prosperity: 'Subsistence', population: 2000 }) };
    const scores = { 'a:trade': 1 };
    const ledger = { a: { steadings: { 's1': steadingOf('s1', { population: 30 }) } } };
    const before = 2000 + 30;

    // Tick 1: the dwell stamp lands, but NOTHING dies (no sudden death).
    const one = drive({ settlements, ticks: 1, ledger, scores });
    const satsAfter1 = satellitesOf(one.worldState.spatialLedgers.satellites, 'a');
    expect(satsAfter1.length).toBe(1);
    expect(satsAfter1[0].starvingSince).toBeDefined();

    // Drive far past the dwell: the death draw eventually fires; the folk return.
    const long = drive({ settlements, ticks: T.STARVE_DWELL + 30, ledger, scores });
    const satsAfterLong = satellitesOf(long.worldState.spatialLedgers?.satellites || null, 'a');
    expect(satsAfterLong.length, 'the steading quickly dies once starving past the dwell').toBe(0);
    // THE SCARCITY LAW (satellite half): no remnant record of any kind survives —
    // the steadings map is empty (the parent's entry may persist as live
    // integrator memory, which is cadence state, not a remnant).
    const parentEntry = long.worldState.spatialLedgers?.satellites?.a;
    expect(Object.keys(parentEntry?.steadings || {}).length).toBe(0);
    const abandoned = long.receipts.find((r) => r.kind === 'satellite_abandoned');
    expect(abandoned).toBeTruthy();
    expect(String(abandoned.remnant)).toContain('never mints a ruin');
    expect(abandoned.dwell).toBeGreaterThanOrEqual(T.STARVE_DWELL);
    // Σ EXACT: every resident is back in the parent.
    expect(totalPopulation(long.updates, long.worldState)).toBe(before);
    expect(long.updates[0].settlement.population).toBe(before);
  });

  it('CATCH-UP INTEGRITY: the starve dwell is tick-STAMP arithmetic — a collapsed interval still reads elapsed dwell', () => {
    const settlements = { a: town('a', { prosperity: 'Subsistence', population: 2000 }) };
    const scores = { 'a:trade': 1 };
    // The stamp is far in the past; the FIRST evaluated tick after a big jump must
    // already see dwell ≥ STARVE_DWELL (never a per-tick counter that lost the gap).
    const ledger = { a: { steadings: { 's1': steadingOf('s1', { population: 30, starvingSince: 100 }) } } };
    const { receipts } = drive({ settlements, ticks: 8, ledger, scores, startTick: 400 });
    const abandoned = receipts.find((r) => r.kind === 'satellite_abandoned');
    expect(abandoned, 'the death draw armed immediately after the jump').toBeTruthy();
    expect(abandoned.dwell).toBeGreaterThanOrEqual(300);
  });

  it('CONVERGE folds two orbit-adjacent steadings into ONE hamlet: populations SUM, the receipt names both', () => {
    const settlements = { a: town('a') };
    const ledger = {
      a: {
        steadings: {
          's1': steadingOf('s1', { population: 40, orbit: 0, foundedTick: 100 }),
          's2': steadingOf('s2', { population: 45, orbit: 1, foundedTick: 100 }),
        },
      },
    };
    const before = 4800 + 85;
    const { worldState, updates, receipts } = drive({ settlements, ticks: 12, ledger });
    const conv = receipts.find((r) => r.kind === 'satellites_converged');
    expect(conv, 'the qualifying pair converged within the window').toBeTruthy();
    expect(conv.names.sort()).toEqual(['Stead-s1', 'Stead-s2']);
    const sats = satellitesOf(worldState.spatialLedgers.satellites, 'a');
    expect(sats.length).toBe(1);
    expect(sats[0].tier).toBe('hamlet');
    expect(sats[0].id).toBe('s1'); // codepoint-lower id survives
    expect(sats[0].history.join(' ')).toContain('folded into one palisade');
    expect(totalPopulation(updates, worldState)).toBe(before);
  });

  it('non-adjacent orbits never converge (proximity is structural, not a roll)', () => {
    const settlements = { a: town('a') };
    const ledger = {
      a: {
        steadings: {
          's1': steadingOf('s1', { population: 40, orbit: 0, foundedTick: 100 }),
          's2': steadingOf('s2', { population: 45, orbit: 3, foundedTick: 100 }),
        },
      },
    };
    const { worldState } = drive({ settlements, ticks: 12, ledger });
    expect(satellitesOf(worldState.spatialLedgers.satellites, 'a').length).toBe(2);
  });

  // ── r2 economy-upswing-5: TERMINAL-DEATH ORBIT DISPOSAL ──────────────────────
  it('a DEAD parent holding steadings disperses its whole orbit (records dropped, receipted) — no ledger strand, no inherited orbit', () => {
    // A parent that died (relic_ruin) still carrying two live steadings. Before the fix these
    // stayed frozen in spatialLedgers.satellites forever (skip-lane `continue` ran no disposal),
    // and a later resettlement of the same id inherited the dead town's orbit.
    const settlements = { a: town('a', { lifecycleStatus: 'relic_ruin', population: 0 }) };
    const ledger = { a: { steadings: {
      's1': steadingOf('s1', { population: 30 }),
      's2': steadingOf('s2', { population: 20, orbit: 1 }),
    } } };
    const { worldState, receipts, news } = drive({ settlements, ticks: 1, ledger });

    // The orbit is gone AND the parent's ledger entry is fully removed (no strand to inherit).
    expect(satellitesOf(worldState.spatialLedgers?.satellites || null, 'a').length, 'no steading survives the parent').toBe(0);
    expect(worldState.spatialLedgers?.satellites?.a, 'the dead parent has no ledger entry left').toBeUndefined();

    // Receipted + chronicled, with the dispersed population summed (origin-loss; see the
    // conservation JUDGMENT in the kernel — not credited through migration).
    const rec = receipts.find((r) => r.kind === 'satellite_orbit_dispersed');
    expect(rec, 'the disposal is receipted').toBeTruthy();
    expect(rec.count).toBe(2);
    expect(rec.dispersedPopulation).toBe(50);
    expect(rec.satIds.sort()).toEqual(['s1', 's2']);
    expect(news.some((n) => n.impactKind === 'steading_orbit_dispersed' || String(n.headline || '').includes('empty out')),
      'a chronicle beat lands').toBe(true);
  });

  it('CONTROL: a LIVE parent with steadings does NOT trigger orbit disposal (only a dead parent does)', () => {
    const settlements = { a: town('a') }; // alive
    const ledger = { a: { steadings: { 's1': steadingOf('s1', { population: 30 }) } } };
    const { worldState, receipts } = drive({ settlements, ticks: 1, ledger });
    expect(receipts.some((r) => r.kind === 'satellite_orbit_dispersed'), 'a live parent never disperses its orbit wholesale').toBe(false);
    expect(satellitesOf(worldState.spatialLedgers.satellites, 'a').length, 'the live orbit persists').toBe(1);
  });

  it('runs ONCE: the tick after disposal the dead parent carries no ledger entry to re-dispose', () => {
    const settlements = { a: town('a', { lifecycleStatus: 'relic_ruin', population: 0 }) };
    const ledger = { a: { steadings: { 's1': steadingOf('s1', { population: 30 }) } } };
    const { receipts } = drive({ settlements, ticks: 3, ledger });
    expect(receipts.filter((r) => r.kind === 'satellite_orbit_dispersed').length, 'disposed exactly once').toBe(1);
  });

  it('DETERMINISM: identical inputs produce byte-identical outcomes (ledger + updates)', () => {
    const run = () => {
      const settlements = { a: town('a', { conditions: [boomCond] }) };
      const ledger = {
        a: {
          seedAcc: 0.8,
          steadings: {
            's1': steadingOf('s1', { population: 40, orbit: 0, foundedTick: 100 }),
            's2': steadingOf('s2', { population: 45, orbit: 1, foundedTick: 100 }),
          },
        },
      };
      const { worldState, updates } = drive({ settlements, ticks: 10, ledger, seed: 'determinism' });
      return JSON.stringify({ led: worldState.spatialLedgers?.satellites ?? null, updates });
    };
    expect(run()).toBe(run());
  });
});

// ── CHARTER-PENDING (the owner's graduation-at-village ruling) ─────────────────
describe('charter-pending (visible, never a silent cap)', () => {
  it('a steading reaching village scale enters CHARTER-PENDING with receipt + news + chronicle line', () => {
    const settlements = { a: town('a', { tier: 'city', population: 20000 }) };
    const ledger = {
      a: {
        steadings: {
          's1': {
            id: 's1', name: 'Weirbrook', parentId: 'a', tier: 'hamlet', population: 399,
            foundedTick: 100, provenance: 'growth', orbit: 0, inflow: 399, backing01: 0.6, history: [],
          },
        },
      },
    };
    const { worldState, receipts, news } = drive({ settlements, ticks: 3, ledger });
    const sats = satellitesOf(worldState.spatialLedgers.satellites, 'a');
    expect(sats[0].charterPending).toBe(true);
    expect(sats[0].charterPendingSince).toBeGreaterThan(0);
    expect(sats[0].history.join(' ')).toContain('a charter awaits');
    const receipt = receipts.find((r) => r.kind === 'satellite_charter_pending');
    expect(receipt, 'charter-pending is receipted (deferral-visible)').toBeTruthy();
    expect(String(receipt.deferredTo)).toContain('V2');
    expect(news.some((n) => n.impactKind === 'steading_charter_pending')).toBe(true);
    // Growth pauses awaiting the charter (the V2 seam) — visibly, not silently.
    const popAtPending = sats[0].population;
    const again = drive({ settlements, ticks: 3, ledger: worldState.spatialLedgers.satellites });
    expect(satellitesOf(again.worldState.spatialLedgers.satellites, 'a')[0].population).toBe(popAtPending);
  });

  it('WR-3: a pending village graduates once into a canon member with a live lineage edge', () => {
    const parent = town('a', { tier: 'city', population: 12000 });
    parent.populationHistory = [
      { tick: 200, delta: -20, population: 12020, outcomeId: 'lifecycle.grow.s1.200' },
      { tick: 220, delta: -30, population: 11990, outcomeId: 'lifecycle.grow.s1.220' },
    ];
    const satellite = {
      id: 's1', name: 'Weirbrook', parentId: 'a', tier: 'hamlet', population: 430,
      foundedTick: 100, provenance: 'growth', orbit: 0, inflow: 430, backing01: 0.6,
      charterPending: true, charterPendingSince: 299, history: ['A charter awaits.'],
    };
    const snapshot = {
      campaign: { id: 'camp-1' },
      settlements: [{ id: 'a', name: parent.name, settlement: parent }],
    };
    const updates = [{ saveId: 'a', settlement: parent }];
    const worldState = {
      tick: 300,
      simulationRules: {
        settlementLifecycleEnabled: true,
        lineageClaimEnabled: true,
      },
      spatialLedgers: {
        satellites: { a: { steadings: { s1: satellite } } },
      },
    };
    const beforePopulation = parent.population + satellite.population;
    const out = advanceSettlementLifecycle({
      snapshot,
      worldState,
      settlementUpdates: updates,
      pIndex: pIndexOf(),
      rng: createPRNG('lineage-graduation'),
      tick: 300,
      now: NOW,
    });

    expect(out.memberBirths).toHaveLength(1);
    const birth = out.memberBirths[0];
    expect(birth.saveId).toBe(lineageMemberSaveId(['lineage-member', 'camp-1', 'a', 's1']));
    expect(birth.save.campaignState.phase).toBe('canon');
    expect(birth.save.settlement.parentRef).toMatchObject({
      parentId: 'a', sourceSatelliteId: 's1', graduatedTick: 300,
      foundingTier: 'thorp', graduationTier: 'village',
      graduationPopulation: 430, liveEdgeId: birth.graphEdge.id,
    });
    expect(birth.save.settlement.npcs).toEqual([]);
    expect(birth.save.settlement.factions).toEqual([]);
    expect(satellitesOf(out.worldState.spatialLedgers?.satellites || null, 'a')).toEqual([]);
    expect(out.settlementUpdates[0].settlement.population + birth.save.settlement.population)
      .toBe(beforePopulation);
    const lineageNews = out.newsEntries.find(entry => entry.impactKind === 'lineage_edge_recorded');
    expect(lineageNews).toMatchObject({
      settlementIds: ['a', birth.saveId],
      settlementNames: [parent.name, satellite.name],
      audience: 'public',
      section: 'events',
    });
    const normalizedLineageNews = appendWizardNewsEntries({}, [lineageNews], { now: NOW }).entries[0];
    expect(normalizedLineageNews).toMatchObject({
      settlementIds: ['a', birth.saveId],
      settlementNames: [parent.name, satellite.name],
      audience: 'public',
      section: 'events',
    });
    expect(SECTION_OF(normalizedLineageNews.impactKind)).toBe(normalizedLineageNews.section);

    const graph = applyLineageBirthsToGraph({ nodes: [], edges: [] }, out.memberBirths, NOW);
    expect(graph.nodes.some(node => String(node.id) === String(birth.saveId))).toBe(true);
    expect(graph.edges.find(edge => edge.id === birth.graphEdge.id)).toMatchObject({
      from: 'a', to: birth.saveId, relationshipType: 'neutral', status: 'active',
    });
    // Replay is an idempotent replacement, not a duplicate topology.
    const replayed = applyLineageBirthsToGraph(graph, out.memberBirths, NOW);
    expect(replayed.nodes.filter(node => String(node.id) === String(birth.saveId))).toHaveLength(1);
    expect(replayed.edges.filter(edge => edge.id === birth.graphEdge.id)).toHaveLength(1);
  });

  it('WR-3 stays completely dark when lineageClaimEnabled is absent', () => {
    const parent = town('a', { tier: 'city', population: 12000 });
    const satellite = {
      id: 's1', name: 'Weirbrook', parentId: 'a', tier: 'hamlet', population: 430,
      foundedTick: 100, provenance: 'growth', orbit: 0, inflow: 430, backing01: 0.6,
      charterPending: true, charterPendingSince: 299, history: [],
    };
    const snapshot = {
      campaign: { id: 'camp-1' },
      settlements: [{ id: 'a', name: parent.name, settlement: parent }],
    };
    const worldState = {
      simulationRules: { settlementLifecycleEnabled: true },
      spatialLedgers: { satellites: { a: { steadings: { s1: satellite } } } },
    };
    const out = advanceSettlementLifecycle({
      snapshot,
      worldState,
      settlementUpdates: [{ saveId: 'a', settlement: parent }],
      pIndex: pIndexOf(),
      rng: createPRNG('lineage-dark'),
      tick: 300,
      now: NOW,
    });
    expect(out.memberBirths).toBeUndefined();
    expect(satellitesOf(out.worldState.spatialLedgers.satellites, 'a')[0].charterPending).toBe(true);
    expect(out.newsEntries.some(entry => entry.impactKind === 'lineage_edge_recorded')).toBe(false);
  });
});

// ── THE TRIBUTARY (bounded, receipted) ─────────────────────────────────────────
describe('tributary boundedness (§3: never more than a small modifier)', () => {
  it('satelliteTributary01 saturates at the cap regardless of orbit size', () => {
    const many = Array.from({ length: 6 }, (_, i) => ({ population: 400, id: `s${i}` }));
    expect(satelliteTributary01(many, 1000)).toBe(T.TRIBUTARY_POP_SHARE_CAP);
    expect(satelliteTributary01([], 1000)).toBe(0);
  });

  it('the parent carries ONE capped steading_tributary lift; it drops when the orbit empties', () => {
    const settlements = { a: town('a') };
    const ledger = {
      a: {
        steadings: {
          's1': { id: 's1', name: 'S1', parentId: 'a', tier: 'hamlet', population: 300, foundedTick: 100, provenance: 'growth', orbit: 0, inflow: 300, backing01: 0.6, history: [] },
          's2': { id: 's2', name: 'S2', parentId: 'a', tier: 'hamlet', population: 300, foundedTick: 100, provenance: 'growth', orbit: 2, inflow: 300, backing01: 0.6, history: [] },
        },
      },
    };
    const { updates } = drive({ settlements, ticks: 1, ledger });
    const conds = (updates[0].settlement.activeConditions || []).filter((c) => c.archetype === 'steading_tributary');
    expect(conds.length).toBe(1);
    expect(conds[0].severity).toBeLessThanOrEqual(T.TRIBUTARY_SEVERITY_MAX);
    expect(conds[0].affectedSystems).toEqual(['food_security', 'trade_connectivity']);

    // Orbit empties ⇒ the lift is REMOVED (no ghost modifier).
    const starving = drive({
      settlements: { a: { ...town('a', { prosperity: 'Subsistence', population: 2000 }), activeConditions: conds } },
      ticks: T.STARVE_DWELL + 30, scores: { 'a:trade': 1 },
      ledger: { a: { steadings: { 's1': { id: 's1', name: 'S1', parentId: 'a', tier: 'thorp', population: 20, foundedTick: 100, provenance: 'growth', orbit: 0, inflow: 20, backing01: 0.2, history: [] } } } },
    });
    const after = (starving.updates[0].settlement.activeConditions || []).filter((c) => c.archetype === 'steading_tributary');
    expect(after.length).toBe(0);
  });
});

// ── peakTier (stage-2 substrate: the monotone stamp) ───────────────────────────
describe('peakTier (write-once-upward, dual-written, absent-tolerated, frozen on remnants)', () => {
  it('materializes at the CURRENT tier on first lit tick (veterans are never newborns) and dual-writes _config', () => {
    const { updates } = drive({ settlements: { a: town('a', { tier: 'city', population: 9000, withRaw: true }) }, ticks: 1 });
    expect(updates[0].settlement.config.peakTier).toBe('city');
    expect(updates[0].settlement._config.peakTier).toBe('city');
  });

  it('only ever raises: a demoted settlement keeps its peak; a promotion above it re-stamps', () => {
    const demoted = drive({ settlements: { a: town('a', { tier: 'thorp', population: 20, peakTier: 'city' }) }, ticks: 2 });
    expect(demoted.updates[0].settlement.config.peakTier).toBe('city');
    const promoted = drive({ settlements: { a: town('a', { tier: 'metropolis', population: 30000, peakTier: 'city' }) }, ticks: 1 });
    expect(promoted.updates[0].settlement.config.peakTier).toBe('metropolis');
    expect(promoted.receipts.some((r) => r.kind === 'peak_tier_raised' && r.from === 'city' && r.to === 'metropolis')).toBe(true);
  });

  it('a remnant is frozen history: no peakTier churn on a dead settlement', () => {
    const { updates } = drive({
      settlements: { a: town('a', { tier: 'thorp', population: 0, peakTier: 'city', lifecycleStatus: 'relic_ruin' }) }, ticks: 1,
    });
    expect(updates[0].settlement.config.peakTier).toBe('city');
  });
});

// ── THE FOUNDING RUNG (TCD-3) ──────────────────────────────────────────────────
// `parentRef.foundingTier` was spelled `satellite.foundingTier || 'thorp'` and
// documented as a compatibility path for older records. No satellite record has ever
// carried that field, so the "fallback" was the only path. The constant that replaced
// it is only honest while the two facts below hold, so both are pinned HERE, against
// the real mint rather than a hand-written fixture.
describe('the founding rung is the mint\'s constant, never a record field (TCD-3)', () => {
  const PARENT_POPULATION = { town: 4800, city: 12000, metropolis: 40000 };
  /** The whole minting surface: every parent tier that may seed × every provenance
   *  the mint accepts × five seeds (a single seed would pin one draw, not the mint). */
  const MINTS = ['town', 'city', 'metropolis'].flatMap((tier) => (
    ['growth', 'resource_strike', 'resettlement', 'forced'].flatMap((provenance) => (
      ['rung-a', 'rung-b', 'rung-c', 'rung-d', 'rung-e'].map((seed) => ({ tier, provenance, seed }))
    ))
  ));

  function mintOne({ tier, provenance, seed }) {
    const fork = createPRNG(seed).fork(`satellite:a:100:${tier}:${provenance}`);
    return mintSteading({
      parent: town('a', { tier, population: PARENT_POPULATION[tier] }),
      parentId: 'a', sats: [], tick: 100,
      draw: () => fork.random(),
      provenance,
      resourceKey: provenance === 'resource_strike' ? 'iron_vein' : null,
    });
  }

  it('every steading the mint can produce is founded at thorp and carries NO foundingTier', () => {
    expect(MINTS).toHaveLength(60);
    for (const spec of MINTS) {
      const minted = mintOne(spec);
      expect(minted.refusal).toBeUndefined();
      expect(minted.record.tier).toBe('thorp');
      // THE WRITER THAT NEVER EXISTED. Minting an explicit founding rung would widen
      // a PERSISTED record shape and is owner-gated; this line is the tripwire that
      // forces the ruling rather than letting a second authority appear quietly.
      // `tier` is the anchor because it is authored on the SAME object literal in
      // `mintSteading`: a drift that stopped emitting the record's tier keys would
      // red here instead of turning the absence assertion vacuous.
      expectAbsentWithAnchor(
        Object.keys(minted.record), 'foundingTier', 'tier',
        `mintSteading ${spec.tier}/${spec.provenance}/${spec.seed}`,
      );
    }
  });

  it('a REAL minted record graduates at thorp, and a field planted on it cannot move the rung', () => {
    const parent = town('a', { tier: 'city', population: PARENT_POPULATION.city });
    const record = mintOne({ tier: 'city', provenance: 'growth', seed: 'rung-a' }).record;
    // The record as it actually reaches the charter: promoted up the in-orbit ladder,
    // grown to village scale, charter-pending. Its LIVE tier is not its founding rung.
    const chartered = { ...record, tier: 'hamlet', population: 430, charterPending: true, charterPendingSince: 299 };
    const args = { campaignId: 'camp-1', parentId: 'a', parent, tick: 300, now: NOW };
    const birth = buildLineageMemberBirth({ ...args, satellite: chartered });
    expect(birth.save.settlement.parentRef).toMatchObject({ foundingTier: 'thorp', graduationTier: 'village' });
    // THE MUTANT ARM: the old spelling read the record FIRST, so any record carrying
    // the field would have decided the rung. Nothing on a satellite may.
    const planted = buildLineageMemberBirth({ ...args, satellite: { ...chartered, foundingTier: 'village' } });
    expect(planted.save.settlement.parentRef.foundingTier).toBe('thorp');
    expect(planted.save.settlement.parentRef).toEqual(birth.save.settlement.parentRef);
  });
});

// ── Naming ─────────────────────────────────────────────────────────────────────
describe('deterministic seeded naming', () => {
  it('drawSteadingName is deterministic per fork and never draws the global rng', () => {
    const a = drawSteadingName('germanic', createPRNG('name-seed').fork('satellite:a:1'));
    const b = drawSteadingName('germanic', createPRNG('name-seed').fork('satellite:a:1'));
    expect(a).toBe(b);
    expect(a.length).toBeGreaterThan(2);
    // Unknown culture falls back to a real pool (total function).
    expect(typeof drawSteadingName('not_a_culture', createPRNG('x').fork('y'))).toBe('string');
  });
});
