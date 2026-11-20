// GOALS-3 builder 9 (scratch, docs only): THE MIRROR COUNT, ATTRIBUTED. Runs the lane's `../measures/goals-final.mjs` with one
// change made to a COPY of its text (written into <workdir>, never over the original): each town's mirrored holdings are
// also printed with their template key (fam/kind/vantage#i, reserve after the cell's lines; an appended line after both),
// so a change in the `mirror` column can be read line by line. Run over the tree with the appended lines in memory
// (wants-hooks.mjs). Usage: node wants-mirrors.mjs <tree> <append.json | none> <workdir> [n=50]
import fs from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
const [, , L, APP, WORK, nA = '50'] = process.argv;
const here = path.dirname(new URL(import.meta.url).pathname);
const append = APP && APP !== 'none' ? JSON.parse(fs.readFileSync(APP, 'utf8')) : {};
register(pathToFileURL(path.join(here, 'wants-hooks.mjs')).href, { data: { append } });
const src = fs.readFileSync(path.join(here, '../measures/goals-final.mjs'), 'utf8');
const from = 'for (const o of mir.values()) R.mirror += o.size - 1;';
if (!src.includes(from)) throw new Error('goals-final.mjs: the mirror line not found');
const keys = new Map();
globalThis.__WANTS_MIRROR = (k) => keys.set(k, (keys.get(k) || 0) + 1);
const patched = src.replace(from, 'for (const [mk, o] of mir) { R.mirror += o.size - 1; for (let q = 1; q < o.size; q++) globalThis.__WANTS_MIRROR(mk.split("|")[0]); }');
fs.mkdirSync(WORK, { recursive: true });
const copy = path.join(WORK, 'goals-final.mirrors.mjs'); fs.writeFileSync(copy, patched);
process.argv = [process.argv[0], copy, L, nA];
await import(pathToFileURL(copy).href); // prints goals-final's own table
const total = [...keys.values()].reduce((a, b) => a + b, 0);
console.log(`append ${APP}; mirror ${total} (the table's TOTAL mirror column), by template:`);
for (const [k, n] of [...keys].sort()) console.log(`  ${k.padEnd(36)} ${n}`);
