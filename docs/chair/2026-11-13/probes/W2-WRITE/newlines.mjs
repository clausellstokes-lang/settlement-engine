// newlines.mjs <base-rev> : every corpus variant added or whose marks changed since <base-rev>, by pool
import { execSync } from 'node:child_process';
const base = process.argv[2]; const desks = ['economy', 'defense', 'general', 'power', 'stressors', 'warFaith'];
const load = async (tree) => { const out = {}; for (const d of desks) {
  const mod = await import(`${tree}/src/data/dossierStateProse/${d}.generated.js`);
  const leaf = Object.values(mod).find((v) => v && typeof v === 'object');
  for (const [b, block] of Object.entries(leaf)) for (const [k, vs] of Object.entries(block.pools || {})) out[`${b}::${k}`] = { vs, meta: (block.poolMeta || {})[k] || {} }; }
  return out; };
const A = await load(base), B = await load(process.argv[3]);
for (const [id, { vs, meta }] of Object.entries(B)) {
  const old = A[id]; const byVid = new Map((old?.vs || []).map((v) => [v.vid, v]));
  const rows = [];
  for (const v of vs) { const o = byVid.get(v.vid);
    if (!o) rows.push(`- NEW v${v.vid} \`[${(v.marks || []).join(' · ')}]\` ${v.text}`);
    else if (JSON.stringify(o.marks) !== JSON.stringify(v.marks) || o.text !== v.text) rows.push(`- CHANGED v${v.vid} \`[${(o.marks || []).join(' · ')}]\` -> \`[${(v.marks || []).join(' · ')}]\`${o.text !== v.text ? ` · text: "${o.text}" -> "${v.text}"` : ''}`); }
  const pm = JSON.stringify({ d: old?.meta?.declares, c: old?.meta?.colour }) !== JSON.stringify({ d: meta.declares, c: meta.colour });
  if (rows.length || pm) console.log(`\n**${id}**${pm ? ` (pool brace: ${JSON.stringify({ declares: old?.meta?.declares, colour: old?.meta?.colour })} -> ${JSON.stringify({ declares: meta.declares, colour: meta.colour })})` : ''}\n${rows.join('\n')}`);
}
