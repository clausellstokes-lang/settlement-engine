# THE FLIP'S CENSUS, RE-CUT AT THE MERGED TIP: THE FOUR LISTS (SEAT-10, unit 3)

Written 2026-11-22T03:46:42Z by SEAT-10 (`date -u`). The tree: the lane at `ef5abf4da`, whose `src/` and `tests/` equal the census tip `47d4e959f`. The flipped copy (`recut/recut.sh prep`: exactly the two dials, `seatLaw.js :: NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION` and `seatCircumstances.js :: SEAT_CONTEST_LIT = true`; the tuning table untouched) is NEVER committed. All CONFIRMED (run) unless marked.

- **The set:** 810 files: 518 birth-reaching files in 22 directories, plus `tests/generators`, `tests/data` and `tests/domain/seat`; 2,920 files outside it. 2 shards a side, `--maxWorkers=2`, each under the 2-hour ceiling.
- **Flipped** (00:28:26Z to 02:04:28Z): 6403 tests; 46 failed in 26 files.
- **Control** (unflipped, on the checkout at `47d4e959f`, src/tests clean; 02:04:44Z to 03:44:34Z): 6403 tests; 24 failed in 16 files.
- No flipped red falls outside the control's files. No test is red unflipped and green flipped (none cured by the flip).

## (1) THE DIAL'S OWN PINS: 10 (all ten of SEAT-6-TO-LIGHT §2 red; neither conditional red)

| file | title |
|---|---|
| `tests/domain/seatLawWiring.test.js` | the vocabulary: one key, two versions, the dial at the default |
| `tests/domain/seatLawWiring.test.js` | 1. CREATE (dark): birthConfig carries no _seatLawVersion, and birthConfig(null) is byte-equal to its pinned value |
| `tests/domain/seatLawWiring.test.js` | 2. CREATE (THE CLAMP): an incoming _seatLawVersion: 2 is clamped away — an imported marker never decides a birth |
| `tests/domain/seat/seatContest.test.js` | the dial is dark and every factor of the registered table reads 1 |
| `tests/domain/seat/seatContest.test.js` | under the law, dark: the kind read is today's (a hidden power still contends, an economy craft guild reads merchant) |
| `tests/domain/seat/seatContest.test.js` | dark: today's read (a craft archetype has no row, so the plot reads palace_coup), with and without the law |
| `tests/domain/livingContentLawWiring.test.js` | ⭐ CREATE (LIT, the product path): birthConfig writes the law marker and NOTHING else |
| `tests/domain/livingContentLawWiring.test.js` | CREATE (dark, fired deliberately): at the dormant dial birthConfig still writes not one byte |
| `tests/domain/livingContentLawWiring.test.js` | ⭐⭐ CREATE (THE SAME-SEED CONTROL, LIT): a birth through the boundary is the same world but the law it declares |
| `tests/domain/livingContentLawWiring.test.js` | ⛔ CREATE (THE CLAMP): a LIT marker arriving through the wizard form cannot birth a v2 world |

The two conditionals stay green, as SEAT-6-TO-LIGHT §2 said they would until their triggers fire. `seatLawWiring` "4. GENERATION_LAWS.seat … says the dial is dark" reds only when the flip rewrites `why`. `seatContest` "the proposed figures …" reds only if the owner signs the draft row.

## (2) BORN FIXTURES THAT MOVE: 12 rows in 7 files (the integrator's reading of each red; every file births through `birthConfig`)

| file | title | what moves |
|---|---|---|
| `tests/generators/bar3PeopleTies.test.js` | KEEP r2r-town-14: "Hassan al-Basri took Badr ibn Khaldun in as an a…" still prints | prose anchor on a born town (a KEEP line of r2r-town-14 no longer prints) |
| `tests/domain/tonightOwnGoal.test.js` | the three lines the reader read are gone, and the cards' own goals print in their place | a born town's Tonight sheet (a pinned card goal is undefined flipped) |
| `tests/generators/people/goalSentencesOnceInTown.test.js` | (p) thorp: every sentence printed twice is held by an 'exhausted' card, and the count is at most 0 | a count gate over born towns (the holdings moved per tier: 2/4/1/92/348/781) |
| `tests/generators/people/goalSentencesOnceInTown.test.js` | (p) hamlet: every sentence printed twice is held by an 'exhausted' card, and the count is at most 0 | a count gate over born towns (the holdings moved per tier: 2/4/1/92/348/781) |
| `tests/generators/people/goalSentencesOnceInTown.test.js` | (p) village: every sentence printed twice is held by an 'exhausted' card, and the count is at most 0 | a count gate over born towns (the holdings moved per tier: 2/4/1/92/348/781) |
| `tests/generators/people/goalSentencesOnceInTown.test.js` | (p) town: every sentence printed twice is held by an 'exhausted' card, and the count is at most 0 | a count gate over born towns (the holdings moved per tier: 2/4/1/92/348/781) |
| `tests/generators/people/goalSentencesOnceInTown.test.js` | (p) city: every sentence printed twice is held by an 'exhausted' card, and the count is at most 1 | a count gate over born towns (the holdings moved per tier: 2/4/1/92/348/781) |
| `tests/generators/people/goalSentencesOnceInTown.test.js` | (p) metropolis: every sentence printed twice is held by an 'exhausted' card, and the count is at most 2 | a count gate over born towns (the holdings moved per tier: 2/4/1/92/348/781) |
| `tests/generators/people/seatKeeperContender.test.js` | the contender keeps its people: the keeper of rvf-succession_void-town-4 stays a member of Landed Gentry and heads it no longer; a lord leads it | a born fixture's rank (rvf-succession_void-town-4: the keeper heads Landed Gentry; the rule's two census arms stay green flipped) |
| `tests/generators/powersReadTheRosterP31.test.js` | r2r-town-34: not "The Merchant Guilds and the Craft Guilds vote to…"; prints "The Merchant Guilds and the Craft Guilds…" | prose anchor on a born town (r2r-town-34: the cured line no longer prints) |
| `tests/domain/bar4PeopleKinds.test.js` | C41801 bar0-town-occupied-rand-22: not "Bing Shimizu named Wei Kimura as successor i…"; what prints instead | prose anchor on a born town (C41801 bar0-town-occupied-rand-22: the liveness sibling moved) |
| `tests/domain/bar5PowersStanding.test.js` | C35627 bar0-town-calm-rand-26: not "its hold is secure and its say is real…"; what prints instead | prose anchor on a born town (C35627 bar0-town-calm-rand-26: the liveness sibling moved) |

SEAT-6-TO-LIGHT §2 called the born fixtures "the largest unknown" (516 files reach a birth). Measured: **7 files move**. Four are prose anchors on named born towns (bar3, bar4, bar5, P31). One is a count gate over born towns (goalSentencesOnceInTown, all six tiers). One is a pinned rank on one forced town (seatKeeperContender arm 2; the rule's two census arms, over every succession birth, stay green flipped). One is a pinned card goal on the Tonight sheet (tonightOwnGoal). Each wants re-pinning AT the flip, by the flip's unit, never before.

## (3) ANYTHING ELSE: 0

None. The one candidate, `tests/domain/seat/seatLawSavedTown.test.js` arm 4 (THE LEGACY EDGE), was red UNFLIPPED, so it sorts to (4). It was a lane red, since the UK merge `9624a7ac4` (bisected: green at `b2845bafc`). It is **CURED BY UK-LEGACY** (merged `a4b3fff4a`; builder BUL `d9133148d`): green 5/5 dark and flipped.

## (4) RED WITHOUT THE FLIP (known): 24 (23 named in `docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv`; the 24th is arm 4, cured by UK-LEGACY)

| file | title |
|---|---|
| `tests/build/engineBundleReplay.test.js` | every golden-corpus config: the committed bundle's settlement JSON equals the in-process pipeline's, byte for byte |
| `tests/build/engineBundleReplay.test.js` | the espionage fence's 360-settlement driven corpus: bundle equals in-process byte for byte, and its hash meets the fence constant (known-stale rule) |
| `tests/build/engineBundleReplay.test.js` | the engine-generate birth: for the three service cases, the bundle's stamped birth equals the in-process birth under the STORE's runtime |
| `tests/generators/nameHeldThroughAssembly.test.js` | A1 — EM-R4: inert with no pins: the golden corpus and an empty bag leave every byte where it was |
| `tests/generators/powerStructure.test.js` | no power/ module packs more statements onto shared lines than its ceiling (shrink-only) |
| `tests/domain/seat/seatLawSavedTown.test.js` | 4. THE LEGACY EDGE (measured): a save with no settlement.config regenerated under a lit world's form config stays law 1 |
| `tests/build/engineServiceCore.test.js` | the bundle's runGenerationRequest equals the in-process core for the service's request |
| `tests/build/engineServiceStoreParity.test.js` | generate: the bundle's birth for the wire body equals the local core on the store's request, stamp included |
| `tests/build/engineServiceStoreParity.test.js` | generate: an account that may customize, with custom content turned off — neither side stamps |
| `tests/build/engineServiceStoreParity.test.js` | derive: the remote re-derivation of a store-born world equals the local one |
| `tests/build/engineServiceStoreParity.test.js` | regenSection: the bundle's passes over the wire body equal the local passes over the store-born world |
| `tests/data/colourMarks4h.test.js` | the tie prose: every colour variant is `{ line, colour: true }`, every other row as phase A left it |
| `tests/generators/generationForkCensus.test.js` | A1 — the instrument reaches the generator graph: mints split 4 direct / 106 via fork, no golden moves, 493 draws unpinned and 0 pinned |
| `tests/generators/institutionBudgetPromise.test.js` | every one of sixty seeds is byte-identical with the density factor forced to 1.0 |
| `tests/generators/narrativeQualityCorpus.test.js` | ties of one archetype never share a line until the pool is exhausted, then cycle |
| `tests/generators/narrativeQualityCorpus.test.js` | all 18 archetypes, both fields, eight distinct variants |
| `tests/generators/pipelinePinnedChoosers.test.js` | A1 — the null change: an unpinned run and pins {} leave the golden corpus byte-identical |
| `tests/generators/pipelinePinnedMode.test.js` | A1 — the null change: no pins and pins {} leave the golden corpus byte-identical |
| `tests/generators/pipelinePinnedMode.test.js` | A2 — the lift moves nothing: the golden corpus, the draw count and the one-stream shape |
| `tests/generators/pipelinePinnedMode.test.js` | A5 — EM-R1b: a supplied transient chooser is still handed back, and the unpinned path is inert |
| `tests/generators/powerEconomyFreshness.test.js` | A4 — the golden is unmoved by construction, and a held bag does move it |
| `tests/generators/rosterFinalUnderHeldRoster.test.js` | A1 — inert with no pins: the golden corpus and the coherence tail are byte-unmoved |
| `tests/generators/x46NpcBand.test.js` | sixty seeds (ten a tier) generate byte-identically to the dark digests captured at the window tip (2026-11-04) |
| `tests/ui/safetyReaderBytes.test.jsx` | each town's every reader surface hashes as pinned |

The per-row match against RED-AT-LINE is in `out/list4-vs-line.tsv`. The machine record is `out/census.json`. Both are produced by `recut.sh lists` and the integrator's BORN map in `recut.sh`.
