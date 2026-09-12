# FIDELITY ADVERSARY REPORT — W20 … W27, THE EIGHT REFERENT BARS OF ADDENDUM 13 PART B

**Archive under test.** `rewrite/retro/items-W20-W27.md` (20 rows).
**Source of truth.** `rewrite/retro/evidence/convert-W20-W27.md` (the re-cut packet, 20 items + NF-1…NF-6 + the costs-and-buys close).
**Third instrument consulted** (because the archive's own header invokes it as the authority for column 2): `rewrite/retro/verbatim/BRIEF-pre-recut-ADDENDA-1-to-13.md`, §B lines 173–180 and §A.1 line 166.

**Coverage of this audit.** All **20** of 20 source items checked on four axes (verbatim quote · verdict · ground · permission). All **7** items the source marked **SPLIT** (W20, W21a, W21b, W21c, W24b, W27a, W27b) checked on **both halves**. All **6** of the source's NEW FINDINGS (NF-1…NF-6) checked for carriage. Both closing sections compared.

**Method note.** Column 2 was verified mechanically, not by eye: each row's quoted text was normalised for markdown pipe/quote escaping and tested as a contiguous substring of the ratified brief. Result below.

---

## WHAT SURVIVED THE ATTACK (stated first, so the defects are not read as a collapse)

- **Item coverage is complete.** Packet ids `{W20, W21a, W21b, W21c, W22a, W22b, W22c, W22d, W23, W24a, W24b, W24c, W25a, W25b, W25c, W26a, W26b, W27a, W27b, W27c}` — archive ids: the identical set. Missing: **none**. Extra: **none**. Hunt (1) returns nothing.
- **Every verdict matches the packet.** Twenty of twenty, compared cell-for-cell. Tally CONTRADICTION 2 · MODEL 1 · SCOPE 1 · SPLIT 7 · STRUCK 9 reproduces the packet's own stated shape, and "16 of 20 struck or half-struck" reproduces its close. Hunt (3) returns nothing.
- **Column 2 is genuinely verbatim, not a paraphrase.** Eighteen of twenty quotes are byte-exact **contiguous** substrings of the ratified brief. Of the three ellipses in the column, **two are the brief's own** (`S-F1 …` in W20; `steward …` in W22b) — verified by confirming the whole quote including the ellipsis is contiguous in the source. The archive earns this: the packet's own column was a loose "gist", and the archive went behind it to the ratified text, saying so in its header. On W23 and W24a the archive is *more* complete than the packet, restoring "the bought watch is paid short", "the houses that finance the town have decided", and the full eleven-kind ratified noun allocation.
- **Every SPLIT carries both halves.** All seven name a KEPT clause with a field and a STRUCK clause with a reason. No half went missing.

That is the strong part of the record. The defects below are in columns 3–5 and in the close.

---

## FINDING F1 — SERIOUS. The one real elision in column 2 removes the fact that cuts against the slice's biggest strike, and an invented ground then asserts the opposite.

**The archive's W22c, column 2 (`the old law, VERBATIM`):**

> "PERSON is never a referent — BY PRODUCT SCOPE, not by measurement **…** A recorded NAME may be printed through a typed `{npc}` slot on a read that records it…"

**What the ratified brief has at §A.1 line 166, inside that ellipsis:**

> "PERSON is never a referent — BY PRODUCT SCOPE, not by measurement **(X-D3, OW-12: the engine DOES carry a typed NPC-to-institution edge; the institution table chooses not to read it; ADDENDUM 11's "no typed edge exists" is corrected to "the institution table reads no such edge").** A recorded NAME may be printed…"

This is the archive's only substantive elision, and it is the single most load-bearing parenthetical in the slice. The re-cut's floor 4 is **the engine's own positive model**. The elided clause records that the engine **positively carries a typed NPC-to-institution edge** — and that ADDENDUM 13B ratified this *as a correction to an earlier claim that it did not*. That is exactly the class of fact a floor-4 challenge to the W22a/W22b strikes would be built on, and it is the only place in the slice where it appears.

**The elision is not neutral, because the archive then writes a ground that depends on its absence.** The archive's W22a ground reads:

> "It policed PERMISSION, not truth — **the institution table reads no NPC edge, so the card could not prove a person**, and the bar refused the unprovable."

The packet's W22a ground says **nothing of the kind**; its whole ground is floor 3's by-name relaxation plus "No field denies an unnamed actor". The archive invented a licence-theoretic rationale, and the sentence it invented is the half of the brief's correction that survives the ellipsis, with the half that complicates it cut away.

**The same distortion is load-bearing in the archive's framing paragraph**, which the packet has no counterpart for:

> "a person could not carry weight at all, **because the institution table reads no NPC edge** … The bars were enforced not because any of these things were *false* but because the card could not *prove* them — the whole family is a permission regime."

The ratified law says the reverse in terms: PERSON is never a referent **"BY PRODUCT SCOPE, not by measurement."** The archive is also internally inconsistent here — its own W22c row correctly returns verdict **SCOPE** and cites product scope and THE PROMISE, which cannot be true if the person family was "a permission regime". Casting a scope rule as a permission rule makes the strike of its sibling look more obviously right than the record supports. This is hunt (2) and hunt (3) in one place.

**Repair.** Restore the parenthetical verbatim in W22c; delete or re-ground the invented sentence in W22a; amend the framing paragraph to say the person bar stood on scope, and that floor 3's *by-name* relaxation — not the licence/non-contradiction re-cut in general — is what releases the unnamed half.

---

## FINDING F2 — SERIOUS. Three of the packet's six NEW FINDINGS were dropped outright, and the other three are cited by id but never defined.

Grep of both files:

| | NF-1 | NF-2 | NF-3 | NF-4 | NF-5 | NF-6 |
|---|---|---|---|---|---|---|
| packet | 2 | 3 | **1** | 2 | **1** | **1** |
| archive | 1 | 2 | **0** | 1 | **0** | **0** |

**NF-3, NF-5 and NF-6 appear nowhere in the archive.** NF-1, NF-2 and NF-4 appear only as inline cross-references inside rows — the archive names the label "NF-1" and "NF-4" without ever stating what NF-1 or NF-4 *are*, so a reviewer working from the archive alone (the stated design goal: "challenge it without re-reading the whole programme") cannot resolve the identifiers the archive itself uses.

The three that vanished are not incidental. The packet's own words on them:

- **NF-3** — "`safetyProfile.js:296-300` prints the force's CONDITION in the engine's own words … **This is the single richest untapped finding class in the slice**, and it cuts BOTH ways, so it also tells a writer exactly which mood is licensed on which band."
- **NF-5** — "So a `plagued` face writing a cowed, sickened or demoralised town contradicts the panel beside it wherever that branch fires."
- **NF-6** — "**it is recorded here so the refuters do not charge the writer for it.**"

NF-6's stated purpose is protective: it exists so a later refuter does **not** fail a writer for a same-page mismatch that is a wiring row. Deleting it from the record built for that refuter's retrospective sitting inverts its function. NF-3's loss is worse still, because it directly falsifies a permission cell — see F3.

**Repair.** Carry NF-1…NF-6 into the archive as a defined section, or at minimum define the three the archive already cites.

---

## FINDING F3 — SERIOUS. W20's `what a writer may NOW do` overstates the new permission twice, and the archive's own example is an instance of the move its missing constraint forbids.

**Packet, W20 permission:**

> "Narrate a readiness band, a safety label, a score band, a capture rung **or a stock band** THROUGH the bodies the roster does hold — "the watch feels the badge before the town does" is now lawful on a town with a watch. **What stays refused is seating a body the roster denies**"

**Archive, W20 permission:**

> "Narrate a readiness band, a safety label, a score band, a capture rung, a stock band **or a condition** THROUGH the bodies the roster does hold — "the watch feels the badge before the town does" is lawful on a town with a watch. **Refused: seating a watch, garrison, wall, granary, hall or market the roster denies.**"

Two separate overstatements:

**(a) The refused set was narrowed from a rule to a six-noun list.** The packet's residue is open — *a body* the roster denies. The archive replaced it with the old law's own six nouns. But the archive's **own ground cell, three inches to the left**, lists nine flags: `hasWatch · hasGarrison · hasMilitia · hasMercenary · hasWalls · hasCharterHall · hasCourtSystem · hasMarket · hasGranary`. **`hasMilitia`, `hasMercenary` and `hasCourtSystem` are in the archive's ground and absent from the archive's refusal.** A writer reading the permission cell is told a mercenary company or a court the roster denies is now seatable. It is not. (The packet's header list also ends in "`… `" — non-exhaustive; the archive renders it as a closed set, compounding the same narrowing.)

**(b) The state/condition constraint is gone, and the archive's worked example violates it.** NF-3 — dropped per F2 — establishes that "W20 only ever policed the body NOUN", while `safetyProfile.js:296-300` prints the force's **condition**: "The garrison is overwhelmed or corrupt." · "The watch is stretched far beyond its capacity." · "There is no meaningful guard presence." The archive's licensed example, **"the watch feels the badge before the town does"**, is a claim about the watch's *alertness*, not its existence — precisely the class NF-3 says is a same-page contradiction with a quotable sentence wherever `:297` fires. The archive prints the example as flatly lawful ("is lawful on a town with a watch") and prints no condition caveat anywhere. The packet at least hedged it as "now lawful" in a document whose NF-3 stood eight rows below.

**Repair.** Restore the open residue ("a body the roster denies" / the nine flags), and add the NF-3 condition constraint to the permission cell, with the example qualified by band.

---

## FINDING F4 — SERIOUS. W22d's permission is broadened by the archive past the re-cut's own audience model, and the closing section does not name it.

**Packet:** "Say the town knows one of its officials is bought, **where the roster prints one.**"
**Archive:** "Say the town knows one of its officials is bought, **on any town where the roster prints one.**"

"On any town" is the archive's addition. It is also wrong on the archive's own pages. The ratified brief's **rule 4** — which the archive quotes in full one row later at W26a, and which it upholds as **MODEL**, floor 4 — says:

> "a covert corruption impairment, **an unexposed corrupt officer homed at a security body**, a birth capture at `corrupted`/`capture` … are the DM face (the pen line names the OFFICE, never the officer)"

"The town knows" is an assertion of **public** knowledge. Where the impairment is covert or the officer unexposed (`corruption.js:667-691`, the unexposed-stooge route, cited in the archive's own W26a ground), a **player** face saying the town knows denies the projection printed beside it — which is verbatim the ground on which the archive kept W26a. The permission cell carries no audience qualifier at all.

This is also a **hunt-(5) miss**: W22d is a strike whose released move collides head-on with the one item in the slice the fold kept as MODEL, and the closing section's five challenges (W23, W24a, W26b, W22a, W24c) do not include it.

**Repair.** Qualify: "on the DM face always; on the player face only where the impairment is REVEALED (a revealed impairment is a public scandal both faces may name — rule 4)." Add W22d to the closing.

---

## FINDING F5 — MODERATE. W25c is a high-risk strike the closing should have named, and the archive's permission cell actively instructs the move the old law deferred.

**The old law (archive's own column 2):** "…is a wiring defect (a `properFill` refusal for the register car), and **a writer treats `{counterpart}` on DS-POW-4 as DM-only until then.**"
**Archive permission:** "Write `{counterpart}` faces for the **PLAYER** face on DS-POW-4. The literal `(hidden)` string is the register car's to filter."

The deferral's condition — "until then", i.e. until the register car lands — is recorded by both packet and archive as **unmet**. The archive's ground for striking is "A writer cannot cause it and cannot cure it", which is true of causation and irrelevant to consequence: the strike releases faces onto a player surface where the slot is known to render `'Unknown Faction (hidden)'`. That literal string on a player face is an audience-model breach of exactly the W26a kind, and the archive emphasised the release by capitalising **PLAYER** — the one word the old law's clause was written to withhold.

The closing challenges W26b on precisely this logic ("it is W26a's own ground, refused"). W25c has the same shape, a harder edge (a literal placeholder string, not an unreliable narrator), and is not challenged. A reviewer reading the closing would take the five named strikes as the risk surface and miss this one.

**Repair.** Add W25c as a sixth challenge, or restore "DM-only until the register car lands" as the permission cell's rider.

---

## FINDING F6 — MINOR. W27b's struck list inflates the release by one verb that was never barred.

**Old law (archive's own column 2):** ""a stranger" is the visitor's eye — **it may see**, never act, decide, be told or be given a name"
**Archive ground:** "STRUCK — **see** / act / decide / be told / intervene / be resented, by floor 3's relaxation of the person bar."
**Packet ground:** "STRUCK by floor 3's relaxation for act / decide / be told / intervene / be resented."

Seeing was the visitor's one *affirmative* licence under the old bar. The archive lists it among the things the strike released, which misreports what the strike did and makes the release read one item larger than it was. The packet has it right.

---

## FINDING F7 — MINOR. Two permission cells are silently re-conditioned relative to the packet — one tighter, one looser — with no note that the archive is departing from its source.

- **W24a, tighter.** Packet: "Accounts, ledgers, minutes, returns, the writ are all back". Archive: "…are all back, **on any organ read whose keeper the town holds.**" The added condition is almost certainly *correct* (it imports W24b's surviving residue, and the archive's own closing challenge 2 argues the keeper-entailing words need exactly this test) — but the archive is a scribe's record, and it presents its own improvement as the packet's decision. An undeclared correction in the direction that makes a strike look safer is the same failure mode as an undeclared softening, one sign flipped.
- **W20, looser.** The archive adds "**or a condition**" to the licensed read kinds; the packet's list stops at "a stock band". The addition tracks the old law's own enumeration and is defensible, but it is not the packet's grant.

**Repair.** Either revert to the packet's text or mark both as the archive's amendments, in the VALIDATION column the table already carries.

---

## FINDING F8 — TRIVIAL, recorded for completeness.

- The header cites the bars at "§B **lines 172–180**"; the eight bars occupy lines **173–180**, with 172 the §B heading. Harmless if the heading was meant to be included; a reviewer following the cite will find it.
- The **VALIDATION column is empty on all 20 rows** ("—"). Presumably reserved for the Fable seat. Recorded so a later reader does not mistake an unfilled column for a completed one.
- The packet's closing section "**WHAT THE SLICE COSTS AND BUYS**" has no counterpart in the archive. Its two load-bearing figures survive in the archive's header ("16 of 20"; the one-repeated-core sentence), but **the four items that keep full teeth are never enumerated as such** — the packet names them (W25a, W25b, W26a, W22c) and characterises them ("two alias faults, one audience model and one constitutional scope rule — none of them touches flavour"). That characterisation is the fastest orientation in the packet and it is gone.

---

## VERDICT

# FAITHFUL WITH NOTED DEFECTS

**Items checked: 20 of 20** (every item in the source), including **all 7 SPLIT items on both halves**, all **6** NEW FINDINGS, and both closing sections.

The archive's spine is sound and, in places, better than its source: complete item coverage, twenty of twenty verdicts matching, a tally that reconciles, and a `the old law, VERBATIM` column that is demonstrably verbatim — eighteen of twenty quotes byte-exact and contiguous against the ratified brief, the two remaining ellipses being the brief's own. The fold's decisions are not misreported and no strike was smuggled.

It is **not** clean. Two defects are material and should be repaired before the retrospective sitting:

1. **F1** — the W22c elision removes the ratified correction that the engine *does* carry a typed NPC-to-institution edge, and the archive then supplies an invented ground and a framing paragraph asserting the opposite of what the law says ("by product scope, **not by measurement**"). This is the one place in the slice where a softening makes a strike look more obviously right than it was.
2. **F2/F3** — three of six NEW FINDINGS were dropped, including the one the packet calls "the single richest untapped finding class in the slice"; its loss lets W20's permission cell licence, by worked example, the exact move it forbids.

Two further permission cells overstate what the re-cut grants (**F3(a)**, **F4**), and two high-risk strikes the closing should have named — **W22d** and **W25c**, both colliding with the audience model the fold kept as MODEL — are absent from it.

None of these reverse a verdict. All of them would mislead a reviewer working from the archive alone, which is the standard the archive was built to meet.
