-- ════════════════════════════════════════════════════════════════════════════
-- 211 — the server-side share veil: every public read of a town's dossier is served
--       already veiled, and sends nothing of the veil but what the page draws itself
-- ════════════════════════════════════════════════════════════════════════════
-- WRITTEN-NOT-DEPLOYED (standing law; applies via `supabase db push` at the deploy step, never
-- from a lane; the applied-head bump is the owner's, in that same act). COHERENCE-VEIL phase 2,
-- the chair's rulings of 2026-11-12 on docs/chair/2026-11-11/COHERENCE-VEIL-PHASE1-PROPOSAL.md.
--
-- THE CAUSE (measured by execution at 210, the proposal's section (a)): the veil a DM sets by hand
-- (gallery_member_overrides.$veil, written by the share panel) was applied only in the reader's
-- browser (src/domain/display/galleryVeil.js). The gallery read and the party link sent everything
-- it hides (14,749 strings on 24 towns with every eye shut, 417 with the default veil); the gallery
-- read also sent the frozen copy verbatim (never sanitised) beside the live row; and the map page
-- (get_gallery_map) and import (import_gallery_dossier) applied no veil at all, on either side.
--
-- THE CHANGE.
--   (1) _gallery_veil(pub, overrides, link): the SQL twin of galleryVeil.js's resolver and applier
--       (defaultVeilFor, readShareVeil, resolveVeil, applyVeil with VEILED_PUBLIC_PROSE), over the
--       projection the client veiled (the sanitised or DM-full JSON after the member splice). It
--       returns {body, groupings}, or NULL for an UNMARKED share read as a listing (served exactly
--       as before: the owner's open question on pre-veil pages stays where it is). On the party link
--       an unmarked share takes the default veil (the client's R4). Helpers named _gallery_veil_*.
--       The house predicate is declarative (cardVeil.js isHideableHouse: the inference tables hold no
--       row for the clandestine kinds). An anonymous legacy event (no id, name, title or label; the
--       client hashes it) is read FAIL-CLOSED: every eye addressed to any legacy event applies to it.
--   (2) get_gallery_dossier (147): the share's veil applied to `data`; in snapshot mode `data` is the
--       FROZEN COPY run through the same sanitiser or DM-full strip, member splice and veil, and the
--       live row is not sent (the chair's ruling 5): a copy frozen by an older client is cleaned at
--       read, with no re-export.
--   (3) get_unlisted_dossier (208 as amended): the veil applied to `dossier`; the lateral holds
--       `offset 0`, so the sanitiser runs once (the VEIL-FIX review's low finding 1).
--   (4) get_gallery_map (088): each member's dossier through its own listing's veil (ruling 1).
--   (5) import_gallery_dossier (131): the importer's copy through the listing's veil (ruling 2).
--   (6) On both dossier reads gallery_member_overrides is rebuilt from an ALLOWLIST
--       (_gallery_veil_served; low finding 2, the fail-closed form): each member's boolean revealDm /
--       allowImport, and when a veil was applied the served marker {v: 2, mode, at, groupings}. No
--       delta (a hand-hidden house's id), no frozen copy, no unknown key; a `$veil` that is not an
--       object never raises. The client reads v 2 as "applied": it re-applies only the groupings
--       (removal, idempotent) and marks them for DefenseTab; it never re-applies the default rules.
--       No client path writes v 2 back: the only writer, updateGalleryMetadata, clamps to v 1.
--
-- NOT CHANGED: _gallery_sanitize_public_json, _gallery_dm_full_json, _gallery_apply_member_overrides,
-- the other four party-link functions, every grant (restated as they stood). No table, column,
-- constraint, policy or row. Every invisible character is spelled as an escape (low finding 4).
--
-- COUPLED CLIENT TWIN: src/domain/display/galleryVeil.js (projectServedVeil, VEIL_LIMITS.servedVersion)
-- and src/lib/gallery.js (sanitizeDossier). PINNED BY EXECUTION: tests/security/galleryServerVeil.pglite.test.js
-- (the real SQL against the real client page: nothing carried, no page changed, 210 as the red control).
--
-- @rollback: supabase/rollback/211_server_side_share_veil.down.sql, run FIRST, before 210, 207, 206,
--   205 and 208's set: it recreates get_gallery_dossier at 147's body, get_unlisted_dossier at 208's
--   (as amended), import_gallery_dossier at 131's and get_gallery_map at 088's, then drops every
--   _gallery_veil* function by signature. No row is written or lost either way; the new client draws a
--   v 1 share as before, so no client rollback goes with it. Rehearsed by
--   tests/security/galleryVeilCures.pglite.test.js (001..211 then the file equals a chain at 210).

-- ── 1. THE VEIL'S CONSTANTS (galleryVeil.js CARD_KINDS, GROUPING_REMOVERS, VEILED_PUBLIC_PROSE) ──
-- Character-identical to the client's tables; tests/security/galleryServerVeil.pglite.test.js
-- reads this function and the client's exports and compares them field for field.
create or replace function public._gallery_veil_kinds()
returns jsonb language sql immutable as $$
  select '{
    "npc": {
      "lists": [["npcs"], ["powerStructure", "factions", "*", "members"], ["factions", "*", "members"]],
      "floor": ["id", "name", "role", "title", "category", "gender", "presentation", "memberships", "influence"],
      "fields": {
        "personality": ["personality"], "physical": ["physical"], "goals": ["goal", "goals"],
        "constraint": ["activeConstraint"], "whereabouts": ["whereabouts", "location", "currentLocation"],
        "secret": ["secret"], "ties": ["relationships", "institution", "linkedInstitutionIds"],
        "hooks": ["plotHooks"], "corruption": ["allegiance", "corrupt", "corruptionVector", "corruptTies"]
      }
    },
    "institution": {
      "lists": [["institutions"]],
      "floor": ["id", "name", "category", "priorityCategory", "catalogId", "tier"],
      "fields": {
        "description": ["desc", "description"], "function": ["tags", "facets", "serviceKeys"],
        "services": [], "people": []
      }
    },
    "faction": {
      "lists": [["powerStructure", "factions"], ["factions"]],
      "floor": ["id", "faction", "name", "category", "power", "rawPower", "powerLabel", "isGoverning"],
      "fields": {
        "description": ["desc", "description", "crisisNote"], "goals": ["goals", "goal", "agenda"],
        "conflicts": ["conflicts"], "members": ["members"], "capture": ["captureState"]
      }
    },
    "event": {
      "lists": [["history", "historicalEvents"], ["history", "eventsTimeline"]],
      "floor": ["id", "name", "title", "type", "templateType", "yearsAgo", "year", "era", "severity"],
      "fields": { "description": ["description", "desc"], "lastingEffects": ["lastingEffects"], "hooks": ["plotHooks"] }
    },
    "tension": {
      "lists": [["history", "currentTensions"]],
      "floor": ["id", "name", "title", "type", "factions", "severity"],
      "fields": { "description": ["description", "desc"], "lastingEffects": ["lastingEffects"], "hooks": ["plotHooks"] }
    },
    "conflict": {
      "lists": [["conflicts"], ["powerStructure", "conflicts"]],
      "floor": ["id", "parties", "issue", "intensity"],
      "fields": { "stakes": ["stakes"], "description": ["desc", "description"], "hooks": ["plotHooks"] }
    },
    "relationship": {
      "lists": [["relationships"]],
      "floor": ["id", "type", "typeName", "strength", "from", "to", "npc1Name", "npc2Name", "npc1Role", "npc2Role"],
      "fields": { "tension": ["tension"], "description": ["description"], "hooks": ["plotHooks"] }
    }
  }'::jsonb
$$;

-- The card kinds in the client's iteration order (Object.keys(CARD_KINDS)).
create or replace function public._gallery_veil_kind_order()
returns text[] language sql immutable as $$
  select array['npc', 'institution', 'faction', 'event', 'tension', 'conflict', 'relationship']
$$;

-- The hideable groupings (GROUPING_REMOVERS' keys), the twelve static defaults in the client's order.
create or replace function public._gallery_veil_groupings()
returns text[] language sql immutable as $$
  select array['tab:plot_hooks', 'block:services.criminal', 'block:defense.criminalStructure',
    'block:power.criminalUnderside', 'block:defense.vulnerabilities', 'block:rumors.dmTruth',
    'block:war.truthVsBelief', 'block:housekeeping.structuralIssues', 'block:housekeeping.coherenceNotes',
    'block:housekeeping.firstSurvey', 'block:housekeeping.receipt', 'block:housekeeping.decrees']
$$;

-- THE FROZEN COPY'S BOUND (the review's F1). The client keeps a copy whose JSON.stringify length is
-- at most VEIL_LIMITS.snapshotMaxChars (1,000,000); the server measures jsonb::text, which is longer,
-- so the server's bound must admit every copy the client's admits, whatever its shape. The worst
-- ratio, derived token by token: jsonb::text adds one space after each ':' and ',' (ratio 2 on that
-- character); it spells strings, escapes, literals and brackets no longer than JSON.stringify (a code
-- point is never more UTF-16 units than one); it prints a number in plain notation, and the worst
-- token is the smallest subnormal, 6 characters in JS (5e-324) and 326 here. So the server's length is
-- at most 326/6 of the client's, and the bound is floor(1,000,000 x 326 / 6). A copy past it is
-- refused by the read (tests/security/galleryVeilCures.pglite.test.js executes the tokens).
create or replace function public._gallery_veil_copy_bound()
returns bigint language sql immutable as $$
  select 54333333::bigint
$$;

-- ── 2. THE CLIENT'S SMALL READERS, one SQL function each ─────────────────────────────────────
-- str(v): the string, else ''.
create or replace function public._gallery_veil_str(j jsonb)
returns text language sql immutable as $$
  select case when jsonb_typeof(j) = 'string' then j #>> '{}' else '' end
$$;

-- THE DOUBLE A JSON NUMBER IS (the review's F3). jsonb keeps any decimal; JavaScript reads the
-- nearest double, rounding half to even: zero at or below 2^-1075, Infinity at or past 2^1024 - 2^970.
-- Both are decided by exact numeric comparison against a constant, so no cast is ever asked of an
-- out-of-range value and no arithmetic can leave numeric's own range (the second review's R3).
create or replace function public._gallery_veil_num_zero(x numeric)
returns boolean language sql immutable as $$
  -- 2^-1075, exactly (5^1075 x 10^-1075). A COMPARISON, never a product: numeric holds up to 131,072
  -- digits before the point, and abs(x) x 2^1075 left that range from about 2.5e130748 (the second
  -- review's R3: every read of such a row raised where 210 served it)
  select abs(x) <= 0.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024703282292062327208828439643411068618252990130716238221279284125033775363510437593264991818081799618989828234772285886546332835517796989819938739800539093906315035659515570226392290858392449105184435931802849936536152500319370457678249219365623669863658480757001585769269903706311928279558551332927834338409351978015531246597263579574622766465272827220056374006485499977096599470454020828166226237857393450736339007967761930577506740176324673600968951340535537458516661134223766678604162159680461914467291840300530057530849048765391711386591646239524912623653881879636239373280423891018672348497668235089863388587925628302755995657524455507255189313690836254779186948667994968324049705821028513185451396213837722826145437693412532098591327667236328125
$$;
create or replace function public._gallery_veil_num_inf(x numeric)
returns boolean language sql immutable as $$
  -- 2^1024 - 2^970
  select abs(x) >= 179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497792
$$;

-- JS truthiness of a JSON value (absent, null, false, '' and 0 are falsy; a number JS reads as zero is 0).
create or replace function public._gallery_veil_truthy(j jsonb)
returns boolean language sql immutable as $$
  select case jsonb_typeof(j)
    when 'string' then (j #>> '{}') <> ''
    when 'number' then not public._gallery_veil_num_zero((j #>> '{}')::numeric)
    when 'boolean' then (j #>> '{}')::boolean
    when 'object' then true
    when 'array' then true
    else false end
$$;

-- String(n) of a JSON number, exactly as JavaScript spells the double it reads (the review's F2 (b)).
-- ECMAScript Number::toString: the fewest digits s (k of them) such that s x 10^(n-k) reads back as
-- the same double; of two, the closer to the double's exact value; of a tie, the even. The double is
-- PostgreSQL's correctly rounded reading of the decimal (float8 input), taken apart by its bits
-- (float8send), so its exact value and its rounding interval are numeric, and nothing depends on the
-- float8 OUTPUT (whose shortest form refuses an exact half-way bound) or on a setting. Plain from 1e-6
-- up to 1e21, exponential outside it. Zero and the infinities come from the exact range tests first, so
-- no cast is asked of an out-of-range value (F3). An integer of at most 15 digits is that integer.
create or replace function public._gallery_veil_numstr(t text)
returns text language plpgsql immutable as $$
declare
  x numeric;
  b bytea;
  ex int;
  mant numeric;
  e2 int;
  v numeric;      -- the double's exact value, positive
  half numeric;   -- half the spacing above it
  halflo numeric; -- half the spacing below it
  lo numeric;
  hi numeric;
  inclusive boolean;
  e10 int;
  p int;
  m int;
  s numeric;
  c1 numeric;
  c2 numeric;
  ok1 boolean;
  ok2 boolean;
  digits text;
  k int;
  n int;
  tz int;
  out text;
begin
  if t ~ '^-?[0-9]{1,15}$' then return t; end if;
  x := t::numeric;
  if public._gallery_veil_num_zero(x) then return '0'; end if;
  if public._gallery_veil_num_inf(x) then return case when x < 0 then '-Infinity' else 'Infinity' end; end if;
  b := float8send(abs(x)::float8);
  ex := ((get_byte(b, 0) & 127) << 4) | (get_byte(b, 1) >> 4);
  mant := (get_byte(b, 1) & 15)::numeric * 281474976710656 + get_byte(b, 2)::numeric * 1099511627776
    + get_byte(b, 3)::numeric * 4294967296 + get_byte(b, 4)::numeric * 16777216
    + get_byte(b, 5)::numeric * 65536 + get_byte(b, 6)::numeric * 256 + get_byte(b, 7)::numeric;
  if ex = 0 then e2 := -1074; else mant := mant + 4503599627370496; e2 := ex - 1075; end if;
  -- exact powers of two as numeric: 2^e for e >= 0, and 2^-e = 5^e / 10^e spelled as a decimal
  if e2 >= 0 then
    v := mant * power(2::numeric, e2);
    half := power(2::numeric, e2) / 2;
  else
    v := (mant * power(5::numeric, -e2)) * ('1e' || e2)::numeric;
    half := power(5::numeric, 1 - e2) * ('1e' || (e2 - 1))::numeric;
  end if;
  halflo := case when mant = 4503599627370496 and ex > 1 then half / 2 else half end;
  inclusive := mod(mant, 2) = 0;
  lo := v - halflo;
  hi := v + half;
  e10 := floor(log(v))::int;
  if power(10::numeric, e10 + 1) <= v then e10 := e10 + 1; end if;
  if power(10::numeric, e10) > v then e10 := e10 - 1; end if;
  for p in 1..17 loop
    m := e10 - p + 1;
    s := trunc(v * ('1e' || (-m))::numeric);
    c1 := s * ('1e' || m)::numeric;
    c2 := (s + 1) * ('1e' || m)::numeric;
    ok1 := case when inclusive then c1 >= lo else c1 > lo end;
    ok2 := case when inclusive then c2 <= hi else c2 < hi end;
    if ok1 or ok2 then
      if ok1 and ok2 then
        if v - c1 > c2 - v or (v - c1 = c2 - v and mod(s, 2) = 1) then s := s + 1; end if;
      elsif ok2 then s := s + 1;
      end if;
      exit;
    end if;
  end loop;
  digits := s::text;
  tz := length(digits) - length(rtrim(digits, '0'));
  digits := rtrim(digits, '0');
  k := length(digits);
  n := k + m + tz;
  if k <= n and n <= 21 then out := digits || repeat('0', n - k);
  elsif 0 < n and n <= 21 then out := left(digits, n) || '.' || substr(digits, n + 1);
  elsif -6 < n and n <= 0 then out := '0.' || repeat('0', -n) || digits;
  else out := left(digits, 1) || case when k > 1 then '.' || substr(digits, 2) else '' end
    || 'e' || case when n - 1 < 0 then '-' else '+' end || abs(n - 1)::text;
  end if;
  return case when x < 0 then '-' else '' end || out;
end $$;

-- Array.prototype.join(sep): a null element reads '', every other String(element); String() of an
-- element that is itself an array is ITS elements joined by ',', at any depth, so it is that array's
-- leaves in document order joined by ',' (an empty array is one empty leaf, an object reads
-- '[object Object]'). Walked WITHOUT a nested call and in memory linear in the array (the second
-- review's R4 class: the earlier form called _gallery_veil_jsstr, which called this, once per level,
-- and an id 1,000 arrays deep exhausted the stack where 210 served it): a flat array (every array a
-- generated town holds) is the one query it always was; a nested one is read from its own text, one
-- token at a time (a string token is "..." with only escapes inside; jsonb prints nothing else
-- between tokens but spaces). (plpgsql: _gallery_veil_jsstr calls this, and a SQL body is checked
-- against what exists when it is made.)
create or replace function public._gallery_veil_join(j jsonb, sep text)
returns text language plpgsql immutable as $$
begin
  if jsonb_typeof(j) is distinct from 'array' then return ''; end if;
  if not exists (select 1 from jsonb_array_elements(j) x(e) where jsonb_typeof(e) = 'array') then
    return coalesce((select string_agg(case when jsonb_typeof(e) = 'null' then '' else public._gallery_veil_jsstr(e) end, sep order by o)
                       from jsonb_array_elements(j) with ordinality x(e, o)), '');
  end if;
  return (
  with t as (
    select o as i, m[1] as tok
      from regexp_matches(j::text, '"(?:[^"\\]|\\.)*"|[\[\]{}:,]|[^\[\]{}:,"[:space:]]+', 'g') with ordinality r(m, o)
  ),
  d as (
    select i, tok, lead(tok) over w1 as nxt,
           coalesce(sum(case when tok in ('[', '{') then 1 when tok in (']', '}') then -1 else 0 end) over w0, 0) as dep,
           coalesce(sum(case when tok = '{' then 1 when tok = '}' then -1 else 0 end) over w0, 0) as brace
      from t
    window w0 as (order by i rows between unbounded preceding and 1 preceding), w1 as (order by i)
  ),
  l as (
    -- the top element a token belongs to: the top level's commas before it (outside every object)
    select i, tok, nxt, brace,
           coalesce(sum(case when tok = ',' and dep = 1 and brace = 0 then 1 else 0 end)
             over (order by i rows between unbounded preceding and 1 preceding), 0) as top
      from d
  )
  select coalesce(string_agg(s, sep order by top), '')
    from (select top, string_agg(case when tok = '{' then '[object Object]' when tok = '[' or tok = 'null' then ''
                                      else public._gallery_veil_jsstr(tok::jsonb) end, ',' order by i) as s
            from l
           where brace = 0 and (tok = '{' or (tok = '[' and nxt = ']') or tok not in ('[', ']', '{', '}', ',', ':'))
           group by top) q);
end $$;

-- String(v) of a JSON value (Array.prototype.join for arrays: null elements read '').
create or replace function public._gallery_veil_jsstr(j jsonb)
returns text language sql immutable as $$
  select case jsonb_typeof(j)
    when 'string' then j #>> '{}'
    when 'number' then public._gallery_veil_numstr(j #>> '{}')
    when 'boolean' then j #>> '{}'
    when 'object' then '[object Object]'
    when 'array' then public._gallery_veil_join(j, ',')
    when 'null' then 'null'
    else '' end
$$;


-- The first truthy of up to three values (a || b || c), as JSON.
create or replace function public._gallery_veil_or(a jsonb, b jsonb, c jsonb default null)
returns jsonb language sql immutable as $$
  select case when public._gallery_veil_truthy(a) then a when public._gallery_veil_truthy(b) then b else c end
$$;

-- ASCII-only lower case. Every other character the slug keeps is ASCII, and the two characters whose
-- JS lower case IS ASCII (U+0130 and U+212A) are spelled out before it (computed over all code points).
create or replace function public._gallery_veil_lower(v text)
returns text language sql immutable as $$
  select translate(replace(replace(v, U&'\0130', U&'i\0307'), U&'\212A', 'k'),
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')
$$;

-- slugifyEntity (kernel/slugify.js with sep '-', max 80, fallback and empty 'unknown').
create or replace function public._gallery_veil_slug(v text)
returns text language sql immutable as $$
  select coalesce(nullif(left(regexp_replace(regexp_replace(
    public._gallery_veil_lower(coalesce(nullif(v, ''), 'unknown')), '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'), 80), ''), 'unknown')
$$;

-- factionIdFromName's snakeCase (non-alphanumeric runs to '_', trimmed, lower-cased).
create or replace function public._gallery_veil_snake(v text)
returns text language sql immutable as $$
  select lower(regexp_replace(regexp_replace(coalesce(v, ''), '[^a-zA-Z0-9]+', '_', 'g'), '^_+|_+$', '', 'g'))
$$;

-- ownIdOr(card, prefix, ...parts): the card's own string id, else prefix.slug(parts joined by '-').
create or replace function public._gallery_veil_own_id(c jsonb, prefix text, parts jsonb)
returns text language plpgsql immutable as $$
begin
  return (
  select coalesce(nullif(public._gallery_veil_str(c -> 'id'), ''),
      prefix || '.' || public._gallery_veil_slug(coalesce((
        select string_agg(t, '-' order by o) from (
          select o, case when jsonb_typeof(p) = 'array'
            then public._gallery_veil_join(p, '-')
            else public._gallery_veil_str(p) end as t
          from jsonb_array_elements(parts) with ordinality x(p, o)) q
        where t <> ''), ''))));
end $$;

-- galleryMemberKey (publicSafe.js), the npc's veil id and member key, as the client spells it:
-- String(id) when id is neither null nor absent and spells something, else npc.<snake(String(name || ''))>.
-- (092's _gallery_npc_key reads `->> 'id'`, which spells a number, an array or an object as jsonb does;
-- it keeps its one caller, the 093 splice, unchanged.)
create or replace function public._gallery_veil_npc_id(c jsonb)
returns text language sql immutable as $$
  select coalesce(nullif(case when coalesce(jsonb_typeof(c -> 'id'), 'null') <> 'null' then public._gallery_veil_jsstr(c -> 'id') end, ''),
    'npc.' || public._gallery_veil_lower(trim(both '_' from regexp_replace(
      case when public._gallery_veil_truthy(c -> 'name') then public._gallery_veil_jsstr(c -> 'name') else '' end, '[^a-zA-Z0-9]+', '_', 'g'))))
$$;

-- The id the veil addresses a card by (CARD_KINDS[kind].idOf). NULL only for an anonymous legacy
-- event (no string id, no name, title or label): the client hashes it, and the server reads it
-- FAIL-CLOSED (every eye addressed to any legacy event applies to it; see _gallery_veil_card).
-- entityIdFor('institution'): String(id || refId || slugifyEntity(name || label || 'institution')).
create or replace function public._gallery_veil_inst_id(c jsonb)
returns text language sql immutable as $$
  select case
          when public._gallery_veil_truthy(c -> 'id') then public._gallery_veil_jsstr(c -> 'id')
      when public._gallery_veil_truthy(c -> 'refId') then public._gallery_veil_jsstr(c -> 'refId')
      when public._gallery_veil_truthy(c -> 'name') then public._gallery_veil_slug(public._gallery_veil_jsstr(c -> 'name'))
      when public._gallery_veil_truthy(c -> 'label') then public._gallery_veil_slug(public._gallery_veil_jsstr(c -> 'label'))
      else 'institution' end
$$;

create or replace function public._gallery_veil_card_id(kind text, c jsonb)
returns text language plpgsql immutable as $$
begin
  if kind = 'npc' then return public._gallery_veil_npc_id(c); end if;
  if kind = 'institution' then return public._gallery_veil_inst_id(c); end if;
  if kind = 'faction' then return case
      when public._gallery_veil_str(c -> 'faction') <> '' then 'faction.' || public._gallery_veil_snake(public._gallery_veil_str(c -> 'faction'))
      when public._gallery_veil_str(c -> 'name') <> '' then 'faction.' || public._gallery_veil_snake(public._gallery_veil_str(c -> 'name'))
      else public._gallery_veil_own_id(c, 'faction', jsonb_build_array(c -> 'name')) end;
  end if;
  -- eventIdFor: a string id, else the first TRUTHY of name, title and label (a falsy label is no
  -- name: the review's F2 (a)), else NULL (an anonymous legacy event, read fail-closed)
  if kind = 'event' then return case
      when public._gallery_veil_str(c -> 'id') <> '' then c ->> 'id'
      when public._gallery_veil_truthy(c -> 'name') then 'event.' || public._gallery_veil_slug(public._gallery_veil_jsstr(c -> 'name'))
      when public._gallery_veil_truthy(c -> 'title') then 'event.' || public._gallery_veil_slug(public._gallery_veil_jsstr(c -> 'title'))
      when public._gallery_veil_truthy(c -> 'label') then 'event.' || public._gallery_veil_slug(public._gallery_veil_jsstr(c -> 'label'))
      end;
  end if;
  if kind = 'tension' then return public._gallery_veil_own_id(c, 'tension', jsonb_build_array(public._gallery_veil_or(c -> 'name', c -> 'title', c -> 'type'))); end if;
  if kind = 'conflict' then return public._gallery_veil_own_id(c, 'conflict', jsonb_build_array(c -> 'parties', c -> 'issue')); end if;
  if kind = 'relationship' then return public._gallery_veil_own_id(c, 'relationship', jsonb_build_array(
      public._gallery_veil_or(c -> 'from', c -> 'npc1Name'), public._gallery_veil_or(c -> 'to', c -> 'npc2Name'), c -> 'type')); end if;
  return null;
end $$;

-- declaredFacet (cohesionWeave.js): a facets{} string value, else the first `facet:<kind>:<value>` tag.
create or replace function public._gallery_veil_facet(e jsonb, k text)
returns text language plpgsql immutable as $$
begin
  return (
  select coalesce(
      case when jsonb_typeof(e -> 'facets') = 'object' and jsonb_typeof(e -> 'facets' -> k) = 'string'
           and (e -> 'facets' ->> k) <> '' then e -> 'facets' ->> k end,
      (select substr(t #>> '{}', length('facet:' || k || ':') + 1)
         from jsonb_array_elements(case when jsonb_typeof(e -> 'tags') = 'array' then e -> 'tags' else '[]' end) with ordinality x(t, o)
        where jsonb_typeof(t) = 'string' and left(t #>> '{}', length('facet:' || k || ':')) = 'facet:' || k || ':'
          and length(t #>> '{}') > length('facet:' || k || ':')
        order by o limit 1)));
end $$;

-- isHideableHouse (people/cardVeil.js): criminal, clandestine (declared facets; the inference tables
-- hold no row for these three kinds), or an illegal information brokerage.
create or replace function public._gallery_veil_house(i jsonb)
returns boolean language plpgsql immutable as $$
begin
  return (
  select coalesce(public._gallery_veil_lower(public._gallery_veil_str(i -> 'category')) = 'criminal'
        or public._gallery_veil_lower(public._gallery_veil_str(i -> 'priorityCategory')) = 'criminal'
        or public._gallery_veil_facet(i, 'clandestine') = 'clandestine'
        or public._gallery_veil_facet(i, 'institutionFunction') = 'clandestine'
        or public._gallery_veil_facet(i, 'subterranean') = 'subterranean'
        or (jsonb_typeof(i -> 'serviceKeys') = 'array' and jsonb_typeof(i -> 'tags') = 'array'
            and exists (select 1 from jsonb_array_elements(i -> 'serviceKeys') k
                         where k in ('"info_calibration"', '"info_query"', '"info_feed"', '"info_plant"'))
            and i -> 'tags' @> '["brokerage"]' and i -> 'tags' @> '["criminal"]'), false));
end $$;

-- The card's house (cardHouseOf || str(npc.institution)).
create or replace function public._gallery_veil_npc_house(n jsonb)
returns text language sql immutable as $$
  select case
    when jsonb_typeof(n -> 'institution') = 'object' and n -> 'institution' -> 'kind' = '"house"'
         and public._gallery_veil_or(n -> 'institution' -> 'key', n -> 'institution' -> 'name') is not null
      then public._gallery_veil_jsstr(public._gallery_veil_or(n -> 'institution' -> 'key', n -> 'institution' -> 'name'))
    else public._gallery_veil_str(n -> 'institution') end
$$;

-- JS string length (UTF-16 code units).
create or replace function public._gallery_veil_jslen(v text)
returns integer language plpgsql immutable as $$
begin
  return (
  select char_length(v) + (select count(*)::int from regexp_matches(v, U&'[\+010000-\+10FFFF]', 'g')));
end $$;

-- parseVeilAddress: {type, kind, id, field} or NULL.
create or replace function public._gallery_veil_parse(a text)
returns jsonb language plpgsql immutable as $$
declare
  i int; j int; k int; head text; rest text; tail text;
begin
  -- a JS length past 300 is possible only past 300 bytes (a UTF-16 unit is never fewer bytes than one)
  if a is null or a = '' or (octet_length(a) > 300 and public._gallery_veil_jslen(a) > 300) then return null; end if;
  i := position(':' in a);
  if i <= 1 then return null; end if;
  head := left(a, i - 1);
  rest := substr(a, i + 1);
  if rest = '' then return null; end if;
  if head in ('tab', 'block') then return jsonb_build_object('type', head, 'id', rest); end if;
  if head = 'class' then
    j := position(':' in rest);
    if j <= 1 or j = length(rest) then return null; end if;
    return jsonb_build_object('type', 'class', 'kind', left(rest, j - 1), 'field', substr(rest, j + 1));
  end if;
  if head in ('card', 'field') then
    j := position(':' in rest);
    if j <= 1 then return null; end if;
    tail := substr(rest, j + 1);
    if tail = '' then return null; end if;
    if head = 'card' then return jsonb_build_object('type', 'card', 'kind', left(rest, j - 1), 'id', tail); end if;
    k := position(':' in reverse(tail));
    if k = 0 then return null; end if;
    k := length(tail) - k + 1;
    if k <= 1 or k = length(tail) then return null; end if;
    return jsonb_build_object('type', 'field', 'kind', left(rest, j - 1), 'id', left(tail, k - 1), 'field', substr(tail, k + 1));
  end if;
  return null;
end $$;

-- isHideable(address) with no settlement (the resolver's form).
create or replace function public._gallery_veil_hideable_p(p jsonb, a text)
returns boolean language plpgsql immutable as $$
begin
  return (
  select case
      when p is null then false
      when p ->> 'type' in ('field', 'class') then coalesce(
        not (public._gallery_veil_kinds() -> (p ->> 'kind') -> 'floor' ? (p ->> 'field'))
        and not coalesce((public._gallery_veil_kinds() -> (p ->> 'kind') -> 'fields' -> (p ->> 'field'))
                           ?| array(select jsonb_array_elements_text(public._gallery_veil_kinds() -> (p ->> 'kind') -> 'floor')), false), false)
      when p ->> 'type' = 'card' then p ->> 'kind' = 'institution'
      else a = any(public._gallery_veil_groupings()) end);
end $$;

create or replace function public._gallery_veil_hideable(a text)
returns boolean language sql immutable as $$
  select public._gallery_veil_hideable_p(public._gallery_veil_parse(a), a)
$$;

-- cardsOf(s, kind): every record of the kind, with the path of its list and its index there.
create or replace function public._gallery_veil_cards(s jsonb, kind text)
returns table (list text[], owner_idx int, idx int, card jsonb)
language plpgsql immutable as $$
begin
  return query
  with paths as (
      select array(select jsonb_array_elements_text(p)) as path
        from jsonb_array_elements(public._gallery_veil_kinds() -> kind -> 'lists') p
    )
    select path, null::int, (o - 1)::int, e
      from paths, jsonb_array_elements(case when jsonb_typeof(s #> path) = 'array' and not ('*' = any(path)) then s #> path else '[]' end) with ordinality x(e, o)
     where jsonb_typeof(e) = 'object'
    union all
    select path, (oo - 1)::int, (o - 1)::int, e
      from paths,
           jsonb_array_elements(case when '*' = any(path) and jsonb_typeof(s #> path[1:array_position(path, '*') - 1]) = 'array'
                                     then s #> path[1:array_position(path, '*') - 1] else '[]' end) with ordinality w(own, oo),
           jsonb_array_elements(case when jsonb_typeof(own) = 'object' and jsonb_typeof(own #> path[array_position(path, '*') + 1:]) = 'array'
                                     then own #> path[array_position(path, '*') + 1:] else '[]' end) with ordinality x(e, o)
     where '*' = any(path) and jsonb_typeof(e) = 'object';
end $$;

-- dropHookKeys: every key matching /hook/i, at any depth. Walked WITHOUT recursion and in memory
-- linear in the document at any depth (the second review's R4: the earlier form called itself once
-- per level, and a document about 550 deep under Reveal DM exhausted the stack where 210 served it).
-- A key is always printed "<key>": with only escapes inside, so the text test below cannot miss one;
-- a value that merely mentions a hook is a harmless extra.
--   (1) THE SHALLOW WALK (every generated town): a recursive query, iterated by the executor, finds
--       the objects and arrays ON THE WAY to a hook key (it descends only into a child whose text holds
--       one, never below a dropped key), and those nodes alone are rebuilt, deepest first, each from its
--       own children with the rebuilt ones in place and its hook keys left out.
--   (2) PAST 64 LEVELS the walk would hold every level's subtree (memory the square of the depth), so
--       the document is read from its text instead, one token at a time: each member whose key matches
--       runs from its key to the next ',' or '}' of its own object (the next such token at its depth),
--       those tokens are left out, a comma left without a member on either side goes with them, and
--       the rest is the document again.
create or replace function public._gallery_veil_drop_hooks(j jsonb)
returns jsonb language plpgsql immutable as $$
declare
  txt text;
  wp jsonb[];   -- the nodes on the way, deepest first: path (an array of keys and indexes)
  wd int[];     -- their depth
  wv jsonb[];   -- their value
  np jsonb[];   -- the nodes rebuilt at one level: path
  nv jsonb[];   -- and new value
  maps jsonb := '{}';  -- the level below, rebuilt: {parent path: {key or index: new value}}
  ix int := 1;
  ex int;
  n int;
begin
  if jsonb_typeof(j) is distinct from 'object' and jsonb_typeof(j) is distinct from 'array' then return j; end if;
  txt := j::text;
  if txt !~* 'hook([^"\\]|\\.)*": ' then return j; end if;
  with recursive w(p, d, v) as (
      select '[]'::jsonb, 0, j
    union all
      select w.p || to_jsonb(c.k), w.d + 1, c.v
        from w, lateral (
          select x.k, x.v from jsonb_each(case when jsonb_typeof(w.v) = 'object' then w.v else '{}' end) x(k, v)
           where x.k !~* 'hook' and jsonb_typeof(x.v) in ('object', 'array') and x.v::text ~* 'hook([^"\\]|\\.)*": '
          union all
          select (y.o - 1)::text, y.v from jsonb_array_elements(case when jsonb_typeof(w.v) = 'array' then w.v else '[]' end) with ordinality y(v, o)
           where jsonb_typeof(y.v) in ('object', 'array') and y.v::text ~* 'hook([^"\\]|\\.)*": ') c
       where w.d < 64
  )
  select array_agg(p order by d desc), array_agg(d order by d desc), array_agg(v order by d desc) into wp, wd, wv from w;
  if wd[1] < 64 then
    n := array_length(wd, 1);
    while ix <= n loop
      ex := ix;
      while ex < n and wd[ex + 1] = wd[ix] loop ex := ex + 1; end loop;
      select array_agg(q.p), array_agg(q.v) into np, nv from (
        select a.p, case when jsonb_typeof(a.v) = 'object' then
            (select coalesce(jsonb_object_agg(x.k, coalesce(l.mm -> x.k, x.v)), '{}') from jsonb_each(a.v) x(k, v) where x.k !~* 'hook')
          else
            (select coalesce(jsonb_agg(coalesce(l.mm -> ((y.o - 1)::text), y.v) order by y.o), '[]') from jsonb_array_elements(a.v) with ordinality y(v, o))
          end as v
          from unnest(wp[ix:ex], wv[ix:ex]) a(p, v), lateral (select coalesce(maps -> (a.p::text), '{}') as mm) l) q;
      select coalesce(jsonb_object_agg(g.pp, g.m), '{}') into maps
        from (select (x.p - -1)::text as pp, jsonb_object_agg(x.p ->> -1, x.v) as m from unnest(np, nv) x(p, v) where jsonb_array_length(x.p) > 0 group by 1) g;
      ix := ex + 1;
    end loop;
    return nv[1];
  end if;
  return (
  with t as (
    select o as i, m[1] as tok
      from regexp_matches(txt, '"(?:[^"\\]|\\.)*"|[\[\]{}:,]|[^\[\]{}:,"[:space:]]+', 'g') with ordinality r(m, o)
  ),
  d as (
    select i, tok, lead(tok) over (order by i) as nxt,
           coalesce(sum(case when tok in ('[', '{') then 1 when tok in (']', '}') then -1 else 0 end)
             over (order by i rows between unbounded preceding and 1 preceding), 0) as dep
      from t
  ),
  k as (
    select i, tok, case when nxt = ':' and left(tok, 1) = '"' and (tok::jsonb #>> '{}') ~* 'hook' then 1 else 0 end as hk,
           min(case when tok in (',', '}') then i end)
             over (partition by dep order by i desc rows between unbounded preceding and 1 preceding) as sep
      from d
  ),
  -- a member opens at its key (counted before the token) and closes at its own object's next ',' or
  -- '}' (counted before that token, which stays)
  ev as (
    select i, tok, 0 as wt, 1 as istok from k
    union all select i, null, 1, 0 from k where hk = 1
    union all select sep, null, -1, 0 from k where hk = 1
  ),
  kept as (
    select i, tok from (select i, tok, istok, sum(wt) over (order by i, istok rows between unbounded preceding and current row) as cov from ev) c
     where istok = 1 and cov = 0
  ),
  r as (
    select i, tok, lag(tok) over (order by i) as prv,
           sum(case when tok <> ',' then 1 else 0 end) over (order by i desc rows between unbounded preceding and current row) as grp
      from kept
  ),
  -- a comma stays only between two members that stay: never after '{', '[' or another comma, never before '}' or ']'
  nb as (
    select i, tok, prv, max(case when tok <> ',' then tok end) over (partition by grp) as nxt from r
  )
  select string_agg(tok, '' order by i)::jsonb from nb
   where tok <> ',' or (prv not in ('{', '[', ',') and nxt not in ('}', ']')));
end $$;

-- The three house classes, apart (the defaults read them one by one).
create or replace function public._gallery_veil_criminal(i jsonb)
returns boolean language sql immutable as $$
  select public._gallery_veil_lower(public._gallery_veil_str(i -> 'category')) = 'criminal'
      or public._gallery_veil_lower(public._gallery_veil_str(i -> 'priorityCategory')) = 'criminal'
$$;
create or replace function public._gallery_veil_clandestine(i jsonb)
returns boolean language sql immutable as $$
  select coalesce(public._gallery_veil_facet(i, 'clandestine') = 'clandestine'
      or public._gallery_veil_facet(i, 'institutionFunction') = 'clandestine'
      or public._gallery_veil_facet(i, 'subterranean') = 'subterranean', false)
$$;
create or replace function public._gallery_veil_illegal_brokerage(i jsonb)
returns boolean language plpgsql immutable as $$
begin
  return (
  select coalesce(jsonb_typeof(i -> 'serviceKeys') = 'array' and jsonb_typeof(i -> 'tags') = 'array'
       and exists (select 1 from jsonb_array_elements(i -> 'serviceKeys') k
                    where k in ('"info_calibration"', '"info_query"', '"info_feed"', '"info_plant"'))
       and i -> 'tags' @> '["brokerage"]' and i -> 'tags' @> '["criminal"]', false));
end $$;

-- ── 3. THE RESOLVER (defaultVeilFor + readShareVeil + resolveVeil) ─────────────────────────
-- The effective veil, already parsed for the applier: {groupings: [tab/block addresses, sorted],
-- cards: {institution id: true}, classes: {kind: [field]}, fields: {kind: {id: [field]}}, exc:
-- {field address: true}} (each address is parsed ONCE, by one regular expression). NULL for an
-- unmarked share read as a listing (the page is unchanged). `link`: the party link's R4 — an unmarked
-- share takes the default veil.
create or replace function public._gallery_veil_resolve(pub jsonb, overrides jsonb, link boolean, people text[])
returns jsonb language plpgsql immutable as $$
declare
  ov jsonb := case when jsonb_typeof(overrides) = 'object' then overrides else '{}'::jsonb end;
  marked boolean := coalesce(jsonb_typeof(ov -> '$veil') = 'object', false);
  s jsonb := case when jsonb_typeof(pub) = 'object' then pub else '{}'::jsonb end;
  out jsonb;
begin
  if not marked and not link then return null; end if;
  with
  insts as (
    select card as i, public._gallery_veil_inst_id(card) as id
      from public._gallery_veil_cards(s, 'institution')
  ),
  defaults as (
    select unnest(public._gallery_veil_groupings()) as a
    union
    select x.a from insts, lateral (
      select unnest(array['card:institution:' || id, 'field:institution:' || id || ':description',
        'field:institution:' || id || ':function', 'field:institution:' || id || ':services']) as a
       where public._gallery_veil_illegal_brokerage(i) or public._gallery_veil_clandestine(i) or public._gallery_veil_criminal(i)
      union all
      select 'field:institution:' || id || ':people' where public._gallery_veil_criminal(i)
    ) x
    union
    select 'field:faction:' || public._gallery_veil_card_id('faction', card) || ':' || f
      from public._gallery_veil_cards(s, 'faction'), unnest(array['members', 'goals', 'conflicts', 'description']) f
     where public._gallery_veil_lower(public._gallery_veil_str(card -> 'category')) = 'criminal'
    union
    select 'class:npc:secret'
     where exists (select 1 from jsonb_array_elements(case when jsonb_typeof(s -> 'npcs') = 'array' then s -> 'npcs' else '[]' end) n
                    where jsonb_typeof(n) = 'object' and coalesce(n -> 'secret', 'null') <> 'null')
    union
    select 'class:npc:corruption'
     where exists (select 1 from jsonb_array_elements(case when jsonb_typeof(s -> 'npcs') = 'array' then s -> 'npcs' else '[]' end) n
                    where jsonb_typeof(n) = 'object'
                      and (coalesce(n -> 'allegiance', 'null') <> 'null' or coalesce(n -> 'corrupt', 'null') <> 'null'
                        or coalesce(n -> 'corruptionVector', 'null') <> 'null' or coalesce(n -> 'corruptTies', 'null') <> 'null'))
    union
    select 'class:' || k || ':hooks'
      from unnest(array['npc', 'event', 'tension', 'conflict', 'relationship']) k
     where exists (select 1 from public._gallery_veil_cards(s, k) c where coalesce(c.card -> 'plotHooks', 'null') <> 'null')
  ),
  -- readShareVeil's member keys read as card deltas (revealDm:false). Only a key that NAMES A PERSON
  -- of the document can hide anything, so only those are worked on: one lookup per person, never a
  -- walk over what a sharer stored (the review's F4). Every such delta hides, so their order is moot.
  card_deltas as (
    select 'card:npc:' || p as address, true as hidden, 0::bigint as ord
      from unnest(people) p
     where p <> '$veil' and jsonb_typeof(ov -> p) = 'object' and ov -> p -> 'revealDm' = 'false'::jsonb
  ),
  -- the client's clamp (clampVeilDeltas): a well-formed delta, de-duplicated by address (the last
  -- occurrence wins, at its own place), the LAST 2,000 kept. The cheap shape tests run on every
  -- entry; the address grammar runs only until 2,000 are kept (a stored list can be any length).
  stored_typed as (
    select e ->> 'address' as address, (e ->> 'hidden')::boolean as hidden, o::bigint as ord
      from jsonb_array_elements(case when marked and jsonb_typeof(ov -> '$veil' -> 'deltas') = 'array'
                                     then ov -> '$veil' -> 'deltas' else '[]' end) with ordinality x(e, o)
     where jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'hidden') = 'boolean'
       and jsonb_typeof(e -> 'address') = 'string'
  ),
  stored_last as (
    select distinct on (address) address, hidden, ord from stored_typed order by address, ord desc
  ),
  stored as (
    select address, hidden, 1000000000 + ord as ord, p
      from (select address, hidden, ord, public._gallery_veil_parse(address) as p
              from (select * from stored_last order by ord desc offset 0) q offset 0) q2
     where p is not null
     limit 2000
  ),
  deltas as (
    select address, hidden, ord, jsonb_build_object('type', 'card', 'kind', 'npc', 'id', substr(address, 10)) as p from card_deltas
    union all select * from stored
  ),
  targets as (
    select tt.t, tt.pt, d.hidden, d.ord
      from deltas d, lateral (
        select 'field:' || (d.p ->> 'kind') || ':' || (d.p ->> 'id') || ':' || f as t,
               jsonb_build_object('type', 'field', 'kind', d.p ->> 'kind', 'id', d.p ->> 'id', 'field', f) as pt
          from jsonb_object_keys(coalesce(public._gallery_veil_kinds() -> (d.p ->> 'kind') -> 'fields', '{}')) f
         where d.p ->> 'type' = 'card' and d.p ->> 'kind' <> 'institution'
        union all
        select d.address, d.p where not (d.p ->> 'type' = 'card' and d.p ->> 'kind' <> 'institution')
      ) tt
     where public._gallery_veil_hideable_p(tt.pt, tt.t)
  ),
  last as (select distinct on (t) t, pt, hidden from targets order by t, ord desc),
  veiled as (
    select d.a, d.p from (select a, public._gallery_veil_parse(a) as p from defaults offset 0) d
     where public._gallery_veil_hideable_p(d.p, d.a) and d.a not in (select t from last where not hidden)
    union
    select t, pt from last where hidden
  )
  select jsonb_build_object(
    'groupings', coalesce((select jsonb_agg(a order by a collate "C") from veiled where p ->> 'type' in ('tab', 'block')), '[]'),
    'cards', coalesce((select jsonb_object_agg(p ->> 'id', true) from veiled where p ->> 'type' = 'card'), '{}'),
    'classes', coalesce((select jsonb_object_agg(k, fs) from (
        select p ->> 'kind' as k, jsonb_agg(distinct p ->> 'field') as fs from veiled where p ->> 'type' = 'class' group by 1) q), '{}'),
    'fields', coalesce((select jsonb_object_agg(k, ids) from (
        select k, jsonb_object_agg(i, fs) as ids from (
          select p ->> 'kind' as k, p ->> 'id' as i, jsonb_agg(distinct p ->> 'field') as fs from veiled
           where p ->> 'type' = 'field' group by 1, 2) q1 group by 1) q2), '{}'),
    'exc', coalesce((select jsonb_object_agg(t, true) from last where not hidden and t like 'field:%'), '{}'))
    into out;
  return out;
end $$;

-- ── 4. THE APPLIER (applyVeil, removal only) ────────────────────────────────────────────────
-- One card through its class switches and its own eyes. `id` NULL is an anonymous legacy event:
-- every eye addressed to any legacy event applies, and no exception does (fail-closed).
create or replace function public._gallery_veil_card(kind text, c jsonb, cls jsonb, byid jsonb, excj jsonb, legacy jsonb)
returns jsonb language plpgsql immutable as $$
declare
  kd jsonb := public._gallery_veil_kinds() -> kind;
  id text := public._gallery_veil_card_id(kind, c);
  f text;
  own jsonb;
  drops text[] := array[]::text[];
begin
  if jsonb_typeof(cls) is distinct from 'array' then cls := '[]'; end if;
  if jsonb_typeof(byid) is distinct from 'object' then byid := '{}'; end if;
  for f in select jsonb_array_elements_text(cls) loop
    if id is null or not (excj ? ('field:' || kind || ':' || id || ':' || f)) then drops := drops || f; end if;
  end loop;
  if id is null then
    own := legacy;  -- every eye on any legacy event, unioned once per read (the review's F5)
  else
    own := byid -> id;
  end if;
  drops := drops || array(select jsonb_array_elements_text(coalesce(own, '[]')));
  return c - array(
    select k from unnest(drops) f2,
      lateral (select jsonb_array_elements_text(case when kd -> 'fields' ? f2 then kd -> 'fields' -> f2 else jsonb_build_array(f2) end) k) kk
     where not (kd -> 'floor' ? k));
end $$;

-- Rebuild every list of one kind through a per-card function chosen by `mode`
-- ('eyes': _gallery_veil_card; 'npc': the people / gone-house pass).
create or replace function public._gallery_veil_map(s jsonb, kind text, mode text, a jsonb)
returns jsonb language plpgsql immutable as $$
declare
  path text[];
  star int;
  pre text[];
  suf text[];
  arr jsonb;
begin
  for path in select array(select jsonb_array_elements_text(p)) from jsonb_array_elements(public._gallery_veil_kinds() -> kind -> 'lists') p loop
    star := array_position(path, '*');
    if star is null then
      arr := s #> path;
      if jsonb_typeof(arr) = 'array' and jsonb_array_length(arr) > 0 then
        s := jsonb_set(s, path, public._gallery_veil_map_list(arr, kind, mode, a));
      end if;
    else
      pre := path[1:star - 1];
      suf := path[star + 1:];
      arr := s #> pre;
      if jsonb_typeof(arr) = 'array' and jsonb_array_length(arr) > 0 then
        s := jsonb_set(s, pre, (
          select jsonb_agg(case when jsonb_typeof(own) = 'object' and jsonb_typeof(own #> suf) = 'array' and jsonb_array_length(own #> suf) > 0
                                then jsonb_set(own, suf, public._gallery_veil_map_list(own #> suf, kind, mode, a)) else own end order by o)
            from jsonb_array_elements(arr) with ordinality x(own, o)));
      end if;
    end if;
  end loop;
  return s;
end $$;

-- An NPC card after the house passes: its link to a house whose people are veiled, then (X-21e)
-- every reference to a house removed whole.
create or replace function public._gallery_veil_npc_pass(n jsonb, a jsonb)
returns jsonb language plpgsql immutable as $$
declare
  houses jsonb := coalesce(a -> 'gone_houses', '{}');
  ids jsonb := coalesce(a -> 'gone_ids', '{}');
  k text;
  v jsonb;
begin
  if coalesce(a -> 'people', '{}') ? public._gallery_veil_npc_house(n) then n := n - 'institution'; end if;
  if houses <> '{}' or ids <> '{}' then
    if houses ? public._gallery_veil_npc_house(n) then n := n - 'institution'; end if;
    for k, v in select * from jsonb_each(n) loop
      if k not in ('id', 'name') and jsonb_typeof(v) = 'string' and houses ? (v #>> '{}') then n := n - k; end if;
    end loop;
    if jsonb_typeof(n -> 'linkedInstitutionIds') = 'array' then
      n := jsonb_set(n, '{linkedInstitutionIds}', coalesce((
        select jsonb_agg(e order by o) from jsonb_array_elements(n -> 'linkedInstitutionIds') with ordinality x(e, o)
         where not (ids ? public._gallery_veil_str(e) or houses ? public._gallery_veil_str(e))), '[]'));
    end if;
  end if;
  return n;
end $$;

create or replace function public._gallery_veil_map_list(arr jsonb, kind text, mode text, a jsonb)
returns jsonb language plpgsql immutable as $$
begin
  return (
  select jsonb_agg(case when jsonb_typeof(e) <> 'object' then e
      when mode = 'eyes' then public._gallery_veil_card(kind, e, a -> 'cls', a -> 'byid', a -> 'exc', a -> 'legacy')
      else public._gallery_veil_npc_pass(e, a) end order by o)
    from jsonb_array_elements(arr) with ordinality x(e, o));
end $$;

-- One grouping's removal (GROUPING_REMOVERS), and the prose rungs it covers (VEILED_PUBLIC_PROSE).
create or replace function public._gallery_veil_grouping(s jsonb, g text)
returns jsonb language plpgsql immutable as $$
begin
  if g = 'tab:plot_hooks' then
    -- the walk runs only where a key matches /hook/i at all (the sanitiser already strips most): the
    -- question is asked once over the document's text, in C, where a key is always spelled "<key>":
    -- with only escapes inside (stepped over by \\.), so the pattern cannot miss one; a value that
    -- merely mentions a hook is walked and comes back unchanged. (The review's F6 kept an exact
    -- jsonpath test `$.**` here as well; it is gone: on a document 9,000 deep it exhausted the
    -- server's memory where 210 served, the second review's R4 class, and the walk's own text test
    -- makes it redundant.)
    if s::text !~* 'hook([^"\\]|\\.)*": ' then return s; end if;
    return (select coalesce(jsonb_object_agg(k, case when k in ('id', 'name', 'tier', 'population', 'config') then v
                                                     else public._gallery_veil_drop_hooks(v) end), '{}')
              from jsonb_each(s) x(k, v)
             where k in ('id', 'name', 'tier', 'population', 'config') or k !~* 'hook');
  elsif g = 'block:services.criminal' then
    if jsonb_typeof(s -> 'availableServices') = 'object' then
      s := jsonb_set(s, '{availableServices}', (s -> 'availableServices') - 'criminal');
    end if;
  elsif g = 'block:defense.criminalStructure' then
    if jsonb_typeof(s -> 'economicState') = 'object' and jsonb_typeof(s #> '{economicState,safetyProfile}') = 'object' then
      s := jsonb_set(s, '{economicState,safetyProfile}', (s #> '{economicState,safetyProfile}') - array['criminalInstitutions', 'crimeTypes']);
    end if;
  elsif g = 'block:power.criminalUnderside' then
    if jsonb_typeof(s -> 'powerStructure') = 'object' then
      s := jsonb_set(s, '{powerStructure}', (s -> 'powerStructure') - 'criminalCaptureState');
      if jsonb_typeof(s #> '{powerStructure,factions}') = 'array' then
        s := jsonb_set(s, '{powerStructure,factions}', (select coalesce(jsonb_agg(case when jsonb_typeof(e) = 'object' then e - 'captureState' else e end order by o), '[]')
                                                         from jsonb_array_elements(s #> '{powerStructure,factions}') with ordinality x(e, o)));
      end if;
      if jsonb_typeof(s #> '{powerStructure,factionRelationships}') = 'array' then
        s := jsonb_set(s, '{powerStructure,factionRelationships}', (select coalesce(jsonb_agg(case when jsonb_typeof(e) = 'object' then e - 'captureState' else e end order by o), '[]')
                                                                     from jsonb_array_elements(s #> '{powerStructure,factionRelationships}') with ordinality x(e, o)));
      end if;
    end if;
    if jsonb_typeof(s -> 'economicState') = 'object' and jsonb_typeof(s #> '{economicState,safetyProfile}') = 'object' then
      s := jsonb_set(s, '{economicState,safetyProfile}', (s #> '{economicState,safetyProfile}') - 'blackMarketCapture');
    end if;
  elsif g = 'block:defense.vulnerabilities' then
    if jsonb_typeof(s -> 'structuralViolations') = 'array' then
      s := jsonb_set(s, '{structuralViolations}', (select coalesce(jsonb_agg(e order by o), '[]')
        from jsonb_array_elements(s -> 'structuralViolations') with ordinality x(e, o)
       where not (jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'reason') = 'string'
                  and (e ->> 'reason') ~* 'fort|milit|wall|garrison|defense|guard|structural|survival')));
    end if;
  elsif g = 'block:housekeeping.structuralIssues' then
    s := s - array['structuralViolations', 'structuralSuggestions'];
  elsif g = 'block:housekeeping.coherenceNotes' then
    s := s - 'coherenceNotes';
  elsif g = 'block:housekeeping.receipt' then
    s := s - 'generationCoherenceReceipt';
  elsif g = 'block:housekeeping.decrees' then
    s := s - array['decrees', 'dmLayer'];
  end if;
  -- the prose rungs (dropVeiledPublicProse)
  if jsonb_typeof(s -> 'publicProse') = 'object' and jsonb_typeof(s #> '{publicProse,blocks}') = 'object' then
    if g = 'block:defense.criminalStructure' and (s #> '{publicProse,blocks}') ? 'defense:criminal' then
      s := s #- '{publicProse,blocks,defense:criminal}';
    elsif g = 'block:power.criminalUnderside' and jsonb_typeof(s #> '{publicProse,blocks,power:desk}') = 'object' then
      s := jsonb_set(s, '{publicProse,blocks,power:desk}',
        (s #> '{publicProse,blocks,power:desk}') - array['legitimacyReading', 'captureReading', 'operationReading', 'gmAdvisory']);
    end if;
  end if;
  return s;
end $$;

create or replace function public._gallery_veil_apply(pub jsonb, res jsonb)
returns jsonb language plpgsql immutable as $$
declare
  s jsonb := case when jsonb_typeof(pub) = 'object' then pub else '{}'::jsonb end;
  excj jsonb := coalesce(res -> 'exc', '{}');
  groupings text[] := array(select jsonb_array_elements_text(coalesce(res -> 'groupings', '[]')));
  card_hides jsonb := coalesce(res -> 'cards', '{}');
  classes jsonb := coalesce(res -> 'classes', '{}');
  fields jsonb := coalesce(res -> 'fields', '{}');
  gone_ids jsonb := '{}';
  gone_houses jsonb := '{}';
  services_of jsonb;
  people_of jsonb := '{}';
  kind text;
  g text;
begin
  -- X-21e: a card-hidden house goes whole only when the data puts it in the class.
  -- (set-based, the review's F5: one pass, never a growing object rebuilt per house)
  if card_hides <> '{}' then
    with h as (
      select c.card, i.id, public._gallery_veil_house(c.card) as house
        from public._gallery_veil_cards(s, 'institution') c, lateral (select public._gallery_veil_inst_id(c.card) as id) i
       where card_hides ? i.id
    )
    select coalesce((select jsonb_object_agg(id, true) from h where house), '{}'),
           coalesce((select jsonb_object_agg(card ->> 'name', true) from h where house and public._gallery_veil_str(card -> 'name') <> ''), '{}'),
           fields || jsonb_build_object('institution', coalesce(fields -> 'institution', '{}') || coalesce((
             select jsonb_object_agg(q.id, (select jsonb_agg(distinct f) from (
                 select jsonb_array_elements_text(coalesce(fields #> array['institution', q.id], '[]')) f
                 union select unnest(array['description', 'function', 'services', 'people'])) u))
               from (select distinct id from h where not house) q), '{}'))
      into gone_ids, gone_houses, fields;
    if fields -> 'institution' = '{}' then fields := fields - 'institution'; end if;
  end if;

  -- the virtual institution eyes, read before any card is touched
  if fields -> 'institution' is not null or classes -> 'institution' is not null then
    with v as (
      select c.card ->> 'name' as name,
             coalesce(fields #> array['institution', i.id], '[]') ? 'services'
               or (coalesce(classes -> 'institution', '[]') ? 'services' and not (excj ? ('field:institution:' || i.id || ':services'))) as vs,
             coalesce(fields #> array['institution', i.id], '[]') ? 'people'
               or (coalesce(classes -> 'institution', '[]') ? 'people' and not (excj ? ('field:institution:' || i.id || ':people'))) as vp
        from public._gallery_veil_cards(s, 'institution') c, lateral (select public._gallery_veil_inst_id(c.card) as id) i
       where public._gallery_veil_str(c.card -> 'name') <> ''
    )
    select coalesce((select jsonb_object_agg(name, true) from v where vs), '{}'), coalesce((select jsonb_object_agg(name, true) from v where vp), '{}')
      into services_of, people_of;
  else
    services_of := '{}';
  end if;
  services_of := gone_houses || services_of;

  -- cards: class switches, then per-card eyes
  foreach kind in array public._gallery_veil_kind_order() loop
    if classes -> kind is null and fields -> kind is null then continue; end if;
    s := public._gallery_veil_map(s, kind, 'eyes', jsonb_build_object('cls', classes -> kind, 'byid', fields -> kind, 'exc', excj,
      'legacy', case when kind = 'event' then coalesce((select jsonb_agg(distinct f) from jsonb_each(coalesce(fields -> 'event', '{}')) e(k, v),
                                                          jsonb_array_elements_text(v) f where k like 'event.legacy-%'), '[]') end));
  end loop;

  -- an institution's services: the rows in availableServices it offers
  if jsonb_typeof(s -> 'availableServices') = 'object' and services_of <> '{}' then
    s := jsonb_set(s, '{availableServices}', (select coalesce(jsonb_object_agg(k, case when jsonb_typeof(v) = 'array' then coalesce((
        select jsonb_agg(e order by o) from jsonb_array_elements(v) with ordinality x(e, o)
         where not (jsonb_typeof(e) = 'object' and services_of ? public._gallery_veil_str(e -> 'institution'))), '[]') else v end), '{}')
      from jsonb_each(s -> 'availableServices') y(k, v)));
  end if;

  -- X-21e: a house removed whole leaves the institutions list
  if gone_ids <> '{}' and jsonb_typeof(s -> 'institutions') = 'array' then
    s := jsonb_set(s, '{institutions}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s -> 'institutions') with ordinality x(e, o)
      where not (jsonb_typeof(e) = 'object' and gone_ids ? public._gallery_veil_inst_id(e) and public._gallery_veil_house(e))), '[]'));
  end if;

  -- an institution's people, and every reference to a house removed whole
  if people_of <> '{}' or gone_houses <> '{}' or gone_ids <> '{}' then
    s := public._gallery_veil_map(s, 'npc', 'npc', jsonb_build_object('people', people_of, 'gone_houses', gone_houses, 'gone_ids', gone_ids));
  end if;

  -- groupings last
  foreach g in array groupings loop
    s := public._gallery_veil_grouping(s, g);
  end loop;
  return s;
end $$;

-- ── 5. THE VEIL, AS THE READS CALL IT ───────────────────────────────────────────────────────
-- {body, groupings} for a marked share (or any share on the party link); NULL for an unmarked
-- listing, which the reads serve as before. `copy`: the read served the share's FROZEN COPY (only
-- then does the served marker carry the freeze date: the second review's R5).
create or replace function public._gallery_veil(pub jsonb, overrides jsonb, link boolean, copy boolean default false)
returns jsonb language plpgsql immutable as $$
declare
  -- the stored overrides, decompressed ONCE: every later look at them is in memory (a stored object
  -- of any size is read once per read, never once per operator)
  ov jsonb := coalesce(overrides #> '{}', '{}');
  doc jsonb := case when jsonb_typeof(pub) = 'object' then pub else '{}' end;
  -- every person of the document, by the client's member key (the served booleans and the card deltas)
  people text[] := array(select distinct public._gallery_veil_npc_id(c.card) from public._gallery_veil_cards(doc, 'npc') c);
  res jsonb;
begin
  if jsonb_typeof(ov) <> 'object' then ov := '{}'; end if;
  res := public._gallery_veil_resolve(pub, ov, link, people);
  if res is null then return jsonb_build_object('served', public._gallery_veil_served(ov, null, to_jsonb(people), copy)); end if;
  return jsonb_build_object(
    'body', public._gallery_veil_apply(pub, res),
    'groupings', res -> 'groupings',
    'served', public._gallery_veil_served(ov, res -> 'groupings', to_jsonb(people), copy));
end $$;

-- What of the share travels to a reader (low finding 2, the fail-closed form: an ALLOWLIST, never
-- a strip). Each member's two booleans, and — when the server applied a veil — the served marker
-- { v: 2, mode, at, groupings }. No delta, no frozen copy, no other key. `at`, the freeze date,
-- travels ONLY when the read served the frozen copy (`copy`): a page that draws the live town (the
-- party link of a snapshot share, by 208's design; a snapshot share with no copy) is never labelled
-- with a date it does not show (the second review's R5; the client dates a page by `at`).
create or replace function public._gallery_veil_served(overrides jsonb, groupings jsonb, people jsonb, copy boolean)
returns jsonb language plpgsql immutable as $$
begin
-- each person's member entry, looked up by the person's key (a key naming no person is no one's
  -- override: the review's F4, so the work is the document's, not what a sharer stored)
  return (
  select coalesce((
        select jsonb_object_agg(k, m) from (
          select k, jsonb_strip_nulls(jsonb_build_object(
              'revealDm', case when jsonb_typeof(v -> 'revealDm') = 'boolean' then v -> 'revealDm' end,
              'allowImport', case when jsonb_typeof(v -> 'allowImport') = 'boolean' then v -> 'allowImport' end)) as m
            from (select k, overrides -> k as v
                    from jsonb_array_elements_text(case when jsonb_typeof(people) = 'array' then people else '[]' end) k
                   where jsonb_typeof(overrides) = 'object') x
           where k <> '$veil' and jsonb_typeof(v) = 'object') q
         where m <> '{}'), '{}')
      || case when groupings is null then '{}'::jsonb else jsonb_build_object('$veil', jsonb_strip_nulls(jsonb_build_object(
           'v', 2,
           'mode', case when overrides #>> '{$veil,mode}' in ('snapshot', 'live') and jsonb_typeof(overrides #> '{$veil,mode}') = 'string'
                        then overrides #> '{$veil,mode}' end,
           'at', case when copy and jsonb_typeof(overrides #> '{$veil,at}') = 'string' and (octet_length(overrides #>> '{$veil,at}') <= 40 or public._gallery_veil_jslen(overrides #>> '{$veil,at}') <= 40)
                      then overrides #> '{$veil,at}' end,
           'groupings', groupings))) end);
end $$;

-- ── 6. THE READS (each its previous body plus the veil; grants as they stood) ────────────────

-- get_gallery_dossier: 147's body plus the veil, and the pg_temp pin a recreated definer takes
-- (tests/lint/migrationSearchPathPin.test.js; its ledger row comes off)
create or replace function public.get_gallery_dossier(dossier_slug text)
returns table (
  id uuid,
  public_slug text,
  name text,
  tier text,
  data jsonb,
  published_at timestamptz,
  updated_at timestamptz,
  view_count integer,
  is_curated boolean,
  gallery_description text,
  gallery_image_url text,
  gallery_image_alt text,
  gallery_tags text[],
  gallery_share_dm boolean,
  gallery_importable boolean,
  gallery_member_overrides jsonb,
  population integer,
  terrain text,
  government_type text,
  magic_level text,
  stability text,
  primary_resource text,
  threat_level text,
  net_votes integer,
  comment_count integer,
  chronicle jsonb,
  author_name text,
  aliveness integer
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    r.id,
    r.public_slug,
    r.name,
    r.tier,
    coalesce(vl.v -> 'body', proj.d) as data,
    r.published_at,
    r.updated_at,
    r.view_count,
    r.is_curated,
    r.gallery_description,
    r.gallery_image_url,
    r.gallery_image_alt,
    r.gallery_tags,
    s.gallery_share_dm,
    s.gallery_importable,
    vl.v -> 'served' as gallery_member_overrides,
    r.population,
    r.terrain,
    r.government_type,
    r.magic_level,
    r.stability,
    r.primary_resource,
    r.threat_level,
    r.net_votes,
    r.comment_count,
    public._gallery_chronicle_json(s.campaign_state -> 'eventLog') as chronicle,
    ap.external_name as author_name,
    r.aliveness
  from public.settlements s
  join public._gallery_public_tile_rows() r on r.id = s.id
  left join public.profiles ap on ap.id = s.user_id
  cross join lateral (
    select case
      when s.gallery_share_narrated
        and s.ai_data is not null
        and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
      then s.ai_data -> 'aiSettlement'
      else s.data
    end as j
  ) base
  -- 211: a share in snapshot mode is served its frozen copy, through the same projection. A copy
  -- past the server's bound is REFUSED (no row), never replaced by the live row (the review's F1).
  cross join lateral (
    select case when cp.copy is not null then cp.copy else base.j end as j,
           cp.copy is not null as copied,
           coalesce(length(cp.copy::text) > public._gallery_veil_copy_bound(), false) as refused
      from (select case when mv.v ->> 'mode' = 'snapshot' and jsonb_typeof(mv.v -> 'snapshot') = 'object' then mv.v -> 'snapshot' end as copy
              from (select s.gallery_member_overrides -> '$veil' as v offset 0) mv) cp
  ) src
  cross join lateral (
    select public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(src.j) else public._gallery_sanitize_public_json(src.j) end,
      public._gallery_dm_full_json(src.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, false
    ) as d
    offset 0
  ) proj
  -- 211: the share's veil, applied here (NULL for an unmarked listing: served as before); the freeze
  -- date travels only with the frozen copy (R5)
  cross join lateral (select public._gallery_veil(proj.d, s.gallery_member_overrides, false, src.copied) as v offset 0) vl
  where s.public_slug = dossier_slug
    and s.is_public = true
    and not src.refused
  limit 1;
$$;

revoke execute on function public.get_gallery_dossier(text) from public;
grant execute on function public.get_gallery_dossier(text) to authenticated, anon;

-- get_unlisted_dossier: 208's body (as amended) plus the veil
create or replace function public.get_unlisted_dossier(p_slug text)
returns jsonb
language sql stable security definer set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'id', s.id,
    'name', s.name,
    'tier', s.tier,
    'slug', s.unlisted_slug,
    'unlisted', true,
    'author_name', ap.external_name,
    'is_owner', coalesce(s.user_id = auth.uid(), false),
    'gallery_share_dm', false,
    -- 211: nothing of the share travels but each member's two booleans and the served marker.
    'gallery_member_overrides', vl.v -> 'served',
    'dossier', vl.v -> 'body'
  )
  from public.settlements s
  left join public.profiles ap on ap.id = s.user_id
  cross join lateral (
    select case
      when s.gallery_share_narrated
        and s.ai_data is not null
        and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
      then s.ai_data -> 'aiSettlement'
      else s.data
    end as j
  ) base
  -- R12 (the re-review of 2026-11-10): the sanitizer runs ONCE per read on the whole document;
  -- its result is both the splice's base and its only source.
  cross join lateral (select public._gallery_sanitize_public_json(base.j) as j offset 0) pub
  cross join lateral (
    select public._gallery_apply_member_overrides(
      pub.j, pub.j,
      s.gallery_member_overrides, false, s.gallery_importable, false
    ) as d
    offset 0
  ) proj
  -- 211: the share's veil; an unmarked share takes the default veil (the link's readers are players)
  cross join lateral (select public._gallery_veil(proj.d, s.gallery_member_overrides, true) as v offset 0) vl
  where s.unlisted_slug = p_slug
  limit 1;
$$;
grant execute on function public.get_unlisted_dossier(text) to authenticated, anon;

-- import_gallery_dossier: 131's body plus the veil
create or replace function public.import_gallery_dossier(dossier_slug text)
returns table (
  id uuid,
  name text,
  tier text,
  data jsonb
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    s.id,
    s.name,
    s.tier,
    coalesce(vl.v -> 'body', proj.d) as data
  from public.settlements s
  cross join lateral (
    select case
      when s.gallery_share_narrated
        and s.ai_data is not null
        and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
      then s.ai_data -> 'aiSettlement'
      else s.data
    end as j
  ) base
  cross join lateral (
    select public._gallery_apply_member_overrides(
      case when s.gallery_share_dm then public._gallery_dm_full_json(base.j) else public._gallery_sanitize_public_json(base.j) end,
      public._gallery_dm_full_json(base.j),
      s.gallery_member_overrides, s.gallery_share_dm, s.gallery_importable, true
    ) as d
    offset 0
  ) proj
  -- 211: the share's veil (NULL for an unmarked listing: served as before)
  cross join lateral (select public._gallery_veil(proj.d, s.gallery_member_overrides, false) as v offset 0) vl
  where s.public_slug = dossier_slug
    and s.is_public = true
    and s.gallery_importable = true
    and auth.uid() is not null
    -- ── mig 120: IMPORT is premium (server-authoritative). Free/anon → 0 rows. ──
    and public.current_user_has_premium_access()
  limit 1;
$$;

revoke execute on function public.import_gallery_dossier(text) from public;
grant execute on function public.import_gallery_dossier(text) to authenticated;

-- get_gallery_map: 088's body plus the veil
create or replace function public.get_gallery_map(p_slug text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  row      public.saved_maps;
  v_camp   jsonb;
  v_members jsonb;
begin
  select * into row from public.saved_maps where public_slug = p_slug and is_public = true;
  if not found then return null; end if;
  update public.saved_maps set view_count = view_count + 1 where id = row.id;

  if row.share_kind = 'map_with_campaign' and row.gallery_share_campaign then
    v_camp := coalesce(row.map_data->'campaign', row.map_data);
    -- Member dossiers — public-safe via the SAME sanitizers as the settlement
    -- gallery. settlementIds that aren't cloud rows (local-only) simply drop out.
    -- 088: also project each member's public_slug so the client can cross-link a
    -- member to its public gallery dossier (null when that member isn't published).
    select jsonb_agg(jsonb_build_object(
      'old_id',      s.id::text,
      'name',        s.name,
      'tier',        s.tier,
      'public_slug', case when s.is_public then s.public_slug else null end,
      'settlement',  coalesce(public._gallery_veil(pub.j, s.gallery_member_overrides, false) -> 'body', pub.j),
      'chronicle',   public._gallery_chronicle_json(s.campaign_state -> 'eventLog')
    )) into v_members
    from public.settlements s
    -- 211: the member's own listing source (the review's F7): its narration when narrated, its frozen
    -- copy in snapshot mode (a copy past the bound is refused: the member is left out, never served
    -- live), then the sanitizer and its own listing's veil
    cross join lateral (
      select case
        when s.gallery_share_narrated
          and s.ai_data is not null
          and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
        then s.ai_data -> 'aiSettlement'
        else s.data
      end as j
    ) base
    cross join lateral (
      select case when cp.copy is not null then cp.copy else base.j end as j,
             coalesce(length(cp.copy::text) > public._gallery_veil_copy_bound(), false) as refused
        from (select case when mv.v ->> 'mode' = 'snapshot' and jsonb_typeof(mv.v -> 'snapshot') = 'object' then mv.v -> 'snapshot' end as copy
                from (select s.gallery_member_overrides -> '$veil' as v offset 0) mv) cp
    ) src
    cross join lateral (select public._gallery_sanitize_public_json(src.j) as j offset 0) pub
    where not src.refused
      and s.id::text in (
      select jsonb_array_elements_text(coalesce(v_camp->'settlementIds', '[]'::jsonb))
    )
      -- CRITICAL (IDOR guard, 046): the owner may only ever expose their OWN
      -- settlements. settlementIds is owner-controlled free-form jsonb and this
      -- fn is SECURITY DEFINER (bypasses settlements RLS), so without this an
      -- owner could list another user's settlement UUIDs and leak their dossiers.
      and s.user_id = row.user_id
      and s.access_state = 'active';

    return jsonb_build_object(
      'slug', row.public_slug, 'name', row.name, 'kind', row.share_kind,
      'description', row.gallery_description, 'tags', to_jsonb(row.gallery_tags),
      -- 088: cover image + realm-arc summary projected for the detail header.
      'imageUrl', row.gallery_image_url, 'imageAlt', row.gallery_image_alt,
      'realmArcSummary', row.gallery_realm_arc_summary,
      -- ALLOWLIST the mapState fields the importer actually consumes (backdrop +
      -- placements + the sharer's published annotations). layers/viewport (which
      -- include GM display filters) are deliberately dropped; worldState /
      -- regionalGraph are siblings under v_camp and NEVER included.
      'mapState', (
        select jsonb_strip_nulls(jsonb_build_object(
          'fmgSnapshot',    ms->'fmgSnapshot',
          'seed',           ms->'seed',
          'customBackdrop', ms->'customBackdrop',
          'placements',     ms->'placements',
          'labels',         ms->'labels',
          'markers',        ms->'markers',
          'forests',        ms->'forests'
        )) from (select v_camp->'mapState' as ms) x
      ),
      -- 088: the shared-world panel is the STORED, pre-sanitized publish-time
      -- artifact (gallery_world_snapshot / _sections) — projected ONLY on the
      -- owner's gallery_share_world opt-in, and NEVER a live read of
      -- v_camp->'worldState' / 'regionalGraph' (those stay un-projected, per 046).
      'world', case when row.gallery_share_world then jsonb_strip_nulls(jsonb_build_object(
        'snapshot', row.gallery_world_snapshot,
        'sections', coalesce(row.gallery_world_sections, '[]'::jsonb)
      )) else null end,
      'members', coalesce(v_members, '[]'::jsonb)
    );
  end if;

  -- Default / kind='map' = blank-canvas backdrop only (Phase 1). 088: still carry
  -- the cover image + rich description so a plain map share has a header too.
  return jsonb_build_object(
    'slug', row.public_slug, 'name', row.name, 'kind', row.share_kind,
    'description', row.gallery_description, 'tags', to_jsonb(row.gallery_tags),
    'imageUrl', row.gallery_image_url, 'imageAlt', row.gallery_image_alt,
    'realmArcSummary', row.gallery_realm_arc_summary,
    'backdrop', public._gallery_map_backdrop(row.map_data)
  );
end $$;

grant execute on function public.get_gallery_map(text) to anon, authenticated;

-- ── 7. THE HELPERS ARE CALLED ONLY INSIDE THE READS ─────────────────────────────────────────
do $do$
declare f record;
begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public' and p.proname like '\_gallery\_veil%' loop
    execute format('revoke execute on function %s from public, anon, authenticated', f.sig);
  end loop;
end $do$;
