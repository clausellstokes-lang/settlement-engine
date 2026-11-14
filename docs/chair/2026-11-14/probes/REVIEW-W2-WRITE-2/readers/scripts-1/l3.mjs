import { createRequire } from 'module';const require=createRequire(import.meta.url);
import {df} from './df.mjs';const {facts}=require('./facts.js');const {block,defenseTab}=require('./row.js');const fs=require('fs');
const L=JSON.parse(fs.readFileSync(process.argv[2]));const l=L[+process.argv[3]];
for(const p of l.prints){const f=facts(p.town),d=df(p.town);const b=block(p.town)||'';
 const bm=(b.split('\n')[b.split('\n').indexOf('Beasts & Monsters')+2]||'').slice(0,110);
 console.log([p.town,f.tier,f.pop,f.stress.join('+')||'calm',f.mt,'W'+(+d.hasWatch),'Merc'+(+d.hasMercenary),'Ch'+(+d.hasCharter),d.defenceNames.join(';').slice(0,60),bm].join(' | '));}
