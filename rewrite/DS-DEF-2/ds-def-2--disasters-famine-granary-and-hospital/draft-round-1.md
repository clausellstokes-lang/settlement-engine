Seat: Opus 5 — Fable-unvalidated (writer, DS-DEF-2, pool `Disasters & Famine: granary AND hospital`, draft round 1)

Block `DS-DEF-2` · pool key `Disasters & Famine: granary AND hospital` · role spine · form sentence · angles as they stand ([ledger] · [street] · [counterforce]) · three variants, four wordings each, none added, none removed, none merged, no vid moved.

The rows below replace the pool's variant rows verbatim, under the pool's existing bold heading.

1. `[ledger]` {settlement} keeps a granary for the grain and a hospital for the sick.
   - `[face]` {settlement} has a granary and a hospital.
   - `[face]` {settlement} keeps a house for the sick and a grain store.
   - `[face]` {settlement} is a town with a granary and with a hospital.
2. `[street]` A grain store and a sick-house both stand in the town.
   - `[face]` The granary is here, and the hospital is here.
   - `[face]` The hospital in the town stands, and the granary stands as well.
   - `[face]` The granary here is for the grain, and the hospital for the ill.
3. `[counterforce]` Neither the granary nor the hospital at {settlement} stands alone.
   - `[face]` What is standing at {settlement} is a hospital and a granary.
   - `[face]` A granary stands at {settlement}, and a hospital.
   - `[face]` The granary at {settlement} is not standing in place of a hospital.

--- NOTES

**The card's clauses, named short (from `node scripts/prose-licence-card.mjs DS-DEF-2 'Disasters & Famine: granary AND hospital'`).**
- **[C-read]** `reads: disasterRowSituation(granary, hospital, church)` via `DISASTER_ROW_POOL` in `defenseStateProse.js`; absent ⇒ no candidate.
- **[C-pred]** `predicate: ... === granary, hospital` — the value names the two civic objects and excludes every sibling value of the same read.
- **[C-claim]** `may claim: that ... (=== granary, hospital) holds, as a STANDING fact of the record`.
- **[C-bag]** `bag: {band: RESERVED, route: proper, settlement: proper}`, FILLED at this block's call sites: `{settlement}`.
- **[C-not]** `may NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class care`.
- **[C-src]** `source: (none) · standing SOURCE-UNRESOLVED` — no citation is licensed; a face naming a record holder is refused by arm A13.
- **[C-ref]** REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.

**What each variant kept and what it dropped (the drop is the rewrite's purpose; the shipped breach is the corpus's known state).**

- **Variant 1, old text.** KEPT: the granary limb ("holds food against a bad year") and the hospital limb ("has somewhere to put the sick"), both under **[C-claim]** on **[C-pred]**. DROPPED: "against a bad year" (a season — **[C-not]**); "the town can take a failed harvest or an outbreak" (a second fact, and a capability against an unrealised event — **[C-not]**, and A2 / STATE never FATE); "without either becoming a catastrophe" (an outcome; a CONSEQUENCE with no event-provenance field, MOVE-GRAMMAR §1.2 row 7 and R-DA-19).
- **Variant 2, old text.** KEPT: both objects present, under **[C-claim]** on **[C-pred]**. DROPPED: "and knows exactly what having both is worth" (a standpoint — **[C-not]**; a totality over persons — **[C-ref]**; a VERDICT, which is a non-move estate-wide, MOVE-GRAMMAR §1.3).
- **Variant 3, old text.** KEPT: that the granary and the hospital stand, which the old sentence presupposed in "the two buildings", under **[C-claim]**. DROPPED: "Neither a failed harvest nor an outbreak turns into a catastrophe" (a second fact over unrealised events — **[C-not]**, A2); "the reason is in the two buildings" (a cause — **[C-not]**; HISTORY has no event-provenance field here, MOVE-GRAMMAR §1.2 row 2); "the two buildings" (a count — **[C-not]**, R-DA-16); "rather than in the luck" (a contrast whose rejected alternative names no sibling pool key and no band — R-DA-02).

**Per face, the claim made and the clause that licenses it.** Every one of the twelve wordings asserts exactly one claim — that the disaster-row situation of this settlement is (granary, hospital), stated as a standing fact — so the four faces of each variant are claim-equal to each other, and the three variants carry the same licensed set their old sentences carried once the unlicensed claims are dropped.

| face | the claim | licensed by |
|---|---|---|
| 1 line — "keeps a granary for the grain and a hospital for the sick" | the granary stands; the hospital stands; each named by its own purpose | **[C-claim]** on **[C-pred]**; the slot by **[C-bag]** |
| 1a — "has a granary and a hospital" | the same, bare | **[C-claim]**, **[C-pred]**, **[C-bag]** |
| 1b — "keeps a house for the sick and a grain store" | the same, the two objects under their plain names, order reversed | **[C-claim]**, **[C-pred]**, **[C-bag]** |
| 1c — "is a town with a granary and with a hospital" | the same, as an attribute of the settlement | **[C-claim]**, **[C-pred]**, **[C-bag]** |
| 2 line — "A grain store and a sick-house both stand in the town" | the same, object-first | **[C-claim]**, **[C-pred]**; no slot, and none owed — **[C-bag]** licenses at most `{settlement}` |
| 2a — "The granary is here, and the hospital is here" | the same, doubled and flat | **[C-claim]**, **[C-pred]** |
| 2b — "The hospital in the town stands, and the granary stands as well" | the same, the hospital first | **[C-claim]**, **[C-pred]** |
| 2c — "The granary here is for the grain, and the hospital for the ill" | the same, each object by its purpose | **[C-claim]**, **[C-pred]** |
| 3 line — "Neither the granary nor the hospital ... stands alone" | the same, stated as the exclusion of the two single-provision sibling values | **[C-claim]** on **[C-pred]** (the value excludes them); the contrast form by R-DA-02, whose rejected alternatives are the sibling pool keys `granary, NO medical provision` and `NO reserves, hospital present`; the slot by **[C-bag]** |
| 3a — "What is standing ... is a hospital and a granary" | the same, as a cleft on what stands | **[C-claim]**, **[C-pred]**, **[C-bag]** |
| 3b — "A granary stands ..., and a hospital" | the same, short | **[C-claim]**, **[C-pred]**, **[C-bag]** |
| 3c — "The granary ... is not standing in place of a hospital" | the same, stated as the exclusion of the sibling value `granary, NO medical provision` | **[C-claim]** on **[C-pred]**; the contrast form by R-DA-02 on a named sibling key; the slot by **[C-bag]** |

**Walls checked on all twelve.** No em dash, no exclamation, no question, no digit or percent, no `which`-clause, no citation and no record holder (**[C-src]**), no second sentence, no future indicative, no existential opener, no pronoun closer, no evaluative adjective, no figure, no office, exemption or quantified totality (**[C-ref]**). Slots: variant 1 and variant 3 carry `{settlement}` in the numbered line and in all three faces; variant 2 carries none in the numbered line and none in any face, so no face's slot set differs from its parent's. The settlement token opens variant 1 alone (R-DA-17); variants 2 and 3 open on a civic noun or on the contrast.

**The thread (owner, 2026-09-08 ~21:4x).** These are spine wordings, so each is written to be the passage's first sentence and to hand a noun forward: every face closes on a civic noun of this pool (granary, hospital, store, sick-house, ill) or on the standing condition of one (`stands alone`, `is here`, `stands as well`), which is the noun a modifier of this block — the stores modifier among them — carries forward. None depends on a sentence before it.

**Sibling spines this pool sits beside (arms A1 and A11).** The other four rows of the block name walls, garrison, militia, court, prison and revenue; nothing here restates or contradicts them. Inside the `Disasters & Famine` family the four sibling values are mutually exclusive with this one, and the faces avoid their vocabulary — no `parish`, no `clergy`, no `infirmary`, no `nothing at all against disease`, no `reserves`.

**Judgment calls, flagged for the refuter.**
1. `both` in the variant 2 line is a determiner over the two objects that sentence itself names, not a count of the world. If it is read against **[C-not]**'s count, the line stands as "A grain store and a sick-house stand in the town." with no other change.
2. `for the grain`, `for the sick`, `for the ill` (variant 1 line, face 2c) name each object's own purpose, which is held to be inside the noun's meaning: they assert no stock in the granary, no sickness in the town and no season. If a refuter reads a purpose phrase as a second fact under **[C-not]**, those two wordings revert to bare presence and the claim set is unchanged.
3. Three names stand for one object across the faces (hospital · house for the sick · sick-house; granary · grain store). R-DA-22's one term for one thing is held INSIDE each face; the owner's four-faces law requires the vocabulary or the rhythm to differ across them, and the unweighted seeded roll renders one face per draw, so no reader meets two names for one thing.
4. `[counterforce]` is carried by shape alone. The cause the old sentence used is refused by **[C-not]**, so the angle survives as the standing-and-not-alone construction, with its contrast licensed by R-DA-02 against named sibling keys and asserting nothing the predicate does not already exclude.
5. The tags are written with backticks, as the pool's shipped rows and the annex grammar of ARCH-COMPOSED-PROSE-v2 §2.5 write them; the face sub-rows are indented three spaces to the projector's `FACE_ROW_RE`.

**REFUSALS.**
- **No variant is refused.** All three are written lawful under the card and the walls.
- **One pool-level law cannot be met: the distinct-grammar floor** (R-DA-05 / A11 as MOVE-GRAMMAR §2.1 states it — a pool of k variants carries min(k, 8) DISTINCT level-1 grammars). Under this card the licensed claim is a single standing situation value, so only two level-1 members are reachable: V1 (PRESENT) and V4 (OBJECT → PRESENT). Variant 1 takes V1; variants 2 and 3 both take V4 and are separated by angle, vocabulary, rhythm and the R-DA-02 contrast, not by grammar. A third distinct grammar would need a second licensed move — an INSTITUTION row, a CONSEQUENCE with event provenance, or a `none-exists` LACK — and the card holds none of them. This is a property of the licence, not of the wording, and no rewriting of these three variants removes it.
