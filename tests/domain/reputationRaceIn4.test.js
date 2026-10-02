/**
 * reputationRaceIn4.test.js — FP IN-4 THE ROAD: the wave's acceptance file (the FP kit's
 * BUILD-FP-I2 brief; the compiled block #20 in docs/DESIGN_FP_ARCHITECTURE.md §5;
 * docs/DESIGN_FP_ARCH_IN.md §2, §4 IN-4 and §6 Q3).
 *
 * COMMIT 1 — J-INA-4, THE INVISIBLE KEY DECLARED. `intelTradeEnabled` has been a real, strict
 * gate since deep-couplings D-3 landed (`intelActs.intelTradeActive`), and the engine-gated walker
 * carried it on its measured BACKLOG because nothing declared it. The describe below is the
 * membership test the brief names: a source scan that names the key's ONE read site and the two
 * doors that call it, the manifest entry at its codepoint-sorted position, the authored row and
 * its one exact channel, and the byte-identity of the declaration (no rules surface names the key,
 * so the declaration is dark on every path and moves no world byte).
 *
 * COMMIT 2 — THE ROAD. One race stage (reputationRaceConsumer.js, mounted in the lifecycle host)
 * at the arrivals the ledgers KEEP, read on the next tick: the four fences and the lit-mutant
 * control for `reputationRaceEnabled`, the mount's vote on both host paths, the three kept
 * arrivals, the race and RACE_OUTCOMES verbatim, the silent trivial race with its seeded twins,
 * the racer's voice, THE TRUTH THAT ARRIVED TOO LATE, the double agent's detour lateness, the
 * intercepted demand cross-pinned on the BUILT interception stage with the DM-KILL twin, the gate's
 * listeners, the refugee column's measured absence, the JSON round-trip and the phantom reader,
 * the verdict law's one spelling, and the editor's registers.
 *
 * Literal `describe` and literal straight-line `test` calls; loops live INSIDE tests, never
 * around them (the lighting census parks a table-driven file whole).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../helpers/codeOnlySource.js';
import {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_DORMANT_RULE_KEYS,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';
import { VIRTUAL_SUBSYSTEM_ROWS } from '../../src/domain/certification/subsystemRowsVirtual.js';
import {
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  simulationRuleKeys,
} from '../../src/domain/certification/subsystemCertification.js';
import { INTEL_COOLDOWN_LEDGER, intelTradeActive } from '../../src/domain/spatial/intelActs.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = vi.hoisted(() => ({ story: 0 }));

vi.mock('../../src/domain/worldPulse/routeNetworkConsumersRace.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // A STRICT pass-through: the original's answer, counted.
    storyArrivalTicks: (...args) => {
      calls.story += 1;
      return actual.storyArrivalTicks(...args);
    },
  };
});

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const KEY = 'intelTradeEnabled';
const LEAF = 'src/domain/spatial/intelActs.js';

/** @param {string} dir @param {string[]} out @returns {string[]} */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

/** Every src module as CODE: comments and string contents blanked, offsets kept. */
const SOURCES = walk(join(ROOT, 'src'))
  .filter((path) => /\.(js|jsx)$/.test(path))
  .map((path) => ({
    rel: relative(ROOT, path).replace(/\\/g, '/'),
    code: codeOnly(readFileSync(path, 'utf8')),
  }))
  .sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));

describe('IN-4 commit 1 (J-INA-4): intelTradeEnabled is declared, and the declaration moves nothing', () => {
  test('THE MEMBERSHIP SCAN: the key has exactly one code read in src, strict, inside intelTradeActive', () => {
    // NON-VACUITY FIRST: a scan that read nothing would pass the equality below on an empty set.
    expect(SOURCES.length).toBeGreaterThan(1000);
    const readers = SOURCES.filter((file) => /\bintelTradeEnabled\b/.test(file.code)).map((file) => file.rel);
    expect(readers).toEqual([LEAF]);
    const { code } = /** @type {{ code: string }} */ (SOURCES.find((file) => file.rel === LEAF));
    const hits = [...code.matchAll(/\bintelTradeEnabled\b/g)];
    expect(hits).toHaveLength(1);
    // The one read is the STRICT idiom on the JSDoc-cast receiver, and it sits inside the gate.
    const at = /** @type {number} */ (hits[0].index);
    expect(code.slice(at, at + 'intelTradeEnabled === true'.length)).toBe('intelTradeEnabled === true');
    const open = code.indexOf('export function intelTradeActive(');
    const close = code.indexOf('export function', open + 1);
    expect(open).toBeGreaterThan(-1);
    expect(at).toBeGreaterThan(open);
    expect(at).toBeLessThan(close);
    // …and it behaves as the strict idiom reads: only a literal true opens it.
    expect(intelTradeActive({ simulationRules: { intelTradeEnabled: true } })).toBe(true);
    expect(intelTradeActive({ simulationRules: {} })).toBe(false);
    expect(intelTradeActive({ simulationRules: { intelTradeEnabled: false } })).toBe(false);
    expect(intelTradeActive({ simulationRules: { intelTradeEnabled: 'true' } })).toBe(false);
    expect(intelTradeActive({ simulationRules: { intelTradeEnabled: 1 } })).toBe(false);
    expect(intelTradeActive(null)).toBe(false);
  });

  test('THE TWO DOORS: the deposit in generosityKernel and the consume arm in informationStatecraft call the gate, and nothing else does', () => {
    const callers = SOURCES
      .filter((file) => file.rel !== LEAF && /\bintelTradeActive\s*\(/.test(file.code))
      .map((file) => file.rel);
    expect(callers).toEqual([
      'src/domain/worldPulse/generosityKernel.js',
      'src/domain/worldPulse/informationStatecraft.js',
    ]);
    // Each door calls it once, so a deleted guard cannot hide behind a surviving one.
    for (const rel of callers) {
      const { code } = /** @type {{ code: string }} */ (SOURCES.find((file) => file.rel === rel));
      expect([...code.matchAll(/\bintelTradeActive\s*\(/g)], rel).toHaveLength(1);
    }
  });

  test('the manifest carries the key at its codepoint-sorted position, and the census and the registry carry its row', () => {
    const at = ENGINE_GATED_VIRTUAL_RULE_KEYS.indexOf(KEY);
    expect(at).toBeGreaterThan(0);
    // SR-7: its neighbours sort around it, so a parallel lane's sorted insertion merges cleanly.
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS[at - 1] < KEY).toBe(true);
    expect(KEY < ENGINE_GATED_VIRTUAL_RULE_KEYS[at + 1]).toBe(true);
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS.filter((key) => key === KEY)).toHaveLength(1);
    const row = VIRTUAL_SUBSYSTEM_ROWS.find((entry) => entry.rule === KEY);
    expect(row).toBeTruthy();
    expect(SUBSYSTEM_CERTIFICATION_REGISTRY.some((entry) => entry.rule === KEY)).toBe(true);
    expect(simulationRuleKeys()).toContain(KEY);
    expect(row?.module.split(',')).toEqual([
      LEAF,
      'src/domain/worldPulse/generosityKernel.js',
      'src/domain/worldPulse/informationStatecraft.js',
    ]);
    expect(row?.aliveness.stateKeys).toEqual([`spatialLedgers.${INTEL_COOLDOWN_LEDGER}`]);
    expect(row?.soakEvidence).toBe('indirect');
  });

  test('the declaration is byte-identical: no rules surface names the key, so it is dormant on every path', () => {
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, KEY)).toBe(false);
    const presets = Object.entries(SIMULATION_RULE_PRESETS);
    expect(presets.length).toBeGreaterThan(0);
    for (const [name, preset] of presets) {
      const rules = /** @type {Record<string, unknown>} */ ((preset && preset.rules) || {});
      expect(Object.prototype.hasOwnProperty.call(rules, KEY), `${name} names ${KEY}`).toBe(false);
    }
    // The DERIVED dark list agrees: a register member no surface lights is dormant.
    expect(ENGINE_GATED_DORMANT_RULE_KEYS).toContain(KEY);
  });

  test('the row channel is exact: one module writes the cooldown ledger, the one behind the gate', () => {
    expect(INTEL_COOLDOWN_LEDGER).toBe('intelCooldown');
    // The ledger's name reaches a writer only through the exported constant (codeOnly blanks
    // string literals, so a quoted spelling cannot hide a second writer from the scan below:
    // it is caught by the raw-text arm instead).
    const writers = SOURCES
      .filter((file) => /\b(?:setSpatialLedger|dropSpatialLedger)\s*\([^;]*\bINTEL_COOLDOWN_LEDGER\b/.test(file.code))
      .map((file) => file.rel);
    expect(writers).toEqual(['src/domain/worldPulse/generosityKernel.js']);
    const quoted = walk(join(ROOT, 'src'))
      .filter((path) => /\.(js|jsx)$/.test(path))
      .filter((path) => /(?:setSpatialLedger|dropSpatialLedger)\s*\([^;]*['"`]intelCooldown['"`]/.test(readFileSync(path, 'utf8')));
    expect(quoted).toEqual([]);
  });
});

// ════════════════════════════════════════════════════════════════════════════════════════════
// COMMIT 2 — THE ROAD: one race stage at the kept arrivals, the truth that arrived too late, and
// `reputationRaceEnabled` minted dark. Everything below drives the REAL writers of the ledgers the
// stage reads (the envoy errand writer, the npc ledger and ruling writers, the army record reader)
// and reads through the REAL readers, the writer/reader spelling-drift discipline.
// ════════════════════════════════════════════════════════════════════════════════════════════

const {
  REPUTATION_RACE_TUNING, RACE_ARRIVAL_KINDS, RACER_CONTEXTS, TOO_LATE_BEARERS, TOO_LATE_GAP_BANDS, TOO_LATE_KIND,
  actedOnTheStory, advanceReputationRace, raceAtArrival, reputationRaceActive, reputationRaceEntries, stagedArrivals,
  tooLateGapBand,
} = await import('../../src/domain/worldPulse/reputationRaceConsumer.js');
const { RACE_OUTCOMES, raceWinner, storyArrivalTicks } = await import('../../src/domain/worldPulse/routeNetworkConsumersRace.js');
const { advanceSettlementLifecycle } = await import('../../src/domain/worldPulse/settlementLifecycleKernel.js');
const { applyPulseMover, ensureWizardNewsFeed } = await import('../../src/domain/region/wizardNews.js');
const {
  PROVENANCE_GENERATED, emptyRouteNetwork, routeEdge, routeEdgeId, withRouteEdges, writeRouteNetwork,
} = await import('../../src/domain/worldPulse/routeNetworkLedger.js');
const {
  advanceEnvoyErrands, beginEnvoyReturn, closeEnvoyErrandsForNpcDeath, envoyErrandsOf, envoyOfferEpisodeKey,
  markEnvoyHome,
} = await import('../../src/domain/worldPulse/envoyErrand.js');
const { createNegotiationPicture } = await import('../../src/domain/worldPulse/negotiationPictures.js');
const { advanceEnvoyDiplomacyPulse } = await import('../../src/domain/worldPulse/envoyPulse.js');
const { applyWorldPulseOutcomes } = await import('../../src/domain/worldPulse/applyWorldPulse.js');
const { relationshipKeyFromEdge } = await import('../../src/domain/worldPulse/relationshipEvolution.js');
const { ensureRegionalGraph } = await import('../../src/domain/region/index.js');
const { armyRecordOf } = await import('../../src/domain/spatial/armyTransit.js');
const { getSpatialLedger, setSpatialLedger } = await import('../../src/domain/spatial/distanceRead.js');
const { npcLedgerOf, setNpcLedger } = await import('../../src/domain/worldPulse/npcLedger.js');
const { recordNpcRuling } = await import('../../src/domain/worldPulse/npcRulingRegister.js');
const { assignmentNewsItem } = await import('../../src/domain/worldPulse/npcDmVerbRecords.js');
const { releaseMigrationArrivals } = await import('../../src/domain/worldPulse/migrationKernel.js');
const { HABIT_FORK_REGISTRY } = await import('../../src/domain/worldPulse/habitForkRegistry.js');
const { INFORMATION_KINDS } = await import('../../src/domain/worldPulse/informationNews.js');
const { mintPhantom } = await import('../../src/domain/edit/phantoms.js');
const { IN4_REPUTATION_RACE_COUPLINGS } = await import('../../src/domain/certification/couplingRegistryInfo.js');
const { LIT_WAR_RULES, mintOne, peaceOffer } = await import('../helpers/errandSpineFixture.js');

const FLAG = 'reputationRaceEnabled';
/** THE LITERAL LIT DRIVE (the lit-coverage walker's flags arm reads it by spelling). */
const LIT = Object.freeze({ reputationRaceEnabled: true });
const RACE_LEAF = 'src/domain/worldPulse/reputationRaceConsumer.js';
const NOW = '2026-01-01T00:00:00.000Z';

// ⟦FIXTURE⟧ — THE VALE, the race module's own five seats (routeNetworkConsumersRace.test.js),
// with its lived roads: Brackwater is the hub, the Ashfen shortcut to Dunmoor is HIDDEN (no word
// rides it), and Crossford has no road at all (the isolation-as-fate seat). Measured through the
// real story walk: Ashfen to Dunmoor and Farholt to Dunmoor tell in ten ticks, Crossford never.
const VALE_DISTANCES = {
  ashfen: { brackwater: 2400, dunmoor: 1200, farholt: 3600, crossford: 300 },
  brackwater: { ashfen: 2400, dunmoor: 2400, farholt: 2400, crossford: 2700 },
  dunmoor: { ashfen: 1200, brackwater: 2400, farholt: 4800, crossford: 1500 },
  farholt: { ashfen: 3600, brackwater: 2400, dunmoor: 4800, crossford: 3900 },
  crossford: { ashfen: 300, brackwater: 2700, dunmoor: 1500, farholt: 3900 },
};
const VALE_TIERS = {
  ashfen: { brackwater: 2, dunmoor: 2, farholt: 2, crossford: 1 },
  brackwater: { ashfen: 2, dunmoor: 2, farholt: 2, crossford: 2 },
  dunmoor: { ashfen: 2, brackwater: 2, farholt: 3, crossford: 2 },
  farholt: { ashfen: 2, brackwater: 2, dunmoor: 3, crossford: 3 },
  crossford: { ashfen: 1, brackwater: 2, dunmoor: 2, farholt: 3 },
};
const SEATS = Object.freeze(['ashfen', 'brackwater', 'crossford', 'dunmoor', 'farholt']);
const NAME = Object.freeze({
  ashfen: 'Ashfen', brackwater: 'Brackwater', crossford: 'Crossford', dunmoor: 'Dunmoor', farholt: 'Farholt',
});
const SNAPSHOT = Object.freeze({
  settlements: SEATS.map((id) => ({ id, settlement: { id, name: NAME[id], institutions: [] } })),
});
/** @param {string} a @param {string} b @param {string} grade */
const edgeAt = (a, b, grade) => routeEdge({ a, b, grade, mode: 'land', provenance: 'generated', flavor: 'genesis', tick: 0 });

function valeDigest() {
  const gates = [];
  for (let i = 0; i < SEATS.length; i += 1) {
    for (let j = i + 1; j < SEATS.length; j += 1) {
      gates.push({ between: [SEATS[i], SEATS[j]], cost: VALE_DISTANCES[SEATS[i]][SEATS[j]] });
    }
  }
  return { settlementIds: [...SEATS], gates, distanceMatrix: VALE_DISTANCES, tiers: VALE_TIERS };
}

/** The Vale, canonized, its roads lived, the six envoy rules lit (their list includes the route lifecycle). */
function valeWorld(rules = {}) {
  return writeRouteNetwork({
    tick: 10,
    spatialCanonVersion: 1,
    spatialDigest: valeDigest(),
    simulationRules: { ...LIT_WAR_RULES, ...rules },
    relationshipStates: {},
  }, withRouteEdges(emptyRouteNetwork(), [
    edgeAt('ashfen', 'brackwater', 'road'),
    edgeAt('brackwater', 'dunmoor', 'road'),
    edgeAt('brackwater', 'farholt', 'road'),
    edgeAt('ashfen', 'dunmoor', 'hidden'),
  ]));
}

const TERMS = Object.freeze({ id: 'terms.vale.1', clauses: [{ kind: 'ceasefire', parties: ['dunmoor', 'ashfen'] }] });
const ROAD = Object.freeze({ id: 'road.vale', name: 'Vale Road' });

/**
 * ONE REAL ENVOY out of Dunmoor to Ashfen and home again, through the production writers only:
 * minted at 10, parlaying at 12, set out for home at 13 on `homeLegs` ([from, to, depart, arrive]),
 * and home at the last leg's arrival. `terms` null sends him home with nothing to tell.
 * @param {Record<string, unknown>} worldState
 * @param {{ homeLegs: Array<[string, string, number, number]>, terms?: unknown, until?: number }} args
 */
function envoyHome(worldState, { homeLegs, terms = TERMS, until = Infinity }) {
  const outcome = peaceOffer({ from: 'dunmoor', to: 'ashfen' });
  const minted = mintOne(worldState, {
    outcome,
    npcName: 'Brand Oller',
    routePlan: { legs: [{ fromId: 'dunmoor', toId: 'ashfen', departTick: 10, arrivalTick: 12 }], expectedReturnTick: 60, routeRef: ROAD },
  });
  expect(minted.reason, 'the production writer minted the envoy').toBe('minted');
  const errandId = minted.errand.id;
  let world = advanceEnvoyErrands({ worldState: advanceEnvoyErrands({ worldState: minted.worldState, tick: 11 }).worldState, tick: 12 }).worldState;
  const legs = homeLegs.map(([fromId, toId, departTick, arrivalTick]) => ({ fromId, toId, departTick, arrivalTick }));
  const home = legs[legs.length - 1].arrivalTick;
  const back = beginEnvoyReturn({
    worldState: world, errandId, routePlan: { legs, expectedReturnTick: home, routeRef: ROAD },
    ...(terms ? { termSheet: terms } : {}), tick: 13,
  });
  expect(back.reason, 'the production writer sent him home').toBe('returning');
  world = back.worldState;
  for (const leg of legs) {
    if (leg.arrivalTick > until) return { worldState: world, errandId, home, outcome };
    world = advanceEnvoyErrands({ worldState: world, tick: leg.arrivalTick }).worldState;
  }
  const done = markEnvoyHome({ worldState: world, errandId, tick: home });
  expect(done.reason, 'the production writer brought him home').toBe('home');
  return { worldState: done.worldState, errandId, home, outcome };
}

/** The court's resolved decision, as the chooser builds it and the misjudgment detector stamps it. */
const misjudgedDeploy = (observerId, subjectId, tick) => ({
  id: `candidate.strategy.deploy.${observerId}.${tick}`,
  candidateType: 'strategy_deploy',
  metadata: {
    settlementId: observerId, strategyMove: 'deploy', deployTargetId: subjectId,
    misjudgment: { observerId, subjectId, believedStrengthBand: 1, trueStrengthBand: 3, kinds: ['strength'] },
  },
});
/** @param {Record<string, unknown>} world @param {number} tick */
const withAct = (world, tick, observerId = 'dunmoor', subjectId = 'ashfen') => ({
  ...world, pulseHistory: [{ tick, selectedOutcomes: [misjudgedDeploy(observerId, subjectId, tick)] }],
});

/** One army column's record, through the ledger's own record normalizer. */
function withArmy(world, { path = ['farholt', 'brackwater', 'dunmoor'], departTick = 10, arrivalTick }) {
  const rec = armyRecordOf({
    armyId: path[0], role: 'march', originId: path[0], destId: path[path.length - 1], path,
    departTick, arrivalTick, position01: 1, strength: 100, readiness: 0.5, lastTick: arrivalTick,
  });
  return setSpatialLedger(world, 'armyTransit', { [path[0]]: rec });
}

/** One DM-assigned roamer placed at Dunmoor, through the npc ledger's and the ruling register's writers. */
function withExile(world, { notoriety = 'notorious', departed = 20, arrived, departure = 'farholt' }) {
  const placed = setNpcLedger(world, {
    roamers: {},
    placed: {
      wnpc_oda: {
        identityFacets: { name: 'Oda Vell', role: 'scribe' },
        reputation: { notorietyBand: notoriety, edictMark: 'banishment_edict', scandalClass: 'venality', alignmentRead: 'neutral', competenceRead: 'capable' },
        originRef: { settlementId: departure, rosterId: 'r.oda', name: 'Oda Vell' },
        verdictCause: 'banished',
        hostSettlementId: 'dunmoor',
        sinceTick: arrived,
      },
    },
    exclusions: {},
  });
  return recordNpcRuling(placed, assignmentNewsItem({
    wnpcId: 'wnpc_oda', who: 'Oda Vell', where: 'Dunmoor', settlementId: 'dunmoor', originSettlementId: departure,
    departureSettlementId: departure, overrides: [], tick: departed, inTransit: true,
  }));
}

/** @param {Record<string, unknown>} world @param {number} tick */
const raceAt = (world, tick) => advanceReputationRace({ snapshot: SNAPSHOT, worldState: world, tick });

/**
 * THE FENCE WORLD: three arrivals kept for tick 25, read at 26. The envoy's story reached Dunmoor at
 * 23 and his court acted at 24 (the jewel); the Farholt column's story reached Dunmoor at 20 (a
 * story-first column); Oda Vell left Farholt at 20 and arrived at 25, five ticks ahead of hers.
 */
function fenceWorld(rules = {}) {
  const envoy = envoyHome(valeWorld(rules), { homeLegs: [['ashfen', 'dunmoor', 13, 25]] });
  return withExile(withArmy(withAct(envoy.worldState, 24), { arrivalTick: 25 }), { arrived: 25 });
}

/**
 * The host's whole ANSWER, bytes and all: its vote, its news, its receipts and its updates, plus
 * whether the world it handed back is the very world it was given (the identity proves no write,
 * and keeping the input's own bytes out is what lets an explicit `false` compare with an absence).
 */
function hostDigest(world) {
  const result = advanceSettlementLifecycle({
    snapshot: SNAPSHOT, worldState: world, settlementUpdates: [], pIndex: null, rng: null, tick: 26, now: NOW,
  });
  const { worldState: out, ...answer } = result;
  return createHash('sha256').update(JSON.stringify({ ...answer, sameWorld: out === world })).digest('hex');
}

/**
 * THE PRE-IN-4 HOST'S DIGEST over the fence world with the key absent, computed with the host at
 * a84385666 (before the race stage was mounted) PLANTED over the tree and restored sha256-exact.
 */
const PRE_IN4_DARK_DIGEST = '73da17f2c2586dc44d60de684718f8d04a4c9fddf2d016d346aa987193516d53';

// ⟦FIXTURE, THE BUILT INTERCEPTION⟧ — tests/domain/envoyPulseWiring.test.js's own two-court world,
// COPIED (a test module is never imported by another), so the interception below is the BUILT
// envoyInterceptionStage reached through advanceEnvoyDiplomacyPulse, never a hand-made row: a real
// dispatch through the ordinary auto mouth, a real collision and a real custody. Ember (offerer)
// sues Vale (target) for peace over one road; a Vale column with a private imprisonment goal stands
// on the envoy's node at his arrival.
const W_NOW = '2026-08-03T00:00:00.000Z';
const W_EDGE = Object.freeze({ id: 'edge.offerer.target', from: 'offerer', to: 'target', relationshipType: 'hostile' });
const W_KEY = relationshipKeyFromEdge(W_EDGE);

/** @param {string} id @param {string} name @param {number} population @param {unknown[]} [npcs] */
function wiringSave(id, name, population, npcs = []) {
  return {
    id,
    name,
    settlement: {
      id, name, seed: `seed.${id}`, tier: 'town', population,
      config: { priorityEconomy: 30, priorityMilitary: 30, tradeRouteAccess: 'road' },
      economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ id: `${id}.seat`, faction: `${name} Seat`, power: 60, isGoverning: true }],
      },
      npcs,
      activeConditions: [],
    },
  };
}

function wiringOffer() {
  return {
    id: 'candidate.strategy.sue_for_peace.offerer.12', generatedAtTick: 12, type: 'relationship',
    candidateType: 'strategy_sue_for_peace', ruleFamily: 'strategy', targetSaveId: 'offerer',
    severity: 0.72, probability: 1, applyMode: 'auto', headline: 'Ember sues for peace', summary: 'Ember offers terms.',
    reasons: [], relationshipKey: W_KEY,
    relationshipPatch: { proposedRelationshipType: 'cold_war', trajectory: 'transitioning' },
    proposalPayload: {
      kind: 'relationship_label_change', relationshipKey: W_KEY, fromType: 'hostile', toType: 'cold_war', peaceOffer: true,
      offererId: 'offerer', targetId: 'target', peaceFrontOwnerId: 'offerer', peaceFrontSinceTick: 3, reason: 'Ember offered peace.',
    },
  };
}

function wiringFixture() {
  const saves = [
    wiringSave('offerer', 'Ember', 1000, [{ id: 'npc.mara', name: 'Mara Vale', role: 'Chancellor', importance: 'notable', status: 'active' }]),
    wiringSave('target', 'Vale', 12000),
  ];
  const graph = ensureRegionalGraph({ edges: [W_EDGE], channels: [] }, { now: W_NOW });
  const roadId = routeEdgeId('offerer', 'target', 'land');
  const worldState = {
    tick: 12,
    simulationRules: { ...LIT_WAR_RULES },
    relationshipStates: { [W_KEY]: { relationshipType: 'hostile', trust: 0.5, resentment: 0.2 } },
    deployments: {
      offerer: { targetId: 'target', sinceTick: 3, role: 'siege', maxStartStrength: 100, currentEffectiveStrength: 100, casusReasons: [] },
    },
    warExhaustion: { target: 1 },
    spatialLedgers: {
      warReasons: {},
      routeNetwork: {
        edges: {
          [roadId]: routeEdge({
            a: 'offerer', b: 'target', grade: 'road', mode: 'land', provenance: PROVENANCE_GENERATED, flavor: 'genesis', tick: 0, dominantFlowClass: null,
          }),
        },
        corridor: {},
      },
    },
  };
  const settlements = saves.map((row) => ({ id: row.id, name: row.name, save: row, settlement: row.settlement }));
  const snapshot = { settlements, byId: new Map(settlements.map((row) => [row.id, row])), regionalGraph: graph, worldState, campaign: {} };
  const settlementUpdates = saves.map((row) => ({ saveId: row.id, save: row, settlement: row.settlement }));
  return { graph, worldState, snapshot, settlementUpdates };
}

/** One real dispatch through the ordinary auto mouth. */
function wiringDispatch() {
  const f = wiringFixture();
  const applied = applyWorldPulseOutcomes({
    snapshot: { ...f.snapshot, worldState: f.worldState, regionalGraph: f.graph },
    worldState: f.worldState, regionalGraph: f.graph, wizardNews: { currentTick: 12, entries: [] },
    settlementMap: new Map(f.settlementUpdates.map((row) => [row.saveId, row])), outcomes: [wiringOffer()],
    tick: 12, now: W_NOW, advanceNewsTick: false, advanceRegionalImpacts: false, simulationRules: f.worldState.simulationRules,
  });
  return { f, applied, errand: envoyErrandsOf(applied.worldState)[0] };
}

/** A Vale column standing on the envoy's node, with a private imprisonment goal and its own frozen picture. */
function imprisoningColumn(worldState, node, tick) {
  const record = {
    armyId: 'army.reavers', role: 'march', originId: 'target', destId: 'offerer', path: [node, 'offerer'],
    departTick: tick, arrivalTick: tick + 20, position01: 0, strength: 100, readiness: 0.6, supplyQuality: 0.9,
    funding: 0.6, beliefStaleness: 0, lastTick: tick,
    commandPicture: createNegotiationPicture({
      id: 'army-picture.army.reavers', carrier: { kind: 'army', id: 'army.reavers' }, partyId: 'target', counterpartId: 'offerer',
      relationshipKey: W_KEY, episodeKey: envoyOfferEpisodeKey(wiringOffer()), frontOwnerId: 'offerer', frontSinceTick: 3,
      capturedTick: tick, causeStatus: 'live',
      subjects: [{ settlementId: 'target', strengthBand: 'strong', storesBand: 'stocked' }, { settlementId: 'offerer', strengthBand: 'ready', storesBand: 'thin' }],
      evidenceIds: [],
    }),
    envoyIntent: { kind: 'private_goal', intentId: 'reavers.imprison', privateGoals: ['imprison'] },
  };
  return setSpatialLedger(worldState, 'armyTransit', { ...(getSpatialLedger(worldState, 'armyTransit') || {}), [record.armyId]: record });
}

/** @param {{ f: ReturnType<typeof wiringFixture> }} wired @param {Record<string, unknown>} worldState @param {number} tick */
function wiringPulse({ f }, worldState, tick) {
  return advanceEnvoyDiplomacyPulse({
    worldState, snapshot: { ...f.snapshot, worldState, regionalGraph: f.graph }, regionalGraph: f.graph,
    wizardNews: { currentTick: tick, entries: [] }, settlementUpdates: f.settlementUpdates, tick, now: W_NOW, season: null,
    simulationRules: worldState.simulationRules,
  });
}

describe('IN-4 commit 2: the road, one race stage at the kept arrivals, reputationRaceEnabled minted dark', () => {
  test('FENCE 1 · own footprint: dark, the host returns the pre-IN-4 bytes over a world whose arrivals race the moment the key is lit', () => {
    const dark = fenceWorld();
    expect(reputationRaceActive(dark)).toBe(false);
    expect(hostDigest(dark)).toBe(PRE_IN4_DARK_DIGEST);
    // THE STORY LEG'S OWN FLAG, LIT IN SHIPPED PRESETS, LIGHTS NOTHING HERE (docs/DESIGN_FP_ARCH_IN.md
    // §2, the flag table's NOTE R3: the fences capture the ONE_REGEN presets' goldens too). Measured
    // with the a84385666 host PLANTED: under each of the four presets that carry the ONE_REGEN spread
    // (dramatic_campaign, full_simulation, living_realm, realistic_regional) the pre-IN-4 host gave
    // this same digest, the six envoy rules kept lit so the arrivals exist.
    const lighting = Object.keys(SIMULATION_RULE_PRESETS)
      .filter((name) => SIMULATION_RULE_PRESETS[name]?.rules?.distancePricedNewsEnabled === true);
    expect(lighting.length, 'a shipped preset lights the story leg').toBeGreaterThan(0);
    for (const name of lighting) {
      const world = fenceWorld({ ...SIMULATION_RULE_PRESETS[name].rules, ...LIT_WAR_RULES });
      expect(reputationRaceActive(world), name).toBe(false);
      expect(hostDigest(world), `${name}: the story leg's own flag lit, the race dark`).toBe(PRE_IN4_DARK_DIGEST);
    }
  });

  test('THE LIT-MUTANT CONTROL: the same world lit mints three beats, so every fence below can see', () => {
    const lit = fenceWorld(LIT);
    const result = raceAt(lit, 26);
    expect(result.worldState, 'the stage writes nothing').toBe(lit);
    expect(result.changed).toBe(true);
    expect(result.newsEntries.map((entry) => [entry.kind, entry.tags[2]]).sort()).toEqual([
      ['race_person', 'exile'], ['race_story', 'army'], ['word_came_too_late', 'envoy'],
    ]);
    expect(hostDigest(lit), 'lit, the host answer moves off the dark bytes').not.toBe(PRE_IN4_DARK_DIGEST);
  });

  test('FENCE 2 · absent, explicit false and every truthy non-true spelling are one output', () => {
    const absent = hostDigest(fenceWorld());
    for (const value of [false, 'true', 1, {}, null]) {
      expect(hostDigest(fenceWorld({ [FLAG]: value })), String(value)).toBe(absent);
    }
    expect(reputationRaceActive({ simulationRules: LIT })).toBe(true);
  });

  test('FENCE 3 · the call path: dark, the story walk is never reached; lit, it is', () => {
    const dark = fenceWorld();
    calls.story = 0;
    const quiet = raceAt(dark, 26);
    expect(quiet).toEqual({ worldState: dark, changed: false, newsEntries: [] });
    expect(calls.story, 'dark, not one story is walked').toBe(0);
    raceAt(fenceWorld(LIT), 26);
    expect(calls.story, 'lit, the pass-through spy is reached cross-module').toBeGreaterThan(0);
  });

  test('FENCE 4 · the gate polarity census: one read of the key in src, strict, in the leaf', () => {
    const reads = SOURCES.filter((file) => /\breputationRaceEnabled\b/.test(file.code));
    expect(reads.map((file) => file.rel)).toEqual([RACE_LEAF]);
    const code = reads[0].code;
    expect([...code.matchAll(/\breputationRaceEnabled\b/g)]).toHaveLength(1);
    expect(/\.reputationRaceEnabled === true/.test(code)).toBe(true);
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain(FLAG);
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, FLAG)).toBe(false);
    for (const [name, preset] of Object.entries(SIMULATION_RULE_PRESETS)) {
      const rules = /** @type {Record<string, unknown>} */ ((preset && preset.rules) || {});
      expect(Object.prototype.hasOwnProperty.call(rules, FLAG), `${name} lights the race (SR-6)`).toBe(false);
    }
  });

  test('THE MOUNT: the race stage votes through its own door on the dark host and on the lit host, and its beats survive the pulse mover', () => {
    for (const lifecycle of [undefined, true]) {
      const world = fenceWorld({ ...LIT, ...(lifecycle ? { settlementLifecycleEnabled: true } : {}) });
      const updates = [];
      const result = advanceSettlementLifecycle({
        snapshot: SNAPSHOT, worldState: world, settlementUpdates: updates, pIndex: null, rng: null, tick: 26, now: NOW,
      });
      expect(result.changed, `host flag ${String(lifecycle)}: the race's vote reaches the caller`).toBe(true);
      const kinds = result.newsEntries.map((entry) => entry.kind).filter((kind) => INFORMATION_KINDS.includes(kind)).sort();
      expect(kinds).toEqual(['race_person', 'race_story', 'word_came_too_late']);
      const moved = applyPulseMover(result, world, updates, ensureWizardNewsFeed({}), NOW);
      const kept = moved.wizardNews.entries.map((entry) => entry.kind).filter((kind) => INFORMATION_KINDS.includes(kind)).sort();
      expect(kept, `host flag ${String(lifecycle)}: the pulse mover keeps the beats`).toEqual(kinds);
    }
  });

  test('THE ARRIVALS: the three kept records are read on the next tick, with the ledgers\' own timing', () => {
    const lit = fenceWorld(LIT);
    expect(RACE_ARRIVAL_KINDS).toEqual(['army', 'envoy', 'exile']);
    const read = stagedArrivals(lit, 25).map((row) => [row.kind, row.originId, row.gateId, row.departTick, row.arrivalTick, row.racer, row.told]);
    expect(read).toEqual([
      ['army', 'farholt', 'dunmoor', 10, 25, 'column', true],
      ['envoy', 'ashfen', 'dunmoor', 13, 25, 'person', true],
      ['exile', 'farholt', 'dunmoor', 20, 25, 'person', true],
    ]);
    // anchored: the same world read at its own arrival tick answers three rows on the line above.
    expect(stagedArrivals(lit, 24), 'an arrival is read once, on the tick after it lands').toEqual([]);
  });

  test('THE RACE: the person leg is the record, the story walks the lived network, and RACE_OUTCOMES speaks verbatim', () => {
    const world = valeWorld(LIT);
    expect(storyArrivalTicks({ worldState: world, originId: 'ashfen', gateId: 'dunmoor' }).ticks).toBe(10);
    const at = (homeTick) => raceAt(envoyHome(world, { homeLegs: [['ashfen', 'dunmoor', 13, homeTick]] }).worldState, homeTick + 1)
      .newsEntries.map((entry) => entry.kind);
    expect(at(16), 'home at 16, the story due at 23').toEqual(['race_person']);
    expect(at(23), 'home the week the story lands').toEqual(['race_together']);
    expect(at(25), 'home two weeks behind it').toEqual(['race_story']);
    const severityAt = (homeTick) => raceAt(envoyHome(world, { homeLegs: [['ashfen', 'dunmoor', 13, homeTick]] }).worldState, homeTick + 1)
      .newsEntries[0].severity;
    expect([severityAt(16), severityAt(23)], 'a notable beat and a routine one').toEqual([
      REPUTATION_RACE_TUNING.NOTABLE_SEVERITY, REPUTATION_RACE_TUNING.ROUTINE_SEVERITY,
    ]);
    expect(RACE_OUTCOMES).toEqual(['person', 'story', 'together', 'neither']);
    const raceKinds = INFORMATION_KINDS.filter((kind) => kind.startsWith('race_'));
    expect(raceKinds).toEqual(RACE_OUTCOMES.filter((token) => token !== 'neither').map((token) => `race_${token}`));
    const quoted = [...SOURCES.find((file) => file.rel === RACE_LEAF).code.matchAll(/\bperson_first\b|\bstory_first\b/g)];
    // anchored: the leaf is read above (its gate read found once), so this is a scan of real code.
    expect(quoted).toEqual([]);
  });

  test('THE TRIVIAL RACE IS SILENT, and each seeded twin speaks', () => {
    const world = valeWorld(LIT);
    const told = envoyHome(world, { homeLegs: [['ashfen', 'dunmoor', 13, 16]] });
    const silent = envoyHome(world, { homeLegs: [['ashfen', 'dunmoor', 13, 16]], terms: null });
    expect(raceAt(told.worldState, 17).newsEntries.map((entry) => entry.kind), 'home with terms').toEqual(['race_person']);
    // anchored: the twin above, identical but for the verdict he carries, speaks.
    expect(raceAt(silent.worldState, 17).newsEntries, 'home with nothing to tell').toEqual([]);
    expect(raceAt(withExile(world, { arrived: 25 }), 26).newsEntries.map((entry) => entry.kind), 'a notorious exile').toEqual(['race_person']);
    // anchored: the notorious twin on the line above speaks.
    expect(raceAt(withExile(world, { arrived: 25, notoriety: 'unknown' }), 26).newsEntries, 'a man nobody talks of').toEqual([]);
    // anchored: the same notorious exile out of Farholt speaks above; out of Crossford no telling can follow him.
    expect(raceAt(withExile(world, { arrived: 25, departure: 'crossford' }), 26).newsEntries, 'a story with no road').toEqual([]);
    expect(raceAt(withArmy(world, { arrivalTick: 25 }), 26).newsEntries.map((entry) => entry.kind), 'a column to Dunmoor').toEqual(['race_story']);
    // anchored: the Dunmoor column above speaks; Crossford has no road a telling can walk.
    expect(raceAt(withArmy(world, { path: ['farholt', 'crossford'], arrivalTick: 25 }), 26).newsEntries, 'a column to Crossford').toEqual([]);
  });

  test('THE RACER\'S VOICE: a column that outruns its story says nothing, and one its story outruns speaks only of a column', () => {
    const world = valeWorld(LIT);
    const ahead = raceAt(withArmy(world, { arrivalTick: 11 }), 12);
    // anchored: the story-first column on the next line speaks through the same producer.
    expect(ahead.newsEntries, 'no annex sentence voices a column ahead of its story').toEqual([]);
    const behind = raceAt(withArmy(world, { arrivalTick: 25 }), 26).newsEntries[0];
    expect(behind.summary).toBe('Word travels light. Men travel with baggage.');
    expect(behind.familyId).toBe('race_story.5');
    expect(RACER_CONTEXTS).toEqual(['column', 'person']);
  });

  test('THE TRUTH THAT ARRIVED TOO LATE: the court acted on the story, the true account came after, and nothing already acted on is changed', () => {
    const world = valeWorld(LIT);
    const home = envoyHome(world, { homeLegs: [['ashfen', 'dunmoor', 13, 25]] }).worldState;
    const acted = withAct(home, 24);
    const before = JSON.stringify(acted.pulseHistory);
    const result = raceAt(acted, 26);
    const [beat] = result.newsEntries;
    expect(beat.kind).toBe(TOO_LATE_KIND);
    expect(beat.sourceEventId, 'the receipt names the act it came too late for').toBe('candidate.strategy.deploy.dunmoor.24');
    expect(beat.reasons).toEqual([
      'The word out of Ashfen reached Dunmoor before Brand Oller did.',
      'The seat at Dunmoor acted on the story before Brand Oller came home, and the true account came weeks behind it.',
    ]);
    expect(beat.audience).toBe('public');
    expect(result.worldState, 'the stage hands back the very world it read').toBe(acted);
    expect(JSON.stringify(acted.pulseHistory), 'the act stands exactly as recorded').toBe(before);
    // Each one-clause twin is a race_story, never a late truth.
    expect(raceAt(withAct(home, 22), 26).newsEntries[0].kind, 'acted before the story arrived').toBe('race_story');
    expect(raceAt(withAct(home, 25), 26).newsEntries[0].kind, 'acted the week he came home').toBe('race_story');
    expect(raceAt(withAct(home, 24, 'brackwater'), 26).newsEntries[0].kind, 'another court acted').toBe('race_story');
    expect(raceAt(withAct(home, 24, 'dunmoor', 'farholt'), 26).newsEntries[0].kind, 'about another court').toBe('race_story');
    expect(TOO_LATE_BEARERS).toEqual(['envoy']);
    const [bearer] = stagedArrivals(acted, 25);
    expect(actedOnTheStory(acted, bearer, 23)).toEqual({ tick: 24, outcomeId: 'candidate.strategy.deploy.dunmoor.24' });
    // anchored: the envoy's own arrival finds the act on the line above; the same arrival borne by any other racer finds none.
    expect(actedOnTheStory(acted, { ...bearer, kind: 'army' }, 23), 'a column bears no court-level telling').toBeNull();
    expect(actedOnTheStory(acted, { ...bearer, kind: 'exile' }, 23), 'nor does an exile').toBeNull();
    expect(TOO_LATE_GAP_BANDS.map((_, index) => tooLateGapBand([1, 4, 13, 14][index]))).toEqual([...TOO_LATE_GAP_BANDS]);
    expect(REPUTATION_RACE_TUNING.GAP_A_WEEK_MAX < REPUTATION_RACE_TUNING.GAP_WEEKS_MAX).toBe(true);
  });

  test('THE DOUBLE AGENT\'S DETOUR IS LATE: a leg through a third seat costs real ticks, and the race reads them', () => {
    const world = valeWorld(LIT);
    const direct = envoyHome(world, { homeLegs: [['ashfen', 'dunmoor', 13, 22]] });
    const detour = envoyHome(world, { homeLegs: [['ashfen', 'brackwater', 13, 17], ['brackwater', 'dunmoor', 18, 24]] });
    expect(detour.home - direct.home, 'the detour cost the legs it walked').toBe(2);
    const direct1 = stagedArrivals(direct.worldState, direct.home)[0];
    const detour1 = stagedArrivals(detour.worldState, detour.home)[0];
    expect([direct1.arrivalTick, detour1.arrivalTick]).toEqual([22, 24]);
    expect(raceAtArrival(direct.worldState, direct1).winner).toBe('person');
    expect(raceAtArrival(detour.worldState, detour1).winner, 'the lateness is the tell').toBe('story');
    expect(raceAt(detour.worldState, 25).newsEntries.map((entry) => entry.kind)).toEqual(['race_story']);
  });

  test('THE INTERCEPTED DEMAND LEAVES THE MISREADING STANDING (cross-pinned on the BUILT envoyInterceptionStage), and the DM-KILL twin with it', () => {
    const world = valeWorld(LIT);
    const twin = withAct(envoyHome(world, { homeLegs: [['ashfen', 'dunmoor', 13, 25]] }).worldState, 24);
    expect(raceAt(twin, 26).newsEntries.map((entry) => entry.kind), 'the envoy who came home is a late truth').toEqual([TOO_LATE_KIND]);

    // THROUGH THE BUILT STAGE: the collision and the custody are advanceEnvoyDiplomacyPulse's own
    // (envoyInterceptionStage's markSharedCutEncounters, then resolveStartInterceptions a tick later).
    const wired = wiringDispatch();
    expect(wired.errand.state, 'a real envoy is on the road').toBe('travelling');
    const arrival = Number(wired.errand.legs[0].arrivalTick);
    const collided = wiringPulse(wired, imprisoningColumn(wired.applied.worldState, 'target', arrival), arrival);
    expect(envoyErrandsOf(collided.worldState)[0].state, 'the stage stops him').toBe('intercepted');
    const custody = wiringPulse(wired, collided.worldState, arrival + 1);
    expect(envoyErrandsOf(custody.worldState)[0].state, 'the stage holds him').toBe('held');
    // His court misreads Vale while he sits in custody, and no true account is ever carried home.
    const held = {
      ...custody.worldState,
      simulationRules: { ...custody.worldState.simulationRules, ...LIT },
      pulseHistory: [{ tick: arrival + 2, selectedOutcomes: [misjudgedDeploy('offerer', 'target', arrival + 2)] }],
    };
    const before = JSON.stringify(held.pulseHistory);
    const heard = [];
    // Every tick until the column itself reaches Ember (its own arrival is a race of its own).
    for (let tick = arrival + 2; tick <= arrival + 20; tick += 1) {
      heard.push(...advanceReputationRace({ snapshot: wired.f.snapshot, worldState: held, tick }).newsEntries);
    }
    // anchored: the Vale envoy at the top of this test, brought home by the same writers, speaks; a held envoy has no homecoming to race.
    expect(heard, 'held, he never comes home, so no race runs and no late truth reaches the act').toEqual([]);
    expect(JSON.stringify(held.pulseHistory), 'the misreading stands exactly as recorded').toBe(before);

    const walking = envoyHome(world, { homeLegs: [['ashfen', 'dunmoor', 13, 25]], until: 20 });
    const killed = closeEnvoyErrandsForNpcDeath({ worldState: walking.worldState, npcId: 'npc.envoy.1', tick: 20, cause: 'dm_removed' });
    expect(envoyErrandsOf(killed.worldState).map((row) => row.state)).toEqual(['lost']);
    // anchored: the same envoy, home at 25, is the speaking twin at the top of this test.
    expect(raceAt(withAct(killed.worldState, 24), 26).newsEntries, 'killed on the road, he never races').toEqual([]);
  });

  test('THE LISTENERS: a house at the gate hears the story sooner, and only while the brokerage layer is lit', () => {
    const world = valeWorld(LIT);
    const arrival = stagedArrivals(withArmy(world, { arrivalTick: 25 }), 25)[0];
    expect(raceAtArrival(world, arrival).storyAt).toBe(20);
    expect(raceAtArrival(world, arrival, 1).storyAt, 'a fully competent house hears half the road sooner').toBe(15);
    const market = {
      name: 'Whisper market', tags: ['criminal', 'information', 'brokerage'],
      serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'],
    };
    const heard = {
      settlements: SNAPSHOT.settlements.map((row) => (row.id === 'dunmoor'
        ? { ...row, settlement: { ...row.settlement, institutions: [market] } } : row)),
    };
    const houses = { ...LIT, infoMode: 'full', infoStatecraftEnabled: true, informationBrokeragesEnabled: true };
    const column = (rules, snapshot) => advanceReputationRace({
      snapshot, worldState: withArmy(valeWorld(rules), { arrivalTick: 18 }), tick: 19,
    }).newsEntries.map((entry) => entry.kind);
    // anchored: the lit layer with the house, two lines down, speaks over the same column.
    expect(column(LIT, heard), 'no brokerage layer: the column outruns its story and says nothing').toEqual([]);
    // anchored: the same.
    expect(column(houses, SNAPSHOT), 'the layer lit and no house at the gate').toEqual([]);
    expect(column(houses, heard), 'the house at Dunmoor hears the march before the column is in sight').toEqual(['race_story']);
  });

  test('THE REFUGEE COLUMN KEEPS NO ARRIVAL: the release strips the origin and deletes the column, so the race has nothing to read', () => {
    const column = { originId: 'farholt', destId: 'dunmoor', arrivals: 40, departTick: 10, arrivalTick: 25 };
    const world = setSpatialLedger(valeWorld(LIT), 'migration', { 'farholt>dunmoor@10': column });
    const settlements = SNAPSHOT.settlements.map((row) => ({ ...row, settlement: { ...row.settlement, population: 500 } }));
    const local = new Map(settlements.map((row) => [row.id, row.settlement]));
    const released = releaseMigrationArrivals({ worldState: world, localSettlements: local, settlements, tick: 25 });
    expect(released.arrivals.map((row) => Object.keys(row).sort())).toEqual([['count', 'destId']]);
    expect(Object.keys(getSpatialLedger(released.worldState, 'migration') || {}), 'the landed column is gone').toEqual([]);
    expect(RACE_ARRIVAL_KINDS.includes('refugee')).toBe(false);
    // anchored: the fence world above reads three arrivals through this same reader.
    expect(stagedArrivals(released.worldState, 25), 'nothing kept, nothing raced').toEqual([]);
  });

  test('THE RECORDS ROUND-TRIP THROUGH JSON, and a phantom counterparty in the snapshot costs nothing', () => {
    const lit = fenceWorld(LIT);
    const once = raceAt(lit, 26).newsEntries;
    const again = raceAt(JSON.parse(JSON.stringify(lit)), 26).newsEntries;
    expect(again).toEqual(once);
    const phantom = mintPhantom('seed.in-4', 'Greymoor', 0, { mintId: (seed, kind, n) => `dm:${kind}:${n}`, roll: (pool) => `${pool}.word` });
    const withPhantom = { settlements: [...SNAPSHOT.settlements, phantom] };
    let threw = '';
    try {
      const read = advanceReputationRace({ snapshot: withPhantom, worldState: lit, tick: 26 }).newsEntries;
      expect(read).toEqual(once);
      expect(read.flatMap((entry) => entry.settlementIds).length).toBeGreaterThan(0);
      // anchored: the beats on the line above carry their seats, so the absence is a fact about them.
      expect(read.flatMap((entry) => entry.settlementIds)).not.toContain(phantom.id);
    } catch (error) {
      threw = String(error);
    }
    expect(threw, 'a phantom record beside the courts throws nothing').toBe('');
  });

  test('THE VERDICT LAW HAS ONE SPELLING: raceWinner is the order law reputationRace answers through', () => {
    const cases = [
      [false, 0, false, 0, 'neither'], [true, 3, false, 0, 'person'], [false, 0, true, 3, 'story'],
      [true, 2, true, 3, 'person'], [true, 3, true, 2, 'story'], [true, 3, true, 3, 'together'],
    ];
    for (const [personArrives, personTicks, storyArrives, storyTicks, winner] of cases) {
      expect(raceWinner({ personArrives, personTicks, storyArrives, storyTicks })).toBe(winner);
    }
    const raceSource = readFileSync(join(ROOT, 'src/domain/worldPulse/routeNetworkConsumersRace.js'), 'utf8');
    expect((codeOnly(raceSource).match(/journey\.ticks < story\.ticks/g) || []).length, 'no second copy of the law').toBe(0);
    expect(/const winner = raceWinner\(/.test(codeOnly(raceSource))).toBe(true);
  });

  test('THE EDITOR AND THE REGISTERS: the fork note, the three couplings, and a race that stores nothing', () => {
    const row = HABIT_FORK_REGISTRY.find((entry) => entry.forkId === 'HBF-79');
    expect(row.closeOwed).toContain('A NOTE FROM THE ROAD WAVE');
    expect(HABIT_FORK_REGISTRY.filter((entry) => String(entry.module).includes('reputationRaceConsumer'))).toEqual([]);
    expect(IN4_REPUTATION_RACE_COUPLINGS.map((entry) => [entry.pairId, entry.direction, entry.read.split('#')[0]])).toEqual([
      ['CPL-9', 'TRADE→INFO', RACE_LEAF],
      ['CPL-4', 'WAR→INFO', RACE_LEAF],
      ['CPL-19', 'GRAMMAR→INFO', RACE_LEAF],
    ]);
    const code = SOURCES.find((file) => file.rel === RACE_LEAF).code;
    expect(/\b(?:setSpatialLedger|dropSpatialLedger|writeErrands|setNpcLedger|recordNpcRuling)\s*\(/.test(code), 'the leaf writes no ledger').toBe(false);
    expect(/\b(?:createPRNG|hash01|Math\.random)\b/.test(code), 'the leaf draws nothing').toBe(false);
  });
});
