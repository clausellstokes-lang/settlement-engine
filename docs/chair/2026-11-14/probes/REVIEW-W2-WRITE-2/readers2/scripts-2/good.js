const rec=require('./rec.js');const L=require('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/removals-2.json');
const i=+process.argv[2];const rx=new RegExp(process.argv[3]);
for(const t of L[i].read){const r=rec(t.town);const ra=r.resourceAnalysis||{};
const m=(t.removedSentence||'').match(rx);const g=m?m[1]:'?';
const gk=g.split(/[ \/]/)[0].toLowerCase();
const av=(ra.availableResources||[]).filter(a=>a.toLowerCase().includes(gk));
const cond=(ra.resourceConditions||[]).filter(c=>c.key.includes(gk)).map(c=>c.key+':'+c.condition);
const crit=((ra.imports||{}).critical||[]).filter(c=>c.toLowerCase().includes(gk));
const reason=Object.entries((ra.imports||{}).reasons||{}).filter(([k])=>k.toLowerCase().includes(gk)).map(([k,v])=>v);
const lp=(r.economicState.localProduction||[]).filter(x=>x.toLowerCase().includes(gk));
const pi=(r.economicState.primaryImports||[]).filter(x=>x.toLowerCase().includes(gk));
const fs=r.economicState.foodSecurity.chains;
const td=(r.economicState.tradeDependencies||[]).filter(d=>JSON.stringify(d).toLowerCase().includes(gk)).map(d=>d.institution+'('+d.severity+')');
console.log(t.town,'good='+g,'avail=['+av+']','cond=['+cond+']','crit=['+crit+']','reason='+reason.join('|'),'lp=['+lp+']','imp=['+pi+']','dep=['+td.join(';')+']',gk==='grain'?'grainChain='+fs['Grain & agriculture']:'');}
