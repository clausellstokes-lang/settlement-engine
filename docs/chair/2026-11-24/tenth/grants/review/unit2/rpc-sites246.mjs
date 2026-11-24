// REVIEW-GRANTS-1: every .rpc( call under supabase/functions and src in a git tree, with receiver and first argument.
// node rpc-sites.mjs <tree> ; reads files with `git show <tree>:<path>`.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const tree = process.argv[2] || 'HEAD';
const names = new Set(readFileSync('docs/chair/2026-11-24/tenth/grants/review/unit2/names246.txt', 'utf8').split('\n').filter(Boolean));
const files = execFileSync('git', ['ls-tree', '-r', '--name-only', tree, 'supabase/functions', 'src'], { encoding: 'utf8' })
  .split('\n').filter((f) => /\.(ts|tsx|js|jsx|mjs)$/.test(f) && !/\.test\.|__tests__|\/tests?\//.test(f));
const out = [];
for (const f of files) {
  const src = execFileSync('git', ['show', `${tree}:${f}`], { encoding: 'utf8', maxBuffer: 64 << 20 });
  const re = /([A-Za-z_$][\w$.]*)\s*\.rpc\(\s*([^,)]+)/g; let m;
  while ((m = re.exec(src))) {
    const line = src.slice(0, m.index).split('\n').length;
    let arg = m[2].trim(); let name = null;
    const lit = /^['"`]([\w]+)['"`]$/.exec(arg);
    if (lit) name = lit[1];
    out.push({ f, line, recv: m[1], arg, name, listed: name ? names.has(name) : null });
  }
}
const listed = out.filter((o) => o.listed);
const dynamic = out.filter((o) => o.name === null);
console.log(`tree ${tree}: rpc calls ${out.length}; to listed functions ${listed.length}; dynamic ${dynamic.length}`);
for (const o of listed) console.log(`L ${o.f}:${o.line} ${o.recv}.rpc('${o.name}')`);
for (const o of dynamic) console.log(`D ${o.f}:${o.line} ${o.recv}.rpc(${o.arg})`);
const recvs = {}; for (const o of listed.concat(dynamic)) (recvs[o.f] ||= new Set()).add(o.recv);
for (const [f, s] of Object.entries(recvs)) console.log(`R ${f}: ${[...s].join(', ')}`);
