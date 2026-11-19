// REVIEW-VEIL-6 — THE NAME OF A HOUSE HIDDEN WHOLE, IN ANY FORM. The last review's name search, the lane's guard and
// my own cold pass all looked for a hidden house's name exactly as its card spells it. This looks for it in any
// letter case and in the forms a key or an id takes (lower-cased; non-alphanumerics folded to '-', '_', ' ' or
// nothing), in every string AND every key of every read, for every share a cold run stored.
//   node names-anyform.mjs <pg module dir> <database> [<database> ...]      (PGHOST set; local scratch chains only)
// A house is "hidden whole" on a share when the stored town lists it and the gallery read of that share does not.
// A hit is dropped when a house the response still lists has the same folded name (nothing open is counted).
import { createRequire } from 'node:module';
const [pgdir, ...dbs] = process.argv.slice(2);
const pg = createRequire(`${pgdir}/`)('pg');
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
import { fold, formsOf, hitsIn } from '/var/tmp/v16/rv9/fold.mjs';
const rows = {}; const tot = {};
for (const dbname of dbs) {
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await db.connect();
  const chain = dbname.replace(/_\d+$/, ''); tot[chain] = tot[chain] || { shares: 0, reads: 0, hiddenHouses: 0, towns: new Set() };
  const shares = (await db.query(`select s.id, s.name, s.public_slug, s.unlisted_slug, s.gallery_share_dm dm, s.gallery_share_narrated narr, (s.gallery_member_overrides ? '$veil') marked,
      s.gallery_member_overrides->'$veil'->>'mode' mode, coalesce(jsonb_array_length(s.gallery_member_overrides->'$veil'->'deltas'), 0) deltas,
      s.data->'institutions' names,
      (select m.public_slug from public.saved_maps m where m.map_data->'campaign'->'settlementIds' ? s.id::text limit 1) map_slug,
      (select m.unlisted_slug from public.saved_maps m where m.map_data->'campaign'->'settlementIds' ? s.id::text limit 1) map_link
      from public.settlements s where s.public_slug is not null order by s.public_slug`)).rows;
  for (const sh of shares) {
    const kind = `${sh.dm ? 'DM reveal on' : 'no reveal'} | ${!sh.marked ? 'unmarked' : sh.deltas > 0 ? 'every eye shut' : 'marked, persons only'}${sh.narr ? ', narrated' : ''}${sh.mode === 'snapshot' ? ' | frozen' : ''}`;
    await db.query(`select set_config('test.uid', '', false)`);
    const resp = {};
    resp.gallery = (await db.query('select * from public.get_gallery_dossier($1)', [sh.public_slug])).rows[0];
    resp.link = (await db.query('select public.get_unlisted_dossier($1) x', [sh.unlisted_slug])).rows[0]?.x;
    resp.map = sh.map_slug ? (await db.query('select public.get_gallery_map($1) x', [sh.map_slug])).rows[0]?.x : null;
    resp.mapLink = sh.map_link ? (await db.query('select public.get_unlisted_map($1) x', [sh.map_link])).rows[0]?.x : null;
    resp.card = (await db.query(`select * from public.list_gallery_dossiers(0, 60, 'newest', $1, '{}'::jsonb, false)`, [sh.name])).rows;
    await db.query(`select set_config('test.uid', $1, false)`, [READER]);
    resp.import = (await db.query('select * from public.import_gallery_dossier($1)', [sh.public_slug])).rows[0];
    resp.importMap = sh.map_slug ? (await db.query('select * from public.import_gallery_map($1)', [sh.map_slug])).rows[0] : null;
    await db.query(`select set_config('test.uid', '', false)`);
    if (!resp.gallery) continue;
    const openI = (resp.gallery.data?.institutions || []).filter(isRec); const openIds = new Set(openI.map((i) => i.id).filter(Boolean)); const openN = new Set(openI.map((i) => fold(i.name)));
    const gone = (sh.names || []).filter(isRec).filter((h) => !(h.id && openIds.has(h.id)) && !openN.has(fold(h.name)));
    const openForms = new Set(openI.flatMap(formsOf)); for (const list of [resp.gallery.data?.npcs, resp.gallery.data?.powerStructure?.factions, resp.gallery.data?.factions]) for (const c of (Array.isArray(list) ? list : []).filter(isRec)) for (const k of ['name', 'faction']) if (typeof c[k] === 'string') openForms.add(fold(c[k]));
    const forms = [...new Set(gone.flatMap(formsOf))].filter((g) => !openForms.has(g) && ![...openForms].some((o) => o.includes(g)));
    tot[chain].shares += 1; tot[chain].hiddenHouses += gone.length; tot[chain].towns.add(sh.name);
    for (const [read, body] of Object.entries(resp)) {
      if (!body) continue; tot[chain].reads += 1;
      const seen = new Set();
      const test = (s, p, val) => { if (typeof s !== 'string' || s.length < 4) return; if (val === false && /^(has|is)[A-Z]/.test(s)) return;
        for (const g of hitsIn(s, forms)) {
          const path = p.replace(/^(data|dossier|x)\./, '').replace(/^import_gallery_map\./, '').replace(/^members\[\]\.settlement\./, '').replace(/^\[\]\./, 'card.');
          const key = `${chain} | ${path}`; if (seen.has(`${key}|${g}`)) continue; seen.add(`${key}|${g}`);
          const r = rows[key] = rows[key] || { towns: {}, reads: new Set(), kinds: new Set(), ex: `${sh.name} ${read}: "${g}" in "${s.slice(0, 120)}"${val !== undefined ? ' = ' + JSON.stringify(val).slice(0, 40) : ''}`, exact: 0, other: 0 };
          (r.towns[kind] = r.towns[kind] || new Set()).add(sh.name); r.reads.add(read); r.kinds.add(kind); r.other += 1; } };
      const walk = (v, p) => { if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) { test(k, `${p}.<key>`, x); walk(x, p ? `${p}.${k}` : k); } else test(v, p); };
      walk(body, '');
    }
  }
  await db.end();
}
for (const [c, t] of Object.entries(tot)) console.log(`chain ${c}: ${t.towns.size} towns, ${t.shares} shares, ${t.reads} reads, ${t.hiddenHouses} houses hidden whole (summed over shares)`);
for (const k of Object.keys(rows).sort()) { const r = rows[k];
  const noDm = Math.max(0, ...Object.entries(r.towns).filter(([kk]) => kk.startsWith('no reveal')).map(([, s]) => s.size)); const dm = Math.max(0, ...Object.entries(r.towns).filter(([kk]) => kk.startsWith('DM')).map(([, s]) => s.size));
  console.log(`${k} | towns: no reveal ${noDm}, DM ${dm} | spelled as the card ${r.exact}, another form ${r.other} | reads: ${[...r.reads].sort().join(' ')} | shares: ${[...r.kinds].sort().join(' ; ')}\n      e.g. ${r.ex}`); }
