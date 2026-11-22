# PROPOSAL — `npcs[].structuralPosition` (PEOPLE-1, measuring seat M1, 2026-11-20)

**Base and method.**
- Base `b53a665e7`: the briefs commit, a docs-only child of `43ab0f5eb`, with `src/` identical.
- Births: 100 places a size, born exactly as the chair's instrument births them, with the same mask.
- Files: `measures/m1-births.mjs`, `measures/m1-npcStructure.mjs` and `measures/m1-pools.mjs`, each run beside its `.out.txt`.
- The companion is `PROPOSAL-activeConstraint.md`. It is the same writer and the same row, so the two fields share their key and their measure.

## 1. The function

`src/generators/npcStructure.js :: enrichNPCsWithStructure` writes the field on four branches. The cut, the key and the refusals are those of the companion proposal §1.

- **Template (the plain row).** `positionForStanding(npc, lineText(tmpl.position))`. This is `T[looked].position` verbatim, unless the card is a head of low influence whose row is one of the two in `LOW_STANDING_TWIN`. That card prints the row's twin, which claims no secure hold (BAR5-POWERS 1c-npc).
- **Template, dual-hat holder.** `${lineText(tmpl.position)} ${holderHouseLineOf(npc)}`. The holder's `government__<cond>__dominant` row ("Holds the seat …") is followed by "Still <title> as well." (`holderHouseLineOf`: `cardOfficeOf(npc)` and a title).
- **`HOLDS_THE_SEAT`.** The holder whose row `resolveDeclared` refuses (a crisis the condition does not name, against a calm row) prints the bare fact "Holds the seat.", with the house second when there is one. It claims no constraint and no goal.
- **No position.** Every refusal of the companion §1, and every card outside the cut.

## 2. Today's branches and top share (100 places a size)

The table gives places · entries. The holder rows count both with and without the house.

| row | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| government__stable__dominant (holder; +house / bare row) | 41+4 | 26+6 | 22 | 59+7 | 57+15 | 51+14 |
| religious__stable__dominant | – | – | 17 | 61 | 59 | 63 |
| military__stable__dominant | – | 2 | 1 | 46 | 69 | 65 |
| economy__stable__subordinate | – | 1 | 4 | 34·36 | 47·52 | 39·45 |
| government__governance_fractured__dominant (holder) | 10+15 | 20+14 | 25+3 | 7 | 1 | 4 |
| government__economic_stress__dominant (holder) | 11+10 | 16+10 | 36+3 | 1+2 | 1 | – |
| government__stable__subordinate | – | – | – | 41·44 | 5 | – |
| religious__economic_stress__dominant | – | – | 37 | 1 | 1 | – |
| religious__governance_fractured__dominant | – | – | 23 | 4 | 1 | 4 |
| economy__stable__dominant, **every one the low-standing twin** (`positionForStanding`) | – | – | – | 13 | 16 | 22 |
| magic__stable__dominant (row + twin) | – | – | – | – | 11+4 | 36 |
| other__stable__dominant | – | – | – | 1 | 25 | 21 |
| **HOLDS_THE_SEAT** (+house / bare) | 1 | 1 | – | 5+1 | 18+4 | 17+3 |
| religious__contested__dominant | – | – | 9 | 16 | – | – |
| government__contested__dominant (holder) | 5+1 | 2 | 8 | 14+1 | – | – |
| military__stable__subordinate | – | – | 2 | 13·14 | 10 | – |

The full table is in `measures/m1-npcStructure.out.txt`, on the `branch … structuralPosition` lines.

**The top sentence today** is counted as places printing it over places holding the field. The holder's house tail splits its row by title, which is why the holder row tops at 17% in thorps and not at 45%.

| size | top | sentence |
|---|---|---|
| thorp | 17/98 (17%) | Holds the seat, and people accept it; there is room to act, not just to hold on. Still the head shepherd as well. |
| hamlet | 14/97 (14%) | Holds the seat in name, but fewer people come when called, and some orders go unanswered. |
| village | 37/100 (37%) | Leads the faith while money is short; its lands and alms are both a help and a target. |
| town | 61/100 (61%) | Leads the faith in quiet times, whatever it thinks of the seat beside it. |
| city | 69/99 (70%) | Commands those under arms in quiet times; the work is keeping trouble from starting. |
| metropolis | 65/95 (68%) | Commands those under arms in quiet times; the work is keeping trouble from starting. |

These also break the bar:
- In towns:
  - "Commands those under arms in quiet times …" (46%)
  - "Holds an office that runs from day to day, with no crisis to answer." (41%)
  - "Runs a smaller house behind the leading one in quiet times." (34%)
  - the holder's calm row with "Still the senior guild master as well." (28%)
- In cities:
  - the faith's calm row (60%)
  - the smaller house (47%)
  - the holder's calm row with "Still the senior guild master as well." (46%)
  - "Heads an old family while the seat's offices take up …" (25%)
- In metropolises:
  - the faith's calm row (66%)
  - the holder's calm row with "Still the exchange master as well." (46%)
  - the smaller house (40%)
  - the casters' calm row (38%)
  - the leading house's twin (22 of 95)
- In villages, the faith's fractured row (23%) and its calm row (17%).

**The holder branch and `positionForStanding`, as the brief asked.**
- **`HOLDS_THE_SEAT`** prints in 22 cities and 20 metropolises. Its commonest form, "Holds the seat. Still the senior guild master as well.", is on 15 of 99 cities and 14 of 95 metropolises. That is AT the bar and not over it, so I propose no pool. It is the refusal's own bare fact, and it should stay bare (§6).
- **`holderHouseLineOf`** is untouched. The projection keeps the tail on whatever row the holder reads.
- **`positionForStanding`'s twin** (the leading house's, 22 of 95 metropolises) breaks the bar. Its pool's new wordings claim no secure hold and no say, so a low-standing card may read any of them. The twin stays bound to index 0 alone.

## 3. The readers

| path :: symbol | kind | what breaks if the words change |
|---|---|---|
| `src/components/new/npcComponents.jsx` (italic paragraph, `npc.structuralPosition &&`) | PRINTS (web card) | nothing |
| `src/domain/npcProfile.js` (`publicReputation`: first of structuralPosition, presentation, role) | COMPOSES FROM IT, and through it PRINTS: `scripts/.writer-reach-baseline.json` "structuralPosition on npcs" reaches campaign-pdf, dossier-pdf, foundry, world-book (R); the AI bundles (`supabase/functions/_shared/aiGroundingBundle.js`, `aiCharterBundle.js`, `aiOutputSchemaBundle.js`) carry the same reader | nothing: it passes the text through. The bundles are rebuilt with the engine, at the owner's hand |
| `src/components/dossier/SettlementWorkbench.jsx :: entitySummary` (fallback after `description`) | PRINTS (entity summary) | nothing |
| `src/domain/dossier/dossierSearch.js` | search text | nothing |
| `src/domain/worldPulse/npcLadderState.js :: structuralRankScore` (`structuralRank \|\| structuralPosition`, compared to 'dominant'/'subordinate') | reads the text only where `structuralRank` is absent; every enriched card now carries it, and no prose equals those words | nothing |
| `src/domain/worldPulse/npcVerdictApply.js` (`structuralPosition` → '' on a verdict) | clears it | nothing |
| `src/domain/regenerationPreservation.js` (re-runs `enrichNPCsWithStructure`) | re-derives | nothing: the same `_seed` and the same card id give the same wording |
| `scripts/.observed-shape-readers-baseline.json`, `.writer-reach-baseline.json` | keyed by field name | nothing |
| `docs/census/declarations/npcStructure.T.json` (`<key>.position` rows), `tests/lint/presumedThings.shared.mjs`, `scripts/census/pool-dominance.register.json` | MATCH (declaration, presumption walker, dominance ceiling) | as in the companion §3: the new data file needs its declaration and its walker row; the register is shrink-only |
| `tests/property/generatorGoldenMaster.test.js` | hashes text leaves | rows move; the signed door is the owner's |
| `tests/generators/people/seatHolderCard.test.js` (HOLDS `^Holds the seat\b` on the holder; SUBORDINATE; the house tail `endsWith('Still <title> as well.')`) | MATCHES | none: every holder wording opens "Holds the seat" and passes SUBORDINATE, and the tail is kept (the measure's guards, 0 misses) |
| `tests/components/seatHolderOnThePage.test.jsx` (SUBORDINATE on the rendered holder lines) | MATCHES | none (guarded) |
| `tests/generators/people/lordNotGovernment.test.js` (`/\boffice\b/` absent on lords) | MATCHES | none: no `other` wording says "office" (guarded) |
| `tests/generators/npcStructureBody.test.js` (OLD_FAMILY, UNDER where the power is another kind; no `^Leads a squad` on a military head) | MATCHES | none (guarded) |
| `tests/generators/npcStructureBody.test.js:69` (`rpf-town-calm-13`, Osterhild Gärtner `toMatch(/^Commands those under arms in quiet times/)`) | MATCHES (a seeded birth) | goes red if her pick leaves index 0: re-key by identity |
| `tests/generators/bar2PeopleTies.test.js` KEEP (`r2r-village-46`: "Commands those under arms in quiet times; …"; ROWS `r2r-village-13`: "Leads the faith in quiet times, whatever …") | MATCHES (seeded) | same |
| `tests/generators/tailTies3Batch1.test.js:61` (`'Runs a smaller house behind the leading one in quiet times.'`), `:72` (`r2r-village-48`, the faith's contested row), `:77` (`r2r-thorp-30`, the holder's contested row) | MATCHES (seeded) | same |
| `tests/domain/bar5PowersStanding.test.js:91` (`bar0-metropolis-calm-rand-21`, `^Heads the casters in quiet times; their place is secure`); `:116` (no "secure" on a low-standing card) | MATCHES (seeded) | `:91` same as above; `:116` none: no new wording claims a secure hold |
| `tests/generators/headOfItsPowerRow.test.js`, `npcStructureHouseKind.test.js`, `people/castDerived.test.js`, `npcStructureGoalLookup.test.js`, `npcStructureSeatPlain.test.js`, `tests/ui/*`, `npcProfile.test.js` | MATCH rows not pooled, or synthetic (unseeded) places | none: an unseeded place takes index 0 (`pickVariant`'s falsy seed) |
| `tests/generators/people/mintedLordKeepsLines.test.js` | compares with and without minted lords | none: the pick is keyed by card id |

## 4. The candidate wordings, by branch

The rules are those of the companion §4:
- Index 0 is today's line.
- The pick is `pickVariant([today, ...eligible], '<_seed>::npcStructure.structuralPosition::<card id>')`, with no new draw.
- A wording is eligible only where its `needs` hold and its `excludes` do not. The stable pools also exclude crisis (CALM_ONLY).
- The proposed data file is `src/data/npcStructureVariants.js`, as `POSITION_VARIANTS`.
- The holder's wordings all open "Holds the seat" (N1/N3), and the dual-hat tail follows as today.
- No wording gives the ruler a second office ("a king does not wear a dual hat"). The holder's lines speak of the seat and of who shares it, never of a second post. The house the holder already holds is the existing tail, unchanged.
- The non-holder wordings read the person's own house (the `ATOM?` slot), what the place has (its walls, market, court, church, size and purse), and who sits beside them in the order. "The council" appears only where `ruling body` holds, and never where a priest rules (the faith's council line).
- Guards: as in the companion §4, 0 misses.


**`government__stable__dominant`** (8 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Holds the seat with the council beside it; in quiet times the place lets them get on with it. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 2 | Holds the seat, and people accept it; the market days run and few complain of the dues. | `market` · market.js | — | the place keeps a market, the everyday ground of this post |
| 3 | Holds the seat, and people accept it; quarrels that need judging go to the court. | `court sits` · defence.js :: courtHoldersOf | — | a court sits on the roster, so judging is not the seat's own |
| 4 | Holds the seat, and in a place this small everyone knows it; most quarrels end at its door. | `population: small` · populationBand.js | — | a small place, where one person carries the post |
| 5 | Holds the seat in good years; the place is comfortable, and few begrudge what the seat costs. | `prosperity: ≥ comfortable` · factsOf.prosperity (prosperityRank.js) | — | Comfortable or better: the purse can bear more |
| 6 | Holds the seat, and people accept it; there is enough coin for the everyday work, if little over. | `prosperity: moderate` · factsOf.prosperity (prosperityRank.js) | — | Moderate: enough for the everyday work, little over |
| 7 | Holds the seat while {export} goes out and coin comes back; people accept it, and there is room to act. | `ATOM? export good` · factsOf.exports (no atom: §6) | — | the place's own export, named |
| 8 | Holds the seat, and nobody is pressing to take it; there is time to act. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`military__stable__dominant`** (7 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Commands {house} in quiet times: the drill, the roster and the gear kept ready. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Commands those under arms in quiet times; the walls are walked, and little more is asked. | `walls` · defence.js | — | the place has walls, and walls are the post's standing upkeep |
| 3 | Commands those under arms in quiet times; most days the work is the market crowds and the odd brawl. | `market` · market.js | — | the place keeps a market, the everyday ground of this post |
| 4 | Commands those under arms in a large place at peace; the work is many small quarrels, not one big one. | `population: large` · populationBand.js | — | a large place, where the post is spread over many |
| 5 | Keeps those under arms ready in a quiet season; nothing calls on them but routine. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 6 | Commands those under arms while the place is quiet; the work is the rounds, the roll and the pay. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 7 | Commands those under arms in quiet times; the hard part is keeping idle hands sharp. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`religious__stable__dominant`** (7 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Leads the faith from {house}; in quiet times the work is the services, the feast days and the burials. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Leads the faith across a large place, with many houses of worship and a priest for each. | `population: large` · populationBand.js; `church` · faith (dossier/faithReading.js, factsOf.faith) | — | a large place, where the post is spread over many; the place has its own church |
| 3 | Leads the faith in a small place, where the priest knows every family by name. | `population: small` · populationBand.js; `church` · faith (dossier/faithReading.js, factsOf.faith) | — | a small place, where one person carries the post; the place has its own church |
| 4 | Leads the faith in an ordinary year: services, feast days, weddings and burials. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 5 | Leads the faith while the place is at peace; the work is the round of services and the needs of the poor. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 6 | Leads the faith in quiet times; the council asks its blessing on the great days and leaves it be on the rest. | `ruling body` · rulingBody.js | `ruler: priest` | the seat is a council by its own label, so no one at it acts alone |
| 7 | Leads the faith in a settled season, with no crisis to call the faithful together. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`economy__stable__subordinate`** (6 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Keeps {house} going in quiet times, a smaller house behind the leading one in the trade. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Runs a smaller house behind the leading one, in a place that sends out {export}. | `ATOM? export good` · factsOf.exports (no atom: §6) | — | the place's own export, named |
| 3 | Runs a smaller house in the trade, second to the leading one, in a steady season. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 4 | Runs one of the many smaller houses of a large place, behind the leading one in the trade. | `population: large` · populationBand.js | — | a large place, where the post is spread over many |
| 5 | Runs a smaller house behind the leading one; it keeps its own regulars on market days. | `market` · market.js | — | the place keeps a market, the everyday ground of this post |
| 6 | Runs a smaller house in the guild, behind the leading one, in a steady season. | `guild` · guild.js | — | a guild stands in the place, so the trade has its own rule-maker |

**`economy__stable__dominant`** (4 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Heads {house}, the leading house in the trade, in a steady season. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Heads the leading house in a trade that sends {export} out of the place. | `ATOM? export good` · factsOf.exports (no atom: §6) | — | the place's own export, named |
| 3 | Heads the leading house in the trade of a large place, with many smaller houses behind it. | `population: large` · populationBand.js | — | a large place, where the post is spread over many |
| 4 | Heads the leading house in the trade while business is steady and no one presses it. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`government__stable__subordinate`** (5 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Keeps {house} for the seat, day to day, with no crisis to answer. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Holds a post under the council; the work is the daily round, and the round is quiet. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 3 | Holds a small post of the seat and does its daily work; nothing out of the ordinary is asked of it. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 4 | Holds a post of the seat whose busiest days are market days. | `market` · market.js | — | the place keeps a market, the everyday ground of this post |
| 5 | Holds a post of the seat in good years, when the work is steady and the purse sound. | `prosperity: ≥ comfortable` · factsOf.prosperity (prosperityRank.js) | — | Comfortable or better: the purse can bear more |

**`magic__stable__dominant`** (4 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Heads {house} in quiet times; there is steady work for every caster who wants it. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Heads the casters of a large place, where there is call for spells every day. | `population: large` · populationBand.js | — | a large place, where the post is spread over many |
| 3 | Heads the casters in good years, when people can afford to pay for spellwork. | `prosperity: ≥ comfortable` · factsOf.prosperity (prosperityRank.js) | — | Comfortable or better: the purse can bear more |
| 4 | Heads the casters in a quiet season; the work is the ordinary run of charms and wards. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`other__stable__dominant`** (3 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Heads one of {house}, whose old rights still count for something in the place. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Heads an old family whose name is older than the seat itself. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 3 | Heads an old family among many in a large place, where an old name opens doors but does not rule. | `population: large` · populationBand.js | — | a large place, where the post is spread over many |

**`government__governance_fractured__dominant`** (4 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Holds the seat, but the council no longer moves when it asks, and some orders go unanswered. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 2 | Holds the seat in name; in a place this small everyone sees who no longer comes when called. | `population: small` · populationBand.js | — | a small place, where one person carries the post |
| 3 | Holds the seat in name; when it calls the neighbours out, fewer come than used to. | `militia` · defence.js | — | the force is neighbours called out, not hands in pay |
| 4 | Holds the seat, but its word now carries only as far as people choose to let it. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`government__economic_stress__dominant`** (5 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Holds the seat while money is short, in a place that lives on what its {export} fetches. | `ATOM? export good` · factsOf.exports (no atom: §6) | — | the place's own export, named |
| 2 | Holds the seat while money is short, and {import} must still be bought in at whatever it costs. | `ATOM? import good` · factsOf.imports (no atom: §6) | — | the place's own import, named |
| 3 | Holds the seat in a small place gone short of coin, where everyone knows what has gone unpaid. | `population: small` · populationBand.js | — | a small place, where one person carries the post |
| 4 | Holds the seat while money is short, and every council meeting comes back to the same few coins. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 5 | Holds the seat in lean years; people are patient with it, but they keep count. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`religious__economic_stress__dominant`** (3 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Leads the faith from {house} while money is short, and more people come to its door for alms. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Leads the faith in a small place gone short of coin, where the priest knows which households are going without. | `population: small` · populationBand.js; `church` · faith (dossier/faithReading.js, factsOf.faith) | — | a small place, where one person carries the post; the place has its own church |
| 3 | Leads the faith through lean years, when people lean on it more and give it less. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`religious__governance_fractured__dominant`** (2 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Leads the faith while the seat fails; more disputes now end at {house} than at the seat's door. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Leads the faith while fewer heed the seat, and more ask the faith to settle what the seat once did. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`religious__contested__dominant`** (2 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Leads the faith from {house} while many doubt the seat's right; both sides listen for what is said there. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Leads the faith while the seat's right is in doubt, and people wait to hear which way it leans. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`government__contested__dominant`** (1 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Holds the seat while many question its right, and the questions are asked openly. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

## 5. Projected top share by size (100 places a size; `measures/m1-npcStructure.out.txt`, SUMMARY)

| | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| **today** | 17/98 17% | 14/97 14% | 37/100 37% | 61/100 61% | 69/99 70% | 65/95 68% |
| **B: the pools of §4** | 5/98 5% | 9/97 9% | 13/100 13% | 14/100 14% | 15/99 15% | 14/95 15% |
| B-vocab: B without the `ATOM?` wordings | 5/98 5% | 9/97 9% | 17/100 17% | 15/100 15% | 15/99 15% | 15/95 16% |

**The commonest projected sentence under B:**

| size | top | sentence |
|---|---|---|
| thorp | 5% | Holds the seat in name; in a place this small everyone sees who no longer comes when called. |
| hamlet | 9% | Leads a squad that now takes orders from more than one master. (not pooled; under the bar today) |
| village | 13% | Leads the faith through lean years, when people lean on it more and give it less. |
| town | 14% | Leads the faith in quiet times, whatever it thinks of the seat beside it. (index 0) |
| city | 15% | Holds the seat. Still the senior guild master as well. (`HOLDS_THE_SEAT`, not pooled) |
| metropolis | 15% | Holds the seat. Still the exchange master as well. (`HOLDS_THE_SEAT`, not pooled) |

**Where the projection approximates the code path.** The approximations are the companion's (facts read on the final record, the atom stand-in, the pick key, noise at 100 places), plus two:
- The holder's tail is re-appended exactly as the writer appends it.
- The low-standing twin is applied to index 0 only, exactly as `positionForStanding` maps it today.

## 6. What I could not settle, and what must be ruled

1. **`HOLDS_THE_SEAT` is the top line in cities and metropolises** after the cure, at 15%: at the bar, not over it. It is the refusal's bare fact ("the holder still holds the seat; no constraint and no goal are claimed"), and varying it would mean writing claims for a holder whose calm the record refuses. I propose leaving it. **Ruling:** leave it, or count it as over the bar. If it is counted as over, the only cure is a pool of bare, claimless openings. Those are hard to write without a machinery word ("the record") or a claim the refusal forbids, so I do not recommend it.
2. **The scope matches the companion's.** The bar is not met by the "in quiet times" rows alone. The holder's calm row (46% of cities), the smaller house, the office, the casters, the families and the villages' lean-years and fractured faith rows all break it. **Ruling:** these pools are in scope as one cure.
3. **The atoms the vocabulary lacks** (the chair's rule of 16:10 UTC):
   - ATOM own house : none under src/domain/facts/ (the card's own record field `npcs[].institution`, kind 'house', filled by `src/generators/people/goals.js :: houseFill`) : "Commands {house} in quiet times: the drill, the roster and the gear kept ready." (also the faith's calm #1, the smaller house #1, the leading house #1, the office #1, the casters #1, the families #1, the faith's lean-years #1, fractured #1 and contested #1)
   - ATOM export good : src/domain/facts/goodExported.js (the list `factsOf.exports` via `canonExports`, a good through `goals.js :: resourceFill`) : "Holds the seat while {export} goes out and coin comes back; people accept it, and there is room to act." (also the smaller house #2, the leading house #2, the holder in lean years #1)
   - ATOM import good : src/domain/facts/criticalImportBroughtIn.js (the nearest home; the list `factsOf.imports` via `canonImports`) : "Holds the seat while money is short, and {import} must still be bought in at whatever it costs."

   Without them (B-vocab), villages project at 17% and metropolises at 16%. If they are refused, the villages' lean-years faith pool needs one or two more vocabulary-only wordings.
4. **Wordings that read a neighbour in the order.** One line names the council as the faith head's neighbour: "the council asks its blessing on the great days and leaves it be on the rest". It is gated on `ruling body` and excluded where a priest rules. It still asserts a custom (the blessing) that the record does not hold, so the chair may strike it, at a cost of about 1 point in towns.
5. **The golden master and the seeded text tests of §3** move. The golden master is the owner's signed door. The six seeded text rows (npcStructureBody:69, bar2PeopleTies ×2, tailTies3Batch1 ×3, bar5PowersStanding:91) must be re-keyed by identity in the same change.
