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
import { flag } from '../../lib/flags.js';
import { deriveExportPosture } from '../display/dossierViewModel.js';
import { isIsolatedRoute } from '../tradeRouteSemantics.js';
import { canonStressors, canonExports, canonImports } from '../canonicalAccessors.js';
import { foodLedger } from '../foodLedger.js';

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
 */
function deriveResilience(s) {
  let value = 50;
  const drivers = [];
  const risks = [];

  // Prosperity is a strong signal — pulled directly from economicState if present
  const econ = s.economicState || {};
  const prosperity = econ.prosperity?.tier || econ.prosperity || null;
  if (prosperity === 'Wealthy' || prosperity === 'Prosperous') {
    value += 15;
    drivers.push(`Settlement is ${String(prosperity).toLowerCase()}`);
  } else if (prosperity === 'Subsistence' || prosperity === 'Struggling') {
    value -= 15;
    risks.push(`Settlement is ${String(prosperity).toLowerCase()}`);
  } else if (prosperity === 'Modest') {
    drivers.push('Modest prosperity');
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

  // Export/import diversity — many narrow exports = fragile. The legacy read
  // here was `econ.exports`, a field economicState doesn't populate (the list
  // lives at primaryExports). Behind canonicalViewModel, source the count from
  // the display model's exportPosture; otherwise the canonical accessor
  // (primaryExports, legacy `exports` fallback) — so every surface agrees.
  const exportCount = flag('canonicalViewModel')
    ? deriveExportPosture(s).count
    : canonExports(s).length;
  if (exportCount === 0) {
    risks.push('No exports — economic isolation');
  } else if (exportCount >= 5) {
    value += 5;
    drivers.push(`Diversified exports (${exportCount})`);
  } else if (exportCount === 1) {
    value -= 5;
    risks.push('Single-export dependency');
  }

  // Impaired/degraded institutions
  const impaired = countByStatus(s.institutions, ['impaired', 'critical']);
  if (impaired > 0) {
    value -= Math.min(15, impaired * 4);
    risks.push(`${impaired} impaired institution${impaired === 1 ? '' : 's'}`);
  }

  return finalize(value, drivers, risks);
}

// ── Volatility ─────────────────────────────────────────────────────────────
/**
 * How close is internal conflict? Drivers: faction count, hostile
 * relationships between factions, criminal capture, low public
 * legitimacy. A stable monoculture scores low; a town with rivals,
 * thieves' guilds, and weak rulers scores high.
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
    drivers.push('Few factions — concentrated power');
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

  // Public legitimacy — when the rulers are doubted, the place wobbles. The canonical
  // substrate is powerStructure.publicLegitimacy = { score, label, breakdown }; read
  // .score. This branch was DEAD: it tested typeof === 'number' against the OBJECT the
  // generator emits, so low legitimacy never raised volatility. Normalize so the object
  // (.score), a legacy bare number, and absent all resolve correctly.
  const legRaw = power.publicLegitimacy ?? safety.publicLegitimacy ?? null;
  const legitimacy = typeof legRaw === 'number' ? legRaw
    : (legRaw && typeof legRaw.score === 'number' ? legRaw.score : null);
  if (typeof legitimacy === 'number') {
    if (legitimacy <= 30) {
      value += 12;
      risks.push('Ruling order has lost public legitimacy');
    } else if (legitimacy >= 70) {
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

  return finalize(value, drivers, risks);
}

// ── External Threat ────────────────────────────────────────────────────────
/**
 * How much pressure comes from outside the settlement? Monster threat,
 * hostile neighbours, raids/sieges/occupation in stressors.
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
    risks.push('Frontier conditions — monsters present');
  } else if (monsterThreat === 'safe' || monsterThreat === 'civilized') {
    value -= 5;
    drivers.push('Monster activity minimal');
  }

  // Hostile neighbour relationships (network effects)
  const network = s.neighbourNetwork || s.neighbourLinks || [];
  const hostile = network.filter(n => n.relationshipType === 'hostile' || n.relationshipType === 'cold_war').length;
  if (hostile > 0) {
    value += Math.min(20, hostile * 8);
    risks.push(`${hostile} hostile neighbour${hostile === 1 ? '' : 's'}`);
  }

  // Threat-tagged stresses. Same canonical-then-legacy fallback as
  // resilience above; without it, the threat dimension silently zeros
  // out on settlements that only carry the new `stressors` field.
  const stressList = canonStressors(s);
  const threatStresses = stressList.filter(st => {
    const t = String(st.type || st.name || '').toLowerCase();
    return t.includes('siege') || t.includes('occupation') || t.includes('raid')
        || t.includes('plague') || t.includes('war') || t.includes('refugee');
  });
  if (threatStresses.length > 0) {
    value += Math.min(20, threatStresses.length * 8);
    risks.push(`Active threat: ${threatStresses.map(t => t.name || t.type).join(', ')}`);
  }

  return finalize(value, drivers, risks);
}

// ── Resource Pressure ──────────────────────────────────────────────────────
/**
 * Are key materials under strain? Depleted resources, narrow chain
 * dependencies, unmet imports. High value = the place will hurt soon.
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
  const vulnerable = chains.filter(c => c.resourceDepleted || c.substituteActive).length;
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

// ── Helpers ────────────────────────────────────────────────────────────────

function econOf(s) { return s?.economicState || {}; }

function countByStatus(items, statuses) {
  if (!Array.isArray(items)) return 0;
  const set = new Set(statuses);
  return items.filter(i => set.has(String(i?.status || '').toLowerCase())).length;
}

/**
 * Wrap raw value+drivers+risks into the StateDimension shape with band
 * label and clamped value. Centralizing this means every dimension comes
 * out of derivation in the same shape — no surprises for the UI consumer.
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
