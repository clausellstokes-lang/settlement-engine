// BAR5-AUDIT-B: each instance's false line traced to its WRITER file with PAGE-COPY's own tracer (writers2.mjs),
// and the `against` line traced the same way (the file that holds the fact the false line should have read).
//   node traceB.mjs <instances.json> <census-out> <tree> <PAGE-COPY dir> <scratch-dir>
// Writes <instances>.traced.json (each instance with `writer` and `factWriter`).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const [instPath, censusOut, tree, pageCopy, scratch] = process.argv.slice(2);
if (!scratch) { console.error('usage: traceB.mjs <instances.json> <census-out> <tree> <PAGE-COPY> <scratch>'); process.exit(2); }
const inst = JSON.parse(fs.readFileSync(instPath, 'utf8'));
fs.mkdirSync(scratch, { recursive: true });
const corpus = path.join(scratch, 'corpus.ndjson.gz');
if (!fs.existsSync(corpus)) fs.symlinkSync(path.resolve(censusOut, 'corpus.ndjson.gz'), corpus);
const hits = [];
for (const [k, x] of inst.entries()) {
  hits.push({ k, side: 'line', seed: x.town, view: x.tab, line: x.line, why: '', pattern: x.rule, norm: x.line });
  if (x.against && x.against.tab !== 'record') hits.push({ k, side: 'against', seed: x.town, view: x.against.tab, line: x.against.line.split(' | ')[0].split(' / ').pop(), why: '', pattern: x.rule + '#against', norm: x.against.line });
}
fs.writeFileSync(path.join(scratch, 'hits.json'), JSON.stringify(hits));
execFileSync('node', [path.join(pageCopy, 'writers2.mjs')], { env: { ...process.env, TREE: path.resolve(tree), OUT: path.resolve(scratch) }, stdio: ['ignore', 'inherit', 'inherit'] });
const back = JSON.parse(fs.readFileSync(path.join(scratch, 'hits.json'), 'utf8'));
for (const h of back) {
  const w = h.writer ? `${h.writer.file}${h.writer.fn ? ' :: ' + h.writer.fn : ''}` : '(untraced)';
  if (h.side === 'line') inst[h.k].writer = w; else inst[h.k].factWriter = w;
}
for (const x of inst) if (!x.factWriter) x.factWriter = x.against?.tab === 'record' ? `record ${x.against.line}` : '(untraced)';
const out = instPath.replace(/\.json$/, '.traced.json');
fs.writeFileSync(out, JSON.stringify(inst, null, 1));
const untraced = inst.filter((x) => x.writer === '(untraced)').length;
console.log(`traced ${inst.length - untraced} of ${inst.length} instances to a writer; ${out}`);
