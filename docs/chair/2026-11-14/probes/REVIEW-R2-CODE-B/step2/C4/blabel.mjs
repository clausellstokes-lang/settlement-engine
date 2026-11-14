import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const want=new Set(fs.readFileSync('B.seeds','utf8').trim().split('\n'));
const D=process.argv[2];
const rl=readline.createInterface({input:fs.createReadStream(process.argv[3]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const tally={}; const rows=[];
for await(const l of rl){ const {seed,s}=JSON.parse(l); if(!want.has(seed)) continue;
  const F=s.powerStructure.factions; const rel=F.filter(f=>f.category==='religious').sort((a,b)=>b.power-a.power)[0]; const gov=F.find(f=>f.isGoverning);
  const page=fs.readFileSync(D+'/'+seed+'.txt','utf8'); const dec=new RegExp('decisions that matter are made by '+rel.faction).test(page);
  const k=`${rel.powerLabel}/${gov?.powerLabel} ${rel.power>gov.power?'rel>gov':'gov>=rel'}${dec?' DECIDES':''}`; tally[k]=(tally[k]||0)+1;
  rows.push({seed,tier:s.tier,stress:[].concat(s.stress||[]).map(x=>x.type).join('+')||'calm',rel:rel.faction+':'+rel.power+':'+rel.powerLabel,gov:gov.faction+':'+gov.power+':'+gov.powerLabel,dec});
}
console.log(Object.entries(tally).sort((a,b)=>b[1]-a[1]).map(([k,v])=>v+'  '+k).join('\n'));
fs.writeFileSync('B2.jsonl',rows.map(x=>JSON.stringify(x)).join('\n')+'\n');
