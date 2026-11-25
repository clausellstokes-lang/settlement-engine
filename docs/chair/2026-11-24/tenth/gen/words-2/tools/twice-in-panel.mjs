// WORDS-2 · TWICE-IN-PANEL (RULING G31 (1)): from a counting-walk battery's rows (`repeats`: view -> line -> greatest count
// in one snapshot), the pages on which one panel prints the same line of SIX WORDS OR MORE twice or more. A MEASURE.
// Usage: node twice-in-panel.mjs <rows dir> [...]
import { readdirSync, readFileSync } from 'node:fs'; import { join } from 'node:path';
for (const dir of process.argv.slice(2)) {
  let pages = 0, n = 0, faithful = 0; const byView = {}; const lines = new Map();
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const r = JSON.parse(readFileSync(join(dir, f))); n++;
    let hit = false;
    for (const [view, reps] of Object.entries(r.repeats || {})) for (const [line, k] of Object.entries(reps)) {
      if (line.split(/\s+/).length < 6) continue;
      hit = true; byView[view] = (byView[view] || 0) + 1;
      const name = String(r.printed?.['Summary/Overview']?.[0] ?? '').split('·')[0].replace(/(thorp|hamlet|village|town|city|metropolis)$/, '');
      const masked = (name ? line.split(name).join('{S}') : line).replace(/^Connection: (\S+) .+?, the /, 'Connection: $1 {person}, the '); const key = `${view} :: ${masked}`.replace(/\d[\d,.]*/g, '{N}');
      const e = lines.get(key) || { pages: 0, most: 0, ex: [] }; e.pages++; e.most = Math.max(e.most, k); if (e.ex.length < 3) e.ex.push(r.seed); lines.set(key, e);
    }
    if (hit) pages++;
  }
  console.log(`== ${dir.split('/').slice(-2, -1)[0]}: ${pages} of ${n} pages hold a line of six words or more printed twice or more in one panel`);
  console.log('  by panel:', JSON.stringify(Object.fromEntries(Object.entries(byView).sort((a, b) => b[1] - a[1]))));
  for (const [k, e] of [...lines].sort((a, b) => b[1].pages - a[1].pages).slice(0, 10)) console.log(`  ${e.pages} pages (up to ${e.most}x) ${k.slice(0, 170)}  [${e.ex.join(' ')}]`);
}
