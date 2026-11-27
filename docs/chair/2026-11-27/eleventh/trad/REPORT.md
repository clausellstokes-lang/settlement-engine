TRAD-MEASURE DONE: branch lane/trad-measure-2026-11-27 at 54e97d191 (A to E; this report is the next commit)

Tree cccda7569. Corpora C and V, 1,800 births in plain node, 0 errors.

| | today | candidate |
|---|---|---|
| rows dropped (of 5,534) | 487, in 444 towns | 0 |
| towns short of band | 277: thorp 61, hamlet 31, village 130, town 34, city 13, metropolis 8 | 0 |
| towns showing NO tradition | 104 (61 thorps, 31 hamlets, 12 villages) | 0 |
| dropped by need | market 339, smith 91, smith+market 17, coast 21, coast+market 2, river 17 | none |
| founding core dropped | 158 (109 "The Founding Fair") | 0 |

The shared page drops exactly the owner's rows (0 extra). CONFIRMED.

AFTER THE CANDIDATE (CONFIRMED). The births whose traditions move are exactly the 444 towns that drop a row today: 488 rows move (the 487 dropped plus one kept row renamed by name uniqueness, V dp-metropolis-65). 17 kept rows' descriptions move, because the description rotation now runs over different neighbours. OUTSIDE TRADITIONS NOTHING MOVES: 0 of 1,800 born records move, and of the stamped public prose only the `traditions` site moves. The residue is 0. Every need is knowable at the draw, because genesis is not a generator step: it runs on the finished record, at every view and once at the first lit tick.

LANDING: the stamp floor `bornAtOrAfter(record, NEEDS_SINCE = '0.10.0')`, the precedent FIELD_RITE_SINCE uses. No new law and no config key. Older towns re-opened stay byte for byte: all 1,800 births re-stamped 0.9.0, and with no stamp, draw, show and share identically (CONFIRMED). What moves by name: `traditionsTabFairAct.test.jsx` GOES RED. Its arm `withFairNoMarket > 0` counts 3 today and 0 under the candidate (CONFIRMED, its own loop run). The fixture tests and `traditionsDormancyGolden` stay, because their records carry no stamp (PLAUSIBLE). Soak and world-pulse receipts minted from 0.10.0 births can move their occurrence beats (PLAUSIBLE).

R14 (CONFIRMED, reproduced). `DeityAssignmentPanel` is a second lazy chunk under `Suspense fallback={null}`, and the census walk snapshots Power once PowerTab's text alone passes the test. So on the FIRST Power mount of a process the block is not there yet. Give the chunk a load time: dp-thorp-0 lacks it at once and has it 300 ms later, and in power-first order its first visit lacks it and its second has it. This is a fault of the measure, not of the product. Cure: the walk waits for `deity-assignment-panel` on an editable Power view, or warms the lazy chunks first. It can touch every owner page (1,800); one per process in practice.

WOULD I BUILD IT: YES, the candidate as patched (`C-candidate.patch`, 3 files, +25 -5), with the fair test's arm re-stamped to 0.9.0 plus a new arm pinning no unheld motif at 0.10.0. ONE CONDITION: no saved town may already carry 0.10.0. Unlit towns re-draw at every view, so such a save (from a preview or staging deploy of this tree) would re-deal in about 25% of cases. If any exist, bump to 0.10.1 and floor at 0.10.1.

COULD NOT MEASURE: whether any 0.10.0 save exists anywhere; the residue on lit mirrors after ticks (a market closing after the mint); soak runs; any vitest suite, lint or typecheck of the patch (none run); the rendered Traditions tab across all 1,800 towns (I counted with the tab's own helper, `shownTraditionsOf`).
