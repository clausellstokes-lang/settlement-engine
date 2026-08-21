# Lane MF-SPEC — THE GENERATION SPECIFICATION (ODQ §246.3): receipt

**Lane MF-SPEC (Opus 5), 2026-08-17.**
**Touched:** `map-corpus/docs/GENERATION-SPEC.md` (new) and this receipt. **NO git tree write, NO
repo gate, NO branch move, NO memory write, NO state-mutating git command of any kind.** The one
git command used was the read-only
`git show refs/heads/review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md` the brief specifies
(written to `MFSPEC-odq.md` in the scratchpad).

---

## §0 · THE HEADLINE

> **`map-corpus/docs/GENERATION-SPEC.md` EXISTS: 3,187 lines / 248 KB, covering 24 pipeline
> stages in derivation order, a full target sheet, the invariants, a 33-row gap ledger with an
> explicit dependency graph, and a nine-wave implementation order whose every exit criterion is
> a measurement.**

**Structural integrity checked, not assumed** (the one thing in this lane I did execute): all
**31 tables** in the file are well-formed with uniform column counts, and the gap ledger holds
**33 rows with ranks 1–32 + one unranked, zero duplicate ids and zero duplicate ranks.**
⚠ **The check earned its keep: it caught a row I had destroyed** — inserting G-34 at rank 3 by
replacing the G-3 row's prefix merged the two rows into one, and the G-3 row survived only as
trailing cells on G-34's line. **Fixed and re-verified.** ⭐ *A markdown table is code enough to
have a lint, and "I wrote it carefully" is not a receipt.*

**It is a synthesis, not a re-derivation. This lane executed nothing** — no build, no test run,
no measurement, no render. Every **CONFIRMED** label in the spec cites a named upstream lane's
executed evidence and quotes its receipt. **No number in the specification was computed by me**,
and the spec says so in its own §0.1.

**Written incrementally**, per the brief's warning: the file was created after the ODQ read and
appended section by section behind an `<!-- APPEND-HERE -->` marker, seven appends in all. **At
no point did the deliverable exist only in context.**

**Deliverables**
- `map-corpus/docs/GENERATION-SPEC.md` — the build sheet.
- `laneMFSPEC-receipt.md` — this file.
- `MFSPEC-odq.md` (scratchpad) — the read-only ODQ extract, 9,322 lines.

---

## §1 · WHAT WAS READ, AND WHAT WAS DELIBERATELY NOT

**Read in full or in the sections that bear on the pipeline:**

| source | what I took |
|---|---|
| `laneMFS1-urbanism-atlas.md` §2.1–§2.9.2 | the corrected T-01…T-26 targets, the aesthetic bands, the §2.9 correction ledger, the §2.8.1 usage rules, the twelve banned priors, Table A/B/C |
| `MORPHOLOGY-PLAN.md` §0–§15 (whole) | the junction mix, φ, block bands, plot series, building variance, districts, centres/voids, the epoch dials, decay, the four tier-invariants, the anomaly finding, the 8 traces and the ranked divergences |
| `MORPHOLOGY-CONTEXT.md` §0.6, §1, §2.4–§2.5, §3.1–§3.2, §4.1, §5, §7.2–§7.3, §8.1–§8.3, §10–§14 | the siting law, the refusal mask, the nine wall-run types, the flow-ordered chains, the domestic-water ladder, the siting table with its negative rules, the doubling rule, material grammar, the region, the 45-mechanism verdicts and the ranked gap list |
| `PRIOR-ART-FMG.md` §2.2, §7, §8 | the world→plan delegation contract (the chair's addendum), the ranked accelerants, where they beat us |
| ODQ §161(a–n), §171, §177, §184, §190–§205, §209, §212, §214, §229, §230, §232, §238–§241, §244, §249–§253 | every map law the brief named, read from the ledger branch |
| `laneMFB8`, `laneMFB8b`, `laneMFARCH`, `laneMFARCH2` receipts | BUILT status, the executed figures, the carried defects, the hazards for a landing executor |

**Deliberately NOT read or used:** `laneHFM1-corpus-measured.csv` row-by-row (313×47 — I quoted
the atlas's and HF-M1's own computed bands rather than recomputing from the CSV, because §2.9's
ledger states that every band in the atlas was recomputed from it and *"no number was carried
forward unverified"*); any plate; any holdout id.

---

## §2 · THE FOUR CONFLICTS FOUND BETWEEN CANONICAL SOURCES, AND HOW I RULED

**The brief said: where two sources conflict, say so and rule with reasons. Four exist. All four
are in the spec's §0.4 and all four rulings are vetoable.**

### C-1 · ⭐ PAPER WARMTH: THE ATLAS IS STALE ON ONE NUMBER

`laneMFS1-urbanism-atlas.md` §2.3.1 publishes the paper centroid `#FAEBD8` at **warmth 34** (the
union cohort). **ODQ §249.4(a) — collected AFTER the fold that produced that line — rules that any
axis not represented in the register index pins to HF-1 ALONE, and that "paper warmth pins at
37."**

**RULED: the ODQ ruling binds; the atlas's §2.3.1 paper row is stale on this one number and
nothing else.** The atlas itself flagged the sensitivity as vetoable in §2.3.0 (*"if the chair
prefers the lane's original figure, it is warmth 37, and only the paper row changes"*), and every
other band is insensitive to the union-vs-HF-1 choice.

⚠ **This is a real, live defect in the standing grading sheet and it is the address-rot class the
§244 fold exists to prevent, one ruling later.** I did not edit the atlas (this lane's scope is
`GENERATION-SPEC.md` and the receipt), so **the atlas still carries 34 and a re-deriver reading
it will target the wrong number.** Recommend the chair fold §249.4(a) into ATLAS §2.3.1 — it is
a one-row edit.

### C-2 · THE BUILT `GRAIN_BAND`'s METROPOLIS RUNG IS SUPERSEDED

`tierGrammar.js` carries metropolis **100–130**. ATLAS T-01 **re-pinned it to 80–120** at §244.5
(the old rung rested on n=1; the re-pin on n=9). **RULED: the corrected band binds; the code is
stale.** Re-pinning is a wave-nine first-order edit, it moves the metropolis target *down*, and
**it must be declared as a legitimate one-time shift, never quietly** — it shrinks a reported miss
for a real reason.

### C-3 · THE WITHDRAWN LOW RUNGS ARE STILL GENERATION INPUTS

ATLAS ⛔ withdrew thorp (8–14) and hamlet (18–26); `GRAIN_BAND` still consumes both, and
`GRAIN_SEAMS` reads through them (`8 → 16 → 28 → …`), so they shape the curve at village tier
too. **I did NOT rule this** — it is **CHAIR QUESTION Q-1**, because the withdrawal is about
*measurement validity* and says nothing about whether the numbers are a defensible *generation*
target. Interim rule written into the spec: keep them, label them UNMEASURED in the code, and
issue no grading verdict at those tiers.

### C-4 · `radialDensityFalloff`: ATLAS GAP-B vs PLAN §1.5

ATLAS proposes it as a statistic **with per-morphology target bands**; PLAN finds the radial
reading is a **symptom** and that fitting to it re-bakes the concentric prior. **RULED: PLAN's
correction binds — and ODQ §250.6(b) has already adopted it as a general law.** Recorded because
a builder reading GAP-B alone would wire it as an input.

**One near-conflict recorded as NOT a conflict:** PLAN §8's grain figures (village 39.2 / town
54.5 / city 62.0 / metropolis 84.3) are a partial independent replication on windows that
deliberately sit on quarters. **T-01's bands remain the target; PLAN §8 is corroboration.**

---

## §3 · THE THREE NEW CHAIR QUESTIONS — holes nobody named, raised not filled

**These came out of putting the studies beside the code. None is answered in the spec.**

### Q-1 · MAY A WITHDRAWN GRADING TARGET REMAIN A GENERATION INPUT?

See C-3. Three options written out (keep-labelled / build the roof-count instrument first /
derive the low rungs from household count per J-B8-3). **Recommendation: keep-labelled now,
roof-count queued — but the chair must SAY so, because right now the code silently spends a
withdrawn number.**

### Q-2 · ⭐ THE EPOCH LADDER IS A **CIRCUIT** LADDER; THE CORPUS ALSO SHOWS **FABRIC** EPOCHS

This is the sharpest thing this synthesis found. `epochAxis.js` derives **one epoch per circuit
plus the suburb**, so **every unwalled leaf gets exactly ONE epoch** (MF-ARCH-2 §2.2's own table:
thorp, hamlet, village, mountain, fjord, year-018 → `rings 0 → one unwalled epoch`).

**But PLAN §6.1 measures legible FABRIC epochs independently of circuits: village 1–2, town 2–3,
city 2–4, metropolis 3–4.** So an unwalled village measured at two epochs gets one by
construction.

**Why it is load-bearing rather than pedantic:** §240.3's vintage triad, PLAN §6.2's three dials
and the whole of the spec's W4 are **per-epoch**. If an unwalled settlement can hold only one
epoch, **no unwalled settlement can ever show a vintage difference, a bearing change or an
attachment mode** — and §251's own measurement is that the walled/unwalled split is essentially
the tier line, so that is half the ladder.

⚠ **I did not propose the fix, deliberately: minting epochs from population growth is a KNOB
unless it is derived, and §240.2's "ring count is DERIVED, never a knob" is the binding condition
any answer must satisfy.**

### Q-3 · IS `GRAIN_BAND` THE **MEASURED** TARGET OR THE **DERIVATION** TARGET?

The code uses the same numbers for both. At town/city the drawing resolves and the measured value
lands in band. At metropolis the derivation computes ≈113 cells and the plate measures **70** —
the drawing loses ~38%. MF-B8 named the mechanism (*"the grain instrument measures what RESOLVES,
not what EXISTS"* — b7's town carried 82 plot modules across its window and counted 24.8).

**Two readings lead to different work**, and the metropolis miss sits on exactly the ambiguity.
The spec records my **PLAUSIBLE** reading — the band is both, and any measured shortfall is a
*drawing* defect to cure — with the reason (inflating the derivation would hide a drawing defect
behind a number, and `MFB8-runprobe.py` exists to separate them). **Not ruled.**

**Three carried questions are also restated** (Q-4 T-05's fill quantity + the market void at
village tier; Q-5 the extent derivation home; Q-6 §240.2's village-earns-zero-circuits against
the one-decider rule) so a build sheet does not run into them silently.

---

## §4 · THE CHAIR'S MID-LANE ADDENDUM — the FMG world→plan cross-check, executed

**Landed as spec §1.2** (`§1.2a` the parameter table, `§1.2b` the bearing to water, `§1.2c` the
population→extent exponent), with cross-references folded back into the S4 and S5 INPUTS blocks
so a builder meets the gap where the input is declared. **Scope held: it sharpened the inputs and
the ledger; it is not a new section of the pipeline.**

**The cross-check, all 13 city parameters dispositioned.** We are **ahead** on seed/identity,
population, river, farms, feature flags and greens (they threshold on population; we derive from
facts); **at parity** on coast; **behind on two, and one of those is `hub`** — whether the cell is
a route crossroad — which is spec **G-1, the region**, arriving from a third independent
direction.

### The two items the chair named

**1 · BEARING TO WATER — CONFIRMED as a real gap, filed as G-4 with its derivation home and a
hard constraint.** FMG passes the *direction* of the sea (an angle normalized to a 0..2 scale,
computed from the vector to the haven cell); we derive water **MODE** (§5.0b) and no bearing.
Its home is **the S2 terrain substrate (§161a)** — derived from geometry that already exists —
and it feeds district anchoring, the water-termination wall run, the second-bank rule and edge
kind per bearing.

⭐⭐ **THE DISTINCTION I DREW AND RECORDED AS BINDING, BECAUSE CONFLATING THESE WOULD BE A REAL
ERROR: a water bearing READ FROM TERRAIN mints nothing and is deterministic from the seed. A WIND
OR SUN BEARING MINTED AT GENERATION IS A NEW WORLD FACT, AND UNDER THE PROMISE A WORLD FACT IS
SEED-PERMANENT** — which is exactly why §251.5 refused it and CONTEXT §12.1 filed it as
owner-gated. **The spec puts the water bearing in the pipeline (G-4, blocked on G-2, then it is
one vector) and keeps wind/sun in Appendix A-1.**

**2 · THE POPULATION→EXTENT EXPONENT — reported beside our withdrawn fit, NOT adopted, with the
comparison's own limit stated first.**

⚠ **The honest report is that the two exponents are NOT directly comparable, and saying so is the
finding.** Ours (`5.7 × pop^0.27`, withdrawn) was fitted on **cells across** — a *grain* quantity.
Theirs (`2.13 × (population/urbanDensity)^0.385`) is on **plan extent** — a *size* quantity on a
different base. **Anyone who compares 0.27 to 0.385 as if they were the same quantity repeats the
atlas's own hybrid-evidence mistake in a new place.**

⭐ **Where it IS useful: as a cross-check on §161f's EXTENT curve — S5's `TIER_PROFILE` footprint
bands — not on T-01's grain.** Our measured extent ladder is **309 → 391 → 442** view units
(×1.27 then ×1.13, `laneMFB8-receipt.md` §1). Against the ×3.5 population step between the city
and metropolis exemplars, a 0.385 exponent predicts roughly **×1.6**; we deliver **×1.13**.
**Labelled PLAUSIBLE in the spec — it is arithmetic on two quoted figures, not an executed fit.**
It points the **same direction** as B8's own measured frontage-ladder residual, which B8 named a
§5 tier-table question for the chair and did not take.

**Does it support restoring a derivation home for extent? YES for the SHAPE, NO for the
constant** — and ⭐ **the restoration path ATLAS already named is now cheaper than it looks: fit
against settlements whose population is a FACT, i.e. our own leaves — 16 per tier,
byte-deterministic, with published extents.** *The instrument that could not be built from
reference art can be built from our own output.* **Filed as G-5 with that experiment named;
nothing installed; §5's tier table untouched.**

---

## §4a · THE SECOND MID-LANE ADDENDUM — MF-W1's two inputs, folded

**`laneMFW1-receipt.md` landed while §5–§9 of this receipt were being written. Both inputs are
folded into the spec; neither expanded scope.**

### 1 · THE AUTHORITATIVE FIGURE SET AND THE INDEPENDENCE CAVEAT

**Landed as spec §0.3a and §0.3b, with three consequential edits behind them.**

- **§0.3's open-items block went from TWO to ONE.** `waterViolations` 114 → 165 is
  **CHARACTERIZED and §252.3b is DISCHARGED**: **+47 from the fork-key salt cure re-rolling the
  meander (cause 101), −13 from the epoch/wall/version work (causes 97–100), which IMPROVED the
  figure.** ⭐ **MF-ARCH-2's own guessed cause is refuted by execution — `year-018` has NO circuit
  and moved by exactly the same +10 with a byte-identical violation key set.** **No cure owed.**
  The one remaining open item is the 32 unviewed plates.
- **§0.3a carries the single authoritative set** (`waterCrossings` 193 · `waterExempt` 28 ·
  `waterViolations` 165 · `bridges` 15 · `riverClaimWidth` 145.4 · `zoneOutside` 237 ·
  `zoneMajorityOutside` 217 · `zoneOffBand` 63 · `zoneUnwashedBodies` 2,137 · `landlocked` 0 ·
  `orphanStreets` 0 · `physicalViolations` 1) **with the two figures MF-ARCH-2 never reported
  called out**: `zoneUnwashedBodies` **halved 4,261 → 2,137 — the wave's largest single
  improvement** — and `bridges` **20 → 15**. **And the publication discipline is written as a
  rule: ONE movement with TWO named halves; `100 → 165` may never be published as one number.**
- **§0.3b carries the independence caveat, and it is promoted to a BINDING USAGE RULE (§2.0's new
  rule 6) rather than left as a footnote.** ⚠ **Ten distinct worlds wear sixteen names** — seven
  leaves share `mf-town-01`+riverside, two share `mf-city-01`+coastal — **so a one-river move
  publishes up to SIX TIMES.** ⭐ **I placed it in §2.0 deliberately: §2.0 is the block the spec
  says a later lane must inherit, and this is exactly the class of error that block exists to
  prevent.** It now governs every count in §2 and §4 of the form *"N over 16 leaves"*, and W0
  gains a one-line harness exit criterion (publish the 10-world total beside the 16-leaf total).

### 2 · ⭐⭐ G-34 — THE CURED PREDICATE THAT STOPPED AT A MODULE BOUNDARY

**Landed as ledger row G-34 at RANK 3, with its own sub-section §4.1a, plus a new §3.3
non-negotiable (#9) and a W0 item.** Ranks 3–31 were bumped by one; **`G-n` ids were designed as
stable identifiers precisely so this insertion costs no renumbering (J-SPEC-4, and it paid off
within the hour).**

**Why it earned rank 3 rather than a G-28 residual line:** the three arms are **one question** —
*which crossings the law intends to forgive* — and together they make **92 of 127 street-over-water
violations (72%) unexemptable BY CONSTRUCTION** (72 from the `crossPoint` vs `segSegClosest <
half` mismatch, 20 from `deriveBridges` refusing `rank === 'passage'`, 35 from first-crossing-per-
channel). **A residual line would have invited five patches; a ledger row at rank 3 asks for one
ruling.**

⭐⭐⭐ **THE CLASS, AND ITS SHAPE IS GENUINELY NEW.** The first three §238 recurrences were
**BLIND** predicates — a rule asking the wrong question. **This one was CURED, correctly, and the
cure STOPPED AT A MODULE BOUNDARY while a sibling kept asking the old question.** I specced it as
the coordinator directed — **one predicate, one home, and a check that fails when two modules ask
the same geometric question differently** — and placed it explicitly as **the enforcement analogue
of §241.5a's raw-handle guard**: the guard sits at the **publication point**, not at read sites,
for the same measured reason (a read-site scan must solve aliasing; a publication guard need not).
⛔ **The sentence a builder needs: a cured predicate with a private second spelling in a sibling
module is INDISTINGUISHABLE FROM AN UNCURED ONE at the census.**

**Two further arms of the same ruling are carried in §4.1a** because MF-W1 proved they are the
same question: the **dead-`anchorKey` mill** (⭐ *`a || b` is "a, AND b IS DEAD CODE" whenever `a`
is reliably truthy — a fallback that never falls back*; the cure is proved at **exempt +6,
violations 165 → 159, run-1 parchment SHAs BYTE-IDENTICAL**, and was **deliberately not landed**
under the §234 freeze), and the **coast-vs-river street arm** (a shore-parallel road scores **775
"crossings" on `city` and 555 on `fjord`**, so **the coastal leaves dominate the corpus total and
the figure is not comparable across terrains** — the §205A analogue of the half-ring exemption
MF-ARCH-2 had to turn from a tolerance into a rule).

⚠ **AND THE CAVEAT I CARRIED VERBATIM BECAUSE IT IS THE EASIEST THING TO GET WRONG: THE CURE IS
NOT TO CONVICT LESS.** It is to decide whether a band incursion without a centreline crossing is a
crossing at all, **and to say so in one place.**

⚠ **I did NOT re-verify any MF-W1 figure.** The 2×2, the authoritative set and the 92-of-127
arithmetic are quoted from its receipt. **Appendix C.3 item 6 says so.**

---

## §5 · WHAT THE SPECIFICATION CONTAINS, BY THE BRIEF'S FIVE HEADINGS

| brief item | where | shape |
|---|---|---|
| **1 · the pipeline, stage by stage, in derivation order** | §1 (S0–S23), with §1.1 the per-epoch loop and §1.3 the post-epoch stages | every stage carries INPUTS (named dossier fields, version/epoch axis explicit) · MECHANISM (formulas and thresholds where they exist) · OUTPUTS (artifact + content hash) · LAWS (ODQ sections) · CENSUSES (what must measure zero + the counterfactual that must red) · STATUS **BUILT** (module + receipt named) / **PARTIAL** (what exists, what is missing) / **NOT BUILT** (the mechanism to write) |
| **2 · the target sheet** | §2 | §2.0 the five binding usage rules incl. the strongest-cohort **sign check**; §2.1–§2.5 the bands; ⭐ **§2.6 names the four rows carrying ⛔ WITHDRAWN / UNBANDED so a grading pass leaves them blank instead of converting them into a pass or a fail** |
| **3 · the invariants** | §3 | §3.1 the four tier-invariants (§250.6a) **with the precision correction** — see §6 below; §3.2 what may never be a generator input (§250.6b) with three further cases; §3.3 determinism and identity, eight numbered non-negotiables; §3.4 the twelve banned priors + three plan-level additions; §3.5 anomaly-as-collision |
| **4 · the gap ledger, ranked by leverage** | §4 | 33 rows, each with derivation home, blast radius and dependencies; §4.2 itemises the residual/carried-defect set; ⭐ **§4.3 states the dependency graph as EDGES, including the two that cost a wave if they surface late** |
| **5 · the implementation order** | §5 | W0–W8, every exit criterion a measurement; §5.1 states what each wave buys |
| *(discipline)* | Appendix A / B / C | A: **12 rows of inspiration, NOT derivable**, each with the fact that would be needed; B: **6 chair questions, 3 NEW**; C: instrument map, module map, and what this lane did not do |

**Design decision recorded: `G-n` is a stable IDENTIFIER and the RANK is a separate column**, so
a row can be re-ranked without renumbering the program. Two studies rank the same items
differently (PLAN's #1 is frontage-first; CONTEXT's #1 is the substrate) and both ranks are
quoted in the affected rows.

---

## §6 · THREE THINGS THE SYNTHESIS SHARPENED THAT NEITHER STUDY SAID ALONE

**1 · ⭐⭐ "TIER-INVARIANT" DOES NOT MEAN "CONSTANT", AND A CENSUS THAT MISSES THIS WILL PIN THE
WRONG THING.** §250.6(a) adopted four tier-invariants (junction mix, dead-end rate, φ, block
elongation). PLAN measures the *same four quantities* as strongly variant along axes that are not
tier: dead-end rate varies with **wealth** (poor half +38%) and with **epoch age** (0.225 →
0.342); φ varies **7.9×, 9.5× and 2.4× within a single plate**; X share varies per epoch
(hf239's camp 0.088 vs its own vicus 0.028). **The correct statement, which the spec writes into
§3.1: these four are invariant with POPULATION AND TIER and variant with WEALTH, EPOCH AND
FOUNDING MODE.** A census that pins them per-leaf enforces the first; **a census that pins them
per-district or per-epoch would forbid the second and would be wrong.** Neither study says this;
it falls out of reading §8 against §1.2/§1.3/§6.2.

**2 · THE SAME MECHANISM IS RANKED #1 BY ONE STUDY AND #3 BY THE OTHER, AND IT IS THE SAME
OBJECT.** ATLAS's GAP-D (block silhouette, from the lineweight side), PLAN §2.4 (the block's face
and interior in different registers), PLAN §2.3 (the plot series measured *from* the frontage) and
PLAN §10.1 (what the eye actually follows) are **four descriptions of one missing object: the
frontage line**. §250.6(d) recorded that two studies reproduced the un-defer recommendation on
disjoint evidence; the spec goes one step further and **names the object they are all pointing
at**, which is why G-7 is written as *frontage-first generation* rather than as four separate
rows.

**3 · WAVE NINE WAS OVERLOADED BY SIX INDEPENDENT RULINGS AND HAD AN UNWRITTEN INTERNAL ORDER.**
§229.3, §239.5, §240.4, §250.2, §250.5 and §251.4 each slotted work into "wave nine" without
reference to each other. **Two of the resulting orderings are forced and both are already ruled**
— §214's terrain arm behind the substrate (§251.4a) and §240 with the run chain (§251.4b) — **and
a third is forced by consequence**: `circuitDemotion` must not lag multi-ring output or the rings
erase the history (§250.5). §5 decomposes wave nine into W0–W8 accordingly. **This is a
decomposition of existing mandates, not a new mandate.**

---

## §7 · WHAT I DID NOT DO — stated plainly

1. ⛔ **EXECUTED NOTHING.** No build, no test, no measurement, no render, no plate viewed.
   Every CONFIRMED label is an upstream lane's evidence, cited.
2. ⚠ **DID NOT RE-VERIFY MF-W1's FIGURES.** Its receipt landed mid-lane and is folded in whole
   (§4a), but the 2×2 decomposition, the authoritative set and the 92-of-127 arithmetic are
   **quoted, not recomputed**. ⭐ **Nor did I re-check its claim that the exemplar seeds collide
   7/2** — that is a `find`-able fact about the fixture set and a builder should confirm it once
   before spending §0.3b's rule on it.
3. ⛔ **DID NOT VIEW MF-ARCH-2's 32 PLATES.** That obligation is stated as **W0's first exit
   criterion** rather than quietly absorbed. ⚠ Ten walled leaves' walls changed shape and nobody
   has looked.
4. ⛔ **DID NOT EDIT THE ATLAS OR EITHER COMPENDIUM.** Where the spec disagrees it rules in its
   own §0.4 and does not touch the source. ⚠ **Consequence, and it is a live defect: ATLAS
   §2.3.1 still publishes paper warmth 34 against §249.4(a)'s ruling of 37.** Recommend a
   one-row fold.
5. ⛔ **INVENTED NO LAW AND FILLED NO HOLE SILENTLY.** Three new holes became Q-1/Q-2/Q-3.
6. ⛔ **DECIDED NO OWNER-GATED ITEM**: terrain vocabulary (G-30), `eventFootprint` (G-11), the
   faubourg district-id change, the click-region contract, microclimate bearings (A-1), §5's tier
   table (G-5) and the metropolis op ceiling all remain raised.
7. ⛔ **DID NOT RECOMPUTE ANY BAND FROM THE CSV.** I quoted the atlas's and HF-M1's computed
   figures with their instrument named. A band in this spec is a *citation*, never a re-derivation
   — which is deliberate, because §244.4's sign check means an incorrect re-derivation moves three
   bands the **wrong way** and I ran no instrument that could have caught that.
8. ⛔ **NO PIN, NO CENSUS TUPLE, NO PACKET ROW, NO MUTATION-MANIFEST ROW.** Nothing here is
   enforceable machinery; every band is a target for the chair to convert.

---

## §8 · JUDGMENTS (all vetoable)

- **J-SPEC-1 · THE ODQ RULING BEATS THE ATLAS ON PAPER WARMTH (C-1).** §249.4(a) is the later
  instrument and it ruled on exactly the sensitivity the atlas flagged as vetoable. *Say "veto"
  and the target reverts to 34; only the paper row changes either way.*
- **J-SPEC-2 · THE CORRECTED METROPOLIS GRAIN BAND BEATS THE CODE (C-2).** n=9 over n=1.
  *The consequence is a declared shift and it must not be quiet.*
- **J-SPEC-3 · I DID NOT RULE C-3 AND MADE IT Q-1 INSTEAD.** A withdrawal for measurement
  invalidity does not automatically withdraw a generation target, and deciding it either way
  inside a synthesis lane would install a number nobody measured. *Veto and I will rule it.*
- **J-SPEC-4 · `G-n` IS AN IDENTIFIER, NOT A RANK.** Two studies rank the same items differently
  and dependencies re-order the build anyway; stable ids survive re-ranking.
- **J-SPEC-5 · THE PER-EPOCH LOOP IS WRITTEN AS A LOOP (S6–S14), NOT AS A FLAT STAGE LIST.** It
  is what §240 actually says, and it is what makes the inertia seam (§240.4) visible at the right
  place in the order.
- **J-SPEC-6 · WAVE NINE IS DECOMPOSED INTO W0–W8 RATHER THAN RESTATED.** The dependency edges
  force most of it; where they do not, I ordered by (unblocks × cheapness) and said so. *Veto
  reorders the waves; the edges in §4.3 are not vetoable, they are rulings.*
- **J-SPEC-7 · THE COUNTRYSIDE SITS AT W5 RATHER THAN EARLIER, AGAINST ITS OWN LEVERAGE RANK.**
  W1–W4 change the fabric it must meet at the junction band, so building it first pays for it
  twice. **I flagged the second-lane option explicitly** because §229.2(c) ratified it as wave-nine
  first-order and it is 85% of a low-tier plate. *This is the judgment in §5 most likely to be
  vetoed and it should be.*
- **J-SPEC-8 · THE FMG CROSS-CHECK REPORTS THE EXPONENTS AS NOT DIRECTLY COMPARABLE, AND SAYS SO
  BEFORE QUOTING THE NUMBER.** Reporting "0.385 vs our 0.27" without that sentence would have
  been the hybrid-evidence error in a new place.
- **J-SPEC-9 · THE WATER BEARING IS IN THE PIPELINE AND THE WIND/SUN BEARINGS ARE IN APPENDIX A.**
  One is read from terrain that already exists; the other mints a seed-permanent world fact. *The
  distinction is the whole of my reasoning and it is stated in §1.2b.*
- **J-SPEC-11 · G-34 WENT IN AT RANK 3 AND THE RANKS BELOW WERE BUMPED, RATHER THAN GIVEN A
  DECIMAL RANK OR APPENDED AT THE BOTTOM.** The coordinator said "near the top" and the ledger's
  own design (stable id, separate rank column) exists so that costs nothing. *Veto re-ranks it;
  the id does not move.*
- **J-SPEC-12 · THE EXEMPLAR-INDEPENDENCE CAVEAT BECAME A BINDING USAGE RULE (§2.0 rule 6), NOT A
  FOOTNOTE.** §2.0 is the block the spec tells a later lane it must inherit, and this is exactly
  the class of error that block exists to prevent. *It is the one place a caveat survives being
  skimmed.*
- **J-SPEC-13 · G-34 WAS SLOTTED INTO W0, NOT W6 WITH THE REST OF THE WATER WORK.** It is a
  ruling plus one predicate unification, it is cheap, and **it must precede writing more
  censuses** — putting it beside the water *systems* wave would let W2 and W3 add censuses on top
  of a known-broken exemption machinery. *Veto moves it later; the dependency edge in §4.3 is the
  argument against.*
- **J-SPEC-10 · THE SPEC IS DENSE RATHER THAN SHORT.** The brief said build sheet, not treatise,
  and 239 KB is not short. **My reading of "build sheet" was structural, not length-based:** every
  stage answers the same six questions in the same order, so it is a lookup surface rather than a
  narrative. *If the chair wants a shorter one, the cut is Part 1's evidence quotations — the
  bands, laws, censuses and statuses would survive at roughly a third the size.*

---

## §9 · HAZARDS AND NOTES FOR WHOEVER PICKS THIS UP

- ⚠⚠ **THE ATLAS IS THE STANDING GRADING SHEET AND IT NOW CARRIES ONE REFUTED FIGURE (paper
  warmth 34 vs §249.4a's 37).** This is the exact class §244 ordered recorded loudly — *a grading
  sheet that carries a refuted band grades every future wave against a lie.* **One row in ATLAS
  §2.3.1 and its role table.**
- ⚠⚠⚠ **THE COMMIT HAZARD IS THE SHARPEST THING IN THIS SECTION, AND IT IS MEASURED, NOT
  REMEMBERED.** `GENERATION-SPEC.md` is in `map-corpus/docs/`, which is **tracked** (§253.6 — the
  on-disk `.gitignore` reads `plates/ previews/ *.png *.jpg`, and `git check-ignore` exits 1 on
  the spec, so it is **not** ignored). It shows correctly as **`?? map-corpus/docs/GENERATION-SPEC.md`**.
  ⛔⛔ **BUT THIS WORKTREE'S HEAD IS `refs/heads/review-fixes-2026-07-08` AT `5e2b33f5` WHILE THE
  TREE HOLDS THE BUILD-BRANCH CONTENT, SO THE INDEX CARRIES 3,334 STAGED DELETIONS RIGHT NOW.**
  A naive `git add <the spec> && git commit` here would commit **one new file and 3,334
  deletions**. **This is the standing "the main worktree matches no branch" hazard, measured at
  this moment: `git status` here is NOT a safety check, and the ledger commit must go by the
  private-index method.** ⚠ I ran no staging command of any kind; the deletions are pre-existing
  and are **not mine to fix**.
  ⚠ Also worth knowing: **HEAD moved during this lane** (session start was `bc774bc1`), i.e. a
  sibling lane committed underneath me — re-read state before acting on any of it.
- ✅ **NO GATE RISK FROM THIS FILE, CHECKED.** `tests/docs/enforcement-claims.test.js` scans an
  explicit `DOC_FILES` list plus `src/**`, and `map-corpus/**` is in neither; separately I grepped
  the file for the exact `CLAIM_RE` phrases (`0 problems`, `machine-enforced`, `fails the gate`,
  `zero violations`, …) — **zero matches**. No other test in `tests/` references `map-corpus`.
- ⚠ **THE SPEC CITES SCRATCHPAD RECEIPTS FOR BUILT STATUS, AND THE SCRATCHPAD IS TEMPORARY**
  (§243). Every claim they carry is re-quotable from the sandbox tree, but **if the receipts are
  wanted permanently they belong under `map-corpus/docs/` with the rest.** Flagged, not moved —
  moving them is a scope call I did not have.
- ⚠ **W0 IS NOT OPTIONAL AND IT IS NOT MINE.** Two of its three items are outstanding obligations
  from the last two waves (the unviewed plates; the uncharacterized `waterViolations`), and the
  third is C-1/C-2/C-3's housekeeping. **A wave-nine lane that starts at W1 inherits both.**
- ⚠ **THE SPEC SUPERSEDES NO LAW; IT ORDERS THEM.** Where it and a later ODQ ruling disagree the
  ODQ wins, **and the disagreement should be folded back into the file** — the spec says so in its
  own closing line, because it will be the next document to rot if nobody does.

---

## §10 · CONFIRMED / PLAUSIBLE

**CONFIRMED (executed evidence exists, by a named upstream lane, quoted):** every BUILT status and
every figure attributed to `laneMFB8` / `laneMFB8b` / `laneMFARCH` / `laneMFARCH2`; every corpus
band attributed to the ATLAS, PLAN or CONTEXT with its instrument and n; the ODQ rulings quoted by
section; the FMG parameter contract as PRIOR-ART described it. **This lane executed nothing, so
none of these is CONFIRMED *by me* — each is confirmed by its cited source and the citation is the
receipt.**

**PLAUSIBLE (reasoned, no execution behind the specific claim):**
1. **The extent-ladder comparison in §1.2c** — ×1.13 delivered against a ~×1.6 prediction from an
   external exponent. It is arithmetic on two quoted figures, not a fit, and the spec labels it.
2. **My reading of Q-3** (the band is both a measured and a derivation target, and a shortfall is
   a drawing defect). Reasoned from MF-B8's own runprobe finding; **not ruled.**
3. **The wave ordering in §5** where dependency edges do not force it (W3 before W4; W5's
   placement; W6 before W7). Reasoned from unblocks × cheapness; **J-SPEC-6/7 make it vetoable.**
4. **The claim that Q-2 is a genuine hole** rather than something ruled somewhere I did not read.
   I read every ODQ section the brief named plus §150–§253's headers; **I did not read every
   section of the ODQ in full**, so a ruling could exist outside the named set. **The experiment
   that would settle it: grep §150–§253 for a fabric-epoch derivation independent of circuits.**

**CONFIRMED BY ME, and it is the only thing in this lane that is:** the spec's own structural
integrity — 31 well-formed tables, 33 ledger rows, no duplicate id or rank, no ragged row —
executed after the final edit, and it caught a real defect I had introduced (§0).

**The single experiment that would most change this document:** viewing MF-ARCH-2's 32 plates.
Every judgment about what the epoch axis currently *looks* like is inherited from a lane that
said, in terms, that nobody had looked.

**The single RULING that would most change it:** G-34. It is rank 3, it is cheap, the cure is
already proved and pixel-free — **and until it lands, 72% of one census's convictions cannot be
forgiven by any correct output, which means the figure is not yet a grading surface.**
