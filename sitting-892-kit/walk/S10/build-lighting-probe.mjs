// Builds a scratch-only lighting tuple probe from a sha's walker, pointed at a dock, writing NOTHING into the dock.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const [sha, dock, out] = process.argv.slice(2);
const R = '/Users/cstokes/Desktop/settlement-engine';
const src = execFileSync('git', ['-C', R, 'show', `${sha}:tests/lint/sovereigntyLightingContract.walker.test.js`], { encoding: 'utf8', maxBuffer: 64 << 20 });
const cut = src.search(/^describe\(/m);
if (cut < 0) throw new Error('no top-level describe');
const espree = execFileSync(process.execPath, ['-p', `require.resolve('espree',{paths:['${dock}']})`], { encoding: 'utf8' }).trim();
let pure = src.slice(0, cut)
  .replace(/^import \{[^}]*\} from 'vitest';$/m, "const describe=()=>{}; const test=()=>{}; const expect=()=>{throw new Error('probe: expect() in pure region')}; expect.soft=expect; expect.extend=()=>{};")
  .replace(/^import \{ parse \} from 'espree';$/m, `import espreeCjs from '${espree}'; const { parse } = espreeCjs;`)
  .replace(/from '\.\.\/helpers\//g, `from '${dock}/tests/helpers/`)
  .replace(/from '\.\.\/\.\.\/src\//g, `from '${dock}/src/`)
  .replace(/^const ROOT = join\(dirname\(fileURLToPath\(import\.meta\.url\)\), '\.\.\/\.\.'\);$/m, `const ROOT = '${dock}';`);
if (!pure.includes(`const ROOT = '${dock}'`)) throw new Error('ROOT not rewritten');
writeFileSync(out, pure + "\nconsole.log('TUPLE ' + JSON.stringify(measureCensus().figures));\n");
console.log('built', out);
