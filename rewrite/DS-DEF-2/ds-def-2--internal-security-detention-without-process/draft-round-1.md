Seat: WRITER (Opus 5, Fable-unvalidated) · DS-DEF-2 · pool `Internal Security: detention without process` · DRAFT ROUND 1
Written under ADDENDUM 14 (a face is lawful unless it contradicts the record; silence is permission) and the four floors in `rewrite/recut/CONTRADICTION-TABLE.md`.
Three variants rewritten in place, same vids, same angle tags, same `{settlement}`-only slot set. Four faces per variant: the numbered line plus three `[face]` sub-rows. Twelve renderings. No refusals.

**`Internal Security`: detention without process**
1. `[ledger]` Law at {settlement} runs as far as the keeping of a person and stops there. What would decide the keeping is not entered anywhere.
   - `[face]` A locked door at {settlement} is ordinary furniture, and the whole of what stands behind it is whoever turns the key.
   - `[face]` The allowance for law at {settlement} has a head for keeping prisoners and a head for deciding. The town has nothing to spend the second on.
   - `[face]` The cells at {settlement} do their work. Nothing above them answers for what they hold.
2. `[visitor]` A stranger at {settlement} can be put somewhere. A stranger who wants something put right has nowhere to bring it.
   - `[face]` Held at {settlement} means a door that locks. Punishment means something the neighbours can stand and watch, and a stranger will find nobody in the town who owes an account of either.
   - `[face]` Strangers at {settlement} settle a quarrel where it starts and do not let it travel. A quarrel that travels reaches a cell, and a cell is where the town's law runs out.
   - `[face]` In a town with courts a stranger would have somewhere to be wrong. At {settlement} the wrong itself is never established, and the person is held all the same.
3. `[street]` Putting a person away at {settlement} is a thing the town can do and cannot account for. On whose word it is done is not a question anybody asks.
   - `[face]` A knife is not the only thing that gets a person taken up at {settlement}. Owing money will do it, and nobody in the town is charged with telling the one case from the other.
   - `[face]` A person can be held at {settlement} and nothing in the town's week makes an occasion for saying why. Among the people who live there the holding is a fact and the reason is not.
   - `[face]` The people {settlement} holds get fed, and nothing in writing anywhere says what for.

--- NOTES

**The two card clauses every face stands on.** The card prints two reads, `court` and `prison`, and the pool's key is their conjunction (skeleton §0.1a, read off `defenseStateProse.js:509`): `court === false AND prison === true`, where both resolve through `getInstitutionNames` (`priorityHelpers.js:54`, `:55`). So each face carries exactly the arm-C claim set and nothing more:
- **(a)** the town has somewhere to hold people — licensed by `compound.inst.hasPrison === true` (`priorityHelpers.js:54`), the roster row printed beside the prose, and the engine's own English on this branch (`safetyProfile.js:331` "Offenders can be jailed"; `threatAssessment.js:148-149` "Detention without systematic prosecution.").
- **(b)** nothing stands behind the holding that decides it — licensed by `compound.inst.hasCourtSystem === false` (`priorityHelpers.js:55`, whose keyword set is `courthouse · court buildings · democratic assembly · city hall · town hall`, so the missing thing is the ROOM as well as the procedure), and by `safetyProfile.js:331-332` "without a working court system enforcement is arbitrary" and `defenseDisplay.js:233` "Detention without process. Arbitrary enforcement."

Everything else in a face is a particular the record does not deny. Under ADDENDUM 14 that is a licence, not a gap; the per-face rows below name the claim and the check that clears it.

**VARIANT 1 · `[ledger]` · grammar V8 (PRESENT → GAP), 24 words.**
- *"Law at {settlement} runs as far as the keeping of a person and stops there"* — claim (a), card read `prison`. The bound ("stops there") is claim (b) stated as a limit of the record, not of the world.
- *"What would decide the keeping is not entered anywhere"* — claim (b), card read `court` false, written as R-DA-08's GAP (a fact of the record, never of the world), which is also the F1-30-safe form: it does not seal a building a custom roster could supply. No holder is named, so no citation is made and `source: (none) · SOURCE-UNRESOLVED` is not spent. Close kind: absence.
- Floor 2: simple habitual present throughout, no magnitude, no date, no rate, no perfect. The shipped row's `, which` tail is gone.

**VARIANT 1 face 2 · OBJECT → PRESENT (V4), 21 words.**
- *"A locked door at {settlement} is ordinary furniture"* — claim (a), card read `prison`; the object is the row's own (`Small prison/stocks` = "Holding cells and public punishment"; `Large prison`; `Massive prison`), named at the grain a person meets it at and fixing no scale, so F1-13's scale trap is clear across the whole preimage.
- *"the whole of what stands behind it is whoever turns the key"* — claim (b). The agent is indefinite and present-habitual: licensed by the recut's strike of W22a/W22b (an unnamed person may keep a key) and kept clear of F3-06 by the marker's own test ("whoever holds the keys" is safe, "the keeper of the keys" is not). No body is seated, so F1-01/F1-02/F1-04 cannot fire. Close kind: a name not given.

**VARIANT 1 face 3 · PRESENT → CONSEQUENCE (structural), 26 words.**
- *"The allowance for law at {settlement} has a head for keeping prisoners and a head for deciding"* — claims (a) and (b) carried through the engine's own funding heading: the internal gate is `min(1, 0.65 + econOutput/50 × 0.35)` over **"watch wages, court and gaol funding"** (`defenseGenerator.js:249-254`), switched on at all because the gaol sets `hasLawInfra` (`:244`). The heading names court funding on a courtless town; that is the record's own shape.
- *"The town has nothing to spend the second on"* — claim (b). Deliberately a claim about the ABSENT COURT and never about money withheld, so F4-04 (no total collapse of pay; the licensed extreme is short, late, thin) and F4-03 (no splitting the four gates' direction) are both untouched — no face in this pool asserts a shortfall, which the preimage would deny wherever `econOutput >= 50` puts the gate at 1.0. The watch is not named anywhere (F1-01). Close kind: condition, landed short after a long sentence.

**VARIANT 1 face 4 · PRESENT → LACK (V3), 15 words.**
- *"The cells at {settlement} do their work"* — claim (a), card read `prison`.
- *"Nothing above them answers for what they hold"* — claim (b), card read `court` false. The flat contemporary line the register card licenses; the density law (Part B §21.4) is what keeps it from being made plainer. Close kind: absence. ABSENCE does not open the face and does not sit beside a second absence (wall 3).

**VARIANT 2 · `[visitor]` · the asymmetry, 20 words.**
- *"A stranger at {settlement} can be put somewhere"* — claim (a). An outsider's ACT, not an interior: the shipped row's *careful* and *cannot say precisely why* are the FEELING non-move (MOVE-GRAMMAR §1.3) and are converted, which is what §2.9 names as this variant's needed fix. No pronoun is carried, so the R6 gendered-line defect (CLERK-LAWS §2.2 C3 arm a) is not repeated.
- *"A stranger who wants something put right has nowhere to bring it"* — claim (b), the `court` read the useful way: no courthouse, no assembly, **no hall**, so there is no door to knock on. Phrased away from the sibling pool `no legal infrastructure`'s own "nowhere to take it"; the asymmetry (somewhere to be taken to, nowhere to bring anything) is this pool's alone. Close kind: absence.

**VARIANT 2 face 2 · definitional, 32 words.**
- *"Held at {settlement} means a door that locks"* — claim (a).
- *"Punishment means something the neighbours can stand and watch"* — the second half of the town-tier row's own printed description, `Small prison/stocks` = "Holding cells and **public punishment**" (`institutionalCatalog.js:1564-1569`), which the marker records as the strongest unused image in the pool and which no shipped row has ever spent. ⚠ **The one face whose particular leans on part of the range.** At city (`Large prison`) and metropolis (`Massive prison`) the row's description is silent about where punishment is done, and silence is permission (floor 1 header); nothing on those rosters denies it, and no fixture is named, so F1-32's shape (fixing a kind the row denies) does not fire. Flagged here so a refuter can rule on it rather than guess at it.
- *"a stranger will find nobody in the town who owes an account of either"* — claim (b). The habitual `will` is the one §3.4 keeps; the clause seats no office (F3-06) and no body (F1-01/F1-04). Close kind: a name not given.

**VARIANT 2 face 3 · conditional chain, 32 words.**
- *"Strangers at {settlement} settle a quarrel where it starts and do not let it travel"* — the ACT that converts the shipped row's interior, and the practical cost §2.8 names: a stranger has no standing and no procedure, so the prudent thing is to finish a matter before it becomes one.
- *"A quarrel that travels reaches a cell, and a cell is where the town's law runs out"* — claims (a) and (b) in one image. The causal clause is a CAPABILITY clause (a gaol with nothing above it can hold and cannot resolve), which is exactly what the block's own PROVENANCE + FENCE licenses and never a historical one. No trial, hearing, sentence or magistrate appears (F1-12). Close kind: object.

**VARIANT 2 face 4 · subjunctive contrast, 29 words.**
- *"In a town with courts a stranger would have somewhere to be wrong"* — the shipped row's best turn, carried near-verbatim as §2.7 asks. The contrast is sibling-licensed under R-DA-02: *a town with courts* names the sibling keys `Internal Security: court without detention` and `Internal Security: full legal chain` (`defenseStateProse.js:507-508`). The subjunctive is lawful by A2 (the edge is subjunctive, never a fate) and asserts no future.
- *"At {settlement} the wrong itself is never established, and the person is held all the same"* — claims (b) then (a), in that order, so the variant does not repeat its siblings' state-then-lack shape. "Never established" is habitual present, not an elapsed course. Close kind: condition.

**VARIANT 3 · `[street]` · PRESENT → OPEN (V6), 29 words.**
- *"Putting a person away at {settlement} is a thing the town can do"* — claim (a); *"put a person away"* kept from the shipped row as §3.7 asks, because it names no body and no building.
- *"and cannot account for"* — claim (b), carrying the shipped *"cannot say on what grounds"* compression at the same density (Part B §21.4 forbids trading it for plainness).
- *"On whose word it is done is not a question anybody asks"* — ⛔ **the shipped row's one outright floor-2 breach is cured here.** *has learned* asserted a past process the record never ran (F2-05's perfect; `ageBands.js`'s `HISTORICIZE_BAND` pin; F2-09 on the reroll). The turn is kept and re-seated as a standing condition, which is the conversion the table itself recommends. The *whose* stays unresolved — not a body (F1-01/F1-02/F1-04), not the tier's singular office (F3-06), not the seat (F1-49/F1-56) — which is also the better sentence and the pool's one matter left standing open. Close kind: a name not given.
- "The town" as an agent is the engine's own idiom throughout `safetyProfile.js`, and W20's layer bar is struck by name.

**VARIANT 3 face 2 · enumerative reversal, 35 words.**
- *"A knife is not the only thing that gets a person taken up at {settlement}. Owing money will do it"* — claim (a), and the fourth unspent thing in the purse: at city the hold's own printed description leads with **Debtors** (`institutionalCatalog.js:2282-2287`), and at metropolis the held are separated by kind (`:2514-2519`). At town the row is silent about who is inside, and silence is permission. The hold is a creditor's instrument as well as a keeper's, which is the most playable fact the record offers and which no shipped row in the block has noticed.
- *"nobody in the town is charged with telling the one case from the other"* — claim (b). No civil procedure is staged (F1-12), no amount is spoken (F2-01), no office is seated (F3-06). Close kind: a duty nobody holds.

**VARIANT 3 face 3 · the occasion that does not occur, 35 words.**
- *"A person can be held at {settlement} and nothing in the town's week makes an occasion for saying why"* — claims (a) and (b). Claim (b) is written as a missing OCCASION rather than a sealed building, which is the F1-30-safe form (a DM's custom hall is invisible to `hasCourtSystem` and prints on the roster anyway) while still carrying what `court === false` means: no hall, no assembly, nothing that formally decides.
- *"Among the people who live there the holding is a fact and the reason is not"* — the street's own register: the practice stated without comment, no moral and no verdict (§3.6). It is a statement about what is treated as ordinary, not a totality over persons, so F1-34's refused column is clear. Close kind: condition, elliptical and short.

**VARIANT 3 face 4 · the domestic particular, 14 words.**
- *"The people {settlement} holds get fed"* — claim (a), landed on a household rather than on an abstraction. Nothing in the record denies that the held are fed; the keeping of them is a line in the engine's own internal allowance (`defenseGenerator.js:249-254`). **No magnitude, no frequency and no shortfall** is spoken — an earlier draft of this face carried "every day", which is F2-06's rate, and it was cut.
- *"nothing in writing anywhere says what for"* — claim (b), as a record gap. No keeper is named, so F1-24 cannot fire, and the dry note (the arrangement of two true things) is the register's one permitted humour. Close kind: absence.

**POOL-GRAIN AUDIT (the craft requirement, which is the likeliest ground for a send-back).**
- **The DULL collapse the shipped rows already earned is broken.** Vids 1 and 3 shipped as the same `CAN X and CANNOT Y` join landing on the same abstraction. Exactly one of the twelve faces (variant 3's numbered line) now uses that shape, kept because §3.7 asks for its compression. The other eleven are: a limit with a record gap · an object-first identification · a funding heading with a short hard close · two short flat sentences · a parallel asymmetry · a definitional pair · a conditional chain · a subjunctive sibling contrast · an enumerative reversal · a missing occasion · a single-sentence domestic particular.
- **First two words, all twelve, in order:** Law at · A locked · The allowance · The cells · A stranger · Held at · Strangers at · In a · Putting a · A knife · A person · The people. No pair repeats (A11 at the face grain).
- **The settlement token opens nothing.** Zero faces and zero variant rows begin on `{settlement}`, which clears R-DA-17 / wall 10 at its strictest reading and also clears ARCH §2.5's T-F8 refusal of a sentence face opening on a `proper`-typed slot. Every face carries `{settlement}` exactly once, so the slot set equals the parent's.
- **The vocabulary does not repeat on itself.** The holding is met as: the keeping, a locked door, cells, prisoners, put somewhere, a door that locks, a cell, held, put away, taken up, the holding, holds. The nouns around it — furniture, key, allowance, head, neighbours, punishment, quarrel, knife, money, week, writing, account, word — are spent once each.
- **A person appears in nine of the twelve**, always unnamed, always plural or indefinite, never in an office the tier seats: whoever turns the key · a stranger · strangers · the neighbours · nobody who owes an account · nobody charged with telling · the people who live there · whoever feeds them (implied) · the person held.
- **Mechanical ratchets:** no em dash, no exclamation mark, no digit, no percent, no `which`-clause anywhere in the twelve. Three semicolons were drafted and all three were removed: every joint in the shipped twelve is a comma, a period or a bare `and`, and the only digits anywhere are the annex's own row numbers. Every variant is one or two sentences (A1); every comma joint is a single joint (S2).
- **The page grain.** This pool's line is the THIRD of five stacked paragraphs, after the beasts row and the invasion row, both of which are about the country, the wall and the armed hand. No face opens on the wall, the country, the gate or a force; every one of the twelve opens inward, on the town's own order, which is the passage's one licensed turn and is already where a turn belongs.
- **The thread.** Each face's second sentence carries a noun forward from its first (the keeping · a quarrel · the wrong · the holding · both halves of the arrangement), so every face reads as one passage alone; the spine sits first in its unit with zero modifier mounts today, and each face hands a noun forward (the keeping, the key, the cells, the cell, the holding) for whatever is mounted after it.
- **Zero citations**, on the marker's recommendation and for its reason: the pool's whole fact is that nothing writes down why a person is held, so a face citing a record would contradict the sentence it sits in. `source: (none) · SOURCE-UNRESOLVED` is never spent.

**REFUSALS: none.** All three variants were made lawful under the four floors; no variant is banked as a refusal row. The one place where a face's added particular leans on part of the preimage rather than the whole of it is flagged in terms above (variant 2 face 2, public punishment at city and metropolis tiers), and it is flagged as a writer's disclosure, not as a refusal.
