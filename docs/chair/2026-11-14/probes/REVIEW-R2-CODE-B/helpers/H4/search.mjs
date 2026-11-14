import fs from 'node:fs'; import zlib from 'node:zlib';
const T='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/';
const B=await import(T+'domain/density/densityCreateBoundary.js'); if (B.loadGenerationLawPayloads) await B.loadGenerationLawPayloads();
const S=await import(T+'domain/dossier/dossierSearch.js');
const want=new Map(fs.readFileSync('hidden.tsv','utf8').trim().split('\n').map(l=>l.split('\t')));
const lines=zlib.gunzipSync(fs.readFileSync('../../out/births-tip.ndjson.gz')).toString().split('\n').filter(Boolean);
let n=0,hit=0;
for(const l of lines){const {seed,s}=JSON.parse(l); if(!want.has(seed))continue; n++;
 const name=want.get(seed); const r=S.searchDossier(s, name.split(' ').slice(-2,-1)[0]);
 const arr=Array.isArray(r)?r:(r.results||r.hits||Object.values(r).flat());
 const f=JSON.stringify(arr).includes(name); if(f){hit++; if(hit<4)console.log(seed,name);} }
console.log('towns',n,'search returns hidden tradition',hit);
