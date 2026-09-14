# REFUTE ROUND 1 — DS-DEF-2 · pool `Disasters & Famine: granary, NO medical provision`

Seat: opus (REFUTER, the verifier), for the Fable chair. Round 1, judging the rows standing after the
refinement round (`kept.md`) against the licence card printed by
`scripts/prose-licence-card.mjs DS-DEF-2 'Disasters & Famine: granary, NO medical provision'`, the
MARKER packet's licensed skeleton (`skeleton.md`), the REGISTER CARD (S2, S3), RULES-V2-PART-B
§1 / §16–16.2 / §18 / §20 / §21–§23 (with §21.1–§21.4), MOVE-GRAMMAR §1–§3 / §1.4.1 / §4.4.1–4.4.3,
CLERK-LAWS §2.4.1 / §2.6.1, ARCH-COMPOSED-PROSE-v2 §2.5 / §8.3, and ADDENDUM 13's two ratified law
tables (bars W1–W27) with the ENTAILMENT and REFERENT draft tables' defense-desk rows.

Unit of verdict: the FACE. The numbered tagged line is **face 0**; the three `- [face]` sub-rows are
**faces 1, 2, 3**. Twelve faces judged.

**Counts: FAIL 8 · WITHHELD 1 · PASS 3.**

---

## 0. WHAT PASSED MECHANICALLY, SO THE FINDINGS BELOW ARE NOT ABOUT IT

Checked over all twelve and clean: no em dash · no exclamation · no question · no digit or percent ·
no `which`-clause · no semicolon · no second person · no citation and no record noun (the card's
`source` is SOURCE-UNRESOLVED; arm A13 is not engaged) · no holder, no person, no role word, no power,
no seat, no faction · no tier word · no season, harvest, famine, hunger, outbreak, illness, sickness
or plague (W17) · no wall material (W11) · no garrison, watch, muster or gate word (W12, W13, W16) ·
no future indicative and no perfect on a standing fact · no totalising quantifier on the unclosed
`hasHospital` / `hasChurch` columns · no building history (the block's PROVENANCE fence) · one angle
tag per numbered row, the shipped tags in the shipped order, no `[plain]` · slot sets {settlement} /
none / {settlement}, equal across each variant's four faces, `{band}` and `{route}` named by nobody ·
no face opens on an absence (order constraint 3) · no face opens on the `{settlement}` token (T-F8,
order constraint 10) · no two faces share their first two words (A11) · word counts 16–24, none above
30 (R-DA-06).

**Every face states both halves of R-4** (the granary read AND the care-class absence), so no face has
silently become a sibling pool's face — the marker's sharpest named regression (skeleton §5(b)) is
avoided throughout, and no face is an INVENTORY LINE by the letter of the skeleton rule.

**The alias question, cleared rather than failed.** All twelve spell the absent `care` row **a house
for the sick**. A-15's always-safe column is *"a house that takes in the sick" / "those tending the
sick"*, and W14 conditions the building spelling on a hospital-named row. On THIS branch no care row
resolves at all, so neither condition is available; the person-form for an ABSENCE ("nobody tending
the sick") would be a totality over persons, a REFUSED COLUMN on every card. The building spelling is
entailed by the flag's falsity (no hospital, monastery, friary or healer row ⇒ certainly no house for
the sick) and is the only lawful surface left. **Not a finding.** Likewise *a parish* is A-14's own
always-safe spelling for the `hasChurch` class, and *the town* is safe because `hasGranary` is a TIER
PROXY true only at town-and-above (W14's own reading of the label).

**One wiring observation, recorded for the chair, NOT a writer's fault.** The census row
(`rows[31]`) declares `objectClasses: [care, storehouse]`, but *parish* is a member of the census's
`temple` civic class (`wiringCensus.js:1312`, alias row A-14), not of `care`. Every face of this pool
therefore spends a `temple`-class civic object the census does not record for it, which is the class
list T-F12 reads when it refuses a modifier. The claim itself is licensed (F3 `hasChurch` is a
constituent of the branch the card's `reads` names), so no face fails on it; the census's class
derivation is the thing that is wrong. A row for CAR 8b-W-2.

---

## 1. THE VERDICT LINES (one per face: variant · face · verdict · law · quote · finding · cure)

### VARIANT 1 · `[ledger]`

**v1 · face 0 · PASS**
- **law:** none broken.
- **quote:** "A granary is entered at {settlement}, and the town has neither"
- **finding:** Both licensed reads are stated in the ledger's own stance. *Is entered* is the office's
  own formula (R-vi / W7) — a verb, not a record noun — so W24 holds on a SOURCE-UNRESOLVED card and
  arm A13 is not engaged; the two absent rows are named by their own class words instead of the
  shipped quantifier, which is exactly the cure the marker's 1.4 asked for; the face lands on a civic
  noun a following modifier can pick up (THE THREAD, skeleton §5(g)). No spatial, temporal,
  sufficiency or capacity claim rides anywhere in it.
- **cure:** none.

**v1 · face 1 · FAIL**
- **law:** A5 / the owner's four-faces rule as the brief states it — *the four faces differ in
  CONSTRUCTION (the subject, the order of the reads, the landing noun), not only in vocabulary*; a
  sibling paraphrase past a synonym swap.
- **quote:** "A store of grain is set down at {settlement}, and the town"
- **finding:** Face 1 is face 0's clause frame with two words exchanged. Both run
  `[indefinite storehouse NP] + [passive office verb] + at {settlement}, and the town + [negative
  possession] + [the two absent rows]`. Of the three construction axes the rule names, the ORDER OF
  THE READS is identical (R-1 then R-2 ∧ R-3 — only the two absent rows swap places inside one
  compound, which is a list order, not a read order), and the SUBJECT differs only as *granary* differs
  from *store of grain*, which is A-10's building/stock pair, not a different construction. Only the
  landing noun genuinely moves. The refinement's own note claims four differences; three of them are
  lexical.
- **cure:** give the second clause a subject that is not *the town* again, so the face differs in build
  and not in the negation word — e.g. "A store of grain is set down at {settlement}, and no house for
  the sick or parish is entered." Claim set unchanged, no claim added.

**v1 · face 2 · FAIL**
- **law:** MOVE-GRAMMAR §1.2 row 1, PRESENT *may NOT carry ... a spatial fact the field does not hold*
  (R-DST-B); and the card's `reads` — R-2 ∧ R-3 are absences on THE TOWN'S RECORD, not of a location.
- **quote:** "Beside the store no house for the sick or parish stands."
- **finding:** *Beside the store* asserts a spatial arrangement the branch does not hold: nothing in
  `disasterRowSituation(granary, hospital, church)` places any row relative to any other, and the
  three flags carry no site, plot or adjacency. Worse, the locative NARROWS the licensed absence — as
  written the face says no house for the sick or parish stands NEXT TO THE STORE, which leaves the
  rest of the town open and is therefore a weaker claim than R-2 ∧ R-3. A face that under-states the
  care absence has moved toward the `granary AND parish care only` cell, the marker's regression (b).
  (Secondary, not the verdict's ground: *in store* in the first sentence is an adverbial idiom, so the
  definite *the store* in the second has no referring antecedent to carry forward — the thread at
  k = 0, R-i, is asserted lexically rather than made.)
- **cure:** strike the spatial locative and keep the record's own scope while still carrying the store
  forward — e.g. "The store aside, the town has no house for the sick and no parish." Same two reads,
  same claim set, R-i still satisfied by *the store*.

**v1 · face 3 · PASS**
- **law:** none broken.
- **quote:** "Carried as standing at {settlement} is a granary, and a house"
- **finding:** The inversion and the elliptical close (*are not*, gapping *carried as standing*) give
  this face a build no sibling has, and the ellipsis is the pool's one genuinely compressed lawful
  turn — the density law (§21.4) protects it and the refinement was right to keep it word for word.
  *Carried as standing* is R-vi's named formula and produces no record noun, so W24 holds. The close is
  R-DA-04's *absence* kind, and the two civic nouns sit in the same clause, so the face still hands a
  noun forward.
- **cure:** none.

### VARIANT 2 · `[unfolding]`

**v2 · face 0 · WITHHELD**
- **law:** unresolved between two licensed instruments — R-DST-B / MOVE-GRAMMAR §1.2 row 2 (HISTORY
  *may NOT exist in R1 STATE at all*) and the block's own PROVENANCE fence (*institution presence is a
  STANDING fact with no recorded history*) on one side; the marker's skeleton §3, which licenses the
  lawful `[unfolding]` as *continuation in the present — a condition that holds and keeps holding*, on
  the other.
- **quote:** "the town stays without a parish or a house for the sick"
- **finding:** *Stays*, *goes on*, *keeps* and *stay absent* are not plain presents: each presupposes a
  prior state and asserts that it persists. That past implicature is the recorded history the block's
  PROVENANCE fence forbids on a standing configuration read — the flags carry no prior value and no
  tick. If the fence binds at the word grain, all four faces of variant 2 fall and the variant is
  unsatisfiable in its own stance, because flattening it to the plain present makes it a second
  `[ledger]` (the marker's regression (d), a dropped angle). I can prove neither side from the card,
  so I withhold rather than convict: **this is a chair ruling, not a writer's fault**, and it is the
  single most load-bearing open question in the pool. (Recorded beside it, not the verdict's ground:
  *stays … stays* doubles the main verb across the sentence's two clauses, which is the very fault the
  refinement round cured out of variant 1's *stands … stands*.)
- **cure:** none available to a curer; the chair rules. If the fence binds, the lawful surface is the
  plain present ("Grain is in store here, and the town is without a parish or a house for the sick")
  and variant 2 is then banked as a stance that cannot be realised on this read — a sitting row under
  §21.2, never a trim.

**v2 · face 1 · FAIL**
- **law:** A5 / the four-faces rule (a sibling paraphrase past a synonym swap), compounded — the face
  copies face 0's rhetorical figure as well as its frame.
- **quote:** "The store goes on holding grain, and the town goes on"
- **finding:** Face 0 is `[grain/store] + [continuative] + …, and the town + [the same continuative] +
  [negation of the two absent rows]`. Face 1 is that sentence with *stays* swapped for *goes on* and
  the two absent rows put in the other order. The doubled verb across the two clauses — the one
  distinctive rhythm either face has — is reproduced exactly, so the pair reads as one sentence written
  twice; and *goes on with neither a house for the sick nor a parish* is the clumsier of the two, which
  is a regression against §21.1's ceiling on top of the paraphrase.
- **cure:** strike the second *goes on* and give the LACK its own construction with a subject that is
  not *the town* — e.g. "The store goes on holding grain, and neither a house for the sick nor a parish
  is entered." No claim added, no claim dropped.

**v2 · face 2 · FAIL**
- **law:** the restatement-of-the-fact-inside-one-sentence ground; W6 (no doubled beat — a clause that
  restates the read it follows is the summarising beat).
- **quote:** "Stored grain stays stored"
- **finding:** *Stored grain* already asserts the whole of R-1 (D-12's entailment *grain is stored*);
  *stays stored* then asserts it a second time in the same clause. The predicate carries no information
  the subject has not already carried, so the face's first half is a loop, not a compression — and
  §21.4's density floor protects compression that REWARDS the reader, never a word repeated back onto
  itself. The refinement kept this clause verbatim and named it "the pool's one genuinely compressed
  turn"; it is the pool's one genuinely empty turn. The second half then repeats variant 1 face 2's
  clause core (*no house for the sick or parish stands*) with only the locative changed, so the face's
  remaining half is the pool's most-used string.
- **cure:** make the predicate say something the subject does not — keep the continuative without the
  loop, e.g. "Grain in store stays there, and no house for the sick or parish stands in the town."
  (Opener *Grain in* keeps A11's first-two-words rule against *Grain stays*, *Grain lies*, *Grain is*.)

**v2 · face 3 · FAIL**
- **law:** W1, POSSESSOR BINDING — *a possessive pronoun after a clause whose subject is the {defwork}
  or any object binds to that object; seat the town as the possessor or DROP the possessive.*
- **quote:** "Here the store keeps its grain"
- **finding:** The refinement inverted the draft's *the grain keeps its store* into *the store keeps
  its grain* and recorded the change as W1 satisfied. It is W1 breached: the bar's fault IS a possessive
  bound to an object, and its two prescribed cures are seating the town or dropping the possessive —
  neither was taken. The resulting claim is also wrong on the entailment table: D-12 entails the
  granary is COMMUNAL AT TOWN, so the grain is the town's, not the storehouse's, and *keeps its grain*
  additionally leans on the retention reading D-12 lists as NOT ENTAILED (*drawn on*; *who holds the
  key*).
- **cure:** take W1's own cure — drop the possessive: "Here the store keeps grain, and a parish and a
  house for the sick stay absent." (Or seat the town: "Here the town's grain stays in store, and …".)

### VARIANT 3 · `[street]`

**v3 · face 0 · FAIL**
- **law:** the restatement-of-the-fact-inside-one-sentence ground; W6 (no doubled beat).
- **quote:** "The granary at {settlement} is where the grain is"
- **finding:** A granary IS the place grain is held — that is the noun's own meaning, and D-12's
  entailment column says so in its own words (*grain is stored*). So the predicate defines the subject
  and the clause states R-1 twice with nothing else in it; the face's first half carries one read and
  spends a whole clause doing it. The refinement kept the turn under §21.4 as "the street's own pointing
  turn", but the density floor protects a lawful COMPRESSED line, and a definitional loop compresses
  nothing. This is the numbered row of variant 3 — the line the annex prints first and the one a
  falsy seed is nearest — so the fault sits at the pool's most visible face.
- **cure:** let the predicate do work the noun does not already do while keeping the street's vantage
  and the same two reads — e.g. "The grain at {settlement} is in the granary, and a parish and a house
  for the sick are not in the town." (Opener *The grain* is free under A11.)

**v3 · face 1 · PASS**
- **law:** none broken.
- **quote:** "Grain lies in the store at {settlement}, and no house for"
- **finding:** The street's stance is realised as the skeleton permits it — the civic object as met,
  stated plainly, with no speaker, crowd, reaction or piece of common knowledge (W22, W23, the FEELING
  non-move) and no drift into the `[visitor]`'s eye (W27). *Is part of the place* scopes the absence to
  the whole settlement, which is R-2 ∧ R-3 at their proper grain, and *the place* is a landing noun no
  other face of the pool uses. No spatial, retention or sufficiency claim rides on it.
- **cure:** none.

**v3 · face 2 · FAIL**
- **law:** MOVE-GRAMMAR §1.2 row 1, PRESENT *may NOT carry ... a spatial fact the field does not hold*
  (R-DST-B); and the card's `reads` — R-2 ∧ R-3 are absences on the town's record, not of a plot.
- **quote:** "neither a parish nor a house for the sick on the same ground"
- **finding:** The same fault as variant 1 face 2 and sharper, because the with-phrase makes the
  granary's OWN ground the scope of the absence. The branch holds no site for any row, so *the same
  ground* is invented; and as written the face says only that no parish and no house for the sick share
  the granary's ground, which leaves both of them standing elsewhere in the town. That is a strictly
  weaker claim than the read, and a face that under-states the care absence has drifted toward the
  `granary AND parish care only` cell — the marker's regression (b), the one he named as the sharpest
  available here.
- **cure:** keep the absolute with-phrase, which is this face's one distinguishing construction, and
  restore the record's scope: "Grain is in the granary at {settlement}, with neither a parish nor a
  house for the sick in the town."

**v3 · face 3 · FAIL**
- **law:** an unlicensed claim against the card's `may claim` (the row selected, and nothing more) and
  its `may NOT: a count`; W14's own reading of `hasGranary` — a TIER PROXY, true on every town-plus
  *whatever it stores*; D-12 NOT ENTAILED (*how full*).
- **quote:** "What sits in the store at {settlement} is grain"
- **finding:** The pseudo-cleft is EXHAUSTIVE: *what sits in the store is grain* asserts that grain is
  the whole of the store's contents. The branch reads one boolean and the flag says nothing whatever
  about what the building holds — W14 spells that out — so the face claims a contents reading no field
  carries, which is a new claim and breaks arm A6's claim-equality with its three siblings besides. The
  shipped sentences' force came from a sufficiency claim the engine contradicts; this face reaches for
  the same kind of force through the syntax instead of the vocabulary, which R-DA-18 calls costume.
  (Secondary, not the verdict's ground: *the town's ground* is a geography noun on a read that holds no
  geography field.)
- **cure:** drop the exhaustive cleft and keep the face's landing noun and its opener distinct — e.g.
  "Grain sits in the store at {settlement}, and a parish and a house for the sick are absent from the
  town." (*Grain sits* still differs from *Grain lies* and *Grain is* in its first two words.)

---

## 2. TWO POOL-LEVEL FINDINGS, RECORDED AS MEASUREMENTS (they key on no single face, so no face carries
them as its verdict)

1. **The pool has one joint and no short line.** Eleven of the twelve faces are a single sentence built
   on the same comma-and joint; the twelfth (v3 face 2) uses an absolute *with*-phrase, and one face
   (v1 face 2) is two sentences. Face lengths run 16–24 words with no face under 16, so R-DA-06's
   `< 8 words` floor is unreachable and R-DA-05's spread arm (the POOL is the unit of spread) reads
   flat at the face grain. The refinement recorded the length figure honestly (its residual 4) but not
   the joint figure. Both are consequences of R-4: every face must state two reads joined, and the
   branch offers one present civic object and two absent ones. **Measured, not convicted** — but it is
   why three of the eight FAILs above are sibling-distance or restatement findings rather than claim
   findings: with the claim set this narrow, construction is the only axis left, and the pool spends
   it thinly.
2. **The census's class list for this pool is wrong, and no writer caused it.** See §0's wiring
   observation: *parish* is a `temple`-class civic object and `rows[31].objectClasses` reads
   `[care, storehouse]`. A row for CAR 8b-W-2.

---

## 3. READ-ALOUD NOTES (information only, one per variant)

**Variant 1 `[ledger]`.** Read aloud, the office's three entry formulas (*is entered · is set down ·
carried as standing*) carry the variant well and sound like one clerk rather than three writers; the
inverted face 3 is the one that lands. The variant's weakness in the ear is that faces 0 and 1 are the
same sentence twice at a slightly different pitch, and face 2's second sentence puts a spatial word
(*beside*) where the record has no room, which a listener hears as a detail the page cannot back.

**Variant 2 `[unfolding]`.** The continuatives give the variant a real stance in the ear — the state
that keeps standing is audible and does not sound like the ledger — but the doubled verb
(*stays … stays*, *goes on … goes on*) turns into a tic by the second face, and *Stored grain stays
stored* reads as a riddle rather than a record: a listener waits for the second half of the thought and
gets the first half again. The whole variant rests on whether the chair lets the continuative carry a
past implicature on a read the block's own fence calls history-less.

**Variant 3 `[street]`.** The pointing turn is the right instinct for this stance and face 1 lands it;
the trouble is that two of the four faces buy their force from syntax — a definition
(*the granary is where the grain is*) and a cleft (*what sits in the store is grain*) — and both sound,
read aloud, like a sentence circling its own subject. The absolute *with*-phrase of face 2 is the
pool's best rhythm and is worth keeping once its invented ground is taken out.

---

## STATUS: COMPLETE. 12 faces judged; 8 FAIL, 1 WITHHELD, 3 PASS; §0–§3 written.
