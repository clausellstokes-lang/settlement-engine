// WS-r1 probe: the §5.2 adjacency ring and the "one step toward the cause's way along the
// codepoint-first shortest path" rule — where does each (court way × cause) deviation land?
const edges = [
  ['attrition','fortress'],['fortress','logistics'],['logistics','coalition'],['coalition','subversion'],['subversion','harassment'],
  ['attrition','shock'],['shock','raiding'],['raiding','harassment'],['harassment','logistics'],
];
const W = ['attrition','coalition','fortress','harassment','logistics','raiding','shock','subversion'];
const adj = Object.fromEntries(W.map(w => [w, new Set()]));
for (const [a,b] of edges) { adj[a].add(b); adj[b].add(a); }
const tok = w => 'way_' + w;
function dist(from) { const d = {[from]:0}; const q=[from]; while(q.length){const x=q.shift(); for(const y of adj[x]) if(d[y]===undefined){d[y]=d[x]+1;q.push(y);}} return d; }
function step(from, to) {
  if (from === to) return from;
  const dt = dist(to);
  const cands = [...adj[from]].filter(n => dt[n] === dt[from] - 1).sort((a,b)=> tok(a) < tok(b) ? -1 : 1);
  return cands[0];
}
const causes = { field_lost:'fortress', seat_rotting:'subversion', purse_empty:'raiding', levy_thin:'coalition', foe_on_the_ways:'logistics', ally_failed:'fortress', siege_long:'logistics' };
console.log('neighbours:', Object.fromEntries(W.map(w=>[w,[...adj[w]].sort()])));
let total=0, miss=0;
for (const w of W) for (const [c,t] of Object.entries(causes)) {
  if (w === t) continue; total++;
  const s = step(w, t);
  if (s !== t) { miss++; console.log(`${w} --${c}(→${t})--> lands ${s}`); }
}
console.log(`deviations whose landing way is NOT the cause's way: ${miss}/${total}`);
