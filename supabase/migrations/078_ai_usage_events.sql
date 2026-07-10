-- ────────────────────────────────────────────────────────────────────────────
-- 078_ai_usage_events.sql — the COGS ledger for every server-side AI call.
--
-- WHY THIS EXISTS
--   The credit ledger (credit_ledger / credit_transactions) is the REVENUE
--   ledger: what a user paid and spent. It says nothing about what those
--   generations COST us in provider API spend. Today the edge function only
--   `console.info('ai_usage', …)`s an aggregate — it evaporates with the log
--   buffer and can't be summed, alerted on, or charged back to a user.
--
--   This table is the second, separate ledger: provider COGS. One row per AI
--   call (or per aggregated phase), written server-side via the service-role
--   client after each generation. `spend_id` links a COGS row to the revenue
--   ledger row that paid for it, so margin per generation is a join away.
--
-- TRUST MODEL (mirrors migration 035's discipline)
--   RLS ON. A READ-OWN policy lets a user see their own usage (account-page
--   transparency). There is NO insert/update/delete policy → every WRITE must
--   go through the service_role key (the edge function's admin client). A user
--   can never forge, inflate, or delete their own COGS rows.
--
-- Re-runnable: create-if-not-exists / drop-policy-if-exists throughout.
-- Depends on: auth.users (Supabase managed), credit_ledger (migration 009/018).
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.ai_usage_events (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references auth.users(id) on delete cascade,
  feature            text        not null,                  -- 'narrative' | 'dailyLife' | 'progression' | 'chronicle'
  phase              text,                                  -- 'thesis' | 'refinement' | 'dailyLife' | null (single-pass)
  provider           text        not null,                  -- 'anthropic' | 'openai'
  model              text        not null,                  -- resolved model id actually called
  model_preference   text,                                  -- the preference key that selected it
  input_tokens       integer     not null default 0,
  output_tokens      integer     not null default 0,
  -- Whether the token counts are REAL (provider-reported) or our len/4 floor
  -- estimate. COGS rollups can weight estimates differently if needed.
  tokens_estimated   boolean     not null default false,
  estimated_cost_usd numeric(12, 6) not null default 0,
  ok                 boolean     not null default true,
  fellback           boolean     not null default false,    -- true if a provider-down peer fallback served this call
  duration_ms        integer     not null default 0,
  -- Link to the credit_ledger SPEND row this generation debited. Null for
  -- elevated/free runs that didn't debit. ON DELETE SET NULL so purging old
  -- ledger rows never cascades away COGS history.
  spend_id           uuid        references public.credit_ledger(id) on delete set null,
  created_at         timestamptz not null default now()
);

-- Per-user history (account page) + global time-window rollups (the spend cap
-- in 079 sums estimated_cost_usd over a window).
create index if not exists ai_usage_events_user_created_idx
  on public.ai_usage_events (user_id, created_at desc);
create index if not exists ai_usage_events_created_idx
  on public.ai_usage_events (created_at);

alter table public.ai_usage_events enable row level security;

-- READ-OWN: a user may see their own COGS rows (account-page transparency).
drop policy if exists "Users read own ai usage" on public.ai_usage_events;
create policy "Users read own ai usage" on public.ai_usage_events
  for select using (auth.uid() = user_id);

-- No insert/update/delete policy ON PURPOSE: writes are service_role only
-- (the edge function's admin client). RLS-on + no write policy denies all
-- direct anon/authenticated writes, so a user can't forge or inflate COGS.

comment on table public.ai_usage_events is
  'COGS ledger: one row per server-side AI call. Revenue lives in credit_ledger; spend_id links the two. Read-own RLS; writes are service_role-only.';
