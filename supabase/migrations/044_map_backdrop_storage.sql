-- 044_map_backdrop_storage.sql
-- Storage for CUSTOM MAP BACKDROP images (Project 1 — custom map import).
--
-- Provisions a PUBLIC-READ bucket `map-backdrops` where every owner writes only
-- under their own uid folder (`{uid}/{file}`). The client (src/lib/imageUpload.js
-- uploadMapBackdrop) uploads a downscaled image here and stores the public URL in
-- campaign.mapState.customBackdrop.imageUrl (rides in saved_maps.map_data — no
-- schema change). Public-read mirrors gallery-images (migration 028) so a map
-- shared via the gallery (Project 2) is viewable; the path is opaque + uid-scoped.
--
-- Deploy: apply BEFORE the client ships, or backdrop uploads fail "bucket
-- missing". If the policy statements error with "must be owner of table objects",
-- create the bucket + the same four policies from the Supabase dashboard.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'map-backdrops',
  'map-backdrops',
  true,
  8388608, -- 8 MB (matches MAX_IMAGE_BYTES; client downscales first)
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "map backdrops are publicly readable" on storage.objects;
create policy "map backdrops are publicly readable"
  on storage.objects for select
  using (bucket_id = 'map-backdrops');

drop policy if exists "users upload own map backdrops" on storage.objects;
create policy "users upload own map backdrops"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'map-backdrops'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users update own map backdrops" on storage.objects;
create policy "users update own map backdrops"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'map-backdrops' and owner = auth.uid())
  with check (
    bucket_id = 'map-backdrops'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users delete own map backdrops" on storage.objects;
create policy "users delete own map backdrops"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'map-backdrops' and owner = auth.uid());
