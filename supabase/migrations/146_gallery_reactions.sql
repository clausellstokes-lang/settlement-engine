-- ────────────────────────────────────────────────────────────────────────────
-- 146_gallery_reactions.sql — structured reactions on public gallery dossiers
-- (GALLERY-2 phase 2, owner-signed 2026-07-17).
--
-- WHAT
--   A bounded, fiction-register reaction vocabulary — six fixed keys, no free
--   text anywhere (comments stay a separate, already-shipped surface; free-form
--   commentary remains deferred post-launch per the standing ruling). A signed-in
--   reader may give each reaction at most once per settlement and may combine
--   reactions (the PK is (settlement_id, user_id, reaction_key)).
--
--   The six keys ↔ display labels (the client-side frozen vocabulary lives in
--   src/data/galleryReactionVocab.js; the parity test pins the two lists to
--   each other so they can never drift):
--     worth_walking   — "A world worth walking"
--     finely_wrought  — "Finely wrought"
--     steeped_history — "Steeped in history"
--     run_campaign    — "I'd run a campaign here"
--     map_speaks      — "The map speaks"
--     true_to_life    — "True to life"
--
-- POSTURE — mirrors gallery_votes EXACTLY (019 schema + 059 banned-account
--   hardening + 125 velocity guard + 131 search_path pinning):
--   • RLS on; owner-scoped SELECT/DELETE; INSERT requires the caller BE the
--     user, the settlement be public, and the account be active (059 posture).
--   • All client writes go through the SECURITY DEFINER toggle RPC below, which
--     re-checks auth + account status and consumes the SHARED velocity counter
--     (_consume_action_rate_limit, migration 125 — no new limiter infra).
--     Ceiling: 120 accepted toggles/hour/user (double the vote ceiling — six
--     distinct chips make a higher legitimate toggle rate; still far below bot
--     speed).
--   • Aggregate reads (counts) are exposed through get_gallery_reaction_state
--     (public-settlement-gated, anon-safe) and, for tiles, through the
--     tile-rows helper (migration 148).
--
-- OPERATOR
--   • Apply via `supabase db push` AFTER 125 (velocity infra) — rides the
--     end-of-cycle deploy batch with 118+. Additive; idempotent
--     (if-not-exists / drop-if-exists + create).
--   • Rollback: drop function public.toggle_gallery_reaction(uuid, text);
--     drop function public.get_gallery_reaction_state(uuid);
--     drop table public.gallery_reactions;
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. The reactions table (mirrors gallery_votes, 019) ──────────────────────
create table if not exists public.gallery_reactions (
  settlement_id uuid not null references public.settlements(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction_key text not null check (reaction_key in (
    'worth_walking', 'finely_wrought', 'steeped_history',
    'run_campaign', 'map_speaks', 'true_to_life'
  )),
  created_at timestamptz not null default now(),
  primary key (settlement_id, user_id, reaction_key)
);

alter table public.gallery_reactions enable row level security;

-- Aggregation path: the tile-rows helper (148) and the state RPC below both
-- group by settlement — the PK already leads on settlement_id, so no extra
-- index is needed for the per-settlement aggregate.

-- ── 2. RLS — the gallery_votes posture verbatim (019 + 059) ──────────────────
drop policy if exists "Users can read their own gallery reactions" on public.gallery_reactions;
create policy "Users can read their own gallery reactions"
  on public.gallery_reactions
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can react to public settlements" on public.gallery_reactions;
create policy "Users can react to public settlements"
  on public.gallery_reactions
  for insert
  with check (
    auth.uid() = user_id
    and public.account_is_active(auth.uid())
    and exists (
      select 1 from public.settlements s
      where s.id = settlement_id and s.is_public = true
    )
  );

drop policy if exists "Users can remove their own gallery reactions" on public.gallery_reactions;
create policy "Users can remove their own gallery reactions"
  on public.gallery_reactions
  for delete
  using (auth.uid() = user_id);

-- ── 3. toggle_gallery_reaction — the vote-toggle body shape (131 net-current) ─
create or replace function public.toggle_gallery_reaction(target_settlement_id uuid, reaction text)
returns table (reaction_key text, reaction_count integer, mine boolean)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in to react';
  end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;
  -- The bounded vocabulary — MUST stay identical to the table CHECK above and
  -- to src/data/galleryReactionVocab.js (pinned by the vocab parity test).
  if reaction not in (
    'worth_walking', 'finely_wrought', 'steeped_history',
    'run_campaign', 'map_speaks', 'true_to_life'
  ) then
    raise exception 'Unknown reaction';
  end if;

  -- Velocity guard (125 infra): at most 120 accepted toggles/hour/user. Six
  -- distinct chips make a higher legitimate rate than the single vote button
  -- (60/h); wire-speed toggling is still bot behaviour.
  if public._consume_action_rate_limit(auth.uid(), 'gallery_reaction', 3600) > 120 then
    raise exception 'You are reacting too quickly — please slow down and try again shortly.';
  end if;

  perform 1 from public.settlements
    where id = target_settlement_id and is_public = true;
  if not found then
    raise exception 'Settlement is not public';
  end if;

  if exists (
    select 1 from public.gallery_reactions gr
    where gr.settlement_id = target_settlement_id
      and gr.user_id = auth.uid()
      and gr.reaction_key = reaction
  ) then
    delete from public.gallery_reactions gr
      where gr.settlement_id = target_settlement_id
        and gr.user_id = auth.uid()
        and gr.reaction_key = reaction;
  else
    insert into public.gallery_reactions(settlement_id, user_id, reaction_key)
      values (target_settlement_id, auth.uid(), reaction)
      on conflict do nothing;
  end if;

  -- Return the settlement's FULL post-toggle reaction state (nonzero keys only;
  -- the client fills zeros from its frozen vocabulary) so one round-trip
  -- refreshes every chip.
  return query
    select gr.reaction_key,
           count(*)::integer as reaction_count,
           bool_or(gr.user_id = auth.uid()) as mine
    from public.gallery_reactions gr
    where gr.settlement_id = target_settlement_id
    group by gr.reaction_key;
end;
$$;

revoke execute on function public.toggle_gallery_reaction(uuid, text) from public;
grant execute on function public.toggle_gallery_reaction(uuid, text) to authenticated;

comment on function public.toggle_gallery_reaction(uuid, text) is
  'Toggle one of the six fixed gallery reactions on a public settlement (GALLERY-2 phase 2). Auth-only; banned-account gated; 120/h velocity ceiling through the shared 125 counter. Returns the settlement''s full post-toggle reaction state (nonzero keys).';

-- ── 4. get_gallery_reaction_state — the get_gallery_vote_state posture (020) ──
create or replace function public.get_gallery_reaction_state(target_settlement_id uuid)
returns table (reaction_key text, reaction_count integer, mine boolean)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    gr.reaction_key,
    count(*)::integer as reaction_count,
    coalesce(bool_or(gr.user_id = auth.uid()), false) as mine
  from public.settlements s
  join public.gallery_reactions gr on gr.settlement_id = s.id
  where s.id = target_settlement_id
    and s.is_public = true
  group by gr.reaction_key;
$$;

revoke execute on function public.get_gallery_reaction_state(uuid) from public;
grant execute on function public.get_gallery_reaction_state(uuid) to authenticated, anon;

comment on function public.get_gallery_reaction_state(uuid) is
  'Per-key reaction counts (+ whether the caller gave each) for one public settlement. Anon-safe: mine is always false for anonymous readers. Empty result = no reactions yet.';
