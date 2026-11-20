-- test values only: user 2222 gets a Surveyor entitlement and premium, then sets a fake key.
insert into public.surveyor_entitlements (user_id, status, source) values ('22222222-2222-2222-2222-222222222222', 'active', 'grant') on conflict do nothing;
update public.profiles set tier = 'premium' where id in ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111');
begin; select set_config('test.uid', '22222222-2222-2222-2222-222222222222', false) is null; select set_config('request.jwt.claim.role', 'authenticated', false) is null; set role authenticated;
select 'planted=' || public.surveyor_byok_set('anthropic', 'sk-FAKE-TEST-KEY-123');
reset role; select set_config('request.jwt.claim.role', '', false) is null; commit;
