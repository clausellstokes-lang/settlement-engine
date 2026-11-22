// one bundle's bytes by source, A vs B: node sm-file.mjs <fileA.js> <fileB.js>
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/settlement-engine/package.json');
const { SourceMapConsumer } = require('source-map-js');
const attr = (f) => {
  const code = readFileSync(f, 'utf8').replace(/\n\/\/# sourceMappingURL=.*$/, ''); const lines = code.split('\n');
  const map = new SourceMapConsumer(JSON.parse(readFileSync(f + '.map', 'utf8')));
  const segs = []; map.eachMapping((m) => segs.push(m), null, SourceMapConsumer.GENERATED_ORDER);
  const out = new Map(); let c = 0;
  for (let i = 0; i < segs.length; i += 1) { const s = segs[i], n = segs[i + 1]; const line = lines[s.generatedLine - 1] ?? '';
    const end = n && n.generatedLine === s.generatedLine ? n.generatedColumn : line.length; const b = Buffer.byteLength(line.slice(s.generatedColumn, end));
    const k = (s.source ?? '(none)').replace(/^.*?\/(src|node_modules)\//, '$1/'); out.set(k, (out.get(k) ?? 0) + b); c += b; }
  out.set('(unmapped)', Buffer.byteLength(code) - c); return out; };
const [a, b] = process.argv.slice(2).map(attr);
const rows = [...new Set([...a.keys(), ...b.keys()])].map((k) => [k, a.get(k) ?? 0, b.get(k) ?? 0]).map((r) => [...r, r[2] - r[1]]).filter((r) => r[3]).sort((x, y) => Math.abs(y[3]) - Math.abs(x[3]));
const t = (m) => [...m.values()].reduce((x, y) => x + y, 0); console.log(`total A ${t(a)} B ${t(b)} delta ${t(b) - t(a)}`);
for (const r of rows.slice(0, 25)) console.log(r.join('\t'));
