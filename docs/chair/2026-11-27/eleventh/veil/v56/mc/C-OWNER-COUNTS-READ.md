# MC (VEIL-56), WORK 5: VEIL-52's `C-OWNER-COUNTS.sql` READ AGAINST THE CHAIN AS IT STANDS: STILL RIGHT, with two notes

Written 2026-11-27T23:54:32Z (date -u). READ ONLY (PLAUSIBLE: no part of it was run against anything but nothing; it is the owner's hand). The
file at `origin/lane/veil-52-2026-11-24:docs/chair/2026-11-24/tenth/veil/v52/mapcost/C-OWNER-COUNTS.sql` was read whole and
held against `get_gallery_map` on origin/master (`supabase/migrations/088_share_gallery_maps_campaigns.sql`, db832c892), on the
lane tip (211's, dbd4cd9e5) and in unit 3 (212, 2f849aa53), and against `_gallery_public_tile_rows` (147). NOTHING CHANGED.

1. **THE MAPS' SELECTION IS THE READ's.** All three `get_gallery_map` serve members only where the map is `is_public`, its
   `share_kind = 'map_with_campaign'` and `gallery_share_campaign`; the member list is
   `coalesce(map_data -> 'campaign', map_data) -> 'settlementIds'`. The query's filter and its `n` are the same, term for term.
   No migration of the veil (211, 212, 213) adds, drops or renames a column it reads. RIGHT.
2. **IT COUNTS LISTED IDS, NOT SERVED MEMBERS: AN UPPER BOUND.** The read serves a listed id only where the row exists, is the
   map owner's own (`s.user_id = row.user_id`, the 046 guard), `access_state = 'active'`, and (211, 212) is not a frozen copy past
   the bound; an id listed twice is served once (`in (...)`). So `max_members` and the median are at or above what any read
   pays. For sizing the cure that is the safe side. RIGHT, as an upper bound.
3. **NOTE (not changed): A MAP WHOSE `settlementIds` IS NOT AN ARRAY STOPS THE WHOLE QUERY.** `jsonb_array_length` raises on a
   scalar or an object, and `settlementIds` is owner-written free-form jsonb. The read itself would raise on such a map too, so
   such a map serves nothing today; but one of them makes the count fail with an error, not answer. If the owner's run errors
   so, the form that skips it is `case when jsonb_typeof(x) = 'array' then jsonb_array_length(x) end` (the ruling is the chair's;
   this seat changes nothing).
4. **NOTE (not changed): THE THRESHOLD THAT MATTERS NOW IS LOWER THAN 20.** LIMITS.md: on this machine, unit 3's map passes a
   visitor's 3 s at about 6 average members and a signed-in 8 s at about 17. `maps_with_20_or_more` answers the 8 s question
   only; `count(*) filter (where n > 5)` would answer the visitor's. A choice for the chair, not a fault.
5. **THE SECOND QUERY IS READ-COST's DRIVER EXACTLY.** `_gallery_public_tile_rows()` (147, unchanged by 211/212; 212's
   `get_gallery_dossier` still joins it whole) selects `where s.is_public = true`, and so does the count. RIGHT.
6. **IT NAMES NOTHING.** Counts, a max and a median only: no name, slug, id or content leaves the database. Read-only.
