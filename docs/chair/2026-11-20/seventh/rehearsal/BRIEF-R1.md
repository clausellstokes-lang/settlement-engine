# REHEARSAL JOIN 1 — brief (the chair, 2026-11-20)

You are a helper of the chair of the settlement-engine program. This is a REHEARSAL: a throwaway join of every side
branch ("lane") that is not yet on the working line, to learn EARLY what the real join will hit. Nothing you make is
ever pushed. Your product is ONE report file. Read this brief whole before the first command.

## Hard rules (each one binds)

1. YOU PUSH NOTHING, EVER. No `git push`, no pull request, no GitHub write of any kind.
2. You work ONLY in a new worktree `/home/user/wt/rehearsal` on a new LOCAL branch `rehearsal/join-1`. You never
   write, check out, reset, stash or clean in `/home/user/settlement-engine`, `/home/user/wt/line`,
   `/home/user/wt/chair`, `/home/user/wt/framebase` or `/home/user/wt/kmix` (other work is live in them: a landing is
   running in `/home/user/wt/line` right now). Reading them is fine.
3. One heavy gate at a time, through the mutex, never through a pipe:
   `sh scripts/gate-mutex.sh --run -- <command...> > <log> 2>&1; echo "exit=$?" >> <log>` (it waits for the slot: a
   landing in `/home/user/wt/line` is using it now, so a wait of ten minutes is normal), then read the log's tail.
   `npm run x | tail` reports the pipe's status and is forbidden. Never run `npm run check` and never the whole test
   suite. The build, `tests/lint` whole, the two typechecks and the lint are each a heavy gate.
4. Never `--no-verify`. If a commit hook stops a merge commit, record what it said and stop that step.
5. A refusal by your own permission check stands: report it, do not route round it.
6. You invent no figure. A register, census or frozen list that conflicts is never hand-edited to "pass".
7. No database, no `supabase` command, no network beyond `git fetch origin`.

## Set-up

```
cd /home/user/settlement-engine
git fetch origin 'refs/heads/lane/*:refs/remotes/origin/lane/*' 'refs/heads/review-fixes-2026-07-08:refs/remotes/origin/review-fixes-2026-07-08'
git worktree add -b rehearsal/join-1 /home/user/wt/rehearsal origin/lane/join-2026-11-14
```
(The fetch only updates remote-tracking refs. If `git worktree add` says the branch exists, stop and say so.)
`/home/user/wt/line/node_modules` is a real directory. Give the new worktree a SYMLINK to it
(`ln -s /home/user/wt/line/node_modules /home/user/wt/rehearsal/node_modules`); only if a tool fails because of the
link, remove the link and run `npm ci` in the new worktree (say which tool and why). If a merged `package.json` or
lockfile differs from the line's, say so in the report: it is a finding.

Your scratch directory: `/tmp/claude-0/-home-user-settlement-engine/716f8968-c3c3-52a7-92aa-37ba085c7c08/scratchpad/rehearsal/`
(logs under `logs/`, the report `REHEARSAL-1.md`).

## Part A — what is not yet on the line, and where the lanes collide

The lane families and the branch that is each family's current tip on origin (`origin/lane/<name>`):

| family | branch |
|---|---|
| people-and-place page | page-8-2026-11-20 |
| display | page-9-2026-11-20 |
| trouble | page-7-2026-11-20 |
| hooks, conflicts, ties | depth-3-2026-11-20 |
| goals and wants | goals-4-2026-11-20 |
| people (powers, founding) | people-2-2026-11-20 |
| place (safety, trade) | place-1-2026-11-20 |
| state sentences | prose-2-2026-11-20 |
| daily life | daily-2-2026-11-20 |
| traditions | trad-5-2026-11-20 |
| session sheet | frame-7-2026-11-20 |
| sameness door | same-2-2026-11-20 |
| who rules | seat-6-2026-11-20 |
| fortune | fortune-3-2026-11-20 |
| share veil | veil-27-2026-11-20 |
| share veil's doors | veil-doors-3-2026-11-20 |
| names | names-4-2026-11-20 |
| titles | titles-3-2026-11-20 |
| grants (migration 213) | sec-grants-2-2026-11-20 |
| CI fit | ci-fit-75-2026-11-20 |

For EACH: is its tip already an ancestor of `origin/lane/join-2026-11-14` (then it is "on the line": say so and drop
it)? If not: the merge-base with the line, commits ahead and behind, and the files it changes since the merge-base
(`git diff --name-only <base>..<tip>`), counted apart for `src/`, `tests/`, `scripts/`, `supabase/`, `vite.config.js`
and everything else (docs).

Then THE COLLISION TABLE: every file outside `docs/` that TWO OR MORE unlanded lanes change, with the lanes that
change it, most-shared first. This table is the first thing the chair reads: keep it complete, one row a file.

## Part B — the trial merges

In the table's order above (skipping what is on the line), on `rehearsal/join-1`:
`git merge --no-ff --no-edit origin/lane/<branch>`.

On a conflict, by kind:
- A REGISTER, CENSUS OR FROZEN LIST (for example `scripts/census/pool-dominance.register.json`, the lighting census
  the walker `tests/lint/sovereigntyLightingContract.walker.test.js` freezes, any `*.register.json`, any stored
  fingerprint or count): take THE REHEARSAL BRANCH'S side for the conflicted hunks (`ours`), finish the merge, and
  list the file as "OWED: its own door at the real join". Do not re-run doors in this rehearsal.
  ONE ROW IS ALREADY RULED: `ledger:npcData:STRESS_ECONOMIC_EFFECTS.mutual_leverage` takes the line's values.
- A TABLE OR LIST WHERE BOTH SIDES ONLY ADD DISTINCT ENTRIES (a class table such as
  `tests/lint/presumptionClasses.shared.mjs`, a vocabulary or pattern list, an index of imports): keep both sides'
  additions, finish the merge, list it as "union" with the entries each side added.
- ANYTHING ELSE (two sides changed the same lines of logic, a file one side moved or deleted, a test both rewrote):
  DO NOT GUESS. Record the file, the function or symbol, and both sides of the first conflicting hunk (at most 12
  lines a side); `git merge --abort`; mark the lane NOT JOINED with that reason; go on to the next lane.
  A lane left out is a finding, not a failure.

For each lane record: joined clean / joined with listed resolutions / NOT JOINED, and the merge commit.

## Part C — the joined tree, measured once

After the last merge, on whatever joined:
1. `npm run typecheck:ratchet` and `npm run typecheck:domain:strict`: the counts each prints (the line today: 167
   and 1113) and whether each gate passes.
2. `npm run lint`: errors (the line today: 0).
3. `npx vitest run tests/lint` WHOLE, once: files and tests passed and failed, and EVERY failing test BY NAME (file,
   title, the first line of its message). The line today: 220 of 220 files, 3,271 of 3,271 tests. Before it:
   the ledger ref must be fetched (the set-up line does it), or `ledgerCitationIntegrity` reads falsely red.
4. `npm run build`, then the two build tests `tests/build/vendorPdfLazy.test.js` and
   `tests/build/generationWorkerLazy.test.js`, and the sizes of: the generation worker, the engine chunk, and first
   paint (raw, gzip, Brotli), read the way
   `/tmp/claude-0/-home-user-settlement-engine/716f8968-c3c3-52a7-92aa-37ba085c7c08/scratchpad/size/SIZE-PROJECTION.md`
   and the scripts under `.../scratchpad/ci/bin/` read them (use the repository's own size-budget test or script;
   name it). The line at 8196e5712: worker 2,617,934 B; engine chunk 921,741 B; first paint raw 1,177,668 B, gzip
   374,676, Brotli 314,472. Give each joined figure beside these.
Each gate's whole log goes under `logs/`; the report quotes only counts and names.

If a step cannot run on the joined tree (a syntax error from a merge, an import that no longer resolves): record the
exact error, the file and the two lanes that meet there, and go on to the next step where one can still run.

## The report (`REHEARSAL-1.md`), in this order

1. One paragraph: how many lanes joined, how many did not, and the one thing the chair should know first.
2. The lanes table (Part A facts and Part B outcome, one row a lane).
3. The collision table.
4. Every conflict, by lane, with its kind and what you did.
5. Part C's counts, every failing test by name, and the sizes beside the line's.
6. What the real join owes that this rehearsal skipped (every "OWED: its own door" file).
End with two labelled lists: CONFIRMED (executed, with the log's file name) and PLAUSIBLE (read, not run).

Your final message to the chair: at most 250 words, the report's first paragraph and its path. If you meet something
that needs a ruling before you can go on (not a plain conflict: those you record and pass), stop and say what.
Leave the worktree and its branch in place when you finish: the chair uses the joined tree afterwards.
