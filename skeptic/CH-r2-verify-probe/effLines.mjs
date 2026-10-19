// Effective lines: non-blank lines after stripping block and line comments (string-unaware approximation).
import { readFileSync } from 'node:fs';
const root = process.argv[2];
const files = process.argv.slice(3);
for (const f of files) {
  let src = readFileSync(root + '/' + f, 'utf8');
  src = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ''));
  const lines = src.split('\n').map((l) => l.replace(/(^|[^:'"`])\/\/.*$/, '$1')).filter((l) => l.trim() !== '');
  console.log(String(lines.length).padStart(5), f);
}
