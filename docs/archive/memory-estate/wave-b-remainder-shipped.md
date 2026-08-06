---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-19
  type: completion + hazard
  branch: claude/wave-b-remainder
  base: aad6265e (claude/the-composite)
  status: NOT folded — manager folds
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T17:15:54.846Z
---

# WAVE B REMAINDER + downgrade-fix lane shipped

11 lettered commits on `claude/wave-b-remainder` (base aad6265e, NOT folded), range
`108482de..80db0799`. Worktree `.claude/worktrees/wave-b`. Zero eager delta proven
(first-paint closure 1,040,998 B = byte-identical to base). Full suite: 13,624 pass;
9 red files = the 4 parked goldens + 5 migration-numbering fold-artifacts (below).

## What shipped (per commit)
- WB-a vendorManifest test crash-safe (atomic rename + self-heal).
- WB-b Viability adjudication — web ViabilityTab routes through shared isViabilityItem (behavior shift: excluded-category issues now leave the web tab, matching PDF).
- WB-c folder thead a11y (CampaignFolder sr-only head + AdminTrendsCharts scope=col).
- WB-d ?cat= deep-link → custom-content authoring bucket (validated; implies mode=custom).
- WB-e journey_stop enrichment — new feature on the existing LANDING_FUNNEL_USED event.
- WB-f WhatChangedPanel WIRED into SettlementDetail + honesty guard ("held steady" only when hasPrior).
- WB-m retention purge P0 (migration 162) — spares settlements with a live active dossier_entitlement; search-path baseline shrunk.
- WB-l DOOR DISCRIMINATOR #15 — Surveyor-gated (entitlement||founder||elevated), NOT tier==='premium'; + Surveyor-comment finalized.
- WB-n retention-warning email ramp (template both places + notifyRetentionWarning helper).
- WB-i lastingEffects authoring — terminal_death/resettle get authored prose (taste-vetoable).

## ⚠ HAZARD: eager-shared-chunk rebalance (the WB-l saga)
Threading has_surveyor_entitlement through the EAGER fetchProfileAuth/auth-store path
(the audit's suggested mechanism) measured **+321 eager B** — unacceptable against the
already-breached, owner-gated budget. Fix = read the bit LAZILY in the consumer chunks.
BUT: sharing ANY module (even a 4-line import-free predicate) across TWO lazy chunks
(the door chunk + the account chunk) makes rollup form a shared chunk that **rebalances
+42–49 B into the eager entry**. The ONLY zero-eager path was to DUPLICATE the predicate
(inline copy in useAccountSurveyorGate.js) so the account chunk shares nothing with the
door — pinned byte-behavior-identical by tests/components/surveyorGateParity.test.js.
LESSON: to keep zero eager when gating two separate lazy chunks, do NOT share a module;
inline + parity-pin. Confirmed by isolation builds (door-only = 1,040,998; +account share = +42).

## ⚠ 162 numbering → 5 fold-resolved reds (NOT bugs)
Per the brief, WB-m took migration **162** (156 double-minted by siblings, 157-161 money-wave).
In this ISOLATED tree that leaves gap 156-161, so FIVE tests red and RESOLVE AT FOLD when
siblings fill 156-161 + the manager updates the count/head docs: migrationContiguity ·
migrationSequenceAll.pglite · docCounts · architectureFreshness · deployRunbookFreshness.
Reference migration by NAME (purge_expired_plan_inactive_assets), never number.

## Deferred (documented, NOT dropped) — see the lane report
- subscription-pause handling: BLOCKED — the webhook event router is an inline switch in the
  FORBIDDEN stripe-webhook/index.ts; customer.subscription.updated has no case, no importable
  handler. Fold-coordination point with the money-wave lane.
- WB-g deterministic-violet re-tones: UNDER-SPECIFIED (term absent from tree; C13 AI-register
  slate conversion already landed; remaining violets are semantic non-AI — re-toning would harm
  the AI-distinction). Needs manager clarification.
- WB-k PDF counterseal structured-path refactor: deferred (golden-gated organicOrnament byte-
  identity + C15/§10 "do NOT half-fix"); recipe in report.
- WB-h HowToUse Philosophy/UnderTheHood restore + WB-j traditions genesis-consumption+authoring-UI:
  deferred (content-heavy / large feature + CustomContent at the 600-line ceiling + determinism-
  pinned genesis); recipes in report.
- WB-n export-affordance on inactive cards (audit 2.2 half) + the scheduled retention-email
  dispatch: deferred (multi-layer library UI / wave-e scheduled-mail seam).
