import zlib from 'zlib'; import fs from 'fs'; import readline from 'readline';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const want=new Set(fs.readFileSync(process.argv[2],'utf8').trim().split('\n')); const F=new Function('s',`return (${process.argv[3]});`);
const rl = readline.createInterface({ input: fs.createReadStream(S+'/out/births-tip.ndjson.gz').pipe(zlib.createGunzip()) });
const t=new Map(); for await (const line of rl){const {seed,s}=JSON.parse(line); if(!want.has(seed)) continue; const k=String(F(s)); t.set(k,(t.get(k)||[]).concat(seed));}
for (const [k,v] of t) console.log(v.length,k,v.slice(0,3).join(' '));
