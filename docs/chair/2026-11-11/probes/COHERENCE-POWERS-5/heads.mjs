// heads.mjs <tree> <corpus> — the DM block's title over its names, as the tree prints it
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline'; import path from 'node:path';
const [tree, src] = process.argv.slice(2); const R = path.resolve(tree) + '/src';
const { dmPowerViewOf } = await import(R + '/domain/people/patronage.js');
const L = await import(R + '/data/people/dmPowerLines.js');
const C = {};
for await (const l of readline.createInterface({ input: fs.createReadStream(src).pipe(zlib.createGunzip()) })) { if (!l) continue; const { s } = JSON.parse(l);
  const v = dmPowerViewOf(s); if (!v) { C.noBlock = (C.noBlock || 0) + 1; continue; }
  const n = v.rulingThree.length; const head = L.rulingHeadOf ? L.rulingHeadOf(n, v.ruler) : `The ruling three of ${v.ruler}`;
  const k = `${n} names: ${head.replace(v.ruler, 'X')}`; C[k] = (C[k] || 0) + 1;
  if (/^The ruling three of/.test(head) && n < 3) C['MISS three over fewer'] = (C['MISS three over fewer'] || 0) + 1; }
console.log(C);
