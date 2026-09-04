// OPUS-AUTHORED. Approximates eslint max-lines {skipBlankLines,skipComments}: drop blank
// lines and lines that are wholly a comment. NOT the enforcer; a cross-check only.
import fs from 'fs';
for (const f of process.argv.slice(2)) {
  const lines = fs.readFileSync(f,'utf8').split('\n');
  let n=0, inBlock=false;
  for (const raw of lines) {
    const t = raw.trim();
    if (inBlock) { if (t.includes('*/')) { inBlock=false; const after=t.slice(t.indexOf('*/')+2).trim(); if(after) n++; } continue; }
    if (t==='') continue;
    if (t.startsWith('//')) continue;
    if (t.startsWith('/*')) { if (!t.includes('*/')) inBlock=true; else { const after=t.slice(t.lastIndexOf('*/')+2).trim(); if(after) n++; } continue; }
    n++;
  }
  console.log(String(n).padStart(5), f);
}
