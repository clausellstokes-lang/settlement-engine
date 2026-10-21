import { ESLint } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/node_modules/eslint/lib/api.js';
const cwd = process.argv[2]; const files = process.argv.slice(3);
const eslint = new ESLint({ cwd, overrideConfigFile: true, overrideConfig: { languageOptions: { ecmaVersion: 'latest', sourceType: 'module' }, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } } });
for (const f of files) { const [r] = await eslint.lintFiles([f]); const m = r.messages.find(x => x.ruleId === 'max-lines'); console.log((m ? m.message.match(/\((\d+)\)/)?.[1] : '?'), f); }
