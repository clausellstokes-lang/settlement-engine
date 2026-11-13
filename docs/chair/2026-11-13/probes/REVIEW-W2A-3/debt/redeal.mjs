import fs from 'node:fs';
const T='/home/user/wt/r-tip/records'; const out={};
for(const k of ['write','data','upkeep','merge']){ out[k]={};
  for(const f of fs.readdirSync(T)){ const a=JSON.parse(fs.readFileSync(T+'/'+f)), b=JSON.parse(fs.readFileSync(`/home/user/wt/r-${k}/records/${f}`));
    const id=(r)=>({name:r.name,pop:r.population,tier:r.tier,inst:(r.institutions||[]).map(i=>i.name).sort().join('|'),npcs:(r.npcs||[]).map(n=>n.name).sort().join('|'),factions:(r.powerStructure?.factions||[]).map(x=>x.faction||x.name).sort().join('|')});
    const A=id(a),B=id(b); const diff=Object.keys(A).filter(x=>A[x]!==B[x]);
    const strip=(r)=>{const c={...r}; delete c.publicProse; return JSON.stringify(c)}; const same=strip(a)===strip(b);
    out[k][f.replace('.json','')]= same?'identical':(diff.length?'RE-DEALT:'+diff.join(','):'fields moved, identity kept'); } }
fs.writeFileSync('/home/user/wt/debt/redeal.json',JSON.stringify(out,null,1));
for(const k of Object.keys(out)){ const c={}; for(const v of Object.values(out[k])){ const kk=v.startsWith('RE-DEALT')?'re-dealt':v; c[kk]=(c[kk]||0)+1;} console.log(k,JSON.stringify(c)); for(const [t,v] of Object.entries(out[k])) if(v.startsWith('RE-DEALT')) console.log('   ',t,v); }
