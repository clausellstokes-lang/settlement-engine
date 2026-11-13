import fs from 'node:fs';
const a=JSON.parse(fs.readFileSync('/home/user/wt/debt/attrib.json','utf8'));
const cold=JSON.parse(fs.readFileSync('/home/user/settlement-engine/docs/chair/2026-11-13/REVIEW-W2A-3-COLD-LIST.json','utf8')).lines; const byN=Object.fromEntries(cold.map(x=>[x.n,x]));
const RULES=[
 [/^(Prosperity|Safety|Defen[cs]e|Food|Order|Faith|Legitimacy) [+-]\d+$/,'src/components/new/tabs/PowerTab.jsx','code'],
 [/(Food security|Trade & entrepôt|Raw materials & fuel|Religion & civic|Defense & security|Crafts & industry|Luxury)[^a-z]*(✓ Running|○ Operational|Vulnerable|Impaired|Entrepôt|Failed|Dormant)/,'src/components/new/tabs/EconomicsTab.jsx','code'],
 [/-order chain/,'src/components/new/serviceComponents.jsx','code'],
 [/a silent partnership|· brings /,'src/domain/people/patronage.js','code'],
 [/ · (member|first|second|third) of /,'src/components/new/npcComponents.jsx','code'],
 [/^Founded by:/,'src/components/new/tabs/HistoryTab.jsx','code'],
 [/^No .* reach(es)? the .*\.$/,'src/domain/display/validationOnPage.js','code'],
 [/\((high magic|resident|\d[\d,]*[-+][^)]*)\)$/,'src/data/institutionalCatalog.js','catalogue'],
 [/^Who it touches|^nobody$/,'src/domain/crisis/crisisPage.js','code'],
 [/Military priority is/,'src/generators/economy/viability.js','code'],
 [/grows .* of what it eats/,'src/components/new/tabs/EconomicsTab.jsx','code'],
 [/reserves (to outlast|to pay)|from the \w+ reserves/,'src/generators/npcGenerator.js','code'],
 [/supplied by /,'src/domain/facts/magicSource.js','code'],
 [/critically impaired by siege/,'src/generators/stressGenerator.js','code'],
 [/^(Grazing land|Salt flats)$/,'src/components/new/tabs/EconomicsTab.jsx','code'],
 [/Economy$/,'src/components/new/tabs/EconomicsTab.jsx','code'],
 [/^[a-z]+[A-Z]|[a-z][A-Z][a-z]/,'src/components/new/tabs/EconomicsTab.jsx','code'], // pills run together: goods/chips
];
const ownerOf=(f)=>!f?'unattributed':/dossierStateProse\/|RECEIPT_POOLS|\.generated\.js$/.test(f)?'corpus':/institutionalCatalog|institutionDescColour|institutionDescVariants|institutionDisplayName|institutionLadders|institutionBacking/.test(f)?'catalogue':/^src\/data\//.test(f)?'data':/^src\/generators\//.test(f)?'code(generator)':'code';
let fixed=0;
for(const x of a){
  if(x.owner==='unattributed'){
    const src=(byN[x.n].source||'').match(/^(src\/[^:\s]+)/);
    if(src){ x.file=src[1]; x.how='reader source'; }
    else { const r=RULES.find(([re])=>re.test(x.sentence)); if(r){ x.file=r[1]; x.how='row rule'; } }
    if(x.file) fixed++;
  } else x.how='literal';
  x.owner=ownerOf(x.file);
}
fs.writeFileSync('/home/user/wt/debt/attrib2.json',JSON.stringify(a,null,1));
const c={}; for(const o of a){ const k=o.owner+'/'+o.severity; c[k]=(c[k]||0)+1;} console.log('fixed',fixed,c);
for(const x of a.filter(x=>x.owner==='unattributed')) console.log(x.severity,'|',x.sentence.slice(0,120));
