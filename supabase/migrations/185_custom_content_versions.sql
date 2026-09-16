-- ────────────────────────────────────────────────────────────────────────────
-- 185_custom_content_versions.sql — immutable custom-content definitions,
-- revisions, pack/environment versions, and the transactional command
-- authority. Campaigns carry their portable content binding in the canonical
-- saved-map envelope; there is intentionally no second campaign-binding table.
--
-- The historical custom_content table remains as a deployment-compatible
-- source during the additive rollout. Every legacy row is backfilled exactly
-- once. New writes are RPC-only: authenticated clients may inspect their rows,
-- but cannot mutate definitions, revisions, packs, or environments directly.
--
-- A definition owns stable identity and archive state. Authored meaning lives
-- only in append-only revisions; head changes use expected-head CAS. Rollback is
-- therefore a normal forward revision whose data matches an older revision,
-- never a destructive pointer rewind.
--
-- @rollback:
--   Forward-fix only after the first revisioned command write. Before that
--   activation boundary, callers may be removed and the new RPC, helpers, and
--   revisioned tables may be dropped because the legacy source rows remain
--   untouched. After activation, never rewind to legacy mutation: immutable
--   revisions, pack installs, and environment activations are authoritative.

-- ────────────────────────────────────────────────────────────────────────────

create or replace function public._content_canonical_json(p_value jsonb)
returns text
language plpgsql
immutable
strict
set search_path = public, pg_temp
as $$
declare
  v_type text := jsonb_typeof(p_value);
  v_result text;
begin
  if v_type = 'object' then
    select '{' || coalesce(string_agg(
      to_jsonb(entry.key)::text
        || ':'
        || public._content_canonical_json(entry.value),
      ',' order by entry.key collate "C"
    ), '') || '}'
      into v_result
      from jsonb_each(p_value) as entry;
    return v_result;
  elsif v_type = 'array' then
    select '[' || coalesce(string_agg(
      public._content_canonical_json(entry.value),
      ',' order by entry.ordinal
    ), '') || ']'
      into v_result
      from jsonb_array_elements(p_value)
        with ordinality as entry(value, ordinal);
    return v_result;
  end if;
  return p_value::text;
end;
$$;

create or replace function public._content_sha256(p_value jsonb)
returns text
language sql
immutable
strict
set search_path = public, pg_temp
as $$
  select encode(sha256(convert_to(
    public._content_canonical_json(p_value),
    'UTF8'
  )), 'hex')
$$;

-- This validator reads a frozen SQL projection generated from the canonical
-- schema/custom-content.manifest.json. It is not a separately authored or third
-- manifest authority. Unknown fields and wrong types still fail closed if a
-- caller bypasses the client adapter.
create or replace function public._custom_content_record_valid(
  p_category text,
  p_data jsonb
)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  -- BEGIN GENERATED CUSTOM-CONTENT VALIDATION MANIFEST
  -- Source: schema/custom-content.manifest.json @ 2026-08-02.1.
  -- Frozen migration snapshot; generated validation projection, not a third authority.
  v_manifest jsonb := $manifest$
  {
    "institutions": {
      "name": {
        "t": "string",
        "r": 1,
        "n": 1,
        "x": 160
      },
      "category": {
        "t": "string",
        "x": 100
      },
      "authority": {
        "t": "enum",
        "v": [
          "religious",
          "martial",
          "economic",
          "arcane",
          "civic",
          "popular",
          "noble",
          "criminal"
        ]
      },
      "tags": {
        "t": "string-or-string-list",
        "m": 40,
        "i": 160
      },
      "essential": {
        "t": "boolean"
      },
      "magical": {
        "t": "boolean"
      },
      "criminal": {
        "t": "boolean"
      },
      "defenseRole": {
        "t": "enum",
        "v": [
          "none",
          "fortification",
          "garrison",
          "militia",
          "watch",
          "arcane_ward",
          "logistics",
          "intelligence"
        ]
      },
      "foodImpact": {
        "t": "enum",
        "v": [
          "none",
          "produces",
          "consumes"
        ]
      },
      "economicWeight": {
        "t": "enum",
        "v": [
          "minor",
          "moderate",
          "major",
          "backbone"
        ]
      },
      "satisfies": {
        "t": "string",
        "x": 100
      },
      "description": {
        "t": "string",
        "x": 2000
      },
      "sceneProfileId": {
        "t": "enum",
        "v": [
          "agrarian-farmstead",
          "agrarian-mill",
          "civic-archive",
          "civic-hall",
          "domestic-house",
          "exotic-tower",
          "industrial-forge",
          "industrial-workshop",
          "martial-barracks",
          "martial-keep",
          "martial-watchtower",
          "mercantile-guildhall",
          "mercantile-inn",
          "mercantile-market",
          "ruined-landmark",
          "sacred-sanctuary",
          "sacred-shrine"
        ]
      },
      "landmarkLevel": {
        "t": "enum",
        "v": [
          "standard",
          "landmark"
        ]
      },
      "materialFamily": {
        "t": "enum",
        "v": [
          "brick",
          "marble",
          "ruined-stone",
          "steel",
          "stone",
          "timber"
        ]
      },
      "glyph": {
        "t": "enum",
        "v": [
          "archive-hall",
          "barracks",
          "farmstead",
          "forge",
          "guildhall",
          "house-a",
          "house-b",
          "house-c",
          "mage-tower",
          "moot-hall",
          "ruin-shell",
          "signpost-house",
          "small-spire",
          "spire",
          "stall-rows",
          "towered-keep",
          "watchtower",
          "wheelhouse",
          "workshop"
        ]
      },
      "tierMin": {
        "t": "enum",
        "v": [
          "thorp",
          "hamlet",
          "village",
          "town",
          "city",
          "metropolis"
        ]
      },
      "tierMax": {
        "t": "enum",
        "v": [
          "thorp",
          "hamlet",
          "village",
          "town",
          "city",
          "metropolis"
        ]
      },
      "produces": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      },
      "requires": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      },
      "subsumes": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      }
    },
    "services": {
      "name": {
        "t": "string",
        "r": 1,
        "n": 1,
        "x": 160
      },
      "category": {
        "t": "string",
        "x": 100
      },
      "authority": {
        "t": "enum",
        "v": [
          "religious",
          "martial",
          "economic",
          "arcane",
          "civic",
          "popular",
          "noble",
          "criminal"
        ]
      },
      "criticality": {
        "t": "enum",
        "v": [
          "critical",
          "important",
          "discretionary"
        ]
      },
      "economicWeight": {
        "t": "enum",
        "v": [
          "minor",
          "moderate",
          "major",
          "backbone"
        ]
      },
      "magical": {
        "t": "boolean"
      },
      "criminal": {
        "t": "boolean"
      },
      "foodImpact": {
        "t": "enum",
        "v": [
          "none",
          "produces",
          "consumes"
        ]
      },
      "description": {
        "t": "string",
        "x": 2000
      },
      "tierMin": {
        "t": "enum",
        "v": [
          "thorp",
          "hamlet",
          "village",
          "town",
          "city",
          "metropolis"
        ]
      },
      "tierMax": {
        "t": "enum",
        "v": [
          "thorp",
          "hamlet",
          "village",
          "town",
          "city",
          "metropolis"
        ]
      },
      "providedBy": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      },
      "requires": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      }
    },
    "resources": {
      "name": {
        "t": "string",
        "r": 1,
        "n": 1,
        "x": 160
      },
      "category": {
        "t": "string",
        "x": 100
      },
      "criticality": {
        "t": "enum",
        "v": [
          "critical",
          "important",
          "discretionary"
        ]
      },
      "essential": {
        "t": "boolean"
      },
      "foodImpact": {
        "t": "enum",
        "v": [
          "none",
          "produces",
          "consumes"
        ]
      },
      "commodities": {
        "t": "string-or-string-list",
        "m": 40,
        "i": 160
      },
      "description": {
        "t": "string",
        "x": 2000
      },
      "tierMin": {
        "t": "enum",
        "v": [
          "thorp",
          "hamlet",
          "village",
          "town",
          "city",
          "metropolis"
        ]
      },
      "tierMax": {
        "t": "enum",
        "v": [
          "thorp",
          "hamlet",
          "village",
          "town",
          "city",
          "metropolis"
        ]
      },
      "yields": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      },
      "enables": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      }
    },
    "stressors": {
      "name": {
        "t": "string",
        "r": 1,
        "n": 1,
        "x": 160
      },
      "description": {
        "t": "string",
        "x": 2000
      },
      "severity": {
        "t": "enum",
        "v": [
          "minor",
          "moderate",
          "severe",
          "catastrophic"
        ]
      },
      "affects": {
        "t": "string-or-string-list",
        "m": 10,
        "i": 40,
        "v": [
          "economy",
          "safety",
          "supply chains",
          "military",
          "religion",
          "magic",
          "criminal",
          "governance",
          "population",
          "morale"
        ]
      },
      "disablesInstitutions": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      },
      "disablesGoods": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      }
    },
    "tradeGoods": {
      "name": {
        "t": "string",
        "r": 1,
        "n": 1,
        "x": 160
      },
      "category": {
        "t": "string",
        "x": 100
      },
      "criticality": {
        "t": "enum",
        "v": [
          "critical",
          "important",
          "discretionary"
        ]
      },
      "economicWeight": {
        "t": "enum",
        "v": [
          "minor",
          "moderate",
          "major",
          "backbone"
        ]
      },
      "foodImpact": {
        "t": "enum",
        "v": [
          "none",
          "produces",
          "consumes"
        ]
      },
      "satisfies": {
        "t": "string",
        "x": 100
      },
      "description": {
        "t": "string",
        "x": 2000
      },
      "requiredInstitution": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      },
      "requiredResources": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      }
    },
    "factions": {
      "name": {
        "t": "string",
        "r": 1,
        "n": 1,
        "x": 160
      },
      "authority": {
        "t": "enum",
        "v": [
          "religious",
          "martial",
          "economic",
          "arcane",
          "civic",
          "popular",
          "noble",
          "criminal"
        ]
      },
      "archetype": {
        "t": "string",
        "x": 300
      },
      "agenda": {
        "t": "string",
        "x": 2000
      },
      "scale": {
        "t": "enum",
        "v": [
          "cell",
          "minor",
          "significant",
          "dominant"
        ]
      },
      "methods": {
        "t": "string",
        "x": 2000
      },
      "magical": {
        "t": "boolean"
      },
      "criminal": {
        "t": "boolean"
      },
      "defenseRole": {
        "t": "enum",
        "v": [
          "none",
          "fortification",
          "garrison",
          "militia",
          "watch",
          "arcane_ward",
          "logistics",
          "intelligence"
        ]
      },
      "description": {
        "t": "string",
        "x": 2000
      },
      "tierMin": {
        "t": "enum",
        "v": [
          "thorp",
          "hamlet",
          "village",
          "town",
          "city",
          "metropolis"
        ]
      },
      "controls": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      },
      "rivals": {
        "t": "string-or-string-list",
        "m": 80,
        "i": 240
      }
    },
    "deities": {
      "name": {
        "t": "string",
        "r": 1,
        "n": 1,
        "x": 160
      },
      "alignmentAxis": {
        "t": "enum",
        "r": 1,
        "v": [
          "good",
          "evil",
          "neutral"
        ]
      },
      "temperamentAxis": {
        "t": "enum",
        "r": 1,
        "v": [
          "warlike",
          "peacelike",
          "neutral"
        ]
      },
      "lawAxis": {
        "t": "enum",
        "v": [
          "lawful",
          "chaotic",
          "neutral"
        ]
      },
      "rankAxis": {
        "t": "enum",
        "r": 1,
        "v": [
          "major",
          "minor",
          "cult"
        ]
      },
      "portfolio": {
        "t": "string",
        "x": 500
      },
      "domain": {
        "t": "string",
        "x": 300
      }
    },
    "traditions": {
      "name": {
        "t": "string",
        "r": 1,
        "n": 1,
        "x": 160
      },
      "motifElement": {
        "t": "enum",
        "v": [
          "founding",
          "first-landing",
          "charter",
          "hearth",
          "harvest",
          "river",
          "stone",
          "the-dead",
          "field",
          "forge",
          "market",
          "hunt",
          "long-sun",
          "tide",
          "greening",
          "stars"
        ]
      },
      "motifAct": {
        "t": "enum",
        "v": [
          "feast",
          "procession",
          "vigil",
          "contest",
          "fair",
          "offering"
        ]
      },
      "epithet": {
        "t": "string",
        "x": 300
      }
    }
  }
  $manifest$::jsonb;
  -- END GENERATED CUSTOM-CONTENT VALIDATION MANIFEST
  v_category jsonb;
  v_key text;
  v_value jsonb;
  v_rule jsonb;
  v_type text;
  v_text text;
begin
  if jsonb_typeof(p_data) is distinct from 'object'
    or octet_length(p_data::text) > 262144
  then
    return false;
  end if;
  v_category := v_manifest -> p_category;
  if v_category is null then return false; end if;

  for v_key, v_rule in select * from jsonb_each(v_category) loop
    if coalesce((v_rule ->> 'r')::integer, 0) = 1
      and (
        not (p_data ? v_key)
        or jsonb_typeof(p_data -> v_key) <> 'string'
        or nullif(btrim(p_data ->> v_key), '') is null
      )
    then
      return false;
    end if;
  end loop;

  for v_key, v_value in select * from jsonb_each(p_data) loop
    if v_key = 'localUid' then
      if jsonb_typeof(v_value) <> 'string'
        or nullif(btrim(v_value #>> '{}'), '') is null
        or char_length(v_value #>> '{}') > 240
        or v_value #>> '{}' <> btrim(v_value #>> '{}')
      then return false; end if;
      continue;
    end if;
    v_rule := v_category -> v_key;
    if v_rule is null then return false; end if;
    v_type := v_rule ->> 't';
    if v_type = 'boolean' then
      if jsonb_typeof(v_value) <> 'boolean' then return false; end if;
    elsif v_type in ('string', 'enum') then
      if jsonb_typeof(v_value) <> 'string' then return false; end if;
      v_text := v_value #>> '{}';
      if v_rule ? 'n' and char_length(btrim(v_text)) < (v_rule ->> 'n')::integer
        then return false; end if;
      if v_rule ? 'x' and char_length(v_text) > (v_rule ->> 'x')::integer
        then return false; end if;
      if v_rule ? 'v'
        and not ((v_rule -> 'v') @> jsonb_build_array(v_text))
        then return false; end if;
    elsif v_type = 'string-or-string-list' then
      if jsonb_typeof(v_value) = 'string' then
        v_text := v_value #>> '{}';
        if v_rule ? 'i' and char_length(v_text) > (v_rule ->> 'i')::integer
          then return false; end if;
        if v_rule ? 'v'
          and not ((v_rule -> 'v') @> jsonb_build_array(v_text))
          then return false; end if;
      elsif jsonb_typeof(v_value) = 'array' then
        if v_rule ? 'm'
          and jsonb_array_length(v_value) > (v_rule ->> 'm')::integer
          then return false; end if;
        if exists (
          select 1
            from jsonb_array_elements(v_value) as item(value)
           where jsonb_typeof(item.value) <> 'string'
              or (
                v_rule ? 'i'
                and char_length(item.value #>> '{}')
                  > (v_rule ->> 'i')::integer
              )
              or (
                v_rule ? 'v'
                and not ((v_rule -> 'v') @> jsonb_build_array(
                  item.value #>> '{}'
                ))
              )
        ) then return false; end if;
      else
        return false;
      end if;
    else
      return false;
    end if;
  end loop;
  return true;
exception when others then
  return false;
end;
$$;

create table if not exists public.custom_content_definitions (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references auth.users(id) on delete cascade,
  category           text not null check (category in (
    'institutions','services','resources','stressors','tradeGoods','factions',
    'deities','traditions','supplyChains','tradeRoutes','powerPresets',
    'defensePresets'
  )),
  local_uid          text not null,
  legacy_content_id  uuid,
  head_revision_id   uuid,
  archived_at        timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (owner_id, local_uid),
  unique (owner_id, id),
  check (
    local_uid = btrim(local_uid)
    and char_length(local_uid) between 1 and 240
  )
);

create table if not exists public.custom_content_revisions (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references auth.users(id) on delete cascade,
  definition_id      uuid not null,
  revision_no        integer not null check (revision_no > 0),
  parent_revision_id uuid,
  schema_version     integer not null default 1 check (schema_version = 1),
  content_hash       text not null check (content_hash ~ '^[0-9a-f]{64}$'),
  data               jsonb not null check (jsonb_typeof(data) = 'object'),
  command_id         text,
  created_at         timestamptz not null default now(),
  unique (definition_id, revision_no),
  unique (owner_id, definition_id, id),
  foreign key (owner_id, definition_id)
    references public.custom_content_definitions(owner_id, id)
    on delete cascade,
  foreign key (owner_id, definition_id, parent_revision_id)
    references public.custom_content_revisions(owner_id, definition_id, id)
);

create index if not exists custom_content_definition_owner_state_idx
  on public.custom_content_definitions(owner_id, archived_at, updated_at desc);
create index if not exists custom_content_revision_history_idx
  on public.custom_content_revisions(owner_id, definition_id, revision_no desc);

-- A circular FK cannot express "this head belongs to this same definition"
-- without permitting a mismatched revision. This trigger enforces the stronger
-- owner+definition invariant at the pointer change itself.
create or replace function public._custom_content_head_valid()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.head_revision_id is not null and not exists (
    select 1
      from public.custom_content_revisions revision
     where revision.id = new.head_revision_id
       and revision.owner_id = new.owner_id
       and revision.definition_id = new.id
  ) then
    raise exception 'definition head must reference its own revision'
      using errcode = '23503';
  end if;
  return new;
end;
$$;

drop trigger if exists custom_content_definition_head_guard
  on public.custom_content_definitions;
create trigger custom_content_definition_head_guard
  before insert or update of head_revision_id
  on public.custom_content_definitions
  for each row execute function public._custom_content_head_valid();

create table if not exists public.content_packs (
  owner_id            uuid not null references auth.users(id) on delete cascade,
  pack_id             text not null,
  name                text not null,
  active_pack_version text,
  active_manifest_hash text
    check (
      active_manifest_hash is null
      or active_manifest_hash ~ '^[0-9a-f]{64}$'
    ),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  primary key (owner_id, pack_id),
  check (pack_id = btrim(pack_id) and char_length(pack_id) between 1 and 240),
  check (name = btrim(name) and char_length(name) between 1 and 240),
  check (
    (active_pack_version is null) = (active_manifest_hash is null)
  )
);

create table if not exists public.content_pack_versions (
  owner_id      uuid not null,
  pack_id       text not null,
  pack_version  text not null,
  manifest_hash text not null check (manifest_hash ~ '^[0-9a-f]{64}$'),
  import_plan_hash text not null
    check (import_plan_hash ~ '^[0-9a-f]{64}$'),
  manifest      jsonb not null check (jsonb_typeof(manifest) = 'object'),
  command_id    text,
  created_at    timestamptz not null default now(),
  primary key (owner_id, pack_id, pack_version),
  foreign key (owner_id, pack_id)
    references public.content_packs(owner_id, pack_id) on delete cascade,
  check (
    pack_version = btrim(pack_version)
    and char_length(pack_version) between 1 and 120
  )
);

alter table public.content_packs
  add constraint content_packs_active_version_fk
  foreign key (owner_id, pack_id, active_pack_version)
  references public.content_pack_versions(owner_id, pack_id, pack_version)
  deferrable initially deferred;

create or replace function public._content_pack_active_valid()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.active_pack_version is null then return new; end if;
  if not exists (
    select 1
      from public.content_pack_versions version
     where version.owner_id = new.owner_id
       and version.pack_id = new.pack_id
       and version.pack_version = new.active_pack_version
       and version.manifest_hash = new.active_manifest_hash
  ) then
    raise exception 'active pack pointer must reference its exact manifest'
      using errcode = '23503';
  end if;
  return new;
end;
$$;

drop trigger if exists content_pack_active_guard on public.content_packs;
create trigger content_pack_active_guard
  before insert or update of active_pack_version, active_manifest_hash
  on public.content_packs
  for each row execute function public._content_pack_active_valid();

create table if not exists public.content_pack_entry_definitions (
  owner_id     uuid not null,
  pack_id      text not null,
  pack_entry_id text not null,
  definition_id uuid not null,
  created_at   timestamptz not null default now(),
  primary key (owner_id, pack_id, pack_entry_id),
  unique (owner_id, pack_id, pack_entry_id, definition_id),
  foreign key (owner_id, pack_id)
    references public.content_packs(owner_id, pack_id) on delete cascade,
  foreign key (owner_id, definition_id)
    references public.custom_content_definitions(owner_id, id)
    on delete cascade,
  check (
    pack_id = btrim(pack_id)
    and char_length(pack_id) between 1 and 240
  ),
  check (
    pack_entry_id = btrim(pack_entry_id)
    and char_length(pack_entry_id) between 1 and 240
  )
);

create table if not exists public.content_pack_version_entries (
  owner_id      uuid not null,
  pack_id       text not null,
  pack_version  text not null,
  pack_entry_id text not null,
  definition_id uuid not null,
  revision_id   uuid not null,
  category      text not null,
  ordinal       integer not null check (ordinal >= 0),
  primary key (owner_id, pack_id, pack_version, pack_entry_id),
  unique (owner_id, pack_id, pack_version, ordinal),
  foreign key (owner_id, pack_id, pack_version)
    references public.content_pack_versions(owner_id, pack_id, pack_version)
    on delete cascade,
  foreign key (owner_id, definition_id)
    references public.custom_content_definitions(owner_id, id)
    on delete cascade,
  foreign key (owner_id, definition_id, revision_id)
    references public.custom_content_revisions(owner_id, definition_id, id),
  foreign key (owner_id, pack_id, pack_entry_id, definition_id)
    references public.content_pack_entry_definitions(
      owner_id, pack_id, pack_entry_id, definition_id
    ),
  check (
    pack_entry_id = btrim(pack_entry_id)
    and char_length(pack_entry_id) between 1 and 240
  )
);

create index if not exists content_pack_entry_lineage_idx
  on public.content_pack_version_entries(
    owner_id, pack_id, pack_entry_id, pack_version
  );

create table if not exists public.content_environments (
  owner_id       uuid not null references auth.users(id) on delete cascade,
  environment_id text not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  primary key (owner_id, environment_id),
  check (
    environment_id = btrim(environment_id)
    and char_length(environment_id) between 1 and 240
  )
);

create table if not exists public.content_environment_revisions (
  owner_id                uuid not null,
  environment_id          text not null,
  environment_revision_id text not null,
  revision_no             integer not null check (revision_no > 0),
  environment_hash        text not null check (environment_hash ~ '^[0-9a-f]{64}$'),
  revision                jsonb not null check (jsonb_typeof(revision) = 'object'),
  command_id              text,
  created_at              timestamptz not null default now(),
  primary key (owner_id, environment_revision_id),
  foreign key (owner_id, environment_id)
    references public.content_environments(owner_id, environment_id)
    on delete cascade,
  unique (owner_id, environment_id, revision_no),
  check (
    environment_revision_id = btrim(environment_revision_id)
    and char_length(environment_revision_id) between 1 and 240
  )
);

create table if not exists public.content_environment_activations (
  owner_id                uuid primary key references auth.users(id)
                            on delete cascade,
  environment_revision_id text not null,
  activated_at            timestamptz not null default now(),
  foreign key (owner_id, environment_revision_id)
    references public.content_environment_revisions(
      owner_id, environment_revision_id
    )
);

-- Preserve every historical row. Legacy non-authorable categories remain
-- inspectable/archivable but the new RPC refuses new revisions for them.
with legacy_rows as (
  select
    cc.*,
    case
      when jsonb_typeof(cc.data) = 'object' then cc.data
      else jsonb_build_object('legacyPayload', cc.data)
    end as object_data,
    case
      when jsonb_typeof(cc.data) = 'object'
        then nullif(btrim(cc.data ->> 'localUid'), '')
      else null
    end as requested_local_uid
  from public.custom_content cc
),
legacy_candidates as (
  select
    legacy_rows.*,
    count(*) over (
      partition by user_id, requested_local_uid
    ) as requested_uid_count
  from legacy_rows
),
legacy_normalized as (
  select
    legacy_candidates.*,
    case
      when requested_local_uid is not null
        and char_length(requested_local_uid) between 1 and 240
        and requested_uid_count = 1
        and not exists (
          select 1
            from public.custom_content fallback_row
           where fallback_row.user_id = legacy_candidates.user_id
             and 'bf_' || fallback_row.id::text = requested_local_uid
        )
        then requested_local_uid
      else 'bf_' || id::text
    end as normalized_local_uid
  from legacy_candidates
)
insert into public.custom_content_definitions (
  id, owner_id, category, local_uid, legacy_content_id,
  created_at, updated_at
)
select
  legacy.id,
  legacy.user_id,
  legacy.category,
  legacy.normalized_local_uid,
  legacy.id,
  legacy.created_at,
  legacy.updated_at
from legacy_normalized legacy
on conflict (id) do nothing;

insert into public.custom_content_revisions (
  owner_id, definition_id, revision_no, schema_version,
  content_hash, data, created_at
)
select
  cc.user_id,
  cc.id,
  1,
  1,
  public._content_sha256(jsonb_build_object(
    'schemaVersion', 1,
    'category', cc.category,
    'data',
      (
        (
          case
            when jsonb_typeof(cc.data) = 'object' then cc.data
            else jsonb_build_object('legacyPayload', cc.data)
          end
        ) - array[
          'id','definitionId','revisionId','revisionNumber','contentHash',
          'createdAt','updatedAt','archivedAt','isCustom','_schemaVersion',
          'packEntryId','sourceDefinitionId','sourceRevisionId','commandReceipt'
        ]::text[]
      )
      || jsonb_build_object(
        'localUid', definition.local_uid
      )
  )),
  (
    (
      case
        when jsonb_typeof(cc.data) = 'object' then cc.data
        else jsonb_build_object('legacyPayload', cc.data)
      end
    ) - array[
      'id','definitionId','revisionId','revisionNumber','contentHash',
      'createdAt','updatedAt','archivedAt','isCustom','_schemaVersion',
      'packEntryId','sourceDefinitionId','sourceRevisionId','commandReceipt'
    ]::text[]
  )
  || jsonb_build_object(
    'localUid', definition.local_uid
  ),
  cc.created_at
from public.custom_content cc
join public.custom_content_definitions definition
  on definition.owner_id = cc.user_id
 and definition.id = cc.id
where not exists (
  select 1
    from public.custom_content_revisions revision
   where revision.definition_id = cc.id
);

update public.custom_content_definitions definition
   set head_revision_id = revision.id
  from public.custom_content_revisions revision
 where revision.definition_id = definition.id
   and revision.revision_no = 1
   and definition.head_revision_id is null;

-- Migration 185 is the mutation cutover. Cached pre-185 clients may continue
-- reading the compatibility table, but they must fail closed on writes instead
-- of creating rows that the revisioned reader can never observe.
drop policy if exists "users insert own custom content"
  on public.custom_content;
drop policy if exists "users update own custom content"
  on public.custom_content;
drop policy if exists "users delete own custom content"
  on public.custom_content;
drop policy if exists "premium users insert own custom content"
  on public.custom_content;
drop policy if exists "premium users update own custom content"
  on public.custom_content;
drop policy if exists "premium users delete own custom content"
  on public.custom_content;
revoke insert, update, delete on table public.custom_content
  from public, anon, authenticated, service_role;

-- Owner read visibility, RPC-only mutation.
alter table public.custom_content_definitions enable row level security;
alter table public.custom_content_revisions enable row level security;
alter table public.content_packs enable row level security;
alter table public.content_pack_versions enable row level security;
alter table public.content_pack_entry_definitions enable row level security;
alter table public.content_pack_version_entries enable row level security;
alter table public.content_environments enable row level security;
alter table public.content_environment_revisions enable row level security;
alter table public.content_environment_activations enable row level security;

create policy "Owners read own custom content definitions"
  on public.custom_content_definitions for select
  using (auth.uid() = owner_id);
create policy "Owners read own custom content revisions"
  on public.custom_content_revisions for select
  using (auth.uid() = owner_id);
create policy "Owners read own content packs"
  on public.content_packs for select using (auth.uid() = owner_id);
create policy "Owners read own content pack versions"
  on public.content_pack_versions for select using (auth.uid() = owner_id);
create policy "Owners read own content pack entry definitions"
  on public.content_pack_entry_definitions for select
  using (auth.uid() = owner_id);
create policy "Owners read own content pack version entries"
  on public.content_pack_version_entries for select
  using (auth.uid() = owner_id);
create policy "Owners read own content environments"
  on public.content_environments for select using (auth.uid() = owner_id);
create policy "Owners read own content environment revisions"
  on public.content_environment_revisions for select
  using (auth.uid() = owner_id);
create policy "Owners read own content environment activation"
  on public.content_environment_activations for select
  using (auth.uid() = owner_id);
revoke all on table
  public.custom_content_definitions,
  public.custom_content_revisions,
  public.content_packs,
  public.content_pack_versions,
  public.content_pack_entry_definitions,
  public.content_pack_version_entries,
  public.content_environments,
  public.content_environment_revisions,
  public.content_environment_activations
from public, anon, authenticated;

grant select on table
  public.custom_content_definitions,
  public.custom_content_revisions,
  public.content_packs,
  public.content_pack_versions,
  public.content_pack_entry_definitions,
  public.content_pack_version_entries,
  public.content_environments,
  public.content_environment_revisions,
  public.content_environment_activations
to authenticated;

-- The service role receives the same read surface plus the command RPC below.
-- It deliberately receives no direct DML: otherwise an edge-function bug could
-- bypass expected-head CAS or rewrite an object described as immutable.
revoke all on table
  public.custom_content_definitions,
  public.custom_content_revisions,
  public.content_packs,
  public.content_pack_versions,
  public.content_pack_entry_definitions,
  public.content_pack_version_entries,
  public.content_environments,
  public.content_environment_revisions,
  public.content_environment_activations
from service_role;

grant select on table
  public.custom_content_definitions,
  public.custom_content_revisions,
  public.content_packs,
  public.content_pack_versions,
  public.content_pack_entry_definitions,
  public.content_pack_version_entries,
  public.content_environments,
  public.content_environment_revisions,
  public.content_environment_activations
to service_role;

create or replace function public._content_environment_valid(p_environment jsonb)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_core jsonb;
  v_tunables jsonb;
  v_key text;
  v_value jsonb;
begin
  if jsonb_typeof(p_environment) is distinct from 'object'
    or not (
      p_environment ?& array[
        'schemaVersion','environmentId','environmentRevisionId',
        'revisionNumber','source','packVersions','directDefinitions',
        'tunables','visualSelection','environmentHash','createdAt'
      ]
    )
    or (
      p_environment - array[
        'schemaVersion','environmentId','environmentRevisionId',
        'revisionNumber','source','packVersions','directDefinitions',
        'tunables','visualSelection','environmentHash','createdAt'
      ]
    ) <> '{}'::jsonb
    or jsonb_typeof(p_environment -> 'schemaVersion') <> 'number'
    or p_environment ->> 'schemaVersion' is distinct from '1'
    or nullif(btrim(p_environment ->> 'environmentId'), '') is null
    or char_length(p_environment ->> 'environmentId') > 240
    or p_environment ->> 'environmentId'
      <> btrim(p_environment ->> 'environmentId')
    or nullif(btrim(p_environment ->> 'environmentRevisionId'), '') is null
    or char_length(p_environment ->> 'environmentRevisionId') > 240
    or p_environment ->> 'environmentRevisionId'
      <> btrim(p_environment ->> 'environmentRevisionId')
    or jsonb_typeof(p_environment -> 'revisionNumber') <> 'number'
    or coalesce(p_environment ->> 'revisionNumber', '') !~ '^[1-9][0-9]*$'
    or jsonb_typeof(p_environment -> 'source') <> 'string'
    or nullif(btrim(p_environment ->> 'source'), '') is null
    or char_length(p_environment ->> 'source') > 240
    or p_environment ->> 'source' <> btrim(p_environment ->> 'source')
    or jsonb_typeof(p_environment -> 'packVersions') is distinct from 'array'
    or jsonb_array_length(p_environment -> 'packVersions') > 64
    or jsonb_typeof(p_environment -> 'directDefinitions') is distinct from 'array'
    or jsonb_array_length(p_environment -> 'directDefinitions') > 2000
    or jsonb_typeof(p_environment -> 'tunables') is distinct from 'object'
    or jsonb_typeof(p_environment -> 'visualSelection') is distinct from 'object'
    -- No environment-wide visual selection has a renderer consumer yet. The
    -- client registry is deliberately empty; SQL mirrors that fail-closed
    -- contract until a registered ASCII key/value is implemented end to end.
    or p_environment -> 'visualSelection' <> '{}'::jsonb
    or coalesce(p_environment ->> 'environmentHash', '')
      !~ '^[0-9a-f]{64}$'
    or not (
      jsonb_typeof(p_environment -> 'createdAt') = 'null'
      or (
        jsonb_typeof(p_environment -> 'createdAt') = 'string'
        and nullif(btrim(p_environment ->> 'createdAt'), '') is not null
        and char_length(p_environment ->> 'createdAt') <= 100
      )
    )
  then
    return false;
  end if;

  if exists (
    select 1
      from jsonb_array_elements(p_environment -> 'packVersions')
        with ordinality as item(value, ordinal)
     where jsonb_typeof(item.value) <> 'object'
        or not (
          item.value ?& array[
            'packId','packVersionId','manifestHash','order'
          ]
        )
        or (
          item.value - array[
            'packId','packVersionId','manifestHash','order'
          ]
        ) <> '{}'::jsonb
        or nullif(btrim(item.value ->> 'packId'), '') is null
        or char_length(item.value ->> 'packId') > 240
        or item.value ->> 'packId' <> btrim(item.value ->> 'packId')
        or nullif(btrim(item.value ->> 'packVersionId'), '') is null
        or char_length(item.value ->> 'packVersionId') > 240
        or item.value ->> 'packVersionId'
          <> btrim(item.value ->> 'packVersionId')
        or coalesce(item.value ->> 'manifestHash', '')
          !~ '^[0-9a-f]{64}$'
        or jsonb_typeof(item.value -> 'order') <> 'number'
        or coalesce(item.value ->> 'order', '') !~ '^[0-9]+$'
        or (item.value ->> 'order')::integer <> item.ordinal - 1
  ) then return false; end if;

  if (
    select count(distinct item.value ->> 'packId')
      from jsonb_array_elements(p_environment -> 'packVersions')
        as item(value)
  ) <> jsonb_array_length(p_environment -> 'packVersions')
  then return false; end if;

  if exists (
    select 1
      from jsonb_array_elements(p_environment -> 'directDefinitions')
        as item(value)
     where jsonb_typeof(item.value) <> 'object'
        or not (
          item.value ?& array[
            'definitionId','revisionId','contentHash','category'
          ]
        )
        or (
          item.value - array[
            'definitionId','revisionId','contentHash','category'
          ]
        ) <> '{}'::jsonb
        or nullif(btrim(item.value ->> 'definitionId'), '') is null
        or char_length(item.value ->> 'definitionId') > 240
        or item.value ->> 'definitionId'
          <> btrim(item.value ->> 'definitionId')
        or nullif(btrim(item.value ->> 'revisionId'), '') is null
        or char_length(item.value ->> 'revisionId') > 240
        or item.value ->> 'revisionId'
          <> btrim(item.value ->> 'revisionId')
        or coalesce(item.value ->> 'contentHash', '')
          !~ '^[0-9a-f]{64}$'
        or item.value ->> 'category' not in (
          'institutions','services','resources','stressors',
          'tradeGoods','factions','deities','traditions'
        )
  ) then return false; end if;

  if (
    select count(distinct item.value ->> 'definitionId')
      from jsonb_array_elements(p_environment -> 'directDefinitions')
        as item(value)
  ) <> jsonb_array_length(p_environment -> 'directDefinitions')
  then return false; end if;

  v_tunables := p_environment -> 'tunables';
  for v_key, v_value in select * from jsonb_each(v_tunables) loop
    if v_key = 'magicExists' then
      if jsonb_typeof(v_value) <> 'boolean' then return false; end if;
    elsif v_key in (
      'priorityEconomy','priorityMilitary','priorityMagic',
      'priorityReligion','priorityCriminal'
    ) then
      if jsonb_typeof(v_value) <> 'number'
        or (v_value #>> '{}') !~ '^(0|[1-9][0-9]?|100)$'
      then return false; end if;
    else
      return false;
    end if;
  end loop;

  v_core := jsonb_build_object(
    'schemaVersion', 1,
    'environmentId', p_environment -> 'environmentId',
    'environmentRevisionId', p_environment -> 'environmentRevisionId',
    'revisionNumber', p_environment -> 'revisionNumber',
    'source', p_environment -> 'source',
    'packVersions', p_environment -> 'packVersions',
    'directDefinitions', p_environment -> 'directDefinitions',
    'tunables', p_environment -> 'tunables',
    'visualSelection', p_environment -> 'visualSelection'
  );
  return public._content_sha256(v_core)
    = p_environment ->> 'environmentHash';
exception when others then
  return false;
end;
$$;

create or replace function public._custom_content_projection(
  p_definition public.custom_content_definitions,
  p_revision public.custom_content_revisions
)
returns jsonb
language sql
stable
set search_path = public, pg_temp
as $$
  select p_revision.data || jsonb_build_object(
    'id', p_definition.id,
    'definitionId', p_definition.id,
    'revisionId', p_revision.id,
    'revisionNumber', p_revision.revision_no,
    'contentHash', p_revision.content_hash,
    'localUid', p_definition.local_uid,
    'isCustom', true,
    'createdAt', p_definition.created_at,
    'updatedAt', p_revision.created_at,
    'archivedAt', p_definition.archived_at,
    '_schemaVersion', 1
  )
$$;

create or replace function public._content_uuid(p_value text)
returns uuid
language plpgsql
immutable
set search_path = public, pg_temp
as $$
begin
  if p_value is null
    or p_value !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  then
    return null;
  end if;
  return p_value::uuid;
end;
$$;

-- Full pack manifests are immutable semantic input, not display provenance.
-- This validator mirrors contentPacks.js's v2 manifest-core hash and proves
-- every transport entry against the generated custom-content schema.
create or replace function public._content_pack_manifest_valid(
  p_manifest jsonb,
  p_pack_id text,
  p_pack_version text,
  p_manifest_hash text
)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_bucket text;
  v_entry jsonb;
  v_authored jsonb;
  v_count integer := 0;
  v_top_keys text[] := array[
    'format','formatVersion','packId','packVersion','contentSchemaVersion',
    'name','description','authorship','license','source','compatibility',
    'dependencies','tunables','visualSelection','exportedAt','content',
    'manifestHash'
  ];
  v_buckets text[] := array[
    'institutions','services','resources','stressors',
    'tradeGoods','factions','deities','traditions'
  ];
  v_transport_keys text[] := array[
    'id','definitionId','revisionId','revisionNumber','contentHash',
    'createdAt','updatedAt','archivedAt','isCustom','_schemaVersion',
    'packEntryId','sourceDefinitionId','sourceRevisionId','commandReceipt'
  ];
begin
  if jsonb_typeof(p_manifest) is distinct from 'object'
    or not (p_manifest ?& v_top_keys)
    or (p_manifest - v_top_keys) <> '{}'::jsonb
    or p_manifest ->> 'format'
      is distinct from 'settlementforge.content-pack'
    or p_manifest ->> 'formatVersion' is distinct from '2'
    or p_manifest ->> 'contentSchemaVersion' is distinct from '1'
    or p_manifest ->> 'packId' is distinct from p_pack_id
    or p_manifest ->> 'packVersion' is distinct from p_pack_version
    or p_manifest ->> 'manifestHash' is distinct from p_manifest_hash
    or nullif(btrim(p_manifest ->> 'name'), '') is null
    or char_length(p_manifest ->> 'name') > 160
    or jsonb_typeof(p_manifest -> 'compatibility') is distinct from 'object'
    or (
      (p_manifest -> 'compatibility') - array[
        'minAppVersion','maxAppVersion',
        'minSimulationVersion','maxSimulationVersion'
      ]
    ) <> '{}'::jsonb
    or not (
      (p_manifest -> 'compatibility') ?& array[
        'minAppVersion','maxAppVersion',
        'minSimulationVersion','maxSimulationVersion'
      ]
    )
    or jsonb_typeof(p_manifest -> 'dependencies') is distinct from 'array'
    or jsonb_array_length(p_manifest -> 'dependencies') <> 0
    or jsonb_typeof(p_manifest -> 'tunables') is distinct from 'object'
    or jsonb_typeof(p_manifest -> 'visualSelection') is distinct from 'object'
    or coalesce(p_manifest ->> 'exportedAt', '')
      !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$'
    or jsonb_typeof(p_manifest -> 'content') is distinct from 'object'
    or not ((p_manifest -> 'content') ?& v_buckets)
    or ((p_manifest -> 'content') - v_buckets) <> '{}'::jsonb
    or public._content_sha256(
      p_manifest - array['exportedAt','manifestHash']
    ) <> p_manifest_hash
  then
    return false;
  end if;

  foreach v_bucket in array v_buckets loop
    if jsonb_typeof(p_manifest #> array['content', v_bucket])
      is distinct from 'array'
    then
      return false;
    end if;
    for v_entry in
      select value
        from jsonb_array_elements(
          p_manifest #> array['content', v_bucket]
        )
    loop
      v_count := v_count + 1;
      if v_count > 1000
        or jsonb_typeof(v_entry) is distinct from 'object'
        or nullif(btrim(v_entry ->> 'packEntryId'), '') is null
        or char_length(v_entry ->> 'packEntryId') > 240
        or nullif(btrim(v_entry ->> 'sourceDefinitionId'), '') is null
        or char_length(v_entry ->> 'sourceDefinitionId') > 240
        or nullif(btrim(v_entry ->> 'sourceRevisionId'), '') is null
        or char_length(v_entry ->> 'sourceRevisionId') > 240
        or coalesce(v_entry ->> 'contentHash', '')
          !~ '^[0-9a-f]{64}$'
      then
        return false;
      end if;
      v_authored := v_entry - v_transport_keys;
      if not public._custom_content_record_valid(v_bucket, v_authored)
        or public._content_sha256(jsonb_build_object(
          'schemaVersion', 1,
          'category', v_bucket,
          'data', v_authored
        )) <> v_entry ->> 'contentHash'
      then
        return false;
      end if;
    end loop;
  end loop;

  if v_count = 0
    or (
      select count(distinct entry.value ->> 'packEntryId')
        from jsonb_each(p_manifest -> 'content') bucket
        cross join lateral jsonb_array_elements(bucket.value) entry(value)
    ) <> v_count
    or (
      select count(distinct entry.value ->> 'localUid')
        from jsonb_each(p_manifest -> 'content') bucket
        cross join lateral jsonb_array_elements(bucket.value) entry(value)
       where entry.value ->> 'localUid' is not null
    ) <> (
      select count(*)
        from jsonb_each(p_manifest -> 'content') bucket
        cross join lateral jsonb_array_elements(bucket.value) entry(value)
       where entry.value ->> 'localUid' is not null
    )
  then
    return false;
  end if;
  return true;
exception when others then
  return false;
end;
$$;

-- Reproduce prepareImport's stable local identity and dependency rewrite. A
-- null result means the requested entry or one of its custom dependencies is
-- absent, so server admission fails closed.
create or replace function public._content_pack_import_data(
  p_manifest jsonb,
  p_pack_entry_id text
)
returns jsonb
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_entry jsonb;
  v_data jsonb;
  v_field text;
  v_value jsonb;
  v_ref text;
  v_source_entry_id text;
  v_destination_ref text;
  v_rewritten jsonb;
  v_transport_keys text[] := array[
    'id','definitionId','revisionId','revisionNumber','contentHash',
    'createdAt','updatedAt','archivedAt','isCustom','_schemaVersion',
    'packEntryId','sourceDefinitionId','sourceRevisionId','commandReceipt'
  ];
  v_dependency_fields text[] := array[
    'produces','requires','subsumes','providedBy','yields','enables',
    'disablesInstitutions','disablesGoods','requiredInstitution',
    'requiredResources','controls','rivals'
  ];
begin
  select entry.value
    into v_entry
    from jsonb_each(p_manifest -> 'content') bucket
    cross join lateral jsonb_array_elements(bucket.value) entry(value)
   where entry.value ->> 'packEntryId' = p_pack_entry_id;
  if not found then return null; end if;

  v_data := v_entry - v_transport_keys;
  v_data := jsonb_set(
    v_data,
    '{localUid}',
    to_jsonb(
      'lu_pack_' || substring(public._content_sha256(
        jsonb_build_object(
          'packId', p_manifest ->> 'packId',
          'packEntryId', p_pack_entry_id
        )
      ) from 1 for 24)
    ),
    true
  );

  foreach v_field in array v_dependency_fields loop
    if not (v_data ? v_field) then continue; end if;
    v_value := v_data -> v_field;
    if jsonb_typeof(v_value) = 'string' then
      v_ref := v_data ->> v_field;
      if left(v_ref, 7) = 'custom:' then
        select entry.value ->> 'packEntryId'
          into v_source_entry_id
          from jsonb_each(p_manifest -> 'content') bucket
          cross join lateral jsonb_array_elements(bucket.value) entry(value)
         where entry.value ->> 'localUid' = substring(v_ref from 8);
        if not found then return null; end if;
        v_destination_ref := 'custom:lu_pack_' || substring(
          public._content_sha256(jsonb_build_object(
            'packId', p_manifest ->> 'packId',
            'packEntryId', v_source_entry_id
          )) from 1 for 24
        );
        v_data := jsonb_set(
          v_data, array[v_field], to_jsonb(v_destination_ref), false
        );
      end if;
    elsif jsonb_typeof(v_value) = 'array' then
      select coalesce(jsonb_agg(
        case
          when jsonb_typeof(item.value) = 'string'
            and left(item.value #>> '{}', 7) = 'custom:'
          then (
            select case
              when source_entry.value is null then null
              else to_jsonb(
                'custom:lu_pack_' || substring(
                  public._content_sha256(jsonb_build_object(
                    'packId', p_manifest ->> 'packId',
                    'packEntryId',
                    source_entry.value ->> 'packEntryId'
                  )) from 1 for 24
                )
              )
            end
              from (
                select entry.value
                  from jsonb_each(p_manifest -> 'content') bucket
                  cross join lateral jsonb_array_elements(
                    bucket.value
                  ) entry(value)
                 where entry.value ->> 'localUid'
                   = substring(item.value #>> '{}' from 8)
              ) source_entry
          )
          else item.value
        end
        order by item.ordinal
      ), '[]'::jsonb)
        into v_rewritten
        from jsonb_array_elements(v_value)
          with ordinality item(value, ordinal);
      if exists (
        select 1
          from jsonb_array_elements(v_rewritten) item(value)
         where item.value = 'null'::jsonb
      ) then
        return null;
      end if;
      v_data := jsonb_set(v_data, array[v_field], v_rewritten, false);
    end if;
  end loop;
  return v_data;
exception when others then
  return null;
end;
$$;

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
  v_kind text;
  v_fingerprint text;
  v_claim jsonb;
  v_now timestamptz := clock_timestamp();
  v_entry jsonb;
  v_ordinal integer;
  v_definition_id uuid;
  v_expected_revision_id uuid;
  v_revision_id uuid;
  v_parent_revision_id uuid;
  v_revision_no integer;
  v_local_uid text;
  v_data jsonb;
  v_content_hash text;
  v_definition public.custom_content_definitions%rowtype;
  v_revision public.custom_content_revisions%rowtype;
  v_existing boolean;
  v_reason text := null;
  v_failure_status text := 'failed';
  v_items jsonb := '[]'::jsonb;
  v_archived_items jsonb := '[]'::jsonb;
  v_per_entry jsonb := '[]'::jsonb;
  v_result jsonb;
  v_response jsonb;
  v_pack jsonb;
  v_pack_manifest jsonb;
  v_pack_id text;
  v_pack_version text;
  v_pack_hash text;
  v_pack_import_hash text;
  v_pack_existing_hash text;
  v_pack_existing_import_hash text;
  v_expected_pack_version text;
  v_expected_pack_hash text;
  v_active_pack_version text;
  v_active_pack_hash text;
  v_pack_entry_count integer;
  v_prior_pack_revision_id uuid;
  v_environment jsonb;
  v_environment_id text;
  v_environment_revision_id text;
  v_environment_hash text;
  v_expected_environment_revision_id text;
  v_active_environment_revision_id text;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if p_expected_owner is null or p_expected_owner <> v_uid then
    raise exception 'custom-content owner changed' using errcode = '42501';
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
  then
    raise exception 'invalid custom-content command envelope'
      using errcode = '22023';
  end if;

  v_kind := p_plan ->> 'kind';
  if not (
      p_plan ?& array[
        'schemaVersion','kind','definitionId','expectedHeadRevisionId',
        'expectedActiveEnvironmentRevisionId','pack','environment','entries'
      ]
    )
    or (
      p_plan - array[
        'schemaVersion','kind','definitionId','expectedHeadRevisionId',
        'expectedActiveEnvironmentRevisionId','pack','environment','entries'
      ]
    ) <> '{}'::jsonb
    or jsonb_typeof(p_plan -> 'schemaVersion') <> 'number'
    or p_plan ->> 'schemaVersion' is distinct from '1'
    or jsonb_typeof(p_plan -> 'kind') <> 'string'
    or jsonb_typeof(p_plan -> 'definitionId') not in ('null', 'string')
    or jsonb_typeof(p_plan -> 'expectedHeadRevisionId')
      not in ('null', 'string')
    or jsonb_typeof(p_plan -> 'expectedActiveEnvironmentRevisionId')
      not in ('null', 'string')
    or jsonb_typeof(p_plan -> 'pack') not in ('null', 'object')
    or jsonb_typeof(p_plan -> 'environment') not in ('null', 'object')
    or v_kind not in (
      'content.definition.create-revision',
      'content.definition.archive',
      'content.definition.restore',
      'content.pack.import',
      'content.environment.migrate',
      'content.definition.mass-update'
    )
    or jsonb_typeof(coalesce(p_plan -> 'entries', '[]'::jsonb))
      is distinct from 'array'
    or jsonb_array_length(coalesce(p_plan -> 'entries', '[]'::jsonb)) > 1000
  then
    raise exception 'unsupported custom-content command plan'
      using errcode = '22023';
  end if;

  if v_kind in (
    'content.definition.create-revision',
    'content.definition.mass-update',
    'content.pack.import'
  ) and jsonb_array_length(p_plan -> 'entries') = 0 then
    raise exception 'custom-content command requires entries'
      using errcode = '22023';
  end if;

  if (
      v_kind not in (
        'content.definition.archive',
        'content.definition.restore'
      )
      and (
        p_plan ->> 'definitionId' is not null
        or p_plan ->> 'expectedHeadRevisionId' is not null
      )
    )
    or (
      v_kind <> 'content.environment.migrate'
      and (
        p_plan ->> 'expectedActiveEnvironmentRevisionId' is not null
        or p_plan ->> 'environment' is not null
      )
    )
    or (
      v_kind <> 'content.pack.import'
      and p_plan ->> 'pack' is not null
    )
    or (
      v_kind not in (
        'content.definition.create-revision',
        'content.definition.mass-update',
        'content.pack.import'
      )
      and jsonb_array_length(p_plan -> 'entries') <> 0
    )
  then
    raise exception 'custom-content command carries fields its kind does not consume'
      using errcode = '22023';
  end if;

  for v_entry in
    select value from jsonb_array_elements(p_plan -> 'entries')
  loop
    if jsonb_typeof(v_entry) is distinct from 'object'
      or not (
        v_entry ?& array[
          'definitionId','expectedHeadRevisionId','packEntryId',
          'category','data'
        ]
      )
      or (
        v_entry - array[
          'definitionId','expectedHeadRevisionId','packEntryId',
          'category','data'
        ]
      ) <> '{}'::jsonb
      or jsonb_typeof(v_entry -> 'definitionId') not in ('null', 'string')
      or jsonb_typeof(v_entry -> 'expectedHeadRevisionId')
        not in ('null', 'string')
      or jsonb_typeof(v_entry -> 'packEntryId') not in ('null', 'string')
      or jsonb_typeof(v_entry -> 'category') <> 'string'
      or not public._custom_content_record_valid(
        v_entry ->> 'category',
        v_entry -> 'data'
      )
      or (
        v_entry ->> 'definitionId' is not null
        and public._content_uuid(v_entry ->> 'definitionId') is null
      )
      or (
        v_entry ->> 'expectedHeadRevisionId' is not null
        and public._content_uuid(
          v_entry ->> 'expectedHeadRevisionId'
        ) is null
      )
      or (
        v_kind = 'content.pack.import'
        and (
          nullif(btrim(v_entry ->> 'packEntryId'), '') is null
          or char_length(v_entry ->> 'packEntryId') > 240
          or v_entry ->> 'packEntryId' <> btrim(v_entry ->> 'packEntryId')
        )
      )
      or (
        v_kind <> 'content.pack.import'
        and v_entry ->> 'packEntryId' is not null
      )
      or (
        v_kind in (
          'content.definition.create-revision',
          'content.definition.mass-update'
        )
        and public._content_uuid(v_entry ->> 'definitionId') is null
      )
    then
      raise exception 'custom-content entry failed manifest admission'
        using errcode = '22023';
    end if;
  end loop;

  if (
    select count(*)
      from jsonb_array_elements(p_plan -> 'entries') as item(value)
     where item.value ->> 'definitionId' is not null
  ) <> (
    select count(distinct item.value ->> 'definitionId')
      from jsonb_array_elements(p_plan -> 'entries') as item(value)
     where item.value ->> 'definitionId' is not null
  ) then
    raise exception 'definition ids must be unique inside one command'
      using errcode = '22023';
  end if;

  if (
    select count(*)
      from jsonb_array_elements(p_plan -> 'entries') as item(value)
     where item.value #>> '{data,localUid}' is not null
  ) <> (
    select count(distinct item.value #>> '{data,localUid}')
      from jsonb_array_elements(p_plan -> 'entries') as item(value)
     where item.value #>> '{data,localUid}' is not null
  ) then
    raise exception 'local content references must be unique inside one command'
      using errcode = '22023';
  end if;

  if v_kind in (
    'content.definition.archive',
    'content.definition.restore'
  ) then
    v_definition_id := public._content_uuid(p_plan ->> 'definitionId');
    v_expected_revision_id := public._content_uuid(
      p_plan ->> 'expectedHeadRevisionId'
    );
    if v_definition_id is null or v_expected_revision_id is null then
      raise exception 'lifecycle command requires definition and expected head'
        using errcode = '22023';
    end if;
  end if;

  if v_kind = 'content.pack.import' then
    v_pack := p_plan -> 'pack';
    v_pack_id := v_pack ->> 'packId';
    v_pack_version := v_pack ->> 'packVersion';
    v_pack_hash := v_pack ->> 'manifestHash';
    v_pack_manifest := v_pack -> 'manifest';
    v_pack_import_hash := v_pack ->> 'importPlanHash';
    v_expected_pack_version := v_pack ->> 'expectedActivePackVersion';
    v_expected_pack_hash := v_pack ->> 'expectedActiveManifestHash';
    if jsonb_typeof(v_pack) is distinct from 'object'
      or not (
        v_pack ?& array[
          'packId','packVersion','name','manifestHash',
          'expectedActivePackVersion','expectedActiveManifestHash',
          'importPlanHash','manifest'
        ]
      )
      or (
        v_pack - array[
          'packId','packVersion','name','manifestHash',
          'expectedActivePackVersion','expectedActiveManifestHash',
          'importPlanHash','manifest'
        ]
      ) <> '{}'::jsonb
      or jsonb_typeof(v_pack -> 'packId') <> 'string'
      or jsonb_typeof(v_pack -> 'packVersion') <> 'string'
      or jsonb_typeof(v_pack -> 'name') <> 'string'
      or jsonb_typeof(v_pack -> 'manifestHash') <> 'string'
      or jsonb_typeof(v_pack -> 'manifest') <> 'object'
      or jsonb_typeof(v_pack -> 'expectedActivePackVersion')
        not in ('null', 'string')
      or jsonb_typeof(v_pack -> 'expectedActiveManifestHash')
        not in ('null', 'string')
      or jsonb_typeof(v_pack -> 'importPlanHash') <> 'string'
      or nullif(btrim(v_pack_id), '') is null
      or char_length(v_pack_id) > 240
      or v_pack_id <> btrim(v_pack_id)
      or nullif(btrim(v_pack_version), '') is null
      or char_length(v_pack_version) > 120
      or v_pack_version <> btrim(v_pack_version)
      or coalesce(v_pack_hash, '') !~ '^[0-9a-f]{64}$'
      or nullif(btrim(v_pack ->> 'name'), '') is null
      or char_length(v_pack ->> 'name') > 240
      or v_pack ->> 'name' <> btrim(v_pack ->> 'name')
      or not public._content_pack_manifest_valid(
        v_pack_manifest,
        v_pack_id,
        v_pack_version,
        v_pack_hash
      )
    then
      raise exception 'pack command requires a valid immutable version'
        using errcode = '22023';
    end if;
    if (
      (v_expected_pack_version is null) <> (v_expected_pack_hash is null)
      or (
        v_expected_pack_hash is not null
        and v_expected_pack_hash !~ '^[0-9a-f]{64}$'
      )
      or (
        v_expected_pack_version is not null
        and v_expected_pack_version <> btrim(v_expected_pack_version)
      )
    ) then
      raise exception 'pack command expected-active identity is invalid'
        using errcode = '22023';
    end if;
    if (
      coalesce(v_pack_import_hash, '') !~ '^[0-9a-f]{64}$'
      or v_pack_import_hash <> public._content_sha256(
        jsonb_build_object(
          'schemaVersion', 1,
          'packId', v_pack_id,
          'packVersion', v_pack_version,
          'entries', (
            select coalesce(jsonb_agg(
              jsonb_build_object(
                'packEntryId', item.value -> 'packEntryId',
                'category', item.value -> 'category',
                'data', item.value -> 'data'
              )
              order by item.ordinal
            ), '[]'::jsonb)
              from jsonb_array_elements(p_plan -> 'entries')
                with ordinality as item(value, ordinal)
          )
        )
      )
    ) then
      raise exception 'pack normalized import plan hash is invalid'
        using errcode = '22023';
    end if;
    if (
      select count(distinct value ->> 'packEntryId')
        from jsonb_array_elements(p_plan -> 'entries')
    ) <> jsonb_array_length(p_plan -> 'entries') then
      raise exception 'pack entry ids must be unique'
        using errcode = '22023';
    end if;
    if exists (
      select 1
        from jsonb_array_elements(p_plan -> 'entries') item(value)
       where public._content_pack_import_data(
           v_pack_manifest,
           item.value ->> 'packEntryId'
         ) is distinct from item.value -> 'data'
          or not exists (
            select 1
              from jsonb_each(v_pack_manifest -> 'content') bucket
              cross join lateral jsonb_array_elements(
                bucket.value
              ) manifest_entry(value)
             where manifest_entry.value ->> 'packEntryId'
               = item.value ->> 'packEntryId'
               and bucket.key = item.value ->> 'category'
          )
    ) or (
      select count(*)
        from jsonb_each(v_pack_manifest -> 'content') bucket
        cross join lateral jsonb_array_elements(bucket.value) entry(value)
    ) <> jsonb_array_length(p_plan -> 'entries')
    then
      raise exception 'pack manifest does not match normalized import entries'
        using errcode = '22023';
    end if;
  end if;

  if v_kind = 'content.environment.migrate' then
    v_environment := p_plan -> 'environment';
    v_expected_environment_revision_id :=
      p_plan ->> 'expectedActiveEnvironmentRevisionId';
    if not public._content_environment_valid(v_environment) then
      raise exception 'content environment failed admission'
        using errcode = '22023';
    elsif nullif(btrim(v_expected_environment_revision_id), '') is null
      or char_length(v_expected_environment_revision_id) > 240
      or v_expected_environment_revision_id
        <> btrim(v_expected_environment_revision_id)
    then
      raise exception 'content environment requires an expected active revision'
        using errcode = '22023';
    end if;
    v_environment_id := v_environment ->> 'environmentId';
    v_environment_revision_id :=
      v_environment ->> 'environmentRevisionId';
    v_environment_hash := v_environment ->> 'environmentHash';
  end if;

  v_fingerprint := public._content_sha256(p_plan);
  if v_fingerprint <> p_preview_fingerprint then
    raise exception 'custom-content preview fingerprint mismatch'
      using errcode = '22023';
  end if;

  v_claim := public.claim_application_command(
    v_uid,
    p_command_id,
    v_fingerprint,
    v_kind,
    case
      when v_kind in (
        'content.definition.archive',
        'content.definition.restore'
      ) then v_definition_id
      else null
    end,
    null
  );

  if v_claim ->> 'status' = 'conflict' then
    return v_claim;
  end if;
  if v_claim ->> 'phase' = 'finalized'
    and v_claim -> 'receipt' is not null
  then
    return (v_claim -> 'receipt') || jsonb_build_object('replayed', true);
  end if;
  if v_claim ->> 'status' = 'reconcile-required' then
    return jsonb_build_object(
      'status', 'reconcile-required',
      'reason', coalesce(v_claim ->> 'reason', 'command_requires_reconciliation'),
      'replayed', true,
      'fingerprint', v_fingerprint
    );
  end if;

  -- One account has one custom-content constitution. Serializing only that
  -- owner's mutation boundary closes absent-row and local-identity races across
  -- different command ids without reducing throughput between accounts. The
  -- narrower pack/environment/definition locks below still document and defend
  -- each CAS scope independently.
  perform pg_advisory_xact_lock(
    hashtext('custom-content-owner'),
    hashtext(v_uid::text)
  );

  -- Immutable pack version identity is checked before any definition write.
  if v_kind = 'content.pack.import' then
    perform pg_advisory_xact_lock(
      hashtext(
        'custom-content-pack:' || v_uid::text || ':' || coalesce(v_pack_id, '')
      )
    );
    select pack.active_pack_version, pack.active_manifest_hash
      into v_active_pack_version, v_active_pack_hash
      from public.content_packs pack
     where pack.owner_id = v_uid
       and pack.pack_id = v_pack_id
     for update;
    if (
      v_active_pack_version is distinct from v_expected_pack_version
      or v_active_pack_hash is distinct from v_expected_pack_hash
    ) then
      v_reason := 'pack_preview_stale';
      v_failure_status := 'stale';
    end if;

    -- Lock every already-mapped definition before validating reviewed heads.
    -- This also protects the same-version early-return path: a concurrent manual
    -- edit cannot advance a head after validation and before the response is
    -- projected.
    if v_reason is null then
      perform definition.id
        from jsonb_array_elements(p_plan -> 'entries') as requested(value)
        join public.content_pack_entry_definitions mapping
          on mapping.owner_id = v_uid
         and mapping.pack_id = v_pack_id
         and mapping.pack_entry_id = requested.value ->> 'packEntryId'
        join public.custom_content_definitions definition
          on definition.owner_id = mapping.owner_id
         and definition.id = mapping.definition_id
       order by definition.id
       for update of definition;
    end if;

    -- Pack-entry identity is stable across releases. The reviewed definition id
    -- must describe the mapping the RPC will actually mutate; a new entry must
    -- explicitly carry null rather than smuggling an unrelated definition id.
    if v_reason is null and exists (
      select 1
        from jsonb_array_elements(p_plan -> 'entries') as requested(value)
        left join public.content_pack_entry_definitions mapping
          on mapping.owner_id = v_uid
         and mapping.pack_id = v_pack_id
         and mapping.pack_entry_id = requested.value ->> 'packEntryId'
       where public._content_uuid(
           requested.value ->> 'definitionId'
         ) is distinct from mapping.definition_id
    ) then
      v_reason := 'pack_mapping_definition_changed';
      v_failure_status := 'stale';
    end if;

    -- Even a same-version no-op must not return a head the owner did not review.
    if v_reason is null and exists (
      select 1
        from jsonb_array_elements(p_plan -> 'entries') as requested(value)
        join public.content_pack_entry_definitions mapping
          on mapping.owner_id = v_uid
         and mapping.pack_id = v_pack_id
         and mapping.pack_entry_id = requested.value ->> 'packEntryId'
        join public.custom_content_definitions definition
          on definition.owner_id = mapping.owner_id
         and definition.id = mapping.definition_id
       where public._content_uuid(
           requested.value ->> 'expectedHeadRevisionId'
         ) is distinct from definition.head_revision_id
    ) then
      v_reason := 'definition_head_changed';
      v_failure_status := 'stale';
    end if;

    select version.manifest_hash, version.import_plan_hash
      into v_pack_existing_hash, v_pack_existing_import_hash
      from public.content_pack_versions version
     where version.owner_id = v_uid
       and version.pack_id = v_pack_id
       and version.pack_version = v_pack_version
     for update;
    if v_reason is null and found and (
      v_pack_existing_hash <> v_pack_hash
      or v_pack_existing_import_hash <> v_pack_import_hash
    ) then
      v_reason := 'pack_version_immutable';
    elsif v_reason is null
      and found
      and v_active_pack_version is distinct from v_pack_version
    then
      v_reason := 'pack_version_already_installed';
      v_failure_status := 'stale';
    elsif v_reason is null
      and found
    then
      select count(*)
        into v_pack_entry_count
        from public.content_pack_version_entries entry
       where entry.owner_id = v_uid
         and entry.pack_id = v_pack_id
         and entry.pack_version = v_pack_version;
      -- Only a complete active installation is a no-op. An incomplete version
      -- cannot be manufactured through a separate publication command.
      if v_pack_entry_count = jsonb_array_length(p_plan -> 'entries') then
        select
          coalesce(jsonb_agg(
            public._custom_content_projection(definition, current_revision)
            order by entry.ordinal
          ), '[]'::jsonb),
          coalesce(jsonb_agg(jsonb_build_object(
            'definitionId', entry.definition_id,
            'revisionId', definition.head_revision_id,
            'status', 'unchanged',
            'category', entry.category,
            'packEntryId', entry.pack_entry_id
          ) order by entry.ordinal), '[]'::jsonb)
          into v_items, v_per_entry
          from public.content_pack_version_entries entry
          join public.custom_content_definitions definition
            on definition.owner_id = entry.owner_id
           and definition.id = entry.definition_id
          join public.custom_content_revisions current_revision
            on current_revision.id = definition.head_revision_id
         where entry.owner_id = v_uid
           and entry.pack_id = v_pack_id
           and entry.pack_version = v_pack_version;
        v_result := jsonb_build_object(
          'items', v_items,
          'archivedItems', '[]'::jsonb,
          'pack', v_pack,
          'environment', null,
          'perEntry', v_per_entry
        );
        v_response := jsonb_build_object(
          'ok', true,
          'status', 'applied',
          'commandId', p_command_id,
          'replayed', false,
          'fingerprint', v_fingerprint,
          'result', v_result,
          'perEntry', v_per_entry
        );
        if not public.finalize_application_command(
          v_uid, p_command_id, v_fingerprint, 'applied', v_response, null
        ) then
          raise exception 'custom-content command did not finalize'
            using errcode = '40001';
        end if;
        return v_response;
      else
        v_reason := 'pack_version_incomplete';
      end if;
    end if;
  end if;

  if v_kind = 'content.environment.migrate' then
    -- Different environment commands have different journal ids, so the
    -- application-command claim alone cannot serialize their expected-current
    -- checks. The owner-scoped advisory lock closes the absent-activation-row
    -- race as well as the ordinary update race.
    perform pg_advisory_xact_lock(
      hashtext('custom-content-environment:' || v_uid::text)
    );
    select activation.environment_revision_id
      into v_active_environment_revision_id
      from public.content_environment_activations activation
     where activation.owner_id = v_uid
     for update;
    if coalesce(
      v_active_environment_revision_id,
      'system:vanilla:v1'
    ) <> v_expected_environment_revision_id then
      v_reason := 'content_environment_preview_stale';
      v_failure_status := 'stale';
    end if;

    if v_reason is null and exists (
      select 1
        from jsonb_array_elements(v_environment -> 'packVersions')
          as requested(value)
       where not exists (
         select 1
           from public.content_pack_versions version
          where version.owner_id = v_uid
            and version.pack_id = requested.value ->> 'packId'
            and version.pack_version =
              requested.value ->> 'packVersionId'
            and version.manifest_hash =
              requested.value ->> 'manifestHash'
       )
    ) then
      v_reason := 'content_environment_pack_reference_unavailable';
      v_failure_status := 'stale';
    end if;

    -- A pack binding is semantic input, not decorative provenance. Every entry
    -- published by the exact immutable pack version must be represented by the
    -- same definition/revision/category tuple in the environment's canonical
    -- direct-definition set. A published pack version is never empty; accepting
    -- an empty closure would make its manifest decorative provenance again.
    -- Additional direct definitions remain valid.
    if v_reason is null and exists (
      select 1
        from jsonb_array_elements(v_environment -> 'packVersions')
          as requested_pack(value)
       where not exists (
         select 1
           from public.content_pack_version_entries pack_entry
          where pack_entry.owner_id = v_uid
            and pack_entry.pack_id =
              requested_pack.value ->> 'packId'
            and pack_entry.pack_version =
              requested_pack.value ->> 'packVersionId'
       )
    ) then
      v_reason := 'content_environment_pack_closure_mismatch';
      v_failure_status := 'stale';
    end if;

    if v_reason is null and exists (
      select 1
        from jsonb_array_elements(v_environment -> 'packVersions')
          as requested_pack(value)
        join public.content_pack_version_entries pack_entry
          on pack_entry.owner_id = v_uid
         and pack_entry.pack_id =
           requested_pack.value ->> 'packId'
         and pack_entry.pack_version =
           requested_pack.value ->> 'packVersionId'
       where not exists (
         select 1
           from jsonb_array_elements(
             v_environment -> 'directDefinitions'
           ) as requested_definition(value)
          where public._content_uuid(
              requested_definition.value ->> 'definitionId'
            ) = pack_entry.definition_id
            and public._content_uuid(
              requested_definition.value ->> 'revisionId'
            ) = pack_entry.revision_id
            and requested_definition.value ->> 'category' =
              pack_entry.category
       )
    ) then
      v_reason := 'content_environment_pack_closure_mismatch';
      v_failure_status := 'stale';
    end if;

    if v_reason is null and exists (
      select 1
        from jsonb_array_elements(v_environment -> 'directDefinitions')
          as requested(value)
       where public._content_uuid(
           requested.value ->> 'definitionId'
         ) is null
          or public._content_uuid(
            requested.value ->> 'revisionId'
          ) is null
          or not exists (
            select 1
              from public.custom_content_definitions definition
              join public.custom_content_revisions revision
                on revision.owner_id = definition.owner_id
               and revision.definition_id = definition.id
               and revision.id = public._content_uuid(
                 requested.value ->> 'revisionId'
               )
             where definition.owner_id = v_uid
               and definition.id = public._content_uuid(
                 requested.value ->> 'definitionId'
               )
               and definition.category =
                 requested.value ->> 'category'
               and revision.content_hash =
                 requested.value ->> 'contentHash'
          )
    ) then
      v_reason := 'content_environment_definition_reference_unavailable';
      v_failure_status := 'stale';
    end if;

    select revision.environment_hash
      into v_pack_existing_hash
      from public.content_environment_revisions revision
     where revision.owner_id = v_uid
       and revision.environment_revision_id = v_environment_revision_id
     for update;
    if v_reason is null
      and found
      and v_pack_existing_hash <> v_environment_hash
    then
      v_reason := 'environment_revision_immutable';
    elsif v_reason is null and exists (
      select 1
        from public.content_environment_revisions revision
       where revision.owner_id = v_uid
         and revision.environment_id = v_environment_id
         and revision.revision_no =
           (v_environment ->> 'revisionNumber')::integer
         and revision.environment_revision_id <> v_environment_revision_id
    ) then
      v_reason := 'environment_revision_number_conflict';
    end if;
  end if;

  -- Lock and compare every affected head before appending any revision.
  if v_reason is null and v_kind in (
    'content.definition.create-revision',
    'content.definition.mass-update',
    'content.pack.import'
  ) then
    for v_entry in
      -- Every command acquires multi-definition locks in the same codepoint
      -- order. Response/application order still follows the reviewed array
      -- below, but reversed mass-update previews cannot deadlock each other.
      select item.value
        from jsonb_array_elements(p_plan -> 'entries') as item(value)
       order by case
         when v_kind = 'content.pack.import'
           then item.value ->> 'packEntryId'
         else item.value ->> 'definitionId'
       end collate "C"
    loop
      if v_kind = 'content.pack.import' then
        select mapping.definition_id
          into v_definition_id
          from public.content_pack_entry_definitions mapping
         where mapping.owner_id = v_uid
           and mapping.pack_id = v_pack_id
           and mapping.pack_entry_id = v_entry ->> 'packEntryId'
         for update;
        if v_definition_id is not null then
          -- A release may omit an older entry and a later release may restore
          -- it. Compare against the latest pack-authored revision, not only the
          -- active release, so that omission is not mistaken for lost lineage.
          select version_entry.revision_id
            into v_prior_pack_revision_id
            from public.content_pack_version_entries version_entry
            join public.content_pack_versions version
              on version.owner_id = version_entry.owner_id
             and version.pack_id = version_entry.pack_id
             and version.pack_version = version_entry.pack_version
           where version_entry.owner_id = v_uid
             and version_entry.pack_id = v_pack_id
             and version_entry.pack_entry_id = v_entry ->> 'packEntryId'
           order by version.created_at desc,
                    version.pack_version collate "C" desc
           limit 1;
        else
          v_prior_pack_revision_id := null;
        end if;
      else
        v_definition_id := public._content_uuid(
          v_entry ->> 'definitionId'
        );
        if v_definition_id is null then
          raise exception 'definition id is required for direct revision writes'
            using errcode = '22023';
        end if;
        -- A row lock cannot serialize two concurrent creations of the same
        -- not-yet-existent definition. The stable advisory key closes that gap;
        -- once the first transaction commits, the second observes its new head
        -- and returns the ordinary stale-preview result.
        perform pg_advisory_xact_lock(hashtext(
          'custom-content-definition:'
            || v_uid::text || ':' || v_definition_id::text
        ));
      end if;

      v_existing := false;
      if v_definition_id is not null then
        select *
          into v_definition
          from public.custom_content_definitions definition
         where definition.owner_id = v_uid
           and definition.id = v_definition_id
         for update;
        v_existing := found;
      end if;

      if v_existing
        and v_definition.category is distinct from v_entry ->> 'category'
      then
        v_reason := 'definition_category_immutable';
        exit;
      elsif v_existing
        and v_entry #>> '{data,localUid}' is not null
        and v_definition.local_uid is distinct from
          v_entry #>> '{data,localUid}'
      then
        v_reason := 'definition_local_uid_immutable';
        exit;
      elsif v_existing and v_definition.archived_at is not null then
        v_reason := 'definition_archived';
        exit;
      elsif not v_existing
        and v_entry #>> '{data,localUid}' is not null
        and exists (
          select 1
            from public.custom_content_definitions other_definition
           where other_definition.owner_id = v_uid
             and other_definition.local_uid =
               v_entry #>> '{data,localUid}'
        )
      then
        v_reason := 'local_uid_unavailable';
        v_failure_status := 'stale';
        exit;
      elsif v_kind = 'content.pack.import'
        and v_existing
        and v_prior_pack_revision_id is null
      then
        v_reason := 'pack_mapping_revision_unavailable';
        v_failure_status := 'stale';
        exit;
      elsif v_kind = 'content.pack.import'
        and v_existing
        and public._content_uuid(
          v_entry ->> 'expectedHeadRevisionId'
        ) is null
      then
        v_reason := 'pack_preview_expected_head_required';
        v_failure_status := 'stale';
        exit;
      elsif v_kind = 'content.pack.import'
        and v_existing
        and v_definition.head_revision_id is distinct from
          v_prior_pack_revision_id
      then
        v_reason := 'pack_definition_head_changed';
        v_failure_status := 'stale';
        exit;
      elsif v_kind = 'content.pack.import'
        and v_existing
        and v_definition.head_revision_id is distinct from
          public._content_uuid(v_entry ->> 'expectedHeadRevisionId')
      then
        v_reason := 'definition_head_changed';
        v_failure_status := 'stale';
        exit;
      elsif v_kind <> 'content.pack.import' and v_existing
        and v_definition.head_revision_id is distinct from
          public._content_uuid(v_entry ->> 'expectedHeadRevisionId')
      then
        v_reason := 'definition_head_changed';
        v_failure_status := 'stale';
        exit;
      elsif v_kind <> 'content.pack.import' and not v_existing
        and v_entry ->> 'expectedHeadRevisionId' is not null
      then
        v_reason := 'definition_unavailable';
        v_failure_status := 'stale';
        exit;
      end if;
    end loop;
  end if;

  if v_reason is null and v_kind in (
    'content.definition.archive',
    'content.definition.restore'
  ) then
    select *
      into v_definition
      from public.custom_content_definitions definition
     where definition.owner_id = v_uid
       and definition.id = v_definition_id
     for update;
    if not found then
      v_reason := 'definition_unavailable';
      v_failure_status := 'stale';
    elsif v_definition.head_revision_id is distinct from v_expected_revision_id
    then
      v_reason := 'definition_head_changed';
      v_failure_status := 'stale';
    end if;
  end if;

  if v_reason is not null then
    v_result := jsonb_build_object(
      'items', '[]'::jsonb,
      'archivedItems', '[]'::jsonb,
      'pack', v_pack,
      'environment', v_environment,
      'perEntry', '[]'::jsonb
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
      raise exception 'custom-content command did not finalize'
        using errcode = '40001';
    end if;
    return v_response;
  end if;

  if v_kind = 'content.pack.import' then
    insert into public.content_packs (
      owner_id, pack_id, name, updated_at
    ) values (
      v_uid, v_pack_id, v_pack ->> 'name', v_now
    )
    on conflict (owner_id, pack_id) do update
      set name = excluded.name,
          updated_at = excluded.updated_at;
    insert into public.content_pack_versions (
      owner_id, pack_id, pack_version, manifest_hash, import_plan_hash,
      manifest, command_id, created_at
    ) values (
      v_uid, v_pack_id, v_pack_version, v_pack_hash, v_pack_import_hash,
      v_pack_manifest,
      p_command_id, v_now
    )
    on conflict (owner_id, pack_id, pack_version) do nothing;
  end if;

  if v_kind in (
    'content.definition.create-revision',
    'content.definition.mass-update',
    'content.pack.import'
  ) then
    for v_entry, v_ordinal in
      select value, (ordinal - 1)::integer
        from jsonb_array_elements(p_plan -> 'entries')
          with ordinality as item(value, ordinal)
    loop
      v_definition_id := null;
      if v_kind = 'content.pack.import' then
        select mapping.definition_id
          into v_definition_id
          from public.content_pack_entry_definitions mapping
         where mapping.owner_id = v_uid
           and mapping.pack_id = v_pack_id
           and mapping.pack_entry_id = v_entry ->> 'packEntryId'
         for update;
      else
        v_definition_id := public._content_uuid(
          v_entry ->> 'definitionId'
        );
      end if;

      v_existing := false;
      if v_definition_id is not null then
        select *
          into v_definition
          from public.custom_content_definitions definition
         where definition.owner_id = v_uid
           and definition.id = v_definition_id
         for update;
        v_existing := found;
      end if;

      if not v_existing then
        v_definition_id := coalesce(v_definition_id, gen_random_uuid());
        v_local_uid := coalesce(
          nullif(v_entry #>> '{data,localUid}', ''),
          'lu_' || replace(gen_random_uuid()::text, '-', '')
        );
        insert into public.custom_content_definitions (
          id, owner_id, category, local_uid, created_at, updated_at
        ) values (
          v_definition_id, v_uid, v_entry ->> 'category',
          v_local_uid, v_now, v_now
        );
        select *
          into strict v_definition
          from public.custom_content_definitions definition
         where definition.owner_id = v_uid
           and definition.id = v_definition_id;
        if v_kind = 'content.pack.import' then
          insert into public.content_pack_entry_definitions (
            owner_id, pack_id, pack_entry_id, definition_id, created_at
          ) values (
            v_uid, v_pack_id, v_entry ->> 'packEntryId',
            v_definition_id, v_now
          );
        end if;
      else
        v_local_uid := v_definition.local_uid;
      end if;

      v_data := jsonb_set(
        v_entry -> 'data',
        '{localUid}',
        to_jsonb(v_local_uid),
        true
      );
      v_content_hash := public._content_sha256(jsonb_build_object(
        'schemaVersion', 1,
        'category', v_entry ->> 'category',
        'data', v_data
      ));

      if v_definition.head_revision_id is not null then
        select *
          into strict v_revision
          from public.custom_content_revisions revision
         where revision.id = v_definition.head_revision_id;
      else
        v_revision.id := null;
      end if;

      if v_revision.id is not null
        and v_revision.content_hash = v_content_hash
      then
        v_revision_id := v_revision.id;
        v_revision_no := v_revision.revision_no;
        v_per_entry := v_per_entry || jsonb_build_array(
          jsonb_build_object(
            'definitionId', v_definition_id,
            'revisionId', v_revision_id,
            'status', 'unchanged',
            'category', v_entry ->> 'category',
            'packEntryId', v_entry ->> 'packEntryId'
          )
        );
      else
        v_parent_revision_id := v_definition.head_revision_id;
        v_revision_no := coalesce(v_revision.revision_no, 0) + 1;
        v_revision_id := gen_random_uuid();
        insert into public.custom_content_revisions (
          id, owner_id, definition_id, revision_no,
          parent_revision_id, schema_version, content_hash,
          data, command_id, created_at
        ) values (
          v_revision_id, v_uid, v_definition_id, v_revision_no,
          v_parent_revision_id, 1, v_content_hash,
          v_data, p_command_id, v_now
        );
        update public.custom_content_definitions
           set head_revision_id = v_revision_id,
               updated_at = v_now
         where owner_id = v_uid
           and id = v_definition_id;
        select *
          into strict v_definition
          from public.custom_content_definitions definition
         where definition.owner_id = v_uid
           and definition.id = v_definition_id;
        select *
          into strict v_revision
          from public.custom_content_revisions revision
         where revision.id = v_revision_id;
        v_per_entry := v_per_entry || jsonb_build_array(
          jsonb_build_object(
            'definitionId', v_definition_id,
            'revisionId', v_revision_id,
            'status', case when v_parent_revision_id is null
              then 'created' else 'updated' end,
            'category', v_entry ->> 'category',
            'packEntryId', v_entry ->> 'packEntryId'
          )
        );
      end if;

      v_items := v_items || jsonb_build_array(
        public._custom_content_projection(v_definition, v_revision)
      );
      if v_kind = 'content.pack.import' then
        insert into public.content_pack_version_entries (
          owner_id, pack_id, pack_version, pack_entry_id,
          definition_id, revision_id, category, ordinal
        ) values (
          v_uid, v_pack_id, v_pack_version, v_entry ->> 'packEntryId',
          v_definition_id, v_revision_id, v_entry ->> 'category', v_ordinal
        );
      end if;
    end loop;
  elsif v_kind in (
    'content.definition.archive',
    'content.definition.restore'
  ) then
    update public.custom_content_definitions
       set archived_at = case
             when v_kind = 'content.definition.archive'
               then coalesce(archived_at, v_now)
             else null
           end,
           updated_at = v_now
     where owner_id = v_uid
       and id = v_definition_id
     returning * into strict v_definition;
    select *
      into strict v_revision
      from public.custom_content_revisions revision
     where revision.id = v_definition.head_revision_id;
    if v_kind = 'content.definition.archive' then
      v_archived_items := jsonb_build_array(
        public._custom_content_projection(v_definition, v_revision)
      );
    else
      v_items := jsonb_build_array(
        public._custom_content_projection(v_definition, v_revision)
      );
    end if;
    v_per_entry := jsonb_build_array(jsonb_build_object(
      'definitionId', v_definition.id,
      'revisionId', v_revision.id,
      'status', case when v_kind = 'content.definition.archive'
        then 'archived' else 'restored' end,
      'category', v_definition.category,
      'packEntryId', null
    ));
  elsif v_kind = 'content.environment.migrate' then
    insert into public.content_environments (
      owner_id, environment_id, created_at, updated_at
    ) values (
      v_uid, v_environment_id, v_now, v_now
    )
    on conflict (owner_id, environment_id) do update
      set updated_at = excluded.updated_at;
    insert into public.content_environment_revisions (
      owner_id, environment_id, environment_revision_id,
      revision_no, environment_hash, revision, command_id, created_at
    ) values (
      v_uid, v_environment_id, v_environment_revision_id,
      (v_environment ->> 'revisionNumber')::integer,
      v_environment_hash, v_environment, p_command_id, v_now
    )
    on conflict (owner_id, environment_revision_id) do nothing;
    insert into public.content_environment_activations (
      owner_id, environment_revision_id, activated_at
    ) values (
      v_uid, v_environment_revision_id, v_now
    )
    on conflict (owner_id) do update
      set environment_revision_id = excluded.environment_revision_id,
          activated_at = excluded.activated_at;
  end if;

  if v_kind = 'content.pack.import' then
    update public.content_packs
       set active_pack_version = v_pack_version,
           active_manifest_hash = v_pack_hash,
           updated_at = v_now
     where owner_id = v_uid
       and pack_id = v_pack_id;
  end if;

  v_result := jsonb_build_object(
    'items', v_items,
    'archivedItems', v_archived_items,
    'pack', v_pack,
    'environment', v_environment,
    'perEntry', v_per_entry
  );
  v_response := jsonb_build_object(
    'ok', true,
    'status', 'applied',
    'commandId', p_command_id,
    'reason', null,
    'replayed', false,
    'fingerprint', v_fingerprint,
    'result', v_result,
    'perEntry', v_per_entry
  );
  if not public.finalize_application_command(
    v_uid, p_command_id, v_fingerprint, 'applied', v_response, null
  ) then
    raise exception 'custom-content command did not finalize'
      using errcode = '40001';
  end if;
  return v_response;
end;
$$;

revoke all on function public._content_canonical_json(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public._content_sha256(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public._custom_content_record_valid(text, jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public._content_pack_manifest_valid(
  jsonb, text, text, text
) from public, anon, authenticated, service_role;
revoke all on function public._content_pack_import_data(jsonb, text)
  from public, anon, authenticated, service_role;
revoke all on function public._custom_content_head_valid()
  from public, anon, authenticated, service_role;
revoke all on function public._content_pack_active_valid()
  from public, anon, authenticated, service_role;
revoke all on function public._content_environment_valid(jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public._custom_content_projection(
  public.custom_content_definitions,
  public.custom_content_revisions
) from public, anon, authenticated, service_role;
revoke all on function public._content_uuid(text)
  from public, anon, authenticated, service_role;
revoke all on function public.apply_custom_content_command(
  uuid, text, text, jsonb
) from public, anon;
grant execute on function public.apply_custom_content_command(
  uuid, text, text, jsonb
) to authenticated, service_role;

comment on function public.apply_custom_content_command(
  uuid, text, text, jsonb
) is
  'Owner/premium-gated transactional custom-content command authority: canonical preview verification, durable idempotency, expected-head CAS, append-only revisions, archive/restore, immutable pack versions, and environment activation.';
