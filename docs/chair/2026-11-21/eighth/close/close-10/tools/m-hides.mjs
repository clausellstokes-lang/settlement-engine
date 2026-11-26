const RX = /hide|fur|pelt|game|leather|hunt/i;
const str = (x) => (typeof x === 'string' ? x : x?.name || x?.label || x?.good || JSON.stringify(x));
export function measure(t) {
  const e = t.economicState || {};
  const inst = (t.institutions || []).map((i) => `${i.name}${i.source ? '<' + i.source + '>' : ''}`).filter((n) => RX.test(n) || /Tann|Cobbl|Saddl/i.test(n));
  const chains = (e.activeChains || []).map((c) => c.id || c.chainId || c.key || str(c)).filter((c) => RX.test(String(c)) || /furs|entrepot/.test(String(c)));
  return {
    terrain: t.config?.terrainType, route: t.config?.tradeRouteAccess, near: t.config?.nearbyResources, depl: t.config?.nearbyResourcesDepleted,
    inst, imports: (e.primaryImports || []).map(str), necessity: (e.necessityImports || []).map(str).filter((x) => RX.test(x)),
    isEntrepot: e.isEntrepot, transit: e.transit ? str(e.transit).slice(0, 200) : null, chains,
    tradeDeps: (e.tradeDependencies || []).map(str).filter((x) => RX.test(x)),
    neighbour: t.neighborRelationship ? JSON.stringify(t.neighborRelationship).slice(0, 300) : null,
  };
}
