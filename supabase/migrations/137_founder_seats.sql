-- ════════════════════════════════════════════════════════════════════════════
-- 137_founder_seats.sql — the Founder seat as a first-class ENTITLEMENT.
-- ════════════════════════════════════════════════════════════════════════════
-- ⚠️⚠️  DRAFT — PRESENTED FOR OWNER SIGN-OFF, NOT DECIDED.  ⚠️⚠️
--   The schema SHAPE here is owner-gated (the standing rule for anything touching
--   persistence). This file is written so it CAN be deployed unchanged once the
--   owner signs the shape, but it must NOT be applied until then. See the report
--   delivered with this migration for the verbatim shape + the sign-off questions.
--
-- @rollback: drop function if exists public.claim_next_founder_seat(uuid); drop function if exists public.set_founder_display_optin(text, text); drop function if exists public.list_founder_seats_public(); drop table if exists public.founder_seat_transfers; drop table if exists public.founder_seats;
--
-- ⚠️  WRITTEN, NOT APPLIED (the 130–136 standing pattern). supabase/applied-head.json
--   is deliberately NOT bumped — prod stays at its applied head; `validate:migration-head`
--   surfaces this as a pending (undeployed) migration (visible, not fatal). Everything
--   below is inert until `supabase db push` + a PostgREST refresh.
--
-- ── WHY A SEAT TABLE AT ALL (today's model) ─────────────────────────────────────
--   Founders are tracked TODAY only by profiles.is_founder=true (010's
--   founder_seats_taken() counts those rows; 116 dedupes the bonus grant). There is
--   no durable seat NUMBER, no lineage, no transferable identity — the "seat N" the
--   FounderTile shows is a live ordinal (cap − remaining + 1), not a stored fact.
--
--   The Founder offer is: 30 lifetime seats, $99, THE CAP NEVER RAISES; transfers are
--   the cap's defense (succession, never minting). That needs the seat to be a
--   first-class ENTITLEMENT that is SEPARATE FROM THE ACCOUNT: a seat can change
--   hands, carry a public lineage, and outlive any one holder's account — while the
--   simulation NEVER reads it (the premium-seam law: entitlements gate the interface,
--   the sim is oblivious). is_founder stays the per-account fast flag the money path
--   already uses; THIS table is the durable seat identity that flag points at.
--
-- ── SHAPE (two tables — the twin-log choice, see rationale) ─────────────────────
--   founder_seats            — ONE immutable row per seat (seat_id 1..30 PK). Current
--                              holder (nullable pre-sale), the holder's OPT-IN public
--                              display fields, held-since. The hot read (the public
--                              page renders current holders) is a trivial PK scan.
--   founder_seat_transfers   — APPEND-ONLY lineage ledger. One row per succession,
--                              snapshotting the OUTGOING holder's opted display name
--                              (so prior-holder names survive the transfer as history,
--                              never erased — but only ever the name they opted to show).
--
--   WHY TWO TABLES (not same-table append rows): a single table with a row per
--   transfer forfeits seat_id as a unique immutable PK (it recurs per transfer),
--   forces a "current" flag + composite key, turns every current-holder read into a
--   filtered scan, and muddies "append-only" (the same table would also serve live
--   opt-in UPDATEs). Splitting them keeps seat_id a true PK, the current-holder read
--   O(1), and the ledger genuinely INSERT-only (no update/delete policy at all).
--
-- ── FAIL-CLOSED PUBLIC EXPOSURE ─────────────────────────────────────────────────
--   RLS gates ROWS, not COLUMNS. To expose "opted-in display fields ONLY" (seat
--   number, opted display name, held-since, prior opted names) and NOTHING else
--   (never a holder's user id or email), the public read is a SECURITY DEFINER RPC
--   that hand-picks the safe columns — the same defense-in-depth pattern the gallery
--   uses (076's list_gallery_* / get_gallery_dossier). The base table grants anon
--   NOTHING; the projection RPC is the only anon-reachable surface, and it emits a
--   holder's fields only when that holder opted in. Nothing about a holder is public
--   except what they chose to show.
--
-- ── TRANSFER MECHANISM IS OUT OF SCOPE (concierge v1, ~month 12) ─────────────────
--   No transfer verb ships here. The append-only ledger + the assignment primitive
--   are the FOUNDATION a future concierge flow writes THROUGH; the actual
--   pay/verify/clear/payout transfer choreography is deliberately deferred.
--
-- Depends on: auth.users, public.profiles (009). Re-runnable (create-if-not-exists +
--   create-or-replace + drop-policy-if-exists + on-conflict-do-nothing seed).
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. founder_seats — one immutable row per seat ───────────────────────────────
-- seat_id is the immutable entitlement identity (1..30), NOT a user row. holder_user_id
-- is nullable (unclaimed pre-sale) and ON DELETE SET NULL: a deleted account releases
-- the seat's holder pointer but the seat entitlement row PERSISTS — the seat is
-- separate from the account by construction.
create table if not exists public.founder_seats (
  seat_id            smallint primary key
                       check (seat_id between 1 and 30),
  holder_user_id     uuid references auth.users(id) on delete set null,
  -- The holder's OPT-IN public display name. NULL ⇒ the holder has not opted to be
  -- named publicly ⇒ the seat renders as "a Founder" / unclaimed. Moderated on the
  -- same public-projection + moderation lanes as gallery display content.
  display_name_optin text,
  -- Moderation state for display_name_optin, mirroring the gallery moderation lane:
  -- only 'approved' ever projects publicly (fail-closed default 'pending').
  display_name_status text not null default 'pending'
                       check (display_name_status in ('pending', 'approved', 'rejected')),
  -- OPT-IN link target: the public_slug of one representative PUBLIC gallery world of
  -- the holder's, so the page can offer "see their worlds" (the world detail's
  -- "more by this creator" reveals the rest). NULL ⇒ no link rendered. Opted-in +
  -- moderated alongside the display name. (⚠️ SIGN-OFF: this column is BEYOND the
  -- brief's explicit public-field list [seat #, opted name, held-since, prior names] —
  -- it exists only because there is no author-landing URL in the app today, so a
  -- representative slug is the only join key that reaches the public gallery. Veto
  -- this column and the page's "see their worlds" link simply never renders.)
  gallery_author_slug text,
  -- When the CURRENT holder took the seat. NULL while unclaimed.
  held_since         timestamptz,
  claimed_at         timestamptz,
  updated_at         timestamptz not null default now()
);

comment on table public.founder_seats is
  'The 30 Founder seats as first-class ENTITLEMENTS (seat_id 1..30, immutable), separate from the account (holder_user_id is a nullable pointer, ON DELETE SET NULL). Holder display fields are OPT-IN and moderated; only display_name_status=approved ever projects publicly via list_founder_seats_public(). The simulation NEVER reads this table (premium-seam law). DRAFT — awaiting owner sign-off of the shape.';

comment on column public.founder_seats.holder_user_id is
  'Nullable pointer to the current holder (auth.users). ON DELETE SET NULL — a deleted account releases the pointer but the seat entitlement row persists. NEVER exposed publicly.';
comment on column public.founder_seats.display_name_optin is
  'The holder''s opt-in public display name. NULL ⇒ not opted in ⇒ renders as "a Founder". Public ONLY when display_name_status=approved.';
comment on column public.founder_seats.gallery_author_slug is
  'Opt-in representative public gallery world slug (link target for "see their worlds"). ⚠️ beyond the brief''s explicit field list — vetoable at sign-off.';

create index if not exists idx_founder_seats_holder on public.founder_seats(holder_user_id);

-- ── 2. founder_seat_transfers — append-only lineage ledger ──────────────────────
-- One row per succession. from_display_name snapshots the OUTGOING holder's opted
-- display name at transfer time (only if they had opted in) so the lineage keeps
-- prior opted names as history — appended, never erased, never a name they didn't opt
-- to show. There is NO update/delete policy: for a non-superuser the ledger is
-- INSERT-only through the service-role write path.
create table if not exists public.founder_seat_transfers (
  id                 uuid primary key default gen_random_uuid(),
  seat_id            smallint not null references public.founder_seats(seat_id),
  from_holder        uuid references auth.users(id) on delete set null,
  to_holder          uuid references auth.users(id) on delete set null,
  -- Snapshot of the outgoing holder's opted display name (NULL if they never opted in).
  -- Snapshotted (not joined live) because the outgoing holder is no longer the seat
  -- holder and may change their profile later — the lineage records what they chose to
  -- show AS a Founder. A prior holder's scrub-right over this snapshot is a v-next
  -- concierge concern (see the report's open questions).
  from_display_name  text,
  transferred_at     timestamptz not null default now(),
  note               text
);

comment on table public.founder_seat_transfers is
  'Append-only Founder seat lineage. One row per succession; from_display_name snapshots the outgoing holder''s opted display name (NULL if not opted in). No update/delete policy — INSERT-only via the service-role write path. Transfers append, never erase. DRAFT — awaiting owner sign-off.';

create index if not exists idx_founder_transfers_seat on public.founder_seat_transfers(seat_id, transferred_at);

-- ── 3. Seed the 30 unclaimed seats (the dignified pre-launch state at the DB) ────
-- The seats exist as durable rows from day one, all unclaimed — the offer IS the
-- content pre-launch. Idempotent: on-conflict-do-nothing never disturbs a claimed row.
insert into public.founder_seats (seat_id)
select gs from generate_series(1, 30) as gs
on conflict (seat_id) do nothing;

-- ── 4. RLS — fail-closed; the base tables grant anon NOTHING ─────────────────────
alter table public.founder_seats           enable row level security;
alter table public.founder_seat_transfers  enable row level security;

-- founder_seats: a holder may UPDATE only their OWN seat row (the row-visibility
-- backstop; the RPC below is the actual column-limited write path). No SELECT policy
-- for anon/authenticated — the public projection RPC is the only read surface, and
-- service_role (definer functions) does the assignment writes.
drop policy if exists "Holder updates own founder seat" on public.founder_seats;
create policy "Holder updates own founder seat" on public.founder_seats
  for update
  using (auth.uid() = holder_user_id)
  with check (auth.uid() = holder_user_id);

-- founder_seat_transfers: NO policy at all → default-deny for every non-superuser.
-- Reads go through the projection RPC (prior opted names only); writes go through the
-- service-role definer path. Append-only by the absence of any update/delete policy.

comment on policy "Holder updates own founder seat" on public.founder_seats is
  'Row backstop: a holder may touch only their own seat row. Column-limited opt-in mutation is enforced by set_founder_display_optin() (a holder cannot move seat_id/holder via this policy path — the RPC is the sanctioned writer).';

-- ── 5. Public projection — SECURITY DEFINER, opted-in fields ONLY ────────────────
-- The ONLY anon-reachable read. Emits: seat number, the holder's opted+approved
-- display name (else NULL), held-since, and prior opted+snapshotted display names.
-- NEVER a holder's user id, email, gallery-less identity, or an unapproved name.
create or replace function public.list_founder_seats_public()
returns table (
  seat_id            smallint,
  display_name       text,
  gallery_slug       text,
  held_since         timestamptz,
  prior_names        text[]
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    s.seat_id,
    -- opted-in AND moderation-approved, else NULL (fail-closed).
    case when s.display_name_status = 'approved' then nullif(btrim(coalesce(s.display_name_optin, '')), '') end,
    case when s.display_name_status = 'approved' then nullif(btrim(coalesce(s.gallery_author_slug, '')), '') end,
    s.held_since,
    -- prior opted names, most-recent-first; only non-null snapshots (already opt-in).
    coalesce(
      (select array_agg(t.from_display_name order by t.transferred_at desc)
         from public.founder_seat_transfers t
        where t.seat_id = s.seat_id
          and nullif(btrim(coalesce(t.from_display_name, '')), '') is not null),
      '{}'::text[]
    )
  from public.founder_seats s
  order by s.seat_id;
$$;

revoke all on function public.list_founder_seats_public() from public;
grant execute on function public.list_founder_seats_public() to anon, authenticated;

comment on function public.list_founder_seats_public() is
  'Public Founder lineage projection. Returns ONLY opted-in display fields (seat number, approved display name, opted gallery slug, held-since, prior opted names). Never a holder user id/email/unapproved name. Fail-closed: a non-approved or absent name projects NULL. anon + authenticated.';

-- ── 6. Holder self-service opt-in — column-limited definer write ─────────────────
-- A holder sets/clears their OWN seat's opt-in display fields; a fresh opt-in re-enters
-- moderation (status → 'pending'; only an approver flips to 'approved'). Cannot move
-- seat_id/holder. Granted to authenticated (a signed-in holder calls it directly).
create or replace function public.set_founder_display_optin(
  p_display_name text default null,
  p_gallery_slug text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_seat   smallint;
  v_name   text;
  v_slug   text;
begin
  if auth.uid() is null then
    raise exception 'sign-in required';
  end if;
  v_name := nullif(btrim(coalesce(p_display_name, '')), '');
  v_slug := nullif(btrim(coalesce(p_gallery_slug, '')), '');

  update public.founder_seats
     set display_name_optin  = v_name,
         gallery_author_slug  = v_slug,
         -- any new/changed opt-in re-enters moderation; clearing it resets to pending.
         display_name_status  = 'pending',
         updated_at           = now()
   where holder_user_id = auth.uid()
  returning seat_id into v_seat;

  if v_seat is null then
    raise exception 'caller holds no founder seat';
  end if;

  return jsonb_build_object('seat_id', v_seat, 'display_name', v_name, 'status', 'pending');
end;
$$;

revoke all on function public.set_founder_display_optin(text, text) from public;
grant execute on function public.set_founder_display_optin(text, text) to authenticated;

comment on function public.set_founder_display_optin(text, text) is
  'Holder self-service: set/clear the caller''s own seat opt-in display name + gallery slug. Re-enters moderation (status=pending). Cannot change seat_id/holder. authenticated only.';

-- ── 7. Seat assignment PRIMITIVE (service-role) — the webhook HOOK stays DEFERRED ─
-- Claims the LOWEST unclaimed seat for a user and stamps held-since. This is the
-- entitlement primitive the "service-role writes for seat assignment" requirement
-- names. ⚠️ WIRING IT INTO stripe-webhook (call on a founder_lifetime purchase) is
-- the "propose, do not wire" hook — NOT added to supabase/functions/stripe-webhook
-- here; see the report. Idempotent per user: a user who already holds a seat gets it
-- back rather than a second seat (defends the never-mint cap).
create or replace function public.claim_next_founder_seat(p_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_role text;
  v_seat smallint;
begin
  v_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if v_role <> 'service_role' then
    raise exception 'claim_next_founder_seat is service-role only (got: %)', v_role;
  end if;
  if p_user is null then
    raise exception 'a user is required';
  end if;

  -- Already a holder? Return the existing seat (idempotent — never mints a second).
  select seat_id into v_seat from public.founder_seats where holder_user_id = p_user;
  if v_seat is not null then
    return jsonb_build_object('seat_id', v_seat, 'assigned', false);
  end if;

  -- Claim the lowest unclaimed seat atomically (row lock; skip locked so concurrent
  -- purchases take distinct seats). NULL ⇒ sold out (all 30 held).
  update public.founder_seats
     set holder_user_id = p_user,
         held_since     = now(),
         claimed_at     = now(),
         updated_at     = now()
   where seat_id = (
     select seat_id from public.founder_seats
      where holder_user_id is null
      order by seat_id
      for update skip locked
      limit 1
   )
  returning seat_id into v_seat;

  if v_seat is null then
    raise exception 'all 30 founder seats are claimed';
  end if;

  return jsonb_build_object('seat_id', v_seat, 'assigned', true);
end;
$$;

revoke all on function public.claim_next_founder_seat(uuid) from public;
grant execute on function public.claim_next_founder_seat(uuid) to service_role;

comment on function public.claim_next_founder_seat(uuid) is
  'Service-role seat-assignment primitive: claims the LOWEST unclaimed seat for p_user (idempotent — an existing holder gets their seat back, never a second). The stripe-webhook HOOK that calls this on a founder_lifetime purchase is DEFERRED (propose, do not wire). service_role only.';
