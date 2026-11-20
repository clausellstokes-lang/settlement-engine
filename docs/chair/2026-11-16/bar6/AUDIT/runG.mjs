// BAR6-AUDIT-G · THE RUNNER FOR THE CHAIR.
//   node docs/chair/2026-11-16/bar6/AUDIT/runG.mjs <PAGE-COPY render dir> <out.json> [tree-root]
// Seat G's law is STATIC (the presumptions in the pools, not the instances on pages), so the runner reads the TREE
// (default: the checkout this file stands in) and uses the render only to say which lines print and to measure the
// default-deny design on that render's own towns. It runs, each to a file beside <out.json>:
//   law5w-inventory-g.mjs  <out>.inventory.json   every class-word line, its classes and its status a class
//   tables-g.mjs           <out>.tables.md        the stock by class, by file, by BAR5 seat; fifty lines to judge
//   defaultDeny-g.mjs      <out>.deny.json        the four scene groups, static and measured (needs the shapes
//                                                 hamlet-under_siege, village-famine, thorp-calm in the render)
// and writes <out.json>: { tree, render, byClass, distinct, printingFiles, mute }. Prints the class table.
// Every stage's own exit is read; a failed stage exits non-zero.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const [renderArg, outArg, treeArg] = process.argv.slice(2);
if (!renderArg || !outArg) { console.error('usage: runG.mjs <render-dir> <out.json> [tree-root]'); process.exit(2); }
const HERE = path.dirname(new URL(import.meta.url).pathname);
const TREE = path.resolve(treeArg || path.join(HERE, '../../../../..'));
const RENDER = path.resolve(renderArg); const OUT = path.resolve(outArg); const base = OUT.replace(/\.json$/, '');
const run = (script, args) => { const r = spawnSync(process.execPath, [path.join(HERE, script), ...args], { encoding: 'utf8', maxBuffer: 1e8 });
  if (r.status !== 0) { console.error(`runG: ${script} FAILED (exit ${r.status})\n${(r.stderr || '').slice(-2000)}`); process.exit(1); } return r.stdout; };
const invOut = run('law5w-inventory-g.mjs', [TREE, `${base}.inventory.json`, '--render', RENDER]);
run('tables-g.mjs', [`${base}.inventory.json`, `${base}.tables.md`, '616']);
const hasShapes = fs.readdirSync(path.join(RENDER, 'dumps')).some((f) => /-(hamlet-under_siege|village-famine|thorp-calm)-/.test(f));
const denyOut = hasShapes ? run('defaultDeny-g.mjs', [TREE, RENDER, `${base}.deny.json`]) : '(no town of the three shapes in this render: the measured half not run)';
const H = JSON.parse(fs.readFileSync(`${base}.inventory.json`, 'utf8'));
const DECLARED = new Set(['declared', 'twin', 'scoped', 'gate', 'keyed', 'bound']);
const byClass = {};
for (const h of H) for (const c of h.classes) { const v = byClass[c] || (byClass[c] = { lines: 0, stock: 0, stockPrinted: 0 }); v.lines++; if (!DECLARED.has(h.status[c])) { v.stock++; if (h.printed > 0) v.stockPrinted++; } }
const printingFiles = new Set(H.filter((h) => h.printed > 0).map((h) => h.file));
const und = H.filter((h) => h.classes.some((c) => !DECLARED.has(h.status[c])));
const mute = hasShapes && fs.existsSync(`${base}.deny.mute.json`) ? JSON.parse(fs.readFileSync(`${base}.deny.mute.json`, 'utf8')) : null;
fs.writeFileSync(OUT, JSON.stringify({ tree: TREE, render: RENDER, byClass, distinct: { lines: H.length, undeclared: und.length, undeclaredInPrintingFiles: und.filter((h) => printingFiles.has(h.file)).length, undeclaredSeenPrinted: und.filter((h) => h.printed > 0).length }, printingFiles: printingFiles.size, mute }, null, 1));
process.stdout.write(invOut + '\n' + denyOut.split('\n').filter((l) => /^(THE |group|SENSORY|AMBIENT|ARRIVAL|DAILY|--|   )/.test(l)).join('\n') + '\n');
console.log(`runG: wrote ${OUT} and ${base}.{inventory.json,tables.md${hasShapes ? ',deny.json,deny.mute.json' : ''}}`);
