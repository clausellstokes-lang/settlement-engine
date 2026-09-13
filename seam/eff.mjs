import { readFileSync } from 'node:fs';
import { Linter } from 'eslint';
const linter = new Linter({ configType: 'flat' });
const LANG = { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } };
for (const abs of process.argv.slice(2)) {
  const code = readFileSync(abs, 'utf8');
  const msgs = linter.verify(code, { languageOptions: LANG, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } });
  const fatal = msgs.find((m) => m.fatal);
  if (fatal) { console.log(`${abs} PARSE ERROR ${fatal.message}`); continue; }
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  const n = m ? Number(String(m.message).match(/\((\d+)\)/)[1]) : 1;
  const ceiling = /\.jsx$/.test(abs) ? 600 : 800;
  console.log(`${abs.split('/').slice(-1)[0].padEnd(34)} effective ${String(n).padStart(4)}   headroom to ${ceiling}: ${ceiling - n}`);
}
