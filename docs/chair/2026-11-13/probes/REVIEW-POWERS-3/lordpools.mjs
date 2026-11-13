// the minted lords' re-dealt fields (category government -> other): clothes, feature, hooks, presentation, goals, at one tree
import fs from 'node:fs'; import zlib from 'node:zlib';
const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map((l) => JSON.parse(l));
const C = {}; const add = (k, v, seed) => { const m = (C[k] ||= new Map()); const e = m.get(v) || { n: 0, seed }; e.n++; m.set(v, e); };
let lords = 0;
for (const { seed, s } of rows) for (const c of s.npcs || []) if (c.title === 'the lord') { lords++;
  add('clothes', c.physical?.clothes, seed); add('feature', c.physical?.feature, seed); add('build', c.physical?.build, seed);
  for (const h of c.plotHooks || []) add('hook', typeof h === 'string' ? h : JSON.stringify(h), seed);
  add('impression', c.presentation?.impression, seed); add('goal.short', c.goal?.short, seed); add('goal.long', c.goal?.long, seed); add('secret', c.secret?.what, seed); add('flaw', c.personality?.flaw, seed); }
console.log('lords', lords);
for (const [k, m] of Object.entries(C)) { console.log(`## ${k}: ${m.size} distinct`); if (process.env.FULL) for (const [v, e] of [...m].sort((a, b) => b[1].n - a[1].n)) console.log(`  ${e.n}\t${e.seed}\t${String(v).slice(0, 200)}`); }
