-- R4-CURE 3 (VEIL-22), found by publicSafe PROPERTY re-stated (tooth (ii)): a person card's own `relationships[]` (the
-- stored record's per-card ties, published by a Reveal DM share: toPublicSafe full / _gallery_dm_full_json) keeps its
-- `to` as the STORED person id on a non-owner read; the re-key (212 :: _gallery_veil_rekey) does not follow that path.
delete from public.settlements where public_slug like 'rcrel-%';
insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
values ('5a170000-0000-0000-0000-0000000000b1','11111111-1111-1111-1111-111111111111','Harrowgate','town','{"name":"Harrowgate","tier":"town","npcs":[{"id":"n1","name":"Aldric","role":"Reeve","relationships":[{"to":"n2","type":"rival"}]},{"id":"n2","name":"Mara","role":"Priest"}]}'::jsonb,true,'rcrel-dm',now(),'rcrel-dm-link','unlisted','{"$veil":{"v":1,"mode":"curated","deltas":[]}}'::jsonb,true,true),
('5a170000-0000-0000-0000-0000000000b2','11111111-1111-1111-1111-111111111111','Harrowgate','town','{"name":"Harrowgate","tier":"town","npcs":[{"id":"n1","name":"Aldric","role":"Reeve","relationships":[{"to":"n2","type":"rival"}]},{"id":"n2","name":"Mara","role":"Priest"}]}'::jsonb,true,'rcrel-dmu',now(),'rcrel-dmu-link','unlisted','{}'::jsonb,true,true);
set test.uid = '';
select 'marked+DM gallery: ' || coalesce((select (g.data -> 'npcs')::text from public.get_gallery_dossier('rcrel-dm') g), 'null');
select 'unmarked+DM gallery: ' || coalesce((select (g.data -> 'npcs')::text from public.get_gallery_dossier('rcrel-dmu') g), 'null');
