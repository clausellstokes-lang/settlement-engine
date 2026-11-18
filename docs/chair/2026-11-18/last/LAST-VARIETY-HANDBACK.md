# LAST-VARIETY · hand-back (seat LAST-VARIETY, the last small round, 2026-11-18)

Base: b014a7bf3 (`lane/landing-pieces-2026-11-18`, points 54 to 65). Branch: `lane/last-variety-2026-11-18`.
Brief: `docs/chair/2026-11-18/last/BRIEF-LAST.md` (chair's lane), section LAST-VARIETY, items 1 to 3.

| commit | what |
|---|---|
| f98a31cdd | the hand-back opened |
| 2455faed8 | item 1: two lines at the end of each DS-DEF-3 safety pool; the guard `tests/domain/lastVariety.test.js` |
| 94a44219f | item 3 measured, nothing written; item 1's proof |
| f3b728bb0 | item 1: Unsafe v6 declared (`no watch`); the older tests its lines made untrue, re-keyed by identity |
| f00dd3a66 | item 2 held for the chair's word: its patch `LAST-VARIETY-ITEM2-WANT.diff` and figures |
| 092f07ab2 | the hand-back, as it stood before the ruling reached me |
| 6e36e0359 | item 2 landed under LR2: the `want` cell, `goals.js`'s hunk, the §6.6 count, the guard's item 2 block |
| (the last) | the net, the stored figures, what is left |

The measuring scripts (scratch, not committed): the 900 born as FAULTS-DESKS's guard births them (the thirty
`seeds.bar7.txt`, the 150 `seeds.w150.txt`, the 720 `censusPlan('r2')`); every pool's admitted set read by
`declarationAdmits(variantFactDeclaration(v), factsOf(record), { crisisScoped })`, as R7 read it. At the base the script
gives R7's counts exactly (Moderate 105 of 259, Safe 21 of 46, Very Safe 10 of 33, Unsafe 3 of 16).

## 1 · Item 1: the DS-DEF-3 safety pools for small places

**What R7's short towns are.** Every one keeps no court and no gaol (`court or gaol` false) and no watch. Two kinds: nobody
under arms (`guardPresence` false), and a militia with no watch (`guardPresence` true through `militia`). Each pool holds
towns that admitted ONE line (Moderate: thorps and hamlets with a militia, v7 only; r2r-hamlet-17, law collapsed, v8 only;
Safe: thorps with nobody under arms, v1 only; Very Safe: villages and hamlets, v2 only; Unsafe: v4 only), so each pool
needs two new lines admitted together in those towns: **eight lines, two a pool, the fewest that can do it.**

**The eight** (annex `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, each at its pool's END; the leaf
`src/data/dossierStateProse/defense.generated.js` projected by `scripts/generate-dossier-state-prose.mjs` after a fresh
census in the tree, the census then restored: the leaf is committed, the census is not). THE OWNER'S VETO LIST:

| pool · vid | line | declared | prints in (the Defense tab's public-order rung, its PDF copy; the record, `toPublicSafe` and the share veil alike) | admitted in (of the pool's towns) |
|---|---|---|---|---|
| Very Safe v6 | What trouble {settlement} sees is mostly quarrels, and they seldom outlast the week. | street · tier ≤ village · no crime wave · crisis: any · no crisis: threat, unrest | bar0-village-calm-rand-36 (Onongol), r2r-hamlet-11 (Riparipa), r2r-hamlet-41 (Keshigbulag); 5 in all | 10 of 33 |
| Very Safe v7 | {settlement} has no watch; its neighbours notice anything out of place, and are quick to say so. | ledger · no watch · crisis: any · no crisis: threat, unrest | r2r-village-8 (Khandavan), r2r-village-49 (Yaxchtzal); admitted, not drawn: r2r-village-6, -14 | 10 of 33 |
| Safe v6 | {settlement} has no gaol, and has so far had little use for one. | ledger · no prison · crisis: any · no crisis: threat, unrest | bar0-town-calm-rand-29 (Neadgill), bar0-town-calm-rand-31 (Zelenosk), bar0-hamlet-calm-rand-32 (Raskot), r2r-town-4 (Jayagiri); 12 in all | 31 of 46 |
| Safe v7 | Visitors to {settlement} see nobody keeping watch, and come to no harm all the same. | visitor · no guardPresence · crisis: any · no crisis: threat, unrest | bar0-thorp-calm-rand-28 (Jalalbash), r2r-thorp-28 (Zelenoev), r2s-infiltrated-village-2 (Bayarserai) | 4 of 46 |
| Moderate v9 | ~~Whatever trouble {settlement} has is soon known to everyone in it.~~ VETOED by LR6 (1); corrected in place: see section LR6 | street · tier ≤ village | bar0-village-calm-rand-46 (Tihono), bar0-thorp-calm-rand-31 (Madinatqila), r2r-hamlet-17 (Faroaltum); 34 in all | 138 of 259 |
| Moderate v10 | With no gaol at {settlement}, nobody who does wrong here can be locked away; most go on living beside the people they wronged. | ledger · no court or gaol | bar0-thorp-calm-rand-45 (Dunwood), bar0-hamlet-calm-rand-45 (Ravenland), r2r-town-45 (Varanand); 39 in all | 146 of 259 |
| Unsafe v5 | Theft at {settlement} grows each season, and with nobody under arms, every household guards its own. | street · no guardPresence · crime wave | bar0-hamlet-calm-rand-29 (Skálgarde); admitted, not drawn: bar0-hamlet-calm-rand-27, r2r-thorp-30 (the only three towns of the 900 it is true of) | 3 of 16 |
| Unsafe v6 | ~~There is no watch at {settlement}, and visitors are warned to keep their belongings close.~~ VETOED by LR6 (2); corrected in place: see section LR6 | visitor · no watch (first written undeclared; the undeclared-lines register, shrink-only, refused it: it now says what it presumes, f3b728bb0) | bar0-hamlet-calm-rand-27 (Gangapur), r2r-thorp-30 (Obergasse); admitted, not drawn: bar0-hamlet-calm-rand-29 (the three towns of the 900 with no watch) | 3 of 16 |

Why each is declared as it is: v10 names the gaol but says the wrongdoer stays among the wronged, which a court (exile,
the rope) could make false, so it declares `no court or gaol`, not `no prison`; Safe v6 names only the gaol (`no prison`).
Moderate v9 first read "Most days … pass without trouble", which is not true beside a crime wave and a collapsed law
(r2r-hamlet-17): reworded before the commit to a thought true under both. Very Safe v6 declares `no crime wave` (quarrels
as the worst of it). Each thought is its own: none repeats Moderate v5/v6 ("its own people keep order"), Safe v1 ("the
would-be spreaders are known"), Safe v4 ("somebody keeps it that way") or Unsafe v4 ("the rest goes unanswered").

**Proof.** Over the 900 at the tip, every town of the four pools admits three or more (Moderate 0 of 259 under three,
Safe 0 of 46, Very Safe 0 of 33, Unsafe 0 of 16; base 105, 21, 10, 3). The guard holds it in R7's one-line towns on the
record, its public projection and the share veil, each line printed in a named town on all three forms, and each
declaration refused where its premise fails (a negative beside each positive): red at the base 4 of 4 (the lines are
not in the leaf), green at the tip.

**Declared moves (R5).** Field family: the Defense tab's public-order rung (DS-DEF-3 `publicOrder.beside`) and its PDF
copy. Towns whose line moves, base against tip: the thirty 4, the 150 27, the 720 67; every one moves TO one of the eight
(no town moves between old lines). By pool: Moderate 4 · 19 · 50, Safe 0 · 5 · 10, Very Safe 0 · 1 · 6, Unsafe 0 · 2 · 1
(the thirty · the 150 · the 720). **Named: the Unsafe twin v4 (the chair's word of 09:11) now prints in NO town of the
900**: its three towns admit v4, v5 and v6, and the draw gives them v6, v5, v6. It stays admitted there (held by
`faultsDesks.test.js`, re-keyed) and true wherever drawn. The 525 by the golden's own `hashFor`: **0 of 525** move (display prose; no stored
record). (At the base, 191 of the 525 already differ from the stored fixture: the base's own red, the close's.)

## 2 · Item 2: the SUPPLY goal family

**Measured at the base over the 900:** 93 cards in 85 towns (the thirty 2, the 150 12, the 720 79) hold a SUPPLY family of
dependency lines only, EVERY one refused (11e.wantBuy), so 0 admitted in each vantage; a SUPPLY pick there falls to the
next family's first admitted line, draw-free. Goods: precious metals 33, iron 19, stone and iron and grain 15, iron and
fuel 11, timber 6, iron and grain and fuel 4, metal ore and fuel 2, timber and rags, livestock and game, medicinal herbs 1
each. 23 of the 93 under a siege or with no market (cells of 3 or 5).

**Why not in `goalFamilies.js` alone (THE STOP, sent to the chair):** `goals.js` marks every candidate of the dependency
cell refused where `needUnmet`; a line appended there is refused with them, and the other SUPPLY cells (impaired,
isolation, expansion) are not dealt to these cards. The cure needs one push in `goals.js`, a file outside the item.

**LANDED UNDER THE CHAIR'S RULING LR2 (sent 18:39 UTC, delivered to this seat at 19:58: GRANTED as proposed), commit
6e36e0359.** Before the ruling reached me the cure was held and handed over as a patch (f00dd3a66,
`LAST-VARIETY-ITEM2-WANT.diff`, kept beside this file as the record of what was proposed); the commit is that patch, with
the ruling named in the cell's comment and in the §6.6 count's dated note.

- **The cell.** `GOAL_FAMILY_LINES.SUPPLY.want` (slots `resource`, `house`; `GOAL_SUBKIND_SLOTS.SUPPLY.want`), at the
  family's END; the intent key falls to SUPPLY's `*` (`secure_supply`). `goals.js` (one hunk, two lines) pushes it beside the
  refused dependency cell ONLY where `needUnmet` holds. A refused dependency pick takes the family's next admitted line (a
  want line), draw-free, as POWERS-9 resolves it. `tests/data/goalFamilies.test.js`'s §6.6 counts re-keyed under LR2
  (SUPPLY 48 → 52, the total 524 → 528).
- **The four lines (THE OWNER'S VETO LIST).** Each presumes only what `needUnmet` holds (the work at the house needs the
  good, and the page says it is needed and not brought in); none presumes a supply, none names a good the town has or a
  buyer it lacks, none buys from outside, so none is refused under a siege; the slot contract held by `goalFamilies.test.js`.
  Printed on the NPCs tab, the summary, the PDF and the journal (the card's goal):

  | vantage | line | three cards it is dealt on (the 900) |
  |---|---|---|
  | short | Find something the work at {house} can use in place of {resource}. (a substitute tried) | bar0-city-wartime-rand-45, Klara Weber (the citadel; stone and iron and grain); bar0-city-wartime-rand-31, Banbh Farrell (the banking houses; precious metals); r2r-town-3, Erin Lynch (the docks; timber) |
  | short | Gather what {resource} can be found close to home for the work at {house}. (a supply sought at home) | bar0-hamlet-under_siege-rand-39, Khongorzul Ongut (the citizen militia; iron, under a siege); r2r-metropolis-18, Katla Finsson (the banking district; precious metals); r2r-metropolis-50, Lasair Brennan (the citadel) |
  | long | Open a lasting way to bring {resource} in for the work at {house}. (a supplier sought) | r2r-hamlet-56, Yuri Petrov and r2r-village-8, Rashid Besud (the citizen militia; iron); r2r-town-9, Grettir Kolbeinsson (the carpenters; timber) |
  | long | Win those who govern here over to bringing {resource} in for the work at {house}. (the grievance, carried to whoever should bring it) | bar0-town-occupied-rand-40, Varun Mukherjee (the docks; timber); r2s-insurgency-metropolis-2, Michail Xiphilinos and r2s-slave_revolt-metropolis-0, Solveig Jokullsson (the banking district; precious metals) |

**PROOF (LR2's four), base b014a7bf3 against the tip 6e36e0359, over the 900 as the guards birth them:**

- **(the cure)** cards whose SUPPLY family holds fewer than two admitted lines: 93 → **0**, in each vantage.
- **(a) the moves, counted.** 82 cards in 41 towns (the thirty 1, the 150 3, the 720 37). Every town is one of the 85
  (outside them: **0**). 41 of the 93 cards move (a `*` below; the other 52 never draw SUPPLY, so nothing about them moves),
  and 41 later cards move through the held sets (a text another card no longer holds, or now holds). Fields, by card:
  `npcs[].goal.short` 35, `npcs[].goal.long` 74, `npcs[].goal.intent` 56 (the intent rides with its text); `stressNote` 0.
  Every town, every card:

  **the thirty** (1 towns): bar0-city-wartime-rand-45: npc_citadel* (short+long)
  **the 150** (3 towns): bar0-city-wartime-rand-31: npc_banking_houses* (short+long), npc_fuller (long), npc_town_crier (short), npc_multiple_adventurers_guilds (long), npc_sage_s_quarter (long), npc_theaters (short), npc_almshouse (short+long); bar0-hamlet-under_siege-rand-39: npc_citizen_militia* (short+long); bar0-town-occupied-rand-40: npc_docks_port_facilities* (long)
  **the 720** (37 towns): r2r-hamlet-56: npc_citizen_militia* (long); r2r-village-8: npc_citizen_militia* (long); r2r-town-3: npc_docks_port_facilities* (short+long), npc_customs_house (long), npc_inn_multiple (long); r2r-town-9: npc_carpenters_5_15* (long); r2r-town-23: npc_citadel* (long); r2r-town-30: npc_blacksmiths_3_10* (short+long), npc_veiled_bbfffdd0ee4635dd (long); r2r-town-54: npc_butchers_3_8* (long); r2r-city-21: npc_banking_houses* (short+long); r2r-city-56: npc_banking_houses* (long); r2r-metropolis-1: npc_banking_district* (short+long), npc_warehouse_district (short), npc_veiled_42eef287985095da (long); r2r-metropolis-4: npc_banking_district* (short+long); r2r-metropolis-6: npc_banking_district* (short+long); r2r-metropolis-18: npc_banking_district* (short+long), npc_dungeon_delving_supply_district (short); r2r-metropolis-30: npc_banking_district* (short+long), npc_luxury_goods_quarter (long), npc_coaching_inn (long); r2r-metropolis-50: npc_citadel* (short+long); r2s-under_siege-city-3: npc_banking_houses* (long), npc_toll_bridge (long), npc_chroniclers_exchange (long), npc_butchers_3_8 (long), npc_customs_house (long), npc_tailor_s_guild (long); r2s-famine-metropolis-1: npc_banking_district* (long), npc_auction_house (long); r2s-occupied-metropolis-0: npc_banking_district* (long); r2s-occupied-metropolis-3: npc_carpenters_5_15* (long), npc_butchers_3_8 (long), npc_glassmakers (long), npc_ropemaker (long); r2s-indebted-city-1: npc_citadel* (short+long); r2s-recently_betrayed-city-0: npc_professional_city_watch* (short+long), npc_blacksmiths_3_10* (short+long); r2s-recently_betrayed-metropolis-2: npc_banking_district* (long); r2s-infiltrated-town-0: npc_blacksmiths_3_10* (short+long), npc_cartographer_s_workshop (long), npc_apothecary_established (long); r2s-infiltrated-city-1: npc_banking_houses* (short+long); r2s-infiltrated-metropolis-0: npc_banking_district* (long), npc_dungeon_delving_supply_district (long); r2s-plague_onset-hamlet-1: npc_citizen_militia* (long); r2s-plague_onset-city-3: npc_specialized_metalworkers (short); r2s-succession_void-hamlet-1: npc_citizen_militia* (long); r2s-monster_pressure-metropolis-0: npc_banking_district* (short+long); r2s-insurgency-city-2: npc_blacksmiths_3_10* (short+long); r2s-insurgency-metropolis-2: npc_banking_district* (long); r2s-religious_conversion-town-2: npc_alchemist_shop* (short+long); r2s-religious_conversion-city-3: npc_banking_houses* (short+long), npc_customs_house (short), npc_warehouse_district (long), npc_carpenters_5_15 (short), npc_potter (long), npc_tailor_s_guild (short+long), npc_butchers_3_8 (long), npc_red_light_district (short); r2s-slave_revolt-town-2: npc_docks_port_facilities* (short+long), npc_harbour_master_s_office (long), npc_bowyers_fletchers_guild (long); r2s-slave_revolt-metropolis-0: npc_banking_district* (long), npc_bowyers_fletchers_guild (long), npc_red_light_district (long); r2s-slave_revolt-metropolis-1: npc_banking_district* (long); r2s-wartime-metropolis-2: npc_banking_district* (short+long), npc_sawmill_commercial (short+long), npc_brewery (short+long), npc_glassmakers (long)

- **(b) no draw moves beyond.** With every `npcs[].goal` and `npcs[].stressNote` struck, **every record of the 900 is
  byte-equal** to b014a7bf3 (sha-256 of the whole record: 0 of 900 differ).
- **(c) the 525 by the golden's own procedure.** **13 of 525** move (whole-record hash, as `hashFor` spells it); with the goal
  fields struck, **0 of 525**: every one moves by the goals. (The golden is the last close's; 191 of the 525 already differ
  from the stored fixture at the base.)
- **(d) the negative.** Over the 900, 8,264 card·vantages hold an ADMITTED dependency line; **0** of them hold a `want`
  line. Held in the guard too (`lastVariety.test.js` item 2: over every card of its towns), with the positives beside it
  (five cards, two under a siege, hold two admitted SUPPLY lines a vantage; a want line dealt on two cards).
- The guard's item 2 block red at the base (no cell), green at the tip; `goalFamilies`, `goals`, `goalChainWords`,
  `goalCharterRefused`, `faultsNeed` green.

## 3 · Item 3: CL22's two lopsided pools, measured; nothing written

Measured on the dominance arm's own corpus (prefix `quarrel`, 2,050 births, the ledger read as `pool-dominance.mjs`
reads it), at the base tree's generator (item 1 touches neither pool).

**`ledger:institutionDescVariants:DESC_LATE_SIBLINGS` (top1 0.8110 over 2,550 draws in 1,226 towns; line 0 2,068, line 1
482). THE SHAPE OF THE TABLE: write nothing.** The table is 38 sibling sets of two (an original house description and its
twin), resolved DRAW-FREE (`drawDeclared.js :: resolveSibling`: the original where admitted, else its twin); the ledger's
line id is the member's index, so "line 0" is 38 different originals and "line 1" 38 different twins. No set's draw can
be widened: a third member would print only where both others are refused. The originals carry what the twins deny
(of the 2,068 originals printed: 1,311 declare `no crisis: under_siege`, 306 `no route: isolated`, 268 no silk or spice
needed and not brought in, and so on); the twins print exactly where those fail. The rise from 0.6364 is the
table growing (29 keys at CL22's measure, 38 now), each new set's original being most towns' line.

**`ledger:npcData:STRESS_ECONOMIC_EFFECTS.gov_econ_dependence` (top5 0.7429 over 599 draws in 219 towns; top1 0.1636).
THE SHAPE OF ITS DECLARATIONS, NOT A SHORT POOL: write nothing; one corner named.** The pool is the eight (description,
tension) pairs of Financial Dependence. Shares: line 7 0.164, 0 0.155, 5 0.154, 1 0.150, 2 0.120, 4 0.120, 6 0.085, 3
0.052. No line dominates; the five-line share sits high because two lines are true of fewer pairs: line 3 (`no seat
held`, BAR6-PEOPLE 10d-seat: 31 draws, against 70 to 84 for its neighbours) and line 6 (a bank and a ruling body: 51).
With line 3 at its neighbours' rate the five-line share would read about 0.69 (the old ceiling 0.6662). **The corner:** where a lord
rules (no ruling body; 53 of the 599 draws) the pool admits four lines (0, 1, 5, 7); in four towns of the corpus with five
to eight such ties those four repeat (quarrel-city-64, -city-261, -metropolis-103, -metropolis-127; 9 repeat draws; 2 more
in two ruling-body towns). Not written: a line added to this pool changes `size`, so `(base + used) % size` re-deals
EVERY tie of the archetype in every town, and a tension line must be paired with a description line; that is a wide move
for nine repeats. Named for the chair as variety owed.

## LR6 · the second reader's five MEDs, cured (the chair's ruling LR6, after READ-LAST; one commit each)

Each line below was read against what prints BESIDE its pool on the same page (the safety profile's sentence
`safetyDesc`, the guard line `guardEffectivenessDesc`, the Legal row) in every town of the 900 and of the reader's 600
fresh that admits it (the 600: the census's calm plan at indices 5000 to 5099 a size, `r2r-<size>-<i>`, which holds
r2r-thorp-5005). Small places print beside these pools: "The neighbours keep an eye on one another, and what trouble there
is, everyone soon hears of" (205 of the 290 towns admitting v9), "There is no watch", "When someone does wrong, the
neighbours deal with it themselves, and the oldest families have the last word", "A thief is known by name within a day …",
"A quarrel goes to the heads of the oldest families …", "Nobody here is paid to keep order", "Without courts or prison,
enforcement relies entirely on fines, exile, or summary violence", "Travelers are advised to move in groups and keep
valuables hidden", "The militia cannot maintain consistent coverage. They have other jobs to do." None of the lines below
says any of these.

| LR6 | commit | the line (THE OWNER'S VETO LIST) | declared | prints in |
|---|---|---|---|---|
| (1) Moderate v9, corrected in place (WORD_CORRECTIONS row, ruling LR6) | 4bc8cfad0 | At {settlement} old wrongs are remembered for years, and some are still being argued over. | street · tier ≤ village | bar0-village-calm-rand-46 (Tihono), bar0-thorp-calm-rand-31 (Madinatqila), bar0-village-calm-rand-35 (Qaryahdarya); 66 towns of the 1,500 |
| (2) Unsafe v6, corrected in place (WORD_CORRECTIONS row, ruling LR6) | 73a4d9e13 | Neighbours at {settlement} have begun to suspect one another, and few will lend a tool or a coin now. | street · tier ≤ village | bar0-hamlet-calm-rand-27 (Gangapur), r2r-thorp-30 (Obergasse), r2r-village-5023 (Zhongshan) |
| (3) Safe v7 declares `no crime wave` (words unchanged) | 9176746d4 | Visitors to {settlement} see nobody keeping watch, and come to no harm all the same. | visitor · no guardPresence · no crime wave · crisis: any · no crisis: threat, unrest | r2r-thorp-28 (Zelenoev), r2s-infiltrated-village-2 (Bayarserai), r2r-thorp-5009 (Wushan); no longer bar0-thorp-calm-rand-28 ("Crime is on the rise.") |
| (3) Safe v8, NEW at the pool's end (bar0-thorp-calm-rand-28 then admitted two) | 9176746d4 | At {settlement}, people who never used to bar their doors at night have started to. | street · tier ≤ village · crime wave · crisis: any · no crisis: threat, unrest | bar0-thorp-calm-rand-28 (Jalalbash), r2r-village-5004 (Agioschorio); admitted in a third (three towns of the 1,500 are Safe, small and under a crime wave) |
| (4) Unsafe v7, NEW at the pool's end | 58fb29050 | {settlement} calls its people out against raiders and beasts, but nobody is called out over a theft. | street · militia · no watch | r2r-thorp-5005 (Dongcheng): the only levied, watchless Unsafe town of the 1,500, so one town, not three |
| (5) the `want` cell's {resource} | 04a3d1450 | (the four lines' words unchanged) | the slot: `needNotBroughtIn.js :: goodsNeededNotBroughtIn` (the list's own goods a dependency names or meets), filled by `resourceFill` | e.g. bar0-city-wartime-rand-45, Klara Weber: "… in place of stone." (was "stone and iron and grain"; the list: stone; copper ore; gold and silver ore); r2r-town-30, Helga Gormsson: "… in place of charcoal and fuel."; r2r-village-8, Rashid Besud: "Open a lasting way to bring metals in …" |

Unsafe v7's thought was chosen against its guard line: the chair's sketch ("called up when trouble comes but nobody keeps
watch between times") is what "The militia cannot maintain consistent coverage. They have other jobs to do." already says
beside it in r2r-thorp-5005, so the line says what the levy is FOR (raiders and beasts) and what it is not (a theft).

**THE AT-LEAST-THREE CLAIM, AGAIN (at 04a3d1450).** Every town of the four pools admits three or more lines, over the 900
(Moderate 0 of 259 under three, Safe 0 of 46, Very Safe 0 of 33, Unsafe 0 of 16) and over the reader's 600 fresh (0 of 290,
0 of 54, 0 of 49, 0 of 19; at the base 115, 21, 8, 2). The guard holds r2r-thorp-5005 among the short towns and each new
line in a town it prints in, on all three forms, with each premise refused where it fails (militia among them).

**(5) PROVED.** Over the 900 and the 600: 560 `want` candidates on 140 cards (95 and 45); **0** name a good the town's need
list does not print. The guard holds it on its five cards and pins the citadel's compound to its one unmet good ("stone").

**LR2's PROOFS RE-RUN at 04a3d1450** (the fill changes words, not which cards draw): the same 41 towns and 82 cards move
(goal.short 35, goal.long 74, goal.intent 56); outside the 85, 0; with every `npcs[].goal` and `stressNote` struck, 900 of
900 byte-equal to b014a7bf3; the 525: 13 move, 0 with the goals struck; the negative (an admitted dependency never beside a
`want`) holds.

**DECLARED MOVES of item 1 at 04a3d1450** (DS-DEF-3's public-order line; no stored record): the 900: the thirty 4, the 150
27 (Moderate 19, Safe 5, Very Safe 1, Unsafe 2), the 720 67 (Moderate 50, Safe 10, Very Safe 6, Unsafe 1); the 600: 95
(Moderate 75, Safe 12, Very Safe 6, Unsafe 2); the 525: 0 by the prose.

**LOW, named, no change.** (i) Moderate v10's "no gaol" read by the presumed-things walker as a prison (true by its
`no court or gaol`; the chair: banked at the close by proof (iii), as v4's is). (ii) "the work at the citizen militia":
`houseFill` gives the house's own display noun, and no word of the slot's form makes a levy a workplace; the SUPPLY family
names the work through "the work at {house}" (POWERS-9), so the four lines keep it. Where the house is a militia or a levy
(25 of the 140 want cards: a citizen militia or a household levy), the phrase reads as a duty, not a trade. Named for the owner's veto list.

## 4 · The net (base b014a7bf3 and the tip 6e36e0359, each in a worktree of its own; each gate alone through `sh scripts/gate-tail.sh`; reds compared BY MESSAGE; 66b98a241 after it touches only the pool table, whose walker was re-run green). **RE-RUN WHOLE AT LR6's TIP 04a3d1450: every gate's result and every red's message as in this table, the counts as section 5 gives them at 04a3d1450; the older tests 65 files, the same 5 reds; the six faults guards and my guard green.**

| gate | base | tip |
|---|---|---|
| `typecheck:domain:strict` | 0 | 0 |
| `typecheck:ratchet` | 0 | 0 |
| `npx eslint` (every JS file I changed) | — | 0 errors |
| `tests/architecture` | green | green |
| `tests/lint` (JSON) | 31 reds | 33 at 66b98a241: the base's 31, ten with a count or digest my work moves (section 5), and 2 new, each a stored figure (section 5): `proseCorpusBytes` GZIP and the trailing-coordinate pin. `factLayers` POOLS red at 6e36e0359, GREEN at 66b98a241 (the two rows placed at layer 5 on the chair's word). `ledgerCitationIntegrity` red at both (it wants the ledger branch as a local ref) |
| `tests/joins` | 1 red (`mutationOrder`: the chain gains `assembleSettlement`) | the same, same message |
| `tests/data`, `tests/domain/facts`, `crisisBlindDossierProse` | 5 reds | the same 5; one with a count moved (the shift register's mutant, 3044 → 3052 against 3033). `crisisBlindDossierProse` and `declarationRegisters`, red on my first tip, cured in f3b728bb0 |
| the six faults guards | green | green (`faultsDesks.test.js` re-keyed by identity in f3b728bb0: FR7's planted line at the pool's next number, v11; the Unsafe twin keeps v4, v5 and v6 after it, and is ADMITTED, no longer the only line, in its three towns) |
| my guard `lastVariety.test.js` | red, 8 of 8 (no lines, no cell) | green, 8 of 8 |
| THE OLDER TESTS (every test file naming the defense leaf, the annex, DS-DEF-3, `defenseStateProse`, `goalFamilies`, `goals.js`'s functions: 78 listed, 65 test files run, one JSON run a tree) | 3 files red (5 cases): `generationForkCensus` (3), `rosterFinalUnderHeldRoster`, `composeStateProse` | the same 5 by message, `composeStateProse`'s count moved 3044 → 3052 |
| the claims pin `tests/docs/enforcement-claims.test.js` | — | green over this file |

## 5 · Stored figures my work moves (named; none re-taken; for the last close)

| figure | base → tip |
|---|---|
| the state corpus's variant count (`proseComposed`, `proseWiringCensus`, `composeStateProse`, the shift register's mutant; stored 3033) | 3044 → 3052 (+8); 3054 at 04a3d1450 (+10: LR6's Safe v8 and Unsafe v7) |
| `proseEntryContradiction` loaders (stored 3501 / 2794) | 3512 → 3522, 2804 → 2814 (at 04a3d1450) |
| `proseWaveGate` units (stored 658) | 663 → 673 (at 04a3d1450) |
| the trailing-coordinate class (`proseEntryContradiction` anti-vacuity, report-only, stored 377) | 377 → 379 (at 04a3d1450 too: two of the lines end on a plain ", and …" clause) |
| `scripts/.prose-byte-baseline.json`, `defense.generated.js` (stored 281,298 raw / 37,154 gz) | raw measured 286,547 at the tip; gzip 37,820 (outside the 1 % band, red at the tip only) |
| `factLayers.poolTable.json`: DS-DEF-3 › Very Safe and › Unsafe | placed 3 → 5 in 66b98a241 on the chair's word of 19:58 UTC (their lines Very Safe v6 `no crime wave`, Unsafe v5 `crime wave` read layer 4), as BAR6-DEFDESK placed Safe; the lines kept as written (R6). The walker green |
| `presumedThings` ARM 1 fresh hits (stored register) | 5 → 6: Moderate v10 ("With no gaol at …") read as naming a prison undeclared; it declares `no court or gaol`, which holds only where no gaol stands. The same reading the walker gives Unsafe v4 at the base (FAULTS-DESKS named it): the walker's, not reshaped |
| `sovereigntyLightingContract`'s estate file count | 3696 → 3697 (my guard) |
| the golden master (`tests/fixtures/generator-golden-master.json`; 191 of 525 already differ at the base) | item 1: 0 of 525; item 2: 13 of 525, every one by the goal fields |
| `tests/data/goalFamilies.test.js`'s §6.6 count | SUPPLY 48 → 52, 524 → 528: re-keyed in 6e36e0359 under LR2 (not a re-take: the ruling's own instruction) |
| `scripts/census/pool-dominance.register.json`: drawn pools with no row (red at the base, 3) | 3 → 5: the two new goal pools `goalFamilies:SUPPLY.want.short` and `.long`. Not banked: the register's `--bank-new` door would also bank the base's three and re-take the census header; the close's |
| `writerReach` (the frozen `shapesDigest`, red at the base: bd73f89e… against the stored 25b8a553…) | the in-process digest moves again (d39eb1ad…): the goals the corpus now deals. Its other reds the same by message |
| the wiring census stamp | untouched: projected after a fresh census in the tree, the census restored byte-equal (the leaf committed, the census not) |

## 6 · Left by name

- **The lord-ruled corner of `gov_econ_dependence`** (item 3): four lines where a lord rules; nine repeat draws in four
  towns of the corpus. Not written (a line re-deals every tie of the archetype).
- **The Unsafe twin v4 prints in no town of the 900** (section 1): admitted in its three towns, out-drawn there.
- Not raised: none.
