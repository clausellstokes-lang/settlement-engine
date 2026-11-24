// REVIEW-GRANTS-1: other overloads of the file's 105 names, and their state after the file's block 1.
import { readFileSync } from 'node:fs';
import { boot } from '../measure/boot.mjs';
const upTo = Number(process.argv[2] || 210);
const sql = readFileSync('docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-URGENT.sql', 'utf8');
const names = readFileSync('docs/chair/2026-11-24/tenth/grants/review/names.txt', 'utf8').split('\n').filter(Boolean);
const H = await boot({ hostedDefaults: true, upTo });
await H.db.exec(sql.split('-- ══ BLOCK 1')[1].split('-- ══ BLOCK 2')[0].replace(/^[^\n]*\n/, ''));
const r = (await H.db.query(`select p.proname, p.oid::regprocedure::text sig, n.nspname, has_function_privilege('anon',p.oid,'execute') anon, has_function_privilege('authenticated',p.oid,'execute') auth, has_function_privilege('service_role',p.oid,'execute') svc, pg_get_userbyid(p.proowner) owner from pg_proc p join pg_namespace n on n.oid=p.pronamespace where p.proname = any($1)`, [names])).rows;
const per = {}; for (const x of r) (per[x.proname] ||= []).push(x);
console.log('rows', r.length, 'names', Object.keys(per).length, 'owners', [...new Set(r.map((x) => x.owner))], 'schemas', [...new Set(r.map((x) => x.nspname))]);
for (const [n, xs] of Object.entries(per)) if (xs.length > 1 || xs.some((x) => x.anon || x.auth)) console.log(n, JSON.stringify(xs));
