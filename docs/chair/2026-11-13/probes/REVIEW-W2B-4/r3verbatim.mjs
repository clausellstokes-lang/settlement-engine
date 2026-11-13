// R3: is the fixture's every row the third read's shape, verbatim (name and source), and nothing else?
import fs from 'node:fs';
const probe = fs.readFileSync(process.argv[2], 'utf8');
const fx = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const SHAPES = eval('({' + probe.split('const SHAPES = {')[1].split('\n};')[0] + '\n})');
const names = Object.keys(SHAPES);
let ok = 0, bad = [];
for (const r of fx.rows) { if (SHAPES[r.shape] === r.source) ok++; else bad.push(r.shape); }
console.log('probe shapes', names.length, 'fixture rows', fx.rows.length, 'verbatim', ok, 'mismatch', JSON.stringify(bad),
  'missing from fixture', JSON.stringify(names.filter((n) => !fx.rows.some((r) => r.shape === n))));
