// GRANTS-1: THE OWNER'S FULL FILE (ruling G1 §7, amendment G1d, the reader's notes F1–F4), GENERATED.
// Writes docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-GRANTS/: one file per result (the SQL editor
// shows only the last statement's result, F2). Every function line is guarded (to_regprocedure), so a
// function production lacks is skipped, never an error. Then it EXECUTES every file in PGlite on the live
// chain (001-203, = origin/master's migrations) and on the line (001-210), twice, and writes the figures
// each read check shows into the page (F1: the header says what the catalog shows, nothing more).
// Run from the repository root after urgent.mjs (PART_A=1) and after part D's partD.sql exists.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { boot } from './boot.mjs';

const OUT = new URL('./out/', import.meta.url);
const DIR = new URL('../FOR-THE-OWNER-GRANTS/', import.meta.url);
mkdirSync(DIR, { recursive: true });
const A = JSON.parse(readFileSync(new URL('./parta-checks.json', OUT), 'utf8')).filter((r) => r.pass);
const F = JSON.parse(readFileSync(new URL('./functions.json', OUT), 'utf8'));
const intent = new Map(F.map((r) => ['public.' + r.regproc, r.intent]));
const part = (f) => readFileSync(new URL('./211/' + f, import.meta.url), 'utf8');
const GH = { 1: 'group 1: hands back a secret or another user\'s data', 2: 'group 2: changes another user\'s account, entitlements or money', 3: 'group 3: reports, rollups, cleanups, rate limits, crons, workers, helpers', 4: 'apart: _audit_action (its callers are SECURITY DEFINER functions only)' };

const readCheck = [
  '-- READS ONLY. One row per function part A closes: does it exist here, and may a visitor (anon), a signed-in',
  '-- user (authenticated) and the server (service_role) execute it? After file 1 every existing row reads',
  '-- anon false, authenticated false; service_role keeps what it had (true for every SERVER function).',
  'select s.grp, s.sig, p.oid is not null as exists_here,',
  "       case when p.oid is null then null else has_function_privilege('anon', p.oid, 'execute') end as anon,",
  "       case when p.oid is null then null else has_function_privilege('authenticated', p.oid, 'execute') end as authenticated,",
  "       case when p.oid is null then null else has_function_privilege('service_role', p.oid, 'execute') end as service_role",
  '  from (values',
  '    ' + A.map((r) => `(${r.group}, '${r.sig}')`).join(',\n    '),
  '  ) as s(grp, sig)',
  '  left join pg_proc p on p.oid = to_regprocedure(s.sig)',
  ' order by s.grp, s.sig;', ''].join('\n');

const files = {
  '0a-read-check-before.sql': readCheck,
  '0b-default-privileges.sql': ['-- READS ONLY. The default privileges for new objects in schema public, per role and object type',
    "-- (f = functions). After file 2, the migrating role's 'f' row names neither anon nor authenticated.",
    "select defaclrole::regrole::text as role, defaclobjtype as kind, defaclacl::text as acl",
    "  from pg_default_acl where defaclnamespace = 'public'::regnamespace order by 1, 2;", ''].join('\n'),
  '0c-byok-count.sql': ['-- READS ONLY. How many users have a stored provider key (a number only).',
    'select count(*) as byok_keys from public.surveyor_byok_keys;', ''].join('\n'),
};
const p1 = ['-- FILE 1 = PART A of migration 211. In plain words: every database function the migrations mean for the',
  '-- server alone is taken away from visitors and signed-in users, one function at a time; the server keeps it.',
  '-- Safe to run twice; a function this database lacks is skipped. To undo one line:',
  '--   grant execute on function <the same signature> to anon, authenticated;'];
let g = 0;
for (const r of A) {
  if (r.group !== g) { g = r.group; p1.push('', `-- ── ${GH[g]} ──`); }
  const regrant = intent.get(r.sig) === 'SERVER' ? ` grant execute on function ${r.sig} to service_role;` : '';
  p1.push(`do $$ begin if to_regprocedure('${r.sig}') is not null then revoke execute on function ${r.sig} from public, anon, authenticated;${regrant} end if; end $$;`);
}
files['1-part-a-functions.sql'] = p1.join('\n') + '\n';
files['2-part-b-default.sql'] = part('partB.sql');
if (existsSync(new URL('./211/partC.sql', import.meta.url))) files['3-part-c-profiles.sql'] = part('partC.sql');
if (existsSync(new URL('./211/partD.sql', import.meta.url))) files['4-part-d-settlements-maps.sql'] = part('partD.sql');
files['5-read-check-after.sql'] = readCheck;
files['6a-read-after-part-c-profiles.sql'] = ['-- READS ONLY, after file 3. Every column of public.profiles, and whether a signed-in user may UPDATE it.',
  '-- Expected: exactly four true (avatar_url, email_notifications, model_preference, public_identity_opt_in).',
  '-- On the hosted platform a revoke removes only what the revoking role granted: this read is the proof.',
  "select column_name, has_column_privilege('authenticated', 'public.profiles', column_name, 'UPDATE') as signed_in_may_update",
  "  from information_schema.columns where table_schema = 'public' and table_name = 'profiles' order by ordinal_position;", ''].join('\n');
files['6b-read-after-part-d-triggers.sql'] = ['-- READS ONLY, after file 4. The two guard triggers: present and enabled (tgenabled O = enabled).',
  '-- Expected: two rows, settlements and saved_maps, each enabled O, both calling _guard_server_owned_columns.',
  "select tgrelid::regclass::text as on_table, tgname, tgenabled, tgfoid::regproc::text as function",
  "  from pg_trigger where tgname = 'trg_guard_server_owned_columns' and not tgisinternal order by 1;", ''].join('\n');
for (const [n, t] of Object.entries(files)) writeFileSync(new URL(n, DIR), t);

// ── execute everything, twice, on both chains (F1: the figures the page states) ──
const fig = {};
for (const upTo of [203, 210]) {
  const { db } = await boot({ hostedDefaults: true, upTo });
  const tally = async () => { const r = (await db.query(readCheck)).rows; return { rows: r.length, exists: r.filter((x) => x.exists_here).length,
    anon: r.filter((x) => x.anon).length, authenticated: r.filter((x) => x.authenticated).length, service_role: r.filter((x) => x.service_role).length }; };
  const before = await tally();
  const order = Object.keys(files).filter((n) => /^[1-4]-/.test(n)).sort();
  for (let pass = 0; pass < 2; pass++) for (const n of order) await db.exec(files[n]);
  const after = await tally();
  const defacl = (await db.query(files['0b-default-privileges.sql'])).rows.filter((r) => r.kind === 'f').map((r) => `${r.role}: ${r.acl}`);
  const cols = (await db.query(files['6a-read-after-part-c-profiles.sql'])).rows;
  const trg = (await db.query(files['6b-read-after-part-d-triggers.sql'])).rows;
  fig[upTo] = { before, after, defacl, ran: order,
    profilesUpdatable: cols.filter((r) => r.signed_in_may_update).map((r) => r.column_name), profilesColumns: cols.length,
    guardTriggers: trg.map((r) => `${r.on_table} ${r.tgenabled} ${r.function}`) };
}
writeFileSync(new URL('./owner-files-figures.json', OUT), JSON.stringify(fig, null, 1));
console.log(JSON.stringify(fig));
