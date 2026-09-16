---
name: generator-golden-shift-record-established
description: ⭐ The 525-row generator golden now carries a DATED SHIFT RECORD in its docstring; the icon-sweep re-record @ 54465b54 proved shape-only via a 5-template field census + a totality check; the method is the reusable recipe for any hash-manifest re-record
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-03T23:03:03.315Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

**What landed (2026-08-03, Lane GR, commit 54465b54 on claude/composite-r4):**
`tests/fixtures/generator-golden-master.json` re-recorded for the icon sweep
(d9a1ea5a). All 525 rows moved; key set unchanged. `tests/property/
generatorGoldenMaster.test.js` gained a **SHIFT RECORD** section listing this shift
plus the three prior re-records (HK-3 46255ad5, I1 99974c4a, mountain_pass
aa33eba5). Re-recording without adding a row is now explicitly a deleted alarm.

**THE RECIPE — how to prove a hash-manifest re-record is lawful.** A hash manifest
cannot be field-diffed against itself, so:
1. Regenerate the full corpus as OBJECTS at HEAD.
2. `git worktree add --detach <scratch> HEAD`, then `git checkout <cause>^ -- <every
   src file the cause touched>` — the cause reverted and nothing else. First verify
   with `git log <cause>..HEAD -- <file>` that no later commit touched them, or the
   reconstruction is approximate. Symlink the main `node_modules` in (worktrees in
   /tmp cannot walk up to it).
3. **TOTALITY CHECK:** the reverted-side hashes must reproduce the OLD committed
   fixture on every row. Zero mismatches is what licenses the word "only" — it
   proves the named cause is the sole source of drift.
4. Deep-diff old vs new objects, collapse array indices to `[*]`, census every
   differing (path-template, kind). Report the NEGATIVE half too: zero `changed`,
   zero `added`, zero array-length, zero key-order.
5. Cross-check the re-recorded fixture against an independently computed manifest.

**Icon-sweep census (all removals, no value moved):** `activeChains[*].needIcon`
6,676 · `activeChains[*].resourceIcon` 2,214 · `institutionalServices[*].icon`
1,409 · `stress.icon` 516 · `stressors.icon` 516.

**⚠️ SHARED-TREE RULE this surfaced:** never re-record a golden from the dirty
minifold tree without first proving the dirty tree's output equals CLEAN HEAD's —
otherwise another lane's uncommitted WIP gets banked into a committed golden.
(Checked here: 0 rows differing, so the re-record represents committed HEAD.)

**⚠️ A SECOND icon re-record is EXPECTED** — see
[[case-sensitive-guard-blind-to-camelcase-fields]]: 4,462 dead `resourceIcon: ""`
slots still ship, and closing them moves these hashes again.
