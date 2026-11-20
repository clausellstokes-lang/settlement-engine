-- flows213.sql — the product paths 213 could reach that flows.sql does not (SEC-GRANTS-2). Each step prints its
-- outcome; the same file runs before and after 213 and the two outputs are compared. Everything is rolled back.
\set ON_ERROR_STOP 0
\set ON_ERROR_ROLLBACK on
\pset format unaligned
\pset tuples_only on
begin;
-- SIGN-UP: the auth admin inserts a user; handle_new_user (a DEFINER trigger) makes the profile and the welcome credit.
insert into auth.users (id, email) values ('55555555-5555-5555-5555-555555555555', 'signup@example.test');
select 'SIGNUP profile=' || count(*) from public.profiles where id = '55555555-5555-5555-5555-555555555555';
select 'SIGNUP account_number present=' || (account_number is not null) || ' external_name present=' || (external_name is not null) from public.profiles where id = '55555555-5555-5555-5555-555555555555';
select 'SIGNUP welcome credit rows=' || count(*) from public.credit_ledger where user_id = '55555555-5555-5555-5555-555555555555';
-- the browser's own support_messages insert (FeedbackWidget): the INVOKER trigger numbers it AS THE VISITOR
select set_config('request.jwt.claim.role', 'authenticated', true) is null, set_config('test.uid', '22222222-2222-2222-2222-222222222222', true) is null;
set local role authenticated;
insert into public.support_messages (user_id, email, subject, message) values ('22222222-2222-2222-2222-222222222222', 'probe@example.test', 'Feedback', 'hello') returning 'TICKET insert numbered=' || (ticket_number is not null);
select 'TICKET list_my_tickets rows=' || count(*) from public.list_my_tickets();
-- the user-token edge calls and the self-service doors
select 'EDGE(user) current_user_is_privileged=' || public.current_user_is_privileged();
select 'EDGE(user) has_surveyor_entitlement=' || public.has_surveyor_entitlement();
select 'EDGE(user) surveyor_settings_get ok' from (select public.surveyor_settings_get()) x;
select 'EDGE(user) my_transfer_case_status rows=' || count(*) from public.my_transfer_case_status();
select 'SELF credit balance own=' || public.get_credit_balance('22222222-2222-2222-2222-222222222222');
select 'SELF credit balance other -> ' || public.get_credit_balance('11111111-1111-1111-1111-111111111111');
select 'SELF welcome_credit_available=' || public.welcome_credit_available('22222222-2222-2222-2222-222222222222');
select 'SELF security answers -> ' || coalesce(public.set_my_security_answers('q1', 'a', 'q2', 'b')::text, 'ok');
select 'SELF display name -> ' || coalesce(public.update_display_name('Probe Name')::text, 'ok');
select 'SELF account_is_active(self)=' || public.account_is_active('22222222-2222-2222-2222-222222222222');
reset role;
-- a REFERRAL by account number (record_referral_intent asks about ANOTHER user, the referrer 1111)
update public.profiles set account_number = 'SF-PROBE01' where id = '11111111-1111-1111-1111-111111111111';
set local role authenticated;
select 'REFERRAL record_referral_intent -> ' || (public.record_referral_intent('SF-PROBE01') ->> 'ok') || ' ' || coalesce(public.record_referral_intent('SF-PROBE01') ->> 'reason', '');
reset role;
-- the FOUNDERS ROLL as anon and as a signed-in visitor (founders_roll asks about EVERY listed founder)
update public.profiles set is_founder = true, founder_credit_listed = true, external_name = 'Probe Founder' where id = '11111111-1111-1111-1111-111111111111';
select set_config('request.jwt.claim.role', 'anon', true) is null, set_config('test.uid', '', true) is null;
set local role anon;
select 'FOUNDERS anon roll rows=' || count(*) from public.founders_roll();
reset role;
select set_config('request.jwt.claim.role', 'authenticated', true) is null, set_config('test.uid', '22222222-2222-2222-2222-222222222222', true) is null;
set local role authenticated;
select 'FOUNDERS authenticated roll rows=' || count(*) from public.founders_roll();
reset role;
-- the SERVICE ROLE (the AI edge's gate, the money paths) and a NO-JWT backend call (pg_cron, migrations)
select set_config('request.jwt.claim.role', 'service_role', true) is null, set_config('test.uid', '', true) is null;
set local role service_role;
select 'SERVICE account_is_active(2222)=' || public.account_is_active('22222222-2222-2222-2222-222222222222');
select 'SERVICE get_credit_balance(2222)=' || public.get_credit_balance('22222222-2222-2222-2222-222222222222');
select 'SERVICE civility_blocked=' || public.civility_blocked('hello there');
select 'SERVICE sanitize ok' from (select public._gallery_sanitize_public_json('{}'::jsonb, array[]::text[])) x;
reset role;
select set_config('request.jwt.claim.role', '', true) is null;
select 'NOJWT account_is_active(2222)=' || public.account_is_active('22222222-2222-2222-2222-222222222222');
select 'NOJWT get_credit_balance(2222)=' || public.get_credit_balance('22222222-2222-2222-2222-222222222222');
-- the VISITOR reaching the helpers directly (expected to change: §4) and account_is_active about another user
select set_config('request.jwt.claim.role', 'anon', true) is null, set_config('test.uid', '', true) is null;
set local role anon;
select 'ANON account_is_active(2222)=' || public.account_is_active('22222222-2222-2222-2222-222222222222');
select 'ANON civility_blocked -> ' || public.civility_blocked('hello there');
select 'ANON world snapshot check (map trigger helper) -> ' || public._gallery_world_snapshot_is_safe('{}'::jsonb);
reset role;
select set_config('request.jwt.claim.role', 'authenticated', true) is null, set_config('test.uid', '11111111-1111-1111-1111-111111111111', true) is null;
set local role authenticated;
select 'AUTH(1111) account_is_active(2222)=' || public.account_is_active('22222222-2222-2222-2222-222222222222');
select 'AUTH mask_email -> ' || public.mask_email('someone@example.test');
reset role;
rollback;
