import { ESLint } from 'eslint';
const files = process.argv.slice(2).filter((a) => a.endsWith('.js'));
const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: [{ files: ['**/*.js'], languageOptions: { ecmaVersion: 'latest', sourceType: 'module' }, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } }],
});
for (const f of files) {
  const [res] = await eslint.lintFiles([f]);
  const msg = (res.messages || []).find((m) => m.ruleId === 'max-lines');
  const n = msg ? Number((String(msg.message).match(/(\d+)/) || [0,0])[1]) : 1;
  console.log(`${n}\t${f}`);
}
