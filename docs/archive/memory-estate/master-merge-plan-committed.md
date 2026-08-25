---
name: master-merge-plan-committed
description: "The master↔review-fixes reconciliation plan is WRITTEN + committed — docs/MASTER_MERGE_PLAN.md @ 209e8aa2 on branch claude/keen-hellman-30673c (NOT merged, NOT pushed). The successor executes the master merge FROM this doc."
metadata: 
  node_type: memory
  type: project
  originSessionId: 7808149d-3b12-4ad8-897a-7df14e1ee690
---

The endgame's highest-risk item (the master merge, [[third-lineage-mystifying-ride]] /
[[handoff-plan-post-ladder]] item 5) now has a full committed reconciliation MAP:
**docs/MASTER_MERGE_PLAN.md**, committed **209e8aa2** on branch `claude/keen-hellman-30673c`
(worktree keen-hellman-30673c). PLAN ONLY — no merge performed, no code changed. NOT pushed,
NOT merged. Anchored to the pinned survey tip **5a78af5a**; review-fixes drifted to **9fe425a7**
(Analytics V2) DURING the survey — the doc §0 documents this and instructs a re-survey before
execution. Built by 5 read-only Opus sweeps + an adversarial verifier (every hash/count reproduced).

**The load-bearing REFRAME (supersedes the "symmetric 69-file 3-way" fear):** master's tip is
**2026-07-05** (d024286e); the port program ran **2026-07-10..13**, so it consumed master's FINAL
state, then RF fixed ~110 findings on top. There is **no post-port master evolution class**. So the
merge is **default RF-wins**, and the real work is not conflict-resolution volume but:
- **Silent channels** (from `git merge-tree` sim): 554 conflicts, but ALSO **433 SILENT ADDS** +
  **241 SILENT MODS** that carry master content in with NO marker. This is where fences breach.
- **Port OMISSIONS** (the only real losses): the entity-link consumer layer (6 files, master
  6d95adc7 — producer `entityRefWrapper.ts`/`entityRefTokenizer.js` already byte-identical both
  tips; RF ships producer-only + a degrade path); and **one confirmed engine-fix loss `ec6120e3`**
  (dangling requiredInstitution gates a good OUT — RF carries the exact pre-fix code).
- **Fences (master content that must NOT survive):** the 5 WarFaithSection/Workshop ungated-pantheon
  files (C2 silent adds — `git rm` post-merge); master's `TIER_GATE.free.export:true` (RF's `false`
  implements the $2.99 ruling — RF wins); the legacy `religionDynamicsEnabled` hard gate (RF's
  `faithSpreadEnabled` split wins). NOTE: `evaluateReligiousContest` is a STALE fence — absent as
  code on BOTH tips now.
- **F24 NUL hazard AMPLIFIED:** `git merge` auto-merges NotesTab.jsx to **master's raw-NUL form**
  silently; no raw-NUL gate (controlBytes.test.js) is live on EITHER tip. See [[f24-corruption-class-closed]].
- **Migrations already reconciled:** 001-112 shared, RF adds 113-131 additively, only 015/018/101
  differ (RF wins 018/101 = PII-scrubbed superset). The old renumber fear is dead.
- **Golden two-stage protocol:** the merge commit is golden-NEUTRAL (RF goldens = the arbiter that
  the engine resolved to RF everywhere); behavior-changing adoptions (ec6120e3 etc.) ride a separate
  wave with ONE owner-signed regen. Never regen to green.

**Execution shape:** §7 waves W0 (settle base + re-survey) → W1 (merge commit, golden-neutral) →
W2 (fence sweep) → W3 (ports + the one regen) → W4 (F24 byte pass + cherry-pick 263e53e0 pin) →
W5 (guard cherry-picks ab1c30ba/ccd0d670 + entity-link wiring) → W6 (test-estate reconcile) →
W7 (full gate) → W8 (OWNER GATE: push, PR-into-master, migration deploy, sign-offs). The owner
asked for a **GitHub PR**, not a raw push. §8 is the owner-decision queue (deploy, schema-shape
delta in settlement.schema.js, golden sign-off, support email, supplyCompleteness NUL, persist-gap
budget). Satellites: persist-gap 151a8ee3 (clean onto RF, budget-gated), W2 already re-landed
(4cf84a40), usage-telemetry already in RF.

Related: [[third-lineage-mystifying-ride]], [[reconciliation-decisions]], [[handoff-plan-post-ladder]],
[[map-overlay-svg-attr-lineage-gap]], [[golden-branch-firstpaint-budget-overage]], [[persist-gap-editactions-fix]].
