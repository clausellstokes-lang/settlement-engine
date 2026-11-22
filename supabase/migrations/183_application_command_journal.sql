-- ────────────────────────────────────────────────────────────────────────────
-- 183_application_command_journal.sql — durable application-command identity
-- and the first server-authoritative canon-event transaction.
--
-- WHY
--   Client session replay prevents double clicks, but it cannot settle an
--   ambiguous network answer or a retry after reload. Persisting a save and then
--   recording idempotency in a second request is equally unsafe: either half may
--   commit alone. This migration puts command claim, revision CAS, save mutation,
--   and final receipt in one PostgreSQL transaction.
--
-- BOUNDED FIRST VERTICAL
--   apply_cut_trade_route_command handles CUT_TRADE_ROUTE only. The event is
--   prepared deterministically by the client, then the server verifies owner,
--   command identity, event family, the exact JSONB base projection, and a
--   constrained event-specific shape for the next projection before replacing
--   data/campaign_state. This is not server-side simulation: the authenticated
--   owner still supplies the prepared contents of the fields CUT_TRADE_ROUTE is
--   allowed to change. Other canon events stay on the legacy path until their
--   extra crisis, relationship, succession, and campaign-clock effects can move
--   without semantic loss.
--
-- REVISION AUTHORITY
--   `base-projection-v1` deliberately compares JSONB rather than updated_at.
--   Legacy writes optimistically stamp a client time while the database trigger
--   stamps its own time, so treating the cached timestamp as a server revision
--   would reject every command after a successful legacy write until reload.
--   A database-owned monotonic state_revision is the intended successor once
--   every legacy outbox completion can carry that revision back into the store.
--   Adding it before that return path exists would merely replace one dishonest
--   client revision with another. JSONB equality is normalized by PostgreSQL
--   and catches every settlement/campaign base change participating in this
--   command while permitting unrelated row metadata writes. expected_revision
--   remains review provenance and command identity; it is not the row-lock
--   predicate.
--
-- SECURITY
--   • Authenticated owners may SELECT their own journal rows through RLS.
--   • No client role may INSERT/UPDATE/DELETE the journal directly.
--   • Generic lifecycle functions are service-role only.
--   • The command-specific SECURITY DEFINER RPC is authenticated-only and
--     rechecks auth.uid, expected owner, active account, and save ownership.
--
-- DELIVERY
--   This journal is command authority, not a transport queue. The migrated
--   client path does not also enqueue the legacy save outbox.
--
-- RECONCILIATION VISIBILITY
--   The initiating RPC returns stale/reconcile-required outcomes and owners may
--   inspect their own durable rows through RLS. The initiating Surveyor session
--   exposes an explicit check: finalized/applied replays the exact original
--   command for projection, a missing row permits the same idempotent command
--   to retry, and unresolved rows remain blocked. The scheduled obligation
--   probe alerts on aged unresolved rows. This bounded vertical still has no
--   reopen-time product inbox or operator reconciliation queue, so recovery is
--   visible but not universal.
--
-- @rollback:
--   drop function if exists public.apply_cut_trade_route_command(uuid, text, uuid, timestamptz, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb);
--   drop function if exists public.mark_application_command_reconcile(uuid, text, text, text);
--   drop function if exists public.finalize_application_command(uuid, text, text, text, jsonb, text);
--   drop function if exists public.claim_application_command(uuid, text, text, text, uuid, timestamptz);
--   drop table if exists public.application_command_journal;
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.application_command_journal (
  owner_id          uuid not null references auth.users(id) on delete cascade,
  command_id        text not null,
  fingerprint       text not null,
  kind              text not null,
  target_id         uuid,
  expected_revision timestamptz,
  phase             text not null default 'claimed'
                      check (phase in ('claimed', 'finalized', 'reconcile')),
  status            text not null default 'claimed'
                      check (status in (
                        'claimed',
                        'applied',
                        'stale',
                        'failed',
                        'reconcile-required'
                      )),
  receipt           jsonb,
  failure_code      text,
  claimed_at        timestamptz not null default now(),
  finalized_at      timestamptz,
  updated_at        timestamptz not null default now(),
  primary key (owner_id, command_id),
  constraint application_command_id_bounded
    check (char_length(command_id) between 1 and 240),
  constraint application_command_fingerprint_sha256
    check (fingerprint ~ '^[0-9a-f]{64}$'),
  constraint application_command_kind_bounded
    check (
      char_length(kind) between 1 and 160
      and kind ~ '^[a-z][a-z0-9.-]*$'
    ),
  constraint application_command_receipt_object
    check (receipt is null or jsonb_typeof(receipt) = 'object')
);

create index if not exists application_command_journal_target_idx
  on public.application_command_journal(owner_id, target_id, updated_at desc);

alter table public.application_command_journal enable row level security;

drop policy if exists "Owners read own application commands"
  on public.application_command_journal;
create policy "Owners read own application commands"
  on public.application_command_journal
  for select
  using (auth.uid() = owner_id);

revoke all on table public.application_command_journal
  from public, anon, authenticated;
grant select on table public.application_command_journal to authenticated;
grant select, insert, update, delete
  on table public.application_command_journal to service_role;

comment on table public.application_command_journal is
  'Owner-scoped durable idempotency and reconciliation state for application commands. Mutation is RPC-only; this is not a transport outbox.';

-- Claim one owner+command identity. The primary key serializes concurrent
-- duplicates; SELECT FOR UPDATE makes an existing fingerprint/status stable for
-- the rest of the caller's transaction.
create or replace function public.claim_application_command(
  p_owner_id uuid,
  p_command_id text,
  p_fingerprint text,
  p_kind text,
  p_target_id uuid default null,
  p_expected_revision timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_inserted integer := 0;
  v_row public.application_command_journal%rowtype;
begin
  if p_owner_id is null
    or nullif(btrim(p_command_id), '') is null
    or p_command_id !~ '^.{1,240}$'
    or p_fingerprint !~ '^[0-9a-f]{64}$'
    or p_kind !~ '^[a-z][a-z0-9.-]{0,159}$'
  then
    raise exception 'invalid application command claim'
      using errcode = '22023';
  end if;

  insert into public.application_command_journal (
    owner_id,
    command_id,
    fingerprint,
    kind,
    target_id,
    expected_revision
  ) values (
    p_owner_id,
    p_command_id,
    p_fingerprint,
    p_kind,
    p_target_id,
    p_expected_revision
  )
  on conflict (owner_id, command_id) do nothing;
  get diagnostics v_inserted = row_count;

  select * into strict v_row
    from public.application_command_journal
   where owner_id = p_owner_id
     and command_id = p_command_id
   for update;

  if v_row.fingerprint <> p_fingerprint then
    return jsonb_build_object(
      'status', 'conflict',
      'reason', 'command_id_conflict',
      'replayed', true,
      'fingerprint', v_row.fingerprint
    );
  end if;

  return jsonb_build_object(
    'status', v_row.status,
    'phase', v_row.phase,
    'replayed', v_inserted = 0,
    'fingerprint', v_row.fingerprint,
    'receipt', v_row.receipt,
    'reason', v_row.failure_code
  );
end;
$$;

-- Finalize only a matching claimed identity. A repeated identical finalize is
-- harmless; a conflicting fingerprint can never rewrite the original receipt.
create or replace function public.finalize_application_command(
  p_owner_id uuid,
  p_command_id text,
  p_fingerprint text,
  p_status text,
  p_receipt jsonb default null,
  p_failure_code text default null
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_updated integer;
begin
  if p_status not in ('applied', 'stale', 'failed') then
    raise exception 'invalid final application command status'
      using errcode = '22023';
  end if;

  update public.application_command_journal
     set phase = 'finalized',
         status = p_status,
         receipt = p_receipt,
         failure_code = p_failure_code,
         finalized_at = coalesce(finalized_at, now()),
         updated_at = now()
   where owner_id = p_owner_id
     and command_id = p_command_id
     and fingerprint = p_fingerprint
     and (
       status = 'claimed'
       or (
         phase = 'finalized'
         and status = p_status
         and receipt is not distinct from p_receipt
       )
     );
  get diagnostics v_updated = row_count;
  return v_updated = 1;
end;
$$;

-- Reconciliation is monotone: it may classify a claimed/ambiguous command, but
-- never downgrade a known applied/stale/failed outcome.
create or replace function public.mark_application_command_reconcile(
  p_owner_id uuid,
  p_command_id text,
  p_fingerprint text,
  p_reason text default 'ambiguous_result'
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_updated integer;
begin
  update public.application_command_journal
     set phase = 'reconcile',
         status = 'reconcile-required',
         failure_code = coalesce(nullif(btrim(p_reason), ''), 'ambiguous_result'),
         updated_at = now()
   where owner_id = p_owner_id
     and command_id = p_command_id
     and fingerprint = p_fingerprint
     and status in ('claimed', 'reconcile-required');
  get diagnostics v_updated = row_count;
  return v_updated = 1;
end;
$$;

revoke all on function public.claim_application_command(
  uuid, text, text, text, uuid, timestamptz
) from public, anon, authenticated;
revoke all on function public.finalize_application_command(
  uuid, text, text, text, jsonb, text
) from public, anon, authenticated;
revoke all on function public.mark_application_command_reconcile(
  uuid, text, text, text
) from public, anon, authenticated;
grant execute on function public.claim_application_command(
  uuid, text, text, text, uuid, timestamptz
) to service_role;
grant execute on function public.finalize_application_command(
  uuid, text, text, text, jsonb, text
) to service_role;
grant execute on function public.mark_application_command_reconcile(
  uuid, text, text, text
) to service_role;

create or replace function public.apply_cut_trade_route_command(
  p_expected_owner uuid,
  p_command_id text,
  p_save_id uuid,
  p_expected_revision timestamptz,
  p_event jsonb,
  p_expected_data jsonb,
  p_expected_campaign_state jsonb,
  p_expected_ai_data jsonb,
  p_next_data jsonb,
  p_next_campaign_state jsonb,
  p_next_ai_data jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_fingerprint text;
  v_claim jsonb;
  v_row public.settlements%rowtype;
  v_receipt jsonb;
  v_reason text;
  v_expected_log_length integer;
  v_next_log_length integer;
  v_expected_route_length integer;
  v_next_route_length integer;
  v_last_log_entry jsonb;
  v_last_route jsonb;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if p_expected_owner is null or p_expected_owner <> v_uid then
    raise exception 'application command owner changed'
      using errcode = '42501';
  end if;
  if not public.account_is_active(v_uid) then
    raise exception 'account is not active'
      using errcode = '42501';
  end if;
  if p_save_id is null or p_expected_revision is null then
    raise exception 'save id and expected revision are required'
      using errcode = '22023';
  end if;
  if jsonb_typeof(p_event) <> 'object'
    or p_event ->> 'type' <> 'CUT_TRADE_ROUTE'
    or nullif(btrim(p_event ->> 'id'), '') is null
  then
    raise exception 'only CUT_TRADE_ROUTE is server-authoritative in this RPC'
      using errcode = '22023';
  end if;
  if jsonb_typeof(p_expected_data) <> 'object'
    or jsonb_typeof(p_expected_campaign_state) <> 'object'
    or jsonb_typeof(p_next_data) <> 'object'
    or jsonb_typeof(p_next_campaign_state) <> 'object'
    or coalesce(p_next_campaign_state ->> 'phase', '') <> 'canon'
  then
    raise exception 'prepared canon-event projection is invalid'
      using errcode = '22023';
  end if;
  if jsonb_typeof(p_expected_campaign_state -> 'eventLog') is distinct from 'array'
    or jsonb_typeof(p_next_campaign_state -> 'eventLog') is distinct from 'array'
  then
    raise exception 'canon-event log projections must be arrays'
      using errcode = '22023';
  end if;
  if p_next_ai_data is not null and jsonb_typeof(p_next_ai_data) <> 'object' then
    raise exception 'p_next_ai_data must be an object or null'
      using errcode = '22023';
  end if;

  -- Constrain the client-prepared projection before accepting it. The server
  -- proves the prior log/route prefixes are intact, one matching entry is
  -- appended to each, and fields outside CUT_TRADE_ROUTE's known mutation
  -- surface are unchanged. It deliberately does NOT claim to recompute or
  -- semantically prove the contents of allowed fields (active conditions,
  -- reconciliation, derived SystemState, and optional narrative snapshot).
  -- The receipt names that boundary so an audit cannot mistake this transitional
  -- client-prepared envelope for future server-side event preparation.
  if (
    p_next_data
      - 'config'
      - '_config'
      - 'activeConditions'
      - 'reconciliationLog'
  ) is distinct from (
    p_expected_data
      - 'config'
      - '_config'
      - 'activeConditions'
      - 'reconciliationLog'
  ) then
    raise exception 'CUT_TRADE_ROUTE changed an unrelated settlement field'
      using errcode = '22023';
  end if;
  if (
    coalesce(p_next_data -> 'config', '{}'::jsonb)
      - '_cutRoutes'
      - 'eventConditions'
  ) is distinct from (
    coalesce(p_expected_data -> 'config', '{}'::jsonb)
      - '_cutRoutes'
      - 'eventConditions'
  ) then
    raise exception 'CUT_TRADE_ROUTE changed an unrelated config field'
      using errcode = '22023';
  end if;
  if (
    coalesce(p_next_data -> '_config', '{}'::jsonb)
      - '_cutRoutes'
      - 'eventConditions'
  ) is distinct from (
    coalesce(p_expected_data -> '_config', '{}'::jsonb)
      - '_cutRoutes'
      - 'eventConditions'
  ) then
    raise exception 'CUT_TRADE_ROUTE changed an unrelated raw-config field'
      using errcode = '22023';
  end if;
  if (
    p_next_campaign_state
      - 'eventLog'
      - 'systemState'
      - 'editedAt'
      - 'narrativeDrift'
      - 'exportState'
  ) is distinct from (
    p_expected_campaign_state
      - 'eventLog'
      - 'systemState'
      - 'editedAt'
      - 'narrativeDrift'
      - 'exportState'
  ) then
    raise exception 'CUT_TRADE_ROUTE changed an unrelated campaign-state field'
      using errcode = '22023';
  end if;

  v_expected_log_length := jsonb_array_length(
    p_expected_campaign_state -> 'eventLog'
  );
  v_next_log_length := jsonb_array_length(p_next_campaign_state -> 'eventLog');
  if v_next_log_length <> v_expected_log_length + 1 then
    raise exception 'CUT_TRADE_ROUTE must append exactly one event-log entry'
      using errcode = '22023';
  end if;
  if (
    (p_next_campaign_state -> 'eventLog') - v_expected_log_length
  ) is distinct from (
    p_expected_campaign_state -> 'eventLog'
  ) then
    raise exception 'CUT_TRADE_ROUTE must preserve the existing event-log prefix'
      using errcode = '22023';
  end if;
  v_last_log_entry := p_next_campaign_state
    -> 'eventLog'
    -> v_expected_log_length;
  if v_last_log_entry #>> '{event,type}' is distinct from 'CUT_TRADE_ROUTE'
    or v_last_log_entry #>> '{event,id}' is distinct from p_event ->> 'id'
  then
    raise exception 'event-log append does not match the command event'
      using errcode = '22023';
  end if;

  if p_expected_data #> '{config,_cutRoutes}' is null then
    v_expected_route_length := 0;
  elsif jsonb_typeof(p_expected_data #> '{config,_cutRoutes}') = 'array' then
    v_expected_route_length := jsonb_array_length(
      p_expected_data #> '{config,_cutRoutes}'
    );
  else
    raise exception 'base _cutRoutes must be an array when present'
      using errcode = '22023';
  end if;
  if jsonb_typeof(p_next_data #> '{config,_cutRoutes}') is distinct from 'array' then
    raise exception 'CUT_TRADE_ROUTE must append a route annotation'
      using errcode = '22023';
  end if;
  v_next_route_length := jsonb_array_length(
    p_next_data #> '{config,_cutRoutes}'
  );
  if v_next_route_length <> v_expected_route_length + 1 then
    raise exception 'CUT_TRADE_ROUTE must append exactly one route annotation'
      using errcode = '22023';
  end if;
  if (
    (p_next_data #> '{config,_cutRoutes}') - v_expected_route_length
  ) is distinct from coalesce(
    p_expected_data #> '{config,_cutRoutes}',
    '[]'::jsonb
  ) then
    raise exception 'CUT_TRADE_ROUTE must preserve existing route annotations'
      using errcode = '22023';
  end if;
  v_last_route := p_next_data
    #> '{config,_cutRoutes}'
    -> v_expected_route_length;
  if v_last_route ->> 'atEventId' is distinct from p_event ->> 'id'
    or v_last_route ->> 'name'
      is distinct from coalesce(nullif(p_event ->> 'targetId', ''), 'primary')
  then
    raise exception 'route annotation does not match the command event'
      using errcode = '22023';
  end if;

  -- The server fingerprints every mutation-bearing input. No raw settlement,
  -- event prose, or campaign JSON is retained in the journal.
  v_fingerprint := encode(sha256(convert_to(
    jsonb_build_object(
      'kind', 'settlement.canon-event.apply',
      'saveId', p_save_id,
      'expectedRevision', p_expected_revision,
      'event', p_event,
      'expectedData', p_expected_data,
      'expectedCampaignState', p_expected_campaign_state,
      'expectedAiData', p_expected_ai_data,
      'nextData', p_next_data,
      'nextCampaignState', p_next_campaign_state,
      'nextAiData', p_next_ai_data
    )::text,
    'UTF8'
  )), 'hex');

  v_claim := public.claim_application_command(
    v_uid,
    p_command_id,
    v_fingerprint,
    'settlement.canon-event.apply',
    p_save_id,
    p_expected_revision
  );

  if v_claim ->> 'status' = 'conflict' then
    return v_claim;
  end if;

  -- A completed duplicate returns the authoritative current row. The receipt is
  -- historical identity; the projection may include legitimate later commands.
  if coalesce((v_claim ->> 'replayed')::boolean, false)
    and v_claim ->> 'status' <> 'claimed'
  then
    select * into v_row
      from public.settlements
     where id = p_save_id
       and user_id = v_uid;
    return jsonb_build_object(
      'status', v_claim ->> 'status',
      'reason', v_claim ->> 'reason',
      'replayed', true,
      'fingerprint', v_fingerprint,
      'revisionKind', 'base-projection-v1',
      'receipt', v_claim -> 'receipt',
      'settlement', v_row.data,
      'campaignState', v_row.campaign_state,
      'aiData', v_row.ai_data,
      'updatedAt', v_row.updated_at
    );
  end if;

  -- A separately committed claim has no safe automatic interpretation. The
  -- command-specific path normally claims and applies in this same transaction,
  -- so this state means an operator/service workflow intervened.
  if coalesce((v_claim ->> 'replayed')::boolean, false)
    and v_claim ->> 'status' = 'claimed'
  then
    perform public.mark_application_command_reconcile(
      v_uid,
      p_command_id,
      v_fingerprint,
      'abandoned_claim'
    );
    return jsonb_build_object(
      'status', 'reconcile-required',
      'reason', 'abandoned_claim',
      'replayed', true,
      'fingerprint', v_fingerprint,
      'revisionKind', 'base-projection-v1'
    );
  end if;

  -- The row comparison and replacement are one statement. JSONB equality is
  -- structural (object-key order is irrelevant). ai_data participates only
  -- when this command will replace it with a narrative-history snapshot; an
  -- unrelated AI write otherwise remains independent.
  update public.settlements
     set data = p_next_data,
         campaign_state = p_next_campaign_state,
         ai_data = case
           when p_next_ai_data is null then ai_data
           else p_next_ai_data
         end,
         neighbour_links = p_next_data -> 'neighbourNetwork',
         updated_at = clock_timestamp()
   where id = p_save_id
     and user_id = v_uid
     and access_state = 'active'
     and data = p_expected_data
     and campaign_state is not distinct from p_expected_campaign_state
     and (
       p_next_ai_data is null
       or ai_data is not distinct from p_expected_ai_data
     )
   returning * into v_row;

  if not found then
    if exists (
      select 1
        from public.settlements
       where id = p_save_id
         and user_id = v_uid
         and access_state = 'active'
    ) then
      v_reason := 'base_projection_changed';
    else
      v_reason := 'save_unavailable';
    end if;
    v_receipt := jsonb_build_object(
      'saveId', p_save_id,
      'eventType', 'CUT_TRADE_ROUTE',
      'reason', v_reason
    );
    perform public.finalize_application_command(
      v_uid,
      p_command_id,
      v_fingerprint,
      'stale',
      v_receipt,
      v_reason
    );
    return jsonb_build_object(
      'status', 'stale',
      'reason', v_reason,
      'replayed', false,
      'fingerprint', v_fingerprint,
      'revisionKind', 'base-projection-v1',
      'receipt', v_receipt
    );
  end if;

  v_receipt := jsonb_build_object(
    'saveId', p_save_id,
    'eventId', coalesce(p_event ->> 'id', p_command_id),
    'eventType', 'CUT_TRADE_ROUTE',
    'projectionValidation', 'client-prepared-constrained-envelope-v1',
    'revisionKind', 'base-projection-v1',
    'updatedAt', v_row.updated_at
  );
  if not public.finalize_application_command(
    v_uid,
    p_command_id,
    v_fingerprint,
    'applied',
    v_receipt,
    null
  ) then
    raise exception 'application command finalization failed'
      using errcode = '40001';
  end if;

  return jsonb_build_object(
    'status', 'applied',
    'replayed', false,
    'fingerprint', v_fingerprint,
    'revisionKind', 'base-projection-v1',
    'receipt', v_receipt,
    'settlement', v_row.data,
    'campaignState', v_row.campaign_state,
    'aiData', v_row.ai_data,
    'updatedAt', v_row.updated_at
  );
end;
$$;

revoke all on function public.apply_cut_trade_route_command(
  uuid, text, uuid, timestamptz, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb
) from public, anon;
grant execute on function public.apply_cut_trade_route_command(
  uuid, text, uuid, timestamptz, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb
) to authenticated;
