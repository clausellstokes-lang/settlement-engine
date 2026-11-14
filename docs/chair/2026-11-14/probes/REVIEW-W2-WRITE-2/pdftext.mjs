// pdftext.mjs <tree> <recordsDir> <outDir>: the PDF's state-prose text (buildPrintProse on the normalized record,
// faith unlocked, as generateSettlementPDF computes it), one line per paragraph, "== pdf/<tab>/<mount> ==" headers.
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const [T,R,O,PP]=process.argv.slice(2); fs.mkdirSync(O,{recursive:true}); if(PP) fs.mkdirSync(PP,{recursive:true});
// PP (optional): the stored publicProse (the save/share surface) of each record, every string of 25+ chars, '== pp/<block>/<key> =='.
const { normalizeSettlement } = await import(T+'/src/domain/normalizeSettlement.js');
const { buildPrintProse } = await import(T+'/src/domain/display/stateProse/printProse.js');
let n=0,err=0;
for(const f of fs.readdirSync(R).filter(f=>f.endsWith('.json.gz'))){
  try{ const town=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(R,f))));
    const sp=buildPrintProse(normalizeSettlement(town),{faithUnlocked:true}); const out=[];
    for(const [tab,ms] of Object.entries(sp)) for(const [m,p] of Object.entries(ms)){ out.push(`== pdf/${tab}/${m} ==`); for(const s of String(p).split(/\n+/)) if(s.trim()) out.push(s.trim()); }
    fs.writeFileSync(path.join(O,f.replace('.json.gz','.txt')),out.join('\n')+'\n'); n++;
    if(PP){ const o=[]; const blocks=(town.publicProse&&town.publicProse.blocks)||{}; for(const [b,ks] of Object.entries(blocks)) for(const [k,v] of Object.entries(ks||{})){ o.push(`== pp/${b}/${k} ==`); (function w(x){ if(typeof x==='string'){ if(x.length>=25) o.push(x.trim()); } else if(x&&typeof x==='object') for(const y of Object.values(x)) w(y); })(v); } fs.writeFileSync(path.join(PP,f.replace('.json.gz','.txt')),o.join('\n')+'\n'); }
  }catch(e){ err++; if(err<4) console.error(f,e.message); }
}
console.log('pdf texts',n,'errors',err);
