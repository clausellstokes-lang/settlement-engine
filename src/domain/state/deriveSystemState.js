/**
 * domain/state/deriveSystemState.js — Reduce a generated settlement to
 * four user-facing health/pressure dimensions.
 *
 * Why four (not ten): the architect critique pushed for ten dimensions on
 * a 0–100 scale. Ten is too many — DMs don't think in spreadsheets, and
 * adding more dimensions multiplies the surfaces where the math can lie.
 * Four is the floor: enough to express resilience vs volatility vs
 * external vs resource pressure separately, but few enough that each one
 * earns its place in the UI. Add a fifth only when a UI consumer demands
 * it.
 *
 * Why no new generation: this function reads what the engine already
 * produces (economicState, factions, stresses, monster threat, depleted
 * resources) and unifies it into a single state snapshot. No new
 * randomness, no new content, no new dependencies. That keeps the
 * derivation cheap to call (once per generation, once per applied event)
 * and impossible to drift from the underlying simulation.
 *
 * The function is intentionally tolerant: a sparse settlement (early
 * pipeline output, partial rerun, headless test) returns a usable state
 * with neutral defaults. Never throws.
 */

import { bandFor, clamp01 } from './bands.js';
import { deriveExportPosture } from '../display/dossierViewModel.js';
import { isIsolatedRoute } from '../tradeRouteSemantics.js';
import { canonStressors, canonImports } from '../canonicalAccessors.js';
import { deriveAllActiveConditions } from '../activeConditions.js';
import { foodLedger } from '../foodLedger.js';
import { governanceLedger } from '../governanceLedger.js';
import { prosperityRank } from '../../data/constants.js';
import { isCovertOnlyImpairment } from '../entities/status.js';

/** @typedef {import('../types.js').SystemState} SystemState */
/** @typedef {import('../types.js').StateDimension} StateDimension */


/**
 * @param {Object} settlement — the engine's settlement object
 * @returns {SystemState}
 */
export function deriveSystemState(settlement) {
  const s = settlement || {};
  return {
    resilience:       deriveResilience(s),
    volatility:       deriveVolatility(s),
    externalThreat:   deriveExternalThreat(s),
    resourcePressure: deriveResourcePressure(s),
  };
}

// ── Resilience ──────────────────────────────────────────────────────────────
/**
 * Can the settlement absorb shocks? Drivers: prosperity, food security,
 * income/export diversity, public legitimacy. Famine, single-source
 * exports, and impaired institutions push it down.
 * @param {any} s
 */
function deriveResilience(s) {
  let value = 50;
  const drivers = [];
  const risks = [];

  // Prosperity is a strong signal — graded across the CANONICAL tier vocabulary
  // (constants.PROSPERITY_TIERS). The old code matched 'Wealthy/Prosperous' and
  // 'Subsistence/Struggling' plus a 'Modest' the generator never emits, so the three
  // most common middle tiers (Poor/Moderate/Comfortable) contributed ZERO resilience
  // signal — the headline shock-absorption dial ignored most towns' economies.
  const econ = s.economicState || {};
  const prosperity = econ.prosperity?.tier || econ.prosperity || null;
  const pRank = prosperityRank(prosperity);
  if (pRank >= 5) {            // Prosperous, Wealthy
    value += 15;
    drivers.push(`Settlement is ${String(prosperity).toLowerCase()}`);
  } else if (pRank === 4) {    // Comfortable
    value += 8;
    drivers.push('Comfortable prosperity cushions shocks');
  } else if (pRank === 3) {    // Moderate
    drivers.push('Moderate prosperity');
  } else if (pRank === 2) {    // Poor
    value -= 8;
    risks.push('Poverty leaves little buffer');
  } else if (pRank >= 0) {     // Struggling, Subsistence
    value -= 15;
    risks.push(`Settlement is ${String(prosperity).toLowerCase()}`);
  }

  // Food security, via the conserved ledger. The old code read `deficitMonths`/
  // `surplusMonths` — fields foodGenerator never produces — so this penalty was
  // silently dead (a famine town's resilience never dropped for it). The ledger
  // reads the real quantities (deficitPct/surplusPct), banded to align with the
  // foodSecurity label thresholds.
  const food = foodLedger(s);
  if (food.present) {
    if (food.deficitPct > 0) {
      const penalty = food.deficitPct > 40 ? 20 : food.deficitPct > 15 ? 12 : food.deficitPct > 5 ? 6 : 3;
      value -= penalty;
      risks.push(`${food.deficitPct}% food deficit`);
    } else if (food.surplusPct >= 40) {
      value += 8;
      drivers.push(`${food.surplusPct}% food surplus`);
    }
  }

  // Export/import diversity — many narrow exports = fragile. Source the count
  // from the display model's exportPosture (canonicalViewModel was PROMOTED
  // default-on; the legacy `canonExports(s).length` branch was reachable only via
  // a flag override — a URL/localStorage/env read inside an otherwise-pure domain
  // function. Removed so deriveSystemState is a pure function of `s` alone.)
  const exportCount = deriveExportPosture(s).count;
  if (exportCount === 0) {
    risks.push('No exports. Economic isolation.');
  } else if (exportCount >= 5) {
    value += 5;
    drivers.push(`Diversified exports (${exportCount})`);
  } else if (exportCount === 1) {
    value -= 5;
    risks.push('Single-export dependency');
  }

  // Impaired/degraded institutions. A COVERT mark (an institution-scope Impose
  // Corruption that quietly captured a node) bumps the institution's status to
  // 'impaired' via withImpairment, but it is hidden by design — surfacing it as a
  // visible "impaired institution" risk here would leak the covert capture into
  // public derived state. Exclude institutions whose impairment is solely covert.
  // 'impaired' is the ONLY degraded status the entity model emits (see
  // status.js EntityStatus: active|impaired|removed|destroyed|vacant). The old
  // list also counted 'critical', which no institution ever carries — a dead
  // branch ('critical' is a capacity/severity BAND elsewhere, never a status),
  // so it matched nothing and only misled the reader. Reconciled to the real status.
  const impaired = countByStatus(s.institutions, ['impaired'], { excludeCovertOnly: true });
  if (impaired > 0) {
    value -= Math.min(15, impaired * 4);
    risks.push(`${impaired} impaired institution${impaired === 1 ? '' : 's'}`);
  }

  // War-layer economic drain (S2). A war_drain condition is the SOURCE of the
  // economic_capacity homeostasis loop — a campaign abroad bleeds the home
  // economy. Additive: present only on a settlement actively waging war, so a
  // peacetime settlement's resilience is unchanged. Severity-scaled penalty
  // mirrors the deriveEconomicCapacity drain (severity×18, banded to this dial).
  const { warDrain } = readWarReligionMovement(s);
  if (warDrain) {
    const penalty = Math.min(15, Math.round((warDrain.severity || 0) * 18));
    if (penalty > 0) {
      value -= penalty;
      risks.push('War economy is bleeding the home treasury');
    }
  }

  return finalize(value, drivers, risks);
}

// ── Volatility ─────────────────────────────────────────────────────────────
/**
 * How close is internal conflict? Drivers: faction count, hostile
 * relationships between factions, criminal capture, low public
 * legitimacy. A stable monoculture scores low; a town with rivals,
 * thieves' guilds, and weak rulers scores high.
 * @param {any} s
 */
function deriveVolatility(s) {
  let value = 30; // baseline — most towns have some friction
  const drivers = [];
  const risks = [];

  const power = s.powerStructure || {};
  const factions = power.factions || s.factions || [];
  if (factions.length >= 5) {
    value += 10;
    risks.push(`${factions.length} active factions competing`);
  } else if (factions.length <= 2) {
    value -= 5;
    drivers.push('Few factions (concentrated power)');
  }

  // Hostile/rival faction relationships
  const conflicts = (power.conflicts || s.conflicts || []).length;
  if (conflicts > 0) {
    value += Math.min(20, conflicts * 5);
    risks.push(`${conflicts} active faction conflict${conflicts === 1 ? '' : 's'}`);
  }

  // Criminal capture: when shadow networks have outsized influence
  const safety = econOf(s).safetyProfile || s.safetyProfile || {};
  const blackMarketCapture = safety.blackMarketCapture || 0;
  if (blackMarketCapture >= 30) {
    value += 15;
    risks.push(`Heavy criminal capture (${blackMarketCapture}%)`);
  } else if (blackMarketCapture >= 15) {
    value += 8;
    risks.push(`Moderate criminal capture (${blackMarketCapture}%)`);
  } else if (blackMarketCapture <= 5 && blackMarketCapture > 0) {
    drivers.push('Crime well-suppressed');
  }

  // Public legitimacy — when the rulers are doubted, the place wobbles. Read the conserved
  // quantity via the governance ledger (handles the { score } object + legacy bare number
  // uniformly); this lens applies destabilisation thresholds rather than a linear transfer.
  const gov = governanceLedger(s);
  if (gov.present) {
    if (gov.legitimacyScore <= 30) {
      value += 12;
      risks.push('Ruling order has lost public legitimacy');
    } else if (gov.legitimacyScore >= 70) {
      value -= 8;
      drivers.push('Strong public legitimacy');
    }
  }

  // Stress count. Read the canonical container first (`stressors`,
  // post-Tier-1.2), then fall back to legacy aliases `stress` and the
  // older `stresses`. A consumer reading from a partially-migrated
  // settlement should still see a consistent count. `pickArray` guards
  // against intermediate consumers that wrap stress in an object
  // ({ count, items, ... }) instead of leaving it as a bare array.
  const stresses = canonStressors(s);
  if (stresses.length >= 3) {
    value += 8;
    risks.push(`${stresses.length} active stressors`);
  }

  // Religion-layer movement (S2). A dominant primary deity anchors religious
  // authority — a named driver on the internal-conflict axis (a unifying state
  // cult concentrates social authority and damps faction friction; a fringe cult
  // is a weaker anchor). Additive: present ONLY when a deity is assigned, so a
  // deity-free settlement is byte-identical. Tier-scaled to match
  // deriveReligiousAuthority's DEITY_RANK_AUTHORITY (major anchors most).
  const { deity } = readWarReligionMovement(s);
  if (deity) {
    const rank = String(deity.rankAxis || '').toLowerCase();
    const name = deity.name || 'the patron deity';
    if (rank === 'major') {
      value -= 6;
      drivers.push(`${name} anchors religious authority`);
    } else if (rank === 'minor' || rank === 'cult') {
      value -= 2;
      drivers.push(`${name} shapes religious authority`);
    }
  }

  return finalize(value, drivers, risks);
}

// ── External Threat ────────────────────────────────────────────────────────
/**
 * How much pressure comes from outside the settlement? Monster threat,
 * hostile neighbours, raids/sieges/occupation in stressors.
 * @param {any} s
 */
function deriveExternalThreat(s) {
  let value = 30;
  const drivers = [];
  const risks = [];

  const monsterThreat = s.config?.monsterThreat || 'safe';
  if (monsterThreat === 'plagued') {
    value += 30;
    risks.push('Region is plagued by monsters');
  } else if (monsterThreat === 'frontier') {
    value += 15;
    risks.push('Frontier conditions. Monsters present.');
  } else if (monsterThreat === 'safe' || monsterThreat === 'civilized') {
    value -= 5;
    drivers.push('Monster activity minimal');
  }

  // Hostile neighbour relationships (network effects)
  const network = s.neighbourNetwork || s.neighbourLinks || [];
  const hostile = network.filter((/** @type {any} */ n) => n.relationshipType === 'hostile' || n.relationshipType === 'cold_war').length;
  if (hostile > 0) {
    value += Math.min(20, hostile * 8);
    risks.push(`${hostile} hostile neighbour${hostile === 1 ? '' : 's'}`);
  }

  // Threat-tagged stresses. Same canonical-then-legacy fallback as
  // resilience above; without it, the threat dimension silently zeros
  // out on settlements that only carry the new `stressors` field.
  const stressList = canonStressors(s);
  const threatStresses = stressList.filter((/** @type {any} */ st) => {
    const t = String(st.type || st.name || '').toLowerCase();
    return t.includes('siege') || t.includes('occupation') || t.includes('raid')
        || t.includes('plague') || t.includes('war') || t.includes('refugee');
  });
  if (threatStresses.length > 0) {
    value += Math.min(20, threatStresses.length * 8);
    risks.push(`Active threat: ${threatStresses.map((/** @type {any} */ t) => t.name || t.type).join(', ')}`);
  }

  // War-layer conditions (S2). A PULSE-born war surfaces as a CONDITION, not a
  // stress[] entry — so the threatStresses scan above (which reads stress TYPE)
  // misses it. war_pressure is the besieged VICTIM under active war; army_deployed
  // marks an army committed to a campaign abroad. Additive — present only on a
  // settlement the war layer has touched, so a peacetime save is unchanged.
  const { warPressure, armyDeployed } = readWarReligionMovement(s);
  if (warPressure) {
    value += Math.min(16, Math.round((warPressure.severity || 0) * 20));
    risks.push('Under active wartime pressure');
  }
  if (armyDeployed) {
    value += 6;
    risks.push('Standing army deployed abroad. Home garrison thinned.');
  }

  return finalize(value, drivers, risks);
}

// ── Resource Pressure ──────────────────────────────────────────────────────
/**
 * Are key materials under strain? Depleted resources, narrow chain
 * dependencies, unmet imports. High value = the place will hurt soon.
 * @param {any} s
 */
function deriveResourcePressure(s) {
  let value = 30;
  const drivers = [];
  const risks = [];

  // Depleted resources
  const resourceState = s.config?.nearbyResourcesState || {};
  const depleted = Object.entries(resourceState).filter(([, st]) => st === 'depleted');
  if (depleted.length > 0) {
    value += Math.min(25, depleted.length * 8);
    risks.push(`${depleted.length} depleted resource${depleted.length === 1 ? '' : 's'}`);
  }

  // Chain vulnerabilities
  const econ = econOf(s);
  const chains = econ.activeChains || [];
  const vulnerable = chains.filter((/** @type {any} */ c) => c.resourceDepleted || c.substituteActive).length;
  if (vulnerable > 0) {
    value += Math.min(15, vulnerable * 5);
    risks.push(`${vulnerable} vulnerable supply chain${vulnerable === 1 ? '' : 's'}`);
  }

  // Unmet imports — high import dependency without a real trade route. Canonical
  // isolation check so 'none'/'isolated' (and any future synonym) are treated alike.
  const tradeAccess = s.config?.tradeRouteAccess || 'none';
  const isolatedRoute = isIsolatedRoute(tradeAccess);
  const imports = canonImports(s).length;
  if (imports >= 4 && isolatedRoute) {
    value += 12;
    risks.push(`${imports} imports needed but no real trade route`);
  } else if (imports >= 1 && !isolatedRoute) {
    drivers.push(`${imports} imports via ${tradeAccess}`);
  }

  return finalize(value, drivers, risks);
}

// ── War / religion causal movement (S2) ──────────────────────────────────────
/**
 * Read the war-layer + religion causal movement once. These are the conditions /
 * embedded snapshot the world pulse stamps; every entry below is ADDITIVE — it
 * only contributes when the matching condition/deity is present, so a settlement
 * with NO war/religion state produces byte-identical drivers/risks to before.
 *
 *   - war_drain   (→ economic_capacity): a campaign abroad is bleeding the home
 *     economy; surfaces as a FALLING economic driver labeled for war.
 *   - war_pressure (→ defense/legitimacy): the settlement is under active war;
 *     surfaces as an external-threat risk.
 *   - army_deployed (→ defense_readiness): the standing army is committed abroad.
 *   - primaryDeitySnapshot: a dominant deity moving religious_authority — a named
 *     driver on the internal-conflict (volatility) axis.
 *
 * @param {any} s
 * @returns {{ warDrain: any|null, warPressure: any|null, armyDeployed: any|null, deity: any|null }}
 */
function readWarReligionMovement(s) {
  let warDrain = null;
  let warPressure = null;
  let armyDeployed = null;
  for (const cond of deriveAllActiveConditions(s)) {
    if (cond.archetype === 'war_drain' && !warDrain) warDrain = cond;
    else if (cond.archetype === 'war_pressure' && !warPressure) warPressure = cond;
    else if (cond.archetype === 'army_deployed' && !armyDeployed) armyDeployed = cond;
  }
  const deity = s?.config?.primaryDeitySnapshot || null;
  return { warDrain, warPressure, armyDeployed, deity };
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** @param {any} s */
function econOf(s) { return s?.economicState || {}; }

/**
 * @param {any} items
 * @param {any} statuses
 * @param {{ excludeCovertOnly?: boolean }} [opts]
 */
function countByStatus(items, statuses, { excludeCovertOnly = false } = {}) {
  if (!Array.isArray(items)) return 0;
  const set = new Set(statuses);
  return items.filter(i => {
    if (!set.has(String(i?.status || '').toLowerCase())) return false;
    // A covert mark bumps status to 'impaired' but must not read as visibly
    // impaired: skip an item whose status is driven SOLELY by covert impairments.
    if (excludeCovertOnly && isCovertOnlyImpairment(i)) return false;
    return true;
  }).length;
}

/**
 * Wrap raw value+drivers+risks into the StateDimension shape with band
 * label and clamped value. Centralizing this means every dimension comes
 * out of derivation in the same shape — no surprises for the UI consumer.
 * @param {number} rawValue
 * @param {any[]} drivers
 * @param {any[]} risks
 */
function finalize(rawValue, drivers, risks) {
  const value = Math.round(clamp01(rawValue));
  return {
    value,
    band: bandFor(value),
    drivers: drivers.length ? drivers : ['No notable factors'],
    risks,
  };
}
