// REVIEW-W2-FIX-DATA packet: one town's reading packet (facts from the record + the tabs a reader checks) from render.mjs output.
//   node packet.mjs <dir> <id>   -> <dir>/<id>.packet.txt
import fs from 'node:fs'; import zlib from 'node:zlib';
const [dir,id]=process.argv.slice(2);
const s=JSON.parse(zlib.gunzipSync(fs.readFileSync(`${dir}/${id}.json.gz`)));
const t=fs.readFileSync(`${dir}/${id}.txt`,'utf8'); const sec={}; let cur;
for(const l of t.split('\n')){const m=l.match(/^== (.*) ==$/); if(m){cur=m[1];sec[cur]=[];continue;} if(cur) sec[cur].push(l);}
const c=s.config||{}; const dp=s.defenseProfile?.institutions||{};
const facts=[
 `TOWN ${id}: ${s.name}, ${s.tier}, population ${s.population}`,
 `terrain=${c.terrainType||s.spatialLayout?.terrain||c.terrain||'?'} trade=${c.tradeRouteAccess} culture=${c.culture} magic=${c.magicExists} monsterThreat=${c.monsterThreat}`,
 `stresses=${JSON.stringify((Array.isArray(s.stressors)?s.stressors:[]).map(x=>x.type||x))} stress=${s.stress?.type||'none'}`,
 `defence institutions: ${Object.entries(dp).map(([k,v])=>k+':'+(Array.isArray(v)?v.map(x=>x.name||x).join('|'):JSON.stringify(v))).join('; ')}`,
 `INSTITUTIONS (${s.institutions.length}): ${s.institutions.map(i=>i.name).join('; ')}`,
];
const out=[...facts];
for(const k of ['tab:overview','tab:institutions','tab:services','tab:history','tab:traditions','tab:daily_life','tab:defense','tonight']) out.push(`== ${k} ==`, ...(sec[k]||[]));
fs.writeFileSync(`${dir}/${id}.packet.txt`, out.join('\n')+'\n');
console.log(id, out.join('\n').length);
