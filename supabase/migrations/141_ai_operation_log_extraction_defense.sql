-- ────────────────────────────────────────────────────────────────────────────
-- 141_ai_operation_log_extraction_defense.sql — Surveyor S1b: the EXTRACTION-
-- DEFENSE audit-spine fields (DESIGN_AI_CONTROL_SURFACE §3c items 4 + 5).
--
-- WHY THIS EXISTS
--   The S1 audit spine (138) records prompt hash + retrieval slice list + coverage
--   per analyst turn. §3c hardens it against a "cunning user deciphering the
--   architecture" with TWO new inert fields, both id-attributable through the
--   existing user_id (never through content):
--     • canary (§3c(4)) — a unique inert per-ACCOUNT marker embedded in the
--       instruction packet (analystCore.buildAnalystPrompt) and logged here. If a
--       packet's text ever leaks, its canary maps straight back to the account via
--       this log. The packet is semi-public by policy (§3c(1)) — the canary is a
--       tracer, not a secret; it is NEVER shown in any answer field.
--     • meta_probe (§3c(5)) — a boolean flag marking a turn whose QUESTION matches
--       a basic extraction signature (instruction-seeking / breadth-scan), computed
--       deterministically in analystCore.detectMetaProbe(). The FIELD + wiring ship
--       now; the fuller detector (cross-request frequency, throttle + review) is a
--       documented seam (§3c(5) "→ throttle + review") — NOT wired this wave.
--
-- WHAT
--   1. ai_operation_log gains `canary text` + `meta_probe boolean not null default
--      false`. Neither is a secret/key column (byokNeverLogged pin holds).
--   2. write_ai_operation_log is DROP+RECREATED (not create-or-replace) so the new
--      2-param signature does not linger beside the old 15-param one as an overload
--      — the S1 implementer's own recorded recipe to avoid signature-overload
--      ambiguity. Still SECURITY DEFINER, still service-role-only, still the ONLY
--      insert path; search_path pinned public, pg_temp (pg_temp LAST).
--
-- SECURITY POSTURE — unchanged from 138: RLS owner-read; no insert/update/delete
--   policy → default-deny; the definer writer is the sole insert path. The log
--   still carries NO prose, NO PII, NEVER a BYOK key.
--
-- Depends on: 138 (ai_operation_log + the 15-param write fn). Re-runnable
--   (add-column-if-not-exists + drop-if-exists + create-or-replace).
-- @rollback: alter table public.ai_operation_log drop column if exists meta_probe, drop column if exists canary; then re-apply 138's write_ai_operation_log definition (the 15-param signature).
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. the two extraction-defense columns ──────────────────────────────────────
alter table public.ai_operation_log
  add column if not exists canary     text,                     -- §3c(4) inert per-account packet tracer
  add column if not exists meta_probe boolean not null default false; -- §3c(5) extraction-signature flag

comment on column public.ai_operation_log.canary is
  'Inert per-account packet tracer (§3c(4)): the marker embedded in this turn''s instruction packet. A leaked packet''s canary maps to its account here. Not a secret, never shown in any answer.';
comment on column public.ai_operation_log.meta_probe is
  'Extraction-signature flag (§3c(5)): true iff the question matched a basic instruction-seeking / breadth-scan pattern. Marks systematic-probing turns for review; the throttle layer is a documented seam.';

-- ── 2. drop the old 15-param writer, recreate with the 2 new params ─────────────
-- DROP the exact old signature first so the new 17-param version is the ONLY
-- overload (avoids the create-or-replace-can't-change-signature ambiguity).
drop function if exists public.write_ai_operation_log(
  uuid, text, text, text, text, text[], text[], text, text, text, boolean, numeric, integer, boolean, uuid
);

create or replace function public.write_ai_operation_log(
  p_user                uuid,
  p_feature             text,
  p_audience            text,
  p_prompt_hash         text,
  p_answer_hash         text    default null,
  p_retrieval_slice_ids text[]  default '{}',
  p_retrieval_sources   text[]  default '{}',
  p_model               text    default null,
  p_model_version       text    default null,
  p_provider            text    default null,
  p_byok                boolean default false,
  p_citation_coverage   numeric default null,
  p_claim_count         integer default null,
  p_refused             boolean default false,
  p_spend_id            uuid    default null,
  p_meta_probe          boolean default false,
  p_canary              text    default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_id uuid;
begin
  if p_feature is null or btrim(p_feature) = '' then
    raise exception 'ai operation feature is required';
  end if;
  if p_prompt_hash is null or btrim(p_prompt_hash) = '' then
    raise exception 'ai operation prompt_hash is required';
  end if;
  insert into public.ai_operation_log (
    user_id, feature, audience, prompt_hash, answer_hash,
    retrieval_slice_ids, retrieval_sources, model, model_version, provider,
    byok, citation_coverage, claim_count, refused, spend_id,
    meta_probe, canary
  ) values (
    p_user, p_feature, coalesce(nullif(btrim(p_audience), ''), 'player'), p_prompt_hash, p_answer_hash,
    coalesce(p_retrieval_slice_ids, '{}'), coalesce(p_retrieval_sources, '{}'),
    p_model, p_model_version, p_provider,
    coalesce(p_byok, false), p_citation_coverage, p_claim_count,
    coalesce(p_refused, false), p_spend_id,
    coalesce(p_meta_probe, false), p_canary
  )
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.write_ai_operation_log(uuid, text, text, text, text, text[], text[], text, text, text, boolean, numeric, integer, boolean, uuid, boolean, text) from public;
-- service_role (the ai-analyst edge function) writes the trail; authenticated callers
-- reach it only transitively and can never forge a row.
grant execute on function public.write_ai_operation_log(uuid, text, text, text, text, text[], text[], text, text, text, boolean, numeric, integer, boolean, uuid, boolean, text) to service_role;

comment on function public.write_ai_operation_log is
  'Append-only AI-analyst audit writer (SECURITY DEFINER, the ONLY insert path into ai_operation_log). Carries hashes + slice ids + coverage + the §3c extraction-defense flags (canary, meta_probe) — never prose, PII, or keys.';
