# DRAFT ROUND 1 — DS-DEF-2 · pool `Disasters & Famine: granary AND parish care only`

Seat: Opus 5 (WRITER, Fable-unvalidated). Variants: **3**, in place, same vids, same angle tags, same order.
Faces: **4 per variant** (the numbered line plus three `[face]` sub-rows) = **12**.
Written to the marker skeleton at `skeleton.md`, under ADDENDUM 13 PART A (W11–W19) and PART B (W20–W27), beside W1–W10.

---

## THE ROWS, READY TO PASTE UNDER THE POOL'S HEADING

1. `[ledger]` The granary at {settlement} holds grain against a failed harvest and a house of the faith stands in the town; no infirmary stands at all.
   - `[face]` Grain is held in the granary at {settlement}, reserves against hunger, and the parish stands on the town's ground. No house that takes in the sick stands in the town.
   - `[face]` What the town holds back is grain against a failed harvest, and a house of the faith stands at {settlement}; no ward for the sick is kept in the town.
   - `[face]` Against a failed harvest the granary at {settlement} holds grain in store, and a house of the faith keeps its ground in the town. The town has no hospital.
2. `[street]` The parish stands at {settlement} and the town has no infirmary. Grain sits in the town's granary, held against hunger.
   - `[face]` The town has a house of the faith and no ward for the sick. At {settlement} the town's grain is in store against a failed harvest.
   - `[face]` Grain is held back at {settlement} against a failed harvest, and no house that takes in the sick stands in the town. The town's house of the faith stands on its own ground.
   - `[face]` A house of the faith is on the town's ground at {settlement}, and no infirmary is. The granary keeps the town's grain against a failed harvest.
3. `[visitor]` A stranger finds a house of the faith at {settlement} and no infirmary in the town. The town's granary holds grain against a failed harvest.
   - `[face]` A stranger comes to {settlement} and sees a house of the faith standing and no ward for the sick in the town. Grain is held in the town's granary against hunger.
   - `[face]` To a stranger arriving at {settlement} a house of the faith stands in plain sight, and no house for the sick stands in the town. The town's granary holds back grain against a failed harvest.
   - `[face]` The parish is what a stranger finds standing at {settlement}, with no hospital in the town. The granary holds the town's grain against a failed harvest.

---

--- NOTES

## 0. THE LICENCE THE WHOLE POOL IS WRITTEN FROM

The card (printed in the dock, `node scripts/prose-licence-card.mjs DS-DEF-2 'Disasters & Famine: granary AND parish care only'`) licenses exactly this:

- **reads** `disasterRowSituation(granary, hospital, church)` selecting the row `granary, parish care` of `DISASTER_ROW_POOL` (`defenseStateProse.js:580-586`, key at `:661-663`), which fires **only** on `hasGranary === true` AND `hasHospital === false` AND `hasChurch === true`;
- **may claim** that selection, *as a STANDING fact of the record*;
- **bag** `{settlement: proper}` filled (`{band}`, `{route}` unfilled at this block's call sites);
- **source** `(none) · SOURCE-UNRESOLVED` — so **no citation and no record noun anywhere in this pool** (W24; arm A13 refuses a face naming a holder);
- **may NOT**: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of class `temple`; and the standing refused columns (a totality over persons; an exemption; a named character's fate; a theological claim).

The skeleton's four reads (`skeleton.md` §1) are the whole licensed content and **every one of the twelve faces states all four**:

| read | what it is | where it is licensed |
|---|---|---|
| **R1** | a granary-class row stands | the `granary` arg TRUE of the card's reader |
| **R2** | grain is held in store there and it buffers a harvest | D-12 ENTAILS (entailment table, desk section), carried from the shipped v1's licensed clause |
| **R3** | **no** hospital-class row stands | the `hospital` arg FALSE; MOVE-GRAMMAR §1.2 row 11 class (a) LACK; the flat form only |
| **R4** | a church-class row stands (at town `Parish churches (2-5)` is required) | the `church` arg TRUE |
| **R5** | the three together are the row's standing | the card's `may claim`, realised as the present-tense standing of the three bodies — never as a grading |
| **R6** | `{settlement}` | the bag's one filled slot |

**The pool's trap, and how every face avoids it (skeleton §5.2).** The key's own word *care* is the one thing `hasChurch` does not entail (D-14 NOT ENTAILED "medical capability"; D-14 ENGINE CONTRADICTS "Clergy care from `hasChurch`"; **W14 THE LABEL BAR** — an engine label is read at its engine meaning, so the key does not license the claim its name makes). **No face predicates care, tending, nursing, prayer, an observance, a capability or a grade of the house of the faith**, and no face places the parish in a clause governed by sickness. The parish is stated as a standing BODY and nothing else (W20: the noun sits at the layer of its read, BODY).

## 1. THE CLAIM SET, PER FACE (arm A6 reads ACROSS the faces: all twelve are claim-equal)

Every face makes exactly these five claims and no others:

1. **grain is held in store at a granary-class row** — R1 + R2 · licensed: the card's reader with `granary` TRUE; D-12 ENTAILS "grain is stored".
2. **that store answers a failed harvest / hunger** — R2 · licensed: D-12 ENTAILS "it buffers a harvest". No depth, no fill, no duration, no count, no season attaches anywhere (D-12 NOT ENTAILED "how full", "how many months" — `storageMonths` and `granary.band` are other desks' readings).
3. **a house of the faith stands** — R4 · licensed: the card's reader with `church` TRUE; spelled only *a house of the faith* / *the parish* (W15's always-safe alias for a `temple`-class row), never *the church*, *the cathedral*, *the clergy*, *the priest*.
4. **no hospital-class row stands** — R3 · licensed: the card's reader with `hospital` FALSE; stated FLAT (R-DA-02's LACK limb), never as the opener, never beside a second absence, never completed by a "but", never as a grade or a comparison of capability.
5. **the settlement is named** — R6 · licensed: bag `{settlement: proper}`.

Per face, the licensing clause behind each surface:

**Variant 1 `[ledger]` — the clerk enters and measures what stands, and cites nothing (skeleton §2.4; W8; W24).**

- **Face 0 (the numbered line)** — *"The granary at {settlement} holds grain against a failed harvest"* = R1 + R2 (card reads, `granary` TRUE; D-12); *"a house of the faith stands in the town"* = R4 (card reads, `church` TRUE; W15 alias); *"no infirmary stands at all"* = R3 (card reads, `hospital` FALSE; the skeleton's own always-safe negative spelling). `{settlement}` = the bag. One joint (R-DA-06: one joint per variant), two matters set side by side in the shipped order (hunger first, the sickness side second) — **the variant's declared construction under W4**, kept.
- **Face 1** — *"Grain is held in the granary at {settlement}, reserves against hunger"* = R1 + R2, and **`reserves against hunger` stands verbatim from the shipped sentence**: it is the pool's sharpest licensed compression (existence and purpose, no quantity), and §21.4's density law makes it a FLOOR, not a candidate for smoothing (skeleton §2.5). *"the parish stands on the town's ground"* = R4 (the town seated as possessor — **W1**). *"No house that takes in the sick stands in the town"* = R3. Thread (R-i at k = 0): the second sentence carries *the town* forward from the first.
- **Face 2** — cleft *"What the town holds back is grain against a failed harvest"* = R1 + R2 (the stock word, not doubled with the building word — W15); *"a house of the faith stands at {settlement}"* = R4; *"no ward for the sick is kept in the town"* = R3 (a `care`-class word in the negative only).
- **Face 3** — fronted purpose *"Against a failed harvest the granary at {settlement} holds grain in store"* = R1 + R2; *"a house of the faith keeps its ground in the town"* = R4 (the possessive binds to the house of the faith, its own subject — **W1**); *"The town has no hospital"* = R3, and **the word *hospital* is licensed by R-DA-02**: the rejected alternative names the sibling pool key `Disasters & Famine: granary AND hospital`, which is exactly the rule's licensing condition. The lack is flat, with no grading and no "well short of".

**Variant 2 `[street]` — what is ordinary about the arrangement, in the clerk's third person, with no agent, no decision, no prediction and no maxim (skeleton §3.4).**

- **Face 0** — *"The parish stands at {settlement}"* = R4; *"the town has no infirmary"* = R3; *"Grain sits in the town's granary, held against hunger"* = R1 + R2. Two sentences, a standing fact then a standing fact of a different kind — **the variant's declared construction under W4**, kept; the collapse onto variant 1's single-sentence ledger shape is the named W4 regression and is refused.
- **Face 1** — *"The town has a house of the faith and no ward for the sick"* = R4 + R3; *"At {settlement} the town's grain is in store against a failed harvest"* = R1 + R2.
- **Face 2** — *"Grain is held back at {settlement} against a failed harvest"* = R1 + R2; *"no house that takes in the sick stands in the town"* = R3; *"The town's house of the faith stands on its own ground"* = R4. **This is the one face in the pool where R4 follows R3**, across a sentence boundary, with no care word, no contrastive connective and no "instead", "but", "as well" — see §3 ruling (c).
- **Face 3** — *"A house of the faith is on the town's ground at {settlement}, and no infirmary is"* = R4 + R3 (the ellipsis is the face's own rhythm); *"The granary keeps the town's grain against a failed harvest"* = R1 + R2.

**Variant 3 `[visitor]` — a stranger's eye records what stands and what is absent, as things seen; it may not act, decide, be told, be named, grade, or read an intention (skeleton §4.4; W27).**

- **Face 0** — the shipped frame *"A stranger finds … at {settlement}"* is carried, per the density law (skeleton §4.5: the frame is lawful as it stands and is the variant's declared construction under W4), with a **lawful object**: *"a house of the faith"* = R4 and *"no infirmary in the town"* = R3 — the seen-and-not-seen pairing, which is this angle's exemplary use of the LACK. *"The town's granary holds grain against a failed harvest"* = R1 + R2, stated by the record rather than seen by the stranger, because the grain in store is a record fact and not an observable (the shipped *a full store* was a fill claim and is dropped).
- **Face 1** — *"A stranger comes to {settlement} and sees"* (W27: the visitor's eye may SEE) *"a house of the faith standing"* = R4, *"and no ward for the sick in the town"* = R3; *"Grain is held in the town's granary against hunger"* = R1 + R2.
- **Face 2** — *"To a stranger arriving at {settlement} a house of the faith stands in plain sight"* = R4 (visibility is the stance's own licence, not a new claim); *"no house for the sick stands in the town"* = R3; *"The town's granary holds back grain against a failed harvest"* = R1 + R2.
- **Face 3** — cleft *"The parish is what a stranger finds standing at {settlement}"* = R4; *"with no hospital in the town"* = R3 (sibling-key licensed, R-DA-02); *"The granary holds the town's grain against a failed harvest"* = R1 + R2.

## 2. WHAT WAS DROPPED, AND WHY (the rewrite's purpose; never re-added)

| shipped clause | variant | dropped because |
|---|---|---|
| *there are clergy who tend the sick* | 1 | D-14 NOT ENTAILED "resident clergy; a priest" and "medical capability"; a **ROLE** noun on a **BODY** read (**W20**, **W22**); `hasChurch` fires on `Access to parish church`, `Wayside shrine` and `Priest (resident)` alike |
| *against disease something better than nothing* | 1 | a standpoint and a rating with no rating field; VERDICT is not a move (MOVE-GRAMMAR §1.3); **AGGREGATE** on a **BODY** read (**W20**) |
| *and well short of a hospital* | 1 | lawful only in its FLAT form; the graded comparison of a capability is unlicensed. The flat lack is kept in every face |
| the colon tail (*reserves against hunger, and against disease …* as what the two amount to) | 1 | a MEANING move (MOVE-GRAMMAR §1.3); **W6** the doubled/summarising beat; S2 admits one riding clause only where it is a computed CONSEQUENCE of the sentence's own fact, and a gloss is not that |
| *The town can eat through a bad year* | 2 | **the engine contradicts it** (D-12 ENGINE CONTRADICTS, verbatim: `econHealthMult` falls to ×0.45, `defenseGenerator.js:281-290`; the disaster gate floors at 0.55, `:608-618`), and it asserts a duration the card does not read. The licensed remainder is R2 alone |
| *What it does about a plague is pray and nurse, in that order* | 2 | a forecast (STATE never FATE), a fused agent (**W23** — "the town has decided" is the bar's own example), a belief frame and an observance (**W19**, the deity doctrine), a medical capability (D-14), a maxim close (R-DA-12), and *plague* itself (**W17** THE CRISIS BAR: illness or sickness, never "the plague") |
| *a full store* | 3 | a fill the card does not read (D-12 NOT ENTAILED "how full"; `granary.band` is DS-ECO-2's reading at layer NONE) |
| *a modest infirmary* | 3 | **the pool's sharpest breach**: the branch is reached only where `hasHospital === false`, so the clause names the precise `care`-class body the read denies — a false BODY (**W20**), and a same-entry contradiction (CLERK-LAWS C3/C5). *modest* compounds it with an unlicensed grade |
| *can see which of the two the town has spent its thinking on* | 3 | a cause, an intent and a fused agent (**W22**, **W23**), plus a VERDICT; and roster law R-A refutes the premise — `Town granary` and `Parish churches (2-5)` are BOTH `required: true` at town (`institutionalCatalog.js:925`, `:1260`), so nothing here was chosen between |

Nothing was added in their place except **licensed specificity**: the recorded bodies in their always-safe spellings, the store's purpose, and the flat lack.

## 3. THE RULINGS THIS DRAFT MADE (vetoable; each recorded rather than silently taken)

**(a) The tier band is not stated.** `hasGranary` is a tier proxy (town-plus; no village-and-below row matches the stem), so the pool is town-or-larger — but the tier is **not one of the card's reads**, and W9 counts the card's reads for the density floor. Stating a band would be a second fact the card refuses, and a bare *a town* would breach **W3** (a band carries its marker: *a town or larger*), which no sentence of this pool can carry without reading as a maxim frame (**W5**). *the town* is used throughout only as the register's own referring word for the settlement, never as a band claim.

**(b) The LACK closes exactly one variant.** R-DA-02's grammar line: the LACK move is "neither the closing move of more than one variant per pool". **Variant 1 `[ledger]` is that variant** — all four of its faces close on the flat lack — because the shipped ledger's declared construction is *hunger, then the sickness side*, so ending on the measured absence is the construction preserved rather than moved (**W4**). Variants 2 and 3 therefore close on a present body in every face, which is why R1/R2 lands last in ten of the twelve faces.

**(c) R4 never immediately follows R3 inside one sentence, and does so across a sentence boundary exactly once** (variant 2, face 2). The pool's whole trap is the reader's inference that the parish answers the sickness; a compensating completion after a LACK is barred by R-DA-02 ("no completing 'but'"). The one permitted crossing carries no care word, no contrastive connective and no additive ("also", "as well", "instead"), and its predicate is purely the parish's standing on its own ground.

**(d) No totality of absence against sickness.** Every face states the absence of a hospital-class **body**, never "nothing against disease" — both because R3 is a body read and because the engine's own badge prints *Clergy care · Parish care. Basic wound and disease management.* on the same rendered page (`defenseDisplay.js:237-239`, hazard C7). That string is product code outside the corpus (OW-20) and is **not** a licence for any face here.

**(e) No record word and no citation.** SOURCE-UNRESOLVED on the card: *the register*, *the parish register*, *the books*, *the roll* are all refused (**W24**), and the `[ledger]` tag is a STANDPOINT that licenses none of them. The one office formula used is the plain present standing (*stands*, *is held*, *keeps*), not an agent-source (**W7**).

**(f) No wall material, no garrison, no watch, no muster** — bars **W11**, **W12**, **W13**, **W16** are not reachable on this pool's reads and nothing in the twelve faces goes near them.

**(g) The surface walls, checked.** No em dash · no exclamation · no question · no digit or percent · no `which`-clause · no second person · no expletive opener (R-DA-07) · no figure, sense verb on an abstraction or intent for an inanimate thing (R-DA-11) · no future indicative (the edge would be subjunctive; none is used) · no pronoun closer (R-DA-04) · no face opens on the `{settlement}` slot (T-F8) · no face opens on the ABSENCE (MOVE-GRAMMAR §1.4 wall 3) · at most one negated surface per face (**W10**) · one joint per variant (R-DA-06) · no face exceeds two sentences (R-DA-03) · every face carries the same `{slot}` set, `{settlement}` exactly once (the face contract of ARCH §2.5) · no second bracketed tag on any numbered line, and no `[plain]` marker anywhere (it is a modifier marker and the projector refuses it on a spine row).

**(h) Sibling distance (arms A1 and A11).** No face restates or contradicts the pool's two neighbours on the same rung: `granary AND hospital` keeps its two bodies, and `granary, NO medical provision` keeps its total want of a care body. This pool's distinction — a granary standing, a house of the faith standing, and no house that takes in the sick — is stated in every face, so no seed can draw a line that reads like either sibling. The three variants' opening two words differ (*The granary* · *The parish* · *A stranger*).

**(i) The faces differ in construction, not vocabulary alone.** Per variant: variant 1 runs active-granary / passive-grain-with-appositive / cleft / fronted-purpose-adverbial; variant 2 runs parish-subject / town-subject / grain-subject-with-R4-last / ellipsis; variant 3 runs the shipped *A stranger finds* frame / *comes to … and sees* / dative-fronted *To a stranger arriving* / cleft *The parish is what a stranger finds standing*. The subject, the order of the reads and the landing noun move with the construction, and the lack carries four spellings (*no infirmary* · *no house that takes in the sick* · *no ward for the sick* · *no hospital*), each stating the one read R3.

## 4. REFUSALS

**None.** All three variants were made lawful under the card, the skeleton and bars W1–W27; no variant is banked as a refusal row. Nothing was trimmed: three variants in, three variants out, same vids, same angle tags, same order, four faces each.

## 5. MEASUREMENT (this draft, as written)

| variant · face | angle | words | sentences | closes on |
|---|---|---|---|---|
| 1 · 0 (numbered line) | `[ledger]` | 25 | 1 (one semicolon joint) | the lack, flat |
| 1 · 1 | `[ledger]` | 30 | 2 | the lack, flat |
| 1 · 2 | `[ledger]` | 30 | 1 (one semicolon joint) | the lack, flat |
| 1 · 3 | `[ledger]` | 29 | 2 | the lack, flat |
| 2 · 0 (numbered line) | `[street]` | 20 | 2 | the store, against hunger |
| 2 · 1 | `[street]` | 26 | 2 | the store, against a failed harvest |
| 2 · 2 | `[street]` | 33 | 2 | the house of the faith, on its own ground |
| 2 · 3 | `[street]` | 26 | 2 | the store, against a failed harvest |
| 3 · 0 (numbered line) | `[visitor]` | 25 | 2 | the store, against a failed harvest |
| 3 · 1 | `[visitor]` | 31 | 2 | the store, against hunger |
| 3 · 2 | `[visitor]` | 35 | 2 | the store, against a failed harvest |
| 3 · 3 | `[visitor]` | 26 | 2 | the store, against a failed harvest |

Spread: 20 to 35 words; three of twelve faces above thirty words (0.25, inside R-DA-06's ≤ 0.340); no face over two sentences; every face one joint; every face exactly one `{settlement}`; every face exactly one negated surface.

*Packet complete. Writer: Opus 5 (Fable-unvalidated). Variants rewritten: 3. Faces written: 12. Refusals: 0.*
