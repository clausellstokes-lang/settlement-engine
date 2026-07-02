-- 094_definer_search_path_pg_temp.sql
--
-- Search-path hardening for the older SECURITY DEFINER functions.
--
-- Background: a SECURITY DEFINER function runs with the owner's privileges, so
-- its `search_path` is a trust boundary — if an attacker can create a temp
-- object that shadows an unqualified name the function references, they can
-- redirect it. The canonical hardening is to pin `pg_temp` LAST in the path so a
-- temp object can never shadow a real `public` object. The newer money/AI/auth
-- functions (079/086/087/066…) already declare `set search_path = public, pg_temp`;
-- many EARLIER definer functions (007 get_credit_balance, 009/012/014/015/017…)
-- declared a bare `set search_path = public`, leaving `pg_temp` unpinned. On
-- Supabase this is low-risk (no untrusted role can create the shadowing object on
-- our schema), so this is an inconsistency to CLOSE, not an active exploit — but
-- it should be closed.
--
-- Approach (deliberately conservative + provably non-breaking): only functions
-- whose search_path is EXACTLY the bare `public` are touched, and they are only
-- AMENDED to append `, pg_temp`. Appending `pg_temp` LAST never changes how a
-- `public` object resolves, so this cannot alter behavior. Functions that already
-- pin pg_temp, or that intentionally include another schema (e.g. `public, pg_temp,
-- auth`), are left untouched — so a function relying on `auth`/`extensions` in its
-- path is never narrowed. ALTER FUNCTION ... SET does NOT recreate the body, so the
-- net-current lineage of every recreated function is unaffected.
--
-- Idempotent: after this runs, a touched function's path is `public, pg_temp`, which
-- no longer matches the bare-`public` predicate, so a re-run is a no-op. Safe to
-- re-apply. Creates no new object.

do $$
declare
  r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef                                   -- SECURITY DEFINER only
      and exists (
        select 1
        from unnest(coalesce(p.proconfig, '{}'::text[])) as c(entry)
        -- whitespace-insensitive exact match on a BARE public search_path
        where lower(regexp_replace(c.entry, '\s', '', 'g')) = 'search_path=public'
      )
  loop
    execute format('alter function %s set search_path = public, pg_temp', r.sig);
  end loop;
end $$;
