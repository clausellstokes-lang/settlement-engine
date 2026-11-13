const SP = '/tmp/claude-0/-home-user-settlement-engine/41bd6027-5844-54f9-b716-fc5eddd88409/scratchpad';
const pg = (await import(`${SP}/pgmod/node_modules/pg/lib/index.js`)).default;
const V = await import(`${SP}/master/src/domain/display/galleryVeil.js`);
const P = await import(`${SP}/master/src/domain/display/publicSafe.js`);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const paths = (o, p = '', out = new Map()) => { if (Array.isArray(o)) o.forEach((x) => paths(x, `${p}[]`, out)); else if (isRec(o)) for (const [k, v] of Object.entries(o)) paths(v, p ? `${p}.${k}` : k, out); else if (typeof o === 'string' && o.trim().length >= 6) { if (!out.has(o)) out.set(o, p); } return out; };
const hist = {};
for (const DB of process.argv.slice(2)) {
  const db = new pg.Client({ database: DB }); await db.connect();
  const rows = (await db.query(`select public_slug, gallery_share_dm dm from public.settlements order by public_slug`)).rows.filter((r) => (Number(r.public_slug.slice(2)) - 1) % 8 !== 3);
  for (const r of rows) {
    const g = (await db.query('select data, gallery_member_overrides o from public.get_gallery_dossier($1)', [r.public_slug])).rows[0];
    if (!g) continue;
    const page = paths(V.projectShareVeil(P.toPublicSafe(g.data, { full: r.dm, memberOverrides: g.o }), g.o));
    for (const [s, p] of paths({ data: g.data, overrides: g.o })) if (!page.has(s)) { const k = `${DB} ${p}`; hist[k] = (hist[k] || 0) + 1; }
  }
  await db.end();
}
for (const [k, v] of Object.entries(hist).sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(String(v).padStart(5), k);
