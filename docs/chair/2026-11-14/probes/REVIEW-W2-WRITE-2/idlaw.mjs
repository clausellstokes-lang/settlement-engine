// idlaw.mjs <baseTree> <tipTree>: every pool's vids at base and tip; a removed vid that is not the pool's last row, a vid
// whose position moved, or a vid gap at the tip is printed. Also counts pools added/removed.
import fs from 'node:fs';
async function load(tree){ const dir=`${tree}/src/data/dossierStateProse`; const out=new Map();
  for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.generated.js'))){ const m=await import(`${dir}/${f}?t=${tree}`);
    for(const obj of Object.values(m)) if(obj&&typeof obj==='object') for(const [block,b] of Object.entries(obj)) if(b&&b.pools) for(const [pool,vs] of Object.entries(b.pools)) out.set(`${block}::${pool}`,vs.map(v=>({vid:v.vid,text:v.text}))); }
  return out; }
const [B,T]=process.argv.slice(2); const base=await load(B), tip=await load(T); let bad=0, struckTail=0; const touched=[];
for(const [k,bv] of base){ const tv=tip.get(k); if(!tv){ console.log('POOL GONE',k); bad++; continue; }
  const bids=bv.map(v=>v.vid), tids=tv.map(v=>v.vid);
  const off=tv.length?tv[0].vid:1; tv.forEach((v,i)=>{ if(v.vid!==i+off){ console.log('VID NOT ROW',k,v.vid,'at row',i+1); bad++; } }); const boff=bv.length?bv[0].vid:1; if(off!==boff){ console.log('OFFSET MOVED',k,boff,off); bad++; }
  const gone=bids.filter(x=>!tids.includes(x)); const maxT=Math.max(0,...tids);
  for(const g of gone){ if(g<maxT){ console.log('MIDDLE ROW STRUCK',k,'v'+g); bad++; } else struckTail++; }
  let rew=0; for(const v of tv){ const o=bv.find(x=>x.vid===v.vid); if(o && o.text!==v.text) rew++; } if(rew||gone.length) touched.push(k+' reworded '+rew+' struck '+gone.map(g=>'v'+g).join(','));  }
fs.writeFileSync(process.argv[4]||'/dev/null',touched.join('\n')+'\n');
for(const k of tip.keys()) if(!base.has(k)) console.log('POOL NEW',k);
console.log('pools base',base.size,'tip',tip.size,'| tail rows struck',struckTail,'| violations',bad);
