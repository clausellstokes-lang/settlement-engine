# FIDELITY ET-2 — adversarial audit of `items-ET-2.md` against `evidence/convert-ET-2.md`

**Seat.** Fidelity adversary, 2026-09-12. Brief: prove the archive is NOT faithful.

**Archive under test.** `rewrite/retro/items-ET-2.md` (235 rows; six desk tables plus REFUSED sub-tables).
**Source packet.** `rewrite/retro/evidence/convert-ET-2.md` (Opus seat, 2026-09-12, 235 items).
**Third source consulted (the archive names it as the origin of column 2).** `rewrite/retro/verbatim/ENTAILMENT-TABLE.as-ratified.md` §2.1–§2.6.

**What I checked, and how.** Every one of the 235 items, mechanically, on five axes, plus ~35 read by eye.

| check | method | result |
|---|---|---|
| item present | id set difference both ways, duplicate scan | 235 / 235, no missing, no extra, no duplicate |
| verdict agrees with the packet | cell-by-cell string compare (pipe-escape aware) | **0 mismatches**; tally CONTRADICTION 64 · MODEL 11 · SCOPE 1 · STRUCK 19 · SPLIT 140 reproduced exactly, and the six per-desk sub-tallies in the section headers all reconcile against the rows actually present |
| `the ground` agrees with the packet | string compare | 216 byte-identical; 19 differ, all STRUCK, all by a *disclosed* appended `IT POLICED:` clause with the packet's own text intact ahead of it |
| `what a writer may NOW do` agrees with the packet | string compare | 164 byte-identical; **71 have no counterpart in the packet at all** — see Finding 1 |
| `the old law, VERBATIM` is verbatim | reconstructed each ratified row's `noun` · `name class` · `ENTAILS` · `NOT ENTAILED` · `ENGINE CONTRADICTS` cells (or `item tried` · `verdict` · `refuter's evidence` for a REFUSED row) and tested containment, then subtracted the matched text to inspect the residue | **1,015 of 1,015 field texts present verbatim; residue is pure scaffolding on all 235 rows.** Not one softening, generalisation or paraphrase. The 21 rows rendered without an `ENGINE CONTRADICTS` header are exactly the 21 whose ratified cell is empty |
| every SPLIT, both halves | the 140 SPLIT rows' `verdict`, `ground` and `permission` compared byte-for-byte | **140 / 140 byte-identical to the packet.** No SPLIT half was dropped, trimmed or rebalanced |

The hunt's two sharpest hypotheses came back negative and I record that as firmly as the defects: **no item is missing**, **no verdict was silently changed**, and **column 2 does not soften the old law anywhere** — including on the strikes, where a softening would have been most useful to the fold. On the axis the brief cared about most (the SPLIT, where a half can vanish unseen) the archive is provably exact.

Five defects survive. Three are material; two are noted for the record.

---

## FINDING 1 — MATERIAL. 71 of 235 `what a writer may NOW do` cells are the archivist's own composition, presented under a header that says the column is quoted from the packet.

**The archive's claim (preamble, `items-ET-2.md`):**

> **Source packet (the fold's own working, quoted for the verdict, the ground and the permission).** `rewrite/retro/evidence/convert-ET-2.md`

**The fact.** The packet writes `—` in its permission column on 71 rows and the archive fills all 71 with newly written prose: **all 64 CONTRADICTION rows**, plus STRUCK `G-R1`, `G-R12`, `P-17`, `S-24`, `WF-15`, plus MODEL `WF-R3`, `WF-R12`.

Side by side, one of the 71:

| | `WF-R6` |
|---|---|
| **source packet, permission** | `—` |
| **archive, permission** | "Write whatever the War tab actually carries, at any pitch. Never write a declared state of war off the `At war` residue key, which fires on a decaying scar, an `alert` posture, an army in transit, or a holding of others." |

The composed cells are, on the whole, careful and consistent with the ground beside them — I read all 71 and flag only two below. That is not the defect. The defect is that the archive's own instruction to the reviewer is *"`what a writer may NOW do` is the concrete permission handed back — **this is the column to argue with**"*, and on 30 % of the rows the reviewer will be arguing with the archivist while believing he is arguing with the fold. For the CONTRADICTION rows in particular, the fold recorded **no permission at all**; the archive has supplied one. A Fable seat challenging `P-16` or `E-17` needs to know it is challenging a reading of the fold, not the fold.

**Fix.** Mark the 71 cells (a leading `[ARCHIVE-AUTHORED]`, or a separate column), and correct the preamble to say the permission column is quoted where the packet gave one and composed from the ground where it gave `—`.

---

## FINDING 2 — MATERIAL. The six section preambles that define the letter-codes the rows cite were dropped, undisclosed, and the archive says they were not.

**The archive's claim (preamble):**

> Each main row is reproduced as its own `noun` · `name class (members)` · `ENTAILS` · `NOT ENTAILED` · `ENGINE CONTRADICTS` cells, unaltered; **the row's `source` cell (its survey/refute pointer) is the only thing dropped**, because it is provenance and not law.

**The fact.** The ratified table carries a preamble under each of the six desk headings which defines the codes its rows are written in, and the archive reproduces none of them. Counting citations left dangling in `items-ET-2.md`:

| code family | defined in | cited in the archive | resolvable in the archive |
|---|---|---|---|
| `R-A` … `R-E` (five roster laws) | ratified §2.1 preamble | `R-A` ×6, `R-D` ×3 | no |
| `A.1` … `A.9` (nine cross-cutting economy refutations) | ratified §2.3 preamble | `A.1` ×5, `A.2` ×2, `A.3`, `A.5` ×2, `A.6` ×2, `A.8` | no |
| `F1` … `F6` (six engine facts) | ratified §2.5 preamble | `F2`, `F3`, `F4` ×3, `F5` ×4, `F6` ×4 | no |
| `0.1` … `0.4` (four structural findings) | ratified §2.6 preamble | `0.1` ×3, `0.2` ×6, `0.3` ×5, `0.4` ×9 | no |
| the power lens probe | ratified §2.4 preamble | assumed by several rows | no |
| `R-L7` | ratified §3 | ×2 (incl. the whole ground of `D-16`) | no |

What the reader loses, concretely. `D-7`'s law reads "`Garrison` @ city `:1925` (required, no baseChance, **R-A**)". **R-A** is *"a `required: true` row is pushed without a draw and evicts a same-`exclusiveGroup` row already drawn (`assembleInstitutions.js:283-293`, `:345-346`)"* — the mechanism that makes the whole roster argument work. `D-16` is STRUCK and its entire recorded ground is *"general refute **R-L7** corrects …"*; `S-17`'s KEPT half is *"`palace_coup` is the FALLBACK (**F6**)"*.

This defeats the archive's stated purpose in the owner's own words — *a later reviewer must be able to take any single item … and CHALLENGE it without re-reading the whole programme*. On at least 39 rows the reviewer must go back to the ratified table to learn what the row says.

**Fix.** Reproduce the six preambles verbatim in a `§0 — THE CODES THE ROWS ARE WRITTEN IN` block, and amend the "only thing dropped" sentence.

---

## FINDING 3 — MATERIAL. `D-24`'s authored permission hands back a list the same cell then forbids, and overstates the grant on a CONTRADICTION row.

**Source packet, `D-24`** (verdict CONTRADICTION):

> `| D-24 | the live band: a 0-100 causal position; `collapsed` ≠ nobody left | CONTRADICTION | `causalState.js:423-427`; the population figure prints on the same page | — |`

**Ratified law, `D-24` NOT ENTAILED** (carried verbatim in the archive's column 2):

> that `collapsed` means nobody is left (corpus `:3114`); `adequate` is the no-information reading (`:436`)

**Archive, permission (composed):**

> "Write what a `collapsed` or `surplus` band feels like from inside, and give the causal position any texture you like — **the old row's whole NOT-ENTAILED list is handed back**. Never write the town as emptied: `collapsed` is a position on a 0-100 score and the population figure prints on the same page."

`D-24` has a two-item NOT ENTAILED list and the first item is *"that `collapsed` means nobody is left"* — which is precisely the thing this row was tagged CONTRADICTION to deny, and which the cell's own next sentence forbids. The sentence is self-refuting as written. It is also structurally wrong: a CONTRADICTION verdict means the row survives whole, so there is no list to hand back; and the blanket phrase collides with **R-α**, under which every number, count, date and death toll on a NOT ENTAILED list survives on floor 2 and is never "handed back". A reviewer who reads the first clause and stops has been told the opposite of the fold's decision.

The same construction appears once more, at `P-13` — "take the old list back entire — a public act, a vote, a protest, a rival's move are all yours". There it happens to be sound (`P-13`'s list carries no number and no floor-1 item), but it is the same unfenced formula and should be re-cut with it.

**Fix.** Delete the "whole NOT-ENTAILED list is handed back" clause at `D-24`; at `P-13` fence it ("none of that list is a number or a same-page fact").

---

## FINDING 4 — NOTED. `D-R2`'s authored permission drops one of the two refuted members, converting a recorded denial into silence (and therefore, under the re-cut, into permission).

**Ratified law, `D-R2` refuter's evidence** (carried verbatim in column 2):

> `hasSyndicate` (`defenseDisplay.js:187`) classifies **`Front businesses`** (`institutionalCatalog.js:1480`, `:2040`, **a laundering cover with no hierarchy**) **and** `Multiple criminal factions` (`:2006`, "Competing gangs. Turf disputes") as `organized` … — verdict cell: **"REFUTED for two members"**

**Source packet, ground:** names only `Multiple criminal factions`. **Source packet, permission:** `—`.

**Archive, permission (composed):**

> "Give an `organized` underworld a hierarchy, a permission-giver and a suppression habit **where the roster carries a `Thieves' guild`**. Never assert a single hierarchy **where the row is `Multiple criminal factions`**, whose own desc reads 'Competing gangs. Turf disputes'."

The composed cell polices one of the two members the ratified law names and says nothing about the other. Under the re-cut's own rule — silence is permission — a writer reading this cell may write a hierarchy over a `Front businesses` row, which the ratified evidence expressly says has none. The narrowing begins in the packet's ground, so the archive did not invent it; but the archive turned a narrowed *ground* into an affirmative *permission*, which is where it starts to bite. Worth a reviewer's mark because it is the exact shape the brief warns about: half a denial going missing where nobody would look.

---

## FINDING 5 — NOTED. Two high-risk strikes the closing section should have named and did not; plus two small preamble slips.

**5a. `E-R1` (`specialist trade` = one speciality — STRUCK; permission "Name the town's signature trade").** The closing section names five strikes to push on (`D-2`, `D-16`, `WF-32`, `E-R17`, `E-R15`) and two lesser (`D-18`, `P-17`). `E-R1` belongs on that list and is absent. The ratified ground is *"SPECIALIZED = town && `incomeSourceCount >= 4` && not (market && >= 6): four or five income lines; nothing selects a speciality"* — and the income mix **prints on the Economy tab**, a fact this very slice relies on at `E-15` ("KEPT the income mix printed … never point at an income line that is not there"). Naming one signature trade beside a printed mix of four or five lines is the same-page shape the table keeps everywhere else; the permission is handed back unfenced, where `E-15`'s is fenced. The honest verdict looks like SPLIT: name the signature trade **where the income mix carries it**.

**5b. `E-R2` (`mix of field and market` = farming and a market — STRUCK; permission "Write the fields").** The ratified evidence knocks down only the **farming** half (*"farming is never tested; every thorp/hamlet/village carries `Agricultural Rents` by tier default with no farm"*). The **market** half is the half the label actually tests — `MIXED = village && hasMarketInst` — and `hasMarketInst` is satisfied by a `Black market` or a `Thieves' guild` (`economicState.js:882`, the packet's own `E-2`), which is the precise contradiction kept at `G-12`, `G-R4` and `E-19`. This is a SPLIT recorded as a STRUCK on evidence that reaches only one of its two clauses. The permission ("Write the fields") is correctly narrow, so the exposure is the vacated bar rather than the grant — which is exactly why the closing section should have flagged it.

**5c. R-α is mis-mapped onto the archive's own columns.** Packet: floor-2 survivors *"are named in `keptAs` only where they are the row's principal survivor"*. Archive: *"are named in **the permission column** only where they are that row's principal survivor"*. In this archive `keptAs` is the **ground** column (`KEPT … + floor 2 (a price, a volume)`), not the permission column. A reviewer auditing where floor 2 was recorded will look in the wrong column — and the archive gets the same mapping right two paragraphs later ("the packet tagged it MODEL and said so in the ground").

**5d. R-β is restated shorter than the packet stated it.** Packet: *"Where the record itself states a disjunction (`Palisade or earthworks`; 'navigable river OR a river crossing'; 'wolves, raiders, or worse'), naming ONE disjunct is permitted … **This strikes D-2, E-R14 and half of S-10/S-R9** — bars that cost the prose its concrete nouns for nothing."* Archive: *"where the record itself states a disjunction, naming one disjunct is permitted."* The three quoted disjunctions and the casualty list are both gone. Recoverable — the closing section names the same rows, and each row's own cells cite R-β — so this is a slip, not a distortion, but a standing rule of the re-cut should be recorded at full strength in an archive built for challenge.

**Also noted, not counted as a finding:** the packet's `## NEW FINDINGS` section (17 numbered contradictions "no bar ever stated") is not reproduced. Finding 17 (the missing floor-2 / **PROMISE** verdict) survives in the archive's preamble, correctly and prominently. But `S-8`'s permission ends *"see NEW FINDING 1 on the plague word"* and `WF-32`'s ends *"see NEW FINDING 16"*, and neither is resolvable inside the archive — two more dangling pointers of the Finding-2 kind. Findings 1–16 are ruled wiring debt rather than writers' law, so their absence from an items archive is defensible; the two dangling pointers are not.

---

## VERDICT

**FAITHFUL WITH NOTED DEFECTS.**

**Items checked: 235 of 235** — all mechanically on id, verdict, ground, permission and verbatim-law fidelity (1,015 individual law-field comparisons against the ratified table), including **all 140 SPLIT rows** (each proven byte-identical to the packet on all three of the fold's columns) and **all 19 STRUCK rows**; approximately 35 rows additionally read in full by eye, spread across all six desks and both the main and REFUSED sub-tables.

I could not make the "NOT FAITHFUL" case. On the two axes where a scribe's infidelity would do the most damage — a dropped item and a softened quotation of the old law — the archive is exact, and exact in the places where softening would have flattered the fold. Every verdict is the packet's. Every SPLIT keeps both halves in the packet's own words. The `IT POLICED:` additions on the STRUCK rows are disclosed and appended, never substituted.

The defects are of one family: **the archive writes in three voices — the ratified law, the fold, and itself — and labels only two of them.** 71 permission cells, 19 `IT POLICED:` clauses and the whole closing section are the archivist's, and the preamble's provenance sentence covers only the second of those. Finding 2 compounds it by cutting the codes the quoted law is written in, while asserting nothing but the `source` cell was cut. None of this alters a verdict or a KEPT field; all of it degrades the one thing the owner asked for, which is a reviewer's ability to take a single row and challenge it on its own.

Findings 1, 2 and 3 should be repaired before a Fable seat is given this table. Findings 4 and 5 are for the reviewer's mark.
