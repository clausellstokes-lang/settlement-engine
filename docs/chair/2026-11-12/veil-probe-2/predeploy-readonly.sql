-- ════════════════════════════════════════════════════════════════════════════════════════════
-- THE READ-ONLY CHECKS BEFORE MIGRATION 211 IS APPLIED (for the owner's deploy step).
-- COHERENCE-VEIL-2 wrote it; COHERENCE-VEIL-3 rebuilt it to the second review's "For the owner's
-- deploy" (REVIEW-VEIL-211-c4d78c907, finding R6) and the chair's rulings of 2026-11-12.
--
-- HOW TO RUN: in the hosted project's SQL editor, as the owner, BEFORE `supabase db push`, the whole
-- file at once. The database is then still at 210, so nothing here calls anything 211 creates.
-- Every statement READS: the transaction is READ ONLY (a write inside it is refused by the server,
-- superuser included) and ends in ROLLBACK, so pasting it whole can change nothing. The block's own
-- `set local statement_timeout` lasts only to its rollback; section (1) reads the limits the ROLES
-- and the DATABASE carry, never this setting.
--
-- Each section says the number that would worry, and why. "A shared town" is a row listed in the
-- gallery or reachable by a party link. "The document, the copy and the narration" are the three
-- sources a public read can serve: `data`, the frozen copy `gallery_member_overrides.$veil.snapshot`
-- and the AI narration `ai_data.aiSettlement`; every count over a town's content is taken over all three.
--
-- EXECUTED (the lane's hand-back, part 4 §R6): on a scratch PostgreSQL 16 cluster at 210 with fixture
-- rows built to move each number, as a superuser, ON_ERROR_STOP; its write-proofing proven there.
-- Never run against a hosted database by any seat.
-- ════════════════════════════════════════════════════════════════════════════════════════════
begin transaction read only;
set local statement_timeout = '120s';

-- (1) THE REAL STATEMENT TIME LIMITS: per role (rolconfig), per role in this database and for every
--     role in this database (pg_db_role_setting), and the server's own default as this session began
--     (pg_settings.reset_val: what a session gets before anything sets it; NOT this block's setting).
--     WORRIES: anon or authenticated under 1.5s (1500ms). The heaviest read measured at 211 is about
--     1.1 s natively (the Force-all request, Reveal DM on, a snapshot copy, every eye shut: hand-back
--     part 4 §R7); under 1.5 s there is no margin, so hold and time one real Force-all page on a branch
--     first. A timed-out read shows "This settlement is not available." and cannot be told from a
--     missing town. No limit anywhere means the server default below applies.
select r.rolname, r.rolconfig as role_settings,
       (select array_agg(array_to_string(s.setconfig, ',')) from pg_db_role_setting s
         where s.setrole = r.oid and s.setdatabase in (0, (select oid from pg_database where datname = current_database()))) as role_in_db_settings
  from pg_roles r where r.rolname in ('anon', 'authenticated', 'authenticator', 'service_role') order by 1;
select (select array_to_string(s.setconfig, ',') from pg_db_role_setting s
          where s.setrole = 0 and s.setdatabase = (select oid from pg_database where datname = current_database())) as every_role_in_this_db,
       (select reset_val || coalesce(' ' || unit, '') from pg_settings where name = 'statement_timeout') as server_default_at_session_start;

-- (2) THE FROZEN COPIES (the first review's F1; the second's R5).
--     largest_copy_jsonb_chars / refused_at_211 — WORRIES: any copy over 54,333,333 characters of jsonb
--       text: 211 REFUSES such a share (its page reads "not available"; on a map the member is left
--       out). Ask the sharer to refresh the copy first.
--     over_1000000 — worth knowing: copies over 1,000,000 characters that 211 serves frozen.
--     snapshot_without_copy — shares whose mode is "snapshot" but that hold no copy (an older client
--       dropped a copy past its bound and kept the word). 210 and 211 both serve them LIVE, and 211 (as
--       cured, R5) gives them no freeze date. Know the count: each is a town its sharer believes frozen.
select count(*) filter (where jsonb_typeof(gallery_member_overrides #> '{$veil,snapshot}') = 'object') as frozen_copies,
       max(length((gallery_member_overrides #> '{$veil,snapshot}')::text))
         filter (where jsonb_typeof(gallery_member_overrides #> '{$veil,snapshot}') = 'object') as largest_copy_jsonb_chars,
       count(*) filter (where jsonb_typeof(gallery_member_overrides #> '{$veil,snapshot}') = 'object'
                          and length((gallery_member_overrides #> '{$veil,snapshot}')::text) > 1000000) as over_1000000,
       count(*) filter (where jsonb_typeof(gallery_member_overrides #> '{$veil,snapshot}') = 'object'
                          and length((gallery_member_overrides #> '{$veil,snapshot}')::text) > 54333333) as refused_at_211,
       count(*) filter (where gallery_member_overrides #>> '{$veil,mode}' = 'snapshot'
                          and jsonb_typeof(gallery_member_overrides #> '{$veil,mode}') = 'string'
                          and jsonb_typeof(gallery_member_overrides #> '{$veil,snapshot}') is distinct from 'object') as snapshot_without_copy
  from public.settlements
 where is_public or unlisted_slug is not null;

-- (3) IMPORTABLE SHARES IN SNAPSHOT MODE (the second review's R1). At 210 an importer of such a share
--     received the LIVE town; from 211 (as cured) the frozen copy, as the gallery page shows it.
--     WORRIES: none for 211; the count says how many shares change what an importer receives (toward
--     what the sharer froze), and how many handed over post-freeze content until now.
select count(*) as importable_snapshot_shares
  from public.settlements
 where is_public and gallery_importable
   and gallery_member_overrides #>> '{$veil,mode}' = 'snapshot';

-- (4) STORED MEMBER FLAGS THAT ARE NOT BOOLEANS (the second review's R9/R11; the chair's ruling).
--     The client writes only true or false; anything else was written by hand. At 210 a word the boolean
--     cast refuses ("maybe", an object) made the gallery, the link and the import RAISE, and "yes",
--     "t", "1" or "on" revealed the person. From 211 (as cured) only JSON true reveals or permits, and
--     nothing raises; with Reveal DM ON such a person is HIDDEN where 210 showed them.
--     WORRIES: none for safety (211 only ever hides more here). A count above zero names rows whose
--     pages change at 211 in the hide-more direction.
select count(*) filter (where jsonb_typeof(e.value -> 'revealDm') not in ('boolean', 'null')) as non_boolean_reveal_dm,
       count(*) filter (where jsonb_typeof(e.value -> 'allowImport') not in ('boolean', 'null')) as non_boolean_allow_import,
       count(distinct s.id) filter (where jsonb_typeof(e.value -> 'revealDm') not in ('boolean', 'null')
                                       or jsonb_typeof(e.value -> 'allowImport') not in ('boolean', 'null')) as rows_holding_one
  from public.settlements s, jsonb_each(case when jsonb_typeof(s.gallery_member_overrides) = 'object' then s.gallery_member_overrides else '{}' end) e
 where (s.is_public or s.unlisted_slug is not null)
   and e.key <> '$veil' and jsonb_typeof(e.value) = 'object';

-- (5) THE LARGEST COUNT OF MEMBER KEYS WITH THE FULL VIEW WITHHELD (revealDm false; the first review's F4).
--     WORRIES: over 1,000 (the client's write clamp: a row past it was written by hand). 211 works only on
--     keys that name a person in the town; the cost is reading the column once.
select max(n) as most_withheld_member_keys, count(*) filter (where n > 1000) as rows_over_1000
  from (select s.id, count(*) as n from public.settlements s, jsonb_each(s.gallery_member_overrides) e
         where jsonb_typeof(s.gallery_member_overrides) = 'object' and e.key <> '$veil'
           and jsonb_typeof(e.value) = 'object' and e.value -> 'revealDm' = 'false'::jsonb
           and (s.is_public or s.unlisted_slug is not null)
         group by s.id) q;

-- (6) THE LONGEST STORED LIST OF HIDDEN ADDRESSES ($veil.deltas).
--     WORRIES: over 2,000 (the client's clamp; both sides read only the last 2,000 well-formed ones).
select max(jsonb_array_length(gallery_member_overrides #> '{$veil,deltas}')) as longest_delta_list,
       count(*) filter (where jsonb_array_length(gallery_member_overrides #> '{$veil,deltas}') > 2000) as rows_over_2000
  from public.settlements
 where jsonb_typeof(gallery_member_overrides #> '{$veil,deltas}') = 'array'
   and (is_public or unlisted_slug is not null);

-- The content sections read every source a public read can serve, one row per source.
-- (7) HOUSES AND ANONYMOUS EVENTS, over the document, the copy and the narration (the first review's F5).
--     An event is ANONYMOUS when it has no non-empty string id and none of name, title or label reads
--     truthy in JavaScript: absent, null, false, "", and any number JavaScript reads as zero (0, -0.0,
--     0e5, 1e-400; tested by size, below 3e-324, a comparison that cannot leave numeric's range; the few
--     numbers between 2.48e-324 and 3e-324, which JS reads as its smallest double, are counted too, which
--     only raises the count). An event with no id key at all is anonymous (the earlier block's predicate
--     was NULL there and counted none).
--     WORRIES: over 1,000 houses or 1,000 anonymous events in one source: such rows already cost seconds
--     at 210 (the first review measured 4,000 houses at about 2 s on the gallery read before any veil).
with src as (
  select s.id, 'document' as source, s.data as j from public.settlements s where s.is_public or s.unlisted_slug is not null
  union all
  select s.id, 'copy', s.gallery_member_overrides #> '{$veil,snapshot}' from public.settlements s
   where (s.is_public or s.unlisted_slug is not null) and jsonb_typeof(s.gallery_member_overrides #> '{$veil,snapshot}') = 'object'
  union all
  select s.id, 'narration', s.ai_data -> 'aiSettlement' from public.settlements s
   where (s.is_public or s.unlisted_slug is not null) and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
)
select source,
       max(jsonb_array_length(case when jsonb_typeof(j -> 'institutions') = 'array' then j -> 'institutions' else '[]' end)) as most_houses,
       max((select count(*) from jsonb_array_elements(
              case when jsonb_typeof(j #> '{history,historicalEvents}') = 'array' then j #> '{history,historicalEvents}' else '[]' end
              || case when jsonb_typeof(j #> '{history,eventsTimeline}') = 'array' then j #> '{history,eventsTimeline}' else '[]' end) e
             where jsonb_typeof(e) = 'object'
               and not coalesce(jsonb_typeof(e -> 'id') = 'string' and e ->> 'id' <> '', false)
               and not exists (
                 select 1 from unnest(array['name', 'title', 'label']) k
                  where case jsonb_typeof(e -> k)
                          when 'string' then e ->> k <> ''
                          when 'number' then abs((e ->> k)::numeric) >= 3e-324
                          when 'boolean' then (e ->> k)::boolean
                          when 'object' then true
                          when 'array' then true
                          else false end))) as most_anonymous_events
  from src group by source order by source;

-- (8) NUMBERS AT THE TOP OF numeric's RANGE, and numeric ids and names, over the document, the copy and
--     the narration (the second review's R3; the first's F2 and F3).
--     at_or_past_1e130748 — the second review's own test (a superset: it starts a little below 2.47e130748,
--       where 211-as-reviewed overflowed). At 211-as-reviewed every read of such a town raised, its whole
--       map too; the lane's cure (R3) compares instead of multiplying, and its fuzz holds the parity law
--       (no read raises at 211 that serves at 210) to 1e131071 of both signs. WORRIES: any row: open
--       that town's gallery page, party link and map once 211 is applied, and roll back (the rollback
--       file first) if one does not load.
--     with_numeric_id / with_numeric_name_or_part / past_double — rows where 211 spells a number as
--       JavaScript does (the F2 cure; each such page is the 210 page). WORRIES: none; a count says
--       which rows the spelling touches.
with src as (
  select s.id, 'document' as source, s.data as j from public.settlements s where s.is_public or s.unlisted_slug is not null
  union all
  select s.id, 'copy', s.gallery_member_overrides #> '{$veil,snapshot}' from public.settlements s
   where (s.is_public or s.unlisted_slug is not null) and jsonb_typeof(s.gallery_member_overrides #> '{$veil,snapshot}') = 'object'
  union all
  select s.id, 'narration', s.ai_data -> 'aiSettlement' from public.settlements s
   where (s.is_public or s.unlisted_slug is not null) and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object'
)
select source,
       count(*) filter (where jsonb_path_exists(j, 'lax $.** ? (@.type() == "number" && (@ >= 1e130748 || @ <= -1e130748))')) as at_or_past_1e130748,
       count(*) filter (where jsonb_path_exists(j, 'lax $.**.id ? (@.type() == "number")')) as with_numeric_id,
       count(*) filter (where jsonb_path_exists(j, 'lax $.**.refId ? (@.type() == "number")')
                           or jsonb_path_exists(j, 'lax $.**.name ? (@.type() == "number")')
                           or jsonb_path_exists(j, 'lax $.**.title ? (@.type() == "number")')
                           or jsonb_path_exists(j, 'lax $.**.label ? (@.type() == "number")')
                           or jsonb_path_exists(j, 'lax $.**.parties[*] ? (@.type() == "number")')) as with_numeric_name_or_part,
       count(*) filter (where jsonb_path_exists(j, 'lax $.** ? (@.type() == "number" && (@ > 1.7976931348623157e308 || @ < -1.7976931348623157e308))')) as past_double
  from src group by source order by source;

-- (9) THE EDITOR'S WORKING STATE ON A REVEAL-DM SHARE (the third review's V3-1, COHERENCE-VEIL-4).
--     The editor's staged `decrees` and its `dmLayer` are never shared by the client, Reveal DM or not,
--     but the server's full reveal kept them: every public Reveal-DM share whose served source holds
--     either key sends it today, in the gallery response to any visitor and in the import response.
--     211 (as cured) strips both on the gallery read and the import, so from 211 no read sends them.
--     reveal_dm_listings_sending_editor_state — the third review's own count, verbatim: the shares that
--       211-as-reviewed would STILL have sent (unmarked, or "Pending decrees" opened).
--     reveal_dm_shares_sending_editor_state_today — every public Reveal-DM share sending either key now
--       (a key present counts, even an empty list; a superset: any source is counted, served or not).
--     WORRIES: above zero, those towns' staged decrees and DM layer have been readable by every visitor
--       until 211 lands; nothing to hold for (211 ends it), but the owner may tell the sharers.
select count(*) as reveal_dm_listings_sending_editor_state
  from public.settlements
 where is_public and gallery_share_dm
   and (jsonb_typeof(gallery_member_overrides -> '$veil') is distinct from 'object'
        or (gallery_member_overrides #> '{$veil,deltas}') @> '[{"address":"block:housekeeping.decrees","hidden":false}]')
   and (data ?| array['decrees','dmLayer'] or coalesce(ai_data -> 'aiSettlement', '{}') ?| array['decrees','dmLayer']
        or coalesce(gallery_member_overrides #> '{$veil,snapshot}', '{}') ?| array['decrees','dmLayer']);
select count(*) as reveal_dm_shares_sending_editor_state_today
  from public.settlements
 where is_public and gallery_share_dm
   and (data ?| array['decrees','dmLayer'] or coalesce(ai_data -> 'aiSettlement', '{}') ?| array['decrees','dmLayer']
        or coalesce(gallery_member_overrides #> '{$veil,snapshot}', '{}') ?| array['decrees','dmLayer']);

rollback;
