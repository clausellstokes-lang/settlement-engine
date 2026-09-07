import fs from 'node:fs';
const rows=JSON.parse(fs.readFileSync('final-rows.json','utf8'));
const KEY={reader:'reader','dm-only':'dm_only',dev:'dev','ai-prompt':'ai_prompt',ambiguous:'ambiguous'};
const byF=new Map();
for(const r of rows){ if(!byF.has(r.file)) byF.set(r.file,[]); byF.get(r.file).push(r); }
const ents=[...byF.entries()].sort((a,b)=>b[1].length-a[1].length||(a[0]<b[0]?-1:1));
const t=[];
t.push('| # | file | total | reader | dm-only | dev | ai-prompt | ambiguous |');
t.push('|---:|---|---:|---:|---:|---:|---:|---:|');
let i=0;
for(const [f,rs] of ents){ i++;
  const c={reader:0,dm_only:0,dev:0,ai_prompt:0,ambiguous:0};
  for(const r of rs) c[KEY[r.class]]++;
  t.push(`| ${i} | \`${f}\` | ${rs.length} | ${c.reader} | ${c.dm_only} | ${c.dev} | ${c.ai_prompt} | ${c.ambiguous} |`);
}
fs.writeFileSync('table.md', t.join('\n'));
// examples
const ex=[];
for(const [f,rs] of ents){
  const byCls={};
  for(const r of rs){ (byCls[r.class]=byCls[r.class]||[]).push(r); }
  const parts=[];
  for(const cls of ['reader','dm-only','dev','ai-prompt','ambiguous']){
    if(!byCls[cls]) continue;
    const three=byCls[cls].slice(0,3).map(r=>'"'+r.text.replace(/"/g,"'").slice(0,72)+'"');
    parts.push(`  - **${cls}** (${byCls[cls].length}) — ${three.join(' · ')}`);
    const cp=byCls[cls][0].consumerPath, evd=byCls[cls][0].evidence;
    parts.push(`    · consumer: \`${cp}\` (${evd})`);
  }
  ex.push(`- \`${f}\` (n=${rs.length})`);
  ex.push(parts.join('\n'));
}
fs.writeFileSync('examples.md', ex.join('\n'));
console.log('table rows', i, 'examples lines', ex.length);
