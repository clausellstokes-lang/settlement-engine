import fs from 'node:fs';
const TREE=process.env.TREE; process.chdir(TREE);
const { boot } = await import(new URL('./born.mjs', import.meta.url).href); const born=await boot(TREE);
const { hasInstitution } = await import(TREE+'/src/domain/facts/institutions.js');
const out=[];
for (const seed of fs.readFileSync(process.env.SEEDS,'utf8').trim().split('\n')) { const s=born(seed); const b=(s.institutions||[]).find(i=>i.name==='Brewer'); if(!b) continue;
  const names=s.institutions.map(i=>i.name);
  out.push({seed,stress:(s.stress?[].concat(s.stress):[]).map(x=>x.type),desc:b.desc,baker:names.filter(n=>/bak/i.test(n)),tavern:hasInstitution(s,'tavern'),grainExport:JSON.stringify(s.economicState?.primaryExports||[]).match(/grain|wheat|barley/i)?.[0]||null,food:s.economicState?.foodSecurity?.status||s.economicState?.foodSecurity?.label||null}); }
fs.writeFileSync(process.env.OUT,out.map(x=>JSON.stringify(x)).join('\n')+'\n'); const c={}; for(const o of out){c[o.desc.slice(40,95)+" tav="+o.tavern]=(c[o.desc.slice(40,95)+" tav="+o.tavern]||0)+1} console.log(out.length, JSON.stringify(c,null,1));
