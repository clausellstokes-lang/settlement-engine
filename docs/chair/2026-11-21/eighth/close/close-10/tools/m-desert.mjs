export function measure(t) {
  if (t.config?.terrainType !== 'desert') return { desert: false };
  const e = t.economicState || {};
  const names = (t.institutions || []).map((i) => i.name);
  const src = Object.fromEntries((t.institutions || []).filter((i) => /Furrier|Hunter|Tann/.test(i.name)).map((i) => [i.name, i.source || '']));
  return { desert: true, route: t.config?.tradeRouteAccess, near: t.config?.nearbyResources, depl: t.config?.nearbyResourcesDepleted,
    furrier: names.includes("Furrier's district"), hunter: names.includes("Hunter's lodge"), tanner: names.some((n) => /Tann/.test(n)), src,
    hidesImp: (e.primaryImports || []).filter((x) => /hide|fur|pelt|game/i.test(String(x))), ent: e.isEntrepot, furs: (e.activeChains || []).some((c) => c.id === 'furs_north') };
}
