// GRANTS-1: generate the chair's four items from the PGlite catalog (out/*.json,
// written by catalog.mjs). Every signature below comes from the catalog
// (pg_proc.oid::regprocedure); only the GROUP a function is put in is a reading.
// Run from the repository root after catalog.mjs.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT = new URL('./out/', import.meta.url);
const rd = (f) => JSON.parse(readFileSync(new URL(f, OUT), 'utf8'));
const F = rd('functions.json');
const BODY = rd('bodies.json');
const VIEWS = rd('views.json');
const body = (r) => BODY[r.key] || '';

// ── browser callers: rpc('<name>' in src/ ─────────────────────────────────────
const srcRpc = new Map();
const walk = (d) => { for (const e of readdirSync(d)) { const p = join(d, e); const s = statSync(p);
  if (s.isDirectory()) walk(p); else if (/\.(js|jsx|ts|tsx|mjs)$/.test(e)) {
    const t = readFileSync(p, 'utf8');
    for (const m of t.matchAll(/\brpc\(\s*['"]([a-z_0-9]+)['"]/g)) { if (!srcRpc.has(m[1])) srcRpc.set(m[1], new Set()); srcRpc.get(m[1]).add(p); } } } };
walk('src');

const REAL = /service_role|_assert_service|request\.jwt\.claim\.role|auth\.role\(\)/i;
const CLASS = F.filter((r) => r.intent === 'SERVER' || r.intent === 'NOBODY');
const callsName = (r, n) => new RegExp('\\b' + n + '\\s*\\(').test(body(r));

// ── who runs with a user's privileges: invoker functions a user can reach ─────
// Seeds: invoker functions of USER / ANYONE / UNSTATED / TRIGGER intent. A
// SECURITY DEFINER caller runs as the owner, so what it calls needs no user grant.
const U = new Set(F.filter((r) => !r.secdef && ['USER', 'ANYONE', 'UNSTATED', 'TRIGGER'].includes(r.intent)).map((r) => r.key));
let grew = true;
while (grew) { grew = false;
  for (const g of F) { if (U.has(g.key) || g.secdef) continue;
    if (F.some((f) => U.has(f.key) && f.key !== g.key && callsName(f, g.name))) { U.add(g.key); grew = true; } } }
const viewText = VIEWS.map((v) => v.definition).join('\n');
const userPathCallers = (x) => F.filter((f) => U.has(f.key) && f.key !== x.key && callsName(f, x.name)).map((f) => f.name);

const keep = []; const revoke = [];
for (const r of CLASS) {
  const why = [];
  const up = userPathCallers(r); if (up.length) why.push('called by user-path invoker ' + up.join(', '));
  if (r.inPolicy) why.push('named in an RLS policy');
  if (new RegExp('\\b' + r.name + '\\s*\\(').test(viewText)) why.push('named in a view');
  if (srcRpc.has(r.name)) why.push('rpc( in ' + [...srcRpc.get(r.name)].join(', '));
  (why.length ? keep : revoke).push({ ...r, why });
}

// ── the groups (a reading by name; the signatures are generated) ─────────────
const G1 = new Set(['_surveyor_byok_secret', 'surveyor_byok_get', 'surveyor_usage_precheck', 'admin_billing_summary',
  'admin_diagnostic_bundle', '_seat_holder_last_active', 'has_active_transfer_lock', 'email_has_active_transfer_lock',
  'pick_recovery_question', 'recovery_is_locked', 'can_email_user', 'get_or_mint_unsubscribe_token',
  'list_operator_broadcasts', 'page_operator_message_recipients', 'resolve_account_deletion_user_by_stripe_billing',
  'list_operational_obligation_attention', 'claim_account_deletion_cleanup_jobs', 'claim_operator_message_recipient',
  'claim_operator_message_delivery_jobs', 'report_client_errors', 'report_client_error_alert']);
const G1_WHY = {
  _surveyor_byok_secret: 'the BYOK server passphrase', surveyor_byok_get: "any user's decrypted provider key",
  surveyor_usage_precheck: "any user's Surveyor settings and usage", admin_billing_summary: "any user's tier, credits and masked customer",
  admin_diagnostic_bundle: "any user's account diagnostics", _seat_holder_last_active: "any user's last activity",
  has_active_transfer_lock: "whether any user is mid-transfer", email_has_active_transfer_lock: 'an auth.users lookup by email',
  pick_recovery_question: "any account's security question", recovery_is_locked: "any account's recovery lock",
  can_email_user: "any user's email eligibility", get_or_mint_unsubscribe_token: "any user's unsubscribe token",
  list_operator_broadcasts: 'staff broadcasts', page_operator_message_recipients: 'broadcast recipients',
  resolve_account_deletion_user_by_stripe_billing: 'the user behind a Stripe billing id',
  list_operational_obligation_attention: 'money-obligation rows', claim_account_deletion_cleanup_jobs: 'deletion jobs (claims them too)',
  claim_operator_message_recipient: 'a message recipient (claims it too)', claim_operator_message_delivery_jobs: 'delivery jobs (claims them too)',
  report_client_errors: 'client error reports', report_client_error_alert: 'client error alerts',
};
const G2_RE = /^(handle_premium_downgrade|restore_premium_settlements|refund_credits|service_|system_(grant|clawback)_credits|purge_analytics_for_user|issue_warning|add_internal_note|set_account_|admin_(soft_delete|remove|revoke|set_content)|set_gallery_comment_hidden|process_account_deletions|create_ticket|claim_ticket|set_ticket_status|post_ticket_reply|link_ticket_faq|verify_recovery_answer|note_recovery_verify_failure|clear_recovery_lockout|claim_free_narrative|release_free_narrative|claim_ai_request|attach_ai_spend_to_claim|surveyor_byok_set_|(grant|revoke)_surveyor_entitlement|grant_dossier_entitlement|clawback_dossier_entitlement|claim_dossier_purchase_by_session|grant_referral|record_referral_grant_detail|clawback_referral|bind_redemption_session|apply_redemption|revert_redemption|reserve_redemption|claim_next_founder_seat|release_founder_seat_on_clawback|transfer_case_|issue_(transfer|buyback)_challenge|verify_(transfer|buyback)_challenge|claim_founder_seat_buyback|claim_due_(transfer|buyback)_payout|reelect_transfer_payout|unsubscribe_via_token|create_operator_direct_message|insert_operator_direct_message|materialize_my_operator_broadcast_receipts|mark_low_balance_notified|claim_auto_reload_|mark_account_deletion_auth_revoked|requeue_account_deletion|checkpoint_account_deletion|record_payment_refund_obligation|write_audit|_log_founder_transfer_event|consume_ai_generate_rate_limit|_consume_action_rate_limit)/;
const group = (r) => (G1.has(r.name) ? 1 : G2_RE.test(r.name) ? 2 : 3);
revoke.sort((a, b) => group(a) - group(b) || a.name.localeCompare(b.name) || a.regproc.localeCompare(b.regproc));

// first migration that creates a name (production is at 203)
const MIG = 'supabase/migrations';
const migs = readdirSync(MIG).filter((f) => /^\d{3}_/.test(f)).sort().map((f) => [Number(f.slice(0, 3)), readFileSync(join(MIG, f), 'utf8')]);
const firstDef = (n) => { const re = new RegExp('create\\s+(or\\s+replace\\s+)?function\\s+(public\\.)?' + n + '\\s*\\(', 'i'); for (const [k, s] of migs) if (re.test(s)) return k; return null; };

// ── (2) THE REVOKE BLOCK ──────────────────────────────────────────────────────
const lines = ['-- GENERATED by docs/chair/2026-11-24/tenth/grants/measure/generate.mjs from the PGlite catalog of 001-210.',
  '-- Class: every public function the migrations grant to service_role alone (SERVER) or to no role (NOBODY),',
  `-- ${CLASS.length} in all, less ${keep.length} that a user path needs (listed apart in grants-measure-extra.md).`,
  '-- A line marked "post-203" names a function first created after production\'s applied head (203).', ''];
let g = 0;
const GHEAD = { 1: 'GROUP 1: hands back a secret or another user\'s data', 2: 'GROUP 2: changes another user\'s account, entitlement or money', 3: 'GROUP 3: the rest (reports, rollups, cleanups, rate limits, workers, internal helpers)' };
for (const r of revoke) {
  if (group(r) !== g) { g = group(r); lines.push('', '-- ── ' + GHEAD[g] + ' ──'); }
  const fd = firstDef(r.name);
  const note = [g === 1 ? 'guards ' + (G1_WHY[r.name] || '') : '', r.anon || r.authd ? '' : 'already closed', fd > 203 ? 'post-203' : ''].filter(Boolean).join('; ');
  lines.push(`revoke execute on function public.${r.regproc.replace(/^public\./, '')} from anon, authenticated;${note ? '  -- ' + note : ''}`);
}
writeFileSync(new URL('./revoke-block.sql', OUT), lines.join('\n') + '\n');

// ── (1) THE READ-ONLY CHECK ────────────────────────────────────────────────────
const sigs = CLASS.map((r) => `('public.${r.regproc.replace(/^public\./, '')}')`).sort();
const check = ['-- READ ONLY. GENERATED from the PGlite catalog of migrations 001-210. It changes nothing.',
  '-- Block 1: for each function the migrations mean for the server alone (or for no role), whether anon and',
  '-- authenticated may execute it. A NULL oid means the function does not exist in this database (yet).',
  'select s.sig, p.oid is not null as exists_here,',
  "       case when p.oid is null then null else has_function_privilege('anon', p.oid, 'execute') end as anon_can_execute,",
  "       case when p.oid is null then null else has_function_privilege('authenticated', p.oid, 'execute') end as authenticated_can_execute",
  '  from (values', '    ' + sigs.join(',\n    '), '  ) as s(sig)', '  left join pg_proc p on p.oid = to_regprocedure(s.sig)',
  ' order by anon_can_execute desc nulls last, s.sig;', '',
  '-- Block 2: how many users have a stored provider key (a number only).',
  'select count(*) as byok_keys from public.surveyor_byok_keys;', ''];
writeFileSync(new URL('./owner-read-check.sql', OUT), check.join('\n'));

// ── (3) USER functions taking a user/actor id with no check against auth.uid() ─
const ID_ARG = /(user|actor|owner|member|holder|uid|account|profile|requester|moderator|target)/;
const user3 = [];
for (const r of F.filter((x) => x.intent === 'USER' || x.intent === 'ANYONE' || x.intent === 'UNSTATED')) {
  const names = (r.argnames || []).filter(Boolean);
  const types = r.args.split(',').map((s) => s.trim());
  for (const [i, n] of names.entries()) {
    if (!ID_ARG.test(n) || !/uuid/.test(types[i] || '')) continue;
    const b = body(r);
    // auth.uid() itself, or a local variable assigned from it (v_uid := auth.uid())
    const aliases = ['auth\\.uid\\(\\)', ...[...b.matchAll(/\b([a-z_][a-z0-9_]*)\s+uuid\s*:=\s*auth\.uid\(\)|\b([a-z_][a-z0-9_]*)\s*:=\s*auth\.uid\(\)/gi)].map((m) => '\\b' + (m[1] || m[2]) + '\\b')];
    const U_RE = new RegExp(aliases.join('|'), 'i');
    const tied = b.split('\n').some((l) => new RegExp('\\b' + n + '\\b').test(l) && U_RE.test(l))
      || aliases.some((a) => new RegExp('\\b' + n + '\\b[^;]{0,120}(' + a + ')|(' + a + ')[^;]{0,120}\\b' + n + '\\b', 'is').test(b));
    user3.push({ fn: r.regproc, intent: r.intent, arg: n, tied, inPolicy: r.inPolicy, staffGate: /current_user_is_\w+\(\)|has_role\(\s*auth\.uid\(\)|role\s+into\s+\w+\s+from\s+public\.profiles\s+where\s+id\s*=\s*auth\.uid\(\)/i.test(b), callers: [...(srcRpc.get(r.name) || [])] });
  }
}

// ── (4) browser rpc( calls that rely on a default grant ──────────────────────
const byName = new Map(); for (const r of F) { if (!byName.has(r.name)) byName.set(r.name, []); byName.get(r.name).push(r); }
const relyHosted = []; const relyAnon = []; const relyPublic = [];
for (const [n, files] of srcRpc) for (const r of byName.get(n) || []) {
  if (r.authd && !r.vanillaAuthd) relyHosted.push({ fn: r.regproc, intent: r.intent, files: [...files] });
  else if (r.anon && !r.vanillaAnon) relyAnon.push({ fn: r.regproc, intent: r.intent, files: [...files] });
  if (r.intent === 'UNSTATED') relyPublic.push({ fn: r.regproc, files: [...files] });
}

const md = ['# GRANTS-1 — generated extras (from out/*.json; do not edit by hand)', '',
  `Class SERVER+NOBODY: ${CLASS.length}. In the revoke block: ${revoke.length} (group 1: ${revoke.filter((r) => group(r) === 1).length}, group 2: ${revoke.filter((r) => group(r) === 2).length}, group 3: ${revoke.filter((r) => group(r) === 3).length}); already closed to both roles: ${revoke.filter((r) => !r.anon && !r.authd).length}.`, '',
  `## Kept out of the block: needed by a user path (${keep.length})`, '', ...keep.map((r) => `- \`${r.regproc}\` (${r.intent}${r.secdef ? ', definer' : ', invoker'}): ${r.why.join('; ')}`), '',
  `## (3) Meant for users, taking a user or actor id (${user3.length} arguments; ${user3.filter((x) => !x.tied).length} never compared with auth.uid() in the text)`, '',
  '| function | intent | argument | compared with auth.uid() | staff gate on the caller | in an RLS policy | rpc( callers in src/ |', '|---|---|---|---|---|---|---|',
  ...user3.map((x) => `| \`${x.fn}\` | ${x.intent} | ${x.arg} | ${x.tied ? 'yes' : '**no**'} | ${x.staffGate ? 'yes' : 'no'} | ${x.inPolicy ? 'yes' : 'no'} | ${x.callers.join(', ') || '—'} |`), '',
  `## (4) Browser rpc( calls that rely on the hosted default grant (${relyHosted.length})`, '',
  ...relyHosted.map((x) => `- \`${x.fn}\` (${x.intent}): ${x.files.join(', ')}`), '',
  `## (4) Browser rpc( calls granted to authenticated by name, reachable by a LOGGED-OUT browser only through the hosted default (${relyAnon.length})`, '',
  ...relyAnon.map((x) => `- \`${x.fn}\` (${x.intent}): ${x.files.join(', ')}`), '',
  `## (4) Browser rpc( calls to functions never granted by name (they ride PUBLIC) (${relyPublic.length})`, '',
  ...relyPublic.map((x) => `- \`${x.fn}\`: ${x.files.join(', ')}`), '',
  `src/ rpc( names seen: ${srcRpc.size}; of them not found in the catalog: ${[...srcRpc.keys()].filter((n) => !byName.has(n)).join(', ') || 'none'}.`, ''];
writeFileSync(new URL('./grants-measure-extra.md', OUT), md.join('\n'));
console.log('class', CLASS.length, 'revoke', revoke.length, 'keep', keep.length, 'user3', user3.length, 'untied', user3.filter((x) => !x.tied).length, 'relyHosted', relyHosted.length, 'relyAnon', relyAnon.length, 'relyPublic', relyPublic.length);
