// births where P2 moved readiness: does the tip's list hold a negative sustaining part (provisions short, food broken)?
import fs from 'node:fs'; import zlib from 'node:zlib'; const T=process.env.TREE;
const { defencePartsOf } = await import(T+'/src/generators/defenseGenerator.js');
const [dir, keys]=process.argv.slice(2); let neg=0, n=0, clamp=0;
for (const k of fs.readFileSync(keys,'utf8').trim().split('\n')) { n++; const s=JSON.parse(zlib.gunzipSync(fs.readFileSync(`${dir}/${k}.json.gz`)));
  const L=defencePartsOf(s); if (L.some(p=>p.id==='unprovisioned'||p.id==='foodBroken')) neg++; else if (L.some(p=>/^full:/.test(p.id))) clamp++; }
console.log(`moved ${n}: with a negative sustaining part ${neg}; else with a score full at 100 ${clamp}; neither ${n-neg-clamp}`);
