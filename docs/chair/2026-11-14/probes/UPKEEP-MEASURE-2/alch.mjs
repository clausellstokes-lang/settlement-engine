// THE OWNER'S EXAMPLE: in every birth holding an Alchemist shop or an Alchemist quarter, that house written as the shop and
// as the quarter in its own record (all else untouched), read at the tree: does the quarter read above the shop?
//   TREE=<tree> node alch.mjs <recdir> <seeds>   -> counts (readiness higher / equal / lower; any score lower; size shows nowhere)
import fs from 'node:fs'; import zlib from 'node:zlib'; const T=process.env.TREE;
const { generateDefenseProfile } = await import(T+'/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
const SC=['military','monster','internal','economic','magical'];
const [dir, sf]=process.argv.slice(2); const c={holders:0,rUp:0,rEq:0,rDown:0,anyScoreLower:0,anyRatingShows:0,nowhere:0}; const lowerBy={}; const ex=[];
for (const seed of fs.readFileSync(sf,'utf8').trim().split('\n')) { const f=`${dir}/${seed}.json.gz`; if(!fs.existsSync(f)) continue;
  const s=JSON.parse(zlib.gunzipSync(fs.readFileSync(f))); const i=(s.institutions||[]).findIndex(h=>/^alchemist (shop|quarter)$/i.test(h.name)); if(i<0) continue;
  c.holders++; const as=(n)=>{ const x={...s,institutions:s.institutions.map((h,j)=>j===i?{...h,name:n}:h)}; const p=generateDefenseProfile(x,keepOfRecord(s.economicState)); return {...Object.fromEntries(SC.map(k=>[k,p.scores[k]])),R:p.readiness.score}; };
  const A=as('Alchemist shop'), B=as('Alchemist quarter');
  if(B.R>A.R) c.rUp++; else if(B.R===A.R) c.rEq++; else c.rDown++;
  const low=SC.filter(k=>B[k]<A[k]); if(low.length){ c.anyScoreLower++; for(const k of low) lowerBy[k]=(lowerBy[k]||0)+1; if(ex.length<3) ex.push(`${seed} ${low.map(k=>k+' '+A[k]+'>'+B[k]).join(', ')}`); }
  if(B.R>A.R || SC.some(k=>B[k]>A[k])) c.anyRatingShows++; else c.nowhere++; }
console.log(JSON.stringify(c), 'lowerBy', JSON.stringify(lowerBy), ex.join(' | '));
