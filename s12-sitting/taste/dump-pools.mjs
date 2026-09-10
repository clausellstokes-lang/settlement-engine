import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const want = process.argv.slice(2);
const gdir = path.join(D, 'src/data/dossierStateProse');
for (const f of readdirSync(gdir).filter(f => f.endsWith('.generated.js'))) { const mod = await import(pathToFileURL(path.join(gdir, f)).href); const table = Object.values(mod)[0];
  for (const [block, b] of Object.entries(table)) for (const [pool, vs] of Object.entries(b.pools || {})) { const k = `${block}::${pool}`; if (!want.includes(k)) continue;
    console.log(`\n### ${k}  (${f})  siblings: ${Object.keys(b.pools).filter(x => x !== pool).join(' | ')}`);
    vs.forEach((v, i) => console.log(`  [${i}] angle=${v.angle || ''} marks=${(v.marks || []).join(',')}\n      ${v.text}`)); } }
