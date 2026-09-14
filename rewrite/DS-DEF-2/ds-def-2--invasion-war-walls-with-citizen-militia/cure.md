# THE CURE — block DS-DEF-2 · pool `Invasion & War: walls with citizen militia`
curer seat: opus (a different author from the writers) · read whole: EXEMPLAR-PACK.md · card.md (sections 1, 2, 2b, 2b′, 2c, 2d, 3, 4, 7, 8, 9) · speakers.md · draft.md · refute.md · the pool's current rows (`RECEIPT_POOLS_DOSSIER_STATE.md`:2778) · the sibling rung `walls with NO force` (:2805, :2814) · the shipped rows (`f2da5a3ee`, three spines, no faces).

TARGETS: 5 named · **5 CURED · 0 REFUSED**. The pool was also ruled **DULL** at the pool grain, and the byte-identical rule is lifted, so **every one of the twenty faces is rewritten**. The three spines PASSED the refutation and are carried unchanged.

---

**`Invasion & War`: walls with citizen militia**
1. `[ledger]` The bank at {settlement} is up and the people who come out to it are the people who live behind it. They bring their own tools, and nobody is paid for the standing.
   - `[face]` `[stranger]` By a drover's account the man who stopped him at the gap was leaning on a spear of his own, and went back to a field as soon as he had his answer.
   - `[face]` `[gate]` A stranger at the gap states his business before he goes through, and the people standing there hold that a known face need not. They do not set out which faces are known.
   - `[face]` `[market]` A day the muster is called is a day the stall stays shut, and the traders' complaint is that the loss falls on the stallholder alone. <!-- seat: market 46/79 (hasMarket); "the traders" needs no market row -->
   - `[face]` `[tavern]` The tavern's account is that a call brings the same names to the bank, and that anyone drinking there can name the houses it does not bring. <!-- seat: tavern 67/79 -->
   - `[face]` `[elders · pair 1 · disagree]` The elders take it that the turn at the bank falls on every household alike.
   - `[face]` `[muster · pair 1 · disagree]` Those who muster say the turn falls on the households that come, and that those are not all of them.
2. `[street]` It is common knowledge here that the turnout comes when it is wanted and stays at its own work for everything smaller. Nothing anywhere says who is on it.
   - `[face]` `[gate]` The people who stand at the gap have other work waiting on them while they stand. The turn goes, by their own telling, to whoever can leave his work rather than to whoever it falls on by rights.
   - `[face]` `[elders]` The elders' account is that a house that misses its turn at the bank hears about it from its neighbours and from nobody else.
   - `[face]` `[muster]` Turns stand unfilled, those who muster grant, and the houses know which ones.
   - `[face]` `[tavern]` A man who stands his turn comes back to a day's work nobody did for him. The tavern counts that day as the cost of the standing. <!-- seat: tavern 67/79 -->
   - `[face]` `[stranger]` A traveller who asked who had charge of the line reports that he was given the names of houses and no name of a man.
   - `[face]` `[muster · pair 2 · disagree]` Those who stand put it that the place is held every time it needs holding. <!-- joinable -->
   - `[face]` `[tavern · pair 2 · disagree]` At the tavern the holding of the place is said to depend on who remembers whose turn it is. <!-- joinable · seat: tavern 67/79 -->
3. `[unfolding]` A stranger who comes to the gap in the bank is asked his business by a man who has left a day's work to ask it. The asking is the whole of the procedure.
   - `[face]` `[gate]` Men have been let through the gap who would not have been let through if anybody had been standing with them, and those who take the gap say so themselves.
   - `[face]` `[market]` Whatever comes into the place comes past somebody's neighbour, and the traders reckon a neighbour is easier to talk round than any officer. <!-- seat: market 46/79 -->
   - `[face]` `[stranger]` Nothing is taken at the way through and nothing is written down there. A pedlar who had looked to pay something for his passage says he paid nothing.
   - `[face]` `[elders]` There is no court here and nowhere to hold a man. By the elders' reckoning what is done instead is done by whoever turns out, and a man put out of the place goes out through the gap.
   - `[face]` `[tavern]` Talk at the tavern has it that a raid is a thing everyone here understands, and that what to do about anything larger is not agreed. <!-- seat: tavern 67/79 -->
   - `[face]` `[elders · pair 3 · disagree]` The elders take the standing at the bank for a duty every household owes the place, whether anything is coming or not.
   - `[face]` `[muster · pair 3 · disagree]` Those who muster take the standing for work against what is coming, and say a duty owed to nobody in particular is one nobody stands.

--- NOTES

## THE FIVE TARGETS, ONE BY ONE

**TARGET 1 · v3 f5 `[tavern]` · floor 1 · the siege denial. CURED.**
Was: "a raid is a thing everyone here understands and a siege is a word out of somewhere else."
Now: "Talk at the tavern has it that a raid is a thing everyone here understands, and that what to do about anything larger is not agreed."
The siege half is gone entire. Nothing is now predicated of the siege case in either direction, so the face is silent on `config.stressTypes` and prints lawfully under the siege banner on the 3 preimage towns carrying `under_siege` (`safetyProfile.js:116`). What survives is the raid half, which is the militia row's own service (`Emergency defense`, p 1.0 on 79/79, "Armed citizen response to external threats and raids"), and the new second clause sits inside the mil row's own sentence on 79/79 ("inadequate against any professional force with siege capability", `threatAssessment.js:117`) instead of contradicting it. "Not agreed" is a state of the town's opinion, not a claim about the record.

**TARGET 2 · v1 f5 `[elders · pair 1]` · the PROVENANCE ceiling. CURED, and the WITHHELD echo cured with it.**
Was: "The elders hold that the standing falls on every household behind the bank alike."
Now: "The elders take it that the turn at the bank falls on every household alike."
`the elders hold` is gone, so the KIND limb at `moveGrammar.js:225` no longer matches and the exact equality at `proseMoveGrammar.walker.test.js:853-854, :917` is left at its shipped value. `take it that` is outside the four-verb limb (`say|hold|remember|keep`). The claim is untouched.
The refuter's WITHHELD #2 said the re-verbing alone would not fix the spine echo, and it does not, so the nouns moved too: "the standing" became "the turn" and "behind the bank" became "at the bank", which clears both echoes of spine 1 ("nobody is paid for the standing", "the people who live behind it"). The muster half was re-cut to match ("the turn falls on the households that come"), and it now names its own subject so it stands alone.

**TARGET 3 · v3 f4 `[elders]` · the PROVENANCE ceiling, second match. CURED, and bared.**
Was: "The elders say there is no court here and nowhere to hold a man…"
Now: "There is no court here and nowhere to hold a man. By the elders' reckoning what is done instead is done by whoever turns out, and a man put out of the place goes out through the gap."
`the elders say` is gone. The cure goes one step past the re-verb the refuter asked for, and it goes there under ruling 40 rather than past it: **the first sentence is a fact the engine holds** (`hasCourtSystem` and `hasPrison` false 79/79; the same tab prints "No legal infrastructure: order relies on force alone"), so it stands BARE in the archiver's own hand and takes no attribution at all. Only the second sentence is an account, and only it is attributed. This cures the gate and pays part of the DULL bill in the same edit. The past tense of the old third clause ("whoever turned out") is now present.

**TARGET 4 · v2 f2 `[elders]` · floor 1, ruling 35, the neighbouring rung. CURED.**
Was: "the mending of the bank falls to whoever lives nearest that stretch of it, and nobody is appointed to say so."
Now: "The elders' account is that a house that misses its turn at the bank hears about it from its neighbours and from nobody else."
The fabric is out of it completely. The face is re-pointed at THE TURN, which is the card's own signature for this key (section 9, "WHAT IS IN DISPUTE — THE TURN, NEVER THE WAGE"), so it now needs `institutions[bucket=militia]` to be true and cannot be lifted onto `Invasion & War: walls with NO force`, where nobody has a turn to miss. It also needs the perimeter, the turn being at the bank, so it is not a face of `militia only` either. The withheld-reason shape the selector wanted is preserved and is sharper for the move: what is withheld is now who enforces, and the answer is that nobody does — which is the measured state of a town with no court, no prison, no watch and no hall (all false 79/79). The apostrophe in "The elders' account" breaks the PROVENANCE regex, as the refuter established at the old v2 f2.

**TARGET 5 · v3 f6 `[elders · pair 3]` · floor 1, ruling 35, and the sibling rung ships it. CURED by rebuilding the pair, not by dropping it.**
Was: "The elders take the bank for the boundary of the place before they take it for the defence of it." / "Those who stand in it say it is a defence first and a boundary only to people who do not stand in it."
Now: "The elders take the standing at the bank for a duty every household owes the place, whether anything is coming or not." / "Those who muster take the standing for work against what is coming, and say a duty owed to nobody in particular is one nobody stands."
The dispute is no longer about WHAT THE BANK IS, which is what `walls with NO force` ships at `RECEIPT_POOLS_DOSSIER_STATE.md:2814` in the same source's mouth with the same verb. It is now about WHAT THE STANDING IS FOR, which is a question only a key fixing an unpaid citizen force behind a perimeter can raise: an obligation owed to the place whether or not anything threatens it, against work done against a threat. Neither half survives the loss of `institutions[bucket=militia]`, and neither survives the loss of the bank. The pair stays `disagree`, and the disagreement is real in both directions rather than a grievance laid beside a defence.
This also clears the refuter's WITHHELD #4: the muster half no longer opens on a bare "it", no longer says "stand in it" (which read as a claim about the fabric's shape, fenced by the card), and names "the standing" so it reads alone.

## THE DULL VERDICT — WHAT WAS CHANGED, AND THE COUNT

The refuter's four charges, and what the rewrite does to each.

1. **One construction carried nineteen of twenty faces** (`[attribution] + [speech verb] + [that-clause]`). That frame now carries **four** of twenty (v1 f2's second clause, v1 f6, v2 f2, v3 f5). The other sixteen are: a possessive-account opener (v1 f1), a bare recorded fact taking the front of the face (v1 f2, v2 f1, v3 f3, v3 f4), content-first with the attribution at the turn (v1 f3, v3 f2), a possessive-account with no speech verb (v1 f4, v2 f2), take-for with no that-clause (v1 f5, v3 f6, v3 f7), the attribution INSERTED mid-sentence (v2 f3, v2 f1), a two-sentence fact-then-judgment (v2 f4), a subject-relative report (v2 f5), attribution-last (v3 f1), place-first passive attribution (v2 f7), and has-it-that (v3 f5). **Attribution-last, which the selector recorded as the one opener class the pool did not spend, is now spent** (v3 f1).
2. **`say` fell from fifteen of twenty to five** (v1 f6, v3 f1, v3 f3, v3 f7, and the passive at v2 f7). The five-deep run at v2 faces 3 to 7 is gone: those five faces now read grant · counts · reports · put it · said to depend. No attribution verb runs twice in succession anywhere in the pool, let alone three times.
3. **The archiver's own hand now appears in five places instead of one** — spine 1 and the opening of four faces (v1 f2 the p 1.0 entry service; v2 f1 the volunteers with other work; v3 f3 the double absence; v3 f4 the missing court). Each of those openings is a fact the engine holds and therefore stands bare under ruling 40, and the attributed account follows it inside the same face, so the register contrast the refuter said never fired now fires four times. ⚠ SEE THE FLAG BELOW: a fully bare face would need a token the projector does not have, so the bare fact is carried INSIDE a sourced face rather than as a face of its own.
4. **The four nouns.** bank 7 → 5 · turn/turnout 9 → 8 (it is the pool's signature and the thing in dispute in two of the three pairs, so it was thinned rather than cut) · gap or way through 7 → 6 · house/household 5 → 6. Against that, the rewrite adds nouns the pool did not have: answer, field, spear, stall, stallholder, loss, call, names, duty, neighbours, cost, line, passage, pedlar, drover, traveller, officer, raid, court.

**Everything the refuter told the cure to protect is protected.** Six distinct speakers (stranger · gate · market · tavern · elders · muster), three real disputes (the turn's owner · whether the place is held · what the standing is for), the one physical particular that earns its place (the spear that goes back to a field, v1 f1, and it is still the pool's ONLY one), the bill (the shut stall, v1 f3, and the pool still carries one bill per variant), the confession (the men let through, v3 f1), and the double absence measured on all 79 (nothing taken and nothing written down, v3 f3).

The refuter's other two WITHHELD faults are cured as well: **#1** (v1 f4's "the same names come out to the bank" echoing spine 1's "the people who come out to it") — the face now reads "a call brings the same names to the bank", which shares no phrase with the spine; **#3** (v2 f6's "whenever holding it is wanted" echoing spine 2's "comes when it is wanted") — the face now reads "held every time it needs holding".

## THE MECHANICAL SCAN ON THE CURED ROWS

No em dash · no exclamation mark · no digit · no semicolon · no colon on any player face · no contraction · no `will` or `shall` · no inversion · no `{settlement}` in any face and exactly ONE unit carrying it (spine 1, unchanged, so the pool's `slotsFilled` is untouched) · **no named record anywhere** (no roll, no register, no toll book, no accounts, no books, and no provenance phrase of the `from the road` shape) · **no `the elders say|hold|remember|keep` and no holder-kind word followed by any of those four verbs anywhere in the pool** · no self-citation (nothing says the survey, the record, entered as, this office) · no wage, pay or arrears predicated of the muster ("the cost of the standing" at v2 f4 is a day's work and never coin) · no stone, masonry, parapet, walk, stair, tower or gatehouse, no material predicated of the fabric, and no shape predicated of it · no armoury and no issued arms · **the night is settled in neither direction** · no count, magnitude, date, season, duration, rate, age, trend or history (the old "whoever turned out" past tense is now present; no face says "ever" or "never" of an elapsed course) · no tier word · no north-European furniture and no culture-specific object · no named office as any face's subject, and no Guard-Captain-shaped decider anywhere (the turn FALLS, the muster IS CALLED, both passive with no caller) · no deity · one physical particular in the pool · one bill per variant · every face stands alone with its own antecedent · every face is a different sentence from its siblings.

## HELD UNDER NOTES UNTIL THE CARS LAND (18i, 18l, 18m, 18n) — carried forward from the selector, re-checked against the cured rows

**The weighings (ruling 22; car 18i not landed). Two is the ration and two are kept.**
- weigh | variant 2 | pair 2 | It may be that both are right, the holding being one thing when something is coming and another on an ordinary day. *(re-worded from the selector's, which echoed spine 2's "when it is wanted"; still a conjecture, still opens, and its reason is drawn from both stakes)*
- weigh | variant 3 | pair 3 | Both readings are held here, and neither has had to give way to the other. *(unchanged; the dispute left standing, a different shape from the conjecture above, and it fits the rebuilt pair as well as it fitted the old one)*

**The bare observation (ruling 27 as re-cut by 40; car 18n not landed). ONE per pool.**
- observed | Nobody standing at the gap is marked out from anyone else in the place. *(REPLACES the selector's "The bank carries no mark of who keeps which stretch of it", which was written to sit beside the old v2 elders face and which, with that face cured away, now carries the neighbouring rung's own shape — fabric upkeep by stretch. The new one is a bare passive with no observer named, no number, no elapsed course, and it is the militia row's own text seen from outside: ordinary residents, their own tools, no pay. Checked against card section 2b′: it infers into no silence a required row denies.)*

**The public (ruling 28; the same car). ONE kept.**
- public | variant 1 | Everyone here has seen the bank and has seen who stands in the gap of it, and the place takes that for enough. *(unchanged; what was SEEN is the pool's two universal rows and binds under floor 1 in full, and "takes that for enough" is the perception half, which is the game master's to own)*

**The archiver's notebook (ruling 17 as amended). Two kept, on different shades and different feelings. No covert field exists on this pool (card section 2c), so neither note closes a question.**
- dm-only | shade: conjecture · feeling: clarity | There is no list, no court and no store here, and what holds the place together is the turn… whoever is excused from it is excused by somebody. *(the selector's, with the colon moved to the ellipsis so the two notebook devices are not the same device twice)*
- dm-only | shade: unsure · feeling: worry | It is to be hoped that the households not asked to stand are not the same households the place would go to first when something comes. *(the selector's "never asked" is now "not asked", which takes an elapsed course off a live field)*

## FLAGGED TO THE CHAIR

1. **A fully bare face has no token.** Ruling 40 says a face that states a recorded fact says it plainly in the archiver's own hand, and the DULL cure asks for two or three faces bared. The corpus has `[archiver · observed]` (shipped on the sibling pool) for an OBSERVATION, but nothing for a face that simply states what the engine holds, and the brief also says every face keeps a source bracket. I did not mint a token. **The bare fact is instead carried as the FIRST SENTENCE of a sourced face** (v1 f2, v2 f1, v3 f3, v3 f4), with the attributed account following it, which fires ruling 40's register contrast four times and takes zero wiring risk. If the chair opens a bare `[archiver]` token, v3 f3's first sentence and v3 f4's first sentence are the two that would split cleanly into faces of their own.
2. **The PROVENANCE budget is still an exact equality, and this cure moves it back to its shipped value rather than to a new one.** The shipped rows for this pool (`f2da5a3ee`) carry no citing variant; the two matches the rewrite introduced are both removed here and none is added, so `cited.length` and `kindOnly` return to 7. The refuter's wiring row stands: the next block will hit this again, and a budget handed to writers up front is cheaper than a refused packet.
3. **The smith still has no token** and this pool still earns it first (63 of 79 towns; the militia carries its own tools and he mends them). Unchanged from the selector's flag, and no face here leans on him.
4. **`market` is seated on 46 of 79.** Both `[market]` faces are written so that "the traders" carries them and no market-as-a-body is asserted, which is the safer form on the 33 towns without the row.
5. **The three spines are carried unchanged.** All three passed refutation with their tests recorded, they hold the pool's three required shapes (a bare fact, the public, a person fronted), and spine 1 is the only unit carrying `{settlement}`. The cure touched no spine, so the pool's slot census is unchanged.
