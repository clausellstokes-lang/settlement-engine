# S-D SAFETY — quiet against dangerous, on the final record (MEASURE ONLY; SURVEY-FINAL, 2026-11-28)

Measured 13:21–15:45 UTC (`date -u`) on the code tip **b2a9010fe** (held; this file is a docs commit after it). No code
changed, no birth moved, no register re-recorded. Method as `S-D-FOOD.md` (900 C + 900 V owner pages rendered as the
app renders them; atoms from `factsOf` of each re-born town; shared pages NOT rendered this round).

**Atoms read:** the crisis kinds (threat group = under_siege, occupied, monster_pressure), `danger coming` (a live
`external_threat` tension), `monster frontier`, `crime` (the criminal structure band), `crime wave`, `law`, `uprising`,
the defence presences (walls, palisade, gate, watch, militia, garrison), the safety profile's label; war from the page
("is at war", "The war takes"). Sentences with would/could/if/should/might are left out of both sides (capacity talk:
"…it is safe for exactly as long as nobody comes" beside "…could not hold off a raid" says one thing, not two).

**A correction to my 14:31 note:** "Word of a gathering threat split the settlement…" on the History tab is most often a
PAST event (dp-village-7: 55 years ago, under "Major Historical Events"), not a live tension. On the atoms the NPC peace
lines meet a live `danger coming` on 1–3 pages each, not ~80.

## THE FINDINGS — CONFIRMED (page counts; the clash read by hand)

### S1. The Very Safe sentence says "little crime" beside an organised syndicate and a crime wave (V; C has no Very Safe town)

`safetyProfile.js:316` (code, **undeclared**; keyed on the safety score `effectiveSafety >= 3.5`, which reads no crime
atom): "Visitors can walk anywhere at any hour, and there is little crime; the {force} sees to that."

| V pages printing it | 75 |
|---|---|
| `crime: organized` | **19** (dp-city-8, dp-city-26, dp-city-61, dp-city-84, dp-city-89, dp-city-104, …) |
| `crime: semi-organized` | 15 |
| `crime wave` (a live tension; every one prints "The crime wave is coordinated…" as a hook) | **5** (dp-city-8, dp-city-104, dp-city-143, dp-metropolis-8, dp-metropolis-89) |

Read: dp-city-104 prints it on Defense beside the hook "The crime wave is coordinated. Someone is directing it…";
dp-metropolis-8 beside "A criminal syndicate the city has never rooted out, for fear of the gang war that would follow."
(Institutions); dp-city-89 beside "Criminal structure: Organized syndicate" (Defense). The vocabulary's own rule for
`crime wave`: "A line that says crime is kept down or the streets are quiet presumes its absence."

### S2. Two declared state-prose lines say the same with no crime-wave exclude

| line (home) | declares | pages (C / V) | crime wave | organised crime |
|---|---|---|---|---|
| "Visitors feel safe at {S}, and it is plain that somebody keeps it that way." (`DS-DEF-3::Safe#4`) | `guardPresence`, `crisis: any`, `no crisis: threat, unrest` | 0 / 11 | **V 2** (dp-town-100 beside "Crime is on the rise…"; dp-metropolis-96) | V 4 |
| "The town's record of crimes at {S} is short: there is little crime to write down…" (`DS-DEF-3::Very Safe#5`) | `no guardPresence`, `court or gaol`, `crisis: any` | 10 / 8 | **C 1** (dp-town-97) | C 1 (dp-town-87), V 2 (dp-town-63, dp-town-115) |

### S3. The calm Daily Life line beside a crime wave or a coming danger

"It has been a quiet stretch, with nothing out of the ordinary to report." (`recentChanges.js` calm C3, `needs: []`;
the calm pool prints where none of the three sources is held, and a crime wave or `danger coming` is not one of them):
C 18 pages (crime wave 1: dp-metropolis-22; danger coming 3: dp-thorp-2, dp-city-122, dp-city-129); V 14 pages (crime
wave 3: dp-thorp-24, dp-city-133, dp-metropolis-107).

### S4. The NPC peace lines beside a live danger coming

`npcStructureVariants.js` POSITION / CONSTRAINT rows, each declared `excludes: ['crisis']`; a live external threat is
not a crisis, so they stand:

| line | C pages / danger coming | V pages / danger coming |
|---|---|---|
| "Hired companies are paid by the season, and keeping them on when nothing threatens is hard to argue for." (`needs: mercenary`) | 20 / **2** (dp-city-108, dp-metropolis-143) | 10 / 0 |
| "Leads the faith while the place is at peace…" | 54 / 3 | 32 / 2 |
| "Drill keeps hands ready but not keen; quiet years wear on discipline." | 39 / 3 | 21 / 0 |
| "The walls want upkeep every year; … in quiet years it comes slowly." | 32 / 3 | 14 / 0 |
| "Must keep {house} fed and paid … what quiet years seem to need." | 26 / 0 | 27 / 3 |
| "Cannot raise more hands … in quiet years the council is careful with coin." | 25 / 1 | 14 / 0 |
| "Commands those under arms in a large place at peace…" | 27 / 1 | 17 / 0 |
| "Those who answer for {S}'s safety see no threat, and nobody has told them to look." (`crisisSummaryVantage.js`) | 4 / 0 | 4 / 1 (dp-town-46) |

Only "when nothing threatens" (and the prosperity row "…while nothing threatens, every extra hand must be argued for")
says the thing `danger coming` denies; "at peace" / "quiet years" beside word of a threat not yet arrived is SOFT (a
threat on its way is not war), and beside a monster frontier or a crime wave a DIFFERENT THING (peace = no war): C
monster frontier 21 / crime wave 13 for the faith line, by the same table.

### Set aside (read, not clashes)

- "An innermost stronghold, the city's final hold under siege." (a citadel's catalogue description: what the house is
  for) — 124 C pages; "The tally of raids at {S} is short for a frontier city…" (Defense, frontier towns: a short tally
  under the monster frontier is the line's own claim, consistent); the "after dark … less safe" lines beside the
  safety labels Moderate/Safe (one claim each, graded); NPC secrets ("…enchanting tools for thieves…",
  "…knew the face was unsafe"): the DM's, not the town's safety; "Staple beverage where water is unsafe." (a service).
- Small places (thorp/hamlet) print almost no safety pair once capacity talk is set aside (C 1 page in the crime
  subject, 2 in the peace subject among the first 308 pages).

## WHAT A CURE WOULD NEED (named; nothing built)

**Atoms:** all exist (`crime`, `crime wave`, `danger coming`, `monster frontier`, the crisis threat group). Missing
from the vocabulary, named only: the printed safety label as a band (Very Safe … Dangerous: the page prints it, no
atom reads it) and the Systems Health defence grades (Defense, Monster Defense): no line in the clashes above needs
them.

| # | line | the row it needs | pages that move (owner) | EMPTY slot? |
|---|---|---|---|---|
| Y1 | Very Safe sentence, the "there is little crime" clause | `no crime wave` and `crime: < organized` (the chair rules whether semi-organized is "little crime") keep it; else a twin without the crime claim | **V 20** (organized 19, or a crime wave: 5, one of them semi-organized), 34 with semi-organized | none: the sentence keeps "Visitors can walk anywhere at any hour" + its tail notes |
| Y2 | `DS-DEF-3::Safe#4`, `DS-DEF-3::Very Safe#5` | add `no crime wave` (and `crime: < organized` to Very Safe#5's "little crime") | V 2 + C 1 (wave); C 1 + V 2 (organized) | Safe and Very Safe pools keep other rows (not counted for EMPTY this round: PLAUSIBLE none) |
| Y3 | Daily Life calm C3 | `no crime wave`, `no danger coming` | C 4, V 3 | the calm pool keeps C2 (`crisis: calm`) and its other rows; the slot's EMPTY rule (the pool's own: "where one is held but none is sayable, the EMPTY string") unchanged |
| Y4 | the two "nothing threatens" NPC rows | add `no danger coming` | C 2 (+ the prosperity row, not counted) | none: each pool keeps `needs: []` rows ("Answers to the seat for every hand and every coin") |

**Births:** Y4 is a birth-time draw (`npcStructure.js :: pooledLineOf`, stored on `npcs[].activeConstraint` /
`npcs[].structuralPosition`): a new exclude there MOVES BIRTHS (the card's stored line); it would need S-A's view gate
(re-answered on the final record, `lineOnFinal`) to stay a page-time change. Y1: the sentence is written at birth into
`economicState.safetyProfile.safetyDesc`, and the Defense tab already prints it through a print-time seam
(`defenseDisplay.js :: deriveSafetyLine`, then `safetyLineSaidOnce`): done there it moves no birth; done in the writer
(`safetyProfile.js`) it moves the born record. Y2 and Y3 are page-time draws (state prose, Daily Life).
