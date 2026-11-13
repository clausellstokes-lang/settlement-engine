begin transaction read only;
select count(distinct s.id) as shares_hiding_a_relationship_by_hand,
       count(*) as hand_hides
  from public.settlements s,
       jsonb_array_elements(case when jsonb_typeof(s.gallery_member_overrides #> '{$veil,deltas}') = 'array'
                                 then s.gallery_member_overrides #> '{$veil,deltas}' else '[]' end) e
 where (s.is_public or s.unlisted_slug is not null)
   and e -> 'hidden' = 'true'::jsonb
   and (e ->> 'address' like 'field:relationship:%' or e ->> 'address' like 'card:relationship:%');
rollback;
