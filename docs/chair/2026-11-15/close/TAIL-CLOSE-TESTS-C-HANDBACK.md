# TAIL-CLOSE-TESTS-C — hand-back (kept current with each push)

Branch `lane/tail-close-tests-c-2026-11-15`, cut from `lane/join-2026-11-14` at 0be92717.

## Measured at 0be92717 (before)
- `tests/lint/mutationCoverageManifest.test.js`: TOTALITY red, **154** invariant files with no entry (24 data, 129 generators, 1 lint); the brief's 148 had grown by six. Label join, dirty guard, shrink-only: green.
- `tests/lint/proseDrawnAnchors.walker.test.js`: red, six files (1 / 1 / 24 / 4 / 2 / 1, frozen none).
- `docs/chair/2026-11-14/probes/POWERS-16/{sumpdf,surf}.test.jsx`: collected, both red (import from an undefined `TREE`).

## 1. The manifest (status: batch 4 of 4 pushed)
Every entry is kind `rationale`, one written reason per file; none `uncovered` (baseline stays 186); no planted mutation was added, so `scripts/mutation-sweep.sh` and MUTATED_FILES are unchanged. Each rationale cites the file's introducing commit by hash (`git log --diff-filter=A`), names what the file pins (door, reader, towns), and states its red-first only where the commit body or the file header records it, in their words. Where neither does, it says "its red-first is not on record" and names the source file where a sweep plant is owed. No rationale claims an execution by this seat.
The red-first is not on record for seven: `tests/generators/prosperityStanding.test.js`, `tests/generators/defenceParts.test.js`, `tests/generators/npcStructureBody.test.js`, `tests/lint/defenceDerived.walker.test.js` (its only planted red is on fixture strings inside the file), `tests/data/tailHistoryBatch1.test.js`, `tests/generators/tailTies3Batch1.test.js`, `tests/data/holderTitleForms.test.js` (its commit records only the births arm red).
`tests/generators/magicCountOnce.test.js`: its commit's cure (reading A) was later withdrawn, so its rationale cites the header's red-first, not the commit's.
Batches: 1 = 39 entries, 2 = 38, 3 = 39, 4 = 38 (committed one batch at a time). Remaining after batch 4: 0.

## 2. The anchors (status: 3 of 6 files done; 3 MOVING, held for SWEPT)
Which files were moving: by the chair's corrected rule (05:10Z), the three-dot diff `git diff --quiet origin/lane/join-2026-11-14...origin/<branch> -- <file>`, re-run at 05:2xZ: MOVING are `tests/domain/corpusEcoTailGuards.test.js` (tail-corpus-eco), `tests/domain/tailCorpusDefGuards.test.js` (tail-corpus-def) and `tests/generators/tailNarrativeRows.test.js` (tail-narrative), the same three my earlier commits-ahead check found. These are held until the chair says SWEPT.
- `tests/components/displayEconRelianceFoodWords.test.jsx` (1): the NOT pair is now every member of DS-DEF-9 `magicDependency false` filled for Amarkota (`poolMemberTexts`). It is the same town and the same claim; it holds for every wording of the pool, not one.
- `tests/domain/tailDisplayCivic3V1.test.js` (4 literals on 2 rows): DS-POW-6 `GM ADVISORY: the commander is a political actor` vid 4 and DS-POW-4 `riskLabel: Contested` vid 4 (`variantByVid`). Each is filled once with the raw `Military/Guard` (must not print) and once with `powerSentenceName` (prints). The slots ahead of the power are a sentinel, and the anchor is the clause after it.
- `tests/generators/tailDefeconSafetyLines.test.js` (2): **NOT through drawnProse.js: a deviation, RULED by the chair (05:19Z): generator text exported as a constant is read from that export.** "Nobody here is paid to keep order" is generator text (`src/generators/safetyProfile.js :: NO_WATCH_SMALL[2]`, the line 1015 member). It is never drawn from a state leaf; the walker aligns it with DS-DEF-3 Moderate vid 5 ("Nobody at {settlement} is paid…", with settlement = "here") by coincidence. Computing it through drawnProse would assert a different sentence, so the anchor is taken from the generator's exported pool (`NO_WATCH_SMALL[2].split('. ')[0]`). The walker skips it as computed. The allow-list is not widened.
Proof: each touched file was run alone against a copy of its base text in the same run. The pass and fail counts were identical. displayEcon: 22/23 before and after; the 1 red is the KEEP row `r2s-famine-town-1 … Entrepôt Trade - 13%`, red at the base. civic3V1: 12/13 before and after; the 1 red is the CURED row `r2r-metropolis-50`, red at the base. defeconSafety: all green before and after. The walker no longer lists these three files. eslint on them: clean.

## 3. The probes (status: done)
`git mv` to `sumpdf.probe.jsx` and `surf.probe.jsx`, with the contents unchanged. No other `*.test.*` or `*.spec.*` is tracked under `docs/`. The vitest config is unchanged.

## After SWEPT f714fb6a5 (merged as 744fca73)
Two conflicts, and both sides' edits stand. In `tailDisplayCivic3V1` the imports were joined; the collected and anchored test body is theirs and carries my computed rows. In `displayEconRelianceFoodWords` their 5-column NOT rows with liveness anchors stand, row 2 is `NO_DEPENDENCY`, and `expectAbsentWithAnchor` runs once per pool member. The three-dot rule, re-run against every builder branch, shows all four of my files still.
- **Manifest:** 7 files had arrived (tailHistoryBatch6, tailHouses9/10/11, houseDescLateReRead, powersReadTheRosterP31, tailDefecon5RecordCures). Each got a rationale by the same law. The red-first is not on record for `tailDefecon5RecordCures`. tailHouses9/10/11 and powersReadTheRosterP31: their commits record red at the base but do not say green at the cure, and the rationales say only what the commits say. houseDescLateReRead: the commit records an executed plant (red 12 of 12). **TOTALITY green, 10 of 10.**
- **Anchors, the held three:**
  - `corpusEcoTailGuards`: the DS-GEN-13 `COMMERCE: a market, no guild` rows (gone v1/v3/v4, keep v1/v3/v4) and the DS-ECO-12 keep v1 take `memberRe(pool, vid)`. That is the member's whole authored text, read through `variantByVid` and matched exactly. It is the same vid claim, made stronger (whole member, not a fragment).
  - `tailCorpusDefGuards`: **a call for the chair to veto.** The REWORDED arm's 34 literal `now` fragments pinned each member's new words; they are gone. Each row now asserts that the leaf's member at that vid is the one `variantByVid` reads, and that it carries none of the old claim (`gone`, unchanged). The loss: a later rewording of the same member no longer reds this arm, which is the brittleness the walker exists to remove. The old claim's return still reds. One KEEP title quoted DS-POW-4's words and was reworded; it is a title, not an assertion.
  - `tailNarrativeRows`: the one hit was a KEEP row's TITLE ("the country around it"), generator text from `settlementOriginProse.js`. The title now names the path by its key; the assertion is unchanged.
  - **ANCHOR WALKER GREEN.**
- **Negatives (the inheritance):** `corpusEcoTailGuards:243`: the drawn-vids pin moved above the loop, and the loop carries the marker (that pin is its liveness). `tailCorpusDefGuards:170`: the marker sits on the line itself (the line above proves the live member). `coherenceAgreeCures:462`: the existing marker had been WRAPPED (the rule's own trap) and was moved to abut the assertion, which also clears its quarantine row. There are no findings: no stronger form turned a test red.
- **Proof:** each touched file was run alone beside a copy of its base text. The pass and fail counts were identical: corpusEco 133/136 both, and the 3 reds are DS-ECO-12 rows I did not touch, red at the base. tailCorpusDef, coherenceAgree and tailNarrative are all green both ways. eslint is clean on all six touched files.
- **Still red, not mine or held:** the negative walker lists crisisTab:102, tailCrisisBatch4:72 and tailCrisisBatch8:149, held for "THE CRISIS BRANCH IS ON THE LINE". The seed-loop walker lists tailCrisisBatch4:70,77, also held. The negative walker also lists `tests/data/tailHistoryBatch6.test.js:106`, a new arrival that is not in my assignment, named to the chair.

## (4) `tailTies2Batch1` "NOT (T6)": re-keyed by identity
`r2r-hamlet-4` and `r2r-village-16` are now an Elder Council's towns, after the powers' declared move d6880513, which is named in a comment on the row. They are re-keyed to `r2r-hamlet-3` and `r2r-village-21`. Those are the same tiers and census r2r-arm births, chosen by a walk of r2r-hamlet/village-0..59 at this tip. Each is under one ruler (`rulingBodyOf` false), holds one mutual_leverage tie, and prints no vote line. The fragments and assertions are unchanged. The T6 test is green; it was red at the base.
Also red in that file, and **not mine, and red at the base too**: "NOT (powerSiblings)", line 46, the occupied hamlet's elders' exact seat line. It is named to the chair.

## `tests/data/tailHistoryBatch6.test.js:106`: anchored
The MUST NOT loop now asserts its liveness anchor before the negative. For a twin row the anchor is the twin on the same slot (the same assertion as before, moved first). For the one SILENT row (`r2s-under_siege-thorp-1`, the creditor's agent) it is new: the town's timeline and tension hooks, among which the line stood, still print (`hooksOf`). The marker abuts the negative. The same pass and fail as its base text: MUST NOT red both ways on the same one case, `[10] r2s-plague_onset-village-0`, whose twin ("A pair of pack animals stands in a yard…") does not print. That is red at the base, not a finding of this change, and is named to the chair.

## The crisis files, after the line held 573c92b6d (merged at 0b1248dbf, clean)
- `tests/domain/tailCrisisBatch4.test.js`: the two bare seed loops (70, 77) are collected through `collectSeedFailures` / `expectNoSeedFailures`. The FALSE negative (72) is `expectAbsentWithAnchor(page, gone, instead, seed)`, the same pair with the anchor checked first.
- `tests/domain/tailCrisisBatch8.test.js` (the chair named it under tests/generators; it lives under tests/domain): the two parked `it.each` tables are plain parameterless loops of `it()` with the same titles, cases and assertions. In the FALSE rows the whole-stake `toEqual` now precedes the reason negative, which carries the marker. The SILENT negative (149) is anchored on the section's other rows printing (`rows.length > 0`, the header's own KEEP claim), with the marker abutting.
- `tests/components/crisisTab.test.jsx:102`: the stake rows' joined text is anchored first. Each stake the record gives a row prints its reason in it. The marker abuts the negative.
- Proof: the three files alone, beside copies of their base text, all green (134 of 134); eslint clean. There are no findings.

## Walkers at the hand-back tip
- `mutationCoverageManifest`: GREEN (161 rationales by this seat; nothing new arrived with the crisis line).
- `proseDrawnAnchors`: GREEN.
- `negativeAssertionAnchor`: GREEN.
- `seedLoopTotality`: GREEN.
- `sovereigntyLightingContract` (the lighting census): RED on its first executed figure, "the estate's file count moved": 3603 against the frozen 3448. That moved with the builders' new test files, not these edits. Re-freezing it is the census's own regeneration (CONTRIBUTING: `docs/LANE_LAW_ADDENDUM_EFF1.md` §3) and is outside this brief. Its parked-count assertion runs after the file count, so whether the two parked tables cleared it is not yet readable. Named to the chair.

## Not mine, red at the base, named
- `tailHistoryBatch6` MUST NOT, case `r2s-plague_onset-village-0`.
- `corpusEcoTailGuards`: three DS-ECO-12 rows.
- `displayEconRelianceFoodWords`: KEEP `r2s-famine-town-1`, as of batch 1. Its numbers were re-keyed by the builder since.
- `tailDisplayCivic3V1` `r2r-metropolis-50`, as of batch 1.

## TC1: `tailTies2Batch1` "NOT (powerSiblings)": a DECLARED MOVE, re-keyed by identity
The turn is a708f0cf (TAIL-POWERS-2 batch 1, P4, which joined the line at 475506bf): under an occupation the seat does not govern, and its line takes the twin (`governingStressVignettes.js :: occupiedSeatLine`). I found it with `git log -S` on the new line, not by a bisect. Both occupied hamlets print the twin: r2s-occupied-hamlet-2 (Free Elder Council) and r2s-occupied-hamlet-1 (Headman's Authority, whose pin the first red had hidden). The positive arms now read the twin's exact line. The NOT arms (`no lord stands over them`, `gives the orders here`) and the KEEP (r2r-hamlet-21) are unchanged, and the move is named on the row. The file is 5 of 5 green; it was red at its base text. The walkers stay green, and eslint is clean.
