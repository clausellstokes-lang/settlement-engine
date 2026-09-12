Seat: MARKER (opus), DS-DEF-2 · pool `Invasion & War: walls AND professional garrison` · the skeleton the writer drafts from; nothing here is a face.

# DS-DEF-2 · `Invasion & War: walls AND professional garrison` · SKELETON

Three shipped variants, vids 1 to 3, angles `[ledger]` `[visitor]` `[street]` in that order. The rows below are the annex's at the dock tip (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, the bold pool line at 2630 and the three numbered rows at 2631 to 2633) and the generated leaf carries the same three texts with the same vids, angles and slot sets (`src/data/dossierStateProse/defense.generated.js` lines 554 to 577; the pool's manifest row at `:1130-1145` reads `role: spine`, `variantCount: 3`, `faceCounts: [1,1,1]`, `vids: [1,2,3]`, `readsCount: 1`, `attach: []`). **⛔ THE SLOT SETS ARE NOT UNIFORM IN THIS POOL: vids 1 and 2 carry `{settlement}`; vid 3 carries NOTHING.** A face's slot set must equal its parent's (ARCH §2.5's face-row refusals), so every face of vid 3 names no town at all. The writer rewrites these three, one for one, and gives each its four `[face]` sub-rows.

**THE TEST THIS PACKET IS MARKED UNDER (ADDENDUM 14, the owner 2026-09-12).** A face is LAWFUL unless it CONTRADICTS the record. Silence is permission. "The card does not license it" is not a finding and the tag `unlicensed` does not appear anywhere below. Claims are tagged SAFE, CONTRADICTED (with the field, file and line, and which of the two is the record) or FLOOR-2.

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock (`node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: walls AND professional garrison'`)

```
LICENCE (block DS-DEF-2 · role spine · key `Invasion & War: walls AND professional garrison`)
  reads:      invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in
              defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  invasionRowSituation(walls, garrison, militia) === walls, professional garrison
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading, so every pool
              that selects a row of `INVASION_ROW_POOL` shares ONE echo key: a mount counted
              there may be a sibling ROW of the same table
  covert:     no
  source:     muster · standing LICENSED
  may claim:  that the reader `invasionRowSituation(walls, garrison, militia)` selects the row
              `walls, professional garrison` of `INVASION_ROW_POOL` in `defenseStateProse.js`,
              as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a
              dated cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b),
              another civic object of the class `force`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character
              and that character's fate; a theological claim about a deity
```

⚠ **Two card lines are narrower or looser than the code, and the writer should know both.**

1. **`source: muster` is one holder and the record behind it is nearly empty.** Both halves of this key — the wall and the men — file under the MUSTER (`src/domain/prose/holderTable.js:188` walls, `:189` garrison). But the holder table's own note on the muster kind reads: *ONE institution in the whole shipped roster keeps a muster: the Citizen militia* (`holderTable.js:279-288`), and it names a town with a garrison and no militia as **the sharpest wiring debt the table found** — men under arms and no roll of them. This key **does not read militia at all** (see §0.5), so the pool fires across exactly that debt. It is a wiring row for the chair, not a wording row. It matters to the writer in this: the men are on the ground and are not necessarily on any paper.
2. **`angle: ledger street visitor` is the pool's set, but the ORDER in the corpus is ledger, visitor, street** — vid 2 is the `[visitor]`, vid 3 the `[street]`. Rewrite one for one against the vids below, never against the card's alphabetical list.

### 0.2 The block's header lines (annex lines 2568 to 2593, the parts that bind this pool)

- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`) rendered beside the prose, read against `config.monsterThreat`, the institution presence flags and `compound.inst`. **This pool is row 2's `walls, professional garrison` branch**, and row 2's badge is `scoreBand(scores.military)`.
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`. In this pool vids 1 and 2 carry `{settlement}` only and vid 3 carries none.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE (the block's own, quoted in substance):** the `buildThreatAssessment` lattice is dossier-native and this shape EXTENDS it rather than replacing it; the corpus's job is that each branch currently holds exactly ONE string, so every settlement in a branch says the same words. Two standing defects must not be reintroduced: the `plagued`+nothing branch's lowercase sentence lead, and a presence check on `institutions.walls` in place of the predicate. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses (walls without people cannot be held) and never HISTORICAL ones (walls built after a siege)** unless the history surface supplies the ancestry. It does not here.
- **Composition fences:** a SPINE, sentence form, no relation and no attach set, ONE spine mount on the defense tab and zero modifier mounts today. The spine is therefore FIRST in its composed unit and chooses nothing that follows it. The echo key is the whole table rung, so a mount counted against this pool may be a SIBLING ROW of `INVASION_ROW_POOL` (one of the other five situations) and never a second print of this one.
- **⭐ THE PAGE FACT NO OTHER PACKET NEEDS.** All five of DS-DEF-2's composed lines render in ONE stacked block above the five expandable rows (`DefenseTab.jsx:113-114` builds `threatLines` in the order beasts, invasion, internal, economic, disaster; `:316-320` renders them as adjacent paragraphs in a single bordered `<div>`). **This pool's sentence is the SECOND paragraph, and the paragraph above it is the Beasts row's.** The five are not composed together — each is its own unit — but the reader meets them as five consecutive sentences about one town's defences. A face here that re-states the wall in the same words the beasts line above it just used is a page-grain collapse no pool-grain gate can see.

### 0.3 The register card's six one-line registers (the dossier line is this pool's)

- The dossier: the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges; every answerable plant answered, and some left open.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing, the label as the only emphasis.

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim (Part B §22: the counts only rise; a face that fails the gate stays in the annex as a refusal row with its measurement). An unweighted seeded roll picks the face at render, so every face must stand alone. The exemplar, not the practical. No em dash, no exclamation mark, no digit or percent in a connective, no which-clause. The clerk who was there, compiling from records, citing a holder only where the card licenses a source and the move budget allows.

**THE THREAD (MOVE-GRAMMAR §1.4.1).** This pool is a SPINE and sits first in its own unit. Every face must hand a noun forward that a later modifier could pick up (the wall, the gate, the men, the wage, the roll) and must close on a standing fact rather than a set-up. There are zero modifier mounts on this pool today, so no sibling text is guaranteed to follow; the face must read as a complete unit alone AND as an opener.

**THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Do not trade density for plainness.

**THE PROVENANCE MOVE AND THE TWO-SENTENCE WALL.** S2 permits ONE computed consequence of a sentence's own fact to ride as a clause, with one joint, a comma and a word from the connectives list, never "which". Every other second fact takes its own sentence, and a variant is one or two sentences (A1). Vid 1 ships as one long sentence with a semicolon and a which-clause; vid 2 as one sentence with a parenthesis; vid 3 as one sentence with a comma joint.

### 0.5 ⭐ THE READS THIS POOL REACHES, resolved — MATERIAL A WRITER MAY USE, never a bound on what may be written

The predicate is one function of three inputs, and it **returns before it looks at the third** (`src/domain/display/stateProse/defenseStateProse.js:476-484`):

```
function invasionRowSituation(walls, garrison, militia) {
  if (walls) {
    if (garrison) return 'walls, professional garrison';
    return militia ? 'walls, citizen militia' : 'walls, no force';
  }
  ...
}
```

The function's own documented intent at `:469-472`: *A GARRISON OUTRANKS A MILITIA … the corpus distinguishes the two forces and a town holding both is defended by the professionals, so `garrison` is read before `militia` on both sides of the wall.* The three arguments are derived at the call site from the LIVE roster, never the frozen snapshot (`:624-627`, `standingDefenseForces(settlement)`).

| read | what it holds on this key | holder | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|---|
| `standingDefenseForces(settlement).walls.present` === true | at least one STANDING member of the walls bucket is on the town's LIVE roster. The bucket keywords are `wall` · `citadel` · `palisade` · `earthwork` · `inner citadel` · `massive walls` (`defenseInstitutionBuckets.js:84-89`), matched as SUBSTRINGS over the institution's native semantic name; the projection reads `liveInstitutions(settlement)`, so a ruined wall is not counted (`:169-182`) | the MUSTER (`holderTable.js:188`) | a perimeter work stands, by its ROSTER NAME and its own catalogue description; it is standing TODAY, ruin-filtered | **the WORD.** A `Citadel` is inner and `Gates (if walled)` is a point: neither is a line around the town (F1-07). The row's own printed description fixes the material: `Palisade` = a ring of sharpened stakes; `Palisade or earthworks` = a wooden palisade or an earthen bank; `Town walls` = stone walls and gates ringing a town; `City walls and gates` = masonry with towers and gatehouses; `Massive walls and fortifications` = layered rings with an inner keep (`institutionVocabulary.js:155`, `:157`, `:162`, `:166`, `:278`) — F1-32 |
| `standingDefenseForces(settlement).garrison.present` === true | at least one STANDING member of the garrison bucket. The keywords are **`garrison` · `barracks` · `professional guard` · `professional city watch` · `multiple garrison`** (`defenseInstitutionBuckets.js:88-91`) | the MUSTER (`holderTable.js:189`) | a paid, standing force is on the roll. R-3 of the contradiction table settles the word outright: **"the garrison" is lawful wherever the garrison bucket resolves, Barracks included** | **the KIND, on part of the range.** The bucket's members are not one thing. `Garrison` = "Professional soldiers. Noble or royal." (`institutionalCatalog.js:1925-1930`; vocabulary `:164` "kept under a noble or royal banner, stationed to hold a place against real armies"). `Professional city watch` = "Full-time law enforcement. ~1% of population." (`:1918-1923`) — police, not an army, and the SAME row sits in the watch bucket (`defenseInstitutionBuckets.js:90`). `Barracks` = "Housing for guards or small garrison" (`:1363-1368`; vocabulary `:160`) — a BUILDING. `Multiple garrisons` = soldiers in separate quarters (`:2355-2361`). **Calling them soldiers where the row is a watch or a barracks is F1-32's shape on a force row; the safe generic is the key's own — professionals, a paid force, men on the town's books** |
| `standingDefenseForces(settlement).militia.present` | **NOT CONSULTED ON THIS KEY.** The branch returns `walls, professional garrison` before it reads `militia`, by the function's own documented intent | the MUSTER (`holderTable.js:190`) | nothing. **This is the single most important line in the packet after the muster-roll note.** The pool fires with a militia and without one | **any citizen-body claim.** `Citizen militia` carries `exclusiveGroup: 'civilianDefense'` and "Present only when no professional watch exists" (`institutionalCatalog.js:1340-1347`), so on much of this key's range there is no militia at all — and the muster ROLL, whose only keeper is the `Citizen militia` row (`holderTable.js:279-288`), does not exist to be cited |

**The reads the desk performs and this key does NOT reach, listed so the writer knows the page around the sentence:**

- `scoreBand(scores.military)` renders the badge beside this very prose (`DefenseTab.jsx:322-341`; `defenseScoreBands.js:37-39`: STRONG ≥ 65, ADEQUATE ≥ 40, WEAK ≥ 20, CRITICAL below). It is computed from different inputs than the key — walls +30, garrison +28, militia +10, watch +7, mercenary +14, charter +10, arcane deterrence, a terrain multiplier of 1.00 to 1.28, then the upkeep gate (`defenseGenerator.js:157-193`) — so a walled, garrisoned town can print **ADEQUATE or lower**. §1.4 **W-10** rules this an INSTRUMENT row: the card must print the band spread over the key's domain before any intensity word here is refutable either way.
- **The funding note prints in plain English under this exact row when the gate bites:** `Upkeep underfunded: garrison pay at 60%` (`defenseDisplay.js:278-284`, `:317-321`; the row's gate key is `military` and its expense word is literally `garrison pay`). The writer does not state the figure, but should know the page can say the wages are short directly beneath the sentence.
- `config.monsterThreat` — **unread by this key.** The same face prints on a `plagued`, a `frontier` and a `settled` town, and the Beasts line one paragraph above it says which.
- `config.stressTypes` — read by NO key function of this block. `economicState.foodSecurity` — unread. `history` — unread by every state-prose pool key in the estate (F2-09).

### 0.6 The provenance move, priced for this pool

The card licenses a citation of the muster where the budget allows. The ceiling is ONE per unit (Part B §24) and only for one of S3's three reasons: two accounts that disagree; a count from an interested party; a record whose keeper is a power. **None obtains, and one of them is worse than absent here.** The wall and the men are two facts of one holder, not two accounts of one fact; no count is stated; and the muster kind's only roster-backed keeper is the `Citizen militia`, which this key does not consult and which much of its range does not carry — so a cited muster ROLL on this pool is F1-24 (a record cited to a keeper the card cannot resolve) wherever no militia stands. The exemplar registers with raw text cite at zero per 786 sentences. **Recommendation: zero citations in this pool.** A13's blanket citation ban is struck and the record-word bar W24 is struck entire, so the `[ledger]` face may reach freely for accounts, returns, duties, wages, the entry, the books; that is vocabulary, not a citation, and it is free. **"The muster" as the class word is free everywhere** (F1-03's own rider).

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}`

### 1.1 The shipped sentence, verbatim

> {settlement} has a line and professionals to hold it, which is real deterrence against raiding and against a conventional assault; it is not a posture rated for a long siege without stores behind it.

### 1.2 Every claim it makes, on the new test

- **The town has a LINE — a continuous perimeter.** — **CONTRADICTED on part of the key's range.** `Citadel` is an inner fortress and `Gates (if walled)` is a point; neither is a line around the town, and both sit in the walls bucket (`src/domain/institutions/defenseInstitutionBuckets.js:84-89`, `:169-182`). **Row F1-07.** The record is the roster row, which DS-DEF-5 prints on the same desk. The safe generic is *the works*, *the defences*, or the recorded name; the specific words (stakes, an earth bank, masonry, a gatehouse, an inner keep) are free wherever the face does not fix a material the row denies.
- **There are PROFESSIONALS, and they are the town's own.** — **SAFE.** `garrison.present` is true by the predicate, and **R-3 of the contradiction table settles the word outright**: "the garrison" is lawful wherever the bucket resolves, `Barracks` included. The key's own name is `professional garrison` and the engine's own assessment line on this exact branch reads *Walls and professional garrison provide meaningful deterrence* (`src/domain/display/threatAssessment.js:118-119`), rendered in the expandable row below the prose.
- **Those professionals are SOLDIERS in the ordinary sense.** — **CONTRADICTED on part of the range**, and this is the claim the shipped row gets away with only because it declines to name them. The bucket admits `Professional city watch` — "Full-time law enforcement. ~1% of population." (`src/data/institutionalCatalog.js:1918-1923`), a row that also sits in the WATCH bucket — and `Barracks`, which is housing (`:1363-1368`). Where the standing member is one of those, the row's own printed description denies soldiery exactly as **F1-32** denies a material, and **F1-27** denies calling a watch soldiers. The record is the roster row. The safe words are the key's own: professionals, a paid force, men kept on the town's books.
- **The professionals HOLD the line — the two are paired, and the second mans the first.** — **SAFE.** No field denies the pairing and the engine asserts it twice: the assessment branch names them together, and `safetyProfile.js:273` prints *Walls and controlled entry points reinforce the guard's ability to monitor movement* on a garrisoned walled town. ⚠ But see the mobilization row in §1.4: at posture `deployed` the engine's own reason string is **"army committed in the field"** (`src/domain/worldPulse/mobilization.js:306-315`) and `mobilizationStatus.js:29` phrases it *army in the field*. A face that puts the men bodily ON the wall is false on that slice of the range; a face that says the town KEEPS them is not.
- **This is REAL DETERRENCE against raiding and against a conventional assault.** — **SAFE, and it is floor 4's own model.** `stressGenerator.js:118-125`: on an `under_siege` or `monster_pressure` roll, `hasWalls` multiplies the probability by **0.6** and a military body by **0.7**. Deterrence is literally what the engine computes. ⚠ The same lines are the bar on the next claim up: the multipliers never reach zero, so a totality (*cannot be taken*, *nobody would try it*) is **F1-34**'s shape and is denied by the very model that licenses the deterrence.
- **An INTENSITY on the deterrence ("real").** — **HELD, not a finding either way.** The badge beside this prose is `scoreBand(scores.military)` (`DefenseTab.jsx:322-341`), computed from different inputs than the key (`defenseGenerator.js:157-193`), so it can read ADEQUATE or WEAK beside a face that says *real*. §1.4 **W-10** rules this an INSTRUMENT row: the card must print the band spread over the key's domain before any intensity word on this pool is refutable. The writer should prefer an intensity that comes from the ARRANGEMENT — two things that work together — rather than from a grade.
- **It is NOT A POSTURE RATED for a long siege.** — **FLOOR-2**, on two grounds, and this is the variant's central fault. (a) It is **a prediction the pulse adjudicates**: `stressGenerator.js:118-125` rolls `under_siege` and `warStatus.js` / `warDeployment.js` run it, so the outcome of a siege that has not happened is the simulation's to decide and not the record's to state. It is the same shape the block's own contradiction set names as still false in the sibling row — *takes this town with ladders and patience* — turned the other way round. (b) **The card prints `may NOT: a prediction the pulse adjudicates`** in terms.
- **WITHOUT STORES BEHIND IT — a condition on the town's provisioning.** — **FLOOR-2 (a dependency on a field the pool key cannot see), row F2-09.** Stores are `economicState.foodSecurity` and the granary flag, which no key function of this block reads. The sentence is conditional rather than assertive, which is why it survived the old law; but it invites the reader to supply an absence, and the Disasters row four paragraphs down can print a `Secure` town with a full `Town granary`. **The record is the food surfaces.** If the writer wants siege endurance in a face, the licensed form is what the walls and the men ARE, not what a siege would do to them.
- **A RATING of the posture ("rated for").** — rides on the claim above and falls with it. The record does carry a rating for this row — the badge — and it grades readiness, never siege endurance, so a rating word here is borrowing an instrument that measures something else (**F1-40**'s shape; held under W-10).

### 1.3 The reads this pool reaches (material for the rewrite of vid 1)

- `walls.present`: a standing perimeter work, by its roster name or by a generic the row does not deny; ruin-filtered, standing today.
- `garrison.present`: a paid standing force, by the key's own word. The vocabulary rows behind it are the richest material in this packet — a noble or royal banner, quarters where the armed hand of the settlement sleeps and eats, soldiers distributed across quarters because no single barracks holds a city.
- The key's own pairing: the two together, which is the pool's whole discriminating claim.
- Floor 4's positive model, free to use as a fact about the arrangement rather than as a number: walls and a force both **lower** what comes at the town, and neither lowers it to nothing.
- The purse, named in the engine's own English: one multiplier over *garrison wages, wall maintenance* together (`defenseGenerator.js:182`, `:189-192`), and a note printed under this row reading *garrison pay* when it bites.
- The whole record vocabulary, struck free by the recut (W24 entire): accounts, returns, duties, wages, the entry, the books, the writ, a licence. The `[ledger]` stance may cite its own record.
- NOT reached and deliberately unread: the militia, the monster country, the stress roster, the food stores, the other four arms' bands, the history.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE

**Contradiction-table rows this pool's key can actually walk into:**

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **F1-07** | a LINE, a circuit, a perimeter, a ring, walls — where the standing member is a `Citadel` (inner) or `Gates (if walled)` (a point) | `defenseInstitutionBuckets.js:84-89`, `:169-182`; DS-DEF-5 prints the works on the same desk |
| **F1-32** | a wall MATERIAL the row's own printed description fixes otherwise — stone on a palisade town, timber on a masonry city | `institutionVocabulary.js:155`, `:157`, `:162`, `:278`. `Citadel`, `Gates (if walled)` and `Massive walls and fortifications` fix nothing and are free |
| **F1-33** | a material SOURCE ("cut from its own woods", "the stone of the country") where a fortification chain runs | `supplyChainData.js:873-884` feeds every wall row `rawInputs: ['Quarried stone','Building materials']`. Where no chain is instantiated the source is free |
| **F1-27** | the garrison-bucket force called soldiers, an army, or a professional body of arms where the standing member is `Professional city watch` (full-time law enforcement) or `Barracks` (housing) | `institutionalCatalog.js:1918-1923`, `:1363-1368`; `institutionVocabulary.js:160`. ⚠ R-3 keeps the WORD "the garrison" lawful everywhere on this key; the KIND is what the row fixes |
| **F1-29** | at city, a WATCH and a GARRISON contrasted as two distinct bodies ("the garrison relieves the watch") | `Professional city watch` is ONE row sitting in BOTH buckets (`defenseInstitutionBuckets.js:88-91`, `:90`) and `deriveArmedForces` dedupes by name (`defenseDisplay.js:334-335`). Either word is fine; the contrast is not |
| **F1-03** | a MILITIA as a standing body, or a muster ROLL cited as a record | the key never reads `militia`; `Citizen militia` is `exclusiveGroup: 'civilianDefense'`, present only where no professional watch exists (`institutionalCatalog.js:1340-1347`), and is the ONLY roster institution that keeps a muster (`holderTable.js:279-288`). **"The muster" as the class word is free everywhere** |
| **F1-24** | a record cited to a keeper the card cannot resolve — a muster roll on a town with a garrison and no militia | `holderTable.js:279-288`; `composedWalker.js:1071-1073`. The record WORDS are free (W24 struck); the CITATION needs the holder |
| **F1-26** | a militia AND a watch as two standing bodies | `exclusiveGroup: 'civilianDefense'` (`institutionalCatalog.js:1340-1354`) |
| **F1-121** | "the garrison" bare where an OCCUPIER's force is on the page | the occupation record is `{occupierId, state, resistance}` with no garrison field (`occupationStatus.js:74-103`); `hasGarrison` is the town's OWN roster row. Costs one possessive |
| **F1-25** | the NEGATION direction — "no soldiers of its own", "nobody to hold it", "no meaningful guard" — on a town the roster garrisons | the same flags read the other way; at CITY tier `Garrison` is `required: true` (`institutionalCatalog.js:1925-1930`) — **F1-28** |
| **F1-31** | naming a TIER the identity strip does not print | `{r.tier}` prints verbatim beside the name and population, `OverviewTab.jsx:247`. Write around the tier word or use the town's own |
| **F1-34** | a TOTALITY — "nothing takes this town", "no army would try it", "safe from anything" | `stressGenerator.js:118-125`: walls ×0.6 and a military body ×0.7 on the siege roll, **never to zero**; `threatAssessment.js:113-130` builds this row for EVERY town. Ease at the town's own grain is free |
| **F1-40** | outrunning the readiness BADGE, or borrowing another arm's | `defenseGenerator.js:487-522`; `defenseScoreBands.js:37-39`. ⚠ **W-10**: this pool's key and the badge are computed from DIFFERENT inputs, so an intensity word here is INSTRUMENT-HELD and not yet refutable either way |
| **F1-79** | walls treated as a precondition of a siege, or "nothing moves through the gates" on a besieged port | `stressGenerator.js:118-123` — walls are a PROBABILITY MODIFIER; `computeActiveChains.js:756-761` — the port lifeline |
| **F1-83** | the men shown standing on the works where the posture reads `deployed`; or `alert` read as "the muster has begun" | `mobilization.js:306-315` ("army committed in the field"); `mobilizationStatus.js:29`, `:50-69`. **Write the empty town with its men gone** |
| **F1-102** | the country's approach or terrain named against the config — a pass on a `road` town, a harbour inland | `config.tradeRouteAccess` / `terrainType` printed on the overview; `terrainHelpers.js:24` |
| **F1-107** | one band denying another printed on the same screen | the printed band, whichever it is — here the row's own badge and the four beside it |
| **F1-126** | a minted PROPER NAME borne by the face (a captain, a lane, a gate's name, a family) | a pooled face is authored once and drawn by every town whose key matches, so the name prints identically across a region. The NPC roster and the `{npc}` slots are the name authority; this pool has neither |
| **F2-01** | ANY magnitude, in a digit or in a word: **a garrison's size**, a headcount, a number on the gate, a wage, a share of the purse, a length of wall | the band vocabularies are closed; F2-01 names a garrison's size in terms. A headcount is additionally DS-DEF-5's cell |
| **F2-02 / F2-03 / F2-05 / F2-07 / F2-08** | a date, a season, a duration, a founding or a raising narrated, an elapsed course ("has held", "still", "no longer", "again", "thinner than it was"), an age of fabric against the printed age, a trend | `history.age` is frozen at birth and rerollable (`ConfigurationPanel.jsx:419-431`); `ageBands.js` pins `HISTORICIZE_BAND = 'years-past'`. ⚠ age-FLAVOUR is free where it does not contradict the printed age — *older work than the arrangement that pays for it* is lawful |
| **F2-06** | a RATE — "most nights", "seldom closed", "more often than not" | nothing bands a rate anywhere in the engine. *The gate stands open* is lawful; the rate form is not |
| **F2-09** | a dependency on a field the key cannot see — the STORES, the granary, the food label, the monster country, the stress banner, the history | no key function of this block reads any of them |
| **F3-05** | cultural furniture the town's own culture profile denies — thatch, hearth-smoke, a churchyard, a market green, snow on the road, on an `arabic`, `east_asian`, `mesoamerican`, `south_asian` or `steppe` profile | `cultureProfiles.js:50-600`, rendered at `dailyLifeLogic.js:14`. **The product is setting-agnostic and no defense pool reads the profile.** The recut names this the finding most likely to recur in every block |
| **F3-06** | an UNNAMED person's act on an office the tier emits as a NAMED NPC — "the one who keeps the gate key", "the officer who signs for the wages" | `TIER_MANDATORY_ROLES` emits exactly ONE **Guard Captain** per village-plus, each with a generated personality, disposition and secret (`npcGenerator.js:1511-1537`, `:117-149`). **On a garrison pool this is the sharpest person trap in the estate.** Use a plural, a trade, a bystander, or an office the roster does not seat |
| **F4-01** | a rotting, weathering or eroding wall — **and equally, the PERMANENCE of any institution row** | no material decay clock exists; and `calamityKernel.js:96-151`, `:251`, `:259-275` DEMOTES built fabric along `City walls and gates` → `Town walls` → `Palisade or earthworks` and stamps `status:'ruined'` |
| **F4-02** | TWO PURSES SPLIT — the wall kept and the men not; the wall paying for itself; the works maintained while the wages lapse | ONE multiplier `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)` over **"garrison wages, wall maintenance"** together (`defenseGenerator.js:182`, `:189-192`). ⚠ **This pool holds both halves of that purse in one sentence, which makes it the single most inviting F4-02 site on the desk** |
| **F4-03** | splitting the DIRECTION of the four gates — the men paid while the gaol starves, patrols provisioned while the wall is not | all four are `min(1, floor + econOutput/50 × (1−floor))` on ONE input: military 0.6, monster 0.7, internal 0.65, disaster 0.55. They differ in degree only |
| **F4-04** | a TOTAL collapse of pay — "nothing has been paid", "there is nobody left to pay" | every gate has a floor and `communityMilBase` is exempt (`defenseGenerator.js:186-192`). The licensed extreme is short, late, thin — never none. **Men drifting off slowly IS the model's own word** (`:186-187`, "unpaid soldiers desert slowly") and is no longer barred (R-9) — but a HEADCOUNT is DS-DEF-5's cell and F2-01 |
| **F4-06** | the readiness band explained by the works | `defenseGenerator.js:510` — the band moves on tier and country while every wall and roster row is unchanged; `:491` gives a bonus for being cheap to defend |
| **F4-07** | the river or the coast doing nothing for the town's defence | `defenseGenerator.js:129-135` — riverside and coastal carry a small POSITIVE multiplier, as do hills, forest and mountain (1.06 to 1.28) |
| **F4-19** | the pay gate not reaching the watch | `defenseGenerator.js:177-178`, `:189-191`; `fieldSynonyms.js:51`, `:244-253`. **The watch arms BOTH purses** |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** Five rosters are closed, and a body, building, record-keeper, force or faith-house they do not carry may not be asserted: the institution roster over the LIVE roster (`institutionRoster.js`, `liveInstitutions`); **the force buckets — `garrison`, `militia`, `watch`, `mercenary`, `charter`, plus `magicDef`** (`defenseInstitutionBuckets.js:84-107`); the faction list; the faith entries; the NPC office roster. Everything else is silence, and silence is permission. In particular: the walls bucket's closed keyword set is `wall · citadel · palisade · earthwork · inner citadel · massive walls`, and the garrison bucket's is `garrison · barracks · professional guard · professional city watch · multiple garrison`. A perimeter thing or an armed body outside those sets is not on this town's roll — **except** where a custom row's native semantic name contains one of the keywords, which seats it at any tier (F1-30, R-6: the test is the FLAG on THIS town, never the tier).

**Not a faith pool.** The deity's four axes, the DERIVED temper (`deityTemper()`, never the inert stored `temperamentAxis`), the PANTHEON rank, the SETTLEMENT standing and the `suppressed` flag do not arise here and no face may reach for them.

### 1.5 ⭐ THE PREIMAGE — the range of towns this key selects

`walls, professional garrison` fires on **every town whose live roster carries at least one walls-bucket member AND at least one garrison-bucket member**, and on NOTHING ELSE about the town. That is:

- **Every tier the two buckets can both seat, and by a custom row any tier at all.** The garrison bucket seats at town by a `Barracks` (`baseChance: 0.3`), at city by `Garrison` and `Professional city watch` (both `required: true`), and at metropolis by `Multiple garrisons`; the walls bucket seats from thorp upward by a `Palisade`. A thorp with a DM-added rampart and a DM-added barracks reads this same pool.
- **With a militia and without one.** The branch returns before it reads `militia` (`defenseStateProse.js:477-479`). So this pool covers the case the holder table calls its sharpest wiring debt: **men under arms and no roll of them.**
- **Every monster country.** `config.monsterThreat` is unread here. The same sentence prints on a `plagued`, a `frontier` and a `settled` town, one paragraph below the Beasts line that says which.
- **Every stress state.** No key function of this block reads `config.stressTypes`. This pool prints under `under_siege`, `occupied`, `wartime`, `war_pressure`, `insurgency`, `famine` and `plague_onset`, each of which renders its own banner on the same dossier. **A face about deterrence prints while the town is actually under siege, and while an occupier holds it** — and under an occupation the town's own bodies continue under oversight (`stressTypes.js:38-39`), so both forces can be on one page.
- **Every mobilization posture, including `deployed`** — the army committed in the field, with the roster row still standing.
- **Every route, terrain, culture profile, prosperity rung, population band and safety label**, none of which the key reads. The safety panel on a garrisoned town can print *The garrison patrols the main paths*, *The garrison is overwhelmed or corrupt*, or *The garrison is a formality: present on paper, absent in practice* (`safetyProfile.js:288`, `:296`, `:306`).
- **Both clocks.** DS-DEF-2's box is two clocks inside one `<div>`: rows 1 and 2 are live, rows 3 to 5 the generation-time snapshot (`DefenseTab.jsx:317-321`, §1.4 W-11). **This row is a LIVE one**, and the frozen `threatAssessment` prose in the expandable panel beneath it is not.

A face must contradict no state in that range, not merely the town on this skeleton.

### 1.6 The angle's stance in one sentence

`[ledger]` is the clerk's view — what the books, rolls, counts and duties show — so here it may enter the wall and the men as two standing charges on one account, in the office's own record vocabulary, and it may NOT price the purse, count the men, date the entry, rate the posture from an instrument that measures something else, or state what a siege would do.

### 1.7 The turns worth keeping

- *a line and professionals to hold it* — the PAIRING in six words is the pool's whole claim and the shipped row's best asset. Keep the pairing in every face; the noun *line* must go where the roster row denies it, and *professionals* is the safe generic to keep.
- *real deterrence against raiding and against a conventional assault* — the CLAIM is floor 4's own model and is worth carrying; the two-item list is the engine's own phrasing from `threatAssessment.js:118-119` and a face that repeats it near-verbatim is DULL against a panel the reader can open on the same row.
- The *it is not* turn — a qualification that declines the larger claim — is exactly the register's "carry two accounts and settle neither". Keep the MOVE; change what is declined, because a siege prediction is floor 2.
- ⛔ *which is real deterrence* is a WHICH-CLAUSE and is barred outright by the owner's rules. The semicolon joint is lawful and rationed; keep at most one face on it so the pool does not collapse onto one punctuation.

### 1.8 ⭐ WHERE THE FLAVOUR IS (vid 1)

- **The men are not the town's men, and the catalogue says so in one line nobody has used.** `Garrison` reads *Professional soldiers kept under a noble or royal banner, stationed to hold a place against real armies* (`institutionVocabulary.js:164`; catalogue desc `institutionalCatalog.js:1927`). The force standing on this town's wall answers somewhere else. That is not a cause a face may assert and it is not a history; it is a STANDING arrangement, and it is the single richest unused fact in the pool. What it looks like on the ground: a banner that is not the town's over a gate the town built; wages entered against a name the town does not choose; an order of precedence at the gate that the town did not set. The `[ledger]` angle owns this, because the ledger is exactly where an outside banner and a local wall meet on one page.
- **The purse is ONE purse and it has a printed English name.** `garrison wages, wall maintenance` ride the same multiplier (`defenseGenerator.js:182`, `:189-192`) and the row prints *Upkeep underfunded: garrison pay at 60%* beneath the prose when it bites (`defenseDisplay.js:280`, `:320`). So the wall and the men are a single recurring charge, and the clerk's true subject is a line item that pays for a thing and the people to stand on it in one stroke — never two entries, never one kept and one dropped. The licensed extreme is short, late or thin, and slow drift off the strength is the model's own word.
- **The record has the men and not their names, and that absence is a standing condition.** One institution in the whole roster keeps a muster, and it is the `Citizen militia` — which this key does not consult and much of its range does not carry (`holderTable.js:279-288`). So on a great many of these towns the clerk's own books hold a wall, a wage and no roll of who draws it. *A date closes a question; a standing condition opens one* — and a paid force with no list of itself is a question the whole `[ledger]` angle was built to open. Nothing in the record denies it, and the record is where the gap lives.
- **The recut handed back the whole record vocabulary and the unnamed office who keeps it.** W24 is struck entire and W22's person bar is struck by name: an UNNAMED person may appear, act, keep a key, chase, refuse, be avoided, be resented. A collector who enters the same two charges every quarter, a reeve slow with the returns, a clerk who copies the entry forward because it was copied forward — all licensed hooks. ⚠ **The one bar that survives is F3-06**: not the Guard Captain, and not "the officer who signs for the wages", because the tier seats exactly one of him with a generated disposition on the NPC tab.

### 1.9 What would make the rewrite of vid 1 a regression

Vid 1 not first, or not `[ledger]`, or its slot set not `{settlement}` alone, or fewer than four faces, or no longer the pool's canonical index-zero line. Any face that loses the PAIRING — a work and a paid force together — because that is the pool's discriminating claim and without it a face is claim-identical to `walls with NO force`'s or to `force with NO walls`'s. Any face carrying the siege prediction or the stores condition in any spelling. A face that fixes a material or a shape the roster row denies, or that calls the garrison-bucket force soldiers where the row is a watch or a barracks. A face carrying a which-clause, an em dash, a digit, a count, a date or a rate. A face that splits the purse, reverses the gates' direction, asserts a total non-payment, or states a headcount. A face that mints a proper name or puts an act on the tier's one Guard Captain. A face that opens on the `{settlement}` proper slot where a sibling already does (order constraint 10) or closes on a set-up rather than a standing fact.

---
