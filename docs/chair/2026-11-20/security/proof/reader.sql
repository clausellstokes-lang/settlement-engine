-- reader.sql — the security reader's two calls (V10-8), as anon and as authenticated.
\set ON_ERROR_STOP 0
\set ON_ERROR_ROLLBACK on
\pset format unaligned
\pset tuples_only on
begin; select set_config('test.uid', '', false) is null; select set_config('request.jwt.claim.role', 'anon', false) is null; set role anon;
select 'anon _surveyor_byok_secret() = ' || public._surveyor_byok_secret();
rollback;
begin; select set_config('request.jwt.claim.role', 'anon', false) is null; set role anon;
select 'anon surveyor_byok_get(2222) = ' || public.surveyor_byok_get('22222222-2222-2222-2222-222222222222', 'anthropic')::text;
rollback;
begin; select set_config('test.uid', '11111111-1111-1111-1111-111111111111', false) is null; select set_config('request.jwt.claim.role', 'authenticated', false) is null; set role authenticated;
select 'authenticated(1111) _surveyor_byok_secret() = ' || public._surveyor_byok_secret();
rollback;
begin; select set_config('test.uid', '11111111-1111-1111-1111-111111111111', false) is null; select set_config('request.jwt.claim.role', 'authenticated', false) is null; set role authenticated;
select 'authenticated(1111) surveyor_byok_get(2222) = ' || public.surveyor_byok_get('22222222-2222-2222-2222-222222222222', 'anthropic')::text;
rollback;
