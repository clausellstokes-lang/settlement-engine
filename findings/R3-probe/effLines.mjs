// Effective line count (eslint max-lines, skipBlankLines+skipComments) for files in the master worktree.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const M = process.argv[2];
const require = createRequire(M + '/package.json');
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'flat' });
const base = JSON.parse(readFileSync(M + '/scripts/.size-baseline.json', 'utf8'));
for (const f of process.argv.slice(3)) {
  const src = readFileSync(M + '/' + f, 'utf8');
  const isJsx = f.endsWith('.jsx');
  const msgs = linter.verify(src, [{ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } }, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } }], f);
  const m = msgs.map(x => x.message).join(' ');
  const n = (m.match(/\((\d+)\)/) || [])[1] || m;
  console.log(`${n}\t${base[f] ? 'baseline=' + base[f] : ''}\t${f}`);
}
