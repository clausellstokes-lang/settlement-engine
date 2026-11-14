import zlib from 'zlib'; import fs from 'fs'; import readline from 'readline';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const [want, expr] = process.argv.slice(2); const F=new Function('s',`return (${expr});`);
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[4]||S+'/out/births-tip.ndjson.gz').pipe(zlib.createGunzip()) });
for await (const line of rl) { const {seed,s}=JSON.parse(line); if (seed!==want) continue; const r=F(s); console.log(typeof r==='string'?r:JSON.stringify(r,null,1)); break; }
