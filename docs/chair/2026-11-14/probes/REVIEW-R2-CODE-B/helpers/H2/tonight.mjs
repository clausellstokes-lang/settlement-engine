import fs from 'fs';
import {towns} from './load.mjs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const {composeTonightSheet}=await import(S+'/tip/src/domain/summary/tonightSheet.js');
const want=new Set(fs.readFileSync('temps.txt','utf8').split('\n').slice(1).filter(Boolean).map(l=>l.split(' | ')[0]).filter(x=>/^r2[rs]-/.test(x)));
const shapes={};
for await (const {seed,s} of towns()){ if(!want.has(seed)) continue;
  const rec=fs.existsSync(`${S}/out/render-tip/records/${seed}.json`)?JSON.parse(fs.readFileSync(`${S}/out/render-tip/records/${seed}.json`,'utf8')):s;
  const t=composeTonightSheet(rec); const temp=(rec.npcs||[]).filter(n=>n.temporary).map(n=>n.name);
  const ps=t.people.filter(p=>temp.includes(p.name));
  for(const p of ps){ console.log(seed, rec.tier, JSON.stringify(p)); const k=JSON.stringify({...p,name:'<N>',castId:undefined}); shapes[k]=(shapes[k]||0)+1; }
  if(!ps.length) console.log(seed,'temp not on tonight; people:', t.people.map(p=>p.name+'('+p.castLabel+')').join(', '));
}
console.log(shapes);
