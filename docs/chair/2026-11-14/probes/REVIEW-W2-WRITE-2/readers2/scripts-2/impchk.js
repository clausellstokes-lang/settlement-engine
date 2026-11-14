const rec=require('./rec.js');const L=require('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/removals-2.json');
const split=s=>s?s.match(/[^.!?]+[.!?]+["')]*\s*|[^.!?]+$/g).map(x=>x.trim()):[];
const map={'luxury goods':/gem|precious|luxury/,'metals':/iron|precious_metals|metal|copper|silver|gold|^tin/,'timber':/timber|forest/,'stone':/stone|quarry/,'livestock':/livestock|grazing|herd/,'salt':/salt/};
for(const i of process.argv.slice(2).map(Number))for(const t of L[i].read){const r=rec(t.town);const ra=r.resourceAnalysis||{};
const b=split(t.baseParagraph),p=split(t.tipParagraph);const added=p.filter(x=>!b.includes(x));
for(const s of added){let g=null;for(const k in map)if(s.includes(k))g=k;
const av=(ra.availableResources||[]);const hit=g?av.filter(a=>map[g].test(a)):[];
const crit=JSON.stringify((ra.imports||{}).critical||[]);
console.log(i,t.town,'|',g,'| avail-hit=['+hit.join(',')+'] crit='+crit,'|',s.slice(0,90));}}
