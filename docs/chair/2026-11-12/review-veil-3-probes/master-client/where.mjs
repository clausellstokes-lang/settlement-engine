const SP = '/tmp/claude-0/-home-user-settlement-engine/41bd6027-5844-54f9-b716-fc5eddd88409/scratchpad';
const pg = (await import(`${SP}/pgmod/node_modules/pg/lib/index.js`)).default;
const db = new pg.Client({ database: 'mfull' }); await db.connect();
const needle = process.argv[2];
const rows = (await db.query(`select public_slug, data, gallery_member_overrides ov from public.settlements where data::text like '%' || $1 || '%' order by public_slug`, [needle])).rows;
const find = (o, p = '', out = []) => { if (o && typeof o === 'object') { for (const [k, v] of Object.entries(o)) find(v, p + '.' + k, out); } else if (typeof o === 'string' && o.includes(needle)) out.push(p); return out; };
for (const r of rows.slice(0, 3)) {
  const g = (await db.query('select data from public.get_gallery_dossier($1)', [r.public_slug])).rows[0];
  const d = (r.ov?.$veil?.deltas || []);
  console.log(r.public_slug, 'raw at', find(r.data).join(' '), '| served at', find(g?.data).join(' '), '| deltas', d.length, 'hidden', d.filter(x => x.hidden).length, '| relationship deltas e.g.', JSON.stringify(d.filter(x => /relationship/.test(x.address)).slice(0, 3)));
}
await db.end();
