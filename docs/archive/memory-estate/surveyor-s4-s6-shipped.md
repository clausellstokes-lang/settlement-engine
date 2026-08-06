---
name: surveyor-s4-s6-shipped
description: Surveyor S4-S6 + style overhaul + accept→mint FOLDED into w7-prep @ 9d86991e (2026-07-17); migrations 151/152; born-efficient token layer; owner-gated follow-ups + seams inside
metadata: 
  node_type: memory
  type: project
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

FOLDED @ 9d86991e (merge of claude/surveyor-s4-s6 tip b486f9ff, 6 commits off 07d3a1d2).
Fold receipts: lane pins 107/107 · tsc 0 · dist 145/145 · four validators green.

**What exists now:** accept→mint (src/domain/intent/applyDispatch.js pure + src/lib/intent/
interpretApply.js DI verbs; reproducibility receipts, no new persisted shape) · S4 custom
content (supabase/functions/custom-content; two-layer schema wall in src/domain/content/) ·
AI style overhaul (src/design/townMapStyleWall.js validateBespokeStyle → resolved bespoke
styles the existing renderer draws unchanged; src/domain/townMap/bespokeStyles.js pure
collection) · S5/S6 construction (src/domain/construct/ + _shared/constructCore.ts;
deterministic delta-only comparator; canonize-nothing pinned at composeInstantWorld) ·
token layer (src/config/aiTaskConfig.js per-task routing/budgets as operator config;
_shared/promptEfficiency.ts canonicalJson/compactSlices/overTokenBudget).

**Why:** every write stage rides the S1 money path verbatim + per-stage kill-switch
(absent-key⇒enabled, edge fail-closed) + early-access register. Migrations 151 (credit
costs) / 152 (stage switches), head 152 contiguous.

**How to apply (open items):**
- OWNER-GATED follow-ups: apply-side aiOperationLog persistence to the audit spine
  (operations.js parks the shape; write_ai_operation_log is service_role-only) · bespoke-
  style STORAGE surface (mapEdits.bespokeStyles key vs per-account artifact store).
- Provisional prices customContent=6/styleOverhaul=3/constructSettlement=6/constructRealm=8
  (operator config, rides the Ruling-#5 provisional-pricing blanket; vetoable).
- SEAMS: the React panels (edge→render→accept flows; pure halves built+pinned) · style
  viewer-surface wiring (~6 surfaces call resolveTownMapStyle(readStyleLens) — switch to
  resolveActiveStyle(lens, collection)) · edge shells verified by-pattern only (CI deno).
- Two shared analytics events ai_stage_answer/ai_stage_rider (EVENTS_REV 9).
Related: [[surveyor-s3-build]], [[comprehensive-review-fix-program]].
