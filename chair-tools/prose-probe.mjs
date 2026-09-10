// prose-probe.mjs <tree> — READ-ONLY. Dumps LIVE.hits from proseNumerics' pure region.
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
const tree = resolve(process.argv[2]);
const src = readFileSync(join(tree, 'tests/lint/proseNumerics.test.js'), 'utf8');
const cut = src.search(/^describe\(/m);
if (cut < 0) { console.error('shape changed'); process.exit(2); }
const pure = src.slice(0, cut).replace(/^import \{[^}]*\} from 'vitest';$/m,
  "const describe=()=>{};const test=()=>{};const it=()=>{};\nconst expect=()=>{throw new Error('probe: expect() in pure region');};expect.soft=expect;expect.extend=()=>{};");
const tmp = join(tree, 'tests', 'lint', `.prose-probe.${process.pid}.mjs`);
let out;
try { writeFileSync(tmp, `${pure}\nconsole.log(JSON.stringify(LIVE.hits));\n`, 'utf8');
      out = execFileSync(process.execPath, [tmp], { cwd: tree, encoding: 'utf8', maxBuffer: 128*1024*1024 }); }
catch (e) { console.error('probe failed:', e.stderr || e.message); process.exit(1); }
finally { try { unlinkSync(tmp); } catch {} }
process.stdout.write(out.trim().split('\n').pop());
