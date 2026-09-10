import { readFileSync } from 'node:fs';
import { parse } from '/Users/cstokes/Desktop/settlement-engine/node_modules/espree/dist/espree.cjs';
const FILES = process.argv.slice(2);
for (const f of FILES) {
  const code = readFileSync(f, 'utf8');
  const ast = parse(code, { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } });
  const lits = [];
  (function walk(n) {
    if (!n || typeof n !== 'object') return;
    if (n.type === 'Literal' && typeof n.value === 'string') lits.push(n.value);
    if (n.type === 'TemplateElement') lits.push(n.value.cooked ?? '');
    for (const k of Object.keys(n)) {
      const v = n[k];
      if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object' && v.type) walk(v);
    }
  })(ast);
  const em = lits.filter((s) => s.includes('—')).length;
  const bang = lits.filter((s) => s.includes('!')).length;
  const fixed = /\.toFixed\(/.test(code) ? 'PRESENT' : 0;
  console.log(`${f}  literals ${lits.length} · em ${em} · bang ${bang} · toFixed ${fixed}`);
}
