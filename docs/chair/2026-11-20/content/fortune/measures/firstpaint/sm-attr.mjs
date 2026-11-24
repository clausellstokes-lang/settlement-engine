// bytes of each first-paint chunk attributed to its source files by the chunk's sourcemap; A vs B by source
// usage: node sm-attr.mjs <distA> <distB>
import { readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/settlement-engine/package.json');
const { SourceMapConsumer } = require('source-map-js');
const closure = (dist) => {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  const stack = [...html.matchAll(/<script[^>]*type="module"[^>]*src="\/?([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  while (stack.length) {
    const rel = stack.pop(); if (seen.has(rel)) continue;
    const p = join(dist, rel); if (!existsSync(p)) continue; seen.add(rel);
    const src = readFileSync(p, 'utf8');
    for (const m of src.matchAll(/(?:^|[;}\s])import\s*(?:[\w*{}\s,$]+from\s*)?["']\.\/([^"']+\.js)["']/g)) stack.push(join('assets', m[1]));
  }
  return [...seen];
};
const attr = (dist) => {
  const out = new Map();
  for (const rel of closure(dist)) {
    const code = readFileSync(join(dist, rel), 'utf8').replace(/\n\/\/# sourceMappingURL=.*$/, '');
    const lines = code.split('\n');
    const chunk = basename(rel).replace(/-[\w-]{8}\.js$/, '');
    const map = new SourceMapConsumer(JSON.parse(readFileSync(join(dist, rel + '.map'), 'utf8')));
    const segs = [];
    map.eachMapping((m) => segs.push(m), null, SourceMapConsumer.GENERATED_ORDER);
    let counted = 0;
    for (let i = 0; i < segs.length; i += 1) {
      const s = segs[i], n = segs[i + 1];
      const line = lines[s.generatedLine - 1] ?? '';
      const end = n && n.generatedLine === s.generatedLine ? n.generatedColumn : line.length;
      const bytes = Buffer.byteLength(line.slice(s.generatedColumn, end));
      const key = `${chunk} :: ${(s.source ?? '(none)').replace(/^.*?\/(src|node_modules)\//, '$1/')}`;
      out.set(key, (out.get(key) ?? 0) + bytes); counted += bytes;
    }
    const total = Buffer.byteLength(code);
    out.set(`${chunk} :: (unmapped)`, (out.get(`${chunk} :: (unmapped)`) ?? 0) + total - counted);
  }
  return out;
};
const [a, b] = process.argv.slice(2).map(attr);
const rows = [...new Set([...a.keys(), ...b.keys()])].map((k) => [k, a.get(k) ?? 0, b.get(k) ?? 0]).map((r) => [...r, r[2] - r[1]]).filter((r) => r[3] !== 0).sort((p, q) => Math.abs(q[3]) - Math.abs(p[3]));
const tot = (m) => [...m.values()].reduce((x, y) => x + y, 0);
console.log(`total A ${tot(a)} B ${tot(b)} delta ${tot(b) - tot(a)}`);
for (const r of rows.slice(0, 60)) console.log(r.join('\t'));
