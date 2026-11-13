// REVIEW-VEIL-6 — HIDDEN TEXT IN ANY LETTER CASE. The cold pass looked for a hidden string's own sentences exactly
// as written; a sentence re-cased inside a composed one escaped it (the curing seat's wider eye found one such
// class, and this is my own measure of it). For every share a cold run stored with every eye shut by hand: every
// string under a key an eye governs, on every card of the server's own kinds table (`_gallery_veil_kinds()`), is a
// hidden string; it is cut into pieces at . ! ? ; : ( ) and the long dash, each piece folded to lower case with
// runs of non-alphanumerics made one space, my markers taken out; a piece of four words and twenty characters or
// more is looked for inside the folded text of every string of every read. A piece that is also the folded name
// of a card the response still lists is skipped.
//   node text-anyform.mjs <pg module dir> <database> [<database> …]
import { createRequire } from 'node:module';
const [pgdir, ...dbs] = process.argv.slice(2); const pg = createRequire(`${pgdir}/`)('pg');
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clean = (s) => String(s).replace(/\s*vq6n[0-9]+z/gi, '');
const fold = (s) => clean(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const at = (root, path) => path.reduce((c, seg) => (isRec(c) ? c[seg] : undefined), root);
const rows = {}; const tot = {};
for (const dbname of dbs) {
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await db.connect();
  const chain = dbname.replace(/_\d+$/, ''); tot[chain] = tot[chain] || { shares: 0, pieces: 0, towns: new Set() };
  const KINDS = (await db.query('select public._gallery_veil_kinds() k')).rows[0].k;
  const shares = (await db.query(`select s.id, s.name, s.public_slug, s.unlisted_slug, s.gallery_share_dm dm, s.data,
      (select m.public_slug from public.saved_maps m where m.map_data->'campaign'->'settlementIds' ? s.id::text limit 1) map_slug
      from public.settlements s where s.public_slug is not null and not s.gallery_share_narrated and s.gallery_member_overrides->'$veil'->>'mode' = 'live'
        and jsonb_array_length(s.gallery_member_overrides->'$veil'->'deltas') > 0 order by s.public_slug`)).rows;
  for (const sh of shares) {
    const hidden = new Map(); // folded piece -> origin
    const take = (v, origin) => { if (typeof v === 'string') { for (const p of clean(v).split(/[.!?;:()—]+/)) { const f = fold(p); if (f.length >= 20 && f.split(' ').length >= 4 && !hidden.has(f)) hidden.set(f, origin); } } else if (Array.isArray(v)) v.forEach((x) => take(x, origin)); else if (isRec(v)) Object.values(v).forEach((x) => take(x, origin)); };
    for (const [kind, def] of Object.entries(KINDS)) for (const path of def.lists || []) {
      const star = path.indexOf('*');
      const owners = star < 0 ? [sh.data] : (Array.isArray(at(sh.data, path.slice(0, star))) ? at(sh.data, path.slice(0, star)).filter(isRec) : []);
      for (const o of owners) { const arr = at(o, star < 0 ? path : path.slice(star + 1)); if (!Array.isArray(arr)) continue;
        for (const c of arr.filter(isRec)) for (const [eye, keys] of Object.entries(def.fields || {})) for (const key of keys) { if (kind === 'faction' && eye === 'members') continue; if (kind === 'npc' && (key === 'institution' || key === 'linkedInstitutionIds' || key === 'relationships')) continue; take(c[key], `${kind}.${key}`); } }
    }
    await db.query(`select set_config('test.uid', '', false)`);
    const resp = { gallery: (await db.query('select * from public.get_gallery_dossier($1)', [sh.public_slug])).rows[0]?.data, link: (await db.query('select public.get_unlisted_dossier($1) x', [sh.unlisted_slug])).rows[0]?.x?.dossier };
    if (sh.map_slug && (tot[chain].shares % 4) === 0) resp.map = (await db.query('select public.get_gallery_map($1) x', [sh.map_slug])).rows[0]?.x?.members;
    await db.query(`select set_config('test.uid', $1, false)`, [READER]);
    resp.import = (await db.query('select * from public.import_gallery_dossier($1)', [sh.public_slug])).rows[0]?.data;
    await db.query(`select set_config('test.uid', '', false)`);
    tot[chain].shares += 1; tot[chain].pieces += hidden.size; tot[chain].towns.add(sh.name);
    const names = new Set(); for (const list of [resp.gallery?.institutions, resp.gallery?.npcs, resp.gallery?.powerStructure?.factions]) for (const c of (Array.isArray(list) ? list : []).filter(isRec)) for (const k of ['name', 'faction']) if (typeof c[k] === 'string') names.add(fold(c[k]));
    for (const [read, body] of Object.entries(resp)) { if (!body) continue; const seen = new Set();
      const walk = (v, p) => { if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) walk(x, p ? `${p}.${k}` : k); else if (typeof v === 'string' && v.length >= 20) { const f = fold(v);
        for (const [piece, origin] of hidden) { if (!f.includes(piece) || names.has(piece)) continue; const path = p.replace(/^\[\]\.settlement\./, '');
          const key = `${chain} | ${origin} -> ${path}`; if (seen.has(key)) continue; seen.add(key);
          const r = rows[key] = rows[key] || { noDm: new Set(), dm: new Set(), reads: new Set(), exact: 0, folded: 0, ex: `${sh.name} ${read}: hidden "${piece.slice(0, 70)}" in "${clean(v).slice(0, 150)}"` };
          (sh.dm ? r.dm : r.noDm).add(sh.name); r.reads.add(read); if (clean(v).toLowerCase() === clean(v) || clean(v).includes(piece)) r.folded += 0; } } };
      walk(body, ''); }
  }
  await db.end();
}
for (const [c, t] of Object.entries(tot)) console.log(`chain ${c}: ${t.towns.size} towns, ${t.shares} shares with every eye shut (live), ${t.pieces} hidden pieces looked for`);
for (const k of Object.keys(rows).sort()) { const r = rows[k]; console.log(`${k} | towns: no reveal ${r.noDm.size}, DM ${r.dm.size} | reads: ${[...r.reads].sort().join(' ')}\n      e.g. ${r.ex}`); }
