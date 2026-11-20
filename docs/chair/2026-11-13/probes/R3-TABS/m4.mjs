// m4: the threat rows and the posture line, base tree (A) against work tree (B), on the same births.
import { towns } from './load.mjs';
const A = await import(process.env.A+'/src/domain/display/stateProse/defenseStateProse.js');
const B = await import(process.env.B+'/src/domain/display/stateProse/defenseStateProse.js');
const { standingDefenseForces } = await import(process.env.B+'/src/domain/institutions/defenseInstitutionBuckets.js');
const txt=(r)=>{ if(!r) return null; const t=r.text ?? r.sentence ?? r.rung?.text ?? r.rung?.sentence ?? r.beside ?? null; return typeof t==='string'?t:JSON.stringify(r).slice(0,200); };
const which=process.env.WHICH||'threat';
const changed={}; const samples={}; let n=0;
for(const f of process.argv.slice(2)) for(const {seed,s} of towns(f)){ n++;
  const opts={seed, audience:'dm', tierNoun:s.tier};
  const a = which==='threat'?A.defenseThreatProse(s,opts):A.defensePostureProse(s,opts);
  const b = which==='threat'?B.defenseThreatProse(s,opts):B.defensePostureProse(s,opts);
  for(const k of Object.keys(b)){ const ta=txt(a[k]), tb=txt(b[k]); if(ta!==tb){ const F=standingDefenseForces(s); const cell=`${k} | ${s.defenseProfile?.readiness?.label} | walls=${+F.walls.present} gar=${+F.garrison.present} mil=${+F.militia.present} watch=${+F.watch.present} merc=${+F.mercenary.present} | stress=${[].concat(s.stress||[]).map(x=>x?.type).join('+')||'-'}`;
    const key=k+' | '+(which==='threat'?cell.split(' | ').slice(2,3):s.defenseProfile?.readiness?.label);
    changed[key]=(changed[key]||0)+1; (samples[key]=samples[key]||[]).push(`${seed} [${cell}]\n     OLD: ${ta}\n     NEW: ${tb}`); } }
}
console.log('births',n); for(const k of Object.keys(changed).sort()) console.log(changed[k], k);
if(process.env.SHOW) for(const k of Object.keys(samples).sort()){ console.log('\n####',k); for(const x of samples[k].slice(0,+process.env.SHOW)) console.log('  '+x); }
