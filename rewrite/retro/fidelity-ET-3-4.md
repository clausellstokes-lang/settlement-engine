# FIDELITY — ENTAILMENT TABLE, SECTIONS 3 AND 4 (135 LABEL TRAPS, 41 ALIAS TRAPS)

**The adversary's brief.** Prove that `items-ET-3-4.md` is NOT a faithful archive of `evidence/convert-ET-3-4.md`
(the ADDENDUM 14 re-cut of the 176 rows) and of the old law those rows ruled on
(`verbatim/ENTAILMENT-TABLE.as-ratified.md` §3 and §4). Hunted, in order: a dropped item · a softened
`the old law, VERBATIM` cell · a silently flipped verdict · an overstated or understated
`what a writer may NOW do` · a high-risk strike the closing section should have named and did not.

**VERDICT: FAITHFUL WITH NOTED DEFECTS.** 176 of 176 items checked, every one of them on every carried
column, by string comparison and not by sampling. Nothing is missing, nothing is softened, no verdict moved,
and no permission cell was rewritten. Every defect below is in prose the SCRIBE added — the dash note, the
intro's generalisations, the omitted packet section — or in the archive's own closing risk section, where one
quotation is truncated and an argument is then built on the truncation, and where two strikes at least as
dangerous as the five named go unmentioned.

---

## 0. WHAT WAS CHECKED, AND HOW

Machine comparison, not sampling. Each of the three documents was parsed into rows on unescaped pipes
(the cells contain `\|` escapes, which a naive split corrupts — the first pass produced eleven false verdict
"diffs" from exactly that).

| check | result |
|---|---|
| item ids present in the source packet | 176 (`L-1`…`L-135`, `A-1`…`A-41`), no gaps, no duplicates |
| item ids present in the archive | 176, identical set |
| **items in the source with no row in the archive** | **0** |
| items in the archive not in the source | 0 |
| **`verdict` cell, archive vs source, byte comparison** | **176 / 176 identical; 0 diffs** |
| **`the ground` cell, archive vs source, byte comparison** | **176 / 176 identical; 0 diffs** |
| **`what a writer may NOW do` cell, archive vs source, byte comparison** | **176 / 176 identical; 0 diffs** |
| verdict tally recomputed from the rows | SPLIT 85 · STRUCK 45 · CONTRADICTION 43 · MODEL 2 · SCOPE 1 — matches both the packet's stated counts and the archive's |
| `MODEL 2 (L-1, L-50)` · `SCOPE 1 (A-35)` (archive front matter) | both correct |
| **`the old law, VERBATIM` reconstructed from the ratified table** | **176 / 176 byte-identical to `**LABEL:** c2 · **FIELD:** c3 · **ENGINE MEANING…:** c4 · **SOURCE…:** c5` (alias rows: WORD / ROWS / ALWAYS-SAFE / SOURCE PACKETS). Not one character of any ratified cell is added, dropped, re-ordered or re-punctuated.** |
| subsection placement (3.1…3.9, 4.1…4.6) | identical across ratified table, packet and archive for all 176 |
| row ORDER | identical across all three documents |
| **every SPLIT item (85) carries BOTH halves** | 85 / 85 grounds contain an explicit `KEPT:` and an explicit `STRUCK:`; no non-SPLIT row carries those markers |
| read in full by eye | all 85 SPLIT grounds+permissions · all 45 STRUCK grounds+permissions · 17 items read cell-by-cell against the ratified table |

Hunts (1), (2), (3) and (4) return **nothing at the row grain**. The archive is a byte-faithful carrier. The
defects are one layer up.

---

## FINDING 1 — the closing section quotes A-27's permission truncated, and argues from the truncation
**Severity: moderate. This is the sharpest defect in the file.**

The archive's own `THE STRIKES MOST LIKELY TO BE WRONG` §1 attacks the strike of `A-27`.

> **The archive's words** (`items-ET-3-4.md`, closing §1):
> "The permission handed back is the largest in the slice: *"Name the crown, the realm, the border country,
> a distant capital."*"
> … "A writer who takes A-27's permission at face value and writes "the men came over the border from the
> kingdom" on a town whose origin record names an adjacent settlement has written a page that denies itself,
> **and the only thing standing between the permission and that breach is a cross-reference to a different row
> in a different subsection.**"

> **The source's words** (`convert-ET-3-4.md`, `A-27`, `what a writer may NOW do`, whole cell — and the
> archive's own `A-27` row carries it whole, correctly):
> "Name the crown, the realm, the border country, a distant capital. No dates, no counts, no named person's
> fate — **and do not rename a neighbour the record names.**"

The quotation stops at the first full stop and drops the cell's own limiting clause. That clause is not a
cross-reference to `L-119` in another subsection; it is in the SAME cell, and it bars precisely the breach the
archive constructs — "the men came over the border from the kingdom" where the origin record names an adjacent
settlement IS renaming the neighbour the record names. The closing section's central claim about `A-27` — that
nothing but a cross-reference stands between the permission and the breach — is therefore false on the
archive's own page, and it is false only because the quotation was cut one sentence short.

The per-item row is faithful. The argument built on it is not. In a record whose whole value is verbatim
fidelity, a truncated quotation inside the archive's own adversarial section is the defect most likely to
mislead a Fable seat, because that section is what the protocol (`RETRO-VALIDATION.md` §4.3) tells the seat to
sample first.

---

## FINDING 2 — the dash note describes two KEPT contradictions as struck wiring rows
**Severity: moderate. Scribe's own prose; affects `L-30` and `L-120`.**

> **The archive's words** (front matter, "A note on the grounds that read `—`"):
> "Where the fold's `what a writer may NOW do` cell is a bare dash with a parenthetical ("wiring row", "dark
> field", "copy unit"), **the row was never a bar on a writer at all**: it recorded a defect in the engine's
> own wiring. **The strike removes it from the writer's law** and leaves it where the chair keeps it, as a
> routing or wiring finding."

Twenty-five rows have a bare-dash permission cell. Two of them are **CONTRADICTION** — kept, not struck — and
both say in the dash itself that a refuter must still fail them:

> **The source's words** (and the archive's, verbatim):
> `L-30` | CONTRADICTION | … "The fill names a house the printed roster denies — a live page contradiction,
> fired by a slot, not by a writer." | **"— (a wiring contradiction the refuter should still fail; see
> newFindings)."**
> `L-120` | CONTRADICTION | … "Repeating it contradicts the roster and the model." | **"— (see newFindings:
> the engine's own string is the contradiction)."**

A reviewer who reads the note and then skims the dash cells will conclude that `L-30` and `L-120` were removed
from the writer's law. They were not: `L-120` in particular bars a writer from repeating `originContext.reason`'s
walls, granaries and bound labour, which is a live floor-1 bar with teeth.

The note's characterisation also fails on three struck rows that are not wiring defects at all:
`L-67` "— (floor 1 still catches a face denying the printed severity)" (a strike with a surviving floor, not a
wiring row); `L-13` "— (the ground the rows below cite)" (a mechanism row the other rows depend on);
`L-6` "— (not a face bar)". The note should have said: a dash means the fold wrote no writer-facing permission
for this row — for most of them because the row was wiring, for two of them because the row survives as a
refuter's finding with no writer permission attached.

---

## FINDING 3 — a high-risk strike the closing section should have named: `L-121`, "the local watch"
**Severity: moderate. Hunt (5).**

> **The source's words** (`L-121`, verdict STRUCK; the archive carries it identically):
> ground: "`safetyProfile.js:30-35`; `stressorDynamics.js:157-465`; `stressTypes.js:13-30`. Instrument fields."
> permission: **""The local watch" is the engine's OWN generic below town — use it."**

That is an instruction, not a licence, and it collides head-on with two rows the same archive KEEPS:

> `L-26` | SPLIT | KEPT: … "**a watch below town contradicts `hasWatch` being town-plus**
> (`priorityHelpers.js:48`)."
> `A-1` | SPLIT | permission: "Where a watch row resolves: name it, staff it, give it a rota, a lantern, a
> grudge. **Where none resolves: write order or its absence without a watch.**"

And with the ratified law as it actually stood on 09-12 (`verbatim/tables-13.as-run.txt`, ADDENDUM 13 part A,
item 5 CORRECTED, and bar W13):

> "The always-safe class words for the paid military are "the muster" and "the town's force"; **below town the
> engine's own generic is "the community"**." · ""The watch" as a NAME only where the town resolves Town watch
> or Professional city watch (town and up)"

Below town, by construction, no watch row resolves. So `L-121` hands a writer, as an instruction, the one
institution name the corrected law barred there — while `A-1` in the same archive tells the same writer to
write the absence instead. By the archive's own standard in closing §1 (a strike whose safety depends on the
reader also having read another row "is a strike that has been mis-scoped"), `L-121` is worse than `A-27`: it
is not merely unguarded by the other rows, it is affirmatively contrary to them. It is not in the five.

---

## FINDING 4 — a second unnamed high-risk strike: `A-6`, "men on the wall"
**Severity: moderate-low. Hunt (5).**

> **The source's words** (`A-6`, verdict STRUCK):
> ground: "`stressNarrative.js:149`; `factionArchetypes.js:55`. **The bar policed manning and a gendered word —
> permission and tone.**"
> permission: "**Write men on the wall**, women too, someone's nephew with a billhook. No counts (floor 2); **a
> wall only where a wall resolves (A-7)**."

> **The old law it reverses** (`verbatim/tables-13.as-run.txt`, ADDENDUM 13 part A item 5):
> "STRUCK from the always-safe list: … and "**the men on the wall**" (**asserts manning, NOT ENTAILED, and a
> wall**)."

The ratified strike had two grounds; the permission carries a caveat for only one of them. The manning half is
not free-floating: `L-24` KEPT — "a paid standing force on a walls-only town contradicts the defence roster …
and the safety panel's "There is no meaningful guard presence"" — and `L-37` KEPT — "crediting the town's
safety to a watch or a garrison where no force row resolves contradicts the roster and `safetyProfile`'s own
"no meaningful guard presence"". "Men on the wall" on a walls-only town whose safety panel prints exactly that
sentence is the `L-24` breach, written under `A-6`'s permission, with the `A-7` cross-reference guarding the
wall and nothing guarding the men. The closing section does not name it.

---

## FINDING 5 — "the old law, VERBATIM" is the law as ratified AS CORRECTED, and the archive never says so
**Severity: moderate. Framing, not extraction.**

> **The archive's words** (front matter):
> "`the old law, VERBATIM` carries the ratified row's own cells, **unedited and uncut** … Only the bold column
> names are this scribe's; **every other word in that cell is the old law's.**"

That claim is true of the extraction (verified, 176/176). It is not true of the LAW, and the archive gives a
reviewer no way to know it:

> **The source of the VERBATIM column**, first line of `verbatim/ENTAILMENT-TABLE.as-ratified.md`:
> "CHAIR (2026-09-11 06:1x): READ WHOLE and **RATIFIED AS CORRECTED** at brief ADDENDUM 13 part A … item 4's
> gloss of `settled` and **item 5's always-safe list are corrected there**".

The concrete casualty is in this slice:

> **The archive's `A-1` ALWAYS-SAFE cell, presented as the old law:** "the class word for the paid military
> ("the muster", "**the guard**" with the caveat at A-3) unless the town resolves `Town watch` /
> `Professional city watch`; below town the engine's own generic is '**local watch**' / "the community""
> **The archive's `A-3` ALWAYS-SAFE cell:** "DISPUTED: see section 5, O-2"
>
> **ADDENDUM 13 part A item 5, already ratified on 09-11** (`verbatim/tables-13.as-run.txt`): "**STRUCK from
> the always-safe list: "the guard"** (the power generator's FALLBACK label when NO force row matches …; safe
> only where hasMilitaryInst)" — i.e. O-2 was already RESOLVED, and "the guard" was already gone from the
> always-safe list, and "local watch" was already replaced below town by "the community".

Neither `items-ET-3-4.md` nor `convert-ET-3-4.md` contains the string "ADDENDUM 13" even once. A Fable seat
challenging the strike of `A-1`'s spelling list will believe "the guard" and "local watch" were live
always-safe law at the moment ADDENDUM 14 struck them. They had been corrected the day before. The archive
needs one sentence in its front matter saying that §3 and §4 were ratified AS CORRECTED by ADDENDUM 13 part A,
and that three named cells (`A-1`, `A-3`, and item 4's `settled` gloss reflected at `L-2`) were superseded
before the re-cut touched them.

---

## FINDING 6 — the source packet's own closing section is not carried anywhere
**Severity: low-moderate. Hunt (2), at the packet grain rather than the row grain.**

`convert-ET-3-4.md` ends with a section the archive drops entirely:

> **The source's words** (`## WHAT THE STRIKES BUY (the owner's complaint, answered in this slice)`), in part:
> "1. **The always-safe spelling column is gone.** **Thirty-one alias rows** prescribed one approved noun each
> … Those prescriptions, not the contradictions, **produced `country` once every 21 words**."
> "3. **People come back.** W22's blanket is struck: the unnamed reeve, clerk, collector, gate-keeper and
> quarter-master **may act, hold keys, be resented, be avoided**. Only a NAMED character's fate is refused."
> "4. **The absences stop being silences.** "No polity exists", "no camp model", "no ward model", "no meeting
> record" were absences, not denials. The crown, the camp outside the walls and the quarter are now free."
> "5. **What keeps its teeth is exactly what makes the page lie to itself**: a watch, a garrison, a wall, a
> granary, a church, a court, a market or a mill the roster denies; a label read at its dictionary sense …"

Also dropped: the packet's own lead paragraph to section 4 — "The "always-safe spelling" column was **the
single largest engine of the flavour collapse** — it converted every alias into one approved noun and then
asked twelve renderings of it."

The archive's intro paraphrases the §3/§4 framing and the 168-against-519 figure, but carries none of the
above. Point 3 matters most: it is a permission claim made in THIS packet that no row in the archive states in
those terms, and it is the ground a reviewer would need in hand to challenge the struck person-bars inside
`A-19` ("floor 3 as re-cut licenses an UNNAMED clerk, collector or reeve who acts, keeps a key, or is slow to
open the books"), `A-28` ("an UNNAMED collector may now walk the streets") and `A-32` ("licenses an unnamed
person who speaks for a faction"). A reviewer challenging those three rows one at a time will not find the
blanket claim they rest on.

The "once every 21 words" figure is a measured number in the source that exists nowhere in the archive.

---

## FINDING 7 — the intro generalises the prescription column to all 41 alias rows
**Severity: low.**

> **The archive's words:** "An ALIAS TRAP records the mirror defect … and it answered that defect by
> **PRESCRIBING one always-safe spelling per word**."
> **The source's words** (ratified §4 preamble): "the always-safe spelling the packets propose, **where one
> exists**. Where two packets disagree on the safe spelling the row says so and section 5 carries it."

Two of the 41 rows prescribe nothing: `A-3`'s cell is "DISPUTED: see section 5, O-2" and `A-39`'s is "raised
for the chair: the collision is in the instrument's word list, not in a writer's sentence". The
generalisation runs in the direction that makes the vocabulary strike look more obviously right than the
column was. (The count the source actually used — 31 — is recoverable from the archive only by noticing that
exactly 31 of the 41 alias rows are SPLIT; the archive never states it.)

---

## FINDING 8 — three small inexactnesses in the closing section
**Severity: trivial, but they are quotations in a record sold on quotation.**

1. Closing §5 quotes `L-12`'s permission as "*Restate, extend or answer them; only DENYING what they say is
   still a fault.*" The cell reads "… is still a fault **(floor 1)**." The dropped parenthetical is the thing
   that names which floor still bites.
2. Closing §1 renders `A-27`'s ground as "the engine's crowns are conditional strings (`Royal Authority`,
   `Crown Creditors`)". The cell names three: "`Royal Authority`, `Crown Creditors`, **`Royal seat`**".
3. Closing §3 asserts "`hasPrison` is a SUBSTRING flag over **four keywords**". The ratified `L-17` names one
   (`stocks`), `L-13` establishes only that every `inst.*` flag is a substring test, and the fold's ground
   names no count. The number is sourced nowhere in this slice.

---

## 9. WHAT I TRIED AND COULD NOT BREAK

Stated so a later seat does not repeat it:

- **No item is missing.** The id set is complete and contiguous in all three documents, and the ORDER and the
  subsection placement are identical in all three. There is no row hiding in a wrong section.
- **No `the old law, VERBATIM` cell is softened, generalised or paraphrased.** I reconstructed all 176 cells
  from the ratified table mechanically and diffed; the match is exact including escaped pipes, ellipses,
  bracketed desk tags and every `file:line`. I specifically hunted the case the brief warns about — a
  softening that makes a strike look more obviously right — on `L-12`, `L-17`, `L-25`, `A-8`, `A-17`, `A-27`,
  `A-39`, `L-13`, `L-67`, `L-121`, `A-6`, `L-75`. Every one carries its old law at full strength, including
  the sentences that argue AGAINST the strike (`L-17` keeps "a stocks-only row would set the flag from a
  pillory, but no such row ships"; `A-39` keeps "a face can satisfy one and breach the other"; `L-121` keeps
  "a different fact from `inst.hasWatch`").
- **No verdict moved.** 176/176 identical, and the recomputed tally matches the packet's stated counts on the
  nose. The archive's front-matter claim "no discrepancy was found" is true.
- **No permission cell was rewritten**, in either direction. Every overstatement I could argue for
  (`L-121`, `A-6`, `A-27`, `L-25`, `L-17`) is the FOLD's overstatement, carried across unedited; the scribe
  added nothing and subtracted nothing.
- **Every SPLIT keeps both halves.** All 85 grounds carry an explicit `KEPT:` and an explicit `STRUCK:`, and
  the halves are byte-identical to the packet's. This was the brief's named risk and it did not materialise.
- **The intro's illustrative glosses check out** against the rows they describe: `hasHospital` on a divine
  healer (`L-14`), `Access to parish church` as a row named for the church the town lacks (`L-15`, `L-28`),
  `Import-Dependent` as a share met by nothing with imports already subtracted (`L-85`).

---

## 10. VERDICT

**FAITHFUL WITH NOTED DEFECTS — 176 of 176 items checked.**

The extraction is exact: every item present, every old-law cell verbatim, every verdict, ground and permission
byte-identical to the source packet, every SPLIT intact, order and placement preserved. On hunts (1), (2), (3)
and (4) the archive survives a full-population check, not a sample.

The defects are all in added or omitted framing, and two of them would mislead a reviewer in the direction of
under-scrutiny: the dash note (Finding 2) reads two surviving contradictions as struck, and the "as ratified"
framing (Finding 5) hides the ADDENDUM 13 correction layer that had already killed two of the spellings this
slice is credited with freeing. One defect — the truncated `A-27` quotation (Finding 1) — misleads in the
opposite direction, overstating the danger of a strike by cutting away the very clause that contains it. And
the closing risk section, which is otherwise the strongest part of the document, misses at least two strikes
(`L-121`, `A-6`) that are as dangerous as the five it names and, in `L-121`'s case, directly contradicted by
two rows the same archive keeps.

None of this invalidates the slice's rows. All of it should be fixed before a Fable seat marks the
`VALIDATION` column, because a seat that reads the front matter first will mis-weight what it then samples.
