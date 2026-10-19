// Effective line count = eslint's own max-lines (skipBlankLines, skipComments).
import { createRequire } from 'node:module';
import fs from 'node:fs';
const M = process.argv[2];
const require = createRequire(M + '/package.json');
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'flat' });
for (const f of process.argv.slice(3)) {
  const src = fs.readFileSync(M + '/' + f, 'utf8');
  const msgs = linter.verify(src, [{ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' }, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } }]);
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  const n = m ? (m.message.match(/\((\d+)\)/) || [])[1] : (msgs[0] ? 'ERR ' + msgs[0].message : '<=1');
  console.log(String(n).padStart(5), f);
}
