// dumpcheck: the H1 family's printed lines in the tab dumps, read against scan.jsonl (the record's composed facts).
import fs from 'node:fs';
const D='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/render-tip/dumps';
const L=new Map(fs.readFileSync('scan.jsonl','utf8').trim().split('\n').map(l=>{const x=JSON.parse(l);return [x.seed,x];}));
const res={}; const add=(k,v)=>{(res[k]=res[k]||[]).push(v);}; let n=0;
for(const f of fs.readdirSync(D)){ if(!f.endsWith('.txt')) continue; const seed=f.slice(0,-4); const x=L.get(seed); if(!x) continue; n++;
  const lines=fs.readFileSync(D+'/'+f,'utf8').split('\n'); const sec={}; let cur='';
  for(const l of lines){ const m=l.match(/^== (.+) ==$/); if(m){cur=m[1]; sec[cur]=[]; continue;} if(cur) sec[cur].push(l); }
  const ov=(sec['Summary/Overview']||[]).find(l=>/^Food Security\S/.test(l)); const ovLabel=ov?ov.replace(/^Food Security/,''):null;
  const dl=sec['World/Daily Life']||[]; const di=dl.indexOf('Food'); const dlLabel=di>=0?dl[di+1]:null;
  
  if(dlLabel!==x.food.bandOf) add('dl-vs-bandOf', `${seed} dl=${dlLabel} bandOf=${x.food.bandOf}`);
  if(ovLabel && dlLabel && ovLabel!==dlLabel) add('ov-vs-dl', `${seed} [${x.tier}] overview="${ovLabel}" dailylife="${dlLabel}" gap=${x.food.gap} imp=${x.food.imp} band=${x.food.band}`);
  if(!ovLabel) add('ov-missing', seed);
  // Economics: the food row prints the record's band? find "Food security" chip rows in Economics
  const eco=sec['Systems/Economics']||[];
  const ecoFood=eco.filter(l=>/^(Secure|Pressured|Surplus|Deficit|Import-Dependent|Deficit — Active Famine)$/.test(l));
  if(ecoFood.length) add('eco-food-chip', `${seed} ${ecoFood.join('/')}`);
  const short=eco.some(l=>/Short: \d/.test(l)); if(short && /Secure|Surplus/.test(x.food.bandOf||'')) add('short-but-secure', seed); if(!short && x.food.bandOf==='Pressured' && x.food.band==='secure') add('pressured-no-short', seed);
  // Via lines and viability and journal brackets
  for(const l of eco) if(/^Via:/.test(l) && /\(\d[\d,]*\s*[-–]\s*\d|\(high magic\)|\(if walled\)|\(multiple\)|households\)/i.test(l)) add('via-bracket', seed+' '+l);
  for(const l of [...(sec['Systems/Outlook']||[]),...(sec['Systems/Viability']||[])]) if(/\(\d[\d,]*\s*[-–]\s*\d[\d,]*\+?\)|\(\d[\d,]*\+?\s*households\)|\([\d,]+\+ only\)|\(high magic\)|\(if walled\)|\(multiple\)/i.test(l)) add('outlook-bracket', seed+' '+l.slice(0,200));
  for(const l of eco) if(/River Toll|Harbour Dues|River traffic|Harbour traffic/.test(l)) add('toll:'+l.match(/River Toll|Harbour Dues|River traffic|Harbour traffic/)[0], `${seed} route=${x.route} terrain=${x.terrain}`);
  
  // vacant seat: the Power tab's keeper line form vs the Tonight role
  if(x.seatVacant && x.keeper){ const p=x.tonight.people.find(p=>p.name===x.keeper.name); const pw=(sec['Systems/Power']||[]).find(l=>/keeps the seat meanwhile/.test(l))||'';
    if(p){ add('keeper-on-sheet', seed); if(!pw.includes(p.role+' '+x.keeper.name)) add('keeper-form-mismatch', `${seed} tonight="${p.role}" power="${pw.slice(0,160)}"`); } }
  // help text
  if(!(sec['Systems/Institutions']||[]).some(l=>l.includes('Each house: what it is'))) add('help-missing', seed);
  const badges=(sec['Systems/Institutions']||[]).filter(l=>/(YOU|WORLD|→)$/.test(l)); if(badges.length) add('badge', seed+' '+badges.slice(0,3).join(' | '));
}
console.log('dumps',n); for(const [k,v] of Object.entries(res)) console.log(k, v.length, '\n   '+v.slice(0,8).join('\n   '));
fs.writeFileSync("dumpcheck.json", JSON.stringify(res));
