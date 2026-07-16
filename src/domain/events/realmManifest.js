/**
 * domain/events/realmManifest.js — THE REALM AFFORDANCE MANIFEST (Composer V2
 * §6/§8 — the W-COMPOSER-2 lift). The trunk-layer twin of affordanceManifest.js:
 * every realm-scale verb this program parked in registrable shape, registered.
 *
 * THE LANE (design §6, "zero new apply paths"): a realm verb executes as a
 * DM-minted PROPOSAL — worldState.proposals, the same queue the sim's own
 * majors ride — approved through the EXISTING applier (resolveProposalToOutcome
 * → applyWorldPulseOutcomes), whose realm apply arms call each verb's OWN
 * kernel function (force ≡ organic). The mint/apply machinery lives in
 * worldPulse/realmVerbExecution.js (the engine chunk); THIS module is the
 * projection the composer renders: per verb — predicate (available/reasons/
 * unlocks over the CURRENT worldState), dial schemas (§3), target descriptors,
 * authority (the candidateType the verb routes under), and veto prose.
 *
 * THE SAME-FUNCTION LAW: predicates wrap the sim's own wave gates
 * (peaceCausalActive, supplyWebWarfareActive, navalActive, interventionActive,
 * momentumActive, settlementLifecycleActive, calamityEnabled) — never
 * re-implementations. Unavailability TEACHES: a dark gate names its flags.
 *
 * FIRST-PAINT LAW: this module is a LAZY LEAF — it imports the worldPulse
 * engine tree, so it must NEVER be imported from the store, the event
 * pipeline, or any eager module (only lazy realm surfaces + tests). It is
 * deliberately SEPARATE from affordanceManifest.js so the settlement-composer
 * chunk stays free of the engine tree. Sentinel for the dist guard:
 * REALM_MANIFEST_LAZY_SENTINEL. @enforced-by tests/build/vendorPdfLazy.test.js.
 */

import { peaceCausalActive, WAR_REASON_TYPES, CASUS_VETO_PROSE } from '../worldPulse/warReasons.js';
import { PEACE_VETO_PROSE } from '../worldPulse/peaceReasons.js';
import { supplyWebWarfareActive, WEBWAR_VETO_PROSE } from '../worldPulse/supplyWebWarfare.js';
import {
  interventionActive, liveCoupContests, INTERVENTION_SIDES,
  orderInterventionVerbFactory, reinforceVerbFactory, interceptVerbFactory,
} from '../worldPulse/convergence.js';
import { navalActive, navalPortsOf, orderConvoyVerbFactory, declareBlockadeVerbFactory } from '../worldPulse/navalKernel.js';
import { momentumActive, commitmentCoursesOf, forceReconsiderationVerbFactory } from '../worldPulse/momentum.js';
import { forceCalamityEntry } from '../worldPulse/calamityKernel.js';
import { calamityEnabled } from '../spatial/calamity.js';
import { settlementLifecycleActive, forceFoundSteadingEntry } from '../worldPulse/settlementLifecycleKernel.js';
import { forceAbandonEntry, forceResettleEntry } from '../worldPulse/settlementLifecycleFirstClass.js';
import { activeSpatialDigest } from '../spatial/distanceRead.js';

/** The schema-owned loose record alias (the affordanceManifest Mut idiom —
 * the looseness is declared and any-census-counted where it is OWNED,
 * settlement.schema.js; this projection layer reads world/context bags
 * through it exactly as the applier layer it mirrors does).
 * @typedef {NonNullable<import('../settlement.schema.js').SimSettlement['config']>} Mut
 */
/** The realm-context bag the realm composer passes every predicate /
 * targetOptions call: `{ settlements: Array<{ id, name, settlement }>, tick }`.
 * @typedef {Mut} RealmCtx
 */

export const REALM_MANIFEST_LAZY_SENTINEL = 'REALM_MANIFEST_LAZY_SENTINEL';

// ── Predicate shorthand (the feasibilityGate shape — verdict + WHY + unlocks) ─
const ok = () => ({ available: true, reasons: [], unlocks: [] });
/** @param {string[]} reasons @param {string[]} [unlocks] */
const no = (reasons, unlocks = []) => ({ available: false, reasons, unlocks });
/** @param {boolean} cond @param {string} reason @param {string} [unlock] */
const gate = (cond, reason, unlock) => (cond ? ok() : no([reason], unlock ? [unlock] : []));

// The wave-gate refusals (each names the exact flags that light it — teaching).
const darkWar = () => no(
  ['The causal reasons layer is not active in this campaign.'],
  ['Light warLayerEnabled + peaceEngineEnabled in the simulation rules.'],
);
const darkWebwar = () => no(
  ['Supply-web warfare is not active in this campaign.'],
  ['Light warLayerEnabled + supplyWebWarfareEnabled in the simulation rules.'],
);
const darkNaval = () => no(
  ['The naval layer is not active (it needs a spatially-canonized realm).'],
  ['Canonize the realm map, then light navalEnabled in the simulation rules.'],
);
const darkIntervention = () => no(
  ['The intervention layer is not active in this campaign.'],
  ['Light warLayerEnabled + interventionEnabled in the simulation rules.'],
);
const darkMomentum = () => no(
  ['The momentum layer is not active in this campaign.'],
  ['Light momentumEnabled in the simulation rules.'],
);
const darkLifecycle = () => no(
  ['The settlement lifecycle layer is not active in this campaign.'],
  ['Light settlementLifecycleEnabled in the simulation rules.'],
);
const darkCalamity = () => no(
  ['The calamity layer is not active in this campaign.'],
  ['Light calamityEnabled in the simulation rules.'],
);

// ── Shared target readers (each wraps ONE sim read — never re-derives) ───────
/** Campaign members as {id, name} options. @param {RealmCtx} ctx */
export function campaignSettlementOptions(ctx) {
  const out = [];
  const seen = new Set();
  for (const item of ctx?.settlements || []) {
    const id = String(item?.id ?? '');
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({ id, name: String(item?.name || item?.settlement?.name || id) });
  }
  return out;
}
const nameFor = (/** @type {RealmCtx} */ ctx, /** @type {string} */ id) =>
  campaignSettlementOptions(ctx).find(o => o.id === String(id))?.name || String(id);

/** Owners of live, un-recalled deployments — the exact set sueForPeaceOrder can
 * act on (wraps worldState.deployments, the same read the verb runs).
 * @param {Mut} worldState @param {RealmCtx} ctx */
export function belligerentOptions(worldState, ctx) {
  const deployments = worldState?.deployments && typeof worldState.deployments === 'object'
    ? worldState.deployments : {};
  return Object.keys(deployments).sort()
    .filter(id => deployments[id] && deployments[id].targetId != null && !deployments[id].recalled)
    .map(id => ({ id, name: nameFor(ctx, id) }));
}

/** The contested settlements of live coup contests — ORDER_INTERVENTION's legal
 * targets (wraps convergence.liveCoupContests, the mover's own contest read).
 * @param {Mut} worldState @param {RealmCtx} ctx */
export function coupContestOptions(worldState, ctx) {
  const byId = new Map((ctx?.settlements || []).map((/** @type {Mut} */ i) => [String(i.id), i]));
  return liveCoupContests(worldState, { byId }).map(c => ({ id: c.targetId, name: nameFor(ctx, c.targetId) }));
}

/** Sea-lane ports — the naval verbs' legal endpoints (wraps navalPortsOf over
 * the same digest read the kernel runs). @param {Mut} worldState @param {RealmCtx} ctx */
export function portOptions(worldState, ctx) {
  const digest = activeSpatialDigest(worldState);
  return navalPortsOf(digest || {}).map(id => ({ id, name: nameFor(ctx, id) }));
}

/** Live committed courses per actor — FORCE_RECONSIDERATION's course dial
 * (wraps the momentum commitments ledger read). @param {Mut} worldState @param {number} [tick] */
export function courseOptions(worldState, tick = 0) {
  return commitmentCoursesOf(worldState, Number.isFinite(tick) ? tick : Number(worldState?.tick) || 0);
}

/** The composite target-dial separator for FORCE_RECONSIDERATION: a live course is
 * an (actorId, courseKey) PAIR, so the single target dial stages both as one value
 * (`actorId␟courseKey`). ␟ (unit separator) never appears in a settlement
 * id or a courseKey, so the split is unambiguous. composer-realm-verbs-1. */
export const COURSE_TARGET_SEP = '␟';

/** Split a composite course-target back into { targetId, courseKey } (the inverse
 * of the targetOptions composite). Non-composite input passes through unchanged
 * (courseKey stays whatever the caller supplied). @param {Mut} args */
export function splitCourseTarget(args) {
  const raw = String(args?.targetId ?? '');
  const i = raw.indexOf(COURSE_TARGET_SEP);
  if (i < 0) return args;
  return { ...args, targetId: raw.slice(0, i), courseKey: raw.slice(i + COURSE_TARGET_SEP.length) };
}

/** Remnant / living splits for the lifecycle verbs. @param {RealmCtx} ctx @param {boolean} wantRemnant */
function lifecycleTargets(ctx, wantRemnant) {
  return (ctx?.settlements || [])
    .filter((/** @type {Mut} */ i) => {
      const s = i?.settlement || {};
      const isRemnant = !!(s.lifecycleStatus || s.config?.lifecycleStatus);
      return wantRemnant ? isRemnant : !isRemnant;
    })
    .map((/** @type {Mut} */ i) => ({ id: String(i.id), name: String(i.name || i.settlement?.name || i.id) }));
}

// ── Dial shorthand (the §3 schema — same shape as the settlement manifest) ───
/** @param {string} key @param {string[]} options @param {string} def @param {string} label */
const enumDial = (key, options, def, label) => ({ key, kind: 'enum', options, default: def, clampAtCommit: true, label });
/** @param {string} key @param {string} label */
const settlementTargetDial = (key, label) => ({ key, kind: 'target', targetsFrom: 'campaignSettlements', clampAtCommit: true, label });
/** @param {string} key @param {string} label @param {Record<string, number>} words @param {string} def */
const bandDial = (key, label, words, def) => ({ key, kind: 'band', bandWords: words, default: def, min: 0, max: 1, clampAtCommit: true, label });
// (text dials arrive verbatim from the parked entry factories — no local helper.)

/** Severity words for the casus/pressure bands (the house table words). */
export const REALM_SEVERITY_VALUES = Object.freeze({ minor: 0.35, moderate: 0.6, severe: 0.85 });

// ── The manifest ──────────────────────────────────────────────────────────────
// Entry shape (the settlement manifest's, realm-scoped): { verb, label, family,
// scope:'realm', authority (the candidateType authorityFor routes — every entry
// here reaches apply AS a proposal, so the authority column IS the queue),
// candidateType, module, lane ('proposal' | 'deferred'), dials ≤4,
// targetsFrom/targetOptions, predicate(worldState, ctx), coversVetoCodes.
// The parked entry/verb factories are consumed VERBATIM (the owner-reviewed
// shapes) and extended with the live-path fields.

const calamityParked = forceCalamityEntry();
const steadingParked = forceFoundSteadingEntry();
const abandonParked = forceAbandonEntry();
const resettleParked = forceResettleEntry();
const interventionParked = orderInterventionVerbFactory();
const reinforceParked = reinforceVerbFactory();
const interceptParked = interceptVerbFactory();
const convoyParked = orderConvoyVerbFactory();
const blockadeParked = declareBlockadeVerbFactory();
const reconsiderationParked = forceReconsiderationVerbFactory();

export const REALM_MANIFEST = Object.freeze({
  // ── The causal-reasons pair (W-PEACE-1) ────────────────────────────────
  DECLARE_CASUS: Object.freeze({
    verb: 'DECLARE_CASUS', label: 'Declare a reason for war', family: 'War',
    scope: 'realm', lane: 'proposal', module: 'warReasons.js',
    candidateType: 'casus_declared', authority: 'casus_declared',
    dials: [
      settlementTargetDial('fromId', 'The aggrieved court'),
      settlementTargetDial('toId', 'Against'),
      enumDial('type', [...WAR_REASON_TYPES], WAR_REASON_TYPES[0], 'The typed grievance'),
      bandDial('severity01', 'Severity', REALM_SEVERITY_VALUES, 'moderate'),
    ],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => campaignSettlementOptions(ctx),
    coversVetoCodes: Object.keys(CASUS_VETO_PROSE),
    predicate: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) =>
      !peaceCausalActive(ws) ? darkWar()
        : gate(campaignSettlementOptions(ctx).length >= 2,
          'A grievance needs two courts — the campaign has fewer.', 'Canonize a second settlement.'),
  }),
  SUE_FOR_PEACE: Object.freeze({
    verb: 'SUE_FOR_PEACE', label: 'Sue for peace', family: 'War',
    scope: 'realm', lane: 'proposal', module: 'peaceReasons.js',
    candidateType: 'peace_sued', authority: 'peace_sued',
    dials: [settlementTargetDial('partyId', 'The court that seeks peace')],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => belligerentOptions(ws, ctx),
    coversVetoCodes: Object.keys(PEACE_VETO_PROSE),
    predicate: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) =>
      !peaceCausalActive(ws) ? darkWar()
        : gate(belligerentOptions(ws, ctx).length > 0,
          'No court has an army in the field — there is no war to wind down.'),
  }),

  // ── The supply-web doctrine pair (W-DOCTRINE-1) ────────────────────────
  ORDER_SUPPLY_RAID: Object.freeze({
    verb: 'ORDER_SUPPLY_RAID', label: 'Order a supply-web campaign', family: 'War',
    scope: 'realm', lane: 'proposal', module: 'supplyWebWarfare.js',
    candidateType: 'supply_raid_ordered', authority: 'supply_raid_ordered',
    dials: [
      settlementTargetDial('aggressorId', 'The raiding court'),
      settlementTargetDial('targetId', 'The strangled target'),
    ],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => campaignSettlementOptions(ctx),
    coversVetoCodes: Object.keys(WEBWAR_VETO_PROSE),
    predicate: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) =>
      !supplyWebWarfareActive(ws) ? darkWebwar()
        : gate(campaignSettlementOptions(ctx).length >= 2,
          'An indirect campaign needs two courts — the campaign has fewer.', 'Canonize a second settlement.'),
  }),
  DECLARE_TRADE_EMBARGO: Object.freeze({
    verb: 'DECLARE_TRADE_EMBARGO', label: 'Declare a trade embargo', family: 'War',
    scope: 'realm', lane: 'proposal', module: 'supplyWebWarfare.js',
    candidateType: 'trade_embargo_declared', authority: 'trade_embargo_declared',
    dials: [
      settlementTargetDial('aggressorId', 'The embargoing court'),
      settlementTargetDial('targetId', 'The embargoed target'),
    ],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => campaignSettlementOptions(ctx),
    coversVetoCodes: Object.keys(WEBWAR_VETO_PROSE),
    predicate: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) =>
      !supplyWebWarfareActive(ws) ? darkWebwar()
        : gate(campaignSettlementOptions(ctx).length >= 2,
          'An embargo needs two courts — the campaign has fewer.', 'Canonize a second settlement.'),
  }),

  // ── The convergence verbs (W-CONVERGENCE) ──────────────────────────────
  ORDER_INTERVENTION: Object.freeze({
    ...interventionParked,
    label: 'Order an intervention', family: 'War', lane: 'proposal',
    module: 'convergence.js', authority: String(interventionParked.candidateType),
    dials: [
      settlementTargetDial('patronId', 'The intervening court'),
      settlementTargetDial('targetId', 'The contested settlement'),
      enumDial('side', [INTERVENTION_SIDES.INCUMBENT, INTERVENTION_SIDES.CHALLENGER], INTERVENTION_SIDES.INCUMBENT, 'The backed side'),
    ],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => coupContestOptions(ws, ctx),
    coversVetoCodes: ['intervention_gate_dark', 'intervention_no_contest', 'intervention_busy', 'intervention_already'],
    predicate: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) =>
      !interventionActive(ws) ? darkIntervention()
        : gate(coupContestOptions(ws, ctx).length > 0,
          'No coup contest is live anywhere in the realm.', 'An intervention needs a brewing coup to join.'),
  }),
  REINFORCE: Object.freeze({
    ...reinforceParked,
    label: 'Reinforce a treaty-ally', family: 'War', lane: 'deferred',
    module: 'convergence.js', authority: String(reinforceParked.candidateType),
    dials: [settlementTargetDial('allyId', 'The ally under siege')],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => campaignSettlementOptions(ctx),
    coversVetoCodes: ['reinforce_deferred'],
    // HONEST DEFERRAL (force ≡ organic): the reactive column-COMMITMENT seam is
    // itself a documented W-CONVERGENCE deferral ("intervention columns ride the
    // isolated ledger... nothing to intercept spatially in wave 1") — the organic
    // twin this verb must resolve through does not exist yet. Registered,
    // grayed-with-reason (LAW: grayed beats absent); execution lands with the
    // convergence column seam.
    predicate: () => no(
      ['The relief-column commitment seam is not built yet — the reactive art of war ships its scorers; the column seam is a documented W-CONVERGENCE deferral.'],
      ['Lands with the convergence spatial-column seam.'],
    ),
  }),
  INTERCEPT: Object.freeze({
    ...interceptParked,
    label: 'Intercept a believed column', family: 'War', lane: 'deferred',
    module: 'convergence.js', authority: String(interceptParked.candidateType),
    dials: [settlementTargetDial('believedColumn', 'The believed column\'s owner')],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => campaignSettlementOptions(ctx),
    coversVetoCodes: ['intercept_deferred'],
    // Same honest deferral as REINFORCE (the shared spatial-column seam).
    predicate: () => no(
      ['The intercept-column commitment seam is not built yet — a documented W-CONVERGENCE deferral (nothing to intercept spatially in wave 1).'],
      ['Lands with the convergence spatial-column seam.'],
    ),
  }),

  // ── The naval verbs (W-NAVY) ───────────────────────────────────────────
  ORDER_CONVOY: Object.freeze({
    ...convoyParked,
    label: 'Order a convoy', family: 'War', lane: 'proposal',
    module: 'navalKernel.js', authority: String(convoyParked.candidateType),
    dials: [
      settlementTargetDial('ownerId', 'The escorting port'),
      settlementTargetDial('destId', 'The destination port'),
    ],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => portOptions(ws, ctx),
    coversVetoCodes: ['convoy_gate_dark', 'convoy_not_ports', 'convoy_no_deployment', 'convoy_refused'],
    predicate: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) =>
      !navalActive(ws) ? darkNaval()
        : gate(portOptions(ws, ctx).length >= 2,
          'Fewer than two sea-lane ports exist.', 'A convoy needs a port-to-port sea leg.'),
  }),
  DECLARE_BLOCKADE: Object.freeze({
    ...blockadeParked,
    label: 'Declare a blockade', family: 'War', lane: 'proposal',
    module: 'navalKernel.js', authority: String(blockadeParked.candidateType),
    dials: [
      settlementTargetDial('ownerId', 'The blockading port'),
      settlementTargetDial('targetId', 'The blockaded port'),
    ],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => portOptions(ws, ctx),
    coversVetoCodes: ['blockade_gate_dark', 'blockade_not_ports', 'blockade_no_navy', 'blockade_refused', 'blockade_already'],
    predicate: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) =>
      !navalActive(ws) ? darkNaval()
        : gate(portOptions(ws, ctx).length >= 2,
          'Fewer than two sea-lane ports exist.', 'A blockade needs a hostile port reachable by sea.'),
  }),

  // ── The momentum verb (W-MOMENTUM) ─────────────────────────────────────
  FORCE_RECONSIDERATION: Object.freeze({
    ...reconsiderationParked,
    label: 'Force a reconsideration', family: 'War', lane: 'proposal',
    module: 'momentum.js', authority: String(reconsiderationParked.candidateType),
    // composer-realm-verbs-1: the target dial stages a LIVE (actorId, courseKey)
    // course as one composite value; stageArgs splits it back into the { targetId,
    // courseKey } the momentum apply arm reads — no dead '__live__' placeholder that
    // refused at apply. The pressure band is the only free dial.
    dials: [
      settlementTargetDial('targetId', 'The committed course'),
      bandDial('pressure01', 'Pressure', REALM_SEVERITY_VALUES, 'moderate'),
    ],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) =>
      courseOptions(ws, Number(ws?.tick ?? ctx?.tick) || 0)
        .map((/** @type {Mut} */ c) => ({ id: `${c.actorId}${COURSE_TARGET_SEP}${c.courseKey}`, name: `${nameFor(ctx, c.actorId)} — ${c.courseKey}` })),
    stageArgs: splitCourseTarget,
    coversVetoCodes: ['reconsideration_gate_dark', 'reconsideration_no_course'],
    predicate: (/** @type {Mut} */ ws) =>
      !momentumActive(ws) ? darkMomentum()
        : gate(courseOptions(ws, Number(ws?.tick) || 0).length > 0,
          'No court holds a committed course to press.', 'Commitment stock accrues as courses persist.'),
  }),

  // ── The calamity verb (M11b) — parked entry consumed verbatim ──────────
  FORCE_CALAMITY: Object.freeze({
    ...calamityParked,
    verb: 'FORCE_CALAMITY', label: 'Force a calamity', lane: 'proposal',
    module: 'calamityKernel.js', candidateType: 'calamity_forced', authority: 'calamity_forced',
    dials: [settlementTargetDial('targetId', 'The stricken settlement'), ...(/** @type {Mut[]} */ (calamityParked.dials))],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => campaignSettlementOptions(ctx),
    coversVetoCodes: ['calamity_gate_dark'],
    predicate: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) =>
      !calamityEnabled(ws?.simulationRules) ? darkCalamity()
        : /** @type {{ available: boolean, reasons: string[], unlocks: string[] }} */ (
          /** @type {Mut} */ (calamityParked).predicate(ws, ctx)),
  }),

  // ── The lifecycle verbs (W-LIFECYCLE) — parked entries consumed verbatim ─
  FORCE_FOUND_STEADING: Object.freeze({
    ...steadingParked,
    verb: 'FORCE_FOUND_STEADING', label: 'Found a steading', lane: 'proposal',
    module: 'settlementLifecycleKernel.js', candidateType: 'steading_forced', authority: 'steading_forced',
    dials: [settlementTargetDial('parentId', 'The founding parent'), ...(/** @type {Mut[]} */ (steadingParked.dials))],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => lifecycleTargets(ctx, false),
    coversVetoCodes: ['lifecycle_gate_dark', 'steading_refused'],
    predicate: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) =>
      !settlementLifecycleActive(ws) ? darkLifecycle()
        : gate(lifecycleTargets(ctx, false).length > 0, 'No living settlement can found a steading.'),
  }),
  FORCE_ABANDON: Object.freeze({
    ...abandonParked,
    verb: 'FORCE_ABANDON', label: 'Force an abandonment', lane: 'proposal',
    module: 'settlementLifecycleFirstClass.js', candidateType: 'settlement_terminal_death', authority: 'settlement_terminal_death',
    dials: [settlementTargetDial('targetId', 'The dying thorp')],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => lifecycleTargets(ctx, false),
    coversVetoCodes: ['lifecycle_gate_dark', 'abandon_refused'],
    predicate: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) =>
      !settlementLifecycleActive(ws) ? darkLifecycle()
        : gate(lifecycleTargets(ctx, false).length > 0,
          'No living settlement to abandon.', 'Only a thorp-tier settlement can die — demote it first.'),
  }),
  FORCE_RESETTLE: Object.freeze({
    ...resettleParked,
    verb: 'FORCE_RESETTLE', label: 'Force a resettlement', lane: 'proposal',
    module: 'settlementLifecycleFirstClass.js', candidateType: 'settlement_resettled', authority: 'settlement_resettled',
    dials: [settlementTargetDial('targetId', 'The remnant site'), ...(/** @type {Mut[]} */ (resettleParked.dials))],
    targetsFrom: 'campaignSettlements',
    targetOptions: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) => lifecycleTargets(ctx, true),
    coversVetoCodes: ['lifecycle_gate_dark', 'resettle_refused'],
    predicate: (/** @type {Mut} */ ws, /** @type {RealmCtx} */ ctx) =>
      !settlementLifecycleActive(ws) ? darkLifecycle()
        : gate(lifecycleTargets(ctx, true).length > 0,
          'No remnant site to resettle.', 'Only an abandoned site can live again.'),
  }),
});

// ── Veto prose (the refusal TEACHES — the module feeds, merged) ──────────────
/** @type {Record<string, (d: string) => string>} */
const REALM_VETO_PROSE_LOCAL = {
  intervention_gate_dark: () => 'The intervention layer is not active in this campaign (warLayerEnabled + interventionEnabled).',
  intervention_no_contest: d => `No coup contest is live at ${d || 'that settlement'} — an intervention needs a brewing coup to join.`,
  intervention_busy: d => `${d || 'That court'} already has an army committed elsewhere (the one-army law).`,
  intervention_already: d => `${d || 'That court'} is already intervening in this contest.`,
  reinforce_deferred: () => 'The relief-column commitment seam is a documented W-CONVERGENCE deferral — this verb is registered but not yet executable.',
  intercept_deferred: () => 'The intercept-column commitment seam is a documented W-CONVERGENCE deferral — this verb is registered but not yet executable.',
  convoy_gate_dark: () => 'The naval layer is not active (spatial canon + navalEnabled).',
  convoy_not_ports: d => `${d || 'Those settlements'} are not both sea-lane ports.`,
  convoy_no_deployment: d => `${d || 'That port'} has no deployed army to escort.`,
  convoy_refused: d => d || 'The sea leg refused the convoy (no route, no navy, or no capacity).',
  blockade_gate_dark: () => 'The naval layer is not active (spatial canon + navalEnabled).',
  blockade_not_ports: d => `${d || 'Those settlements'} are not both sea-lane ports.`,
  blockade_no_navy: d => `${d || 'That port'} has no war navy to blockade with.`,
  blockade_refused: d => d || 'The sea leg refused the blockade (no reachable route).',
  blockade_already: d => `${d || 'That navy'} already blockades that port.`,
  reconsideration_gate_dark: () => 'The momentum layer is not active in this campaign (momentumEnabled).',
  reconsideration_no_course: d => `${d || 'That court'} holds no committed course to press.`,
  calamity_gate_dark: () => 'The calamity layer is not active in this campaign (calamityEnabled).',
  lifecycle_gate_dark: () => 'The settlement lifecycle layer is not active in this campaign (settlementLifecycleEnabled).',
  steading_refused: d => d || 'The founding was refused (the tier cap and headroom walls hold, even under force).',
  abandon_refused: d => d || 'The abandonment was refused (only a thorp-tier, living settlement can die).',
  resettle_refused: d => d || 'The resettlement was refused (no remnant here, or no neighbour can spare willing settlers).',
};

/** The DM-facing refusal sentence for a realm veto code. Wraps the wave
 * modules' own prose feeds (CASUS/PEACE/WEBWAR — the same-function law for
 * words) and this module's codes for the factory verbs.
 * @param {string|null|undefined} code @param {string} [detail] @returns {string}
 */
export function realmVetoProse(code, detail = '') {
  const c = String(code || '');
  const fromModules = /** @type {Record<string, string>} */ ({ ...CASUS_VETO_PROSE, ...PEACE_VETO_PROSE, ...WEBWAR_VETO_PROSE });
  if (fromModules[c]) return fromModules[c];
  const f = REALM_VETO_PROSE_LOCAL[c];
  return f ? f(String(detail || '')) : `The order was refused (${c}${detail ? `: ${detail}` : ''}).`;
}

/** Every realm verb, in stable manifest order. */
export function realmVerbs() {
  return Object.values(REALM_MANIFEST);
}

/** The manifest entry for a verb name (null for unknown). @param {string} verb */
export function realmVerbFor(verb) {
  return /** @type {Mut} */ (REALM_MANIFEST)[String(verb || '')] || null;
}

/** The realm verbs whose execution lane is LIVE (lane 'proposal'). */
export function executableRealmVerbs() {
  return realmVerbs().filter(v => v.lane === 'proposal');
}
