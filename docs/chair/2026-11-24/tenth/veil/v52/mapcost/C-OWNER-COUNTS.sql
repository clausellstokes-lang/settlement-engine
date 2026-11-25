-- MAP-COST (c) (VEIL-52; V28 (3)): FOR THE OWNER'S HAND, read-only, COUNTS ONLY (no name, slug, id or content leaves the database).
-- Public maps that share their campaign, and their member counts.
select count(*) as public_campaign_maps,
       max(n) as max_members,
       percentile_cont(0.5) within group (order by n) as median_members,
       count(*) filter (where n >= 20) as maps_with_20_or_more
  from (select jsonb_array_length(coalesce(coalesce(map_data -> 'campaign', map_data) -> 'settlementIds', '[]'::jsonb)) as n
          from public.saved_maps
         where is_public = true and share_kind = 'map_with_campaign' and gallery_share_campaign) m;
-- And the number of public settlement rows the gallery read joins (N115 / READ-COST's driver):
select count(*) as public_settlements from public.settlements where is_public = true;
