// SECOND-WAVE-CENSUS compare: node compare.mjs <base counts.perseed.json> <tip counts.perseed.json>
// A row per pattern: towns of the 720 in base / tip, verdict (OLD when |Δ| ≤ max(5, 20% of base); NEW when base 0),
// and what a reader notices (GLANCE / SECOND READ / CROSS-CHECK). Then GLANCE towns and median patterns per town.
import fs from 'node:fs';

const [M,T]=process.argv.slice(2,4).map(f=>JSON.parse(fs.readFileSync(f)));
const ROWS=[['1a food verdict "only just" vs grows more',['P1a'],'SECOND'],['1b "small margin" vs ≥25% imported',['P1b'],'SECOND'],['2 two store durations',['P2'],'CROSS'],['3 magic tab vs Arcane None',['P3any'],'CROSS'],['4 "almost level" vs leader far ahead',['P4'],'SECOND'],['5a hall free vs criminal money',['P5a'],'SECOND'],['5b Diffuse vs criminal power',['P5b'],'SECOND'],['6 gap vs imports',['P6'],'CROSS'],['7a two founders',['P7a'],'GLANCE'],['7b no wharf vs port origin',['P7b'],'CROSS'],['8 no church vs worship economy',['P8any','P8houses'],'CROSS'],['9 Critical over reassuring text',['P9'],'GLANCE'],['10 hold the gates, no walls',['P10'],'SECOND'],['11 flow source town lacks',['P11'],'CROSS'],['F4 income line, no working',['P12ore','P12coal','P12quarry','P12saw'],'CROSS'],['13 "…and go on." doubled',['P13'],'GLANCE'],['14 size words in small places',['P14','P14district'],'SECOND'],['15 burial under Healing',['P15'],'SECOND'],['16a "ruling three" lists fewer',['P16three'],'GLANCE'],['16b two "Powers (n)" counts',['P16powers'],'GLANCE'],['17 non-goods produced locally',['P17'],'GLANCE'],['18 count ranges as names',['P18npc','P18rec'],'GLANCE'],['19 debug text as tension',['P19'],'GLANCE'],['20 siege text, no siege',['P20'],'SECOND'],['NEW-1 governance vs Defense',['NEW1','NEW1b'],'SECOND'],['NEW-2 magic income, no practitioner',['NEW2'],'CROSS']];
const S=fs.readFileSync(new URL('./seeds.txt', import.meta.url),'utf8').trim().split('\n');
const rowsOf=(map,seed)=>ROWS.filter(([,k])=>k.some(x=>(map[seed]||[]).includes(x)));
const verdict=(m,t)=>m===0&&t>0?'NEW':m===0&&t===0?'—':(Math.abs(t-m)<=Math.max(5,0.2*m)?'OLD':t>m?'WORSE':'BETTER');
console.log('row | base | tip | verdict | reader');
for(const r of ROWS){ const m=S.filter(s=>rowsOf(M,s).includes(r)).length, t=S.filter(s=>rowsOf(T,s).includes(r)).length; console.log(`${r[0]} | ${m} | ${t} | ${verdict(m,t)} | ${r[2]}`); }
const glance=(map)=>S.filter(s=>rowsOf(map,s).some(r=>r[2]==='GLANCE')).length;
const glanceNo1518=(map)=>S.filter(s=>rowsOf(map,s).some(r=>r[2]==='GLANCE'&&!/^1[78] /.test(r[0]))).length;
const med=(map)=>{const a=S.map(s=>rowsOf(map,s).length).sort((x,y)=>x-y);return [a[Math.floor(a.length/2)-1],a[Math.floor(a.length/2)], a.reduce((x,y)=>x+y,0)/a.length];};
console.log('towns',S.length,'GLANCE base',glance(M),'tip',glance(T),'| GLANCE excl 17,18 base',glanceNo1518(M),'tip',glanceNo1518(T));
console.log('median rows/town base',med(M),'tip',med(T));
