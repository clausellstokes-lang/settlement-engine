// TAIL-TITLES-2 KT1: where the moved honorifics PRINT. For every card whose connection name moves (moved.json from
// honfaces.mjs), the dump lines holding "<old> <name>" and "<new> <name>", by the dump's section (tabs, PDF, journal).
// Also every line in every dump holding a sexed honorific word directly before a name of the other sex (the whole
// corpus, not only the moved cards). node honprint.mjs <moved.json> <dumps> <corpus>
import fs from 'node:fs'; import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const [M, D, C] = process.argv.slice(2); const L = require('./load.cjs');
const moved = JSON.parse(fs.readFileSync(M, 'utf8'));
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const old = {}, now = {}; const add = (o, k, s) => (o[k] ??= new Set()).add(s);
const bySeed = {}; for (const e of moved) (bySeed[e[0]] ??= []).push(e);
const sec = (l, cur) => { const m = /^== (.+) ==$/.exec(l); return m ? m[1] : cur; };
for (const [seed, es] of Object.entries(bySeed)) { let cur = '';
  for (const l of fs.readFileSync(`${D}/${seed}.txt`, 'utf8').split('\n')) { cur = sec(l, cur);
    for (const [, name, g, face, a, b] of es) { if (l.includes(`${a} ${name}`)) add(old, `${cur} · ${g} ${face} "${a}"`, seed); if (l.includes(`${b} ${name}`)) add(now, `${cur} · ${g} ${face} "${b}"`, seed); } } }
const W = { female: ['Frontman', 'Ferryman', 'Foreman', 'Headman', 'Spokesman'], male: ['Mother', 'Matron', 'Madam', 'Alewife', 'Goodwife'] };
const against = {};
for (const r of L(C)) { const p = `${D}/${r.seed}.txt`; if (!fs.existsSync(p)) continue; const txt = fs.readFileSync(p, 'utf8');
  for (const c of r.s.npcs || []) { for (const w of W[c.gender] || []) { const re = new RegExp(`\\b${w} ${esc(c.name)}`); if (re.test(txt)) add(against, `${c.gender} "${w}"`, r.seed); } } }
const all = (o) => new Set(Object.values(o).flatMap((v) => [...v])).size;
const show = (h, o) => { console.log(`${h}: towns ${all(o)}`); for (const [k, v] of Object.entries(o).sort((x, y) => y[1].size - x[1].size)) console.log(`  ${v.size}\t${k}`); };
show('OLD word printed (moved cards)', old); show('NEW word printed (moved cards)', now); show('ANY sexed honorific before a name of the other sex (every card)', against);
