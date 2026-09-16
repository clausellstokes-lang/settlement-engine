-- ───────────────────────────────────────────────────────────────────────────────
-- 194_operator_messages.sql — private Operator Messages, explicit announcement
-- consent, durable consent history, and a lease-safe broadcast courier.
--
-- The Account inbox is authoritative. Direct notices mint their receipt in the
-- same transaction as the message. Broadcasts remain ONE shared message row and
-- ONE delivery job; per-user receipts are materialized lazily by own-data reads
-- or by a bounded worker page. No queue operation fans out one message per user.
--
-- SECURITY
--   * All four new tables are RLS-on with no policy and no client table grants.
--   * End-user access is only through auth.uid()-scoped SECURITY DEFINER RPCs.
--   * Admin/worker mutation RPCs are service-role only, re-check forwarded actors,
--     and use expiring tokenized leases for every broadcast recipient page.
--   * Announcement email is eligible only after an explicit product_updates
--     decision; pre-194 true defaults are not silently treated as consent.
--
-- ACCOUNT ERASURE
--   A profiles.deleted_at transition purges the user's receipts, direct messages
--   addressed to them, and consent-change history. Shared broadcast rows and their
--   jobs survive because deleting one account must not erase everyone else's mail.
--
-- @rollback: Forward-fix first. Emergency schema reversal (DESTRUCTIVE: deletes
--   operator-message receipts, delivery state, and consent history): drop trigger
--   if exists purge_operator_records_on_profile_deletion on public.profiles; drop
--   function if exists public.purge_operator_records_on_profile_deletion(); drop
--   function if exists public.run_operator_message_delivery(); drop table if exists
--   public.operator_message_delivery_jobs cascade; drop table if exists
--   public.operator_message_receipts cascade; drop table if exists
--   public.operator_messages cascade; drop table if exists
--   public.consent_change_records cascade; drop function if exists
--   public.operator_message_class_for_template(text); alter table public.support_messages drop
--   column if exists operator_message_id; alter table public.email_preferences drop
--   column if exists product_updates_decided_at. Recreate migration 126's email RPC
--   bodies before dropping the decision column.
-- ───────────────────────────────────────────────────────────────────────────────

-- ── 1. Private storage ─────────────────────────────────────────────────────────────────────────

-- One closed vocabulary owns BOTH template reachability and delivery class.
-- Keeping this map in the database prevents a caller from relabeling marketing
-- copy as transactional service mail (or inventing an unreviewed template key).
create or replace function public.operator_message_class_for_template(p_template text)
returns text
language sql
immutable
set search_path = public, pg_temp
as $$
  select case p_template
    when 'product_update' then 'announcement'
    when 'custom_announcement' then 'announcement'
    when 'service_notice' then 'service'
    when 'moderation_notice' then 'service'
    when 'report_outcome' then 'service'
    when 'avatar_removed' then 'service'
    when 'display_name_reset' then 'service'
    when 'warning' then 'service'
    when 'ban_notice' then 'service'
    when 'custom_service' then 'service'
    else null
  end
$$;

revoke all on function public.operator_message_class_for_template(text)
  from public, anon, authenticated, service_role;

create table if not exists public.operator_messages (
  id                   uuid primary key default gen_random_uuid(),
  kind                 text not null check (kind in ('direct', 'broadcast')),
  message_class        text not null check (message_class in ('service', 'announcement')),
  sender_role          text not null check (sender_role in ('admin', 'developer', 'system')),
  sender_user_id       uuid references auth.users(id) on delete set null,
  recipient_user_id    uuid references auth.users(id) on delete cascade,
  subject              text not null check (
    length(btrim(subject)) between 1 and 160 and subject = btrim(subject)
  ),
  body                 text not null check (
    length(btrim(body)) between 1 and 10000 and body = btrim(body)
  ),
  template_key         text not null default 'custom_service',
  audience             text,
  status               text not null check (status in ('queued', 'sending', 'sent', 'canceled')),
  audience_snapshot_at timestamptz,
  audience_count       integer not null default 1 check (audience_count >= 0),
  created_at           timestamptz not null default now(),
  send_after           timestamptz,
  sent_at              timestamptz,
  canceled_at          timestamptz,
  constraint operator_messages_template_class_check check (
    public.operator_message_class_for_template(template_key) is not null
    and public.operator_message_class_for_template(template_key) = message_class
  ),
  constraint operator_messages_shape check (
    (
      kind = 'direct'
      and recipient_user_id is not null
      and audience is null
      and audience_snapshot_at is null
      and send_after is null
      and status = 'sent'
      and audience_count = 1
      and sent_at is not null
      and canceled_at is null
    )
    or
    (
      kind = 'broadcast'
      and recipient_user_id is null
      and audience = 'all'
      and audience_snapshot_at is not null
      and send_after is not null
      and audience_count >= 0
      and (
        (status = 'canceled' and canceled_at is not null and sent_at is null)
        or (status in ('queued', 'sending') and canceled_at is null and sent_at is null)
        or (status = 'sent' and canceled_at is null and sent_at is not null)
      )
    )
  )
);

create index if not exists operator_messages_recipient_time_idx
  on public.operator_messages (recipient_user_id, created_at desc, id desc)
  where kind = 'direct';
create index if not exists operator_messages_broadcast_visibility_idx
  on public.operator_messages (status, send_after, created_at desc, id desc)
  where kind = 'broadcast' and status in ('queued', 'sending', 'sent');

create table if not exists public.operator_message_receipts (
  message_id          uuid not null references public.operator_messages(id) on delete cascade,
  user_id             uuid not null references auth.users(id) on delete cascade,
  materialized_at     timestamptz not null default now(),
  delivered_at        timestamptz not null default now(),
  read_at             timestamptz,
  dismissed_at        timestamptz,
  email_status        text not null default 'pending'
    check (email_status in ('pending', 'sending', 'sent', 'skipped', 'failed')),
  email_attempted_at  timestamptz,
  email_delivered_at  timestamptz,
  email_provider      text check (email_provider is null or length(email_provider) <= 80),
  email_provider_id   text check (email_provider_id is null or length(email_provider_id) <= 255),
  email_failure_reason text check (
    email_failure_reason is null or length(email_failure_reason) <= 500
  ),
  -- A broadcast provider call is authorized only by a one-shot attempt token.
  -- If its owning job lease is abandoned, the attempt becomes terminally
  -- unknown; it is never put back into pending and therefore never resent.
  email_attempt_token uuid,
  email_job_lease_token uuid,
  email_idempotency_key uuid not null default gen_random_uuid(),
  primary key (message_id, user_id),
  constraint operator_message_receipts_time_order check (
    (read_at is null or read_at >= materialized_at)
    and (dismissed_at is null or dismissed_at >= materialized_at)
    and (email_attempted_at is null or email_attempted_at >= materialized_at)
    and (email_delivered_at is null or email_delivered_at >= materialized_at)
  ),
  constraint operator_message_receipts_email_shape check (
    (
      email_status = 'pending'
      and email_attempted_at is null
      and email_delivered_at is null
      and email_failure_reason is null
      and email_attempt_token is null
      and email_job_lease_token is null
    )
    or (
      email_status = 'sending'
      and email_attempted_at is not null
      and email_delivered_at is null
      and email_failure_reason is null
      and email_attempt_token is not null
      and email_job_lease_token is not null
    )
    or (
      email_status = 'sent'
      and email_attempted_at is not null
      and email_delivered_at is not null
      and email_failure_reason is null
      and email_attempt_token is null
      and email_job_lease_token is null
    )
    or (
      email_status in ('failed', 'skipped')
      and email_attempted_at is not null
      and email_delivered_at is null
      and email_failure_reason is not null
      and email_attempt_token is null
      and email_job_lease_token is null
    )
  )
);

create index if not exists operator_message_receipts_user_unread_idx
  on public.operator_message_receipts (user_id, delivered_at desc, message_id)
  where read_at is null and dismissed_at is null;
create index if not exists operator_message_receipts_sending_lease_idx
  on public.operator_message_receipts (message_id, email_job_lease_token)
  where email_status = 'sending';

create table if not exists public.operator_message_delivery_jobs (
  id                    uuid primary key default gen_random_uuid(),
  message_id            uuid not null unique references public.operator_messages(id) on delete cascade,
  status                text not null default 'pending'
    check (status in ('pending', 'processing', 'retry', 'completed', 'failed', 'canceled')),
  audience_snapshot_at  timestamptz not null,
  cursor_created_at     timestamptz,
  cursor_user_id        uuid,
  lease_token           uuid,
  lease_expires_at      timestamptz,
  attempts              integer not null default 0 check (attempts between 0 and 8),
  next_attempt_at       timestamptz not null default now(),
  last_error            text check (last_error is null or length(last_error) <= 500),
  created_at            timestamptz not null default now(),
  completed_at          timestamptz,
  updated_at            timestamptz not null default now(),
  constraint operator_message_delivery_jobs_cursor_shape check (
    (cursor_created_at is null) = (cursor_user_id is null)
  ),
  constraint operator_message_delivery_jobs_lease_shape check (
    (status = 'processing' and lease_token is not null and lease_expires_at is not null)
    or (status <> 'processing' and lease_token is null and lease_expires_at is null)
  ),
  constraint operator_message_delivery_jobs_terminal_shape check (
    (status = 'completed' and completed_at is not null and last_error is null)
    or (status = 'canceled' and completed_at is not null)
    or (status not in ('completed', 'canceled') and completed_at is null)
  )
);

create index if not exists operator_message_delivery_jobs_claim_idx
  on public.operator_message_delivery_jobs (status, next_attempt_at, created_at, id)
  where status in ('pending', 'processing', 'retry');

create table if not exists public.consent_change_records (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  consent_key           text not null check (
    consent_key in ('essential', 'research', 'ai_prose', 'market')
  ),
  prior_value           boolean not null,
  new_value             boolean not null,
  consent_model_version smallint not null check (consent_model_version between 1 and 32767),
  source                text not null check (source in ('account', 'unsubscribe', 'system')),
  created_at            timestamptz not null default now(),
  check (prior_value is distinct from new_value)
);

create index if not exists consent_change_records_user_time_idx
  on public.consent_change_records (user_id, created_at desc, id desc);

alter table public.operator_messages enable row level security;
alter table public.operator_message_receipts enable row level security;
alter table public.operator_message_delivery_jobs enable row level security;
alter table public.consent_change_records enable row level security;

-- Deliberately NO policies. All reads and writes cross a scoped definer RPC.
revoke all on table public.operator_messages from public, anon, authenticated;
revoke all on table public.operator_message_receipts from public, anon, authenticated;
revoke all on table public.operator_message_delivery_jobs from public, anon, authenticated;
revoke all on table public.consent_change_records from public, anon, authenticated;

-- ── 2. Explicit product-update decisions ───────────────────────────────────────────────

alter table public.email_preferences
  add column if not exists product_updates_decided_at timestamptz;
alter table public.email_preferences
  alter column product_updates set default false;

create or replace function public.get_my_email_preferences()
returns table (product_updates boolean, referral boolean, lifecycle boolean)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  return query
    select
      coalesce(ep.product_updates and ep.product_updates_decided_at is not null, false),
      coalesce(ep.referral, true),
      coalesce(ep.lifecycle, true)
    from (select v_uid as user_id) base
    left join public.email_preferences ep on ep.user_id = base.user_id;
end;
$$;

-- Remove migration 126's permissive signature. The replacement binds the write
-- to the owner whose session the client preflighted, so a rotated browser session
-- cannot silently apply A's toggle to B.
revoke all on function public.set_my_email_preference(text, boolean)
  from public, anon, authenticated, service_role;
drop function if exists public.set_my_email_preference(text, boolean);

create or replace function public.set_my_email_preference(
  p_expected_user uuid,
  p_category text,
  p_enabled boolean
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_expected_user is null or v_uid <> p_expected_user then
    raise exception 'auth session changed before email preference mutation';
  end if;
  if not public.is_allowed_email_category(p_category) then
    raise exception 'unknown email category: %', p_category;
  end if;
  if p_enabled is null then raise exception 'enabled flag is required'; end if;

  insert into public.email_preferences (user_id)
  values (v_uid)
  on conflict (user_id) do nothing;

  if p_category = 'product_updates' then
    update public.email_preferences
       set product_updates = p_enabled,
           product_updates_decided_at = now(),
           updated_at = now()
     where user_id = v_uid;
  else
    execute format(
      'update public.email_preferences set %I = $1, updated_at = now() where user_id = $2',
      p_category
    ) using p_enabled, v_uid;
  end if;
end;
$$;

create or replace function public.unsubscribe_via_token(
  p_token uuid,
  p_category text default 'all'
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid;
begin
  if p_token is null then return false; end if;
  if p_category <> 'all' and not public.is_allowed_email_category(p_category) then
    return false;
  end if;

  select ep.user_id into v_uid
    from public.email_preferences ep
   where ep.unsubscribe_token = p_token
   limit 1;
  if v_uid is null then return false; end if;

  if p_category = 'all' then
    update public.email_preferences
       set product_updates = false,
           product_updates_decided_at = now(),
           referral = false,
           lifecycle = false,
           updated_at = now()
     where user_id = v_uid;
  elsif p_category = 'product_updates' then
    update public.email_preferences
       set product_updates = false,
           product_updates_decided_at = now(),
           updated_at = now()
     where user_id = v_uid;
  else
    execute format(
      'update public.email_preferences set %I = false, updated_at = now() where user_id = $1',
      p_category
    ) using v_uid;
  end if;
  return true;
end;
$$;

create or replace function public.can_email_user(p_user_id uuid, p_category text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_enabled boolean;
begin
  if p_user_id is null or not public.is_allowed_email_category(p_category) then
    return false;
  end if;
  if p_category = 'product_updates' then
    select ep.product_updates and ep.product_updates_decided_at is not null
      into v_enabled
      from public.email_preferences ep
     where ep.user_id = p_user_id;
    return coalesce(v_enabled, false);
  end if;
  execute format('select %I from public.email_preferences where user_id = $1', p_category)
    into v_enabled using p_user_id;
  return coalesce(v_enabled, true);
end;
$$;

revoke all on function public.get_my_email_preferences() from public, anon;
revoke all on function public.set_my_email_preference(uuid, text, boolean) from public, anon;
revoke all on function public.unsubscribe_via_token(uuid, text) from public, anon, authenticated;
revoke all on function public.can_email_user(uuid, text) from public, anon, authenticated;
grant execute on function public.get_my_email_preferences() to authenticated;
grant execute on function public.set_my_email_preference(uuid, text, boolean) to authenticated;
grant execute on function public.unsubscribe_via_token(uuid, text) to service_role;
grant execute on function public.can_email_user(uuid, text) to service_role;

-- ── 3. Typed consent history and authenticated writer ──────────────────────────────

create or replace function public.record_telemetry_consent_changes()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_key text;
  v_source text := coalesce(nullif(current_setting('app.telemetry_consent_source', true), ''), 'system');
  v_version integer := coalesce((new.telemetry_consent ->> 'v')::integer, 1);
  v_before boolean;
  v_after boolean;
begin
  if v_source not in ('account', 'unsubscribe', 'system') then v_source := 'system'; end if;
  if v_version < 1 or v_version > 32767 then v_version := 1; end if;
  foreach v_key in array array['essential', 'research', 'ai_prose', 'market'] loop
    v_before := coalesce((old.telemetry_consent ->> v_key)::boolean, false);
    v_after := coalesce((new.telemetry_consent ->> v_key)::boolean, false);
    if v_before is distinct from v_after then
      insert into public.consent_change_records (
        user_id, consent_key, prior_value, new_value, consent_model_version, source
      ) values (
        new.id, v_key, v_before, v_after, v_version, v_source
      );
    end if;
  end loop;
  return new;
exception when invalid_text_representation then
  raise exception 'telemetry consent flags and version must have valid scalar types'
    using errcode = '22023';
end;
$$;

drop trigger if exists record_telemetry_consent_changes on public.profiles;
create trigger record_telemetry_consent_changes
  after update of telemetry_consent on public.profiles
  for each row
  when (old.telemetry_consent is distinct from new.telemetry_consent)
  execute function public.record_telemetry_consent_changes();

drop function if exists public.set_my_telemetry_consent(jsonb, text);

create or replace function public.set_my_telemetry_consent(
  p_expected_user uuid,
  p_consent jsonb,
  p_source text default 'account'
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_key text;
  v_old jsonb;
  v_changed text[] := array[]::text[];
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_expected_user is null or v_uid <> p_expected_user then
    raise exception 'auth session changed before telemetry consent mutation';
  end if;
  if p_source is distinct from 'account' then
    raise exception 'authenticated consent source must be account' using errcode = '22023';
  end if;
  if p_consent is null or jsonb_typeof(p_consent) <> 'object' then
    raise exception 'consent must be an object' using errcode = '22023';
  end if;
  if (p_consent - array['essential', 'research', 'ai_prose', 'market', 'v']) <> '{}'::jsonb then
    raise exception 'consent contains unknown keys' using errcode = '22023';
  end if;
  foreach v_key in array array['essential', 'research', 'ai_prose', 'market'] loop
    if jsonb_typeof(p_consent -> v_key) is distinct from 'boolean' then
      raise exception 'consent key % must be boolean', v_key using errcode = '22023';
    end if;
  end loop;
  if jsonb_typeof(p_consent -> 'v') is distinct from 'number'
     or (p_consent ->> 'v')::numeric <> trunc((p_consent ->> 'v')::numeric)
     or (p_consent ->> 'v')::numeric not between 1 and 32767 then
    raise exception 'consent version must be a positive small integer' using errcode = '22023';
  end if;

  select telemetry_consent into v_old from public.profiles where id = v_uid for update;
  if not found then raise exception 'profile not found'; end if;
  foreach v_key in array array['essential', 'research', 'ai_prose', 'market'] loop
    if coalesce((v_old ->> v_key)::boolean, false)
       is distinct from (p_consent ->> v_key)::boolean then
      v_changed := array_append(v_changed, v_key);
    end if;
  end loop;

  perform set_config('app.telemetry_consent_source', 'account', true);
  update public.profiles
     set telemetry_consent = p_consent,
         updated_at = now()
   where id = v_uid;

  return jsonb_build_object(
    'ok', true,
    'consent', p_consent,
    'changed_keys', to_jsonb(v_changed)
  );
exception when invalid_text_representation then
  raise exception 'consent flags and version must have valid scalar types'
    using errcode = '22023';
end;
$$;

revoke all on function public.record_telemetry_consent_changes() from public, anon, authenticated, service_role;
revoke all on function public.set_my_telemetry_consent(uuid, jsonb, text) from public, anon;
grant execute on function public.set_my_telemetry_consent(uuid, jsonb, text) to authenticated;

-- ── 4. Message validation and direct-message primitive ───────────────────────────────

create or replace function public.insert_operator_direct_message(
  p_actor uuid,
  p_target uuid,
  p_sender_role text,
  p_class text,
  p_subject text,
  p_body text,
  p_template text default 'custom_service'
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_subject text := nullif(btrim(coalesce(p_subject, '')), '');
  v_body text := nullif(btrim(coalesce(p_body, '')), '');
  v_template text := coalesce(nullif(btrim(p_template), ''), 'custom_service');
  v_template_class text;
begin
  if p_target is null then raise exception 'target is required'; end if;
  if not exists (select 1 from public.profiles where id = p_target and deleted_at is null) then
    raise exception 'target profile not found or deleted';
  end if;
  if p_sender_role not in ('admin', 'developer', 'system') then
    raise exception 'invalid sender role' using errcode = '22023';
  end if;
  if p_class not in ('service', 'announcement') then
    raise exception 'invalid message class' using errcode = '22023';
  end if;
  if v_subject is null or length(v_subject) > 160 then
    raise exception 'subject must be between 1 and 160 characters' using errcode = '22023';
  end if;
  if v_body is null or length(v_body) > 10000 then
    raise exception 'body must be between 1 and 10000 characters' using errcode = '22023';
  end if;
  v_template_class := public.operator_message_class_for_template(v_template);
  if v_template_class is null then
    raise exception 'unknown operator message template: %', v_template using errcode = '22023';
  end if;
  if v_template_class is distinct from p_class then
    raise exception 'operator message template % requires class %, not %',
      v_template, v_template_class, p_class using errcode = '22023';
  end if;

  insert into public.operator_messages (
    kind, message_class, sender_role, sender_user_id, recipient_user_id,
    subject, body, template_key, status, sent_at
  ) values (
    'direct', p_class, p_sender_role, p_actor, p_target,
    v_subject, v_body, v_template, 'sent', now()
  ) returning id into v_id;

  insert into public.operator_message_receipts (message_id, user_id)
  values (v_id, p_target);
  return v_id;
end;
$$;

revoke all on function public.insert_operator_direct_message(uuid, uuid, text, text, text, text, text)
  from public, anon, authenticated, service_role;

create or replace function public.create_operator_direct_message(
  p_actor uuid,
  p_target uuid,
  p_class text,
  p_subject text,
  p_body text,
  p_template text default 'custom_service'
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_role text;
  v_id uuid;
begin
  select role into v_role from public.profiles where id = p_actor;
  if v_role not in ('admin', 'developer') then
    raise exception 'not authorized: direct operator messages require admin or developer';
  end if;
  if not public.account_is_active(p_actor) then
    raise exception 'operator account is not active';
  end if;
  v_id := public.insert_operator_direct_message(
    p_actor, p_target, v_role, p_class, p_subject, p_body, p_template
  );
  perform public.write_audit(
    p_action => 'create_operator_direct_message',
    p_target_user_id => p_target,
    p_target_type => 'operator_message',
    p_target_id => v_id::text,
    p_after => jsonb_build_object(
      'class', p_class,
      'template', coalesce(nullif(btrim(p_template), ''), 'custom_service')
    ),
    p_user_notified => true,
    p_actor_id => p_actor
  );
  return jsonb_build_object(
    'message_id', v_id,
    'recipient_user_id', p_target,
    'email_status', 'pending'
  );
end;
$$;

revoke all on function public.create_operator_direct_message(uuid, uuid, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.create_operator_direct_message(uuid, uuid, text, text, text, text)
  to service_role;

-- ── 5. Caller-scoped lazy inbox/read/unread/export RPCs ────────────────────────

create or replace function public.materialize_my_operator_broadcast_receipts(p_user_id uuid)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  insert into public.operator_message_receipts (message_id, user_id)
  select m.id, p_user_id
    from public.operator_messages m
    join public.profiles p on p.id = p_user_id
   where p.deleted_at is null
     and m.kind = 'broadcast'
     -- The Account copy is authoritative and cannot depend on the optional email
     -- courier. During the five-minute cancellation window it stays hidden; once
     -- send_after passes, a still-queued broadcast is committed to the inbox even
     -- when the disabled-by-default worker has never claimed its email job.
     and (
       m.status in ('sending', 'sent')
       or (m.status = 'queued' and m.send_after <= now())
     )
     and p.created_at <= m.audience_snapshot_at
  on conflict (message_id, user_id) do nothing
$$;

revoke all on function public.materialize_my_operator_broadcast_receipts(uuid)
  from public, anon, authenticated, service_role;

drop function if exists public.list_my_operator_messages(integer, timestamptz);

create or replace function public.list_my_operator_messages(
  p_limit integer default 100,
  p_before_created_at timestamptz default null,
  p_before_id uuid default null
)
returns table (
  id uuid,
  kind text,
  message_class text,
  sender_role text,
  subject text,
  body text,
  template_key text,
  created_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  dismissed_at timestamptz,
  email_status text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_limit integer := greatest(1, least(coalesce(p_limit, 100), 200));
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if (p_before_created_at is null) <> (p_before_id is null) then
    raise exception 'message cursor must be wholly null or wholly present'
      using errcode = '22023';
  end if;
  perform public.materialize_my_operator_broadcast_receipts(v_uid);
  return query
    select m.id, m.kind, m.message_class, m.sender_role, m.subject, m.body,
           m.template_key, m.created_at, r.delivered_at, r.read_at,
           r.dismissed_at, r.email_status
      from public.operator_message_receipts r
      join public.operator_messages m on m.id = r.message_id
       where r.user_id = v_uid
         and r.dismissed_at is null
       and (
         p_before_created_at is null
         or (m.created_at, m.id) < (p_before_created_at, p_before_id)
       )
     order by m.created_at desc, m.id desc
     limit v_limit;
end;
$$;

create or replace function public.get_my_operator_message(p_message_id uuid)
returns table (
  id uuid, kind text, message_class text, sender_role text, subject text, body text,
  template_key text, created_at timestamptz, delivered_at timestamptz,
  read_at timestamptz, dismissed_at timestamptz, email_status text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  perform public.materialize_my_operator_broadcast_receipts(v_uid);
  return query
    select m.id, m.kind, m.message_class, m.sender_role, m.subject, m.body,
           m.template_key, m.created_at, r.delivered_at, r.read_at,
           r.dismissed_at, r.email_status
      from public.operator_message_receipts r
      join public.operator_messages m on m.id = r.message_id
     where r.user_id = v_uid and m.id = p_message_id;
end;
$$;

create or replace function public.mark_operator_message_read(p_message_id uuid)
returns table (
  id uuid, kind text, message_class text, sender_role text, subject text, body text,
  template_key text, created_at timestamptz, delivered_at timestamptz,
  read_at timestamptz, dismissed_at timestamptz, email_status text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  perform public.materialize_my_operator_broadcast_receipts(v_uid);
  update public.operator_message_receipts r
     set read_at = coalesce(r.read_at, now())
   where r.message_id = p_message_id and r.user_id = v_uid;
  return query select * from public.get_my_operator_message(p_message_id);
end;
$$;

create or replace function public.dismiss_operator_message(p_message_id uuid)
returns table (
  id uuid, kind text, message_class text, sender_role text, subject text, body text,
  template_key text, created_at timestamptz, delivered_at timestamptz,
  read_at timestamptz, dismissed_at timestamptz, email_status text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  perform public.materialize_my_operator_broadcast_receipts(v_uid);
  update public.operator_message_receipts r
     set read_at = coalesce(r.read_at, now()),
         dismissed_at = coalesce(r.dismissed_at, now())
   where r.message_id = p_message_id and r.user_id = v_uid;
  return query select * from public.get_my_operator_message(p_message_id);
end;
$$;

create or replace function public.get_my_operator_unread_count()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_count integer;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  perform public.materialize_my_operator_broadcast_receipts(v_uid);
  select count(*)::integer into v_count
    from public.operator_message_receipts r
   where r.user_id = v_uid and r.read_at is null and r.dismissed_at is null;
  return v_count;
end;
$$;

create or replace function public.get_my_operator_service_export()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_messages jsonb;
  v_consent jsonb;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  perform public.materialize_my_operator_broadcast_receipts(v_uid);
  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at, x.id), '[]'::jsonb)
    into v_messages
    from (
      select m.id, m.kind, m.message_class, m.sender_role, m.subject, m.body,
             m.template_key, m.created_at, r.delivered_at, r.read_at, r.dismissed_at,
             r.email_status, r.email_delivered_at
        from public.operator_message_receipts r
        join public.operator_messages m on m.id = r.message_id
       where r.user_id = v_uid
    ) x;
  select coalesce(jsonb_agg(to_jsonb(c) order by c.created_at, c.id), '[]'::jsonb)
    into v_consent
    from (
      select r.id, r.consent_key, r.prior_value, r.new_value,
             r.consent_model_version, r.source, r.created_at
        from public.consent_change_records r
       where r.user_id = v_uid
    ) c;
  return jsonb_build_object(
    'operator_messages', v_messages,
    'consent_changes', v_consent
  );
end;
$$;

revoke all on function public.list_my_operator_messages(integer, timestamptz, uuid) from public, anon;
revoke all on function public.get_my_operator_message(uuid) from public, anon;
revoke all on function public.mark_operator_message_read(uuid) from public, anon;
revoke all on function public.dismiss_operator_message(uuid) from public, anon;
revoke all on function public.get_my_operator_unread_count() from public, anon;
revoke all on function public.get_my_operator_service_export() from public, anon;
grant execute on function public.list_my_operator_messages(integer, timestamptz, uuid) to authenticated;
grant execute on function public.get_my_operator_message(uuid) to authenticated;
grant execute on function public.mark_operator_message_read(uuid) to authenticated;
grant execute on function public.dismiss_operator_message(uuid) to authenticated;
grant execute on function public.get_my_operator_unread_count() to authenticated;
grant execute on function public.get_my_operator_service_export() to authenticated;

-- ── 6. Moderation atomics ───────────────────────────────────────────────────────────

create or replace function public.issue_warning_with_message(
  p_actor uuid,
  p_target uuid,
  p_severity text,
  p_reason text,
  p_message_subject text,
  p_message_body text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_warning uuid;
  v_message uuid;
  v_severity text := coalesce(nullif(btrim(p_severity), ''), 'notice');
  v_reason text := nullif(btrim(coalesce(p_reason, '')), '');
begin
  if not public.has_role(p_actor, array['support', 'admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if not public.account_is_active(p_actor) then
    raise exception 'operator account is not active';
  end if;
  if v_severity not in ('notice', 'minor', 'major', 'final') then
    raise exception 'invalid severity: %', v_severity;
  end if;
  if v_reason is null then raise exception 'a warning reason is required'; end if;
  insert into public.warnings (user_id, issued_by, severity, reason, user_notified)
  values (p_target, p_actor, v_severity, v_reason, true)
  returning id into v_warning;
  v_message := public.insert_operator_direct_message(
    p_actor, p_target, 'system', 'service', p_message_subject, p_message_body, 'warning'
  );
  perform public.write_audit(
    p_action => 'issue_warning', p_target_user_id => p_target,
    p_target_type => 'warning', p_target_id => v_warning::text,
    p_reason => v_reason,
    p_after => jsonb_build_object('severity', v_severity, 'message_id', v_message),
    p_user_notified => true, p_actor_id => p_actor
  );
  return jsonb_build_object('warning_id', v_warning, 'message_id', v_message);
end;
$$;

create or replace function public.set_account_banned_with_message(
  p_actor uuid,
  p_target uuid,
  p_banned boolean,
  p_reason text default null,
  p_message_subject text default null,
  p_message_body text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_was_banned boolean;
  v_message uuid;
begin
  if not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized: banning an account requires admin or developer';
  end if;
  if not public.account_is_active(p_actor) then
    raise exception 'operator account is not active';
  end if;
  if p_banned is null then raise exception 'banned flag is required'; end if;
  select banned_at is not null into v_was_banned
    from public.profiles where id = p_target for update;
  if not found then raise exception 'target profile not found'; end if;

  update public.profiles
     set banned_at = case when p_banned then now() else null end,
         updated_at = now()
   where id = p_target;
  if p_banned then
    v_message := public.insert_operator_direct_message(
      p_actor, p_target, 'system', 'service', p_message_subject, p_message_body, 'ban_notice'
    );
  end if;
  perform public.write_audit(
    p_action => case when p_banned then 'ban_account' else 'unban_account' end,
    p_target_user_id => p_target,
    p_target_type => 'profile', p_target_id => p_target::text,
    p_reason => nullif(btrim(coalesce(p_reason, '')), ''),
    p_before => jsonb_build_object('banned', v_was_banned),
    p_after => jsonb_build_object('banned', p_banned, 'message_id', v_message),
    p_user_notified => p_banned, p_actor_id => p_actor
  );
  return jsonb_build_object('banned', p_banned, 'message_id', v_message);
end;
$$;

revoke all on function public.issue_warning_with_message(uuid, uuid, text, text, text, text)
  from public, anon, authenticated;
revoke all on function public.set_account_banned_with_message(uuid, uuid, boolean, text, text, text)
  from public, anon, authenticated;
grant execute on function public.issue_warning_with_message(uuid, uuid, text, text, text, text)
  to service_role;
grant execute on function public.set_account_banned_with_message(uuid, uuid, boolean, text, text, text)
  to service_role;

-- Close the pre-194 service seams: a warning/ban that bypasses its Account
-- message would violate the atomic outward-notice contract. Historical tests may
-- still exercise migration 053 in isolation, but the net schema exposes only the
-- message-bearing replacements above.
revoke all on function public.issue_warning(uuid, uuid, text, text, boolean)
  from public, anon, authenticated, service_role;
revoke all on function public.set_account_banned(uuid, uuid, boolean, text)
  from public, anon, authenticated, service_role;

-- ── 7. Broadcast queue, cancellation, and admin listing ───────────────────────────

create or replace function public.queue_operator_broadcast(
  p_actor uuid,
  p_class text,
  p_subject text,
  p_body text,
  p_template text,
  p_audience text,
  p_two_key_amr_age_s integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_role text;
  v_id uuid;
  v_job uuid;
  v_now timestamptz := now();
  v_send_after timestamptz := v_now + interval '5 minutes';
  v_count integer;
  v_subject text := nullif(btrim(coalesce(p_subject, '')), '');
  v_body text := nullif(btrim(coalesce(p_body, '')), '');
  v_template text := coalesce(nullif(btrim(p_template), ''), 'custom_service');
  v_template_class text;
begin
  select role into v_role from public.profiles where id = p_actor;
  if v_role not in ('admin', 'developer') then raise exception 'not authorized'; end if;
  if not public.account_is_active(p_actor) then raise exception 'operator account is not active'; end if;
  if p_audience is distinct from 'all' then raise exception 'broadcast audience must be all'; end if;
  if p_two_key_amr_age_s is null or p_two_key_amr_age_s not between 0 and 300 then
    raise exception 'fresh password verification is required';
  end if;
  if p_class not in ('service', 'announcement') then raise exception 'invalid message class'; end if;
  if v_subject is null or length(v_subject) > 160 then raise exception 'invalid subject'; end if;
  if v_body is null or length(v_body) > 10000 then raise exception 'invalid body'; end if;
  v_template_class := public.operator_message_class_for_template(v_template);
  if v_template_class is null then
    raise exception 'unknown operator message template: %', v_template using errcode = '22023';
  end if;
  if v_template_class is distinct from p_class then
    raise exception 'operator message template % requires class %, not %',
      v_template, v_template_class, p_class using errcode = '22023';
  end if;

  select count(*)::integer into v_count
    from public.profiles p
   where p.created_at <= v_now and p.deleted_at is null;
  insert into public.operator_messages (
    kind, message_class, sender_role, sender_user_id, subject, body, template_key,
    audience, status, audience_snapshot_at, audience_count, created_at, send_after
  ) values (
    'broadcast', p_class, v_role, p_actor, v_subject, v_body, v_template,
    'all', 'queued', v_now, v_count, v_now, v_send_after
  ) returning id into v_id;
  insert into public.operator_message_delivery_jobs (
    message_id, audience_snapshot_at, next_attempt_at
  ) values (v_id, v_now, v_send_after)
  returning id into v_job;
  perform public.write_audit(
    p_action => 'queue_operator_broadcast', p_target_type => 'operator_message',
    p_target_id => v_id::text,
    p_after => jsonb_build_object(
      'class', p_class, 'template', v_template, 'audience', 'all',
      'audience_count', v_count, 'job_id', v_job, 'send_after', v_send_after
    ),
    p_user_notified => false, p_actor_id => p_actor
  );
  return jsonb_build_object(
    'message_id', v_id, 'job_id', v_job, 'status', 'queued',
    'send_after', v_send_after, 'audience_count', v_count
  );
end;
$$;

create or replace function public.cancel_operator_broadcast(p_actor uuid, p_message_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_now timestamptz := now();
begin
  if not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if not public.account_is_active(p_actor) then raise exception 'operator account is not active'; end if;
  update public.operator_messages
     set status = 'canceled', canceled_at = v_now
   where id = p_message_id and kind = 'broadcast' and status = 'queued'
     and v_now < send_after;
  if not found then raise exception 'broadcast is not cancelable'; end if;
  update public.operator_message_delivery_jobs
     set status = 'canceled', completed_at = v_now, updated_at = v_now,
         lease_token = null, lease_expires_at = null
   where message_id = p_message_id;
  perform public.write_audit(
    p_action => 'cancel_operator_broadcast', p_target_type => 'operator_message',
    p_target_id => p_message_id::text,
    p_after => jsonb_build_object('status', 'canceled'), p_actor_id => p_actor
  );
  return jsonb_build_object(
    'message_id', p_message_id, 'status', 'canceled', 'canceled_at', v_now
  );
end;
$$;

create or replace function public.list_operator_broadcasts(p_limit integer default 25)
returns table (
  id uuid, subject text, message_class text, template_key text, status text,
  created_at timestamptz, send_after timestamptz, canceled_at timestamptz,
  audience_count integer, processed_count integer, sent_count integer,
  failed_count integer, skipped_count integer
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select m.id, m.subject, m.message_class, m.template_key, m.status,
         m.created_at, m.send_after, m.canceled_at, m.audience_count,
         count(r.*)::integer,
         count(*) filter (where r.email_status = 'sent')::integer,
         count(*) filter (where r.email_status = 'failed')::integer,
         count(*) filter (where r.email_status = 'skipped')::integer
    from public.operator_messages m
    left join public.operator_message_receipts r on r.message_id = m.id
   where m.kind = 'broadcast'
   group by m.id
   order by m.created_at desc, m.id desc
   limit greatest(1, least(coalesce(p_limit, 25), 100))
$$;

revoke all on function public.queue_operator_broadcast(uuid, text, text, text, text, text, integer)
  from public, anon, authenticated;
revoke all on function public.cancel_operator_broadcast(uuid, uuid) from public, anon, authenticated;
revoke all on function public.list_operator_broadcasts(integer) from public, anon, authenticated;
grant execute on function public.queue_operator_broadcast(uuid, text, text, text, text, text, integer)
  to service_role;
grant execute on function public.cancel_operator_broadcast(uuid, uuid) to service_role;
grant execute on function public.list_operator_broadcasts(integer) to service_role;

-- ── 8. Lease-safe worker batch/page/advance/fail ──────────────────────────────────

create or replace function public.claim_operator_message_delivery_jobs(
  p_limit integer,
  p_lease_seconds integer
)
returns table (
  job_id uuid,
  message_id uuid,
  lease_token uuid,
  message_class text,
  subject text,
  body text,
  audience_snapshot_at timestamptz,
  cursor_created_at timestamptz,
  cursor_user_id uuid
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  r record;
  v_limit integer := greatest(1, least(coalesce(p_limit, 4), 25));
  v_lease integer := greatest(30, least(coalesce(p_lease_seconds, 240), 900));
  v_token uuid;
begin
  for r in
    select j.id, j.message_id, j.audience_snapshot_at, j.attempts,
           j.status as prior_status, j.lease_token as prior_lease_token,
           j.cursor_created_at, j.cursor_user_id,
           m.message_class, m.subject, m.body
      from public.operator_message_delivery_jobs j
      join public.operator_messages m on m.id = j.message_id
     where m.kind = 'broadcast'
       and m.status in ('queued', 'sending')
       and m.send_after <= now()
       and (
         (j.status in ('pending', 'retry') and j.next_attempt_at <= now())
         or (j.status = 'processing' and j.lease_expires_at <= now())
       )
     order by j.next_attempt_at, j.created_at, j.id
     limit v_limit
     for update of j skip locked
  loop
    -- Taking over an expired job lease must never make an in-flight provider
    -- attempt eligible again. The old worker may have reached the provider even
    -- if it never recorded a result, so the only honest terminal state is
    -- delivery_outcome_unknown. The job row is already locked; result recording
    -- takes the same lock first, making the late-result/takeover race atomic.
    if r.prior_status = 'processing' then
      update public.operator_message_receipts receipt
         set email_status = 'failed',
             email_delivered_at = null,
             email_failure_reason = 'delivery_outcome_unknown',
             email_attempt_token = null,
             email_job_lease_token = null
       where receipt.message_id = r.message_id
         and receipt.email_status = 'sending'
         and receipt.email_job_lease_token = r.prior_lease_token;
    end if;

    -- A worker that crashes while holding its eighth lease must not strand the
    -- row in expired `processing` forever. Retire it before considering another
    -- claim; the in-account broadcast remains authoritative and visible.
    if r.attempts >= 8 then
      update public.operator_message_delivery_jobs j
         set status = 'failed', lease_token = null, lease_expires_at = null,
             last_error = coalesce(j.last_error, 'delivery lease expired at retry limit'),
             updated_at = now()
       where j.id = r.id;
      update public.operator_messages
         set status = 'sent', sent_at = now()
       where id = r.message_id and status in ('queued', 'sending');
      continue;
    end if;
    v_token := gen_random_uuid();
    update public.operator_message_delivery_jobs j
       set status = 'processing', lease_token = v_token,
           lease_expires_at = now() + make_interval(secs => v_lease),
           attempts = j.attempts + 1, updated_at = now(), last_error = null
     where j.id = r.id;
    update public.operator_messages
       set status = 'sending'
     where id = r.message_id and status = 'queued';
    job_id := r.id;
    message_id := r.message_id;
    lease_token := v_token;
    message_class := r.message_class;
    subject := r.subject;
    body := r.body;
    audience_snapshot_at := r.audience_snapshot_at;
    cursor_created_at := r.cursor_created_at;
    cursor_user_id := r.cursor_user_id;
    return next;
  end loop;
end;
$$;

create or replace function public.renew_operator_message_delivery_job_lease(
  p_job_id uuid,
  p_lease_token uuid,
  p_lease_seconds integer default 240
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_job public.operator_message_delivery_jobs%rowtype;
  v_lease integer := greatest(30, least(coalesce(p_lease_seconds, 240), 900));
  v_expires timestamptz;
begin
  select * into v_job
    from public.operator_message_delivery_jobs
   where id = p_job_id
   for update;
  if not found
     or v_job.status <> 'processing'
     or v_job.lease_token is distinct from p_lease_token
     or v_job.lease_expires_at <= now() then
    raise exception 'delivery job lease is not active';
  end if;
  v_expires := now() + make_interval(secs => v_lease);
  update public.operator_message_delivery_jobs
     set lease_expires_at = v_expires, updated_at = now()
   where id = p_job_id;
  return jsonb_build_object(
    'job_id', p_job_id,
    'lease_token', p_lease_token,
    'lease_expires_at', v_expires
  );
end;
$$;

create or replace function public.page_operator_message_recipients(
  p_job_id uuid,
  p_lease_token uuid,
  p_after_created_at timestamptz default null,
  p_after_user_id uuid default null,
  p_limit integer default 100
)
returns table (
  user_id uuid,
  email text,
  created_at timestamptz,
  email_eligible boolean,
  unsubscribe_token uuid
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_job public.operator_message_delivery_jobs%rowtype;
  v_class text;
  v_limit integer := greatest(1, least(coalesce(p_limit, 100), 500));
begin
  select j.* into v_job
    from public.operator_message_delivery_jobs j
   where j.id = p_job_id;
  if not found
     or v_job.status <> 'processing'
     or v_job.lease_token is distinct from p_lease_token
     or v_job.lease_expires_at <= now() then
    raise exception 'delivery job lease is not active';
  end if;
  if p_after_created_at is distinct from v_job.cursor_created_at
     or p_after_user_id is distinct from v_job.cursor_user_id then
    raise exception 'recipient cursor does not match the claimed job';
  end if;
  select m.message_class into v_class
    from public.operator_messages m where m.id = v_job.message_id;

  -- Materialize only this bounded page. The stable audience is the queue-time
  -- profile set, ordered by (created_at,id); later signups can never enter it.
  with recipients as materialized (
    select p.id, p.email, p.created_at, p.disabled_at, p.banned_at,
           ep.product_updates, ep.product_updates_decided_at, ep.unsubscribe_token
      from public.profiles p
      left join public.email_preferences ep on ep.user_id = p.id
     where p.created_at <= v_job.audience_snapshot_at
       and p.deleted_at is null
       and (
         v_job.cursor_created_at is null
         or (p.created_at, p.id) > (v_job.cursor_created_at, v_job.cursor_user_id)
       )
     order by p.created_at, p.id
     limit v_limit
  )
  insert into public.operator_message_receipts (
    message_id, user_id, email_status, email_attempted_at, email_failure_reason
  )
  select v_job.message_id, r.id,
         case
           when r.email is null or position('@' in r.email) = 0 then 'skipped'
           when r.disabled_at is not null or r.banned_at is not null then 'skipped'
           when v_class = 'announcement'
                and not coalesce(r.product_updates and r.product_updates_decided_at is not null, false)
             then 'skipped'
           else 'pending'
         end,
         case
           when r.email is null or position('@' in r.email) = 0
             or r.disabled_at is not null or r.banned_at is not null
             or (v_class = 'announcement'
                 and not coalesce(r.product_updates and r.product_updates_decided_at is not null, false))
           then now() else null
         end,
         case
           when r.email is null or position('@' in r.email) = 0 then 'no_email_on_account'
           when r.disabled_at is not null or r.banned_at is not null then 'account_inactive'
           when v_class = 'announcement'
                and not coalesce(r.product_updates and r.product_updates_decided_at is not null, false)
             then 'announcement_opt_out'
           else null
         end
    from recipients r
  on conflict on constraint operator_message_receipts_pkey do update
    set email_status = excluded.email_status,
        email_attempted_at = excluded.email_attempted_at,
        email_failure_reason = excluded.email_failure_reason
  where operator_message_receipts.email_status = 'pending'
    and excluded.email_status = 'skipped';

  -- Read the page again after materialization so receipt status is part of the
  -- eligibility verdict. A terminal receipt still participates in cursor advance
  -- but can never be sent twice after a worker crash-before-advance.
  return query
    with recipients as materialized (
      select p.id, p.email, p.created_at, p.disabled_at, p.banned_at,
             ep.product_updates, ep.product_updates_decided_at, ep.unsubscribe_token
        from public.profiles p
        left join public.email_preferences ep on ep.user_id = p.id
       where p.created_at <= v_job.audience_snapshot_at
         and p.deleted_at is null
         and (
           v_job.cursor_created_at is null
           or (p.created_at, p.id) > (v_job.cursor_created_at, v_job.cursor_user_id)
         )
       order by p.created_at, p.id
       limit v_limit
    )
    select r.id, r.email, r.created_at,
           (
             receipt.email_status = 'pending'
             and r.email is not null and position('@' in r.email) > 0
             and r.disabled_at is null and r.banned_at is null
             and (
               v_class = 'service'
               or coalesce(r.product_updates and r.product_updates_decided_at is not null, false)
             )
           ) as email_eligible,
           case
             when receipt.email_status = 'pending'
               and v_class = 'announcement'
               and coalesce(r.product_updates and r.product_updates_decided_at is not null, false)
             then r.unsubscribe_token
             else null
           end
      from recipients r
      join public.operator_message_receipts receipt
        on receipt.message_id = v_job.message_id and receipt.user_id = r.id
     order by r.created_at, r.id;
end;
$$;

create or replace function public.claim_operator_message_recipient(
  p_job_id uuid,
  p_lease_token uuid,
  p_user_id uuid
)
returns table (
  claimed boolean,
  attempt_token uuid,
  email text,
  unsubscribe_token uuid,
  email_idempotency_key uuid
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_job public.operator_message_delivery_jobs%rowtype;
  v_recipient record;
  v_reason text;
  v_attempt uuid := gen_random_uuid();
  v_idempotency uuid;
begin
  -- Lock job before receipt everywhere in this state machine. A late terminal
  -- result and an expired-lease takeover therefore cannot each win half a race.
  select j.* into v_job
    from public.operator_message_delivery_jobs j
    join public.operator_messages m on m.id = j.message_id
   where j.id = p_job_id and m.kind = 'broadcast'
   for update of j;
  if not found
     or v_job.status <> 'processing'
     or v_job.lease_token is distinct from p_lease_token
     or v_job.lease_expires_at <= now() then
    raise exception 'delivery job lease is not active';
  end if;
  if p_user_id is null then raise exception 'recipient is required'; end if;

  -- Consent and account status are checked at the attempt boundary, not trusted
  -- from the earlier discovery page. An unsubscribe between page and send wins.
  select p.email as account_email, p.disabled_at, p.banned_at,
         m.message_class,
         ep.product_updates, ep.product_updates_decided_at,
         ep.unsubscribe_token as account_unsubscribe_token
    into v_recipient
    from public.profiles p
    join public.operator_messages m on m.id = v_job.message_id
    left join public.email_preferences ep on ep.user_id = p.id
   where p.id = p_user_id
     and p.created_at <= v_job.audience_snapshot_at
     and p.deleted_at is null;

  claimed := false;
  attempt_token := null;
  email := null;
  unsubscribe_token := null;
  email_idempotency_key := null;
  if not found then return next; return; end if;

  v_reason := case
    when v_recipient.account_email is null
         or position('@' in v_recipient.account_email) = 0
      then 'no_email_on_account'
    when v_recipient.disabled_at is not null or v_recipient.banned_at is not null
      then 'account_inactive'
    when v_recipient.message_class = 'announcement'
         and not coalesce(
           v_recipient.product_updates
           and v_recipient.product_updates_decided_at is not null,
           false
         )
      then 'announcement_opt_out'
    when v_recipient.message_class = 'announcement'
         and v_recipient.account_unsubscribe_token is null
      then 'unsubscribe_token_unavailable'
    else null
  end;

  if v_reason is not null then
    update public.operator_message_receipts receipt
       set email_status = 'skipped',
           email_attempted_at = now(),
           email_delivered_at = null,
           email_failure_reason = v_reason,
           email_attempt_token = null,
           email_job_lease_token = null
     where receipt.message_id = v_job.message_id
       and receipt.user_id = p_user_id
       and receipt.email_status = 'pending';
    return next;
    return;
  end if;

  update public.operator_message_receipts receipt
     set email_status = 'sending',
         email_attempted_at = now(),
         email_delivered_at = null,
         email_failure_reason = null,
         email_attempt_token = v_attempt,
         email_job_lease_token = p_lease_token
   where receipt.message_id = v_job.message_id
     and receipt.user_id = p_user_id
     and receipt.email_status = 'pending'
  returning receipt.email_idempotency_key into v_idempotency;
  if not found then return next; return; end if;

  claimed := true;
  attempt_token := v_attempt;
  email := v_recipient.account_email;
  unsubscribe_token := case
    when v_recipient.message_class = 'announcement'
      then v_recipient.account_unsubscribe_token
    else null
  end;
  email_idempotency_key := v_idempotency;
  return next;
end;
$$;

create or replace function public.record_operator_message_email_result(
  p_message_id uuid,
  p_user_id uuid,
  p_status text,
  p_provider text default null,
  p_provider_id text default null,
  p_failure_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_status text;
  v_kind text;
  v_reason text := nullif(btrim(coalesce(p_failure_reason, '')), '');
  v_now timestamptz := now();
begin
  if p_status not in ('sent', 'failed', 'skipped') then
    raise exception 'invalid email result status';
  end if;
  if p_status <> 'sent' and v_reason is null then
    raise exception 'a failure reason is required';
  end if;
  if length(coalesce(p_provider, '')) > 80
     or length(coalesce(p_provider_id, '')) > 255
     or length(coalesce(v_reason, '')) > 500 then
    raise exception 'email result metadata is too long';
  end if;
  select m.kind into v_kind
    from public.operator_messages m
   where m.id = p_message_id;
  if v_kind = 'broadcast' then
    raise exception 'broadcast email results require a lease-bound delivery attempt';
  end if;
  update public.operator_message_receipts r
     set email_status = p_status,
         email_attempted_at = v_now,
         email_delivered_at = case when p_status = 'sent' then v_now else null end,
         email_provider = nullif(btrim(coalesce(p_provider, '')), ''),
         email_provider_id = nullif(btrim(coalesce(p_provider_id, '')), ''),
         email_failure_reason = case when p_status = 'sent' then null else v_reason end
   where r.message_id = p_message_id and r.user_id = p_user_id
     and v_kind = 'direct'
     and r.email_status = 'pending';
  if not found then
    -- Account deletion can race an external send, and a worker retry can replay a
    -- page after its prior results committed. Never recreate a purged receipt and
    -- never downgrade a terminal result.
    select r.email_status, r.email_delivered_at into v_status, v_now
      from public.operator_message_receipts r
     where r.message_id = p_message_id and r.user_id = p_user_id;
    return jsonb_build_object(
      'recorded', false, 'message_id', p_message_id, 'user_id', p_user_id,
      'email_status', v_status, 'email_delivered_at', v_now
    );
  end if;
  v_status := p_status;
  return jsonb_build_object(
    'recorded', true, 'message_id', p_message_id, 'user_id', p_user_id,
    'email_status', v_status,
    'email_delivered_at', case when p_status = 'sent' then v_now else null end
  );
end;
$$;

create or replace function public.record_operator_message_delivery_result(
  p_job_id uuid,
  p_lease_token uuid,
  p_user_id uuid,
  p_attempt_token uuid,
  p_status text,
  p_provider text default null,
  p_provider_id text default null,
  p_failure_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_job public.operator_message_delivery_jobs%rowtype;
  v_reason text := nullif(btrim(coalesce(p_failure_reason, '')), '');
  v_now timestamptz := now();
begin
  if p_status not in ('sent', 'failed', 'skipped') then
    raise exception 'invalid email result status';
  end if;
  if p_status <> 'sent' and v_reason is null then
    raise exception 'a failure reason is required';
  end if;
  if p_attempt_token is null then raise exception 'attempt token is required'; end if;
  if length(coalesce(p_provider, '')) > 80
     or length(coalesce(p_provider_id, '')) > 255
     or length(coalesce(v_reason, '')) > 500 then
    raise exception 'email result metadata is too long';
  end if;

  -- Deliberately do not reject solely because lease_expires_at passed. The job
  -- lock serializes this with takeover: a valid late provider result may win up
  -- to the instant a reclaimer terminalizes it as delivery_outcome_unknown.
  select j.* into v_job
    from public.operator_message_delivery_jobs j
    join public.operator_messages m on m.id = j.message_id
   where j.id = p_job_id and m.kind = 'broadcast'
   for update of j;
  if not found
     or v_job.status <> 'processing'
     or v_job.lease_token is distinct from p_lease_token then
    raise exception 'delivery job attempt is not current';
  end if;

  update public.operator_message_receipts receipt
     set email_status = p_status,
         email_delivered_at = case when p_status = 'sent' then v_now else null end,
         email_provider = nullif(btrim(coalesce(p_provider, '')), ''),
         email_provider_id = nullif(btrim(coalesce(p_provider_id, '')), ''),
         email_failure_reason = case when p_status = 'sent' then null else v_reason end,
         email_attempt_token = null,
         email_job_lease_token = null
   where receipt.message_id = v_job.message_id
     and receipt.user_id = p_user_id
     and receipt.email_status = 'sending'
     and receipt.email_attempt_token = p_attempt_token
     and receipt.email_job_lease_token = p_lease_token;
  if not found then
    raise exception 'recipient delivery attempt is not active';
  end if;

  return jsonb_build_object(
    'recorded', true,
    'job_id', p_job_id,
    'message_id', v_job.message_id,
    'user_id', p_user_id,
    'email_status', p_status,
    'email_delivered_at', case when p_status = 'sent' then v_now else null end
  );
end;
$$;

create or replace function public.advance_operator_message_delivery_job(
  p_job_id uuid,
  p_lease_token uuid,
  p_cursor_created_at timestamptz,
  p_cursor_user_id uuid,
  p_done boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_job public.operator_message_delivery_jobs%rowtype;
  v_now timestamptz := now();
begin
  select * into v_job from public.operator_message_delivery_jobs
   where id = p_job_id for update;
  if not found or v_job.status <> 'processing'
     or v_job.lease_token is distinct from p_lease_token
     or v_job.lease_expires_at <= v_now then
    raise exception 'delivery job lease is not active';
  end if;
  if (p_cursor_created_at is null) <> (p_cursor_user_id is null) then
    raise exception 'recipient cursor must be wholly null or wholly present';
  end if;
  if v_job.cursor_created_at is not null and p_cursor_created_at is not null
     and (p_cursor_created_at, p_cursor_user_id)
         < (v_job.cursor_created_at, v_job.cursor_user_id) then
    raise exception 'recipient cursor cannot move backward';
  end if;
  if coalesce(p_done, false) is false
     and (p_cursor_created_at is null
          or (p_cursor_created_at, p_cursor_user_id)
             is not distinct from (v_job.cursor_created_at, v_job.cursor_user_id)) then
    raise exception 'an unfinished page must advance the recipient cursor';
  end if;
  if exists (
    select 1
      from public.operator_message_receipts receipt
     where receipt.message_id = v_job.message_id
       and receipt.email_status = 'sending'
  ) then
    raise exception 'recipient delivery attempt is still in flight';
  end if;

  update public.operator_message_delivery_jobs
     set status = case when coalesce(p_done, false) then 'completed' else 'pending' end,
         cursor_created_at = p_cursor_created_at,
         cursor_user_id = p_cursor_user_id,
         lease_token = null, lease_expires_at = null,
         -- attempts counts consecutive failures at this cursor, not successful
         -- pages. Without this reset a healthy broadcast would be retired after
         -- eight batches (800 recipients at the default page size).
         attempts = 0,
         next_attempt_at = v_now, last_error = null,
         completed_at = case when coalesce(p_done, false) then v_now else null end,
         updated_at = v_now
   where id = p_job_id;
  if coalesce(p_done, false) then
    update public.operator_messages
       set status = 'sent', sent_at = v_now
     where id = v_job.message_id and status = 'sending';
  end if;
  return jsonb_build_object(
    'job_id', p_job_id,
    'status', case when coalesce(p_done, false) then 'completed' else 'pending' end,
    'cursor_created_at', p_cursor_created_at,
    'cursor_user_id', p_cursor_user_id,
    'completed_at', case when coalesce(p_done, false) then v_now else null end
  );
end;
$$;

create or replace function public.fail_operator_message_delivery_job(
  p_job_id uuid,
  p_lease_token uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_job public.operator_message_delivery_jobs%rowtype;
  v_reason text := nullif(btrim(coalesce(p_reason, '')), '');
  v_status text;
  v_next timestamptz;
begin
  if v_reason is null or length(v_reason) > 500 then
    raise exception 'failure reason must be between 1 and 500 characters';
  end if;
  select * into v_job from public.operator_message_delivery_jobs
   where id = p_job_id for update;
  if not found or v_job.status <> 'processing'
     or v_job.lease_token is distinct from p_lease_token
     or v_job.lease_expires_at <= now() then
    raise exception 'delivery job lease is not active';
  end if;
  -- Releasing a job that owns a provider attempt cannot put that attempt back on
  -- the queue. Whether the provider accepted it is unknowable, so fail closed.
  update public.operator_message_receipts receipt
     set email_status = 'failed',
         email_delivered_at = null,
         email_failure_reason = 'delivery_outcome_unknown',
         email_attempt_token = null,
         email_job_lease_token = null
   where receipt.message_id = v_job.message_id
     and receipt.email_status = 'sending'
     and receipt.email_job_lease_token = p_lease_token;
  v_status := case when v_job.attempts >= 8 then 'failed' else 'retry' end;
  v_next := now() + make_interval(
    secs => least(3600, (30 * power(2::numeric, greatest(v_job.attempts - 1, 0)))::integer)
  );
  update public.operator_message_delivery_jobs
     set status = v_status, lease_token = null, lease_expires_at = null,
         last_error = v_reason, next_attempt_at = v_next, updated_at = now()
   where id = p_job_id;
  if v_status = 'failed' then
    update public.operator_messages
       set status = 'sent', sent_at = now()
     where id = v_job.message_id and status = 'sending';
  end if;
  return jsonb_build_object(
    'job_id', p_job_id, 'status', v_status,
    'attempt_count', v_job.attempts,
    'next_attempt_at', v_next, 'last_error', v_reason
  );
end;
$$;

revoke all on function public.claim_operator_message_delivery_jobs(integer, integer)
  from public, anon, authenticated;
revoke all on function public.renew_operator_message_delivery_job_lease(uuid, uuid, integer)
  from public, anon, authenticated;
revoke all on function public.page_operator_message_recipients(uuid, uuid, timestamptz, uuid, integer)
  from public, anon, authenticated;
revoke all on function public.claim_operator_message_recipient(uuid, uuid, uuid)
  from public, anon, authenticated;
revoke all on function public.record_operator_message_email_result(uuid, uuid, text, text, text, text)
  from public, anon, authenticated;
revoke all on function public.record_operator_message_delivery_result(
  uuid, uuid, uuid, uuid, text, text, text, text
) from public, anon, authenticated;
revoke all on function public.advance_operator_message_delivery_job(uuid, uuid, timestamptz, uuid, boolean)
  from public, anon, authenticated;
revoke all on function public.fail_operator_message_delivery_job(uuid, uuid, text)
  from public, anon, authenticated;
grant execute on function public.claim_operator_message_delivery_jobs(integer, integer) to service_role;
grant execute on function public.renew_operator_message_delivery_job_lease(uuid, uuid, integer)
  to service_role;
grant execute on function public.page_operator_message_recipients(uuid, uuid, timestamptz, uuid, integer)
  to service_role;
grant execute on function public.claim_operator_message_recipient(uuid, uuid, uuid)
  to service_role;
grant execute on function public.record_operator_message_email_result(uuid, uuid, text, text, text, text)
  to service_role;
grant execute on function public.record_operator_message_delivery_result(
  uuid, uuid, uuid, uuid, text, text, text, text
) to service_role;
grant execute on function public.advance_operator_message_delivery_job(uuid, uuid, timestamptz, uuid, boolean)
  to service_role;
grant execute on function public.fail_operator_message_delivery_job(uuid, uuid, text) to service_role;

-- ── 9. Typed support ownership link, unchanged create_ticket arity ────────────────────

alter table public.support_messages
  add column if not exists operator_message_id uuid
    references public.operator_messages(id) on delete set null;
create index if not exists support_messages_operator_message_idx
  on public.support_messages (operator_message_id)
  where operator_message_id is not null;

create or replace function public.create_ticket(
  p_actor uuid,
  p_subject text,
  p_message text,
  p_email text,
  p_category text default 'general',
  p_priority text default 'normal',
  p_links jsonb default '{}'::jsonb,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_number text;
  v_subject text := nullif(btrim(coalesce(p_subject, '')), '');
  v_message text := nullif(btrim(coalesce(p_message, '')), '');
  v_cat text := coalesce(nullif(btrim(p_category), ''), 'general');
  v_pri text := coalesce(nullif(btrim(p_priority), ''), 'normal');
  v_link_text text;
  v_meta_text text;
  v_operator_message uuid;
begin
  if p_actor is null then raise exception 'an actor is required'; end if;
  if not public.account_is_active(p_actor) then
    raise exception 'account is not active' using errcode = 'check_violation';
  end if;
  if v_subject is null then raise exception 'a subject is required'; end if;
  if v_message is null then raise exception 'a message is required'; end if;
  v_link_text := nullif(p_links ->> 'operator_message_id', '');
  v_meta_text := nullif(p_metadata ->> 'operator_message_id', '');
  if v_link_text is not null and v_meta_text is not null
     and v_link_text is distinct from v_meta_text then
    raise exception 'operator message links disagree' using errcode = '22023';
  end if;
  begin
    v_operator_message := coalesce(v_link_text, v_meta_text)::uuid;
  exception when invalid_text_representation then
    raise exception 'operator message link is not a uuid' using errcode = '22023';
  end;
  if v_operator_message is not null and not exists (
    select 1
      from public.operator_message_receipts r
      join public.operator_messages m on m.id = r.message_id
     where r.message_id = v_operator_message
       and r.user_id = p_actor
       and m.kind = 'direct'
  ) then
    raise exception 'operator message is not a direct message visible to this account';
  end if;

  insert into public.support_messages (
    user_id, email, subject, message, status, category, priority,
    settlement_id, campaign_id, map_id, payment_ref, pdf_ref,
    generation_ref, gallery_ref, metadata, operator_message_id
  ) values (
    p_actor, coalesce(nullif(btrim(p_email), ''), 'unknown'),
    v_subject, v_message, 'new', v_cat, v_pri,
    nullif(p_links->>'settlement_id', '')::uuid,
    nullif(p_links->>'campaign_id', '')::uuid,
    nullif(p_links->>'map_id', '')::uuid,
    nullif(p_links->>'payment_ref', ''), nullif(p_links->>'pdf_ref', ''),
    nullif(p_links->>'generation_ref', ''), nullif(p_links->>'gallery_ref', ''),
    coalesce(p_metadata, '{}'::jsonb) - 'operator_message_id', v_operator_message
  ) returning id, ticket_number into v_id, v_number;
  return jsonb_build_object(
    'id', v_id, 'ticket_number', v_number, 'status', 'new',
    'operator_message_id', v_operator_message
  );
end;
$$;

revoke all on function public.create_ticket(uuid, text, text, text, text, text, jsonb, jsonb)
  from public, anon, authenticated;
grant execute on function public.create_ticket(uuid, text, text, text, text, text, jsonb, jsonb)
  to service_role;

-- ── 10. Profile soft-deletion purge (broadcast rows survive) ────────────────────────

create or replace function public.purge_operator_records_on_profile_deletion()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.deleted_at is null and new.deleted_at is not null then
    delete from public.operator_message_receipts where user_id = new.id;
    delete from public.operator_messages
     where kind = 'direct' and recipient_user_id = new.id;
    delete from public.consent_change_records where user_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists purge_operator_records_on_profile_deletion on public.profiles;
create trigger purge_operator_records_on_profile_deletion
  after update of deleted_at on public.profiles
  for each row execute function public.purge_operator_records_on_profile_deletion();

revoke all on function public.purge_operator_records_on_profile_deletion()
  from public, anon, authenticated, service_role;

-- ── 11. Disabled-by-default cron dispatcher ───────────────────────────────────────

insert into public.system_config (key, value)
values ('operator_message_delivery_cron', jsonb_build_object(
  'enabled', false,
  'url', null,
  'secret', null,
  'maxJobsPerRun', 4,
  'recipientBatchSize', 100,
  'leaseSeconds', 240,
  'note', 'Operator Messages courier. Intentionally disabled and inert until an owner configures the deployed operator-message-worker URL and matching OPERATOR_MESSAGE_CRON_SECRET, then explicitly sets enabled=true.'
))
on conflict (key) do nothing;

create or replace function public.run_operator_message_delivery()
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_config jsonb;
  v_request bigint;
begin
  select value into v_config from public.system_config
   where key = 'operator_message_delivery_cron';
  if v_config is null then return 'not_configured'; end if;
  if coalesce((v_config ->> 'enabled')::boolean, false) is not true then return 'disabled'; end if;
  if nullif(btrim(v_config ->> 'url'), '') is null
     or nullif(btrim(v_config ->> 'secret'), '') is null then
    return 'not_configured';
  end if;
  begin
    select net.http_post(
      url := v_config ->> 'url',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cron-secret', v_config ->> 'secret'
      ),
      body := '{}'::jsonb
    ) into v_request;
  exception when undefined_function or undefined_table or invalid_schema_name then
    return 'pg_net_unavailable';
  end;
  return 'dispatched:' || coalesce(v_request::text, 'unknown');
exception when invalid_text_representation then
  return 'not_configured';
end;
$$;

revoke all on function public.run_operator_message_delivery() from public, anon, authenticated;
grant execute on function public.run_operator_message_delivery() to service_role;

do $$
begin
  execute 'create extension if not exists pg_net with schema extensions';
exception when others then
  raise notice 'pg_net unavailable; operator-message dispatcher remains inert';
end;
$$;

do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception when others then
  raise notice 'pg_cron unavailable; schedule run_operator_message_delivery manually';
end;
$$;

do $$
begin
  perform cron.unschedule(jobid) from cron.job
   where jobname = 'operator-message-delivery-five-minute';
  perform cron.schedule(
    'operator-message-delivery-five-minute',
    '*/5 * * * *',
    $job$select public.run_operator_message_delivery();$job$
  );
exception when undefined_function or undefined_table or invalid_schema_name or insufficient_privilege then
  raise notice 'pg_cron unavailable; operator-message delivery must be scheduled manually';
end;
$$;
