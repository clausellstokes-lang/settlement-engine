// n5true.mjs <dumps> — the DM block's title against every name row beneath it (to the next block), on rendered pages
import fs from 'node:fs'; import path from 'node:path';
const WANT = { 'The ruling three of': 3, 'The ruling two of': 2, 'Who leads': 1, 'No one stands at the head of': 0 };
const NEXT = /^(Who answers to whom|The fronts|The hall|The boosts|Who hunts whom|== )/;
const C = { blocks: 0, mismatch: 0 }; const ex = [];
for (const f of fs.readdirSync(process.argv[2])) { const L = fs.readFileSync(path.join(process.argv[2], f), 'utf8').split('\n');
  const i = L.findIndex((l) => Object.keys(WANT).some((w) => l.startsWith(w))); if (i < 0) continue; C.blocks++;
  const want = WANT[Object.keys(WANT).find((w) => L[i].startsWith(w))];
  let n = 0; for (let j = i + 1; j < L.length && !NEXT.test(L[j]); j++) if (/^[A-Z][^·]{0,60} · \S/.test(L[j]) && !/[.:]$/.test(L[j].split(' · ')[0])) n++;
  if (n !== want) { C.mismatch++; ex.length < 5 && ex.push(`${f}: ${L[i]} over ${n}`); } }
console.log(C, ex);
