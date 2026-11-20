// FORTUNE U5 instrument: a COPY of a checkout with the ruled rule (`tree.mjs` mode `proto`) and U5's patches
// (`u5-rule.mjs`) on top. It writes nothing in the checkout it copies. Every patch must match exactly once.
//   node u5-tree.mjs <checkout> <out-dir>        (the knobs of u5-rule.mjs are read from the environment)
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { U5_PATCHES } from './u5-rule.mjs';

const [, , line, outArg] = process.argv;
if (!line || !outArg) throw new Error('usage: node u5-tree.mjs <checkout> <out>');
const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(outArg);
execFileSync('node', [join(here, 'tree.mjs'), line, out, 'proto'], { stdio: 'inherit' });
for (const p of U5_PATCHES) {
  const f = join(out, p.file);
  const src = readFileSync(f, 'utf8');
  const n = src.split(p.find).length - 1;
  if (n !== 1) throw new Error(`patch ${p.id}: ${n} matches in ${p.file}`);
  writeFileSync(f, src.replace(p.find, () => p.replace));
}
console.log(`u5 tree ${out}: ${U5_PATCHES.map((p) => p.id).join(', ')} (U5_SAFETY=${process.env.U5_SAFETY ?? 'offset'} U5_POINTS=${process.env.U5_POINTS ?? 10} U5_WINDOW=${process.env.U5_WINDOW ?? 40} U5_MERITS=${process.env.U5_MERITS ?? 'principled,weathered'} U5_GATE=${process.env.U5_GATE ?? 45})`);
