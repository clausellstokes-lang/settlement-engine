/**
 * domain/worldPulse/warDeployment.js — the war & deployment core.
 *
 * A settlement fields EXACTLY ONE army (`worldState.deployments[saveId]`). It may
 * deploy that army to besiege a target it is hostile toward IF it is confident in
 * its military. Multiple besiegers converging on one target form a COALITION siege
 * (one big siege, many `war_front` channels). Sustaining a siege drains the home
 * economy (the `war_drain` condition → `economic_capacity`, the homeostasis SOURCE)
 * and thins the home garrison (`army_deployed` → `defense_readiness`). A besieged
 * target can FALL — a conquest power-transfer (cause:'conquest'). When a siege
 * resolves the besiegers' armies return home → contextual outcomes (deploymentReturn).
 *
 * DETERMINISM CONTRACT (sacred):
 *   - No Date.now / Math.random / argless new Date. The pulse threads `now` and an
 *     injected `rng`; every roll forks on a STABLE key (`rng.fork('siege:'+T+':'+tick)`,
 *     `rng.fork('deploy:'+S+':'+tick)`), never a list-order stream.
 *   - Every iteration that feeds output is over a CODEPOINT-SORTED key list — never a
 *     Map/Set/Object insertion order.
 *   - All cross-settlement reads come from the SINGLE pre-tick snapshot. `war_drain`
 *     severity is derived from the PRE-TICK channel count (NOT this-tick's fresh mints)
 *     to avoid intra-tick read-after-write — a fresh deploy raises drain only NEXT tick.
 *
 * GATED + byte-identical when OFF: when `rules.warLayerEnabled` is false this is a
 * pure no-op returning the world's existing deployments untouched.
 */

import { mintDirectedChannel } from '../region/graph.js';
// The provenance-gated war-front reads live in ONE shared module so warDeployment
// and its sibling readers (deploymentReturn / settlementStrategy / occupation) can
// never diverge on what counts as a live siege (the phantom-siege class).
import { isLiveWarFront, warFrontsInto } from './warFrontReads.js';
// THE DECOMPOSITION WAVE (R-BLD-4): every PURE READ of the pre-tick snapshot — the
// codepoint order, the strength / capacity / origin-envelope lookups, the war-front
// channel ids, the besieged test, the route burden, the ally relief, and the
// coalition-join feasibility read — lives in this leaf, where nothing can reach a
// ledger. This head stays the WRITER: it is the only file that mints outcomes and
// mutates the deployment / exhaustion ledgers.
import {
  codepoint,
  computeAllyRelief,
  warFrontChannelIds,
  buildStrengthLookup,
  buildCapacityLookup,
  logisticsBurdenFor,
  isBesieged,
} from './warCapacityReads.js';
// THE SIEGE CONTEST itself — the feasibility gate, the hard duration ceiling, the
// will track, the two resolution cores and the pick of who holds the walls — is the
// second leaf. It DECIDES; this head ACTS on what it decides.
import { resolveSiegeVerdict, pickOccupier } from './warSiegeVerdict.js';
// The third leaf: what the war costs the HOME (steps 5 + 5b) and the two functions
// that invert those costs for a DM-dismissed siege — accrual and inverse kept in one
// file because they are two halves of one conserved quantity.
import { applyHomeWarCosts } from './warHomeCosts.js';
// The fourth leaf: WR-6's refusal aftermath. It BUILDS the coalition_refused outcome
// and cannot push one — the head owns every push.
import { buildCoalitionRefusalOutcome } from './warCoalitionRefusal.js';
// The fifth leaf: the stateful army RECORD at its two creation points, and the
// conserved sack arithmetic. Builds records and returns numbers; mints nothing.
import { seedDeploymentState, ensureStatefulRecord, computeSackTransfer } from './warArmyRecord.js';
import { clamp01 } from '../region/contestMath.js';
import { stablePart } from './worldState.js';
import { classifyFeasibility, verdictPermitsSiege } from './feasibilityGate.js';
// M9d — THE WAR INITIATE/RESOLVE SPLIT: siege INITIATION routes its applyMode through
// the SAME per-domain authority policy every candidate family consults. Under legacy
// autonomy (routine / full — the pre-CL0 world) authorityFor returns the legacy 'auto'
// VERBATIM ⇒ the inline mint runs byte-identically. Under the DM-Driven forcing modes
// (dm_only / recommendations) it returns 'proposal' ⇒ the mint is HELD and carried in a
// proposalPayload whose apply re-mints the siege (applyWorldPulse). changeAuthorityPolicy
// already rides the lazy pulse chunk (candidateEvents imports it) ⇒ zero new eager bytes.
import { authorityFor } from './changeAuthorityPolicy.js';
// M10a — the HOLD dedup: a proposal-gated (held) war-init must not re-propose the
// same siege every tick while it sits pending in the approval queue.
import { pendingActorMajorFor } from './actorMajorApproval.js';
// Phase 4 W-F4b (item 2a) — the alignment-conditioned fidelity term: a chaotic-devout
// besieger classifies the matchup on a NOISY ESTIMATE of the true capacities (fights
// refused wars / quits winnable ones), then the roll below reads the TRUE values.
// chaosPull 0 (lawful/neutral/no-piety) ⇒ factor 1, no rng forked ⇒ byte-identical.
import { chaosPullOf } from './fidelityNoise.js';
import { isWarReady } from './mobilization.js';
import { applyAttritionToRecord, fortificationStrength } from './attrition.js';
// W-F8: a militarized home fields BETTER forces — higher effective strength (efficiency,
// never invincibility) + a `readiness` stamp the attrition kernel reads for slower decay.
// readinessOf 0 (no martial record) ⇒ no lift, no stamp ⇒ byte-identical.
import { readinessOf, rustOf } from './martialReadiness.js';
// W-C2 rented force: a settlement meeting war exposure through the mercenary market gets a
// bounded readiness SUPPLEMENT (force it didn't train) at the deploy seam and a hired-steel
// FIDELITY PENALTY at the war-decision reads (folded into the rust arg — it composes with
// chaosPull+rust under fidelityNoise's TOTAL_MAX cap, never forking the geometry). Both 0
// when no active market ⇒ byte-identical.
import { mercSupplementOf, mercFidelityPenaltyOf } from './mercenaryMarket.js';
// W-PEACE-1 (§14/§H): the causal reasons layer at the war-INITIATION seam. An
// accumulated typed casus EMBOLDENS the march (a bounded, centered-on-1.0 lift
// on the conquest-margin read — ×1 exactly when the peace-engine gate is dark
// or no case stands ⇒ byte-identical), and the minted war record CARRIES its
// casus list (the §14 artifact law: "the war record carries its casus list").
import { peaceCausalActive, aggregateReasons01, topReasons, REASON_TUNING } from './warReasons.js';
import { deployedQualityMult } from './supplyQuality.js';
import { computeSackFoodTransfer, storageCapacityMonths } from './foodStockpile.js';
import { warConditionOutcome } from './warRecordMode.js';
import { makeCurrentWarCasusRead, pinDeploymentCasusReasons } from './warTermination.js';
// M2b: the supply-interdiction read (0 when the shipment ledger is absent / dormant
// ⇒ resolveSiegeVerdict's term is 0 ⇒ the aspatial siege path is byte-identical).
import { supplyInterdictionLevel } from '../spatial/supplyShipments.js';
// M5: the spatial marker gate for SIEGE-AS-STARVATION. false off the marker (every
// aspatial world) ⇒ resolveSiegeVerdict runs the capacity-roll VERBATIM ⇒ byte-identical.
// JOIN 2 — siegeArrivalGate is the ONE READ of the transit layer's published position:
// an army still on the road is NOT besieging. Permissive wherever the transit ledger is
// absent/silent ⇒ the aspatial siege loop is byte-identical (see armyTransit.js).
import { armyTransitActive, siegeArrivalGate } from '../spatial/armyTransit.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';
// JOIN 1 — THE RESOLVED MARCH. `hostileTargetsOf` (the set of wars a settlement may
// open) moved to that leaf because it is the other half of the same question the order
// answers, and because this file is at its frozen size ceiling. The three intent reads
// are TOTAL and rng-free: no order ⇒ null ⇒ step 4 runs its pre-existing expression.
import {
  warIntentFor,
  intentNamesTarget,
  intentTargetOrder,
  hostileTargetsOf,
  treatyEligibleWarTargets,
} from './warIntent.js';
import {
  coalitionCallArchiveRow,
  coalitionDecisionEvidence,
  readCoalitionJoinDecisions,
} from './warCoalitionDecision.js';
import {
  joinAnchorOf,
  warCoalitionActive,
} from './warCoalitionLedger.js';

/**
 * Shared war/trade/occupation sim-shape typedefs (see ./pulseShapes.js) — named,
 * index-signature-backed loose bags. Aliased locally so annotations read
 * `@param {PulseSnapshot} snapshot` instead of `@param {PulseSnapshot} snapshot`.
 * @typedef {import('./pulseShapes.js').PulseSnapshot} PulseSnapshot
 * @typedef {import('./pulseShapes.js').WorldState} WorldState
 * @typedef {import('./pulseShapes.js').RegionGraph} RegionGraph
 * @typedef {import('./pulseShapes.js').WarSlice} WarSlice
 * @typedef {import('./pulseShapes.js').DeploymentRecord} DeploymentRecord
 * @typedef {import('./pulseShapes.js').CapacityEnvelope} CapacityEnvelope
 * @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome
 * @typedef {import('./pulseShapes.js').SettlementItem} SettlementItem
 * @typedef {import('./pulseShapes.js').Rng} Rng
 */

// THE FAMILY'S PUBLISHED SURFACE. The decomposition moved implementations to leaves
// but this head remains the war layer's ONE import address, so no consumer — engine,
// display, or pin — has to know which leaf a symbol now lives in, and no consumer
// diff rides a split that is supposed to be behaviour-neutral. Adding a name here is
// how a leaf publishes; it is not a licence to make this file a barrel for anything
// the war layer does not already own.
export { computeAllyRelief, coalitionJoinFeasibility, ARMY_DEPLOYED_CAPACITY_PENALTY } from './warCapacityReads.js';
export { resolveSiegeVerdict, composeDefenderWillScore, WILL_CAPITULATE_FLOOR, SIEGE_MAX_AGE } from './warSiegeVerdict.js';
export { computeLevySources, revertSuppressedDeployExhaustion, stripSuppressedDeployResidue } from './warHomeCosts.js';
export { COALITION_REFUSAL_TUNING } from './warCoalitionRefusal.js';
export { computeSackTransfer } from './warArmyRecord.js';

// ── Tunables (calibration is load-bearing — see GEOPOLITICAL_WAR_LAYER §2.4/§6) ──
// HOSTILE_CONFIDENCE gates whether a settlement is strong enough to open a war at
// all (the relationship-confidence input). CONQUEST_MARGIN keeps a deploy from
// firing on a coin-flip strength edge. The capacity-scale siege math
// (SIEGE_CAPACITY_K / SIEGE_CAPACITY_HOLD_BIAS, defined below) sits behind the hard
// feasibility gate — the old strength-scale SIEGE_K/HOLD_BIAS are
// retired (the siege verdict now reads the 0..100 military-capacity model, not the
// 0..1 settlementStrength).
const HOSTILE_CONFIDENCE = 0.42;
const CONQUEST_MARGIN = 0.12;

// WR-6 refusal aftermath (tunables, closed cause vocabulary, the calling court's
// character read) moved to ./warCoalitionRefusal.js.


// The war-exhaustion SCAR tunables moved to ./warHomeCosts.js, beside both the
// ratchet that accrues them and the strip that reverts them.

// The capacity model's own tunable (ARMY_DEPLOYED_CAPACITY_PENALTY) moved to
// ./warCapacityReads.js with buildCapacityLookup, the only code that applies it;
// this head re-exports it below for the display layer.
// The siege contest — the feasibility gate, the duration ceiling, the will track,
// the two resolution cores and their tunables — moved to ./warSiegeVerdict.js.

// Ally defense (P3, flag-gated) — its tunables and computeAllyRelief moved to
// ./warCapacityReads.js: the relief is a pure read of the pre-tick snapshot that
// feeds the verdict, never a write.

// The war-levy tunables and computeLevySources moved to ./warHomeCosts.js.





// Harassment (a feasibility verdict below the siege band): a weak attacker that
// cannot storm the town still RAIDS — a low-severity war_pressure on the target, NOT
// a siege. This is what the hard-gate's `harassment` / solo-`require_coalition`
// verdicts resolve to instead of going to RNG.
const HARASSMENT_SEVERITY = 0.22;

// (The hostile-axis set moved to warIntent.js with hostileTargetsOf, its only reader —
// the chooser and the opener must agree on what "hostile" means, so the set that
// defines an openable war now lives beside the order that may name one.)

// The stateful ARMY RECORD (seedDeploymentState / ensureStatefulRecord) and the
// conserved sack arithmetic moved to ./warArmyRecord.js — what an army is, and what
// it takes. The reinforcement / age-drain / conscription tunables moved to
// ./warHomeCosts.js with the pass that charges them.






/**
 * Evaluate the war layer for one tick.
 *
 * @param {Object} args
 * @param {PulseSnapshot} args.snapshot       the SINGLE pre-tick world snapshot (byId carries
 *                                  settlement + causal + save; regionalGraph is pre-tick)
 * @param {WorldState} args.worldState
 * @param {Rng} args.rng
 * @param {number} args.tick
 * @param {string|null} [args.now]
 * @param {{ warLayerEnabled?: boolean, warTerminationEnabled?: boolean, defenderAttritionEnabled?: boolean, warSupplyQualityEnabled?: boolean }} args.rules
 * @returns {{ outcomes: PulseOutcome[], deployments: Record<string, DeploymentRecord>, graphChannels: any[], retiredChannels: string[], resolvedDeployments: any[], dispositionDeltas: Array<{id:string, outcome:'win'|'loss', magnitude?:number, sourceConquestId?:string}>, warExhaustion: Record<string, number>, defenderSiegeLedger?: (Record<string, any>|null) }}
 *   - outcomes: probability-1 condition / power_transfer outcomes for applyWorldPulseOutcomes
 *   - deployments: the UPDATED one-army ledger to persist onto worldState
 *   - graphChannels: war_front directed channels to upsert into the regional graph
 *   - retiredChannels: war_front channel IDs whose siege RESOLVED this tick (conquest or
 *     withdrawal) — the caller drops each to 'dormant' (setRegionalChannelStatus) so a
 *     resolved siege is not re-discovered and re-fired next tick.
 *   - resolvedDeployments: armies that returned home this tick (for deploymentReturn)
 *   - dispositionDeltas: id-stable win/loss attributions from sieges resolved this tick
 *   - warExhaustion: the UPDATED non-reverting war-exhaustion scar ledger to persist
 */
export function evaluateWarLayer({ snapshot, worldState, rng, tick = 0, now = null, rules = {} }) {
  const existing = worldState?.deployments || {};
  // ── Gate: byte-identical no-op when the war layer is OFF. ────────────────────
  if (!rules?.warLayerEnabled) {
    const deployedIds = Object.keys(existing);
    if (!deployedIds.length) {
      return { outcomes: [], deployments: existing, graphChannels: [], retiredChannels: [], resolvedDeployments: [], dispositionDeltas: [], warExhaustion: worldState?.warExhaustion || {}, defenderSiegeLedger: null };
    }
    // WIND-DOWN: the layer was turned OFF while armies were afield (a mid-campaign
    // toggle — directly, or cascaded by relationship drift turning off). Freezing
    // the ledger would strand every deployed population away from home forever (a
    // conservation leak), so every deployment resolves as a WITHDRAWAL: survivors
    // march home through the normal deploymentReturn machinery (banked headcounts
    // + per-vassal levy apportionment intact) and every war_front retires. Byte-
    // identical for war-never-on worlds (no deployments ⇒ the fast path above).
    // warExhaustion (the non-reverting scar ledger) is DELIBERATELY KEPT when the layer turns off: the lingering war-weary band is correct history, not a leak.
    const offGraph = snapshot?.regionalGraph || {};
    const resolvedDeployments = [];
    /** @type {string[]} */
    const windDownChannels = [];
    for (const attackerId of deployedIds.sort(codepoint)) {
      const deployment = existing[attackerId];
      const targetId = String(deployment?.targetId ?? '');
      resolvedDeployments.push({ attackerId, deployment, targetId, outcome: 'withdrawal' });
      for (const channelId of warFrontChannelIds(offGraph, attackerId, targetId)) windDownChannels.push(channelId);
    }
    return {
      outcomes: [], deployments: {}, graphChannels: [],
      retiredChannels: [...new Set(windDownChannels)].sort(codepoint),
      resolvedDeployments, dispositionDeltas: [],
      warExhaustion: worldState?.warExhaustion || {}, defenderSiegeLedger: null,
    };
  }

  const graph = snapshot?.regionalGraph || {}; const openerCasusFor = makeCurrentWarCasusRead({ snapshot, worldState, graph, rules });
  // M5: SIEGE-AS-STARVATION gate. On the spatial path (marker present) the siege
  // verdict resolves by supply interdiction × time (not the capacity roll). false off
  // the marker ⇒ every verdict runs the capacity-roll VERBATIM ⇒ byte-identical.
  const spatialSiege = armyTransitActive(/** @type {{ spatialCanonVersion?: unknown }} */ (worldState));
  // JOIN 2 — THE ARRIVAL GATE. Built ONCE from the transit layer's published ledger:
  // `atWalls(armyId, targetId)` is false only while that army's OWN march to THAT target
  // is still under way. No ledger (dark spatial / unmapped pair) ⇒ always true ⇒ the
  // besieger set below is byte-identical. The march time is bounded by MAX_MARCH_WEEKS,
  // strictly below SIEGE_MAX_AGE, so the hard ceiling still terminates every campaign.
  const atWalls = siegeArrivalGate(/** @type {{ spatialLedgers?: unknown }} */ (worldState), tick);
  // settlementStrength stays the RELATIONSHIP-dynamics confidence input (unchanged).
  const strengthFor = buildStrengthLookup(snapshot);
  // WR-6 coalition law is stricter than the host war gate: all four constituent
  // flags must be exact true.  Decisions read the PRE-TICK deployment ledger,
  // so a war opened this tick can summon allies only on the following tick.
  const coalitionWorldState = { ...worldState, simulationRules: rules };
  const coalitionLit = warCoalitionActive(coalitionWorldState);
  const coalitionJoinDecisions = coalitionLit
    ? readCoalitionJoinDecisions({ snapshot, worldState: coalitionWorldState, tick, strengthFor })
    : [];
  const coalitionDecisionByParty = new Map(
    coalitionJoinDecisions.map((decision) => [String(decision.partyId), decision]),
  );
  // The war-specific MILITARY CAPACITY model (theoretical/current). The
  // deploy/siege math reads CURRENT capacity (theoretical minus exhaustion/drain
  // minus army-away); the feasibility gate classifies the capacity ratio.
  const capacityFor = buildCapacityLookup(snapshot, existing);
  // The pre-tick mobilization posture ledger: a settlement may only OPEN a new
  // siege from a war-ready posture (mobilized / deployed). Read-only here.
  const warPosture = worldState?.warPosture && typeof worldState.warPosture === 'object' ? worldState.warPosture : {};
  // worldpulse-war-9: the pre-tick occupation ledger. An occupied settlement's own war
  // machine is constrained by its occupier — the deploy gate (step 4) blocks it from
  // besieging any THIRD party while garrisoned; only its occupier is a permissible target
  // (the uprising/rebellion path stays open). Absent ⇒ every reader inert ⇒ byte-identical.
  const occupations = worldState?.occupations && typeof worldState.occupations === 'object' ? worldState.occupations : {};
  const outcomes = [];
  const graphChannels = [];
  // war_front channel IDs whose siege RESOLVED this tick (conquest or withdrawal). The
  // caller drops each to 'dormant' so the SAME front is not re-discovered next tick and
  // the (idempotent) conquest does not re-fire forever. Deduped + codepoint-sorted below.
  /** @type {string[]} */
  const retiredChannels = [];
  const resolvedDeployments = [];
  // Disposition write-side: id-stable win/loss attributions from the contests
  // resolved THIS tick. The occupier/conquered ids are already state-decided
  // (occupier = strongest besieger, codepoint tie-break; conquered = the target),
  // so a reversed-authored save credits the SAME winner. Folded into the next-tick
  // dispositionStats ledger post-apply by the caller. Empty when nothing resolves.
  // sourceConquestId is additive provenance on a conquest delta (the resume-dismiss strip
  // matches on it); downstream applyDispositionDeltas reads only {id, outcome, magnitude}.
  /** @type {Array<{id:string, outcome:'win'|'loss', magnitude?:number, sourceConquestId?:string}>} */
  const dispositionDeltas = [];
  // Copy the ledger; never mutate worldState's record in place.
  const deployments = { ...existing };
  // Copy the NON-REVERTING war-exhaustion scar ledger (read-last/write-next).
  /** @type {Record<string, number>} */
  const warExhaustion = { ...(worldState?.warExhaustion || {}) };
  // W-C2: the rented-force market ledger (written last tick). Absent ⇒ every reader 0 ⇒
  // byte-identical. Read at the war-decision (fidelity) + deploy (supplement) seams below.
  const mercLedger = worldState?.mercenaryMarket || null;

  const settlementNameFor = (/** @type {any} */ id) => {
    const item = snapshot?.byId?.get?.(String(id));
    return item?.name || item?.settlement?.name || String(id);
  };

  // ── STRATEGIC WITHDRAWAL ORDERS (war-3 sue-for-peace, war-4 return-home). The
  // strategy / relationship apply path stamps `deployment.recalled` on an army whose
  // home DELIBERATELY breaks off its siege — a besieged home recalling its army to
  // defend the walls (return_home), or a sued-for peace winding down the physical war
  // the de-escalated label just ended. Execute the order HERE, before the siege
  // resolver, through the SAME withdrawal machinery a feasibility-collapse uses:
  // resolve the deployment as outcome:'withdrawal' (→ deploymentReturn's homecoming +
  // contextual siege-relief / occupation-lift), delete the record, retire its
  // war_front, and record the (attacker→target) pair so the siege loop below EXCLUDES
  // it — the stale front must not re-conquer the settlement the army just marched away
  // from. Unlike the siege_abandoned closer (which banks a disposition LOSS), a
  // deliberate recall / negotiated peace is a CHOICE, not a defeat: NO disposition
  // delta. An absent `recalled` stamp (every dormant / no-strategy world) ⇒ pure
  // no-op ⇒ byte-identical. ──────────────────────────────────────────────────────
  /** @type {Set<string>} */
  const recalledPairs = new Set();
  for (const attackerId of Object.keys(deployments).sort(codepoint)) {
    const rec = deployments[attackerId];
    if (!rec?.recalled || rec?.targetId == null) continue;
    const targetId = String(rec.targetId);
    resolvedDeployments.push({ attackerId, deployment: rec, targetId, outcome: 'withdrawal' });
    for (const channelId of warFrontChannelIds(graph, attackerId, targetId)) retiredChannels.push(channelId);
    recalledPairs.add(`${attackerId}:${targetId}`);
    delete deployments[attackerId];
  }

  // ── worldpulse-war-7: PRUNE deployments whose party LEFT the campaign (roster edit /
  // canon change). Mirrors occupation.js's canon-membership prune — without it, a
  // deployment whose target vanished is SKIPPED by the siege resolver yet still bleeds
  // war_drain/exhaustion forever (step 5 iterates all deployments) and permanently locks
  // its besieger under the one-army gate. Runs before step 0 so the immortal record never
  // ages. Absent-canon is rare, so every ordinary tick is a pure no-op ⇒ byte-identical:
  //   • target vanished → resolve as a WITHDRAWAL (survivors march home via the normal
  //     deploymentReturn homecoming — banked deployedPopulation conserved) + retire fronts.
  //   • attacker vanished → simply DROP the record (there is no home to return to).
  for (const attackerId of Object.keys(deployments).sort(codepoint)) {
    const rec = deployments[attackerId];
    if (rec?.targetId == null) continue;
    const targetId = String(rec.targetId);
    const attackerGone = !snapshot?.byId?.has?.(String(attackerId));
    const targetGone = !snapshot?.byId?.has?.(targetId);
    if (!attackerGone && !targetGone) continue;
    if (attackerGone) {
      delete deployments[attackerId];       // no home to return to — drop the ghost record
      continue;
    }
    // Attacker survives, target gone → bring the army home cleanly.
    resolvedDeployments.push({ attackerId, deployment: rec, targetId, outcome: 'withdrawal' });
    for (const channelId of warFrontChannelIds(graph, attackerId, targetId)) retiredChannels.push(channelId);
    recalledPairs.add(`${attackerId}:${targetId}`);
    delete deployments[attackerId];
  }

  // ── Step 0: AGE + ENRICH the stateful army ledger (read-last/write-next). For
  // every committed deployment, migrate a light record forward to a stateful
  // one (seeded from the live capacity model) and increment its `deploymentAge`. This
  // is a SINGLE pre-tick pass over the COPY — the siege verdict (below) then reads the
  // enriched `currentEffectiveStrength`, attrition degrades it, reinforcement
  // replenishes it. Codepoint-sorted for determinism. ──────────────────────────────
  for (const fromId of Object.keys(deployments).sort(codepoint)) {
    const rec = deployments[fromId];
    if (!rec?.targetId) continue;
    const burden = logisticsBurdenFor(graph, fromId, rec.targetId);
    const cap = capacityFor(fromId);
    const stateful = ensureStatefulRecord(rec, cap, tick, burden, readinessOf(snapshot?.byId?.get?.(String(fromId))?.settlement));
    // ── HOMEOSTASIS RE-COUPLING: the home's live war-exhaustion / war-drain
    // erodes the offensive capacity (cap.offensive subtracts those). A war-weary home
    // FIELDS A WEAKER ARMY, so cap the army's effective strength at the live offensive
    // ceiling — the stateful army cannot stay stronger than the worn home can sustain.
    // This keeps the strength model coupled to the exhaustion-scar arc: a protracted war
    // drags the field army down too, so the loop still closes (war trends to
    // resolution / withdrawal). The cap only ever LOWERS strength (attrition + the home
    // ceiling both bite); reinforcement lifts within it. ────────────────────────────
    const ceiling = Math.max(0, cap.offensive);
    const cappedStrength = Math.min(Number(stateful.currentEffectiveStrength) || 0, ceiling);
    deployments[fromId] = {
      ...stateful,
      currentEffectiveStrength: cappedStrength,
      deploymentAge: (Number(stateful.deploymentAge) || 0) + 1,
    };
  }

  // The STRENGTH RESOLVER: an id's STATEFUL effective strength (the depleted army
  // at the walls), or null when it has no committed deployment record. The siege
  // verdict reads this in place of the freshly-recomputed offensive capacity, so a
  // worn-down army contests — and can FAIL — at its DEPLETED strength.
  const effectiveStrengthFor = (/** @type {any} */ id) => {
    const rec = deployments[String(id)];
    return rec?.targetId && Number.isFinite(rec.currentEffectiveStrength) ? rec.currentEffectiveStrength : null;
  };

  // ── Step 3: resolve sieges. Iterate every target that has at least one besieger
  // (the union of war_front recipients and deployment targets), codepoint-sorted. ─
  const targetSet = new Set();
  for (const channel of graph?.channels || []) {
    // Only a WAR-LAYER war_front (provenance-gated) is a live siege; a hostile-
    // relationship war_front bundle shares the shape but is not a mobilized siege.
    if (isLiveWarFront(channel)) {
      targetSet.add(String(channel.to));
    }
  }
  for (const attackerId of Object.keys(deployments)) {
    const dep = deployments[attackerId];
    if (dep?.targetId) targetSet.add(String(dep.targetId));
  }
  const targets = [...targetSet].sort(codepoint);

  // Collect the attacker ids whose deployment cleared this tick (their armies return).
  const clearedAttackers = new Set();

  // Defender-attrition SPIKE (flag-gated, default OFF ⇒ all of this is inert and the
  // siege verdict uses fresh homeDefense exactly as before). When on, a besieged town
  // accrues an eroding defensive-losses ledger keyed by targetId: seeded from its fresh
  // homeDefense, worn each tick via applyAttritionToRecord(isAttacker:false), fed back
  // into the verdict, and RETIRED the moment the siege ends (fall/withdrawal) or the
  // town is no longer besieged — so a relieved town heals to full next time. Only
  // ongoing sieges survive the end-of-loop prune, so the ledger can never leak.
  const defenderAttritionEnabled = !!(/** @type {any} */ (rules)?.defenderAttritionEnabled);
  const warEconomyEnabled = !!(/** @type {any} */ (rules)?.warEconomyDrainEnabled);
  // W-C1 item 3 — SUPPLY-GAP QUALITY: a flag-gated war-outcome spike (the house pattern of
  // its siblings above). OFF ⇒ deployedQualityMult never read, qualityMult 1 everywhere ⇒
  // byte-identical (the war-test corpus + golden fixtures never seed a quality penalty).
  const warSupplyQualityEnabled = !!(rules?.warSupplyQualityEnabled);
  const qualityMultFor = (/** @type {string|number} */ id) => (warSupplyQualityEnabled ? deployedQualityMult(snapshot, String(id)) : 1);
  const defenderResolveEnabled = !!(/** @type {any} */ (rules)?.defenderResolveEnabled);
  const allyDefenseEnabled = !!(/** @type {any} */ (rules)?.allyDefenseEnabled);
  const warForageEnabled = !!(/** @type {any} */ (rules)?.warForageEnabled);
  const warLevyEnabled = !!(/** @type {any} */ (rules)?.warLevyEnabled);
  const defenderSiegeLedger = defenderAttritionEnabled ? { ...(worldState?.defenderSiegeLedger || {}) } : null;
  const ongoingSieges = defenderAttritionEnabled ? new Set() : null;

  for (const targetId of targets) {
    if (!snapshot?.byId?.has?.(targetId)) continue;
    // Besiegers = war_front sources INTO T ∪ deployment.targetId === T (dedup, sorted).
    const besiegerSet = new Set(warFrontsInto(graph, targetId));
    for (const attackerId of Object.keys(deployments)) {
      if (String(deployments[attackerId]?.targetId) === targetId) besiegerSet.add(String(attackerId));
    }
    // Three exclusions on one pass (combined so the JOIN-2 gate is net-zero on this
    // file's frozen size ceiling; `.filter(A).filter(B)` and `.filter(A && B)` are the
    // same set in the same order):
    //   • not in canon — the settlement left the campaign;
    //   • strategically withdrawn (recalled / sued-for peace) THIS tick — its army has
    //     gone home and its front is being retired, so a stale confirmed front must not
    //     resolve a phantom siege here;
    //   • JOIN 2 — still ON THE ROAD. An army whose transit record says its march to
    //     THIS target has not landed is not at the walls: it neither rolls the siege,
    //     nor ages it, nor takes siege attrition, nor withdraws. Always true when the
    //     transit layer is dark ⇒ this set is byte-identical off the spatial canon.
    const besiegers = [...besiegerSet]
      .filter(id => snapshot?.byId?.has?.(id) && !recalledPairs.has(`${id}:${targetId}`) && atWalls(id, targetId))
      .sort(codepoint);
    if (!besiegers.length) continue;

    const defenderItem = snapshot?.byId?.get?.(targetId);
    // The siege's age is the LONGEST-committed besieger's deploymentAge (the
    // committed armies were aged in step 0). This feeds the hard siege-duration
    // ceiling so a saturated stalemate auto-resolves deterministically.
    let siegeAge = 0;
    for (const id of besiegers) {
      const rec = deployments[id];
      // String-coerce like the besieger-collection compare at L798: targetId is a
      // string but a deployment record's targetId is any-typed, so a strict ===
      // would skip a numeric-id record and under-read the siege age (defeating the
      // ceiling). Only deployment-based besiegers of THIS target carry a deploymentAge.
      if (rec?.targetId != null && String(rec.targetId) === targetId) {
        siegeAge = Math.max(siegeAge, Number(rec.deploymentAge) || 0);
      }
    }
    // Flag-off: null override ⇒ resolveSiegeVerdict uses fresh homeDefense (unchanged).
    // Flag-on: feed the eroded defender strength from the ledger (seeded from fresh
    // homeDefense on the first siege tick), never above the fresh value.
    let defenderStrengthOverride = null;
    if (defenderAttritionEnabled) {
      const homeDef = capacityFor(targetId).homeDefense;
      const prior = defenderSiegeLedger[targetId];
      const eroded = prior && Number.isFinite(prior.currentEffectiveStrength) ? prior.currentEffectiveStrength : homeDef;
      defenderStrengthOverride = Math.min(eroded, homeDef);
    }
    // P3 ally defense: allied/vassal/patron neighbours (not themselves besieged) send
    // relief. 0 when the flag is off ⇒ the verdict is unchanged.
    const defenderReliefBonus = allyDefenseEnabled
      ? computeAllyRelief(snapshot, targetId, capacityFor, new Set(targets), coalitionLit)
      : 0;
    // W-F4b item 2a: the PRIMARY besieger's (besiegers[0]) alignment-conditioned
    // fidelity pull — 0 (⇒ the classify inputs stay TRUE, byte-identical) unless it
    // carries a chaotic-devout patron with a projected piety record.
    const attackerFidelity = besiegers.length ? chaosPullOf(snapshot?.byId?.get?.(String(besiegers[0]))?.settlement) : 0;
    // W-C2: hired steel reads the risk calculator worse than sworn steel — the mercenary
    // fidelity penalty is ADDED to the rust magnitude (both are institutional-inexperience
    // errors; fidelityFactor sums them under TOTAL_MAX). 0 when no active market ⇒ byte-identical.
    const attackerRust = besiegers.length
      ? rustOf(snapshot?.byId?.get?.(String(besiegers[0]))?.settlement) + mercFidelityPenaltyOf(mercLedger, besiegers[0])
      : 0;
    // M2b: how supply-starved the besieged target is (prior-tick shipment ledger). 0 on
    // the aspatial path (no marker / no ledger) ⇒ the verdict term contributes 0.
    const supplyInterdiction = supplyInterdictionLevel(worldState, targetId);
    const verdict = resolveSiegeVerdict({ targetId, besiegers, capacityFor, effectiveStrengthFor, defenderItem, rng, tick, siegeAge, defenderStrengthOverride, defenderResolveEnabled, defenderReliefBonus, attackerFidelity, attackerRust, supplyInterdiction, spatialSiege });

    // ── ATTRITION: degrade every committed BESIEGER's field army after the
    // engagement. Each army is attrited ONLY when it is the attacker on its OWN front
    // (a mutual-siege army is the besieger on one front and the DEFENDER on the other —
    // it is attrited once, on its own front, never double-counted). The loss is a
    // deterministic, bounded fraction of effective strength scaled by the outcome band,
    // relative strength, siege length, fortification, and its own supply/morale/magic/
    // food. Codepoint-sorted; applied to the COPY (next-tick ledger). The depleted
    // strength feeds the NEXT tick's verdict — so a long/failed campaign degrades the
    // army until it can no longer take even a weaker target (the keystone property). The
    // defender ALSO takes losses defending — modelled as a `defensive` band on the
    // defender's OWN field army (it spent men on the walls), applied below when THAT
    // army is the besieger on its front; here we only touch the besiegers of T. ──────
    const defFort = fortificationStrength(capacityFor(targetId).facets, defenderItem);
    for (const attackerId of besiegers) {
      const rec = deployments[attackerId];
      if (!rec?.targetId || String(rec.targetId) !== String(targetId)) continue;
      const { record: degraded } = applyAttritionToRecord(rec, {
        isAttacker: true,
        band: /** @type {any} */ (verdict.band),
        attackerCurrent: verdict.coalitionCurrent,
        defenderCurrent: verdict.defenderCurrent,
        fortification: defFort,
      });
      deployments[attackerId] = degraded;
    }

    // Defender-attrition SPIKE: the walls spent men holding (or being stormed). Erode
    // the per-target defender ledger with the DEFENSIVE band, and carry it forward ONLY
    // while the siege is ongoing — a fall (captured) or withdrawal (relieved) retires it.
    // (`&& ongoingSieges` narrows it non-null for strict tsc; it is set iff the flag is.)
    if (defenderAttritionEnabled && ongoingSieges) {
      const homeDef = capacityFor(targetId).homeDefense;
      const prior = defenderSiegeLedger[targetId];
      const seed = prior && Number.isFinite(prior.currentEffectiveStrength) ? prior : { currentEffectiveStrength: homeDef, deploymentAge: 0 };
      const { record: worn } = applyAttritionToRecord(seed, {
        isAttacker: false,
        band: /** @type {any} */ (verdict.band),
        attackerCurrent: verdict.coalitionCurrent,
        defenderCurrent: verdict.defenderCurrent,
        fortification: defFort,
      });
      const isWithdrawal = !verdict.falls && (verdict.forcedLift || !verdictPermitsSiege(/** @type {any} */ (verdict.verdict)));
      if (!verdict.falls && !isWithdrawal) {
        defenderSiegeLedger[targetId] = { ...worn, targetId, deploymentAge: (Number(seed.deploymentAge) || 0) + 1 };
        ongoingSieges.add(targetId);
      } else {
        delete defenderSiegeLedger[targetId];
      }
    }

    if (!verdict.falls) {
      // ── WITHDRAWAL (the homeostasis closer): a COMMITTED siege whose matchup has
      // fallen OUT of the plausible band — the besieger's current capacity collapsed
      // under war_exhaustion/war_drain (or it never plausibly out-classed the
      // defender) — does NOT freeze forever. The besieger gives up: every committed
      // attacker on this target withdraws its army home (a resolved deployment →
      // deploymentReturn). This is what makes a stalled war END instead of locking the
      // realm into a perpetual siege. Fires when the verdict forbids a siege roll
      // (auto_fail / harassment / require_coalition) OR when the hard siege-duration
      // ceiling forced a lift (verdict.forcedLift — a saturated stalemate that ran the
      // ceiling without out-classing the defender); a `plausible` siege that merely
      // HELD this tick keeps grinding (drain accrues, step 5). ──────────────────────
      if (verdict.forcedLift || !verdictPermitsSiege(/** @type {any} */ (verdict.verdict))) {
        // String-coerce like the besieger-collection compare above: a deployment record's
        // targetId is any-typed, so a strict === would leave a numeric-id record unable to
        // ever withdraw (a stuck phantom army on a lifted siege).
        const withdrawn = besiegers.filter(id => String(deployments[id]?.targetId) === targetId);
        if (withdrawn.length) {
          let guttednessSum = 0; // Σ(1 − returned/start) across the withdrawing coalition.
          const withdrawalOutcomeIds = [];
          for (const attackerId of withdrawn) {
            const withdrawnRec = deployments[attackerId];
            resolvedDeployments.push({ attackerId, deployment: withdrawnRec, targetId, outcome: 'withdrawal' });
            delete deployments[attackerId];
            clearedAttackers.add(attackerId);
            // Retire this besieger's war_front channel: the siege is broken off, so the
            // front must not persist as 'confirmed' (which would leave the former target
            // permanently 'under siege' and re-seed a phantom siege next tick).
            for (const channelId of warFrontChannelIds(graph, attackerId, targetId)) retiredChannels.push(channelId);
            // WAR OUTCOME → FUTURE RISK (reuse the disposition path): a
            // settlement that abandoned a siege banked a war LOSS, and a BADLY-DAMAGED
            // returning army banks a HEAVIER loss. This lowers its disposition
            // multiplier (computeAggressiveness reads dispositionStats) — so it is
            // slower to re-mobilize AND rivals reading the lowered confidence detect a
            // weakened settlement (a low-strength returnee is more vulnerable). The
            // magnitude scales with how gutted the army came home.
            const ratio = (() => {
              const m = Number(withdrawnRec?.maxStartStrength);
              const c = Number(withdrawnRec?.currentEffectiveStrength);
              return Number.isFinite(m) && m > 0 && Number.isFinite(c) ? Math.max(0, Math.min(1, c / m)) : 1;
            })();
            guttednessSum += 1 - ratio;
            const name = settlementNameFor(attackerId);
            const targetName = settlementNameFor(targetId);
            const withdrawalOutcomeId = `world_outcome.siege_abandoned.${stablePart(attackerId)}.${stablePart(targetId)}.${tick}`;
            withdrawalOutcomeIds.push(withdrawalOutcomeId);
            dispositionDeltas.push({
              id: String(attackerId), outcome: 'loss', magnitude: clamp01(0.5 + (1 - ratio) * 0.5),
              sourceEventId: withdrawalOutcomeId,
            });
            outcomes.push(warConditionOutcome({
              id: withdrawalOutcomeId,
              archetype: 'war_exhaustion',
              targetSaveId: attackerId,
              severity: clamp01(0.3 + (warExhaustion[attackerId] || 0) * 0.4),
              headline: `${name} breaks off the siege of ${targetName}`,
              summary: `${name}'s army can no longer plausibly take ${targetName}. It withdraws, the campaign abandoned.`,
              reasons: verdict.reasons,
              tick,
              sourceEventTargetId: targetId,
              causes: [{ source: attackerId, effect: 'war_exhaustion', reason: `${name} abandoned the siege of ${targetName} (no longer feasible).` }],
            }));
          }
          // worldpulse-war-8: the DEFENDER banks the win. Outlasting a siege until the
          // besieger(s) break off is a successful defense — credit the target ONCE (a
          // coalition break-off is ONE defense, not N, so this is OUTSIDE the per-attacker
          // loop), magnitude scaled by how gutted the withdrawing force came home. Feeds
          // computeAggressiveness so an emboldened survivor reads differently from an
          // unattacked town. Behind warLayerEnabled; the ±SCORE_MAX clamp bounds it.
          dispositionDeltas.push({
            id: String(targetId), outcome: 'win', magnitude: clamp01(0.4 + (guttednessSum / withdrawn.length) * 0.4),
            sourceEventIds: withdrawalOutcomeIds,
          });
          continue; // the siege is broken off — no harassment on top.
        }
        // No live deployment to withdraw, but a STALE confirmed war_front channel may
        // still point at the target from a former besieger (its army already returned a
        // prior tick, but the front was never retired). The matchup is no longer
        // siege-feasible, so retire those stale fronts too — otherwise the target stays
        // permanently 'under siege' for pressure/strategy and the former besieger can
        // never mount a new campaign (finding 4). A still-feasible front would have rolled
        // above and is left untouched.
        for (const attackerId of besiegers) {
          if (String(deployments[attackerId]?.targetId) === targetId) continue; // (none here — withdrawn.length was 0; same String-coercion contract)
          for (const channelId of warFrontChannelIds(graph, attackerId, targetId)) retiredChannels.push(channelId);
        }
      }
      // ── HARASSMENT: a feasibility-gated weak attacker that cannot storm the town
      // still RAIDS — a low-severity war_pressure on the target (NOT a siege fall, NOT
      // a power transfer). Emitted once per harassed target. A plausible siege that
      // merely held this tick (drain keeps accruing in step 5) emits nothing here. ──
      if (verdict.harass) {
        const targetName = settlementNameFor(targetId);
        const raiderName = settlementNameFor(besiegers[0]);
        outcomes.push(warConditionOutcome({
          id: `world_outcome.harassment.${stablePart(targetId)}.${tick}`,
          archetype: 'war_pressure',
          targetSaveId: targetId,
          severity: HARASSMENT_SEVERITY,
          headline: `${targetName} is harried`,
          summary: `${raiderName}'s force is too weak to storm ${targetName}, but it raids the approaches and pressures the defenders.`,
          reasons: verdict.reasons,
          tick,
          sourceEventTargetId: besiegers[0],
          causes: [{ source: besiegers[0], effect: 'war_pressure', reason: `${raiderName} harasses ${targetName} (siege implausible).` }],
        }));
      }
      continue; // siege holds / auto-fails / harasses — no conquest this tick.
    }

    // ── CONQUEST: the strongest besieger (codepoint tie-break) occupies T. ──────
    const occupierId = pickOccupier(besiegers, capacityFor, effectiveStrengthFor);
    const occupierName = settlementNameFor(occupierId);
    const targetName = settlementNameFor(targetId);
    const losers = besiegers.filter(id => id !== occupierId).map(id => settlementNameFor(id));
    const coalitionStrength01 = clamp01(verdict.coalitionCurrent / 100);

    // P3 sack & forage: a stormed town is pillaged. The deltas RIDE the conquest outcome
    // (not a separate emission) so a dismissed / deferred conquest — "the takeover didn't
    // stick; the armies disperse" — withholds the sack atomically, leaving no phantom
    // population loss. Flag-off ⇒ sack is null ⇒ NO populationDeltas key is added (the
    // conquest outcome is byte-identical). The transfer is conserved with a war-dead sink.
    const sack = warForageEnabled
      ? computeSackTransfer(snapshot?.byId?.get?.(targetId)?.settlement?.population)
      : null;
    // Granary loot: the same sack empties the conquered stores into the victor's, a
    // conserved storageMonths transfer (see computeSackFoodTransfer). Rides the conquest
    // outcome like the population sack ⇒ atomic with defer/dismiss; null ⇒ no key added.
    const conqueredSettlement = snapshot?.byId?.get?.(targetId)?.settlement;
    const victorSettlement = snapshot?.byId?.get?.(occupierId)?.settlement;
    const foodSack = warForageEnabled && conqueredSettlement && victorSettlement
      ? computeSackFoodTransfer({
        conqueredStorageMonths: conqueredSettlement?.economicState?.foodSecurity?.storageMonths,
        conqueredPopulation: conqueredSettlement?.population,
        victorStorageMonths: victorSettlement?.economicState?.foodSecurity?.storageMonths,
        victorPopulation: victorSettlement?.population,
        victorCapMonths: storageCapacityMonths(victorSettlement),
      })
      : null;

    outcomes.push({
      id: `world_outcome.conquest.${stablePart(targetId)}.${tick}`,
      type: 'power_transfer',
      candidateType: 'conquest',
      ruleId: 'war_layer_conquest',
      ruleFamily: 'stressor',
      applyMode: 'auto',
      probability: 1,
      targetSaveId: targetId,
      severity: clamp01(0.6 + coalitionStrength01 * 0.2),
      headline: `${occupierName} storms ${targetName}`,
      summary: `The siege of ${targetName} broke. ${occupierName}'s army holds the walls; an occupation authority now rules in the conqueror's name.`,
      reasons: [
        `Coalition current capacity ${verdict.coalitionCurrent.toFixed(1)} vs defender ${verdict.defenderCurrent.toFixed(1)} (feasibility: ${verdict.verdict}, ratio ${verdict.ratio.toFixed(2)}).`,
        `Fall chance ${verdict.pFall.toFixed(2)}, roll ${verdict.roll.toFixed(2)}.`,
      ],
      powerTransfer: {
        toPowerName: `${occupierName} occupation authority`,
        cause: 'conquest',
        tick,
        losers,
        sourceStressorId: `war_front.${stablePart(occupierId)}.${stablePart(targetId)}`,
      },
      condition: {
        archetype: 'war_pressure',
        severity: clamp01(0.55 + coalitionStrength01 * 0.2),
        triggeredAt: { tick, sourceEventType: 'WAR_LAYER_CONQUEST', sourceEventTargetId: targetId },
        causes: [{
          source: occupierId,
          effect: 'war_pressure',
          reason: `${occupierName} conquered ${targetName}.`,
        }],
      },
      ...(sack ? {
        populationDeltas: [
          { saveId: String(targetId), delta: -sack.sacked, reason: `${occupierName}'s army sacks ${targetName}.` },
          ...(sack.captured > 0
            ? [{ saveId: String(occupierId), delta: sack.captured, reason: `Captives and levies from ${targetName} are carried to ${occupierName}.` }]
            : []),
        ],
      } : {}),
      ...(foodSack && foodSack.lostMonths > 0 ? {
        foodStockpileDeltas: [
          { saveId: String(targetId), deltaMonths: -foodSack.lostMonths, reason: `${occupierName}'s army loots the granaries of ${targetName}.` },
          ...(foodSack.gainedMonths > 0
            ? [{ saveId: String(occupierId), deltaMonths: foodSack.gainedMonths, reason: `Seized stores from ${targetName} resupply ${occupierName}.` }]
            : []),
        ],
      } : {}),
    });

    // Disposition ratchet: the conqueror banked a war WIN; the conquered settlement a LOSS.
    // Tag each delta with the SOURCE conquest's outcome id so a DM-dismissed conquest can
    // remove EXACTLY its own win/loss pair (the resume-dismiss residue strip), rather than
    // matching on {id, outcome} alone — which is order-fragile when an occupier banks two
    // conquests at once or already carried an unrelated win this tick. sourceConquestId is
    // additive metadata: applyDispositionDeltas reads only {id, outcome, magnitude}, so a
    // committed (un-dismissed) delta carries it harmlessly.
    const conquestId = `world_outcome.conquest.${stablePart(targetId)}.${tick}`;
    dispositionDeltas.push({ id: String(occupierId), outcome: 'win', magnitude: 1, sourceConquestId: conquestId });
    dispositionDeltas.push({ id: String(targetId), outcome: 'loss', magnitude: 1, sourceConquestId: conquestId });

    // ALL besiegers' armies return home — the siege is over (won). Clear their
    // deployments; deploymentReturn turns each return into a contextual outcome.
    for (const attackerId of besiegers) {
      if (deployments[attackerId]) {
        resolvedDeployments.push({ attackerId, deployment: deployments[attackerId], targetId, outcome: 'conquest' });
        delete deployments[attackerId];
        clearedAttackers.add(attackerId);
      }
      // RETIRE every besieger's war_front channel — the siege RESOLVED (the target fell).
      // Without this the front stays 'confirmed', so next tick the (idempotent) conquest
      // re-fires every tick forever: a fresh conquest realm-event + chronicle entry, a
      // re-seeded 'contested' occupation, and disposition deltas, for a siege that already
      // ended (finding 1). Drop EVERY besieger's channel (coalition members included),
      // whether or not it still has a live deployment.
      for (const channelId of warFrontChannelIds(graph, attackerId, targetId)) retiredChannels.push(channelId);
    }
  }

  // ── Step 4: new deployments. Iterate every candidate settlement codepoint-sorted. ─
  const candidateIds = (snapshot?.settlements || [])
    .map((/** @type {any} */ item) => String(item.id))
    .sort(codepoint);

  // M9d — THE INITIATION AUTHORITY: opening a NEW siege is a campaign-altering major.
  // Its applyMode is now resolved through the shared authority policy (once — a pure
  // read of `rules`, no rng). LEGACY (routine / full autonomy, incl. absent rules) ⇒
  // 'auto' VERBATIM: the mint runs inline exactly as before (byte-identical). DM-DRIVEN
  // (dm_only / recommendations) ⇒ 'proposal': the deployment seed + war_front are HELD
  // this tick and carried in the outcome's proposalPayload, so the DM's approval re-mints
  // the siege and a decline/expiry opens no war. Resolution (resolveSiegeVerdict) is
  // untouched — only initiation splits.
  const warInitMode = authorityFor(rules, 'strategy_deploy', 'auto');

  // r2 worldpulse-war-military-2 — THE REVERSE ONE-ARMY LEG. convergence enforces "a settlement
  // cannot besiege AND intervene" only forward (a besieger cannot intervene). The reverse — an
  // active intervener opening a siege — was open: this gate consults the ISOLATED interventions
  // ledger (the accessor convergence uses; NOT importing convergence, keeping the lazy-leaf import
  // one-way) and blocks any settlement already committed as an intervention column from fielding a
  // second army. Drop-when-empty ⇒ the set is empty when the intervention system is dark ⇒
  // byte-identical. DESIGN_CONVERGENCE states the one-army law as bidirectional physics.
  const interventionsLedger = getSpatialLedger(worldState, 'interventions');
  /** @type {Set<string>} the ids currently committed as an intervention column. */
  const activeIntervenerIds = new Set();
  if (interventionsLedger && typeof interventionsLedger === 'object') {
    for (const rec of Object.values(/** @type {Record<string, { interId?: unknown }>} */ (interventionsLedger))) {
      const interId = rec && rec.interId != null ? String(rec.interId) : '';
      if (interId) activeIntervenerIds.add(interId);
    }
  }

  const coalitionNameFor = (id, fallback) => {
    const item = snapshot?.byId?.get?.(String(id));
    const name = item?.name || item?.settlement?.name;
    return typeof name === 'string' && name.trim() ? name.trim() : fallback;
  };
  // WR-6's refusal aftermath — the tunables, the closed cause vocabulary, the calling
  // court's bounded character read and the outcome that carries them — moved to
  // ./warCoalitionRefusal.js. It BUILDS the outcome and cannot push one; this closure
  // is the only thing that pushes, so all six refusal sites below are unchanged.
  const pushCoalitionRefusal = (decision, refusalCause = 'strategic') => {
    outcomes.push(buildCoalitionRefusalOutcome({
      worldState, rules, snapshot, decision, refusalCause, tick, coalitionNameFor,
    }));
  };

  for (const fromId of candidateIds) {
    const coalitionDecision = coalitionDecisionByParty.get(fromId) || null;
    if (deployments[fromId]) continue;                 // one-army constraint
    // M10a — HOLD (dedup): a HELD war-init (warInitMode 'proposal') withholds the
    // deployment, so the mobilized besieger would otherwise re-propose the SAME
    // siege every tick, spamming the approval queue. While a pending strategy_deploy
    // proposal for this besieger sits unresolved, the actor HOLDS — no duplicate.
    // The legacy/auto path mints inline (caught by the one-army gate above) and
    // never holds ⇒ this guard is byte-invisible when initiation is not proposal-gated.
    if ((warInitMode === 'proposal' || coalitionDecision)
      && pendingActorMajorFor(worldState, 'strategy_deploy', fromId)) continue;
    if (coalitionDecision) {
      // The call was priced from the pre-tick root, but the root siege resolved
      // before this opener.  Revalidate against the UPDATED ledger so a conquest,
      // withdrawal, recall, or vanished target cannot resurrect an ended episode.
      // A lapsed call emits neither join nor refusal: there is no longer a call
      // to answer by the time this army would march.
      const anchor = coalitionDecision.anchor;
      const root = deployments[anchor.originAttackerId];
      const rootTargetId = anchor.originAttackerId === anchor.callerId
        ? anchor.enemyId
        : anchor.callerId;
      const rootSurvives = root
        && root.recalled == null
        && Number(root.sinceTick) === anchor.originSinceTick
        && String(root.targetId || '') === rootTargetId
        && !joinAnchorOf(root, anchor.originAttackerId)
        && snapshot?.byId?.has?.(anchor.partyId)
        && snapshot?.byId?.has?.(anchor.callerId)
        && snapshot?.byId?.has?.(anchor.enemyId)
        && treatyEligibleWarTargets(
          coalitionWorldState,
          anchor.partyId,
          [anchor.enemyId],
          tick,
        ).length === 1;
      if (!rootSurvives) continue;
    }
    if (coalitionDecision && !coalitionDecision.accepted) {
      pushCoalitionRefusal(coalitionDecision);
      continue;
    }
    if (activeIntervenerIds.has(fromId)) {             // already committed as an intervention column
      if (coalitionDecision) pushCoalitionRefusal(coalitionDecision, 'army_committed');
      continue;
    }
    if (clearedAttackers.has(fromId)) {                // army just returned this tick
      if (coalitionDecision) pushCoalitionRefusal(coalitionDecision, 'army_returned');
      continue;
    }
    if (isBesieged(graph, fromId)) {                   // can't march while besieged/occupied
      if (coalitionDecision) pushCoalitionRefusal(coalitionDecision, 'home_threatened');
      continue;
    }
    // MOBILIZATION POSTURE GATE (the keystone): a settlement cannot launch a
    // serious siege from peace. It must have RAMPED to a war-ready posture
    // (mobilized / deployed) over prior ticks. A `peace`/`alert`/`war_preparation`
    // settlement is BLOCKED here — no fresh front, no matter how strong. (Pre-seeded
    // sieges already in the graph are resolved above regardless of posture; this gate
    // only governs OPENING a NEW one.)
    // A ratified alliance call is itself the mobilizing authority for the
    // joining court.  Ordinary opportunistic wars still require the pre-built
    // posture; otherwise a defender's ally could never replace the free relief
    // this lit mode deliberately removes.
    if (!coalitionDecision && !isWarReady(warPosture[fromId]?.state)) continue;

    const fromStrength = strengthFor(fromId);
    if (!coalitionDecision && fromStrength < HOSTILE_CONFIDENCE) continue; // ordinary hostile confidence gate
    const fromCap = capacityFor(fromId);
    // worldpulse-war-9: is this settlement under an active occupation, and by whom? An
    // occupied town may march ONLY against its occupier (a rising), never a third party.
    const occupierOfFrom = occupations[fromId]?.occupierId != null ? String(occupations[fromId].occupierId) : null;
    if (coalitionDecision && occupierOfFrom && coalitionDecision.enemyId !== occupierOfFrom) {
      pushCoalitionRefusal(coalitionDecision, 'occupied');
      continue;
    }
    if (coalitionDecision) {
      const defenderCap = capacityFor(coalitionDecision.enemyId);
      const { verdict } = classifyFeasibility({
        attackerCurrent: fromCap.offensive,
        defenderCurrent: defenderCap.homeDefense,
        coalitionSize: 1,
        defenderItem: snapshot?.byId?.get?.(coalitionDecision.enemyId),
        attackerFacets: fromCap.facets,
        defenderFacets: defenderCap.facets,
      });
      if (!verdictPermitsSiege(verdict)) {
        pushCoalitionRefusal(
          coalitionDecision,
          'front_infeasible',
        );
        continue;
      }
    }

    // Pick the first hostile target (codepoint-sorted) this settlement can PLAUSIBLY
    // besiege ALONE — the hard feasibility gate runs on the CURRENT-capacity matchup
    // BEFORE any front is minted, so a thorpe cannot open a solo siege on a strong
    // town even at a war-ready posture. Only a `plausible` (or satisfied override)
    // solo verdict mints a front; require_coalition / harassment / auto_fail do not.
    // JOIN 1 — THE RESOLVED MARCH. The live ORDER (if any) this settlement's seat left
    // for the opener when the strategy chooser resolved on `deploy` last tick. Null —
    // and every consumer below therefore a no-op, running today's expression verbatim —
    // when the chooser is dark, resolved otherwise, or the order has expired.
    const marchOrder = coalitionDecision ? null : warIntentFor(worldState, fromId, tick);
    let chosenTarget = coalitionDecision ? coalitionDecision.enemyId : null;
    // WR-0c: the shared target census removes any pair protected by an honored
    // non-aggression term at this tick. Repudiation is a separate, receipted realm
    // decision; the opener never treats a march order as permission to ignore a pact.
    for (const targetId of coalitionDecision ? [] : intentTargetOrder(hostileTargetsOf(snapshot, fromId, tick), marchOrder)) {
      // The ordered target is tried FIRST (intentTargetOrder above) and is the one
      // target for which the CONQUEST_MARGIN pre-filter is waived below: that filter
      // stands in for a deliberation the seat has now actually performed. Every HARD
      // gate — occupation, already-besieging, and classifyFeasibility — still applies.
      const ordered = intentNamesTarget(marchOrder, targetId);
      // worldpulse-war-9: under occupation, the ONLY permissible target is the occupier
      // (the uprising). Any third-party siege is blocked while garrisoned.
      if (occupierOfFrom && String(targetId) !== occupierOfFrom) continue;
      if (isBesieged(graph, targetId)
          && warFrontsInto(graph, targetId).includes(fromId)) {
        // already besieging it (shouldn't happen without a deployment, but guard)
        continue;
      }
      // W-PEACE-1 §H: an accumulated typed CASUS emboldens the march — the
      // margin gate reads fromStrength lifted by the bounded case factor
      // (≤ ×(1+WAR_FACTOR_W); exactly ×1 when the peace-engine gate is dark or
      // no case stands, so the dormant comparison is byte-identical).
      const casusRead = peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */ (/** @type {unknown} */ (worldState))) ? openerCasusFor(String(fromId), String(targetId)) : null;
      const casusEntry = casusRead?.entry || null;
      const casusMult = casusEntry ? 1 + REASON_TUNING.WAR_FACTOR_W * aggregateReasons01(casusEntry) : 1;
      if ((!ordered || casusRead?.opportunismCounterforced) && fromStrength * casusMult <= strengthFor(targetId) + CONQUEST_MARGIN) continue; // a counterforced stale case restores the prefilter even for an old order
      const defenderCap = capacityFor(targetId);
      const { verdict } = classifyFeasibility({
        attackerCurrent: fromCap.offensive,
        defenderCurrent: defenderCap.homeDefense,
        coalitionSize: 1,
        defenderItem: snapshot?.byId?.get?.(targetId),
        attackerFacets: fromCap.facets,
        defenderFacets: defenderCap.facets,
      });
      if (verdictPermitsSiege(verdict)) { chosenTarget = targetId; break; }
    }
    if (!chosenTarget) continue;

    // SEED the STATEFUL army record from the origin's capacity model at deploy
    // time (full-strength token: maxStartStrength = currentEffectiveStrength = the
    // origin's offensive capacity). Attrition degrades it, reinforcement replenishes
    // it, the siege verdict reads its currentEffectiveStrength.
    const fromSettlement = snapshot?.byId?.get?.(String(fromId))?.settlement;
    // Seed the deployment record HERE regardless of mode — the sizing rust fork
    // (seedDeploymentState → fidelityFactor when rust>0) MUST fire at THIS point so the
    // rng-draw order the siege pins depend on is preserved on the legacy path. Under
    // DM-Driven the seeded record rides the proposalPayload instead of the live ledger.
    const seededRecord = seedDeploymentState({
      targetId: chosenTarget,
      cap: fromCap,
      tick,
      logisticsBurden: logisticsBurdenFor(graph, fromId, chosenTarget),
      role: 'siege',
      // W-C2: a settlement short of its exposure BUYS readiness through the mercenary market
      // (bounded supplement — force it didn't train). 0 when no active market ⇒ byte-identical.
      readiness: clamp01(readinessOf(fromSettlement) + mercSupplementOf(mercLedger, fromId)),
      // W-C1 item 1a: the sizing DECISION — a rusty realm over/under-commits (rust 0 ⇒ no fork).
      // W-C2: hired steel adds its fidelity penalty to the sizing rust (mis-sized commitment).
      sizing: { rng, cid: String(fromId), rust: rustOf(fromSettlement) + mercFidelityPenaltyOf(mercLedger, fromId) },
      // W-C1 item 3: supply-gap quality on the committed force (flag off ⇒ 1 ⇒ byte-identical).
      qualityMult: qualityMultFor(fromId),
    });
    if (coalitionDecision) seededRecord.joinLedger = [coalitionDecision.anchor];
    // W-PEACE-1 §14 (the artifact law): the war record CARRIES its casus list —
    // the top typed reasons standing against the chosen target at the moment the
    // army marched. Stamped ONLY when the peace-engine gate is lit and a case
    // stands (the dormant record shape is byte-identical). Rides the record
    // through attrition (applyAttritionToRecord spreads ...record) and through
    // the DM-Driven proposalPayload (the seeded record is embedded verbatim).
    const openingReasons = coalitionDecision
      ? [{
        type: 'alliance_obligation',
        score: coalitionDecision.score01,
        receipt: 'A sworn ally remains in the field under the same living cause.',
      }]
      : peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */ (/** @type {unknown} */ (worldState)))
        ? topReasons(openerCasusFor(String(fromId), String(chosenTarget)).entry, 3)
        : [];
    const { casusReasons: casusList, sacredAnchors } = pinDeploymentCasusReasons({ reasons: openingReasons, tick, attackerItem: snapshot?.byId?.get?.(String(fromId)), defenderItem: snapshot?.byId?.get?.(String(chosenTarget)), simulationRules: rules });
    if (casusList.length) seededRecord.casusReasons = casusList; Object.assign(seededRecord, sacredAnchors);
    // The war_front channel PARAMS (the `now` stamp is applied at mint time). On the
    // legacy path they are minted immediately (below); under DM-Driven they ride the
    // proposalPayload verbatim and the apply re-mints an identical front on approval.
    const frontParams = {
      type: 'war_front',
      from: fromId,
      to: chosenTarget,
      strength: clamp01(0.5 + fromStrength * 0.3),
      confidence: 0.8,
      explanation: coalitionDecision
        ? `${coalitionNameFor(fromId, 'The allied court')} marches on ${coalitionNameFor(chosenTarget, 'the opposing court')}.`
        : `${settlementNameFor(fromId)} marches on ${settlementNameFor(chosenTarget)}.`,
      relationshipKey: `war_front.${stablePart(fromId)}.${stablePart(chosenTarget)}`,
      source: coalitionDecision ? 'war_layer_coalition_join' : 'war_layer_deploy',
      ...(coalitionDecision ? {
        coalitionCallId: coalitionDecision.callId,
        coalitionCallerId: coalitionDecision.callerId,
        coalitionRelationshipKey: coalitionDecision.relationshipKey,
      } : {}),
    };
    if (warInitMode !== 'proposal') {
      // LEGACY / AUTO — install the siege inline, byte-identically to the pre-M9d engine.
      deployments[fromId] = seededRecord;
      graphChannels.push(mintDirectedChannel({ ...frontParams, now }));
    }
    // DM-DRIVEN — the deployment + front are WITHHELD: no ledger seed, no graph mint
    // this tick. Step 5 (home conditions) never sees this deployer, so no war_drain /
    // army_deployed / exhaustion ratchet accrues until the DM approves. The apply of the
    // proposal (below) re-mints the held siege from the payload.

    // ── SIEGE INITIATION as a deferrable MAJOR. Opening a NEW siege is a
    // campaign-altering move (a strategy_deploy, listed in decisionTier's
    // CAMPAIGN_ALTERING_CANDIDATE_TYPES) the DM should get a say on once pausing lands —
    // exactly like the conquest that may END it. So surface the deploy as its own major
    // outcome. It is a SETTLEMENT-STATE no-op (no condition / power_transfer): the home
    // bleed is the war_drain/army_deployed conditions in step 5 and the front is the
    // graph mint above; this outcome only ANNOUNCES the march and gives the pause/dismiss
    // path a handle to suppress its out-of-band residue (the deployment seed + the
    // war_front channel). targetSaveId is the BESIEGER (the actor mobilizing the army) and
    // sourceEventTargetId the BESIEGED — the pulseKernel residue strip reads both off this
    // outcome to drop the new deployment + its front when the siege is deferred/dismissed.
    const fromName = coalitionDecision
      ? coalitionNameFor(fromId, 'The allied court')
      : settlementNameFor(fromId);
    const chosenName = coalitionDecision
      ? coalitionNameFor(chosenTarget, 'the opposing court')
      : settlementNameFor(chosenTarget);
    const callerName = coalitionDecision
      ? coalitionNameFor(coalitionDecision.callerId, 'the calling ally')
      : '';
    const coalitionProposal = !!coalitionDecision && warInitMode === 'proposal';
    // W-C1 legibility: name the two new martial causes when they moved the committed force.
    // Read the just-seeded record directly (under DM-Driven it is NOT in `deployments`).
    const seededRec = seededRecord;
    const deployReasons = coalitionDecision
      ? (coalitionProposal
        ? [
          `${fromName} is prepared to answer ${callerName}'s living cause if the proposed march is approved.`,
          `The court weighed the wider retaliation the proposed march could awaken.`,
          `Proposed casus belli: a sworn alliance obligation under the same living cause.`,
        ]
        : [
          `${fromName} judged ${callerName}'s living cause strong enough to answer the alliance call.`,
          `The court weighed the wider retaliation the march could awaken before committing its own army.`,
          `Casus belli: a sworn alliance obligation under the same living cause.`,
        ])
      : [`${fromName} is war-ready and ${chosenName} is a feasible target.`];
    if (!coalitionDecision && Number.isFinite(seededRec?.sizingBias) && seededRec.sizingBias !== 1) {
      deployReasons.push(
        `A rusty command ${seededRec.sizingBias > 1 ? 'over' : 'under'}-committed the force (sizing ×${seededRec.sizingBias.toFixed(2)}).`,
      );
    }
    if (!coalitionDecision && Number.isFinite(seededRec?.deployedQuality) && seededRec.deployedQuality !== 1) {
      deployReasons.push(
        `Thin war-supply degraded the army's kit (deployed quality ×${seededRec.deployedQuality.toFixed(2)}).`,
      );
    }
    // W-PEACE-1 §14.4: the march's receipt NAMES its typed casus (empty when the
    // peace-engine gate is dark ⇒ the dormant outcome is byte-identical).
    for (const c of coalitionDecision ? [] : casusList) {
      deployReasons.push(`Casus belli: ${c.type} (${c.score.toFixed(2)}) — ${c.receipt}`);
    }
    outcomes.push({
      id: `world_outcome.strategy_deploy.${stablePart(fromId)}.${stablePart(chosenTarget)}.${tick}`,
      type: 'strategy_deploy',
      candidateType: 'strategy_deploy',
      ruleId: coalitionDecision ? 'war_coalition_join' : 'war_layer_strategy_deploy',
      ruleFamily: 'stressor',
      // LEGACY ⇒ 'auto' (byte-identical); DM-DRIVEN ⇒ 'proposal' (routes to the queue).
      applyMode: warInitMode,
      probability: 1,
      targetSaveId: fromId,
      severity: clamp01(0.5 + fromStrength * 0.2),
      headline: coalitionDecision
        ? (coalitionProposal
          ? `${fromName} proposes to answer ${callerName}'s call`
          : `${fromName} answers ${callerName}'s call`)
        : `${fromName} marches on ${chosenName}`,
      summary: coalitionDecision
        ? (coalitionProposal
          ? `${fromName} would commit its own army against ${chosenName} if the answer is approved; each ally would keep a separate command.`
          : `${fromName} commits its own army against ${chosenName}; the alliance is now a set of separate wars, not a shared command.`)
        : `${fromName} commits its army to a siege of ${chosenName}. The campaign is opened.`,
      reasons: deployReasons,
      sourceEventTargetId: chosenTarget,
      ...(coalitionDecision ? {
        relationshipKey: coalitionDecision.relationshipKey,
        relationshipPatch: {},
        metadata: {
          incidentType: 'coalition_joined',
          allianceCall: coalitionCallArchiveRow(coalitionDecision, 'joined', tick),
          coalitionEvidence: coalitionDecisionEvidence(coalitionDecision, true, tick),
          coalitionEnemyRelationship: {
            partyId: String(fromId),
            enemyId: String(chosenTarget),
          },
        },
      } : {}),
      // M9d — the siege-initiation payload. Present ONLY under DM-Driven (the legacy
      // outcome is byte-identical — no field added). On approval, applyWorldPulseOutcomes
      // re-mints the WITHHELD deployment + war_front from this payload. `deployment` is the
      // seeded army record; `warFront` the channel params (minus `now`, applied at mint).
      ...(warInitMode === 'proposal'
        ? {
          proposalPayload: {
            kind: 'siege_initiation',
            besieger: String(fromId),
            besieged: String(chosenTarget),
            deployment: seededRecord,
            warFront: frontParams,
            ...(coalitionDecision ? { coalition: coalitionDecision.anchor } : {}),
          },
        }
        : {}),
    });
  }

  // ── Steps 5 + 5b — WHAT THE WAR COSTS THE HOME. The per-tick home-side charge
  // (conscription, vassal levy, reinforcement + its cost, war_drain, army_deployed,
  // the war-exhaustion ratchet) and the scar's slow decay for homes whose army came
  // back, moved to ./warHomeCosts.js together with the two functions that INVERT them
  // for a DM-dismissed siege. It mutates these two ledger copies and returns them.
  const homeCosts = applyHomeWarCosts({
    snapshot,
    graph,
    deployments,
    warExhaustion,
    capacityFor,
    settlementNameFor,
    targets,
    preTickDeployments: existing,
    tick,
    warEconomyEnabled,
    warLevyEnabled,
    coalitionLit,
  });
  outcomes.push(...homeCosts.outcomes);

  // Dedup + codepoint-sort the retired channel ids (a coalition can list the same
  // target front once per besieger; the caller's setRegionalChannelStatus is idempotent,
  // but a stable, deduped list keeps the output order-independent).
  const retiredChannelsOut = [...new Set(retiredChannels)].sort(codepoint);

  // Defender-attrition SPIKE: retire every ledger entry whose siege is no longer
  // ongoing (fell, lifted, or simply not besieged this tick) so a relieved town heals
  // to fresh homeDefense next time — the ledger only ever holds active sieges, so it
  // cannot leak. null when the flag is off ⇒ the kernel skips threading it entirely.
  if (defenderSiegeLedger && ongoingSieges) {
    for (const id of Object.keys(defenderSiegeLedger)) {
      if (!ongoingSieges.has(id)) delete defenderSiegeLedger[id];
    }
  }
  return { outcomes, deployments, graphChannels, retiredChannels: retiredChannelsOut, resolvedDeployments, dispositionDeltas, warExhaustion, defenderSiegeLedger };
}
