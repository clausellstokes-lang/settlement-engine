// node pagediff.mjs <tree> <baseDir> <tipDir>: dossier lines by towns, base vs tip (names folded); lines that lost towns, lines that gained
import fs from 'node:fs'; import path from 'node:path';
const [, , tree, A, B] = process.argv;
const { parseDump, dossierTabs } = await import(`${tree}/tests/helpers/pageLaws/page.mjs`);
const shape = (l, town) => l.trim();
const read = (dir) => { const m = new Map(); for (const f of fs.readdirSync(path.join(dir, 'dumps'))) { const town = f.replace(/\.txt$/, ''); const { tabs } = parseDump(fs.readFileSync(path.join(dir, 'dumps', f), 'utf8')); for (const ls of Object.values(dossierTabs(tabs))) for (const l of ls) { const k = l.trim(); if (!m.has(k)) m.set(k, new Set()); m.get(k).add(town); } } return m; };
const a = read(A), b = read(B);
const changed = new Set(); const lost = [], gained = [];
for (const [k, s] of a) { const t = b.get(k) || new Set(); const gone = [...s].filter((x) => !t.has(x)); if (gone.length) { lost.push([gone.length, k]); gone.forEach((x) => changed.add(x)); } }
for (const [k, s] of b) { const t = a.get(k) || new Set(); const add = [...s].filter((x) => !t.has(x)); if (add.length) gained.push([add.length, k]); }
console.log('towns whose page changed', changed.size, '| distinct lines lost', lost.length, '| gained', gained.length);
const fold = (rows) => { const m = new Map(); for (const [n, k] of rows) { const g = k.replace(/[A-ZÀ-Þ][\p{L}'’-]+(?: [A-ZÀ-Þ][\p{L}'’-]+)*/gu, 'X'); m.set(g, (m.get(g) || 0) + n); } return [...m].sort((x, y) => y[1] - x[1]); };
console.log('LOST (folded, by towns):'); for (const [k, n] of fold(lost).slice(0, 25)) console.log(' ', n, k.slice(0, 170));
console.log('GAINED (folded, by towns):'); for (const [k, n] of fold(gained).slice(0, 25)) console.log(' ', n, k.slice(0, 170));
