import { describe, expect, test } from 'vitest';

import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { evaluateSettlementStrategyRules } from '../../src/domain/worldPulse/settlementStrategy.js';
import {
  stampWarIntent, consumeWarIntent, warIntentFor, intentTargetOrder, intentNamesTarget,
  hostileTargetsOf, WAR_INTENT_LEDGER_KEY, WAR_INTENT_TTL_TICKS,
} from '../../src/domain/worldPulse/warIntent.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// JOIN 1 — THE RESOLVED MARCH. The settlement-tier strategy chooser's `deploy`
// move used to be a HEADLINE: it emitted an army_deployed posture marker and a feed
// line and nothing else, while evaluateWarLayer never read strategyMove or anything
// else the chooser produced. Wars began entirely elsewhere, against whichever hostile
// neighbour sorted first.
//
// These pins hold the join shut in both directions:
//   • THE OPENER — a resolved march opens a REAL war (a deployments record + a
//     war_front channel), in a world where the mechanical gate opens none.
//   • THE FEASIBILITY GATE — a HOPELESS march is still refused, order or no order.
//   • THE TARGET — the war that opens is the war the seat resolved on.
//   • DRAW ACCOUNTING — the new consumer forks no rng and steals no draw: the seeded
//     stream is byte-identical with and without a live order, on both sides of the seam.
//   • DORMANCY — chooser dark ⇒ no ledger key ⇒ the war layer is byte-identical.
//   • THE LIFECYCLE — the order expires, and is consumed the tick it is obeyed.
//
// There is still exactly ONE opener: warIntent.js mints no front, seeds no deployment
// and writes no posture. It carries a decision across the tick boundary (the chooser
// runs at rollCandidates, AFTER the war layer) and nothing else.
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: patch.econ ?? 15, priorityMilitary: patch.mil ?? 70 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 70, label: 'Stable' },
      factions: patch.factions || [
        { faction: 'War Council', category: 'military', power: 90, isGoverning: true },
        { faction: 'Merchant League', category: 'economy', power: 20 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: patch.activeConditions || [],
  };
}

const save = (id, name, patch = {}) => ({
  id, name, phase: 'canon', settlement: settlement(name, patch),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

// The tiers below are chosen against a MEASURED settlementStrength ladder (city
// 0.811, large town 0.711, town 0.682, hamlet 0.540, thorpe 0.436). The pins turn on
// where a pair falls relative to CONQUEST_MARGIN (0.12) and HOSTILE_CONFIDENCE (0.42):
//   city vs LARGE TOWN → margin 0.100 — INSIDE the chooser's deploy band (>0.05) and
//     BELOW the opener's mechanical margin, so the mechanical path opens nothing here
//     and only a resolved march can. This pair is what makes THE OPENER pin real
//     rather than a restatement of what the war layer already did.
//   city vs hamlet     → margin 0.272 — the mechanical path opens this one unaided.
const CITY = { tier: 'city', population: 45000 };
const LARGE_TOWN = { tier: 'town', population: 9000 };
const HAMLET = { tier: 'village', population: 280, legitimacy: 24, mil: 20, factions: [
  { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
  { faction: 'Hedge Wardens', category: 'military', power: 22 },
] };

const MOBILIZED = { state: 'mobilized', progress: 1, sinceTick: 0 };

/** Build a hostile star: `strong` versus every other id, at a war-ready posture. */
function world(spec, { extraState = {}, tick = 6 } = {}) {
  const saves = spec.map(([id, name, v]) => save(id, name, v));
  const edges = spec.slice(1).map(([id]) => ({ id: `edge.strong.${id}`, from: 'strong', to: id, relationshipType: 'hostile' }));
  const relationshipStates = Object.fromEntries(edges.map(e => [e.id, { relationshipType: 'hostile' }]));
  const worldState = {
    rngSeed: 'join1-seed',
    tick,
    relationshipStates,
    simulationRules: { warLayerEnabled: true, settlementStrategyEnabled: true },
    warPosture: { strong: MOBILIZED },
    ...extraState,
  };
  const campaign = {
    id: 'join1', name: 'Join1', settlementIds: spec.map(([id]) => id), worldState,
    regionalGraph: ensureRegionalGraph({ edges, channels: [] }),
    wizardNews: { currentTick: tick, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  return { snapshot, pIdx: pressureIndex(deriveSettlementPressures(snapshot)), worldState, saves, campaign };
}

/** Run the ONE opener over a world state, with a fresh seeded stream each time. */
const openWars = (snapshot, worldState, tick = 6) => evaluateWarLayer({
  snapshot, worldState, rng: createPRNG('join1-war'), tick, now: NOW,
  rules: { warLayerEnabled: true, settlementStrategyEnabled: true },
});

const frontsOf = war => war.graphChannels
  .filter(c => c.type === 'war_front')
  .map(c => `${c.from}->${c.to}`)
  .sort();

/** An rng that RECORDS every fork key and every draw — the draw-accounting instrument. */
function recordingRng(label, log) {
  const inner = createPRNG(label);
  const wrap = (rng, path) => ({
    random: () => { log.push(`draw@${path}`); return rng.random(); },
    fork: (key) => { log.push(`fork@${path}:${key}`); return wrap(rng.fork(key), `${path}/${key}`); },
  });
  return wrap(inner, label);
}

describe('JOIN 1 — the chooser makes its march machine-readable', () => {
  test('a deploy decision names its target in metadata (the twin of recallTargetId)', () => {
    const { snapshot, pIdx } = world([['strong', 'Ironhold', CITY], ['mid', 'Midvale', LARGE_TOWN]]);
    let deploy = null;
    for (let i = 0; i < 64 && !deploy; i += 1) {
      const c = evaluateSettlementStrategyRules(snapshot, pIdx, {
        tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG(`meta-${i}`),
      }).find(x => x.candidateType === 'strategy_deploy');
      if (c) deploy = c;
    }
    expect(deploy).toBeTruthy();
    expect(deploy.metadata.strategyMove).toBe('deploy');
    // The target used to live ONLY in the prose summary; now the war layer can read it.
    expect(deploy.metadata.deployTargetId).toBe('mid');
    expect(deploy.summary).toContain('Midvale');
  });

  test('a non-deploy move carries no order (drop-when-empty)', () => {
    const { snapshot, pIdx } = world([['strong', 'Ironhold', CITY], ['mid', 'Midvale', LARGE_TOWN]]);
    const all = [];
    for (let i = 0; i < 64; i += 1) {
      all.push(...evaluateSettlementStrategyRules(snapshot, pIdx, {
        tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: createPRNG(`nodeploy-${i}`),
      }));
    }
    const others = all.filter(c => c.candidateType !== 'strategy_deploy');
    expect(others.length).toBeGreaterThan(0);
    for (const c of others) expect(c.metadata.deployTargetId).toBeUndefined();
  });
});

describe('JOIN 1 — THE OPENER: a resolved march opens a real war', () => {
  test('state proves it: no order ⇒ no deployment and no front; an order ⇒ both', () => {
    const { snapshot, worldState } = world([['strong', 'Ironhold', CITY], ['mid', 'Midvale', LARGE_TOWN]]);

    // The mechanical path refuses this matchup: `strong` is war-ready, confident and
    // feasibility-plausible against `mid`, but the pair sits inside CONQUEST_MARGIN.
    const unordered = openWars(snapshot, worldState);
    expect(unordered.deployments).toEqual({});
    expect(frontsOf(unordered)).toEqual([]);

    // The seat resolved to march last tick. The SAME opener, the SAME seed, now opens
    // the war: a real deployments record and a real war_front channel.
    const ordered = stampWarIntent(worldState, 'strong', 'mid', 5);
    const war = openWars(snapshot, ordered);
    expect(Object.keys(war.deployments)).toEqual(['strong']);
    expect(war.deployments.strong.targetId).toBe('mid');
    expect(war.deployments.strong.role).toBe('siege');
    expect(frontsOf(war)).toEqual(['strong->mid']);
    // …and the opener announces it as its own siege-initiation outcome, not as a
    // second opener bolted on beside it.
    const init = war.outcomes.filter(o => o.candidateType === 'strategy_deploy');
    expect(init).toHaveLength(1);
    expect(init[0].ruleId).toBe('war_layer_strategy_deploy');
    expect(init[0].sourceEventTargetId).toBe('mid');
  });

  test('the order does not bypass the mobilization posture gate — no settlement sieges from peace', () => {
    const { snapshot, worldState } = world([['strong', 'Ironhold', CITY], ['mid', 'Midvale', LARGE_TOWN]], {
      extraState: { warPosture: {} },   // at peace, order or no order
    });
    const ordered = stampWarIntent(worldState, 'strong', 'mid', 5);
    expect(openWars(snapshot, ordered).deployments).toEqual({});
    // Non-vacuity: the identical world at a war-ready posture DOES open on the order.
    const readied = stampWarIntent({ ...worldState, warPosture: { strong: MOBILIZED } }, 'strong', 'mid', 5);
    expect(Object.keys(openWars(snapshot, readied).deployments)).toEqual(['strong']);
  });
});

describe('JOIN 1 — THE FEASIBILITY GATE still refuses a hopeless war', () => {
  test('a thorpe ordered onto a city opens nothing; the same thorpe opens a feasible war', () => {
    // `weak` clears HOSTILE_CONFIDENCE (0.42) so the refusal below can only come from
    // the hard capacity gate, not from the confidence floor.
    const spec = [['strong', 'Ironhold', CITY], ['weak', 'Thornmere', HAMLET], ['prey', 'Ashcott', HAMLET]];
    const saves = spec.map(([id, name, v]) => save(id, name, v));
    const edges = [
      { id: 'edge.weak.strong', from: 'weak', to: 'strong', relationshipType: 'hostile' },
      { id: 'edge.weak.prey', from: 'weak', to: 'prey', relationshipType: 'hostile' },
    ];
    const worldState = {
      rngSeed: 'join1-seed', tick: 6,
      relationshipStates: Object.fromEntries(edges.map(e => [e.id, { relationshipType: 'hostile' }])),
      simulationRules: { warLayerEnabled: true },
      warPosture: { weak: MOBILIZED },
    };
    const campaign = {
      id: 'join1h', name: 'Join1H', settlementIds: spec.map(([id]) => id), worldState,
      regionalGraph: ensureRegionalGraph({ edges, channels: [] }),
      wizardNews: { currentTick: 6, entries: [] },
    };
    const snapshot = buildWorldSnapshot({ campaign, saves, worldState });

    // ORDERED onto the city it cannot possibly storm: refused. The order buys the
    // waiver of a heuristic pre-filter, never of classifyFeasibility.
    const hopeless = stampWarIntent(worldState, 'weak', 'strong', 5);
    const refused = openWars(snapshot, hopeless);
    expect(refused.deployments.weak).toBeUndefined();
    expect(frontsOf(refused)).toEqual([]);

    // NON-VACUITY: the same besieger, the same tick, ordered onto a peer it CAN storm
    // — the war opens. So the refusal above is the feasibility gate speaking, not the
    // order being ignored wholesale.
    const feasible = stampWarIntent(worldState, 'weak', 'prey', 5);
    const opened = openWars(snapshot, feasible);
    expect(opened.deployments.weak?.targetId).toBe('prey');
  });
});

describe('JOIN 1 — THE TARGET: the war that opens is the one the seat resolved on', () => {
  test('an order redirects the opener off its codepoint-first default', () => {
    // Two equally-besiegable hostiles. Unaided, the opener takes `alpha` (codepoint
    // first). The seat resolving on `zeta` moves the actual war.
    const spec = [['strong', 'Ironhold', CITY], ['alpha', 'Alderfen', HAMLET], ['zeta', 'Zephyr Mill', HAMLET]];
    const { snapshot, worldState } = world(spec);

    const byDefault = openWars(snapshot, worldState);
    expect(byDefault.deployments.strong.targetId).toBe('alpha');
    expect(frontsOf(byDefault)).toEqual(['strong->alpha']);

    const redirected = openWars(snapshot, stampWarIntent(worldState, 'strong', 'zeta', 5));
    expect(redirected.deployments.strong.targetId).toBe('zeta');
    expect(frontsOf(redirected)).toEqual(['strong->zeta']);
  });

  test('an order naming a target the opener is not offering falls through to the default', () => {
    const spec = [['strong', 'Ironhold', CITY], ['alpha', 'Alderfen', HAMLET]];
    const { snapshot, worldState } = world(spec);
    // `ghost` is on no hostile edge — the order cannot invent a war out of it.
    const stray = openWars(snapshot, stampWarIntent(worldState, 'strong', 'ghost', 5));
    expect(stray.deployments.strong.targetId).toBe('alpha');
  });
});

describe('JOIN 1 — DRAW ACCOUNTING: the seeded stream is unmoved', () => {
  test('the opener forks and draws identically with and without a live order, in a world where nothing deploys', () => {
    // Nothing can deploy here: `strong` is at peace posture, so step 4 exits before any
    // target is considered. A resolved march is nevertheless on the ledger.
    const { snapshot, worldState } = world([['strong', 'Ironhold', CITY], ['mid', 'Midvale', LARGE_TOWN]], {
      extraState: { warPosture: {} },
    });
    const bare = [];
    const withOrder = [];
    evaluateWarLayer({ snapshot, worldState, rng: recordingRng('war-layer', bare), tick: 6, now: NOW, rules: { warLayerEnabled: true } });
    evaluateWarLayer({
      snapshot, worldState: stampWarIntent(worldState, 'strong', 'mid', 5),
      rng: recordingRng('war-layer', withOrder), tick: 6, now: NOW, rules: { warLayerEnabled: true },
    });
    expect(withOrder).toEqual(bare);
  });

  test('an UNOBEYABLE order steals no draw from a siege that IS rolling (non-vacuous accounting)', () => {
    // A live siege (strong besieging alpha) whose verdict roll DOES draw, plus a
    // resolved march by a besieger that cannot act on it. The recorded fork/draw
    // sequence must be identical — the intent read is pure.
    const spec = [['strong', 'Ironhold', CITY], ['alpha', 'Alderfen', HAMLET], ['weak', 'Thornmere', HAMLET]];
    const saves = spec.map(([id, name, v]) => save(id, name, v));
    const edges = [
      { id: 'edge.strong.alpha', from: 'strong', to: 'alpha', relationshipType: 'hostile' },
      { id: 'edge.weak.alpha', from: 'weak', to: 'alpha', relationshipType: 'hostile' },
    ];
    const channels = [{
      id: 'chan.war.strong.alpha', type: 'war_front', from: 'strong', to: 'alpha',
      status: 'confirmed', strength: 0.7, confidence: 0.8,
    }];
    const worldState = {
      rngSeed: 'join1-seed', tick: 6,
      relationshipStates: Object.fromEntries(edges.map(e => [e.id, { relationshipType: 'hostile' }])),
      simulationRules: { warLayerEnabled: true },
      warPosture: { strong: MOBILIZED },   // `weak` is at peace ⇒ its order is unobeyable
      deployments: { strong: { targetId: 'alpha', sinceTick: 4, role: 'siege', deploymentAge: 2 } },
    };
    const campaign = {
      id: 'join1d', name: 'Join1D', settlementIds: spec.map(([id]) => id), worldState,
      regionalGraph: ensureRegionalGraph({ edges, channels }), wizardNews: { currentTick: 6, entries: [] },
    };
    const snapshot = buildWorldSnapshot({ campaign, saves, worldState });

    const bare = [];
    const withOrder = [];
    evaluateWarLayer({ snapshot, worldState, rng: recordingRng('war-layer', bare), tick: 6, now: NOW, rules: { warLayerEnabled: true } });
    evaluateWarLayer({
      snapshot, worldState: stampWarIntent(worldState, 'weak', 'alpha', 5),
      rng: recordingRng('war-layer', withOrder), tick: 6, now: NOW, rules: { warLayerEnabled: true },
    });
    expect(bare.some(entry => entry.startsWith('fork@'))).toBe(true);   // the siege really rolled
    expect(withOrder).toEqual(bare);
  });

  test("the CHOOSER's own stream is untouched by the ledger it feeds", () => {
    const { snapshot, pIdx, worldState } = world([['strong', 'Ironhold', CITY], ['mid', 'Midvale', LARGE_TOWN]]);
    const ordered = stampWarIntent(worldState, 'strong', 'mid', 5);
    const orderedSnapshot = { ...snapshot, worldState: ordered };
    const bare = [];
    const after = [];
    const run = (snap, log) => evaluateSettlementStrategyRules(snap, pIdx, {
      tick: 6, simulationRules: { settlementStrategyEnabled: true }, rng: recordingRng('pulse', log),
    }).map(c => c.id);
    expect(run(orderedSnapshot, after)).toEqual(run(snapshot, bare));
    expect(after).toEqual(bare);
  });
});

describe('JOIN 1 — DORMANCY: a dark chooser leaves no trace', () => {
  test('the chooser off ⇒ no order is ever minted and the war layer is byte-identical', () => {
    const { snapshot, pIdx, worldState } = world([['strong', 'Ironhold', CITY], ['mid', 'Midvale', LARGE_TOWN]]);
    const off = evaluateSettlementStrategyRules(snapshot, pIdx, {
      tick: 6, simulationRules: { settlementStrategyEnabled: false }, rng: createPRNG('dark'),
    });
    expect(off).toEqual([]);
    // No producer ⇒ no ledger key ⇒ no spatialLedgers namespace at all.
    expect(worldState.spatialLedgers).toBeUndefined();
    expect(warIntentFor(worldState, 'strong', 6)).toBeNull();
    expect(openWars(snapshot, worldState).deployments).toEqual({});
  });

  test('the ledger drops itself when its last order is retired (no dead key)', () => {
    const seeded = stampWarIntent({ tick: 6 }, 'strong', 'mid', 6);
    expect(seeded.spatialLedgers[WAR_INTENT_LEDGER_KEY]).toEqual({ strong: { targetId: 'mid', tick: 6 } });
    const drained = consumeWarIntent(seeded, 'strong', 7);
    expect(drained.spatialLedgers).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(drained, 'spatialLedgers')).toBe(false);
  });

  test('a no-op stamp returns the SAME reference (a march on nobody writes nothing)', () => {
    const base = { tick: 6 };
    expect(stampWarIntent(base, 'strong', null, 6)).toBe(base);
    expect(stampWarIntent(base, null, 'mid', 6)).toBe(base);
    expect(stampWarIntent(base, 'strong', 'strong', 6)).toBe(base);   // never itself
    expect(consumeWarIntent(base, 'strong', 6)).toBe(base);
  });
});

describe('JOIN 1 — THE LIFECYCLE of an order', () => {
  test('an order expires after its TTL and is no longer obeyed', () => {
    const { snapshot, worldState } = world([['strong', 'Ironhold', CITY], ['mid', 'Midvale', LARGE_TOWN]]);
    const fresh = stampWarIntent(worldState, 'strong', 'mid', 6 - WAR_INTENT_TTL_TICKS);
    const stale = stampWarIntent(worldState, 'strong', 'mid', 6 - WAR_INTENT_TTL_TICKS - 1);
    expect(warIntentFor(fresh, 'strong', 6)).toEqual({ targetId: 'mid', tick: 6 - WAR_INTENT_TTL_TICKS });
    expect(warIntentFor(stale, 'strong', 6)).toBeNull();
    expect(Object.keys(openWars(snapshot, fresh).deployments)).toEqual(['strong']);
    expect(openWars(snapshot, stale).deployments).toEqual({});
  });

  test('a write PRUNES expired rows, so the ledger cannot accumulate', () => {
    let ws = stampWarIntent({ tick: 0 }, 'ancient', 'mid', 0);
    ws = stampWarIntent(ws, 'strong', 'mid', 20);
    expect(Object.keys(ws.spatialLedgers[WAR_INTENT_LEDGER_KEY])).toEqual(['strong']);
  });

  test('consume clears only an EARLIER order, so a same-tick march survives apply order', () => {
    const ws = stampWarIntent({ tick: 9 }, 'strong', 'mid', 9);
    // The war layer's own opener outcome applies in the SAME pass as a fresh order.
    expect(consumeWarIntent(ws, 'strong', 9)).toBe(ws);
    expect(warIntentFor(consumeWarIntent(ws, 'strong', 10), 'strong', 10)).toBeNull();
  });

  test('the ledger is codepoint-keyed — reversing the write order yields identical bytes', () => {
    const forward = stampWarIntent(stampWarIntent({ tick: 6 }, 'zeta', 'mid', 6), 'alpha', 'mid', 6);
    const reverse = stampWarIntent(stampWarIntent({ tick: 6 }, 'alpha', 'mid', 6), 'zeta', 'mid', 6);
    expect(JSON.stringify(forward)).toBe(JSON.stringify(reverse));
  });
});

describe('JOIN 1 — the pure order helpers', () => {
  test('intentTargetOrder returns the INPUT REFERENCE when no order applies', () => {
    const targets = ['alpha', 'zeta'];
    expect(intentTargetOrder(targets, null)).toBe(targets);
    expect(intentTargetOrder(targets, { targetId: 'ghost', tick: 1 })).toBe(targets);
    expect(intentTargetOrder(targets, { targetId: 'alpha', tick: 1 })).toBe(targets); // already first
    expect(intentTargetOrder(['a'], { targetId: 'a', tick: 1 })).toEqual(['a']);
  });

  test('intentTargetOrder pulls the named target to the front and keeps the rest in order', () => {
    expect(intentTargetOrder(['a', 'b', 'c', 'd'], { targetId: 'c', tick: 1 })).toEqual(['c', 'a', 'b', 'd']);
    expect(intentNamesTarget({ targetId: 'c', tick: 1 }, 'c')).toBe(true);
    expect(intentNamesTarget(null, 'c')).toBe(false);
  });

  test('hostileTargetsOf is codepoint-sorted and order-free (moved leaf, same contract)', () => {
    const { snapshot } = world([['strong', 'Ironhold', CITY], ['zeta', 'Zephyr Mill', HAMLET], ['alpha', 'Alderfen', HAMLET]]);
    expect(hostileTargetsOf(snapshot, 'strong')).toEqual(['alpha', 'zeta']);
    const reversed = { ...snapshot, regionalGraph: { ...snapshot.regionalGraph, edges: [...snapshot.regionalGraph.edges].reverse() } };
    expect(hostileTargetsOf(reversed, 'strong')).toEqual(['alpha', 'zeta']);
    expect(hostileTargetsOf(snapshot, 'nobody')).toEqual([]);
  });

  test('every reader is total over garbage', () => {
    expect(warIntentFor(null, 'x', 0)).toBeNull();
    expect(warIntentFor({ spatialLedgers: { warIntents: 'nope' } }, 'x', 0)).toBeNull();
    expect(warIntentFor({ spatialLedgers: { warIntents: { x: { targetId: null } } } }, 'x', 0)).toBeNull();
    expect(hostileTargetsOf(null, 'x')).toEqual([]);
  });
});

describe('JOIN 1 — end to end through the real pulse', () => {
  test('the seat resolves to march on one tick and the war is open on the next', () => {
    const saves = [save('strong', 'Ironhold', CITY), save('mid', 'Midvale', LARGE_TOWN)];
    const edges = [{ id: 'edge.strong.mid', from: 'strong', to: 'mid', relationshipType: 'hostile' }];
    const campaignFor = (worldState, regionalGraph) => ({
      id: 'join1e2e', name: 'Join1E2E', settlementIds: ['strong', 'mid'],
      worldState: worldState || {
        rngSeed: 'hunt-0', tick: 3,
        relationshipStates: { 'edge.strong.mid': { relationshipType: 'hostile' } },
        simulationRules: { warLayerEnabled: true, settlementStrategyEnabled: true },
        warPosture: { strong: MOBILIZED },
      },
      regionalGraph: regionalGraph || ensureRegionalGraph({ edges, channels: [] }),
      wizardNews: { currentTick: 3, entries: [] },
    });

    let ws = null;
    let graph = null;
    const trace = [];
    for (let t = 0; t < 3; t += 1) {
      const r = advanceCampaignWorld({ campaign: campaignFor(ws, graph), saves, interval: 'one_week', now: NOW });
      ws = r.worldState;
      graph = r.regionalGraph;
      trace.push({
        chose: (r.candidates || []).filter(c => c.ruleFamily === 'strategy').map(c => c.candidateType),
        order: ws.spatialLedgers?.[WAR_INTENT_LEDGER_KEY] ?? null,
        deployments: Object.keys(ws.deployments || {}),
      });
    }

    // Tick 1: the seat resolved to march and the order landed on the ledger.
    expect(trace[1].chose).toContain('strategy_deploy');
    expect(trace[1].order).toEqual({ strong: { targetId: 'mid', tick: 5 } });
    expect(trace[1].deployments).toEqual([]);            // the war layer had already run
    // Tick 2: the ONE opener obeyed it. Real state, not a headline.
    expect(trace[2].deployments).toEqual(['strong']);
    expect(ws.deployments.strong.targetId).toBe('mid');
    expect((graph.channels || []).some(c => c.type === 'war_front' && c.from === 'strong' && c.to === 'mid' && c.status === 'confirmed')).toBe(true);
    // …and the order was CONSUMED the moment it was obeyed — no dead key, no re-open.
    expect(trace[2].order).toBeNull();
  });
});
