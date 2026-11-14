// Rewrite every `it.each(ROWS)(TITLE, FN, TIMEOUT?)` in the given files into one plain test that runs every row
// through collectSeedFailures / expectNoSeedFailures. Prints a plan line per call; TITLES maps old title text -> new.
import ts from '/home/user/wt/p11/node_modules/typescript/lib/typescript.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { relative, dirname } from 'node:path';
const [titlesPath, ...files] = process.argv.slice(2);
const TITLES = JSON.parse(readFileSync(titlesPath, 'utf8'));
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const visit = (n) => {
    if (ts.isCallExpression(n) && ts.isCallExpression(n.expression)) {
      const inner = n.expression;
      const callee = inner.expression.getText(sf);
      if (callee === 'it.each' || callee === 'test.each') {
        const rows = inner.arguments[0];
        if (!ts.isArrayLiteralExpression(rows)) throw new Error(`${file}: rows not literal`);
        const [title, fn, timeout] = n.arguments;
        const oldTitle = title.getText(sf).slice(1, -1);
        const newTitle = TITLES[`${file}::${oldTitle}`] ?? TITLES[oldTitle];
        if (!newTitle) throw new Error(`${file}: no title for ${oldTitle}`);
        const params = fn.parameters.map((p) => p.getText(sf));
        const arg = params.length > 1 ? `[${params.join(', ')}]` : params[0];
        const body = fn.body.getText(sf);
        const n_ = rows.elements.length;
        let to = '';
        if (timeout) { const v = Number(timeout.getText(sf).replace(/_/g, '')); to = `, ${(v * n_).toLocaleString('en-US').replace(/,/g, '_')}`; }
        const q = JSON.stringify(newTitle).slice(1, -1).replace(/'/g, "\\'");
        const label = q;
        const text = `it('${q}', () => {\n    expectNoSeedFailures(collectSeedFailures(${rows.getText(sf)}, (${arg}) => ${body}), '${label}');\n  }${to})`;
        edits.push([n.getStart(sf), n.getEnd(), text]);
        console.log(`${file}: ${n_} rows, params ${arg}, timeout${to || ' none'}: ${oldTitle} -> ${newTitle}`);
        return;
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  let out = src;
  for (const [a, b, t] of edits.sort((x, y) => y[0] - x[0])) out = out.slice(0, a) + t + out.slice(b);
  if (!/collectSeedFailures, expectNoSeedFailures|expectNoSeedFailures, collectSeedFailures/.test(out)) {
    const rel = relative(dirname(file), '/home/user/wt/p11/tests/helpers/seedFailures.js');
    const imp = `import { collectSeedFailures, expectNoSeedFailures } from '${rel.startsWith('.') ? rel : './' + rel}';\n`;
    const m = out.match(/^import [^\n]*from 'vitest';\n/m);
    out = out.replace(m[0], m[0] + imp);
  }
  writeFileSync(file, out);
}
