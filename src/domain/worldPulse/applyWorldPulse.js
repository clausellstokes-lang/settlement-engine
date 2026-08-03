import { clamp01 } from '../../kernel/math.js';
import { withActiveCondition } from '../activeConditions.js';
import {
  advanceRegionalImpacts,
  appendWizardNewsEntries,
  deriveWizardNewsEntriesFromGraphChange,
  ensureRegionalGraph,
  ensureWizardNewsFeed,
  legacyRegionalConditionId,
  propagateRegionalEvent,
  setRegionalImpactStatus,
  stablePart,
  syncRelationshipChannelBundle,
} from '../region/index.js';
import { deityIdOf } from './pantheon.js';
import { queueRegionalImpacts, addRegionalChannels, mintDirectedChannel } from '../region/graph.js';
import { activeSpatialDigest, getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { parkArrivals, drainDueArrivals } from '../spatial/spatialArrival.js';
import { storageCapacityMonths } from './foodStockpile.js';
import { applyRelationshipPatch, relationshipKeyFromEdge, relationshipRoles } from './relationshipEvolution.js';
// JOIN 1 — THE RESOLVED MARCH: the chooser→opener order seam (see the two arms in the
// auto-apply loop). Same lazy pulse chunk as every import above ⇒ zero new eager bytes.
import { applyWarIntentOutcome, stampDeploymentRecall } from './warIntent.js';
import { ensureRelationshipEdgeSeed } from './relationshipEdgeSeed.js';
import { refreshRelationshipMemory } from './relationshipMemory.js';
import { resolveRelationshipHierarchy } from './relationshipHierarchy.js';
import { applyNpcPatch, npcId } from './npcAgency.js';
import { windDownSponsoredStressors } from './stressorDynamics.js';
import { npcCorruptibleFlaw, corruptionVectorForFlaw } from '../corruption.js';
import { applyFactionPatch, INSTITUTION_SUPPRESSION_SEVERITY } from './factionCompetition.js';
import { proposalIdFor, updateProposalStatus, upsertProposal } from './worldState.js';
import { applyPopulationOutcomeToSettlement } from './populationDynamics.js';
import { applyResourceOutcomeToSettlement, applyTierOutcomeToSettlement } from './tierResourceDynamics.js';
import { applyResourceMembershipOutcomeToSettlement } from './resourceDynamicsKernel.js';
import { applySettlementLifecycleOutcomeToSettlement } from './settlementLifecycleFirstClass.js';
import { applyInstitutionLifecycleOutcome } from './institutionLifecycle.js';
import { normalizeSimulationRules, propagationDepthForRules } from './simulationRules.js';
import { resolveProposalToOutcome } from './decisionTier.js';
import { applyRealmVerbOrder, buildRealmVerbOutcome, REALM_VERB_PAYLOAD_KIND } from './realmVerbExecution.js';
import { pendingActorMajorFor } from './actorMajorApproval.js';
import { recordProposalProvenance } from './provenanceKernel.js';
import {
  isStateOnlyOutcome,
  isSuppressionOnlyOutcome,
  proposalRequiresRecordModeSupersession,
  RECORD_MODE_PROPOSAL_VERSION,
} from './pulseHelpers.js';
import { wallClockNow } from '../clock.js';
import {
  isDriftOnlyOutcome,
  isMetronomeRepeat,
  newsEntryForOutcome,
  reconcileSupersededProposalNews,
  stateOnlyRumorSeedsFromHistory,
} from './worldPulseFeedCuration.js';
import {
  authorityTransferEpochFor,
  governingFactionOf,
  nameOf,
  transferRulingPower,
} from '../rulingPower.js';
import { withImpairment } from '../entities/status.js';
import { rolesForCanonicalEdge } from '../relationships/canonicalRelationship.js';
import { deepClone } from '../clone.js';
import { isBilateralPeaceOffer, readWarPeaceDecision } from './warPeaceDecision.js';
import { applyWarPeaceRefusal } from './warPeaceRefusal.js';
import { applyWarDecisionPolitics, warDemandForInstaller } from './warPoliticalLoop.js';
import { appendNpcLadderSeatTransition } from './npcLadderKernel.js';
import { buildWorldSnapshot } from './worldSnapshot.js';
import { rulingSeatNidOf } from './gratitudeBonds.js';
import { warRulingNewsEntries } from './warRulingsNews.js';
import {
  governmentTransitionRulingEvidence,
  peaceDecisionRulingEvidence,
} from './warRulingsEvidence.js';

function clone(/** @type {any} */ value) {
  return value == null ? value : deepClone(value);
}

/** One approved/refused bilateral offer is one immutable relationship fact. */
function relationshipOutcomeDisposition(worldState, outcome) {
  const key = String(outcome?.relationshipKey || outcome?.proposalPayload?.relationshipKey || '');
  const id = String(outcome?.id || '');
  if (!key || !id) return null;
  const record = worldState?.relationshipStates?.[key];
  if (String(record?.peaceDecisionOutcomeId || '') === id) return 'same';
  const candidateTick = Number(outcome?.generatedAtTick ?? outcome?.tick ?? worldState?.tick);
  if (Number.isFinite(candidateTick)
    && Number.isFinite(record?.peaceDecisionTick)
    && Number(record.peaceDecisionTick) >= Math.floor(candidateTick)) return 'superseded';
  const incidents = Array.isArray(record?.recentIncidents) ? record.recentIncidents : [];
  const history = Array.isArray(record?.history) ? record.history : [];
  return [...incidents, ...history].some((row) => String(row?.outcomeId || '') === id)
    ? 'same'
    : null;
}


// Shared loose sim-shape typedefs for the war-2/war-3/war-4 apply arms below. Zero
// any-holes here: the deliberate looseness lives inside the referenced typedefs'
// own modules (pulseShapes.js / settlement.schema.js), the house convention.
/** @typedef {import('./pulseShapes.js').WorldState} PulseWorldState */
/** @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome */
/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {import('../settlement.schema.js').SimFaction} SimFaction */
/** @typedef {import('../settlement.schema.js').SimInstitution} SimInstitution */

// (stampDeploymentRecall moved to warIntent.js — the strategy chooser's decisions,
// deposited as the war-ledger state the ONE opener consumes, are one family and now
// live in one module. Its three call sites below are unchanged.)

// war-2 — APPROVED FACTION PROPOSALS APPLY FOR REAL. The four DM-facing faction
// payload kinds whose apply arms below move real settlement state (the government
// read-path, the named institution, the roster power scalars) instead of the old
// factionState-ledger cosmetics. Only these payload-carrying (severity-gated, DM-
// facing) proposals reach the effect; a faction-free / low-severity world never
// generates one ⇒ byte-identical.
const FACTION_PAYLOAD_KINDS = new Set([
  'government_change', 'institution_capture', 'institution_suppression', 'faction_power_shift',
]);
// Bounded roster effects (RELATIVE power weights, matching transferRulingPower's +6
// coup bump — no renormalization). Named + retunable.
const FACTION_CAPTURE_POWER_GAIN = 5;      // institutional control → bounded roster influence
const FACTION_POWER_SHIFT_AMOUNT = 8;      // a contested transfer between two seats

/** @param {SimFaction|SimInstitution|null|undefined} x */
const entityName = (x) => String(x?.faction || x?.name || x?.label || '').trim().toLowerCase();
/** @param {Array<SimFaction|SimInstitution>|null|undefined} list @param {string} name */
function entityByName(list, name) {
  const n = String(name || '').trim().toLowerCase();
  if (!n || !Array.isArray(list)) return null;
  return list.find((e) => entityName(e) === n) || null;
}

/** Coerce a roster power weight to a finite number (0 for absent/garbage).
 *  @param {unknown} v @returns {number} */
const rosterNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Bounded roster power gain for a single faction (institution_capture). No-op if the
 *  faction is not on the roster. @param {SimSettlement} settlement @param {string} name @param {number} amount */
function bumpRosterFactionPower(settlement, name, amount) {
  const ps = settlement?.powerStructure;
  const factions = ps && Array.isArray(ps.factions) ? ps.factions : [];
  const fac = entityByName(factions, name);
  if (!ps || !fac) return settlement;
  return {
    ...settlement,
    powerStructure: {
      ...ps,
      factions: factions.map((f) => (f === fac ? { ...f, power: Math.round(rosterNum(f.power) + amount) } : f)),
    },
  };
}

/** Bounded roster power TRANSFER from `loseName` to `gainName` (faction_power_shift):
 *  the contest can be lost as well as won (the two-way path). No-op if either seat is
 *  absent. @param {SimSettlement} settlement @param {string} gainName @param {string} loseName @param {number} amount */
function shiftRosterFactionPower(settlement, gainName, loseName, amount) {
  const ps = settlement?.powerStructure;
  const factions = ps && Array.isArray(ps.factions) ? ps.factions : [];
  const gain = entityByName(factions, gainName);
  const lose = entityByName(factions, loseName);
  if (!ps || !gain || !lose || gain === lose) return settlement;
  const moved = Math.min(amount, Math.max(0, rosterNum(lose.power)));
  if (moved <= 0) return settlement;
  return {
    ...settlement,
    powerStructure: {
      ...ps,
      factions: factions.map((f) => {
        if (f === gain) return { ...f, power: Math.round(rosterNum(f.power) + moved) };
        if (f === lose) return { ...f, power: Math.round(rosterNum(f.power) - moved) };
        return f;
      }),
    },
  };
}

/**
 * Apply the real settlement effect of an approved faction payload (war-2). Additive on
 * top of applyFactionPatch (the factionState-ledger accretion is unchanged). Returns
 * the same settlement reference when nothing matches (byte-identical no-op).
 * @param {SimSettlement} settlement @param {PulseOutcome} outcome @param {PulseWorldState} state @param {{ now?: string|null, tick?: number|null }} ctx
 */
function applyFactionPayloadEffect(settlement, outcome, state, { now, tick }) {
  const pay = outcome.proposalPayload;
  if (!settlement || !pay) return settlement;
  const factionName = outcome.metadata?.factionName;
  switch (pay.kind) {
    case 'government_change': {
      // The challenging faction takes the seat — the government read-path
      // (powerStructure.government + governing faction) actually changes, as a coup
      // does. cause 'appointment': a DM-sanctioned political installation, not a
      // violent seizure. Institutions are preserved (transferRulingPower never touches
      // them). No-op when the faction is absent / already governs.
      if (!factionName) return settlement;
      // FORCED SEAM: SimSettlement's loose sub-shapes (powerStructure.government:
      // string|Object) are not statically assignable to rulingPower.js's narrower
      // RulingPowerSettlement, though every runtime caller passes the same objects.
      // One unknown-bridge here (zero any-holes), matching how the untyped callers
      // already cross this boundary.
      const rulingView = /** @type {import('../rulingPower.js').RulingPowerSettlement} */ (
        /** @type {unknown} */ (settlement));
      const result = transferRulingPower(rulingView, factionName, {
        cause: 'appointment',
        tick: Number.isFinite(tick) ? tick : null,
      });
      return result.error ? settlement : /** @type {SimSettlement} */ (result.settlement);
    }
    case 'institution_suppression': {
      // Impair the named institution — the suppression now BITES (status + legitimacy),
      // not just an id on a text list. Idempotent by causeEventId.
      const institutions = Array.isArray(settlement.institutions) ? settlement.institutions : [];
      const inst = entityByName(institutions, pay.institutionName)
        || institutions.find((i) => stablePart(i?.id || i?.name || '') === String(pay.institutionId));
      if (!inst) return settlement;
      // FORCED SEAM (same class as above): SimInstitution.status is string|Object,
      // StatusEntity.status is string — structurally incompatible typedef families
      // for the same runtime objects. One unknown-bridge, zero any-holes.
      const statusView = /** @type {import('../entities/status.js').StatusEntity} */ (
        /** @type {unknown} */ (inst));
      const impaired = withImpairment(statusView, {
        type: 'legitimacy',
        severity: INSTITUTION_SUPPRESSION_SEVERITY,
        causeEventId: `faction_suppression:${pay.factionId}:${pay.institutionId}`,
        appliedAt: now ?? null,
        description: `${factionName || 'A rival faction'} suppressed ${inst.name || pay.institutionName}.`,
      });
      return { ...settlement, institutions: institutions.map((i) => (i === inst ? /** @type {SimInstitution} */ (impaired) : i)) };
    }
    case 'institution_capture': {
      // Institutional control → bounded roster influence for the capturing faction; a
      // later rival faction_power_shift can move it back (two-way, existing machinery).
      return bumpRosterFactionPower(settlement, factionName, FACTION_CAPTURE_POWER_GAIN);
    }
    case 'faction_power_shift': {
      // A bounded power transfer from the contested rival to the contesting faction.
      const rivalName = state?.factionStates?.[pay.rivalFactionId]?.name;
      if (!factionName || !rivalName) return settlement;
      return shiftRosterFactionPower(settlement, factionName, rivalName, FACTION_POWER_SHIFT_AMOUNT);
    }
    default:
      return settlement;
  }
}

function affectedSaveIdsForOutcome(/** @type {any} */ outcome) {
  const ids = new Set();
  for (const delta of outcome.populationDeltas || []) {
    if (delta?.saveId) ids.add(String(delta.saveId));
  }
  for (const delta of outcome.foodStockpileDeltas || []) {
    if (delta?.saveId) ids.add(String(delta.saveId));
  }
  if (outcome.targetSaveId && (outcome.condition || outcome.tierChange || outcome.resourcePatch || outcome.institutionPatch || outcome.powerTransfer || outcome.deityReembed || outcome.lifecyclePatch)) {
    ids.add(String(outcome.targetSaveId));
  }
  return [...ids];
}

// Occupation-parity multipliers — mirror the GENERATOR's `occupied`-stress
// transform (powerGenerator.js ~1223): the conqueror disarms the locals so a
// PULSE-conquered town looks like a GENERATION-occupied one, not a town that
// merely swapped a flag. A local military/guard faction is gutted (×0.3 — the
// "disarm"); the deposed governing seat is humbled (×0.6) + marked 'occupied';
// every other local civic faction is suppressed (×0.82). Idempotent by the
// 'occupied'/'disarmed' modifier guard so a re-fired conquest never re-cuts.
const OCCUPATION_DISARM = 0.3;
const OCCUPATION_GOVERNING_CUT = 0.6;
const OCCUPATION_CIVIC_CUT = 0.82;

/** @param {import('../settlement.schema.js').SimFaction} f */
const factionNameOf = (f) => String(f?.faction || f?.name || '').trim();
/** @param {import('../settlement.schema.js').SimFaction} f */
const isMilitaryFaction = (f) => {
  const cat = String(f?.category || f?.archetype || '').toLowerCase();
  const nm = factionNameOf(f).toLowerCase();
  return cat === 'military' || /\b(milit|guard|garrison|warrior|legion|soldier)\b/.test(nm);
};

/**
 * Reproduce generation-time occupation RICHNESS on a faction roster that has just
 * been conquered via the pulse: disarm the local military, humble the deposed seat,
 * suppress the civic factions, then seed the foreign occupation authority that
 * transferRulingPower crowns (it only promotes an EXISTING faction). A no-op if the
 * named power already exists (idempotent re-fire) or there is no powerStructure.
 * Used ONLY on cause:'conquest', so every pre-existing (coup) transfer is untouched.
 */
function installOccupationAuthority(/** @type {any} */ settlement, /** @type {any} */ powerName) {
  const name = String(powerName || '').trim();
  if (!name) return settlement;
  const ps = settlement?.powerStructure;
  if (!ps) return settlement;
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const exists = factions.some((/** @type {any} */ f) => factionNameOf(f).toLowerCase() === name.toLowerCase());
  if (exists) return settlement;
  // Disarm/suppress the locals first (idempotent: a faction already carrying the
  // 'occupied'/'disarmed' modifier is left alone, so a re-fired conquest is a no-op).
  const round = (/** @type {number} */ v) => Math.max(0, Math.round(v));
  const num = (/** @type {any} */ v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const disarmedFactions = factions.map((/** @type {any} */ f) => {
    const mods = Array.isArray(f?.modifiers) ? f.modifiers : [];
    if (mods.includes('occupied') || mods.includes('disarmed')) return f;
    if (f?.isGoverning) {
      return { ...f, power: round(num(f.power) * OCCUPATION_GOVERNING_CUT), modifiers: [...mods, 'occupied'] };
    }
    if (isMilitaryFaction(f)) {
      return { ...f, power: round(num(f.power) * OCCUPATION_DISARM), modifiers: [...mods, 'disarmed'] };
    }
    return { ...f, power: round(num(f.power) * OCCUPATION_CIVIC_CUT), modifiers: [...mods, 'occupied'] };
  });
  // NOTE: the roster's power values are RELATIVE WEIGHTS, not a normalized 100-point
  // share — the sum≈100 seen at generation is a generation-time-only normalization
  // (pinned against the pipeline output), with no runtime consumer enforcing it.
  // Seeding the occupier at 90 without renormalizing matches the other sim-time
  // power writers (transferRulingPower's +6 coup bump, the thieves-guild floor-raise).
  const occupier = {
    faction: name,
    name,
    // category:'occupation' (not 'military') so factionArchetype — which resolves category BEFORE
    // the name rules — buckets the crowned occupier as OCCUPATION, reaching its rank/label/
    // disposition. CATEGORY_MAP already maps 'occupation'; modifiers:['occupier'] still tags it.
    // Dormant behind warLayerEnabled ⇒ golden-neutral.
    category: 'occupation',
    power: 90,
    isGoverning: false,
    desc: 'A foreign occupation authority installed by conquest.',
    modifiers: ['occupier'],
  };
  return {
    ...settlement,
    powerStructure: { ...ps, factions: [...disarmedFactions, occupier] },
  };
}

// Conserved granary transfer (war sack food seizure). `foodStockpileDeltas` carries a
// per-settlement storageMonths change (target loses, victor gains) the same way
// populationDeltas carries a per-settlement population change, so it applies through the
// standard per-outcome pass and is atomic with the conquest's defer/dismiss. Clamped to
// [0, granary capacity]; a settlement with no food ledger is a safe no-op.
function applyFoodStockpileOutcomeToSettlement(/** @type {any} */ settlement, /** @type {any} */ outcome, /** @type {any} */ saveId) {
  const fs = settlement?.economicState?.foodSecurity;
  if (!fs || !Number.isFinite(Number(fs.storageMonths))) return settlement;
  const deltaMonths = (outcome.foodStockpileDeltas || [])
    .filter((/** @type {any} */ d) => String(d?.saveId) === String(saveId))
    .reduce((/** @type {number} */ sum, /** @type {any} */ d) => sum + (Number(d?.deltaMonths) || 0), 0);
  if (!deltaMonths) return settlement;
  const cap = storageCapacityMonths(settlement);
  const nextMonths = Math.round(Math.max(0, Math.min(cap, Number(fs.storageMonths) + deltaMonths)) * 10) / 10;
  if (nextMonths === Number(fs.storageMonths)) return settlement;
  return {
    ...settlement,
    economicState: {
      ...settlement.economicState,
      foodSecurity: { ...fs, storageMonths: nextMonths },
    },
  };
}

function applyOutcomeToSettlement(/** @type {any} */ settlement, /** @type {any} */ outcome, /** @type {any} */ saveId) {
  if (!settlement || !outcome) return settlement;
  let next = settlement;
  if (outcome.populationDeltas?.length) {
    next = applyPopulationOutcomeToSettlement(next, outcome, saveId);
  }
  if (outcome.foodStockpileDeltas?.length) {
    next = applyFoodStockpileOutcomeToSettlement(next, outcome, saveId);
  }
  if (outcome.tierChange && String(outcome.targetSaveId) === String(saveId)) {
    next = applyTierOutcomeToSettlement(next, outcome);
  }
  if (outcome.resourcePatch && String(outcome.targetSaveId) === String(saveId)) {
    next = applyResourceOutcomeToSettlement(next, outcome);
  }
  // W-DISCOVERY: an organic discovery/removal writes roster MEMBERSHIP (append/remove
  // config.nearbyResources) + the regen-surviving resourceEdits delta + the surgical
  // production reconcile + the typed resource_strike/vein_exhausted condition.
  if (outcome.resourceMembership && String(outcome.targetSaveId) === String(saveId)) {
    next = applyResourceMembershipOutcomeToSettlement(next, outcome);
  }
  // W-LIFECYCLE: terminal death (remnant grade from the LIVE peakTier — the
  // scarcity law at the writer; institutions clear; NPCs gain dispersal stamps
  // only — fates unresolved) / resettlement (first-class rebirth on the old cell;
  // peakTier restarts). Runs AFTER populationDeltas so the writer's zero is the
  // exactness backstop over the receipted debit.
  if (outcome.lifecyclePatch && String(outcome.targetSaveId) === String(saveId)) {
    next = applySettlementLifecycleOutcomeToSettlement(next, outcome);
  }
  if (outcome.institutionPatch && String(outcome.targetSaveId) === String(saveId)) {
    next = applyInstitutionLifecycleOutcome(next, outcome);
  }
  // A coup verdict (or any future power_transfer outcome) reshapes the
  // governing seat through the same domain path the CHANGE_RULING_POWER
  // canon event uses. A transfer that no longer applies (the named faction
  // is gone, or already governs) safely no-ops; the condition below still
  // records the turmoil.
  if (outcome.powerTransfer && String(outcome.targetSaveId) === String(saveId)) {
    // A CONQUEST (the war layer) installs a foreign occupation authority —
    // a power that does NOT exist among the target's own factions. transferRulingPower
    // can only promote an EXISTING faction, so seed the occupation authority as a
    // new non-governing power first; the transfer then crowns it. Gated on
    // cause === 'conquest' so every pre-existing (coup) transfer is byte-identical.
    if (outcome.powerTransfer.cause === 'conquest') {
      next = installOccupationAuthority(next, outcome.powerTransfer.toPowerName);
      // Occupation parity: a GENERATION-occupied town carries the
      // vassal_extraction condition (conditionPromotion maps the 'occupied' stress
      // into it), so a PULSE-conquered town must too — that condition is what the
      // substrate (deriveCausalState), the pressure model, AND population flight all
      // read as "occupation." Stamp it alongside the conquest's war_pressure so the
      // two faces of an occupation (military strain + economic extraction) both land.
      // Idempotent by id (withActiveCondition replaces same-id), so a re-fired
      // conquest never double-stamps. Conquest-only ⇒ a coup is byte-identical.
      next = withActiveCondition(next, {
        archetype: 'vassal_extraction',
        severity: clamp01(0.55 + (outcome.severity || 0) * 0.15),
        triggeredAt: {
          tick: outcome.powerTransfer.tick ?? null,
          sourceEventType: 'WAR_LAYER_CONQUEST',
          sourceEventTargetId: String(saveId),
        },
        causes: [{
          source: outcome.powerTransfer.toPowerName,
          effect: 'occupation_extraction',
          reason: `${outcome.powerTransfer.toPowerName} extracts wealth, troops, and authority from the conquered settlement.`,
        }],
      });
    }
    const result = transferRulingPower(next, outcome.powerTransfer.toPowerName, {
      cause: outcome.powerTransfer.cause || 'coup',
      tick: outcome.powerTransfer.tick ?? null,
      losers: outcome.powerTransfer.losers || [],
    });
    if (!result.error) next = result.settlement;
  }
  // A religious conversion RE-EMBEDS the winning neighbour's EXISTING deity
  // snapshot onto the convert's config.primaryDeitySnapshot so the
  // conversion STICKS (the pulse/derivers read only the snapshot, never the
  // store/customContent). We re-pick the exact snapshot fields (never spread the
  // raw record) — the SAME field set SET_PRIMARY_DEITY embeds — so a re-embed is
  // structurally identical to an assign and carries no wall-clock stamp.
  if (outcome.deityReembed?.snapshot && String(outcome.targetSaveId) === String(saveId)) {
    next = reEmbedPrimaryDeity(next, outcome.deityReembed.snapshot);
  }
  if (outcome.condition && String(outcome.targetSaveId) === String(saveId)) {
    next = withActiveCondition(next, outcome.condition);
  }
  return next;
}

/**
 * Re-embed a deity snapshot onto a settlement's config (the conversion commit).
 * Re-picks the exact embed field set (mirrors mutate.setPrimaryDeity) so a
 * conversion is structurally identical to a DM assign — never leaking a foreign
 * field or wall-clock stamp into the embedded record.
 *
 * FULL PARITY (T4 ONE-REGEN batch): the ONE deliberate asymmetry is gone. This
 * writer used to drop `lawAxis`, so an organically converted settlement read
 * chaos01 0.5 no matter which god took the altar, while the identical deity
 * assigned by a DM read its true law coordinate. The axis is now carried, and
 * conversion is structurally identical to a DM assign on EVERY axis. The lift
 * re-arms for every chaos01 reader (deityAxes.chaos01 → deriveTemper, stance,
 * piety, legitimacy, contest, tolerance, disposition, and the law_order term),
 * so a seeded advance that commits a conversion whose winning snapshot carries
 * a NON-neutral lawAxis moves — the declared drift of that batch. An absent
 * lawAxis still embeds 'neutral', so legacy converts read exactly as before.
 *
 * IDENTITY: the committed ref is `deityIdOf(snapshot)` — the SAME id the pantheon
 * ledger keys the same snapshot by (pantheon.collectFaithDeltas), so config and
 * ledger can never split identity. Two rots were removed here (R-5b item 13c):
 * the old chain fell back to `config.primaryDeityRef` (the OUSTED patron's ref,
 * stamped onto the WINNER's snapshot) and then to a `converted:<slug>` namespace
 * that neither the account mint (`deity:<scope>:<slug>`) nor the pool namespace
 * (`deity:core:`) recognized. Both fallbacks were unreachable for every
 * disciplined writer (all stamp `_deityRef`); the only behavior delta is on a
 * pre-discipline legacy local save, whose ref-less snapshot now keys by
 * `deity:<name>` or, name-less, refuses the commit rather than inventing an
 * identity.
 */
function reEmbedPrimaryDeity(/** @type {any} */ settlement, /** @type {any} */ snapshot) {
  const ref = settlement && snapshot ? deityIdOf(snapshot) : null;
  if (!ref) return settlement;
  // NET-ZERO SHAPE (size-ratchet discipline): the embed is named and the config
  // is built in the return, so restoring lawAxis below costs the file no
  // effective line. Behavior is identical — same keys, same freeze, same order.
  const embed = Object.freeze({
    _deityRef: ref,
    name: String(snapshot.name || ''),
    alignmentAxis: snapshot.alignmentAxis || 'neutral',
    temperamentAxis: snapshot.temperamentAxis || 'neutral',
    rankAxis: snapshot.rankAxis || 'minor',
    // lawAxis: the SAME default discipline both DM writers use (mutateEntities
    // setPrimaryDeity/imposeCult) — a legacy 3-axis deity carries none ⇒
    // 'neutral', which reads chaos01 0.5, the no-signal midpoint. Restored at
    // T4: this was the one deliberate writer asymmetry.
    lawAxis: snapshot.lawAxis || 'neutral',
    ...(snapshot.domain ? { domain: String(snapshot.domain) } : {}),
  });
  return { ...settlement, config: { ...(settlement.config || {}), primaryDeityRef: ref, primaryDeitySnapshot: embed } };
}

/**
 * The stressor upsert merge. Birth time is sacred (FIRST createdAt wins). For the
 * legacy single-write path (a fresh birth, or an escalation/spread re-upsert of a
 * PRE-TICK record), this is byte-identical to the prior behavior: take the
 * incoming stressor wholesale, preserve createdAt, stamp updatedAt.
 *
 * The COMMUTATIVE branch fires when the prior record was minted THIS SAME tick
 * (prior.createdAt === now) OR the caller flags `forceCommutative` — i.e. two
 * outcomes collided on the same stressor id within one apply pass. That covers
 * Feature D's same-tick multi-seat religious conversions seeding one fresh
 * `religious_conversion_fracture` record (createdAt === now), AND — via the
 * caller's this-pass write tracking — multiple spread/escalate outcomes of a
 * PRE-TICK record colliding in one tick: without forceCommutative the second
 * write would clobber the first as order-dependent last-write-wins,
 * silently dropping spread targets and reverting escalate↔spread effects. The
 * merge is a FIELD-MERGE that cannot depend on apply order: UNION of
 * affectedSettlementIds, MAX of severity, MAX of per-settlement
 * severityBySettlement, MAX peakSeverity. So reversing the outcome order yields a
 * byte-identical record.
 */
function mergeStressorUpsert(/** @type {any} */ prior, /** @type {any} */ incoming, /** @type {any} */ now, /** @type {boolean} */ forceCommutative = false, /** @type {number} */ tick = NaN) {
  // Wind-down ceiling: a war stressor that wound down THIS tick (its sponsoring
  // hostility ended) must not be re-raised by a same-tick escalate/spread of the
  // same record —
  // that would defeat the wind-down's purpose of letting the next aging tick end
  // the war. When the prior carries a this-tick windDown stamp, the wound-down
  // severity is a hard ceiling for the merged result.
  const windDownCeiling = prior?.originContext?.windDown?.tick === tick
    ? clamp01(prior.severity ?? 0)
    : null;
  const capSeverity = (/** @type {number} */ s) => (windDownCeiling == null ? s : Math.min(s, windDownCeiling));
  const base = { ...incoming, createdAt: prior?.createdAt || now, updatedAt: now };
  // The commutative path fires for a SAME-TICK collision (prior born this tick)
  // or when the caller has already written this id earlier in the same pass.
  //
  // KNOWN-DEFERRED ([worldpulse-core-4], OWNER-GATED — Wave-5 bornTick piggyback):
  // `createdAt === now` is a same-tick BIRTH PROXY. advanceInterval threads ONE
  // pinned `now` across every synchronous tick of a composed advance, so a stressor
  // born at interval-tick 3 still satisfies createdAt===now when tick 9 re-upserts
  // it — taking the commutative max/union branch meant for same-apply-pass
  // collisions, so within one advance a re-upsert can only ratchet up, while the
  // same world advanced week-by-week (distinct `now`) gets legacy replace semantics.
  // The clean fix — switch the collision test to a per-record bornTick===tick stamp
  // (the `tick` param is already threaded for this) — REQUIRES stamping bornTick on
  // every persisted stressor: a persistence-SHAPE change that shifts same-seed
  // stressor goldens, so it is parked for the owner-signed UPDATE_GOLDEN regen
  // (TEMPORAL_AUDIT §3c / backlog Wave-5). No non-shifting interim exists — threading
  // `tick` as the collision key shifts the same goldens. See the G1c deferral ledger.
  if (!prior || (prior.createdAt !== now && !forceCommutative)) {
    if (windDownCeiling == null) return base;
    // A this-tick wind-down: cap severity AND preserve the prior's windDown
    // stamp (the incoming escalate/spread snapshot carries no originContext, so
    // a wholesale take would erase the wind-down record the aging tick relies on).
    return {
      ...base,
      severity: capSeverity(clamp01(incoming.severity ?? 0)),
      originContext: prior.originContext ?? base.originContext,
    };
  }
  const affected = [...new Set([
    ...(prior.affectedSettlementIds || []),
    ...(incoming.affectedSettlementIds || []),
  ].map(String))].sort();
  // Codepoint-sort the severityBySettlement keys so the merged object is
  // order-INDEPENDENT under JSON.stringify (object key order is otherwise
  // insertion-dependent and would make the merge non-commutative byte-wise).
  /** @type {Record<string, any>} */
  const mergedSev = {};
  for (const [id, sev] of Object.entries(prior.severityBySettlement || {})) mergedSev[id] = sev;
  for (const [id, sev] of Object.entries(incoming.severityBySettlement || {})) {
    mergedSev[id] = Math.max(mergedSev[id] ?? 0, sev);
  }
  /** @type {Record<string, any>} */
  const severityBySettlement = {};
  for (const id of Object.keys(mergedSev).sort()) severityBySettlement[id] = mergedSev[id];
  const severity = capSeverity(Math.max(prior.severity ?? 0, incoming.severity ?? 0));
  return {
    ...base,
    severity,
    peakSeverity: Math.max(prior.peakSeverity ?? 0, incoming.peakSeverity ?? 0, severity),
    affectedSettlementIds: affected,
    severityBySettlement,
    // Preserve the prior's windDown stamp when capping (incoming carries none).
    // Only on the wind-down path so the existing same-tick commutative merge
    // stays byte-identical.
    ...(windDownCeiling == null ? {} : { originContext: prior.originContext ?? base.originContext }),
  };
}

function settlementChanged(/** @type {any} */ beforeSettlement, /** @type {any} */ afterSettlement) {
  if (beforeSettlement === afterSettlement) return false;
  try {
    return JSON.stringify(beforeSettlement) !== JSON.stringify(afterSettlement);
  } catch {
    return true;
  }
}

function saveLike(/** @type {any} */ entry, /** @type {any} */ settlement) {
  return {
    id: String(entry.saveId),
    name: entry.save?.name || settlement?.name || String(entry.saveId),
    settlement,
  };
}

function applyRelationshipLabelToGraph(/** @type {any} */ graph, /** @type {any} */ outcome, /** @type {any} */ now) {
  if (outcome.proposalPayload?.kind !== 'relationship_label_change') return graph;
  const { relationshipKey, toType } = outcome.proposalPayload;
  return {
    ...graph,
    edges: (graph.edges || []).map((/** @type {any} */ edge) => {
      if (relationshipKeyFromEdge(edge) !== relationshipKey) return edge;
      return {
        ...edge,
        relationshipType: toType,
        type: edge.type === edge.relationshipType || !edge.type ? toType : edge.type,
        updatedAt: now,
      };
    }),
  };
}

function relationshipEdgeForOutcome(/** @type {any} */ graph, /** @type {any} */ outcome) {
  const key = outcome.proposalPayload?.relationshipKey || outcome.relationshipKey;
  if (!key) return null;
  return (graph.edges || []).find((/** @type {any} */ edge) => relationshipKeyFromEdge(edge) === key) || null;
}

/**
 * relationshipChannelBundle and the neighbourNetwork writeback both read raw
 * edge orientation ('edge.from is the patron/overlord'), but a pulse-driven
 * subjugation may have crowned the authored 'to' side via the seniority stamps
 * on relationship state. When relationshipRoles reports the senior side at 'to',
 * hand consumers a transient role-oriented copy of the edge — from/to (and the
 * directional aliases) swapped, stored edge id kept — so channels and dossiers
 * assert the real hierarchy. Symmetric labels and unstamped (DM-authored)
 * hierarchy edges resolve as not-reversed and pass through untouched.
 *
 * Every alias pair is oriented from the SINGLE canonical senior/junior
 * (relationshipRoles already derives these from the from/to pair), never by
 * swapping each pair against its own raw values. An edge with a partial alias
 * set (e.g. from/to plus a lone `source`) would otherwise come out
 * inconsistently oriented — asserting the wrong hierarchy direction downstream.
 */
function roleOrientedEdge(/** @type {any} */ edge, /** @type {any} */ relState) {
  if (!edge) return edge;
  const { seniorId, juniorId, reversed } = relationshipRoles(edge, relState);
  if (!reversed) return edge;
  const oriented = { ...edge };
  // Only rewrite alias slots the edge actually carries; the senior id goes in
  // each pair's senior slot and the junior id in its junior slot, so all
  // populated aliases agree on the same orientation.
  for (const [senior, junior] of [['from', 'to'], ['source', 'target'], ['a', 'b'], ['settlementAId', 'settlementBId']]) {
    if (edge[senior] === undefined && edge[junior] === undefined) continue;
    if (edge[senior] !== undefined) oriented[senior] = seniorId;
    if (edge[junior] !== undefined) oriented[junior] = juniorId;
  }
  return oriented;
}

/**
 * A pulse relationship label outcome is canonical relationship state
 * (DM-approved, or auto per the campaign's rules) — write it through to BOTH
 * settlements' neighbourNetwork links so the dossier, threat profile, PDF,
 * and AI grounding stop asserting the label the pulse already changed.
 * Conditions-over-mutation does not apply: the label IS the relationship
 * state, not a derived effect. Both ends must be saved settlements in this
 * pulse; a pair with an un-saved end leaves neighbourNetwork untouched (we
 * cannot reconcile the reciprocal link of a settlement we are not carrying).
 */
function writeRelationshipLabelToNeighbourNetworks(/** @type {any} */ { settlementUpdates, edge, toType, tick }) {
  if (!edge?.from || !edge?.to || !toType) return;
  const fromId = String(edge.from);
  const toId = String(edge.to);
  const fromEntry = settlementUpdates.get(fromId);
  const toEntry = settlementUpdates.get(toId);
  if (!fromEntry?.settlement || !toEntry?.settlement) return;
  const labelled = { ...edge, relationshipType: toType };
  const ends = [
    { selfId: fromId, otherId: toId, otherEntry: toEntry },
    { selfId: toId, otherId: fromId, otherEntry: fromEntry },
  ];
  for (const { selfId, otherId, otherEntry } of ends) {
    const entry = settlementUpdates.get(selfId);
    const network = Array.isArray(entry.settlement?.neighbourNetwork) ? entry.settlement.neighbourNetwork : [];
    if (!network.length) continue;
    const otherName = otherEntry.save?.name || otherEntry.settlement?.name || null;
    const role = rolesForCanonicalEdge(labelled, selfId).sourceRole;
    let touched = false;
    const next = network.map((/** @type {any} */ link) => {
      const matches = String(link?.id || '') === otherId
        || String(link?.targetId || '') === otherId
        || String(link?.settlementId || '') === otherId
        || (otherName != null && (String(link?.neighbourName || '') === String(otherName) || String(link?.name || '') === String(otherName)));
      if (!matches) return link;
      const unchanged = link.relationshipType === toType
        && String(link.relationshipFrom || '') === fromId
        && String(link.relationshipTo || '') === toId
        && link.localRelationshipRole === role
        && link.displayRelationshipType === role;
      if (unchanged) return link; // identity no-op
      touched = true;
      return {
        ...link,
        relationshipType: toType,
        relationshipFrom: fromId,
        relationshipTo: toId,
        localRelationshipRole: role,
        displayRelationshipType: role,
        // Provenance: the dossier shows WHO last asserted this label.
        updatedByPulse: Number.isFinite(tick) ? tick : null,
      };
    });
    if (touched) {
      settlementUpdates.set(selfId, { ...entry, settlement: { ...entry.settlement, neighbourNetwork: next } });
    }
  }
}

/**
 * Every third-party edge the vassalage hierarchy cascade flips emits Wizard
 * News — the realignment is major campaign politics, not a
 * silent field rewrite. One entry per flipped edge, naming both settlements
 * and the flip.
 */
function cascadeNewsEntry(/** @type {any} */ { cascade, edge, nameFor, outcome, tick }) {
  const edgeKey = cascade.edgeKey || cascade.relationshipKey;
  const fromName = nameFor(edge?.from);
  const toName = nameFor(edge?.to);
  const fromLabel = String(cascade.fromType || 'linked').replace(/_/g, ' ');
  const toLabel = String(cascade.toType || 'linked').replace(/_/g, ' ');
  const hostile = cascade.toType === 'hostile';
  return {
    id: `wizard_news.${tick}.hierarchy_cascade.${edgeKey}`,
    tick,
    scope: 'regional',
    significance: hostile ? 'major' : 'notable',
    score: hostile ? 72 : 56,
    headline: `${fromName} and ${toName}: ${fromLabel} becomes ${toLabel}`,
    summary: cascade.reason || 'The new vassalage realigns the relationship.',
    kind: 'applied',
    impactKind: 'hierarchy_cascade',
    channelType: null,
    severity: hostile ? 0.74 : 0.58,
    settlementIds: [edge?.from, edge?.to].filter(Boolean).map(String),
    impactIds: [],
    channelIds: [],
    sourceEventId: outcome.id,
    tags: ['world_pulse', 'relationship', 'hierarchy_cascade'],
    reasons: [cascade.reason].filter(Boolean),
  };
}

const IMPORTANCE_RANK = Object.freeze({ pillar: 3, key: 2, notable: 1 });

/**
 * A betrayal stressor's birth seeds the traitor its variant implies — ONE
 * corrupted NPC, dependent on already-existing factors: there must be an
 * NPC with a corruptible flaw to turn (no flaw, no traitor). Unlike the
 * organic corruption loop this does NOT require a criminal institution —
 * the patron is the foreign sponsor (or the conspiracy itself), recorded on
 * corruptTies.foreignPatron. Deterministic pick: most notable eligible NPC,
 * name as tiebreak. Covert by design: no news entry — the DM finds the
 * corrupt flag in the dossier, the table finds it the hard way.
 */
function seedBetrayalTraitor(/** @type {any} */ { state, settlementUpdates, saveId, originContext }) {
  const sid = String(saveId || '');
  const entry = settlementUpdates.get(sid);
  const npcs = entry?.settlement?.npcs;
  if (!Array.isArray(npcs) || !npcs.length) return state;
  const eligible = npcs
    .map((npc, index) => ({ npc, index, flaw: npcCorruptibleFlaw(npc) }))
    .filter(c => c.flaw && c.npc.corrupt !== true && !c.npc.ousted);
  if (!eligible.length) return state;
  // Codepoint tiebreak, NOT localeCompare: this sort decides WHICH NPC turns
  // traitor, and default-locale collation can reorder accented names across
  // machines, breaking replay determinism.
  eligible.sort((a, b) => {
    const rank = ((/** @type {any} */ (IMPORTANCE_RANK))[b.npc.importance] || 0) - ((/** @type {any} */ (IMPORTANCE_RANK))[a.npc.importance] || 0);
    if (rank) return rank;
    const an = String(a.npc.name || '');
    const bn = String(b.npc.name || '');
    return an < bn ? -1 : an > bn ? 1 : 0;
  });
  const chosen = eligible[0];
  const foreign = ['foreign_sponsored', 'abandoned_agent'].includes(originContext.variant);
  const vector = foreign ? 'forbidden_patron' : corruptionVectorForFlaw(chosen.flaw);
  const corruptTies = {
    criminalInstitution: null,
    thievesGuild: null,
    foreignPatron: originContext.sponsorSettlementId || originContext.formerSponsorSettlementId || null,
    conspiracy: originContext.variant,
  };
  const nextNpcs = npcs.map((npc, index) => (index === chosen.index
    ? { ...npc, corrupt: true, corruptionVector: vector, corruptTies }
    : npc));
  settlementUpdates.set(sid, { ...entry, settlement: { ...entry.settlement, npcs: nextNpcs } });
  // Mirror into npcStates immediately so the same-tick world view agrees
  // (ensureNpcStates treats the settlement boolean as authoritative anyway).
  const id = npcId(sid, chosen.npc, chosen.index);
  const st = state.npcStates?.[id];
  if (!st) return state;
  return {
    ...state,
    npcStates: {
      ...state.npcStates,
      [id]: {
        ...st,
        corruption: true,
        corruptionProfile: { corrupted: true, vector },
        corruptionHeat: Math.max(st.corruptionHeat || 0, 0.3),
      },
    },
  };
}

/**
 * @param {Object} [args]
 * @param {any} [args.snapshot]
 * @param {any} [args.worldState]
 * @param {any} [args.regionalGraph]
 * @param {any} [args.wizardNews]
 * @param {Map<string, any>} [args.settlementMap]
 * @param {any[]} [args.outcomes]
 * @param {number} [args.tick]
 * @param {string} [args.now]
 * @param {string|null} [args.season]  SEASONS-B (M3): the current road season, so
 *   parked cross-settlement propagation arrivals lengthen in winter (info runs
 *   cold). Null / no overlay ⇒ geometric latency, byte-identical.
 * @param {boolean} [args.advanceNewsTick]
 * @param {boolean} [args.advanceRegionalImpacts]
 * @param {any} [args.simulationRules]
 */
export function applyWorldPulseOutcomes({
  snapshot,
  worldState,
  regionalGraph,
  wizardNews,
  settlementMap,
  outcomes = [],
  tick,
  now,
  season = null,
  advanceNewsTick = true,
  advanceRegionalImpacts: shouldAdvanceRegionalImpacts = true,
  simulationRules = null,
} = {}) {
  let graph = ensureRegionalGraph(regionalGraph || snapshot.regionalGraph, { now });
  let state = worldState;
  const rules = normalizeSimulationRules(simulationRules || worldState?.simulationRules || snapshot?.worldState?.simulationRules);
  const propagationDepth = propagationDepthForRules(rules);
  // worldState.tick is the authoritative clock: SYNC currentTick to it (not
  // +1) so a manual impact-advance press cannot permanently skew which tick
  // this pulse's entries (all stamped with `tick`) group and ground under.
  let feed = ensureWizardNewsFeed(wizardNews || snapshot.campaign?.wizardNews, { now });
  if (advanceNewsTick) {
    feed = {
      ...feed,
      currentTick: Number.isFinite(tick) ? Math.max(0, Math.floor(/** @type {number} */ (tick))) : feed.currentTick + 1,
    };
  }
  const settlementUpdates = new Map(settlementMap ? [...settlementMap.entries()] : []);
  const autoApplied = [];
  const proposals = [];
  const newsEntries = [];
  const lapsedOutcomeIds = [];
  // Direct state-only headlines stay off every public/raw-news surface, but the
  // rumor/belief plane historically consumed those entries as simulation input.
  // Preserve that exact seed on an internal return lane.
  const rumorSeedEntries = [];
  const priorHiddenRumorSeeds = stateOnlyRumorSeedsFromHistory(
    state?.pulseHistory,
    feed.entries,
  );
  // SPATIAL (5.5-M item 4): the propagation ARRIVAL front. The digest is present
  // ONLY under the entitled spatial-canon marker ⇒ null keeps every step below on
  // the aspatial instant-propagation path (byte-identical). When present, this
  // tick's cross-settlement impacts are PARKED (delayed by travel distance) and
  // previously-parked, now-due arrivals are RELEASED at tick start.
  const spatialDigest = activeSpatialDigest(state);
  let spatialArrivals = /** @type {import('../spatial/spatialArrival.js').ArrivalLedger | undefined} */ (
    spatialDigest ? getSpatialLedger(state, 'spatialArrivals') : undefined);
  // Stressor ids already written by an EARLIER outcome in this same apply
  // pass. A second outcome touching the same id (escalate after spread,
  // multi-target spread of one record) must field-MERGE with the first write,
  // not clobber it — otherwise spread targets vanish and escalate/spread revert
  // each other order-dependently. The merge is commutative, so the persisted
  // record reflects every reported event regardless of iteration order.
  const stressorWrittenThisPass = new Set();

  // Time advances BEFORE this tick's propagation queues: the previous pulse's
  // delayed impacts mature now, while impacts the loop below queues stay
  // un-aged until the NEXT pulse — delayTicks:1 means "next tick", never
  // "later this same tick" (the party/proposal paths already pass
  // advanceRegionalImpacts:false for the same reason).
  if (shouldAdvanceRegionalImpacts && propagationDepth > 0) {
    const beforeRegionalAdvance = graph;
    graph = advanceRegionalImpacts(graph, 1, { currentTick: tick, now });
    // SPATIAL: release the cross-settlement impacts that have ARRIVED this tick
    // (parked on earlier ticks) into the regional queue — the existing machinery
    // then materializes them + dates their Wizard News at this ARRIVAL tick.
    if (spatialDigest) {
      const drain = drainDueArrivals(spatialArrivals, tick ?? 0);
      spatialArrivals = drain.next;
      if (drain.due.length) graph = queueRegionalImpacts(graph, drain.due, { now });
    }
    newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeRegionalAdvance, graph, { tick, createdAt: now }));
  }

  // The visible roster is invariant for the whole tick — `snapshot.settlements`
  // is never reassigned in this pass — so it is derived ONCE here rather than
  // re-mapped inside the per-outcome / per-affected-save propagation loop below.
  const visibleSettlementIds = (snapshot.settlements || []).map((/** @type {any} */ item) => item.id);

  for (let outcome of outcomes) {
    // suppression_only is allowed to win candidate conflict arbitration, but it
    // is never an event and must be inert even if a caller accidentally forwards
    // it past the roll seam.
    if (isSuppressionOnlyOutcome(outcome)) continue;
    const stateOnly = isStateOnlyOutcome(outcome);
    // state_only denotes a background mechanical refresh, not a DM decision.
    // Authority routing may have turned an originally-auto stochastic candidate
    // into a proposal; restore the mechanical lane here so the outcome still
    // reaches the existing reducers and the authoritative autoApplied audit.
    if (stateOnly && outcome.applyMode !== 'auto') outcome = { ...outcome, applyMode: 'auto' };
    if (outcome.applyMode === 'proposal') {
      const proposal = {
        id: proposalIdFor(outcome, tick),
        status: 'pending',
        recordModeVersion: RECORD_MODE_PROPOSAL_VERSION,
        createdAt: now,
        updatedAt: now,
        tick,
        outcome: clone(outcome),
        headline: outcome.headline,
        summary: outcome.summary,
        severity: outcome.severity,
        reasons: outcome.reasons || [],
      };
      state = upsertProposal(state, proposal);
      proposals.push(proposal);
      newsEntries.push(newsEntryForOutcome(outcome, tick, 'proposal'));
      continue;
    }

    // M9d — THE WAR INITIATE/RESOLVE SPLIT (apply side). A strategy_deploy that carries
    // a `siege_initiation` payload is a DM-Driven war-initiation whose deployment seed +
    // war_front were WITHHELD by evaluateWarLayer (the mint is HELD under dm_only /
    // recommendations). Reaching apply as 'auto' means the DM APPROVED it (the proposal
    // resolver forces applyMode:'auto'), so re-mint the held siege NOW: install the seeded
    // deployment record on worldState.deployments and mint the war_front on the graph.
    // The next war tick reads a live siege and resolves it through the UNCHANGED
    // resolveSiegeVerdict path. LEGACY war initiations carry no such payload (they minted
    // inline in evaluateWarLayer), so this branch never fires ⇒ byte-identical. Guarded on
    // an absent existing record so a re-applied proposal can't double-seed an army.
    if (outcome.proposalPayload?.kind === 'siege_initiation') {
      const pay = outcome.proposalPayload;
      const besieger = String(pay.besieger);
      if (pay.deployment && !(state.deployments && state.deployments[besieger])) {
        state = { ...state, deployments: { ...(state.deployments || {}), [besieger]: clone(pay.deployment) } };
      }
      if (pay.warFront) {
        const frontChannel = /** @type {import('../region/graph.js').RegionChannel} */ (mintDirectedChannel({ ...pay.warFront, now }));
        graph = addRegionalChannels(graph, [frontChannel], { now });
      }
      // Falls through: the strategy_deploy itself is a settlement-state no-op (its home
      // conditions re-upsert on the NEXT war tick once the deployment is live).
    }

    // W-COMPOSER-2 — THE REALM VERB ARM. An APPROVED realm_verb_order resolves
    // through its wave's own kernel function (force ≡ organic), re-gated against
    // the CURRENT world: a lapsed order REFUSES VISIBLY (news pushed by the arm)
    // and never enters the applied ledger (the sanctioned pre-mutation continue,
    // like the proposal arm above). The lifecycle pair substitutes the ORGANIC
    // outcome (settlement_terminal_death / settlement_resettled) and falls
    // through the standard lane below — zero new apply paths for them.
    if (outcome.proposalPayload?.kind === REALM_VERB_PAYLOAD_KIND) {
      const armed = applyRealmVerbOrder({ state, snapshot, settlementUpdates, outcome, tick: tick ?? 0, now: now ?? null });
      state = armed.worldState;
      newsEntries.push(...armed.newsEntries);
      if (armed.refusal) continue;
      if (armed.settlementPatches) {
        for (const [sid, patched] of armed.settlementPatches) {
          const entry = settlementUpdates.get(String(sid));
          if (entry) settlementUpdates.set(String(sid), { ...entry, settlement: patched });
        }
      }
      if (armed.substituteOutcome) outcome = armed.substituteOutcome;
    }

    // WR-5 G2 — BILATERAL PEACE. Approval of the stored strategy proposal is
    // the suing court's yes. Before any settlement, relationship, graph, recall,
    // or treaty-facing mutation occurs, ask the named target court through the
    // same four-term evaluator. A stale offer with no live war fails closed. A
    // refusal substitutes a priced fact and deliberately skips the existing
    // label-change path, leaving hostility and both deployments intact.
    const warRulingsLit = state?.simulationRules?.warLayerEnabled === true
      && state?.simulationRules?.warTerminationEnabled === true;
    if (isBilateralPeaceOffer(outcome) && warRulingsLit) {
      const priorDisposition = relationshipOutcomeDisposition(state, outcome);
      if (priorDisposition === 'same') continue;
      if (priorDisposition === 'superseded') {
        lapsedOutcomeIds.push(String(outcome.id || ''));
        continue;
      }
      const decisionSnapshot = { ...snapshot, regionalGraph: graph, worldState: state };
      const peaceDecision = readWarPeaceDecision({
        worldState: state,
        snapshot: decisionSnapshot,
        outcome,
        tick,
      });
      if (!peaceDecision) {
        lapsedOutcomeIds.push(String(outcome.id || ''));
        continue;
      }
      newsEntries.push(...warRulingNewsEntries({
        evidence: peaceDecisionRulingEvidence({ outcome, decision: peaceDecision, tick }),
        snapshot,
        now,
      }));
      if (!peaceDecision.accepted) {
        const priced = applyWarPeaceRefusal({
          worldState: state,
          settlementUpdates: [...settlementUpdates.values()],
          regionalGraph: graph,
          outcome,
          decision: peaceDecision,
          tick,
          now,
        });
        state = priced.worldState;
        // The offerer chose peace; the target chose continued war. Each court's
        // own opposition gets an independent, typed organizing grievance.
        state = applyWarDecisionPolitics({
          worldState: state, snapshot,
          actorId: peaceDecision.offererId,
          targetId: peaceDecision.targetId,
          actualAction: 'peace',
          decisionId: `${String(outcome.id)}:offerer`,
          tick,
        }).worldState;
        state = applyWarDecisionPolitics({
          worldState: state, snapshot,
          actorId: peaceDecision.targetId,
          targetId: peaceDecision.offererId,
          actualAction: 'continue',
          decisionId: `${String(outcome.id)}:target`,
          tick,
        }).worldState;
        if (priced.settlementUpdates !== null) {
          for (const entry of priced.settlementUpdates) {
            if (entry?.saveId != null) settlementUpdates.set(String(entry.saveId), entry);
          }
        }
        newsEntries.push(...warRulingNewsEntries({
          evidence: priced.evidence,
          snapshot,
          now,
        }));
        autoApplied.push({
          ...outcome,
          candidateType: 'peace_refused',
          relationshipKey: null,
          relationshipPatch: null,
          proposalPayload: null,
          metadata: {
            ...(outcome.metadata || {}),
            peaceDecision: peaceDecision.receipt,
          },
        });
        continue;
      }
      state = applyWarDecisionPolitics({
        worldState: state, snapshot,
        actorId: peaceDecision.offererId,
        targetId: peaceDecision.targetId,
        actualAction: 'peace',
        decisionId: `${String(outcome.id)}:offerer`,
        tick,
      }).worldState;
      state = applyWarDecisionPolitics({
        worldState: state, snapshot,
        actorId: peaceDecision.targetId,
        targetId: peaceDecision.offererId,
        actualAction: 'peace',
        decisionId: `${String(outcome.id)}:target`,
        tick,
      }).worldState;
      outcome = {
        ...outcome,
        relationshipPatch: {
          ...(outcome.relationshipPatch || {}),
          peaceDecisionOutcomeId: String(outcome.id || ''),
          peaceDecisionTick: Number.isFinite(Number(outcome.generatedAtTick ?? tick))
            ? Math.max(0, Math.floor(Number(outcome.generatedAtTick ?? tick)))
            : 0,
          peaceDecision: 'accepted',
        },
        metadata: {
          ...(outcome.metadata || {}),
          peaceDecision: peaceDecision.receipt,
        },
      };
    }

    for (const saveId of affectedSaveIdsForOutcome(outcome)) {
      const entry = settlementUpdates.get(String(saveId));
      if (!entry) continue;
      const beforeSettlement = entry.settlement;
      const afterSettlement = applyOutcomeToSettlement(beforeSettlement, outcome, saveId);
      if (!settlementChanged(beforeSettlement, afterSettlement)) continue;
      settlementUpdates.set(String(saveId), { ...entry, settlement: afterSettlement });
      if (propagationDepth > 0) {
        const beforeGraph = graph;
        const propagation = propagateRegionalEvent({
          graph,
          beforeSettlement: saveLike(entry, beforeSettlement),
          afterSettlement: saveLike(entry, afterSettlement),
          event: /** @type {any} */ ({
            id: outcome.id,
            type: 'WORLD_PULSE',
            targetId: saveId,
            payload: {
              severity: outcome.severity,
              candidateType: outcome.candidateType,
              outcomeType: outcome.type,
            },
          }),
          activeSettlementId: outcome.targetSaveId || saveId,
          visibleSettlementIds,
          maxDepth: propagationDepth,
          now,
          // SPATIAL: under the marker, DON'T queue impacts instantly — park the
          // cross-settlement ones so they arrive hopWeeks later (news at arrival).
          queueImpacts: !spatialDigest,
        });
        graph = propagation.graph;
        if (spatialDigest) {
          const parked = parkArrivals(spatialArrivals, propagation.impacts, { digest: spatialDigest, tick: tick ?? 0, season });
          spatialArrivals = parked.next;
          // LOCAL / unmapped / unreachable impacts have no travel time ⇒ queue now
          // (the aspatial instant path); only genuine cross-settlement hops delay.
          if (parked.passthrough.length) graph = queueRegionalImpacts(graph, parked.passthrough, { now });
        }
        newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeGraph, graph, { tick, createdAt: now }));
      }
    }

    if (outcome.relationshipKey && outcome.relationshipPatch) {
      // WR-0c: trade-war rivals can share a buyer without having a pair edge.
      // Materialize only that explicitly declared identity before the ordinary
      // relationship writers apply the hostile transition below.
      graph = ensureRelationshipEdgeSeed(graph, outcome, now);
      // Capture the pre-change label: the wind-down handshake below needs to
      // know the edge WAS hostile before this outcome rewrote it.
      const beforeEdge = relationshipEdgeForOutcome(graph, outcome);
      const beforeType = beforeEdge ? String(beforeEdge.relationshipType || beforeEdge.type || '') : null;
      state = applyRelationshipPatch(state, outcome, now);
      graph = applyRelationshipLabelToGraph(graph, outcome, now);
      if (outcome.proposalPayload?.kind === 'relationship_label_change') {
        const edge = relationshipEdgeForOutcome(graph, outcome);
        if (edge) {
          // Both consumers below treat edge.from as the senior side — resolve
          // the JUST-PATCHED state's seniority stamps first.
          const orientedEdge = roleOrientedEdge(edge, state.relationshipStates?.[outcome.relationshipKey]);
          graph = syncRelationshipChannelBundle(graph, orientedEdge, outcome.proposalPayload.toType, {
            now,
            status: 'confirmed',
            outcomeId: outcome.id,
            relationshipKey: outcome.proposalPayload.relationshipKey,
            reason: outcome.proposalPayload.reason,
          });
          writeRelationshipLabelToNeighbourNetworks({
            settlementUpdates,
            edge: orientedEdge,
            toType: outcome.proposalPayload.toType,
            tick,
          });
          if (outcome.proposalPayload.toType === 'vassal') {
            const hierarchy = resolveRelationshipHierarchy({
              worldState: state,
              regionalGraph: graph,
              vassalEdge: edge,
              now,
              tick,
            });
            state = hierarchy.worldState;
            graph = hierarchy.regionalGraph;
            for (const change of hierarchy.changes) {
              const orientedChangeEdge = roleOrientedEdge(change.edge, state.relationshipStates?.[change.relationshipKey]);
              graph = syncRelationshipChannelBundle(graph, orientedChangeEdge, change.toType, {
                now,
                status: 'confirmed',
                outcomeId: outcome.id,
                relationshipKey: change.relationshipKey,
                reason: change.reason,
              });
              writeRelationshipLabelToNeighbourNetworks({
                settlementUpdates,
                edge: orientedChangeEdge,
                toType: change.toType,
                tick,
              });
            }
            // Every flipped third-party edge emits Wizard News (one entry per
            // cascade change, naming both settlements + the flip).
            const settlementNameById = new Map((snapshot.settlements || [])
              .map((/** @type {any} */ item) => [String(item.id), item.name || item.settlement?.name || String(item.id)]));
            const nameFor = (/** @type {any} */ id) => settlementNameById.get(String(id)) || String(id ?? 'unknown');
            // The cascadeChanges shape and the legacy hierarchy.changes shape
            // share fromType/toType/reason but key the edge differently — the
            // union defeats the checker, so normalize through `any` here.
            const cascades = /** @type {any[]} */ (
              Array.isArray(hierarchy.cascadeChanges) && hierarchy.cascadeChanges.length
                ? hierarchy.cascadeChanges
                : hierarchy.changes
            );
            for (const cascade of cascades) {
              const edgeKey = cascade.edgeKey || cascade.relationshipKey;
              const cascadeEdge = cascade.edge
                || (graph.edges || []).find(item => relationshipKeyFromEdge(item) === edgeKey)
                || null;
              newsEntries.push(cascadeNewsEntry({ cascade, edge: cascadeEdge, nameFor, outcome, tick }));
            }
          }
        }
        // Wars end when the WAR ends: a hostile edge de-escalating winds down
        // the siege/wartime/betrayal stressors that hostility sponsored,
        // instead of leaving them to bleed out at 0.02/tick while the former
        // belligerents trade politely.
        if (beforeType === 'hostile' && outcome.proposalPayload.toType !== 'hostile') {
          const wind = windDownSponsoredStressors(state, beforeEdge || edge, {
            tick,
            now,
            toType: outcome.proposalPayload.toType,
          });
          state = wind.worldState;
          // war-3 — SUE-FOR-PEACE GRIPS THE PHYSICAL WAR. The hostility that sponsored
          // the siege just de-escalated; wind down the DEPLOYMENTS too, not only the
          // stressor twins. Either party besieging the other has its army marched home
          // next tick (deploymentReturn), so ONE peace ends BOTH war representations
          // instead of the war-layer siege grinding on to a conquest the label forbade.
          const peaceEdge = beforeEdge || edge;
          if (peaceEdge && peaceEdge.from != null && peaceEdge.to != null) {
            state = stampDeploymentRecall(state, peaceEdge.from, peaceEdge.to, 'sue_for_peace', tick);
            state = stampDeploymentRecall(state, peaceEdge.to, peaceEdge.from, 'sue_for_peace', tick);
          }
          for (const stressor of wind.woundDown) {
            newsEntries.push({
              id: `wizard_news.${tick}.wind_down.${stressor.id}`,
              tick,
              scope: 'regional',
              significance: 'notable',
              score: 52,
              headline: `${stressor.label} winds down`,
              summary: 'The hostility that drove it has ended; the pressure is collapsing.',
              kind: 'applied',
              impactKind: 'stressor_wind_down',
              channelType: null,
              severity: stressor.severity,
              settlementIds: stressor.affectedSettlementIds || [],
              impactIds: [],
              channelIds: [],
              sourceEventId: outcome.id,
              tags: ['world_pulse', 'stressor', 'wind_down'],
              reasons: ['The sponsoring relationship de-escalated.'],
            });
          }
        }
      }
    }
    if (outcome.type === 'npc') state = applyNpcPatch(state, outcome);
    // W-I I3 — THE FACTION PATCH APPLIES BY PAYLOAD, NOT BY TAXONOMY. This guard used to
    // read `outcome.type === 'faction'` alone, which coupled a PAYLOAD's application to an
    // unrelated classification field: an outcome could carry a fully-formed factionPatch
    // and have it silently dropped for being filed under some other type. BYTE-IDENTICAL
    // for every pre-existing producer, by census: the only authors of factionPatch in the
    // estate are factionCompetition's candidateBase (which hardcodes type 'faction') and
    // partyImpact's bolster/undermine outcomes (likewise), so the added disjunct is never
    // the reason this line fires today. It is the reason the brokerage services can charge
    // a patron power an in-world price while still filing as knowledge rather than as
    // politics, which is what the starved-lane cure needs. applyFactionPatch is itself
    // total (no factionId ⇒ the worldState is returned unchanged), so a stray patch with
    // no addressee is a no-op rather than a write.
    if (outcome.type === 'faction' || outcome.factionPatch) state = applyFactionPatch(state, outcome);
    // war-4 — EMERGENCY RECALL EXECUTES. The strategy chooser's return_home hard
    // override (a besieged home / imperilled vassal recalling its committed army)
    // carries metadata.recallTargetId but was previously inert theater. Stamp the
    // withdrawal order onto the army's live deployment so the war layer marches it
    // home NEXT tick (deploymentReturn → siege relief) instead of the order re-firing
    // every tick. No matching deployment ⇒ byte-identical no-op.
    if (outcome.candidateType === 'strategy_return_home' && outcome.metadata?.recallTargetId != null) {
      state = stampDeploymentRecall(state, outcome.targetSaveId, outcome.metadata.recallTargetId, 'return_home', tick);
    }
    // JOIN 1 — THE RESOLVED MARCH REACHES THE OPENER (warIntent.js). The recall arm
    // directly above is the same seam in the other direction: a chooser decision that
    // used to be pure theater, deposited as state the war layer consumes. Here the
    // chooser's `deploy` move deposits an ORDER naming the target its seat resolved
    // on; warDeployment step 4 — still the ONE opener — reads it next tick, tries that
    // target FIRST and waives only the CONQUEST_MARGIN pre-filter for it (never the
    // feasibility gate, never the posture gate). The shared join accepts both the
    // chooser contract and `metadata.warIntent` from non-chooser producers (trade
    // escalation), and retires an earlier order when the opener obeys it.
    // Same-tick producer/opener order remains commutative inside the apply pass.
    state = applyWarIntentOutcome(state, outcome, tick ?? 0);
    // war-2 — APPROVED FACTION PROPOSALS APPLY FOR REAL. A DM-facing faction payload
    // moves real settlement state (the government read-path, the named institution, the
    // roster power scalars), additive on top of applyFactionPatch above.
    if (FACTION_PAYLOAD_KINDS.has(outcome.proposalPayload?.kind)) {
      const sid = String(outcome.proposalPayload.settlementId ?? outcome.targetSaveId ?? '');
      const entry = settlementUpdates.get(sid);
      if (entry?.settlement) {
        const installerFactionId = String(outcome.proposalPayload.factionId || outcome.factionId || '');
        const ladderRecord = getSpatialLedger(state, 'npcLadder')?.[sid];
        const fromRulerId = rulingSeatNidOf(ladderRecord, entry.settlement);
        const inheritedWarDemand = outcome.proposalPayload.kind === 'government_change'
          && installerFactionId
          && typeof outcome.proposalPayload.warDecisionId === 'string'
          && outcome.proposalPayload.warDecisionId
          ? warDemandForInstaller(state, entry.settlement, sid, installerFactionId, {
              decisionId: outcome.proposalPayload.warDecisionId,
              carriedDemand: outcome.proposalPayload.warDemand,
            })
          : null;
        const nextSettlement = applyFactionPayloadEffect(entry.settlement, outcome, state, { now, tick });
        if (nextSettlement !== entry.settlement) {
          settlementUpdates.set(sid, { ...entry, settlement: nextSettlement });
          // WR-5 H/D — an approved government transfer and an organic ladder
          // succession converge on the ladder's one bounded transition writer.
          // The old governing court is still required to recover the organizing
          // grievance above; after transfer, the same ladder resolves the new seat.
          if (outcome.proposalPayload.kind === 'government_change' && warRulingsLit) {
            // transferRulingPower preserves the governing body while changing
            // the authority behind it. An id-backed ladder resolves that same
            // seat directly; a legacy name-keyed ladder cannot follow the body
            // rename, so the known pre-transfer holder remains the truthful
            // seat instead of becoming a fabricated vacancy.
            const toRulerId = rulingSeatNidOf(ladderRecord, nextSettlement) || fromRulerId;
            const governingFaction = governingFactionOf(nextSettlement);
            const governingFactionId = String(governingFaction?.id || installerFactionId || '');
            const governingFactionName = governingFaction ? nameOf(governingFaction) : '';
            const seatTransition = {
              id: `applied:${String(outcome.id || '')}`,
              fromRulerId,
              toRulerId,
              cause: 'government_change',
              tick: Number.isFinite(Number(tick)) ? Number(tick) : 0,
              authorityEpoch: authorityTransferEpochFor(nextSettlement),
              ...(installerFactionId ? { installerFactionId } : {}),
              ...(outcome.metadata?.factionName
                ? { installerFactionName: String(outcome.metadata.factionName) }
                : {}),
              ...(governingFactionId ? { governingFactionId } : {}),
              ...(governingFactionName ? { governingFactionName } : {}),
              ...(inheritedWarDemand ? { warDemand: inheritedWarDemand } : {}),
            };
            const beforeTransition = state;
            state = appendNpcLadderSeatTransition(state, sid, seatTransition);
            if (state !== beforeTransition) {
              newsEntries.push(...warRulingNewsEntries({
                evidence: governmentTransitionRulingEvidence({
                  transition: seatTransition,
                  outcome,
                }),
                snapshot,
                now,
              }));
            }
          }
        }
      }
    }
    if (outcome.type === 'stressor' && outcome.stressor) {
      const byId = new Map((state.stressors || []).map((/** @type {any} */ stressor) => [stressor.id, stressor]));
      // Birth time is sacred: escalation/spread re-upserts the same record,
      // so the FIRST createdAt wins (the crisis was born once) while
      // updatedAt moves with every touch.
      const prior = byId.get(outcome.stressor.id);
      // Force the commutative field-merge when an earlier outcome in THIS pass
      // already wrote this id: a pre-tick record's createdAt !== now, so without
      // this flag the second collision would last-write-win, dropping the first
      // write's spread targets / reverting its severity.
      const merged = mergeStressorUpsert(prior, outcome.stressor, now, stressorWrittenThisPass.has(outcome.stressor.id), tick);
      stressorWrittenThisPass.add(outcome.stressor.id);
      byId.set(outcome.stressor.id, merged);
      state = { ...state, stressors: [...byId.values()] };
      // A betrayal's birth seeds the traitor its variant implies (one corrupt
      // NPC, gated on an existing corruptible flaw — no flaw, no traitor).
      if (outcome.stressor.type === 'betrayal'
          && String(outcome.candidateType || '').startsWith('stressor_birth')
          && outcome.stressor.originContext) {
        state = seedBetrayalTraitor({
          state,
          settlementUpdates,
          saveId: outcome.targetSaveId,
          originContext: outcome.stressor.originContext,
        });
      }
    }
    autoApplied.push(outcome);
    // FEED curation only: autoApplied above records every applied outcome.
    // Pulse history then partitions public selections from bounded mechanical
    // and consequence receipts; record mode changes visibility, not mechanics.
    const appliedEntry = newsEntryForOutcome(outcome, tick, 'applied');
    if (stateOnly) {
      if (!isDriftOnlyOutcome(outcome)
          || !isMetronomeRepeat(
            appliedEntry,
            [...feed.entries, ...priorHiddenRumorSeeds, ...newsEntries, ...rumorSeedEntries],
            tick,
          )) {
        rumorSeedEntries.push({ ...appliedEntry, recordMode: 'state_only' });
      }
    } else {
      if (!isDriftOnlyOutcome(outcome)
          || !isMetronomeRepeat(appliedEntry, [...feed.entries, ...newsEntries], tick)) {
        newsEntries.push(appliedEntry);
      }
    }
  }

  // Ghost applied impacts: a materialized regional condition expires locally
  // (time progression drops it), but the impact row stayed 'applied' forever —
  // map markers, inbox Resolve buttons, and the feed kept asserting pressure
  // that no longer exists. Now that this tick's settlement updates are final,
  // an 'applied' impact whose TARGET is in this pulse and whose condition is
  // gone flips to 'resolved' (the derivation below emits the resolved entry,
  // so the DM reads the pressure easing instead of resolving a ghost).
  // Targets absent from this pulse's saves are left alone — absence from the
  // pulse is not evidence of expiry. Pulse-only: party/proposal injections
  // pass advanceRegionalImpacts:false and never reconcile.
  if (shouldAdvanceRegionalImpacts) {
    const beforeReconcile = graph;
    for (const impact of beforeReconcile.queuedImpacts) {
      if (impact.status !== 'applied') continue;
      const entry = settlementUpdates.get(String(impact.targetSettlementId));
      if (!entry?.settlement) continue;
      const conditionId = impact.conditionId || legacyRegionalConditionId(impact);
      const conditions = Array.isArray(entry.settlement.activeConditions) ? entry.settlement.activeConditions : [];
      if (conditions.some((/** @type {any} */ condition) => condition?.id === conditionId)) continue;
      // `now` threads through to updatedAt too, not just resolvedAt — replay
      // stamps no wall-clock time anywhere on the reconciled row.
      graph = setRegionalImpactStatus(graph, impact.id, 'resolved', { resolvedAt: now }, { now });
    }
    if (graph !== beforeReconcile) {
      newsEntries.push(...deriveWizardNewsEntriesFromGraphChange(beforeReconcile, graph, { tick, createdAt: now }));
    }
  }

  feed = appendWizardNewsEntries(feed, newsEntries, { now });
  state = refreshRelationshipMemory(state, graph, snapshot, { currentTick: tick });

  // SPATIAL: fold the arrival queue back onto worldState — PRESENT only under the
  // marker while impacts are in transit, DROPPED (dormant / byte-identical) when
  // empty or on the aspatial path. ensureWorldState's conditional-ledger pass then
  // clones it like every other conditional key.
  if (spatialDigest) {
    const nextArrivals = spatialArrivals && Object.keys(spatialArrivals).length ? spatialArrivals : null;
    if (nextArrivals) {
      state = setSpatialLedger(state, 'spatialArrivals', nextArrivals);
    } else {
      state = dropSpatialLedger(state, 'spatialArrivals');
    }
  }

  return {
    worldState: state,
    regionalGraph: graph,
    wizardNews: feed,
    settlementUpdates: [...settlementUpdates.values()],
    autoApplied,
    proposals,
    newsEntries,
    ...(lapsedOutcomeIds.length ? { lapsedOutcomeIds } : {}),
    ...(rumorSeedEntries.length ? { rumorSeedEntries } : {}),
  };
}

/**
 * @param {Object} [args]
 * @param {any} [args.campaign]
 * @param {any[]} [args.saves]
 * @param {string} [args.proposalId]
 * @param {string} [args.now]
 * @param {string|null} [args.adjudicatedBy] FULL AUTO-RESOLVE provenance (realm
 *   directive 7 / J-D7, worldPulse/autoAdjudication.js). A ruling rendered by the
 *   ENGINE — because the DM's auto-resolve toggle said the realm rules on its own —
 *   stamps `adjudicatedBy` onto the proposal ROW's terminal status transition, so a
 *   retrospective read of the docket can always answer "who ruled this?". The DM's
 *   own hand-Apply passes NOTHING: the ABSENCE of the key is the DM's signature and
 *   the pre-existing row shape, so this whole parameter is byte-neutral when unused
 *   (`null` ⇒ every patch below spreads an empty object). Additive + absent-tolerant:
 *   a legacy row simply lacks the key, and no migration is owed.
 */
export function applyWorldPulseProposal({ campaign, saves = [], proposalId, now = wallClockNow(), adjudicatedBy = null } = {}) {
  const proposal = (campaign?.worldState?.proposals || []).find((/** @type {any} */ item) => item.id === proposalId);
  if (!proposal || proposal.status !== 'pending') return null;
  // A pre-v4 proposal can be approved before the next pulse gets a chance to
  // reconcile it. Fail closed at the final apply mouth: retain the durable row
  // as a superseded tombstone, but apply no stale state and publish no headline.
  if (proposalRequiresRecordModeSupersession(proposal)) {
    const tick = campaign?.worldState?.tick || proposal.tick || 0;
    const reconciled = reconcileSupersededProposalNews(
      updateProposalStatus(campaign.worldState, proposalId, 'superseded', {
        supersededAt: now,
        supersededAtTick: tick,
        supersessionReason: 'record_mode_upgrade_apply_guard',
        updatedAt: now, ...(adjudicatedBy ? { adjudicatedBy } : {}),
      }),
      campaign?.wizardNews,
    );
    return {
      worldState: reconciled.worldState,
      regionalGraph: ensureRegionalGraph(campaign?.regionalGraph, { now }),
      wizardNews: reconciled.wizardNews,
      settlementUpdates: [],
      autoApplied: [],
      proposals: [],
      newsEntries: [],
      proposalDisposition: 'superseded',
    };
  }
  // The deterministic resolver (Stage 2): the stored outcome, applyMode forced to
  // 'auto', no fresh RNG draw. Auto-resolving is byte-identical to this manual
  // Apply path because both route the SAME resolved outcome through
  // applyWorldPulseOutcomes.
  const outcome = resolveProposalToOutcome(proposal.outcome);
  const settlementMap = new Map((saves || []).map(save => [String(save.id || save.settlement?.id), { saveId: String(save.id || save.settlement?.id), save, settlement: save.settlement || save }]));
  const adjudicationGraph = ensureRegionalGraph(campaign?.regionalGraph, { now });
  // Manual approval must read the same causal/system/active-condition snapshot
  // as an organic pulse. The former hand-built three-field items silently erased
  // pressure evidence and could make the same target court refuse manually after
  // accepting in autoresolve.
  const snapshot = buildWorldSnapshot({
    campaign: {
      ...campaign,
      settlementIds: [...settlementMap.keys()],
      regionalGraph: adjudicationGraph,
      worldState: campaign.worldState,
    },
    // The proposal queue already scopes these saves as campaign participants;
    // preserve that historical behavior while using the canonical derivation.
    saves: (saves || []).map((save) => ({ ...save, phase: 'canon' })),
    worldState: campaign.worldState,
    regionalGraph: adjudicationGraph,
  });
  const result = applyWorldPulseOutcomes({
    snapshot,
    // Keep the docket pending until the live-world applicator returns a terminal
    // disposition. Pre-stamping `appliedAt` made a lapsed offer claim both
    // "applied" and "superseded" in the same durable row.
    worldState: campaign.worldState,
    regionalGraph: campaign.regionalGraph,
    wizardNews: campaign.wizardNews,
    settlementMap,
    outcomes: [outcome],
    tick: campaign.worldState?.tick || proposal.tick || 0,
    now,
    advanceNewsTick: false,
    advanceRegionalImpacts: false,
    simulationRules: campaign.worldState?.simulationRules,
  });
  if (Array.isArray(result.lapsedOutcomeIds)
    && result.lapsedOutcomeIds.includes(String(outcome.id || ''))) {
    const tick = campaign.worldState?.tick || proposal.tick || 0;
    // A lapsed bilateral question is a docket transition only. The generic
    // applicator performs end-of-pass maintenance even when its sole outcome
    // fails closed (notably relationship-memory refresh), so never use that
    // speculative world as the tombstone base. Otherwise clicking a stale
    // offer could materialize relationship posture/scalars without applying
    // the offer, and the superseded store lane intentionally has no undo entry.
    const reconciled = reconcileSupersededProposalNews(
      updateProposalStatus(campaign.worldState, proposalId, 'superseded', {
        supersededAt: now,
        supersededAtTick: tick,
        supersessionReason: 'bilateral_peace_lapsed',
        updatedAt: now,
        ...(adjudicatedBy ? { adjudicatedBy } : {}),
      }),
      campaign.wizardNews,
    );
    return {
      ...result,
      worldState: reconciled.worldState,
      regionalGraph: adjudicationGraph,
      wizardNews: reconciled.wizardNews,
      settlementUpdates: [],
      autoApplied: [],
      proposals: [],
      newsEntries: [],
      proposalDisposition: 'superseded',
    };
  }
  // W-COMPOSER-2 lapse honesty: a realm-verb order whose gates refused at apply is stamped 'refused'
  // (visible in the queue's history), never 'applied' — the §10 phantom-hole law at the proposal
  // mouth. Organic outcomes are untouched. correctness-4: the SAME provenance writer the organic tick
  // uses now records the decree's cause-edges too (flag-gated in recordProposalProvenance ⇒ byte-
  // identical when dark), so a DM-approved decree leaves a recorded-causality entry, not only pulses.
  const wasRefused = Array.isArray(result.newsEntries) && result.newsEntries.some((/** @type {NonNullable<SimSettlement['config']>} */ n) => n && n.impactKind === 'realm_verb_refused');
  result.worldState = recordProposalProvenance(updateProposalStatus(result.worldState, proposalId, wasRefused ? 'refused' : 'applied', { appliedAt: now, updatedAt: now, ...(adjudicatedBy ? { adjudicatedBy } : {}) }), result, campaign.worldState?.tick || proposal.tick || 0);
  return result;
}

/**
 * W-COMPOSER-2 — mint a DM realm-verb order as a PENDING PROPOSAL through the
 * EXACT sim mint lane (the applyMode:'proposal' arm of applyWorldPulseOutcomes:
 * proposalIdFor + upsertProposal + the proposal news entry), so a DM-minted
 * realm proposal is record-identical to a sim-minted one. Approval then rides
 * the standing applyWorldPulseProposal → the realm verb arm. Dedup: one
 * pending order per (candidateType, acting settlement) — the M10a
 * pendingActorMajorFor guard.
 * @param {Object} [io]
 * @param {SimSettlement['config']} [io.campaign] @param {NonNullable<SimSettlement['config']>[]} [io.saves]
 * @param {string} [io.verb] @param {NonNullable<SimSettlement['config']>} [io.args]
 * @param {string} [io.now]
 * @returns {{ ok: true, result: NonNullable<SimSettlement['config']>, proposalId: string|null }
 *         | { ok: false, code: string, prose: string }}
 */
export function mintRealmVerbProposal({ campaign, saves = [], verb = '', args = {}, now = wallClockNow() } = {}) {
  const worldState = campaign?.worldState || {};
  const tick = worldState.tick || 0;
  const settlementMap = new Map((saves || []).map(save => [String(save.id || save.settlement?.id), { saveId: String(save.id || save.settlement?.id), save, settlement: save.settlement || save }]));
  const snapshot = {
    campaign,
    regionalGraph: ensureRegionalGraph(campaign?.regionalGraph, { now }),
    settlements: [...settlementMap.values()].map(item => ({ id: item.saveId, settlement: item.settlement, name: item.settlement?.name || item.save?.name || item.saveId })),
  };
  const built = buildRealmVerbOutcome({ verb, args, worldState, snapshot, tick });
  if (built.ok !== true) return built;
  // BOUNDED BY CONSTRUCTION (LAW 1): the DM mint refuses when the verb's own
  // manifest predicate refuses — the composer never queues a knowably-doomed
  // order. (The mover RE-MINTS bypass this — the mover's own gates already ran.)
  const gate = built.predicate;
  if (gate && !gate.available) {
    return { ok: false, code: 'predicate_refused', prose: gate.reasons.join(' ') || 'The order is not available in the current world.' };
  }
  if (pendingActorMajorFor(worldState, built.outcome.candidateType, built.outcome.targetSaveId)) {
    return { ok: false, code: 'order_already_pending', prose: 'An identical order already awaits your word in the proposals queue.' };
  }
  const result = applyWorldPulseOutcomes({
    snapshot,
    worldState,
    regionalGraph: campaign?.regionalGraph,
    wizardNews: campaign?.wizardNews,
    settlementMap,
    outcomes: [built.outcome],
    tick,
    now,
    advanceNewsTick: false,
    advanceRegionalImpacts: false,
    simulationRules: worldState.simulationRules,
  });
  return { ok: true, result, proposalId: result.proposals[0]?.id || null };
}
