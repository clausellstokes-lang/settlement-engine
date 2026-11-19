import { join } from 'node:path';
const sh = await import(join(process.cwd(), 'tests/lint/presumedThings.shared.mjs'));
const pos = ['const a = POOL.map(({ text: t }) => t);', 'const a = POOL.map((l) => `${l.text}`);', 'const a = Array.from(POOL, (l) => l.text);', 'const a = POOL.reduce((acc, l) => [...acc, l.text], []);', 'const out = []; for (let i = 0; i < POOL.length; i += 1) out.push(POOL[i].text);', 'const a = POOL.map((l) => l.text.trim());', 'const a = POOL.map((l) => l && l.text);', 'const getText = (l) => l.text; const a = POOL.map(getText);',
  'const out = []; POOL.forEach((l) => out.push(l.text));', 'const out = []; for (const { text } of POOL) out.push(text);', 'const a = POOL.map((l) => { const said = l.text; return said; });', 'function* lines() { for (const l of POOL) yield l.text; }'];
const neg = ['const a = POOL.map((l) => ({ ...l, text: l.text.trim() }));', 'const n = POOL.reduce((sum, l) => sum + l.weight, 0);', 'const d = drawDeclared(POOL, { draw, key }).text;', 'const e = rows.map((l) => l.name);'];
for (const s of pos) console.log(JSON.stringify(sh.stripSites('src/generators/p.js', s).map((x) => x.receiver)) === '["POOL"]' ? 'caught ' : 'MISSED ', s);
for (const s of neg) console.log(sh.stripSites('src/generators/p.js', s).length === 0 ? 'clean  ' : 'FALSE+ ', s);
