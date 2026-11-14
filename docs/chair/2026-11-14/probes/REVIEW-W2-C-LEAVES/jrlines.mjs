// jrlines.mjs <surf dir> <seeds file>: each <seed>.foundry-canon_dossier.txt (one JSON page per line) to <seed>.journal.txt,
// one markdown line per line under "== <page name>" headers.
import fs from 'node:fs';
const [d, sf] = process.argv.slice(2); let n = 0;
for (const seed of fs.readFileSync(sf, 'utf8').trim().split('\n')) {
  const f = `${d}/${seed}.foundry-canon_dossier.txt`; if (!fs.existsSync(f)) continue; const out = [];
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) { if (!l.startsWith('{')) continue; let p; try { p = JSON.parse(l); } catch { continue; }
    out.push(`== ${p.name}`); for (const m of String(p.markdown || '').split('\n')) if (m.trim()) out.push(m.trim()); }
  fs.writeFileSync(`${d}/${seed}.journal.txt`, out.join('\n') + '\n'); n++;
}
console.log('journals', n);
