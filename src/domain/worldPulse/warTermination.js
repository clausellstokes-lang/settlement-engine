/**
 * warTermination.js — WR-1's pure, attacker-side war-termination read.
 *
 * A deployment is the engine's durable war record.  This leaf re-reads each
 * surviving deployment exactly once, in codepoint order, and publishes two
 * deliberately different surfaces:
 *
 *   - `receipts`: a persistence-safe explanation made only of ids, closed bands,
 *     closed reason types, authored prose, and the campaign tick;
 *   - `byAttacker`: the same explanation plus one ephemeral `suePressure01`
 *     control value for the strategy chooser.
 *
 * It owns no state and performs no roll.  In particular, it never discovers a
 * war from a `war_front` graph channel: the deployment ledger is the sole census.
 */

import { clamp01 } from '../../kernel/math.js';
import { stablePart } from './stablePart.js';
import { buildPressureSummary, settlementStrength } from './relationshipEvolution.js';
import { aggregateReasons01, topReasons, warReasonFactor, warReasonsFor, REASON_TUNING } from './warReasons.js';
import {
  PEACE_REASON_TYPES,
  WAR_REASON_TYPES,
  isWarReasonType,
} from './warReasonTaxonomy.js';
import { patronRefOf } from './sacredClaim.js';
import {
  buildPatronCounterforceIndex,
  patronCounterforceFor,
} from './patronCounterforce.js';
import { liveStrengthContradictsOpportunism } from './opportunism.js';
import {
  believedAdvantage,
  resolveVictor,
  termBudgetFor,
} from './peaceTerms.js';
import {
  compareWarCostTrajectoryTruth,
  evaluateWarCostTrajectory,
  priorWarCostReceipt,
  readWarHomeFront,
  warCostBalanceBand,
} from './warCosts.js';
import {
  cliffStockFor,
  climbDownConsequence,
  commitmentStockOf,
  courseKeyOf,
  entityThreshold,
  momentumActive,
  pastCliff,
} from './momentum.js';
import { WAR_TERMINATION_DECIDING_TERM_KEYS } from '../certification/warConvergenceContract.js';
import { deityPressureOf, thresholdFactorOf } from './dispositionProfile.js';
import { readWarSeatBooks } from './warSeatBooks.js';
import { corruptionVerdictIdFor } from './warAuthorityVerdict.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {number} */
function finite01(value) {
  const number = Number(value);
  return Number.isFinite(number) ? clamp01(number) : 0;
}

/** @param {unknown} value @returns {number} */
function wholeTick(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
}

/** Repository-wide deterministic order without locale-dependent collation. @param {string} a @param {string} b @returns {number} */
function codepointCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Every shipped cause has an explicit dissolution read.  Most are state-derived:
 * their absence from the current directed reason fold is their death condition.
 * The two exceptions add the amendments' stronger, named tests.
 */
export const WAR_CAUSE_DISSOLUTION = Object.freeze({
  grievance: 'live_reason_absent',
  revanchism: 'live_reason_absent',
  resource_pressure: 'live_reason_absent',
  treaty_default: 'live_reason_absent',
  encirclement: 'live_reason_absent',
  legitimacy_hunger: 'live_reason_absent',
  corruption_exposed: 'live_reason_absent',
  foreign_clash: 'live_reason_absent',
  fear_of_dominance: 'live_reason_absent',
  ingratitude_debt: 'live_reason_absent',
  dependency_by_design: 'live_reason_absent',
  opportunism: 'weakness_or_patron_changed',
  sacred_claim: 'patron_anchor_changed',
  lineage_claim: 'lineage_edge_or_living_child_changed',
});

/** Closed reader-language clauses for a casus that no longer survives its live read. @type {Readonly<Record<string, string>>} */
const DISSOLVED_CAUSE_PROSE = Object.freeze({
  grievance: 'the court no longer recognizes the grievance that raised its banners',
  revanchism: 'the lost-land claim no longer commands the court',
  resource_pressure: 'the quarrel over scarce stores no longer commands the court',
  treaty_default: 'the broken-pact charge no longer commands the court',
  encirclement: 'the fear of encirclement no longer commands the court',
  legitimacy_hunger: 'the throne no longer needs a foreign enemy to steady its seat',
  corruption_exposed: 'the demanded reckoning for a rotten court has lost its force',
  foreign_clash: 'the proxy quarrel no longer commands the court',
  fear_of_dominance: 'the feared rival no longer threatens the balance',
  ingratitude_debt: 'the remembered debt of aid no longer binds the court',
  dependency_by_design: 'the market leash that raised the banners has broken',
  opportunism: 'the court no longer sees an undefended prize',
  sacred_claim: 'a god named when the banners rose is no longer worshipped from the same throne',
  lineage_claim: 'the living family edge that raised the banners no longer supports the claim',
});

/** Closed, number-free peace clauses for the WR-1 reader surface. */
const TERMINATION_PEACE_PROSE = Object.freeze({
  exhaustion: 'War-weariness is drawing the court toward a settlement.',
  belief_convergence: 'The rival courts are beginning to read the conflict through the same account.',
  economic_strangulation: 'The war is choking the roads and stores that sustain it.',
  coalition_fracture: 'The coalition is thinning as allies leave the field.',
  mediation: 'A neighbouring court is carrying terms both sides may hear.',
  harvest_pressure: 'The needs of the coming harvest are drawing soldiers back toward their fields.',
  realignment: 'A common danger is turning former enemies toward the same horizon.',
  spheres_understanding: 'The rival sponsors are finding room to step back from the same quarrel.',
  balance_restored: 'The feared imbalance has eased, taking urgency out of the war.',
  debt_forgiven: 'An old debt of aid is being remembered as a gift again.',
  bonds_of_commerce: 'Shared markets bind both courts to a peace neither can cheaply break.',
  hopelessness: 'The court no longer believes victory lies down this road.',
  common_rite: 'A shared rite offers both courts ground on which to stand.',
  kinship_bond: 'The surviving family bond gives both courts a reason to step back.',
});

/** Closed qualitative projection used by every persisted term. */
export const WAR_TERMINATION_BANDS = Object.freeze([
  'quiet',
  'present',
  'pressing',
  'decisive',
]);

/** Named, bounded dials; soak may retune heights without widening the schema. */
export const WAR_TERMINATION_TUNING = Object.freeze({
  PRESENT_AT: 0.2,
  PRESSING_AT: 0.45,
  DECISIVE_AT: 0.7,
  CONTINUE_ECONOMY_W: 0.3,
  CONTINUE_EXHAUSTION_W: 0.4,
  CONTINUE_ATTRITION_W: 0.3,
  STOP_CONCESSION_W: 0.35,
  STOP_FACE_W: 0.25,
  STOP_SUNK_W: 0.4,
  SUE_CAUSE_W: 0.35,
  SUE_CONTINUE_W: 0.65,
  HOLD_STOP_W: 0.55,
  HOLD_MOMENTUM_W: 0.45,
  RIVAL_TRIUMPH_PEACE_W: 0.35,
  /** WR-4: independent degradation can fill only this share of remaining
   * continuation pressure. Duration is already applied once inside warCosts. */
  HOME_FRONT_CONTINUE_W: 0.35,
  /** WR-4: one qualitative movement is narrower than a two-or-more-band move. */
  TRAJECTORY_NARROW_W: 0.16,
  TRAJECTORY_CLEAR_W: 0.3,
  /** WR-5: a genuine new authority breaks only the consumed momentum term. */
  RULER_CHANGE_MOMENTUM_MULT: 0.35,
  DECIDING_MARGIN: 0.08,
});

/**
 * Build the current casus read once per war or strategy pass. Imported and stale
 * ledgers may predate WR-1, so a lit consumer must re-check opportunism against the
 * current live host and patron graph before either the willingness factor or the
 * pinned deployment receipt can consume it. Dark reads return the persisted entry
 * verbatim, preserving the legacy result shape and serialization.
 *
 * @param {{ snapshot?: { byId?: Map<string, unknown> } | null,
 *   worldState: Record<string, unknown>, graph?: { edges?: unknown[] } | null,
 *   rules?: Record<string, unknown> | null }} args
 * @returns {(attackerId: unknown, targetId: unknown) => {
 *   entry: import('./warReasons.js').ReasonPairEntry | null,
 *   opportunismCounterforced: boolean }}
 */
export function makeCurrentWarCasusRead({ snapshot, worldState, graph, rules }) {
  const lit = rules?.warLayerEnabled === true && rules?.warTerminationEnabled === true;
  const patronIndex = lit ? buildPatronCounterforceIndex(graph, worldState) : null;
  /** @type {Map<string, { entry: import('./warReasons.js').ReasonPairEntry | null, opportunismCounterforced: boolean }>} */
  const cache = new Map();
  return (attackerId, targetId) => {
    const key = JSON.stringify([String(attackerId), String(targetId)]);
    const cached = cache.get(key);
    if (cached) return cached;
    const entry = warReasonsFor(worldState, attackerId, targetId);
    if (!lit || !entry?.reasons?.opportunism) {
      const read = { entry, opportunismCounterforced: false };
      cache.set(key, read);
      return read;
    }
    const attackerItem = snapshot?.byId?.get?.(String(attackerId));
    const targetItem = snapshot?.byId?.get?.(String(targetId));
    if (!patronCounterforceFor(patronIndex, targetId)
      && !liveStrengthContradictsOpportunism(
        /** @type {Parameters<typeof liveStrengthContradictsOpportunism>[0]} */ (attackerItem),
        /** @type {Parameters<typeof liveStrengthContradictsOpportunism>[1]} */ (targetItem),
      )) {
      const read = { entry, opportunismCounterforced: false };
      cache.set(key, read);
      return read;
    }
    const read = {
      entry: {
        ...entry,
        reasons: Object.fromEntries(Object.entries(entry.reasons)
          .filter(([type]) => type !== 'opportunism')),
      },
      opportunismCounterforced: true,
    };
    cache.set(key, read);
    return read;
  };
}

/** Recompute the bounded war factor from a counterforce-filtered opener read while
 * preserving treaty legality and the exact legacy arithmetic when no veto fired.
 * @param {Record<string, unknown>} worldState @param {unknown} attackerId
 * @param {unknown} targetId
 * @param {{ entry: import('./warReasons.js').ReasonPairEntry | null, opportunismCounterforced: boolean }} read
 * @param {number|null} [tick] @returns {number} */
export function warFactorForCasusRead(worldState, attackerId, targetId, read, tick = null) {
  const legacy = warReasonFactor(worldState, attackerId, targetId, tick);
  if (legacy === 0 || !read?.opportunismCounterforced) return legacy;
  const aggregate = aggregateReasons01(read.entry);
  return aggregate > 0 ? 1 + REASON_TUNING.WAR_FACTOR_W * aggregate : 1;
}

/** Project the current peace case through a closed authored vocabulary. Stored
 * reason receipts may legitimately carry counts; the reader-facing termination
 * card may not. @param {import('./warReasons.js').ReasonPairEntry | null} entry */
export function terminationPeaceReasonLines(entry) {
  return topReasons(entry, 3)
    .map((reason) => TERMINATION_PEACE_PROSE[/** @type {keyof typeof TERMINATION_PEACE_PROSE} */ (reason.type)])
    .filter(Boolean);
}

/** @param {number} value @returns {'quiet'|'present'|'pressing'|'decisive'} */
export function warTerminationBand(value) {
  const score = finite01(value);
  if (score >= WAR_TERMINATION_TUNING.DECISIVE_AT) return 'decisive';
  if (score >= WAR_TERMINATION_TUNING.PRESSING_AT) return 'pressing';
  if (score >= WAR_TERMINATION_TUNING.PRESENT_AT) return 'present';
  return 'quiet';
}

/**
 * Pin the opening casus without changing the legacy/dark record shape.
 *
 * @param {{
 *   reasons?: unknown[], tick?: unknown,
 *   attackerItem?: unknown, defenderItem?: unknown,
 *   simulationRules?: Record<string, unknown> | null,
 * }} args
 * @returns {{
 *   casusReasons: Array<{type:string, score:number, receipt:string, atTick?:number}>,
 *   sacredAnchors: {attackerPatronRef?:string, defenderPatronRef?:string},
 * }}
 */
export function pinDeploymentCasusReasons({
  reasons = [],
  tick = 0,
  attackerItem = null,
  defenderItem = null,
  simulationRules = null,
} = {}) {
  const source = Array.isArray(reasons) ? reasons : [];
  const legacy = source.map((raw) => {
    const reason = asObject(raw);
    return {
      type: String(reason.type || ''),
      score: Number(reason.score) || 0,
      receipt: String(reason.receipt || ''),
    };
  });
  const rules = asObject(simulationRules);
  const lit = rules.warLayerEnabled === true && rules.warTerminationEnabled === true;
  if (!lit) return { casusReasons: legacy, sacredAnchors: {} };

  const atTick = wholeTick(tick);
  const casusReasons = legacy
    .filter((reason) => isWarReasonType(reason.type))
    .map((reason) => ({ ...reason, score: finite01(reason.score), atTick }));
  const hasSacredClaim = casusReasons.some((reason) => reason.type === 'sacred_claim');
  if (!hasSacredClaim) return { casusReasons, sacredAnchors: {} };

  const attackerPatronRef = patronRefOf(/** @type {Parameters<typeof patronRefOf>[0]} */ (attackerItem));
  const defenderPatronRef = patronRefOf(/** @type {Parameters<typeof patronRefOf>[0]} */ (defenderItem));
  return {
    casusReasons,
    sacredAnchors: {
      ...(attackerPatronRef ? { attackerPatronRef } : {}),
      ...(defenderPatronRef ? { defenderPatronRef } : {}),
    },
  };
}

/** @param {unknown} item @param {string} fallback */
function settlementName(item, fallback) {
  const row = asObject(item);
  const settlement = asObject(row.settlement);
  const name = String(row.name || settlement.name || '').trim();
  return name || fallback;
}

/** Attrition already paid by the deployed force, never deployment age. @param {unknown} deployment @returns {number} */
function currentAttrition01(deployment) {
  const record = asObject(deployment);
  const start = Number(record.maxStartStrength);
  const current = Number(record.currentEffectiveStrength);
  if (!Number.isFinite(start) || start <= 0 || !Number.isFinite(current)) return 0;
  return clamp01(1 - Math.max(0, current) / start);
}

/**
 * @param {Record<string, unknown>} deployment
 * @param {Record<string, unknown> | null} liveReasons
 * @param {ReturnType<typeof buildPatronCounterforceIndex>} patronIndex
 * @param {unknown} attackerItem
 * @param {unknown} defenderItem
 * @param {string} targetId
 */
function readFoundingCauses(deployment, liveReasons, patronIndex, attackerItem, defenderItem, targetId) {
  const pins = Array.isArray(deployment.casusReasons) ? deployment.casusReasons : [];
  /** @type {string[]} */
  const dissolvedCauseTypes = [];
  /** @type {number[]} */
  const liveScores = [];
  let anchorUnavailable = pins.length === 0;

  for (const rawPin of pins) {
    const pin = asObject(rawPin);
    const type = String(pin.type || '');
    if (!isWarReasonType(type)) continue;
    const current = asObject(liveReasons?.[type]);
    if (!Object.keys(current).length || finite01(current.score) <= 0) {
      dissolvedCauseTypes.push(type);
      continue;
    }

    if (type === 'opportunism' && (
      patronCounterforceFor(patronIndex, targetId)
      || liveStrengthContradictsOpportunism(
        /** @type {Parameters<typeof liveStrengthContradictsOpportunism>[0]} */ (attackerItem),
        /** @type {Parameters<typeof liveStrengthContradictsOpportunism>[1]} */ (defenderItem),
      )
    )) {
      dissolvedCauseTypes.push(type);
      continue;
    }

    if (type === 'sacred_claim') {
      const pinnedAttacker = String(deployment.attackerPatronRef || '');
      const pinnedDefender = String(deployment.defenderPatronRef || '');
      if (!pinnedAttacker || !pinnedDefender) {
        // A legacy record may predate the anchors.  Keep the live reason neutral:
        // missing history is not evidence that a god was unseated.
        anchorUnavailable = true;
      } else {
        const currentAttacker = patronRefOf(/** @type {Parameters<typeof patronRefOf>[0]} */ (attackerItem));
        const currentDefender = patronRefOf(/** @type {Parameters<typeof patronRefOf>[0]} */ (defenderItem));
        if (currentAttacker !== pinnedAttacker || currentDefender !== pinnedDefender) {
          dissolvedCauseTypes.push(type);
          continue;
        }
      }
    }

    liveScores.push(finite01(current.score));
  }

  dissolvedCauseTypes.sort(codepointCompare);
  const cause01 = clamp01(liveScores.reduce((sum, score) => sum + score, 0)
    / Math.max(0.0001, Number(REASON_TUNING.AGGREGATE_SATURATION) || 1));
  const validPins = pins.filter((pin) => isWarReasonType(asObject(pin).type)).length;
  const causeState = validPins === 0
    ? 'anchor_unavailable'
    : dissolvedCauseTypes.length === validPins
      ? 'dissolved'
      : anchorUnavailable
        ? 'anchor_unavailable'
        : 'live';
  return { cause01, causeState, dissolvedCauseTypes, validPins };
}

/** Select by value, then the canonical WR-9 term order on a tie. @param {Record<string, unknown>} terms @returns {string} */
function decidingTermOf(terms) {
  let decidingTerm = WAR_TERMINATION_DECIDING_TERM_KEYS[0];
  let decidingValue = finite01(terms[decidingTerm]);
  for (const key of WAR_TERMINATION_DECIDING_TERM_KEYS.slice(1)) {
    const value = finite01(terms[key]);
    if (value > decidingValue + WAR_TERMINATION_TUNING.DECIDING_MARGIN) {
      decidingTerm = key;
      decidingValue = value;
    }
  }
  return decidingTerm;
}

/** Combine independent bounded pressure without double-counting the full base. */
function addPressure01(base, pressure) {
  const current = finite01(base);
  return clamp01(current + (1 - current) * finite01(pressure));
}

/** @param {unknown} marginBand @returns {number} */
function trajectoryPressure01(marginBand) {
  if (marginBand === 'clear') return WAR_TERMINATION_TUNING.TRAJECTORY_CLEAR_W;
  if (marginBand === 'narrow') return WAR_TERMINATION_TUNING.TRAJECTORY_NARROW_W;
  return 0;
}

/** Weighted ruler/realm objective blend without adding a fifth term. */
function blendBooksTerm(realmTerm, privateTerm, books) {
  const realmWeight = finite01(books.settlementWeight01);
  const privateWeight = clamp01(
    finite01(books.seatWeight01) + finite01(books.patronWeight01),
  );
  const total = realmWeight + privateWeight;
  if (!(total > 0)) return finite01(realmTerm);
  return clamp01(
    (finite01(realmTerm) * realmWeight + finite01(privateTerm) * privateWeight) / total,
  );
}

/** Qualitative private-books line for the decision receipt. */
function seatBooksReason(books, actorName, contributed, momentumBroken) {
  const seat = String(books.rulerName || '');
  const patron = String(books.patronName || '');
  let line;
  if (books.interestKind === 'patron') {
    line = patron
      ? `The court's private account answers to ${patron}, not only to ${actorName}.`
      : `The court's private account answers to a foreign patron whose seat cannot be named from this record.`;
  } else if (seat) {
    line = contributed
      ? `${seat}'s own hold on the seat changes how ${actorName} weighs the war.`
      : `${seat}'s own account and ${actorName}'s position point the same way.`;
  } else {
    line = `No living ruler is established in the record, so ${actorName}'s position alone carries the books.`;
  }
  return momentumBroken
    ? `${line} A new legitimate authority has broken the old court's momentum.`
    : line;
}

/** Authored decision sentence; raw scores, multipliers, and engine tokens stay out.
 * @param {{attackerName:string, decidingTerm:string, causeState:string,
 *   dissolvedCauseTypes:string[], trajectory?:string, homeFrontBand?:string,
 *   trajectoryContributed?:boolean,homeFrontContributed?:boolean}} args
 * @returns {string} */
function terminationReason({
  attackerName,
  decidingTerm,
  causeState,
  dissolvedCauseTypes,
  trajectory = 'even',
  homeFrontBand = 'quiet',
  trajectoryContributed = false,
  homeFrontContributed = false,
}) {
  const subject = `${attackerName}'s council`;
  const dissolvedCase = dissolvedCauseTypes.map((type) => DISSOLVED_CAUSE_PROSE[type]).filter(Boolean).join('; ');
  if (causeState === 'dissolved' && decidingTerm === 'cost_to_stop') {
    return `The war has outlived its reason: ${dissolvedCase}. Still, ${subject} holds because peace would exact the heavier price.`;
  }
  if (causeState === 'dissolved' && decidingTerm === 'momentum') {
    return `The war has outlived its reason: ${dissolvedCase}. Still, public commitment keeps ${attackerName}'s banners in the field.`;
  }
  if (causeState === 'dissolved') {
    return `The war has outlived its reason: ${dissolvedCase}. The strain of fighting now presses ${subject} toward peace.`;
  }
  if (dissolvedCauseTypes.length > 0) {
    return `Part of the founding case has fallen away: ${dissolvedCase}. ${subject} still weighs the remaining cause against the price of peace.`;
  }
  if (decidingTerm === 'cost_to_continue') {
    const homeFrontPresses = homeFrontContributed
      && (homeFrontBand === 'pressing' || homeFrontBand === 'decisive');
    const trajectoryPresses = trajectoryContributed && trajectory === 'losing';
    if (trajectoryPresses && homeFrontPresses) {
      return `${subject} believes later peace will cost more, while strain behind the army adds to the price of another campaign.`;
    }
    if (trajectoryPresses) {
      return `${subject} believes later peace will cost more than peace now; that worsening expectation adds to the price of continuing.`;
    }
    if (homeFrontPresses) {
      return `The strain behind the army adds to what another campaign would cost ${subject}.`;
    }
    return `The realm can no longer bear the fighting; another campaign is pressing ${subject} toward peace.`;
  }
  if (decidingTerm === 'cost_to_stop') {
    if (trajectoryContributed && trajectory === 'winning') {
      return `${subject} believes later terms will cost less than peace now; that expectation adds to the price of stopping.`;
    }
    return `${subject} believes peace would exact more than another campaign, so the war holds.`;
  }
  if (decidingTerm === 'momentum') {
    return `Public commitment to the war keeps ${attackerName}'s banners in the field despite the court's doubts.`;
  }
  if (causeState === 'anchor_unavailable') {
    return `${subject} can still name a living quarrel, though the war's opening anchors are lost to the record.`;
  }
  return `The founding quarrel still commands ${subject}, and it remains the strongest argument for holding the war.`;
}

/**
 * Read every surviving deployment once.  The optional WR-6 callback supplies an
 * expenditure-derived sunk-cost pressure; until that slice lights, current
 * attrition/exhaustion is the honest fallback.
 *
 * @param {{
 *   worldState?: Record<string, unknown> | null,
 *   snapshot?: { byId?: Map<string, unknown>, regionalGraph?: {edges?:unknown[]} } | null,
 *   pIndex?: unknown,
 *   tick?: unknown,
 *   sunkCostPressureFor?: ((attackerId:string, targetId:string, deployment:Record<string, unknown>) => number) | null,
 * }} args
 * @returns {{
 *   receipts: Array<Record<string, unknown>>,
 *   byAttacker: Map<string, {attackerId:string, targetId:string, suePressure01:number,
 *     dissolvedCauseTypes:string[], decidingTerm:string,
 *     bands:{cause:string, cost_to_continue:string, cost_to_stop:string, momentum:string},
 *     receipt:Record<string, unknown>}>,
 * }}
 */
export function readWarTerminations({
  worldState = null,
  snapshot = null,
  pIndex = null,
  tick = null,
  sunkCostPressureFor = null,
  authorityVerdicts = [],
} = {}) {
  const state = asObject(worldState);
  const rules = asObject(state.simulationRules);
  if (rules.warLayerEnabled !== true || rules.warTerminationEnabled !== true) {
    return { receipts: [], byAttacker: new Map() };
  }

  const deployments = asObject(state.deployments);
  const byId = snapshot?.byId instanceof Map ? snapshot.byId : new Map();
  const now = wholeTick(tick ?? state.tick);
  const patronIndex = buildPatronCounterforceIndex(snapshot?.regionalGraph, state);
  /** @type {Array<Record<string, unknown>>} */
  const receipts = [];
  /** @type {Map<string, {attackerId:string, targetId:string, suePressure01:number,
   *   dissolvedCauseTypes:string[], decidingTerm:string,
   *   bands:{cause:string, cost_to_continue:string, cost_to_stop:string, momentum:string},
   *   receipt:Record<string, unknown>}>} */
  const byAttacker = new Map();

  for (const attackerId of Object.keys(deployments).sort(codepointCompare)) {
    const deployment = asObject(deployments[attackerId]);
    const targetId = deployment.targetId != null ? String(deployment.targetId) : '';
    if (!attackerId || !targetId || attackerId === targetId) continue;

    const attackerItem = byId.get(attackerId) || null;
    const defenderItem = byId.get(targetId) || null;
    const liveEntry = warReasonsFor(state, attackerId, targetId);
    const liveReasons = liveEntry ? asObject(liveEntry.reasons) : null;
    const cause = readFoundingCauses(
      deployment,
      liveReasons,
      patronIndex,
      attackerItem,
      defenderItem,
      targetId,
    );

    const pressures = buildPressureSummary(pIndex, attackerId);
    const economy01 = Math.max(finite01(pressures.economy), finite01(pressures.trade));
    const exhaustion01 = finite01(asObject(state.warExhaustion)[attackerId]);
    const attrition01 = currentAttrition01(deployment);
    const T = WAR_TERMINATION_TUNING;
    const baseContinue01 = clamp01(
      economy01 * T.CONTINUE_ECONOMY_W
      + exhaustion01 * T.CONTINUE_EXHAUSTION_W
      + attrition01 * T.CONTINUE_ATTRITION_W,
    );

    const strengthFor = (/** @type {unknown} */ id) => {
      const item = byId.get(String(id));
      return item ? settlementStrength(item, buildPressureSummary(pIndex, id)) : 0;
    };
    const victor = resolveVictor(attackerId, targetId, state, strengthFor);
    const currentBelievedBand = warCostBalanceBand(
      believedAdvantage(attackerId, targetId, state, strengthFor),
    );
    const currentTruthBand = warCostBalanceBand(
      strengthFor(attackerId) - strengthFor(targetId),
    );
    const opponentBelievedBalanceBand = warCostBalanceBand(
      believedAdvantage(targetId, attackerId, state, strengthFor),
    );
    const opponentTruthBalanceBand = warCostBalanceBand(
      strengthFor(targetId) - strengthFor(attackerId),
    );
    const deploymentSinceTick = typeof deployment.sinceTick === 'number'
      && Number.isFinite(deployment.sinceTick)
      ? deployment.sinceTick
      // A malformed imported deployment may not borrow an older war's read.
      : now;
    const priorWarCost = priorWarCostReceipt(
      state,
      attackerId,
      targetId,
      now,
      deploymentSinceTick,
    );
    const trajectoryRead = evaluateWarCostTrajectory({
      priorBelievedBand: priorWarCost?.believedBalanceBand,
      currentBelievedBand,
    });
    const truthDiagnostic = compareWarCostTrajectoryTruth({
      believedTrajectory: trajectoryRead.trajectory,
      priorTruthBand: priorWarCost?.truthBalanceBand,
      currentTruthBand,
    });
    const homeFront = readWarHomeFront({
      actorId: attackerId,
      deployment,
      worldState: state,
      snapshot,
    });
    const books = readWarSeatBooks({
      worldState: state,
      snapshot,
      actorId: attackerId,
      opponentId: targetId,
    });
    // One physical deployment still yields one attacker-centric receipt. Carry
    // the opposite court's authority baseline on that same receipt so the
    // bilateral adapter can later orient the evaluator toward a defender that
    // owns no outbound deployment without inventing a second war record.
    const opponentBooks = readWarSeatBooks({
      worldState: state,
      snapshot,
      actorId: targetId,
      opponentId: attackerId,
    });
    // WR-5 D's composition seam: a semantic authority change not only discounts
    // the old court's momentum; it also retires an opening corruption_exposed
    // quarrel that belonged to the removed authority. The dissolution is carried
    // on the pulse receipt so it remains final for this deployment episode instead
    // of reviving one tick later while the exposure scandal itself decays.
    const priorAuthoritySignature = typeof priorWarCost?.authoritySignature === 'string'
      ? priorWarCost.authoritySignature
      : '';
    const momentumBroken = !!priorAuthoritySignature
      && priorAuthoritySignature !== books.authoritySignature;
    const priorOpponentAuthoritySignature = typeof priorWarCost?.opponentAuthoritySignature === 'string'
      ? priorWarCost.opponentAuthoritySignature
      : '';
    const opponentMomentumBroken = !!priorOpponentAuthoritySignature
      && priorOpponentAuthoritySignature !== opponentBooks.authoritySignature;
    const priorAuthorityDissolutions = Array.isArray(priorWarCost?.authorityDissolvedCauseTypes)
      ? priorWarCost.authorityDissolvedCauseTypes.map(String)
      : [];
    const priorOpponentAuthorityDissolutions = Array.isArray(priorWarCost?.opponentAuthorityDissolvedCauseTypes)
      ? priorWarCost.opponentAuthorityDissolvedCauseTypes.map(String)
      : [];
    const corruptionWasFoundingCause = (Array.isArray(deployment.casusReasons)
      ? deployment.casusReasons
      : []).some((raw) => String(asObject(raw).type || '') === 'corruption_exposed');
    const authorityVerdictId = momentumBroken
      ? corruptionVerdictIdFor(
          state,
          attackerId,
          String(priorWarCost?.rulerId || ''),
          now,
          deploymentSinceTick,
          authorityVerdicts,
        )
      : null;
    const authorityDissolvesCorruption = corruptionWasFoundingCause
      && (!!authorityVerdictId || priorAuthorityDissolutions.includes('corruption_exposed'));
    const effectiveCause = authorityDissolvesCorruption
      ? readFoundingCauses(
          deployment,
          { ...(liveReasons || {}), corruption_exposed: undefined },
          patronIndex,
          attackerItem,
          defenderItem,
          targetId,
        )
      : cause;
    const authorityDissolvedCauseTypes = authorityDissolvesCorruption
      ? ['corruption_exposed']
      : priorAuthorityDissolutions;
    const reverseReasons = asObject(warReasonsFor(state, targetId, attackerId)?.reasons);
    const opponentCorruptionWasFoundingCause = !!reverseReasons.corruption_exposed;
    const opponentAuthorityVerdictId = opponentMomentumBroken
      ? corruptionVerdictIdFor(
          state,
          targetId,
          String(priorWarCost?.opponentRulerId || ''),
          now,
          deploymentSinceTick,
          authorityVerdicts,
        )
      : null;
    const opponentAuthorityDissolvedCauseTypes = opponentCorruptionWasFoundingCause
      && (!!opponentAuthorityVerdictId
        || priorOpponentAuthorityDissolutions.includes('corruption_exposed'))
      ? ['corruption_exposed']
      : priorOpponentAuthorityDissolutions;
    const continueAfterHome = addPressure01(
      baseContinue01,
      homeFront.score01 * T.HOME_FRONT_CONTINUE_W,
    );
    const homeFrontContributed = continueAfterHome > baseContinue01;
    let continue01 = continueAfterHome;
    const trajectoryPressure = trajectoryPressure01(trajectoryRead.trajectoryMarginBand);
    let trajectoryContributed = false;
    if (trajectoryRead.trajectory === 'losing') {
      const beforeTrajectory = continue01;
      continue01 = addPressure01(beforeTrajectory, trajectoryPressure);
      trajectoryContributed = continue01 > beforeTrajectory;
    }
    const concession01 = victor.loserId === attackerId
      ? termBudgetFor(victor.believedMargin).margin01
      : 0;
    const threshold = entityThreshold(
      /** @type {Parameters<typeof entityThreshold>[0]} */ (attackerItem),
      state,
    );
    const face01 = climbDownConsequence({
      actorId: attackerId,
      lawfulness01: threshold.lawfulness01,
      exitKind: '',
    }).price01;
    const fallbackSunk01 = Math.max(attrition01, exhaustion01);
    const injectedSunk = typeof sunkCostPressureFor === 'function'
      ? sunkCostPressureFor(attackerId, targetId, deployment)
      : null;
    const sunk01 = Number.isFinite(Number(injectedSunk))
      ? finite01(injectedSunk)
      : fallbackSunk01;
    let stop01 = clamp01(
      concession01 * T.STOP_CONCESSION_W
      + face01 * T.STOP_FACE_W
      + sunk01 * T.STOP_SUNK_W,
    );
    if (trajectoryRead.trajectory === 'winning') {
      const beforeTrajectory = stop01;
      stop01 = addPressure01(beforeTrajectory, trajectoryPressure);
      trajectoryContributed = stop01 > beforeTrajectory;
    }

    // WR-5 THE TWO BOOKS. The four realm terms stay recognizable; the seat's
    // private (or exact patron's) direction is blended into the matching cost
    // side and, only when a real founding cause exists, whether this ruler still
    // owns that quarrel. No fifth term and no raw ruler stock are introduced.
    const realmCause01 = effectiveCause.cause01;
    const realmContinue01 = continue01;
    const realmStop01 = stop01;
    const rivalTriumphPull = victor.victorId === attackerId
      ? finite01(books.rivalTriumph01) * T.RIVAL_TRIUMPH_PEACE_W
      : 0;
    const decisionBooks = rivalTriumphPull > 0 ? {
      ...books,
      peaceBias01: clamp01(books.peaceBias01 + rivalTriumphPull),
      continueBias01: clamp01(books.continueBias01 - rivalTriumphPull),
    } : books;
    const cause01 = effectiveCause.validPins > 0
      ? blendBooksTerm(realmCause01, decisionBooks.continueBias01, decisionBooks)
      : 0;
    continue01 = blendBooksTerm(realmContinue01, decisionBooks.peaceBias01, decisionBooks);
    stop01 = blendBooksTerm(realmStop01, decisionBooks.continueBias01, decisionBooks);
    const booksContributed = Math.abs(cause01 - realmCause01) > 0.0001
      || Math.abs(continue01 - realmContinue01) > 0.0001
      || Math.abs(stop01 - realmStop01) > 0.0001;

    let momentum01 = 0;
    if (momentumActive(state)) {
      const courseKey = courseKeyOf({ kind: 'war', target: targetId });
      const stock = courseKey ? commitmentStockOf(state, attackerId, courseKey, now) : 0;
      const cliff = cliffStockFor({
        temperament: threshold.temperament,
        legitimacyFragility01: threshold.legitimacyFragility01,
      });
      momentum01 = pastCliff(stock, cliff) ? 1 : clamp01(stock / Math.max(0.0001, cliff));
    }

    // Amendment D's sanctioned counterforce. Only a semantic authority change
    // inside this deployment episode discounts momentum; pure names never enter
    // the signature, and a first observation has nothing to compare.
    if (momentumBroken) {
      momentum01 = clamp01(momentum01 * T.RULER_CHANGE_MOMENTUM_MULT);
    }

    const terms = {
      cause: cause01,
      cost_to_continue: continue01,
      cost_to_stop: stop01,
      momentum: momentum01,
    };
    const decidingTerm = decidingTermOf(terms);
    const bands = {
      cause: warTerminationBand(terms.cause),
      cost_to_continue: warTerminationBand(terms.cost_to_continue),
      cost_to_stop: warTerminationBand(terms.cost_to_stop),
      momentum: warTerminationBand(terms.momentum),
    };

    // A dead cause and an unbearable continuation press toward suit.  The price
    // of stopping and course momentum press toward holding.  The two sides are
    // normalized independently so amendment C's disagreement space stays live.
    const causeExit01 = effectiveCause.validPins > 0 ? clamp01(1 - cause01) : 0;
    const sueDrive = causeExit01 * T.SUE_CAUSE_W + continue01 * T.SUE_CONTINUE_W;
    const holdDrive = stop01 * T.HOLD_STOP_W + momentum01 * T.HOLD_MOMENTUM_W;
    let suePressure01 = clamp01(0.5 + (sueDrive - holdDrive) / 2);
    /** @type {string[]} */
    let dispositionReasons = [];
    if (rules.dispositionChannelsEnabled === true) {
      const entry = asObject(asObject(state.dispositionStats)[attackerId]);
      const martial = thresholdFactorOf(entry, 'martial');
      const diplomatic = thresholdFactorOf(entry, 'diplomatic');
      const insular = thresholdFactorOf(entry, 'insular');
      const deityWar = deityPressureOf(attackerItem, entry);
      // WR-2 is an END-BAR load, not a fifth deciding term. Diplomatic and
      // inward-looking cultures lower the exit bar; martial history and a war
      // domain raise it. The four WR-1 terms, bands, and decidingTerm remain exact.
      const exitBar = diplomatic.factor * insular.factor
        * (2 - martial.factor) * (2 - deityWar.thresholdFactor);
      suePressure01 = clamp01(suePressure01 / Math.max(0.25, exitBar));
      // Absolute-coherence law: the bar shift is visible on the very receipt that
      // carries the score. Transition news is later and conditional; it cannot
      // stand in for the state reads that changed this decision now.
      dispositionReasons = [martial, diplomatic, insular]
        .filter((read) => read.factor !== 1)
        .map((read) => read.receipt);
      if (deityWar.thresholdFactor !== 1 && deityWar.receipt) {
        dispositionReasons.push(deityWar.receipt);
      }
    }
    const attackerName = settlementName(attackerItem, 'The attacking court');
    const booksReason = seatBooksReason(books, attackerName, booksContributed, momentumBroken);
    const booksPublicReason = books.interestKind === 'patron'
      ? `The seat's private account changes how ${attackerName} weighs the war.`
      : booksReason;
    const reason = terminationReason({
      attackerName,
      decidingTerm,
      causeState: effectiveCause.causeState,
      dissolvedCauseTypes: effectiveCause.dissolvedCauseTypes,
      trajectory: trajectoryRead.trajectory,
      homeFrontBand: homeFront.band,
      trajectoryContributed,
      homeFrontContributed,
    });
    const receipt = {
      id: `war-termination.${stablePart(attackerId)}.${stablePart(targetId)}.${now}`,
      kind: 'war_termination_read',
      tick: now,
      attackerId,
      targetId,
      settlementIds: [attackerId, targetId],
      causeBand: bands.cause,
      costToContinueBand: bands.cost_to_continue,
      costToStopBand: bands.cost_to_stop,
      momentumBand: bands.momentum,
      believedBalanceBand: currentBelievedBand,
      truthBalanceBand: currentTruthBand,
      trajectory: trajectoryRead.trajectory,
      ...(trajectoryRead.trajectoryMarginBand
        ? { trajectoryMarginBand: trajectoryRead.trajectoryMarginBand }
        : {}),
      ...(truthDiagnostic.truthTrajectory != null
        ? { truthTrajectory: truthDiagnostic.truthTrajectory }
        : {}),
      trajectoryMisread: truthDiagnostic.misread,
      homeFrontBand: homeFront.band,
      homeFrontDurationBand: homeFront.durationBand,
      homeFrontComponents: homeFront.receiptComponents,
      authoritySignature: books.authoritySignature,
      opponentAuthoritySignature: opponentBooks.authoritySignature,
      opponentBelievedBalanceBand,
      opponentTruthBalanceBand,
      ...(opponentBooks.rulerId ? { opponentRulerId: opponentBooks.rulerId } : {}),
      ...(opponentAuthorityDissolvedCauseTypes.length
        ? { opponentAuthorityDissolvedCauseTypes: [...opponentAuthorityDissolvedCauseTypes] }
        : {}),
      booksInterest: books.interestKind,
      booksDirection: decisionBooks.continueBias01 > decisionBooks.peaceBias01
        ? 'continue'
        : decisionBooks.peaceBias01 > decisionBooks.continueBias01 ? 'peace' : 'even',
      rulerSecurityBand: books.securityBand,
      rulerLawfulnessBand: books.lawfulnessBand,
      rulerMoralityBand: books.moralityBand,
      ...(books.rulerId ? { rulerId: books.rulerId } : {}),
      ...(books.rulerName ? { rulerName: books.rulerName } : {}),
      ...(books.factionId ? { factionId: books.factionId } : {}),
      ...(books.factionName ? { factionName: books.factionName } : {}),
      ...(books.patronId ? { patronId: books.patronId } : {}),
      ...(books.patronName ? { patronName: books.patronName } : {}),
      ...(rivalTriumphPull > 0 ? { rivalTriumphBand: books.rivalTriumphBand } : {}),
      booksReason,
      booksPublicReason,
      momentumBroken,
      ...(authorityVerdictId ? {
        authorityChangeKind: 'corruption_verdict',
        authorityVerdictId,
      } : {}),
      decidingTerm,
      causeState: effectiveCause.causeState,
      ...(effectiveCause.dissolvedCauseTypes.length
        ? { dissolvedCauseTypes: [...effectiveCause.dissolvedCauseTypes] }
        : {}),
      ...(authorityDissolvedCauseTypes.length
        ? { authorityDissolvedCauseTypes: [...authorityDissolvedCauseTypes] }
        : {}),
      reason,
      ...(dispositionReasons.length ? { dispositionReasons } : {}),
    };
    receipts.push(receipt);
    byAttacker.set(attackerId, {
      attackerId,
      targetId,
      suePressure01,
      dissolvedCauseTypes: effectiveCause.dissolvedCauseTypes,
      decidingTerm,
      bands,
      trajectory: trajectoryRead.trajectory,
      trajectoryMarginBand: trajectoryRead.trajectoryMarginBand,
      trajectoryMisread: truthDiagnostic.misread,
      homeFrontBand: homeFront.band,
      books: decisionBooks,
      momentumBroken,
      receipt,
    });
  }

  return { receipts, byAttacker };
}

/**
 * Read the SAME four-term evaluator from either court's side of one live war.
 *
 * Deployments are directed, so the defending court commonly has no outbound
 * deployment row of its own.  G2 still requires that court to decide whether to
 * accept an offer.  Rather than fork the termination arithmetic, this adapter
 * presents the live conflict as a one-row, actor-oriented deployment census and
 * calls `readWarTerminations` itself.  The physical deployment remains the
 * episode anchor (`sinceTick`); the defending side's current live reason fold is
 * used as its cause pins, and no unrecorded attrition or named force is invented.
 *
 * @param {{
 *   worldState?:Record<string, unknown>|null,
 *   snapshot?:{byId?:Map<string, unknown>,settlements?:unknown[],regionalGraph?:{edges?:unknown[]}}|null,
 *   pIndex?:unknown,
 *   tick?:unknown,
 *   actorId:unknown,
 *   opponentId:unknown,
 *   sunkCostPressureFor?:((attackerId:string,targetId:string,deployment:Record<string,unknown>)=>number)|null,
 * }} args
 * @returns {{attackerId:string,targetId:string,suePressure01:number,
 *   dissolvedCauseTypes:string[],decidingTerm:string,
 *   bands:{cause:string,cost_to_continue:string,cost_to_stop:string,momentum:string},
 *   receipt:Record<string,unknown>}|null}
 */
export function readWarTerminationForParty({
  worldState = null,
  snapshot = null,
  pIndex = null,
  tick = null,
  actorId,
  opponentId,
  sunkCostPressureFor = null,
} = {}) {
  const state = asObject(worldState);
  const actor = String(actorId ?? '');
  const opponent = String(opponentId ?? '');
  if (!actor || !opponent || actor === opponent) return null;

  const deployments = asObject(state.deployments);
  const actorDeployment = asObject(deployments[actor]);
  const opponentDeployment = asObject(deployments[opponent]);
  const actorOwnsFront = String(actorDeployment.targetId ?? '') === opponent;
  const opponentOwnsFront = String(opponentDeployment.targetId ?? '') === actor;
  if (!actorOwnsFront && !opponentOwnsFront) return null;

  const source = actorOwnsFront ? actorDeployment : opponentDeployment;
  let oriented = source;
  if (!actorOwnsFront) {
    const live = warReasonsFor(state, actor, opponent);
    const liveReasons = asObject(live?.reasons);
    const casusReasons = Object.keys(liveReasons)
      .filter(isWarReasonType)
      .sort(codepointCompare)
      .map((type) => ({ type }));
    oriented = {
      targetId: opponent,
      role: 'defending',
      sinceTick: Number.isFinite(Number(source.sinceTick))
        ? Number(source.sinceTick)
        : wholeTick(tick ?? state.tick),
      ...(casusReasons.length ? { casusReasons } : {}),
    };
  }

  const indexedSnapshot = snapshot?.byId instanceof Map
    ? snapshot
    : {
        ...(snapshot || {}),
        byId: new Map((Array.isArray(snapshot?.settlements) ? snapshot.settlements : [])
          .map((row) => [String(asObject(row).id ?? ''), row])
          .filter(([id]) => id)),
      };
  const readTick = wholeTick(tick ?? state.tick);
  const episodeSinceTick = Number.isFinite(Number(source.sinceTick))
    ? Number(source.sinceTick)
    : readTick;
  const physicalPrior = !actorOwnsFront
    ? priorWarCostReceipt(state, opponent, actor, readTick, episodeSinceTick)
    : null;
  const priorOpponentSignature = typeof physicalPrior?.opponentAuthoritySignature === 'string'
    ? physicalPrior.opponentAuthoritySignature
    : '';
  const syntheticPrior = priorOpponentSignature ? {
    kind: 'war_termination_read',
    tick: Number(physicalPrior.tick),
    attackerId: actor,
    targetId: opponent,
    authoritySignature: priorOpponentSignature,
    ...(physicalPrior.opponentBelievedBalanceBand
      ? { believedBalanceBand: String(physicalPrior.opponentBelievedBalanceBand) }
      : {}),
    ...(physicalPrior.opponentTruthBalanceBand
      ? { truthBalanceBand: String(physicalPrior.opponentTruthBalanceBand) }
      : {}),
    ...(physicalPrior.opponentRulerId
      ? { rulerId: String(physicalPrior.opponentRulerId) }
      : {}),
    ...(Array.isArray(physicalPrior.opponentAuthorityDissolvedCauseTypes)
      ? { authorityDissolvedCauseTypes: physicalPrior.opponentAuthorityDissolvedCauseTypes.map(String) }
      : {}),
  } : null;
  const orientedState = {
    ...state,
    deployments: { [actor]: { ...oriented, targetId: opponent } },
    ...(syntheticPrior ? {
      pulseHistory: [
        ...(Array.isArray(state.pulseHistory) ? state.pulseHistory : []),
        { tick: syntheticPrior.tick, warTerminationReads: [syntheticPrior] },
      ],
    } : {}),
  };
  const read = readWarTerminations({
    worldState: orientedState,
    snapshot: indexedSnapshot,
    pIndex,
    tick,
    sunkCostPressureFor,
  });
  return read.byAttacker.get(actor) || null;
}

// Executable totality assertion: adding a taxonomy member without a dissolution
// mode is a module-load failure, not a silent perpetual war.
if (Object.keys(WAR_CAUSE_DISSOLUTION).sort(codepointCompare).join('\u0000')
  !== [...WAR_REASON_TYPES].sort(codepointCompare).join('\u0000')) {
  throw new Error('WAR_CAUSE_DISSOLUTION must cover every war reason exactly once.');
}
if (Object.keys(DISSOLVED_CAUSE_PROSE).sort(codepointCompare).join('\u0000')
  !== [...WAR_REASON_TYPES].sort(codepointCompare).join('\u0000')) {
  throw new Error('DISSOLVED_CAUSE_PROSE must cover every war reason exactly once.');
}
if (Object.keys(TERMINATION_PEACE_PROSE).sort(codepointCompare).join('\u0000')
  !== [...PEACE_REASON_TYPES].sort(codepointCompare).join('\u0000')) {
  throw new Error('TERMINATION_PEACE_PROSE must cover every peace reason exactly once.');
}
