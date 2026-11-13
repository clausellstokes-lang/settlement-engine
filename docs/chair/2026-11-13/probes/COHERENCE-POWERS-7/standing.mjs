// node standing.mjs <tree> <corpus...>: standing sentences in faction descs vs the final figures
import { recs } from './rd.mjs'; import path from 'node:path';
const T=path.resolve(process.argv[2]);
const { standingRosterOf } = await import(T+'/src/generators/power/rosterText.js');
const out={level:[0,0],narrow:[0,0],slowwar:[0,0]}; const ex={level:[],narrow:[],slowwar:[]};
let towns=new Set();
for (const f of process.argv.slice(3)) for await (const {seed,s} of recs(f)) {
  const facs=s.powerStructure?.factions||[]; const r=standingRosterOf(facs); const top=r[0]?.power||0, second=r[1]?.power||0;
  for (const fa of facs) { const d=String(fa.desc||''); const rank=r.findIndex(x=>x.faction===fa.faction);
    if (d.includes('Three powers stand almost level')) { const bad = top - second > 5; out.level[bad?1:0]++; if(bad) {ex.level.push(`${seed} ${fa.faction} ${r.map(x=>x.power).join('/')}`); towns.add(seed);} }
    const m=d.match(/The gap between them and (.+?) is narrow/); if (m) { const lead=r.find(x=>x.faction===m[1]||(m[1]==='the governing council'&&x.isGoverning)); const bad=!lead || lead.power-(Number(fa.power)||0) > 6; out.narrow[bad?1:0]++; if(bad){ ex.narrow.push(`${seed} ${fa.faction} ${fa.power} vs ${m[1]} ${lead?.power}`); towns.add(seed);} }
    if (d.includes('A slow war with the guild')) { const tg=facs.some(x=>/thieves/i.test(x.faction)); out.slowwar[tg?0:1]++; if(!tg){ ex.slowwar.push(`${seed} ${fa.faction}`); towns.add(seed);} }
  } }
console.log(JSON.stringify(out), 'false-towns', towns.size); for (const k in ex) console.log(k, ex[k].length, ex[k].slice(0,6));
