import fs from 'node:fs'; import { createRequire } from 'node:module'; const require = createRequire(import.meta.url); const L = require('./load.cjs');
const [D, C] = process.argv.slice(2); const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); const k = {}; const ex = {};
for (const r of L(C)) { const txt = fs.readFileSync(`${D}/${r.seed}.txt`, 'utf8').split('\n'); let cur = '';
  for (const c of r.s.npcs || []) { if (c.gender !== 'female') continue; const re = new RegExp(`\\bHeadman ${esc(c.name)}`);
    cur = ''; for (const l of txt) { const m = /^== (.+) ==$/.exec(l); if (m) { cur = m[1]; continue; } if (re.test(l)) { const key = `${cur} | inst ${c?.institution?.title} | title ${c.title} | role ${c.role}`; (k[key] ??= new Set()).add(r.seed); ex[key] ??= `${r.seed}: ${l.trim().slice(0, 160)}`; } } } }
for (const [key, v] of Object.entries(k)) console.log(v.size, key, '\n    ', ex[key]);
