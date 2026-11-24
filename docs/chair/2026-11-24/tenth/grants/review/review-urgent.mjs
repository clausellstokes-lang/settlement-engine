// REVIEW-GRANTS-1: independent check of FOR-THE-OWNER-URGENT.sql. Loads migrations with the seat's
// boot.mjs (allowed by the prompt); every catalog query below is the reviewer's own. Run from repo root:
//   node docs/chair/2026-11-24/tenth/grants/review/review-urgent.mjs [upTo=210]
import { readFileSync, writeFileSync } from 'node:fs';
import { boot } from '../measure/boot.mjs';

const upTo = Number(process.argv[2] || 210);
const FILE = 'docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-URGENT.sql';
const sqlText = readFileSync(FILE, 'utf8');
const doLines = sqlText.split('\n').filter((l) => l.startsWith('do $$'));
const sigs = [];
const lineRe = /^do \$\$ begin if to_regprocedure\('([^']+)'\) is not null then revoke execute on function (.+?) from public, anon, authenticated; end if; end \$\$;$/;
for (const l of doLines) {
  const m = lineRe.exec(l);
  if (!m) throw new Error('UNEXPECTED SHAPE: ' + l);
  if (m[1] !== m[2]) throw new Error('GUARD/REVOKE MISMATCH: ' + l);
  sigs.push(m[1]);
}
const valSigs = (blk) => [...blk.matchAll(/^    \(([12]), '([^']+)'\)/gm)].map((m) => m[2]);
const parts = sqlText.split('-- ══ BLOCK');
const b0 = valSigs(parts[1]); const b2 = valSigs(parts[3]);
const same = (a, b) => a.length === b.length && [...a].sort().join('|') === [...b].sort().join('|');
const out = { upTo, nDo: sigs.length, nDistinct: new Set(sigs).size, block0Same: same(sigs, b0), block2Same: same(sigs, b2) };

const H = await boot({ hostedDefaults: true, upTo });
const V = await boot({ hostedDefaults: false, upTo });
out.failuresHosted = H.failures.length; out.failuresVanilla = V.failures.length;

const priv = async (db, sig) => (await db.query(`
  select p.oid::int as oid, p.proname, p.prosecdef, p.proacl::text as acl,
    has_function_privilege('anon', p.oid, 'execute') as anon,
    has_function_privilege('authenticated', p.oid, 'execute') as auth,
    has_function_privilege('service_role', p.oid, 'execute') as svc
  from pg_proc p where p.oid = to_regprocedure($1)`, [sig])).rows[0] || null;

const allExec = async (db) => (await db.query(`
  select p.oid::regprocedure::text as sig, p.prosecdef,
    has_function_privilege('anon', p.oid, 'execute') as anon,
    has_function_privilege('authenticated', p.oid, 'execute') as auth,
    has_function_privilege('service_role', p.oid, 'execute') as svc
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'`)).rows;

// (ii) intent from the vanilla replay
const rows = [];
for (const sig of sigs) {
  const h = await priv(H.db, sig); const v = await priv(V.db, sig);
  rows.push({ sig, existsHosted: !!h, existsVanilla: !!v, hosted: h && { anon: h.anon, auth: h.auth, svc: h.svc, secdef: h.prosecdef },
    vanillaAcl: v && v.acl, vanilla: v && { anon: v.anon, auth: v.auth, svc: v.svc } });
}
out.missing = rows.filter((r) => !r.existsHosted).map((r) => r.sig);
out.intendedForUsers = rows.filter((r) => r.vanilla && (r.vanilla.anon || r.vanilla.auth)).map((r) => ({ sig: r.sig, acl: r.vanillaAcl }));
out.svcNotExplicitVanilla = rows.filter((r) => r.vanilla && !(r.vanillaAcl || '').includes('service_role=')).map((r) => ({ sig: r.sig, acl: r.vanillaAcl }));
out.notExecByUsersBefore = rows.filter((r) => r.hosted && !r.hosted.anon && !r.hosted.auth).map((r) => r.sig);
out.invokerInList = rows.filter((r) => r.hosted && !r.hosted.secdef).map((r) => r.sig);

// (ii) dependencies: pg_depend from policy / rewrite / attrdef / constraint / index / trigger onto each function,
// AND a text search of the deparsed expressions (belt and braces).
const oids = rows.filter((r) => r.existsHosted).map((r) => r.sig);
const deps = (await H.db.query(`
  select d.refobjid::regprocedure::text as fn, d.classid::regclass::text as cls, d.objid::int as objid
  from pg_depend d where d.refclassid = 'pg_proc'::regclass
   and d.refobjid = any (select to_regprocedure(x)::oid from unnest($1::text[]) x)
   and d.classid in ('pg_policy'::regclass, 'pg_rewrite'::regclass, 'pg_attrdef'::regclass, 'pg_constraint'::regclass, 'pg_class'::regclass, 'pg_trigger'::regclass)`, [oids])).rows;
out.dependsOn = deps;
const exprs = (await H.db.query(`
  select 'policy '||polname||' on '||polrelid::regclass as what, coalesce(pg_get_expr(polqual, polrelid),'')||' '||coalesce(pg_get_expr(polwithcheck, polrelid),'') as txt from pg_policy
  union all select 'view '||schemaname||'.'||viewname, definition from pg_views where schemaname not in ('pg_catalog','information_schema')
  union all select 'matview '||schemaname||'.'||matviewname, definition from pg_matviews
  union all select 'default '||adrelid::regclass||'.'||adnum, pg_get_expr(adbin, adrelid) from pg_attrdef
  union all select 'constraint '||conname||' on '||conrelid::regclass, pg_get_constraintdef(oid) from pg_constraint where contype in ('c','x') or conbin is not null
  union all select 'index '||indexrelid::regclass, pg_get_indexdef(indexrelid) from pg_index
  union all select 'trigger '||tgname||' on '||tgrelid::regclass, pg_get_triggerdef(oid) from pg_trigger where not tgisinternal`)).rows;
const names = [...new Set(sigs.map((s) => s.replace(/^public\./, '').replace(/\(.*$/, '')))];
const wre = (n) => new RegExp(`(^|[^A-Za-z0-9_])${n}\\s*\\(`, 'i');
out.exprHits = [];
for (const n of names) for (const e of exprs) if (wre(n).test(e.txt)) out.exprHits.push({ name: n, where: e.what });
// WHEN clauses of triggers are in pg_get_triggerdef; trigger FUNCTIONS are below.

// (ii) callers: every function (any schema but pg_catalog/information_schema) whose body names a listed function.
const procs = (await H.db.query(`
  select p.oid::regprocedure::text as sig, p.prosecdef, p.prorettype = 'trigger'::regtype as is_trigger, p.prosrc,
    has_function_privilege('anon', p.oid, 'execute') as anon, has_function_privilege('authenticated', p.oid, 'execute') as auth
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname not in ('pg_catalog','information_schema') and p.prolang not in (select oid from pg_language where lanname in ('c','internal'))`)).rows;
const procs2 = (await H.db.query(`select p.oid::regprocedure::text as sig, l.lanname from pg_proc p join pg_language l on l.oid=p.prolang join pg_namespace n on n.oid=p.pronamespace where n.nspname not in ('pg_catalog','information_schema')`)).rows;
out.callers = [];
for (const n of names) for (const p of procs) {
  if (p.sig.replace(/^public\./, '').replace(/\(.*$/, '') === n) continue;
  if (wre(n).test(p.prosrc || '') || new RegExp(`['"%.]${n}['"(]`).test(p.prosrc || '')) {
    out.callers.push({ name: n, caller: p.sig, secdef: p.prosecdef, trigger: p.is_trigger, anon: p.anon, auth: p.auth });
  }
}
out.invokerCallersReachable = out.callers.filter((c) => !c.secdef && (c.anon || c.auth || c.trigger));

// (iv) apply the file twice; compare catalogs.
const before = await allExec(H.db);
const block1 = sqlText.split('-- ══ BLOCK 1')[1].split('-- ══ BLOCK 2')[0].replace(/^[^\n]*\n/, '');
await H.db.exec(block1); await H.db.exec(block1);
// whole file too (reads + block 1), to see it runs as the owner would run it
await H.db.exec(sqlText).catch((e) => { out.wholeFileError = String(e.message); });
const after = await allExec(H.db);
const bmap = new Map(before.map((r) => [r.sig, r]));
const listSet = new Set(sigs.map((s) => s));
const changed = []; const lostSvc = [];
for (const a of after) {
  const b = bmap.get(a.sig);
  if (!b) continue;
  if (b.anon !== a.anon || b.auth !== a.auth) changed.push({ sig: a.sig, before: [b.anon, b.auth], after: [a.anon, a.auth] });
  if (b.svc && !a.svc) lostSvc.push(a.sig);
}
// normalise regprocedure text to the file's spelling: compare by to_regprocedure oid
const listOids = new Set((await H.db.query(`select to_regprocedure(x)::oid::int as o from unnest($1::text[]) x`, [sigs])).rows.map((r) => r.o));
const sigOid = new Map((await H.db.query(`select p.oid::regprocedure::text as sig, p.oid::int as o from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'`)).rows.map((r) => [r.sig, r.o]));
out.changedOutsideList = changed.filter((c) => !listOids.has(sigOid.get(c.sig)));
out.changedInList = changed.filter((c) => listOids.has(sigOid.get(c.sig))).length;
out.lostServiceRole = lostSvc;
const aft = (await Promise.all(sigs.map((s) => priv(H.db, s)))).filter(Boolean);
out.stillExecutableAfter = aft.filter((r) => r.anon || r.auth).map((r) => r.proname);
out.svcMissingAfter = aft.filter((r) => !r.svc).map((r) => r.proname);
// intended grants preserved: every function the VANILLA replay lets anon/authenticated execute is still so after.
const vAll = await allExec(V.db);
const aMap = new Map(after.map((r) => [r.sig, r]));
out.intendedLost = vAll.filter((v) => (v.anon && !aMap.get(v.sig)?.anon) || (v.auth && !aMap.get(v.sig)?.auth)).map((v) => v.sig);
out.vanillaUserExecCount = { anon: vAll.filter((v) => v.anon).length, auth: vAll.filter((v) => v.auth).length };
writeFileSync(`docs/chair/2026-11-24/tenth/grants/review/out-review-${upTo}.json`, JSON.stringify({ out, rows }, null, 1));
const brief = { ...out }; delete brief.callers; delete brief.dependsOn;
console.log(JSON.stringify(brief, null, 1));
console.log('callers (all):', out.callers.length);
for (const c of out.callers) console.log(' ', c.name, '<-', c.caller, c.secdef ? 'DEFINER' : 'INVOKER', c.trigger ? 'TRIGGER' : '', 'anon=' + c.anon, 'auth=' + c.auth);
console.log('pg_depend hits:', JSON.stringify(out.dependsOn));
