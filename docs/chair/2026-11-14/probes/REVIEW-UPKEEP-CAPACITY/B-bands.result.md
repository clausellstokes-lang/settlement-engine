# B-bands — cold read of rating bands, chips, substrate rows, power-tab and PDF numbers

Rows: 2560. Occurrences: 2641 (a row's count delta, keyed on its label line). Towns: 705. Templates read: 52.
Method (scripts in /tmp/claude-0/agents/work-B-bands/):
- every occurrence keyed to its rating by its label line (tab:defense / pdf Threat Assessment row, PDF Systems Health row, overview chip, substrate variable, legitimacy block);
- value checked against the TIP record: `scoreBand(defenseProfile.scores.*)` at 65/40/20 (defenseScoreBands.js), `X/100` = the score, substrate band = `deriveCausalState(record)` run on the TIP tree, legitimacy score, label and breakdown.defense = `powerStructure.publicLegitimacy`, bare power numbers = `factions[].power`;
- kind g: each town's tab:defense band, PDF threat band, overview chip, PDF Systems Health number, ai-layer-prompt military score, power, PDF and foundry legitimacy, all parsed from the full TIP page and compared;
- plausibility flags F1–F8 scanned in all 972 towns at TIP and DEF, so new and carried cases are split;
- read by eye in the smallest, the largest and a siege, famine or occupation town for each template (`work-B-bands/eye.txt`).

**Record and g results.** 2641 of 2641 occurrences match the record. No two surfaces disagree on any rating in the rows (0 kind-g). One carried g sits outside the rows: in 21 famine towns at both TIP and DEF, the PDF "Disaster N/100" figure bands differently from the "Disasters & Famine" bar.

Flags (new at TIP = absent from that town at DEF; carried = towns that already showed it at DEF):
- F1: Internal Security "Strong" while the same PDF row reads "Internal security: Dangerous/Desperate/Critical/Unsafe". 13 new, 12 carried.
- F2: Internal "Strong" beside "cannot hold anyone for", "court passes sentences it cannot enforce" or "cannot keep the person". 14 new, 13 carried.
- F3: Beasts & Monsters "Critical" beside "has answered it properly: there is a wall to hold and there are people to hold it". 9 new, 13 carried.
- F4: Monster "Critical" beside "walls and fighters are holding against the creatures … barely keeping up". 15 new, 16 carried.
- F5: Monster "Critical" with a garrison in quiet country. 1 new (r2r-town-38), 1 carried (r2s-succession_void-town-0). The second new hit, rv5-under_siege+famine-town-2, is under siege and famine with an unpaid garrison, so Critical is plausible there.
- F6: Invasion & War "Strong" in a thorp or hamlet. 12 new, 16 carried. Of the new ones, 3 are thorps of 6–9 people under an active siege (1 carried case under siege).
- F7: Internal "Critical" with a garrison or watch. 10 new, 55 carried. The score counts crime against order (design).
- F8: Monster "Critical" while the guard assessment says the charter hall is "Effective for monster incursions" and the charter block says it "musters the defence". 11 new, 0 carried.

| template | towns | verdict | evidence |
|---|---|---|---|
| tab:defense `Critical ▼` | 139 | FALSE MED in 21; LOW in 25 | MED F3 ×9, e.g. r2r-hamlet-6 "Critical ▼" / "…has answered it properly: there is a wall to hold and there are people to hold it" (Palisade + Citizen militia; monster 33→17). Carried 13. MED F8 ×11, e.g. r2r-hamlet-21 Critical (41→19) beside "Effective for monster incursions" for its Adventurers' charter hall. New: 0 at DEF. MED F5 r2r-town-38: Barracks + Town watch, heartland, monster 39→16, "Critical". Carried 1. LOW F4 ×15 (r2r-hamlet-11 "…holding against the creatures"; carried 16). LOW F7 ×10 (r2r-town-29 watch, Safety Moderate; carried 55). The rest are TRUE: 59 frontier hamlets and thorps with no defence at all, now Critical because "Access to parish church" and the shrine no longer count (C4a/b). That reads truer than DEF's Weak. |
| pdf `Critical` | 139 | FALSE MED in 21; LOW in 25 | The same towns and bands as above. On the PDF the F8 conflict is the GUARD ASSESSMENT ("Effective for monster incursions") against the band and its own line "nobody organised to meet it". For F3 the "answered it properly" line is on tab:defense, so the conflict runs across surfaces. |
| tab:overview `Monster Defense Critical` | 116 | FALSE MED in 21; LOW in 15 | F3 (9), F8 (11) and r2r-town-38 all print this chip. F4 (15) is LOW. The rest are TRUE (no-force hamlets; truer than DEF). |
| tab:defense `Strong ▼` | 78 | FALSE MED in 16; LOW in 21 | MED F1 ×13: r2r-metropolis-14 "Internal Security Strong" under an active siege; its PDF row reads "Internal security: Desperate — Active Siege" and its Safety is Desperate (internal 64→80). Also rv5-under_siege-metropolis-4/-5, rv5-under_siege-city-0, r2s-insurgency-metropolis-0/1/2 (Dangerous), r2s-slave_revolt-city-1 (Critical). Carried 12. MED F6 siege ×3: r2s-under_siege-thorp-2 (6 people, siege), "Invasion & War Strong ▼" beside "…would see off a raid but not a proper army" (military 49→71; C3 Household levy now counts as a militia). Also r2s-under_siege-thorp-0 and -3. Carried 1. LOW F2 ×12 unique, e.g. r2r-city-38 "Strong ▼" / "Naranjoucan's court passes sentences it cannot enforce" (carried 13). LOW F6 ×9: thorps of 10–30 with a palisade and a levy now Strong (thorp-16, pop 10, 56→81). This matches DEF's Citizen-militia hamlets (carried 15). The rest are TRUE: in calm cities and metropolises, Internal Adequate→Strong (C1 greatest-rung watch, court and prison) reads truer. |
| pdf `Strong` | 80 | FALSE MED in 16; LOW in 21 | The same as tab:defense Strong. Two extra rows are faction "Power N / Strong" (record powerLabel) and are TRUE. |
| tab:defense `Adequate ▼` | 69 | TRUE | Matches the record. Moves are Weak→Adequate internal (cities) and Strong→Adequate monster or economic. No page conflict found. |
| pdf `Adequate` | 69 | TRUE | As above. |
| tab:defense `Weak ▼` | 64 | FALSE LOW in 3 | Monster Weak beside "answered it properly" in r2r-hamlet-3, r2s-plague_onset-village-3 and rv5-famine-hamlet-5 (carried 16 at DEF). The rest are TRUE. |
| pdf `Weak` | 65 | FALSE LOW in 3 | The same 3. One extra row: r2s-famine-town-0 "Arcane Support … Weak" = magical 38, TRUE. |
| tab:overview `Monster Defense Weak` | 22 | TRUE | Includes thorps where the levy now counts (16→25). |
| tab:overview `Monster Defense Adequate` | 13 | TRUE | |
| tab:overview `Monster Defense Strong` | 5 | TRUE | Frontier and monster-pressure cities with a garrison. |
| tab:overview `Economic Resilience Weak` | 19 | FALSE LOW in 2 | r2r-hamlet-59 and r2s-succession_void-village-1 read "Prosperity Prosperous" beside a Weak resilience chip (44→38, 40→35). The rest are TRUE. |
| tab:overview `Economic Resilience Critical` | 16 | TRUE | Small or crisis places with no reserves. |
| tab:overview `Economic Resilience Adequate` | 6 | TRUE | |
| tab:overview `Magical Capability Weak` | 8 | TRUE | The alchemist shop is no longer arcane (C6). Truer. |
| tab:overview `Magical Capability Critical` | 3 | TRUE | C6, truer. |
| tab:overview `Magical Capability Adequate` | 1 | TRUE | |
| pdf `#/#` (Systems Health) | 631 | TRUE | Monster, Economic and Magical N/100 = score in all 887 occurrences, and they band the same as the chips and bars. |
| pdf `# Defense` | 126 | FALSE LOW (h, carried) | The value = breakdown.defense in every town. But the legitimacy "Breakdown" prints points that sum to the score (the machinery of a rating). This was printed in every town at DEF too; the stage only changed the digit. |
| tab:power `Defense #` | 117 | FALSE LOW (h, carried) | As above. |
| pdf `#` (legitimacy score) | 122 | TRUE | = publicLegitimacy.score. It agrees with the power tab and foundry. |
| tab:power `# Legitimacy Crisis` | 56 | TRUE | Score and label = record. Substrate Public legitimacy reads Collapsed or Critical in these towns. |
| tab:power `# Contested` | 27 | TRUE | |
| tab:power `# Tolerated` | 22 | TRUE | |
| tab:power `# Approved` | 13 | TRUE | |
| tab:power `#` (power bars) | 14 | TRUE | All 38 numbers = factions[].power. |
| pdf `##` after "High" (hook index) | 1 | TRUE | Hook numbers 04/05 shifted because the hook count changed (102→104). Not a rating. |
| tab:substrate `Defense readiness Surplus` | 41 | TRUE | Every town is Fortress on the page, including under occupation or siege. |
| tab:substrate `Defense readiness Critical` | 26 | TRUE | Vulnerable or Undefended on the page. |
| tab:substrate `Defense readiness Strained` | 10 | TRUE | |
| tab:substrate `Defense readiness Collapsed` | 5 | TRUE | All under siege and Undefended. |
| tab:substrate `Defense readiness Adequate` | 2 | TRUE | |
| tab:substrate `Law & order Surplus` | 29 | FALSE LOW in 1 | rv5-calm-city-3 "Law & order Surplus" beside Safety "Unsafe … The garrison is overwhelmed or corrupt" (carried 3). The rest are TRUE. |
| tab:substrate `Law & order Adequate` | 21 | FALSE LOW in 6 | Adequate under Safety Dangerous, Desperate or Critical: r2s-insurgency-metropolis-2, r2s-monster_pressure-metropolis-0, r2r-metropolis-44, r2s-slave_revolt-city-3, rv5-under_siege-city-0. The page's own bands agree; this is a nuance only. |
| tab:substrate `Law & order Critical` | 17 | FALSE LOW in 9 | Calm hamlets with Safety Moderate now read Law & order Critical (r2r-hamlet-2, -21, -29, -30, -37, -7, r2r-thorp-36, r2r-town-55, r2r-village-13). Carried 62 at DEF. |
| tab:substrate `Law & order Strained` | 17 | TRUE | |
| tab:substrate `Law & order Collapsed` | 13 | TRUE | Every town has Internal Security Critical (0–18) on the same page. r2r-town-8 (watch, Safety Tense) is a doubtful case only. |
| tab:substrate `Infrastructure condition Strained` | 14 | TRUE | |
| tab:substrate `Infrastructure condition Surplus` | 11 | TRUE | Matches the causal state, including r2s-under_siege-city-3. The record cannot settle more. |
| tab:substrate `Infrastructure condition Critical` | 10 | TRUE | |
| tab:substrate `Infrastructure condition Adequate` | 6 | TRUE | |
| tab:substrate `Public legitimacy Collapsed` | 4 | TRUE | Legitimacy Crisis on the power tab. |
| tab:substrate `Public legitimacy Adequate` | 4 | TRUE | |
| tab:substrate `Public legitimacy Surplus` | 3 | TRUE | Endorsed. |
| tab:substrate `Public legitimacy Critical` | 1 | TRUE | |
| tab:substrate `Public legitimacy Strained` | 1 | TRUE | |
| tab:substrate `Social trust Critical/Strained/Adequate` | 3/3/2 | TRUE | |
| tab:substrate `Strength of the powers Adequate/Strained` | 2/2 | TRUE | |

## Where the rating moved: truer or falser

**Reads truer**
- Monster Weak→Critical in 108 towns, mostly frontier and plagued hamlets, thorps and villages. The church-access and shrine rows no longer count as clergy (C4). Where the place has no force, or nothing but a hall, Critical reads truer.
- Internal Adequate→Strong in about 60 calm cities and metropolises.
- Magic drops from C6.
- Economic drops in small places. The prose is keyed on the band, so it stays consistent.

**Reads falser, or newly in conflict with its own page**
- Monster Critical beside walls plus a militia that the page says "answered it properly" (F3).
- Monster Critical beside a charter hall that the page says is effective against monsters (F8, all new).
- Monster Critical in a garrisoned heartland town (r2r-town-38).
- Internal Strong in besieged, insurgent or revolting cities whose own row reads Dangerous, Desperate or Critical (F1).
- Invasion & War Strong in thorps of 6–9 people under siege (C3 levy).
