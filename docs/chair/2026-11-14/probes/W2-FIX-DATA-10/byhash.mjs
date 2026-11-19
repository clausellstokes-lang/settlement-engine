import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const require = createRequire('/home/user/w2fd10/package.json'); const ts = require('typescript');
const h = (t) => createHash('sha256').update(String(t)).digest('hex').slice(0, 16);
const rows = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter((l) => l.startsWith('fresh\t')).map((l) => l.split('\t'));
const want = new Set(process.argv.slice(3));
const byFile = new Map(); for (const r of rows) if (!want.size || want.has(r[2])) (byFile.get(r[1]) || byFile.set(r[1], []).get(r[1])).push(r);
for (const [f, rs] of byFile) {
  const src = fs.readFileSync('/home/user/w2fd10/' + f, 'utf8'); const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  const visit = (n) => { if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) { const k = h(n.text); for (const r of rs) if (r[3] === k) {
      const line = sf.getLineAndCharacterOfPosition(n.getStart()).line + 1; let p = n.parent; while (p && !ts.isObjectLiteralExpression(p) && !ts.isArrayLiteralExpression(p)) p = p.parent;
      console.log(`${f}:${line} [${r[2]}] key=${ts.isPropertyAssignment(n.parent) && n.parent.name === n}\n   TEXT ${n.text}\n   CTX ${p ? p.getText().replace(/\s+/g, ' ').slice(0, 400) : '-'}`); } }
    ts.forEachChild(n, visit); };
  visit(sf);
}
