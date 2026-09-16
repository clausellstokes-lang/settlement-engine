/**
 * warDeploymentLeaves.test.js — E-H LIT WALKTHROUGHS for the five WD leaves.
 *
 * WHY THIS FILE EXISTS, stated plainly because the record it corrects was wrong.
 * THE DECOMPOSITION WAVE cut `warDeployment.js` from 1412 lines to 658 by lifting
 * five leaves out of it, and the wave's record claimed the leaves kept their
 * coverage through the parent's suite. THEY DID NOT, and enforcer E-H measured
 * it: `mechanismLitCoverage` grants a module AUTO lit credit only when a
 * lit-eligible test imports THAT MODULE, and no test imported any of these five.
 * `warDeployment.test.js` drives `evaluateWarLayer`, which is the parent — so the
 * leaves were exercised incidentally and PROVEN nowhere. A refactor that quietly
 * converts direct proof into incidental exercise is exactly the hole E-H exists
 * to make visible, and five of the walker's uncovered modules were these.
 *
 * SO THIS FILE DRIVES EACH LEAF THROUGH ITS OWN LIT PATH — flag-on where the leaf
 * has a flag, real inputs everywhere, and a real asserted effect. It is NOT an
 * import manifest: an import alone would satisfy the walker while proving
 * nothing, which would be a worse outcome than the red it replaces.
 *
 * Pure leaves: no engine state beyond the fixtures below, and the ONE rng use
 * (the siege verdict) is a seeded PRNG fork, so nothing here is order-dependent.
 */
import { describe, expect, test } from 'vitest';

import {
  computeSackTransfer,
  ensureStatefulRecord,
  seedDeploymentState,
} from '../../src/domain/worldPulse/warArmyRecord.js';
import {
  ARMY_DEPLOYED_CAPACITY_PENALTY,
  buildCapacityLookup,
  coalitionJoinFeasibility,
  computeAllyRelief,
  isBesieged,
  logisticsBurdenFor,
  warFrontChannelIds,
} from '../../src/domain/worldPulse/warCapacityReads.js';
import {
  COALITION_REFUSAL_TUNING,
  buildCoalitionRefusalOutcome,
} from '../../src/domain/worldPulse/warCoalitionRefusal.js';
import {
  computeLevySources,
  revertSuppressedDeployExhaustion,
  stripSuppressedDeployResidue,
} from '../../src/domain/worldPulse/warHomeCosts.js';
import {
  SIEGE_MAX_AGE,
  WILL_CAPITULATE_FLOOR,
  composeDefenderWillScore,
  pickOccupier,
  resolveSiegeVerdict,
} from '../../src/domain/worldPulse/warSiegeVerdict.js';
import { createPRNG } from '../../src/kernel/prng.js';

/** A settlement rich enough for deriveMilitaryCapacity to answer non-trivially. */
function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4200,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: patch.priorityMilitary ?? 40 },
    institutions: patch.institutions || [{ name: 'Town Garrison' }],
    economicState: {
      prosperity: patch.prosperity || 'Prosperous',
      primaryExports: [], primaryImports: [],
      foodSecurity: { storageMonths: 6, resilienceScore: 70 },
    },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: [
        { faction: 'Military Council', category: 'military', power: patch.military ?? 70, isGoverning: true },
        { faction: 'Merchant League', category: 'economy', power: 45 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}

const item = (id, name, patch = {}) => [id, { id, settlement: settlement(name, patch) }];

/**
 * The shared world: Ironhold (strong), Weakmoor (weak), Everdeep (Weakmoor's
 * sworn ally), Marrowfen (Ironhold's vassal). Edges carry the relationship types
 * the support/levy readers select on.
 */
function world({ channels = [], relationshipStates = {}, deployments = {} } = {}) {
  const byId = new Map([
    item('iron', 'Ironhold', { tier: 'city', population: 40000, military: 92 }),
    item('weak', 'Weakmoor', { tier: 'village', population: 700, military: 20, legitimacy: 30 }),
    item('deep', 'Everdeep', { population: 6000, military: 65 }),
    item('marrow', 'Marrowfen', { population: 3000, military: 50 }),
  ]);
  const edges = [
    { id: 'rel.iron.weak', from: 'iron', to: 'weak', relationshipType: 'hostile' },
    { id: 'rel.deep.weak', from: 'deep', to: 'weak', relationshipType: 'allied', distance: 20 },
    { id: 'rel.iron.marrow', from: 'iron', to: 'marrow', relationshipType: 'vassal', distance: 70 },
  ];
  return {
    byId,
    settlements: [...byId.values()],
    regionalGraph: { edges, channels },
    worldState: {
      deployments,
      relationshipStates: {
        'rel.iron.weak': { relationshipType: 'hostile', resentment: 0.6, trust: 0.05 },
        'rel.deep.weak': { relationshipType: 'allied', trust: 0.9, resentment: 0.02 },
        'rel.iron.marrow': { relationshipType: 'vassal', trust: 0.7, resentment: 0.1, overlordSaveId: 'iron' },
        ...relationshipStates,
      },
    },
  };
}

describe('warArmyRecord — the deployment record, seeded and migrated', () => {
  test('LIT: the sack is CONSERVED with a war-dead sink, and the skeleton floor spares a hamlet', () => {
    const taken = computeSackTransfer(10000);
    expect(taken).toEqual({ sacked: 800, captured: 400 });
    // Conservation, asserted as the inequality it is: what reaches the victor can
    // never exceed what was taken — the shortfall is the dead, never minted.
    expect(taken.captured).toBeLessThan(taken.sacked);
    // The floor: a town at/under the skeleton population is not sackable at all,
    // and the anchor above proves the reader is live rather than always-null.
    expect(computeSackTransfer(150)).toBeNull();
    expect(computeSackTransfer(0)).toBeNull();
  });

  test('LIT: a seeded record marches at the origin\'s OFFENSIVE capacity, and readiness lifts it', () => {
    const cap = { offensive: 100, theoretical: 140, homeDefense: 90, facets: { manpower: 80, logistics: 60, will: 70, materiel: 50, institutions: 40 } };
    const plain = seedDeploymentState({ targetId: 'weak', cap, tick: 7, logisticsBurden: 0.25 });
    expect(plain.targetId).toBe('weak');
    expect(plain.sinceTick).toBe(7);
    expect(plain.maxStartStrength).toBe(100);
    expect(plain.currentEffectiveStrength).toBe(100);
    expect(plain.logisticsBurden).toBe(0.25);
    expect(plain.objective).toBe('conquest');
    // The facets are the model's, normalized to 0..1 — not invented.
    expect(plain.manpower).toBeCloseTo(0.8, 6);
    expect(plain.supplyIntegrity).toBeCloseTo(0.6, 6);
    expect(plain.commandQuality).toBeCloseTo(0.4, 6);
    // W-F8 readiness is a STAMPED lift, and absent at readiness 0 — the
    // byte-identical-ledger discipline, asserted on a record that DOES carry the
    // other keys (so this is a real absence, not an empty object).
    expect(plain.maxStartStrength).toBe(100);
    expect(Object.prototype.hasOwnProperty.call(plain, 'readiness')).toBe(false);
    const drilled = seedDeploymentState({ targetId: 'weak', cap, tick: 7, logisticsBurden: 0.25, readiness: 0.8 });
    expect(drilled.readiness).toBe(0.8);
    expect(drilled.maxStartStrength).toBeGreaterThan(plain.maxStartStrength);
  });

  test('LIT: a LEGACY light record is migrated in place, and a stateful one keeps its live strength', () => {
    const cap = { offensive: 100, theoretical: 140, homeDefense: 90, facets: { manpower: 80, logistics: 60, will: 70, materiel: 50, institutions: 40 } };
    const legacy = { targetId: 'weak', sinceTick: 2, role: 'siege' };
    const migrated = ensureStatefulRecord(legacy, cap, 9, 0.3);
    expect(Number.isFinite(migrated.maxStartStrength)).toBe(true);
    expect(Number.isFinite(migrated.currentEffectiveStrength)).toBe(true);
    expect(migrated.sinceTick).toBe(2); // the campaign's own history is preserved
    // Never mutates its input — the legacy record is still light.
    expect(Object.prototype.hasOwnProperty.call(legacy, 'maxStartStrength')).toBe(false);
    // A WORN army keeps its depletion: migration must not heal it back to full.
    const worn = ensureStatefulRecord(
      { ...migrated, currentEffectiveStrength: 31 }, cap, 10, 0.3,
    );
    expect(worn.currentEffectiveStrength).toBe(31);
  });
});

describe('warCapacityReads — the pure snapshot reads the siege contest runs on', () => {
  test('LIT: home defense is the offensive read MINUS the army-away penalty', () => {
    const snap = world({ deployments: { iron: { targetId: 'weak', sinceTick: 3, role: 'siege' } } });
    const capacityFor = buildCapacityLookup(snap, snap.worldState.deployments);
    const iron = capacityFor('iron');
    const deep = capacityFor('deep');
    expect(iron.offensive).toBeGreaterThan(0);
    // Ironhold's army is abroad, so its walls read exactly the penalty lower.
    expect(iron.homeDefense).toBe(Math.max(0, iron.offensive - ARMY_DEPLOYED_CAPACITY_PENALTY));
    // Everdeep's is not, so its two readings agree — the negative control that
    // stops the assertion above passing on an always-equal lookup.
    expect(deep.homeDefense).toBe(deep.offensive);
    // An unknown id answers a zero envelope rather than throwing.
    expect(capacityFor('nowhere')).toEqual({ theoretical: 0, offensive: 0, homeDefense: 0, facets: {} });
  });

  test('LIT: relief comes from sworn friends, and an ally under its own siege sends none', () => {
    const snap = world();
    const capacityFor = buildCapacityLookup(snap, {});
    const free = computeAllyRelief(snap, 'weak', capacityFor, new Set());
    expect(free).toBeGreaterThan(0); // Everdeep answers
    // …and stops answering the moment it is besieged itself.
    expect(computeAllyRelief(snap, 'weak', capacityFor, new Set(['deep']))).toBe(0);
    // WR-6: with the coalition ledger lit, a PEER alliance is a priced deployment
    // and may not also appear as free wall relief. Hierarchy is untouched.
    expect(computeAllyRelief(snap, 'weak', capacityFor, new Set(), true)).toBe(0);
  });

  test('LIT: a confirmed war_front is what makes a town besieged, and names the channel to retire', () => {
    const channels = [
      { id: 'chan.iron.weak', type: 'war_front', from: 'iron', to: 'weak', status: 'confirmed' },
      { id: 'chan.iron.marrow', type: 'war_front', from: 'iron', to: 'marrow', status: 'proposed' },
    ];
    const snap = world({ channels });
    expect(isBesieged(snap.regionalGraph, 'weak')).toBe(true);
    // A merely PROPOSED front besieges nobody — the anchor above proves the
    // reader fires, so this absence measures the status filter.
    expect(isBesieged(snap.regionalGraph, 'marrow')).toBe(false);
    expect(warFrontChannelIds(snap.regionalGraph, 'iron', 'weak')).toEqual(['chan.iron.weak']);
    expect(warFrontChannelIds(snap.regionalGraph, 'iron', 'marrow')).toEqual([]);
  });

  test('LIT: the supply line is read off the edge, and a missing edge reads neutral', () => {
    const snap = world();
    expect(logisticsBurdenFor(snap.regionalGraph, 'deep', 'weak')).toBeCloseTo(0.2, 6);
    expect(logisticsBurdenFor(snap.regionalGraph, 'iron', 'marrow')).toBeCloseTo(0.7, 6);
    expect(logisticsBurdenFor(snap.regionalGraph, 'iron', 'deep')).toBe(0.4); // no edge ⇒ neutral
  });

  test('LIT: a compact cannot make a hopeless army pass the physical siege law', () => {
    const snap = world();
    const strong = coalitionJoinFeasibility(snap, snap.worldState, 'iron', 'weak');
    const hopeless = coalitionJoinFeasibility(snap, snap.worldState, 'weak', 'iron');
    expect(typeof strong.verdict).toBe('string');
    expect(strong.allowed).toBe(true);   // the city may open a front on the village
    expect(hopeless.allowed).toBe(false); // the village may not open one on the city
    // Degenerate ids fail closed rather than throwing.
    expect(coalitionJoinFeasibility(snap, snap.worldState, 'iron', 'iron')).toEqual({ allowed: false, verdict: 'auto_fail' });
    expect(coalitionJoinFeasibility(snap, snap.worldState, 'iron', 'nowhere')).toEqual({ allowed: false, verdict: 'auto_fail' });
  });
});

describe('warSiegeVerdict — the verdict, the will, and the occupier', () => {
  test('LIT: the will score composes temperament, legitimacy, supply and hope', () => {
    const grim = composeDefenderWillScore({
      willFacet: 5, legitimacyScore: 10, logisticsFacet: 5, defenderCurrent: 5, coalitionCurrent: 200,
    });
    const stout = composeDefenderWillScore({
      willFacet: 95, legitimacyScore: 90, logisticsFacet: 95, defenderCurrent: 200, coalitionCurrent: 5,
    });
    expect(grim).toBeLessThan(WILL_CAPITULATE_FLOOR); // the will has collapsed
    expect(stout).toBeGreaterThan(0.5);
    expect(grim).toBeGreaterThanOrEqual(-1);
    expect(stout).toBeLessThanOrEqual(1);
    // 0 is a REAL will value, not a missing default: a town whose only difference
    // is a zero will facet must score strictly lower than a neutral one.
    const zeroWill = composeDefenderWillScore({ willFacet: 0, legitimacyScore: 50, logisticsFacet: 50 });
    const neutral = composeDefenderWillScore({ willFacet: 50, legitimacyScore: 50, logisticsFacet: 50 });
    expect(zeroWill).toBeLessThan(neutral);
  });

  test('LIT: a thorpe cannot storm a city on a lucky roll — the gate resolves before the rng', () => {
    const snap = world();
    const capacityFor = buildCapacityLookup(snap, {});
    const noStateful = () => null;
    const hopeless = resolveSiegeVerdict({
      targetId: 'iron', besiegers: ['weak'], capacityFor, effectiveStrengthFor: noStateful,
      defenderItem: snap.byId.get('iron'), rng: createPRNG('wz3-leaf'), tick: 12,
    });
    expect(hopeless.falls).toBe(false);
    expect(hopeless.verdict).not.toBe('plausible'); // anchored: a real verdict string was produced
    expect(hopeless.coalitionCurrent).toBeLessThan(hopeless.defenderCurrent);
    // …and the same call is REPRODUCIBLE, which is the determinism contract.
    const again = resolveSiegeVerdict({
      targetId: 'iron', besiegers: ['weak'], capacityFor, effectiveStrengthFor: noStateful,
      defenderItem: snap.byId.get('iron'), rng: createPRNG('wz3-leaf'), tick: 12,
    });
    expect(again).toEqual(hopeless);
  });

  test('LIT: THE KEYSTONE — a worn army contests at its DEPLETED strength', () => {
    const snap = world();
    const capacityFor = buildCapacityLookup(snap, {});
    const fresh = resolveSiegeVerdict({
      targetId: 'weak', besiegers: ['iron'], capacityFor, effectiveStrengthFor: () => null,
      defenderItem: snap.byId.get('weak'), rng: createPRNG('wz3-leaf'), tick: 12,
    });
    const worn = resolveSiegeVerdict({
      targetId: 'weak', besiegers: ['iron'], capacityFor, effectiveStrengthFor: () => 1,
      defenderItem: snap.byId.get('weak'), rng: createPRNG('wz3-leaf'), tick: 12,
    });
    expect(fresh.coalitionCurrent).toBeGreaterThan(worn.coalitionCurrent);
    expect(worn.coalitionCurrent).toBe(1);
  });

  test('LIT: the hard ceiling terminates a saturated stalemate with NO roll', () => {
    // ⚠️ THE AGE IS A LITERAL, NOT `SIEGE_MAX_AGE`. Driving the ceiling with the
    // constant that DEFINES it makes the pin self-referential: a mutant that
    // moves the ceiling to 100000 moves the input with it and the pin stays
    // green. It was measured surviving exactly that way before this was fixed.
    // So: pin the tuned value itself, then drive the arm with a literal.
    expect(SIEGE_MAX_AGE).toBe(60);
    const snap = world();
    const capacityFor = buildCapacityLookup(snap, {});
    const atCeiling = (/** @type {number} */ age, /** @type {string} */ seed) => resolveSiegeVerdict({
      targetId: 'weak', besiegers: ['iron'], capacityFor, effectiveStrengthFor: () => null,
      defenderItem: snap.byId.get('weak'), rng: createPRNG(seed), tick: 99, siegeAge: age,
    });
    const ceiling = atCeiling(60, 'wz3-leaf');
    // The besieging city still holds the capacity edge, so the town finally falls,
    // the arm SAYS SO in its own receipt, and it took no roll at all.
    expect(ceiling.falls).toBe(true);
    expect(ceiling.roll).toBe(0);
    expect(ceiling.pFall).toBe(1);
    expect(ceiling.band).toBe('costly_success');
    expect(ceiling.reasons.some((r) => r.includes('hard 60-tick ceiling'))).toBe(true);
    // …and the direction is a pure function of capacity, so a different stream
    // resolves identically.
    expect(atCeiling(60, 'a-different-seed').falls).toBe(true);
    // THE CONTROL: one tick BELOW the ceiling the arm is not taken, so the
    // assertions above measure the ceiling rather than the ordinary verdict.
    const below = atCeiling(59, 'wz3-leaf');
    expect(below.reasons.some((r) => r.includes('hard 60-tick ceiling'))).toBe(false);
  });

  test('LIT: the strongest SURVIVING army holds the walls, codepoint tie-break', () => {
    const capacityFor = (/** @type {string} */ id) => ({ offensive: id === 'iron' ? 90 : 40 });
    expect(pickOccupier(['deep', 'iron'], capacityFor, () => null)).toBe('iron');
    // …until it is worn below its partner: the STATEFUL strength wins, not the
    // freshly-recomputed one.
    expect(pickOccupier(['deep', 'iron'], capacityFor, (id) => (id === 'iron' ? 5 : 50))).toBe('deep');
    // Exact tie ⇒ codepoint order, so the pick is never insertion-dependent.
    expect(pickOccupier(['iron', 'deep'], capacityFor, () => 10)).toBe('deep');
    expect(pickOccupier(['deep', 'iron'], capacityFor, () => 10)).toBe('deep');
  });
});

describe('warHomeCosts — the levy, the strain, and the dismissed deploy\'s inverse', () => {
  test('LIT: the OVERLORD levies its vassal, and a junior may never levy its overlord', () => {
    const snap = world();
    expect(computeLevySources(snap, 'iron', new Set())).toEqual(['marrow']);
    // The hierarchy runs one way only — the anchor above proves the walk is live.
    expect(computeLevySources(snap, 'marrow', new Set())).toEqual([]);
    // A source that is besieged or already fielding its army spares nothing.
    expect(computeLevySources(snap, 'iron', new Set(['marrow']))).toEqual([]);
    // WR-6: a lit coalition ledger removes free PEER levies; hierarchy survives.
    expect(computeLevySources(snap, 'weak', new Set(), false)).toEqual(['deep']);
    expect(computeLevySources(snap, 'weak', new Set(), true)).toEqual([]);
    expect(computeLevySources(snap, 'iron', new Set(), true)).toEqual(['marrow']);
  });

  test('LIT: a dismissed deploy replays the NO-DEPLOY counterfactual on the scar ledger', () => {
    const reverted = revertSuppressedDeployExhaustion({
      warExhaustion: { iron: 0.5, marrow: 0.3 },
      preTickWarExhaustion: { iron: 0.4, marrow: 0.2 },
      homeId: 'iron',
      leviedSourceIds: ['marrow'],
    });
    // The home's ratchet is replaced by the DECAY it would have taken instead…
    expect(reverted.iron).toBeLessThan(0.4);
    expect(reverted.iron).toBeGreaterThan(0);
    // …and the levied vassal loses the gross strain the dismissed war charged it.
    expect(reverted.marrow).toBeLessThan(0.3);
    // A scar that decays to nothing is DROPPED, not stored as zero.
    const cleared = revertSuppressedDeployExhaustion({
      warExhaustion: { iron: 0.02 }, preTickWarExhaustion: { iron: 0.01 }, homeId: 'iron',
    });
    expect(Object.prototype.hasOwnProperty.call(cleared, 'iron')).toBe(false);
  });

  test('LIT: the residue strip drops the seed, the front and the same-tick minors — and is byte-neutral when nothing is suppressed', () => {
    const war = {
      deployments: { iron: { targetId: 'weak', sinceTick: 9, role: 'siege' } },
      warExhaustion: { iron: 0.5 },
      graphChannels: [{ type: 'war_front', from: 'iron', to: 'weak', status: 'confirmed' }],
      outcomes: [
        { id: 'world_outcome.strategy_deploy.iron.9', candidateType: 'strategy_deploy', targetSaveId: 'iron', sourceEventTargetId: 'weak' },
        { id: 'world_outcome.war_drain.iron.9', candidateType: 'war_drain', targetSaveId: 'iron' },
        { id: 'world_outcome.unrest.weak.9', candidateType: 'unrest', targetSaveId: 'weak' },
      ],
    };
    const stripped = stripSuppressedDeployResidue({
      war,
      suppressedIds: new Set(['world_outcome.strategy_deploy.iron.9']),
      preTickWarExhaustion: { iron: 0.4 },
    });
    expect(Object.keys(stripped.deployments)).toEqual([]);   // the army never marched
    expect(stripped.graphChannels).toEqual([]);              // no front was ever confirmed
    expect(stripped.warExhaustion.iron).toBeLessThan(0.4);   // the scar took the decay path
    // THE STRIP IS KEYED, NOT A BLANKET CLEAR. The dismissed deploy's same-tick
    // MINOR (`war_drain`) goes, because the major partition would otherwise
    // auto-apply it for a war that never opened. The `strategy_deploy` major
    // itself STAYS on the bag (the partition withholds it, not this function),
    // and the unrelated `unrest` minor is untouched — both are the anchors that
    // prove the removal above measures a filter rather than an emptied list.
    expect(stripped.outcomes.map((o) => o.candidateType)).toEqual(['strategy_deploy', 'unrest']);
    // NOTHING suppressed ⇒ the same references back, by identity not equality.
    const untouched = stripSuppressedDeployResidue({ war, suppressedIds: null });
    expect(untouched.deployments).toBe(war.deployments);
    expect(untouched.outcomes).toBe(war.outcomes);
    expect(untouched.graphChannels).toBe(war.graphChannels);
  });
});

describe('warCoalitionRefusal — the refusal aftermath, bounded', () => {
  const decision = {
    callId: 'call.iron.deep.weak.11',
    partyId: 'deep',
    callerId: 'weak',
    enemyId: 'iron',
    relationshipKey: 'rel.deep.weak',
    riskBand: 'pressing',
    relationshipState: { trust: 0.9, resentment: 0.02, obligationFatigue: 0 },
    anchor: { callerDeploymentSinceTick: 8, originAttackerId: 'iron', originSinceTick: 8 },
  };
  const nameFor = (/** @type {string} */ id, /** @type {string} */ fallback) => (
    { deep: 'Everdeep', weak: 'Weakmoor', iron: 'Ironhold' }[id] || fallback
  );

  test('LIT: a refusal is one earned relationship fact, and the cost is BOUNDED by the tuning', () => {
    const snap = world();
    const outcome = buildCoalitionRefusalOutcome({
      worldState: snap.worldState, rules: { warLayerEnabled: true, coalitionLedgerEnabled: true },
      snapshot: snap, decision, refusalCause: 'army_committed', tick: 11, coalitionNameFor: nameFor,
    });
    expect(outcome.candidateType).toBe('coalition_refused');
    expect(outcome.type).toBe('relationship_shift');
    expect(outcome.targetSaveId).toBe('deep');
    expect(outcome.sourceEventTargetId).toBe('weak');
    expect(outcome.relationshipKey).toBe('rel.deep.weak');
    expect(outcome.headline).toBe('Everdeep refuses Weakmoor\'s call');
    // The named cause speaks in its own words rather than the generic retaliation line.
    expect(outcome.reasons[0]).toContain('field army is committed elsewhere');
    // THE BOUND. The character read may colour the hit, never erase or invent it:
    // every delta lands strictly inside [MIN_CHARACTER_MULT, MAX_CHARACTER_MULT]
    // times the base tuning.
    const t = COALITION_REFUSAL_TUNING;
    const trustDrop = 0.9 - outcome.relationshipPatch.trust;
    expect(trustDrop).toBeGreaterThanOrEqual(t.TRUST_HIT * t.MIN_CHARACTER_MULT - 1e-9);
    expect(trustDrop).toBeLessThanOrEqual(t.TRUST_HIT * t.MAX_CHARACTER_MULT + 1e-9);
    const resentGain = outcome.relationshipPatch.resentment - 0.02;
    expect(resentGain).toBeGreaterThanOrEqual(t.RESENTMENT_GAIN * t.MIN_CHARACTER_MULT - 1e-9);
    expect(resentGain).toBeLessThanOrEqual(t.RESENTMENT_GAIN * t.MAX_CHARACTER_MULT + 1e-9);
    expect(outcome.relationshipPatch.obligationFatigue).toBeGreaterThan(0);
    // The evidence rides on the outcome, banded, for the coalition ledger.
    const evidence = outcome.metadata.coalitionEvidence.find((row) => row.kind === 'coalition_refused');
    expect(evidence.refusalCause).toBe('army_committed');
    expect(typeof evidence.costBand).toBe('string');
    expect(outcome.metadata.refusalCostBand).toBe(evidence.costBand);
  });

  test('LIT: an UNREGISTERED cause falls back to the closed strategic reading, never a raw string', () => {
    const snap = world();
    const outcome = buildCoalitionRefusalOutcome({
      worldState: snap.worldState, rules: { warLayerEnabled: true },
      snapshot: snap, decision, refusalCause: 'because_i_said_so', tick: 11, coalitionNameFor: nameFor,
    });
    const evidence = outcome.metadata.coalitionEvidence.find((row) => row.kind === 'coalition_refused');
    expect(evidence.refusalCause).toBe('strategic');
    // …and the reason is the retaliation reading for the pressing band, so the
    // fallback still speaks rather than emitting an empty row.
    expect(outcome.reasons[0]).toContain('retaliation');
  });
});
