-- ────────────────────────────────────────────────────────────────────────────
-- 150_surveyor_stage_kill_switch.sql — Surveyor S3: the PER-STAGE KILL-SWITCH
-- (DESIGN_AI_CONTROL_SURFACE §2b THE LAUNCH-WHOLE AMENDMENT).
--
-- WHY THIS EXISTS
--   Launch-whole converts the trust ladder from a shipping GATE into a MONITORING
--   framework: all stages ship, each behind a server-side kill-switch so the
--   operator can PAUSE any stage "without deploy" the moment its live metrics look
--   wrong. The safety mechanism was always the schema wall (typed ops → validation
--   → per-item approval), not the ladder — so this switch is an operational pause,
--   not a security boundary.
--
-- WHAT
--   • system_config 'surveyor_stage_switches' — a { "<stage>": <bool> } map. Seeded
--     idempotently with every current stage ENABLED (launch-whole default-on): a
--     stage is OFF only when an operator explicitly sets its flag false (a direct
--     config edit, like ai_spend_cap / surveyor_price_estimates — no writer RPC, so
--     there is no self-service path to flip another user's switch).
--   • surveyor_stage_enabled(p_stage) — the reader the EDGE consults before doing any
--     work. Returns the stage's stored boolean; an ABSENT stage key ⇒ true (a newly
--     added stage ships enabled). The edge FAILS CLOSED on the result: enabled ≠ true
--     ⇒ a §3d graceful refusal naming the switch, and (mirroring the entitlement gate)
--     an RPC error also reads as not-enabled ⇒ refuse. So an explicit OFF, or an
--     unreachable switch, both stop the stage — never a silent fall-through to serving.
--
-- SECURITY POSTURE
--   surveyor_stage_enabled is STABLE + SECURITY DEFINER, granted to authenticated
--   (the client may hide a paused stage's UI) AND service_role (the edge enforces).
--   It reads system_config only — no world data, no key material. The switch never
--   widens any gate; a DISABLED stage can only ever REFUSE.
--
-- Depends on: 002 (system_config). Re-runnable (on-conflict-do-nothing seed +
--   create-or-replace).
-- @rollback: drop function public.surveyor_stage_enabled(text); delete from public.system_config where key = 'surveyor_stage_switches';
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. the switch map (launch-whole: every stage ON; operator flips OFF to pause) ──
insert into public.system_config (key, value)
values (
  'surveyor_stage_switches',
  '{
     "_note": "Per-stage Surveyor kill-switch (§2b). true = live; set a stage false to PAUSE it server-side without a deploy. An absent stage key reads as enabled (launch-whole default-on). The edge fails CLOSED: not-enabled OR unreachable ⇒ a graceful refusal.",
     "analysis":  true,
     "brief":     true,
     "interpret": true,
     "parley":    true
   }'::jsonb
)
on conflict (key) do nothing;

-- ── 2. surveyor_stage_enabled(p_stage) — the edge's pre-work gate ───────────────
create or replace function public.surveyor_stage_enabled(p_stage text)
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_map  jsonb;
  v_flag jsonb;
  v_key  text;
begin
  v_key := nullif(btrim(coalesce(p_stage, '')), '');
  if v_key is null then return false; end if;   -- no stage named ⇒ nothing to enable
  select value into v_map from public.system_config where key = 'surveyor_stage_switches';
  if v_map is null then
    -- The config row is missing entirely (pre-seed / wiped). Launch-whole default-on:
    -- an unconfigured switch does not itself pause a stage (the edge's own
    -- entitlement + kill-switch-error handling still bound access).
    return true;
  end if;
  v_flag := v_map -> v_key;
  if v_flag is null then
    return true;   -- ABSENT stage key ⇒ a newly added stage ships enabled
  end if;
  -- Present: honour the stored boolean (anything non-boolean reads as NOT enabled).
  return jsonb_typeof(v_flag) = 'boolean' and (v_flag)::boolean;
end;
$$;

revoke all on function public.surveyor_stage_enabled(text) from public;
grant execute on function public.surveyor_stage_enabled(text) to authenticated;
grant execute on function public.surveyor_stage_enabled(text) to service_role;

comment on function public.surveyor_stage_enabled is
  'Per-stage Surveyor kill-switch reader (§2b). Returns the stage''s stored on/off flag (absent ⇒ enabled, launch-whole default-on). The edge fails CLOSED on the result — a paused stage can only refuse, never serve. Reads system_config only; never any world data or key.';
