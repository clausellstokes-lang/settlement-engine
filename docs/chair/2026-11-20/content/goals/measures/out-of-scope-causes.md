# GOALS-3: the out-of-scope holdings of 833e4d413 -> 3ebec303a, each to one cause

Method. Read the whole diff 833e4d413..3ebec303a in src/generators/people/goals.js and src/data/people/goalFamilies.js, plus the two seam call sites (generateSettlementPipeline.js :: regenNPCsPipeline, narrativeGenerator.js :: generateCoherence). Then birthed both corpora again from scratch copies of both trees (work/itree-<sha>, never the checkout) with goals.js :: dealGoals patched to carry each card its pass-one receipt on goal._r: the drawn wording and text, the rotation group (refused lines marked), the pass-two rung, the rotation and the final wording. In 3ebec303a, refuseWantsBesideSecrets was also patched to mark the vantages it moved (goal._refused). The patched births print the same goal texts as the clean births (0 mismatches over 14,445 golden and 21,013 census cards). The OUT lines come from only-movers.833e4d413-3ebec303a.out.txt; the attribution script is attribute.mjs and its raw output attribute.json.

| cause | golden | census |
|---|---|---|
| (A) CN2 rewording: holder printed "Learn one thing from {other} this season, without letting {other} see it." | 0 | 0 |
| (B) harsh-tie guard (GOAL_LINE_NOT_ON_TIES): a refused reserve line was passed over before the line taken | 25 | 22 |
| (C) cascade through pass one's held set (cellCandidates held-text filter) | 0 | 0 |
| (D) intent target null -> a target, as a cause of its own | 0 | 0 |
| (E) a change in pass one itself | 0 | 0 |
| (F) pass two: a pass-one repeat the base had ROTATED now takes a RESERVE line (GOAL_RESERVE_LINES via groupOf) | 622 | 916 |
| (G) pass two: a pass-one repeat the base had ROTATED now takes another CELL line or rung (pass-two holders changed by an earlier rotation taking a reserve line, or the mirror rule in dealGoals) | 70 | 136 |
| (R) refusal post-pass on a secret the code matches (refusalRowsOf: the town's own underworld wording) but goals-final :: venal does not | 0 | 1 |
| **total** | 717 | 1075 |

Rung breakdown inside (G):
- golden: 2: P2: a pass-one repeat the base ROTATED (so the base output shows it unrepeated); base rung twice -> twice-same-power (mirror rule or holders)
- golden: 48: P2: a pass-one repeat the base ROTATED (so the base output shows it unrepeated); takes another CELL line (the pass-two holders moved by an earlier rotation)
- golden: 1: P2: a pass-one repeat the base ROTATED (so the base output shows it unrepeated); base rung twice-same-power -> stands (mirror rule or holders)
- golden: 16: P2: a pass-one repeat the base ROTATED (so the base output shows it unrepeated); base rung twice-same-power -> twice (mirror rule or holders)
- golden: 3: P2: a pass-one repeat the base ROTATED (so the base output shows it unrepeated); base rung twice -> free (mirror rule or holders)
- census: 95: P2: a pass-one repeat the base ROTATED (so the base output shows it unrepeated); takes another CELL line (the pass-two holders moved by an earlier rotation)
- census: 12: P2: a pass-one repeat the base ROTATED (so the base output shows it unrepeated); base rung twice -> free (mirror rule or holders)
- census: 25: P2: a pass-one repeat the base ROTATED (so the base output shows it unrepeated); base rung twice-same-power -> twice (mirror rule or holders)
- census: 4: P2: a pass-one repeat the base ROTATED (so the base output shows it unrepeated); base rung twice-same-power -> stands (mirror rule or holders)

## Findings

**Every out-of-scope holding is a PASS-ONE repeat that the base itself had rotated in pass two.** goals.js :: dealGoals (pass two, GR1) decides repeat status from the pass-one wordings. The scope check judges repeat status from the base's FINAL text. So a card whose pass-one draw repeated, and which 833e4d413 had already rotated onto an unheld cell line, prints as unrepeated in the base. Unit 4 still re-rotates it, and the check counts that as out of scope:
- goals.js :: groupOf now appends the call's GOAL_RESERVE_LINES (goalFamilies.js :: GOAL_RESERVE_LINES, empty at 833e4d413, 25 lines at 3ebec303a) after the call's own lines.
- The rotation walks the group from the drawn index and wraps. A base rotation that wrapped to an earlier cell line now meets the reserve lines first and takes one: that is (F).
- Every earlier rotation that changes moves the pass-two `holders` counts that later repeats read, and goals.js :: dealGoals now also applies the mirror rule (namesOf/heldNames). Together these give (G).
- No holding was a base-output repeat and also unrotated, and none was untouched in pass two.

(A) is 0: the old CN2 line is in neither tree's goalFamilies.js and is printed nowhere in the 833e4d413 births (0 hits in either corpus). Unit 4's CN2 line exists only as a reserve line ("Quietly learn one thing this season from watching {other} at work.").

(B) can act only on reserve lines. Both GOAL_LINE_NOT_ON_TIES templates are reserve-only, so the guard marks a reserve candidate as refused (goals.js :: cellCandidates, harshTie). It changes which reserve line a rotation takes and never a draw. The 25 golden and 22 census holdings are rotations where such a refused line came before the line taken in the rotation order.

(C) and (E) are 0: pass one is identical. Over every card of both corpora, the pass-one drawn wording and text and the cell part of each rotation group are the same in both trees (0 differences). A refused reserve candidate stays filed on ctx.reserve, out of the drawn list, so no list length, modulus or draw changes. There are no (E) holdings to name.

(D) is not a cause of its own. Every intent target that changed (golden 40, census 117 holdings) belongs to a card moved by goals.js :: refuseWantsBesideSecrets (`goal.intent[v] = intentOf(took)`): a PERSONALITY conviction/duty want (target null) becomes a line of another family whose call carries a target. For example, golden town|germanic|coastal|port npc_docks_port_facilities short goes from PERSONALITY/duty to RANK/defend with target npc_shipyard. The sentence moves with its target, and all of these are in scope (2). None is among the out-of-scope holdings.

(R), 1 census holding: the code moved it legitimately; only the measure's matching misses it.
- census r2r-city-27 npc_craft_guilds_30_80 npcs[50].goal.long [PERSONALITY/duty; secret: On the payroll of the local underworld as a silent informant]: Be someone the people here can always count on. -> Outlast Khongorzul Tayichi'ud, and be the one still standing.
