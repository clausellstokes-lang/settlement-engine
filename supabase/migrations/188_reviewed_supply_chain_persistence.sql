-- ────────────────────────────────────────────────────────────────────────────
-- 188_reviewed_supply_chain_persistence.sql — immutable reviewed-derived
-- supply-chain authority.
--
-- A supply chain is discovered from exact custom-definition revisions. It is
-- neither an authorable definition nor a content-pack entry. This migration
-- gives that derived artifact one narrow persistence lane while retaining the
-- shared immutable definition/revision ledger for history, environments,
-- campaign cutoffs, archive transfer, and account portability.
--
-- The trust rules are deliberately symmetric with the client:
--   • the graph and every custom-node revision tuple are admitted exactly;
--   • confirmation is bound to the canonical graph projection fingerprint;
--   • one owner may have only one artifact identity per canonical chain;
--   • compare-and-swap and application-command receipts cover every mutation;
--   • generic authoring lifecycle and packs cannot mutate reviewed artifacts;
--   • archive import rewrites nested custom identities and re-confirms the
--     destination graph instead of copying stale source evidence.
--
-- @rollback:
--   Forward-fix only after first use. Reviewed revisions, environment
--   references, campaign cutoffs, and archive receipts are durable evidence.
--
-- Execution map:
--   1. schema generation plus Unicode text and exact record contracts;
--   2. archive graph proof and nested identity remap;
--   3. dedicated reviewed command RPC and generic-authoring fence;
--   4. environment and campaign-binding category widening;
--   5. legacy quarantine, lifecycle constraint, and privileges;
--   6. archive ledger, export, and transactional import widening;
--   7. removal of the temporary asserted patch helper.
-- ────────────────────────────────────────────────────────────────────────────

-- Reviewed lifecycle state belongs to the stable definition identity, not to
-- immutable revision content. A dedicated generation closes the archive /
-- restore ABA hole: the head may return to the same revision, but the
-- compare-and-swap generation never moves backward.
alter table public.custom_content_definitions
  add column if not exists reviewed_lifecycle_version integer;

-- A durable command claim is necessary but not sufficient mutation authority:
-- an abandoned claimed row must never authorize a later transaction. The two
-- reviewed write lanes stamp their exact current xid here immediately before
-- mutation; no client role can update the journal directly.
alter table public.application_command_journal
  add column if not exists authority_transaction_id bigint;

-- Migration 183 gave service_role direct journal DML for generic operational
-- recovery. Reviewed writes now treat the journal's current transaction stamp
-- as part of their authority proof, so that grant would let an edge caller mint
-- the proof outside the owning SECURITY DEFINER command. Service code may read
-- receipts and invoke command RPCs; only those RPCs may mutate journal rows.
revoke insert, update, delete
  on table public.application_command_journal
  from service_role;
grant select
  on table public.application_command_journal
  to service_role;
revoke execute on function public.claim_application_command(
  uuid, text, text, text, uuid, timestamptz
) from service_role;
revoke execute on function public.finalize_application_command(
  uuid, text, text, text, jsonb, text
) from service_role;
revoke execute on function public.mark_application_command_reconcile(
  uuid, text, text, text
) from service_role;

-- Imported source envelopes are provenance, not a record of what won a merge.
-- Persist the resulting destination lifecycle separately so a later stale
-- source envelope cannot poison fast-forward authorization.
alter table public.custom_content_archive_imports
  add column if not exists destination_definition_lifecycles jsonb
    not null default '{}'::jsonb
    check (jsonb_typeof(destination_definition_lifecycles) = 'object');

-- Archive v1 deliberately admits null timestamps so older/local ledgers remain
-- recoverable. SQL rows cannot retain that absence because their temporal
-- columns are NOT NULL. Normalize null once at the destination boundary:
-- preserve the already-persisted value for a deterministic identity, otherwise
-- use a fixed epoch. The source envelope remains byte-exact audit evidence.
create or replace function
  public._custom_content_archive_import_timestamp(
    p_value jsonb,
    p_existing timestamptz
  )
returns jsonb
language sql
immutable
set search_path = public, pg_temp
as $$
  select case
    when p_value is null or jsonb_typeof(p_value) = 'null'
      then to_jsonb(public._custom_content_archive_timestamp(coalesce(
        p_existing,
        timestamptz '1970-01-01 00:00:00+00'
      )))
    else p_value
  end
$$;

create or replace function
  public._custom_content_archive_normalize_transfer_timestamps(
    p_owner uuid,
    p_transfer jsonb
  )
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_definitions jsonb;
  v_revisions jsonb;
  v_packs jsonb;
  v_pack_versions jsonb;
  v_environments jsonb;
begin
  select coalesce(jsonb_agg(
    item.value || jsonb_build_object(
      'createdAt',
      public._custom_content_archive_import_timestamp(
        item.value -> 'createdAt',
        definition.created_at
      ),
      'updatedAt',
      public._custom_content_archive_import_timestamp(
        item.value -> 'updatedAt',
        definition.updated_at
      )
    )
    order by item.ordinal
  ), '[]'::jsonb)
    into v_definitions
    from jsonb_array_elements(p_transfer -> 'definitions')
      with ordinality item(value, ordinal)
    left join public.custom_content_definitions definition
      on definition.owner_id = p_owner
     and definition.id = public._content_uuid(item.value ->> 'id');

  select coalesce(jsonb_agg(
    item.value || jsonb_build_object(
      'createdAt',
      public._custom_content_archive_import_timestamp(
        item.value -> 'createdAt',
        revision.created_at
      )
    )
    order by item.ordinal
  ), '[]'::jsonb)
    into v_revisions
    from jsonb_array_elements(p_transfer -> 'revisions')
      with ordinality item(value, ordinal)
    left join public.custom_content_revisions revision
      on revision.owner_id = p_owner
     and revision.id = public._content_uuid(item.value ->> 'id');

  select coalesce(jsonb_agg(
    item.value || jsonb_build_object(
      'createdAt',
      public._custom_content_archive_import_timestamp(
        item.value -> 'createdAt',
        pack.created_at
      ),
      'updatedAt',
      public._custom_content_archive_import_timestamp(
        item.value -> 'updatedAt',
        pack.updated_at
      )
    )
    order by item.ordinal
  ), '[]'::jsonb)
    into v_packs
    from jsonb_array_elements(p_transfer -> 'packs')
      with ordinality item(value, ordinal)
    left join public.content_packs pack
      on pack.owner_id = p_owner
     and pack.pack_id = item.value ->> 'packId';

  select coalesce(jsonb_agg(
    item.value || jsonb_build_object(
      'createdAt',
      public._custom_content_archive_import_timestamp(
        item.value -> 'createdAt',
        version.created_at
      )
    )
    order by item.ordinal
  ), '[]'::jsonb)
    into v_pack_versions
    from jsonb_array_elements(p_transfer -> 'packVersions')
      with ordinality item(value, ordinal)
    left join public.content_pack_versions version
      on version.owner_id = p_owner
     and version.pack_id = item.value ->> 'packId'
     and version.pack_version = item.value ->> 'packVersion';

  -- `createdAt` is deliberately excluded from the environment hash. It is
  -- transport metadata, so normalizing a legacy null does not rewrite the
  -- environment's semantic identity.
  select coalesce(jsonb_agg(
    item.value || jsonb_build_object(
      'createdAt',
      public._custom_content_archive_import_timestamp(
        item.value -> 'createdAt',
        environment.created_at
      )
    )
    order by item.ordinal
  ), '[]'::jsonb)
    into v_environments
    from jsonb_array_elements(p_transfer -> 'environments')
      with ordinality item(value, ordinal)
    left join public.content_environment_revisions environment
      on environment.owner_id = p_owner
     and environment.environment_revision_id =
       item.value ->> 'environmentRevisionId';

  return p_transfer || jsonb_build_object(
    'definitions', v_definitions,
    'revisions', v_revisions,
    'packs', v_packs,
    'packVersions', v_pack_versions,
    'environments', v_environments
  );
end;
$$;

revoke all on function
  public._custom_content_archive_import_timestamp(jsonb, timestamptz)
  from public, anon, authenticated, service_role;
revoke all on function
  public._custom_content_archive_normalize_transfer_timestamps(uuid, jsonb)
  from public, anon, authenticated, service_role;

-- PostgreSQL can retain microseconds that the portable archive deliberately
-- rounds to milliseconds. Canonicalize ledger-facing columns before comparing
-- them with JSON so a real-PG 187 row such as `.123456Z` does not conflict
-- with its own canonical `.123Z` representation on the next generation.
update public.custom_content_definitions
   set created_at = date_trunc('milliseconds', created_at),
       updated_at = date_trunc('milliseconds', updated_at)
 where created_at <> date_trunc('milliseconds', created_at)
    or updated_at <> date_trunc('milliseconds', updated_at);
update public.custom_content_revisions
   set created_at = date_trunc('milliseconds', created_at)
 where created_at <> date_trunc('milliseconds', created_at);
update public.content_packs
   set created_at = date_trunc('milliseconds', created_at),
       updated_at = date_trunc('milliseconds', updated_at)
 where created_at <> date_trunc('milliseconds', created_at)
    or updated_at <> date_trunc('milliseconds', updated_at);
update public.content_pack_versions
   set created_at = date_trunc('milliseconds', created_at)
 where created_at <> date_trunc('milliseconds', created_at);
update public.content_environments
   set created_at = date_trunc('milliseconds', created_at),
       updated_at = date_trunc('milliseconds', updated_at)
 where created_at <> date_trunc('milliseconds', created_at)
    or updated_at <> date_trunc('milliseconds', updated_at);
update public.content_environment_revisions
   set created_at = date_trunc('milliseconds', created_at)
 where created_at <> date_trunc('milliseconds', created_at);

-- Migration 187 persisted a null environment `createdAt` as a row timestamp
-- while retaining null inside the immutable JSON. Bring those two
-- representations together before the patched equality preflight runs.
-- `createdAt` is outside the environment hash, so semantic identity is stable.
update public.content_environment_revisions revision
   set revision = jsonb_set(
     revision.revision,
     '{createdAt}',
     to_jsonb(public._custom_content_archive_timestamp(revision.created_at)),
     false
   )
 where jsonb_typeof(revision.revision -> 'createdAt') = 'null';

-- Migration 187 receipts predate destination lifecycle snapshots. Backfill
-- every receipt whose mapped head and lifecycle still exactly match the
-- destination. This intentionally skips locally changed rows, while retaining
-- an older matching generation when a later stale import was preserved.
update public.custom_content_archive_imports imported
   set destination_definition_lifecycles = (
     select coalesce(jsonb_object_agg(
       definition.id::text,
       jsonb_build_object(
         'headRevisionId', definition.head_revision_id::text,
         'archivedAt', definition.archived_at,
         'updatedAt', definition.updated_at
       )
     ), '{}'::jsonb)
       from jsonb_array_elements(
         imported.identity_map -> 'definitionIds'
       ) mapping(value)
       join jsonb_array_elements(
         imported.source_archive #> '{ledger,definitions}'
       ) source_definition(value)
         on source_definition.value ->> 'id' =
           mapping.value ->> 'sourceId'
       join jsonb_array_elements(
         imported.identity_map -> 'revisionIds'
       ) head_mapping(value)
         on head_mapping.value ->> 'sourceId' =
           source_definition.value ->> 'headRevisionId'
       join public.custom_content_definitions definition
         on definition.owner_id = imported.owner_id
        and definition.id = public._content_uuid(
          mapping.value ->> 'destinationId'
        )
        and definition.head_revision_id = public._content_uuid(
          head_mapping.value ->> 'destinationId'
        )
        and definition.archived_at is not distinct from nullif(
          source_definition.value ->> 'archivedAt',
          ''
        )::timestamptz
        and definition.updated_at = coalesce(
          nullif(
            source_definition.value ->> 'updatedAt',
            ''
          )::timestamptz,
          date_trunc('milliseconds', imported.imported_at)
        )
   );

-- PostgreSQL `btrim` recognizes only ASCII space by default. This helper
-- mirrors ECMAScript TrimString boundaries exactly: TAB-LF-VT-FF-CR, space,
-- NBSP, OGHAM SPACE MARK, U+2000..U+200A, LS, PS, NARROW NBSP, MEDIUM
-- MATHEMATICAL SPACE, IDEOGRAPHIC SPACE, and BOM. Internal whitespace remains
-- meaningful and Unicode length is measured in code points on both sides.
create or replace function public._reviewed_supply_chain_text_valid(
  p_value jsonb,
  p_max_length integer,
  p_nullable boolean default false
)
returns boolean
language sql
immutable
set search_path = public, pg_temp
as $$
  select case
    when jsonb_typeof(p_value) = 'null' then p_nullable
    else jsonb_typeof(p_value) = 'string'
      and p_value #>> '{}' <> ''
      and not (
        coalesce(ascii(nullif(left(p_value #>> '{}', 1), '')), 32)
          between 9 and 13
        or coalesce(ascii(nullif(left(p_value #>> '{}', 1), '')), 32)
          in (
            32, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197,
            8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287,
            12288, 65279
          )
      )
      and not (
        coalesce(ascii(nullif(right(p_value #>> '{}', 1), '')), 32)
          between 9 and 13
        or coalesce(ascii(nullif(right(p_value #>> '{}', 1), '')), 32)
          in (
            32, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197,
            8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287,
            12288, 65279
          )
      )
      and char_length(p_value #>> '{}') <= p_max_length
  end
$$;

create or replace function public._reviewed_supply_chain_text_array_valid(
  p_value jsonb,
  p_max_entries integer
)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
begin
  return jsonb_typeof(p_value) = 'array'
    and jsonb_array_length(p_value) <= p_max_entries
    and not exists (
      select 1
        from jsonb_array_elements(p_value) item(value)
       where not public._reviewed_supply_chain_text_valid(
         item.value, 240, false
       )
    );
exception when others then
  return false;
end;
$$;

create or replace function public._reviewed_supply_chain_id_for_nodes(
  p_nodes jsonb
)
returns text
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_uids jsonb;
  v_readable text;
begin
  select jsonb_agg(to_jsonb(node.value ->> 'uid') order by node.ordinal),
         string_agg(node.value ->> 'uid', '-' order by node.ordinal)
    into v_uids, v_readable
    from jsonb_array_elements(p_nodes)
      with ordinality node(value, ordinal);
  -- `lower()` is locale/Unicode-table dependent and does not match
  -- JavaScript's case folding. The readable component admits ASCII only, so
  -- translate exactly A-Z and treat every non-ASCII code point as a delimiter.
  v_readable := regexp_replace(
    translate(
      coalesce(v_readable, ''),
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      'abcdefghijklmnopqrstuvwxyz'
    ),
    '[^a-z0-9]+',
    '-',
    'g'
  );
  v_readable := trim(both '-' from v_readable);
  if v_readable = '' then v_readable := 'chain'; end if;
  v_readable := regexp_replace(
    substring(v_readable from 1 for 120),
    '-+$',
    ''
  );
  if v_readable = '' then v_readable := 'chain'; end if;
  return 'discovered.' || v_readable || '.'
    || public._content_sha256(jsonb_build_object('nodeUids', v_uids));
exception when others then
  return null;
end;
$$;

create or replace function public._reviewed_supply_chain_projection(
  p_data jsonb
)
returns jsonb
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_nodes jsonb;
  v_edges jsonb;
  v_imports jsonb;
  v_exports jsonb;
begin
  select jsonb_agg(jsonb_build_object(
    'uid', node.value -> 'uid',
    'name', node.value -> 'name',
    'kind', node.value -> 'kind',
    'role', node.value -> 'role',
    'refId', node.value -> 'refId',
    'source', node.value -> 'source',
    'tierMin', node.value -> 'tierMin',
    'tierMax', node.value -> 'tierMax',
    'definitionId', node.value -> 'definitionId',
    'revisionId', node.value -> 'revisionId',
    'revisionNumber', node.value -> 'revisionNumber',
    'contentHash', node.value -> 'contentHash'
  ) order by node.ordinal)
    into v_nodes
    from jsonb_array_elements(p_data #> '{discovered,nodes}')
      with ordinality node(value, ordinal);

  select coalesce(jsonb_agg(jsonb_build_object(
    'from', edge.value -> 'from',
    'to', edge.value -> 'to',
    'commodity', edge.value -> 'commodity'
  ) order by edge.ordinal), '[]'::jsonb)
    into v_edges
    from jsonb_array_elements(p_data #> '{discovered,edges}')
      with ordinality edge(value, ordinal);

  select coalesce(jsonb_agg(jsonb_build_object(
    'label', endpoint.value -> 'label',
    'source', endpoint.value -> 'source',
    'counterpart', endpoint.value -> 'counterpart'
  ) order by endpoint.ordinal), '[]'::jsonb)
    into v_imports
    from jsonb_array_elements(
      p_data #> '{discovered,tradeEndpoints,imports}'
    ) with ordinality endpoint(value, ordinal);

  select coalesce(jsonb_agg(jsonb_build_object(
    'label', endpoint.value -> 'label',
    'source', endpoint.value -> 'source',
    'counterpart', endpoint.value -> 'counterpart'
  ) order by endpoint.ordinal), '[]'::jsonb)
    into v_exports
    from jsonb_array_elements(
      p_data #> '{discovered,tradeEndpoints,exports}'
    ) with ordinality endpoint(value, ordinal);

  return jsonb_build_object(
    'schemaVersion', 1,
    'chainId', p_data -> 'chainId',
    'nodes', v_nodes,
    'edges', v_edges,
    'tradeEndpoints', jsonb_build_object(
      'imports', v_imports,
      'exports', v_exports
    )
  );
exception when others then
  return null;
end;
$$;

create or replace function public._reviewed_supply_chain_projection_fingerprint(
  p_data jsonb
)
returns text
language sql
immutable
set search_path = public, pg_temp
as $$
  select public._content_sha256(
    public._reviewed_supply_chain_projection(p_data)
  )
$$;

create or replace function public._reviewed_supply_chain_content_hash(
  p_data jsonb
)
returns text
language sql
immutable
set search_path = public, pg_temp
as $$
  select public._content_sha256(jsonb_build_object(
    'schemaVersion', 1,
    'category', 'supplyChains',
    'data', p_data
  ))
$$;

create or replace function public._reviewed_supply_chain_record_valid(
  p_data jsonb
)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_nodes jsonb;
  v_edges jsonb;
  v_endpoints jsonb;
  v_verification jsonb;
  v_review jsonb;
begin
  if jsonb_typeof(p_data) is distinct from 'object'
    or not (p_data ?& array[
      'chainId','status','label','resource','resourceIcon',
      'resourceDepleted','processingInstitutions','outputs','services',
      'exportable','entrepot','upstreamMissing','upstreamNote',
      'needLabel','needIcon','needColor','discovered','verification'
    ])
    or (p_data - array[
      'chainId','status','label','resource','resourceIcon',
      'resourceDepleted','processingInstitutions','outputs','services',
      'exportable','entrepot','upstreamMissing','upstreamNote',
      'needLabel','needIcon','needColor','discovered','verification'
    ]) <> '{}'::jsonb
    or not public._reviewed_supply_chain_text_valid(
      p_data -> 'chainId', 240, false
    )
    or p_data ->> 'status' is distinct from 'confirmed'
    or not public._reviewed_supply_chain_text_valid(
      p_data -> 'label', 1000, false
    )
    or not public._reviewed_supply_chain_text_valid(
      p_data -> 'resource', 240, true
    )
    or jsonb_typeof(p_data -> 'resourceIcon') is distinct from 'string'
    or char_length(p_data ->> 'resourceIcon') > 240
    or jsonb_typeof(p_data -> 'resourceDepleted') is distinct from 'boolean'
    or not public._reviewed_supply_chain_text_array_valid(
      p_data -> 'processingInstitutions', 128
    )
    or not public._reviewed_supply_chain_text_array_valid(
      p_data -> 'outputs', 128
    )
    or not public._reviewed_supply_chain_text_array_valid(
      p_data -> 'services', 128
    )
    or jsonb_typeof(p_data -> 'exportable') is distinct from 'boolean'
    or jsonb_typeof(p_data -> 'entrepot') is distinct from 'boolean'
    or not public._reviewed_supply_chain_text_array_valid(
      p_data -> 'upstreamMissing', 128
    )
    or jsonb_typeof(p_data -> 'upstreamNote') is distinct from 'string'
    or char_length(p_data ->> 'upstreamNote') > 4000
    or not public._reviewed_supply_chain_text_valid(
      p_data -> 'needLabel', 240, false
    )
    or not public._reviewed_supply_chain_text_valid(
      p_data -> 'needIcon', 240, false
    )
    or not public._reviewed_supply_chain_text_valid(
      p_data -> 'needColor', 240, false
    )
  then
    return false;
  end if;

  if jsonb_typeof(p_data -> 'discovered') is distinct from 'object'
    or not ((p_data -> 'discovered') ?& array[
      'nodes','edges','tradeEndpoints'
    ])
    or ((p_data -> 'discovered') - array[
      'nodes','edges','tradeEndpoints'
    ]) <> '{}'::jsonb
  then
    return false;
  end if;
  v_nodes := p_data #> '{discovered,nodes}';
  v_edges := p_data #> '{discovered,edges}';
  v_endpoints := p_data #> '{discovered,tradeEndpoints}';
  if jsonb_typeof(v_nodes) is distinct from 'array'
    or jsonb_array_length(v_nodes) not between 2 and 64
    or jsonb_typeof(v_edges) is distinct from 'array'
    or jsonb_array_length(v_edges) > 256
    or jsonb_typeof(v_endpoints) is distinct from 'object'
    or not (v_endpoints ?& array['imports','exports'])
    or (v_endpoints - array['imports','exports']) <> '{}'::jsonb
    or jsonb_typeof(v_endpoints -> 'imports') is distinct from 'array'
    or jsonb_array_length(v_endpoints -> 'imports') > 128
    or jsonb_typeof(v_endpoints -> 'exports') is distinct from 'array'
    or jsonb_array_length(v_endpoints -> 'exports') > 128
  then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(v_nodes) node(value)
     where jsonb_typeof(node.value) is distinct from 'object'
        or not (node.value ?& array[
          'uid','name','kind','role','refId','source','tierMin','tierMax',
          'definitionId','revisionId','revisionNumber','contentHash'
        ])
        or (node.value - array[
          'uid','name','kind','role','refId','source','tierMin','tierMax',
          'definitionId','revisionId','revisionNumber','contentHash'
        ]) <> '{}'::jsonb
        or not public._reviewed_supply_chain_text_valid(
          node.value -> 'uid', 240, false
        )
        or not public._reviewed_supply_chain_text_valid(
          node.value -> 'name', 240, false
        )
        or jsonb_typeof(node.value -> 'kind') is distinct from 'string'
        or node.value ->> 'kind' not in (
          'institution','service','resource','good'
        )
        or jsonb_typeof(node.value -> 'role') is distinct from 'string'
        or node.value ->> 'role' not in ('source','processor','sink')
        or jsonb_typeof(node.value -> 'source') is distinct from 'string'
        or node.value ->> 'source' not in (
          'custom','prebuilt','reference'
        )
        or not public._reviewed_supply_chain_text_valid(
          node.value -> 'tierMin', 240, true
        )
        or not public._reviewed_supply_chain_text_valid(
          node.value -> 'tierMax', 240, true
        )
        or (
          node.value ->> 'tierMin' is not null
          and node.value ->> 'tierMin' not in (
            'thorp','hamlet','village','town','city','metropolis'
          )
        )
        or (
          node.value ->> 'tierMax' is not null
          and node.value ->> 'tierMax' not in (
            'thorp','hamlet','village','town','city','metropolis'
          )
        )
        or coalesce(array_position(
          array['thorp','hamlet','village','town','city','metropolis'],
          node.value ->> 'tierMin'
        ), 1) > coalesce(array_position(
          array['thorp','hamlet','village','town','city','metropolis'],
          node.value ->> 'tierMax'
        ), 6)
        or (
          node.value ->> 'source' = 'custom'
          and (
            not public._reviewed_supply_chain_text_valid(
              node.value -> 'refId', 240, false
            )
            or node.value ->> 'refId'
              is distinct from 'custom:' || (node.value ->> 'uid')
            or not public._reviewed_supply_chain_text_valid(
              node.value -> 'definitionId', 240, false
            )
            or not public._reviewed_supply_chain_text_valid(
              node.value -> 'revisionId', 240, false
            )
            or jsonb_typeof(node.value -> 'revisionNumber')
              is distinct from 'number'
            or coalesce(node.value ->> 'revisionNumber', '')
              !~ '^[1-9][0-9]*$'
            or (node.value ->> 'revisionNumber')::numeric > 2147483647
            or jsonb_typeof(node.value -> 'contentHash')
              is distinct from 'string'
            or coalesce(node.value ->> 'contentHash', '')
              !~ '^[0-9a-f]{64}$'
          )
        )
        or (
          node.value ->> 'source' = 'prebuilt'
          and (
            not public._reviewed_supply_chain_text_valid(
              node.value -> 'refId', 240, false
            )
            or left(node.value ->> 'refId', 9) <> 'prebuilt:'
            or jsonb_typeof(node.value -> 'definitionId') <> 'null'
            or jsonb_typeof(node.value -> 'revisionId') <> 'null'
            or jsonb_typeof(node.value -> 'revisionNumber') <> 'null'
            or jsonb_typeof(node.value -> 'contentHash') <> 'null'
          )
        )
        or (
          node.value ->> 'source' = 'reference'
          and (
            jsonb_typeof(node.value -> 'refId') <> 'null'
            or jsonb_typeof(node.value -> 'definitionId') <> 'null'
            or jsonb_typeof(node.value -> 'revisionId') <> 'null'
            or jsonb_typeof(node.value -> 'revisionNumber') <> 'null'
            or jsonb_typeof(node.value -> 'contentHash') <> 'null'
          )
        )
  ) or (
    select count(distinct node.value ->> 'uid')
      from jsonb_array_elements(v_nodes) node(value)
  ) <> jsonb_array_length(v_nodes)
  then
    return false;
  end if;

  if p_data ->> 'chainId'
    is distinct from public._reviewed_supply_chain_id_for_nodes(v_nodes)
  then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(v_edges) edge(value)
     where jsonb_typeof(edge.value) is distinct from 'object'
        or not (edge.value ?& array['from','to','commodity'])
        or (edge.value - array['from','to','commodity']) <> '{}'::jsonb
        or not public._reviewed_supply_chain_text_valid(
          edge.value -> 'from', 240, false
        )
        or not public._reviewed_supply_chain_text_valid(
          edge.value -> 'to', 240, false
        )
        or not public._reviewed_supply_chain_text_valid(
          edge.value -> 'commodity', 240, false
        )
        or edge.value ->> 'from' = edge.value ->> 'to'
        or not exists (
          select 1 from jsonb_array_elements(v_nodes) node(value)
           where node.value ->> 'uid' = edge.value ->> 'from'
        )
        or not exists (
          select 1 from jsonb_array_elements(v_nodes) node(value)
           where node.value ->> 'uid' = edge.value ->> 'to'
        )
  ) or exists (
    select 1
      from jsonb_array_elements(v_edges) edge(value)
     group by edge.value ->> 'from',
              edge.value ->> 'to',
              edge.value ->> 'commodity'
    having count(*) > 1
  ) then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(
        (v_endpoints -> 'imports') || (v_endpoints -> 'exports')
      ) endpoint(value)
     where jsonb_typeof(endpoint.value) is distinct from 'object'
        or not (endpoint.value ?& array['label','source','counterpart'])
        or (endpoint.value - array[
          'label','source','counterpart'
        ]) <> '{}'::jsonb
        or not public._reviewed_supply_chain_text_valid(
          endpoint.value -> 'label', 240, false
        )
        or not public._reviewed_supply_chain_text_valid(
          endpoint.value -> 'source', 240, true
        )
        or not public._reviewed_supply_chain_text_valid(
          endpoint.value -> 'counterpart', 240, true
        )
  ) then
    return false;
  end if;

  v_verification := p_data -> 'verification';
  if jsonb_typeof(v_verification) is distinct from 'object'
    or not (v_verification ?& array[
      'state','userName','corrections','review'
    ])
    or (v_verification - array[
      'state','userName','corrections','review'
    ]) <> '{}'::jsonb
    or v_verification ->> 'state' is distinct from 'confirmed'
    or not public._reviewed_supply_chain_text_valid(
      v_verification -> 'userName', 1000, true
    )
    or v_verification -> 'corrections' <> '{}'::jsonb
  then
    return false;
  end if;
  v_review := v_verification -> 'review';
  if jsonb_typeof(v_review) is distinct from 'object'
    or not (v_review ?& array[
      'schemaVersion','projectionFingerprint'
    ])
    or (v_review - array[
      'schemaVersion','projectionFingerprint'
    ]) <> '{}'::jsonb
    or jsonb_typeof(v_review -> 'schemaVersion') is distinct from 'number'
    or v_review -> 'schemaVersion' is distinct from '1'::jsonb
    or jsonb_typeof(v_review -> 'projectionFingerprint')
      is distinct from 'string'
    or coalesce(v_review ->> 'projectionFingerprint', '')
      !~ '^[0-9a-f]{64}$'
    or v_review ->> 'projectionFingerprint' is distinct from
      public._reviewed_supply_chain_projection_fingerprint(p_data)
  then
    return false;
  end if;
  return true;
exception when others then
  return false;
end;
$$;

create or replace function public._reviewed_supply_chain_archive_graph_valid(
  p_ledger jsonb
)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
begin
  -- Shape admission proves each revision independently. This second pass proves
  -- that every reviewed custom-node tuple is evidence from the same archive
  -- graph, while allowing legitimate historical and archived source revisions.
  if exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'revisions') reviewed(value)
      cross join lateral jsonb_array_elements(
        reviewed.value #> '{data,discovered,nodes}'
      ) node(value)
      left join jsonb_array_elements(p_ledger -> 'definitions')
        definition(value)
        on definition.value ->> 'id' = node.value ->> 'definitionId'
      left join jsonb_array_elements(p_ledger -> 'revisions') evidence(value)
        on evidence.value ->> 'id' = node.value ->> 'revisionId'
     where reviewed.value ->> 'category' = 'supplyChains'
       and node.value ->> 'source' = 'custom'
       and (
         definition.value is null
         or evidence.value is null
         or definition.value ->> 'category' is distinct from (
           case
             when node.value ->> 'kind' = 'institution' then 'institutions'
             when node.value ->> 'kind' = 'service' then 'services'
             when node.value ->> 'kind' = 'resource' then 'resources'
             when node.value ->> 'kind' = 'good' then 'tradeGoods'
             else null
           end
         )
         or definition.value ->> 'localUid'
           is distinct from node.value ->> 'uid'
         or evidence.value ->> 'definitionId'
           is distinct from definition.value ->> 'id'
         or evidence.value ->> 'category'
           is distinct from definition.value ->> 'category'
         or evidence.value -> 'revisionNumber'
           is distinct from node.value -> 'revisionNumber'
         or evidence.value ->> 'contentHash'
           is distinct from node.value ->> 'contentHash'
         or evidence.value ->> 'contentHash' is distinct from
           public._content_sha256(jsonb_build_object(
             'schemaVersion', 1,
             'category', evidence.value ->> 'category',
             'data', evidence.value -> 'data'
           ))
       )
  ) or exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'revisions') revision(value)
     where revision.value ->> 'category' = 'supplyChains'
     group by revision.value ->> 'definitionId'
    having count(distinct revision.value #>> '{data,chainId}') <> 1
  ) or exists (
    select 1
      from jsonb_array_elements(p_ledger -> 'definitions') definition(value)
      join jsonb_array_elements(p_ledger -> 'revisions') head(value)
        on head.value ->> 'id' = definition.value ->> 'headRevisionId'
       and head.value ->> 'definitionId' = definition.value ->> 'id'
     where definition.value ->> 'category' = 'supplyChains'
     group by head.value #>> '{data,chainId}'
    having count(*) > 1
  ) then
    return false;
  end if;
  return true;
exception when others then
  return false;
end;
$$;

create or replace function public._reviewed_supply_chain_archive_remap_data(
  p_data jsonb,
  p_identity_map jsonb
)
returns jsonb
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_result jsonb := p_data;
  v_nodes jsonb;
  v_edges jsonb;
  v_fingerprint text;
begin
  if not public._reviewed_supply_chain_record_valid(p_data)
    or jsonb_typeof(p_identity_map) is distinct from 'object'
  then
    return null;
  end if;

  select jsonb_agg(
    case
      when node.value ->> 'source' <> 'custom' then node.value
      else node.value || jsonb_build_object(
        'uid', uid_map.value ->> 'destinationId',
        'refId', 'custom:' || (uid_map.value ->> 'destinationId'),
        'definitionId', definition_map.value ->> 'destinationId',
        'revisionId', revision_map.value ->> 'destinationId',
        'revisionNumber',
          (revision_map.value ->> 'destinationRevisionNumber')::integer,
        'contentHash', revision_map.value ->> 'destinationContentHash'
      )
    end
    order by node.ordinal
  )
    into v_nodes
    from jsonb_array_elements(p_data #> '{discovered,nodes}')
      with ordinality node(value, ordinal)
    left join jsonb_array_elements(p_identity_map -> 'localUids')
      uid_map(value)
      on node.value ->> 'source' = 'custom'
     and uid_map.value ->> 'sourceId' = node.value ->> 'uid'
    left join jsonb_array_elements(p_identity_map -> 'definitionIds')
      definition_map(value)
      on node.value ->> 'source' = 'custom'
     and definition_map.value ->> 'sourceId'
       = node.value ->> 'definitionId'
    left join jsonb_array_elements(p_identity_map -> 'revisionIds')
      revision_map(value)
      on node.value ->> 'source' = 'custom'
     and revision_map.value ->> 'sourceId'
       = node.value ->> 'revisionId';

  if exists (
    select 1 from jsonb_array_elements(v_nodes) node(value)
     where node.value ->> 'source' = 'custom'
       and (
         nullif(node.value ->> 'uid', '') is null
         or nullif(node.value ->> 'definitionId', '') is null
         or nullif(node.value ->> 'revisionId', '') is null
         or jsonb_typeof(node.value -> 'revisionNumber') <> 'number'
         or (node.value ->> 'revisionNumber')::numeric <> trunc(
           (node.value ->> 'revisionNumber')::numeric
         )
         or (node.value ->> 'revisionNumber')::numeric not between 1
           and 2147483647
         or coalesce(node.value ->> 'contentHash', '')
           !~ '^[0-9a-f]{64}$'
       )
  ) then
    return null;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'from', coalesce(uid_map_from.value ->> 'destinationId',
                     edge.value ->> 'from'),
    'to', coalesce(uid_map_to.value ->> 'destinationId',
                   edge.value ->> 'to'),
    'commodity', edge.value -> 'commodity'
  ) order by edge.ordinal), '[]'::jsonb)
    into v_edges
    from jsonb_array_elements(p_data #> '{discovered,edges}')
      with ordinality edge(value, ordinal)
    left join jsonb_array_elements(p_identity_map -> 'localUids')
      uid_map_from(value)
      on uid_map_from.value ->> 'sourceId' = edge.value ->> 'from'
    left join jsonb_array_elements(p_identity_map -> 'localUids')
      uid_map_to(value)
      on uid_map_to.value ->> 'sourceId' = edge.value ->> 'to';

  v_result := jsonb_set(v_result, '{discovered,nodes}', v_nodes, false);
  v_result := jsonb_set(v_result, '{discovered,edges}', v_edges, false);
  v_result := jsonb_set(
    v_result,
    '{chainId}',
    to_jsonb(public._reviewed_supply_chain_id_for_nodes(v_nodes)),
    false
  );
  v_fingerprint :=
    public._reviewed_supply_chain_projection_fingerprint(v_result);
  v_result := jsonb_set(
    v_result,
    '{verification,review,projectionFingerprint}',
    to_jsonb(v_fingerprint),
    false
  );
  if not public._reviewed_supply_chain_record_valid(v_result) then
    return null;
  end if;
  return v_result;
exception when others then
  return null;
end;
$$;

create or replace function public.apply_reviewed_supply_chain_command(
  p_expected_owner uuid,
  p_command_id text,
  p_preview_fingerprint text,
  p_plan jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_kind text;
  v_artifact_id uuid;
  v_expected_head_id uuid;
  v_expected_lifecycle_version integer;
  v_chain jsonb;
  v_chain_id text;
  v_fingerprint text;
  v_claim jsonb;
  v_now timestamptz := clock_timestamp();
  v_definition public.custom_content_definitions%rowtype;
  v_revision public.custom_content_revisions%rowtype;
  v_evidence_definition public.custom_content_definitions%rowtype;
  v_evidence_revision public.custom_content_revisions%rowtype;
  v_node jsonb;
  v_existing boolean := false;
  v_conflict public.custom_content_definitions%rowtype;
  v_content_hash text;
  v_revision_id uuid;
  v_revision_no integer;
  v_parent_revision_id uuid;
  v_local_uid text;
  v_item jsonb := null;
  v_archived_item jsonb := null;
  v_entry_status text;
  v_was_archived boolean := false;
  v_reason text := null;
  v_failure_status text := 'failed';
  v_result jsonb;
  v_response jsonb;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if p_expected_owner is null or p_expected_owner <> v_uid then
    raise exception 'reviewed supply-chain owner changed'
      using errcode = '42501';
  end if;
  if not public.account_is_active(v_uid)
    or not public.current_user_has_premium_access()
  then
    raise exception 'active premium account required' using errcode = '42501';
  end if;
  if nullif(btrim(p_command_id), '') is null
    or char_length(p_command_id) > 240
    or coalesce(p_preview_fingerprint, '') !~ '^[0-9a-f]{64}$'
    or jsonb_typeof(p_plan) is distinct from 'object'
    or octet_length(p_plan::text) > 4194304
    or not (p_plan ?& array[
      'schemaVersion','kind','artifactId','expectedHeadRevisionId',
      'expectedLifecycleVersion','chain'
    ])
    or (p_plan - array[
      'schemaVersion','kind','artifactId','expectedHeadRevisionId',
      'expectedLifecycleVersion','chain'
    ]) <> '{}'::jsonb
    or jsonb_typeof(p_plan -> 'schemaVersion') is distinct from 'number'
    or p_plan -> 'schemaVersion' is distinct from '1'::jsonb
    or jsonb_typeof(p_plan -> 'kind') is distinct from 'string'
    or jsonb_typeof(p_plan -> 'artifactId') is distinct from 'string'
    or jsonb_typeof(p_plan -> 'expectedHeadRevisionId')
      not in ('null','string')
    or jsonb_typeof(p_plan -> 'expectedLifecycleVersion')
      not in ('null','number')
  then
    raise exception 'invalid reviewed supply-chain command envelope'
      using errcode = '22023';
  end if;

  v_kind := p_plan ->> 'kind';
  v_artifact_id := public._content_uuid(p_plan ->> 'artifactId');
  v_expected_head_id := public._content_uuid(
    p_plan ->> 'expectedHeadRevisionId'
  );
  if jsonb_typeof(p_plan -> 'expectedLifecycleVersion') = 'number' then
    if coalesce(p_plan ->> 'expectedLifecycleVersion', '')
        !~ '^[1-9][0-9]*$'
      or (p_plan ->> 'expectedLifecycleVersion')::numeric > 2147483647
    then
      raise exception 'invalid reviewed supply-chain lifecycle version'
        using errcode = '22023';
    end if;
    v_expected_lifecycle_version :=
      (p_plan ->> 'expectedLifecycleVersion')::integer;
  else
    v_expected_lifecycle_version := null;
  end if;
  if v_artifact_id is null
    or v_kind not in (
      'content.reviewed-supply-chain.confirm',
      'content.reviewed-supply-chain.remove'
    )
    or (
      p_plan ->> 'expectedHeadRevisionId' is not null
      and v_expected_head_id is null
    )
  then
    raise exception 'unsupported reviewed supply-chain command plan'
      using errcode = '22023';
  end if;

  if v_kind = 'content.reviewed-supply-chain.confirm' then
    v_chain := p_plan -> 'chain';
    if not public._reviewed_supply_chain_record_valid(v_chain) then
      raise exception 'reviewed supply-chain failed exact admission'
        using errcode = '22023';
    end if;
    v_chain_id := v_chain ->> 'chainId';
    v_content_hash :=
      public._reviewed_supply_chain_content_hash(v_chain);
  elsif jsonb_typeof(p_plan -> 'chain') <> 'null'
    or v_expected_head_id is null
    or v_expected_lifecycle_version is null
  then
    raise exception 'reviewed supply-chain removal is incomplete'
      using errcode = '22023';
  end if;

  v_fingerprint := public._content_sha256(p_plan);
  if v_fingerprint <> p_preview_fingerprint then
    raise exception 'reviewed supply-chain preview fingerprint mismatch'
      using errcode = '22023';
  end if;

  -- Every custom-content mutation lane takes the owner lock before it can
  -- claim a caller-selected journal identity. This single global order avoids
  -- an archive/reviewed deadlock on the same owner and command id.
  perform pg_advisory_xact_lock(
    hashtext('custom-content-owner'),
    hashtext(v_uid::text)
  );

  v_claim := public.claim_application_command(
    v_uid,
    p_command_id,
    v_fingerprint,
    v_kind,
    v_artifact_id,
    null
  );
  if v_claim ->> 'status' = 'conflict' then
    return jsonb_build_object(
      'ok', false,
      'status', 'failed',
      'reason', 'command_id_conflict',
      'replayed', true,
      'commandId', p_command_id,
      'fingerprint', v_fingerprint,
      'existingFingerprint', v_claim ->> 'fingerprint',
      'result', jsonb_build_object(
        'artifactId', v_artifact_id,
        'item', null,
        'archivedItem', null,
        'headRevisionId', null
      ),
      'perEntry', '[]'::jsonb
    );
  end if;
  if v_claim ->> 'phase' = 'finalized'
    and v_claim -> 'receipt' is not null
  then
    return (v_claim -> 'receipt') || jsonb_build_object('replayed', true);
  end if;
  if v_claim ->> 'status' = 'reconcile-required' then
    return jsonb_build_object(
      'ok', false,
      'status', 'reconcile-required',
      'commandId', p_command_id,
      'reason', coalesce(
        v_claim ->> 'reason',
        'command_requires_reconciliation'
      ),
      'replayed', true,
      'fingerprint', v_fingerprint,
      'result', jsonb_build_object(
        'artifactId', v_artifact_id,
        'item', null,
        'archivedItem', null,
        'headRevisionId', null
      ),
      'perEntry', '[]'::jsonb
    );
  end if;

  perform set_config(
    'settlementforge.reviewed_chain_command',
    p_command_id,
    true
  );
  update public.application_command_journal command
     set authority_transaction_id = txid_current()
   where command.owner_id = v_uid
     and command.command_id = p_command_id
     and command.fingerprint = v_fingerprint
     and command.phase = 'claimed'
     and command.status = 'claimed';
  if not found then
    raise exception 'reviewed supply-chain command authority was not claimed'
      using errcode = '40001';
  end if;
  perform pg_advisory_xact_lock(hashtext(
    'reviewed-supply-chain-artifact:'
      || v_uid::text || ':' || v_artifact_id::text
  ));
  if v_chain_id is not null then
    perform pg_advisory_xact_lock(hashtext(
      'reviewed-supply-chain-identity:'
        || v_uid::text || ':' || v_chain_id
    ));
  end if;

  select *
    into v_definition
    from public.custom_content_definitions definition
   where definition.owner_id = v_uid
     and definition.id = v_artifact_id
   for update;
  v_existing := found;
  v_was_archived := v_existing and v_definition.archived_at is not null;
  if v_existing and v_definition.category = 'supplyChains' then
    select *
      into strict v_revision
      from public.custom_content_revisions revision
     where revision.owner_id = v_uid
       and revision.definition_id = v_artifact_id
       and revision.id = v_definition.head_revision_id;
  end if;

  if v_existing and v_definition.category <> 'supplyChains' then
    v_reason := 'reviewed_artifact_category_immutable';
  elsif v_existing
    and (
      v_definition.reviewed_lifecycle_version is null
      or v_definition.reviewed_lifecycle_version < 1
    )
  then
    v_reason := 'reviewed_supply_chain_lifecycle_invalid';
  elsif v_existing
    and v_kind = 'content.reviewed-supply-chain.confirm'
    and v_revision.data ->> 'chainId' is distinct from v_chain_id
  then
    v_reason := 'reviewed_supply_chain_identity_immutable';
  elsif v_existing
    and v_definition.head_revision_id is distinct from v_expected_head_id
  then
    v_reason := 'reviewed_supply_chain_head_changed';
    v_failure_status := 'stale';
  elsif v_existing
    and v_definition.reviewed_lifecycle_version
      is distinct from v_expected_lifecycle_version
  then
    v_reason := 'reviewed_supply_chain_lifecycle_changed';
    v_failure_status := 'stale';
  elsif not v_existing
    and (
      v_expected_head_id is not null
      or v_expected_lifecycle_version is not null
    )
  then
    v_reason := 'reviewed_supply_chain_unavailable';
    v_failure_status := 'stale';
  elsif v_existing
    and v_definition.reviewed_lifecycle_version >= 2147483647
    and (
      (
        v_kind = 'content.reviewed-supply-chain.confirm'
        and (
          v_definition.archived_at is not null
          or v_revision.content_hash is distinct from v_content_hash
        )
      )
      or (
        v_kind = 'content.reviewed-supply-chain.remove'
        and v_definition.archived_at is null
      )
    )
  then
    v_reason := 'reviewed_supply_chain_lifecycle_exhausted';
  end if;

  if v_reason is null
    and v_kind = 'content.reviewed-supply-chain.confirm'
  then
    for v_node in
      select node.value
        from jsonb_array_elements(
          v_chain #> '{discovered,nodes}'
        ) node(value)
       where node.value ->> 'source' = 'custom'
       order by node.value ->> 'definitionId' collate "C"
    loop
      select *
        into v_evidence_definition
        from public.custom_content_definitions definition
       where definition.owner_id = v_uid
         and definition.id =
           public._content_uuid(v_node ->> 'definitionId')
       for update;
      if not found then
        v_reason := 'reviewed_supply_chain_node_evidence_mismatch';
        v_failure_status := 'stale';
        exit;
      end if;
      select *
        into v_evidence_revision
        from public.custom_content_revisions revision
       where revision.owner_id = v_uid
         and revision.definition_id = v_evidence_definition.id
         and revision.id = public._content_uuid(v_node ->> 'revisionId');
      if not found
        or v_evidence_definition.category is distinct from (
          case
            when v_node ->> 'kind' = 'institution' then 'institutions'
            when v_node ->> 'kind' = 'service' then 'services'
            when v_node ->> 'kind' = 'resource' then 'resources'
            when v_node ->> 'kind' = 'good' then 'tradeGoods'
            else null
          end
        )
        or v_evidence_definition.local_uid
          is distinct from v_node ->> 'uid'
        or v_evidence_definition.archived_at is not null
        or v_evidence_definition.head_revision_id
          is distinct from v_evidence_revision.id
        or v_evidence_revision.revision_no
          is distinct from (v_node ->> 'revisionNumber')::integer
        or v_evidence_revision.content_hash
          is distinct from v_node ->> 'contentHash'
        or v_evidence_revision.content_hash is distinct from
          public._content_sha256(jsonb_build_object(
            'schemaVersion', 1,
            'category', v_evidence_definition.category,
            'data', v_evidence_revision.data
          ))
      then
        v_reason := 'reviewed_supply_chain_node_evidence_mismatch';
        v_failure_status := 'stale';
        exit;
      end if;
    end loop;
  end if;

  if v_reason is null
    and v_kind = 'content.reviewed-supply-chain.confirm'
  then
    select definition.*
      into v_conflict
      from public.custom_content_definitions definition
      join public.custom_content_revisions revision
        on revision.owner_id = definition.owner_id
       and revision.definition_id = definition.id
       and revision.id = definition.head_revision_id
     where definition.owner_id = v_uid
       and definition.category = 'supplyChains'
       and definition.id <> v_artifact_id
       and revision.data ->> 'chainId' = v_chain_id
     order by definition.id
     limit 1
     for update of definition;
    if found then
      v_reason := 'reviewed_supply_chain_identity_exists';
      v_failure_status := 'stale';
    end if;
  end if;

  if v_reason is null
    and v_kind = 'content.reviewed-supply-chain.remove'
    and not v_existing
  then
    v_reason := 'reviewed_supply_chain_unavailable';
    v_failure_status := 'stale';
  end if;

  if v_reason is not null then
    v_result := jsonb_build_object(
      'artifactId', v_artifact_id,
      'item', null,
      'archivedItem', null,
      'headRevisionId', case
        when v_existing then v_definition.head_revision_id
        else null
      end,
      'conflictingArtifactId', case
        when v_conflict.id is not null then v_conflict.id
        else null
      end
    );
    v_response := jsonb_build_object(
      'ok', false,
      'status', v_failure_status,
      'commandId', p_command_id,
      'reason', v_reason,
      'replayed', false,
      'fingerprint', v_fingerprint,
      'result', v_result,
      'perEntry', '[]'::jsonb
    );
    if not public.finalize_application_command(
      v_uid, p_command_id, v_fingerprint,
      v_failure_status, v_response, v_reason
    ) then
      raise exception 'reviewed supply-chain command did not finalize'
        using errcode = '40001';
    end if;
    return v_response;
  end if;

  if v_kind = 'content.reviewed-supply-chain.confirm' then
    if v_existing and v_revision.content_hash = v_content_hash then
      if v_was_archived then
        update public.custom_content_definitions
           set archived_at = null,
               updated_at = v_now,
               reviewed_lifecycle_version =
                 reviewed_lifecycle_version + 1
         where owner_id = v_uid
           and id = v_artifact_id
         returning * into strict v_definition;
      end if;
      v_revision_id := v_revision.id;
      v_revision_no := v_revision.revision_no;
      v_entry_status := case
        when v_was_archived then 'restored'
        else 'unchanged'
      end;
    else
      v_parent_revision_id := case
        when v_existing then v_definition.head_revision_id
        else null
      end;
      v_revision_no := case
        when v_existing then v_revision.revision_no + 1
        else 1
      end;
      v_revision_id := gen_random_uuid();
      if not v_existing then
        v_local_uid := 'reviewed-chain:' || substring(
          public._content_sha256(to_jsonb(v_chain_id))
          from 1 for 32
        );
        insert into public.custom_content_definitions (
          id, owner_id, category, local_uid, head_revision_id,
          archived_at, created_at, updated_at,
          reviewed_lifecycle_version
        ) values (
          v_artifact_id, v_uid, 'supplyChains', v_local_uid, null,
          null, v_now, v_now, 1
        )
        returning * into strict v_definition;
      end if;
      insert into public.custom_content_revisions (
        id, owner_id, definition_id, revision_no, parent_revision_id,
        schema_version, content_hash, data, command_id, created_at
      ) values (
        v_revision_id, v_uid, v_artifact_id, v_revision_no,
        v_parent_revision_id, 1, v_content_hash, v_chain, p_command_id, v_now
      )
      returning * into strict v_revision;
      update public.custom_content_definitions
         set head_revision_id = v_revision_id,
             archived_at = null,
             updated_at = v_now,
             reviewed_lifecycle_version = case
               when v_existing then reviewed_lifecycle_version + 1
               else reviewed_lifecycle_version
             end
       where owner_id = v_uid
         and id = v_artifact_id
       returning * into strict v_definition;
      v_entry_status := case
        when not v_existing then 'created'
        when v_was_archived then 'restored'
        else 'updated'
      end;
    end if;
    v_item := public._custom_content_projection(v_definition, v_revision)
      || jsonb_build_object(
        'reviewedLifecycleVersion',
        v_definition.reviewed_lifecycle_version
      );
  else
    if v_definition.archived_at is null then
      update public.custom_content_definitions
         set archived_at = v_now,
             updated_at = v_now,
             reviewed_lifecycle_version =
               reviewed_lifecycle_version + 1
       where owner_id = v_uid
         and id = v_artifact_id
       returning * into strict v_definition;
    end if;
    select *
      into strict v_revision
      from public.custom_content_revisions revision
     where revision.owner_id = v_uid
       and revision.definition_id = v_artifact_id
       and revision.id = v_definition.head_revision_id;
    v_revision_id := v_revision.id;
    v_archived_item :=
      public._custom_content_projection(v_definition, v_revision)
      || jsonb_build_object(
        'reviewedLifecycleVersion',
        v_definition.reviewed_lifecycle_version
      );
    v_entry_status := 'archived';
  end if;

  v_result := jsonb_build_object(
    'artifactId', v_artifact_id,
    'item', v_item,
    'archivedItem', v_archived_item,
    'headRevisionId', v_revision_id
  );
  v_response := jsonb_build_object(
    'ok', true,
    'status', 'applied',
    'commandId', p_command_id,
    'reason', null,
    'replayed', false,
    'fingerprint', v_fingerprint,
    'result', v_result,
    'perEntry', jsonb_build_array(jsonb_build_object(
      'definitionId', v_artifact_id,
      'revisionId', v_revision_id,
      'category', 'supplyChains',
      'status', v_entry_status
    ))
  );
  if not public.finalize_application_command(
    v_uid, p_command_id, v_fingerprint,
    'applied', v_response, null
  ) then
    raise exception 'reviewed supply-chain command did not finalize'
      using errcode = '40001';
  end if;
  return v_response;
end;
$$;

-- The pre-188 generic lifecycle writer knew only a definition id and therefore
-- could archive/restore any category already present in the shared table. Keep
-- its proven implementation for authorable categories, but fence it behind a
-- wrapper before exposing the original name again.
alter function public.apply_custom_content_command(
  uuid, text, text, jsonb
) rename to _apply_custom_content_command_authorable;

create or replace function public.apply_custom_content_command(
  p_expected_owner uuid,
  p_command_id text,
  p_preview_fingerprint text,
  p_plan jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_category text;
  v_definition_id uuid;
begin
  if p_plan ->> 'kind' in (
    'content.definition.archive',
    'content.definition.restore'
  ) then
    v_definition_id := public._content_uuid(p_plan ->> 'definitionId');
    select definition.category
      into v_category
      from public.custom_content_definitions definition
     where definition.owner_id = v_uid
       and definition.id = v_definition_id;
    if v_category is not null and v_category not in (
      'institutions','services','resources','stressors',
      'tradeGoods','factions','deities','traditions'
    ) then
      raise exception 'generic lifecycle category is not authorable'
        using errcode = '22023';
    end if;
  end if;
  return public._apply_custom_content_command_authorable(
    p_expected_owner,
    p_command_id,
    p_preview_fingerprint,
    p_plan
  );
end;
$$;

-- Shape admission proves that a binding is self-consistent. This owner-aware
-- proof establishes the missing authority join: every reviewed snapshot and
-- every custom evidence node must already exist in this owner's immutable
-- ledger. Historical reviewed/evidence revisions remain legal campaign
-- cutoffs; neither definition is required to be the current editable head.
create or replace function
  public._campaign_reviewed_supply_chain_references_valid(
    p_owner uuid,
    p_binding jsonb
  )
returns boolean
language plpgsql
stable
set search_path = public, pg_temp
as $$
begin
  if p_owner is null
    or not public._campaign_content_binding_valid(p_binding)
  then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(p_binding -> 'resolvedDefinitions')
        resolved(value)
     where resolved.value ->> 'category' = 'supplyChains'
       and not exists (
         select 1
           from public.custom_content_definitions definition
           join public.custom_content_revisions revision
             on revision.owner_id = definition.owner_id
            and revision.definition_id = definition.id
          where definition.owner_id = p_owner
            and definition.id = public._content_uuid(
              resolved.value ->> 'definitionId'
            )
            and definition.category = 'supplyChains'
            and revision.id = public._content_uuid(
              resolved.value ->> 'revisionId'
            )
            and revision.content_hash =
              resolved.value ->> 'contentHash'
            and revision.data = resolved.value -> 'data'
       )
  ) then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(p_binding -> 'resolvedDefinitions')
        resolved(value)
      cross join lateral jsonb_array_elements(
        resolved.value #> '{data,discovered,nodes}'
      ) node(value)
     where resolved.value ->> 'category' = 'supplyChains'
       and node.value ->> 'source' = 'custom'
       and not exists (
         select 1
           from public.custom_content_definitions definition
           join public.custom_content_revisions revision
             on revision.owner_id = definition.owner_id
            and revision.definition_id = definition.id
          where definition.owner_id = p_owner
            and definition.id = public._content_uuid(
              node.value ->> 'definitionId'
            )
            and definition.category = case node.value ->> 'kind'
              when 'institution' then 'institutions'
              when 'service' then 'services'
              when 'resource' then 'resources'
              when 'good' then 'tradeGoods'
              else null
            end
            and definition.local_uid = node.value ->> 'uid'
            and revision.id = public._content_uuid(
              node.value ->> 'revisionId'
            )
            and revision.revision_no =
              (node.value ->> 'revisionNumber')::integer
            and revision.content_hash = node.value ->> 'contentHash'
            and public._content_sha256(jsonb_build_object(
              'schemaVersion', 1,
              'category', definition.category,
              'data', revision.data
            )) = node.value ->> 'contentHash'
       )
  ) then
    return false;
  end if;
  return true;
exception
  when others then
    return false;
end;
$$;

create or replace function
  public._campaign_reviewed_supply_chain_history_references_valid(
    p_owner uuid,
    p_history jsonb
  )
returns boolean
language plpgsql
stable
set search_path = public, pg_temp
as $$
begin
  return public._campaign_content_binding_history_valid(p_history)
    and not exists (
      select 1
        from jsonb_array_elements(p_history) binding(value)
       where not public._campaign_reviewed_supply_chain_references_valid(
         p_owner,
         binding.value
       )
    );
exception
  when others then
    return false;
end;
$$;

-- Forward-patch the large constitutional validators and archive transaction
-- without forking their already-proven control flow. Every replacement is
-- asserted: migration application fails if an earlier migration drifts instead
-- of silently leaving one authorable-only branch in production.
--
-- Prior immutable target                         Widening in this migration
-- _apply_custom_content_command_authorable       canonical owner-first locks
-- _content_environment_valid                     direct supply-chain cutoffs
-- _campaign_content_binding_valid                embedded reviewed snapshots
-- _custom_content_archive_ledger_valid           reviewed graph + exact schema
-- export_custom_content_archive                  include reviewed ledger rows
-- import_custom_content_archive                  remap graph and mint lifecycle
--
-- This is the final migration permitted to use asserted function-text surgery.
-- Any later change must replace the function explicitly in migration 189+.
create or replace function public._reviewed_supply_chain_patch_function(
  p_signature regprocedure,
  p_replacements jsonb
)
returns void
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_definition text;
  v_replacement jsonb;
  v_from text;
  v_to text;
begin
  v_definition := pg_get_functiondef(p_signature::oid);
  for v_replacement in
    select item.value
      from jsonb_array_elements(p_replacements) item(value)
  loop
    v_from := v_replacement ->> 'from';
    v_to := v_replacement ->> 'to';
    if v_from is null or strpos(v_definition, v_from) = 0 then
      raise exception 'reviewed supply-chain SQL patch source was not found: %',
        left(coalesce(v_from, '<null>'), 160)
        using errcode = '55000';
    end if;
    v_definition := replace(v_definition, v_from, v_to);
  end loop;
  execute v_definition;
end;
$$;

-- Migration 185 claimed a caller-selected journal row before taking the
-- account-wide custom-content lock. Reviewed and archive commands take those
-- locks in the opposite order, so two sessions using the same owner and command
-- id could form a journal-row/owner-lock cycle. The renamed generic writer must
-- obey the same owner-then-command order as every other constitutional lane.
select public._reviewed_supply_chain_patch_function(
  'public._apply_custom_content_command_authorable(uuid,text,text,jsonb)'
    ::regprocedure,
  jsonb_build_array(
    jsonb_build_object(
      'from', $patch$
  -- One account has one custom-content constitution. Serializing only that
  -- owner's mutation boundary closes absent-row and local-identity races across
  -- different command ids without reducing throughput between accounts. The
  -- narrower pack/environment/definition locks below still document and defend
  -- each CAS scope independently.
  perform pg_advisory_xact_lock(
    hashtext('custom-content-owner'),
    hashtext(v_uid::text)
  );

  -- Immutable pack version identity is checked before any definition write.$patch$,
      'to', $patch$
  -- Immutable pack version identity is checked before any definition write.$patch$
    ),
    jsonb_build_object(
      'from', $patch$
  v_claim := public.claim_application_command($patch$,
      'to', $patch$
  -- One account has one custom-content constitution. Take this lock before the
  -- caller-selected command row so generic, reviewed, and archive writers share
  -- one global order. The narrower locks below still document each CAS scope.
  perform pg_advisory_xact_lock(
    hashtext('custom-content-owner'),
    hashtext(v_uid::text)
  );

  v_claim := public.claim_application_command($patch$
    )
  )
);

select public._reviewed_supply_chain_patch_function(
  'public._content_environment_valid(jsonb)'::regprocedure,
  jsonb_build_array(
    jsonb_build_object(
      'from', $patch$
          'tradeGoods','factions','deities','traditions'
        )$patch$,
      'to', $patch$
          'tradeGoods','factions','deities','traditions','supplyChains'
        )$patch$
    ),
    jsonb_build_object(
      'from', $patch$
  v_tunables := p_environment -> 'tunables';$patch$,
      'to', $patch$
  if not public._reviewed_supply_chain_text_valid(
       p_environment -> 'environmentId', 240, false
     )
    or not public._reviewed_supply_chain_text_valid(
      p_environment -> 'environmentRevisionId', 240, false
    )
    or not public._reviewed_supply_chain_text_valid(
      p_environment -> 'source', 240, false
    )
    or not public._reviewed_supply_chain_text_valid(
      p_environment -> 'createdAt', 100, true
    )
    or (p_environment ->> 'revisionNumber')::numeric > 2147483647
    or jsonb_typeof(p_environment -> 'environmentHash')
      is distinct from 'string'
    or exists (
      select 1
        from jsonb_array_elements(p_environment -> 'packVersions') item(value)
       where not public._reviewed_supply_chain_text_valid(
               item.value -> 'packId', 240, false
             )
          or not public._reviewed_supply_chain_text_valid(
               item.value -> 'packVersionId', 240, false
             )
          or jsonb_typeof(item.value -> 'manifestHash')
            is distinct from 'string'
    )
    or exists (
      select 1
        from jsonb_array_elements(
          p_environment -> 'directDefinitions'
        ) item(value)
       where not public._reviewed_supply_chain_text_valid(
               item.value -> 'definitionId', 240, false
             )
          or not public._reviewed_supply_chain_text_valid(
               item.value -> 'revisionId', 240, false
             )
          or jsonb_typeof(item.value -> 'contentHash')
            is distinct from 'string'
    )
  then
    return false;
  end if;
  v_tunables := p_environment -> 'tunables';$patch$
    )
  )
);

select public._reviewed_supply_chain_patch_function(
  'public._campaign_content_binding_valid(jsonb)'::regprocedure,
  jsonb_build_array(
    jsonb_build_object(
      'from', $patch$
          'deities',
          'traditions'
        )$patch$,
      'to', $patch$
          'deities',
          'traditions',
          'supplyChains'
        )$patch$
    ),
    jsonb_build_object(
      'from', $patch$
        or not public._custom_content_record_valid(
          resolved.value ->> 'category',
          resolved.value -> 'data'
        )$patch$,
      'to', $patch$
        or (
          case
            when resolved.value ->> 'category' = 'supplyChains'
              then not public._reviewed_supply_chain_record_valid(
                resolved.value -> 'data'
              )
            else not public._custom_content_record_valid(
              resolved.value ->> 'category',
              resolved.value -> 'data'
            )
          end
        )$patch$
    ),
    jsonb_build_object(
      'from', $patch$
  v_environment := p_binding -> 'environment';$patch$,
      'to', $patch$
  if not public._reviewed_supply_chain_text_valid(
       p_binding -> 'source', 240, false
     )
    or exists (
      select 1
        from jsonb_array_elements(
          p_binding -> 'resolvedDefinitions'
        ) resolved(value)
       where not public._reviewed_supply_chain_text_valid(
               resolved.value -> 'definitionId', 240, false
             )
          or not public._reviewed_supply_chain_text_valid(
               resolved.value -> 'revisionId', 240, false
             )
          or jsonb_typeof(resolved.value -> 'contentHash')
            is distinct from 'string'
    )
  then
    return false;
  end if;
  v_environment := p_binding -> 'environment';$patch$
    )
  )
);

-- A serialized JSON `null` is the portable representation of "no current
-- binding"; normalize it to SQL NULL while leaving every other malformed JSON
-- type intact so the trigger still rejects it through the shape validator.
create or replace function public._campaign_content_binding_from_map(
  p_map_data jsonb
)
returns jsonb
language sql
immutable
set search_path = public, pg_temp
as $$
  with candidate(value) as (
    select case
      when jsonb_typeof(p_map_data) is distinct from 'object' then null
      when jsonb_typeof(p_map_data -> 'campaign') = 'object'
        then p_map_data #> '{campaign,contentBinding}'
      else p_map_data -> 'contentBinding'
    end
  )
  select case
    when jsonb_typeof(candidate.value) = 'null' then null
    else candidate.value
  end
    from candidate
$$;

select public._reviewed_supply_chain_patch_function(
  'public.enforce_campaign_content_binding_cas()'::regprocedure,
  jsonb_build_array(jsonb_build_object(
    'from', $patch$
  if v_new_binding is not null
    and (
      not public._campaign_content_binding_valid(v_new_binding)
      or not public._campaign_content_binding_history_valid(v_new_history)
    )
  then$patch$,
    'to', $patch$
  if not public._campaign_content_binding_history_valid(v_new_history)
    or not public._campaign_reviewed_supply_chain_history_references_valid(
      new.user_id,
      v_new_history
    )
    or (
      v_new_binding is not null
      and (
        not public._campaign_content_binding_valid(v_new_binding)
        or not public._campaign_reviewed_supply_chain_references_valid(
          new.user_id,
          v_new_binding
        )
      )
    )
  then$patch$
  ))
);

select public._reviewed_supply_chain_patch_function(
  'public.compare_and_swap_campaign_content_binding(uuid,text,text,uuid,text,jsonb,jsonb)'
    ::regprocedure,
  jsonb_build_array(
    jsonb_build_object(
      'from', $patch$
    or not public._campaign_content_binding_history_valid(
      p_content_binding_history
    )
    or not exists ($patch$,
      'to', $patch$
    or not public._campaign_content_binding_history_valid(
      p_content_binding_history
    )
    or not public._campaign_reviewed_supply_chain_references_valid(
      v_uid,
      p_target_binding
    )
    or not public._campaign_reviewed_supply_chain_history_references_valid(
      v_uid,
      p_content_binding_history
    )
    or not exists ($patch$
    ),
    jsonb_build_object(
      'from', $patch$
  if not public._campaign_content_binding_history_valid(v_actual_history) then
    raise exception 'stored campaign content history failed admission'
      using errcode = '22023';
  end if;$patch$,
      'to', $patch$
  if not public._campaign_content_binding_history_valid(v_actual_history)
    or (
      v_actual_binding is not null
      and not public._campaign_reviewed_supply_chain_references_valid(
        v_uid,
        v_actual_binding
      )
    )
    or not public._campaign_reviewed_supply_chain_history_references_valid(
      v_uid,
      v_actual_history
    )
  then
    raise exception 'stored campaign content history failed admission'
      using errcode = '22023';
  end if;$patch$
    )
  )
);

-- Legacy generic storage could contain arbitrary rows in the `supplyChains`
-- bucket. They are not silently promoted and they must not make a complete
-- account archive permanently unexportable. Preserve every byte in an
-- owner-readable, archive-exported command receipt, then remove the false
-- definition/revision authority. Current authorable content will rediscover
-- the graph as needs-review; only the dedicated command can confirm it again.
create or replace function
  public._campaign_binding_contains_reviewed_supply_chain(
    p_binding jsonb
  )
returns boolean
language sql
immutable
set search_path = public, pg_temp
as $$
  select jsonb_typeof(p_binding) = 'object'
    and (
      exists (
        select 1
          from jsonb_array_elements(
            case
              when jsonb_typeof(
                p_binding -> 'resolvedDefinitions'
              ) = 'array'
                then p_binding -> 'resolvedDefinitions'
              else '[]'::jsonb
            end
          ) resolved(value)
         where resolved.value ->> 'category' = 'supplyChains'
      )
      or exists (
        select 1
          from jsonb_array_elements(
            case
              when jsonb_typeof(
                p_binding #> '{environment,directDefinitions}'
              ) = 'array'
                then p_binding #> '{environment,directDefinitions}'
              else '[]'::jsonb
            end
          ) reference(value)
         where reference.value ->> 'category' = 'supplyChains'
      )
    )
$$;

create or replace function
  public._campaign_quarantine_reviewed_bindings(p_map_data jsonb)
returns jsonb
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_binding jsonb :=
    public._campaign_content_binding_from_map(p_map_data);
  v_history jsonb :=
    public._campaign_content_binding_history_from_map(p_map_data);
  v_next_binding jsonb;
  v_next_history jsonb;
  v_campaign jsonb;
begin
  v_next_binding := case
    when public._campaign_binding_contains_reviewed_supply_chain(v_binding)
      then 'null'::jsonb
    else coalesce(v_binding, 'null'::jsonb)
  end;
  select coalesce(
    jsonb_agg(binding.value order by binding.ordinal),
    '[]'::jsonb
  )
    into v_next_history
    from jsonb_array_elements(
      case
        when jsonb_typeof(v_history) = 'array' then v_history
        else '[]'::jsonb
      end
    ) with ordinality binding(value, ordinal)
   where not public._campaign_binding_contains_reviewed_supply_chain(
     binding.value
   );

  if jsonb_typeof(p_map_data -> 'campaign') = 'object' then
    v_campaign := p_map_data -> 'campaign';
    v_campaign := jsonb_set(
      v_campaign,
      '{contentBinding}',
      v_next_binding,
      true
    );
    v_campaign := jsonb_set(
      v_campaign,
      '{contentBindingHistory}',
      v_next_history,
      true
    );
    v_campaign := jsonb_set(
      v_campaign,
      '{contentBindingStatus}',
      to_jsonb('reviewed-authority-quarantined'::text),
      true
    );
    return jsonb_set(p_map_data, '{campaign}', v_campaign, false);
  end if;
  v_campaign := jsonb_set(
    p_map_data,
    '{contentBinding}',
    v_next_binding,
    true
  );
  v_campaign := jsonb_set(
    v_campaign,
    '{contentBindingHistory}',
    v_next_history,
    true
  );
  return jsonb_set(
    v_campaign,
    '{contentBindingStatus}',
    to_jsonb('reviewed-authority-quarantined'::text),
    true
  );
end;
$$;

revoke all on function
  public._campaign_binding_contains_reviewed_supply_chain(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function
  public._campaign_quarantine_reviewed_bindings(jsonb)
  from public, anon, authenticated, service_role;

-- Existing rows predate the owner-ledger join and may contain shape-valid,
-- self-signed reviewed snapshots. The migration performs one evidence-backed
-- scrub; ordinary writes remain guarded before and after this interval.
alter table public.saved_maps
  disable trigger trg_saved_maps_campaign_content_binding_cas;

-- Pre-188 campaign snapshots had shape proof but no owner-ledger authority
-- join. Quarantine every reviewed category snapshot before inspecting legacy
-- definitions: a self-signed map may lie about its definition, retain only a
-- revision identity, or be completely orphaned. One receipt per map preserves
-- the exact original row without depending on any claimed reviewed identity.
do $$
declare
  v_saved_map public.saved_maps%rowtype;
  v_payload jsonb;
  v_fingerprint text;
  v_command_id text;
begin
  for v_saved_map in
    select saved_map.*
      from public.saved_maps saved_map
     where
       public._campaign_binding_contains_reviewed_supply_chain(
         public._campaign_content_binding_from_map(saved_map.map_data)
       )
       or exists (
         select 1
           from jsonb_array_elements(
             case
               when jsonb_typeof(
                 public._campaign_content_binding_history_from_map(
                   saved_map.map_data
                 )
               ) = 'array'
                 then public._campaign_content_binding_history_from_map(
                   saved_map.map_data
                 )
               else '[]'::jsonb
             end
           ) binding(value)
          where public._campaign_binding_contains_reviewed_supply_chain(
            binding.value
          )
       )
     order by saved_map.user_id, saved_map.id
  loop
    v_payload := jsonb_build_object(
      'schemaVersion', 1,
      'reason', 'legacy_reviewed_campaign_binding_requires_review',
      'savedMap', to_jsonb(v_saved_map)
    );
    v_fingerprint := public._content_sha256(v_payload);
    v_command_id :=
      'legacy:reviewed-campaign-quarantine:' || v_saved_map.id::text;
    insert into public.application_command_journal (
      owner_id, command_id, fingerprint, kind, target_id,
      phase, status, receipt, claimed_at, finalized_at, updated_at
    ) values (
      v_saved_map.user_id,
      v_command_id,
      v_fingerprint,
      'content.reviewed-supply-chain.legacy-campaign-quarantine',
      v_saved_map.id,
      'finalized',
      'applied',
      jsonb_build_object(
        'ok', true,
        'status', 'applied',
        'commandId', v_command_id,
        'fingerprint', v_fingerprint,
        'reason', 'legacy_reviewed_campaign_binding_quarantined',
        'replayed', false,
        'result', jsonb_build_object('quarantine', v_payload),
        'perEntry', '[]'::jsonb
      ),
      clock_timestamp(),
      clock_timestamp(),
      clock_timestamp()
    )
    on conflict (owner_id, command_id) do nothing;
    if not exists (
      select 1
        from public.application_command_journal journal
       where journal.owner_id = v_saved_map.user_id
         and journal.command_id = v_command_id
         and journal.fingerprint = v_fingerprint
         and journal.kind =
           'content.reviewed-supply-chain.legacy-campaign-quarantine'
         and journal.target_id = v_saved_map.id
         and journal.phase = 'finalized'
         and journal.status = 'applied'
         and journal.receipt #>> '{result,quarantine,reason}'
           = 'legacy_reviewed_campaign_binding_requires_review'
         and journal.receipt #> '{result,quarantine}' = v_payload
    ) then
      raise exception 'legacy reviewed campaign quarantine conflict'
        using errcode = '55000';
    end if;
    update public.saved_maps saved_map
       set map_data =
         public._campaign_quarantine_reviewed_bindings(saved_map.map_data)
     where saved_map.user_id = v_saved_map.user_id
       and saved_map.id = v_saved_map.id;
  end loop;
end
$$;

do $$
declare
  v_definition public.custom_content_definitions%rowtype;
  v_payload jsonb;
  v_fingerprint text;
  v_command_id text;
  v_pack_versions jsonb;
  v_environment_revision_ids text[];
begin
  for v_definition in
    select definition.*
      from public.custom_content_definitions definition
     where definition.category = 'supplyChains'
     order by definition.owner_id, definition.id
  loop
    select coalesce(jsonb_agg(jsonb_build_object(
      'packId', impacted.pack_id,
      'packVersion', impacted.pack_version
    ) order by impacted.pack_id, impacted.pack_version), '[]'::jsonb)
      into v_pack_versions
      from (
        select distinct entry.pack_id, entry.pack_version
          from public.content_pack_version_entries entry
         where entry.owner_id = v_definition.owner_id
           and entry.definition_id = v_definition.id
      ) impacted;

    select coalesce(
      array_agg(
        revision.environment_revision_id
        order by revision.environment_revision_id
      ),
      array[]::text[]
    )
      into v_environment_revision_ids
      from public.content_environment_revisions revision
     where revision.owner_id = v_definition.owner_id
       and (
         exists (
           select 1
             from jsonb_array_elements(
               case
                 when jsonb_typeof(
                   revision.revision -> 'directDefinitions'
                 ) = 'array'
                 then revision.revision -> 'directDefinitions'
                 else '[]'::jsonb
               end
             ) reference(value)
            where reference.value ->> 'definitionId' =
                    v_definition.id::text
               or exists (
                 select 1
                   from public.custom_content_revisions reviewed_revision
                  where reviewed_revision.owner_id = v_definition.owner_id
                    and reviewed_revision.definition_id = v_definition.id
                    and reviewed_revision.id::text =
                      reference.value ->> 'revisionId'
               )
         )
         or exists (
           select 1
             from jsonb_array_elements(
               case
                 when jsonb_typeof(revision.revision -> 'packVersions')
                   = 'array'
                 then revision.revision -> 'packVersions'
                 else '[]'::jsonb
               end
             ) reference(value)
             join jsonb_array_elements(v_pack_versions) impacted(value)
               on impacted.value ->> 'packId' =
                    reference.value ->> 'packId'
              and impacted.value ->> 'packVersion' =
                    reference.value ->> 'packVersionId'
         )
       );

    -- Environment revisions are immutable numbered lineage. Removing only a
    -- directly affected middle revision would strand a non-contiguous suffix
    -- that can no longer pass archive admission. Expand the quarantine set to
    -- every later revision in each affected environment, while preserving any
    -- earlier contiguous prefix.
    select coalesce(
      array_agg(
        candidate.environment_revision_id
        order by candidate.environment_id, candidate.revision_no
      ),
      array[]::text[]
    )
      into v_environment_revision_ids
      from public.content_environment_revisions candidate
     where candidate.owner_id = v_definition.owner_id
       and exists (
         select 1
           from public.content_environment_revisions affected
          where affected.owner_id = candidate.owner_id
            and affected.environment_revision_id =
              any(v_environment_revision_ids)
            and affected.environment_id = candidate.environment_id
            and affected.revision_no <= candidate.revision_no
       );

    select jsonb_build_object(
      'schemaVersion', 1,
      'reason', 'legacy_reviewed_supply_chain_requires_review',
      'definition',
        to_jsonb(v_definition) - 'reviewed_lifecycle_version',
      'revisions', coalesce(jsonb_agg(
        to_jsonb(revision)
        order by revision.revision_no
      ), '[]'::jsonb),
      'referencedPackState', jsonb_build_object(
        'entryDefinitions', (
          select coalesce(jsonb_agg(
            to_jsonb(mapping)
            order by mapping.pack_id, mapping.pack_entry_id
          ), '[]'::jsonb)
            from public.content_pack_entry_definitions mapping
           where mapping.owner_id = v_definition.owner_id
             and exists (
               select 1
                 from public.content_pack_version_entries entry
                 join jsonb_array_elements(v_pack_versions) impacted(value)
                   on impacted.value ->> 'packId' = entry.pack_id
                  and impacted.value ->> 'packVersion' =
                    entry.pack_version
                where entry.owner_id = mapping.owner_id
                  and entry.pack_id = mapping.pack_id
                  and entry.pack_entry_id = mapping.pack_entry_id
                  and entry.definition_id = mapping.definition_id
             )
        ),
        'versionEntries', (
          select coalesce(jsonb_agg(
            to_jsonb(entry)
            order by
              entry.pack_id,
              entry.pack_version,
              entry.ordinal
          ), '[]'::jsonb)
            from public.content_pack_version_entries entry
            join jsonb_array_elements(v_pack_versions) impacted(value)
              on impacted.value ->> 'packId' = entry.pack_id
             and impacted.value ->> 'packVersion' = entry.pack_version
           where entry.owner_id = v_definition.owner_id
        ),
        'versions', (
          select coalesce(jsonb_agg(
            to_jsonb(version)
            order by version.pack_id, version.pack_version
          ), '[]'::jsonb)
            from public.content_pack_versions version
            join jsonb_array_elements(v_pack_versions) impacted(value)
              on impacted.value ->> 'packId' = version.pack_id
             and impacted.value ->> 'packVersion' = version.pack_version
           where version.owner_id = v_definition.owner_id
        ),
        'packs', (
          select coalesce(jsonb_agg(
            to_jsonb(pack)
            order by pack.pack_id
          ), '[]'::jsonb)
            from public.content_packs pack
           where pack.owner_id = v_definition.owner_id
             and exists (
               select 1
                 from jsonb_array_elements(v_pack_versions) impacted(value)
                where impacted.value ->> 'packId' = pack.pack_id
             )
        )
      ),
      'referencedEnvironmentState', jsonb_build_object(
        'environments', (
          select coalesce(jsonb_agg(
            to_jsonb(environment)
            order by environment.environment_id
          ), '[]'::jsonb)
            from public.content_environments environment
           where environment.owner_id = v_definition.owner_id
             and exists (
               select 1
                 from public.content_environment_revisions environment_revision
                where environment_revision.owner_id = environment.owner_id
                  and environment_revision.environment_id =
                    environment.environment_id
                  and environment_revision.environment_revision_id =
                    any(v_environment_revision_ids)
             )
        ),
        'revisions', (
          select coalesce(jsonb_agg(
            to_jsonb(environment_revision)
            order by environment_revision.environment_revision_id
          ), '[]'::jsonb)
            from public.content_environment_revisions environment_revision
           where environment_revision.owner_id = v_definition.owner_id
             and environment_revision.environment_revision_id =
               any(v_environment_revision_ids)
        ),
        'activations', (
          select coalesce(jsonb_agg(
            to_jsonb(activation)
            order by activation.owner_id
          ), '[]'::jsonb)
            from public.content_environment_activations activation
           where activation.owner_id = v_definition.owner_id
             and activation.environment_revision_id =
               any(v_environment_revision_ids)
        )
      )
    )
      into v_payload
      from public.custom_content_revisions revision
     where revision.owner_id = v_definition.owner_id
       and revision.definition_id = v_definition.id;
    v_fingerprint := public._content_sha256(v_payload);
    v_command_id :=
      'legacy:reviewed-supply-chain-quarantine:' || v_definition.id::text;
    insert into public.application_command_journal (
      owner_id, command_id, fingerprint, kind, target_id,
      phase, status, receipt, claimed_at, finalized_at, updated_at
    ) values (
      v_definition.owner_id,
      v_command_id,
      v_fingerprint,
      'content.reviewed-supply-chain.legacy-quarantine',
      v_definition.id,
      'finalized',
      'applied',
      jsonb_build_object(
        'ok', true,
        'status', 'applied',
        'commandId', v_command_id,
        'fingerprint', v_fingerprint,
        'reason', 'legacy_reviewed_supply_chain_quarantined',
        'replayed', false,
        'result', jsonb_build_object('quarantine', v_payload),
        'perEntry', '[]'::jsonb
      ),
      clock_timestamp(),
      clock_timestamp(),
      clock_timestamp()
    )
    on conflict (owner_id, command_id) do nothing;
    if not exists (
      select 1
        from public.application_command_journal journal
       where journal.owner_id = v_definition.owner_id
         and journal.command_id = v_command_id
         and journal.fingerprint = v_fingerprint
         and journal.kind =
           'content.reviewed-supply-chain.legacy-quarantine'
         and journal.target_id = v_definition.id
         and journal.phase = 'finalized'
         and journal.status = 'applied'
         and journal.receipt #>> '{result,quarantine,reason}'
           = 'legacy_reviewed_supply_chain_requires_review'
         and journal.receipt #> '{result,quarantine}' = v_payload
    ) then
      raise exception 'legacy reviewed supply-chain quarantine conflict'
        using errcode = '55000';
    end if;

    delete from public.content_environment_activations activation
     where activation.owner_id = v_definition.owner_id
       and activation.environment_revision_id =
         any(v_environment_revision_ids);
    delete from public.content_environment_revisions environment_revision
     where environment_revision.owner_id = v_definition.owner_id
       and environment_revision.environment_revision_id =
         any(v_environment_revision_ids);
    delete from public.content_environments environment
     where environment.owner_id = v_definition.owner_id
       and not exists (
         select 1
           from public.content_environment_revisions remaining
          where remaining.owner_id = environment.owner_id
            and remaining.environment_id = environment.environment_id
       );

    update public.content_packs pack
       set active_pack_version = null,
           active_manifest_hash = null,
           updated_at = clock_timestamp()
     where pack.owner_id = v_definition.owner_id
       and exists (
         select 1
           from jsonb_array_elements(v_pack_versions) impacted(value)
          where impacted.value ->> 'packId' = pack.pack_id
            and impacted.value ->> 'packVersion' =
              pack.active_pack_version
       );
    delete from public.content_pack_versions version
     where version.owner_id = v_definition.owner_id
       and exists (
         select 1
           from jsonb_array_elements(v_pack_versions) impacted(value)
          where impacted.value ->> 'packId' = version.pack_id
            and impacted.value ->> 'packVersion' = version.pack_version
       );
    delete from public.content_packs pack
     where pack.owner_id = v_definition.owner_id
       and not exists (
         select 1
           from public.content_pack_versions remaining
          where remaining.owner_id = pack.owner_id
            and remaining.pack_id = pack.pack_id
       );

    delete from public.custom_content_definitions definition
     where definition.owner_id = v_definition.owner_id
       and definition.id = v_definition.id;
  end loop;
end
$$;

alter table public.saved_maps
  enable trigger trg_saved_maps_campaign_content_binding_cas;

drop function public._campaign_quarantine_reviewed_bindings(jsonb);
drop function
  public._campaign_binding_contains_reviewed_supply_chain(jsonb);

-- Only the reviewed lane and archive import may establish supply-chain
-- lifecycle state. Archive transfer deliberately starts a new destination
-- generation; source generations are operational retry state and are not
-- portable evidence.
create or replace function
  public._custom_content_reviewed_lifecycle_guard()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'UPDATE' and new.category is distinct from old.category then
    raise exception 'custom-content definition category is immutable'
      using errcode = '22023';
  end if;
  if new.category = 'supplyChains' then
    -- The journal claim is the transaction-visible mutation capability. Both
    -- authorized lanes claim before touching definitions and finalize in the
    -- same transaction; authenticated/service roles cannot forge journal DML.
    -- This rejects accidental privileged/manual writes instead of silently
    -- minting generation one for an artifact that skipped graph review.
    if not exists (
      select 1
        from public.application_command_journal command
         where command.owner_id = new.owner_id
         and command.phase = 'claimed'
         and command.status = 'claimed'
         and command.command_id = current_setting(
           'settlementforge.reviewed_chain_command',
           true
         )
         and command.authority_transaction_id = txid_current()
         and (
           (
             command.kind in (
               'content.reviewed-supply-chain.confirm',
               'content.reviewed-supply-chain.remove'
             )
             and command.target_id = new.id
           )
           or command.kind = 'content.archive.import'
         )
    ) then
      raise exception 'reviewed supply-chain write lacks authority'
        using errcode = '42501';
    end if;
    new.reviewed_lifecycle_version :=
      coalesce(new.reviewed_lifecycle_version, 1);
  elsif new.reviewed_lifecycle_version is not null then
    raise exception 'authorable definitions have no reviewed lifecycle'
      using errcode = '22023';
  end if;
  return new;
end;
$$;

drop trigger if exists custom_content_reviewed_lifecycle_guard
  on public.custom_content_definitions;
create trigger custom_content_reviewed_lifecycle_guard
  before insert or update
  on public.custom_content_definitions
  for each row execute function
    public._custom_content_reviewed_lifecycle_guard();

alter table public.custom_content_definitions
  drop constraint if exists custom_content_reviewed_lifecycle_valid;
alter table public.custom_content_definitions
  add constraint custom_content_reviewed_lifecycle_valid check (
    (
      category = 'supplyChains'
      and reviewed_lifecycle_version between 1 and 2147483647
    )
    or (
      category <> 'supplyChains'
      and reviewed_lifecycle_version is null
    )
  );

revoke all on function public._apply_custom_content_command_authorable(
  uuid, text, text, jsonb
) from public, anon, authenticated, service_role;
revoke all on function public.apply_custom_content_command(
  uuid, text, text, jsonb
) from public, anon;
grant execute on function public.apply_custom_content_command(
  uuid, text, text, jsonb
) to authenticated, service_role;

revoke all on function public.apply_reviewed_supply_chain_command(
  uuid, text, text, jsonb
) from public, anon;
grant execute on function public.apply_reviewed_supply_chain_command(
  uuid, text, text, jsonb
) to authenticated, service_role;

revoke all on function public._reviewed_supply_chain_text_valid(
  jsonb, integer, boolean
) from public, anon, authenticated, service_role;
revoke all on function public._reviewed_supply_chain_text_array_valid(
  jsonb, integer
) from public, anon, authenticated, service_role;
revoke all on function public._reviewed_supply_chain_id_for_nodes(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public._custom_content_reviewed_lifecycle_guard()
  from public, anon, authenticated, service_role;
revoke all on function public._reviewed_supply_chain_projection(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function
  public._reviewed_supply_chain_projection_fingerprint(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public._reviewed_supply_chain_content_hash(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public._reviewed_supply_chain_record_valid(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function
  public._reviewed_supply_chain_archive_graph_valid(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function
  public._reviewed_supply_chain_archive_remap_data(jsonb, jsonb)
  from public, anon, authenticated, service_role;
revoke all on function
  public._campaign_reviewed_supply_chain_references_valid(uuid, jsonb)
  from public, anon, authenticated, service_role;
revoke all on function
  public._campaign_reviewed_supply_chain_history_references_valid(uuid, jsonb)
  from public, anon, authenticated, service_role;

comment on function public.apply_reviewed_supply_chain_command(
  uuid, text, text, jsonb
) is
  'Dedicated owner/premium-gated CAS authority for exact reviewed-derived supply-chain revisions; generic authoring and packs cannot call this lane.';

select public._reviewed_supply_chain_patch_function(
  'public._custom_content_archive_ledger_valid(jsonb,boolean,boolean)'
    ::regprocedure,
  jsonb_build_array(
    jsonb_build_object(
      'from', $patch$
          'tradeGoods','factions','deities','traditions'
        )$patch$,
      'to', $patch$
          'tradeGoods','factions','deities','traditions','supplyChains'
        )$patch$
    ),
    jsonb_build_object(
      'from', $patch$
        or not public._custom_content_record_valid(
          revision.value ->> 'category',
          revision.value -> 'data'
        )$patch$,
      'to', $patch$
        or (
          case
            when revision.value ->> 'category' = 'supplyChains'
              then not public._reviewed_supply_chain_record_valid(
                revision.value -> 'data'
              )
            else not public._custom_content_record_valid(
              revision.value ->> 'category',
              revision.value -> 'data'
            )
          end
        )$patch$
    ),
    jsonb_build_object(
      'from', $patch$
             and definition.value ->> 'localUid'
             = revision.value #>> '{data,localUid}'$patch$,
      'to', $patch$
             and (
               revision.value ->> 'category' = 'supplyChains'
               or definition.value ->> 'localUid'
                 = revision.value #>> '{data,localUid}'
             )$patch$
    ),
    jsonb_build_object(
      'from', $patch$
           where definition.value ->> 'id'
             = mapping.value ->> 'definitionId'
        )$patch$,
      'to', $patch$
           where definition.value ->> 'id'
             = mapping.value ->> 'definitionId'
             and definition.value ->> 'category' <> 'supplyChains'
        )$patch$
    ),
    jsonb_build_object(
      'from', $patch$
        or coalesce(entry.value ->> 'ordinal', '') !~ '^[0-9]+$'$patch$,
      'to', $patch$
        or entry.value ->> 'category' = 'supplyChains'
        or coalesce(entry.value ->> 'ordinal', '') !~ '^[0-9]+$'$patch$
    ),
    jsonb_build_object(
      'from', $patch$
  return true;
exception
  when others then
    return false;$patch$,
      'to', $patch$
  if not public._reviewed_supply_chain_archive_graph_valid(p_ledger) then
    return false;
  end if;
  return true;
exception
  when others then
    return false;$patch$
    )
  )
);

select public._reviewed_supply_chain_patch_function(
  'public.export_custom_content_archive(uuid)'::regprocedure,
  jsonb_build_array(jsonb_build_object(
    'from', $patch$
           'tradeGoods','factions','deities','traditions'
         )$patch$,
    'to', $patch$
           'tradeGoods','factions','deities','traditions','supplyChains'
         )$patch$
  ))
);

select public._reviewed_supply_chain_patch_function(
  'public.import_custom_content_archive(uuid,text,text,jsonb)'::regprocedure,
  jsonb_build_array(
    jsonb_build_object(
      'from', $patch$
           'tradeGoods','factions','deities','traditions'
         )$patch$,
      'to', $patch$
           'tradeGoods','factions','deities','traditions','supplyChains'
         )$patch$
    ),
    jsonb_build_object(
      'from', $patch$
    or jsonb_array_length(v_archive -> 'auditProvenance') > 128$patch$,
      'to', $patch$$patch$
    ),
    jsonb_build_object(
      'from', $patch$
    select count(*) > 128
        or count(distinct value ->> 'archiveFingerprint') <> count(*)
      from provenance$patch$,
      'to', $patch$
    select count(distinct value ->> 'archiveFingerprint') > 128
        or count(distinct value) <>
          count(distinct value ->> 'archiveFingerprint')
      from provenance$patch$
    ),
    jsonb_build_object(
      'from', $patch$
      select count(*) > 128 from provenance$patch$,
      'to', $patch$
      select count(distinct value ->> 'archiveFingerprint') > 128
          or count(distinct value) <>
            count(distinct value ->> 'archiveFingerprint')
        from provenance$patch$
    ),
    jsonb_build_object(
      'from', $patch$
                        'sourceId','destinationId','destinationContentHash'
                      ]
                    ) <> '{}'::jsonb
                    or mapping.value ->> 'destinationContentHash'
                      !~ '^[0-9a-f]{64}$'$patch$,
      'to', $patch$
                        'sourceId','destinationId','destinationContentHash',
                        'destinationRevisionNumber'
                      ]
                    ) <> '{}'::jsonb
                    or mapping.value ->> 'destinationContentHash'
                      !~ '^[0-9a-f]{64}$'
                    or (
                      mapping.value ? 'destinationRevisionNumber'
                      and (
                        jsonb_typeof(
                          mapping.value -> 'destinationRevisionNumber'
                        ) is distinct from 'number'
                        or coalesce(
                          mapping.value ->> 'destinationRevisionNumber',
                          ''
                        ) !~ '^[1-9][0-9]*$'
                        or (
                          mapping.value ->> 'destinationRevisionNumber'
                        )::numeric > 2147483647
                      )
                    )$patch$
    ),
    jsonb_build_object(
      'from', $patch$public._custom_content_archive_remap_data(
            source.value -> 'data',
            v_identity_map -> 'localUids'
          )$patch$,
      'to', $patch$case
            when source.value ->> 'category' = 'supplyChains'
              then public._reviewed_supply_chain_archive_remap_data(
                source.value -> 'data',
                v_identity_map
              )
            else public._custom_content_archive_remap_data(
              source.value -> 'data',
              v_identity_map -> 'localUids'
            )
          end$patch$
    ),
    jsonb_build_object(
      'from', $patch$'data', public._custom_content_archive_remap_data(
              source.value -> 'data',
              v_identity_map -> 'localUids'
            )$patch$,
      'to', $patch$'data', case
              when source.value ->> 'category' = 'supplyChains'
                then public._reviewed_supply_chain_archive_remap_data(
                  source.value -> 'data',
                  v_identity_map
                )
              else public._custom_content_archive_remap_data(
                source.value -> 'data',
                v_identity_map -> 'localUids'
              )
            end$patch$
    ),
    jsonb_build_object(
      'from', $patch$
  -- `exportedAt` and the outer archive fingerprint are transport facts. Once
  -- this exact source ledger and provenance graph has been admitted, another
  -- envelope carrying the same semantic artifact must not consume a journal
  -- row or another unit of the 10k receipt budget.
  perform pg_advisory_xact_lock(
    hashtext('custom-content-owner'),
    hashtext(v_uid::text)
  );
  select jsonb_build_object($patch$,
      'to', $patch$
  -- `exportedAt` and the outer archive fingerprint are transport facts. Once
  -- this exact source ledger and provenance graph has been admitted, another
  -- envelope carrying the same semantic artifact must not consume a journal
  -- row or another unit of the 10k receipt budget.
  perform pg_advisory_xact_lock(
    hashtext('custom-content-owner'),
    hashtext(v_uid::text)
  );
  v_transfer :=
    public._custom_content_archive_normalize_transfer_timestamps(
      v_uid,
      v_transfer
    );
  select jsonb_build_object($patch$
    ),
    jsonb_build_object(
      'from', $patch$
        or destination.value ->> 'revisionNumber'
          is distinct from source.value ->> 'revisionNumber'$patch$,
      'to', $patch$
        or destination.value ->> 'revisionNumber' is distinct from
          case
            when source.value ->> 'category' = 'supplyChains'
              then revision_map.value ->> 'destinationRevisionNumber'
            else source.value ->> 'revisionNumber'
          end$patch$
    ),
    jsonb_build_object(
      'from', $patch$
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
              )::timestamptz$patch$,
      'to', $patch$
           from (
             select lifecycle.value
               from public.custom_content_archive_imports prior_import
               cross join lateral jsonb_each(
                 prior_import.destination_definition_lifecycles
               ) lifecycle(key, value)
              where prior_import.owner_id = v_uid
                and prior_import.source_key = v_source_key
                and lifecycle.key = definition.id::text
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
              )::timestamptz$patch$
    ),
    jsonb_build_object(
      'from', $patch$
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
    ) prior_lifecycle$patch$,
      'to', $patch$
    left join (
      select distinct on (lifecycle.key)
        lifecycle.key as destination_id,
        nullif(lifecycle.value ->> 'archivedAt', '')::timestamptz
          as archived_at,
        nullif(lifecycle.value ->> 'updatedAt', '')::timestamptz
          as updated_at
        from public.custom_content_archive_imports imported
        cross join lateral jsonb_each(
          imported.destination_definition_lifecycles
        ) lifecycle(key, value)
       where imported.owner_id = v_uid
         and imported.source_key = v_source_key
       order by lifecycle.key, imported.imported_at desc
    ) prior_lifecycle$patch$
    ),
    jsonb_build_object(
      'from', $patch$
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
  )$patch$,
      'to', $patch$
  insert into public.custom_content_archive_imports (
    owner_id, archive_fingerprint, source_key,
    source_ledger_fingerprint, provenance_fingerprint, source_archive,
    identity_map, destination_definition_lifecycles,
    command_id, imported_at
  ) values (
    v_uid, v_archive_fingerprint, v_source_key,
    v_source_ledger_fingerprint,
    v_provenance_fingerprint,
    v_archive,
    v_identity_map,
    (
      select coalesce(jsonb_object_agg(
        definition.id::text,
        jsonb_build_object(
          'headRevisionId', definition.head_revision_id::text,
          'archivedAt', definition.archived_at,
          'updatedAt', definition.updated_at
        )
      ), '{}'::jsonb)
        from public.custom_content_definitions definition
        join jsonb_array_elements(v_transfer -> 'definitions') item(value)
          on definition.id = public._content_uuid(item.value ->> 'id')
       where definition.owner_id = v_uid
    ),
    p_command_id, v_now
  )$patch$
    ),
    jsonb_build_object(
      'from', $patch$
  ) then
    v_failure_reason := 'custom_content_archive_limit_exceeded';
  end if;

  if v_failure_reason is not null then$patch$,
      'to', $patch$
  ) then
    v_failure_reason := 'custom_content_archive_limit_exceeded';
  end if;

  if v_failure_reason is null and exists (
    select 1
      from jsonb_array_elements(v_transfer -> 'definitions') item(value)
      join public.custom_content_definitions definition
        on definition.owner_id = v_uid
       and definition.id = public._content_uuid(item.value ->> 'id')
      join jsonb_array_elements(v_transfer -> 'revisions')
        incoming_head(value)
        on public._content_uuid(incoming_head.value ->> 'id') =
          public._content_uuid(item.value ->> 'headRevisionId')
      left join public.custom_content_revisions current_head
        on current_head.owner_id = definition.owner_id
       and current_head.definition_id = definition.id
       and current_head.id = definition.head_revision_id
     where definition.category = 'supplyChains'
       and definition.reviewed_lifecycle_version >= 2147483647
       and (
         current_head.revision_no
           < (incoming_head.value ->> 'revisionNumber')::integer
         or (
           definition.head_revision_id =
             public._content_uuid(incoming_head.value ->> 'id')
           and (
             definition.archived_at is distinct from
               nullif(item.value ->> 'archivedAt', '')::timestamptz
             or definition.updated_at <
               nullif(item.value ->> 'updatedAt', '')::timestamptz
           )
           and exists (
             select 1
               from public.custom_content_archive_imports imported
               cross join lateral jsonb_each(
                 imported.destination_definition_lifecycles
               ) lifecycle(key, value)
              where imported.owner_id = v_uid
                and imported.source_key = v_source_key
                and lifecycle.key = definition.id::text
                and nullif(
                  lifecycle.value ->> 'updatedAt',
                  ''
                )::timestamptz = definition.updated_at
                and nullif(
                  lifecycle.value ->> 'archivedAt',
                  ''
                )::timestamptz is not distinct from
                  definition.archived_at
           )
         )
       )
  ) then
    v_failure_reason := 'reviewed_supply_chain_lifecycle_exhausted';
  end if;

  if v_failure_reason is not null then$patch$
    ),
    jsonb_build_object(
      'from', $patch$
        or environment.created_at is distinct from
          nullif(item.value ->> 'createdAt', '')::timestamptz$patch$,
      'to', $patch$
        or (
          jsonb_typeof(item.value -> 'createdAt') <> 'null'
          and environment.created_at is distinct from
            nullif(item.value ->> 'createdAt', '')::timestamptz
        )$patch$
    ),
    jsonb_build_object(
      'from', $patch$
    coalesce(
      nullif(item.value ->> 'createdAt', '')::timestamptz,
      v_now
    )$patch$,
      'to', $patch$
    coalesce(
      nullif(item.value ->> 'createdAt', '')::timestamptz,
      timestamptz '1970-01-01 00:00:00+00'
    )$patch$
    ),
    jsonb_build_object(
      'from', $patch$
  -- Different archive envelopes use different command ids, but all mutate one
  -- account constitution. The owner lock closes absent-row races and makes the
  -- pristine activation decision stable through the final write.$patch$,
      'to', $patch$
  perform set_config(
    'settlementforge.reviewed_chain_command',
    p_command_id,
    true
  );
  update public.application_command_journal command
     set authority_transaction_id = txid_current()
   where command.owner_id = v_uid
     and command.command_id = p_command_id
     and command.fingerprint = p_fingerprint
     and command.phase = 'claimed'
     and command.status = 'claimed';
  if not found then
    raise exception 'archive import authority was not claimed'
      using errcode = '40001';
  end if;

  -- Different archive envelopes use different command ids, but all mutate one
  -- account constitution. The owner lock closes absent-row races and makes the
  -- pristine activation decision stable through the final write.
  perform pg_advisory_xact_lock(
    hashtext('custom-content-owner'),
    hashtext(v_uid::text)
  );
  perform pg_advisory_xact_lock(hashtext(
    'reviewed-supply-chain-identity:' || v_uid::text || ':'
      || identity.chain_id
  ))
    from (
      select head.value #>> '{data,chainId}' as chain_id
        from jsonb_array_elements(v_transfer -> 'definitions')
          definition(value)
        join jsonb_array_elements(v_transfer -> 'revisions') head(value)
          on head.value ->> 'id'
            = definition.value ->> 'headRevisionId'
       where definition.value ->> 'category' = 'supplyChains'
       order by head.value #>> '{data,chainId}' collate "C"
    ) identity;
  if exists (
    select 1
      from jsonb_array_elements(v_transfer -> 'definitions')
        incoming_definition(value)
      join jsonb_array_elements(v_transfer -> 'revisions')
        incoming_head(value)
        on incoming_head.value ->> 'id'
          = incoming_definition.value ->> 'headRevisionId'
      join public.custom_content_definitions existing_definition
        on existing_definition.owner_id = v_uid
       and existing_definition.category = 'supplyChains'
       and existing_definition.id <> public._content_uuid(
         incoming_definition.value ->> 'id'
       )
      join public.custom_content_revisions existing_head
        on existing_head.owner_id = existing_definition.owner_id
       and existing_head.definition_id = existing_definition.id
       and existing_head.id = existing_definition.head_revision_id
       and existing_head.data ->> 'chainId'
         = incoming_head.value #>> '{data,chainId}'
     where incoming_definition.value ->> 'category' = 'supplyChains'
  ) then
    raise exception 'reviewed supply-chain archive identity exists'
      using errcode = '23505';
  end if;$patch$
    ),
    jsonb_build_object(
      'from', $patch$
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
    from jsonb_array_elements(v_transfer -> 'definitions') item(value)$patch$,
      'to', $patch$
         reviewed_lifecycle_version = case
           when definition.category = 'supplyChains'
             and definition.head_revision_id is not null
             and (
               definition.head_revision_id is distinct from incoming_head.id
               or (
                 definition.updated_at = prior_lifecycle.updated_at
                 and definition.archived_at is not distinct from
                   prior_lifecycle.archived_at
                 and (
                   definition.archived_at is distinct from
                     nullif(
                       item.value ->> 'archivedAt',
                       ''
                     )::timestamptz
                   or definition.updated_at <
                     nullif(
                       item.value ->> 'updatedAt',
                       ''
                     )::timestamptz
                 )
               )
             )
           then definition.reviewed_lifecycle_version + 1
           else definition.reviewed_lifecycle_version
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
    from jsonb_array_elements(v_transfer -> 'definitions') item(value)$patch$
    )
  )
);

drop function public._reviewed_supply_chain_patch_function(
  regprocedure, jsonb
);
