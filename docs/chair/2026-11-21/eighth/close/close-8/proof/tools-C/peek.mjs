// peek: per seed rendered so far, record/page moved counts and a sample of moved lines by view
import { readdirSync, readFileSync } from 'node:fs';
const [B, A, N = 5] = process.argv.slice(2);
let rec = 0, page = 0, n = 0; const views = {};
for (const f of readdirSync(A)) {
  let a, b; try { a = JSON.parse(readFileSync(`${B}/${f}`)); b = JSON.parse(readFileSync(`${A}/${f}`)); } catch { continue; }
  n++; if (a.recordHash !== b.recordHash) rec++; if (a.pageHash === b.pageHash) continue; page++;
  for (const v of new Set([...Object.keys(a.printed), ...Object.keys(b.printed)])) {
    const X = a.printed[v] || [], Y = b.printed[v] || [];
    const g = X.filter((x) => !Y.includes(x)), c = Y.filter((x) => !X.includes(x));
    if (!g.length && !c.length) continue;
    const e = (views[v] ||= { n: 0, ex: [] }); e.n++; if (e.ex.length < N) e.ex.push(`${a.seed}${a.recordHash !== b.recordHash ? '*' : ''}\n     - ${g.map((x) => x.slice(0, 160)).join('\n     - ')}\n     + ${c.map((x) => x.slice(0, 160)).join('\n     + ')}`);
  }
}
console.log(`births ${n} record moved ${rec} page moved ${page}`);
for (const [v, e] of Object.entries(views).sort((x, y) => y[1].n - x[1].n)) console.log(`== ${v}: ${e.n}\n  ${e.ex.join('\n  ')}`);
