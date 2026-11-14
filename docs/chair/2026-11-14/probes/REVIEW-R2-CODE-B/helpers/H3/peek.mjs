import zlib from 'zlib'; import fs from 'fs'; import readline from 'readline';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const want=process.argv[2];
const rl = readline.createInterface({ input: fs.createReadStream(S+'/out/births-tip.ndjson.gz').pipe(zlib.createGunzip()) });
for await (const line of rl) { const {seed,s}=JSON.parse(line); if (seed!==want) continue;
 const c=s.economicState.activeChains; console.log(Object.keys(s).join(' ')); console.log(JSON.stringify(c[0],null,0).slice(0,1500));
 console.log('chain keys', [...new Set(c.flatMap(x=>Object.keys(x)))].join(' '));
 console.log('resources keys', Object.keys(s.resources||{}).join(' ')); console.log(JSON.stringify(s.resources||s.resourceAnalysis||{}).slice(0,1500)); break; }
