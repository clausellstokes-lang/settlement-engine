import { readFileSync } from 'node:fs';
const corpus = JSON.parse(readFileSync('corpus.json','utf8'));
const R6 = corpus.filter(r=>r.register==='R6');
const norm = (t)=>t.toLowerCase().replace(/\{[a-z_0-9]+\}/gi,'{}').replace(/[^a-z0-9{}'\s]/g,' ').replace(/\s+/g,' ').trim();
const has=(g)=>R6.filter(r=>norm(r.text).includes(g));
const A=has('it is public'), B=has('public that');
console.log('rows with "it is public":', A.length);
console.log('rows with "public that" :', B.length);
const Bset=new Set(B.map(r=>r.text));
const both=A.filter(r=>Bset.has(r.text));
console.log('rows with BOTH             :', both.length);
console.log('rows with "public that" but NOT "it is public":', B.filter(r=>!A.some(a=>a.text===r.text)).length);
console.log('rows with "it is public that":', has('it is public that').length);
console.log();
for (const g of ['the syndicate','destroyed but','came clean','the boss','the adept','the foreman','the agitator','is out the']) {
  const rows=has(g);
  const files=new Set(rows.map(r=>r.file));
  console.log(String(rows.length).padStart(4)+'  '+g.padEnd(16)+'  files:'+files.size+'  pools:'+new Set(rows.map(r=>r.pool||r.file)).size);
}
console.log();
console.log('--- 5 rows containing "the syndicate", with file+pool ---');
has('the syndicate').slice(0,5).forEach(r=>console.log('  ['+r.file+' | '+(r.pool||'')+'] '+r.text.slice(0,150)));
console.log();
console.log('--- literal "destroyed but" (no punct strip) in R6 raw text:', R6.filter(r=>/destroyed but/i.test(r.text)).length);
console.log('--- literal "destroyed, but" in R6 raw text:', R6.filter(r=>/destroyed, but/i.test(r.text)).length);
console.log('--- literal "came clean" in R6 raw text:', R6.filter(r=>/came clean/i.test(r.text)).length, '(rows) occurrences:', R6.reduce((a,r)=>a+(r.text.match(/came clean/gi)||[]).length,0));
