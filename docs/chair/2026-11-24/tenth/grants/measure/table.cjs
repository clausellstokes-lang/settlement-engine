const rows = require(process.argv[2]);
const C = {
  handle_premium_downgrade: 'downgrade any user to free and switch off their saves and maps',
  restore_premium_settlements: 'reactivate any user\'s retained saves',
  purge_expired_plan_inactive_settlements: 'run the retention purge (deletes expired retained saves) on demand',
  purge_expired_plan_inactive_assets: 'run the retention purge (deletes expired retained saves and maps) on demand',
  purge_analytics_for_user: 'erase any user\'s analytics, edit events and snapshots',
  post_ticket_reply: 'post a support reply as any staff member (actor id taken as an argument)',
  claim_free_narrative: 'burn any user\'s one free narrative',
  release_free_narrative: 're-open any user\'s free narrative, own included (unlimited free narratives)',
  claim_ai_request: 'claim or delete another user\'s AI idempotency keys',
  attach_ai_spend_to_claim: 'attach arbitrary spend ids to another user\'s AI claim',
  reserve_ai_spend: 'reserve arbitrary AI spend (fill the global spend cap: denial of AI to everyone)',
  release_ai_spend_reservation: 'release any spend reservation (undo the spend cap\'s admission)',
  consume_ai_generate_rate_limit: 'exhaust any user\'s AI rate limit',
  _surveyor_byok_secret: 'READ THE BYOK SERVER PASSPHRASE (CONFIRMED in PGlite)',
  surveyor_byok_get: 'READ ANY USER\'S DECRYPTED PROVIDER KEY',
  surveyor_byok_set_health: 'mark any user\'s stored key unhealthy (switch off their BYOK)',
  surveyor_byok_set_probe_tier: 'rewrite any user\'s key probe tier/profile',
  surveyor_usage_precheck: 'read any user\'s Surveyor usage and settings',
  write_ai_operation_log: 'forge AI operation log rows for any user',
  write_audit: 'forge admin-audit rows under any actor',
  set_gallery_comment_hidden: 'hide or unhide any gallery comment as any moderator',
  load_sim_metrics: 'insert arbitrary simulation metric rows',
  _log_founder_transfer_event: 'forge founder-transfer case events',
  has_active_transfer_lock: 'learn whether any user is in a seat transfer',
  email_has_active_transfer_lock: 'probe auth.users by email (transfer-lock oracle)',
  _seat_holder_last_active: 'read any user\'s last-active time',
  _consume_action_rate_limit: 'exhaust any user\'s action rate limit',
  _gallery_public_tile_rows: 'read the gallery tile projection directly (public data; owner-only by grant)',
};
const fam = (n, args) => {
  if (C[n]) return C[n];
  if (/^report_|^aggregate_ai_usage_stats/.test(n)) return 'read an admin analytics report';
  if (/^rollup_|^append_retention/.test(n)) return 'write analytics rollup rows on demand';
  if (/^analytics_(nightly|monthly)/.test(n)) return 'run analytics maintenance or pruning on demand';
  if (/^cleanup_|^purge_/.test(n)) return 'run a retention cleanup (deletes rows) on demand';
  if (/^consume_|^ingest_check_rate/.test(n)) return 'consume or exhaust any key\'s rate limit (inflict lockouts)';
  if (/^_(founder_transfer|seat_|buyback)/.test(n)) return 'read an internal config dial';
  if (/p_actor|actor_user|moderator/.test(args)) return 'act as any staff member: the role check reads the actor id the caller passes';
  return '(read in the report)';
};
const out = ['| # | function (signature) | last stated | grants last | could do |', '|---|---|---|---|---|'];
rows.forEach((r, i) => out.push(`| ${i + 1} | \`${r.name}(${r.args.replace(/\s+/g, ' ')})\` | ${r.def} | ${r.grant} | ${fam(r.name, r.args)} |`));
console.log(out.join('\n'));
const unknown = rows.filter((r) => fam(r.name, r.args).startsWith('(read'));
console.error('unclassed', unknown.map((r) => r.name).join(','));
