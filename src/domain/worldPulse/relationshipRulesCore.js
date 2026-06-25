/**
 * domain/worldPulse/relationshipRulesCore.js — the cooperative/hierarchical
 * relationship rule evaluators (neutral, trade_partner, allied, patron, client,
 * vassal). Extracted verbatim from relationshipEvolution.js; bodies byte-identical.
 */
import { clamp01, relationshipKeyFromEdge, getRelationshipSettlements, relationshipRoles } from './relationshipState.js';
import { stablePart, mean, candidateBase, labelProposal, internalDrift, pairStableId, hasRecentIncident, itemFor, settlementStrength, relationshipTypeBetween, patronageEligibility, relationshipThirdParties, activeRebellionAgainstVassal } from './relationshipRuleHelpers.js';

/** @param {any} ctx */
function neutralRules(ctx) {
  const { relState, sourcePressure, targetPressure, tick } = ctx;
  const combinedTrade = mean(sourcePressure.trade, targetPressure.trade);
  const combinedConflict = mean(sourcePressure.conflict, targetPressure.conflict);
  const imbalance = Math.abs(sourcePressure.economy - targetPressure.economy);
  const candidates = [];

  if (relState.trust > 0.48 && relState.resentment < 0.24 && combinedConflict < 0.38) {
    candidates.push(
      labelProposal(ctx, "trade_partner", "neutral_to_trade_partner", {
        ruleId: "neutral_to_trade_partner",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.25 + relState.trust * 0.28 + combinedTrade * 0.16,
        probability: 0.12 + relState.trust * 0.18 + combinedTrade * 0.08,
        reasons: [
          "Neutral neighbors have enough trust and low conflict pressure for trade ties to formalize.",
          `Trust ${relState.trust.toFixed(2)}, resentment ${relState.resentment.toFixed(2)}.`,
        ],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.03),
          tradeBalance: clamp01(relState.tradeBalance + 0.05),
        },
      }),
    );
  }

  if (combinedConflict > 0.42 || relState.resentment > 0.42) {
    candidates.push(
      labelProposal(ctx, "rival", "neutral_to_rival", {
        ruleId: "neutral_to_rival",
        targetSaveId: pairStableId(ctx.edge),
        severity: Math.max(0.34, combinedConflict, relState.resentment),
        probability: 0.1 + combinedConflict * 0.18 + relState.resentment * 0.14,
        reasons: [
          "Neutral relations are being pushed toward rivalry by conflict pressure or accumulated resentment.",
          `Conflict pressure ${combinedConflict.toFixed(2)}, resentment ${relState.resentment.toFixed(2)}.`,
        ],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.05),
          fear: clamp01(relState.fear + 0.03),
          trajectory: "cooling",
        },
      }),
    );
  }

  if (!hasRecentIncident(relState, "border_incident", tick) && combinedConflict > 0.25) {
    candidates.push(
      internalDrift(ctx, "neutral_border_incident", {
        ruleId: "neutral_border_incident",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.18 + combinedConflict * 0.34,
        probability: 0.12 + combinedConflict * 0.2,
        reasons: ["Local pressure creates a minor incident between neutral settlements."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.04),
          fear: clamp01(relState.fear + 0.02),
          trajectory: "cooling",
        },
        metadata: { incidentType: "border_incident" },
      }),
    );
  }

  if (imbalance > 0.42 && relState.dependency > 0.24 && relState.trust < 0.52) {
    const eligibility = patronageEligibility(ctx);
    if (eligibility.eligible) {
    candidates.push(
      labelProposal(ctx, "patron", "neutral_to_patronage", {
        ruleId: "neutral_to_patronage",
        severity: 0.34 + imbalance * 0.32 + relState.dependency * 0.16,
        probability: 0.08 + imbalance * 0.16 + relState.dependency * 0.1,
        reasons: [
          "A power imbalance gives one side an opening to formalize patronage instead of equal diplomacy.",
        ],
        targetSaveId: eligibility.clientSaveId,
        relationshipPatch: {
          dependency: clamp01(relState.dependency + 0.06),
          leverage: clamp01(relState.leverage + 0.06),
          patronSaveId: eligibility.patronSaveId,
          clientSaveId: eligibility.clientSaveId,
          trajectory: "tightening",
        },
        metadata: { imbalance, patronageEligibility: eligibility.reason, patronSaveId: eligibility.patronSaveId, clientSaveId: eligibility.clientSaveId },
      }),
    );
    }
  }

  return candidates;
}

/** @param {any} ctx */
function tradePartnerRules(ctx) {
  const { relState, sourcePressure, targetPressure, tick } = ctx;
  const tradeStress = mean(sourcePressure.trade, targetPressure.trade);
  const conflictStress = mean(sourcePressure.conflict, targetPressure.conflict);
  const dependencyGap = Math.abs(sourcePressure.economy - targetPressure.economy) + relState.dependency;
  const candidates = [];

  if (relState.trust > 0.68 && relState.resentment < 0.18 && relState.tradeBalance > 0.55 && conflictStress < 0.35) {
    candidates.push(
      labelProposal(ctx, "allied", "trade_to_allied", {
        ruleId: "trade_to_allied",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.4 + relState.trust * 0.28,
        probability: 0.1 + relState.trust * 0.18 + relState.tradeBalance * 0.08,
        reasons: ["Long stable trade and high trust create a plausible alliance offer."],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.04),
          pactStrength: clamp01(relState.pactStrength + 0.14),
          trajectory: "warming",
        },
      }),
    );
  }

  if (dependencyGap > 0.62 && relState.leverage > 0.38) {
    const eligibility = patronageEligibility(ctx);
    if (eligibility.eligible) {
    candidates.push(
      labelProposal(ctx, "patron", "trade_to_patron_client", {
        ruleId: "trade_to_patron_client",
        severity: 0.36 + dependencyGap * 0.32,
        probability: 0.08 + dependencyGap * 0.16 + relState.leverage * 0.12,
        reasons: ["Unequal trade creates leverage for a patron/client relationship."],
        targetSaveId: eligibility.clientSaveId,
        relationshipPatch: {
          dependency: clamp01(relState.dependency + 0.07),
          leverage: clamp01(relState.leverage + 0.07),
          resentment: clamp01(relState.resentment + 0.03),
          patronSaveId: eligibility.patronSaveId,
          clientSaveId: eligibility.clientSaveId,
          trajectory: "tightening",
        },
        metadata: { patronageEligibility: eligibility.reason, patronSaveId: eligibility.patronSaveId, clientSaveId: eligibility.clientSaveId },
      }),
    );
    }
  }

  if (!hasRecentIncident(relState, "route_disruption", tick) && tradeStress > 0.28) {
    candidates.push(
      internalDrift(ctx, "trade_route_disruption", {
        ruleId: "trade_route_disruption",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.24 + tradeStress * 0.45,
        probability: 0.14 + tradeStress * 0.22,
        reasons: ["Trade pressure disrupts routes and introduces resentment or leverage."],
        relationshipPatch: {
          trust: clamp01(relState.trust - 0.03),
          resentment: clamp01(relState.resentment + 0.04),
          leverage: clamp01(relState.leverage + 0.03),
          trajectory: "strained",
        },
        metadata: { incidentType: "route_disruption" },
      }),
    );
  }

  if (tradeStress > 0.42 && relState.trust < 0.58) {
    candidates.push(
      internalDrift(ctx, "trade_smuggling_pressure", {
        ruleId: "trade_smuggling_pressure",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.22 + tradeStress * 0.38,
        probability: 0.08 + tradeStress * 0.22,
        reasons: ["Disrupted or unequal trade opens space for smugglers and informal markets."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.03),
          leverage: clamp01(relState.leverage + 0.04),
        },
        metadata: { incidentType: "smuggling_pressure" },
      }),
    );
  }

  return candidates;
}

/** @param {any} ctx */
function alliedRules(ctx) {
  const { edge, relState, sourcePressure, targetPressure } = ctx;
  const settlements = getRelationshipSettlements(edge);
  // The alliance burden lands on the side actually carrying the support
  // cost. Each direction is scored with the original formula (the partner's
  // food/conflict/disease strain plus the supporter's own conflict exposure)
  // and the heavier direction wins; ties break on settlement id, so the
  // outcome never depends on which side the save authored at 'from'.
  const burdenOnFrom = mean(targetPressure.food, targetPressure.conflict, targetPressure.disease, sourcePressure.conflict);
  const burdenOnTo = mean(sourcePressure.food, sourcePressure.conflict, sourcePressure.disease, targetPressure.conflict);
  const fromSupports = burdenOnFrom === burdenOnTo
    ? String(settlements.from) <= String(settlements.to)
    : burdenOnFrom > burdenOnTo;
  const supporterId = String(fromSupports ? settlements.from : settlements.to);
  const supportedId = String(fromSupports ? settlements.to : settlements.from);
  const supportedConflict = fromSupports ? targetPressure.conflict : sourcePressure.conflict;
  const burden = fromSupports ? burdenOnFrom : burdenOnTo;
  const endurance = clamp01(relState.pactStrength + relState.trust * 0.4 - relState.obligationFatigue * 0.45);
  const candidates = [];

  if (burden > 0.24) {
    candidates.push(
      candidateBase({
        ...ctx,
        candidateType: "ally_burden",
        ruleId: "allied_aid_buffer",
        type: "condition",
        targetSaveId: supporterId,
        severity: Math.min(0.74, burden * 0.72),
        probability: 0.18 + relState.trust * 0.18 + relState.pactStrength * 0.16,
        reasons: [
          "An ally buffers pressure, but the support becomes a real burden on the supporting settlement.",
          `Burden ${burden.toFixed(2)}, endurance ${endurance.toFixed(2)}.`,
        ],
        relationshipPatch: {
          aidBurden: clamp01(relState.aidBurden + burden * 0.12),
          militaryBurden: clamp01(relState.militaryBurden + supportedConflict * 0.1),
          obligationFatigue: clamp01(relState.obligationFatigue + burden * 0.08),
        },
        condition: {
          archetype: "alliance_burden",
          severity: Math.min(0.74, burden * 0.72),
          source: "world_pulse_relationship",
          relatedSettlementId: supportedId,
        },
        metadata: { endurance, burden, supporterSaveId: supporterId, supportedSaveId: supportedId },
      }),
    );
  }

  // Triage: the obligation gate reads BOTH allies — whichever side is
  // under conflict/hostility pressure pulls the OTHER into the obligation,
  // never the authored 'to'. When both qualify, the harder-pressed side is
  // the one mirrored; an exact tie breaks on the sorted pair.
  const fromThreat = Math.max(sourcePressure.conflict, sourcePressure.hostility);
  const toThreat = Math.max(targetPressure.conflict, targetPressure.hostility);
  if (fromThreat > 0.45 || toThreat > 0.45) {
    const toIsPressured = fromThreat === toThreat
      ? String(settlements.to) <= String(settlements.from)
      : toThreat > fromThreat;
    const pressuredId = String(toIsPressured ? settlements.to : settlements.from);
    const obligatedId = String(toIsPressured ? settlements.from : settlements.to);
    candidates.push(
      internalDrift(ctx, "ally_conflict_mirror", {
        ruleId: "allied_conflict_obligation",
        targetSaveId: obligatedId,
        severity: 0.28 + Math.max(fromThreat, toThreat) * 0.48,
        probability: 0.1 + relState.pactStrength * 0.22 + relState.trust * 0.12,
        reasons: ["An ally faces a gated obligation to mirror the hostility or cold-war pressure bearing on its partner."],
        relationshipPatch: {
          militaryBurden: clamp01(relState.militaryBurden + 0.08),
          obligationFatigue: clamp01(relState.obligationFatigue + 0.06),
          trajectory: "committed",
        },
        metadata: { incidentType: "conflict_obligation", obligatedSaveId: obligatedId, pressuredSaveId: pressuredId },
      }),
    );
  }

  // Triage: EITHER ally may be the one fighting a cold war — the other
  // side is the supporter, whichever way the save authored the edge. When
  // both allies have cold-war fronts the higher-resentment front is supported
  // first; an exact tie breaks on the sorted pair.
  const fromColdWar = relationshipThirdParties(ctx, settlements.from, ["cold_war"])[0];
  const toColdWar = relationshipThirdParties(ctx, settlements.to, ["cold_war"])[0];
  let supportedColdWar = fromColdWar || toColdWar;
  let supportedAllyId = String(fromColdWar ? settlements.from : settlements.to);
  if (fromColdWar && toColdWar) {
    const supportTo = fromColdWar.relState.resentment === toColdWar.relState.resentment
      ? String(settlements.to) <= String(settlements.from)
      : toColdWar.relState.resentment > fromColdWar.relState.resentment;
    supportedColdWar = supportTo ? toColdWar : fromColdWar;
    supportedAllyId = String(supportTo ? settlements.to : settlements.from);
  }
  if (supportedColdWar) {
    const supportingAllyId = String(supportedAllyId === String(settlements.from) ? settlements.to : settlements.from);
    const supporterToThird = relationshipTypeBetween(ctx, supportingAllyId, supportedColdWar.thirdPartyId);
    const hesitation = ["allied", "trade_partner", "patron", "vassal"].includes(supporterToThird) ? 0.46 : 1;
    candidates.push(
      internalDrift(ctx, "ally_cold_war_support", {
        ruleId: "allied_cold_war_support",
        targetSaveId: supportingAllyId,
        severity: clamp01((0.28 + relState.pactStrength * 0.26 + supportedColdWar.relState.resentment * 0.18) * hesitation),
        probability: clamp01((0.08 + relState.trust * 0.14 + relState.pactStrength * 0.16) * hesitation),
        reasons: [
          hesitation < 1
            ? "The ally supports cold-war pressure through sanctions or intelligence, but hesitates because the target is also tied to them."
            : "The ally supports cold-war pressure with sanctions, intelligence, or proxy aid.",
          `Cold-war third party: ${supportedColdWar.thirdPartyId}.`,
        ],
        relationshipPatch: {
          militaryBurden: clamp01(relState.militaryBurden + 0.04 * hesitation),
          obligationFatigue: clamp01(relState.obligationFatigue + 0.05 * hesitation),
          pactStrength: clamp01(relState.pactStrength + 0.015 * hesitation),
          trajectory: hesitation < 1 ? "cautious_cold_war_support" : "cold_war_support",
        },
        metadata: {
          incidentType: "cold_war_support",
          thirdPartyId: supportedColdWar.thirdPartyId,
          hesitation,
          sourceRelationshipToThird: supporterToThird,
          supporterSaveId: supportingAllyId,
          supportedSaveId: supportedAllyId,
        },
      }),
    );
  }

  if (relState.obligationFatigue > 0.52 || (burden > endurance && relState.resentment > 0.22)) {
    candidates.push(
      labelProposal(ctx, "trade_partner", "allied_overburdened", {
        ruleId: "allied_overburdened",
        // The cooling is attributed to the side carrying the cost.
        targetSaveId: supporterId,
        severity: 0.42 + relState.obligationFatigue * 0.32 + Math.max(0, burden - endurance) * 0.35,
        probability: 0.08 + relState.obligationFatigue * 0.24 + Math.max(0, burden - endurance) * 0.2,
        reasons: ["The alliance is past its endurance limit and may cool into a conditional partnership."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.06),
          pactStrength: clamp01(relState.pactStrength - 0.12),
          trajectory: "strained",
        },
        metadata: { endurance, burden },
      }),
    );
  }

  if (burden < 0.18 && relState.obligationFatigue > 0.12) {
    candidates.push(
      internalDrift(ctx, "allied_shared_recovery", {
        ruleId: "allied_shared_recovery",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.16 + relState.obligationFatigue * 0.2,
        probability: 0.12 + relState.trust * 0.14,
        reasons: ["A quiet interval lets an alliance recover from prior aid strain."],
        relationshipPatch: {
          obligationFatigue: clamp01(relState.obligationFatigue - 0.07),
          aidBurden: clamp01(relState.aidBurden - 0.05),
          militaryBurden: clamp01(relState.militaryBurden - 0.04),
          trust: clamp01(relState.trust + 0.02),
        },
      }),
    );
  }

  return candidates;
}

/** @param {any} ctx */
function patronRules(ctx) {
  const { edge, relState, sourcePressure, targetPressure } = ctx;
  // A pulse-driven patronage may have crowned the edge's authored 'to'
  // side as the patron — roles and the per-side pressures follow the STATE
  // stamp, like vassalRules. A DM-authored patron edge has no stamp and
  // keeps strict edge direction (from = patron).
  const { seniorId: patronId, reversed } = relationshipRoles(edge, relState);
  const patronPressure = reversed ? targetPressure : sourcePressure;
  const clientPressure = reversed ? sourcePressure : targetPressure;
  const clientStrain = mean(clientPressure.food, clientPressure.trade, clientPressure.legitimacy);
  const patronExposure = mean(patronPressure.economy, patronPressure.trade);
  const candidates = [];

  candidates.push(
    internalDrift(ctx, "patron_extracts_tribute", {
      ruleId: "patron_extracts_tribute",
      targetSaveId: patronId,
      severity: 0.18 + relState.leverage * 0.32 + relState.dependency * 0.18,
      probability: 0.12 + relState.leverage * 0.18,
      reasons: ["Patronage creates recurring extraction, protection demands, and law influence."],
      relationshipPatch: {
        resentment: clamp01(relState.resentment + 0.035),
        leverage: clamp01(relState.leverage + 0.025),
        dependency: clamp01(relState.dependency + 0.015),
      },
      metadata: { incidentType: "tribute_extraction" },
    }),
  );

  if (clientPressure.conflict > 0.36 || clientPressure.crime > 0.42) {
    candidates.push(
      internalDrift(ctx, "patron_intervenes", {
        ruleId: "patron_intervenes",
        targetSaveId: patronId,
        severity: 0.28 + Math.max(clientPressure.conflict, clientPressure.crime) * 0.44,
        probability: 0.1 + relState.pactStrength * 0.2 + relState.leverage * 0.08,
        reasons: ["A patron has incentive to intervene when client instability threatens tribute or influence."],
        relationshipPatch: {
          militaryBurden: clamp01(relState.militaryBurden + 0.06),
          trust: clamp01(relState.trust + 0.02),
          resentment: clamp01(relState.resentment + 0.025),
        },
        metadata: { incidentType: "patron_intervention" },
      }),
    );
  }

  if (
    (clientPressure.conflict > 0.46 || clientPressure.trade > 0.52)
    && patronExposure > 0.36
    && relState.dependency > 0.5
    && relState.trust > 0.34
  ) {
    candidates.push(
      labelProposal(ctx, "allied", "patron_protects_investment", {
        ruleId: "patron_to_allied_interest_protection",
        targetSaveId: patronId,
        severity: 0.38 + Math.max(clientPressure.conflict, clientPressure.trade) * 0.28 + patronExposure * 0.18,
        probability: 0.06 + relState.dependency * 0.12 + patronExposure * 0.12,
        reasons: [
          "The patron's own economy is exposed enough that protecting the client as an ally becomes rational.",
          "Patronage matures when the patron needs the client's survival more than its concessions.",
        ],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.07),
          pactStrength: clamp01(relState.pactStrength + 0.16),
          leverage: clamp01(relState.leverage - 0.08),
          resentment: clamp01(relState.resentment - 0.04),
          trajectory: "protective_alignment",
        },
        metadata: { patronExposure },
      }),
    );
  }

  if (clientStrain > 0.52 && relState.resentment > 0.45) {
    candidates.push(
      labelProposal(ctx, "hostile", "patron_overreach", {
        ruleId: "patron_overreach",
        targetSaveId: patronId,
        severity: 0.48 + clientStrain * 0.32 + relState.resentment * 0.18,
        probability: 0.07 + clientStrain * 0.2 + relState.resentment * 0.16,
        reasons: ["Extraction during crisis can turn patronage into open hostility."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.08),
          fear: clamp01(relState.fear + 0.08),
          trajectory: "rupturing",
        },
      }),
    );
  }

  if (patronPressure.conflict > 0.55 && relState.dependency > 0.62) {
    candidates.push(
      internalDrift(ctx, "patron_forces_alignment", {
        ruleId: "patron_forces_alignment",
        targetSaveId: patronId,
        severity: 0.36 + patronPressure.conflict * 0.32,
        probability: 0.08 + relState.leverage * 0.18,
        reasons: ["A strained patron may demand client troops, supplies, or legal concessions."],
        relationshipPatch: {
          obligationFatigue: clamp01(relState.obligationFatigue + 0.08),
          resentment: clamp01(relState.resentment + 0.05),
        },
        metadata: { incidentType: "forced_alignment" },
      }),
    );
  }

  return candidates;
}

/** @param {any} ctx */
function clientRules(ctx) {
  const { relState, sourcePressure, targetPressure } = ctx;
  const autonomyPressure = mean(sourcePressure.legitimacy, sourcePressure.economy, relState.resentment);
  const candidates = [];

  if (relState.dependency > 0.62 && relState.resentment < 0.5) {
    candidates.push(
      internalDrift(ctx, "client_compliance", {
        ruleId: "client_compliance",
        severity: 0.16 + relState.dependency * 0.25,
        probability: 0.12 + relState.dependency * 0.15,
        reasons: ["Client dependence encourages compliance even when the arrangement is unequal."],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.015),
          leverage: clamp01(relState.leverage + 0.025),
          dependency: clamp01(relState.dependency + 0.015),
        },
      }),
    );
  }

  if (autonomyPressure > 0.5) {
    candidates.push(
      labelProposal(ctx, "rival", "client_autonomy_bid", {
        ruleId: "client_autonomy_bid",
        severity: 0.42 + autonomyPressure * 0.34,
        probability: 0.08 + autonomyPressure * 0.2,
        reasons: ["A pressured client can produce autonomy movements or resistance factions."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.07),
          trust: clamp01(relState.trust - 0.04),
          trajectory: "resisting",
        },
      }),
    );
  }

  if (sourcePressure.conflict > 0.42 || sourcePressure.food > 0.5) {
    candidates.push(
      internalDrift(ctx, "client_appeals_for_protection", {
        ruleId: "client_appeals_for_protection",
        severity: 0.28 + Math.max(sourcePressure.conflict, sourcePressure.food) * 0.42,
        probability: 0.1 + relState.dependency * 0.2,
        reasons: ["Client crisis increases appeals for patron protection and deepens dependence."],
        relationshipPatch: {
          dependency: clamp01(relState.dependency + 0.06),
          leverage: clamp01(relState.leverage + 0.04),
          obligationFatigue: clamp01(relState.obligationFatigue + 0.04),
        },
        metadata: { incidentType: "appeal_for_protection" },
      }),
    );
  }

  if (targetPressure.trade > 0.45 && relState.dependency > 0.6) {
    candidates.push(
      internalDrift(ctx, "client_debt_spiral", {
        ruleId: "client_debt_spiral",
        severity: 0.3 + targetPressure.trade * 0.38,
        probability: 0.08 + relState.dependency * 0.16 + targetPressure.trade * 0.1,
        reasons: ["Trade disruption and dependency create a debt spiral for the client."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.04),
          dependency: clamp01(relState.dependency + 0.04),
          leverage: clamp01(relState.leverage + 0.04),
        },
        metadata: { incidentType: "debt_spiral" },
      }),
    );
  }

  return candidates;
}

/** @param {any} ctx */
function vassalRules(ctx) {
  const { edge, relState, sourcePressure, targetPressure, tick } = ctx;
  // A subjugation may have crowned the edge's authored 'to' side as the
  // overlord — roles and the per-side pressures follow the STATE stamp. A
  // DM-authored vassal edge has no stamp and keeps strict edge direction.
  const { seniorId: overlordId, juniorId: vassalId, reversed } = relationshipRoles(edge, relState);
  const overlordPressure = reversed ? targetPressure : sourcePressure;
  const vassalPressure = reversed ? sourcePressure : targetPressure;
  const vassalStrain = mean(vassalPressure.legitimacy, vassalPressure.trade, vassalPressure.conflict, relState.resentment);
  const overlordWeakness = mean(overlordPressure.conflict, overlordPressure.legitimacy, overlordPressure.defense, overlordPressure.economy);
  const weaknessStreak = Math.max(0, Number(relState.overlordWeaknessStreak) || 0);
  const candidates = [];

  candidates.push(
    candidateBase({
      ...ctx,
      candidateType: "vassal_tribute_extraction",
      ruleId: "vassal_tribute_extraction",
      type: "condition",
      targetSaveId: vassalId,
      severity: clamp01(0.28 + relState.leverage * 0.32 + relState.dependency * 0.18),
      probability: 0.14 + relState.leverage * 0.18,
      reasons: [
        "Vassalage creates recurring tribute, legal concessions, and military obligation.",
        "The overlord benefits structurally, but the vassal's local economy and legitimacy are strained.",
      ],
      relationshipPatch: {
        resentment: clamp01(relState.resentment + 0.035),
        dependency: clamp01(relState.dependency + 0.025),
        leverage: clamp01(relState.leverage + 0.025),
        tradeBalance: clamp01(relState.tradeBalance - 0.025),
        pactStrength: clamp01(relState.pactStrength + 0.015),
        overlordSaveId: overlordId,
        vassalSaveId: vassalId,
        trajectory: "extractive",
      },
      condition: {
        archetype: "vassal_extraction",
        label: "Vassal extraction",
        description: "Tribute, levies, or legal concessions are draining local capacity.",
        severity: clamp01(0.28 + relState.leverage * 0.32 + relState.dependency * 0.18),
        status: "stable",
        triggeredAt: { tick, sourceEventType: "WORLD_PULSE_VASSALAGE", sourceEventTargetId: overlordId },
        affectedSystems: ["trade_connectivity", "public_legitimacy", "faction_power", "defense_readiness"],
        causes: [{ source: relationshipKeyFromEdge(edge), effect: "vassal_extraction", reason: "A vassal relationship transfers value upward." }],
      },
      metadata: { incidentType: "vassal_extraction", overlordSaveId: overlordId, vassalSaveId: vassalId },
    }),
  );

  const overlordColdWar = relationshipThirdParties(ctx, overlordId, ["cold_war"])[0];
  if (overlordColdWar) {
    candidates.push(
      internalDrift(ctx, "vassal_cold_war_support", {
        ruleId: "vassal_cold_war_support",
        severity: clamp01(0.26 + relState.dependency * 0.22 + overlordColdWar.relState.resentment * 0.2),
        probability: clamp01(0.08 + relState.leverage * 0.16 + relState.pactStrength * 0.12),
        reasons: [
          "A vassal is expected to aid the overlord's cold war with sanctions, scouts, supplies, or legal pressure.",
          `Cold-war third party: ${overlordColdWar.thirdPartyId}.`,
        ],
        relationshipPatch: {
          obligationFatigue: clamp01(relState.obligationFatigue + 0.06),
          militaryBurden: clamp01(relState.militaryBurden + 0.04),
          resentment: clamp01(relState.resentment + 0.025),
          pactStrength: clamp01(relState.pactStrength + 0.02),
          trajectory: "cold_war_levy_support",
        },
        metadata: {
          incidentType: "vassal_cold_war_support",
          overlordSaveId: overlordId,
          vassalSaveId: vassalId,
          thirdPartyId: overlordColdWar.thirdPartyId,
        },
      }),
    );
  }

  if (overlordWeakness > 0.5 || weaknessStreak > 0) {
    const nextStreak = overlordWeakness > 0.5 ? weaknessStreak + 1 : Math.max(0, weaknessStreak - 1);
    candidates.push(
      internalDrift(ctx, "vassal_overlord_weakness_memory", {
        ruleId: "vassal_overlord_weakness_memory",
        severity: clamp01(0.18 + overlordWeakness * 0.28 + Math.min(0.24, nextStreak * 0.06)),
        probability: 1,
        reasons: [
          overlordWeakness > 0.5
            ? "The overlord's weak legitimacy, economy, military, or defenses are becoming a remembered vassalage risk."
            : "The overlord is recovering, so vassal independence pressure cools gradually.",
        ],
        relationshipPatch: {
          overlordWeaknessStreak: nextStreak,
          resentment: overlordWeakness > 0.5 ? clamp01(relState.resentment + 0.02) : relState.resentment,
          trajectory: overlordWeakness > 0.5 ? "overlord_weakness_noted" : "overlord_recovery_noted",
        },
        metadata: { incidentType: "overlord_weakness_memory", overlordWeakness, weaknessStreak: nextStreak },
      }),
    );
  }

  if (vassalPressure.conflict > 0.38 || vassalPressure.crime > 0.42) {
    candidates.push(
      internalDrift(ctx, "vassal_protection_burden", {
        ruleId: "vassal_protection_burden",
        severity: clamp01(0.26 + Math.max(vassalPressure.conflict, vassalPressure.crime) * 0.4),
        probability: 0.1 + relState.pactStrength * 0.16,
        reasons: ["The overlord has incentive to protect the vassal, but protection deepens obligation and dependence."],
        relationshipPatch: {
          militaryBurden: clamp01(relState.militaryBurden + 0.05),
          dependency: clamp01(relState.dependency + 0.04),
          fear: clamp01(relState.fear + 0.02),
          trust: clamp01(relState.trust + 0.015),
        },
        metadata: { incidentType: "vassal_protection" },
      }),
    );
  }

  const rebellionActive = activeRebellionAgainstVassal(ctx.snapshot, vassalId);
  const stableVassalage = clamp01(relState.trust * 0.34 + relState.pactStrength * 0.28 + (1 - vassalStrain) * 0.38);
  if (!rebellionActive && stableVassalage > 0.55 && !hasRecentIncident(relState, "stable_vassalage", tick, 3)) {
    candidates.push(
      internalDrift(ctx, "vassal_stability_compact", {
        ruleId: "vassal_stability_compact",
        severity: clamp01(0.24 + stableVassalage * 0.32),
        probability: clamp01(0.08 + stableVassalage * 0.18),
        reasons: [
          "The vassalage is burdensome, but trust, protection, and low strain make a stable compact plausible.",
          `Stable compact gate ${stableVassalage.toFixed(2)} with strain ${vassalStrain.toFixed(2)}.`,
        ],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.045),
          resentment: clamp01(relState.resentment - 0.035),
          dependency: clamp01(relState.dependency + 0.015),
          pactStrength: clamp01(relState.pactStrength + 0.04),
          obligationFatigue: clamp01((relState.obligationFatigue || 0) - 0.035),
          trajectory: "stable_vassalage",
        },
        metadata: { incidentType: "stable_vassalage", overlordSaveId: overlordId, vassalSaveId: vassalId, stableVassalage },
      }),
    );
  }

  const vassalItem = itemFor(ctx.snapshot, vassalId);
  const overlordItem = itemFor(ctx.snapshot, overlordId);
  const vassalConfidence = clamp01(settlementStrength(vassalItem, vassalPressure) - settlementStrength(overlordItem, overlordPressure) + 0.45);
  const independencePressure = clamp01(vassalStrain + overlordWeakness * 0.28 + Math.min(0.28, weaknessStreak * 0.07) + vassalConfidence * 0.16);
  if (!rebellionActive && (vassalStrain > 0.55 || independencePressure > 0.62)) {
    const severity = clamp01(0.38 + independencePressure * 0.34 + (1 - relState.trust) * 0.1);
    candidates.push({
      id: `candidate.vassal.rebellion.${stablePart(relationshipKeyFromEdge(edge))}.${tick}`,
      type: "stressor",
      candidateType: "vassal_rebellion",
      ruleId: "vassal_rebellion_pressure",
      ruleFamily: "relationship",
      relationshipKey: relationshipKeyFromEdge(edge),
      targetSaveId: vassalId,
      severity,
      probability: clamp01(0.04 + independencePressure * 0.2 + relState.resentment * 0.12),
      applyMode: severity >= 0.72 ? "proposal" : "auto",
      headline: `Rebellion may rise in ${itemFor(ctx.snapshot, vassalId)?.name || vassalId}`,
      summary: "Vassal extraction, low legitimacy, and poor defenses create an independence crisis.",
      reasons: [
        `Independence pressure ${independencePressure.toFixed(2)} with overlord weakness streak ${weaknessStreak}.`,
        `Vassal strain ${vassalStrain.toFixed(2)} with resentment ${relState.resentment.toFixed(2)}.`,
        "A rebellion can end vassalage if it succeeds, but it does not erase prior structural changes.",
      ],
      stressor: {
        id: `world_stressor.rebellion.${stablePart(vassalId)}.${tick}`,
        type: "rebellion",
        label: "Rebellion pressure",
        originSettlementId: vassalId,
        severity,
        affectedSettlementIds: [vassalId],
        durationPolicy: "episodic",
        residualEffects: ["reprisal_memory", "autonomy_cells", "broken_tax_obligations"],
        spreadChannels: ["information_flow", "political_authority", "criminal_corridor"],
      },
      metadata: { overlordSaveId: overlordId, vassalSaveId: vassalId, relationshipKey: relationshipKeyFromEdge(edge), overlordWeakness, weaknessStreak, vassalConfidence },
      conflictTags: [`stressor:rebellion:${vassalId}`, `relationship:${relationshipKeyFromEdge(edge)}`],
    });
  }

  if (rebellionActive) {
    const successPressure = clamp01(vassalStrain + overlordWeakness * 0.45 - relState.fear * 0.2);
    if (successPressure > 0.48) {
      candidates.push(
        labelProposal(ctx, "rival", "vassal_rebellion_succeeds", {
          ruleId: "vassal_rebellion_resolution",
          severity: clamp01(0.46 + successPressure * 0.36),
          probability: clamp01(0.06 + successPressure * 0.24),
          reasons: [
            "The rebellion has a plausible path to break vassalage.",
            "Prior economic, factional, and power changes remain as scars rather than reverting.",
          ],
          relationshipPatch: {
            resentment: clamp01(relState.resentment + 0.05),
            dependency: clamp01(relState.dependency - 0.12),
            leverage: clamp01(relState.leverage - 0.12),
            fear: clamp01(relState.fear - 0.04),
            trajectory: "broken",
          },
          metadata: { overlordSaveId: overlordId, vassalSaveId: vassalId, rebellionOutcome: "succeeds" },
        }),
      );
    } else {
      candidates.push(
        internalDrift(ctx, "vassal_rebellion_quashed", {
          ruleId: "vassal_rebellion_resolution",
          severity: clamp01(0.34 + (1 - successPressure) * 0.28),
          probability: clamp01(0.08 + (1 - successPressure) * 0.18),
          reasons: ["The overlord has enough coercive advantage to quash the rebellion for now."],
          relationshipPatch: {
            resentment: clamp01(relState.resentment + 0.04),
            fear: clamp01(relState.fear + 0.08),
            dependency: clamp01(relState.dependency + 0.03),
            trajectory: "suppressed",
          },
          metadata: { incidentType: "rebellion_quashed", overlordSaveId: overlordId, vassalSaveId: vassalId },
        }),
      );
    }
  }

  return candidates;
}


export {
  neutralRules,
  tradePartnerRules,
  alliedRules,
  patronRules,
  clientRules,
  vassalRules,
};
