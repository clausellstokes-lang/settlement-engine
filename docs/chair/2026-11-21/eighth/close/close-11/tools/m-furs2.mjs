export function measure(t) {
  const c = t.config || {};
  const desert = c.terrainType === 'desert';
  if (!desert) return { desert };
  const rows = (t.institutions || []).filter((i) => i?.name === "Furrier's district");
  return { desert, route: c.tradeRouteAccess, hg: (c.nearbyResources || []).includes('hunting_grounds'), native: c.nearbyResourcesNative ?? null,
    furrier: rows.map((r) => r.source || ''), ent: t.economicState?.isEntrepot === true };
}
