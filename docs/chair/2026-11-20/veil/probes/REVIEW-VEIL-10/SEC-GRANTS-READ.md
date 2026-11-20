# REVIEW-VEIL-10: cold read of SEC-GRANTS's emergency script (6c389a2ee, tip 8bfca18bf), 2026-11-20T02:06:23Z

Chain: origin/master's migrations 001..203 (`xm`, REVIEW-VEIL-6's chain.sh; the scaffold's Supabase default privileges); the
script applied on a clone (`xmr`).

1. Signatures: 157 of 157 exist on master's chain, all SECURITY DEFINER, all owned by postgres.
2. Applied twice (`psql -v ON_ERROR_STOP=1 -f EMERGENCY_REVOKE.sql`): exit 0 both; EMERGENCY_CHECK.sql afterwards: first
   result 0 rows; both key functions anon f, authenticated f, grants {postgres, service_role}.
3. Breakage: pg_depend: NO policy, trigger, default, view, constraint or index depends on any of the 157. Bodies: the only
   INVOKER-or-trigger caller of any of them is `handle_new_user` (sign-up; DEFINER trigger, runs as postgres: unaffected)
   calling gen_account_number, gen_external_name. config.toml's auth hooks are commented out; no name is a hook. Every
   rpc() call site of the 157 in src/, api/ and supabase/functions/ (169 sites): only edge functions, each through a
   client built with SUPABASE_SERVICE_ROLE_KEY (makeAdminClient / adminClient / createClient(url, serviceKey)); none in
   src/ or api/. pg_cron jobs run as postgres (owner): unaffected.
4. NOT CLOSED, executed as anon on `xmr` after the script: `set_curated`, `set_featured` (and `set_featured_map`, same body)
   test `caller_role not in ('developer','admin')`; with no profile row (anon: auth.uid() null) caller_role is NULL, the
   test is NULL, nothing is raised: anon curated AND featured another user's public town (before f|f, after t|t). The
   catalogue classed them "DELIBERATE DOOR, auth.uid()" from an "ERR Settlement not found" on an empty table.
   ADD (proven): `revoke execute on function public.set_curated(uuid,boolean,integer), public.set_featured(uuid,boolean,integer),
   public.set_featured_map(uuid,boolean,integer) from public, anon;` → anon: permission denied; a plain signed-in user:
   "Only admins can change curation status"; the developer: curated (the admin page is signed in).
   Also open: `account_is_active(uuid)` (anon: true/false for any user id; an oracle, read-only); `get_credit_balance`
   has the same NULL-uid skip but anon holds no grant.
5. Text: EMERGENCY_REVOKE.sql's header says the check's "second section" lists missing signatures; OWNER_NOTE.md (and the
   check's output) put them in the FIRST result. One of the two words should change; the owner follows OWNER_NOTE.md.
