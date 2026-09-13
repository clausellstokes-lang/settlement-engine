import { readFileSync } from 'node:fs';
const { Linter } = await import('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/node_modules/eslint/lib/linter/index.js');
const ROOT='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/';
const linter = new Linter({ configType: 'flat' });
const LANG = { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } };
function eff(rel) {
  const code = readFileSync(ROOT+rel,'utf8');
  const msgs = linter.verify(code,{languageOptions:LANG,rules:{'max-lines':['error',{max:1,skipBlankLines:true,skipComments:true}]}});
  const f=msgs.find(m=>m.fatal); if(f) throw new Error(rel+': '+f.message);
  const m=msgs.find(x=>x.ruleId==='max-lines');
  return m?Number(String(m.message).match(/\((\d+)\)/)[1]):1;
}
const rows=[
 ['stressors','src/domain/display/stateProse/stressorsStateProse.js',800],
 ['economy','src/domain/display/stateProse/economyStateProse.js',800],
 ['warFaith','src/domain/display/stateProse/warFaithStateProse.js',800],
 ['power','src/domain/display/stateProse/powerStateProse.js',800],
 ['defense','src/domain/display/stateProse/defenseStateProse.js',800],
 ['general','src/domain/display/stateProse/generalStateProse.js',800],
 ['composer','src/domain/display/stateProse/composeStateProse.js',800],
 ['kernel','src/domain/display/stateProse/stateProseKernel.js',800],
 ['EconomicsTab','src/components/new/tabs/EconomicsTab.jsx',600],
 ['OverviewTab','src/components/new/tabs/OverviewTab.jsx',600],
];
for(const [n,p,c] of rows){const e=eff(p);console.log(`${n.padEnd(14)} ${String(e).padStart(4)} / ${c}   headroom ${c-e}`);}
for(const d of ['defense','economy','general','power','stressors','warFaith'])
  console.log(`${d}Candidates`.padEnd(22), eff(`src/domain/display/stateProse/${d}StateProseCandidates.js`));
