// npcdiff.mjs <base.gz> <tip.gz> <out.jsonl> [seedRx]: per town, per person (matched by id, else name): hooks compared AS
// SETS (added/removed texts), secret.what/stakes, presentation.*, goal.short/long. Writes one row per changed text.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [fa, fb, outf, sre] = process.argv.slice(2); const SRX = sre ? new RegExp(sre) : null;
async function* rd(f){ const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity}); for await (const l of rl) if(l) yield JSON.parse(l); }
const A=new Map(); for await (const o of rd(fa)) if(!SRX||SRX.test(o.seed)) A.set(o.seed,(o.s.npcs||[]));
const out=fs.createWriteStream(outf); const tally={}; const towns={}; let rosterMoved=new Set();
const hk=(n)=>(n.plotHooks||[]).map(h=>typeof h==='string'?h:(h?.text||h?.hook||JSON.stringify(h)));
for await (const o of rd(fb)){ if(SRX&&!SRX.test(o.seed)) continue; const a=A.get(o.seed)||[]; const b=o.s.npcs||[];
  const key=(n)=>n.id||n.name; const am=new Map(a.map(n=>[key(n),n]));
  if(a.length!==b.length || b.some(n=>!am.has(key(n)))) rosterMoved.add(o.seed);
  for(const n of b){ const m=am.get(key(n)); if(!m) continue; const ctx={seed:o.seed,tier:o.s.tier,pop:o.s.population,st:(Array.isArray(o.s.stress)?o.s.stress:o.s.stress?[o.s.stress]:[]).map(x=>x.type).join('+'),npc:n.name,role:n.role||n.title,cat:n.category||n.factionCategory};
    const ha=new Set(hk(m)), hb=new Set(hk(n));
    for(const t of hb) if(!ha.has(t)){ out.write(JSON.stringify({...ctx,f:'hook+',t})+'\n'); tally['hook+']=(tally['hook+']||0)+1; (towns['hook']??=new Set()).add(o.seed); }
    for(const t of ha) if(!hb.has(t)){ out.write(JSON.stringify({...ctx,f:'hook-',t})+'\n'); tally['hook-']=(tally['hook-']||0)+1; }
    for(const [f,va,vb] of [['secret.what',m.secret?.what,n.secret?.what],['secret.stakes',m.secret?.stakes,n.secret?.stakes],['goal.short',m.goal?.short,n.goal?.short],['goal.long',m.goal?.long,n.goal?.long],...['impression','disposition','behaviour'].map(k=>['presentation.'+k,m.presentation?.[k],n.presentation?.[k]])])
      if(JSON.stringify(va)!==JSON.stringify(vb)){ out.write(JSON.stringify({...ctx,f,base:va,t:vb})+'\n'); tally[f]=(tally[f]||0)+1; (towns[f]??=new Set()).add(o.seed); }
  } }
out.end(); console.log(JSON.stringify(tally)); console.log('towns', JSON.stringify(Object.fromEntries(Object.entries(towns).map(([k,v])=>[k,v.size])))); console.log('roster moved', rosterMoved.size, [...rosterMoved].slice(0,10).join(' '));
