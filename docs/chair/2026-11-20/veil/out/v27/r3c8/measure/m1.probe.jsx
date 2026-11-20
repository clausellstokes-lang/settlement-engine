// R3-CURE-8 unit 1 (VEIL-27's builder): the ten towns of R3-TELL STOP 1, read raw, twin and server, availableServices only.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, clone } from '../../tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const TEN = new Set(['r3m-metropolis-politically_fractured-0-60', 'r3m-metropolis-insurgency-1-124', 'r3m-city-infiltrated-0-42', 'r3m-metropolis-politically_fractured-0-70', 'r3m-metropolis-wartime-1-139',
  'r3m-town-none-0-21', 'r3m-town-insurgency-0-14', 'r3m-town-under_siege-0-18', 'r3m-town-infiltrated-0-22', 'r3m-town-under_siege-1-98']);
it('m1', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = 'c8_m1'; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  let nrow = 0;
  const server = async (rec, dm, ov) => {
    nrow += 1; const id = `abcd7e99-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `m1x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  const out = [];
  for (const b of E.pool(2, [0, 1])) {
    if (!TEN.has(b.seed)) continue;
    E.state.dial = null; const A = E.birth(b.cfg, b.seed, null);
    const hidden = (A.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => h.name);
    const rec = { seed: b.seed, hidden, raw: A.availableServices?.criminal, pub: {}, twin: {}, server: {} };
    for (const dm of [false, true]) {
      const st = V.settings(A, dm);
      rec.pub[dm] = V.veil.galleryPayloadFor(clone(A), { shareDm: dm, memberOverrides: null }).availableServices?.criminal;
      for (const k of ['own', 'off', 'g:100', 'g:000', 'allOpen']) {
        const ov = V.write(st.deltas[k]);
        rec.twin[`${dm}|${k}`] = V.twin(A, dm, ov)?.availableServices?.criminal;
        rec.server[`${dm}|${k}`] = (await server(A, dm, ov))?.availableServices?.criminal;
      }
    }
    out.push(rec);
  }
  await db.end();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out, null, 1));
}, 3_600_000);
