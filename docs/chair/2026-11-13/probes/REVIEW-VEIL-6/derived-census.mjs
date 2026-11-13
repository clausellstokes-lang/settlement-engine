// REVIEW-VEIL-6 — THE CHAIR'S QUESTION: besides a name, does any FLAG, COUNT or derived value reach a reader only
// because a hidden house exists? An association census, not a proof of cause: for every town of a cold run, the
// party link's response of its share with every eye shut by hand and no reveal (live); the towns are split into
// those WITH a house hidden whole and those WITHOUT; every leaf of the response is tallied by its path.
//   a boolean:  listed when it is true in two or more towns WITH and in none WITHOUT
//   a number:   listed when it is above zero in two or more towns WITH and zero or absent in every town WITHOUT
//   a text:     listed (short texts only) when a value occurs in two or more towns WITH and in none WITHOUT
//   a path:     listed when it exists in two or more towns WITH and in none WITHOUT
// The cause of each listed leaf is then read in the generator; the review says which it read.
//   node derived-census.mjs <pg module dir> <database> [<database> …]
import { createRequire } from 'node:module';
const [pgdir, ...dbs] = process.argv.slice(2); const pg = createRequire(`${pgdir}/`)('pg');
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const towns = [];
for (const dbname of dbs) {
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await db.connect();
  await db.query(`select set_config('test.uid', '', false)`);
  const rows = (await db.query(`select s.name, s.unlisted_slug, (select jsonb_agg(i->>'name') from jsonb_array_elements(s.data->'institutions') i) names from public.settlements s
     where not s.gallery_share_dm and not s.gallery_share_narrated and s.gallery_member_overrides->'$veil'->>'mode' = 'live' and jsonb_array_length(s.gallery_member_overrides->'$veil'->'deltas') > 0 order by s.public_slug`)).rows;
  for (const r of rows) { const d = (await db.query('select public.get_unlisted_dossier($1) x', [r.unlisted_slug])).rows[0]?.x?.dossier; if (!isRec(d)) continue;
    const open = new Set((d.institutions || []).filter(isRec).map((i) => i.name)); const gone = (r.names || []).filter((n) => !open.has(n));
    const leaves = {}; const walk = (v, p) => { if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) walk(x, p ? `${p}.${k}` : k); else (leaves[p] = leaves[p] || []).push(v); };
    walk(d, ''); towns.push({ name: r.name, gone, leaves }); }
  await db.end();
}
const W = towns.filter((t) => t.gone.length > 0); const N = towns.filter((t) => t.gone.length === 0);
console.log(`${towns.length} towns: ${W.length} WITH a house hidden whole, ${N.length} WITHOUT`);
const paths = new Set(towns.flatMap((t) => Object.keys(t.leaves)));
const out = { boolean: [], number: [], text: [], path: [] };
const skip = /(^|\.)(id|name|seed|_seed|slug)$|vq6n/;
for (const p of [...paths].sort()) {
  const inW = W.filter((t) => p in t.leaves); const inN = N.filter((t) => p in t.leaves);
  if (inW.length >= 2 && inN.length === 0) out.path.push(`${p}  (present in ${inW.length} of ${W.length} WITH, 0 of ${N.length} WITHOUT; e.g. ${JSON.stringify(inW[0].leaves[p][0]).slice(0, 70)})`);
  const tw = W.filter((t) => (t.leaves[p] || []).some((v) => v === true)).length; const tn = N.filter((t) => (t.leaves[p] || []).some((v) => v === true)).length;
  if (tw >= 2 && tn === 0) out.boolean.push(`${p}  (true in ${tw} of ${W.length} WITH, 0 of ${N.length} WITHOUT)`);
  const nw = W.filter((t) => (t.leaves[p] || []).some((v) => typeof v === 'number' && v > 0)).length; const nn = N.filter((t) => (t.leaves[p] || []).some((v) => typeof v === 'number' && v > 0)).length;
  if (nw >= 2 && nn === 0 && inN.length > 0) out.number.push(`${p}  (above zero in ${nw} of ${W.length} WITH, 0 of ${N.length} WITHOUT)`);
  if (skip.test(p)) continue;
  const vals = {}; for (const t of W) for (const v of new Set((t.leaves[p] || []).filter((x) => typeof x === 'string' && x.length <= 80 && !/vq6n/.test(x)))) (vals[v] = vals[v] || { w: 0, n: 0 }).w += 1;
  for (const t of N) for (const v of new Set((t.leaves[p] || []).filter((x) => typeof x === 'string'))) if (vals[v]) vals[v].n += 1;
  for (const [v, c] of Object.entries(vals)) if (c.w >= 2 && c.n === 0) out.text.push(`${p} = ${JSON.stringify(v)}  (${c.w} of ${W.length} WITH, 0 WITHOUT)`);
}
for (const k of ['boolean', 'number', 'path', 'text']) { console.log(`\n== ${k}: ${out[k].length}`); for (const l of out[k]) console.log('  ' + l); }
