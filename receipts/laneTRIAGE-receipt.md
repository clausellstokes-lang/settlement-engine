# laneTRIAGE receipt — CAR-TREE-TRIAGE (ODQ §657.2, finding I21)

**Lane:** CAR-TREE-TRIAGE (Opus, MEASURE-ONLY)
**Date:** 2026-08-25
**Mandate:** REF-PIN then triage the main checkout's 3,374 unstaged deletions + 1,267 modifications.
**Tree mutation:** NONE. No checkout, restore, clean, stash, add, or commit against the real index.

---

## 0. THE PIN (report this first)

```
refs/preserve/tree-triage-pin-2026-08-25 -> 937889b263371519ad05a7e9cd7849ae19f83c0c
tree                                        1b4bd25a88123ca190d27a32a1c456f90029ebe1
parent                                      d3c9f64a4 (HEAD at pin time)
```

Built by the private-index method: `GIT_INDEX_FILE=<scratchpad>/triage.index git add -A`
→ `git write-tree` → `git commit-tree` → `git update-ref`, temp index then deleted.

**Safety proof (CONFIRMED, executed):**

| Probe | Before pin | After pin |
|---|---|---|
| `git status --porcelain` line count | 4731 | 4731 |
| `git status --porcelain` md5 | `a99ec1fa…a263` | `a99ec1fa…a263` (`cmp` IDENTICAL) |
| `.git/index` mtime | 2026-08-17T03:32:10.082Z | 2026-08-17T03:32:10.082Z |

Re-verified at end of lane: index mtime still `2026-08-17T03:32:10.082Z`. The real index and the
working tree were never touched. **This is the by-construction proof the chair's ledger method is safe.**

---

## 1. WHAT — the inventory

`git status --porcelain` = 4,731 entries:

| Code | Count | Meaning |
|---|---|---|
| ` D` | 3,262 | worktree deletion, unstaged |
| ` M` | 1,267 | worktree modification, unstaged |
| `D ` | 113 | **staged** deletion |
| `??` | 77 (1,011 expanded) | untracked |
| `MD` | 9 | staged mod + worktree deletion |
| `MM` | 3 | staged mod + further worktree mod |

Worktree-deleted tracked paths: **3,384**. Index-vs-HEAD differences: **125**.

**Coherence: NO.** The deletions span **271 distinct depth-2 directories** — `src/domain` (576),
`tests/domain` (436), `src/components` (276), `tests/ui` (118), `tests/security` (116),
`public/landing-maps` (80), `supabase/functions` (79), `supabase/migrations` (59), `map-corpus`,
`docs`, `scripts`… This is not a subsystem, a cull, or any pattern with an intent behind it.

---

## 2. WHEN / WHO

**mtime histogram of the 1,267 modified files, by day:**

```
2026-06-12   62     2026-07-13    9     2026-07-26    1
2026-06-13    6     2026-07-14   78     2026-07-28    2
2026-06-17   13     2026-07-15   69     2026-08-03    1
2026-07-08    2     2026-07-16   41     2026-08-15    2
2026-07-09   59     2026-07-19    1     2026-08-20    3
2026-07-10   83     2026-07-22  793     2026-08-24    1
2026-07-11   31                          2026-08-25    1
2026-07-12   12
```

The oldest carry mtime **2026-06-12T12:27:50** — the clone moment (`.git/logs/HEAD` line 1:
`clone: from https://github.com/clausellstokes-lang/settlement-engine`, epoch 1781270869).
The last mass write to disk was **2026-07-22 (793 files)**. Effectively nothing since.

**Reflog:** 2,227 entries spanning 2026-06-12T13:27:49Z → 2026-08-25T05:18:41Z.
**972 of them have an EMPTY message** — the signature of `commit-tree` + `update-ref` plumbing,
i.e. the estate's private-index ledger commits, which advance the branch **without ever touching
the working tree or the real index**.

**Codex CLI involvement (ruled out as cause):** 5 refs under `refs/codex/turn-diffs/checkpoints/…`,
all pointing at *trees*, timestamps embedded in the ref path:

| epoch-ms | UTC | tree | dist→worktree | dist→HEAD |
|---|---|---|---|---|
| 1787198652084 | 2026-08-20T04:04:12Z | `1213ededaa` | 71 | 5504 |
| 1787233442637 | 2026-08-20T13:44:02Z | `cd8c513c1b` | 32 | 5494 |
| 1787267367504 | 2026-08-20T23:09:27Z | `cd8c513c1b` | 32 | 5494 |
| 1787285201079 | 2026-08-21T04:06:41Z | `cd8c513c1b` | 32 | 5494 |
| 1787297744557 | 2026-08-21T07:35:44Z | `cd8c513c1b` | 32 | 5494 |

At the **earliest** Codex checkpoint the tree was already ~5,500 files from HEAD. Codex
photographed the condition; it did not create it. `cd8c513c` is **not** in HEAD's last 1,200 commits.

**Concurrent-session hazard, live:** HEAD moved *during* this lane, `d3c9f64a4` (§657) →
`3fa0492b3` (§658, 2026-08-25 00:18:41 -0500). A sibling is committing to this branch right now.

---

## 3. WHAT KIND

**10 sampled modifications — 9 of 10 match an EXACT historical version of that same file:**

```
NO-HISTORY-MATCH  .claude/launch.json          (tool-written local config)
MATCH-HISTORY 2026-06-06  scripts/validate-edge-functions.mjs
MATCH-HISTORY 2026-06-17  src/components/generate/WizardLoadedBanners.jsx
MATCH-HISTORY 2026-07-16  src/components/settlement/ExportSheet.jsx
MATCH-HISTORY 2026-07-12  src/domain/fieldManifest.js
MATCH-HISTORY 2026-07-14  src/domain/worldPulse/tierResourceDynamics.js
MATCH-HISTORY 2026-06-05  src/lib/roadNetwork.js
MATCH-HISTORY 2026-06-04  tests/components/autoSaveChip.test.jsx
MATCH-HISTORY 2026-07-15  tests/domain/rulingPower.test.js
MATCH-HISTORY 2026-07-09  tests/joins/services.test.js
```

**Whole-population confirmation** — all 1,267 disk blobs matched against one commit per calendar day
of the branch (88 commits). Exact-match count:

```
2026-07-15  1f7e20c7d   1113 / 1267   87.8%   <-- PEAK
2026-07-14  eb0b31a22    981          77.4%
2026-07-16  bb672c944    949          74.9%
2026-07-17  08613d1ba    894          70.6%
2026-07-13  4cf84a40f    871          68.7%
…
2026-08-22  18f4496ad      0
2026-08-23  5757b9d24      0
2026-08-24  d28c3e65e      0
2026-08-25  3fa0492b3      0            <-- current HEAD
```

A single sharp peak at **2026-07-15** decaying smoothly in both directions. That is the signature of a
**frozen checkout**, not of edits and not of a deletion campaign.

**10 sampled deletions — every one was ADDED to the branch after the tree froze:**
`.nvmrc` 2026-07-01 · `docs/samples/organic-craft/ornament/cartouche-thornwall.svg` 2026-07-18 ·
`src/domain/certification/subsystemRowsVirtual.js` 2026-08-04 ·
`src/domain/worldPulse/disinformationPlant.js` 2026-08-03 ·
`tests/domain/pactProposals.test.js` 2026-08-06 · `tests/helpers/townCartographyFixture.js` 2026-08-01 …

**Move test:** 9 of 10 TRULY-ABSENT. The one hit (`public/media/journey-legs/bg/still-4-town.jpg`)
resolves to unrelated copies under `marketing/website/`. **`townCartography` has zero trace on disk**
(`find -iname '*ownCartograph*'` → empty); it is 11 files at HEAD, authored 2026-08-01…2026-08-10.
**These are stale absences, not renames.**

**The 125 "staged" entries are two different things.** The index was written **2026-08-17T03:32:10Z**;
HEAD at that moment was `a6f99c2048`.

- vs `a6f99c2048` (its own HEAD): **33** differences → a real, abandoned `git add` of
  `docs/DESIGN_FP_ARCH_*.md` etc. from 2026-08-17, never committed from the main checkout.
- vs current HEAD: **125** → the other ~92 are pure HEAD-drift (e.g. `map-corpus/*` was added to the
  branch 2026-08-17 04:59, *after* the index was written, so it reads as a staged deletion).

---

## 4. THE HYPOTHESES

| # | Hypothesis | Verdict | Evidence |
|---|---|---|---|
| a | Sibling session's in-progress cull/refactor | **REFUTED** | 271 scattered directories, no subsystem coherence. Sweep of `docs/DEAD_CODE_DISPOSITION.md` and `docs/DISPOSITION_WAVE_AMENDMENT_2026-08-06.md` — the only disposition docs — found **zero** mentions of cartography (verified `rg` exit 1, not an error). No `mass delete` / `delete tree` / `remove subsystem` / `rm -rf src` / `git rm -r` anywhere in `docs/`. The parked CULL item is the owner-gated V5 *aesthetic image* cull — unrelated. |
| b | Interrupted lane that died mid-operation | **REFUTED** | An interrupted op leaves one timestamp cluster. This has a 6-week mtime spread peaking 2026-07-22 and a clean 2026-07-15 content peak. Also present and unchanged across four Codex checkpoints spanning 27 hours. |
| c | Tool accident / mass `rm` | **REFUTED** | An `rm` deletes files that *were* on disk. Every sampled deletion is a file **added to the branch after the tree froze** — it was never written to this disk. No mtime cluster, no reflog trace, and the 87.8% content peak is inconsistent with removal. |
| d | Intentional owner work | **REFUTED** | Owner work would produce novel content. 9/10 modifications are byte-identical to older commits of the same file; the 10th is `.claude/launch.json`, written by the preview tool. |
| **e** | **Checkout drift — the tree was never re-synced while the branch advanced by plumbing** | **CONFIRMED** | 972 empty-message reflog entries = private-index `commit-tree`/`update-ref` commits, which by construction never touch the working tree. Lane work happens in ~50 registered worktrees. Main checkout last synced ≈2026-07-15/22 and simply stayed there. Corroborated by the pre-existing memory `main-checkout-is-a-different-tree-false-absent.md` (measured 2026-08-23 at slot `5055990a`: townCartography 0/13, undercity 0/6, interior 0/7, worldPulse 126/396, 4,722 dirty paths). |

---

## 5. THE RISK MAP

**Recoverability of the deletions/modifications: total.** All 3,384 deleted paths and all 1,267 stale
files are at HEAD by definition. Nothing there is at risk.

**⛔ THE REAL EXPOSURE — 922 files / 94.60 MB exist ONLY on disk.** Of 1,011 expanded untracked files:
89 byte-identical to HEAD, 20 differing, **902 absent from HEAD entirely**.

```
823  docs/archive          <-- HEAD has 1 file (docs/archive/BUILD-LOG.md). Disk has 824. 7.3 MB.
 19  marketing/website     <-- HEAD has 0. Disk has 432 files.
 17  map-corpus/docs       <-- HEAD 69, disk 78
  6  src/components         3  docs/briefs        3  tests/ui
  2  marketing/assets       2  public/map         2  src/generators
  1  docs/START_HERE.md (disk 2000efeb6 != HEAD f1d31e8fd)
  … 30 more single docs/ design + program files
```

**Verified with `git log --branches --tags --remotes -1 -- <path>` → `<NONE>` for
`docs/archive/README.md`, `docs/archive/memory-estate/population-figure-copy-law.md`, and
`docs/archive/ORPHANED-STASH-analytics-intelligence-layer.patch`.** Before this lane's pin, the
memory-estate archives — the verbatim targets of the MEMORY.md index — existed in **no branch, no tag,
no remote**. One `git clean -fdx` from total loss.

**Now preserved: 922/922 captured byte-identically in the pin (0 missing).**

Live ledger files are healthy — `docs/OWNER_DECISION_QUEUE.md` (1.88 MB), `HANDOFF_CURRENT.md`,
`RESUME_STATE.md`, `SIGNED_CONSTANTS.md` are all byte-identical to HEAD; the chair writes them to the
main working tree and commits via private index, which works. `docs/START_HERE.md` is the one that drifted.

### Unsafe while this stands

- ⛔ **`git commit -a` / `git commit <path>` / any default-index commit from the main checkout.**
  The resulting tree would be the July-15 tree: **5,463 files changed, 1,069,320 deletions** landing on
  the branch as a single mass-deletion commit.
- ⛔ **`git add -A` / `git add .`** — would stage 3,384 deletions into the real index.
- ⛔ **`git clean -fd` / `-fdx`** — would destroy the 922 files / 94.6 MB, incl. the whole memory-estate archive.
- ⛔ **`git checkout .` / `git restore .` / branch switch** — would discard the 33 genuinely-staged
  2026-08-17 doc edits and rewrite 4,651 paths.
- ⚠ **Any `grep -r`/`find` over `src/` in the main checkout is a FALSE-ABSENT generator** — 977 src files
  on disk vs 2,106 at HEAD. (Already a standing memory; this lane re-confirms it.)
- ⚠ **HEAD is moving.** It advanced `d3c9f64a4` → `3fa0492b3` mid-lane. Re-read it at every boundary.

### Safe by construction

The chair's private-index ledger commits (`GIT_INDEX_FILE=<tmp> git add -A` → `write-tree` →
`commit-tree` → `update-ref`) touch neither `.git/index` nor the working tree. **Proven executed**
this lane: `git status` byte-identical before/after, index mtime unchanged (§0). Lane worktrees with
their own `node_modules` are likewise unaffected.

---

## 6. VERDICT

# ORPHANED — no owner, no operation.

Nobody owns this because it is not an act. It is the **arithmetic consequence of the estate's own commit
method**: the build era runs in ~50 lane worktrees and lands via plumbing ref-updates, so the main
checkout's working tree has had no reason to be re-synced since ≈2026-07-15 and never was. The
"3,374 deletions" are files that were **never written to this disk**, and the "1,267 modifications" are
**authentic older commits of those same files**.

`src/domain/townCartography/` is live, legitimately-authored code (11 files at HEAD, `6e96e259f`
2026-08-01 → `5a6f76fee` 2026-08-10). Nothing proposes deleting it.

**Disposition recommended to the chair (the chair rules; this lane restored nothing):**

1. **Do not `git clean`.** The 922-file / 94.6 MB untracked set is the only copy of the memory-estate
   archive. It is now pinned at `937889b26`, but the pin is a loose ref — it is not pushed.
2. **Commit the orphaned content to a branch before any tree repair.** `docs/archive/**` (823 files),
   `marketing/website/**` (432 files), and the ~30 orphan design docs deserve a real home. This is
   owner-gated (new persisted content + what amounts to a branch decision), so it is the chair's call,
   not this lane's.
3. **Then, and only then**, re-sync the main checkout — and adopt the standing rule that the main
   checkout is a *ledger surface only*, never a build or test surface.
4. **Resolve the 33 staged 2026-08-17 `docs/DESIGN_FP_ARCH_*` edits** — decide whether they were
   superseded by the lane that committed from a worktree, or are still owed.
5. **Correct a stale memory row.** `main-checkout-is-a-different-tree-false-absent.md` says the branch
   "has no src/ app code from the engine lineage". Measured today: **HEAD carries 2,106 `src/` files**;
   it is the *disk* that has 977. The branch is fine; the disk is stale.

---

## 7. Provenance of the finding (independent corroboration)

This was already recorded before the lane opened, and recorded as unclaimed:

- `docs/OWNER_DECISION_QUEUE.md` §657.1 line ~27861 — finding **I21**; §657.2 lists
  `CAR-TREE-TRIAGE (I21, REF-PIN first)` under "START NOW (repair/process class)".
- `docs/OWNER_DECISION_QUEUE.md` §517.7a (banked 2026-08-23) — the earliest measurement, 4,722 dirty paths.
- `docs/HANDOFF_CURRENT.md` line 63 — the ⚠⚠ row.
- `…/31585ce2-…/scratchpad/receipts/laneBRIDGE-receipt.md` §9.10 (2026-08-24 21:56) — **first sighting**:
  "If that is not a sibling mid-operation, someone should look."
- `…/31585ce2-…/scratchpad/review654/halfstate-inventory.md` R8 and `CONSOLIDATED.json` `impeding[20]`.

None of the five most recent lane receipts claims the deletions — consistent with I21's "unclaimed",
and now explained rather than merely unclaimed.
