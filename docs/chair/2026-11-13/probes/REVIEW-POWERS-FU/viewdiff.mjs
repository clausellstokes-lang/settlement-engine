// viewdiff.mjs <baseDumps> <tipDumps> <seedsfile> : per town, per scoped view, the lines only at tip (+) and only at base (-).
import fs from 'node:fs';
const [B,T,SF]=process.argv.slice(2); const VIEWS=['Systems/Power','World/NPCs','World/Relationships','World/Rumors & News','Table/Tonight sheet'];
function views(f){ const o={}; let cur=null; for(const l of fs.readFileSync(f,'utf8').split('\n')){ const m=l.match(/^== (.+?) ==/); if(m){cur=m[1]; o[cur]=o[cur]||[]; continue;} if(cur&&l) o[cur].push(l);} return o; }
let tot={plus:0,minus:0};
for(const s of fs.readFileSync(SF,'utf8').trim().split('\n')){
  const b=views(`${B}/${s}.txt`), t=views(`${T}/${s}.txt`); const out=[];
  for(const v of VIEWS){ const bl=b[v]||[], tl=t[v]||[]; const bs=new Map(); for(const l of bl) bs.set(l,(bs.get(l)||0)+1); const ts=new Map(); for(const l of tl) ts.set(l,(ts.get(l)||0)+1);
    const plus=tl.filter(l=>{const c=bs.get(l)||0; if(c>0){bs.set(l,c-1);return false;} return true;});
    const minus=bl.filter(l=>{const c=ts.get(l)||0; if(c>0){ts.set(l,c-1);return false;} return true;});
    if(plus.length||minus.length){ out.push(`  [${v}] +${plus.length} -${minus.length}`); for(const l of minus) out.push('    - '+l); for(const l of plus) out.push('    + '+l); tot.plus+=plus.length; tot.minus+=minus.length; } }
  console.log(`## ${s}${out.length?'':'  (no change in the five views)'}`); if(out.length) console.log(out.join('\n'));
}
console.log(`TOTAL +${tot.plus} -${tot.minus}`);
