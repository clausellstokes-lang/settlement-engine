const SP = '/tmp/claude-0/-home-user-settlement-engine/41bd6027-5844-54f9-b716-fc5eddd88409/scratchpad';
const pg = (await import(`${SP}/pgmod/node_modules/pg/lib/index.js`)).default;
const V = await import(`${SP}/master/src/domain/display/galleryVeil.js`);
const P = await import(`${SP}/master/src/domain/display/publicSafe.js`);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const strs = (o, out = new Set()) => { if (Array.isArray(o)) o.forEach((x) => strs(x, out)); else if (isRec(o)) Object.values(o).forEach((x) => strs(x, out)); else if (typeof o === 'string' && o.trim().length >= 6) out.add(o); return out; };
const a = new pg.Client({ database: 'm203' }); await a.connect(); const b = new pg.Client({ database: 'mfull' }); await b.connect();
let rows = 0, notOnGallery = 0; const ex = [];
for (const r of (await a.query(`select public_slug, data, gallery_member_overrides ov, gallery_share_dm dm from public.settlements where gallery_member_overrides #>> '{$veil,mode}' = 'snapshot' order by public_slug`)).rows) {
  rows++;
  const share = V.readShareMode(r.ov);
  const base = (await a.query(`select case when $2 then public._gallery_dm_full_json($1::jsonb) else public._gallery_sanitize_public_json($1::jsonb) end d`, [JSON.stringify(share.snapshot), r.dm])).rows[0].d;
  const gal203 = strs(V.projectShareVeil(P.toPublicSafe(base, { full: r.dm, memberOverrides: r.ov }), r.ov));
  const map203 = strs((await a.query(`select public.get_gallery_map('mm' || substr($1, 3)) x`, [r.public_slug])).rows[0].x?.members?.[0]?.settlement);
  const map211 = strs((await b.query(`select public.get_gallery_map('mm' || substr($1, 3)) x`, [r.public_slug])).rows[0].x?.members?.[0]?.settlement);
  for (const s of map211) if (!map203.has(s) && !gal203.has(s)) { notOnGallery++; if (ex.length < 5) ex.push(`${r.public_slug}: ${s.slice(0, 100)}`); }
}
console.log({ snapshotRows: rows, mapStringsNewAt211AndNotOn203GalleryPage: notOnGallery, ex });
await a.end(); await b.end();
