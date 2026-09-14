-- ────────────────────────────────────────────────────────────────────────────
-- 187_custom_content_archive_transfer.sql — canonical full-fidelity custom
-- content backup, restore, and browser-local premium cutover.
--
-- A content pack is a publishing format, not an account backup. This migration
-- adds one graph contract and one transaction for archived definitions, every
-- immutable revision, complete pack-version closure, environment history and
-- active pointer, and canonically exact imported JSON audit receipts.
--
-- Source receipts are never rewritten into the destination namespace. Their
-- original archive is retained as semantically exact JSONB in
-- custom_content_archive_imports.
-- The destination import receives its own application-command journal receipt
-- with the deterministic identity map used by campaign-binding restoration.
--
-- Export is an ownership/data-rights operation and is intentionally not
-- premium-gated. Import remains an active-premium mutation.
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.custom_content_archive_imports (
  owner_id                 uuid not null
                             references auth.users(id) on delete cascade,
  archive_fingerprint      text not null
                             check (archive_fingerprint ~ '^[0-9a-f]{64}$'),
  source_key               text not null,
  source_ledger_fingerprint text not null
                             check (
                               source_ledger_fingerprint ~ '^[0-9a-f]{64}$'
                             ),
  provenance_fingerprint   text not null
                             check (
                               provenance_fingerprint ~ '^[0-9a-f]{64}$'
                             ),
  source_archive           jsonb not null
                             check (jsonb_typeof(source_archive) = 'object'),
  identity_map             jsonb not null
                             check (jsonb_typeof(identity_map) = 'object'),
  command_id               text not null,
  imported_at              timestamptz not null default now(),
  primary key (owner_id, archive_fingerprint),
  check (
    source_key = btrim(source_key)
    and char_length(source_key) between 1 and 240
  )
);

-- An export timestamp or outer provenance envelope may change without changing
-- the source ledger. Keep one durable provenance record per source address and
-- ledger identity so harmless re-exports cannot exhaust the audit bound.
create unique index if not exists custom_content_archive_source_ledger_uidx
  on public.custom_content_archive_imports (
    owner_id, source_key, source_ledger_fingerprint, provenance_fingerprint
  );

alter table public.custom_content_archive_imports enable row level security;
create policy "Owners read own custom content archive imports"
  on public.custom_content_archive_imports for select
  using (auth.uid() = owner_id);
revoke all on table public.custom_content_archive_imports
  from public, anon, authenticated, service_role;
grant select on table public.custom_content_archive_imports
  to authenticated, service_role;

-- Archive timestamps have one textual form on both sides of the JSONB
-- boundary. PostgreSQL's native JSON encoding uses `+00:00`; the portable
-- contract deliberately uses millisecond UTC `Z` timestamps.
create or replace function public._custom_content_archive_timestamp(
  p_value timestamptz
)
returns text
language sql
immutable
strict
set search_path = public, pg_temp
as $$
  select to_char(
    p_value at time zone 'UTC',
    'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
  )
$$;

create or replace function public._custom_content_archive_timestamp_valid(
  p_value jsonb
)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_text text;
  v_timestamp timestamptz;
begin
  if jsonb_typeof(p_value) = 'null' then return true; end if;
  if jsonb_typeof(p_value) is distinct from 'string' then return false; end if;
  v_text := p_value #>> '{}';
  if v_text !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$'
  then
    return false;
  end if;
  v_timestamp := v_text::timestamptz;
  return to_char(
    v_timestamp at time zone 'UTC',
    'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
  ) = v_text;
exception when others then
  return false;
end;
$$;

create or replace function public._custom_content_archive_source_valid(
  p_source jsonb
)
returns boolean
language sql
immutable
set search_path = public, pg_temp
as $$
  select jsonb_typeof(p_source) = 'object'
    and p_source ?& array[
      'type','key','exportedAt','ledgerFingerprint'
    ]
    and (
      p_source - array[
        'type','key','exportedAt','ledgerFingerprint'
      ]
    ) = '{}'::jsonb
    and nullif(btrim(p_source ->> 'type'), '') is not null
    and char_length(p_source ->> 'type') <= 240
    and nullif(btrim(p_source ->> 'key'), '') is not null
    and char_length(p_source ->> 'key') <= 240
    and public._custom_content_archive_timestamp_valid(
      p_source -> 'exportedAt'
    )
    and p_source ->> 'ledgerFingerprint' ~ '^[0-9a-f]{64}$'
$$;

create or replace function public._custom_content_archive_ledger_valid(
  p_ledger jsonb,
  p_require_uuid boolean,
  p_require_receipts boolean
)
returns boolean
language plpgsql
stable
set search_path = public, pg_temp
as $$
declare
  v_expected_keys text[] := case when p_require_receipts then
    array[
      'schemaVersion','definitions','revisions','packs','packVersions',
      'packEntryDefinitions','packVersionEntries','environments',
      'activeEnvironmentRevisionId','commandReceipts'
    ]
  else
    array[
      'schemaVersion','definitions','revisions','packs','packVersions',
      'packEntryDefinitions','packVersionEntries','environments',
      'activeEnvironmentRevisionId'
    ]
  end;
begin
  if jsonb_typeof(p_ledger) is distinct from 'object'
    or p_ledger ->> 'schemaVersion' is distinct from '1'
    or (p_ledger - v_expected_keys) <> '{}'::jsonb
    or not (p_ledger ?& v_expected_keys)
    or jsonb_typeof(p_ledger -> 'definitions') is distinct from 'array'
    or jsonb_array_length(p_ledger -> 'definitions') > 2000
    or jsonb_typeof(p_ledger -> 'revisions') is distinct from 'array'
    or jsonb_array_length(p_ledger -> 'revisions') > 20000
    or jsonb_typeof(p_ledger -> 'packs') is distinct from 'array'
    or jsonb_array_length(p_ledger -> 'packs') > 128
    or jsonb_typeof(p_ledger -> 'packVersions') is distinct from 'array'
    or jsonb_array_length(p_ledger -> 'packVersions') > 1024
    or jsonb_typeof(p_ledger -> 'packEntryDefinitions')
      is distinct from 'array'
    or jsonb_array_length(p_ledger -> 'packEntryDefinitions') > 20000
    or jsonb_typeof(p_ledger -> 'packVersionEntries')
      is distinct from 'array'
    or jsonb_array_length(p_ledger -> 'packVersionEntries') > 20000
    or jsonb_typeof(p_ledger -> 'environments') is distinct from 'array'
    or jsonb_array_length(p_ledger -> 'environments') > 2000
    or (
      p_require_receipts
      and (
        jsonb_typeof(p_ledger -> 'commandReceipts')
          is distinct from 'array'
        or jsonb_array_length(p_ledger -> 'commandReceipts') > 10000
      )
    )
  then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'definitions') definition(value)
     where jsonb_typeof(definition.value) is distinct from 'object'
        or not (
          definition.value ?& array[
            'id','category','localUid','headRevisionId','archivedAt',
            'createdAt','updatedAt','legacyContentId'
          ]
        )
        or (
          definition.value - array[
            'id','category','localUid','headRevisionId','archivedAt',
            'createdAt','updatedAt','legacyContentId'
          ]
        ) <> '{}'::jsonb
        or nullif(btrim(definition.value ->> 'id'), '') is null
        or char_length(definition.value ->> 'id') > 240
        or definition.value ->> 'category' not in (
          'institutions','services','resources','stressors',
          'tradeGoods','factions','deities','traditions'
        )
        or nullif(btrim(definition.value ->> 'localUid'), '') is null
        or char_length(definition.value ->> 'localUid') > 240
        or definition.value ->> 'localUid'
          <> btrim(definition.value ->> 'localUid')
        or nullif(btrim(definition.value ->> 'headRevisionId'), '') is null
        or char_length(definition.value ->> 'headRevisionId') > 240
        or not public._custom_content_archive_timestamp_valid(
          definition.value -> 'archivedAt'
        )
        or not public._custom_content_archive_timestamp_valid(
          definition.value -> 'createdAt'
        )
        or not public._custom_content_archive_timestamp_valid(
          definition.value -> 'updatedAt'
        )
        or jsonb_typeof(definition.value -> 'legacyContentId')
          not in ('null', 'string')
        or (
          definition.value ->> 'legacyContentId' is not null
          and (
            nullif(btrim(definition.value ->> 'legacyContentId'), '') is null
            or char_length(definition.value ->> 'legacyContentId') > 240
          )
        )
        or (
          p_require_uuid
          and (
            public._content_uuid(definition.value ->> 'id') is null
            or public._content_uuid(
              definition.value ->> 'headRevisionId'
            ) is null
          )
        )
  ) or (
    select count(distinct definition.value ->> 'id')
      from jsonb_array_elements(p_ledger -> 'definitions') definition(value)
  ) <> jsonb_array_length(p_ledger -> 'definitions')
  or (
    select count(distinct definition.value ->> 'localUid')
      from jsonb_array_elements(p_ledger -> 'definitions') definition(value)
  ) <> jsonb_array_length(p_ledger -> 'definitions')
  then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'revisions') revision(value)
     where jsonb_typeof(revision.value) is distinct from 'object'
        or not (
          revision.value ?& array[
            'schemaVersion','id','definitionId','category','revisionNumber',
            'parentRevisionId','contentHash','data','createdAt'
          ]
        )
        or (
          revision.value - array[
            'schemaVersion','id','definitionId','category','revisionNumber',
            'parentRevisionId','contentHash','data','createdAt'
          ]
        ) <> '{}'::jsonb
        or revision.value ->> 'schemaVersion' is distinct from '1'
        or nullif(btrim(revision.value ->> 'id'), '') is null
        or char_length(revision.value ->> 'id') > 240
        or nullif(btrim(revision.value ->> 'definitionId'), '') is null
        or char_length(revision.value ->> 'definitionId') > 240
        or coalesce(revision.value ->> 'revisionNumber', '')
          !~ '^[1-9][0-9]*$'
        or jsonb_typeof(revision.value -> 'parentRevisionId')
          not in ('null', 'string')
        or coalesce(revision.value ->> 'contentHash', '')
          !~ '^[0-9a-f]{64}$'
        or not public._custom_content_archive_timestamp_valid(
          revision.value -> 'createdAt'
        )
        or not public._custom_content_record_valid(
          revision.value ->> 'category',
          revision.value -> 'data'
        )
        or public._content_sha256(jsonb_build_object(
          'schemaVersion', 1,
          'category', revision.value ->> 'category',
          'data', revision.value -> 'data'
        )) <> revision.value ->> 'contentHash'
        or (
          p_require_uuid
          and (
            public._content_uuid(revision.value ->> 'id') is null
            or public._content_uuid(
              revision.value ->> 'definitionId'
            ) is null
            or (
              revision.value ->> 'parentRevisionId' is not null
              and public._content_uuid(
                revision.value ->> 'parentRevisionId'
              ) is null
            )
          )
        )
        or not exists (
          select 1
            from jsonb_array_elements(
              p_ledger -> 'definitions'
            ) definition(value)
           where definition.value ->> 'id'
             = revision.value ->> 'definitionId'
             and definition.value ->> 'category'
             = revision.value ->> 'category'
             and definition.value ->> 'localUid'
             = revision.value #>> '{data,localUid}'
        )
  ) or (
    select count(distinct revision.value ->> 'id')
      from jsonb_array_elements(p_ledger -> 'revisions') revision(value)
  ) <> jsonb_array_length(p_ledger -> 'revisions')
  or exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'revisions') revision(value)
     group by
       revision.value ->> 'definitionId',
       revision.value ->> 'revisionNumber'
    having count(*) > 1
  ) or exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'definitions') definition(value)
     where not exists (
       select 1
         from jsonb_array_elements(p_ledger -> 'revisions') revision(value)
        where revision.value ->> 'id'
          = definition.value ->> 'headRevisionId'
          and revision.value ->> 'definitionId'
          = definition.value ->> 'id'
     )
  ) or exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'revisions') child(value)
     where child.value ->> 'parentRevisionId' is not null
       and not exists (
         select 1
           from jsonb_array_elements(p_ledger -> 'revisions') parent(value)
          where parent.value ->> 'id'
            = child.value ->> 'parentRevisionId'
            and parent.value ->> 'definitionId'
            = child.value ->> 'definitionId'
            and (parent.value ->> 'revisionNumber')::integer
              < (child.value ->> 'revisionNumber')::integer
       )
  ) or exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'definitions') definition(value)
     where (
       select count(*)
         from jsonb_array_elements(p_ledger -> 'revisions') revision(value)
        where revision.value ->> 'definitionId'
          = definition.value ->> 'id'
     ) <> (
       select max((revision.value ->> 'revisionNumber')::integer)
         from jsonb_array_elements(p_ledger -> 'revisions') revision(value)
        where revision.value ->> 'definitionId'
          = definition.value ->> 'id'
     )
       or not exists (
         select 1
           from jsonb_array_elements(p_ledger -> 'revisions') head(value)
          where head.value ->> 'id'
            = definition.value ->> 'headRevisionId'
            and (head.value ->> 'revisionNumber')::integer = (
              select max((revision.value ->> 'revisionNumber')::integer)
                from jsonb_array_elements(
                  p_ledger -> 'revisions'
                ) revision(value)
               where revision.value ->> 'definitionId'
                 = definition.value ->> 'id'
            )
       )
  ) or exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'revisions') child(value)
     where (
       (child.value ->> 'revisionNumber')::integer = 1
       and child.value ->> 'parentRevisionId' is not null
     ) or (
       (child.value ->> 'revisionNumber')::integer > 1
       and not exists (
         select 1
           from jsonb_array_elements(p_ledger -> 'revisions') parent(value)
          where parent.value ->> 'id'
            = child.value ->> 'parentRevisionId'
            and parent.value ->> 'definitionId'
              = child.value ->> 'definitionId'
            and (parent.value ->> 'revisionNumber')::integer
              = (child.value ->> 'revisionNumber')::integer - 1
       )
     )
  ) then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'packs') pack(value)
     where jsonb_typeof(pack.value) is distinct from 'object'
        or not (
          pack.value ?& array[
            'packId','name','activePackVersion','activeManifestHash',
            'createdAt','updatedAt'
          ]
        )
        or (
          pack.value - array[
            'packId','name','activePackVersion','activeManifestHash',
            'createdAt','updatedAt'
          ]
        ) <> '{}'::jsonb
        or nullif(btrim(pack.value ->> 'packId'), '') is null
        or char_length(pack.value ->> 'packId') > 240
        or nullif(btrim(pack.value ->> 'name'), '') is null
        or char_length(pack.value ->> 'name') > 240
        or (
          (pack.value ->> 'activePackVersion' is null)
          <> (pack.value ->> 'activeManifestHash' is null)
        )
        or (
          pack.value ->> 'activeManifestHash' is not null
          and pack.value ->> 'activeManifestHash'
            !~ '^[0-9a-f]{64}$'
        )
        or not public._custom_content_archive_timestamp_valid(
          pack.value -> 'createdAt'
        )
        or not public._custom_content_archive_timestamp_valid(
          pack.value -> 'updatedAt'
        )
  ) or (
    select count(distinct pack.value ->> 'packId')
      from jsonb_array_elements(p_ledger -> 'packs') pack(value)
  ) <> jsonb_array_length(p_ledger -> 'packs')
  then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'packVersions') version(value)
     where jsonb_typeof(version.value) is distinct from 'object'
        or not (
          version.value ?& array[
            'packId','packVersion','manifestHash','importPlanHash',
            'manifest','createdAt'
          ]
        )
        or (
          version.value - array[
            'packId','packVersion','manifestHash','importPlanHash',
            'manifest','createdAt'
          ]
        ) <> '{}'::jsonb
        or nullif(btrim(version.value ->> 'packVersion'), '') is null
        or char_length(version.value ->> 'packVersion') > 120
        or version.value ->> 'manifestHash' !~ '^[0-9a-f]{64}$'
        or version.value ->> 'importPlanHash' !~ '^[0-9a-f]{64}$'
        or jsonb_typeof(version.value -> 'manifest')
          is distinct from 'object'
        or not public._custom_content_archive_timestamp_valid(
          version.value -> 'createdAt'
        )
        or not public._content_pack_manifest_valid(
          version.value -> 'manifest',
          version.value ->> 'packId',
          version.value ->> 'packVersion',
          version.value ->> 'manifestHash'
        )
        or not exists (
          select 1
            from jsonb_array_elements(p_ledger -> 'packs') pack(value)
           where pack.value ->> 'packId' = version.value ->> 'packId'
        )
        or not exists (
          select 1
            from jsonb_array_elements(
              p_ledger -> 'packVersionEntries'
            ) entry(value)
           where entry.value ->> 'packId' = version.value ->> 'packId'
             and entry.value ->> 'packVersion'
               = version.value ->> 'packVersion'
        )
        or version.value ->> 'importPlanHash'
          <> public._content_sha256(jsonb_build_object(
            'schemaVersion', 1,
            'packId', version.value ->> 'packId',
            'packVersion', version.value ->> 'packVersion',
            'entries', (
              select coalesce(jsonb_agg(
                jsonb_build_object(
                  'packEntryId', entry.value -> 'packEntryId',
                  'category', entry.value -> 'category',
                  'data', revision.value -> 'data'
                )
                order by (entry.value ->> 'ordinal')::integer
              ), '[]'::jsonb)
                from jsonb_array_elements(
                  p_ledger -> 'packVersionEntries'
                ) entry(value)
                join jsonb_array_elements(
                  p_ledger -> 'revisions'
                ) revision(value)
                  on revision.value ->> 'id'
                    = entry.value ->> 'revisionId'
               where entry.value ->> 'packId'
                 = version.value ->> 'packId'
                 and entry.value ->> 'packVersion'
                   = version.value ->> 'packVersion'
            )
          ))
        or exists (
          select 1
            from jsonb_array_elements(
              p_ledger -> 'packVersionEntries'
            ) entry(value)
            join jsonb_array_elements(
              p_ledger -> 'revisions'
            ) revision(value)
              on revision.value ->> 'id'
                = entry.value ->> 'revisionId'
           where entry.value ->> 'packId'
             = version.value ->> 'packId'
             and entry.value ->> 'packVersion'
               = version.value ->> 'packVersion'
             and not exists (
               select 1
                 from jsonb_each(
                   version.value #> '{manifest,content}'
                 ) bucket(key, value)
                 cross join lateral jsonb_array_elements(
                   bucket.value
                 ) manifest_entry(value)
                where bucket.key = entry.value ->> 'category'
                  and manifest_entry.value ->> 'packEntryId'
                    = entry.value ->> 'packEntryId'
                  and manifest_entry.value ->> 'sourceDefinitionId'
                    = entry.value ->> 'definitionId'
                  and manifest_entry.value ->> 'sourceRevisionId'
                    = entry.value ->> 'revisionId'
                  and manifest_entry.value ->> 'contentHash'
                    = revision.value ->> 'contentHash'
                  and (
                    manifest_entry.value - array[
                      'id','definitionId','revisionId','revisionNumber',
                      'contentHash','createdAt','updatedAt','archivedAt',
                      'isCustom','_schemaVersion','packEntryId',
                      'sourceDefinitionId','sourceRevisionId',
                      'commandReceipt'
                    ]
                  ) = revision.value -> 'data'
             )
        )
        or (
          select count(*)
            from jsonb_each(
              version.value #> '{manifest,content}'
            ) bucket(key, value)
            cross join lateral jsonb_array_elements(bucket.value) entry(value)
        ) <> (
          select count(*)
            from jsonb_array_elements(
              p_ledger -> 'packVersionEntries'
            ) entry(value)
           where entry.value ->> 'packId'
             = version.value ->> 'packId'
             and entry.value ->> 'packVersion'
               = version.value ->> 'packVersion'
        )
  ) or exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'packVersions') version(value)
     group by
       version.value ->> 'packId',
       version.value ->> 'packVersion'
    having count(*) > 1
  ) then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(
        p_ledger -> 'packEntryDefinitions'
      ) mapping(value)
     where jsonb_typeof(mapping.value) is distinct from 'object'
        or not (
          mapping.value ?& array[
            'packId','packEntryId','definitionId'
          ]
        )
        or (
          mapping.value - array[
            'packId','packEntryId','definitionId'
          ]
        ) <> '{}'::jsonb
        or nullif(btrim(mapping.value ->> 'packEntryId'), '') is null
        or char_length(mapping.value ->> 'packEntryId') > 240
        or not exists (
          select 1
            from jsonb_array_elements(p_ledger -> 'packs') pack(value)
           where pack.value ->> 'packId' = mapping.value ->> 'packId'
        )
        or not exists (
          select 1
            from jsonb_array_elements(
              p_ledger -> 'definitions'
            ) definition(value)
           where definition.value ->> 'id'
             = mapping.value ->> 'definitionId'
        )
        or (
          p_require_uuid
          and public._content_uuid(mapping.value ->> 'definitionId') is null
        )
  ) or exists (
    select 1
      from jsonb_array_elements(
        p_ledger -> 'packEntryDefinitions'
      ) mapping(value)
     group by
       mapping.value ->> 'packId',
       mapping.value ->> 'packEntryId'
    having count(*) > 1
  ) then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(
        p_ledger -> 'packVersionEntries'
      ) entry(value)
     where jsonb_typeof(entry.value) is distinct from 'object'
        or not (
          entry.value ?& array[
            'packId','packVersion','packEntryId','definitionId',
            'revisionId','category','ordinal'
          ]
        )
        or (
          entry.value - array[
            'packId','packVersion','packEntryId','definitionId',
            'revisionId','category','ordinal'
          ]
        ) <> '{}'::jsonb
        or coalesce(entry.value ->> 'ordinal', '') !~ '^[0-9]+$'
        or not exists (
          select 1
            from jsonb_array_elements(
              p_ledger -> 'packVersions'
            ) version(value)
           where version.value ->> 'packId' = entry.value ->> 'packId'
             and version.value ->> 'packVersion'
               = entry.value ->> 'packVersion'
        )
        or not exists (
          select 1
            from jsonb_array_elements(
              p_ledger -> 'packEntryDefinitions'
            ) mapping(value)
           where mapping.value ->> 'packId' = entry.value ->> 'packId'
             and mapping.value ->> 'packEntryId'
               = entry.value ->> 'packEntryId'
             and mapping.value ->> 'definitionId'
               = entry.value ->> 'definitionId'
        )
        or not exists (
          select 1
            from jsonb_array_elements(p_ledger -> 'revisions') revision(value)
           where revision.value ->> 'id' = entry.value ->> 'revisionId'
             and revision.value ->> 'definitionId'
               = entry.value ->> 'definitionId'
             and revision.value ->> 'category'
               = entry.value ->> 'category'
        )
        or (
          p_require_uuid
          and (
            public._content_uuid(entry.value ->> 'definitionId') is null
            or public._content_uuid(entry.value ->> 'revisionId') is null
          )
        )
  ) or exists (
    select 1
      from jsonb_array_elements(
        p_ledger -> 'packVersionEntries'
      ) entry(value)
     group by
       entry.value ->> 'packId',
       entry.value ->> 'packVersion',
       entry.value ->> 'packEntryId'
    having count(*) > 1
  ) or exists (
    select 1
      from jsonb_array_elements(
        p_ledger -> 'packVersionEntries'
      ) entry(value)
     group by entry.value ->> 'packId', entry.value ->> 'packVersion'
    having min((entry.value ->> 'ordinal')::integer) <> 0
        or max((entry.value ->> 'ordinal')::integer) <> count(*) - 1
        or count(distinct (entry.value ->> 'ordinal')::integer) <> count(*)
  ) or exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'packs') pack(value)
     where pack.value ->> 'activePackVersion' is not null
       and not exists (
         select 1
           from jsonb_array_elements(
             p_ledger -> 'packVersions'
           ) version(value)
          where version.value ->> 'packId' = pack.value ->> 'packId'
            and version.value ->> 'packVersion'
              = pack.value ->> 'activePackVersion'
            and version.value ->> 'manifestHash'
              = pack.value ->> 'activeManifestHash'
       )
  ) then
    return false;
  end if;

  if exists (
    select 1
     from jsonb_array_elements(p_ledger -> 'environments') environment(value)
     where not public._content_environment_valid(environment.value)
        or not public._custom_content_archive_timestamp_valid(
          environment.value -> 'createdAt'
        )
        or not exists (
          select 1
          where not exists (
            select 1
              from jsonb_array_elements(
                environment.value -> 'directDefinitions'
              ) direct(value)
             where not exists (
               select 1
                 from jsonb_array_elements(
                   p_ledger -> 'revisions'
                 ) revision(value)
                where revision.value ->> 'id'
                  = direct.value ->> 'revisionId'
                  and revision.value ->> 'definitionId'
                    = direct.value ->> 'definitionId'
                  and revision.value ->> 'category'
                    = direct.value ->> 'category'
                  and revision.value ->> 'contentHash'
                    = direct.value ->> 'contentHash'
             )
          )
        )
        or exists (
          select 1
            from jsonb_array_elements(
              environment.value -> 'packVersions'
            ) binding(value)
           where not exists (
             select 1
               from jsonb_array_elements(
                 p_ledger -> 'packVersions'
               ) version(value)
              where version.value ->> 'packId'
                = binding.value ->> 'packId'
                and version.value ->> 'packVersion'
                  = binding.value ->> 'packVersionId'
                and version.value ->> 'manifestHash'
                  = binding.value ->> 'manifestHash'
                and exists (
                  select 1
                    from jsonb_array_elements(
                      p_ledger -> 'packVersionEntries'
                    ) entry(value)
                   where entry.value ->> 'packId'
                     = binding.value ->> 'packId'
                     and entry.value ->> 'packVersion'
                       = binding.value ->> 'packVersionId'
                )
             )
        )
        or exists (
          select 1
            from jsonb_array_elements(
              environment.value -> 'packVersions'
            ) binding(value)
            join jsonb_array_elements(
              p_ledger -> 'packVersionEntries'
            ) entry(value)
              on entry.value ->> 'packId' = binding.value ->> 'packId'
             and entry.value ->> 'packVersion'
               = binding.value ->> 'packVersionId'
           where not exists (
             select 1
               from jsonb_array_elements(
                 environment.value -> 'directDefinitions'
               ) direct(value)
              where direct.value ->> 'definitionId'
                = entry.value ->> 'definitionId'
                and direct.value ->> 'revisionId'
                  = entry.value ->> 'revisionId'
                and direct.value ->> 'category'
                  = entry.value ->> 'category'
           )
        )
  ) or exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'environments') environment(value)
     group by environment.value ->> 'environmentRevisionId'
    having count(*) > 1
  ) or exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'environments') environment(value)
     group by environment.value ->> 'environmentId'
    having count(*) <> max(
      (environment.value ->> 'revisionNumber')::integer
    )
       or min((environment.value ->> 'revisionNumber')::integer) <> 1
  ) or (
    p_ledger ->> 'activeEnvironmentRevisionId' is not null
    and not exists (
      select 1
        from jsonb_array_elements(
          p_ledger -> 'environments'
        ) environment(value)
       where environment.value ->> 'environmentRevisionId'
         = p_ledger ->> 'activeEnvironmentRevisionId'
    )
  ) then
    return false;
  end if;

  if p_require_receipts and exists (
    select 1
      from jsonb_array_elements(
        p_ledger -> 'commandReceipts'
      ) receipt(value)
     where jsonb_typeof(receipt.value) is distinct from 'object'
        or not (
          receipt.value ?& array[
            'commandId','fingerprint','receipt'
          ]
        )
        or (
          receipt.value - array[
            'commandId','fingerprint','receipt'
          ]
        ) <> '{}'::jsonb
        or nullif(btrim(receipt.value ->> 'commandId'), '') is null
        or char_length(receipt.value ->> 'commandId') > 240
        or receipt.value ->> 'fingerprint' !~ '^[0-9a-f]{64}$'
        or jsonb_typeof(receipt.value -> 'receipt') is distinct from 'object'
  ) or p_require_receipts and exists (
    select 1
      from jsonb_array_elements(
        p_ledger -> 'commandReceipts'
      ) receipt(value)
     group by receipt.value ->> 'commandId'
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

create or replace function public._custom_content_archive_destination_hash(
  p_owner uuid,
  p_source_key text,
  p_kind text,
  p_source_id text
)
returns text
language sql
immutable
set search_path = public, pg_temp
as $$
  select public._content_sha256(jsonb_build_object(
    'schemaVersion', 1,
    'destinationOwnerId', p_owner::text,
    'sourceKey', p_source_key,
    'kind', p_kind,
    'sourceId', p_source_id
  ))
$$;

create or replace function public._custom_content_archive_destination_uuid(
  p_owner uuid,
  p_source_key text,
  p_kind text,
  p_source_id text
)
returns uuid
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_hash text := public._custom_content_archive_destination_hash(
    p_owner, p_source_key, p_kind, p_source_id
  );
  v_variant text;
begin
  v_variant := case substring(v_hash from 17 for 1)
    when '0' then '8' when '4' then '8'
    when '8' then '8' when 'c' then '8'
    when '1' then '9' when '5' then '9'
    when '9' then '9' when 'd' then '9'
    when '2' then 'a' when '6' then 'a'
    when 'a' then 'a' when 'e' then 'a'
    else 'b'
  end;
  return (
    substring(v_hash from 1 for 8) || '-'
    || substring(v_hash from 9 for 4) || '-5'
    || substring(v_hash from 14 for 3) || '-'
    || v_variant || substring(v_hash from 18 for 3) || '-'
    || substring(v_hash from 21 for 12)
  )::uuid;
end;
$$;

create or replace function public._custom_content_archive_destination_text(
  p_prefix text,
  p_owner uuid,
  p_source_key text,
  p_source_id text
)
returns text
language sql
immutable
set search_path = public, pg_temp
as $$
  select p_prefix || ':' || substring(
    public._custom_content_archive_destination_hash(
      p_owner, p_source_key, p_prefix, p_source_id
    ) from 1 for 48
  )
$$;

create or replace function public._custom_content_archive_remap_data(
  p_data jsonb,
  p_local_uid_map jsonb
)
returns jsonb
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_result jsonb := p_data;
  v_local_uid text;
  v_field text;
  v_value jsonb;
  v_rewritten jsonb;
  v_dependency_fields text[] := array[
    'produces','requires','subsumes','providedBy','yields','enables',
    'disablesInstitutions','disablesGoods','requiredInstitution',
    'requiredResources','controls','rivals'
  ];
begin
  select mapping.value ->> 'destinationId'
    into v_local_uid
    from jsonb_array_elements(p_local_uid_map) mapping(value)
   where mapping.value ->> 'sourceId' = p_data ->> 'localUid';
  if not found then return null; end if;
  v_result := jsonb_set(v_result, '{localUid}', to_jsonb(v_local_uid), false);

  foreach v_field in array v_dependency_fields loop
    if not (v_result ? v_field) then continue; end if;
    v_value := v_result -> v_field;
    if jsonb_typeof(v_value) = 'string' then
      if left(v_result ->> v_field, 7) = 'custom:' then
        select mapping.value ->> 'destinationId'
          into v_local_uid
          from jsonb_array_elements(p_local_uid_map) mapping(value)
         where mapping.value ->> 'sourceId'
           = substring(v_result ->> v_field from 8);
        if found then
          v_result := jsonb_set(
            v_result,
            array[v_field],
            to_jsonb('custom:' || v_local_uid),
            false
          );
        end if;
      end if;
    elsif jsonb_typeof(v_value) = 'array' then
      select jsonb_agg(
        case
          when jsonb_typeof(item.value) = 'string'
            and left(item.value #>> '{}', 7) = 'custom:'
            and mapped.destination_id is not null
          then to_jsonb('custom:' || mapped.destination_id)
          else item.value
        end
        order by item.ordinal
      )
        into v_rewritten
        from jsonb_array_elements(v_value)
          with ordinality item(value, ordinal)
        left join lateral (
          select mapping.value ->> 'destinationId' as destination_id
            from jsonb_array_elements(p_local_uid_map) mapping(value)
           where mapping.value ->> 'sourceId'
             = substring(item.value #>> '{}' from 8)
        ) mapped on true;
      v_result := jsonb_set(v_result, array[v_field], v_rewritten, false);
    end if;
  end loop;
  return v_result;
exception when others then
  return null;
end;
$$;

create or replace function public.import_custom_content_archive(
  p_expected_owner uuid,
  p_command_id text,
  p_fingerprint text,
  p_bundle jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_claim jsonb;
  v_archive jsonb := p_bundle -> 'sourceArchive';
  v_transfer jsonb := p_bundle -> 'transfer';
  v_identity_map jsonb := p_bundle -> 'identityMap';
  v_activation_policy text := p_bundle ->> 'activationPolicy';
  v_archive_core jsonb;
  v_archive_fingerprint text;
  v_source_key text;
  v_source_ledger_fingerprint text;
  v_provenance_fingerprint text;
  v_now timestamptz := clock_timestamp();
  v_receipt jsonb;
  v_failure_reason text;
  v_destination_pristine boolean;
  v_activation_adopted boolean := false;
  v_definition_outcomes jsonb := '{}'::jsonb;
  v_exported_archive jsonb;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if p_expected_owner is null or p_expected_owner <> v_uid then
    raise exception 'custom-content archive owner changed'
      using errcode = '42501';
  end if;
  if not public.account_is_active(v_uid)
    or not public.current_user_has_premium_access()
  then
    raise exception 'active premium account required'
      using errcode = '42501';
  end if;
  if nullif(btrim(p_command_id), '') is null
    or char_length(p_command_id) > 240
    or p_fingerprint !~ '^[0-9a-f]{64}$'
    or jsonb_typeof(p_bundle) is distinct from 'object'
    or octet_length(p_bundle::text) > 32 * 1024 * 1024
    or (p_bundle - array[
      'schemaVersion','activationPolicy',
      'sourceArchive','transfer','identityMap'
    ]) <> '{}'::jsonb
    or not (p_bundle ?& array[
      'schemaVersion','activationPolicy',
      'sourceArchive','transfer','identityMap'
    ])
    or p_bundle ->> 'schemaVersion' is distinct from '1'
    or v_activation_policy not in ('preserve', 'adopt-if-empty')
    or public._content_sha256(p_bundle) <> p_fingerprint
  then
    raise exception 'invalid custom-content archive command'
      using errcode = '22023';
  end if;

  v_archive_fingerprint := v_archive ->> 'archiveFingerprint';
  v_source_key := v_archive #>> '{source,key}';
  v_source_ledger_fingerprint :=
    v_archive #>> '{source,ledgerFingerprint}';
  v_provenance_fingerprint := public._content_sha256(jsonb_build_object(
    'schemaVersion', 1,
    'commandReceipts', v_archive #> '{ledger,commandReceipts}',
    'auditProvenance', v_archive -> 'auditProvenance'
  ));
  v_archive_core := v_archive - 'archiveFingerprint';
  if jsonb_typeof(v_archive) is distinct from 'object'
    or not (v_archive ?& array[
      'format','formatVersion','source','ledger',
      'auditProvenance','archiveFingerprint'
    ])
    or (
      v_archive - array[
        'format','formatVersion','source','ledger',
        'auditProvenance','archiveFingerprint'
      ]
    ) <> '{}'::jsonb
    or v_archive ->> 'format'
      is distinct from 'settlementforge.custom-content-ledger'
    or v_archive ->> 'formatVersion' is distinct from '1'
    or v_archive_fingerprint !~ '^[0-9a-f]{64}$'
    or public._content_sha256(v_archive_core) <> v_archive_fingerprint
    or v_source_ledger_fingerprint !~ '^[0-9a-f]{64}$'
    or not public._custom_content_archive_source_valid(
      v_archive -> 'source'
    )
    or public._content_sha256(v_archive -> 'ledger')
      <> v_source_ledger_fingerprint
    or nullif(btrim(v_source_key), '') is null
    or char_length(v_source_key) > 240
    or jsonb_typeof(v_archive -> 'auditProvenance')
      is distinct from 'array'
    or jsonb_array_length(v_archive -> 'auditProvenance') > 128
    or not public._custom_content_archive_ledger_valid(
      v_archive -> 'ledger',
      false,
      true
    )
    or not public._custom_content_archive_ledger_valid(
      v_transfer,
      true,
      false
    )
  then
    raise exception 'custom-content archive graph failed admission'
      using errcode = '22023';
  end if;

  if exists (
    with recursive provenance(value) as (
      select item.value
        from jsonb_array_elements(
          v_archive -> 'auditProvenance'
        ) item(value)
      union all
      select child.value
        from provenance parent
        cross join lateral jsonb_array_elements(
          case
            when jsonb_typeof(parent.value -> 'auditProvenance') = 'array'
            then parent.value -> 'auditProvenance'
            else '[]'::jsonb
          end
        ) child(value)
    )
    select 1
      from provenance
     where jsonb_typeof(provenance.value) is distinct from 'object'
        or not (
          provenance.value ?& array[
            'archiveFingerprint','source',
            'commandReceipts','auditProvenance'
          ]
        )
        or (
          provenance.value - array[
            'archiveFingerprint','source',
            'commandReceipts','auditProvenance'
          ]
        ) <> '{}'::jsonb
        or provenance.value ->> 'archiveFingerprint'
          !~ '^[0-9a-f]{64}$'
        or not public._custom_content_archive_source_valid(
          provenance.value -> 'source'
        )
        or jsonb_typeof(provenance.value -> 'commandReceipts')
          is distinct from 'array'
        or jsonb_array_length(
          provenance.value -> 'commandReceipts'
        ) > 10000
        or exists (
          select 1
            from jsonb_array_elements(
              provenance.value -> 'commandReceipts'
            ) receipt(value)
           where jsonb_typeof(receipt.value) is distinct from 'object'
              or not (
                receipt.value ?& array[
                  'commandId','fingerprint','receipt'
                ]
              )
              or (
                receipt.value - array[
                  'commandId','fingerprint','receipt'
                ]
              ) <> '{}'::jsonb
              or nullif(btrim(receipt.value ->> 'commandId'), '') is null
              or char_length(receipt.value ->> 'commandId') > 240
              or receipt.value ->> 'fingerprint' !~ '^[0-9a-f]{64}$'
              or jsonb_typeof(receipt.value -> 'receipt')
                is distinct from 'object'
        )
        or exists (
          select 1
            from jsonb_array_elements(
              provenance.value -> 'commandReceipts'
            ) receipt(value)
           group by receipt.value ->> 'commandId'
          having count(*) > 1
        )
        or jsonb_typeof(provenance.value -> 'auditProvenance')
          is distinct from 'array'
  ) or (
    with recursive provenance(value) as (
      select item.value
        from jsonb_array_elements(
          v_archive -> 'auditProvenance'
        ) item(value)
      union all
      select child.value
        from provenance parent
        cross join lateral jsonb_array_elements(
          case
            when jsonb_typeof(parent.value -> 'auditProvenance') = 'array'
            then parent.value -> 'auditProvenance'
            else '[]'::jsonb
          end
        ) child(value)
    )
    select count(*) > 128
        or count(distinct value ->> 'archiveFingerprint') <> count(*)
      from provenance
  ) then
    raise exception 'custom-content archive provenance failed admission'
      using errcode = '22023';
  end if;

  if jsonb_typeof(v_identity_map) is distinct from 'object'
    or (v_identity_map - array[
      'definitionIds','revisionIds','localUids','packIds',
      'environmentIds','environmentRevisionIds'
    ]) <> '{}'::jsonb
    or not (v_identity_map ?& array[
      'definitionIds','revisionIds','localUids','packIds',
      'environmentIds','environmentRevisionIds'
    ])
    or exists (
      select 1
        from jsonb_each(v_identity_map) mapping_set(key, value)
       where jsonb_typeof(mapping_set.value) is distinct from 'array'
          or jsonb_array_length(mapping_set.value) > 20000
          or exists (
            select 1
              from jsonb_array_elements(mapping_set.value) mapping(value)
             where jsonb_typeof(mapping.value) is distinct from 'object'
                or (
                  mapping_set.key = 'revisionIds'
                  and (
                    not (
                      mapping.value ?& array[
                        'sourceId','destinationId','destinationContentHash'
                      ]
                    )
                    or (
                      mapping.value - array[
                        'sourceId','destinationId','destinationContentHash'
                      ]
                    ) <> '{}'::jsonb
                    or mapping.value ->> 'destinationContentHash'
                      !~ '^[0-9a-f]{64}$'
                  )
                )
                or (
                  mapping_set.key = 'environmentRevisionIds'
                  and (
                    not (
                      mapping.value ?& array[
                        'sourceId','destinationId',
                        'destinationEnvironmentHash'
                      ]
                    )
                    or (
                      mapping.value - array[
                        'sourceId','destinationId',
                        'destinationEnvironmentHash'
                      ]
                    ) <> '{}'::jsonb
                    or mapping.value ->> 'destinationEnvironmentHash'
                      !~ '^[0-9a-f]{64}$'
                  )
                )
                or (
                  mapping_set.key not in (
                    'revisionIds','environmentRevisionIds'
                  )
                  and (
                    not (
                      mapping.value ?& array[
                        'sourceId','destinationId'
                      ]
                    )
                    or (
                      mapping.value - array[
                        'sourceId','destinationId'
                      ]
                    ) <> '{}'::jsonb
                  )
                )
                or nullif(btrim(mapping.value ->> 'sourceId'), '') is null
                or nullif(btrim(mapping.value ->> 'destinationId'), '') is null
                or char_length(mapping.value ->> 'sourceId') > 240
                or char_length(mapping.value ->> 'destinationId') > 240
          )
          or (
            select count(distinct mapping.value ->> 'sourceId')
              from jsonb_array_elements(mapping_set.value) mapping(value)
          ) <> jsonb_array_length(mapping_set.value)
          or (
            select count(distinct mapping.value ->> 'destinationId')
              from jsonb_array_elements(mapping_set.value) mapping(value)
          ) <> jsonb_array_length(mapping_set.value)
    )
  then
    raise exception 'custom-content archive identity map is invalid'
      using errcode = '22023';
  end if;

  if jsonb_array_length(v_identity_map -> 'definitionIds')
      <> jsonb_array_length(v_archive #> '{ledger,definitions}')
    or jsonb_array_length(v_identity_map -> 'definitionIds')
      <> jsonb_array_length(v_transfer -> 'definitions')
    or jsonb_array_length(v_identity_map -> 'revisionIds')
      <> jsonb_array_length(v_archive #> '{ledger,revisions}')
    or jsonb_array_length(v_identity_map -> 'revisionIds')
      <> jsonb_array_length(v_transfer -> 'revisions')
    or jsonb_array_length(v_identity_map -> 'localUids')
      <> jsonb_array_length(v_archive #> '{ledger,definitions}')
    or jsonb_array_length(v_identity_map -> 'localUids')
      <> jsonb_array_length(v_transfer -> 'definitions')
    or jsonb_array_length(v_identity_map -> 'packIds')
      <> jsonb_array_length(v_archive #> '{ledger,packs}')
    or jsonb_array_length(v_identity_map -> 'packIds')
      <> jsonb_array_length(v_transfer -> 'packs')
    or jsonb_array_length(v_identity_map -> 'environmentIds')
      <> (
        select count(distinct environment.value ->> 'environmentId')
          from jsonb_array_elements(
            v_archive #> '{ledger,environments}'
          ) environment(value)
      )
    or jsonb_array_length(v_identity_map -> 'environmentIds')
      <> (
        select count(distinct environment.value ->> 'environmentId')
          from jsonb_array_elements(
            v_transfer -> 'environments'
          ) environment(value)
      )
    or jsonb_array_length(v_identity_map -> 'environmentRevisionIds')
      <> jsonb_array_length(v_archive #> '{ledger,environments}')
    or jsonb_array_length(v_identity_map -> 'environmentRevisionIds')
      <> jsonb_array_length(v_transfer -> 'environments')
  then
    raise exception 'custom-content archive identity map is incomplete'
      using errcode = '22023';
  end if;

  -- The server proves the client projection rather than trusting a signed
  -- client fingerprint as authority.
  if exists (
    select 1
      from jsonb_array_elements(
        v_archive #> '{ledger,definitions}'
      ) source(value)
      left join jsonb_array_elements(
        v_identity_map -> 'definitionIds'
      ) mapping(value)
        on mapping.value ->> 'sourceId' = source.value ->> 'id'
     where mapping.value ->> 'destinationId' is distinct from
       public._custom_content_archive_destination_uuid(
         v_uid, v_source_key, 'definition', source.value ->> 'id'
       )::text
  ) or exists (
    select 1
      from jsonb_array_elements(
        v_archive #> '{ledger,definitions}'
      ) source(value)
      left join jsonb_array_elements(
        v_identity_map -> 'localUids'
      ) mapping(value)
        on mapping.value ->> 'sourceId' = source.value ->> 'localUid'
     where mapping.value ->> 'destinationId' is distinct from
       public._custom_content_archive_destination_text(
         'lu_import', v_uid, v_source_key, source.value ->> 'localUid'
       )
  ) or exists (
    select 1
      from jsonb_array_elements(
        v_archive #> '{ledger,revisions}'
      ) source(value)
      left join jsonb_array_elements(
        v_identity_map -> 'revisionIds'
      ) mapping(value)
        on mapping.value ->> 'sourceId' = source.value ->> 'id'
     where mapping.value ->> 'destinationId' is distinct from
       public._custom_content_archive_destination_uuid(
         v_uid, v_source_key, 'revision', source.value ->> 'id'
       )::text
  ) or exists (
    select 1
      from jsonb_array_elements(
        v_archive #> '{ledger,packs}'
      ) source(value)
      left join jsonb_array_elements(
        v_identity_map -> 'packIds'
      ) mapping(value)
        on mapping.value ->> 'sourceId' = source.value ->> 'packId'
     where mapping.value ->> 'destinationId' is distinct from
       public._custom_content_archive_destination_text(
         'imported-pack', v_uid, v_source_key, source.value ->> 'packId'
       )
  ) or exists (
    select 1
      from (
        select distinct environment.value ->> 'environmentId' as source_id
          from jsonb_array_elements(
            v_archive #> '{ledger,environments}'
          ) environment(value)
      ) source
      left join jsonb_array_elements(
        v_identity_map -> 'environmentIds'
      ) mapping(value)
        on mapping.value ->> 'sourceId' = source.source_id
     where mapping.value ->> 'destinationId' is distinct from
       public._custom_content_archive_destination_text(
         'imported-environment', v_uid, v_source_key, source.source_id
       )
  ) or exists (
    select 1
      from jsonb_array_elements(
        v_archive #> '{ledger,environments}'
      ) source(value)
      left join jsonb_array_elements(
        v_identity_map -> 'environmentRevisionIds'
      ) mapping(value)
        on mapping.value ->> 'sourceId'
          = source.value ->> 'environmentRevisionId'
     where mapping.value ->> 'destinationId' is distinct from
       public._custom_content_archive_destination_text(
         'imported-environment-revision',
         v_uid,
         v_source_key,
         source.value ->> 'environmentRevisionId'
       )
  ) then
    raise exception 'custom-content archive identity map is not deterministic'
      using errcode = '22023';
  end if;

  if exists (
    select 1
      from jsonb_array_elements(
        v_archive #> '{ledger,definitions}'
      ) source(value)
      join jsonb_array_elements(
        v_identity_map -> 'definitionIds'
      ) id_map(value)
        on id_map.value ->> 'sourceId' = source.value ->> 'id'
      join jsonb_array_elements(
        v_identity_map -> 'localUids'
      ) uid_map(value)
        on uid_map.value ->> 'sourceId' = source.value ->> 'localUid'
      join jsonb_array_elements(
        v_identity_map -> 'revisionIds'
      ) head_map(value)
        on head_map.value ->> 'sourceId'
          = source.value ->> 'headRevisionId'
      left join jsonb_array_elements(
        v_transfer -> 'definitions'
      ) destination(value)
        on destination.value ->> 'id'
          = id_map.value ->> 'destinationId'
     where destination.value is null
        or destination.value ->> 'category'
          is distinct from source.value ->> 'category'
        or destination.value ->> 'localUid'
          is distinct from uid_map.value ->> 'destinationId'
        or destination.value ->> 'headRevisionId'
          is distinct from head_map.value ->> 'destinationId'
        or destination.value -> 'archivedAt'
          is distinct from source.value -> 'archivedAt'
        or destination.value -> 'createdAt'
          is distinct from source.value -> 'createdAt'
        or destination.value -> 'updatedAt'
          is distinct from source.value -> 'updatedAt'
        or jsonb_typeof(destination.value -> 'legacyContentId')
          is distinct from 'null'
  ) or exists (
    select 1
      from jsonb_array_elements(
        v_archive #> '{ledger,revisions}'
      ) source(value)
      join jsonb_array_elements(
        v_identity_map -> 'revisionIds'
      ) revision_map(value)
        on revision_map.value ->> 'sourceId' = source.value ->> 'id'
      join jsonb_array_elements(
        v_identity_map -> 'definitionIds'
      ) definition_map(value)
        on definition_map.value ->> 'sourceId'
          = source.value ->> 'definitionId'
      left join jsonb_array_elements(
        v_identity_map -> 'revisionIds'
      ) parent_map(value)
        on parent_map.value ->> 'sourceId'
          = source.value ->> 'parentRevisionId'
      left join jsonb_array_elements(
        v_transfer -> 'revisions'
      ) destination(value)
        on destination.value ->> 'id'
          = revision_map.value ->> 'destinationId'
     where destination.value is null
        or destination.value ->> 'definitionId'
          is distinct from definition_map.value ->> 'destinationId'
        or destination.value ->> 'category'
          is distinct from source.value ->> 'category'
        or destination.value ->> 'revisionNumber'
          is distinct from source.value ->> 'revisionNumber'
        or destination.value ->> 'parentRevisionId'
          is distinct from parent_map.value ->> 'destinationId'
        or destination.value -> 'createdAt'
          is distinct from source.value -> 'createdAt'
        or destination.value -> 'data' is distinct from
          public._custom_content_archive_remap_data(
            source.value -> 'data',
            v_identity_map -> 'localUids'
          )
        or destination.value ->> 'contentHash' is distinct from
          public._content_sha256(jsonb_build_object(
            'schemaVersion', 1,
            'category', source.value ->> 'category',
            'data', public._custom_content_archive_remap_data(
              source.value -> 'data',
              v_identity_map -> 'localUids'
            )
          ))
        or revision_map.value ->> 'destinationContentHash'
          is distinct from destination.value ->> 'contentHash'
  ) then
    raise exception 'custom-content archive definition remap is invalid'
      using errcode = '22023';
  end if;

  if exists (
    select 1
      from jsonb_array_elements(
        v_archive #> '{ledger,packs}'
      ) source(value)
      join jsonb_array_elements(
        v_identity_map -> 'packIds'
      ) pack_map(value)
        on pack_map.value ->> 'sourceId' = source.value ->> 'packId'
      left join jsonb_array_elements(
        v_transfer -> 'packs'
      ) destination(value)
        on destination.value ->> 'packId'
          = pack_map.value ->> 'destinationId'
      left join jsonb_array_elements(
        v_transfer -> 'packVersions'
      ) active_version(value)
        on active_version.value ->> 'packId'
          = pack_map.value ->> 'destinationId'
       and active_version.value ->> 'packVersion'
          = source.value ->> 'activePackVersion'
     where destination.value is null
        or destination.value ->> 'name'
          is distinct from source.value ->> 'name'
        or destination.value ->> 'activePackVersion'
          is distinct from source.value ->> 'activePackVersion'
        or destination.value ->> 'activeManifestHash'
          is distinct from active_version.value ->> 'manifestHash'
        or destination.value -> 'createdAt'
          is distinct from source.value -> 'createdAt'
        or destination.value -> 'updatedAt'
          is distinct from source.value -> 'updatedAt'
  ) or exists (
    select 1
      from jsonb_array_elements(
        v_archive #> '{ledger,packVersions}'
      ) source(value)
      join jsonb_array_elements(
        v_identity_map -> 'packIds'
      ) pack_map(value)
        on pack_map.value ->> 'sourceId' = source.value ->> 'packId'
      left join jsonb_array_elements(
        v_transfer -> 'packVersions'
      ) destination(value)
        on destination.value ->> 'packId'
          = pack_map.value ->> 'destinationId'
       and destination.value ->> 'packVersion'
          = source.value ->> 'packVersion'
     where destination.value is null
        or destination.value -> 'createdAt'
          is distinct from source.value -> 'createdAt'
        or (
          (destination.value -> 'manifest')
          - array['packId','content','manifestHash']
        ) is distinct from (
          (source.value -> 'manifest')
          - array['packId','content','manifestHash']
        )
  ) or exists (
    select 1
      from jsonb_array_elements(
        v_archive #> '{ledger,packEntryDefinitions}'
      ) source(value)
      join jsonb_array_elements(
        v_identity_map -> 'packIds'
      ) pack_map(value)
        on pack_map.value ->> 'sourceId' = source.value ->> 'packId'
      join jsonb_array_elements(
        v_identity_map -> 'definitionIds'
      ) definition_map(value)
        on definition_map.value ->> 'sourceId'
          = source.value ->> 'definitionId'
      left join jsonb_array_elements(
        v_transfer -> 'packEntryDefinitions'
      ) destination(value)
        on destination.value ->> 'packId'
          = pack_map.value ->> 'destinationId'
       and destination.value ->> 'packEntryId'
          = source.value ->> 'packEntryId'
     where destination.value is null
        or destination.value ->> 'definitionId'
          is distinct from definition_map.value ->> 'destinationId'
  ) or exists (
    select 1
      from jsonb_array_elements(
        v_archive #> '{ledger,packVersionEntries}'
      ) source(value)
      join jsonb_array_elements(
        v_identity_map -> 'packIds'
      ) pack_map(value)
        on pack_map.value ->> 'sourceId' = source.value ->> 'packId'
      join jsonb_array_elements(
        v_identity_map -> 'definitionIds'
      ) definition_map(value)
        on definition_map.value ->> 'sourceId'
          = source.value ->> 'definitionId'
      join jsonb_array_elements(
        v_identity_map -> 'revisionIds'
      ) revision_map(value)
        on revision_map.value ->> 'sourceId'
          = source.value ->> 'revisionId'
      left join jsonb_array_elements(
        v_transfer -> 'packVersionEntries'
      ) destination(value)
        on destination.value ->> 'packId'
          = pack_map.value ->> 'destinationId'
       and destination.value ->> 'packVersion'
          = source.value ->> 'packVersion'
       and destination.value ->> 'packEntryId'
          = source.value ->> 'packEntryId'
     where destination.value is null
        or destination.value ->> 'definitionId'
          is distinct from definition_map.value ->> 'destinationId'
        or destination.value ->> 'revisionId'
          is distinct from revision_map.value ->> 'destinationId'
        or destination.value ->> 'category'
          is distinct from source.value ->> 'category'
        or destination.value ->> 'ordinal'
          is distinct from source.value ->> 'ordinal'
  ) then
    raise exception 'custom-content archive pack remap is invalid'
      using errcode = '22023';
  end if;

  if exists (
    select 1
      from jsonb_array_elements(
        v_archive #> '{ledger,environments}'
      ) source(value)
      join jsonb_array_elements(
        v_identity_map -> 'environmentIds'
      ) environment_map(value)
        on environment_map.value ->> 'sourceId'
          = source.value ->> 'environmentId'
      join jsonb_array_elements(
        v_identity_map -> 'environmentRevisionIds'
      ) revision_map(value)
        on revision_map.value ->> 'sourceId'
          = source.value ->> 'environmentRevisionId'
      left join jsonb_array_elements(
        v_transfer -> 'environments'
      ) destination(value)
        on destination.value ->> 'environmentRevisionId'
          = revision_map.value ->> 'destinationId'
     where destination.value is null
        or destination.value ->> 'environmentId'
          is distinct from environment_map.value ->> 'destinationId'
        or destination.value ->> 'revisionNumber'
          is distinct from source.value ->> 'revisionNumber'
        or destination.value ->> 'source'
          is distinct from source.value ->> 'source'
        or destination.value -> 'tunables'
          is distinct from source.value -> 'tunables'
        or destination.value -> 'visualSelection'
          is distinct from source.value -> 'visualSelection'
        or destination.value -> 'createdAt'
          is distinct from source.value -> 'createdAt'
        or revision_map.value ->> 'destinationEnvironmentHash'
          is distinct from destination.value ->> 'environmentHash'
        or jsonb_array_length(destination.value -> 'directDefinitions')
          <> jsonb_array_length(source.value -> 'directDefinitions')
        or jsonb_array_length(destination.value -> 'packVersions')
          <> jsonb_array_length(source.value -> 'packVersions')
        or exists (
          select 1
            from jsonb_array_elements(
              source.value -> 'directDefinitions'
            ) source_direct(value)
            join jsonb_array_elements(
              v_identity_map -> 'definitionIds'
            ) definition_map(value)
              on definition_map.value ->> 'sourceId'
                = source_direct.value ->> 'definitionId'
            join jsonb_array_elements(
              v_identity_map -> 'revisionIds'
            ) direct_revision_map(value)
              on direct_revision_map.value ->> 'sourceId'
                = source_direct.value ->> 'revisionId'
           where not exists (
             select 1
               from jsonb_array_elements(
                 destination.value -> 'directDefinitions'
               ) destination_direct(value)
              where destination_direct.value ->> 'definitionId'
                = definition_map.value ->> 'destinationId'
                and destination_direct.value ->> 'revisionId'
                  = direct_revision_map.value ->> 'destinationId'
                and destination_direct.value ->> 'contentHash'
                  = direct_revision_map.value ->> 'destinationContentHash'
                and destination_direct.value ->> 'category'
                  = source_direct.value ->> 'category'
           )
        )
        or exists (
          select 1
            from jsonb_array_elements(
              source.value -> 'packVersions'
            ) source_binding(value)
            join jsonb_array_elements(
              v_identity_map -> 'packIds'
            ) binding_pack_map(value)
              on binding_pack_map.value ->> 'sourceId'
                = source_binding.value ->> 'packId'
            join jsonb_array_elements(
              v_transfer -> 'packVersions'
            ) destination_version(value)
              on destination_version.value ->> 'packId'
                = binding_pack_map.value ->> 'destinationId'
             and destination_version.value ->> 'packVersion'
                = source_binding.value ->> 'packVersionId'
           where not exists (
             select 1
               from jsonb_array_elements(
                 destination.value -> 'packVersions'
               ) destination_binding(value)
              where destination_binding.value ->> 'packId'
                = binding_pack_map.value ->> 'destinationId'
                and destination_binding.value ->> 'packVersionId'
                  = source_binding.value ->> 'packVersionId'
                and destination_binding.value ->> 'manifestHash'
                  = destination_version.value ->> 'manifestHash'
                and destination_binding.value ->> 'order'
                  = source_binding.value ->> 'order'
           )
        )
  ) or (
    v_archive #>> '{ledger,activeEnvironmentRevisionId}' is null
    and v_transfer ->> 'activeEnvironmentRevisionId' is not null
  ) or (
    v_archive #>> '{ledger,activeEnvironmentRevisionId}' is not null
    and not exists (
      select 1
        from jsonb_array_elements(
          v_identity_map -> 'environmentRevisionIds'
        ) mapping(value)
       where mapping.value ->> 'sourceId'
         = v_archive #>> '{ledger,activeEnvironmentRevisionId}'
         and mapping.value ->> 'destinationId'
           = v_transfer ->> 'activeEnvironmentRevisionId'
    )
  ) then
    raise exception 'custom-content archive environment remap is invalid'
      using errcode = '22023';
  end if;

  -- `exportedAt` and the outer archive fingerprint are transport facts. Once
  -- this exact source ledger and provenance graph has been admitted, another
  -- envelope carrying the same semantic artifact must not consume a journal
  -- row or another unit of the 10k receipt budget.
  perform pg_advisory_xact_lock(
    hashtext('custom-content-owner'),
    hashtext(v_uid::text)
  );
  select jsonb_build_object(
    'ok', true,
    'status', 'applied',
    'reason', null,
    'replayed', true,
    'semanticReplay', true,
    'commandId', p_command_id,
    'fingerprint', p_fingerprint,
    'archiveFingerprint', imported.archive_fingerprint,
    'activationPolicy', v_activation_policy,
    'activationAdopted', false,
    'identityMap', imported.identity_map,
    'counts', jsonb_build_object(
      'definitions', jsonb_array_length(v_transfer -> 'definitions'),
      'revisions', jsonb_array_length(v_transfer -> 'revisions'),
      'packs', jsonb_array_length(v_transfer -> 'packs'),
      'packVersions', jsonb_array_length(v_transfer -> 'packVersions'),
      'packEntries', jsonb_array_length(v_transfer -> 'packVersionEntries'),
      'environments', jsonb_array_length(v_transfer -> 'environments')
    ),
    'importedAt', public._custom_content_archive_timestamp(
      imported.imported_at
    )
  )
    into v_receipt
    from public.custom_content_archive_imports imported
   where imported.owner_id = v_uid
     and imported.source_key = v_source_key
     and imported.source_ledger_fingerprint = v_source_ledger_fingerprint
     and imported.provenance_fingerprint = v_provenance_fingerprint
   order by imported.imported_at
   limit 1;
  if found then return v_receipt; end if;

  v_claim := public.claim_application_command(
    v_uid,
    p_command_id,
    p_fingerprint,
    'content.archive.import',
    null,
    null
  );
  if v_claim ->> 'status' = 'conflict' then
    return jsonb_build_object(
      'ok', false,
      'status', 'failed',
      'reason', 'command_id_conflict',
      'replayed', true,
      'commandId', p_command_id
    );
  end if;
  if coalesce((v_claim ->> 'replayed')::boolean, false)
    and v_claim ->> 'phase' = 'finalized'
    and jsonb_typeof(v_claim -> 'receipt') = 'object'
  then
    return (v_claim -> 'receipt') || jsonb_build_object('replayed', true);
  end if;
  if coalesce((v_claim ->> 'replayed')::boolean, false)
    and v_claim ->> 'phase' = 'finalized'
    and v_claim ->> 'status' = 'failed'
    and jsonb_typeof(v_claim -> 'receipt') is distinct from 'object'
  then
    return jsonb_build_object(
      'ok', false,
      'status', 'failed',
      'reason', coalesce(
        v_claim ->> 'reason',
        'custom_content_archive_limit_exceeded'
      ),
      'replayed', true,
      'commandId', p_command_id,
      'fingerprint', p_fingerprint,
      'archiveFingerprint', v_archive_fingerprint,
      'activationPolicy', v_activation_policy,
      'activationAdopted', false
    );
  end if;

  -- Different archive envelopes use different command ids, but all mutate one
  -- account constitution. The owner lock closes absent-row races and makes the
  -- pristine activation decision stable through the final write.
  select not (
    exists (
      select 1 from public.custom_content_definitions
       where owner_id = v_uid
    )
    or exists (
      select 1 from public.content_packs where owner_id = v_uid
    )
    or exists (
      select 1 from public.content_environments where owner_id = v_uid
    )
    or exists (
      select 1 from public.content_environment_activations
       where owner_id = v_uid
    )
  ) into v_destination_pristine;
  v_activation_adopted :=
    v_activation_policy = 'adopt-if-empty'
    and v_destination_pristine;

  -- Deterministic identities may already exist after an earlier generation of
  -- the same source archive. Existing immutable rows are admitted only when
  -- they are exactly the same graph facts.
  if exists (
    select 1
      from jsonb_array_elements(v_transfer -> 'definitions') item(value)
      join public.custom_content_definitions definition
        on definition.id = public._content_uuid(item.value ->> 'id')
     where definition.owner_id <> v_uid
        or definition.category is distinct from item.value ->> 'category'
        or definition.local_uid is distinct from item.value ->> 'localUid'
        or definition.legacy_content_id is distinct from
          public._content_uuid(item.value ->> 'legacyContentId')
        or definition.created_at is distinct from
          nullif(item.value ->> 'createdAt', '')::timestamptz
  ) or exists (
    select 1
      from jsonb_array_elements(v_transfer -> 'definitions') item(value)
      join public.custom_content_definitions definition
        on definition.owner_id = v_uid
       and definition.local_uid = item.value ->> 'localUid'
     where definition.id <> public._content_uuid(item.value ->> 'id')
  ) or exists (
    select 1
      from jsonb_array_elements(v_transfer -> 'revisions') item(value)
      join public.custom_content_revisions revision
        on revision.id = public._content_uuid(item.value ->> 'id')
        or (
          revision.owner_id = v_uid
          and revision.definition_id =
            public._content_uuid(item.value ->> 'definitionId')
          and revision.revision_no =
            (item.value ->> 'revisionNumber')::integer
        )
     where revision.id <> public._content_uuid(item.value ->> 'id')
        or revision.owner_id <> v_uid
        or revision.definition_id is distinct from
          public._content_uuid(item.value ->> 'definitionId')
        or revision.revision_no is distinct from
          (item.value ->> 'revisionNumber')::integer
        or revision.parent_revision_id is distinct from
          public._content_uuid(item.value ->> 'parentRevisionId')
        or revision.schema_version <> 1
        or revision.content_hash is distinct from item.value ->> 'contentHash'
        or revision.data is distinct from item.value -> 'data'
        or revision.created_at is distinct from
          nullif(item.value ->> 'createdAt', '')::timestamptz
  ) or exists (
    select 1
      from jsonb_array_elements(v_transfer -> 'definitions') item(value)
      join public.custom_content_definitions definition
        on definition.owner_id = v_uid
       and definition.id = public._content_uuid(item.value ->> 'id')
      join public.custom_content_revisions current_head
        on current_head.owner_id = definition.owner_id
       and current_head.definition_id = definition.id
       and current_head.id = definition.head_revision_id
      join jsonb_array_elements(
        v_transfer -> 'revisions'
      ) incoming_head(value)
        on incoming_head.value ->> 'definitionId' = item.value ->> 'id'
       and incoming_head.value ->> 'id' = item.value ->> 'headRevisionId'
     where (
       current_head.revision_no =
         (incoming_head.value ->> 'revisionNumber')::integer
       and current_head.id <>
         public._content_uuid(incoming_head.value ->> 'id')
     ) or (
       current_head.revision_no >
         (incoming_head.value ->> 'revisionNumber')::integer
       and not exists (
         select 1
           from public.custom_content_archive_imports prior_import
          where prior_import.owner_id = v_uid
            and prior_import.source_key = v_source_key
            and prior_import.command_id = current_head.command_id
       )
     ) or (
       current_head.id =
         public._content_uuid(incoming_head.value ->> 'id')
       and definition.updated_at =
         nullif(item.value ->> 'updatedAt', '')::timestamptz
       and definition.archived_at is distinct from
         nullif(item.value ->> 'archivedAt', '')::timestamptz
     ) or (
       (
         current_head.revision_no <
           (incoming_head.value ->> 'revisionNumber')::integer
         or (
           current_head.id =
             public._content_uuid(incoming_head.value ->> 'id')
           and definition.updated_at <
             nullif(item.value ->> 'updatedAt', '')::timestamptz
         )
       )
       and not exists (
         select 1
           from (
             select source.value
               from public.custom_content_archive_imports prior_import
               cross join lateral jsonb_array_elements(
                 prior_import.identity_map -> 'definitionIds'
               ) mapping(value)
               join lateral jsonb_array_elements(
                 prior_import.source_archive #> '{ledger,definitions}'
               ) source(value)
                 on source.value ->> 'id' =
                   mapping.value ->> 'sourceId'
              where prior_import.owner_id = v_uid
                and prior_import.source_key = v_source_key
                and mapping.value ->> 'destinationId' =
                  definition.id::text
              order by prior_import.imported_at desc
              limit 1
           ) last_imported
          where definition.updated_at =
              nullif(
                last_imported.value ->> 'updatedAt',
                ''
              )::timestamptz
            and definition.archived_at is not distinct from
              nullif(
                last_imported.value ->> 'archivedAt',
                ''
              )::timestamptz
       )
     )
  ) or exists (
    select 1
      from jsonb_array_elements(v_transfer -> 'packs') item(value)
      join public.content_packs pack
        on pack.owner_id = v_uid
       and pack.pack_id = item.value ->> 'packId'
     where pack.created_at is distinct from
          nullif(item.value ->> 'createdAt', '')::timestamptz
        or (
          pack.updated_at =
            nullif(item.value ->> 'updatedAt', '')::timestamptz
          and pack.name is distinct from item.value ->> 'name'
        )
  ) or exists (
    select 1
      from jsonb_array_elements(v_transfer -> 'packVersions') item(value)
      join public.content_pack_versions version
        on version.owner_id = v_uid
       and version.pack_id = item.value ->> 'packId'
       and version.pack_version = item.value ->> 'packVersion'
     where version.manifest_hash is distinct from
          item.value ->> 'manifestHash'
        or version.import_plan_hash is distinct from
          item.value ->> 'importPlanHash'
        or version.manifest is distinct from item.value -> 'manifest'
        or version.created_at is distinct from
          nullif(item.value ->> 'createdAt', '')::timestamptz
  ) or exists (
    select 1
      from jsonb_array_elements(
        v_transfer -> 'packEntryDefinitions'
      ) item(value)
      join public.content_pack_entry_definitions mapping
        on mapping.owner_id = v_uid
       and mapping.pack_id = item.value ->> 'packId'
       and mapping.pack_entry_id = item.value ->> 'packEntryId'
     where mapping.definition_id is distinct from
          public._content_uuid(item.value ->> 'definitionId')
  ) or exists (
    select 1
      from jsonb_array_elements(
        v_transfer -> 'packVersionEntries'
      ) item(value)
      join public.content_pack_version_entries entry
        on entry.owner_id = v_uid
       and entry.pack_id = item.value ->> 'packId'
       and entry.pack_version = item.value ->> 'packVersion'
       and (
         entry.pack_entry_id = item.value ->> 'packEntryId'
         or entry.ordinal = (item.value ->> 'ordinal')::integer
       )
     where entry.pack_entry_id is distinct from
          item.value ->> 'packEntryId'
        or entry.definition_id is distinct from
          public._content_uuid(item.value ->> 'definitionId')
        or entry.revision_id is distinct from
          public._content_uuid(item.value ->> 'revisionId')
        or entry.category is distinct from item.value ->> 'category'
        or entry.ordinal is distinct from
          (item.value ->> 'ordinal')::integer
  ) or exists (
    select 1
      from jsonb_array_elements(v_transfer -> 'environments') item(value)
      join public.content_environment_revisions environment
        on environment.owner_id = v_uid
       and (
         environment.environment_revision_id
           = item.value ->> 'environmentRevisionId'
         or (
           environment.environment_id = item.value ->> 'environmentId'
           and environment.revision_no
             = (item.value ->> 'revisionNumber')::integer
         )
       )
     where environment.environment_revision_id is distinct from
          item.value ->> 'environmentRevisionId'
        or environment.environment_id is distinct from
          item.value ->> 'environmentId'
        or environment.revision_no is distinct from
          (item.value ->> 'revisionNumber')::integer
        or environment.environment_hash is distinct from
          item.value ->> 'environmentHash'
        or environment.revision is distinct from item.value
        or environment.created_at is distinct from
          nullif(item.value ->> 'createdAt', '')::timestamptz
  ) then
    v_failure_reason := 'custom_content_archive_identity_conflict';
  end if;

  -- Bounds apply to the prospective account graph, not merely to the incoming
  -- payload. This prevents individually valid archives from accumulating into
  -- a destination that can no longer be exported by the same contract.
  if v_failure_reason is null and (
    (
      select count(*) from public.custom_content_definitions definition
       where definition.owner_id = v_uid
         and definition.category in (
           'institutions','services','resources','stressors',
           'tradeGoods','factions','deities','traditions'
         )
    ) + (
      select count(*)
        from jsonb_array_elements(v_transfer -> 'definitions') item(value)
       where not exists (
         select 1 from public.custom_content_definitions definition
          where definition.id = public._content_uuid(item.value ->> 'id')
       )
    ) > 2000
    or (
      select count(*)
        from public.custom_content_revisions revision
        join public.custom_content_definitions definition
          on definition.owner_id = revision.owner_id
         and definition.id = revision.definition_id
       where revision.owner_id = v_uid
         and definition.category in (
           'institutions','services','resources','stressors',
           'tradeGoods','factions','deities','traditions'
         )
    ) + (
      select count(*)
        from jsonb_array_elements(v_transfer -> 'revisions') item(value)
       where not exists (
         select 1 from public.custom_content_revisions revision
          where revision.id = public._content_uuid(item.value ->> 'id')
       )
    ) > 20000
    or (
      select count(*) from public.content_packs
       where owner_id = v_uid
    ) + (
      select count(*)
        from jsonb_array_elements(v_transfer -> 'packs') item(value)
       where not exists (
         select 1 from public.content_packs pack
          where pack.owner_id = v_uid
            and pack.pack_id = item.value ->> 'packId'
       )
    ) > 128
    or (
      select count(*) from public.content_pack_versions
       where owner_id = v_uid
    ) + (
      select count(*)
        from jsonb_array_elements(v_transfer -> 'packVersions') item(value)
       where not exists (
         select 1 from public.content_pack_versions version
          where version.owner_id = v_uid
            and version.pack_id = item.value ->> 'packId'
            and version.pack_version = item.value ->> 'packVersion'
       )
    ) > 1024
    or (
      select count(*) from public.content_pack_entry_definitions
       where owner_id = v_uid
    ) + (
      select count(*)
        from jsonb_array_elements(
          v_transfer -> 'packEntryDefinitions'
        ) item(value)
       where not exists (
         select 1 from public.content_pack_entry_definitions mapping
          where mapping.owner_id = v_uid
            and mapping.pack_id = item.value ->> 'packId'
            and mapping.pack_entry_id = item.value ->> 'packEntryId'
       )
    ) > 20000
    or (
      select count(*) from public.content_pack_version_entries
       where owner_id = v_uid
    ) + (
      select count(*)
        from jsonb_array_elements(
          v_transfer -> 'packVersionEntries'
        ) item(value)
       where not exists (
         select 1 from public.content_pack_version_entries entry
          where entry.owner_id = v_uid
            and entry.pack_id = item.value ->> 'packId'
            and entry.pack_version = item.value ->> 'packVersion'
            and entry.pack_entry_id = item.value ->> 'packEntryId'
       )
    ) > 20000
    or (
      select count(*) from public.content_environment_revisions
       where owner_id = v_uid
    ) + (
      select count(*)
        from jsonb_array_elements(v_transfer -> 'environments') item(value)
       where not exists (
         select 1 from public.content_environment_revisions environment
          where environment.owner_id = v_uid
            and environment.environment_revision_id =
              item.value ->> 'environmentRevisionId'
       )
    ) > 2000
    or (
      select count(*)
        from public.application_command_journal journal
       where journal.owner_id = v_uid
         and journal.kind like 'content.%'
         and jsonb_typeof(journal.receipt) = 'object'
    ) + 1 > 10000
  ) then
    v_failure_reason := 'custom_content_archive_limit_exceeded';
  end if;

  if v_failure_reason is not null then
    v_receipt := jsonb_build_object(
      'ok', false,
      'status', 'failed',
      'reason', v_failure_reason,
      'replayed', false,
      'commandId', p_command_id,
      'fingerprint', p_fingerprint,
      'archiveFingerprint', v_archive_fingerprint,
      'activationPolicy', v_activation_policy,
      'activationAdopted', false
    );
    if not public.finalize_application_command(
      v_uid,
      p_command_id,
      p_fingerprint,
      'failed',
      null,
      v_failure_reason
    ) then
      raise exception 'custom-content archive failure did not finalize'
        using errcode = '40001';
    end if;
    return v_receipt;
  end if;

  select coalesce(jsonb_object_agg(
    item.value ->> 'id',
    case
      when definition.id is null then 'created'
      when definition.head_revision_id =
        public._content_uuid(item.value ->> 'headRevisionId')
        and definition.updated_at =
          nullif(item.value ->> 'updatedAt', '')::timestamptz
        and definition.archived_at is not distinct from
          nullif(item.value ->> 'archivedAt', '')::timestamptz
        then 'unchanged'
      when current_head.revision_no >
        (incoming_head.value ->> 'revisionNumber')::integer
        or (
          definition.head_revision_id =
            public._content_uuid(item.value ->> 'headRevisionId')
          and definition.updated_at >
            nullif(item.value ->> 'updatedAt', '')::timestamptz
        )
        then 'stale-preserved'
      else 'fast-forwarded'
    end
  ), '{}'::jsonb)
    into v_definition_outcomes
    from jsonb_array_elements(v_transfer -> 'definitions') item(value)
    left join public.custom_content_definitions definition
      on definition.owner_id = v_uid
     and definition.id = public._content_uuid(item.value ->> 'id')
    left join public.custom_content_revisions current_head
      on current_head.owner_id = definition.owner_id
     and current_head.definition_id = definition.id
     and current_head.id = definition.head_revision_id
    left join jsonb_array_elements(
      v_transfer -> 'revisions'
    ) incoming_head(value)
      on incoming_head.value ->> 'definitionId' = item.value ->> 'id'
     and incoming_head.value ->> 'id' = item.value ->> 'headRevisionId';

  -- A subtransaction makes the final exportability proof atomic with all graph
  -- writes. If the prospective account cannot be represented by this archive
  -- contract, every graph mutation rolls back while the outer command claim is
  -- still available to receive one durable failed receipt.
  begin
  insert into public.custom_content_definitions (
    id, owner_id, category, local_uid, legacy_content_id,
    head_revision_id, archived_at, created_at, updated_at
  )
  select
    public._content_uuid(item.value ->> 'id'),
    v_uid,
    item.value ->> 'category',
    item.value ->> 'localUid',
    public._content_uuid(item.value ->> 'legacyContentId'),
    null,
    nullif(item.value ->> 'archivedAt', '')::timestamptz,
    coalesce(
      nullif(item.value ->> 'createdAt', '')::timestamptz,
      v_now
    ),
    coalesce(
      nullif(item.value ->> 'updatedAt', '')::timestamptz,
      v_now
    )
  from jsonb_array_elements(v_transfer -> 'definitions') item(value)
  on conflict (id) do nothing;

  insert into public.custom_content_revisions (
    id, owner_id, definition_id, revision_no, parent_revision_id,
    schema_version, content_hash, data, command_id, created_at
  )
  select
    public._content_uuid(item.value ->> 'id'),
    v_uid,
    public._content_uuid(item.value ->> 'definitionId'),
    (item.value ->> 'revisionNumber')::integer,
    public._content_uuid(item.value ->> 'parentRevisionId'),
    1,
    item.value ->> 'contentHash',
    item.value -> 'data',
    p_command_id,
    coalesce(
      nullif(item.value ->> 'createdAt', '')::timestamptz,
      v_now
    )
  from jsonb_array_elements(v_transfer -> 'revisions') item(value)
  on conflict (id) do nothing;

  update public.custom_content_definitions definition
     set head_revision_id =
           public._content_uuid(item.value ->> 'headRevisionId'),
         archived_at = case
           when definition.head_revision_id is null
             or (
               definition.updated_at = prior_lifecycle.updated_at
               and definition.archived_at is not distinct from
                 prior_lifecycle.archived_at
             )
           then nullif(item.value ->> 'archivedAt', '')::timestamptz
           else definition.archived_at
         end,
         updated_at = case
           when definition.head_revision_id is null
             or (
               definition.updated_at = prior_lifecycle.updated_at
               and definition.archived_at is not distinct from
                 prior_lifecycle.archived_at
             )
           then coalesce(
             nullif(item.value ->> 'updatedAt', '')::timestamptz,
             v_now
           )
           else definition.updated_at
         end
    from jsonb_array_elements(v_transfer -> 'definitions') item(value)
    join public.custom_content_revisions incoming_head
      on incoming_head.owner_id = v_uid
     and incoming_head.id =
       public._content_uuid(item.value ->> 'headRevisionId')
    left join (
      select distinct on (mapping.value ->> 'destinationId')
        mapping.value ->> 'destinationId' as destination_id,
        nullif(source.value ->> 'archivedAt', '')::timestamptz
          as archived_at,
        nullif(source.value ->> 'updatedAt', '')::timestamptz
          as updated_at
        from public.custom_content_archive_imports imported
        cross join lateral jsonb_array_elements(
          imported.identity_map -> 'definitionIds'
        ) mapping(value)
        join lateral jsonb_array_elements(
          imported.source_archive #> '{ledger,definitions}'
        ) source(value)
          on source.value ->> 'id' = mapping.value ->> 'sourceId'
       where imported.owner_id = v_uid
         and imported.source_key = v_source_key
       order by
         mapping.value ->> 'destinationId',
         imported.imported_at desc
    ) prior_lifecycle
      on prior_lifecycle.destination_id = item.value ->> 'id'
   where definition.owner_id = v_uid
     and definition.id = public._content_uuid(item.value ->> 'id')
     and (
       definition.head_revision_id is null
       or (
         select current_head.revision_no
           from public.custom_content_revisions current_head
          where current_head.owner_id = v_uid
            and current_head.id = definition.head_revision_id
       ) < incoming_head.revision_no
       or (
         definition.head_revision_id = incoming_head.id
         and definition.updated_at <
           nullif(item.value ->> 'updatedAt', '')::timestamptz
       )
     );

  insert into public.content_packs (
    owner_id, pack_id, name, created_at, updated_at
  )
  select
    v_uid,
    item.value ->> 'packId',
    item.value ->> 'name',
    coalesce(
      nullif(item.value ->> 'createdAt', '')::timestamptz,
      v_now
    ),
    coalesce(
      nullif(item.value ->> 'updatedAt', '')::timestamptz,
      v_now
    )
  from jsonb_array_elements(v_transfer -> 'packs') item(value)
  on conflict (owner_id, pack_id) do update
    set name = case
          when excluded.updated_at > content_packs.updated_at
            then excluded.name
          else content_packs.name
        end,
        updated_at = greatest(
          content_packs.updated_at,
          excluded.updated_at
        );

  insert into public.content_pack_versions (
    owner_id, pack_id, pack_version, manifest_hash, import_plan_hash,
    manifest, command_id, created_at
  )
  select
    v_uid,
    item.value ->> 'packId',
    item.value ->> 'packVersion',
    item.value ->> 'manifestHash',
    item.value ->> 'importPlanHash',
    item.value -> 'manifest',
    p_command_id,
    coalesce(
      nullif(item.value ->> 'createdAt', '')::timestamptz,
      v_now
    )
  from jsonb_array_elements(v_transfer -> 'packVersions') item(value)
  on conflict (owner_id, pack_id, pack_version) do nothing;

  insert into public.content_pack_entry_definitions (
    owner_id, pack_id, pack_entry_id, definition_id, created_at
  )
  select
    v_uid,
    item.value ->> 'packId',
    item.value ->> 'packEntryId',
    public._content_uuid(item.value ->> 'definitionId'),
    v_now
  from jsonb_array_elements(
    v_transfer -> 'packEntryDefinitions'
  ) item(value)
  on conflict (owner_id, pack_id, pack_entry_id) do nothing;

  insert into public.content_pack_version_entries (
    owner_id, pack_id, pack_version, pack_entry_id,
    definition_id, revision_id, category, ordinal
  )
  select
    v_uid,
    item.value ->> 'packId',
    item.value ->> 'packVersion',
    item.value ->> 'packEntryId',
    public._content_uuid(item.value ->> 'definitionId'),
    public._content_uuid(item.value ->> 'revisionId'),
    item.value ->> 'category',
    (item.value ->> 'ordinal')::integer
  from jsonb_array_elements(
    v_transfer -> 'packVersionEntries'
  ) item(value)
  on conflict (owner_id, pack_id, pack_version, pack_entry_id) do nothing;

  if v_activation_adopted then
    update public.content_packs pack
       set active_pack_version = item.value ->> 'activePackVersion',
           active_manifest_hash = item.value ->> 'activeManifestHash'
      from jsonb_array_elements(v_transfer -> 'packs') item(value)
     where pack.owner_id = v_uid
       and pack.pack_id = item.value ->> 'packId'
       and item.value ->> 'activePackVersion' is not null;
  end if;

  insert into public.content_environments (
    owner_id, environment_id, created_at, updated_at
  )
  select distinct on (item.value ->> 'environmentId')
    v_uid,
    item.value ->> 'environmentId',
    coalesce(
      nullif(item.value ->> 'createdAt', '')::timestamptz,
      v_now
    ),
    v_now
  from jsonb_array_elements(v_transfer -> 'environments') item(value)
  order by
    item.value ->> 'environmentId',
    (item.value ->> 'revisionNumber')::integer
  on conflict (owner_id, environment_id) do update
    set updated_at = excluded.updated_at;

  insert into public.content_environment_revisions (
    owner_id, environment_id, environment_revision_id,
    revision_no, environment_hash, revision, command_id, created_at
  )
  select
    v_uid,
    item.value ->> 'environmentId',
    item.value ->> 'environmentRevisionId',
    (item.value ->> 'revisionNumber')::integer,
    item.value ->> 'environmentHash',
    item.value,
    p_command_id,
    coalesce(
      nullif(item.value ->> 'createdAt', '')::timestamptz,
      v_now
    )
  from jsonb_array_elements(v_transfer -> 'environments') item(value)
  on conflict (owner_id, environment_revision_id) do nothing;

  if v_activation_adopted
    and v_transfer ->> 'activeEnvironmentRevisionId' is not null
  then
    insert into public.content_environment_activations (
      owner_id, environment_revision_id, activated_at
    ) values (
      v_uid,
      v_transfer ->> 'activeEnvironmentRevisionId',
      v_now
    )
    on conflict (owner_id) do update
      set environment_revision_id = excluded.environment_revision_id,
          activated_at = excluded.activated_at;
  end if;

  insert into public.custom_content_archive_imports (
    owner_id, archive_fingerprint, source_key,
    source_ledger_fingerprint, provenance_fingerprint, source_archive,
    identity_map, command_id, imported_at
  ) values (
    v_uid, v_archive_fingerprint, v_source_key,
    v_source_ledger_fingerprint,
    v_provenance_fingerprint,
    v_archive,
    v_identity_map, p_command_id, v_now
  )
  on conflict (
    owner_id, source_key, source_ledger_fingerprint, provenance_fingerprint
  ) do nothing;

  v_receipt := jsonb_build_object(
    'ok', true,
    'status', 'applied',
    'reason', null,
    'replayed', false,
    'commandId', p_command_id,
    'fingerprint', p_fingerprint,
    'archiveFingerprint', v_archive_fingerprint,
    'activationPolicy', v_activation_policy,
    'activationAdopted', v_activation_adopted,
    'identityMap', v_identity_map,
    'definitionOutcomes', v_definition_outcomes,
    'counts', jsonb_build_object(
      'definitions', jsonb_array_length(v_transfer -> 'definitions'),
      'revisions', jsonb_array_length(v_transfer -> 'revisions'),
      'packs', jsonb_array_length(v_transfer -> 'packs'),
      'packVersions', jsonb_array_length(v_transfer -> 'packVersions'),
      'packEntries', jsonb_array_length(v_transfer -> 'packVersionEntries'),
      'environments', jsonb_array_length(v_transfer -> 'environments')
    ),
    'importedAt', public._custom_content_archive_timestamp(v_now)
  );
  if not public.finalize_application_command(
    v_uid,
    p_command_id,
    p_fingerprint,
    'applied',
    v_receipt,
    null
  ) then
    raise exception 'custom-content archive import did not finalize'
      using errcode = '40001';
  end if;

  v_exported_archive := public.export_custom_content_archive(v_uid);
  if octet_length(v_exported_archive::text) > 16 * 1024 * 1024
    or not public._custom_content_archive_source_valid(
      v_exported_archive -> 'source'
    )
    or not public._custom_content_archive_ledger_valid(
      v_exported_archive -> 'ledger',
      true,
      true
    )
    or (
      with recursive provenance(value) as (
        select item.value
          from jsonb_array_elements(
            v_exported_archive -> 'auditProvenance'
          ) item(value)
        union all
        select child.value
          from provenance parent
          cross join lateral jsonb_array_elements(
            parent.value -> 'auditProvenance'
          ) child(value)
      )
      select count(*) > 128 from provenance
    )
  then
    raise exception 'prospective custom-content archive exceeds contract'
      using errcode = 'SF001';
  end if;
  exception when sqlstate 'SF001' then
    v_failure_reason := 'custom_content_archive_limit_exceeded';
  end;

  if v_failure_reason is not null then
    v_receipt := jsonb_build_object(
      'ok', false,
      'status', 'failed',
      'reason', v_failure_reason,
      'replayed', false,
      'commandId', p_command_id,
      'fingerprint', p_fingerprint,
      'archiveFingerprint', v_archive_fingerprint,
      'activationPolicy', v_activation_policy,
      'activationAdopted', false
    );
    if not public.finalize_application_command(
      v_uid,
      p_command_id,
      p_fingerprint,
      'failed',
      null,
      v_failure_reason
    ) then
      raise exception 'custom-content archive failure did not finalize'
        using errcode = '40001';
    end if;
    return v_receipt;
  end if;
  return v_receipt;
end;
$$;

create or replace function public.export_custom_content_archive(
  p_expected_owner uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz := clock_timestamp();
  v_ledger jsonb;
  v_source jsonb;
  v_provenance jsonb;
  v_core jsonb;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if p_expected_owner is null or p_expected_owner <> v_uid then
    raise exception 'custom-content archive owner changed'
      using errcode = '42501';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'archiveFingerprint', imported.archive_fingerprint,
    'source', imported.source_archive -> 'source',
    'commandReceipts',
      imported.source_archive #> '{ledger,commandReceipts}',
    'auditProvenance',
      imported.source_archive -> 'auditProvenance'
  ) order by imported.imported_at, imported.archive_fingerprint), '[]'::jsonb)
    into v_provenance
    from public.custom_content_archive_imports imported
   where imported.owner_id = v_uid;

  v_ledger := jsonb_build_object(
    'schemaVersion', 1,
    'definitions', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', definition.id,
        'category', definition.category,
        'localUid', definition.local_uid,
        'headRevisionId', definition.head_revision_id,
        'archivedAt', public._custom_content_archive_timestamp(
          definition.archived_at
        ),
        'createdAt', public._custom_content_archive_timestamp(
          definition.created_at
        ),
        'updatedAt', public._custom_content_archive_timestamp(
          definition.updated_at
        ),
        'legacyContentId', definition.legacy_content_id
      ) order by definition.id), '[]'::jsonb)
        from public.custom_content_definitions definition
       where definition.owner_id = v_uid
         and definition.category in (
           'institutions','services','resources','stressors',
           'tradeGoods','factions','deities','traditions'
         )
    ),
    'revisions', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'schemaVersion', revision.schema_version,
        'id', revision.id,
        'definitionId', revision.definition_id,
        'category', definition.category,
        'revisionNumber', revision.revision_no,
        'parentRevisionId', revision.parent_revision_id,
        'contentHash', revision.content_hash,
        'data', revision.data,
        'createdAt', public._custom_content_archive_timestamp(
          revision.created_at
        )
      ) order by revision.definition_id, revision.revision_no), '[]'::jsonb)
        from public.custom_content_revisions revision
        join public.custom_content_definitions definition
          on definition.owner_id = revision.owner_id
         and definition.id = revision.definition_id
       where revision.owner_id = v_uid
         and definition.category in (
           'institutions','services','resources','stressors',
           'tradeGoods','factions','deities','traditions'
         )
    ),
    'packs', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'packId', pack.pack_id,
        'name', pack.name,
        'activePackVersion', pack.active_pack_version,
        'activeManifestHash', pack.active_manifest_hash,
        'createdAt', public._custom_content_archive_timestamp(
          pack.created_at
        ),
        'updatedAt', public._custom_content_archive_timestamp(
          pack.updated_at
        )
      ) order by pack.pack_id), '[]'::jsonb)
        from public.content_packs pack
       where pack.owner_id = v_uid
    ),
    'packVersions', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'packId', version.pack_id,
        'packVersion', version.pack_version,
        'manifestHash', version.manifest_hash,
        'importPlanHash', version.import_plan_hash,
        'manifest', version.manifest,
        'createdAt', public._custom_content_archive_timestamp(
          version.created_at
        )
      ) order by version.pack_id, version.pack_version), '[]'::jsonb)
        from public.content_pack_versions version
       where version.owner_id = v_uid
    ),
    'packEntryDefinitions', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'packId', mapping.pack_id,
        'packEntryId', mapping.pack_entry_id,
        'definitionId', mapping.definition_id
      ) order by mapping.pack_id, mapping.pack_entry_id), '[]'::jsonb)
        from public.content_pack_entry_definitions mapping
       where mapping.owner_id = v_uid
    ),
    'packVersionEntries', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'packId', entry.pack_id,
        'packVersion', entry.pack_version,
        'packEntryId', entry.pack_entry_id,
        'definitionId', entry.definition_id,
        'revisionId', entry.revision_id,
        'category', entry.category,
        'ordinal', entry.ordinal
      ) order by entry.pack_id, entry.pack_version, entry.ordinal), '[]'::jsonb)
        from public.content_pack_version_entries entry
       where entry.owner_id = v_uid
    ),
    'environments', (
      select coalesce(jsonb_agg(
        environment.revision
        order by environment.environment_id, environment.revision_no
      ), '[]'::jsonb)
        from public.content_environment_revisions environment
       where environment.owner_id = v_uid
    ),
    'activeEnvironmentRevisionId', (
      select activation.environment_revision_id
        from public.content_environment_activations activation
       where activation.owner_id = v_uid
    ),
    'commandReceipts', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'commandId', journal.command_id,
        'fingerprint', journal.fingerprint,
        'receipt', journal.receipt
      ) order by journal.command_id), '[]'::jsonb)
        from public.application_command_journal journal
       where journal.owner_id = v_uid
         and journal.kind like 'content.%'
         and jsonb_typeof(journal.receipt) = 'object'
    )
  );
  v_source := jsonb_build_object(
    'type', 'cloud-account',
    'key', 'cloud:' || v_uid::text,
    'exportedAt', public._custom_content_archive_timestamp(v_now),
    'ledgerFingerprint', public._content_sha256(v_ledger)
  );
  v_core := jsonb_build_object(
    'format', 'settlementforge.custom-content-ledger',
    'formatVersion', 1,
    'source', v_source,
    'ledger', v_ledger,
    'auditProvenance', v_provenance
  );
  return v_core || jsonb_build_object(
    'archiveFingerprint',
    public._content_sha256(v_core)
  );
end;
$$;

revoke all on function public._custom_content_archive_ledger_valid(
  jsonb, boolean, boolean
) from public, anon, authenticated, service_role;
revoke all on function public._custom_content_archive_timestamp(timestamptz)
  from public, anon, authenticated, service_role;
revoke all on function public._custom_content_archive_timestamp_valid(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public._custom_content_archive_source_valid(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public._custom_content_archive_destination_hash(
  uuid, text, text, text
) from public, anon, authenticated, service_role;
revoke all on function public._custom_content_archive_destination_uuid(
  uuid, text, text, text
) from public, anon, authenticated, service_role;
revoke all on function public._custom_content_archive_destination_text(
  text, uuid, text, text
) from public, anon, authenticated, service_role;
revoke all on function public._custom_content_archive_remap_data(jsonb, jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public.import_custom_content_archive(
  uuid, text, text, jsonb
) from public, anon;
grant execute on function public.import_custom_content_archive(
  uuid, text, text, jsonb
) to authenticated, service_role;
revoke all on function public.export_custom_content_archive(uuid)
  from public, anon;
grant execute on function public.export_custom_content_archive(uuid)
  to authenticated, service_role;
