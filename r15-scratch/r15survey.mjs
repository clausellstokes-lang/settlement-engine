import fs from 'node:fs';
const rows = JSON.parse(fs.readFileSync(process.argv[2],'utf8')).filter(r=>r.register==='R15');
console.log('R15 rows', rows.length);
const c = (f)=>{const m={};for(const r of rows)m[r[f]]=(m[r[f]]||0)+1;return m;};
console.log('from:', JSON.stringify(c('from')));
console.log('shape:', JSON.stringify(c('shape')));
console.log('unit:', JSON.stringify(c('unit')));
console.log('viaFn:', JSON.stringify(c('viaFn')));
console.log('hasLine:', rows.filter(r=>r.line!==undefined).length);
const files = c('file');
const ents = Object.entries(files).sort((a,b)=>b[1]-a[1]);
console.log('distinct files', ents.length);
console.log('top 40 files:');
for (const [f,n] of ents.slice(0,40)) console.log('  ', n, f);
fs.writeFileSync('r15-files.txt', ents.map(([f,n])=>`${n}\t${f}`).join('\n'));
fs.writeFileSync('r15-rows.json', JSON.stringify(rows));
// distribution of file counts
let cum=0; const total=rows.length;
const buckets=[];
for (const [f,n] of ents){cum+=n;buckets.push([f,n,cum]);}
console.log('files covering 50%:', buckets.findIndex(b=>b[2]>=total*0.5)+1);
console.log('files covering 80%:', buckets.findIndex(b=>b[2]>=total*0.8)+1);
console.log('files covering 95%:', buckets.findIndex(b=>b[2]>=total*0.95)+1);
