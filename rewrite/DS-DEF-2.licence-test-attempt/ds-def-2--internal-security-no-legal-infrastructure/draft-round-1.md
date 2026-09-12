DS-DEF-2 · pool `Internal Security: no legal infrastructure` · REWRITE draft round 1
Writer: Opus 5 (Fable-unvalidated), for the Fable chair · role `spine` · 3 variants in, 3 variants out · 12 wordings

The rows below are the COMPLETE REPLACEMENT for the pool's three variant rows, ready to paste
under the pool's bold heading (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2675`). The typed
lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) are not repeated and are not this writer's.
Written to the marker's skeleton (`skeleton.md`, this directory) and under the CHECKPOINT LAW,
section by section. Nothing outside this file was written; no dock was entered for any edit,
commit or test; the only execution in `laneRW-DEF2` was the read-only licence-card script.

1. `[ledger]` No court sits at {settlement} to try a charge, and the one a charge names is kept in no cell.
   - `[face]` What stands at {settlement} against a wrong done inside the town is neither a cell to hold the one charged nor a court for the charge.
   - `[face]` Neither a court for a charge nor a cell for the one it names is entered as standing at {settlement}.
   - `[face]` A court to hear a charge and a cell to hold an accused are things {settlement} does without.
2. `[street]` A wrong done here comes before no court, and the one it names sits in no cell.
   - `[face]` The town goes without a cell for the one a quarrel names, and without a court for the quarrel.
   - `[face]` No cell here holds the one a charge names, and no court the charge.
   - `[face]` Neither the court a case would come before nor the cell for the one complained of has a place in this town.
3. `[visitor]` A stranger carrying a complaint into {settlement} would find no cell for the one complained of and no court to hear the complaint.
   - `[face]` The cell a stranger would look for at {settlement} is absent, and so is the court that would hear a complaint.
   - `[face]` What a stranger notices first at {settlement} is that no cell holds the one a charge names and no court hears the charge.
   - `[face]` A stranger's complaint at {settlement} finds no court, and the one it names no cell.

--- NOTES

## 0. THE CARD, AS THIS PACKET READS IT

`node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: no legal infrastructure'`,
printed in `laneRW-DEF2`, gives: `reads: court (not-produced) · prison (not-produced)`;
`predicate: (none recovered)`; `bag: {band: RESERVED, route: proper, settlement: proper}`,
FILLED at this block's call sites at `{settlement}` alone; `relation:` and `attach:` empty (a
spine takes neither); `move: (none declared)`; `angle: ledger street visitor`; `covert: no`;
`source: (none) · standing SOURCE-UNRESOLVED`, so **no face names a holder and no face uses a
record noun** (arm A13, W24); `may claim: that court holds, as a STANDING fact of the record`;
`may NOT: a count, a cause, a season, a future, a standpoint, a second fact`; REFUSED COLUMNS
always: a totality over persons, an exemption, a named character's fate, a theological claim.

The key function is `internalRowPoolKey(court, prison)` (`defenseStateProse.js:506-510`),
total over four combinations, returning this key on the one branch `!court && !prison`. So the
pool's whole licensed claim set is **two standing negatives read as ONE keyed condition**: no
court-flag row stands (R1), and no prison-flag row stands (R2). Every one of the twelve
wordings states both, in its angle's stance, against the row's own matter.

## 1. THE LICENCE, PER FACE

Every face asserts exactly three things: R1, R2, and the row's frame nouns as hypotheticals of
the standpoint (layer NONE). The table names, per face, which card clause licenses each.

| face | claim | licensed by |
|---|---|---|
| v1 row, v1 a/b/c (all four) | no court stands at {settlement} | card `reads: court (not-produced)` on the branch `!court && !prison`; `may claim … as a STANDING fact of the record` (present, no history — R-DST-B) |
| v1 row, v1 a/b/c (all four) | no place of confinement stands at {settlement} | card `reads: prison (not-produced)`, same branch, same standing |
| v1 row, v1 a/b/c (all four) | `{settlement}` | card `bag: {settlement: proper}`, FILLED at this block's call sites; the parent's slot set is `["settlement"]` and every face carries it exactly once (ARCH §2.5's face rule) |
| v1 row, v1 a/b/c | a charge · a wrong · an accused · the one charged · the one it names | the STATE-KEY's row label `Internal Security` and the reader's own matter (`threatAssessment.js:156`) as the STANDPOINT of the reading, never as an event, a practice or a totality (skeleton §0.7 (c)); each is a hypothetical at layer NONE, object of an absent body, never an agent (W22) |
| v1 b | `is entered as standing` | the office's own formula, R-vi/W7; licenses NO record noun and NO citation (W24), and the office does not cite its own books (MOVE-GRAMMAR §4.4.3) |
| v2 row, v2 a/b/c (all four) | no court in the town | as above; stated on the town, "here" and "this town", because the parent variant carries `slots: []` and no face may name `{settlement}` (`defense.generated.js:774-797`; ARCH §2.5) |
| v2 row, v2 a/b/c (all four) | no place of confinement in the town | as above |
| v2 row, v2 a/b/c | a wrong · a quarrel · a case · a charge · the one complained of | the row's matter in the street's plain nouns (skeleton §0.7 (c), §2 (4)); "the town" is the record's generic subject and carries no tier value (skeleton §0.7 (d); W15's ratified spellings) |
| v3 row, v3 a/b/c (all four) | no court at {settlement} | as v1 |
| v3 row, v3 a/b/c (all four) | no place of confinement at {settlement} | as v1 |
| v3 row, v3 a/b/c | a stranger looking, finding, noticing, carrying a complaint | the palette's own device for the `[visitor]` stance (annex `:118-126`); W27: the stranger is the visitor's EYE — it may look, find and notice, and never act, decide, be told, be surprised, be named or be given a fate |
| v3 row, v3 a | `would find` · `would look for` · `would hear` · `would come before` (v2 c) | the subjunctive edge (A2; R-DA-07): the hypothetical asserts nothing and takes no future indicative |

No face carries any fourth claim. The four faces of each variant are claim-equal to each other
(arm A6 reads across the faces): they differ only in subject, in the order of the two reads, in
the frame noun, in the landing noun and in length.

## 2. WHAT WAS DROPPED, AND UNDER WHICH REFUSAL

**v1 shipped:** *There is no legal machinery at {settlement}; order here rests on force alone,
and force alone deters only while it is present.*

- `There is` — the expletive opener (R-DA-07, direction down). Cured by construction; not a claim.
- `no legal machinery at {settlement}` — the claim is KEPT, at its licensed extent: the two
  named bodies. The composite NOUN is not carried (see §3 judgment 2).
- `order here rests on force alone` — DROPPED. A CAUSE (`may NOT: a cause`); a SECOND FACT (a
  force; `force = garrison || militia` is a HOLDER-kind token this card does not read, REFERENT
  row 56); a CAPACITY fact (MOVE-GRAMMAR §1.2 row 1's may-NOT column); a TOTALITY (`alone`); a
  wrong-layer body word (W20) and a fused relation (W23); and a same-page contradiction risk
  beside an Invasion rung `neither walls nor force` (C7). It is the chrome's own sentence
  (`threatAssessment.js:156`) copied into the record, and a known breach is never a floor.
- `force alone deters only while it is present` — DROPPED. A MAXIM (R-DA-12); a FORECAST in the
  habitual (A2, THE PROMISE); the summarising second beat (R-DA-03 → 0.000; the MEANING
  non-move); a capacity and a presence predicated of a body this read does not reach.

**v2 shipped:** *The town settles things itself, quickly, and does not always settle them well.*

- `The town` — KEPT as the opener of one face (2 a): the record's generic subject on a slotless
  variant, and the natural thread-carrier where no `{settlement}` may stand.
- `settles things itself` — the IMPLICATION (there is nothing to send a matter to) is kept and
  stated directly at full resolution; the STATEMENT is DROPPED: a SECOND FACT (a practice), a
  FUSED AGENT (W23; the D-F16/D-F18 pattern), a CAPACITY fact no read holds, and a claim that
  stands beside the engine's own unread `Dispute mediation` / `Community mediation` services.
- `quickly` — DROPPED. A RATE (`may NOT: a season`; R-DA-16).
- `does not always settle them well` — DROPPED. A VERDICT (the register rates nothing without a
  typed rating field; the row's badge is `{band}` RESERVED and unfilled), a STANDPOINT, a
  FREQUENCY hedge over unrecorded cases, and the summarising second beat.

**v3 shipped:** *A stranger wronged at {settlement} discovers there is nowhere to take it, and
that the discovery surprises nobody local.*

- `A stranger … at {settlement}` — KEPT as the stance's opener and the slot's seat.
- `wronged` — DROPPED as an EVENT (R-DST-B: a standing configuration field licenses a structural
  clause and never a historical one; no event-provenance field on this key). The wrong survives
  as the frame's matter in the present standing and the subjunctive.
- `discovers` — DROPPED as an event-shaped finding; replaced by the visitor's own verbs (find,
  look for, notice).
- `there is` — the expletive (R-DA-07).
- `nowhere to take it` — KEPT IN SUBSTANCE, NARROWED to its two licensed members. Read whole,
  `nowhere` is a TOTALITY over the read: on every tier this pool fires on the governing row
  records a mediation service the card does not read, so the totality is contradicted by the
  engine's own record. Narrowing an over-broad claim to its licensed core is a drop, not an
  addition.
- `and that the discovery surprises nobody local` — DROPPED. A TOTALITY OVER PERSONS (a REFUSED
  COLUMN, always), a FEELING (MOVE-GRAMMAR §1.3), a SECOND FACT, a STANDPOINT, a belief frame,
  and the summarising second beat. It was the shipped line's memorable clause and it cheated;
  the memorability here comes from the stranger's construction and the two civic nouns.

Nothing was added to any variant. The composite each shipped row carried — explicitly (v1),
by implication (v2) or as a totality (v3) — is the same claim in all three, stated at full
resolution in all twelve wordings.

## 3. THE JUDGMENTS THIS PACKET MAKES, EACH RECORDED SO IT CAN BE VETOED

1. **The pair is ONE compound LACK, not two ABSENCE moves.** The pool's key value IS the pair,
   so the negation is the PRESENT move's own predicate at this branch and order wall 3 is not
   engaged; R-ii/W10 lets one negated surface stand on a PRESENT read. The skeleton's own
   licensed anaphora (`no court to …, and no cell to …`) is the shape every face uses. If the
   chair reads the two reads as two ABSENCE moves, no face of this pool can be written under
   its own key. The skeleton (§0.7 (a), open row 7) and the two earlier attempts reached the
   same reading; this seat takes it and flags it.
2. **"no legal machinery" is NOT carried into any face, and this is the one place this packet
   departs from the skeleton's recommendation.** The skeleton records it as a CONDITIONAL
   verbatim turn (open row §5.5) and leaves the ruling to the chair. This seat's reasons for
   not taking it: (a) beside an explicit naming of the two bodies it is the summarising beat
   (W6), because "machinery" restates what the two nouns say; (b) standing alone it states the
   composite without naming either read, which the skeleton's own skeleton rule refuses; and
   (c) read as "any legal function at all" it is a totality the engine's unread mediation
   services contradict. "No court and no cell" is the same claim at zero risk, and the density
   the shipped noun carried is replaced with licensed specificity (the two civic nouns at their
   layer, the row's matter in each stance, the office's formula on v1 b). **If the chair rules
   the noun lawful, v1 b is the face to carry it** ("Neither a court for a charge nor a cell for
   the one it names is entered as standing at {settlement}" → the machinery form), and this
   seat will not defend the drop against a chair ruling.
3. **Every face is ONE sentence.** A two-sentence face would have to split the two reads across
   two sentences, which puts a second negated sentence beside the first — the exact form
   §0.7 (a) calls order wall 3 — and the card licenses no second fact to fill a lawful second
   sentence. The variety A1 would take from sentence count is taken instead from clause
   structure and length (13 to 26 words across the twelve; see §5). Recorded as a cost.
4. **The visitor's hypothetical is written in the present standing and the subjunctive.** The
   stranger looks, finds and notices a standing fact; it is never wronged, never told, never
   surprised, never named. If the chair rules the present hypothetical itself a history
   (skeleton open row 9), the three present faces of v3 revert to `would` and the variant
   stays lawful.
5. **"The town", "this town" and "here" are the record's generic subject on the slotless
   variant**, carrying no tier value (skeleton §0.7 (d); W15's ratified spellings; the
   `neither walls nor force` packet took the same reading). "The village", "the hamlet", "a
   town this size" and "the community" are refused; `{settlement}` is refused on v2 by the
   parent's slot set.
6. **"try" is used once** (v1's row), in the negative, on the body that would do it. D-15
   makes "try" CONDITIONAL on a `Courthouse` row standing; here none stands, and the sentence
   asserts the absence of the body that would try, which is the safe direction. Every other
   face uses `hear`, `come before`, `for` or `hold`.

## 4. THE WORD BARS, RUN OVER ALL TWELVE WORDINGS

**Entailment bars (W11–W19).** No wall, material or material source (W11); no garrison (W12);
no watch, guard, constable or "law enforcement", present or denied (W13); no engine label read
at its dictionary sense — `no legal infrastructure` is written at its engine meaning, the two
flags, never as "lawless", "no law", "no justice" (W14); no alias for a row that does not
resolve — the absent bodies are named by the class words the tables ratify, "a court" (A-16:
"the court" only where a courthouse row stands, and here the negation is the read) and "a
cell" / "a place of confinement" (A-17) (W15); no gate word, no upkeep, no wages (W16); no
siege, occupation, famine or illness (W17); no stress record (W18); no creed (W19).

**Referent bars (W20–W27).** Every noun sits at the layer of its read: `court` and `prison` at
BODY, negated; `{settlement}`, "the town", "this town", "here" at NONE; the frame nouns at
NONE. No AGGREGATE word (no safety label, no badge, no `{band}`, no readiness word, no "order"
predicated of anything) on a BODY read (W20); no baked power word, no hall, council or chamber
(W21); **no person as agent, decider, permission-holder or load-bearing referent** — "the one
charged", "the one it names", "the one complained of" and "an accused" are the frame's
hypotheticals in the OBJECT position of an absent body and never a subject that acts, and
"whoever", "somebody", "the person who", "nobody local" appear nowhere (W22); no fused agent —
the town keeps, goes without and has, and never settles, judges, hears, decides or relies
(W23); **no record word of any kind** — no roll, rolls, books, register, minute, writ or
account, because the card resolves no holder; "is entered as standing" is the office's own
formula and names no record (W24); no external body (W25); no visibility question (`covert:
no`, every row the player's with no mark) (W26); the three stances are stances — no "the
elders", no quoted speaker, no stranger who acts (W27).

**Hard walls.** No em dash · no exclamation · no question · no digit or percent · no
`which`-clause (one `that`-clause, v3 a, which is not the barred form) · no `There is` / `It is`
opener · no future indicative (four `would`s, all subjunctive) · no citation and no holder
named · no count word (`both`, `two`, `neither of them` avoided; `neither … nor` is a
correlative over the two nouns of the sentence, not a count of the world) · no cause joint
(`because`, `so`, `which means`, `rests on` nowhere; the two reads join on `and`, `nor` or a
comma) · no rate, season or frequency · no verdict or evaluative adjective · no maxim and no
gnomic closer · no totality (`nowhere`, `nothing`, `nobody`, `no law`, `lawless` nowhere) · no
belief frame or vague authority · no tier or band word · no figure, no sense verb on an
abstraction, no inanimate intent · no fragment (every row is FORM `sentence`) · exactly ONE
bracketed angle tag per numbered row and no `[plain]` marker anywhere.

## 5. SPREAD, SLOTS, THREAD AND SIBLINGS

**Slot sets (ARCH §2.5, the face rule).** v1 `{settlement}` in all four faces · v2 `{}` in all
four · v3 `{settlement}` in all four. `{band}` (RESERVED) and `{route}` (unfilled at this
block's call sites) are named by no face. No face opens on the settlement token (T-F8;
MOVE-GRAMMAR §1.4 wall 10) — `At {settlement}` and `at {settlement}` are never sentence-initial
and the token never stands first in any of the twelve.

**First two words, all twelve distinct** (A11): `No court` · `What stands` · `Neither a` ·
`A court` · `A wrong` · `The town` · `No cell` · `Neither the` · `A stranger` · `The cell` ·
`What a` · `A stranger's`. The three variant rows differ in their first two words.

**Word counts** (the slot counts as one word): v1 — 20 · 26 · 20 · 18. v2 — 17 · 19 · 14 · 22.
v3 — 23 · 21 · 23 · 15. Pool range 14 to 26; the short line lives in v2 (14 words), where the
shipped row's relief line lived. No wording exceeds thirty words (R-DA-06).

**Closes (R-DA-04), varied in kind and never a pronoun:** `no cell` (an absence) · `the charge`
(the matter) · `{settlement}` (a name) · `does without` (a condition) · `no cell` · `the
quarrel` · `the charge` · `this town` · `the complaint` · `a complaint` · `the charge` · `no
cell`. No face closes on `it`, `them`, `both`, `neither` or any other pronoun, and none closes
on a person noun.

**The thread (MOVE-GRAMMAR §1.4.1; R-i at k = 0).** This pool is the SPINE and opens the
passage; the census reads `k: 1`, so at most one modifier follows by salience. Every face is
written to read alone and before an unknown modifier, and every face hands forward a noun a
modifier can carry: a court, a cell, a charge, a complaint, a quarrel, the town. No face is two
sentences, so R-i's inside-the-variant limb does not engage; the noun echo inside a face (`a
charge … a charge names`; `a quarrel … the quarrel`; `a complaint … the complaint`) is the
lawful deliberate echo, which A11's echo bound permits because it counts facts and not nouns.

**Siblings (arms A1, A11, C-sibling).** The three sibling pools of this row are `full legal
chain (court AND prison)`, `court without detention` and `detention without process`; no
wording here borrows their language, restates them or contradicts them — every claim is the
negative of the pair they divide, and the two civic nouns are spelled here as those pools and
DS-DEF-6's `Legal Infrastructure: None` will spell them when rewritten. Nothing here names a
force, a watch, a militia, a garrison or walls, so no face can contradict the Beasts rung, the
Invasion rung or DS-DEF-3's safety banner on the same tab (C7).

**Silences, deliberate and recorded.** No face asserts or denies: a force of any kind; the
watch or the guard; the governing row the small tiers do carry (`Household elder`, `Village
headman`, `Village elder`, `Village reeve`) or its recorded `Dispute mediation` /
`Community mediation` service; custom; the safety label, the internal score or the row's own
badge; the tier; any count. The card reads none of them, and the record contradicts their
denial (skeleton §0.4, open row 3: the true substitute exists in the world and is not wired to
this card — ADDENDUM 7's honest limit, exactly).

## 6. REFUSALS

**None.** All three variants are written lawfully at draft round 1 under the card, the two law
tables and the ten writer rules; no variant is banked, none is merged, none is added, none is
removed, and each keeps its own vid, its own order and its own single angle tag.
