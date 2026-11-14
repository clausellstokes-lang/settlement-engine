// honor.mjs <tree> <dir> <which>: men whose honorific (honorificOfTitle, seeded id::key) is a woman's word, by title.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [T,D,W]=process.argv.slice(2); const { honorificOfTitle } = await import(T+'/src/data/faceHonorifics.js');
const FEM=/^(Alewife|Midwife|Goodwife|Madam|Mistress|Dame|Lady)$/; const by={}; let n=0, men=0;
for(const f of fs.readdirSync(D).filter(f=>f.startsWith(W+'.')&&f.endsWith('.ndjson.gz'))) for(const l of zlib.gunzipSync(fs.readFileSync(D+'/'+f)).toString().split('\n')){ if(!l) continue; const r=JSON.parse(l);
  for(const c of r.npcs){ if(c.g!=='male') continue; if(/alewife|midwife|madam/.test(c.title||'')) men++; const h=honorificOfTitle(c.title,c.g,`${c.id}::${c.key}`); if(FEM.test(h||'')){ n++; by[c.title+' -> '+h]=(by[c.title+' -> '+h]||0)+1; } } }
console.log('men with the three titles',men,'· men styled with a woman\'s word',n,JSON.stringify(by));
