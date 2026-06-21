/**
 * relationshipGraph.js — Reactive cascading modifier engine.
 *
 * Computes how a settlement's network position affects it across five
 * categories: economy, safety, supply, political, defensibility.
 *
 * Architecture:
 *   1. Build an adjacency list from all savedSettlements' neighbourNetworks.
 *   2. BFS wave from a target settlement through typed edges.
 *   3. Each edge's relationship type determines WHAT propagates
 *      (via PROPAGATION_MATRIX); cumulative decay determines HOW MUCH.
 *   4. Returns modifier totals + per-source breakdown for UI display.
 *
 * Max depth is capped at 3 — beyond that, decay makes effects negligible
 * and computation stays fast even with large networks.
 */

import { localPropagationType } from '../domain/relationships/canonicalRelationship.js';

// ── Effect categories ───────────────────────────────────────────────────────

export const EFFECT_CATEGORIES = [
  { key: 'economy',       label: 'Economy',       color: '#8a7a2a' },
  { key: 'safety',        label: 'Safety',         color: '#2a6a3a' },
  { key: 'supply',        label: 'Supply',         color: '#5a6a2a' },
  { key: 'political',     label: 'Political',      color: '#2a4a8a' },
  { key: 'defensibility', label: 'Defensibility',  color: '#6b2a2a' },
];

const CATEGORY_KEYS = EFFECT_CATEGORIES.map(c => c.key);

// ── Propagation matrix ──────────────────────────────────────────────────────
//
// Each relationship type defines how strongly it transmits each effect
// category, plus a per-hop decay factor. Positive = correlated benefit,
// negative = inverse (rival's gain is your loss).

export const PROPAGATION_MATRIX = {
  neutral:       { economy:  0.05, safety:  0.05, supply:  0.05, political:  0.05, defensibility:  0.0,  decay: 0.2  },
  trade_partner: { economy:  0.7,  safety:  0.1,  supply:  0.6,  political:  0.2,  defensibility:  0.1,  decay: 0.5  },
  allied:        { economy:  0.2,  safety:  0.2,  supply:  0.3,  political:  0.4,  defensibility:  0.8,  decay: 0.4  },
  patron:        { economy: -0.2,  safety:  0.3,  supply:  0.4,  political:  0.7,  defensibility:  0.6,  decay: 0.6  },
  client:        { economy:  0.4,  safety:  0.2,  supply:  0.3,  political:  0.8,  defensibility:  0.5,  decay: 0.6  },
  vassal:        { economy: -0.25, safety:  0.35, supply:  0.35, political:  0.9,  defensibility:  0.7,  decay: 0.65 },
  rival:         { economy: -0.3,  safety: -0.3,  supply: -0.2,  political: -0.3,  defensibility: -0.6,  decay: 0.3  },
  cold_war:      { economy: -0.4,  safety: -0.4,  supply: -0.4,  political: -0.4,  defensibility: -0.7,  decay: 0.35 },
  hostile:       { economy: -0.5,  safety: -0.6,  supply: -0.5,  political: -0.5,  defensibility: -0.8,  decay: 0.3  },
  criminal_network: { economy: 0.2, safety: -0.35, supply: 0.25, political: -0.3, defensibility: -0.2, decay: 0.45 },
};

const MAX_DEPTH = 3;

// ── Tier population estimates (for tier-ratio asymmetry) ────────────────────
const TIER_POP = { thorp: 20, hamlet: 100, village: 500, town: 2500, city: 10000, metropolis: 50000 };

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/** Extract approximate population for a save entry */
function getPopulation(save) {
  const pop = save?.settlement?.population?.total
    || save?.settlement?.population
    || TIER_POP[(save?.tier || save?.settlement?.tier || 'village').toLowerCase()];
  return typeof pop === 'number' ? pop : 500;
}

/**
 * Extract per-category strength (0-1) from a save entry.
 * Uses config priorities when available, falls back to 0.5.
 */
function getStrength(save, modifiers = null) {
  const cfg = save?.config || {};
  const base = {
    economy:       (cfg.priorityEconomy  ?? 50) / 100,
    safety:        (cfg.priorityMilitary ?? 50) / 100,
    supply:        ((cfg.priorityEconomy ?? 50) + (cfg.priorityMilitary ?? 50)) / 200,
    // priorityReligion is an INTENTIONAL proxy for political strength —
    // config carries no dedicated political slider, and faction power /
    // legitimacy live in the derived settlement state, not on the save config
    // this helper reads. Documented as a proxy rather than rewired to avoid a
    // display-fidelity behavior change here.
    political:     (cfg.priorityReligion ?? 50) / 100,
    defensibility: (cfg.priorityMilitary ?? 50) / 100,
  };
  // Blend in current network modifiers if iterating
  if (modifiers) {
    for (const cat of CATEGORY_KEYS) {
      base[cat] = clamp(base[cat] + (modifiers[cat] || 0) * 0.5, 0.05, 1.0);
    }
  }
  return base;
}

// ── Graph construction ──────────────────────────────────────────────────────

/**
 * Build an adjacency list from all saved settlements.
 * Returns Map<settlementId, Array<{ targetId, relType, targetName }>>
 *
 * Uses savedSettlement.id as the canonical node identifier and resolves
 * neighbours by matching linkId across all settlements' networks.
 */
export function buildGraph(savedSettlements) {
  const graph = new Map();

  // Build the resolution indexes ONCE instead of an O(settlements)
  // inner scan per link (the old loop was O(N^2 * links) and also kept a dead
  // idByLinkTarget map it never read).
  //   - linkOwners:  linkId → settlement ids carrying that linkId (insertion
  //     order preserved, so the first OTHER owner matches the old first-hit).
  //   - idsByName:   settlement name → settlement ids with that name (a list, so
  //     the first NON-self match still wins when a name is shared with self).
  const linkOwners = new Map();
  const idsByName = new Map();
  const pushByName = (name, id) => {
    if (name == null) return;
    const ids = idsByName.get(name);
    if (ids) { if (!ids.includes(id)) ids.push(id); }
    else idsByName.set(name, [id]);
  };
  for (const ss of savedSettlements) {
    graph.set(ss.id, []);
    pushByName(ss.name, ss.id);
    pushByName(ss.settlement?.name, ss.id);
    for (const link of ss.settlement?.neighbourNetwork || []) {
      if (!link.linkId) continue;
      const owners = linkOwners.get(link.linkId);
      if (owners) owners.push(ss.id);
      else linkOwners.set(link.linkId, [ss.id]);
    }
  }

  // Build edges: for each settlement's network entries, resolve the target by lookup.
  for (const ss of savedSettlements) {
    const network = ss.settlement?.neighbourNetwork || [];
    for (const link of network) {
      const relType = localPropagationType(link);
      const neighbourName = link.neighbourName || link.name;

      // The OTHER settlement sharing this linkId is the target (first in order).
      let targetId = null;
      if (link.linkId) {
        const owners = linkOwners.get(link.linkId) || [];
        targetId = owners.find(id => id !== ss.id) ?? null;
      }

      // Fallback: match by name (first NON-self match, matching the old find()).
      if (!targetId && neighbourName != null) {
        const match = (idsByName.get(neighbourName) || []).find(id => id !== ss.id);
        if (match) targetId = match;
      }

      if (targetId) {
        graph.get(ss.id).push({
          targetId,
          relType,
          targetName: neighbourName,
          linkId: link.linkId,
        });
      }
    }
  }

  return graph;
}

// ── Modifier computation ────────────────────────────────────────────────────

/**
 * Compute cascading modifiers for a single settlement via BFS wave.
 *
 * @param {string} settlementId
 * @param {Map} graph — adjacency list from buildGraph()
 * @param {Map|null} saveIndex — Map<id, saveEntry> for tier-ratio/factor-delta (optional)
 * @param {Map|null} currentModifiers — Map<id, totals> from previous iteration (optional)
 *
 * Returns {
 *   totals:   { economy, safety, supply, political, defensibility },
 *   sources:  [{ settlementId, settlementName, relType, depth, decay, tierRatio, factorDeltas, modifiers }],
 * }
 */
export function computeModifiers(settlementId, graph, saveIndex = null, currentModifiers = null) {
  const totals = {};
  for (const k of CATEGORY_KEYS) totals[k] = 0;

  const sources = [];
  const visited = new Set([settlementId]);
  const edges = graph.get(settlementId);
  if (!edges) return { totals, sources };

  // Pre-compute target strength for factor-delta (uses current iteration's modifiers)
  const targetSave = saveIndex?.get(settlementId);
  const targetStrength = targetSave
    ? getStrength(targetSave, currentModifiers?.get(settlementId))
    : null;
  const targetPop = targetSave ? getPopulation(targetSave) : 500;

  // BFS wave: [targetId, relType, cumulativeDecay, depth, targetName]
  // Processed level-by-level so the result is ORDER-INDEPENDENT. When a
  // node is reachable via several equal-depth paths, the earlier shift()-wins
  // BFS picked whichever link happened to be enqueued first — so re-ordering a
  // settlement's links silently changed the displayed/exported numbers. We now
  // pick the strongest path by an explicit deterministic comparator (greatest
  // absolute decay-weighted magnitude, ties broken by relType then decay).
  let frontier = edges.map(e => [e.targetId, e.relType, 1.0, 1, e.targetName]);

  /** Magnitude a candidate arrival would contribute, before asymmetry scaling. */
  function pathMagnitude(relType, cumDecay) {
    const prop = PROPAGATION_MATRIX[relType] || PROPAGATION_MATRIX.neutral;
    let sum = 0;
    for (const cat of CATEGORY_KEYS) sum += Math.abs(prop[cat]);
    return sum * cumDecay;
  }

  /** Order-independent winner between two arrivals at the same node. */
  function strongerArrival(a, b) {
    const ma = pathMagnitude(a[1], a[2]);
    const mb = pathMagnitude(b[1], b[2]);
    if (ma !== mb) return ma > mb ? a : b;
    if (a[1] !== b[1]) return a[1] < b[1] ? a : b; // tie: lexicographically smaller relType
    return a[2] >= b[2] ? a : b;                   // final tie: larger cumulative decay
  }

  while (frontier.length > 0) {
    // Collapse this level to one strongest arrival per not-yet-visited node, so
    // the chosen path no longer depends on enqueue order.
    const bestByNode = new Map();
    for (const arrival of frontier) {
      const [nodeId, , , depth] = arrival;
      if (visited.has(nodeId) || depth > MAX_DEPTH) continue;
      const prev = bestByNode.get(nodeId);
      bestByNode.set(nodeId, prev ? strongerArrival(prev, arrival) : arrival);
    }

    const nextFrontier = [];
    for (const [nodeId, relType, cumDecay, depth, nodeName] of bestByNode.values()) {
      visited.add(nodeId);

      const prop = PROPAGATION_MATRIX[relType] || PROPAGATION_MATRIX.neutral;

      // ── Tier-ratio: population asymmetry ────────────────────────────────
      let tierRatio = 1.0;
      const sourceSave = saveIndex?.get(nodeId);
      if (sourceSave && targetSave) {
        tierRatio = clamp(getPopulation(sourceSave) / targetPop, 0.3, 3.0);
      }

      // ── Factor-delta: relative strength per category ────────────────────
      const factorDeltas = {};
      const sourceStrength = sourceSave
        ? getStrength(sourceSave, currentModifiers?.get(nodeId))
        : null;

      const sourceModifiers = {};
      for (const cat of CATEGORY_KEYS) {
        let value = prop[cat] * cumDecay;

        if (sourceStrength && targetStrength) {
          const srcS = sourceStrength[cat] || 0.05;
          const tgtS = targetStrength[cat] || 0.05;
          const fd = clamp(1 + (1 - tgtS / srcS) * 0.3, 0.5, 1.5);
          factorDeltas[cat] = fd;
          value *= tierRatio * fd;
        }

        sourceModifiers[cat] = value;
        totals[cat] += value;
      }

      sources.push({
        settlementId: nodeId,
        settlementName: nodeName,
        relType,
        depth,
        decay: cumDecay,
        tierRatio,
        factorDeltas,
        modifiers: sourceModifiers,
      });

      // Propagate further: enqueue this node's neighbours with compounded decay
      const nextEdges = graph.get(nodeId) || [];
      const nextDecay = cumDecay * prop.decay;

      for (const edge of nextEdges) {
        if (!visited.has(edge.targetId)) {
          nextFrontier.push([edge.targetId, edge.relType, nextDecay, depth + 1, edge.targetName]);
        }
      }
    }

    frontier = nextFrontier;
  }

  return { totals, sources };
}

// ── Convenience wrapper ─────────────────────────────────────────────────────

/** Build a save-index Map for quick lookups */
function buildSaveIndex(savedSettlements) {
  const idx = new Map();
  for (const ss of savedSettlements) idx.set(ss.id, ss);
  return idx;
}

/**
 * One-call compute: build graph + compute modifiers for a settlement.
 * Uses tier-ratio and factor-delta for asymmetric effects.
 */
export function getSettlementModifiers(settlementId, savedSettlements) {
  const graph = buildGraph(savedSettlements);
  const saveIndex = buildSaveIndex(savedSettlements);
  return computeModifiers(settlementId, graph, saveIndex);
}

/**
 * Compute modifiers for ALL settlements with iterative convergence.
 *
 * Runs up to maxIterations passes, each time feeding the previous
 * iteration's modifiers back in so that tier-ratio and factor-delta
 * reflect the network-adjusted stats. Applies 0.8x damping per
 * iteration to prevent oscillation.
 *
 * Returns Map<settlementId, { totals, sources }>
 */
export function getAllModifiers(savedSettlements, maxIterations = 4) {
  if (!savedSettlements?.length) return new Map();

  const graph = buildGraph(savedSettlements);
  const saveIndex = buildSaveIndex(savedSettlements);
  let currentModifiers = null;
  let lastResult = new Map();

  for (let iter = 0; iter < maxIterations; iter++) {
    const nextResult = new Map();

    for (const ss of savedSettlements) {
      nextResult.set(
        ss.id,
        computeModifiers(ss.id, graph, saveIndex, currentModifiers),
      );
    }

    // Check convergence against previous iteration
    if (currentModifiers) {
      let maxDelta = 0;
      for (const [id, mods] of nextResult) {
        const prev = currentModifiers.get(id);
        if (!prev) continue;
        for (const cat of CATEGORY_KEYS) {
          maxDelta = Math.max(maxDelta, Math.abs(mods.totals[cat] - prev[cat]));
        }
      }
      if (maxDelta < 0.01) {
        return nextResult; // converged
      }

      // Apply 0.8x damping: blend towards new values
      for (const [id, mods] of nextResult) {
        const prev = currentModifiers.get(id);
        if (!prev) continue;
        for (const cat of CATEGORY_KEYS) {
          mods.totals[cat] = prev[cat] + (mods.totals[cat] - prev[cat]) * 0.8;
        }
      }
    }

    // Build currentModifiers map (just totals) for next iteration's getStrength()
    currentModifiers = new Map();
    for (const [id, mods] of nextResult) {
      currentModifiers.set(id, mods.totals);
    }
    lastResult = nextResult;
  }

  // On exhaustion return the LAST DAMPED result rather than a fresh
  // undamped recompute. The old final pass recomputed totals from
  // currentModifiers without re-applying the 0.8x damping, so a non-converging
  // network returned numbers that disagreed with the damping it advertised (and
  // with the early-converged return path). lastResult already carries the
  // damped totals AND the full per-source breakdown for the same iteration.
  return lastResult;
}

// ── Formatting helpers ──────────────────────────────────────────────────────

/** Format a modifier value as "+0.35" or "-0.12" */
export function fmtMod(value) {
  if (Math.abs(value) < 0.005) return '0';
  return (value > 0 ? '+' : '') + value.toFixed(2);
}

/** Get the strongest single modifier category for badge display */
export function dominantEffect(totals) {
  let best = null;
  let bestAbs = 0;
  for (const cat of CATEGORY_KEYS) {
    const abs = Math.abs(totals[cat]);
    if (abs > bestAbs) {
      bestAbs = abs;
      best = cat;
    }
  }
  return best;
}

/** Map relationship type to human-readable label */
export const REL_LABELS = {
  neutral: 'Neutral',
  trade_partner: 'Trade Partner',
  allied: 'Military Ally',
  ally: 'Military Ally',
  patron: 'Patron',
  client: 'Client',
  overlord: 'Overlord',
  vassal: 'Vassal State',
  rival: 'Rival',
  cold_war: 'Cold War',
  hostile: 'Hostile',
  criminal_network: 'Criminal Network',
};
