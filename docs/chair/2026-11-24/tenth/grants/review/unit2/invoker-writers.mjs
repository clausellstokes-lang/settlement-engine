// Every SECURITY INVOKER function (any schema but the catalogs) whose body writes profiles, settlements or
// saved_maps, with whether a user can run it (execute privilege, or as a trigger on any table).
import { boot211 } from './boot211.mjs';
const upTo = Number(process.argv[2] || 210); const mode = process.argv[3] || 'mig';
const { db } = await boot211({ upTo, mode });
const rows = (await db.query(`select p.oid::regprocedure::text sig, n.nspname, p.prorettype='trigger'::regtype trig,
   has_function_privilege('anon',p.oid,'execute') anon, has_function_privilege('authenticated',p.oid,'execute') auth, p.prosrc,
   (select string_agg(t.tgrelid::regclass::text||':'||t.tgname, ',') from pg_trigger t where t.tgfoid=p.oid) on_tables
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where not p.prosecdef and n.nspname not in ('pg_catalog','information_schema')`)).rows;
const re = /(update\s+(public\.)?(profiles|settlements|saved_maps)\b|insert\s+into\s+(public\.)?(profiles|settlements|saved_maps)\b)/i;
for (const r of rows) if (re.test(r.prosrc || '')) console.log(r.trig ? 'TRIG' : 'FUNC', r.sig, 'anon=' + r.anon, 'auth=' + r.auth, 'on:', r.on_tables || '-', '|', (r.prosrc.match(re) || [])[0]);
console.log('scanned invoker functions:', rows.length);
