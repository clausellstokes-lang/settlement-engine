// BD-r5 probe (B.4's cure): can a WAY beside a living road be "the route ledger's own edge" (BD20, §5.2)?
// And what does master's ONE grade writer read for the map's rung words (wild/way/trail)?
// And does the franchise accept `body` as ONE token (HIDDEN_PATH_KINDS only)?
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src';
const L = await import(M + '/domain/worldPulse/routeNetworkLedger.js');
const C = await import(M + '/domain/worldPulse/routeNetworkConsumers.js');
const T = await import(M + '/domain/worldPulse/routeNetworkConsumersTransit.js');
const road = L.routeEdge({ a: 'kell', b: 'ashford', grade: 'road', mode: 'land', provenance: 'generated', flavor: 'trunk', tick: 0 });
const way = L.routeEdge({ a: 'kell', b: 'ashford', grade: 'hidden', mode: 'land', provenance: 'chartered:10', flavor: 'trunk', tick: 10 });
let net = L.withRouteEdges(L.emptyRouteNetwork(), [road]);
const net2 = L.withRouteEdges(net, [way]);
const ids = Object.keys(net2.edges || {});
console.log('road id', L.routeEdgeId('kell', 'ashford', 'land'), '| way-beside-road id', L.routeEdgeId('ashford', 'kell', 'land'));
console.log('edges after adding the way beside the road:', JSON.stringify(ids), '| grade kept:', net2.edges[ids[0]].grade, '| network object unchanged:', net2 === net);
console.log('ROUTE_GRADES', JSON.stringify(L.ROUTE_GRADES), '| ROUTE_FLOW_CLASSES', JSON.stringify(L.ROUTE_FLOW_CLASSES));
for (const g of ['highway', 'road', 'track', 'trail', 'way', 'wild', 'hidden']) console.log('gradeLegMultiplier(', g, ') =', T.gradeLegMultiplier(g), '| arterialWeight =', C.arterialWeight ? C.arterialWeight(g) : 'n/a');
console.log('TRAVELLER_KINDS', JSON.stringify(C.TRAVELLER_KINDS), '| HIDDEN_PATH_KINDS', JSON.stringify(C.HIDDEN_PATH_KINDS));
const hiddenWithBody = [...C.HIDDEN_PATH_KINDS, 'body'].sort();
console.log("master's franchise pin 'for (const kind of HIDDEN_PATH_KINDS) expect(TRAVELLER_KINDS).toContain(kind)' with body added to HIDDEN_PATH_KINDS only:", hiddenWithBody.every(k => C.TRAVELLER_KINDS.includes(k)) ? 'HOLDS' : 'REDS (body not a TRAVELLER_KIND)');
console.log("mayUseHiddenPaths('patrol') =", C.mayUseHiddenPaths('patrol'), "| mayUseHiddenPaths('army') =", C.mayUseHiddenPaths('army'));
