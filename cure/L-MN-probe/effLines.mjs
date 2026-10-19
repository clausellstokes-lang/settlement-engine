// Effective line count = eslint max-lines with skipBlankLines+skipComments (the repo's own count).
// Usage: node effLines.mjs <masterRoot> <relPath>...
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const [root, ...files] = process.argv.slice(2);
const require = createRequire(path.join(root, 'package.json'));
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'flat' });
for (const f of files) {
  const src = readFileSync(path.join(root, f), 'utf8');
  const msgs = linter.verify(src, [{
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] },
  }], { filename: f });
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  const fatal = msgs.find((x) => x.fatal);
  const n = m ? Number((m.message.match(/\((\d+)\)/) || [])[1]) : (fatal ? `PARSE-ERR ${fatal.message}` : 1);
  console.log(`${n}\t${f}`);
}
