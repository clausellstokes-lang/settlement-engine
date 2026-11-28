// node arm1.mjs <tree> <out.json>: the presumed-things walker's ARM 1 hits over a tree (scanTree), as `thing :: file :: text`
import { writeFileSync } from 'node:fs';
const [, , tree, out] = process.argv;
const m = await import(`${tree}/tests/lint/presumedThings.shared.mjs`);
const hits = m.scanTree(tree).map((h) => `${h.thing} :: ${h.file} :: ${h.text}`);
writeFileSync(out, JSON.stringify([...new Set(hits)].sort(), null, 1));
console.log('arm1 hits', hits.length);
