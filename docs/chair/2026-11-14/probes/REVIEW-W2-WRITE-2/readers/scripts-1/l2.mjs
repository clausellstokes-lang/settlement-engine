import { createRequire } from 'module';const require=createRequire(import.meta.url);
import {df} from './df.mjs';const {facts,page}=require('./facts.js');const {block,defenseTab}=require('./row.js');const fs=require('fs');
const L=JSON.parse(fs.readFileSync(process.argv[2]));const l=L[2];let ok=0,bad=[];
const band=s=>s>=80?'STRONG':s>=60?'ADEQ':s>=40?'WEAK':'CRIT';
for(const p of l.prints){const f=facts(p.town),d=df(p.town);const tab=defenseTab(p.town);
 const late=/paid late|pay book is always behind|already owed|not at all/i.test(tab);
 const cond=d.wallKind==='stone'&&d.hasGarrison&&!late;
 console.log([p.town,f.tier,f.pop,f.stress.join('+')||'calm',d.wallKind,'G'+(+d.hasGarrison),'eco'+f.scores.eco,'gch:'+f.chains.garrison,late?'LATE':'',(d.defenceNames.join(';')).slice(0,90)].join(' | '));
 if(cond)ok++;else bad.push(p.town);}
console.log('ok',ok,'bad',bad);
