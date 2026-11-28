// RANGE-MEASURE (D): how alike a key's lines are, snapshot by snapshot, over the keys that print today (same rule as classify.mjs)
// node trend.mjs <printing-paths.json> snap...  (and, for keys reworded between two snapshots, the alikeness before and after)
import { readFileSync } from 'node:fs';
const [P, ...S] = process.argv.slice(2);
const paths = new Set(JSON.parse(readFileSync(P, 'utf8')));
const src = readFileSync(new URL('./classify.mjs', import.meta.url), 'utf8');
const STOP = new Set(src.match(/const STOP = new Set\(`([\s\S]*?)`/)[1].split(/\s+/));
const stem = (w) => { w = w.replace(/'s$/, '').replace(/^'|'$/g, ''); if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`; if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3); if (w.length > 4 && w.endsWith('ed')) return w.slice(0, -2); if (w.length > 5 && w.endsWith('ly')) return w.slice(0, -2); if (w.length > 3 && w.endsWith('es') && /(ss|sh|ch|x)es$/.test(w)) return w.slice(0, -2); if (w.length > 3 && w.endsWith('s') && !/(ss|us|is)$/.test(w)) return w.slice(0, -1); return w; };
const content = (t) => new Set((t.replace(/\{[^}]*\}|\u0001/g, ' ').toLowerCase().replace(/[‘’]/g, "'").match(/[a-z']+/g) || []).filter((w) => !STOP.has(w) && w.length > 2).map(stem).filter((w) => w.length > 2 && !STOP.has(w)));
const meanO = (lines) => { const s = lines.map(content); let n = 0; let t = 0; for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length; j++) { let x = 0; for (const w of s[i]) if (s[j].has(w)) x++; const m = Math.min(s[i].size, s[j].size); n++; t += m ? x / m : 0; } return n ? t / n : null; };
const load = (f) => { const m = new Map(); for (const k of JSON.parse(readFileSync(f, 'utf8')).keys) if (paths.has(k.key)) m.set(k.key, (m.get(k.key) || []).concat(k.lines.map((l) => l.text))); return m; };
const snaps = S.map((f) => [f.replace(/.*keys-|\.json/g, ''), load(f)]);
for (const [name, m] of snaps) { const v = [...m.values()].filter((l) => l.length >= 2).map(meanO); console.log(`${name}\tkeys 2+ ${v.length}\tmean alikeness (overlap) ${(v.reduce((a, b) => a + b, 0) / v.length).toFixed(3)}\tshare at >= 0.30 ${(100 * v.filter((x) => x >= 0.3).length / v.length).toFixed(1)}%`); }
// keys present at the first and last snapshot with 2+ lines at both: did their lines grow alike or apart?
const [, A] = snaps[0]; const [, B] = snaps[snaps.length - 1];
let up = 0; let down = 0; let same = 0; let dA = 0; let dB = 0; let n = 0;
for (const [k, lb] of B) { const la = A.get(k); if (!la || la.length < 2 || lb.length < 2) continue; const a = meanO(la); const b = meanO(lb); n++; dA += a; dB += b; if (b > a + 0.02) up++; else if (b < a - 0.02) down++; else same++; }
console.log(`keys of 2+ lines at both ends: ${n}; alikeness ${(dA / n).toFixed(3)} -> ${(dB / n).toFixed(3)}; grew alike ${up}, grew apart ${down}, unchanged ${same}`);
