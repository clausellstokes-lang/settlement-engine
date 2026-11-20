// node culture.mjs TREE corpus : each architectural detail's printings (record: culturalIdentity.architecturalDetail, arrivalScene) by tier
import { loadCorpus } from './load.mjs';
const TREE=process.argv[2]; const C=loadCorpus(process.argv[3]);
const { CULTURE_PROFILES, CULTURE_LINE_SIBLINGS } = await import(TREE + '/src/data/cultureProfiles.js');
const { textOf } = await import(TREE + '/src/domain/facts/textOf.js');
const rows=new Set(); for(const p of Object.values(CULTURE_PROFILES)) for(const d of p.architecturalDetails) rows.add(String(textOf(d))); for(const v of Object.values(CULTURE_LINE_SIBLINGS)) for(const d of v) rows.add(d.text);
const cnt=new Map();
for(const {seed,s} of C){ const det=String(s.culturalIdentity?.architecturalDetail||''); const arr=String(s.arrivalScene||'').toLowerCase();
 for(const r of rows){ const inDet=det.includes(r); const inArr=arr.includes(r.toLowerCase()); if(!inDet&&!inArr) continue; const k=r; const o=cnt.get(k)||{}; o[s.tier]=(o[s.tier]||0)+1; o._arr=(o._arr||0)+(inArr?1:0); cnt.set(k,o);} }
for(const [k,o] of [...cnt].sort()) console.log(k.slice(0,90).padEnd(90),'|',['thorp','hamlet','village','town','city','metropolis'].map(t=>(o[t]||0)).join(' '),'| arrival',o._arr);
