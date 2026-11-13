// A's pressure re-deals: for each town whose pressure line changed row, the base row's needs and the town's houses that bear on them.
import fs from 'node:fs'; import zlib from 'node:zlib';
const read=(f)=>{ const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) if(l){ const o=JSON.parse(l); m.set(o.seed, o.s);} return m; };
const T=process.env.TREE; const B=read(process.argv[2]), A=read(process.argv[3]);
const { factsOf } = await import(T+'/src/domain/facts/factsOf.js');
const { declarationAdmits, declarationOf } = await import(T+'/src/domain/facts/factVocabulary.js');
const rows=JSON.parse(fs.readFileSync(process.argv[4],'utf8')).filter(r=>r.path==='pressureSentence'&&r.r>0.25);
const RULES=[[/healers of .* have stopped arguing|Something is spreading in/,['healer']],[/A cordon has gone up/,['population: > small']],[/whoever holds the keys, the seals, and the granary/,['institution: granary']],[/drawn its edges inward/,['institution: mill']],[/learned the settlement's patterns/,['walls']],[/taking in more people than it can feed/,['starving']],[/religious community has formally split/,['institution: temple']],[/Hunger has made .* quiet/,['market']],[/controls the rationing and the gates/,['gate']],[/counts its mouths/,['walls']],[/two of everything now/,['watch']]];
const houses=(s,re)=>(s.institutions||[]).map(i=>i.name).filter(n=>re.test(n)).join('/');
const HRE={healer:/heal|hospit|physic|apothec|infirm|herb|surgeon|temple|clinic|leech/i,'institution: granary':/granar|storehouse/i,'institution: mill':/mill/i,walls:/wall|palisade|fort/i,'institution: temple':/temple|church|cathedral|worship|shrine|monaster/i,market:/market|fair|bazaar/i,gate:/gate|wall/i};
for(const r of rows){ const s=A.get(r.seed); const rule=RULES.find(([re])=>re.test(r.a)); if(!rule){ console.log('NO RULE', r.seed, r.a.slice(0,60)); continue; }
  const need=rule[1]; const adm=declarationAdmits(declarationOf({text:"x",needs:need}), factsOf(s)); const h=HRE[need[0]]?houses(s,HRE[need[0]]):'';
  console.log(`${r.seed.padEnd(34)} ${s.tier.padEnd(10)} needs ${need} admitted=${adm.admitted} | houses: ${h.slice(0,90)}`); }
