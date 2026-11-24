// GRANTS-1: run the owner's read-only check, apply the generated revoke block twice, run the check again.
import { boot } from './boot.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { splitSql } from './boot.mjs';
const { db } = await boot({ hostedDefaults: true });
const check = readFileSync(new URL('./out/owner-read-check.sql', import.meta.url), 'utf8');
const [q1, q2] = splitSql(check);
const summarize = async () => { const r = (await db.query(q1)).rows; return { rows: r.length, exists: r.filter((x) => x.exists_here).length,
  anon: r.filter((x) => x.anon_can_execute).length, authenticated: r.filter((x) => x.authenticated_can_execute).length,
  byok_keys: (await db.query(q2)).rows[0].byok_keys }; };
const out = { before: await summarize() };
const block = readFileSync(new URL('./out/revoke-block.sql', import.meta.url), 'utf8');
await db.exec(block); await db.exec(block);
out.after_twice = await summarize();
const svc = (await db.query(`select count(*)::int as n from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and has_function_privilege('service_role', p.oid, 'execute') = false`)).rows[0].n;
out.public_functions_service_role_cannot_execute_after = svc;
writeFileSync(new URL('./out/probe-revoke.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
