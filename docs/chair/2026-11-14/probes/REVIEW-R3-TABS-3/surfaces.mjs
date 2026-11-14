// surfaces.mjs TREE IN SEEDS: the force names on the PDF view model and the Foundry journal's Defense page (bracketed names, provenance tags)
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src';
const { buildViewModel } = await import(R+'/pdf/lib/viewModel.js');
const { buildJournalPages } = await import(R+'/foundry/journalPages.js');
const { loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const want=new Set(fs.readFileSync(process.env.SEEDS,'utf8').trim().split('\n'));
const rl=readline.createInterface({input:fs.createReadStream(process.env.IN).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); if(!want.has(seed)) continue;
  try{ const vm=buildViewModel({settlement:s}); const af=vm.defense?.armedForces||{}; const names=Object.values(af).flat().map(f=>f.name);
    const pages=buildJournalPages(vm,{settlement:s}); const txt=JSON.stringify(pages);
    const dpage=(Array.isArray(pages)?pages:Object.values(pages)).find(p=>/Armed forces/.test(JSON.stringify(p)));
    const lines=(dpage? JSON.stringify(dpage):'').split('\\n').filter(x=>/^- /.test(x)&&/\(/.test(x));
    console.log(seed,'| PDF force names with a bracket:',names.filter(n=>/\(/.test(n)).join(', '),'| journal lines:',lines.slice(0,3).join(' || '));
  }catch(e){ console.log(seed,'ERR',e.message); } }
