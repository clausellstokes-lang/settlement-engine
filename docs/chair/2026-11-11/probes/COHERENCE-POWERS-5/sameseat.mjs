// sameseat.mjs <tree> <a.gz> <b.gz> — the seat's person (rulingChainOf) and the governing first, paired line by line
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline'; import path from 'node:path';
const [tree, A, B] = process.argv.slice(2); const { rulingChainOf } = await import(path.resolve(tree) + '/src/domain/dossier/powerStrata.js');
const it = (f) => readline.createInterface({ input: fs.createReadStream(f).pipe(zlib.createGunzip()) })[Symbol.asyncIterator]();
const a = it(A), b = it(B); let n = 0, diff = 0; const ex = [];
for (;;) { const [x, y] = await Promise.all([a.next(), b.next()]); if (x.done || y.done) break; const p = JSON.parse(x.value), q = JSON.parse(y.value); n++;
  const sa = rulingChainOf(p.rec).npc?.name ?? null, sb = rulingChainOf(q.rec).npc?.name ?? null; if (sa !== sb) { diff++; ex.length < 4 && ex.push(`${p.key}: ${sa} -> ${sb}`); } }
console.log({ n, diff }, ex);
