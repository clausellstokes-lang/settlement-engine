// eslint's own max-lines rule (skipBlankLines+skipComments) via the Linter class, from the worktree's node_modules
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963';
const require = createRequire(`${M}/package.json`);
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'flat' });
for (const f of process.argv.slice(2)) {
  const src = readFileSync(`${M}/${f}`, 'utf8');
  const msgs = linter.verify(src, [{ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } }, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } }]);
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  const eff = m ? (m.message.match(/\((\d+)\)/) || [])[1] : (msgs[0] ? 'ERR ' + msgs[0].message : '<=1');
  console.log(`${f} raw=${src.split('\n').length} eff=${eff}`);
}
