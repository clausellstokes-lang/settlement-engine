---
name: shared-index-commit-race
description: "⚠️ Two sessions committing in the SAME worktree share ONE git index — staging races can sweep a stranger's staged files into your commit; cure = pathspec commits + yield protocol"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9da82bae-e647-4a0f-a67e-4df673241f0a
  modified: 2026-08-01T02:30:23.686Z
---

2026-07-27, minifold worktree: two sessions executed the same owner fold list simultaneously. While one session's staging chain ran (update-index + git add), the twin committed `d0fdcf7c` — the shared index reconciled silently (identical content), but had the sets differed, either commit would have swept the other's staged entries under the wrong message. Also observed: `git log -1` in a fresh Bash call ran in the WRONG worktree because cwd had reset to the session default (wrong-lineage trap on a read).

**Why:** worktrees have per-worktree index files, but two sessions in the SAME worktree share one index; `git commit` commits whatever is staged, regardless of who staged it.

**How to apply:** (1) In a two-writer worktree, prefer `git add <paths> && git commit -- <same paths>` — a pathspec commit ignores everything else staged, so a concurrent stager can't be swept. (2) Before EVERY commit: fresh `git log -1` + `git diff --cached --stat` and abort if foreign entries appear. (3) Yield protocol: if the twin shows fresh mtimes on a lane (or `lsof +D <worktree>` shows live claude/node/esbuild processes), do not fold that lane — verify its output instead; mtime quiescence alone is NOT death (a 10-min verification gate is silent), check processes. (4) Prefix every Bash call with an explicit `cd <worktree> &&` — cwd resets between calls. (5) You cannot MESSAGE a terminal-CLI twin: CCD session tooling (list/search/send_message) sees only CCD-app sessions — verified 2026-07-27 when the F4 ratchet twin was invisible to both transcript searches. The memory dir + index is the only reliable cross-session channel; put coordination-critical state THERE, and beware the two-writer memory race (both sessions updated f4-pglite-hook-timeout-class.md within ~15 min; the later Write clobbered the earlier body — re-read a memory file immediately before rewriting it, and prefer surgical Edits over whole-file Writes in contested files). Related: [[minifold-tree-is-live]], [[wrong-lineage-worktree-trap-2026-07-14]].

**AMENDMENT 2026-07-31 — THE HAZARD ACTUALLY FIRED, and the victim was the careful
session.** In minifold, a twin committed `1aa98909` ("Wave G: the realm places itself,
with consent") at 22:00:04 while this session held UNCOMMITTED work in the same tree.
That commit swept in **two files it does not mention**:
`src/domain/certification/subsystemRowsWaves.js` (certification prose for the wizard-news
id fix) and `src/domain/worldPulse/realmVerbExecution.js` (a news-id collision fix). Both
are now committed under an autoplacement commit message that describes neither, so
`git log` attributes them to the wrong wave and a bisect on the news change lands on
Wave G. The twin's own body even ends "Tooltips route through the heading/aria idioms per
the guidance census", which is the tell that it bulk-staged the whole tree.

Consequences to expect and check for:
- Your dirty set SHRINKS without you doing anything. Two of my files stopped appearing in
  `git status` mid-task; I only noticed because a `git diff` against a base worktree came
  back EMPTY for files I had definitely edited. **That empty diff is the detection signal.**
- A gate run that straddles the twin's commit produces phantom reds: my run flagged a
  `title=` census (491 vs baseline 487) that PASSED at the twin's commit, because the run
  saw their new JSX with the pre-commit baseline. Re-run any red at a fresh base worktree
  before believing it.

**How to apply (added):** when you hold uncommitted work in a shared worktree, snapshot
`git status --short` to a file AND re-diff before every conclusion; if a file you edited
shows no diff, check `git log -p -1 -- <file>` for a twin commit that swallowed it. Do NOT
amend or rebase the twin's commit to extract your work (never rewrite a foreign HEAD) —
report the mis-attribution to the owner and let them decide.

⭐ **THE ISOLATED GATE — the only trustworthy green in a contested tree.** Running
`npm run check` in a tree a twin is actively editing is worthless: on 2026-07-31 the same
change produced 5 reds, then 31, purely from the twin's wave landing mid-run (a CREATE_ROUTE
event lane: `+1 migration tripped 5 docs/* freshness tests`, an undo fixture gap, edge-bundle
freshness, and two any-cast rows in THEIR new files). None were mine, but no run could show
that. The recipe, which also gives per-file attribution for free:

    git worktree add "$SCRATCH/mygate" <base-sha>
    ln -sfn <real-worktree>/node_modules "$SCRATCH/mygate/node_modules"   # else npm ci EUSAGE
    while read -r f; do cp "$f" "$SCRATCH/mygate/$f"; done < "$SCRATCH/my-files.txt"
    cd "$SCRATCH/mygate" && npm run lint && npx vitest run
    git worktree remove --force "$SCRATCH/mygate"

Keep `my-files.txt` current from the first edit — it is the input to both this gate and the
pathspec commit. The same worktree also settles "is this red mine?" definitively: run the
suspect suite at base, then at base+my-files, and diff. Related: [[minifold-tree-is-live]],
[[lane-end-gate-gotchas]], [[worktree-npmci-eusage-node-modules-walkup]].

**AMENDMENT 2026-07-27 (the b1aeec6d fold):** the two safety mechanisms CONFLICT
— `git commit -- <paths>` commits WORKING-TREE content (git's `--only` default),
so a hunk-carved file (staged via `git hash-object -w` + `git update-index
--cacheinfo`) CANNOT ride a pathspec commit; it needs a plain index commit,
which is exactly the shape the shared index makes dangerous. Resolution used:
explicit hold-handshake with the twin via THIS memory dir + CCD message, staged
list diffed against a written plan file, then a no-pathspec commit. Also
proven: lint-staged's stash cycle preserved carved staged blobs byte-exactly
(committed hashes == hash-object outputs) while "hiding unstaged changes to
partially staged files" — the carve survives the hook.

**AMENDMENT 2026-08-03 — THIRD FIRING, and this time the careless one was ME (Lane B,
MG-3 magic-toggle leak closures).** Commit `3b0f5b9c` ("MG-3b: no arcane verdict where
magic does not work") swept in two files from the concurrent Founders-Hall lane:
`src/components/founders/FoundersPage.jsx` (-246) and
`tests/components/foundersPage.test.jsx` (-43), both DELETIONS that lane had staged.
No work was lost — that lane genuinely intended the deletion and its very next commit
(`531a8488`) added the FoundersHallPage replacement — but the deletion is now attributed
to a war-magic commit that does not mention it, and a bisect on the Founders surface
lands in the middle of the magic toggle.

**The exact mechanism, which the existing cure names and I did not use:** I ran
`git add <my explicit paths> && git commit -m "..."` with NO pathspec on the commit.
Explicit staging is NOT enough — `git commit` without `--` commits the whole index,
including entries a twin staged microseconds earlier. The five other commits in the same
session (85d94ac7, 9f8eadbc, 2a7da7fc, 59f05305, 96e27699) came back clean, so this is a
RACE that fires intermittently: staging carefully and getting away with it five times out
of six is the trap.

**How to apply (sharpened):** the pathspec belongs on the COMMIT, not just the add —
`git add <paths> && git commit -- <same paths> -m "..."`. And audit AFTER the fact, not
only before: `git show --stat <sha>` on each of your own commits at lane end, because the
pre-commit `git diff --cached --stat` check passes when the twin stages in the window
between your check and your commit. Do NOT rewrite history to fix the attribution when
another live session is committing to the same branch — report the mis-attribution and
leave the commits alone.

**AMENDMENT 2026-08-03 — THIRD FIRING, and the failure was READING THE INDEX LINE
INSTEAD OF THE FILE.** Lane W8-D, minifold: commit `83a627b3` (a one-line test-allowlist
repair) swept in EIGHT files of a concurrent Ribbon lane — `FletchBand.jsx`,
`GooseFletch.jsx`, `NavDivider.jsx`, `NavRibbon.jsx`, `theme.js` and three nav tests,
+1119/-780 — because the twin had ALREADY STAGED them (`git status` showed `A `/`M ` in
the first column) before I ran `git add <my file> && git commit -F -`. Same mechanism as
the 07-31 firing, verbatim.

**The specific epistemic failure worth recording, because it is repeatable:** the MEMORY
INDEX line for this file says "cure = pathspec commits + yield protocol", and I read that
line at session start and believed I was complying, because `git add <explicit path>`
FEELS like a pathspec commit. It is not. The distinction lives in the file body, not the
index line, and the index line cannot carry it. **If a hazard's cure is a
distinction between two similar-looking commands, open the file — the one-line
description will not save you.**

**The recovery attempt is also worth recording, because the guard worked.** I attempted
`reset --soft HEAD~1` + a pathspec re-commit, but guarded it with an explicit
`test "$(git rev-parse HEAD)" = "<my sha>" || exit 1`. **The guard FIRED**: Lane RT-3 had
landed on top in the ~90 seconds since my commit, so the reset would have dropped a
stranger's commit. Aborting was correct. **Always guard a reset with a HEAD equality
assertion in the SAME shell command as the reset** — in this tree HEAD moved under me
three separate times inside one hour (65cd91fc, 2c381e0b, 32e25808, ae547044 all landed
mid-lane).

Damage assessment that made "leave it" the right call: `git diff 83a627b3 -- <the eight
paths>` returned EMPTY, so the twin's work was committed whole and intact, just under the
wrong message. Attribution damage only. Corrected by hash in
`docs/FABLE_VALIDATION_QUEUE.md`'s lane W8-D row (@ `7e9479b3`) rather than by rewriting
history. The four later commits in the lane (`6039f993`, `bf731ea6`, `9e6ac0bf`,
`7e9479b3`) all used `git commit -- <paths>` and all came back with EXACTLY their own
files, audited at lane end with `git show --name-only` per commit.
