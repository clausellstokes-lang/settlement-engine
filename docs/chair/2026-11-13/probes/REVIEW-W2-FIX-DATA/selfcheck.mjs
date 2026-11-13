// REVIEW-W2-FIX-DATA self-check: every printed institution description and service line that carries a declaration
// (DESC_VARIANT_DECLARATIONS, DESC_VARIANT_SIBLINGS originals and twins, SERVICE_DESC_SIBLINGS) is re-read against the
// FINAL record's facts (factsOf). A line the final record refuses is counted (towns, by text).
//   TREE=<tree> CORPUS=<corpus.ndjson.gz> node selfcheck.mjs [--only-lane] > out.json
import fs from 'node:fs'; import zlib from 'node:zlib';
const T=process.env.TREE;
const { DESC_VARIANT_DECLARATIONS, DESC_VARIANT_SIBLINGS } = await import(T+'/src/data/institutionDescVariants.js');
const { SERVICE_DESC_SIBLINGS } = await import(T+'/src/data/institutionServices.js');
const { factsOf } = await import(T+'/src/domain/facts/factsOf.js');
const { filterDeclared } = await import(T+'/src/domain/facts/drawDeclared.js');
const decl=new Map();
const add=(text,d,src)=>{ if(!d) return; const cur=decl.get(text)||{needs:[],excludes:[],crisis:[],src}; for(const f of ['needs','excludes','crisis']) for(const a of d[f]||[]) if(!cur[f].includes(a)) cur[f].push(a); decl.set(text,cur); };
for(const [t,d] of Object.entries(DESC_VARIANT_DECLARATIONS)) add(t,d,'DESC_DECL');
for(const set of Object.values(DESC_VARIANT_SIBLINGS)) for(const l of set) add(l.text,l,l.twinOf?'DESC_TWIN':'DESC_SIB');
for(const set of Object.values(SERVICE_DESC_SIBLINGS)) for(const l of set) add(l.text,l,l.twinOf?'SVC_TWIN':'SVC_SIB');
const lines=zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n');
const bad={}; let checked=0;
for(const L of lines){ const {seed,s}=JSON.parse(L); const f=factsOf(s);
  const items=[...s.institutions.map(i=>({where:'inst:'+i.name,text:i.desc})), ...Object.values(s.availableServices||{}).flat().map(v=>({where:'svc:'+(v.name||v.service),text:v.desc}))];
  for(const it of items){ const d=decl.get(it.text); if(!d) continue; checked++;
    const ok=filterDeclared([{text:it.text,needs:d.needs,excludes:d.excludes,crisis:d.crisis}],{facts:f,crisisScoped:d.crisis.length>0}).length===1;
    if(!ok){ const k=it.text; (bad[k]=bad[k]||{decl:d,where:it.where,towns:[]}).towns.push(seed); } } }
const rows=Object.entries(bad).map(([t,v])=>({text:t,src:v.decl.src,needs:v.decl.needs,excludes:v.decl.excludes,crisis:v.decl.crisis,where:v.where,n:v.towns.length,towns:v.towns.slice(0,6)})).sort((a,b)=>b.n-a.n);
console.log(JSON.stringify({checked,refusedPrinted:rows.reduce((a,r)=>a+r.n,0),rows},null,1));
