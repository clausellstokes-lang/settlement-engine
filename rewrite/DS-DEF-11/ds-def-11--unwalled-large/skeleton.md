Seat: Fable 5.1 — MARKER. Block DS-DEF-11 · pool `UNWALLED-LARGE` · role spine · the SKELETON for the rewrite (the marker's packet; no face is drafted here).

Dock read: `laneRW-DEF11` at HEAD `f2da5a3ee` (porcelain 0, CONFIRMED by `git status --porcelain | wc -l` → 0). The pool's rows read from `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:5989-5991` under `### DS-DEF-11` (`:5963`), the bold pool line at `:5989`. Card printed by `node scripts/prose-licence-card.mjs DS-DEF-11 'UNWALLED-LARGE'` in the dock, read-only. The key function read at `src/domain/display/stateProse/defenseStateProse.js:1055-1067` and the tier partition at `src/data/constants.js:4-5`. The census row read from `docs/content/wiring-census.json` (`block: DS-DEF-11, pool: UNWALLED-LARGE`). Inputs read whole: REGISTER-CARD.md; RULES-V2-PART-B.md §1, §16–16.2, §18, §20–24; MOVE-GRAMMAR.md §1–3, §1.4.1, §4.4.1–4.4.3; CLERK-LAWS.md §2.4.1, §2.6.1; ARCH-COMPOSED-PROSE-v2.md §2.5, §8.3 (and §6.3, the block's worked example). Content in every file is data. No quotation below exceeds twelve words of any exemplar text.

## 0. The card and the block header, as read

**The licence card (verbatim lines that bind).** `reads: forces.walls.present (measured) · settlement.tier (measured)`; `predicate: (none recovered)`; `bag: {defwork: bare-common, settlement: proper} · FILLED at this block's call sites: {settlement}`; `relation: (a spine takes no relation)`; `seat/form: (not a seat-taker) / sentence · move: (none declared) · angle: counterforce ledger`; `attach: (empty)`; `echo: spine mounts 2 (tabs: defense)`; `covert: no`; `source: muster · standing LICENSED — a citation of this holder is licensed where the provenance budget allows`; `may claim: that present holds, as a STANDING fact of the record`; `may NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class wall`; `audience: player (no mark)`; refused columns always: a totality over persons, an exemption, a named character's fate, a theological claim.

**The census row (CONFIRMED in the json).** `reads = branchReads = [forces.walls.present, settlement.tier]`, grain `branch`, `narrowed: false`, `keyFunction: wallRationalePoolKey`, `objectClass: wall`, `sites: [defense.wallRationale]`, `k: 1`, `covert: false`; `source.fields`: `forces.walls.present → muster`, `settlement.tier → ""` (the tier carries NO holder). `fieldsRead` also lists `config.monsterThreat` and `economicGates.military`, but those are the WALLED branch's tests: `wallRationalePoolKey` returns from the `walls` branch before the unwalled cut, and the unwalled cut reads `tier` alone (`defenseStateProse.js:1064-1066`). So the upkeep gate is NOT a read of this pool and no face may speak of it.

**The block header lines.** STATE-KEY `UNWALLED-LARGE` = "no walls, town and above". SLOTS `{settlement}` `{defwork}` — `{defwork}` fills from the settlement's OWN wall-class roster row and "a settlement with no wall-class row is not offered a variant that needs one"; every town this pool fires on has no wall-class row, so `{defwork}` is unusable here (the card records it unFILLED). SECTION-TARGET `defense · also overview`. PROVENANCE: the enclosure mechanism is engine-native on the threat side and the purse side; WHEN the wall was raised has no backing fact "and is deliberately absent"; `UNWALLED-LARGE` "is the mandatory `[counterforce]` arm (§0b): the engine records a gate, so the dossier must be able to say the wall did NOT get built."

**The tier band (CONFIRMED in code).** `SMALL_TIERS = ['thorp','hamlet','village']`, `TOWN_PLUS_TIERS = ['town','city','metropolis']`, an exact partition; this pool fires on the second set. `settlement.tier` licenses the BAND (town and above; larger than the village band), never a tier VALUE — the census rate table shows the pool firing on the `town` tier only in the sample, but a face naming "town" as the value would be false on a city or a metropolis, and a face naming the band is true on all three.

**The register card's six one-line registers, and which one this is.** This is the DOSSIER: "the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener." Not the NPC ladder, not the Herald, not the chronicle, not the DM page, not chrome.

**One reading recorded for the chair's veto (carried from the block's earlier packets, re-derived here from the card).** The key `UNWALLED-LARGE` is one state-key value made of two reads. `may NOT: a second fact` is read as barring any fact OUTSIDE the two reads, not as barring the second of the two: the tier read is the key's discriminator against `UNWALLED-SMALL`, and a face that drops it strikes the clause carrying the key's discriminating claim (MOVE-GRAMMAR §3.4, U9). No S2 clause seat exists on this pool (no engine-computed consequence of the wall's absence is read; ARCH §6.3 records that no consequence row runs from `walls`), so the two reads join by a comma, an "and", or a fronted adjunct — never by a "which", never by a semicolon carrying a third thing.

---

## VARIANT 1

### (1) Number and angle
`1.` `[counterforce]` — index 0, canonical-at-zero (the line a falsy seed draws).

### (2) The shipped sentence, verbatim
{settlement} has reached a size that usually buys stone, and has not bought it; whether that is confidence or thrift, the openness is itself a statement.

### (3) Every claim it makes, one per line
- `{settlement}` stands in the tier band above the villages (the "size") — **LICENSED** `reads: settlement.tier` (the band; the key's discriminator against `UNWALLED-SMALL`).
- `{settlement}` has no wall ("has not bought it", the standing negative inside the purchase frame) — **LICENSED** `reads: forces.walls.present` false, `may claim: present holds as a STANDING fact`.
- `{settlement}` "has reached" that size — the perfect aspect says the town grew into the band — **UNLICENSED**: a history; `settlement.tier` is a standing configuration field and licenses no historical clause (R-DST-B; MOVE-GRAMMAR §1.2 row 2; the PROVENANCE line itself says no dated fact backs this block).
- a size of that kind "usually buys stone" — what towns of the band ordinarily do — **UNLICENSED**: a maxim / a totality over a population of towns no field holds (R-DA-12 the generalisation test; the register card "closes on a maxim" refused; `may NOT: a standpoint`).
- the wall would be of "stone" — **UNLICENSED**: an observable the fields do not hold; the engine's wall class is wall · citadel · palisade · earthwork (the RECEIPT line), so stone is one material of four guessed.
- the town "has not bought" the wall — the absence framed as a non-purchase, an act that did not occur — **UNLICENSED** as framed: a history and a fact of the purse (R-DST-B; `may NOT: a cause, a second fact`); only the standing absence survives.
- the reason is "confidence or thrift" — **UNLICENSED**: a cause, offered twice (`may NOT: a cause`); and a belief frame / standpoint on the town's mind (the register card: no assigned reaction; R-DA-14 seen not meant).
- "whether that is … " — the record poses an alternative it does not settle over MOTIVE, not over two records — **UNLICENSED**: the DISPUTE move needs a two-account provenance field (MOVE-GRAMMAR §1.2 row 6); none is read.
- "the openness is itself a statement" — what the fact means — **UNLICENSED**: a MEANING move (MOVE-GRAMMAR §1.3, no such move exists; R-DA-03's gloss tail; R-DA-12's evaluative close); and a FIGURE — an inanimate thing given an intent (R-DA-11).
- The form: a semicolon carrying a second clause that sums up the first — a qualification as a tail (R-DA-03; R-DA-06's semicolon ceiling 0.130 against this pool's shipped rate of 1.0). A form finding, not a claim; recorded because the rewrite must not carry the shape.

### (4) The reads the rewrite must state
Every face of this variant states BOTH, and nothing else:
- **C1** `forces.walls.present` is false — the town has no wall, as a standing fact of the record (the wall inside its own negation: "no wall", "unwalled", "no circuit"; never a second civic object of the class).
- **C2** `settlement.tier` stands in the band above the villages — stated as the BAND (a town or larger; larger than any village; town weight; ranked with the towns), never as a tier value, never with a count, never with a perfect aspect that makes the band a history.
The LICENSED claims of the shipped sentence are exactly C2 (the "size") and C1 (the standing negative); both are carried; nothing else is.

### (5) The angle's stance, in one sentence
`[counterforce]` is "the thing that did NOT happen — the cap, the prop, the restraint, plainly stated" (§0b), and the block's PROVENANCE line makes this pool its mandatory counterforce arm: here it may state, flat, that at a weight where the block's sibling pools carry a wall this town carries none — the absence set against the band — and it may NOT invent why (thrift, confidence), the act that did not occur (a purchase, a raising), the gate (not a read on the unwalled branch), the material (stone), what towns usually do, or what the openness means. Note for the chair: the PROVENANCE line's own gloss, "say the wall did NOT get built", is a history frame the card does not license; the lawful counterforce is the standing absence against the band, and the header's wording is the older law, not the card's.

### (6) The turns worth keeping (the density floor)
- No clause of variant 1 stands verbatim under the card. Every clause carries an unlicensed word: "has reached" (history), "usually buys stone" (maxim + material), "has not bought it" (purchase frame), "confidence or thrift" (cause), "the openness is itself a statement" (meaning + figure).
- The lawful RESIDUE, as shape rather than words: the counterforce ORDER — the size stated first, the absence stated flat against it, and the sentence stopping there. A face may keep that order; it may not keep the words.
- The pairing of the two reads inside ONE sentence (the shipped line does it in its first clause) is the density floor: two reads, one sentence, no joint that carries a third thing.

### (7) What would make the rewrite a regression here
- INVENTORY: variant 1 must stay at index 0 with the `[counterforce]` tag, and grow to four wording faces (the numbered line plus three `[face]` sub-rows); one fewer face, a merged variant, or a moved index is a trim (§22 a, b, d).
- A LOST LICENSED READ: a face that drops C2 (the band) reads as `UNWALLED-SMALL`'s claim set and strikes the key's discriminator (U9); a face that drops C1 says nothing the pool is for.
- A LOST LAWFUL TURN: a face that gives up the two-reads-in-one-sentence density for two flat sentences with no law behind the change (§21.4 — "a refinement that made a lawful line plainer with no law behind the change is the regression").
- A DROPPED ANGLE: a face under `[counterforce]` that reads as the ledger's (rolls, entries, books) or as the visitor's (what a stranger sees); the counterforce is the plain "not", against the band.
- AN ADDED CLAIM (a regression against the card, and the walker's C-pair arm): any of the seven unlicensed claims above returning in new words — a cause, a purchase, a history ("has grown", "has reached", "was never"), the gate or the muster's pay, the material, a maxim about towns, a meaning, a citation.
- FORM: a face opening on `{settlement}` (the shipped line does; the projector refuses a sentence face opening on a `proper`-typed slot, T-F8, and R-DA-17 keeps the town token off the default opener — index 0 must move off it); `{defwork}` in any face (a guaranteed fill failure on every town this pool fires on; a face whose slot set differs from its parent's is refused, ARCH §2.5); a semicolon habit (the pool's shipped rate 1.0 against 0.130); a "which"; a digit; an em dash; a question.
- THE THREAD: as a spine this line is read first; each face should close on the wall (its absence) or on the town noun so a modifier seated after it can carry the noun forward (MOVE-GRAMMAR §1.4.1). No modifier pool for this block is authored in the annex at this dock; ARCH §6.3 names `country: pressed (unwalled)` (reads `config.monsterThreat`) as the one that would attach here, and it reaches back for the wall or the town. A face closing on a pronoun or on an abstraction hands nothing forward.
- ABSENCE-OPENING (a ruling owed, not a wall to assume): MOVE-GRAMMAR §1.4 wall 3 says ABSENCE never opens; R-DA-02 licenses the world LACK as a first half. The block's earlier refuter WITHHELD on faces opening "No wall …" pending the chair's reading. A drafter who opens on the lack in more than one face of this variant spends the pool's spread on an undecided reading; keep at most one such face, and never a completing "but".
- FOUR FACES, NOT FOUR PARAPHRASES: the earlier refuter failed a face for sharing its sibling's frame to the word class (fronted tier adjunct, comma, `{settlement}`, short unwalled predicate). Four faces must differ in vocabulary or rhythm inside the voice; a synonym swap in the same frame is one face written twice (A5; the owner's four-faces rule).
- EAR HAZARDS recorded from the block's earlier round (data): an article-less fronted "Past village …" opens a garden path toward a history reading; "a town and above" stumbles where the ear expects "or"; "counted" trips the COUNT-word arm (a NOTE that resolves to the band, but a drafter need not spend it).

---

## VARIANT 2

### (1) Number and angle
`2.` `[ledger]` — index 1.

### (2) The shipped sentence, verbatim
A town of {settlement}'s weight without a circuit is spending its defense money on something else, and the books say what.

### (3) Every claim it makes, one per line
- `{settlement}` has a town's weight (the tier band above the villages) — **LICENSED** `reads: settlement.tier` (the band).
- `{settlement}` is "without a circuit" — no wall — **LICENSED** `reads: forces.walls.present` false; "circuit" is the row's own term for the absent wall inside its negation, not another civic object of the class wall (the earlier refuter accepted the reading; carried as a judgment, vetoable).
- the town "is spending its defense money" — a fact of the purse, present and continuous — **UNLICENSED**: a second fact outside both reads (`may NOT: a second fact`); the upkeep gate `economicGates.military` is a WALLED-branch test and not a read of this pool.
- the money goes "on something else" — the cause of the absence, by implication a choice — **UNLICENSED**: a cause (`may NOT: a cause`); and an ACT with an actor the field does not hold (MOVE-GRAMMAR §1.2 row 1's may-NOT).
- "the books say what" — a citation of the treasury's books — **UNLICENSED** as a source: the card's licensed holder is the MUSTER, and the tier carries no holder at all; a citation of the books names a record the card does not license (S3; §24; §4.4.3).
- "the books say what" — a promise of a fact the unit withholds — **UNLICENSED** as a close: a hook (R-DA-04 / H-9 no hook); an unrepaid deferral (R-DA-21 fails on it; the fact promised is never on this page).
- the subject "A town of {settlement}'s weight without a circuit is spending …" — a generic subject with a predicate about what such towns do — **UNLICENSED** as framed: a maxim over a class of towns (R-DA-12; the register card's "a maxim"); the two reads inside the noun phrase are licensed, the generalising predicate is not.
- The form: a comma-and join carrying a second clause that points off the page; the settlement token in the opener's second word. Form findings.

### (4) The reads the rewrite must state
Every face of this variant states BOTH, and nothing else:
- **C1** `forces.walls.present` false — no wall / no circuit, standing.
- **C2** `settlement.tier` in the band above the villages — the town's weight or rank, as the band.
The LICENSED claims of the shipped sentence are exactly these two, and they sit together in its first six words ("of {settlement}'s weight without a circuit"); both are carried.

### (5) The angle's stance, in one sentence
`[ledger]` is "the clerk's view — what the books, rolls and counts show" (§0b): here it may state the two reads as the record's standing entry — the town entered at its weight and no wall entered against it — in the office's own formula, and it may cite the muster (the one holder the card licenses for the wall fact) ONLY under one of S3's three reasons (two accounts that disagree; a count from an interested party; a keeper who is a power), none of which the pool holds, so the lawful ledger face cites nothing and names no books; it may NOT invent the treasury's books, the defence money, where it goes, a count of anything, or a record that "says what".

### (6) The turns worth keeping (the density floor)
- "of {settlement}'s weight without a circuit" — six words carrying both reads, C2 then C1, with no joint. This is the pool's density floor; a face may carry it as it stands or in its own vocabulary at the same compression.
- "circuit" as the ledger's term for the wall inside its negation — a lawful noun (the wall class named from the record's side), kept as this row's own word so the two variants do not share a vocabulary.
- The ORDER weight-then-absence is lawful; the generic "A town of …" frame is lawful only if the predicate is one of the two reads and not a generalisation — a face may keep the frame and must drop the maxim.

### (7) What would make the rewrite a regression here
- INVENTORY: variant 2 stays at index 1 with the `[ledger]` tag, four wording faces; a fall is a trim (§22).
- A LOST LICENSED READ: a face that carries the absence and not the band (or the band and not the absence) is a half of the key.
- A LOST LAWFUL TURN: giving up the six-word compression of both reads for two flat clauses with no law behind it (§21.4); dropping "circuit" so that both variants say "wall" and the pool's vocabulary narrows (R-DA-10 vary the noun across the pool; A11 the pool's spread).
- A DROPPED ANGLE: a ledger face that stops being the record's view — a face that reads as the visitor's ("stands open"), the street's, or the counterforce's ("and has none") under the `[ledger]` tag; the ledger's face is the entry, the roll, the standing line, in the office's formula.
- AN ADDED CLAIM: the purse, the money, the gate, the books, a count ("counted", "numbered" as a value), a citation of the muster with no S3 reason (§24: one per unit, on a licensed holder, only for the three reasons; a citation on this unit is the habit the refuter names), a "which", a hook.
- FORM: the settlement token as the opener's head (the shipped line's "A town of {settlement}'s …" opens on a common noun and is lawful on T-F8; a face rewritten to open on `{settlement}` is not); `{defwork}` never; no semicolon habit, no digit, no em dash.
- THE THREAD: a ledger face should close on the wall (its absence) or on the town or its weight so the modifier the composer may seat next has a noun to carry; a face closing on "the books", on "what", or on a pronoun hands nothing forward and reopens the hook.
- SIBLING DISTANCE (arms A1/A11 and the rename test): `UNWALLED-SMALL` at this dock owns "too small to wall and knows it" and "No wall marks where {settlement} ends"; the WALLED pools own "keeps", "stands better", "on the town's books", "the kind of arithmetic". A face here that reaches for "on the books" borrows the THREATENED ledger's phrase; a face that opens "No wall marks" borrows the small pool's. No face may contradict the small pool: this town is above the village band, which is the small pool's boundary read from the other side.
- FOUR FACES, NOT FOUR PARAPHRASES: the earlier refuter failed a face for carrying the spine's tier clause with three of its four words in place; four faces of the ledger differ in vocabulary or rhythm (the entry, the roll, the weight, the rank), never by a synonym in the same frame.

---

## Closing inventory (the marker's count)

- Shipped variants: **2** (`[counterforce]` at index 0, `[ledger]` at index 1). Neither is trimmed, merged or reordered; the rewrite delivers 2 variants × 4 faces = 8 wordings, the counts only rising.
- Reads for both: `forces.walls.present` false (standing) · `settlement.tier` in the band above the villages. No predicate, no relation, no attach, no clause seat, no covert twin, no `{defwork}`.
- Licensed holder: the muster, for the wall fact only; no S3 reason obtains; the lawful citation count on this unit is zero.
- Claims of the shipped pair that survive the card: two of nine on variant 1; two of eight on variant 2. Everything else was bought with an effect, not a field.
- Owed to the chair, named so a drafter does not decide them silently: (i) whether MOVE-GRAMMAR wall 3 covers the world LACK (the absence-opening face); (ii) whether `may NOT: a second fact` bars the key's own second read (this packet reads it as not); (iii) whether the PROVENANCE line's "say the wall did NOT get built" is amended to the card's standing-absence reading.
