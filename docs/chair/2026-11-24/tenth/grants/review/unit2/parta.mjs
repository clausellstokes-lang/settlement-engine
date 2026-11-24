// REVIEW-GRANTS-1 unit (2): part A of 211 (or the owner's file 1) checked by the reviewer's own catalog queries.
// node parta.mjs <upTo> <mig|owner>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { boot211 } from './boot211.mjs';
const ROOT = process.env.ROOT211;
const upTo = Number(process.argv[2] || 210); const mode = process.argv[3] || 'mig';
const mig = readFileSync(join(ROOT, 'supabase/migrations/211_close_visitor_reach.sql'), 'utf8');
const partA = mig.split('════ PART C')[0];
const sigs = [...partA.matchAll(/^revoke execute on function (public\.[^ ]+\(.*?\)) from public, anon, authenticated;$/gm)].map((m) => m[1]);
const regrants = new Set([...partA.matchAll(/^grant execute on function (public\.[^ ]+\(.*?\)) to service_role;$/gm)].map((m) => m[1]));
const out = { upTo, mode, nRevoke: sigs.length, distinct: new Set(sigs).size, nRegrant: regrants.size };
// shape: every non-comment, non-blank line of part A is one of the two shapes
out.otherLines = partA.split('\n').filter((l) => l.trim() && !l.startsWith('--') && !/^revoke execute on function public\.\S+\(.*?\) from public, anon, authenticated;$/.test(l) && !/^grant execute on function public\.\S+\(.*?\) to service_role;$/.test(l));
const B = await boot211({ upTo, mode: 'none' });           // hosted, before
const V = await boot211({ upTo, mode: 'none', hostedDefaults: false }); // intent
const A = await boot211({ upTo, mode });                    // hosted, after 211 (or files 1-4)
const q = (db) => db.query(`select p.oid::regprocedure::text sig, p.prosecdef, p.proacl::text acl,
  has_function_privilege('anon',p.oid,'execute') anon, has_function_privilege('authenticated',p.oid,'execute') auth,
  has_function_privilege('service_role',p.oid,'execute') svc
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'`).then((r) => new Map(r.rows.map((x) => ['public.' + x.sig.replace(/^public\./, ''), x])));
const [b, v, a] = [await q(B.db), await q(V.db), await q(A.db)];
const norm = async (s) => (await B.db.query(`select to_regprocedure($1)::regprocedure::text t`, [s])).rows[0]?.t;
const keyOf = new Map(); for (const s of sigs) { const t = await norm(s); keyOf.set(s, t ? 'public.' + t.replace(/^public\./, '') : null); }
out.missingBefore = sigs.filter((s) => !keyOf.get(s));
const listKeys = new Set([...keyOf.values()].filter(Boolean));
out.intendedForUsers = [...listKeys].filter((k) => v.get(k) && (v.get(k).anon || v.get(k).auth)).map((k) => k + ' ' + v.get(k).acl);
out.regrantNotIntended = [...regrants].filter((s) => { const k = keyOf.get(s); return k && !/service_role=X/.test(v.get(k)?.acl || ''); });
out.svcIntendedNotRegranted = sigs.filter((s) => { const k = keyOf.get(s); return k && /service_role=X/.test(v.get(k)?.acl || '') && !regrants.has(s); });
out.openBefore = [...listKeys].filter((k) => b.get(k)?.anon || b.get(k)?.auth).length;
out.openAfter = [...listKeys].filter((k) => a.get(k)?.anon || a.get(k)?.auth);
out.changedOutside = [...a.keys()].filter((k) => !listKeys.has(k) && b.get(k) && (b.get(k).anon !== a.get(k).anon || b.get(k).auth !== a.get(k).auth));
out.newInAfter = [...a.keys()].filter((k) => !b.has(k)).map((k) => k + ' anon=' + a.get(k).anon + ' auth=' + a.get(k).auth);
out.intendedLost = [...v.keys()].filter((k) => (v.get(k).anon && !a.get(k)?.anon) || (v.get(k).auth && !a.get(k)?.auth));
out.svcLost = [...b.keys()].filter((k) => b.get(k).svc && a.get(k) && !a.get(k).svc);
out.svcCannotAfter = [...listKeys].filter((k) => !a.get(k)?.svc);
// Still open after (any public SECURITY DEFINER function anon or authenticated can run whose intent is SERVER/NOBODY)
out.serverIntentStillOpen = [...a.keys()].filter((k) => a.get(k).prosecdef && (a.get(k).anon || a.get(k).auth) && v.get(k) && !v.get(k).anon && !v.get(k).auth && !/=X\//.test((v.get(k).acl || '').replace(/(postgres|service_role)=X\/postgres/g, '')) && v.get(k).acl !== null);
// dependencies and expression text
const names = [...new Set([...listKeys].map((k) => k.replace(/^public\./, '').replace(/\(.*$/, '')))];
const exprs = (await A.db.query(`
  select 'policy '||polname||' on '||polrelid::regclass as what, coalesce(pg_get_expr(polqual, polrelid),'')||' '||coalesce(pg_get_expr(polwithcheck, polrelid),'') as txt from pg_policy
  union all select 'view '||schemaname||'.'||viewname, definition from pg_views where schemaname not in ('pg_catalog','information_schema')
  union all select 'matview '||matviewname, definition from pg_matviews
  union all select 'default '||adrelid::regclass||'.'||adnum, pg_get_expr(adbin, adrelid) from pg_attrdef
  union all select 'constraint '||conname||' on '||conrelid::regclass, pg_get_constraintdef(oid) from pg_constraint where conbin is not null
  union all select 'index '||indexrelid::regclass, pg_get_indexdef(indexrelid) from pg_index
  union all select 'trigger '||tgname||' on '||tgrelid::regclass, pg_get_triggerdef(oid) from pg_trigger where not tgisinternal`)).rows;
const wre = (n) => new RegExp(`(^|[^A-Za-z0-9_])${n}\\s*\\(`, 'i');
out.exprHits = []; for (const n of names) for (const e of exprs) if (wre(n).test(e.txt)) out.exprHits.push(n + ' @ ' + e.what);
const deps = (await A.db.query(`select d.refobjid::regprocedure::text fn, d.classid::regclass::text cls from pg_depend d
  where d.refclassid='pg_proc'::regclass and d.classid in ('pg_policy'::regclass,'pg_rewrite'::regclass,'pg_attrdef'::regclass,'pg_constraint'::regclass,'pg_class'::regclass,'pg_trigger'::regclass)
  and d.refobjid = any (select to_regprocedure(x)::oid from unnest($1::text[]) x)`, [[...listKeys]])).rows;
out.dependHits = deps.map((d) => d.fn + ' <- ' + d.cls);
const procs = (await A.db.query(`select p.oid::regprocedure::text sig, p.proname, p.prosecdef, p.prorettype='trigger'::regtype trig,
  has_function_privilege('anon',p.oid,'execute') anon, has_function_privilege('authenticated',p.oid,'execute') auth, p.prosrc
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace join pg_language l on l.oid=p.prolang
  where n.nspname not in ('pg_catalog','information_schema') and l.lanname not in ('c','internal')`)).rows;
out.invokerCallers = []; out.definerCallerCount = 0;
for (const n of names) for (const p of procs) {
  if (p.proname === n || !wre(n).test(p.prosrc || '')) continue;
  if (p.prosecdef) { out.definerCallerCount++; continue; }
  out.invokerCallers.push(`${n} <- ${p.sig} trig=${p.trig} anon=${p.anon} auth=${p.auth}`);
}
console.log(JSON.stringify(out, null, 1));
