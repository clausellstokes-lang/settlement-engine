import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/';
const B=await import(T+'domain/density/densityCreateBoundary.js'); if (B.loadGenerationLawPayloads) await B.loadGenerationLawPayloads();
const G=await import(T+'domain/traditions/genesis.js'); const {TRADITION_ELEMENTS}=await import(T+'data/traditionCorpus.js');
const {filterDeclared}=await import(T+'domain/facts/drawDeclared.js'); const {factsOf}=await import(T+'domain/facts/factsOf.js');
const {hasInstitution}=await import(T+'domain/facts/institutions.js').catch(()=>({}));
const NEEDS=new Map(TRADITION_ELEMENTS.filter(e=>e.needs?.length).map(e=>[e.id,e.needs]));
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
let mirror=0; const t={}; const out=fs.createWriteStream('trad.tsv');
for await (const line of rl){ const {seed,s}=JSON.parse(line);
 if (Array.isArray(s.traditions)&&s.traditions.length) mirror++;
 const kept=G.deriveFoundingTraditions(s);
 const shown=filterDeclared(kept.map(rec=>({text:String(rec?.name??''),needs:NEEDS.get(rec?.coreMotif?.element)||[],rec})),{facts:()=>factsOf(s),poolId:'traditions:tab',surface:'traditions',drawKind:'A'}).map(r=>r.rec);
 const smith=(s.institutions||[]).filter(i=>/smith|forge/i.test(i.name)).map(i=>i.name);
 const market=(s.institutions||[]).filter(i=>/market|fair/i.test(i.name)).map(i=>i.name);
 for (const r of kept){ const el=r.coreMotif?.element; if(el!=='forge'&&el!=='market')continue; const sh=shown.includes(r);
  const k=`${el} shown=${sh} has=${el==='forge'?smith.length>0:market.length>0}`; (t[k]=t[k]||[]).push(seed);
  out.write([seed,s.tier,el,sh,r.name,JSON.stringify(el==='forge'?smith:market)].join('\t')+'\n'); }
}
out.end(); console.log('mirror',mirror); for(const [k,v] of Object.entries(t)) console.log(v.length,k,v.slice(0,4).join(' '));
