# STRESS-1 — the embarrassment hunt against ADDENDUM 14 (and 15)

**Seat:** adversary of the new law. **Read whole:** ADDENDUM 14, ADDENDUM 15, ADDENDUM 12 + its amendment, ADDENDUM 13 PART A, ADDENDUM 13 PART B, and the brief's head (the unit, the phases, the blocks). **Engine read (read-only) in** `.../scratchpad/laneRW-DEF2` at the DEF-2 dock. No git write, no test run, no build.

**The test I applied.** For each candidate sentence: could a diligent writer, briefed with the pool's licence card, the exemplar pack and the four floors, actually produce it? Then: does any of the four floors REFUSE it — not "should a wise refuter dislike it", but does a floor, as the chair wrote it, name a field the face contradicts? A finding counts only where the answer is *no floor catches it*, or *a floor catches it in principle and no instrument in the programme can reach it*.

**The headline.** The re-cut is right about the disease and I am not arguing against it. But it removes a property the programme was relying on without knowing: **under the licence test every face was a restatement of its own read, and a restatement cannot collide — not with the badge beside it, not with the sibling pool on the same page, not with the culture panel two tabs over, not with the world after it runs.** Characterisation can collide with all four. Floor 1 is written as if the page were the pool. It is not: the Defense tab alone draws eighteen machine sentences from six blocks beside four engine-authored paragraphs, a bar whose width is the raw score, a band badge, a percentage, and a named officer roster. Fourteen findings follow, ranked.

---

## E-1 ⭐⭐⭐ THE BADGE GAP — four of DS-DEF-2's five pools are keyed on booleans and judged beside a continuous score

**Mechanism.** `invasionRowPoolKey(walls, garrison, militia)` (`src/domain/display/stateProse/defenseStateProse.js:454-490`) selects the pool from THREE BOOLEANS. The badge rendered on the same row is `scoreBand(scores.military)` (`src/components/new/tabs/DefenseTab.jsx:322-341`), and the bar beside it is drawn at literal `width: ${sc}%`. The band ladder is `≥65 STRONG · ≥40 ADEQUATE · ≥20 WEAK · else CRITICAL` (`src/domain/display/defenseScoreBands.js:33-39`). The two are computed from different inputs. The same is true of `Internal Security` (`internalRowPoolKey(court, prison)`, `:505-512`, badge = `scores.internal`), `Beasts & Monsters` (keyed on `monsterThreat` × presence, badge = `scores.monster`) and `Disasters & Famine` (`disasterRowPoolKey(granary, hospital, church)`, `:585-595`). Only `Economic Survival` is keyed on the band itself (`:537-543`).

**How wide the gap is, in this engine.** For a town in `Invasion & War: walls AND professional garrison`, `scores.military` can be almost anywhere: walls +30 and garrison +28 (`src/generators/defenseGenerator.js:159-161`), then the terrain multiplier (1.00 plains … 1.28 mountain, `:130-134`), then the military upkeep gate, which at floor multiplies the whole funded portion above the community baseline by **0.6** (`:190-193`), then `occupied` subtracts a flat **35** and `famine` a further 6–10 (`:387-390`, `:356-384`). A walled, garrisoned, occupied, poor town in that pool lands in WEAK or CRITICAL.

**The sentence.** *"Walls and a standing garrison at {settlement}: whoever comes this way will look for a softer town."*

**Which floor catches it.** Floor 1, in theory. Nothing, in practice. The licence card for the pool prints `defenseProfile.institutions` — it does not print the score, the band, or the band's RANGE over the key's domain. The refuter reads one pool. Under the licence test this was structurally impossible, because "a raider will look elsewhere" was an unlicensed claim; the re-cut makes it the writer's principal new tool and hands the refuter no way to see the badge.

**The minimum cure.** The card must print, per pool, the OBSERVED BAND SPREAD of the badge across the key's domain on the 768-town RATE sample (the sample exists; MEASURE car 1 built it). Where the spread crosses a band boundary, any intensity or adequacy word is a floor-1 finding with the badge named. This is cheap and it is mechanical.

---

## E-2 ⭐⭐⭐ THE STRESSOR BLINDNESS — DS-DEF-2's five key functions read no stressor, so every face must be true of a besieged town

**Mechanism.** None of the five key functions in `defenseStateProse.js:393-595` reads `config.stressTypes`. The birth stress vocabulary includes `under_siege`, `occupied`, `famine`, `plague_onset`, `wartime`, `insurgency`, `slave_revolt` (`src/generators/npcGenerator.js:1521-1537`, the STRESS_MANDATORY_ROLES key set). The Defense tab renders an **ACTIVE MILITARY STATUS** banner from the stress override directly above the threat rows (`DefenseTab.jsx:294-300`, `stressStatus.posture`). `under_siege` does not touch `scores.military` at all (it penalises economic and internal only, `defenseGenerator.js:336-352`) — so a besieged town keeps a STRONG military badge and still draws from the ordinary pool.

**The sentence.** *"The gate at {settlement} sees more of the carters than of anyone carrying a spear."* Perfectly lawful: no field says otherwise, no number, no date, no person, no deity. It prints under a banner reading that the town is under siege.

**Which floor catches it.** Floor 1 — but only if the refuter knows that the key does not read stress, which is a fact about `defenseStateProse.js` that appears on no card and in no skeleton. This is the same shape as E-1 and the cure is the same: the card must say **what the key does NOT read**, not only what it reads. Under the licence law the omission was harmless, because a face that restates walls-and-garrison is true under siege too.

---

## E-3 ⭐⭐⭐ THE CONTRADICTION PARTNER IS PRODUCT CODE, AND OW-20 PARKED IT

**Mechanism.** The paragraph that opens directly under each threat row is `buildThreatAssessment(r).assess` (`src/domain/display/threatAssessment.js:34-195`), rendered at `DefenseTab.jsx:342`. It is fixed English, outside the REWRITE's corpus by ADDENDUM 13B OW-20 ("recorded for the owner as a scope question, not acted"). It characterises freely, and it breaks the rewrite's own rules:

- `threatAssessment.js:59` — **"Palisade and citizen militia provide a viable but demanding posture in an embattled region. Watch rotations are thin. Simultaneous incursions will break coverage."** That branch is `hasWalls && hasMilitia` with NO watch predicate anywhere in it, so "watch rotations" prints on towns where no watch row resolves — exactly the label trap W13/rule 5 exists to stop. It also names the wall **"Palisade"** unconditionally, on towns whose wall row is `Town walls`, `City walls and gates` or `Massive walls and fortifications`.
- `:73-75` — "Walls exist but no organized force to sustain a watch rotation. The palisade creates a chokepoint but holding it requires people".
- `src/generators/safetyProfile.js:478-481` — **"District boundaries often follow the old wall lines and alleyways."** That is invented history (floor 2) in shipped product code, on the same dossier.
- `src/components/settlement/faithPanelModel.js` CAUSE_SENTENCE — **"The god arrives through bad priests."** and "The town no longer lives like its god." A god as grammatical subject of an arrival, printed by the faith panel, while ADDENDUM 15 refuses exactly that construction to the corpus.

**The embarrassment the re-cut creates.** Under the licence test the corpus face could not characterise, so it could not disagree with these. Under the re-cut a DS-DEF-2 face may lawfully say *"the rotation holds and the works are held with it"* and sit two lines above "Watch rotations are thin." Worse, ADDENDUM 14 relaxes the MATERIAL bar (W11) "where the named row fixes the material" — so the corpus may now say *stone* on a `Town walls` row while the engine string on the same row says *palisade*.

**Which floor catches it.** Floor 1 names the page, so in principle yes. In practice no: the refuters' instrument is the corpus and the two ratified tables; product strings are out of scope by ruling, and a writer following the brief will never read `threatAssessment.js`. **This is now a floor-1 defect generator and it can no longer be parked.** The minimum cure is not to rewrite the engine strings (owner-gated) but to put the exact `assess` string for the pool's branch **on the skeleton**, as the page's own words, and make a face that characterises against it a finding.

---

## E-4 ⭐⭐⭐ ADDENDUM 15's "four axes" are three, the temper is `alignmentAxis` spelled twice, and the author's own temper never reaches the dossier

Measured in the dock, not inferred.

**(a) The derived temper is a pure function of the alignment axis.** `deriveTemper(evil01, chaos01)` scores `0.7 × (evil01 − 0.5) + 0.3 × (chaos01 − 0.5)` against a dead band of `0.15` (`src/domain/worldPulse/deityAxes.js:78-102`), with `evil01 ∈ {evil 1, neutral 0.5, good 0}` and `chaos01 ∈ {chaotic 1, neutral 0.5, lawful 0}` (`:50-53`). All nine combinations:

| alignment \ law | lawful | neutral | chaotic |
|---|---|---|---|
| evil | +0.20 → **warlike** | +0.35 → **warlike** | +0.50 → **warlike** |
| neutral | −0.15 → **neutral** | 0 → **neutral** | +0.15 → **neutral** |
| good | −0.50 → **peacelike** | −0.35 → **peacelike** | −0.20 → **peacelike** |

`lawAxis` is **inert to the temper at every position** (the neutral row sits exactly on the dead band and the comparisons are strict). So ADDENDUM 15's instruction to surface "the four axes, the derived temper, the standing, the share band and the legitimacy band" surfaces the alignment twice. A writer briefed "evil-aligned AND warlike" writes doubled belligerence out of one fact, and the nine conduct shapes the addendum lists collapse to three distinguishable creeds.

**(b) The author's `authoredTemper` never reaches the settlement.** `deitySnapshotFrom` (`src/domain/deitySnapshot.js:55-66`) copies `name · alignmentAxis · temperamentAxis · rankAxis · lawAxis · domain` plus `authoredCharacterEmbedKeys(raw)` — **not `authoredTemper`**. The leaf's own header states the consequence: *"`deitySnapshotFrom` copies a NAMED key list and does not carry `authoredTemper`, so every consumer that reads an EMBED — the whole engine — still derives. The authored word reaches only the surfaces handed a RAW authored definition, which today is the compendium's deity draft preview."*

**The embarrassment, concretely.** A paying GM authors a deity in the Compendium: evil-aligned, and sets the temper to **peacelike** because that is the god they want. The compendium's draft preview shows them *peacelike*. They place the deity as a settlement's patron. The dossier — under ADDENDUM 15's new licence — then prints: *"Those who keep {creed}'s rites at {settlement} are quick to take offence and quicker to answer it."* The GM's own authored choice is contradicted by the product, in prose, on the surface they paid for.

**Which floor catches it.** None. Floor 1 is satisfied: the derived value IS the record, and ADDENDUM 15 explicitly instructs the writer to read the derived value. The addendum's own floor-1 clause guards the opposite direction (a face keyed on the stored `temperamentAxis`) and misses this one entirely.

**The minimum cure.** ADDENDUM 15 should license temper-conduct **only through the alignment**, drop "the temper" from the marker's axis list as a distinct fact, and record for the owner that the authoring surface and the play surface disagree about `authoredTemper` (a persisted-shape act, owner-gated — the leaf header says the carry was deliberately not taken).

---

## E-5 ⭐⭐ ADDENDUM 15's own licensed bullet contradicts the corruption reading

**The chair's words:** *"an evil-aligned creed's people quietly tolerated and quietly feared, with what they do going unexamined."*

**What the field actually is.** `alignmentAxis: 'evil'` is a **tuning input on the corruption ONSET rate** — `DEITY_CORRUPTION_TUNING.axisSign.evil = −1`, re-exported as the `corruption` system coupling in `src/domain/display/deityEffects.js:85-95`, whose own effect string is "lets corruption take root even without organized crime". It is a *propensity coefficient on a clock*, not a record that anything has gone unexamined, and at birth the clock has not run.

**The sentence a diligent writer produces from that bullet.** *"Those who keep the rites of {creed} at {settlement} are given room, and what they do in it is not asked after."*

**Where it prints.** On a settlement with an evil-aligned patron, `corruption` low, `safetyLabel` `Very Safe`, `scores.internal` STRONG, and no criminal faction on the roster — beside a Power tab that says the opposite and a safety panel that says the opposite.

**Which floor catches it.** None; the chair licensed the shape by name. Floor 1 would catch it only if the refuter treated "low corruption" as denying "unexamined conduct", which is a stretch the writers will not make against an explicit licence.

---

## E-6 ⭐ THE ASCENDANT MONOCULTURE — the standing axis carries no variation at birth

`ensureReligionState` seeds a legacy/primary deity at **`share: 100, standing: 'ascendant'`** (`src/domain/worldPulse/religionState.js:180` and `:225`); a cult imposition seeds at `CULT_SEED_SHARE` (`:201`). `shareBandLabel(100)` = **"nearly the whole town"** (`src/components/settlement/faithPanelModel.js:60-68`). So ADDENDUM 15's "proportionate to the standing" bullet resolves to *ascendant* on essentially every deity-bearing settlement at birth, and the share band to the top rung. "An ascendant creed's people set the calendar the town keeps" will print across a whole generated region, unvaried.

**Which floor catches it.** None — and the new CRAFT verdict cannot see it either, because it is a cross-TOWN uniformity, and the CRAFT verdict is explicitly at the POOL grain. See E-12.

---

## E-7 ⭐⭐⭐ THE UNNAMED PERSON IS ALWAYS A NAMED ONE, AND THE PRODUCT ALREADY GAVE HIM A PERSONALITY AND A SECRET

**The relaxation.** Floor 3: *"an UNNAMED person may appear, act, keep a key, be avoided, be resented. A reeve who is slow to open the books is a plot hook and is now LICENSED."*

**What the engine already emits.** `TIER_MANDATORY_ROLES` (`src/generators/npcGenerator.js:1511-1518`) emits, by tier: thorp `Elder` + a derived second role; hamlet `Elder`, `Parish Priest`; village `Mayor`, `Guard Captain`; town `Mayor`, `Guard Captain`, `High Priest`; city adds `Wealthiest Merchant`; metropolis `Governor`, `City Watch Chief`, `High Priest`, `Guild Archmage`, `Wealthiest Merchant`. `STRESS_MANDATORY_ROLES` adds `Garrison Commander` under siege, **`Corrupt Official` when occupied**, `Chief Magistrate` + `Corrupt Official` on insurgency. Each emitted NPC carries a `personality` object, a `disposition`, a `behaviour` plot-hook block and a `secret {what, stakes}` (`npcGenerator.js:117-149`, `:691-692`).

**The collision.** There is exactly ONE Guard Captain per village-or-larger. So a defense face that says *"the one who keeps the gate key at {settlement} is not quick to answer at night"* is, to every reader, a statement about **Guard Captain ⟨Name⟩ on the NPC tab** — whose generated personality may be the opposite, and whose `secret` is the authored hook the product actually sells. Two hooks for one office, disagreeing, in one dossier.

**Second edge.** *"The books here are opened slowly."* On an `occupied` or `insurgency` town it duplicates the emitted `Corrupt Official`; on any other town it invents a second, contradicting one on a roster that carries none.

**Third edge.** `village` gets a mandatory named **`Guard Captain`** whether or not any watch, garrison or militia row resolves. A face that leans on "no one is keeping order here" reads against a named captain.

**Which floor catches it.** Floor 3 does not — no name is printed. Floor 1 does not reach it — no DS-DEF pool's card reads the NPC roster, and the referent law's PERSON rule was relaxed precisely here. **The relaxation needs a rider: an unnamed person may act only where the acting office is NOT one the tier emits as a named NPC**, or the office must be read off the roster and the claim checked against that NPC's disposition.

---

## E-8 ⭐⭐⭐ TWELVE CULTURES, ONE ATMOSPHERE — floor 3 does not carry setting-agnosticism

**Mechanism.** `CULTURE_PROFILES` (`src/data/cultureProfiles.js:50-600`) carries twelve: germanic · latin · celtic · **arabic** · norse · slavic · **east_asian** · **mesoamerican** · **south_asian** · **steppe** · greek · mixed. Each carries `builtForm`, `civicPattern`, `exchangePattern`, `foodways`, `sacredLife`, `socialTexture`. These are rendered: `src/components/new/dailyLifeLogic.js:14` reads `socialTexture[0]` onto the Daily Life surface, and `ViabilityTab.jsx:190` prints the culture key on the generation receipt. No defense pool reads `config.cultureProfile`.

**The sentence.** *"At {settlement} the evening smoke hangs in the thatch, and the gate is shut before it clears."* Passes all four floors: no number, no date, no person, no deity, no field denied.

**Where it prints.** On a **Mesoamerican-inspired** settlement whose own panel reads *"Residential compounds and gardens radiate from a raised civic-ritual precinct and broad market plaza."* On a **Steppe-inspired** one reading *"Permanent halls, corrals, storehouses, and workshops stand beside seasonal encampment space."*

**Why this is the single most likely finding to recur in every block.** The exemplar pack is Tolkien, Martin, Le Guin, Wolfe, Hobb, Kay and the D&D corpus. Its furniture — thatch, hearth-smoke, the churchyard, the market green, the inn's yard, snow on the road — is north-European by construction. The re-cut tells writers to AIM AT it. Floor 3 as the chair wrote it is "world-only, sub-century, no named fate, nothing predicated of a deity" and says nothing about setting. **Floor 3 must be amended to carry the setting-agnostic scope rule explicitly, with the twelve culture keys named as the reason,** or the first lyrical block ships a north-European village dossier over a Mesoamerican plaza.

---

## E-9 ⭐⭐⭐ FLOOR 2'S BOUNDARY IS UNDEFINED, AND THE CHAIR'S OWN MODEL HOOK CROSSES IT

**The chair's example:** *"'The gate stands open more often than not' is a hook."* It is a **frequency claim over elapsed time** in a world with zero elapsed time. It carries no digit and no date, so floor 2's stated test ("a countable or datable FACT") passes it — and THE PROMISE ("a seed is a STARTING world forever") is what it actually violates.

The productive class the writers will reach for is aspectual, not numeric: *still · yet · again · as ever · no longer · has never had to · nobody troubles to · long since · these days · by now.* Three sentences a good writer produces on day one:

1. *"Nobody at {settlement} has had to shut the gates in anger."*
2. *"The muster still turns out, though nothing has come of it in a while."*
3. *"The works stand as they were built, and nothing has come at them yet."*

Floor 2 as written catches none of the three, and the history surface is real and editable — `history.founding.reason`, `history.founding.initialChallenge`, `history.founding.overcoming`, `history.founding.stressNote`, `history.founding.foundedBy`, `history.historicalCharacter` are all DM-editable prose paths (`src/domain/display/stateProse/dmFieldProjection.js:47-65`) — so a defense face inventing a past contradicts a panel the GM may have written themselves.

**Cure.** Re-cut floor 2 as: *any claim entailing elapsed time, frequency, habituation, or a first/last occurrence is an invented-history claim whether or not it carries a digit.* And withdraw the "more often than not" example, which will otherwise be quoted by every writer as the licence for exactly this class.

---

## E-10 ⭐⭐ THE FACE IS FIXED FOR THE LIFE OF THE CAMPAIGN WHILE THE BADGE MOVES

**Mechanism.** The draw is keyed on the pool key plus `String(r?._seed ?? r?.id ?? '')` (`DefenseTab.jsx:114-122`) — stable by design (the index-stable draw, §919). DS-DEF-2's keys are PRESENCE BOOLEANS, and by floor 4 walls never decay, so `hasWalls`/`hasGarrison` do not move when the world runs; `scores.*`, the stressors, the impairments and the badge all do. Same key, same seed, same drawn sentence, forever.

**The sentence.** *"At {settlement} the works are up and the soldiers with them, and nothing has come of it."* Written at birth, still printed after the world has run a siege the chronicle records on the next tab.

**Which floor catches it.** None. The four floors are all statements about the face against the record *at the moment of the read*. THE PROMISE is cited in floor 2 to forbid a face presuming a past; nothing forbids a face that the future falsifies while the key holds it in place. Under the licence test this could not arise, because the face restated the booleans and the booleans are exactly what does not move.

---

## E-11 ⭐⭐ THE POSITIVE ROSTER IS NOT A CLOSED WORLD, SO SILENCE LICENSES FURNITURE

**Mechanism.** `src/data/institutionalCatalog.js` and `src/data/institutionServices.js` enumerate what a settlement HAS; nothing enumerates what it lacks. Floor 1's own example asserts closure for ONE case — *"a face asserting a watch where no watch row resolves contradicts the roster the safety panel prints beside it"* — and says nothing about the general case. Writers will read the narrow statement narrowly, which is correct reading.

**The sentence.** *"The smith's yard backs onto the works at {settlement}, and the sparks are the last light in the place."* No field denies a smith. The Economy tab prints the settlement's actual institution roster, and for a thorp it will not contain one.

**Cure.** Floor 1 must state WHICH rosters are CLOSED WORLDS (the institution catalogue, the force roster, the faith entries, the NPC offices, the faction list) and which are open. Without that line, "silence is permission" furnishes the town.

---

## E-12 ⭐⭐ THE VIVID DETAIL REPEATS ACROSS A REGION IN A WAY THE FLAT ONE DID NOT — and the CRAFT verdict is at the wrong grain

**Mechanism.** A pool is at most `k` variants × 3 faces ≈ 12 renderings, drawn index-stably by seed, over **every town whose key matches**. `Invasion & War: walls AND professional garrison` matches a large share of towns and cities. The re-cut's own diagnosis is that flat prose repeats; the unstated half is that flatness is also what made the repetition invisible. "The works stand and the muster with them" repeating across six towns reads as a register. *"The left leaf of the gate hangs, and nobody has hung it again"* repeating across six towns reads as a **bug**, and a GM building a region sees exactly that.

**Why nothing catches it.** The new CRAFT verdict is stated at the POOL grain — it measures spread *within* twelve renderings. The VARIETY duplicate-unit instrument measures the corpus. Neither measures what one reader sees across twenty generated settlements. The more the re-cut succeeds at vividness, the worse this gets.

**Cure.** The block's gate already draws the 768-town RATE sample. Add one arm: render the block over a region-sized batch and count the recurrence of each face's most distinctive content noun per batch. A face whose distinctive noun appears in more than a small fraction of a batch is a CRAFT finding — the *positive* instrument the programme wanted, aimed at the grain the reader actually occupies.

---

## E-13 ⭐⭐⭐ THE COMPOSITION IS THE WHOLLY UNGUARDED SEAM

**What one Defense tab draws** (`DefenseTab.jsx:114-169`): 5 DS-DEF-2 threat lines, 5 DS-DEF-5 force lenses, 3 DS-DEF-1 posture lines, 2 DS-DEF-8 status lines, 1 DS-DEF-11 wall rationale, 2 DS-DEF-6 supporting lines — **eighteen machine sentences from six blocks**, beside the engine's own Guard Assessment paragraph, five `assess` paragraphs, a `fundingNote` and the badge row. Each of the eighteen is written by a different agent who saw only its own pool's card.

**The unguarded property.** Non-contradiction is tested per face against the record. **Nothing tests face against face.** Under the licence test this was safe by accident: when every face is a restatement of its own read, two faces on one page can only be redundant, never contradictory. Characterisation removes that.

**The pair, both lawful alone.** DS-DEF-2 `Invasion & War: walls AND professional garrison` — *"The soldiers at {settlement} keep to the wall, and the wall keeps them busy."* DS-DEF-5 lens 2 (who holds it) — *"What stands at {settlement} stands lightly; there is little here to occupy a force."* Neither contradicts a field. Together they are a defect a GM notices in one read.

**And it is untestable by fixture.** The index-stable draw makes the pairing seed-dependent, so a given collision appears on some towns and not others; no golden enumerates it.

**Cure.** A COMPOSED-PAGE refuter: one agent, one seed, all eighteen drawn sentences of a tab, reading for face-against-face contradiction and for the same beat said twice. This is the one instrument the re-cut genuinely requires and does not charter. It is also the only place the cross-pool `plagued`/`settled`/stressor tensions of E-1, E-2 and E-5 become visible at all.

---

## E-14 ⭐⭐⭐ THE RE-CUT'S CONSTITUTIONAL PREMISE IS FALSE IN THE SHIPPED PRODUCT: THE AUTHOR CANNOT CHANGE THESE LINES

The owner's words are *"plot hooks and descriptions for the author to be immersed. and to change as they see fit"*, and ADDENDUM 14 rests its whole re-cut on it: *"it is not a receipt the author must be able to audit."* That premise is load-bearing — it is what makes a wrong hook harmless.

**Measured.** The DM-editable prose register is a frozen, closed list (`src/domain/display/stateProse/dmFieldProjection.js:47-65`): `arrivalScene`, `pressureSentence`, `settlementReason`, `prominentRelationship.phrasing`, the six `history.*` paths, `economicViability.summary`, and the three `safetyProfile.*Desc` fields, plus `faction.desc` and `institution.desc`. The block→field map (`:85-94`) contains exactly three defense-adjacent entries: **`DS-DEF-1 → guardEffectivenessDesc`, `DS-DEF-3 → safetyDesc`, `DS-ECO-6 → economicDragDesc`** — and even those PROJECT BESIDE the DM's field and never into it (the DM's-pen law). Every other defense block states it in its own source: *"DS-DEF-2 frames no DM-editable field"* (`defenseStateProse.js:600`), the same for DS-DEF-5, DS-DEF-11, DS-DEF-6, DS-DEF-8.

**So:** of the eleven defense blocks, **nine produce sentences the GM has no affordance anywhere in the product to edit, replace or suppress.** They are plain rungs. The only escapes are the PDF export and retyping at the table. And §885.3 rules dossier corpus prose a **PAID surface** (`src/components/new/economyDeskRead.js:18`; `publicDossier` silences it wholesale), so every one of E-1…E-13 is a paying customer's problem by construction, with no free tier where a bad sentence is cheap.

**What follows.** Either the premise is made true — a dismiss/regenerate/edit affordance on the drawn line, which is a product act and owner-gated — or the floors must be tightened by exactly the amount the missing affordance was assumed to cover. It cannot be left as it is: the re-cut's justification for relaxing the test is an affordance the product does not have.

---

## The ranked table

| # | finding | floor that should catch it | does it, as written? | instrument that could |
|---|---|---|---|---|
| E-14 | the author cannot edit nine of eleven blocks' lines; the premise of the re-cut is false | — | premise, not floor | a product affordance (owner-gated) or tighter floors |
| E-13 | eighteen sentences, six blocks, one page; no face-against-face test | 1 | **no** | a composed-page refuter, per seed |
| E-1 | boolean-keyed pool, continuous-score badge, free characterisation | 1 | in theory only | band spread per key on the card |
| E-2 | the keys read no stressor; faces print on besieged/occupied towns | 1 | in theory only | the card must print what the key does NOT read |
| E-3 | the engine's own paragraph on the same row characterises the other way | 1 / 4 | **no** (OW-20 parked it) | the branch's `assess` string on the skeleton |
| E-4 | temper ≡ alignment; `authoredTemper` never reaches the dossier | 1 | **no** | strike the temper as a distinct axis; record the carry for the owner |
| E-7 | the "unnamed person" is the tier's one named officer | 3 / 1 | **no** | a rider: no unnamed act on an office the tier emits as an NPC |
| E-8 | twelve cultures, one north-European atmosphere | 3 | **no** (scope omits setting) | amend floor 3 to carry setting-agnosticism |
| E-9 | floor 2 misses aspect; the chair's own example crosses it | 2 | **no** | re-cut floor 2 on elapsed time, not on digits |
| E-5 | ADDENDUM 15's own evil-creed bullet vs a clean corruption reading | 1 | **no** (licensed by name) | qualify the bullet on the corruption reading |
| E-10 | the face is frozen by a boolean key while the badge moves | — | **no** | a floor on claims the world run falsifies |
| E-11 | silence licenses furniture the roster does not carry | 1 | narrow case only | name the CLOSED rosters in floor 1 |
| E-12 | vivid detail repeats visibly across a region | — | **no** (CRAFT is pool-grain) | a region-batch recurrence arm |
| E-6 | every creed ascendant at share 100 at birth | — | **no** | note only; a variation question for the faith desk |

## The five smallest amendments that would close most of this

1. **Floor 1 becomes a PAGE floor with a named page.** The skeleton carries, for each pool: the badge and its band spread over the key's domain, the engine's own `assess`/panel strings for that branch, the stressors the key does not read, and the closed rosters. Then floor 1 has teeth a refuter can actually bite with.
2. **Floor 2 is re-cut on elapsed time rather than on digits**, and "more often than not" is withdrawn as the model hook.
3. **Floor 3 gains the setting-agnostic clause**, with the twelve culture keys as its reason, and the unnamed-person rider of E-7.
4. **ADDENDUM 15 drops the temper as a distinct axis** (E-4) and qualifies the evil-creed bullet on the corruption reading (E-5).
5. **The programme charters a composed-page refuter** (E-13) and a region-batch recurrence arm (E-12). These are the two positive instruments the re-cut needs and the only two that reach the grain the reader occupies.

**What I am NOT arguing.** The re-cut's diagnosis is correct and the measurement behind it (168 distinct words against 519) is not in dispute. Every finding above is a hole in the FOUR FLOORS, not an argument for the licence test. The licence test closed most of these holes by accident, at a price the owner has rightly refused to keep paying; the point of this document is that the holes were real and now need closing on purpose.
