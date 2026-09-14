# FIDELITY ADVERSARY REPORT — SLICE W1–W10 (the ten writer rules + ADDENDUM 12's chair rulings R-i, R-ii, R-iii, R-iv, R-vi, R-viii′, as amended 2026-09-10)

**Archive under test.** `rewrite/retro/items-W1-W10.md` (claims 16 rows against 16 source items).
**Source of truth.** `rewrite/retro/evidence/convert-W1-W10.md`.
**Corroborating verbatim.** `rewrite/retro/verbatim/BRIEF-pre-recut-ADDENDA-1-to-13.md` (ADDENDUM 12, its 01:1x amendment, ADDENDUM 13A) and `rewrite/retro/verbatim/rulings-DEF2.as-run.txt`.
**Method.** Every one of the archive's 16 `the old law, VERBATIM` cells was extracted and diffed as a normalised substring against the pre-recut brief (quote-glyph, dash and whitespace normalised) — not read by eye. Every verdict, ground and permission cell was compared against the source packet's corresponding cell. Every `file:line` citation in both documents was extracted and set-differenced. Every one of the three SPLIT items was compared half by half.

**VERDICT: FAITHFUL WITH NOTED DEFECTS.**
**Items checked: 24** — all 16 verdict-table items (each verbatim-diffed at character level), all 3 SPLITs half by half, all 6 of the packet's NEW FINDINGS, the packet header (the four surviving floors) and the packet SUMMARY.

---

## WHAT THE HUNT DID *NOT* FIND (stated first, because it bounds the defects below)

**Hunt (1) — a missing item: NONE in the verdict table.** All sixteen ids are present exactly once: R-i, R-ii, R-iii, R-iv, R-vi, R-viii′, W1, W2, W3, W4, W5, W6, W7, W8, W9, W10. No merge, no duplication.

**Hunt (2) — a softened `VERBATIM` column: NONE. All 16 are exact.** Every quoted cell is a character-exact substring of the pre-recut brief after glyph normalisation (`exact-in-BRIEF=True`, 16/16; lengths 88–712 chars). Fifteen quotes run to the rule's own sentence boundary — the text immediately following each quote in the brief is the *next* rule, never a dropped clause of the quoted one. This column is **better** evidence than the source packet, whose "gist" column is avowedly a paraphrase; the archive went back to the ADDENDUM. W7's `"W7 THE ROLL — R-vi."` is expanded by an explicitly flagged parenthetical (`(i.e. verbatim by reference: …)`) whose text is also character-exact. The archive's stated tie-break policy ("where the ADDENDUM and the as-run rulings differ, the ADDENDUM is quoted") is declared in the preamble and is honoured — R-iii, whose as-run wording is materially broader (a three-member usage-frame family), is quoted from the ADDENDUM as declared, not silently.

**Hunt (3) — a silently altered verdict: NONE.** 16/16 verdicts match the source (SPLIT ×3 — R-viii′, W2, W3; STRUCK ×13), and each SPLIT's KEPT half and STRUCK half are assigned to the same halves the source assigned them, with the same floor number (R-viii′ floor 4 MODEL; W2 floor 1 CONTRADICTION; W3 floor 1 CONTRADICTION). The tally line matches the packet's summary line exactly.

**No fabricated evidence in the adversarial section.** The closing section's two most load-bearing external quotes were checked against the brief and are exact: ADDENDUM 12's `"makes the wall's muster, the shipped watch by another route"` and `"the CONSTRUCTION COLLAPSE in SMALL (the refiner moved variant 2 onto variant 1's grammar)"`; and W24's clause, quoted in §3, is verbatim from ADDENDUM 13B — `"The [ledger] ANGLE is a STANDPOINT … and licenses NO record noun and no citation ('the books show' is a citation; 'entered as standing' is the office's formula, R-vi/W7)."`

---

## FINDING 1 — MATERIAL. Five of the packet's six NEW FINDINGS are absent from the archive entirely. Two of them create NEW BARS on writers; one is a floor-1 defect the packet routes to the owner.

This is the slice's one real fidelity failure, and it is a *class* omission, not a slip. The citation set-difference proves it mechanically: of the source's fifteen distinct `file:line` citations, **seven appear nowhere in the archive, and every one of the seven belongs exclusively to a dropped NEW FINDING** —

| dropped citation | the NEW FINDING it carries |
|---|---|
| `OverviewTab.jsx:251` | NF 2 — the printed age |
| `defenseGenerator.js:189`, `:186-192` | NF 3 / NF 4 — the four gates, the bounded shortfall |
| `contradictions.js:136-153` | NF 5 — tension as a feature |
| `threatAssessment.js:59`, `defenseInstitutionBuckets.js:84-86` | NF 6 — the hardcoded "palisade" |
| `composeStateProse.js:679` | NF 1 — the only one that survives, and only as a pointer |

The archive contains the string "NEW FINDING" exactly twice, both times as `NEW FINDING 1` inside W1's row. It contains no occurrence of `register car`, `palisade`, `OW-20`, `contradictions.js`, or `scope`/`deity`.

**The source's words (NEW FINDING 3), absent from the archive:**
> "There are FOUR upkeep gates on the defense page, not two, and they are monotone in ONE input — so a face may never split their DIRECTION. Military 0.6 (`defenseGenerator.js:189`), monster 0.7 (`:223`), internal/order 0.65 (`:251`), disaster 0.55 (`:614`) … ADDENDUM 12's amendment stated the one-purse pattern WITHIN a class and named two purses; the cross-gate rule follows and was never written: at birth a face may not say one funded arm is flush while another starves (the watch paid and the muster not, patrols provisioned and the gaol unfunded). They differ in degree only, never in direction."

**The archive's words, in full, on this subject:** nothing. Its R-viii′ row says "ONE multiplier … over 'garrison wages, wall maintenance' **together**" and "one purse" — with no indication anywhere in the document that the amendment the row is quoting **itself named TWO purses** (the military purse and the order purse over watch, court and gaol), let alone that the re-cut generates a new cross-gate bar. The as-run rulings the DEF-2 lane actually received say it in one breath: *"there is ONE military purse over wall maintenance and garrison wages … **and a SECOND order purse over the watch, the court and the gaol**."* A retrospective validator who takes R-viii′ — the slice's single MODEL item, the one most likely to be challenged — and asks "what may a writer now do?" is handed a one-purse world and a permission to write men drifting off, and is never told that a second purse exists, that four gates exist, or that a new bar on splitting their direction arrived with the re-cut.

**NEW FINDING 2 is the second material loss**, because it is a *conversion*, not an addition — it turns a licence argument into a live contradiction source, which is exactly the transaction this whole archive exists to record:
> "The town's AGE is printed, so history is now a live contradiction source rather than only a silence. … DS-DEF-11's card recorded 'when the wall was raised has NO backing fact and is deliberately absent' — a licence argument that is void under ADDENDUM 14. What replaces it is sharper: age-flavour is now free … EXCEPT where it contradicts the printed age … A wall 'raised in living memory' on a four-hundred-year-old town is a floor-1 breach against a number on the same page."

Nothing in the archive says this. NF 5 (the engine's own `interesting_tension` classifier, which is simultaneously the best evidence *for* the re-cut and a bar on flattening) and NF 6 (the hardcoded "Palisade and citizen militia" on the same rendered page, a floor-1 self-contradiction the packet routes to the owner) are likewise gone.

**Why this is a fidelity defect and not an editorial choice.** The archive's preamble asserts "**16 — no item merged, none omitted**". That claim is true of the verdict table and false of the packet. The owner's stated purpose is that a later reviewer "take any single item, see EXACTLY what the old law said, what was decided, on what ground, and **what a writer may now do**" — and for at least R-viii′ and R-i, what a writer may now do is *not* what the archive's permission cell says, because NF 2 and NF 3 narrow it. The cure is small: five rows in an appendix, or a `NEW BARS ARRIVING WITH THE RE-CUT` section, carrying the packet's words.

---

## FINDING 2 — MODERATE. R-ii's ground adds an unsourced claim that makes the strike look more obviously right than the packet made it.

| | |
|---|---|
| **SOURCE (R-ii ground)** | "The residual bar — the one-per-variant cap — names no field; the typed move vocabulary is checked mechanically in `src/domain/prose/moveGrammar.js` and did not red." |
| **ARCHIVE (R-ii ground)** | "The **residual bar — the one-per-variant cap — names no field**; it policed variety. The typed move vocabulary it invoked is checked mechanically in `src/domain/prose/moveGrammar.js` and did not red on any of these faces, **so the cap added nothing an instrument was not already doing**." |

The bolded tail is the archive's own, and it does not follow from anything in the packet. The packet reports two independent facts (the cap names no field; the *move vocabulary* is instrumented and was green). The archive fuses them into a third claim — that the instrument already performed the cap's duty. It did not, on the packet's own description: the cap is a **cross-variant frequency limit** ("at most ONE such opener per variant"), while what the packet says `moveGrammar.js` checks is the **typed move vocabulary** of a face. An arm that types moves cannot count how many variants in a pool opened on a negation. The strike may still be right on the packet's actual ground ("names no field"), but the archive supplies a second, invented ground, and it is the kind that ends an argument. Same shape, milder, at R-i: source "No field." → archive "No field is named **and none exists**" — an assertion the archive's own closing §1 then contradicts.

---

## FINDING 3 — MODERATE. The packet's floor-3 finding is dropped, so the one claim a validator would most want to spot-check is unstatement.

| | |
|---|---|
| **SOURCE (SUMMARY, final line)** | "Nothing in this slice touches floor 3 (scope/deity)." |
| **ARCHIVE** | No occurrence of "floor 3", "scope" or "deity" anywhere in the file. |

The archive carries floors 1, 2 and 4 (correctly, and in the right rows). Floor 3 is the product-scope-and-deity-doctrine floor — the one floor a re-cut can never relax, and therefore the one a retrospective reviewer is most likely to audit across slices. The packet made the negative claim positively and checkably; the archive leaves it as silence, which under this very slice's own doctrine is not the same thing.

---

## FINDING 4 — MODERATE. A high-risk strike the closing section should have named and did not: the unbuilt-instrument dependency is systemic, and the section presents it as a one-off.

The closing section's §5 says of W4: "**This is the one strike in the slice** that removes an arm which demonstrably caught something … The replacement named in the strike — the pool-grain CRAFT verdict — is an instrument ADDENDUM 14 *creates*, i.e. one that does not yet exist, has never been run, and has no demonstrated sensitivity."

That argument is correct and it is under-scoped by the archive's own rows:

- **W6** (archive ground): "Re-pointed to the pool-grain CRAFT verdict: repetition is dullness, judged as craft, never a lawfulness finding."
- **R-ii / W10** (archive ground): "It **policed variety**, not truth" — and variety at the pool grain is precisely the unbuilt CRAFT verdict's remit; no other instrument is named for it anywhere in the slice.

So **three or four rows, not one**, are discharged into an instrument that has never fired, and two of them (R-ii and W10) fall together as a pair — the same double-row exposure the section correctly flags for R-vi/W7 but does not flag here. The honest form of §5's own remedy ("SUSPENDED pending the CRAFT verdict's first firing") applies to all of them or to none. A reviewer told that W4 is the sole such case will mis-price the slice's total coverage loss.

---

## FINDING 5 — MINOR, but it is a live writer hazard: W5's permission cell licenses the exact construction W3's kept half refuses, and nothing in the archive flags the collision.

| | |
|---|---|
| **W3, kept half (archive)** | "What is refused is naming a DIFFERENT tier than the strip prints." (`UNWALLED-SMALL` fires across thorp/hamlet/village.) |
| **W5, may now do (archive, = source)** | "Use '**a town of {settlement}'s weight**', 'a place like this one', generic articles, comparatives — any frame at all. Only the tier the strip prints binds." |

On a Thorp firing `UNWALLED-SMALL`, "a town of {settlement}'s weight" names a tier the identity strip does not print — a floor-1 breach by W3's surviving ground, licensed by name in W5's cell. The trailing sentence "Only the tier the strip prints binds" is the only thing standing between the two rows, and a reviewer validating W5 alone will read the licence and not the limit. The archive is faithful here (the source's cell is identical), so this is not a transcription defect; it is the sixth candidate for "THE STRIKES MOST LIKELY TO BE WRONG" and it was not taken.

---

## FINDING 6 — MINOR. R-viii′'s quote stops one sentence short, and the row never records that the old law it replaced said the opposite.

The archive's R-viii′ verbatim ends at "(R-DST-A: … the STRAINED skeleton bars a headcount)." The very next sentence in the brief is part of the same ruling and is the operative conversion:
> "A face already written as 'The {defwork} keeps itself, and the muster's wages do not' (or any wording that pays the wall and not the muster) FAILS under R-viii′ with the cure: the shortfall stated over both, the wall's standing stated as surviving it …"

The archive's permission cell does carry the substance ("May NOT write a wall that pays for itself"), so nothing is lost to a writer. What is lost to a *validator* is the history: the parenthetical "(replaces R-viii …)" is in the quote, but nowhere does the archive record that R-viii had **LICENSED** "The {defwork} keeps itself, and the muster's wages do not" as the engine's recorded asymmetry, that the owner overturned it on 2026-09-10 at 01:0x, or that ADDENDUM 13A item 3 then STRUCK the same sentence from the entailment law. R-viii′ is the one item in this slice that had already reversed itself *before* ADDENDUM 14 touched it, and that is exactly the kind of thing a retrospective challenge turns on.

---

## FINDING 7 — MINOR. "None omitted" is asserted while three of ADDENDUM 12's eight rulings have no disposition line.

The archive's preamble correctly reports that "the chair then owed **eight** rulings" and then tables **six**. R-v, R-vii and R-viii are never mentioned again. Each is disposed of in one clause in the brief — R-v "CLOSED at ADDENDUM 8"; R-vii "stays a wiring ruling for the register car"; R-viii "replaced by R-viii′" — and each absence is legitimate. But against the claim "no item merged, **none omitted**", a reviewer auditing the fold's coverage has to leave the archive and read the brief to discover that the missing two-of-eight are not lost items. Three lines would close it permanently.

---

## SUMMARY TABLE OF FINDINGS

| # | severity | class | what is wrong |
|---|---|---|---|
| 1 | **MATERIAL** | omission | NEW FINDINGS 2–6 absent entirely; the new cross-gate bar (NF 3) and the age-contradiction conversion (NF 2) narrow permissions the archive states without them; 7 of 15 source citations vanish with them |
| 2 | moderate | ground strengthened | R-ii: unsourced "the cap added nothing an instrument was not already doing"; milder at R-i ("and none exists") |
| 3 | moderate | omission | the packet's positive floor-3 (scope/deity) clearance is dropped |
| 4 | moderate | closing section | the unbuilt-CRAFT-verdict exposure is named for W4 only, though W6 and R-ii/W10 rest on the same never-run arm |
| 5 | minor | closing section | W5 licenses by name the construction W3's kept half refuses; collision unflagged |
| 6 | minor | quote boundary | R-viii′ stops before its cure sentence; the row never records that R-viii had licensed the opposite |
| 7 | minor | scope claim | "none omitted" stated while R-v / R-vii / R-viii carry no disposition line |

**Nothing found under hunt (2) or hunt (3).** The verbatim column and the verdict column are clean at character level — 16 of 16 each. The defects are omissions around the table (one of them material) and two grounds strengthened beyond the packet, never a doctored quote or a flipped verdict.

**VERDICT: FAITHFUL WITH NOTED DEFECTS — 24 items checked.**
