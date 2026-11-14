import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src';
const { loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const T = await import(R+'/domain/summary/tonightSheet.js'); const Q = await import(R+'/domain/summary/settlementQuickGuide.js');
const want=process.argv[3]; const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ const {seed,s}=JSON.parse(line); if(seed!==want) continue;
 console.log(JSON.stringify(T.composeTonightSheet(s),null,1).slice(0,5000)); console.log(JSON.stringify(Q.composeSettlementQuickGuide(s),null,1).slice(0,3000)); console.log(Q.cultureScopeLine(s)); break; }
