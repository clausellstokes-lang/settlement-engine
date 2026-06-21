-- ────────────────────────────────────────────────────────────────────────────
-- 061_lock_profile_moderation_columns.sql — close the profiles self-UPDATE
-- moderation-column gap left open by 059 (adversarial finding on 059's
-- "Users update own profile (safe preferences only)" policy, 059:124-137).
--
-- THE GAP 059 LEFT OPEN
--   059 recreated the profiles self-UPDATE policy with the FULL 018 column lock
--   (role / tier / credits / is_founder / stripe_customer_id / email pinned to
--   current) PLUS the account_is_active() conjunct. But it did NOT pin the three
--   MODERATION columns added by 053/054 — banned_at / disabled_at / deleted_at.
--   So a still-ACTIVE account (the gate has not tripped yet) can self-UPDATE its
--   OWN moderation timestamps via the direct PostgREST path
--   (`.from('profiles').update({ banned_at: '...', disabled_at: '...',
--   deleted_at: '...' })`): a self-DoS (lock itself out / mark itself deleted) and,
--   worse, moderation-state POLLUTION — an account could stamp/clear these columns
--   out from under the admin tooling (053 set_account_banned / set_account_disabled,
--   054 soft-delete processor) that is the SOLE legitimate writer. account_is_active()
--   reads exactly these three columns, so letting a user write them lets a user steer
--   its own trust-boundary state. (Setting them does not lock the user out of THIS
--   statement: the WITH CHECK runs against account_is_active() of the PRE-write row,
--   and even fail-closed, RLS-filtered writes silently no-op rather than pin the
--   column — the row still mutates whatever a permissive policy admits.)
--
-- THE FIX
--   Recreate ONE profiles self-UPDATE policy (drop-if-exists + create, re-runnable),
--   carrying the 059 body VERBATIM and ADDING three WITH CHECK conjuncts that pin
--   banned_at / disabled_at / deleted_at to their current values
--   (`is not distinct from (select … from public.profiles where id = auth.uid())`,
--   the SAME null-safe shape 059 uses for the other locked columns — so a NULL→NULL
--   no-op passes and any change is rejected). After 061 these columns are writable
--   ONLY by the admin / processor paths:
--     • 053 set_account_banned / set_account_disabled (SECURITY DEFINER, RLS-exempt),
--     • 054 process_deletions soft-delete processor (service_role, RLS-exempt),
--     • the 033 "Developers update any profile" admin policy (LEFT UNCHANGED).
--   The redundant LAYER-2 trigger from 059 (trg_enforce_account_active_profiles) is
--   untouched and still fires; this migration tightens the LAYER-1 RLS column lock.
--
-- FORWARD migration: 059 is NOT edited. This drops + recreates the policy by name.
--
-- Re-runnable: DROP POLICY IF EXISTS + CREATE. No behavior change for a legitimate
-- self-update (display_name still freely editable); the new conjuncts are a no-op
-- when the moderation columns are unchanged (the only legitimate self-update case).
-- Depends on: 059 (the self-UPDATE policy + account_is_active gate), 053 (banned_at /
--             disabled_at), 054 (deleted_at), 018 (the column-lock body), 057
--             (account_is_active).
-- ────────────────────────────────────────────────────────────────────────────

drop policy if exists "Users update own profile (display_name only)" on public.profiles;
drop policy if exists "Users update own profile (safe preferences only)" on public.profiles;
create policy "Users update own profile (safe preferences only)"
  on public.profiles
  for update
  using (auth.uid() = id and public.account_is_active(auth.uid()))
  with check (
    auth.uid() = id
    and public.account_is_active(auth.uid())
    and role               is not distinct from (select role               from public.profiles where id = auth.uid())
    and tier               is not distinct from (select tier               from public.profiles where id = auth.uid())
    and credits            is not distinct from (select credits            from public.profiles where id = auth.uid())
    and is_founder         is not distinct from (select is_founder         from public.profiles where id = auth.uid())
    and stripe_customer_id is not distinct from (select stripe_customer_id from public.profiles where id = auth.uid())
    and email              is not distinct from (select email              from public.profiles where id = auth.uid())
    -- 061: pin the MODERATION columns so a self-UPDATE can never set/clear its own
    -- account-status flags (banned_at/disabled_at/deleted_at) — writable ONLY via the
    -- admin (053) / soft-delete processor (054) RLS-exempt paths.
    and banned_at          is not distinct from (select banned_at          from public.profiles where id = auth.uid())
    and disabled_at        is not distinct from (select disabled_at        from public.profiles where id = auth.uid())
    and deleted_at         is not distinct from (select deleted_at         from public.profiles where id = auth.uid())
  );
