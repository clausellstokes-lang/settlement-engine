import { readFileSync } from 'node:fs';
const { Linter } = await import('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree/node_modules/eslint/lib/index.js');
const linter = new Linter({ configType: 'flat' });
const LANG = { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } };
function eff(p) {
  const msgs = linter.verify(readFileSync(p, 'utf8'), { languageOptions: LANG, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } });
  const f = msgs.find((m) => m.fatal); if (f) throw new Error(`${p}: ${f.message}`);
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  return m ? Number(String(m.message).match(/\((\d+)\)/)[1]) : 1;
}
for (const [label, p] of process.argv.slice(2).map((s) => s.split('='))) console.log(label.padEnd(30), eff(p));
