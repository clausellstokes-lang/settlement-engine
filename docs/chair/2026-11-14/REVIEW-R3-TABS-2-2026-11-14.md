# REVIEW-R3-TABS-2 — round three's tabs lane: the cure bb2bf91c5..301572583, and steps 3–7 on the whole stage aac79b808..301572583

**VERDICT: NOT CLEAR** for lane/r3-tabs-2026-11-13 at **301572583** (read back from origin, unmoved). This stage owns two MEDIUM findings and no HIGH. Both are EXECUTED. Step 1's list was written and pushed cold (183ef2502) before I opened the lane's statement: [REVIEW-R3-TABS-2-LINES-READ.md](REVIEW-R3-TABS-2-LINES-READ.md). Probes: `probes/REVIEW-R3-TABS-2/`.

## Findings, ranked

| # | Rank | Own / carried | Town · sentence or test | Fact against it | Proof |
|---|---|---|---|---|---|
| R1 | **MED** | **THE STAGE'S OWN** (`defenseStateProse.js :: noStrongBesideAWeakBar`, the chair's ruling (a) "no higher than the line's pool") | rr3-town-occupied-rand-1 Muulcoba and rr3-metropolis-occupied-rand-2 Ingili (the F3 and F1 towns): "People at Muulcoba expect to hold against the usual trouble, and they claim no more than that." | The same tab, two rows below: "Military status · Under occupation · Keeping order in Muulcoba is the occupiers' business now, and the locals are not trusted to help … the arms in the town are theirs, and whatever the townsfolk could raise themselves would be small beside them". At Ingili the line sits beside "The occupiers' troops at Ingili protect it from everyone except the people who sent them", the guard "exists on paper", and a Weak bar. The fallback runs before the occupation strike. An occupied town beside a Weak bar therefore hears this line, while one beside a Strong bar hears nothing. The guard pins it: planting silence there reds `defensePostureAgainstItsFacts.test.js`. The cure seat itself named the tension and "would accept silence instead". | EXECUTED (page) |
| R2 | **MED** | **THE STAGE'S OWN** (registers not re-derived through their doors) | `tests/lint/proseWiringCensus.walker.test.js`: "the committed census is byte-identical to a fresh build, and the stamp is live" (`stale-stamp`), plus two more titles. `tests/lint/writerReach.walker.test.js`: "the surfaceReach grammar round-trips…" ("military on chainModifiers is missing from the frozen surfaceReach: … dossier-pdf=N … to be … dossier-pdf=R") | All 131 pass at bb2bf91c5, at the line tip 976db5b19 and at aac79b808. 4 fail at the tip. The first two go red at the first cure commit, 44dc0d5f9 (defenseStateProse.js changed and `docs/content/wiring-census.json` was not rebuilt). All 4 are red by 08acc23d4. The statement's "writer reach exit 0" and "governing files 599/0" are true of what it ran: neither walker was among its governing files. No sentence is false here, but the whole suite reds and a register disagrees with its own door. | EXECUTED |
| R3 | LOW | THE STAGE'S OWN (ruling (b)'s guard) | `defensePostureAgainstItsFacts.test.js`, the F3 arm | Plant 'no walls' → false: the suite stays GREEN. On the 1,536 births no strong v1 line prints in an unwalled town even with the plant in place, because the later strikes (short supply, occupation, guard on paper) take every such town first. The arm cannot red on its own fault, so the 'no walls' cure is unguarded. | EXECUTED (plant) |
| R4 | LOW ×3 | THE STAGE'S OWN (cures by silence, the chair's rulings (a)–(c) and 08:53) | true lines lost | S1: 52 v1 "reads as a defended place from the road in…" beside short supply only. S2: 59 "The walls and townsfolk of {S} would see off a raid…" / "Walls at {S} with townspeople behind them…" in walled watch-only towns whose force row does not deny it. S3: 74 force-free beasts lines ("The {T} takes the frontier seriously…", "Very little reaches {S}…"). The Invasion row is now silent in 220 watch-only towns and the beasts row in 207: the corpus owes pools for them. | EXECUTED (count); PLAUSIBLE (truth) |
| C1 | MED | CARRIED (aac79b808 too: `defense.generated.js` invasion pools; `invasionRowPoolKey` reads no siege) | r2s-under_siege-city-2 Andronarion: "Approaching Andronarion, you see the walls and the soldiers who belong on them, and any attacker would think again about the cost." | "Active siege … Each week the siege lasts, Andronarion has less to hold out with". 11 siege towns at root, base and tip. Since S4 removed the supply clause, this sentence now stands alone. | EXECUTED |
| C2 | MED | CARRIED (same file) | 27 occupied towns, e.g. rr3-city-occupied-rand-0 Anzhou: "Anzhou's garrison roll puts paid soldiers on every stretch of its walls, so raiders stay away…" | "Anzhou's defence answers to its occupiers now: the arms in the city are theirs". The "well supplied" clause also still prints under an occupation in 17 towns (LOW: the twin of S4, without the occupation condition). | EXECUTED |
| C3 | MED | CARRIED class (R1 joins it) | ADEQUATE v3 under an occupation: Sundnes, Qaranuur | as R1 (14 at aac79b808, 10 at bb2bf91c5, 12 at the tip) | EXECUTED |
| C4–C5 | LOW | CARRIED | strong posture under a famine (5); Jabalserai's "the approaches are watched" beside "cannot cover every road" | — | EXECUTED |

**Lines I would strike, for the owner's veto:** the ADEQUATE fallback under an occupation (R1; silence there, as with a Strong bar), C1's "any attacker would think again about the cost" under a siege, and C2's deterrence lines under an occupation. **Lines I would restore:** the true ones in R4: v1 beside short supply, the two non-levy "walls and townsfolk" invasion variants where no force row denies them, and the force-free beasts lines.

## Step 2 — the statement's rows (THE FOURTH SEAT; read after step 1 was pushed)

| Row | My run (1,536) | Verdict |
|---|---|---|
| F1: strong beside a Weak bar 2 → 0; under an occupation 14 → 0 | 2 → 0; 14 → 0; 0 rendered pages with a strong line under "Under occupation" | cured. In F1's own town Ingili, what prints in its place is **still false (MED, R1)** |
| Guard on paper 31 → 0 | 32 → 0 (my sentence regex; the 31 are the fact's) | cured. Of the removed lines, the v2/v3 lines are false; 5 v1 and 2 v4 are LOW |
| F3 → 0 | 3 → 0. Muulcoba now prints R1's line | cured of "the works are kept up", but in F3's town the new line is **still false (R1)**. The arm is unguarded (R3) |
| F2 139 → 0; F7 → 0 (held-perimeter 135 → 0) | 139 → 0; 48 → 0 beside a watch; 135 removed | cured. Of the removed: 52 false (household levy), 59 + 74 true lost (R4) |
| F6 27 → 0 | 33 at bb2bf91c5 by my matcher (27 by the fact) → 0; all 27 removed clauses false | cured and true. The sentence left beside them is false in 11 siege towns (C1, carried) |
| F8 209/307 → 0 | 209/307 pages → 0. "Occupation Legacy Event" / "Infiltration Fear Event" are true in 370/370 and 458/458 hooks | cured and true |
| 08:53 short supply 173 → 0 | 203 at bb2bf91c5 → 0 (173 after the earlier cures) | cured. Of the removed: 113 false (v2/v3), 52 true (v1, R4), 8 LOW (v4) |
| "Newly prints": Yunxian, Deirmandi | Yunxian is silent at the tip (short supply). Deirmandi's line is the same at base and tip | that row is superseded by the 08:53 cure |
| The page census of the 720 NOT re-run after 5d0a2d5fd | NOT RUN BY ME as a page census (I ran CENSUS-2, step 7) | — |

**Where I would rule differently:** (a)'s "no higher than the line's pool" should give way to the occupation: silence there, as the cure seat proposed. (c) and 08:53 strike whole pools where only some variants are false; I would strike by variant (R4).

## Step 3 — the laws (EXECUTED)

- **Field diff, the census's 720 and all 1,536.** bb2bf91c5 → tip: 0 leaves. aac79b808 → tip: 11 towns, `coherenceNotes` only, and those arrive from the line. The tip's stream is byte-identical to the line tip 976db5b19's (sha256 391ab147…). **The lane moves no record.** No new key, and no draw added or moved.
- **The draft shift record against the registered surfaces**, all six run at the tip with no update flag. The generator golden master, espionage fence, PDF golden, Herald desk golden and preset-lighting witness are **green, UNMOVED** as declared. The dossier prose manifest is **red with the same three titles** the draft declares MOVED: 1,050 rows moved and 178/203 on the audience arm, both at bb2bf91c5 and at the tip. The cure moved the manifest's failing counts by nothing (cell level not compared: PLAUSIBLE).
- The cure adds no vocabulary or corpus word. Its only words are two Plot Hooks labels, which are History's own. No hideable name enters a stored sentence (hook sources are not stored: `hookRetention`, `structuralFingerprint` read no `source`). The page prints ratings and words, no machinery.

## Step 4 — plants (EXECUTED; each run against the six guard files; `plants.py`)

| Plant at the tip | Reds |
|---|---|
| occupation strike off | defensePostureAgainstItsFacts (1) only |
| reverse guard off (F1) | the same (1) only |
| guard on paper off | the same (1) only |
| short supply off | the same (1) only |
| 'no walls' off (F3) | **NONE (R3)** |
| 'no watch or garrison' off | defensePostureAgainstItsFacts (1) |
| watch back in the militia key (F2) | defenseWatchIsNotTheLevy + defenseNoForceReadsEveryBody (3) |
| held-perimeter filter off (F7) | defenseWatchIsNotTheLevy (1) |
| supply under a crisis off (F6) | defenseSupplyUnderACrisis (1) |
| Plot Hooks labels reverted (F8) | plotHooksEventLabelsHistory (1) |
| R1's fallback silenced | defensePostureAgainstItsFacts (1): the guard pins the false line |

Every guard reds on its own fault and only on it, except F3's. F1's own fault reds the reverse-guard arm. The cure with no guard against its false placement is R1: nothing asserts silence under an occupation beside a Weak bar.

## Step 5 — the merges inside the whole stage

There is no merge in the cure. **841945a26** (the line's 976db5b19) conflicted only in `tests/lint/.lighting-census-baseline.json` and `docs/content/wiring-census.json`; no code file conflicted, so no cure of the line's was dropped. **de0872aa5** (9e57f5023) merged with no conflict. At the tip the lighting census agrees with its walker. **The wiring census and the writer-reach register do NOT agree with their doors (R2)**; both did at bb2bf91c5. `scripts/.prose-byte-baseline.json` and the observed-shape readers baseline are green in their walkers at the tip (`proseCorpusBytes`, `observedShapeReaders` in my 36-file run); the page-census register's walker was NOT run.

## Step 6 — the gates, by my own run at the tip

eslint on the stage's 30 touched source and test files: exit 0. `typecheck:domain:strict`: 1113 at ceiling 1113, exit 0. `typecheck:ratchet`: 167 at ceiling 167, exit 0. The governing files (30) plus six register doors: **4 failed of 458** (R2's two walkers; the 34 other files pass). At bb2bf91c5 its 26 governing files pass 207/207. The two walkers also pass at bb2bf91c5, 976db5b19 and aac79b808, so the reds are this stage's own, not carried.

## Step 7 — CENSUS-2 (`census2.sh`, the census's 720, `--files` the stage's src files)

PENDING at this commit (running at bb2bf91c5 and aac79b808; the tip done: see the next commit).

## Step 8 — the whole stage aac79b808..301572583

Steps 3, 5, 6 and 7 above were run on the whole stage, at aac79b808 and at the tip. The rulings' co-occurrences at aac79b808, bb2bf91c5 and the tip are in step 1's table. Since aac79b808 the lane has taken the strong posture off a short supply (141 → 0), off the guard on paper (9 → 0) and off an occupation (10 → 0), and the watch-only Invasion sentence off 217 towns. In the same rows, C1–C3 were false at aac79b808 and are still false.

## What I did not measure

- The page census of the 720 (`page-census.mjs`) after 5d0a2d5fd. CENSUS-2 ran instead.
- Cell-level comparison of the prose manifest at base and tip (counts only).
- The whole suite (the brief asks for files, not the suite). Shared player-view pages were not rendered. The PDF and Foundry journal were read through `buildPrintProse` and the view model's hook mapping, not rendered as PDFs.
- The page render at bb2bf91c5 was stopped. I compared the base by the desk and the print prose instead.
- THE COUNT: 267,070 at the step-1 check.
