// tabdiff.mjs <base-dumps> <tip-dumps> <out.json>: per town and view, lines only at tip and only at base.
import fs from 'node:fs';
const [B,T,O]=process.argv.slice(2);
const parse=f=>{const m=new Map();let cur='?';for(const l of fs.readFileSync(f,'utf8').split('\n')){const h=l.match(/^== (.*) ==/);if(h){cur=h[1];if(!m.has(cur))m.set(cur,new Set());continue;}if(l.trim()&&!l.startsWith('[STYLE]'))m.get(cur)?.add(l);}return m;};
const out={};let nt=0,nb=0;
for(const f of fs.readdirSync(T).filter(x=>x.endsWith('.txt')).sort()){
  const t=parse(`${T}/${f}`), b=fs.existsSync(`${B}/${f}`)?parse(`${B}/${f}`):new Map();
  const town=f.replace(/\.txt$/,''); out[town]={tipOnly:{},baseOnly:{}};
  for(const [v,s] of t){const bs=b.get(v)||new Set();const d=[...s].filter(x=>!bs.has(x));if(d.length){out[town].tipOnly[v]=d;nt+=d.length;}}
  for(const [v,s] of b){const ts=t.get(v)||new Set();const d=[...s].filter(x=>!ts.has(x));if(d.length){out[town].baseOnly[v]=d;nb+=d.length;}}
}
fs.writeFileSync(O,JSON.stringify(out,null,1));console.log('tipOnly lines',nt,'baseOnly lines',nb);
