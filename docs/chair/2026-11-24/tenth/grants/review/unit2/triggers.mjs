// Triggers on settlements and saved_maps (order, timing, function, invoker/definer), column defaults of the
// guarded columns, and every function body that assigns a guarded column.
import { boot211 } from './boot211.mjs';
const upTo = Number(process.argv[2] || 210); const mode = process.argv[3] || 'mig';
const { db } = await boot211({ upTo, mode });
const trig = (await db.query(`select c.relname tbl, t.tgname, pg_get_triggerdef(t.oid) def, p.proname fn, p.prosecdef definer
  from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_proc p on p.oid=t.tgfoid
  where c.relname in ('settlements','saved_maps') and not t.tgisinternal order by c.relname, t.tgname`)).rows;
for (const t of trig) console.log('T', t.tbl, t.tgname, t.definer ? 'DEFINER' : 'INVOKER', t.def.replace(/^CREATE TRIGGER \S+ /, '').slice(0, 140));
const cols = ['moderation_banned_at','moderation_banned_by','moderation_ban_reason','admin_deleted_at','is_featured','featured_order','is_curated','curated_order','view_count','import_count','retention_expires_at','inactive_reason','inactive_since','reactivated_free_at'];
const cd = (await db.query(`select c.relname tbl, a.attname col, format_type(a.atttypid,a.atttypmod) typ, a.attnotnull nn, pg_get_expr(d.adbin,d.adrelid) def
  from pg_attribute a join pg_class c on c.oid=a.attrelid left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
  where c.relname in ('settlements','saved_maps') and c.relnamespace='public'::regnamespace and a.attname = any($1) and not a.attisdropped order by 1,2`, [cols])).rows;
for (const c of cd) console.log('C', c.tbl, c.col, c.typ, c.nn ? 'NOT NULL' : '', 'default=', c.def);
// functions whose body assigns a guarded column of these tables
const fns = (await db.query(`select p.oid::regprocedure::text sig, p.prosecdef, p.prorettype='trigger'::regtype trig,
  has_function_privilege('authenticated',p.oid,'execute') auth, has_function_privilege('anon',p.oid,'execute') anon, p.prosrc
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'`)).rows;
const re = new RegExp(`(update\\s+(public\\.)?(settlements|saved_maps)|new\\.(${cols.join('|')})\\s*:?=|insert\\s+into\\s+(public\\.)?(settlements|saved_maps))`, 'i');
for (const f of fns) if (re.test(f.prosrc || '')) {
  const hits = [...new Set((f.prosrc.match(new RegExp(`\\b(${cols.join('|')})\\b`, 'gi')) || []).map((x) => x.toLowerCase()))];
  console.log('F', f.prosecdef ? 'DEFINER' : 'INVOKER', f.trig ? 'TRIG' : '', 'auth=' + f.auth, 'anon=' + f.anon, f.sig, '| guarded cols named:', hits.join(','));
}
