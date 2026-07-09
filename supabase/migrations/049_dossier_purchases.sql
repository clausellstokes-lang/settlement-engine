-- ────────────────────────────────────────────────────────────────────────────
-- 049_dossier_purchases.sql — server-side settlement store for the anonymous
-- single-dossier ($2.99) microtransaction.
--
-- Why this exists (review findings F21 + F23): the single-dossier flow used to
-- keep the purchased settlement ONLY in the buyer's localStorage across the
-- Stripe round-trip (src/lib/pendingDossier.js). That one-slot stash stranded
-- buyers three ways: a second "Buy" click overwrote the first (paid) stash + its
-- token so the paid session could never verify; a TTL purge deleted a
-- paid-but-not-yet-downloaded stash; and a browser/device switch left the
-- success page holding a paid receipt and no dossier to deliver.
--
-- The fix moves the settlement server-side. create-checkout persists it here
-- (keyed by the client's one-time checkout_token) BEFORE creating the Stripe
-- session; stripe-webhook binds the paid stripe_session_id to that token on
-- checkout.session.completed; and verify-single-dossier hands the settlement
-- back to whoever presents the paid session + token. The localStorage stash is
-- now a best-effort fallback, not the source of truth.
--
-- House security pattern (mirrors 035 / 036 / 037): RLS ENABLED with ZERO
-- policies. The table is written and read ONLY by the service-role edge-function
-- clients (create-checkout, stripe-webhook, verify-single-dossier), which bypass
-- RLS; RLS-on + no-policy denies every direct anon/authenticated access. There
-- are deliberately NO grants to anon/authenticated — this is a server-only table.
--
-- Retention: a checkout is dead ~24h after creation (Stripe Checkout sessions
-- expire in ~24h). We keep rows for 30 days so a late buyer can still recover,
-- then purge. purge_dossier_purchases() below reclaims the backlog — primarily
-- UNCLAIMED rows (claimed_at IS NULL) that will never be redeemed, plus any
-- long-settled rows past the window — and is scheduled nightly via pg_cron
-- (defensive install, mirroring 035). The 30-day window is comfortably longer
-- than a Stripe session's ~24h life, so a purge outage never destroys a
-- still-recoverable purchase.
--
-- Re-runnable: create-if-not-exists / create-or-replace throughout.
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.dossier_purchases (
  checkout_token    text primary key,
  settlement        jsonb       not null,
  stripe_session_id text        unique,
  byte_size         int,
  created_at        timestamptz not null default now(),
  claimed_at        timestamptz
);

alter table public.dossier_purchases enable row level security;
-- No policies: service-role only. RLS-on + zero policies denies all direct
-- anon/authenticated access; the service-role edge clients bypass RLS.

-- Partial index over the unclaimed backlog the nightly purge sweeps (keeps the
-- delete from scanning already-redeemed rows).
create index if not exists dossier_purchases_unclaimed_idx
  on public.dossier_purchases (created_at)
  where claimed_at is null;

-- ── Retention purge ─────────────────────────────────────────────────────────
-- Deletes rows older than the retention window (default 30 days). Both the
-- never-claimed abandoned checkouts and the long-since-delivered rows are
-- reclaimed; nothing recoverable is at risk because Stripe sessions die inside
-- ~24h, an order of magnitude under the window.
create or replace function public.purge_dossier_purchases(
  p_retention_seconds integer default 2592000   -- 30 days
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_deleted integer := 0;
begin
  if p_retention_seconds is null or p_retention_seconds < 1 then
    p_retention_seconds := 2592000;
  end if;
  delete from public.dossier_purchases
    where created_at < now() - make_interval(secs => p_retention_seconds);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.purge_dossier_purchases(integer) from public;
grant execute on function public.purge_dossier_purchases(integer) to service_role;

-- Schedule the purge (defensive pg_cron install, mirroring 035). The table is
-- self-bounding via the 30-day sweep; the cron just reclaims space nightly.
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception
  when insufficient_privilege then
    raise notice 'pg_cron extension could not be installed; schedule purge_dossier_purchases manually';
end;
$$;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'purge-dossier-purchases';
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule(
    'purge-dossier-purchases',
    '23 4 * * *',
    $job$select public.purge_dossier_purchases();$job$
  );
exception
  when undefined_table or invalid_schema_name or insufficient_privilege then
    raise notice 'pg_cron unavailable; schedule purge_dossier_purchases manually';
end;
$$;
