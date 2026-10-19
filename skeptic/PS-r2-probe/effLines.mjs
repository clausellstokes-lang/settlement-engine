// R2 probe: eslint's own max-lines effective count (skipBlankLines + skipComments) for named hosts.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const W = process.argv[2];
const require = createRequire(`${W}/package.json`);
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'flat' });
const baseline = JSON.parse(readFileSync(`${W}/scripts/.size-baseline.json`, 'utf8').toString() || '{}');
for (const rel of process.argv.slice(3)) {
  const code = readFileSync(`${W}/${rel}`, 'utf8');
  const msgs = linter.verify(code, [{ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } }], rel);
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  const n = m ? Number(/\((\d+)\)/.exec(m.message)?.[1]) : 1;
  console.log(`${rel}\t${n}\tbaseline=${baseline[rel] ?? '-'}`);
}
