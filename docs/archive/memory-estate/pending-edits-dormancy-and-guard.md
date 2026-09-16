---
name: pending-edits-dormancy-and-guard
description: pendingEdits queue is dormant scaffolding (only rename-settlement reachable); no-silent-drop guard now at the queueEdit seam via COMMITTABLE_EDIT_KINDS; +this eager fix left review-fixes first-paint margin at 51 B.
metadata: 
  node_type: memory
  type: project
  originSessionId: e1e34d46-f258-4f54-a218-ad12f3cd8fb1
---

Recon + fix (2026-07-14). COMMITTED f62576e9 on branch `claude/blissful-hawking-d5bd7b`
(off review-fixes-2026-07-08 @ c69f2b2b) — NOT pushed, NOT merged to review-fixes or master.
Owner said "commit" after the assessment. Pre-commit eslint --fix hook ran no-op; post-commit
survival check clean.

**Dormancy finding (CONFIRMED by grep census).** `src/domain/pendingEdits.js` declares 10
`EDIT_KINDS`, but the pendingEdits queue is DORMANT scaffolding: the ONLY UI enqueue caller is
`DossierHeaderRow.jsx:37` → `queueEdit('rename-settlement', …)` (the settlement-name `EditableInline`).
No surface enqueues the other 9 kinds — not even `rename-npc` (a dispatched kind). Roster stressor
edits use a SEPARATE path (`withStressorEdits` + `config.stressorEdits`), not `queueEdit('add-stressor')`.
`operationRegistry`/`operations.js` is a manifest walked for completeness — NO live dispatcher invokes
`queueEdit` with an arbitrary kind ("NO runtime wiring this wave", deferred). So the pre-fix bug
(commitPendingEdits dispatched only rename-npc + rename-settlement; the other 8 hit `default`,
`console.info('no dispatcher…')`, and were silently dropped while the queue cleared all-or-nothing)
was NOT live data loss — no UI could reach it. Aligns with DESIGN_EVENT_COMPOSER_V2 §7 deliberately
NOT building on pendingEdits.

**Fix shape (minimal, honest, dormant-disposition).** Added `export const COMMITTABLE_EDIT_KINDS =
['rename-npc','rename-settlement']` in pendingEdits.js. `queueEdit` now REFUSES any kind not in that
list (`return null`, mirrors the existing canon-phase rejection) — so an un-committable kind can never
enter the queue and be dropped at commit. The commit `default` branch is now unreachable-by-contract
(console.info removed). Drift is caught by PINS, not a runtime log: pendingEdits.test.js (COMMITTABLE
⊆ EDIT_KINDS; == exactly the 2; the 8 scaffolding kinds declared-but-not-committable) +
editActionPersist.test.js (every non-committable EDIT_KIND refused at enqueue; committable admitted;
commit-after-refused has nothing to drop + no phantom persist). **RULE: a future dev wiring a
dispatcher for any scaffolding kind MUST add it to COMMITTABLE_EDIT_KINDS or the enqueue is refused.**
Also fixed the false "the edit queue is PERSISTED" comment in pendingEdits.js — the queue is
SESSION-ONLY (excluded from the store partialize, src/store/index.js:89).

**⚠️ BYTE HAZARD.** settlementSlice + pendingEdits are first-paint EAGER. The first (heavier) version
BREACHED the budget: closure 1,214,163 vs 1,214,050 (+113 B). Slimming (frozen array + `.includes`
instead of Set+helper; dropped the console tripwire) brought it to **1,213,999 — only 51 B under
budget** (ratchet test green, 19/19). The margin on review-fixes @ c69f2b2b is now THIN; any further
eager work here has ~51 B headroom if this fix lands. Owner precedent is reclaim-over-raise — never
raise the budget constant. See [[golden-branch-firstpaint-budget-overage]], [[e0-tempo-governor-shipped]].

Tooling note: building a base worktree with a **symlinked node_modules fails** for vite
(`vite: command not found` / no dist) — don't rely on it for base-delta byte measurement.
Related: [[persist-gap-editactions-fix]] (the §10.4 fifth gap that wired rename-settlement's dispatch).
