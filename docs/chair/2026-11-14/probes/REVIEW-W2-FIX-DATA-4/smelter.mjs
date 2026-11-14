// REVIEW-W2-FIX-DATA-4 step 1: every Smelter in the births, its printed description, and the record's facts against it.
// TREE=<tree> SEEDS=<file> OUT=<ndjson> node smelter.mjs
import fs from 'node:fs';
const TREE=process.env.TREE; process.chdir(TREE);
const { boot } = await import(new URL('./born.mjs', import.meta.url).href);
const born = await boot(TREE);
const { hasInstitution, liveInstitutionNames, INSTITUTION_KIND_PATTERNS } = await import(TREE+'/src/domain/facts/institutions.js');
const out=[];
for (const seed of fs.readFileSync(process.env.SEEDS,'utf8').trim().split('\n')) {
  const s=born(seed); const sm=(s.institutions||[]).find(i=>i.name==='Smelter'); if(!sm) continue;
  const names=liveInstitutionNames(s);
  const ra=s.resourceAnalysis||{};
  const metals=JSON.stringify([ra.availableResources, ra.resourceConditions]).match(/[^"]*(?:ore|iron|copper|tin|silver|gold|metal|mine)[^"]*/gi)||[];
  const chains=(s.economicState?.activeChains||[]).filter(c=>/metal|iron|copper|gold|silver|ore/i.test(JSON.stringify(c))).map(c=>({id:c.chainId||c.id,name:c.name||c.label,status:c.status||c.state,need:c.processingInstitutions}));
  out.push({seed,tier:s.tier,pop:s.population,stress:(s.stress?[].concat(s.stress):[]).map(x=>x.type), desc:sm.desc,
    mine:hasInstitution(s,'mine'), smith:hasInstitution(s,'smith'),
    mineNames:names.filter(n=>INSTITUTION_KIND_PATTERNS.mine.test(n)), smithNames:names.filter(n=>INSTITUTION_KIND_PATTERNS.smith.test(n)),
    metalish:names.filter(n=>/smith|forge|metal|armou?r|weapon|foundry|mine|quarr|ore/i.test(n)), metals:[...new Set(metals)].slice(0,8), chains});
}
fs.writeFileSync(process.env.OUT, out.map(o=>JSON.stringify(o)).join('\n')+'\n'); console.log('smelters', out.length);
