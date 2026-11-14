// ROUND-3-CUT increment: place each classified line on its town's page at a tree, by the reader's matcher
// (merge-cold.mjs rule). node inc-place.mjs <classified.json> <list> <dumps dir> <key>
import fs from 'node:fs';
const [cf,list,D,key]=process.argv.slice(2); const R=JSON.parse(fs.readFileSync(cf,'utf8'));
const norm=(s)=>String(s).replace(/\s+/g,' ').trim(); const pages={};
const page=(seed)=>pages[seed]??=(fs.existsSync(`${D}/${seed}.txt`)?fs.readFileSync(`${D}/${seed}.txt`,'utf8').split('\n').filter(l=>l&&!l.startsWith('== ')&&!l.startsWith('[STYLE]')).map(norm):null);
for(const r of R){ if(r.list!==list) continue; const p=page(r.town); if(!p){ (r.at||={})[key]='no page'; continue; } const s=norm(r.sentence); let q='';
  if(s.length>12){ if(p.some(l=>l.includes(s))) q='exact'; else if(p.some(l=>l.includes(s.slice(0,60)))) q='head'; } else if(p.some(l=>l===s||l.startsWith(s+' ')||l.endsWith(' '+s))) q='short-line';
  (r.at||={})[key]=q; }
fs.writeFileSync(cf,JSON.stringify(R,null,1));
const x=R.filter(r=>r.list===list); const t=(f)=>['HIGH','MED'].map(s=>x.filter(r=>r.severity===s&&f(r)).length).join(' / ');
console.log(list,key,'prints',t(r=>r.at[key]&&r.at[key]!=='no page'),'gone',t(r=>!r.at[key]),'| NEW printing',t(r=>r.class==='NEW'&&r.at[key]&&r.at[key]!=='no page'));
