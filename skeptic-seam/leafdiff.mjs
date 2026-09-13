import fs from 'node:fs';
const files=['defense','economy','general','power','stressors','warFaith'];
async function load(root){
  const out={};
  for(const f of files){
    const mod=await import(root+'/src/data/dossierStateProse/'+f+'.generated.js');
    Object.assign(out, Object.values(mod)[0]);
  }
  return out;
}
const A=await load(process.argv[2]);
const B=await load(process.argv[3]);
const ka=Object.keys(A), kb=Object.keys(B);
console.log('blocks base',ka.length,'tip',kb.length);
let added=0,removed=0,changed=0, variantMoves=new Map(), blockMoves=new Map(), textMoved=[];
const poolsOf=o=>{const m=new Map();for(const[b,blk]of Object.entries(o))for(const[p,v]of Object.entries(blk.pools))m.set(b+'::'+p,v);return m;};
const pa=poolsOf(A), pb=poolsOf(B);
for(const k of pa.keys()) if(!pb.has(k)) removed++;
for(const k of pb.keys()) if(!pa.has(k)) added++;
for(const [k,va] of pa){
  const vb=pb.get(k); if(!vb) continue;
  const norm=v=>JSON.stringify(v.map(x=>({angle:x.angle,marks:x.marks,text:x.text,slots:x.slots})));
  if(norm(va)!==norm(vb)){changed++; if(textMoved.length<5) textMoved.push(k);}
  for(let i=0;i<Math.max(va.length,vb.length);i++){
    const sa=va[i]?Object.keys(va[i]).sort().join(','):'(none)';
    const sb=vb[i]?Object.keys(vb[i]).sort().join(','):'(none)';
    if(sa!==sb){const key=sa+' -> '+sb; variantMoves.set(key,(variantMoves.get(key)||0)+1);}
  }
}
for(const [b,blk] of Object.entries(B)){
  const sa=A[b]?Object.keys(A[b]).sort().join(','):'(none)';
  const sb=Object.keys(blk).sort().join(',');
  if(sa!==sb){const key=sa+' -> '+sb; blockMoves.set(key,(blockMoves.get(key)||0)+1);}
}
console.log('[leaf-diff]',added,'ADDED /',removed,'REMOVED /',changed,'CHANGED pools');
console.log('text-moved sample',textMoved.join(' | '));
console.log('VARIANT key-set moves:');
for(const[k,v]of variantMoves) console.log('  ',v,'x',k);
console.log('BLOCK key-set moves:');
for(const[k,v]of blockMoves) console.log('  ',v,'x',k);
let nv=0; for(const v of pb.values()) nv+=v.length; console.log('tip variants',nv,'tip pools',pb.size);
