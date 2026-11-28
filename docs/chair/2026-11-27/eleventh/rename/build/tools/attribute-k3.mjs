// K3: the lines a POWER's (F) or HOUSE's (H) rename moves otherwise than by the name, put down to the source file that holds
// their words (a fixed-string search of src/ for the longest fragment of the line holding neither the old nor the new name)
import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import { execFileSync } from 'node:child_process';
const norm = (s) => String(s).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const K = process.argv[2] || 'F'; const out = { pages: {}, files: {}, unplaced: 0, ex: {} }; const cache = new Map();
const place = (line, names) => {
  let parts = [norm(line)]; for (const n of names) parts = parts.flatMap((p) => p.split(n));
  parts = parts.flatMap((p) => p.split(/(?:\b\p{Lu}[\p{L}'-]*(?:\s+(?:of|the|de|al|du)?\s*\p{Lu}[\p{L}'-]*)*)|\d+|[{}":,]/u));
  const frag = parts.map((p) => p.trim()).filter((p) => p.length >= 16).sort((a, b) => b.length - a.length)[0];
  if (!frag) return null; const f = frag.slice(0, 60);
  if (cache.has(f)) return cache.get(f);
  let hit = null; try { hit = execFileSync('grep', ['-rlF', '--include=*.js', '--include=*.jsx', '--include=*.json', '-e', f, '/home/user/settlement-engine/src'], { encoding: 'utf8' }).split('\n').filter(Boolean).map((x) => x.replace('/home/user/settlement-engine/', '')).slice(0, 3).join(' + '); } catch { hit = null; }
  cache.set(f, hit); return hit;
};
for (const C of (process.env.K3C || 'C,V').split(',')) {
  const rl = readline.createInterface({ input: createReadStream(`/home/user/scratch/work/K3-${C}.jsonl`), crlfDelay: Infinity });
  for await (const l of rl) { if (!l) continue; const j = JSON.parse(l); const v = j.vars?.[K]; if (!v || v.skip || j.error) continue;
    const bare = (x) => String(x).replace(/^the\s+/i, ''); const o = bare(v.old), w = bare(v.neu); const re = new RegExp(v.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const forms = (g) => [g.replace(re, v.neu), g.split(v.old).join(w), g.split(o).join(w), g.split(`the ${o}`).join(`the ${w}`).split(`The ${o}`).join(`The ${w}`), g.split(o).join(v.neu)];
    const seen = new Set();
    for (const [view, d] of Object.entries(v.diff)) { const came = [...(d.came || [])].map(norm);
      for (const g of (d.gone || []).map(norm)) { const i = forms(g).map((f) => (f !== g ? came.indexOf(f) : -1)).find((x) => x >= 0); if (i !== undefined) { came.splice(i, 1); continue; }
        const file = place(g, [v.old, o, j.name]) || 'UNPLACED'; if (file === 'UNPLACED') { out.unplaced++; const k = `${view}| ${g.replace(/\d+/g, '#').slice(0, 70)}`; (out.un ||= {})[k] = ((out.un || {})[k] || 0) + 1; }
        out.files[file] = (out.files[file] || 0) + 1; if (!seen.has(file)) { seen.add(file); out.pages[file] = (out.pages[file] || 0) + 1; }
        (out.ex[file] ||= []).length < 2 && out.ex[file].push(`${C} ${j.seed} ${view}: ${g.slice(0, 140)}`); } } }
}
const top = Object.entries(out.pages).sort((a, b) => b[1] - a[1]);
console.log(`${K}: residual GONE lines placed by source file (pages, lines), unplaced ${out.unplaced}`);
if (process.env.UN) for (const [k, n] of Object.entries(out.un || {}).sort((a, b) => b[1] - a[1]).slice(0, 30)) console.log(`   UN ${n}  ${k}`);
for (const [f, p] of top.slice(0, 40)) console.log(`  ${p} pages, ${out.files[f]} lines  ${f}\n      ${(out.ex[f] || []).join('\n      ')}`);
