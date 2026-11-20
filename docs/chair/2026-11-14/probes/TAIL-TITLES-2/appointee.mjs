import { createRequire } from 'node:module'; const require = createRequire(import.meta.url); const L = require('./load.cjs');
const [T, C] = process.argv.slice(2); const D = await import(`${T}/src/domain/people/cardDoor.js`);
const out = [];
for (const r of L(C)) for (const c of r.s.npcs || []) if (/lord's appointee/.test(`${c.title} ${c.role} ${c?.institution?.title}`)) out.push([r.seed, c.name, c.gender, c.title, c.role, c?.institution?.title, c?.institution?.name, D.faceNameOf(c, r.s)].join(' | '));
console.log(out.length); console.log(out.filter((l) => / female /.test(l)).join('\n'));
