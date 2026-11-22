-- 111_pin_definer_search_path.sql
--
-- Pin the search_path of three functions introduced AFTER 094's one-time hardening
-- pass, which created them with a bare `set search_path = public` — missing the
-- `pg_temp` pin 094 applied to every then-existing function.
--
-- WHY
--   A function's search_path is a trust boundary. With a bare `public`, an attacker
--   who can place an object in `pg_temp` (which resolves AHEAD of `public` by default)
--   could shadow a table/function the body references and have their object run in the
--   function's context. Pinning to `public, pg_temp` — with pg_temp LAST — makes temp
--   objects unable to shadow the intended `public` ones. Two of these are SECURITY
--   DEFINER money functions (service_adjust_credits / service_set_credits, from 103 —
--   highest stakes); _gallery_sanitize_public_json (from 099) is a plain helper, but it
--   runs INSIDE the SECURITY DEFINER gallery-publish callers, so its bare search_path is
--   live in a definer context too. All three were missed by 094 because they postdate it.
--
-- WHAT
--   ALTER the three to `public, pg_temp`. This is config-only — the function bodies are
--   untouched, so it is transparent to every caller and byte-neutral to behavior — the
--   same posture 094 established. No GRANT/REVOKE changes (those are already correct on
--   these functions).
--
-- @rollback: ALTER each back to `set search_path = public` — NOTE that reinstates the
--   bare search_path 094 exists to prevent; roll back only to unblock a broken deploy,
--   then re-pin.

alter function public.service_adjust_credits(uuid, uuid, integer, text)
  set search_path = public, pg_temp;

alter function public.service_set_credits(uuid, uuid, integer, text)
  set search_path = public, pg_temp;

alter function public._gallery_sanitize_public_json(jsonb, text[])
  set search_path = public, pg_temp;
