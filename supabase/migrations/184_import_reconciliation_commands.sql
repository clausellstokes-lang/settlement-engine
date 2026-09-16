-- ────────────────────────────────────────────────────────────────────────────
-- 184_import_reconciliation_commands.sql — atomic existing-campaign import
-- commands, exclusive campaign membership, and command-health visibility.
--
-- WHY
--   A structured import may create a settlement and attach it to a campaign, or
--   attach an existing settlement. Persisting those halves separately can leave
--   an orphan save, a missing membership, or duplicate campaign membership
--   after a lost response. This RPC claims durable command identity and performs
--   the complete mutation in the same PostgreSQL transaction.
--
-- MEMBERSHIP LAW
--   SettlementForge campaign membership is exclusive. `attach-existing`
--   removes the save from every other active campaign and adds it to the target,
--   while pruning queued events from campaigns it leaves. The client supplies
--   the exact reviewed membership topology; any server-side difference makes
--   the command stale before a write, so an unseen rehome is never hidden.
--
-- CAMPAIGN ENVELOPES
--   Current versioned envelopes, historical untagged `{campaign: ...}` rows,
--   and legacy unwrapped campaign rows are patched in place. A malformed
--   campaign-shaped row fails closed. Ordinary pre-campaign saved-map rows are
--   ignored because they have no campaign membership semantics.
--
-- PRIVACY
--   The journal stores hashes, ids, counts, and the source checksum only. It
--   never stores imported settlement data, source labels, prose, map snapshots,
--   or campaign payloads. The authenticated RPC may return owner-visible rows
--   to repair the initiating client projection; those rows are not journaled.
--
-- @rollback:
--   Roll the import command caller back first. Then drop
--   report_application_command_health(integer),
--   apply_import_reconciliation_command(uuid,text,text,uuid,uuid,text,text,jsonb,jsonb),
--   _import_patch_campaign_members(jsonb,uuid,boolean,timestamptz),
--   _import_campaign_members(jsonb), and _import_campaign_shape(jsonb).
--   Keep application_command_journal rows as audit/idempotency history.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public._import_campaign_shape(p_map_data jsonb)
returns text
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_version_text text;
begin
  if jsonb_typeof(p_map_data) is distinct from 'object' then
    return 'invalid';
  end if;

  if p_map_data ->> 'kind' = 'settlementforge_campaign' then
    v_version_text := p_map_data ->> 'version';
    if jsonb_typeof(p_map_data -> 'campaign') is distinct from 'object'
      or v_version_text is null
      or v_version_text !~ '^[0-9]+$'
      or v_version_text::integer not between 1 and 2
    then
      return 'invalid';
    end if;
    return 'nested';
  end if;

  if p_map_data ? 'campaign' then
    if p_map_data ->> 'kind' is not null
      or jsonb_typeof(p_map_data -> 'campaign') is distinct from 'object'
    then
      return 'invalid';
    end if;
    return 'nested';
  end if;

  if p_map_data ? 'settlementIds'
    or p_map_data ? 'mapState'
    or p_map_data ? 'regionalGraph'
    or p_map_data ? 'wizardNews'
    or p_map_data ? 'worldState'
  then
    if p_map_data ? 'settlementIds'
      and jsonb_typeof(p_map_data -> 'settlementIds') is distinct from 'array'
    then
      return 'invalid';
    end if;
    return 'unwrapped';
  end if;

  return 'not-campaign';
end;
$$;

create or replace function public._import_campaign_members(p_map_data jsonb)
returns jsonb
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_shape text := public._import_campaign_shape(p_map_data);
  v_members jsonb;
begin
  if v_shape = 'nested' then
    v_members := p_map_data #> '{campaign,settlementIds}';
  elsif v_shape = 'unwrapped' then
    v_members := p_map_data -> 'settlementIds';
  else
    return null;
  end if;

  if v_members is null then
    return '[]'::jsonb;
  end if;
  if jsonb_typeof(v_members) is distinct from 'array' then
    return null;
  end if;
  return v_members;
end;
$$;

create or replace function public._import_patch_campaign_members(
  p_map_data jsonb,
  p_save_id uuid,
  p_include boolean,
  p_changed_at timestamptz
)
returns jsonb
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_shape text := public._import_campaign_shape(p_map_data);
  v_campaign jsonb;
  v_members jsonb;
  v_pending jsonb;
begin
  if v_shape = 'nested' then
    v_campaign := p_map_data -> 'campaign';
  elsif v_shape = 'unwrapped' then
    v_campaign := p_map_data;
  else
    raise exception 'campaign envelope cannot be patched'
      using errcode = '22023';
  end if;

  v_members := coalesce(v_campaign -> 'settlementIds', '[]'::jsonb);
  if jsonb_typeof(v_members) is distinct from 'array' then
    raise exception 'campaign membership is not an array'
      using errcode = '22023';
  end if;

  select coalesce(jsonb_agg(value order by ordinal), '[]'::jsonb)
    into v_members
    from jsonb_array_elements(v_members) with ordinality as member(value, ordinal)
   where member.value #>> '{}' <> p_save_id::text;

  if p_include then
    v_members := v_members || jsonb_build_array(p_save_id::text);
  end if;

  v_campaign := jsonb_set(v_campaign, '{settlementIds}', v_members, true);
  v_campaign := jsonb_set(
    v_campaign,
    '{updatedAt}',
    to_jsonb(p_changed_at::text),
    true
  );

  -- Leaving a campaign is a deliberate moment: queued intentions for the
  -- departing settlement must be pruned exactly as campaignSlice.addToCampaign
  -- does. The target retains its queue.
  if not p_include
    and jsonb_typeof(v_campaign #> '{worldState,pendingEvents}') = 'array'
  then
    select coalesce(jsonb_agg(value order by ordinal), '[]'::jsonb)
      into v_pending
      from jsonb_array_elements(
        v_campaign #> '{worldState,pendingEvents}'
      ) with ordinality as event(value, ordinal)
     where event.value ->> 'saveId' is distinct from p_save_id::text;
    v_campaign := jsonb_set(
      v_campaign,
      '{worldState,pendingEvents}',
      v_pending,
      false
    );
  end if;

  if v_shape = 'nested' then
    return jsonb_set(p_map_data, '{campaign}', v_campaign, false);
  end if;
  return v_campaign;
end;
$$;

create index if not exists application_command_journal_attention_idx
  on public.application_command_journal(status, updated_at)
  where status in ('claimed', 'reconcile-required');

create or replace function public.apply_import_reconciliation_command(
  p_expected_owner uuid,
  p_command_id text,
  p_kind text,
  p_campaign_id uuid,
  p_save_id uuid,
  p_source_checksum text,
  p_import_session_id text,
  p_expected_membership_campaign_ids jsonb,
  p_entry jsonb default null
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
  v_now timestamptz := clock_timestamp();
  v_map public.saved_maps%rowtype;
  v_shape text;
  v_members jsonb;
  v_expected_ids jsonb;
  v_actual_ids jsonb := '[]'::jsonb;
  v_target_found boolean := false;
  v_save_exists boolean := false;
  v_affected_ids jsonb := '[]'::jsonb;
  v_receipt jsonb;
  v_save_row jsonb;
  v_campaign_rows jsonb := '[]'::jsonb;
  v_reason text;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if p_expected_owner is null or p_expected_owner <> v_uid then
    raise exception 'application command owner changed'
      using errcode = '42501';
  end if;
  if not public.account_is_active(v_uid)
    or not public.current_user_has_premium_access()
  then
    raise exception 'active premium account required'
      using errcode = '42501';
  end if;
  if p_kind not in (
    'import.settlement.create-and-attach',
    'import.campaign.attach-existing'
  )
    or p_campaign_id is null
    or p_save_id is null
    or nullif(btrim(p_source_checksum), '') is null
    or char_length(p_source_checksum) > 240
    or nullif(btrim(p_import_session_id), '') is null
    or char_length(p_import_session_id) > 240
    or jsonb_typeof(p_expected_membership_campaign_ids) is distinct from 'array'
    or exists (
      select 1
        from jsonb_array_elements(p_expected_membership_campaign_ids) as item
       where jsonb_typeof(item) <> 'string'
          or (item #>> '{}') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    )
  then
    raise exception 'invalid import reconciliation command'
      using errcode = '22023';
  end if;

  select coalesce(jsonb_agg(value order by value), '[]'::jsonb)
    into v_expected_ids
    from (
      select distinct item #>> '{}' as value
        from jsonb_array_elements(p_expected_membership_campaign_ids) as item
    ) expected;
  if jsonb_array_length(v_expected_ids)
    <> jsonb_array_length(p_expected_membership_campaign_ids)
  then
    raise exception 'expected campaign membership contains duplicates'
      using errcode = '22023';
  end if;

  if p_kind = 'import.settlement.create-and-attach' then
    if jsonb_typeof(p_entry) is distinct from 'object'
      or pg_column_size(p_entry) > 2 * 1024 * 1024
      or nullif(btrim(p_entry ->> 'name'), '') is null
      or char_length(p_entry ->> 'name') > 240
      or nullif(btrim(p_entry ->> 'tier'), '') is null
      or jsonb_typeof(p_entry -> 'settlement') is distinct from 'object'
      or jsonb_typeof(p_entry -> 'aiData') is distinct from 'object'
      or p_entry -> 'config' is distinct from 'null'::jsonb
      or p_entry -> 'seed' is distinct from 'null'::jsonb
      or p_entry #>> '{campaignState,phase}' is distinct from 'draft'
      or p_entry #> '{campaignState,eventLog}' is distinct from '[]'::jsonb
      or p_entry -> 'versionHistory' is distinct from '[]'::jsonb
      or p_entry #>> '{settlement,importedFrom,source}'
        is distinct from 'account-export'
      or p_entry #>> '{settlement,importedFrom,sourceChecksum}'
        is distinct from p_source_checksum
      or coalesce(p_entry #> '{settlement,neighbourNetwork}', '[]'::jsonb)
        is distinct from '[]'::jsonb
      or coalesce(
        p_entry #> '{settlement,interSettlementRelationships}',
        '[]'::jsonb
      ) is distinct from '[]'::jsonb
      or (
        p_entry #> '{settlement,neighborRelationship}' is not null
        and p_entry #> '{settlement,neighborRelationship}' <> 'null'::jsonb
      )
    then
      raise exception 'import settlement entry violates the dormant-copy contract'
        using errcode = '22023';
    end if;
  elsif p_entry is not null then
    raise exception 'attach-existing must not carry settlement content'
      using errcode = '22023';
  end if;

  v_fingerprint := encode(sha256(convert_to(
    jsonb_build_object(
      'kind', p_kind,
      'campaignId', p_campaign_id,
      'saveId', p_save_id,
      'sourceChecksum', p_source_checksum,
      'importSessionId', p_import_session_id,
      'expectedMembershipCampaignIds', v_expected_ids,
      'entry', p_entry
    )::text,
    'UTF8'
  )), 'hex');

  v_claim := public.claim_application_command(
    v_uid,
    p_command_id,
    v_fingerprint,
    p_kind,
    p_save_id,
    null
  );

  if v_claim ->> 'status' = 'conflict' then
    return v_claim;
  end if;

  if coalesce((v_claim ->> 'replayed')::boolean, false)
    and v_claim ->> 'status' <> 'claimed'
  then
    v_receipt := v_claim -> 'receipt';
    select to_jsonb(s) into v_save_row
      from public.settlements s
     where s.id = p_save_id
       and s.user_id = v_uid;
    select coalesce(jsonb_agg(to_jsonb(sm) order by sm.id), '[]'::jsonb)
      into v_campaign_rows
      from public.saved_maps sm
     where sm.user_id = v_uid
       and sm.id::text in (
         select item #>> '{}'
           from jsonb_array_elements(
             coalesce(v_receipt -> 'affectedCampaignIds', '[]'::jsonb)
           ) as item
       );
    return jsonb_build_object(
      'status', v_claim ->> 'status',
      'reason', v_claim ->> 'reason',
      'replayed', true,
      'fingerprint', v_fingerprint,
      'receipt', v_receipt,
      'saveRow', v_save_row,
      'campaignRows', v_campaign_rows
    );
  end if;

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
      'fingerprint', v_fingerprint
    );
  end if;

  -- Lock every active campaign in stable order. The first pass validates all
  -- campaign-shaped rows and captures the exact pre-command topology.
  for v_map in
    select *
      from public.saved_maps
     where user_id = v_uid
       and access_state = 'active'
     order by id
     for update
  loop
    v_shape := public._import_campaign_shape(v_map.map_data);
    if v_shape = 'invalid' then
      v_reason := 'campaign_shape_unsupported';
      exit;
    end if;
    if v_map.id = p_campaign_id then
      if v_shape not in ('nested', 'unwrapped') then
        v_reason := 'target_campaign_shape_unsupported';
        exit;
      end if;
      v_target_found := true;
    end if;
    if v_shape in ('nested', 'unwrapped') then
      v_members := public._import_campaign_members(v_map.map_data);
      if v_members is null then
        v_reason := 'campaign_membership_invalid';
        exit;
      end if;
      -- Historical campaign envelopes are admitted, but malformed or
      -- duplicate membership ids are not. Silently normalizing either would
      -- make the reviewed topology differ from the topology mutated here.
      if exists (
        select 1
          from jsonb_array_elements(v_members) as member
         where jsonb_typeof(member) <> 'string'
            or (member #>> '{}') !~*
              '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      ) or (
        select count(*)
          from jsonb_array_elements(v_members)
      ) <> (
        select count(distinct member #>> '{}')
          from jsonb_array_elements(v_members) as member
      ) then
        v_reason := 'campaign_membership_invalid';
        exit;
      end if;
      if exists (
        select 1
          from jsonb_array_elements(v_members) as member
         where member #>> '{}' = p_save_id::text
      ) then
        v_actual_ids := v_actual_ids || jsonb_build_array(v_map.id::text);
      end if;
    end if;
  end loop;

  if v_reason is null and not v_target_found then
    v_reason := 'target_campaign_unavailable';
  end if;

  if v_reason is null then
    select coalesce(jsonb_agg(value order by value), '[]'::jsonb)
      into v_actual_ids
      from (
        select distinct item #>> '{}' as value
          from jsonb_array_elements(v_actual_ids) as item
      ) actual;
    if v_actual_ids is distinct from v_expected_ids then
      v_reason := 'membership_topology_changed';
    end if;
  end if;

  if p_kind = 'import.campaign.attach-existing' and v_reason is null then
    select true into v_save_exists
      from public.settlements
     where id = p_save_id
       and user_id = v_uid
       and access_state = 'active'
     for update;
    if not coalesce(v_save_exists, false) then
      v_reason := 'save_unavailable';
    end if;
  elsif p_kind = 'import.settlement.create-and-attach' and v_reason is null then
    if exists (select 1 from public.settlements where id = p_save_id) then
      v_reason := 'save_id_unavailable';
    end if;
  end if;

  if v_reason is not null then
    v_receipt := jsonb_build_object(
      'importSessionId', p_import_session_id,
      'sourceChecksum', p_source_checksum,
      'campaignId', p_campaign_id,
      'saveId', p_save_id,
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
      'receipt', v_receipt
    );
  end if;

  if p_kind = 'import.settlement.create-and-attach' then
    insert into public.settlements (
      id,
      user_id,
      name,
      tier,
      data,
      config,
      toggles,
      seed,
      neighbour_links,
      ai_data,
      campaign_state,
      version_history
    ) values (
      p_save_id,
      v_uid,
      p_entry ->> 'name',
      p_entry ->> 'tier',
      p_entry -> 'settlement',
      null,
      null,
      null,
      '[]'::jsonb,
      p_entry -> 'aiData',
      p_entry -> 'campaignState',
      p_entry -> 'versionHistory'
    );
  end if;

  -- Patch only membership, campaign.updatedAt, and departed queued intentions.
  -- All other map/campaign fields remain the row's locked server value.
  for v_map in
    select *
      from public.saved_maps
     where user_id = v_uid
       and access_state = 'active'
       and (
         id = p_campaign_id
         or id::text in (
           select item #>> '{}'
             from jsonb_array_elements(v_actual_ids) as item
         )
       )
     order by id
     for update
  loop
    update public.saved_maps
       set map_data = public._import_patch_campaign_members(
             v_map.map_data,
             p_save_id,
             v_map.id = p_campaign_id,
             v_now
           ),
           updated_at = v_now
     where id = v_map.id
       and user_id = v_uid;
    v_affected_ids := v_affected_ids || jsonb_build_array(v_map.id::text);
  end loop;

  select coalesce(jsonb_agg(value order by value), '[]'::jsonb)
    into v_affected_ids
    from (
      select distinct item #>> '{}' as value
        from jsonb_array_elements(v_affected_ids) as item
    ) affected;

  v_receipt := jsonb_build_object(
    'importSessionId', p_import_session_id,
    'sourceChecksum', p_source_checksum,
    'kind', p_kind,
    'campaignId', p_campaign_id,
    'saveId', p_save_id,
    'membershipPolicy', 'exclusive-rehome',
    'previousCampaignIds', v_actual_ids,
    'affectedCampaignIds', v_affected_ids,
    'created', p_kind = 'import.settlement.create-and-attach',
    'appliedAt', v_now
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

  select to_jsonb(s) into v_save_row
    from public.settlements s
   where s.id = p_save_id
     and s.user_id = v_uid;
  select coalesce(jsonb_agg(to_jsonb(sm) order by sm.id), '[]'::jsonb)
    into v_campaign_rows
    from public.saved_maps sm
   where sm.user_id = v_uid
     and sm.id::text in (
       select item #>> '{}'
         from jsonb_array_elements(v_affected_ids) as item
     );

  return jsonb_build_object(
    'status', 'applied',
    'replayed', false,
    'fingerprint', v_fingerprint,
    'receipt', v_receipt,
    'saveRow', v_save_row,
    'campaignRows', v_campaign_rows
  );
end;
$$;

revoke all on function public._import_campaign_shape(jsonb)
  from public, anon, authenticated;
revoke all on function public._import_campaign_members(jsonb)
  from public, anon, authenticated;
revoke all on function public._import_patch_campaign_members(
  jsonb, uuid, boolean, timestamptz
) from public, anon, authenticated;
revoke all on function public.apply_import_reconciliation_command(
  uuid, text, text, uuid, uuid, text, text, jsonb, jsonb
) from public, anon;
grant execute on function public.apply_import_reconciliation_command(
  uuid, text, text, uuid, uuid, text, text, jsonb, jsonb
) to authenticated;

create or replace function public.report_application_command_health(
  p_stale_minutes integer default 30
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_role text := coalesce(
    current_setting('request.jwt.claim.role', true),
    auth.role()
  );
  v_stale_minutes integer := greatest(1, least(coalesce(p_stale_minutes, 30), 1440));
  v_claimed integer;
  v_stale_claimed integer;
  v_reconcile integer;
  v_import_reconcile integer;
begin
  if v_role is distinct from 'service_role' then
    raise exception 'service-role only' using errcode = '42501';
  end if;

  select
    count(*) filter (where status = 'claimed'),
    count(*) filter (
      where status = 'claimed'
        and updated_at <= now() - make_interval(mins => v_stale_minutes)
    ),
    count(*) filter (where status = 'reconcile-required'),
    count(*) filter (
      where status = 'reconcile-required'
        and kind in (
          'import.settlement.create-and-attach',
          'import.campaign.attach-existing'
        )
    )
  into v_claimed, v_stale_claimed, v_reconcile, v_import_reconcile
  from public.application_command_journal;

  return jsonb_build_object(
    'schemaVersion', 1,
    'healthy', v_stale_claimed = 0 and v_reconcile = 0,
    'severity', case
      when v_reconcile > 0 then 'critical'
      when v_stale_claimed > 0 then 'warning'
      else 'healthy'
    end,
    'staleMinutes', v_stale_minutes,
    'claimed', v_claimed,
    'staleClaimed', v_stale_claimed,
    'reconcileRequired', v_reconcile,
    'importReconcileRequired', v_import_reconcile,
    'observedAt', now()
  );
end;
$$;

revoke all on function public.report_application_command_health(integer)
  from public, anon, authenticated;
grant execute on function public.report_application_command_health(integer)
  to service_role;

comment on function public.apply_import_reconciliation_command(
  uuid, text, text, uuid, uuid, text, text, jsonb, jsonb
) is
  'Atomically applies one reviewed structured-import create/attach or exclusive rehome with durable owner-scoped command identity.';
