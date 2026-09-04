const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree/';
const O = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/o2gate/';
const { extractJsxProseStrings } = await import(D + 'tests/helpers/jsxLiteralWalk.js');
const { readFileSync } = await import('node:fs');
const count = (p) => {
  const strings = extractJsxProseStrings(readFileSync(p, 'utf8'), p);
  let em = 0, bang = 0;
  for (const s of strings) { em += (s.match(/[—–]/g) || []).length; bang += (s.match(/!/g) || []).length; }
  return { em, bang, n: strings.length };
};
for (const [tag, p] of [
  ['EconomicsTab  COMMITTED', O + 'EconomicsTab.HEAD.jsx'],
  ['EconomicsTab  WORKING  ', D + 'src/components/new/tabs/EconomicsTab.jsx'],
  ['OutputCont.   COMMITTED', O + 'OutputContainer.HEAD.jsx'],
  ['OutputCont.   WORKING  ', D + 'src/components/OutputContainer.jsx'],
]) console.log(tag, JSON.stringify(count(p)));
