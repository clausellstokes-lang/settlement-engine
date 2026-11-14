// faith.mjs <tree> <births.gz> [seedRegex] : the Faith tab's line (faithPanelModel.line) per town, plus record facts
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [tree,f,want,outf]=process.argv.slice(2);
const { faithPanelModel } = await import(tree+'/src/components/settlement/faithPanelModel.js');
const { faithReadingOf } = await import(tree+'/src/domain/dossier/faithReading.js');
const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const out=[];
for await(const l of rl){ const {seed,s}=JSON.parse(l); if(want && !new RegExp(want).test(seed)) continue;
  const m=faithPanelModel(s); const rd=m.reading||faithReadingOf(s);
  const acc=(s.institutions||[]).filter(i=>/^access to/i.test(i.name||'')).map(i=>i.name);
  const ps=s.powerStructure||{}; const facs=(ps.factions||[]).map(x=>({n:x.faction,p:x.power,g:!!x.isGoverning,c:x.category}));
  out.push({seed,tier:s.tier,stress:[].concat(s.stress||[]).map(x=>x.type).join("+"),line:(m.line||[]).join(' '),acc,shrine:rd.shrine,hasChurch:rd.hasChurch,rf:rd.religiousFaction,gov:ps.governingName||null,facs});
}
if(outf) fs.writeFileSync(outf,out.map(x=>JSON.stringify(x)).join('\n')+'\n'); else for(const x of out) console.log(JSON.stringify(x));
