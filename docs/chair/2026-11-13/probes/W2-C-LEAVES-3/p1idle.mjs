import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,T]=process.argv.slice(2); const {ex}=JSON.parse(fs.readFileSync('probes/p1.out.json'));
const want=new Set([...ex['full|idle'],...ex['partial|idle']].map(e=>e.seed));
const { liveInstitutions } = await import(T+'/src/domain/institutions/institutionRoster.js');
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l); if(!want.has(seed)) continue;
  const h=liveInstitutions(s).map(i=>i.name).filter(n=>/apothec|alchem|herbal|healer/i.test(n));
  const card=['fullyExploited','partiallyExploited'].flatMap(k=>(s.resourceAnalysis.exploitation[k]||[]).filter(c=>c.rawResource==='medicinal herbs').map(c=>k+':'+(c.processingInstitutions||[]).join('/')));
  const herbChains=(s.economicState.activeChains||[]).filter(c=>/herb|apoth|alchem/i.test(c.chainId+' '+(c.outputs||[]).join(' '))).map(c=>`${c.chainId}:${c.status}:${c.resourceInputKey}:${c.resourceInputAvailable}`);
  console.log(seed, '|', h.join(', '), '|', card.join(' '), '|', herbChains.join(' ; '), '| nearby', (s.config.nearbyResources||[]).join(','));
}
