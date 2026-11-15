// VEIL-16: per-function self time (pg_stat_user_functions, track_functions=all) of N link reads of one stored town.
import { readFileSync } from 'node:fs';
const [pgmod, file, n, db, q0] = process.argv.slice(2);
const pg = (await import(`${pgmod}/node_modules/pg/lib/index.js`)).default;
const text = readFileSync(file, 'utf8'); const rec = JSON.parse(text);
const c = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: db }); await c.connect();
await c.query("delete from public.settlements where public_slug = 'v16p'");
await c.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
  values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', $1, $2, $3, true, 'v16p', now(), 'v16pl', 'unlisted', $4, false, true)`, [String(rec.name || 'T'), String(rec.tier || 'town'), text, process.env.VEIL || '{}']);
await c.query("set track_functions = 'all'"); await c.query('select pg_stat_reset()'); await c.query('select pg_stat_clear_snapshot()');
const q = q0 || "select length(public.get_unlisted_dossier('v16pl')::text)";
const t0 = Date.now(); for (let i = 0; i < Number(n); i += 1) await c.query(q); const wall = Date.now() - t0;
await new Promise((r) => setTimeout(r, 800)); await c.query("select pg_stat_force_next_flush()").catch(() => {});
await c.query('select pg_stat_clear_snapshot()');
const r = await c.query("select funcname, calls, round(total_time::numeric,1) tot, round(self_time::numeric,1) self from pg_stat_user_functions order by self_time desc limit 25");
console.log(`wall ${wall} ms for ${n}`); for (const x of r.rows) console.log(`${x.funcname.padEnd(42)} calls ${String(x.calls).padStart(8)} total ${String(x.tot).padStart(9)} self ${String(x.self).padStart(9)}`);
await c.query("delete from public.settlements where public_slug = 'v16p'"); await c.end();
