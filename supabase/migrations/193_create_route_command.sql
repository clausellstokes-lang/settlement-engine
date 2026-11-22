-- ────────────────────────────────────────────────────────────────────────────
-- 193_create_route_command.sql — the BILATERAL application-command vertical.
--
-- WHY
--   Migration 183 made one canon event server-authoritative, but its RPC is
--   structurally unilateral: it claims a journal identity, compare-and-swaps a
--   single settlements row, and finalizes. A user route is not a property of one
--   settlement. It is an edge, and an edge that exists on only one of its two
--   endpoints is not a weaker route — it is a corrupt world. Splitting the two
--   endpoint writes across two requests (or two calls of the 183 RPC) leaves a
--   window in which exactly that half-edge is durable. This migration closes the
--   window by putting BOTH endpoint compare-and-swaps, the journal claim, and the
--   final receipt in ONE PostgreSQL transaction.
--
-- WHY NOT 183's RPC
--   apply_cut_trade_route_command hard-guards `p_event ->> 'type' <> 'CUT_TRADE_ROUTE'`,
--   accepts exactly one save id, and validates a config envelope naming _cutRoutes.
--   Its generic collaborators (claim/finalize/reconcile) are service-role only, so
--   no client-callable composition of them exists. The bilateral vertical therefore
--   needs its own authenticated-only SECURITY DEFINER entry point; it REUSES the
--   183 journal, its identity semantics, and its receipt discipline unchanged.
--
-- BILATERAL ATOMICITY
--   Both endpoint rows are locked FOR UPDATE in a deterministic id order before
--   ANY write, and both base projections are compared under those locks. A partner
--   mismatch therefore finalizes a `stale` receipt with NEITHER row written — the
--   caller learns the exact reason instead of catching an exception, and the
--   half-edge state is unreachable rather than merely unlikely. The deterministic
--   lock order is what keeps two concurrent routes over the same pair of
--   settlements from deadlocking.
--
-- REVISION AUTHORITY
--   `base-projection-v1`, exactly as 183 defines it: JSONB equality of the exact
--   reviewed base is the row-lock predicate; expected_revision remains review
--   provenance and command identity. The PARTNER row is compared on `data` alone,
--   because `data` is the only partner field this command changes. Demanding the
--   partner's campaign_state or ai_data also match would manufacture conflicts out
--   of that settlement's own unrelated timeline, which this command neither reads
--   nor writes.
--
-- EDGE IDENTITY IS SERVER-PROVEN, NOT CLIENT-TRUSTED
--   docs/DESIGN_ROUTE_LIFECYCLE.md section 3 fixes the edge id at
--   `route.<a>.<b>.<mode>` with the endpoints in codepoint order. The server
--   RECOMPUTES that id from the two save ids and refuses any command whose event
--   payload, neighbour entries, or provenance rows disagree with it. Ordering
--   compares UTF-8 bytea rather than text so the result is codepoint order and not
--   whatever collation the database happens to carry.
--
-- THE PUBLIC SHAPE IS UNTOUCHED
--   The appended neighbourNetwork entry uses only the key vocabulary its siblings
--   already use; its `linkId` carries the `route.` namespaced edge id. Route
--   provenance (provenance, mode, createdTick, path cost) lives on the private
--   side in config._userRoutes, mirroring _cutRoutes. No projection, sanitizer, or
--   anonymous dossier gains a key because a user route exists.
--
-- SECURITY
--   • Authenticated-only SECURITY DEFINER; the generic journal lifecycle functions
--     stay service-role only (183's law, unchanged).
--   • auth.uid, expected owner, active account, and ownership of BOTH saves are
--     rechecked here; a partner save owned by anyone else is not a partial apply,
--     it is a refusal.
--   • search_path pinned to public, pg_temp (the 094/111/131 hardening program).
--
-- @rollback:
--   drop function if exists public.apply_create_route_command(uuid, text, uuid, uuid, timestamptz, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb);
--   drop function if exists public.assert_create_route_half(jsonb, jsonb, text, text, text, text);
--   drop function if exists public.create_route_envelope_violation(jsonb, jsonb);
-- ────────────────────────────────────────────────────────────────────────────

-- The mutation surface, named once so both endpoints are judged by the same rule.
-- Outside `neighbourNetwork` and the two config twins nothing may move; inside the
-- config twins only _userRoutes (this command's provenance home) and eventConditions
-- (the shared condition-sync surface every canon event owns) may move. A raw
-- _config twin may not APPEAR or VANISH either: its presence is a property of how
-- the settlement was generated, not something a route may decide.
create or replace function public.create_route_envelope_violation(
  p_expected jsonb,
  p_next jsonb
)
returns boolean
language sql
immutable
set search_path = public, pg_temp
as $$
  select
    (
      p_next
        - 'config' - '_config' - 'activeConditions'
        - 'reconciliationLog' - 'neighbourNetwork'
    ) is distinct from (
      p_expected
        - 'config' - '_config' - 'activeConditions'
        - 'reconciliationLog' - 'neighbourNetwork'
    )
    or jsonb_exists(p_next, '_config') is distinct from
       jsonb_exists(p_expected, '_config')
    or (
      coalesce(p_next -> 'config', '{}'::jsonb)
        - '_userRoutes' - 'eventConditions'
    ) is distinct from (
      coalesce(p_expected -> 'config', '{}'::jsonb)
        - '_userRoutes' - 'eventConditions'
    )
    or (
      coalesce(p_next -> '_config', '{}'::jsonb)
        - '_userRoutes' - 'eventConditions'
    ) is distinct from (
      coalesce(p_expected -> '_config', '{}'::jsonb)
        - '_userRoutes' - 'eventConditions'
    )
$$;

-- One endpoint's half of the edge. Both halves are judged against the SAME
-- recomputed edge id, so a command cannot write two rows that disagree about which
-- route they are on: the neighbour entry must point at the other endpoint and carry
-- the route's link id, and every config twin present must gain exactly one
-- provenance row naming this route, this event, and the user.
create or replace function public.assert_create_route_half(
  p_expected jsonb,
  p_next jsonb,
  p_edge_id text,
  p_other_id text,
  p_event_id text,
  p_side text
)
returns void
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_expected_length integer;
  v_next_length integer;
  v_entry jsonb;
  v_key text;
  v_expected_routes jsonb;
  v_next_routes jsonb;
  v_route jsonb;
begin
  if p_expected -> 'neighbourNetwork' is null then
    v_expected_length := 0;
  elsif jsonb_typeof(p_expected -> 'neighbourNetwork') = 'array' then
    v_expected_length := jsonb_array_length(p_expected -> 'neighbourNetwork');
  else
    raise exception 'base neighbourNetwork must be an array when present (%)', p_side
      using errcode = '22023';
  end if;
  if jsonb_typeof(p_next -> 'neighbourNetwork') is distinct from 'array' then
    raise exception 'CREATE_ROUTE must append a neighbour entry (%)', p_side
      using errcode = '22023';
  end if;
  v_next_length := jsonb_array_length(p_next -> 'neighbourNetwork');
  if v_next_length <> v_expected_length + 1 then
    raise exception 'CREATE_ROUTE must append exactly one neighbour entry (%)', p_side
      using errcode = '22023';
  end if;
  if (
    (p_next -> 'neighbourNetwork') - v_expected_length
  ) is distinct from coalesce(
    p_expected -> 'neighbourNetwork',
    '[]'::jsonb
  ) then
    raise exception 'CREATE_ROUTE must preserve the existing neighbour entries (%)', p_side
      using errcode = '22023';
  end if;
  v_entry := p_next -> 'neighbourNetwork' -> v_expected_length;
  if v_entry ->> 'linkId' is distinct from p_edge_id
    or v_entry ->> 'id' is distinct from p_other_id
  then
    raise exception 'the appended neighbour entry is not this route (%)', p_side
      using errcode = '22023';
  end if;

  foreach v_key in array array['config', '_config'] loop
    if not jsonb_exists(p_next, v_key) then
      continue;
    end if;
    v_expected_routes := coalesce(p_expected, '{}'::jsonb) #> array[v_key, '_userRoutes'];
    if v_expected_routes is null then
      v_expected_length := 0;
    elsif jsonb_typeof(v_expected_routes) = 'array' then
      v_expected_length := jsonb_array_length(v_expected_routes);
    else
      raise exception 'base %._userRoutes must be an array when present (%)', v_key, p_side
        using errcode = '22023';
    end if;
    v_next_routes := p_next #> array[v_key, '_userRoutes'];
    if jsonb_typeof(v_next_routes) is distinct from 'array' then
      raise exception 'CREATE_ROUTE must append a %._userRoutes row (%)', v_key, p_side
        using errcode = '22023';
    end if;
    if jsonb_array_length(v_next_routes) <> v_expected_length + 1 then
      raise exception 'CREATE_ROUTE must append exactly one %._userRoutes row (%)', v_key, p_side
        using errcode = '22023';
    end if;
    if (v_next_routes - v_expected_length)
      is distinct from coalesce(v_expected_routes, '[]'::jsonb)
    then
      raise exception 'CREATE_ROUTE must preserve existing %._userRoutes rows (%)', v_key, p_side
        using errcode = '22023';
    end if;
    v_route := v_next_routes -> v_expected_length;
    if v_route ->> 'routeId' is distinct from p_edge_id
      or v_route ->> 'atEventId' is distinct from p_event_id
      or v_route ->> 'provenance' is distinct from 'user'
    then
      raise exception 'the appended %._userRoutes row is not this user route (%)', v_key, p_side
        using errcode = '22023';
    end if;
  end loop;
end;
$$;

revoke all on function public.create_route_envelope_violation(jsonb, jsonb)
  from public, anon, authenticated;
revoke all on function public.assert_create_route_half(
  jsonb, jsonb, text, text, text, text
) from public, anon, authenticated;

create or replace function public.apply_create_route_command(
  p_expected_owner uuid,
  p_command_id text,
  p_save_id uuid,
  p_partner_save_id uuid,
  p_expected_revision timestamptz,
  p_event jsonb,
  p_expected_data jsonb,
  p_expected_campaign_state jsonb,
  p_expected_ai_data jsonb,
  p_partner_expected_data jsonb,
  p_next_data jsonb,
  p_next_campaign_state jsonb,
  p_partner_next_data jsonb,
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
  v_partner_row public.settlements%rowtype;
  v_receipt jsonb;
  v_reason text;
  v_mode text;
  v_low text;
  v_high text;
  v_edge_id text;
  v_expected_log_length integer;
  v_next_log_length integer;
  v_last_log_entry jsonb;
  v_locked_data jsonb;
  v_partner_locked_data jsonb;
  v_first uuid;
  v_second uuid;
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
  if p_save_id is null
    or p_partner_save_id is null
    or p_expected_revision is null
  then
    raise exception 'both save ids and the expected revision are required'
      using errcode = '22023';
  end if;
  if p_save_id = p_partner_save_id then
    raise exception 'a route needs two distinct settlements'
      using errcode = '22023';
  end if;
  if jsonb_typeof(p_event) <> 'object'
    or p_event ->> 'type' <> 'CREATE_ROUTE'
    or nullif(btrim(p_event ->> 'id'), '') is null
  then
    raise exception 'only CREATE_ROUTE is server-authoritative in this RPC'
      using errcode = '22023';
  end if;
  v_mode := p_event #>> '{payload,mode}';
  if v_mode is null or v_mode not in ('land', 'water') then
    raise exception 'CREATE_ROUTE requires a land or water mode'
      using errcode = '22023';
  end if;
  if jsonb_typeof(p_expected_data) <> 'object'
    or jsonb_typeof(p_expected_campaign_state) <> 'object'
    or jsonb_typeof(p_partner_expected_data) <> 'object'
    or jsonb_typeof(p_next_data) <> 'object'
    or jsonb_typeof(p_next_campaign_state) <> 'object'
    or jsonb_typeof(p_partner_next_data) <> 'object'
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

  -- The deterministic edge identity (DESIGN_ROUTE_LIFECYCLE section 3). bytea
  -- comparison is UTF-8 byte order, which is codepoint order, and is immune to
  -- the database collation the text operators would otherwise consult.
  if convert_to(p_save_id::text, 'UTF8')
     <= convert_to(p_partner_save_id::text, 'UTF8')
  then
    v_low := p_save_id::text;
    v_high := p_partner_save_id::text;
  else
    v_low := p_partner_save_id::text;
    v_high := p_save_id::text;
  end if;
  v_edge_id := 'route.' || v_low || '.' || v_high || '.' || v_mode;
  if p_event #>> '{payload,routeId}' is distinct from v_edge_id then
    raise exception 'CREATE_ROUTE route id is not the deterministic edge identity'
      using errcode = '22023';
  end if;

  -- Envelope: outside the named surface, both rows must be byte-equal to the
  -- reviewed base. As in 183 this constrains the client-prepared projection; it
  -- does not claim to recompute the contents of the fields it does allow.
  if public.create_route_envelope_violation(p_expected_data, p_next_data) then
    raise exception 'CREATE_ROUTE changed a field outside its mutation surface'
      using errcode = '22023';
  end if;
  if public.create_route_envelope_violation(
    p_partner_expected_data,
    p_partner_next_data
  ) then
    raise exception 'CREATE_ROUTE changed a partner field outside its mutation surface'
      using errcode = '22023';
  end if;

  -- The initiating row owns the event-log append; the partner keeps its own
  -- timeline. Exactly one entry, the prior prefix intact, and it must be THIS
  -- command's event.
  v_expected_log_length := jsonb_array_length(
    p_expected_campaign_state -> 'eventLog'
  );
  v_next_log_length := jsonb_array_length(p_next_campaign_state -> 'eventLog');
  if v_next_log_length <> v_expected_log_length + 1 then
    raise exception 'CREATE_ROUTE must append exactly one event-log entry'
      using errcode = '22023';
  end if;
  if (
    (p_next_campaign_state -> 'eventLog') - v_expected_log_length
  ) is distinct from (
    p_expected_campaign_state -> 'eventLog'
  ) then
    raise exception 'CREATE_ROUTE must preserve the existing event-log prefix'
      using errcode = '22023';
  end if;
  v_last_log_entry := p_next_campaign_state
    -> 'eventLog'
    -> v_expected_log_length;
  if v_last_log_entry #>> '{event,type}' is distinct from 'CREATE_ROUTE'
    or v_last_log_entry #>> '{event,id}' is distinct from p_event ->> 'id'
  then
    raise exception 'event-log append does not match the command event'
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
    raise exception 'CREATE_ROUTE changed an unrelated campaign-state field'
      using errcode = '22023';
  end if;

  -- Both halves of the edge, proven against the same recomputed identity. The
  -- neighbour entry points AT the other endpoint; the provenance row names the
  -- route. Either half missing is a refusal, which is what makes a half-edge
  -- unrepresentable rather than merely unlikely.
  perform public.assert_create_route_half(
    p_expected_data,
    p_next_data,
    v_edge_id,
    p_partner_save_id::text,
    p_event ->> 'id',
    'settlement'
  );
  perform public.assert_create_route_half(
    p_partner_expected_data,
    p_partner_next_data,
    v_edge_id,
    p_save_id::text,
    p_event ->> 'id',
    'partner'
  );

  -- The server fingerprints every mutation-bearing input. No raw settlement,
  -- event prose, or campaign JSON is retained in the journal.
  v_fingerprint := encode(sha256(convert_to(
    jsonb_build_object(
      'kind', 'settlement.canon-event.apply',
      'saveId', p_save_id,
      'partnerSaveId', p_partner_save_id,
      'expectedRevision', p_expected_revision,
      'event', p_event,
      'expectedData', p_expected_data,
      'expectedCampaignState', p_expected_campaign_state,
      'expectedAiData', p_expected_ai_data,
      'partnerExpectedData', p_partner_expected_data,
      'nextData', p_next_data,
      'nextCampaignState', p_next_campaign_state,
      'partnerNextData', p_partner_next_data,
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

  -- A completed duplicate returns the authoritative current rows. The receipt is
  -- historical identity; the projection may include legitimate later commands.
  if coalesce((v_claim ->> 'replayed')::boolean, false)
    and v_claim ->> 'status' <> 'claimed'
  then
    select * into v_row
      from public.settlements
     where id = p_save_id
       and user_id = v_uid;
    select * into v_partner_row
      from public.settlements
     where id = p_partner_save_id
       and user_id = v_uid;
    return jsonb_build_object(
      'status', v_claim ->> 'status',
      'reason', v_claim ->> 'reason',
      'replayed', true,
      'fingerprint', v_fingerprint,
      'routeId', v_edge_id,
      'revisionKind', 'base-projection-v1',
      'receipt', v_claim -> 'receipt',
      'settlement', v_row.data,
      'campaignState', v_row.campaign_state,
      'aiData', v_row.ai_data,
      'partnerSettlement', v_partner_row.data,
      'updatedAt', v_row.updated_at
    );
  end if;

  -- A separately committed claim has no safe automatic interpretation (183's
  -- rationale, unchanged): this path claims and applies in one transaction, so
  -- an orphan claim means an operator or service workflow intervened.
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
      'routeId', v_edge_id,
      'revisionKind', 'base-projection-v1'
    );
  end if;

  -- Lock BOTH endpoints before comparing or writing either. The id order is what
  -- makes two concurrent routes over the same pair serialize instead of deadlock.
  if p_save_id < p_partner_save_id then
    v_first := p_save_id;
    v_second := p_partner_save_id;
  else
    v_first := p_partner_save_id;
    v_second := p_save_id;
  end if;
  perform 1
    from public.settlements
   where id = v_first
     and user_id = v_uid
     and access_state = 'active'
     for update;
  perform 1
    from public.settlements
   where id = v_second
     and user_id = v_uid
     and access_state = 'active'
     for update;

  select data into v_locked_data
    from public.settlements
   where id = p_save_id
     and user_id = v_uid
     and access_state = 'active';
  select data into v_partner_locked_data
    from public.settlements
   where id = p_partner_save_id
     and user_id = v_uid
     and access_state = 'active';

  if v_locked_data is null or v_partner_locked_data is null then
    v_reason := 'save_unavailable';
  elsif v_locked_data is distinct from p_expected_data then
    v_reason := 'base_projection_changed';
  elsif v_partner_locked_data is distinct from p_partner_expected_data then
    v_reason := 'partner_base_projection_changed';
  elsif not exists (
    select 1
      from public.settlements
     where id = p_save_id
       and user_id = v_uid
       and access_state = 'active'
       and campaign_state is not distinct from p_expected_campaign_state
       and (
         p_next_ai_data is null
         or ai_data is not distinct from p_expected_ai_data
       )
  ) then
    v_reason := 'base_projection_changed';
  else
    v_reason := null;
  end if;

  if v_reason is not null then
    v_receipt := jsonb_build_object(
      'saveId', p_save_id,
      'partnerSaveId', p_partner_save_id,
      'routeId', v_edge_id,
      'eventType', 'CREATE_ROUTE',
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
      'routeId', v_edge_id,
      'revisionKind', 'base-projection-v1',
      'receipt', v_receipt
    );
  end if;

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
   returning * into v_row;
  if not found then
    raise exception 'the initiating route endpoint changed under its own lock'
      using errcode = '40001';
  end if;

  update public.settlements
     set data = p_partner_next_data,
         neighbour_links = p_partner_next_data -> 'neighbourNetwork',
         updated_at = clock_timestamp()
   where id = p_partner_save_id
     and user_id = v_uid
     and access_state = 'active'
     and data = p_partner_expected_data
   returning * into v_partner_row;
  if not found then
    raise exception 'the partner route endpoint changed under its own lock'
      using errcode = '40001';
  end if;

  v_receipt := jsonb_build_object(
    'saveId', p_save_id,
    'partnerSaveId', p_partner_save_id,
    'routeId', v_edge_id,
    'eventId', coalesce(p_event ->> 'id', p_command_id),
    'eventType', 'CREATE_ROUTE',
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
    'routeId', v_edge_id,
    'revisionKind', 'base-projection-v1',
    'receipt', v_receipt,
    'settlement', v_row.data,
    'campaignState', v_row.campaign_state,
    'aiData', v_row.ai_data,
    'partnerSettlement', v_partner_row.data,
    'updatedAt', v_row.updated_at
  );
end;
$$;

revoke all on function public.apply_create_route_command(
  uuid, text, uuid, uuid, timestamptz,
  jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb
) from public, anon;
grant execute on function public.apply_create_route_command(
  uuid, text, uuid, uuid, timestamptz,
  jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb
) to authenticated;

comment on function public.apply_create_route_command(
  uuid, text, uuid, uuid, timestamptz,
  jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb
) is
  'One-transaction bilateral user-route command: journal claim, both endpoint base-projection compare-and-swaps under a deterministic lock order, both neighbour_links mirrors, and the final receipt. A half-edge is unrepresentable.';
