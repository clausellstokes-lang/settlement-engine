// GRANTS-1: FOR-THE-OWNER-URGENT.sql (the chair's 15:19 message). Groups 1 and 2 of
// out/revoke-block.sql, each function put through three checks on BOTH the line's
// chain (001-210) and the live chain (001-203, = origin/master's migrations):
//   (a) named in no policy, view, column default, check constraint or index;
//   (b) called by no SECURITY INVOKER function that anon or authenticated can execute,
//       and by no invoker trigger function (it fires as the writing user);
//   (c) no call site on origin/master or on the line reaches it with a visitor's or
//       a user's token (src/ any mention; supabase/functions/ every call and its client).
// Run from the repository root after `git fetch origin master`.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { boot } from './boot.mjs';

const OUT = new URL('./out/', import.meta.url);
const GRANTS = new URL('../', import.meta.url);
const TREES = { line: 'HEAD', master: 'origin/master' };

// ── the candidates: groups 1 and 2 of the generated revoke block ─────────────
const cands = []; let grp = 0;
for (const l of readFileSync(new URL('./revoke-block.sql', OUT), 'utf8').split('\n')) {
  const g = /^-- ── GROUP (\d)/.exec(l); if (g) { grp = Number(g[1]); continue; }
  const m = /^revoke execute on function public\.([a-z_0-9]+)\((.*)\) from anon, authenticated;/.exec(l);
  if (m && (grp === 1 || grp === 2)) cands.push({ group: grp, name: m[1], sig: `public.${m[1]}(${m[2]})` });
}

// Negative control (URGENT_CONTROL=1): functions KNOWN to be called with a user's token
// must FAIL check (c); they are reported and never written into the owner's file.
const CONTROLS = process.env.URGENT_CONTROL ? [
  { group: 0, name: 'spend_credits', sig: 'public.spend_credits(text)' },
  { group: 0, name: 'toggle_gallery_vote', sig: 'public.toggle_gallery_vote(uuid)' },
  { group: 0, name: 'list_my_tickets', sig: 'public.list_my_tickets()' },
] : [];
cands.push(...CONTROLS);
// ── the two catalogs ──────────────────────────────────────────────────────────
async function catalog(upTo) {
  const { db } = await boot({ hostedDefaults: true, upTo });
  const q = async (s) => (await db.query(s)).rows;
  const fns = await q(`select p.oid::regprocedure::text as sig, p.proname as name, p.prosecdef as secdef,
      format_type(p.prorettype, null) as ret, p.prosrc as body,
      has_function_privilege('anon', p.oid, 'execute') as anon,
      has_function_privilege('authenticated', p.oid, 'execute') as authd
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'`);
  const texts = [
    ...(await q(`select 'policy '||tablename||'.'||policyname as w, coalesce(qual,'')||' '||coalesce(with_check,'') as t from pg_policies`)),
    ...(await q(`select 'view '||schemaname||'.'||viewname as w, definition as t from pg_views where schemaname not in ('pg_catalog','information_schema')`)),
    ...(await q(`select 'default '||c.relname||'.'||a.attname as w, pg_get_expr(d.adbin, d.adrelid) as t from pg_attrdef d join pg_class c on c.oid=d.adrelid join pg_attribute a on a.attrelid=d.adrelid and a.attnum=d.adnum`)),
    ...(await q(`select 'check '||conrelid::regclass::text||'.'||conname as w, pg_get_constraintdef(oid) as t from pg_constraint where contype='c'`)),
    ...(await q(`select 'index '||schemaname||'.'||indexname as w, indexdef as t from pg_indexes where schemaname not in ('pg_catalog')`)),
  ];
  return { fns, texts, exists: new Set(fns.map((f) => f.sig)) };
}
const CAT = { line: await catalog(210), live: await catalog(203) };
const candSigs = new Set(cands.map((c) => c.sig.replace(/^public\./, '')));
const callRe = (n) => new RegExp('\\b' + n + '\\s*\\(', 'i');

function checkAB(c, cat) {
  const sig = c.sig.replace(/^public\./, '');
  const a = cat.texts.filter((t) => callRe(c.name).test(t.t || '')).map((t) => t.w);
  const b = cat.fns.filter((f) => !f.secdef && f.name !== c.name && callRe(c.name).test(f.body || '')
    && (f.ret === 'trigger' || ((f.anon || f.authd) && !candSigs.has(f.sig))))
    .map((f) => f.sig + (f.ret === 'trigger' ? ' [trigger]' : ''));
  return { present: cat.exists.has(sig), a, b };
}

// ── (c) call sites in both trees ──────────────────────────────────────────────
const git = (args) => { try { return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 << 20 }); } catch (e) { return e.stdout || ''; } };
const fileCache = new Map();
const show = (tree, path) => { const k = tree + ':' + path; if (!fileCache.has(k)) fileCache.set(k, git(['show', k])); return fileCache.get(k); };
const SERVICE = /SERVICE_ROLE|service_role|serviceRole|serviceKey|SERVICE_KEY|adminClient|AdminClient|supabaseAdmin|getAdmin|createAdmin|makeAdmin|adminFactory/;
const USERTOK = /Authorization|ANON_KEY|anonKey|authHeader|userClient|accessToken|global:\s*\{\s*headers/;
function clientOf(text, line) {
  const v = /([A-Za-z_$][\w$.]*)\s*(?:\)\s*)?\.rpc\(/.exec(line);
  if (!v) return { client: 'no .rpc on the line', var: null };
  const name = v[1];
  if (SERVICE.test(name)) return { client: 'service-role (by name)', var: name };
  const last = name.split('.').pop();
  const def = new RegExp('(?:const|let|var)\\s+' + last.replace('$', '\\$') + '\\s*=\\s*([^;\\n]*)').exec(text);
  if (def) {
    if (SERVICE.test(def[1])) return { client: 'service-role', var: name, def: def[1].trim().slice(0, 90) };
    if (USERTOK.test(def[1])) return { client: "CALLER'S TOKEN", var: name, def: def[1].trim().slice(0, 90) };
    // a local factory: `(deps.client ?? defaultClient)()` -> read defaultClient's own body
    for (const fm of def[1].matchAll(/([A-Za-z_$][\w$]*)\s*\)?\s*\(\s*\)/g)) {
      const fb = new RegExp('function\\s+' + fm[1] + '\\s*\\([^)]*\\)[^{]*\\{([\\s\\S]{0,400})').exec(text);
      if (fb && SERVICE.test(fb[1])) return { client: 'service-role (local factory ' + fm[1] + ' uses the service key)', var: name, def: def[1].trim().slice(0, 90) };
      if (fb && USERTOK.test(fb[1])) return { client: "CALLER'S TOKEN (local factory " + fm[1] + ')', var: name, def: def[1].trim().slice(0, 90) };
    }
    return { client: 'UNRESOLVED', var: name, def: def[1].trim().slice(0, 90) };
  }
  return { client: 'UNRESOLVED (parameter)', var: name };
}
// Per edge file: the receivers of a DYNAMIC .rpc(<variable>) and the static names a
// caller's-token receiver calls. A quoted name in a file is service-role when every
// dynamic receiver there resolves to service-role and no caller's-token receiver names it.
const fileCensus = new Map();
function census(tree, path) {
  const k = tree + ':' + path; if (fileCensus.has(k)) return fileCensus.get(k);
  const text = show(tree, path); const dyn = []; const userNames = new Set();
  for (const m of text.matchAll(/([A-Za-z_$][\w$.]*)\)?\s*\.rpc\(\s*([^,)]*)/g)) {
    const arg = m[2].trim(); const cl = clientOf(text, m[1] + '.rpc(');
    if (!/^['"`]/.test(arg)) dyn.push({ recv: m[1], client: cl.client });
    else if (/CALLER'S TOKEN/.test(cl.client)) userNames.add(arg.replace(/['"`]/g, ''));
  }
  const v = { dyn, userNames }; fileCensus.set(k, v); return v;
}
// Shared helpers that take the client as a parameter: every caller passes the
// service-role client (grep of 2026-11-24, both trees: resolveProviderKey <- supabaseAdmin
// (7 edge functions); scheduleAutoReload / maybeAutoReload <- supabaseAdmin or admin =
// makeAdminClient(); aiIpRateGuard / checkUserIpRate / checkAiIpRate <- supabaseAdmin or
// admin; claim/complete/releaseStripeWebhookEvent <- stripe-webhook's supabase =
// (deps.adminClient ?? adminClient)()).
// Every dynamic .rpc(<variable>) in the edge tree: a quoted name that is not itself a
// call (a log stage, a switch case, an action list) can reach PostgREST only through one.
const globalCache = new Map();
function globalDyn(tree) {
  if (globalCache.has(tree)) return globalCache.get(tree);
  const files = git(['ls-tree', '-r', '--name-only', tree, 'supabase/functions']).split('\n').filter((f) => /\.ts$/.test(f) && !/test/.test(f));
  const dyn = files.flatMap((f) => census(tree, f).dyn.map((d) => ({ ...d, file: f })));
  const v = { dyn, allService: dyn.every((d) => /^service-role/.test(d.client)) };
  globalCache.set(tree, v); return v;
}
const PARAM_HELPERS = new Set(['supabase/functions/_shared/autoReload.ts', 'supabase/functions/_shared/rateLimit.ts',
  'supabase/functions/ai-analyst/byok.ts', 'supabase/functions/_shared/stripeWebhookLease.ts']);
function callSites(c) {
  const out = [];
  for (const [tname, tree] of Object.entries(TREES)) {
    const hits = git(['grep', '-nE', `\\b${c.name}\\b`, tree, '--', 'src', 'supabase/functions']).split('\n').filter(Boolean);
    for (const h of hits) {
      const m = /^[^:]+:([^:]+):(\d+):(.*)$/.exec(h); if (!m) continue;
      const [, path, ln, text] = m;
      if (/\.test\.(ts|js|jsx)$|__tests__|\/tests?\//.test(path)) continue;
      let client = { client: 'mention (no call)' };
      if (path.startsWith('src/')) {
        if (/rpc\(/.test(text)) client = { client: "CALLER'S TOKEN (browser)" };
        else if (new RegExp(`action(:\\s*|\\s*===\\s*)['"]${c.name}['"]`).test(text)) client = { client: 'edge action name (posted to an edge function; src has no dynamic rpc()' };
        else if (/^\s*(\/\/|\*|\/\*)/.test(text) || !new RegExp(`['"\`]${c.name}['"\`]`).test(text)) client = { client: 'comment or prose mention' };
        else client = { client: 'mention in src (read by hand)' };
      }
      else if (/\.rpc\(/.test(text) || /rpc\(\s*$/.test(text)) {
        client = clientOf(show(tree, path), text);
        if (/UNRESOLVED \(parameter\)/.test(client.client) && PARAM_HELPERS.has(path)) client = { ...client, client: 'service-role (shared helper; every caller passes the service client)' };
      }
      else if (new RegExp(`['"]${c.name}['"]`).test(text)) {
        // a quoted name on its own line: look up to 3 lines back for the .rpc( it belongs to
        const lines = show(tree, path).split('\n'); const i = Number(ln) - 1;
        const back = lines.slice(Math.max(0, i - 3), i + 1).join(' ');
        if (/\.rpc\(/.test(back)) client = clientOf(show(tree, path), back);
        else {
          const cs = census(tree, path);
          const g = globalDyn(tree);
          const ok = !cs.userNames.has(c.name) && (cs.dyn.length ? cs.dyn : g.dyn).every((d) => /^service-role/.test(d.client))
            && (cs.dyn.length > 0 || g.allService);
          client = ok ? { client: 'not a call here (label); every dynamic rpc receiver ' + (cs.dyn.length ? 'in this file' : 'in the edge tree') + ' is service-role: ' + [...new Set((cs.dyn.length ? cs.dyn : g.dyn).map((d) => (d.file ? d.file.replace('supabase/functions/', '') + ' ' : '') + d.recv))].join(', ') }
            : (/^\s*(\/\/|\*)/.test(text) ? { client: 'comment mention' } : { client: 'quoted name (read by hand)' });
        }
        if (/UNRESOLVED \(parameter\)/.test(client.client) && PARAM_HELPERS.has(path)) client = { ...client, client: 'service-role (shared helper; every caller passes the service client)' };
      }
      out.push({ tree: tname, at: `${path}:${ln}`, text: text.trim().slice(0, 110), ...client });
    }
  }
  return out;
}

const rows = cands.map((c) => {
  const L = checkAB(c, CAT.line); const V = checkAB(c, CAT.live); const sites = callSites(c);
  const bad = sites.filter((s) => /CALLER'S TOKEN|UNRESOLVED|read by hand/.test(s.client));
  const pass = !L.a.length && !V.a.length && !L.b.length && !V.b.length && !bad.length;
  return { ...c, live: V.present, aLine: L.a, aLive: V.a, bLine: L.b, bLive: V.b, sites, bad, pass };
});
if (!CONTROLS.length) writeFileSync(new URL('./urgent-checks.json', OUT), JSON.stringify(rows, null, 1));
console.log('dynamic rpc receivers (line):', JSON.stringify(globalDyn('HEAD').dyn.map((d) => d.file + ' ' + d.recv + ' ' + d.client)));
console.log('dynamic rpc receivers (master):', JSON.stringify(globalDyn('origin/master').dyn.map((d) => d.file + ' ' + d.recv + ' ' + d.client)));
console.log('candidates', rows.length, 'pass', rows.filter((r) => r.pass).length, 'live', rows.filter((r) => r.live).length);
for (const r of rows.filter((x) => !x.pass)) console.log('FAIL', r.sig, JSON.stringify({ a: [...r.aLine, ...r.aLive], b: [...r.bLine, ...r.bLive], bad: r.bad.map((s) => `${s.tree} ${s.at} ${s.client} ${s.var || ''} ${s.def || ''}`) }));
