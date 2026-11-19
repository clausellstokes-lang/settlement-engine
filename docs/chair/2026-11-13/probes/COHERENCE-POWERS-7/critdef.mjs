import { recs } from './rd.mjs'; import path from 'node:path';
const T=path.resolve(process.argv[2]);
const { houseBacksOf } = await import(T+'/src/domain/dossier/powerSupport.js');
const { isCriminalInstitution } = await import(T+'/src/domain/corruption.js');
let towns=0, houses=0; const names={};
for (const f of process.argv.slice(3)) for await (const {seed,s} of recs(f)) { let t=0;
  for (const inst of s.institutions||[]) { const l=houseBacksOf(s).get(inst.name)||[]; if (l.some(b=>b.basis==='default') && isCriminalInstitution(inst)) { t++; names[inst.name]=(names[inst.name]||0)+1; } }
  if (t) { towns++; houses+=t; } }
console.log('towns',towns,'houses',houses); console.log(Object.entries(names).sort((a,b)=>b[1]-a[1]).slice(0,15));
