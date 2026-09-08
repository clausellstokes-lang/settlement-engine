import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/package.json');
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'flat' });
const LANG = { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } };
function eff(p){
  const code = readFileSync(p,'utf8');
  const msgs = linter.verify(code,{languageOptions:LANG,rules:{'max-lines':['error',{max:1,skipBlankLines:true,skipComments:true}]}});
  const f = msgs.find(m=>m.fatal); if(f) return 'PARSE '+f.message;
  const m = msgs.find(x=>x.ruleId==='max-lines');
  return m ? Number(String(m.message).match(/\((\d+)\)/)[1]) : 1;
}
const base='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR/src/domain/prose/';
for (const f of ['entryGround.js','entryLexicons.js','entryWalker.js','grammarWalker.js','moveGrammar.js','plantLedger.js','presenceMeasure.js','proseFingerprint.js'])
  console.log(f, eff(base+f), '(domain ceiling 800)');
const b6='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/src/domain/display/stateProse/';
for (const f of ['stateProseKernel.js','defenseStateProse.js','generalStateProse.js','economyStateProse.js','powerStateProse.js','warFaithStateProse.js','stressorsStateProse.js','legibilityRung.js'])
  console.log(f, eff(b6+f), '(domain ceiling 800)');
