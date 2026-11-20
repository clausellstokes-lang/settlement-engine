// R3-CURE-8 unit 1 (VEIL-27's builder): one town of STOP 1, 212's stages one by one on the twin's own projection, criminal rows after each.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, clone } from '../../tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC; const ONLY = (process.env.RV9_ONLY || 'r3m-town-under_siege-0-18').split(',');
it('m2', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.RV9_SERVER_TPL }); await db.connect();
  const out = [];
  for (const b of E.pool(2, [0, 1])) {
    if (!ONLY.includes(b.seed)) continue;
    E.state.dial = null; const A = E.birth(b.cfg, b.seed, null);
    const st = V.settings(A, false); const ov = V.write(st.deltas.own);
    const pub = V.veil.galleryPayloadFor(clone(A), { shareDm: false, memberOverrides: ov });
    const q = await db.query(`with r as (select public._gallery_veil_resolve($1::jsonb, $2::jsonb, false, array(select distinct public._gallery_veil_npc_id(c.card) from public._gallery_veil_cards($1::jsonb, 'npc') c)) res),
      a as (select public._gallery_veil_apply($1::jsonb, res) b1, res from r), c as (select b1, res, public._gallery_veil_roster_choices(b1, $1::jsonb) b2 from a)
      select res, b1 #> '{availableServices,criminal}' c1, b2 #> '{availableServices,criminal}' c2, public._gallery_veil_withhold_always(b2) #> '{availableServices,criminal}' c3,
             (public._gallery_veil($1::jsonb, $2::jsonb, false)) #> '{body,availableServices,criminal}' cv from c`, [JSON.stringify(pub), JSON.stringify(ov)]);
    out.push({ seed: b.seed, pubCrim: pub.availableServices?.criminal, twin: V.twin(A, false, ov).availableServices?.criminal, ...q.rows[0] });
  }
  await db.end();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out, null, 1));
}, 3_600_000);
