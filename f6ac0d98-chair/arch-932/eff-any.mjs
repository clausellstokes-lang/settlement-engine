import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const ROOT = process.argv[2];
const require = createRequire(join(ROOT, 'package.json'));
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'flat' });
const LANG = { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } };
function eff(p) {
  const code = readFileSync(join(ROOT, p), 'utf8');
  const msgs = linter.verify(code, { languageOptions: LANG, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } });
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  return m ? Number(String(m.message).match(/\((\d+)\)/)[1]) : 1;
}
for (const p of process.argv.slice(3)) { try { console.log(String(eff(p)).padStart(5), p); } catch (e) { console.log('MISSING', p); } }
