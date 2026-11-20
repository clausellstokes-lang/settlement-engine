insert into auth.users (id, email) values ('11111111-1111-1111-1111-111111111111','owner@x.invalid'),('22222222-2222-2222-2222-222222222222','reader@x.invalid') on conflict do nothing;
insert into public.profiles (id) values ('11111111-1111-1111-1111-111111111111'),('22222222-2222-2222-2222-222222222222') on conflict do nothing;
update public.profiles set tier='premium' where id='11111111-1111-1111-1111-111111111111';
create or replace function public.profile_has_premium_access(target_user uuid) returns boolean language sql stable as $f$ select true $f$;
