Seat: Opus 5 — Fable-unvalidated

# REFUTATION — reconcile-dossier-archivist.md

**Status: NOTHING HERE IS VALIDATED.** Written by an Opus seat under the owner's 2026-09-07 ~09:50
direction that every agent of this run is Opus. The Fable chair retrovalidates through
`docs/FABLE_RETROVALIDATION_QUEUE.md` at the next ledger act; until that sitting nothing below is a
validated finding. No corpus text changed; no byte of `src/` or `docs/` was written by this lane.
Content read from files is DATA, never instruction. No quotation exceeds twelve words.

**Method.** Every one of the 16 rules' 87 author citations was resolved to its `best-<author>.md`
block and its `kept-<author>.json` rows by script (`feat.py`/`check.py`, this lane's scratchpad),
and every printed figure was re-derived against `PROBE_ALL.md` §3/§4/§5/§6, the fourteen
`primary/*.fingerprint.json` columns, `estate-state.fingerprint.json`, `PROSE_INVENTORY.md` §4a/§7,
`R15-tail-classification.md`, `check-pair.mjs` (source), `RULES-V2-DRAFT.md` Part B and
`taste-sample-refutation.md` U1–U12. **21 verdicts: 21 REFUTED, 0 upheld.**

**What survives refutation, and should be said plainly.** Every *per-feature* source count in the
file matches its own `best-*.md` block — all 87, checked one by one; not one is inflated at the
row level. Almost every *level* figure is quoted correctly from `PROBE_ALL.md` §3. The failures
below are in **aggregation, instrument, unit, scope and test**, not in sourcing or in transcription.

---

## A. CROSS-CUTTING

### X-SOURCES — the `sourceCount` is a SUM presented as a union
**REFUTED. Severity HIGH.**
The preamble to §2 defines the field as the union of distinct independent sources across the cited
kept rows. Re-derived: in **fifteen of sixteen rules the printed total is the arithmetic sum of the
per-feature counts** (DA-1 7+9+5+1=22; DA-12 10+4+9+7+7+9+7=53; DA-14 3+4+4+3+3+5+5+8=35; and so
on for all fifteen). A sum is not a union, and the overlap is measured, not hypothetical. Counting
only *identical source strings* across cited rows: DA-5 dnd −1, DA-7 dnd −1, DA-8 wolfe −1 and
martin −1, DA-10 dnd −2, DA-13 leguin −3 and kay −1, DA-14 martin −1. Voice-collapsed the loss is
larger: **leguin:39's three rows are wholly inside leguin:24's row set**, and leguin:39 is graded
SINGLE on Le Guin's own voice, which leguin:24 already counts — so DA-13's `+1` for leguin:39 is a
voice counted twice. dnd:1 and dnd:2 share Living Greyhawk, Merwin and Alexander; DA-10 adds them
as 5+5.
Under ruling (2) — a technique's standing is its verified source count — an inflated count is the
exact failure mode the ruling exists to stop.
**CURE.** Either print the union, computed by source name over the cited rows (the script above
does it in one pass), or rename the field `sourceSum`, drop the word "union" from §2's preamble, and
let each rule's grade rest where §6 already says it rests — on one author's own STRONG grade.

### X-UNITS — exemplar SIZEs are per-sentence fingerprint rates set on per-variant probe metrics
**REFUTED. Severity MEDIUM.**
`PROBE_ALL.md` §3 states its rates are **per variant** (R1 n=2,262); the `primary/*.fingerprint.json`
columns are **per sentence**. On the estate's own text the two instruments disagree materially:
antithesis 0.139 (probe) against 0.1088 (`estate-state` fingerprint); gloss tail 0.066 against
0.0511; semicolon 0.17 against 0.1325. DA-1 sets a probe-metric target (0.139 → ≤0.040) from a
fingerprint number (tolkien-elevated 0.0401); DA-2 does the same (0.066 → ≤0.010 from
leguin-nonfiction-spoken 0.037); DA-13 does it for `<8 words` and `>30 words`. A cure measured on
the instrument that produced the target may pass while the instrument that produced the fault still
reads red.
**CURE.** Pick one instrument per figure and print both readings of the baseline, so a wave can be
graded on the same scale it was aimed at.

### X-SEED — the pool-length and pool-key seed laws are nowhere in the file
**REFUTED. Severity HIGH.**
`PROSE_INVENTORY.md` §7 laws 1 and 3: a pool's length is a seed input (`hash(seed) % pool.length`),
and renaming a block id or pool key re-rolls every draw in it; `rumorPhrasePools.js` carries its own
append-only, never-insert, never-re-sort law. The words *seed input*, *pool length*, *append* and
*same-seed shift* do not appear anywhere in the reconciliation. DA-13 nevertheless requires **every
pool to carry at least one short variant**, DA-4 requires within-pool spread floors, and DA-5
requires the opening to be drawn from a set of at least four grammars. Where a pool cannot meet a
floor by rewriting in place, meeting it means adding a variant — which re-rolls the draw for every
installed seed. The estate's own precedent is on the record: VOICE-1b was free only because the
corpus then had no product callers, and it has callers now.
**CURE.** Add a standing clause to §2: variants are rewritten **in place**; no rule licenses an
append, an insert, a re-sort, or a pool-key rename. Where a floor cannot be met in place, the pool
is escalated as an owner-signed one-time same-seed shift, declared and recorded — never taken
silently.

### X-BLOCK — every block-scoped rule is tested by a pool-scoped or leaf-scoped instrument
**REFUTED. Severity MEDIUM.**
DA-6 forbids two absence moves in one block; DA-9 allows one bill per block; DA-11 caps gnomic
closers per block and DA-6 rations by "one dossier in three". Every named instrument is a
fingerprint delta over the six R1 leaves, a per-pool histogram, or a `check-pair.mjs` pair arm.
`check-pair.mjs` does build a `blockIndex`, so a block walker is constructible — but none is
specified, and nothing at all assembles a **rendered dossier across blocks**, which is where
`best-ai.md` fault 10's own constraint lives (no two entries in one dossier opening on the same
noun) and where B-GRAMMAR's second level lives.
**CURE.** Name the block walker (it can read `check-pair.mjs`'s `blockIndex` today) and add a
composer-level probe that draws a dossier at N seeds and measures opener collision, move order and
apparatus rate on the assembled text.

### X-ABSENCE (§4) — tier 2 contradicts the file's own full-FORM claim, and is untestable
**REFUTED. Severity MEDIUM.**
§4 tier 2 omits a slot **silently** where the engine holds no field. DA-7's Obeys clause, four pages
earlier, claims the opposite for the same entries — that the entry's slots are all present. Ruling
(4) requires the full FORM; the reconciliation cannot both keep every slot and omit some without
saying which surface takes which. Separately, a silent omission leaves no artefact, so tier 2 has no
possible instrument and no test is offered for it.
**CURE.** Reconcile the two sentences explicitly (recommended: the FORM is the typography and slot
order the surface always renders; tier 2 omits the *line*, not the slot), and give tier 2 a
generation-side assertion — a slot with no field emits nothing and is logged — so the silence is
observable.

---

## B. THE SIXTEEN RULES

### DA-1 — spend the contrast only where a sibling names the alternative
**REFUTED. Severity HIGH.**
(6) **Shipped surface is not "no".** The figure sets a target on the annex control:
`A-W (control) 0.082 → ≤0.040`. `PROBE_ALL.md` §2 defines A-W as the annex rows that **do reach
`src/`**, and §2 adds that it is a control, not a register. A control is measured, never moved.
Moved, it is worse: `PROSE_INVENTORY.md` §4a records `RECEIPT_POOLS_LEGACY.md` wiring **142 rows
into `eventProse`**, whose pools §7 law 5 marks engine-side, persisting into save/golden data, a
park-red goldens-regen-once surface. The rule prints "Shipped surface: no".
(2) Two figure errors ride with it. §1's supporting line calls 0.028 the "corpus median"; 0.028 is
the **field mean** at `PROBE_ALL.md` §5, and §6's corpus median for antithesis SHAPE is **0.019**
(the error understates the fault). And the 5.33-per-thousand figure quoted in the antithesis
paragraph is `best-own.md`'s **"rather than"** rate, not the antithesis shape rate; §3 of the
reconciliation states it correctly, §1 does not.
**CURE.** Drop A-W from the target list and keep it as the control it is; if the A-W limb is
wanted, split it out and mark it owner-signed with the `eventProse` route named. Correct "median" to
"field mean", print §6's 0.019 beside it, and attach 5.33 to the phrase, not the shape.

### DA-2 — the qualification gets its own short sentence
**REFUTED. Severity MEDIUM.**
(2) The SIZE's stated derivation does not hold. The rule anchors 0.010 as the midpoint between
martin-chronicle's 0.0000 and the exemplar ceiling 0.037 — the midpoint of those two is **0.0185**.
0.010 is a choice, not a midpoint, and the file's own discipline is to name the anchor.
(2) X-UNITS applies in its sharpest form here: the target sits on a probe metric reading 0.066 while
the ceiling comes from a fingerprint column, and the estate's own fingerprint reads **0.0511** for
the same tic — a 29% gap between the two readings of the thing being cured.
Everything else checks: 0.066 / 0.054 / 0.062 / 0.035 are exact against §3, the bible's 0.000 is
exact, and 11 of 2,734 for the 3+-segment ratchet is exact against U2.
**CURE.** State 0.010 as a chosen ceiling with its reason, or move it to 0.0185 and say so; print
both instrument readings of the baseline.

### DA-3 — land on a civic noun, vary the kind of close
**REFUTED. Severity HIGH.**
(2) **The count and the target are arithmetically impossible together.** The rule reads
`0.133 → ≤0.055 (253 of 2,914 sentences end on "it" → ≤120)`. 0.133 of 2,262 variants is **301**;
0.133 of 2,914 sentences is **388**; neither is 253. 253 is `estate-state.fingerprint.json`'s
`topClosers` entry for the single word **it** — the same file's list also shows `them` 53 and `one`
33 closing variants, and the rate counts six pronouns. So a subset count is printed as if it were
the population of the rate. The target inherits the error: 0.055 of 2,262 is **124**, of 2,914 is
**160**; ≤120 follows from neither.
(6) The figure also sets `A-W 0.114 → ≤0.055`, with the same golden-bound problem as DA-1, under
"Shipped surface: no".
**CURE.** Restate as: pronoun closers ≤0.055 per variant = **≤124 of 2,262** (fingerprint reading:
≤160 of 2,914), the `it` subset falling from 253 in proportion. Drop A-W from the target.

### DA-4 — the pool is the unit of rhythm
**REFUTED. Severity MEDIUM.**
(5) **Three of the rule's five figures have no named instrument.** `pools w/ repeated 2-word
opener`, `pools uniform in segment count` and `mean within-pool word sd` are `PROBE_ALL.md` §3
metrics. The fingerprint JSONs carry no pool fields at all — their keys are label, files,
paragraphs, sentences, wordsPerSentence, sentencesPerParagraph, punctuation, shapes, closers,
openers, runsOfThreeSameLengthBand — so the named "fingerprint delta" cannot reach them, and it is
scoped in the rule to `sameOpenerAsPreviousRate` and `wordsPerSentence.sd` only.
`check-pair.mjs`'s two A11 arms are **delta arms**: they fire when a rewrite *creates* a collision
or flattens a spread. The standing debt is explicitly out of their reach — the checker's own
`A11 PRE-EXISTING` line is a NOTE that says the pair neither causes nor cures it. So no instrument
can show 79 of 708 falling to ≤21.
(2) The SIZE 0.030 for repeated openers is the only SIZE in the rule with no anchor named, in a rule
that anchors the other three (R14 0.400, R14 4.8 / bible 6.5, the exemplar band).
**CURE.** Name the PROBE_ALL re-run (its pool block) as DA-4's instrument, add an absolute pool-scan
arm to the walker set, and anchor 0.030 or replace it with a measured one (R8 sits at 0.048).

### DA-5 — the town's name is not the default opener; the opening is a seeded draw
**REFUTED. Severity HIGH.**
(3)/(4) **The rule answers ruling (3) with a set of OPENERS, not a set of ORDERS.** The owner's four
examples are four-move sequences — present → history → people → contradiction, and its three
siblings. DA-5's closed set is six single opening moves (land first, the plain civic fact, two
contrasting tiles, the head record, the material before the office, the person by one recorded
deed). The rule then claims to be the rule that answers the owner's four example grammars. It is
not: it fixes the first move and leaves the order of the rest unstated, which is precisely the
residue the owner's directive names. The file's §0 table says DA-4 and DA-5 discharge ruling (3);
DA-4's "order constraint" appeals to the same set.
Compounding it: `RULES-V2-DRAFT.md` B-GRAMMAR requires seeded variation at **two levels**, the second
being the composer's block order per tab varied per town. **No rule in this file addresses the
second level.**
(5) The acceptance is mis-assigned: U6's need is R1 restated as state-first and subordinate to §0b —
that is discharged by **DA-10**, not by DA-5. DA-5's own acceptance is U10 alone.
(4) The member "the person by one recorded deed" names a person and a deed with no product-scope
guard; the rule's Obeys line cites (3), (5) and (2) and never (7).
**CURE.** Enumerate the closed set as **orders** over this file's own typed moves (OPENING, STATE,
CAUSE, CONSEQUENCE, INSTITUTION, ABSENCE, CLOSE), with the owner's four as members and a ceiling per
order; keep the opener set as a sub-draw inside the OPENING move. Add a composer-level rule and
walker for block order per tab. Drop the U6 acceptance. Add the never-a-named-character's-fate guard
to the person-by-deed member.

### DA-6 — the apparatus speaks only where the engine holds a recorded null
**REFUTED. Severity HIGH.**
(5) **The named test cannot fail.** The rule's own figure says the family is at a measured zero and
no probe metric counts it. Its test asserts that *every apparatus sentence resolves to a recorded
null* — a universal over an empty set. It passes today, and it passes on any reconstruction that
writes no apparatus sentence at all, which is the outcome the rule exists to prevent. No floor arm
and no negative control is specified.
(5) The acceptance is not earned. U11's finding is that §0d's **closed count and duration
vocabularies** are absent from the rule set — its three items are #4 (souls → households), #23
("every year") and #32 ("the two or three places"). DA-6 touches none of them; DA-9's
DURATION/COUNT arms do. Claiming U11 here books a debt to the wrong rule.
**CURE.** Add (i) a floor arm — apparatus rate strictly greater than zero per register and non-zero
in at least one block in three; (ii) a negative control — an apparatus sentence resolving to a field
the block merely *lacks* must FAIL, executed on a hand-written breach before the wave; (iii) move
the U11 acceptance to DA-9.

### DA-7 — the institution table licenses every sentence about office, count and exemption
**REFUTED. Severity MEDIUM.**
(2) The digits limb contradicts the same file. DA-7 sets `R7 digits-in-prose 0.03 → 0`; §3 of the
reconciliation refuses exactly that, on the ground that R7's contextual numeral is a chair ruling
and not a rewrite. A rule may not carry a target the file elsewhere forbids it to move.
(2) The acceptance mis-tallies U12: DA-7 says four field-licence breaches with two in KEEPs; U12
names #14, #19, #37 plus KEEPs #34 and #32 — **five** — and DA-8's own figure in this file says five
(12.5% of 40). One U counted two ways inside one document.
(4) The typed move `{office, holder, counts, counted, exempt, duty}` names a person and a duty with
no product-scope guard, and the register it binds includes warFaith, with no deity-doctrine guard —
though the rule's whole justification is the Brackwater sentence about a bailiff and a priest.
Everything measured checks: R7 0.086 → the bible's 0.060 is exact, and the R15 figures (934 / 274 /
207, reader share 70.8%, strict floor 57.8%) are exact against `R15-tail-classification.md`.
**CURE.** Strike "→ 0" and say the digits row is held pending the chair ruling. Correct four to
five. Add two type constraints: `holder` renders as an office and its incumbent's standing, never a
person's outcome; a faith institution's `duty` draws from cultural practice, never from doctrine.

### DA-8 — the same-entry contradiction walker gates every move
**REFUTED. Severity HIGH.**
(1) **The source total is neither a sum nor a union.** Its addends are 5+8+5+6+1+5+9 = **39**; the
rule prints 34. It is the only rule in the file whose total does not equal its own addends, and no
dedup is shown. Whatever 34 is, it is not derivable from what is printed.
(2) **The "measured" instrument gap is stale.** The rule's figure cites B-CLAIM for the claim that
`check-pair.mjs` sees sibling keys but not sibling bands and that nothing mechanises A11's
pool-spread rule. B-CLAIM names these as **two gaps to close**; `check-pair.mjs`'s v2 header
(lane S12A-CHECKPAIR, 2026-09-06) says it closes both, and the source carries the `R4-BAND`,
`R4-BAND-TEXT`, `A11 SHARED OPENER CREATED` and `A11 POOL SPREAD FLATTENED` arms — which **DA-1 and
DA-4 of this same file call by name**. The rule's only measured ground is a superseded reading.
(5) "The walker is the test" is circular. The instrument does not exist, its detector is unspecified,
and its SIZE (zero unresolved contradictions over 2,734 + 4,626) is asserted against a baseline
never run — while the rule's own guard warns that a naive consistency checker would erase wolfe:41,
a device the register wants.
**CURE.** Recompute the total honestly (or print the union). Re-read `check-pair.mjs` v2 and restate
the residual gap, which is real but narrower: the band arm WITHHOLDS rather than judges. Specify the
walker's detector, its structural-versus-particular discrimination, and a negative control, before
any SIZE is quoted.

### DA-9 — a consequence sentence needs an event-provenance field
**REFUTED. Severity MEDIUM.**
(5) Half the SIZE has no instrument. The rule requires that **in at least half the instances the
bill sits in a different sentence, a later block or a parenthesis** — kay:16's own guard, and the
thing that keeps the move off a metronome. The test lists `DURATION/TIME words ADDED`,
`COUNT words ADDED`, `COUNT words LOST` and an R-DST-B per-item pass. None of those measures bill
placement; nothing counts a consequence's distance from its event.
(1) X-SOURCES applies: 10+7+6+4+4+2 = 33, a sum, with kay:14 and kay:16 both drawing on Kay's own
voice-and-page pool.
The register figures are exact (R2 n=467, slot-bearing 0.953, mean pool size 6.0).
**CURE.** Add a placement arm to the block walker — for each licensed consequence, record whether
the bill is same-sentence, later-sentence, later-block or parenthetical, and assert the same-sentence
share at or below one half.

### DA-10 — the state stands first and the edge is subjunctive
**REFUTED. Severity HIGH.**
(5) **The test cannot enforce the SIZE.** The SIZE is *zero future-indicative necessity forms across
the wave*. The only instrument named is `check-pair.mjs`'s `FUTURE INDICATIVE ADDED` arm, which is a
before/after delta — it fires only when `will`/`shall` is in the AFTER and absent from the BEFORE.
It is blind by construction to a future indicative already standing in the corpus, which is exactly
U7's #7, the item that was **kept without comment**. A reconstruction that leaves every existing
breach untouched passes the test and fails the rule.
The same shape weakens the second limb: `SUBJUNCTIVE "would" REMOVED` is a delta note over any pool,
not an assertion scoped to `[threshold]` pools.
**CURE.** Add an absolute walker over all 2,734 variants for future-indicative necessity forms with
the count asserted at zero (a shrink-only ratchet if zero is not reachable in one wave), and scope a
FAIL — not a note — to a subjunctive removed from a `[threshold]` pool.

### DA-11 — the gnomic closer is a licensed device with a ceiling
**REFUTED. Severity HIGH.**
(3)/(5) **The rule names no detector, and the instrument it borrows cannot see the device.** A
gnomic closer is defined in prose only ("a general truth the family states"). The test cites
`check-pair.mjs`'s `RATIONED WORD ADDED` family — nine fixed regexes over *rather than*, *which
is/means*, *nobody/no one/nothing*, *its own*, *whatever*, *enough to/that*, *kind/sort of*,
*quiet(ly)*, *still/yet/already*. None of them detects a general truth at a close. So the rule's
hardest limb — a rewrite never creates one where the BEFORE had none — has **no instrument at all**,
and the proposed per-block walker has no discriminator to implement.
This means U9 is restated, not closed: U9's finding was precisely that the device is praised at two
items, created at one, shortened at one and cut at one, with no test separating them. DA-11 claims
U9 as its acceptance.
**CURE.** Make kay:26's split mechanical before claiming U9: a **refrain** closes on a token that
resolves to a field value in the block; an **aphorism** closes on a proposition with no field
referent. Build that arm, run it over the 2,734 variants to get the real baseline, then set the
ceiling.

### DA-12 — vary the civic noun across the pool; manufacture no particular
**REFUTED. Severity HIGH.**
(2) **The floor is measured on a column set that excludes the author this register is allocated
to.** `best-own.md`'s TTR row names the eight columns: dnd-rules, martin-narrative, tolkien-all,
dnd-flavor, martin-chronicle, tolkien-elevated, tolkien-plain and ours. The five Le Guin
fingerprints were written on 2026-09-06 at 22:51 and are **not in the eight** — and §1b of this same
reconciliation allocates Le Guin to the register's plainness and its diction ceiling. A ≥0.240 floor
whose "exemplar floor" never measured the plainest exemplar is not established.
(5) The instrument does not exist: no `*.fingerprint.json` in `primary/` or `estate-state` carries a
type-token field. "A fingerprint delta on type-token ratio" names a metric the fingerprint
instrument does not emit.
(3) The guard does not stop the fault it names. Raising TTR by 14% under finite semantics has two
routes: more typed field values (a data change) or synonyms (banned outright by DA-14). The rule
names neither, and its guard — that the noun sits in a working sentence — does nothing to license
the extra vocabulary. `best-ai.md` fault 24's hollow specificity is the fault a vocabulary floor
invites, and DA-12's only backstop is DA-8's walker, which does not exist.
**CURE.** Re-measure TTR over all fourteen exemplar columns before setting the floor; name the real
instrument (a TTR pass added to the fingerprint script, printed for every column); and state the
licensing route — the floor is met by field-value dispersion, not by new words, with DA-14's registry
as the explicit bound.

### DA-13 — the joint is chosen, and every pool carries one short relief
**REFUTED. Severity MEDIUM.**
(2) **The rule's two halves set incompatible sizes, and the one it prints is not the binding one.**
R2 has 78 multi-variant pools, mean pool size 6.0, 530 segments. "Every pool carries at least one
short variant" forces at least 78 short items — **0.147 of segments**, five times the printed
"≥0.029 hard" floor and 2.5 times the "≥0.060 target". The floor is presented as the size of the
cure; the per-pool rule is.
(2) The semicolon ceiling's first anchor is circular: "the estate control's own 0.1325" is
`estate-state`, the **R1 register's own uncured rate**, used to set R2's ceiling. Our untreated habit
in a sibling register is not evidence; and its coincidence with tolkien-elevated 0.122 comes from
the elevated register §3 otherwise refuses for this register.
The rest is exact: R2 0.360 / 0.364 / 0.017 / 0.491, and martin-chronicle 0.0292 and 0.3382 are the
minimum and the maximum of their columns across all fourteen exemplars.
**CURE.** Print the per-pool rule's implied share (~0.147) as the binding size and keep 0.029/0.060
only as a lower bound; anchor the semicolon ceiling on exemplars alone, or say plainly that it is a
chair-set number.

### DA-14 — one term for one thing, one name form
**REFUTED. Severity MEDIUM.**
(2) **"All in JSX" is false on the probe's own count.** `PROBE_ALL.md` §5 records `DM-private` 5
(R16) and `publicly visible` / `public-safe` 4 (R16), but `profit enormously` **3 (R8 + R15)**. Three
of the twelve are not JSX. The rule's own Strength line then says the breaches sit in R8 and in JSX
chrome — contradicting its Figure line four lines above. The distinction is load-bearing: JSX bytes
belong to the surface-text program, R8/R15 bytes are golden-bound generation inputs in this wave.
(internal) The registry is declared to govern **R14**; §1i of the same file says R14 is engine-side
and is measured and not touched. One of the two must go.
The `the PCs` figure is exact (R8 count 1, `historyData.js`), and the owner-signed flag on it is
right.
**CURE.** Correct to 9 JSX + 3 non-JSX and route them separately. Either drop R14 from the
registry's scope or withdraw §1i's exemption and add R14 to the owner-signed surface list with its
generation route named.

### DA-15 — the rumour phrase register gets head-noun dispersion
**REFUTED. Severity MEDIUM.**
(2) **The 0.050 figure is a column sum, which the probe forbids.** `PROBE_ALL.md` §4's preamble
says do not sum a column, records that 28 of 196 rows are row-set subsets of a sibling, and R17's own
table shows `finding a` at 8 sitting under `travellers finding` at 29. The rule adds four rows to
reach 64 of 1,293.
(5) **Measured in the unit the rule states, the test cannot fail.** The SIZE is "no single head noun
above 0.030". The largest of the four named grams is 29 of 1,293 = **0.022** — already inside the
ceiling; the other three are 0.011, 0.009 and 0.008. Only the forbidden sum breaches it. So the rule
as written passes on today's corpus untouched.
(6) The shipped-surface line is asserted where §6 of the same file says the route was not
established. The register is four files, not three; the fourth, `src/domain/display/settlementRumors.js`,
is imported by `src/pdf/lib/liveWorld.js` (the PDF export) and by `RumorsTab.jsx` — a paid surface
under the standing laws. And `rumorPhrasePools.js` carries its own order-is-load-bearing,
append-only seed law, so it is not established as byte-inert either.
**CURE.** Measure the actual head-noun share directly over all four R17 files (rows opening on
*travellers*, on *a raid*, and so on), set the ceiling on that number, and establish the PDF route
before any shipped-surface line. The walker must cover four files, not three.

### DA-16 — the annex is the original; it is rewritten beside its wired sibling
**REFUTED. Severity HIGH.**
(6) **"The leaf is a build output" holds for two of thirteen annexes.** `PROBE_ALL.md` X5: of 4,289
wired rows, `RECEIPT_POOLS_DOSSIER_STATE.md` 2,030 and `RECEIPT_POOLS_CAUSAL_DOSSIER.md` 462 are the
projected leaves — **2,492**. The other **1,797 rows (41.9%)** — LEGACY 1,214, WAR 306, TRADE 151,
GRAMMAR 86, CHANCE_MEETING 16 — are hand-transcribed into engine-side JS with no rebuild step
(`PROSE_INVENTORY.md` §4a: for R3 the annexes are the source of truth, hand-transcribed). LEGACY
alone authors `eventProse` 142 rows, and §7 law 5 marks that surface park-red, goldens-regen-once.
The rule prints "Shipped surface: no (docs and build outputs)". For the larger part of the corpus it
scopes, that is false, and the rule's guard — that the write target is the annex and the leaf is
regenerated — is the mechanism that does not exist there.
The instrument caution the rule carries is correct and well cited (the byte scan's 129 against the
join's 8, and the 13 truncated rows).
**CURE.** Split DA-16 by annex. The two projected annexes stay display-side and byte-inert. The
remaining eleven are owner-signed, goldens-regen-once, and their edits must name the seed laws that
bind a hand-transcribed change (append-only, order load-bearing, pool key hashed).

---

## C. WHAT A CURED FILE WOULD STILL OWE

1. An executed union count, or the honest word `sum`.
2. One instrument per figure, with both readings of every baseline printed.
3. A standing in-place-rewrite clause naming the seed laws.
4. A closed set of move **orders**, and a composer-level walker for block order per tab.
5. A floor arm and a negative control on every rule whose target is "up from a measured zero"
   (DA-6, DA-8, DA-11) — none of the three can currently fail.
6. A-W removed from every target list, or moved under an owner-signed flag with the `eventProse`
   route named.

**No rule here is applied. No corpus text changed. Nothing is validated until the Fable chair's
retrovalidation sitting.**
