const SP = '/tmp/claude-0/-home-user-settlement-engine/f87af9a7-d5c7-5553-9326-6c79fdba1af5/scratchpad';
const pg = (await import(`${SP}/pgmod/node_modules/pg/lib/index.js`)).default;
const V = await import(`${SP}/master/src/domain/display/galleryVeil.js`);
const P = await import(`${SP}/master/src/domain/display/publicSafe.js`);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const paths = (o, p = '', out = new Map()) => { if (Array.isArray(o)) o.forEach((x, i) => paths(x, `${p}[]`, out)); else if (isRec(o)) for (const [k, v] of Object.entries(o)) paths(v, p ? `${p}.${k}` : k, out); else if (typeof o === 'string' && o.trim().length >= 6) { if (!out.has(o)) out.set(o, p); } return out; };
const hist = {};
for (const DB of process.argv.slice(2)) {
  const db = new pg.Client({ database: DB }); await db.connect();
  const rows = (await db.query(`select public_slug, data, gallery_member_overrides ov, gallery_share_dm dm from public.settlements order by public_slug`)).rows;
  for (const r of rows) {
    const share = V.readShareMode(r.ov);
    const src = share.mode === 'snapshot' && share.snapshot ? share.snapshot : r.data;
    // master's page at 203: master projection of the (203) server's sanitised data + master's veil with the STORED overrides
    const base = (await db.query(`select case when $2 then public._gallery_dm_full_json($1::jsonb) else public._gallery_sanitize_public_json($1::jsonb) end d`, [JSON.stringify(src), r.dm])).rows[0].d;
    const page203 = V.projectShareVeil(P.toPublicSafe(base, { full: r.dm, memberOverrides: r.ov }), r.ov);
    const g = (await db.query('select data, gallery_member_overrides o from public.get_gallery_dossier($1)', [r.public_slug])).rows[0];
    if (!g) continue;
    const page211 = V.projectShareVeil(P.toPublicSafe(g.data, { full: r.dm, memberOverrides: g.o }), g.o);
    const A = paths(page203); const B = paths(page211);
    for (const [s, p] of B) if (!A.has(s)) { const k = `${DB} ${p.replace(/\[\]/g, '[]')}`; hist[k] = (hist[k] || 0) + 1; }
  }
  await db.end();
}
for (const [k, v] of Object.entries(hist).sort((a, b) => b[1] - a[1])) console.log(String(v).padStart(5), k);
