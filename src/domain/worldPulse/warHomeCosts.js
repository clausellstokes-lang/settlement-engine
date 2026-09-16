/**
 * domain/worldPulse/warHomeCosts.js — WHAT THE WAR COSTS THE HOME.
 *
 * THE DECOMPOSITION WAVE (war tranche, ruling R-BLD-4). The war layer's per-tick
 * home-side pass and everything that shares its arithmetic: the conscription and
 * vassal-levy debits, the reinforcement flow and its cost, the front-count and
 * deployment-age war_drain, the army_deployed garrison debuff, the NON-REVERTING
 * war-exhaustion scar (its ratchet UP for every active deployer and its ~5x slower
 * DECAY for every home whose army came back), and the two functions that INVERT all
 * of it when a DM dismisses or defers the siege that caused it.
 *
 * WHY THESE LIVE TOGETHER. `revertSuppressedDeployExhaustion` and
 * `stripSuppressedDeployResidue` exist to reproduce the counterfactual in which the
 * deploy never fired. They can only stay correct if they are read beside the accrual
 * they invert — LEVY_STRAIN_GROSS_PER_TICK is exactly the same-tick decay compensation
 * the strip subtracts back, and getting that pairing wrong silently leaks or double-
 * charges a vassal's loyalty. Splitting the accrual from its inverse would put a
 * module boundary through the middle of one conserved quantity.
 *
 * THE MUTATION CONTRACT, STATED. `applyHomeWarCosts` MUTATES the `deployments` and
 * `warExhaustion` objects it is handed and returns the same references. That is
 * deliberate and safe: the head hands it its OWN per-tick COPIES (evaluateWarLayer
 * spreads worldState's ledgers before anything touches them), never worldState's
 * records. Nothing here reads or writes worldState.
 *
 * DETERMINISM. Every iteration is over a codepoint-sorted key list; no rng, no clock.
 */

import { clamp01 } from '../region/contestMath.js';
import { stablePart } from './worldState.js';
import { formatCount } from '../formatNumber.js';
import {
  getRelationshipSettlements,
  relationshipKeyFromEdge,
  normalizeRelationshipEdge,
  ensureRelationshipState,
  relationshipRoles,
} from './relationshipEvolution.js';
import { codepoint, buildOriginEnvelope } from './warCapacityReads.js';
import { warFrontsFrom } from './warFrontReads.js';
import { computeReinforcement, applyReinforcementToRecord } from './reinforcement.js';
import { computeSackFoodTransfer, storageCapacityMonths } from './foodStockpile.js';
import { deriveDecisionTier } from './decisionTier.js';
import { recurringWarConditionRecordMode, warConditionOutcome, warExhaustionClearanceOutcome } from './warRecordMode.js';

/**
 * Shared war/trade/occupation sim-shape typedefs (see ./pulseShapes.js) — aliased
 * locally so the annotations read as they did before the split.
 * @typedef {import('./pulseShapes.js').PulseSnapshot} PulseSnapshot
 * @typedef {import('./pulseShapes.js').RegionGraph} RegionGraph
 * @typedef {import('./pulseShapes.js').DeploymentRecord} DeploymentRecord
 * @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome
 */

// ── The home-cost tunables. WAR_DRAIN_PER_FRONT scales the war_drain condition by the
// count of active fronts from the home; ARMY_DEPLOYED_SEVERITY is the flat garrison
// debuff while the army is abroad.
const WAR_DRAIN_PER_FRONT = 0.34; // severity per active war_front from the home (capped 1)
const ARMY_DEPLOYED_SEVERITY = 0.5;

// ── War-exhaustion SCAR tunables (the homeostasis closer) ────────────────────────
// The scar is a worldState ledger (warExhaustion[homeId] → 0..1) ratcheted up while a
// deployment is sustained and decayed only SLOWLY when the war ends — so a long war
// leaves a lasting economic wound that keeps pushing the realm toward suing for peace,
// UNLIKE a relationship (which mean-reverts ~12%/tick). The scar is surfaced as a
// war_exhaustion condition (economic_capacity sink + a direct settlementStrength
// penalty), which is what flips a stubborn aggressor's confidence below the gate.
const EXHAUSTION_ACCRUE_PER_TICK = 0.16; // ratchet up per tick of sustained deployment
const EXHAUSTION_DECAY_PER_TICK = 0.03;  // decay when the army is HOME — ~5× slower (non-reverting)
// Above one tick of accrual (0.16) on purpose: the scar is about SUSTAINED war, so a
// single deploy tick stamps only war_drain/army_deployed; the war_exhaustion condition
// first registers on the SECOND tick of an unbroken campaign and deepens from there.
const EXHAUSTION_CONDITION_FLOOR = 0.20;

// War levy (F2, flag-gated). A warring settlement raises men + grain from its non-besieged
// vassal / allied neighbours. LEVY_SUPPORT_TYPES excludes 'patron' — you levy subordinates
// and peers, not your own overlord. The strain is the loyalty cost: a levied vassal accrues
// war-weariness, so an over-drawn client eventually rebels (and, under warDisposition, coups).
const LEVY_SUPPORT_TYPES = new Set(['vassal', 'allied', 'ally', 'defensive_pact']);
const LEVY_POP_RATE_PER_TICK = 0.004; // ~0.4% of a vassal's population per tick (gentler than home conscription)
const LEVY_POP_FLOOR = 300;           // never levy a vassal below this skeleton population
const LEVY_STRAIN_PER_TICK = 0.05;    // war-weariness a vassal accrues per tick of being levied (the loyalty cost)
const LEVY_FOOD_FRACTION = 0.1;       // a tenth of the vassal's granary flows to the war each tick
const LEVY_FOOD_CAPTURE = 0.6;        // of that, 60% reaches the overlord; the rest is en-route loss
// Same-tick decay compensation: a levied vassal is never a deployer (computeLevySources
// excludes deployers), so step 5b's decay runs on it the SAME tick its strain accrues.
// Accrue the GROSS (strain + one decay step) so the NET per-tick loyalty cost is exactly
// LEVY_STRAIN_PER_TICK — the raw constant alone netted 0.02/tick, stretching the 0.20
// condition floor from 4 ticks of levying to 10 and weakening the rebellion/coup
// coupling. revertSuppressedDeployExhaustion subtracts the same gross, which reproduces
// the no-levy counterfactual exactly in every case (the step-5b decay runs once per tick
// regardless of how many overlords levied the vassal).
const LEVY_STRAIN_GROSS_PER_TICK = LEVY_STRAIN_PER_TICK + EXHAUSTION_DECAY_PER_TICK;

/**
 * The non-besieged, non-deploying vassal / allied neighbours a warring settlement can levy
 * from (F2). Mirrors computeAllyRelief's symmetric support-edge reading, but over
 * LEVY_SUPPORT_TYPES (no 'patron'), and drops any source in `excludeSet` (itself besieged or
 * fielding its own army — it can spare nothing). A 'vassal' edge is HIERARCHICAL, not
 * symmetric: relationshipRoles resolves the direction (state-first via overlordSaveId, edge
 * orientation as the fallback) and only the SENIOR side may levy its junior — a junior
 * levying its own OVERLORD is excluded exactly like the 'patron' direction is. Pure,
 * codepoint-sorted, order-independent.
 * @param {PulseSnapshot} snapshot @param {string} homeId @param {Set<string>} excludeSet
 * @returns {string[]}
 */
export function computeLevySources(snapshot, homeId, excludeSet, coalitionLit = false) {
  const states = snapshot?.worldState?.relationshipStates || {};
  const sources = new Set();
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    if (!LEVY_SUPPORT_TYPES.has(relState.relationshipType)) continue;
    // WR-6 removes free peer levies: a canonical ally either joins with its own
    // army or refuses.  The senior→vassal levy remains hierarchical support.
    if (coalitionLit && relState.relationshipType !== 'vassal') continue;
    const { from, to } = getRelationshipSettlements(edge);
    const a = String(from);
    const b = String(to);
    if (relState.relationshipType === 'vassal') {
      // Hierarchy-aware: the OVERLORD levies its vassal, never the reverse.
      const { seniorId, juniorId } = relationshipRoles(edge, relState);
      if (String(seniorId) === String(homeId) && snapshot?.byId?.has?.(String(juniorId))) sources.add(String(juniorId));
      continue;
    }
    if (a === String(homeId) && snapshot?.byId?.has?.(b)) sources.add(b);
    else if (b === String(homeId) && snapshot?.byId?.has?.(a)) sources.add(a);
  }
  return [...sources].filter(id => !excludeSet.has(String(id))).sort(codepoint);
}

/**
 * Revert the OUT-OF-BAND war-exhaustion residue a SUPPRESSED (DM-dismissed / paused)
 * strategy_deploy banked this tick (the pulseKernel residue strip calls this — kept here
 * so the arithmetic shares the accrual/decay/strain tunables it inverts).
 *
 * The HOME: had the deploy never fired it would NOT have been a deployer, so its scar
 * would have taken the step-5b DECAY path instead of the accrual ratchet — replay that
 * counterfactual from the PRE-TICK ledger (byte-equal to the tick never deploying).
 * Each LEVIED VASSAL: subtract the GROSS strain (LEVY_STRAIN_GROSS_PER_TICK — the net
 * strain plus its same-tick decay compensation) the dismissed war charged it. Its own
 * step-5b decay ran once regardless of the levy, so the gross subtraction reproduces
 * the no-levy counterfactual exactly — including the multi-overlord case, where each
 * surviving levy's gross accrual stays. Entries at 0 are dropped, matching the ledger
 * hygiene.
 * Pure — returns a new ledger, never mutates.
 *
 * @param {Object} args
 * @param {Record<string, number>} args.warExhaustion         the post-evaluate (next-tick) ledger.
 * @param {Record<string, number>} args.preTickWarExhaustion  the pre-tick ledger (worldState's).
 * @param {string} args.homeId                                the dismissed deploy's besieger.
 * @param {string[]} [args.leviedSourceIds]                   vassals its war_levy strained this tick.
 * @returns {Record<string, number>}
 */
export function revertSuppressedDeployExhaustion({ warExhaustion, preTickWarExhaustion, homeId, leviedSourceIds = [] }) {
  const next = { ...warExhaustion };
  const pre = clamp01(Number(preTickWarExhaustion?.[String(homeId)]) || 0);
  const decayed = clamp01(pre - EXHAUSTION_DECAY_PER_TICK);
  if (decayed <= 0) delete next[String(homeId)];
  else next[String(homeId)] = decayed;
  for (const srcId of leviedSourceIds) {
    const reverted = clamp01((Number(next[String(srcId)]) || 0) - LEVY_STRAIN_GROSS_PER_TICK);
    if (reverted <= 0) delete next[String(srcId)];
    else next[String(srcId)] = reverted;
  }
  return next;
}

// The same-tick MINOR emissions a fresh deploy triggers (step 5 keyed to the besieger):
// the conserved conscription/levy population+granary DEBITS plus the home war conditions.
// A suppressed (DM-dismissed / paused) deploy must withhold ALL of these — left in, the
// minor partition would still auto-apply them, sinking the conscripted/levied population
// (its deployedPopulation credit-bank is stripped with the deployment) and ratcheting a
// scar for a war that never opened.
const DEPLOY_RESIDUE_TYPES = new Set([
  'war_conscription', 'war_levy', 'war_drain', 'army_deployed', 'war_exhaustion', 'reinforcement_cost',
]);

/**
 * Strip the OUT-OF-BAND residue a DEFERRED or DISMISSED strategy_deploy banked this tick,
 * so a paused/dismissed siege leaves the books BYTE-IDENTICAL to the tick never opening a
 * war. The pulseKernel dismiss path calls this; the logic lives here co-located with
 * revertSuppressedDeployExhaustion (which it drives) and the accrual/levy tunables they
 * share.
 *
 * A suppressed strategy_deploy is the campaign-altering decision to OPEN a new siege. Its
 * apply outcome is a settlement no-op (withheld by the major partition), but the deploy
 * banked residue THIS tick that must be reverted for every suppressed besieger:
 *   • the freshly-seeded deployment SEED in war.deployments (a brand-new siege holds no
 *     prior record under its key — the one-army gate — so this never drops a pre-existing
 *     campaign's army), keyed off the outcome's targetSaveId (besieger);
 *   • the war_front channel mint in war.graphChannels (besieger → sourceEventTargetId);
 *   • the war-exhaustion RATCHET — the home's accrual reverted to the no-deploy decay
 *     counterfactual, and each levied vassal's loyalty strain (read off the matching
 *     war_levy outcome's population/food deltas before it is dropped) — via
 *     revertSuppressedDeployExhaustion; and
 *   • the same-tick MINOR emissions its deployment triggered (DEPLOY_RESIDUE_TYPES).
 * Byte-neutral when nothing is suppressed (the autoresolve-ON path keeps everything).
 * Pure — reads `war` + the pre-tick ledger, returns a new war-shape slice, never mutates.
 *
 * @param {Object} args
 * @param {{ outcomes: PulseOutcome[], deployments: Record<string, DeploymentRecord>, warExhaustion: Record<string, number>, graphChannels: any[] }} args.war
 * @param {ReadonlySet<string>|null} args.suppressedIds  the dismissed/deferred major outcome ids (null ⇒ no-op).
 * @param {Record<string, number>} [args.preTickWarExhaustion]  the pre-tick (worldState) scar ledger.
 * @returns {{ deployments: Record<string, DeploymentRecord>, warExhaustion: Record<string, number>, outcomes: PulseOutcome[], graphChannels: any[] }}
 */
export function stripSuppressedDeployResidue({ war, suppressedIds, preTickWarExhaustion = {} }) {
  const base = {
    deployments: war.deployments,
    warExhaustion: war.warExhaustion,
    outcomes: war.outcomes,
    graphChannels: war.graphChannels,
  };
  if (!suppressedIds) return base;
  const suppressedDeploys = war.outcomes.filter(
    o => o?.candidateType === 'strategy_deploy'
      && deriveDecisionTier(o) === 'major'
      && suppressedIds.has(String(o.id)),
  );
  if (!suppressedDeploys.length) return base;

  const strippedDeployments = { ...war.deployments };
  const strippedFronts = new Set(); // `${from}->${to}` of fronts to drop from the mints
  const suppressedHomeIds = new Set(); // besiegers whose deploy-tick residue is stripped
  let strippedExhaustion = war.warExhaustion;
  for (const o of suppressedDeploys) {
    const fromId = String(o.targetSaveId);
    const toId = String(o.sourceEventTargetId);
    // Clear the freshly-seeded deployment (a brand-new siege has no prior record
    // under this key, so this never drops a pre-existing campaign's army).
    delete strippedDeployments[fromId];
    strippedFronts.add(`${fromId}->${toId}`);
    suppressedHomeIds.add(fromId);
    // Revert the exhaustion ratchet: the home's accrual back to the no-deploy
    // decay counterfactual, and each levied vassal's loyalty strain (the levy's
    // debit sources are read off its outcome before that outcome is dropped).
    const levy = war.outcomes.find(
      w => w?.candidateType === 'war_levy' && String(w?.targetSaveId) === fromId,
    );
    const leviedSourceIds = [...new Set([
      ...(levy?.populationDeltas || []),
      ...(levy?.foodStockpileDeltas || []),
    ]
      .filter(d => String(d?.saveId) !== fromId)
      .map(d => String(d.saveId)))];
    strippedExhaustion = revertSuppressedDeployExhaustion({
      warExhaustion: strippedExhaustion,
      preTickWarExhaustion,
      homeId: fromId,
      leviedSourceIds,
    });
  }
  return {
    deployments: strippedDeployments,
    warExhaustion: strippedExhaustion,
    outcomes: war.outcomes.filter(
      o => !(suppressedHomeIds.has(String(o?.targetSaveId))
        && DEPLOY_RESIDUE_TYPES.has(String(o?.candidateType || ''))),
    ),
    graphChannels: war.graphChannels.filter(
      c => !(c?.type === 'war_front' && strippedFronts.has(`${String(c.from)}->${String(c.to)}`)),
    ),
  };
}

// reinforcement_cost SEVERITY rides the computed origin-drain (reinforcement.js).
const REINFORCEMENT_COST_FLOOR = 0.0; // the module already floors; this is a documentation anchor.
// The deploymentAge-scaled war_drain bump: a long deployment deepens the home bleed
// even on top of the front-count drain (the proposal's "even a winning war keeps
// draining the origin", and "the longer deployed, the more it strains the origin").
const AGE_DRAIN_PER_TICK = 0.02;
const AGE_DRAIN_CAP = 0.35;

// War-economy population drain (P1, flag-gated). Each tick a deployed army is in the
// field, it conscripts this fraction of the home population to the front (accumulated
// on the record's deployedPopulation, restored on return minus the war dead). Kept
// small so a campaign bleeds the home over many ticks rather than gutting it at once,
// and floored so a war never conscripts a settlement below a skeleton population.
const WAR_CONSCRIPT_RATE_PER_TICK = 0.006; // ~0.6% of home pop per deployed tick
const WAR_CONSCRIPT_POP_FLOOR = 250;       // never conscript the home below this

/**
 * THE HOME-COST PASS (steps 5 and 5b of the war layer's tick).
 *
 * Step 5 walks every ACTIVE deployer codepoint-sorted and charges the home for the
 * campaign: reinforcement flow, conscription, vassal levy, war_drain, army_deployed,
 * reinforcement_cost, and the war-exhaustion ratchet. Step 5b then walks the scar
 * ledger and DECAYS every home that is no longer deploying, emitting the recovery /
 * levy-strain condition and the clearance outcome, and dropping keys that reach 0.
 *
 * MUTATES `deployments` and `warExhaustion` in place and returns the same references
 * (see the module header: they are the head's own per-tick copies, never worldState's).
 *
 * @param {Object} args
 * @param {PulseSnapshot} args.snapshot
 * @param {RegionGraph} args.graph                    the PRE-TICK graph (front counts come from it).
 * @param {Record<string, DeploymentRecord>} args.deployments   the head's next-tick ledger copy.
 * @param {Record<string, number>} args.warExhaustion           the head's next-tick scar copy.
 * @param {(id: unknown) => { facets: unknown }} args.capacityFor  the head's per-tick
 *   capacity lookup. This pass never reads the envelope itself — it only forwards it to
 *   buildOriginEnvelope — so the narrowest honest type is what the callee needs, and it
 *   is spelled with `unknown` rather than `any` so the split adds no new any-hole.
 * @param {(id: unknown) => string} args.settlementNameFor
 * @param {string[]} args.targets                     the besieged set (levy sources exclude them).
 * @param {Record<string, DeploymentRecord>} args.preTickDeployments  worldState's pre-tick ledger;
 *   step 5b reads it to tell "recovery has just begun" from "still war-weary".
 * @param {number} args.tick
 * @param {boolean} args.warEconomyEnabled
 * @param {boolean} args.warLevyEnabled
 * @param {boolean} args.coalitionLit
 * @returns {{ outcomes: PulseOutcome[], deployments: Record<string, DeploymentRecord>, warExhaustion: Record<string, number> }}
 */
export function applyHomeWarCosts({
  snapshot, graph, deployments, warExhaustion, capacityFor, settlementNameFor,
  targets, preTickDeployments: existing, tick,
  warEconomyEnabled, warLevyEnabled, coalitionLit,
}) {
  /** @type {PulseOutcome[]} */
  const outcomes = [];
  // ── Step 5: re-upsert the home conditions each tick for every active deployer.
  // war_drain severity ∝ the count of active war_fronts FROM S in the PRE-TICK graph
  // (NOT this-tick's fresh mints) — avoids intra-tick read-after-write, so a fresh
  // deploy raises the drain only NEXT tick. army_deployed is a flat garrison debuff. ─
  const activeDeployers = new Set(Object.keys(deployments).map(String));
  // F2: vassals levied THIS tick (populated only under warLevyEnabled ⇒ empty on the
  // default path = byte-identical). Step 5b reads it to narrate a levied vassal's scar
  // as ACTIVE levy strain rather than post-war recovery — the number is the same.
  const leviedThisTick = new Set();
  for (const fromId of Object.keys(deployments).sort(codepoint)) {
    const preTickFrontCount = warFrontsFrom(graph, fromId).length;
    // A just-deployed settlement has 0 pre-tick fronts → minimum-severity drain this
    // tick (the army IS away), scaling up next tick once the mint lands in the graph.
    const frontCount = Math.max(preTickFrontCount, 1);
    const rec = deployments[fromId];
    const name = settlementNameFor(fromId);
    const targetName = settlementNameFor(rec.targetId);
    const deploymentAge = Number(rec.deploymentAge) || 0;
    // ── REINFORCEMENT: the home sends a PARTIAL, EXPENSIVE replenishment to its
    // army in the field. The flow ∝ the origin's economy/manpower/materiel/food/trade/
    // legitimacy, damped by route burden + its own war-exhaustion, ZEROED if the home
    // is itself besieged. It NEVER fully restores (capped well below the deficit) and
    // it DRAINS the origin — the reinforcement_cost condition below carries the bleed.
    // Only an army that is actually DEPLETED draws a flow (a full-strength army receives
    // nothing → no extra drain → byte-light). ───────────────────────────────────────
    const origin = buildOriginEnvelope(snapshot, graph, capacityFor, warExhaustion, fromId);
    const flow = computeReinforcement({ record: rec, origin });
    deployments[fromId] = applyReinforcementToRecord(rec, flow);

    // ── WAR-ECONOMY CONSCRIPTION (P1, flag-gated; inert + byte-identical when off). A
    // deployed army draws real population from its home each tick — men march to the
    // front. The debit is a conserved populationDelta, and the headcount is banked on
    // the record (deployedPopulation) so the return-replenish gives back exactly the
    // SURVIVORS (deploymentReturn.js). Floored so a war can't conscript a home to zero.
    if (warEconomyEnabled) {
      const homePop = Math.max(0, Math.round(Number(snapshot?.byId?.get?.(fromId)?.settlement?.population) || 0));
      const room = Math.max(0, homePop - WAR_CONSCRIPT_POP_FLOOR);
      const sent = Math.min(Math.round(homePop * WAR_CONSCRIPT_RATE_PER_TICK), room);
      if (sent > 0) {
        const prevDeployed = Number(deployments[fromId].deployedPopulation) || 0;
        deployments[fromId] = { ...deployments[fromId], deployedPopulation: prevDeployed + sent };
        outcomes.push({
          id: `world_outcome.war_conscription.${stablePart(fromId)}.${tick}`,
          candidateType: 'war_conscription',
          targetSaveId: fromId,
          generatedAtTick: tick,
          tick, ...(deploymentAge > 0 ? { recordMode: 'state_only' } : {}),
          headline: `${name} conscripts for the front`,
          // formatCount (as deploymentReturn/populationDynamics do): this summary
          // persists into wizardNews/chronicle, so a bare toLocaleString() would emit
          // locale-divergent bytes for the same seed and break golden byte-identity.
          summary: `${name} sends ${formatCount(sent)} more to the army besieging ${targetName}.`,
          populationDeltas: [{ saveId: fromId, delta: -sent, reason: `${name} conscripts men for the campaign against ${targetName}.` }],
          metadata: { warEconomy: 'conscription', armyId: fromId, sent },
        });
      }
    }

    // ── WAR LEVY (F2, flag-gated; inert + byte-identical when off). The deploying home also
    // draws men + grain from its NON-besieged, NON-deploying vassal / allied neighbours. The
    // men join the overlord's army (a conserved populationDelta debit on the vassal + a
    // deployedPopulation credit, so homecoming returns the survivors); the grain is a gentle
    // conserved granary transfer. The cost is LOYALTY: each levied vassal accrues war-weariness
    // (→ rebellion, and couplable under warDisposition), so an over-drawn client turns on its
    // overlord. Rides a MINOR war_levy outcome (auto-applied like conscription). ─────────────
    if (warLevyEnabled) {
      // …and NOT a settlement another overlord already levied THIS tick. leviedThisTick
      // accumulates across overlords (outer loop), so a vassal/ally shared by two
      // overlords is levied at most once — otherwise each overlord's independent
      // pop/food floors draw against the same pre-tick stores and can breach the
      // skeleton floor / mint food when the debits compound past what's on hand.
      const excludeSet = new Set([...targets, ...Object.keys(deployments).map(String), ...leviedThisTick]);
      const home = snapshot?.byId?.get?.(fromId)?.settlement;
      /** @type {any[]} */
      const levyPopDeltas = [];
      /** @type {any[]} */
      const levyFoodDeltas = [];
      let totalLevied = 0;
      /** @type {Record<string, number>} */
      const leviedBySource = {};
      for (const srcId of computeLevySources(snapshot, fromId, excludeSet, coalitionLit)) {
        const src = snapshot?.byId?.get?.(srcId)?.settlement;
        if (!src) continue;
        const srcName = settlementNameFor(srcId);
        // Men: a floored fraction of the vassal's population marches into the overlord's army.
        const srcPop = Math.max(0, Math.round(Number(src.population) || 0));
        const levied = Math.min(Math.round(srcPop * LEVY_POP_RATE_PER_TICK), Math.max(0, srcPop - LEVY_POP_FLOOR));
        if (levied > 0) {
          totalLevied += levied;
          leviedBySource[srcId] = levied;
          levyPopDeltas.push({ saveId: srcId, delta: -levied, reason: `${srcName} levies men for ${name}'s war against ${targetName}.` });
        }
        // Grain: a gentle conserved granary transfer from the vassal to the overlord's home.
        const food = home ? computeSackFoodTransfer({
          conqueredStorageMonths: src?.economicState?.foodSecurity?.storageMonths,
          conqueredPopulation: src.population,
          victorStorageMonths: home?.economicState?.foodSecurity?.storageMonths,
          victorPopulation: home.population,
          victorCapMonths: storageCapacityMonths(home),
          takeFraction: LEVY_FOOD_FRACTION,
          captureFraction: LEVY_FOOD_CAPTURE,
        }) : null;
        if (food && food.lostMonths > 0) {
          levyFoodDeltas.push({ saveId: srcId, deltaMonths: -food.lostMonths, reason: `${srcName}'s granary feeds ${name}'s war.` });
          if (food.gainedMonths > 0) levyFoodDeltas.push({ saveId: fromId, deltaMonths: food.gainedMonths, reason: `Grain levied from ${srcName} resupplies ${name}.` });
        }
        // Loyalty cost: the levied vassal grows war-weary (feeds P2's coup flywheel).
        // Gross-accrued so the same-tick step-5b decay nets it to exactly
        // LEVY_STRAIN_PER_TICK (see LEVY_STRAIN_GROSS_PER_TICK).
        if (levied > 0 || (food && food.lostMonths > 0)) {
          warExhaustion[srcId] = clamp01((warExhaustion[srcId] || 0) + LEVY_STRAIN_GROSS_PER_TICK);
          leviedThisTick.add(String(srcId));
        }
      }
      if (totalLevied > 0) {
        const prevDeployed = Number(deployments[fromId].deployedPopulation) || 0;
        // Bank the per-vassal headcount alongside the aggregate deployedPopulation.
        // deploymentReturnOutcomes READS this ledger to apportion the returning survivors
        // back to each contributor — the overlord's conscript share to the overlord, each
        // vassal's levied share to that vassal — so per-settlement population conserves
        // instead of pumping one-way from vassals to overlord. It rides the same flag-gated
        // record (flag-off worlds never bank ⇒ byte-identical).
        /** @type {Record<string, number>} */
        const bankedBySource = { ...(/** @type {any} */ (deployments[fromId]).leviedPopulationBySource || {}) };
        for (const [srcId, count] of Object.entries(leviedBySource)) {
          bankedBySource[srcId] = (Number(bankedBySource[srcId]) || 0) + count;
        }
        deployments[fromId] = {
          ...deployments[fromId],
          deployedPopulation: prevDeployed + totalLevied,
          leviedPopulationBySource: bankedBySource,
        };
      }
      if (levyPopDeltas.length || levyFoodDeltas.length) {
        outcomes.push({
          id: `world_outcome.war_levy.${stablePart(fromId)}.${tick}`,
          candidateType: 'war_levy',
          targetSaveId: fromId,
          generatedAtTick: tick,
          tick, ...(deploymentAge > 0 ? { recordMode: 'state_only' } : {}),
          headline: `${name} calls up its vassals`,
          // formatCount: persists into wizardNews/chronicle (see the conscription
          // summary above for the byte-identity rationale).
          summary: `${name} levies ${formatCount(totalLevied)} men and grain from its vassals and allies for the war against ${targetName}.`,
          ...(levyPopDeltas.length ? { populationDeltas: levyPopDeltas } : {}),
          ...(levyFoodDeltas.length ? { foodStockpileDeltas: levyFoodDeltas } : {}),
          metadata: { warEconomy: 'levy', armyId: fromId, levied: totalLevied },
        });
      }
    }

    // The age-scaled war_drain bump: the LONGER deployed, the deeper the home bleed —
    // even a winning war keeps draining the origin. Stacks on the front-count drain.
    const ageDrain = Math.min(AGE_DRAIN_CAP, deploymentAge * AGE_DRAIN_PER_TICK);
    const drainSeverity = clamp01(frontCount * WAR_DRAIN_PER_FRONT + ageDrain);

    // RATCHET the non-reverting exhaustion scar UP for every sustained
    // deployment (read-last/write-next: read the pre-tick ledger value, accrue, write
    // the next-tick value). Capped at 1. The condition emitted below carries the
    // ratcheted value, so it lands on the home and bites settlementStrength NEXT tick.
    const prevScar = clamp01(warExhaustion[fromId] || 0);
    const nextScar = clamp01(prevScar + EXHAUSTION_ACCRUE_PER_TICK);
    warExhaustion[fromId] = nextScar;

    outcomes.push(warConditionOutcome({
      id: `world_outcome.war_drain.${stablePart(fromId)}.${tick}`,
      archetype: 'war_drain',
      targetSaveId: fromId,
      severity: drainSeverity,
      headline: `${name}'s war chest bleeds`,
      summary: `Sustaining the campaign against ${targetName} drains the home economy.`,
      reasons: [`${frontCount} active war front${frontCount === 1 ? '' : 's'} from ${name}${ageDrain > 0 ? `, ${deploymentAge} ticks deployed` : ''}.`],
      tick,
      sourceEventTargetId: rec.targetId,
      causes: [{ source: fromId, effect: 'war_drain', reason: `${name} is besieging ${targetName}.` }],
      recordMode: recurringWarConditionRecordMode({ snapshot, archetype: 'war_drain', targetSaveId: fromId, severity: drainSeverity, sourceEventTargetId: rec.targetId }),
    }));

    outcomes.push(warConditionOutcome({
      id: `world_outcome.army_deployed.${stablePart(fromId)}.${tick}`,
      archetype: 'army_deployed',
      targetSaveId: fromId,
      severity: ARMY_DEPLOYED_SEVERITY,
      headline: `${name}'s garrison marches abroad`,
      summary: `${name}'s standing army is committed against ${targetName}, thinning the home garrison.`,
      reasons: [`Army deployed to besiege ${targetName}.`],
      tick,
      sourceEventTargetId: rec.targetId,
      causes: [{ source: fromId, effect: 'army_deployed', reason: `${name}'s army is away besieging ${targetName}.` }],
      recordMode: recurringWarConditionRecordMode({ snapshot, archetype: 'army_deployed', targetSaveId: fromId, severity: ARMY_DEPLOYED_SEVERITY, sourceEventTargetId: rec.targetId }),
    }));

    // ── REINFORCEMENT COST: the home pays for keeping the army in the field. Only
    // emitted when a flow actually went out (a depleted army being topped up); a full-
    // strength army imposes no cost (byte-light). Severity ∝ the flow + deploymentAge,
    // bites economic_capacity / public_legitimacy / defense_readiness. ───────────────
    if (flow.drainSeverity > REINFORCEMENT_COST_FLOOR && flow.flowPoints > 0) {
      outcomes.push(warConditionOutcome({
        id: `world_outcome.reinforcement_cost.${stablePart(fromId)}.${tick}`,
        archetype: 'reinforcement_cost',
        targetSaveId: fromId,
        severity: flow.drainSeverity,
        headline: `${name} bleeds to keep its army fed`,
        summary: `${name} keeps sending men, coin, and grain to the front against ${targetName}, and the home pays for every levy.`,
        reasons: flow.reasons,
        tick,
        sourceEventTargetId: rec.targetId,
        causes: [{ source: fromId, effect: 'reinforcement_cost', reason: `${name} is reinforcing its army besieging ${targetName} (${deploymentAge} ticks deployed).` }],
        recordMode: recurringWarConditionRecordMode({ snapshot, archetype: 'reinforcement_cost', targetSaveId: fromId, severity: flow.drainSeverity, sourceEventTargetId: rec.targetId }),
      }));
    }

    // Surface the scar as a war_exhaustion condition once it clears the floor.
    // This is THE homeostasis closer: it feeds economic_capacity (the sink) AND a
    // direct settlementStrength penalty, so a protracted siege eventually drops the
    // aggressor's confidence below HOSTILE_CONFIDENCE/CONQUEST_MARGIN — the realm can
    // no longer sustain or escalate the war and the loop converges toward peace.
    if (nextScar >= EXHAUSTION_CONDITION_FLOOR) {
      outcomes.push(warConditionOutcome({
        id: `world_outcome.war_exhaustion.${stablePart(fromId)}.${tick}`,
        archetype: 'war_exhaustion',
        targetSaveId: fromId,
        severity: nextScar,
        headline: `${name} grows war-weary`,
        summary: `The long campaign against ${targetName} has left ${name} a lasting wound. The treasury thins and the public tires of war.`,
        reasons: [`Sustained war-exhaustion scar at ${nextScar.toFixed(2)} (non-reverting).`],
        tick,
        // Keyed by the HOME (like the decay path below), NOT the war target:
        // deriveActiveCondition hashes the condition id from sourceEventTargetId, so a
        // target-keyed accrual and a home-keyed decay would mint TWO distinct
        // war_exhaustion conditions on the same settlement — the accrual one lingering
        // (double-stamping the penalty) for ticks after the war while the decay one
        // re-stamps. One key ⇒ one condition that accrues and then decays.
        sourceEventTargetId: fromId,
        causes: [{ source: fromId, effect: 'war_exhaustion', reason: `${name} has campaigned too long against ${targetName}.` }],
        recordMode: recurringWarConditionRecordMode({ snapshot, archetype: 'war_exhaustion', targetSaveId: fromId, severity: nextScar, sourceEventTargetId: fromId, incomingCauseEffect: 'war_exhaustion' }),
      }));
    }
  }

  // ── Step 5b: DECAY the scar for homes whose army is no longer deployed. The decay
  // is ~5× slower than the accrual (EXHAUSTION_DECAY_PER_TICK ≪ ACCRUE), so a long
  // war leaves a wound that lingers for many ticks after the peace — non-reverting by
  // construction, the opposite of a mean-reverting relationship. Codepoint-sorted;
  // entries that reach 0 are dropped so the ledger never accumulates dead keys. A
  // still-significant scar keeps stamping its war_exhaustion condition (the realm is
  // recovering but not yet whole — peace holds because the wound persists).
  for (const homeId of Object.keys(warExhaustion).sort(codepoint)) {
    if (activeDeployers.has(homeId)) continue;
    const previousScar = clamp01(warExhaustion[homeId] || 0);
    const decayed = clamp01(previousScar - EXHAUSTION_DECAY_PER_TICK);
    const clearance = warExhaustionClearanceOutcome({ homeId, name: settlementNameFor(homeId), previousScar, nextScar: decayed, floor: EXHAUSTION_CONDITION_FLOOR, tick });
    if (clearance && snapshot?.byId?.has?.(homeId)) outcomes.push(clearance);
    if (decayed <= 0) {
      delete warExhaustion[homeId];
      continue;
    }
    warExhaustion[homeId] = decayed;
    if (decayed >= EXHAUSTION_CONDITION_FLOOR && snapshot?.byId?.has?.(homeId)) {
      const name = settlementNameFor(homeId);
      // A vassal levied THIS tick is not recovering — its scar is the ACTIVE loyalty
      // cost of an overlord's war (accrued in step 5's levy block; empty set when the
      // flag is off). Same condition id/arithmetic; only the narrative differs, so the
      // vassal is no longer described as nursing wounds from a war it never waged.
      const leviedNow = leviedThisTick.has(homeId);
      outcomes.push(warConditionOutcome({
        id: `world_outcome.war_exhaustion.${stablePart(homeId)}.${tick}`,
        archetype: 'war_exhaustion',
        targetSaveId: homeId,
        severity: decayed,
        headline: leviedNow ? `${name} strains under the levy` : `${name} nurses its war wounds`,
        summary: leviedNow
          ? `${name}'s men and grain feed an overlord's war, and the repeated levies wear on the settlement.`
          : `${name}'s army is home, but the cost of the war it waged still weighs on the economy and the public.`,
        reasons: [leviedNow
          ? `War-levy strain accruing at ${decayed.toFixed(2)} (levied again this tick).`
          : `War-exhaustion scar slowly fading at ${decayed.toFixed(2)}.`],
        tick,
        sourceEventTargetId: homeId,
        causes: [{
          source: homeId,
          effect: leviedNow ? 'war_levy_exhaustion' : 'war_exhaustion',
          reason: leviedNow ? `${name} is drained by an overlord's war levies.` : `${name} is recovering from a costly war.`,
        }],
        // A pre-tick deployment absent from the post-resolution active set marks recovery onset.
        recordMode: recurringWarConditionRecordMode({ snapshot, archetype: 'war_exhaustion', targetSaveId: homeId, severity: decayed, sourceEventTargetId: homeId, forceChronicle: !leviedNow && Object.prototype.hasOwnProperty.call(existing, homeId), incomingCauseEffect: leviedNow ? 'war_levy_exhaustion' : 'war_exhaustion' }),
      }));
    }
  }

  return { outcomes, deployments, warExhaustion };
}
