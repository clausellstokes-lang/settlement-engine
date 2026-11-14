import fs from 'fs'; import zlib from 'zlib';
const S='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad';
export const R=S+'/r/tip'; export const TREE=S+'/wt/tip';
const { factsOf } = await import(TREE+'/src/domain/facts/factsOf.js');
const { standingDefenseForces } = await import(TREE+'/src/domain/defense/standingDefenseForces.js').catch(()=>({}));
export const LINES=JSON.parse(fs.readFileSync(S+'/readers/lines-2.json'));
const cache={};
export function rec(town){ if(!cache[town]) cache[town]=JSON.parse(zlib.gunzipSync(fs.readFileSync(`${R}/records/${town}.json.gz`))); return cache[town]; }
export function page(town){ try{return fs.readFileSync(`${R}/dumps/${town}.txt`,'utf8');}catch{return '';} }
export function facts(town){
  const t=rec(town); const f=factsOf(t); const d=f.defence; const c=f.crisis;
  const chains=Object.fromEntries((t.economicState?.activeChains||[]).map(x=>[x.chainId,x.status]));
  const live=(t.institutions||[]).filter(i=>!i.status||!/ruin|destroy|abandon|closed/i.test(i.status));
  return { town, tier:t.tier, pop:t.population, name:t.name,
    stress:(Array.isArray(t.stress)?t.stress:(t.stress?[t.stress]:[])).map(s=>s.type),
    crisis:c, d, guard:f.guardPresence, soldiers:f.soldiers, famine:f.famine, stores:f.storesMonths,
    monster:t.config?.monsterThreat, econScore:t.defenseProfile?.scores?.economic, chainMod:t.defenseProfile?.chainModifiers,
    chains, prosperity:t.economicState?.prosperity, gov:t.powerStructure?.governingName||t.powerStructure?.government?.name,
    insts:live.map(i=>i.name), t };
}
export function sec(pg, view){ // view like "Systems/Defense"
  const tab=view.split('/').pop(); const re=new RegExp('^== .*'+tab.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'.*==$','m');
  const m=pg.match(re); if(!m) return ''; const i=m.index; const rest=pg.slice(i+m[0].length); const n=rest.search(/^== /m); return m[0]+rest.slice(0,n<0?undefined:n);
}
