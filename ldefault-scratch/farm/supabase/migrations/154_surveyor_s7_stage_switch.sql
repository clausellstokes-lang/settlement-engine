-- ────────────────────────────────────────────────────────────────────────────
-- 154_surveyor_s7_stage_switch.sql — Surveyor S7: seed the AUTONOMY stage into the
-- PER-STAGE KILL-SWITCH map (DESIGN_AI_CONTROL_SURFACE §2b).
--
-- WHY THIS EXISTS
--   150 introduced surveyor_stage_switches + surveyor_stage_enabled(); 152 seeded the
--   S4–S6 write stages. Launch-whole ships every stage behind its own server-side
--   kill-switch. The S7 'autonomy' stage (the compose step of the autonomy composer —
--   the deterministic advance itself never leaves the client engine) reads as ENABLED
--   by default even without a seeded key (surveyor_stage_enabled returns true for an
--   absent key), but seeding it gives the operator an EXPLICIT switch to pause it
--   without a deploy.
--
-- WHAT
--   Merges the new key (=true) into the existing surveyor_stage_switches map,
--   NON-CLOBBERING: `new_defaults || existing` — the RIGHT operand wins in jsonb ||, so
--   an operator's prior OFF setting survives, and the new key lands only where absent.
--   Idempotent (re-running is a no-op merge). If the row is somehow missing, inserts a
--   fresh full map.
--
-- SECURITY POSTURE
--   system_config edit only; no function/grant change. The switch never widens any
--   gate; a DISABLED stage can only ever REFUSE (the edge fails closed on the reader).
--
-- Depends on: 150 (surveyor_stage_switches + surveyor_stage_enabled), 152 (S4–S6 keys),
--   002 (system_config). Re-runnable (merge is idempotent).
-- @rollback: update public.system_config set value = value - 'autonomy' where key = 'surveyor_stage_switches';
-- ────────────────────────────────────────────────────────────────────────────

-- Insert a full map if the row is missing (pre-150 / wiped); otherwise merge below.
insert into public.system_config (key, value)
values (
  'surveyor_stage_switches',
  '{
     "_note": "Per-stage Surveyor kill-switch (§2b). true = live; set a stage false to PAUSE it server-side without a deploy. An absent stage key reads as enabled (launch-whole default-on). The edge fails CLOSED: not-enabled OR unreachable => a graceful refusal.",
     "analysis":            true,
     "brief":               true,
     "interpret":           true,
     "parley":              true,
     "customContent":       true,
     "styleOverhaul":       true,
     "constructSettlement": true,
     "constructRealm":      true,
     "autonomy":            true
   }'::jsonb
)
on conflict (key) do nothing;

-- Merge the new stage key in NON-CLOBBERINGLY: the new default on the LEFT so any
-- existing key (incl. an operator's OFF) on the RIGHT wins.
update public.system_config
   set value = '{ "autonomy": true }'::jsonb || value
 where key = 'surveyor_stage_switches';
