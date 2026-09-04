import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const DOCK = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree/';
const require = createRequire(DOCK + 'package.json');
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'flat' });
const LANG = { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } };
function eff(p) {
  const code = readFileSync(p, 'utf8');
  const msgs = linter.verify(code, { languageOptions: LANG, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } });
  const fatal = msgs.find((m) => m.fatal);
  if (fatal) throw new Error(`parse error ${p}: ${fatal.message}`);
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  return m ? Number(String(m.message).match(/\((\d+)\)/)[1]) : 1;
}
for (const p of process.argv.slice(2)) console.log(eff(p), p);
