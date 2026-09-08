# SKEPTIC PASS — LENS: THE TESTS (Opus 5, Fable-unvalidated)

Targets: `RULES-V2-PART-B.md` (598 lines, read in full) and `sweep/RECONCILIATION-DOSSIER.md` (387 lines, read in full).
Corpus: the dock `.../scratchpad/laneB6` at **3b1c0eaa5**. Porcelain BEFORE 0, AFTER 0; HEAD unchanged.
Every figure below comes from a command executed in this session under `.../5540cfd2.../scratchpad/skeptic-s12`.
No tree, dock or kit file was written. No vitest was run.

## THE QUESTION
For every rule: can its named executable test FAIL on a reconstruction, and does it fail/pass on the corpus in
the direction the rule claims? A test that passes on any reconstruction, a test naming a walker that does not
exist as if it were runnable now, or an assertion that already passes today while the rule claims a cure — REFUTED.

## A. THE INSTRUMENT RUNS
`node check-pair.mjs <laneB6> <pairs.json>` loads **2,734 variants in 1,020 pools** — matching R-DA-20's
2,734 denominator exactly. The dossier loader (`check-pair.mjs:16-33`) is real and the arms fire. Arm line
citations verified: `:66` MARKS, `:69` EM DASH, `:71-73` DURATION/COUNT, `:74` R4, `:78` THREE+ SENTENCES,
`:85` ANTITHESIS, `:87` shape NOTE (in `r`, a failing arm — as Part B says), `:109-121` A11, `:118` PRE-EXISTING,
`:129` PRONOUN CLOSER, `:130` verdict, `:136` the "not a claim-preservation verdict" line. Two off-by-ones:
`:64` is the `hits` filter (NOT LOCATED pushes at `:65`); R-DA-07's `:123-126` omits the EXISTENTIAL push at `:127`.

## B. NEGATIVE CONTROLS I BUILT AND RAN (14 pairs, real BEFORE strings from `DS-WAR-1`)

| control | what it breaks | verdict | on what ground |
|---|---|---|---|
| NEG-3 pronoun closer ("…lets them.") | R-DA-04 | FAIL | PRONOUN CLOSER ADDED — the rule's own ground. **Arm works.** |
| NEG-9 `, which the hall has never corrected` | R-DA-03 | FAIL | only `DURATION/TIME words ADDED: never` — **incidental**. No `, which` arm exists. |
| NEG-7 "**You** hear the fighting…" | D4, R-DA-01 | **PASS(mechanical)** | no `you|your` arm exists in the file (grep: zero hits). |
| NEG-10 absence sentence written inside the variant | R-DA-08's own cure | FAIL | `LONGER: 24 → 27 words` — the rule's prescribed cure is refused by the gate. |
| NEG-2 gnomic closer ("War is a debt that outlives its cause.") | R-DA-12, NL-11 | PASS | no generalisation arm (Part B says OWED — consistent). |
| NEG-12 manufactured particular ("The **tanners** speak…") | R-DA-10, fault 24 | PASS | no clerk walker (OWED — consistent). |
| NEG-13 verdict close ("The recovery is remarkable.") | R-DA-12, NL-7, CL-7 | PASS | no verdict arm (OWED — consistent). |
| NEG-6 "The **bailiff** … every household is **exempt**" | R-DA-15 (the Brackwater shape) | FAIL | only LONGER + `every` as a DURATION word — **not on the rule's ground**. |
| NEG-14 rewrite deleting half the claim | B-CLAIM / C-pair | FAIL | only `SUBJUNCTIVE "would" REMOVED`. C-pair is not executable today. |

## C. THE TASTE-SAMPLE PLAN (dossier §5)
**The block verifies.** `DS-WAR-1 :: "warExhaustion: near peace"` exists at 3b1c0eaa5 in
`src/data/dossierStateProse/warFaith.generated.js`: **k = 4**, angles `[0]ledger / [1]unfolding /
[2]threshold / [3]street` (the refutation's `[0/4]` and `[2/4]` reproduce), `marks: []` — **no dm-only**
(the dossier left this to be read from the leaf; I read it), and the four-rung band ladder
`rested / near peace / war-weary / exhausted` is present as sibling pools. Not in `LIVE_STRING_BINDINGS`
(which binds `ECONOMY_FRESHNESS_SENTENCES` alone, `generate-dossier-state-prose.mjs:89` — confirmed).
R4-BAND fires on the `[ledger]` variant as the dossier predicted (its "a preference **rather than** a weakness").

**The grammars do not.** The state leaves carry, at the variant level, only `angle`, `text`, `slots`, `marks`,
and at the block level only `title`, `sectionTarget`, `slots`, `pools`, `arms`. There is **no licensing
field of any kind on the corpus**. Against MOVE-GRAMMAR §2.1's level-1 set:
* **V7 is "(R2 only)"** and this pool is an R1 STATE leaf — the dossier lists V7 among the pool's seven.
* **V5** needs an institution row: `src/domain/institutions/institutionTable.js` **does not exist**.
* **V8** needs a `not-held` provenance field — an owner-gated schema act (item 30a), absent.
* **V3** needs `none-exists`: `grep -rl "none-exists\|noneExists" src` returns **nothing estate-wide**.
* **V6** needs "a state key whose value is unresolved"; the dossier licenses it from the `[threshold]`
  **angle**, which is a standpoint label, not a licensing field.
So the demonstrable set is V1 (and perhaps V4, whose named-object field is also absent). MOVE-GRAMMAR's own
rule — "a pool of k variants carries min(k,8) DISTINCT level-1 grammars, at least two in every pool of two
or more" — is **not satisfiable on the block the sample is cut from**, and "the licensing filter is shown
once" is vacuous: V3 is filtered out of *every* pool in the register, not this one.

**The draw.** `stateProseKernel.js:304` is
`eligible[avalanche32(fnv1a32(\`${seed}::${blockId}::${poolKey}\`)) % eligible.length]`.
Both deliverables print it without the avalanche finalizer — the file's own comment (`:31-33`) says the raw
`%` form is the bug the avalanche was added to fix, and H-10 flags exactly that raw form in `discourseKernel.js`.

**The gate.** §5 requires each variant "passing `check-pair.mjs` (every arm)" while §5's own gate paragraph
admits WITHHELD and NOTE channels; and the absence classes the sample must show (a LACK and a GAP variant)
fail the unwaivable `LONGER` arm (`:70` — only `contrastWaived` exists as a waiver).

## D. RE-TAKEN CORPUS FIGURES (the "already passes" test)
**Confirmed exactly at 3b1c0eaa5:** `newsVoice.js:97` "every household is counted for the levy";
the two crier interrogatives at `newsVoice.js:442` and `:496` (and exactly 2 question marks in the file);
`RECEIPT_POOLS_DOSSIER_STATE.md:5233` carrying "the same trades exempt";
`chroniclersLetter.js:165/:169/:171` (the three self-characterising strings);
`bandLadders.js:220` ("Not a dial you set") and `:224` ("These are the states you **will** see" — CC-8's future);
`warReceiptPools.js` **23 first-person lines** with `ingratitude_debt` among the mixed cells;
every §0.4 pin (`chronicleReadModel.test.js:99/:102/:114-118`; `demographicReading.test.js:86/:98/:124-125/:132`;
`causeConjunctionContent.test.js` `{full:12, role:2004, class:0, floor:0}`); every named shipped test file exists.

**Em dashes.** `grep -c '—' newsVoice.js` = **33** at the product tip — but every one of the 33 is in a `*`
or `//` comment. **H-12's "crier strings HELD at 0" is CONFIRMED**; the dossier §7's wording ("do not exist
at the product tip") is true of the strings and false of the file, and `mechanical.mjs`'s counter screens
strings, so the substance holds.

**Refuted or corrected:**
* **CL-1's "quietly" 8 → 4.** At 3b1c0eaa5 `quietly` occurs **5 times** in `chronicleReadModel.js`, one of
  them in a comment (`:129`); the **4 live strings are `:141/:147/:153/:159` — the canonical index-0 lines
  option (ii) KEEPS**. Zero in `chroniclersLetter.js`. The cure is a no-op on the first car of the wave.
  (`calm and uneventful` ×4 CONFIRMED.)
* **R-DA-19's extraction citation.** Off by one: the header `**\`economicBase: extraction\`**` is at **:2244**
  (`:2243` is blank) and the `[counterforce]` row at **:2247** (`:2246` is the `[street]` row). The **defect
  is real** — that `[counterforce]` row asserts a war doctrine ("turtles the chokepoints when it fights.
  It does not campaign") under an economic-base key. A fixture built to the printed line reds on the wrong row.
* **CC-1's `operationRegistry.js:280`.** `:280` is a comment about a partialize allowlist. The second person
  is at **`:284`** ("those decisions wait for **you**") and `:558`. Part B ordered this re-taken; the dossier
  §4.D says "(re-taken at laneB6)" while §9 says no figure was re-measured — the parenthetical is false.
* **CC-6's `typically` (5 in JSX) → 0.** Six occurrences at the product tip, **all six in JSDoc comments**
  (`grep -v` on comment-shaped lines returns 0). No reader-facing instance exists.
* **CC-6's `generally` (1) → 0.** One instance: `TermsPage.jsx:168` "We do not **generally** refund partial
  months". Cutting it converts a hedged refund term into an absolute one — a legal-claim change on paid copy.
* **CL-8's three interpolations.** `${doc.coalitionScope.length} besiegers` (`treatyDocument.js:350`) and
  `(so noted ${l.repeats} times)` (`chroniclersLetter.js:435`) confirmed; **`${coalitionSize}` is an object
  field (`warSiegeVerdict.js:225`), not a prose interpolation**. `:303` and `:423` confirmed, but both emit
  through `tickCalendarLabel`, which CL-8 itself rules a LINE-HEAD that keeps its numerals.
* **H-8's "7 of 86 pools".** A plain walk of `warReceiptPools.js` gives **97 arrays / 326 lines / 10 pools**
  carrying first person. The 23-line figure is exact; the pool denominator needs the refuter's published
  pool definition before it goes to the owner as a defect report (dossier item 25).
* **B-DASH's 23 R15 + 38 R18.** UNTESTABLE today: raw em-dash counts in the four named R15 homes are
  customContentSchema 37, labelBands 28, searchIndex 12, dossierViewModel 36. The reader-facing/dev split
  needs the R15-TAIL classifier, which R-DA-00 lists as owed.
* **CL-2's "5 `demographicReading`".** Raw `will|shall` counts: demographicReading.js 9, threatAssessment.js 4.
  The 4 matches; the 5 needs the string-admission screen to reproduce.

## E. THE STATUS TABLE'S THREE BAD "EXEC" ROWS
Dossier §2 grades R-DA-01, R-DA-03 and D4 as **EXEC**. Part B's own text is more honest (R-DA-03's arm is
"proposed"; R-DA-01's and D4's are walkers nobody has built), but all three carry "Executable now" and the
dossier promotes them to plain EXEC. Under chair G's definition — OWED means the instrument must be built
first — these three are OWED, not EXEC. Corrected, the dossier's EXEC column loses its three purest members
and the register the taste sample calls "the only one whose loader EXISTS" has no executable arm for its
second-person law, its `, which` tail or its second-sentence summary.

## F. WHAT WOULD SETTLE THE UNTESTED
The R5 share-ceiling NOT-EXECUTABLE claim, NL-9's three failing assertions, and every ladder/Herald/chronicle
arm need loaders that do not exist. The B-GRAMMAR walker's five negative controls and the clerk walker's three
Brackwater fixtures are the right shape — but neither walker exists, so no claim about what they red on can be
graded better than PLAUSIBLE today.
