-- ════════════════════════════════════════════════════════════════════════════════════════════
-- COHERENCE-VEIL-2: THE READ-ONLY CHECKS BEFORE MIGRATION 211 IS APPLIED (for the deploy step).
-- What the independent review (REVIEW-VEIL-211-ad17ec005, F6's last list) wanted known about the
-- hosted database. Every statement READS; the transaction is READ ONLY and is rolled back, so the
-- block can change nothing even if pasted whole. Run it in the hosted project's SQL editor as the
-- owner, BEFORE `supabase db push`. Each query says the number that would worry, and why.
-- Executed against a scratch PostgreSQL 16 cluster built from 001..211 with generated towns (the
-- lane's hand-back, part 3, records the run); never against a hosted database by any seat.
-- ════════════════════════════════════════════════════════════════════════════════════════════
begin transaction read only;
set local statement_timeout = '120s';

-- A "shared town" below: listed in the gallery or reachable by a party link.
-- (1) THE STATEMENT TIME LIMITS of the signed-out and signed-in roles (and the API's login role).
--     WORRIES: a limit for anon or authenticated under 3s. The heaviest request the wizard sends, every
--     eye shut, read at 211 in the lane's native measure (hand-back part 3) must fit with room: a
--     timed-out read shows "This settlement is not available." and cannot be told from a missing town.
select r.rolname, r.rolconfig,
       (select array_agg(s.setconfig) from pg_db_role_setting s where s.setrole = r.oid) as role_settings
  from pg_roles r where r.rolname in ('anon', 'authenticated', 'authenticator', 'service_role') order by 1;
select current_setting('statement_timeout') as session_default;

-- (2) THE LARGEST STORED FROZEN COPY (the review's F1), as jsonb text, and how many copies pass the
--     client's own bound (1,000,000 JS characters; jsonb text runs about 6% longer on real copies).
--     WORRIES: any copy over 54,333,333 (211's bound: such a share is REFUSED, its page "not
--     available"); also worth knowing, copies over 1,000,000 that 211 now serves frozen (210 served them
--     frozen too when their JS length was within 1,000,000).
select count(*) as frozen_copies,
       max(length((gallery_member_overrides #> '{$veil,snapshot}')::text)) as largest_copy_jsonb_chars,
       count(*) filter (where length((gallery_member_overrides #> '{$veil,snapshot}')::text) > 1000000) as over_1000000,
       count(*) filter (where length((gallery_member_overrides #> '{$veil,snapshot}')::text) > 54333333) as refused_at_211
  from public.settlements
 where jsonb_typeof(gallery_member_overrides #> '{$veil,snapshot}') = 'object';

-- (3) THE LARGEST COUNT OF MEMBER KEYS WITH THE FULL VIEW WITHHELD (revealDm:false; the review's F4).
--     WORRIES: over 1,000 (the client's write clamp: a row past it was written by hand). 211 works only
--     on the keys that name a person in the town, so a large count costs reading the column once.
select max(n) as most_withheld_member_keys, count(*) filter (where n > 1000) as rows_over_1000
  from (select s.id, count(*) as n from public.settlements s, jsonb_each(s.gallery_member_overrides) e
         where jsonb_typeof(s.gallery_member_overrides) = 'object' and e.key <> '$veil'
           and jsonb_typeof(e.value) = 'object' and e.value -> 'revealDm' = 'false'::jsonb
         group by s.id) q;

-- (4) THE LONGEST STORED LIST OF HIDDEN ADDRESSES ($veil.deltas).
--     WORRIES: over 2,000 (the client's clamp; both sides read only the last 2,000 well-formed ones).
select max(jsonb_array_length(gallery_member_overrides #> '{$veil,deltas}')) as longest_delta_list,
       count(*) filter (where jsonb_array_length(gallery_member_overrides #> '{$veil,deltas}') > 2000) as rows_over_2000
  from public.settlements
 where jsonb_typeof(gallery_member_overrides #> '{$veil,deltas}') = 'array';

-- (5) THE LARGEST COUNTS OF HOUSES AND OF ANONYMOUS EVENTS (no string id, no name, title or label
--     that reads truthy) in a shared town (the review's F5).
--     WORRIES: over 1,000 houses or 1,000 anonymous events: such rows already cost seconds at 210
--     (the review measured 4,000 houses at 1,988 ms on the gallery read before any veil).
select max(jsonb_array_length(case when jsonb_typeof(data -> 'institutions') = 'array' then data -> 'institutions' else '[]' end)) as most_houses,
       max((select count(*) from jsonb_array_elements(
              case when jsonb_typeof(data #> '{history,historicalEvents}') = 'array' then data #> '{history,historicalEvents}' else '[]' end
              || case when jsonb_typeof(data #> '{history,eventsTimeline}') = 'array' then data #> '{history,eventsTimeline}' else '[]' end) e
             where jsonb_typeof(e) = 'object'
               and not (jsonb_typeof(e -> 'id') = 'string' and e ->> 'id' <> '')
               and not exists (select 1 from unnest(array['name', 'title', 'label']) k
                                where e -> k is not null and e -> k not in ('null', 'false', '0', '""')))) as most_anonymous_events
  from public.settlements
 where is_public or unlisted_slug is not null;

-- (6) ANY SHARED TOWN HOLDING A NUMERIC ID OR NAME where the veil reads one (the review's F2 and F3),
--     and any number past double range anywhere in it.
--     WORRIES: none; 211 now spells these as the client does and never raises on them. A count above
--     zero says which rows the F2 cure touches (each such row's server id changed from 211-as-reviewed
--     to the client's own, so its page is the 210 page).
select count(*) filter (where jsonb_path_exists(data, 'lax $.**.id ? (@.type() == "number")')) as towns_with_numeric_id,
       count(*) filter (where jsonb_path_exists(data, 'lax $.**.refId ? (@.type() == "number")')
                           or jsonb_path_exists(data, 'lax $.**.name ? (@.type() == "number")')
                           or jsonb_path_exists(data, 'lax $.**.title ? (@.type() == "number")')
                           or jsonb_path_exists(data, 'lax $.**.label ? (@.type() == "number")')
                           or jsonb_path_exists(data, 'lax $.**.parties[*] ? (@.type() == "number")')) as towns_with_numeric_name_or_part,
       count(*) filter (where jsonb_path_exists(data, 'lax $.** ? (@.type() == "number" && (@ > 1.7976931348623157e308 || @ < -1.7976931348623157e308))')) as towns_with_number_past_double
  from public.settlements
 where is_public or unlisted_slug is not null;

rollback;
