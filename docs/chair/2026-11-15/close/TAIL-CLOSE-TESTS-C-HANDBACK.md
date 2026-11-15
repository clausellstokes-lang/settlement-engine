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
Which files were moving: the brief's `git diff --quiet origin/lane/join-2026-11-14 origin/<branch> -- <file>` flags all six on nearly every builder branch only because those branches are BEHIND the join (they do not yet carry the file). I judged by commits ahead of the join that touch the file (`git log join..branch -- file`): MOVING are `tests/domain/corpusEcoTailGuards.test.js` (tail-corpus-eco), `tests/domain/tailCorpusDefGuards.test.js` (tail-corpus-def) and `tests/generators/tailNarrativeRows.test.js` (tail-narrative). These are held until the chair says SWEPT.
- `tests/components/displayEconRelianceFoodWords.test.jsx` (1): the NOT pair is now every member of DS-DEF-9 `magicDependency false` filled for Amarkota (`poolMemberTexts`). It is the same town and the same claim; it holds for every wording of the pool, not one.
- `tests/domain/tailDisplayCivic3V1.test.js` (4 literals on 2 rows): DS-POW-6 `GM ADVISORY: the commander is a political actor` vid 4 and DS-POW-4 `riskLabel: Contested` vid 4 (`variantByVid`). Each is filled once with the raw `Military/Guard` (must not print) and once with `powerSentenceName` (prints). The slots ahead of the power are a sentinel, and the anchor is the clause after it.
- `tests/generators/tailDefeconSafetyLines.test.js` (2): **NOT through drawnProse.js, and that is a deviation for the chair to rule on.** "Nobody here is paid to keep order" is generator text (`src/generators/safetyProfile.js :: NO_WATCH_SMALL[2]`, the line 1015 member). It is never drawn from a state leaf; the walker aligns it with DS-DEF-3 Moderate vid 5 ("Nobody at {settlement} is paid…", with settlement = "here") by coincidence. Computing it through drawnProse would assert a different sentence, so the anchor is taken from the generator's exported pool (`NO_WATCH_SMALL[2].split('. ')[0]`). The walker skips it as computed. The allow-list is not widened.
Proof: each touched file was run alone against a copy of its base text in the same run. The pass and fail counts were identical. displayEcon: 22/23 before and after; the 1 red is the KEEP row `r2s-famine-town-1 … Entrepôt Trade - 13%`, red at the base. civic3V1: 12/13 before and after; the 1 red is the CURED row `r2r-metropolis-50`, red at the base. defeconSafety: all green before and after. The walker no longer lists these three files. eslint on them: clean.

## 3. The probes (status: done)
`git mv` to `sumpdf.probe.jsx` and `surf.probe.jsx`, with the contents unchanged. No other `*.test.*` or `*.spec.*` is tracked under `docs/`. The vitest config is unchanged.
