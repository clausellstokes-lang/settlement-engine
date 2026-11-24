// REVIEW-GRANTS-1: run the urgent file as the owner would (whole, twice), count block 0 / block 2, test the guard,
// and call two listed functions as anon, authenticated and service_role before and after.
import { readFileSync } from 'node:fs';
import { boot } from '../measure/boot.mjs';
const upTo = Number(process.argv[2] || 203);
const sql = readFileSync('docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-URGENT.sql', 'utf8');
const block0 = '-- ══ BLOCK 0' + sql.split('-- ══ BLOCK 0')[1].split('-- Block 0b')[0];
const H = await boot({ hostedDefaults: true, upTo });
const tally = (rows) => ({ rows: rows.length, exists: rows.filter((r) => r.exists_here).length, anonTrue: rows.filter((r) => r.anon_can_execute).length, authTrue: rows.filter((r) => r.authenticated_can_execute).length });
const before = tally((await H.db.query(block0)).rows);
const call = async (role, q) => { try { await H.db.exec(`begin; set local role ${role}; ${q}; rollback;`); return 'ok'; } catch (e) { await H.db.exec('rollback').catch(() => {}); return String(e.message).slice(0, 60); } };
const probes = ["select public.has_active_transfer_lock(gen_random_uuid())", "select public._seat_holder_last_active(gen_random_uuid())"];
const callsBefore = {}; for (const r of ['anon', 'authenticated', 'service_role']) callsBefore[r] = await Promise.all(probes.map((p) => call(r, p)));
// the owner's run: the whole file, as one multi-statement text, twice
const run1 = await H.db.exec(sql); const run2 = await H.db.exec(sql);
const last = run2[run2.length - 1].rows;
const byok = run2.find((r) => r.fields?.some((f) => f.name === 'byok_keys'))?.rows;
const callsAfter = {}; for (const r of ['anon', 'authenticated', 'service_role']) callsAfter[r] = [];
for (const r of ['anon', 'authenticated', 'service_role']) for (const p of probes) callsAfter[r].push(await call(r, p));
// guard: drop one listed function, run block 1 again: no error, and block 2 shows it as exists_here=false
await H.db.exec('drop function public.report_client_error_alert()');
let guardErr = null; try { await H.db.exec(sql); } catch (e) { guardErr = String(e.message); }
const afterDrop = (await H.db.exec(sql)).at(-1).rows.find((r) => r.sig === 'public.report_client_error_alert()');
console.log(JSON.stringify({ upTo, before, resultSets: run2.length, block2: tally(last), byok, callsBefore, callsAfter, guardErr, afterDrop }, null, 1));
