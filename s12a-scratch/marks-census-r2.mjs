// R2 census: re-derive the 654 / 2,734 / 89 figures the chair's ruling cites, from the same loader the checker uses.
import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D = process.argv[2]; const corpus = [];
const gdir = path.join(D, 'src/data/dossierStateProse');
for (const f of readdirSync(gdir).filter(f => f.endsWith('.generated.js'))) {
  const mod = await import(pathToFileURL(path.join(gdir, f)).href); const table = Object.values(mod)[0];
  for (const [block, b] of Object.entries(table)) for (const [pool, vs] of Object.entries(b.pools || {})) for (const v of vs)
    corpus.push({ kind: 'state', marks: v.marks || [] });
}
{ const mod = await import(pathToFileURL(path.join(D, 'src/data/dossierCausalProse.generated.js')).href); const table = Object.values(mod)[0];
  const walk = o => { if (Array.isArray(o)) { for (const v of o) if (v && typeof v.text === 'string') corpus.push({ kind: 'causal', marks: v.marks || [] }); }
    else if (o && typeof o === 'object') for (const v of Object.values(o)) walk(v); }; walk(table); }
const marked = corpus.filter(c => c.marks.length);
const dm = corpus.filter(c => c.marks.includes('dm-only'));
const vocab = new Map(); for (const c of marked) for (const m of c.marks) vocab.set(m, (vocab.get(m) || 0) + 1);
console.log(`variants total ${corpus.length} | state ${corpus.filter(c=>c.kind==='state').length} causal ${corpus.filter(c=>c.kind==='causal').length}`);
console.log(`variants carrying ANY mark: ${marked.length} (${(marked.length/corpus.length*100).toFixed(1)}%)  — BEFORE R2 these could never mechanically pass`);
console.log(`  of them, carrying 'dm-only': ${dm.length} (${(dm.length/corpus.length*100).toFixed(1)}% of the corpus)`);
console.log(`  role-label-only (marked, no dm-only): ${marked.length - dm.length}`);
console.log(`mark vocabulary: ${[...vocab].sort((a,b)=>b[1]-a[1]).map(([m,n])=>`${m} ${n}`).join(' · ')}`);
console.log(`AFTER R2: variants blocked from a mechanical PASS by the MARKS arm: 0 (the arm is a NOTE; it never enters the fail list)`);
