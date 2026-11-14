# D-power — cold read (570 rows, 22 towns)

Method: every row checked by script against the TIP record (`powerStructure.factions/factionRelationships/publicLegitimacy/conflicts`, `npcs[].role/memberships/institution`, `relationships[]`, `institutions[]`, `defenseProfile`), and by eye on the TIP power, npcs, institutions and relationships tabs. Eye reads: smallest r2s-occupied-town-2 (pop 310, under occupation), largest r2s-slave_revolt-metropolis-3 (88,966, revolt), plus r2r-city-55, r2r-town-19, r2s-wartime-town-2, rv5-monster_pressure-town-5, r2s-monster_pressure-town-2. Scripts: /tmp/claude-0/agents/work-D-power/.

## Why each town was re-drawn (DEF -> TIP). The roster (institution names) is unchanged in all 22 towns.
| seed | defence move | legitimacy (score, band, defence share) | power or relationship change |
|---|---|---|---|
| r2r-city-43 | Well-Defended 75 -> Fortress 78 | 65->68 Approved, def +7->+10 | none; causes reorder ("Strong defences and prosperity") |
| r2r-city-55 | internal 64->73; WD -> Fortress 77 | 72 Approved -> 75 Endorsed | criminal capture adversarial->none: Thieves' Guild drops out of the powers and Military/Guard (7) enters; conflicts re-rolled; 49 NPC ties changed; criminal houses' memberships move to Merchant Guilds |
| r2r-metropolis-0 | WD 73 -> Fortress 78 | 65->68 | causes reorder only |
| r2r-metropolis-10 | WD 73 -> Fortress 79 | 65->68 | causes reorder only |
| r2r-metropolis-15 | internal 67->83; WD -> Fortress | 72 Approved -> 75 Endorsed | Ducal 34 Strong -> 36 Dominant; 13 ties |
| r2r-metropolis-52 | mil 83->92, mon 87->100; WD -> Fortress | 57 Tolerated -> 60 Approved | small power shifts; 5 ties |
| r2r-town-19 | Defensible 40 -> Lightly Defended 37 | 30 Contested -> 28 Legitimacy Crisis (def 0->-2) | Religious Authorities 53->60, Church Council 47->40 |
| r2r-town-28 | WD 55 -> Defensible 51 | 71->65 (def +6->0) | none |
| r2r-town-38 | mil 64->42, mon 39->16; WD -> Defensible | 71->65 | none |
| r2r-town-57 | Defensible -> Lightly Defended 34 | 38->36 (def -2) | none |
| r2s-infiltrated-city-2 | WD -> Fortress 76 | 57 Tolerated -> 60 Approved | small shifts |
| r2s-infiltrated-metropolis-2 | WD -> Fortress 78 | 72 -> 75 Endorsed | CSC 34 Strong -> 38 Dominant, TG 11->7; conflicts re-rolled; 36 ties; stress instigator recast |
| r2s-insurgency-town-2 | mil 67->48; Defensible -> Lightly 27 | 38->36 | none |
| r2s-monster_pressure-town-1 | mon 100->82; Fortress -> WD 75 | 62 Approved -> 59 Tolerated | MC 47->43, MG 32->34 |
| r2s-monster_pressure-town-2 | Defensible -> Lightly 35 | 46 Tolerated -> 44 Contested | small shifts |
| r2s-occupied-town-2 | Vulnerable 12 -> Undefended 10 | 31 Contested -> 27 Crisis (def -4->-8) | Guild Council 36->30 falls to third; new tense ties with Occupation Authority and Religious Authorities |
| r2s-religious_conversion-metropolis-0 | mil 87->98; Defensible -> WD 58 | 42 Contested -> 49 Tolerated | GGC 21->25 Strong, TG 21->18; conflicts re-rolled; 24 ties; stress cast recast |
| r2s-slave_revolt-metropolis-3 | WD -> Fortress 80 | 27 Crisis -> 30 Contested | GMO 13->16 passes TG; 42 ties |
| r2s-wartime-town-2 | mil 36->19, mon 22->0; Defensible -> Lightly 24 | 46 Tolerated -> 44 Contested | FA 32->28; FA/MG tie symbiotic -> tense |
| rv5-calm-metropolis-0 | WD -> Fortress 77 | 87->90 | none (number only) |
| rv5-calm-town-2 | mil 100->76; WD -> Defensible 52 | 76 Endorsed -> 70 Approved | Arcane Council 45->42 Strong; Landed Gentry 11->13 Minor; arcane/religious gap 23->20 (magic acceptance syncretic->wary); 1 tie |
| rv5-monster_pressure-town-5 | WD -> Defensible 54 | 34 Contested -> 28 Crisis | MC 41 Dominant -> 34 Strong; MG and RA -> Strong; conflict re-rolled; 9 ties |

The cause words come straight from `publicLegitimacy.breakdown` (governanceAccount.js); "strong defences" prints only where the readiness label is Fortress or Well-Defended and "weak defences" only where it is Lightly Defended or Undefended. All 22 match the defence tab and the overview posture line.

## Templates
| # | template | towns | verdict | evidence |
|---|---|---|---|---|
| 1 | Governance para: standing sentence (band + 1-2 causes) | 21 | TRUE | band = publicLegitimacy.label, causes = breakdown signs, in all 21; defence word matches readiness and the defence tab in all |
| 2 | Governance para: estranged power + consequence ("X no longer takes its orders. The hall ... can no longer make them hold alone" / "at odds with it ... settles nothing large" / "has bought people inside the hall") | 10 | FALSE LOW, 1/10 | r2s-infiltrated-metropolis-2: "Oxtetun stands behind the City-State Council ... The Thieves' Guild no longer takes its orders. The hall ... can no longer make them hold alone." The record has the competitive tie, but TG is 7 Suppressed against CSC 38 Dominant, Endorsed 75. That stretches "cannot make orders hold". Carried: the same consequence printed with a minor TG at DEF (about 88 towns). Every named power and tie exists in all 10. |
| 3 | Governance para: seat sentence + vignette | 21 | TRUE | each seat-holder is an NPC with that exact role, the governing power's seat NPC |
| 4 | Legitimacy figure "NN Label" | 4 | TRUE | 75 Endorsed x3, 90 Endorsed = record |
| 5 | "Governance fractured." | 3 | FALSE MED (g), 1/3 | r2r-town-19 prints "Governance fractured." while the same block says "Stability: Stable". Legitimacy 28 Crisis is true; the two lines disagree. Carried: the same pairing is in 10 DEF towns (hamlets, thorps, r2r-town-44 ...). True in occupied-town-2 (Suppressed) and monster-5 (Tense). |
| 6 | "⚠" (governance-fractured mark beside the ruler) | 3 | TRUE | Crisis band in all 3 |
| 7 | Powers list rows "↑ Holds power / Contests the seat / <Cat> N ▼" | 14 | TRUE | power, category word and governing flag match a faction in every row |
| 8 | "Ruler/Contender X Cat Label ▼" | 5 | TRUE | category and powerLabel match |
| 9 | "The power X (label) modifier" | 5 | TRUE | |
| 10 | "↳ N members · first/second/third ..." | 2 | TRUE | named NPCs exist; e.g. city-55 Military/Guard 5 = 3 ranked + mercenary + prison |
| 11 | Web headers "↓ Subordinate (n)" etc. | 6 | TRUE | counts = factionRelationships by type |
| 12 | Web pair rows "A ↓ B stable" + narratives | 8 | TRUE | type, direction and narrative equal the record; "now about as strong" fits occupied (32/30) and wartime (25/28) |
| 13 | Rule & succession: "Nothing at X protects the seat now. Y has the strength, and the seat has only the office." | 1 | FALSE LOW, 1/1 | r2s-wartime-town-2: "Military/Guard has the strength". The same page shows Feudal Appointee 28 against Military/Guard 25 and calls them "about as strong", in a town with weak defences (military 19). The claim rests on coup weighting (ungated incumbent), not on figures the page shows. Carried at DEF in rv5-under_siege+famine-city-5 (21 vs 17). |
| 14 | "The challenger ... is now the stronger side" | 1 | TRUE | slave_revolt: Religious Authorities 26 > GMO 16 |
| 15 | "X is no longer sure the hall belongs to ..." | 1 | TRUE | monster-5: Contested risk, Crisis band |
| 16 | DM rows: "handled by N, role (House)" and "House · N · fronts for P · handled by H" | 2 | FALSE MED (h), 1 row | slave_revolt prints "Merchant guilds (50-100+) · Elias Vryennios · fronts for Thieves' Guild", a catalogue name with a count range. Carried: 14 such names in DEF's npcs and power tabs. Every house, NPC, handler and power exists and matches "Who answers to whom". |
| 17 | "Free of the criminals. Nobody at the head ... answers to a criminal house, and no criminal power ..." | 1 | TRUE | city-55: no criminal power at TIP; the ruling three are in no criminal tie |
| 18 | "Third · Sebastiane Lekapenos, the master butcher" | 1 | TRUE | |
| 19 | Institutions "Backs ..." | 1 | TRUE | matches NPC memberships for garrison, watch, mercenaries, walls, prison, adventurers |
| 20a | NPC tab rows "House · first of X · member of Y", group headers (counts) | 2 | FALSE MED (h), 1 row | city-55 prints "Butchers (3-8) · third of Merchant oligarchy", a count-range catalogue name (the institutions tab says "Butchers"). Carried at DEF (8 in city-55 alone). Every membership and count matches the record (Military/Guard 3, Unranked 40, In no power 1). |
| 20b | NPC tab: "In no power (1)" / "Multiple criminal factions"; criminal houses "member of Merchant Guilds" | 1 | FALSE LOW (g/c) | city-55: the gang boss is "In no power", but the institutions card says "Rival gangs ... Backs Merchant oligarchy" (houseBacksOf default basis). Black market, Smuggling network and Front businesses now read as members of the lawful Merchant Guilds, which the record holds as a fallback once the Thieves' Guild left the powers. Carried pattern: 2,726 house faces in no power across 663 DEF towns. |
| 21 | Plot hooks: conflict titles, conflict hooks, stress-cast hooks | 5 | TRUE | parties are factions; Quetzal Zapote = Merchant Guilds instigator; Xu Choi = target; Chimgee Kereit = watch captain, Town watch in roster |
| 22 | Relationships: "All (n) Allies (n) ..." | 7 | TRUE | counts = relationships[].type |
| 23 | Relationships: "A Type B" + "role · strength · role" (179 pairs) | 8 | TRUE | every pair is a record tie; names, roles and strength match the NPCs; every NPC's house is in the roster |
| 24 | Relationships: Active Conflicts / "Moderate/High tension A vs B · issue" / "At stake" / emergent tie | 6 | TRUE | equal record conflicts; emergent count 1 = record |
| 25 | Magic "Religious acceptance wary" | 1 | TRUE | calm-town-2: Arcane 42 vs Religious 22 (gap 20 = wary rule) |

Outside the rows (not counted): in r2r-city-55 the newly risen Military/Guard description ("A slow war with the guild: arrests are made, the gangs rebuild") prints on the pdf and foundry surfaces. At TIP the town has no Thieves' Guild power or house, only rival gangs and a smuggling network. LOW.
