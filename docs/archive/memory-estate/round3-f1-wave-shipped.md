---
name: round3-f1-wave-shipped
description: "R3 wave F1 (UI correctness + a11y + voice) shipped @ ad15e2c1 on composite-r4 + doc @ fab8f91d on ledger; 11 of 13 findings fixed, 1 deferred (owner design), 1 was on the wrong branch."
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-20T09:56:16.122Z
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
---

**ROUND 3 — FIX WAVE F1 shipped 2026-07-20** (dedicated agent, mini-fold worktree).
- **claude/composite-r4 @ `ad15e2c1`** (base ca244100): 11 findings + 13 regression pins, 24 files. Gate: domain-strict 0 · tsc 0 · eslint 0 err · 203/203 focused+pin+regression green · build OK · verify:dist 162/162 · first-paint closure **1,024,585 B** ≤ 1,040,000 (+74 B vs baseline 1,024,511). NOT pushed/folded.
- **ledger review-fixes-2026-07-08 @ `fab8f91d`**: START_HERE.md expected-reds corrected (claims-parity-5).

**Fixed (11):** correctness-1 (migrateCampaign normalizes settlementIds at the load chokepoint + `|| []` at the two SettlementsPanel reads — no more library white-screen), correctness-2 (Chronicle try/catch/finally + requestCampaignChronicle made total), correctness-3 (list() failure → visible persistenceError + owner-keyed ref latch), a11y-1 (SurveyorDoor → useDialogFocusTrap, trigger kept mounted tucked via `.sf-door-tab--open`), a11y-2 (Note `noteAria` tone→role: success/muted=status, danger=alert), a11y-3 (HomeSampleDossier eyebrows → -700 ink tokens GREEN/SLATE/AMBER_DEEP; also closes content-1), content-2 (traditions reasons de-jargoned, no §), content-4 (their-patron), experience-news-headline-raw-id (wizardNews), experience-roadscene-json (itemLine).

## Why these matter for the future
- **⚠️ DEFERRED experience-npc-agency-news-no-voice (P3) — DO NOT "fix" it blindly.** The survey wanted a crier voice for impactKinds `npc_growth`/`npc_ladder`. But `tests/domain/impactKindWalkers.test.js` EXPECTED_VOICE **deliberately** maps them (and 8 siblings: urban_fabric, spatial_consequence, npc_contest, npc_support, tradition, migration_flight, tradition_change, roads) to `null` = "deliberately unvoiced" with owner-commission rationale — those beats carry their own headline+summary receipts; the crier is reserved for the 10 drama-proclamation classes. Adding a voice is an **owner design decision** (the manifest itself calls a `culture`/agency crier "a T-5 surface question"), not a repair. Reversing it also reds the walker test. Left unimplemented, recorded in the commit body.
- **⚠️ `region/graph.js:161` defaults a nameless node's `name` to `String(node.id)`.** So any "does this node have a name?" logic must test `node.name && String(node.name) !== String(node.id)`, NOT just `node.name` — a normalized graph node ALWAYS has a truthy name (possibly its raw id). This bit finding-11: my first fix (filter `node.name`) was incomplete; the pin caught the raw id still leaking. Fixed in `nodeNameMap`.
- **⚠️ Refuter amendments can be wrong — verify against code.** The a11y-3 cycle1 verdict amended the middle HomeSampleDossier callout to "VIOLET #7B4FCF on #EBE2FA". FALSE on this tree: the code uses SLATE #5A6E82 on slate-100 #E4E9EE (tokens.js:70-73 documents the 4.31:1). Followed the code.
- **The brief mislocated claims-parity-5** as "in THIS worktree's docs/"; START_HERE.md is only on the ledger branch (main tree) — fixed there as its own doc commit.
