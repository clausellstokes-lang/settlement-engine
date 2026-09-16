---
name: surveyor-s1b-shipped
description: "SURVEYOR-S1b shipped 2026-07-17 on claude/surveyor-s1b (4 commits off a17d71b0): §3b two-voices musings[] + registerPurity, §3c canary+meta_probe (migration 141, 17-param write_ai_operation_log recreate), §3f id-free rider event ai_analyst_rider (EVENTS_REV 8). NOT merged/pushed. Known reds: EXEMPT_CEILING 69>66 + PRE-EXISTING 137_founder_seats @rollback red on this lineage."
metadata:
  node_type: memory
  type: project
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
---

# SURVEYOR-S1b — the seamed constitution follow-up (two-voices, extraction defense, rider)

Shipped 2026-07-17 on `claude/surveyor-s1b`, FOUR commits off a17d71b0 (the S1+S2 merge):
a500ae58 (§3b) → 2ccb95a0 (§3c + migration 141) → 451a22f5 (§3f) → 30781a7a (doc freshness
head=141). NOT merged, NOT pushed (manager merges per W_R2_COMMON_PROTOCOL). Design
authority: docs/DESIGN_AI_CONTROL_SURFACE.md §3b / §3c(4,5) / §3f.

## What shipped
- **§3b TWO-VOICES**: answer contract = cited `claims[]` + uncited `musings[]`
  (sanitizeMusings strips smuggled source/op/action fields — uncited by construction, cap 8).
  `registerPurity()` = the §5 eval beside citationCoverage (speculation regex over report
  TEXT; independent of the rider by construction). Panel renders musings as a gold-ruled
  serif/italic block ("The Surveyor muses · suggestions, not the record",
  data-testid="analyst-musings"). Client fires registerPurityBand on AI_ANALYST_ANSWER.
- **§3c(4) CANARY**: `accountCanary(userId, secret)` — deterministic salted double-FNV
  `sf-<16hex>` per-account tracer, embedded as `[packet-ref …]` in buildAnalystPrompt (4th
  arg), logged in ai_operation_log.canary; pinned NEVER in any answer field. Salt env:
  SURVEYOR_CANARY_SECRET (works unset; set at deploy).
- **§3c(5) META-PROBE**: `detectMetaProbe(question)` — instruction-seeking + breadth-scan
  regexes; flag stored in ai_operation_log.meta_probe. Migration 141 DROPS the 15-param
  write_ai_operation_log and recreates it with 17 params (p_meta_probe, p_canary) —
  drop-first avoids overload ambiguity (the S1 recipe).
- **§3f ENRICHMENT RIDER**: frozen RIDER_VOCAB (intents/themes/refusalReasons, each with a
  catch-all; themes = STARTER taxonomy) + `extractRider()` (coerce, oov flag, never throws).
  Edge inserts ONE id-free analytics row per answer: new event `ai_analyst_rider`
  (EVENTS_REV 7→8), actor/session/subject NULL, consent_tier 'product', on BOTH managed and
  BYOK paths (gated only on rider presence — condition-of-service per the §3f owner ruling).

**Why (conflicted-witness, pinned):** quality metrics (citationCoverage, registerPurity)
are computed from validated CLAIMS text server-side; extractRider structurally cannot carry
quality fields — a model self-reporting compliance can never lift its own scores
(tests/domain/aiAnalyst.test.js §3f block proves a flattering rider + bad claims still
scores 2/3).

**How to apply / verify:** pins live in tests/domain/aiAnalyst.test.js (§3b/§3c/§3f
describe blocks) + tests/components/aiAnalystPanelMusings.test.jsx. Gate on 2026-07-17:
full suite 11,796/11,813 passed; closure 1,064,346 B of 1,066,400 (margin 2,054 B; +279 B
this wave, event-name strings + rider props — the allowed S1 precedent class).

## Known reds on this lineage (do not re-diagnose)
1. EXEMPT_CEILING 69>66 (operationRegistry.walker) — the standing owner-gated red.
2. **137_founder_seats.sql fails migrationRollbackDiscipline** (touches profiles, no
   `-- @rollback:` note) — PRE-EXISTING at a17d71b0 (137 is the Founder lane's DRAFT,
   commit af5757b1). Owner/Founder-lane fix, not a Surveyor bug.
3. advancePauseResume re-entrancy — load-flake only (green in isolation).

## Deferred seams (recorded in-file)
- §3c(5) full detector (cross-request frequency, throttle+review) — field + marking only.
- §3f theme-dictionary growth — k-floored A2 process over the `oov` signal.
- §3d bias-to-the-form (actionDrafted always false at S1) — S3+ scope.
- ToS/privacy copy — owner/legal (NOT engineering).

Related: [[surveyor-s1-s2-shipped]], [[shared-tree-fpg3-and-grep-nul-gotcha]].
