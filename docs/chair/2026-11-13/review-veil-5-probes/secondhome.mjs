// REVIEW-VEIL-5 — SECOND HOMES. For every stored row of a local probe database: the strings an eye governs on a card
// (the kinds table of migration 211, read from the database itself), looked for OUTSIDE the lists the veil walks, in the
// row as stored and in the gallery response with every eye shut. A hit is a hidden string with a second home the veil
// (the client's and the server's alike) does not reach.
//   node secondhome.mjs <pg module dir> <db> [<db> ...]
import { createRequire } from 'node:module';
const [pgdir, ...dbs] = process.argv.slice(2);
const pg = createRequire(`${pgdir}/`)('pg');
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hist = {}; const ex = {}; let rows = 0; let governed = 0; const houses = { slots: 0, hideable: 0 };
for (const dbn of dbs) {
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect();
  const kinds = (await db.query('select public._gallery_veil_kinds() k')).rows[0].k;
  // one natural (unsalted) row per town: the all-eyes-shut live share without a DM reveal
  const list = (await db.query(`select distinct on (name) id, name, public_slug, data from public.settlements
     where data::text !~ 'RV5~' and gallery_member_overrides ? '$veil' and not gallery_share_dm and gallery_member_overrides #>> '{$veil,mode}' = 'live'
     order by name, jsonb_array_length(gallery_member_overrides #> '{$veil,deltas}') desc`)).rows;
  for (const r of list) {
    rows += 1;
    const s = r.data; const inList = new Set(); const gov = new Map();
    const at = (root, path) => path.reduce((c, seg) => (isRec(c) ? c[seg] : undefined), root);
    const strs = (v, f) => { if (typeof v === 'string') { if (v.trim().length >= 16) f(v); } else if (Array.isArray(v)) v.forEach((x) => strs(x, f)); else if (isRec(v)) Object.values(v).forEach((x) => strs(x, f)); };
    for (const [kind, def] of Object.entries(kinds)) for (const path of def.lists) {
      const star = path.indexOf('*');
      const owners = star < 0 ? [s] : (Array.isArray(at(s, path.slice(0, star))) ? at(s, path.slice(0, star)).filter(isRec) : []);
      for (const o of owners) { const arr = at(o, star < 0 ? path : path.slice(star + 1)); if (!Array.isArray(arr)) continue; inList.add(arr);
        for (const c of arr.filter(isRec)) for (const [eye, keys] of Object.entries(def.fields)) for (const k of [...keys, ...(kind === 'npc' && eye === 'goals' ? ['factionGoal'] : []), ...(kind === 'npc' && eye === 'ties' ? ['linkedFactionIds'] : [])]) strs(c[k], (x) => { if (!gov.has(x)) gov.set(x, `${kind}.${eye}`); }); }
    }
    governed += gov.size;
    const walk = (v, p, f) => { if (inList.has(v)) return; if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`, f)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) walk(x, p ? `${p}.${k}` : k, f); else if (typeof v === 'string' && gov.has(v)) f(p, v); };
    walk(s, '', (p, v) => { const k = `STORED ${gov.get(v)} also at ${p}`; hist[k] = (hist[k] || 0) + 1; });
    const g = (await db.query('select data from public.get_gallery_dossier($1)', [r.public_slug])).rows[0]?.data;
    // the response's own lists are veiled; anything governed that is still in the response is a second home that is SENT
    const all = (v, p, f) => { if (Array.isArray(v)) v.forEach((x) => all(x, `${p}[]`, f)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) all(x, p ? `${p}.${k}` : k, f); else if (typeof v === 'string' && gov.has(v)) f(p, v); };
    if (g) all(g, '', (p, v) => { const k = `SENT (every eye shut) ${gov.get(v)} at ${p}`; hist[k] = (hist[k] || 0) + 1; ex[k] = ex[k] || `${r.name}: ${v.slice(0, 110)}`; });
    for (const [slot, arr] of Object.entries(s.defenseProfile?.institutions || {})) if (Array.isArray(arr)) for (const e of arr.filter(isRec)) { houses.slots += 1;
      if ((await db.query('select public._gallery_veil_house($1::jsonb) h', [JSON.stringify(e)])).rows[0].h) houses.hideable += 1; }
  }
  await db.end();
}
console.log(`rows ${rows}, governed strings ${governed}, defence-profile institution copies ${houses.slots}, of them hideable houses ${houses.hideable}`);
for (const [k, v] of Object.entries(hist).sort((a, b) => b[1] - a[1])) console.log(String(v).padStart(6), k, ex[k] ? `  e.g. ${ex[k]}` : '');
