// node classme.mjs <my redrows.txt> <reader tip redrows (c3913f999)> <reader 9d5d6e091 redrows> <reader 1fb15980d redrows>
// FILE-LEVEL rows compared by file (their message carries paths).
import fs from 'node:fs';
const L = (p) => fs.readFileSync(p, 'utf8').split('\n').filter(Boolean);
const norm = (r) => (r.includes(' › [FILE-LEVEL]') ? r.split(' › ')[0] + ' › [FILE-LEVEL]' : r);
const [mine, tip, a9, a1] = process.argv.slice(2, 6).map((p) => new Set(L(p).map(norm)));
const out = { mine: mine.size, readerAtBase: tip.size, rows: [] };
for (const r of [...mine].sort()) out.rows.push({ row: r, atBase_c3913f999: tip.has(r) ? 'red' : 'GREEN', at9d5d6e091: a9.has(r) ? 'red' : 'green', at1fb15980d: a1.has(r) ? 'red' : 'green' });
const greenAtBase = out.rows.filter((x) => x.atBase_c3913f999 === 'GREEN');
const curedHere = [...tip].filter((r) => !mine.has(r));
console.log(JSON.stringify({ mine: out.mine, readerAtBase: out.readerAtBase, redAtBaseToo: out.rows.length - greenAtBase.length, greenAtBase: greenAtBase.map((x) => x.row), redAtBaseGreenHere: curedHere,
  laneOwn_green9d5d: out.rows.filter((x) => x.at9d5d6e091 === 'green').map((x) => x.row) }, null, 1));
fs.writeFileSync(process.argv[6] || '/dev/null', out.rows.map((x) => `${x.atBase_c3913f999}\t${x.at9d5d6e091}\t${x.at1fb15980d}\t${x.row}`).join('\n') + '\n');
