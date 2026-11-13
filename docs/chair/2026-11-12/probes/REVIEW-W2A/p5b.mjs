import fs from 'node:fs'; import zlib from 'node:zlib';
const S=process.env.S; const corpus=zlib.gunzipSync(fs.readFileSync(S+'/census-tip/corpus.ndjson.gz')).toString().trim().split('\n').map(l=>JSON.parse(l));
for(const {seed,s} of corpus){ const b=fs.readFileSync(`${S}/census-base/dumps/${seed}.txt`,'utf8'), t=fs.readFileSync(`${S}/census-tip/dumps/${seed}.txt`,'utf8');
 const sb=(b.match(/Criminal structure: [A-Za-z -]+/)||[''])[0], st=(t.match(/Criminal structure: [A-Za-z -]+/)||[''])[0]; if(sb===st) continue;
 const hall=(t.split('\n')[t.split('\n').indexOf('The hall')+1]||'').slice(0,60);
 const cf=(s.powerStructure?.factions||[]).filter(f=>f.category==='criminal').map(f=>`${f.faction}(${Math.round(f.power)}${f.isGoverning?',GOV':''})`).join('; ');
 console.log(seed.padEnd(34), s.powerStructure?.criminalCaptureState?.padEnd?.(11), sb.replace('Criminal structure: ',''),'→',st.replace('Criminal structure: ',''),'| crim factions:',cf,'| hall:',hall);
}
