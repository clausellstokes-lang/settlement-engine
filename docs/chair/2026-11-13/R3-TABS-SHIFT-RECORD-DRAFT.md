# R3-TABS — the draft shift record (the merge seat signs; this lane ran no golden's door)

**Base:** `aac79b808` (lane/integration-2026-11-07, the lane's cut). **The line merged in:** `9e57f5023` (point 48, by
de0872aa5). **Code tip measured:** `e43bacae8` (the code of 6ed610479). Drafted by the third seat (R3-TABS-3,
2026-11-14) as BRIEF-R3-TABS-2's item 3 asks: ONE draft record naming the six golden surfaces as moved or unmoved, by
measure. DRAFT: point 49 is not yet merged into the lane; the record is measured again at the final tip.

## The causes this lane carries (one per commit)
| commit | cause | what it moves |
|---|---|---|
| f19e75e41 | the force cards print no provenance badge (b1) | the Defense tab only (REQ 360, FORCED 246 lines on the 720 → 0) |
| 17637e1b2 | the Underworld line names the faction, not its stale band (c) | the Defense tab only |
| 18d7fa48e | an event card's category word is its own template's | the History tab only (page, timeline dots, legend) |
| 712db076f | the Foundations Food row prints the food record's word | the Substrate tab only |
| 46e5c1002 | the Foundations trade row says "Under siege" under a siege | the Substrate tab only |
| 2ac3fa8c8 L0 | "no force" on the threat rows reads every armed body | the defence desk's composed prose (DS-DEF-2, the Invasion and Beasts rows) |
| aac97a657 L1 | the posture line reads the readiness badge; desk-level disqualifiers | the defence desk's composed prose (DS-DEF-1) |
| f0adcd83a L2 | the lines are drawn within the band the Invasion bar prints | the defence desk's composed prose (DS-DEF-1, DS-DEF-2) |
| e40e164ad L3 | a capital in any script opens a proper name (`properFill`) | the defence desk's composed prose in towns whose names open on a non-ASCII capital |
| 87d361dae | a crime-pattern row is never cut mid-sentence | the Defense tab only |
| 317f1e19c | under a siege the strong posture line never reads "from the road in" | the defence desk's composed prose (DS-DEF-1) |
| b2682f748, d6b0526cb | a range is not a rating: no severity word for a ranged tension | the History tab, the dossier search's row, the PDF's Overview and History |
| 9f95d404c | a naval line only where the route is the sea (record 422) | the defence desk's composed prose (DS-DEF-6) |
| 6ed610479 | the crime rows' regex writes its quotes as escapes | nothing a reader sees (the same regex; the mount walker's read) |
| eaca79fcd, fc2e15afd, 66fd07e91, 76641edaf, 02a539072, 96c822457, a19a0ee1b | registers by their doors; pins re-keyed with causes | nothing a reader sees |

## The record: FIELD DIFF, base against tip
The census's 720, the reader's 20 and the 144 fresh `r3t-` births (`probes/R3-TABS/births.mjs`, the app's shape), born
at `aac79b808` and at `a19a0ee1b`: **every record byte-identical** (sha256 of the decoded ndjson: census a65d30b2…,
reader 2997a853…, fresh 666d7793…, equal at both trees and to the first seat's figures). No commit of the lane touches a
generator; 6ed610479 touches a tab only.

## The six surfaces (each suite run at the base aac79b808, at the line 9e57f5023 and at the tip e43bacae8, no update flag; the failure output compared with paths and timings folded)
| surface | suite | base | line | tip | this lane |
|---|---|---|---|---|---|
| generator golden master | tests/property/generatorGoldenMaster.test.js | green | green | green | **UNMOVED** (and 0 of 884 records move) |
| espionage fence | tests/property/espionageDormancyFence.test.js | green | green | green | **UNMOVED** |
| dossier prose manifest | tests/property/dossierProseManifest.test.js | red: 3 titles | red: 3 titles, output identical to the base | red: the same 3 titles, output MOVED | **MOVED** (below) |
| PDF golden | tests/pdf/goldenViewModel.test.js | green | green | green | **UNMOVED** |
| Herald desk golden | tests/property/heraldKnowledgeDeskGolden.test.js | green | green | green | **UNMOVED** |
| preset-lighting witness | tests/simulation/presetLightingWitness.test.js | green | green | green | **UNMOVED** |

**The dossier prose manifest, MOVED by this lane** (the line's output equals the base's byte for byte, so every
difference at the tip is the lane's). The three red titles are the same at base, line and tip ("THE DRIFT CORPUS
CARRIES FOUR SEEDS", "THE DRIFT ARM", "THE MIXED-POOL AUDIENCE ARM"); the mixed-pool arm's output is identical at the
line and the tip. What moves, attributed BY EXECUTION (the suite run in an archive of each of the lane's desk commits):

| commit | drift arm: rows whose composed prose moved | cells received: gm-seed-a / b / c / golden-master-v3 |
|---|---|---|
| line 9e57f5023 (= base) | 1,036 | 410 / 396 / 390 / 73,422 |
| 2ac3fa8c8 L0 | 1,050 (+14: seven `town|…` rows × two audiences, six `desert|road|…|golden-master-v3` and one `germanic|mountain|random_trade|…|gm-seed-c`) | 404 / 390 / 384 / 73,248 |
| aac97a657 L1 | 1,050 | same as L0 (its words move inside rows already moved; no cell count moves) |
| f0adcd83a L2 | 1,050 | 404 / 390 / 384 / 73,246 |
| e40e164ad, 87d361dae, 317f1e19c, 2dc3fe61b | 1,050 | unchanged from L2 |
| 9f95d404c (naval) | 1,050 | 402 / 390 / 384 / 73,172 |
| tip e43bacae8 | 1,050 | 402 / 390 / 384 / 73,172 |

The lane's share: golden-master-v3 −250 cells (L0 −174, L2 −2, the naval cure −74), the three gm seeds −8 / −6 / −6,
fourteen rows added to the drift arm's moved list. PLAUSIBLE, not read cell by cell: L0's cells are the threat rows'
lines that its "no force" reading now silences (the unwalled watch-only Invasion row, the first seat's item 9); the
naval cure's are the 'Port only' lines off a route that is not the sea; L2's the two lines the Invasion bar contradicts.

## Rows red at the tip that are the merge seat's act
- tests/property/dossierProseManifest.test.js, its three titles: red at the base with the line's own output; the lane
  moves the drift tally and the drift list as above. Re-recorded at the merge point through the manifest's door, with
  this lane's causes (L0, L2, the naval cure) named.
- Every other surface green at base, line and tip.
