import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/';
const F=await import(T+'domain/dossier/faithReading.js');
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const out=fs.createWriteStream('faith.tsv');
const tally=new Map();
for await (const line of rl){ const {seed,s}=JSON.parse(line);
 const r=F.faithReadingOf(s,{deity: s.config?.primaryDeitySnapshot||null});
 const lines=F.faithLinesOf(r,{tierNoun:s.tier});
 const st=(Array.isArray(s.stress)?s.stress:[s.stress]).filter(Boolean).map(x=>x.type).join('+');
 const facs=(s.powerStructure?.factions||[]).map(f=>`${f.faction||f.name}:${f.category}:${f.power}:${f.isGoverning?'G':''}`).join(';');
 for (const l of lines){ const key=l.replace(/^.*? has no church/,'X has no church').replace(/ the (thorp|hamlet|village|town|city|metropolis)/g,' the T').replace(/rests with the .*$/,'rests with the F.').replace(/belongs to the .*$/,'belongs to the F.').replace(/^.*, the .*?, (leads|lives)/,'N, the R, $1').replace(/is governed by the .*/,'is governed by the F.');
  const e=tally.get(key)||[]; e.push(seed); tally.set(key,e); }
 out.write([seed,s.tier,s.population,st,r.shrine,r.accessOnly,r.roadBarred,r.hasChurch,JSON.stringify(r.religiousFaction),facs,lines.join(' | ')].join('\t')+'\n');
}
out.end();
for (const [k,v] of [...tally].sort((a,b)=>b[1].length-a[1].length)) console.log(v.length+'\t'+k+'\t'+v.slice(0,2).join(' '));
