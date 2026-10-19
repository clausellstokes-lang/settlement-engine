// D-BD-r6 probe (RULINGS-ROUND6 A.2): does master's route ledger carry a WAY-MODE edge beside a living road
// with no ledger code change beyond the pinned vocabulary? Re-runs the skeptic's convicting receipts
// (skeptic/BD-r5-probe/ladder.out) and tests the cure's shape: a `way` edge of grade `hidden` on the same pair.
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src/domain/worldPulse';
const L = await import(M + '/routeNetworkLedger.js');
const C = await import(M + '/routeNetworkConsumers.js');
const T = await import(M + '/routeNetworkConsumersTransit.js');
const out = (k, v) => console.log(k.padEnd(58), JSON.stringify(v));
out('ROUTE_MODES (pinned)', L.ROUTE_MODES);
out('ROUTE_GRADES (pinned)', L.ROUTE_GRADES);
const land = L.routeEdge({ a: 'kell', b: 'ashford', grade: 'road', mode: 'land', provenance: 'generated', flavor: 'genesis', tick: 0 });
const wayBeside = L.routeEdge({ a: 'kell', b: 'ashford', grade: 'hidden', mode: 'way', provenance: 'generated', flavor: 'genesis', tick: 0 });
const landTwin = L.routeEdge({ a: 'kell', b: 'ashford', grade: 'hidden', mode: 'land', provenance: 'generated', flavor: 'genesis', tick: 0 });
out('routeEdgeId(land) · routeEdgeId(way)', [L.routeEdgeId('kell', 'ashford', 'land'), L.routeEdgeId('kell', 'ashford', 'way')]);
let net = L.withRouteEdges(L.emptyRouteNetwork(), [land]);
const netTwin = L.withRouteEdges(net, [landTwin]);
out('the convicting receipt: a 2nd LAND edge refused (unchanged)', netTwin === net);
net = L.withRouteEdges(net, [wayBeside]);
out('the cure: a WAY-mode edge beside it admitted (ids)', Object.keys(net.edges));
const adj = C.livedAdjacency(net);
out('livedAdjacency(kell) hops (grade · mode · hidden)', (adj.get('kell') || []).map(h => [h.grade, h.mode, h.hidden]));
out('gradeLegMultiplier hidden · trail · way · wild', ['hidden', 'trail', 'way', 'wild'].map(g => T.gradeLegMultiplier(g)));
const comps = L.routeNetworkComponents(net);
out('routeNetworkComponents excludes the hidden-grade way edge', comps instanceof Map ? [...comps.entries()] : comps);
out('mayUseHiddenPaths body · army · smuggler (master today)', ['body', 'army', 'smuggler'].map(k => C.mayUseHiddenPaths(k)));
const wayHop = (adj.get('kell') || []).find(h => h.mode === 'way');
out('travellerMayWalk army · smuggler on the way hop', wayHop ? ['army', 'smuggler'].map(k => T.travellerMayWalk(k, wayHop)) : null);
