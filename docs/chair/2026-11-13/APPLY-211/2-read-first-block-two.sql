-- REVIEW-VEIL-5 — the reads the review adds to the owner's step for migration 211 ALONE. READ ONLY: the transaction
-- refuses any write, and it ends in ROLLBACK. Run it in the SQL editor BESIDE the lane's own block
-- (docs/chair/2026-11-12/veil-probe-2/predeploy-readonly.sql on lane/coherence-veil-2026-11-11), before the act.
begin transaction read only;

-- (A) HOLD if above zero: party links that would come back to life. At 203 a link answers only while
--     visibility = 'unlisted'; 211 answers on the slug alone. Revoke each such link first.
select count(*) as links_that_would_revive
  from public.settlements where unlisted_slug is not null and visibility <> 'unlisted';

-- (B) For your decision, not a hold: shares whose sharer OPENED something the default veil hides. The response keeps
--     it open; the DEPLOYED page hides it again until the new client ships (it re-imposes its defaults, because the
--     served share no longer carries the sharer's list). This is the number of pages that will show LESS than their
--     sharer chose, for as long as 211 runs ahead of the release.
select count(distinct s.id) as shares_whose_page_will_hide_what_its_sharer_opened
  from public.settlements s,
       jsonb_array_elements(case when jsonb_typeof(s.gallery_member_overrides #> '{$veil,deltas}') = 'array'
                                 then s.gallery_member_overrides #> '{$veil,deltas}' else '[]' end) e
 where s.is_public and e -> 'hidden' = 'false'::jsonb;

-- (C) For your information: what 211 protects from the moment it is applied.
select count(*) filter (where s.gallery_member_overrides ? '$veil') as shares_with_a_veil,
       count(*) filter (where jsonb_typeof(s.gallery_member_overrides #> '{$veil,deltas}') = 'array'
                          and jsonb_array_length(s.gallery_member_overrides #> '{$veil,deltas}') > 0) as shares_with_a_hand_set_veil,
       count(*) filter (where s.gallery_member_overrides #>> '{$veil,mode}' = 'snapshot') as frozen_shares,
       count(*) filter (where s.unlisted_slug is not null) as party_links
  from public.settlements s where s.is_public or s.unlisted_slug is not null;

-- (D) What 211 does NOT close, counted (each is as it is today; none is made worse):
--     d1  shares exported before the veil (unmarked), Reveal DM on, with a person hidden by the per-person switch:
--         that person's full card is still sent inside the power roster's copy (the review's 1.5);
--     d2  Reveal-DM shares whose town carries the author's custom-content records, which no page shows and the
--         gallery read and the import still send (the review's 1.4);
--     d3  shares that hide a tie by hand and carry a `prominentRelationship` or a `pressureSentence`: the upper bound
--         of the shares where a hidden tie's words may still travel under those keys (the review's 1.3);
--     d4  shares whose town has an economy chain: the upper bound for a hidden house named in a chain (1.3).
select
  (select count(*) from public.settlements s
    where s.is_public and s.gallery_share_dm and not (coalesce(s.gallery_member_overrides, '{}'::jsonb) ? '$veil')
      and exists (select 1 from jsonb_each(s.gallery_member_overrides) e where e.value -> 'revealDm' = 'false'::jsonb)) as d1_unmarked_reveal_shares_with_a_person_hidden,
  (select count(*) from public.settlements s
    where s.is_public and s.gallery_share_dm and (s.data ? 'customContentRoster' or s.data ? 'customContentProvenance')) as d2_reveal_shares_sending_custom_content,
  (select count(distinct s.id) from public.settlements s,
          jsonb_array_elements(case when jsonb_typeof(s.gallery_member_overrides #> '{$veil,deltas}') = 'array'
                                    then s.gallery_member_overrides #> '{$veil,deltas}' else '[]' end) e
    where (s.is_public or s.unlisted_slug is not null) and e -> 'hidden' = 'true'::jsonb
      and (e ->> 'address' like 'field:relationship:%' or e ->> 'address' like 'card:relationship:%' or e ->> 'address' like 'class:relationship:%')
      and (s.data ? 'prominentRelationship' or s.data ? 'pressureSentence')) as d3_shares_hiding_a_tie_with_a_second_home,
  (select count(*) from public.settlements s
    where (s.is_public or s.unlisted_slug is not null) and s.gallery_member_overrides ? '$veil'
      and jsonb_typeof(s.data #> '{economicState,activeChains}') = 'array' and jsonb_array_length(s.data #> '{economicState,activeChains}') > 0) as d4_veiled_shares_with_economy_chains;

rollback;
