// golden-count.mjs <tree> — READ-ONLY: how many of the committed generator-golden-master rows would MOVE at <tree>.
// Extracts the golden test's pure region (above the first column-0 `describe(`), stubs vitest and the door, runs the
// suite's own corpus()/keyOf/hashFor, and compares to the committed manifest. Farmed (tests/ copied, rest symlinked);
// writes nothing into the tree. Prints JSON: {total, moved, added, removed, movedKeys[]}.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, symlinkSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
const REL = 'tests/property/generatorGoldenMaster.test.js';
const tree = resolve(process.argv[2] || (() => { console.error('usage: <tree>'); process.exit(2); })());
const src = readFileSync(join(tree, REL), 'utf8');
const cut = src.search(/^describe\(/m); if (cut < 0) { console.error('no top-level describe('); process.exit(2); }
let pure = src.slice(0, cut)
  .replace(/^import \{[^}]*\} from 'vitest';$/m, "const describe = () => {}; const test = () => {}; const it = () => {}; const expect = () => { throw new Error('probe: expect() in pure region'); }; expect.soft = expect;")
  .replace(/^import \{[^}]*\} from '\.\.\/helpers\/goldenRecordDoor\.js';$/m, 'const recordGolden = () => { throw new Error("probe: door called"); };');
const tail = `
const __rows = corpus(); const __live = {}; for (const c of __rows) __live[keyOf(c)] = hashFor(c);
const __committed = JSON.parse(readFileSync(new URL('../fixtures/generator-golden-master.json', import.meta.url), 'utf8'));
const __rowsIn = (m) => (m && typeof m === 'object' && !Array.isArray(m)) ? (m.rows || m.entries || m.manifest || m) : m;
const __c = __rowsIn(__committed); const __ck = Object.keys(__c); const __lk = Object.keys(__live);
const moved = __ck.filter((k) => k in __live && __live[k] !== __c[k]); const added = __lk.filter((k) => !(k in __c)); const removed = __ck.filter((k) => !(k in __live));
console.log(JSON.stringify({ total: __ck.length, live: __lk.length, moved: moved.length, added: added.length, removed: removed.length, movedKeys: moved.slice(0, 600) }));
`;
if (!/readFileSync/.test(pure)) pure = "import { readFileSync } from 'node:fs';\n" + pure;
const farmRoot = process.env.PROBE_FARM_ROOT || resolve(process.env.HOME || '/tmp', '.lighting-probe-farms');
const farm = join(farmRoot, `golden.${process.pid}`); let out;
try {
  mkdirSync(farm, { recursive: true });
  for (const e of readdirSync(tree)) { if (e === '.git') continue; if (e === 'tests') cpSync(join(tree, 'tests'), join(farm, 'tests'), { recursive: true }); else symlinkSync(join(tree, e), join(farm, e)); }
  const tmp = join(farm, 'tests', 'property', `.golden-count.${process.pid}.mjs`);
  writeFileSync(tmp, pure + tail, 'utf8');
  out = execFileSync(process.execPath, [tmp], { cwd: farm, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=6144' } });
} catch (e) { console.error('probe failed:', (e.stderr || e.message || '').slice(0, 2000)); process.exit(1); }
finally { try { rmSync(farm, { recursive: true, force: true }); } catch {} }
console.log(out.trim().split('\n').pop());
