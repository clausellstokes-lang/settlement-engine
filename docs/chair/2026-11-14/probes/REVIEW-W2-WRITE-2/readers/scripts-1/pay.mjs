import { createRequire } from 'module';const require=createRequire(import.meta.url);
const {facts}=require('./facts.js');const {defenseTab}=require('./row.js');const fs=require('fs');
const L=JSON.parse(fs.readFileSync(process.argv[2]));
const re=/underpaid|irregular pay|paid late|already owed|unpaid wages|not been paid|occupiers take the revenue|exists on paper/i;
for(const i of process.argv.slice(3).map(Number)){const l=L[i];const out=[];
 for(const p of l.prints){const f=facts(p.town);const tab=defenseTab(p.town).split('\n');const own=p.page[0]?.printed||'@@';
  const hits=tab.filter(x=>re.test(x)&&!x.includes(own)).map(x=>{const m=x.match(re);const k=x.indexOf(m[0]);return x.slice(Math.max(0,k-60),k+70);});
  if(hits.length)out.push(p.town+' ['+f.stress.join('+')+'] '+hits.join(' || '));}
 console.log('#',i,'n',l.prints.length,'hits',out.length);out.forEach(x=>console.log('  ',x));}
