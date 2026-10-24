// Effective lines = eslint's own max-lines (skipBlankLines, skipComments), JSX enabled.
// Same counter as effLines.mjs; eslint resolved from the code of record, files by absolute path.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const M = process.argv[2];
const require = createRequire(M + '/package.json');
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'flat' });
for (const f of process.argv.slice(3)) {
  const src = fs.readFileSync(f, 'utf8');
  const msgs = linter.verify(src, [{ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } }, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } }]);
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  const n = m ? (m.message.match(/\((\d+)\)/) || [])[1] : (msgs[0] ? 'ERR ' + msgs[0].message : '<=1');
  const fatal = msgs.find((x) => x.fatal);
  console.log(String(n).padStart(5), f.replace(/.*\/proto\//, 'proto/'), fatal ? 'PARSE-ERR ' + fatal.message : '');
}
