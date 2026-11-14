import zlib from 'zlib'; import fs from 'fs'; import readline from 'readline';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const { institutionHouseLabel } = await import(S+'/tip/src/domain/display/institutionDisplayName.js');
const rl = readline.createInterface({ input: fs.createReadStream(S+'/out/births-tip.ndjson.gz').pipe(zlib.createGunzip()) });
const m = new Map();
for await (const line of rl) { const {seed,s}=JSON.parse(line); for (const i of s.institutions||[]) { const n=i.name; if (!/\(/.test(n)) continue; const l=institutionHouseLabel(n); const k=n+' => '+l; m.set(k,(m.get(k)||0)+1);} }
for (const [k,v] of [...m].sort()) console.log(v+'\t'+k);
