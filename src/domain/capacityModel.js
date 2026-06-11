/**
 * domain/capacityModel.js — Supply-vs-demand modeling for the 9
 * canonical settlement capacities.
 *
 * Tier 4.4 of the roadmap. Phase 17 gave every system variable a
 * single score; for capacities specifically, the score is the *result*
 * of two competing pressures — supply (how much capacity exists) and
 * demand (how much is being asked of it). Phase 21 makes that supply
 * and demand structurally visible:
 *
 *   deriveCapacityProfile('labor', settlement) -> {
 *     capacity, supply, demand, ratio, band,
 *     supplyContributors, demandContributors,
 *     trajectory,
 *   }
 *
 * Why this matters:
 *   - Plague raises healing DEMAND but doesn't change supply (no new
 *     healers appear); Phase 17 collapses this into a single drop.
 *     Phase 21 surfaces "plague pushed healing capacity from
 *     adequate -> strained because demand rose, not because supply
 *     fell." That's a different story for AI / PDF / UI to tell.
 *   - Refugee influx raises FOOD DEMAND but adds LABOR SUPPLY. The
 *     same event affects two capacities in opposite directions —
 *     impossible to represent with a single substrate score.
 *
 * Coexistence with Phase 17 substrate:
 *   - Phase 17's `causalState` substrate keeps its 14 variables (some
 *     of which overlap conceptually with capacities). The Phase 17
 *     score remains the "headline" the AI/UI displays first; the
 *     Phase 21 capacity profile is the structurally explainable
 *     "why" the substrate quotes when answering "why is healing
 *     strained?"
 *
 * The canonical 9 capacities (per the roadmap):
 *   labor               — available worker-hours
 *   healing             — medical / magical healing
 *   defense             — military / watch / fortification
 *   administrative      — bureaucratic / governance throughput
 *   food_production     — farms, mills, fisheries, granaries
 *   transport           — roads, ports, caravans, river access
 *   religious_welfare   — temple relief, ritual support
 *   craft               — production output
 *   magical             — arcane availability
 *
 * Pure read-only derivation. No imports from src/lib. Composes
 * Phase 16 (active conditions) and Phase 20 (structured threats) so
 * capacity demand reflects current pressures.
 */

import { deriveAllActiveConditions } from './activeConditions.js';
import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveAllSupplyChainStates } from './supplyChainState.js';
import { deriveAllThreatProfiles } from './threatProfile.js';
import { tradeRouteSemantics, tradeRouteTier } from './tradeRouteSemantics.js';
import { canonStressors, canonExports } from './canonicalAccessors.js';
import { foodLedger } from './foodLedger.js';
import { defenseLedger } from './defenseLedger.js';
import { governanceLedger } from './governanceLedger.js';
import { magicLedger, ARCANE_INSTITUTION_PATTERN } from './magicLedger.js';
import { healingLedger } from './healingLedger.js';

// ── Canonical catalog ────────────────────────────────────────────────────

export const CAPACITY_NAMES = Object.freeze([
  'labor',
  'healing',
  'defense',
  'administrative',
  'food_production',
  'transport',
  'religious_welfare',
  'craft',
  'magical',
]);

export const CAPACITY_BANDS = Object.freeze([
  'surplus', 'adequate', 'strained', 'critical', 'collapsed',
  // Out-of-band: supply AND demand are both zero — the capacity does not
  // exist here and nothing asks for it (today: 'magical' in a
  // magicExists:false world, matching magicProfile's 'absent' vocabulary).
  // Not a strain level: strained/critical/collapsed filters exclude it.
  'absent',
]);

const CAPACITY_LABEL = Object.freeze({
  labor:             'Labor',
  healing:           'Healing',
  defense:           'Defense',
  administrative:    'Administrative',
  food_production:   'Food production',
  transport:         'Transport',
  religious_welfare: 'Religious welfare',
  craft:             'Craft',
  magical:           'Magical',
});

// ── Band derivation ──────────────────────────────────────────────────────
//
// Bands derive from the supply/demand ratio. Picked so 60/50 = 1.2 lands
// just at the surplus boundary; below 0.3 is collapsed (3:10 supply).
// Designed so a settlement with no signal (supply=demand=50) lands in
// adequate.

const RATIO_BOUNDS = Object.freeze({
  surplus:  1.20,
  adequate: 0.95,
  strained: 0.70,
  critical: 0.35,
});

/**
 * Map a supply/demand ratio to a capacity band.
 *   ≥1.20 surplus | ≥0.95 adequate | ≥0.70 strained | ≥0.35 critical
 *   else collapsed.
 */
export function capacityBand(ratio) {
  if (typeof ratio !== 'number' || !isFinite(ratio)) return 'adequate';
  if (ratio >= RATIO_BOUNDS.surplus)  return 'surplus';
  if (ratio >= RATIO_BOUNDS.adequate) return 'adequate';
  if (ratio >= RATIO_BOUNDS.strained) return 'strained';
  if (ratio >= RATIO_BOUNDS.critical) return 'critical';
  return 'collapsed';
}

// ── Supply / demand helpers ──────────────────────────────────────────────

function clamp(score) {
  return Math.max(0, Math.min(100, score));
}

function push(arr, source, effect, delta, reason) {
  arr.push({ source, effect, delta, reason });
}

function populationOf(settlement) {
  const pop = settlement?.population;
  if (typeof pop === 'number') return pop;
  if (pop && typeof pop === 'object' && typeof pop.total === 'number') return pop.total;
  return 0;
}

function institutionNamesMatching(settlement, pattern) {
  const inst = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  return inst.filter(i => pattern.test(String(i?.name || ''))).map(i => i?.name || '');
}

function factionPower(profiles, archetype) {
  const match = profiles.find(p => p.archetype === archetype);
  return match ? (match.power || 0) : 0;
}

// ── Per-capacity derivations ─────────────────────────────────────────────
//
// Each deriver returns { supply: number, demand: number, supplyContributors,
// demandContributors }. The composer wraps with the canonical envelope.

function deriveLabor(s, ctx) {
  const supplyContributors = [];
  const demandContributors = [];
  let supply = 50;
  let demand = 50;

  // SUPPLY: population scaling (sub-linear)
  const pop = populationOf(s);
  if (pop >= 5000) {
    supply += 15; push(supplyContributors, 'population', 'broad', +15, `Population ${pop} sustains a deep labor pool.`);
  } else if (pop >= 1000) {
    supply += 8; push(supplyContributors, 'population', 'adequate', +8, `Population ${pop} carries enough hands.`);
  } else if (pop > 0 && pop < 200) {
    supply -= 10; push(supplyContributors, 'population', 'thin', -10, `Population ${pop} leaves little slack.`);
  }

  // DEMAND: institutions need workers
  const instCount = Array.isArray(s.institutions) ? s.institutions.length : 0;
  if (instCount >= 15) {
    demand += 12; push(demandContributors, 'institutions', 'dense', +12, `${instCount} institutions to staff.`);
  } else if (instCount >= 8) {
    demand += 6; push(demandContributors, 'institutions', 'moderate', +6, `${instCount} institutions to staff.`);
  }

  // DEMAND boosts from active conditions
  for (const cond of ctx.conditions) {
    if (cond.archetype === 'plague') {
      const m = Math.round(cond.severity * 18);
      demand += m; push(demandContributors, cond.id, 'plague_load', +m, `${cond.label} demands extra hands for care and burial.`);
      // Plague also reduces SUPPLY (the sick can't work)
      const drop = Math.round(cond.severity * 15);
      supply -= drop; push(supplyContributors, cond.id, 'incapacitates', -drop, `${cond.label} sickens part of the labor force.`);
    }
    if (cond.archetype === 'food_anchor_lost') {
      demand += 5; push(demandContributors, cond.id, 'relief_load', +5, `${cond.label} drives relief work.`);
    }
  }

  return {
    supply: clamp(supply), demand: clamp(demand),
    supplyContributors, demandContributors,
  };
}

function deriveHealing(s, ctx) {
  const supplyContributors = [];
  const demandContributors = [];
  let supply = 40;
  let demand = 50;

  // SUPPLY: healing institutions (canonical classifier via healingLedger). When no healer-named
  // institution exists, offered healing SERVICES (wound care, medical care, relief) still provide
  // informal care (P3.3b Stage 4b) — so they rescue the harsh "absent" penalty rather than reading
  // as no healing at all. ~17% of generated settlements offer healing services without a
  // healer-named institution; they were being mis-read as having zero healing.
  const heal = healingLedger(s);
  const healers = heal.healerCount;
  if (healers >= 3) {
    supply += 25; push(supplyContributors, 'institutions', 'broad', +25, `${healers} healing-capable institutions.`);
  } else if (healers >= 1) {
    supply += 12; push(supplyContributors, 'institutions', 'limited', +12, `${healers} healing-capable institution(s).`);
  } else if (heal.services.length > 0) {
    supply += 4; push(supplyContributors, 'availableServices.healing', 'services_only', +4, `${heal.services.length} healing service(s) offered without a dedicated institution.`);
  } else {
    supply -= 10; push(supplyContributors, 'institutions', 'absent', -10, 'No dedicated healing institutions or services.');
  }

  // SUPPLY: magic level
  const magic = s.config?.magicLevel || 'low';
  if (magic === 'high' || magic === 'pervasive') {
    supply += 10; push(supplyContributors, 'config.magicLevel', 'high', +10, `High magic supports magical healing.`);
  }

  // SUPPLY: religious faction power supports relief
  const religiousPower = factionPower(ctx.profiles, 'religious');
  if (religiousPower >= 30) {
    supply += 8; push(supplyContributors, 'faction.religious', 'power', +8, `Religious faction at power ${religiousPower} bolsters relief.`);
  }

  // DEMAND: population baseline
  const pop = populationOf(s);
  if (pop >= 5000) { demand += 10; push(demandContributors, 'population', 'dense', +10, `Population ${pop} elevates baseline demand.`); }
  else if (pop >= 1000) { demand += 4; push(demandContributors, 'population', 'moderate', +4, `Population ${pop} sustains modest demand.`); }

  // DEMAND boosts from plague + war-like threats
  for (const cond of ctx.conditions) {
    if (cond.archetype === 'plague') {
      const m = Math.round(cond.severity * 35);
      demand += m; push(demandContributors, cond.id, 'plague', +m, `${cond.label} overwhelms healing.`);
    }
  }
  for (const threat of ctx.threats) {
    if (threat.type === 'siege' || threat.type === 'monster_pressure') {
      const m = Math.round(threat.severity * 12);
      demand += m; push(demandContributors, threat.id, threat.type, +m, `${threat.label} drives injury rates up.`);
    }
  }

  return {
    supply: clamp(supply), demand: clamp(demand),
    supplyContributors, demandContributors,
  };
}

function deriveDefense(s, ctx) {
  const supplyContributors = [];
  const demandContributors = [];
  let supply = 40;
  let demand = 50;

  // SUPPLY: conserved defense ledger (P3.3b Stage 1b). The measured military dimension
  // already folds in walls/garrison/militia/watch/mercenary plus terrain and supply-chain
  // modifiers (defenseGenerator.computeDefenseScores), so it is the single source for
  // institution-derived defense when a profile is present.
  const led = defenseLedger(s);
  if (led.present) {
    const c = Math.round((led.military - 50) * 0.4);
    supply += c; push(supplyContributors, 'defenseProfile.scores.military', 'measured', c,
      `Military readiness ${led.military} contributes ${c >= 0 ? '+' : ''}${c}.`);
  }

  // SUPPLY: walls / garrison institutions (FALLBACK ONLY — P3.3b de-dup). The military
  // score above already counts these institutions for generated settlements, so adding
  // them again would double-count; apply only for un-generated/legacy saves with no profile.
  if (!led.present) {
    const DEFENSE_PATTERN = /(wall|gate|garrison|watch|barracks|tower|fortress|militia|citadel)/i;
    const fortifications = institutionNamesMatching(s, DEFENSE_PATTERN);
    if (fortifications.length >= 2) {
      supply += 14; push(supplyContributors, 'institutions', 'fortified', +14, `${fortifications.length} defensive institutions.`);
    } else if (fortifications.length === 1) {
      supply += 7; push(supplyContributors, 'institutions', 'limited', +7, `One defensive institution.`);
    }
  }

  // SUPPLY: military faction power
  const milPower = factionPower(ctx.profiles, 'military');
  if (milPower >= 30) {
    supply += 8; push(supplyContributors, 'faction.military', 'power', +8, `Military faction at power ${milPower}.`);
  }

  // DEMAND: monsterThreat
  const monster = s.config?.monsterThreat || 'safe';
  if (monster === 'plagued') {
    demand += 25; push(demandContributors, 'config.monsterThreat', 'plagued', +25, 'Region overrun with monsters.');
  } else if (monster === 'frontier') {
    demand += 15; push(demandContributors, 'config.monsterThreat', 'frontier', +15, 'Frontier monster pressure.');
  }

  // DEMAND: threats
  for (const threat of ctx.threats) {
    if (['siege', 'bandit_raids', 'rival_neighbor', 'monster_pressure'].includes(threat.type)) {
      const m = Math.round(threat.severity * 15);
      demand += m; push(demandContributors, threat.id, threat.type, +m, `${threat.label} drives defense need.`);
    }
  }

  return {
    supply: clamp(supply), demand: clamp(demand),
    supplyContributors, demandContributors,
  };
}

function deriveAdministrative(s, ctx) {
  const supplyContributors = [];
  const demandContributors = [];
  let supply = 50;
  let demand = 50;

  // SUPPLY: civic institutions + governing faction power + legitimacy
  const CIVIC_PATTERN = /(court|hall|council|government|chancery|registry|moot|forum)/i;
  const civic = institutionNamesMatching(s, CIVIC_PATTERN);
  if (civic.length >= 2) {
    supply += 12; push(supplyContributors, 'institutions', 'civic', +12, `${civic.length} civic institutions.`);
  } else if (civic.length === 1) {
    supply += 5; push(supplyContributors, 'institutions', 'civic', +5, 'One civic institution.');
  } else {
    supply -= 8; push(supplyContributors, 'institutions', 'no_civic', -8, 'No civic institutions detected.');
  }

  // SUPPLY: legitimacy (read via the conserved governance ledger; this lens weights it 0.3).
  const gov = governanceLedger(s);
  if (gov.present) {
    const c = Math.round((gov.legitimacyScore - 50) * 0.3);
    supply += c; push(supplyContributors, 'powerStructure.publicLegitimacy', 'measured', c,
      `Legitimacy ${gov.legitimacyScore} contributes ${c >= 0 ? '+' : ''}${c}.`);
  }

  // SUPPLY: governing faction power
  const govPower = factionPower(ctx.profiles, 'government');
  if (govPower >= 30) {
    supply += 6; push(supplyContributors, 'faction.government', 'power', +6, `Government faction at power ${govPower}.`);
  }

  // DEMAND: population + institution count
  const pop = populationOf(s);
  const instCount = Array.isArray(s.institutions) ? s.institutions.length : 0;
  if (pop >= 5000) { demand += 12; push(demandContributors, 'population', 'dense', +12, `Population ${pop} needs more bureaucracy.`); }
  else if (pop >= 1000) { demand += 5; push(demandContributors, 'population', 'moderate', +5, `Population ${pop}.`); }
  if (instCount >= 15) {
    demand += 6; push(demandContributors, 'institutions', 'dense', +6, `${instCount} institutions to administrate.`);
  }

  // DEMAND from corruption (active condition or threat)
  for (const cond of ctx.conditions) {
    if (cond.archetype === 'corruption_exposed') {
      const m = Math.round(cond.severity * 12);
      demand += m; push(demandContributors, cond.id, 'corruption_load', +m, `${cond.label} demands investigative load.`);
    }
  }

  return {
    supply: clamp(supply), demand: clamp(demand),
    supplyContributors, demandContributors,
  };
}

function deriveFoodProduction(s, ctx) {
  const supplyContributors = [];
  const demandContributors = [];
  let supply = 45;
  let demand = 50;

  // SUPPLY: food institutions
  const FOOD_PATTERN = /(granary|mill|farm|orchard|fishery|bakery|brewery|silo)/i;
  const food = institutionNamesMatching(s, FOOD_PATTERN);
  if (food.length >= 3) {
    supply += 20; push(supplyContributors, 'institutions', 'broad', +20, `${food.length} food institutions.`);
  } else if (food.length >= 1) {
    supply += 10; push(supplyContributors, 'institutions', 'limited', +10, `${food.length} food institution(s).`);
  } else {
    supply -= 8; push(supplyContributors, 'institutions', 'no_food', -8, 'No dedicated food institutions.');
  }

  // SUPPLY: food supply chains. INTENTIONALLY ORTHOGONAL to the ledger below, NOT
  // a duplicate of it: these read ctx.chains, whose status is mutated POST-generation
  // by applyRegionalPressureToStatus (supplyChainState.js) in response to live
  // regional_* active conditions. The ledger's deficitPct is frozen at generation
  // (economicGenerator never recomputes foodSecurity on a world tick), so it cannot
  // see a mid-campaign route/import shock that these chains do. Do not fold these away.
  const chains = ctx.chains.filter(c => c.needKey === 'food_security');
  for (const c of chains) {
    if (c.status === 'stable') { supply += 6; push(supplyContributors, c.id, 'stable', +6, `${c.name} runs normally.`); }
    else if (c.status === 'collapsing' || c.status === 'blocked') {
      supply -= 15; push(supplyContributors, c.id, c.status, -15, `${c.name} is ${c.status}.`);
    } else if (c.status !== 'stable') {
      supply -= 6; push(supplyContributors, c.id, c.status, -6, `${c.name} is ${c.status}.`);
    }
  }

  // SUPPLY: conserved food ledger (P3.2). Anchor this capacity to foodGenerator's
  // caloric self-sufficiency so the two food lenses point the SAME direction — a
  // deficit town reads as strained food CAPACITY here, not just on the foodSecurity
  // label. Retires the "two food models can disagree" gap; banded to the same
  // thresholds the label + causal/resilience derivers use.
  const led = foodLedger(s);
  if (led.present) {
    if (led.deficitPct > 0) {
      const m = led.deficitPct > 40 ? 22 : led.deficitPct > 15 ? 12 : 5;
      supply -= m; push(supplyContributors, 'foodLedger', 'deficit', -m, `${led.deficitPct}% caloric deficit strains food supply.`);
    } else if (led.surplusPct >= 40) {
      supply += 8; push(supplyContributors, 'foodLedger', 'surplus', +8, `${led.surplusPct}% caloric surplus eases food supply.`);
    }
  }

  // SUPPLY: trade-route imports (FALLBACK ONLY — P3.3b de-dup). Major-tier routes
  // (crossroads/port) supplement food, but the SAME config.tradeRouteAccess already
  // drives importCoverageRate inside the ledger's deficitPct (foodGenerator.js: port
  // 0.70, crossroads 0.60, river 0.50, road 0.35). So when a ledger is present, adding
  // foodTrade.foodSupply here would double-count the import benefit. Apply it ONLY as a
  // fallback for un-generated / legacy settlements that carry no foodSecurity to read.
  if (!led.present) {
    const foodTrade = tradeRouteSemantics(s.config?.tradeRouteAccess);
    if (foodTrade.foodSupply !== 0) {
      supply += foodTrade.foodSupply;
      push(supplyContributors, 'config.tradeRouteAccess', foodTrade.tier, foodTrade.foodSupply, 'Strong trade route supplements food (no ledger; fallback).');
    }
  }

  // DEMAND: population
  const pop = populationOf(s);
  if (pop >= 5000) { demand += 15; push(demandContributors, 'population', 'dense', +15, `Population ${pop} elevates food demand.`); }
  else if (pop >= 1000) { demand += 6; push(demandContributors, 'population', 'moderate', +6, `Population ${pop}.`); }

  // DEMAND: food_anchor_lost + refugee influx (stressors regex)
  for (const cond of ctx.conditions) {
    if (cond.archetype === 'food_anchor_lost') {
      const m = Math.round(cond.severity * 18);
      demand += m; push(demandContributors, cond.id, 'anchor_lost', +m, `${cond.label} pushes everyone onto remaining sources.`);
    }
  }
  const stressors = canonStressors(s);
  if (stressors.some(st => /refugee|migrant|influx/i.test(String(st?.name || st?.type || st)))) {
    demand += 12; push(demandContributors, 'stressors.refugee', 'influx', +12, 'Refugee influx raises food demand.');
  }

  return {
    supply: clamp(supply), demand: clamp(demand),
    supplyContributors, demandContributors,
  };
}

function deriveTransport(s, _ctx) {
  const supplyContributors = [];
  const demandContributors = [];
  let supply = 45;
  let demand = 50;

  // SUPPLY: trade route access. Canonical semantics so river/crossroads/port get
  // their proper transport tier instead of falling through to neutral.
  const transTrade = tradeRouteSemantics(s.config?.tradeRouteAccess);
  if (transTrade.transport !== 0) {
    supply += transTrade.transport;
    push(supplyContributors, 'config.tradeRouteAccess', transTrade.tier, transTrade.transport,
      transTrade.isolated ? 'Isolated from regional transport.'
        : transTrade.tier === 'major' ? `Major trade route (${transTrade.value}).`
        : `${transTrade.value} trade access.`);
  }

  // SUPPLY: port / road institutions
  const TRANSPORT_PATTERN = /(port|dock|harbour|harbor|warehouse|stable|coach|ferry|bridge|road|caravan|wagon)/i;
  const trans = institutionNamesMatching(s, TRANSPORT_PATTERN);
  if (trans.length >= 2) {
    supply += 12; push(supplyContributors, 'institutions', 'broad', +12, `${trans.length} transport institutions.`);
  } else if (trans.length === 1) {
    supply += 5; push(supplyContributors, 'institutions', 'limited', +5, 'One transport institution.');
  }

  // DEMAND: settlement size + exports
  const pop = populationOf(s);
  if (pop >= 5000) { demand += 10; push(demandContributors, 'population', 'dense', +10, `Population ${pop} moves more goods.`); }
  const exports = canonExports(s);
  if (exports.length >= 4) {
    demand += 8; push(demandContributors, 'economicState.exports', 'broad', +8, `${exports.length} exports to move.`);
  } else if (exports.length >= 1) {
    demand += 3; push(demandContributors, 'economicState.exports', 'limited', +3, `${exports.length} export(s).`);
  }

  return {
    supply: clamp(supply), demand: clamp(demand),
    supplyContributors, demandContributors,
  };
}

function deriveReligiousWelfare(s, ctx) {
  const supplyContributors = [];
  const demandContributors = [];
  let supply = 40;
  let demand = 50;

  // SUPPLY: religious institutions + faction power
  const REL_PATTERN = /(temple|cathedral|monastery|chapel|abbey|shrine|sanctum|priory|congregation)/i;
  const rel = institutionNamesMatching(s, REL_PATTERN);
  if (rel.length >= 2) {
    supply += 18; push(supplyContributors, 'institutions', 'broad', +18, `${rel.length} religious institutions.`);
  } else if (rel.length === 1) {
    supply += 9; push(supplyContributors, 'institutions', 'limited', +9, 'One religious institution.');
  } else {
    supply -= 5; push(supplyContributors, 'institutions', 'none', -5, 'No religious institution.');
  }

  const relPower = factionPower(ctx.profiles, 'religious');
  if (relPower >= 30) {
    supply += 10; push(supplyContributors, 'faction.religious', 'power', +10, `Religious faction at power ${relPower}.`);
  }

  // DEMAND: population + crisis-driven relief
  const pop = populationOf(s);
  if (pop >= 1000) { demand += 5; push(demandContributors, 'population', 'baseline', +5, `Baseline demand from population ${pop}.`); }

  for (const cond of ctx.conditions) {
    if (cond.archetype === 'plague' || cond.archetype === 'food_anchor_lost') {
      const m = Math.round(cond.severity * 20);
      demand += m; push(demandContributors, cond.id, 'relief', +m, `${cond.label} drives relief demand.`);
    }
  }

  return {
    supply: clamp(supply), demand: clamp(demand),
    supplyContributors, demandContributors,
  };
}

function deriveCraft(s, ctx) {
  const supplyContributors = [];
  const demandContributors = [];
  let supply = 45;
  let demand = 50;

  // SUPPLY: craft institutions + craft faction
  const CRAFT_PATTERN = /(forge|smithy|workshop|guild|atelier|foundry|tannery|cooper|wheelwright|carpenter|mason)/i;
  const crafts = institutionNamesMatching(s, CRAFT_PATTERN);
  if (crafts.length >= 3) {
    supply += 18; push(supplyContributors, 'institutions', 'broad', +18, `${crafts.length} craft institutions.`);
  } else if (crafts.length >= 1) {
    supply += 9; push(supplyContributors, 'institutions', 'limited', +9, `${crafts.length} craft institution(s).`);
  }

  const craftPower = factionPower(ctx.profiles, 'craft');
  if (craftPower >= 30) {
    supply += 6; push(supplyContributors, 'faction.craft', 'power', +6, `Craft faction at power ${craftPower}.`);
  }

  // SUPPLY: trade for raw materials. Any connected route (major or standard tier)
  // supplies raw materials; isolated/unknown contribute nothing. Canonical tier so
  // river/crossroads/port are no longer mis-read as isolated.
  const rawTier = tradeRouteTier(s.config?.tradeRouteAccess);
  if (rawTier === 'major' || rawTier === 'standard') {
    supply += 4; push(supplyContributors, 'config.tradeRouteAccess', rawTier, +4, 'Trade route supplies raw materials.');
  }

  // DEMAND: population + exports
  const pop = populationOf(s);
  if (pop >= 5000) { demand += 12; push(demandContributors, 'population', 'dense', +12, `Population ${pop} consumes more.`); }
  else if (pop >= 1000) { demand += 5; push(demandContributors, 'population', 'moderate', +5, `Population ${pop}.`); }

  const exports = canonExports(s);
  if (exports.length >= 2) {
    demand += 6; push(demandContributors, 'economicState.exports', 'broad', +6, `${exports.length} exports — sustained output demand.`);
  }

  return {
    supply: clamp(supply), demand: clamp(demand),
    supplyContributors, demandContributors,
  };
}

function deriveMagical(s, ctx) {
  const supplyContributors = [];
  const demandContributors = [];

  // Dead-magic guard (W5#3): in a magicExists:false world there is no arcane
  // supply and nothing demands one — mirror magicLedger zeroing the dial
  // (effective priorityMagic 0). Zero both sides so the composer bands this
  // 'absent' instead of pretending a 40/45 near-adequate arcane capacity.
  if (s?.config?.magicExists === false) {
    push(supplyContributors, 'config.magicExists', 'absent', 0,
      'Magic does not function in this world; no arcane capacity exists or is demanded.');
    return { supply: 0, demand: 0, supplyContributors, demandContributors };
  }

  let supply = 40;
  let demand = 45;

  // SUPPLY: magic investment (conserved dial via magicLedger). The band is canonical
  // (none/low/medium/high), so a 'medium' settlement is no longer silently missed by a
  // stale 'moderate' string check — it now gets its intended +10 instead of 0.
  const m = magicLedger(s);
  if (m.present) {
    if (m.magicLevel === 'high') {
      supply += 22; push(supplyContributors, 'config.priorityMagic', 'high', +22, `High magic investment (${m.priorityMagic}) supports broad arcane availability.`);
    } else if (m.magicLevel === 'medium') {
      supply += 10; push(supplyContributors, 'config.priorityMagic', 'medium', +10, `Moderate magic investment (${m.priorityMagic}).`);
    } else {
      supply -= 8; push(supplyContributors, 'config.priorityMagic', m.magicLevel, -8, `${m.magicLevel} magic investment limits availability.`);
    }
  }

  const arcane = institutionNamesMatching(s, ARCANE_INSTITUTION_PATTERN);
  if (arcane.length >= 1) {
    supply += 10; push(supplyContributors, 'institutions', 'arcane', +10, `${arcane.length} arcane institution(s).`);
  }

  const arcanePower = factionPower(ctx.profiles, 'arcane');
  if (arcanePower >= 25) {
    supply += 8; push(supplyContributors, 'faction.arcane', 'power', +8, `Arcane faction at power ${arcanePower}.`);
  }

  // DEMAND: threats requiring magical response + magical conditions
  for (const threat of ctx.threats) {
    if (threat.type === 'arcane_instability' || threat.type === 'cult') {
      const m = Math.round(threat.severity * 14);
      demand += m; push(demandContributors, threat.id, threat.type, +m, `${threat.label} requires arcane response.`);
    }
  }

  return {
    supply: clamp(supply), demand: clamp(demand),
    supplyContributors, demandContributors,
  };
}

// ── Composer ─────────────────────────────────────────────────────────────

const DERIVERS = Object.freeze({
  labor:             deriveLabor,
  healing:           deriveHealing,
  defense:           deriveDefense,
  administrative:    deriveAdministrative,
  food_production:   deriveFoodProduction,
  transport:         deriveTransport,
  religious_welfare: deriveReligiousWelfare,
  craft:             deriveCraft,
  magical:           deriveMagical,
});

// Trajectory (W5#5): a capacity's trajectory follows the WORST status among
// the active conditions that actually fed it — derivers push condition-driven
// contributor rows with source = condition.id, so the join is exact.
// Precedence worsening > easing > stable: a capacity dragged by a worsening
// condition trends 'worsening'; one whose condition pressures are ALL easing
// trends 'improving'; anything else (no condition input, or mixed
// easing/stable) holds 'stable'. Vocabulary matches the CapacityProfile
// typedef ('improving' | 'stable' | 'worsening').
function conditionTrajectory(conditions, supplyContributors, demandContributors) {
  if (!Array.isArray(conditions) || conditions.length === 0) return 'stable';
  const sources = new Set([
    ...supplyContributors.map(c => c.source),
    ...demandContributors.map(c => c.source),
  ]);
  const fed = conditions.filter(c => sources.has(c.id));
  if (fed.length === 0) return 'stable';
  if (fed.some(c => c.status === 'worsening')) return 'worsening';
  if (fed.every(c => c.status === 'easing')) return 'improving';
  return 'stable';
}

function finalizeCapacity(name, supply, demand, supplyContributors, demandContributors, conditions = []) {
  // 0/0 is not a ratio story: the capacity simply is not present (today:
  // magical in a dead-magic world). Band it 'absent' instead of letting the
  // zero-demand guard below read as a phantom surplus.
  const absent = supply <= 0 && demand <= 0;
  const ratio = absent ? 0 : demand <= 0 ? 2.0 : supply / demand;
  return {
    capacity: name,
    label: CAPACITY_LABEL[name] || name,
    supply,
    demand,
    ratio: Math.round(ratio * 100) / 100,
    band: absent ? 'absent' : capacityBand(ratio),
    supplyContributors,
    demandContributors,
    trajectory: conditionTrajectory(conditions, supplyContributors, demandContributors),
  };
}

/**
 * Build the context (active conditions, threats, factions, chains)
 * once per settlement so each capacity deriver doesn't re-derive.
 */
function buildContext(settlement) {
  return {
    conditions: deriveAllActiveConditions(settlement),
    profiles:   deriveAllFactionProfiles(settlement),
    chains:     deriveAllSupplyChainStates(settlement),
    threats:    deriveAllThreatProfiles(settlement),
  };
}

/**
 * Derive one named capacity profile.
 *
 * @param {string} name        One of CAPACITY_NAMES.
 * @param {Object} settlement
 * @returns {Object | null}    CapacityProfile, or null for unknown.
 */
export function deriveCapacityProfile(name, settlement) {
  if (!name || !DERIVERS[name]) return null;
  if (!settlement) return finalizeCapacity(name, 50, 50, [], []);
  const ctx = buildContext(settlement);
  const { supply, demand, supplyContributors, demandContributors } = DERIVERS[name](settlement, ctx);
  return finalizeCapacity(name, supply, demand, supplyContributors, demandContributors, ctx.conditions);
}

/**
 * Derive every canonical capacity. Builds context once.
 *
 * @param {Object} settlement
 * @returns {Object} {
 *   capacities: { [name]: CapacityProfile },
 *   bands: { [name]: CapacityBand },
 *   ratios: { [name]: number },
 *   summary: { surplus, adequate, strained, critical, collapsed, absent },
 * }
 */
export function deriveAllCapacities(settlement) {
  if (!settlement) {
    const empty = {};
    const bands = {};
    const ratios = {};
    for (const name of CAPACITY_NAMES) {
      empty[name] = finalizeCapacity(name, 50, 50, [], []);
      bands[name] = 'adequate';
      ratios[name] = 1.0;
    }
    return {
      capacities: empty,
      bands,
      ratios,
      summary: { surplus: [], adequate: [...CAPACITY_NAMES], strained: [], critical: [], collapsed: [], absent: [] },
    };
  }

  const ctx = buildContext(settlement);
  const capacities = {};
  const bands = {};
  const ratios = {};
  const summary = { surplus: [], adequate: [], strained: [], critical: [], collapsed: [], absent: [] };

  for (const name of CAPACITY_NAMES) {
    const { supply, demand, supplyContributors, demandContributors } = DERIVERS[name](settlement, ctx);
    const profile = finalizeCapacity(name, supply, demand, supplyContributors, demandContributors, ctx.conditions);
    capacities[name] = profile;
    bands[name] = profile.band;
    ratios[name] = profile.ratio;
    summary[profile.band].push(name);
  }

  return { capacities, bands, ratios, summary };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/** Count capacities at each band. */
export function capacityBreakdown(settlement) {
  const out = { surplus: 0, adequate: 0, strained: 0, critical: 0, collapsed: 0, absent: 0 };
  const state = deriveAllCapacities(settlement);
  for (const name of CAPACITY_NAMES) {
    const band = state.bands[name];
    if (out[band] !== undefined) out[band] += 1;
  }
  return out;
}

/** Human-readable lines suitable for AI / PDF / UI. */
export function summarizeCapacities(settlement) {
  const state = deriveAllCapacities(settlement);
  const out = [];
  for (const name of CAPACITY_NAMES) {
    const p = state.capacities[name];
    out.push(`${p.label} — ${p.band} (supply ${p.supply}, demand ${p.demand}, ratio ${p.ratio}).`);
  }
  return out;
}

/** Capacities currently at strained/critical/collapsed. */
export function strainedCapacities(settlement) {
  const state = deriveAllCapacities(settlement);
  return [...state.summary.strained, ...state.summary.critical, ...state.summary.collapsed];
}

/** Catalog accessor. */
export function supportedCapacities() {
  return [...CAPACITY_NAMES];
}

// ── compareCapacityStates ────────────────────────────────────────────────
//
// Diff two capacity states (the envelope from deriveAllCapacities).
// Returns a structured delta entry per capacity that changed, sorted
// by absolute ratio change descending. Mirrors compareSystemState /
// compareCausalState so consumers render all three the same way.

const CAPACITY_LABEL_LOOKUP = CAPACITY_LABEL;

/**
 * @typedef {Object} CapacityDelta
 * @property {string} capacity
 * @property {string} label
 * @property {{supply: number, demand: number, ratio: number, band: string}} before
 * @property {{supply: number, demand: number, ratio: number, band: string}} after
 * @property {number} supplyChange
 * @property {number} demandChange
 * @property {number} ratioChange
 * @property {string} explanation
 */

function explainCapacityDelta(name, beforeBand, afterBand, supplyChange, demandChange, ratioChange) {
  const label = CAPACITY_LABEL_LOOKUP[name] || name;
  if (beforeBand !== afterBand) {
    return `${label} ${ratioChange < 0 ? 'fell' : 'rose'} ${beforeBand} → ${afterBand}`
      + (Math.abs(supplyChange) >= Math.abs(demandChange)
          ? ` (supply ${supplyChange >= 0 ? '+' : ''}${supplyChange}).`
          : ` (demand ${demandChange >= 0 ? '+' : ''}${demandChange}).`);
  }
  if (Math.abs(supplyChange) > Math.abs(demandChange)) {
    return `${label} supply ${supplyChange >= 0 ? 'rose' : 'fell'} by ${Math.abs(supplyChange)}.`;
  }
  return `${label} demand ${demandChange >= 0 ? 'rose' : 'fell'} by ${Math.abs(demandChange)}.`;
}

/**
 * Diff two capacity states. Returns structured deltas for every
 * capacity whose supply, demand, or band changed.
 *
 * @param {Object} before  Output of deriveAllCapacities.
 * @param {Object} after   Output of deriveAllCapacities.
 * @returns {CapacityDelta[]}
 */
export function compareCapacityStates(before, after) {
  if (!before || !after) return [];
  const out = [];
  for (const name of CAPACITY_NAMES) {
    const b = before.capacities?.[name];
    const a = after.capacities?.[name];
    if (!b || !a) continue;
    const supplyChange = a.supply - b.supply;
    const demandChange = a.demand - b.demand;
    const ratioChange = a.ratio - b.ratio;
    if (supplyChange === 0 && demandChange === 0 && b.band === a.band) continue;
    out.push({
      capacity: name,
      label: CAPACITY_LABEL_LOOKUP[name] || name,
      before: { supply: b.supply, demand: b.demand, ratio: b.ratio, band: b.band },
      after:  { supply: a.supply, demand: a.demand, ratio: a.ratio, band: a.band },
      supplyChange,
      demandChange,
      ratioChange: Math.round(ratioChange * 100) / 100,
      explanation: explainCapacityDelta(name, b.band, a.band, supplyChange, demandChange, ratioChange),
    });
  }
  out.sort((x, y) => Math.abs(y.ratioChange) - Math.abs(x.ratioChange));
  return out;
}
