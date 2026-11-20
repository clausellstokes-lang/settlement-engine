// UPKEEP-9 step 2(b), MEASURE ONLY: the defence profile's two homes for arcane defence, over a census corpus.
// usage: TREE=<tree> node arcane2.mjs <corpus.ndjson.gz> [dumps-dir]
import fs from 'node:fs'; import zlib from 'node:zlib';
const T=process.env.TREE;
const { defenseTraditionNamesOf } = await import(T+'/src/domain/institutions/defenseInstitutionBuckets.js');
const rows=zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().split('\n').filter(Boolean).map(l=>JSON.parse(l));
const D=process.argv[3]; const C={}; const ex={}; const inc=(k,s)=>{C[k]=(C[k]||0)+1;(ex[k]??=[]);if(ex[k].length<5)ex[k].push(s);};
for(const {seed,s} of rows){ const dp=s.defenseProfile||{}; const md=dp.institutions?.magicDef||[]; const ha=dp.traditions?.hasArcane;
  if(!md.length) continue; inc('magicDef.nonEmpty',seed);
  if(ha===true) { inc('agree',seed); continue; }
  inc('disagree',seed);
  const pri=s.config?.priorityMagic??50; const on=s.config?.magicExists!==false; const names=defenseTraditionNamesOf(s.institutions||[]);
  inc(`disagree.why:magicOn=${on},dial>=35=${pri>=35},arcaneNames=${names.arcane}`,seed);
  inc('disagree.houses:'+md.map(x=>x.name).join('+'),seed);
  if(D){ const dump=fs.readFileSync(`${D}/${seed}.txt`,'utf8'); if(/Military role\W*absent/i.test(dump)) inc('disagree.page:Military role absent',seed); if(/Arcane defen[cs]e/i.test(dump)) inc('disagree.page:Arcane defense group',seed);} }
for(const [k,v] of Object.entries(C).sort()) console.log(v,k,'|',ex[k].slice(0,3).join(' '));
