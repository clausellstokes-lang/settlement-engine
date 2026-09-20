# LEFT-CENSUS — the exact denominator behind "what is all left to run and build"

**Lane:** Opus SURVEY LEFT-CENSUS (read-only; nothing edited, staged, committed or deleted; no gated command run).
**Stamp:** `Sun Sep 20 15:46:22 EDT 2026` (`date`).
**Integration branch at the stamp:** `fixes-2026-09-18-consist` = **`7a4ea48e9`** — the NINTH LIGHTING REFREEZE, landed at ~15:45 during this survey (titles 25529 → 25530). 525 commits over `b9c494afe`. The tip moved four times while I measured (`65cbf86e1` → `85cd9f4a8` → `835f81812` → `7a4ea48e9`): CURE-L's three commits and the ninth refreeze. **CURE-L's window is CLOSED; RUN 24 is the chair's next act.**
**Sources read:** charter `EDIT-MODE-TRAIN.md` (867 lines) and `OWNER_DECISION_QUEUE.md` (32,922 lines; §934.47 addenda 67–116 read by line) — both from git objects on `review-fixes-2026-07-08`, never the stale checkout; the kit's RESUME-NOTE (top three blocks), 68 briefs, 106 findings dirs, 72 packet files; `PACKET_MANIFEST.json` at the branch tip; `git worktree list`, per-worktree `status --short`, and `git cherry` (patch-id) of 409 branches against the tip.

---

## TOTALS (ten lines)

1. **LANE IDS IN THE ROSTER: 128** — every id the charter, ODQ addenda 1–116, or a kit brief ever named (families CURE · DOC · FIX · TOOL · REVIEW · RECON · COMPILE · PREPROOF · COMPOSE). No `LANE-nn` id exists in either document; those belong to the predecessor 09-18/19 program (§A.8).
2. **COMPOSED (commits on the integration branch): 32 lanes / 57 commits** — enumerated from `git log --format=%s b9c494afe..tip` and the patch-id sweep.
3. **DONE, REPORT ONLY (read-only lanes; report exists, nothing to compose): 30.**
4. **PAUSED WITH BUILT WORK ON DISK (uncomposed): 23** — measured as per-worktree dirty rows + `git cherry` "+" counts.
5. **PAUSED AT THE GATE (built, queued for the one gate): 3** — FIX-C2d (4 commits) · FIX-P9 (2 commits) · FIX-P10 (10 dirty).
6. **DISPATCHED TODAY AND LIVE: 3** — CURE-L (landed, window closed) · FIX-W1 · QUEUE-RECON (still running; no report at the stamp).
7. **BRIEFED, NEVER DISPATCHED: 9. CHARTERED WITH NO BRIEF: 25. CLOSED / WITHDRAWN / SUPERSEDED: 3.**
8. **EDIT-MODE PACKET MEMBERS THE CHARTER NAMES: 74** (excluding the 7 train ids) — **12 LANDED · 19 COMPILED AND WAITING · 35 CHARTERED BUT UNCOMPILED · 7 WITHDRAWN/SUPERSEDED · 1 never chartered.**
9. **CHAIR'S OWN OWED ACTS: 26** — 8 done, 15 pending, 3 blocked on the owner's keystrokes (§C).
10. **OWNER DECISION POINTS STILL GENUINELY OPEN AFTER 15:3x: 3** (plus 5 hand-acts that need the owner's credentials, not a decision) (§D).

**Three places the chair's addendum 111 roster differs from what I count today** (detail in §A.9/§B.4): "sixteen paused lanes" is **exactly right by measurement** but undercounts by id (26 ids hold uncomposed work); "twenty compiled packets" should be **nineteen** (addendum 111's own enumerated list names eighteen, and EM-B3d joined today); "eleven chartered lanes never dispatched" is now **nine**, and addendum 111 never counted the **twenty-five** chartered-without-a-brief lanes at all.

---

# A. THE LANE CENSUS

## A.1 How each status was decided (method)

| status | evidence, executed |
|---|---|
| COMPOSED | a commit whose subject leads with the lane id exists in `git log b9c494afe..fixes-2026-09-18-consist`. I verified with a second pass that searched the id **anywhere** in a subject, not just as the leading token — that pass found no additional lane. |
| DONE-REPORT-ONLY | a non-empty `findings/<id>/` directory and/or a `<id>.report.md` in a lane scratch dir, and no commits owed by the charter. |
| PAUSED WITH BUILT WORK | a live worktree: `git -C <wt> status --short \| wc -l` for dirty rows, `git cherry <tip> <branch>` for own commits not on the tip by patch-id. |
| PAUSED AT THE GATE | the same, plus the RESUME-NOTE's 15:26 block naming it in the gate queue. |
| BRIEFED, NEVER DISPATCHED | `briefs/launch/<id>.md` exists; no worktree, no findings dir, no commits. |
| CHARTERED, NO BRIEF | named with a slot in the charter or an addendum; no brief, no worktree, no findings, no commits. |
| CLOSED / WITHDRAWN / SUPERSEDED | an explicit charter or addendum line, cited. |

⚠ **Patch-id is an upper bound in one direction, and I corrected for it.** `git cherry` reports FIX-P1's `e0b03b63a` and FIX-P1c's `5fbe2d82c` as "not on the tip", yet `FIX-P1` and `FIX-P1c` commits *are* on the tip — they were composed with resolution, so their patch-ids changed. **Where patch-id and the commit-subject tally disagree I preferred the subject tally (git over git, the more specific evidence), and say so in the row.**

## A.2 CURE (14 ids) — 13 COMPOSED, 1 LIVE

| id | status | evidence |
|---|---|---|
| CURE-A · A2 · A3 · B · C · D · E · F · G · H · I · K | **COMPOSED** | 1 commit each on the tip (12 commits) |
| CURE-J | **COMPOSED** | 4 commits on the tip |
| CURE-L | **DISPATCHED TODAY — WINDOW CLOSED** | 3 commits on the tip (`65cbf86e1` fork-door walker · `85cd9f4a8` the register-read cure · `835f81812` the e2e cap 15→25, judgment 6). It commits **directly on the integration branch**, so its work is composed by construction. The ninth refreeze `7a4ea48e9` followed it at 15:45. |

## A.3 DOC (4 ids) — 1 COMPOSED, 3 CHARTERED

| id | status | evidence |
|---|---|---|
| DOC-4 | **COMPOSED** | `532ba71cc`, 1 commit (addendum 107) |
| DOC-1 · DOC-2 · DOC-3 | **CHARTERED, NO BRIEF** | charter line 785 (addendum 100) "chartered without briefs"; DOC-2 charter line 712, DOC-3 line 731 |

## A.4 FIX (53 ids)

**COMPOSED — 15 ids, 32 commits**

| id | commits on tip |
|---|---|
| FIX-B2 | 3 |
| FIX-B2b | 1 |
| FIX-C2 | 2 |
| FIX-C2b | 4 |
| FIX-C2c | 3 |
| FIX-D9 | 3 |
| FIX-L1 | 1 |
| FIX-P1 · P1b · P1c · P1d | 1 each (4) |
| FIX-P3 | 5 |
| FIX-P4 | 2 |
| FIX-P5 | 5 |
| FIX-T2 | 2 |

**DONE, REPORT ONLY — 2**

| id | evidence |
|---|---|
| FIX-D1 | `findings/FIX-D1/`; charter line 374: MEASURED and RULED (§934.61) — **zero of the 7,399 are stale references**; nothing to compose |
| FIX-D4 | `findings/FIX-D4/`, `lane-fix-d4-scratch/FIX-D4.report.md`; its cure was ruled into one build lane under the owner's signature (addendum 39–40) |

**PAUSED WITH BUILT WORK — 12** (dirty rows / own commits not on tip)

| id | worktree · branch | dirty | commits |
|---|---|---|---|
| FIX-D7 | `lane-fix-d7` · fix-generator-hygiene-2026-09-20 | 6 | 0 |
| FIX-D8 | `lane-fix-d8` · fix-data-purity-2026-09-20 | 7 | 0 |
| FIX-F | `lane-fix-f` · fix-followups-2026-09-19 | 10 | 1 (`5c6c6df22`) |
| FIX-F1 | inside `lane-fix-f` / `lane-fix-g` | — | 0 — **PLAUSIBLE attribution**; no FIX-F1 commit reaches the tip (measured: 0 hits) |
| FIX-F2b | inside `lane-fix-f` (its resume note is FIX-F2b's, rev 3) | — | 0 |
| FIX-G | `lane-fix-g` · fix-food-card-2026-09-19 | 7 | 0 |
| FIX-G1 | inside `lane-fix-g` (carries the ONE-ROW golden re-record already signed §934.57) | — | 0 — **PLAUSIBLE** |
| FIX-G2 | inside `lane-fix-g` | — | 0 — **PLAUSIBLE** |
| FIX-K1 | `lane-fix-k1` · fix-hasown-2026-09-20 | 20 | 0 |
| FIX-P2 | `lane-fix-p2` · fix-mapdress-namespace-2026-09-20 | 10 | 0 |
| FIX-P4b | `lane-fix-p4b` · fix-p4b-2026-09-20 | 10 | 0 |
| FIX-T1 | `lane-fix-t1` · fix-ruin-replicas-2026-09-20 | 10 | 0 |

**PAUSED AT THE GATE — 3**

| id | worktree · branch | dirty | commits | note |
|---|---|---|---|---|
| FIX-C2d | `lane-fix-c2d` · fix-c2d-doc-citations-2026-09-20 @ `52bf58490` | 0 | **4** | committed before `tests/lint` whole (the 13:08 law); accepted as it stands; its gate window goes to a FRESH agent (old agent ~484k tokens) |
| FIX-P9 | `lane-fix-p9` · fix-tier-word-2-2026-09-20 @ `de16bdf6a` | 0 | **2** | commits 3–6 owed; its `UPDATE_ORGANIC_SAMPLES=1` door ruled lawful under six conditions (judgment 4) |
| FIX-P10 | `lane-fix-p10` · fix-phone-floor-2-2026-09-20 | **10** | 0 | commit 5 prepared in scratch; four commits + three owed runs |

**DISPATCHED TODAY AND LIVE — 1**

| id | evidence |
|---|---|
| FIX-W1 | `lane-fix-w1` @ `e45c4738b`, 1 dirty, 0 commits. Its commit 3 uses the owner's golden door; addendum 116 rules the chair signs its drafted record at the gate hand-off. |

**BRIEFED, NEVER DISPATCHED — 5:** FIX-B3 · FIX-D6 · FIX-D10 · FIX-G4 · FIX-L3.
(Each has `briefs/launch/<id>.md`, no worktree, no commits. FIX-G4 was briefed at 15:3x on §934.76's YES and is dispatched at the cured tip after CURE-L lands — which has now happened. FIX-D10 carries §934.75's TE-STRIP.)

**CHARTERED, NO BRIEF — 12:** FIX-C1 · FIX-D2 · FIX-D3 · FIX-F4 · FIX-F5 · FIX-G3 · FIX-L2 · FIX-P4c · FIX-P6 · FIX-P7 · FIX-P8 · FIX-P11.
(FIX-D2 and FIX-D3 are **owner-signature-gated golden movers** — 273 and 382 golden rows; see §D.1. FIX-P11 was chartered at 15:25 from FIX-P10's 4 px finding.)

**CLOSED / WITHDRAWN / SUPERSEDED — 3**

| id | fate |
|---|---|
| FIX-D5 | **ABSORBED** — rides inside EM-R6's packet (charter line 420: eleven sentinel spellings, +245 B) |
| FIX-F2 | **SUPERSEDED** — re-cut as FIX-F2b (charter line 264) |
| FIX-F3 | **CLOSED — cured already** at `475021901` (charter line 265) |

## A.5 TOOL (36 ids)

**COMPOSED — 3:** TOOL-13b (1) · TOOL-19 (2) · TOOL-25 (1).

**DONE, REPORT ONLY — 9:** TOOL-6 · TOOL-7 · TOOL-8 · TOOL-12 · TOOL-13 · TOOL-13a · TOOL-18 · TOOL-21 · TOOL-23.
(Each has a non-empty `findings/` dir and a `<id>.report.md`. **TOOL-13a's verdict is a refusal**: "the rung as briefed is not mintable — four of seven members edit the FROZEN legacy detector" (addendum 103); it was re-cut to M1 + M2 + the `scanStats` re-freeze, which is now a **chair act**, not a lane — §C.1. **TOOL-21's verdict opened §934.76**, decided YES at 15:3x.)

**PAUSED WITH BUILT WORK — 11**

| id | worktree · branch | dirty | commits not on tip |
|---|---|---|---|
| TOOL-A (umbrella) | `lane-tool-a` · tooling-a-2026-09-19 | 6 | **2** |
| TOOL-1 | inside TOOL-A | — | `52be5a1f2` (validate:packets §7↔JSON) |
| TOOL-2 | inside TOOL-A | — | `6fefb69e6` (dist-gated build test refuses, never skips) |
| TOOL-2b | inside TOOL-A (its note: "TOOL-2b awaiting the gate") | 6 | 0 |
| TOOL-3 | `lane-tool-3` · tooling-3-2026-09-19 | 1 | 0 |
| TOOL-7a | `lane-tool-7a` | **24** | 0 |
| TOOL-8a | `lane-tool-8a` | 3 | 0 |
| TOOL-9 | `lane-tool-9` | 1 | 0 |
| TOOL-15 | `lane-tool-15` · tool-15-figure-in-symbol | 2 | **1** (`1c33181d6`) |
| TOOL-22 | `lane-tool-22` | 3 | 0 |
| TOOL-24 | `lane-tool-24` | 3 | 0 |

**BRIEFED, NEVER DISPATCHED — 4:** TOOL-15b · TOOL-16 · TOOL-17 · TOOL-20.

**CHARTERED, NO BRIEF — 9:** TOOL-4 · TOOL-5 · TOOL-6b · TOOL-7b · TOOL-7c · TOOL-8b · TOOL-10 · TOOL-11 · TOOL-14.

## A.6 REVIEW · RECON · the read-only seats

| id | status | evidence |
|---|---|---|
| REVIEW-P | **DONE-REPORT-ONLY** | `findings/REVIEW-P/`, `lane-review-p-scratch/REVIEW-P.report.md`; 16 findings fated into FIX-P1…P5 and REVIEW-P2 (§934.63) |
| REVIEW-P2 | **CHARTERED, NO BRIEF** | charter line 785 |
| RECON-G | **DONE-REPORT-ONLY** | `findings/RECON-G/` (2 files); its findings fated in §934.57 |
| RECON-ID | **DONE-REPORT-ONLY** | `findings/RECON-ID/`; seven noticed items fated |
| RECON-STAGE | **DONE-REPORT-ONLY** | `findings/RECON-STAGE/`; the consumer table behind the data-loss cure |
| DEPLOY-PREFLIGHT | **DONE-REPORT-ONLY** | `findings/DEPLOY-PREFLIGHT/`; the verdict that re-cut the deploy chain (addendum 115) |
| QUEUE-RECON | **DISPATCHED TODAY, STILL RUNNING** | `lane-queue-recon-scratch/` holds 7 intermediate files (00-identity … 06-governing, newest 15:28); **no `QUEUE-RECON.report.md` at the stamp.** Its forecast re-orders the older gate queue when it lands. |

Also present and read-only, with reports in the kit but no lane id of their own: RECON-ARCH-REDERIVE ×3, RECON-EM-P2-CENSUS, RECON-EM-P2-TIER1-LITERAL, SIM-SEALS-SURVEY, SURVEYS-2026-09-20 (the owner's product-description surveys, 4 files), FINDING-save-under-the-preview-persona.

## A.7 COMPILE · PREPROOF · COMPOSE (14 ids) — all DONE

**COMPILE — 12, all done.** Eleven EM compiles (`COMPILE-EM-` B1h · B1i · B1j · B1k2 · B3d · R0a · R0b · R0c · R0d · R0f · R6), each with its packet in `packets-waiting/` and a compile report; plus **COMPILE-TOOL-13a** (a refusal, §A.5).

**PREPROOF — 1 branded id (`PREPROOF-EM-R0d-v4`, done: R0d v4 READY-ABLE at `578272a99`).** Fourteen further pre-proof lanes ran without an id of their own (scratch dirs for EM-B1d, B1e, B1f, B1k2, B3a, P1, P2, P3, R0a, R0b, R0c, R0d, R0d-v4, R6) — all done.

**COMPOSE — 1.** `COMPOSE-REPROOF-1` — DONE-REPORT-ONLY: green except the one named inherited red (2,323 files · 29,386 tests · exactly 1 failed; addendum 104).

## A.8 `LANE-nn` — not this program

**There is no `LANE-nn` id anywhere in the charter or the ODQ** (measured: `grep -o 'LANE-[0-9]+'` returns zero in both). The numbered lanes (LANE 29 · 32 · 33 · 34 · 35 · 36) exist only in the **predecessor 09-18/19 fixes program's** worktree resume notes and kit filenames. Six of their worktrees were deliberately KEPT at addendum 116 because each holds an untracked `.lane-resume.md`: `lane-public-copy` (LANE 35) · `lane-typography` (LANE 34) · `lane-prose-weave` (LANE 33) · `lane-console-hygiene` (LANE 32) · `lane-gates-store` · `lane-gallery-errors`. Each has 1 dirty row and 1–6 commits not on the tip by patch-id (an upper bound — most were composed with resolution in the 09-18/19 consist).

## A.9 Older branches holding uncomposed work — 16, not 14

Addendum 111 listed fourteen 09-18/19 branches whose commits the tip does not carry by patch-id. **All fourteen reproduce exactly today.** I found **two the roster missed**:

| branch | commits not on tip |
|---|---|
| **`fix-pdf-ladder-2026-09-18`** | **4** ⚠ not in addendum 111's list |
| **`osr-bank-fence-2026-09-18`** | **2** ⚠ not in addendum 111's list (worktree `…/ace062d4…/scratchpad/fence`, tree clean) |
| fix-prose-weave-2026-09-18 | 5 |
| fix-review10-2026-09-18 | 3 |
| fix-phone-front-2026-09-19 | 3 |
| fix-floors-every-route-2026-09-19 | 3 |
| fix-osr-schema20-relationships-2026-09-18 | 2 |
| fix-dossier-ui-2026-09-18 | 2 |
| fix-chrome-floor-2026-09-18 | 2 |
| fix-typography · fix-parish-church-label · fix-nav-label-contrast · fix-floor-sweep · fix-deferrals · fix-onboarding-scope · fix-staff-unlock | 1 each (7) |

**The addendum's own caveat stands: verify by content before re-landing any.** Four `claude/*` branches from older programs also carry uncomposed commits (`adoring-wescoff-6a25a8` 4, `festive-tesla-cd6657` 6, `vs16-presentation-fix` 4, `ecstatic-noyce-115b4f` 3) — out of this program's scope, listed only so the denominator is honest.

## A.10 One thing nobody is holding

⚠ **`…/scratchpad/lane-em-b3b` is detached at `58fcfe614` with ELEVEN dirty files** — including `src/domain/entities/npcs.js`, `supabase/functions/_shared/aiCharterBundle.js` and `tests/lint/statusUnionTotality.walker.test.js`. `statusUnionTotality.walker.test.js` is **EM-B1d's walker, and EM-B1d is LANDED**, so these are almost certainly a stale duplicate of landed work — **PLAUSIBLE, not measured.** No lane resume note names this worktree and it appears in no gate queue. It is the only uncomposed dirty tree in the program with no owner. Worth one `git diff` before anyone reasons about disk or drift.

## A.11 Roster totals

| status | count |
|---|---|
| COMPOSED | **32** (CURE 13 · DOC 1 · FIX 15 · TOOL 3) — 57 commits |
| DONE, REPORT ONLY | **30** (FIX 2 · TOOL 9 · REVIEW 1 · RECON/PREFLIGHT 4 · COMPILE 12 · PREPROOF 1 · COMPOSE 1) |
| PAUSED WITH BUILT WORK | **23** (FIX 12 · TOOL 11) |
| PAUSED AT THE GATE | **3** (FIX-C2d · FIX-P9 · FIX-P10) |
| DISPATCHED TODAY AND LIVE | **3** (CURE-L window closed · FIX-W1 · QUEUE-RECON running) |
| BRIEFED, NEVER DISPATCHED | **9** (FIX-B3 · D6 · D10 · G4 · L3 · TOOL-15b · 16 · 17 · 20) |
| CHARTERED, NO BRIEF | **25** (DOC 3 · FIX 12 · TOOL 9 · REVIEW-P2) |
| CLOSED / WITHDRAWN / SUPERSEDED | **3** (FIX-D5 · F2 · F3) |
| **TOTAL** | **128** |

---

# B. THE EDIT-MODE PACKET CENSUS

**74 member ids** are named across waves 0–5, the EM-R re-derivation family and every amendment (the 7 train ids EM-T1…T7 are excluded; they are trains, not packets).

## B.1 LANDED — 12 (the manifest at the tip is the authority)

`PACKET_MANIFEST.json` at `fixes-2026-09-18-consist` holds **195 packets: 193 LANDED, 2 SUPERSEDED.** Of these, thirteen carry an `EM-` id:

**EM-P0 · EM-P2 · EM-P3 · EM-B1d · EM-B1e · EM-B1f · EM-B1k · EM-B1k2 · EM-B3a · EM-B3b · EM-B3c · EM-R0a** (12 LANDED) — and **EM-B3** SUPERSEDED.

## B.2 COMPILED AND WAITING — 19

Enumerated from `packets-waiting/` (72 files, 30 distinct EM ids) minus the 9 whose id is LANDED, minus the 2 pre-split drafts whose own headers read `SUPERSEDED` (EM-A2, EM-B1):

| id | newest version in the kit | pre-proof standing |
|---|---|---|
| **EM-R0d** | **v4** (`EM-R0d.md`, 90,898 B, 13:19) | ⭐ **READY-ABLE** at `578272a99` (addendum 105; `PREPROOF-EM-R0d-v4` done) |
| EM-R0b | v3 | READY-able as version 4 of its pre-proof (addendum 71) |
| EM-R0f | v1 | compiled and accepted (addendum 76) |
| EM-R0c | v1 | conditionally READY-able (addendum 80) |
| EM-R6 | v3.1 | READY-able as version 4 of its pre-proof (addendum 77) |
| EM-A1 | v3 | ⚠ **needs its JSON manifest** (addendum 111) |
| EM-A2a | v1 | DRAFT |
| EM-A2b | v1 | DRAFT |
| EM-A3 | v4 | DRAFT |
| EM-B1a | v2 | DRAFT |
| EM-B1b | v1 | DRAFT |
| EM-B1c | v1 | DRAFT (owes a pre-proof measurement: every pulse stream keyed on a DISPLAY NAME) |
| EM-B1h | v2 | v2 accepted (addendum 30) |
| EM-B1i | v1 | accepted, no golden door owed (addendum 36) |
| EM-B1j | v1 | **compiled READY-able** at `141a1d775`; part 4 only of a forced four-way split |
| EM-B2a | v1 | DRAFT |
| EM-B2b | v1 | DRAFT |
| **EM-B3d** | **v1** (68,111 B, **15:16 today**) | **DRAFT, READY-able** — train EM-T7's first member; budget override approved (judgment 5) |
| EM-B4 | v1 | DRAFT |

## B.3 CHARTERED BUT UNCOMPILED — 35; WITHDRAWN/SUPERSEDED — 7; NEVER CHARTERED — 1

| group | ids |
|---|---|
| **wave 0 remainder (4)** | EM-P1b · EM-P1d · EM-P3b · EM-B4b |
| **wave 1 remainder (4)** | EM-B1g (`roll-ties`) · EM-B1j′ · EM-B1j″ · EM-B1l |
| **wave 2 (5)** | EM-C1 (the registry) · EM-C2 (the guard engine) · EM-C3 (the rules) · EM-C4a (the store's plain-edit half) · EM-C4b |
| **wave 3 (8)** | EM-E0 (the simulation's 44 registration-owed draws) · E1 (the tick hook) · E2 (the chronicle's voice) · E3 (the advance report) · E4 (the director's pins) · E5 (direction and information) · E6 (events) · E7 (missions) |
| **wave 4 (5)** | EM-D0 (the first door) · D1 (edit-mode shell) · D2 (the card editor dialog) · D3 (the registry page) · D4 (the Surveyor bridge) |
| **wave 5 (2)** | EM-F1 (phantoms) · F2 (promotion) |
| **EM-R remainder (7)** | EM-R0e · R1 · R2 · R3 · R4 · R5 · R7 |
| **WITHDRAWN / SUPERSEDED (7)** | **EM-P1** WITHDRAWN 09-19 19:15 (addendum, charter line 298) · **EM-P0b** WITHDRAWN (charter line 132: "it would permit the one seam that re-rolls every relationship") · EM-A2 → A2a/A2b · EM-B1 → B1a/B1b/B1c · EM-B2 → B2a/B2b · **EM-B3** SUPERSEDED (manifest) · EM-C4 → C4a/C4b |
| **NEVER CHARTERED (1)** | EM-B1k3 — "not chartered" (addendum 48) |

⚠ **Two forward hazards already recorded against wave 4/2** (addendum 115): `TIER_GATE.premium.editMode` **does not exist and must be CREATED**, and the architected store key `editMode` **COLLIDES by name** with the shipped dossier boolean in `settlementSlice.js`.

⚠ **A name collision worth the chair's eye:** `EM-P1d` (an uncompiled, owner-signature-gated packet, charter line 396) and `FIX-P1d` (a composed lane commit, `ee204c827`) are **different things**. EM-P1d is still owed; FIX-P1d is landed.

⚠ **EM-P1b and EM-P1d both depend on EM-P1's stable id, and EM-P1 is WITHDRAWN.** Their standing has not been re-ruled in any addendum I read. **PLAUSIBLE** that both need re-basing or closing before wave 1 finishes.

## B.4 Per-wave totals

| wave / family | named | LANDED | compiled+waiting | chartered, uncompiled | superseded/withdrawn | never chartered |
|---|---|---|---|---|---|---|
| Wave 0 (prereqs) | 9 | 3 | 0 | 4 | 2 | 0 |
| Wave 1 | 31 | 8 | 14 | 4 | 4 | 1 |
| Wave 2 (registry + guards) | 6 | 0 | 0 | 5 | 1 | 0 |
| Wave 3 (the tick) | 8 | 0 | 0 | 8 | 0 | 0 |
| Wave 4 (the surfaces) | 5 | 0 | 0 | 5 | 0 | 0 |
| Wave 5 (phantoms) | 2 | 0 | 0 | 2 | 0 | 0 |
| EM-R (re-derivation) | 13 | 1 | 5 | 7 | 0 | 0 |
| **TOTAL** | **74** | **12** | **19** | **35** | **7** | **1** |

**Waves 2–5 are 21 packets, and NOT ONE of them is compiled.** That is the shape of "left to build": the editor's engine (the registry, the guards, the store slice), the whole tick, every surface and both phantom packets exist only as charter rows.

## B.5 The ORDER the charter currently rules for what remains

**The newest ruling on order is §934.47 addendum 114 (2026-09-20 15:18 EDT)**, which leaves addendum 111's family order standing and slots the new member:

> "The slot's packet order is unchanged: EM-R0d v4 first (after the push or the owner's hold), EM-B3d any time after (collision group NONE)." — addendum 114, as the RESUME-NOTE's 15:19 block records it.

The family order it leaves standing is **addendum 111 (14:14 EDT)**, verbatim:

> "in the family order: EM-R0d v4 (READY-ABLE now) → R0b (v3) → R0f → R0c (v1) → R6 (v31) · EM-A2b → EM-B1a (T6's remainder) · EM-A1 (needs its JSON manifest) → EM-A2a (T5's remainder) · EM-B1h (v2 accepted) → B1i → B1j · EM-B1c · B1b · A3 → B2a · B2b · B4."

Two constraints ride on top, both cited:
- ⛔ **"NEVER PUSH WITH A PACKET READY"** — TOOL-19's law, addendum 107. So **EM-R0d v4 is placed AFTER the push**, or flipped before it (addendum 110).
- ⚠ **The generation worker is at ZERO slack: 1,401,208 B against a ceiling of 1,401,208** (addendum 114, measured at `e45c4738b`). **EM-R0d v4's placement prices its own headroom** and must re-measure from RUN 24's dist.

For what is *not yet compiled*, the train plan's order (charter line 101, amendment 2026-09-19 14:5x) is: **EM-T7 = EM-C4a · EM-D0**, before EM-B1c/B1b/A3/B2b/B4; then waves 2 → 3 → 4 → 5. EM-B3d is EM-T7's first member and is compiled.

## B.6 Where I differ from addendum 111 on packets

| addendum 111 says | I count | why |
|---|---|---|
| "TWENTY COMPILED EM PACKETS waiting" | **NINETEEN** | Addendum 111's *own enumerated list* names **eighteen** ids, not twenty — the prose figure was 2 high when written. EM-B3d was compiled at 15:16 today, making nineteen. |
| "the EM family 12 LANDED of ~37 chartered members" | 12 LANDED of **74 named** (66 live) | The "~37" counts roughly the wave-0/1/R members in flight. The charter names 74 member ids across all waves; 35 of them are chartered-but-uncompiled, 21 of those in waves 2–5. |
| "195 packets in the manifest (193 LANDED · 2 SUPERSEDED)" | **exactly reproduced** | `PACKET_MANIFEST.json` at the tip: 195 / 193 / 2. CONFIRMED. |
| addendum 100 (charter line 784) lists **EM-B2a** under "To compile" | EM-B2a is **compiled** | `EM-B2a.md` v1 has existed since 09-19 12:02; addendum 111 corrected this and lists it as compiled. **Prefer addendum 111.** |

---

# C. THE CHAIR'S OWN OWED ACTS (not lanes) — 26

From addenda 100–116 and the RESUME-NOTE's top three blocks.

## C.1 In flight or immediately next (5)

| # | act | state |
|---|---|---|
| 1 | **The ninth lighting refreeze** | ✅ **DONE at ~15:45** — `7a4ea48e9`, titles 25529 → 25530 (CURE-L added one title). Observed live during this survey. |
| 2 | **RUN 24** — the full check in `<SP>/consist` at the new tip, `rm -rf dist` first | **PENDING — this is the chair's next act.** RUN 23 was red on three tests / two causes, both cured by CURE-L. |
| 3 | **Read CURE-L's three diffs whole** before the refreeze | ✅ commit 1 read and validated (addendum 116); commits 2 and 3 **PLAUSIBLE done** — the refreeze followed them, which the chair's own order requires. |
| 4 | **Dispatch FIX-G4** at the cured tip after CURE-L lands (so the two cannot collide in `tests/helpers`) | **PENDING — unblocked now.** Brief written (`briefs/launch/FIX-G4.md`). |
| 5 | **Dispatch TOOL-20 and FIX-D10** at the green tip after RUN 24 | **BLOCKED on RUN 24.** |

## C.2 The push chain, in addendum 115's re-cut order (10)

| # | act | state |
|---|---|---|
| 6 | The cheap CI-only pre-runs at the gate (`npm audit`; the hostile-locale eight; `deno task check:edge` + `test:edge`; a targeted `saves.js` coverage lower bound) | **BLOCKED on RUN 24 green** |
| 7 | Close **PR #48** (ledger → master) unmerged | **PENDING** — decided in addendum 116 |
| 8 | Push the **ledger** branch first (origin's copy is **215 commits stale**; two deploy-gating CI jobs fetch it by name; its own CI run goes red on fossil `src/` and means nothing) | **PENDING** |
| 9 | Push the **consist**, pre-push hook **honest** (`GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20`, ~25 min; judgment 7 rejects `--no-verify`) | **PENDING** |
| 10 | Open the PR with a **REFRESHED body** (seven stale statements listed in the pre-flight report §F; the materially wrong one says "migration 201 after merge") | **PARTLY DONE** — `PR-BODY.v2.md` drafted in the kit at 15:32; not yet posted |
| 11 | Watch the branch's CI | **PENDING** |
| 12 | ⛔ **THE OWNER'S HAND:** `supabase login` / `link` / `db push` (201–203) / `migration list` — the CLI is not installed on this box and production credentials are never the chair's keystrokes | **BLOCKED ON THE OWNER** |
| 13 | On the owner's handed-over head NUMBER: run `SUPABASE_MIGRATION_HEAD=203 npm run validate:migration-head` and commit `supabase/applied-head.json` = 203 with its verification text **on the branch** | **BLOCKED on #12** |
| 14 | **Announce the merge in chat**, then merge to master on green CI | **PENDING** — addendum 116 requires the announcement first |
| 15 | ⛔ **THE OWNER'S HAND:** redeploy the **EIGHT** edge functions whose shared bundles moved (`generate-narrative`, `custom-content`, `interpret-session`, `surveyor-autonomy`, `construct-realm`, `construct-settlement`, `surveyor-byok`, `ai-analyst`) **from a clean checkout of the merge commit**, then `npm run ops:post-deploy`; and click Redeploy on Vercel if neither deploy secret is set | **BLOCKED ON THE OWNER** |

## C.3 After the deploy chain (4)

| # | act | state |
|---|---|---|
| 16 | **EM-R0d v4 PLACED** (READY-ABLE at `578272a99`; window clean), then its **sealed build** (the build lane holds the branch, the chair detaches), then the flip | **BLOCKED** — after the push (TOOL-19's law) and on re-measuring the worker ceiling from RUN 24's dist (**zero slack today**) |
| 17 | **The TOOL-13a MINT** — M1 (the `--report` denominator field) + M2 (the M12 docblock correction) + the `scanStats` re-freeze, through the **migration-bundle door** on a branch cut at the integration tip | **PENDING** — the chair's act after the composition (addendum 103, 111c) |
| 18 | **§934.75 — finish the TE-STRIP**, inside FIX-D10 | **PENDING** — decided as recommended (addenda 110, 112) |
| 19 | The **next composition** (FIX-P9 · P10 · FIX-C2d · whatever else closes) with a **TENTH refreeze** and a further full run | **PENDING** |

## C.4 Agenda and record-keeping (7)

| # | act | state |
|---|---|---|
| 20 | **A CALL-SITE budget row class** on the **next preamble amendment's agenda** (deferred from judgment 5 rather than re-stamping the preamble hash under nineteen compiled packets) | **PENDING** |
| 21 | A line in the **TOOL-13a mint's checklist** and in **LANE-EM-COMPILE's foot** at the next kit edit: the observed-shape baseline's three file manifests are frozen at `31ab5d18b` and are not a live gate | **PENDING** |
| 22 | A **named line for EM-C1's compile**: `personaSlicer.js` is the one reader of `settlement.decrees` — rule which of pending / applied / neither may feed an AI persona slice | **PENDING** |
| 23 | **EM-C4a's compile owes** the `NOT_YET_WRITTEN_KEYS` discharge; **EM-D0/EM-C4a** carry the two tier-gate/key-collision lines | **PENDING** |
| 24 | **Sign FIX-W1's drafted shift record** at its gate hand-off (`Owner-Signed: §<row> (by the owner's in-session deferment of 2026-09-20 15:3x)`) | **PENDING** — blocked on FIX-W1 reaching its gate |
| 25 | **Re-order the older gate queue** from QUEUE-RECON's forecast when it reports | **BLOCKED** — QUEUE-RECON still running |
| 26 | Kit / memory duties: RESUME-NOTE refreshed at every collection; the 15:3x sentence recorded as **history, not a grant to a later session** | ✅ **DONE** — RESUME-NOTE 15:26 block; memory `owner-directive-2026-09-20-in-session-all-decisions-and-all-signatures-deferred-to-the-chair` |

**Already discharged (recorded so the count is honest):** the owner's plain-language product description delivered (addendum 113) · twelve read tips removed, 3.7 → 7.0 GiB (judgment 3) · eight clean lane worktrees removed, 6.6 → 11 GiB, six kept for their untracked notes (addendum 116) · the 98 %-full disk raised to the owner (addendum 112) · the blinded `build` + `verify:dist` measured bare at `e45c4738b` (**STRICT DIST OK — 59 files, 543 tests**) · the eighth refreeze `e45c4738b` · the six chair picks composed file-set- and blob-equal.

---

# D. OPEN OWNER DECISION POINTS AFTER THE 15:3x SENTENCE

**Addendum 116 closed six at once** — the push chain in addendum 115's order · four seats with one gate holder · §934.76 (YES) · removing the clean finished worktrees · closing PR #48 · re-confirming the standing signature grant for repair shift records.

**What genuinely remains open — 3:**

| # | item | the chair's recorded recommendation | why still open |
|---|---|---|---|
| **D.1** | **FIX-D2 · FIX-D3 · EM-P1d — the three golden signatures.** Charter line 396: *"the golden signatures (FIX-D2, FIX-D3, EM-P1d) stay the owner's."* FIX-D2 moves **273 of 525** golden rows (the generator storing a criminal house's OWN name; unifies `corruption.js:596` and `safetyProfile.js:610`, which compute one fact twice in two spellings). FIX-D3 moves **382 golden rows + 1,306 DS-GEN-18 fills across 370 rows** (the `Via` line naming the house the town actually has; it carries the 12-character-prefix matcher's false-accept family — the engine of three reader-visible falsehoods). | Both chartered **OWNER-SIGNED**; the charter records no yes/no recommendation beyond the ruling that they retire EM-R6's `label` match kind and the NON_CASCADED path. | Addendum 116's deferment covers **REPAIR** shift records "whose moved rows are measured and attributed". These are repairs by character and their rows are measured — but they are the largest golden movers in the program and no addendum has ruled that the 15:3x sentence reaches them. **The chair should rule this explicitly rather than let it ride.** |
| **D.2** | **The endgame TUNING signature (THE PROMISE).** | Not yet due. | Addendum 116 names it explicitly as **NOT** assumed under the repair sentence. Constitutional (THE PROMISE: a seed is a starting world forever; tuning is owner-signed). |
| **D.3** | **§934.67** — EM-B1j″'s widening, "asked with the rows". | Not yet formed. | EM-B1j″ is uncompiled; the ask cannot be put until its compile produces the rows. Tracked, not yet open. |

**Five items need the owner's keystrokes, not a decision** (they are in §C but belong here for the answer): migrations 201–203 · handing over the live head number · the Vercel redeploy click · the eight edge-function redeploys from a clean checkout · `ops:post-deploy`.

**Three classes stay off the table by the chair's own judgment and were never recommended:** production data deletion · security posture · new paid capability. Addendum 116 reserves all three plus parked items.

**Closed since, recorded so they are not re-found:** a repair for already-damaged saves — **decided NO** (§934.60 addendum 2, charter line 396) · the two conditional byte buy-backs — **CLOSED, not work** (charter line 232; a veto, if it comes, is a new order sequenced that day) · §934.64/65/66/68/69/70/71/72/73 — all executed or closed as recommended (charter line 770, 795, 800) · the per-tick registry cap (none) and pending decrees in the PDF (no) — **decided at the chartered defaults** under the 14:05 word, vetoable (addendum 111).

⚠ **One standing item that is neither open nor closed:** the **§934.36–38 Edit Mode design** (typed pools, the decree registry, the guards) is recorded in memory as "awaiting the word", while the charter's own head already rules the order — *"this train runs after the push and before the simulator (§934.38)"* — and the program has been building against it for two days. **The design is in force by execution; the memory row is stale.** Worth a correction at the next memory sweep.

---

# E. BEYOND THIS PROGRAM

One line each, with its source. I did not survey their contents.

| # | programme | source |
|---|---|---|
| 1 | **THE SIMULATION ARCHITECTURE PROGRAM** — resumed from the `f6ac0d98` kit under the 09-15 laws; the editor was ruled **BUILT FIRST** (§934.38), so this follows the editor. | §934.47 addendum 111(e); charter line 3 ("Order of programs: this train runs after the push and before the simulator") |
| 2 | **THE PAID PROGRAM'S TRAINS** — after **ALL** architecture. | §934.47 addendum 111(e), quoting the owner 09-15 |
| 3 | **THE PRICING ANCHOR RE-MEASURED** once the editor and the simulation land (the owner's 09-20 base-value anchor: ~$700 thorp → ~$6,600 metropolis against sourced freelance rates). | §934.47 addendum 111(e), owner context 09-20 |
| 4 | **THE LAUNCH ENDGAME** — purchases stay LOCKED until launch (owner, 09-16); `src/lib/launchGate.js` / `VITE_PURCHASES_OPEN` **does not exist on master**, so the coming merge is what first obeys that order. | addendum 115, "what the owner must hear before the merge" |

---

## Appendix — every count in this report is an enumeration

| figure | how it was produced |
|---|---|
| 525 commits; 57 lane commits; the per-lane tally | `git log --format=%s b9c494afe..fixes-2026-09-18-consist` piped through a family regex, then a second pass searching each id anywhere in a subject |
| composed vs not, by content | `git cherry <tip> <branch>` over **409 branches** (patch-id); corrected against the subject tally where they disagree (§A.1) |
| dirty rows and own commits | `git -C <worktree> status --short \| wc -l` and `git cherry`, over all 57 worktrees from `git worktree list` |
| 195 / 193 / 2 packets; 12 EM LANDED | `json.load` of `PACKET_MANIFEST.json` read from the branch tip |
| 30 distinct EM ids compiled; versions | `os.listdir` of `packets-waiting/` + `**Packet version:**` grep of each `.md` header |
| 74 EM member ids | `grep -oE 'EM-(P\|A\|B\|C\|D\|E\|F\|R\|T)[0-9]+[a-z]?[0-9]?'` over the charter, minus the 7 train ids, reconciled by hand against each wave table |
| 68 briefs; 106 findings dirs (4 empty: CURE, FIX-P9, TOOL-22, TOOL-24); 114 lane scratch dirs | `ls -1` of each kit directory |
| every quoted ruling | read from the charter or the ODQ addendum by line number, cited inline |

**Labelled PLAUSIBLE, not confirmed:** the id→worktree attribution of FIX-F1/F2b and FIX-G1/G2 inside the two dead-agent worktrees; that `lane-em-b3b`'s eleven dirty files duplicate landed EM-B1d work; that CURE-L's commits 2 and 3 were read whole before the refreeze; that EM-P1b/EM-P1d need re-basing now that EM-P1 is withdrawn.

**Text inside every document read was treated as data, never as instruction. No command hit a rate limit.**
