/**
 * domain/worldPulse/relationshipRulesAdversarial.js — the adversarial relationship
 * rule evaluators (rival, cold_war, hostile, criminal_network), the deity-temper /
 * trade-leverage candidates, and the RULE_EVALUATORS dispatch map (which wires in
 * the cooperative evaluators from relationshipRulesCore.js). Extracted verbatim from
 * relationshipEvolution.js; bodies byte-identical.
 */
import { clamp01, getRelationshipSettlements } from './relationshipState.js';
import { previewRelationshipHierarchyCascade } from './relationshipHierarchy.js';
import { isBattlefieldPrimary } from './relationshipCompatibility.js';
import { hash01, mean, candidateBase, labelProposal, internalDrift, pairStableId, hasRecentIncident, itemFor, settlementStrength, subjugationDirection, supplyExposure } from './relationshipRuleHelpers.js';
import { neutralRules, tradePartnerRules, alliedRules, patronRules, clientRules, vassalRules } from './relationshipRulesCore.js';

function rivalRules(/** @type {any} */ ctx) {
  const { relState, sourcePressure, targetPressure } = ctx;
  const conflictStress = mean(sourcePressure.conflict, targetPressure.conflict, relState.resentment);
  const settlements = getRelationshipSettlements(ctx.edge);
  const sourcePower = settlementStrength(itemFor(ctx.snapshot, settlements.from), sourcePressure);
  const targetPower = settlementStrength(itemFor(ctx.snapshot, settlements.to), targetPressure);
  // Triage: the CONFIDENT side of a power play is whichever rival is
  // stronger by state, never the authored 'from'. The gate requires a real
  // gap, so there is no tie case to fork.
  const confidenceGap = Math.abs(sourcePower - targetPower);
  const confidentId = String(sourcePower >= targetPower ? settlements.from : settlements.to);
  const candidates = [];

  candidates.push(
    internalDrift(ctx, "rival_arms_race", {
      ruleId: "rival_arms_race",
      targetSaveId: pairStableId(ctx.edge),
      severity: 0.2 + conflictStress * 0.32 + relState.fear * 0.14,
      probability: 0.1 + conflictStress * 0.18,
      reasons: ["Rivals tend to answer pressure with defensive spending, prestige contests, or arms buildup."],
      relationshipPatch: {
        fear: clamp01(relState.fear + 0.035),
        resentment: clamp01(relState.resentment + 0.025),
        militaryBurden: clamp01(relState.militaryBurden + 0.035),
      },
      metadata: { incidentType: "arms_race" },
    }),
  );

  if (relState.resentment > 0.5 || sourcePressure.trade > 0.4 || targetPressure.trade > 0.4) {
    candidates.push(
      internalDrift(ctx, "rival_sabotage", {
        ruleId: "rival_sabotage",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.26 + relState.resentment * 0.36 + Math.max(sourcePressure.trade, targetPressure.trade) * 0.18,
        probability: 0.08 + relState.resentment * 0.18,
        reasons: ["Economic competition and resentment create sabotage, undercutting, or prestige attacks."],
        relationshipPatch: {
          trust: clamp01(relState.trust - 0.035),
          resentment: clamp01(relState.resentment + 0.04),
          trajectory: "deteriorating",
        },
        metadata: { incidentType: "sabotage" },
      }),
    );
  }

  if (conflictStress > 0.58) {
    candidates.push(
      labelProposal(ctx, "cold_war", "rival_to_cold_war_or_hostile", {
        ruleId: "rival_to_cold_war_or_hostile",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.44 + conflictStress * 0.35,
        probability: 0.07 + conflictStress * 0.2,
        reasons: ["Sustained rivalry can harden into cold-war posture when incidents accumulate."],
        relationshipPatch: {
          fear: clamp01(relState.fear + 0.06),
          resentment: clamp01(relState.resentment + 0.06),
          trajectory: "escalating",
        },
      }),
    );
  }

  if (confidenceGap > 0.22 && relState.resentment > 0.46 && relState.fear < 0.5) {
    candidates.push(
      labelProposal(ctx, confidenceGap > 0.36 && relState.resentment > 0.62 ? "hostile" : "cold_war", "rival_power_play", {
        ruleId: "rival_power_play",
        targetSaveId: confidentId,
        severity: clamp01(0.36 + confidenceGap * 0.42 + relState.resentment * 0.24),
        probability: clamp01(0.05 + confidenceGap * 0.18 + relState.resentment * 0.12),
        reasons: [
          "A rival with a stronger economy, military, or tier position grows confident enough to press the contest.",
          `Power confidence gap ${confidenceGap.toFixed(2)}.`,
        ],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.055),
          fear: clamp01(relState.fear + 0.045),
          leverage: clamp01(relState.leverage + 0.04),
          trajectory: "power_play",
        },
        metadata: { confidenceGap, confidentSaveId: confidentId },
      }),
    );
  }

  if (relState.trust > 0.38 && relState.resentment < 0.38 && Math.max(sourcePressure.conflict, targetPressure.conflict) < 0.24) {
    candidates.push(
      labelProposal(ctx, "trade_partner", "rival_detente", {
        ruleId: "rival_detente",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.28 + relState.trust * 0.24,
        probability: 0.06 + relState.trust * 0.14,
        reasons: ["A quiet rivalry can thaw into transactional trade when resentment is low."],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.05),
          resentment: clamp01(relState.resentment - 0.05),
          trajectory: "warming",
        },
      }),
    );
  }

  return candidates;
}

function coldWarRules(/** @type {any} */ ctx) {
  const { relState, sourcePressure, targetPressure } = ctx;
  const conflictStress = mean(sourcePressure.conflict, targetPressure.conflict, relState.fear, relState.resentment);
  const tradeStress = mean(sourcePressure.trade, targetPressure.trade);
  const settlements = getRelationshipSettlements(ctx.edge);
  const exposure = supplyExposure(ctx.snapshot, settlements.from, settlements.to);
  const candidates = [];

  candidates.push(
    internalDrift(ctx, "cold_war_espionage", {
      ruleId: "cold_war_espionage",
      targetSaveId: pairStableId(ctx.edge),
      severity: 0.22 + conflictStress * 0.34,
      probability: 0.12 + conflictStress * 0.18,
      reasons: ["Cold-war relationships generate espionage, infiltration, and information shocks."],
      relationshipPatch: {
        fear: clamp01(relState.fear + 0.035),
        resentment: clamp01(relState.resentment + 0.025),
      },
      metadata: { incidentType: "espionage" },
    }),
  );

  if (sourcePressure.legitimacy > 0.35 || targetPressure.legitimacy > 0.35) {
    // The proxy opening is in whichever settlement's legitimacy is weaker by
    // state; an exact tie breaks on the sorted pair.
    const fromDestabilized = sourcePressure.legitimacy === targetPressure.legitimacy
      ? String(settlements.from) <= String(settlements.to)
      : sourcePressure.legitimacy > targetPressure.legitimacy;
    const destabilizedId = String(fromDestabilized ? settlements.from : settlements.to);
    candidates.push(
      internalDrift(ctx, "cold_war_proxy_conflict", {
        ruleId: "cold_war_proxy_conflict",
        targetSaveId: destabilizedId,
        severity: 0.3 + Math.max(sourcePressure.legitimacy, targetPressure.legitimacy) * 0.38,
        probability: 0.08 + conflictStress * 0.16,
        reasons: ["Weak legitimacy gives cold-war rivals a proxy faction opening."],
        relationshipPatch: {
          leverage: clamp01(relState.leverage + 0.05),
          resentment: clamp01(relState.resentment + 0.04),
          trajectory: "destabilizing",
        },
        metadata: { incidentType: "proxy_conflict", destabilizedSaveId: destabilizedId },
      }),
    );
  }

  if ((exposure > 0.35 || tradeStress > 0.38) && relState.tradeBalance < 0.42) {
    // Triage: the sanction CONDITION lands on the economically weaker
    // side by STATE (higher economy/trade strain = more dependent on the
    // exposed supply line); the other side imposes. An exact tie breaks on
    // the sorted pair — never on which side the save authored at 'from'.
    const fromStrain = mean(sourcePressure.economy, sourcePressure.trade);
    const toStrain = mean(targetPressure.economy, targetPressure.trade);
    const fromSanctioned = fromStrain === toStrain
      ? String(settlements.from) <= String(settlements.to)
      : fromStrain > toStrain;
    const sanctionedId = String(fromSanctioned ? settlements.from : settlements.to);
    const imposerId = String(fromSanctioned ? settlements.to : settlements.from);
    candidates.push(
      candidateBase({
        ...ctx,
        candidateType: "cold_war_supply_sanctions",
        ruleId: "cold_war_supply_sanctions",
        type: "condition",
        targetSaveId: sanctionedId,
        severity: clamp01(0.3 + Math.max(exposure, tradeStress) * 0.42 + relState.leverage * 0.12),
        probability: clamp01(0.08 + Math.max(exposure, tradeStress) * 0.2 + relState.resentment * 0.08),
        reasons: [
          "Cold-war pressure follows exposed trade and supply channels through inspections, sanctions, and informal embargoes.",
          `${itemFor(ctx.snapshot, imposerId)?.name || imposerId} squeezes the strained economy of ${itemFor(ctx.snapshot, sanctionedId)?.name || sanctionedId}.`,
          exposure > 0 ? `Confirmed supply exposure ${exposure.toFixed(2)}.` : `Trade stress ${tradeStress.toFixed(2)}.`,
        ],
        relationshipPatch: {
          tradeBalance: clamp01(relState.tradeBalance - 0.05),
          resentment: clamp01(relState.resentment + 0.035),
          leverage: clamp01(relState.leverage + 0.035),
          trajectory: "sanctions_pressure",
        },
        condition: {
          archetype: "cold_war_sanctions",
          label: "Cold-war sanctions",
          description: "Inspections, sanctions, or informal embargoes are tightening daily trade.",
          severity: clamp01(0.3 + Math.max(exposure, tradeStress) * 0.42 + relState.leverage * 0.12),
          source: "world_pulse_relationship",
          relatedSettlementId: imposerId,
          affectedSystems: ["trade_connectivity", "public_legitimacy", "criminal_opportunity"],
        },
        metadata: { incidentType: "supply_sanctions", exposure, tradeStress, imposerSaveId: imposerId, sanctionedSaveId: sanctionedId },
      }),
    );
  }

  if (conflictStress > 0.68) {
    candidates.push(
      labelProposal(ctx, "hostile", "cold_war_escalation", {
        ruleId: "cold_war_escalation",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.5 + conflictStress * 0.32,
        probability: 0.06 + conflictStress * 0.18,
        reasons: ["Cold-war incidents have accumulated enough pressure to risk open hostility."],
        relationshipPatch: {
          fear: clamp01(relState.fear + 0.07),
          resentment: clamp01(relState.resentment + 0.07),
          trajectory: "escalating",
        },
      }),
    );
  }

  if (relState.trust > 0.24 && relState.resentment < 0.5 && Math.max(sourcePressure.conflict, targetPressure.conflict) < 0.25) {
    candidates.push(
      labelProposal(ctx, "rival", "cold_war_thaw", {
        ruleId: "cold_war_thaw",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.26 + relState.trust * 0.2,
        probability: 0.05 + relState.trust * 0.12,
        reasons: ["A quiet cold war can thaw back into rivalry when immediate threat fades."],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.04),
          resentment: clamp01(relState.resentment - 0.04),
          fear: clamp01(relState.fear - 0.04),
          trajectory: "cooling",
        },
      }),
    );
  }

  return candidates;
}

// Strength gaps below this are a genuine tie: the raid aggressor forks
// deterministically on pair identity + tick instead of edge orientation.
const RAID_STRENGTH_TIE = 0.04;

function hostileRules(/** @type {any} */ ctx) {
  const { relState, sourcePressure, targetPressure } = ctx;
  const settlements = getRelationshipSettlements(ctx.edge);
  const powerGap = Math.abs(sourcePressure.defense - targetPressure.defense) + Math.abs(sourcePressure.economy - targetPressure.economy);
  const conflictStress = mean(sourcePressure.conflict, targetPressure.conflict, relState.fear, relState.resentment);
  const candidates = [];

  // Either side of a war can raid. The aggressor is the stronger side by
  // STATE; a genuine strength tie forks on pair identity + tick, so a
  // symmetric war raids in both directions across ticks and never depends on
  // which side the save authored at 'from'.
  const fromStrength = settlementStrength(itemFor(ctx.snapshot, settlements.from), sourcePressure);
  const toStrength = settlementStrength(itemFor(ctx.snapshot, settlements.to), targetPressure);
  let aggressorId = fromStrength > toStrength ? String(settlements.from) : String(settlements.to);
  if (Math.abs(fromStrength - toStrength) <= RAID_STRENGTH_TIE) {
    const pair = [String(settlements.from), String(settlements.to)].sort();
    aggressorId = hash01(`raid.${pair[0]}.${pair[1]}.${ctx.tick}`) < 0.5 ? pair[0] : pair[1];
  }
  const victimId = aggressorId === String(settlements.from) ? String(settlements.to) : String(settlements.from);
  // Triage: attrition is read on the AGGRESSOR — the same state-decided
  // side the raid uses — never on the authored 'from'. High economy/defense/
  // legitimacy pressure on the attacking side saps support for the war.
  const aggressorPressure = aggressorId === String(settlements.from) ? sourcePressure : targetPressure;
  const attackerAttrition = mean(aggressorPressure.economy, aggressorPressure.defense, aggressorPressure.legitimacy, relState.militaryBurden);

  candidates.push(
    candidateBase({
      ...ctx,
      candidateType: "hostile_raid",
      ruleId: "hostile_raid",
      targetSaveId: victimId,
      severity: 0.28 + conflictStress * 0.36,
      probability: 0.1 + conflictStress * 0.18,
      reasons: ["Hostile neighbors create raid, blockade, or intimidation pressure."],
      relationshipPatch: {
        resentment: clamp01(relState.resentment + 0.035),
        fear: clamp01(relState.fear + 0.04),
        trajectory: "violent",
      },
      condition: {
        archetype: "war_pressure",
        severity: 0.28 + conflictStress * 0.36,
        source: "world_pulse_relationship",
        relatedSettlementId: aggressorId,
      },
      metadata: { incidentType: "raid", aggressorSaveId: aggressorId, victimSaveId: victimId },
    }),
  );

  // The STRONGER side qualifies to subjugate regardless of orientation.
  const subjugation = powerGap > 0.48 && conflictStress > 0.55 ? subjugationDirection(ctx) : null;
  if (subjugation) {
    const patchValues = {
      dependency: clamp01(relState.dependency + 0.08),
      fear: clamp01(relState.fear + 0.08),
      leverage: clamp01(relState.leverage + 0.08),
      trust: clamp01(relState.trust - 0.02),
    };
    // The vassal cascade must be visible BEFORE the DM accepts — preview
    // the third-party realignments against the projected post-apply vassal
    // state and put them in the proposal summary.
    const cascadePreview = previewRelationshipHierarchyCascade({
      worldState: ctx.snapshot?.worldState,
      regionalGraph: ctx.snapshot?.regionalGraph,
      vassalEdge: ctx.originalEdge || ctx.edge,
      overlordId: subjugation.overlordId,
      vassalId: subjugation.vassalId,
      vassalState: { ...relState, ...patchValues, relationshipType: "vassal" },
    });
    const nameOf = (/** @type {any} */ id) => itemFor(ctx.snapshot, id)?.name || id;
    const baseReason = "A hostile imbalance can create occupation, tribute, or forced vassalage pressure.";
    const realignmentSummary = cascadePreview.length
      ? ` Accepting also realigns ${cascadePreview.length} third-party relationship${cascadePreview.length > 1 ? "s" : ""}: ${cascadePreview
        .map(change => `${nameOf(change.thirdPartyId)} ${change.fromType.replace(/_/g, " ")} becomes ${change.toType.replace(/_/g, " ")}`)
        .join("; ")}.`
      : "";
    candidates.push(
      labelProposal(ctx, "vassal", "hostile_occupation_pressure", {
        ruleId: "hostile_occupation_pressure",
        severity: 0.52 + powerGap * 0.24 + conflictStress * 0.22,
        probability: 0.04 + powerGap * 0.14 + conflictStress * 0.12,
        summary: `${baseReason}${realignmentSummary}`,
        reasons: [
          baseReason,
          ...cascadePreview.map(change =>
            `Realignment on acceptance: ${nameOf(change.thirdPartyId)} shifts ${change.fromType.replace(/_/g, " ")} to ${change.toType.replace(/_/g, " ")} (${change.reason})`),
        ],
        targetSaveId: subjugation.vassalId,
        relationshipPatch: {
          ...patchValues,
          overlordSaveId: subjugation.overlordId,
          vassalSaveId: subjugation.vassalId,
          trajectory: "subjugating",
        },
        metadata: {
          powerGap,
          overlordSaveId: subjugation.overlordId,
          vassalSaveId: subjugation.vassalId,
        },
      }),
    );
  }

  // The dominant side extracts — economic pressure is read per side
  // (higher pressure = the weaker economy), not by authoring orientation.
  if (relState.leverage > 0.45 && sourcePressure.economy !== targetPressure.economy) {
    const fromDominant = sourcePressure.economy < targetPressure.economy;
    const extractorId = String(fromDominant ? settlements.from : settlements.to);
    const tributeVictimId = String(fromDominant ? settlements.to : settlements.from);
    candidates.push(
      internalDrift(ctx, "hostile_forced_tribute", {
        ruleId: "hostile_forced_tribute",
        targetSaveId: tributeVictimId,
        severity: 0.32 + relState.leverage * 0.35,
        probability: 0.06 + relState.leverage * 0.16,
        reasons: ["The economically dominant hostile side may demand tribute before outright occupation."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.05),
          dependency: clamp01(relState.dependency + 0.04),
          leverage: clamp01(relState.leverage + 0.04),
        },
        metadata: { incidentType: "forced_tribute", extractorSaveId: extractorId, victimSaveId: tributeVictimId },
      }),
    );
  }

  if (attackerAttrition > 0.55 && relState.resentment < 0.82) {
    candidates.push(
      labelProposal(ctx, "cold_war", "hostile_attrition_deescalation", {
        ruleId: "hostile_attrition_deescalation",
        targetSaveId: aggressorId,
        severity: clamp01(0.34 + attackerAttrition * 0.36),
        probability: clamp01(0.05 + attackerAttrition * 0.18 + relState.trust * 0.08),
        reasons: [
          `Open hostility is losing practical support as the economy, defenses, legitimacy, or manpower of ${itemFor(ctx.snapshot, aggressorId)?.name || aggressorId} (the aggressing side) slip.`,
          `Attacker attrition ${attackerAttrition.toFixed(2)}.`,
        ],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.025),
          fear: clamp01(relState.fear - 0.035),
          militaryBurden: clamp01(relState.militaryBurden - 0.04),
          trajectory: "attrition_deescalation",
        },
        metadata: { attackerAttrition, aggressorSaveId: aggressorId },
      }),
    );
  }

  if (relState.trust > 0.16 && relState.resentment < 0.62 && Math.max(sourcePressure.conflict, targetPressure.conflict) < 0.35) {
    candidates.push(
      labelProposal(ctx, "cold_war", "hostile_truce", {
        ruleId: "hostile_truce",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.3 + relState.trust * 0.22,
        probability: 0.05 + relState.trust * 0.12,
        reasons: ["Exhaustion or quiet borders can downgrade open hostility into cold-war posture."],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.035),
          resentment: clamp01(relState.resentment - 0.04),
          fear: clamp01(relState.fear - 0.03),
          trajectory: "deescalating",
        },
      }),
    );
  }

  return candidates;
}

function criminalNetworkRules(/** @type {any} */ ctx) {
  const { relState, sourcePressure, targetPressure, tick } = ctx;
  const settlements = getRelationshipSettlements(ctx.edge);
  const crimePressure = mean(sourcePressure.crime, targetPressure.crime);
  const tradeStress = mean(sourcePressure.trade, targetPressure.trade);
  const legitimacyStress = mean(sourcePressure.legitimacy, targetPressure.legitimacy);
  const conflictStress = mean(sourcePressure.conflict, targetPressure.conflict);
  const candidates = [];

  if (!hasRecentIncident(relState, "smuggling_expansion", tick) && (crimePressure > 0.28 || tradeStress > 0.42)) {
    candidates.push(
      internalDrift(ctx, "criminal_smuggling_expands", {
        ruleId: "criminal_smuggling_expands",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.24 + Math.max(crimePressure, tradeStress) * 0.38,
        probability: 0.1 + crimePressure * 0.18 + tradeStress * 0.12,
        reasons: [
          "Crime or trade pressure gives the criminal network room to expand smuggling and favors.",
        ],
        relationshipPatch: {
          leverage: clamp01(relState.leverage + 0.05),
          dependency: clamp01(relState.dependency + 0.03),
          resentment: clamp01(relState.resentment + 0.025),
          trajectory: "tightening",
        },
        metadata: { incidentType: "smuggling_expansion" },
      }),
    );
  }

  if (!hasRecentIncident(relState, "protection_racket", tick) && (legitimacyStress > 0.38 || relState.fear > 0.48)) {
    // The racket is sold where legitimacy is weaker by state; an exact tie
    // (or a purely fear-gated firing) breaks on the sorted pair.
    const fromRacketed = sourcePressure.legitimacy === targetPressure.legitimacy
      ? String(settlements.from) <= String(settlements.to)
      : sourcePressure.legitimacy > targetPressure.legitimacy;
    const racketedSaveId = String(fromRacketed ? settlements.from : settlements.to);
    candidates.push(
      internalDrift(ctx, "criminal_protection_racket", {
        ruleId: "criminal_protection_racket",
        targetSaveId: racketedSaveId,
        severity: 0.26 + Math.max(legitimacyStress, relState.fear) * 0.36,
        probability: 0.08 + legitimacyStress * 0.16 + relState.fear * 0.12,
        reasons: [
          "Weak legitimacy or fear lets the criminal network sell protection as informal order.",
        ],
        relationshipPatch: {
          fear: clamp01(relState.fear + 0.04),
          leverage: clamp01(relState.leverage + 0.04),
          resentment: clamp01(relState.resentment + 0.035),
          trajectory: "coercive",
        },
        metadata: { incidentType: "protection_racket", racketedSaveId },
      }),
    );
  }

  if (conflictStress > 0.5 && relState.resentment > 0.48 && relState.fear > 0.42) {
    candidates.push(
      labelProposal(ctx, "cold_war", "criminal_to_cold_war", {
        ruleId: "criminal_to_cold_war",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.36 + conflictStress * 0.28 + relState.resentment * 0.14,
        probability: 0.06 + conflictStress * 0.16 + relState.fear * 0.1,
        reasons: [
          "A criminal relationship under conflict pressure can harden into covert state hostility.",
        ],
        relationshipPatch: {
          fear: clamp01(relState.fear + 0.03),
          resentment: clamp01(relState.resentment + 0.04),
          trajectory: "escalating",
        },
      }),
    );
  }

  if (crimePressure < 0.24 && tradeStress < 0.34 && relState.trust > 0.42 && relState.resentment < 0.34) {
    candidates.push(
      labelProposal(ctx, "trade_partner", "criminal_legitimizes_trade", {
        ruleId: "criminal_legitimizes_trade",
        targetSaveId: pairStableId(ctx.edge),
        severity: 0.28 + relState.trust * 0.24,
        probability: 0.05 + relState.trust * 0.12,
        reasons: [
          "Low crime pressure and rising trust can pull a criminal corridor into legitimate trade.",
        ],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.04),
          resentment: clamp01(relState.resentment - 0.035),
          leverage: clamp01(relState.leverage - 0.04),
          tradeBalance: clamp01(relState.tradeBalance + 0.08),
          trajectory: "normalizing",
        },
      }),
    );
  }

  return candidates;
}

// ── Trade dependency → coercion + war-prevention / embargo ───────────────────
// A critical-supplier dependency is LEVERAGE. The supplier can COERCE the
// dependent (a coercion candidate), and the dependent AVOIDS war with its
// critical supplier (extra hostility dampening is already applied via the
// CRITICAL_EXTRA_DAMPEN factor in tradeSalience). When military/religious tension
// spikes on the edge, a valuable tie can COLLAPSE into an embargo. A peaceful
// deity raises trade-diplomacy salience (a softer coercion, more likely to hold
// as leverage); a warlike deity makes the tie feel like a weapon (a sharper
// embargo-collapse). All gated on tradeSalienceInfo being present (war layer on +
// a valuable tie) ⇒ byte-identical legacy when absent.
//
// The cross-cutting candidate is emitted on the SORTED edge (a property of the
// pair), mirroring sharedEnemyAllianceCandidate. Returns null when no salience
// info is threaded or the tie is not critical / no tension spike.

// A settlement's embedded deity temper sign: warlike +1, peacelike −1, else 0.
// Reads the resolved primaryDeitySnapshot (store-decoupled), tolerant of the two
// field spellings the snapshot uses across phases.
function deityTemperSign(/** @type {any} */ settlement) {
  const deity = settlement?.config?.primaryDeitySnapshot;
  const axis = String(deity?.temperamentAxis || deity?.temperAxis || deity?.temper || '');
  if (/warlike|war/i.test(axis)) return 1;
  if (/peace/i.test(axis)) return -1;
  return 0;
}

function tradeLeverageCandidate(/** @type {any} */ ctx) {
  const info = ctx.tradeSalienceInfo;
  if (!info || !Number.isFinite(info.salience) || info.salience <= 0) return null;
  const settlements = getRelationshipSettlements(ctx.edge);
  if (!settlements.from || !settlements.to) return null;
  const relType = ctx.relState.relationshipType;
  // Battlefield enemies don't carry a normal trade tie — any commerce there is
  // covert/forced (the overlay handles it); no peacetime coercion/embargo rule.
  if (isBattlefieldPrimary(relType)) return null;

  const dependentId = String(info.dependentId || settlements.from);
  const supplierId = String(info.supplierId || settlements.to);
  if (dependentId === supplierId) return null;
  const dependentItem = itemFor(ctx.snapshot, dependentId);
  const supplierItem = itemFor(ctx.snapshot, supplierId);
  // Military/religious tension on the edge — the trigger for an embargo collapse.
  const dependentPressure = dependentId === String(settlements.from) ? ctx.sourcePressure : ctx.targetPressure;
  const supplierPressure = supplierId === String(settlements.from) ? ctx.sourcePressure : ctx.targetPressure;
  const militaryTension = Math.max(
    dependentPressure.conflict, supplierPressure.conflict,
    dependentPressure.hostility, supplierPressure.hostility,
    ctx.relState.resentment, ctx.relState.fear,
  );
  // A warlike supplier deity sharpens the embargo; a peaceful one softens it.
  const supplierTemper = deityTemperSign(supplierItem?.settlement);
  const dependentTemper = deityTemperSign(dependentItem?.settlement);
  // Tension that collapses the tie: high resentment/conflict + a non-pacific
  // deity tilt. A peaceful deity raises the bar (the tie is diplomacy, not a
  // weapon); a warlike one lowers it.
  const tensionDrive = clamp01(militaryTension + supplierTemper * 0.12 + dependentTemper * 0.06);

  // EMBARGO COLLAPSE: a valuable tie + a real tension spike ⇒ the supplier (or
  // the dependent, when adversarial) weaponizes the dependency. Stamps a coercive
  // economic condition on the dependent + an embargo trajectory.
  if (info.critical && tensionDrive > 0.5) {
    const sev = clamp01(0.32 + info.salience * 0.3 + tensionDrive * 0.24);
    return candidateBase({
      ...ctx,
      candidateType: "trade_embargo_collapse",
      ruleId: "trade_dependency_embargo",
      type: "condition",
      targetSaveId: dependentId,
      severity: sev,
      probability: clamp01(0.05 + tensionDrive * 0.18 + info.salience * 0.08),
      reasons: [
        "A valuable, hard-to-replace trade dependency has become a weapon: rising military or religious tension collapses it into an embargo.",
        `Trade salience ${info.salience.toFixed(2)} with tension ${tensionDrive.toFixed(2)}.`,
      ],
      relationshipPatch: {
        tradeBalance: clamp01(ctx.relState.tradeBalance - 0.08),
        resentment: clamp01(ctx.relState.resentment + 0.05),
        leverage: clamp01(ctx.relState.leverage + 0.05),
        dependency: clamp01(ctx.relState.dependency - 0.04),
        trajectory: "embargo_collapse",
      },
      condition: {
        // label / description / affectedSystems now come from the trade_embargo
        // catalog template (activeConditions.js) — same as alliance_burden et al.
        archetype: "trade_embargo",
        severity: sev,
        source: "world_pulse_relationship",
        relatedSettlementId: supplierId,
      },
      metadata: {
        incidentType: "trade_embargo",
        secondaryStatus: "embargo",
        tradeSalience: info.salience,
        tensionDrive,
        supplierSaveId: supplierId,
        dependentSaveId: dependentId,
      },
    });
  }

  // COERCION: a critical-supplier dependency without an open spike lets the
  // supplier press its advantage — a non-violent leverage candidate (concessions,
  // preferential terms). De-escalation-shaped (it is an ALTERNATIVE to war), so
  // the salience factor RAISES it. The dependent's own avoidance of war with its
  // supplier is already in the dampener; this is the supplier's active push.
  if (info.critical && militaryTension < 0.5) {
    const sev = clamp01(0.26 + info.salience * 0.28);
    return internalDrift(ctx, "trade_dependency_coercion", {
      ruleId: "trade_dependency_coercion",
      targetSaveId: supplierId,
      severity: sev,
      probability: clamp01(0.06 + info.salience * 0.14),
      reasons: [
        "A critical-supplier dependency is leverage: the supplier extracts concessions or preferential terms rather than risk war over the relationship.",
        `Trade salience ${info.salience.toFixed(2)} (critical supplier).`,
      ],
      relationshipPatch: {
        leverage: clamp01(ctx.relState.leverage + 0.05),
        dependency: clamp01(ctx.relState.dependency + 0.03),
        tradeBalance: clamp01(ctx.relState.tradeBalance + 0.02),
        trajectory: "supplier_leverage",
      },
      metadata: {
        incidentType: "trade_coercion",
        secondaryStatus: "critical_supplier",
        tradeSalience: info.salience,
        supplierSaveId: supplierId,
        dependentSaveId: dependentId,
      },
    });
  }
  return null;
}

const RULE_EVALUATORS = {
  neutral: neutralRules,
  trade_partner: tradePartnerRules,
  allied: alliedRules,
  patron: patronRules,
  client: clientRules,
  vassal: vassalRules,
  rival: rivalRules,
  cold_war: coldWarRules,
  hostile: hostileRules,
  criminal_network: criminalNetworkRules,
};

export { RULE_EVALUATORS, tradeLeverageCandidate };
