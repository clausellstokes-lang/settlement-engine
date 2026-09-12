Seat: WRITER (Opus 5 — Fable-unvalidated), DS-DEF-2 · pool `Disasters & Famine: granary AND hospital` · DRAFT ROUND 1, written under brief ADDENDUM 14 (a face is lawful unless it contradicts the record; silence is permission).

Three variants, twelve faces (each variant's own line is its first face, plus three `[face]` sub-rows). Vid 1 and vid 3 carry `{settlement}` exactly once and never first; vid 2 carries NO SLOT and never names the town. Zero refusals.

---

## THE ROWS — paste under the pool heading `**`Disasters & Famine`: granary AND hospital**`

1. `[ledger]` Grain is kept at {settlement} against a harvest that fails, and the house that answers sickness is a religious foundation.
   - `[face]` What {settlement} sets against hunger is grain under a keeper, and what it sets against sickness is a house that answers to its faith. Between them they are what a household with nothing falls back on.
   - `[face]` The grain at {settlement} is nobody's own, and neither is the house that answers sickness. A household that wants either must ask.
   - `[face]` At {settlement} the grain is a matter of storage and sickness a matter of religion. The town names them in one breath.
2. `[street]` The town has grain and a religious house that answers sickness, and it takes having both for ordinary. A town with one and not the other takes it otherwise.
   - `[face]` Because the grain belongs to nobody in particular, the one who keeps its door is worth being on good terms with. Nobody says the same about the house that meets sickness.
   - `[face]` What the grain is for is clear; what the religious house can do when sickness comes is not. That question goes unsettled.
   - `[face]` Hunger and sickness are both a house's business in the town, and neither house asks what a household can pay.
3. `[counterforce]` Against a failed harvest {settlement} has grain, and against an outbreak a house of religion. Ground for the dead is kept regardless.
   - `[face]` Neither a failed harvest nor an outbreak finds {settlement} with nothing standing against it: the grain is one answer and a religious house is the other.
   - `[face]` Some towns keep grain and cannot answer sickness; others answer sickness and keep no grain. Both stand at {settlement}.
   - `[face]` Hunger meets a locked door at {settlement}, and sickness meets a house kept by the faithful. The town does not say which of them it trusts.

---

## WORD COUNTS

| row | face | words | sentences | first two words | landing noun |
|---|---|---|---|---|---|
| 1 | v1f1 (row line) | 20 | 1 | Grain is | foundation |
| 1 | v1f2 | 36 | 2 | What {settlement} | (falls back) on |
| 1 | v1f3 | 22 | 2 | The grain | ask |
| 1 | v1f4 | 22 | 2 | At {settlement} | breath |
| 2 | v2f1 (row line) | 29 | 2 | The town | otherwise |
| 2 | v2f2 | 31 | 2 | Because the | sickness |
| 2 | v2f3 | 22 | 2 | What the | unsettled |
| 2 | v2f4 | 20 | 1 | Hunger and | pay |
| 3 | v3f1 (row line) | 22 | 2 | Against a | regardless |
| 3 | v3f2 | 26 | 1 | Neither a | other |
| 3 | v3f3 | 19 | 2 | Some towns | {settlement} |
| 3 | v3f4 | 26 | 2 | Hunger meets | trusts |

Range 19 to 36 words; no two faces of one variant share a construction, an opening or a landing noun.

---

--- NOTES

### 0. REFUSALS

**None.** All three variants are written lawfully under the four floors. No variant needed a refusal row.

### 1. What was dropped from the shipped rows, and why

1. **"somewhere to put the sick" / "a place for the ill" / "the reason is in the two buildings"** — dropped on floor 1. `compound.inst.hasHospital` (`priorityHelpers.js:64`) fires on `Monastery or friary` (`institutionalCatalog.js:1267-1273`, *"Religious community. May operate hospital/school."*, `baseChance 0.4`, likelier at town than `Small hospital`'s `0.3`). **The roster is the record.** Every rewritten face names the town's capacity to ANSWER sickness and never a room it puts sickness in.
2. **"without either becoming a catastrophe" / "Neither … turns into a catastrophe"** — dropped on floor 1 (`config.stressTypes` → `foodGenerator.js:341-343` writes `Deficit — Active Famine` on towns this key selects without consulting it) and on floor 2 (a prediction the pulse adjudicates). The producer stops at CAPABILITY (`threatAssessment.js:181-190`, *provides*, *enables*); every face here stops there too.
3. **"the two buildings"** — dropped as a count (F2-01) and as a floor-1 contradiction at city and metropolis, where `City granaries`, `State granary complex`, `Multiple monasteries`, `Hospital network` and `Major monasteries (5-10)` are plural rows. **No face in this draft counts anything.** For the same reason no face writes the singular definite "the granary" (right at town, wrong at city); the grain is named as a mass noun throughout.
4. **"rather than in the luck"** — dropped under wall 5. Where a contrast survives (v2f1, v3f2, v3f3) the rejected alternative is a SIBLING POOL KEY of `DISASTER_ROW_POOL` (`granary, NO medical provision` and `NO reserves, hospital present`), which is the only rejected alternative the wall permits.
5. **"knows exactly what having both is worth"** — dropped as the MEANING move with a magnitude word attached. `having both` is kept (v2f1), which is the cheapest lawful naming of the pool's discriminating claim.

### 2. Per face — the claims and what grounds each

**Card clauses referenced:** `[may claim]` = the card's *may claim* line (the reader selects the row `granary, hospital`, as a STANDING fact); `[bag]` = `{settlement: proper}`, filled at this block's call sites; `[audience]` = player, no mark; `[source]` = SOURCE-UNRESOLVED, no citation licensed. Under ADDENDUM 14 the card states what the read REACHES; the grounds below therefore also name the ROSTER ROW or the FLOOR CLEARANCE where a claim goes beyond the read, as the test requires.

**v1f1 · `[ledger]` · 20 words.**
- *grain is kept at the town* — `[may claim]`, the granary half of the predicate; roster `Town granary` / `City granaries` / `State granary complex`, `required: true, baseChance: 1` at town and city.
- *the keeping is against a harvest that fails* — the PURPOSE reading, the catalogue's own words (*"Buffers harvests, prevents famine."*, `institutionalCatalog.js:928`). Stated as purpose, never as a duration or an outcome: no "year", no "season", no "enough" (floor 2a).
- *there is a house that answers sickness, and it is a religious foundation* — `[may claim]`, the medical half; every row that can set the flag at town-plus is tagged `religious` (`Small hospital` *"Usually religious-run"* `:1275-1281`; `Monastery or friary` `:1267-1273`; `Major hospital` / `Multiple monasteries` / `Hospital network` / `Major monasteries`). An institution's origin is not a theological claim (floor 3 clear).
- *slot* — `[bag]` `{settlement}`, once, inside the sentence (T-F8 clear).

**v1f2 · `[ledger]` · 36 words.**
- *the two halves are what the town sets against hunger and against sickness* — `[may claim]`, both halves, the pool's discriminating claim.
- *the grain is under a keeper* — an UNNAMED person holding a key. Licensed by the ADDENDUM 14 relaxation; not the singular office the tier emits (`TIER_MANDATORY_ROLES` seats one Guard Captain, one Mayor, one High Priest — a granary's keeper is none of them; F3-06 clear).
- *the house answers to its faith* — as v1f1's third claim.
- *a household with nothing falls back on them* — silence, and supported by the rows' own descriptions (*"Communal grain storage"*; *"Care for sick poor"*). Written as a single indefinite household, never as a totality over persons (the card's REFUSED COLUMNS line clear).
- *"Between them"* — carried verbatim from the shipped vid 1; it states that the two facts combine without saying what they produce.

**v1f3 · `[ledger]` · 22 words.**
- *the grain is nobody's own* — the roster's own kind words: *"Communal grain storage"* (town), *"State managed"* (city, `:1590-1596`), *"State-administered"* (metropolis, `:2505-2510`). True across the whole preimage.
- *neither is the house that answers sickness* — the medical rows are religious foundations, not household property.
- *a household that wants either must ask* — silence; a recourse claim, not a room. Leaves the matter standing open (who is asked is not said), which is the face's hook.

**v1f4 · `[ledger]` · 22 words.**
- *the grain is a matter of storage; sickness is a matter of religion* — the two roster kinds stated as kinds, which is the flattest ledger form of `[may claim]`.
- *the town names them in one breath* — the pool key itself joins the two readings (`disasterRowSituation`, `defenseStateProse.js:580-586`); nothing in the record denies the town treating them together. No record and no keeper is named (`[source]` clear: no book, no tally, no register, no roll).

**v2f1 · `[street]` · 29 words · NO SLOT.**
- *the town has grain and a religious house that answers sickness* — `[may claim]`, both halves.
- *it takes having both for ordinary* — silence; a standing disposition, not a mood and not a rate ("ordinary" carries no frequency; floor 2's rate bar clear).
- *a town with one and not the other takes it otherwise* — the lawful contrast: the rejected alternatives are the sibling keys `granary, NO medical provision` and `NO reserves, hospital present` of the same `DISASTER_ROW_POOL` table (`defenseStateProse.js:548-554`).
- *no slot* — the face never names the town, in any form, and carries no demonstrative doing the naming's work.

**v2f2 · `[street]` · 31 words · NO SLOT.**
- *the grain belongs to nobody in particular* — as v1f3's first claim.
- *the one who keeps its door is worth being on good terms with* — an unnamed person, a consequence landed on a relationship rather than an outcome. F3-06 clear (no tier-mandatory office). No magnitude: the face does not say how much weight the keeper has.
- *nobody says the same about the house that meets sickness* — a negative about what is SAID, not about what the house holds; the record is silent on both, so no field is contradicted. It is also the passage's one turn outward, placed last (THE THREAD).

**v2f3 · `[street]` · 22 words · NO SLOT.**
- *what the grain is for is clear* — the catalogue's own purpose line, as v1f1.
- *what the religious house can do when sickness comes is not clear* — this is the honest form of the medical half: the roster row (`Monastery or friary`, *"May operate hospital/school"*) is itself undecided, so the face states the record's own indeterminacy rather than asserting a ward. It asserts no incapacity either, so the `Small hospital` branch is not contradicted.
- *that question goes unsettled* — one civic matter left standing open, declarative, no interrogative.

**v2f4 · `[street]` · 20 words · NO SLOT.**
- *hunger and sickness are both a house's business in the town* — `[may claim]`, both halves, stated as one kind of answer.
- *neither house asks what a household can pay* — the rows' own charitable character (*"Care for sick poor"*; communal and state-managed storage). No second civic object of the class `care` is introduced: no apothecary, no almshouse, no midwife, no herbalist, no physician.

**v3f1 · `[counterforce]` · 22 words.**
- *against a failed harvest the town has grain; against an outbreak a house of religion* — `[may claim]`, both halves, with the row's own two pressure nouns carried from the shipped vid 3 (`a failed harvest`, `an outbreak`). The counterforce stance states what STANDS, never what will fail to happen.
- *ground for the dead is kept* — the roster, at every tier this key reaches: `Parish burial grounds` `required: true` at town (`institutionalCatalog.js:1289-1295`), `Burial grounds and charnel house` `required: true` at city (`:1835`), `Cemetery network` `required: true` at metropolis (`:2392-2398`). Written as ground rather than by any of the three row names, so it is true of all three and carries no culture-specific furniture (F3-05 clear). No keeper and no register is named (`[source]` clear — the town row's sexton and his register are barred and are not used).
- *regardless* — the dry note. It implies and asserts nothing: no outcome, no prediction, no count of the dead.

**v3f2 · `[counterforce]` · 26 words.**
- *neither pressure finds the town with nothing standing against it* — a statement about what EXISTS when the pressure comes, not about what results. No modality is imported (no "would", no "will"), so nothing the pulse adjudicates is claimed.
- *the grain is one answer and a religious house is the other* — `[may claim]`, both halves, distributively rather than by a count.
- *`Neither … nor`* — the shipped vid 3's opening shape, kept, now governing lawful content; it is used in this variant only and in no sibling.

**v3f3 · `[counterforce]` · 19 words.**
- *some towns keep grain and cannot answer sickness; others answer sickness and keep no grain* — the two sibling keys of this row's own four-way tree, which are the only rejected alternatives wall 5 permits.
- *both stand at the town* — `[may claim]`, the discriminating claim, landing on the slot. `{settlement}` does not open either sentence.

**v3f4 · `[counterforce]` · 26 words.**
- *hunger meets a locked door* — the granary as an object in use. A door and a lock are silence, not denial; no stock, depth, fullness or capacity is claimed (floor 2a clear, and the C1 ruling — the record holds the BUILDING and not the grain — is respected).
- *sickness meets a house kept by the faithful* — the followers act, the deity does not (floor 3 clear). True of the religious-run hospital rows and of the monastic rows alike.
- *the town does not say which of them it trusts* — the withheld thing. It asserts no relative strength (no comparative, no magnitude), and it is the pool's second standing-open matter.

### 3. Decisions taken deliberately, recorded here so they can be vetoed

1. **The medical half is named as RELIGIOUS on every face that names it.** Every row that can set `hasHospital` at town-plus carries the `religious` tag and a religious description. This is the widest true naming available, and it is the only one that survives both the `Small hospital` and the `Monastery or friary` branches. It is an institution's origin, never a theological claim.
2. **The burial ground is used once (v3f1).** The skeleton §3.9 names it as the sharpest unused fact on this key, and the roster carries it `required: true` at all three tiers. The card's *"another civic object of the class `care`"* line does not reach it (burial is not care, and T-F12's one-object-per-class guard is struck by the re-cut). Flagged because it is the draft's one reach beyond the two rostered halves.
3. **"the granary" as a singular definite is refused throughout.** At city and metropolis the rows are plural. The grain is therefore carried as a mass noun, and the building is named only through an indefinite ("a locked door", "its door").
4. **The DS-DEF-6 echo is avoided by construction, not by synonym.** That desk's three granary spines open `holds stored food` / `holds reserves` / `keeps stores` a few rows below on the same tab. No face here uses `holds`, `stores` or `reserves` with the grain; the grain appears as a subject that is kept, owned, set against, answered with, or met at a door.
5. **Nothing is said about how food reaches the town.** The status note beside this row varies on `tradeRouteAccess`, which this pool does not read; no face mentions roads, the sea, a port, or supply.
6. **No face rates the arrangement.** The badge beside this row is computed from `scores.disaster` and can read LOW on a town with both halves; no face says strong, adequate, sufficient, good, or well-provided.
7. **The word `plagued` is never used** (it is monster activity on this desk, `monsterThreat.js:28`). The row's disease noun is `an outbreak`, carried from the shipped vid 3, and `sickness`.
