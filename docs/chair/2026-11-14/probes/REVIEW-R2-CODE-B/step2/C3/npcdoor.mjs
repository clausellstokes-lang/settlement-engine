import fs from 'node:fs'; import zlib from 'node:zlib';
const T=process.env.T; const {institutionHouseLabel}=await import(T+'/src/domain/display/institutionDisplayName.js');
const lines=zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().trim().split('\n');
const re=new RegExp(process.argv[3]);
for(const l of lines){ const {seed,s}=JSON.parse(l); const names=(s.institutions||[]).map(i=>i.name);
  for(const n of s.npcs||[]){ const h=n.institution||n.institutionName||n.affiliation||''; if(re.test(String(h))) console.log(seed,'|',n.name,'|',h,'->',institutionHouseLabel(h),'| inRoster:',names.includes(h),'| faction:',n.factionAffiliation||n.faction||''); } }
