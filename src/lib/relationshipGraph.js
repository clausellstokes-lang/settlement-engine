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
  rival:         { economy: -0.3,  safety: -0.3,  supply: -0.2,  political: -0.3,  defensibility: -0.6,  decay: 0.3  },
  cold_war:      { economy: -0.4,  safety: -0.4,  supply: -0.4,  political: -0.4,  defensibility: -0.7,  decay: 0.35 },
  hostile:       { economy: -0.5,  safety: -0.6,  supply: -0.5,  political: -0.5,  defensibility: -0.8,  decay: 0.3  },
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
  const idByLinkTarget = new Map(); // linkId+side → settlementId

  // Index: for each saved settlement, register all its link endpoints
  for (const ss of savedSettlements) {
    graph.set(ss.id, []);
    const network = ss.settlement?.neighbourNetwork || [];
    for (const link of network) {
      // Each link has a linkId. The OTHER settlement sharing that linkId is the target.
      // We store this settlement's id so we can resolve targets.
      if (link.linkId) {
        const key = `${link.linkId}::${ss.id}`;
        idByLinkTarget.set(key, ss.id);
      }
    }
  }

  // Build edges: for each settlement's network entries, find the target settlement
  for (const ss of savedSettlements) {
    const network = ss.settlement?.neighbourNetwork || [];
    for (const link of network) {
      const relType = link.relationshipType || 'neutral';
      const neighbourName = link.neighbourName || link.name;

      // Find the target settlement by matching linkId in other settlements
      let targetId = null;
      if (link.linkId) {
        for (const other of savedSettlements) {
          if (other.id === ss.id) continue;
          const otherNetwork = other.settlement?.neighbourNetwork || [];
          const hasLink = otherNetwork.some(l => l.linkId === link.linkId);
          if (hasLink) {
            targetId = other.id;
            break;
          }
        }
      }

      // Fallback: match by name
      if (!targetId) {
        const match = savedSettlements.find(
          s => s.id !== ss.id && (s.name === neighbourName || s.settlement?.name === neighbourName)
        );
        if (match) targetId = match.id;
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

  // BFS queue: [targetId, relType, cumulativeDecay, depth, targetName]
  const queue = edges.map(e => [e.targetId, e.relType, 1.0, 1, e.targetName]);

  while (queue.length > 0) {
    const [nodeId, relType, cumDecay, depth, nodeName] = queue.shift();
    if (visited.has(nodeId) || depth > MAX_DEPTH) continue;
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
        queue.push([edge.targetId, edge.relType, nextDecay, depth + 1, edge.targetName]);
      }
    }
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
  }

  // Return last iteration's full result
  const finalResult = new Map();
  for (const ss of savedSettlements) {
    finalResult.set(
      ss.id,
      computeModifiers(ss.id, graph, saveIndex, currentModifiers),
    );
  }
  return finalResult;
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
  patron: 'Overlord',
  client: 'Vassal',
  rival: 'Rival',
  cold_war: 'Cold War',
  hostile: 'Hostile',
};
