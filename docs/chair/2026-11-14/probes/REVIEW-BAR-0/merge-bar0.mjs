// REVIEW-BAR-0: merge-cold.mjs for ONE version: merge the readers' files into one list (reader order, numbered) and
// place each sentence on its town's page at the joined tree by the reader's matcher (>12 chars: substring of a page
// line; else whole-line/edge; fallback the first 60 chars), also checking it prints under the tab it names.
// node merge-bar0.mjs <cold dir> <dumps dir> <out.json>
import fs from 'node:fs';
const [dir,D,out]=process.argv.slice(2); const norm=(s)=>String(s).replace(/\s+/g,' ').trim(); const pages={};
const page=(seed)=>pages[seed]??=(()=>{ const v=[]; let tab=''; for(const l of fs.readFileSync(`${D}/${seed}.txt`,'utf8').split('\n')){ const m=l.match(/^== (.*) ==/); if(m){tab=m[1];continue;} if(l&&!l.startsWith('[STYLE]')) v.push([tab,norm(l)]); } return v; })();
const rows=[]; for(const f of fs.readdirSync(dir).filter(f=>/^reader-\d+\.json$/.test(f)).sort((a,b)=>parseInt(a.slice(7))-parseInt(b.slice(7))))
  for(const r of JSON.parse(fs.readFileSync(`${dir}/${f}`,'utf8'))) rows.push({reader:f.replace(/\.json$/,''),...r});
let n=0; const res=rows.map(r=>{ const p=page(r.town), s=norm(r.sentence); const hit=(l)=>s.length>12?l.includes(s):(l===s||l.startsWith(s+' ')||l.endsWith(' '+s));
  let q=p.some(([,l])=>hit(l))?'exact':''; if(!q&&s.length>12&&p.some(([,l])=>l.includes(s.slice(0,60)))) q='head';
  const tabOk=p.some(([t,l])=>t===r.tab&&(hit(l)||(s.length>12&&l.includes(s.slice(0,60)))));
  return {n:++n,...r,at:q,tabOk}; });
fs.writeFileSync(out,JSON.stringify(res,null,1));
const S=['HIGH','MED','LOW']; console.log('rows',res.length,'unplaced',res.filter(r=>!r.at).length,'tab mismatch',res.filter(r=>r.at&&!r.tabOk).length);
for(const t of [...new Set(res.map(r=>r.town))].sort()) console.log(t.padEnd(36),S.map(s=>s[0]+' '+res.filter(r=>r.town===t&&r.severity===s).length).join(' '));
console.log('ALL'.padEnd(36),S.map(s=>s[0]+' '+res.filter(r=>r.severity===s).length).join(' '));
