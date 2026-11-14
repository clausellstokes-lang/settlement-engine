// journal.mjs <births.gz> <out.jsonl>: the Foundry journal (canon_dossier) per town, the family's printed lines extracted.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src';
const { loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { buildViewModel } = await import(R+'/pdf/lib/viewModel.js');
const { buildJournalPages } = await import(R+'/foundry/journalPages.js');
const out=fs.createWriteStream(process.argv[3]); let n=0, err=0;
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ const {seed,s}=JSON.parse(line);
  try{ const vm=buildViewModel({settlement:s}); const pages=buildJournalPages(vm,{variant:'canon_dossier',settlement:s});
    out.write(JSON.stringify({seed,pages:pages.map(p=>({name:p.name,md:p.markdown}))})+'\n'); n++; }
  catch(e){ err++; if(err<4) console.error(seed,e.message); } }
out.end(); console.log('ok',n,'err',err);
