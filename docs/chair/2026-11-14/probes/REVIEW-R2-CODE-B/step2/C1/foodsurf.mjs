// foodsurf.mjs <dumpsDir> <surfDir> <rec.tsv> : every surface's food label per town, tsv
import fs from 'node:fs';
const [D, S, R] = process.argv.slice(2);
const rec = new Map(fs.readFileSync(R,'utf8').trim().split('\n').map(l=>{const a=l.split('\t'); return [a[0],a];}));
const sec = (t, name) => { const i = t.indexOf('== '+name+' =='); if (i<0) return ''; const j = t.indexOf('\n== ', i+5); return t.slice(i, j<0?undefined:j); };
const rd = (p) => { try { return fs.readFileSync(p,'utf8'); } catch { return null; } };
console.log(['seed','tier','pop','st','label','band','gap','imp','months','ov','dl','crisis','tonight','pdfTonight','pdfAnchor','foundryTonight','foundryEcon','econShort','foundations'].join('\t'));
for (const f of fs.readdirSync(D)) { if (!f.endsWith('.txt')) continue; const seed = f.slice(0,-4); const t = rd(D+'/'+f); const r = rec.get(seed)||[];
  const ov = (sec(t,'Summary/Overview').match(/^Food Security(.+)$/m)||[])[1]||'';
  const dl = (sec(t,'World/Daily Life').match(/^Food\n(.+)$/m)||[])[1]||'';
  const cr = (sec(t,'Summary/Crisis').match(/^Food: (.+)$/m)||[])[1]||'';
  const fd = (sec(t,'Summary/Foundations').match(/^Food([A-Z]\w+)$/m)||[])[1]||'';
  const es = (sec(t,'Systems/Economics').match(/Short: ([\d,]+) lbs\/day/)||[])[1]||'';
  let tn=''; const tj = rd(S+'/'+seed+'.tonight.txt'); if (tj) { try { const j=JSON.parse(tj); const walk=(o)=>{ if(Array.isArray(o)) o.forEach(walk); else if(o&&typeof o==='object'){ if(o.id==='food'&&typeof o.text==='string') tn=o.text; for(const k in o) walk(o[k]); } }; walk(j);} catch { tn = (tj.match(/"id": "food",[\s\S]*?"text": "([^"]*)"/)||[])[1]||'?'; } }
  const pdf = rd(S+'/'+seed+'.pdf-canon_dossier.txt')||'';
  const pdfT = (pdf.match(/^Food\n(.*(?:granary|larder|stores|Secure|Pressured|Deficit|Surplus|Import|Famine).*\.)$/m)||[])[1]||'';
  const pdfA = (pdf.match(/^Food\n(Deficit|Surplus|Balanced)$/m)||[])[1]||'';
  const fo = rd(S+'/'+seed+'.foundry-canon_dossier.txt')||'';
  const foT = (fo.match(/\*\*Food\*\*: ([^\\"]*)/)||[])[1]||'';
  const foE = (fo.match(/\*\*Food:\*\* ([^\\"]*)/)||[])[1]||'';
  console.log([seed, r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], ov, dl, cr, tn, pdfT, pdfA, foT, foE, es, fd].join('\t'));
}
