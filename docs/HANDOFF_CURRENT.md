# HANDOFF — CURRENT PROGRAM STATE (model-agnostic successor bootstrap)

**Updated 2026-08-21 at the §321 collection (ledger through §321; refreshed at every collection per ODQ §233). This file is refreshed at
every collection (ODQ §233). If you are a successor — any model, any account —
read this whole file, then docs/START_HERE.md, then the tail of
docs/OWNER_DECISION_QUEUE.md (the ledger; ODQ §§150–§276 plus collecting/amending §§287–§289 contain the map
program's decisions; SPEC fold labels §§277–§286 are design sections, not missing ODQ entries).
The repo is authoritative; trust executed evidence over any summary including
this one.**

## ⛔⛔⛔ PICKUP CARD — REWRITTEN AT EVERY LEDGER COMMIT (owner directive §448: the chair's 5-hour usage window closes often; a successor or the same chair picks up HERE in 60 seconds)

**AS OF 2026-08-22 00:15 CDT 08-23 · ledger §452 · build `claude/composite-r4` = `acc466a6` (28 landings)**

FIRST ACTS ON PICKUP, IN ORDER:
1. `git -C /Users/cstokes/Desktop/settlement-engine log -1 --oneline review-fixes-2026-07-08 claude/composite-r4` — if either moved past this card, the ODQ tail is newer than this card; read it.
2. Re-arm the §388 wakeup (CronCreate `13,33,53 * * * *`, the four checks headlined IS EVERY BUILDABLE CAR BUILDING?) — it died with the session.
3. For EVERY lane in the table below: read its receipt's LAST `RESUME POINT` / `STARTED` block, `git -C <worktree> log -3 --oneline && git -C <worktree> status --porcelain`, then re-dispatch a fresh executor that RESUMES FROM THE RECEIPT (survey-first; verify every claimed proof). Lanes die with the session; their worktrees and receipts do not.
4. Any DETACHED GATE survives: check `<lane>-TERMINAL-*.log` for `TRUE_EXIT=` and `[gate-tail] exit:`; a header-only log with no live `gate-tail` process was killed → re-fire via `chair-detach.py` (program scratchpad). On a two-part green + disk ≥300MB: CAS per the lane's bordered tip block; prune the pin + tree.
5. Ledger every act by the PRIVATE-INDEX method (never `git add -A`; the main worktree matches no branch).

| seat | lane | worktree (6298872d scratchpad) | receipt | state at card time | on pickup |
|---|---|---|---|---|---|
| LANDING | TE-WEB6-LANDING | laneTEWEB6-tree | laneTEWEB6-receipt.md §"THE LANDING SLOT … slot dffa2b97" | rebasing 5b0a399f onto dffa2b97; DRAFT→READY→gate→LANDED; tip in `web6-rebased-tip.txt`; terminal `web6-TERMINAL-<tip8>.log` + `web6-TERMINAL-exit.txt` | collect the terminal if it ran; else resume from the receipt; CAS `dffa2b97 → <final tip>` on green |
| build | TE-WEB3 (Opus) | laneTEWEB3-tree | laneTEWEB3-receipt.md | building WEB-3 (referral emit wiring, migration 199; dormant carry of 198) | resume from receipt |
| build | TE-UC3 (Opus) | laneTEUC3-tree | laneTEUC3-receipt.md | building MF-UC3 (static components) | resume from receipt |
| build | TE-HK-A (Opus) | laneTEHKA-tree | laneTEHKA-receipt.md | three severable commits: HK-1 underways facet key · HK-2 MF-T2H LANDED flip · HK-3 delete WEB-1 requiredSymbols[13] + validator guard | resume from receipt |

COMPLETE AND PINNED (holding for landing slots): WEB-2 `1d93458a` (holding-web2; migration 198, the first DESTRUCTIVE one — lands after the map stack) · UC-0 `a5c6c4fa` (holding-uc0; lands as T-UC1 #1 after the map stack) · T2R `f65b3ff3` (holding-t2r) · T2Q `cc9ef856` (holding-t2q; squash at landing) · T2N `9f05fbb4` (holding-t2n) · WEB-6 `5b0a399f` (holding-web6, IN the landing seat) · WEB-7 `e5975829` · T2J `f7ba3145` · T2K `4d2d17f8` · T2L `6c920593` · T2M `faf3def4`.
LANDING ORDER: WEB-6 → WEB-7 → T2J → T2K → T2L → T2M → producers (T2R → T2Q → T2N) — a ready producer takes the slot if it would otherwise idle. Every GO = the slot pattern; the executed template is laneTEWEB1-receipt.md's landing section; WEB-6/WEB-7 founded `packets/website/` differently — keep-one on the family header, keep-both on rows.
BUILD QUEUE at the next free seat: HK-1 (§445.3) → R-INST-2..6 (Fable) → UC-1/UC-4 (after T2R lands) → UC-2/UC-5 (after T2N+T2Q land).
⭐ §456 OWNER ORDER: the DWELLINGS program runs AFTER its research (not post-endgame) and lands BEFORE the terminal soak; the 300-year soak gains a DW leg (DW-S). RULED CHARTERS: undercity = `draft-UNDERCITY-PLAN.md` (§441/§445); producers = `draft-PRODUCERS-PLAN.md` (§433/§434); website = `draft-WEBSITE-PLAN.md` (§402). Research delivered, owner taste-gate owed: `draft-DWR1A-CONSTRUCTION-HISTORY.md`, `draft-R-INST-1-CIVIC-DEFENSE.md`.
STANDING LAWS FOR EVERY BRIEF: short per-lane TMPDIR (`/tmp/<lane>`) · `export GATE_MUTEX_LOCK_DIR=/tmp/settlementforge-vitest-gate.lock; export GATE_MUTEX_MAX_POLLS=480` on every vitest (§440.2) · `npm run check:tail` BARE, never under the mutex · exits captured in-shell, never `${PIPESTATUS}` · receipt stub FIRST, `RESUME POINT` block at every proof boundary and at least every 30 min (§448) · baseproof at b10ed1a1: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/695a70c5-80ee-4ebd-b806-a8c102244d16/scratchpad/chair-baseproof-b10ed1a1` (re-create with `git worktree add --detach … b10ed1a1` + `cp -Rc` node_modules if purged) · seat model §447 (builds Opus; research/compile/landings Fable).
OWNER DOCKET (unchanged by any lane): O-P1/O-P2/O-P3 paid-surface honesty (§449) · three db-push migrations 195/196/197 (198 coming) · tuning signature · the CT-0 taste sittings (DWR1A, R-INST-1) · R-1/R-3/R-5/R-6/R-7 (§441.8) · O-DW1 · the §436 frontage-tax wording correction · every push.

## ⭐⭐⭐⭐ SUCCESSION ADDENDUM — 2026-08-24 (~01:40), LEDGER THROUGH §439 — READ THIS DELTA FIRST, THEN THE §427 BLOCK BELOW

The §427 block's structure stands; THIS delta supersedes its state figures:

> **§440 CORRECTION (successor, 2026-08-22 19:45 CDT):** item 2 below is WRONG
> — T2H's gate did NOT survive the switch (SIGTERM inside test:ratchet at
> 19:21). RUN 2 was fired 19:27 CDT at the same tip 84e06412, detached by
> setsid; collect it per the receipt's rule (TRUE_EXIT=0 + tail exit line +
> disk ≥300MB at end → CAS b10ed1a1 → 84e06412). Item 4's three lanes were
> re-dispatched from their receipts at §440.4; the wakeup is job 0383ec45.
> NEW LAW §440.2: every battery exports
> `GATE_MUTEX_LOCK_DIR=/tmp/settlementforge-vitest-gate.lock`.
> **§442:** T2H LANDED — build is at **84e06412** (26 landings). WEB-1 is in
> the landing seat (GO §442.2). DWR1A collected (§442.3). The undercity charter
> is RULED at §441 (TC-UNDERCITY-R2 applying it). Holding queue after WEB-1:
> web4/5/6/7 → T2J → T2K → T2L → T2M; producers T2R/T2Q resuming; T2N next seat.
> **§446:** WEB-1 LANDED — build at **4060f690** (27 landings; migration 197 on
> the branch). WEB-4 in the landing seat. T2R (f65b3ff3) and T2Q (cc9ef856)
> COMPLETE and pinned; T2N and UC-0 building; R-INST-1 researching. HK-1
> (the dead underways facet key, §445.3) and WEB-2/WEB-3 queued.

1. **BUILD is at b10ed1a1 — 25 LANDINGS** (since §427: CT-3 landed §432 after
   the §355 hunt CLOSED — the varying-cast contamination hypothesis is
   UNSUPPORTED, the specimen was the hunt's own TMPDIR; the flake doctrine,
   TMPDIR hygiene, and the two real phenomena are §432's record).
2. **T2H's landing gate is MID-RUN, DETACHED (survives):** rebased tip
   84e06412 on b10ed1a1, pinned at refs/preserve/holding-t2h-slot; collect
   per laneTET2H-receipt.md's succession header — on TRUE_EXIT=0 + tail
   agreement CAS b10ed1a1 → 84e06412; sibling load (T2R/T2Q batteries) is
   pre-stamped context for any stray.
3. **HOLDING FOR LANDING after T2H:** the five website cars (pins
   holding-web1/4/5/6/7) → T2J (f7ba3145) → T2K (4d2d17f8) → T2L (6c920593)
   → T2M (faf3def4; sibling-of-T2L: sum-of-deltas at its slot; the blessed
   four-red window §426). The slot pattern §418/§420; prune each landed
   member's trees AT the CAS (§434.1).
4. **BUILDING (killed by the switch; resume FROM RECEIPTS, survey-first):**
   TE-T2R (the §434-RULED member: peakTier precedence, destroyer roster,
   documented calamity gap — laneTET2R-receipt.md) · TE-T2Q (charter §4 +
   §433-C6's pre-authorized fallback — laneTET2Q-receipt.md) · TC-DWR1A
   (the P1a construction-history dossier, PARTIAL at
   draft-DWR1A-CONSTRUCTION-HISTORY.md). T2N never dispatched — next free
   seat, charter §3 of draft-PRODUCERS-PLAN.md.
5. **AWAITING THE CHAIR'S RULING:** the UNDERCITY charter
   (draft-UNDERCITY-PLAN.md, collected §433 — six golden-inert cars, two
   trains, queued behind the producers; rule its RAISED then dispatch).
6. **THE DW PROGRAM (§435-§438):** docs/DESIGN_DWELLINGS_PROGRAM.md is the
   architecture + the transposed build path + the integrated sequencing —
   research runs NOW as seats allow (six R-INST tranches chartered §438,
   owner cost ACCEPTED, per-institution incl. magical-from-lore under
   conventions-never-expression + deity doctrine + finite semantics);
   sandbox in endgame quiet windows; repo-byte work post-endgame. Carry
   notes planted (undercity graph addressability; D5 part-naming; tuning
   leg-extensibility).
7. **NEW SINCE §427 in the owner docket:** the §434 engine cures O2-i/O2-ii
   (peakTier stamp on demoting paths; the uncapped realmVerbExecution ring)
   · the §433-O1 generation-side given-past fork · prngSeedEntropy's
   tolerance micro-fix chartered §432 (rides housekeeping).
8. **FRESH LAWS the §427 block predates:** §432 (the flake doctrine; short
   TMPDIR every terminal; quiet = measured load + ps -r) · §433 (producer
   architecture; the tierGrammar import-swap obligation C5) · §434 (the
   destroyer-roster law; evidence-erasure lesson 11) · §418/§420 slot
   pattern + instrument lies · §408 tests/ops sweep · §410 retrospective
   mints · §416.1 identity arm · §417 deferred rows.

## ⭐⭐⭐ CURRENT OVERRIDE — 2026-08-23 (~13:30), LEDGER THROUGH §427 — THE SUCCESSION HANDOFF
## BUILD claude/composite-r4 @ ec8f3359 — 24 LANDINGS THIS ARC; THE 25TH (CT-3) MID-GATE AT HANDOFF

**This block supersedes everything below it.** Written for an account-switch
succession: the prior chair's session (and its lane agents) die with it; every
artifact below survives on disk. The repo is authoritative over this summary.

### 0 · WHERE EVERYTHING IS
- **Ledger:** THIS branch (review-fixes-2026-07-08), docs/OWNER_DECISION_QUEUE.md
  through **§427**; docs/RESUME_STATE.md is the running act-log (read its tail).
  Ledger commits: PRIVATE-INDEX METHOD ONLY (the main worktree matches no branch).
- **Build:** claude/composite-r4 @ **ec8f3359** (24 landings: schema-10 mint →
  RR-1 → RR-2 [the 933 descriptions] → T2Bf → CT-2 → H8B).
- **The prior session's scratchpad (ALL drafts + lane receipts live here, READ IT):**
  `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/6298872d-53af-4c8a-99e5-139bfc5bfc1f/scratchpad/`
  Key files: draft-MF-T2L.md · draft-MF-T2M.md · draft-PRODUCERS-PLAN.md ·
  draft-T2S-DOOR-BRIEF.md · draft-WEBSITE-PLAN.md · draft-MF-T2K.md ·
  lane receipts laneTE*/laneTC*-receipt.md (the survey-before-resume inputs).
- **Auto-memory** (same machine+path ⇒ same dir) is current; MEMORY.md indexes it.

### 1 · SUCCESSOR'S FIRST ACTS, IN ORDER
1. **Re-arm the §388 wakeup** (CronCreate, `13,33,53 * * * *`, session-scoped —
   the prior job died): prompt = the four checks, headlined **"IS EVERY BUILDABLE
   CAR BUILDING?"** + raced-GO/lost-lane/read-never-extend protocols (§388).
2. **Collect CT-3's landing** — its terminal was MID-GATE at handoff, DETACHED
   (survives the session): receipt `laneTECT3-receipt.md` names the log paths.
   On TRUE_EXIT=0 **plus** the gate tail's own exit line: CAS
   `ec8f3359 → b10ed1a1f5a0f2acd00bbfc9b5d0a41931697c3d` (verify ancestry
   first; CT-3's retraction-grep was ZERO — the §401 false claim stayed dead),
   then delete refs/preserve/holding-ct3. ⛔ NEVER READ THE CAS TARGET OFF
   THAT PIN: holding-ct3 points at ba806682, the PRE-REBASE tip still carrying
   the §401-retracted claim — landing it resurrects the retraction. The ONLY
   lawful target is b10ed1a1 (above, and in the receipt's bordered block).
   On a red: classify per §358.2/§355
   (load ~88 from three sibling batteries was PRE-STAMPED as evidence in its
   receipt — expect TIMEOUT-class strays, one quiet re-run, second stray STOPs).
3. **Survey the killed builders BY RECEIPT (the 529-law — partial edits exist):**
   TE-T2L (vegetation, draft-MF-T2L.md ruled §425) and TE-T2M (arch-history +
   the Shape-B strip, draft-MF-T2M.md ruled §426) were BUILDING at handoff; both
   were ordered to checkpoint (commit verified WIP + receipt). Read their
   receipts; re-dispatch fresh executors that RESUME from the receipt+worktree
   state (verify every claimed proof before trusting it).
4. **Continue the landing cascade** (ONE gate at a time, the §418/§420 slot
   pattern): after CT-3 → **T2H** (pin holding-t2h-r2 = 05e7f9d5; ALSO delete
   the stale holding-t2h = superseded 2064a67e at its landing) → the five
   website cars in GO order → T2J (f7ba3145) → T2K (4d2d17f8) → T2L → T2M.
   Every GO carries: rebase with carry-proof-by-absence FIRST, manifest
   keep-both + row-level deep-compare (string-aware surgery), re-stamp DELTA
   never tuple, S0 two-part READ LIVE (baselines quoted as context only), the
   detached-own-session terminal with heartbeat-every-sample and
   LIVENESS-PROBE-BEFORE-RECLAIM. Website pins: WEB-1 4065b326 · WEB-4
   378f9276 · WEB-5 6d6572ea · WEB-6 5b0a399f · WEB-7 e5975829. ⚠ WEB-1/WEB-6/
   WEB-7 each founded packets/website/ differently — second-and-later landings
   keep-one on the family header, keep-both on rows. ⚠ WEB-1's landing carries
   migration 197 → then WEB-2/WEB-3 UNBLOCK (dispatch from draft-WEBSITE-PLAN
   §2/§3; migration numbers sequential). ⚠ T2L's landing act carries the §419
   rename (CODEX_SLICE_MODULES→UNASSIGNED_LANDED_MODULES) + deferred rows;
   T2M's carries the BLESSED four-red validate:packets window (§426 — clears
   at the LANDED flip; never a failure).
5. **Rule + dispatch the producers train:** read draft-PRODUCERS-PLAN.md
   (collected §424, NOT yet ruled), rule its RAISED split, dispatch T2N/T2Q/T2R
   executors (T2N/T2R pure derivers golden-inert; T2Q rides existing verbs per
   §423). Docket the T2P compile (§424 RAISED-C1 confirmed).

### 2 · THE ARC'S BINDING LAWS BY § (full text in the ODQ rows)
§389.1 the bare gate script IS the envelope instrument, TWO-PART reading (exit
AND printed line; §397) · §393 attribution sweeps MUTEXED · §395 arm-and-wait
watcher = terminal standard · §408 the pre-gate sweep is tests/lint tests/build
**tests/ops**; a new migration owes a NEW reviewed wave · §410 retrospective
packet mints enter at TERMINAL status · §414+§416 the wrapper-timeout gate-kill
class; liveness-probe (ps the lock pid) before ANY reclaim; heartbeat every
sample · §416.1 movement guards need an IDENTITY arm · §417 stacked members
DEFER shared walker rows to the landing act (texts in each packet) · §418/§420
the slot pattern + four instrument lies (rev-parse echoes its arg; sed \b;
vitest positional filters; gate-tail body in $TMPDIR) · §403.1 a truncatable
instrument needs a COMPLETENESS check · §423 THE DOOR: store registry = verb
census, domain = payload grammar, Option-D structural law · §406 consent
provenance signals are non-equivalent (the conjunction predicate).

### 3 · AFTER THE CASCADE (the standing remaining-arc, ~35-55h)
Producers build+land → WEB-2/3 → content tail (WF-8 shrink-back CAR carries the
§400 FTH-3 doc shrink; CT-4 undercity chapter; CT-5; ONE trailing OSR mint per
§384.2 with the attribution table: general=CT-2, warFaith=CT-3, +T2M's lawful
flip) → undercity train (compile first) → housekeeping (HANDOFF re-refresh,
MEASDUAL phase-2 at a quiet window, §384.2b durable doc [chair-authored —
governance], INV-EVS worktree prune after the owner rules) → parity train +
the §290 review stop (recommend /code-review ultra — OWNER fires it) →
ENDGAME: walk + ONE regen → terminal soak → TUNING WITH THE MAP LEG (§341;
owner signs) → V5 waves → cull → IP scrub (two docs leave the repo) → push.

### 4 · OWNER DOCKET (untouched by any lane)
Tuning signature · cull §67.6 · every push/merge/deploy · three db-push
migrations · copy walks (beat copy, FALL_SENTENCE, §320.3 wording, RR-2 glance)
· 'campaign' word (rec: keep-and-reword, §402) · O3 retroactive purge (rec:
purge) · the §399 viability-summary fork (rec: projectBeside keyed on
_userEdits; third arm honest) · TinyMCE/GPL + FMG counsel · support mailbox ·
CI log paste · founder-transfer legal · partial refunds NONE until the webhook
deploys.

## ⭐⭐ CURRENT OVERRIDE — 2026-08-22 (~01:40 ET), LEDGER THROUGH §345;
## BUILD claude/composite-r4 @ 27c250f9; EIGHT LANDINGS — D3a CORE + WF-1 LADDER COMPLETE

This block supersedes everything below it (the earlier 08-21 and 08-20
overrides become history where they conflict; the map-architecture content of
§287–§290 remains binding).

1. **THE SITTING (ODQ §291–§298) IS COMPLETE** — all 30 queued rows ruled; the
   queue file is EMPTY. Operative law: §291 grant (incl. EMERGENT permissions;
   the review-improve doctrine; 30-min wakeup; four lanes) · §291.5 seats
   (Fable architects/judges, Opus verifies/implements) · §292 five refinements ·
   laws **L1–L7** (grade-drift · routed-orders · receipted-instrument ·
   redefined-census · zoom-scope · whole-channel holdout · corpus-is-a-sample).
   REVERSED at the sitting: §240's ceiling table + free-dividends; §250's epoch
   figures (true window-independent range 1.33–1.44×); §242's holdout rows.
   The sitting's recurring defect class was RECEIPT→LEDGER TRANSIT — quote
   receipts, never summarize grades up.
2. **SEALED SINCE (§299–§310):** MF-D0 (offset kernel; 38 self-crossings → 0)
   · MF-D1 (all five §287.8 foundations at ZERO bytes) · CF-1 (corpus gate
   313/313) · CG-1 (codex tip landed; the §296 arc CLOSED as port-target per
   §303.5) · **fresh W3 SEALED** (SW-1 5/5, the 11th world; map code of record
   = the sealed lane tips, preserved at refs/preserve/map-sandbox-w3f-sealed) ·
   **G-39 REFUTED** by the pre-registered perimeter-range rule (register
   0.69–0.72) · **G-43 LIVE** (the counterfactual benchmark; three engine
   findings — high-water starvation 16/17, wall-year inertness, the cathedral
   floor; causal precision 0.039 is THE inertia number and THE tuning-pass
   input) · **RS-4/P4 CLOSED** (162/162, none below floor) · **WF-1B LANDED**
   (suppressDeity single writer; census +8) with RS-5 fired at its exposure.
3. **WF/MF FAMILY MACHINERY (§312–§321):** WF-PREAMBLE and MF-PREAMBLE landed
   chair-signed (MF stamp granted §312.2b) · ⭐ §314.2 CITATION RE-STAMP LAW —
   a preamble edit re-hashes the family law, and the editing act owns every
   citing packet's re-stamp in the same landing (executed at build commit
   2cdb87fa) · MF-T2A landed (map port member 1) · WF-1C compiled (its §9
   GOVERNS: no CAS until executed greens arrive; the receipt names tip
   253f2028) · the WF-1D compile collected at §321 (net-zero warTermination
   join 818/818; a dead Chronicle row REFUSED with an absence pin; the
   minter-totality walker arm ordered §321.2a; WF-1E seeded) · **§320 LAW: a
   delivered spec is presumed implemented until the live tree says otherwise**
   (the landing-page stale dispatch was correctly refused). Undercity doctrine
   complete at §311–§311.9 (component law = LICENSE + ANCHOR + EXTENT-DRIVER +
   TEMPERAMENT + CAUSED-PORTALS; four temperaments; connectivity classes).
   V5 counsel bank recovered byte-exact (refs/preserve/v5-counsel-bank);
   program receipts preserved out of /tmp
   (refs/preserve/program-receipts-2026-08-21).
4. **THE 08-21→22 DAY: EIGHT LANDINGS, SEVEN CASes, tip 27c250f9** — WF-1C ·
   MF-T2B(+fence) · notices · WF-1D(+the four-file zero-headroom law) · the
   OFL completion · MF-T2C · WF-1E · MF-T2D. **D3a's CORE IS COMPLETE** (the
   map engine's mathematical spine ported dormant); the WF-1 ladder complete
   but for WF-1F (in flight). RS-5: 162/162 CLEAN, preserved at
   refs/preserve/rs5-soak-complete-2026-08-21. ⚠⚠ RULE CHANGES THIS SITTING:
   §336 the owner's blanket grant → the §187 delegable items are CHAIR
   rulings (sitting in progress → §346); §337 the soak GATES NOTHING —
   implementation always parallel; §341 the tuning pass gains a MAP LEG;
   §343+.3 Fable-tier implementation AND verification at chair discretion
   under the named appropriateness test. LAWS BANKED: §325.2 (fired 4×,
   caught 4×) · §325.3 · §332.1 wrong-instrument (+§345.1b printed-value
   cousin) · the transcript-recovery route (§338.4). IN FLIGHT: TE-WF1F
   (slot-aware onto 27c250f9) · MEAS-MINKEYS · TC-T2E compile · the §187
   sitting. NEXT WAVES: T2E/D4 → parity slice → §290 review stop
   (/code-review ultra = owner keystroke anytime) → visual waves → undercity
   → endgame tail (tuning LAST, now numbers+maps).
5. **ULTRACODE (probed 08-21 ~15:00):** an Agent `remote`-isolation dispatch
   MATERIALIZES LOCALLY (a worktree on this Mac at .claude/worktrees/) — cloud
   lanes are NOT reachable from a session, so the local box is the compute
   envelope and §302.3 load orchestration stays. The working cloud lever is the
   owner-typed `/code-review ultra` (bundles the local branch; needs no push) —
   recommended AT the §290 mandatory review stop once the cascade lands. Do
   not re-probe.
6. ⛔⛔ **UNCHANGED DOCKETS (owner's, visible):** the vendored-FMG/TinyMCE
   exposure (§295, owner/counsel; the working tree's public/map drop is
   foreign WIP — NEVER commit it) · §317.1 website decision list · §316.2C
   beat copy · §320.3 anon-ceiling disclosure · tuning-signature items · every
   push remains owner-gated (the repo has never been pushed).
7. **RESUME:** docs/RESUME_STATE.md's hand note is current to the minute; the
   §-numbered rulings are the authority. Session scratchpad 6298872d-… holds
   the drafts (WF-1C/WF-1D/D3A-PLAN/MF-T2B + the WF-1E seed), lane receipts
   and executor worktrees; the a244e7a3 scratchpad holds the sealed map lane
   tips and the rs5 machinery.

## HISTORICAL OVERRIDE — 2026-08-20, ledger collected through §289

This section supersedes the older topology/immediate/queue snapshots retained
below as history.

1. **ROOT / LEDGER:** `/Users/cstokes/Desktop/settlement-engine` is currently
   `review-fixes-2026-07-08@3e3366b9` with a very large shared dirty/index state.
   Preserve it exactly: no reset, stash, clean or broad add. Review edits are
   working-tree-only; no index/ref was moved.
2. **BUILD:** `claude/composite-r4@4eafca31`. The former `minifold` worktree is
   absent. Old integration trees at `/private/tmp/MFINT1-tree` and
   `/private/tmp/MFINT1-fab` are detached at `ac243e1c`; they are evidence, not
   code of record and are **not** generically map-identical to the current
   build-out. The audited `habitation.js` matches, but the MFINT1 `fields.js`
   and `commons.js` are stale relative to the code-of-record sandbox hashes
   recorded in the rural Wave-1 report.
3. **MAP SANDBOX:**
   `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad/mf-proto/build-out`.
   W0/W1/W1B/W2 have receipts/outputs. W3 was killed mid-lane; its tip changes
   four geometry/wall files, has no changed tests, receipt, manifest or W3 output.
   Preserve it as an abandoned experiment. Restart fresh from sealed W2 after
   the standalone offset foundation; do not accumulate on the partial tip.
4. **CANONICAL MAP ARCHITECTURE:** read
   `map-corpus/docs/GENERATION-SPEC.md` §§6–10. §§6–9 are design-only;
   ⟦FOLD §287⟧ §10 is the binding cohesion reconciliation; owner decisions §§288–§289
   amend its lighting and content-origin boundaries and win on those seams.
   The target is one strict-plan, one-leaf map with durable spatial truth,
   temporal observation, a settlement-level solid/light-query index, one-leaf
   view occlusion and one addressable semantic draw list. Shadows are projection
   results, not dimensional-scene truth.
5. **LIVE-CODE REALITY:** no dimensional scene or authorship document is built.
   Four map candidates exist (legacy TownMapModel, hidden townCartography,
   sandbox fabric, dormant arch). Port repaired `fabric/**` as the sole geometry
   authority inside existing privacy/digest/budget and operation/persistence
   seams; do not create a fifth map or extend townCartography in parallel.
6. **CORPUS:** 313 plates + 313 previews. Run
   `python3 map-corpus/docs/corpus_integrity.py`; it now includes the separate
   historical-evidence registry gate.
   The 53-id set is a closed legacy pixel-evaluation roster, **not** an untouched
   calibration holdout. Its images should still be withheld from fresh
   implementation/evaluation lanes. A true blindness claim needs a new sealed
   external set. `map-corpus/docs/HISTORICAL-URBANISM-EVIDENCE.md` and
   `map-corpus/historical-evidence/` keep source geometry, scholarly
   reconstruction and generated realization separate. The initial registry has
   no prevalence cohort and may not tune probabilities. Corpus teaches visual
   register; history teaches bounded structure; dossier/world receipts teach cause.
7. **NEXT SAFE ORDER:** owed Fable retrovalidation → standalone D0 offset kernel
   from W2 → executable manifest/coordinate ABI/solid legality/spatial receipts/
   DCEL face/adjacency dual-run → fresh W3 → frontage/parcel DCEL equivalence →
   instruments → D3a's dormant explicit-input dimensional foundation; D3b and
   every empirical massing/material resolver wait for `AMP-1`. Structural
   authorship remains parked until frontage/identity and the core operation
   adapter exist. No dimensional or authorship implementation was dispatched by
   §§287–§289.
8. **HISTORICAL LAW:** do not implement a country/style switch or a universal
   medieval grammar. Historical chronology is a dated mechanism graph over
   substrate, routes/crossings, nuclei/jurisdictions, projects, parcels and later
   occupation; it is distinct from compiler S-stage order. `PLAN_INTENT` and
   `PLAN_REALIZATION` are separate manifest artifacts. A cited town is a bounded
   possibility/counterexample, never a prevalence prior or geometry template.
9. **RESEARCH COMPLETION:** the current 32 records / 23 places / 20 mechanisms
   are Wave 1 and carry zero prevalence. Read
   `map-corpus/docs/HISTORICAL-EVIDENCE-EXPANSION-PROTOCOL.md` and SPEC §10.21.
   Calibration requires 80–120 balanced towns, 30–40 complete-package audits,
   mechanism-specific cohorts, a truly sealed 15–20% holdout, separate rural and
   building-massing programs, explicit `EUROPEAN_FANTASY_BASE` scope, mechanism
   saturation/range stability and held-out structural transfer. Stable typed
   foundations may proceed; numeric/cultural probabilities may not. Non-European
   morphology is not a completion gate: the live non-European culture tokens remain
   prose/naming inputs and activate no map grammar unless a future owner-authorized
   evidence program adds a new map tradition.
10. **RURAL + ARCHITECTURAL EVIDENCE BOUNDARY:** read
    `map-corpus/docs/ARCHITECTURAL-MASSING-EVIDENCE-WAVE1.md`,
    `map-corpus/docs/RURAL-SETTLEMENT-LANDSCAPE-EVIDENCE-WAVE1.md` and SPEC
    §§10.22–10.23. Both are European Wave-1 discovery surveys, not calibration
    registries. Stable composite/support/component/history types and a canonical
    `RuralLandscapePhase` may proceed. Their independent 18% clustered holdouts can
    validate scoped conditional engineering ranges and coherence mechanisms; they
    cannot identify height/storey/roof/material occurrence distributions, agrarian
    or tenure prevalence, count/frequency/activation weights or prosperity/material
    probabilities. Those remain `NOT_IDENTIFIED`/`NONE` without a separate
    probability-sampling protocol. An explicit canonical world cause may activate
    this settlement while those population-level fields remain unidentified. The current
    sandbox still builds fields and worksite habitation
    after the urban umbrella, guesses fallback tillage/routes and carries
    conflicting production readers; it is experimental presentation machinery,
    not canonical world truth. Missing rural canon yields `STRUCTURAL_ONLY` or a
    typed refusal, never open fields by default.
11. **GLOBAL SUN/MOON + PERCEPTUAL LIGHT OWNER LAW (§288):** the dimensional
    plate has exactly one global celestial directional source at effectively infinite
    distance, with parallel rays and one azimuth/elevation across every active leaf;
    local fixtures never rotate with it. Normal output uses a registered fixed-survey
    convention. An explicit Light Probe may preview the global direction without WORLD
    mutation; pinned-document and licensed world-time modes are distinct persisted/
    observed authorities. Export defaults to exact registered high-noon/high-moon
    conventions unless the request explicitly selects pinned, world-time or finalized
    current light; ephemeral probe state never leaks into export. Zero tilt remains.
    Heavy ray/path-traced GI, volumetric/screen-space authority and renderer blur remain
    refused, but deterministic analytic ambient, contact occlusion, bounded reflected
    colour, factual environmental modulation, finite registered softness, source-local
    restrained glow and closed material response are legal projection effects. This is
    a specification/governance amendment only: PLANAR exposes no probe, and implementation
    waits for D3a canonical solids/material slots plus D4 shared occlusion/draw/export truth.
12. **BUILT-IN/CUSTOM PARITY OWNER LAW (§289):** every canonical spatial fact resolves
    provenance origin `BUILT_IN|CUSTOM|IMPORTED|AUTHORED`; origin never changes geometry
    legality. Exact custom registry/version snapshots participate in hashes and saved canon.
    Missing/removed custom content remains visibly unresolved with its last canonical bytes;
    it is never silently deleted or reinterpreted. Built-in and custom forms of one semantic
    type run identical placement, support/solid, persistence, privacy, render and export tests.
    A custom fantasy work such as a necromantic floating citadel needs explicit canon plus a
    registered operation/recipe—not a fabricated atlas citation. Historical gates govern only
    claims of cultural/historical authenticity or culture/period-conditioned defaults; a separate probability protocol governs
    population prevalence. Automatic morphology remains `EUROPEAN_FANTASY_BASE`; names and
    explicit custom canon are valid outside it, but no other settlement tradition is falsely
    claimed authentic before its own researched pack exists.
13. **CORE-FIRST STOP LAW (§290):** do not hold the first implementation hostage to every
    conceivable edge case. The release-blocking slice is exact save/reload and deterministic
    identity, one built-in/custom semantic pair, missing-package read-only recovery, one registered
    fantasy operation, PUBLIC/DM privacy and screen/export parity on surface
    `EUROPEAN_FANTASY_BASE`. Only data loss/corruption, second geometry authority,
    nondeterminism, privacy leakage, silent fact invention or false historical authority on that
    supported path blocks now. Foundation/D1 → fresh W3/frontage → D3a → D4 → parity slice, then a
    mandatory measured review. Deeper portal, multi-package, operation-family, probe/world-time and
    future-tradition combinations stay recorded for later unless a real supported-path failure or
    owner decision promotes them.

## What this is
SettlementForge: a deterministic D&D settlement/world simulator (~1.3M lines).
The owner (Clausell Stokes) has delegated ALL judgment to the AI chair under
ODQ §170/§217/§223, with carve-outs BY NATURE: legal, data deletion, the tuning
signature, every git push, paid-surface changes, and anything owner-parked.
CONSTITUTIONAL: THE PROMISE (a seed is a starting world forever; lived history
immutable; tuning owner-signed) · the DEITY DOCTRINE (faith is cultural, never
theological; no premade deity pool) · FINITE-SEMANTICS (typed buckets; AI is
clerk, never writer) · the core world/narrative model may be setting-agnostic,
but current settlement-map morphology is explicitly `EUROPEAN_FANTASY_BASE`
and culture tokens select no geometry · sub-century · never a named character's
fate.

## HISTORICAL topology snapshot (superseded by CURRENT OVERRIDE)
- LEDGER branch `review-fixes-2026-07-08`: docs/OWNER_DECISION_QUEUE.md (THE
  record, then §233) + this file. The MAIN worktree
  (/Users/cstokes/Desktop/settlement-engine) was managed as a dirty control tree — commit to the
  ledger ONLY by the private-index method (GIT_INDEX_FILE + read-tree +
  commit-tree + update-ref with old-value assertion). NEVER `git add -A`.
- BUILD branch `claude/composite-r4` — currently at **66fda66d** (WF-1a, the
  faith family's first slice). Executor lanes stack DETACHED in the worktree
  .claude/worktrees/minifold and report tips; the chair moves the ref by
  compare-and-swap. Foreign stash@{0} (analytics-intelligence-layer) is the
  owner's — untouchable.
- SCRATCHPAD /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/
  a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad/ — all lane receipts
  (laneXX-receipt.md), the map sandbox (mf-proto/), exemplars (mf-proto-out/),
  and the map sandbox. ⭐ **THE REFERENCE CORPUS NOW LIVES PERMANENTLY AT
  `map-corpus/` IN THE REPO ROOT** (§243; git-ignored, 313 plates + previews +
  docs/ with the calibration index, the urbanism atlas, the round receipts and
  the measured register). CITE map-corpus/ — the scratchpad `map-refs/` is a
  temporary mirror that may vanish.

## HISTORICAL IMMEDIATE state (2026-08-17 ~01:30 ET, ledger at §236; superseded)
The session-limit pause is OVER; all its debts are settled.
1. **Build branch `claude/composite-r4` is at `ac243e1c`** — TE34's harness
   micro-batch landed green (the chair's own detached gate: TRUE_EXIT=0,
   SMOKE 0, log TE34-CHAIR-BINDING.log) on top of WF-1a (`66fda66d`). The
   soak instrument is CURED (epoch args thread; dark-control NOT-EXECUTABLE;
   non_finite at source; env leaks swept with a habitat walker). The
   /private/tmp/TE34-tree worktree may be reaped.
2. **RS-3 (third rolling soak) is RUNNING at ac243e1c** — 162 cells,
   first-ever full epoch-pair coverage, findings-only; collect its report,
   triage per §141/§143, fire RS-4 at the then-newest tip.
3. **MF-B8b (wall hotfix = THE ARCHITECTURE PILOT, §230/§232/§234) is
   RUNNING** in the map sandbox: one shared circuit object (graph idiom:
   declared inputs, content hash, accessor-pulled consumers), the district
   partition, the sibling staleness audit, b8's wins re-quoted. ON ITS SEAL:
   the FEATURE-LAW FREEZE takes effect and MF-ARCH dispatches (the §234
   sequence: SCC diagnostic FIRST, keyedRandom+lineage IDs, fixed-precision
   geometry, spatial indexes, cross-engine determinism CI).
4. **HF-4b (final corpus spend) is RUNNING on the Fable seat** — verify-
   balance-first, rescue orphans, spend to <50 before the subscription dies
   after 2026-08-17, nominate the §234 holdout set. THE CORPUS IS FROZEN AT 313 PLATES (§242); no
   further growth rounds — the subscription is gone.
5. **§236 is now in force**: if Fable is exhausted, continue on Opus 5 with
   the marker protocol (see the FABLE/OPUS CONTINUITY section below and
   docs/FABLE_RETROVALIDATION_QUEUE.md).

## ⚠ STATE AT THE WEEKLY-LIMIT PAUSE (§275-§276)
The account weekly limit killed MF-W3 mid-lane (restart fresh from its brief:
ODQ §274.5 items + SPEC §5 W3) and RS-4's monitor at ~110/163 (receipts
durable in rs4-receipts/; tail world passing, zero floor trips — resume the
monitor, do not restart the grid). Resets Aug 22 7pm ET. Waves W0-W2 are
SEALED; the build branch is at 4eafca31 (P4 repair exposed). The §275/§276
fold added the counterfactual causal benchmark (G-43), the halo ablation
(G-44), the historical structural cohort (G-45), §3.7's doctrine, and W8
exits 6-8 to GENERATION-SPEC.md — design only, nothing implemented. ⛔ THE
FABLE RETROVALIDATION SITTING OVER §238-§274 IS OWED FIRST when work resumes.

## Queues after the pause
- **Map wave nine** (dispatch after B8b seals; sandbox mf-proto/build-out):
  countryside T-24 + road ladder T-23 (the low-tier lever) · §214 iconography
  (walls look like walls, terrain like terrain) · MF-A1 paint integration
  (modules in mf-proto/aesthetic; hazards: browser parity, PDF filter-vanish)
  · underground stratum (§13/§168, twice deferred) · metropolis grain (70 vs
  100-130) · b8 residuals (4 orphan streets, 103 river crossings, clipped-solid
  spikes) · §205 B/C · chrome/vintage/decay. Then the §216 comparison round
  (re-run the atlas instruments, re-set windows, grade as DISTANCE) — loop
  until objectively equal-or-better; §220 performance gate binds at
  integration; §217 allows measured, re-pinned map-budget raises.
- **Engine queue (§27)**: WF-1b (needs the chair-authored family preamble +
  stamped substrate annex FIRST; suppressedAtTick has THREE writers) → WF-1c/d
  → the P4 population-reconciliation repair (§219, shapes R-B+R-C, declared
  soak-corpus shift) → WC/INT/WY/POP/LG → cn+pg → mf landing (cutover LAST,
  owner eyes) → TR/GR/HB (chair sittings first). ci-1c blocked on the owner's
  CI log paste.
- **Chair debts**: the docs act (charter→volume re-sync §15-§18 + §190-§232
  laws; EP volume amendments; C-EPF-4) · OSR schema-8 re-governance (BASE_STATE
  stamps blocked) · memory folds.
- **Owner-side**: the 18-item batch + item 19 (scale-bar unit name, prints
  PACES) · the CI log · tuning signature (post-full-soak) · legal/launch.

## ⚠ FABLE/OPUS CONTINUITY (§236)
If you are an OPUS chair: work continues at full authority, but mark every
ledger row "(chair: Opus 5 — Fable-unvalidated)" and append what needs Fable
re-examination to docs/FABLE_RETROVALIDATION_QUEUE.md. If you are a FABLE
chair returning: walk that queue FIRST (RATIFIED/AMENDED/REVERSED per row),
then resume the §234 sequence.

## ⛔ PERMANENT IP LAWS (§248, §253, §254.5)
- **NO WATABOU (TownGeneratorOS) CODE EVER ENTERS THIS TREE** — GPL-3.0,
  incompatible with a commercial closed product. Study is read-only; the
  implementing lane must never see that source (clean-room by lane separation).
- **FMG (Azgaar) is MIT but its vendored libs are not** — tinymce is GPLv2+,
  and its Urquhart utility was copied in from elsewhere and is not Azgaar's to
  license. A permissive top-level licence does not launder copied-in code.
- Adopt APPROACHES freely; implement clean-room in our own idiom. A mechanism
  adopted without a derivation home in our dossier facts is decoration.

## Hazards a successor must not relearn (the sharpest five)
1. A census over a derived set proves NOTHING about a surface it doesn't
   contain — forensic zoom (render 3000px, crop, LOOK) is standard practice.
2. Trust no exit you did not capture in-shell; only SELF-NAMED logs; a shared
   log dir lies by recency; never wrap check* in gate-mutex (self-deadlock).
3. Comment/prose edits fire ratchets; quoting a forbidden matcher in prose
   convicts; line-bound exclusions drift toward silent UN-exclusion.
4. PACKET_MANIFEST is never-re-serialize (scoped text edits only);
   requiredSymbols pin symbols/anchors, never lines or figures — and they do
   NOT catch renames (substring match).
5. The test census sits AT its ceiling: extend existing test files, never mint
   new ones; a parked file swallows its titles.

Full hazard corpus: the Claude memory dir (~/.claude/projects/
-Users-cstokes-Desktop-settlement-engine/memory/ — MEMORY.md is the index) for
Claude successors; for non-Claude successors this file + the ledger + the lane
receipts are sufficient and the memory dir is a bonus if readable.
