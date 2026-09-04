// Read-only measurement mirroring tests/lint/sizeBaseline.test.js's effectiveLines().
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const T='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const { Linter } = await import(join(T,'node_modules/eslint/lib/api.js'));
const linter = new Linter({ configType:'flat' });
const LANG={ecmaVersion:'latest',sourceType:'module',parserOptions:{ecmaFeatures:{jsx:true}}};
function eff(rel){
  const code=readFileSync(join(T,rel),'utf8');
  const msgs=linter.verify(code,{languageOptions:LANG,rules:{'max-lines':['error',{max:1,skipBlankLines:true,skipComments:true}]}});
  const m=msgs.find(x=>x.ruleId==='max-lines');
  return m?Number(String(m.message).match(/\((\d+)\)/)[1]):1;
}
const files=['src/utils/generateCampaignPDF.js','src/utils/generateWorldBook.js','src/utils/jsPdfText.js','src/pdf/theme.js','src/utils/generateSettlementPDF.js','src/domain/content/customContentCharset.js'];
console.log('file, effectiveLines, layerCeiling, headroom');
for(const f of files){ const n=eff(f); const c=800; console.log(`${f}, ${n}, ${c}, ${c-n}`); }
