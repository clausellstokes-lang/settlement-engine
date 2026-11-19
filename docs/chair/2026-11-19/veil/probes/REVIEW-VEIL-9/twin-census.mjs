// REVIEW-VEIL-9 — A SENTENCE CHOSEN BY A HIDDEN HOUSE'S PRESENCE (V9-1). For every share of each database: every read
// (gallery, link, import; anon, the reader for the import); the strings that hold PHRASE; whether the stored roster
// holds a house matching ROSTER (the generator's own reading, safetyLineTruth.js :: BENEATH_THE_WALLS) and whether
// the served roster still does. A hit where the stored roster matches and the served one does not is a sentence
// written because a house the reader may not see stands.
//   node twin-census.mjs <pgmod> <phrase regex> <roster regex> <db>...
import { createRequire } from 'node:module';
const [pgdir, phrase, roster, ...dbs] = process.argv.slice(2); const pg = createRequire(`${pgdir}/`)('pg');
const P = new RegExp(phrase, 'i'); const R = new RegExp(roster, 'i'); const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const tally = {}; const ex = {};
for (const dbname of dbs) {
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await db.connect();
  const shares = (await db.query(`select name, public_slug, unlisted_slug, gallery_share_dm dm, (gallery_member_overrides ? '$veil') marked, coalesce(jsonb_array_length(gallery_member_overrides->'$veil'->'deltas'),0) deltas,
    gallery_member_overrides->'$veil'->>'mode' mode, data->'institutions' houses from public.settlements where public_slug is not null order by public_slug`)).rows;
  for (const sh of shares) {
    const storedMatch = (sh.houses || []).filter(isRec).filter((h) => R.test(`${h.name || ''} | ${h.category || ''} | ${(Array.isArray(h.tags) ? h.tags : []).join(' ')}`)).map((h) => h.name);
    await db.query(`select set_config('test.uid', '', false)`);
    const reads = { gallery: (await db.query('select * from public.get_gallery_dossier($1)', [sh.public_slug])).rows[0]?.data, link: (await db.query('select public.get_unlisted_dossier($1) x', [sh.unlisted_slug])).rows[0]?.x?.dossier };
    await db.query(`select set_config('test.uid', $1, false)`, [READER]); reads.import = (await db.query('select * from public.import_gallery_dossier($1)', [sh.public_slug])).rows[0]?.data; await db.query(`select set_config('test.uid', '', false)`);
    for (const [read, body] of Object.entries(reads)) { if (!isRec(body)) continue;
      const served = (body.institutions || []).filter(isRec).filter((h) => R.test(`${h.name || ''} | ${h.category || ''} | ${(Array.isArray(h.tags) ? h.tags : []).join(' ')}`));
      const paths = []; const walk = (v, p) => { if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) walk(x, `${p}.${k}`); else if (typeof v === 'string' && P.test(v)) paths.push(p); }; walk(body, '$');
      const kind = `${dbname.replace(/_\d+$/, '')} | ${read} | ${sh.dm ? 'DM on' : 'DM off'} | ${!sh.marked ? 'unmarked (default veil on the link)' : sh.deltas > 0 ? 'eyes shut' : 'marked, no house eye'}${sh.mode === 'snapshot' ? ' | frozen' : ''}`;
      const cls = !paths.length ? 'phrase absent' : !storedMatch.length ? 'phrase sent, no such house stored' : served.length ? 'phrase sent, the house sent too' : 'PHRASE SENT, ITS HOUSE WITHHELD';
      const k = `${kind} | ${cls}`; tally[k] = (tally[k] || 0) + 1;
      if (cls.startsWith('PHRASE') && !ex[k]) ex[k] = `${sh.name} (${sh.public_slug}): stored ${JSON.stringify(storedMatch)}; at ${paths.slice(0, 4).join(', ')}`; }
  }
  await db.end();
}
for (const k of Object.keys(tally).sort()) console.log(`${k} | ${tally[k]}${ex[k] ? `\n      e.g. ${ex[k]}` : ''}`);
