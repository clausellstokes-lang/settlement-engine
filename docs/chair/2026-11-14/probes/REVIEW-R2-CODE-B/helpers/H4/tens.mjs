import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/';
const L=await import(T+'domain/display/institutionDisplayName.js');
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
let towns=0,changed=0,tot=0; const out=fs.createWriteStream('tens.tsv'); const swaps={};
for await (const line of rl){ const {seed,s}=JSON.parse(line); const h=s.history||{}; const ts=h.currentTensions||h.tensions||[]; if(!ts.length) continue; towns++;
 for(const t of ts){ const d=typeof t==='string'?t:t?.description; if(typeof d!=='string') continue; tot++; const n=L.houseLabelsInText(d,s.institutions||[]); if(n!==d){ changed++; out.write([seed,s.tier,d,n].join('\t')+'\n'); } } }
out.end(); console.log({towns,tot,changed});
