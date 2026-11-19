// REVIEW-VEIL-9 — THE DEFAULT VEIL, PEOPLE LEFT ON. For every born town a cold run stored (RV9_SRC_DBS, the stored
// `data` of each distinct town), a share marked by the tree's own writer with NO hand hide (writeShareVeil({}, []):
// the default set alone), Reveal DM on and off, stored on RV9_DB (cloned from RV9_TPL). Read afterwards by SQL.
import { it, vi } from 'vitest';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
it('REVIEW-VEIL-9: default-veil shares', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${process.env.RV9_DB} with (force)`); await admin.query(`create database ${process.env.RV9_DB} template ${process.env.RV9_TPL}`); await admin.end();
  const dst = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.RV9_DB }); await dst.connect();
  let n = 0;
  for (const src of process.env.RV9_SRC_DBS.split(',')) {
    const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: src }); await db.connect();
    const rows = (await db.query(`select distinct on (name) name, tier, data from public.settlements where public_slug is not null and not gallery_share_narrated order by name, public_slug`)).rows;
    for (const r of rows) for (const dm of [false, true]) { n += 1;
      const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
      const id = `abcd9d00-0000-0000-0000-${String(n).padStart(12, '0')}`;
      await dst.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
        values ($1,'11111111-1111-1111-1111-111111111111',$2,$3,$4,true,$5,now(),$6,'unlisted',$7,$8,true,false)`, [id, r.name, r.tier, JSON.stringify(r.data), `dv${n}`, `dvl${n}`, JSON.stringify(ov), dm]); }
    await db.end();
  }
  await dst.end(); console.log(`stored ${n}`);
}, 14_400_000);
