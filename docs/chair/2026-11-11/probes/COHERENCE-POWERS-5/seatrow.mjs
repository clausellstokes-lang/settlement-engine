// seatrow.mjs <tree> <corpus> — the seat row's phrase (rulingChainOf) doubling an office word, and the vacancies' keeper words
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline'; import path from 'node:path';
const [tree, src] = process.argv.slice(2); const R = path.resolve(tree) + '/src';
const { rulingChainOf } = await import(R + '/domain/dossier/powerStrata.js');
const { dmPowerViewOf } = await import(R + '/domain/people/patronage.js');
const dbl = (w) => { const m = String(w).match(/^(the .+?) and (.+)$/); return !!m && m[1].toLowerCase().split(/[\s-]+/).pop() === m[2].toLowerCase().split(/\s+/).pop(); };
const C = { doubled: 0, vacancies: 0, keeperTwoTitles: 0 };
for await (const l of readline.createInterface({ input: fs.createReadStream(src).pipe(zlib.createGunzip()) })) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const ch = rulingChainOf(s); if (ch.npc && dbl(ch.npc.role)) C.doubled++;
  if (ch.absence?.kind === 'missing_seat' && /keeps the seat/.test(ch.absence.line)) { C.vacancies++; const v = dmPowerViewOf(s); const st = v?.rulingThree.find((f) => f.rank === 'steward');
    const label = st ? (st.place || 'Steward') : null; if (label && !ch.absence.line.includes(`${label} ${st.name}`)) { C.keeperTwoTitles++; if (C.keeperTwoTitles < 4) console.log(seed, label, '|', ch.absence.line.slice(0, 140)); } } }
console.log(C);
