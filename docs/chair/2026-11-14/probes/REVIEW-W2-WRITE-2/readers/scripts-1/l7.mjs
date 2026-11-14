import { createRequire } from 'module';const require=createRequire(import.meta.url);
import {df} from './df.mjs';const {facts}=require('./facts.js');const {defenseTab}=require('./row.js');const fs=require('fs');
const L=JSON.parse(fs.readFileSync(process.argv[2]));const idx=+process.argv[3];const re=new RegExp(process.argv[4],'i');const l=L[idx];let n=0,flag=[];
for(const p of l.prints){const f=facts(p.town),d=df(p.town);const tab=defenseTab(p.town);const hits=tab.split('\n').filter(x=>re.test(x)&&!x.includes(p.page[0]?.printed||'@@'));
 const s=[p.town,f.tier,f.pop,f.stress.join('+')||'calm','court'+(+d.hasCourt),'prison'+(+d.hasPrison),'ch'+(+f.inst.court)+(+f.inst.prison),f.safety].join(' | ');
 if(!d.hasCourt||!d.hasPrison||hits.length){flag.push(p.town);console.log(s);for(const h of hits)console.log('    >',h.slice(0,260));}n++;}
console.log('n',n,'flagged',flag.length);
