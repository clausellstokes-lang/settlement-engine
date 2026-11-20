// R3-TELL unit 1 (a surprise checked at once): the served people whose role names a criminal trade, under Reveal DM and the
// owner's own setting, where that trade's house is hidden whole: the person served (keys), and every served string naming
// the hidden houses. Twin and server. RV9_ONLY=<seeds>.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, leaves, OPEN } from './tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC; const ONLY = new Set(process.env.RV9_ONLY.split(','));
it('roles', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.RV9_DB }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  const server = async (rec, dm, ov) => { const id = 'abcd7f00-0000-0000-0000-000000000001'; const sl = 'roles1';
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable) values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d; await db.query('delete from public.settlements where id = $1', [id]); return d; };
  const out = [];
  for (const b of E.pool(2, [0, 1])) {
    if (!ONLY.has(b.seed)) continue;
    const A = E.birth(b.cfg, b.seed, null); const hidden = (A.institutions || []).filter((h) => E.isHideableHouse(h));
    const ov = V.write(V.opened(OPEN));
    const RE = /guildmaster|gang boss|black marketeer|smuggler/i;
    const stored = (A.npcs || []).filter((n) => RE.test(String(n.role)) || RE.test(String(n.title))).map((n) => ({ name: n.name, role: n.role, institution: n.institution, memberships: n.memberships, category: n.category }));
    const r = { seed: b.seed, hidden: hidden.map((h) => `${h.name} [${h.id ?? h.catalogId}]`), stored };
    for (const [eng, d] of [['twin', V.twin(A, true, ov)], ['server', await server(A, true, ov)]]) {
      r[eng] = { people: (d.npcs || []).filter((n) => RE.test(String(n.role)) || RE.test(String(n.title))).map((n) => ({ keys: Object.keys(n).sort().join(','), name: n.name, role: n.role, title: n.title, category: n.category, institution: n.institution, memberships: n.memberships })),
        houseNameHits: [...leaves(d)].filter(([, v]) => hidden.some((h) => String(v).toLowerCase().includes(String(h.name).toLowerCase()))).map(([p, v]) => `${p}=${String(v).slice(0, 80)}`).slice(0, 12) };
    }
    out.push(r);
  }
  await db.end(); writeFileSync(process.env.RV9_OUT, JSON.stringify(out, null, 1));
}, 600000);
