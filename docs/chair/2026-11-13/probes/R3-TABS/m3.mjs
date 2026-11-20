import { towns } from './load.mjs';
const T=process.env.TREE+'/src';
const { standingDefenseForces } = await import(T+'/domain/institutions/defenseInstitutionBuckets.js');
const D = await import(T+'/domain/display/stateProse/defenseStateProse.js');
const cell={}, ex={};
let n=0;
for(const f of process.argv.slice(2)) for(const {seed,s} of towns(f)){ n++;
  const F=standingDefenseForces(s); const w=F.walls.present,g=F.garrison.present,m=F.militia.present,wa=F.watch.present,me=F.mercenary.present;
  const now=D.invasionRowPoolKey(w,g,m);
  const k=`walls=${+w} gar=${+g} mil=${+m} watch=${+wa} merc=${+me} -> ${now.replace('Invasion & War: ','')}`;
  cell[k]=(cell[k]||0)+1; (ex[k]=ex[k]||[]).length<3&&ex[k].push(seed);
}
console.log('births',n); for(const k of Object.keys(cell).sort()) console.log(cell[k].toString().padStart(4), k, ex[k].join(' '));
