// Lane probe: for every census read path, the producer citations of its tokens.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { astTokens } from '../laneSEAM/scripts/wiring-census.mjs';

const ROOT = process.argv[2];
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) { walk(abs); continue; }
    if (abs.endsWith('.js')) files.push(abs);
  }
};
walk(join(ROOT, 'src/generators'));
walk(join(ROOT, 'src/domain'));
/** @type {Map<string, Array<string>>} */
const cites = new Map();
for (const abs of files) {
  const rel = relative(ROOT, abs);
  const { writes, parsed } = astTokens(readFileSync(abs, 'utf8'));
  if (!parsed) continue;
  for (const w of writes) {
    if (!cites.has(w.name)) cites.set(w.name, []);
    cites.get(w.name).push(`${rel}:${w.line}`);
  }
}
const census = JSON.parse(readFileSync(join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
const paths = new Set();
for (const r of census.rows) for (const p of (r.reads || [])) paths.add(p);
const want = process.argv[3] ? new RegExp(process.argv[3]) : null;
for (const p of [...paths].sort()) {
  if (want && !want.test(p)) continue;
  const tokens = [...new Set(String(p).split(/[^A-Za-z_$0-9]+/).filter(Boolean))];
  const line = tokens.map((t) => {
    const list = cites.get(t) || [];
    return `${t}[${list.length}${list.length ? ' ' + list.slice(0, 2).join(',') : ''}]`;
  }).join('  ');
  console.log(p.padEnd(58) + ' :: ' + line);
}
