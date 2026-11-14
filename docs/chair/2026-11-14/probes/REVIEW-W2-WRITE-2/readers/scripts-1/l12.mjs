import { createRequire } from 'module';const require=createRequire(import.meta.url);
import {df} from './df.mjs';const {facts,page}=require('./facts.js');const {defenseTab}=require('./row.js');const fs=require('fs');
const L=JSON.parse(fs.readFileSync(process.argv[2]));
const re=/underpaid|irregular pay|unpaid|paid late|owed|exists on paper|cannot pay|no money|treasury is (empty|bare)|bankrupt|insolvent/i;
for(const i of process.argv.slice(3).map(Number)){const l=L[i];console.log('#',i,l.id.split('::').slice(1).join('::'));let bad=0;
 for(const p of l.prints){const f=facts(p.town),d=df(p.town);const tab=defenseTab(p.town).split('\n');const own=p.page[0]?.printed||'@@';
  const hits=tab.filter(x=>re.test(x)&&!x.includes(own)).map(x=>{const m=x.match(re);const k=x.indexOf(m[0]);return x.slice(Math.max(0,k-80),k+60);});
  const guard=d.hasGarrison||d.hasWatch||d.hasMilitia||d.hasMercenary;
  const flag=hits.length||!guard||/struggl|poor|destitute|impoverish/i.test(f.pros||'');
  if(flag)bad++;
  console.log((flag?'! ':'  ')+[p.town,f.tier,f.pop,f.stress.join('+'),'eco'+f.scores.eco,f.pros,'guard'+(+guard),'food:'+f.food.band].join(' | '));
  hits.slice(0,3).forEach(h=>console.log('      >',h));}
 console.log('flagged',bad,'of',l.prints.length);}
