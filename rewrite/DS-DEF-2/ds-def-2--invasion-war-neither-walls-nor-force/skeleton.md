Seat: MARKER (opus), DS-DEF-2 · pool `Invasion & War: neither walls nor force` · the skeleton the writer drafts from; nothing here is a face.

# DS-DEF-2 · `Invasion & War: neither walls nor force` · SKELETON

**Three shipped variants**, vids 1 to 3, angles `[ledger]` · `[counterforce]` · `[street]` in that order. The rows are the annex's at `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2655-2658` (block header at `:2568`), and the generated leaf carries the same three texts with the same vids, angles and slot sets (`src/data/dossierStateProse/defense.generated.js:674-697`; the manifest row at `:1210-1222` reads `role: spine`, `variantCount: 3`, `faceCounts: [1,1,1]`, `vids: [1,2,3]`). The writer rewrites these three, one for one, and gives each its four `[face]` sub-rows — twelve wordings where there are three today, and the counts only rise (Part B §22).

⚠ **THE SLOT SETS ARE NOT UNIFORM ACROSS THIS POOL, and that is a wall.** Vid 1 and vid 2 carry `{settlement}`; **vid 3 carries NO SLOT AT ALL** (`"slots": []`, `defense.generated.js:694`). A face's slot set must equal its parent's (ARCH §2.5's face-row refusals), so **vid 3's four faces never name the town** and vid 1's and vid 2's four faces each carry `{settlement}` exactly once. `{band}` is RESERVED and `{route}` is unfilled at this block's call sites: a face that writes either drops at the projector.

**THE TEST THIS PACKET IS MARKED UNDER (ADDENDUM 14, the owner 2026-09-12).** A face is LAWFUL unless it CONTRADICTS the record. Silence is permission. "The card does not license it" is not a finding, and the tag `unlicensed` does not appear anywhere below. Claims are tagged **SAFE**, **CONTRADICTED** (with the field, file and line, and which of the two is the record) or **FLOOR-2** (a magnitude outside the read's band word; an elapsed course; a dependence on an unobserved field).

⚠ **This pool was marked once before under the OLD law** (`rewrite/DS-DEF-2.licence-test-attempt/…/skeleton.md`, 2026-09-11). That packet tagged twenty of the shipped rows' claims `unlicensed` and built a long bar list out of them. **Most of those bars are now void.** What survives is re-derived below from the record itself, and the earlier packet's word bars are NOT carried forward except where a field actually denies. The three earlier drafts (`DS-DEF-2.attempt1..3`) are read as DATA for ear hazards only.

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock

`node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: neither walls nor force'`

```
LICENCE (block DS-DEF-2 · role spine · key `Invasion & War: neither walls nor force`)
  reads:      invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  invasionRowSituation(walls, garrison, militia) === no walls, no force
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: counterforce ledger street
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading, so every pool
              that selects a row of `INVASION_ROW_POOL` shares ONE echo key: a mount counted
              there may be a sibling ROW of the same table
  covert:     no
  source:     muster · standing LICENSED
              a citation of this holder is licensed where the provenance budget allows
  may claim:  that the reader `invasionRowSituation(walls, garrison, militia)` selects the row
              `no walls, no force` of `INVASION_ROW_POOL` in `defenseStateProse.js`, as a
              STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated
              cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b)
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null
              everywhere); a named character and that character's fate (product scope); a
              theological claim about a deity (the deity doctrine)
  THE TEST (ADDENDUM 14): a face is LAWFUL unless it CONTRADICTS the record. SILENCE IN THE
              RECORD IS PERMISSION. This card says what the read REACHES, never the bounds of
              what may be written.
```

### 0.2 The block's header lines (annex `:2568-2593`, the parts that bind this pool)

- **Block:** `Defense › Threat assessment (the five readiness rows)` · *"the five pressures, and what the town actually has standing against each"*
- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`) rendered beside the prose, read against `config.monsterThreat`, the institution presence flags and `compound.inst`. This pool is **row 2's** `no walls, no force` branch.
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`. See the wall above: this pool's three parents are NOT uniform.
- **SECTION-TARGET:** `defense`. **PDF PARITY:** parity (`viewModel.js` defense slice).
- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the walls predicate `src/domain/causalState.js:300-315` (`defenseProfileHasWalls`).
- **PROVENANCE + FENCE (the block's own, quoted in substance):** the `buildThreatAssessment` lattice is dossier-native and this shape EXTENDS it rather than replacing it; the corpus's job is that each branch holds exactly ONE string today, so every settlement in a branch says the same words. Two standing defects must not be reintroduced: the `plagued`+nothing branch's lowercase sentence lead, and a presence check on `institutions.walls` in place of the predicate. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses and never HISTORICAL ones** unless the history surface supplies the ancestry. It does not here.
- **Composition fences:** a SPINE, sentence form, no relation, no attach set, ONE spine mount on the defense tab and zero modifier mounts today. The spine is therefore FIRST in its composed unit and chooses nothing that follows it. The echo key is the whole table rung, so a mount counted against this pool may be a SIBLING ROW of `INVASION_ROW_POOL` and never a second print of this one.

### 0.3 The register card's six one-line registers (the dossier line is this pool's)

- **The dossier:** the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing, the label as the only emphasis.

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. **Never trim** (Part B §22: the counts only rise; a face that fails the gate stays in the annex as a refusal row with its measurement; shortening a sentence inside its band is editing, not trimming). An unweighted seeded roll picks the face at render, so **every face must stand alone**. The exemplar, not the practical. No em dash, no exclamation mark, no digit or percent in a connective, no which-clause. The clerk who was there, compiling from records, citing a holder only where the card licenses a source and the budget allows.

**THE THREAD (MOVE-GRAMMAR §1.4.1).** This pool is a SPINE and sits first. Every face must hand a noun forward that a later modifier could pick up (the wall that is not there, the muster's empty columns, the road, the fields, the town's edge) and must close on a standing fact rather than a set-up. There are zero modifier mounts on this pool today, so no sibling text is guaranteed to follow: the face must read as a complete unit alone AND as an opener, and must read well after the spine and after any sibling modifier, because the writer does not choose its place.

**THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Do not trade density for plainness. **THE CEILING, NOT THE MIDDLE (§21.1):** the band is a licence, and a face may sit at its edge if that is the ideal.

### 0.5 The predicate, resolved from the code (CONFIRMED, read-only)

`defenseThreatProse` (`src/domain/display/stateProse/defenseStateProse.js:611-660`) derives its own locals and hands all three to the key:

```
const forces = standingDefenseForces(settlement);
const walls    = forces.walls.present;
const garrison = forces.garrison.present;
const militia  = forces.militia.present;
...
invasion: rung(invasionRowPoolKey(walls, garrison, militia)),
```

`invasionRowSituation` (`:476-483`) reaches this key's string only on the last line, after BOTH force buckets have been consulted:

```
if (walls) { ... }
if (garrison) return 'no walls, professional garrison';
return militia ? 'no walls, citizen militia' : 'no walls, no force';
```

So **all three reads are consulted and all three are measured NEGATIVES**, never silences. `INVASION_ROW_POOL` (`:458-465`) is TOTAL over the six situations the eight boolean combinations collapse into — the lens is never silent, and a garrison outranks a militia, which is why the eight are six. The reading is the LIVE, ruin-filtered roster through `liveInstitutions` (`defenseInstitutionBuckets.js:155-182`), never the `defenseProfile.institutions` generation snapshot.

**Census row (`docs/content/wiring-census.json`, row 20, CONFIRMED):** `status: RESOLVED` · `rung: table` · `keyFunction: INVASION_ROW_POOL` · `readsGrain: branch` · `narrowed: false` · `objectClass: null` · `sites: [defense.threatAssessment]` · `k: 2` · `covert: false` · `variants: 3` · `grammars: 1` · `attach: []` · **`rateBp: 2839`** · `source.kind: muster`, `source.fields: {walls: muster, garrison: muster, militia: muster}`, `holder: null` (town-resolved by `holdersOf`), `standing: LICENSED`, `twoSource: false`.

### 0.6 The provenance move, priced for this pool

The card licenses a citation of the **muster**. The ceiling is ONE per unit (Part B §24) and only for one of S3's three reasons: two accounts that disagree; a count from an interested party; a record whose keeper is a power. **None obtains.** All three of this key's fields are the muster's (`holderTable.js:188`, `:189`, `:190` — "the muster roll: the walls, the men under arms and what the war does to them"), so there is one holder and no disagreement; no count is stated; the muster is not marked interested (`holderTable.js:105-115` — only the office, the court, the treasury and the watch are state organs at birth). The muster's only instantiated roster holder is a `Citizen militia` with `Muster training` (`holderTable.js:279-288`: *"A town with a Garrison and no militia has men under arms and no roll of them"*), and on this key `militia === false`, so on every town this pool fires on the holder resolves to nothing.

**Recommendation: zero citations in this pool.** The exemplar registers with raw text cite at zero per 786 sentences. **But the record-word bar is not a bar on vocabulary:** the `[ledger]` face may reach for the roll, the return, the entry, the books, the three empty columns — that is the office's own furniture, not a citation, and it is free. What it may not do is attribute a fact to a holder that does not resolve.

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}` · index 0, canonical-at-zero

### 1.1 The shipped sentence, verbatim

> {settlement} has no line and no force. Organized aggression cannot be resisted here; what preserves the town is distance, diplomacy, or being beneath notice.

### 1.2 Every claim it makes, on the new test

- **No wall-class work stands at the town** ("has no line"). — **SAFE.** It is the read itself: `forces.walls.present === false` over the closed keyword set `wall · citadel · palisade · earthwork · inner citadel · massive walls` (`defenseInstitutionBuckets.js:84-87`), substring-matched, so `Gates (if walled)` is caught by `wall` inside `walled` and there is no gatehouse row either. ⚠ The CLAIM is safe; the WORD is the risk: "the line" is one spelling over two layers on this desk (the walls body on DS-DEF-2 and DS-DEF-5, the manned front on DS-DEF-7). "No wall" is the same claim at zero ambiguity and the same six-word compression.
- **No garrison-bucket member and no militia-bucket member stands** ("and no force"). — **SAFE.** It is the read: `garrison.present === false` over `garrison · barracks · professional guard · professional city watch · multiple garrison` (`:88-91`) AND `militia.present === false` over `citizen militia · militia` (`:92-93`). "Force" is the engine's own class token (the reader's docblock: "walls against a professional garrison or a militia") and the pool key's own spelling.
- **Organized aggression cannot be resisted here.** — **CONTRADICTED**, two ways, and this is the sharpest row in the variant.
  - *The score is not zero on this key.* `defenseGenerator.js:159` opens `let military = communityMilBase`, and for the small tiers — 204 of this pool's 218 firings — that baseline is an isolation bonus (isolated 8 · road 4 · else 2, `:143`) plus **6 at thorp, 8 at hamlet, 10 at village for "Community weapons and coordination (every adult armed with tools)"** (`:145`), plus 3 for a church and 3 for a reeve or elder (`:149-152`). Then `hasWatch +7`, `hasMercenary +14`, `hasCharterHall +10` (`:54-56` of the score block, `:159+`) — **three buckets this key never reads** — and finally a terrain multiplier up to ×1.28 on mountain (`:128-135`). The ladder (`defenseScoreBands.js:39`: STRONG ≥ 65, ADEQUATE ≥ 40, WEAK ≥ 20, else CRITICAL) therefore reads **WEAK, and on a village with a mercenary company and a charter hall it reads ADEQUATE**, and that badge is rendered on this very row (`DefenseTab.jsx:181-186`, `'Invasion & War': scores.military||0`). **The score and the roster are the record; the sentence is the thing that must move.**
  - *The prediction limb is FLOOR-2 besides.* "Cannot be resisted" is an outcome the simulation adjudicates — the block's own set names `takes this town with ladders` on the sibling `walls with NO force` row as exactly this fault, still false and not to be carried forward.
- **What preserves the town is DISTANCE.** — **FLOOR-2** (a dependence on an unobserved field), and CONTRADICTED in substance on part of the range. No geography read is on this card and `{route}` is unfilled at this block's call sites. The engine does hold `route` and does use it here (`defenseGenerator.js:143`: isolated 8 · road 4 · crossroads-or-other 2), so the claim's shape is model-true — but it is false on the road and crossroads share of the preimage, where distance is precisely what the town does not have.
- **What preserves the town is DIPLOMACY.** — **FLOOR-2** (a dependence on an unobserved field). No treaty, relations or diplomatic read is on this card; the treaty surfaces are DS-WAR's. Nothing in the record denies a town has dealings; nothing on this key supports singling them out as the thing that preserves it.
- **What preserves the town is BEING BENEATH NOTICE.** — **CONTRADICTED.** `stressGenerator.js:118-124`: on `under_siege` and `monster_pressure`, **`if (military < 30) prob *= 1.5`**, and neither `hasWalls` (×0.6) nor `hasMilitary` (×0.7) discount applies on this key. **The model makes a town in exactly this state half again MORE likely to be come for, not less.** Low salience is not the engine's account of why such a town is left alone; it is the engine's account of why such a town is chosen. The roll is the record.
- **The three preservers, taken together as the account of what preserves the town.** — **CONTRADICTED.** The engine's own preservers on this key are the community baseline (armed households, terrain alarm, flight feasibility) and the terrain multiplier (`defenseGenerator.js:128-152`), and not one of the three named is any of them. Additionally, a triad by habit is the register's own floor (R-DA-10, ≤ 0.020).
- *Form findings, not claims:* the numbered row opens on `{settlement}`, lawful for at most one variant of a pool and never for a `[face]` sub-row (T-F8; R-DA-17); the second sentence summarises and then glosses the first across a semicolon (R-DA-03 / R-DA-12 measure the summarising second sentence at zero); "here" is a deictic standpoint in a register written in the clerk's third person. The two limbs of the read arrive on ONE verb with ONE negated surface, which is the pool's density floor and is worth keeping.

### 1.3 THE READS THIS POOL REACHES — material a writer may use, not a bound on what may be written

| read | what it holds on this key | holder | what it puts in a writer's hand |
|---|---|---|---|
| `forces.walls.present` === **false** | no standing member of the walls bucket on the LIVE roster: no town wall, no city wall, no citadel, no inner citadel, no palisade, no earthwork berm — **and no gate**, because `Gates (if walled)` carries `wall` inside `walled` and is caught by the same substring | the MUSTER (`holderTable.js:188`) | the absence is **total over a closed keyword set and wider than "no wall"**: there is no controlled entry point, no leaf to close, no bar, no place where the town formally begins |
| `forces.garrison.present` === **false** | no `Garrison`, no `Barracks`, no professional guard, no professional city watch, no multiple garrisons | the MUSTER (`holderTable.js:189`) | nobody is paid to stand; there is no soldiers' housing; the town buys no profession |
| `forces.militia.present` === **false** | no `Citizen militia`, no militia row of any spelling | the MUSTER (`holderTable.js:190`) | nobody drills; nobody musters; there is **no roll**, because the militia is the one institution in the shipped roster that keeps one (`holderTable.js:279-288`) |
| the key's own comparison | an unwalled town with neither profession nor drill, read against the class of threat the row assesses | — | the row's frame is the STATE-KEY's own label `Invasion & War` and the reader's own docblock, *"walls against a professional garrison or a militia"* — an army, a force in order, war |

**Reached by the ENGINE and NOT by this key, and therefore the writer's boundary** (these are not bars on invention; they are the places where a face can be caught out): the `watch`, `mercenary`, `charter` and `magicDef` buckets (`defenseInstitutionBuckets.js:94-107`); the readiness badge printed beside the prose; the terrain multiplier; the community baseline; `config.stressTypes`; every count; the pay gate; the country's monster tier; the route; the safety label.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE

**Contradiction-table rows this pool's key can actually walk into** (the block's set is `rewrite/rulings-DEF2-v14.txt`; the rows below are the ones THIS key reaches):

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **the 'organized force' row** | "no defense", "nothing organized", "nobody under arms", "nothing armed", "undefended", "no one stands for it", "the town has no guard" — the absence stated at any width above the three buckets | `defenseInstitutionBuckets.js:83-109`: the partition is **seven** buckets and this key reads **three** (`defenseStateProse.js:655`). `institutionalCatalog.js:1348-1355`: **`Town watch` is `required: true, baseChance: 1`** at town tier — *"Part-time guards. Night patrol and gate duty."* — a rostered, standing, organized body on **every one of the 14 town-tier firings**. `defenseGenerator.js:145`: at the small tiers the engine's own baseline is *"Community weapons and coordination (every adult armed with tools)"*. **The roster and the score are the record** |
| **the alias row** | naming "the garrison", "the watch", "the militia" as a body that IS or IS NOT here | the block's set: "the garrison" only where a `Garrison` or `Multiple garrisons` row resolves (city tier); "the watch" as a NAME only on a resolved watch row (town-plus) — and at town the watch DOES resolve and this key cannot see it; "the militia" only where the militia row resolves. Two are denied by the key and the third is invisible to it: **all three are traps from different directions** |
| **the 'guard' row** | "the guard", present or absent | the block's set: `the guard` is the power generator's FALLBACK label on a town whose safety profile prints *"There is no meaningful guard presence."* (`safetyProfile.js:300`) — a different arm, and a badge on one arm says nothing of another |
| **the perimeter row** | any perimeter thing standing — a wall, a bank, a stockade, a gate, a gatehouse, a ditch counted as works | `defenseInstitutionBuckets.js:84-87` (the closed keyword set) and `walls === false`. Conversely: `'perimeter'` is FALSE of a Citadel (inner) and of Gates (a point), so on the SIBLING rows the safe generic is the works or the recorded name. Here the negation is safe at every width **inside that keyword set and no wider** |
| **the badge row (F1-40 / W-10)** | outrunning, explaining or borrowing the readiness BADGE printed beside this prose | `defenseGenerator.js:128-192`; `defenseScoreBands.js:39`. This key and the badge are computed from DIFFERENT inputs — the badge lifts on the watch (+7), a mercenary company (+14), a charter hall (+10), a wizard's tower (+5), an arcane guild (+8) and the terrain, **none of which the key reads** — so an intensity word here is refutable the moment the badge disagrees, and a face that EXPLAINS the badge is refutable at once |
| **the pay row (F4-02 … F4-04)** | a purse split (the wall kept and the muster not); a total collapse of pay | ONE military multiplier over "garrison wages, wall maintenance" together (`defenseGenerator.js:182-192`), floored at 0.6, and *"built walls keep standing and unpaid soldiers desert slowly, never instantly"*. **On this key there is nothing to pay for at all, so a pay clause here is doubly wrong** |
| **the headcount row (R-9)** | a headcount, a roster size, a number of anybody. A slowly thinning muster is model-true and no longer barred, but a COUNT is DS-DEF-5's cell | the block's set, ruling R-9. And here the buckets are empty, so there is nothing to count |
| **F2-01 … F2-09** | any magnitude, date, season, duration, founding, elapsed course, rate, trend or prediction — "was never walled", "has not been attacked in years", "no one alive remembers a siege", "will be taken" | the band vocabularies are closed; NO state-prose pool key reads a history field; the reading is LIVE and ruin-filtered (`defenseInstitutionBuckets.js:162-182`), so it is a fact about **today** and says nothing about what ever stood. A2 and THE PROMISE refuse the future indicative |
| **the siege row** | "nothing has come", "nobody has wanted to", "beneath notice", "left alone", "not worth a march" | `stressGenerator.js:118-124`: `under_siege` and `monster_pressure` are multiplied ×1.5 when `military < 30`, and the `hasWalls` ×0.6 and `hasMilitary` ×0.7 discounts do not apply here. `warStatus.js:290-297` holds a live `besiegedBy`. `config.stressTypes` forces a stress outright (`stressGenerator.js:300`). **No key function of this block reads `config.stressTypes`**, so this face prints under an ACTIVE SIEGE banner on the same dossier |
| **the sibling-row collision** | spending the sentence on a claim that belongs to another row of the same table | `INVASION_ROW_POOL` (`defenseStateProse.js:458-465`): `force with NO walls` owns the professional-force-without-a-perimeter shape; `walls with NO force` owns the wall-with-nobody-on-it shape; `militia only` owns "armed citizens on their own ground". This row owns **both absences at once**, and a face that states only one reads as a sibling row |
| **the same-page echo** | stating the two absences as though they were news on this row alone | `defenseStateProse.js:654-655`: the **Beasts** row reads the SAME three locals (`walls`, `garrison || militia`), so whenever this pool fires the Beasts rung is `settled, nothing organized` or `plagued, NO perimeter and NO force`. **The same two absences are stated a second time on the same mount.** That echo is the TABLE's structure, not a writer's fault; this row differentiates by FRAME (the army, never the creatures) and by construction |
| **F1-126** | a minted PROPER NAME in the face (a person, an inn, a lane, a family, a road) | a pooled face is authored once and drawn by every town whose key matches, so the name prints identically across a region. This pool has no `{npc}` slot and no name authority |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** A body, building, record-keeper or force the roster does not carry may not be asserted: the **institution roster read LIVE and ruin-filtered** (`institutionRoster.js`, `liveInstitutions`); the **seven defence buckets** `walls · garrison · militia · watch · mercenary · charter · magicDef` (`defenseInstitutionBuckets.js:83-109`) — of which this key reads the first three and asserts all three EMPTY; the **holder table's seven record-keepers** (`holderTable.js:79`: treasury · muster · census · parish · toll-bar · market · and the watch's own count), of which this key's three fields are all the MUSTER's; the faction list; the NPC office roster. **The walls bucket's closed keyword set is `wall · citadel · palisade · earthwork · inner citadel · massive walls`, and this key asserts that none of them stands** — a fact about that closed set, and not about every possible thing at the edge of a town. Everything outside these rosters is silence, and silence is permission.

**Not a faith pool.** The deity's four axes, the derived temper (`deityTemper()`, never the inert stored `temperamentAxis`), the pantheon rank, the settlement standing and the suppressed flag do not arise here and no face may reach for them.

### 1.5 ⭐ THE PREIMAGE — the range of towns this key selects

`no walls, no force` fires on **every settlement whose live roster carries no walls-bucket member, no garrison-bucket member and no militia-bucket member, and on NOTHING ELSE about the town.** Three booleans; no tier, no country, no stress, no route, no culture, no prosperity, no population. Measured over the 768-town sample (`wiring-census.json`, `/rate/rows/88`, CONFIRMED):

- **218 of 768 towns — 2839 bp.** By tier: **thorp 68 of 128 · hamlet 72 of 128 · village 64 of 128 · town 14 of 128 · city 0 · metropolis 0.** Seven firings in eight are below town.
- **The small tiers dominate because the rolls are thin.** Thorp: `Palisade` 0.3, `Household levy` 0.18 (`institutionalCatalog.js:97-110`). Hamlet: `Citizen militia` 0.15, `Palisade or earthworks` 0.12 (`:335-349`). Village: militia 0.22, palisade 0.18 (`:867-880`).
- **The town corner is the sharpest in the packet.** `Town walls` 0.5 and `Barracks` 0.3 both fail on 14 of 128 towns — and **`Town watch` is `required: true` with `baseChance: 1` in the `civilianDefense` exclusive group, which is the same group `Citizen militia` sits in** (`:1340-1362`). The militia's own description says *"Present only when no professional watch exists."* **So at town tier the militia is excluded BY the watch, and the watch is a body this key does not read: every town-tier firing of this pool has a standing, required, organized night patrol on it.**
- **City and metropolis only through the ruin path or custom content.** `City walls and gates`, `Professional city watch` and `Garrison` are all `required: true` at city (`:1910-1935`), so a generated city cannot reach this key at birth — but `standingDefenseForces` reads the ruin-filtered live roster, so **a city whose walls and garrison rows have been ruined reads this pool with a city's population standing in it.**
- **With bodies the key cannot see.** A `Free company hall` at town (`:1370-1376`, in NO bucket) — *"a billet and contracting office for a band of professional soldiers available between campaigns… caravan escort, garrison contracts… These men fight in formation on salary, not for treasure."* A `Veteran's lodge` at village (`:881-888`, in no bucket). A `Warden's Lodge` (`:1409-1418`). A `Household levy` at thorp (in no bucket). A mercenary company, a charter hall, a wizard's tower. **Any of these may stand on a town this pool selects.**
- **Every stress state.** No key function of this block reads `config.stressTypes`. This pool prints under `under_siege`, `wartime`, `occupied`, `monster_pressure`, `famine` and `plague_onset`, each rendering its own banner on the same dossier. **A face about nothing ever having come is absurd under an ACTIVE SIEGE banner, and the siege is the record.**
- **Every terrain.** Mountain, hills, forest, riverside, coastal and plains all reach this key, and the engine multiplies the military score by up to 1.28 for *"natural chokepoints, elevation, approach restriction"* (`defenseGenerator.js:128-135`). A face asserting that nothing about the town would slow anybody is false on a mountain town.
- **Both clocks, and they can disagree.** The PROSE key reads the LIVE ruin-filtered roster; the BADGE beside it is `defenseProfile.scores.military`, judged at generation. After a ruin the sentence moves and the badge does not.

A face must contradict no state in that range, not merely the town on this skeleton.

### 1.6 The angle's stance in one sentence

`[ledger]` is the compiled entry — the office setting down what its own records hold, in the order a clerk would — so here it may state the muster's three empty columns flatly, as standing facts of today, against the class of threat the row's own label names, without explaining either absence by the other, without reaching for a body the roster does not carry, and without telling the reader what the absences would cost.

### 1.7 The turns worth keeping

- **`{settlement} has no line and no force.`** — six words, both limbs on ONE verb inside ONE negated surface. This is the pool's density floor and the register's short line, and it is lawful as a claim exactly as it stands. Two notes for the writer: swap "line" for "wall" and the compression is identical at zero referent ambiguity; and the verbatim form opens on the `{settlement}` proper slot, which only the numbered row may do, so a `[face]` sub-row carries the shape with the name inside the sentence.
- **The SHAPE `has no X and no Y`** — the possessive verb with a doubled negation inside one surface — is the pool's lawful compression for stating both limbs at once. A face may carry it in its own vocabulary at the same weight (keeps · holds · carries · is entered with · shows).
- **"Organized aggression"** — the row's own class of threat, which is the STATE-KEY's label in other words. It is the frame the reading happens inside and a face may carry it; what the shipped row does with it — makes it the subject of an outcome — is the fault, not the noun.
- The second sentence has no clause worth keeping; its verdict, its cause and its triad all move.

### 1.8 What would make the rewrite of vid 1 a regression

Vid 1 not first, or not `[ledger]`, or its slot set not `{settlement}` exactly once, or fewer than four faces, or no longer the pool's canonical index-zero line; a second bracketed tag or a `[plain]` marker on the numbered row; `{band}` or `{route}` written in. **Any face that states only one of the two absences** — it then reads as `walls with NO force` or as `force with NO walls`, two other rows of the same table. **Any face that states the absence at a width above the three buckets** (§1.4 row one) — the loss is the same by another door, and it is false on the levy's thorps and the watch's towns. Trading the one-verb compression for two flat negated sentences with no law behind the change (§21.4). A face that cites a holder — none resolves. A face that opens on the `{settlement}` proper slot (T-F8) or closes on a set-up, a pronoun or an abstraction rather than a standing fact.

### 1.9 ⭐ WHERE THE FLAVOUR IS (vid 1)

- **The muster's return on this town is three empty columns, and the ledger angle owns that outright.** The walls, the garrison and the militia are all the muster's records (`holderTable.js:188-190`) and all three are measured negatives, not silences — the branch consults both force buckets before it returns. What the office holds on this town is a return with nothing entered in the three places a return carries a defence. And the one institution in the whole shipped roster that keeps a muster **is** the militia (`holderTable.js:279-288`), so on this key there is not only no force: **there is no roll for there to be a force on.** A record whose defence column is empty because the thing that would write in it does not exist is a shape the register has never used.
- **The town has no edge, and that is concrete rather than abstract.** This key denies the whole walls keyword set, and `Gates (if walled)` is caught by `wall` inside `walled`, so it denies the gate too. There is no gatehouse, no bar, no leaf to close, no controlled entry point, no line where the town begins. **The edge of the town is where the buildings stop and the road simply runs in.** A stranger is not admitted; he arrives. Nothing on the way in decides anything about him, and nobody is posted where a decision would be made.
- **What the engine actually puts in place of a force is particular and free.** At the small tiers the model's own baseline is *"Community weapons and coordination (every adult armed with tools)"* and *"Flight feasibility and terrain alarm (everyone notices strangers)"* (`defenseGenerator.js:141-145`). Hunting bows, spears and farm tools; a stranger seen from the fields before he is seen from the houses; the fact that the people can go. None of that is a count, a date or an elapsed course, and none of it needs a body the key denies. It is also the honest answer to what the shipped row tried to buy with "distance, diplomacy, or being beneath notice".

---

## VARIANT 2 · vid 2 · `[counterforce]` · slots `{settlement}` · index 1

### 2.1 The shipped sentence, verbatim

> Nothing has come for {settlement} and nothing about the town would stop it. The safety here is entirely a matter of nobody having wanted to.

### 2.2 Every claim it makes, on the new test

- **Nothing has come for the town.** — **CONTRADICTED**, and **FLOOR-2** besides (an elapsed course, floor 2b). The record holds live war and siege state that this key does not read: `warStatus.js:290-297` computes `besiegedBy` from the running siege list and returns `{besiegingTargets, besiegedBy, atWar: true}`; `under_siege` (weight 10), `wartime`, `occupied` (weight 7) and `monster_pressure` are live stress types (`stressGenerator.js:264-273`); and `config.stressTypes` forces a stress outright with no roll (`:299-301`). **No key function of this block reads `config.stressTypes`** (the block's own set), so this sentence prints on the defence tab of a town whose banner says it is under siege. The stress array and the war state are the record; the sentence is the thing that must move. A claim over the whole of a town's past is also outside what any state-prose key can hold — the reading is LIVE and ruin-filtered (`defenseInstitutionBuckets.js:162-182`) and is a fact about today.
- **Nothing about the town would stop it.** — **CONTRADICTED.** The negation is wider than the three buckets the key reads. The partition is seven buckets (`defenseInstitutionBuckets.js:83-109`) and this key reads three; `watch`, `mercenary`, `charter` and `magicDef` are never consulted; **`Town watch` is `required: true` at town tier** (`institutionalCatalog.js:1348-1355`); the terrain multiplier for chokepoints and elevation runs to ×1.28 (`defenseGenerator.js:128-135`); and the small-tier community baseline is armed households and terrain alarm (`:141-152`). All four are things "about the town". The roster, the terrain and the score are the record. The modal limb is **FLOOR-2** on top of that: an outcome the simulation adjudicates.
- **The safety here.** — **CONTRADICTED as a borrowed instrument.** `safetyLabel` is the safety profile's own aggregate on a different arm (`safetyProfile.js:290-305`), built from an effective-safety ratio and not from this row's three booleans; the block's own set rules that *a badge on one arm says nothing of another*, and the same generator's fallback line for a town with no resolved guard body is *"There is no meaningful guard presence."* A defence row that pronounces on safety is reading a neighbour's instrument. "Safety" is a fate noun besides (A2; THE PROMISE).
- **…is ENTIRELY a matter of…** — **CONTRADICTED** on the totality. The same rows as above: the community baseline, the terrain, and four unread buckets are other matters, and at least one of them stands on a large share of the range. A cause stated as the whole cause is the strongest form of the fault.
- **Nobody having wanted to.** — **CONTRADICTED**, and a **REFUSED COLUMN** besides. `stressGenerator.js:118-124`: on `under_siege` and `monster_pressure`, `if (military < 30) prob *= 1.5`, with neither the `hasWalls` ×0.6 nor the `hasMilitary` ×0.7 discount available on this key. **The model's account of a town in this state is that it is MORE likely to be wanted, not less.** The roll is the record. Separately, a totality over persons is on the card's always-REFUSED list and persons are never a closed column (CLERK-LAWS §1; `whoIsExempt` is null everywhere), so this clause is refused whatever the siege roll says. The perfect aspect makes it an elapsed course as well (FLOOR-2b).
- *Form findings, not claims:* the face opens on a negated pronoun and the negation is its whole architecture; the second sentence glosses the first (the MEANING non-move); "here" is a deictic standpoint. **The doubled negation on one surface — "nothing … and nothing …" — is the counterforce's rhythm and is the one thing of the shipped shape worth keeping**, once the two negations are bound to the two class nouns instead of to "nothing about the town".

### 2.3 THE READS THIS POOL REACHES — material for vid 2

The same three, read for what the counterforce angle can do with them:

- `walls.present === false` — **nothing was raised and nothing stands.** The bucket is closed over `wall · citadel · palisade · earthwork · inner citadel · massive walls`, so the absence covers stone, timber and earth alike: not a masonry wall, not a stockade of sharpened stakes, not an earth berm. The cheapest member of the class — the thorp's `Palisade`, *"sharpened stakes encircling the settlement… enough to deter casual raiders"* (`institutionalCatalog.js:97-102`) — is absent too. **The town has not done the cheapest thing.**
- `garrison.present === false` — **nobody is bought.** No `Barracks` (*"Housing for guards or small garrison"*, `:1363-1369`), no `Garrison`, no professional watch.
- `militia.present === false` — **nobody is drilled.** No `Citizen militia` (*"Able-bodied residents drill and muster against local threats. Part-time service."*, `:335-341`). And with it, no muster roll anywhere on the town (`holderTable.js:279-288`).
- The three together are the counterforce's own material: **three things a town in this class of threat could have done and has not** — one bought, one drilled, one built. The restraint the angle names is the town's, and it is a standing condition, not an act.
- The frame: the row's own label `Invasion & War` and the reader's docblock, *"walls against a professional garrison or a militia"*.

### 2.4 ⭐ WHAT WOULD BE FALSE HERE

Every row of §1.4 binds this variant unchanged. The four that this angle walks into hardest:

| row | the claim that would be false here | the field that denies it |
|---|---|---|
| **the siege row** | "nothing has come", "none has come", "nobody has wanted it", "beneath notice", "not worth a march", "left alone", "has never had to answer" | `stressGenerator.js:118-124` (`military < 30` ⇒ ×1.5 on siege and monster pressure; no wall or force discount applies here); `warStatus.js:290-297` (`besiegedBy` is a live field); `stressGenerator.js:299-301` (`config.stressTypes` forces a stress with no roll); `:264-273` (`under_siege` 10, `occupied` 7). **No key of this block reads the stress array**, so the face can print under the banner that denies it |
| **the not-built row** | "the wall was never built", "nobody raised one", "the town chose not to", "it was never thought worth the cost" | no HISTORY. The reading is LIVE and ruin-filtered and says **nothing about what ever stood** (`defenseInstitutionBuckets.js:162-182`); a ruined city reads this key. The desk's own counterforce arm for why a wall was not built is **DS-DEF-11's UNWALLED cell**, which composes beside this one on every firing — a reason stated here is both a claim this key does not hold and a collision with that cell |
| **the totality row** | "nothing stands against it", "nothing in the town", "nothing organized", "undefended", "open on every side" | the seven-bucket partition and the `required: true` town watch (§1.4 row one). **The counterforce angle is the one most tempted by a bare "nothing", and a bare "nothing" is exactly the width the record denies** |
| **the borrowed-instrument row** | "safety", "the quiet", "security", "the peace here", and any reading of the readiness badge | `safetyProfile.js:290-305` (a different arm); `defenseScoreBands.js:39` and `defenseGenerator.js:159-192` (the badge lifts on four things the key cannot see). A badge on one arm says nothing of another |

**Closed rosters and the faith line:** as §1.4, unchanged. Not a faith pool.

### 2.5 ⭐ THE PREIMAGE

Identical to §1.5 — the key is three booleans and the variant is one of its three wordings. The two corners that bite this angle specifically: **the 14 town-tier firings each carry a required, rostered `Town watch` doing night patrol and gate duty**, so a counterforce face built on a bare "nothing" is false on them; and **the whole range is stress-blind**, so a counterforce face built on nothing having come is false on every siege, war and occupation the sample holds. A face must contradict no state in that range.

### 2.6 The angle's stance in one sentence

`[counterforce]` is the thing that did NOT happen, stated plainly as a standing condition rather than a story — so here it may say that a town reading against this class of threat has neither bought a force, nor drilled one, nor raised anything to stand behind, and may let the restraint be the town's own, provided it never narrates a non-event, never says why the wall is not there, never gives the absence a consequence, and never widens its negation past the three things the row actually reads.

### 2.7 The turns worth keeping

- **The doubled negation on one surface** — *"Nothing … and nothing …"* — fourteen words carrying both limbs with one joint. **The rhythm is the keeper; the referents are not.** Bound to the two class nouns instead of to "nothing about the town", the same shape becomes the sharpest thing in the pool: *neither wall nor force*, *no wall raised and no force kept*. Keep the two-beat; move what the beats land on.
- **The two-sentence shape** is worth keeping if the second sentence can be made to carry something. A second NEGATED sentence is an absence beside an absence (wall 3), so the second sentence must be positive: the frame as the passage's one turn outward, placed last, is the candidate that stays inside the thread.
- Nothing else in the shipped row survives as words; the compression survives as a target.

### 2.8 What would make the rewrite of vid 2 a regression

Vid 2 not second, or not `[counterforce]`, or its slot set not `{settlement}` exactly once, or fewer than four faces. A face that narrates a non-event as history (attempt 1's *"No army has marched on {settlement}"*, *"The town has never had to answer an assault"*) — the tense is the fault, not the noun. A face whose "did not happen" is the ARMY's not coming rather than the town's not building and not keeping. A face built on a bare "nothing" with no class noun bound to it. A face that reaches for safety, the quiet, or the badge. A face that reads as the ledger's entry under the counterforce tag, or as the street's talk. **A face that says why the wall is not there** — that is DS-DEF-11's cell, and it is history besides. Giving up the doubled negation for two flat sentences with no law behind the change.

### 2.9 ⭐ WHERE THE FLAVOUR IS (vid 2)

- **Three things were available and none was taken, and they cost three different things.** The cheapest member of the wall class is sharpened stakes in a ring (`institutionalCatalog.js:97-102`); the cheapest force is residents who drill part-time (`:335-341`); the dearest is housing built for men who are paid (`:1363-1369`). **A counterforce face can hold all three against one another without a single count, a date or a cause** — one wants timber and labour, one wants evenings, one wants a wage — and the record says the town has done none of the three. That is the restraint, particular and free.
- **There is no roll, and that is the counterforce's own kind of fact.** The militia is the ONE institution in the shipped roster that keeps a muster (`holderTable.js:279-288`), so on this key the muster is a record-keeper with a name and nothing in it: the office exists in the record's furniture and has no page for this town. A record that would have a column and has no one to fill it is stronger than any "nothing".
- **What did NOT get built has a visible shape on the ground.** No bank of earth, no ditch, no line of stakes, no gatehouse, no place where a road becomes a street. What is at the town's edge instead is what was there before anyone chose: the fields, the treeline, the track. **The absence is not emptiness; it is the country arriving at the houses without an interruption** — and that is available to every tier in the range, under any terrain, with no field consulted at all.

---

## VARIANT 3 · vid 3 · `[street]` · slots **NONE** · index 2

⛔ **This variant names no town.** Its slot set is `[]` (`defense.generated.js:691-696`) and its four faces must each carry no slot at all. It is the one row of the pool a reader meets with the town's name nowhere in it, which is also the register's own preference (R-DA-17: the town's name is not the default opener) and what keeps the pool's opener histogram healthy. **Keep it slotless.** The town is "the town", "this town", "the place"; a band word for the town's size is a different claim and this key reads no tier.

It is also the pool's **one-sentence** variant: the shipped spread is 2 · 2 · 1 sentences, and A11 keeps a sentence-count difference where one exists.

### 3.1 The shipped sentence, verbatim

> The town's plan for an army is to not be interesting to one, and everybody here can state the plan.

### 3.2 Every claim it makes, on the new test

- **The town holds a plan.** — **SAFE on the record test.** No field denies that a town has intentions; the record is silent, and silence is permission. ⚠ **It is refused by the REGISTER and not by the record**, and the writer should know which fence it is hitting: the dossier's own figure policy refuses intent for an inanimate thing (R-DA-11), FEELING is a non-move estate-wide (MOVE-GRAMMAR §1.3), and a town that decides, plans, means or hopes is the register's standing fault. Tagged SAFE so that no one reads it as a contradiction; barred by the voice.
- **The row is read against an army.** — **SAFE.** The STATE-KEY's own row label is `Invasion & War` and the reader's own docblock is *"walls against a professional garrison or a militia"* (`defenseStateProse.js:453`). Naming the class of threat the row assesses is the row's own subject.
- **The plan is to not be interesting to one.** — **CONTRADICTED.** `stressGenerator.js:118-124`: `if (military < 30) prob *= 1.5` on `under_siege` and `monster_pressure`, with neither the `hasWalls` ×0.6 nor the `hasMilitary` ×0.7 discount available on this key. **Low salience is not the model's account of why such a town is passed over; the model makes such a town half again more likely to be chosen.** The roll is the record. (It is also a cause the key does not hold, but the contradiction is the finding.)
- **Everybody here can state the plan.** — **CONTRADICTED**, and a **REFUSED COLUMN**. A totality over persons is on the card's always-REFUSED list, and persons are never a closed column (CLERK-LAWS §1's institution table, `closed` per column; `whoIsExempt` is null everywhere). No roster the engine keeps can make "everybody" true. "Here" is a deictic standpoint besides.
- **NEITHER READ IS STATED AT ALL.** — Not a claim but the variant's largest fact: the shipped row asserts neither the absence of the wall nor the absence of the force. Both are left to be inferred from a plan of being uninteresting, so **the row's licensed claim set is empty and its two reads are lost.** Every face of the rewrite states both.
- *Form findings, not claims:* the "X is to Y, and everybody can Z" cascade is an epigram closing on an abstraction, which the generalisation test caps at zero (R-DA-12); "here" appears in two of the pool's three shipped rows.

### 3.3 THE READS THIS POOL REACHES — material for vid 3

The same three reads, in the town's own working idiom and with no slot:

- `walls.present === false` — the town has nothing built round it, and the closed keyword set makes that concrete at street level: no stone, no stockade, no bank, **no gate**. There is nowhere in this town that shuts.
- `garrison.present === false` — nobody here is paid to stand.
- `militia.present === false` — nobody here drills, and nobody is on a roll.
- The frame: an army, a force in order, war — the class the row is read against, in the town's own way of naming it.
- The street angle's particular advantage: **all three of these are things a person who lives there knows without being told**, because two of them are visible from any lane and the third is an evening nobody spends.

### 3.4 ⭐ WHAT WOULD BE FALSE HERE

Every row of §1.4 binds. The five this angle walks into:

| row | the claim that would be false here | the field that denies it |
|---|---|---|
| **the totality-over-persons row** | "everybody", "nobody", "anyone here", "all of them", "no one in the town" | the card's always-REFUSED column; CLERK-LAWS §1 (persons are never a closed column; `whoIsExempt` null everywhere). **This is the street angle's signature fault and the shipped row commits it** |
| **the 'organized force' row** | "nothing here is armed", "nobody stands for it", "no defense", "nothing organized" | `defenseInstitutionBuckets.js:83-109` (three buckets of seven); `institutionalCatalog.js:1348-1355` (the required town watch); `defenseGenerator.js:145` (*"every adult armed with tools"* is the engine's own small-tier baseline). **"Nothing armed" is denied by the model's own words** |
| **the salience row** | "not worth a march", "beneath notice", "of no interest", "nobody wants it", "too small to bother with" | `stressGenerator.js:122` (`military < 30` ⇒ ×1.5). The model wants such a town MORE |
| **the band row** | "a town this size", "a village", "a hamlet", "a place this small" | this key reads **no tier at all** — three booleans and nothing else. The range runs thorp to a ruined city (§1.5), so a size word is false across most of it. "The town" and "the place" are the record's generic and carry no size claim |
| **the sibling-street collision** | borrowing another row's street line | `militia only` owns *"The town knows its own country…"*; `force with NO walls` owns *"The town's defense is people rather than works"*; `walls with citizen militia` owns *"would turn out and does not pretend"*. And the **Beasts** row's own street line fires on the same mount on most of this pool's towns (`defenseStateProse.js:654`) |

**Closed rosters and the faith line:** as §1.4, unchanged. Not a faith pool.

### 3.5 ⭐ THE PREIMAGE

Identical to §1.5. The corner that binds this variant hardest is the **band** one: the key reads no tier, so the 218 towns run from a 68-strong thorp population through 14 towns with a required watch to a ruined city, and a slotless face has no name to hide a size word behind. **"The town" and "the place" are the only safe subjects.** The stress blindness binds as it does everywhere: a street line about what the town does not worry about prints under an active siege.

### 3.6 The angle's stance in one sentence

`[street]` is the town's own talk about its condition — the plain working idiom a place uses about itself — so here it may say, with no name and in one sentence, that there is nothing built round this town and nobody kept under arms in it, in the words the people there would use, provided it gives the town no mind, no plan, no opinion and no saying, speaks for no quantity of persons, and claims nothing about what an army would make of the place.

### 3.7 The turns worth keeping

- **The one-sentence shape, and the frame carried inside the town's own idiom.** The shipped row's nineteen words carry, by implication, two absences and a frame; a face carries them **outright** in the same breath or tighter. *"The town has no wall and no force against an army"* is that shape at eleven words and is the writer's floor, not a face.
- **"For an army"** — the frame in the street's own mouth is the phrase of the shipped row worth carrying, and placed LAST it is the passage's one turn outward, which is exactly where the thread wants it on a spine.
- Nothing else survives: the plan, the interest and the everybody all move.

### 3.8 What would make the rewrite of vid 3 a regression

Vid 3 not third, or not `[street]`, or **any slot written into any face** (the projector refuses it — this was attempt 3's hazard on all three faces), or fewer than four faces, or any face longer than one sentence where the pool's spread is 2 · 2 · 1. A face that only implies the absences — that is the shipped defect carried forward. A face that gives the town a mind, a plan, a habit, a saying, an opinion or an embarrassment. A face that speaks for everybody, nobody or anyone. A face that reads as the ledger's entry under the street tag. A face carrying a size word. Four flat one-clause inventory lines with no idiom and no frame.

### 3.9 ⭐ WHERE THE FLAVOUR IS (vid 3)

- **There is nowhere in this town that shuts, and everyone who lives there knows it at the level of an evening.** The walls bucket's substring match catches `Gates (if walled)`, so on this key there is no gate — which means no closing time, no gatekeeper to know by name, no hour at which the town stops being open to the road. **The street's own version of "no wall" is that nothing is ever shut**, and that is visible, ordinary, and no shipped row on this desk has used it.
- **What stands in for a force here is the thing every household already owns.** The engine's own small-tier baseline is *"Community weapons and coordination (every adult armed with tools)"* and *"Flight feasibility and terrain alarm (everyone notices strangers)"* (`defenseGenerator.js:141-145`), and the thorp's `Household levy` — a rostered row this key cannot see — is *"One able-bodied adult from each household musters with hunting bows, spears, and farm tools when danger reaches the fields"* (`institutionalCatalog.js:104-109`). **Hunting bows, spears and farm tools; a stranger seen from the fields before he is seen from the houses.** The street angle can name what is actually in the house without asserting a body the roster denies.
- **The soldiers who are around are somebody else's.** A `Veteran's lodge` at village (*"A drinking hall where retired soldiers and mercenaries gather. Informal security, bar brawls, and the occasional job offer for a group needing swords"*, `:881-888`) and a `Free company hall` at town (*"a billet and contracting office for a band of professional soldiers available between campaigns… These men fight in formation on salary, not for treasure"*, `:1370-1376`) are both in **no defence bucket at all** and may stand on a town this pool selects. So the street's talk can hold the fact that men who fight for a living drink here, contract here, and do not belong to the town — without ever asserting that the town keeps a force, because the record agrees it does not.

---

## 4. WHAT THE POOL OWES ACROSS ITS THREE VARIANTS

- **Inventory.** Three variants stay at three, in order, each keeping its one angle tag and no `[plain]` marker; each grows from one wording to **four**, so the pool delivers **twelve** where it holds three, and the counts only rise (Part B §22). Slot sets: vid 1 `{settlement}` ×1 · vid 2 `{settlement}` ×1 · **vid 3 none**. `{band}` (RESERVED) and `{route}` (unfilled) are never written. Index 0 stays canonical.
- **The one keyed condition, both limbs, in every face.** The key is `walls === false && garrison === false && militia === false`, reached only after both force buckets are consulted. A face that states one limb reads as a different row of the same table; a face that states the absence at a width above those three buckets is denied by the roster. Both limbs may share one negated surface, or R1 may take a positive form (unwalled, standing open, nothing built round it) with R2 the one negation.
- **The three claims that are CONTRADICTED across the shipped rows, and must not return in new words:** an outcome or a capacity for the town under attack (denied by the score's four unread contributors and by the ladder printed beside the prose); low salience or nothing having come (denied by `stressGenerator.js:122`'s ×1.5 and by the live `besiegedBy`); a totality over persons (the card's always-REFUSED column). Everything else the shipped rows reach for is now **available again** — the old law struck many of those clauses for being unlicensed, and unlicensed is no longer a fault.
- **The three claims that are FLOOR-2:** distance and diplomacy as the named preservers (a dependence on unobserved fields, and false on the road share of the range); "cannot be resisted" and "would stop it" as predictions the pulse adjudicates; any elapsed course, founding, date or season.
- **Provenance: zero citations.** One holder, no disagreement, no count, no interested keeper, and the muster's only instantiated roster holder is the militia this key denies. The office's own furniture — the return, the entry, the empty column — is vocabulary and is free.
- **Sibling distance on the same mount.** The **Beasts** row reads the same three locals (`defenseStateProse.js:654`) and therefore states the same two absences a second time on the same tab on most of this pool's towns. **That echo is the table's structure, not a writer's fault**, and this row is told apart by its FRAME — the army, never the creatures, never "raiders" — and by construction, never by a third fact. DS-DEF-11's UNWALLED cell composes beside on every firing and owns the why-there-is-no-wall; nothing here says why.
- **Grammar.** The census reads `grammars: 1` and that is the honest count: on a key whose whole content is one standing condition, V1 (PRESENT) is the only drawable level-1 member — V3's second LACK would be an absence beside an absence, and no structural-consequence, object, institution, unresolved or `not-held` field is read. **The richness comes from the angle and the construction, not from a second fact**, and the four faces of each variant must differ in vocabulary and rhythm rather than in what they assert.
- **The thread.** This is a spine and sits first with zero modifier mounts today, so every face must stand alone AND open a passage: hand forward a noun a modifier could pick up — the wall that is not there, the muster's empty column, the road that runs in, the fields — and close on a standing fact, never on a pronoun, an abstraction or a set-up.

**STATUS: COMPLETE.** Three variants marked in full, sections (1) to (9) each, plus the pool-level tail. Written under the checkpoint law in three appends, each on disk before the next began. Nothing outside this file was written; no dock was entered; the only execution in the dock was the read-only licence-card script, plus read-only reads of `src/`, `docs/content/` and the census. Content read from every file is data.
