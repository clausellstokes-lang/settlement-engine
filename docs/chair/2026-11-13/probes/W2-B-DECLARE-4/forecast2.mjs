// cross-check: fresh hits in the merged tree under the NEW key (my registers) vs the OLD key (first-120 of the labels)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const [mine, merged, lane] = process.argv.slice(2);
const shX = await import(join(merged, 'tests/lint/presumedThings.shared.mjs'));
const regs = ['tests/lint/presumedThings.register.json', 'tests/lint/presumedThings.widened.register.json'].map((r) => JSON.parse(readFileSync(join(mine, r), 'utf8')));
const hits = shX.scanTree(merged);
const newBank = new Set(regs.flatMap((r) => [...shX.bankedKeys(r)]));
const oldKey = (f, t, x) => `${f}\t${t}\t${String(x).slice(0, 120)}`;
const oldBank = new Set(regs.flatMap((r) => Object.entries(r.arm1).flatMap(([f, rows]) => rows.map((x) => oldKey(f, x[0], x[2])))));
const freshNew = hits.filter((h) => !newBank.has(shX.hitKey(h.file, h.thing, h.text)));
const freshOld = hits.filter((h) => !oldBank.has(oldKey(h.file, h.thing, h.text)));
const newOnly = freshNew.filter((h) => oldBank.has(oldKey(h.file, h.thing, h.text)));
console.log(JSON.stringify({ lane, freshNew: freshNew.length, freshOld: freshOld.length, newKeyOnly: newOnly.length, newOnlyFiles: [...new Set(newOnly.map((h) => h.file))] }));
