// REVIEW-UPKEEP-CAPACITY 8(b): THE MONOTONICITY CLAIMS, refuted or held on births of our own.
//   (1) ENLARGE: each house on a scaled ladder renamed to its next greater rung (same ladder) -> no defence score falls.
//   (2) ADD: each catalogue house that opens a scaled part, written at the place's tier or one tier around, added alone -> no score falls.
// The record is otherwise untouched (defence re-read by generateDefenseProfile at the record's own keep), as the stage's tests do.
// Usage: TREE=<tree> node mono.mjs <record_dir> <seedlist> <out.ndjson>
import fs from 'node:fs'; import zlib from 'node:zlib';
const T=process.env.TREE;
const { generateDefenseProfile } = await import(T+'/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
const { getInstFlags } = await import(T+'/src/generators/priorityHelpers.js');
const { defenseTraditionNamesOf } = await import(T+'/src/domain/institutions/defenseInstitutionBuckets.js');
const { isFabricInstitution, institutionalCatalog } = await import(T+'/src/data/institutionalCatalog.js');
const houseRungsOf = fs.existsSync(T+'/src/domain/institutions/houseScale.js') ? (await import(T+'/src/domain/institutions/houseScale.js')).houseRungsOf : null;
const { UPGRADE_CHAINS } = await import(T+'/src/data/institutionLadders.js');
// SCALED_PARTS of defenseGenerator.js at 9354d792a (lines 79-83), copied, with its housedOf (C4a).
const SCALED_PARTS = {
  garrison: (i) => i.hasGarrison, militia: (i) => i.hasMilitia, watch: (i) => i.hasWatch, court: (i) => i.hasCourtSystem,
  prison: (i) => i.hasPrison, wardens: (_, n) => n.wardens, company: (i) => i.hasMercenary, charter: (i) => i.hasCharterHall,
  clergy: (_, n) => n.divine, druids: (_, n) => n.druid, market: (i) => i.hasMarket, hospital: (i) => i.hasHospital,
  alchemists: (_, n) => n.alchemy };
const jobsOf=(house)=>{ const one=[house]; const {inst}=getInstFlags({},one); const names=defenseTraditionNamesOf(one.filter(i=>!isFabricInstitution(i))); return Object.keys(SCALED_PARTS).filter(id=>SCALED_PARTS[id](inst,names)); };
const TIERS=['thorp','hamlet','village','town','city','metropolis'];
const rowOf={}; for(const t of TIERS) for(const [shelf,rows] of Object.entries(institutionalCatalog[t]||{})) for(const [n,row] of Object.entries(rows||{})) (rowOf[n] ||= {})[t]={...row,category:shelf};
const allNames=Object.keys(rowOf);
const scaled=allNames.filter(n=>jobsOf({name:n}).length);
const greaterOf={}; for(const [l,g] of UPGRADE_CHAINS){ const jl=jobsOf({name:l}), jg=jobsOf({name:g}); if(jl.some(j=>jg.includes(j))) (greaterOf[l.toLowerCase()] ||= []).push(g); }
const SC=['military','monster','internal','economic'];
const scoresOf=(s)=>{ const p=generateDefenseProfile(s,keepOfRecord(s.economicState)); const o={}; for(const k of SC) o[k]=p.scores[k]; o.readiness=p.readiness.score; return o; };
const out=fs.createWriteStream(process.argv[4]); let tried=0, falls=0;
for(const seed of fs.readFileSync(process.argv[3],'utf8').trim().split('\n')){
  const f=`${process.argv[2]}/${seed}.json.gz`; if(!fs.existsSync(f)) continue;
  const s=JSON.parse(zlib.gunzipSync(fs.readFileSync(f)));
  const s0=scoresOf(s);
  const rec=(kind,house,to,s1)=>{ tried++; const d={}; for(const k of Object.keys(s0)) if(s1[k]<s0[k]) d[k]=[s0[k],s1[k]];
    if(Object.keys(d).length){ falls++; out.write(JSON.stringify({seed,tier:s.tier,kind,house,to,jobs:jobsOf({name:to}),falls:d})+'\n'); } };
  // (1) enlarge
  (s.institutions||[]).forEach((h,i)=>{ for(const g of greaterOf[String(h.name).toLowerCase()]||[]){
    const s1={...s,institutions:s.institutions.map((x,j)=>j===i?{...x,name:g}:x)}; rec('enlarge',h.name,g,scoresOf(s1)); } });
  // (2) add, houses written at the tier or a neighbour
  const ti=TIERS.indexOf(s.tier); const near=new Set(TIERS.slice(Math.max(0,ti-1),ti+2));
  const have=new Set((s.institutions||[]).map(h=>String(h.name).toLowerCase()));
  for(const n of scaled){ if(have.has(n.toLowerCase())) continue; const tt=Object.keys(rowOf[n]).find(t=>near.has(t)); if(!tt) continue;
    const row=rowOf[n][tt]; const s1={...s,institutions:[...(s.institutions||[]),{name:n,category:row.category,tags:row.tags||[],baseChance:row.baseChance}]}; rec('add',null,n,scoresOf(s1)); }
}
out.end(); console.log('tried',tried,'falls',falls,'scaled houses',scaled.length);
if(houseRungsOf) console.log(JSON.stringify(Object.fromEntries(Object.entries(houseRungsOf(scaled.map(n=>({name:n})),jobsOf)).map(([j,rs])=>[j,rs.length]))));
