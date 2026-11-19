// REVIEW-VEIL-9 · V9-7 BY DIRECTION (the chair's VR15: a class where the TWIN is the stricter is a LEAK on the server).
// For every share on RV9_DBS (the differ corpus stored by differ-server.probe.jsx): the server's gallery read against
// the twin's projection of the same STORED row; every leaf path that differs, normalised ([] for an index), classed:
// SERVER ONLY (the server sends what the twin withholds: the leak direction), TWIN ONLY (the server the stricter),
// BOTH, DIFFERENT VALUE. Counted by share and by veil kind (reveal; every eye shut or the default). Writes RV9_OUT.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: {}, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const flat = (v, p, out) => { if (Array.isArray(v)) v.forEach((x, i) => flat(x, `${p}[${i}]`, out)); else if (isRec(v)) for (const k of Object.keys(v)) flat(v[k], `${p}.${k}`, out); else out.set(p, JSON.stringify(v)); return out; };
it('REVIEW-VEIL-9: server against twin, by direction', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const veil = await import(`${process.env.RV6_SRC}/src/domain/display/galleryVeil.js`);
  const rows = {}; let shares = 0; let differ = 0;
  for (const dbn of process.env.RV9_DBS.split(',')) {
    const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid','',false)`);
    const ids = (await db.query(`select public_slug from settlements where public_slug is not null order by public_slug`)).rows.map((r) => r.public_slug);
    for (const slug of ids) {
      const r = (await db.query(`select data, gallery_member_overrides ov, gallery_share_dm dm from settlements where public_slug = $1`, [slug])).rows[0];
      const server = (await db.query('select * from public.get_gallery_dossier($1)', [slug])).rows[0]?.data;
      const twin = JSON.parse(JSON.stringify(veil.projectShareVeil(veil.galleryPayloadFor(r.data, { shareDm: r.dm, memberOverrides: {} }), r.ov)));
      const kind = `${r.dm ? 'DM on' : 'DM off'} | ${(r.ov.$veil.deltas || []).length ? 'every eye shut' : 'default'}`;
      const a = flat(server, '', new Map()); const b = flat(twin, '', new Map()); shares += 1; let d = 0;
      const seen = new Set(); const hit = (cls, p, ex) => { const np = p.replace(/\[\d+\]/g, '[]'); const k = `${cls} | ${kind} | ${np}`; d += 1; if (seen.has(k)) return; seen.add(k); const x = rows[k] = rows[k] || { shares: 0, ex }; x.shares += 1; };
      for (const [p, v] of a) { if (!b.has(p)) { if (v !== 'null' && v !== '""' && v !== undefined) hit('SERVER ONLY', p, `${slug}: ${v.slice(0, 120)}`); } else if (b.get(p) !== v) hit('DIFFERENT VALUE', p, `${slug}: server ${v.slice(0, 90)} | twin ${String(b.get(p)).slice(0, 90)}`); }
      for (const [p, v] of b) if (!a.has(p) && v !== 'null' && v !== '""') hit('TWIN ONLY', p, `${slug}: ${String(v).slice(0, 120)}`);
      if (d) differ += 1;
    }
    await db.end();
  }
  const lines = [`shares ${shares}, differing ${differ}`];
  for (const k of Object.keys(rows).sort()) lines.push(`${k} | shares ${rows[k].shares}\n      e.g. ${rows[k].ex}`);
  writeFileSync(process.env.RV9_OUT, lines.join('\n') + '\n');
}, 7_200_000);
