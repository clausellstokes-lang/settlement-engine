-- ────────────────────────────────────────────────────────────────────────────
-- 186_campaign_content_binding_cas.sql — server-authoritative campaign
-- content-binding compare-and-swap on the canonical saved_maps envelope.
--
-- A reviewed client plan already carries an expected binding hash, but a blind
-- saved_maps upsert allowed two tabs to pass that comparison locally and then
-- overwrite one another. This migration closes the authority gap without
-- creating a second binding table:
--
--   • one authenticated RPC locks the owner's saved_maps row;
--   • PostgreSQL compares the current envelope binding hash;
--   • only binding-owned JSON paths are patched, preserving concurrent map,
--     world, and campaign edits;
--   • the application command journal makes an ambiguous response replayable;
--   • a write trigger rejects later blind binding/history changes, so an old
--     client cannot undo a successful CAS through an ordinary whole-row upsert.
--
-- The one allowed non-CAS transition is a valid null -> binding bootstrap for
-- pre-185 campaign rows. Once a row has a binding, every change is CAS-only.
--
-- @rollback:
--   Forward-fix only after the first CAS write. Removing the trigger would
--   restore blind last-write-wins behavior. In an emergency before activation:
--   drop trigger trg_saved_maps_campaign_content_binding_cas on saved_maps;
--   drop the RPC, trigger function, and five private helpers below.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public._campaign_content_binding_from_map(
  p_map_data jsonb
)
returns jsonb
language sql
immutable
set search_path = public, pg_temp
as $$
  select case
    when jsonb_typeof(p_map_data) is distinct from 'object' then null
    when jsonb_typeof(p_map_data -> 'campaign') = 'object'
      then p_map_data #> '{campaign,contentBinding}'
    else p_map_data -> 'contentBinding'
  end
$$;

create or replace function public._campaign_content_binding_history_from_map(
  p_map_data jsonb
)
returns jsonb
language sql
immutable
set search_path = public, pg_temp
as $$
  select case
    when jsonb_typeof(p_map_data) is distinct from 'object' then '[]'::jsonb
    when jsonb_typeof(p_map_data -> 'campaign') = 'object'
      then coalesce(
        p_map_data #> '{campaign,contentBindingHistory}',
        '[]'::jsonb
      )
    else coalesce(p_map_data -> 'contentBindingHistory', '[]'::jsonb)
  end
$$;

create or replace function public._campaign_content_binding_valid(
  p_binding jsonb
)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_environment jsonb;
begin
  if jsonb_typeof(p_binding) is distinct from 'object'
    or not (
      p_binding ?& array[
        'schemaVersion',
        'source',
        'environment',
        'resolvedDefinitions',
        'bindingHash'
      ]
    )
    or (p_binding - array[
      'schemaVersion',
      'source',
      'environment',
      'resolvedDefinitions',
      'bindingHash'
    ]) <> '{}'::jsonb
    or jsonb_typeof(p_binding -> 'schemaVersion') <> 'number'
    or p_binding ->> 'schemaVersion' is distinct from '1'
    or jsonb_typeof(p_binding -> 'source') <> 'string'
    or nullif(btrim(p_binding ->> 'source'), '') is null
    or char_length(p_binding ->> 'source') > 240
    or p_binding ->> 'source' <> btrim(p_binding ->> 'source')
    or jsonb_typeof(p_binding -> 'bindingHash') <> 'string'
    or (p_binding ->> 'bindingHash') !~ '^[0-9a-f]{64}$'
    or jsonb_typeof(p_binding -> 'resolvedDefinitions') is distinct from 'array'
    or jsonb_array_length(p_binding -> 'resolvedDefinitions') > 2000
    or not public._content_environment_valid(p_binding -> 'environment')
    or public._content_sha256(p_binding - 'bindingHash')
      <> p_binding ->> 'bindingHash'
  then
    return false;
  end if;

  v_environment := p_binding -> 'environment';
  if jsonb_array_length(v_environment -> 'directDefinitions')
    <> jsonb_array_length(p_binding -> 'resolvedDefinitions')
  then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(p_binding -> 'resolvedDefinitions')
        as resolved(value)
     where jsonb_typeof(resolved.value) is distinct from 'object'
        or not (
          resolved.value ?& array[
            'definitionId',
            'revisionId',
            'contentHash',
            'category',
            'data'
          ]
        )
        or (resolved.value - array[
          'definitionId',
          'revisionId',
          'contentHash',
          'category',
          'data'
        ]) <> '{}'::jsonb
        or nullif(btrim(resolved.value ->> 'definitionId'), '') is null
        or nullif(btrim(resolved.value ->> 'revisionId'), '') is null
        or char_length(resolved.value ->> 'definitionId') > 240
        or char_length(resolved.value ->> 'revisionId') > 240
        or (resolved.value ->> 'contentHash') !~ '^[0-9a-f]{64}$'
        or resolved.value ->> 'category' not in (
          'institutions',
          'services',
          'resources',
          'stressors',
          'tradeGoods',
          'factions',
          'deities',
          'traditions'
        )
        or jsonb_typeof(resolved.value -> 'data') is distinct from 'object'
        or not public._custom_content_record_valid(
          resolved.value ->> 'category',
          resolved.value -> 'data'
        )
        or public._content_sha256(jsonb_build_object(
          'schemaVersion', 1,
          'category', resolved.value ->> 'category',
          'data', resolved.value -> 'data'
        )) <> resolved.value ->> 'contentHash'
        or not exists (
          select 1
            from jsonb_array_elements(
              v_environment -> 'directDefinitions'
            ) as direct(value)
           where direct.value ->> 'definitionId'
             = resolved.value ->> 'definitionId'
             and direct.value ->> 'revisionId'
             = resolved.value ->> 'revisionId'
             and direct.value ->> 'contentHash'
             = resolved.value ->> 'contentHash'
             and direct.value ->> 'category'
             = resolved.value ->> 'category'
        )
  ) or exists (
    select 1
      from jsonb_array_elements(
        v_environment -> 'directDefinitions'
      ) as direct(value)
     where jsonb_typeof(direct.value) is distinct from 'object'
        or (direct.value - array[
          'definitionId',
          'revisionId',
          'contentHash',
          'category'
        ]) <> '{}'::jsonb
  ) or exists (
    select 1
      from jsonb_array_elements(p_binding -> 'resolvedDefinitions')
        as resolved(value)
     group by resolved.value ->> 'definitionId'
    having count(*) > 1
  ) then
    return false;
  end if;

  return true;
exception
  when others then
    return false;
end;
$$;

create or replace function public._campaign_content_binding_history_valid(
  p_history jsonb
)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
begin
  if jsonb_typeof(p_history) is distinct from 'array'
    or jsonb_array_length(p_history) > 64
    or octet_length(public._content_canonical_json(p_history))
      > 2 * 1024 * 1024
    or exists (
      select 1
        from jsonb_array_elements(p_history) as binding(value)
       where not public._campaign_content_binding_valid(binding.value)
    )
    or exists (
      select 1
        from jsonb_array_elements(p_history) as binding(value)
       group by binding.value ->> 'bindingHash'
      having count(*) > 1
    )
  then
    return false;
  end if;
  return true;
exception
  when others then
    return false;
end;
$$;

create or replace function public._campaign_patch_content_binding(
  p_map_data jsonb,
  p_binding jsonb,
  p_history jsonb,
  p_now timestamptz
)
returns jsonb
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_campaign jsonb;
begin
  if jsonb_typeof(p_map_data) is distinct from 'object' then
    return null;
  end if;
  if jsonb_typeof(p_map_data -> 'campaign') = 'object' then
    v_campaign := p_map_data -> 'campaign';
    v_campaign := jsonb_set(v_campaign, '{contentBinding}', p_binding, true);
    v_campaign := jsonb_set(
      v_campaign,
      '{contentBindingHistory}',
      p_history,
      true
    );
    v_campaign := jsonb_set(
      v_campaign,
      '{contentBindingStatus}',
      to_jsonb('pinned'::text),
      true
    );
    v_campaign := jsonb_set(
      v_campaign,
      '{updatedAt}',
      to_jsonb(p_now),
      true
    );
    return jsonb_set(p_map_data, '{campaign}', v_campaign, false);
  end if;
  if p_map_data ? 'settlementIds'
    or p_map_data ? 'mapState'
    or p_map_data ? 'regionalGraph'
    or p_map_data ? 'worldState'
  then
    v_campaign := jsonb_set(
      p_map_data,
      '{contentBinding}',
      p_binding,
      true
    );
    v_campaign := jsonb_set(
      v_campaign,
      '{contentBindingHistory}',
      p_history,
      true
    );
    v_campaign := jsonb_set(
      v_campaign,
      '{contentBindingStatus}',
      to_jsonb('pinned'::text),
      true
    );
    return jsonb_set(v_campaign, '{updatedAt}', to_jsonb(p_now), true);
  end if;
  return null;
end;
$$;

create or replace function public.enforce_campaign_content_binding_cas()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_old_binding jsonb;
  v_new_binding jsonb;
  v_old_history jsonb;
  v_new_history jsonb;
  v_command_fingerprint text;
begin
  v_new_binding := public._campaign_content_binding_from_map(new.map_data);
  v_new_history :=
    public._campaign_content_binding_history_from_map(new.map_data);
  if v_new_binding is not null
    and (
      not public._campaign_content_binding_valid(v_new_binding)
      or not public._campaign_content_binding_history_valid(v_new_history)
    )
  then
    raise exception 'invalid campaign content binding envelope'
      using errcode = '22023';
  end if;

  if tg_op = 'INSERT' then
    return new;
  end if;

  v_old_binding := public._campaign_content_binding_from_map(old.map_data);
  v_old_history :=
    public._campaign_content_binding_history_from_map(old.map_data);
  if v_old_binding is not distinct from v_new_binding
    and v_old_history is not distinct from v_new_history
  then
    return new;
  end if;

  -- Authorization is the unfinalized command claim created by the CAS RPC in
  -- this transaction. A custom GUC is not a capability: any database role can
  -- set an arbitrary custom setting. The journal row cannot be forged by the
  -- authenticated client, is visible to its own transaction, and is finalized
  -- before commit.
  if v_old_binding is not null and v_new_binding is not null then
    v_command_fingerprint := public._content_sha256(jsonb_build_object(
      'schemaVersion', 1,
      'kind', 'campaign.content-binding.cas',
      'campaignId', new.id::text,
      'expectedBindingHash', v_old_binding ->> 'bindingHash',
      'targetBinding', v_new_binding,
      'contentBindingHistory', v_new_history
    ));
  end if;
  if v_command_fingerprint is not null and exists (
    select 1
      from public.application_command_journal as command
     where command.owner_id = new.user_id
       and command.target_id = new.id
       and command.kind = 'campaign.content-binding.cas'
       and command.fingerprint = v_command_fingerprint
       and command.phase = 'claimed'
       and command.status = 'claimed'
  ) then
    return new;
  end if;

  -- One migration-compatible bootstrap for rows created before bindings
  -- existed. History is empty because no earlier portable cutoff was stored.
  if v_old_binding is null
    and v_new_binding is not null
    and v_new_history = '[]'::jsonb
  then
    return new;
  end if;

  raise exception 'campaign content binding requires compare-and-swap'
    using errcode = '40001';
end;
$$;

drop trigger if exists trg_saved_maps_campaign_content_binding_cas
  on public.saved_maps;
create trigger trg_saved_maps_campaign_content_binding_cas
before insert or update of map_data on public.saved_maps
for each row execute function public.enforce_campaign_content_binding_cas();

create or replace function public.compare_and_swap_campaign_content_binding(
  p_expected_owner uuid,
  p_command_id text,
  p_fingerprint text,
  p_campaign_id uuid,
  p_expected_binding_hash text,
  p_target_binding jsonb,
  p_content_binding_history jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_core jsonb;
  v_claim jsonb;
  v_map_data jsonb;
  v_next_map_data jsonb;
  v_actual_binding jsonb;
  v_actual_history jsonb;
  v_actual_hash text;
  v_target_hash text := p_target_binding ->> 'bindingHash';
  v_now timestamptz := clock_timestamp();
  v_receipt jsonb;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if p_expected_owner is null or p_expected_owner <> v_uid then
    raise exception 'campaign content command owner changed'
      using errcode = '42501';
  end if;
  if not public.account_is_active(v_uid)
    or not public.current_user_has_premium_access()
  then
    raise exception 'active premium account required'
      using errcode = '42501';
  end if;
  if p_campaign_id is null
    or p_expected_binding_hash !~ '^[0-9a-f]{64}$'
    or not public._campaign_content_binding_valid(p_target_binding)
    or not public._campaign_content_binding_history_valid(
      p_content_binding_history
    )
    or not exists (
      select 1
        from jsonb_array_elements(p_content_binding_history) as binding(value)
       where binding.value ->> 'bindingHash' = v_target_hash
    )
    or not exists (
      select 1
        from jsonb_array_elements(p_content_binding_history) as binding(value)
       where binding.value ->> 'bindingHash' = p_expected_binding_hash
    )
  then
    raise exception 'invalid campaign content binding command'
      using errcode = '22023';
  end if;

  v_core := jsonb_build_object(
    'schemaVersion', 1,
    'kind', 'campaign.content-binding.cas',
    'campaignId', p_campaign_id::text,
    'expectedBindingHash', p_expected_binding_hash,
    'targetBinding', p_target_binding,
    'contentBindingHistory', p_content_binding_history
  );
  if p_fingerprint !~ '^[0-9a-f]{64}$'
    or public._content_sha256(v_core) <> p_fingerprint
    or nullif(btrim(p_command_id), '') is null
    or char_length(p_command_id) > 240
  then
    raise exception 'campaign content command fingerprint mismatch'
      using errcode = '22023';
  end if;

  v_claim := public.claim_application_command(
    v_uid,
    p_command_id,
    p_fingerprint,
    'campaign.content-binding.cas',
    p_campaign_id,
    null
  );
  if v_claim ->> 'status' = 'conflict' then
    return jsonb_build_object(
      'schemaVersion', 1,
      'status', 'failed',
      'reason', 'command_id_conflict',
      'replayed', true,
      'commandId', p_command_id,
      'fingerprint', p_fingerprint,
      'campaignId', p_campaign_id
    );
  end if;
  if coalesce((v_claim ->> 'replayed')::boolean, false)
    and v_claim ->> 'phase' = 'finalized'
    and jsonb_typeof(v_claim -> 'receipt') = 'object'
  then
    -- Applied and failed receipts are immutable facts. A stale receipt is also
    -- permanently non-mutating, but its remote projection is an observation:
    -- another device may have advanced again before this retry. Refresh those
    -- fields instead of sending the browser an older winning binding.
    if v_claim #>> '{receipt,status}' = 'stale' then
      select map_data
        into v_map_data
        from public.saved_maps
       where id = p_campaign_id
         and user_id = v_uid
         and access_state = 'active';
      if found then
        v_actual_binding :=
          public._campaign_content_binding_from_map(v_map_data);
        v_actual_history :=
          public._campaign_content_binding_history_from_map(v_map_data);
        v_actual_hash := v_actual_binding ->> 'bindingHash';
      else
        v_actual_binding := null;
        v_actual_history := '[]'::jsonb;
        v_actual_hash := null;
      end if;
      return (v_claim -> 'receipt') || jsonb_build_object(
        'replayed', true,
        'actualBindingHash', v_actual_hash,
        'remoteBinding', v_actual_binding,
        'remoteBindingHistory', v_actual_history,
        'observedAt', v_now
      );
    end if;
    return (v_claim -> 'receipt')
      || jsonb_build_object('replayed', true);
  end if;
  if v_claim ->> 'phase' = 'reconcile' then
    return jsonb_build_object(
      'schemaVersion', 1,
      'status', 'reconcile-required',
      'reason', coalesce(v_claim ->> 'reason', 'ambiguous_result'),
      'replayed', true,
      'commandId', p_command_id,
      'fingerprint', p_fingerprint,
      'campaignId', p_campaign_id
    );
  end if;

  select map_data
    into v_map_data
    from public.saved_maps
   where id = p_campaign_id
     and user_id = v_uid
     and access_state = 'active'
   for update;
  if not found then
    v_receipt := jsonb_build_object(
      'schemaVersion', 1,
      'status', 'failed',
      'reason', 'campaign_content_campaign_unavailable',
      'replayed', false,
      'commandId', p_command_id,
      'fingerprint', p_fingerprint,
      'campaignId', p_campaign_id
    );
    if not public.finalize_application_command(
      v_uid,
      p_command_id,
      p_fingerprint,
      'failed',
      v_receipt,
      'campaign_content_campaign_unavailable'
    ) then
      raise exception 'campaign content command did not finalize'
        using errcode = '40001';
    end if;
    return v_receipt;
  end if;

  v_actual_binding :=
    public._campaign_content_binding_from_map(v_map_data);
  v_actual_history :=
    public._campaign_content_binding_history_from_map(v_map_data);
  v_actual_hash := v_actual_binding ->> 'bindingHash';

  if not public._campaign_content_binding_history_valid(v_actual_history) then
    raise exception 'stored campaign content history failed admission'
      using errcode = '22023';
  end if;

  if v_actual_hash is distinct from p_expected_binding_hash
    and v_actual_hash is distinct from v_target_hash
  then
    v_receipt := jsonb_build_object(
      'schemaVersion', 1,
      'status', 'stale',
      'reason', 'campaign_content_binding_conflict',
      'replayed', false,
      'commandId', p_command_id,
      'fingerprint', p_fingerprint,
      'campaignId', p_campaign_id,
      'expectedBindingHash', p_expected_binding_hash,
      'actualBindingHash', v_actual_hash,
      'remoteBinding', v_actual_binding,
      'remoteBindingHistory', v_actual_history,
      'observedAt', v_now
    );
    if not public.finalize_application_command(
      v_uid,
      p_command_id,
      p_fingerprint,
      'stale',
      v_receipt,
      'campaign_content_binding_conflict'
    ) then
      raise exception 'campaign content command did not finalize'
        using errcode = '40001';
    end if;
    return v_receipt;
  end if;

  -- Binding-hash CAS alone has an ABA hole: another device can advance
  -- B -> C -> B while an older B-based review remains open. The current hash
  -- matches, but accepting the older history would erase C. Existing history
  -- must remain an exact prefix, and the only legal suffix entries are the
  -- current and target snapshots that the domain append operation can add.
  if jsonb_array_length(p_content_binding_history)
      < jsonb_array_length(v_actual_history)
    or exists (
      select 1
        from jsonb_array_elements(v_actual_history)
          with ordinality as prior(value, ordinal)
       where (
         p_content_binding_history
           -> ((prior.ordinal - 1)::integer)
       ) is distinct from prior.value
    )
    or exists (
      select 1
        from jsonb_array_elements(p_content_binding_history)
          with ordinality as proposed(value, ordinal)
       where proposed.ordinal > jsonb_array_length(v_actual_history)
         and proposed.value ->> 'bindingHash'
           not in (v_actual_hash, v_target_hash)
    )
  then
    v_receipt := jsonb_build_object(
      'schemaVersion', 1,
      'status', 'stale',
      'reason', 'campaign_content_binding_history_conflict',
      'replayed', false,
      'commandId', p_command_id,
      'fingerprint', p_fingerprint,
      'campaignId', p_campaign_id,
      'expectedBindingHash', p_expected_binding_hash,
      'actualBindingHash', v_actual_hash,
      'remoteBinding', v_actual_binding,
      'remoteBindingHistory', v_actual_history,
      'observedAt', v_now
    );
    if not public.finalize_application_command(
      v_uid,
      p_command_id,
      p_fingerprint,
      'stale',
      v_receipt,
      'campaign_content_binding_history_conflict'
    ) then
      raise exception 'campaign content command did not finalize'
        using errcode = '40001';
    end if;
    return v_receipt;
  end if;

  if v_actual_hash = v_target_hash then
    v_receipt := jsonb_build_object(
      'schemaVersion', 1,
      'status', 'applied',
      'replayed', false,
      'commandId', p_command_id,
      'fingerprint', p_fingerprint,
      'campaignId', p_campaign_id,
      'previousBindingHash', p_expected_binding_hash,
      'bindingHash', v_target_hash,
      'appliedAt', v_now
    );
    if not public.finalize_application_command(
      v_uid,
      p_command_id,
      p_fingerprint,
      'applied',
      v_receipt,
      null
    ) then
      raise exception 'campaign content command did not finalize'
        using errcode = '40001';
    end if;
    return v_receipt;
  end if;

  v_next_map_data := public._campaign_patch_content_binding(
    v_map_data,
    p_target_binding,
    p_content_binding_history,
    v_now
  );
  if v_next_map_data is null then
    v_receipt := jsonb_build_object(
      'schemaVersion', 1,
      'status', 'failed',
      'reason', 'campaign_content_envelope_unsupported',
      'replayed', false,
      'commandId', p_command_id,
      'fingerprint', p_fingerprint,
      'campaignId', p_campaign_id
    );
    if not public.finalize_application_command(
      v_uid,
      p_command_id,
      p_fingerprint,
      'failed',
      v_receipt,
      'campaign_content_envelope_unsupported'
    ) then
      raise exception 'campaign content command did not finalize'
        using errcode = '40001';
    end if;
    return v_receipt;
  end if;

  update public.saved_maps
     set map_data = v_next_map_data,
         updated_at = v_now
   where id = p_campaign_id
     and user_id = v_uid;

  v_receipt := jsonb_build_object(
    'schemaVersion', 1,
    'status', 'applied',
    'replayed', false,
    'commandId', p_command_id,
    'fingerprint', p_fingerprint,
    'campaignId', p_campaign_id,
    'previousBindingHash', p_expected_binding_hash,
    'bindingHash', v_target_hash,
    'appliedAt', v_now
  );
  if not public.finalize_application_command(
    v_uid,
    p_command_id,
    p_fingerprint,
    'applied',
    v_receipt,
    null
  ) then
    raise exception 'campaign content command did not finalize'
      using errcode = '40001';
  end if;
  return v_receipt;
end;
$$;

revoke all on function public._campaign_content_binding_from_map(jsonb)
  from public, anon, authenticated;
revoke all on function public._campaign_content_binding_history_from_map(jsonb)
  from public, anon, authenticated;
revoke all on function public._campaign_content_binding_valid(jsonb)
  from public, anon, authenticated;
revoke all on function public._campaign_content_binding_history_valid(jsonb)
  from public, anon, authenticated;
revoke all on function public._campaign_patch_content_binding(
  jsonb, jsonb, jsonb, timestamptz
) from public, anon, authenticated;
revoke all on function public.enforce_campaign_content_binding_cas()
  from public, anon, authenticated;
revoke all on function public.compare_and_swap_campaign_content_binding(
  uuid, text, text, uuid, text, jsonb, jsonb
) from public, anon;
grant execute on function public.compare_and_swap_campaign_content_binding(
  uuid, text, text, uuid, text, jsonb, jsonb
) to authenticated;

comment on function public.compare_and_swap_campaign_content_binding(
  uuid, text, text, uuid, text, jsonb, jsonb
) is
  'Atomically advances the canonical saved_maps campaign content binding after exact expected-hash comparison and returns a durable replayable receipt.';
