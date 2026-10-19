// R4 probe: eslint's own max-lines count (skipBlankLines+skipComments) for files in the worktree.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const W = process.argv[2];
const require = createRequire(W + '/package.json');
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'flat' });
const base = JSON.parse(readFileSync(W + '/scripts/.size-baseline.json', 'utf8'));
for (const rel of process.argv.slice(3)) {
  const code = readFileSync(W + '/' + rel, 'utf8');
  const msgs = linter.verify(code, [{ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } }, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } }], rel);
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  const fatal = msgs.find((x) => x.fatal);
  const n = m ? Number(/\((\d+)\)/.exec(m.message)?.[1]) : (fatal ? 'PARSE:' + fatal.message : 1);
  const b = base[rel] ?? (base.files && base.files[rel]);
  console.log(String(n).padStart(5), (b != null ? ('baseline=' + JSON.stringify(b)) : '').padEnd(16), rel);
}
