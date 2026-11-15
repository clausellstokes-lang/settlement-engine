import { createRequire } from 'node:module'; const require = createRequire(import.meta.url); const L = require('./load.cjs');
const [T, C] = process.argv.slice(2); const D = await import(`${T}/src/domain/people/cardDoor.js`);
const want = new Set(['the front man', 'the ferryman', 'the boat-headman', 'the camp foreman', 'the headman', 'the foundling-mother', "the newcomers' spokesman"]);
const seen = {};
for (const r of L(C)) { if (!/^r2r-(thorp|hamlet|village|town)-/.test(r.seed)) continue; for (const c of r.s.npcs || []) { const t = c?.institution?.title; if (!want.has(t)) continue;
  const k = `${c.gender} ${t} ${D.cardHonorificOf(c, r.s)}`; if (!seen[k]) seen[k] = [r.seed, c.name, D.faceNameOf(c, r.s)]; } }
for (const [k, v] of Object.entries(seen)) console.log(k, '|', v.join(' | '));
