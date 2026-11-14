import fs from 'node:fs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const { populationBandOf } = await import(S+'/tip/src/domain/facts/populationBand.js');
const T=JSON.parse(fs.readFileSync('scope-tip.json')), Q=JSON.parse(fs.readFileSync('scope-q.json'));
const TINY=/\bstreets\b|\bagora\b|civic square|market square|masonry|neighbourhood|suburb|plaza/i, SMALL=/\bquarters\b|\bdistricts?\b|\bwards\b/i;
const tinyTier=new Set(['thorp','hamlet']); const c={}; const ex={};
for(const seed in T){ const t=T[seed], q=Q[seed]; if(!q) continue; const band=populationBandOf({population:t.pop,tier:t.tier});
  const graz=Array.isArray(t.res)&&t.res.includes('grazing_land');
  const chk=(v)=>{ const f=[]; if(tinyTier.has(t.tier)&&TINY.test(v)) f.push('tiny'); if(band==='small'&&SMALL.test(v)) f.push('small'); if(t.market===false&&/\bagora\b|market square/i.test(v)) f.push('agora'); if(!graz&&/\bpasture\b/i.test(v)) f.push('pasture'); if(/assembly ground/i.test(v)) f.push('assemb'); if(band!=='large'&&/\bstreets\b/i.test(v)) f.push('streetsNotLarge'); return f; };
  for(const k of chk(q.v)) c[k+'Q']=(c[k+'Q']||0)+1; for(const k of chk(t.v)){ c[k+'T']=(c[k+'T']||0)+1; (ex[k]=ex[k]||[]).push(seed+' ['+t.tier+' '+t.pop+' '+band+'] '+t.v); } }
console.log(c); for(const k in ex) console.log(k, ex[k].length, '\n  '+ex[k].slice(0,5).join('\n  '));
