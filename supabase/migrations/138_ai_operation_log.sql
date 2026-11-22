-- ────────────────────────────────────────────────────────────────────────────
-- 138_ai_operation_log.sql — Surveyor S1: the aiOperationLog audit spine.
--
-- WHY THIS EXISTS
--   DESIGN_AI_CONTROL_SURFACE §1 row 3 / §3 (determinism + audit): every AI-analyst
--   turn writes an audit row so the AI layer is reproducible and reviewable. The audit
--   spine starts at S1 even though the analyst WRITES no world state — it records what
--   was asked-of and answered-by the model, never the prose or PII.
--
-- WHAT (the row)
--   prompt hash + retrieval slice ids + retrieval sources + model + model version +
--   answer hash + audience + citation coverage + claim count. Hashes are non-secret
--   audit fingerprints (fnv1a, computed in analystCore.ts) — the log carries NO prose,
--   NO PII, and NEVER a BYOK key.
--
-- SECURITY POSTURE (append-only, owner-readable)
--   RLS on. Owner may SELECT their own rows (transparency). NO insert/update/delete
--   policy → default-deny makes the table immutable for non-superusers; the SECURITY
--   DEFINER write_ai_operation_log() is the ONLY insert path (mirrors 051 audit_log +
--   the ai_usage_events discipline).
--
-- Depends on: auth.users. Re-runnable (create-if-not-exists + drop-policy-if-exists).
-- @rollback: drop function public.write_ai_operation_log(...); drop table public.ai_operation_log;
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.ai_operation_log (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references auth.users(id) on delete cascade,
  feature               text not null,               -- 'analysis' | 'brief' | …
  audience              text not null,               -- 'dm' | 'player'
  prompt_hash           text not null,               -- fnv1a of the grounded prompt
  answer_hash           text,                         -- fnv1a of the rendered answer (null on failure)
  retrieval_slice_ids   text[] not null default '{}', -- the slice ids grounding the answer
  retrieval_sources     text[] not null default '{}', -- the distinct read-model receipts
  model                 text,                         -- e.g. 'claude-opus-4-8'
  model_version         text,                         -- e.g. 'anthropic-2023-06-01'
  provider              text,                         -- 'anthropic' | …
  byok                  boolean not null default false, -- inference ran on the user's key
  citation_coverage     numeric,                      -- 0..1 (the §5 eval metric)
  claim_count           integer,
  refused               boolean not null default false,
  spend_id              uuid,                          -- joins the credit_ledger spend
  created_at            timestamptz not null default now()
);

create index if not exists idx_ai_op_log_user   on public.ai_operation_log(user_id);
create index if not exists idx_ai_op_log_recent  on public.ai_operation_log(created_at desc);
create index if not exists idx_ai_op_log_feature on public.ai_operation_log(feature);

alter table public.ai_operation_log enable row level security;

comment on table public.ai_operation_log is
  'Append-only AI-analyst audit spine: prompt/answer hashes, retrieval slice list, model+version, citation coverage. NO prose, NO PII, NEVER a BYOK key. Written ONLY by write_ai_operation_log().';

-- ── RLS: owner-read; NO insert/update/delete policy (append-only, definer-written) ──
drop policy if exists "Owner reads own ai operation log" on public.ai_operation_log;
create policy "Owner reads own ai operation log" on public.ai_operation_log
  for select
  using (auth.uid() = user_id);

-- ── write_ai_operation_log(...) — the ONLY insert path (SECURITY DEFINER) ──────────
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
  p_spend_id            uuid    default null
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
    byok, citation_coverage, claim_count, refused, spend_id
  ) values (
    p_user, p_feature, coalesce(nullif(btrim(p_audience), ''), 'player'), p_prompt_hash, p_answer_hash,
    coalesce(p_retrieval_slice_ids, '{}'), coalesce(p_retrieval_sources, '{}'),
    p_model, p_model_version, p_provider,
    coalesce(p_byok, false), p_citation_coverage, p_claim_count,
    coalesce(p_refused, false), p_spend_id
  )
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.write_ai_operation_log(uuid, text, text, text, text, text[], text[], text, text, text, boolean, numeric, integer, boolean, uuid) from public;
-- service_role (the ai-analyst edge function) writes the trail; authenticated callers
-- reach it only transitively and can never forge a row.
grant execute on function public.write_ai_operation_log(uuid, text, text, text, text, text[], text[], text, text, text, boolean, numeric, integer, boolean, uuid) to service_role;

comment on function public.write_ai_operation_log is
  'Append-only AI-analyst audit writer (SECURITY DEFINER, the ONLY insert path into ai_operation_log). Carries hashes + slice ids + coverage only — never prose, PII, or keys.';
