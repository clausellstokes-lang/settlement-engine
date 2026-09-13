# DRAFT ROUND 1 — DS-DEF-2 · pool `Invasion & War: walls with NO force`

Writer seat: **Opus 5 (Fable-unvalidated)**, for the Fable chair. Written under **ADDENDUM 14**: a face is LAWFUL unless it CONTRADICTS the record; silence is permission; *"the card does not license it"* is not a finding. Instruments read whole before a word was written: the licence card (printed in the dock), `rewrite/recut/CONTRADICTION-TABLE.md` (the header strike-list and the DEF rows), `rewrite/recut/EXEMPLAR-PACK.md`, `prose-research/REGISTER-CARD.md`, `RULES-V2-PART-B.md` §1 · §16–16.2 · §18 · §20–23, `sweep/MOVE-GRAMMAR.md` §1–3 · §4.4.1–4.4.3 · §1.4.1, `sweep/CLERK-LAWS.md` §2.4.1 · §2.6.1, `arch-prose/ARCH-COMPOSED-PROSE-v2.md` §2.5 · §8.3, and the pool's skeleton.

**3 variants · 12 renderings (3 spine lines + 9 `[face]` sub-rows) · 0 refusals.**
Structure unchanged: the same three vids, the same order, each with its own single angle tag exactly as it stands. `{settlement}` is the only fill (the call site fills nothing else — `defenseStateProse.js:621`).

---

## THE ROWS, ready to paste under the pool's heading

**`Invasion & War`: walls with NO force**
1. `[ledger]` The upkeep of the works at {settlement} and the wages of soldiers come off one purse. The town keeps no soldiers of its own, and musters none.
   - `[face]` {settlement} keeps up a line and keeps neither garrison nor muster. The gate is barred and unbarred all the same, by whoever the barring falls to.
   - `[face]` No garrison is kept at {settlement} and no muster is raised there. What the town holds instead is a line and the bill for its keeping.
   - `[face]` A line stands at {settlement}, with no garrison kept and no muster raised. Who would stand in it, if it came to that, is left open.
2. `[visitor]` A stranger reaches the line at {settlement} before he reaches the town, and comes through it into a place that keeps no garrison of its own and raises no muster.
   - `[face]` Whoever is at the gate at {settlement} asks a stranger his business. The town behind it keeps no garrison for the line and raises no muster.
   - `[face]` The works at {settlement} are the first thing a stranger is shown and the keeping of them is the second, and no garrison or muster comes into it.
   - `[face]` Inside the line at {settlement} a stranger finds unbuilt ground, and a town that keeps no garrison and raises no muster. What the line is kept for is not explained to him.
3. `[street]` At {settlement} the keeping of the line falls to people whose trade is something else, because the town keeps no garrison to take it off them and musters none.
   - `[face]` Keeping the line at {settlement} costs somebody, and who it costs is the standing quarrel. The town keeps no garrison to carry it and no muster to divide it.
   - `[face]` Where the line at {settlement} is the back of the houses against it, whose repair that is the town leaves alone. The town keeps no garrison and raises no muster.
   - `[face]` In one account at {settlement} the line is kept because it is worth keeping; in another, because of who would be blamed. Neither account has soldiers in it: the town keeps no garrison and musters none.

---

## --- NOTES

### 0. The claim set every one of the twelve carries (claim-equality, ARCH §8.4 arm A6)

| claim | what makes it lawful |
|---|---|
| **a wall-class thing stands** (`the works` · `a line`) | the key's own predicate: `forces.walls.present === true` (`defenseStateProse.js:623-626`, `:476-484`); the card's `may claim` line. The class word is one true of every row in the preimage — `Palisade` · `Palisade or earthworks` · `Town walls` · `City walls and gates` · `Massive walls and fortifications` · `Inner citadel`. **No material word anywhere** (F1-32), **no source** (F1-33), **no "ring", "circuit" or "all the way round"** (F1-07 inverse) |
| **the town keeps no garrison** | `forces.garrison.present === false`, the key's second read (`defenseInstitutionBuckets.js:88-91`). Denying it is licensed by F4-18's pattern: the key consulted this bucket |
| **the town raises no muster** | `forces.militia.present === false`, the key's third read (`:92-94`). "The muster" as the class word is free everywhere (F1-03's own second sentence). **No muster ROLL is cited as a record** — the holder does not resolve on this key (F1-03 / §R-8) |
| **nothing else is denied** | the four buckets resolved in the same call and never read — `watch`, `mercenary`, `charter`, `magicDef` — are untouched by all twelve, and so are armed households (W-02), a custom night watch (W-03), the terrain multiplier (F4-07) and the arcane arm (F4-08). **No face contains "nobody", "everyone", "anyone", "not one" or "the town says"** (the card's REFUSED COLUMNS; F1-25) |

Every lack is phrased on what the TOWN **keeps / raises / musters**, never on who is or is not present. That is deliberate: an **occupied** member of this preimage has men at the gate who are not the town's (`occupationStatus.js:74-103`; F1-121), and the occupation note leaves the town's own bodies untouched. "No soldiers are met here" would be false there; "the town keeps no soldiers of its own" is true there. **"Soldiers" is also the precise word**: `Town watch` is *"Part-time guards"* and is never soldiers by its own catalogue row (F1-27), so a soldier-lack sweeps the garrison and the muster and nothing else.

### 1. Variant 1 · `[ledger]` — the one purse and the lawful lack

The angle's stance is what an office would enter. Its richest unused material is the purse: `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)` is ONE multiplier over *"garrison wages, wall maintenance"* together (`defenseGenerator.js:184-192`). Every face here holds the purse whole; **none splits it** (F4-02), **none claims a direction against a sibling gate** (F4-03), **none claims a total collapse of pay** (F4-04), and **none says the wage side is empty** — which would reach the watch, whose wages the same gate arms (F4-19).

| face | the claims it makes, and what makes each lawful |
|---|---|
| **1 (spine)** | *upkeep and wages come off one purse* — `defenseGenerator.js:184-192`, the engine's positive model, stated and not divided. *keeps no soldiers of its own* — garrison read false; *musters none* — militia read false. No figure (F2-01), no tense past the simple present |
| **2** | *keeps up a line* — the walls read. *neither garrison nor muster* — the two reads. *the gate is barred and unbarred* — `hasGates` fires on every walls row this key can select except a citadel-only one (`priorityHelpers.js:53`; see §5 residual 1); the gate is the engine's own reading on a palisade (F1-08). *by whoever the barring falls to* — an UNNAMED person acting, licensed by name under ADDENDUM 14 / W22 struck, and **not** the singular office the tier emits (F3-06): a plural indefinite, no key-holder as an office, no Guard Captain |
| **3** | the two reads as an absence opener (R-ii / W10's absence-opener cap is STRUCK). *a line and the bill for its keeping* — upkeep is modelled (`:184-185`); "bill" is a record word and W24 is struck entire. No amount, no arrears, no season |
| **4** | the walls read object-first. *Who would stand in it, if it came to that, is left open* — the OPEN QUESTION move, declarative, subjunctive edge (A2; MOVE-GRAMMAR §1.2 row 10). It **predicts nothing** — the shipped row's *"a determined attacker takes this town"* was the pool's floor-2 breach (F2-05) and it is gone |

### 2. Variant 2 · `[visitor]` — the approach, and what the answer names

The stance licenses what is visible on arrival. It measures nothing (F2-01), names no material (F1-32), spells no tier or band (F1-31), reaches for no intensity word beside a `scoreBand` badge that a member of this preimage can carry at `ADEQUATE` or `STRONG` (F1-40 / W-10) — *"serious perimeter"* is gone for exactly that reason — and asserts no safety and no doom (F1-34).

| face | the claims it makes, and what makes each lawful |
|---|---|
| **1 (spine)** | *reaches the line before he reaches the town* — a spatial fact about a standing wall row, no distance and no duration. *comes through it* — entry, not a gate assertion. *a place that keeps no garrison of its own and raises no muster* — the two reads, seated on the town's keeping so the occupied member is safe |
| **2** | *whoever is at the gate asks a stranger his business* — `Gates (if walled)` is *"Controlled entry points with gatekeepers"* (`institutionalCatalog.js:1356-1362`) and W-08 rules that a writer agreeing with either surface of the gate-duty collision cannot be failed. The person is indefinite and un-officed. The two reads follow on the town |
| **3** | *the first thing a stranger is shown … the second* — an order of showing, not an ordinal over events (F2-05's bar is events in time). *the keeping of them* — upkeep, modelled. *no garrison or muster comes into it* — the two reads, delivered as a withholding rather than a verdict (EXEMPLAR-PACK §17's short entry) |
| **4** | *unbuilt ground inside the line* — nothing in the record fixes how much of an enclosure is built up; a standing fact, **not a proportion** and not a comparative, so F2-01 is untouched. The two reads. *What the line is kept for is not explained to him* — an absence in the telling, left standing open (F1-112: the engine PRINTS tensions rather than explaining them away) |

### 3. Variant 3 · `[street]` — the work, the cost and the two accounts

The stance is the town's own talk, and it is the angle most exposed to the totality bar. **No face has "the town" as a speaker or a holder of one opinion** — the shipped *"and says so when pressed"* was that fault and it is gone. The subjects here are a practice, a cost, a stretch of fabric and two accounts.

| face | the claims it makes, and what makes each lawful |
|---|---|
| **1 (spine)** | *the keeping falls to people whose trade is something else* — an unnamed plural acting; consonant with the modal member of the preimage, whose `Town watch` row is *"Part-time guards"* by its own description, and unforced on every other member, where the record is simply silent. *the town keeps no garrison to take it off them and musters none* — the two reads, landing the civic fact on a trade (EXEMPLAR-PACK §6) |
| **2** | *keeping the line costs somebody* — upkeep is modelled and a cost has a bearer; **no amount, no arrears, no rate**. *who it costs is the standing quarrel* — a matter left standing open, declarative. *no garrison to carry it and no muster to divide it* — the two reads |
| **3** | *where the line is the back of the houses against it* — fabric, no material, no measure, no founding narrated (F2-03: nothing is "built", raised or dated; the houses stand). *whose repair that is the town leaves alone* — an unsettled civic matter; upkeep is modelled, its allocation is silence. The two reads close it flat |
| **4** | two accounts side by side and neither adjudicated (REGISTER-CARD "carry two accounts and settle neither"; EXEMPLAR-PACK §9). Both accounts are about the KEEPING, which is modelled; *who would be blamed* is subjunctive and names no person (F1-126: no minted proper name anywhere in the pool). *Neither account has soldiers in it: the town keeps no garrison and musters none* — the two reads, and the colon is the pool's one, as the semicolon before it is |

### 4. The craft answer to the DULL verdict (the pool is the unit)

- **Twelve constructions, no permutation of one sentence.** Subjects in order: *the upkeep* · *the town* · *an absence* · *a line* (object-first) · *a stranger* · *whoever is at the gate* · *the works* · *a locative* · *a prepositional frame on the town* · *a gerund* · *a `where`-frame on a stretch of fabric* · *two accounts*. Landing nouns: *none* · *whoever the barring falls to* · *its keeping* · *left open* · *no muster* · *no muster* · *it* · *explained to him* · *musters none* · *divide it* · *raises no muster* · *musters none*.
- **First two words, all twelve distinct**, and across the three variants as well (R-DA-05 / A11). **One face of twelve opens on the slot**; the block's measured tic is twelve variants opening on *"A stranger"* and exactly one face here does.
- **Vocabulary spread beyond the receipt's stock:** purse, upkeep, wages, bill, gate, bar, barring, line, works, ground, way, trade, quarrel, cost, repair, houses, account, blame, business, keeping. The shipped three rows spent *walls · nobody · people · perimeter · absence* and said one fact three times.
- **Sentence length 9 to 30 words; two renderings above thirty words of twelve (0.167)**, inside R-DA-06's band; three faces are single-sentence and nine are two, so no two adjacent renderings share a length and a grammar.
- **Second clauses earn:** cost (1·1, 3·2), consequence on a trade (3·1), contrast against a sibling POOL KEY (1·2, `walls AND professional garrison` and `walls with citizen militia` are the named rejected alternatives, which is what R-DA-02 licenses), voice (2·2), withholding (2·3, 2·4, 3·3), reversal (1·3). **No restatement, no reassurance, no abstraction pair.**
- **Nothing restates or contradicts the siblings.** DS-DEF-5's `watch PRESENT` owns *"a matter of order rather than of war"* and its visitor owns *"looked at rather than stopped"*; neither turn nor its sense appears here. The sibling `Invasion & War` rows own *"sizing {settlement} up"*, *"the men who belong to it"* and *"turning out"*; none is reused. The legacy expanded string at `threatAssessment.js:117-119` (*ladders and time*) is not echoed — the shipped `[ledger]` row's *"ladders and patience"* was lifted from it and is gone.

### 5. Mechanical and floor checks, run over all twelve

| check | result |
|---|---|
| em dash · exclamation · digit · percent · question mark | **none** |
| `which`-clause | **none** (three `that`-restrictives, one embedded `who`) |
| `{band}` / `{route}` / any slot but `{settlement}` | **none** — a face using them would render a literal brace (`defenseStateProse.js:621`) |
| `[plain]` or a second angle tag on a spine row | **none** |
| magnitude — count, share, size, distance, duration, frequency, proportion, age (F2-01) | **none.** No "a handful", no "not one", no partitive share; *unbuilt ground* and *the back of the houses* are standing facts, not measures |
| date, season, founding, raising, elapsed course, perfect, durative, *still / no longer / since / again* (F2-02/03/05) | **none.** Every verb is the simple habitual present or a subjunctive edge |
| rate — *most nights, seldom, more often than not, every spring* (F2-06) | **none** |
| prediction the pulse adjudicates (F2-05; the card's `may NOT`) | **none.** The shipped *"a determined attacker takes this town"* and *"the thing that would save it"* are both struck |
| totality over persons; *nobody / everyone / anyone / the town says* (card, REFUSED COLUMNS; F1-25) | **none** |
| totality of safety or of doom (F1-34) | **none** |
| tier or band word (F1-31) | **none** |
| wall material or material source (F1-32, F1-33) | **none** |
| decay, weathering, rot — or the permanence of an institution row (F4-01) | **none.** No face says the line will always be there and none says it is failing |
| purse split, gate-direction split, total collapse of pay (F4-02, F4-03, F4-04) | **none** |
| culture furniture the profile denies (F3-05) | **none.** No thatch, hearth, churchyard, market green, snow, weather, crop or roof; *gate, line, works, ground, houses, trade, purse, account* carry across all twelve profiles |
| a named character or a minted proper name (F3-01, F1-126) | **none** |
| the singular office the tier emits (F3-06) | **none.** Every person is a plural or an indefinite; no key-holder, no gate-warden as an office, no sheriff/constable/sergeant (§0.6.3) |
| a record cited to an unresolved holder (F1-24) | **none.** The office does not cite its own books (§4.4.3); the muster roll is never cited (R-8) |
| deity (F3-02) | not in reach of this key; none |

### 6. Declared residual risk — recorded, not hidden

1. **The citadel-only corner.** Three faces name a **gate** (1·2, 2·2, and 2·1 by *"comes through it"*, which names none). `hasGates` matches `gates` · `town walls` · `city walls` · `massive walls` · `palisade` (`priorityHelpers.js:53`, read in the dock) and therefore fires on **every** wall row this key can select **except** a town whose only wall-class row is `Inner citadel`; there `safetyProfile.js:463-464` prints *"no gates to bribe and no checkpoints to avoid"*. That member is reachable only at city or metropolis, only after a lifecycle or calamity path removes a required `Garrison` and a required `Professional city watch` while the inner citadel alone survives the `UPGRADE_CHAIN_PAIRS` demotion (`calamityKernel.js:96-151`). I judge the corner narrow enough to write through and I am recording it rather than spending three of twelve faces avoiding it. The same corner is the only place *"the line"* is loose; no face claims the line goes round.
2. **W-01, the mercenary collision.** On a `Hireling hall` / `Free company hall` / `Veteran's lodge` town the flag and the bucket disagree and no face may be charged either way (CAR 8b-W-2). No face here asserts or denies contracted forces.
3. **W-09.** `threatAssessment.js:59`, `:66`, `:80` hardcode *"Palisade and citizen militia"* on branches firing for any walls row. Where that string renders beside these faces, the ROSTER is the record and the face stands (§R-1); a WIRING row, not a writer's fault.

### 7. Refusals

**None.** All three variants are written lawfully in place under their own vids and angle tags; no variant was added, removed, merged or trimmed; every licensed claim the shipped rows carried is kept (the wall stands; the town has no force of its own to hold it) and the eight CONTRADICTED claims and three FLOOR-2 claims the skeleton marked are dropped without replacement.
