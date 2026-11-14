import fs from 'node:fs'; import zlib from 'node:zlib';
const T=process.env.T; const {chainHousesOf}=await import(T+'/src/domain/display/chainHouses.js');
const {institutionHouseLabel}=await import(T+'/src/domain/display/institutionDisplayName.js');
const lines=zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().trim().split('\n');
const want=process.argv[3]? new RegExp(process.argv[3]):null;
for(const l of lines){ const {seed,s}=JSON.parse(l); if(want && !want.test(seed)) continue;
  const names=(s.institutions||[]).map(i=>i.name);
  const chains=(s.economicState?.activeChains)||[];
  for(const c of chains){ const pi=c.processingInstitutions||[]; if(!pi.some(p=>/\(/.test(p))) continue;
    console.log(seed,'|',c.chainId||c.id||c.name,'|',JSON.stringify(pi),'->',chainHousesOf(pi,names).map(h=>h.name).join(' · '),'| roster:',names.filter(n=>pi.some(p=>n.toLowerCase().startsWith(p.toLowerCase().slice(0,8)))).join('; '));}
}
