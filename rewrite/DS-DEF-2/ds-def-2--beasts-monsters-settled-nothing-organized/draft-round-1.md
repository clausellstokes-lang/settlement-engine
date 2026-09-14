Seat: WRITER (Opus 5, Fable-unvalidated), DS-DEF-2 · pool `Beasts & Monsters: settled, nothing organized` · draft round 1, written under ADDENDUM 14 (a face is lawful unless it contradicts the record; silence is permission).

# DS-DEF-2 · `Beasts & Monsters: settled, nothing organized` · DRAFT ROUND 1

The three rows below are the complete replacement for the pool's variant rows, ready to paste under the pool's bold heading in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`. Three variants, vids 1 to 3, angles `[ledger]` `[street]` `[visitor]` in their shipped order; each numbered line carries the rewritten sentence and three `` `[face]` `` sub-rows, so twelve renderings in all. Slot sets are per parent: vid 1 and vid 3 carry `{settlement}` exactly once each, vid 2 carries none.

---

1. `[ledger]` Quiet country lies round {settlement}, and the town keeps no work at its edge. Where the buildings stop, the town stops.
   - `[face]` In heartland country the record at {settlement} runs empty in the places a defence would be entered: no bank, no barracks, no muster.
   - `[face]` Walls and a standing muster belong to the frontier. The country around {settlement} is settled, and the town has neither.
   - `[face]` Why nothing stands round {settlement} is entered nowhere. The quiet of the country is not the reason the record gives, because the record gives none.
2. `[street]` No muster forms here, and the country is the quiet kind.
   - `[face]` Nowhere here is kept clear for a turnout, and the space that would serve stands in use for something else. In settled country none is wanted.
   - `[face]` People come in off the country with nothing at the way in set to meet them. The country out there is heartland, and the town leaves it at that.
   - `[face]` Everything the town keeps up faces inward. The quiet country at its back is the one direction nothing is turned toward.
3. `[visitor]` A stranger walking out of {settlement} has nothing to pass. No bank stands in his way and no bar lifts for him, and beyond the last building lies quiet country.
   - `[face]` Nothing at {settlement} stops a stranger long enough to take his name, going out or coming back. The country he walks into is the settled kind.
   - `[face]` Out beyond {settlement} a stranger finds tracks that go somewhere and nothing set against them. That is what a heartland looks like from a town that keeps no line.
   - `[face]` Getting into {settlement} takes no leave and no answer: the town keeps no line to be let through, and settled country runs up to the doors.

--- NOTES

**How this section reads under ADDENDUM 14.** The licence card says what the read REACHES; it never bounds what may be written. So each face below is listed with (a) the read or card clause that positively carries each claim, and (b) the claims that rest on SILENCE, which is permission. Where a claim sits near a contradiction row, the row is named and the ground given.

**The card's three reads, once, for reference.**
- R1 `measuredMonsterFamily(config.monsterThreat)` → `settled` — the country is at the calm rung of a ladder of three. Producer's word `heartland`, corpus word `settled`, legacy alias `low` (`monsterThreat.js:41-61`; `defenseStateProse.js:279-284`). Holder: the road.
- R2 `standingDefenseForces(settlement).walls.present === false` — no member of the closed keyword set `wall · citadel · palisade · earthwork · inner citadel · massive walls` stands on the live roster, and `Gates (if walled)` matches `wall` inside `walled`, so no gate row either (`defenseInstitutionBuckets.js:84-89`; skeleton §0.5, §1.9). Holder: the muster.
- R3 `garrison.present || militia.present === false` — no member of the garrison bucket (`garrison · barracks · professional guard · professional city watch · multiple garrison`) and none of the militia bucket (`citizen militia · militia`) (`:88-93`). Holder: the muster.
- Card clause **may claim:** that the reader selects the row `settled country, neither` of `BEASTS_ROW_POOL`, as a STANDING fact of the record.

**The pool's discriminating claim.** All twelve faces carry the COUNTRY, because the `Invasion & War` row printed directly beneath is fixed to `neither walls nor force` whenever this pool fires (`defenseStateProse.js:654-655`) and already holds the bare absence. No face here spends itself on the absence alone.

**Zero provenance citations in the pool**, per skeleton §0.6 (neither of S3's three reasons obtains; the exemplar registers with raw text cite at zero per 786 sentences). `record`, `roll`, `entered`, `kept clear` are record VOCABULARY, free since W24 was struck entire, and not citations: no face names a keeper.

---

## VARIANT 1 · `[ledger]` · slots `{settlement}`

**1a (the numbered line) — 21 words.** *Quiet country lies round {settlement}, and the town keeps no work at its edge. Where the buildings stop, the town stops.*
- "Quiet country lies round {settlement}" — R1, the band word stated as a standing fact. Card clause **may claim**. Intensity stays inside the rung; no totality (F1-34 clear: nothing is said about what the country holds or sends).
- "the town keeps no work at its edge" — R2, the closed keyword set, stated as the measured negative it is.
- "Where the buildings stop, the town stops" — SILENCE. No field carries the shape of the town's boundary; with the whole walls set denied there is no moment of leaving, and the record denies nothing here (skeleton §1.9). Standing condition, simple present, no magnitude and no course.
- Construction: PRESENT(country) → LACK, then a short inverted sentence. Landing noun: *town*.

**1b — 23 words.** *In heartland country the record at {settlement} runs empty in the places a defence would be entered: no bank, no barracks, no muster.*
- "In heartland country" — R1, the producer's own word.
- "the record ... runs empty in the places a defence would be entered" — the card's **may claim** clause read at the ledger angle; the subjunctive *would* is the licensed edge (A2). W24's record-word bar is struck, so *record* and *entered* are free vocabulary.
- "no bank" — R2 (`earthwork`). "no barracks" — R3 (the garrison bucket's own keyword). "no muster" — R3 (the militia bucket; *the muster* is free as the class word, F1-03).
- ⚠ Declared: this is the pool's one inventory face and its three-item list is the rule of three. It is carried deliberately — the three items are exactly the key's three reads, and one face of twelve in that shape is inside the band. No other face lists.
- Construction: fronted prepositional → record-as-subject → colon list. Landing noun: *muster*.

**1c — 20 words.** *Walls and a standing muster belong to the frontier. The country around {settlement} is settled, and the town has neither.*
- "Walls and a standing muster belong to the frontier" — the engine's own positive model, not a writer's generalisation: `threatDefensePolicy.js:74-98` plants a fortification only at `plagued`, or `frontier` at town scale and above, and a force only under `plagued`. The contrast names a SIBLING POOL KEY (`frontier, credible deterrence`), which is the licensed form (R-DA-02).
- "The country around {settlement} is settled" — R1, the corpus word.
- "the town has neither" — R2 and R3, bounded by the two nouns named in the first sentence and by nothing wider. No totality over organized bodies: the watch, mercenary, charter and magical buckets are never in view (F1-01/F1-06 clear).
- Construction: the sibling rung stated first, then this town's case, second sentence longer than the first. Landing: *neither*.

**1d — 25 words.** *Why nothing stands round {settlement} is entered nowhere. The quiet of the country is not the reason the record gives, because the record gives none.*
- "Why nothing stands round {settlement}" — R2, bounded spatially to a perimeter.
- "is entered nowhere ... the record gives none" — the block's own fence: institution presence is a STANDING fact with no recorded history, and no state-prose key reads a history field. The GAP is written as a fact of the record and never of the world (R-DA-08). This is the face that declines to supply a cause, which is what F2-03/F2-04 would otherwise catch a writer inventing.
- This face carries the pool's OPEN MATTER (§4 of the skeleton): the record holds a town with nothing arranged against a country it has measured and says nothing whatever about why, and the face refuses to close it.
- Construction: an interrogative noun phrase as subject, then a withholding second sentence. Landing: *none*.

---

## VARIANT 2 · `[street]` · slots NONE

Every face below is slotless: the town's name appears nowhere in the variant, per `defense.generated.js:539-544` and the projector's face-row refusal on a slot set that differs from its parent's. Each is written to be true of the whole preimage at once, from a heartland thorp to a ruined city with a metropolis's population in it.

**2a (the numbered line) — 11 words.** *No muster forms here, and the country is the quiet kind.*
- "No muster forms here" — R3, the militia bucket read exactly. *Forms* is bounded to a turnout and asserts nothing about any other body; the watch bucket is never in view.
- "the country is the quiet kind" — R1.
- This is the variant's short line and it is deliberately the shortest of the twelve (skeleton §2.7: at least one face under a dozen words; the shipped row was the pool's only short one and the asset is kept). It is also index 0, the line a falsy seed draws.
- Construction: short coordinate, absence first. Landing: *kind*.

**2b — 26 words.** *Nowhere here is kept clear for a turnout, and the space that would serve stands in use for something else. In settled country none is wanted.*
- "Nowhere here is kept clear for a turnout" — R3, converted from a bare absence into a standing condition about ground.
- "the space that would serve stands in use for something else" — SILENCE, and deliberately withheld: no field says what the space is used for, and the record denies no use. Subjunctive *would* is the licensed edge.
- "In settled country none is wanted" — R1 joined to `threatDefensePolicy.js:74-98`, which requires nothing of a heartland town. The desk's own word for this branch is "Acceptable given the threat environment" (`threatAssessment.js:100`); the face carries the desk's reading without stating a RATING, so it does not outrun or explain the `scoreBand(scores.monster)` badge printed beside it (F1-40 / W-10 clear).
- Construction: absence → a withheld use → a general close. Landing: *wanted*.

**2c — 29 words.** *People come in off the country with nothing at the way in set to meet them. The country out there is heartland, and the town leaves it at that.*
- "People come in off the country" — SILENCE. Unnamed persons may act (W22a/W22b struck by name). *People* rather than traders or carts on purpose: trade arriving would collide with `tradeGoods.js:53-56` on an `isolated` town (F1-103), and wheeled transport is culture-bound (F3-05, twelve profiles ship).
- "with nothing at the way in set to meet them" — R2: nothing of the walls set stands where the way in meets the town, gate row included. The claim is about WORKS, not about persons, so no totality over persons is asserted and the card's refused column is untouched.
- "The country out there is heartland" — R1.
- "the town leaves it at that" — SILENCE; a standing condition, not a decision taken (no event provenance asserted, F2-03/F2-04 clear).
- Construction: people's movement → a dry close. Landing: *that*.

**2d — 21 words.** *Everything the town keeps up faces inward. The quiet country at its back is the one direction nothing is turned toward.*
- "Everything the town keeps up faces inward" — SILENCE as to what is kept up; the claim asserted is the orientation, and the orientation is R2's consequence: with no member of the walls set standing, nothing is built facing the country.
- "The quiet country at its back" — R1.
- "the one direction nothing is turned toward" — R2. No body is named, asserted or denied.
- ⚠ Declared: *keeps up* is upkeep vocabulary but no pay, purse or gate claim is made. On this key there is nothing to pay for, so a pay clause would be doubly wrong (F4-02/F4-03/F4-04); none is written anywhere in the pool.
- Construction: inversion of orientation, first sentence short. Landing: *toward*.

---

## VARIANT 3 · `[visitor]` · slots `{settlement}`

The outside eye reports FACT, never impression: no face uses *seems*, *feels*, *has the look of*, and no face addresses the reader. The word *watch* appears in no face of the pool, the shipped clause *meets nothing that would justify a watch* having been named on both its halves as the clause that must not be carried forward.

**3a (the numbered line) — 30 words.** *A stranger walking out of {settlement} has nothing to pass. No bank stands in his way and no bar lifts for him, and beyond the last building lies quiet country.*
- "A stranger walking out of {settlement}" — SILENCE; a role with no proper name, no office and no fate (F1-126 and product scope clear; F3-06 clear, since he holds no office the tier seats). The OUT direction is this variant's own move, the sibling `plagued, NO perimeter and NO force` row owning arrival.
- "has nothing to pass ... No bank stands in his way and no bar lifts for him" — R2, the closed keyword set, bounded at once by the two named things so that nothing totalising is left standing.
- "beyond the last building lies quiet country" — R1.
- ⚠ Declared, the one dependency worth a chair's eye: the denial of a bar rests on the marker's reading that `Gates (if walled)` carries `wall` inside `walled` and so falls inside the walls bucket, leaving no gate row on this key (skeleton §0.5, §1.9, §3.9). F1-08 makes the DENIAL of a gate a finding wherever `inst.hasGates` is true. If any catalogue row sets `hasGates` without carrying a walls-bucket keyword, this half of 3a is a finding and the fix is one clause: *No bank stands in his way, and beyond the last building lies quiet country.* Only this face denies a bar; the other eleven are clear of it.
- ⚠ Declared: two ABSENCEs sit adjacent in the second sentence. That is a Part B band rule (R-DA-08 / CL-12), not a wall, and the paired negative is what carries the rhythm here; one face of twelve is inside the budget.
- Construction: a person's act → a paired negative → a landing on the country. Landing: *country*.

**3b — 26 words.** *Nothing at {settlement} stops a stranger long enough to take his name, going out or coming back. The country he walks into is the settled kind.*
- "Nothing at {settlement} stops a stranger long enough to take his name" — R2. The subject is a thing and not a person, so the claim is about the absence of an apparatus and not a totality over who might ask; *long enough to take his name* is the telling particular, and no record of strangers is asserted or denied.
- "going out or coming back" — SILENCE.
- "The country he walks into is the settled kind" — R1.
- Construction: a thing-as-subject negative with a bounded purpose clause. Landing: *kind*.

**3c — 29 words.** *Out beyond {settlement} a stranger finds tracks that go somewhere and nothing set against them. That is what a heartland looks like from a town that keeps no line.*
- "tracks that go somewhere" — SILENCE, and it is the one honest thing this angle may say about what is out there: the country's LOOK at the low rung, whose holder is the road (`holderTable.js:234`, the look of the country, which anyone travelling it can see). Never what the country holds, never what it sends, never nothing (F1-34 clear).
- "nothing set against them" — R2.
- "what a heartland looks like" — R1. "a town that keeps no line" — R2.
- Construction: fronted locative → a person finding → a demonstrative second sentence. Landing: *line*.
- ⚠ Declared: no terrain, crop, tree or weather word is used anywhere in the pool. Twelve culture profiles ship and no defense key reads one (F3-05), so the furniture is held to buildings, doors, ground, tracks, a bank, a bar, a barracks and a muster, every one of them culture-neutral.

**3d — 26 words.** *Getting into {settlement} takes no leave and no answer: the town keeps no line to be let through, and settled country runs up to the doors.*
- "takes no leave and no answer" — R2: with the walls set denied, there is no controlled point at which leave could be asked. A claim about the apparatus, not about anybody's conduct.
- "the town keeps no line to be let through" — R2.
- "settled country runs up to the doors" — R1 joined to R2. *Doors* rather than a wall or a gate is the point of the face.
- Construction: a gerund as subject, then a colon. Landing: *doors*.

---

## THE POOL READ WHOLE

- **Twelve renderings, twelve constructions.** In order: PRESENT-plus-LACK with a short inverted close · fronted prepositional with a record subject and a colon list · the sibling rung stated then this town's case · an interrogative noun phrase with a withholding close · a short coordinate · absence plus a withheld use · people's movement with a dry close · an inversion of orientation · a person's act with a paired negative · a thing-as-subject negative · fronted locative with a demonstrative second sentence · a gerund subject with a colon. No face is a permutation of a sibling and none is an *A, and B* join with its halves swapped.
- **First two words, all twelve distinct:** Quiet country · In heartland · Walls and · Why nothing · No muster · Nowhere here · People come · Everything the · A stranger · Nothing at · Out beyond · Getting into. No face opens on the `{settlement}` proper slot (T-F8).
- **Landing nouns, all twelve:** town · muster · neither · none · kind · wanted · that · toward · country · kind · line · doors.
- **Lengths, the slot counted as one word:** 21 · 23 · 20 · 25 · 11 · 26 · 29 · 21 · 30 · 26 · 29 · 26, 287 words over the twelve. The short line exists and is index 0 of the slotless variant; no two adjacent faces of a variant share both length band and grammar.
- **The band word is rotated** across three licensed forms — *quiet* · *settled* · *heartland* — and no face states a rating, a score or a badge word.
- **One matter stands open** and is never closed: why a town in measured country keeps nothing against it. 1d states the gap outright; 2b withholds what the ground is used for; 3b leaves the town's record of strangers unstated.
- **Mechanical:** no em dash, no exclamation mark, no digit, no percent, no `which`-clause, no second bracketed tag, no `[plain]` marker, no address to the reader, no hedge on a person's behalf, no proper name minted, no magnitude, no date, no season, no duration, no rate, no perfect or durative, no comparative against a past, no future indicative, no ordinal over events.
- **Never trimmed:** three variants in, three variants out, same vids, same order, same angles, same slot sets; the counts rise from one wording per variant to four.

## REFUSALS

**None.** All three variants were made lawful and all twelve faces are written. Two items are declared above rather than refused, and both are recorded here so the chair can rule without re-deriving them:

1. **3a's denial of a bar** depends on `Gates (if walled)` falling inside the walls bucket by substring, which is the marker's reading of `defenseInstitutionBuckets.js:84-89` and the ground of skeleton §1.9 and §3.9. F1-08 makes the denial of a gate a finding wherever `inst.hasGates` is true. If a catalogue row can set `hasGates` without a walls-bucket keyword, the one-clause cure is given in 3a's note and costs the face nothing else.
2. **1b's three-item list** is the pool's single inventory face and its single rule of three, carried deliberately because the three items are exactly the key's three reads. If the pool is judged DULL on that face alone, the cure is to break the list across two sentences; no other face of the twelve lists anything.
