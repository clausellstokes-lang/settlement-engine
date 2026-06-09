/**
 * domain/causalState.js — Unified causal state substrate.
 *
 * Tier 2.4 of the roadmap. Today's settlement state is scattered across
 * a dozen subsystem-specific fields (`economicState.foodSecurity`,
 * `powerStructure.publicLegitimacy`, `safetyProfile.blackMarketCapture`,
 * etc.). Each one reads its own narrow slice and produces its own
 * narrow output. This module unifies the substrate so every subsystem
 * (events, conditions, factions, supply chains, NPCs, AI overlay) can
 * read from one canonical map.
 *
 *   deriveCausalState(settlement) -> {
 *     variables: { food_security: SystemVariable, ... },   // 14 entries
 *     bands:     { food_security: 'adequate', ... },        // flat band map
 *     scores:    { food_security: 65, ... },                // flat 0-100 score map
 *     summary:   { surplus: string[], adequate: [], ... },  // group by band
 *   }
 *
 * Each SystemVariable has structured contributors so consumers can
 * answer "why is food_security strained?" by reading the chain of
 * deltas that produced the score. This is the Phase 7 trace pattern
 * applied at the system-variable level.
 *
 * Relationship to existing code:
 *   - This file does NOT replace `domain/state/deriveSystemState.js`.
 *     That module produces a 4-dimension UI-facing summary
 *     (resilience / volatility / externalThreat / resourcePressure)
 *     deliberately consolidated for DM-facing display. This file
 *     produces the underlying 14-variable substrate the roadmap calls
 *     for. The UI surface can later derive FROM this substrate
 *     (Strangler Fig) without breaking consumers today.
 *   - The 5-band vocabulary (surplus / adequate / strained / critical
 *     / collapsed) matches Tier 5.4's qualitative-banding direction
 *     and is the canonical substrate vocabulary going forward.
 *
 * Inputs the substrate reads from:
 *   - Phase 9  factionProfile.js          — archetype + power
 *   - Phase 10 supplyChainState.js        — canonical chain statuses
 *   - Phase 13 npcProfile.js              — NPC composition
 *   - Phase 16 activeConditions.js        — canonical condition state
 *   - Settlement generator output         — population, prosperity,
 *                                            stressors, defenseProfile,
 *                                            safetyProfile, etc.
 *
 * Pure functions only. No imports from src/lib. No I/O, no state.
 */

import { deriveAllSupplyChainStates } from './supplyChainState.js';
import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveAllActiveConditions } from './activeConditions.js';
import { deriveAllNpcProfiles } from './npcProfile.js';
import { tradeRouteSemantics } from './tradeRouteSemantics.js';
import { canonStressors } from './canonicalAccessors.js';
import { foodLedger } from './foodLedger.js';
import { governanceLedger } from './governanceLedger.js';
import { magicLedger } from './magicLedger.js';
import { healingLedger } from './healingLedger.js';

// ── Canonical catalog ────────────────────────────────────────────────────

/**
 * The 14 canonical system variables per the roadmap. Frozen so the
 * shape of the substrate is stable; consumers can rely on iterating
 * this array to cover every dimension.
 */
export const SYSTEM_VARIABLES = Object.freeze([
  'food_security',
  'labor_capacity',
  'public_legitimacy',
  'ruling_authority',
  'faction_power',
  'trade_connectivity',
  'healing_capacity',
  'defense_readiness',
  'criminal_opportunity',
  'religious_authority',
  'housing_pressure',
  'infrastructure_condition',
  'magical_stability',
  'social_trust',
]);

/**
 * The canonical 5-band vocabulary. Per Tier 5.4 this is the
 * vocabulary user-facing surfaces (PDF / UI / AI) should display
 * instead of raw numeric scores.
 */
export const CAUSAL_BANDS = Object.freeze([
  'surplus',
  'adequate',
  'strained',
  'critical',
  'collapsed',
]);

// ── Score / band conversion ──────────────────────────────────────────────

/**
 * Map a 0..100 score to a band. Boundaries:
 *   ≥75 surplus | ≥50 adequate | ≥30 strained | ≥15 critical | else collapsed
 *
 * 50 is the neutral / no-information score and lands in 'adequate' —
 * the substrate is default-optimistic; surfaces only flag pressure
 * when there's evidence for it.
 */
export function causalBand(score) {
  const s = typeof score === 'number' ? Math.max(0, Math.min(100, score)) : 50;
  if (s >= 75) return 'surplus';
  if (s >= 50) return 'adequate';
  if (s >= 30) return 'strained';
  if (s >= 15) return 'critical';
  return 'collapsed';
}

/** Round-trip: band → numeric center. */
export function defaultScoreForCausalBand(band) {
  switch (band) {
    case 'surplus':    return 85;
    case 'adequate':   return 62;
    case 'strained':   return 40;
    case 'critical':   return 22;
    default:           return 7;   // collapsed
  }
}

// ── Contributor helper ───────────────────────────────────────────────────

/**
 * @typedef {Object} CausalContributor
 * @property {string} source   — Stable id of the input ('chain.food_security.x',
 *                                'condition.plague.y', 'faction.merchant_guilds').
 * @property {string} effect   — Short tag ('stable', 'strained', 'pressure', 'lift', ...).
 * @property {number} delta    — Signed integer added to the variable's score.
 * @property {string} reason   — Human-readable explanation.
 */

function push(contributors, source, effect, delta, reason) {
  contributors.push({ source, effect, delta, reason });
}

// ── Population helper ────────────────────────────────────────────────────

function populationOf(settlement) {
  const pop = settlement?.population;
  if (typeof pop === 'number') return pop;
  if (pop && typeof pop === 'object' && typeof pop.total === 'number') return pop.total;
  return 0;
}

// ── Per-variable derivations ─────────────────────────────────────────────
//
// Every deriver takes the settlement and returns:
//   { score: number, contributors: CausalContributor[] }
// The composer finalizes by clamping the score to 0..100 and adding
// the band + the variable name.
//
// Each deriver starts from a neutral 50 baseline and adjusts via
// structured push() calls so the contributors list is the trace of
// exactly how the score got to its final value.

function deriveFoodSecurity(s) {
  let score = 50;
  const contributors = [];

  // Supply chain stability for the food_security need
  const chains = deriveAllSupplyChainStates(s);
  const foodChains = chains.filter(c => c.needKey === 'food_security');
  for (const c of foodChains) {
    if (c.status === 'stable') {
      score += 8; push(contributors, c.id, 'stable', +8, `${c.name} runs normally.`);
    } else if (c.status === 'strained' || c.status === 'substituted') {
      score -= 8; push(contributors, c.id, c.status, -8, `${c.name} is ${c.status}.`);
    } else if (c.status === 'scarce') {
      score -= 15; push(contributors, c.id, 'scarce', -15, `${c.name} produces below normal.`);
    } else if (c.status === 'blocked' || c.status === 'captured') {
      score -= 20; push(contributors, c.id, c.status, -20, `${c.name} is ${c.status}.`);
    } else if (c.status === 'collapsing') {
      score -= 28; push(contributors, c.id, 'collapsing', -28, `${c.name} is collapsing.`);
    }
  }

  // Active conditions that affect food_security
  for (const cond of deriveAllActiveConditions(s)) {
    if (!cond.affectedSystems.includes('food_security')) continue;
    const magnitude = Math.round(cond.severity * 20);
    if (magnitude === 0) continue;
    score -= magnitude;
    push(contributors, cond.id, 'pressure', -magnitude, `${cond.label} taxes food security.`);
  }

  // Generator food band, via the conserved ledger. The old code read
  // `surplusMonths`/`deficitMonths` — fields foodGenerator never produces — so this
  // contribution was silently dead. The ledger reads the real quantities
  // (surplusPct/deficitPct), so a food deficit now actually lowers food_security.
  const food = foodLedger(s);
  if (food.present) {
    if (food.surplusPct >= 40) {
      score += 5; push(contributors, 'economicState.foodSecurity', 'surplus', +5, `${food.surplusPct}% grain surplus.`);
    }
    if (food.deficitPct > 0) {
      const d = food.deficitPct > 40 ? 15 : food.deficitPct > 15 ? 10 : 5;
      score -= d; push(contributors, 'economicState.foodSecurity', 'deficit', -d, `${food.deficitPct}% food deficit.`);
    }
  }

  return { score, contributors };
}

function deriveLaborCapacity(s) {
  let score = 50;
  const contributors = [];

  // Population scaling
  const pop = populationOf(s);
  if (pop >= 5000) { score += 10; push(contributors, 'population', 'broad', +10, `Population ${pop} provides a deep labor pool.`); }
  else if (pop >= 1000) { score += 5; push(contributors, 'population', 'adequate', +5, `Population ${pop} carries enough hands.`); }
  else if (pop > 0 && pop < 200) { score -= 5; push(contributors, 'population', 'thin', -5, `Population ${pop} leaves little slack.`); }

  // Active conditions that affect labor (plague especially)
  for (const cond of deriveAllActiveConditions(s)) {
    if (!cond.affectedSystems.includes('labor_capacity')) continue;
    const magnitude = Math.round(cond.severity * 20);
    if (magnitude === 0) continue;
    score -= magnitude;
    push(contributors, cond.id, 'pressure', -magnitude, `${cond.label} reduces available labor.`);
  }

  return { score, contributors };
}

function derivePublicLegitimacy(s) {
  let score = 50;
  const contributors = [];

  // Read the conserved legitimacy quantity via the governance ledger. This lens IS
  // legitimacy, so it uses the score verbatim (other lenses weight it differently).
  const gov = governanceLedger(s);
  if (gov.present) {
    score = gov.legitimacyScore;
    push(contributors, 'powerStructure.publicLegitimacy', gov.legitimacyLabel || 'measured', 0,
      `Governing legitimacy score: ${gov.legitimacyScore} (${gov.legitimacyLabel || 'unbanded'}).`);
  }

  // Active conditions that affect public_legitimacy (corruption etc.)
  for (const cond of deriveAllActiveConditions(s)) {
    if (!cond.affectedSystems.includes('public_legitimacy')) continue;
    const direction = cond.archetype === 'siege_lifted' ? +1 : -1;
    const magnitude = Math.round(cond.severity * 15) * direction;
    if (magnitude === 0) continue;
    score += magnitude;
    push(contributors, cond.id, direction > 0 ? 'lift' : 'pressure', magnitude,
      `${cond.label} ${direction > 0 ? 'lifts' : 'erodes'} public legitimacy.`);
  }

  return { score, contributors };
}

function deriveRulingAuthority(s) {
  let score = 50;
  const contributors = [];

  // Combination of governing legitimacy + governing faction power. Legitimacy via the
  // conserved governance ledger; this lens weights it 0.5.
  const gov = governanceLedger(s);
  if (gov.present) {
    const c = Math.round((gov.legitimacyScore - 50) * 0.5);
    if (c !== 0) {
      score += c;
      push(contributors, 'powerStructure.publicLegitimacy', gov.legitimacyLabel || 'measured', c,
        `Governing legitimacy ${gov.legitimacyScore} contributes ${c >= 0 ? '+' : ''}${c}.`);
    }
  }

  // Identify governing faction's power
  const profiles = deriveAllFactionProfiles(s);
  const governingName = s.powerStructure?.governingName || '';
  if (governingName && profiles.length) {
    const lower = governingName.toLowerCase();
    const gov = profiles.find(p => p.name && lower.includes(p.name.toLowerCase().split(/[\s/(]/)[0]));
    if (gov && typeof gov.power === 'number') {
      const c = Math.round((gov.power - 30) * 0.5);
      if (c !== 0) {
        score += c;
        push(contributors, gov.id, 'governing_power', c, `${gov.name} commands power ${gov.power}.`);
      }
    }
  }

  // Active conditions that affect ruling_authority
  for (const cond of deriveAllActiveConditions(s)) {
    if (!cond.affectedSystems.includes('public_legitimacy')
     && !cond.affectedSystems.includes('faction_power')) continue;
    if (cond.archetype === 'corruption_exposed') {
      const m = Math.round(cond.severity * 18);
      score -= m;
      push(contributors, cond.id, 'undermined', -m, `${cond.label} cripples the ability to govern.`);
    }
  }

  return { score, contributors };
}

function deriveFactionPower(s) {
  let score = 50;
  const contributors = [];

  // Healthy faction system = balance with a clear governing center.
  // We use the power-share spread among profiles.
  const profiles = deriveAllFactionProfiles(s);
  if (profiles.length === 0) {
    return { score: 50, contributors: [{ source: 'powerStructure', effect: 'neutral', delta: 0, reason: 'No factions to evaluate.' }] };
  }
  const powers = profiles.map(p => p.power || 0);
  const total = powers.reduce((a, b) => a + b, 0);
  const top = Math.max(...powers);
  const dominantShare = total > 0 ? top / total : 0;

  if (dominantShare >= 0.55) {
    score += 8;
    push(contributors, 'powerStructure.factions', 'concentrated', +8,
      `Top faction holds ${Math.round(dominantShare * 100)}% of power.`);
  } else if (dominantShare <= 0.30) {
    score -= 8;
    push(contributors, 'powerStructure.factions', 'fractured', -8,
      `No faction holds clear primacy (top share ${Math.round(dominantShare * 100)}%).`);
  }

  // Active conditions affecting faction_power
  for (const cond of deriveAllActiveConditions(s)) {
    if (!cond.affectedSystems.includes('faction_power')) continue;
    const magnitude = Math.round(cond.severity * 15);
    score -= magnitude;
    push(contributors, cond.id, 'destabilized', -magnitude, `${cond.label} destabilizes the faction system.`);
  }

  return { score, contributors };
}

function deriveTradeConnectivity(s) {
  let score = 50;
  const contributors = [];

  // Trade access from generator config. Canonical semantics map EVERY emitted
  // value (road/river/crossroads/port/coastal/isolated) and the legacy
  // major/minor/standard/none into a tier + score — so river/crossroads/port no
  // longer fall through to a neutral 0 (the bug this fixed).
  const trade = s.config?.tradeRouteAccess || s.tradeRouteAccess;
  const tradeSem = tradeRouteSemantics(trade);
  if (tradeSem.connectivity !== 0) {
    score += tradeSem.connectivity;
    push(contributors, 'config.tradeRouteAccess', tradeSem.tier, tradeSem.connectivity,
      tradeSem.isolated ? 'Settlement is isolated from regional trade.'
        : tradeSem.tier === 'major' ? `Settlement sits on a major trade route (${trade}).`
        : `Settlement has ${trade} trade access.`);
  }

  // Trade supply chains
  const chains = deriveAllSupplyChainStates(s);
  const tradeChains = chains.filter(c => c.needKey === 'trade');
  for (const c of tradeChains) {
    if (c.status === 'stable') { score += 5; push(contributors, c.id, 'stable', +5, `${c.name} runs normally.`); }
    else if (c.status !== 'stable') {
      const m = c.status === 'blocked' || c.status === 'collapsing' ? -18 : -8;
      score += m;
      push(contributors, c.id, c.status, m, `${c.name} is ${c.status}.`);
    }
  }

  // Active conditions
  for (const cond of deriveAllActiveConditions(s)) {
    if (!cond.affectedSystems.includes('trade_connectivity')) continue;
    const magnitude = Math.round(cond.severity * 18);
    score -= magnitude;
    push(contributors, cond.id, 'cut', -magnitude, `${cond.label} disrupts trade flows.`);
  }

  return { score, contributors };
}

function deriveHealingCapacity(s) {
  let score = 50;
  const contributors = [];

  // Institutions whose names suggest healing capacity (canonical classifier via healingLedger).
  const healers = healingLedger(s).healerCount;
  if (healers >= 3) {
    score += 12; push(contributors, 'institutions', 'broad', +12, `${healers} healing-capable institutions present.`);
  } else if (healers >= 1) {
    score += 6; push(contributors, 'institutions', 'limited', +6, `${healers} healing-capable institution(s).`);
  } else {
    score -= 10; push(contributors, 'institutions', 'absent', -10, 'No dedicated healing institutions found.');
  }

  // Active conditions
  for (const cond of deriveAllActiveConditions(s)) {
    if (!cond.affectedSystems.includes('healing_capacity')) continue;
    const magnitude = Math.round(cond.severity * 20);
    score -= magnitude;
    push(contributors, cond.id, 'overrun', -magnitude, `${cond.label} overwhelms healing capacity.`);
  }

  return { score, contributors };
}

function deriveDefenseReadiness(s) {
  let score = 50;
  const contributors = [];

  const def = s.defenseProfile || {};
  // Read the persisted numeric readiness (defenseProfile.readiness.score). Was a dead
  // read of def.readinessScore, which no generator produces — the generator computed
  // the number then kept only the label, so measured readiness never reached the
  // substrate. defenseGenerator now persists readiness.score; this consumes it.
  const readinessScore = def.readiness?.score;
  if (typeof readinessScore === 'number') {
    const c = Math.round((readinessScore - 50) * 0.6);
    score += c;
    push(contributors, 'defenseProfile.readiness.score', 'measured', c,
      `Defense readiness score: ${readinessScore}.`);
  }
  // Wall, garrison, walls present
  if (def.hasWalls === true || /wall|rampart|palisade/i.test(JSON.stringify(def))) {
    score += 6;
    push(contributors, 'defenseProfile', 'walled', +6, 'Defensive walls in place.');
  }

  // Active conditions
  for (const cond of deriveAllActiveConditions(s)) {
    if (!cond.affectedSystems.includes('defense_readiness')) continue;
    const direction = cond.archetype === 'siege_lifted' ? +1 : -1;
    const magnitude = Math.round(cond.severity * 12) * direction;
    score += magnitude;
    push(contributors, cond.id, direction > 0 ? 'recovering' : 'strained', magnitude,
      `${cond.label} ${direction > 0 ? 'restores' : 'taxes'} defense readiness.`);
  }

  return { score, contributors };
}

function deriveCriminalOpportunity(s) {
  let score = 50;
  const contributors = [];

  // Direct: blackMarketCapture if available
  const safety = s.economicState?.safetyProfile || s.safetyProfile || {};
  if (typeof safety.blackMarketCapture === 'number') {
    const c = Math.round(safety.blackMarketCapture * 0.4);
    score += c;
    push(contributors, 'safetyProfile.blackMarketCapture', 'capture', c,
      `Black-market capture at ${safety.blackMarketCapture}%.`);
  }

  // Faction power: criminal factions
  const profiles = deriveAllFactionProfiles(s);
  const criminal = profiles.find(p => p.archetype === 'criminal');
  if (criminal && typeof criminal.power === 'number') {
    const c = Math.round((criminal.power - 20) * 0.4);
    if (c !== 0) {
      score += c;
      push(contributors, criminal.id, 'criminal_power', c, `${criminal.name} influence is ${criminal.power}.`);
    }
  }

  // Active conditions
  for (const cond of deriveAllActiveConditions(s)) {
    if (!cond.affectedSystems.includes('criminal_opportunity')) continue;
    const magnitude = Math.round(cond.severity * 15);
    score += magnitude;
    push(contributors, cond.id, 'opening', magnitude, `${cond.label} opens new criminal opportunities.`);
  }

  return { score, contributors };
}

function deriveReligiousAuthority(s) {
  let score = 50;
  const contributors = [];

  const profiles = deriveAllFactionProfiles(s);
  const religious = profiles.find(p => p.archetype === 'religious');
  if (religious && typeof religious.power === 'number') {
    const c = Math.round((religious.power - 20) * 0.6);
    score += c;
    push(contributors, religious.id, 'religious_power', c, `${religious.name} carries power ${religious.power}.`);
  } else {
    score -= 5;
    push(contributors, 'powerStructure', 'no_religious', -5, 'No religious faction in the power structure.');
  }

  return { score, contributors };
}

function deriveHousingPressure(s) {
  // INVERTED: high score = LOW pressure (consistent with the other vars
  // where higher = better). Variable name kept for roadmap parity.
  let score = 50;
  const contributors = [];

  const pop = populationOf(s);
  // Without a real housing dataset, use population×stressors heuristic.
  const stressors = canonStressors(s);
  const refugeeStress = stressors.find(st => /refugee|displaced|influx|migrant/i.test(String(st?.type || st?.name || st)));
  if (refugeeStress) {
    score -= 18;
    push(contributors, 'stressors.refugee', 'influx', -18, 'Refugee influx strains available housing.');
  }
  if (pop >= 5000) { score -= 4; push(contributors, 'population', 'dense', -4, `Population ${pop} pushes housing demand.`); }
  return { score, contributors };
}

function deriveInfrastructureCondition(s) {
  let score = 50;
  const contributors = [];

  const def = s.defenseProfile || {};
  // Anchor infrastructure to the persisted defense scores: military already folds in
  // walls/fortification-chain health, economic folds in siege logistics, so their mean
  // is a real "built robustness" signal. Was a dead read of def.infrastructureScore,
  // which no generator produces — only the institution-count fallback ever ran.
  const sc = def.scores;
  if (sc && typeof sc.military === 'number' && typeof sc.economic === 'number') {
    const infra = (sc.military + sc.economic) / 2;
    const c = Math.round((infra - 50) * 0.6);
    score += c;
    push(contributors, 'defenseProfile.scores', 'measured', c,
      `Fortification + logistics scores imply infrastructure ~${Math.round(infra)}.`);
  } else {
    // No defense profile (un-generated / legacy) — infer from institution count.
    const instCount = Array.isArray(s.institutions) ? s.institutions.length : 0;
    if (instCount >= 15) { score += 10; push(contributors, 'institutions', 'dense', +10, `${instCount} institutions imply robust infrastructure.`); }
    else if (instCount <= 5) { score -= 6; push(contributors, 'institutions', 'thin', -6, `${instCount} institutions imply thin infrastructure.`); }
  }

  return { score, contributors };
}

function deriveMagicalStability(s) {
  let score = 50;
  const contributors = [];

  // Read via the conserved magic ledger (canonical band vocabulary). Behaviour-preserving:
  // an un-generated settlement keeps the old 'low' default; 'medium'/'none' stay neutral for
  // stability exactly as before, while high lifts and low limits it.
  const m = magicLedger(s);
  const band = m.present ? m.magicLevel : 'low';
  if (band === 'high') { score += 10; push(contributors, 'config.priorityMagic', 'high', +10, `High magic investment supports arcane stability.`); }
  else if (band === 'low') { score -= 5; push(contributors, 'config.priorityMagic', 'low', -5, `Low magic investment limits arcane resilience.`); }

  // Arcane factions present?
  const profiles = deriveAllFactionProfiles(s);
  const arcane = profiles.find(p => p.archetype === 'arcane');
  if (arcane) {
    score += 5;
    push(contributors, arcane.id, 'arcane_present', +5, `${arcane.name} provides arcane oversight.`);
  }

  return { score, contributors };
}

function deriveSocialTrust(s) {
  let score = 50;
  const contributors = [];

  // Strongly downstream of public legitimacy
  const leg = s.powerStructure?.publicLegitimacy;
  if (leg && typeof leg.score === 'number') {
    const c = Math.round((leg.score - 50) * 0.4);
    score += c;
    push(contributors, 'powerStructure.publicLegitimacy', 'tracks_legitimacy', c,
      `Public legitimacy ${leg.score} colors trust.`);
  }

  // Conditions that affect social_trust
  for (const cond of deriveAllActiveConditions(s)) {
    if (!cond.affectedSystems.includes('social_trust')) continue;
    const magnitude = Math.round(cond.severity * 15);
    score -= magnitude;
    push(contributors, cond.id, 'erodes', -magnitude, `${cond.label} erodes communal trust.`);
  }

  // Dominant-NPC removal stress
  const dominantNpcs = deriveAllNpcProfiles(s).filter(p => p.rank === 'dominant');
  if (dominantNpcs.length === 0) {
    score -= 4;
    push(contributors, 'npcs', 'no_dominant', -4, 'No dominant figures anchor public confidence.');
  }

  return { score, contributors };
}

// ── Composer ─────────────────────────────────────────────────────────────

const DERIVERS = Object.freeze({
  food_security:           deriveFoodSecurity,
  labor_capacity:          deriveLaborCapacity,
  public_legitimacy:       derivePublicLegitimacy,
  ruling_authority:        deriveRulingAuthority,
  faction_power:           deriveFactionPower,
  trade_connectivity:      deriveTradeConnectivity,
  healing_capacity:        deriveHealingCapacity,
  defense_readiness:       deriveDefenseReadiness,
  criminal_opportunity:    deriveCriminalOpportunity,
  religious_authority:     deriveReligiousAuthority,
  housing_pressure:        deriveHousingPressure,
  infrastructure_condition: deriveInfrastructureCondition,
  magical_stability:       deriveMagicalStability,
  social_trust:            deriveSocialTrust,
});

function finalizeVariable(name, raw, contributors) {
  const score = Math.max(0, Math.min(100, Math.round(raw)));
  return {
    variable: name,
    score,
    band: causalBand(score),
    contributors,
  };
}

/**
 * Derive a single named system variable. Useful when a consumer only
 * cares about one dimension (e.g. the AI overlay grounding a claim
 * about food security).
 *
 * @param {string} variable   One of SYSTEM_VARIABLES.
 * @param {Object} settlement
 * @returns {Object | null}    SystemVariable, or null for unknown variable.
 */
export function deriveSystemVariable(variable, settlement) {
  if (!variable || !DERIVERS[variable]) return null;
  if (!settlement) return finalizeVariable(variable, 50, []);
  const { score, contributors } = DERIVERS[variable](settlement);
  return finalizeVariable(variable, score, contributors);
}

/**
 * Derive the full causal substrate.
 *
 * @param {Object} settlement
 * @returns {Object} {
 *   variables: { [name]: SystemVariable },
 *   bands:     { [name]: CausalBand },
 *   scores:    { [name]: number },
 *   summary:   { surplus: string[], adequate: string[], strained: string[],
 *                critical: string[], collapsed: string[] },
 * }
 */
export function deriveCausalState(settlement) {
  const variables = {};
  for (const name of SYSTEM_VARIABLES) {
    if (!settlement) {
      variables[name] = finalizeVariable(name, 50, []);
    } else {
      const { score, contributors } = DERIVERS[name](settlement);
      variables[name] = finalizeVariable(name, score, contributors);
    }
  }
  const bands = {};
  const scores = {};
  const summary = { surplus: [], adequate: [], strained: [], critical: [], collapsed: [] };
  for (const name of SYSTEM_VARIABLES) {
    const v = variables[name];
    bands[name] = v.band;
    scores[name] = v.score;
    summary[v.band].push(name);
  }
  return { variables, bands, scores, summary };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/** Convenience accessor — band for one variable. */
export function bandForVariable(settlement, variable) {
  const v = deriveSystemVariable(variable, settlement);
  return v ? v.band : null;
}

/** Returns all variables currently at strained/critical/collapsed bands. */
export function pressuresOn(settlement) {
  const state = deriveCausalState(settlement);
  return [...state.summary.strained, ...state.summary.critical, ...state.summary.collapsed];
}

/**
 * Human-readable summary of what's wrong (or right) with the settlement
 * right now. Returns an array of single-line strings.
 */
export function summarizeCausalState(settlement) {
  const state = deriveCausalState(settlement);
  const out = [];
  if (state.summary.collapsed.length) {
    out.push(`Collapsed: ${state.summary.collapsed.join(', ')}.`);
  }
  if (state.summary.critical.length) {
    out.push(`Critical: ${state.summary.critical.join(', ')}.`);
  }
  if (state.summary.strained.length) {
    out.push(`Strained: ${state.summary.strained.join(', ')}.`);
  }
  if (state.summary.surplus.length) {
    out.push(`Surplus: ${state.summary.surplus.join(', ')}.`);
  }
  if (out.length === 0) out.push('All variables are within the adequate band.');
  return out;
}

/** Catalog accessor for tests + drift detectors + UI affordances. */
export function supportedSystemVariables() {
  return [...SYSTEM_VARIABLES];
}

// ── Variable polarity ────────────────────────────────────────────────────
// Most substrate variables are "higher is better." Two are inverted by
// name semantics — declared explicitly so consumers can render the
// right sign in deltas. (housing_pressure was deliberately inverted in
// the derivation so it matches the higher-is-better convention; the
// name is kept for roadmap parity.)

const HIGHER_IS_BETTER = new Set([
  'food_security', 'labor_capacity', 'public_legitimacy', 'ruling_authority',
  'faction_power', 'trade_connectivity', 'healing_capacity', 'defense_readiness',
  'religious_authority', 'housing_pressure', 'infrastructure_condition',
  'magical_stability', 'social_trust',
]);

const LOWER_IS_BETTER = new Set([
  'criminal_opportunity',
]);

export function variablePolarity(variable) {
  if (HIGHER_IS_BETTER.has(variable)) return 'higher_is_better';
  if (LOWER_IS_BETTER.has(variable))  return 'lower_is_better';
  return 'higher_is_better';
}

// ── compareCausalState ──────────────────────────────────────────────────
//
// Returns a structured delta list for two CausalState snapshots. Used
// by the Phase 18 event pipeline so the substrate-layer delta is
// reported alongside the legacy 4-dimension delta. Mirrors the shape of
// compareSystemState so consumers can render the two side-by-side.

const VARIABLE_LABEL = Object.freeze({
  food_security:           'Food security',
  labor_capacity:          'Labor capacity',
  public_legitimacy:       'Public legitimacy',
  ruling_authority:        'Ruling authority',
  faction_power:           'Faction power',
  trade_connectivity:      'Trade connectivity',
  healing_capacity:        'Healing capacity',
  defense_readiness:       'Defense readiness',
  criminal_opportunity:    'Criminal opportunity',
  religious_authority:     'Religious authority',
  housing_pressure:        'Housing pressure',
  infrastructure_condition: 'Infrastructure condition',
  magical_stability:       'Magical stability',
  social_trust:            'Social trust',
});

function explainCausalDelta(variable, before, after, change, bandBefore, bandAfter) {
  const label = VARIABLE_LABEL[variable] || variable;
  const polar = variablePolarity(variable);
  const dir = change > 0 ? 'rose' : 'fell';
  const mag = Math.abs(change) >= 15 ? 'sharply' : Math.abs(change) >= 7 ? 'noticeably' : 'slightly';
  const better = (polar === 'higher_is_better' && change > 0) ||
                 (polar === 'lower_is_better'  && change < 0);
  if (bandBefore !== bandAfter) {
    return `${label} ${dir} ${mag} (${bandBefore} → ${bandAfter})${better ? '' : ' — pressure increased'}`;
  }
  return `${label} ${dir} ${mag}${better ? '' : ' — pressure increased'}`;
}

/**
 * Diff two CausalState snapshots. Returns a structured delta entry per
 * variable that changed, sorted by absolute change descending.
 *
 * Each entry:
 *   { variable, before, after, change, bandBefore, bandAfter,
 *     polarity, explanation }
 */
export function compareCausalState(before, after) {
  if (!before || !after) return [];
  const out = [];
  for (const name of SYSTEM_VARIABLES) {
    const b = before.scores?.[name];
    const a = after.scores?.[name];
    if (typeof b !== 'number' || typeof a !== 'number') continue;
    const change = a - b;
    if (change === 0) continue;
    const bandBefore = before.bands?.[name] || causalBand(b);
    const bandAfter  = after.bands?.[name]  || causalBand(a);
    out.push({
      variable: name,
      before: b,
      after: a,
      change,
      bandBefore,
      bandAfter,
      polarity: variablePolarity(name),
      explanation: explainCausalDelta(name, b, a, change, bandBefore, bandAfter),
    });
  }
  out.sort((x, y) => Math.abs(y.change) - Math.abs(x.change));
  return out;
}
