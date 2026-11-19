// UPKEEP-9 step 2(a): the culture's foodways line printed where its own declaration is false.
// usage: TREE=<tree> node foodways.mjs <corpus.gz>
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T=process.env.TREE;
const { factsOf } = await import(T+'/src/domain/facts/factsOf.js');
const { CULTURE_PROFILES } = await import(T+'/src/data/cultureProfiles.js');
const { declarationAdmits } = await import(T+'/src/domain/facts/factVocabulary.js');
const declared=[]; for(const [k,p] of Object.entries(CULTURE_PROFILES)) for(const l of p.foodways||[]) if(l&&typeof l==='object') declared.push({k,...l});
const C={},ex={}; const inc=(k,s)=>{C[k]=(C[k]||0)+1;(ex[k]??=[]); if(ex[k].length<6) ex[k].push(s);};
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ if(!line) continue; const {seed,s}=JSON.parse(line);
  const fw=String(s.economicState?.foodSecurity?.foodRecord?.foodwaysLine||'');
  for(const d of declared) if(fw.includes(d.text)){ const ok=declarationAdmits({needs:d.needs||[],excludes:d.excludes||[],crisis:d.crisis||[]}, factsOf(s)).admitted;
    inc(`${d.k}:${d.needs}:${ok?'true':'FALSE'}:${s.tier}`, seed); } }
for(const [k,v] of Object.entries(C).sort()) console.log(v,k,'|',ex[k].slice(0,4).join(' '));
