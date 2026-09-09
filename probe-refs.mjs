import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { parse } from 'espree';

const files = process.argv.filter((a) => a.endsWith('.js') && !a.includes('probe'));
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  let ast;
  try { ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module', range: true, loc: true }); }
  catch (e) { console.log(`${f}: PARSE FAIL`); continue; }
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
  for (const { v, line } of out) {
    if (!v.includes('—') && !v.includes('!')) continue;
    // distinctive slice: 24 chars around the first tell
    const idx = Math.max(v.indexOf('—'), v.indexOf('!'));
    const start = Math.max(0, idx - 28);
    const needle = v.slice(start, Math.min(v.length, idx + 32)).trim();
    if (needle.length < 6) { console.log(`${f}:${line} needle-too-short ${JSON.stringify(v)}`); continue; }
    let hits = '';
    try {
      hits = execFileSync('grep', ['-rIn', '--exclude-dir=node_modules', '--exclude-dir=.git', '-F', needle, 'tests', 'scripts'], { encoding: 'utf8' });
    } catch { hits = ''; }
    const lines = hits.split('\n').filter(Boolean).filter((l) => !l.startsWith(f + ':'));
    if (lines.length) {
      console.log(`\n### ${f}:${line}  needle=${JSON.stringify(needle)}`);
      for (const l of lines) console.log('    ' + l.slice(0, 220));
    }
  }
}
