import fs from 'node:fs'; import zlib from 'node:zlib';
const OUT=process.argv[2];
const corpus=zlib.gunzipSync(fs.readFileSync(OUT+'/corpus.ndjson.gz')).toString().trim().split('\n').map(l=>JSON.parse(l));
const B=(await import(process.env.S+'/base/src/domain/display/validationOnPage.js')).resourceGapLines;
const T=(await import(process.env.S+'/tip/src/domain/display/validationOnPage.js')).resourceGapLines;
const all=[]; let added=0;
for(const {seed,s} of corpus){ const b=B(s).map(x=>x.impact), t=new Set(T(s).map(x=>x.impact)); added+=[...t].filter(x=>!b.includes(x)).length;
 for(const l of b) if(!t.has(l)){ const m=l.match(/^No (.+?) reach(?:es)? the (.+)\.$/); const gaps=(s.resourceAnalysis?.gaps||[]).filter(g=>g.institution);
   const house=m?m[2]:''; const g=gaps.filter(g=>g.institution.toLowerCase().replace(/\s*\(.*\)/,'').startsWith(house.slice(0,5)));
   const pi=(s.economicState.primaryImports||[]).join(' | ').toLowerCase(); const good=m?m[1]:l;
   const inPI=good.split(/, | or /).some(n=>pi.includes(n.toLowerCase())); const crit=(s.resourceAnalysis?.imports?.critical||[]);
   const reason=(s.resourceAnalysis?.imports?.reasons||{}); const cr=crit.find(c=>good.split(/, | or /).some(n=>c.toLowerCase().includes(n.split(' ')[0].toLowerCase())||n.toLowerCase().includes(c.split(' ')[0].toLowerCase())));
   const chains=(s.economicState.activeChains||[]).filter(c=>(c.processingInstitutions||[]).some(p=>p.toLowerCase().startsWith(house.slice(0,5))));
   all.push({seed,l,kinds:g.map(x=>x.kind).join('/')||'?',inPI,crit:cr||null,why:cr?reason[cr]:null,chains:chains.map(c=>`${c.chainId||c.label}:${c.status}`).join(',')}); } }
console.log('removed',all.length,'towns',new Set(all.map(a=>a.seed)).size,'added',added);
const c=(f)=>all.filter(f).length;
console.log('record gap kind missing',c(a=>/missing/.test(a.kinds)),'imported',c(a=>/imported/.test(a.kinds)),'unknown',c(a=>a.kinds==='?'));
console.log('good in the economy primaryImports',c(a=>a.inPI),'| only via the viability critical list',c(a=>!a.inPI&&a.crit));
console.log('viability reasons',JSON.stringify(all.reduce((h,a)=>{const k=(a.why||'none').replace(/ but not available in \w+ terrain|Required by /g,(x)=>x.startsWith('Req')?'Required by ':' (terrain lacks)').replace(/^(Required by )\S+.*/, 'Required by <house> (terrain lacks)').replace(/^\w+ terrain cannot produce this locally/,'terrain cannot produce');h[k]=(h[k]||0)+1;return h;},{})));
let i=0; const step=Math.floor(all.length/30); console.log('--- the 30 (every',step,'th)');
for(let j=0;j<all.length&&i<30;j+=step,i++){ const a=all[j]; console.log(`${i+1}. ${a.seed} | ${a.l} | gap kind: ${a.kinds} | in economy imports: ${a.inPI} | listed via: ${a.crit} (${a.why}) | chains: ${a.chains||'none'}`); }
