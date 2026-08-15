-- 119_ai_request_idempotency.sql
--
-- Close the generate-narrative TIMEOUT-RETRY double-charge (cycle money-path review).
--
-- THE BUG. generate-narrative streams over fetch with a CLIENT-SIDE watchdog
-- (src/lib/ai.js: STREAM_OVERALL_TIMEOUT_MS / STREAM_IDLE_TIMEOUT_MS). On a slow
-- run the watchdog aborts the fetch and throws a "Please retry" error — but the
-- SERVER already ran spend_credits (the charge precedes generation) and may have
-- finished generating. The user manually retries → a SECOND requestNarrative →
-- spend_credits charges AGAIN. A paying user is double-charged on exactly the
-- timeout edge the watchdog exists for. No request idempotency existed.
--
-- THE FIX — DB-AUTHORITATIVE REQUEST IDEMPOTENCY. The client derives a STABLE key
-- from the request's stable inputs (settlementId + feature + a hash of the lean
-- settlement payload), identical across retries of the SAME logical request but
-- different for a genuinely new/edited one. The edge function CLAIMS that key —
-- the OUTERMOST money gate, before the free-narrative claim (118) AND spend_credits
-- (009) — via claim_ai_request. A first attempt claims (duplicate:false) and the
-- normal flow charges once; a retry within the short TTL reads duplicate:true and
-- SKIPS both the free claim and the spend entirely, regenerating for free (the
-- client lost the prior stream and needs the content). One charge per logical
-- request across timeout-retries; the 3-min TTL + the per-user/day rate limit
-- bound any free-regen abuse.
--
-- WHY A CLAIM TABLE (not a column on profiles). The key is per-REQUEST, not
-- per-account, and short-lived: a dedicated table with (user_id, request_key) as
-- the primary key gives the atomic unique-violation dedup and lets a stale key
-- self-heal (an expired row is deleted on the next claim, so the same key after
-- the TTL is a legitimately-new request). Mirrors 086's short-TTL reservation
-- ledger: RLS ON with no policy, reached only via the SECURITY DEFINER RPCs from
-- the edge function's service-role admin client — a user can never forge, read,
-- or release a claim.
--
-- SELF-HEALING — NO CRON NEEDED. Unlike 086's reservations (which the cap SUM
-- must not over-count, so a purge matters), a stale ai_request_claims row is
-- harmless: it only affects the SAME (user, key), and claim_ai_request deletes it
-- up front when it is older than the TTL. So a request repeated after its TTL is a
-- fresh duplicate:false with no cleanup job. A belt-and-suspenders purge is left
-- OUT on purpose (fewer moving parts); the table stays bounded because keys are
-- per-request and each claim prunes its own stale predecessor.
--
-- GRANTS. claim_ai_request + attach_ai_spend_to_claim are service-role only (the
-- edge calls them with the admin client, exactly like reserve_ai_spend /
-- claim_free_narrative / refund_credits). search_path is pinned `public, pg_temp`
-- on both (the 094/111 hardening posture; pg_temp LAST so temp objects can't
-- shadow public ones).
--
-- MERGE / RENUMBER NOTE. Authored as 119 (head is 118). If a concurrent tree also
-- claims 119, renumber to the first free number at merge and update the two test
-- loaders (tests/security/aiRequestIdempotency.pglite.test.js and the '119' key in
-- migrationSequenceAll's gapless check auto-discovers by glob, so only the pglite
-- test's MIG map needs the new number).
--
-- @rollback: drop the two functions and the table:
--     drop function if exists public.attach_ai_spend_to_claim(uuid, text, uuid);
--     drop function if exists public.claim_ai_request(uuid, text, integer);
--     drop table if exists public.ai_request_claims;
--   NOTE this REINSTATES the timeout-retry double-charge (a manual retry of a slow
--   narrative charges again) — roll back only to unblock a broken deploy, then
--   re-apply.

-- ── Per-request claim ledger ────────────────────────────────────────────────
-- One short-lived row per in-flight logical AI request, keyed on (user_id,
-- request_key). The PRIMARY KEY gives the atomic dedup: a second identical claim
-- within the TTL hits the unique constraint and reads the existing row. spend_id
-- is attached AFTER the charge so a later duplicate can see (and target) what was
-- charged. RLS ON with no policy: reached ONLY via the SECURITY DEFINER RPCs
-- below (service-role), mirroring 086 — a user can never forge or read a claim.
create table if not exists public.ai_request_claims (
  user_id     uuid        not null,
  request_key text        not null,
  -- The credit_ledger spend row this logical request charged (or NULL for a free/
  -- elevated run, or before attach runs). A duplicate reads this so a refund path
  -- can still target the REAL charge from the first attempt.
  spend_id    uuid,
  created_at  timestamptz not null default now(),
  primary key (user_id, request_key)
);

alter table public.ai_request_claims enable row level security;
-- No policies ON PURPOSE: writes + reads are service_role only (the edge
-- function's admin client), exactly like ai_spend_reservations.

comment on table public.ai_request_claims is
  'Short-TTL per-request idempotency claims for generate-narrative (119): one row per in-flight logical AI request, keyed (user_id, request_key). Deduplicates a client timeout-RETRY of the same request so it is not charged twice; spend_id records what the first attempt charged. RLS-on, no policy: service_role only. Self-healing — claim_ai_request prunes a stale row (> TTL) up front, so no purge job.';

-- ── ATOMIC CLAIM — dedup a logical request within a short TTL ────────────────
-- Delete any STALE row for (p_user, p_key) older than p_ttl_seconds first, so an
-- expired key is treated as a fresh request. Then attempt to INSERT the claim:
--   • on success (no live row) → { duplicate: false } — the caller proceeds with
--     the normal free-claim / spend flow and later calls attach_ai_spend_to_claim.
--   • on conflict (a LIVE row within the TTL) → { duplicate: true, spend_id: <the
--     existing row's spend_id> } — the caller SKIPS the free claim + spend and
--     regenerates for free, targeting the prior spend_id for any refund path.
--
-- RACE-SAFETY. The INSERT ... ON CONFLICT DO NOTHING is atomic: under two
-- concurrent identical claims exactly one INSERT writes a row (duplicate:false);
-- the other's ON CONFLICT no-ops, its RETURNING yields no row, and it falls to
-- the SELECT branch (duplicate:true). The follow-up SELECT reads the winner's row
-- (its spend_id may still be NULL if attach hasn't run yet — that's fine; a NULL
-- spend_id duplicate simply has no prior charge to target, which is correct for a
-- free/elevated first attempt). SECURITY DEFINER + service-role-only.
--
-- p_ttl_seconds default 180 (3 min): long enough to cover a genuine timeout-retry
-- of the slowest multi-call stream, short enough that a legitimately-new identical
-- request after the window is not wrongly deduped. A p_ttl_seconds <= 0 makes
-- EVERY prior row stale (deletes it up front), so the same key is always a fresh
-- duplicate:false — used by the tests to simulate a lapsed TTL.
create or replace function public.claim_ai_request(
  p_user uuid,
  p_key text,
  p_ttl_seconds integer default 180
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_ttl        integer;
  v_inserted   integer := 0;
  v_spend_id   uuid;
begin
  if p_user is null or p_key is null or length(p_key) = 0 then
    -- A malformed claim never deduplicates (fail OPEN toward the normal flow):
    -- report not-a-duplicate so the caller charges as it would today. The edge
    -- also validates the key before calling, so this is defence-in-depth.
    return jsonb_build_object('duplicate', false);
  end if;

  -- Clamp a negative/null TTL to 0 (every prior row is stale) rather than error.
  v_ttl := greatest(coalesce(p_ttl_seconds, 180), 0);

  -- Prune a STALE claim for this exact key so an expired key is a fresh request.
  -- Only this (user, key) is touched — never another request's live claim.
  delete from public.ai_request_claims
    where user_id = p_user
      and request_key = p_key
      and created_at < now() - make_interval(secs => v_ttl);

  -- Atomic dedup: exactly one of two concurrent identical claims inserts a row.
  insert into public.ai_request_claims (user_id, request_key)
    values (p_user, p_key)
    on conflict (user_id, request_key) do nothing;
  get diagnostics v_inserted = row_count;

  if v_inserted > 0 then
    -- We won the claim: a genuinely-new (or post-TTL) logical request.
    return jsonb_build_object('duplicate', false);
  end if;

  -- A live row already exists (a retry within the TTL): report the prior spend_id
  -- so the caller can target the real charge without re-spending. May be NULL if
  -- the first attempt was free/elevated or hasn't attached yet — that's expected.
  select spend_id into v_spend_id
    from public.ai_request_claims
    where user_id = p_user and request_key = p_key;

  return jsonb_build_object('duplicate', true, 'spend_id', v_spend_id);
end;
$$;

revoke all on function public.claim_ai_request(uuid, text, integer) from public;
grant execute on function public.claim_ai_request(uuid, text, integer) to service_role;

comment on function public.claim_ai_request(uuid, text, integer) is
  'Atomically claim a logical AI request (119): prunes a stale (> p_ttl_seconds) row for (p_user,p_key), then INSERT ... ON CONFLICT DO NOTHING. Returns {duplicate:false} for the winner (a new/post-TTL request) or {duplicate:true, spend_id:<prior charge>} for a retry within the TTL. Service-role only; generate-narrative calls it as the OUTERMOST money gate, before the free-narrative claim + spend_credits.';

-- ── ATTACH — record what a claimed request charged ──────────────────────────
-- Called AFTER a successful spend (or free/elevated claim) on the FIRST attempt,
-- so a later duplicate can read the real spend_id. Idempotent: a re-attach for
-- the same key overwrites with the same value; a no-op when the claim row is gone
-- (expired/pruned). p_spend_id may be NULL (a free/elevated run has no charge) —
-- that is a valid attach. SECURITY DEFINER + service-role-only.
create or replace function public.attach_ai_spend_to_claim(
  p_user uuid,
  p_key text,
  p_spend_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_user is null or p_key is null then
    return;
  end if;
  update public.ai_request_claims
    set spend_id = p_spend_id
    where user_id = p_user
      and request_key = p_key;
  -- No-op when the row is gone (pruned/expired) — nothing to attach to, and the
  -- charge already stands on its own ledger row regardless.
end;
$$;

revoke all on function public.attach_ai_spend_to_claim(uuid, text, uuid) from public;
grant execute on function public.attach_ai_spend_to_claim(uuid, text, uuid) to service_role;

comment on function public.attach_ai_spend_to_claim(uuid, text, uuid) is
  'Record the spend_id a claimed AI request charged (119) so a later duplicate can target the real charge. Idempotent; NULL p_spend_id (free/elevated run) is valid; a no-op when the claim row has expired. Service-role only; generate-narrative calls it after a successful spend/free-claim on the first attempt.';
