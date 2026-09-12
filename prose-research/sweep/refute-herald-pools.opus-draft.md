Seat: Opus 5 — Fable-unvalidated

# REFUTE — herald-pools (`reconcile-herald-pools.md`, R3 · R4 · R4b · R5)

**NOTHING IN THIS FILE IS VALIDATED.** Written by the Opus seat under the owner's 2026-09-07 ~09:50
directive that every agent of this run is Opus. The Fable chair retrovalidates through
`docs/FABLE_RETROVALIDATION_QUEUE.md` at the next ledger act. Until that sitting every verdict below
is a finding with its receipts attached, not a ruling.

**Method.** Every source integer was recounted from `kept-<author>.json` by pulling each cited row's
`Rows`/`Kept rows`/`Evidence (kept rows)` list out of `best-<author>.md` and collapsing the `source`
strings of those kept rows by hand. Every figure was re-derived from `PROBE_ALL.md` §3/§4/§6 (the
corrected 2026-09-06 edition) and from the eighteen `*.fingerprint.json` files
(`primary/*` plus `estate-state`, `herald-pools`, `herald-crier`, `npc-ladder`). Every fault count was
checked against `best-ai.md`. Every U-number was checked against `taste-sample-refutation.md` §2, and
every A/A′/B0/B-CLAIM/B-GRAMMAR citation against `RULES-V2-DRAFT.md`. No quotation exceeds twelve
words.

**Score: 14 of 16 items REFUTED** (12 rules, plus §2's table, §3's grammar set, §6's absence ruling,
§7's conflict 7). Two rules — HP-7 and HP-9 — survive with only small corrections and are marked LOW.
Nothing here says the register's direction is wrong. It says which specific claims will not carry
weight at the owner's walk.

---

## 0. WHAT SURVIVED THE RECOUNT, STATED FIRST

The following were checked and are **correct**, so the file's core is sound and the findings below are
corrections, not a demolition:

- **The §2 table's estate figures.** All fifty-two R3/R4/R4b/R5 cells I checked reproduce exactly from
  `PROBE_ALL.md` §3, and the three metrics not in that table — neighbour variation, same-opener,
  runs-of-three — reproduce exactly from `herald-pools.fingerprint.json` (0.330 / 0.189 / 0.5973) and
  `herald-crier.fingerprint.json` (0.178 / 0.4242 / 0.7273).
- **The corpus medians.** 0.46, 0.130, 0.079, 0.004, 0.006, 0.050, 0.057, 0.008, 0.135, 0.672, 0.112,
  1.5, 5.3, 0.027 all reproduce from §6's outlier tables.
- **The §4 tic figures.** R5's seven grams (26/10/10/8/8/7/7 and lift 1,192), R4b's four
  (8 at 16.0%, lift 448; 6; 4; 4), R4's three (14 at 10.5%; 6; 5) and R3's `free of` at 9 of 1,212 are
  all exact. (`settlers have` ties `free of` at 9; a tie, not an error.)
- **The fault counts.** 1 = 14 documents, 6 = 6, 9 = 11, 11 = 24, 13 = 14, 17 = 19, 19 = 17, 24 = 15,
  27 = 5 collapsed to one page family. All exact.
- **Every U-number citation.** U2, U3, U4, U5, U8, U9, U10, U11, U12 are each used for what §2 of
  `taste-sample-refutation.md` actually says (one wording slip, at HP-8, noted below).
- **The technical claims.** [P-2]'s two empty R3 homes and the 470 of 477 barrel-order credit; [R-7]'s
  28 of 196 subset rows; [R-12]'s phrase-register caveat; the FNV-1a low-bit parity and the raw `% 8`
  unreachability (`PROSE_INVENTORY` §7.4). All verified at source.
- **The conservative deductions.** Le Guin deducted from `leguin:12` because she is a counted hand
  inside `tolkien:C1`; `tolkien:B1`'s four-of-five; `wolfe:22` wholly subsumed by `wolfe:20`'s hands
  (I confirmed all four of 22's hands appear in 20's rows); Kay collapsed from a true 13 to 7 in HP-9.
  Every one of these under-counts. The file is honest in the direction that costs it.
- **The refusals in §5.** `hobb:21` SINGLE/PARTIAL, `wolfe:13b` MODERATE, `wolfe:14` SINGLE,
  `kay:25` SINGLE, `leguin:39` SINGLE, `tolkien:A3`'s Holmes counter-reading, `kay:24`'s 8 sources
  and its zero-inversion limb, `dnd:27`'s **HIGH** anti-AI grade — all reported accurately.

---

## 1. THE CROSS-CUTTING FINDING §2 DOES NOT CARRY

§2 promises three cautions **"so no rule below rests on a figure that will not survive"** and carries
[R-7], [R-12] and [P-2]. It does not carry the one that bites hardest.

**Three of the metrics the rules move are extraction-order artefacts.** In `fingerprint.mjs`,
`sameOpenerAsPreviousRate` is `first.slice(1).filter((w,i) => w === first[i])`,
`runsOfThreeSameLengthBand` walks `lens[i]`, `lens[i-1]`, `lens[i-2]`, and `neighbourVariation` is a
consecutive-pair burst. For an exemplar these run over a published book's **reading order**. For the
estate they run over a **pool dump in file and pool order** — a sequence no reader ever meets, because
the Herald draws one variant per event. Adjacent lines in the dump are usually siblings of one pool,
which is why R5 reads 0.4242.

This does not make the figures worthless — a pool-level frame rule genuinely moves them — but it does
mean **HP-1's 0.4242 → ≤ 0.15 and HP-2's 0.597 → ≤ 0.40 and 0.330 → ≥ 0.50 compare an artefact of
extraction against a property of prose**, and the exemplar bands they are anchored on (0.033–0.167,
0.154–0.408, 0.495–0.805) are reading-order numbers. Neither rule says so. No file in the sweep says
so: I grepped `PROBE_ALL.md`, `PROBE_ALL_REFUTATION.md` and `EXEMPLAR-BEST-PARTS.md` for it and found
nothing.

**Cure.** Add a fourth caution to §2 and re-derive all three metrics over a **simulated draw
sequence** (the engine's own seeded picks over a run of events) before either SIZE goes to the owner.
The pool-level statistics — repeated-two-word-opener share (R5 0.224), pools uniform in segment count
(R5 0.672), within-pool word sd (R5 1.3) — are order-free and are the honest targets today.

---

## 2. VERDICTS, RULE BY RULE

### HP-1 — REFUTED · HIGH
*Vary the crier's FRAME across a pool.*

The count is right: `martin:31` 7, `kay:26` 6, `tolkien:B2` 6, `wolfe:11b` 5 = 24, and I found no
cross-author duplicate among the four source lists. Four defects:

1. **The guard licenses the Brackwater move (ruling 5, ruling 7's finite-semantics law).** The guard
   reads that the crier's licensed recurrence is his **office's** saying rather than a town's. But
   HP-4, three rules later, states that `VOICE_LINES` is keyed by category × bucket and **carries no
   speaker role**, and HP-6 forbids naming an office where no office row exists. The guard therefore
   licenses a sentence whose licensing field the same file says does not exist. As a template it
   produces exactly the kicker the owner caught: a clerk asserting an office it holds no data for.
2. **"No new field is needed and none is invented" is false in its own paragraph.** The paragraph
   before it specifies *a typed FRAME element … drawn per-variant from a frame pool*, disjoint within
   a pool key. A frame pool is a new pool. The category × bucket key is not a frame field.
3. **A11 is over-read.** `RULES-V2-DRAFT` A11 bars a rewrite that would *make two variants share their first two words* — a
   no-worsening delta test whose unit is the first two words. HP-1 converts
   it into an absolute state target (*pools sharing the frame gram → 0*) over a broader unit, and
   attributes that to A11 **"in terms"**. A11 does not require R5's measured 0.224 to reach zero.
4. **The negative control may not fire.** HP-1's walker measures same-opener-as-previous and per-pool
   frame-gram collision; the control is `and the country` (26 of 373). §4's own printed example for
   that gram is a **second-clause tail** (`…mouth to mouth, and the country reckons…`), not an opener.
   `the matter of` (10 of 373) is an opener in its printed example and was the control available.
5. Plus §1's order artefact: the SIZE's target and its band are not the same kind of number.

**Cure.** (a) Delete the office-saying limb until an institution/office table exists (HP-6's spine),
and license the crier's recurrence from the category × bucket key that does exist. (b) Restate the
second figure as A11's actual delta test. (c) Swap the control to `the matter of` and add a
pool-level collision control. (d) Re-derive the 0.4242 over a simulated draw sequence, or re-target
the rule on the order-free pool statistics (repeated-two-word-opener 0.224, within-pool sd 1.3).

---

### HP-2 — REFUTED · MEDIUM
*Measure R3, do not touch it, take the rhythm cure to the owner.*

The deferral itself is right and is the most important thing in the file. Three defects:

1. **The sources do not license the rule's content.** The rule's content is *defer to the owner's
   signature*; that is licensed by A16, A′-R3, `eventProse.js`'s docstring and THE PROMISE — standing
   law, which the rule names. `kay:44` and `dnd:46` license the **measurement**, not the deferral.
   Carrying an integer of 11 and a grade of STRONG for a procedural rule misapplies ruling (2), which
   makes a technique's standing its source count.
2. **`dnd:46` is not three documents by the file's own convention.** Its kept rows carry three source
   strings: a **finder measurement** over SRD 5.1, a **finder measurement** over Basic Rules 2018, and
   the Style Guide v1.04a. `best-dnd` splits SRD 5.1 into two documents (planes appendix, pantheon
   prose). §0.4 of the reconciliation rules that an executed instrument supplies a figure and never
   raises a source count — the same standard applied to `best-own.md` must apply here.
3. **Both SIZEs are order artefacts** (§1 above), and both are the numbers the owner is being asked to
   sign. That is the worst place in the file for an unflagged measurement risk.

**Cure.** Attribute the deferral to A16 / A′-R3 / THE PROMISE and drop the source integer to what it
licenses. State `dnd:46` as two measured PDFs plus a style guide, instrument-derived and PROVISIONAL.
Re-derive runs-of-three and neighbour variation over a simulated draw sequence **before** the
signature is asked for, and print both numbers side by side.

---

### HP-3 — REFUTED · MEDIUM
*Cap a spoken unit by a band; stop at the reaction point.*

Counts verified: D&D 8 (`dnd:40` 7 + `dnd:41` 1, with `dnd:12`'s 4 subsumed — a genuine under-count,
since `dnd:12`'s Radiating Gnome, Hartlage and Shea are not among `dnd:40`'s hands), Le Guin 11
(`leguin:24` 6 + `leguin:30`'s five new — the overlap really is Le Guin alone), Tolkien 4 (`B1`'s five
minus Le Guin). 23 is right and conservative. Two defects:

1. **The new test arm cannot pass on R4.** The arm *fails any pool whose variants all carry the same segment count*. R4 is a phrase register: segments/variant **1.000**, terminal-stop share **0.000**,
   pools uniform in segment count **1.000** (PROBE_ALL §3). Every one of R4's eight multi-variant pools
   must fail forever, by construction, and no reconstruction can clear it. A test that cannot pass is
   the mirror of a test that cannot fail, and the rule scopes itself to "the Herald" and its test to
   "a Herald arm of `check-pair.mjs`".
2. **The sd target 7.0 has no source.** It is set "deliberately below the D&D floor of 8.5" — but 8.5
   (dnd-rules-srd52) is the **minimum** of the exemplar sd band, so 7.0 sits below every exemplar
   column. B0.4 licenses the *direction* (variance, not length); nothing licenses 7.0. It is a house
   figure, and by ruling (2) it should be presented as one.

**Cure.** Scope the uniform-segment arm to the three sentence registers (R3, R4b, R5) and exclude R4
by construction, in the rule's own text. Label 7.0 a chair-seat number with no source and send it to
the owner with §3's 0.35 / 0.15 (Q4), which is where the file already sends its unsourced ceilings.

---

### HP-4 — REFUTED · HIGH
*Differentiate a quoted voice by SYNTAX, never by accent, spelling or a word list.*

Counts verified exactly: `tolkien:C1` 9, `wolfe:20` 7, `wolfe:22` 4 correctly subsumed, `hobb:14` 6,
`martin:25` 4, `leguin:12` 4 less Le Guin = 3, `dnd:5` 5. Total 34, with no cross-author duplicate,
and every one of the six rows is Herald-mapped by its own Registers line. The evidence is the best in
the file. The rule around it has four defects:

1. **THE FIGURE IS MISREAD.** *R5 mean within-pool word sd 1.3 — the estate's second-lowest after
   chrome's 0.9* is false. PROBE_ALL §3's row reads R4 **0.6**, R9 **0.9**, R12 **1.1**, R7 **1.2**,
   R15 **1.2**, then R5 **1.3**. R5 is the **sixth**-lowest of eighteen columns, not the second.
2. **The same file contradicts it.** HP-10 calls R4's 0.6 *the estate's lowest*. Both statements
   cannot stand.
3. **The acceptance test has no subject.** The negative control is *strip the vocabulary from two
   role-differentiated pools*. The rule's own move-grammar paragraph states that no speaker-role field
   exists in `VOICE_LINES` and that the rule is a constraint on emission. There are therefore no
   role-differentiated pools in the Herald to strip, and the rename test cannot be run at all — today
   or after a reconstruction that obeys the rule.
4. **The third limb is self-cancelling.** The statement admits *trade vocabulary* as the third
   differentiator and bars *a per-role word list applied as a lookup*. With no role and no trade field,
   trade vocabulary can only arrive as the lookup the rule bars.
5. Minor: §1 says four independent authors converge on this mechanism; HP-4 says six.

**Cure.** Strike the ranking sentence and state the figure plainly: R5 1.3 against R3's 2.1, direction
up, anchored internally. Replace the blind-reader control with an executable one — clause-count and
opener-spread deltas measured across sibling variants of one pool. Defer the vocabulary limb in terms
until an office or trade field exists, so the rule reads as a constraint and never as a licence.
Reconcile §1's "four" with HP-4's "six".

---

### HP-5 — REFUTED · LOW
*A receipt states the deed and never its meaning.*

Figures all verified: `, which` 0.034 at 8.5× the 0.004 median is PROBE_ALL's own outlier row; Martin's
chronicle whichTailRate is **0.0000** (B0.2's zero); 2nd-sentence summary R3 0.016. A9's protection of
the discriminating tail and U9 are both used correctly, and the *not to zero* reasoning is the best
piece of guard-writing in the file. Two defects:

1. **A cross-author duplicate is not deducted.** **Michael Dirda** is a counted hand in `wolfe:15`
   (Washington Post, 1989, on Wolfe) and in `kay:30` (Washington Post via BrightWeavings, on Kay).
   §0.3 rules that cross-author duplicates are deducted by name. The count is **26**, not 27.
2. **The half that is executable today asserts what is already true.** Both figures are R3 and both are
   deferred to HP-2's signature. What binds now is R4b and R5, where the gloss rate is **0.000** and
   the 2nd-sentence summary rate is 0.000 / 0.003. The rule concedes this ("a hold, not a cure"), but
   it is then graded STRONG on 27 sources for a currently-inert instruction.

**Cure.** Correct to 26 and name Dirda as the deduction. Say in the Strength line that the R4b/R5 half
is inert against current measurement and its only failure mode is a regression a reconstruction
introduces — which is a real and worthwhile guard, but is not a cure.

---

### HP-6 — REFUTED · HIGH
*No Herald sentence may assert a fact the world's typed tables do not hold.*

This is the rule that carries ruling (5), and its direction is not in doubt. Three defects, one of them
serious:

1. **THE SOURCE COUNT IS WRONG BY REGISTER.** Of the 25, only `wolfe:3` (10) is register-mapped to the
   Herald (`Registers: A, H, C, Z`). The other four rows print Registers lines that **exclude**
   herald-pools: `hobb:19` (dossier-archivist; chronicle-line; compendium-docent), `dnd:23`
   (dossier-archivist · dm-page), `kay:11` (dossier-archivist, compendium-docent, chronicle-line,
   dm-page), `leguin:4` (dossier-archivist, chronicle-line, compendium-docent). Under ruling (1) —
   allocate to the layer whose evidence fits — 15 of the 25 are transplanted. The file cites Registers
   lines four times where they favour it (`hobb:14` *herald-pools (primary)*, `leguin:41`
   *herald-pools (primary)*, `dnd:3` *herald-pools (no hedge at all)*, `dnd:41`) and is silent where
   they do not.
2. **`dnd:23` is Transferable: PARTIAL by its own file** — the honesty transfers, the frequency must be
   governed, and the secrets' home is called an open decision and not an inherited rule. HP-6 cites it
   at 4 without carrying the qualification. (HP-11 does the same.)
3. **THE GUARD IS PARTLY VACUOUS AGAINST ITS OWN NAMED FAULT.** The Brackwater kicker's failure is a
   **quantifier**: it asserts exhaustiveness over an institution. HP-6 licenses **nouns** — office,
   exemption, count, actor, saying — from typed rows. Give the engine a two-row institution table
   holding *bailiff: counts* and *priest: exempt* and every noun in that kicker is licensed, and the
   sentence the owner refused is reproduced by the rule as written. A closed-world claim needs a
   closed table and an enumeration, which is a different and stronger licence than a row lookup.

**Cure.** (a) Restate the count as 10 Herald-mapped and 15 transplanted, naming the transplant, so
ruling (1) is discharged visibly rather than silently. (b) Carry `dnd:23`'s PARTIAL. (c) Add a
quantifier clause to the statement: *no line asserts exclusivity, totality or exemption-as-unique over
an institution unless the institution's table is closed and the walker can enumerate it* — and make
that the Brackwater negative control's actual assertion, since the noun test alone passes the kicker.

---

### HP-7 — REFUTED · LOW
*The Herald carries no quantity hedge.*

The count is the cleanest in the file. `dnd:3`'s no-hedge limb really is 3 of its 4 (Merwin, Dausuul,
Perkins; `best-dnd` itself says the archivist half rests on Alexander alone), `dnd:13` really is SINGLE
(Sims), `kay:11` 3, `wolfe:16` 3. Ten, with no duplicate, and `dnd:3`'s Registers line reads
**herald-pools (no hedge at all)** verbatim. Two small defects:

1. **"The cleanest column in the estate on this axis" is false for R3.** On AI tells / variant
   EXOGENOUS, R10 0.002, R17 0.002, R9 0.003 and A-W 0.003 all sit **below** R3's 0.004. Only R4's
   0.000 is the estate's cleanest, and BIBLE is 0.000.
2. **The R4b half is one row, not a rate**, as the rule half-concedes: 0.020 × 50 = 1 variant. Stated
   as a rate with a target it reads like a distribution.

**Cure.** Say R3 sits inside the clean band rather than at its floor, and name R4 as the cleanest
column. State the R4b half as a single named-variant act with the variant identified.

---

### HP-8 — REFUTED · MEDIUM
*The moving line is rationed; most entries carry none.*

The 7 is correct and the rule is admirably explicit about its own weakness. Three defects:

1. **THE HOLD CONTRADICTS ITS OWN FIGURE.** The rule reports the `came to nothing` family at
   **8 of 373**, prints it as 2.1%, and then sets *the uplift-closer family held at ≤ 0.02*.
   8 / 373 = **0.02145**. The measured value already exceeds the stated ceiling, so the SIZE is a cut
   of one variant labelled DIRECTION: hold.
2. **THE TEST CANNOT FAIL.** The acceptance walker counts the moving-line move per register and fails on any run of two. There is no typed MOVING move anywhere in the Herald, the instrument does not
   exist (§8.1 says every test in §4 is unrunnable today), and the rate is unmeasured (§7 conflict 3
   and §8.5's owed census). Both acceptance arms — U9's second limb and U5 — pass vacuously on any
   reconstruction, including one that adds moving lines to every entry.
3. **U9 is misdescribed.** The rule says the gnomic closer *is ruled three ways across five items*.
   U9 records **four** dispositions across five: praised at #24 and #10, **created** at #6, shortened
   at #27, cut at #39. The "created" case is the one A9 bars and is the one HP-8 most needs.

**Cure.** Set the uplift-family ceiling at ≤ 0.022 if a hold is intended, or say plainly it is a cut of
one variant. Make the rule's Strength conditional on the §8.5 census, so it is not graded STRONG on an
unrunnable arm. Correct "three ways" to four and name the created case.

---

### HP-9 — REFUTED · LOW
*The event lands on a household or an office; the bill goes elsewhere.*

The strongest-evidenced rule in the file and the one I tried hardest to break. `hobb:8` is 10 and is
its author's strongest row; `kay:14` 7 and `kay:16` 6 are collapsed to 7 by §0.3 — a **13 → 7**
under-count that costs the rule six hands it could have claimed, since the two Kay rows share no
source at all (Cawsey/Fischer Guy/Fram/Capossere/Das/Byrd Wilt/Olley against
Gunn/McBean/Rettino/Cobb/Borowska-Szerszun/newtothegarden). The figures are exact: R3 pronoun closer
0.077, martin-chronicle 0.0543, BIBLE 0.015, R3 triad 0.012 at 0.44× the 0.027 median. B0.3's civic-
referent caveat is carried correctly. The DEED→BILL adjacency ban is a real, walkable order constraint
and is the best mechanism proposal in the file. One defect:

1. **`martin:38` is not Herald-mapped.** Its Registers line reads dossier-archivist · chronicle-line ·
   dm-page · compendium-docent. Four of the 21 are transplanted and the rule does not say so — the same
   omission as HP-6 and HP-11, at a quarter of the scale. (`hobb:8`, `kay:14` and `kay:16` all name
   herald-pools, so 17 of 21 are sound.)

**Cure.** Name `martin:38` as a transplant of the consequence-tracing technique into the Herald, or
drop it to 17 Herald-mapped and note that the consequence-chain-length arm rests on Hobb and Kay.
Optionally reclaim the six Kay hands §0.3 discarded, since the two rows demonstrably share none.

---

### HP-10 — REFUTED · MEDIUM
*Keep every join-mold family populated; measure R4 against R3.*

Count verified (`kay:44` 8, `hobb:32` 4, `dnd:39` 3 = 15), all three Herald-mapped, and the FNV-1a
re-derivation claim is exact against `PROSE_INVENTORY` §7.4. Two defects:

1. **[R-12] IS CITED AS AUTHORITY FOR THE COMPARISON IT FORBIDS.** [R-12] says R4 is a *phrase*
   register scored on sentence metrics, so an R4 comparison is invalid. The invalidity is the
   **phrase-against-sentence** unit mismatch, not the estate-against-exemplar one. R3 is a sentence
   register (unit: sentence, 1.170 segments a variant, terminal-stop 0.847). Anchoring R4's pronoun-
   closer rate on R3's 0.077 reproduces the exact mismatch [R-12] names, moved inside the estate, and
   the rule presents [R-12] as the reason for doing it.
2. **Both SIZEs are edit lists dressed as rates.** R4 has **8** multi-variant pools and 133 phrases.
   *within-pool word sd 0.6 → ≥ 1.0* is a distribution target over eight pools; *pronoun closer
   0.128 → ≤ 0.077* is 17 phrases → ≤ 10. The same file correctly flags this pattern for R4b's single
   exogenous tell in HP-7 and does not flag it here.
3. Minor: `kay:44`'s Transferable line ends *the program owes its own counts* — every one of its eight
   hands is a Goodreads or Reddit reader. The rule leans on it for the distribution law without
   carrying that.

**Cure.** Anchor R4 on R4's own spread or on nothing at all, and say in terms that no cross-unit anchor
is available — that is what [R-12] actually implies. Restate both SIZEs as counts (phrases, pools) as
well as rates. Carry `kay:44`'s own caveat.

---

### HP-11 — REFUTED · HIGH
*A disclosure line declares a limit; rare, specific, shaped differently each time.*

The arithmetic is right (5+5+4+3+3+3 = 23) and the R4b figures are exact (colon 0.280 at 3.54× the
0.079 median; `the compromise` 8 of 50 at 16.0%, lift 448; pools uniform 0.455). The evidence base is
not.

1. **EVERY ONE OF THE SIX CITED ROWS EXCLUDES herald-pools FROM ITS OWN REGISTERS LINE.**
   `tolkien:F2` — dossier-archivist, chronicle-line. `hobb:19` — dossier-archivist; chronicle-line;
   compendium-docent. `dnd:23` — dossier-archivist · dm-page. `kay:11` — dossier-archivist,
   compendium-docent, chronicle-line, dm-page. `leguin:4` — dossier-archivist, chronicle-line,
   compendium-docent. `martin:10` — dossier-archivist · chronicle-line · compendium-docent.
   The rule's Herald-mapped source count is **zero**.
2. **§1 of the same file refuses this family for this register** — the document-frame apparatus (T1,
   T2, T3, T4, T7, T17, T18, T38) is assigned to *the dossier-archivist and the chronicle*, with R4b
   named as "the one exception". That exception is the chair seat's assertion that R4b is the Herald's
   apparatus voice. It is a reasonable assertion. It is not evidence, and ruling (1) asks for evidence
   that fits, not for a carve-out.
3. **The cited author's own remedy is the opposite one.** `dnd:16` (6 sources, *Empty slots omitted,
   never filled*) is graded Transferable: **PARTIAL** precisely because, in `best-dnd`'s own words, the
   estate writes absences where D&D omits elements. HP-11 and §6's WRITE ruling take the D&D omission
   evidence and use it to license writing. `dnd:23`'s PARTIAL grade is likewise uncarried.
4. **The colon SIZE is seven lines.** 0.280 × 50 = 14 colons; ≤ 0.150 is ≤ 7.5. A cut of roughly seven
   lines in a fifty-line family, stated as a rate.

**Cure.** Do not delete the rule — its shape is right and R4b really is the one Herald home with an
apparatus. Restate it honestly: **a chair-seat transplant of the archivist's declared-limit apparatus
into R4b, with zero Herald-mapped sources**, put to the owner alongside §6's absence ruling as one
decision rather than two. Carry `dnd:16`'s and `dnd:23`'s PARTIAL grades. State the colon target as
14 → ≤ 7 lines.

---

### HP-12 — REFUTED · MEDIUM
*Retire the crier's two interrogatives; cut exogenous tells to the median.*

The arithmetic on the variants is exact (0.005 × 396 = 2 segments; 0.024 × 373 = 9 variants;
0.020 × 50 = 1 variant), own row 50 is quoted correctly, and the rule's self-grading as MECHANICAL
rather than a cure is the most honest paragraph in the file. Three defects:

1. **The source integer does not add up.** Sources 18, itemised as `ai:19` 17 documents plus `dnd:13` 1, with `ai:27`'s five collapsed to 1. The three named components sum to **19**. One of them is silently dropped and the
   reader cannot tell which.
2. **THE EXCLUSIVITY CLAIM IS FALSE.** R5 is called *the one register* whose raw and exogenous rates are identical at 0.024. PROBE_ALL §3's two rows are identical in at least seven columns besides R5:
   R4 0.000/0.000, **R4b 0.020/0.020**, R6 0.006/0.006, R7 0.009/0.009, R8 0.013/0.013,
   R12 0.009/0.009, R14 0.014/0.014. R4b is a Herald column and the rule cites it in the same
   paragraph. The claim is what makes R5 look uniquely inexcusable, and it does not hold.
3. **B-CLAIM is cited as authority for spending a modality.** B-CLAIM permits spending
   *punctuation, word order and a rationed phrase* and forbids spending a modality (also a claim, a
   threat class, a pool's spread). HP-12 directs that each interrogative *must be rewritten to its
   declarative claim*, which is a modality spend, and calls the two questions "the exception".
   B-CLAIM contains no exception. §8.6 records that the two strings have never been identified, so the
   rule authorises a modality change on sentences nobody has read.

**Cure.** Correct to 19 or name the dropped component. Strike the exclusivity sentence and keep the
sound half — none of R5's nine tells is product vocabulary. Reverse the order on the questions: run
§8.6 first, print the two strings and the declarative each would become, and put that pair to the
owner as a modality spend under B-CLAIM. The lexical cut (9 → ≤ 3) needs no such gate and can proceed.

---

## 3. VERDICTS ON THE THREE NON-RULE RULINGS

### §3, THE CLOSED SET OF MOVE GRAMMARS — REFUTED · HIGH

1. **THE TWO CEILINGS ARE JOINTLY UNSATISFIABLE BY A SEEDED DRAW.** For any independent seeded draw
   over `n` grammars with probabilities `p_i`, the same-as-previous rate is `Σ p_i²`, whose minimum is
   `1/n`. With five grammars the floor is **0.20**, above the proposed **0.15**. And R5 does not have
   five: G5 is R4b-only and G3 enters only if the owner rules Q3, so the crier draws from **three or
   four** orders and its floor is **0.333** or **0.25** — two to over three times the ceiling. The
   0.15 can only be reached by an explicit refuse-the-repeat filter, which is a rota by another name,
   and ruling (3) is verbatim about that failure. The file reasons correctly that a 0.20 **share** cap
   over five grammars would force a rota; it does not notice that its 0.15 **run** cap forces a harder
   one.
2. **G1's attribution is wrong twice.** *G1 `DEED → PARTY → PLACE` (the head-record order, D 21 S5)*.
   `dnd:21` is *name, size band, who they mostly are, who rules* — PLACE → PARTY, with **no DEED**. Its Registers line reads **dossier-archivist · compendium-docent**, without
   herald-pools. The head of the Herald's proposed closed set is licensed by a row describing a
   different order in a different register.
3. **G3's register exclusion is unstated.** `kay:28` is correctly flagged SINGLE and gated on Q3, but
   its Registers line is dossier-archivist, compendium-docent — no herald-pools — and it is graded
   Transferable: PARTIAL. Two of the three reasons to gate it are missing from the gate.
4. G2 (`hobb:8` 10, `kay:14` 7) and G4 (`wolfe:26` 8, Registers A, C, **H**) are both sound.

**Cure.** Express the run ceiling as a function of the set size — `≥ 1/n` is the floor for any i.i.d.
draw, so propose (say) `1/n + 0.05` and let the anti-template work be done by the 0.35 share cap,
which is genuinely reachable. Re-attribute G1 to a Herald-mapped row (`wolfe:26` or `dnd:41`) or drop
it and open the set at four. Add G3's register exclusion to its gate. Send the corrected arithmetic to
the owner with Q4, since Q4 is already the owner's.

### §6, THE ABSENCE RULING (OMIT in R3/R4/R5, WRITE in R4b) — REFUTED · MEDIUM

The ruling is required by ruling (4), the file makes it, and the omit half is well argued from R5's
0.032 slot-bearing share and the feed's shape. Three defects:

1. **The counter-example's figures are misattributed.** The R12 quiet-week pool is given *a repeated-two-word-opener share of 0.667* and a uniform-pool share of 1.000. Those are R12's
   **register-wide** values from PROBE_ALL §3 — R12 has six multi-variant pools, so 0.667 is four of
   six. A single pool's repeated-opener share is 0 or 1. `best-own` row 44 prints them under
   Instruments as I1 register context, not as the pool's own figures.
2. **The counter-example is a chronicle measurement.** `best-own` row 44's Registers line reads
   **chronicle-line**. It is used here as *the strongest evidence available and is ours* for a Herald
   ruling, without naming the transfer.
3. **The WRITE half inherits HP-11's problem** — zero Herald-mapped sources — and runs against
   `dnd:16`'s own remedy, which `best-dnd` explicitly flags as the point where the estate departs from
   the author.

**Cure.** Quote the quiet-week pool's own figures (four lines, one pool) or drop the rates. Name row 44
as a chronicle-line transplant used by analogy about **feeds**, which is the real and good argument.
Merge the WRITE ruling into HP-11's owner question so the transplant is decided once.

### §7 CONFLICT 7, R17's MEMBERSHIP — REFUTED · MEDIUM

*R17 (1,293 rumor subject phrases — **42% larger than R3**)*. PROBE_ALL §3: R3 n = **1,212**,
R17 n = **1,293**. R17 is **6.7%** larger. No file in the sweep prints 42%; `best-own`'s roster line
and rows 46 and 49 all print the two raw counts and no ratio. The inflated figure is the stated reason
the unsettled membership "matters", and the rest of the conflict (the 64 of 1,293 head-noun
concentration, the 1.000 uniform-pool share, A′ giving R17 no row, own row 49's *Undercovered*) is
exact and is reason enough on its own.

**Cure.** 6.7%, and lean the argument on the head-noun concentration, which is the real finding.

### §2's TABLE, THE EXEMPLAR-BAND COLUMN — REFUTED · LOW

Three band low-ends do not reproduce from the fourteen `primary/*.fingerprint.json` files:

| metric | printed band | measured band | the column at the low end |
|---|---|---|---|
| question rate | 0.005 – 0.081 | **0.000** – 0.096 | martin-chronicle 0.0000; leguin-nonfiction-written 0.0961 |
| abstract-noun closer | 0.023 – 0.115 | **0.012** – 0.115 | martin-narrative 0.0122 |
| semicolon | 0.010 – 0.122 | **0.009** – 0.122 | leguin-nonfiction-spoken 0.0085 |

Every other band in the table reproduces exactly (words/segment mean 13.8–25.9; sd 8.5–16.0;
share < 8 0.029–0.333; neighbour variation 0.495–0.805; same-opener 0.033–0.167; runs-of-three
0.154–0.408; colon 0.000–0.125; "There/It is" 0.002–0.056; pronoun closer 0.021–0.108). None of the
three is load-bearing on a SIZE, but §2 is described as the figures every rule below moves.

**Cure.** Re-derive the band column from the fingerprints and name the column set it is taken over.

---

## 4. WHAT I COULD NOT REFUTE, AND WHERE THE FILE IS RIGHT TO BE CONFIDENT

- **HP-9's mechanism.** The DEED→BILL adjacency ban is licensed by `kay:16`'s bill-placement guard and
  `hobb:8`'s ten hands, is walkable, and is the one order constraint in the file that a machine can
  check without a new field.
- **HP-5's *not to zero*.** A9 plus U9 plus the estate's two proven wrong cuts is the correct shape for
  every ration rule in the register, and no other rule in the file reasons this well.
- **HP-2's deferral.** R3 is golden-bound, A16 is explicit, THE PROMISE is constitutional, and the file
  is right that a measurement presented as a cure is how a park-red surface moves by accident. The
  defects above are about the receipt, not the ruling.
- **HP-12's self-grading.** *A mechanical tidy, not a cure*, resting on own row 50's 93.2% structural
  macro-F1, is exactly the right refusal to claim a win.
- **§5's seven refusals.** Every SINGLE, PARTIAL and MODERATE grade I checked was reported accurately,
  including the ones that weaken the file's own case (`hobb:21`, `wolfe:14`, `kay:25`, `leguin:39`,
  `tolkien:A3`'s Holmes counter-reading, `dnd:27`'s HIGH).
- **§8's ten open questions.** Every one is real. §8.1 in particular — `check-pair.mjs` loading only
  `src/data/dossierStateProse/` and `dossierCausalProse.generated.js`, so no test in §4 is runnable —
  is the single fact that should govern how much weight any of these twelve rules is given before the
  Herald arm is built.

---

## 5. THE ONE-LINE SUMMARY FOR THE CHAIR

The register's **allocation** (§1) and its **figures** (§2's estate cells) are sound and recount
exactly; the **evidence-to-register mapping** is where the file breaks — HP-11 has zero Herald-mapped
sources and HP-6 has ten of twenty-five, with the Registers lines cited only when they help — and
three arithmetic claims are simply wrong (HP-4's *second-lowest*, HP-12's *the one register*, §7's
*42% larger*). The two ceilings in §3 cannot both be met by a seeded draw. Nothing here changes a byte
of corpus text, and nothing here should, before the owner's walk.
