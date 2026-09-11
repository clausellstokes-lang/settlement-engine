// Reuses tests/copy/voiceMechanics.test.js's stringLiteralContents idiom verbatim.
import { readFileSync } from 'node:fs';
import { parse } from '/Users/cstokes/Desktop/settlement-engine/node_modules/espree/espree.js';

function stringLiteralContents(src) {
  const out = [];
  let ast;
  try {
    ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module', range: true });
  } catch (e) { console.error('PARSE FAILED', e.message); process.exit(2); }
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if (!node.type) return;
    if (node.type === 'Literal' && typeof node.value === 'string') out.push(node.value);
    if (node.type === 'TemplateLiteral') {
      for (const q of node.quasis) out.push(String(q.value.cooked ?? q.value.raw));
    }
    for (const k of Object.keys(node)) {
      if (k === 'range' || k === 'loc' || k === 'parent') continue;
      visit(node[k]);
    }
  };
  visit(ast);
  return out;
}

const abs = process.argv[2];
const lits = stringLiteralContents(readFileSync(abs, 'utf8'));
let em = 0, bang = 0;
for (const text of lits) {
  em += (text.match(/—/g) || []).length;
  bang += (text.match(/!/g) || []).length;
}
console.log(`FILE ${abs}`);
console.log(`literals scanned: ${lits.length}`);
console.log(`em=${em} bang=${bang}`);
console.log('--- literals containing an em dash ---');
let i = 0;
for (const text of lits) {
  if (text.includes('—')) console.log(`[${++i}] ${JSON.stringify(text)}`);
}
if (i === 0) console.log('(none)');
