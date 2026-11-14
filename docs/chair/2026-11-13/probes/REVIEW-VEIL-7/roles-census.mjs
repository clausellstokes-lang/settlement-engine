// roles-census.mjs <pg module dir> <db>...      REVIEW-VEIL-7
// A ROLE THE PERSON'S OWN CARD WITHHOLDS, ANYWHERE ELSE. For every stored share, the gallery read as anon and the
// party link: each person whose STORED card has a role (or title) and whose SERVED card has none; then every record
// of the response, other than that card, that names the person (their id or name as a string value) and also holds
// the stored role or title as a string value, and every string that holds both the name and the role.
const [pgdir, ...dbs] = process.argv.slice(2);
const pg = (await import(`${pgdir}/node_modules/pg/lib/index.js`)).default;
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const rows = {}; let reads = 0, withheld = 0; const towns = new Set();
for (const dbname of dbs) {
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await db.connect();
  const list = (await db.query(`select name, public_slug, unlisted_slug, data, gallery_share_dm dm, gallery_member_overrides ov from public.settlements where public_slug is not null order by public_slug`)).rows;
  for (const sh of list) {
    for (const read of ['gallery', 'link']) {
      await db.query(`select set_config('test.uid', '', false)`); await db.query('set role anon');
      const q = read === 'gallery' ? `select (select to_jsonb(g.data) from public.get_gallery_dossier($1) g) as d` : `select public.get_unlisted_dossier($1) -> 'dossier' as d`;
      const d = (await db.query(q, [read === 'gallery' ? sh.public_slug : sh.unlisted_slug])).rows[0]?.d; await db.query('reset role');
      if (!isRec(d)) continue; reads += 1; towns.add(sh.name);
      const served = new Map((d.npcs || []).filter(isRec).map(n => [n.id ?? n.name, n]));
      const marked = isRec(sh.ov?.$veil); const kind = `${sh.dm ? 'Reveal DM' : 'no reveal'}, ${marked ? ((sh.ov.$veil.deltas || []).length ? 'every eye shut' : 'marked, persons only') : 'unmarked'}`;
      for (const p of (sh.data.npcs || []).filter(isRec)) {
        const s = served.get(p.id ?? p.name); if (!s) continue;
        for (const f of ['role', 'title']) {
          const val = p[f]; if (typeof val !== 'string' || val.length < 4 || typeof s[f] === 'string') continue; withheld += 1;
          const walk = (x, path, rec) => {
            if (typeof x === 'string') { if (x.includes(val) && (x.includes(p.name) || (rec && rec !== s && Object.values(rec).some(y => y === p.id || y === p.name)))) {
              const key = `${f} | ${path.replace(/\[\d+\]/g, '[]')} | ${read} | ${kind}`; const r = rows[key] = rows[key] || { towns: new Set(), n: 0, ex: `${sh.name}: ${p.name}: "${x.slice(0, 80)}"` }; r.towns.add(sh.name); r.n += 1; } }
            else if (Array.isArray(x)) x.forEach((y, i) => walk(y, `${path}[${i}]`, rec));
            else if (isRec(x)) for (const [k, y] of Object.entries(x)) walk(y, `${path}.${k}`, x);
          };
          walk(d, '$', null);
        }
      }
    }
  }
  await db.end();
}
console.log(`roles census over ${dbs.join(',')}: ${towns.size} towns, ${reads} reads, ${withheld} (person, read) pairs whose own card withholds a stored role or title`);
for (const k of Object.keys(rows).sort()) console.log(`${k} | towns ${rows[k].towns.size} | hits ${rows[k].n}\n      e.g. ${rows[k].ex}`);
