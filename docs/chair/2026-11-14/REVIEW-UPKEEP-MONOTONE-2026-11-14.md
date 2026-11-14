# REVIEW-UPKEEP-MONOTONE, 2026-11-14: the defence rating rebuilt so that a house never lowers a score

Lane read: `lane/upkeep-monotone-2026-11-14` at **8bd8e3078** (the tip named; the lane has since moved to c1f436213, the closing seat's, not read). Base: **b42be5de9**. Step 1, cold: [REVIEW-UPKEEP-MONOTONE-LINES-READ.md](REVIEW-UPKEEP-MONOTONE-LINES-READ.md) (pushed eb7343d98 before any claim was opened). Probes: `probes/REVIEW-UPKEEP-MONOTONE/`.

## VERDICT: NOT CLEAR

One MEDIUM finding is the stage's own (M1). Without it the lane would read CLEAR: the law the stage was built to holds, by my own births and made records, everywhere the chair's rulings say it must.

## Findings, ranked

| # | Rank | Own / carried | Executed? | Town and line |
|---|---|---|---|---|
| M1 | MEDIUM | THE STAGE'S OWN (the pairing is born by P4; the sentence's writer is the Threat Assessment's Invasion & War prose) | EXECUTED, 12 births | r2r-thorp-16 (Beizhou, 10 people, a palisade and a household levy): the chip **Critical** beside "Walls at Beizhou with townspeople behind them: credible against raiders..."; and "The walls and townsfolk of {town} would see off a raid but not a proper army" beside Critical. The base never pairs those sentences with Critical. List in LINES-READ. Cure: the line reads the band (or the bound), not the roster alone. |
| C1 | MEDIUM | CARRIED (98 births at the base; the stage adds 7) | EXECUTED | r2s-under_siege-town-0 (Struggling, under siege; economic 45 -> 67): "Money enough to ride out a long crisis, laid by before the siege..." Writers: `threatAssessment.js`, `safetyProfile.js :: keptGuardLine`. |
| C2 | MEDIUM | CARRIED (49 at the base; 46 at the tip, 4 new) | EXECUTED | r2s-recently_betrayed-thorp-3: "its defenders are paid late or not at all" where every funded gate is 1. Same writers. |
| C3 | MEDIUM | CARRIED | EXECUTED | r2s-monster_pressure-town-2 (a Town watch): "Velipol has no line and no force..." |
| C4 | MEDIUM | CARRIED | EXECUTED | rv5-famine-town-0 (famine): "The trades that feed and equip Grudburg's defenders are busy and well stocked". |
| L-a | LOW | THE STAGE'S OWN | EXECUTED, 5 births | The same raid sentences beside Weak (4); "counts for something against a disorganized raid" beside Critical (r2r-thorp-7). |
| L-b | LOW | THE STAGE'S OWN (a rule's reach, for the owner's veto) | EXECUTED, 3 births | P4 binds where an Adventurers' charter hall stands (r2r-hamlet-3, r2r-hamlet-55, rv5-under_siege-hamlet-0): the hall's hired party is held to the hamlet's own people. No paid garrison is bound anywhere (the bound binds in 85 thorps and 20 hamlets, none with a garrison). |
| C5-C7 | LOW | CARRIED | EXECUTED | The Disasters & Famine chip off its score (21 births, the same at the base); the FORCED badge on cascade-added houses; Foundry's "(generated)" tag. |
| K | known, not counted again | THE STAGE'S OWN, the closing seat's first items | EXECUTED | The five red titles, exactly as the brief names them, red at 8bd8e3078 and green at b42be5de9: magicCountOnce.test.js (3), defenseEconomicGate.test.js "a healthy economy with identical buildings scores meaningfully higher" and "divine + druid famine mitigation is at least as good as druid alone". On the second: my made records (druiddiv.mjs: 162 births x famine, famine+siege, famine+plague x four dial pairs, a Druid Circle alone, then each of 7 divine houses added: 13,608 trials) show **no** printed score falling. So the chair's 11:23 report (no score falls; the red is the arm's rounding) agrees with my measure on printed scores; exact scores I did not measure. |

## The claim itself (8a): adding a house or raising a rung lowers no score and not readiness

EXECUTED, the tip's own code on records born in each tree:
- The guard's own set (houses that open a scaled part, the rung pairs that share a job), the measuring seat's `mono2.mjs` on my births: **base 1,751 changes with a fall in 292 births** (the guard's header and the brief: equal); **tip 0**.
- The widened set (every one of the 282 catalogue houses at the place's tier or one around; every UPGRADE_CHAINS rename): tip **2,020 changes with a fall in 480 births**, and every one is outside the law by the chair's ruling (6): **1,829 from the 13 criminal houses** and **191 in 115 births from the six renames** (Citizen militia -> Town watch 65 and -> Professional city watch 65; Lord's steward -> Lord's appointee 34; Village reeve -> Town council 18; Wizard's tower -> Mages' guild 7; Traveling hedge wizard -> Hedge wizard 2), each equal to the build's and the measure's own counts. **No house that is not a criminal house, added alone, lowers any score at the tip.**
- My own made records (`mono3.mjs`, 162 births x 11 variants, 227,000 trials): under siege+famine, monster+plague, occupation+war+debt, every crisis at once; every dial at 100; the dials just at the gates (magic 55, religion 65, military 5); mountain, isolated, plagued, a hostile neighbour; a population of 9; the roster stripped of every defence house; a hired-only roster. **No fall** beyond the same six renames (and the criminal houses). No HIGH finding.
- The guard: three plants of my own (`plant.sh`): a market that lowers the military by 2 (red), the scale's ends swapped so a greater rung counts less (red), a market that raises the military by 2 (green): it reds on a fall and only on one; restored clean.
- Where I would rule differently (for the owner's veto): Wizard's tower -> Mages' guild is a larger house of the same arcane kind, and the law's reach stops at it only because arcane is not a scaled part; and the Gambling den, shelved Entertainment, is counted among "the criminal houses".

## The declared move (8b), the laws (3), the merge (5)

- My field diff, base -> tip (972 and the census's 720): families moved: `defenseProfile` (548 / 413 births), `powerStructure.publicLegitimacy` (27 / 21) and three faction powers, `simulationTrace` reasons (24), `activeConditions[].severity` (18), `economicState.safetyProfile.guardEffectivenessDesc` (6), one NPC, one stress cast; no key only at the tip or only at the base; magicDef moves in 214 of 972 with the chair's 7 empty -> held. The build's declared counts on the 720 equal mine: readiness 208 moved, 31 bands, powers 21, magicDef as declared. No family moved that the build does not declare (legitimacy, conditions, traces and the guard description are the scores' readers). No draw changed: no generator outside defence is in the diff, and no birth's roster, population or names moved.
- The merge b42be5de9: its remerge diff is empty (a clean merge); no register or pin file is in the stage's diff.
- The printed figures (8f): every PDF score figure (3,888) and the AI prompt's military figure (972) equal the record at the tip.

## The pulse (8e)

EXECUTED on three worlds of my own (6 born towns each: P4-bound thorps, moved towns, a besieged and an occupied town, cities; rival and hostile edges; the full_simulation preset through the century soak's own seam, `simulateCampaignWorldInterval`, 5 years), the same world at the base and at the tip: **every year of every world moves**. Mobilisations (world 3, year 4: 156 -> 34), raids, conscription, war exhaustion; an occupation lifted in year 2 at the base is never lifted at the tip (world 3); a conquest and a vassalage in year 5 at the base do not happen at the tip; in world 1 the year-1 military of the six reads [81, 74, 11, 100, 69, 75] at the base and [10, 50, 9, 100, 86, 19] at the tip. No rule of war changed: no file under `src/domain/worldPulse/` (or any reader of the scores) is in the stage's diff, so every move follows from the declared score moves. The size of the move is the owner's to know: a thorp's force now counts its ten people in the world's wars. The writer-reach instrument's dark and stale lists: NOT MEASURED (see below).

## Gates (6)

At 8bd8e3078: `typecheck:domain:strict` exit 0; `typecheck:ratchet` exit 0; eslint on the five touched files exit 0; `defenceMonotone.test.js` green (2 of 2, 134 s); `defenceParts.test.js` green at both. The named red files: as K above.

## Not measured

- The census-2 counter at base and tip (step 7): running when this was written; added below if it lands.
- `check-writer-reach.mjs` at base and tip; the golden-freeze register's surfaces (step 3's shift record); exact (unrounded) scores in the druid/divine case; steps 2's row-by-row statement read beyond the declared counts (this stage writes no sentence: its rows are the arithmetic, read as 8a and 8b above).
- One disclosure: when the scratch trees were made, `git worktree add` printed the subject lines of 8bd8e3078 and b42be5de9 before step 1 was pushed.
