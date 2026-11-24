// Attribute a bundle's UTF-8 bytes to its sources via its sourcemap. Usage: node smattr.mjs <root> <bundle.js> <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const [root, bundle, out] = process.argv.slice(2);
const req = createRequire(`${root}/package.json`);
const { decode } = req('@jridgewell/sourcemap-codec');
const code = readFileSync(bundle, 'utf8');
const map = JSON.parse(readFileSync(`${bundle}.map`, 'utf8'));
const lines = code.split('\n'); const dec = decode(map.mappings);
const by = {}; const add = (k, n) => { by[k] = (by[k] || 0) + n; };
const norm = (s) => s.replace(/^(\.\.\/)+/, '').replace(/^.*?node_modules\//, 'node_modules/');
lines.forEach((line, i) => {
  const segs = (dec[i] || []).slice().sort((a, b) => a[0] - b[0]);
  if (i < lines.length - 1) add('(newlines)', 1);
  if (!segs.length) { add('(unmapped)', Buffer.byteLength(line)); return; }
  if (segs[0][0] > 0) add('(unmapped)', Buffer.byteLength(line.slice(0, segs[0][0])));
  segs.forEach((s, j) => { const end = j + 1 < segs.length ? segs[j + 1][0] : line.length; const n = Buffer.byteLength(line.slice(s[0], end)); add(s.length > 1 ? norm(map.sources[s[1]]) : '(unmapped)', n); });
});
const total = Object.values(by).reduce((a, b) => a + b, 0);
writeFileSync(out, JSON.stringify({ bundle, bytes: Buffer.byteLength(code), attributed: total, by }, null, 1));
console.log(bundle.split('/').pop(), Buffer.byteLength(code), total);
