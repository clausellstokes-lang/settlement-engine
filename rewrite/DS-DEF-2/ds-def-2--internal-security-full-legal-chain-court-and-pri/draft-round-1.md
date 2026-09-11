# DRAFT ROUND 1 — DS-DEF-2 · pool `Internal Security: full legal chain (court AND prison)`

Writer: Opus 5 (Fable-unvalidated seat), for the Fable chair. REWRITE car 8b, block DS-DEF-2, draft round 1.
Written to `skeleton.md` (the Fable marker's analysis) and to the licence card printed this session in the dock
(`node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: full legal chain (court AND prison)'`).
Three shipped variants in, three rewritten variants out: same vids, same order, same angle tags, none added,
none removed, none merged; three `[face]` sub-rows each, twelve wordings in all.
Status: COMPLETE.

---

## THE ROWS — the complete replacement for the pool's variant rows (paste under the pool's heading)

1. `[ledger]` The town's law at {settlement} stands entered, and so does a place of confinement.
   - `[face]` At {settlement} the town has its law entered, and a place where people can be held.
   - `[face]` A place where a person can be held is entered at {settlement}, and entered with it is the town's law.
   - `[face]` People can be held at {settlement}; the town's law stands entered.
2. `[street]` A thing done wrong at {settlement} goes to the town's law, and the town keeps a place of confinement.
   - `[face]` A person can be held at {settlement}, and what is done wrong there goes to the town's law.
   - `[face]` A wrong done at {settlement} goes to the town's law. The town keeps a place where a person can be held.
   - `[face]` The town has law to hand at {settlement}, and a place of confinement.
3. `[visitor]` A stranger who comes to {settlement} finds the town's law standing, and finds a place where a person can be held.
   - `[face]` What a stranger finds at {settlement} is the town's law, and a place of confinement.
   - `[face]` On arrival at {settlement} a stranger sees a place of confinement, and the town's law.
   - `[face]` To a stranger at {settlement} a place of confinement stands, and standing with it is the town's law.

--- NOTES

### N.0 The card's clauses, labelled once (cited by label below)

- **[R-court]** `reads: court (not-produced)` · `predicate: court truthy` — the record holds a court system. Safe surface: the function word **"the town's law"** / **"law"** (`REFERENT-TABLE.draft.md:58`, "the court (body) only where a courthouse row resolves; otherwise the function word"). NEVER "the court", "the courthouse", "the hall", "a magistrate", "a trial", "a process".
- **[R-prison]** `reads: prison (not-produced)` · `predicate: prison truthy` — the record holds a place of confinement. Safe surfaces: **"a place of confinement"**, **"a place where a person can be held"**, **"people can be held"** (`REFERENT-TABLE.draft.md:59`, "the gaol · a place of confinement"; `ENTAILMENT-TABLE.draft.md` D-16 HOLDS, "people can be held").
- **[MC]** `may claim: that court (truthy AND truthy) holds, as a STANDING fact of the record` — present tense, the standing, both reads.
- **[BAG]** `bag: {settlement: proper}` FILLED at this block's call sites — every face carries `{settlement}` and no face opens on it (ARCH §2.5, T-F8).
- **[ANGLE]** `angle: ledger street visitor` — the three tags are kept one for one on the three vids.
- **[SRC]** `source: (none) · SOURCE-UNRESOLVED` — no citation, no record noun anywhere (W24; arm A13).
- **[NOT]** `may NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class law`.

Every face below makes exactly two claims and no third. The claim set is identical across all twelve wordings
(arm A6 reads across the faces): **[R-court] + [R-prison], each as [MC]**. `{settlement}` is [BAG], not a claim.

### N.1 VARIANT 1 `[ledger]` — construction: the compiled pair in the office's own entering formula

The angle is a STANDPOINT, never a holder: the formula ("stands entered", "is entered", "entered as standing")
is the office's own surface, licensed by W7/R-vi, and it names no roll, book or record (W24, [SRC]).

| face | claim → licence | construction (subject · read order · landing noun) | words |
|---|---|---|---|
| row 1 | "the town's law … stands entered" → [R-court] as [MC] · "so does a place of confinement" → [R-prison] as [MC] | subject the law · court→prison · lands on *a place of confinement* | 14 |
| f1 | "its law entered" → [R-court] · "a place where people can be held" → [R-prison] (D-16 HOLDS) | fronted placing, subject the town, possessive seated on the town (W1) · court→prison · lands on *held* (a condition) | 16 |
| f2 | "a place where a person can be held … entered" → [R-prison] · "entered with it is the town's law" → [R-court] | subject the place of confinement, then inversion · prison→court · lands on *the town's law* | 20 |
| f3 | "People can be held" → [R-prison] · "the town's law stands entered" → [R-court] | passive capability, then a semicolon joint · prison→court · lands on *entered* (a condition) | 11 |

"entered with it" in f2 is co-ENTRY on one standing, not a spatial fact: both flags are frozen standing booleans
(skeleton §0.4), so the adjacency asserted is the record's, which is [MC]'s own "as a STANDING fact". No relation
between the two reads is computed anywhere (W23).

### N.2 VARIANT 2 `[street]` — construction: the offence-side frame, the two places the town has to hand

The shipped frame "A thing done wrong at {settlement}" is kept verbatim on the row (skeleton §2(6): it is the
construction that makes this a street face); "goes somewhere" is kept ONLY with the somewhere named as the
licensed thing — "goes to the town's law" — exactly as the skeleton licenses it.

| face | claim → licence | construction (subject · read order · landing noun) | words |
|---|---|---|---|
| row 2 | "goes to the town's law" → [R-court] as [MC] · "the town keeps a place of confinement" → [R-prison] | subject the wrong (the shipped frame) · court→prison · lands on *a place of confinement* | 19 |
| f1 | "A person can be held" → [R-prison] · "what is done wrong there goes to the town's law" → [R-court] | subject a person (passive capability) · prison→court · lands on *the town's law* | 18 |
| f2 | "goes to the town's law" → [R-court] · "a place where a person can be held" → [R-prison] | two sentences; the second carries *the town* forward from *the town's law* (THE THREAD at k = 0, R-i) · court→prison · lands on *held* | 21 |
| f3 | "law to hand" → [R-court] · "a place of confinement" → [R-prison] | subject the town, parallel objects on one verb · court→prison · lands on *a place of confinement* | 13 |

### N.3 VARIANT 3 `[visitor]` — construction: the stranger's finding, seen and never acted

The stranger only SEES or FINDS (W27); it brings nothing, is given nothing, is told nothing and is named nothing.
"A stranger who comes to {settlement}" keeps the shipped opener's shape with the unlicensed act ("brings a
complaint") cut out; arrival is the visitor's licensed vantage (the skeleton rule: "what is seen on arrival").

| face | claim → licence | construction (subject · read order · landing noun) | words |
|---|---|---|---|
| row 3 | "finds the town's law standing" → [R-court] as [MC] · "finds a place where a person can be held" → [R-prison] | subject the stranger, parallel verbs · court→prison · lands on *held* | 21 |
| f1 | "is the town's law" → [R-court] · "and a place of confinement" → [R-prison] | wh-cleft, subject the finding itself · court→prison · lands on *a place of confinement* | 15 |
| f2 | "sees a place of confinement" → [R-prison] · "and the town's law" → [R-court] | fronted adverbial of arrival, elliptical second object · prison→court · lands on *the town's law* | 15 |
| f3 | "a place of confinement stands" → [R-prison] · "standing with it is the town's law" → [R-court] | fronted dative of perspective plus inversion · prison→court · lands on *the town's law* | 18 |

### N.4 WHAT WAS DROPPED, AND WHAT REPLACED ITS WEIGHT (the density law, §21.4, read against the shipped lines)

Dropped as UNLICENSED, one for one with the skeleton's §4.3 inventory: "can arrest" (enforcement, an imported
body's act); "can try" / "a process" / "a procedure" / "the procedure runs" (D-15 CONDITIONAL on a courthouse row
this pool cannot resolve; label bar W14 — the flag is a town hall on nearly every town and city, where a civil
arbitration is recorded and a criminal trial is not); "having all three" (a count, [NOT]); "means" (the MEANING
move, MOVE-GRAMMAR §1.3); "rather than a threat" / "rather than on the watch's temper" / "rather than a favour"
(contrasts naming no sibling pool key, R-DA-02); "takes time" (a duration); "has come to rely on" (a history from
a standing flag, R-DST-B, plus a belief frame, plus a fused agent, W23); "the watch's temper" (the ratified
wrong-layer finding D-F4 — a BODY imported on a `court ; prison` flag read, W20 and W13, with a character
adjective on it, R-DA-14); "brings a complaint" / "is given a procedure" (the stranger acts and receives, W27;
a role act, W22); "a favour" (impartiality, D-15 NOT ENTAILED).

What replaced their weight: **the second read, stated in every face.** The shipped `[visitor]` line states the
court read only (conditionally) and never the prison read at all; all four visitor wordings now carry both. The
only other licensed specificity the card holds is `{settlement}` itself — there is no tier word, no band word
(`{band}` is RESERVED and `scores.internal` is unread, label trap L-42), no threat standing and no pay gate on
this pool — so the remaining weight is carried by CONSTRUCTION: four subjects, both read orders, four landing
nouns and a word-count spread per variant, rather than by any added fact. This is the card's ceiling, and it is
recorded as such: a face here cannot be made denser without adding a claim, which §21.3 forbids.

Kept from the shipped text as lawful density floors: the function word **"the town's law"** (C6, the court read's
own noun); the verb **"hold"** and the capability **"can be held"** (C3, the prison read's own verb, D-16 HOLDS);
the street's offence-side frame **"A thing done wrong at {settlement}"** verbatim on row 2; the visitor's stance
word **"A stranger"** with its placing **"at {settlement}"** on row 3.

### N.5 THE WALLS, CHECKED

- No em dash, no exclamation mark, no digit, no percent, no `which`-clause, anywhere in the twelve. One semicolon
  in twelve faces (variant 1 f3): 0.083 against the R-DA-06 ceiling 0.130.
- No citation and no record noun of any kind ([SRC], W24): no roll, book, record, docket, entry, accounts. The
  ledger angle carries the office's FORMULA only ("entered", "stands entered", "entered as standing"), never a
  source (W7's bar on "the roll shows").
- No body word beyond the two reads' own safe surfaces (W20, W15): no watch (W13), no muster, no guard, no
  garrison (W12), no magistrate, no assize, no gaoler, no hall, no courthouse. No third civic object of the class
  `law` ([NOT]; `wiringCensus.js:1311`).
- No person as agent, decider or load-bearing referent (W22): "a person / people can be held" is the entailment
  table's own patient wording; "a stranger" is a stance word that only sees (W27). No "the person who", no
  "somebody", no "whoever".
- No count, cause, season, future, standpoint, second fact, history, belief, feeling, maxim, gloss or band word.
  No quantifier at all ("both", "all", "two") — the shipped "all three" is the class the card names first.
- No negated surface anywhere, so W10 is not reached; no absence opener.
- `{settlement}` appears exactly once in every face, always inside the sentence, never as the opener (T-F8); the
  slot set is identical across the parent row and its three faces (ARCH §2.5).
- One bracketed angle tag per row, exactly as it stands: `[ledger]`, `[street]`, `[visitor]`. No `[plain]` marker
  anywhere (it is a modifier-row marker and this pool is the row's SPINE, role `spine`).
- THE THREAD: every face closes on a carriable noun or a standing condition, so a modifier can pick it up
  wherever the composer seats it; the one face with two sentences (variant 2 f2) carries *the town* forward from
  *the town's law* (R-i). No face changes subject mid-passage and hands nothing back.
- Sibling distance (arms A1, A11): the three other `Internal Security` pools say, respectively, that the law can
  name a wrong and cannot keep the person who did it; that the town can hold and has no settled way of deciding;
  and that there is no legal machinery. Nothing here restates or contradicts any of them — the wordings above
  assert only the conjunction this key's predicate holds, and the four sibling branches are mutually exclusive.

### N.6 MEASUREMENTS REPORTED (information, not a verdict)

- Word counts, in row order: 14 · 16 · 20 · 11 ‖ 19 · 18 · 21 · 13 ‖ 21 · 15 · 15 · 18. Mean 16.75.
- Within-pool word-count sd over the twelve wordings: **3.25** (sample; mean 16.75). The R-DA-05 floor for a pool is 4.0 and
  the shipped corpus sits at 2.9, so this draft moves the measure toward the band without reaching it. It is
  reported here rather than met, because the only way to lengthen a wording on this card is to add a claim, which
  §21.3 forbids; a refiner may widen the spread by construction alone if one exists.
- Grammars: the pool carried 1 authored grammar (all three variants V1 PRESENT with unlicensed tails). This draft
  writes three distinct level-1 constructions — the compiled entry, the offence-side frame, the stranger's
  finding — so the pool carries min(k, 8) = 3 as MOVE-GRAMMAR §2.1 asks of a pool of three.
- Repeated two-word opener inside the pool: 0 of 12 (the twelve openers are *The · At · A · People ‖ A · A · A ·
  The ‖ A · What · On · To*; no two faces of one variant share their first two words).
- Sentence count: eleven wordings of one sentence, one of two (variant 2 f2). No wording exceeds two sentences
  (A1's law).

### N.7 REFUSALS

**None.** All three variants are made lawful under the card; no variant is banked as a refusal row.

### N.8 RECORDED FOR THE CHAIR (decisions taken inside this draft, vetoable)

1. **"the gaol" was available and was NOT used.** `REFERENT-TABLE.draft.md:59` ratifies "the gaol · a place of
   confinement" as the prison read's safe words, and the marker records at skeleton §0.4 and §4.6 that it reads
   "gaol" as the prison read's OWN noun rather than "another civic object of the class `law`" — a reading it
   marks vetoable. Because the card's `may NOT` names that class bar explicitly, and §21.3 rules that where one
   effort must choose between a sharper wording and a licensed one the licensed one wins, every face uses "a
   place of confinement" or the capability wording instead. If the chair confirms the marker's reading, a refiner
   may seat "the gaol" in one or two faces for vocabulary distance at no claim cost.
2. **"entered with it" / "standing with it" assert co-standing, not proximity.** Both flags are frozen standing
   booleans of one record (skeleton §0.4), so the adjacency is the record's and not the town's geography; no
   spatial fact is asserted and no relation between the two bodies is computed (W23, R-DST-B). Flagged because a
   refuter reading "with it" spatially would fail it, and the cure is trivial (drop the phrase and coordinate).
3. **The key's own name over-reads the record on most towns** (skeleton §4.6, label bar W14, entailment L-16):
   `hasCourtSystem` is set from a required town hall or city hall, so "full legal chain" is the KEY's naming and
   not a claim any wording here makes. Every face states the flag, never a chain, never a trial, never a process.
4. **No face names the building either flag rides on.** The pool cannot resolve whether the court flag is a
   courthouse or a hall, so the function word carries the read on every wording (W15, W21, A-18).
