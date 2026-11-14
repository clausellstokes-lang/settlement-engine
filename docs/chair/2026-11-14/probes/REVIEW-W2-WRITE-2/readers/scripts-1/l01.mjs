import { createRequire } from 'module';const require=createRequire(import.meta.url);
import {df} from './df.mjs';const {facts}=require('./facts.js');const fs=require('fs');
const L=JSON.parse(fs.readFileSync(process.argv[2]));
for(const i of process.argv.slice(3).map(Number)){const l=L[i];console.log('#',i,l.id);
 for(const p of l.prints){const f=facts(p.town),d=df(p.town);
  console.log([p.town,f.tier,f.pop,f.stress.join('+')||'calm',f.mt,d.wallKind,'G'+(+d.hasGarrison),'M'+(+d.hasMilitia),'W'+(+d.hasWatch),'mon'+f.scores.mon,d.defenceNames.join(';')].join(' | '));}}
