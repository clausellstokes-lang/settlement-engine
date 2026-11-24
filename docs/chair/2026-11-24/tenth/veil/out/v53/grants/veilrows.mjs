// VEIL-53 unit (3), "GRANTS x VEIL": every function in schema public on the JOINED chain that
// tests/security/functionGrantClasses.js does not class, with the class ITS GRANTS SAY, by the same rule as
// docs/chair/2026-11-24/tenth/grants/measure/catalog.mjs (the ACL of a replay WITHOUT the hosted defaults) and
// register.mjs (UNSTATED -> NOBODY when closed under the hosted default, else ANYONE), with the hosted-default
// harness (tests/security/hostedDefaultHarness.js, USED, not re-written). register.mjs itself cannot run for these:
// it throws "unclosed" for a SERVER/NOBODY function that is not on 211 part A's list (every veil function).
// Run from the tree's root: node <this> <outdir>. Changes no repository file.
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
const ROOT = process.cwd();
const imp = (p) => import(pathToFileURL(resolve(ROOT, p)).href);
const { bootHostedChain, ENVIRONMENTAL_FAILURE, MIGRATIONS_DIR, migrationFiles } = await imp('tests/security/hostedDefaultHarness.js');
const { FUNCTION_CLASSES } = await imp('tests/security/functionGrantClasses.js');
const OUT = process.argv[2] || '/var/tmp/v53/grants';
const Q = `select p.oid::regprocedure::text as regproc, p.proname as name, pg_get_function_identity_arguments(p.oid) as args,
  p.prosecdef as secdef, format_type(p.prorettype, null) as rettype, p.proacl::text as acl,
  has_function_privilege('anon', p.oid, 'execute') as anon, has_function_privilege('authenticated', p.oid, 'execute') as authd,
  has_function_privilege('service_role', p.oid, 'execute') as svc
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.prokind in ('f','p')
    and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e') order by 1`;
const H = await bootHostedChain({ hostedDefaults: true });
const V = await bootHostedChain({ hostedDefaults: false });
const bad = [...H.failures, ...V.failures].filter((f) => !ENVIRONMENTAL_FAILURE.test(f.err));
const fh = (await H.db.query(Q)).rows;
const fv = new Map((await V.db.query(Q)).rows.map((r) => [r.regproc, r]));
const strip = (s) => s.replace(/^public\./, '');
// which migration file creates or restates each function (by name), for the reader
const files = migrationFiles();
const srcs = files.map((f) => [f, readFileSync(join(MIGRATIONS_DIR, f), 'utf8')]);
const filesOf = (name) => srcs.filter(([, s]) => new RegExp(`create\\s+(or\\s+replace\\s+)?function\\s+(public\\.)?"?${name}"?\\s*\\(`, 'i').test(s)).map(([f]) => f.slice(0, 3) + (f.includes('share_veil') ? 'v' : ''));
const rows = [];
for (const r of fh) {
  const k = strip(r.regproc);
  if (Object.prototype.hasOwnProperty.call(FUNCTION_CLASSES, k)) continue;
  const v = fv.get(r.regproc);
  const acl = v?.acl ?? null;
  const items = acl ? acl.replace(/[{}"]/g, '').split(',').map((x) => x.split('=')[0]) : null;
  let intent;
  if (r.rettype === 'trigger' || r.rettype === 'event_trigger') intent = 'TRIGGER';
  else if (items === null) intent = 'UNSTATED';
  else if (items.includes('') || items.includes('anon')) intent = 'ANYONE';
  else if (items.includes('authenticated')) intent = 'USER';
  else if (items.includes('service_role')) intent = 'SERVER';
  else intent = 'NOBODY';
  const closedHosted = !r.anon && !r.authd;
  let cls;
  if (intent === 'SERVER' || intent === 'NOBODY') cls = closedHosted ? intent : 'UNCLOSED:' + intent;
  else if (intent === 'UNSTATED') cls = closedHosted ? 'NOBODY' : 'ANYONE';
  else cls = intent;
  rows.push({ sig: k, cls, intent, secdef: r.secdef, aclVanilla: acl, aclHosted: r.acl, anon: r.anon, authd: r.authd, svc: r.svc, files: filesOf(r.name) });
}
// rows of the register that name no function on the joined chain
const present = new Set(fh.map((r) => strip(r.regproc)));
const stale = Object.keys(FUNCTION_CLASSES).filter((k) => !present.has(k));
const counts = {}; for (const r of rows) counts[r.cls] = (counts[r.cls] || 0) + 1;
writeFileSync(join(OUT, 'veilrows.json'), JSON.stringify({ files: files.length, badFailures: bad, stale, counts, rows }, null, 1));
console.log('chain files', files.length, 'non-environmental failures', bad.length, 'unclassed', rows.length, JSON.stringify(counts), 'stale rows', stale.length);
