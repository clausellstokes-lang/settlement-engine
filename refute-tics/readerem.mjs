import { readFileSync } from 'node:fs';
import { NOISE } from './registers.mjs';
const load=(f)=>JSON.parse(readFileSync(f,'utf8'));
const prose=(s)=>{const m=s.replace(/\{[^}]*\}/g,'{}'); if(!/[a-z]/.test(m))return false; if(m.split(/\s+/).filter(Boolean).length<2)return false; return !NOISE.some(r=>r.test(m));};
const READER=[
 'src/generators/narrative/settlementOriginProse.js',
 'src/generators/power/governanceNarrative.js',
 'src/generators/crossSettlementConflicts.js',
 'src/generators/economy/prosperity.js',
 'src/generators/economy/economicState.js',
 'src/generators/safetyProfile.js',
 'src/generators/foodGenerator.js',
 'src/domain/display/labelBands.js',
 'src/domain/customContentSchema.js',
 'src/domain/compendium/searchIndex.js',
 'src/domain/display/dossierViewModel.js',
 'src/components/gallery/galleryUtils.js',
 'src/foundry/moduleBuilder.js',
 'src/store/settlementGenerateAction.js',
];
const rows=[];
for (const r of load('walk.json')) rows.push({file:r.file,text:r.text});
for (const r of load('inline.json')) rows.push({file:r.file,text:r.text});
for (const r of load('jsx.json')) for (const h of r.hits) rows.push({file:r.file,text:h});
const seen=new Set(); const byFile={};
for (const r of rows) {
  if (!READER.includes(r.file)) continue;
  if (!prose(r.text)) continue;
  if (!/—/.test(r.text)) continue;
  const k=r.text.trim(); if (seen.has(k)) continue; seen.add(k);
  (byFile[r.file] ||= []).push(k);
}
let tot=0;
for (const [f,ts] of Object.entries(byFile).sort((a,b)=>b[1].length-a[1].length)) { tot+=ts.length; console.log(String(ts.length).padStart(4)+'  '+f); }
console.log('---');
console.log('DISTINCT reader-facing em-dash prose strings across these 14 files:', tot);
console.log('em-dash OCCURRENCES in them:', [...seen].reduce((a,t)=>a+(t.match(/—/g)||[]).length,0));
