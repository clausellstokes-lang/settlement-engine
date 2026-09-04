import { readFileSync } from 'node:fs';
for (const f of process.argv.slice(2)) {
  const src = readFileSync(f, 'utf8');
  // strip block comments, then line comments, then count non-blank lines (eslint max-lines skipBlankLines+skipComments approximation)
  const noBlock = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.split('\n').map(() => '').join('\n'));
  const lines = noBlock.split('\n');
  let n = 0;
  for (const l of lines) { const t = l.trim(); if (t === '' || t.startsWith('//')) continue; n++; }
  console.log(f.split('/').pop(), 'raw', lines.length, 'effective', n);
}
