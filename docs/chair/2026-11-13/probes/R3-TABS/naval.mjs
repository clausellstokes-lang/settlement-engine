// naval.mjs: the defence desk's supporting prose (DS-DEF-6 naval rung and every other rung), tree PRE against tree TIP, on births files.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [pre,tip,out,...files]=process.argv.slice(2);
const A=await import(pre+'/src/domain/display/stateProse/defenseStateProse.js');
const B=await import(tip+'/src/domain/display/stateProse/defenseStateProse.js');
const w=fs.createWriteStream(out);
for(const f of files) for(const line of zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n')){
  const {seed,s}=JSON.parse(line); const o={seed,audience:'dm',tierNoun:s.tier};
  const a=A.defenseSupportingProse(s,o), b=B.defenseSupportingProse(s,o);
  const ser=(x)=>JSON.parse(JSON.stringify(x));
  const rungs={}; for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})])) rungs[k]=JSON.stringify(ser(a?.[k]))===JSON.stringify(ser(b?.[k]));
  w.write(JSON.stringify({seed,route:s.config?.tradeRouteAccess,terrain:s.config?.terrainType,hasPort:!!s.economicState?.compound?.hasPort,
    pre:{k:a?.naval?.provenance?.poolKey??null,s:a?.naval?.sentence??null}, tip:{k:b?.naval?.provenance?.poolKey??null,s:b?.naval?.sentence??null}, same:rungs})+'\n');
}
w.end();
