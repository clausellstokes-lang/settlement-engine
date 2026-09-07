// READ-ONLY: which (block, pool) keys BOTH seeds drew, the pool's size in the leaves, and which variant index each seed's line matches.
import { readFileSync, readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const A = JSON.parse(readFileSync('generated-lines-chair-taste-2026-09-07.json','utf8'));
const B = JSON.parse(readFileSync('generated-lines-chair-taste-2026-09-07-B.json','utf8'));
const gdir = path.join(D, 'src/data/dossierStateProse'); const pools = {};
for (const f of readdirSync(gdir).filter(f => f.endsWith('.generated.js'))) { const mod = await import(pathToFileURL(path.join(gdir, f)).href); const table = Object.values(mod)[0]; for (const [block, b] of Object.entries(table)) for (const [pool, vs] of Object.entries(b.pools || {})) pools[`${block}::${pool}`] = { file: f, vs }; }
const idxOf = (vs, line, town) => { const fill = t => t.replace(/\{settlement\}/g, town); let i = vs.findIndex(v => fill(v.text) === line); if (i < 0) i = vs.findIndex(v => line.startsWith(fill(v.text).split('{')[0].slice(0, 20)) && fill(v.text).split('{')[0].length > 8); return i; };
const keyA = new Map(A.lines.map(l => [`${l.blockId}::${l.poolKey}`, l])), keyB = new Map(B.lines.map(l => [`${l.blockId}::${l.poolKey}`, l]));
const rows = [];
for (const [k, la] of keyA) { const lb = keyB.get(k); if (!lb) continue; const P = pools[k]; if (!P) { rows.push([k, 'NOT A LEAF POOL', '', '', '']); continue; }
  const ia = idxOf(P.vs, la.text, A.settlement.name), ib = idxOf(P.vs, lb.text, B.settlement.name);
  rows.push([k, P.vs.length, ia, ib, P.vs.map(v => v.angle || '').join('/'), la.audience]); }
rows.sort((x, y) => (y[1] | 0) - (x[1] | 0));
console.log('common (block::pool) keys:', rows.length);
for (const r of rows) console.log(r.join('\t'));
