import fs from 'node:fs';
const groups = JSON.parse(fs.readFileSync('r15-groups.json','utf8'));
const hits = JSON.parse(fs.readFileSync('ident-hits.json','utf8'));
const out=[];
for(const g of groups){
  const id=g.exp.replace(/\(\)$/,'');
  const arr=(hits[id]||[]).filter(h=>!h.startsWith(g.file+':'));
  const byFile=new Map();
  for(const h of arr){ const f=h.split(':')[0]; if(!byFile.has(f)) byFile.set(f,h); }
  out.push(`### ${g.n}  ${g.file}  ::  ${g.exp}`);
  out.push(`  paths: ${g.paths.slice(0,3).join(' | ')}`);
  for(const s of g.samples) out.push(`  ex: ${JSON.stringify(s)}`);
  out.push(`  consumers(${byFile.size}):`);
  for(const [f,h] of [...byFile.entries()].slice(0,10)) out.push(`    ${h.slice(0,200)}`);
  out.push('');
}
fs.writeFileSync('worksheet.txt', out.join('\n'));
console.log('lines', out.length);
