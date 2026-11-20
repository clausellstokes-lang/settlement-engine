# BAR2-CLOSE-SWEEP-B · hand-back (2026-11-15)

Branch `lane/bar2-close-sweep-b-2026-11-15`, cut from the joined line at `52f0a1684` (the tip read as briefed). Test files and
`scripts/mutation-coverage-manifest.json` only: nothing under `src/`, no golden, no register, no quarantine or allow-list entry,
no case deleted, no arm weakened. One commit a letter. Every run alone, through `sh scripts/gate-tail.sh`, in a scratch worktree
with its own `npm ci`.

| | file | arm | cause (branch, commit) | cure | before → after |
| --- | --- | --- | --- | --- | --- |
| a | `tests/lint/negativeAssertionAnchor.walker.test.js` | no NEW un-anchored negative; the generation-facing quarantine is EXACT | three bare negatives in the round's new guards: `bar2MagicWords.test.jsx` (BAR2-LABELS), `bar2Places2Rows.test.js` (BAR2-PLACES-2, `534c29fac`), `bar2People3Funding.test.js` (BAR2-PEOPLE-3, `e36bd855e`) | `expectAbsentWithAnchor`, each anchor TRUE at the tree: the Magic tab's sibling role row that still prints; the slavic texture's rewording; the stability line's twin "Tense (militarised)" | 7/9 → 9/9 |
| b | `tests/lint/seedLoopTotality.walker.test.js` | no NEW bare seed loop; the quarantine is EXACT | the funding law's loop over every birth in `bar2People3Funding.test.js` (BAR2-PEOPLE-3, `e36bd855e`) | `collectSeedFailures` + `expectNoSeedFailures` (every seed runs, the true count reported) | 7/9 → 9/9 |
| c | `tests/lint/proseDrawnAnchors.walker.test.js` | no NEW literal state-prose anchor | a KEEP row's title in `tests/domain/bar2CorpusGuards.test.js` (BAR2-CORPUS) paraphrased DS-ECO-10 "POSTURE: established" v5 | the title is computed through `drawnProse.js` (`variantByVid`, vid 5) | 5/6 → 6/6 |
| d | `tests/lint/mutationCoverageManifest.test.js` | TOTALITY | nine new guard files with no manifest entry (BAR2-LABELS / -LABELS-2, BAR2-PLACES / -PLACES-2, BAR2-PEOPLE / -PEOPLE-2 / -PEOPLE-3) | nine `kind:'rationale'` entries, each naming the source and symbol it reads and the cure-revert that reds it; none uncovered, `uncoveredBaseline` unchanged | 9/10 → 10/10 |
| e | `tests/components/servicesImpairedHouseLine.test.jsx` | all six (`drawnMember` drew nothing at DS-SUP-3, no facts) | BAR2-CORPUS batch 1 `d89e61aac` (hand-back row C2273: v2 marked `no crisis: under_siege`): the pool now declares atoms | the spec passes `factsOf(s)`, what `economyStateProse` hands in through `factsAnswered.js`; anchors kept | 0/6 → 6/6 |
| f | `tests/components/smallPlaceTierNoun.test.jsx` | the Economics header, screen against PDF ("no place drew the header") | BAR2-CORPUS batch 2 `42064c9d5` (hand-back: "CURED BY REWORDING … v2 'Little that comes past {settlement} stops there. The town is poor, …'"): the variant the pin follows by identity was REWORDED, so the old regex matched nothing | `HEADER` follows v2's new words (`stops there. The <noun> is poor`) beside a dated note; the same 60 small places | 2/3 → 3/3 |
| g | `tests/data/tailHouses10OwnTrade.test.js` | "the town prints the rewording, not the old words" (9 of 15 cases) | BAR2-PLACES batch 1 `0d36c3820` (ruling PL4, hand-back row C0434): the three Merchant guilds (15-40) lines reworded to claim no "power" | the nine rows read the words each town prints (measured seed by seed); the record's fact and the old words' exclusion kept | 1/2 (9 of 15 cases red) → 2/2 (0 of 15) |
| h | `tests/data/w2FixData5Rows.test.js` | ww-1157: the liveness anchor "blades being made" | BAR2-PLACES batch 2 `166bb4160` (grant VW2, hand-back row C3297): the line needs `iron at hand`, its twin speaks where there is none | the anchor is the twin in the same slot ("stand cold: there is no iron left to make blades from"); the exclusion stays | 7/8 → 8/8 |

**Also run alone at the tip, all green:** the four walkers (above); every changed test file (`bar2MagicWords` 4/4,
`bar2Places2Rows` 8/8, `bar2People3Funding` 5/5, `bar2CorpusGuards` 39/39, and e to h above); `npx eslint` on the eight changed
test files (exit 0); `sourceCitationIntegrity.walker` 18/18, `ledgerCitationIntegrity` 10/10, `testRatchet` 86/86.

**Stopped on:** nothing. One note on f: the brief read the arm as places that no longer draw the header; measured, the header
still draws among the arm's own 60 small places (its `compared > 0` holds at the cure), and what moved was the declared rewording of the member the regex pins. The re-key
follows that member; no small place was re-chosen.
