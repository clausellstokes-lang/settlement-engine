-- ════════════════════════════════════════════════════════════════════════════
-- 137_founder_seats.sql — the Founder seat as a first-class ENTITLEMENT.
-- ════════════════════════════════════════════════════════════════════════════
-- ✅ SIGNED OFF 2026-07-19 (owner ruling, ledger @ 15ba006c → the Money Wave freeze):
--   the seat-register SHAPE is decided. This file is REWRITTEN IN PLACE (never
--   applied anywhere — prod head is 117) into the production seat register v2: it
--   KEEPS everything the sign-off draft had (both tables, the seed, the RLS
--   posture, the public projection, the opt-in RPC, the claim primitive) and ADDS
--   the transfer-lifecycle columns/stamps (§6.1), WIRES the webhook seat-claim hook
--   (137's deliberate deferral ends — see the founder_lifetime branch in
--   stripe-webhook), and adds the mirrored clawback release. Rewriting in place
--   (rather than a superseding migration) keeps the chain free of duplicate table
--   definitions and keeps list_founder_seats_public where its shipped client
--   (founderLineage.js) expects it. Still WRITTEN-NOT-DEPLOYED (the whole 118+ chain
--   ships together at the owner's `db push`).
--
-- @rollback: drop function if exists public.release_founder_seat_on_clawback(uuid); drop function if exists public.claim_next_founder_seat(uuid); drop function if exists public.set_founder_display_optin(text, text); drop function if exists public.list_founder_seats_public(); drop table if exists public.founder_seat_buyback_challenges; drop table if exists public.founder_seat_buybacks; drop table if exists public.founder_seat_transfers; drop table if exists public.founder_seats;
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
  -- ── Transfer lifecycle (§6.1, Money Wave). All nullable/defaulted so a plain
  --    unclaimed-seat INSERT and an existing claimed row both stay valid. ──────
  -- When the seat was ORIGINALLY purchased (stamped at first claim; the 12-month
  -- hold + chargeback invariant (LAW 8) are measured from here). NULL pre-sale.
  original_purchase_at timestamptz,
  -- How the CURRENT holder acquired the seat. 'purchase' at first claim; 'transfer'
  -- when a finalize moves it; 'estate'/'grant' for the concierge paths.
  acquired_via         text not null default 'purchase'
                         check (acquired_via in ('purchase','transfer','estate','grant')),
  -- held_since + 12 months: the earliest this holder may initiate a transfer.
  transfer_eligible_at timestamptz,
  -- The most recent finalize that moved this seat (for the per-seat cooldown).
  last_transfer_at     timestamptz,
  -- last_transfer_at + 12 months: no second transfer of this seat before this.
  cooldown_until       timestamptz,
  -- The seat's security posture. 'transfer_locked' bars new transfers; 'flagged'
  -- marks a post-payout dispute; 'escheat' marks an abandoned seat (§6.8).
  security_status text not null default 'normal'
                         check (security_status in ('normal','transfer_locked','flagged','escheat')),
  -- ── Stewardship (§6.8, M-10). All nullable/defaulted (unclaimed + claimed rows stay
  --    valid). last_dormancy_nudge_at gates the once-per-12-months dormancy nudge;
  --    abandonment_notice_started_at stamps the escheat notice window (any sign-in clears
  --    it); abandonment_notice_count paces the notices (≤ config notice_count). ──────
  last_dormancy_nudge_at       timestamptz,
  abandonment_notice_started_at timestamptz,
  abandonment_notice_count     int not null default 0,
  updated_at         timestamptz not null default now()
);

comment on table public.founder_seats is
  'The 30 Founder seats as first-class ENTITLEMENTS (seat_id 1..30, immutable), separate from the account (holder_user_id is a nullable pointer, ON DELETE SET NULL). Holder display fields are OPT-IN and moderated; only display_name_status=approved ever projects publicly via list_founder_seats_public(). The simulation NEVER reads this table (premium-seam law). Transfer lifecycle columns (§6.1) added at the Money Wave freeze; seat records are purge-immune (LAW 9).';

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
  'Append-only Founder seat lineage. One row per succession; from_display_name snapshots the outgoing holder''s opted display name (NULL if not opted in). No update/delete policy — INSERT-only via the service-role write path. Transfers append, never erase (reversals/buybacks/abandonment append a note row, they do NOT delete history).';

create index if not exists idx_founder_transfers_seat on public.founder_seat_transfers(seat_id, transferred_at);

-- ── 2b. founder_seat_buybacks — the STANDING BUYBACK ledger (§6.8, M-10) ─────────
-- One row per buyback (a holder sells their seat back to the company). amount_cents is
-- snapshotted from the seat_buyback_cents dial AT CLAIM TIME (never hand-typed). The
-- payout rides the SAME due-runner + performPayout as transfer payouts (idempotencyKey
-- buyback-<id>; the seat_payout credits-election dedups on buyback_id — 163). state
-- mirrors payout_status: pending_payout → releasing → paid | held | failed.
create table if not exists public.founder_seat_buybacks (
  id                uuid primary key default gen_random_uuid(),
  seat_id           smallint not null references public.founder_seats(seat_id),
  user_id           uuid references auth.users(id) on delete set null,
  state             text not null default 'pending_payout'
                      check (state in ('pending_payout','releasing','paid','held','failed')),
  amount_cents      int not null,
  payout_form       text not null default 'connect_cash'
                      check (payout_form in ('connect_cash','account_credits')),
  connect_account_id text,
  stripe_transfer_id text unique,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  resolved_at       timestamptz
);
comment on table public.founder_seat_buybacks is
  'Standing-buyback ledger (137, §6.8/M-10). One row per seat sold back to the company for the seat_buyback_cents dial amount (snapshotted at claim). Payout rides the transfer due-runner (performPayout; idempotencyKey buyback-<id>; credits-election dedups on buyback_id). Owner-readable (the account panel); service-role writes.';
create index if not exists idx_seat_buybacks_state on public.founder_seat_buybacks(state);
create index if not exists idx_seat_buybacks_user on public.founder_seat_buybacks(user_id, created_at desc);

-- ── 2c. founder_seat_buyback_challenges — the caseless emailed 2FA code (§6.8) ───
-- The buyback is a caseless action, so it cannot use the case-bound founder_transfer_
-- challenges. This mirrors the 6.2 idiom (bcrypt hash, 10-min TTL, 5-attempt cap) keyed
-- by USER. RLS-ON zero-policy — issued/verified only via the service-role RPCs (164).
create table if not exists public.founder_seat_buyback_challenges (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  code_hash   text not null,                     -- crypt(code, gen_salt('bf'))
  expires_at  timestamptz not null,              -- now() + 10 min
  attempts    int not null default 0,
  consumed_at timestamptz,
  created_at  timestamptz not null default now()
);
comment on table public.founder_seat_buyback_challenges is
  'Emailed buyback confirmation codes (137, §6.8). Caseless (keyed by user) mirror of the founder_transfer_challenges idiom: bcrypt at rest, 10-min TTL, 5-attempt cap. RLS-ON zero-policy — service-role RPCs only.';
create index if not exists idx_seat_buyback_challenges_user on public.founder_seat_buyback_challenges(user_id, created_at desc);

-- ── 3. Seed the 30 unclaimed seats (the dignified pre-launch state at the DB) ────
-- The seats exist as durable rows from day one, all unclaimed — the offer IS the
-- content pre-launch. Idempotent: on-conflict-do-nothing never disturbs a claimed row.
insert into public.founder_seats (seat_id)
select gs from generate_series(1, 30) as gs
on conflict (seat_id) do nothing;

-- ── 4. RLS — fail-closed; the base tables grant anon NOTHING ─────────────────────
alter table public.founder_seats                    enable row level security;
alter table public.founder_seat_transfers           enable row level security;
alter table public.founder_seat_buybacks            enable row level security;
alter table public.founder_seat_buyback_challenges  enable row level security;

-- founder_seat_buybacks: a holder may SELECT their OWN buyback rows (feeds the account
-- panel's buyback status). Service-role (definer RPCs) does all writes.
drop policy if exists "Owner reads own seat buybacks" on public.founder_seat_buybacks;
create policy "Owner reads own seat buybacks" on public.founder_seat_buybacks
  for select using (auth.uid() = user_id);

-- founder_seat_buyback_challenges: NO policy → default-deny; issued/verified only via
-- the service-role definer RPCs (the code is never client-readable).

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

-- ── 7. Seat assignment PRIMITIVE (service-role) — the webhook HOOK is NOW WIRED ──
-- Claims the LOWEST unclaimed seat for a user and stamps the original-purchase
-- lifecycle. 137's deliberate deferral ends: the stripe-webhook founder_lifetime
-- branch calls this AFTER the profile writes, never-throw into fulfillment
-- (log-don't-throw; is_founder stays the fast flag and the money truth, a missed
-- seat row is operator-repairable via this idempotent primitive). Idempotent per
-- user: a user who already holds a seat gets it back rather than a second seat
-- (defends the never-mint cap).
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
  -- purchases take distinct seats). NULL ⇒ sold out (all 30 held). The transfer
  -- lifecycle stamps (§6.1) are set here at the ORIGINAL purchase: original_purchase_at
  -- anchors the 12-month hold + chargeback invariant (LAW 8), and transfer_eligible_at
  -- = held_since + 12 months is the earliest this holder may initiate a transfer.
  update public.founder_seats
     set holder_user_id       = p_user,
         held_since           = now(),
         claimed_at           = now(),
         original_purchase_at = now(),
         acquired_via         = 'purchase',
         transfer_eligible_at = now() + interval '12 months',
         updated_at           = now()
   where seat_id = (
     select seat_id from public.founder_seats
      where holder_user_id is null
        -- ESCHEAT seats (§6.8/M-10) return to the pool but are NEVER auto-resold
        -- (Q1) — only an owner decision releases them. A 'normal' unclaimed seat is
        -- the only auto-assignable one.
        and security_status = 'normal'
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
  'Service-role seat-assignment primitive: claims the LOWEST unclaimed seat for p_user, stamping original_purchase_at/held_since/transfer_eligible_at (idempotent — an existing holder gets their seat back, never a second). Called by the stripe-webhook founder_lifetime branch (never-throw). service_role only.';

-- ── 8. Clawback seat RELEASE (service-role) — the mirror of the claim ────────────
-- When a founder_lifetime purchase is refunded/charged-back, clawbackFounderForSession
-- flips is_founder→false; this RPC mirrors that on the seat register: it clears the
-- holder (the seat returns to the unclaimed pool — the refunded seat is resellable,
-- the cap intact) and appends a lineage note so the succession record is honest. Runs
-- AFTER the is_founder flip, log-don't-throw (the existing post-claim posture). Claim-
-- once by construction: a redelivered refund finds the holder already cleared and the
-- UPDATE ... WHERE holder_user_id = p_user touches no row (returns released:false).
-- The outgoing holder's opted display name is snapshotted into the lineage row (only
-- if they had opted in), matching the finalize/transfer lineage discipline.
create or replace function public.release_founder_seat_on_clawback(p_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_role text;
  v_seat smallint;
  v_from_name text;
begin
  v_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if v_role <> 'service_role' then
    raise exception 'release_founder_seat_on_clawback is service-role only (got: %)', v_role;
  end if;
  if p_user is null then
    raise exception 'a user is required';
  end if;

  -- Snapshot the outgoing holder's opted+approved display name BEFORE clearing, so
  -- the lineage keeps what they chose to show as a Founder (NULL if never opted in).
  select case when display_name_status = 'approved'
              then nullif(btrim(coalesce(display_name_optin, '')), '') end
    into v_from_name
  from public.founder_seats
  where holder_user_id = p_user;

  -- Claim-once: clear the holder and reset the seat to a fresh unclaimed state. A
  -- redelivered refund finds no matching holder and no-ops.
  update public.founder_seats
     set holder_user_id       = null,
         display_name_optin   = null,
         display_name_status  = 'pending',
         gallery_author_slug  = null,
         held_since           = null,
         claimed_at           = null,
         original_purchase_at = null,
         acquired_via         = 'purchase',
         transfer_eligible_at = null,
         last_transfer_at     = null,
         cooldown_until       = null,
         security_status      = 'normal',
         updated_at           = now()
   where holder_user_id = p_user
  returning seat_id into v_seat;

  if v_seat is null then
    return jsonb_build_object('released', false);
  end if;

  insert into public.founder_seat_transfers (seat_id, from_holder, to_holder, from_display_name, note)
    values (v_seat, p_user, null, v_from_name, 'clawback');

  return jsonb_build_object('released', true, 'seat_id', v_seat);
end;
$$;

revoke all on function public.release_founder_seat_on_clawback(uuid) from public;
grant execute on function public.release_founder_seat_on_clawback(uuid) to service_role;

comment on function public.release_founder_seat_on_clawback(uuid) is
  'Service-role mirror of claim_next_founder_seat for the refund/chargeback clawback: clears the holder (seat returns to the unclaimed pool, cap intact) and appends a ''clawback'' lineage note. Claim-once (a redelivered refund finds the holder cleared and no-ops). service_role only.';
