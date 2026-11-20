// TAIL-TITLES-2 KT1: every card's connection-line name (cardDoor.js :: faceNameOf) at two trees, from ONE corpus (the draw
// does not move: the record is the same; only the pool's word can). Prints every card whose name moves, and every card
// whose honorific is a sexed word against the card's gender. node honfaces.mjs <treeA> <treeB> <corpus.ndjson.gz> [out.json]
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire(import.meta.url);
const [TA, TB, C, OUT] = process.argv.slice(2);
const L = require(process.env.LOAD || './load.cjs');
const A = await import(`${TA}/src/domain/people/cardDoor.js`); const B = await import(`${TB}/src/domain/people/cardDoor.js`);
const SEX = { female: /^(Frontman|Ferryman|Foreman|Headman|Spokesman|Abbot|Lord|Father)\b/, male: /^(Mother|Matron|Madam|Alewife|Goodwife|Midwife|Abbess|Lady)\b/ };
const moved = {}, badA = {}, badB = {}, ex = [];
const add = (o, k, seed) => { (o[k] ??= new Set()).add(seed); };
for (const r of L(C)) { const s = r.s; const seed = r.seed;
  for (const c of s.npcs || []) { const t = c?.institution?.title; if (!t) continue;
    const a = A.cardHonorificOf(c, s), b = B.cardHonorificOf(c, s);
    const k = `${c.gender} ${t}`;
    if (SEX[c.gender]?.test(a)) add(badA, `${k} · "${a}"`, seed);
    if (SEX[c.gender]?.test(b)) add(badB, `${k} · "${b}"`, seed);
    if (a !== b) { add(moved, `${k} · "${a}" -> "${b}"`, seed); ex.push([seed, c.name, c.gender, t, a, b]); } } }
const all = (o) => new Set(Object.values(o).flatMap((v) => [...v])).size;
const show = (h, o) => { console.log(`${h}: towns ${all(o)}`); for (const [k, v] of Object.entries(o).sort((x, y) => y[1].size - x[1].size)) console.log(`  ${v.size}\t${k}`); };
show('A: honorific against the sex', badA); show('B: honorific against the sex', badB); show('MOVED A -> B', moved);
if (OUT) fs.writeFileSync(OUT, JSON.stringify(ex));
