# HANDOFF FOR THE ACCOUNT SWITCH — 2026-09-16 ~11:4x EDT (box clock), written by the chair (Fable 5.1, session f6ac0d98)

The owner's words (11:3x): "Pause and save the lanes and agents for the simulation work. Note that we're likely going to switch accounts to continue the work so prepare for that. Do not stop and please continue with the deployment work."

A successor on ANY account reads, in order: (1) this file whole; (2) `$SC/LANE-STATUS.md`; (3) the tail of `$SC/RESUME-NOTE.md` (the diary; entries `+ 09-16 …`); (4) the memory index START HERE row (`~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/memory/MEMORY.md`, same machine, any account); (5) `docs/HANDOFF_CURRENT.md` on the ledger branch. The repo is authoritative; executed evidence beats every summary including this one.

```
SC = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit      (the kit: diary, docks, tools; autosaved every 5 min to refs/preserve/chair-tools-2026-09-05)
MY = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad         (this chair's scratchpad: arch-932, recon-32-34, c932, ci-repro; COPIED under $SC/f6ac0d98-chair/ so the kit seal carries it)
REPO = /Users/cstokes/Desktop/settlement-engine        (main checkout; HEAD = the ledger branch review-fixes-2026-07-08 = 3b506360f; its src/ is a FOSSIL, never read code there)
DEPLOY = /Users/cstokes/Desktop/settlement-engine-deploy   (detached worktree carrying the chair's deploy-day cars; node_modules symlinked; linked to Supabase project uhozyhcdccbhigvlacdu)
```

## 1. What is PAUSED (the simulation work) and exactly how to resume it WITHOUT the run cache

Both workflow runs were stopped by TaskStop at 11:3x on the owner's word. A new session cannot `resumeFromRunId` (same-session only), so two CACHE-FREE variants exist that skip the finished families and start from the files on disk. Run ONE OF EACH at most, in parallel (the owner, 09-15 22:3x: "only recon and architecture, one of each"), nothing implements until ALL architecture and the ARCH-SIM fold are done (owner, 09-15 22:3x), then trains via `$MY/c932/board-train.sh`, the door train D0 first.

**A. The architecture (Fable architects one family at a time; an Opus skeptic checks; the architect corrects; then the fold).**
State on disk under `$MY/arch-932/briefs/` (13 briefs): TR DONE and skeptic-corrected (briefs 1, 2, 7, 8, 55, 56a, 56b, 56c); WF 5 of 8 on disk, NO skeptic pass yet (briefs 5, 16a, 16b, 17a, 17b; missing lanes 18 WF-4, 19 WF-5a/b, 20 WF-7, 21 WF-8, 22 WF-9); `plans/plan-WF.md` (77 KB) exists. Families still to architect, in boarding order: WF (finish) → POP → WY → IN → ES → WC → HB → EP → INT → GR-CW → LG, then the fold `ARCH-SIM`. Each family costs ≈ 1.6 M tokens on the Fable seat; the session window is ≈ 7 M tokens per 5 h.
Relaunch:
```
Workflow({ scriptPath: '<MY>/c932/architect-serial.resume.workflow.js', args: <the JSON in <MY>/c932/args-architect.resume.json> })
```
The variant reads `args.families` (the families still to do) and `args.priorSummaries` (seeds the RESUME RULE so the WF architect keeps its five briefs and writes the missing three lanes). Agents read `ARCHITECTS-CARD.md` (20 KB) and open `ARCH-PROTOCOLS.md` + `ARCH-PROTOCOLS-ADDENDUM-1.md` at the section a car needs. The CHECKPOINT RULE applies to every family (progress files under `$MY/arch-932/progress/`). If a family dies mid-way: rerun with `args.families` trimmed to what is left; briefs on disk are kept by the RESUME RULE.

**B. The history census (two readers per family, an adjudicator, a skeptic, a fold; batch 1 = WF POP WY IN WC, batch 2 = HB INT GR-CW LG only if every batch-1 family yields ≥ 1 status change or record≠code row).**
Folds DONE under `$MY/recon-32-34/`: `HISTORY-TRADE-2026-09-15.md` (the pilot), `HISTORY-WF-2026-09-15.md` (1 status change, 10 record≠code, 5 car 0s), `HISTORY-POP-2026-09-15.md` (3, 9, 5). WY: both readers DONE (`history/WY/ledger.md` 52 KB, `history/WY/older.md` 48 KB); the adjudicator was mid-verification (its `adjudicator.md` is a 277 B skeleton; its findings so far are in `history/WY/progress-adjudicator.txt`, e.g. the MissionRec finding at roads/state.js:78-79); skeptic and fold not run. IN and WC not started (WC has scratch files only).
Relaunch:
```
Workflow({ scriptPath: '<MY>/c932/history-census-families.resume.workflow.js', args: <the JSON in <MY>/c932/args-census.resume.json> })
```
The variant skips `args.skip` (WF, POP) using `args.priorFolds` for the pilot rule, and starts WY at the adjudicator from `args.readersDone.WY` (the two reader files). Each family costs ≈ 1.2 M tokens.

**Why paced this way:** two session-limit deaths on 09-15 (a 15-reader fan-out at 19:2x; ~2.7 M tokens/h at 23:48). Never SendMessage a workflow's in-flight agent (it forks a concurrent turn). Stop a run by its TASK id (printed at launch), not the `wf_` run id.

## 2. What is RUNNING (the deployment work) — carry it on

- **Backend deployed** (by the owner's hand, this morning): production Supabase at migration 200, 32 edge functions (16 `--no-verify-jwt` per config.toml), `stripe-webhook` last. The DB is AHEAD of the deployed client (safe direction).
- **GitHub (public repo `clausellstokes-lang/settlement-engine`)**: the build slot `claude/composite-r4` = a5876c0ea pushed; the ledger `review-fixes-2026-07-08` = 3b506360f pushed (the remote's old line kept as `review-fixes-2026-07-08-remote-2026-07-28`); all `refs/preserve/*` seals pushed.
- **Master is PROTECTED** (rulesets: pull_request, required_status_checks, non_fast_forward, deletion). Required contexts: `Validate, test, build` (the `check` aggregate job, `if: always()`, needs the five gate groups), `Chromium end-to-end`, `Edge function execution tests (Deno)`. Vercel builds master only when CI is green (`scripts/vercel-ignore-build.mjs`).
- **PR #50** `ci-fixes-2026-09-16 → master`, opened by the owner at 10:24 EDT (body empty; a ready body is at `$MY/ci-repro/PR-BODY.md`). It merges when the required checks are green; Vercel then deploys the client.
- **The fixes branch** `origin/ci-fixes-2026-09-16` = the DEPLOY worktree's HEAD. Lineage a5876c0ea → 76cd50953 (191 drop-before-replace) → cadb07c08 (applied-head 200) → 38bb15c33 (PDF worker refresh exclusion) → 00c97247f (campaignRuntimeLazy 120 s) → d22ceff01 (golden SHIFT RECORD row) → 8c9fd0672 (THE GENESIS FREEZE, `Owner-Signed: §901`) → 901dfffce (CI receipts) → e3188076a (e2e workers 2) → a1eeb678c (boot-smoke receipt v2) → d22e99365 (boot smoke: modulepreload probe + closed network) → f23881382 (footer home button 44 px) → faba07290 (test-ratchet receipt) → 0609aaff8 (ratchet cap 45 min) → 17b72e7e6 (the receipt's ESC byte fix). Every car sealed under `refs/preserve/*-2026-09-16` and pushed. These cars compose onto `laneCONSIST-932` at §932; the product ref stays a5876c0ea until then.
- **CI state on 17b72e7e6**: green — validation, type ratchets, lint, build and dist (the boot-smoke red is CURED), Chromium end-to-end (the pointer-target red is CURED), Deno, golden master under tr_TR + Chatham, browser performance. **RED / THE MERGE BLOCKER: `Gate / test ratchet`** has never concluded green on ubuntu-latest in this era (nine runs since 08-15: five cut at the 30-min cap, four FAILURE after 21–28 min; the only public annotation was "exit code 1"). The receipt car makes the next failure publish its verdict and every failed test as annotations (`::error title=test-ratchet verdict::` and `::error title=test-ratchet failed tests::`), readable anonymously via `GET /repos/…/check-runs/<id>/annotations`. `Coverage floors (money / security)` is cancelled at its 10-min cap on every run since 08-15 but is NOT required.
- **Next step for the deploy**: read the receipt on the 17b72e7e6 run (`node $MY/ci-repro/poll-ci.mjs 17b72e7e6` polls; the annotations API gives the text), classify the red (TIMEOUT-class rows on the 4-vCPU runner vs a Linux-only failure vs OOM/no report), cure it as a chair car on the DEPLOY worktree, push to `ci-fixes-2026-09-16`, wait ~30 min, repeat until `Validate, test, build` is green; then the owner merges PR #50. Local tools: `$MY/ci-repro/` (poll-ci.mjs, fetch-spy.mjs, measure-home-button.mjs, receipt.cjs, test-receipt.sh). Each push starts TWO runs (push + pull_request).
- **Lane rules for chair cars on the deploy worktree**: pathspec commits (`git commit -o <file>`), the `Seat: Fable 5.1 — validated` trailer and the Co-Authored-By line, never stash/checkout --/reset --hard, never raise a product ceiling, never edit package.json, validate workflow YAML with BOTH `node -e "require('yaml')…"` and Ruby Psych (`ruby -ryaml -e 'YAML.load_file(…)'`, it catches control bytes GitHub refuses).

## 3. The docks (all under $SC unless stated; a dock is not storage, refs/preserve is)

Clean at a5876c0ea: `lane-932-door`, `lane-932-headroom` (car 4 parked as `$MY/a0/car4.patch`), `lane-932-TR7`, `lane-932-declared`, `lane-932-scribe-recut`. `lane-932-e2e` = 03cbb850a (clean; its car cherry-picked as e3188076a). `lane-932-q10` = 333e07c9e (clean). `lane-932-lt34` = a5876c0ea with 8 DIRTY paths (uncommitted lane work, preserve it). `lane-LT38-ladder` = edd7361cf with 1 dirty (the widened NAV regex, awaits its car). `laneCONSIST-932` = 315080928 (the §932 consist). The long-tail docks (LT15…LT42, lane-scribe, laneRW-DEF1/2, lane-clarity-*) are clean and sealed. Lanes A0/B/D remain PAUSED by the owner's 09-15 directive.

## 4. Owner directives that bind (all recorded in memory; the sharpest here)

"prioritize the recon and then the fixing and implementation of the simulation. Then do everything else" (09-15 16:5x) · "fable is architect · architect only one at a time · just do it sequentially in the architect lane" (18:1x, 23:2x) · "Don't start the implementation until all of the architecture has been made … only recon and architecture, one of each at most in parallel" (22:3x) · "After architecture go straight into implementation. Do it by trains." (21:3x) · "save progress per agent per lane regularly" (23:4x, the CHECKPOINT RULE) · "everything is built LIT ON" (16:5x) · the 14:4x grant: all permissions, everything to the chair's best judgment, the chair keeping push/deploy/migration apply/deletion/spend/Scribe key+price/legal sitting off the table UNLESS the owner instructs (today the owner instructed the push and the deploy) · "sign the golden, push them" = THE GENESIS FREEZE (the door `tests/helpers/goldenRecordDoor.js` + the walker; every future golden move needs a signed shift record + `Owner-Signed: §<row>`).

## 5. Owed at §932 (unchanged)

Compose the deploy-worktree chair cars onto laneCONSIST-932; ledger entry with the owner's words; landing blocks into the family volumes (ADDENDUM-1 R6, `collect-932.sh` refuses without); ratchet `--update` (the golden row ratchets down); rule the six fixtureless `*DormancyGolden` suites; update the STALE ARCH-PROTOCOLS §1.4 row 11 / §2.4; fold MEMORY.md before adding rows (hard limit ~17 KB).

## 6. Seals for this switch

`refs/preserve/chair-kit-f6ac0d98-2026-09-16` = the f6ac0d98 scratchpad (arch-932, recon-32-34, c932, ci-repro) + this handoff + the two workflow journals + the kit diary, pushed to origin. The kit autosave (pid in `$SC/.autosave.pid`, alive since 09-12) keeps sealing `$SC` every 5 min to `refs/preserve/chair-tools-2026-09-05` (read the COMMIT date, not the ref name). If the box was rebooted and `/private/tmp` is gone: `git -C REPO worktree add <dir> refs/preserve/chair-kit-f6ac0d98-2026-09-16` restores this kit; the workflow scripts hardcode the `$MY` paths, so recreate that directory or rewrite the `OUT`/`L`/`H` constants at the top of each script.
