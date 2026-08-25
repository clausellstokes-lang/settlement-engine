// Shared utility functions for all tab components

// Builds sets of impaired/degraded/vulnerable services from trade dependencies
export function computeChainSets(settlement) {
  const tradeDeps  = new Set();
  const impaired   = new Set();
  const degraded   = new Set();
  const vulnerable = new Set();
  const depReasons = new Map(); // service/inst name → {resource, impact, severity}
  if (!settlement) return { tradeDeps, impaired, degraded, vulnerable, depReasons };

  const deps = settlement.economicState?.tradeDependencies || [];
  const route = settlement.config?.tradeRouteAccess || 'road';
  const stresses = (Array.isArray(settlement.stress) ? settlement.stress : settlement.stress ? [settlement.stress] : []).filter(Boolean);
  const hasSiege = stresses.some(s => s?.type === 'under_siege');
  const isIsolated = route === 'isolated';

  deps.forEach(dep => {
    const inst = dep.institution || '';
    tradeDeps.add(inst);
    const reason = { resource: dep.resource, impact: dep.impact, inst };
    (dep.affectedServices || []).forEach(svc => {
      if (dep.severity === 'critical' || hasSiege || isIsolated) {
        impaired.add(svc); impaired.add(inst);
        if (!depReasons.has(svc)) depReasons.set(svc, reason);
        if (!depReasons.has(inst)) depReasons.set(inst, reason);
      } else if (dep.severity === 'high') {
        degraded.add(svc); degraded.add(inst);
        if (!depReasons.has(svc)) depReasons.set(svc, reason);
        if (!depReasons.has(inst)) depReasons.set(inst, reason);
      } else {
        vulnerable.add(svc); vulnerable.add(inst);
        if (!depReasons.has(svc)) depReasons.set(svc, reason);
        if (!depReasons.has(inst)) depReasons.set(inst, reason);
      }
    });
  });
  return { tradeDeps, impaired, degraded, vulnerable, depReasons };
}

// ── foodNarrative ─────────────────────────────────────────────────────────────
export function foodNarrative(fb, config) {
  if (!fb) return null;
  const route = config?.tradeRouteAccess || 'road';
  const deficit = fb.deficit > 0;
  const pct = fb.deficitPercent || 0;
  if (!deficit) return null; // Let the surplus path use its inline fallback
  if (route === 'isolated') return `Isolated with a ${pct}% food deficit — no trade routes to cover the gap. Any supply disruption becomes an immediate survival crisis.`;
  if (route === 'port') return `Imports ${pct}% of food needs via port. Sea supply is reliable until it isn't — a blockade or naval threat converts this dependency into a famine countdown.`;
  if (route === 'river') return `River supply covers ${pct}% of food needs. Upstream disruption propagates downstream within weeks.`;
  return null; // Let inline fallback handle standard road/crossroads
}

// computeChainDepthMap — returns a Map of chainId → depth (number of hops in chain)
// depth 1 = raw resource chain (timber, iron, grain)
// depth 2 = first-order processed (smelting, food_processing)
// depth 3+ = higher-order processed (weapons_armor, luxury_goods)
export function computeChainDepthMap(settlement) {
  const activeChains = settlement?.economicState?.activeChains || [];
  const depthMap = new Map(); // chainId → depth
  
  // Assign depth based on upstreamChains length (recursive count)
  const getDepth = (chainId, visited = new Set()) => {
    if (depthMap.has(chainId)) return depthMap.get(chainId);
    if (visited.has(chainId)) return 1; // cycle guard
    visited.add(chainId);
    
    const chain = activeChains.find(c => c.chainId === chainId);
    if (!chain || !chain.upstreamChains?.length) {
      depthMap.set(chainId, 1);
      return 1;
    }
    const maxUpstreamDepth = Math.max(...chain.upstreamChains.map(uid => getDepth(uid, new Set(visited))));
    const depth = maxUpstreamDepth + 1;
    depthMap.set(chainId, depth);
    return depth;
  };
  
  activeChains.forEach(c => getDepth(c.chainId));
  return depthMap;
}
