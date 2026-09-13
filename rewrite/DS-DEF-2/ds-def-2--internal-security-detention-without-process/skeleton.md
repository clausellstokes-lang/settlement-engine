Seat: MARKER (opus), DS-DEF-2 · pool `Internal Security: detention without process` · the skeleton the writer drafts from; nothing here is a face.

# DS-DEF-2 · `Internal Security: detention without process` · SKELETON

Three shipped variants, vids 1 to 3, angles `[ledger]` `[visitor]` `[street]` in that order. The rows are the annex's at the dock tip (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, the bold pool line at 2670 and the three numbered rows at 2671 to 2673), and the generated leaf carries the same three texts with the same vids, angles and slot sets (`src/data/dossierStateProse/defense.generated.js:748-772`; the manifest row at `:1258-1272` reads `role: spine`, `variantCount: 3`, `faceCounts: [1,1,1]`, `vids: [1,2,3]`, `readsCount: 2`, `attach: []`). **THE SLOT SETS ARE UNIFORM: all three vids carry `{settlement}` and nothing else.** A face's slot set must equal its parent's (ARCH §2.5's face-row refusals), so every face of every vid names the town exactly through `{settlement}`. The writer rewrites these three, one for one, and gives each its four `[face]` sub-rows.

**THE TEST THIS PACKET IS MARKED UNDER (ADDENDUM 14, the owner 2026-09-12).** A face is LAWFUL unless it CONTRADICTS the record. Silence is permission. "The card does not license it" is not a finding and the tag `unlicensed` does not appear anywhere below. Claims are tagged SAFE, CONTRADICTED (with the field, file and line, and which of the two is the record) or FLOOR-2.

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock (`node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: detention without process'`)

```
LICENCE (block DS-DEF-2 · role spine · key `Internal Security: detention without process`)
  reads:      court   (not-produced)
              prison   (not-produced)
              (absent => no candidate; a modifier is silent, never "false")
  predicate:  (none recovered: the pool has no key-function branch)
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)   <- a spine IS the seat and carries no relation
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) - modifier mounts 0 (none)
              the echo table is keyed on the PRODUCER-TOKEN ROOT `court`, which is coarser than
              this pool's own read `court`: a mount counted there may be reading a sibling field
  covert:     no
  source:     (none) - standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  THE TEST (ADDENDUM 14, the owner 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. "The card does not license it" is NOT a finding.
              This card says what the read REACHES, never the bounds of what may be written.
  may claim:  that `court` holds, as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated
              cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b)
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null
              everywhere); a named character and that character's fate (product scope); a
              theological claim about a deity (the deity doctrine)
```

### 0.1a ⛔⛔ THE CARD IS WRONG ON THIS ONE POOL, AND THE WRITER MUST NOT BELIEVE ITS `may claim` LINE

The card prints `predicate: (none recovered)` and then a `may claim` line reading *that `court` holds, as a STANDING fact of the record*. **The key fires where `court` is FALSE.** The card's `may claim` line fell back to the block's first read because the predicate recovery failed; its siblings print the predicate correctly (`court truthy` for `court without detention`, `court truthy AND prison truthy` for `full legal chain`) and carry a fifth `may NOT` clause (`another civic object of the class law`) that this card also drops.

**Why it failed, exactly.** The census recovers this row on rung 1 from the guarded branches of `internalRowPoolKey` (`src/domain/display/stateProse/defenseStateProse.js:506-510`). The first two pools return from `if` guards at `:507` and `:508` and recover. **This pool's key is returned from the ternary at `:509`** — `return prison ? 'Internal Security: detention without process' : 'Internal Security: no legal infrastructure';` — which the recovery does not read as a branch, so it prints "no key-function branch". The leaf's own docblock at `:495-505` declares this row deliberately untabled and names `["court","prison"]` as its real read set.

**THE PREDICATE, READ OFF THE CODE AND ASSERTED HERE:**

```
'Internal Security: detention without process'  IFF  court === false  AND  prison === true
```

where `court = civicFlag(compound.hasCourtSystem)` and `prison = civicFlag(compound.hasPrison)` at the call site (`defenseStateProse.js:657-659`), and `civicFlag(v)` is strict `v === true` (`:309-311`). **The pool's whole discriminating claim is the CONJUNCTION: a place to hold people, and no court.** A face that carries only one half has spent the pool key.

This is an INSTRUMENT row for the chair, not a writer's problem once it is stated: the card generator should recover a ternary return, and the `may claim` line should never fall back to a read when no predicate is recovered — a wrong polarity is worse than a blank.

### 0.2 The block's header lines (annex 2568 to 2593, the parts that bind this pool)

- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`) rendered beside the prose, read against `config.monsterThreat`, the institution presence flags and `compound.inst`. **This pool is row 3's `prison, no court` branch**, and row 3's badge is `scoreBand(scores.internal)`.
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`. In this pool all three vids carry `{settlement}` only.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE (the block's own, in substance):** the `buildThreatAssessment` lattice is dossier-native and this shape EXTENDS it rather than replacing it; each branch currently holds exactly ONE string, so every settlement in a branch says the same words. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses (a gaol without a court cannot produce a judgment) and never HISTORICAL ones (a court that closed, a gaol that was built after something)** unless the history surface supplies the ancestry. It does not here — no state-prose pool key in the estate reads a history field.
- **Composition fences:** a SPINE, sentence form, no relation and no attach set, ONE spine mount on the defense tab and ZERO modifier mounts today. The spine is FIRST in its composed unit and chooses nothing that follows it; today nothing follows it. The echo key is the producer-token root `court`, coarser than this pool's read, so a mount counted against it may be a SIBLING pool of `internalRowPoolKey`.
- **⭐ THE PAGE FACT THIS PACKET TURNS ON.** All five of DS-DEF-2's composed lines render in ONE stacked block above the five expandable rows (`DefenseTab.jsx:113-114` builds `threatLines` in the order beasts, invasion, internal, economic, disaster; `:316-321` renders them as adjacent paragraphs inside a single bordered `<div>`, the first at `FS.sm` and the rest at `FS.xs`). **This pool's sentence is the THIRD paragraph.** The two paragraphs above it are the beasts row and the invasion row, and both are about the country, the wall and the armed hand. **So this line is the passage's turn INWARD** — from what comes at the town to what the town does to its own people. A face that opens on the wall, the country, the gate or a force is repeating the two paragraphs above it, at a grain no pool-level gate can see.

### 0.3 The register card's six one-line registers (the dossier line is this pool's)

- The dossier: the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges; every answerable plant answered, and some left open.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing, the label as the only emphasis.

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim (Part B §22: the counts only rise; a face that fails the gate stays in the annex as a refusal row with its measurement). An unweighted seeded roll picks the face at render, so every face must stand alone. The exemplar, not the practical. No em dash, no exclamation mark, no digit or percent in a connective, no which-clause. The clerk who was there, compiling from records, citing a holder only where the card licenses a source and the move budget allows.

**THE THREAD (MOVE-GRAMMAR §1.4.1).** This pool is a SPINE and sits first in its own unit, with zero modifier mounts today, so no sibling text is guaranteed to follow it: every face must read as a complete unit alone AND as an opener that hands a noun forward (the gaol, the cells, the hall, the keys, the grounds, the hold). At the PAGE grain it is the third of five stacked paragraphs, so its shift of subject — outward pressure to inward order — is the passage's one licensed turn, and it is already placed where a turn belongs.

**THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Do not trade density for plainness.

**THE TWO-SENTENCE WALL.** S2 permits ONE computed consequence of a sentence's own fact to ride as a clause, with one joint, a comma and a word from the connectives list, never "which". Every other second fact takes its own sentence, and a variant is one or two sentences (A1). All three shipped rows are ONE sentence; vid 1 hangs its second half on a bare `, which` and vids 1 and 3 run a comma-joint pair.

### 0.5 ⭐ THE READS THIS POOL REACHES, resolved — MATERIAL A WRITER MAY USE, never a bound on what may be written

Two reads, and the pool's key is their conjunction. Both resolve through ONE producer, `getInstitutionNames` (`src/generators/priorityHelpers.js:39-77`), whose test is a lowercased SUBSTRING over the roster's native semantic names — and **a custom row returns the empty string** (`src/domain/content/customContentSemanticAuthority.js:40-48`), so neither flag can ever see a DM's own gaol or a DM's own courthouse.

| read | what it holds on this key | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|
| `compound.inst.hasPrison === true` | at least one roster name contains **`prison`** or **`stocks`** (`priorityHelpers.js:54`). In the native catalog that is exactly three rows: **`Small prison/stocks`** at TOWN — *"Holding cells and public punishment."*, tags `legal, law_enforcement`, baseChance 0.7 (`institutionalCatalog.js:1564-1569`); **`Large prison`** at CITY — *"Debtors, criminals, political prisoners."*, 0.7 (`:2282-2287`); **`Massive prison`** at METROPOLIS — *"State prison complex: political prisoners, debtors, convicted criminals held separately."*, 0.5 (`:2514-2519`) | a real place to put people, named on the roster and printed on the page. At town it is **cells AND a public punishment frame in one row**; at city it leads with **debtors**; at metropolis the held are **separated by kind**. Every one of those is concrete and unspent | **the KIND, on part of the range.** A town-tier `Small prison/stocks` is holding cells and stocks, not a gaol with wings; a metropolis `Massive prison` is a state complex. A face that fixes a scale the row denies is F1-32's shape on a legal row. The safe generic is the key's own: a place to hold people, somewhere to put a person, the hold, the cells |
| `compound.inst.hasCourtSystem === false` | NO roster name contains **`courthouse`**, **`court buildings`**, **`democratic assembly`**, **`city hall`** or **`town hall`** (`priorityHelpers.js:55`). ⭐ **So the absence is not only of a court. It is of the HALL.** `Town hall`'s own desc is *"Meeting place and administrative center."* (`institutionalCatalog.js:1550-1556`); `Courthouse` is *"Borough court for local justice."* (`:1557-1563`); `City hall` is *"Impressive civic building."* (`:2268-2274`); `Multiple courthouses` is *"Commercial, criminal, and ecclesiastical courts."* (`:2275-2281`); `Democratic assembly` is *"A citizen assembly holds formal authority…"* (`:1884-1891`) | the town has **no room where its business is done** and no body that formally decides anything. The missing thing is a place as much as a procedure, and no shipped row has ever said so | **the WORD "court" is free** (§R-4): `hasCourtSystem` is the engine's own reading of a court system, and here it reads FALSE, so the denial is the engine's own. What is denied is the reverse direction — a trial, a hearing, a magistrate sitting, a sentence pronounced, a gallows, a verdict (F1-12, F1-20). ⚠ And never assert the absence too hard: a DM's custom hall is invisible to the flag (F1-30) |

**What the engine itself prints beside this sentence, on this exact key — the writer should know every word of it:**

- The expandable row directly beneath the paragraph reads `Internal security: <safetyLabel>. ` and then, on this branch, **`Detention without systematic prosecution.`** (`src/domain/display/threatAssessment.js:136-155`, the `else if (f.hasPrison)` arm at `:148-149`). On a `Dangerous` label it also inserts *"Active violence and organized crime make internal order the primary threat."*
- `safetyProfile.js:331-332` — **"Offenders can be jailed, but without a working court system enforcement is arbitrary."** This is the engine asserting the pool's whole claim in its own words, and it rides in `guardEffectivenessDesc` on the Economy/Safety surface.
- `safetyProfile.js:467-468` (the Smuggling crime type) — "Offenders can be jailed, but without consistent courts, enforcement is sporadic."
- `safetyProfile.js:501-502` (the Lawlessness crime type) — "Without a court, there is no formal mechanism for resolving disputes peacefully."
- `defenseDisplay.js:233` — DS-DEF-6's Legal Infrastructure note, **"Detention without process. Arbitrary enforcement."** ⚠ Its corpus pool `Legal Infrastructure: Prison only` is C3-BLOCKED (`defenseStateProse.js:221-229` `DEF6_C3_BLOCKED_POOLS`; `DEF6_FACT_SPOKEN_AT` routes the fact to `defense.threatAssessment`), **so THIS pool is the page's only prose voice on the legal chain.** The blocked sibling's three shipped rows are quoted in §4 so the writer does not accidentally rewrite them.
- **The badge:** `scoreBand(scores.internal)` prints beside the row (`DefenseTab.jsx:322-341`), and the eyebrow above the whole block reads *"as judged at the first survey"*.
- **The funding note**, printed under this row when the internal gate bites: `Upkeep underfunded: watch and court funding at NN%` (`defenseDisplay.js:279`, `deriveDefenseReadiness`). ⚠ **The page names COURT FUNDING on a town the same page says has no court.** That is an engine defect, not a face's problem — a WIRING row under R-1 — but the writer should know the reader may see it.

**The purse, in the engine's own terms.** `defenseGenerator.js:230-254`: the court would have added **20** to the internal score and the gaol adds **15**; `hasLawInfra` is true *because the gaol is there* (`:244`), which switches the military contribution from ×0.04 to ×0.25 **and switches on the upkeep gate at all**. The gate is `internalUpkeepMult = min(1, 0.65 + econOutput/50 × 0.35)` over **"watch wages, court and gaol funding"** (`:249-254`), with the small-tier community self-policing baseline exempt. **So the gaol is fed out of the same purse as the watch, and when that purse is short it is short for both.** Floor 0.65 — never nothing (F4-04).

**The reads this desk performs and this key does NOT reach, listed so the writer knows the page around the sentence:**

- `hasWatch`, `hasGarrison`, `hasMilitia`, `hasMercenary`, `hasCharterHall`, `hasWalls`, `hasGates` — **none of them.** The key consults two flags and no force bucket. This is the most important omission in the packet: see F1-01/F1-02/F1-04 in §1.4.
- `config.monsterThreat` — unread here; the Beasts paragraph two lines above says which country the town sits in.
- `defenseProfile.scores.internal` — unread by the key, PRINTED as the badge beside it.
- `economicState.safetyProfile.safetyLabel` — unread by the key, PRINTED as the first words of the expandable row beneath it.
- `config.stressTypes`, `economicState.foodSecurity`, `history` — unread by every state-prose pool key of this block (F2-09).

### 0.6 The provenance move, priced for this pool

The card prints `source: (none) · standing SOURCE-UNRESOLVED`, so no holder resolves for either read. **A citation is therefore F1-24** — a record cited to a keeper the card cannot resolve. None of S3's three reasons obtains either: there are no two accounts, no count, and no keeper. The exemplar registers with raw text cite at zero per 786 sentences. **Recommendation: zero citations in this pool.** A13's blanket citation ban and W24's record-word bar are both struck entire, so the `[ledger]` face may reach freely for the vocabulary — the entry, the return, the duty, the keeping, the allowance, the writ, the roll — because that is vocabulary, not a citation, and it is free.

⚠ **And there is a specific reason a citation would be worse than absent here.** The pool's whole fact is that nothing writes down why a person is held. A face that cites a record contradicts the sentence it sits in.

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}`

### 1.1 The shipped sentence, verbatim

> {settlement} can hold people and has no settled way of deciding whether it should, which makes enforcement here a matter of who is doing it.

### 1.2 Every claim it makes, on the new test

- **The town CAN HOLD PEOPLE — it has a place and the capacity to detain.** — **SAFE, and doubly so.** `hasPrison` is true by the predicate (`priorityHelpers.js:54`; `defenseStateProse.js:509`), the roster row prints on the same dossier, and the engine asserts the claim in its own English twice: *"Offenders can be jailed…"* (`safetyProfile.js:331`, `:467`) and *"Detention without systematic prosecution."* in the expandable row directly beneath (`threatAssessment.js:148-149`).
- **The town has NO SETTLED WAY OF DECIDING whether it should — no process stands behind the holding.** — **SAFE.** `hasCourtSystem` is false by the predicate, and the engine prints the same finding beside the prose: *"without a working court system enforcement is arbitrary"* (`safetyProfile.js:331-332`), *"Without a court, there is no formal mechanism for resolving disputes peacefully"* (`:501-502`). ⚠ Note the word **`settled`** is also a CONFIG VALUE of this very block — `config.monsterThreat: 'settled'` keys the Beasts row whose paragraph sits two lines above (`defenseStateProse.js`, `MONSTER_FAMILY_OF`). Not a contradiction; a term collision under R-DA-22 (one term for one thing), and a reason for the rewrite to find another word.
- **There IS enforcement — somebody does the holding.** — **SAFE, and the engine models it.** `hasLawInfra` is true precisely because the gaol is on the roster (`defenseGenerator.js:244`), which is what switches the internal score's military term from ×0.04 to ×0.25 and switches on the upkeep gate at all (`:245-254`). The engine's positive model says this town's order machinery exists and is funded.
- **Enforcement here is A MATTER OF WHO IS DOING IT — the outcome varies with the person, not the rule.** — **SAFE.** `safetyProfile.js:331-332` says *"enforcement is arbitrary"* and `defenseDisplay.js:233` says *"Arbitrary enforcement."* The agent is left unnamed and plural-capable, which is what keeps it clear of F1-01 and F3-06. ⚠ The moment a rewrite names the agent — the watch, the guard, the constable, the captain — the claim stops being safe: see §1.4.
- **An implied SINGULAR holder ("who is doing it").** — **SAFE as written**, because "who" is indefinite and the sentence seats no body and no office. The recut struck W22a/W22b by name: an unnamed person may appear, act, keep a key, refuse. The bar is only the tier's SINGULAR mandated office (F3-06) and any body the roster denies (F1-01 to F1-06).
- **No magnitude, no date, no duration, no elapsed course, no rate, no trend.** — **CLEAN ON FLOOR 2.** This is the variant's real strength and the thing the rewrite must not lose: it is a standing condition throughout, in the present, with no perfect tense anywhere.

**The one breach in this row is a VOICE breach, not a claim breach:** `, which makes enforcement here a matter of who is doing it` is a which-tail. R-DA-03 bars `, which` in terms (R1 0.066 → ≤ 0.010 per variant) and the owner's own rule bars a which-clause outright; MOVE-GRAMMAR §1.4 wall 6 names it. The rewrite must lose the tail and keep the fact, either as a second sentence or on a lawful joint.

### 1.3 The reads this pool reaches (material for the rewrite of vid 1)

- `hasPrison` true: cells, a hold, somewhere to put a person; at town, the row's own words are **holding cells AND public punishment**; at city, **debtors, criminals, political prisoners**; at metropolis, **held separately**.
- `hasCourtSystem` false: no courthouse, no assembly, **and no town hall or city hall** — no room where the town's business is done, no body that formally decides.
- The key's own conjunction: the capacity without the deciding. That is the pool's whole discriminating claim and the `[ledger]` face owns stating it flat.
- The purse, in the engine's own English: **"watch wages, court and gaol funding"** on ONE multiplier with a floor of 0.65 (`defenseGenerator.js:249-254`). The gaol's keeping and the watch's wages come out of one allowance, and the court's share of that line is spent on nothing.
- The whole record vocabulary, struck free by the recut (W24 entire): the entry, the return, the duty, the keeping, the allowance, the writ, the roll, the books. The `[ledger]` stance may cite its own record as vocabulary.
- NOT reached and deliberately unread: the watch, the garrison, the militia, the walls, the gates, the monster country, the stress roster, the food stores, the internal score, the safety label, the history.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE

**Contradiction-table rows this pool's key can actually walk into.** (This table is the pool's whole roster of live rows; §2.4 and §3.4 name only the ones each variant adds.)

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **F1-01** | **THE WATCH as a standing body** — "the watch takes people", "the watch holds them" | `inst.hasWatch` is a SEPARATE flag (`priorityHelpers.js:48`) and **this key never reads it**; where it is false `safetyProfile.js:300`, `:309` print *"There is no meaningful guard presence."* beside the prose. ⭐ **This is the sharpest trap in the pool**, because the obvious rewrite of "who is doing it" is "the watch". Keeping watch, a patrol and a night round are free words anywhere; THE WATCH as a body is not |
| **F1-02** | **A GARRISON** as the town's own body | `inst.hasGarrison` / the garrison bucket (`priorityHelpers.js:46`; `defenseInstitutionBuckets.js:88-91`) — unread by this key and false across most of its range |
| **F1-04** | **"THE GUARD"** as a body | `inst.hasMilitaryInst` false (`priorityHelpers.js:45`); `safetyProfile.js:300`, `:309` print the denial. Where ANY law body stands, "the guard" is the engine's own word (`:271`, `:336`) — but this key cannot tell you whether one stands |
| **F1-12** | **A TRIAL, a hearing, a sentence pronounced, a magistrate sitting, a gallows, a verdict** | `hasCourtSystem` is FALSE here, which is the pool's own key; `safetyProfile.js:333` prints the denial. The WORD "court" is free (§R-4) — it is the PROCEDURE that is denied, and denied by this pool's own predicate |
| **F1-13** | denying the gaol, or fixing a SCALE the row denies — a warren of cells on a `Small prison/stocks` town, a single lock-up on a `Massive prison` metropolis | `inst.hasPrison` (`priorityHelpers.js:54`); the three rows' own printed descs (`institutionalCatalog.js:1564-1569`, `:2282-2287`, `:2514-2519`). Where it IS set, **write the cells — they are real** |
| **F1-20** | **A HALL, a chamber or a council room as a PLACE** where the town's matters are heard | this key's own predicate: no `town hall`, `city hall`, `courthouse`, `court buildings` or `democratic assembly` is on the roster. ⭐ The ABSENCE of the room is licensed material; the presence of one is a contradiction |
| **F1-24** | **a RECORD cited to a keeper** — the gaol book, the bailiff's return, the roll of the held | `source: (none) · SOURCE-UNRESOLVED` on the card; `holderTable.js:243-247`; `composedWalker.js:1071-1073`. **The record WORDS are free; the CITATION needs a holder and there is none.** And a cited record contradicts the sentence's own fact |
| **F1-25** | **the NEGATION direction** — "there is nowhere to put anybody", "nothing here can hold a person" | the same flag read the other way. That sentence is the SIBLING pool `Internal Security: no legal infrastructure` |
| **F1-30** | asserting the absence of a hall or a court too hard where a CUSTOM row supplies one | `customContentSemanticAuthority.js:40-48` — `nativeSemanticName` returns `''` for custom content, so a DM's courthouse is INVISIBLE to `hasCourtSystem` and prints on the roster anyway. **Write around the absence rather than sealing it** |
| **F1-31** | naming a TIER the identity strip does not print | `{r.tier}` prints verbatim beside the name and population (`OverviewTab.jsx:247`). ⚠ This pool's range is town-and-up (see §1.5), so "a place this small" is doubly wrong here |
| **F1-34** | a TOTALITY over the town's people — "nobody here is safe", "everyone is at risk", "anyone can be taken" | the refused column (a totality over persons) is on the card in terms, and `threatAssessment.js:136-155` builds this row for EVERY town at every safety label |
| **F1-40 / F1-107** | **outrunning the BADGE or the LABEL printed beside the line** — a lawless, disordered or frightened town where the row's badge reads STRONG or its expandable line reads `Internal security: Very Safe.` | `scoreBand(scores.internal)` at `DefenseTab.jsx:322-341`; the label at `threatAssessment.js:140`. **A prison-only town can score high** (watch +18, garrison +15, gaol +15 over the community baseline, `defenseGenerator.js:232-238`). ⚠ **W-10 INSTRUMENT**: the key is a boolean and the badge is continuous, so an INTENSITY word is not refutable either way until the card prints the band spread over this key's domain. The safe intensity comes from the ARRANGEMENT — a capacity with nothing above it — never from a grade |
| **F1-126** | **a minted PROPER NAME** borne by the face — a gaoler, a lane, a gate, a family, a named cell block | a pooled face is authored once and drawn by every town whose key matches, so the name prints identically across a region. The NPC roster and the `{npc}` slots are the name authority; this pool has neither |
| **F2-01** | **ANY magnitude**, in a digit or in a word — how many are held, how many cells, a fine, a fee, a share of the purse, a number of keys | the band vocabularies are closed. "More of them than the town intended to keep" is the hook; a count is not |
| **F2-02 / F2-03 / F2-05** | **a date, a season, a duration, a founding, or an ELAPSED COURSE** — "since the court closed", "the gaol was built", "has been this way", "no longer", "again", "the second time", "for as long as anyone remembers" | `ageBands.js` pins `HISTORICIZE_BAND = 'years-past'`; a birth-time STATE carries no origin stamp; `institutionFounding.js` — *absence is the typed value, no arm ever invents a year*. ⭐ **There was never a court to close.** A face that implies one was lost is F2-04 as well |
| **F2-04** | **AN EVENT THE RECORD DID NOT RUN** — the court was abolished, the judge left, the assembly was dissolved, a charter was revoked | `previousGovernments` is empty on 48 of 48 generated towns (`rulingPower.js:400-404`); an institution's absence records no departure |
| **F2-06** | **A RATE** — "most nights somebody is in the cells", "seldom empty", "every market day" | nothing bands a rate anywhere in the engine. *The cells are not empty* is lawful; the rate form is not |
| **F2-09** | a dependency on a field the key cannot see — the watch, the walls, the monster country, the stress banner, the food stores, the score, the safety label, the history | no key function of this block reads any of them |
| **F3-05** | **cultural furniture the town's own culture profile denies** — a village green, a churchyard, thatch, hearth-smoke, a parish, snow on the road — on an `arabic`, `east_asian`, `mesoamerican`, `south_asian` or `steppe` profile | `cultureProfiles.js:50-600`, rendered at `dailyLifeLogic.js:14`. **The product is setting-agnostic and no defense pool reads the profile.** ⚠ The recut names this the finding most likely to recur in every block, and this pool's material (a square, a frame in the open, a place people walk past) is exactly where it recurs. Write the thing, not the northern European village around it |
| **F3-06** | **an UNNAMED person's act on an office the tier emits as a NAMED NPC** — "the one who keeps the key", "the officer who signs for the holding" reads as Guard Captain ⟨Name⟩ | `TIER_MANDATORY_ROLES` emits exactly ONE **Guard Captain** per village-plus, one Mayor, one High Priest, each with a generated personality, disposition and secret (`npcGenerator.js:1511-1537`, `:117-149`). ⚠ **The rider (W22 struck):** an unnamed person MAY act freely — use a plural, a trade, a bystander, or an office the roster does not seat. "Whoever holds the keys" is safe; "the keeper of the keys" as a singular office is not |
| **F4-01** | a rotting, crumbling or weathering gaol — **and equally the PERMANENCE of any institution row** | no material decay clock exists anywhere; and `calamityKernel.js:96-151`, `:251`, `:259-275` demotes built fabric and stamps `status:'ruined'` |
| **F4-03** | **SPLITTING THE DIRECTION OF THE FOUR GATES** — the gaol kept while the watch starves, the cells provisioned while the patrols are not | all four gates are `min(1, floor + econOutput/50 × (1−floor))` on ONE input; the internal gate's floor is 0.65 over **"watch wages, court and gaol funding"** together (`defenseGenerator.js:249-254`). They differ in degree only, never in direction |
| **F4-04** | **A TOTAL COLLAPSE** — nobody is paid, nobody keeps the place, the cells stand empty because there is no one to fill them | every gate has a FLOOR and the community baseline is exempt (`defenseGenerator.js:245-254`). The licensed extreme is short, late, thin — never none |
| **F4-13** | a PLAYER face naming a fact the engine flags COVERT | `impairments[].covert` (`corruption.js:670-681`); the unexposed-stooge route names the OFFICE, never the officer. ⭐ **The positive move nobody used: the player face may say the town DOES NOT KNOW, and the not-knowing is the hook** |
| **F4-14** | a corruption the roster PUBLISHES called hidden | `npcGenerator.js:1524`, `:1532` — `'Corrupt Official'` is a mandated, openly-rostered public role string under `occupied` / `insurgency` |

**⛔ THE TIE-BREAK (§R-1), and the two engine defects that sit on this exact key.** A floor-1 finding carries three fields: the face, the denying surface, and WHICH SIDE IS THE RECORD. Where the denying surface is engine PROSE or a stale snapshot, the FACE STANDS and a WIRING row is filed. Two such collisions live here and neither may be charged against a face:

1. **`safetyProfile.js:507-508`** prints *"The lack of reliable courts and detention means most offenders face no meaningful consequences."* on the `!(court && prison)` branch — that is, **on a town whose record says it HAS detention.** Engine prose against a flag: the flag is the record.
2. **`defenseDisplay.js:279`** labels the under-funding note **"watch and court funding"**, printing the words *court funding* on a courtless town. Engine prose against a flag: the flag is the record.

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** A body, building, record-keeper, force or faith-house the roster does not carry may not be asserted: the INSTITUTION ROSTER over the live roster (`institutionRoster.js`, `liveInstitutions`, classified by `priorityHelpers.js:45-77`); the SIX FORCE BUCKETS — `garrison`, `militia`, `watch`, `mercenary`, `charter`, `magicDef` (`defenseInstitutionBuckets.js:84-107`), **none of which this key reads, so none may be seated**; the FACTION list; the FAITH entries; the NPC OFFICE roster (`TIER_MANDATORY_ROLES`). In particular the prison keyword set closed on this key is `prison · stocks` and the court keyword set is `courthouse · court buildings · democratic assembly · city hall · town hall`. Everything outside those sets is silence, and silence is permission — **except** that a custom row's native semantic name is invisible to both flags (F1-30), so an absence must be written around rather than sealed.

**Not a faith pool.** The deity's four axes, the DERIVED temper (`deityTemper()`, never the inert stored `temperamentAxis`), the PANTHEON rank, the SETTLEMENT standing and the `suppressed` flag do not arise here and no face may reach for them.

### 1.5 ⭐ THE PREIMAGE — the range of towns this key selects

**The key is a pure boolean pair, so it fires across every country tier, every stress state, every safety label, every culture profile, every faction arrangement and every score.** A face must contradict no state in that range, not merely the town on this skeleton. But the range has ONE hard edge and it is the most useful fact in this section:

**Every native roster name that sets `hasPrison` lives at TOWN or above.** `Small prison/stocks` is a TOWN-tier Infrastructure row (`institutionalCatalog.js:1564`), `Large prison` a CITY row (`:2282`), `Massive prison` a METROPOLIS row (`:2514`); the catalog carries no `prison`- or `stocks`-named row at thorp, hamlet or village, and metropolis merges the CITY catalog on top of its own (`lookups.js:113-147`). **So on a generated world this pool never fires below town.** Write nothing that assumes a small place: no hamlet, no handful of households, no everyone-knows-everyone, no single street.

**And the other edge, which is why the pool is rare rather than impossible.** The court-side rows at those same tiers include `Town hall` **`required: true`** at town (`:1550`) and `City hall` + `Multiple courthouses` **`required: true`** at city (`:2268`, `:2275`), which metropolis inherits. A required row is placed unconditionally *unless* a world law refuses it or a toggle force-excludes it — `assembleInstitutions.js:260-282`: *"World law precedes required/forced/probability handling"*, and `const forceExclude = inst.required && toggle.forceExclude === true`. **So this key selects a town-or-larger settlement whose hall and courthouse were excluded by a world law, by a creator's toggle, or by a hand-built or imported roster, while a prison-class row stands.** That is a deliberate world, not an accident — and it is exactly the kind of place a game master reaches for. The prose should be worthy of a place somebody chose to make.

⚠ **One further range fact.** `compound.inst` is a GENERATION-TIME SNAPSHOT, written once into `economicState.compound` (`generators/economy/economicState.js:872`) and never rebuilt, while this desk's force rows read the LIVE roster (the leaf's own `⛔` note at `defenseStateProse.js:604-610`; the frozen/live table's **W-11**: rows 1–2 live, rows 3–5 snapshot). So a gaol ruined by a calamity still reads as a gaol HERE, and a hall ruined still reads as absent. **The snapshot IS the field this pool reads**, so a face agreeing with it is correct and a refuter charging it against the live roster has a WIRING row, not a finding (§R-1).

### 1.6 The angle's stance in one sentence

`[ledger]` is the compiled entry itself: it may state the capacity and the missing deciding flat, in the record's own vocabulary (the entry, the duty, the keeping, the allowance), land on the civic thing, and stop — never explaining what the arrangement means, never rating it, never following it to an outcome.

### 1.7 The turns worth keeping

- **"can hold people and has no settled way of deciding whether it should"** — the pool's discriminating conjunction in one clause, and the sharpest compression in the pool. ⚠ but `settled` collides with the block's own `monsterThreat: 'settled'` vocabulary; find another word for the same turn.
- **"a matter of who is doing it"** — agentless, exact, and clear of F1-01 and F3-06 by construction. Worth carrying into a face verbatim.
- **"whether it should"** — the modal is the licensed way to say *no rule decides*, with no procedure asserted and no event implied.

### 1.8 ⭐ WHERE THE FLAVOUR IS (vid 1)

- ⭐ **THE ROW SAYS "HOLDING CELLS AND PUBLIC PUNISHMENT" IN ONE BREATH** (`institutionalCatalog.js:1564-1569`). Two different things: a door that locks, and a frame in the open where a person is put to be looked at. **Nothing in the shipped corpus has ever used the second half.** The ledger face can record the capacity as a pair of facilities rather than as an abstraction — what the town built, and what it put where people pass.
- ⭐ **THE MISSING THING IS A ROOM, NOT A PROCEDURE.** `court === false` means no town hall and no city hall — the row whose own desc is *"Meeting place and administrative center"*. So the town has a place to put a person and no place to put the question. A record can note that plainly, and no shipped row anywhere in this block does.
- **THE PURSE NAMES THE GAOL OUT LOUD.** The internal gate is "watch wages, court and gaol funding" on one multiplier (`defenseGenerator.js:249-254`). The keeping of the people held is a line in the same allowance as the wages, and a third of that line has nothing to pay for. What a clerk notices is not the injustice; it is that the entry has a head with nothing under it.

### 1.9 What would make the rewrite of vid 1 a regression

- Naming the agent (the watch, the guard, the constable, the captain) where the shipped row wisely left it indefinite — the pool's only real F1 exposure, and the shipped row is clear of it.
- Adding a magnitude, a duration or a perfect tense to buy weight — vid 1 is clean on floor 2 today and that is not free to lose.
- Keeping the `, which` tail, or replacing it with a second which-clause, a colon gloss or a summarising second sentence (the MEANING non-move).
- Trading the conjunction for one half of it. A face that says only *the town can hold people* has spent the pool key and could be drawn in the `full legal chain` pool.

---

## VARIANT 2 · vid 2 · `[visitor]` · slots `{settlement}`

### 2.1 The shipped sentence, verbatim

> A stranger at {settlement} is careful in a way he would not need to be in a town with courts, and cannot say precisely why.

### 2.2 Every claim it makes, on the new test

- **A STRANGER is at the town, and can be.** — **SAFE.** No field bars a visitor; the visitor stance is the block's own declared angle for this pool (`angle: ledger street visitor` on the card) and the recut struck W27's stance rules by name: *a stranger may act, be turned away, be told the wrong thing, pay twice*.
- **The stranger is CAREFUL — a disposition assigned to an unnamed person.** — **SAFE on the new test.** W22a/W22b and W27 are struck; an unnamed person may act and may be shown behaving. ⚠ **But this is the pool's one REGISTER exposure rather than a floor exposure.** The register card bars an assigned reaction and a named interior, and MOVE-GRAMMAR §1.3 lists FEELING as a move that does not exist anywhere in the estate (*no field carries motive, belief or mood; the reaction is an ACT*). *Careful* is close to the line and *cannot say precisely why* is over it — the second half states what is inside a person's head. The licensed conversion is the ACT: what a stranger does differently, what he leaves undone, where he does not go.
- **The care is CAUSED by the absence of courts — "in a way he would not need to be in a town with courts".** — **SAFE, and the contrast is sibling-licensed.** R-DA-02 keeps a contrast only where the rejected alternative names a sibling pool key or sibling band: *a town with courts* is exactly the sibling keys `Internal Security: court without detention` and `Internal Security: full legal chain (court AND prison)` (`defenseStateProse.js:507-508`). The alternative is a state the town could be in, which is the test.
- **The town's arrangement is ILLEGIBLE — the stranger "cannot say precisely why".** — **SAFE as written, with a ⚠ rider.** Read strictly the claim is about the stranger's own inability to articulate, and no field denies that. **But the neighbouring reading — that the arrangement is not visible — sits against the record on part of the range:** the town-tier row is literally *"Holding cells and **public punishment**"* (`institutionalCatalog.js:1564-1569`), and the C3-blocked sibling on the same fact opens *"A stranger at {settlement} sees both buildings on the same square"* (`RECEIPT_POOLS_DOSSIER_STATE.md:2992-2994`). A rewrite that pushes this into *nothing here shows you what the town does* would be **CONTRADICTED** on every town whose gaol row is the town-tier one, with the row's own printed description as the record. **The safer and better move is the opposite one: what a stranger CAN see, and what seeing it does not tell him.**
- **There is nothing for the stranger to ask.** — implied, not asserted; **SAFE**, and it is the pool's own key read the useful way.
- **"HE"** — a gendered pronoun on an unnamed stranger. — **not a claim and not a finding**, since no field is consulted; but it is a craft defect the estate has been bitten by before (the 234 gendered R6 lines against a 50/50 field, CLERK-LAWS §2.2 C3 arm a). The rewrite should not carry a pronoun it has no field for.
- **No magnitude, no date, no duration, no rate.** — **CLEAN ON FLOOR 2**, except that *would not need to be* is a subjunctive and therefore lawful (A2: the edge is subjunctive, never a fate).

### 2.3 The reads this pool reaches (material for the rewrite of vid 2)

Everything in §0.5 and §1.3, plus the two things that are specifically a visitor's:

- **What is on the roster is on the page.** The gaol is a named institution row that prints beside the prose — a stranger can be shown meeting the building, not the abstraction.
- **What is NOT on the roster is a place he cannot be sent to.** There is no hall, no courthouse and no assembly, so there is nowhere to take a complaint, no door to knock on, nobody sitting. That is a visitor's fact before it is a clerk's.
- NOT reached: the watch (so nobody stops him), the walls and the gates (so no checkpoint), the safety label, the score, the country, the history.

### 2.4 ⭐ WHAT WOULD BE FALSE HERE

**§1.4's table binds in full.** The rows this variant adds or sharpens:

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **F1-08** | **A GATE, a checkpoint or a toll-bar** a stranger passes, **or the denial of one** | `inst.hasGates` (`priorityHelpers.js:53`) — a separate flag this key never reads. Where it is false, `safetyProfile.js:463-464` prints *"no gates to bribe and no checkpoints to avoid"* |
| **F1-01 / F1-04** | somebody STOPPING, questioning or watching the stranger — the watch, the guard, a patrol as a body | neither flag is read here; `safetyProfile.js:300`, `:309` print the denial where no law body stands. **A stranger may be careful of nobody in particular; he may not be stopped by a body the roster does not carry** |
| **F1-12** | a stranger being told where to take a complaint, or watching a hearing | `hasCourtSystem` false is this pool's own predicate |
| **F1-32 (its shape, on a legal row)** | fixing what the gaol LOOKS like against the row's own printed description — a great stone block on a `Small prison/stocks` town, a lock-up on a `Massive prison` metropolis | `institutionalCatalog.js:1564-1569`, `:2282-2287`, `:2514-2519`. Cells and a punishment frame are free at town; a state complex with separated wings is free at metropolis; neither is free on the other |
| **F1-107** | a frightened, watchful or hostile town where the expandable row beneath prints `Internal security: Very Safe.` or the badge reads STRONG | `threatAssessment.js:140` (the label leads the row); `DefenseTab.jsx:322-341` (the badge). ⚠ **W-10 holds the intensity question open**, but the LABEL is a printed string and a face that fights it is charged |
| **F3-05** | the stranger's road, inn, square, churchyard or market green as north-European furniture | `cultureProfiles.js:50-600`; no defense pool reads the profile. **Write what he meets, not the village he meets it in** |
| **F3-06** | the stranger dealing with *the one who keeps the key* or *the officer on duty* as a singular office | `npcGenerator.js:1511-1537` — the tier emits exactly one Guard Captain. A plural, a trade or a bystander is free |
| **F2-05** | *he would have been told*, *he has learned*, *by the second day* — any elapsed course laid over the visit | `ageBands.js`'s `HISTORICIZE_BAND` pin; a birth-time state bears no temporal register |

### 2.5 ⭐ THE PREIMAGE

As §1.5: town and above on every generated world, any country, any stress, any culture, any score, any safety label. **The specific visitor consequence:** the stranger cannot be a stranger to a small place — no hamlet lane, no single street, no everyone-turns-to-look. He arrives somewhere with a gaol on its roster and no hall, which on this range means somewhere of size whose civic room was deliberately left out.

### 2.6 The angle's stance in one sentence

`[visitor]` is what a person who does not live there meets and what he does about it: an outsider's ACTS — where he goes, what he does not do, what he is not told — never his interior, and never a verdict on the town.

### 2.7 The turns worth keeping

- **"in a town with courts"** — the sibling-licensed contrast, carried in four words, and the cheapest legal way to say what this town lacks. Worth keeping verbatim in at least one face.
- **"is careful in a way he would not need to be"** — the subjunctive comparison is lawful and the rhythm is good; what needs replacing is the interior, not the shape.
- **"cannot say precisely why"** — the TURN is the right one (the town does not explain itself) and the CARRIER is wrong (it states what is in a head). Re-seat it on an act or on an absence: there is nobody to ask, and nothing to read.

### 2.8 ⭐ WHERE THE FLAVOUR IS (vid 2)

- ⭐ **THE FRAME IN THE OPEN.** A town-tier gaol row is *"Holding cells and public punishment"* — so the thing a stranger meets first is not a door, it is a fixture in a public place, and the ordinary people walking past it are not looking at it. **That is what a stranger notices and what a resident has stopped noticing**, and it is the single strongest unused image in this pool.
- ⭐ **THERE IS NOWHERE TO TAKE IT.** The court flag being false means no hall, no courthouse, no assembly — so a stranger with a complaint has no door. The sibling pool `no legal infrastructure` already owns *"has nowhere to take it"*, so this pool's version must be the sharper one: **there is somewhere to be taken TO, and nowhere to take anything.** The asymmetry is this pool's alone.
- **WHAT A STRANGER WOULD AVOID.** Nothing in the record stops the face from noting the practical cost: a stranger has no standing here and no procedure to appeal to, so the prudent thing is to settle matters before they become matters. That is an ACT, it is licensed, and it is the conversion of *careful* into something a game master can play.

### 2.9 What would make the rewrite of vid 2 a regression

- Keeping the interior (*careful*, *cannot say why*, *uneasy*, *senses*) instead of converting it to an act — the register's FEELING non-move and the one thing this variant actually needs fixed.
- Pushing the illegibility into the WORLD (*nothing here shows what the town does*), which the town-tier row's *public punishment* denies.
- Seating a body to do the frightening — the watch, the guard, a patrol.
- Carrying the bare "he" forward with no field behind it.

---

## VARIANT 3 · vid 3 · `[street]` · slots `{settlement}`

### 3.1 The shipped sentence, verbatim

> The town can put a person away at {settlement} and cannot say on what grounds, and has learned not to ask on whose.

### 3.2 Every claim it makes, on the new test

- **The town CAN PUT A PERSON AWAY.** — **SAFE**, as vid 1's first claim, on `hasPrison` and the engine's own *"Offenders can be jailed"* (`safetyProfile.js:331`, `:467`).
- **The town CANNOT SAY ON WHAT GROUNDS.** — **SAFE.** `hasCourtSystem` false is the pool's own predicate; `safetyProfile.js:331-332` and `defenseDisplay.js:233` say *arbitrary* in terms. The compression (*on what grounds*) is exact and free.
- **There is a WHOSE — somebody on whose authority the holding runs, unnamed.** — **SAFE.** The recut struck the person bar by name; an unnamed person may hold a key, decide, be avoided, be resented. ⚠ The bar is only the tier's SINGULAR mandated office (F3-06) and any body the roster denies (F1-01 to F1-06).
- **THE TOWN HAS LEARNED not to ask.** — ⛔ **FLOOR-2.** *Has learned* is a perfect: it asserts a past process the record did not run and a prior state in which the town did ask. F2-05 names the perfect and the elapsed course in terms (*has stood*, *no longer*, *again*); `ageBands.js` pins `HISTORICIZE_BAND = 'years-past'` and a birth-time STATE carries no origin stamp at all, so it can bear no temporal register whatever; F2-09 adds that **no state-prose pool key in the estate reads a history field**, so the allusion desyncs on a reroll button, not only on a tick. ⭐ **The turn is worth saving and the tense is not:** the conversion the table itself recommends is a standing condition — the question is not put; nobody asks; there is no one to ask it of.
- **The asking is SUPPRESSED — asking would be unwise.** — **SAFE** as a standing condition once the perfect is removed. Nothing denies it and F4-13's positive move supports the shape: the player face may say the town does not know, and the not-knowing is the hook.
- **"THE TOWN" as an agent that can and cannot SAY.** — **SAFE.** The aggregate is the engine's own idiom throughout `safetyProfile.js` and the corpus, and W20's layer bar is struck: a band, a label or a stock may be narrated through the bodies the town actually holds.
- **No magnitude, no date, no rate.** — clean, apart from the perfect above.

⚠ **A craft note, not a claim.** The unit names the town twice — once as *The town*, once as the `{settlement}` fill mid-sentence — and the fill sits in an adverbial position (*put a person away at {settlement}*) that reads as a location tag rather than as a subject. Every face of this vid carries `{settlement}`; a face that makes the fill the subject reads better and costs nothing.

### 3.3 The reads this pool reaches (material for the rewrite of vid 3)

Everything in §0.5 and §1.3, plus what belongs to the street:

- The people who are held are the town's own, and they go somewhere the town can point at.
- The absence of the hall means there is no public occasion on which anything is decided — nothing is heard, nothing is read out, nobody sits.
- The purse's own words: the keeping of the held is a line in the same allowance as the watch's wages (`defenseGenerator.js:249-254`).
- NOT reached: every force bucket, the walls, the gates, the country, the score, the safety label, the stress banner, the history.

### 3.4 ⭐ WHAT WOULD BE FALSE HERE

**§1.4's table binds in full.** The rows this variant adds or sharpens:

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **F2-05** | ⛔ **the shipped row's own `has learned`** — and every sibling of it: *since*, *no longer*, *used to*, *these days*, *any more*, *the way it was before*, *has stopped* | `ageBands.js` (`HISTORICIZE_BAND = 'years-past'`); `activeConditions.js:879-902` (birth conditions at `elapsedTicks: 0`); F2-09 (`historyPreservation.js:1-30` — a reroll replaces `settlement.history` wholesale and no state-prose key reads it) |
| **F2-04** | the EVENT behind the learning — somebody asked once and was taken, a case went wrong, a complaint was made | `previousGovernments` empty on 48 of 48 generated towns (`rulingPower.js:400-404`); nothing records an institution's departure or a prior procedure |
| **F1-01 / F1-02 / F1-04** | **who does the taking, named as a body** — the watch takes people, the guard comes at night, the garrison holds them | none of those flags is read by this key; `safetyProfile.js:300`, `:309` print *"There is no meaningful guard presence."* where no law body stands. ⭐ The shipped row's agentlessness is a deliberate strength |
| **F3-06** | *on whose* resolved to the tier's singular office — the captain, the mayor, the priest | `npcGenerator.js:1511-1537`; each carries a generated disposition and secret, so the sentence reads as a claim about a NAMED NPC. **Keep the whose indefinite, or make it a plural or a trade** |
| **F1-34** | a TOTALITY over persons — *anyone can be taken*, *nobody is safe*, *every household has lost somebody* | the refused column on the card, in terms |
| **F1-49 / F1-56** | attributing the holding to the SEAT or the governing body by name, or asserting there is no authority | the power surface prints the seat's own label and its vacancy line (`PowerTab.jsx:117`; `SummaryTab.jsx:32`); this key reads neither. **The whose stays unresolved, which is also the better sentence** |
| **F4-13** | a PLAYER face asserting a covert fact as known | `corruption.js:670-681`; `settlementPolitics.js:423-436`. The licensed and stronger move is the town's NOT knowing |
| **F1-126** | naming the person, the street, the cell or the family | a pooled face is authored once and prints identically across every matching town |

### 3.5 ⭐ THE PREIMAGE

As §1.5: town and above, any country, any stress, any culture, any safety label, any score. **The street consequence:** this is not a place where everyone knows everyone. It is a town or larger, with enough people that a person can be taken and the taking not be the whole town's business by evening — which is precisely what makes *not asking* possible and worth writing.

### 3.6 The angle's stance in one sentence

`[street]` is what the town's own people treat as ordinary: the practice rather than the provision, stated without comment, landing on what is done and what is not done — never a moral, never a verdict, never a named person.

### 3.7 The turns worth keeping

- **"cannot say on what grounds"** — the pool's core fact in five words, exact and free. Carry it.
- **"not to ask on whose"** — the best turn in the whole pool: it converts the missing court into a missing question and leaves the authority standing open, which is the register card's own instruction (*leave one matter standing open in every town, stated, never asked*). ⭐ **Keep the turn; re-seat it off the perfect.**
- **"put a person away"** — plain, idiomatic, and it names no body and no building; it is stronger than *detain* and costs nothing.

### 3.8 ⭐ WHERE THE FLAVOUR IS (vid 3)

- ⭐ **THE QUESTION THAT IS NOT PUT.** The record holds no court and no hall, so there is no occasion on which anybody is obliged to answer. What that looks like on the ground is not fear: it is a subject that does not come up — a thing people step around in a conversation, the way they step around the frame in the square.
- ⭐ **THE DEBTORS.** At city the roster row's own first word is *Debtors* (`institutionalCatalog.js:2282-2287`): the people inside are not all wrongdoers, and some of them are there over money. **No shipped row in this block has ever noticed that the hold is also a creditor's instrument** — and on a street face that is the most playable fact available, because it makes the holding somebody's interest rather than nobody's.
- **WHO FEEDS THEM.** The keeping of the held is a line in the same allowance as the watch's wages, with a floor and no ceiling above identity (`defenseGenerator.js:249-254`). The street version of that is not a figure: it is that somebody's household carries the difference, and nothing written says whose.

### 3.9 What would make the rewrite of vid 3 a regression

- Keeping the perfect (*has learned*, *no longer asks*, *stopped asking*) — the one outright FLOOR-2 breach in the pool, and the reason this variant needs the most work.
- Resolving the *whose* — to a body (F1-01/F1-02/F1-04), to a named office (F3-06), or to the seat (F1-49).
- Trading the compression for plainness: *the town cannot say why somebody is being held* is legal and flat; **the density law forbids that trade** (Part B §21.4).
- Turning the not-asking into a moral, a verdict or a summarising second sentence.

---

## 4. THE POOL AS A WHOLE — what the writer must not lose

**⛔ THE POOL IS THE PAGE'S ONLY VOICE ON THE LEGAL CHAIN.** DS-DEF-6's `Legal Infrastructure: Prison only` pool is C3-BLOCKED (`defenseStateProse.js:221-229`), and `DEF6_FACT_SPOKEN_AT` routes the fact to `defense.threatAssessment` — this block, this row. So there is no second sentence anywhere in the page-set to carry what this pool leaves out. **And the blocked pool's three rows must not be re-written here**, because they are a different pool's slots and are what the C3 ruling silenced: for the record they read *"{settlement} can detain without any settled process for deciding whom; enforcement here is arbitrary in the exact sense, and depends on who is holding the keys"* · *"People are taken at {settlement} and the taking is not explained, and the town has learned not to press for the explanation"* · *"What {settlement} holds people for drifts with whoever is doing the holding, and the drift is not written anywhere it could be corrected"* (`RECEIPT_POOLS_DOSSIER_STATE.md:3001-3005`). ⚠ Note the second of those carries the SAME `has learned` breach as vid 3, and the third carries an elapsed *drift*. The writer should read them once, to know what has already been said and not to say it again.

**⭐ THE POOL-GRAIN DULL VERDICT IS ALREADY EARNED, AND THE REWRITE'S FIRST JOB IS TO BREAK IT.** Two of the three shipped rows are the same construction:

- vid 1: *can hold people* **and** *has no settled way of deciding*
- vid 3: *can put a person away* **and** *cannot say on what grounds*

Both are `CAN X and CANNOT Y`, both are one sentence, both join on a bare *and*, and both land on the same abstraction. Only vid 2 varies the shape. Under Part B §21.4 and the recut's craft verdict, a pool whose renderings collapse onto one construction is DULL at the pool grain — **and with four faces per variant the collapse would be twelve deep instead of three.** The twelve faces must spread across constructions, not merely across words: a bare standing fact; an object-first opening (V4 — the cells, the frame, the hall that is not there); an institution-first opening (V5); a state with its structural consequence (V2); a state with a typed LACK (V3, licensed here by the court read read the other way); a state with its standing-open matter (V6, and the *on whose* is already that). MOVE-GRAMMAR §2.1's level-1 set is the menu, and a pool of three carries at least three distinct grammars by A11.

**THE CLAIM SET THAT MAY NOT MOVE (arm C).** Every face of every vid asserts exactly two things and no more: **(a) the town has somewhere to hold people; (b) no court or hall stands behind the holding.** A face that carries only (a) belongs to `full legal chain`; a face that carries only (b) belongs to `no legal infrastructure`; a face that carries neither belongs nowhere. The angle, the vocabulary and the rhythm are what vary.

**THE SPREAD RULES THAT BIND THE TWELVE FACES.** No two variants of one pool share their first two words (A11); the settlement token opens at most one variant per pool and never two adjacent (R-DA-17, wall 10); no `, which` (R-DA-03, wall 6); a qualification takes its own sentence, never a tail, never a third (R-DA-03); the close is a standing fact of a KIND drawn from a closed set — a condition, a prohibition, an absence, an object, a name not given — varied across the pool (R-DA-04); ABSENCE never opens and never sits beside another ABSENCE (wall 3), which matters here because the missing court is an absence and is available to at most some of the twelve.

**THE FOUR THINGS THIS POOL HAS AND THE SHIPPED ROWS NEVER SPENT**, gathered in one place so the writer can see the whole purse:

1. **The cells and the frame** — `Small prison/stocks` is *"Holding cells and public punishment"* in one row: a door that locks and a fixture in the open. Neither has ever been written.
2. **The room that is not there** — `hasCourtSystem` false means no town hall or city hall, whose own desc is *"Meeting place and administrative center"*. The town has a place to put a person and no place to put the question.
3. **The debtors** — at city the hold's own printed description leads with them; at metropolis the held are separated by kind. The hold is a creditor's instrument as well as a keeper's.
4. **The one allowance** — *"watch wages, court and gaol funding"* on a single multiplier with a floor of 0.65, a third of whose heading pays for nothing.

**AND THE ONE SENTENCE THE WHOLE PACKET REDUCES TO.** Do not seat a watch, a guard, a garrison, a magistrate or a named officer; do not stage a trial, a hearing or a sentence; do not date, count, or let anything have *happened*; do not outrun the badge or the safety label printed beside the line; and do not write the north-European village around the gaol. **Everything else — the cells, the frame in the square, the missing room, the debtors, the keys, the question nobody puts — is yours.**
