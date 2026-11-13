// REVIEW-W2B-3 item 8: one lane's forecast, by my own count. <merged-root> = git merge-tree of this lane's 8bb923678
// with the other lane's tip, archived, THIS lane's two registers overlaid. Fresh hits of arm 1 under the NEW key (the
// whole literal's hash) and under the OLD key (file, thing, the first 120 characters, read from each row's label).
//   node forecastone.mjs <merged-root>
import { readFileSync } from 'node:fs'; import { join } from 'node:path';
const M = process.argv[2];
const sh = await import(join(M, 'tests/lint/presumedThings.shared.mjs'));
const regs = ['tests/lint/presumedThings.register.json', 'tests/lint/presumedThings.widened.register.json'].map((r) => JSON.parse(readFileSync(join(M, r), 'utf8')));
const newKeys = new Set(regs.flatMap((r) => [...sh.bankedKeys(r)]));
const oldKeys = new Set(regs.flatMap((r) => Object.entries(r.arm1).flatMap(([f, rows]) => rows.map((x) => `${f}\t${x[0]}\t${String(x[2]).slice(0, 120)}`))));
const hits = sh.scanTree(M);
const freshNew = hits.filter((h) => !newKeys.has(sh.hitKey(h.file, h.thing, h.text)));
const freshOld = hits.filter((h) => !oldKeys.has(`${h.file}\t${h.thing}\t${String(h.text).slice(0, 120)}`));
const newOnly = freshNew.filter((h) => !freshOld.includes(h));
console.log(JSON.stringify({ hits: hits.length, freshNewKey: freshNew.length, freshOldKey: freshOld.length, newKeyOnly: newOnly.length, oldKeyOnly: freshOld.filter((h) => !freshNew.includes(h)).length }));
for (const h of newOnly) console.log('  new key only:', h.file, '::', h.thing, '::', String(h.text).slice(100, 220));
