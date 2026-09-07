Seat: Opus 5 — Fable-unvalidated

# REFUTE — the NPC cause-conjunction ladder (R6)

**NOTHING IN THIS FILE IS VALIDATED.** Written by the Opus seat under the owner's 2026-09-07 ~09:50 seat directive; the Fable chair retrovalidates through `docs/FABLE_RETROVALIDATION_QUEUE.md` at the next ledger act. No rule is applied, no corpus byte moves, no walker is built on the strength of this document.

Written 2026-09-07, against `reconcile-npc-ladder.md` (433 lines). Corpus re-measured independently at branch `review-fixes-2026-07-08`, HEAD **29a4ff20d**, from `git show HEAD:` exports (the twelve role files are `D` in the working tree). My measurement script imports `ROLE_CONTENT`, `CLASS_CONTENT`, `FULL_CONTENT` and `STAGE_TEMPLATES` and walks to the array leaves; every figure below marked *(re-measured)* is my own execution, not a citation.

**Method.** Every kept-row citation in the reconciliation was opened by index in `kept-<author>.json` and its verdict grade read. Every fingerprint figure was re-derived from `primary/*.fingerprint.json`, `npc-ladder.fingerprint.json`, `estate-state.fingerprint.json`, `herald-crier.fingerprint.json` and `herald-pools.fingerprint.json`. Every PROBE figure was checked against `PROBE_ALL.md`'s corrected table. The fault numbering and the fault constraints were read from `best-ai.md`. Code claims were checked against `29a4ff20d`.

**Headline.** The reconciliation is unusually well measured — its per-stage table, its clause-arity histogram and its whole §0b fingerprint table reproduce EXACTLY under an independent script, and every cited kept row exists and is verified. The failures are of a different kind: a corpus boundary applied inconsistently, three tests that cannot fail, one architectural finding refuted by the code it cites, and four source counts that count guard rows and off-proposition rows as support.

**21 refutations. 7 HIGH · 10 MEDIUM · 4 LOW. 3 items checked and NOT refuted.**

---

## HIGH

### R6-REF-01 — the floor is inside every §0a denominator and outside the roster in the same section
**Ground: (2) the figure is misread.** *(re-measured)* R6's 14-file roster gives **1,104 pools, 1,662 lines, 1,692 segments**, pool-size histogram **{1: 546, 2: 558}** — and **zero triples**. The reconciliation reports 1,110 pools, 1,680 lines, 1,713 segments and "6 triples". The gap is exactly the floor: `STAGE_TEMPLATES` is 6 pools × 3 variants = 18 lines, and those six pools ARE the six "triples", in a section whose own rung table says the floor is outside R6's roster and whose own headline says 1,662 excludes it. The contamination then runs through the register rates, inconsistently: the opening-move counts (790 + 312 + 228 + 184 + 80 + 40 + 28) sum to 1,662, while the adjacent first-word bullet divides by 1,680.
Three consequences. (a) Singletons are **546 of 1,104 = 0.495**, not 0.492. (b) **R6 proper has no pool larger than two** — a sharper finding than the file states, and it strengthens NPC-L7. (c) The same paragraph reports "em dashes 0" over the 1,680-line corpus while three of the 18 floor strings carry them (four characters, at `causeLifecycleVocabulary.js` lines 75, 80 and 94) — which also makes open question 5's "2 instances" wrong.
**Cure.** Recompute every §0a rate over 1,662 lines / 1,104 pools; state max pool size = 2; correct OQ5 to three authored strings, four characters; keep the floor out of the roster in the arithmetic as well as in the prose.

### R6-REF-02 — NPC-L3's baseline is wrong, and the file prints two values for it and reconciles neither
**Ground: (2).** §0a and NPC-L3 both state under-8 segments as **13 of 1,713 (0.0076)**. §0b prints **0.0047** from the fingerprint two pages earlier. *(re-measured)*: **8 under-8 segments of 1,692 = 0.0047** — the fingerprint is right, the five extra are floor fragments, and PROBE's 0.005 agrees. At line level there are **zero** lines under eight words and the shortest authored line is **15**. The rule's whole direction is stated off the inflated base, so the proposed move is understated: 0.0047 → 0.06 is 12–21×, not the 8–13× the file's own numbers imply.
**Cure.** Restate the baseline as 0.0047 (8 segments; 0 lines; minimum line 15 words), name the unit in the proposal, and reconcile §0a with §0b explicitly rather than letting both stand.

### R6-REF-03 — C1's "no free route" is refuted by the code C1 cites; the FULL rung is 12 pools of 2,016
**Ground: (2) and (6).** C1 and NPC-L7 rest on the claim that "the only lawful growth is APPENDING" and that "an authored key nothing stamps would never be read". *(re-measured at 29a4ff20d)*: `conjunctionVariantsFor` resolves `FULL_CONTENT[role][situation][causeClass][stage]` on its FIRST branch, and the full rung holds **12 authored pools of 2,016 addressable keys** (12 roles × 2 situations × 14 causeClasses × 6 stages, all four dimensions counted from the modules). Every one of the 2,004 open keys is producible by `normalizeKey` from the worldPulse stamp and is read before the role rung is consulted. Authoring one is precisely A7's prescribed act — a new pool key by a chair act, never an append — and it moves **no** pool's length, so `variants[h % variants.length]` is untouched for every existing pool and the standing "a pool's length is a seed input" hazard does not fire.
This also cures C3 at the same stroke: the full rung is the ONLY rung that reads `situation`, the dimension C3 reports dropped for 1,638 of 1,662 lines.
It is still a display change on installed worlds (a bearer whose key gains a full-rung pool stops reading its role-rung line), so it remains owner-gated — but it is a second route, and a cheaper one, and the owner is currently being shown one.
**Cure.** Replace C1's single route with two — author into the sparse full rung, versus buy the same-seed re-draw — and re-put OQ6 as which of the two the owner buys, and for which of the three singleton stages first.

### R6-REF-04 — NPC-L7's POOL-FLOOR RATCHET cannot fail, and fires on the cure instead of the fault
**Ground: (5) the test cannot fail.** The ratchet asserts that the count of singleton pools per stage never RISES. A7 forbids adding, removing and reordering variants, so no pool's length can change and the singleton count cannot rise — the assertion is guaranteed by the register's own binding constraint and passes on every conceivable reconstruction. It is also backwards: an unlawful append would make the count FALL, which the ratchet permits. And under R6-REF-03 the one lawful growth act raises the singleton count whenever a new full-rung pool is authored with one variant — so the only test the rule ships blocks the only cure the rule needs.
**Cure.** Pin the per-stage pool-size histogram **two-sided** (any change fails, including a fall — that is the append's signature), add a same-seed pick-set golden over a fixed NPC roster so a length change is caught at the pick rather than at the count, and require every newly authored full-rung pool to carry ≥ 2 variants.

### R6-REF-05 — NPC-L8's acceptance passes today, before anything is reconstructed
**Ground: (5).** The stated acceptance is a TIER-LENGTH walker "requiring the rung distributions to overlap". *(re-measured)*: the role rung already holds **63 lines at ≥ 31 words** (max 37) against the full rung's 31–41, so the ranges overlap at HEAD while the fault the rule names — the full rung has **zero of 24 lines under 31** — is entirely untouched. Range overlap is satisfiable by a single long role-rung line.
**Cure.** Assert three things that all fail today: the full rung's own p10 ≤ the register p10 (19); the full rung's median inside the role rung's interquartile range; and the register maximum ≤ 34 (currently 41). Range overlap is not a distribution test.

### R6-REF-06 — NPC-L6's walker cannot fail on the one construction C5 rules unlicensed, and that construction is in the corpus
**Ground: (5), and (3) the guard is vacuous.** The MENTAL-PREDICATE WALKER is keyed on grammatical subject: a collective subject passes, the bearer's role noun fails. C5 rules that a `believes` with no belief field is unlicensed and that nothing currently tells it apart from `knows`. *(re-measured)*: a full-rung line in `causeConjunctionContent.js` opens **"The town believes its ruler shields it"** — collective subject, belief predicate, no belief field. It passes the walker as specified. The rule's own statement ("the town knows" is licensed by the stage) does not reach it, because the licence is written for `knows` and the walker is written for subjects.
**Cure.** Key the walker on (subject class × predicate lemma) against a CLOSED allow-list — collective subject with {know, knew, is learning} only — so every other mental predicate fails on every subject, collective included; and carry the measured line into NPC-L6's figure instead of leaving it to C5's general case.

### R6-REF-07 — NPC-L4's six sources include its own guard twice and support the proposition with two
**Ground: (1) the source count is wrong.** Every cited row exists and is verified; the problem is what they are counted for. `dnd:1011` (the SRD at is/are 24.84 per thousand) and `leguin:241`/`531` (the passive is a versatile tool) are cited three paragraphs later, in the rule's own guard, as evidence AGAINST over-correcting — they are counter-evidence promoted into the standing. `dnd:998` is a present-tense / anti-`will` row and is counted a second time as one of NPC-L10's three. `dnd:907` is a place-description present-tense row. Only `dnd:112` and `dnd:183` touch "to be" at all, and neither names the existential expletive — while the rule expressly says nothing else about the copula moves. The rule's actual licence is a MEASUREMENT (0.110 against a corpus median 0.006, the estate's single largest outlier), which is strong and does not need a source count at all.
**Cure.** Grade NPC-L4 SINGLE-to-MODERATE on 2 sources; state that its standing rests on the PROBE outlier and the owner's latent-grammar directive, not on the D&D lane; move `dnd:1011` and `leguin:241`/`531` out of the count and into the guard, where the rule already uses them correctly.

---

## MEDIUM

### R6-REF-08 — NPC-L2's "8 distinct" breaks the file's own two counting rules
**Ground: (1).** The file's rule is that the same page twice is one source and relays collapse onto the critic they relay. `tolkien:54`, `158`, `323`, `254` and `55` are all one page — Wikipedia, "Tolkien's prose style" — supplying Turner, Shippey and Kullmann & Siepmann second-hand; the file collapses Turner's three and then counts Shippey and K&S from the same page as two more. `tolkien:663` is Bolding's *Mythlore* REVIEW of Kullmann & Siepmann, which the relay rule folds onto `tolkien:656`/`657`. By page identity the count is 7; applying both stated rules it is **6** — Wikipedia, K&S, McIntosh, Halbrooks, Töyrylä, Bakhshi.
**Cure.** Restate as 6 (still STRONG) and drop the "8 independent voices" framing; the Tolkien allocation does not need it.

### R6-REF-09 — NPC-L2's and NPC-L3's SIZES are derived from a figure of a different quantity, and no measurement licenses them
**Ground: (2), with (4) B-CLAIM.** `ai:73`'s 7.13-against-3.73 is a per-DOCUMENT count of rhetorical tricola in argumentative prose; R6's 0.600 is a per-LINE share of three-clause chains. Multiplying the register's share by that ratio has no warrant, and the file half-concedes it ("test this, don't trust it"). The deeper problem is reachability: U4 forbids keeping three claims in two clauses, and B-CLAIM forbids spending a claim, so 0.600 → 0.25 requires ~580 lines to genuinely carry ≤ 2 propositions, and NPC-L3's under-8 floor requires ~100 lines to carry exactly one — quantities the reconciliation never measures. Set this way, the sizes may be unreachable without the one thing the register may not do.
**Cure.** A PROPOSITION CENSUS per line (how many things each line asserts) is a prerequisite car for L2, L3 and L8 alike; derive the arity ceiling and the under-8 floor from the measured single- and double-claim shares. Keep `ai:73` as evidence of the FAULT and strike it from the derivation of the SIZE.

### R6-REF-10 — the installed-world test is applied to one rule and withheld from eight
**Ground: (4) THE PROMISE.** NPC-L7 is graded OWNER-GATED, not merely owner-signed, because a re-draw "changes which sentence an ALREADY-INSTALLED world shows". NPC-L1, L2, L3, L4, L5, L6, L8 and L9 each rewrite the text of lines that installed worlds have already displayed for compromises already lived — by the file's own stated criterion, the same grade. §0's census establishes only that R6 is display-side and therefore not a GOLDEN shift; that is a different question from THE PROMISE's "nothing re-labels an installed world", which the file never puts to the eight.
**Cure.** State the ruling in one sentence — in-place rewording of a display side-car is not a re-label, because no world state and no lived event changes, only the clerk's wording of it — or raise all nine to owner-gated. Either is defensible; silence on a standing-law surface is not.

### R6-REF-11 — NPC-L5 names the wrong fault, and its guard does not stop the Brackwater sentence
**Ground: (3) the guard is vacuous.** The rule cites "Fault 24's inverse". The Brackwater failure and `ai:276` are **fault 26** (over-association), whose constraint in `best-ai.md` carries the limb NPC-L5 omits: **a sentence that lets two facts imply a third is the fault**. Run the rule as a template: with the proposed institution table returning {bailiff, counts everyone} and {priest, exempt}, "the priest is the only person the bailiff does not count" becomes licensable field by field, and reproduces the owner's sentence exactly — because its force is a UNIQUENESS claim that needs closed-world completeness the table as specified ({settlement, office, holder-role, what it does, who it counts, who is exempt}) does not declare.
**Cure.** Cite fault 26 and carry its implication limb. Add a per-settlement CLOSED flag to the table, and bar superlative, uniqueness and only-construction sentences in this register unless that flag is set. The guard must stop the sentence the owner actually read, not an adjacent class of it.

### R6-REF-12 — §4 suspends fault 24's own constraint without naming it, and the rung it relies on is invisible
**Ground: (3), with (4) ruling 4.** Fault 24's constraint binds dm-page and the record registers: **a gap in the record is recorded as a gap**. §4 rules the opposite for R6 — omit, never write the absence — on the ground that the four-rung fallback carries the absence structurally. But the rung is not surfaced: `npcComponents.jsx` renders `compromiseLc.phrase` and not `compromiseLc.tier`, so a class-rung, role-agnostic generic reads to the DM exactly like a hand-authored full-rung fact about this NPC. The absence is then recorded to nobody, and the register is smoothing a gap rather than declaring one. Ruling (4) does delegate the omit-versus-"no entry" choice to the register, so the decision is the file's to make — but it is made against a standing constraint the file does not name.
**Cure.** State the fault-24 override as a declared exception with its reason. Add an OPEN question on making the rung legible on the card as a TIER MARKER rather than as a sentence — which satisfies both the fold's constraint and §4's refusal to author a gap line.

### R6-REF-13 — three cited code locations are wrong, and C3 understates its own seam
**Ground: (2), against the standing hazard on line numbers in shipped citations.** *(checked at 29a4ff20d)*: the sole external importer is `npcComponents.jsx:13`, not `:11`. The phrase's render gate is at `:411` (`npc.corrupt && compromiseLc?.phrase`) and the ladder call at `:265`; line 235 is an unrelated `useState`. C3's substance survives — the gate is `npc.corrupt` with no public-safe seam — but C3 understates it: the sibling module imported on the next line, `npcInteriorityRead.js`, is explicitly fail-closed behind `includeGroundTruth` for shared and gallery surfaces, so the conjunction phrase is the ONLY ungated compromise disclosure on that card.
**Cure.** Cite by symbol, never by line, per the standing hazard. Re-put C3 as a named seam inconsistency against `npcInteriorityRead`'s fail-closed contract, which makes it a product bug report rather than an open question about who reads the card.

### R6-REF-14 — NPC-L6's premise is too broad, and its itemisation does not sum to its figure
**Ground: (2) and (1).** "The interior is not a field" is true of the CONJUNCTION KEY and false of the NPC card: `npcInteriorityRead.js` ships a typed disposition-and-wants projection per NPC, composed from goals, traits, standing, bonds, grudges and credibility. The correct licence is that the ladder does not READ that projection — not that no motive is typed anywhere on the surface the ladder renders into. Separately, the stated residue "~76 lines (0.046)" is 112 minus the 36 town-knows, while the itemisation beneath it (fear 25 · want 15 · believe 7 · shame 6 · loyalty 5 · appetite 3 · conviction 2 · guilt 1) sums to **64**; my own lexeme sweep *(re-measured)* returns **64**, so 12 lines are unenumerated, 8 of them non-town `knows`.
**Cure.** Restate the licence as register-scoped ("the ladder's key carries no motive field and the ladder does not read `npcInteriorityRead`"). Report 64 itemised + 12 residue. Add an open question on whether a future licensed read from the player-safe half of that projection should replace the flat zero — which is exactly the move NPC-L5 makes for offices, and the asymmetry is currently unargued.

### R6-REF-15 — `ai:536` is cited for the opposite of what the row says
**Ground: (1).** NPC-L7 lists it among the rows establishing that no prompt, temperature, penalty or model swap restores diversity. The kept row (VERIFIED_SUBSTANCE) says presence and frequency penalties RAISED individual diversity above human, at the cost of coherence and readability. NPC-L3's guard uses the same row correctly. One row cannot carry both readings.
**Cure.** Drop `ai:536` from NPC-L7's count (7 → 6, still STRONG) and leave it in NPC-L3's guard, which is where its content belongs.

### R6-REF-16 — NPC-L3's "14 distinct" counts eight rows that bound a different quantity
**Ground: (1).** `dnd:12`, `94`, `97`, `98`, `99`, `100`, `103` and `314` bound the length of a READ-ALOUD BLOCK — two sentences, three lines, four sentences under 100 words, under 250 words. R6's block is one sentence of ~23 words and satisfies every one of them by an order of magnitude, so none of the eight speaks to the rule's actual proposition, which is within-register VARIANCE. On variance the rule has `leguin:264`, `ai:936`, `ai:98`, `wolfe:891`, `kay:5` and `tolkien:656` — six. The eight are NPC-L8's evidence and are counted there already.
**Cure.** Restate NPC-L3 as 6 sources (STRONG stands) and let NPC-L8 keep the lane, so the two rules do not share a base while claiming independent standing.

### R6-REF-17 — NPC-L3's instrument is one scorer where the fault's own constraint requires two
**Ground: (3).** Fault 5's constraint in `best-ai.md` is explicit: any burstiness instrument reports surprisal under at least two scorers, because one scorer can invert the conclusion. NPC-L3's test is a single `fingerprint.mjs` delta on `sd` and `shareUnder8`. This is not academic here: the file's own two under-8 figures (0.0076 and 0.0047) differ by 1.6× purely on segmentation, which is one scorer disagreeing with itself.
**Cure.** Require a second, independently implemented length scorer with a different segmenter and tokenizer, and require both to move; or state why the fold's two-scorer constraint binds a model-surprisal instrument and not a corpus length statistic.

---

## LOW

### R6-REF-18 — NPC-L10's three sources are two on its proposition
**Ground: (1).** `dnd:183` is an anti-passive / anti-"to be" row and says nothing about `will`. `dnd:112` and `dnd:998` carry the will-avoidance, and `dnd:998`'s own verdict note records it as a fan compilation of the 3.5 and 4.0 guides, not a Wizards document. The rule's real authority is PRODUCT SCOPE and THE PROMISE, which are standing law and need no count.
**Cure.** Grade SINGLE (2 sources, one lane, one fan-codified) and lead the rule on the standing law rather than on the lane.

### R6-REF-19 — three small figure errors, all of which happen to favour the file's direction
**Ground: (2).** (a) *(re-measured)* the existential opener's stage concentration is **181 of 184** in `exposed-public` (0.487 of that stage), not 177 — 177 is the sum of the two prefix subtotals (143 "It is public" + 34 "It is out") presented as a stage count. (b) "dnd-rules's 0.0027" is `dnd-rules-srd52`'s figure; `dnd-rules` is 0.0018. (c) PROBE's "mean pool size 2.0" is not a mean: the measured histogram {1: 546, 2: 558} gives 1.51, with 2 as the median.
**Cure.** Correct all three. (a) strengthens NPC-L4's case and (c) strengthens NPC-L7's, so none of them costs the reconciliation anything.

### R6-REF-20 — NPC-L9 sets a floor over a residual bucket
**Ground: (3).** The rule requires every member of the opening set at ≥ 0.05 over the seven observed moves, one of which is `other` (80 lines, 0.048) — a catch-all, not a move. A floor on a residual is incoherent, and the file itself defers the closed set's membership to §7.Q3.
**Cure.** Apply the ceiling (0.30, and sameOpenerAsPrevious ≤ 0.20) now; defer the per-move floor until Q3 names the set; exclude any residual bucket from both.

### R6-REF-21 — three guards describe a runtime mechanism this register does not have
**Ground: (3).** NPC-L1's guard ("the joint is picked by the SEEDED draw") and NPC-L9's ("the move is chosen by a SEEDED draw whose input is the key") describe selection of a property that is authored into a static string. The only seeded draw in this code is `variants[h % variants.length]` over a pool, and *(re-measured)* **546 of 1,104 pools are singletons**, so the mechanism cannot operate at all for 49.5% of pools. NPC-L7 discloses this for L1, L2 and L9 collectively; none of the three guard sections carries it, and a reader of a single rule would not find it.
**Cure.** Restate the three guards as authoring-time DISTRIBUTION requirements measured by the walker across a pool's variants and its sibling pools — which is what the file's own "the walker measures the resulting distribution rather than enforcing a rota" already says — and cross-reference NPC-L7 as the blocking dependency inside each of the three rules.

---

## CHECKED AND NOT REFUTED

### R6-CONF-A — §0b's fingerprint table is exact
All ten rows re-derived from `npc-ladder.fingerprint.json`, `estate-state`, `herald-crier`, `herald-pools` and the fourteen `primary/*.fingerprint.json` columns. Every ladder figure, every control figure and every band endpoint is correct, including the three inside/below judgments: sd band 8.5–16.0 (`dnd-rules-srd52` to `tolkien-elevated`), under-8 band 0.029–0.333 (`martin-chronicle` to `leguin-nonfiction-spoken`), There/It-is band 0.0016–0.0556 (`dnd-flavor` to `leguin-fiction`), same-opener band 0.033–0.167, triad and pronoun-closer inside, antithesis below. `EXEMPLAR-BEST-PARTS` row 293's arrival-table sd 8.1, cited as the internal proof for NPC-L3's target, is present as quoted.

### R6-CONF-B — §0a's structural measurements reproduce exactly
*(re-measured at 29a4ff20d)* The per-stage table matches on all six stages and all seven columns — `attributed` 378 / 27.0 / 4.1 / 18–39 / 0.754 / 0.172 / 0.881; `exposed-public` 372 / 23.1 / 3.1 / 16–41 / 0.094 / 0.427 / 0.957; `historicized` 184 / 20.8 / 2.8 / 15–36 / 0.978; `re-caused` 182 / 21.4 / 2.0 / 18–28 / 0.423 / 0.000; `reformed` 364 / 21.4 / 2.2 / 15–29 / 0.882; `re-adjudicated` 182 / 21.6 / 1.9 / 17–27 / 0.000 / 0.000 / 1.000. The clause-arity histogram matches exactly (1→21, 2→478, 3→998, 4→160, 5→5) — the register's largest structural tell, and the file is right that PROBE never measured it. Em dashes 0, digits 0, `will`/`shall` 16, `would`/`could`/`might` 35, existential openers 184, twelve roles, fourteen causeClasses, six stages, and the FULL rung at 24 lines running 31–41 with mean 35.4 and zero under 31: all confirmed. Segment max 39 against line max 41 is a unit difference, not a contradiction.

### R6-CONF-C — the kept-row provenance is sound
Every cited row I opened — roughly sixty across `ai`, `dnd`, `hobb`, `kay`, `leguin`, `martin`, `tolkien` and `wolfe` — is present in its `kept-` file at the cited index and graded VERIFIED_VERBATIM or VERIFIED_SUBSTANCE. None is PARTIAL and none is absent. Every refutation above concerns what a row is COUNTED FOR, never whether the row exists or was verified. The reconciliation's citation hygiene against the sweep is clean; its citation hygiene against the CODE (R6-REF-13) is not.

---

Seat: Opus 5 — Fable-unvalidated. Retrovalidation owed at the next ledger act. No corpus byte moved; no walker built; no rule applied.
