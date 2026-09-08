Seat: Opus 5 — Fable-unvalidated

# REFUTE — chrome-and-compendium (CC-1 … CC-15)

**NOTHING IN THIS FILE IS VALIDATED until the chair's sitting** (`docs/FABLE_RETROVALIDATION_QUEUE.md`).
Opus 5 refuter pass over `sweep/reconcile-chrome-and-compendium.md`, written 2026-09-07. Every figure
below was re-derived by executing the estate's own instruments or by reading the cited row out of
`kept-<author>.json`; nothing is asserted from the reconciliation's own text. No quotation exceeds
twelve words. No product byte was changed; three product files were READ (`git show HEAD:`) to test
claims the reconciliation makes about them, because the reconciliation states it opened none.

**Result: 15 of 15 rules refuted on at least one ground; 4 at HIGH severity.** Two of the four HIGH
findings are the same class — a SIZE set against a syntactic detector that cannot see the
distinction the rule turns on — and both are CONFIRMED by execution, not argued.

---

## 0. WHAT WAS EXECUTED

| # | what | how |
|---|---|---|
| E1 | every cited `kept-<author>.json` row set for CC-1 … CC-15 | loaded by index, `source`/`url` collapsed by the seat's own convention |
| E2 | the four D&D/exemplar fingerprints | `primary/*.fingerprint.json` read directly |
| E3 | PROBE_ALL §3 table, §4 tic tables, §5 Axis A/B, §6 outliers, the R-/P- corrections | read in full |
| E4 | `metrics.mjs` — the definitions of `secondSentSummary` and `abstractCloser` | source read (lines 71, 84) |
| E5 | R10's four source files at HEAD, run through those two definitions | `git show HEAD:` + the probe's own `segments()` splitter |
| E6 | `check-pair.mjs`'s corpus loader and arm gating | source read (lines 16–33, 106–121) |
| E7 | the vague-authority and hedge greps CC-6 names | `git grep` over `src/copy/*.js` and `src/**/*.jsx` at HEAD |
| E8 | second person in R10's source files | `git show HEAD:` + grep |
| E9 | how the docent is rendered | `CatalogTabs.jsx`, `SurveyorGlossary.jsx`, `catalogData.js` read at HEAD |

**Reproduction quality for E5.** The reconstruction of R10 from its four HEAD sources yields 468
admitted rows against the probe's 505 (−7.3%) and 626 segments against 665 (−5.9%), giving
`secondSentSummary` **0.066** against the published 0.063 and `abstractCloser` **0.104** against the
published 0.114. Close enough that the COMPOSITION findings below carry; not a re-publication of the
rates.

---

## 1. THE FOUR HIGH FINDINGS

### H1 (CC-12) — the docent's "top fault" is 74% the licensed mechanism sentence. CONFIRMED.

`metrics.mjs:84` defines the metric in full:

```js
if (ss.length >= 2 && /^(That|This|It|Which)\b/.test(ss[1])) shp.secondSentSummary++;
```

It is a syntactic test on the second sentence's first word. It cannot tell a gloss from an undo path.

Executed over R10's four HEAD sources: **31 hits, of which 23 (74%) name an undo, revert or option
path** — `It can be undone with the map undo.` (11), `It can be undone with Undo last pulse.`,
`It can be reverted to the raw text.`, `It can be reversed with Revert a manual edit.` and the rest
of that family. The remaining 8 are also mechanism sentences (`It can be reloaded from the cloud.`).

CC-12 licenses exactly these and forbids cutting them — its own worked example is the map-undo
sentence — and then sets **SIZE 0.063 → ≤ 0.024**, which requires removing or rewording roughly 20 of
the 31. There are only two ways to hit the number: delete licensed undo paths, or move the second
sentence's first word (`The map undo reverses it.`), which moves the rubric column and leaves the
prose identical. That second route is U4's failure mode named in the reconciliation's own inputs.

The stated guard ("U9 executed per entry") is a human review question; the stated TEST is the numeric
row. A guard that lives outside the instrument cannot stop a size stated against the instrument.

**Cure.** Withdraw the size. Either (a) hold R10's rate and print "none measured" until a classifier
exists that exempts a second sentence naming a registry field, or (b) re-measure the rate with the
undo/option family excluded and set any size against THAT number. Also: the rule's stated components
(Wolfe 10 + Hobb 4 + Le Guin 8 + ai 14 + Kay 3) sum to 39, not the printed 38.

### H2 (CC-13) — the abstract-closer figure counts the registry nouns the rule demands. CONFIRMED.

`metrics.mjs:71` defines the metric in full:

```js
if (/(ness|tion|sion|ity|ment|ance|ence|ship|hood|dom)$/.test(l)) abstractCloser++;
```

A morphological suffix test on the last word. Executed over R10's four HEAD sources: **65 hits, of
which `settlement` 18 and `session` 10 — 28 (43%) — are the two most concrete registry nouns in the
product**, followed by `governance` 3, `presence` 3, `membership` 2, `placement` 2, `enforcement` 2,
`deletion` 1, `version` 1, `migration` 1.

CC-13's statement is that an entry must close on "a thing the registry holds … not an abstraction",
and it names three abstractions to avoid. **None of the three is counted by the metric** — none
matches the suffix list. So the rule's DOWN direction (0.114 → ≤ 0.088) drives entries AWAY from
`settlement`, `session`, `option` and `relationship` — the exact nouns the rule requires — and does
nothing at all about the abstractions it names. The figure contradicts the statement.

**Second defect in the same rule.** CC-13 cites `dnd-flavor 0.021` for the abstract closer.
`primary/dnd-flavor.fingerprint.json` gives `abstractNounRate` **0.077**; **0.0213 is that column's
PRONOUN closer rate**. The reconciliation's own §2 table prints 0.077 for the same cell — so the file
carries two numbers for one quantity, and the wrong one is the one the size is argued from. Corrected,
the documentation band is 0.077 (flavor) – 0.088 (rules) – 0.115 (srd52), and R10's 0.114 sits inside
it rather than above it.

**Cure.** Withdraw the size; correct dnd-flavor to 0.077 at the rule; if a closer rule is wanted,
build a classifier over the registry's own noun set and state the rule against that.

### H3 (CC-10) — the named test cannot fire on this register. CONFIRMED.

`check-pair.mjs` builds its corpus from two homes and no others (lines 16–33):
`src/data/dossierStateProse/*.generated.js` and `src/data/dossierCausalProse.generated.js` — R1 and
R2. The A11 arms CC-10 names are both inside `if (h) { … }` (lines 109, 120), where `h` is the lookup
into that corpus. On any R9/R16 pair the tool reports `NOT LOCATED in the dossier corpus
(state+causal)` (line 65) and **POOL SPREAD FLATTENED and SHARED OPENER CREATED never run**. The
test as written passes on every possible reconstruction of chrome.

Two further defects in the same rule:

- **The SIZE rests on four pools.** "toward the bible's own 0.250" — the bible column has 4
  multi-variant pools (§3), so 0.250 is one pool. The reconciliation flags the small-n honestly for
  R9's four pools and does not flag it for the bible's four in the same paragraph.
- **The multiple is the uncorrected one.** §0.5 states the file obeys [P-3]; [P-3] re-prices R16's
  repeated-opener ratio **4.27× → 3.79×** and the pools-uniform median 0.672 → 0.714 (so 0.242 is
  0.339×, not 0.36×). §2 and CC-10 both print the uncorrected pair.

**Cure.** Name the instrument that is owed (a chrome-pool arm for `check-pair.mjs`, or an extension of
its loader) instead of citing an arm that cannot see the register; set the spread target from R16's
own measured distribution; carry [P-3]'s corrected ratios wherever the file claims to obey [P-3].

### H4 (CC-3, and §3's exception, and CC-14's boundary) — "read one entry at a time" is false for the docent's largest surface. CONFIRMED.

CC-3's guard against fault 9 is not a stop; it is a licence. The rule fixes the docent's frames,
declares them not tics, and sets the direction on their rates to NONE with an explicit note that a
drop after a rewrite is a defect. The whole defence is `own:48`'s clause that the entries are read
one at a time, and §3 bounds the lapse to one page (`CatalogTabs.jsx`, 39 sentences).

Read at HEAD, `src/domain/compendium/catalogData.js` — one of R10's four named source files — holds
two arrays and nothing else: `REL_TYPES` (8 entries, each with an `effect` sentence pair) and
`ARCHETYPES` (**30** entries, each with a `desc` sentence pair). `CatalogTabs.jsx` renders them
through `.map()` as row lists, alongside a dozen further `.map()`ed reading lists (tiers, terrain,
routes, threat levels, ladders, faction archetypes, governance labels, transfer causes, corruption
vectors, faith axes, cultures, stress, relationships). Every one of those puts N sibling entries in
the same shape on ONE page. The one-entry-at-a-time path that does exist — `SurveyorGlossary.jsx`'s
popover — is a different surface.

So the premise the licence rests on is contradicted by the code, and the reconciliation could not
have known: it states no product file was opened. The consequence runs through three places —
CC-3's guard, §3's exception, CC-14's boundary — and through **§6**, which rules that the docent's
absence line "may be identical every time, because the docent's template is licensed". Thirty
identically-shaped `desc` pairs down one page, with an identical "No undo." in the same slot, is
ruling (3)'s named outcome, not its exception.

**Cure.** Measure the render surface per docent source file before ruling on the template: the
licence holds on the popover path and lapses across the catalog tabs. Then re-price §3's exception,
CC-14's boundary and §6's identical-absence permission against that measurement.

---

## 2. THE REMAINING RULES

### CC-1 — REFUTED (HIGH). The docent's second-person zero is not measured, and is false at HEAD.

CC-1 states "second person: … 0 in R10 (`own:56`)" and holds the docent's zeros. **`own:56` does not
list R10.** Its measured zeros are R1, R2, R3, R5, R6, R17, A-U and A-W. R10 is absent from the row,
and §3's table carries no second-person metric at all — so the figure was never measured.

At HEAD, R10's own source files carry it in reader-facing prose:

- `src/store/operationRegistry.js:280` (`description:`) — the auto-resolve entry, ending "…those decisions wait for you."
- `src/domain/compendium/bandLadders.js:220` (`blurb:`) — "Not a dial you set. An output you read."
- `src/domain/compendium/bandLadders.js:224` (`blurb:`) — "These are the states you will see."

All three clear the probe's admission predicate and would be admitted into R10. The third is also a
future indicative in the docent, which CC-8 bans and whose HOLD figures do not record it.

Consequently CC-1's shipped-surface flag — "no — a hold" — is wrong: applied, the rule cures three
shipped docent strings.

**Also (1):** the source line reads "Martin critics 6" for item 22. The four cited rows
(`martin:0, 7, 497, 505`) are two blog posts by **one** critic (Simon, Books & Boots). Under the
file's own convention that is 1 voice, at most 2 pages — not 6. The union total of 36 survives by
coincidence (the tolkien C5 rows are Le Guin and Ostadan, 2, correctly labelled), but the composition
as printed is wrong.

**Cure.** Add a second-person row to I1 and measure it per register; state R10's true rate; flip the
shipped-surface flag to YES; recount Martin at 1–2 and restate the union.

### CC-2 — REFUTED (MEDIUM). The arithmetic, the scope, and a figure the probe rules is not a breach.

1. **The count contradicts itself.** The stated components — D&D 8, Hobb 4, Martin 5, Kay 3 — sum to
   **20**, and the rule prints **18**. My recount of the cited rows under the file's own collapsing
   convention gives ~21 (D&D 9, Hobb 4, Martin 5, Kay 3). The rule is STRONG on any of the three
   numbers; the printed one is not derived from its own parts.
2. **The figure reaches outside the register.** "the twelve registry breaches go to zero", and the
   shipped-surface line says "9 JSX strings and 3 world-data/long-tail strings". The 3 are
   `profit enormously` in **R8 + R15** — and the same file's §7 conflict 9 says R8 is "not this
   register's to cure". The rule proposes a cure its own conflicts section disclaims.
3. **`supports/enables/attracts` 72 is not a breach and is not here.** `own:55` and PROBE_ALL §5 both
   classify the 72 as "a preference", explicitly **not** a breach. At HEAD the three verbs occur 57
   times across `src/**`, and **zero** times in any of R9's four copy files or in
   `operationRegistry.js`; in JSX the hits are a code comment (`Pill.jsx:18`), an eslint directive
   (`DossierTabStrip.jsx:17`) and a data key (`Dependencies.jsx:22`), with one prose instance
   (`HowToUse.jsx:277`). The rest live in generators and data files — R8/R14/R15/R18. The direction
   is imported from other registers and cannot be executed in this one.

**Cure.** State the breach count as 9 (R16) for this register; route the 3 R8/R15 strings to their own
reconciliations; drop the 72 from CC-2 and CC-3, or locate it per register first and put it where it lives.

### CC-4 — REFUTED (MEDIUM). The size is stated against a detector that cannot see it.

The counts verify: ai fault 1 collapses to **14** documents (19 source strings, minus 3 for the
`Signs of AI writing` family, 1 for StoryScope, 1 for tenfootpole), D&D across items 15/14 gives
**9**, Le Guin **3** — the printed 26 is right.

The figure is not. SIZE is "0 in R9 and R16 for a second sentence that RESTATES the first", and the
instrument is `secondSentSummary` (H1): the second sentence's first word. Restatement is not what it
measures. As written the target is met by rewording an opening pronoun, and the rule's own honest
"none measured" for the position walker is the right label for this row too.

**Cure.** Set no size until the restatement classifier exists; print the row as "none measured" and
hold the rate.

### CC-5 — REFUTED (MEDIUM). The components do not sum, and the licensing column is uncorrected.

1. **Arithmetic.** The stated components (D&D 10, Wolfe 5, Le Guin 9, Hobb 3, Tolkien 5, Martin 7)
   sum to **39**; the rule prints **36**. My recount of the cited rows gives ~39 as well
   (Wolfe collapses to 6, Tolkien to 6, Martin to 6 — the differences cancel). The rule is STRONG
   regardless; the printed total is not its own sum.
2. **The number that licenses the size is uncorrected.** SIZE is R16 0.106 → 0.060 and R9 0.094 →
   0.060, "the bible's own rate being the number that licenses it". §0.5 lists the three probe
   cautions the file obeys and **[R-8] is not among them**: 21 of the bible's 67 rows are defective
   (8 third-person meta-description, 2 banned terms, 8 without a terminal stop, 3 placeholder or
   truncated), and the column's own length fingerprint moves 8.1 → **6.5** once the meta rows come
   out. The reconciliation asks the right question at Q2 (is a 71.6%-chrome exemplar set a licensing
   column?) and never asks the prior one (is this column clean?).

**Cure.** Recut the bible column per [R-8] before any bible-licensed size, in CC-5 and CC-13 alike; or
set the ration from the register's own measured range and say so.

### CC-6 — REFUTED (MEDIUM). The test is calibrated to pass; the forms that occur are not in it.

Executed at HEAD over `src/copy/*.js` and every `src/**/*.jsx`:

| form the test greps | R9 copy | JSX |
|---|---:|---:|
| `Despite its` | 0 | 0 |
| `experts` | 0 | 0 |
| `users say` | 0 | 0 |
| `many people` | 0 | 0 |

| form the STATEMENT bans, absent from the test | R9 copy | JSX files |
|---|---:|---:|
| `typically` | 0 | **5** |
| `generally` | 0 | **1** |

Every arm the test names is already at its target and cannot fail on any reconstruction; the
quantity-hedge limb the statement bans — and which is the only one with live instances — is not in
the grep at all. The rule's own figure line concedes "none measured" for these forms and then names 0
as the target anyway.

**Also (1):** the count is self-declared unverified — the rule says 55 by its own tally, "reported as
52 for the deductions it could not verify by hand". An unverified deduction is not a recount.

**Also:** `best-ai.md`'s closing note asks that the structural items be weighted **above** item 19,
the lexicon. CC-6 is the file's second-largest count and is built on faults 19, 20 and 27. The
reconciliation notices the point in §2(b) and does not carry it into the standing.

**Cure.** Put `typically`/`generally`/`often`/`in many cases` in the grep; publish the measured
baseline for every arm rather than an assumed zero; grade the count MODERATE until the deductions are
executed.

### CC-7 — REFUTED (LOW). Honest on the size; omits the ruling that bears on it.

The count verifies exactly: the ten `dnd:31` rows give 7 distinct sources, of which two are the
programme's own Finder measurements over SRD 5.1 and Basic Rules — correctly excluded as instruments —
leaving **5**. The figure is honest ("the SIZE cannot be set until the instrument runs"), and the
label/prose split is a real, buildable arm.

The defect is procedural and it is the one that matters here: the `Obeys` line skips **ruling (6),
B-CLAIM**. Spelling a spec is not always a free spend — `40-65` and "forty to sixty-five" carry the
same claim, but a spelled *approximation* would not, and the rule that decides where digits go is
exactly where a modality can leak. The clause is required of every rule and is missing.

**Cure.** Add the (6) clause: a digit-to-word conversion may spend punctuation and word order and may
not change the quantity, the unit or the bound.

### CC-8 — REFUTED (MEDIUM). A grep with no term list; a live breach the HOLD does not record.

- **The test cannot fail.** "a copula-dodge grep → 0" names no forms. The rule's own figure line then
  removes the only candidate set from its scope: the 72 `supports/enables/attracts` are "counted a
  preference … CC-2's registry decides it". A grep with no terms and no baseline has no failing case.
- **A live instance the HOLD misses.** `bandLadders.js:224` (`blurb:`) — "These are the states you
  will see" — is a future indicative in the docent, which the rule's statement bans where the code
  makes no promise. It is not in the figures, because the figures are the four fingerprint rows and
  none of them is a future-indicative row.
- The `Obeys` line skips rulings (4) and (5).

**Cure.** Print the copula-dodge term list (`serves as`, `stands as`, `boasts`, `features`, `offers`,
`marks`) and its measured baseline per register; add a future-indicative row to I1 for R10; cure or
license `bandLadders.js:224` explicitly.

### CC-9 — REFUTED (MEDIUM). The statement's fragment clause has no instrument, and the live class is large.

The count is fine (D&D item 20 gives 6 distinct sources against a claimed 5; ai fault 15 gives 4).

The three tests are: the caps arm with an allowlist, a `<strong>`/`<b>`-per-paragraph walker, and a
trailing-`<ul>` walker. **None of them tests the statement's third clause** — "a fragment stands only
as a label, never as a sentence for emphasis" — and the figure line concedes "Bold per paragraph:
none measured". Meanwhile the live class is not small: `catalogData.js`'s 30 `ARCHETYPES` entries are
each a two-fragment `desc` ("Defense first. Civilian economy secondary to garrison supply."), rendered
side by side. Whether those are labels or emphasis fragments is precisely the question the rule states
and does not instrument.

The `Obeys` line skips rulings (4), (5) and (6).

**Cure.** Add a fragment arm (a segment with no finite verb, outside a label position) with its
measured baseline on R10 and R16, or drop the clause from the statement.

### CC-11 — REFUTED (LOW). A MODERATE grade with zero sources, and a row that reads narrower than it is.

The figure is exactly right — `mechanical.mjs` computes `enDashConnector`, R16 carries 7, the four
example strings are verbatim from [P-6], and R1/R2/R6 are 0.

Two defects. (a) Ruling (2) says a technique's standing **is** its verified source count; the rule
has 0 kept rows and is graded MODERATE on instrument count. That is a defensible thing to do for an
owner law and a mechanical zero, but it is not what ruling (2) says, and the file does not say it is
making an exception. (b) §2's table prints the en-dash row for R16 alone; the measured estate total is
**65** (R15 53, R16 7, R18 4, R8 1). The row as printed reads as if 7 were the corpus figure. The
R15/R18 residue is parked at Q4, but the table should carry the total.

**Cure.** Grade it "owner law + instrument row, no source scale applies"; print the full 65 in the §2
row with the in-scope 7 marked.

### CC-14 — REFUTED (MEDIUM). A walker that derives its own expectation cannot fail.

The count verifies (D&D 5, Le Guin 4, Hobb 1 = 10). Two defects:

- **The test is self-satisfying.** "A walker … asserting the slot set per entry", where §6 rules the
  slot set is per operation KIND and CC-14 repeats "the set per kind, not one universal set". Nothing
  in the rule says where a kind's slot set is DECLARED. A walker that induces the kind's slot set from
  the entries it is checking passes on every possible corpus. The same walker is cited as CC-2's and
  CC-12's registry-field test, where it is genuine (a named option must exist as a field) — it is only
  the slot-completeness arm that is circular.
- **The boundary is understated** — see H4. "the list page is where it lapses" names one page of 39
  sentences; the catalog surface renders REL_TYPES (8), ARCHETYPES (30) and a dozen further mapped
  reading lists.

The `Obeys` line skips rulings (5) and (6).

**Cure.** Name the file that declares each operation kind's slot set (or make the walker's expectation
a checked-in manifest, per the structural-prevention pattern the estate already uses); restate the
boundary from the measured render surfaces.

### CC-15 — REFUTED (MEDIUM). No executable test of its own.

The rule's four tests are: I1's 2nd-sentence-summary row (shared with CC-4, and per H1 not measuring
what it is cited for), the stand-alone gate "as a review question", the rename test "on any chrome
line", and a flatness walker explicitly "owed". Three of the four are human judgement and the fourth
is borrowed and mis-specified. Nothing in the rule's distinctive content — no condescension, explain
once, plain is not flat — can fail a check.

**Also (1):** the stated components (Wolfe 4, Tolkien 8, Kay 3, D&D 5, Le Guin 4, Tolkien/Le
Guin/Ostadan 2) sum to **26**; the rule prints **24**.

**Cure.** Either instrument one clause (a repeated-explanation walker over the term registry: a term
explained in two places is the failure, and CC-2's registry already holds the term list), or mark the
rule REVIEW-GATE, not TEST, and say the gate is a person.

---

## 3. THREE FILE-LEVEL FINDINGS

**F1 — the closing claim is not true as written (LOW).** §4 ends "Every one carries … its rulings".
Nine of fifteen rules omit at least one ruling clause. Ruling **(6) B-CLAIM** — the law that a
rewording may not spend a claim, a modality, a threat class or a pool's spread — is missing from
**CC-7, CC-9, CC-12, CC-14 and CC-15**; ruling (4) is missing from CC-8, CC-9, CC-11, CC-13; ruling
(5) from CC-8, CC-9, CC-11, CC-14; rulings (1)–(5) from CC-11. Only CC-1 carries all eight.

**F2 — [P-3] is claimed and not applied; [R-8] is not claimed at all (MEDIUM).** §0.5 names three
probe cautions the file obeys and then prints [P-3]'s pre-correction ratios (4.27×, 0.36×) in §2 and
CC-10 where [P-3] gives 3.79× and 0.339×. [R-8] — 21 of the bible's 67 rows defective, its length
fingerprint 8.1 → 6.5 — is nowhere in the file, though three SIZEs (CC-5's two, CC-13's floor) are
licensed by that column's rates.

**F3 — the register's own §2 table is otherwise clean (a positive finding).** Every one of the ~60
cells in §2 that I re-derived against PROBE_ALL §3, §4, §6 and the four fingerprint JSONs matches:
the words/segment pairs, the share-under-8 row, the segment shares and their multiples, the four R1
tics, the closers, the punctuation, the pet words, the AI-tell pairs, the Juzek & Ward counts, the
contraction row, the caps and digit rows, the pool rows, and the Axis B distances and ranks. The one
inline figure that does not match the table is CC-13's `dnd-flavor 0.021` (H2). The transplant
discipline in §0.3 and the recount discipline in §9 are real: every row I opened was VERIFIED, none
was PARTIAL, and where §9 claims a recount is lower than the `best-*.md` grade it is.

---

## 4. WHAT SURVIVES

The allocation in §1 is sound: no author's voice enters, ruling (1) is applied mechanically through
the Registers line, and the transplant list is honest. The refusals in §5 are correct. §7's nine
conflicts cite both sides and do not pretend to settle them. §8's Q6 already owes three instruments;
this pass adds four more (a second-person row, a future-indicative row, a fragment arm, a chrome-pool
arm for `check-pair.mjs`) and shows that two published rows — `secondSentSummary` and
`abstractCloser` — cannot carry the sizes hung on them.

The pattern across H1, H2, CC-4 and CC-6 is one thing: **a size stated against an instrument that
measures a shape rather than the property the rule names.** Four of the file's twelve shipped-surface
changes rest on it. Nothing here should reach a byte until those four are re-priced.
