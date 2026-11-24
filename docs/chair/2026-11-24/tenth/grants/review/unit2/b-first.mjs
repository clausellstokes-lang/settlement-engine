// The owner runs file 2 (part B) on the live database (203) BEFORE 204..210 are pushed. Compare, for every public
// function, anon/authenticated execute after 204..211 in that order against the line's own order (211 last).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { boot211 } from './boot211.mjs';
const ROOT = process.env.ROOT211;
const dir = join(ROOT, 'supabase/migrations');
const later = readdirSync(dir).filter((f) => /^(20[4-9]|210)_.*\.sql$/.test(f)).sort();
const B = readFileSync(join(ROOT, 'docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-GRANTS/2-part-b-default.sql'), 'utf8');
const m211 = readFileSync(join(dir, '211_close_visitor_reach.sql'), 'utf8');
const q = async (db) => new Map((await db.query(`select p.oid::regprocedure::text sig, has_function_privilege('anon',p.oid,'execute') anon, has_function_privilege('authenticated',p.oid,'execute') auth from pg_proc p where p.pronamespace='public'::regnamespace`)).rows.map((r) => [r.sig, r]));
const runLater = async (db) => { for (const f of later) await db.exec(readFileSync(join(dir, f), 'utf8')); };
const X = await boot211({ upTo: 203, mode: 'none' }); await X.db.exec(B); await runLater(X.db); await X.db.exec(m211);
const Y = await boot211({ upTo: 210, mode: 'mig' });
const [x, y] = [await q(X.db), await q(Y.db)];
console.log('later files:', later.join(' '));
const diff = [...y.keys()].filter((k) => x.get(k) && (x.get(k).anon !== y.get(k).anon || x.get(k).auth !== y.get(k).auth)).map((k) => `${k}: B-first anon=${x.get(k).anon} auth=${x.get(k).auth} | line anon=${y.get(k).anon} auth=${y.get(k).auth}`);
console.log('functions whose execute differs when B runs first:', diff.length); for (const d of diff) console.log('  ' + d);
console.log('missing in one of the two:', [...y.keys()].filter((k) => !x.has(k)), [...x.keys()].filter((k) => !y.has(k)));
