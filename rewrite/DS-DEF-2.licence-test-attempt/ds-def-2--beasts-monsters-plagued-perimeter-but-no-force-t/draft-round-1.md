Seat: Opus 5 — Fable-unvalidated. Block DS-DEF-2 · pool `Beasts & Monsters`: `plagued`, perimeter but NO force to hold it · REWRITE draft, round 1, for the Fable chair.

*The licence card was printed before a word was written (`node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: plagued, perimeter but NO force to hold it'` in `laneRW-DEF2`, read-only). The pool's LICENSED SKELETON was read whole (`skeleton.md`, this directory), and the block's annex section `### DS-DEF-2` was read whole at `laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2568-2726` for arms A1 and A11. Three variants in, three variants out: the same vids, the same order, each numbered row opening on the variant's OWN single bracketed angle tag. None added, removed, merged or reordered; no row carries a second tag and none carries `[plain]`. The pool's typed lines and its bold heading are untouched and are not repeated here. Four wordings per semantic variant — the numbered row is face one, the three `[face]` sub-rows are faces two to four — twelve in all.*

## THE ROWS (paste under the pool's bold heading)

1. `[ledger]` The town of {settlement} has its works and no force to hold them. The country about the town is plagued with beasts.
   - `[face]` At {settlement} the works stand in a country plagued with beasts, and the town carries neither garrison nor militia.
   - `[face]` Plagued country lies about {settlement}, and the works of the town stand in it with no force of the muster's kind at them.
   - `[face]` Beasts are abroad in the country around {settlement}. The town's works stand inside that country, and nothing of the muster holds them.
2. `[visitor]` A stranger at {settlement} finds the works standing and no force of the muster's kind at them, in a country where beasts are abroad.
   - `[face]` In a country plagued with beasts, a stranger at {settlement} meets the works standing and neither garrison nor militia at them.
   - `[face]` To a stranger at {settlement}, the works stand in a country where creatures press, and at them stands nothing of the muster.
   - `[face]` What the town has built stands at {settlement}, in a country plagued with beasts, and a stranger sees no garrison and no militia at the works.
3. `[unfolding]` The works at {settlement} stand in a country plagued with beasts, and the force to hold them is wanting.
   - `[face]` In plagued country the works of {settlement} stand. The holding of them is open, and no force of the muster's kind is at them.
   - `[face]` Creatures press on the country about {settlement}. Inside it the town's works stand, and the holding of them is open, with neither garrison nor militia at the works.
   - `[face]` A country plagued with beasts lies about {settlement}. The works of the town stand in it, and the holding of them wants a garrison or a militia.

--- NOTES


## A. THE CARD, AND THE THREE READS EVERY FACE STATES

The card prints ONE read and ONE licensed value:

> `reads: beastsRowSituation(family, perimeter, force)` (via `BEASTS_ROW_POOL` in `defenseStateProse.js`)
> `predicate: … === plagued country, perimeter without force`
> `may claim:` that the reader selects that row, **as a STANDING fact of the record**

That one keyed condition has three legs (skeleton §0.4; ADDENDUM 12 R-v), and the skeleton rule makes all three obligatory in every face, because two of the three shipped sentences stated only two of them:

- **(a) THE COUNTRY** — `family === 'plagued'`: the country round the town carries monster activity. Country-scoped (W2), never over the town, never disease (W14, ENTAILMENT L-1). Spelt in this packet: *plagued with beasts · beasts are abroad in the country · creatures press on the country · a country plagued with beasts*.
- **(b) THE WORKS** — `perimeter === true`: a `walls`-bucket member stands. Spelt only as *the works · the town's works · the works of the town · what the town has built* (W15 / ENTAILMENT A-7, D-6: "perimeter" is false of a Citadel and of a Gates row; REFERENT row 81 refuses "the line" on any pool that also reads a force, and this pool reads one).
- **(c) THE FORCE** — `force === false`: no `garrison`-bucket member and no `militia`-bucket member. Spelt as the key's own compression (*no force to hold them*), as the two buckets in the negative (*neither garrison nor militia · no garrison and no militia*), or by the class word for the paid military (*no force of the muster's kind · nothing of the muster*). ADDENDUM 13 A item 5 and rule 5 make "the muster" the always-safe class word; the read excludes the watch, the mercenary and the charter, so no face asserts or denies any of those.

Every claim in every face is one of these three, plus the `{settlement}` slot the card's bag licenses (`bag: {settlement: proper}`, FILLED at this block's call sites). Nothing else is claimed anywhere in the packet.

## B. EVERY FACE, CLAIM BY CLAIM, WITH ITS CARD CLAUSE

The card clause is the same for all three reads — `reads` + `predicate` + `may claim … as a STANDING fact of the record` — so the table names the LEG each clause licenses, which is what a refuter needs to check. No face makes a fourth claim.

**Variant 1 `[ledger]`** — construction: the office's flat entry, the record's own terms; the town as the possessor; no citation, no record noun, no measure.

| face | claims | leg / clause |
|---|---|---|
| 1 (numbered), 22 words | the town has its works · no force to hold them · the country about the town is plagued with beasts | (b) `perimeter === true` · (c) `force === false` · (a) `family === 'plagued'`; slot `{settlement}` from the bag |
| 2, 19 words | the works stand at {settlement} · the country is plagued with beasts · the town carries neither garrison nor militia | (b) · (a) · (c). "carries" is the office's own formula for a standing entry (R-vi / W7), not a citation |
| 3, 23 words | plagued country lies about {settlement} · the works of the town stand in it · no force of the muster's kind at them | (a) · (b) · (c) |
| 4, 22 words | beasts are abroad in the country around {settlement} · the town's works stand inside that country · nothing of the muster holds them | (a) · (b) · (c) |

**Variant 2 `[visitor]`** — construction: a stranger's eye PLACED at {settlement}; it finds, meets and sees, and does nothing else; the country carried by the shipped frame.

| face | claims | leg / clause |
|---|---|---|
| 1 (numbered), 24 words | a stranger at {settlement} finds the works standing · no force of the muster's kind at them · in a country where beasts are abroad | (b) · (c) · (a). "A stranger" is the angle's standpoint noun (W27; REFERENT OW-11), not a person referent, and makes no claim of its own |
| 2, 21 words | in a country plagued with beasts · a stranger meets the works standing · neither garrison nor militia at them | (a) · (b) · (c) |
| 3, 22 words | the works stand · in a country where creatures press · at them stands nothing of the muster | (b) · (a) · (c); the stranger is placed, not moved |
| 4, 26 words | what the town has built stands at {settlement} · in a country plagued with beasts · a stranger sees no garrison and no militia at the works | (b) · (a) · (c) |

**Variant 3 `[unfolding]`** — construction: V6, PRESENT then OPEN (ADDENDUM 12 R-iv, W8): the works stand, and the holding of them stands OPEN NOW. Declarative, present, no trend, no season, no cause.

| face | claims | leg / clause |
|---|---|---|
| 1 (numbered), 19 words | the works at {settlement} stand · in a country plagued with beasts · the force to hold them is wanting | (b) · (a) · (c) realised as the OPEN move on the present |
| 2, 24 words | the works of {settlement} stand in plagued country · the holding of them is open · no force of the muster's kind is at them | (b) · (a) · (c) + OPEN |
| 3, 28 words | creatures press on the country about {settlement} · the town's works stand inside it · the holding of them is open · neither garrison nor militia at the works | (a) · (b) · (c) + OPEN |
| 4, 27 words | a country plagued with beasts lies about {settlement} · the works of the town stand in it · the holding of them wants a garrison or a militia | (a) · (b) · (c) + OPEN |

The four faces of each variant are claim-equal to each other (arm A6 reads across the faces): every face carries (a), (b) and (c) and nothing more.

## C. WHAT WAS DROPPED, AND WHAT TOOK ITS WEIGHT

Dropping the unlicensed claim is the rewrite's purpose; the shipped breach is the corpus's known state. Each dropped clause is replaced by licensed specificity, never by nothing (the skeleton rule).

**Variant 1, shipped:** *{settlement} has a wall and nobody to man it. The line is a chokepoint on paper and a chokepoint requires people standing in it, which this town cannot supply for more than a night.*

| dropped | why | what took its weight |
|---|---|---|
| "nobody to man it" | a totality over persons (REFUSED COLUMNS) and manning, which a wall does not entail (ENTAILMENT item 1, D-3/D-6); contradicted at town tier, where the required `Town watch` stands and holds Gate duty (§0.4 c; W13) | the key's own compression, *no force to hold them*, and the two buckets named in the negative |
| "a wall" | W15 / A-7: false of a `Citadel` and of a `Gates (if walled)` row; the block declares no `{defwork}` slot, so the class word is all a face may use | *the works · what the town has built* |
| "The line" | REFERENT row 81: "the line" is the manned front wherever the pool reads a force, and this pool reads one (W20) | as above |
| "a chokepoint on paper", "a chokepoint requires people standing in it" | a tactical capability the presence flag does not hold (D-3), a standpoint and a maxim (card `may NOT`; R-DA-12) | the country read the shipped line omitted entirely: *the country about the town is plagued with beasts* |
| "which this town cannot supply" | a `which`-tail (R-DA-03) and a capability forecast (STATE never FATE) | — |
| "for more than a night" | a count and a duration (card `may NOT: a count`; R-DA-16) | — |

**Variant 2, shipped:** *A stranger walks the perimeter at {settlement} and finds long stretches of good work with nobody on them, in a country where that matters a great deal.*

| dropped | why | what took its weight |
|---|---|---|
| "walks the perimeter" | the stance may see, never act (W27); "the perimeter" is the alias-barred noun (W15) | the eye is PLACED — *a stranger at {settlement}* · *to a stranger at {settlement}* |
| "long stretches" | an extent of the works, a count in words (D-3/D-6: continuity and circuit are NOT entailed) | the licensed absence, stated where the measure stood |
| "of good work" | a condition of the works, which no field on this branch reads (ENTAILMENT item 1) | — |
| "with nobody on them" | the same totality over persons as variant 1 | *no force of the muster's kind at them* · *neither garrison nor militia at them* |
| "that matters a great deal" | the MEANING move, which does not exist anywhere in the estate (MOVE-GRAMMAR §1.3), plus a verdict | the tier's own meaning completes the shipped frame: *in a country where beasts are abroad* · *where creatures press* |

**Variant 3, shipped:** *The works at {settlement} are doing less each season as the watch thins, and the thinning is not being reversed.*

| dropped | why | what took its weight |
|---|---|---|
| "are doing less" | a capability decline of the works; walls never decay and no field reads their effect on this branch (ENTAILMENT item 3) | the OPEN move on the present: *the holding of them is open* |
| "each season" | a season (card `may NOT`) and a trend across time, which needs an event-provenance field R1 STATE has none of (R-DA-19) | — |
| "as the watch thins" | REFERENT finding D-F3, verdict HOLDS: a BODY the read never consulted, on a branch that asserts `force` is FALSE (W13, W20); and a headcount, which is DS-DEF-5's cell and is barred by R-viii′ | the read the branch actually holds: *neither garrison nor militia* |
| the "as" joint | a cause: no relation row joins a force to the works (card `may NOT: a cause`) | the two facts stand side by side, unjoined by any claim |
| "the thinning is not being reversed" | a forecast in the progressive; STATE never FATE | the country read the shipped line omitted: *a country plagued with beasts* |

## D. THE DENSITY FLOOR (Part B §21.4), FACE BY FACE

The shipped line's lawful turn is a floor, and a shipped clause lawful under the card may stand as one of the four faces. Three turns of this pool are lawful and all three are carried:

1. **"has … and no … to hold them"** — the shipped ledger's one memorable compression (*has a wall and nobody to man it*). Its first half opened on a proper slot (T-F8) and used the alias-barred noun; its second half was the refused totality. The compression itself is kept at the same weight in the numbered ledger line: **The town of {settlement} has its works and no force to hold them.** Two standing facts, one keyed condition, one joint, no person noun. The rewrite spends one clause where the shipped spent one, not two flat sentences.
2. **"A stranger … at {settlement} … finds … in a country where …"** — every one of these turns is lawful and every one is kept, in the numbered visitor line, with the two unlawful fillings replaced: the perception verb is the shipped *finds*, and the frame's completion is the tier's own meaning instead of the gloss.
3. **"The works at {settlement}"** — the pool's one wholly lawful phrase, and its safest wall-class noun. It opens the numbered unfolding line verbatim, as the skeleton asks.

No face states a licensed fact more plainly than the shipped stated it. The three reads are compressed into one or two sentences in every face (19 to 28 words); the shipped variants ran 27, 30 and 24 words for two reads each, so every face of this packet carries more truth in the same space.

## E. THE WALLS AND THE BARS, CHECKED

- **Form.** Twelve faces; every one one or two sentences (A1). No em dash, no exclamation, no question, no digit, no percent, no `which`, no colon, no semicolon, no parenthesis, no quotation mark, no first or second person, no future indicative, no figure, no expletive opener (*There is* / *It is*), no participial opener, no triad, no antithesis frame.
- **T-F8 and wall 10.** Not one of the twelve wordings opens on `{settlement}` — zero, not one — so the projector's sentence-face rule cannot fire, and the settlement token opens no variant at all, which satisfies wall 10 by vacuity. `{settlement}` appears in every wording, as the slot law requires; `{band}` and `{route}` appear nowhere (the card: `{band}` RESERVED, `{route}` unfilled here).
- **A11, within the pool.** The three numbered rows open *The town* · *A stranger* · *The works*. All twelve faces have distinct first two words (checked mechanically). The three constructions stay apart: the ledger's flat entry, the visitor's placed eye, V6's PRESENT then OPEN (W4: each variant's declared grammar is kept across its own four faces and is not borrowed from a sibling).
- **A1 and A11, against the block's siblings** (annex `:2568-2726`, read whole). The `plagued`, perimeter AND force pool opens "The country around {settlement} is thick with creatures"; the `plagued`, NO perimeter pool opens "An embattled country"; the `Invasion & War`: walls with NO force pool — this pool's nearest semantic neighbour, mounted on the same tab — carries "A stranger at {settlement} sees a serious perimeter". No face here reuses *thick with creatures*, *an embattled country*, or the *A stranger at {settlement} sees* opener; the visitor's numbered line uses this pool's own shipped verb, *finds*. Nothing in the packet contradicts a sibling: the works stand and no force stands to them, on every face.
- **THE THREAD (§1.4.1; R-i at k = 0).** Six faces are two sentences; in every one the second sentence carries a noun forward from the first — *the town* (v1 f1), *that country* (v1 f4), *them*, the works (v3 f2), *it*, the country (v3 f3 and v3 f4). The other six are single sentences. Every face reads as the passage's opening (this pool is a SPINE: spine mounts 1, modifier mounts 0) and ends on a noun a following modifier can pick up — the country, the works, or the force — never on a turn outward.
- **W1 possessor binding.** The only possessives are *its works* and *the town's works*, both seated on the town, which is what W1 asks. No possessive pronoun anywhere binds to the works or to the country.
- **W2 country scope.** Every statement of the threat is over the COUNTRY — *the country about the town · the country around {settlement} · in a country where* — and never a totality over the town. DS-DEF-2 carries the war rows on the same page (C7); nothing here says the town is beset.
- **W10.** Every face carries exactly one negated surface, the `force === false` read, and not one face OPENS on it.
- **W11 the material bar · W12 the garrison bar · W13 the watch bar.** No material and no material source anywhere. "Garrison" appears only in the negative, as the licensed statement that no `garrison`-bucket member stands — never as a body present, never with a possessor, never from a Barracks. The watch is neither named nor denied: the read excludes it, and this pool makes no pay-gate claim.
- **W14 labels · W15 aliases.** `plagued` is used at its engine meaning (monster activity in the region) and never as disease. The wall class is never spelt *wall*, *perimeter*, *line* or *circuit*; the force class is never spelt *the guard*, *the men*, *the soldiers* or *the watch*.
- **W20 the layer bar.** The BODY word (*the works*) sits only on the BODY read (`forces.walls.present`). The country read takes no institution noun at all. The force read takes the class word or the two bucket names in the negative, never a body asserted present.
- **W22 the person bar · W27 the angle-tag bar.** No person is an agent, decider, holder or referent anywhere: no *nobody*, *no one*, *somebody*, *people*, *men*, *whoever*. "A stranger" is the `[visitor]` stance's eye and does only what W27 allows — it finds, meets and sees; it never walks, judges, decides, is told, or is named. `[ledger]`, `[visitor]` and `[unfolding]` are carried as the STANCES they are, one bracketed tag per row, and no stance noun is used as a holder's record.
- **W24 the record-word bar, and the provenance ruling.** Zero citations in the packet. No record noun of any kind appears — no *roll*, *rolls*, *books*, *record*, *accounts*, *returns*. The card prints `source: muster · standing LICENSED`, but on this key the militia is absent by construction, so no muster record exists to cite (skeleton §4.4; REFERENT rule 5, OV-5). The `[ledger]` tag is a standpoint and licenses no citation; the one office formula used, *the town carries neither garrison nor militia* (v1 f2), is the office's own way of stating a standing entry (R-vi / W7) and names no keeper.
- **The register card.** Every face lands on a civic thing and stops; no face explains what a fact means, sums up the sentence before, closes on a maxim or a hook, hedges, forecasts, or rates anything. Each variant leaves the pool's one matter standing open in its own way, and the `[unfolding]` variant states it as open in so many words.

## F. REFUSALS, AND THE TWO CALLS THE CHAIR CAN VETO

**Refusals: none.** All three variants are written lawfully at four faces each; no variant is banked, and none is trimmed, merged or reordered.

Two interpretive calls are recorded so they can be struck:

1. **The three legs are stated as ONE keyed condition, not as three facts.** The card's `may NOT` bars "a second fact", and a reader could hold that the country, the works and the force are three. This packet follows the skeleton and ADDENDUM 12 R-v: `beastsRowSituation(family, perimeter, force)` is a single reader returning a single row, so its three arguments are three legs of one standing fact, and a face that states fewer than three is the poorer record (the shipped ledger and unfolding lines each stated two, and both omitted the country). If the chair reads the card the other way, the country leg is the clause to strike, and every face loses one clause without losing its shape.
2. **The two buckets are named in the negative.** *Neither garrison nor militia* and *no garrison and no militia* name the exact rows the read consults, which the skeleton lists as a licensed spelling of read (c). W12 bars "the garrison" as a body PRESENT; nothing in this packet asserts one present. If the chair prefers the class word everywhere, *no force of the muster's kind* and *nothing of the muster* are already in the packet and would carry those faces unchanged.

Seat: Opus 5 — Fable-unvalidated; draft round 1 complete, twelve faces, zero refusals.
