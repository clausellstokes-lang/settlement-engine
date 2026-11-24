import { boot } from './boot.mjs';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
const Q = `
  select p.oid, p.oid::regprocedure::text as regproc, p.proname as name, pg_get_function_identity_arguments(p.oid) as args,
         p.prosecdef as secdef, p.prokind as kind, format_type(p.prorettype, null) as rettype,
         p.proacl::text as acl, obj_description(p.oid, 'pg_proc') as descr, p.prosrc as body,
         p.proargnames as argnames,
         has_function_privilege('anon', p.oid, 'execute') as anon,
         has_function_privilege('authenticated', p.oid, 'execute') as authd,
         has_function_privilege('service_role', p.oid, 'execute') as svc
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.prokind in ('f','p')
     and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
   order by 1`;
const A = await boot({ hostedDefaults: true });
const B = await boot({ hostedDefaults: false });
const fa = (await A.db.query(Q)).rows;
const fb = new Map((await B.db.query(Q)).rows.map((r) => [r.name + '(' + r.args + ')', r]));
// functions referenced by RLS policies / views (must stay callable by the querying role)
const pol = (await A.db.query(`select tablename, policyname, cmd, roles::text, qual, with_check from pg_policies where schemaname='public'`)).rows;
const views = (await A.db.query(`select viewname, definition from pg_views where schemaname='public'`)).rows;
writeFileSync(new URL('./out/views.json', import.meta.url), JSON.stringify(views, null, 1));
const polText = pol.map((p) => (p.qual || '') + ' ' + (p.with_check || '')).join('\n') + views.map((v) => v.definition).join('\n');
const DIRECT = /auth\.uid\(\)|auth\.role\(\)|auth\.jwt\(\)|request\.jwt|current_user\b|session_user\b/i;
const guard = new Set(fa.filter((r) => DIRECT.test(r.body || '')).map((r) => r.name));
let grew = true;
while (grew) { grew = false; for (const r of fa) { if (guard.has(r.name)) continue; for (const g of guard) { if (new RegExp('\\b' + g + '\\s*\\(').test(r.body || '')) { guard.add(r.name); grew = true; break; } } } }
const out = fa.map((r) => {
  const key = r.name + '(' + r.args + ')';
  const b = fb.get(key);
  const acl = b?.acl ?? null;
  const items = acl ? acl.replace(/[{}"]/g, '').split(',').map((x) => x.split('=')[0]) : null;
  let intent;
  if (r.rettype === 'trigger' || r.rettype === 'event_trigger') intent = 'TRIGGER';
  else if (items === null) intent = 'UNSTATED';
  else if (items.includes('') || items.includes('anon')) intent = 'ANYONE';
  else if (items.includes('authenticated')) intent = 'USER';
  else if (items.includes('service_role')) intent = 'SERVER';
  else intent = 'NOBODY';
  const direct = DIRECT.test(r.body || '');
  const checks = guard.has(r.name);
  return { key, regproc: r.regproc, name: r.name, args: r.args, secdef: r.secdef, rettype: r.rettype, intent, aclVanilla: acl, aclHosted: r.acl,
    anon: r.anon, authd: r.authd, svc: r.svc, vanillaAnon: b?.anon, vanillaAuthd: b?.authd,
    direct, checks, inPolicy: new RegExp('\\b' + r.name + '\\s*\\(').test(polText), descr: r.descr || '', argnames: r.argnames };
});
writeFileSync(new URL('./out/functions.json', import.meta.url), JSON.stringify(out, null, 1));
writeFileSync(new URL('./out/bodies.json', import.meta.url), JSON.stringify(Object.fromEntries(fa.map((r) => [r.name + '(' + r.args + ')', r.body])), null, 1));
writeFileSync(new URL('./out/policies.json', import.meta.url), JSON.stringify(pol, null, 1));
const c = (f) => out.filter(f).length;
console.log('functions', out.length, 'secdef', c((r) => r.secdef));
for (const k of ['SERVER', 'USER', 'ANYONE', 'NOBODY', 'UNSTATED', 'TRIGGER']) {
  const g = out.filter((r) => r.intent === k);
  console.log(k, g.length, 'secdef', g.filter((r) => r.secdef).length,
    'hostedExposed(anon|authd)', g.filter((r) => r.anon || r.authd).length,
    'hostedAnon', g.filter((r) => r.anon).length,
    'vanillaExposed', g.filter((r) => r.vanillaAnon || r.vanillaAuthd).length,
    'exposed&secdef&nocheck', g.filter((r) => (r.anon || r.authd) && r.secdef && !r.checks).length);
}
