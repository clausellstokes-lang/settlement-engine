// Chair's independent re-derivation of LH8's stripper-order finding (read-only over a dock's src/).
import { readFileSync, readdirSync, statSync } from 'node:fs'; import path from 'node:path';
const root = process.argv[2]; const files = [];
(function walk(d){ for (const e of readdirSync(d)) { const p = path.join(d,e); const s = statSync(p); if (s.isDirectory()) walk(p); else if (/\.(js|jsx|mjs)$/.test(e)) files.push(p); } })(path.join(root,'src'));
const cm = s => s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/^\s*\/\/.*$/gm,'');
const SQ = /'(?:\\.|[^'\\\n])*'/g, DQ = /"(?:\\.|[^"\\\n])*"/g, TL = /`(?:\\.|[^`\\])*`/g;
const wrong = s => cm(s).replace(SQ,"''").replace(DQ,'""').replace(TL,'``');
const right = s => cm(s).replace(TL,'``').replace(SQ,"''").replace(DQ,'""');
let bad = 0, lost = 0, worst = [];
for (const f of files) { const s = readFileSync(f,'utf8'); const a = wrong(s), b = right(s); if (a !== b) { bad++; const d = b.length - a.length; lost += Math.max(0,d); worst.push([d, path.relative(root,f)]); } }
worst.sort((x,y)=>y[0]-x[0]);
console.log(`files scanned ${files.length}; files where the wrong order changes the stripped text: ${bad}; chars hidden (right − wrong, summed where positive): ${lost}`);
console.log('worst five:', worst.slice(0,5).map(w=>`${w[1]} ${w[0]}`).join(' | '));
