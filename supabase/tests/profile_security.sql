-- ────────────────────────────────────────────────────────────────────────────
-- profile_security.sql - Tier 0.6 server-side escalation prevention tests.
--
-- pgTAP assertions that run against a real Postgres + migration 009 to
-- prove every profile-escalation path is blocked. Client-side stubs in
-- tests/security/profile_escalation.test.js verify the JS surface; THIS
-- file verifies the database surface.
--
-- ── How to run ─────────────────────────────────────────────────────────────
--   Local (against the dockerized Supabase):
--     supabase start
--     supabase db reset             # apply every migration
--     supabase test db              # runs every .sql in supabase/tests/
--
--   CI (when a Postgres-test job is wired in a future phase):
--     pg_prove supabase/tests/profile_security.sql
--
-- ── How it works ───────────────────────────────────────────────────────────
-- The script wraps every assertion in a transaction it rolls back, so it
-- never leaves stray rows. It runs in three phases:
--
--   PHASE A - set up two test users (a regular user + a developer) by
--             inserting into auth.users and profiles directly. Requires
--             service-role privilege (which `supabase test db` provides).
--
--   PHASE B - switch to the regular user's authentication context using
--             auth.jwt-style claims, then attempt every escalation path
--             and assert it's rejected.
--
--   PHASE C - switch to a developer context and verify privileged RPCs
--             succeed for them but were blocked for the regular user.
--
-- The Node-side `tests/security/profile_security.contract.test.js`
-- file checks that this SQL contains every required assertion, so the
-- contract can't drift even when the runner isn't wired into CI.
-- ────────────────────────────────────────────────────────────────────────────

begin;

-- Plan: how many assertions this file makes.  Keep in sync with the
-- count in the Node-side contract test.
select plan(17);

-- ── Phase A: seed two test users ───────────────────────────────────────────
-- Service-role context (default during `supabase test db`).

-- Idempotent: clean up any prior runs.
delete from public.profiles where id in (
  '00000000-0000-0000-0000-0000000000a1',
  '00000000-0000-0000-0000-0000000000d1'
);

insert into public.profiles (id, role, tier, credits, is_founder, display_name)
values
  ('00000000-0000-0000-0000-0000000000a1', 'user',      'free',    10, false, 'Test User'),
  ('00000000-0000-0000-0000-0000000000d1', 'developer', 'premium', 100, false, 'Test Dev');

-- Helper to switch the JWT context. The set_config call mimics what
-- PostgREST does when it receives an authenticated request.
create or replace function _test_become(user_id uuid) returns void
language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', user_id::text, true);
  perform set_config('request.jwt.claims',
    jsonb_build_object('sub', user_id::text, 'role', 'authenticated')::text, true);
  perform set_config('role', 'authenticated', true);
end;
$$;

-- ── Phase B: regular-user escalation attempts (all should fail) ────────────

select _test_become('00000000-0000-0000-0000-0000000000a1');

-- 1. Direct role escalation must fail.
select throws_ok(
  $$ update public.profiles set role='developer' where id = auth.uid() $$,
  null, null,
  'direct UPDATE of profiles.role is rejected by the column-locked RLS policy'
);

-- 2. Direct tier upgrade must fail.
select throws_ok(
  $$ update public.profiles set tier='premium' where id = auth.uid() $$,
  null, null,
  'direct UPDATE of profiles.tier is rejected'
);

-- 3. Direct credit grant must fail.
select throws_ok(
  $$ update public.profiles set credits=99999 where id = auth.uid() $$,
  null, null,
  'direct UPDATE of profiles.credits is rejected'
);

-- 4. Direct founder grant must fail.
select throws_ok(
  $$ update public.profiles set is_founder=true where id = auth.uid() $$,
  null, null,
  'direct UPDATE of profiles.is_founder is rejected'
);

-- 5. Combined multi-column escalation must fail (no sneaking through by
--    bundling the columns together).
select throws_ok(
  $$ update public.profiles set role='admin', tier='premium', credits=999999, is_founder=true where id = auth.uid() $$,
  null, null,
  'combined multi-column escalation is rejected'
);

-- 6. update_display_name RPC accepts a valid name.
select is(
  public.update_display_name('Renamed Test User'),
  'Renamed Test User',
  'update_display_name RPC returns the trimmed value on success'
);

-- 7. update_display_name RPC enforces the length cap.
select throws_ok(
  $$ select public.update_display_name(repeat('x', 100)) $$,
  null, null,
  'update_display_name rejects names over 64 characters'
);

-- 8. spend_credits accepts a known feature and decrements atomically.
select is(
  (public.spend_credits('narrative')->>'ok')::boolean,
  true,
  'spend_credits returns ok=true when balance is sufficient'
);

-- 9. spend_credits drains balance correctly (10 - 3 = 7).
select is(
  (select credits from public.profiles where id = auth.uid()),
  7,
  'spend_credits debits exactly the cost (narrative=3, 10→7)'
);

-- 10. Repeated spends fail when balance dips below cost.
do $$
  begin
    -- Drain to 1, then attempt another narrative spend (cost=3).
    perform public.spend_credits('narrative'); -- 7 → 4
    perform public.spend_credits('narrative'); -- 4 → 1
  end;
$$;

select is(
  (public.spend_credits('narrative')->>'ok')::boolean,
  false,
  'spend_credits returns ok=false when balance < cost'
);

select is(
  public.spend_credits('narrative')->>'reason',
  'insufficient_funds',
  'spend_credits returns reason=insufficient_funds on failure'
);

-- 11. spend_credits rejects unknown features.
select throws_ok(
  $$ select public.spend_credits('not-a-feature') $$,
  null, null,
  'spend_credits raises on unknown feature key'
);

-- 12. Regular user CANNOT invoke admin_set_role.
select throws_ok(
  $$ select public.admin_set_role('00000000-0000-0000-0000-0000000000d1'::uuid, 'admin') $$,
  null, null,
  'admin_set_role rejects calls from non-privileged users'
);

-- 13. Regular user CANNOT invoke admin_grant_credits.
select throws_ok(
  $$ select public.admin_grant_credits('00000000-0000-0000-0000-0000000000a1'::uuid, 1000, 'self-grant attempt') $$,
  null, null,
  'admin_grant_credits rejects calls from non-privileged users'
);

-- ── Phase C: developer privileges work ─────────────────────────────────────

select _test_become('00000000-0000-0000-0000-0000000000d1');

-- 14. Developer CAN invoke admin_set_role.
select lives_ok(
  $$ select public.admin_set_role('00000000-0000-0000-0000-0000000000a1'::uuid, 'user') $$,
  'admin_set_role accepts a developer caller (idempotent no-op)'
);

-- 15. Developer's spend_credits returns elevated:true and skips debit.
select is(
  (public.spend_credits('narrative')->>'elevated')::boolean,
  true,
  'spend_credits returns elevated=true for developer role'
);

-- 16. Developer balance unchanged after spend (no debit).
select is(
  (select credits from public.profiles where id = auth.uid()),
  100,
  'developer balance is not debited by spend_credits (elevated path)'
);

-- ── Finish ────────────────────────────────────────────────────────────────

select * from finish();
rollback;
