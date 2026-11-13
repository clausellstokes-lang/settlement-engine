// classify.mjs: the reviewer's class for each TIP-ONLY row of COLD-LIST.json (written after the claims were read).
import fs from 'node:fs';
const a=JSON.parse(fs.readFileSync(new URL('./COLD-LIST.json', import.meta.url)));
const LORDS={'rpf-city-occupied-13':['Orlaith Fitzgerald'],'rpf-city-politically_fractured-13':['Chimalli Zam'],'rpf-city-succession_void+politically_fractured-13':['Publicola Maximus'],'rpf-city-succession_void-13':['Guangwei Yoon'],'rpf-metropolis-occupied-13':['Rognvald Cormacsson'],'rpf-metropolis-politically_fractured-13':['Ioannikios Gabalas'],'rpf-metropolis-succession_void-13':['Ichiro Gang','Tao Jung']};
const cls=(r)=>{ const s=r.sentence, L=LORDS[r.town]||[]; const lord=L.find(n=>s.includes(n));
  if(/Financial Dependence|council's decisions|pays for the common works|governs on/.test(s)&&lord) return 'O1 a minted lord dealt the governor\'s debt row';
  if(/^the lord · /.test(s)&&/female|Lady|her /.test(r.fact)) return 'O2 a woman lord labelled "the lord"';
  if(lord&&/named .* as successor|methods as/.test(s)) return 'O3 an old pool line re-dealt onto a minted lord';
  if(/is stirring it: already carries more weight/.test(s)) return 'L1 the rival power\'s reason beside its minted lord';
  if(/^(Noble Families|Noble Houses) · first of/.test(s)) return 'L2 the lord\'s house row repeats the body';
  if(/^↳\d+ members · first/.test(s)||/ · (second|third|member) of (Noble|The Peerage|The Highborn)/.test(s)) return 'X1 a tradesperson ranked in a noble body (the line\'s class; now second or third behind the lord)';
  if(r.tab==='World/Relationships') return 'X2 an old relationship pool re-dealt (the line\'s class)';
  return 'X3 other old class at a moved line';
};
const t={}; for(const r of a.filter(r=>r.tipOnly)){ r.reviewerClass=cls(r); const k=r.reviewerClass; t[k]=t[k]||{n:0,H:0,M:0,L:0}; t[k].n++; t[k][r.severity[0]]++; }
fs.writeFileSync(new URL('./COLD-LIST.tiponly-classed.json', import.meta.url), JSON.stringify(a.filter(r=>r.tipOnly),null,1));
console.log(JSON.stringify(t,null,1));
for(const r of a.filter(r=>r.tipOnly&&/^X3|^O|^L/.test(r.reviewerClass))) console.log(r.reviewerClass.slice(0,3), r.severity, r.town, '|', r.sentence.slice(0,150));
