-- 028_gallery_image_storage.sql
-- §3 — Storage for gallery cover images.
--
-- Provisions a PUBLIC-READ bucket `gallery-images` where every owner writes
-- only under their own uid folder (path layout: `{uid}/{file}`). The client
-- (src/lib/imageUpload.js) uploads the cropped landscape JPEG here and stores
-- the resulting public URL in settlements.gallery_image_url (already exists —
-- no settlements schema change needed).
--
-- Deploy: this must be applied (npx supabase db push) and the bucket confirmed
-- BEFORE the §3 client ships, or cover uploads will fail with a "bucket
-- missing" error. If the policy statements below error with "must be owner of
-- table objects" on your instance, create the bucket + the same four policies
-- from the Supabase dashboard (Storage → New bucket → public; then the SQL
-- editor for the policies) — Storage RLS is sometimes owner-restricted.

-- 1) The bucket: public read, 8 MB cap, image MIME allowlist (defense in depth
--    on top of the client-side validateImageFile check).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery-images',
  'gallery-images',
  true,
  8388608, -- 8 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2) RLS policies on storage.objects, scoped to this bucket.

-- Anyone may READ (the bucket is public; this also covers the public gallery).
drop policy if exists "gallery images are publicly readable" on storage.objects;
create policy "gallery images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'gallery-images');

-- Authenticated users may UPLOAD only into their own uid folder. The owner
-- column isn't set yet at insert time, so we gate on the first path segment.
drop policy if exists "users upload own gallery images" on storage.objects;
create policy "users upload own gallery images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'gallery-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Owners may REPLACE their own objects (upsert path / re-crop).
drop policy if exists "users update own gallery images" on storage.objects;
create policy "users update own gallery images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery-images' and owner = auth.uid())
  with check (
    bucket_id = 'gallery-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Owners may DELETE their own objects (Remove / replace cleanup).
drop policy if exists "users delete own gallery images" on storage.objects;
create policy "users delete own gallery images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery-images' and owner = auth.uid());
