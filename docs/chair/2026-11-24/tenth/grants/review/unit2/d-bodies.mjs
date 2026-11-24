// (d): bodies, security, grants and table reads of six functions after 211; then a few calls as anon/authenticated.
import { boot211 } from './boot211.mjs';
const { db } = await boot211({ upTo: 210, mode: 'mig' });
for (const n of ['_gallery_sanitize_public_json', '_gallery_world_snapshot_is_safe', 'operator_message_class_for_template', 'has_role', 'account_is_active', 'profile_has_premium_access']) {
  const r = (await db.query(`select p.oid::regprocedure::text sig, p.prosecdef, l.lanname, p.provolatile, has_function_privilege('anon',p.oid,'execute') anon, has_function_privilege('authenticated',p.oid,'execute') auth, p.prosrc from pg_proc p join pg_language l on l.oid=p.prolang where proname=$1`, [n])).rows;
  for (const x of r) {
    const tables = [...new Set((x.prosrc.match(/\b(from|join|update|into)\s+(public\.)?([a-z_]+)/gi) || []).map((s) => s.split(/\s+/).pop()))];
    console.log(`## ${x.sig} ${x.prosecdef ? 'DEFINER' : 'INVOKER'} ${x.lanname} anon=${x.anon} auth=${x.auth} tables=${tables.join(',')}`);
    console.log(x.prosrc.replace(/\n\s*--[^\n]*/g, '').replace(/\s+/g, ' ').slice(0, 700));
  }
}
// where are has_role / account_is_active / profile_has_premium_access used (policies, views)
const pol = (await db.query(`select polrelid::regclass t, polname, coalesce(pg_get_expr(polqual,polrelid),'')||' '||coalesce(pg_get_expr(polwithcheck,polrelid),'') e from pg_policy`)).rows;
for (const n of ['has_role', 'account_is_active', 'profile_has_premium_access']) console.log('POLICIES using', n, pol.filter((p) => new RegExp(n + '\\(').test(p.e)).map((p) => p.t + ':' + p.polname).join(' ; '));
