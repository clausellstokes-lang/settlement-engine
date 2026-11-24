// REVIEW-GRANTS-1: callers and ACL of functions adjacent to the urgent file (not in it).
import { boot } from '../measure/boot.mjs';
const H = await boot({ hostedDefaults: true, upTo: 210 });
const V = await boot({ hostedDefaults: false, upTo: 210 });
const names = process.argv.slice(2);
for (const n of names) {
  const r = (await H.db.query(`select p.oid::regprocedure::text sig, p.prosecdef, has_function_privilege('anon',p.oid,'execute') anon, has_function_privilege('authenticated',p.oid,'execute') auth from pg_proc p where proname=$1`, [n])).rows;
  const v = (await V.db.query(`select p.oid::regprocedure::text sig, proacl::text acl from pg_proc p where proname=$1`, [n])).rows;
  const callers = (await H.db.query(`select p.oid::regprocedure::text sig, p.prosecdef, p.prorettype='trigger'::regtype trig, has_function_privilege('anon',p.oid,'execute') anon, has_function_privilege('authenticated',p.oid,'execute') auth from pg_proc p join pg_namespace s on s.oid=p.pronamespace where s.nspname='public' and p.proname<>$1 and p.prosrc ~ ('(^|[^a-z0-9_])'||$1||'\\s*\\(')`, [n])).rows;
  const roleCheck = (await H.db.query(`select prosrc ~* '(auth\\.role\\(\\)|request\\.jwt\\.claim\\.role|_assert_service|_require_operational_service_role|service_role)' as chk from pg_proc where proname=$1`, [n])).rows.map((x) => x.chk);
  console.log(JSON.stringify({ n, hosted: r, vanilla: v, roleCheck, callers }));
}
