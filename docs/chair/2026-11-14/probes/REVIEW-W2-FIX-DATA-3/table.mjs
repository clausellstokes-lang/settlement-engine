// Builds the LINES-READ table: every catalogue line, where it prints, the towns read, the verdict.
import fs from 'node:fs';
import L from './lines.mjs';
const rd=(f)=>fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8')):{};
const J=rd('/tmp/claude-0/runs/judge-tip.json'), S0=rd('/tmp/claude-0/runs/judge-surf-tip.json'), S1=rd('/tmp/claude-0/runs/judge-surf-rv3.json'), S=Object.fromEntries(Object.keys(S0).map(k=>[k,{towns:[...(S0[k]?.towns||[]),...(S1[k]?.towns||[])],fails:[...(S0[k]?.fails||[]),...(S1[k]?.fails||[])]}])), X=rd('/tmp/claude-0/runs/judge-rv3-tip.json'), BJ=rd('/tmp/claude-0/runs/judge-base.json');
const V=[1,2,3,4].flatMap(n=>{const f=`/tmp/claude-0/runs/readers/verdict-${n}.json`;return fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8')):[];});
const NOTES=JSON.parse(fs.readFileSync('/tmp/claude-0/probes/mine/notes.json','utf8'));
const cond=(c)=>[...(c.needs||[]).map(a=>a),...(c.excludes||[]).map(a=>'no '+a),...((c.crisis||[]).length?['crisis: '+c.crisis.join('/')]:[])].join(', ')||'—';
const rows=['| id | line (file · where) | declared | prints: 720 tabs (base) · 233 all-surfaces (towns per surface) · 384 extra tabs | read (towns) | verdict |','|---|---|---|---|---|---|'];
for(const l of L){ const j=J[l.id]||{towns:[],fails:[]}, s=S[l.id]||{towns:[],fails:[]}, x=X[l.id]||{towns:[],fails:[]}, b=BJ[l.id]||{towns:[]};
  const surf={}; for(const t of s.towns) for(const v of t.views) surf[v]=(surf[v]||0)+1;
  const vs=V.filter(v=>v.id===l.id); const tr=vs.filter(v=>v.verdict==='TRUE').length, fa=vs.filter(v=>v.verdict==='FALSE'), du=vs.filter(v=>v.verdict==='DOUBTFUL').length;
  const scripted=`scripted: ${j.towns.length+x.towns.length} towns, ${j.fails.length+x.fails.length} break the declaration`;
  const readers=vs.length?`read: ${vs.length} (${tr} T / ${fa.length} F / ${du} D)`:'';
  const towns=[...new Set(vs.map(v=>v.seed))].slice(0,5).join(', ');
  const note=NOTES[l.id]||'';
  const verdict=note || (j.towns.length+x.towns.length+s.towns.length===0?`NEVER PRINTS (720 + 384 dossiers, 233 all-surface renders)`:(fa.length?'FALSE in '+fa.map(f=>f.seed).join(', '):'TRUE in every town read'));
  rows.push(`| ${l.id} | \`${l.re.source.slice(0,90).replace(/\|/g,'¦')}\` · ${l.file.replace('src/data/','')} · ${l.fn.replace(/\|/g,'/')} · ${l.kind} | ${cond(l.cond).replace(/\|/g,'/')} | ${j.towns.length} (${b.towns.length}) · ${Object.entries(surf).map(([k,v])=>k+' '+v).join(', ')||'0'} · ${x.towns.length} | ${[readers,scripted].filter(Boolean).join('; ')}${towns?'; '+towns:''} | ${verdict.replace(/\|/g,'/')} |`); }
fs.writeFileSync(process.env.OUT, rows.join('\n')+'\n'); console.log(rows.length-2);
