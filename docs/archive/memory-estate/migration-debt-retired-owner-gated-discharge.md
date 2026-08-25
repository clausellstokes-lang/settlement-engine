---
name: migration-debt-retired-owner-gated-discharge
description: "⭐⭐ THE MIGRATION DEBT IS RETIRED (2026-08-10, build branch, uncommitted at report time): train extended 194 → 195, all THREE owner-gated rows removed (2 census entries + the uncollectedSuites row), CEILING 27 → 25, uncollected ceiling 1 → 0, OWED_CEILING 13 → 11. ⚠⚠ THE PIN WAS NOT DELETED — it was INVERTED into OWNER_GATED_DISCHARGE, a record whose ANTI-AMNESTY ARM re-checks the cure on disk (195's .down.sql, its inline @rollback note, DEPLOY.md's head, MIGRATION_TRAIN_REPO_HEAD ≥ 195), so reverting the cure reds the discharge. ⚠ A `.down.sql` makes a migration the FIRST in the train to classify `data-safe-down-script`."
metadata:
  type: project
  date: 2026-08-10
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T13:47:41.733Z
---

## What landed

Worktree `.claude/worktrees/minifold`, branch `claude/composite-r4`, on top of `218aa5ff`.
Four files, one coherent change, edits only (the manager commits):

1. `scripts/ops/migrationRehearsalCore.mjs` — `MIGRATION_TRAIN_REPO_HEAD` 194 → 195 and a
   new bounded wave `civility-guard-and-public-identity` (195–195, four expected objects:
   `public.civility_terms`, `public.civility_allow`, `civility_normalize`,
   `civility_blocked`). Without this the whole rehearsal suite threw AT COLLECTION.
2. `tests/ops/migrationRehearsal.test.js` — the 194-era pattern exactly: repoHead 195,
   pendingCount 74, `[195,195]` appended, `covered` length 74, the `at(-N)` ladder shifted
   by one, snapshot `repoHead`/`migrationCount` 195, `--plan --json` repoHead 195.
3. `tests/lint/testRatchet.test.js` — `OWNER_GATED_DISCHARGE`, the rewritten pin, both
   uncollected-allowlist pins, `CEILING` 27 → 25, `OWED_CEILING` 13 → 11, the two OWED
   entries deleted, and both retired files added to the freed-walker acceptance plant.
4. `scripts/.test-ratchet-baseline.json` — LAST, per the walker-census law: two entries
   removed and `uncollectedSuites` emptied to `{}`.

## Why the pin could not simply be deleted

`owner-gated` is the census class for debt a build lane may not repair on its own authority.
The old pin enforced that with `gated.length > 0` — the class could never empty, because
emptying it is exactly what an unauthorised "fix" looks like. A lane attempted this
retirement on 2026-08-09 **with the cure already in hand**; the pin REFUSED it and the change
was correctly reverted. What discharged it was the owner's 2026-08-10 full delegation grant
(`full-delegation-grant-2026-08-10`, also recorded on the ledger's OWNER_DECISION_QUEUE.md
under "FULL DELEGATION GRANT (owner, 2026-08-10)"), not the cure.

So the assertion MOVED rather than disappearing. The pin now asks three questions:

- ARM 1 — every surviving owner-gated row still says why it is gated (now covering the
  uncollected allowlist too, which the old pin did not read at all);
- ARM 2 — every row that LEFT the class is named in `OWNER_GATED_DISCHARGE` against a grant
  (>120 chars) and a 40-hex `landedAt`, its file still EXISTS on disk (deleting the test is
  an erasure, not a repair), and it carries no owner-gated row any more;
- ARM 3 — ⛔ **THE ANTI-AMNESTY ARM**: the cure is re-checked FROM THE FILESYSTEM —
  `supabase/migrations/195_*.sql` carries `-- @rollback:`, `supabase/rollback/195_*.down.sql`
  exists, `docs/DEPLOY.md` names the head file, and the imported
  `MIGRATION_TRAIN_REPO_HEAD` still reaches 195.

**The general shape, reusable:** when a guard's condition is discharged, invert it into a
record whose arms bind to the world the guard was protecting. A discharge whose only evidence
is a constant in the test file that stopped asserting is an amnesty.

## Hazards learned

- ⚠⚠ **THE THIRD MIGRATION RED WAS NOT A CENSUS ENTRY.** "The three migration reds" = two
  rows in `entries` PLUS one row in `uncollectedSuites`. Emptying the allowlist reds a
  SECOND, separately-worded anti-vacuity pin (`rows.length > 0`, "the uncollected allowlist
  vanished"). Any brief that says "remove the three rows" is naming two different ledgers.
- ⚠ An anti-vacuity floor of `> 0` becomes WRONG the moment the population it guards
  legitimately empties. Cure: replace the count with `count > 0 || <discharge names the last
  row that left>`, unconditionally, and drop the sibling ceiling to 0 so the next hole must
  raise it explicitly. Never a bare `if` around the assertions.
- ⚠ A migration that ships a `.down.sql` becomes the FIRST in the wave train to resolve
  through `classifyRollback`'s `data-safe-down-script` branch — a previously untested arm
  inside the plan. Pin it when it first fires (done, in the rollback-posture test).
- ⚠ The wave-level `rollback.mode` must stay `forward-only` (a test asserts it for EVERY
  wave); the wave policy is the FALLBACK and is never read for a migration with a down
  script. Say so in the reason or the next reader will think the two disagree.

## Receipts

`sh scripts/gate-mutex.sh --run -- npx vitest run` over testRatchet + migrationRehearsal +
postDeployVerify + migrationRollbackDiscipline + deployRunbookFreshness: **5 files, 100
tests, all passed**, exit 0. ESLint on the three source files: exit 0.

TWO MUTANTS, both red, both restored `cmp`-clean:
- re-adding the `migrationRollbackDiscipline` census row red **three independent arms** —
  the ceiling (26 > 25), the discharge's ARM 2 ("named as retired but still carries an
  owner-gated row"), and the walker-census law (an unledgered enforcement-walker row);
- pointing `OWNER_GATED_DISCHARGE.migration` at 194 red ARM 3 ("194 lost its .down.sql"),
  proving the anti-amnesty arm binds to the filesystem and not to the constant.

NOT run: `npm run test:ratchet` (a full-suite vitest run exceeds the 10-minute cap), so the
census's `totalTests`/`totalFiles` scope figures were deliberately left at their measured
values — both are FLOORS and the retirement only grows the collected total.

Related: [[full-delegation-grant-2026-08-10]] · [[walker-census-law-machinery]] ·
[[walker-census-split-landed]] · [[step12-test-ratchet-landed]] · [[hazard-conversion-law]].
