// GRANTS-1: execute FOR-THE-OWNER-URGENT.sql in PGlite on the live chain (203) and the line (210), twice each.
import { boot, splitSql } from './boot.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
const sql = readFileSync(new URL('../FOR-THE-OWNER-URGENT.sql', import.meta.url), 'utf8');
const stmts = splitSql(sql);
const reads = stmts.filter((s) => /^\s*(--[^\n]*\n\s*)*select/i.test(s));
const out = {};
for (const upTo of [203, 210]) {
  const { db } = await boot({ hostedDefaults: true, upTo });
  const tally = async () => { const r = (await db.query(reads[0])).rows; return { rows: r.length, exists: r.filter((x) => x.exists_here).length,
    anon: r.filter((x) => x.anon_can_execute).length, authenticated: r.filter((x) => x.authenticated_can_execute).length }; };
  const svcBefore = (await db.query(`select count(*)::int n from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and has_function_privilege('service_role', p.oid, 'execute')`)).rows[0].n;
  const before = await tally();
  await db.exec(sql); const once = await tally();
  await db.exec(sql); const twice = await tally();
  const svcAfter = (await db.query(`select count(*)::int n from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and has_function_privilege('service_role', p.oid, 'execute')`)).rows[0].n;
  out['chain_' + upTo] = { before, after_once: once, after_twice: twice, service_role_executable_before: svcBefore, service_role_executable_after: svcAfter };
}
writeFileSync(new URL('./out/probe-urgent.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
