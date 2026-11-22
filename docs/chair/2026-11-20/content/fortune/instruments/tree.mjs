// FORTUNE-1 instrument: a COPY of a checkout with the fortune trace (mode `trace`), the trace and the prototype
// fortune rule (mode `fortune`, FS1 alone), or both prototype rules (mode `proto`, FS1 and FS2) patched in. It writes nothing in the checkout it copies.
//   node tree.mjs <checkout> <out-dir> <trace|fortune|proto>
// Every patch must match exactly once, or the copy is refused.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, symlinkSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { PATCHES } from './rule.mjs';

const [, , line, outArg, mode = 'trace'] = process.argv;
if (!line || !outArg || !['trace', 'fortune', 'proto'].includes(mode)) throw new Error('usage: node tree.mjs <checkout> <out> <trace|fortune|proto>');
const out = resolve(outArg);
if (existsSync(out)) rmSync(out, { recursive: true, force: true });
execFileSync('mkdir', ['-p', out]);
for (const d of ['src', 'tests', 'package.json', 'schema', 'vendor']) {
  if (existsSync(join(line, d))) execFileSync('cp', ['-r', join(line, d), out]);
}
symlinkSync(resolve(line, 'node_modules'), join(out, 'node_modules'));
for (const p of PATCHES.filter((x) => x.modes.includes(mode))) {
  const f = join(out, p.file);
  const src = readFileSync(f, 'utf8');
  const n = src.split(p.find).length - 1;
  if (n !== 1) throw new Error(`patch ${p.id}: ${n} matches in ${p.file}`);
  writeFileSync(f, src.replace(p.find, () => p.replace));
}
console.log(`tree ${out} (${mode}): ${PATCHES.filter((x) => x.modes.includes(mode)).map((p) => p.id).join(', ')}`);
