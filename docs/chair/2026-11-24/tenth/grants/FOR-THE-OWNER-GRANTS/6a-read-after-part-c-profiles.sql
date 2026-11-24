-- READS ONLY, after file 3. Every column of public.profiles, and whether a signed-in user may UPDATE it.
-- Expected: exactly four true (avatar_url, email_notifications, model_preference, public_identity_opt_in).
-- On the hosted platform a revoke removes only what the revoking role granted: this read is the proof.
select column_name, has_column_privilege('authenticated', 'public.profiles', column_name, 'UPDATE') as signed_in_may_update
  from information_schema.columns where table_schema = 'public' and table_name = 'profiles' order by ordinal_position;
