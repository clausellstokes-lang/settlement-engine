// REVIEW-W2-FIX-DATA-2: one pass over a birth corpus (ndjson.gz of {seed, s}); prints the measures of the review's
// step 2 as JSON. node corpus.mjs <corpus.ndjson.gz> [label]
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const file=process.argv[2];
const rl=readline.createInterface({input:fs.createReadStream(file).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const types=(s)=>{const st=s.stress; return Array.isArray(st)?st.map(x=>x?.type).filter(Boolean):st?.type?[st.type]:[];};
const M={towns:0, crisis:{}, tensionDup:[], customs:{cascade:0,cascadePortWord:0,cascadePortWordNoDocks:0,examples:[]}, forge:{}, precinct:{}, plaza:{}, crafts:{withMarket:0,noMarket:[]}, grove:{}, auction:0, mineSvc:{}, smallPlace:{}};
const inc=(o,k)=>{o[k]=(o[k]||0)+1;};
const FAM_O=/prevents famine|hold off famine/, FAM_T=/This year it has not been enough|The famine is drawing them down/;
const SIE_O=/Carts go out at dusk|carts that go out at dusk/, SIE_T=/with the roads cut it now holds|Since the siege closed the roads/;
for await (const line of rl){ if(!line) continue; const {seed,s}=JSON.parse(line); M.towns++;
  const T=types(s); const tier=s.tier; const forced=seed.startsWith('r2s-')?seed.split('-')[1]:(seed.match(/-(famine|under_siege|occupied|plague_onset|wartime|mass_migration|insurgency|indebted)-/)||[])[1]||null;
  const insts=s.institutions||[]; const names=insts.map(i=>i.name);
  for(const i of insts){ const d=i.desc||'';
    for(const [k,O,Tw,c] of [['famine',FAM_O,FAM_T,'famine'],['siege',SIE_O,SIE_T,'under_siege']]){
      const has=T.includes(c); const src=forced===c?'forced':(has?'chance':'none');
      if(O.test(d)) inc(M.crisis,`${k}:original:${has?'FALSE':'true'}:${src}`);
      if(Tw.test(d)) inc(M.crisis,`${k}:twin:${has?'true':'FALSE'}:${src}`);
    }
    if(/customs/i.test(i.name) && i.source==='cascade'){ M.customs.cascade++; if(/port|harbou?r|quay|ship/i.test(d)){ M.customs.cascadePortWord++; if(!names.some(n=>/dock|harbou?r|port|wharf|quay/i.test(n))){ M.customs.cascadePortWordNoDocks++; if(M.customs.examples.length<4) M.customs.examples.push(seed+': '+d.slice(0,90)); } } }
    if(/Elder Grove/.test(i.name)){ inc(M.grove,`${tier}:${/the city\b/.test(d)?'city':/the town\b/.test(d)?'town':/the metropolis\b/.test(d)?'metropolis':/settlement around it/.test(d)?'settlement':'other'}`); }
    if(/now and then persons/.test(d)) M.auction++;
  }
  const tens=(s.history?.currentTensions||[]).map(t=>t.type); if(new Set(tens).size!==tens.length) M.tensionDup.push(seed);
  const a=typeof s.arrivalScene==='string'?s.arrivalScene:JSON.stringify(s.arrivalScene||'');
  const smiths=names.filter(n=>/smith|forge/i.test(n)).join('+')||'none';
  if(/lives by its forges|ring of the anvils never|Racks of new ironwork|plainly lives by its forges/.test(a)) inc(M.forge,`${tier}|${smiths}`);
  if(/ceremonial precinct overlooks/.test(a+JSON.stringify(s.culturalIdentity||{}))) inc(M.precinct,tier);
  if(/swept open yard/.test(a+JSON.stringify(s.culturalIdentity||{}))) inc(M.plaza,tier);
  if(/Craftspeople sit in rows/.test(a)){ if(names.some(n=>/market|bazaar|fair\b/i.test(n))) M.crafts.withMarket++; else M.crafts.noMarket.push(seed+'|'+tier); }
  for(const [cat,list] of Object.entries(s.availableServices||{})) for(const sv of list||[]){ if(/Surface-level ore extraction/.test(sv.desc||'')) inc(M.mineSvc,`surface:${tier}`); if(/Ore cut underground/.test(sv.desc||'')) inc(M.mineSvc,`underground:${tier}`); }
  const h=JSON.stringify(s.history||{}); for(const w of ['the houses nearest the shore','the houses nearest the river','the low ground','the houses','the edge of the fields','the yards behind the houses',"the merchants' quarter",'the residential district','the waterfront','the temple district','harbour districts','riverside quarter','lower districts']) if(h.includes(w)) inc(M.smallPlace,`${w}|${['thorp','hamlet','village'].includes(tier)?'small':'large'}`);
}
M.tensionDupCount=M.tensionDup.length; M.tensionDup=M.tensionDup.slice(0,40);
console.log(JSON.stringify(M,null,1));
