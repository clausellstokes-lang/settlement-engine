// COHERENCE-VEIL-6: secondhome2.mjs with every (DM reveal, live/frozen) pair, governed strings read from the live row and the frozen copy.
// REVIEW-VEIL-5 — SECOND HOMES, measured read by read. For each town's share with EVERY EYE SHUT BY HAND (no DM
// reveal, live), in a local probe database:
//   (a) every string a shut eye governs on a card (the kinds table of 211; identity-floor strings and the roster's own
//       cards left out), looked for at ANY path of each of the four responses;
//   (b) the name of every house hidden WHOLE (the institutions the gallery response no longer lists), looked for inside
//       any string of each response.
//   (c) with SENTENCES=1: every sentence of 20+ characters of such a string, looked for INSIDE any string of each
//       response (a derived line that embeds a hidden sentence without being equal to it).
//   node secondhome2.mjs <pg module dir> <db> [<db> ...]
import { createRequire } from 'node:module';
const [pgdir, ...dbs] = process.argv.slice(2);
const pg = createRequire(`${pgdir}/`)('pg');
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const READER = '22222222-2222-2222-2222-222222222222';
const hist = {}; const towns = {}; const ex = {}; let rows = 0; let nGov = 0; let nHouses = 0;
for (const dbn of dbs) {
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect();
  const kinds = (await db.query('select public._gallery_veil_kinds() k')).rows[0].k;
  const list = (await db.query(`select distinct on (name, gallery_share_dm, gallery_member_overrides #>> '{$veil,mode}') id, name, public_slug, unlisted_slug, data,
       gallery_share_dm as dm, gallery_member_overrides #>> '{$veil,mode}' as mode, gallery_member_overrides #> '{$veil,snapshot}' as snap from public.settlements
     where data::text !~ 'RV5~' and gallery_member_overrides ? '$veil' and not gallery_share_narrated
     order by name, gallery_share_dm, gallery_member_overrides #>> '{$veil,mode}', jsonb_array_length(gallery_member_overrides #> '{$veil,deltas}') desc`)).rows;
  for (const r of list) {
    rows += 1; const s = r.data; const tagDm = `${r.dm ? 'dm' : 'nodm'}/${r.mode}`;
    const at = (root, path) => path.reduce((c, seg) => (isRec(c) ? c[seg] : undefined), root);
    const strs = (v, f) => { if (typeof v === 'string') { if (v.trim().length >= 12) f(v); } else if (Array.isArray(v)) v.forEach((x) => strs(x, f)); else if (isRec(v)) Object.values(v).forEach((x) => strs(x, f)); };
    const gov = new Map(); const floor = new Set();
    for (const [kind, def] of Object.entries(kinds)) for (const path of def.lists) {
      const star = path.indexOf('*');
      const owners = star < 0 ? [s] : (Array.isArray(at(s, path.slice(0, star))) ? at(s, path.slice(0, star)).filter(isRec) : []);
      for (const o of owners) { const arr = at(o, star < 0 ? path : path.slice(star + 1)); if (!Array.isArray(arr)) continue;
        for (const c of arr.filter(isRec)) { for (const k of def.floor) strs(c[k], (x) => floor.add(x));
          for (const [eye, keys] of Object.entries(def.fields)) { if (kind === 'faction' && eye === 'members') continue; for (const k of keys) strs(c[k], (x) => { if (!gov.has(x)) gov.set(x, `${kind}.${eye}(${k})`); }); } } }
    }
    if (r.snap && typeof r.snap === 'object') for (const [kind, def] of Object.entries(kinds)) for (const path of def.lists) {
      const star = path.indexOf('*');
      const owners = star < 0 ? [r.snap] : (Array.isArray(at(r.snap, path.slice(0, star))) ? at(r.snap, path.slice(0, star)).filter(isRec) : []);
      for (const o of owners) { const arr = at(o, star < 0 ? path : path.slice(star + 1)); if (!Array.isArray(arr)) continue;
        for (const c of arr.filter(isRec)) { for (const k of def.floor) strs(c[k], (x) => floor.add(x));
          for (const [eye, keys] of Object.entries(def.fields)) { if (kind === 'faction' && eye === 'members') continue; for (const k of keys) strs(c[k], (x) => { if (!gov.has(x)) gov.set(x, `${kind}.${eye}(${k})`); }); } } }
    }
    for (const x of floor) gov.delete(x);
    nGov += gov.size;
    const sentences = new Map(); if (process.env.SENTENCES) for (const [g, org] of gov) for (const sent of g.split(/(?<=[.!?])\s+/)) if (sent.trim().length >= 20 && !floor.has(sent)) sentences.set(sent.trim(), org);
    const mapSlug = (await db.query(`select public_slug from public.saved_maps where map_data #>> '{campaign,settlementIds,0}' = $1`, [r.id])).rows[0]?.public_slug;
    await db.query(`select set_config('test.uid', '', false)`);
    const resp = { gallery: (await db.query('select data from public.get_gallery_dossier($1)', [r.public_slug])).rows[0]?.data,
      link: (await db.query('select public.get_unlisted_dossier($1) x', [r.unlisted_slug])).rows[0]?.x?.dossier,
      map: mapSlug ? (await db.query('select public.get_gallery_map($1) x', [mapSlug])).rows[0]?.x?.members?.[0]?.settlement : null };
    await db.query(`select set_config('test.uid', $1, false)`, [READER]);
    resp.import = (await db.query('select data from public.import_gallery_dossier($1)', [r.public_slug])).rows[0]?.data;
    await db.query(`select set_config('test.uid', '', false)`);
    const sentNames = new Set((resp.gallery?.institutions || []).filter(isRec).map((i) => i.name));
    const gone = [];
    for (const i of (s.institutions || []).filter(isRec)) if (typeof i.name === 'string' && i.name.length >= 6 && !sentNames.has(i.name)
      && (await db.query('select public._gallery_veil_house($1::jsonb) h', [JSON.stringify(i)])).rows[0].h) gone.push(i.name);
    nHouses += gone.length;
    for (const [read, body] of Object.entries(resp)) {
      if (!body) continue;
      const walk = (v, p) => { if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) walk(x, p ? `${p}.${k}` : k); else if (typeof v === 'string') {
        if (process.env.SENTENCES) { for (const [sent, org] of sentences) if (v.includes(sent) && !(gov.has(v))) { const k = `(c) [${tagDm}] a sentence of ${org} embedded at ${p}`; hist[k] = hist[k] || {}; hist[k][read] = (hist[k][read] || 0) + 1; (towns[k] = towns[k] || new Set()).add(r.name); ex[k] = ex[k] || `${r.name} [${dbn}] ${read}: ${v.slice(0, 160)}`; } }
        if (gov.has(v)) { const k = `(a) [${tagDm}] ${gov.get(v)} sent at ${p}`; hist[k] = hist[k] || {}; hist[k][read] = (hist[k][read] || 0) + 1; (towns[k] = towns[k] || new Set()).add(r.name); ex[k] = ex[k] || `${r.name} [${dbn}] ${read}: ${v.slice(0, 120)}`; }
        for (const nme of gone) if (v.includes(nme)) { const k = `(b) [${tagDm}] a house hidden whole, named at ${p}`; hist[k] = hist[k] || {}; hist[k][read] = (hist[k][read] || 0) + 1; (towns[k] = towns[k] || new Set()).add(r.name); ex[k] = ex[k] || `${r.name} [${dbn}] ${read}: house "${nme}" in "${v.slice(0, 90)}"`; } } };
      walk(body, '');
    }
  }
  await db.end();
}
console.log(`towns ${rows}; governed strings off the floor ${nGov}; houses hidden whole ${nHouses}`);
for (const [k, v] of Object.entries(hist).sort((a, b) => a[0].localeCompare(b[0]))) console.log(`${k}  ${JSON.stringify(v)}  towns ${towns[k].size}\n      e.g. ${ex[k]}`);
