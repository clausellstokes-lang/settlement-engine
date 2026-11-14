import { createRequire } from 'module';const require=createRequire(import.meta.url);
import {df} from './df.mjs';const {facts,rec,page}=require('./facts.js');const {defenseTab,block}=require('./row.js');const fs=require('fs');
const L=JSON.parse(fs.readFileSync(process.argv[2]));const res={};
const THREAT=['under_siege','occupied','monster_pressure'];
const has=(f,k)=>f.stress.includes(k);
const T={
0:(f,d,tab)=>({ok:d.hasWalls&&(d.hasGarrison||d.hasMilitia)&&f.mt==='plagued',low:d.wallKind==='palisade'?'palisade called walls':null}),
1:(f,d,tab)=>({ok:d.hasWalls&&(d.hasGarrison||d.hasMilitia)&&f.mt==='plagued',low:(has(f,'under_siege')||has(f,'occupied'))?'siege/occupation':null}),
2:(f,d,tab)=>({ok:d.wallKind==='stone'&&d.hasGarrison&&!has(f,'under_siege')&&!has(f,'occupied'),low:/underpaid|irregular pay|paid late|already owed/i.test(tab)?'pay trouble on page':null}),
3:(f,d,tab)=>({ok:!d.hasWalls&&!d.hasGarrison&&!d.hasMilitia&&!f.stress.some(s=>THREAT.includes(s)),low:d.hasWatch?'watch':has(f,'wartime')?'wartime':null}),
4:(f,d,tab)=>({ok:!d.hasWalls&&!d.hasGarrison&&!d.hasMilitia&&!d.hasWatch&&!d.hasCharter&&f.stress.some(s=>THREAT.includes(s)),low:has(f,'under_siege')?'siege: levy of householders, danger understated':null}),
5:(f,d,tab)=>({ok:!d.hasWalls&&!d.hasGarrison&&!d.hasMilitia&&!/arming themselves/i.test(tab),low:null}),
6:(f,d,tab)=>({ok:!d.hasWalls&&!d.hasGarrison&&!d.hasMilitia&&d.hasWatch&&f.stress.some(s=>THREAT.includes(s)),low:null}),
7:(f,d,tab)=>({ok:d.hasCourt&&d.hasPrison,low:null}),
8:(f,d,tab)=>({ok:d.hasCourt&&d.hasPrison,low:has(f,'occupied')?'occupied':null}),
9:(f,d,tab,t)=>({ok:d.hasCourt&&!d.hasPrison,low:t.institutions.some(i=>/workhouse/i.test(i.name))?'workhouse':has(f,'under_siege')?'siege: exile':null}),
10:(f,d,tab)=>({ok:d.hasCourt&&!d.hasPrison,low:'stretch'}),
11:(f,d,tab,t,pg)=>({ok:!d.hasCourt&&!d.hasPrison,low:/appointed to judge a case/.test(pg)?'NPC judges a case':null}),
12:(f,d,tab)=>({ok:f.scores.eco>=65&&f.stress.length&&!has(f,'indebted')&&(d.hasGarrison||d.hasWatch||d.hasMilitia||d.hasMercenary)&&!/occupiers take the revenue|underpaid|irregular pay/i.test(tab),low:has(f,'famine')?'famine':/Poor|Struggling/.test(f.pros)?'prosperity '+f.pros:null}),
13:(f,d,tab)=>({ok:f.scores.eco>=65&&has(f,'indebted'),low:null}),
14:(f,d,tab)=>({ok:f.scores.eco>=65&&f.stress.length&&!has(f,'indebted')&&!has(f,'famine'),low:has(f,'occupied')?'occupied':null}),
15:(f,d,tab)=>({ok:f.scores.eco>=65&&f.stress.length&&!has(f,'indebted')&&!has(f,'famine')&&!/occupiers take the revenue|underpaid|irregular pay/i.test(tab),low:null}),
16:(f,d,tab)=>({ok:(f.cm?.military||0)>0&&(d.hasGarrison||d.hasMilitia),low:/underpaid|irregular pay|paid late/i.test(tab)?'pay trouble on page':null}),
17:(f,d,tab)=>({ok:(f.cm?.military||0)>0&&(d.hasGarrison||d.hasMilitia),low:/underpaid|irregular pay|paid late/i.test(tab)?'pay trouble on page':null}),
18:(f,d,tab)=>({ok:(f.cm?.military||0)>0&&(d.hasGarrison||d.hasMilitia),low:/underpaid|irregular pay|paid late/i.test(tab)?'pay trouble on page':null}),
19:(f,d,tab)=>({ok:(f.cm?.military||0)>0&&(d.hasGarrison||d.hasMilitia)&&['famine','deficit'].includes(f.food.band),low:null}),
20:(f,d,tab)=>({ok:(f.cm?.economic||0)>0&&f.chains.food_processing!=='impaired'&&f.food.months>=1&&!has(f,'famine')&&!has(f,'under_siege'),low:f.chains.food_processing==='vulnerable'?'chain vulnerable':null}),
21:(f,d,tab)=>({ok:(f.cm?.economic||0)>0&&f.chains.food_processing!=='impaired'&&!has(f,'under_siege'),low:null}),
22:(f,d,tab)=>({ok:(f.cm?.economic||0)>0&&f.chains.food_processing!=='impaired'&&f.food.months>0&&!has(f,'under_siege'),low:has(f,'famine')?'famine in force':null}),
23:(f,d,tab)=>({ok:(f.cm?.economic||0)>0&&f.chains.food_processing!=='impaired'&&has(f,'under_siege')&&f.food.band!=='famine',low:null}),
};
L.forEach((l,i)=>{let t=0,fa=[],lows={};for(const p of l.prints){const f=facts(p.town),d=df(p.town),tab=defenseTab(p.town),r=rec(p.town);const o=T[i](f,d,tab,r,page(p.town));if(o.ok)t++;else fa.push(p.town);if(o.low){(lows[o.low]=lows[o.low]||[]).push(p.town);}}
 res[i]={true:t,false:fa.length,falseTowns:fa,lows:Object.fromEntries(Object.entries(lows).map(([k,v])=>[k,v.length]))};console.log(i,JSON.stringify(res[i]));});
fs.writeFileSync(process.argv[3],JSON.stringify(res));
