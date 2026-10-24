// Approximates eslint max-lines {skipBlankLines, skipComments}: counts lines carrying any non-comment token.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/fp-p8/package.json');
const espree = require('espree');
for (const f of process.argv.slice(2)) {
  const src = readFileSync(f, 'utf8');
  const toks = espree.tokenize(src, { ecmaVersion: 'latest', sourceType: 'module', loc: true, range: true, ecmaFeatures: { jsx: true } });
  const lines = new Set();
  for (const t of toks) for (let l = t.loc.start.line; l <= t.loc.end.line; l++) lines.add(l);
  console.log(String(lines.size).padStart(5), f.replace('/home/user/master-code-of-record/',''));
}
