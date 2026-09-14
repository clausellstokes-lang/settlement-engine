Seat: WRITER (Opus 5 — Fable-unvalidated), DS-DEF-2 · pool `Invasion & War: neither walls nor force` · DRAFT ROUND 1.
Written under ADDENDUM 14: a face is LAWFUL unless it CONTRADICTS the record; silence is permission; the licence card says what the read reaches, never what may be written.

**Ready to paste under the annex heading for this pool** (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2655-2658`). Three variants, in order, each keeping its own vid, its one bracketed angle tag and its slot set; three `[face]` sub-rows each; twelve wordings where the pool holds three. Nothing trimmed.

---

1. `[ledger]` Against war the entry for {settlement} reads no wall, no soldiers of the town's own, and no roll. The houses stop, and nothing is set between them and the country.
   - `[face]` The tools in the houses at {settlement} are the tools of the fields, and against war that is what the town has. Nothing stands at its edge, no barracks is built in it, and nothing in it is drilled.
   - `[face]` A defence against war is set down under the works and under the men, and at {settlement} neither head carries anything. Whatever comes up the approach is seen from the fields before it is seen from the houses.
   - `[face]` The cheapest work a town can put round itself is a ring of stakes, and {settlement} has not got that. No soldiering is done on the town's account, and no list is kept.
2. `[counterforce]` A wall against an army wants timber or stone, a drilled body wants the town's own men, and soldiers want paying. None of it is done at {settlement}.
   - `[face]` Nothing at {settlement} is quartered or drilled at the town's own charge, and nothing stands round it that an army would meet. Where the town ends is a question for whoever holds the ground.
   - `[face]` The ground is worked right up to the houses at {settlement}, where another town would keep a bank and a ditch. Against an army it keeps neither soldiers nor drilled men.
   - `[face]` Set against war, {settlement} has no work standing at its edge and no soldiers of its own. No roll is kept in the place.
3. `[street]` Against an army the place keeps no soldiers of its own and no drill, and the building stops at the last house on the way out.
   - `[face]` No evening in the place is given to a drill, no work in it goes to a wall, and no soldiering is done on its own account against an army.
   - `[face]` What the place has not got is a wall, soldiers of its own, or a drill against an army.
   - `[face]` With nothing to shut at the edge of the place, no roll in it and no soldiers that answer to it, what the people there have instead of a wall is the country.

---

--- NOTES

**REFUSALS: none.** All three variants are written lawful; no variant is banked.

**Mechanical conformance.** Three variants, vids 1–3, in the shipped order, angles `[ledger]` · `[counterforce]` · `[street]` unchanged, one bracketed tag each, no `[plain]` anywhere. Slot sets: vid 1 `{settlement}` exactly once in every one of its four wordings; vid 2 the same; **vid 3 carries no slot in any of its four wordings** (`defense.generated.js:694`, `"slots": []`). `{band}` (RESERVED) and `{route}` (unfilled at this block's call sites) are written nowhere. No face opens on the `{settlement}` proper slot (T-F8). No em dash, no exclamation mark, no digit, no percent, no `which`-clause, no second person, in any of the twelve. Sentence spread held at 2 · 2 · 1 (A11): vid 1 and vid 2 faces are two sentences each, vid 3 faces one sentence each. Canonical index zero is vid 1's numbered row.

**Both limbs in every one of the twelve.** The key is `walls === false && garrison === false && militia === false`, reached only after both force buckets are consulted (`defenseStateProse.js:476-483`). Every wording states the works limb AND the force limb, so none of them can be read as `walls with NO force`, `force with NO walls` or `militia only` (the sibling rows of `INVASION_ROW_POOL`, `:458-465`).

**The width discipline, stated once because it governs every line below.** The partition is seven buckets and this key reads three (`defenseInstitutionBuckets.js:83-109`), so no face negates above those three. The garrison limb is therefore always spelled either as a bucket member by name (**barracks**, `:88-91`) or possessively bound to the town (**of the town's own · on the town's account · at the town's own charge · that answer to it**), never as "nobody under arms", "no force", "undefended" or "nothing organized" — because `Town watch` is `required: true` at town tier (`institutionalCatalog.js:1348-1355`) on all fourteen town-tier firings, a `Free company hall` or `Veteran's lodge` may billet professional soldiers in no bucket at all (`:1370-1376`, `:881-888`), and the small-tier baseline is the engine's own "every adult armed with tools" (`defenseGenerator.js:145`). For the same reason no face says *billeted* or *quartered* unqualified: a free company hall quarters men. The militia limb is spelled as the roster fact (**no roll · no list · no drill · nothing drilled**) and never as a claim about persons, because the thorp's `Household levy` musters (`:104-109`) and a totality over persons is the card's always-refused column.

---

### VARIANT 1 · vid 1 · `[ledger]` · the compiled entry

**Numbered row** — 30 words. *Construction:* the record as subject, the three heads enumerated at their true count, then one turn outward to the ground, placed last.
- *no wall* · *no soldiers of the town's own* · *no roll* — the card's **may claim**: the reader `invasionRowSituation(walls, garrison, militia)` selects `no walls, no force` as a STANDING fact of the record. The three are measured negatives, not silences (`defenseStateProse.js:481-482` consults both force buckets before returning).
- *the entry … reads* — record vocabulary, unattributed. The card's **source: muster · standing LICENSED** is NOT spent: no keeper is named anywhere in this packet, because the muster's only instantiated roster holder is the `Citizen militia` this key denies (`holderTable.js:279-288`), so a citation would be F1-24. Zero citations in the pool, as the provenance ceiling and the skeleton both recommend.
- *against war* — the STATE-KEY's own row label `Invasion & War` and the reader's own docblock, "walls against a professional garrison or a militia" (`defenseStateProse.js:453`). The frame is what tells this row apart from the **Beasts** rung, which reads the same three locals on the same mount (`:654-655`).
- *The houses stop, and nothing is set between them and the country* — the walls bucket's closed keyword set (`wall · citadel · palisade · earthwork · inner citadel · massive walls`) is asserted empty, and `Gates (if walled)` is caught by `wall` inside `walled`, so no built line and no controlled entry point stands. `hasGates` is false in consequence (`priorityHelpers.js:53` matches only `gates · town walls · city walls · massive walls · palisade`, every one of them inside the walls set), and `safetyProfile.js:463-464` prints the engine's own "no gates to bribe and no checkpoints to avoid" on the same dossier. Hands *the country* forward for a modifier.

**Face 1** — 39 words. *Construction:* object first (the tools), the positive before the negatives, the three absences in the second sentence.
- *The tools in the houses … are the tools of the fields* — the engine's own small-tier model: "Community weapons and coordination (every adult armed with tools)" and "when danger reaches the fields" (`defenseGenerator.js:145`; `institutionalCatalog.js:104-109`). No count, no rate, no body asserted; *the fields* is the engine's own word, so it carries no terrain claim of mine.
- *Nothing stands at its edge* — walls read. *no barracks is built in it* — the garrison bucket by a member's own name (`defenseInstitutionBuckets.js:88-91`); a barracks is a garrison-bucket row, so its absence is the read and not a wider negation. *nothing in it is drilled* — the militia read (`Citizen militia` = "Able-bodied residents drill and muster"), stated of the town and not of persons.

**Face 2** — 38 words. *Construction:* the record's procedure first (two heads, not three items), the blank stated as "neither head carries anything", then the turn outward to the approach.
- *set down under the works and under the men* — record vocabulary; W24's record-word bar is struck, so the office's own furniture is free. Both limbs ride one head each, which is why this face enumerates nothing.
- *at {settlement} neither head carries anything* — the three reads, jointly.
- *Whatever comes up the approach is seen from the fields before it is seen from the houses* — the engine's own baseline again, "Flight feasibility and terrain alarm (everyone notices strangers)" (`defenseGenerator.js:141`). A standing habitual fact; no magnitude, no rate, no outcome.

**Face 3** — 33 words. *Construction:* the cost earner first (what the cheapest member of the class wants), the town's lack second, then a short flat line.
- *The cheapest work a town can put round itself is a ring of stakes* — the `Palisade` row's own description, "a ring of sharpened stakes" (`institutionVocabulary.js:278`), and the class's low rung, present at thorp (`institutionalCatalog.js:97-102`). A claim about the class, not about this town's past: it says nothing about why nothing was built, which is DS-DEF-11's UNWALLED cell and composes beside this one on every firing.
- *{settlement} has not got that* — the walls read, present-state possession, no perfect and no elapsed course.
- *No soldiering is done on the town's account* — the garrison read, bound possessively so it cannot be read as denying a free company or a watch. *no list is kept* — the militia read: the militia is the one shipped institution that keeps a roll (`holderTable.js:279-288`), so on this key there is no roll for a force to be on.

---

### VARIANT 2 · vid 2 · `[counterforce]` · the thing not done, as a standing condition

**Numbered row** — 28 words. *Construction:* three requirements, then one short flat sentence saying none is met. The "did not happen" is the town's not building and not keeping, never an army's not coming.
- *A wall against an army wants timber or stone* — the rows' own printed descriptions: `Palisade` sharpened stakes, `Palisade or earthworks` wooden or earthen, `Town walls` stone (`institutionVocabulary.js:155`, `:157`, `:278`). No material SOURCE is claimed (F1-33) and no chain is instantiated here, because no wall row stands.
- *a drilled body wants the town's own men* — `Citizen militia`, "Able-bodied residents drill and muster … Part-time service" (`institutionalCatalog.js:335-341`). *soldiers want paying* — `Garrison`, "Professional soldiers" (`:1925-1930`); the military upkeep gate's own heading is "garrison wages, wall maintenance" (`defenseGenerator.js:182`, `:189-192`). No purse is split and no pay gate is read: on this key there is no garrison and no wall, so nothing of the kind is funded at all.
- *None of it is done at {settlement}* — the three reads. The short line is the register's own, and "none of it" is bound to the three things just named, not to the town's whole defence.

**Face 1** — 34 words. *Construction:* the doubled negation the shipped row had, with its referents moved off "nothing about the town" and onto the two class nouns; then a positive second sentence that leaves a matter standing open.
- *Nothing at {settlement} is quartered or drilled at the town's own charge* — garrison and militia in one surface, bounded by *at the town's own charge*, which is what keeps it off the free company (contracted, `:1370-1376`) and off the part-time watch (paid but neither quartered nor drilled, `:1348-1354`).
- *nothing stands round it that an army would meet* — the walls read with the frame. The modal is subjunctive, the A2 edge; no outcome for the town is asserted, and no readiness band is explained or outrun (`defenseScoreBands.js:39` is computed from four inputs this key cannot see).
- *Where the town ends is a question for whoever holds the ground* — silence is permission: no field fixes a boundary, and an unnamed person holding ground is licensed by ADDENDUM 14 floor 3 and by the engine's own open office column. The matter is left standing open, and *the ground* is handed forward.

**Face 2** — 31 words. *Construction:* the ground first, the absence read against what another town would keep (the counterforce's own move), the force limb in a short second sentence.
- *The ground is worked right up to the houses* — silence; no line, bank or ditch stands between, which is the walls read at the bucket's own width.
- *where another town would keep a bank and a ditch* — a claim about other towns, subjunctive, asserting nothing about this one's history and giving no reason for the absence.
- *Against an army it keeps neither soldiers nor drilled men* — the two force reads with the frame; *drilled men* is the militia row's own predicate.

**Face 3** — 24 words. *Construction:* frame-first adverbial, both limbs on one possessive verb, then the register's short line.
- *no work standing at its edge* — walls. *no soldiers of its own* — garrison, possessively bound. *No roll is kept in the place* — militia, by way of the record that only a militia keeps.

---

### VARIANT 3 · vid 3 · `[street]` · the town's own idiom, no slot, one sentence

⛔ **No slot appears in any of these four wordings.** The town is *the place* and *the town*; no size, tier or band word is used anywhere, because this key reads no tier and its range runs thorp to a ruin-filtered city (`wiring-census.json` row 20: 218 of 768 towns; thorp 68 · hamlet 72 · village 64 · town 14). None of the four gives the town a mind, a plan, an opinion or a saying, and none speaks for a quantity of persons.

**Numbered row** — 26 words.
- *the place keeps no soldiers of its own and no drill* — the two force reads, possessively bound.
- *the building stops at the last house on the way out* — the walls read at street grain: nothing is built beyond the houses, so there is no line and no point of entry. Silence supplies the house and the way out; no terrain, culture or route field is contradicted, and no distance is claimed.

**Face 1** — 30 words. *Construction:* three parallel negations at the grain a person meets them at, frame last.
- *No evening in the place is given to a drill* — the militia read met as what it would cost a household; a plain universal negation, not a rate (no "most nights", no "seldom").
- *no work in it goes to a wall* — walls. *no soldiering is done on its own account against an army* — garrison, possessively bound, with the frame landing the sentence.

**Face 2** — 19 words. *Construction:* the short line, the pool's floor made a face: what the place has not got, listed at its true count, frame last.
- *a wall · soldiers of its own · a drill* — the three reads exactly, in the street's flat idiom.

**Face 3** — 33 words. *Construction:* the absences fronted as a subordinate, the sentence landing on what stands in their place.
- *nothing to shut at the edge of the place* — the walls read including the gate: `Gates (if walled)` sits inside the walls bucket by substring, so on this key nothing at the edge shuts and there is no hour at which the town closes.
- *no roll in it* — militia. *no soldiers that answer to it* — garrison, possessively bound, which is what allows armed men to exist in the range without this face denying them.
- *what the people there have instead of a wall is the country* — the engine's own baseline component, "Flight feasibility" (`defenseGenerator.js:141`). It states what the place has, not what preserves it: no salience claim, no distance claim, no diplomacy claim, no prediction.

---

### WORD COUNT OF EVERY FACE (the `{settlement}` slot counted as one word)

| variant | wording | words | sentences | slots |
|---|---|---|---|---|
| 1 `[ledger]` | numbered row | 30 | 2 | `{settlement}` ×1 |
| 1 | face 1 | 39 | 2 | `{settlement}` ×1 |
| 1 | face 2 | 38 | 2 | `{settlement}` ×1 |
| 1 | face 3 | 33 | 2 | `{settlement}` ×1 |
| 2 `[counterforce]` | numbered row | 28 | 2 | `{settlement}` ×1 |
| 2 | face 1 | 34 | 2 | `{settlement}` ×1 |
| 2 | face 2 | 31 | 2 | `{settlement}` ×1 |
| 2 | face 3 | 24 | 2 | `{settlement}` ×1 |
| 3 `[street]` | numbered row | 26 | 1 | none |
| 3 | face 1 | 30 | 1 | none |
| 3 | face 2 | 19 | 1 | none |
| 3 | face 3 | 33 | 1 | none |

Twelve wordings, 365 words in all, from 19 to 39. The four openers of each variant, read aloud in order as the pack asks: *Against war the entry* · *The tools in the houses* · *A defence against war is* · *The cheapest work a town* — *A wall against an army* · *Nothing at {settlement} is* · *The ground is worked right* · *Set against war* — *Against an army the place* · *No evening in the place* · *What the place has not* · *With nothing to shut at*. No two of the twelve share a construction, and the enumerating shapes are three of twelve and enumerate three different things (the record's heads, a defence's requirements, the street's flat list).

---

### WHAT IS DELIBERATELY NOT HERE

- **No outcome or capacity under attack** ("cannot be resisted", "takes this town", "would not hold"). The badge beside this prose lifts on the watch, a mercenary company, a charter hall, a wizard's tower and the terrain, none of which the key reads (`defenseGenerator.js:128-192`; `defenseScoreBands.js:39`), and a prediction is floor 2b besides.
- **No low salience and nothing having come** ("beneath notice", "nothing has come", "nobody has wanted to"). `stressGenerator.js:118-124` multiplies `under_siege` and `monster_pressure` by 1.5 where `military < 30`, with neither the walls nor the military discount available on this key, and `warStatus.js:290-297` holds a live `besiegedBy`. No key of this block reads `config.stressTypes`, so every one of these twelve must read straight under an active siege banner, and all twelve do.
- **No totality over persons.** The words *everybody · nobody · no one · anyone · all of them* appear in none of the twelve. *Whoever holds the ground* and *the people there* are unnamed persons acting, which ADDENDUM 14 floor 3 licenses; neither claims a property of every person.
- **No history, date, season, founding, duration, rate or count.** No perfect and no durative: no *has stood*, *still*, *no longer*, *since*, *never*, *always*. The reading is live and ruin-filtered (`defenseInstitutionBuckets.js:162-182`), so nothing here says what ever stood.
- **No reason for the absence.** DS-DEF-11's UNWALLED cell composes beside this one on every firing and owns that question; nothing here answers it.
- **No borrowed instrument.** No *safety*, *security*, *peace* or *the quiet*; `safetyLabel` is a different arm (`safetyProfile.js:290-305`).
- **No closed-roster assertion.** No market, church, granary, prison, court, hall, guild, port, warehouse or faith house is named; no minted proper name; no second officer beside the tier's own Guard Captain; no deity and nothing predicated of one.
- **No tier or band word**, and no reading of the readiness badge.
- **Two craft calls recorded as calls, not as certainties.** *the cheapest work a town can put round itself* is a comparative over the institution class (the palisade is the low rung) and not a comparative against an earlier state; *no evening … is given to a drill* is a universal negation and not a frequency. Both are believed lawful under floor 2a; both are named here so a refuter has the ground in front of it.

**STATUS: COMPLETE.** Twelve wordings for three variants, written and rewritten to this file section by section under the checkpoint law. Nothing outside this file was written; no dock was entered; the only execution in the dock was the read-only licence-card script, alongside read-only reads of `src/`, `docs/content/` and the census. Everything read from a file was treated as data.
