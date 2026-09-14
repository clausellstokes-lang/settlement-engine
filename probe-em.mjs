// The E2 arm's own idiom: espree parse, Literal + TemplateLiteral quasis.
import { readFileSync } from 'node:fs';
import { parse } from 'espree';

const files = process.argv.filter((a) => a.endsWith('.js'));
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  let ast;
  try { ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module', range: true, loc: true }); }
  catch (e) { console.log(`${f}: PARSE FAIL ${e.message}`); continue; }
  const out = [];
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if (!node.type) return;
    if (node.type === 'Literal' && typeof node.value === 'string') out.push({ v: node.value, line: node.loc.start.line });
    if (node.type === 'TemplateLiteral') {
      for (const q of node.quasis) out.push({ v: String(q.value.cooked ?? q.value.raw), line: q.loc.start.line });
    }
    for (const k of Object.keys(node)) {
      if (k === 'range' || k === 'loc' || k === 'parent') continue;
      visit(node[k]);
    }
  };
  visit(ast);
  let em = 0, bang = 0;
  for (const { v } of out) { em += (v.match(/—/g) || []).length; bang += (v.match(/!/g) || []).length; }
  console.log(`${f}\tliterals:${out.length}\tem:${em}\tbang:${bang}`);
  if (process.env.SHOW === '1') {
    for (const { v, line } of out) {
      if (v.includes('—') || v.includes('!')) console.log(`   L${line}: ${JSON.stringify(v)}`);
    }
  }
}
