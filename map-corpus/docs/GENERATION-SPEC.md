# THE GENERATION SPECIFICATION

### Lane MF-SPEC (Opus 5), 2026-08-17. ODQ §246.3 — the synthesis of the three studies, the corrected atlas and the architecture program into ONE build sheet.
### This document, not the organically grown charter, is the map program's spine and wave nine's build sheet (§246.3).
### Advisory/specification deliverable. Read-only lane: no git writes, no memory writes, no edits outside this file and `laneMFSPEC-receipt.md`.

### ⭐⭐ FOLDED BY LANE MF-SPEC2 (Opus 5), 2026-08-17, under ODQ §264 — THE RECONCILIATION FOLD.
### The owner ordered everything discussed across the whole program reconciled into ONE build sheet for the best product we can make — comprehensive, cohesive, exhaustive, coherent, seamless, careful, and **above all IMMERSIVE AND IMPACTFUL**. This was a **BOUNDED FOLD, NOT A NEW STUDY**: the spec was already ratified (§262.1) and W0 was already executing. What it lacked was the two prior-art studies and the four chair corrections that landed *after* it was written.
### Folded here: **§261** the provenance correction and a contamination sweep of the whole document · **§263** the FTG study (the dependency graph, the triangular-remnant substitution, the epoch-convergence correction) · **§259**'s surviving mechanisms · **§262.2** G-34 as ruled · **§263.6a** the two missing instruments · **§264.2** the per-wave immersion payload · and **§257.3**'s three rulings, which this document was still carrying as open questions.
### Every fold is marked ⟦FOLD §264⟧ so a reader can see what MF-SPEC wrote and what MF-SPEC2 added. Receipt: `laneMFSPEC2-receipt.md`.

### ⟦FOLD §275⟧ FOLDED BY THE FABLE CHAIR IN PERSON, 2026-08-17, under ODQ §275/§276 — THE EXTERNAL-RESEARCH ADOPTIONS.
### Two further research documents were assessed at §275; their adoptions are architected here as design, with NO implementation (owner's instruction — no credits). Folded: ⭐⭐ the COUNTERFACTUAL CAUSAL BENCHMARK (new §4.1d G-43, W8 exit 6, the sharpest test of the program's thesis; its original single Responsiveness score is superseded by §10.14's directional responsiveness, precision, collateral and violation contract) · the RENDERER-HALO ABLATION (G-44, W8 exit 7) · the REAL-HISTORICAL STRUCTURAL COHORT from the open Altaweel–Hanson–Squitieri preindustrial street-network dataset (G-45, W8 exit 8 — history grounds STRUCTURE, the corpus grounds LOOK, the dossier grounds CAUSE) · EVIDENCE-GRADED LAWS and the EXPLAINED-IRREGULARITY doctrine (new §3.7) · the HEALTHY-VACANCY prior and WALL-MATERIAL variable (G-46/G-47, routed) · and the parked/rejected register at the end of Appendix A. Marked ⟦FOLD §275⟧ throughout.

---

## §0 · HOW TO READ THIS, AND WHAT IT IS FOR

**The reader this is written for:** an engineer with no memory of this program who has to
build the settlement-map generator. Every stage below states what it consumes, what it
computes, what it emits, which law binds it, what must measure zero, and whether it exists.

**What this document is NOT.** It is not a treatise, not a re-derivation, and not a new law.
Every figure here is quoted from a named source with its section. Where two sources conflict
I say so and rule with reasons (§0.4). Where a mechanism has no derivation home it is in
Appendix A ("inspiration, not derivable") and **must not** enter the pipeline. Where the
synthesis found a hole nobody named, it is a numbered **CHAIR QUESTION** in Appendix B and is
**not** filled silently.

### §0.1 · HONESTY KEY

| mark | meaning |
|---|---|
| **CONFIRMED** | executed evidence exists — a measurement, a test run, a census, quoted with its instrument |
| **PLAUSIBLE** | reasoned from confirmed facts; no execution behind this specific claim |
| **BUILT** | the mechanism exists in the sandbox tree at MF-ARCH-2's tip, with the module and the receipt that proved it named |
| **PARTIAL** | some of it exists; what exists and what is missing are both stated |
| **NOT BUILT** | the mechanism must be written; the sketch is here |
| ⛔ **WITHDRAWN** | the *target* has been retracted; not a pass, not a fail, and it may not be graded (§249.2's fifth verdict) |
| ⚠ | a hazard that has bitten, or a figure that must not be read as more than it is |

**This lane executed nothing.** It read; it did not build, measure, or run the generator. Every
**CONFIRMED** label below therefore means *"a named upstream lane executed this and its receipt
quotes the output"*, and the receipt is cited. Nothing in this document is a fresh measurement,
and no number here was computed by me.

### §0.2 · CANONICAL SOURCES (§243 — cite these paths, never the scratchpad mirror)

| short name | path | what it is |
|---|---|---|
| **ATLAS** | `map-corpus/docs/laneMFS1-urbanism-atlas.md` | the graded target sheet, as corrected by the §244 fold (MF-S2). Its §2.9 correction ledger and §2.8.1 usage rules are **binding**. |
| **PLAN** | `map-corpus/docs/MORPHOLOGY-PLAN.md` | MF-S3a — street graph, blocks/plots, districts, centres, epochs, decay, invariants, anomaly |
| **CONTEXT** | `map-corpus/docs/MORPHOLOGY-CONTEXT.md` | MF-S3b — terrain, water, defence, edges, institution relations, circulation, morphotypes. 45 mechanisms `CX-01…CX-45`, verdicts **3 HAVE / 18 PARTIAL / 23 MISSING / 1 NOT-DERIVABLE** |
| **PRIOR-ART** | `map-corpus/docs/PRIOR-ART-FMG.md` | MF-X1 — Azgaar's FMG as prior art. Headline: **nobody ships the world→plan join**. ⚠ A bare **PRIOR-ART** citation anywhere in §1 means **this file**; the two studies below are always named. |
| ⟦FOLD §264⟧ **WATABOU** | `map-corpus/docs/PRIOR-ART-WATABOU.md` | MF-X2 — Watabou's *Medieval Fantasy City Generator* as prior art (collected §259). ⛔ **GPL-3.0, adoption of code REFUSED OUTRIGHT.** Headline: **character is a PARAMETERISATION, not an algorithm** |
| ⟦FOLD §264⟧ **FTG** | `map-corpus/docs/PRIOR-ART-FTG.md` | MF-X3 — Thomas Allerton's *Fantasy Town Generator* and the empty `TownGeneratorOS` fork (collected §263). Headline: **the dependency graph is the best mechanism in either study, and §240 is CONVERGENT rather than unique** |
| **CSV** | `map-corpus/docs/laneHFM1-corpus-measured.csv` | 313 plates × 47 fields, the measured register |
| **GRAIN JSON** | `map-corpus/docs/HFM1-grain2.json` | 57 grain windows (22 reproduced byte-identically from MF-S1 + 35 re-set) |
| **LAWS** | `refs/heads/review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md` | ODQ. Map laws: §161(a–n), §171, §177, §184, §190–§205, §209, §212, §214, §229, §230, §232, §238–§241, §244, §249–§253 |

**§287/§10 STATUS OVERLAY.** `PLAN` and `CONTEXT` remain canonical inventories of visual-corpus
observations and proposed reconstruction seams, but they are not historical mechanism authority.
Their `HAVE/PARTIAL/MISSING` labels describe the older design comparison only. §§10.17–10.23 govern
runtime promotion, evidence scope, probability, rural state and canonical-cause requirements, and
win over any proposed default in those compendia.

**Receipts for BUILT status** (scratchpad, temporary — the claims are re-quotable from the tree):
`laneMFB8-receipt.md` (the geometry wave), `laneMFB8b-receipt.md` (the wall/fabric hotfix and
the §234 architecture pilot), `laneMFARCH-receipt.md` (the SCC diagnostic and the cycle
attribution), `laneMFARCH2-receipt.md` (the epoch/version axis), **`laneMFW1-receipt.md` (the
water characterization — §0.3a's authoritative figure set, §0.3b's independence caveat and
G-34's predicate-boundary finding all come from it).**

### ⟦FOLD §264⟧ §0.2a · ⭐⭐⭐ WHERE THE CORPUS CAME FROM — READ THIS BEFORE USING ANY PRIOR-ART FINDING (§261)

**This is the most important correction in the fold, because it changes what counts as evidence.**

⭐⭐ **THE 313 PLATES CAME FROM AN IMAGE GENERATOR, NOT FROM ANY PROCEDURAL GENERATOR.** The owner
exemplified a style with screenshots at the outset, but the plates were drawn by an image model
(nano-banana-pro) working from its own training in historical and fantasy cartography. They were
**not** produced by imitating Watabou, FTG, or any other town generator, and they **measure richer
than those generators' flat vector output on every axis we grade** (§256.2, §261.1).

⛔ **THE CHAIR'S OWN EARLIER FRAMING — "an image model's painterly imitation of Watabou's output",
and §254.1's "the original mechanism behind the style we have been measuring" — IS RETRACTED**
(§261.1/§261.2a). Nothing in this document may rest on it.

> ⭐⭐⭐ **THE STANDING LAW (§261.4), AND IT SHARPENS §256: PRIOR ART IS NEVER EVIDENCE ABOUT THE
> CORPUS. ONLY THE CORPUS IS EVIDENCE ABOUT THE CORPUS.**
> **Prior art supplies candidate MECHANISMS · the corpus supplies the TARGET · the dossier supplies
> the CAUSE.** No source may substitute for another's role.

**THE THREE-LEG TEST EVERY ADOPT VERDICT IN THIS DOCUMENT MUST PASS (§256.3 + §261.4):**

| leg | what it requires | failure mode it prevents |
|---|---|---|
| **(a) CAUSE** | the **dossier fact** that drives the mechanism | a free parameter — decoration under §246 |
| **(b) LOOK** | a corpus metric **that actually exists** in `laneHFM1-corpus-measured.csv`, `MFS3a-planmetrics.json`, `MFS3a-voidmetrics.json` or `MFS2-bands.json`, whose measured band gates the output | gating one quantity with another's number, or with no number at all |
| **(c) ⭐ DIRECTION** | an argument for **why this mechanism moves us TOWARD the corpus's measured values** — it was engineered for a different aesthetic and we hold no prior entitling us to assume it lands where we need | borrowing a mechanism that is good *for them* and silently assuming it is good *for us* |

⛔ **A mechanism failing leg (c) is INTERESTING-BUT-UNGATED and sits OUTSIDE the adoption ranking**
— recorded in **§4.1b's tail** so it is neither lost nor smuggled in. §263.5 records the correction
working as designed: 10 FTG adoptions grew all three legs, two were flagged weak on (c) in place,
and **6 mechanisms were pushed out of the ranking entirely.**

⚠⚠ **AND THE ATTRIBUTION CORRECTION THAT TRAVELS WITH IT (§261.2b).** WATABOU §10.2's scoring —
*"twelve of our inferences refuted, nine of them our own reverse-engineering errors"* — **is wrong
as attributed.** A disagreement between Watabou's mechanism and something we **measured in the
plates** is not our error; it is **two independent sources differing, which is expected.** Only
misreadings of our OWN measurements or our OWN code are our errors. **The twelve divergences stand
as facts; their attribution is withdrawn.** ⛔ §259.7's live-export **fidelity check is likewise
WITHDRAWN as framed** — sampling Watabou's exports cannot tell us how faithful our corpus is,
because the corpus was never imitating Watabou.

**WHAT SURVIVES §261, AND IT IS STILL SUBSTANTIAL** — these are the four findings this document
folds, in descending strength of link to our own measurements:

1. ⭐ **T-DOMINANCE and EMERGENT TOWER PLACEMENT are MECHANISM EXPLANATIONS OF NUMBERS *WE*
   MEASURED** — the 43:1 T:X ratio (§1.1.7a) and the tower rhythm were **corpus-measured first**,
   and the prior art explains *how* a generator produces them. **These are the strongest surviving
   links**, because the corpus supplied the target before the mechanism was read (§261.3).
2. ⭐ **THE SETBACK MECHANISM survives because §239's OUTCOME was corpus-confirmed independently**
   — the wall-side street was measured in the plates (7/7 on some runs) before any source was read.
3. ⭐ **CHARACTER AS A FOUR-AXIS PARAMETERISATION is ARCHITECTURE-SHAPED and survives untouched** —
   it is a statement about how to *organise* a generator, not a claim about what the corpus looks
   like, so §261 does not reach it (§261.3). See **S6** and **G-38**.
4. ⚠⚠ **CHAOS-AT-LARGE-SCALE / ORTHOGONALITY-AT-SMALL-SCALE IS DOWNGRADED TO A HYPOTHESIS ABOUT
   OUR MUSH — NOT A DESCRIPTION OF OUR TARGET.** §261.3 is explicit: **it must be TESTED against the
   corpus's own measured block elongation and plot variance BEFORE it drives a rework.** It is
   entered as a named, metricised work item — **G-39** — and **no rework may be started on it until
   that test returns.**

**THE CONTAMINATION SWEEP OF THIS DOCUMENT — CONFIRMED, and the result is better than expected.**
Every occurrence of `watabou`, `imitat*`, `prior.art`, `procedural generator`, `the original`,
`FTG`, `image generator`, `north star`, `reference art` and `the style` was read in place. **MF-SPEC
was written before both GPL studies collected, so it never inherited the retracted framing:** its
only prior-art source was FMG, and its single `Watabou` mention (§1.2's opening) is a factual
statement that *FMG delegates plans by URL to Watabou's closed generators* — a fact about FMG, not
a claim about our corpus. **Two phrasings were nevertheless tightened for §261 and are listed in the
receipt.** ⭐ **The document's own instinct was already right:** Appendix **A-8** says the corpus's
mis-shaped blocks come *"from a model's hand"* and refuses to imitate them — which is exactly
§261's law, written before §261 existed.

### §0.3 · THE STATE OF THE TREE THIS SPEC IS WRITTEN AGAINST

The generator lives in the **sandbox** (`mf-proto/build-out/**`), not in the repo. Nothing in
the map program has landed on a branch. The tip is MF-ARCH-2's.

**Executed at that tip (CONFIRMED, `laneMFARCH2-receipt.md` §0):**

```
vitest (lane config, bare)               7 files / 162 tests passed, ZERO pins re-recorded
cross-process determinism                10 processes, identical=10 mismatched=0
                                         87da9c41a892a3d764c17f20728dc94437e1d868ac5f7589a46df545c1a7bf7c
cross-ENGINE determinism (4 V8 modes)    1 distinct digest
§17 / §17.4 / §205A / §200 drawn census  0 / 0 / 0 / 0 over 23,391 bodies, AREA-TRUE
§202 landlocked · §201B orphan streets   0 · 0
§232 district straddlers                 0
§240.1 containment residual, every ring  0 · epoch members outside own circuit 0 of 15,176
op ceiling (§217 per-tier ratchet)       96/96 renders under their tier ceiling
purity scan (comments stripped)          Math.random/Date/localeCompare/Math.pow/trig — NONE
sizeBaseline                             MAX 790 (buildFabric.js) against 800
SCC · module graph                       43 nodes / 151 edges — ACYCLIC
SCC · stage graph, binding granularity   129 nodes / 446 edges — 0 NON-TRIVIAL SCCs
SCC · stage graph, field granularity     364 nodes / 847 edges — 0 NON-TRIVIAL SCCs
```

⚠ **ONE THING AT THE TIP IS OPEN AND A BUILDER MUST KNOW IT.**
**Nobody has looked at MF-ARCH-2's plates.** Ten walled leaves' walls changed shape and the ditch
changed ring; 32 plates sit in `mf-proto-out/arch2/` unviewed (`laneMFARCH2-receipt.md` §9.8).
**That is wave nine's first act, before any new build.**

**The other — `waterViolations` 114 → 165 — is now CHARACTERIZED (lane MF-W1, `laneMFW1-receipt.md`).**
⭐⭐ **THE VERDICT: NOT A REGRESSION — A DIFFERENT RIVER**, and ⟦FOLD §297/§298⟧ the verdict is
restated at its true grade: **NOT-DISPROVED**, not proven.
⛔ ⟦FOLD §297/§298⟧ **THE DECOMPOSITION IS CORRECTED IN PLACE (§297.6a).** The published pair
(**+47**, **−13**) **sums to +34 and was arithmetically impossible** against a **+51** move.
**The two valid orderings of the same 2×2 are (+64, −13) and (+4, +47), with an INTERACTION TERM
of −17** — and the interaction is exactly what the old sentence dropped when it claimed the two
orderings "agree to the unit." Read it as: **the meander re-roll and the epoch/wall/version work
are not separable into two clean halves; their joint effect is −17 and the ordering decides which
half wears it.** ⚠ **The "changed NOTHING" / "distributionally identical" framing is likewise
restated: CONSISTENT WITH NOISE AT n=6 — a real shift of up to ~+38 was undetectable at that
sample size.** ⭐ **And MF-ARCH-2's own guessed cause is REFUTED BY EXECUTION: `year-018` has NO
CIRCUIT AT ALL and moved by exactly the same +10 with a byte-identical violation key set** — no
wall can explain a move on a leaf that has no wall. **Verdict: 92% sample, 8% architecture, with
the architecture half pointing the RIGHT way. No cure is owed.**

### §0.3a · ⭐ THE ONE AUTHORITATIVE FIGURE SET — use these, not any earlier vintage

**Three vintages of these numbers exist and only this set was re-measured on ONE instrument
(`laneMFW1-receipt.md` §4, every cell executed).** Quoting a mixed vintage silently adds an
instrument correction to a sample change.

> **§205A / §203 AT THE LANDING TIP:** `waterCrossings` **193** · `waterExempt` **28** ·
> `waterViolations` **165** · `bridges` **15** · `riverClaimWidth` **145.4** · `zoneOutside`
> **237** · `zoneMajorityOutside` **217** · `zoneOffBand` **63** · `zoneUnwashedBodies`
> **2,137** · `landlocked` **0** · `orphanStreets` **0** · `physicalViolations` **1**.

⭐ **TWO OF THESE MF-ARCH-2 NEVER REPORTED, AND ONE IS THE WAVE'S LARGEST SINGLE IMPROVEMENT:**
`zoneUnwashedBodies` **HALVED, 4,261 → 2,137**, and `bridges` **20 → 15** — the visible
consequence of the re-rolled river, which belongs beside `waterCrossings` rather than being
discovered later as a surprise.

⚠ **STATE THE MOVEMENT AS ONE MOVEMENT WITH TWO NAMED HALVES, NEVER AS ONE NUMBER.** MF-ARCH's
predicate corrections account for `waterCrossings` **+16**, `waterViolations` **+14** and
`zoneMajorityOutside` **−186** on a **byte-identical fabric**; MF-ARCH-2's fabric change accounts
for the rest. ⛔ **`100 → 165` IS NOT ONE MOVEMENT and must never be published as one.**

### §0.3b · ⚠⚠ THE EXEMPLAR SET IS NOT INDEPENDENT — this caveat travels with every corpus-wide figure

**The 16 exemplar leaves are not 16 worlds. SEVEN share seed `mf-town-01` + riverside** (town ·
siege · plague · famine · year-018 · year-100 · highwater) **and TWO share `mf-city-01` +
coastal** (`laneMFW1-receipt.md` §0). **So a corpus §205A total publishes a ONE-RIVER move up to
SIX TIMES:** the +51 that read as a corpus regression is really *+10 on one river town (×6), +5
on that same town demoted, −7 on one coastal city (×2)*.

⛔⛔ **THE RULE THIS SPEC ADOPTS: ANY "CORPUS-WIDE" EXEMPLAR FIGURE IN THIS DOCUMENT OR ANY
RECEIPT MUST EITHER PUBLISH THE DISTINCT-SITE TOTAL (10 worlds) BESIDE IT OR SAY THAT IT DOES
NOT.** Every count below of the form *"N bodies across 16 leaves"* is a few settlements
multiplied. ⭐ *It is the cheapest structural prevention available and it costs one line in the
harness* — otherwise the next wave will again read a one-river move as a sixfold corpus
regression.

### §0.4 · CONFLICTS FOUND IN THE SOURCES, AND HOW THEY ARE RULED HERE

Four places where two canonical sources disagree. Each is ruled with a reason; each ruling is
vetoable and none of them invents a new law.

| # | the conflict | ruling |
|---|---|---|
| **C-1** | **Paper warmth.** ATLAS §2.3.1 publishes the paper centroid `#FAEBD8`, warmth R−B **34** (the union cohort). ODQ **§249.4(a)** rules that any axis not represented in the register index pins to **HF-1 ALONE**, and that **"paper warmth pins at 37."** The atlas was folded *before* that ruling and still carries 34. | ⭐ **THE ODQ RULING BINDS: paper warmth targets 37.** §249 is the later instrument and it ruled on exactly this sensitivity, which the atlas itself flagged as vetoable in §2.3.0 ("if the chair prefers the lane's original figure, it is warmth 37, and only the paper row changes"). **The ATLAS's §2.3.1 paper row is stale on this one number and nothing else** — every other band is insensitive to the union-vs-HF-1 choice (ATLAS §2.3.0). A builder targets `#F9E9D5`-family warmth 37 within band L 226–244 / warmth 20–50. |
| **C-2** | **The metropolis grain band.** The BUILT `GRAIN_BAND` table (`tierGrammar.js`, `laneMFB8-receipt.md` §1) carries metropolis **100–130**. The corrected ATLAS T-01 **re-pinned it to 80–120** (§244.5, ATLAS §2.1a). | ⭐ **THE CORRECTED BAND BINDS; THE CODE IS STALE.** The 100–130 rung rested on **n=1** (hf34 on MF-S1's window); the re-pin rests on n=9. The generator currently aims at a superseded number. **Re-pinning `GRAIN_BAND` and re-deriving `GRAIN_SEAMS` is a wave-nine first-order edit**, and it moves the metropolis target *down* — which shrinks the reported miss for a legitimate reason and must be declared as such, never quietly. |
| **C-3** | **The thorp and hamlet grain rungs.** ATLAS T-01 ⛔ **WITHDREW** thorp (8–14) and hamlet (18–26) — instrument invalid at tier (§244.5). The BUILT `GRAIN_BAND` still consumes both as **generation** inputs. | ⚠ **THE WITHDRAWAL IS A GRADING WITHDRAWAL, NOT AUTOMATICALLY A GENERATION WITHDRAWAL — AND NOBODY HAS RULED WHICH.** Raised as **CHAIR QUESTION Q-1** (Appendix B) rather than decided here, because deleting the rungs would leave `cells(pop)` undefined below village and inventing replacements would be tuning wearing measurement's clothes. **Interim rule for a builder: the two low rungs keep their current numbers, are labelled UNMEASURED in the code, and no grading verdict may be issued against them.** |
| **C-4** | **`radialDensityFalloff`.** ATLAS **GAP-B** proposes it as a derived statistic *with per-morphology target bands*. PLAN §1.5 finds the radial reading is a **symptom** of age/wealth/land-use and that fitting to it re-bakes the concentric prior. | ⭐ **PLAN'S CORRECTION BINDS, AND ODQ §250.6(b) HAS ALREADY ADOPTED IT AS A GENERAL LAW: a descriptive statistic may be a CENSUS and must be FORBIDDEN as a GENERATOR INPUT.** GAP-B stays as a census with its bands used for *detection*; the generator's inputs are epoch age, ward wealth and land use. |

One further disagreement is **not** a conflict and is recorded so nobody re-finds it: PLAN §8's
grain figures (village 39.2 / town 54.5 / city 62.0 / metropolis 84.3) are a **partial
independent replication** on MF-S3a's own windows, several of which deliberately sit on a
*quarter* rather than a whole settlement (PLAN §8's own ⚠). **T-01's bands remain the target;
PLAN §8's figures are corroboration, and the metropolis rung agrees closely and independently.**

### ⟦FOLD §264⟧ §0.4a · ⚠⚠ RULINGS THAT LANDED **AFTER** THIS DOCUMENT WAS WRITTEN — AND WHERE EACH IS NOW FOLDED

⭐ **THE CLASS THIS TABLE EXISTS TO KILL (§257.2): A RULING MADE AFTER A DOCUMENT IS FOLDED DOES NOT
REACH THE DOCUMENT.** That is the address-rot family applied to decisions, and it had already bitten
this program once — the atlas published paper warmth **34** for a full round after §249.4a ruled
**37**. **It had bitten this very document too:** three of Appendix B's six chair questions were
**ruled at §257.3, in the same ledger row that collected the spec**, and the document went on
carrying them as open. That is fixed here.

| ledger row | what it ruled | folded into |
|---|---|---|
| **§257.3(a)** ⭐⭐ | **EPOCHS ARE FABRIC EPOCHS, NOT CIRCUIT EPOCHS.** A wall is an **EVENT WITHIN** the epoch sequence, never its definition; a village that grew over two centuries has two vintages and no wall at all. **Wave-nine first-order.** | **S5** (status corrected) · **Q-2** (now RULED) · new gap **G-42** · **W2** |
| **§257.3(b)** | **A WITHDRAWN GRADING TARGET MAY REMAIN A GENERATION INPUT.** The thorp/hamlet rungs keep their numbers, labelled **UNVALIDATED-BY-INSTRUMENT**; the roof-count instrument restores validation | **C-3** · **Q-1** (now RULED) · **G-33** · **W0** |
| **§257.3(c)** | **`GRAIN_BAND` IS THE TARGET; the derivation aims at it and the DRAWN result is the truth.** The metropolis deriving ≈113 while drawing 70 is **a measurable disagreement between intent and output**, not an ambiguity. ⭐ **A NEW CENSUS IS ORDERED: derived grain and drawn grain must agree within a stated tolerance** | **Q-3** (now RULED) · **§2.6** · new instrument in **W0** |
| **§258.2** ⭐⭐ | **THE LAWS ARE INTENT; THE MECHANISMS ARE NEGOTIABLE.** A mechanism achieving a law's intent better than its stated execution **SUPERSEDES** the stated execution — recorded as *"intent PRESERVED, execution changed from A to B, measurable signature Y unchanged or improved."* A substitution that cannot name the preserved signature is a **quiet repeal and is forbidden** | new **§3.6** (the substitution register) |
| **§259** | Watabou collected. Surviving mechanisms: four-scalar character, setbacks, T-dominance and tower emergence | **§0.2a** · **S6** · **S7** · **S13** · **§3.4 #7** · **G-38** |
| **§261** ⭐⭐⭐ | **THE PROVENANCE CORRECTION.** Prior art is never evidence about the corpus; ADOPT needs a third leg | **§0.2a**, and a sweep of this whole document |
| **§262.2** ⭐⭐ | **G-34 RULED: three build-fixes, one bug-fix, one named exemption. THE CURE IS NOT TO CONVICT LESS** | **§4.1a** (the ruling in full) · **W0** |
| **§263** ⭐⭐ | FTG collected. **The dependency graph ranked #1 of all prior-art adoptions**; the triangular-remnant **substitution**; **§240 is CONVERGENT, not unique**; **two instruments ordered built** | **S5** · **S7** · **S11** · **S16** · **S18** · **§3.6** · **G-35…G-37**, **G-40** · **§4.1b** |
| **§264.2** ⭐ | **THE IMMERSION RULING** — dependency order **STANDS**, but the spec must state **per wave what a user would SEE and FEEL** | **§0.5** below |

---

### ⟦FOLD §264⟧ §0.5 · ⭐⭐ THE IMMERSION PAYLOAD, WAVE BY WAVE — WHAT A USER SEES AND FEELS THAT THEY COULD NOT BEFORE

**Why this section is here and why it is EARLY.** The owner's order names **IMMERSIVE and
IMPACTFUL** as the highest goals, and under §247 the map is the acquisition surface — *the visible
payload IS the product*. §5's wave order is driven by **dependency edges**, which is correct
engineering and says nothing about what a reader would see. ⛔ **A wave with no visible payload is a
wave the owner cannot adjudicate.** This table is the bridge, and it belongs at the front of the
document rather than buried at §5.

⭐⭐ **THE CHAIR HAS RULED (§264.2), AND THE RULING IS VETOABLE: DEPENDENCY ORDER STANDS.** Pulling
the §12 immersion suite (marginalia, legend, heraldry, curved lettering, event marks, walk rings,
pentimento) ahead of the substrate would mean **immersion built on wrong geometry, which must then
be rebuilt — and the declared same-seed shift gets paid twice.** *If the owner wants immersion
pulled forward at the cost of that rework, say so and it moves.*

⭐ **AND THE REASSURANCE THE RULING DESERVES, WHICH THE FORK OBSCURES: THE IMMERSION SUITE IS
LARGELY NOT WHAT IS BEING DEFERRED.** Per **S23**, chrome, lettering, the cartouche, the compass,
the scale bar, the legend and the heraldry are **already BUILT**, and §12's truth layer is the one
place we already **beat** the corpus (ATLAS Table C; banned prior #12 — *"our labels are TRUE, and
this is a competitive win"*). What remains of §12 is the **chrome rung** and the **annotation
contract** (G-26, W7) — small. **What dependency order actually defers is not the immersion suite;
it is the immersion suite's SUBJECT.** Marginalia on a town with no biography, a legend teaching
conventions the fabric does not yet obey, and walk rings over a street web with the wrong junction
mix are all *decoration on the wrong drawing*.

⛔⛔ **STREET NAMES REMAIN REFUSED (§163), AND ARE NOT RE-PROPOSED HERE — DELIBERATELY SO. AN OWNER
RULING IS NOT RE-LITIGATED BECAUSE THE GOAL WAS RESTATED.** No wave below carries them, no gap
ledger row proposes them, and a later lane that "discovers" them is re-finding a closed decision.

| wave | ⭐ WHAT A USER **SEES** | ⭐ WHAT A USER **FEELS** |
|---|---|---|
| **W0** · verification debt | ⚠ **NO NEW PIXELS, BY DESIGN — and that is stated rather than hidden.** The adjudicable payload is that **32 plates nobody has looked at get seen and verdicted**, and that the mill cure lands **byte-identically** (its receipt is that not one pixel moved) | *Confidence, not delight.* The numbers under every later claim become true: a water figure comparable across terrains, a lawful crossing that can actually be exempted, a corpus total that stops multiplying one river by six |
| **W1** · the substrate | The **fjord leaf shows a fjord** and the **mountain leaf shows relief**. Land refuses to be built on: fabric stops at the crag, thins on the slope, avoids the marsh. `hills` stops being a word in a cartouche and becomes a shape on the page | *This town is SOMEWHERE.* The site reads as chosen rather than dropped — §9.5b's own acceptance test is **terrain drama invisible = FAIL** |
| **W2** · the wall, whole | A wall that **stops at a cliff**, thins to a parapet on a scarp, **doubles back to wrap an abbey**, ends at the river with a chain across the water; **towers clustered where the road arrives and absent on the defended flank**; and ⭐ the **OLD** wall surviving as a **ring street**, its towers as **circular houses** in a rectilinear fabric, its ditch as a **curving ribbon of narrow gardens** | ⭐⭐ *This town had a life before this one.* A **biography instead of rings** — and it is **how a town looks old at a glance without drawing a single ruin** |
| **W3** · the fabric order | Continuous heavy **frontage lines** carrying rows of narrow abutting holdings, each divided by a light party line, **long pale tofts running back to a dashed back lane**; **corner buildings larger and articulated**; blocks that are **strips meeting at frank angles**, not squares | *Fabric, not a bag of rectangles.* The run-length rhythm is what the eye reads as **hand-laid**; the current parallel bars read mechanically (§252.3c) and this is the cure |
| **W4** · history in the fabric | Dated parcel/frontage projects, occupation, vacancy, reuse and rebuilding remain visibly distinct where canonical history supplies them; planned intent may be partly realised in ghost ink. No present wealth label changes grain, roads or materials | ⭐ *You can read registered change off the page without a legend* — the epoch axis becomes visible without inventing a universal old/fine, new/coarse or rich/poor sequence |
| **W5** · the outside | Canonical `RuralLandscapePhase` land uses, boundaries and known route ranks receive distinct projection primitives; no default open field, binary tenure, day-travel furniture, keeper, gallows or countryside ratio is minted | *The outside stops being wallpaper when the world actually knows it.* Missing rural canon remains visibly limited/`STRUCTURAL_ONLY`, not filled with plausible-looking history |
| **W6** · the systems | Explicit mills, leats, takes, discharges, supply dependencies and jurisdictions become spatial chains with receipts; access inequality or duplicate facilities render only when the world/evidence records them | ⭐⭐ *The place WORKS.* The map argues from registered physical and institutional relations, never from a name regex or a poor/rich visual trope |
| **W7** · the hand | **Wash that runs 2–8 px past its own ink line** and falls short elsewhere; **paper grain**; strokes that **swell and thin along a run**; corners that overshoot; **hachure tightening as the ground steepens** | ⭐ *It stops being vector art and becomes a drawn page.* Wash mis-registration is the single property that, omitted, keeps the output reading as software no matter what else is done |
| **W8** · the closing loop | ⭐⭐ **THE SAME TOWN ACROSS GENERATIONS — year 1 → year 100: growth, fire, shrinkage, rebuilding** (§247.3c as amended by §293.1), which after W2 and W4 is a *rendering of work already done*; and the map arriving **fast enough to be a wow moment** (§220, launch-blocking) | ⛔ ⟦FOLD §297/§298⟧ **"THE ARTIFACT NO COMPETITOR CAN PRODUCE", UNQUALIFIED, IS WITHDRAWN (§293.1c).** FTG also sells *the same town across time* — on an **HOURS-AND-DAYS** simulation axis. ⭐ **The corrected differentiator, and the wording that must be used: the same town ACROSS GENERATIONS — decades to centuries of DOSSIER-CAUSED, IMMUTABLE lived history — and a DURABLE STATIC ARTIFACT.** *Theirs embeds a live iframe; we hand the user a document.* Everyone else's map is of a place; ours is of a place **with a history**, and the difference is legible in two seconds. **The differentiator survives in that form and is stronger for being honest** |

⚠ **HOW TO READ THIS TABLE HONESTLY.** Every row is a **PLAUSIBLE** statement of intent, not a
measurement — it says what the wave's exit criteria are *for*. The measurements themselves stay in
§5, unchanged, and **a wave is still done when its numbers are in a receipt, never when its payload
sounds good.** ⭐ *The payload column is what the owner adjudicates; the exit criteria are what the
lane proves.*

---

## §1 · THE PIPELINE, STAGE BY STAGE, IN DERIVATION ORDER

**The shape of the pipeline, in one paragraph.** A settlement compile is an acyclic
materialisation of already-canonical world state. Region, terrain, hydrology and the
`RuralLandscapePhase` are upstream or co-derived constraints whose shared boundaries must be
reconciled before urban fabric claims the ground. Dated urban operations then materialise nuclei,
routes, blocks, frontages, parcels, occupation and fortification projects in their recorded order;
a circuit is an event within that history, never the definition of an epoch. Inside each fabric
project, the geometric order is **streets → blocks → frontage → plots → footprints**, never the
reverse. Institutions and water works materialise only from explicit relations/flows. S18 projects
canonical rural state—or returns `STRUCTURAL_ONLY`—and never fills the urban remainder with a
plausible default field system. The ground law makes every spatial body legal, the censuses prove
it, and the lens draws it.

**THE ACYCLICITY RULE THAT MAKES THIS WORK, AND IT IS THE PROGRAM'S HARDEST-WON LESSON
(§241.2, §252.1 — CONFIRMED):** *a derivation cycle is usually a missing version axis.* All
eight cycles the SCC instrument found were **two versions of one artifact sharing one binding
name**. Naming the versions dissolved every one of them with the determinism digest
byte-identical (`laneMFARCH2-receipt.md` §1). **A builder who finds a cycle should look for the
missing version, not reach for a solver** — `wallCycle.js`, the one bounded solver this program
ever wrote, was deleted when the axis became explicit.

### §1.0 · THE STAGE MAP

```
S0   dossier read + identity/version axis          BUILT
S1   REGION                                        NOT BUILT      ← CX-38; several stages wait on it
S2   TERRAIN SUBSTRATE (relief FIELD)              PARTIAL/absent ← CX-02/CX-04; §214's terrain arm is BLOCKED on it
S3   SITE + siteReason                             PARTIAL        ← CX-01
S4   WATER SYSTEM (channel, role, flow direction)  PARTIAL        ← CX-05/CX-06/CX-08
S5   EPOCH LADDER (§240)                           BUILT/1 DEFECT ← epochAxis.js; ⟦FOLD §264⟧ §257.3a
                                                                     ruled EPOCHS ARE FABRIC EPOCHS,
                                                                     and the build is a CIRCUIT ladder
     ── per epoch E, in order ────────────────────────────────────
S6     district organisms / anchors for E          PARTIAL
S7     street web for E                            PARTIAL        ← junction mix, φ, load-derived width all MISSING
S8     blocks as planar faces of the street graph  PARTIAL        ← §239.1 not built
S9     frontage line per block face                NOT BUILT      ← the #1 ranked gap in both studies
S10    plot series (burgage comb)                  PARTIAL        ← landed at B8; rhythm/corner/amalgamation MISSING
S11    footprints (module + outlier budget)        PARTIAL
S12    backland cores + voids                      PARTIAL
S13    CIRCUIT for E (chain of typed runs)         PARTIAL        ← traced and contained; run typing MISSING
S14    typed supersession/reuse of earlier works   NOT BUILT      ← explicit dated operations only
     ── after the last epoch ─────────────────────────────────────
S15  extramural: edge kind, faubourgs, ribbons     PARTIAL
S16  institution siting (relational)               PARTIAL        ← scale exists, relations do not
S17  water works + domestic water                  NOT BUILT
S18  canonical rural-state materialisation         PARTIAL        ← RSLP-1 gated; no default open field
S19  decay / demotion / state marks                PARTIAL
S20  GROUND LAW (reserved ground, area-true)       BUILT
S21  CENSUSES                                      BUILT
S22  LENS / RENDER (ink hierarchy, painted hand)   PARTIAL
S23  CHROME + LETTERING                            PARTIAL
```

⚠ **S1 AND S2 SIT AT THE TOP OF THE PIPELINE AND ARE THE TWO LARGEST HOLES IN IT.** CONTEXT
§14's one-paragraph answer to §246 is that we would produce *"a plausible settlement with an
implausible relationship to its world"*, and CONTEXT §10 ranks the missing substrate #1 and the
missing region #3 by breadth of effect. **Six of CONTEXT's eight reconstruction traces are hit
by the missing substrate alone.**

---

### S0 · DOSSIER READ AND THE IDENTITY / VERSION AXIS

**INPUTS.** The settlement dossier. The fields the map is entitled to read, **verified from
source, not remembered** (CONTEXT §0.6):

| fact | values | source file |
|---|---|---|
| `tier` | thorp · hamlet · village · town · city · metropolis (6) | `src/components/gallery/galleryUtils.js` |
| `config.terrainType` | plains · hills · forest · riverside · coastal · mountain · desert (**7**) | ibid. |
| `tradeRouteAccess` | port · river · crossroads · road · isolated (5) | `src/generators/economy/upgradeOpportunities.js` |
| `culture` | 11 tokens | galleryUtils |
| `economicState.prosperity` | Struggling → Wealthy (6 bands) | galleryUtils |
| water-bearing terrain | `WATER_TERRAIN = {coastal, riverside}` | `src/generators/terrainHelpers.js` |
| defences | institutions matching `wall · citadel · palisade · earthwork`; `hasWalls` boolean | `src/generators/defenseGenerator.js` |
| also present | `population` · `institutions` · `stressors` · `activeConditions` · `history` · `factions` · `government` | `src/domain/settlement.schema.js` |
| resource read | `resourceAnalysis.availableResources` (and related resource-analysis fields); there is no authoritative top-level `resources` array | `src/generators/steps/assembleSettlement.js`; live dossier readers |
| neighbour read | `neighbourNetwork` on saved settlements; `neighborRelationship` on live generation. **Neither supplies a trustworthy bearing by itself.** | relationship/store boundary |
| supply-chain read | ⛔ **NO canonical generated `settlement.supplyChains` fact is presently guaranteed.** Custom-content catalogs and derived map-chain selectors are not this input. A stage requiring it must refuse/dormant until a declared accessor exists. | source census; §10.18 adapter |

⭐ **THE SINGLE MOST ACTIONABLE FINDING OF THE ENTIRE STUDY PROGRAM (CONTEXT §14, adopted at
ODQ §251.2):** almost none of the fix is a new rendering capability. It is **the institution,
resource, neighbour/region and economic-flow concepts** that the map has not consumed spatially.
⚠ The earlier four-field shorthand (`supplyChains`, `neighbors`, `institutions`, `resources`) is
**conceptual, not a valid property-path contract**; the table above and §10.19 own the executable
adapter. Every stage below that says MISSING with a cheap sketch is, in the main, a stage that
consumes one of those causal concepts spatially for the first time.

**MECHANISM.** Two things are established before any geometry:

1. **THE VERSION AXIS.** Every artifact that exists in more than one state carries its state in
   its **name**, not in a mutated binding. `builtUmbrella → umbrellaWalled → umbrellaFaced`;
   `packed.parcels → parcelsLawful → closing.accessible.parcels`; `lod.masses → massesLawful →
   drawn.masses`. A stage **returns a version**; it never writes back into a published artifact.
2. **THE IDENTITY AXIS.** Every entity carries a stable lineage id, and every random draw is
   `keyedRandom(seed, …, {variant})` over that id via `fabricForkKey` — never a stream position.

**OUTPUTS.** The dossier projection; the fork-key root; the artifact identities and digest roots.

**THE THREE HISTORICALLY BUILT HASH TIERS (`laneMFARCH2-receipt.md` §5 — CONFIRMED):**

| tier | what it hashes | moves when |
|---|---|---|
| **WORLD** | canonical, ordered, quantized semantic state — bodies by key, rings by epoch, claims, channels, water, district identities. **No ink at all.** | the town changed |
| **PROJECTION** | the command stream with every paint attribute stripped, in document order | what is DRAWN changed |
| **RASTER** | the pixels, through `sharp`/libvips at a fixed size | a reader would see a different page |

⚠ ⟦FOLD §287⟧ §10.1 inserts the missing **OBSERVATION** domain between durable WORLD/SPATIAL and
PROJECTION without pretending it was built by MF-ARCH-2. The existing three names remain public.

⭐ **The first run paid for itself: `town` and `famine` share a WORLD hash and differ in
PROJECTION and RASTER** — the famine leaf's entire difference is outside the legality surface
(its six `stateMarks.marks`). One digest over the SVG could never have said that.
⚠ **WORLD's coverage boundary, stated so it is never over-read:** it covers the legality
surface and the identities — **not** `stateMarks.marks`, the immersion suite, the fields or the
relief. ⛔ The RASTER tier reports UNAVAILABLE and exits non-zero if `sharp` fails to load; it
never reads green when it cannot run.

**LAWS.** §161h §11.0 the inertia law · §241.2 / §252.1 the version axis · §234 one artifact,
one accessor, one proven predicate.
**CENSUSES.** `derivationGraph.walker.test.js` — the declared-cycle roster is **EMPTY**, with a
counterfactual that plants MF-ARCH's own write-back back into the real assembly source and
asserts the walker convicts it; a callee-write-back scan carrying the shape it forbids; the
fork-key scan asserting the assembly mints no bare-seed key. The fork-key ratchet is frozen
EXACTLY at `snapshot.js: 1, substrate.js: 4` with `buildFabric.js` asserted **ABSENT**.
**STATUS: BUILT.** `fabricGeometry.js` (`TOPOLOGY_PLACES`, `q6`, `topoText`, `r2`),
`buildFabric.js`, `tests/lint/derivationGraph.walker.test.js`. Proved by
`laneMFARCH-receipt.md` §5 (keyedRandom + lineage identities) and `laneMFARCH2-receipt.md`
§1/§4/§5.

⚠ **THREE THINGS AT S0 ARE UNFINISHED AND ARE NAMED IN THE RECEIPT** (`laneMFARCH2-receipt.md`
§9): the legality geometry is **not** stored on the quantized grid (only serialization is
fixed-precision, and quantizing storage moves every pixel and owes its own equivalence proof);
`substrate.js` carries a **second spelling** of the reroll salt (4 sites) that is correct but
duplicated; and the domain's content hash is still **4×32 bits** from `fabricRng.hash32` — the
sha-256 tiers live in the harness, not in the domain's staleness detector.

---

### S1 · THE REGION — **NOT BUILT** (CX-38)

**INPUTS.** Optional canonical neighbour positions, route/edge facts, hydrology and resource
analysis through §10.19's declared accessors. `tradeRouteAccess` is a coarse settlement fact;
neighbour records do not by themselves guarantee bearings, distances or a spatial route ledger,
and canonical economic-flow edges may be absent.

**MECHANISM.** *Before* the settlement, materialize a minimal `RegionArtifact` only from spatially
resolved canonical facts: neighbours at known positions, route edges carrying declared rank, the
known water system and typed resource catchments. Those facts may then constrain (a) settlement
siting, (b) approach bearings, (c) typed route/circuit intersections and (d) ordering along a
known road. A dossier name, relationship, route-access band or seed may not invent a bearing,
day's-travel distance, corridor, counterparty or resource site.

**OUTPUTS.** `RegionArtifact { neighbours[], routeEdges[] with rank+bearing, waterSystem?,
catchments[] }`, content-hashed and consumed by S3, S7, S13's gate stage and S15; or a typed
`STRUCTURAL_ONLY`/missing-canonical-fact receipt for each unavailable spatial claim.

**LAWS.** A declared route edge may set a road's bearing and load; the coarse
`tradeRouteAccess` band may constrain representation but does not manufacture its geometry.
§164a's neighbour-edge constraints apply only after the edge is spatially resolved. **Nothing
currently derives the region as a canonical object.**

**CENSUSES.** Every approach road's bearing traces to a canonical route edge or surveyed spatial
target; zero roads with an invented bearing. Gate weight ordering equals declared route-load
ordering. Missing spatial facts remain missing and cannot silently fall back to seeded geometry.

**STATUS: NOT BUILT.** CONTEXT ranks it **#3 by breadth** (5 of 8 traces) and marks it a
**sequencing** finding: **CX-01 (siting), CX-15 (gates as typed road terminals), CX-22 (which
gate carries a recorded suburb project) and CX-32 (toll avoidance) all wait on it** (CONTEXT
§11.2 rank 3). Road furniture and day's-travel placement remain `RSLP-1` candidates, not a
consequence of possessing a region object. PRIOR-ART independently supports the shape:
FMG's whole strength is a world model that derives settlement facts, and its
**relational-viability rule** — *a port with no counterparty is not a port* — generalizes to a
contradiction census we can run once a region exists (PRIOR-ART §7 rows 4, 5, 8).

⚠ **A settlement generated without a region will always look dropped rather than grown**
(CONTEXT §8.2). That is the sentence a builder should keep.

---

### S2 · THE TERRAIN SUBSTRATE — **PARTIAL, AND EFFECTIVELY ABSENT** (CX-02, CX-04)

**INPUTS.** `seed` · `config.terrainType` (7 tokens) · `resources` · water facts ·
`tradeRouteAccess`.

**MECHANISM.** A coarse, deterministic height / land-form grid per settlement, exposing four
derived layers:

1. **gradient** (magnitude) — drives hachure spacing, street grammar selection, terracing;
2. **aspect** (slope orientation) — ⚠ **NOT DERIVABLE TODAY**, see below;
3. **land-form class** (slope / cliff / crag / bench / marsh / flat / rock) — selects the
   drawn relief vocabulary;
4. **`buildable` mask** — the hard bound for every later growth epoch, computed from four
   refusals: **inundation · gradient · aspect · contamination** (CX-02).

**THE REFUSAL RULE, which is the whole point:** the settlement outline is the **complement of
the land the fabric refuses**, plus the epoch model — never a shape that is then clipped
(CONTEXT §1.2). §239.1 (block termination at hard edges) and §232 (the wall as a partition)
already supply the *stopping* machinery; what is missing is **something to stop against**.

**OUTPUTS.** `substrate { height, gradient, landForm, buildable }` — deterministic, nothing
persisted (§161 LAYER ZERO), content-hashed.

**LAWS.** §161 the terrain-first law (*"randomness proposes; terrain disposes"*) · §161a
substrate inputs broadened (ore→workable slopes+spoil, fisheries→shore+shoal, timber→standing
forest, quarry→exposed stone) · §161b the terraforming law with the **visible-work rule** (every
terraform leaves its workings legible in ink; an invisible edit reds the consistency pin) ·
§214 the iconography law's terrain arm.

**CENSUSES.** Substrate-vs-facts consistency (a pinned test per §161): every canonical input —
not `terrainType` alone — is expressed in the ground. Zero fabric on `buildable == false`.

**STATUS: PARTIAL, and the honest reading is *absent*.** b6 carries a **single `RELIEF 0.30`
scalar** in the cartouche (ATLAS Table C; CONTEXT §1.2). There is no field, no gradient, no
aspect, no mask. Charter §9.5b's RELIEF LAW is written (§177.2) and §214 is ruled.

⛔⛔ **THE SEQUENCING FINDING, RULED AT ODQ §251.4(a) AND RECORDED NOWHERE BEFORE CONTEXT FOUND
IT: §214 IS BLOCKED.** Its terrain arm — hachure whose spacing tightens with gradient, crag
hatch selected by land form, terraces following each band's own curve — **has no relief field
to consume**. §214's terrain arm is **re-sequenced behind the substrate**; its
**wall/iconography arm may proceed**. This is the single most consequential sequencing finding
in the study program and a builder who ignores it will write §214's terrain code against a
scalar.

⚠ **ASPECT IS NOT DERIVABLE TODAY AND MUST NOT BE INVENTED.** There is no sun bearing, no
prevailing-wind bearing, no slope orientation — and the §7/E8 correction already established
that no bearing field of any kind exists. CONTEXT §1.2 measures aspect as a **hard mask** in the
corpus (hf355's shaded shore empty and its sunny shore strung with villages; hf283's frost
hollow left unplanted). ⛔ **A bearing minted at generation becomes a SEED-PERMANENT WORLD FACT
under THE PROMISE.** CONTEXT filed it as inspiration and ODQ §251.5 recorded it as owner-gated
and **not proposed**. It stays in Appendix A.

---

### S3 · THE SITE, AND WHY IT IS THERE — **PARTIAL** (CX-01)

**INPUTS.** `config.terrainType` × `tradeRouteAccess` × `resources` × `history.foundingKind` ·
the S2 substrate · the S1 region.

**MECHANISM.** ⭐ **THE SITING LAW: A SETTLEMENT SITS AT A SCARCITY, NOT AT A CENTRE**
(CONTEXT §1.1 — the strongest single generalisation in that half). Derive a `siteReason` from a
**closed enumeration**: `ford · bridge-point · pass · gap · spur · knoll · harbour · cove ·
spring · spring-line · dry-ridge · confluence · head-of-navigation · portage · resource ·
junction`. The chosen reason then (a) fixes the anchor point on the substrate, (b) is the single
seed for the approach-road bearings, and (c) **is DRAWN** — the scarce thing is rendered and the
abundant thing is rendered as its foil.

**THE EVIDENCE, and it is unusually strong [M-view, CONTEXT §1.1]:** of the 12 plates that lane
opened, **11 place their settlement at a nameable scarcity, and in 9 of those the scarcity is
drawn LARGER than the settlement itself.** The negative case proves it — hf349's karst country
carries a great empty quarter with no settlement at all, because there is no water there.
**The corpus draws where people are NOT, and that emptiness is what makes the placement read as
a decision.**

**THE POLYCENTRIC ARM (§161, ruled).** Two strong non-adjacent sites connect by **road first**,
and ribbon development along that road shapes the town — the dumbbell and linear forms. PLAN's
TRACE 3 (hf72) confirms this is our **best current case** and the right first target.

**OUTPUTS.** `site { anchor, siteReason, secondNucleus? }`.
**LAWS.** §161 (sites are FOUND not PLACED: suitability field → best site(s)) · §161's
polycentric subseed law · §161c (a strong OUTLYING institution can be a second nucleus).
**CENSUSES.** Every settlement carries a `siteReason` from the closed enumeration; zero
settlements sited without one. The scarce feature is present in the drawn output.
**STATUS: PARTIAL.** §5.0b gives a water *mode* and b6 declares it in the cartouche — ATLAS
T-12's verdict is ★ **MEETS**, and the declaration is *"something no reference does"* (ATLAS
Table A). What is missing is that the mode is a **property** of the settlement rather than a
**point** on a substrate: nothing places the settlement AT a feature and nothing draws the
scarcity. **The missing piece is S2's substrate plus an anchor rule — not a new dossier fact.**
PRIOR-ART §7 row 4 offers a cheap, fully-derived **suitability field** construction (terrain,
hydrology, coast, resources) as approach for the anchoring term §161d already names.

---

### S4 · THE WATER SYSTEM — **PARTIAL** (CX-05, CX-06, CX-07, CX-12)

**INPUTS.** water mode (§5.0b) · canonical terrain/hydrology from S2/S4 · explicit route/water
relations · registered water-dependent institutions and, when present, canonical economic-flow
edges. There is no guaranteed `supplyChains` field and no institution name creates a flow.
⛔ **MISSING INPUT — THE BEARING TO WATER.** See §1.2's checklist row `sea` and gap **G-4**: we
derive water *mode* and not water *direction*, and a coastal settlement's whole plan orients to
the water. **Its derivation home is the S2 substrate (§161a), never a minted bearing** (§1.2).

**MECHANISM — three axes, not one.**

1. **MODE** (§5.0b, exists): THROUGH · BANKSIDE · NEAR · NONE/WELL.
2. ⭐ **ROLE (CX-05, MISSING): EDGE · SPINE · OBSTACLE.** CONTEXT §2.1's finding is that the
   mode **does not determine morphology** — *a class-4 river can be an EDGE, a SPINE or an
   OBSTACLE and the three produce opposite plans.* Shipping §205.2's width ladder without a
   role *"will change a width and nothing else"* (CONTEXT §11.1).
3. **CLASS** (§205.2, ruled, deferrable with cause): brook · stream · river · great river,
   derived from watershed + trade function + port presence. ATLAS T-13 supplies the four-rung
   visual ladder and confirms the contradiction census's premise — **every plate with a port or
   a fish market sits on class 3 or 4, and no trade settlement in the corpus sits on a brook.**

**THE FLOW DIRECTION IS THE PART THAT UNLOCKS EVERYTHING DOWNSTREAM.** The channel gets a
**directed centreline**. Without it, S17's ordered chains cannot exist and the pollution
geometry has no sign.

**THE SECOND-BANK RULE (CX-06).** One bank always builds first. ATLAS banned prior #10:
symmetric two-bank development on a THROUGH river is a defect (hf16 mirrors its banks; hf30
does it right at ~70/30). ATLAS T-12: **every THROUGH settlement must show bank asymmetry.**

#### ⟦FOLD §264⟧ TWO SMALL FOLDED MECHANISMS, AND ONE OF THEM IS THE MOST CERTAIN ITEM IN THE FOLD

**1 · ⭐ THE TWO-SCALE COASTLINE, WITH DETAIL ATTENUATED NEAR THE SETTLEMENT** (FTG §8.2 — rank
#7). A coast is generated as a **large shape plus a detail shape**, and the detail term is
**damped where the settlement meets the water.**
**(a) CAUSE:** the large shape is the S2 substrate's own geometry; the attenuation is a *fact about
occupation* — a worked waterfront is quayed, revetted and straightened, and an unworked one is not.
**(b) LOOK:** gated on the **water relationship incidence** band (§2.5: BANKSIDE 44% · NONE/WELL 29%
· NEAR 15% · THROUGH 12%) and its rider that **every THROUGH settlement must show bank asymmetry at
roughly 70/30**. **(c) DIRECTION:** the attenuation term is the part that argues — **a shoreline
jagged in the wild and smoothed where the town works it produces bank asymmetry as a consequence
rather than as a rule**, which is the direction ATLAS banned prior #10 demands. ⚠ **Their preset coast
styles are DELIBERATELY-DIFFERENT — free parameters with no derivation home.**

**2 · ⭐ ROAD/WATER TYPED INTERACTION — BRIDGE A RIVER, TERMINATE AT AN OCEAN** (FTG §8.2 — rank
#10, and **the smallest and most certain item in the whole fold**). A road meeting a channel gets a
**crossing structure**; a road meeting open sea **ends**. **(a) CAUSE:** §205's navigability law
already says a bridge SPANS and never dams. **(b) LOOK:** gated on the existing street-over-water
census rather than on a band. **(c) DIRECTION:** ⭐ **it converts violations into TYPED LEGAL
CROSSINGS, which is unambiguously toward compliance.**
⭐⭐ **AND IT IS THE SAME QUESTION G-34 IS BEING RULED ON — the §205A street arm was designed for a
RIVER and is applied to a COAST** (a shore-parallel road scores 775 "crossings" on `city` and 555 on
`fjord`). **§262.2(e) ruled the coast-vs-river arm THE ONE LAWFUL EXEMPTION**, keyed to the water's
relationship to the segment — bankside adjacency versus channel transit. **This mechanism is that
ruling's generation-side half: the census stops convicting a shore road because the generator stops
producing a road that pretends to cross.**

**OUTPUTS.** `water { mode, role, class, centreline (directed), banks[], claim }`.
**LAWS.** §205.1 navigability — the channel is a RESERVED RIGHT-OF-WAY, bridges SPAN and never
dam, quays project from the bank, water gates open through the wall at the banks · §205.2 river
class follows function · §5.0b.
**CENSUSES.** §205A water right-of-way: **0 drawn bodies in the channel** over 23,391 bodies,
**AREA-TRUE** (BUILT — `laneMFARCH2-receipt.md` §0). Exemptions are a **register with asserted
predicates**: a bridge is exempt if a DECK covers the crossing (SPANNING); a quay/port/mill/
ferry if BANK-ROOTED (a corner on the dry side); a water gate as §161m.3 itself
(`laneMFB8-receipt.md` §6). The trade-on-a-brook contradiction census (§205.2) is unbuilt.
**STATUS: PARTIAL.** The channel is claimed and enforced area-true; the coast claims its shore
(cured at B8 — `waterClaims` returned `[]` for anything not a river, so three coastal leaves
DREW a 10.0-unit water edge and CLAIMED 0.0). ⛔ **MISSING: the role axis, the directed
centreline, the width ladder, the second-bank rule, and the join/divide consequence (CX-12).**
✅ **`waterViolations` at 165 is CHARACTERIZED** (§0.3, §0.3a) — a re-rolled meander, not a
regression. ⛔ **But the §205A exemption machinery is structurally broken: 72% of street-over-water
violations cannot be exempted BY CONSTRUCTION (G-34, §4.1a), and the street arm was designed for a
RIVER and is applied to a COAST** — a shore-parallel road scores **775 "crossings" on `city` and
555 on `fjord`**, so **the coastal leaves dominate the corpus street total and the figure is not
comparable across terrains.**

---

### S5 · THE EPOCH LADDER — **BUILT, WITH ONE RULED DEFECT** ⟦FOLD §264⟧ (§240)

**This is the spine of the whole pipeline and it is the one large thing that is finished** — with
one exception the chair has since ruled and which a builder must read before touching this stage:
⛔ **the ladder as built is a CIRCUIT ladder, and §257.3(a) ruled that EPOCHS ARE FABRIC EPOCHS.**
See the ⟦FOLD §264⟧ block at the end of this stage, and gap **G-42**.

**INPUTS.** `tier` · `population` current and **high-water** (§161f) · `history` founding kind,
promotion events, prosperity history, recorded fortification events · `meta.hasWalls`.

**MECHANISM (§240.1, verbatim law).** Even a fresh walled settlement generates in **ORDERED
EPOCHS**: build the inner core, **STOP**, build the wall that completely bounds it, **THEN**
build the districts expanding outside it, repeated for as many rings as are appropriate. The
chain `core(E0) → wall(E0) → ring(E1) → wall(E1) → ring(E2)…` is **ACYCLIC BY CONSTRUCTION**,
with epoch index playing the role year plays in §239.

**THE LADDER, AS BUILT** (`epochAxis.js`; `laneMFARCH2-receipt.md` §2.2). A circuit is raised
when a settlement **passes a tier threshold**, and §5's footprint bands supply the extent as
arithmetic:

```
extent(t) = FOOTPRINT_R × √(TIER_PROFILE[t].footprint[0]) ÷ today's built radius
            town 258.5u    city 352.2u    metropolis 429.5u
```

⚠ **THE `TIER_PROFILE` FOOTPRINT BANDS ARE THIS PIPELINE'S ONLY POPULATION→EXTENT RELATIONSHIP,
AND THEY HAVE NO MEASURED DERIVATION HOME.** ATLAS's own fit was withdrawn (§249.4c records it
**UNRESTORABLE from the corpus**). §1.2's checklist supplies the one piece of external evidence
we have — see gap **G-5**.

Three gates, **all facts, none of them a dial** (§240.2's binding condition — *ring count is
DERIVED, never a knob*):

1. **THE VINTAGE IS THE GATE.** No recorded founding age ⇒ ONE circuit on today's fabric,
   **understated rather than invented**.
2. **A LATER CIRCUIT IS EARNED**: the previous ring must enclose ≤ **0.86** of today's extent.
3. **THE TIER CAPS HOW MANY A SETTLEMENT MAINTAINS AT ONCE** (`TIER_CIRCUIT_CAP`).

⭐⭐ **AND WHEN THE CAP BINDS, A SETTLEMENT KEEPS ITS CURRENT CIRCUIT AND REMEMBERS ITS FIRST.**
That is history rather than convenience: the intermediate ring is the one demolished and built
over as the city expanded past it; the first survives as the change of GRAIN §11.1 draws; the
last survives because it is still the wall.

**THE CIRCUIT OF EPOCH E IS TRACED FROM EPOCH E's OWN FABRIC** — `builtUmbrella.epochCircuitRing`
cuts the **same cells** the built umbrella was made from, at the epoch's extent, and closes them
at the same `WALL_CLOSE_FRONTAGES` radius. ⛔ **What it replaced was worse than "missing": the
older ring used to be `shrinkAbout(todayOutline, centroid, ratio)` — a SCALED COPY of the modern
silhouette.** A pin now compares the metropolis's two rings as normalized radius profiles
(scale removed) and asserts they are **NOT** the same shape.

⭐⭐⭐ **THE CONTAINMENT RULE, banked as law after four measured wrong answers (§252.2): A
CONTAINMENT CLAIM MUST BE MADE AT THE RESOLUTION THE BOUNDARY IS ALLOWED TO HAVE.** A 20-facet
stone curtain **cannot** contain a 2,300-point outline — the polygon has no degrees of freedom
left. The epoch is therefore `resampleClosed(body, facets)`, the epoch **at the wall's own
resolution**, and the fabric between that hull and the raw body is **by derivation the next
epoch**. Nothing is clipped; ground is attributed. Two riders: **terrain service is subordinate
to containment** (the wall may climb the rise, it may not walk through the town), and the
closure runs **last, on a densified epoch**, as a capped monotone sweep (6) — not a solver —
with every circuit publishing its own `containmentResidual`, pinned at 0.

**OUTPUTS.** `node.epochs` (the whole ladder, suburb included, each walled entry carrying its
`body` and `containmentResidual`); per ring `epoch`, `epochHull`, `containmentResidual`,
`closedPolygon`. Per-epoch keyed RNG streams (`wall.epoch.k`). ⚠ `epochHull` and `closedPolygon`
are **DIAGNOSTIC, not a law surface** — a consumer measuring legality against them reads an
unverified copy.

**MEASURED, EVERY WALLED LEAF (CONFIRMED, `laneMFARCH2-receipt.md` §2.2/§2.7):**

| leaf | tier | rings | epoch extents |
|---|---|---|---|
| town · siege · plague · famine | town | 1 | 0.836 → suburb |
| polycentric | town | 1 | 0.840 → suburb |
| city · migration | city | 2 | 0.660 · 0.899 → suburb |
| metropolis | metropolis | 2 | 0.585 · 0.972 → suburb (**3 earned, 1 absorbed**, cap 2) |
| highwater | city (demoted) | 2 | 0.734 · 1.000 |
| year-100 | town | 1 | 1.000 (vintage unknown — understated) |
| thorp · hamlet · village · mountain · fjord · year-018 | — | 0 | **one unwalled epoch** |

**⇒ 0 of 15,176 epoch members outside their own circuit** (MF-ARCH measured 1,331 of 19,563 =
6.8% before the cure), and **4,607 bodies are EXTRAMURAL BY DERIVATION** — the suburb arriving
as a consequence of the law, not as a knife falling.

⚠ **THE CENSUS'S EPOCH ASSIGNMENT IS A FACT ABOUT THE FABRIC, NEVER "IS IT INSIDE THE RING".**
A body belongs to the innermost epoch whose **hull** contains it — the fabric the ring was traced
FROM, one derivation step BEFORE the ring. Defining membership by the ring would be the
self-referential pin class and the "0" would be worth nothing.

**LAWS.** §240 (all four clauses) · §239.3 the wall's temporal primacy · §161f continuous scale
and the high-water law · §232 the wall as a district partition · §252.2 containment resolution.
**CENSUSES.** Containment residual 0 on **every ring of every walled leaf**; epoch members
outside own circuit 0 of 15,176; the shape pin (two rings, scale removed, must differ); the
epoch-relabelling refusal in the content hash; the two-ended non-vacuity bound (there ARE
members and there IS a suburb). Counterfactual: `boundEpoch` given a trace that steps inside its
epoch **must red**.
**STATUS: BUILT.** `src/domain/townMap/fabric/epochAxis.js` (179 effective lines), amended
`walls.js`, `wallCircuit.js`, `builtUmbrella.js`, `buildFabric.js`, `leafCensus.js`,
`fabricGeometry.js`; `wallCycle.js` **DELETED**. Proved by `laneMFARCH2-receipt.md` §2, collected
at ODQ §252.

⛔⛔ ⟦FOLD §297/§298⟧ **BEFORE THE THREE ITEMS BELOW ARE READ: §240.2's PER-TIER CEILING TABLE IS
WITHDRAWN AS BINDING NUMBERS — REVERSED AT §297.3b.** The published caps (**village 0 · town 1 ·
city 2 · metropolis 3**) are no longer a table a builder may consume. **The build already diverges
from every one of them** — village draws 1 not 0; metropolis was capped at 2 and then drawn at 3 in
W2; thorp and hamlet silently draw 1 — and the corroboration was structurally unsound: **the
corpus's ONLY two three-circuit plates, `hf347` and `hf385`, are both TOWNS**, PLAN's
"corroboration" was the Q-2 fabric/circuit conflation, village-0 is contradicted by two sub-town
enclosures, and the ~10% calibration is **n=3 with a double count**. ⭐ **WHAT SURVIVES IS §240.2's
FIRST SENTENCE, AND IT IS THE LAW: RING COUNT IS DERIVED FROM THE SETTLEMENT'S OWN FACTS, NEVER A
KNOB.** ⛔ **The per-tier caps are RE-DERIVED against the corpus — hf347 and hf385 included, and
the WALLED-THORP question decided — in the epoch-calibration work.** Read the three items below as
a record of what the build did against a table that no longer binds.

⚠ **THREE CARRIED ITEMS A BUILDER INHERITS.** (a) **§240.2 permits a metropolis three circuits
and the code draws two, deliberately** — the third is *derived and withheld by the cap* (extent
0.797), because the §217 metropolis op ceiling stands at 9,700 with 83 primitives of headroom.
**§252.3(a) ruled the cap is the thing to lift, and that it lifts WITH the run-chain, not
before, and then by measurement.** ⟦FOLD §297/§298⟧ ⚠ *W2 then drew three; the "permits three" cap
is part of the withdrawn table.* (b) **§240.2's "a village earns zero circuits" is NOT
enforced by this module** — a walled village is the landed model's decision (`meta.hasWalls`),
and no walled leaf in the corpus is below town tier, so nothing tests the difference (J-A2-4,
flagged not settled). ⟦FOLD §297/§298⟧ ⛔ *and village-0 is itself withdrawn — two sub-town
enclosures contradict it. The unenforced rule was also a wrong rule.* (c) `ringsText` now includes the epoch index, so **no stored circuit hash
from any earlier wave verifies**.

### ⟦FOLD §264⟧ S5-a · ⛔⛔ THE RULED DEFECT — **EPOCHS ARE FABRIC EPOCHS, NOT CIRCUIT EPOCHS** (§257.3a)

**MF-SPEC raised this as CHAIR QUESTION Q-2. THE CHAIR RULED IT IN THE SAME LEDGER ROW THAT
COLLECTED THE SPEC, AND THE SPEC WENT ON CARRYING IT AS OPEN — the §257.2 class, biting the
document that named it.** The ruling, in full:

> ⭐⭐ **EPOCHS ARE FABRIC EPOCHS, NOT CIRCUIT EPOCHS. A wall is an EVENT WITHIN the epoch
> sequence, never its definition; a village that grew over two centuries has TWO VINTAGES AND NO
> WALL AT ALL.** This does **not** revise the owner's §240 law — which describes a *walled*
> settlement's sequence — **it corrects our implementation's conflation.** (§257.3a)

**WHY IT IS A REAL DEFECT AND NOT PEDANTRY.** `epochAxis.js` mints one epoch per circuit plus the
suburb, so **every unwalled leaf gets exactly ONE epoch** (thorp, hamlet, village, mountain, fjord,
year-018 — all `rings 0 → one unwalled epoch`), while PLAN §6.1 **measures** fabric epochs at
village **1–2** and town **2–3**. Left uncured this would have made **vintage difference impossible
below the wall line** and would have silently made the walled/unwalled split **equal the tier line**
— §251's own measurement is that those two splits nearly coincide, so the error would have been
invisible in the corpus and fatal in the output. ⛔ **Every per-epoch exit criterion in W4 is
untestable on an unwalled leaf until this lands.**

**THE BINDING CONDITION ON THE CURE (§240.2, unchanged): RING COUNT IS DERIVED, NEVER A KNOB — and
so is epoch count.** ⚠ **The naive fix, minting epochs from population growth, is a knob unless it
is derived.** The derivation must come from the same fact family §240 already uses: **founding age,
promotion events, prosperity history and recorded growth**, with the circuit ladder becoming a
**SUBSET** of the epoch ladder rather than its definition. **The ≤4-epoch measured ceiling (PLAN
§6.1) binds the result at every tier**, walled or not.
**Entered as gap G-42; routed to W2**, because changing what an epoch *is* changes `epochAxis.js`,
which W2 already opens wholesale under §251.4b.

### ⟦FOLD §264⟧ S5-b · ⭐⭐ §240 IS **CONVERGENT, NOT IDIOSYNCRATIC** — AND THAT IS GOOD NEWS, HONESTLY REPORTED (§263.2)

**A second product ships the owner's model.** Fantasy Town Generator ships **numbered generation
stages**, each with its own road-branch mode, wander limit, material, placement mode and block
scale, **plus an optional wall at the stage boundary** — the owner's `core → wall → ring` chain,
built by someone else who arrived at it independently (FTG §5.1). **MF-X2's claim that the prior art
has no epoch axis is CORRECTED.**

⭐⭐ **OURS REMAINS STRONGER FOR THE ONE REASON THAT MATTERS, AND THE DIFFERENTIATOR IS NOW STATED
PRECISELY RATHER THAN LOOSELY: THEIRS ARE FREE PARAMETERS ON A FORM; OURS ARE DOSSIER-DERIVED WITH A
MEASURED ≤4-EPOCH CEILING.** ⟦FOLD §297/§298⟧ ⚠ **AND THE CEILING'S SCOPE IS STATED HONESTLY
(§298.5e): max 4 across the 36 DIRECTLY-VIEWED plates of the 222-plate studiable frame — not
"no plate in 313", which was a census nobody ran.** The differentiator survives at that scope:
theirs are free parameters inferred from documentation, ours is a measured ceiling with a
derivation home. **§240 is DE-RISKED rather than unique — and de-risked is worth more than unique**
(§263.2). ⭐ *A differentiator you thought was unique and that turns out to be convergent is not a
loss; it is confirmation that the problem converges here.*

⛔ **AND ONE THING INSIDE THEIR STAGING WE MUST NOT TAKE, RECORDED AS AN EXPLICIT NON-ADOPTION SO
NOBODY RE-FINDS IT AS AN OPPORTUNITY: the per-stage "place a wall after this stage" toggle.** On the
published evidence it draws a **closed ring** around the stage's lots. Our measured flank grammar is
**full ring ≈55% · half-ring against water 17% · terrain-anchored 14% · water gates 10% · two
vintages in frame 10%** (§2.5), and **a generator drawing a full ring 100% of the time is wrong by
~45 percentage points.** ⭐ **A stage-boundary wall toggle is a RING-DRAWER.** Our circuit stays a
**traced consequence of terrain and district structure** (S13, §232) — never a shape stamped around
a stage (FTG §5.4).

⚠ **ONE MORE FROM THEIR STAGING IS GENUINELY GOOD AND IS DELIBERATELY *NOT* ADOPTED HERE: building
MATERIAL varying per stage**, the cheapest way to make an epoch boundary legible. It fails leg (c)
— ⛔ **no corpus metric for between-region tone or texture contrast exists**; `fill_tone_iqr` and
`wash_within_sigma` are whole-plate statistics, and gating it with §2.4's *grain* step would gate
one quantity with another's number. **It sits in §4.1b's INTERESTING-BUT-UNGATED list until the
instrument ordered at §263.6a is built** (gap **G-40**, W0). *That is the §261 discipline working:
a good idea with no number is a habit waiting to happen.*

---

## §1.1 · THE PER-EPOCH LOOP (S6 – S14)

**Everything from S6 to S14 materialises the canonical phase/operation sequence in order. A circuit
is a dated project within that sequence, not its boundary.** §240.4's stable lesson is the inertia
seam: adding a later operation must not re-derive earlier geometry. Per-operation keyed streams and
lineage preserve that rule; circuit count/order never mints the epoch list.

⛔ **§287 / HEEP-1 EVIDENCE CORRECTION.** The following are measurements of labelled regions in the
synthetic visual corpus. They are useful projection diagnostics and research hypotheses, not
historical calibration, causal dials, epoch counts or runtime bands. Canonical plan, route, parcel,
occupation and dated-operation facts own the executable values.

**SYNTHETIC WITHIN-PLATE OBSERVATIONS (PLAN §6.2):**

| plate | pair | grain (cells across) | φ | dead-end share | X share |
|---|---|---|---|---|---|
| hf26 | old fabric → new quarter | **46.9 → 16.3** (2.9× coarser) | 0.069 → **0.652** | 0.164 → 0.198 | 0.023 → 0.020 |
| hf274 | Oldbank → Newcharter | **47.2 → 26.6** (1.8× coarser) | 0.131 → **0.318** | 0.225 → **0.342** | 0.023 → 0.013 |
| hf239 | vicus → castra camp | 30.0 → 33.8 (≈flat) | 0.074 → **0.585** | 0.189 → 0.140 | 0.028 → **0.088** |
| hf347 | core → outer ring | 17.4 → 9.8 (1.8× coarser) | — ⚠ | 0.182 → 0.200 | 0.000 → 0.000 |

⛔ ⟦FOLD §297/§298⟧ **THE COARSENING RATIOS IN THE `grain` COLUMN ABOVE ARE AN INSTRUMENT ARTEFACT
AND THE CALIBRATION FIGURES ARE REVERSED (§298.5e).** `cells_across` is **pitch × window width**,
and the four pairs were measured over windows of unequal width, so every published ratio decomposes
exactly as that product. **The WINDOW-INDEPENDENT PITCH COARSENING IS 1.33× – 1.44×** (hf274 1.33 ·
hf347 1.38 · hf26 1.44), with the fourth pair **hf239 at 0.99× — the founding-mode inversion.**
⛔ **A generator tuned to the withdrawn 1.8×–2.9× range OVERSHOOTS THE CORPUS BY 35–100%.** The
founding-mode ORDERING is RATIFIED as filed — only the magnitudes move. **§240 / G-42 / W4
calibration inherits 1.33–1.44×**, never the withdrawn range. ⚠ *This was §244.5's own instrument
defect, adopted one row later; the finding did not travel — which is why it is stamped at every
site that quotes it.*

1. ⟦FOLD §297/§298⟧ Several labelled old/new pairs differ in grain, but the **window-independent
   step is 1.33×–1.44×** (the block above; the published 1.8×–2.9× is withdrawn), and even that does
   not prove that newer historical fabric is generally coarser or that age causes subdivision.
2. Several labelled planned regions have higher φ, while hf239 inverts the age ordering. Plan intent
   and realised topology must remain separate; neither “newer” nor a founding label is a rule.
3. One labelled young region has more dead ends (0.225 → 0.342). It is a candidate question, not an
   incomplete-occupation mechanism until eligible evidence and explicit canon support it.

**⚠ ⟦FOLD §297/§298⟧ MAX 4 LEGIBLE LABELLED EPOCHS ACROSS THE 36 DIRECTLY-VIEWED PLATES OF THE
222-PLATE STUDIABLE FRAME** (PLAN §6.1). ⛔ **RE-SCOPED at §298.5e: the earlier form — "max 4
anywhere in the 313 synthetic plates" — claimed a census nobody ran.** 36 plates were viewed; 222
are studiable; 313 is the asset roster. The observation is honest at its own scope and says nothing
about the 277 plates no eye reached. This is a projection complexity observation only. It neither
caps historical phases nor couples epochs to rings/tier; a five-phase canonical settlement stays
five-phase and the representation ratio/legend must handle it.

**THE ATTACHMENT RELATION (PLAN §6.4 — PARTIAL).** A canonical dated fabric operation may carry
one of four descriptive relations to predecessor fabric; the compiler does not select one from age,
prosperity or generic growth speed:

| mode | what it does | selected by |
|---|---|---|
| **RING** | wraps predecessor fabric | explicit enclosing/encircling plan and realised occupation |
| **RIBBON** | extends along a route or shore | a spatial route/shore plus dated route-led occupation; `tradeRouteAccess` alone is insufficient |
| **NEW QUARTER BESIDE** | a planned block on fresh ground, **at its own bearing**, separated by a street or an edge | explicit `PLAN_INTENT` + `PLAN_REALIZATION`/occupation; disaster labels do not automatically license a replan |
| **INFILL** | occupies/subdivides registered backland inside an inherited outline | explicit occupation/subdivision operation and parcel/right eligibility |

⭐ **The preservation rule:** a successor operation never silently overwrites predecessor identity.
An abutment seam may be a street, boundary or retained parcel line when canon records it; infill
changes occupation/parcel state through typed operations and does not erase lineage.

---

### S6 · DISTRICT ORGANISMS AND ANCHORS FOR EPOCH E — **PARTIAL**

**INPUTS.** Canonical nuclei, institutions with explicit attribution (§161l), jurisdiction/power,
plan/occupation operations, substrate and inherited routes/boundaries for the phase. Current wealth,
prosperity, default siting rings and an ordinal epoch index are not organism geometry inputs.

**MECHANISM (§161d/§161e, ruled, and the corpus confirms it strongly).** Growth is
**PER-DISTRICT/NUCLEUS**: each district materialises from its canonical anchor, eligible substrate,
predecessor rights/boundaries and dated plan/occupation operations. **The lobe count is DECIDED** —
it equals the independent anchors the facts support. A union umbrella may index known occupied
fabric, but meeting fronts, seam streets and interior greens are emitted only where topology/history
supports them; a growth-rate function of wealth or age is forbidden.

Three sub-laws (§161e), all corpus-confirmed:

- **THE RESIDENTIAL-MATRIX LAW** — housing is connective tissue everywhere; district character
  is a **layer over** the matrix; a dwelling-free district is a bug. **PLAN §4.3 confirms this
  without exception in the plates it read** — the tanners' ground has tanners' houses; the
  shipyard has shipwrights' terraces; the mining town's dressing floors sit among ordinary
  dwellings. ⭐ **VERDICT: HAVE.**
- **THE MULTIPLICITY LAW** — the same type instantiates multiple organisms where facts support:
  parishes plural, markets by good, two poor fringes.
- **THE OVERLAP LAW** — organisms are **INFLUENCE FIELDS, not exclusive polygons**; parcels
  sample the strongest local field; era-legal mixing by **parcel-grain dithering** (flat
  per-parcel character, salt-and-pepper frontiers, **never a blended wash**, since §9 forbids
  gradients); labels name only the locally dominant field.

⭐ **PLAN §4.2 IS THE STRONGEST CONFIRMATION IN THE STUDY PROGRAM.** The corpus **never** draws
a settlement as a partition of named quarters: 2–5 districts are strongly characterised, the
rest is undifferentiated residential matrix carrying no district identity at all, boundaries are
**not drawn** (the corpus reserves drawn boundaries for *jurisdictions* — a ward bound, a dual
lordship — never for character zones), and boundaries read as a **change of grain over 1–3
blocks** except where a hard edge makes the change abrupt. §161d + §161e + §167 together predict
exactly what the corpus draws. ⚠ hf40 is the exception that proves it and the corpus's own
defect list flags it: its rich/poor divide is a **single clean line** and it reads as the least
convincing thing on an otherwise superb plate (ATLAS banned prior #11).

**LEGIBLE DISTRICT COUNTS [E, PLAN §4.1]:** thorp 0–1 · hamlet 1 · village 1–3 · town 3–6 ·
city 5–9 · metropolis 8–14. ⭐ **The counts are far lower than the number of LABELS the plates
carry** — hf331 carries a dozen named things and reads as **four** districts. **Legibility
saturates well below enumeration.**

**ADJACENCY, positive and negative [E, PLAN §4.2].** Recurring pairs: castle ↔ its own precinct
wall, never directly onto poor fabric · market ↔ the widest street junction · noxious trades ↔
downwind AND downstream AND at the edge, **never adjacent to a religious precinct** · port/quay
↔ warehouse ranks ↔ merchant houses, in that order inland · poor fringe ↔ the wall's least
valuable arc and outside it. **Pairs that essentially never occur: market ↔ noxious; religious
precinct ↔ noxious; castle ↔ market directly** (there is always fabric or a forecourt between
them).

#### ⟦FOLD §264⟧ §1.1.6a · ⭐⭐ CHARACTER IS A **PARAMETERISATION**, NOT AN ALGORITHM — DO NOT WRITE PER-DISTRICT GENERATORS (§259.2)

**This is the architecture-shaped finding of the Watabou study, it is ranked #1 there, and §261.3
records that it SURVIVES THE PROVENANCE CORRECTION UNTOUCHED** — because it is a statement about how
to *organise* a generator, not a claim about what the corpus looks like. **The corpus is not its
evidence and does not need to be.**

⭐ **ONE subdivision routine serves EVERY populated district. The district types differ only in FOUR
SCALARS** — and our dossier's own facts map onto them nearly one-to-one, which is what makes all
four **causes** rather than knobs:

| axis | what it governs | ⭐ our derivation home | (b) LOOK — the corpus metric that gates it |
|---|---|---|---|
| **size floor** | how small a piece may get before it becomes a building | explicit plan/holding module, frontage/parcel lineage, function/capacity and structural minima; **never current wealth alone** | `block_area_frac_p50` |
| **grid chaos** | how far a cut may wander from square | `PLAN_INTENT`/`PLAN_REALIZATION`, substrate, predecessor boundaries and dated replanning; neither age nor `lawfulness` is a substitute | `orientation_entropy` · `orientation_order_phi` |
| **size variation** | how much building sizes vary within the district | **mixed use** (land-use heterogeneity) | `block_area_cv` · `block_area_p90_over_p10` |
| **emptiness** (⚠ **inverted**) | how often a represented piece is absent | canonical occupation/backland/vacancy state and representation ratio; population pressure alone does not mint land use | `backland_green_p50` · `blocks_green_ge10pct` / `_ge25pct` |

⚠⚠ **THE FOUR-AXIS SOFTWARE SHAPE MAY TRANSFER; THE CAUSAL MAPPINGS AND MAGNITUDES MAY NOT.**
Synthetic bands grade visual output. Historical parameter values require canonical facts and
promoted mechanisms; no current prosperity, culture, age or lawfulness scalar is a free morphology
knob.

⭐⭐ **THE COROLLARY IS A WARNING AND IT BELONGS ON ITS OWN LINE: WE SHOULD NOT WRITE PER-DISTRICT
GENERATORS. WE SHOULD WRITE ONE AND DRIVE IT FROM THE DOSSIER.** This program has a documented
tendency toward per-case machinery, and every additional concept is a thing that can rot. ⭐ *Read
the extremes and the sociology is simply there: tiny buildings with maximum angular chaos and almost
no gaps is a slum; large buildings with one piece in five left out is a patriciate quarter with
gardens; large buildings with chaos nearly off is the only orthogonal district in the city, which is
exactly how officialdom reads on a map.*

⚠ **AND THE THREE-WAY WIRING A BUILDER MUST GET RIGHT, BECAUSE RETROFITTING IT IS THE EXPENSIVE
PATH:** the **routine and its four axes are W3's** (they are a structural property of the
subdivision code and cannot be bolted on afterwards); later waves may supply **canonical per-epoch
VALUES** from plan, parcel, function, occupation and dated-operation facts; and G-9/G-38 are the
same structural parameter surface seen at epoch and district scope. Current wealth, lawfulness,
age and synthetic visual correlations do not supply those values. Entered as gap **G-38**.

**OUTPUTS.** `organisms[]` with anchor, field strength, canonical land use, **grain target**,
**bearing basis**, **φ target** and ⟦FOLD §264⟧ **the four character scalars above**.

**LAWS.** §161d · §161e · §161l attribution (districts are CONSTITUTED by their members; the
FOUNDING RULE — unhoused peers SEED the to-be-constructed district) · §167 the affinity matrix ·
§232 the wall as a district partition (a district touching the wall **CLIPS** at it; extramural
faubourgs form their **OWN** districts, never an intramural district's extension).

**CENSUSES.** §232 district straddlers **0** (BUILT, pinned green — 14 straddling districts of
46 pre-cure, worst 26.8% of the government quarter across its own wall). §203 arm 1 zone
containment, asked of the **partition grid** and never of the click region (J-B8-11). Zero
dwelling-free districts.
⛔ **MISSING: GAP-H, the district-legibility census** — *no law says districts must be legible
WITHOUT their labels*. PLAN §4.2 supplies the discriminator and the measured separations
(⟦FOLD §297/§298⟧ hf26 old vs new **1.44×** pitch; hf274 old vs new **1.33×** — ⛔ *the published
2.9× and 1.8× are WITHDRAWN as window-width artefacts, §298.5e*; hf40 rich vs poor 1.25× in grain
but ~3× in footprint size by eye). **PROPOSED BAND: neighbouring characterised districts differ by
≥1.4× in median block area OR ≥1.3× in cells-across. Below that they are one district wearing
two names.** ⚠ ⟦FOLD §297/§298⟧ **THE BAND WAS PROPOSED AGAINST THE WITHDRAWN RATIOS AND IS
RE-DERIVED WITH THEM** — on the corrected pitch step the two epoch pairs sit at 1.33× and 1.44×,
i.e. astride the proposed 1.3× floor rather than far above it, so the floor is a candidate, not a
measured separation, until GAP-H's census is built.

**STATUS: PARTIAL.** The organism model, the umbrella union, the §232 partition and the zone
containment census are BUILT (`districtPartition.js`, `leafCensus.js`;
`laneMFB8b-receipt.md` §3, `laneMFB8-receipt.md` §5). ⛔ **MISSING:** the per-organism **grain**,
**bearing basis** and **φ** targets (PLAN §1.5, §6.2 — the epoch dials); the label-free
legibility census; the wealth→**geometry** coupling (§1.5 below).

⚠ **A MEASURED TRUTH-SURFACE DEFECT IS OPEN AND OWNER-GATED.** `zoneClickCoverage` reads
**town 0.50 · city 0.57 · metropolis 0.83** — *half a town's fabric belongs to a quarter whose
click region does not cover it.* A reader can see the quarter and cannot click it. Curing it
means changing the landed **one-element-per-district-id** contract that five UI suites
hit-test — an owner-gated public surface, **reported not taken** (`laneMFB8-receipt.md`
§5/§10.4). The related **faubourg district-id change** (`${parent}~faubourg` +
`wallSide`/`parentDistrictId`) is owner-gated and **stays parked** (§238.4b).

⭐⭐ **THE CLASS THAT PRODUCED THAT FINDING, AND IT GENERALIZES: A UI SUMMARY OF A FACT IS NOT
THE FACT.** §203's containment census read **36% failure** against the click region and **1.65%**
against the ground, because `umbrella.partition` publishes one region per district id and only
its largest traced component — by design, for a landed contract.

---

### S7 · THE STREET WEB FOR EPOCH E — **PARTIAL, AND THIS IS THE PIPELINE'S SHARPEST GAP**

**INPUTS.** organism anchors and their bearing bases · the region's approach roads and their
ranks (S1) · gates (S13) · the substrate's gradient (S2) · `institutions` as origins and
destinations · `foundingKind` × `lawfulness` × epoch (the φ and X budgets).

#### §1.1.7a · THE JUNCTION-MIX LAW — **MISSING** (PLAN §1.1, adopted at §250.2)

⭐⭐ **THE SHARPEST SINGLE NUMBER IN THE STUDY PROGRAM.** [M, CONFIRMED — 35 whole-settlement
windows]:

| node type | min | **median** | max |
|---|---|---|---|
| dead end (deg 1) | 0.110 | **0.209** | 0.391 |
| **T or Y (deg 3)** | 0.510 | **0.653** | 0.738 |
| X (deg 4) | 0.000 | **0.015** | 0.055 |
| star (deg ≥5) | 0.000 | **0.000** | 0.009 |
| **X : T ratio** | 0.000 | **0.024** | 0.085 |

⟦FOLD §297/§298⟧ **The corpus's median settlement has FORTY-ONE-AND-A-HALF T-junctions for every
X-junction** — **41.5**, corrected from 43 at §298.5a. Not one of
the 35 windows exceeds 5.5% X-nodes; ⟦FOLD §297/§298⟧ **27 of 35 have zero nodes of degree ≥5**
(corrected from 22).

⛔⛔ ⟦FOLD §297/§298⟧ **THE BINDING CAVEAT ON THIS WHOLE LAW, AND IT IS NOT A FOOTNOTE (§298.5a
with §298.3).** The junction mix is ADOPTED **as a REGISTER-MATCHING TARGET — never a generator
input and never a pixel goal.** The reason is an unmeasured instrument: **the skeletonizer's
X-RECOVERY IS UNMEASURED AND LARGE.** The hf239 castra control — a *drawn grid* — reads only
**0.088**, where a true grid would read **≥0.5**; the extractor is demonstrably losing most of the
X-nodes it is shown. ⭐ **The RELATIVE discrimination survives that** (the castra reads 6× the
corpus median, and that is the finding) — **but the ABSOLUTE band may NEVER gate generated VECTOR
output directly.** ⛔ **THE ONLY LAWFUL FORM OF THIS CENSUS IS SAME-INSTRUMENT: either rasterize
the generated map and run it through the SAME skeletonizer, or first measure X-recovery on a
synthetic grid and publish the correction.** *Grading a vector graph's exact junction count against
a number the skeletonizer under-recovers is the point-vs-area class wearing a new costume.*

⛔ ⟦FOLD §297/§298⟧ **AND THE RATIONALE IS STRUCK (§298.5a).** "Real accretion produces T" — the
claim that **the X-junction is a design act and the T-junction a growth act** — **IS UNSOURCED AND
§261-BARRED**, and is withdrawn. It named no historical source and no corpus metric; it was a story
about why the number is what it is, and the number does not need it. What survives, and it is
enough: ⭐ **a naive street generator — one that lays a
mesh, connects points by shortest paths, or grows a lattice — produces X-junctions as its
DEFAULT, and the corpus does not.** And ⛔ **nothing in
§201/§202 constrains it: an all-X lattice satisfies every access and attachment law we have**
(§250.2). §201.2 gives a connectivity floor; §202 gives reachability; neither constrains the
*shape* of attachment.

**MECHANISM.** Streets are generated by **ATTACHMENT, NOT INTERSECTION**: a new segment is
seeded at a point **on an existing segment** (creating a T) and grown outward until it meets a
hard edge (wall, water, cliff, another street) — and the meeting is resolved by **terminating at
the frontage**, not by crossing it. **An X may only be minted when two arterials of the same
rank cross, and that event is budgeted, not free.**

**MESH QUALITY, narrow and diagnostic [M]:** mean degree **2.13–2.67 (median 2.47)** ·
edge/node ratio **1.17–1.55 (median 1.40)** · γ connectivity **0.393–0.521 (median 0.473)**.
**The corpus draws neither a tree (γ→0.33) nor a mesh (γ→1.0); it draws a HALF-MESH WITH A
STRONG T BIAS.**

**CENSUS BANDS (per leaf, and per epoch where an epoch is legible):**
`X:T ≤ 0.09` · `deg≥5 share ≤ 0.01` · `γ ∈ [0.39, 0.52]` · `mean degree ∈ [2.1, 2.7]`.
⛔ ⟦FOLD §297/§298⟧ **THESE BANDS ARE REGISTER-MATCHING TARGETS AND MAY ONLY BE ASKED
SAME-INSTRUMENT (§298.5a).** They were measured by a skeletonizer whose X-recovery is unmeasured
and large; asking them of our vector graph directly compares two different instruments. **A lawful
census rasterizes the generated output through the SAME skeletonizer, or publishes a measured
X-recovery correction from a synthetic grid first. Until one of those exists, this is a band we
aim at, not a gate we red on.**
**DERIVATION HOME.** T:X is driven by **founding kind × lawfulness × epoch**: a founded-planned
settlement (castra, bastide, charter borough) earns a **higher X budget in the epoch that was
planned and only there**; organic epochs get near-zero. §11.2's order drift moves the budget
over time. ⚠ **PLAN's TRACE 7 (hf239) makes the point sharply: the castra camp carries the
corpus's HIGHEST X share (0.088), and a global low-X rule would flatten it. The X budget must be
EPOCH-SCOPED.**

#### §1.1.7b · ORIENTATION-ORDER φ — **PARTIAL** (PLAN §1.2, adopted at §250.3)

Boeing's orientation-order φ (36 bins, bidirectional, length-weighted; 0 = maximally
disordered, 1 = a perfect single grid). **[M, CONFIRMED.]**

- **Whole settlements: φ 0.044 – 0.103 (median) – 0.433** — strongly disordered as wholes.
- ⭐ **The discriminator lives INSIDE the plate**: hf239's castra grid **0.585** vs its own vicus
  **0.074** (7.9×); hf26's Quartiere Nuovo **0.652** vs its surviving old fabric **0.069**
  (⟦FOLD §297/§298⟧ **9.4×**, corrected from 9.5× at §298.5e); hf274's Newcharter **0.318** vs
  Oldbank **0.131** (2.4×). All three rest on 76–136
  nodes and were **visually verified** — the camp skeleton traces the real *via principalis*.
  ⚠ hf347's core φ (0.707) rests on 11 nodes, is **not trustworthy**, and is used in no
  conclusion.

⭐ **PLANNED FABRIC NEVER REACHES φ=1. A PLANNED QUARTER THAT MEASURES φ > 0.8 IS DRAWN WRONG.**
The most rigidly planned quarter in the studiable corpus measures 0.652.

⭐ **φ AND X:T ARE TWO INDEPENDENT DIALS AND A PLAN NEEDS BOTH SET.** hf26's new quarter is at
φ 0.652 with an X share of only 0.020, because its grid is a **ladder** (one spine, rungs off
it) rather than a lattice.

**MECHANISM.** Each **epoch/organism** carries its own `orientationOrder` target and its own
**bearing basis**. Street bearings inside that organism are sampled from a von-Mises-like
distribution around the basis whose concentration is set by the target φ: organic → near-uniform
(φ→0.05–0.12); planned → two-lobed at 90° (φ→0.35–0.65) **with mandatory jitter** so it cannot
exceed ~0.7.
**DERIVATION HOME.** `foundingKind` × `epoch` × `lawfulness` × **event history** (a fire or a
sack licenses a *replanned* epoch — that is hf26 exactly).
**VERDICT: PARTIAL.** §5.0 and §11.2 name regularity as a dial and §161d gives per-district
grain angles. **Missing: a measurable target, the φ>0.8 ceiling, and a census that reads φ back
off the drawn geometry.** It is cheap — a histogram over drawn segment bearings — and it is the
**only number in this program directly comparable to published human-settlement figures.**

#### §1.1.7c · STREET WIDTH FROM GRAPH LOAD — **PARTIAL** (PLAN §1.4, corrected at §250.6c)

⭐ **WIDTH IS DERIVED FROM TRAFFIC, NOT ASSIGNED FROM A CLASS LADDER.** Compute a
betweenness-like load on the street graph using the settlement's own **gates, market, quays and
institution anchors** as origins/destinations; bin the load into 3–5 width classes; **the class
ladder is the QUANTISER, not the source** (§250.6c: *"width classes QUANTISE A DERIVED GRAPH
LOAD; they are not the source of width"*). The class **count** available is set by tier. The
widest rung is minted only if a top-rung generator exists (market void, arterial, quay street).

⭐ **PRIOR-ART CONVERGES ON THIS INDEPENDENTLY AND SUPPLIES THE BLUEPRINT.** FMG's road recipe —
proximity graph over anchors → cost-field pathfinding → **REUSE DISCOUNT** → segment splitting →
junction-coherent smoothing — makes hierarchy **EMERGE** rather than be labelled by fiat, and it
is *"the closest thing to a blueprint for our street layer"* (§253.3c; PRIOR-ART §7 row 3).
**ADOPT AS APPROACH, clean-room** (§248.2b — no code is copied). The same machinery re-sorts
under §161h's *"roads follow the money"*.

**MEASURED TARGETS.** Distance-transform width on the street skeleton, normalised to each
window's own cell pitch (**plot-widths**) [M, PLAN §1.4]: p50 **0.44 – 1.77 – 4.90** · p97
**1.24 – 5.72 – 22.07** · **hierarchy depth p97/p50 = 1.79 – 3.32 – 7.30**.
⚠ **THIS IS A DIFFERENT MEASUREMENT FROM ATLAS T-04's SCANLINE RATIO AND THE TWO MUST NOT BE
COMPARED DIRECTLY** — a scanline crossing a street diagonally over-reports its width and a
scanline crossing a square reports the square. Both bands are quoted in §2 with their instrument
named.
At the bottom of the ladder the hierarchy is **genuinely flat** (hf93 hamlet-street 1.79, hf88
thorp-crossroads 2.04): **there is only one class of street.** Towns and cities cluster tightly
at **2.4–4.6**.

#### §1.1.7d · DEAD ENDS ARE AN ACCESS/HARD-EDGE RESULT; THE POVERTY READING IS WITHDRAWN — **PARTIAL**

Dead-end share is **not a knob**. Cul-de-sac access to a canonical interior subject and a hard edge
that terminates a route are valid structural causes. **[M]** hf40's labelled halves differ (0.296
vs 0.215), but one synthetic plate cannot turn that correlation into a poverty law. Canal and wall
cases remain visual witnesses. The proposed rich 0.15–0.22 / poor 0.26–0.34 band is withdrawn as a
historical exit; current prosperity may not change street topology (§10.20–§10.21).

#### §1.1.7e · THE SLOPE GRAMMARS — **MISSING** (CX-03), blocked on S2

**Two street grammars, and they never mix** (CONTEXT §1.3):
- **CONTOUR-FOLLOWING streets carry the traffic** — long, curving, gently graded, wrapping the
  hill at roughly constant height.
- **FALLING-LINE links carry the pedestrians** — short, straight, steep, running directly
  downslope *between* the contour streets; where the gradient exceeds walking they become
  **stair alleys**, drawn as a ladder of treads with a **beast ramp at one edge**.
- ⭐ **THE BLOCK IS THE RESIDUE**, and it is **long, thin, curved and WEDGE-SHAPED where the
  contours converge.** *That wedge is the tell — it is what a rectangular-block generator on a
  hill cannot produce*, and under §239.1 it falls out for free.
- **The road in and out switchbacks**, and each hairpin is legible.

**[M-index]** contour/switchback/stair-alley/hollow-way/stepped is named on **24 of 138
settlement plates (17.4%)**; `terrace` on **17 (12.3%)**.
**VERDICT: MISSING.** §239.1 gives block-by-bounding-ways and §214 gives the drawn vocabulary;
**nothing generates a street that knows about gradient**, because `RELIEF` is a single scalar.
**This is the highest-leverage terrain mechanism in CONTEXT's half — one constraint on the
existing street derivation, and it converts `terrainType ∈ {hills, mountain}` from a label into
a shape.**

#### ⟦FOLD §264⟧ §1.1.7f · ⭐⭐ THE GROWTH ENGINE ITSELF — FOUR FOLDED MECHANISMS FOR THE PIPELINE'S SHARPEST GAP

**S7 is this specification's self-declared sharpest gap, and it is where the prior-art fold pays
most.** ⭐ **§263.5's practical headline: THREE OF THE TOP FOUR FTG ADOPTIONS LAND ON STAGES THIS
SPEC ALREADY NAMES AS ITS WEAKEST — S7, S18 and S16 — which is why they route straight into W2/W3
rather than into a backlog.**

**1 · ⭐⭐ PRIORITY-ORDERED GROWTH FROM A CENTRE, THE QUEUE SEEDED FROM RANKED APPROACH ROADS**
(FTG §6.1 — **rank #2 of all prior-art adoptions**). Roads grow from the settlement's anchors; main
roads form a backbone and ordinary roads branch from it; **which frontier expands next is decided by
a priority queue.** Processing order alone trades "compact blob" against "ribbon along the
arterials" — no second mechanism is needed.
**(a) CAUSE:** *priority is a fact we already hold* — S1's approach roads carry **ranks**, S13
supplies gates, and `institutions` supply origins and destinations. **Priority becomes a read-out of
route importance rather than a slider.**
**(b) LOOK:** gated on **γ connectivity 0.39–0.52** and **mean degree 2.1–2.7** (§2.4) — the
half-mesh signature — and on the **extramural growth** band (§2.5: present in ≥60% of walled plates,
concentrated at **one or two gates, never even**).
**(c) DIRECTION — the strongest (c) in either study.** ⭐ **A priority queue seeded from ranked
approach roads produces UNEQUAL RIBBON EXTENTS BY CONSTRUCTION**: the highest-ranked gate's frontier
is serviced first and runs furthest. Our measured target says extramural growth must be concentrated
and never even; **an even-growth mechanism cannot produce that, and a priority-ordered one produces
it as its default output.** *The mechanism's characteristic output and our measured target are the
same shape.*
⚠ **THE WIRING, AND IT COSTS NOTHING IF IT IS PLANNED: the QUEUE is W3's; its RANK SEEDING is
completed by G-1 in W5.** Until the region exists, priority is seeded from organism weight and gate
presence; when the region lands, the true road ranks replace that seed and W5's exit criterion 4
(unequal ribbons) becomes measurable. **Building the queue in W3 without the rank input is correct
and is not rework.** Entered as gap **G-36**.

**2 · ⭐⭐ STREET HIERARCHY COMES FROM SETBACKS, NOT FROM STROKED WIDTHS — ALREADY ADOPTED AT
§258.3(a).** There is no width attribute anywhere in the prior art: **each edge of a buildable area
is inset by a distance chosen by WHAT LIES ON THE FAR SIDE OF THAT EDGE**, and the visible street
width is **the sum of the two setbacks facing each other across it.**
⭐ **THIS IS NOT IN CONFLICT WITH OUR LAW; IT IS OUR LAW'S MECHANISM** — and §259.4 confirms the
outcome was **independently corpus-confirmed** before any source was read, which is why it survives
§261 (see §0.2a). The owner's stated intent (importance must be legible) and the measurable
signature (§2.5's p97/p50 scanline ratio **16–30**, widest channel **2.7–6.4** plot-widths) are
**preserved**; the execution moves from *"stroke a wider line"* to *"set buildings further back."*
⭐⭐ **AND IT MAKES §239's WALL-SIDE STREET FALL OUT FOR FREE INSTEAD OF BEING SPECIAL-CASED** —
the wall edge simply carries the largest setback. **Recorded in §3.6's substitution register in the
form §258.2 requires.**
⛔ **[RENDER NOTE — NOT A RECOMMENDATION] In their renderer the interior street is never stroked at
all. DO NOT COPY THAT.** Our corpus measures far richer on `wash_within_sigma`, `paper_grain_sigma`
and ink hierarchy than flat vector fill; **the PLAN insight transfers, the DRAWING does not**, and
imitating the flat interior would cost us corpus-band compliance (§256.2).

**3 · SNAP-AND-LENGTHEN ROAD CLEANUP, ⚠ MADE DEGREE-AWARE** (FTG §6.2 — rank #5). New segments are
lengthened and snapped to existing intersections as they are placed, which kills the two defects that
make grown networks look wrong: the road that stops two units short of a junction, and the near-miss
that leaves a sliver.
⚠⚠ **AND THE CAVEAT IS THE FINDING, SO IT IS ADOPTED WITH A MODIFICATION RATHER THAN AS-IS:
SNAPPING RAISES NODE DEGREE.** Snap a road end onto an existing T and **you have just minted an X**;
snap two ends onto one point and you have minted a star. Our bands are **`X:T ≤ 0.09`** and
**`deg≥5 share ≤ 0.01`**, with ⟦FOLD §297/§298⟧ **27** of 35 corpus windows carrying **zero** nodes
of degree ≥5 (corrected from 22, §298.5a). ⭐ **The
snap must therefore be DEGREE-AWARE: it may close a gap to a segment's INTERIOR (making a T) and must
REFUSE to snap onto an existing junction that would push it past degree 4** — terminating at the
frontage instead, exactly as §1.1.7a's attachment rule already requires. **Adopted with that guard;
adopted without it, this mechanism walks us out of our own band.**

**4 · ⚠⚠ THE CHAOS/ORTHOGONALITY PRINCIPLE IS A HYPOTHESIS ABOUT OUR MUSH AND MAY NOT DRIVE A REWORK
YET (§261.3).** The claim — *chaos belongs at the LARGE scale and orthogonality at the SMALL scale;
block frames meet at organic angles and the buildings inside them are near-rectangular* — was
Watabou's rank #2 and was read as the diagnosis of why our output looks like mush. ⛔ **§261
downgraded it: it is a hypothesis about OUR defect, not a description of OUR TARGET, and it MUST be
tested against the corpus's own measured block elongation and plot variance BEFORE it drives a
rework.** The test, its metrics and its one missing instrument are specified as gap **G-39**; **no
S7/S10/S11 rework may be started on this basis until it returns.**

**S7 OUTPUTS.** `streetWeb { segments[] with rank/width/class, junctions[] typed, gates[] }`.
**S7 LAWS.** §190a the right-of-way law (the derived street web is INVIOLABLE GROUND: zero
footprint-street intersections from the square to the last alley; buildings FRONT streets,
yards behind) · §201.2 street attachment (every segment attaches at ≥1 point; alleys explicitly
exempt) · §202 universal access (transitive reachability over streets ∪ alleys ∪ courts ∪
pedestrian gaps) · §11.2 order drift · §239.1 block termination.
**S7 CENSUSES.** §17.4 drawn street right-of-way **0 of 23,391, AREA-TRUE** (BUILT) · §201B
orphan segments **0** with a sever-one-segment counterfactual (BUILT) · §202 landlocked **0**
with a seal-one-gap counterfactual (BUILT). ⛔ **MISSING: `junctionMix`, `orientationOrder φ`,
`streetLoad`, and the per-district dead-end band.**
**S7 STATUS: PARTIAL.** The legality is proven and total; **the SHAPE of the graph is
unconstrained.** GAP-C is BUILT as a reporting census — 6 width classes per leaf at ratios
`1 : ~2.1 : ~2.2 : ~3.6 : ~8.8 : 48–60`, p97/p50 **9.9 / 12.1 / 12.4** at town/city/metropolis
against the organic corpus band 16–30 — *closing, still missing* (`laneMFB8-receipt.md` §7, §9).
⚠ **`laneMFB8-receipt.md` §7 records a real finding for the chair: the market void is present at
EVERY tier including village, where ATLAS T-04 says it belongs to town+.**

---

### S8 · BLOCKS AS THE PLANAR FACES OF THE STREET GRAPH — **PARTIAL**

**MECHANISM (§239.1, ruled).** ⭐ **A BLOCK IS DEFINED BY ITS BOUNDING RIGHTS-OF-WAY, NEVER
GROWN-THEN-CLIPPED.** Where growth meets a hard edge the block **ENDS** and the next block
begins on the far side. The owner's law generalizes to **all** hard edges — wall, street, water,
cliff. §239.1 explicitly names this as *"the structural cause behind the straddling districts
(§232) and the wall-band intrusions (§238)"*.

**THE ACCEPTANCE BANDS THAT MAKE THAT LAW CHECKABLE [M, PLAN §2.1 — 35 windows]:**

| statistic | min | **median** | max | **band to census** |
|---|---|---|---|---|
| elongation (major/minor) | 1.56 | **2.14** | 3.42 | **median 1.6 – 3.0** |
| circularity (4πA/P²) | 0.126 | **0.324** | 0.578 | (descriptive) |
| solidity (area / hull area) | 0.503 | **0.748** | 0.861 | **median 0.60 – 0.86** |
| area ratio p90/p10 | 5.8 | **13.6** | 204.5 | **≥ 6** |

Three readings, each load-bearing: **the corpus does not draw square blocks — it draws STRIPS**
(a block is what is left between two roughly parallel streets); **blocks are systematically
non-convex** (a quarter of a typical block's convex hull is not block — the signature of streets
meeting at angles); and **the area spread is the information** (hf40's 204× is the rich
quarter's great walled courts against the poor quarter's slivers **in one frame**).

⭐ **THE BAND IS ALSO A DETECTOR: a generator emitting median-square, high-solidity blocks has
silently reverted to grow-then-clip even if the code says otherwise.**

**DERIVATION HOME.** None needed — **if the street graph is right, the blocks are right for
free.** That is the point.
**LAWS.** §239.1 · §232.
**CENSUSES.** The three shape bands above. ⛔ Not built.
**STATUS: PARTIAL.** B8 built **plots cut to the block's admissible span** — a quarter-module
probe walks the rank line asking the same questions the culls ask, yielding the **contiguous
admissible spans**, each divided into a whole number of plots that exactly fill it (*"nothing is
left over, because there is no leftover to leave: the module bends to the block"*). ⭐⭐ **That
lever took §202 from 6 landlocked to 0 with ZERO edits to `accessLaw.js`** — the class being *a
repair pass can only reclaim what the cut left legal* (`laneMFB8-receipt.md` §3). ⛔ **§239.1
itself — blocks as planar faces defined by bounding ways — is WAVE NINE FIRST-ORDER and is NOT
BUILT** (§239.5).

---

### S9 · THE FRONTAGE LINE — **NOT BUILT.** The #1 ranked gap in both studies.

⭐⭐⭐ **THE FRONTAGE LINE IS THE CORPUS'S PRIMARY DRAWN OBJECT** (PLAN §10.1). At zoom on any
good plate, what the eye follows is **not** buildings and **not** streets — it is the
**continuous line where the built mass meets the street**, running the length of a block and
broken only at passages. **Buildings are subdivisions BEHIND that line.**

**THIS INVERTS THE NATURAL IMPLEMENTATION ORDER** (place buildings → streets are what is left).

**MECHANISM.** Generate the frontage line as a **first-class object per block face**, then
subdivide behind it. The block face comes from the street graph (S8); the subdivision is S10's
plot series.

**THREE INDEPENDENT LINES OF EVIDENCE CONVERGE HERE** — PLAN §2.3 (the plot series is drawn as
a comb measured from the frontage), §2.4 (the block's face and interior are drawn in **different
registers**: the street face is a continuous ink line at the heaviest fabric weight, unbroken
for the whole block length except at plot passages; the interior is drawn at roughly half that
weight in fragments), and §10.1 (what the eye actually follows). ATLAS **GAP-D** reaches the same
object from the lineweight side and calls the block silhouette *"the single largest
visual-quality lever identified in this study"*. **§250.6(d) records that the #1 ranked gap
independently reproduces MF-S1's un-defer recommendation for §18.5 — confirmed by two studies on
disjoint evidence.**

**LAWS.** §190a's fronting law (*facades ON the street line — the fronting law is what gives a
channel its walls*) · §17.4 · §18.5.
**CENSUSES.** Frontage continuity per block face: the share of a block face's length carried by
a continuous frontage line, banded; passages counted, not gaps.
**STATUS: NOT BUILT as an object.** B8 landed its **consequences** (the two-tier stroke, the
building touching the street line) without the object itself. ⚠ **And the zoom found the cost of
that:** *"BLOCK FRONT LINES RUN ACROSS GROUND WITH NO BUILDINGS ON IT — a rank run whose plots
the culls thinned still emits its full front and back lines, so heavy frontage strokes appear in
open ground"* (`laneMFB8-receipt.md` §14). **A frontage line derived as an object, from what
actually stands, cannot do that.**

---

### S10 · THE PLOT SERIES (THE BURGAGE COMB) — **PARTIAL, and the built half is good**

**INPUTS.** the frontage line (S9) · any explicit `PLAN_INTENT`/holding module · parcel/tenure
lineage · dated subdivision/amalgamation/construction operations · function/access requirements.
Tier, current wealth, age and prosperity trajectory are not parcel-width or event generators.

**MECHANISM.** A plot-series materializer runs along each eligible frontage: honour explicit
modules and predecessor/ownership boundaries, then realize only the dated subdivision or
amalgamation operations the world supplies. Where historical inputs are absent, a generic legal
subdivision may be an explicitly uncalibrated structural candidate, never a claim that plots form
2–6 runs at ±10% or that wealth/age caused a split.

⭐ **THE RHYTHM IS THE FINDING, AND IT IS CLUMPED, NOT NOISY** (PLAN §2.3). Adjacent plots share
widths closely — a burgage and its neighbour were laid out together — and the series then
**jumps** at intervals: a double-width plot marking an amalgamation, a narrow one marking a
subdivision. ⭐⭐ **What the eye reads as "hand-drawn" is this RUN-LENGTH STRUCTURE, not
per-plot noise.**

⛔ **Prosperity/decline does not choose amalgamation versus subdivision.** Both directions occur for
multiple legal, tenurial, demographic and rebuilding causes. Each is a dated parcel operation; a
population trajectory alone cannot author it.

⭐ **THE CORNER PLOT IS TOPOLOGICALLY DIFFERENT.** It may own two frontage relations and can support
an L-footprint. Larger area, extra articulation and commercial use are candidates requiring the
actual parcel/function facts; no 1.4–2.0× size or smithy/inn/shop preference is universal.

**SYNTHETIC VISUAL TARGETS (ATLAS T-08, [M] on hf72 and hf56 native crops; not historical
calibration):** plot depth : width ≈
**4–6 : 1** · the building occupies **30–45% of plot depth at the street end** · the remainder
is yard/toft · buildings **touch the street line** · adjacent plots in a series share widths to
within **±20–40%, never exactly**.

**STATUS: PARTIAL — the module is BUILT, the rhythm is not.** `parcels.js`, landed at MF-B8
(`laneMFB8-receipt.md` §2; ODQ §229.1):

- `PLOT_DEPTH_RATIO` **2.35 → 4.20** at town+ (1.80/1.30 below — *a croft is not a burgage*);
- the building takes **24–52% of plot depth, mean ~0.38** — measured *inside* T-08's band, and
  what appears behind it is the **TOFT**;
- series widths share to ±20–40%, one amplitude per row, per-plot draws inside it, the row
  normalised back onto its block;
- ⭐ **the building TOUCHES the street line** — the front wall used to start `gap × 0.4` behind
  it, *i.e. the frontage line dissolved by a rounding allowance*. The setback is now the
  **exception it was in the record** (one holding in six);
- **31 distinct stroke weights per leaf against b6's ONE** for the fabric.

⭐⭐ **THE FORENSIC ZOOM SAYS THE BURGAGE RANGE WOULD SIT BESIDE THE REFERENCE** —
*"continuous heavy frontage lines with rows of narrow abutting holdings on them, each divided
from its neighbour by a light party line, and long pale tofts running back to a dashed back
lane. This is hf72's structure, and b7 had no expression for it at all"*
(`laneMFB8-receipt.md` §14). **CONFIRMED by chair eyes at §252.3(c).**

⛔ **MISSING: the clumped run-length rhythm, the amalgamation/subdivision event, and the corner
plot as a distinct object.** ⚠ **And the chair's own 3000px zoom at §252.3(c) found the cost:
*several blocks' parallel building bars read MECHANICALLY — plot-width or depth variance too
low*, which is ATLAS banned prior #7's neighbourhood.** That is exactly what the run-length
structure fixes.
⚠ Two zoom defects remain open: **isolated plots carry full-length tofts** (a single surviving
fringe holding draws a 4.2:1 toft into open country, reading as a fence to nowhere), and
**clipped institution solids become spikes** (a large body reduced by the ground law's clipping
to a long dark triangle attached to nothing — *lawful geometry and a bad drawing*; the cure is a
shape-aware clip or a demotion rung for institutions).

⭐ **PLAN's TRACE 8 (hf93 hamlet-street) settles a scope question: the burgage comb is NOT a
town-and-above feature.** It is present at hamlet tier — measured φ 0.433, the highest of any
organic window, *precisely because a single street with a regular toft comb IS an ordered
structure* — and it is what the whole later block structure grows out of. **An additional
argument for un-deferring §18.5, which §209.3 SCOPE-1 already did.**

---

### S11 · FOOTPRINTS — **PARTIAL** (PLAN §3, CX-34)

**⭐ THE CORPUS AVOIDS MONOTONY WITH SIX DEVICES, AND ONLY ONE OF THEM IS PER-BUILDING NOISE.
The instinct is to jitter footprints, and jitter is the WEAKEST of the six** (PLAN §3):

1. **THE TWO-LEVEL FOOTPRINT DISTRIBUTION.** Within a block there is a **module** (the common
   house, repeated with modest variation) and a small number of **outliers** (2–4× module: the
   corner property, the inn, the merchant's house, the workshop range). **A block of 20
   buildings typically shows 16–18 near-module and 2–4 outliers.** ⭐ **The eye reads richness
   from the OUTLIERS, not from the module's variance.**
2. **L-, U- AND COURTYARD PLANS AT THE OUTLIERS.** The outliers change **plan topology**, not
   just size. ⭐ **The single most effective anti-monotony device in the corpus, because it
   breaks the SILHOUETTE, not just the size.**
3. **RUN-LENGTH RHYTHM ALONG THE FRONTAGE** (S10).
4. ⭐⭐ **ORIENTATION DISCIPLINE THAT IS LOCAL, NOT GLOBAL.** Every building in a range shares
   its neighbour's bearing to within a degree or two — they share party walls. But the *range*
   turns with the street, and adjacent ranges on different streets sit at frank angles.
   **The corpus is RIGIDLY DISCIPLINED AT THE RANGE SCALE AND FREE AT THE BLOCK SCALE.** A
   generator that jitters individual bearings destroys the range; one that aligns everything to
   a global grid destroys the block. **THE BEARING CARRIER IS THE STREET SEGMENT, AND BUILDINGS
   INHERIT IT.** *(PLAN calls this "nearly free and the single highest-return item in the
   section.")*
5. **TONE JITTER IN TWO NESTED LEVELS** — a ward-level sub-palette, then a per-building jitter
   inside it (S22).
6. **THE ROOF-TICK VOCABULARY** — gable, hip, cat-slide, cross-gable read as different plan
   marks. Two extra strokes per building.

**THE ORDINARY : NOTABLE RATIO [E, PLAN §3].** Notable structures run **2–5% of footprints at
town scale and 1–2% at city scale**, while occupying **10–20% of built area**. ⭐ **The corpus's
monumental budget is SMALL IN COUNT AND LARGE IN AREA — the opposite of a generator that
promotes many buildings by a small factor.** ⚠ ATLAS T-16 measures b6 at monumentals
**11 / 18 / 26** against the corpus's *legible* budget of town 3–7 / city 4–9 / metropolis 9+,
with a landmark-to-house footprint ratio of ~2:1 against the corpus's **5–12:1**. **We draw too
many, too small.**

#### ⭐ MATERIAL DRIVES FOOTPRINT GRAMMAR — **MISSING** (CX-34); retained inside the European-fantasy scope

A historically evidenced `buildingMaterialSystem` derived from `resources` × `terrainType` × dated
building function/phase inside `EUROPEAN_FANTASY_BASE` may select a **footprint grammar**; the
narrative culture token does not. Each admitted grammar carries its **own packing rule, alley-width floor, party-wall
behaviour and corner radius**:

`rectangular row` (timber / stone frame) · `thick-walled courtyard compound` (earth) ·
`pile / boardwalk` (wet) · `rock-cut chamber row` (cliff) · `sod or turf construction` (treeless
cold). These are candidate mechanisms pending AMP-1/RSLP-1 evidence, not a closed universal list;
mobile camp grammar is outside the current urban map program.

**The evidence [M-view, CONTEXT §7.2]:** hf327 — no stone and no timber ⇒ thick earth walls ⇒
round-cornered compounds ⇒ wall-to-wall packing ⇒ alleys one line wide, dog-legged, dead-ended
⇒ **a grain unlike anything else in the corpus, and legibly a consequence of the building
material.** hf304's specimen sheet captions its eight vernacular dwellings with **invented
country names precisely so the plate teaches that form follows material and climate rather than
culture.**

⛔ **HISTORICAL VERDICT, SCOPE-CORRECTED BY §10.18/§10.21:** §251.3 correctly found that material
and climate can change footprint grammar, party walls and packing, but the later owner ruling makes
the settlement map explicitly `EUROPEAN_FANTASY_BASE`; it no longer owes universal or non-European
morphology. Within that scope, §17.1 (party walls) and §17.4 (fronting) still encode one
euro-temperate grammar too narrowly. hf327 remains a synthetic hypothesis that a different lawful
material system can produce a different plan from the same population/trade; it is not empirical
evidence for a culture or a licence to add a global style pack.
⚠ **`buildingMaterial` is *nearly* derivable from `resources` — but the mapping from a resource
list to a material grammar affects every footprint and therefore every leaf's geometry, i.e. it
is a declared-shift event.** CONTEXT §12.4 flags it rather than assuming it.

#### ⟦FOLD §264⟧ ⭐⭐ SUBDIVIDE TO GET THE **PLOT**, THEN **FIT** THE FOOTPRINT — A §258.2 SUBSTITUTION (§263.4)

**This is the fold's cure for the defect both prior-art products' authors flag, and it is an
ARCHITECTURAL cure rather than a filter.** The natural implementation — recurse, cutting the block
until each piece is building-sized — makes the footprint's shape *whatever the cuts left*, and
recursive cutting of an irregular polygon **inevitably yields wedge-shaped remnants**. The original's
own author calls his routine silly for exactly this reason and intended to replace it.

⭐⭐ **THE SUBSTITUTION: SUBDIVIDE TO GET THE PLOT, THEN CHOOSE A SHAPE FROM A RECTILINEAR VOCABULARY
AND FIT IT TO THE PLOT.** Subdivision is *good* at producing a believable irregular **plot series** —
that is exactly what a burgage comb is — and *bad* at producing a believable **building**. Use each
for what it is good at and **the wedge problem disappears without needing a filter to catch it**:
a shape drawn from a rectilinear vocabulary and fitted to a plot **cannot come out triangular**, and
the plot's leftover becomes **yard** rather than becoming a bad building.

⭐ **AND THE CONSEQUENCE FOR OUR OWN CONSTRAINT, WHICH §263.4 STATES DIRECTLY: OUR ASPECT-RATIO
CONSTRAINT BECOMES A HARD FILTER, NOT A TENDENCY.** A tendency lets a wedge through occasionally; a
vocabulary makes it unrepresentable.

**(a) CAUSE.** S10's burgage comb and S11's module/outlier structure already derive plot geometry
from district facts; **the VOCABULARY a footprint is drawn from is a function of building kind and
district lifestyle — both dossier facts.** ⭐ *The shape is chosen because of what the building IS,
not because of where the cuts fell.* It composes directly with **G-6's material grammars**, which
supply a *different* vocabulary per material (row · courtyard compound · pile · rock-cut · keyhole ·
tent circle) rather than a different jitter.
**(b) LOOK.** Gated on **block solidity median 0.60–0.86** and **block elongation median 1.6–3.0**
(§2.4), and on the **burgage plot geometry** band (§2.5: depth:width 4–6:1, building 30–45% of plot
depth, **touching the street line**, series widths ±20–40% and never exact).
**(c) DIRECTION — and it is the cleanest (c) available in either study.** §2.5 records exactly where
we miss: the **alley/sliver floor** band is **0.02–0.08** plot-widths and b8 reads **0.16 / 0.09 /
0.09**, with this spec's own comment that *"a HIGHER floor means UNIFORM SPACING, not tight packing —
the town moved the WRONG way."* **A fitted-vocabulary placement puts buildings on the street line at
their own widths and sends the residue to backland, instead of distributing residue evenly as
inter-building gaps.** *The known miss and the mechanism's known effect are the same quantity,
pointing the same way.*

⚠ **THIS SUPERSEDES A NATURAL READING OF THE EARLIER STUDY.** WATABOU §5.2 recommended adopting the
subdivision modulations **plus** a hard aspect-ratio filter to catch the wedges. **The stronger
option is not to produce the wedge**: the two are not exclusive, and the synthesis is the one
recorded in §3.6's register. Entered as gap **G-37**; routed to **W3**, where the frontage line and
the plot series are already being built.

**SURVIVING LAWS.** §190 hard non-overlap — footprints are **MUTUALLY EXCLUSIVE SOLIDS** and legal
party-wall contact is typed, never overprint; the packer diagnoses repair rather than hiding an
intersection · §190a fronting · named institutional bodies remain real compositions rather than
scaled sprites. ⛔ §190c's worksite habitation selector and tier/rung frequencies are `RSLP-1`
hypotheses, not S11 laws; a canonical rural work complex may enter only through §10.23.
**CENSUSES.** §17 drawn-geometry disjointness **0 intersecting pairs, all 16 leaves** (BUILT,
area-true) with a planted-overlap counterfactual.
**STATUS: PARTIAL.** Disjointness, party-wall packing, the two-tier stroke and the institution
ladder are BUILT. ⛔ **MISSING: the module + outlier-budget structure, the plan archetypes at
the outliers, the bearing-from-street rule, and the material grammar.**

---

### S12 · BACKLAND CORES AND THE VOID HIERARCHY — **PARTIAL**

#### §1.1.12a · THE BACKLAND CORE (PLAN §2.2)

⭐ **THE SYNTHETIC CORPUS OFTEN DRAWS A PERIMETER BLOCK WITH A GREEN CORE. ITS PIGMENT MEASURE IS
A VISUAL-REGISTER OBSERVATION, NOT A HISTORICAL INCIDENCE OR WEALTH READ.** Median block green
share (green index `2G − R − B`, calibrated on hf72), [M]:

| window | median block green share |
|---|---|
| hf88 thorp-crossroads | 0.605 |
| hf331 dual-lordship town | 0.395 |
| hf90 thorp-plains | 0.358 |
| hf138 harbor-ribbon | 0.172 |
| hf72 **west (citadel borough)** | **0.126** |
| hf235 city-canals | 0.127 |
| hf72 **east (river borough)** | **0.028** |
| hf40 **rich quarter** | 0.0056 |
| hf40 **poor quarter** | **0.000** |
| hf34 metropolis-capital | 0.000 |

**The measured pigment gradient suggests a land-pressure hypothesis; it does not prove land price,
prosperity or historical frequency.** The plates range from high visible green share at low tiers to
near zero in some dense cores, with within-settlement contrasts in hf72. That is eligible as a
projection/composition target only; runtime cause requires parcel occupation/history evidence.
⚠ **HONEST LIMIT, and it binds any use of this number: the measure reads PIGMENT, not land use.
A plate that draws its yards in the same warm tone as its roofs scores 0 regardless. A HIGH
score is strong evidence of backland; a LOW score is NOT evidence of its absence.** One-way test
only.

**MECHANISM BOUNDARY.** The block interior is **not empty space left over**. It contains canonical
parcel/backland units whose dated use may be yard, garden, workshop, privy, well, later building or
unknown. A projection pass draws those facts; it does not fill a target percentage.
**DERIVATION HOME.** frontage/parcel lineage + explicit occupation/use + dated subdivision,
amalgamation or construction operations + applicable land pressure/function mechanisms after their
historical gates. `districtWealth` alone is forbidden, and current prosperity never rewrites the
inherited parcel.
**VERDICT: PARTIAL.** §203 arm 2's zone-fill bands remain visual instrumentation only. ⛔ **What is
missing is that FILL IS CURRENTLY A SHARE, NOT A
STRUCTURE**: a block at 70% built could be a perimeter block with a garden core or a scatter
with gaps, **and those read completely differently at glance range.**
⭐ **PROPOSED: `backlandCore` as an explicit derived object per block.** This is what makes
§201's alley register and §204's rarity ruling coherent, because **a court is then a backland
core that failed to get a mouth**, rather than a separately-invented feature.

#### §1.1.12b · THE FOUR VOID KINDS (PLAN §5.3)

| kind | drawn as | generated by |
|---|---|---|
| **PUBLIC TRAFFIC VOID** | bounded by continuous frontage, entered by streets, at street tone | market, green, forecourt |
| **PRIVATE ENCLOSED VOID** | bounded by a wall or range, entered by **one controlled gap** | precinct court, cloister garth, inn yard, castle bailey |
| **BACKLAND VOID** | never entered from the street directly; reached through the plot | §1.1.12a |
| ⭐ **AGRICULTURAL / VACATED VOID *INSIDE* THE SETTLEMENT** | orchards, closes, tenter grounds, brickfields, garden plots **inside the wall** | high-water extent minus current fabric |

⭐ **THE FOURTH IS THE ONE A GENERATOR WILL FORGET, AND THE CORPUS DRAWS IT CONSTANTLY** —
hf347's ORCHARDS / CLOSES / TENTER GROUND / BRICKFIELD / BUILDING PLOTS all sit inside the outer
circuit; hf121's outer ring is GARDEN PLOTS & PADDOCKS; hf306's intramural land is NEW FIELDS
and TERRACED GARDENS.
⚠ **MEASUREMENT CAVEAT THAT MUST TRAVEL WITH ANY VOID INSTRUMENT: "largest void" is NOT "the
centre".** On type-4 plates the largest void is the *emptiness* — hf347's largest measures 1009
plot-widths² and is its unbuilt outer ring, not its market. **Separate them by asking whether
the void is bounded by FRONTAGE (a market) or by the WALL (vacancy).**

⭐ **`intramuralVacancy` — a typed state, not a positive fill generator.** A cadastral face inside
a surviving circuit may be unoccupied, agricultural, industrial, garden, ruin, cleared or unknown.
Its area comes from preserved circuit/parcel boundaries and time-indexed occupation, not from
subtracting a population-supported radius. Its land use requires a dated operation or explicit
world fact; suitable clay or a cloth institution constrains a recorded brickfield/tenter ground but
does not invent one.
⛔ **VERDICT: THE CANONICAL STATE IS MISSING.** §239.4 records that circuit and fabric can have
different lifetimes, while historical Wave 1 supplies both vacancy/reuse witnesses and
counterexamples. Unknown ground remains an honest unknown/quiet projection; neither generic wash
nor a synthetic plate's named use may become world truth by gap filling.

#### §1.1.12c · CENTRES ARE MINTED BY CAUSE, NEVER PLACED BY COUNT (PLAN §5.1–§5.2)

**Six structurally distinct centre types — not one primitive resized:**

1. **THE STREET WIDENING** (cigar-shaped) — the market *is* the main street, swollen; stall
   ranks down the middle leaving two carriageways; frontage continuous through it. Most common
   at village and small-town tier.
2. **THE TRIANGULAR GREEN AT A FORK** — three roads meet, the residual triangle is the green, a
   well or cross pins it.
3. **THE CARVED SQUARE** — a deliberate rectangular void with 3–4 entry gaps, a market hall or
   cross in it, and ⭐ **ENCROACHMENT ISLANDS**: permanent buildings that have eaten into the
   square's edge. *(Already ratified as a pinned feature under §201.1c — the corpus draws it
   constantly and we keep it.)*
4. **THE CHURCHYARD / PRECINCT COURT** — an enclosed void, walled or railed, **not a traffic
   space**.
5. **THE CASTLE FORECOURT** — a cleared apron outside the castle gate, held clear for military
   reasons, often the largest single void in a small town.
6. **THE BRIDGEHEAD / QUAY WIDENING** — a void at the point of transhipment, **shaped by the
   water edge rather than by frontage**.

**MINTING RULES.** The primary market **always**, at the highest-load junction reachable from
the strongest gate · a **second market iff a second jurisdiction or a second charter/borough
exists in the dossier** · a precinct court per major religious institution · a forecourt per
fortified compound · a bridgehead/quay void per transhipment point. Then the **type** is
selected by cause × graph position: a void at a fork becomes a triangular green; a void on a
spine becomes a widening; **a void minted by an AUTHORITY becomes a carved square**.

**POLYCENTRICITY IS MEASURABLE [M, PLAN §5.2]**, as second-largest void ÷ largest void:
**monocentric (<0.15) 12 of 34 · polycentric (>0.55) 13 of 34 · intermediate 9 of 34.**
**Void count ≥4 plot-widths²: median 7 per settlement, range 0–24** — so the median studiable
settlement carries **seven distinguishable open spaces**, of which one or two are "centres".
⭐ **The polycentric plates are polycentric for DERIVABLE reasons every time**: two nuclei that
grew together; **two jurisdictions**; a water morphology with many campi; a settlement whose
centre has *moved*; a decayed settlement whose surviving huddle has its own new centre inside
the old one.
⛔ **MISSING: the void typology (we appear to have one square primitive) and the
`secondAuthority ⇒ secondCentre` derivation** — the most legible polycentricity cause in the
corpus and **fully derivable from `powerStructure` and institution attribution**.

**S12 LAWS.** §201 the alley register (an alley is BLOCK-INTERIOR space, not a street; it draws
in its block's **interior/yard ground tone**, never street colour; three lawful topologies —
isolated interior courts, through-alleys, cul-de-sac pockets; **island buildings inside block
interiors adjacent to NO street are a RATIFIED, PINNED feature**) · §202 (a route-isolated court
must still **percolate** to the web by at least a narrow pedestrian gap — a hermetically sealed
court with buildings is a violation) · §204 courts are RARE · §203 arm 2 zone fill.
**S12 CENSUSES.** ⛔ **T-06 court frequency is NOT BUILT** — courts are still not classified
(`laneMFB8-receipt.md` §9). **The band exists and is waiting:** §209.4 reconciled §204 with the
corpus — **route-isolated courts 3–15% of blocks (rare, as ruled); interior yards WITH a mouth
are a DIFFERENT OBJECT, common (15–65%) and unrestricted.** ATLAS T-06 proposes ≤12% of blocks
AND ≤20% of all block-interior open spaces, **with a floor of >0 at town+ so the feature is not
optimised away.**
**S12 STATUS: PARTIAL.** §201A.1's alley tone is BUILT and confirmed by chair eye (§212.1);
zone fill is measured with a **declared measurement mismatch** (see §2.4).

---

### S13 · THE CIRCUIT FOR EPOCH E — **PARTIAL. Traced and contained; the RUN TYPING is missing.**

**INPUTS.** the completed epoch's fabric (S6–S12) · the substrate's terrain and water (S2, S4) ·
`institutions` (which demand inclusion) · `history` fortification events · `prosperity` (masonry
is expensive) · `threats` and `defenseGenerator`'s military scores · the region's roads (gates).

#### §1.1.13a · ⭐⭐ THE CIRCUIT IS A CHAIN OF TYPED RUNS (CX-13) — the highest-leverage single mechanism in CONTEXT's half

**The corpus proved this the hard way.** The polygon/oval circuit prior **survived HF-1, HF-2
and HF-3 and deformed at least eleven plates**. It was cured — at n=6 — by **enumeration with
reasons**: naming N runs and giving each its own narrative (§242.2). *That is a
prompt-engineering result; its engineering translation is the finding.*

⭐⭐ **A WALL IS NOT A SHAPE FITTED AROUND A FABRIC. A WALL IS A SEQUENCE OF RUNS, EACH OF WHICH
IS A DECISION WITH A CAUSE — and every one of the causes comes from facts we already hold.**

| run type | cause | drawn as | our derivation home |
|---|---|---|---|
| **CREST / RIDGE RUN** | high ground worth holding | long, straight-ish, **towered** | substrate relief |
| **NOTCH** | an institution demanded inclusion | the wall **doubles back** to wrap a precinct | `institutions` |
| **DETOUR TO A WORK** | a registered fortification project included a pre-existing work | a hard kink around the asset | dated circuit/work relation + explicit spatial body |
| **TERRAIN-SURRENDER RUN** | a cliff/scarp/marsh defends itself | the wall **thins to a parapet or STOPS**; **zero towers** | substrate |
| **WATER TERMINATION** | the river is the flank | wall ends at the bank; **a chain across the water** | water system (S4) |
| **TOFT-BACKS RUN** | the wall was built along existing property | **wobbles plot by plot** along the backs of the tofts | the fabric's own plot geometry |
| **NEW CUTTING** | one campaign, one decision, open ground | **ruler-straight**, long | §240 epoch model |
| **RE-USE RUN** | an older ditch or work was on the line | straight cut across an old ditch; **the ditch survives as gardens** | `history` |
| **BAD CLOSURE** | two campaigns met and did not agree | a **visible seam**, a mismatched join, one odd tower | §240 epoch model |

**MECHANISM.** Walk the boundary of the epoch's built extent and **segment it into N runs BY
CAUSE**, choosing each run's type by testing the local substrate / fabric / institution
conditions in a fixed priority order. Each run then carries its own generation parameters:
straightness, tower policy, thickness, ditch policy, wall-foot policy. **N is not a knob — it
falls out of how many distinct conditions the boundary crosses.** Closure between the first and
last run is **deliberately imperfect and marks a seam.**

⛔⛔ **VERDICT: PARTIAL, AND THE SEQUENCING IS RULED. §251.4(b): §240 AND THE RUN-CHAIN ARE ONE
PIECE OF WORK AND THEY LAND TOGETHER.** Three rings derived **without** run typing come out
**CONCENTRIC** — the exact prior the corpus spent three growth rounds and eleven deformed plates
failing to beat. *Landing §240 alone would ship the defect and then pay a declared shift twice
to remove it.* §205.3 (terrain-maximised defences) is RULED and covers two of the nine run types
correctly and explicitly (*"a cliff flank needs NO wall — drawing one is the violation"*); §161m
gives a wall-trace law. **What no law supplies is that the trace is a CHAIN OF TYPED RUNS rather
than a single trace with exceptions** — and that difference is exactly what ATLAS Table A's T-10
verdict measured as b6's failure: ***"the trace reads geometric, not economic."***

#### §1.1.13b · TOWERS, GATES, THE WALL FOOT

**⭐ TOWER PLACEMENT IS OPPORTUNISTIC, AND THE ASYMMETRY IS THE TELL [M-view, n=7]: 6 of 7
walled plates show towers ABSENT on at least one flank, and in every one of those six the bare
flank is the TERRAIN-DEFENDED one** (river, cliff/scarp, marsh).
**MECHANISM (CX-14).** A **per-RUN** tower policy: `none` on terrain-surrender and water runs;
`clustered` on runs facing approach or level ground, count driven by run length × threat;
`sparse` elsewhere. Positions within a run are **seeded-irregular** (§214 bans even spacing by
name; ATLAS banned prior #7 makes even spacing *the strongest "generated" tell in the corpus*).
⭐ **A TOWER IS A TYPE, NOT A REPEAT** — hf315 draws ten genuinely different ones, of which the
**open-backed D** and the **beaked tower** are *functional* choices, not styles.
⚠ **The difference the per-run policy buys: "irregularly spaced all the way round" is still
wrong; "clustered where it matters and absent where it does not" is right.**

⟦FOLD §264⟧ ⭐⭐ **AND THE MECHANISM BEHIND IT, WHICH TWO INDEPENDENT PRIOR-ART PRODUCTS NOW AGREE
ON (§259.3, corroborated at §263 §12): EVEN TOWER SPACING IS *EMERGENT*, NOT ENFORCED.** Towers sit
at **every non-gate wall corner** — no spacing rule, no arc-length division, no minimum separation,
no count parameter anywhere. They *look* evenly spaced only because the cells behind the wall have
near-uniform area, so consecutive corners are near-equidistant. **The evenness is a downstream
consequence of what is inside the wall.**

> ⭐⭐⭐ **RULED (§259.3), AND IT RE-READS ATLAS BANNED PRIOR #7 RATHER THAN REPEALING IT:
> NEVER PLACE BY SPACING — PLACE BY STRUCTURE (the corners that exist) AND LET THE SPACING BE
> WHATEVER THE STRUCTURE GIVES. EVENNESS THAT EMERGES IS AUTHENTIC; EVENNESS THAT IS DIALLED IS
> THE TELL.**

⛔ **IMPLEMENTING A SPACING RULE WOULD REPRODUCE THE LOOK AND DESTROY THE MECHANISM** — and would
lose precisely the irregular cases, because a real circuit's corners are *not* evenly spaced when
the districts behind them are not uniform. ⭐ **This gives us something neither prior-art model can
express: our wall is a DISTRICT PARTITION (§232), so its corners are already dossier-caused, and
where our districts are deliberately non-uniform the tower rhythm varies — and it varies FOR A
REASON.** No new geometry, no new parameter: the tower rhythm becomes a **read-out of district
structure**, which is the derivation home a spacing constant could never have.

⛔⛔ **BUT THIS MECHANISM IS GATED SHUT UNTIL AN INSTRUMENT EXISTS, AND §263.6a ORDERED IT BUILT.**
Leg (b) fails today: **there is no tower-spacing metric of any kind anywhere in our measured
register** — no spacing distribution, no spacing CV, no tower count per unit of circuit — so *our
own* "even tower spacing is the strongest generated tell" claim rests on visual analysis rather than
on a number (§259.5). ⚠⚠ **That is exactly the condition in which a plausible idea becomes an
unmeasured habit, and two prior-art products agreeing makes it MORE dangerous, not less.**
**The instrument — spacing CV along the circuit, plus tower count against circuit length — is gap
G-40 and lands in W0. The corner rule may not be adopted before it reads a number.**

**GATE COUNTS [M-view, small n but consistent]:** town **2–4** land gates · city **~4** ·
metropolis **6–7**. `gate` is named on **63 of 138 settlement plates (45.7%)** [M-index].
Gates are **typed road terminals** (CX-15) placed after the run chain and after the region's
approach roads — which is why S1 blocks this.

**⭐⭐ THE WALL-SIDE STREET (§239.2), AND ITS PER-RUN CORRECTION.** On **both** sides of the wall
there are streets, with very few exceptions — historically the **intervallum** inside
(circulation, firebreak, muster) and clear ground / ring road outside. ⭐ **THE ENGINEERING GAIN
over today's reserved band: the wall is always reachable, every gate necessarily meets the
street web, and "no building touches the wall" becomes a CONSEQUENCE OF GEOMETRY rather than a
policed rule.**
⛔⛔ **AND CONTEXT SHARPENS IT INTO A DERIVATION, WITH A CENSUS CONSEQUENCE §251.4(b) RULED:
7/7 walled plates show a wall-side street on SOME runs; 0/7 on EVERY run.** So §239.2's "very
few exceptions" is a **PER-RUN policy**, not a global rule — and **§200's clearance census WILL
RED ON CORRECT OUTPUT unless its exemption keys to RUN TYPE.** ATLAS T-22 already warned that
**inner-face abutment is NORMAL in military compounds** and must be exempted by name; CONTEXT
widens that from "military compounds" to **"any run built along existing property"** (the
toft-backs run). ⚠ **A global ring road would produce a band the corpus never draws.**

**FLANK GRAMMAR FREQUENCIES [E, ATLAS T-10] — the calibration a builder aims at:** of ~29 walled
plates, **full closed ring ≈55% · half-ring against water ≈17% · terrain-anchored with a flank
left unwalled ≈14% · wall crossing water with water gates ≈10% · two vintages in one frame
≈10%.** ⭐ **A GENERATOR THAT DRAWS A FULL RING 100% OF THE TIME IS WRONG BY ~45 PERCENTAGE
POINTS.**
**Walled incidence [E]:** walled ≈29, unwalled ≈12 of 41 settlement plates, **and the split is
almost exactly the tier line — essentially every town+ is walled; essentially no village or
below is.**

**S13 OUTPUTS.** the circuit node — one ring per epoch, carrying `epoch`, `epochHull`,
`containmentResidual`, `closedPolygon`, gates, towers, ditch.
**S13 LAWS.** §161m the wall-trace law (circuit economy — *the wall hugs tight because every
meter cost a fortune, high-water sizes what PAID for it*; terrain service; water as the fourth
wall; gates few, at the road-weighted crossings, gatehouse-built; palisade rounder/simpler vs
stone tower-to-tower curtains; citadel as the strongest corner, **never floating**) · §200 the
wall-clearance law (the wall band = stroke width + derived clearance is a RESERVED RIGHT-OF-WAY
exactly like streets: **ZERO footprint-area intersection**) · §205.3 · §214's wall arm (visible
masonry thickness — **a double-line band, never a bare polyline**; towers as drawn rounds/
squares at seeded-irregular intervals; crenellation texture where scale permits; gatehouses as
**structures**; keep/motte with hachure; palisades as tick-rows; ditches in ditch grammar;
**all tier-scaled**) · §232 · §239.2 · §240.
**S13 CENSUSES.** §200 drawn wall band **0 of 23,391, AREA-TRUE** (BUILT), with gates, towers
and wall-owned members as **NAMED census exemptions, never silent passes**. ⛔ **The run-type
exemption is NOT built and §200 will red on correct §239.2 output without it.**
**S13 STATUS: PARTIAL.** `wallCircuit.js`, `walls.js`, `reservedGround.js`, `districtPartition.js`.
The circuit is a canonical node with 17 declared inputs, a content-hashed output and re-verifying
accessors; `wallClaims` was **DELETED** because the duplicate rule *was* the defect. ⛔ **MISSING:
run typing, per-run tower/ditch/wall-foot policy, the wall-side street, the gate typing.**

⚠⚠ **THE TWO-WAVE VACUITY THIS STAGE PRODUCED IS THE PROGRAM'S SHARPEST LESSON AND A BUILDER
MUST NOT REPEAT IT.** MF-B7 reported the owner's wall/building overlap catch cured **408 → 0**.
It was **vacuous**: law and census shared a **BLIND PREDICATE** — both asked the body's
**VERTICES** against the claim's **CENTRELINE**, so a claim running *through* a body scores
clear at every corner. Area-true re-measurement against the old trees found street/water/wall
violations of **B7 671/16/84** and **B8 1,299/13/190**. ⭐⭐⭐ **THE CLASS, CORRECTED: A SHARED
OBJECT IS NOT A PROOF — THE PREDICATE IS THE VACUITY SURFACE.** §195.0's cure ("the drawn set")
was *necessary and insufficient*. The standing contract is **ONE ARTIFACT, ONE ACCESSOR, ONE
PROVEN PREDICATE**, with census independence bought by **COUNTERFACTUALS** rather than by a
second implementation, and enforced at the **PUBLICATION POINT** (a verifying accessor,
`configurable: false`) rather than by a read-site scan — because only 8 of 36 `.walls` hits are
the fabric's and it travels under **seven alias names** (§241.5a, J-ARCH-6).

---

### S14 · CIRCUIT DEMOTION — THE FOSSIL LADDER — **NOT BUILT.** Highest leverage per unit cost.

**When epoch E's circuit is superseded by epoch E+1's, the old circuit is NOT DELETED — it is
DEMOTED TO A STREET, and its furniture is transformed by a fixed table.**

| the old thing | becomes |
|---|---|
| **wall** | ⭐ **OLD WALL LANE** — a ring street, drawn slightly wider and in a different pavement tone than ordinary lanes, running the full former circuit (width = the intervallum's width) |
| **gate** | a **street widening and a break in the frontage line** where the ring street meets a radial |
| **tower** | ⭐ a **CIRCULAR BUILDING** embedded in the fabric — drawn as a circle where every other footprint is rectilinear |
| **ditch** | ⭐ **FILLED DITCH GARDENS** — a curving ribbon of long narrow garden plots immediately outside the old wall line, drawn green, following the ring exactly |
| **intervallum** | the ring street's carriageway |
| **wall stub** | a surviving masonry fragment, free-standing inside the fabric, at wall weight with rubble hatch |

**And the structural rule that generates all of it: ⭐⭐ RADIALS ARE OLDER THAN RINGS.** The
radial streets run continuously through all three circuits; the ring streets are each a
fossilised defence. **A settlement's oldest continuous geometry is its roads OUT, and its ring
geometry is the accumulated record of its walls.** Plot boundaries in the ring immediately
outside the old wall are **radial to the old circuit**, because they were laid out against it.

**A FIVE-RUNG FATE LADDER, weighted by local land pressure** (CONTEXT CX-20): high pressure →
quarried or built over; low → standing. `wall_dead` (bricked/blocked/robbed/quarried/stub/
property-line) is named on **15 of 138 settlement plates (10.9%)** [M-index] — **the corpus
treats wall death as NORMAL, not exceptional.**

⭐ **THE OLD WALL STOPS BEING A WALL AND BECOMES AN INPUT TO THE STREET, PLOT AND LAND-USE
STAGES.** That is the implementation shape: `circuitDemotion` runs at each epoch boundary and
emits real geometry into the **current** fabric.

**DERIVATION HOME.** §240's epoch index + land pressure (population growth between epochs) +
`prosperity`. **The event stream already makes the wall a first-class dated EVENT (§240.3); a
superseded circuit is simply a wall event whose settlement later exceeded it.**
**LAWS.** §240.3 (which lists the vintage triad, the density gradient and demotion as its
dividends and **does not list this one**) · §239.4 (which gets close from the other direction).
⛔ ⟦FOLD §297/§298⟧ **AND §240.3's "DIVIDENDS" ARE REVERSED AS DELIVERED WORK (§297.3c): the
vintage triad, the density gradient and the §161g demotion are NOT delivered.** The epoch token
appears in zero content modules; W2's G-42 landed epoch **counts** only. **Triad = W4-class;
demotion = W3's first item. They are slotted work, not consequences.**
**CENSUSES.** Every superseded circuit emits ≥1 street segment, and the ring street's geometry
matches the superseded circuit's trace within the topology quantum. Zero superseded circuits
that emit nothing.
⛔⛔ **STATUS: NOT BUILT, AND IT IS URGENT (§250.5). §240 MAKES MULTI-CIRCUIT SETTLEMENTS
IMMINENT — 4 of 10 walled leaves already carry two concentric circuits — AND NOTHING SAYS WHAT
HAPPENS TO THE SUPERSEDED ONE. WITHOUT THIS, EVERY NEW RING ERASES THE HISTORY THE EPOCH MODEL
WAS ADOPTED TO EXPRESS.** Two studies found it independently (PLAN §6.3, CONTEXT CX-20) and
§251.3 records it as **§240's biggest unclaimed dividend**. **It costs one pass and it is the
difference between a town with rings and a town with a biography.**

⭐ **AND IT IS HOW A TOWN LOOKS OLD AT A GLANCE WITHOUT DRAWING A SINGLE RUIN.**

---

## §1.2 · THE WORLD→PLAN PARAMETER CHECKLIST — our stage inputs cross-checked against FMG's delegation contract

**Why this belongs in a build sheet.** FMG generates **no** town plan at all — confirmed by
exhaustion over all 248 src files and 28 renderers (§253.1); a burg is an icon, an anchor, a
label and 30 scalar fields, and plans are **delegated by URL** to Watabou's closed generators.
But that means FMG must *derive and ask for* everything a plan generator needs to know about a
world — so **its parameter set is a play-tested specification of the world→plan interface, and
it doubles as a window into what the market-leading closed generator ACCEPTS as input**
(PRIOR-ART §2.2). Learning from a specification raises **no IP question at all**; nothing here
is copied, and §248.2(b) binds — **implementations stay clean-room**.

⭐ **AND THE STRATEGIC READING (§253.1): the only OPEN implementation has a world and no plans;
the leading PLAN generator has plans and no world. NOBODY SHIPS THE JOIN — which is exactly what
this pipeline is.** The checklist below is therefore an audit of *our* join, using their query
string as the control.

### §1.2a · THE CITY CONTRACT, PARAMETER BY PARAMETER

| their parameter | derived how (PRIOR-ART §2.2, in that lane's words) | do we derive the equivalent? | disposition |
|---|---|---|---|
| `seed` | world seed + burg index, zero-padded | **YES, and better.** S0's `fabricForkKey`/`keyedRandom` over stable lineage ids, plus per-epoch streams (`wall.epoch.k`) and per-stage forks | **ahead** — theirs is a string concat with no inertia guarantee |
| `size` | ⭐ **a power law on population**: `2.13 × (population / urbanDensity) ^ 0.385`, clamped 6..100 | **PARTIALLY.** S5's `extent(t) = FOOTPRINT_R × √(TIER_PROFILE[t].footprint[0]) ÷ built radius` — a **tier-banded** relationship, not a fitted population curve | ⚠ **GAP G-5** — see §1.2c |
| `population` | burg population × global rate × urbanization share | **YES.** `population` is a first-class dossier fact, current **and** high-water (§161f) | **ahead** — they have one scalar, we have a trajectory |
| `river` | whether the cell carries a river | **YES** (§5.0b water mode) — and we carry class (§205.2) too | **ahead** |
| `coast` | whether the burg is a port | **YES** (`tradeRouteAccess`, `WATER_TERRAIN`) | parity |
| ⭐ `sea` | **THE BEARING TO OPEN WATER**, an angle normalized to 0..2 (0 = east, 0.5 = north, 1 = west, 1.5 = south), computed from the vector to the haven cell | ⛔ **NO.** We derive the water **MODE** and never a **DIRECTION** | ⛔ **GAP G-4** — see §1.2b |
| `farms` | whether the biome is arable, **widened when a river is present** | **INPUT JOIN EXISTS; HISTORICAL RESOLVER DOES NOT.** MF-B2 proves substrate/food facts can reach a deterministic rural layer, but §287 demotes its universal open-field regime and measured-looking arable shares to sandbox hypotheses | **`RSLP-1`-gated**, not “ahead” |
| `citadel`, `walls`, `plaza`, `temple`, `shantytown` | burg feature flags from population thresholds | **YES, and this is where our model is strongest.** We derive *whether* from `institutions`, `defenseGenerator` and history, not from a population break-point. ⭐ PRIOR-ART §7 row 12 keeps their thresholds as a **free plausibility band**, never as a source | **ahead** |
| `urban_castle` | citadel **and** an every-other-id parity test | **N/A** — a deterministic thinning of a flag we derive causally | deliberate difference |
| `hub` | whether the cell is a route crossroad (>3 connections, or >2 road connections) | ⛔ **NOT AT PLAN SCALE.** This is exactly S1's region: which roads arrive, at what rank | ⛔ folded into **G-1 (the region)** |
| `greens` | mirrors `plaza` | **YES** — but as derived interior greens from the umbrella's unmet gaps (§161d), not as a mirror of a flag | **ahead** |

**THE VILLAGE CONTRACT** is a **tag list** rather than a number list — a priority cascade
(`estuary` → `island,district` → `coast` → `confluence` → `river` → `pond`; then exactly one
connectivity tag from `highway` / `dead end` / `isolated`; then land use; then `no orchards` by
temperature; then `no square`, `palisade`, `sparse`/`dense`). ⭐ **PRIOR-ART calls this "a
different and in some ways better interface", and the transferable part for us is the
CONNECTIVITY TAG: `highway` / `dead end` / `isolated` is a compact statement of the settlement's
position in its road network** — which is S1's region again, and which is the input PLAN §1.4
needs for load-derived street width. **Their `style` of `sand` / `snow` / `default` from biome
and temperature is the thin version of what CONTEXT CX-34/CX-36 argue for structurally (G-6).**

⭐⭐ **AND THE CONTRACT'S OWN CEILING IS THE SHARPEST THING IN IT, RECORDED BECAUSE IT IS OUR
DIFFERENTIATOR STATED PRECISELY (PRIOR-ART §2.2):** *"Every parameter is a scalar or a boolean
about the settlement as a whole. There is no way to say 'the tannery quarter is downwind and
downstream', 'this wall ring is older than that one', or 'these three blocks burned in 1247'.
The interface itself is the proof that the world model and the plan model never truly meet — the
join is a query string."* **Every one of those three sentences names a stage in this
specification: S16's institution relations, S5's epoch ladder, and PLAN §9's `eventFootprint`.**

### §1.2b · ⭐ THE BEARING TO WATER — a real gap, with a derivation home and a hard constraint

**The finding.** FMG passes the *direction* of the sea, not merely its presence, because a
coastal town's whole plan orients to the water. **We pass neither at plan scale: §5.0b gives a
MODE (THROUGH / BANKSIDE / NEAR / NONE) and the fabric has no water bearing.**

**Where it lands.** `waterBearing` is an output of **S2, the terrain substrate** — derived from
the substrate's own geometry as the vector from the settlement anchor to the nearest open water
/ haven cell, exactly as FMG derives it from its haven cell. It then feeds:

- **S3** — the site anchor and the second-nucleus test;
- **S6** — district anchoring (§161d), because the waterfront organisms bind to that bearing;
- **S13** — the **water-termination run** and the wall-meets-water case (§205.3: circuits anchor
  ON rivers, the wall ending in water-gate towers);
- **S15** — CX-21's edge kind per bearing;
- **S4/CX-06** — the second-bank rule, which needs a *side* before it can prefer one.

⛔⛔ **THE HARD CONSTRAINT, AND IT IS WHY THIS IS NOT THE SAME ITEM AS THE MICROCLIMATE
BEARINGS.** A water bearing derived **from the terrain substrate** is a *reading* of geometry
that already exists and is deterministic from the seed — it mints nothing. **A wind or sun
bearing minted at generation would be a NEW WORLD FACT, and under THE PROMISE a world fact is
seed-permanent** — which is exactly why §251.5 refused it and CONTEXT §12.1 filed it as
owner-gated inspiration. ⭐ **The two must never be conflated: water bearing is DERIVABLE from
terrain and belongs in the pipeline; wind and sun bearings are NOT and stay in Appendix A.**
This spec adopts the distinction and nothing more.
**VERDICT: GAP G-4, MISSING, cheap, and blocked only on S2's substrate existing.** ⚠ It is a
*sub-item* of the substrate rather than a separate build: once the substrate has geometry, the
bearing is one vector.

### §1.2c · ⭐ THE POPULATION→EXTENT EXPONENT — external evidence where we recorded that we had none

**The state of our own fit.** ATLAS T-01 published `cells_across ≈ 5.7 × population^0.27`
(R² 0.80) as the interpolation rule between the grain rungs. ⛔ **It was WITHDRAWN at §244.5**
because it was fitted in log-log over 11 plan-view plates **including hf10**, whose window is
refuted — so the fit inherits the fault *at exactly the end of the range where a single point's
leverage is greatest*. **§249.4(c) then ruled the population fit UNRESTORABLE from the corpus**,
for a reason that no amount of re-fitting cures: `cells_across` is **[M]** but **every population
in the corpus but one is [E]** — an eye estimate. *A trustworthy derivation needs settlements
whose population is a FACT, i.e. our own generator's output, not reference art* (ATLAS T-01).

**The external datum.** FMG's `size` parameter is `2.13 × (population / urbanDensity)^0.385`,
clamped to 6..100 — an independent, heavily play-tested estimate of the population→built-extent
relationship, produced by a different team against a different world model and **shipped**.

**What it does and does not tell us.**

- ⚠ **THE TWO EXPONENTS ARE NOT COMPARABLE AS NUMBERS, AND SAYING SO IS THE HONEST REPORT.**
  Ours (0.27, withdrawn) was fitted on **cells across a settlement** — a *grain* quantity.
  Theirs (0.385) is on **plan extent** — a *size* quantity, and its base is
  `population / urbanDensity` rather than population. **A grain exponent and an extent exponent
  measure different things and cannot be checked against each other directly.** Anyone who
  compares 0.27 to 0.385 as if they were the same quantity is making the ATLAS's own
  hybrid-evidence mistake in a new place.
- ⭐ **WHERE IT IS GENUINELY USEFUL: it is a cross-check on §161f's EXTENT curve — S5's
  `TIER_PROFILE` footprint bands — not on T-01's grain.** Our extent ladder is measured at
  **309 → 391 → 442** view units across town → city → metropolis (**×1.27 then ×1.13**;
  `laneMFB8-receipt.md` §1). Against a ×3.5 population step from the city exemplar to the
  metropolis exemplar, a 0.385 exponent predicts roughly **×1.6**; we deliver **×1.13**.
  **PLAUSIBLE (this is arithmetic on two quoted figures, not an executed fit): our extent ladder
  grows MORE SLOWLY with population than an independent implementation's, and that is the same
  direction as B8's own measured frontage-ladder residual** — *"our extent ladder grows FASTER
  relative to the grain ladder at town→city than at city→metropolis"*, which B8 named as a **§5
  tier-table question for the chair** and did not take.
- ⛔ **DOES IT SUPPORT RESTORING A DERIVATION HOME FOR EXTENT? YES — BUT NOT BY ADOPTING THEIR
  CONSTANT.** It supports the *shape* (extent is a continuous power law in population, which is
  §161f's continuous-scale law in arithmetic form) and it supplies a **plausibility band** for
  the exponent. It cannot supply the constant, because their base quantity, their density
  assumption and their clamp are theirs. **AND THE RESTORATION PATH ATLAS ALREADY NAMED IS THE
  RIGHT ONE AND IS NOW CHEAPER THAN IT LOOKS: fit against settlements whose population is a
  FACT — our own generator's output — which we have 16 of at every tier, with byte-determinism
  and a published extent.** ⭐ *The instrument that could not be built from reference art can be
  built from our own leaves.*
- ⛔ **NOT ADOPTED HERE.** This is a cross-check reported beside our withdrawn fit, exactly as
  the chair instructed, and it is filed as **gap G-5** with a named experiment. **No exponent is
  installed, and §5's tier table is not touched by this document.**

---

## §1.3 · THE POST-EPOCH STAGES (S15 – S23)

### S15 · THE EDGE AND THE EXTRAMURAL ORDERING — **PARTIAL** (CX-21, CX-22, CX-23)

⛔ **§287 / HEEP-1 SUPERSESSION.** Atlas cases prove that route-led suburbs, multiple gate projects,
low-density intramural ground and extra-mural institutions are possible; they do not license a
faubourg default, ≤2-gate rule, distance ladder, noxious arc, poverty side or frequency. S15
materialises explicit dated projects and classifies their visible edge. Synthetic plate counts remain
projection observations only.

**INPUTS.** Canonical circuit projects/intersections (S13), spatially resolved approach routes and
loads when available (S1), substrate/legal boundaries (S2), land rights, institutions with explicit
spatial disposition and dated extramural construction/occupation/abandonment operations. Population
and current prosperity do not mint an edge or suburb.

**THREE EDGE KINDS, and what selects between them** (CONTEXT §4.1):

| edge | drawn as | selected by |
|---|---|---|
| **HARD** | fabric stops at a line — wall, water, cliff, marsh, intake wall | a physical or legal boundary exists |
| **FEATHERED** | plots thin, gaps widen, gardens then closes then fields; **no line anywhere** | no boundary; ordinary growth |
| **RIBBON** | fabric continues **along the ROAD only**, thinning with distance and **stopping at different distances on different roads** | growth with a strong movement axis |

⭐ **THE DETAIL THAT MATTERS: hf389 shows extramural ribbons at FIVE gates, each stopping at a
DIFFERENT distance. Equal-length ribbons would read as generated.** The stopping distance is a
per-road fact and it tracks that road's traffic.
⭐ **AND THE HARD EDGE IS NOT THE DEFAULT EVEN WHERE A WALL EXISTS** — hf385's new circuit
encloses brickfield, orchard, closes, tenter grounds and two ruled empty plots, so **the real
edge is feathered and sits well inside the circuit** (this is S12's `intramuralVacancy` seen
from outside, and CX-44's *provision ahead of occupation*).

**THE FAUBOURG RELATION.** A recorded gate/route suburb is its own lineage-bearing district/project,
not an extension painted outside the wall. Wall-foot clearance, lean-tos, later enclosure and
abandonment are independent dated facts. None is inferred from laxity, poverty, peace, pressure or
elapsed time, and no universal sequence runs forward or backward.

**CANDIDATE EXTRAMURAL RELATIONS (CX-23).** `INTRAMURAL`, `EDGE`, `EXTRAMURAL_NEAR` and
`OUTLYING` are useful descriptive classes. Hospital/gate, isolation, gallows/route and noxious-use
examples are possibility witnesses. A promoted mechanism must name its own legal, functional,
access, hazard and chronological prerequisites; a class table or institution list cannot choose a
distance or arc.

**SYNTHETIC VISUAL OBSERVATION [E, ATLAS T-21]:** about 20 of 29 described walled plates depict
some growth outside. This convenience/creative set is ineligible for prevalence or activation and
supplies no ≥60%, ≤2-gate or “poor side” historical target.

**LAWS.** §190d · §161c · §232 (extramural faubourgs form their OWN districts) · §18.2 the inn
belt · §5.0e.
**CENSUSES.** Every extramural body traces to a dated project, parcel/right and route/gate relation;
zero seeded ribbons. Projection may report route extents and concentration descriptively but never
repair canon to meet a band. Applicable promoted noxious/hazard predicates are checked exactly.
**STATUS: PARTIAL.** Faubourgs landed at MF-B5 and ATLAS T-21 grades b6 ★ **MEETS** on
extramural presence. ⛔ **MISSING: the unequal ribbon length, the gate ranking that allocates
growth (CX-22 — which canonical route/gate project exists, requiring S1 truth), typed relation
definitions, project/parcel lineage and disposition receipts. Distance/frequency/arc defaults are
withdrawn rather than owed.**

---

### S16 · INSTITUTION SITING AS A RELATIONAL SYSTEM — **PARTIAL. Scale exists; RELATIONS do not.**

⛔ **§287 / HEEP-1 / RSLP-1 SUPERSESSION.** The class table and diagrammatic examples below are a
candidate relation vocabulary assembled during discovery; they are not default European incidence,
distance or adjacency law. Runtime may consume only explicit canonical function, jurisdiction,
property, labour, access, hydrology and prohibition facts through a supported evidence-domain
binding. Narrative `culture`, names, rings and present prosperity never choose a site. Rural
relations additionally require explicit rural canon or `RSLP-1` support.

⭐⭐ **THE GAP IN ONE SENTENCE (CONTEXT §5, adopted at §251.3): §161n gives institutions a SCALE
LADDER (how BIG) and NOTHING GIVES THEM A SITING RULE (WHERE).** *"Our dossier already knows
which institutions exist and what they are for; what it never asks is what must this be near,
and what must it never be near."*

**INPUTS.** Canonical institutions plus explicit government/jurisdiction, property/right, labour,
access, route, void/circuit and directed-hydrology relations. Missing relations remain missing and
produce an `UNSITED`/`STRUCTURAL_ONLY` disposition rather than a plausible seeded site.

**MECHANISM.** A promoted institution relation definition may declare a gate, water, wall,
right-of-way, required-adjacency or prohibited-adjacency predicate. Placement is a constrained
assignment over canonically eligible sites, not a scatter; no predicate exists merely because a
class name appears in the discovery table.

⭐ **THE NEGATIVE RULES ARE THE CHEAP HALF AND THEY CARRY MOST OF THE REALISM.** Four predicates
prevent most of the errors a naive placer makes: **never upwind · never above the clean take ·
never on a through route · never adjacent to a dwelling.** A representative slice of the siting
table (CONTEXT §5.1 — the full table is 24 classes):

| class | centre | gate | water | wall | ⛔ never next to |
|---|---|---|---|---|---|
| great church / cathedral | at or one block off; **own precinct, AIRIER than the fabric** | — | — | often **notches the wall** to be included | the noxious arc; flood ground |
| parish church | at a secondary void or on a knoll; ⭐ **at a visibly different ANGLE to the streets around it** | — | above flood line | — | downwind of tanning or smoke |
| monastery / abbey | **outside or at the edge**, own precinct wall, own water | own gate | **takes its own leat and stew ponds**, terraforms drainage | often abutting or outside | the tight core |
| friaries | **inside but distributed and marginal**, pressed to the wall | — | — | against the wall | **each other** |
| castle / citadel | the strongest corner, **never floating** | commands one | on the bluff or water if there is one | own ditch | the market |
| market (primary) | ⭐ **IS the centre** | on the gate-to-gate spine | — | — | the shambles' drain |
| mill (water) | ⭐ **the FLOW, not the plan, sites it** | — | on the leat, across the tail | frequently OUTSIDE, **and the wall detours to include it** | above the settlement's clean take |
| mill (wind) | **on open exposed ground OUTSIDE**, on a mound | near, on the field side | — | outside | inside the fabric |
| granary | **adjacent to its intake**, at the landing, on raised platforms | — | at the landing | — | the far side from the road that feeds it |
| inns (great courtyard) | on the spine | ⭐ **band 1 OUTSIDE the busiest gate, on enormous plots** | — | — | — |
| hospital / almshouse | — | ⭐ **just INSIDE a gate** (traffic = alms) | — | — | — |
| leper house / lazaret | — | ⭐ **far OUTSIDE along its own road**, own ditch, chapel, well, alms box | isolated island if water exists | far outside | **any dwelling** |
| gallows | — | ⭐ **the last mark on the busiest road out**, on a knoll | — | far outside | — |
| tannery / dye / lime kiln | — | outside, downwind | **below the clean take, discharge fan drawn** | outside | ⭐ **upwind or upstream — and NEVER in more than ONE arc** |
| shambles | at the market, **with a blood channel to a drain** | — | drains below the water stairs | — | above a water stair |
| rope walk / tenter ground | — | — | often waterside | ⭐ **outside or against the wall — they need LENGTH and cheap flat ground** | the core |
| treasury / mint / records | ⭐ **inner walled precinct with ONE gate, and the surrounding streets BEND so none runs at its doors** | own guarded approach | — | — | a through route |

⭐ **INSTITUTIONS THAT GENERATE THEIR OWN MICRO-DISTRICT (CONTEXT §5.2).** Six classes reliably
grow a service quarter whose **trades are specific to the institution**: cathedral (close wall
with ceremonial *and* service gates, prebendal houses each unlike and each in its own garden,
almonry, works yard) · pilgrimage shrine (hospices, badge-sellers' encroachment wedge, a
**processional circuit worn wider** with station crosses) · university (schools street,
bookbinders' row, physic garden — **and the grain changes at every college wall**) · castle
(soldiers' lodgings, victualling yards, horse market, **and a mason's yard, because the castle is
always being repaired**) · treasury (scriveners and parchmenters **with soaking pits and
stretching frames at the river**) · port/customs (interpreters' street drawn as **the busiest
lane on the plate**, public crane and weighbeam the foreign enclaves must use).
⚠ **A CUSTODIAN DWELLING IS CONDITIONAL, NOT AUTOMATIC.** It materialises only when canon records a
resident labour/office relation, an occupied dwelling or a promoted mechanism whose employment,
seasonality and property prerequisites pass. A spring, lock, woodland or infrastructure class by
itself creates no keeper, household, garden or toll board; rural cases also require supported rural
state.

**⭐ THE DOUBLING RULE (CONTEXT §5.3 / PLAN §10.5) — a small mechanism with a very large
legibility return, and it needs NO NEW GEOMETRY.** When a settlement holds **two jurisdictions
or two faiths, its JURISDICTIONAL institutions double and the non-jurisdictional ones stay
single** — two markets, two crosses, two tolbooths, two sets of scales, **two gallows each
outside its own gate** — and *the two halves have visibly different plot rhythms, so the
jurisdiction is legible in the grain itself.* The shared wall is **unequally maintained**, with
one ruinous tower where the responsibility lapsed. ⭐ **The selectivity is the realistic part**:
what is needed is a `jurisdictional` flag on the institution class, plus a siting rule that puts
each instance in its own authority's territory. **§161e's multiplicity law already permits
multiple instances "where facts support" and §161l already requires the real-vs-formal power
split to be READABLE IN THE DRAWING; the flag is the missing piece.**
⚠ **The anti-duplicate rule applies to PROPER NAMES only and must never be applied to
institutions that genuinely double** (§HF-4c #26).

**THE PRECINCT IS A DENSITY STEP, NOT A LINE (CX-28 — HAVE, unbuilt).** Religious and civic
precincts are drawn **AIRIER than the fabric around them**, and the boundary between the two
densities is **a wall with named gates, never a line**. ATLAS T-05 already quantifies the step
(+15–20 points of open share for religious precincts, +25–30 for military compounds). ⭐ **The
one missing clause: the precinct's own boundary must be a wall with TYPED gates (ceremonial,
service) — because that is what stops the airier zone reading as a HOLE in the fabric.**

#### ⟦FOLD §264⟧ §1.3.16a · ⭐⭐⭐ THE MISSING THIRD QUESTION — **WHAT EXISTS AT ALL**, ANSWERED BY A RESOURCE DEPENDENCY GRAPH (§263.3)

⭐⭐ **§263.3 RULED THIS THE BEST MECHANISM IN EITHER PRIOR-ART STUDY AND RANKED IT #1 OF ALL
PRIOR-ART ADOPTIONS.** It belongs here because S16's gap was stated as two questions — §161n gives
institutions a **SCALE** (how big) and nothing gives them a **SITING RULE** (where) — and **there is
a third question upstream of both that nobody had named: WHICH INSTITUTIONS AND WORKPLACES EXIST AT
ALL, AND HOW MANY.** Today that answer comes from a per-tier landmark budget, which is a band, not a
derivation.

**THE MECHANISM.** A graph whose **NODES ARE RESOURCES AND SERVICES** and whose **EDGES ARE
FREQUENCY RATIOS WITH STATED DENOMINATORS** — *one per N head of population*, or *one per N
providers of another node*. Generation starts from an empty settlement, repeatedly asks the graph
what is needed next, creates that building and the residents who staff it, and continues until the
population is accounted for. Three properties make it good rather than merely tidy:

1. ⭐ **IT CASCADES CAUSALLY.** A brewery does not appear until enough hops production exists to
   support one. **The roster is not a weighted random draw; it is the FIXED POINT OF A SUPPLY
   CHAIN** — and it can therefore answer *why* a town has three bakers.
2. ⭐⭐ **EVERY NODE HAS A PRODUCER POOL AND AN IMPORTER POOL. WHERE THE LAND CANNOT SUPPORT THE
   PRODUCER, A SHOP THAT IMPORTS AND SELLS THE RESOURCE SUBSTITUTES FOR IT.** *A settlement that
   cannot make a thing acquires a TRADE in it instead.* **That one rule is how a landlocked town and
   a fishing port end up with different rosters from one graph** — and it is the direct spatial
   consumer of `resources` × `terrainType` × the S2 `buildable` mask.
3. ⭐ **IT IS THE ANTI-DECORATION MECHANISM PAR EXCELLENCE.** Under §246 a parameter with no
   derivation home is decoration. **In a dependency graph every number is a ratio with a stated
   denominator. THERE IS NO FREE SCALAR ANYWHERE IN IT** — a *structural* property, not a discipline
   someone has to maintain.

**(a) CAUSE — corrected by the live-source audit.** The dossier reliably carries population,
resources and institutions, but canonical generated `supplyChains`/economic flows and neighbour
bearings are not guaranteed. Every graph edge must therefore read a real accessor or a separately
promoted mechanism; missing edges stay missing/typed rather than reconstructed from prose.
**(b) LOOK.** The synthetic landmark and ordinary:notable bands may grade representation, but they
never add, remove or resize roster members. Named bodies are excluded from the anonymous
representation ratio.
**(c) DIRECTION.** §2.5 records a synthetic visual miss (≈2:1 versus 5–6:1). A dependency graph does
not guarantee fewer/larger landmarks and may not be tuned to manufacture that result. The visual
instrument reports the outcome beside named-body completeness and causal coverage.

⛔ **WHAT MUST NOT COME ACROSS: THEIR GRAPH'S CONTENTS.** The particular nodes, the particular ratios
and the particular building pools are **one designer's model of a fantasy economy** — decoration for
us under §256 however plausible they look, with no derivation home in *our* dossier, and the kind of
authored selection §0 of both studies most firmly declines. ⭐ **We take only the typed dependency-
graph shape.** Nodes and denominators come from reviewed SettlementForge facts or evidence packs;
“producer unavailable ⇒ importer” requires explicit demand/trade and is not a structural axiom.

⭐ **HOW IT COMPOSES:** a canonical roster answers **what exists**, promoted functional/capacity
massing answers **how large**, and explicit siting predicates answer **where**. A registered farm
dependency may require a rural production relation, but the graph neither creates a farm nor fills
its hinterland; §10.23 owns that artifact.
⚠⚠ **AND ONE ORDERING CONSEQUENCE NOBODY HAD NAMED, RECORDED HERE RATHER THAN DISCOVERED IN W6:
THE LANDMARK BUDGET (G-25) IS SCHEDULED IN W5 AND THIS ROSTER REPLACES ITS SOURCE IN W6.** They are
not in conflict only after §287's correction: **W5's per-tier band is projection QA; W6's canonical
roster is truth.** A band miss is reported and never repairs the roster. Entered as gap **G-35**.

**SURVIVING LAWS.** Named institutions are real, function-specific compositions rather than scaled
sprites; specific power/jurisdiction and canonical containment remain explicit. A declared port
needs navigable-water access, a declared watermill needs a race, and a declared quarry needs its
resource site. Generic “mill,” four siting rings, rung frequencies, affinity weights and a
lawfulness→scatter dial are not physical absolutes and remain uncalibrated/promoted-mechanism work.
**CENSUSES.** §203 containment (BUILT, asked of the partition grid). ⛔ **MISSING: zero violated
prohibited adjacencies; every institution's siting cites a profile clause; the doubling set
instantiated exactly where two authorities exist.**
**STATUS: PARTIAL.** §161n's representation scale ladder and §203's containment are BUILT; a truth-anchor
exemption exists and is honest (§212.1 — MF-B7's last six landlocked bodies were **all one
parish church's arrangement**, ruled *correct: truth outranks the census*, entered as a **named
truth-anchor exemption**). ⛔ **MISSING: typed canonical relation accessors, supported relation
definitions, constrained assignment and disposition receipts.** Micro-districts, custodian dwellings
and jurisdictional duplication are not owed defaults; each requires explicit facts/promotion. CONTEXT ranks this **#5 by
breadth** (6 of 8 traces) and **the largest uncovered area in its half after the substrate.**

---

### S17 · WATER WORKS AND DOMESTIC WATER — **NOT BUILT** (CX-08, CX-09, CX-10, CX-11)

⛔ **§287 EVIDENCE/ACCESSOR SUPERSESSION.** The chains and domestic-water ladder below are a
candidate vocabulary and set of possibility witnesses, not an automatic inventory. A work/edge
materialises only from canonical hydrology, function and flow relations or a separately promoted
mechanism. Missing drive, take, discharge or domestic-supply facts remain `UNKNOWN`/refused; river
presence and a class name never fill the chain.

⭐⭐ **THE TRANSFERABLE RULE IS THE ORDERING, NOT THE INVENTORY (CONTEXT §2.4). Our current risk
is exactly the opposite failure: placing a mill glyph NEAR water. The corpus never does that.
Every water work is positioned relative to the FLOW and to its NEIGHBOURS IN THE CHAIN, and the
chain's members are visible consequences of one another.**

**MECHANISM — chains as ORDERED sequences along the flow vector (S4's directed centreline):**

- **the mill chain**: weir → sluice → leat → pond → wheel → tail race → **rejoin below the weir**;
- **the waterfront ladder**: each stretch's type selected by depth, bank material and the trade
  it serves;
- **the pollution chain**: ⭐ **clean take ABOVE → process → discharge fan BELOW.**

**Chain members are placed BY THE CHAIN, never independently.** ⭐ **The failed-predecessor arm
— a silted pond and a dry ghost leat — costs one flag on a chain member and delivers §161g's
decay in the water system for free.**

**DERIVATION HOME.** Explicit canonical hydrology and economic-flow edges, plus registered
water-dependent institution functions and resources through §10.19. No generated `supplyChains`
field is guaranteed; absent edges produce no invented work or importer.
**[M-index] incidence over 138 settlement plates:** `quay_wharf` **21.7%** · `mill_water`
**14.5%** · `basin_dock` **8.0%** · `boom_chain` **5.8%** · `weir_sluice` **4.3%** · `leat_race`
**2.9%** (badly deflated — the leat is drawn far more often than it is written down).

**⚠ CANDIDATE DOMESTIC-WATER VOCABULARY, NOT A UNIVERSAL LADDER.** The discovery corpus depicts:
the stream itself with a
**washing step** → **the well**, a circle with **worn, beaten stipple around it**
(13.0% of the synthetic written-description index, not prevalence) → **the dew pond**, clay-puddled with a trodden margin (no spring
at all) → **the cistern** (rock and dry sites) → **the conduit system** (city+, *and it is a
POLITICAL object*).

**hf368 is the discovery, and it is drawn, not labelled:** a walled **spring house and settling
tank OUTSIDE the wall in the fields** on the high ground with a **keeper's cottage** beside it ·
a buried conduit running in as a bold line with **inspection-stone covers set into the street it
follows** and **its own arch under the wall**, distinct from any gate · the **GREAT CONDUIT HEAD
in the market place** with a worn paved apron · **lesser heads at street corners, each smaller
and plainer**, ending in the **poorest quarter's head, a plain pipe over a basin at the far
edge** · **private takes** to castle, abbey and two named inns, one drawn **DOTTED as an illegal
tap** · public wells scattered **by distance rather than by plan** · and a fringe with neither,
taking water from the river at three public stairs — **with the tanneries, dye yards and shambles
drawn on that same river ABOVE those stairs.**
⭐⭐ **THAT LAST CLAUSE IS THE WHOLE ARGUMENT IN ONE ADJACENCY.**

**MECHANISM.** Wells are placed by an **UNCOVERED-DISTANCE RULE** — a walk-distance field over
the fabric, wells inserted greedily where the distance is worst — **not by plan** — and each
carries a worn approach. A conduit exists **only at city+ with sufficient prosperity**, and when
it exists it emits the whole sequence above, down a **prominence ladder**.
**DERIVATION HOME.** `tier` × `prosperity` × `terrainType` (cistern vs well) × `institutions`
(which get private takes) × `population` (head count).
**LAWS.** ⛔ **NO LAW IN §150–§253 COVERS DOMESTIC WATER AT ALL.** §205 is entirely about the
channel; §161b covers terraforming; §161m covers the docks. **Nothing orders anything along a
flow.**
**STATUS: NOT BUILT.** ⭐ **Given the owner's legibility law (glance → sentence → table) this is
unusually high narrative return per unit of geometry: a well with a worn approach is THREE
PRIMITIVES and it says "people walk here every day".**
⚠ **AND IT SUBSUMES ATLAS GAP-F.** CONTEXT §11.2 rank 13 is blunt: *"GAP-F's plume alone is
decoration. Plume + upstream take is an ARGUMENT."* Build the dirt vector whole — clean take
above, discharge fan below, muck gate — or not at all.

---

### S18 · THE COUNTRYSIDE — **PARTIAL, and it is the weakest surface in the whole program**

⛔ **§287 / `RSLP-1` WAVE-1 SUPERSESSION (2026-08-20).** The visual need for a legible
countryside and the low-level topology/access/determinism techniques in this section survive. The
claimed **universal open-field law**, binary nucleated/dispersed selector, tenure coefficients,
distance/rate/cap values, two-/three-field counts, field-economy shares, centre-facing strip rule,
tier/common table and universal keeper/field-barn rules do not. They are retained below as archival
sandbox hypotheses and may not execute as historical truth until the preregistered European
`RSLP-1` cohorts and sealed holdout in §§10.21 and 10.23 pass. Visual ground primitives and draw budgets
must be labelled presentation decisions; they cannot supply rural world facts.

⚠⚠ **AT VILLAGE AND THORP THE COUNTRYSIDE IS 85%+ OF THE PLATE**, and ATLAS T-24's verdict on b6
is blunt: field polygons are large flat washes with sparse scattered ticks; furrow, pasture,
orchard and waste are not distinguished; **field parcels are ~10–30× the corpus's size relative
to the settlement.** ⭐ **§229.2(c) ratified this as WAVE NINE FIRST-ORDER and named it the lever
for the census tiers' remaining grain miss** — hf3 gets 31 cells across from ~80 roofs where our
800-soul control gets 21.7 from 160, *because hf3's grain is carried by garden strips, tenure
lines and hedged fields — T-24's own subject.* **The two open items are ONE item.**
⚠ **§252.3(c): the chair's own 3000px zoom confirms it — "THE COUNTRYSIDE REMAINS THE WEAKEST
SURFACE, exactly as §229.2c predicted."**

**T-24 · SIX GROUND PRIMITIVES, PER-LAND-USE AND NOT UNIVERSAL [E]:** **furrow** (parallel
strokes **at the parcel's own bearing**) · **pasture** (flat + tuft ticks) · **orchard**
(jittered tree-round grid) · **waste** (stipple + scrub) · **reed** (tick clusters) ·
**terrace** (contour lines + tick pairs). ⭐ **Hedgerow boundaries carry individual tree rounds
at IRREGULAR spacing** — the corpus's own counter-example to banned prior #7.

**T-23 · THE ROAD LADDER — FIVE RUNGS, FIVE DISTINCT PRIMITIVES, NOT ONE PRIMITIVE SCALED [E]:**
paved + shouldered + milestoned → double-edged unpaved → thinning single line with encroachment
→ dotted → **field-boundary trace**. Plus the cart-track (double line, dashed centre) and the
pack track (dashed with animal glyphs). **§11.3's road-death ladder: HIDDEN, never absence.**
b6 draws **1 of the 5 rungs** (ATLAS Table A).

**§16 · ARCHIVAL OPEN-FIELD PROPOSAL (ruled at §184.2; superseded at §287).**
BANNED = terrain-blind geometric symmetry. The older proposal treated the following as law for one
historical open-field regime; `RSLP-1` Wave 1 rejects it as the general countryside default:
contiguous tiling of the working land · strips **ORIENTED toward the settlement but DEFORMED by
substrate** (contours, streams, roads) · field lanes branching from village roads · **the centre
anchoring the composition** · §161n landmark rungs at every tier.

**§190c · ARCHIVAL WORKSITE-HABITATION PROPOSAL (superseded at §287).** **NUCLEATED**
open-field settlements keep farmers **IN the village** (the fields carry **FIELD BARNS** and
distance-driven outlying farmsteads, **never a house per strip**) versus the **DISPERSED**
pattern (enclosed / upland / frontier: **a farmstead ON each holding**). The selector derives
from terrain, safety (§10 states push dwellings inward) and tenure/culture, **and drift can
ENCLOSE over generations** — strips → hedged holdings with new farmsteads, *one of history's
great visible transformations.* **SPECIALIST KEEPERS regardless of pattern**: the mine's count
house, the forest keeper's lodge, the miller's house, the ferryman, the toll keeper.
⛔ **CX-26 records the original gap precisely. Wave 1 now sharpens it: dispersion and nucleation
are not exhaustive endpoints, and no scalar selector is licensed.** Polyfocal, seasonal,
distributed working and mixed settlement graphs require typed phase-specific predicates.

**CX-24 · THE FIELD/FABRIC JUNCTION.** A junction band per bearing (four drawn junction kinds),
plus **the intake line — one iso-elevation boundary with outsized legibility return.**
**CX-25 · ROAD FURNITURE / DAY'S-TRAVEL CANDIDATE.** Neighbour records do not reliably hold route
distance, and a route distance would still not prove a milestone, cross or inn. These materialise
only from canonical route/furniture facts or a promoted `RSLP-1` mechanism; otherwise the candidate
remains absent rather than “fixing” empty countryside.
**CX-37 · PROCESS GROUND — the working surface that EXCEEDS the settlement.** hf332's drying
racks cover more ground than the town does; hf343's tan pits are dozens of sunken rectangles in
ranked rows; hf354's evaporation pans run the length of the shore. ⭐ **The rule: some economies
need more GROUND than they need buildings, and the ground is sited by a PHYSICAL requirement
(wind, sun, slope, water) rather than by convenience.** An activity requiring open working
ground emits a **sized, textured ground polygon with a siting predicate**, placed **before or
alongside** the fabric, not after. **Our generator will systematically under-draw these because
they are neither buildings nor fields.**
**CX-39 · GROUND SURFACE AS A FIRST-CLASS LAYER.** An urban surface ladder with **hard
parcel-edge boundaries** — hf333's dunged stance ground **stops exactly at the hedge line**.
Pure render mechanism, large return.

#### ⟦FOLD §264⟧ ⭐ TWO MECHANISMS THAT LAND ON THE WEAKEST SURFACE IN THE PROGRAM (§263.5)

**S18 is named in this document as "the weakest surface in the whole program", and §263.5 records
that two of the four top FTG adoptions land here.** Both are cheap.

**1 · ⭐ ENCLOSURE-FREE FRINGE LOTS — LOTS THAT NEED NO ROADS** (FTG §7.3 — rank #4 of prior-art
adoptions). The fringe of a grown-road settlement has a structural problem: a building needs a lot,
a lot needs enclosing edges, and **the fringe is where roads run out.** The naive fix is to grow
roads nobody uses purely to manufacture enclosure. ⭐ **The better answer is to RELAX the enclosure
requirement at the fringe and mark the resulting edges INVISIBLE** — a lot with no block around it.
**(a) CAUSE:** *which* buildings sit outside is a dossier fact — noxious trades, a promoted
`RSLP-1` residence/working-complex mechanism where eligible, and the ribbon along the highest-rank
approach. The superseded §190c binary is not a cause.
**(b) LOOK:** gated on **dead-end share 0.110 – 0.209 – 0.391** (§2.4) and on the **extramural
growth** band (§2.5).
**(c) DIRECTION:** ⭐ **a fringe built from enclosure-free lots TERMINATES streets rather than
looping them, which RAISES dead-end share exactly where the corpus puts its highest values** (§1.1.7d
records canal and fringe morphologies at the top of the range). **Our alternative — growing roads to
close every fringe lot — would LOWER dead-end share and push us to the bottom of a band we should be
spanning.** *The mechanism moves the metric the way the corpus says it should move.*
⭐ **THE STRUCTURAL COMPOSITION SURVIVES WITHOUT §190c:** if a canonical farmstead or occupied
worksite exists, it needs a lawful enclosure-free rural lot rather than a fabricated urban block.
Whether such a residence exists is an `RSLP-1` world question, not something this lot mechanic may
decide.

**2 · THE HINTERLAND GENERATED FROM THE SAME LOT SUBSTRATE AS THE TOWN, CLUSTERED BY KIND**
(FTG §8.3 — rank #8, and ⚠ **the study flags its own leg (c) as the WEAKEST of its ranked
adoptions, which is repeated here rather than smoothed**). Main roads extend to the frame, the
remaining land is subdivided into lots, and land-use features are placed **clustering similar
elements together** — cropland beside cropland, pasture beside pasture.
**(a) CAUSE:** our dossier holds the hinterland facts theirs must estimate — what the settlement
farms, grazes, quarries and cuts — and **§1.3.16a's dependency graph makes the link CAUSAL rather
than decorative: a settlement with farms needs farmland, and the graph already knows whether it has
farms.**
**(b) LOOK:** gated on `hull_frac_of_frame` and `green_excess` from the measured register.
**(c) DIRECTION — honestly weak, and stated as such.** Our corpus's surround is painterly and
varied; a clustered land-use polygon fill is a coarser thing. **The narrow argument that can be made
is that generating the surround from the same lot substrate as the town keeps `hull_frac_of_frame`
DERIVABLE rather than arbitrary, where today it is effectively unconstrained.** ⚠ **It is adopted at
the bottom of the ranking precisely because (c) is thin, and it must not be allowed to substitute for
T-24's six ground primitives, which are the real fix here.**

**SURVIVING LAWS.** §2 dressed-ground presentation · §11.3 route visibility · §161c typed
OUTLYING relation. §16/§190c are `RSLP-1` hypotheses, not laws.
**CENSUSES.** ⛔ Not built. Field-parcel area relative to settlement extent, banded; distinct
ground primitives per leaf ≥ 4; distinct road primitives per leaf ≥ 3 where the road web
supports them.
**STATUS: SANDBOX GEOMETRY EXISTS; HISTORICAL RESOLVER UNCALIBRATED.** MF-B2 moved experimental
countryside geometry out of the lens and MF-B3 added substrate imperfection, but their arable share,
regime selection and field/habitation constants are not world truth. ⛔ **T-23 and T-24 are NOT
BUILT (`laneMFB8-receipt.md` §10.1, J-B8-1), and an `RSLP-1`-gated resolver must replace the current
general `buildFields()` default rather than tuning it in place.**

---

### S19 · DECAY, DEMOTION AND STATE — **PARTIAL**

⛔ **§287 EVIDENCE CORRECTION:** PLAN's generated plates suggested a LIFO visual hypothesis, not a
universal historical decline law. Rural and urban Wave 1 show amalgamation, relocation, selective
removal/recovery, disaster, continuing agriculture, institutional persistence and unknown causes.
High-water identity and epoch lineage survive; abandonment executes only through typed dated
operations with eligible evidence. **No default “run growth backwards” or LIFO removal order is
historically licensed.**

**WHAT SURVIVES LONGEST, in order (PLAN §7.2):** **the monument**, at full monumental ink and now
grossly over-scale · **the circuit**, long after the fabric that paid for it · **the street
geometry**, surviving as field boundaries and lanes · **the crossing** — bridge, ford, quay.

**⭐ THE DEMOTION DISCRIMINATOR — six signals, all derivable from the high-water law (PLAN §7.3).
How a shrunken settlement of N souls differs from a stable one of N souls:**

| # | signal | shrunken | never grew |
|---|---|---|---|
| 1 | enclosure : fabric ratio | circuit encloses **3–10×** the occupied area | no circuit, or one that fits |
| 2 | monument : settlement scale | monument sized for the **former** population — 3–5 rungs above tier | monument at its tier's rung |
| 3 | street-web extent | street geometry extends **far beyond** occupied fabric | coextensive with fabric |
| 4 | intramural land use | agricultural/industrial ground **inside** the enclosure | fields begin outside |
| 5 | ⭐ **plot-boundary inheritance** | field parcels inside the walls follow the **OLD STREET BEARINGS**, producing rectilinear fields at an angle to the surrounding countryside's | field bearings follow terrain and lanes only |
| 6 | institutional over-provision | more churches, gates and market space than the population needs; some shuttered or repurposed | provision matches population |

⭐ **SIGNAL 5 IS THE SUBTLEST, THE MOST CONVINCING, AND NEARLY FREE: when a block dies, FEED IT
TO THE FIELD GENERATOR ON ITS OWN BEARING.** The resulting field patch is rectilinear and
misaligned with the countryside, **and the eye reads "this was a town" immediately.**
⭐ **Signal 6 falls out of §161n for free IF institutions are scaled at their FOUNDING rung and
never re-derived downward — which is also the historically correct behaviour: buildings do not
shrink.**

**THE FOUR-STAGE DECAY LADDER [ATLAS T-19] — four DISCRETE stages, never a fade:** (1) full
outline, no fill; (2) broken outline + rubble stipple; (3) foundation line at ~40% weight with
vegetation wash over; (4) **a field-boundary-weight trace only, reused as agricultural
geometry.** ⭐ **Stage 4 costs nothing new — the dead blocks are fed to the field generator on
their own bearing**, which is signal 5 again from the render side.

**THE GHOST REGISTER [ATLAS T-20] — ONE opacity, ONE dash, shared by four different "not quite
there" states**: the abandoned farmstead, the surveyed-not-built streets, the out-of-ward context
fabric, the surface city above the undercity. **Recommend a single `ghostInk(weight 0.38,
dash 6-2, no fill)` used by all of them.**

**SURVEYED/PLANNED-BUT-NOT-REALIZED IS A DRAWN STATE — MISSING, BUT NOT CHEAP HISTORICAL FILL.**
`PLAN_INTENT` and `PLAN_REALIZATION` (§10.20) must state which axes/plots were proposed, laid out,
occupied, altered or abandoned. Ghost ink may render the recorded unrealized remainder. A planned
epoch does **not** automatically lay a full grid or fill it from elapsed years/prosperity; those are
historical outcomes requiring dated evidence/mechanisms. Uneven realization can prevent a
machine-filled look, but appearance never manufactures the cause.

**SURVIVING LAWS.** Stable high-water/circuit/route/parcel identity can outlive current occupation;
every destruction, abandonment, relocation, reuse, repair and rebuilding effect is a typed dated
operation with provenance; current occupancy never erases inherited geometry. The old §161g
ruin-ring order, contracted-defence recipe, cause-to-appearance table and reverse-growth ladder are
candidate mechanisms requiring eligible urban/`RSLP-1` evidence, not default laws.
**STATUS: EXPERIMENTAL/PARTIAL.** §17.3's sandbox demotion arm draws 34–61 humbler-rung bodies per
urban leaf and supplies a visual exemplar, not a calibrated historical resolver. ⛔ **MISSING:**
canonical vacancy/reuse state, typed operations and unknown-cause handling, plus projection rules
that render whatever states the world actually records. A four-stage ladder is not an exit.

⭐ **PLAN's TRACE 6 remains a visual hypothesis:** a separately anchored surviving/reoccupied knot
can preserve lineage more honestly than uniform thinning when the dated history records one. It is
not the universal form of decline, and the generator may not create that organism merely to make a
demoted plate look convincing.

---

### S20 · THE GROUND LAW — **BUILT**

**This stage is finished, it is the program's hardest-won surface, and a builder should change
it only with the receipts in hand.**

**MECHANISM.** One **AREA-TRUE** predicate with **ONE HOME**, consumed by the law and by every
census: *does this body's AREA intersect reserved ground?* Reserved ground is streets ∪ water
channel ∪ wall band ∪ compounds. Bodies that violate are **demoted or removed with a
diagnostic**, never overlapped. The late passes (`lateGround.js`) each **return a version**.

**LAWS.** §190 disjointness · §190a right-of-way · §200 wall clearance · §202 universal access ·
§205.1 navigability · §203 containment.
**CENSUSES (all executed at the tip — CONFIRMED):** §17 **0** intersecting drawn pairs · §17.4
**0** of 23,391 · §205A **0** · §200 **0** · §202 landlocked **0** · §201B orphan streets **0** ·
§232 straddlers **0**. Counterfactuals: planted overlap, planted right-of-way violation, sealed
court gap, severed street segment, straddling district, stale-generation circuit.
**STATUS: BUILT.** `groundLaw.js`, `reservedGround.js`, `lateGround.js`, `accessLaw.js`,
`habitation.js`. `accessLaw.js` is **stratum-agnostic** already, which is what makes §13/§168's
underground stratum cheap when it is finally built.

⚠ **THE STANDING HAZARD A BUILDER INHERITS: TWO RESERVED SURFACES CAN OCCUPY THE SAME GROUND AND
NEITHER SURFACE'S CENSUS IS LOOKING FOR THE OTHER.** MF-B7's "unresolved structures in the
town's river" turned out to be **STREET CHANNELS** — 21 channel vertices, 43 seam vertices and 28
quarter-lane vertices inside the water — invisible because every census in this family asks
about **filled bodies**, and a street is not a body: it is a claim of its own
(`laneMFB8-receipt.md` §6). ⚠ **The cure for a street crossing water is A BRIDGE, NEVER A TRIM**
— cutting the channel at the bank severs the street web across its own river and reds §201B for
a reason that is not a defect.

---

### S21 · THE CENSUSES — **BUILT** (as a family; individual censuses are listed per stage)

**THE STANDING 0/0 FAMILY** is the acceptance surface. Three rules govern every member and each
was paid for:

1. ⭐⭐⭐ **A SHARED OBJECT IS NOT A PROOF — THE PREDICATE IS THE VACUITY SURFACE** (§238.1).
   Two waves of censuses certified themselves because law and census shared a **blind vertex
   predicate**.
2. ⭐⭐ **CENSUS INDEPENDENCE IS BOUGHT BY COUNTERFACTUALS, NOT BY A SECOND IMPLEMENTATION**
   (§238.5). Every 0/0 claim carries a planted-violation arm that must red.
3. ⭐⭐ **AND FOUR MORE BLIND PREDICATES FELL WHEN THE CLASS WAS SWEPT** (§241.4): §205A channel
   crossings 113→115, §205A body wetness 12→26 (`rooted` counted **DRY** corners), and §203
   "majority AREA" 444→251 with 229 bodies judged differently — ***a census that said AREA in its
   own comment counted CORNERS and over-reported by 72%***.

⭐ **THE PROOF THAT THE SWEEP WAS SOUND: all 16 SHAs and the determinism digest were
BYTE-IDENTICAL across it — 16 census crossings and 186 containment verdicts moved and NOT ONE
PIXEL DID**, with two instruments agreeing to the unit (+16 predicted, +16 delivered).

⚠ **STANDING HAZARDS ON THIS SURFACE, each of which has bitten:** a **timeout reds like an
assertion and is not one** (when a proof's SUBJECT grows, its budget is part of the proof — the
lane timeout is 120 s, not 30 s) · a census that **convicts an absent denominator** reports the
wrong defect at the wrong magnitude · a census that measures against **part** of its subject reds
for reasons its law does not cover · an **SCC is only as wide as its scan** (five write-backs
hid inside `censusLeaf`, invisible to any SCC scoped to `buildFabric`).
⛔ **NOT BUILT: per-census runtime budgets with a completeness status where "skipped due to
scale" can never read green**, and spatial indexing with canonical insertion **and result**
ordering plus an indexed-vs-exhaustive equivalence pin. **Handed off whole with cause**
(`laneMFARCH2-receipt.md` §9.1); `reservedGround.claimIndex` is the named template and §203's
lattice arm is the first census that will want a budget.

---

### S22 · THE LENS — **PARTIAL. The geometry is drawn; the HAND is absent.**

**SIX LENSES OVER ONE GEOMETRY** (parchment, darkFantasy, watercolor, illustrated, VTT, night),
with a landed reskin-family pin. The lens layer is where §208's aesthetic mandate lives and it
is **MF-A1's brief**, not the fabric's.

**THE INK HIERARCHY (BUILT).** MF-B8 replaced the single fabric stroke width with a measured
ladder: **31 distinct stroke widths per leaf, of which six are fabric-scale — plotTick 0.24 ·
party 0.26 · fabric 0.62 · block 1.05 · landmark 1.05 · wall 2.49** — against b6's **ONE**.
ATLAS's bar is *"the corpus never has fewer than five distinct weights on one leaf"*: ★ **MEETS
the count**, and the ratio (6.5–14.0) sits **above** the corpus's own p90/p25 band.
⚠ **THREE RUNGS WERE WRONG OR ABSENT BEFORE THE FIX, and the reason is a class: `block` sat at
0.78× the fabric weight — LIGHTER than the buildings it gathers — so the silhouette could not
have read even had it been drawn; `party` and `plotTick` did not exist.** ⭐⭐ **A SHARED CLAMP
IS A SHARED CEILING, AND A LADDER WHOSE RUNGS SHARE A CLAMP IS NOT A LADDER** — the 0.5× party
wall fell under `detail`'s 0.30 floor and would have flattened into the fabric weight *at exactly
the tier the two-tier stroke exists for*.

**THE ROOF VALUE (BUILT, and it is the most visible single change on record).** J-B8-6 moved
roofs from **L≈120 to L≈155**, into the corpus's measured band **L 128–196 (median ~160)** —
*we were darker than the whole corpus.* ⚠ **MF-B1's "the fabric must not go pale" correction is
untouched, because that correction was about a DISTANCE**: §9.7's sub-law is *roofs at least
three value steps below ROADS*, and at L 155 the roof is **80 L below the street — five clear
steps**, against b1's failed 25. ⭐ **It is also load-bearing for the grain: a rank of abutting
houses resolves into holdings only if the mass is lighter than the party lines dividing it.**
**CONFIRMED by chair eyes at §229.2(b)** — the corpus-band roof values read *more* like the
references than b6/b7's uniform dark, which was heavier than **any** corpus plate.

⛔⛔ **THE PAINTED CLOSURE IS ABSENT, AND IT IS THE DECISIVE TELL.** b6 measures **0.00 on paper
grain and 0.00 on wash variation**, one stroke-width across the fabric, and **exact fill
registration where the corpus mis-registers 2–8 px** (§209.2). The five mechanics, from ATLAS
§2.3.3, each stated as a renderer mechanic:

1. **PER-STROKE WIDTH MODULATION** — ±25% along a run. *Stroke each path as a filled outline
   whose half-width is a seeded low-frequency function of arc length.*
2. **PATH WAVER** — no line is straight, including nominally straight plot boundaries; amplitude
   ≈ 0.5–1.5× the stroke width. *Per-vertex seeded displacement + midpoint subdivision, amplitude
   keyed to the element's weight class — heavier elements waver less, proportionally.*
3. **CORNER OVERSHOOT** — joins overshoot by 2–5 px at 30–60% of corners.
4. ⭐⭐ **WASH MIS-REGISTRATION — the single most decisive property.** Fill colour runs 2–8 px
   past the ink outline in places and falls short in others. *Offset each fill path by a seeded
   per-fill vector of magnitude ~0.3–1.2× the stroke width, and dilate/erode slightly.*
   **THIS IS THE ONE PROPERTY THAT, IF OMITTED, WILL KEEP THE OUTPUT READING AS VECTOR ART NO
   MATTER WHAT ELSE IS DONE.**
5. **WITHIN-FILL WASH VARIATION** and **PAPER GRAIN** — see §2.3's bands. ⚠ *Must be produced as
   GEOMETRY OR A TILED PATTERN, never as a raster filter, to survive PDF projection.*
6. **PER-FILL TONE JITTER IN TWO NESTED LEVELS** — a **ward-level** sub-palette pick, then a
   **building-level** jitter inside it. ⭐ *That nesting is what produces IQR ~50 without the
   plate looking like confetti.* (BUILT as J-B8-7 on a 9-rung quantized ladder so the fills still
   batch: the `fabric` group carries **83 distinct fill values at the town, 211 at the city, 153
   at the metropolis**, against a b6 fabric jittering on 7 quantized steps of ±0.075.)
7. **ONE FIXED-SURVEY LIGHT, HARD-EDGED BASELINE.** Every measured plate that shades uses **one
   direction and a hard edge**. This corpus finding licenses the default survey convention; owner
   decision §288 later permits separately registered finite analytic softness and other perceptual
   modes. It does not license renderer blur or supply optical coefficients.

**§214 · FEATURE ICONOGRAPHY (ruled, wave nine first-order, and SPLIT).** Its **wall arm may
proceed**: masonry as a double-line band never a bare polyline, towers as drawn rounds/squares at
**seeded-irregular** intervals, crenellation texture where scale permits, gatehouses as
structures, keep/motte with hachure, palisades as tick-rows, ditches in ditch grammar, all
tier-scaled. ⛔ **Its terrain arm is BLOCKED on S2** (§251.4a) — see S2.

**§9.5b · THE RELIEF LAW.** Era hachures, hill profiles, rock hatching and water bodies at mode.
⛔ **Terrain drama invisible = acceptance FAIL** (§177.2) — and the fjord town currently shows no
fjord.

**LAWS.** §208 · §9 (no gradients, no filters, no blends, no drop-shadows — enforced by a
forbidden-construct scan, **ABSENT across 26 files**) · §9.1 the ink hierarchy · §9.5/§9.5b ·
§214 · §12 the immersion suite.
**CENSUSES.** The §9 forbidden-construct scan (BUILT, clean) · XML parse (BUILT, 26/26) · the
per-tier op ceiling ratchet (BUILT, 96/96 under). ⛔ **MISSING: any census on the five painted
mechanics.**
**STATUS: PARTIAL.** ⚠ **The instrument that grades this needs re-windowing before it is spent
again**: `MFS1-aesthetic.py` samples 6.6 px windows that must contain no ink edge, and at the
new grain a town building is ~15 px across, so the surviving sample is dominated by ground and
field washes rather than roofs (`laneMFB8-receipt.md` §9). **Wave nine should re-window the
instrument to the new module before re-grading the tone-jitter row.**

---

### S23 · CHROME, LETTERING AND THE TRUTH LAYER — **PARTIAL**

**⭐ THIS IS WHERE WE ALREADY BEAT THE CORPUS AND IT SHOULD NOT BE ERODED (ATLAS Table C).**
Truth in the chrome — real settlement names, real populations, real prosperity, real founding
kind, real water mode, a real 200-paces scale bar, real dated event marginalia — against
hf61's **gibberish legend**, which is the corpus's floor. A **declared derivation** in the
cartouche (*"FABRIC 1:1.3 HOUSEHOLDS (REPRESENTATIVE)"*, *"REGULARIZED PLAN · FOUNDED MILITARY ·
WATER BANKSIDE"*). An in-world legend that teaches the conventions, on **every** leaf where the
corpus has one plate of furniture. Six lenses over one geometry. Byte-identical export.
**ATLAS banned prior #12 states it plainly: corrupt or decorative lettering is a style NOT to
copy — our labels are TRUE, and this is a competitive win.**

**LETTERING [E, ATLAS §2.3.4].** Serif throughout; small-caps for display; italic for
marginalia; loose letter-spacing on display type; **labels curve along their feature**; and
⭐ **gate and road names encode DESTINATION** (Porta Peregrina, Porta Mercatorum, Porta
Fluminis) — which composes exactly with CX-15's typed gates.

**T-25 · CHROME ESCALATES WITH TIER — ⛔ MISSING (GAP-I).** Cartouche (plain rule box → moulded
frame → ornate scrolled frame with colour), compass (4-point plain → 8-point coloured), scale
bar (three registers), plus **3–8 seeded paper defects per leaf**. b6 has all three surfaces,
well made, and **identical at every tier**. ⭐ *One `chromeRung` from tier × prosperity drives all
three. Trivial, and it makes the tier read even in the margins.*

**T-26 · THE ANNOTATION LAYER IS A SEPARATE INK — the DM lens's rendering contract.** Four rules:
a different hue family (red/rust) · always dashed or dotted · always with a leader line and a
serif label · drawn above with **zero interaction with the base ink**.

**§161i's NON-DEFERRABLE RIDER, and it is easy to lose:** ⭐ **THE TRUE MEASURE IS MINTED — the
physical-distance metric gets its derivation home in-family and the scale bar ships TRUE.**
**LAWS.** §12 the immersion suite · §9.4 the document conceit · §3's audience projection ·
§10.C the DM lens · §161i.
**STATUS: PARTIAL.** Chrome, lettering, cartouche, compass, scale bar, legend and heraldry are
BUILT; the tier rung and the annotation contract are not. ⚠ Carried defects: heraldic charges
read coarse at cartouche size; no rank cartouches or district sub-labels.

---

## §2 · THE TARGET SHEET — the measured bands each stage must land in

**HOW THIS SHEET IS USED (ATLAS §2.8, binding).** Every self-judgment cites the number and
states the **ABSOLUTE DISTANCE**, never "improved" (§8.3b). Nothing here is a pin: every number
is a target for the chair to convert into a pin, a band, or a rejection. The five measurement
instruments are re-runnable against any render directory.

### §2.0 · THE FIVE USAGE RULES A LATER LANE MUST INHERIT (ATLAS §2.8.1 — binding)

1. ⭐⭐ **BANDS RE-PIN TO THE STRONGEST MEASURED COHORT, NEVER TO THE CORPUS MEDIAN (§244.4).**
   The cohort is computable: **HF-1-era plates (n=49) ∪ the measured top decile on the register
   index (threshold 73.78; n=32; 10 in both) = n=71.** *Why:* the corpus grew paler round by
   round; **pinning to the median ratifies our own drift and makes the north star chase the
   generator that drew it** — ⟦FOLD §264⟧ i.e. **the IMAGE model that produced the plates**, whose
   own output drifted paler round by round; §261 makes the referent explicit so nobody reads this
   as a statement about the settlement generator. ⭐ **SIGN CHECK FOR ANYONE RE-DERIVING: done correctly, paper grain,
   wash σ and tone IQR move UP against what MF-S1 published. If your re-derivation moves them
   DOWN, you pinned to the median.** (§249.1: *a re-deriver who takes the median gets the wrong
   SIGN, not merely the wrong magnitude.*)
   ⚠ **AMENDMENT, §249.4(a): any axis NOT represented in the register index pins to HF-1 ALONE**
   — paper warmth is exactly that case, because the register index deliberately excludes chroma
   and warmth. **Paper warmth pins at 37** (see conflict **C-1**).
2. ⛔ **T-01's THORP AND HAMLET RUNGS ARE WITHDRAWN AND MAY NOT BE GRADED (§244.5).** Not
   widened — **withdrawn**, because `cells_across` counts dark runs and at thorp scale the
   bounding box is mostly hedges, tofts, furlong furrows and orchard rows. ⭐ **`hf90`, a
   TWELVE-ROOF thorp, returns 99.6 "cells across".** **What restores them: a ROOF-COUNT
   instrument** — these plates carry 6–24 roofs, so an eye count is *exact*. **Any grading
   verdict already issued against them is withdrawn with them.**
3. ⚠ **INSTRUMENT PROVENANCE — know which ruler produced each number before you compare to it.**
   `MFS1-measure.py` (texture blocks, palette clusters, colour-family shares) — ⛔ **its
   `center_edge_ratio` is the one noisy field: median 7% deviation, max 44%. DO NOT BAND THAT
   NUMBER at this precision, and T-03 rests on it.** · `MFS1-aesthetic.py` (grain σ, wash σ, tone
   IQR, stroke percentiles) — reproduces all 12 archived rows **exactly**, and **it ran on 12
   plates only**. · `MFS1-grain2.py` (fabric grain) — kernel reproduces all 22 archived rows
   exactly; **only the WINDOWS moved**, and they are hand-set. · `MFS1-streets.py` — ⚠ **NOT
   re-run at scale, deliberately**: it depends on the same hand-set cell pitch as grain, so
   **T-04's numbers are unrefreshed and unverified at thorp/hamlet.** · `HFM1-palette.py` — ⭐
   the **RECOVERED** paper/ink instrument (no original survived); calibrated against 49 published
   pairs to within 3/255 on ink hex. ⚠ *It is a recovery, not the original — and it exposed the
   paper border-inset defect the original hid.*
4. ⭐ **A GRADING COHORT MUST BE MEASURED AGAINST THE SAME INSTRUMENT AS ITS PREDECESSORS BEFORE
   ITS GRADES ARE SPENT (§244.2).** Stars, "best in corpus" calls and register-edge judgments are
   **ANNOTATIONS** until that has happened. ⛔ **HF-4c's ★★★ grades are annotations by ruling and
   NO CALIBRATION FIGURE MAY DERIVE FROM THEM** — that round awarded ★★★ to 55 of 78 (70.5%),
   not the 41 it self-reported, against HF-3's 2 of 84, and measures the **weakest of five
   rounds** on the atlas's own hand axes controlling for subject.
5. ⚠ **CANONICAL PATHS (§243).** Cite `map-corpus/` only. **The session scratchpad is a MIRROR
   that may vanish; a lane that reads it is reading a copy nothing may depend on.**

6. ⚠⚠ **A CORPUS-WIDE EXEMPLAR FIGURE IS A FEW SETTLEMENTS MULTIPLIED — PUBLISH THE
   DISTINCT-SITE TOTAL BESIDE IT OR SAY THAT YOU HAVE NOT.** Seven of the sixteen leaves share
   seed `mf-town-01` + riverside and two share `mf-city-01` + coastal, so **10 distinct worlds
   wear 16 names** (§0.3b). ⭐ **A one-river move publishes up to SIX TIMES**, which is exactly
   how MF-ARCH-2's `waterViolations` +51 read as a corpus regression when it was +10 on one town.
   **This rule governs every count in §2 and §4 of the form "N over 16 leaves".**

⭐ **AND ONE MORE, FROM THE SAME FAMILY (§249.3): A SUPERLATIVE IS A CLAIM AND MUST BE MEASURED
AT ITS STATED SCOPE.** The atlas's own 32 superlatives were audited and six were false *even of
the 12-plate sample they were drawn from.*

### §2.1 · T-01 · FABRIC GRAIN BY TIER — the headline target

| tier | **target band (cells across)** | basis | status |
|---|---|---|---|
| **thorp** | ⛔ **none — WITHDRAWN** | published 8–14 rested on n=1 with a **misplaced window** | **may not be graded** until a roof-count instrument exists |
| **hamlet** | ⛔ **none — WITHDRAWN** | published 18–26 was **interpolated through that same fault** | **may not be graded** |
| **village** | **30 – 50** | [M] n=5 → re-measured n=9, 6/9 in band, median 48.0 → **45.9** | ✅ UNCHANGED |
| **town** | **45 – 80** | [M] n=8 → re-measured n=12, 10/12 in band, median 61.3 → **57.0** | ✅ UNCHANGED |
| **city** | **60 – 95** | [M] n=5 → re-measured n=9, 7/9 in band, median 74.2 → **69.0** | ✅ UNCHANGED |
| **metropolis** | **80 – 120** | published 100–130 rested on n=1; re-measured n=9 (70.2 – 97.6 – 119.6), only 4/9 inside it | ⚠ **RE-PINNED** |

**THE ONE NUMBER THAT MATTERS MOST: the corpus's fabric grain walks 46 → 57 → 69 → 98 cells
across from village to metropolis — monotonic, ×1.24 · ×1.21 · ×1.41, and it never plateaus.**
The claim is **CONFIRMED at n = 9/12/9/9 over four tiers**, which is stronger evidence than the
withdrawn six-rung version ever had. ⭐ **The corpus makes tier legible at a glance chiefly by
GRAIN, and grain is CELLS ACROSS THE SETTLEMENT, not building size in absolute units.**

⛔ **NO INTERPOLATION RULE EXISTS BETWEEN THE RUNGS.** `cells_across ≈ 5.7 × population^0.27`
(R² 0.80) is **WITHDRAWN** and **may not be cited; no derivation may be built on it.** **The BAND
ENDPOINTS are the whole of T-01.** See §1.2c for the restoration path and the external
cross-check.

⚠ **THE ≤30% BAND-OVERLAP RIDER IS RETIRED AS UNSATISFIABLE (§249.4b)** — the atlas's own
town/city bands overlap by **57%**. Its measured overlap is recorded instead as **a FACT ABOUT
TIERS: grain alone does not separate town from city**, so tier legibility must rest on the
multi-channel read (landmark budget T-16, district channels T-17, chrome T-25). ⛔ **The IQR
alternative (village 39–48, town 47–67, city 63–81, metropolis 81–107) was measured and NOT
ADOPTED**, because narrowing the bands would silently move MF-B8's standing verdicts.

**WHERE WE STAND (CONFIRMED, `laneMFB8-receipt.md` §0; b8b re-measured town 50.5, city 61.3):**

| tier | b6 (atlas) | **b8** | band | verdict under §244.5 |
|---|---|---|---|---|
| thorp | — | 5.4 | ⛔ withdrawn | ⛔ **NOT GRADED — the reported miss was an INSTRUMENT ARTIFACT** |
| hamlet | — | 10.4 | ⛔ withdrawn | ⛔ **NOT GRADED — same cause** |
| village | 9.6 | **17.0** | 30–50 | MISSES ×1.76 from the floor |
| **town** | 26.0 | **48.0 / 50.5** | **45–80** | ★ **MEETS — STANDS** |
| **city** | 20.0 | **61.0 / 61.3** | **60–95** | ★ **MEETS — STANDS** |
| metropolis | 20.9 | **70.0** | 80–120 | ⚠ **still a miss, ×1.14 from the floor — not the ×1.43 reported against the withdrawn band** |

⭐⭐ **AND THE INVERSION IS GONE STRUCTURALLY, NOT BY TUNING (§229.1).** The b6/b7 walk inverted
at town→city (26 → 20) and flatlined above. The walk is now **5.4 → 10.4 → 17.0 → 48.0 → 61.0 →
70.0, MONOTONE** — because grain is a **continuous function of population**, so **no seam can
invert and no later tuning pass can make it.** ⭐ *A monotone function of population cannot invert
at a tier seam; a per-tier constant always can.*

**THE BUILT DERIVATION (`tierGrammar.js`), in four lines:**

```
GRAIN_BAND    thorp 8–14 · hamlet 18–26 · village 30–50 · town 45–80 · city 60–95 · metropolis 100–130
              ⚠ metropolis is STALE — conflict C-2 rules the corrected band 80–120 binds
GRAIN_SEAMS   8 → 16 → 28 → 47.5 → 70 → 97.5 → 130     (the mean of each pair of FACING endpoints)
cells(pop)    lo + (hi − lo) × bandPosition(pop, tier)  — CONTINUOUS, MONOTONE, band-bound
roofs         N = π · cells² / (4 · fill · depthRatio)
```

⭐⭐⭐ **THE SEAM CONSTRUCTION IS WHY THE INVERSION CANNOT COME BACK, AND IT IS THE ONE PIECE OF
ARITHMETIC A BUILDER MUST NOT "SIMPLIFY".** The measured bands **do not meet** — the thorp's
ceiling is 14 and the hamlet's floor is 18 — so reading each tier's own endpoints literally puts
a **JUMP at every seam**, which is the discontinuity §161f forbids in as many words. **Taking the
MEAN of the two facing endpoints makes the curve continuous, monotone, and never outside the
union of the two bands it joins.** VERIFIED: **11,765 populations swept from 1 to 200,000 — ZERO
decreases; every tier seam continuous to 2 d.p.**
⭐ **AND THE ARITHMETIC REPRODUCES THE ATLAS'S OWN INDEPENDENT CHECK.** Eliminating both the
radius and the frontage from the two definitions — *and they DO both cancel, which is what makes
this a derivation rather than a fit* — gives `N = π·cells²/(4·fill·dr)`. At 60 cells and 60%
fill that returns **2,176**; MF-S1, reasoning independently, wrote *"≈2,200 parcels"*. **Within
1%.**
⚠ **THE GRAIN DERIVATION IS THE ROOF COUNT'S ONLY HOME** — `grainCellsAcross → grainRoofs →
tierScale.roofs → the packer's calibration target. Restoring the old `220 + 640·bandPosition`
formula silently restores the inversion with no error anywhere.**
⚠ **AND THE INSTRUMENT MEASURES WHAT RESOLVES, NOT WHAT EXISTS.** b7's town already carried 82
plot modules across its window and counted 24.8 — **the ×3.3 gap was DRAWING, not derivation.**
`MFB8-runprobe.py` separates the two and should be standard.

### §2.2 · T-02 · GRAIN MUST KEEP CLIMBING ABOVE TOWN

**Target [M]: city ≥ 1.2× town grain; metropolis ≥ 1.4× city grain.**
✅ **CONFIRMED, AND ON A MUCH LARGER SAMPLE THAN IT WAS SET FROM: city/town = 69.0/57.0 = ×1.21
(n=9, n=12) and metropolis/city = 97.6/69.0 = ×1.41 (n=9, was n=1). Both within 0.01 of the
published target.** ⭐ **T-02 is the one headline figure the measurement pass STRENGTHENED rather
than moved** — and note it is a **RATIO** target, which is why it survived the absolute re-pinning
of the metropolis rung intact.
**WHERE WE STAND:** city ÷ town = **×1.27 ✔ MEETS**; metropolis ÷ city = **×1.15 ⛔ MISSES**.
⛔ **AND THE CAUSE IS THE EXEMPLARS' POPULATIONS, NOT THE LAW, WHICH B8 SHOWED RATHER THAN
CLAIMED**: the city exemplar sits at bandPosition **0.61** of its band and the metropolis at
**0.44** of its (20,091 souls against 71,325 — only ×3.5). At the derived level the same curve
gives 86.9 and 111.9 (**ratio 1.29**); at the band centres, 77.5 and 115 (**ratio 1.48 ✔**).
⭐ *Forcing 1.4 at these two populations would require the metropolis to read as a 128,000-soul
settlement, which is §161f repealed to make a ratio.* **The law is right and the exemplar pair is
close together.**

### §2.3 · THE AESTHETIC BANDS (§208) — strongest cohort, n=71

| property | **band (p5 – median – p95)** | note |
|---|---|---|
| **Paper** | centroid **`#FAEBD8`**, L **226 – 244**, warmth R−B **20 – 50** | ⭐ **target warmth 37 per §249.4a (conflict C-1), NEVER the corpus median `#FBF2E2` / warmth 25.** Warm cream, never white, never grey. ⚠ **The corpus MOVED AWAY from this target: warmth by round 37 → 27.5 → 24 → 23 → 24, in-band share 96% → ~55%. The paper is going white.** |
| **Ink** | centroid **`#2E201A`** (L 34.3); ink L **16.5 – 35.2 – 66.4** | a **warm dark brown-black**, not black and not grey — and the centroid is **UNCHANGED** under correct pinning |
| ⭐ **INK L — the quality gate** | **≤ 45 full ink · 45–62 acceptable · > 62 UNDER-INKED** | replaces the retired value-range band. Two independent derivations landed on 62 (the strongest cohort's p93 = 62.1 **and** the light end of the published ink band `#5E3420` = L 62.3). **13.7% of the 313 exceed it; only 7.0% of the strongest cohort does.** b6 measures **35.0 → MEETS** |
| **Value structure** | L1 **52** · L10 **115** · L50 **202** · L90 **231** · L99 **237** | strongly paper-weighted with a thin dark tail — ⭐ **the page is light and the INK IS THE EVENT** |
| **Chroma** | **18 – 43.3 – 70** (p5–p95 23.6 – 61.9) | ✅ **UNCHANGED.** ⭐ The band that best proves why the pinning rule matters: from the corpus **median** it is 36.2 with the top collapsing 70 → 52. **The −8 is a fact about OUR DRIFT, not about the target.** ⭐ hf40 achieves the corpus's clearest wealth read at chroma **27.8** — *colour is not what carries the information* |
| **Stroke percentiles** (normalised to a 5056 px plate) | p25 **4** · p50 **6** · p75 **10** · p90 **17** | ✅ UNCHANGED |
| **Lineweight ratio p90/p25** | **3.1 – 4.33 – 7.2** (min–max 2.8 – 9.3) | ⚠ **MOVED UP, 3.55 → 4.33, and it is a SAMPLE-SIZE CORRECTION, not corpus drift.** ⭐ **The ink hierarchy is STEEPER than the atlas published, which RAISES the bar** |
| **Paper grain σ** | **1.30 – 2.05 – 2.96** (min–max 1.00 – 3.41, n=64) | ⚠ MOVED **UP**. ⚠ **16 plates have no measurable blank paper at all — that is DATA, not a gap: they are the densest plates in the corpus.** Plus 3–8 discrete paper defects per leaf |
| **Within-fill wash σ** | **1.83 – 3.29 – 4.39** (min–max 1.22 – 4.44) | ⚠ MOVED **UP** at the floor and the median |
| **Per-fill tone jitter (IQR)** | ⟦FOLD §297/§298⟧ **6.1 – 17.9 ≈ 18 – 59.3** (HF-1 alone, n=49; min–max 4.0 – 100.1) | ⛔ **THE 18 → 22 RAISE IS WITHDRAWN (§298.2a): tone IQR is a COMPONENT of the register index, so pinning it to the index-selected union was SELECTION ON ITSELF.** It re-pins to **17.9 ≈ 18** on HF-1 alone. The symmetric rule now in force: **an index-COMPONENT axis pins to HF-1 alone, exactly as an index-UNSCORED axis does.** Grain **2.05** and wash **3.29** stand on independent evidence. The corpus maximum over 313 is **153.0**, not 100.1 |
| **Distinct weights per leaf** | **≥ 5** | ★ *"the corpus never has fewer than five distinct weights on one leaf"* |
| **Accent** | **rationed, ~1–3% of plate area** | reserved: vats, candle ochre, annotation rust |

**THE WEIGHT LADDER, measured [M]:** wall circuit **4.0 – 5.0** (the heaviest strokes measured,
p90 = 35 px on hf55) · landmark silhouette 2.5 – 3.5 · **block silhouette 2.0** · street-fronting
building edge **1.0 (the reference weight)** · **interior party-wall / unit division 0.5** ·
plot-boundary tick 0.4 – 0.6 · field boundary / furrow 0.25 – 0.4 · **ghost register 0.38 with a
6-2 dash**.

**ROLE VALUES [M]:** Roads are **the palest built role — bare paper or paper + 2 L**. Roofs
**L 128 – 196**, and **≥3 value steps below Roads in every plate** (§9.7's binding sub-law,
corpus-confirmed). Greens (yards/tofts) one sage family, 3–5 tones. Water: river = a mid wash +
a dark bank line; sea = the same family one band darker — **never a hue jump**. Walls equal to
Ink or one step darker.

**WHERE WE STAND (b6, ATLAS Table B):** paper grain **0.00 ★ ABSENT** · within-fill wash **0.00
★ ABSENT — every fill is mathematically flat** · tone jitter **town/village/metropolis 4.0 →
MISSES ×5.5**, and ⚠ **the watercolor lens measures 0.2, FLATTER than the parchment lens, which
inverts its own definition** · wash mis-registration **★ ABSENT — the decisive "vector art"
tell** · path waver, stroke modulation, corner overshoot **ABSENT** · lineweight hierarchy
**★ MISSES at b6 → ★ MEETS at b8** (six fabric-scale weights, ratio 6.5–14.0).

### §2.4 · THE PLAN-STRUCTURE BANDS (PLAN)

⛔ **§287 EVIDENCE BOUNDARY.** These are measurements of the internal synthetic visual corpus.
They may grade projection/legibility and supply counterfactual fixtures. Labels such as `planned`,
`rich`, `poor`, `demoted` or `organic` do not make the associated number a historical cause,
frequency or runtime activation threshold; §10.17 and mechanism-specific historical cohorts govern
that promotion.

| target | **band** | instrument / note |
|---|---|---|
| **junction mix — X : T** | **≤ 0.09** (corpus median **0.024**) | 35 whole-settlement windows. ⭐ ⟦FOLD §297/§298⟧ *forty-one-and-a-half T-junctions per X* (**41.5**, corrected from 43); **27 of 35** windows carry zero deg≥5 nodes (corrected from 22). ⛔ **REGISTER-MATCHING TARGET, SAME-INSTRUMENT ONLY** — the skeletonizer's X-recovery is unmeasured and large (§298.5a) |
| **degree ≥5 share** | **≤ 0.01** (median 0.000; ⟦FOLD §297/§298⟧ **27** of 35 windows have zero, corrected from 22 at §298.5a) | — |
| **T/Y share** | 0.510 – **0.653** – 0.738 | — |
| **dead-end share** | 0.110 – **0.209** – 0.391 | ⭐ per-district band **proposed**: rich 0.15–0.22, poor 0.26–0.34 |
| **γ connectivity** | **0.39 – 0.52** (median 0.473) | ⭐ *a half-mesh, neither tree (0.33) nor mesh (1.0)* |
| **mean degree** | **2.1 – 2.7** (median 2.47) | edge/node ratio 1.17 – **1.40** – 1.55 |
| **orientation-order φ, whole settlement** | 0.044 – **0.103** – 0.433 | Boeing φ, 36 bins, bidirectional, length-weighted |
| **φ, planned quarter** | **0.318 – 0.652**, ⛔ **hard ceiling 0.8** | *a planned quarter measuring φ > 0.8 is drawn wrong* |
| **block elongation** | median **1.6 – 3.0** (corpus median 2.14) | ⭐ *the corpus draws STRIPS, not squares* |
| **block solidity** | median **0.60 – 0.86** (corpus median 0.748) | *a quarter of a typical block's convex hull is not block* |
| **block area p90/p10** | **≥ 6** (corpus median 13.6, max 204.5) | *the spread IS the information* |
| **street width p50 / p97 (distance transform, plot-widths)** | 0.44 – **1.77** – 4.90 / 1.24 – **5.72** – 22.07 | ⚠ **a DIFFERENT quantity from T-04's scanline ratio — do not compare directly** |
| **width hierarchy p97/p50 (distance transform)** | 1.79 – **3.32** – 7.30; towns/cities cluster **2.4 – 4.6** | at hamlet/thorp the hierarchy is **genuinely flat** (1.79, 2.04) |
| **legible epochs** | thorp/hamlet 1 · village 1–2 · town 2–3 · city 2–4 · metropolis 3–4; ⛔ **NEVER more than 4** — ⟦FOLD §297/§298⟧ scoped to the **36 directly-viewed plates of the 222-plate studiable frame**, never "anywhere in 313" (§298.5e) | ⛔ ⟦FOLD §297/§298⟧ **THE "CORROBORATES §240.2's RING CEILINGS" CLAIM IS STRUCK (§297.3b).** That corroboration was the Q-2 fabric/circuit conflation — fabric epochs are not circuit epochs, so this row cannot witness a ring ceiling. §240.2's per-tier caps are REVERSED as binding numbers and are re-derived against the corpus; ring count DERIVED from the settlement's own facts is the surviving law |
| **legible districts** | thorp 0–1 · hamlet 1 · village 1–3 · town 3–6 · city 5–9 · metropolis 8–14 | ⭐ *legibility saturates well below enumeration* |
| **district separation** | **≥1.4× in median block area OR ≥1.3× in cells-across** | proposed band for GAP-H's label-free census |
| **epoch grain step** | ⟦FOLD §297/§298⟧ newer epoch **1.33× – 1.44× COARSER** in window-independent PITCH (hf239 **0.99×**, the founding-mode inversion); ⛔ the published **1.8×–2.9× is WITHDRAWN** as a window-width artefact (§298.5e) | ⭐ *old cores are the finely subdivided ones* — ⚠ **by a third, not by triple** |
| **epoch φ step (planned)** | ⟦FOLD §297/§298⟧ **×2.4 – ×9.4** (was ×9.5) | ⭐ *order tracks FOUNDING MODE, not age* — the ORDERING is ratified as filed |
| **void count ≥4 pw²** | median **7** per settlement, range 0–24 | ⚠ *"largest void" is NOT "the centre"* |
| **polycentricity index** | monocentric <0.15 (12/34) · polycentric >0.55 (13/34) | second-largest void ÷ largest void |
| **ordinary : notable** | notable **2–5% of footprints at town, 1–2% at city**, occupying **10–20% of built area** | ⭐ *small in COUNT, large in AREA* |
| **outliers per block** | 16–18 near-module, **2–4 outliers** per 20 buildings | outliers change **plan topology**, not just size |

### §2.5 · THE CONTEXT-STRUCTURE BANDS AND FREQUENCIES

⛔ **THE WORD “FREQUENCY” HERE MEANS FREQUENCY IN THE CURATED SYNTHETIC PLATES, NOT HISTORICAL
EUROPE.** These rows are visual-register diagnostics only. Walls, water relations, gates,
extramural growth, district types and institutional rosters are generated from dated world facts
and promoted historical mechanisms, never tuned to these percentages (§10.17–§10.23).

| target | **band / frequency** | source |
|---|---|---|
| water relationship incidence | **BANKSIDE 44% · NONE/WELL 29% · NEAR 15% · THROUGH 12%** | ATLAS T-12 [E, n=34] |
| THROUGH settlements | **≤15%**, and **every one must show bank asymmetry** (~70/30) | ATLAS T-12 |
| walled incidence | **≈29 walled / ≈12 unwalled of 41**, and the split **is the tier line** | ATLAS T-10 |
| wall flank grammar | full ring **55%** · half-ring vs water **17%** · terrain-anchored **14%** · water gates **10%** · two vintages in frame **10%** | ⭐ **a generator drawing a full ring 100% of the time is wrong by ~45 points** |
| towers absent on a flank | **6 of 7** walled plates, and the bare flank is **always the terrain-defended one** | CONTEXT §3.2 [M-view] |
| wall-side street | **7/7 plates on SOME runs; 0/7 on EVERY run** | ⛔ **§200's census must exempt by RUN TYPE or it reds on correct output** |
| gate counts | town **2–4** · city **~4** · metropolis **6–7** | CONTEXT §3.3 [M-view] |
| extramural growth | present in **≥60%** of walled, concentrated at **ONE or TWO gates**, never even | ATLAS T-21; ribbon extents **explicitly unequal** |
| route-isolated courts | **3–15% of blocks** (proposed pin ≤12% of blocks AND ≤20% of interior open spaces, **floor > 0 at town+**) | §209.4 reconciling §204 |
| interior yards **with a mouth** | **15–65%, common and unrestricted — A DIFFERENT OBJECT** | §209.4 |
| open share in the fabric | village **5–27%** · town **2–13%** · city **1–11%** · metropolis **≈1%** | ATLAS T-05 |
| per-district open-share modifiers | government/civic **+10–15 pts** · religious precincts **+15–20** · crafts/noxious **−5** · poor quarters **tightest (~2–4%)** · military compounds **+25–30** | ATLAS T-05 [E] |
| landmark budget | thorp **1** · hamlet 1–2 · village 2–5 · town **3–7** · city 4–9 · metropolis **9+** | ATLAS T-16 |
| landmark : house footprint ratio | thorp 1.6:1 · village 3–4:1 · town 5–6:1 · city ~8:1 · metropolis ~12:1 | ⚠ b6 measures ~2:1 — **we draw too many, too small** |
| alley / sliver floor (street width p25) | **0.02 – 0.08** plot-widths | ⚠ **a HIGHER floor means UNIFORM SPACING, not tight packing.** b8 reads 0.16/0.09/0.09 — the town moved the **wrong way** |
| through-gap frequency | **~1 per 6–9 plots** along a frontage | ATLAS T-09 [E] |
| burgage plot geometry | depth:width **4–6 : 1** · building **30–45% of plot depth** · **touching the street line** · series widths ±**20–40%**, never exact | ATLAS T-08 [M] |
| street hierarchy p97/p50 (**scanline**, T-04) | organic town/city **16–30** · planned **7.5–13** · chaotic ≈14 **with the widest class MISSING** | ⚠ b8 reads 9.9 / 12.1 / 12.4 — **misses, closing** |
| widest channel p99 (scanline) | **2.7 – 6.4** plot-widths | ★ b8 reads 5.34 / 4.82 / 6.70 — **MEETS** |
| density gradient (centre : edge) | organic **2.5–5.0** · planned **1.4–1.9** · growth-ring/boom/influx **7–17** · demoted **4–5** with near-zero occupancy beyond the core | ⚠ **T-03's basis is the noisy `center_edge_ratio` — §249.4c flagged it too noisy to band, and it is flagged, not guessed** |

### §2.6 · ⛔ WHERE A TARGET DOES NOT EXIST, AND MUST NOT BE INVENTED

**Four rows carry the fifth verdict — ⛔ WITHDRAWN or UNBANDED — and a grading pass must leave
them blank rather than convert them into a pass or a fail.**

1. ⛔ **T-01 thorp and hamlet grain.** No instrument. **Restorer named: a ROOF-COUNT pass.**
   Until it exists these two rungs have **no target** and no leaf may be graded on them.
2. ⛔ **The population→grain fit.** **UNRESTORABLE from the corpus** (§249.4c) because every
   population in it but one is an eye estimate. **Restorer named in §1.2c: fit against our own
   leaves, whose populations are facts.**
3. ⛔ **T-03's density gradient.** Its basis is too noisy to band at this precision (median 7%
   deviation, max 44%). **Flagged, not guessed.** And per **C-4** it is a census, never a
   generator input.
4. ⛔ **T-05's fill share.** ⚠ **A MEASUREMENT MISMATCH, NOT SIXTEEN LEAVES OF FAILURE.** ATLAS's
   `open_share_in_core` is a **TEXTURE** measure (8×8 blocks by edge density); the built census
   computes `1 − building area ÷ wash area`. **They are different quantities and the built one
   has no measured band behind it.** The census reports it with its definition stated and its
   band declared **DERIVED-NOT-CORPUS**. ⭐ **Wave nine must either measure the atlas's own
   quantity on the plate, or set a band for ours — and say which.** (See **CHAIR QUESTION Q-4**.)

⟦FOLD §264⟧ **AND THREE MORE, ALL OF THE SAME FAMILY: A MECHANISM WE WANT AND CANNOT GATE.** These
are not withdrawn targets — they are **targets that were never built**, and §261's leg (b) makes
each of them a hard stop rather than a caveat. **§263.6a ORDERED THE FIRST TWO BUILT; the third is
this lane's own finding.** All three are gap **G-40** and all three land in **W0**.

5. ⛔ **TOWER SPACING.** There is **no tower-spacing metric of any kind** in the measured register —
   no spacing distribution, no spacing CV, no tower count against circuit length. ⚠⚠ **So our own
   claim that even tower spacing is the corpus's strongest generated tell rests on visual analysis
   rather than on a number, and TWO prior-art products now agree on the corner mechanism while we
   still cannot check it** (§259.5, §263.6a). **Instrument: spacing CV along the circuit + tower
   count per unit circuit length.** Until it reads, S13's corner rule is **provisional**.
6. ⛔ **PER-EPOCH MATERIAL / TONE CONTRAST.** Varying building material per epoch is the cheapest
   way to make an epoch boundary legible, and it **cannot be gated**: `fill_tone_iqr` and
   `wash_within_sigma` are **whole-plate** statistics, not between-region contrasts, and §2.4's
   epoch **grain** step would be gating one quantity with another's number. **Instrument: a
   per-epoch fill-tone (and texture) SEPARATION measure** — the same shape as the grain step, on the
   tone axis (§263.6a).
7. ⚠ ⟦THIS LANE'S OWN FINDING⟧ ⛔ **FOOTPRINT-SCALE SHAPE — and it half-blocks G-39.** ⭐
   **CONFIRMED by reading the key names of `MFS3a-planmetrics.json` and `MFS3a-voidmetrics.json`:
   the finest spatial SHAPE metrics we hold are BLOCK-scale** (`block_elongation_p50/p90`,
   `block_solidity_p50`, `block_circularity_p50`, `block_area_cv`). **There is no
   footprint-rectangularity metric anywhere in the register**, and `cells_across` is a *grain*
   measure, not a shape measure. **Consequence: the LARGE-scale half of the chaos/orthogonality
   hypothesis is measurable today and the SMALL-scale half is not** — so §261.3's required test
   (G-39) can only half-run until this instrument exists. ⚠ *Recommended, vetoable, and flagged as
   an addition to §263.6a's two rather than smuggled in as if it had been ordered.*

⟦FOLD §264⟧ ⭐ **AND ONE NEW CENSUS THE CHAIR HAS ALREADY ORDERED AND THIS DOCUMENT HAD NOT
RECORDED (§257.3c): DERIVED GRAIN AND DRAWN GRAIN MUST AGREE WITHIN A STATED TOLERANCE.** The
metropolis derives ≈**113** cells and the plate measures **70** — *"not a spec ambiguity, it is a
MEASURABLE DISAGREEMENT BETWEEN INTENT AND OUTPUT"* — **so the loss between them can never again be
invisible.** `MFB8-runprobe.py` already separates what RESOLVES from what EXISTS and is the
instrument; the census is the tolerance around it. **W0, with the other three.** (See **Q-3**, now
RULED.)

⚠ **One more the corpus itself cannot supply: the frozen corpus has ZERO trade (0/4) and ZERO
institution (0/3) coverage in the legacy 53-image evaluation roster** (§249.4c) — a known limit, recorded so nobody
mistakes silence for evidence.

---

## §3 · THE INVARIANTS — what may never move, and why

### §3.1 · ⭐⭐ THE FOUR TIER-INVARIANTS (§250.6a, ADOPTED AS LAW)

**MEASURED [M, PLAN §8] — these barely move from village to metropolis:**

| property | village | town | city | metropolis |
|---|---|---|---|---|
| T/Y share (median) | 0.678 | 0.653 | 0.596 | 0.650 |
| X share (median) | 0.011 | 0.020 | 0.007 | 0.016 |
| dead-end share (median) | 0.209 | 0.195 | 0.219 | 0.225 |
| orientation-order φ (median) | 0.085 | 0.119 | 0.069 | 0.095 |
| block elongation (median) | ~2.1 | ~2.1 | ~2.1 | ~2.1 |

⭐⭐ **THE LAW: JUNCTION MIX, DEAD-END RATE, ORIENTATION ORDER AND BLOCK ELONGATION MUST NEVER BE
SCALED WITH TIER OR POPULATION.** They are not fixed global constants: a generator may vary them
only as the consequence of explicit plan intent/realisation, inherited routes and parcels,
substrate, occupation and dated subdivision/replanning operations at the district/epoch/organism
scope named below. Present wealth, lawfulness, age labels and founding-name categories are not
licensed causal inputs. They are censused per leaf and at the canonical causal scope.

⭐ **WHY THIS IS ADOPTED AS LAW RATHER THAN LEFT AS AN OBSERVATION (§250.6a): these are precisely
the dials tuning would reach for when a metropolis looks wrong, and moving them destroys the
settlement's KIND rather than its SIZE.** *A metropolis is not a more ordered village; it is a
village's grammar at 100 cells across instead of 30.* **This is the most useful negative result
in the study program.**

⚠⚠ **AND THE PRECISION MATTERS, BECAUSE A LATER LANE WILL OTHERWISE PIN THE WRONG THING.
"TIER-INVARIANT" DOES NOT MEAN "CONSTANT".** The same four quantities are **strongly variant
along axes that are not tier**:

- **dead-end rate is correlated with the plate's wealth and epoch labels** — hf40's labelled poor
  half carries **38% more** dead ends than its labelled rich half (0.296 vs 0.215), and one young
  region reads higher (0.225 → 0.342). These are synthetic visual observations, not causal or
  historical licences;
- **φ varies enormously PER EPOCH AND PER ORGANISM** — ⟦FOLD §297/§298⟧ 7.9×, **9.4×** and 2.4×
  *within a single plate* — while the settlement-level median stays flat;
- **X share varies PER EPOCH** — hf239's castra camp carries the corpus's highest (0.088) while
  its own vicus carries 0.028.

⭐ **THE CORRECT STATEMENT, WHICH IS WHAT A CENSUS MAY ENCODE: in this synthetic corpus these four
do not move monotonically with population or tier and do vary among labelled regions and epochs.**
That supports a negative census against hidden tier dials. It does not establish wealth, age or
founding mode as the cause; only canonical plan, parcel, route, occupation and dated-operation
facts may drive the executable variation.

**VARIANT [M, PLAN §8] — these move monotonically, and `population` alone drives every one of
them (§161f's continuous-scale law, corpus-confirmed):** cells across · width hierarchy · legible
districts · legible epochs · void count.

### §3.2 · ⭐⭐ WHAT MAY NEVER BE A GENERATOR INPUT (§250.6b, ADOPTED AS A GENERAL LAW)

> **A DESCRIPTIVE STATISTIC MAY BE A CENSUS AND MUST BE FORBIDDEN AS A GENERATOR INPUT.**

**The named instance: `radialDensityFalloff`.** It is a descriptive result of inherited layout,
dated occupation and land use;
fitting to it **re-bakes the concentric prior we ban** — *the same disease as pinning bands to
the corpus median (§244.4).* The correction is the general form: **grain is materialised from
explicit parcel/frontage lineage, function, occupation, plan and dated change, and any radial
gradient is allowed to EMERGE. Never impose radius or use current wealth/age as a proxy.**
⭐ *A generator that imposes a radial density falloff will produce a plausible BLOB and an
unreadable HISTORY.*

**Keep the statistic as a census — it is a good detector.** Its first run already caught
something real: **every leaf reads flat and several read below 1.0 — the edge is denser than the
centre** (village 1.19 · town 1.05 · city 0.65 · metropolis 0.76 · highwater 0.73, against
organic 2.5–5.0). ⚠ **It is a DIFFERENT quantity from the atlas's image-measured
`center_edge_ratio`** (which counts *all* ink including streets and ticks); the built one counts
**built-body area only**. Both definitions are stated wherever either is used.

**THE SAME LAW, RESTATED FOR THREE MORE CASES A BUILDER WILL MEET:**

| statistic | census? | generator input? |
|---|---|---|
| `radialDensityFalloff` | ✅ yes, with per-morphology detection bands | ⛔ **NEVER** |
| street **width class** | ✅ yes | ⛔ **NEVER as a source** — width **quantises a derived graph load** (§250.6c) |
| **junction mix / φ / dead-end / elongation** | ✅ yes, per leaf | ⛔ **never scaled by tier** (§3.1) |
| **aesthetic bands** | ✅ yes, against the strongest cohort | ⛔ **never re-derived from the corpus MEDIAN** (§244.4) |

### §3.3 · DETERMINISM AND IDENTITY — the non-negotiables

**These are ground, not risk (§161j): "BY-NATURE owner gates, DETERMINISM, THE PROMISE and §8
coherence are ground, not risk."** The map decision rule says implementation risk is never a
veto — *a harder-but-truer mechanism wins* — **and these four are outside that grant.**

1. ⭐⭐ **`keyedRandom` OVER STABLE LINEAGE IDS, NEVER A STREAM POSITION.** Every draw goes
   through `fabricForkKey` / `keyedRandom(seed, …, {variant})`. **A stream draw couples every
   entity to every other; a hash of the entity key does not** — which is what makes §161h's
   inertia law **arithmetically true rather than asserted**. ⭐ **PRIOR-ART independently
   confirms the primitive (§253.3a):** FMG's "unround" dither is *a perturbation built from
   STABLE ENTITY IDS that consumes NO PRNG STATE*, and it is ranked their #1 transferable idea.
   ⚠ **THE RATCHET IS FROZEN EXACTLY** at `snapshot.js: 1, substrate.js: 4`, with
   `buildFabric.js` asserted **ABSENT**; a hand-minted key is a defect by construction. ⚠
   `substrate.js` still composes its own root as `${seed}::substrate::variant:N` — **a second
   SPELLING of the salt; the salt IS there, and converting it moves every leaf for no measured
   defect.** Recorded as a duplicated-rule hazard, not cured.
2. ⭐⭐ **PER-EPOCH KEYED STREAMS.** `wall.epoch.k` replaces one stream walked in ring order.
   **One stream in ring order means adding a later circuit RE-ROLLS every gate of an earlier
   one** — and the outer ring is traced FIRST, so the earlier epoch is exactly what would move.
   **This is what makes an epoch boundary an INERTIA SEAM rather than a re-roll.**
3. ⭐⭐ **NO PLATFORM-VARIANT MATH.** The purity scan bans `Math.random`, `Date`,
   `localeCompare`, `Math.pow` and all trig, **enforced across 45 files with comments stripped,
   and it reads NONE.** ⚠ **THAT SCAN IS WHAT MAKES CROSS-ENGINE AGREEMENT PLAUSIBLE — AN
   ENFORCEMENT BY SCAN, NOT A PROOF BY EXECUTION.**
4. **FIXED-PRECISION TOPOLOGY.** Two quanta with **one home** in `fabricGeometry.js`:
   **`r2` (PAINT, 2 dp)** — what the lens strokes; nothing legal is decided from it — and
   **`q6` (TOPOLOGY, 6 dp)** applied **at the moment of serialization**, so *"did this geometry
   change"* has **one answer rather than a per-caller float tolerance**. ⚠ **THE QUANTUM IS A
   SERIALIZATION RULE, NOT A STORAGE RULE**: geometry is still carried as float and every law
   still decides on floats. Quantizing the **stored** legality geometry moves every pixel and
   owes its own equivalence proof — **not done, handed off.**
5. **BYTE-EXACT SAME-SEED OUTPUT.** 10 cross-process runs → **one digest**
   (`87da9c41…`). **CONFIRMED.**
6. **CROSS-ENGINE.** Four V8 execution modes — default (TurboFan), `--jitless` (**no JIT at
   all**), `--no-opt` (baseline tier only), and a third tiering profile — produce **ONE digest**.
   ⛔⛔ **WHAT IT DOES NOT PROVE, STATED SO IT IS NEVER READ AS MORE: one V8, one libm, one
   machine, one architecture. It says nothing about SpiderMonkey or JavaScriptCore, nothing about
   ARM vs x86, nothing about a browser.** ⚠ The **driver table** is the deliverable: adding
   `bun`, `deno` or a headless browser is **one row**, and a driver that cannot run is reported
   and exits non-zero rather than passing quietly.
7. ⭐ **THE INERTIA LAW AT FABRIC SCALE, WITH ITS UNIT NAMED (J-B8-12): THE UNIT OF INERTIA IS
   THE BLOCK, NOT THE PLOT** — a burgage row is cut **as a row**. The pin asserts **three**
   things where it once asserted one: the absolute reach, **the MEDIAN changed body moves less
   than half a frontage**, and **fewer than 12% of the fabric changes at all.** Measured:
   **967 parcels byte-identical, 44 changed, centre movement p50 0.39 · p90 2.30 · max 4.38
   units.** ⭐ *A town where every body drifted just under the old cap passed the old pin and
   fails this one.*
8. **THE ONE-DECIDER RULE.** Where the landed model asserts a fact (`meta.hasWalls`), the fabric
   does not overrule it. Refusing a circuit the model asserts would break the rule this program
   is built on (J-A2-4).
9. ⭐⭐ **ONE PREDICATE, ONE HOME — AND A CHECK THAT FAILS WHEN TWO MODULES ASK THE SAME
   GEOMETRIC QUESTION DIFFERENTLY.** §238 gave *one artifact, one accessor, one proven
   predicate*; §241.5a moved handle enforcement to the **publication point** rather than a
   read-site scan. **This extends both, and it is the fourth recurrence of the class that has
   already cost two waves:** a geometric question gets **one exported predicate**, consumers may
   not re-spell it, and the guard sits where the predicate is *published*. ⛔ **A cured predicate
   with a private second spelling in a sibling module is indistinguishable from an uncured one at
   the census** — measured cost, today: **72% of street-over-water violations unexemptable by
   construction** (§4.1a). ⚠ **And its cheapest instance is an idiom: `a || b` is "a, AND b IS
   DEAD CODE" whenever `a` is reliably truthy — a fallback that never falls back.**

### §3.4 · THE STANDING CRITIQUE — twelve priors NOT to emulate (ATLAS §2.4 + PLAN §10.6)

**These are ⟦FOLD §264⟧ THE IMAGE MODEL'S OWN PRIORS AND ITS OWN DRAWING DEFECTS, found IN the
corpus** — not a procedural generator's, because none drew these plates (§0.2a, §261.1). **They are
not laws to follow, and several have already bitten us.**

1. **Concentric / polygonal town shape on flat ground** — planned geometry needs a planning
   authority in the facts.
2. **Radial sunburst field parcels** — orientation *toward* the village is law; terrain-blind
   symmetry is banned (§16.2).
3. **Default river bisection** — the corpus itself refutes it: THROUGH is only 12%.
4. **Empty blocks / block-wash LOD** — block outlines with no fabric inside. ⚠ **The op budget
   will tempt us into exactly this**, and it destroys the study layer at glance range. *(This is
   why the LOD mass's `unitLines` are load-bearing, not decoration: a lane that drops them
   hollows the fabric.)*
5. **Oblique / pictorial projection on the plan leaf** — the Plan is the flagship.
6. **Machine-perfect regularity in planned quarters** — **regularity is a DIAL, never a
   lattice.** Add ±10–20% jitter, and φ's 0.8 ceiling enforces it. ⭐ *And `plannedOccupancy`
   removes this defect by CONSTRUCTION rather than by jitter.*
7. ⭐⭐ **EVEN SPACING OF REPEATED ELEMENTS — towers, crenellations, contour hachures, tent rows,
   tree ticks. THE STRONGEST "GENERATED" TELL IN THE CORPUS.** Every repeated element needs
   seeded spacing variance. (§214 bans it by name; hf36's *irregularly* spaced hedgerow trees are
   the counter-example.)
   ⟦FOLD §264⟧ ⭐⭐ **RE-READ, NOT REPEALED (§259.3): NEVER PLACE BY SPACING — PLACE BY STRUCTURE,
   AND LET THE SPACING BE WHATEVER THE STRUCTURE GIVES.** Prior art produces the corpus's own
   even-looking tower rhythm **with no spacing rule at all** — towers sit at every non-gate wall
   corner and the evenness is inherited from what is inside the wall. ⭐ **EVENNESS THAT EMERGES IS
   AUTHENTIC; EVENNESS THAT IS DIALLED IS THE TELL** — and *seeded spacing variance* is still a dial,
   just a noisier one. **The cure for a repeated element is to give it a structural cause (a corner,
   a run boundary, a parcel edge) and stop choosing its interval.** See S13's ⟦FOLD §264⟧ block —
   ⛔ **and note the mechanism is UNGATEABLE until G-40's tower-spacing instrument exists**, so this
   prior is currently enforced by eye at the very point it matters most.
8. **Thinning the whole ink hierarchy to express a state.** ⭐ **State marks must be ADDED
   GEOMETRY IN THE SAME INK FAMILY. Famine is drawn by subtracting ACCENTS, never by lightening
   the fabric** — hf57 measures ink L 37.9, **FULL INK**, and is the corpus's own counter-example.
9. **Uniform grain across a whole settlement.** The synthetic corpus strongly prefers
   within-settlement grain contrast, but it does not prove a rich/poor causal split. Contrast must
   follow dated frontage/parcel projects, occupation and registered mechanisms—not a wealth label.
10. **Symmetric two-bank development on a THROUGH river** — one bank always builds first.
11. **Clean categorical district boundaries.** The visual corpus prefers transitions across
    several blocks, but its 2–3-block figure is a projection target, not a historical wealth law.
    Parcel-level variation may render a canonical transition; it may not manufacture one.
12. **Corrupt / decorative lettering** — **our labels are TRUE. This is a competitive win, not a
    style to copy.**

**PLUS THREE PLAN-LEVEL ADDITIONS (PLAN §10.6):** the **polygon circuit with evenly-beaded
towers** (a *plan* defect, not a decoration one — it deformed at least eleven plates and survived
three corpus rounds) · **the radial-wheel prior in new habitats** (it re-appeared underground and
in an industrial layout after being suppressed in town plans — ⭐ **NEVER ARRANGE A FEATURE CLASS
"AROUND" A POINT**; galleries must chase something — a seam, a street, a water table — never
radiate) · **bilateral symmetry in compositions** (symmetry is as strong a generated tell in plan
as even spacing is in ornament).

### §3.5 · ⭐ ANOMALY IS A COLLISION, NOT A JITTER BUDGET (PLAN §9)

**The brief asked what generative mechanism produces a memorable anomaly without randomness. The
corpus's answer: EVERY GOOD ANOMALY IS A COLLISION BETWEEN TWO RULE SYSTEMS — never a
perturbation.** The camp grid that frays at exactly two gates (a planned epoch's edge meeting an
organic epoch's growth pressure at the points of highest traffic) · a rigid grid at a frank angle
to the old town with a burnt zone between them (a replanning event bounded by a fire's *actual*
footprint) · a curving green ribbon of long thin gardens through solid fabric (a filled ditch —
a defensive form surviving into a horticultural land use) · **two of everything** (two
jurisdictions sharing one crossing) · a market place inside a roofless basilica · a wall around
fields (high-water extent meeting a shrunken population) · a market place larger than the town
needs (planned capacity meeting actual population).

⭐⭐ **NONE OF THESE NEEDS A RANDOM NUMBER. Every one is deterministic given two facts already in
a dossier.**

**THE MECHANISM: let rule systems COLLIDE WITHOUT ARBITRATION** — (i) allow two organisms of the
same type to coexist when the facts support two; (ii) let an epoch boundary sit where a
**historical event's footprint** was, rather than on a tidy offset; (iii) **refuse to smooth the
seam where two bearing bases meet.**

⚠ **AND THE ONE MISSING INPUT IS NAMED AND OWNER-GATED: EVENTS DO NOT CARRY A SPATIAL FOOTPRINT.**
A fire, a sack, a flood or a landslide is a fact *about* a settlement, not a shape *on* it — yet
five plates derive their entire character from the **shape** of what happened to them.
`eventFootprint` — a derived, deterministic region seeded from the event's own identity plus
terrain, stable under the inertia law — is the mechanism that would let one dossier fact ("the
town burned in year 214") produce an entire composition. ⛔ **It touches the event/persistence
surface, which is owner-gated. PLAN flagged it and did not design it, and this specification does
the same.** See gap **G-11** and Appendix B.

### ⟦FOLD §264⟧ §3.6 · ⭐⭐ THE SUBSTITUTION REGISTER — EVERY PLACE A MECHANISM SUPERSEDES A LAW'S STATED EXECUTION (§258.2)

**§258.2 is binding on every lane and this document had no home for it.** The owner has ruled that
he is married to the **concept and intent** behind the laws far more than to their specific
execution, and that **a mechanism achieving a law's intent better than the stated execution
SUPERSEDES the stated execution.** The safeguard is **the record, not a veto in advance**, so every
substitution is written in one fixed form:

> **Law X's INTENT preserved · execution changed from A to B · measurable signature Y unchanged (or
> improved).**

⛔⛔ **A SUBSTITUTION THAT CANNOT NAME THE PRESERVED SIGNATURE IS NOT A SUBSTITUTION — IT IS A QUIET
REPEAL, AND IT IS FORBIDDEN.** This register is the whole list; **anything not here has not been
substituted**, and a later lane that changes a law's execution must add a row before it lands.

| # | law | INTENT preserved | execution changed FROM → TO | ⭐ measurable signature, unchanged or improved | status |
|---|---|---|---|---|---|
| **SUB-1** | §239.2 / the wide-main-street laws — **street hierarchy must be legible** | importance is readable at a glance without a label | *stroke a wider line* → ⭐ **per-edge SETBACKS chosen by what the edge faces**; visible width is the sum of two facing setbacks | §2.5 scanline **p97/p50 organic 16–30**; widest channel p99 **2.7–6.4 plot-widths**; §2.4 distance-transform hierarchy **1.79–3.32–7.30** | ⭐ **ADOPTED at §258.3(a).** Bonus: §239's wall-side street **falls out for free** instead of being special-cased |
| **SUB-2** | §246 / S10's plot-series intent — **organic plot geometry** | the plot series stays an irregular, believable comb | *recurse until the piece IS the building* → ⭐ **recurse to the PLOT, then FIT a footprint from a rectilinear vocabulary** | §2.5 burgage geometry **depth:width 4–6:1**, building **30–45% of plot depth**, touching the street line, widths ±20–40% never exact; §2.4 **block solidity 0.60–0.86** and **elongation 1.6–3.0**. ⟦FOLD §297/§298⟧ **AND THE §4.1c LEGS, NAMED IN THE ROW AS §263.3c REQUIRES:** `block_solidity_p50` (corpus median **0.748**) · `block_elongation_p50/p90` (median **2.14**, band 1.6–3.0) · `orientation_order_phi` (whole settlement 0.044–**0.103**–0.433) · `orientation_entropy`. ⚠ **Every named leg is BLOCK-scale. The triangular-remnant claim is FOOTPRINT-scale, and no footprint-shape metric exists in the measured register — that is §4.1c arm 2 / G-40(iii), unbuilt.** So the row's signature is **complete at block scale and PENDING at footprint scale**; the footprint half may not be graded until G-40(iii) reads a number | ⭐ **ADOPTED at §263.4.** Our aspect constraint becomes a **HARD FILTER**; the wedge becomes unrepresentable rather than caught |
| **SUB-3** | ATLAS banned prior #7 — **repeated elements must not read as machine-set** | the "generated" tell is removed | *seeded spacing VARIANCE on an interval we choose* → ⭐ **place by STRUCTURE (the corners that exist) and never choose an interval at all** | ⛔ **NO SIGNATURE EXISTS YET — G-40's tower-spacing instrument** (spacing CV along the circuit; towers per unit length) | ⚠⚠ **PROVISIONAL AND HELD.** §258.2's own rule forbids a substitution that cannot name its signature, so **this one is recorded as PENDING and may not land before W0 builds the instrument** |

⛔⛔ ⟦FOLD §297/§298⟧ **TWO ADDITIONS TO THE REGISTER'S OWN LAW, BOTH NOW BINDING (§293.5a).**
**(1) A SUBSTITUTION'S NAMED SIGNATURE MUST BE A METRIC THAT EXISTS IN THE MEASURED REGISTER** —
not a metric that ought to exist, and not a metric at a different scale from the claim. *(SUB-3 is
held for exactly this reason; SUB-2's footprint-scale half is PENDING for the same reason, stated
in its row.)* **(2) EVERY SUBSTITUTION IS COUNTERSIGNED BY THE CHAIR AT COLLECTION — LANE
SELF-CERTIFICATION ALONE IS INSUFFICIENT.** This closes the named-but-*wrong*-signature hole: a
lane can name a real metric that does not in fact witness the intent it claims to preserve, and no
mechanical check catches that. **Whether a signature is the RIGHT one is a judgment call, which is
why it is the chair's.** ⚠ *A row that lands without a countersignature is a quiet repeal by
another route.*

⭐ **SUB-3 is the register earning its keep on its first use.** The mechanism is well-argued, two
independent products agree on it, and it still cannot be *substituted* under §258.2 because the
preserved signature has no number behind it. **That is the doctrine catching a good idea before it
becomes an unmeasured habit — which is exactly the failure §263.6a named.**

⚠ **AND THE GUARD THAT KEEPS THIS FROM BECOMING DRIFT (§258.4):** a substitution must still satisfy
§256's precedence (mechanism may come from prior art; **the LOOK comes from the corpus; the CAUSE
comes from the dossier**) and §246's derivation-home test. **Intent-over-execution licenses better
machinery — never a free parameter, never a borrowed aesthetic, and never the loss of a law's
measurable signature.**

### ⟦FOLD §275⟧ §3.7 · TWO DOCTRINE ADDITIONS — EVIDENCE-GRADED LAWS, AND EXPLAINED IRREGULARITY

**LAW GRADES (§275.4).** Every causal law and mechanism row in this document, and every future
one, carries an evidence grade beside its derivation home:

| Grade | Meaning | Generator treatment |
|---|---|---|
| **A** | Documented-causal — historical/archaeological evidence, or our own executed measurement, explicitly links cause and spatial effect | May drive a hard or strong conditional rule |
| **B** | Comparative association — a recurring measured relationship without unique causation | Calibration and soft scoring, never deterministic placement |
| **C** | Plausible inference — the mechanism makes sense and is consistent, but is undemonstrated for our contexts | Probabilistic, confidence stated, promoted only by measurement |
| **D** | Visual convention — genre expectation with weak historical support | ⛔ **BARRED from the causal model.** Renderer-only, small scales, and honest about being style |

The grades map onto the standing labels — A is CONFIRMED-causal, B/C are PLAUSIBLE with a stated
basis — and the operational rule is the same as §246's: **a Grade-D "rule" in the pipeline is
decoration wearing a law's clothes.** "Medieval streets wiggle randomly" is the canonical D.

**EXPLAINED IRREGULARITY OVER UNEXPLAINED NOISE (§275.4, generalising the truth-anchor and
named-exemption practice).** When a soft rule is violated and the violation is KEPT, it carries a
structured explanation record — `{ expected, observed, explanation, source }` — and the census
exempts **by explanation object, never by feature name** (§238's semantic-exemption law). The
parish church's six landlocked bodies (§274) are the founding instance. Two consequences:
a kept violation with a recorded story is a FEATURE (it is what history looks like); a kept
violation without one is a DEFECT no matter how organic it reads. And the repair direction
inverts: where a generator would force the merchant back toward the optimal street, ours may
keep the compound on the low-centrality lane **because the record says the family predates the
market's relocation** — which is more historical than the optimum. ⚠ The guard: explanations are
DERIVED from dossier facts and generation events, never authored free-text — an explanation with
no derivation home is itself decoration.

---

## §4 · THE GAP LEDGER, RANKED BY LEVERAGE

**Every MISSING or PARTIAL mechanism from all three studies, the FMG cross-check and the four
build receipts, in one ordered list.** `G-n` is a **stable identifier, not a rank** — the RANK
column carries the ordering, so a row can be re-ranked without renumbering the program.

**Ranking basis:** (breadth — how many stages, traces and plates it touches) × (how many other
mechanisms unblock behind it) × (cheapness). Where two studies ranked the same item differently,
both ranks are quoted in the row.

⚠ **A ROW'S RANK IS NOT ITS WAVE.** Dependencies re-order the build; §5 does that. A high-rank
item that is BLOCKED lands after the thing it is blocked on, however valuable it is.

### ⟦FOLD §264⟧ §4.0 · THE RE-RANK — WHAT MOVED, WHAT DID NOT, AND ONE DISAMBIGUATION

**The ledger grew from 33 rows to 42** (41 ranked + G-33, which is housekeeping and carries no
rank). **Nine rows are new**, all marked ⟦NEW⟧: **G-35** the dependency graph · **G-36**
priority-ordered growth · **G-37** fit-the-footprint · **G-38** the four-axis parameterisation ·
**G-39** the chaos/orthogonality test · **G-40** the three missing instruments · **G-41** the
prior-art tail · **G-42** fabric epochs — **and G-1, the region.**

⚠⚠ ⭐ **G-1 IS NOT A FOLD ITEM. IT IS A HOLE THIS FOLD FELL INTO, AND IT IS RECORDED LOUDLY BECAUSE
NOBODY HAD NAMED IT: THE REGION HAD NO LEDGER ROW AT ALL.** `G-1` was cited as a blocking node by
**§4.3's edge graph**, by **§1.2a**'s disposition of FMG's `hub` parameter, by **G-21**'s and
**G-23**'s *depends-on* columns and by **W5**'s contents — while the ranked list ran
`G-2, G-3, G-4…` and skipped it. **A dependency edge pointing at a row that does not exist is the
address-rot class in its purest form**, and the ledger's own opening sentence claims to hold *every*
MISSING or PARTIAL mechanism. ⭐ **Entered at rank 9** — CONTEXT ranks the missing region **#3 by
breadth (5 of 8 traces)**, which puts it below the §240-bound trio (G-3 · G-8 · G-42) and above
everything CONTEXT ranked beneath it. **No wave moves: W5 already owned the work.**

⭐⭐ **AND THE CHECKABLE CLAIM THAT MATTERS MOST, BECAUSE IT IS WHY §5's WAVE ORDER SURVIVES THE
RE-RANK INTACT: NOT ONE PRE-EXISTING ROW CHANGED POSITION *RELATIVE TO ANY OTHER PRE-EXISTING ROW*.
The eight new rows were interleaved; nothing was re-ordered.** The renumbering was executed
mechanically rather than hand-keyed, and the invariant was asserted by the same run
(`MFSPEC2-rerank.py`, quoted in `laneMFSPEC2-receipt.md`):

```
PRE-EXISTING ROWS, OLD ORDER : G-2 G-7 G-34 G-3 G-8 G-9 G-13 G-10 G-14 G-15 G-16 G-12 G-6 …
PRE-EXISTING ROWS, NEW ORDER : G-2 G-7 G-34 G-3 G-8 G-9 G-13 G-10 G-14 G-15 G-16 G-12 G-6 …
RELATIVE ORDER PRESERVED     : True
```

⚠ **ONE DISAMBIGUATION, TAKEN AS A JUDGMENT CALL AND VETOABLE, BECAUSE TWO READINGS OF "#1" ARE
AVAILABLE AND THEY LEAD TO DIFFERENT BUILDS.** §263.3 rules the dependency graph *"THE BEST
MECHANISM IN EITHER PRIOR-ART STUDY, **RANKED #1** AND ADOPTED AS APPROACH."* **Read literally as a
gap-ledger rank it would displace G-2, the terrain substrate — and with it W1, the wave every
terrain-shaped mechanism is stalled behind.** ⭐ **Read against its own source sentence it is
unambiguous: "#1" is its rank among PRIOR-ART ADOPTIONS**, which is the ranking FTG §12.1 publishes
and the one §263.3 is quoting. **This document adopts the second reading**, places G-35 at gap-ledger
rank **12** on this ledger's own stated basis (breadth × unblocking × cheapness), and marks it
**#1 of all prior-art adoptions** in its row and throughout §4.1b. *If the chair intended the
literal reading, G-35 moves to 1, G-2 to 2, and W6's roster work moves ahead of W1's substrate —
say so and it moves.*

⭐ **WHY 12 IS THE RANK IT EARNS HERE, STATED SO THE PLACEMENT IS ARGUABLE RATHER THAN ASSERTED:**
it sits immediately **above G-13**, because *what exists* is upstream of *where it goes*; it is
below **G-2/G-7/G-34** because those unblock a ruled law, a stage and the census family
respectively; and it is below **G-3/G-8/G-42/G-1/G-9** because those are bound to §240 or hold the
region every road rank depends on. ⚠ **Its rank understates its VALUE and overstates nothing about
its urgency — which is precisely the distinction the RANK-is-not-WAVE rule exists to keep.**

### §4.1 · THE LEDGER

| rank | id | mechanism | derivation home (the dossier fact that drives it) | blast radius | depends on / blocks |
|---|---|---|---|---|---|
| **1** | **G-2** | ⛔ **TERRAIN SUBSTRATE** — a relief FIELD with gradient, aspect, land-form class and a `buildable` refusal mask, replacing the `RELIEF 0.30` scalar | seed + `config.terrainType` + `resources` + water facts (§161a) | **CONTEXT ranks it #1: 6 of 8 traces.** Unblocks CX-02, CX-03, CX-04, CX-19, CX-21 and **2 of the 9 wall-run types** | ⛔ **BLOCKS §214's TERRAIN ARM (§251.4a) · blocks G-4 · blocks the slope grammars · aspect arm is NOT-DERIVABLE (Appendix A)** |
| **2** | **G-7** | ⛔ **FRONTAGE-FIRST GENERATION + explicit plot/frontage lineage and typed split/amalgamation operations** | block face from the street graph; declared plan/holding module; inherited frontage/parcel geometry; dated `SPLIT`, `AMALGAMATION` and corner/function facts. ⛔ Tier, current wealth and age do not set numeric module widths or mutation rates | ⭐ **PLAN's #1 and ATLAS's SCOPE-1 converge on the software order, while §10.21 supplies the historical evidence boundary.** Most settlement plates require the relation; frequencies and dimensions remain cohort-gated | needs S8's block faces. **Unlocks block silhouette and backland/court classification only from canonical parcels and occupation, never as synthetic side effects** |
| **3** | **G-34** | ⛔⛔ **ONE PREDICATE, ONE HOME — AND A CHECK THAT FAILS WHEN TWO MODULES ASK THE SAME GEOMETRIC QUESTION DIFFERENTLY.** Unify `deriveBridges`' crossing predicate with §205A's cured one; rule on `rank === 'passage'`; replace first-crossing-per-channel with `covered === inside` | none — it is an enforcement mechanism, not a derivation | ⛔ **92 of 127 street-over-water violations (72%) CANNOT BE EXEMPTED BY CONSTRUCTION.** Unblocks most of G-28's §205A residual | ⭐ **THE §238 PREDICATE CLASS RECURRING FOR THE FOURTH TIME, AND ITS SHAPE IS NEW — see §4.1a.** Cheap; needs a **ruling** more than a lane |
| **4** | ⟦NEW⟧ **G-37** | ⭐⭐ **FIT THE FOOTPRINT FROM A RECTILINEAR VOCABULARY INSTEAD OF SUBDIVIDING UNTIL THE PIECE *IS* THE BUILDING** — subdivide to get the **PLOT**, then **FIT**; our aspect-ratio constraint becomes a **HARD FILTER**, not a tendency | building **kind** × district **lifestyle** (both dossier facts); the vocabulary itself is supplied per material by **G-6** | every footprint on every leaf at town+ and many below. ⭐ **The cleanest leg (c) in the fold**: §2.5's alley/sliver floor is **0.02–0.08** and b8 reads **0.16/0.09/0.09** — *the town moved the WRONG way* — and that is exactly the quantity this mechanism moves | ⭐ **A §258.2 SUBSTITUTION (SUB-2, §263.4).** Needs **G-7**'s plot series to fit into. **Supersedes** WATABOU §5.2's *modulations + an aspect filter* — the stronger option is **not to produce the wedge** |
| **5** | ⟦NEW⟧ **G-40** | ⛔⛔ **THE THREE MISSING INSTRUMENTS** — (i) **tower spacing** (spacing CV along the circuit + towers per unit circuit length); (ii) **per-epoch material / tone contrast** (a between-region fill-tone separation, not a whole-plate statistic); (iii) ⟦lane finding⟧ **footprint-scale rectangularity**, absent from the entire register | none — they are **measurements**, not derivations | ⛔ **each one GATES a ranked mechanism**: (i) S13's tower-corner rule, §3.4 #7's re-read and **SUB-3**; (ii) per-epoch material, which sits in §4.1b's ungated list until it reads; (iii) **half of G-39** | ⭐ **§263.6a ORDERED (i) AND (ii) BUILT; (iii) IS THIS LANE'S ADDITION AND IS VETOABLE.** Cheap, and **all three land in W0**. ⚠⚠ *Two prior-art products now agree on the tower mechanism while we still cannot check it against a number — which is exactly the condition that lets a plausible idea become an unmeasured habit* |
| **6** | **G-3** | ⛔ **THE CIRCUIT AS A CHAIN OF TYPED RUNS (nine types, each with a cause)** + per-run tower policy | substrate + `institutions` + §240 epoch index + fabric extent + `history` fortification events | **CONTEXT #2: every walled trace (4/8).** Unblocks CX-14, CX-16, CX-18, CX-19, CX-20 | ⛔⛔ **§251.4b RULED: §240 AND THE RUN CHAIN ARE ONE PIECE OF WORK AND LAND TOGETHER.** Three rings without run typing come out CONCENTRIC. Blocks §252.3a's metropolis third circuit |
| **7** | **G-8** | ⛔ **TYPED SUPERSESSION OF A CIRCUIT OR WORK** — retained wall, converted route, frontage break, reused tower, filled ditch, garden, quarrying or removal are distinct dated operations | actual supersession/demolition/reuse events and preserved lineage; no land-pressure or prosperity fallback | every canonical multi-circuit or demotion history. Atlas cases establish possibilities, not a universal transition ladder or rate | ⛔ a new project must not erase predecessor identity. If the successor operation is absent, preserve known state/`UNKNOWN`; do not synthesize a fossil |
| **8** | ⟦NEW⟧ **G-42** | ⛔⛔ **EPOCHS ARE FABRIC/OPERATION PHASES, NOT CIRCUIT EPOCHS** — a wall is a dated project within the sequence rather than its definition | explicit dated plan, occupation, route, growth, fortification, destruction, reuse and rebuilding operations. ⛔ Derived from canon, never a knob; synthetic `≤4` is a representation observation, not a historical ceiling | every settlement with more than one registered phase, including unwalled cases | ⭐⭐ **PRECEDES G-9.** `epochAxis.js` must stop minting history from circuit count and materialise the canonical operation sequence instead |
| **9** | ⟦NEW⟧ **G-1** | ⛔ **THE REGION AS AN OPTIONAL CANONICAL SPATIAL ARTIFACT** — known neighbour positions, ranked route edges, hydrology and catchments materialised before local fabric | §10.19 accessors only. Neighbours may lack bearings/distances; `tradeRouteAccess` does not create route geometry; missing flows/counterparties remain absent | Unblocks only claims backed by the supplied artifact: siting, typed route/circuit intersections, route loads and known extramural projects | ──BLOCKS──▶ **G-21/G-23/G-36/G-3** only when their required facts exist. No seeded bearing, causal corridor, road furniture or day's-travel rule is a fallback |
| **10** | **G-9** | ⛔ **THE EPOCH MATERIALISER** — per-phase grain, bearing basis, attachment relation and plan intent/realisation are read from canonical operations | explicit plan/route/parcel/subdivision/occupation history; `plannedOccupancy` is an evidenced plan-realisation state, never years-since-founding × prosperity or lawfulness | every registered multi-phase fabric | needs S5/G-42. Visual magnitudes remain uncalibrated until eligible historical cohorts promote them |
| **11** | ⟦NEW⟧ **G-38** | ⭐⭐ **ONE SUBDIVISION ROUTINE WITH FOUR EXPLICIT PARAMETERS** — size floor · grid deviation · size variation · represented emptiness. ⛔ **No per-district generators** | values come from canonical plan/holding module, substrate/inherited boundaries, mixed function and occupation/representation state. Wealth, lawfulness and age are not morphology knobs | every populated district; the software surface is shared with G-9, but each value carries provenance | ⚠⚠ **STRUCTURAL:** land the parameter surface with W3. Historical mappings/magnitudes require promoted evidence; synthetic metrics remain projection/evaluation targets, never causes |
| **12** | ⟦NEW⟧ **G-35** | ⭐⭐⭐ **A CANONICAL RESOURCE/SERVICE DEPENDENCY GRAPH** — only declared nodes, denominated edges and accessors are materialised | explicit resource, production, demand, trade, route and institution edges. No generated `supplyChains` field is guaranteed; an importer requires canonical demand plus a trade edge and cannot be invented when local production fails | answers what exists only where the world supplies those facts; otherwise the stage returns missing-flow refusal | Structurally anti-decoration. It does **not** source rural land or landmarks. Visual landmark bands are QA only, never roster input; unlicensed prior-art nodes/ratios remain refused |
| **13** | **G-13** | ⛔ **INSTITUTION SITING AS AN EXPLICIT RELATIONAL SYSTEM** — function, jurisdiction, property, access and prohibited adjacency facts constrain placement | canonical institutions plus explicit relation/access/land-right facts and the known void/circuit state | every institution with a spatial disposition; no name-regex, culture token, default ring, custodian dwelling or automatic quarter/doubling fact | Negative predicates are useful only when historically/canonically typed. Unknown relations remain `UNSITED`/`STRUCTURAL_ONLY`; rural relations additionally require §10.23 support |
| **14** | **G-10** | ⛔ **JUNCTION-MIX DISCIPLINE** — attachment-not-intersection software, φ/read-back metrics and degree safety | canonical route topology, plan intent and dated route operations; no X budget is selected from lawfulness or founding type before promotion | all street graphs | ⛔ Synthetic mix/φ bands are visual detectors. They may convict an all-X failure but cannot author historical topology |
| **15** | ⟦NEW⟧ **G-36** | ⭐ **PRIORITY-ORDERED MATERIALISATION OF CANONICAL ROUTES**, plus degree-aware snap/lengthen cleanup | declared approach-route ranks, gates and institution origins/destinations. Without spatial route facts the queue has no seed and emits no invented historical ribbon | S7 and S15 where canonical ranked routes exist | The queue is reusable software, not a morphology prior. It may preserve unequal canonical extents; it may not create a centre-outward history because that looks plausible. Snap still refuses degree >4 |
| **16** | **G-14** | ⛔ **WATER AS A CANONICAL FLOW SYSTEM** — role, directed centreline, registered takes/works/discharges and their spatial relations | explicit hydrology and flow edges plus institutions/resources through §10.19. There is no guaranteed `supplyChains`; a domestic-water ladder or pollution chain requires its own evidence/canonical facts | every registered water work/flow; missing economic or domestic-water facts refuse | Build the typed system whole when known. River presence alone cannot invent a take, plume, muck gate or facility chain |
| **17** | **G-15** | ⛔ **THE COUNTRYSIDE, SPLIT HONESTLY:** an evidence-invariant `RuralLandscapePhase` owns typed land, rights, holdings, access, production, occupancy and change; T-24 ground primitives, T-23 route rungs and operation budgets are presentation vocabulary, not rural world facts | already-held terrain/hydrology/routes/resources/institutions plus **explicit typed rural facts**; missing regime/tenure/occupancy stays `UNKNOWN` or `STRUCTURAL_ONLY`. §16/§190c and the sandbox's binary/open-field constants are superseded hypotheses; the historical resolver is `RSLP-1`-gated (§10.23) | ⭐ **85%+ of a village or thorp plate**, and **§229.2c's NAMED LEVER for the census tiers' remaining grain miss.** Stable schema/topology/render techniques may land; regime selection, rates, furniture and historical meaning may not | **T-23 and T-24 remain one visual work item.** Known route-distance facts may place an explicitly registered roadside subject; absence of rural canon may not invent a road, common, farmstead, keeper or field system |
| **18** | **G-16** | ⛔ **THE PAINTED CLOSURE** — wash mis-registration, within-fill variation, path waver, per-stroke modulation, paper grain | none (a render mechanic) — but the **bands** come from the strongest cohort | **Every leaf, every lens.** b6 measures **0.00** on the two the eye reads first | ⭐ **Wash mis-registration is the ONE property that, if omitted, keeps the output reading as vector art no matter what else is done.** MF-A1's brief. ⚠ Must be **geometry or a tiled pattern**, never a raster filter |
| **19** | **G-12** | ⛔ **CURRENT PROSPERITY MUST NOT REWRITE INHERITED GEOMETRY** — only typed dated morphology operations may change grain, routes, parcels, occupation or backland | explicit plan/parcel/route/occupation facts and promoted dated operations; synthetic wealth-labelled correlations are research-only | every historically layered or socially described settlement | preserve lineage and causal receipts. Wealth may affect maintenance/material condition through its separate law, never act as a geometry shorthand |
| **20** | **G-6** | ⛔ **EUROPEAN-FANTASY FOOTPRINT GRAMMAR BY EVIDENCED MATERIAL SYSTEM** (packing rule, alley floor, party-wall behaviour and corner radius) + water-scarcity reorganisation | `resources` × `terrainType` × dated building function/phase; narrative `culture` is explicitly not a map-grammar input | **CONTEXT #4 supplies synthetic hypotheses only. §10.18/§10.21 supersede the old global setting-agnostic promise; AMP-1 must calibrate the bounded European mechanisms.** | ⚠ **A declared-shift event** — the mapping affects every footprint on every leaf. **Partly gated behind G-30's terrain vocabulary and AMP-1** |
| **21** | **G-18** | ⛔ **BLOCKS AS PLANAR FACES OF THE STREET GRAPH (§239.1)** + the three shape bands (elongation, solidity, area ratio) | none — **if the street graph is right, the blocks are right for free** | every leaf; the structural cause behind straddling districts and wall-band intrusions | needs G-10. ⭐ **The bands are also a DETECTOR: median-square high-solidity blocks convict a silent grow-then-clip** |
| **22** | **G-20** | ⛔ **A WALL-SIDE STREET AS A TYPED CIRCUIT/RIGHT-OF-WAY RELATION** + §200's census exemption keyed to the actual relation/run type | dated circuit project, retained access/intervallum/right-of-way and successor operations; no prosperity input | every circuit with a registered wall-side route | ⛔ a global ring road and an automatic prosperity-driven road are both forbidden. Exempt clearance only for the exact typed relation |
| **23** | **G-17** | ⛔ **HIGH-WATER MEMORY + TYPED CONTRACTION/REUSE:** `intramuralVacancy`, preserved boundary/route/parcel lineage and cause-specific dated operations; a shared `ghostInk` may render inherited geometry, but no universal four-step/LIFO removal sequence executes | high-water vs current occupation plus explicit abandonment, destruction, relocation, amalgamation, agricultural reuse, rebuilding or `UNKNOWN` evidence; terrain/resources constrain a recorded reuse but do not invent its cause | every high-water and demotion plate | ⭐ **§239.4 already RECORDS the dividend.** What occupies or erases the ground must come from typed history; “run growth backwards” remains a research candidate, never the fallback |
| **24** | **G-21** | ⛔ **STREET WIDTH FROM GRAPH LOAD** (betweenness over gates, market, quays, institutions) — the class ladder becomes the **quantiser**, not the source | `tradeRouteAccess` + the neighbour link + `institutions` + `tier` (class count) + `population` (absolute width) | every leaf; T-04's hierarchy depth | needs **G-1** for the gate weights. ⭐ **PRIOR-ART supplies the blueprint (reuse discount) and CONVERGES with §250.6c** |
| **25** | **G-19** | ⛔ **`backlandCore` AS A CANONICAL PARCEL/OCCUPATION OBJECT** + typed court/access classification | parcel lineage, frontage, access rights, occupation, function and dated change; no district-wealth, population-pressure or age fallback | every block with known parcel/backland state | a court is classified from actual access and occupation. Synthetic isolation bands are detectors only and do not mint backland or courts |
| **26** | ⟦NEW⟧ **G-39** | ⚠⚠ **THE CHAOS / ORTHOGONALITY TEST — A HYPOTHESIS ABOUT *OUR MUSH* THAT MUST BE MEASURED BEFORE IT DRIVES A REWORK.** The claim: chaos belongs at the LARGE scale (block frames meeting at organic angles) and orthogonality at the SMALL scale (the buildings inside them near-rectangular) | none — **it is a TEST, not a mechanism.** Its *outcome* would license changes to G-38's grid-chaos axis and G-37's vocabulary | ⛔ **§261.3 DOWNGRADED IT FROM A DESCRIPTION OF OUR TARGET TO A HYPOTHESIS ABOUT OUR DEFECT**, and it **must be tested against the corpus's own measured block elongation and plot variance before it drives a rework**. It was previously read as the diagnosis of why our output looks like mush | ⛔⛔ **BLOCKS any S7 / S10 / S11 rework justified on this basis.** ⚠ **Half-runnable today** — the full metric specification is §4.1c; the small-scale half needs **G-40(iii)** |
| **27** | **G-4** | ⛔ **THE BEARING TO WATER** — the direction of open water, not merely its presence | ⭐ **the S2 substrate's own geometry (§161a) — DERIVED, never minted** | every coastal and bankside leaf: district anchoring, the water-termination run, the second-bank rule, edge kind per bearing | **BLOCKED on G-2**, then it is **one vector**. ⚠ **Must never be conflated with wind/sun bearings, which are NOT derivable and stay in Appendix A** |
| **28** | **G-23** | ⛔ **TYPED EXTRAMURAL ROUTE/GATE/INSTITUTION PROJECTS** — each ribbon, suburb, roadside institution and noxious-use relation carries its own dated cause | canonical route ranks, circuit intersections, institution function/right and dated project | every recorded extramural development | unequal extents may be preserved but not synthesised as a default. The ≤2-gate, single-arc and distance ladders are uncalibrated hypotheses, not one lookup table |
| **29** | **G-22** | ⛔ **CENTRE TYPOLOGY (six kinds) + `secondAuthority ⇒ secondCentre` + market placement by arrival mode** | `institutions` + `powerStructure` (§161l) + `foundingKind` + event history | **CONTEXT #7 (markets); PLAN #9.** Multiplies voids; the strongest single "this is a working place" signal | ⭐ **We appear to have ONE square primitive against the corpus's six structurally distinct types** |
| **30** | ⟦NEW⟧ **G-41** | ⚠ **THE PRIOR-ART ADOPTION TAIL** — every remaining ADOPT-AS-APPROACH from both studies that is a **single rule or threshold rather than architecture**, itemised with its home stage, its gating metric and its wave in **§4.1b** | various — each row in §4.1b states its own | small individually; ⭐ **collectively they are a large part of why a shipping product's output reads as intentional** | ⚠ **§4.1b also carries the INTERESTING-BUT-UNGATED list** — mechanisms that fail leg (c) and therefore carry **no implementation claim and no rank**. ⛔ *Nothing may be promoted out of that list without an argument for (c), not merely a good feeling* |
| **31** | **G-24** | ⛔ **THE DISTRICT-LEGIBILITY CENSUS (GAP-H)** — render label-free and assert neighbour deltas | none (a census) | ⭐ **the acceptance test §8.4's glance layer actually needs** | band supplied by PLAN: **≥1.4× median block area OR ≥1.3× cells-across**. Needs G-9 and G-12 to have something to measure |
| **32** | **G-11** | ⛔ **`eventFootprint`** — a derived, deterministic spatial region for spatially-extended events | the event's own identity + terrain (stable under the inertia law) | **PLAN #6:** 3 of 8 traces; every stressor and aftermath plate | ⛔ **OWNER-GATED ADJACENCY — touches the event/persistence surface. PROPOSED, NOT ACTED ON.** ⭐ It is the mechanism behind most of the corpus's memorable anomalies |
| **33** | **G-25** | ⚠ **NAMED-ROSTER COMPLETENESS + REPRESENTATION QA** — all canonical notable subjects receive a disposition; projection checks whether they remain legible | canonical institution/subject roster plus representation ratio and lens | every leaf's glance layer | per-tier landmark counts and footprint ratios are visual bands only. They never decide what exists, suppress ordinary subjects or generate a roster |
| **34** | **G-5** | ⚠ **A DERIVATION HOME FOR POPULATION→EXTENT** | ⭐ **our own leaves, whose populations are FACTS** — 16 per tier, byte-deterministic, with published extents | §161f's high-water law; §5's tier table; the frontage ladder's town→city residual | ⛔ **UNRESTORABLE from the corpus (§249.4c).** External cross-check in §1.2c supports the SHAPE, **not the constant.** ⚠ **Touches the §5 tier table — B8 named it a chair question and did not take it** |
| **35** | **G-26** | ⚠ **CHROME RUNG (GAP-I) + the annotation-layer contract (T-26) + §161i's TRUE MEASURE** | `tier` × `prosperity` | the margins of every leaf | ⭐ trivial, and it makes the tier read even in the margins. ⚠ **§161i's true measure is NON-DEFERRABLE** |
| **36** | **G-27** | ⛔ **THE UNDERGROUND STRATUM (§13/§168)** — unbuilt, **twice deferred**, first-class in wave nine | `institutions` + the surface fabric | its own leaf family | ⭐ **`accessLaw.js` is ALREADY stratum-agnostic**, which is what makes it cheap. ⚠ **The ring prior re-appears in new habitats — galleries must CHASE something, never radiate** |
| **37** | **G-28** | ⚠ **THE RESIDUAL AND CARRIED-DEFECT SET** — see §4.2 | — | small individually, visible collectively | several are **owner-gated** |
| **38** | **G-29** | ⚠ **SPATIAL INDEXING + PER-CENSUS RUNTIME BUDGETS + indexed-vs-exhaustive equivalence pins** | none (infrastructure) | the census family's scalability; §220's performance gate | ⭐ **Handed off WHOLE with cause** (`laneMFARCH2-receipt.md` §9.1). ⚠ **A completeness status where "skipped due to scale" can NEVER read green.** §220 is **launch-blocking** (§247.3a) |
| **39** | **G-31** | ⛔ **RELOCATION AND SUPERSESSION OF POINT FEATURES** — moved settlements, stranded quays, superseded fords and markets | a relocation event + the terrain feature that failed | 2 traces; a striking and fully-derivable state | *lower priority than the epoch items and correctly last-but-one* |
| **40** | **G-32** | ⛔ **SEASONAL / CONDITIONAL SECOND NETWORKS** | `terrain` + water mode + the lens | ⭐ **makes the winter/wet lenses STRUCTURAL rather than a recolour** | none |
| **41** | **G-30** | ⛔ **TERRAIN VOCABULARY WIDTH** — 7 tokens against ~20 structurally distinct settings | ⭐ **itself — this IS a dossier fact** | ⛔ **the single upstream blocker for the whole morphotype program; everything in CONTEXT §7 is stalled behind it** | ⛔⛔ **OWNER-GATED (persistence shape). §251.5 raised it, NOT decided.** Lane recommends **composite `terrainModifiers`** over widening the enum, because the enum is what the gallery facets and the server RPC filter on. **Chair concurs with the shape; it is the owner's call.** |
| **—** | **G-33** | ⚠ **HOUSEKEEPING FROM THE CONFLICT SET** — re-pin `GRAIN_BAND`'s metropolis rung to 80–120 and re-derive `GRAIN_SEAMS` (**C-2**); label the thorp/hamlet rungs UNMEASURED (**C-3**); target paper warmth 37 (**C-1**) | — | one table, one constant, one colour | ⚠ **All three move output and must be DECLARED, never quiet.** Blocks nothing; **do it in the same wave as any grain work so one declaration covers it** |

### §4.1a · ⭐⭐ G-34 — A CURE THAT NEVER CROSSED A MODULE BOUNDARY

**This is the §238 predicate class recurring for the FOURTH time, and it is worth its own
sub-section because its shape is new and a builder will otherwise re-create it.**

**The first three recurrences were BLIND predicates** — a rule asking the wrong question
(vertices against a centreline; `rooted` counting dry corners; a comment saying AREA over code
counting corners). **This one is different: the predicate was CURED, correctly, and the cure
STOPPED AT A MODULE BOUNDARY while a sibling module kept asking the old question.**

**MEASURED (`laneMFW1-receipt.md` §6.1), and the arithmetic is the argument:**

| the mismatch | violations it makes permanently unexemptable |
|---|---|
| `deriveBridges` asks **`crossPoint`** (a true centreline intersection) while the cured §205A census asks **`segSegClosest < half`** (a band incursion) — ⭐ **MF-ARCH's segment-true cure never crossed the module boundary** | **72** |
| `deriveBridges` refuses `rank === 'passage'` while §205A **convicts** passages | **20** |
| `deriveBridges` takes the **FIRST** crossing per channel and `break`s, while the census demands `covered === inside` | **35** |
| **total** | ⛔ **92 of 127 street-over-water violations — 72% — cannot be exempted BY CONSTRUCTION** |

⚠⚠ ⟦FOLD §297/§298⟧ **AND THE ARITHMETIC OF THIS TABLE IS CORRECTED (§297.6 / §255).** The three
rows do **not** sum to 92 — 72 + 20 + 35 = **127**, the whole street-violation set, which is
impossible as a decomposition of a 92-member subset. ⭐ **THE CORRECT READING: 72 + 20 = 92 IS THE
UNEXEMPTABLE A+B CORE** — the predicate mismatch plus the `passage` refusal, and that is the figure
the 72% headline rests on. **The 35 first-crossing-per-channel class and the 6 dead-`anchorKey`
class are SEPARATE AND OVERLAPPING populations, not further addends** — a violation can be both a
predicate mismatch and an untaken second crossing. ⛔ **THE FULL DECOMPOSITION IS RE-DERIVED WHEN
G-34 IS BUILT** (MF-D0/W3), against the cured predicate, with the overlap published rather than
assumed away. Until then the only figure that may be quoted is **the A+B core, 92 of 127**; the
per-class counts are diagnostic, never additive.

⚠⚠ **THE CURE IS NOT TO CONVICT LESS.** It is to **decide whether a band incursion without a
centreline crossing is a crossing at all, and to say so IN ONE PLACE.** All three arms are the
same question — *which crossings the law intends to forgive* — and they must be ruled together.

#### ⟦FOLD §264⟧ ⭐⭐ AND THEY HAVE BEEN — **G-34 IS RULED (§262.2). THE RULING IN FULL.**

**MF-SPEC wrote that this needed a ruling more than a lane. §262.2 supplied it, and the governing
principle is this document's own sentence quoted back at it: ⭐⭐⭐ THE CURE IS NOT TO CONVICT
LESS.** ⟦FOLD §297/§298⟧ The 92 are the **A+B core (72 + 20)**; arms **(c)** and **(d)** below are
**separate and overlapping populations, not further addends** (§297.6 — the four counts sum to 133,
which is why they were never a partition), and the full decomposition is **re-derived when G-34 is
built**. Five causes are ruled, **and only ONE of them is a lawful exemption:**

| arm | count | ⭐ **RULED** |
|---|---|---|
| **(a) the predicate mismatch** — `deriveBridges` asks `crossPoint` against the centreline while the cured census asks `segSegClosest < half` | **72** | ⛔ **NOT AN EXEMPTION AT ALL — it is §255's boundary defect.** ⭐ **ONE PREDICATE, ONE HOME, exported and consumed by both, plus a check that REDS when a second module re-spells the same geometric question** |
| **(b) `rank === 'passage'` refused a bridge** | **20** | ⭐ **BUILD THE BRIDGE.** *A passage crossing water needs a CROSSING STRUCTURE, not forgiveness — a plank or a footbridge is a real thing a town builds.* At a passage-appropriate scale |
| **(c) only the FIRST crossing per channel is taken** (`break`) | **35** | ⭐ **FIX THE LOOP.** *A street that meets a meander twice needs TWO bridges* |
| **(d) the dead `anchorKey` path** — the marine regex's own word can never fire, so a bank-rooted watermill is convicted on its own river | **6** | ⭐ **A REAL DEFECT, and the cure is already proved: 165 → 159, subject set unchanged, PIXEL-FREE.** ⚠ **Its receipt is that it must RE-QUOTE THE RUN-1 PARCHMENT SHAs AS BYTE-IDENTICAL** |
| **(e) the coast-vs-river street arm** — a street running ALONG a shore | (the 775/555 class) | ⭐⭐ **THIS ONE IS THE LAWFUL EXEMPTION** — keyed to the water's **relationship to the segment** (bankside adjacency vs channel transit) and **NAMED IN THE CENSUS, never silently passed** |

> ⭐⭐⭐ **NET: THREE BUILD-FIXES, ONE BUG-FIX, ONE NAMED EXEMPTION. THE UNEXEMPTABLE SHARE MUST
> FALL BECAUSE THE TOWN GAINS THE CROSSINGS IT ALWAYS NEEDED — NEVER BECAUSE THE RULE GOT SOFTER.**
> (§262.2)

⭐ **AND ARM (e) HAS A GENERATION-SIDE HALF THAT LANDS IN THE SAME BREATH** — S4's ⟦FOLD §264⟧
road/water typed interaction (*bridge a river, terminate at an ocean*). **The census stops
convicting a shore road because the generator stops producing a road that pretends to cross.**
*Fixing a census and fixing the thing it measures are usually the same work seen from two ends.*

⭐⭐⭐ **THE STRUCTURAL REQUIREMENT THIS SPEC ADOPTS, AND IT IS THE ENFORCEMENT ANALOGUE OF
§253/§241.5a's RAW-HANDLE GUARD: ONE PREDICATE, ONE HOME, AND A CHECK THAT FAILS WHEN TWO MODULES
ASK THE SAME GEOMETRIC QUESTION DIFFERENTLY.** §238 established *one artifact, one accessor, one
proven predicate*; §241.5a moved handle enforcement from a read-site scan to the **publication
point** because a scan must solve aliasing and a publication guard need not. **The same move
applies here:** a geometric question gets **one exported predicate**, its consumers may not
re-spell it, and the guard sits where the predicate is *published* rather than where it is read.
**A cured predicate with a private second spelling in a sibling module is indistinguishable from
an uncured one at the census.**

⚠ **AND ONE MORE INSTANCE OF THE SAME FAMILY, ALREADY PROVED AND COSTED (`laneMFW1-receipt.md`
§5), belongs in the same ruling:** `leafCensus.js`'s marine exemption tests
`String(lm.archetype || lm.anchorKey || '')`, and **every landmark has an archetype**, so
`anchorKey` is **dead code** and the regex's own word `mill` can never fire — *a bank-rooted
watermill standing on its own river is convicted as an unlawful structure.* ⭐ **THE CLASS:
`a || b` READS AS "a, FALLING BACK TO b" AND IS IN FACT "a, AND b IS DEAD CODE" WHENEVER `a` IS
RELIABLY TRUTHY. A FALLBACK THAT NEVER FALLS BACK IS A BLIND PREDICATE WITH AN IDIOM INSTEAD OF A
COMMENT.** The narrowest cure is proved: **exempt +6, violations 165 → 159, subject set
unchanged, and the run-1 parchment SHAs BYTE-IDENTICAL on town/city/highwater/fjord — not one
pixel moves.** ⛔ **Deliberately not landed (J-W1-2): it widens a census exemption under the
§234 feature-law freeze and it moves a published figure. It needs a ruling, not a lane.**
⟦FOLD §264⟧ ✅ **AND IT NOW HAS ONE: §262.2(d) RULED IT A REAL DEFECT AND RULED IT IN.** It lands in
**W0** as the one **bug**-fix among G-34's five arms, ⚠ **and the receipt is not the new violation
count — it is the BYTE-IDENTICAL run-1 parchment SHAs.** *A cure that was proved pixel-free must
re-prove it at landing, or the proof was about a tree that no longer exists.*

⚠ **A THIRD ARM RIDES THE SAME RULING: the §205A street arm was designed for a RIVER and is
applied to a COAST.** A shore-parallel road scores **775 "crossings" on `city` and 555 on
`fjord`** — so **the coastal leaves dominate the corpus street total and the figure is not
comparable across terrains.** ⭐ *This is the §205A analogue of the half-ring exemption
MF-ARCH-2 had to turn from a TOLERANCE into a RULE.*

### ⟦FOLD §264⟧ §4.1b · G-41 · THE PRIOR-ART ADOPTION SET, ROUTED — AND THE UNGATED LIST KEPT BESIDE IT

**Every ADOPT-AS-APPROACH verdict from both GPL studies, in one place, with the wave that owns it.**
The architecture-sized ones have their own ledger rows (G-35…G-38); everything below is a single
rule or threshold, which is why it is one row (**G-41**) rather than fourteen.
⛔⛔ **THE LICENCE POSTURE IS UNCHANGED AND BINDS EVERY ROW: BOTH SOURCES ARE GPL-3.0 WITH NO
LINKING EXCEPTION AND ZERO PER-FILE HEADERS. NO CODE, NO TRANSCRIPTION, NO LIFTED IDENTIFIERS, NO
LIFTED CONSTANTS. WHAT TRANSFERS IS THE SHAPE OF A MECHANISM, IMPLEMENTED CLEAN-ROOM** (§0 of both
studies; §254.5). ⚠ *Whether counsel should confirm the clean-room posture before anything traceable
to these studies ships is an open owner item (§264.4) and is not settled here.*

| mechanism | source · its own rank | home stage | **(b) LOOK** — the metric that gates it | wave |
|---|---|---|---|---|
| **Resource dependency graph** → **G-35** | FTG **#1** ⭐ *best in either study* | S16 | landmark budget · ordinary:notable | **W6** |
| **Priority-ordered road growth** → **G-36** | FTG **#2** | S7 | `gamma_connectivity` 0.39–0.52 · `mean_degree` 2.1–2.7 · extramural concentration | **W3** (queue) → **W5** (ranks) |
| **Fit-the-footprint** → **G-37** | FTG **#3** | S10/S11 | `block_solidity_p50` · `block_elongation_p50` · burgage geometry | **W3** |
| ⭐ **Enclosure-free fringe lots** — lots with invisible edges that need no surrounding roads | FTG **#4** | S15 / **S18** | `deadend_share` 0.110–0.209–0.391 · extramural growth ≥60%, ≤2 gates | **W5** |
| **Snap-and-lengthen cleanup**, ⚠ **degree-aware** | FTG **#5** | S7 (inside G-36) | `star_share` ≤ 0.01 · `X_over_TY` ≤ 0.09 | **W3** |
| **Minimum-district-area merge**, threshold from the **legible-districts band** | FTG **#6** | S6 | legible districts (town 3–6 · city 5–9 · metropolis 8–14) · ⚠ `block_area_p90_over_p10` ≥ 6 must not flatten | **W4** |
| **Two-scale coastline**, detail **attenuated near the settlement** | FTG **#7** | S2/S4 | water incidence band · THROUGH bank asymmetry ~70/30 | **W1** |
| **Hinterland from the same lot substrate**, clustered by kind | FTG **#8** ⚠ **weakest (c)** | **S18** | `hull_frac_of_frame` · `green_excess` | **W5** |
| **Metric unit anchor** — every dimension a real-world quantity | FTG **#9** ⚠ **(c) neutral, flagged** | S23 | ⚠ **gated on NO BAND MOVING** — a unit anchor cannot move a ratio metric | **W7**, with §161i's TRUE MEASURE |
| ⭐ **Road/water typed interaction** — bridge a river, terminate at an ocean | FTG **#10** · *smallest and most certain item in the fold* | S4/S7 | the street-over-water census itself | **W3** (census half is **W0**'s G-34) |
| **Substrate/contents durability split** — the edge network persists, contents regenerate | FTG — *model property* | S0/§3.3 | none — no new machinery | ⭐ **already ours, and ahead**: keyed lineage beats spatially-scoped regeneration |
| **Four-axis character parameterisation** → **G-38** | WATABOU **#1** | S6/S10/S11 | `block_area_frac_p50` · `block_area_cv` · `orientation_order_phi` · `backland_green_p50` | **W3** (routine) → **W4** (values) |
| ⚠⚠ **Chaos large-scale / orthogonality small-scale** → **G-39** | WATABOU **#2** | S7/S10/S11 | `block_elongation_p50/p90` · `block_solidity_p50` · `orientation_entropy` | ⛔ **BLOCKED — test first (§4.1c)** |
| **Selective regularity — regularise the civic core, leave the edge raw** | WATABOU **#3** | S6/S7 | `block_circularity_p50` / `block_solidity_p50` **gradient**; φ rising toward the core | **W4** ⚠ *magnitude from the corpus, never their numbers* |
| **Randomise the STOP THRESHOLD, not the output size** | WATABOU **#4** | S10/S11 | `block_area_cv` · `block_area_p90_over_p10` | **W3** ⭐ *structurally cannot produce a degenerate plot — strictly better than sampling a size distribution* |
| **Per-edge setbacks as street hierarchy** → **SUB-1** | WATABOU **#5** | S7 | `street_share_of_hull` ⚠ *aggregate proxy — no per-tier width metric exists* | **W3** |
| **Outskirts thinning keyed to road proximity and enclosure** | WATABOU **#6** | S15 | built-density falloff · `hull_frac_of_frame` · `deadend_share` | **W5** ⭐ *the thing that makes an UNWALLED settlement look intentional* |
| **Towers at wall corners; evenness inherited, never enforced** → **SUB-3** | WATABOU **#7** | S13 | ⛔ **NONE EXISTS — G-40(i)** | **W2**, gated on **W0** |
| **Ordered claim list, greedily consumed, truncated by size** — ⚠ *the mechanism only* | WATABOU **#8** | S16 | ward-mix composition by tier | **W6** ⛔ *their list is REFUSED* |
| **Defensive seat edge-adjacent and outside the circuit BY CONSTRUCTION** | WATABOU **#9** | S13/S16 | citadel wall-attachment on walled plates | **W2** ⛔ *their distance-rank SELECTION is refused — site comes from terrain and dossier* |
| **Subdivide the neighbourhood to make room rather than rejecting a placement** | WATABOU **#10** | S7/S13 | gate/road connectivity · `gamma_connectivity` | **W3** ⭐ *converts a failure case into a construction step* |
| **Monumental buildings as a separate two-axis rule** | WATABOU — ADOPT | S11 | landmark:house footprint **5–12:1** · landmark budget | **W5/W6** |
| **Pin: assert an order-dependent relational rule actually HAD candidates** | WATABOU — *their defect, our guard* | S16 | n/a — **prevention machinery** | **W6** ⭐ *a defect of theirs converted into a counterfactual for us* |

#### ⛔ INTERESTING-BUT-UNGATED — **NO IMPLEMENTATION CLAIM, NO RANK** (§261.4)

**Six mechanisms are genuinely good and leg (c) cannot be argued for them.** §263.5 records them
being pushed out of the ranking as the correction working as designed. **They are listed so they are
neither lost nor smuggled in.**

| mechanism | why it is ungated |
|---|---|
| **Building material varies per epoch** — the cheapest way to make an epoch boundary legible | ⛔ **no corpus metric for between-region tone or texture contrast exists.** ⭐ **Promotable the moment G-40(ii) reads** — and it is the only row here with a named path out |
| **The full-employment objective exposed as a user choice** | a generator *objective*, not a geometric output. Nothing in the measured register responds to it. Recorded because making an objective function explicit is good design |
| **Per-entity public/private notes with a player-write flag** | product feature, not plan-craft. No metric, and correctly so |
| **Persistent entity → user-document linkage** | ⭐ **the sharpest PRODUCT insight in either study and entirely outside the map program's gates** — the place a user's campaign attaches to a generated world |
| **Hardware-adaptive render quality** | engineering practice. Corroborates §220/§247.3a; gates against a **performance budget**, never a corpus band |
| **Incrementality of lot detection** | an implementation optimisation. Buys nothing measurable; the *identity* it implements we already hold as law |

#### ⛔ EXPLICITLY REFUSED — recorded so nobody re-finds them as opportunities

**Any code at all (GPL-3.0)** · **their authored ward list** and **their dependency-graph contents**
(decoration under §256 *and* the most clearly protected expression in either program) · **their
citadel distance-rank selection** (arbitrary, no derivation home) · **their relaxation magnitudes**
(free parameters chosen by eye) · **flat-percentage fringe density** (a free parameter; the
positional mechanism is the better one) · **preset coast styles / "two arms from the centre"** ·
**spatially-scoped regeneration as the edit-survival strategy** (a workaround for missing identity;
our keyed-lineage model is ahead) · **the per-stage "place wall after" toggle** (a ring-drawer —
wrong by ~45 points, see S5-b) · **the "curve around origin" ring-road mode** unless epoch-scoped
(it manufactures X-nodes against a measured `X:T ≤ 0.09`) · **reject-and-redraw on failure**
(incompatible with seed stability and the inertia law) · **a single global random stream** (the
precise thing `keyedRandom` exists to prevent) · **their rendering, entirely** (§256.2 — the corpus
measures richer on every axis we grade; imitating it would cost us a rung).

### ⟦FOLD §264⟧ §4.1c · G-39 · THE CHAOS/ORTHOGONALITY TEST, SPECIFIED

**§261.3 requires this hypothesis to be TESTED against the corpus before it drives a rework.
Specifying the test is this fold's job; running it is not.** ⚠ **Until it returns, no S7/S10/S11
work may cite "chaos belongs at the large scale" as its justification.**

**THE HYPOTHESIS, stated so it can fail:** *in the corpus, the BLOCK scale is angularly disordered
and the BUILDING scale is near-rectangular — and our output has this the wrong way round, which is
why it reads as mush.*

**ARM 1 — THE LARGE SCALE. Runnable today; the numbers are already in this document.**
Measure over the studiable frame: `block_solidity_p50` (corpus median **0.748** — *a quarter of a
typical block's convex hull is not block*), `block_elongation_p50/p90` (median **2.14**, band
1.6–3.0), `orientation_order_phi` (whole settlement 0.044–**0.103**–0.433) and
`orientation_entropy`. ⭐ **PLAUSIBLE, and it is why the hypothesis is worth testing at all: these
three ALREADY say the corpus's block scale is disordered and non-convex** — §2.4's own reading is
that *the corpus does not draw square blocks, it draws STRIPS*, and *blocks are systematically
non-convex — the signature of streets meeting at angles.* **Arm 1 is close to confirmed on our own
published figures. It is arm 2 that decides the hypothesis.**

**ARM 2 — THE SMALL SCALE. ⛔ NOT RUNNABLE TODAY.** ⭐ **CONFIRMED by enumerating the key names of
`MFS3a-planmetrics.json` and `MFS3a-voidmetrics.json`: the finest spatial SHAPE metric we hold is
BLOCK-scale.** There is **no footprint-rectangularity measure of any kind**, and `cells_across` is
grain, not shape. **The instrument needed is G-40(iii): a per-footprint rectangularity / squareness
statistic over the corpus's own drawn masses** — the building-scale analogue of
`block_solidity_p50`.

**THE DECISION RULE, written before the numbers so it cannot be fitted afterwards:**

| outcome | what follows |
|---|---|
| **arm 1 disordered AND arm 2 rectangular** | ⭐ **hypothesis SUPPORTED.** G-38's grid-chaos axis is scoped to the *cut* geometry and forced toward zero as pieces approach building size; G-37's vocabulary is the small-scale half. **This is the rework §261 is gating** |
| **arm 1 disordered AND arm 2 ALSO irregular** | ⛔ **hypothesis REFUTED for our target.** The corpus's buildings are not rectangular and imitating a generator's squareness would move us *away* from it. **G-38 keeps its four axes; the chaos scoping is not adopted** |
| **arm 1 ordered** (contradicting §2.4) | ⛔ **stop and re-examine the instrument, not the hypothesis** — it would contradict figures this document publishes as CONFIRMED |
| **arm 2 unmeasurable** (G-40(iii) not built) | ⚠ **the hypothesis stays a hypothesis and drives nothing.** *An untestable diagnosis is not a licence to rework* |

⭐ **AND THE HONEST NOTE THAT MAKES THIS WORTH THE PAGE: even if the hypothesis is refuted, the
MECHANISM it inspired survives independently.** G-37's fit-the-footprint has its own three legs and
its own measured miss (the alley/sliver floor) and does not rest on this test at all. ⚠ *What the
test governs is whether we may say WHY we did it.*

### ⟦FOLD §275⟧ §4.1d · THE VALIDATION ADDITIONS — G-43…G-47 (ODQ §275, chaired-in-person fold)

**These five rows enter the ledger as a group. G-43/44/45 live in the VALIDATION tier and route to
W8 (they test the finished product and depend on nothing unbuilt); G-46/47 are band/morphotype
amendments routed to the waves that own their surfaces. Ranks: G-43 sits with G-29's
expressive-range work (the two are the distribution-level and causal-level halves of one
question); the rest are unranked group members per the G-41 pattern.**

| id | What is uncovered | Mechanism | Derivation home | Route |
|---|---|---|---|---|
| ⭐⭐ **G-43** | **NOTHING TESTS THAT THE DOSSIER CAUSES THE MAP.** Censuses prove legality; bands prove register; the §216 loop proves resemblance — none proves that changing a CAUSE changes the CONSEQUENCE | **THE COUNTERFACTUAL CAUSAL BENCHMARK**: hold the seed, alter ONE dossier fact, and register exact entity/component tokens, direction predicates, tolerances and forbidden components before the run. Report **Directional Responsiveness, Causal Precision, Collateral Share and Directional-Violation Share** under §10.14; any forbidden change is a hard RED. The initial battery, drawn from facts we already hold: **move the primary resource site** (the scarcity/extraction ground must follow — §251's scarcity finding); **remove the water crossing** (the through-river leaf's detour-to-work must reroute); **change a registered founding/plan-intent operation** (intended axes and parcel-width modes may move, while terrain/inherited-anchor deformation remains causal—never an organic↔grid style switch); **shift the wall's construction year ±N epochs** (pre-wall fabric share and faubourg pattern must move — §239.3); **cut population 40% late** (vacancy/demotion rungs must appear; the wall must NOT contract — §240.4's dividend); **add a monumental institution at year N** (later epochs may reorient only through the registered historical operation); **swap the water mode** bankside↔none (quays/mills/water gates must appear/vanish, banks must not). A missing or wrong-direction move and an unexpected changed component are different findings; neither may be tuned away after inspection | Every arm names its dossier fact by construction — the benchmark IS the derivation-home test executed | **W8 exit 6.** Grade A method; each arm's expected direction carries its own grade |
| ⭐ **G-44** | Nothing tests whether BEAUTY BIASES STRUCTURAL JUDGMENT — the blinded 2AFC judges aesthetics, the censuses judge legality, and no instrument separates them | **THE RENDERER-HALO ABLATION**: the same maps judged twice, bare geometry and full paint, with structural-plausibility scored separately in each condition. The HALO is the paint-minus-bare delta on STRUCTURAL questions; a large halo means the paint is camouflaging, and the structural verdict is taken from the BARE condition | n/a — an instrument, not a mechanism | **W8 exit 7**, run beside the blinded test on the same sessions |
| ⭐ **G-45** | The corpus grounds LOOK (§0.2a) and history grounds our LAWS — but the structural bands (junction mix, φ, circuity) rest on a SYNTHETIC corpus alone; no REAL-historical distribution has ever been measured beside them | **INGEST THE OPEN ALTAWEEL–HANSON–SQUITIERI PREINDUSTRIAL STREET-NETWORK DATASET** as a second, real-historical STRUCTURAL cohort: run OUR OWN instruments (junction degree, orientation order, circuity, centrality skew) over its networks and report its bands BESIDE the corpus bands wherever a structural figure is quoted. Where the two cohorts disagree, **history wins on structure, the corpus wins on register** — the §256 precedence extended to calibration data. ⛔ **LICENSING LAW (§275.3b): distributional geometry cohorts require compatible open data.** Citation-only Historic-Towns-Atlas records may enter §10.20 as bounded factual claims and validation cases, but never as copied geometry, pixels or an opportunistic frequency sample | The cohort is external ground truth; no dossier fact — which is why it may only CALIBRATE, never generate (§3.2) | **W8 exit 8**; the ingestion itself is a small instrument task |
| **G-46** | The fill bands treat low coverage as demotion's signature only — but **empty space is historically NORMAL**: gardens, yards and vacant plots inside healthy walls | **THE HEALTHY-VACANCY PRIOR**: T-05's fill bands gain a vacancy term derived from LAND PRESSURE (population vs capacity), prosperity and growth stage — a young, unpressured town shows gardens without being "demoted"; §161g's scars remain the DISTINCT signature of decline (outline/rubble/ghost rungs), so vacancy and demotion stay visually separable | population, capacity, prosperity, growth stage — all held | Routed to the wave that next touches the fill bands (W3/W5); Grade A/B |
| **G-47** | Wall MATERIAL is stone-defaulted — historically European circuits vary by region, era, available resources and construction history (earth, timber, brick, stone and composites) | **MATERIAL AS A MORPHOTYPE VARIABLE**: an evidence-versioned region/period/resource pack selects wall material and its drawn vocabulary; narrative culture does not. Material affects ICONOGRAPHY (§214's wall arm) and decay rungs, never the circuit's derivation | European evidence scope, era, terrainType/resources, dated works | Routed with §7/AMP-1 (W5/W6); historical possibilities are Grade A, any probability or mapping remains uncalibrated |

**One routed note on S7 (§275.5, from the prior-art detail bank): the upstream generator's
pathfinder is neither A\* nor Dijkstra, and its accidental suboptimality is part of why its routes
read organic. THE SYNTHESIS IS OURS AND IS BINDING: a CORRECT router plus DERIVED irregularity
(terrain cost, reuse discount, §258's setbacks) — never an inherited bug worn as a feature. A
route that is crooked must be crooked because something made it so.**

### §4.2 · G-28 · THE RESIDUAL AND CARRIED-DEFECT SET, ITEMISED

Small individually. **Collectively they are what a reader sees.**

| item | measured | source | disposition |
|---|---|---|---|
| ✅ **`waterViolations` 114 → 165 — CHARACTERIZED, CLOSED** | ⟦FOLD §297/§298⟧ ⛔ **the published (+47, −13) pair SUMS TO +34 against a +51 move and is CORRECTED (§297.6a): the valid orderings are (+64, −13) and (+4, +47), with an INTERACTION of −17.** The two halves are not separable; the ordering decides which wears the interaction. 92% sample / 8% architecture, architecture pointing the RIGHT way; the verdict is **NOT-DISPROVED**, and "changed nothing" is restated as **consistent with noise at n=6 (a real shift up to ~+38 was undetectable)** | `laneMFW1-receipt.md` §0, §2 | ⭐ **NO CURE OWED.** MF-ARCH-2's guessed cause was **refuted by execution** — `year-018` has no circuit and moved by the same +10 with a byte-identical key set. §252.3b discharged. **Publish per §0.3a's authoritative set** |
| ⛔ **MF-ARCH-2's 32 plates are unviewed** | 10 walled leaves' walls changed shape; the ditch changed ring | `laneMFARCH2-receipt.md` §9.8 | ⭐⭐⭐ **WAVE NINE'S FIRST ACT.** Judge: does the epoch-derived old core read as an OLDER town rather than a smaller copy; does the outer ring at 0.899 leave a suburb that reads as a suburb; does the ditch on the working circuit read right |
| ⛔ **clipped-institution SPIKE** | a large body reduced by the ground law's clip to a long dark triangle attached to nothing | `laneMFB8-receipt.md` §14; §229.2d | **NEW at b8, confirmed real by chair zoom.** Cure: a shape-aware clip **or** a demotion rung for institutions |
| ⛔ **block front lines over empty ground** | a thinned rank still emits its full front and back lines | `laneMFB8-receipt.md` §14 | ⭐ **G-7's frontage-as-an-object cannot do this** |
| ⚠ **isolated plots carry full-length tofts** | a single fringe holding draws a 4.2:1 toft into open country | `laneMFB8-receipt.md` §14 | reads as *a fence to nowhere* |
| ⚠ **parallel building bars read MECHANICALLY** | plot-width or depth variance too low | §252.3c, chair zoom at 3000px | ATLAS banned prior #7's neighbourhood — **G-7's run-length structure is the cure** |
| ⛔ **§205A's residual, now 165 and DECOMPOSED** | ⭐ **92 of 127 street violations (72%) are unexemptable BY CONSTRUCTION** — ⟦FOLD §297/§298⟧ **the A+B core, 72 predicate mismatch + 20 `passage` refusal = 92** (§297.6). ⚠ **The 35 first-crossing-only and 6 dead-`anchorKey` classes are SEPARATE AND OVERLAPPING, never addends** — the four counts sum to 133 and were mis-published as a partition; **the full decomposition is re-derived when G-34 is built.** The older classes stand — quay streets running ALONG the shore inside the claim, and non-marine institutions touching the coastal claim | `laneMFW1-receipt.md` §5, §6; `laneMFB8-receipt.md` §6 | ⭐⭐ **PROMOTED OUT OF THIS SET INTO G-34** — it is one ruling, not five patches |
| ⚠ **`zoneClickCoverage` town 0.50** | half a town's fabric belongs to a quarter whose click region does not cover it | `laneMFB8-receipt.md` §5 | ⛔ **OWNER-GATED** — the cure changes a landed one-element-per-district-id contract five UI suites hit-test |
| ⚠ **the faubourg district-id change** | `${parent}~faubourg` + `wallSide`/`parentDistrictId` | §238.4b | ⛔ **OWNER-GATED and PARKED** — it rides the landing's owner review with the §232 law it serves |
| ⚠ **T-05's fill bands ungraded** | a measurement mismatch, not sixteen leaves of failure | `laneMFB8-receipt.md` §5 | **CHAIR QUESTION Q-4** |
| ⚠ **metropolis grain 70 vs band 80–120** | ×1.14 from the floor | §244.5 | the named lever is **G-15** (the countryside) plus the grain re-pin (**G-33**) |
| ⚠ **the frontage ladder's town→city step** | 4.53 → 5.25 → 5.13 — 96% of the inversion closed, the residual is town→city | `laneMFB8-receipt.md` §1 | ⛔ **a §5 TIER-TABLE question, explicitly the chair's** — see **G-5** |
| ⚠ **`substrate.js`'s second salt spelling** | 4 sites, correct but duplicated | `laneMFARCH2-receipt.md` §4 | converting it moves every leaf **for no measured defect** — a duplicated-rule hazard, not a bug |
| ⚠ **the domain content hash is 4×32 bits** | `fabricRng.hash32`; the sha-256 tiers live in the harness | `laneMFARCH2-receipt.md` §9.6 | the staleness detector says in its own comment that it is not a security primitive |
| ⚠ **streets and water are not graph nodes; §205A's subject set is 92 bodies** | raw-handle exposure: **19** street reads, **58** water reads | `laneMFARCH-receipt.md` §7 | the publication-point guard (J-ARCH-6) is the pattern to extend |

### §4.3 · THE DEPENDENCY GRAPH, STATED AS EDGES

**Read these as hard edges. Every one is either an ODQ ruling or a physical impossibility.**

```
G-2 (substrate) ──BLOCKS──▶ §214's TERRAIN ARM            [§251.4a — ruled]
G-2 ──BLOCKS──▶ G-4 (water bearing) · CX-03 slope grammars · CX-02 refusal mask
G-1 (region)   ──BLOCKS──▶ CX-01 siting · CX-15 typed gates · CX-22 gate selection
                           · CX-25 road furniture · CX-32 toll avoidance · G-21 (load weights)
      ⟦FOLD §264⟧ ⚠⚠ G-1 HAD NO LEDGER ROW while this edge was already drawn against it.
         Entered at rank 9.  It also ──BLOCKS──▶ G-3's GATE arm (gates are typed road
         terminals placed AFTER the region's approach roads — S13 says so in as many words)
         and ──SEEDS──▶ G-36's priority queue in W5.
G-3 (run chain) ══BOUND TO══ §240 (epoch axis)            [§251.4b — "one piece of work"]
G-3 ──BLOCKS──▶ §252.3a's METROPOLIS THIRD CIRCUIT (the cap lifts WITH the run chain, then by measurement)
G-3 ──BLOCKS──▶ G-20 (§200's run-type exemption; without it a CORRECT wall-side street REDS the census)
G-8 (circuitDemotion) ──MUST NOT LAG──▶ multi-ring output  [§250.5 — otherwise every new ring ERASES history]
G-7 (frontage-first) ──UNLOCKS──▶ block silhouette · G-19 backland/courts · G-24 district legibility
G-10 (junction mix) ──PRECEDES──▶ G-18 (blocks are the planar faces of the graph)
G-9 (epoch dials)   ──NEEDS──▶ §240 (BUILT)  ──ELSE──▶ the epoch axis is VISUALLY INERT
G-30 (terrain vocabulary, OWNER-GATED) ──BLOCKS──▶ all of CONTEXT §7's morphotypes; PARTIALLY blocks G-6
G-11 (eventFootprint, OWNER-GATED) ──UNLOCKS──▶ the replanned-quarter anomaly class
G-29 (runtime budgets) ──SERVES──▶ §220 performance gate  [LAUNCH-BLOCKING per §247.3a]
G-34 (one predicate, one home) ──PRECEDES──▶ every wave that adds a census
                               ──UNBLOCKS──▶ 92 of 127 street-over-water violations (72%)

──── ⟦FOLD §264⟧ the eight edges the fold adds ───────────────────────────────────
G-42 (fabric epochs)  ──PRECEDES──▶ G-9 (the dials)   [§257.3a — RULED]
      ⛔ WHY: epochAxis mints one epoch per CIRCUIT, so an unwalled leaf has nothing to vary.
         W4's per-epoch exit criteria are UNTESTABLE on half the tier ladder until this lands.
G-42 ══BOUND TO══ §240 + G-3, and lands in the SAME wave (W2) that opens epochAxis.js

G-40(i)  tower-spacing metric      ──GATES──▶ S13's corner rule · §3.4 #7's re-read · SUB-3
G-40(ii) per-epoch tone contrast   ──GATES──▶ per-epoch material (§4.1b's ungated list)
G-40(iii) footprint rectangularity ──GATES──▶ G-39 arm 2       [this lane's finding]
      ⭐ ALL THREE ARE MEASUREMENTS, ALL THREE ARE CHEAP, AND ALL THREE PRECEDE THE MECHANISM
         THEY GATE. §263.6a ordered (i) and (ii); (iii) is proposed.

G-39 (the chaos/orthogonality TEST) ──BLOCKS──▶ any S7/S10/S11 rework citing that principle
      ⚠ It does NOT block G-37 or G-38, which stand on their own legs.        [§261.3]

G-38 (four axes, ONE routine) ──MUST PRECEDE──▶ writing any per-district generator
      ⚠ STRUCTURAL, not sequential: retrofitting a parameterisation is the expensive path.
G-35 (the roster) ──SUPERSEDES AS A SOURCE──▶ G-25 (the per-tier landmark budget)
      ⚠⚠ W5 measures compliance against the BAND; W6 replaces the DERIVATION.
         W6 therefore owes a NON-REGRESSION check on W5's measured landmark result.
G-35 ──FEEDS──▶ G-15's hinterland   (a settlement with farms needs farmland)
G-36 (priority queue) ──NEEDS──▶ G-1 for its RANK seeding, but not for the queue itself
      ⭐ Build the queue in W3 without ranks; W5's region completes it. NOT rework.
```

⭐⭐ **THE EDGES THAT COST A WAVE IF THEY SURFACE LATE — ⟦FOLD §264⟧ NOW FOUR, AND EVERY ONE IS
ALREADY RULED:**
**(1) §214's terrain arm against a scalar** — a lane will write hachure code that has nothing to
consume. **(2) §240 landing without the run chain** — *"landing §240 alone would ship the defect
and then pay a declared shift TWICE to remove it."*
⟦FOLD §264⟧ **(3) THE EPOCH DIALS LANDING ON A CIRCUIT LADDER (G-42 → G-9, §257.3a)** — W4 would
build per-epoch grain, φ and attachment modes, then discover that **six of the sixteen exemplar
leaves have exactly one epoch by construction and cannot express any of it.** *The fix is upstream
and cheap; discovering it downstream costs the wave.* ⟦FOLD §297/§298⟧ ⚠ **W2's G-42 CURED THAT
COUNT DEFECT AND ONLY THAT ONE (§297.3c).** The **vintage triad** — per-epoch grain, plot variance
and pigment — remains undelivered on **all sixteen** leaves, and it is **W4-class work, never a
free dividend of §240**; do not let the retired "six of sixteen" figure size it.
⟦FOLD §264⟧ **(4) A PER-DISTRICT GENERATOR WRITTEN BEFORE G-38's FOUR AXES EXIST** — this one is
**structural rather than sequential**, which is why it is the easiest of the four to walk into:
nothing *blocks*, everything works, and the parameterisation simply becomes unaffordable to retrofit
once seven district generators exist. ⭐ *The cheapest moment to decide "one routine, four
dossier-driven scalars" is before the first one is written.*

---

## §5 · THE IMPLEMENTATION ORDER

**What this is.** The wave plan that falls out of §4.3's dependency edges. It is a
**decomposition of the existing wave-nine mandate**, not a new mandate: §229.3, §239.5, §240.4,
§250.2, §250.5 and §251.4 have all slotted work into "wave nine" independently, and the result is
overloaded and internally ordered by dependencies nobody had written down. **This orders it.**

**EVERY EXIT CRITERION BELOW IS A MEASUREMENT, NOT AN INTENTION.** A wave is done when the
numbers are in a receipt, executed after the final edit, with the counterfactual that must red
having redded.

⚠ **THE CONCURRENCY LAW BINDS: TWO LANES / ONE LANDING / ONE GATE / ONE WORKTREE.** Where a wave
below names a parallel track, it is a second *lane*, not a second landing.
⚠ **AND EVERY WAVE FROM W1 ON CHANGES GEOMETRY, SO EVERY ONE RIDES A DECLARED ONE-TIME SHIFT
(§110.3), NEVER A SILENT REDRAW.** Attribute causes by the three-stage method MF-ARCH-2 used —
*land the behaviour-neutral half first, measure, then the geometry half, measure* — because that
is what makes a declared shift auditable.

### ⟦FOLD §264⟧ §5.0 · ⭐⭐ DOES THE WAVE ORDER STILL HOLD AFTER THE RE-RANK? **YES — AND HERE IS WHY, CHECKABLY**

⚠ **A NAMESPACE TRAP THIS SECTION'S NUMBER WALKS INTO, NAMED SO IT NEVER BITES: `§5.0b`, `§5.0d`
and `§5.0e` ARE CHARTER LAWS** (the water mode, parcel dithering, the inn belt) **and have nothing
to do with this section.** Throughout this document a `§n` with a lowercase-letter suffix is almost
always a **LAW**; this document's own sections use digits (`§5.1`, `§4.1a`, `§1.1.7f`). **The two
consequences below are therefore lettered "(a)" and "(b)" in prose and must be cited as *"§5.0's
consequence (a)"*, never as "§5.0a".** ⭐ *The same overlap already exists for §2, §3, §9, §12 and
§16 — the ambiguity is inherited, not introduced, and this is the first place it is written down.*

**The fold added eight ledger rows and re-ranked 41. THE WAVE ORDER W0 → W8 IS UNCHANGED. Not one
wave moved, split, merged or swapped, and no item moved between waves.** Three reasons, each
verifiable rather than asserted:

1. ⭐ **THE RE-RANK MOVED NOTHING.** §4.0 quotes the executed proof that **no pre-existing row
   changed position relative to any other pre-existing row** — the eight newcomers were interleaved.
   A wave plan derived from an ordering that did not change cannot itself change.
2. ⭐ **EVERY NEW ROW LANDED IN A WAVE THAT ALREADY OWNED ITS STAGE.** G-37/G-38/G-36 → **W3**, which
   already owned the fabric order · G-42 → **W2**, which already opens `epochAxis.js` under §251.4b ·
   G-35 → **W6**, which already owned the four dossier fields · G-40 and G-34's ruling → **W0**,
   which already owned the instrument and verification debt · G-39 → a **test that blocks work
   rather than scheduling any**. ⭐ **This is not luck: §263.5 observed that three of the top four
   FTG adoptions land on S7, S18 and S16, which are the stages this document had already named as
   its weakest — and the wave plan was already ordered to reach them.**
3. ⛔ **THE ONE ITEM THAT COULD HAVE FORCED A MOVE WAS RULED THE OTHER WAY.** §264.2 considered
   pulling the §12 immersion suite ahead of the substrate and **ruled that dependency order STANDS**
   (§0.5). *That was the only live threat to this ordering and it was adjudicated, not avoided.*

⚠⚠ **TWO ORDERING CONSEQUENCES THE FOLD DID SURFACE, AND NEITHER MOVES A WAVE — BOTH ARE RECORDED
HERE SO THEY ARE NOT DISCOVERED MID-BUILD:**
**(a) G-35 SUPERSEDES G-25's LANDMARK BUDGET AS A *SOURCE*, AND THEY SIT IN DIFFERENT WAVES.** W5
measures landmark compliance against the per-tier **band**; W6 replaces the **derivation** behind it
with the roster. They are not in conflict — but **W6 now owes a NON-REGRESSION check** so the
derived roster holds or improves W5's measured result rather than quietly re-opening it. *Added to
W6's exit criteria.*
**(b) G-36's QUEUE AND ITS RANK SEEDING SPLIT ACROSS W3 AND W5.** The growth queue is built in W3
from the anchors that exist there; G-1's approach-road **ranks** complete it in W5, which is where
the unequal-ribbon criterion already lives. ⭐ **Building the queue before the ranks exist is correct
and is NOT rework** — the seed is replaced, the machinery is not.

---

### W0 · THE VERIFICATION DEBT — before any new build

**Cheap, blocks nothing, and it must precede the first line of new code.** Two of these are
outstanding obligations from the last two waves and one is housekeeping the conflict set found.

| item | what |
|---|---|
| **LOOK AT THE PLATES** | 32 plates in `mf-proto-out/arch2/`, unviewed. Ten walled leaves' walls changed shape; the ditch changed ring |
| ✅ ~~characterize `waterViolations`~~ | **DONE — lane MF-W1. §252.3b is discharged**; publish per §0.3a's authoritative set, as ONE movement with TWO named halves |
| ⭐ **G-34 — ⟦FOLD §264⟧ NO LONGER A RULING, NOW A BUILD** | ✅ **§262.2 RULED IT: three build-fixes, one bug-fix, one named exemption.** (a) one predicate, one home + a check that reds on a second spelling · (b) **build the bridge** for `rank === 'passage'` · (c) **fix the loop** so a street meeting a meander twice gets two bridges · (d) land the dead-`anchorKey` mill cure · (e) name the **coast-vs-river** exemption in the census. ⚠⚠ **THE CURE IS NOT TO CONVICT LESS** |
| **G-33 the stale figures** | metropolis `GRAIN_BAND` → 80–120 with `GRAIN_SEAMS` re-derived (C-2); thorp/hamlet rungs labelled UNMEASURED — ⟦FOLD §264⟧ **and §257.3(b) has now ruled they MAY remain generation inputs**, so the label is `UNVALIDATED-BY-INSTRUMENT` and not a deletion (C-3); paper warmth → 37 (C-1) |
| ⭐ **THE DISTINCT-SITE TOTAL** | one line in the harness: publish the **10-world** total beside every 16-leaf total (§0.3b) |
| ⟦FOLD §264⟧ ⛔⛔ **G-40 · THE THREE MISSING INSTRUMENTS** | **(i) TOWER SPACING** — spacing CV along the circuit + towers per unit circuit length. **(ii) PER-EPOCH MATERIAL / TONE CONTRAST** — a between-region fill-tone separation, not a whole-plate statistic. **(iii) ⟦lane proposal, vetoable⟧ FOOTPRINT RECTANGULARITY** — the building-scale analogue of `block_solidity_p50`, absent from the entire register. ⭐ **§263.6a ordered (i) and (ii) and put them here.** ⚠ *Each GATES a ranked mechanism, and they are the difference between an argued rule and an unmeasured habit* |
| ⟦FOLD §264⟧ ⚠⚠ **G-39 · THE CHAOS/ORTHOGONALITY TEST — RUN IT HERE, BECAUSE IT GATES W3** | §261.3 requires the hypothesis to be **tested against the corpus before it drives a rework**, and W3 is the wave that would do the rework. **Arm 1 (large scale) is runnable today** on `block_solidity_p50` · `block_elongation_p50/p90` · `orientation_entropy` · `orientation_order_phi`. **Arm 2 (small scale) runs the moment G-40(iii) exists** — which is why the instrument and the test belong in the same wave. **The four-outcome decision rule is written in §4.1c and was written BEFORE the numbers so it cannot be fitted afterwards** |
| ⟦FOLD §264⟧ ⭐ **THE DERIVED-vs-DRAWN GRAIN CENSUS** | §257.3(c) ordered it and this document had never recorded it: **derived grain and drawn grain must agree within a stated tolerance**, so the loss between intent and output can never again be invisible. The metropolis derives **≈113** and draws **70**. `MFB8-runprobe.py` already separates what RESOLVES from what EXISTS — **the census is the tolerance around it** |

**EXIT CRITERIA (measurements):**
1. **32 of 32 plates viewed, each with a written verdict**, and the three named judgments
   answered in prose: *does the epoch-derived old core read as an OLDER town rather than a
   smaller copy · does the outer ring at 0.899 of the city's extent leave a suburb that reads as
   a suburb · does the ditch on the working circuit read right.* ⚠ **Never a verdict row without
   a rendered image seen** (§231.2), and the three-number reconciliation (files / previews /
   ledger) is mandatory.
2. ✅ **ALREADY MET: `waterViolations` = 165 decomposed with counts summing to 165 and the
   direction explained** (`laneMFW1-receipt.md` §2). **The remaining obligation is publication
   discipline, not measurement:** the landing quotes §0.3a's set and states the movement as **two
   named halves**, never as `100 → 165`.
3. ⟦FOLD §264⟧ **G-34's FIVE ARMS LANDED AS §262.2 RULED THEM, EACH WITH ITS OWN MEASUREMENT.**
   **(a)** one exported predicate with a check that **reds** when a second module re-spells the same
   geometric question — *and the check must be non-vacuous: plant a second spelling and it must
   convict.* **(b)** every `rank === 'passage'` water crossing carries a **passage-scale crossing
   structure**; zero forgiven passages. **(c)** a street meeting one channel **twice** produces
   **two** bridges; zero channels with an untaken second crossing. **(d)** the dead-`anchorKey` mill
   cure landed. **(e)** the coast-vs-river exemption **named in the census output**, never a silent
   pass, and keyed to bankside adjacency vs channel transit.
   ⭐ **The headline measurement: the unexemptable share falls from 72% of street violations to a
   stated number — and the receipt must attribute the fall to CROSSINGS GAINED, arm by arm.**
   ⚠⚠ *The cure is not to convict less. A fall produced by a widened exemption is a failed wave
   wearing a passing number.*
4. **The harness publishes a distinct-site (10-world) total beside every 16-leaf total**, and no
   figure in the wave's receipt is quoted corpus-wide without it.
5. **The grain sweep re-run after the re-pin: ≥11,765 populations, ZERO decreases, every tier
   seam continuous to 2 d.p.** — the same proof that made the original derivation safe.
6. **Suite green, determinism 10/10, all four drawn censuses 0, 96/96 under ceiling** — the
   standing floor, re-quoted at the tip. ⭐ **And the mill cure — ⟦FOLD §264⟧ now RULED IN at
   §262.2(d) — must re-quote the run-1 parchment SHAs as BYTE-IDENTICAL** on town / city /
   highwater / fjord. ⚠ *It was proved pixel-free against an earlier tree; that proof is the
   receipt only if it is re-taken against the tree that actually lands.*
7. ⟦FOLD §264⟧ **THE THREE INSTRUMENTS READ A NUMBER ON THE CORPUS, NOT ON OUR OUTPUT** — (i)
   tower-spacing CV and towers-per-unit-length over the walled studiable plates; (ii) a per-epoch
   fill-tone separation over the within-plate epoch pairs the compendiums already isolated
   (hf26, hf274, hf239, hf347); (iii) footprint rectangularity over the drawn masses. ⚠⚠ **A
   number that cannot be produced is reported as ⛔ NO INSTRUMENT and the mechanism it gates stays
   out of the ranking — it may NEVER read as a pass** (§249.2's fifth verdict).
8. ⟦FOLD §264⟧ **THE DERIVED-vs-DRAWN GRAIN CENSUS RUNS AND PUBLISHES A TOLERANCE PER TIER**, with
   the metropolis's own gap (**≈113 derived vs 70 drawn**) as its first datum. ⭐ **The census is
   the point, not the number: after this the loss between intent and output has a home and can
   never again be discovered as a surprise.**
9. ⟦FOLD §264⟧ ⚠⚠ **G-39 RETURNS A VERDICT, AND THE VERDICT IS A ROW IN THE RECEIPT — NOT A
   FEELING.** **Arm 1** publishes `block_solidity_p50`, `block_elongation_p50/p90`,
   `orientation_entropy` and `orientation_order_phi` over the studiable frame. **Arm 2** publishes
   footprint rectangularity if G-40(iii) built, and ⛔ **reports NO INSTRUMENT if it did not.**
   **§4.1c's four-outcome decision rule is then applied and the outcome named.**
   ⭐ **The pass condition is that a verdict exists, not that the hypothesis is supported** — *a
   refutation is a result and unblocks W3 exactly as cleanly as a confirmation does.*
   ⛔ **W3 may not cite "chaos belongs at the large scale" as a justification until this row
   exists.** ⚠ *And if arm 2 reports NO INSTRUMENT, the hypothesis stays a hypothesis and drives
   nothing — G-37 and G-38 proceed on their own legs, which they have.*
10. ⟦FOLD §264⟧ ⚠ **NOTHING IN THIS WAVE MOVES A PIXEL EXCEPT WHERE A DECLARED SHIFT SAYS IT DOES**
   — G-33's three figures and G-34's five arms are the *whole* list, each declared with its cause.
   **A W0 receipt that reports an unexplained render change has found something and must stop.**

---

### W1 · THE SUBSTRATE — the biggest unblocker in the program (G-2, G-4)

**Build the relief field, the land-form classification and the `buildable` refusal mask; derive
the water bearing from it.** ⟦FOLD §264⟧ **Plus one small folded item that is the same geometry
seen from the wet side: the TWO-SCALE COASTLINE — a large shape plus a detail shape, with the
detail term ATTENUATED where the settlement works its waterfront** (S4's ⟦FOLD §264⟧ block).
**Nothing else in this wave.**

⭐ **Why first:** it is the only item that unblocks another *ruled* law (§214's terrain arm), and
six of CONTEXT's eight traces are hit by its absence. Everything terrain-shaped — the slope
grammars, the refusal mask, two of the nine wall-run types, the hachure vocabulary, the terrace
grammar, the wedge block — is stalled behind it.

**EXIT CRITERIA (measurements):**
1. **Every leaf publishes a relief field, not a scalar**, and the substrate-vs-facts consistency
   pin is green **over every §161a input** (ore → workable slopes + spoil ground; fisheries →
   shore + shoal; timber → standing forest; quarry → exposed stone) — **not `terrainType`
   alone**, with a counterfactual that plants an inconsistent resource and reds.
2. **Zero drawn bodies on `buildable == false`,** censused per leaf, with a planted violation
   that reds.
3. **`waterBearing` present on every water-bearing leaf and traceable to substrate geometry** —
   with a pin asserting it is **derived, not stored**: perturb the substrate seed and the bearing
   must move; hold it and the bearing must be byte-identical.
4. **The fjord leaf shows a fjord and the mountain leaf shows relief, judged by eye at 3000 px**
   — §9.5b's acceptance test in its own words: **terrain drama invisible = acceptance FAIL.**
5. Determinism 10/10; ceilings 96/96; the substrate adds no cycle (SCC 0 non-trivial at both
   granularities).
6. ⟦FOLD §264⟧ **The coastline carries two measurable scales and the detail term is measurably
   damped at the worked waterfront** — a coastal leaf's shoreline sinuosity **falls** where the
   fabric meets it and **holds** away from it, and ⭐ **the THROUGH leaves show bank asymmetry near
   70/30 as a CONSEQUENCE of that damping rather than as a rule** (ATLAS banned prior #10; §2.5).
   ⚠ **Counterfactual: remove the attenuation and the asymmetry must weaken** — otherwise the
   asymmetry is coming from somewhere else and the mechanism is not doing the work.

---

### W2 · THE WALL, WHOLE — because it cannot be landed in pieces (G-3, G-20, G-8, §214's wall arm)

⛔⛔ **THIS WAVE IS DEFINED BY TWO RULINGS, NOT BY CONVENIENCE. §251.4b: §240 and the run chain
are ONE piece of work. §250.5: without `circuitDemotion`, every new ring ERASES the history the
epoch model was adopted to express.** Landing any of these three alone ships a defect and pays a
declared shift twice.

⟦FOLD §264⟧ ⛔⛔ **AND A THIRD RULING JOINS THEM, WHICH IS WHY THIS WAVE OPENS `epochAxis.js`
ANYWAY: §257.3(a) — EPOCHS ARE FABRIC EPOCHS, NOT CIRCUIT EPOCHS (G-42).** The wall becomes an
**event within** the epoch sequence rather than its definition. **It lands here because it is the
same file and the same declared shift**, and because leaving it to W4 would have that wave build
per-epoch machinery that **six of the sixteen exemplar leaves cannot express.**
⚠ ⟦FOLD §297/§298⟧ **WHAT THIS WAVE DELIVERS IS EPOCH *COUNTS* (§297.3c).** The vintage triad
(per-epoch grain, plot variance, pigment) is **undelivered on all sixteen leaves** and is
**W4-class real work** — it is not a consequence of landing G-42 here.

**Contents:** the nine run types with their causes and per-run parameters · the per-run tower
policy (`none` on terrain-surrender and water runs; `clustered` facing approach; `sparse`
elsewhere; tower as a **TYPE**) · the wall-side street as a **per-run** derivation · **§200's
clearance census re-keyed to exempt by RUN TYPE** · `circuitDemotion`'s five-rung fate ladder and
its transformation table · §214's wall/iconography arm (masonry band, gatehouses as structures,
palisade tick-rows, ditch grammar) · ⟦FOLD §264⟧ **G-42's fabric-epoch derivation** · ⟦FOLD §264⟧
**the defensive seat guaranteed edge-adjacent and outside the circuit BY CONSTRUCTION** (⛔ *their
distance-rank selection is refused — the site comes from terrain and dossier truth; what transfers
is that a structural guarantee beats a scoring preference*).

⟦FOLD §264⟧ ⚠⚠ **ONE CONTENT ITEM CHANGED ITS MEANING IN THIS FOLD AND A BUILDER MUST NOT MISS IT:
TOWER POSITIONS ARE NO LONGER "SEEDED-IRREGULAR".** §259.3 ruled **place by STRUCTURE — the corners
that exist — and let the spacing be whatever the structure gives** (§3.4 #7's re-read, register
entry **SUB-3**). ⭐ *Seeded irregularity is still a dial; the corner set is a consequence.* Our wall
is a **district partition** (§232), so its corners are already dossier-caused and the rhythm varies
**for a reason**.
⛔ **BUT SUB-3 IS HELD UNTIL W0's G-40(i) READS A NUMBER.** §258.2 forbids a substitution that
cannot name its preserved signature, and there is **no tower-spacing metric in the register**. **If
W0 fails to produce the instrument, this wave keeps the seeded-irregular policy and says so** —
it does **not** adopt an unmeasured mechanism because two prior-art products agree.

**EXIT CRITERIA (measurements):**
1. **Every circuit is an enumerated chain: `N ≥ 3` runs on every walled leaf, each carrying a
   `runType` from the closed set of nine and a cited cause.** Zero runs with cause `null`.
2. **Concentricity is refuted by measurement, not by eye**: on every multi-ring leaf the rings'
   normalized radius profiles differ (the pin that already exists, extended to *all* rings), and
   **no two rings share a bay-and-lobe signature.**
3. **Flank grammar lands in the corpus's frequency band**: across the walled corpus, full closed
   ring **≈55% ± a stated tolerance**, not 100%; ≥1 leaf terminating at water; ≥1 leaf with a
   terrain-surrender run carrying **zero towers**.
4. **§200 reads 0 with the run-type exemption in place AND the exemption is non-vacuous** — a
   counterfactual that removes the exemption must red on the wall-side-street runs, proving the
   exemption is doing work rather than hiding a defect.
5. **Every superseded circuit emits geometry into the current fabric**: ≥1 ring street whose
   trace matches the superseded circuit within the topology quantum, plus ≥1 of {tower dwelling,
   ditch garden band, gate widening} per demoted circuit. **Zero superseded circuits that emit
   nothing.**
6. **Containment residual stays 0 on every ring**; epoch members outside their own circuit stay
   **0**; §232 straddlers stay **0**.
7. **Chair eyes-on at 3000 px on a two-ring leaf**, judging one question: *can a reader see that
   this town had an older wall?*
8. ⟦FOLD §264⟧ ⭐⭐ **EVERY LEAF CARRIES ITS MEASURED FABRIC-EPOCH COUNT, WALLED OR NOT, AND THE
   UNWALLED LEAVES STOP READING 1 BY CONSTRUCTION** (G-42). Measurement: **epoch count per leaf
   lands inside PLAN §6.1's measured ladder — thorp/hamlet 1 · village 1–2 · town 2–3 · city 2–4 ·
   metropolis 3–4, ⛔ NEVER more than 4** — and **at least two unwalled leaves carry ≥2 epochs**.
   ⚠ **Counterfactuals, both required: (i) an epoch count derived from a population knob rather
   than from history must RED** (§240.2 — *derived, never a knob*); **(ii) a fifth epoch must RED**.
   ⭐ *And the circuit ladder must now be provably a SUBSET of the epoch ladder — zero circuits
   without an epoch, and epochs without circuits are expected rather than exceptional.*
9. ⟦FOLD §264⟧ **TOWERS: EITHER the corner rule lands WITH G-40(i)'s number quoted, OR the wave
   states in its receipt that the instrument did not arrive and the seeded-irregular policy stands.**
   ⛔ **There is no third option, and "it looks right" is not one of them** — that is precisely the
   condition §263.6a named as letting a plausible idea become an unmeasured habit.
10. ⟦FOLD §264⟧ **The defensive seat is edge-adjacent and outside the circuit BY CONSTRUCTION on
   every leaf that has one** — measured as a structural property (zero floating citadels, zero
   citadels not touching the circuit or the edge), **not as a scoring preference that usually wins**.
   ⚠ *A guarantee that is really a strong preference passes on today's exemplars and fails on the
   first awkward terrain.*

⚠ **AND THE METROPOLIS'S THIRD CIRCUIT IS THE MEASURED PRIZE OF THIS WAVE.** §252.3a: the cap
lifts **with** the run chain, then **by measurement under §217** — so the wave's own receipt owes
the op-ceiling arithmetic for a third circuit with its towers, gates and ditch against the 83
primitives of measured headroom, and an owner ruling if it does not fit.

---

### W3 · THE FABRIC ORDER — the highest visual return per unit of new input (G-10, G-18, G-7, G-19)

**Nothing in this wave needs a new dossier field or a new substrate. It is a reordering of the
pipeline we already have, and it is where the plate starts reading like the corpus.**

⟦FOLD §264⟧ ⭐⭐ **AND THIS IS WHERE THE PRIOR-ART FOLD CONCENTRATES: FIVE OF THE EIGHT NEW LEDGER
ROWS LAND HERE**, because S7 is this document's self-declared sharpest gap and §263.5 found that
three of the top four FTG adoptions land on the stages it already named as weakest.

**Contents:** attachment-not-intersection street generation with the `junctionMix` bands and φ as
a metric with its ceiling · blocks as the **planar faces** of the street graph (§239.1) with the
three shape bands · **the frontage line as a first-class object per block face** · the plot
series' clumped run-length rhythm, amalgamation/subdivision event and **corner plot** ·
`backlandCore` as a derived object, with courts classified against §209.4's band ·
⟦FOLD §287⟧ **a route-materialisation queue, priority-ordered only from canonical route load and
operations** (G-36; absent ranks mean no synthetic seed) · ⟦FOLD §264⟧ **snap-and-lengthen cleanup,
DEGREE-AWARE** · ⟦FOLD §264⟧ **ONE subdivision routine driven by G-38's four explicit canonical
parameters** — *not seven
district generators* · ⟦FOLD §264⟧ **subdivide to the PLOT, then FIT the footprint from a
rectilinear vocabulary** (G-37, SUB-2), with the **randomised STOP THRESHOLD** rather than a sampled
size distribution · ⟦FOLD §264⟧ **per-edge setbacks as the street-hierarchy mechanism** (SUB-1) ·
⟦FOLD §264⟧ **subdivide-to-make-room rather than rejecting a placement** when a gate road needs a
path · ⟦FOLD §264⟧ **road/water typed interaction** — bridge a river, terminate at an ocean (the
generation-side half of §262.2's arm (e)).

⚠⚠ **THE ONE STRUCTURAL DECISION IN THIS WAVE THAT CANNOT BE DEFERRED, AND IT IS EASY TO WALK PAST
BECAUSE NOTHING BLOCKS ON IT: G-38's FOUR AXES MUST BE THE SHAPE OF THE ROUTINE FROM THE FIRST LINE.**
Seven district generators all work, all pass, and make the parameterisation unaffordable to retrofit.
**Later canonical plan/parcel/occupation operations supply values; W3 supplies only the axes.**

**EXIT CRITERIA (measurements):**
1. **`X:T ≤ 0.09` and `deg≥5 share ≤ 0.01` on every leaf**, with `γ ∈ [0.39, 0.52]` and mean
   degree in `[2.1, 2.7]`. **Counterfactual: a lattice fixture must red.**
   ⛔ ⟦FOLD §297/§298⟧ **THIS EXIT IS SAME-INSTRUMENT OR IT IS NOT AN EXIT (§298.5a).** The bands
   came off a skeletonizer with unmeasured, large X-recovery loss; the wave either rasterizes its
   own output through that skeletonizer or publishes a synthetic-grid X-recovery correction first.
   **The RELATIVE arm (a lattice fixture must red; the castra reads 6× the median) is lawful
   today; the ABSOLUTE band is not, until the instrument is measured.**
2. **Block shape bands met per leaf**: elongation median **1.6–3.0**, solidity median
   **0.60–0.86**, area p90/p10 **≥ 6**. ⭐ *These convict a silent grow-then-clip, so they are the
   proof that §239.1 actually landed.*
3. **Frontage continuity measured per block face and banded**, with the b8 defect gone: **zero
   block front lines over ground carrying no buildings.**
4. **Plot-series rhythm measured as run-length structure, not variance**: adjacent-plot width
   correlation high **within** runs and broken **at** canonical split/amalgamation events. ⭐ **The
   diagnostic must distinguish clumped from uniform-random —
   a variance band alone would pass the defect §252.3c's zoom found.**
5. **Corner plots exist and are distinguishable**: 1.4–2.0× module area, L-footprint where the
   block turns, and street-facing commercial institutions preferentially anchored there.
6. **Route-isolated courts land in 3–15% of blocks with a floor > 0 at town+**, and interior
   yards *with a mouth* are counted **separately** and land in 15–65%. ⚠ *They are different
   objects and one census may not merge them.*
7. **All four drawn censuses stay 0; §202 landlocked stays 0; determinism 10/10; 96/96 under
   ceiling.**
8. **Grain re-measured with fabric-derived windows** (`MFB8-plates.mjs`, never hand-set) —
   **town and city verdicts must STAND**, and village must move toward its band or the miss must
   be attributed.
9. ⟦FOLD §264⟧ ⭐⭐ **THERE IS EXACTLY *ONE* SUBDIVISION ROUTINE, AND IT IS PROVED BY A SCAN, NOT BY
   A CLAIM** (G-38). Measurement: **a source scan finds ONE routine and zero per-district
   variants**, and **each of the four axes moves a named metric in an explicit fixture when perturbed** — size floor →
   `block_area_frac_p50`; grid chaos → `orientation_order_phi` / `orientation_entropy`; size
   variation → `block_area_cv` and `block_area_p90_over_p10`; emptiness → `backland_green_p50`.
   ⚠ **Non-vacuity: hold canonical plan/parcel/function/occupation facts fixed and the four scalars
   must be byte-identical; changing wealth or lawfulness alone moves none of them.** ⛔ *An axis that moves nothing measurable
   is decoration wearing a parameter's name.*
10. ⟦FOLD §264⟧ ⭐ **NO FOOTPRINT IS A WEDGE, AND IT IS TRUE BY CONSTRUCTION RATHER THAN BY A
   FILTER** (G-37, SUB-2). Measurement: **every footprint traces to a member of the rectilinear
   vocabulary**, zero footprints minted as subdivision remnants; **block solidity median 0.60–0.86
   and elongation median 1.6–3.0 hold**; and ⭐ **the alley/sliver floor (street width p25) moves
   from b8's 0.16 / 0.09 / 0.09 TOWARD 0.02–0.08** — *this is the fold's sharpest single prediction
   and the number that falsifies it.* ⚠ **Counterfactual: feed the fitter a wedge-shaped plot and it
   must place a smaller lawful shape with the residue as yard, never emit the wedge.**
11. ⟦FOLD §264⟧ **THE SNAP DID NOT MINT JUNCTIONS.** With snap-and-lengthen in place,
   **`X_over_TY` stays ≤ 0.09 and `star_share` stays ≤ 0.01 on every leaf.** ⚠ **The
   counterfactual is the point: disable the degree guard and the census must RED** — otherwise the
   guard is not doing work and the bands are passing for some other reason.
12. ⟦FOLD §264⟧ **STREET WIDTH IS THE SUM OF TWO FACING SETBACKS, AND IT IS SHOWN** (SUB-1):
   perturb what an edge faces and the visible channel width moves; **`street_share_of_hull` lands in
   band**; and ⭐ **§239's wall-side street appears on the wall-facing runs WITHOUT a wall-side-street
   rule in the code** — *the substitution's own proof is that the special case disappeared.*
13. ⟦FOLD §264⟧ **A street meeting water gets a TYPED interaction** — a crossing structure on a
   channel, a termination at open water — and **the street-over-water census reads the improvement
   G-34 predicted**, now from the generation side rather than the exemption side.

---

### W4 · HISTORY IN THE FABRIC (G-9, G-12, G-17, G-24)

**The epoch axis is built and inert. This wave makes it visible.**

⟦FOLD §264⟧ ⭐ **AND W2's G-42 IS WHAT MAKES THIS WAVE TESTABLE AT ALL BELOW THE WALL LINE.** Until
epochs became **fabric** epochs, six of the sixteen exemplar leaves carried exactly one epoch by
construction and **every criterion below was untestable on them.**

⛔⛔ ⟦FOLD §297/§298⟧ **AND THE SIZING OF THIS WAVE IS CORRECTED, BECAUSE THE FREE-DIVIDENDS CLAIM
IS REVERSED (§297.3c).** ⭐ **W2's G-42 DELIVERED EPOCH *COUNTS*. IT DELIVERED NOTHING ELSE.** The
**VINTAGE TRIAD — per-epoch GRAIN, per-epoch PLOT VARIANCE, per-epoch PIGMENT/TONE — is UNDELIVERED
ON ALL SIXTEEN EXEMPLAR LEAVES, not six.** The "six of sixteen" figure sizes the *epoch-count*
defect that W2 cured; it has never sized the triad, and §266.2a's magnitude is corrected here:
**sixteen of sixteen.** The epoch token appears in **zero content modules**. ⛔ **THE TRIAD IS
W4-CLASS REAL WORK AND MAY NEVER BE PLANNED AS A FREE CONSEQUENCE OF §240 LANDING** — a wave that
budgets it as a dividend will discover it as a wave. (The density gradient is the same class; the
§161g demotion is **W3's first item**.)

⛔ **§287/HEEP-1 SUPERSESSION.** W4 may make already-canonical dated history visible; it may not
derive morphology from current wealth or use the synthetic corpus as historical causation. The old
wealth→grain/backland/dead-end rules, automatic planned occupancy, four-stage decay ladder and
civic-core regularity prior are preserved below only as research/visual hypotheses.

**Contents:** per-epoch **grain**, **φ + bearing basis** and **attachment mode** only where dated
street/frontage/parcel artifacts actually differ · `PLAN_INTENT`/`PLAN_REALIZATION` occupancy state
with recorded unrealized geometry in ghost ink · typed `intramuralVacancy`/reuse · inherited
boundary handoff where a dated rural phase records it · one shared projection `ghostInk` · the
**label-free district-legibility census** as representation QA. W3 supplies the axes; history and
promoted mechanisms supply their values. Current wealth is not a geometry input.

**EXIT CRITERIA (measurements):**
1. **Multi-epoch distinction is causal:** perturb one registered construction/replanning operation
   and only its declared frontage/parcel components move in the declared direction. The synthetic
   ⟦FOLD §297/§298⟧ **1.33×–1.44×** newer/coarser PITCH ratio (⛔ *the published 1.8×–2.9× is
   WITHDRAWN as a window-width artefact, §298.5e*) is visual-study data, not a universal historical
   exit.
2. **Plan realization answers to its own intent and constraints.** φ may describe the projection,
   but 0.318–0.652/0.8 and an “organic sibling” are visual corpus bands, not a planned-town law.
3. ⛔ **WITHDRAWN AS A HISTORICAL EXIT:** current wealth does not set dead-end share. The proposed
   poor 0.26–0.34 / rich 0.15–0.22 split remains a synthetic visual hypothesis pending an eligible
   cohort and dated mechanism.
4. **The label-free census passes**: neighbouring characterised districts differ by **≥1.4× in
   median block area OR ≥1.3× in cells-across**, with a counterfactual that flattens one
   district's grain and reds.
5. **Intramural vacancy preserves its canonical state.** Explicit land uses cite dated facts;
   unknown use remains unknown. Terrain/institutions constrain but never mint a use, and no minimum
   count is imposed.
6. **Inherited boundaries retain lineage** when a registered agricultural/reuse operation consumes
   them; field bearing comes from the canonical `RuralLandscapePhase`, not a demotion renderer.
7. ⛔ **WITHDRAWN:** no four-stage or LIFO decay ladder is an exit. Typed operations, unknown-cause
   handling and exact preservation of unaffected components are the exit.
8. ⟦FOLD §264⟧ **LEGIBLE DISTRICT COUNTS LAND IN BAND BECAUSE SMALL ORGANISMS MERGED, NOT BECAUSE
   FEWER WERE MINTED**: town **3–6** · city **5–9** · metropolis **8–14**, with the merge threshold
   **derived from the tier's own band** rather than set. ⚠⚠ **AND THE GUARD THAT MAKES THE MERGE
   SAFE: `block_area_p90_over_p10` must stay ≥ 6.** *Merging away the smallest districts must not
   flatten the block-size spread the corpus demands — the spread IS the information (§2.4).*
   ⭐ *Legibility saturates well below enumeration; hf331 carries a dozen named things and reads as
   four districts.*
9. ⟦FOLD §287⟧ **SELECTIVE REGULARITY REQUIRES A DATED PLANNING/REALIZATION OPERATION.** When one
   exists, `orientation_order_phi` and block-shape metrics report its bounded effect and the
   inherited edge may remain different. No civic-core gradient is a default; ⟦FOLD §297/§298⟧
   7.9× / **9.4×** / 2.4×
   and φ 0.8 remain synthetic projection diagnostics, not historical activation thresholds.

---

### W5 · THE OUTSIDE (G-1, G-15, G-23, G-21, G-25)

⚠ **THE COUNTRYSIDE IS 85%+ OF A VILLAGE OR THORP PLATE AND IS THE PROGRAM'S WEAKEST SURFACE
(§229.2c, §252.3c). It is placed here rather than earlier only because W1–W4 change the fabric it
must meet at the junction band; a builder who can afford a second lane should run it in
parallel.**

⛔ **§287/`RSLP-1` SUPERSESSION.** This wave no longer derives a historical countryside from the
urban remainder. Its stable work is the canonical rural artifact seam, shared topology/refusal,
known-route provenance and projection vocabulary. Every regime, allocation, count, distance and
occupancy rule below is dormant unless a promoted `RSLP-1` mechanism or explicit world fact owns it.

**Contents:** the region from actual neighbour/route/hydrology facts · validated
`RuralLandscapePhase` land/holding/right/work/access artifacts · T-24's six ground primitives and
T-23's route rungs as **projection vocabulary** · the field/fabric junction through shared canonical
boundaries · edge/ribbon/gate relations only where dated urban mechanisms supply them · street width
from canonical graph load · named landmark bodies ·
⟦FOLD §264⟧ **enclosure-free fringe lots** — lots with invisible edges that need no surrounding
roads, so an already-canonical farmstead/worksite can stand **without a fabricated urban block**
· ⟦FOLD §287⟧ **outskirts representation keyed to canonical occupancy/access/enclosure** (never
thinned merely to make an unwalled settlement look intentional) · ⟦FOLD §287⟧ **the hinterland
reconciled with the town through the cadastral boundary arrangement, never generated from the same
urban-leftover lot substrate** · ⟦FOLD §264⟧ **monumental buildings as a separate two-axis rule** rather than as promoted
ordinary ones · ⟦FOLD §264⟧ **G-36's queue completed** — the region's road **ranks** replace the
W3 seed, which is what makes the unequal-ribbon criterion measurable.

⚠⚠ ⟦FOLD §264⟧ **AND ONE HANDOFF THIS WAVE MUST NOT ASSUME IS PERMANENT: THE LANDMARK BUDGET IS A
BAND HERE AND STOPS BEING THE SOURCE IN W6.** G-35's dependency-graph roster replaces the per-tier
budget as the **derivation**; the synthetic band survives only as projection QA. **Never add or
remove a named body to hit it.** W6 reports representation without treating the band as a roster.

**EXIT CRITERIA (measurements):**
1. **Canonical rural units remain byte-identical under projection changes.** The corpus's 10–30×
   visual parcel-size complaint may guide representation/LOD only; it cannot resize world fields.
2. **≥4 distinct ground primitives and ≥3 distinct road primitives per leaf where the land use
   and road web support them** — b6 draws 1 of 6 and 1 of 5.
3. **Village-and-below projection grain is measured on matched controls**, with canonical rural
   truth unchanged; the countryside cannot be declared the cause merely because the pixels move.
4. **Registered gate/ribbon projects retain their measured inequality.** The ≤2-gate and exactly
   one noxious-arc rules remain historical hypotheses, not exits.
5. **Street width classes derive from measured graph load**, with p97/p50 moving toward the
   organic band **16–30** (scanline) from b8's 9.9 / 12.1 / 12.4 — and the class ladder shown to
   be a quantiser (perturb the load, the widths move).
6. **Named landmarks are never thinned by representation ratio.** The synthetic count/size bands
   grade visual emphasis only and may not generate a historical roster.
7. **Every approach road's bearing traces to a named neighbour or resource; zero invented
   bearings.**
8. ⟦FOLD §287⟧ ⭐ **AN ALREADY-CANONICAL FRINGE BODY MAY USE AN ENCLOSURE-FREE LOT WITHOUT
   INVENTING A ROAD.** Measurement: zero roads generated purely to close a rural/fringe lot; every
   road traces to canonical access. `deadend_share` is reported as projection structure, but no
   required upward shift or historical band is attributed to the lot mechanic.
9. ⟦FOLD §287⟧ **THE HINTERLAND IS CANONICAL OR EXPLICITLY LIMITED.** `hull_frac_of_frame` and
   `green_excess` may grade its projection, but neither band nor the urban lot substrate derives
   land use. The receipt publishes canonical coverage, represented coverage and any
   `STRUCTURAL_ONLY` limitation separately.

---

### W6 · THE SYSTEMS — explicit canonical relations consumed spatially (G-13, G-14, G-22, G-6)

⭐ **This is §251.2's finding corrected by the live-source/evidence audit: canonical neighbour,
institution, resource, jurisdiction, hydrology and economic-flow relations become spatial claims;
property names and absent accessors do not.**

⛔ **§287 EVIDENCE/ACCESSOR SUPERSESSION.** The live dossier does not guarantee canonical generated
`supplyChains`, and no Wave-1 survey calibrates institution ratios, siting weights, domestic-water
bounds, custodian residence or material footprint grammars. W6 may spatialize explicit canonical
flows, functions, jurisdictions and resources; it may not create missing ones from regex, tier or a
visual band. `economicFlows` absent means dormant/refusal (§10.18).

**Contents:** explicit institution functions and prohibited physical relations · registered
jurisdictional multiplicity · directed canonical water/flow chains (clean take → registered process
→ registered discharge) · centre multiplicity from actual authorities · `AMP-1`-gated material
footprint grammar · ⟦FOLD §287⟧ **a resource-dependency graph whose nodes and denominator-bearing
edges are canonical facts or separately promoted mechanisms**. Producer/importer transitions occur
only when the world ledger records production, demand and trade; the graph never invents an importer
to make a roster close.

⭐⭐ **THE THREE LAYERS STAY SEPARATE:** a canonical roster answers ***what exists***; promoted
functional/capacity massing answers ***how large***; explicit siting predicates answer ***where***.
No layer may fabricate the input of another, and absence of a supply accessor is not permission to
reconstruct one from prose.

**EXIT CRITERIA (measurements):**
1. **Zero violations of every applicable promoted/canonical prohibited adjacency**, with a planted
   fixture that reds; no default tannery/upstream rule is manufactured where the relation is absent.
2. **Every placed institution cites an explicit siting predicate/fact; zero placements with cause
   `scatter`.** Institutions lacking enough spatial canon carry `UNSITED`/`STRUCTURAL_ONLY`.
3. **Every registered water-dependent institution occupies its declared slot in an ordered chain**,
   and upstream/downstream predicates hold. A mill is not assumed water-driven; unknown drive or
   discharge remains unknown rather than forced onto a race.
4. **An explicit dual-authority fixture preserves exactly the canonical duplicated institutions and
   no others**, with each instance in its recorded territory. Plot rhythm differs only when the
   canonical plan/parcel history differs; jurisdiction alone is not a texture dial.
5. ⛔ **DOMESTIC-WATER COVERAGE IS UNCALIBRATED.** An explicitly registered well participates in a
   walk-distance instrument and its removal raises the metric; no universal bound or greedy well
   placement executes without its own eligible evidence/program.
6. ⛔ **MATERIAL FOOTPRINT GRAMMARS ARE `AMP-1`-GATED.** hf327 remains a synthetic counterfactual
   fixture showing that two supplied grammars pack differently, never evidence that a resource or
   culture selects either grammar.
7. ⟦FOLD §287⟧ ⭐⭐⭐ **EVERY DERIVED ROSTER BODY TRACES TO A VERSIONED GRAPH EDGE WITH A STATED
   DENOMINATOR; zero entries cite `budget`, `tier-default` or an unavailable accessor.** Perturb one
   canonical production/flow input and only its declared dependency cone restructures. “Cannot
   produce ⇒ must import” is not automatic; an importer appears only from a registered demand/trade
   mechanism and otherwise the unmet dependency is reported.
8. ⟦FOLD §287⟧ **THE SYNTHETIC LANDMARK BANDS ARE PROJECTION QA, NEVER ROSTER CORRECTION.** Report
   3–7 / 4–9 / 9+ and footprint ratios beside the canonical result, but a miss cannot add, delete or
   resize a world institution. Named-body preservation and representation-ratio exclusions are the
   hard non-regression checks.
9. ⟦FOLD §264⟧ **NO AUTHORED CONTENT CROSSED THE LICENCE BOUNDARY.** A scan shows **zero
   prior-art node names, ratios or building pools** in the roster's data; **every node and every
   ratio derives from canonical fields or a promoted mechanism.** We take the typed, denominated
   graph shape only; producer failure does not imply an importer without explicit demand and trade.

---

### W7 · THE HAND (G-16, §214's terrain arm, G-26, G-27)

**§214's terrain arm unblocks here because W1 built its input.** The painted closure is MF-A1's
brief and is the largest remaining distance to §207's absolute bar.

**EXIT CRITERIA (measurements), all on the strongest-cohort bands:**
1. **paper grain σ ∈ 1.30–2.96 (target median 2.05)** — from **0.00**.
2. **within-fill wash σ ∈ 1.83–4.39 (target median 3.29)** — from **0.00**.
3. **per-fill tone IQR ∈ 8.0–66.5 (target median 22.0)** — from 4.0 at town/village/metropolis.
4. **wash mis-registration present and measurable at 2–8 px at native scale** — ⭐ *the decisive
   tell.*
5. **paper centroid within band at warmth 37; ink L ≤ 45 (full ink)** — b6 already MEETS ink L at
   35.0 and must not regress.
6. **≥5 distinct weights per leaf with p90/p25 inside 3.1–7.2** — b8 exceeds the count and sits
   **above** the ratio band; bring it into band or state why the excess is correct.
7. **Relief draws in hachure and rock hatch selected by land-form class, spacing tightening with
   gradient** — and the §9.5b acceptance test passes by eye.
8. ⚠ **Re-window `MFS1-aesthetic.py` to the new module BEFORE spending any of these numbers**
   (its 6.6 px sample windows are dominated by ground wash at the new grain).
9. **All of it produced as geometry or tiled patterns, never as raster filters** — the §9
   forbidden-construct scan stays clean and **PDF projection survives**.
10. ⟦FOLD §264⟧ **THE METRIC UNIT ANCHOR LANDS WITH §161i's TRUE MEASURE, AND ITS PASS CONDITION IS
   THAT NOTHING MOVES.** Every dimension becomes a real-world quantity — a frontage in metres, not
   in view units — which is what makes future parameters derivable rather than tuned. ⚠ **(c) is
   NEUTRAL BY CONSTRUCTION and the study says so rather than claiming a gain: a unit anchor cannot
   move a ratio metric.** ⭐ **So the measurement is a NULL: every band in §2 reads identically
   before and after, and the scale bar ships TRUE.** *A "win" reported here would mean the
   re-expression changed something it had no business changing.*

---

### W8 · THE CLOSING LOOP (G-29, G-5, G-24's re-run, §216)

**Contents:** spatial indexing with canonical insertion **and result** ordering, the
indexed-vs-exhaustive equivalence pin, and per-census runtime budgets · the population→extent
derivation home fitted **against our own leaves** · the §216 comparison round and the blinded
test against the frozen 313-plate north star and its **closed legacy pixel-evaluation roster**.

**EXIT CRITERIA (measurements):**
1. **Per-census runtime budgets in force, with a completeness status where "skipped due to scale"
   can NEVER read green.**
2. **The indexed and exhaustive census results are proved equal on fixtures**, not assumed.
3. **§220's performance gate passes app-realistically** — ⛔ **LAUNCH-BLOCKING for the map surface
   (§247.3a): a wow moment that takes twenty seconds to render is not a wow moment.**
4. **An extent fit over ≥16 leaves per tier with FACT populations, reported with its R², and
   cross-checked against the external 0.385 exponent for SHAPE agreement** — with the constant
   derived from our own data, never adopted from theirs.
5. **A fresh evaluator executes the pixel-withheld comparison against the closed 53-roster**, with
the honest limitation that it is **not an untouched calibration holdout** (§10.17), and whose ⛔
**ZERO trade (0/4) and ZERO institution (0/3) coverage** is stated in advance.
6. ⟦FOLD §275⟧ ⭐⭐ **THE COUNTERFACTUAL CAUSAL BENCHMARK EXECUTED (G-43): the seven-arm battery
   run with every component path, directional predicate, tolerance and forbidden token REGISTERED
   BEFORE the runs; Directional Responsiveness, Causal Precision, Collateral Share and
   Directional-Violation Share all reported; `E∩F=∅` pre-run and `A∩F=∅` post-run** — missing,
   wrong-direction, unexpected and forbidden changes are separate findings, never numbers to tune away. This is
   the exit that tests the thesis itself: *the map is the physical outcome of the world the
   dossier says exists.*
7. ⟦FOLD §275⟧ **The renderer-halo ablation run (G-44) on the same judging sessions as the
   blinded test**: structural-plausibility scored on bare geometry and on painted output
   separately, the halo delta reported, and **the structural verdict taken from the BARE
   condition** wherever the two disagree.
8. ⟦FOLD §275⟧ **The real-historical structural cohort in force (G-45)**: our own instruments run
   over the open preindustrial street-network dataset, its bands reported BESIDE the corpus bands
   for every structural figure this wave quotes — history winning on structure, the corpus on
   register, the dossier on cause.

⭐ **AND THE MARKETING ARTIFACT §247.3c NAMES IS A W8 OUTPUT, NOT AN AFTERTHOUGHT: ⟦FOLD
§297/§298⟧ THE SAME TOWN ACROSS GENERATIONS (year 1 → year 100 — growth, fire, shrinkage,
rebuilding).** Our epoch/drift/snapshot design already implies it, and after W2 and W4 it is a
rendering of work already done.

⛔ ⟦FOLD §297/§298⟧ **THE CLAIM IS QUALIFIED, AND THE UNQUALIFIED FORM IS WITHDRAWN (§293.1c).**
"The artifact no competitor can produce" is **not true as written**: Fantasy Town Generator also
sells *the same town across time*. **Two things separate ours, and both must be said, because
neither survives alone:**
- ⭐ **THE AXIS. Theirs is HOURS AND DAYS of simulation; ours is DECADES TO CENTURIES of
  DOSSIER-CAUSED, IMMUTABLE lived history** — a generational axis, not a clock. The history is
  caused by facts the world already holds and it cannot be re-rolled.
- ⭐ **THE ARTIFACT. Theirs is a LIVE IFRAME embedded in an integration; ours is a DURABLE STATIC
  DOCUMENT the user keeps.** FTG cannot hand a user a standing artifact; we hand them a page.

**The differentiator SURVIVES in that form and is stronger for being honest** — and the marketing
wording is the corrected one, never the withdrawn superlative (§249.4d: a superlative is a claim
and must be measured at its stated scope).

### §5.1 · WHAT THE ORDER BUYS, STATED PLAINLY

- **After W0** the water censuses **mean something**: a figure is comparable across terrains, a
  lawful crossing can actually be exempted, and a corpus total stops multiplying one river by six.
- **After W2** a walled settlement has a **biography** instead of rings.
- **After W3** a block reads as **fabric** instead of a bag of rectangles.
- **After W4** the epoch axis is **visible** rather than merely correct.
- **After W5** the low tiers stop losing on 85% of their own plate.
- **After W6** the settlement has a **plausible relationship to its world** — which is the exact
  deficiency §246 was asked about and CONTEXT §14 answered.
- **After W7** it stops reading as vector art.

⟦FOLD §264⟧ ⭐⭐ **AND WHAT THE FOLD ADDS TO THAT LIST, STATED IN THE SAME PLAIN FORM:**

- **After W0** three mechanisms that were about to be adopted on taste alone can be **checked
  against a number** — and one of them (towers) is held out of W2 if the number does not arrive.
- **After W2** an **unwalled village can have two vintages**, which it could not before at any
  price, because an epoch stopped meaning a wall.
- **After W3** there is **ONE subdivision routine with four dossier scalars** instead of a family of
  district generators — and **no footprint is a wedge, by construction rather than by a filter.**
- **After W6** the settlement's **roster is a division rather than a budget**: a landlocked town and
  a port with identical populations come out **structurally different from one graph**, and *"why
  does this town have three bakers"* has an answer.

⚠ **AND THE ONE THING THE ORDER DOES NOT BUY, SAID PLAINLY BECAUSE §264 RAISED IT: IMMERSION DOES
NOT ARRIVE EARLY.** §0.5 names what each wave shows and feels, and the honest reading of that table
is that **W0 shows almost nothing and W1–W2 show structure before beauty.** The chair's ruling is
that this is correct — *immersion built on wrong geometry is rebuilt, and the declared shift is paid
twice* — but the cost is real and the owner should adjudicate it with the cost visible rather than
hidden. **⭐ The mitigating fact, and it is a large one: §12's truth layer is ALREADY BUILT and is
already the place we beat the corpus. What is deferred is its subject, not the suite.**

⚠ **AND THE HONEST CAVEAT, KEPT ON THE RECORD FROM §247.4: on structure and truth the
"better than the leaders" claim is within reach and partly evidenced — town and city grain in
band, zero-violation geometry no reference plate holds itself to. On pure aesthetic polish we are
not there yet. THE PLAN IS SOUND; THE TIMELINE IS THE RISK.**

---

## ⟦FOLD §277⟧ §6 · THE DIMENSIONAL MAP — 2.5D, THE STRATA, AND THE FLOATING LANDS

### ⟦FOLD §277⟧ ARCHITECTED 2026-08-19 ON THE OWNER'S ORDER — DESIGN ONLY, NO IMPLEMENTATION.
### ⭐⭐ ⟦FOLD §278⟧ AMENDED SAME DAY; RECONCILED BY §287 ON 2026-08-20. Folded: **§6.7.10 EXPLICIT TRANSFER/RELOCATION OPERATIONS** (a sky change never resizes a wall or manufactures a social cascade) · **§6.7.11 INSTITUTIONS ALOFT** (candidate authoring/validation vocabulary; leaf assignment and regime require explicit canon) · **§6.7.12 TYPED VOID/CRATER LOSS** (explicit dated recovery only; debris conserved) · **§6.7.13 THE DERIVED LEAF ROSTER** · **§6.7.4 OPTIONAL `ShadeExposure` OBSERVATION** (licensed world-solar profile; no same-pass siting) · **Q-9 WITHDRAWN: NO INCIDENCE LAW** · **the offset kernel's declared shift RULED**. Marked ⟦FOLD §278⟧ throughout.
### ⭐⭐ ⟦FOLD §279⟧ AMENDED AGAIN SAME DAY: **§6.4.1 MATERIAL CONSISTENCY** — prosperity is read in the VARIANCE, not the level; the inverted-U; wealth/age/poverty held apart as three quantities; the **FALLEN** state; and ⛔ **the material ladder is REGIONAL**, which is the setting-agnosticism clause. Ledger row **G-63**.
### ⛔ ⟦FOLD §287 / AMP-1 WAVE 1⟧ EVIDENCE CORRECTION, 2026-08-20: §279's prosperity/variance relationship is now a **DORMANT RESEARCH HYPOTHESIS**, not executable owner law. Thirty European architectural cases support composite phase-owned parts, component-local material and independent roof/floor/facade campaigns, while also supplying counterexamples to material mixture as a poverty proxy. The inverted-U, richest/poorest uniformity, and planned-match/pressure-mismatch claims require the preregistered `AMP-1` cohorts and untouched holdout in §10.21–§10.22. Stable type boundaries survive; activation weights, probabilities and censuses that presuppose the relationship do not.
### ⭐⭐ ⟦FOLD §281⟧ AND **§6.11 THE TEMPORAL REGISTER** — season and occasion, on the owner's order: season is **TEMPORAL STATE** and may never move a WORLD hash; it is **CAUSAL, not cosmetic** (hf282 is the proof); the festival week is an **OCCASION DRESS** over it. Ledger rows **G-64…G-66**.
### The owner ruled that **ONE map replaces every other map view**, that it is **2.5D taken at a BIRD'S-EYE view**, and that it carries **LEVELS** — surface, undercity where present, and a new **SKY** level of floating magical lands. This section architects all of it. ⛔ **Nothing here is built, dispatched, or scheduled.** Every ruling below is vetoable; every figure is a derivation home, not a measurement.

---

### §6.0 · ⭐⭐ WHAT CHANGED, AND — MORE IMPORTANTLY — WHAT DID NOT

**The decision reads as a large amendment and is a small one, because the corpus was already asking for most of it.**

| Standing law | What it actually bans | Status under this order |
|---|---|---|
| **§153 ERA LAW** — "no GIS symbology, photorealism, or **fake**-3D on the Plan" | a drawn-on 3D *look* with no model behind it | ⭐ **UNCHANGED IN INTENT, CLARIFIED IN WORDING.** Our heights are canonical world facts and the plate is their projection. That is the opposite of *fake*. **AMENDED to read: no ELEVATION DRAWING on the Plan — no facades, no roofed vignettes, no buildings seen from the side.** |
| **ATLAS banned prior #5** — "Oblique/pictorial **projection** on the plan leaf" | the projection changing | ⭐ **RE-EXEMPLARISED, NOT REPEALED.** Every one of its seven exemplars is an *elevation* failure, not a height failure: hf12 "oblique with hatched roof **elevations**"; hf123 "bird's-eye w/ **facades**"; hf218 "the temple in **full elevation**"; hf248 "**3D houses**"; hf238 "**roofed vignettes**"; hf256 "bird's-eye 3/4 w/ **facades**". **The prior is restated as: FACADE / ELEVATION DRAWING IS BANNED. Projection stays bird's-eye. Height is not the ban.** |
| **§9.5 shadow ruling** | unbounded/renderer-authored softness | ⭐ **SUPERSEDED IN PART BY OWNER DECISION §288.** The corpus still licenses a hard-edged fixed-survey baseline. A finite registered softness band, analytic contact occlusion and the other deterministic perceptual terms in §10.8 are permitted; CSS/SVG blur, screen-space AO and cinematic whole-frame bloom remain forbidden. |
| **§166 UNDERGROUND STRATUM LAW** — "Idiom … **plan-view only**" | oblique undercity plans | **AMENDED: strike "plan-view only"; the stratum is 2.5D like every other leaf.** ⭐ **THE REGISTRATION LAW IS KEPT VERBATIM** — it is the best sentence in the charter on this subject and this section builds on it unchanged. |
| **§161f CONTINUOUS SCALE + HIGH-WATER** | — | ⭐⭐ **UNCHANGED AND IT IS THE SKY PROGRAM'S ENGINE.** See §6.7.7. |
| **THE PROMISE** (a seed is a starting world forever) | — | **UNCHANGED.** Every quantity below is derived or event-dated; nothing is a live parameter. |
| **SETTING-AGNOSTICISM** | — | ⚠ **UNCHANGED AND AT RISK.** See §6.7.1's gate and §6.10's Q-9. |

⭐⭐ **AND THE FINDING THAT JUSTIFIES THE WHOLE ORDER: THE CORPUS ALREADY GRADES US ON ROOF FORM, AND WE ALREADY FAIL IT.** ATLAS Table B carries three rows this section is the cure for:

| Corpus property | Corpus value | Generator today | Verdict today |
|---|---|---|---|
| One fixed light, hard-edged | universal | `SHADOW_DIR` cited as landed | **MEETS** ⚠ (see G-52) |
| Roads palest, roofs ≥3 steps darker | universal | held | **MEETS** — but on **ONE FLAT ROOF TONE** per lens |
| ⛔ **Roof ridge/hip ticks** | **~2 extra strokes per building** | *"a single diagonal stroke on some buildings"* | ⛔ **MISSES (partial)** |

> ⭐⭐⭐ **THE STANDING JUSTIFICATION, AND IT IS NOT AN AMBITION — IT IS A CURE: a ridge and a hip are ROOF-FORM GEOMETRY. The corpus asks for them per building, we draw a diagonal stroke on some buildings, and the row has been failing since it was written. 2.5D massing is how that row passes. It is the derivation the tick was always a stand-in for.**

And the tone band exists too: ⟦FOLD §297/§298⟧ `fill_tone_IQR` = **6.1 – 17.9 ≈ 18 – 59.3** (p5–median–p95, **HF-1 alone, n=49** — ⛔ *the union-cohort 8.0 – 22.0 – 66.5 is WITHDRAWN: tone IQR is a COMPONENT of the register index, so pinning it to the index-selected union was selection on itself, §298.2a*), with ATLAS's own note on hf34 — *"two nested levels: a **ward-level** sub-palette pick, then a **building-level** jitter inside it"* — which is the target structure for per-face tone. ⚠ **Banned prior #9 (`hf13`, "roof tones too uniform") presupposes roof tones exist and vary house to house.** A per-face tone under one fixed light produces that variation *causally* rather than by jitter, which is the §3.5 anomaly-is-a-collision doctrine applied to shading.

⛔⛔ **WHAT IS STILL BANNED AND MUST NOT BE SMUGGLED IN UNDER THIS ORDER:** facades · elevation vignettes · perspective · renderer-authored blur/drop-shadow filters · screen-space AO · cinematic whole-frame bloom · microfacet/photoreal glare · ray-traced/path-traced GI · participating-media or volumetric marching · any height cue not derived from canonical geometry. §288 permits only the bounded, deterministic, renderer-neutral perceptual composite defined in §10.8: analytic sky ambient, topology-derived contact occlusion, bounded reflected colour, factual environmental modulation, registered finite softness, restrained genuine-source glow and closed-registry material response. Those effects are projection truth with exact provenance, never invented WORLD geometry.

---

### §6.1 · THE PROJECTION CONTRACT

**One camera. One light. Every leaf.**

```
projection      ORTHOGRAPHIC, BIRD'S-EYE, ZERO TILT
                (strict plan; the reader looks straight down)
height cue      (1) CAST SHADOW under one global parallel directional light
                (2) ROOF-PLANE TONE — faces of one roof take
                    different tones because their normals differ
                (3) RIDGE / HIP / VALLEY / EAVE lines as ink
                NEVER a visible wall face. NEVER a facade.
depth/order     exact ViewOcclusionScene fragmentation + stable visible-surface order;
                conservative z bounds accelerate queries but never decide visibility
tone            4–5 discrete steps per material family; registered finite edge bands
```

⭐ **WHY ZERO TILT IS THE RIGHT ANSWER AND NOT A COMPROMISE.** A gable roof seen from directly overhead is **two planes meeting at a ridge**, each with its own normal, each taking its own tone under one light. A hip roof is four. A cross-wing is a valley. **Every roof form in the historical vocabulary is fully legible from straight above** — that is why plan-view roof plans exist as a drafting genre at all. Tilt buys visible wall faces, and visible wall faces are the banned thing. **We get the whole of the 2.5D payload and pay none of the projection cost.**

⭐⭐ **AND THE PROPERTY THAT MAKES THIS A SURVEYOR'S FOLIO RATHER THAN AN ILLUSTRATION: THE SHADOW IS A MEASURING INSTRUMENT.** Under one global parallel directional light of known elevation ε, a shadow's receiver-relative displacement is `Δ = H · cot ε`. **A reader can measure a building's height off the page with the scale bar** when the receiver is planar and the plate declares that datum. This is the Imola property §153 named as the ancestor, and it is a truth-layer win of the same family as banned prior #12 (*our labels are TRUE*). ⚠ **It also creates an obligation: the scale bar, applied light convention/azimuth/elevation and relief-precision warning must be on the plate, or the instrument is unreadable.** Routed to S23 as G-53 and bound by §10.8.

---

### §6.2 · ⭐⭐ THE LEAF LAW — AND THE OWNER'S SHARPEST CORRECTION

> ⭐⭐⭐ **A STRATUM IS A LEAF, NOT AN ALTITUDE. A LEAF IS A REGISTRATION FRAME FOR DRAWING; `z` IS A CONTINUOUS WORLD FACT. TWO FLOATING LANDS SIT ON ONE SKY LEAF AT TWO DIFFERENT HEIGHTS.**

**This is the owner's own observation and it is the load-bearing distinction of the whole section** (*"while the floating islands may appear on the same plane on the sky level view, it is unlikely that they are at the same height"*). Everything downstream depends on getting it right: if leaf and altitude were the same axis, every island at a new height would mint a new leaf and the folio would become unreadable.

```
leafIndex   -2  deep strata (mine galleries, deep works)
            -1  undercity / sewers                  §166, §168
             0  SURFACE — the flagship leaf
            +1  SKY — the floating lands            §6.7  NEW

support     continuous vertical placement is owned by each part's
            SupportSurfaceRef (§10.5), quantized in world units.
            Surface bodies sit on terrain; a floating body's cap/keel
            share one MAINTAINED_FREE_SPACE support whose local datum is
            its altitude. No two lands must share that datum.
```

> ⭐⭐ **THE SINGLE-LEAF LAW (the owner's first fix, ruled).**
> **EXACTLY ONE LEAF RENDERS AT A TIME. LEAVES ARE NEVER COMPOSITED.**
> §166's *"flipping reads as descending through one place"* is a rendering contract, not a metaphor. Turning the leaf is how a reader changes level; there is no transparency slider, no ghosted stack, no simultaneous multi-level view.
> ⛔ **NOBODY MAY BUILD A COMPOSITING PIPELINE.** A source scan refuses any renderer path that accepts more than one leaf's draw list.
> ⭐ **AND THE CONSEQUENCE THAT MATTERS FOR THE BUDGET: THE OP CEILING IS NOT MULTIPLIED BY THE NUMBER OF LEAVES.** §217's grant is spent on 2.5D massing on ONE leaf, not on ×3 for strata. A leaf that is not on screen costs nothing to draw. ⚠ *It still costs to **derive** — the world is whole even when the plate is not — so the generation budget and the render budget diverge here for the first time and must be reported separately from this section onward.*

**THE ONE PERMITTED EXCEPTION, AND IT IS NOT COMPOSITING:** every leaf carries a **REGISTRATION GHOST** — the faintest admissible trace of the surface's three orienting features (the water line, the circuit trace, the principal street spine) so a reader knows *where* they are underground or aloft. It is the mine-survey genre's own convention. ⛔ **The ghost is chrome, never fabric: it carries no bodies, is never censused as built ground, and may not be selected or hit-tested.**

---

### §6.3 · THE REGISTRATION LAW, EXTENDED — CONNECTION POINTS

**§166's registration law is kept verbatim and gains one object.**

> **§166 (unchanged):** strata align to the surface frame; connection points render on BOTH leaves; flipping reads as descending through one place. Empty strata never render.

> ⭐⭐ **THE CONNECTION-POINT LAW (the owner's fourth fix, ruled). A CONNECTION POINT IS ONE ENTITY WITH ONE IDENTITY THAT APPEARS ON TWO LEAVES. IT IS NEVER TWO OBJECTS THAT HAPPEN TO LINE UP.**

```
ConnectionPoint
  connectionId    EntityId — ONE identity, from lineage.js
  endpoints[2]    stable endpoint ids + leaf + host/support + support-relative height
  anchorXY        ONE plan position, shared by both leaves
  kind            STAIR · SHAFT · CELLAR_DOOR · WELL · GRATE
                  · ADIT · LADDER · RAMP · CHAIN_HOIST
                  · MOORING_MAST · TETHER_ANCHOR
  passable        who may use it (§168's DM-lens gating applies)
  clearHeight     for the vertical ground law (§6.5)
  constructionEpoch / removalEpoch
```

`PORTAL` is not a registered connection-point kind: it is a `PortalLink` with two independently
registered endpoints under §10.9. It shares one identity but does not falsely promise one XY.

⭐ **WHY THIS IS CHEAP NOW AND EXPENSIVE LATER, AND IT IS THE SAME ARGUMENT `lineage.js` ALREADY WON.** `lineage.js` states the law — *"IDENTITY IS NOT ADDRESS"* — and enforces it by construction: `institutionKey` takes no position argument **and cannot be given one**. A connection point is that law's hardest case, because it has *two* addresses and one identity. **Minting connection keys in `lineage.js` alongside the existing institution/district/parcel/road key spaces costs one function today.** Retrofitting identity onto two independently-generated objects that "line up" is the §238 one-artifact-one-accessor class all over again, and that class has already cost this program two waves.

⚠ **THE CENSUS THIS OWES:** every connection endpoint resolves its active leaf, host/support surface
and support-relative height, and both endpoints share the same `anchorXY` within the topology
quantum, or REDS. **Zero orphan connection points** — a stair to nowhere is the vertical form of
§201B's orphan street, and the same instrument shape catches it.

---

### §6.4 · CANONICAL VERTICAL GEOMETRY — THE WORLD HALF

**The rule that governs every line below: the renderer may not manufacture an architectural fact.** Heights, roof planes, keels and tether lengths are WORLD. Visibility, shadow polygons, tone bands and depth order are PROJECTION. A profile change may never move a WORLD hash.

⭐ **ONE BODY MAY HAVE MANY PARTS, AND THIS IS ALREADY OWNER LAW.** `THE_MAP_SUITE_CONSTITUTION.md`'s **INSTITUTION SILHOUETTE LAW** (owner, 2026-07-21) already rules: *"Massing is COMPOSITE, never single-extrusion … cathedral = nave + transept + tower + spire."* This section adopts it unchanged and extends it to ordinary fabric, defences and floating lands. ⛔ **`Building.height` as one scalar is REFUSED as truth** — a summary index is permitted; the geometry comes from the parts. A palace with a low service wing and a high hall, or a curtain with a taller tower, must not degenerate to one extrusion.

```
MassPartQ                         the unit of quantized vertical truth
  partId          EntityId (lineage.js)
  parentBodyId    the semantic building / wall / island
  morphologyRole  MAIN_RANGE · CROSS_WING · REAR_RANGE · ANNEX · LEAN_TO
                  · STAIR_TOWER · GALLERY · PASSAGE
                  · CURTAIN_RUN · WALL_TOWER · GATEHOUSE
                  · KEEP · BELFRY · SPIRE · COVERED_PASSAGE
  functionalProgram  total KNOWN / UNKNOWN disposition; KNOWN value is
                  DOMESTIC · HALL · SERVICE · WORKSHOP · BARN
                  · WAREHOUSE · STORE · INSTITUTION · DEFENCE · MIXED
  solid           footprint + support + closed shell — the sole geometric authority
  roof            total PRESENT / NONE / UNKNOWN disposition; PRESENT owns RoofForm refs
  functionalVolume / floorProgram          hall void ≠ stacked floors ≠ loft
  materialSlots[]                          total PRESENT / NONE / UNKNOWN slots for
                  base/frame/infill/skin/covering/repair under one exact slot schema
  constructionEpoch / removalEpoch      (§240's epoch axis)
  component conditions                     dated exact registry + operation provenance;
                  any part summary is a proved cache

RoofForm                          analytic first, always
  kind            GABLE · HIP · HALF_HIP · SHED · CROSS_GABLE
                  · COURTYARD_RANGE · TOWER_CAP · COMPOUND
  surfacePatchIds[]               references the owning solid's upper envelope
  edgeRefs[]      RIDGE · HIP · VALLEY · EAVE topology; projection derives
                  the ink the corpus asks for from the same shell surfaces
```

⭐⭐ **ROOF PRECEDENCE IS NORMATIVE, AND A GENERAL SOLVER IS NOT THE DEFAULT.** A-DOC and B-DOC agree and both are right: route ordinary fabric through explicit analytic grammar, and reserve a straight skeleton for the genuinely irregular significant footprint. *A cottage does not need a wavefront solver, and history overrides mathematical convenience: a later lean-to against an older hall is **not** one roof over the unioned footprint — it is a younger mass with its own roof dying into the older wall.*

```
EXPLICIT CANONICAL RoofSpecification(kind + campaign + drainage/semantic intent) REQUIRED FIRST
near-rectangle + supplied compatible kind     → analytic compiler path
frontage range/row + supplied range spec       → analytic range compiler
L / T / cross-wing + supplied compound spec    → compose analytic ranges + valley
courtyard complex + supplied range graph        → compile declared drainage directions
irregular significant + supplied roof spec      → straight-skeleton implementation candidate
landmark + supplied semantic grammar            → semantic compiler path
```

Footprint class selects an **algorithm**, never a historical roof form. A rectangle does not choose
gable over hip or shed. D3a accepts an explicit authored/canonical `RoofSpecification`; only the
D3b `roofFormResolver` may derive one from a supported AMP mechanism with an exact evidence binding.
Projection ink is then a pure derivation from the stored patch/edge topology.

⚠ **A SKELETON FAILURE MUST NEVER SUBSTITUTE A DIFFERENT ROOF.** It emits
`ROOF_COMPILE_FAILED` / `MASSING_CANON_INCOMPLETE`; publication either fixes the implementation for
the same specification or uses the explicitly recorded whole-map `PLANAR_V1` representation. A
An external `RoofCompileReceipt` is legal only when an alternate algorithm proves byte/geometry
equivalence to the same `RoofSpecification`; it never participates in the roof/massing hash and may
never choose “the simplest” form, alter drainage or invent a historically different roof after
compiler failure.

⚠⚠ **THE HEIGHT DERIVATION IS NOT A WEALTH MULTIPLIER, AND THIS IS A REFUSAL BOTH RESEARCH DOCUMENTS ARGUE FOR.** ⛔ `height = base + wealth * k` is **REFUSED**. Height is the cheapest legal answer to a *capacity* problem under a *structural grammar*, conditioned on function, land pressure, period and neighbouring frontage. **A hall is a TALL VOLUME, not stacked floors; a granary, a nave, a gatehouse and a house must not all read as storeys.** ⚠ **AND WE HOLD NO VISUAL-CORPUS BAND FOR STOREY COUNT — the measured register has 47 fields and not one is a height.** G-51P grades projection only. `AMP-1` may promote scoped conditional engineering ranges after its gates pass; historical occurrence distributions for storey, height, pitch, roof form and material remain `NOT_IDENTIFIED`/`NONE` until a separate probability-sampling protocol supplies an eligible denominator.

---

#### ⟦FOLD §279 / SUPERSEDED AT §287⟧ §6.4.1 · MATERIAL ASSEMBLY — COMPONENT TRUTH SURVIVES; THE PROSPERITY CURVE DOES NOT YET

⛔ **BINDING SUPERSESSION (2026-08-20).** The remainder of this subsection preserves the §279
proposal so its provenance is auditable, but its prosperity curve, annex/material correlations and
acceptance censuses are **non-normative research hypotheses**. They may not enter runtime, tuning,
fixtures, authoring expectations or promotion exits until `AMP-1` preregisters eligible status,
resource, function, age, repair and survival cohorts and passes its sealed holdout. The stable law is
narrower and stronger:

1. a semantic building owns phase-specific mass parts rather than one extrusion;
2. structure, base, frame, infill, cladding, covering and repair are component-local material facts;
3. function, capacity, hazard/regulation, resources, chronology and capital layer are distinct causal
   inputs, none recoverable from appearance alone;
4. mixture or mismatch has no default social meaning: it may record deliberate structural zoning,
   repair, reuse, replacement, fire regulation, accretion or decline; and
5. the European regional material system itself remains dormant until `AMP-1`; narrative
   `cultureId` never selects it.

Everything below through the old census table is therefore **ARCHIVAL §279 HYPOTHESIS TEXT**. It is
retained to prevent the attractive theory from being rediscovered without its counterexamples; the
binding runtime contract resumes with §6.5 and the corrected types in §7.1.2.

> **ARCHIVAL §279 HYPOTHESIS (2026-08-19; not runtime law):** A complex's parts and materials were
> proposed as a prosperity signal, with matched high-grade rich complexes, mixed middle complexes
> and single-part low-grade poor complexes. `AMP-1` Wave 1 supplied counterexamples and moved this
> entire relationship back to research.

⭐⭐ **WHY THIS IS THE RIGHT MECHANISM AND NOT THE OBVIOUS ONE.** The obvious rule is `wealth → better material`, and it is weak: it produces a monotone ramp that reads as a colour key. **The owner's rule is second-order — wealth buys GRADE *and* buys UNIFORMITY — and a second-order statistic is far harder to fake and far more legible.** Two complexes with the identical *mean* material grade read completely differently when one is matched and the other is patched. ⭐ *A wealthy household builds a whole range at once from one purchase of good stone. A poor household accretes over generations from whatever was to hand. **The patchwork IS the poverty**, and both research documents reached for exactly this quantity independently — `MaintenanceState.patchwork` and `MaterialState.alterationMix` are in both proposed schemas.*

##### ⭐⭐ THE INVERTED-U — and it is what stops this becoming confetti

**Material variance is NOT monotone with poverty. It peaks in the middle and falls to near zero at BOTH ends, and that falls out of the owner's own rule without being added:**

```
   variance
      ▲
      │              ╭──╮
      │           ╭──╯  ╰──╮
      │        ╭──╯        ╰──╮
      │     ╭──╯              ╰──╮
      └──┬──────────┬──────────┬────▶  prosperity
      POOREST     MIDDLE      RICHEST

  POOREST   ⭐ variance ≈ 0 BY CONSTRUCTION — one part, nothing
            to be inconsistent WITH. Uniformly the cheapest thing.
  MIDDLE    ⭐ variance PEAKS — annexes affordable, matching them
            is not. This is where patchwork lives.
  RICHEST   ⭐ variance ≈ 0 BY CHOICE — many parts, all matched,
            because matching is exactly what the money buys.
```

⭐⭐ **THE PROPERTY THIS BUYS, AND IT IS THE REASON TO ADOPT IT: THE RULE PRODUCES GRAIN EXACTLY WHERE THE CORPUS ASKS FOR GRAIN AND CALM EXACTLY WHERE THE CORPUS ASKS FOR CALM.** ATLAS banned prior #9 wants variance *within* a settlement ("real settlements always have a rich street and a poor one") and PLAN wants the poor quarter *visibly more tangled* than the rich one. **An inverted-U in material variance delivers both from one derivation** — and it is self-limiting, so the plate cannot become confetti no matter how poor the town.

##### ⭐⭐⭐ THREE STATES A NAIVE MODEL WOULD CONFLATE — and telling them apart is the whole prize

```
RICH        many parts · uniformly HIGH grade · clean seams
POOR        one part   · uniformly LOW grade  · nothing to seam
FALLEN      ⭐⭐ a HIGH-GRADE CORE WITH LOW-GRADE PATCHES —
            the single most legible state in the whole grammar,
            and MAXIMUM variance
```

⭐⭐ **"FALLEN" IS THE STATE §6.7.10 AND §161g BOTH NEEDED AND NEITHER COULD DRAW.** The displacement law's signature — *an elite plot pattern in non-elite occupancy* — was a **cadastral** claim with no material expression. This gives it one: **an ashlar hall with a wattle lean-to and a patched roof.** A reader sees the fall without a legend, without prose, and without looking at the sky leaf. ⭐ *It is also what makes a demoted quarter distinguishable from a quarter that was always poor — which §161g has always needed and has only ever expressed through ruin rungs.*

##### ⚠⚠ TWO CAUSES OF VARIANCE, AND CONFLATING THEM WOULD BE A REAL ERROR

**A three-hundred-year-old great house has material variance too — and it is a WEALTH signal, not a poverty one.** Historic phased buildings preserve exactly this: a medieval hall, a later cross-wing, a further extension, **material changes**, a reroofing — each phase built *well*, in its own period's material.

| | **POVERTY PATCHWORK** | **PHASE VARIANCE** |
|---|---|---|
| grade | **lower**-grade patches on a higher-grade core | **high** throughout; the *era* differs |
| within a part | inconsistent — the part itself is mixed | ⭐ each part **internally uniform** |
| the seam | ragged, small, opportunistic | ⭐ **clean, deliberate, dated** |
| correlates with | condition, deferred maintenance, `patchwork` | ⭐ **age and epoch count** |
| reads as | decline | ⭐ **depth of history — and therefore wealth** |

> ⭐⭐⭐ **THE CORRECTED LAW, IN THREE QUANTITIES RATHER THAN ONE:**
> **WEALTH predicts material GRADE and within-part CONSISTENCY.**
> **AGE predicts material ERA-VARIANCE across parts.**
> **POVERTY predicts within-part PATCHWORK.**
> ⭐ **The consequence is the best outcome in this subsection: THE OLDEST WEALTHY HOUSES ARE THE MOST MATERIALLY VARIED *AND* THE MOST OBVIOUSLY WEALTHY** — because every phase was built well. No competitor's generator produces that read, and it falls out of holding the three quantities apart.

##### ⛔⛔ THE LADDER IS REGIONAL — this is the setting-agnosticism clause and it is not optional

> **"HIGHEST-GRADE MATERIAL" MEANS HIGHEST ON *THIS REGION'S* LADDER. IT DOES NOT MEAN STONE.**

⛔ **If wealth universally buys stone, every rich building on every map is stone and the product has acquired a house style — which is a direct violation of setting-agnosticism.** The ladder is local:

```
stone country     rubble → coursed rubble → dressed stone → ashlar
timber country    wattle → cruck → box-frame → close-studded w/ carving
brick country     mud brick → fired brick → moulded/rubbed brick
earth country     cob → rendered cob → stabilised earth w/ stone plinth
turf / sod        turf → turf on stone footing → timber-framed
```

**Prosperity buys POSITION ON THE LOCAL LADDER. It never buys a particular material.** ⚠ **This is A-4's judgment call finally being made** — *"the mapping from a resource list to a material grammar … affects every footprint on every leaf"* — and G-6 already holds it with a gate on it. ⭐ **G-47 carries the identical bounded law for walls**: an evidence-versioned European region/period/resource system selects material and geology constrains it; narrative culture does not. **This is that ruling extended from the circuit to the fabric, which is why it is cheap and why it will be consistent.**

##### THE CEILING IS PER CAPITAL LAYER — institutions are exempt and must be

⚠ **Material grade scores against the ceiling of the RELEVANT capital layer, never the settlement's household ceiling.** A cathedral's capital comes from elsewhere; an abbey in a poor village is historically normal, and the prosperity research is explicit that institutional monumentality must not imply rich neighbours. ⛔ **An ashlar minster in a wattle village is CORRECT and must never be censused as an inconsistency.** *It is, in fact, one of the strongest single facts a settlement plate can carry.*

##### ⭐⭐ THE JOIN THAT FALLS OUT FREE — the two annex channels become visually distinguishable

**The prosperity research proposes two annex channels but gives no rendering hook to tell them apart. This rule is the hook:**

```
PLANNED EXPANSION      capital-driven      ⭐ MATCHES its parent's material
                                             (the merchant's warehouse wing)
PRESSURE INFILL        crowding-driven     ⭐ DOES NOT MATCH — cheaper,
                                             salvaged, whatever was to hand
                                             (the improvised lean-to)
```

⭐ *Same object class, same geometry, two social mechanisms — and now one glance separates them.*

##### THE CORPUS HOOK — leg (b), and it exists

**Material consistency is measurable as within-complex fill-tone separation, and the corpus already carries the band:** ⟦FOLD §297/§298⟧ `fill_tone_IQR` = **6.1 – 17.9 ≈ 18 – 59.3** (HF-1 alone, n=49; ⛔ *the union-cohort 8.0 – 22.0 – 66.5 is withdrawn — index-component axes pin to HF-1 alone, §298.2a*), with hf34's target structure being *"two nested levels — a **ward-level** sub-palette pick, then a **building-level** jitter inside it."* ⭐ **This rule supplies a legitimate THIRD level (part-level, within a complex) and the inverted-U keeps it from breaking the nesting**, because part-level variance is rare at both ends of the prosperity range. Corroborating evidence is already annotated: **hf26** — *"Material differentiates vintage; the new quarter's roofs are a different pigment because post-fire regulation forced tile"* — and **hf15**'s arid ladder reading as *"lower chroma separation."*

⚠ **LOD: part-level material renders only where parts are individually drawn.** At overview a complex is one tone. Otherwise the third nesting level becomes the confetti hf34's structure exists to prevent.

##### ⚠⚠ THE SHIFT, NAMED

⛔ **THIS IS A DECLARED-SHIFT CLASS AND A-4 SAYS SO IN ADVANCE** — a material grammar *"affects every footprint on every leaf."* ⭐ **It must therefore ride WITH the massing wave (G-49), which already carries a shift, and never as a separate one** — the §0.3a attribution rule again: two shifts in one receipt cannot be told apart, and the cheapest fix is to make them one shift with one cause.

##### THE CENSUSES

| census | must read | catches |
|---|---|---|
| **inverted-U holds** | material variance vs prosperity is non-monotone, near-zero at both extremes | a monotone ramp — the colour-key failure |
| **grade tracks the LOCAL ladder** | zero complexes above their region's top rung; zero universal-stone rich buildings | ⛔ setting-agnosticism breaking |
| **fallen ≠ poor** | high-core/low-patch complexes are distinguishable from uniformly-low ones | the state §161g could never draw |
| **phase ≠ patchwork** | era-variance correlates with epoch count; patchwork correlates with `condition` | ⭐ conflating age with decline |
| **institutions exempt** | institutional grade scores against institutional capital; **0** false inconsistencies | an abbey convicted for out-classing its village |
| **annex channel legible** | planned annexes match; pressure annexes do not | two mechanisms rendering identically |
| **nesting survives** | within-complex variance does not lift `fill_tone_IQR` out of band | confetti at plan scale |

---

### §6.5 · ⭐⭐⭐ THE VERTICAL GROUND LAW (S20 EXTENDED) — SPECIFY BEFORE MASSING

> **THE SINGLE LARGEST NEW INVARIANT THIS ORDER CREATES (the owner's third fix, ruled). §17's non-overlap law is today purely 2D and AREA-TRUE. It must become VOLUME-TRUE, and it must be specified BEFORE massing is built, not retrofitted after.**

⭐ **WHY THE ORDER MATTERS AND WHY IT IS NOT A PREFERENCE.** Today `groundLaw.js` clips a footprint against every claim it meets, and *"clipping cannot fail — it can only exhaust."* That is a strong property and it is 2D. The moment a gatehouse spans a road, the current law convicts a legal building. **If massing lands first, every legal vertical case arrives as a census violation and the cure will be an exemption list — which is exactly the G-34 disease the program has already paid for twice.**

**THE PREDICATE:**

```
possibleConflict(A, B)  =  overlapXY(A, B) ∧ overlapZ(A, B)

classify(A, B):
    ¬overlapXY            → DISJOINT
    ¬overlapZ             → VERTICALLY_SEPARATED     ← legal, and
                                                       the whole point
    declared attachment   → validateDeclaredAttachment(A, B, kind)
    otherwise             → ILLEGAL_INTERSECTION
```

**THE DECLARED-ATTACHMENT VOCABULARY — the closed set of legal contacts:**

| kind | the case it legalises |
|---|---|
| `SHARED_WALL` | the party wall — **already §17's correct case, now typed** |
| `BUTT_JOINT` | a later range dying into an older gable |
| `LEAN_TO_ABUTMENT` | an outshut against a standing wall |
| `TOWER_IN_WALL` | a wall tower sharing curtain solid |
| `ROOF_VALLEY` / `RIDGE_CONTINUATION` | roofs meeting legally |
| `SPANS_BELOW` | ⭐ **gatehouse over a road, bridge over water, covered passage** — carries `clearHeight`, and the span is legal **only if** the clearance is met |
| `SUBTERRANEAN_UNDER` | ⭐ an undercity gallery running beneath a surface body — legal with a stated rock/fill separation |
| `TETHERED_ABOVE` | ⭐ a floating land above ground it does not touch (§6.7) |

⭐ **THE FOUR CASES THIS LAW EXISTS TO TELL APART, WHICH NO 2D PREDICATE CAN:**

```
house standing in the carriageway            → ILLEGAL      (§17.4 unchanged)
gatehouse spanning it with clear passage      → LEGAL        SPANS_BELOW
bridge over water                             → LEGAL        SPANS_BELOW
undercity gallery under a cathedral           → LEGAL        SUBTERRANEAN_UNDER
annex driven through a standing hall
    with no declared construction relation    → ILLEGAL
```

⚠⚠ **THE NON-VACUITY OBLIGATION, WHICH IS THE WHOLE LESSON OF §200'S RUN-TYPE EXEMPTION.** Every attachment kind must be proved to be doing work: **withdraw the kind and a counterfactual census must RED.** An attachment vocabulary that never convicts anything is an exemption list wearing a law's clothes.

⚠ **AND THE CENSUS MUST BE VOLUME-TRUE, NOT VERTEX-SAMPLED.** §274.4(b) caught the point-vs-area class firing at the instrument level on a battery that publishes "AREA-TRUE" while measuring at the vertices. **The vertical census inherits that hazard at higher dimension and must be written volume-true from its first line.**

---

### §6.6 · THE LIGHT CONTRACT

#### §6.6.1 · One light, fixed, hard-edged

```
azimuth     α   ONE fixed cartographic bearing, page-fixed,
                shared by terrain relief, fabric and every leaf
elevation   ε   ONE fixed angle
unit vector L = (cos ε sin α, cos ε cos α, sin ε)
shadow ray  d = −L
```

⭐ **THE AZIMUTH IS A REFINEMENT WITH REAL EVIDENCE BEHIND IT, AND IT IS GRADE B.** `THE_MAP_SUITE_CONSTITUTION.md` M-0 specifies "the ONE fixed NW light (`SHADOW_DIR`)". A-DOC supplies controlled cartographic research (Biland & Çöltekin, plus a later replication) finding **337.5° NNW** gave the highest accuracy and confidence among tested directions for shaded-relief interpretation, over the conventional NW. ⚠ **The evidence concerns TERRAIN RELIEF, not roofs** — so it is a strong starting hypothesis and **not** proof that 337.5° is right once dense fabric, walls and labels are present. **It matters more now than when M-0 was written, because W1 landed the relief field (§273) and terrain and roofs share one light.** ⛔ **It is a candidate for a bake-off, never a law.** Routed as G-50.

#### §6.6.2 · ⭐⭐ Additive per-source light — the invariant that survives multiple sources

> **A SHADOW IS THE ABSENCE OF ONE SOURCE'S CONTRIBUTION. IT NEVER SUBTRACTS LIGHT CONTRIBUTED BY ANOTHER SOURCE.**

```
L_direct(x) = Σ_i  V_i(x) · T_i(x) · L_i(x)          ⭐ ALWAYS
L_direct(x) = Σ_i  L_i  −  darkness                  ⛔ NEVER
```

⚠ **WHY THIS IS ADOPTED NOW WHILE THE MAP HAS ONE LIGHT AND THE BUG CANNOT YET APPEAR.** The moment a second source exists the sequential-black-overlay defect is one careless compositing line away, and it is invisible in review because the plate merely looks *dark*. **Three sources are already scheduled or implied:** the fixed cartographic light; **`magelight density`, already in M-0b's condition ladder**; and the night register, which the corpus already holds a keeper for (**hf277 town-night-plan**, with *"unhaloed ochre lamp dots, rich-lit vs poor-dark"*). ⭐ *Adopting the contract costs one paragraph today and is unaffordable to retrofit through a renderer.*

**THE MINIMUM ADVERSARIAL FIXTURE SET (it is small, and every row has caught a real bug in the literature):**

| fixture | required result |
|---|---|
| A blocked, B visible | B survives **unchanged** |
| the same shadow polygon generated twice | **no double darkness** |
| B switched on | radiance rises or holds **everywhere** — never falls |
| tower above curtain | additional reach `Δℓ = (H_t − H_w) cot ε` |
| shadow crossing ground → wall-top → roof | one continuous volume, receiver-dependent boundary |
| light profile switched | **WORLD hash unchanged** |

#### §6.6.3 · ⭐⭐ HEIGHT IS OFFSET; KEEL IS SILHOUETTE — the physics, stated exactly

**The owner asked whether differing heights change the size of the shadows floating lands cast. The honest answer has two halves and the second one is the interesting one.**

⛔ **UNDER THE CANONICAL PARALLEL DIRECTIONAL LAW, HEIGHT DOES NOT CHANGE THE GEOMETRIC UMBRA SIZE.** The global source's rays are parallel, so an object's umbra is the same size as its light-space silhouette no matter how high it sits. §288 may apply a finite registered edge/softness band as projection tone, but that band never changes the authoritative silhouette, receiver intersection or measurable displacement. A geometric size-change would be *ambiguous*: a bigger shadow could mean a higher island or simply a bigger island, and an instrument that cannot be read is not an instrument.

⭐⭐ **WHAT HEIGHT DOES CHANGE IS DISPLACEMENT, AND THAT IS THE BETTER SIGNAL:**

```
Δ = H · cot ε          along the light's azimuth

worked, at ε = 40°:    cot 40° ≈ 1.192
  island at H = 120    → shadow lands ≈ 143 units downwind
  island at H = 300    → shadow lands ≈ 358 units downwind
```

**Two islands of identical outline at different heights cast identically-shaped shadows at different distances — and a reader can measure the difference with the scale bar.** That is unambiguous, derivable, and it is the surveyor's-folio property again.

⭐⭐⭐ **AND THE SECOND HALF, WHICH IS WHERE THE OWNER'S INTUITION IS EXACTLY RIGHT: THE KEEL CHANGES THE SHADOW'S SHAPE AND CAN GENUINELY MAKE IT LARGER THAN THE PLAN OUTLINE.** A floating land is not a disc. Its shadow is the projection of its **light-space silhouette** — cap *and* keel — not a copy of its plan outline. For a keel of depth `D` hanging below a cap of radius `R`:

```
the keel tip's shadow is displaced  D · cot ε  from the tip's plan position

D · cot ε  <  R      → the keel hides inside the cap's shadow
                       the shadow reads as the cap's own outline
D · cot ε  ≈  R      → the shadow begins to pull out of round
D · cot ε  >  R      → ⭐ THE SHADOW GROWS A TAIL — a teardrop
                       drawn downwind, and the deeper the keel
                       the longer the tail
```

⭐ **THE CONSEQUENCE IS A GENUINELY BEAUTIFUL CARTOGRAPHIC CONCEIT, AND IT IS FREE:** looking straight down, **the underside of a floating land is never visible.** Its shadow is the *only* evidence the plate carries of the keel's form. **The map records the shape of a thing it cannot see.** That is exactly what a surveyor's document does, and it means the keel is not decoration — it is the thing the shadow is *of*.

⛔ **THEREFORE: A SHADOW IS NEVER "THE OUTLINE, OFFSET".** A-DOC's rule is adopted verbatim — *"copy footprint and offset it is fundamentally wrong."* The shadow is derived from the silhouette of the real 3D hull.

#### §6.6.4 · What is refused

⛔ **METHOD/EFFECT BOUNDARY — SUPERSEDED IN PART BY OWNER DECISION §288.** Microfacet or
photoreal glare, renderer-dependent specular flare, ray/path-traced global illumination,
participating media, volumetric marching, GPU-authoritative geometry and screen-space effects remain
refused. The historical plan corpus supplies no optical coefficients and may not be cited to invent
them. What is now permitted is a finite renderer-neutral projection model: registered material
response, analytic sky ambient, bounded local reflected colour, topology-derived contact occlusion,
factual environmental modulation, controlled finite softness and restrained glow from an exact
active source. Every nonzero coefficient/profile requires an explicit registered convention,
canonical observation or separately calibrated perceptual-lighting pack; UNKNOWN stays neutral.
None of these terms changes WORLD geometry or authorizes historical prevalence.

---

### §6.7 · ⭐⭐⭐ THE FLOATING LANDS — THE SKY LEAF

**The owner's design, architected. Every quantity below has a derivation home in facts the dossier already holds; nothing here is a free parameter, and nothing here is a knob.**

#### §6.7.1 · THE GATE — world-law first, and it is NOT a tier gate

```
REQUIRED, ALL:
  canonicalMagicState.magicExists      === true      ⛔ dead-magic worlds: DORMANT
  canonicalMagicState.level            === 'HIGH'    (the top registered rung)
  canonicalCapacityOccupation.magical  ∈ {SURPLUS}   ← NOT merely ADEQUATE
  a sustained magical SURPLUS over the settlement's own consumption
  economic capacity to pay the standing upkeep
  a canonical arcane AUTHORITY fact keyed by stable institution/faction id
      authorityRole === 'MAGICAL_AUTHORITY'
      AND exact maintainedWorkOperationId + OWNS / CHARTERED_MAINTAINER relation
  a magical_node in supply — own resource or a secured trade lane
      (resourceData.magical_node → supplyChainResourceIndex:
       arcane_magical.alchemy · .spellcasting · .magical_goods)
```

⛔ **NAMES ARE NOT AUTHORITY.** `ARCANE_INSTITUTION_PATTERN`, institution-title regexes and prose
classification may remain migration/advisory diagnostics, but they cannot satisfy `magicGate`, mint
a floating-land body or choose a political regime. Even the closed `magicalAuthority` role is
insufficient alone: the gate resolves a stable canonical authority ID and a dated ownership/charter
relationship to the particular maintained work. Missing authority or relation means DORMANT, never
a name-based fallback.

```ts
interface ArcaneWorkAuthorityFact {
  factId: EntityId;
  lawVersion: LawVersion;
  authorityId: EntityId;                   // stable institution or faction identity
  authorityKind: 'INSTITUTION' | 'FACTION' | 'POLITY';
  authorityRole: 'MAGICAL_AUTHORITY';
  maintainedWorkOperationId: EntityId;     // exact proposed/active lift-work operation
  relation: 'OWNS' | 'CHARTERED_MAINTAINER';
  effectiveAt: TimeKey;
  removalEpoch?: EpochId;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}
```

⛔⛔ **TIER IS NEITHER A GATE NOR AN AUTHORISER.** Population, settlement tier, prosperity,
institution labels, inferred magical surplus and visual status never decide whether land exists.
Only an accepted canonical ascension/maintenance operation joined to the exact active
`ArcaneWorkAuthorityFact` can do so. Tier or wealth may later correlate with authored worlds, but
the map does not derive that correlation, impose a floor, or turn it into an activation prior; a
small or humble settlement remains legal when its explicit canon supports the work.

⚠⚠ **THE DORMANCY OBLIGATION IS ABSOLUTE AND IT IS ALREADY LAW (§3.3 / the dormancy law).** With the gate unmet — which is the overwhelming majority of settlements — **the sky leaf does not exist, is not rendered, is not censused, and output is BYTE-IDENTICAL to a world in which this section was never written.** §166's *"empty strata never render"* is the same rule and it binds here unchanged. `magicFilter.js` is the landed precedent for the magic-off seam and its idiom is what this consumes.

⚠ **AND THE SETTING-AGNOSTICISM CAVEAT, STATED PLAINLY RATHER THAN BURIED.** Floating land is a **strong genre commitment**. The mitigation is a typed canonical cause, dormancy by default and byte-identical output when no accepted ascension/maintenance operation exists. No settlement class, magic label or desired incidence supplies one. Aggregate incidence may be reported as a nonauthorizing diagnostic, but the current evidence programs identify no frequency, ceiling, count distribution or activation weight.

#### §6.7.2 · ⭐⭐ THE CAUSE — lift is a MAINTAINED WORK, not a permanent fact

> **RULED (vetoable): THE LAND IS HELD UP BY CONTINUING EXPENDITURE, NOT BY A FINISHED ENCHANTMENT.**

**This single ruling is what makes everything the owner asked for fall out causally instead of being scripted:**

| the owner asked for | what the maintained-work ruling gives, for free |
|---|---|
| growth and shrinkage with economics and magic | **sustainable area is a budget**, so it moves when the budget moves |
| reliance on incoming supply chains | **upkeep is consumption**, so a severed lane starves the lift |
| waxing and waning | **the high-water law already describes exactly this** (§6.7.7) |
| a reason it is rare | **rare is what a standing cost makes it** |

⭐⭐ **AND IT BUYS THE MOST DRAMATIC EVENT IN THE WHOLE MAP PROGRAM: A FALL.** If the lift is a maintained work, it can fail. A fallen land is a crater, a debris fan and a destroyed quarter on the surface — a §161g demotion scar with a new and spectacular cause, event-log derived, entirely within existing machinery. ⚠ **A fall is an EVENT, never a state: it is dated, it enters the log, the marginalia may quote it, and it is never re-derived at render time.**

No unversioned lift formula is map law. A canonical ascension/maintenance operation must cite the
exact active `ArcaneWorkAuthorityFact`, explicit capacity/supply/capital facts, its registered
maintained-work law artifact and the resulting budget/geometry receipt. A later operation may use a
different versioned world law, but the map compiler only validates and projects those supplied
facts. Wealth, status, district condition, names and appearance never infer lift, altitude, area or
failure; a humble or small settlement may carry land when explicit canon gives it the required
authority and maintained work.

#### §6.7.3 · FORM — an organic cap and a procedural keel

**The owner's specification: an organic ellipse or circle in plan, with a procedurally generated, variable, inverted-mountain keel scaled to the landmass radius.**

⭐ **THE CAP OUTLINE REUSES A PRIMITIVE WE ALREADY HAVE.** `fabricGeometry.organicBlob(cx, cy, radius, rng, opts)` builds a seeded four-harmonic radial perturbation on the frozen integer trig table — deterministic, purity-clean, and exactly the "organic ellipse or circle" the owner described. **Nothing new is needed for the plan outline.** An ellipse is the same call with an anisotropic radius.

⚠⚠ **THE HAZARD THIS CREATES, AND IT HAS BITTEN BEFORE IN A NEW HABITAT.** ATLAS banned prior #1 is *concentric / polygonal town shape*, and §271's salt town is on the record as *"the ring prior found a NEW habitat"* — a near-perfect radial oval, invited by a phrase. **A round island is a standing invitation to build a ring town on it.** ⛔ **THE RULE: the CAP is geology and may be an organic blob; the FABRIC on the cap is a settlement and is bound by the ordinary morphology law — junction mix, φ, block elongation, frontage-first, the anti-concentric prior, all unchanged.** A concentric island town REDS exactly as a concentric ground town does. ⭐ *The island changes the ground the fabric stands on. It does not change the law the fabric obeys.*

```
FloatingLandMassBody
  bodyId          EntityId
  leafIndex       +1
  parts[]         one LAND_CAP + one or more LAND_KEEL SolidPartQ
  support         one MAINTAINED_FREE_SPACE datum shared by those parts
  floating        lifecycle refs only: capPartId, keelPartIds, anchors,
                  ascensionEpoch, highWaterArea, liftBudget, causeRef
```

The cap outline, current radius/area, keel depth/profile and altitude are **derived views of the
referenced solids/support**, never parallel lifecycle fields. A canonical ascension operation must
provide or invoke the reviewed form law; population, capital and appearance do not silently set
geometry. Cause-specific keel classes are optional typed operation facts, not guesses from shape.

⭐ **`D` SCALES TO `R` AND THE RATIO IS WHERE THE SHADOW COMES FROM.** Per §6.6.3, the keel only escapes the cap's shadow when `D · cot ε > R`. **So the D/R ratio is not a cosmetic dial — it is the quantity that decides whether the land's shadow reads as a round blot or a teardrop with a tail.** ⚠ **It must therefore be derived and banded, and its band is a CENSUS, never a target** (§3.2's law: a descriptive statistic may be a census and is forbidden as a generator input).

#### §6.7.4 · PLACEMENT AND SOLAR OBSERVATION — no same-pass shade optimiser

⛔ **§10.8 SUPERSEDES THE EARLIER `ShadeBurden` SITING MODEL.** A floating land's position is a
canonical consequence of its dated ascension/maintenance operation, registered anchors and volume
legality. The compiler may validate that position; it may not relocate the land by optimising a
synthetic field/market/rich/poor cost function. Current prosperity and inferred political weakness
are not spatial facts, and the projection lamp is never a world sun.

If—and only if—the world supplies a licensed `WorldSolarProfile`, `spatial/shadeExposure.js` may
derive a time-indexed `ShadeExposure` receipt from the already-canonical land geometry. That receipt
is an OBSERVATION: it records sample interval, receivers, covered area/duration, uncertainty and
provenance. A later simulation tick may consume it through an explicit domain rule. In the same
compile it changes no land use, value, institution, prosperity, siting or geometry. Without a
licensed solar profile, shade exposure is absent/dormant while the fixed cartographic shadow remains
available for legibility.

#### §6.7.5 · HEIGHT

> **RULED (vetoable): ALTITUDE IS INERTIAL. It is set at the ascension event and does not drift. Raising or lowering a land is a DATED EVENT, like widening a street.**

⭐ **WHY.** This is the prosperity research's own temporal ladder — *current wealth moves faster than built capital; built capital moves faster than streets and boundaries* — carried one step further. **Altitude is the most inert quantity on the map.** It also keeps the geometry stable under drift: a land that bobbed with the economy would re-cast every shadow on the surface every tick, which is an inertia-law violation of the largest possible blast radius.

```
support.localDatum  is recorded by the canonical ascension event
thereafter          unchanged, unless a dated raise/settle event
                    (each an entry in the log, each re-casting
                     that ONE land's shadow and nothing else)

⚠ upkeep is a function of altitude, so a high land is a
   standing bet on the arcane economy — and the first thing to
   fail when the supply lane is cut.  ⭐ A land that cannot pay
   its height SETTLES before it falls: a dated, legible,
   two-stage failure rather than a coin flip.
```

**Several lands at several heights is therefore the expected case, not a special one, and §6.2's leaf/altitude split is what makes it cost nothing.** ⭐ **And the shadows do not repeat the plan arrangement** — because each is displaced by its own `H · cot ε`, **the shadow constellation on the ground is a sheared copy of the sky constellation.** A reader who compares the two leaves is reading altitude directly.

⚠ **INTER-LAND SHADOW IS REAL AND IS THE SKY LEAF'S OWN CASE:** a higher land shades a lower one, and that shadow falls on the *sky* leaf, not the ground. Under §6.6.2 the lower land loses the sun **once** — never twice — and its own ground shadow is unaffected, because it still blocks the same light it always did.

#### §6.7.6 · ⭐⭐⭐ THE CONSERVATION LAW

> **THE OWNER'S OWN REQUIREMENT, AND IT IS WHAT SEPARATES THIS FROM DECORATION: what goes up must come from somewhere, and the surface must show that it left.**

⭐ **THE RULING ON THE GROUND ITSELF — MIGRATION, NOT EXCAVATION.** The owner said the lands *"offer more space around the settlement"*. So the default is that the land is **raised or accreted as NEW ground** and the settlement **gains capacity**; the surface keeps its soil. ⚠ **The alternative — a quarter torn bodily out of the earth, leaving a pit or a lake — is spectacular and is retained as a RARE, DATED EVENT variant** (`QUARRIED` keel, a crater or flooded pit on the surface). It is never the default, because a default that removes ground would make every island a wound.

**THE THREE QUANTITIES, WHICH CONSERVE DIFFERENTLY — and conflating them is the trap:**

```
① SOULS — STRICTLY CONSERVED
   pop_total = pop_surface + Σ pop_sky + pop_undercity
   ⛔ The sky NEVER mints population. A soul aloft is a soul
      not on the ground. Tier, capacity, food and every ledger
      keyed to population read the TOTAL and are untouched.

② BUILT CAPITAL — CONSERVED IN AGGREGATE, NOT PER PARCEL
   The capital that ascended is capital the surface no longer
   carries. ⭐ But the vacated ground does NOT become empty:
   it is taken over by lower-order use, exactly as the demotion
   grammar (§161g) already describes.
   ⭐⭐ THE SIGNATURE THIS PRODUCES, AND IT IS THE FEATURE:
      A SURFACE DISTRICT WHOSE PLOT PATTERN IS ELITE-GRADE AND
      WHOSE CURRENT OCCUPANCY IS NOT.
      Wide frontages subdivided. Courtyard houses in tenement
      use. A grand street with humble doors.
      ⭐ That is how a reader sees that the wealth went UP,
        without being told, and WITHOUT LOOKING AT THE SKY LEAF.

③ PROSPERITY — ⛔ NOT CONSERVED AS A SCALAR, AND MUST NOT BE
   TREATED AS ONE. This is where the mean/inequality/ceiling
   separation earns its place:
      total capital     CONSERVED  (it moved; it did not evaporate)
      surface MEAN      FALLS      (the wealthy left)
      surface CEILING   FALLS      (the top is no longer on the ground)
      settlement CEILING RISES     (the sky is the new ceiling)
      INEQUALITY        RISES      (and is now visible as ALTITUDE)
   ⛔ A single "prosperity" scalar cannot express this and will
      produce a nonsense reading in both directions.
```

⭐⭐ **THE BIDIRECTIONAL OBLIGATION THE OWNER NAMED — and it is the sharpest test of the whole feature:**

```
sky GROWS    → souls and capital move UP
             → surface MEAN falls; the settlement CEILING rises
             → ⛔ THE SURFACE DOES NOT SHRINK. It RE-SORTS.
               ⭐ See §6.7.10 — the rich vacate, the ranks below
                 move up into prime ground, and the displaced
                 build OUTSIDE THE WALL, which never moves.
sky SHRINKS  → souls and capital come DOWN
             → surface MEAN rises; intramural density rises
             → ⭐ THE RETURN IS AS LEGIBLE AS THE DEPARTURE:
               only explicitly registered transfer, reoccupation,
                 amalgamation or abandonment operations alter parcels
                 and ribbons; no ruin/recovery ladder is inferred
```

⚠⚠ **THE CENSUS THIS OWES, AND IT IS NON-NEGOTIABLE: A CONSERVATION LEDGER THAT MUST BALANCE TO ZERO.** Souls, and aggregate built capital, summed across every leaf, before and after any sky change. **A leak in either direction REDS.** ⭐ *This is the cheapest possible defence against the failure mode that would otherwise sink the feature — a sky that quietly adds a second settlement's worth of people and prosperity to a city that never grew.*

#### §6.7.7 · ⭐⭐ WAX AND WANE — explicit history, never a recovery ladder

Floating-land extent, occupation, damage, abandonment, reoccupation, rebuilding and failure change
only through explicit dated canonical operations. A historical high-water outline may persist when
the supplied operations preserve it, but neither §161f nor §161g automatically assigns a ruin ring,
four decay vintages, regrowth order, monument survival, crop change or healed scar. Each retained
edge, ruin, repair, reused shell and altered ground patch must resolve to the operation and
provenance that created or preserved it.

A total fall is likewise an explicit world event. Its accepted operation supplies the removed sky
body state, any surface `VOID` or `CRATER`, debris bodies, transfers and later recovery operations.
The compiler conserves declared people, capital and material and renders the resulting dated state;
it never manufactures a crater, permanent scar, healing order or returned-shadow land use merely
because a lift budget changed.

#### §6.7.8 · WHAT CROSSES LEAVES — projection shadow, connection, optional observation

> **The sky and surface projections are joined by the cartographic cast and registered connection
> points. A licensed world-solar model may additionally emit a `ShadeExposure` observation, but that
> observation is not an immediate morphology command.**

```
sky  →  surface     ⭐ CAST SHADOW      a PROJECTION artifact
sky  →  surface     ⭐ CONNECTION POINTS anchors, masts, hoists (§6.3)
sky  →  surface     ⚠ SHADE_EXPOSURE   optional OBSERVATION under §10.8;
                                        later-tick consumption only
sky  →  undercity   ⛔ NOTHING          the owner's ruling, and it is
                                        physically correct: the
                                        undercity has no sun to lose
surface → sky       ⛔ NO SHADOW        the ground does not shade
                                        what floats above it
```

⛔ **No direct consequence table survives.** A shaded field does not automatically become pasture,
a shaded street does not automatically become poor, and a shaded work does not automatically move.
Those outcomes require separately modelled agronomic, economic, political and institutional laws,
an earlier-tick receipt, and a dated domain action with its own provenance. Until then the receipt is
legible evidence for a campaign/world system, not a settlement-map generator input.

⚠ **TWO SHADOW PRODUCTS, NEVER ONE CONFUSED PRODUCT.** The **cartographic cast** does not move:
the plate has one fixed projection light and no time-of-day animation. The **world shade exposure**
is a swept, time-indexed receipt under `WorldSolarProfile` (§10.8) and may influence only later ticks
through an authorised domain rule.
The cartographic lamp never grows crops; the world sun never changes the chosen plate convention.

#### §6.7.9 · THE CENSUSES THIS OWES

| census | must read | catches |
|---|---|---|
| **conservation ledger** | **0** net souls, **0** net aggregate built capital across all leaves | a sky that mints a second settlement |
| **connection-point resolution** | every point resolves on **both** leaves within the topology quantum; **0** orphans | a stair to nowhere; a mast with no deck |
| **vertical legality** | **0** illegal volume intersections; every contact carries a declared attachment kind | the whole §6.5 family |
| **attachment non-vacuity** | withdrawing any attachment kind **REDS** | an exemption list wearing a law's clothes |
| **dormancy** | gate unmet ⇒ output **byte-identical**, sky leaf absent, zero censuses run | the feature leaking into ordinary worlds |
| **activation provenance** | every floating land resolves one explicit canonical ascension/maintenance cause; no class-, magic-label-, incidence- or count-prior activation | a generator probability masquerading as world history |
| **sky morphology** | island fabric meets the SAME junction-mix / φ / elongation bands as ground fabric | ⛔ the ring prior in its new habitat |
| **shadow provenance** | every shadow names its caster, its light and its receiver | a painted shadow with no body behind it |
| **shade-exposure provenance** | when a licensed `WorldSolarProfile` exists, every receipt names profile, interval, caster/receivers, uncertainty and source artifact; otherwise SKIPPED/DORMANT | a projection lamp or synthetic optimiser masquerading as world causality |
| **high-water in the sky** | current cap-solid area ≤ `highWaterArea`, always | growth that forgets it shrank |
| **altitude inertia** | the shared maintained support's `localDatum` is byte-identical across ticks absent a dated event | a bobbing island re-casting the world |
| ⟦§278⟧ **displacement conservation** | the G-55 ledger taken over **intramural + extramural** fabric together | ⛔ reading a displacement past the wall as a population leak |
| ⟦§278⟧ **the wall did not move** | circuit trace byte-identical across any sky growth or shrink absent a dated circuit event | the surface quietly re-sizing instead of re-sorting |
| ⟦§278⟧ **debris conservation** | excavated volume = debris fan + spoil + robbed stone, to a stated tolerance | a crater that deletes mass |
| ⟦§278⟧ **loss/recovery chronology** | every retained seam, erased seam, reuse and rebuild resolves an explicit dated operation; no automatic permanent scar or healing order | recovery or persistence invented by the renderer |
| ⟦§278⟧ **leaf roster** | `leaves(settlement, year)` matches each year's actual contents; **0** mismatches | a sky tab on a settlement with no lands |
| ⟦§278⟧ **shade exposure** | optional receipt derives from canonical solids + licensed `WorldSolarProfile`; zero same-pass consumers | invented solar facts or immediate rural/prosperity/siting feedback |

---

#### ⟦FOLD §278⟧ §6.7.10 · ⭐⭐⭐ THE DISPLACEMENT LAW — THE SURFACE RE-SORTS, IT DOES NOT RE-SIZE

⛔ **CANONICAL-OPERATION SUPERSESSION.** Conservation and the prohibition on silently resizing a
circuit survive. The deterministic social cascade below (rich ascend, ranks move inward, poor build
outside; exact reverse on descent) is an archival fantasy hypothesis, not a live rule. A sky event
changes surface occupation, parcels or extramural fabric only through explicit dated transfer,
relocation, split/amalgamation, construction, abandonment and circuit operations. Current prosperity
or status never supplies those operations.

> ⛔⛔ **THE OWNER'S CORRECTION, AND IT REPLACES THE WEAKEST PARAGRAPH IN §6.7.6. A GROWING SKY DOES NOT MAKE THE SURFACE SETTLEMENT GROW FROM ITS CENTRE AND PUSH EVERYTHING OUTWARD. THE FOOTPRINT BARELY MOVES. WHAT MOVES IS WHO LIVES WHERE.**

**The mechanism, stated as the chain it actually is:**

```
the sky GROWS
    ↓
the RICH ascend                       — capital and status leave the ground
    ↓
their intramural ground is VACATED    — prime plots, prime frontage, now empty
    ↓
⭐ IT IS NOT LEFT EMPTY. It is RENOVATED and SUBDIVIDED —
   the next rank down moves UP the social ladder into it,
   because prime frontage never stays vacant in a living town
    ↓
that rank's OWN ground is vacated, and the cascade runs down
    ↓
⭐⭐ THE POOR ARE DISPLACED AT THE BOTTOM OF THE CASCADE.
   They cannot move up the ladder; there is nothing below them.
    ↓
⭐⭐⭐ THEY BUILD AT THE EDGE, AND THE EDGE IS OUTSIDE THE WALL.
```

> ⭐⭐⭐ **THE LAW, IN THE OWNER'S OWN WORDS AND IT IS HISTORICALLY EXACT: A WALL NEVER EXPANDS. THE SLUMS OUTSIDE DO.**

⭐⭐ **WHY THIS IS THE BEST CORRECTION IN THE SECTION: IT MAKES THE WALL'S INERTIA LOAD-BEARING RATHER THAN INCIDENTAL.** §239/§240 already rule that a circuit is an **event**, never a response to population — a wall is built when a polity decides to build one, not when the town gets bigger. **This law is the demand side of that same coin.** Population pressure has nowhere to go *but* outward past a wall that will not move, and that is precisely how real medieval cities behaved. ⭐ *The map gets a slum belt outside the gates because the wall would not move, not because a rule said "add a slum belt."*

**WHERE THE DISPLACED GO — and every destination already has a stage that owns it:**

| destination | stage | what it looks like |
|---|---|---|
| **extramural ribbons along the gate roads** | **S15** — already the extramural ordering stage | ⭐ the primary sink; ribbons lengthen on the busiest gates first |
| **faubourgs** | **S15** + §232's `${parent}~faubourg` district ids | a quarter that is a quarter, outside the circuit |
| **backland infill intramurally** | **S12** — backland cores and the void hierarchy | courts and gardens eaten by pressure sheds |
| **subdivision of vacated elite plots** | **S10** — the cadastral lineage event already exists | ⭐ the `SPLIT` event, at scale, dated |
| **the intramural vacancy the sky created** | §6.7.12 | ⚠ **NOT a hole — see the void law below** |

⭐⭐ **THE VISIBLE SIGNATURE, AND IT IS READABLE WITHOUT LOOKING AT THE SKY LEAF AT ALL:**

```
INTRAMURAL   an elite plot pattern in non-elite occupancy —
             wide frontages subdivided by later party lines,
             courtyard houses in tenement use,
             a grand street with humble doors,
             ⭐ RENOVATION SEAMS: new work in old fabric,
               a different roof vintage inside an older range

AT THE WALL  unchanged. The circuit does not move. It is the
             control variable that makes the rest legible.

EXTRAMURAL   ribbons and faubourgs at a visibly COARSER, POORER
             grain, growing along the roads that carry most
             traffic, thinning with distance from the gate
```

⭐⭐ **AND THE REVERSE RUNS THE SAME CHAIN BACKWARD, WHICH IS THE OWNER'S "VICE VERSA" AND IS THE HARDER HALF TO GET RIGHT:**

```
the sky SHRINKS
    ↓
souls and capital COME DOWN
    ↓
intramural density RISES; the returning rank re-occupies
    ↓
⭐ SUBDIVIDED PLOTS RE-AMALGAMATE — the `AMALGAMATION`
  lineage event, which the cadastral model already carries.
  ⚠ AND THE SEAM SURVIVES: a re-amalgamated plot is NOT
    identical to a plot that was never split. The party line
    is gone; the frontage rhythm remembers it.
    ⭐ THAT IS THE INERTIA LAW DOING ITS JOB — history is not
      undone, it is built over.
    ↓
pressure at the bottom RELEASES
    ↓
⭐ EXTRAMURAL RIBBONS change only under explicit occupation,
  abandonment, demolition, reuse or rebuilding operations.
  ⛔ A sky change alone does not move the wall; a separate dated
     circuit project may alter or remove it.
```

⚠⚠ **THE CONSERVATION LEDGER (G-55) MUST BE TAKEN OVER THE WHOLE SETTLEMENT INCLUDING EXTRAMURAL FABRIC, OR IT WILL READ A DISPLACEMENT AS A LEAK.** ⛔ **An intramural-only count of souls or built capital will show the population "vanishing" when it has merely walked out of the gate.** *This is the single easiest way to write this census wrong, and it would look like a real bug for a long time.*

---

#### ⟦FOLD §278⟧ §6.7.11 · ⭐⭐ INSTITUTIONS ALOFT — WHO ASCENDS, WHO CANNOT, AND WHO DECIDES

⛔ **CLASS-E / DOMAIN-DOOR SUPERSESSION.** The table below is a candidate authoring and validation
vocabulary, not a resolver. Function, status, authority type or name never moves or splits an
institution. The compiler projects only explicit dated institutional leaf assignments and
relocation/split operations with stable identity, lifecycle and provenance; absent canon remains
unassigned/dormant.

> **AUTHORING QUESTION:** when proposing a move, does the declared function and infrastructure make
> the proposal coherent with the supplied world facts?

⛔ **A PRESTIGE RANKING IS THE WRONG MECHANISM AND MUST BE REFUSED.** Sorting institutions by importance and lifting the top N produces a floating list, not a floating settlement. **Function first, status second, and status only breaks ties among things that could go either way.**

| class | rule | examples | why |
|---|---|---|---|
| ⭐ **ASCENDS BY FUNCTION** | altitude is *what the institution needs* | observatory · arcane proving ground · containment/hazard work · the node itself where the node is aloft · **skyport / mooring ground** | the function is impossible or crippled on the ground. ⭐ *The corpus already carries the vocabulary: hf178 airship dock, hf243 skyport-saddle, hf176's scorch-stipple testing yard* |
| **ASCENDS BY STATUS** | altitude is *display*, and it is contested | the arcane authority's own seat · elite residence · the polity's ceremonial hall | ⚠ **status ascents are the ones that create the §6.7.10 cascade.** They are also the first to come down |
| ⛔ **CANNOT ASCEND** | the ground is the function | mills (water) · quays · mines · tanneries/kilns · **markets** · granaries · fields and everything processing them · **the defences** | ⭐ **a market is where ROADS MEET, and roads are on the ground.** A wall defends ground. A mill needs a head of water. ⛔ *And bulk transport prices itself out: lift cost per tonne forbids anything heavy, cheap or perishable* |
| ⭐⭐ **SPLITS ACROSS LEAVES** | the head goes up, the body stays down | counting-house aloft / warehouse below · sanctum aloft / parish church below · palace aloft / chancery below · college aloft / its schools below | ⭐ **This is a MULTIPLICITY INSTANCE and the machinery exists** — the same object class as `market_quarter~1` / `shadows_district~2`, and the same identity discipline as §168's UNIVERSAL FRONT. **One institution, one identity, two bodies, two leaves.** ⚠ Its connection point (§6.3) is not decoration — it is the institution's own throat |

##### ⭐⭐ THE POLITICAL REGIME — three validation vocabularies, never inferred maps

**Altitude may express jurisdiction only when canon says it does.** A recorded `regimeId` must be
validated against the exact active `ArcaneWorkAuthorityFact` and canonical government/faction
relations; those facts do not themselves mint the regime or any building/leaf assignment:

| regime | derivation | what the map shows |
|---|---|---|
| **ARCANE-SOVEREIGN** | the arcane authority **is** the government | the seat of power is aloft; the ground is administered from above. **Petition halls and customs at the ascent points**; the surface's grandest civic building is a *receiving* office, not a seat |
| **ARCANE-CHARTERED** | a secular power **granted** the right to lift | ⭐ **the island is a privileged enclave — a liberty.** Its own jurisdiction, its own courts, its own gate discipline. ⚠ *The prosperity research documents exactly this class on the ground — religious houses as independent urban actors with their own capital, jurisdiction and property.* **The friction IS the story: duplicated institutions where two jurisdictions meet, which §6's own W6 note already predicts ("two of everything where two jurisdictions share one crossing")** |
| **ARCANE-SUBORDINATE** | the secular power **owns** the lift | the palace is aloft and the college is a department of it; the arcane authority's own seat stays on the ground, which is itself a visible humiliation |

Faction or political interpretation is explanation over explicit canonical relations, not a new
WORLD fact inferred from altitude. Covert tenancy remains DM-lens gated, and a shareable lens may
never reveal it.

##### DISPLACEMENT ALOFT — explicit relocation, never a status ladder

Shrinkage does not choose who descends. Every institutional transfer, relocation, abandonment or
retention is an explicit dated operation with unbroken identity and declared cause. Age, wealth,
tenant status, rung, monumentality and node proximity may be canonical inputs to a separately
registered world decision law, but the map does not rank them or infer a move. A recorded descent
is simply a relocation whose endpoints lie on different leaves; the connection/portal contracts
make it expressible without supplying its history.

---

#### ⟦FOLD §278⟧ §6.7.12 · ⭐⭐⭐ THE VOID AND THE CRATER — LOSS IS DRAWN INWARD, NOT INWARD-FROM-THE-EDGE

⛔ **TYPED-OPERATION SUPERSESSION.** `VOID` versus `CRATER`, cadastre survival, volume conservation
and lineage are stable types. The cause→location table, four-vintage decay sequence, fixed recovery
times and permanent new-grain outcome below are candidate story vocabularies only. Runtime reads the
recorded loss outline and dated recovery/reuse operations; it never infers a scar location from a
plague/poverty label or forces the wall to survive.

> **Loss is not represented by an automatic uniform edge contraction. Preserve the registered
> high-water extent and inherited boundaries where they survive; alter them only through dated
> operations. A recorded internal loss may be a hole, but neither hole placement nor healing is
> inferred from population alone.**

⭐⭐ **AND THE PROGRAM HAS ALREADY HALF-RULED IT WITHOUT NOTICING.** G-43's counterfactual battery, arm 5, reads: *"cut population 40% late — vacancy/demotion rungs must appear; **the wall must NOT contract**."* **This law is that arm generalised from population to volume, and it is the demand-side twin of §6.7.10.** It is also the high-water law drawn correctly: **extent from historical maximum, occupancy from current** — a hole is occupancy loss with extent preserved, which is exactly what the law describes and exactly what edge-shrinkage would have destroyed.

⚠⚠ **BUT TWO DIFFERENT OBJECTS ARE BEING DESCRIBED AND THEY MUST NOT SHARE A MECHANISM:**

| | **THE VOID** | **THE CRATER** |
|---|---|---|
| **cause** | depopulation — plague, famine, economic collapse, flight | **excavation** — a fallen land, a magical detonation, a mine collapse, a besieger's mine |
| **the ground** | ⭐ **INTACT.** Streets, plots, foundations and boundaries all survive | ⛔ **DESTROYED.** The cadastre itself is gone — there is no plot to return to |
| **reads as** | *emptied* — roofless shells, then collapsed footprints, then grassed lines over a street web that still shows | *removed* — a rim, a bowl, spoil and debris, and no fabric at all |
| **recovery** | explicit reoccupation/reuse operations may retain any attested surviving plots and bearings | explicit fill, clearance, route, parcel and rebuilding operations determine any new fabric; no permanent seam or new grain is automatic |
| **mass** | none moved | ⭐⭐ **CONSERVED — see below** |
| **existing machinery** | typed occupation/abandonment/reuse operations + preserved lineage | typed excavation/debris/recovery operations |

⚠ **A RECORDED CAUSE MAY CONSTRAIN LOCATION ONLY THROUGH AN EXPLICIT EVENT FOOTPRINT/operation.**
The following is an archival hypothesis table, never a cause-name lookup:

```
razing / assault      → on the ATTACK BEARING          (§161g, verbatim)
                        ⛔ a besieged town is wrecked at the gate it
                          was taken through, not in the middle
fallen land           → ⭐ where it FELL — derivable from its own
                        plan position, which is a fact we hold
plague                → the POOR QUARTER, where crowding was
                        ⛔ never central, and never a bowl — a VOID
economic collapse     → the quarter whose TRADE failed
                        (the dead quay, the shut works)
magical catastrophe   → at the arcane precinct — ⭐ and this IS
                        often central, because that is where the
                        college was
```

⭐⭐⭐ **DEBRIS IS CONSERVED, AND THIS IS THE PART I LIKE MOST BECAUSE IT MIRRORS THE POPULATION LAW EXACTLY.** The volume that came out of a crater has to be *somewhere*. It is not deleted:

```
excavated volume  =  debris fan  +  spoil heaps  +  stone robbed back
                     into rebuilding

⭐ THE FAN lies on the far side from the impact bearing — free
  geometry, and it tells the reader which way the blow came from.
⭐ SPOIL HEAPS are ground: they refuse fabric, they weather, and
  they are the first thing cleared.
⭐⭐ ROBBED STONE IS THE RECOVERY, AND THE CORPUS ALREADY DRAWS IT:
   hf241's "robbed-stone wall line as field boundaries."
   The rubble does not vanish — IT BECOMES THE NEXT TOWN.
```

**CANDIDATE RECOVERY VOCABULARY — drawable only when dated operations record the rung:**

```
year 0    raw rim · bowl · debris fan · fires · the cadastre gone
year N    spoil carted to the edge · rim weathering · squatting at
          the lip · a track worn across the bowl
year 2N   the bowl part-filled · the track hardened into a REAL
          STREET at a bearing the old town never had
          ⭐ THE MOST LEGIBLE RECOVERY TELL IN THE WHOLE GRAMMAR
year 3N   a recorded rebuilding operation may return fabric at a
          declared new grain; a later operation may retain, alter or
          erase the seam. None of those outcomes is automatic.
```

⚠ **The prior circuit is an inert control only while no dated circuit alteration/removal operation
exists.** Its survival can make a wound legible; its automatic immortality would be another invented
history.

---

#### ⟦FOLD §278⟧ §6.7.13 · THE LEAF ROSTER IS DERIVED, NOT DECLARED

> ⭐ **RULED (owner): THE SKY LEAF EXISTS ONLY WHERE FLOATING LANDS EXIST. A SETTLEMENT GAINS A SKY VIEW WHEN IT LIFTS ITS FIRST LAND AND LOSES IT WHEN IT LOSES ITS LAST.**

⭐ **THIS NEEDS NO NEW LAW EITHER — §166 ALREADY SAYS IT: *"Empty strata never render."*** What the ruling adds is that the statement is **temporal**, and that has one architectural consequence worth stating plainly:

```
⛔ THE FOLIO'S LEAF LIST IS NOT A FIXED SET.
⭐ It is DERIVED PER SELECTED YEAR from what exists in that year.

leaves(settlement, year) =
    [ -1 undercity ]   if any subterranean stratum is non-empty
    [  0 surface   ]   always
    [ +1 sky       ]   if any floating land exists in that year
```

⚠ **AND THE UI CONSEQUENCE IS A FEATURE, NOT A PROBLEM.** A settlement whose sky leaf **appears** between two years is telling the reader something enormous with no words at all; a settlement whose sky leaf **vanishes** is telling them something worse. ⭐ *The presence of a tab is itself a historical fact.* ⛔ **A leaf control that is always visible and sometimes disabled destroys that** — an absent leaf is absent, never greyed.

⚠ **THE CENSUS:** leaf roster derived per year matches the year's actual contents on every leaf, on every exemplar, **0 mismatches** — and a settlement that never had a land never renders, references, or censuses a sky leaf at any year (the dormancy obligation, §6.7.1).

---

### §6.8 · THE LEDGER ROWS THIS SECTION ADDS — G-48 … G-74

**Ranked within themselves. ⚠ None is ranked against G-1…G-47 here — that is a chair act, and §6.9 argues the sequencing rather than assuming it.**

| id | What is uncovered | Mechanism | Derivation home | Route |
|---|---|---|---|---|
| ⭐⭐ **G-48** | **§17's non-overlap law is 2D. Every legal vertical case — gatehouse over a road, bridge over water, gallery under a building, land above ground — arrives as a census violation.** | **THE VERTICAL GROUND LAW** (§6.5): broad-phase `overlapXY ∧ overlapZ`, then exact closed-solid contact under a typed attachment vocabulary, each kind proved non-vacuous by counterfactual | each `SolidPartQ` support/offset/closed shell and derived bounds; §17's existing claim machinery | ⛔ **BEFORE any massing lands.** It is the ordering that keeps this out of the G-34 exemption trap |
| ⭐⭐ **G-49** | **The corpus asks for ridge/hip ticks per building; we draw "a single diagonal stroke on some buildings" and the row has been failing since it was written** | **CANONICAL MASSING + ANALYTIC ROOF GRAMMAR** (§6.4): `MassPartQ[]` per body, analytic gable/hip/half-hip/shed/cross-gable, ridge/hip/valley/eave as ink, per-face tone under the projection-light profile | D3a accepts explicit canonical inputs; D3b may later apply scoped AMP-promoted function/structure/period mechanisms where canonical capacity, occupation and frontage facts satisfy their predicates | D3a proves the dormant compiler; **only D3b may flip generated ATLAS Table B from MISSES to MEETS** |
| ⭐ **G-50** | `SHADOW_DIR` is "NW" by convention; no bake-off has ever been run, and terrain relief now shares the light | **THE LIGHT PROFILE BAKE-OFF**: 337.5° NNW against the conventional NW, and ε ∈ {35°, 40°, 45°}, on a fixed contact sheet across terrain, roofs, walls, water and labels | n/a — an instrument | ⭐ **Grade B evidence** (controlled cartographic study, terrain-relief scope). A profile candidate, never a law |
| ⭐ **G-51P** | The visual corpus grades roof-plane legibility but its 47-field register contains no world height/storey observation | **THE PROJECTION INSTRUMENT**: measure plan-view roof-plane ink, ridge/hip tick density and per-face tone separation; it grades projection only | the plates themselves | ⛔ never supplies height, pitch, storey, material or architectural-frequency bands |
| ⭐ **G-51W** | We hold no eligible architectural denominator for height, floor programme, pitch, structure, material or alterations | **THE `AMP-1` WORLD INSTRUMENT**: source-datum/support, eaves/ridge, floor/clear volume, roof campaign, component materials, function and alteration with uncertainty/coverage | measured building/fabric evidence under §10.21–§10.22 | ⛔ **PRECEDES D3b and every graded historical massing verdict.** AMP gates may promote scoped conditional engineering ranges/coherence only; occurrence distributions, frequencies, prevalence and activation weights remain `NOT_IDENTIFIED`/`NONE` without a separate probability-sampling protocol |
| ⚠ **G-52** | ATLAS Table B grades *"One fixed light, hard-edged \| SHADOW_DIR landed \| MEETS"* — **but `SHADOW_DIR` appears in neither the app tree nor the fabric sandbox** (searched; zero hits in both) | **VERIFY THE ROW.** Either the symbol lives in a b6-era module the grade was taken against and has since been superseded, or the row is a stale MEETS | n/a — a receipt question | ⚠ **A row graded MEETS on a symbol that may not exist is the address-rot class (§257.2) at the instrument level.** Cheap to settle; must be settled before massing consumes it |
| ⭐ **G-53** | The shadow is a measuring instrument (§6.1) and the plate does not publish the constants needed to read it | **THE LIGHT CARTOUCHE**: light azimuth and elevation join the scale bar in S23's chrome, as truth-layer facts | the rig itself | S23; small |
| ⭐⭐ **G-54** | **Nothing joins leaves. A stair, shaft, mast or anchor is two objects that happen to line up** | **THE CONNECTION-POINT KEY SPACE** (§6.3): one `EntityId`, two leaves, one `anchorXY`; minted in `lineage.js` beside the four existing key spaces | the stratum/sky machinery that creates them | ⭐ **CHEAP NOW, EXPENSIVE LATER.** Mint the key space with the strata, whatever else waits |
| ⭐⭐ **G-55** | **The sky can mint a second settlement's worth of souls and prosperity and nothing would catch it** | **THE CONSERVATION LEDGER** (§6.7.6): souls strictly conserved; built capital conserved in aggregate; prosperity expressed as mean/ceiling/inequality, never one scalar. Balances to **0** across leaves or REDS | population, capacity, prosperity, the demotion grammar | ⛔ **WITH the sky leaf, never after it** |
| ⭐ **G-56** | The original shadow-as-immediate-cause proposal crossed projection, observation and domain action | **RETIRED BY §10.8.** A fixed cast remains projection; an optional `ShadeExposure` receipt is time-indexed OBSERVATION; any later land/economic/institutional response requires a separate authorised rule and dated operation | licensed `WorldSolarProfile` + already-canonical solids only | no same-pass siting, field refusal, devaluation, relocation or prosperity feedback |
| ⚠ **G-57** | A round island is a standing invitation to a ring town — **and §271 already recorded the ring prior finding a new habitat** | **SKY FABRIC OBEYS GROUND LAW**: island fabric is censused against the SAME junction-mix, φ, elongation and frontage bands. Geology may be a blob; settlement may not | §3.1's tier-invariants, unchanged | with the sky leaf; **it is a census, not a mechanism** |
| ⭐⭐ **G-58** | **A growing sky was modelled as the surface "vacating and demoting". It does not. The settlement RE-SORTS and the wall never moves** | **THE DISPLACEMENT LAW** (§6.7.10): rich ascend → ranks below move up into prime ground → the displaced build OUTSIDE the circuit. Sinks: S15 ribbons/faubourgs, S12 backland infill, S10 `SPLIT`. Reverse runs the chain backward with `AMALGAMATION`, and the seam survives | §239/§240 (a circuit is an event, never a response to population); §232's faubourg ids; the cadastral lineage events — **all existing** | with the sky leaf. ⚠ **G-55's ledger MUST count extramural fabric or it reads a displacement as a leak** |
| ⭐⭐ **G-59** | **Nothing says who ascends. A prestige ranking would produce a floating LIST, not a floating settlement** | **INSTITUTIONS ALOFT** (§6.7.11): ascend by FUNCTION (observatory, proving ground, skyport) · by STATUS (contested, first down) · **CANNOT** ascend where the ground is the function (mill, quay, market, defences) · **SPLIT across leaves** as a multiplicity instance. Descent order is §167's relocation ladder read vertically | exact active `ArcaneWorkAuthorityFact` `(authorityId, MAGICAL_AUTHORITY, maintainedWorkOperationId, OWNS|CHARTERED_MAINTAINER, lifecycle, provenance)` joined to canonical government/faction relations; legacy `exclusiveGroup`/name matches are nonauthorizing diagnostics | with the sky leaf; ⭐ **the regime is the sharpest political fact the map can carry** |
| ⭐⭐ **G-60** | **Loss must not be represented as automatic edge contraction** | **TYPED `LossRegion` + EXPLICIT RECOVERY OPERATIONS:** VOID preserves registered cadastre; CRATER records destroyed cadastre and conserved excavated/debris volume. Location, reuse, rebuilding and boundary/circuit change come from dated events | canonical loss/recovery operations and preserved lineage; no universal cause scar or four-vintage/LIFO ladder | a wall stays only when canon says it survived; it moves or disappears only through a dated project. No automatic immobility, healing order or new grain |
| ⭐ **G-61** | The folio's leaf list was implicitly a fixed set | **THE DERIVED LEAF ROSTER** (§6.7.13): `leaves(settlement, year)` computed per year; **a sky leaf appears when the first land lifts and vanishes when the last is lost.** ⛔ An absent leaf is absent, never greyed | §166's *"empty strata never render"*, made temporal | with the strata; ⭐ **the presence of a tab is itself a historical fact** |
| ⭐ **G-62** | A fixed cartographic cast was incorrectly promoted into world climate/economics | **OPTIONAL `ShadeExposure` OBSERVATION** (§10.8): sample already-canonical geometry under a licensed `WorldSolarProfile`, retaining interval, uncertainty and provenance | world-solar profile + canonical spatial artifact; projection light is forbidden | later-tick receipt only. It does not score siting or change fields, value, prosperity or institutions in the map compile |
| ⭐⭐ **G-63** | **Material assembly needs component and campaign truth; prosperity-to-grade/consistency and the inverted-U remain attractive but unvalidated hypotheses** | **COMPONENT-LOCAL MATERIAL HISTORY** (§6.4.1): base/frame/infill/cladding/floor/covering/repair are phase-owned facts; mismatch is typed as construction, replacement, repair, reuse, regulation or `UNKNOWN`, never decoded as poverty by default. No prosperity curve, “fallen” appearance, or planned-match/pressure-mismatch rule executes before `AMP-1` | explicit component/campaign evidence and promoted European function/resource/period/hazard mechanisms only; narrative culture and plan-pixel tone bands cannot supply material, status or causal frequencies | **D3a lands only the dormant schema/compiler. D3b may activate a versioned resolver after `AMP-1` development + sealed-holdout gates (§10.22); otherwise `UNCALIBRATED`/`HOLDOUT_FAILED`** |
| ⭐⭐ **G-64** | **A campaign clock runs and the map never changes with it.** `seasonOverride` (IT-3) is built; **`resolveMapDress`, its consumer, is not** | **THE TEMPORAL REGISTER** (§6.11): four seasonal registers resolved as PIN → live clock → **seasonless**. ⛔ **Season is TEMPORAL STATE and may never move a WORLD hash** — the same tier as the light profile. Derived from the campaign clock, ⛔ never `Date` | the 4-4-5 calendar quarter + climate from terrain; `mapEdits.SEASON_OVERRIDE_IDS`, already landed | ⭐ **the gate is already the documented default** — *"seasonless with no campaign"*. Routes with D4 (the light/tone wave) |
| ⭐⭐ **G-65** | **A season drawn as a palette is banned prior #8 with a new name** | **CAUSAL SEASON**: each register **adds geometry, subtracts accents and relocates function** — ⭐ hf282's frozen harbour is the ★★ proof (sawn channel, staked ice road, market ON the ice, try-yard idle). Palette shifts ride `folioLenses`' ten-role vocabulary as a seasonal sub-palette, **second and never first** | the corpus (hf282, hf240 monsoon); the existing lens roles | with G-64. ⚠⚠ **carries §6.11.3's tone conflict — "roofs ≥3 steps darker" WILL red under snow and the cure is to assert the ORDERING, not to exempt winter** |
| ⭐ **G-66** | Festivals exist in the log and never reach the page | **OCCASION DRESS** (§6.11.5): dated, local, brief; temporary stalls, the dressed processional route, tented ground outside the gates, workaday accents pulled. ⛔ **Renders only where a dated event exists** — a festival invented at render time is a world fact minted by the renderer | the event log's own festival entries; hf181's processional way | after G-64; ⭐ **season is the ground, occasion is the dressing — a feast in January is a festival ON SNOW** |
| ⭐⭐ **G-67** ⚠ *base-pipeline row, entered here because this fold found it* | **THE PAINTED CLOSURE HAS A MECHANISM (G-16) AND EXIT CRITERIA (W7) AND NO INSTRUMENT TO GRADE IT.** S22 states the hole in its own prose — ⛔ *"MISSING: any census on the five painted mechanics"* — and it was never routed to a ledger row, so it has no owner and no wave | **THE PAINTED-CLOSURE CENSUS**: a per-leaf, per-lens instrument that measures each of the five directly — **wash mis-registration** (fill-vs-ink edge offset distribution, px at native scale) · **per-stroke width modulation** (half-width variance along arc length) · **path waver** (deviation from the straight chord, normalised by stroke weight) · **corner overshoot** (share of joins overshooting, and by how much) · **paper grain σ** and **within-fill wash σ** on windows that actually contain the subject. ⚠⚠ **It must be a SEPARATE instrument from `MFS1-aesthetic.py`, whose 6.6 px windows are dominated by ground and field wash at the new grain** (W7 exit 8 already orders the re-window; this row orders the thing the re-window cannot supply) | n/a — an instrument. The **bands** already exist in ATLAS §2.3.3 (grain σ 1.30–2.96 · wash σ 1.83–4.39 · tone IQR 8.0–66.5 · mis-registration 2–8 px) | ⛔ **PRECEDES W7's grading, exactly as G-51P precedes roof-ink grading.** ⭐ **THE STANDING CLASS: A BAND WITHOUT AN INSTRUMENT IS AN OPINION** — and G-51W adds the equally important inverse: an instrument pointed at the wrong evidence cannot create a historical band. ⚠ Ranking against §4 is a chair act |
| ⭐⭐ **G-68** | **An institution that fails to place is indistinguishable from one that was never meant to.** The totality law admits only EMBODIED | **THE DISPOSITION LADDER** (§8.7): EMBODIED · **FRONTED** (§168's cover, on the map wearing a mask) · **UNSITED** (charter/jurisdiction/property here, seat elsewhere — ⭐ historically the commonest case) · AGGREGATED · **SUPPRESSED** (the only authored rung). Totality **sharpens** from *"every institution renders"* to *"every institution carries a stated disposition and zero are silently missing"* | institution catalog + §168's front type + property/jurisdiction facts already held | with the authorship layer. ⚠ **`SUPPRESSED` reported separately and never counted as a derivation** |
| ⭐⭐ **G-69** | **A city drawn at village density fails every grain band by construction — and the failure is the INSTRUMENT'S fault, not the map's** | **THE REPRESENTATION RATIO** (§8.8): the cartouche ALREADY declares `FABRIC 1:1.3 HOUSEHOLDS (REPRESENTATIVE)`; a Whiterun is that ratio at 1:40. ⭐ **Abstract the anonymous, preserve the named** — the ratio never applies to institutions, walls, gates, bridges, mills or the market. **Bands measured against the declared ratio, never the raw tier** | ⭐ **the mechanism SHIPS TODAY in S23's cartouche** — this routes it as a lever | ⛔ **the ratio is PINNED per settlement and never drifts**, or year-A/year-B comparison lies. ⭐ **it is not authorship — a representative map is fully DERIVED** |
| ⭐⭐ **G-70** | **Authoring does not decay, but its JUSTIFICATION does — and nothing would ever notice** | **TIME-VARYING CAUSAL COVERAGE** (§8.9): coverage is recomputed per year and may FALL with no user action, because the world moved and the authored parts did not. Surfaced as *"the market moved in 1478; 14 authored buildings no longer have a reason"*, with re-derive as a one-click fix | the divergence ledger × the event log | ⭐⭐ **a product behaviour no competitor can offer — it needs a derivation to measure disagreement against.** With the authorship layer |
| ⭐⭐⭐ **G-71** | **A user can author a partial map and has no way to complete it.** Authorship and derivation are all-or-nothing today | **THE RESOLVE PASS** (§8.10): freeze authored objects as HARD CLAIMS, run S6…S19 around them, fill only what is empty, mark it all `DERIVED`. ⭐ **Two operations, never conflated — FILL (additive, safe) and RECONCILE (surface the contradiction, never resolve it silently).** ⭐⭐ Reconcile runs BACKWARDS too: *"you placed a temple, the dossier has none — add it to the world?"* — **the map teaching the dossier.** ⭐ Authored density INFERS the §8.8 ratio when unset | ⭐ **the engine already generates around the wall, terrain refusal and reserved ground — an authored building is one more claim** | pure · idempotent · **LOCAL** (one more building re-resolves one cone, not the town) · ⛔ never edits or repairs what the user made |
| ⭐ **G-72** | Undo exists in design with four hazards unstated | **UNDO/REDO CONTRACT** (§8.11): ⭐⭐ **RESOLVE is ONE undoable command, not N thousand placements** · undo restores the DOCUMENT hash **byte-identically** · linear history, redo cleared on new edit · ⛔⛔ **undo is scoped to the DOCUMENT, never the WORLD — advancing the clock is not undoable through the map** | the existing command/inverse design | with the editor. ⚠ hazard 1 is the one that makes the feature useless if missed |
| ⭐⭐ **G-73** | **"Keep the map exactly as drawn" has no home, and PORTRAIT is the wrong tool for it** | **PINNED** (§8.12): a second axis orthogonal to PORTRAIT/CANON — the map holds while the world runs on. ⭐⭐⭐ **A pinned CANON map is a PLAYER-KNOWLEDGE map** — the plate from when they visited, while the DM sees the live town. Cartouche dates it (`SURVEYED 1450 · WORLD YEAR 1490`); ⭐ unpinning shows the diff, *"what happened while you were away"* | the existing lens/DM machinery + the divergence ledger | ⛔ **PINNED never pauses the simulation, freezes the dossier or exempts a consequence — only the drawing holds.** ⭐ four axes compose; all sixteen states legal |
| ⭐⭐ **G-74** | **The map is free and editing is paid — a NEW ENTITLEMENT SEAM, and the standing law is that TIER NEVER TOUCHES GENERATION** | **THE ENTITLEMENT GATE** (§9.11): a **sixth** declared field on every verb, checked at the command-dispatch door. ⭐⭐ **The engine cannot know a tier exists.** Free ≡ paid semantic map; ⛔ no watermark or content crippling. ⭐⭐ **THREE RUNGS, owner-ruled: ANON = one complete screen-ceiling map, ⛔ NO REROLL · FREE ACCOUNT = unlimited generation + reroll · PAID = editing.** Reroll is the account-creation rung; event proposals price to the **campaign** authority, not the editor. ⭐ Lapsed ⇒ document read-only, map still renders. ⭐⭐ **EXPORT RULED 2026-08-19: SCREEN-CEILING PNG FREE AT EVERY TIER; PRINT PDF + VECTOR SVG PAID** — an output-format/sample line, never a content line. ⚠ the ceiling constant is owed and commercial | the existing premium-isolation law + reveal-seam convention | with A1 |

---

### §6.9 · WAVE PLACEMENT — AND THE PARKING, STATED HONESTLY

⛔⛔ **THE FIRST THING THIS SECTION MUST SAY ABOUT ITS OWN SEQUENCING: NONE OF IT IS NEXT, AND SAYING SO IS THE POINT.**

**The program's live state:** W0 closed; W1 complete (§273); W2 landed whole (§274); **W3 was killed mid-lane by the weekly limit** with the fossil reservation unstarted; the Fable retrovalidation over §238–§274 is **OWED**; and §274.3's **eleven self-crossing circuit segments over sixteen leaves are RATCHETED, NOT CURED.**

⭐⭐ **AND ONE OPEN DEFECT IS A HARD PREDECESSOR OF EVERYTHING IN THIS SECTION, WHICH IS THE MOST USEFUL SEQUENCING FACT HERE.** §274.3: **five of ten walled leaves ship a wall that crosses itself**, and every census in the programme is blind to it. `loopFreeRing`'s own docstring names the cause — *"offsetting a concave polygon along its vertex normals ALWAYS self-intersects once the offset exceeds the local feature size … `offsetPolygonOutward` introduced 8 of the corpus's 12 self-crossing circuit segments."*

> ⛔⛔ **A SELF-CROSSING RING IS A 2D DEFECT TODAY AND A 3D CATASTROPHE UNDER MASSING.** A ring that crosses itself does not bound a solid. Extrude it and the wall has no inside; light it and the shadow silhouette is undefined; census it volume-true and the predicate has nothing to answer. **THE GEOMETRY KERNEL MUST BE SOUND BEFORE ANYTHING GAINS A THIRD DIMENSION** — a real polygon offset that cannot emit a self-intersecting ring, replacing the vertex-normal mitre and its after-the-fact lobe excision.

**RECOMMENDED ORDER (vetoable, and the first three are the argument):**

| # | what | why here |
|---|---|---|
| **0** | the owed retrovalidation; W3 restarts from its brief | the owner's standing instruction; nothing below jumps it |
| **1** | ⛔ **the offset/overlay kernel** — a real polygon offset; `properCross` given ONE home; the self-intersection census §274.3 already ordered | **the hard predecessor above.** ⭐ **It rides ALONE — see the shift ruling below** |
| **2** | ⭐⭐ **G-48 the vertical ground law**, specified and pinned | before massing, or every legal vertical case is a violation and the cure becomes an exemption list |
| **3** | **G-51P projection instrument**, then **G-52** settled; `AMP-1`/G-51W proceeds as an independent evidence program | visual bands need a visual instrument, while historical world bands need eligible architectural sources; neither may impersonate the other |
| **4** | ⭐ **G-49/D3a dormant massing contract + explicit-input analytic roofs**, then **G-50 the light bake-off** | proves geometry/projection machinery without activating historical priors; the generated Table B row flips only at evidence-gated D3b |
| **5** | **G-54 connection points**; strata leaves; the undercity leaf gains 2.5D | ⭐ G-54 is cheap and should be minted with the strata regardless of what else waits |
| **6** | ⛔ **THE SKY PROGRAM — G-55, G-56, G-57 — ITS OWN WAVE, AND PARKED UNTIL EVERY ROW ABOVE IS GREEN** | see below |

> ⛔⛔ **THE SKY PROGRAM IS DELIBERATELY DEFERRED — DOCUMENTED, NOT A THREAD DROPPED.**
> **It is architected in full here so that nothing has to be re-derived, and it is parked so it cannot displace the substrate, frontage, countryside and historical work that actually decides whether the map is convincing.** ⭐ *The base's own warning applies to us: the supplement must prevent later ambitions from displacing the work that determines whether the map is believable.* A settlement with floating islands and no frontage line is a worse product than a settlement with frontage and no islands. **S9 is still NOT BUILT and is the #1 ranked gap in both studies.**

#### ⟦FOLD §278⟧ ⭐⭐ THE DECLARED SAME-SEED SHIFT FOR THE OFFSET KERNEL — RULED BY THE CHAIR ON THE OWNER'S EXPLICIT DELEGATION (2026-08-19)

> ⭐⭐⭐ **RULING: THE OFFSET KERNEL LANDS FIRST AND ALONE, AS ITS OWN MICRO-WAVE WITH ITS OWN RECEIPT, BEFORE ANY OF W3'S CONTENT. IT IS NOT BUNDLED INTO W3'S SHIFT.**

**THE REASONING, AND IT IS THE PROGRAM'S OWN ATTRIBUTION DISCIPLINE RATHER THAN A PREFERENCE:**

1. ⛔ **W3 ALREADY CARRIES A SHIFT OF ITS OWN.** Frontage-first, the single subdivision routine, footprint fitting and per-edge setbacks all move geometry by design. **Bundling the offset cure with them produces a receipt that cannot say which change moved which pixel.**
2. ⚠⚠ **THAT EXACT FAILURE HAS ALREADY BITTEN THIS PROGRAM AND COST IT A ROUND.** §0.3a's standing rule exists because of it: *"STATE THE MOVEMENT AS ONE MOVEMENT WITH TWO NAMED HALVES, NEVER AS ONE NUMBER. ⛔ `100 → 165` IS NOT ONE MOVEMENT and must never be published as one."* A bundled cure re-creates that ambiguity **deliberately**, which is worse than stumbling into it.
3. ⭐ **THE PATTERN IS PROVEN AND RECENT.** §269's performance pass ran **next and alone** and returned *"2× at the metropolis, ZERO PIXELS MOVED"* — a receipt of unarguable clarity precisely because nothing else was in flight.
4. ⭐ **AND §274 ALREADY DECLINED TO BUNDLE IT, FOR THE SAME REASON:** *"curing it would spend this wave's shift twice on a defect it did not introduce."* **This ruling completes that judgment rather than reversing it** — W2 was right not to take it, and the answer was never "bundle it into W3", it was "give it its own turn."

⭐⭐ **THE ACCEPTANCE TARGET THAT MAKES THIS SHIFT SMALL RATHER THAN TOTAL — AND IT IS A CHECKABLE CLAIM, NOT A HOPE.** A correct polygon offset and a naive vertex-normal mitre **agree exactly wherever the mitre did not fold.** The fold only occurs where the offset exceeds the local feature size. Therefore:

```
⭐ THE PREDICTION THIS WAVE IS GRADED ON:
     leaves that currently ship a self-crossing wall     MOVE     (5 of 10 walled)
     every other leaf                                   BYTE-IDENTICAL

⛔ IF EVERY WALLED LEAF MOVES, THE CURE IS WRONG — it has changed
   the offset's behaviour in the ordinary case, not just the
   degenerate one, and that is a finding rather than a shift.
```

**EXIT CRITERIA:**

```
self-intersection census        11 → 0   (§274.3 ordered it; this is what clears it)
the four drawn censuses         0, area-true, unchanged
determinism                     10/10, one digest
op ceiling                      no ceiling raised
`properCross`                   ONE exported home; the second
                                spelling in groundLaw.js is gone
per-leaf byte-identity          proved leaf by leaf, not in aggregate
                                ⚠ an aggregate hash proves nothing here —
                                  the whole claim is WHICH leaves moved
the declared shift              named, attributed, and OWNED by this
                                micro-wave alone
```

⚠ **AND THE ONE THING THIS RULING DOES NOT DECIDE, BECAUSE IT IS NOT MINE TO DECIDE: whether the re-recorded plates are accepted.** The shift is *declared* here; a declared shift is still an owner-facing event under the standing law, and the 5 moved leaves owe eyes-on before they are banked.
> ⭐ **And the reassurance the deferral deserves: the sky program needs NO new lifecycle machinery** (§6.7.7). When its wave opens it is composition, not invention.

⚠⚠ **THE COST, STATED WITH THE NUMBERS RATHER THAN AROUND THEM.**

| fact | value | source |
|---|---|---|
| metropolis `buildFabric` | 2,436 ms cold → ~2× better after the perf pass | §267.4, §269 |
| shipping map today | 5–21 ms | §267.4 |
| op ceiling | 2,200/leaf against a folio measuring 8,226–8,999 | §267.5(d), §274.2 |
| §220 app-realistic gate | ⛔ **still open** — *"NOT ACHIEVABLE AT CURRENT GRAIN — BUT ACHIEVABLE"* | §267.4 |
| PDF | folio cannot enter today's path; ≈3.3 s projected | §267.4 (**PLAUSIBLE**) |
| massing's primitive multiplier | **3–5× on the fabric layer** | ⚠ **PLAUSIBLE — estimated, not measured** |

⭐ **THREE THINGS MAKE IT SURVIVABLE, AND TWO OF THEM ARE ALREADY RULED.** §217 grants budget raises *"where necessary to reach the full ambition"*, measured first and re-pinned. **§267.5(b) already ruled the exact prerequisite for a different reason** — *"the fabric must emit an ADDRESSABLE DRAW LIST, not an opaque SVG string"* — and a draw list carrying per-element `z`, leaf and body identity is precisely what depth-sorted 2.5D across leaves needs. And **the SINGLE-LEAF LAW means strata cost nothing to draw** (§6.2): the multiplier is massing on one leaf, not ×N for levels.

⭐⭐ **WHAT THE ORDER BUYS BACK, AND IT IS NOT SMALL.** Collapsing every view into one **retires ~1,250 lines of built code** (`SettlementMapPane.jsx` 713 + `townMapModel.js` 533 — **CONFIRMED**, and the only map view actually built; there is no `panorama` anywhere in the app tree), **supersedes M-1…M-4 as designs that were never built**, absorbs M-0's massing layer and its Institution Silhouette Law rather than discarding them, and **moots `THE_ARCHITECTURE_KERNEL_3D`'s open PROMISE-versus-GPU fork entirely** — a deterministic CPU plan-view render keeps THE PROMISE literally and the GPU question never has to be asked. ⭐ *One decision closes a canonical-truth problem and a constitutional fork.*

---

### §6.10 · CHAIR QUESTIONS RAISED BY THIS SECTION — Q-7 … Q-11 (⛔ Q-9 CLOSED)

**Raised rather than filled, per §0's rule. Q-9 is closed below; Q-7, Q-8, Q-10 and Q-11 remain open unless §10 resolves their dependency rather than their owner choice.**

**Q-7 · Does the amendment to §153's ERA LAW need the owner's own hand?** §153 was a chair ruling **on owner delegation** ("you need to decide the style") and was marked vetoable. §6.0 amends its wording — *no ELEVATION DRAWING* rather than *no fake-3D* — on the argument that the intent is unchanged and the corpus already asks for roof form. ⚠ **But the owner's 2.5D order is itself the amendment's warrant, so this may already be answered.** Recorded so it is not assumed.

**Q-8 · MIGRATION or EXCAVATION as the default when land ascends?** §6.7.6 rules **migration** (the ground stays; souls and capital move; the settlement gains capacity), with excavation retained as a rare dated event. ⚠ The owner's *"offer more space"* supports migration, but the reading is inferred and the alternative is genuinely more dramatic.

**Q-9 · ⛔ SUPERSEDED BY §10.21–§10.22 — NO INCIDENCE LAW.** The former one-in-four ceiling,
5–6% estimate and count/size-distribution verdict were synthetic occurrence priors. They are
withdrawn. HEEP/UCF/AMP/RSLP are non-probability programs and cannot restore them. Every floating
land instead requires its own explicit canonical cause; aggregate incidence and count/size summaries
are nonauthorizing diagnostics unless a future registered probability-sampling protocol identifies
the relevant estimand.

**Q-10 · Does the sky leaf carry its own undercity?** §168 rules that an undercity *is a city in its own right*, with the full machinery recursively one stratum down. ⚠ **A floating land is a settlement on a leaf. Does the recursion apply — cellars inside the rock, a keel-city?** It is derivable and it is also a scope cliff. **Recorded, not proposed.**

**Q-11 · Conservation across the world, or within the settlement?** §6.7.6 conserves within one settlement. ⚠ **If two neighbouring settlements share one arcane authority, does lifting land in one draw souls from the other?** That reaches the world-pulse and the region, and it is exactly the kind of edge the temporal-receipt boundary exists to govern — **`state_t → map_t → receipt_t → state_{t+1}`, never same-pass.** Raised because the answer decides whether the sky is a settlement feature or a world feature.

---


---


---

### ⟦FOLD §281⟧ §6.11 · ⭐⭐ THE TEMPORAL REGISTER — SEASON AND OCCASION

> **THE OWNER'S ORDER (2026-08-19): a settlement in a campaign whose clock has STARTED shows SEASONAL VARIANCE — snow in winter, foliage and colour in autumn — and carries a SEASONAL THEME during the week of a festival event.**

⭐⭐ **AND THE FIRST FINDING IS THAT THE SEAM IS ALREADY BUILT AND THE GATE IS ALREADY THE DOCUMENTED DEFAULT.** `mapEdits.js` carries **IT-3 SEASON OVERRIDE** — `SEASON_OVERRIDE_IDS = ['spring','summer','autumn','winter']`, the 4-4-5 calendar's four quarters, `readSeasonOverride`, `pinSeasonOverride` — and its own docstring states the rule the owner just asked for: *"null (absent) is the default ⇒ the map follows the live season **(or is seasonless with no campaign)**."* ⭐ **What exists is the DM's pin and the gate. What does not exist is `resolveMapDress` — the consumer. This subsection specifies it.**

#### §6.11.1 · SEASON IS TEMPORAL STATE — the third domain, and the hash law

```
WORLD            durable spatial facts — masses, roofs, keels, cadastre
                 ⛔ SEASON MAY NEVER TOUCH THIS
TEMPORAL STATE   ⭐ season · festival · siege · fire · lit fixtures ·
                 condition at the selected date
PROJECTION       camera · light rig · visibility · shadow · tone
```

> ⛔⛔ **THE HASH LAW, AND IT IS THE SAME ONE THE LIGHT PROFILE OBEYS: CHANGING THE SEASON MUST LEAVE EVERY WORLD HASH BYTE-IDENTICAL.** Snow does not move a building. A frozen harbour does not re-cut a quay. ⭐ *If turning the map to winter re-rolls one parcel, the whole temporal register is wrong and the census must say so.*

⚠⚠ **DETERMINISM: SEASON DERIVES FROM THE CAMPAIGN CLOCK, NEVER FROM `Date`.** The purity scan bans ambient time across 45 files and reads none; **the temporal register must not be the exception that breaks it.** Season = `f(campaignClock quarter, climate from terrain/latitude facts we hold)`. ⭐ *A settlement with no campaign is seasonless by construction — not "defaulted to summer", which would be a silent world fact.*

**RESOLUTION ORDER, and it is already half-implemented:**

```
1  the DM's PINNED seasonOverride     (IT-3, built)     ⭐ always wins
2  the live campaign clock quarter    (gate: clock started)
3  ⛔ SEASONLESS — the base register   (no campaign)
```

#### §6.11.2 · ⭐⭐⭐ SEASON IS CAUSAL, NOT COSMETIC — and the corpus already proves it

⛔⛔ **BANNED PRIOR #8 GOVERNS THIS SUBSECTION AND IT IS THE MISTAKE A NAIVE IMPLEMENTATION WILL MAKE: *"State marks must be ADDED GEOMETRY IN THE SAME INK FAMILY. Famine is drawn by subtracting ACCENTS, never by lightening the fabric."*** **Winter is not a white wash over the plate. Autumn is not an orange filter.**

⭐⭐⭐ **THE CORPUS SETTLES THIS WITH A ★★ KEEPER, AND IT IS THE BEST EVIDENCE IN THE WHOLE SUBSECTION — hf282 `town-frozen-harbor`:** *"one ice sheet w/ pressure ridges, five ships frozen at angles each ringed by trodden paths, **SAWN CHANNEL** w/ block ranks + saw-crews' hut, **staked ice road** to the island fort, fishing holes w/ windbreaks, **winter market ON the ice**, slack chain, **try-yard idle**."*

> **Read what that plate actually does. The harbour froze, so a channel is SAWN. The water became ground, so a road is STAKED across it. The market MOVED onto the ice. The try-yard went IDLE. ⭐ WINTER DID NOT RECOLOUR THE TOWN — IT CHANGED WHAT THE TOWN WAS DOING.**

**THE LAW: A SEASON ADDS GEOMETRY, SUBTRACTS ACCENTS, AND RELOCATES FUNCTION. It never merely tints.**

| register | ADDED geometry | SUBTRACTED accents | RELOCATED function |
|---|---|---|---|
| **WINTER** | snow mass on roof planes and open ground · ice sheet w/ pressure ridges · sawn channel · staked ice road · windbreaks · smoke from more hearths | ⭐ market stalls · drying frames · open-air work · the try-yard · orchard detail under snow | ⭐ **the market onto the ice; work indoors; the ferry to the ice road** |
| **AUTUMN** | stubble and rick geometry in the fields · fruit-press activity · fair ground marked out | standing crop · summer stalls | ⭐ **the harvest fair; the slaughter yard busy** |
| **SPRING** | plough lines · lambing pens · flood fringe on the low ground | ⭐ ice and snow geometry removed | the fields re-occupied |
| **SUMMER** | full canopy · open-air trestles · drying frames · dust on the roads | — | ⭐ **work moves OUTSIDE — the base register** |

⚠ **AND THE TONE HALF IS SECOND, NEVER FIRST.** Palette shifts (the autumn canopy, the winter ground) ride the existing ten-role lens vocabulary in `folioLenses.js` as a **seasonal sub-palette**, exactly as hf34's ward-level sub-palette does. ⛔ *A season that is only a palette is banned prior #8 with a new name.*

#### §6.11.3 · ⚠⚠ THE TONE CONFLICT THAT WILL RED A GREEN CENSUS

> ⛔⛔ **ATLAS Table B carries *"Roads palest, roofs ≥3 steps darker | universal | held | MEETS"*. UNDER SNOW, ROOFS ARE PALE — AND THAT ROW WILL RED ON EVERY WINTER PLATE.**

⭐ **This is exactly the class §274.4(b) named: a standing instrument meeting a state it was never written for.** The cure is **not** to exempt winter and it is **not** to keep roofs artificially dark:

```
⭐ THE RULE: the tone HIERARCHY is invariant; the tone ROLES are seasonal.
   What "roads palest" actually asserts is a LEGIBILITY ORDER — the street
   web must read as the palest connected structure so the plan is readable.
   Under snow the ground is pale and the ROOFS become the pale role, so the
   census must assert the ORDERING, parameterised by register, rather than
   a fixed role-to-value mapping.
⛔ AND THE ORDERING MUST STILL HOLD: if snow makes roofs and roads the same
   value, the plan has stopped being readable and THAT is a real red.
```

⚠ **EVERY SEASONAL REGISTER OWES ITS OWN PASS OF TABLE B, and the winter register is the one most likely to break it.** *This is cheap to find now and expensive to find in a soak.*

#### §6.11.4 · INTERACTIONS — explicit contracts, never free causality

```
⚠ SHADE EXPOSURE × SEASON (§6.7.4/§10.8)
    only a licensed WorldSolarProfile may vary solar exposure by season.
    Any thaw/frost consequence additionally requires a separate climate and
    ground-thermal law plus an earlier-tick receipt. Projection-light offset
    H·cot ε supplies none of those facts.

⭐ FOLIAGE CLASS × SEASON
    deciduous canopy drops; conifer does not. A settlement under broadleaf
    is a different plate in January; one under pine is not.
    ⚠ The foliage class already exists in the massing vocabulary.

⭐ SEASON × THE UNDERCITY
    ⛔ NOTHING. The undercity has no sky, no snow and no canopy — its
      register is invariant. A seasonal dress applied below ground is a bug,
      and the census should say so.
    ⚠ ONE EXCEPTION, and it is causal: SPRING FLOODING reaches the sewers.
```

#### §6.11.5 · ⭐⭐ OCCASION — the festival week

**A festival is not a season. It is an EVENT: dated, local, brief, and it changes the USE of space rather than the state of the ground.**

```
OccasionDress
  occasionId      EntityId — ⭐ the EVENT's own id, from the log
  window          [start, end] on the campaign clock — the "week of"
  kind            MARKET_FAIR · PATRONAL_FEAST · HARVEST · MUSTER
                  · CORONATION/ENTRY · FUNERAL RITE · CONSECRATION
                  · founding day · a settlement-specific rite
  route           the processional way, if the occasion has one
  grounds         where the temporary structures stand
```

⭐ **WHAT IT DRAWS — added geometry, and every element has a home in a stage that already exists:**

```
temporary stalls and booths on the market and the fair ground   S12 voids
the processional ROUTE dressed — the corpus already has this:
    hf181's "processional way w/ stational shrines"             S16/S23
bunting, poles, garlands as ACCENT geometry (rationed 1–3%)     §12 immersion
tented ground and horse lines outside the gates                 S15 extramural
⭐ AND THE SUBTRACTIONS: ordinary trade suspended; the workaday
   accents pulled; the ground given over
```

⚠⚠ **THE OCCASION IS AUTHORED BY THE WORLD, NOT BY THE RENDERER.** It renders only where an actual dated event exists in the log for that settlement in that window. ⛔ **A generator that invents a festival because the week looked empty has minted a world fact at render time** — the exact prohibition §6.4 opens with. ⭐ *A settlement with no festival in that week shows no festival, and that silence is correct.*

⭐ **AND THE COMPOSITION RULE, BECAUSE BOTH CAN BE TRUE AT ONCE: SEASON IS THE GROUND, OCCASION IS THE DRESSING.** A patronal feast in January is a festival **on snow** — the ice road still staked, the booths on the ice. ⛔ *Occasion never replaces the season's geometry; it lands on top of it.*

#### §6.11.6 · THE CENSUSES

| census | must read | catches |
|---|---|---|
| **season hash invariance** | ⭐ every WORLD hash **byte-identical** across all four registers | season leaking into world truth |
| **seasonless default** | no campaign ⇒ no register applied, and it **reports "seasonless"**, never "summer" | a silent default becoming a world fact |
| **no ambient time** | the purity scan still reads **zero** `Date` | ⛔ the temporal register breaking the oldest law in the program |
| **causal, not cosmetic** | each register changes **geometry counts**, not only palette | ⛔ banned prior #8 with a new name |
| **tone ordering holds** | the legibility order survives every register; roads and roofs never collapse to one value | ⭐ §6.11.3's conflict |
| **undercity invariant** | subterranean leaves identical across registers (except spring flood) | a seasonal dress applied underground |
| **occasion provenance** | every dressed occasion names a dated event in its window | ⛔ a festival invented at render time |
| **occasion is additive** | removing the occasion returns the plate to its season exactly | dressing that mutates the ground |
| **pin precedence** | a pinned `seasonOverride` beats the live clock, and undoing it restores byte-identically | IT-3's contract |

---

## ⟦FOLD §280⟧ §7 · THE DIMENSIONAL BUILD SHEET — HOW §6 IS ACTUALLY BUILT

### ⟦FOLD §280⟧ ARCHITECTED 2026-08-19 ON THE OWNER'S ORDER. DESIGN ONLY — ⛔ NOTHING IMPLEMENTED, NOTHING DISPATCHED.
### **§6 is law and design. §7 is the substrate that makes it executable**: the artifact contracts, the module map, the stage integration, the key spaces, the random namespaces, the derivation edges, the census roster, the wave sheet, the dormancy proof and the refusals. It stands to §6 as §1 + §5 stand to the base pipeline.

### §7.0 · HOW TO USE THIS, AND WHAT IT IS NOT

**The reader:** an engineer with no memory of this program, holding §6, who has to write the code.

⚠ **TYPESCRIPT NOTATION BELOW IS INTERFACE NOTATION, NOT A MIGRATION ORDER.** The codebase is **JavaScript with JSDoc types** and the doctrine forbids a TypeScript migration as an incidental refactor. Every shape below lands as a JSDoc `@typedef` in the module that owns it. *(B-DOC makes the identical caveat about its own notation, and it is right.)*

⛔ **NOTHING HERE RAISES A RATCHET.** Where new work would exceed a budget, this sheet says so and routes it to §217's measured-raise procedure — it never assumes the raise.

⚠⚠ **AND THE HARD CONSTRAINT A BUILDER MUST KNOW BEFORE WRITING A LINE: `buildFabric.js` IS AT ITS RATCHET CEILING** (§0.3's `sizeBaseline` MAX **790 against 800**; §267.5a records it as *"four lines of headroom"*). ⛔ **NO §6 WORK MAY BE WRITTEN INTO `buildFabric.js`.** Every new mechanism lands in its own module and is *called* from the assembly, and the assembly's growth must be net-zero or negative — which the §267.5(b) draw-list extraction is expected to relieve. **This is not a style preference; it is a ratchet that will red the wave.**

---

### §7.1 · THE ARTIFACT CONTRACTS

**Every new canonical shape, in one place. All are FROZEN on publication; transient builders may mutate internally and freeze at the end. All carry the existing provenance idiom.**

#### §7.1.1 · The leaf and the scene root

```ts
type LeafIndex = -2 | -1 | 0 | 1; // deep · undercity · surface · sky; no undeclared leaves
type SubterraneanLeafIndex = -2 | -1;

type GroundSurfacePatchRole = 'TERRAIN_FACE' | 'CAVITY_FLOOR' | 'CAVITY_WALL'
  | 'CAVITY_CEILING' | 'ENGINEERED_FLOOR';

interface GroundSurfacePatchQ {
  patchId: EntityId;
  role: GroundSurfacePatchRole;
  geometry: SurfacePatchQ;                  // sole quantized surface geometry for this patch
  provenanceRef: ProvenanceRef;
}

interface GroundSurfaceBaseQ {
  surfaceId: EntityId;
  patches: readonly [GroundSurfacePatchQ, ...GroundSurfacePatchQ[]];
  source:
    | { kind: 'FABRIC_TERRAIN'; sourceRef: ArtifactHashRef }
    | { kind: 'SPATIAL_OPERATION'; sourceRef: ArtifactHashRef }
    | { kind: 'IMPORTED_CANON'; sourceRef: ArtifactHashRef }
    | { kind: 'AUTHORED_CANON'; sourceRef: ArtifactHashRef };
  activeFrom: TimeKey;
  removedAt?: TimeKey;
  coordinateAbiVersion: number;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type GroundSurfaceQ =
  | (GroundSurfaceBaseQ & { leafIndex: 0; kind: 'TERRAIN' })
  | (GroundSurfaceBaseQ & { leafIndex: SubterraneanLeafIndex;
      kind: 'CAVITY_FLOOR' | 'CAVITY_WALL' | 'CAVITY_CEILING' | 'ENGINEERED_FLOOR' });

interface GroundSurfaceRegistry {
  artifactKind: 'GROUND_SURFACE_REGISTRY';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  effectiveAt: TimeKey;
  coordinateAbiRef: ArtifactHashRef;
  lawManifestRef: ArtifactHashRef;
  surfaces: readonly [GroundSurfaceQ, ...GroundSurfaceQ[]];
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface GroundSurfaceRef {
  registryRef: ArtifactHashRef;
  surfaceId: EntityId;
  surfaceContentHash: ContentHash;
  leafIndex: 0 | SubterraneanLeafIndex;
}

type LeafRosterEntry =
  | { leafIndex: 0; reason: 'SURFACE_REQUIRED'; causeRef: ArtifactHashRef }
  | { leafIndex: SubterraneanLeafIndex; reason: 'ACTIVE_SUBTERRANEAN_CONTENT';
      causeRef: ArtifactHashRef }
  | { leafIndex: 1; reason: 'ACTIVE_SKY_CONTENT'; causeRef: ArtifactHashRef };

interface LeafRoster {           // §6.7.13 — DERIVED PER YEAR, never declared
  artifactKind: 'LEAF_ROSTER';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  entries: readonly [LeafRosterEntry, ...LeafRosterEntry[]]; // ascending; exactly one surface
  sourceSpatialRef: { artifactId: ArtifactId; contentHash: ContentHash };
  contentHash: ContentHash;
}

type LeafSubstrate =
  | { kind: 'SURFACE_TERRAIN'; leafIndex: 0; terrainSurfaceRef: GroundSurfaceRef }
  | { kind: 'SUBTERRANEAN_SURFACES'; leafIndex: SubterraneanLeafIndex;
      surfaceRefs: readonly [GroundSurfaceRef, ...GroundSurfaceRef[]] }
  | { kind: 'NO_CONTINUOUS_GROUND'; leafIndex: 1 };

interface ArtifactHashRef {
  artifactId: ArtifactId;
  contentHash: ContentHash;
}

interface EvidenceCoverageRef {
  registryRef: ArtifactHashRef;
  recordId: EvidenceId;
  coveragePath: 'coverage';
  coverageHash: ContentHash;
}

interface CauseRef {
  kind: 'OPERATION' | 'EVENT' | 'AUTHORITY_FACT' | 'IMPORTED_SOURCE' | 'AUTHORED_DECISION';
  artifactRef: ArtifactHashRef;
  subjectId?: EntityId;
}

type CauseDisposition =
  | { status: 'KNOWN'; causeRef: CauseRef }
  | { status: 'UNKNOWN'; reason: 'SOURCE_SILENT' | 'CONFLICTING_EVIDENCE'
        | 'OUTSIDE_COVERAGE' | 'WITHHELD'; coverageRef?: EvidenceCoverageRef;
      provenanceRef: ProvenanceRef };

type DerivationAuthorityRef =
  | { kind: 'CANONICAL_OPERATION'; operationRef: ArtifactHashRef }
  | { kind: 'HISTORICAL_MECHANISM'; mechanismDefinitionRef: ArtifactHashRef }
  | { kind: 'OBSERVATION_LAW'; lawManifestRef: ArtifactHashRef };

interface ProvenanceRef {
  ledgerRef: ArtifactHashRef;
  provenanceId: EntityId;
  recordHash: ContentHash;
}

interface CanonicalSpatialArtifactBase {
  artifactKind: 'CANONICAL_SPATIAL';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  effectiveAt: TimeKey;
  mapTraditionId: 'EUROPEAN_FANTASY_BASE';
  spatialCompileInputRef: ArtifactHashRef; // exact request; transitively binds world + dossier
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  contentRegistryBundleRef: ArtifactHashRef;
  fabricRef: ArtifactHashRef;
  generationManifestRef: ArtifactHashRef;
  spatialOperationsRef: ArtifactHashRef;    // canonical empty artifact when no operations exist
  orderedDependencies: readonly {
    role: 'FABRIC' | 'MASSING' | 'SUBSTRATE' | 'RURAL' | 'VEGETATION' | 'OPERATIONS'
        | 'EVIDENCE_SCOPE' | 'MECHANISM_REGISTRY' | 'CONTENT_REGISTRY' | 'MANIFEST'
        | 'COORDINATE_ABI' | 'LAW';
    artifactId: ArtifactId;
    contentHash: ContentHash;
  }[];
  coordinateAbiVersion: number;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type CanonicalSpatialArtifact =
  | (CanonicalSpatialArtifactBase & {
      representationLaw: 'PLANAR_V1';
      massBodyRegistryRef?: never;
      vegetationRegistryRef?: never;
      groundSurfaceRegistryRef?: never;
      connections?: never;
      portals?: never;
      substrates?: never;
      lossRegions?: never;
    })
  | (CanonicalSpatialArtifactBase & {
      representationLaw: 'DIMENSIONAL_V1';
      massBodyRegistryRef: ArtifactHashRef; // exact CanonicalArchitecturalMassingPhase owner
      vegetationRegistryRef: ArtifactHashRef; // exact CanonicalVegetationPhase owner
      groundSurfaceRegistryRef: ArtifactHashRef; // exact GroundSurfaceRegistry owner
      connections: readonly ConnectionPoint[];
      portals: readonly PortalLink[];
      substrates: readonly [LeafSubstrate, ...LeafSubstrate[]];
      lossRegions: readonly LossRegion[];
    });

interface DimensionalScene {     // ONE leaf's drawable truth. §6.2 single-leaf law
  artifactKind: 'DIMENSIONAL_SCENE';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  sourceSpatialRef: ArtifactHashRef;
  leafIndex: LeafIndex;
  bodies: readonly SceneSpatialBody[];
  vegetationFields: readonly VegetationInstanceField[];
  substrate: LeafSubstrate;
  connections: readonly ConnectionPoint[];
  portals: readonly PortalLink[]; // derived leaf slice of canonical non-aligned links
  lossRegions: readonly LossRegion[]; // byte-equal active one-leaf slice
  contentHash: ContentHash;
}
```

⛔ **`DimensionalScene` TAKES EXACTLY ONE `leafIndex`. There is no multi-leaf scene type, and that absence IS the single-leaf law's enforcement** — a compositing pipeline cannot be written against a contract that has nowhere to put a second leaf. *(The §238 lesson: make the invalid state unrepresentable rather than forbidden by comment.)* **It contains no `ShadowCast`: a shadow is a per-light projection result over view-visible receivers, never dimensional truth (§10.7–§10.8).**

`substrate.leafIndex` must equal the scene leaf. Every surface ref resolves exactly one entry in the
root's `GroundSurfaceRegistry`, with matching registry hash, surface ID/hash, leaf, active time,
law and coordinate ABI. Leaf `0` resolves only `TERRAIN`; subterranean leaves resolve only registered
rock/cavity or engineered-floor receiver surfaces; leaf `1` is
`NO_CONTINUOUS_GROUND`. Floating-land caps and keels remain solely their `MassBody` solids/supports
and may be receivers through those patches—never copied into a singular scene-level “sky ground.”
Roster and scene carry no independent year. Their selected time is the exact source spatial
artifact's `effectiveAt`, joined to `TemporalObservation.sourceSpatialRef` and
`selectedSpatialEffectiveAt`; a mismatched roster/scene time therefore cannot be serialized.

`CanonicalSpatialArtifact` is the unique composition root for every dimensional body, field,
connection, portal, substrate and loss-region ID at one effective time. `MassBody` bytes have one
external owner—the exact `CanonicalArchitecturalMassingPhase` named by `massBodyRegistryRef`—and
are never reserialized in the spatial root. Vegetation masses, aggregates and fields likewise have
one external owner—the exact `CanonicalVegetationPhase` named by `vegetationRegistryRef`. Ground
surfaces have one external owner—the exact `GroundSurfaceRegistry` named by
`groundSurfaceRegistryRef`. The root directly owns only its connection, portal and loss registries.
A `DimensionalScene` is a hash-bound one-leaf slice, never another registry: every
member must resolve byte-for-byte from the exact massing registry, vegetation registry or ground-
surface registry, or from the root-owned connection/portal/loss collections, and
no canonical entity ID may have two owners. `PLANAR_V1` owns only
its exact fabric/operation/dependency refs and cannot smuggle empty or partial dimensional arrays.
`orderedDependencies` is a closed role map, not a bag: every artifact carries exactly one each of
`FABRIC`, `RURAL`, `VEGETATION`, `OPERATIONS`, `EVIDENCE_SCOPE`, `MECHANISM_REGISTRY`,
`CONTENT_REGISTRY`, `MANIFEST`,
`COORDINATE_ABI` and `LAW`, using a
canonical empty artifact for absent rural/vegetation state. `DIMENSIONAL_V1` additionally carries
exactly one `MASSING` entry equal to `massBodyRegistryRef` and one `SUBSTRATE` entry equal to
`groundSurfaceRegistryRef`; `PLANAR_V1` carries neither. Role duplicates,
unknown roles, wrong order, empty required roles or disagreement with `fabricRef`,
`spatialOperationsRef`, `generationManifestRef`, scope binding, ABI or law are publication failures.
The `COORDINATE_ABI` and `LAW` entries equal `coordinateAbiRef` and `lawManifestRef` exactly; their
numeric version fields are equality-pinned caches, never alternate authority.
The `RURAL` and `VEGETATION` entries equal the spatial compile input's `ruralLandscapeRef` and
`vegetationPhaseRef` at ID/hash in **both** representation laws, including canonical-empty artifacts.
Under DIMENSIONAL, `vegetationRegistryRef` equals that same VEGETATION ref; under PLANAR no hidden
vegetation registry exists.

#### §7.1.2 · Vertical geometry

```ts
type SceneSpatialBody = MassBody | VegetationMass;

type MassBody = GroundedMassBody | FloatingLandMassBody;

interface MassBodyBase {         // shared semantic body state; parts remain geometric authority
  bodyId: EntityId;
  leafIndex: LeafIndex;
  parts: readonly [MassPartQ, ...MassPartQ[]]; // ⛔ nonempty authority. Never a scalar height
  summaryHeight: HeightQ;                  // ⚠ CACHED INDEX ONLY, never truth
  provenanceRef: ProvenanceRef;                  // → binding §10.10 ProvenanceRecord
  contentHash: ContentHash;
}

interface GroundedMassBody extends MassBodyBase {
  kind: 'BUILDING' | 'DEFENCE' | 'INSTITUTION' | 'WORKS';
}

interface FloatingLandMassBody extends MassBodyBase {
  kind: 'FLOATING_LAND';
  leafIndex: 1;
  floating: FloatingLandLifecycle;
}

type MorphologyRole =
  | 'MAIN_RANGE' | 'CROSS_WING' | 'REAR_RANGE' | 'ANNEX'
  | 'STAIR_TOWER' | 'GALLERY' | 'PASSAGE' | 'LEAN_TO'
  | 'CURTAIN_RUN' | 'WALL_TOWER' | 'GATEHOUSE' | 'KEEP' | 'BELFRY'
  | 'SPIRE' | 'COVERED_PASSAGE' | 'LAND_CAP' | 'LAND_KEEL';

type FunctionalProgram =
  | 'DOMESTIC' | 'HALL' | 'SERVICE' | 'WORKSHOP' | 'BARN' | 'WAREHOUSE'
  | 'STORE' | 'INSTITUTION' | 'DEFENCE' | 'MIXED';

type FunctionalVolume =
  | 'OPEN_CLEAR' | 'DOMESTIC_STACK' | 'STORAGE_STACK' | 'PARTIAL_LOFT'
  | 'OCCUPIED_ATTIC' | 'UNINHABITED_ATTIC';

type MassingUnknownReason =
  | 'NOT_OBSERVED' | 'OUTSIDE_COVERAGE' | 'CONFLICTING_EVIDENCE' | 'WITHHELD';

type MassingKnowledge<T> =
  | { status: 'KNOWN'; value: T; provenanceRef: ProvenanceRef;
      coverageRef?: EvidenceCoverageRef }
  | { status: 'UNKNOWN'; reason: MassingUnknownReason; provenanceRef: ProvenanceRef;
      coverageRef?: EvidenceCoverageRef };

type StoreyCountQ = number & { readonly __storeyCountQ: unique symbol }; // nonnegative safe integer
type StoreyCountKnowledge = MassingKnowledge<StoreyCountQ>;

interface FloorProgram {
  squareStoreys: StoreyCountKnowledge;
  basement: MassingKnowledge<'NONE' | 'PARTIAL' | 'FULL'>;
  attic: MassingKnowledge<'NONE' | 'UNINHABITED' | 'OCCUPIED' | 'PARTIAL'>;
  partialFloor: MassingKnowledge<'NONE' | 'MEZZANINE' | 'INSERTED_FLOOR' | 'LOFT'>;
}

type MaterialComponentRole =
  | 'BASE' | 'LOADBEARING' | 'FRAME' | 'INFILL' | 'CLADDING' | 'FLOOR'
  | 'ROOF_STRUCTURE' | 'ROOF_COVERING' | 'REPAIR';

type MaterialId = string & { readonly __materialId: unique symbol }; // closed material registry

interface UnknownMaterialFact {
  reason: 'NOT_OBSERVED' | 'OUTSIDE_COVERAGE' | 'CONFLICTING_EVIDENCE' | 'WITHHELD';
  coverageRef?: EvidenceCoverageRef;
  provenanceRef: ProvenanceRef;
}

type MaterialCampaignKnowledge =
  | { status: 'KNOWN'; value: 'PRIMARY' | 'REPAIR' | 'REPLACEMENT' | 'REUSED' }
  | { status: 'UNKNOWN'; disposition: UnknownMaterialFact };

interface MaterialSystemRef {
  domain: 'ARCHITECTURAL_MASSING';
  scopePackId: string;
  scopePackManifestRef: ArtifactHashRef;
  protocolId: 'AMP-1';
  protocolVersion: string;
  lawVersion: LawVersion;
  materialSystemId: string;
}

interface MaterialComponentStateBase {
  componentId: EntityId;
  role: MaterialComponentRole;
  campaign: MaterialCampaignKnowledge;      // history knowledge, independent of identity knowledge
  constructionEpoch?: EpochId;
  removalEpoch?: EpochId;
  condition: MaterialConditionRef;
  provenanceRef: ProvenanceRef;
}

type MaterialConditionStateId = string & {
  readonly __materialConditionStateId: unique symbol;
};

interface MaterialConditionRef {
  conditionRegistryRef: ArtifactHashRef;
  conditionStateId: MaterialConditionStateId;
  effectiveAt: TimeKey;
  sourceOperationRef: ArtifactHashRef;
  provenanceRef: ProvenanceRef;
}

type MaterialComponentState =
  | (MaterialComponentStateBase & {
      materialKnowledge: 'KNOWN';
      materialId: MaterialId;               // material identity, never the token `mixed`
      materialEraId?: string;
      materialSystem?: MaterialSystemRef;
      localGrade?: never;
    })
  | (MaterialComponentStateBase & {
      materialKnowledge: 'KNOWN';
      materialId: MaterialId;
      materialEraId?: string;
      materialSystem: MaterialSystemRef;
      localGrade: number;                   // rung only inside this exact reviewed system
    })
  | (MaterialComponentStateBase & {
      materialKnowledge: 'UNKNOWN';
      unknownMaterial: UnknownMaterialFact;
      materialId?: never;
      materialEraId?: never;
      materialSystem?: never;
      localGrade?: never;
    });

type MaterialAbsenceReason =
  | 'NOT_APPLICABLE' | 'OPEN_STRUCTURE' | 'UNCLAD' | 'UNCOVERED_BY_DESIGN';

interface MaterialSlotBase {
  slotId: EntityId;
  role: MaterialComponentRole;
  provenanceRef: ProvenanceRef;
}

type MaterialSlotDisposition =
  | (MaterialSlotBase & { status: 'PRESENT'; component: MaterialComponentState })
  | (MaterialSlotBase & { status: 'NONE'; reason: MaterialAbsenceReason })
  | (MaterialSlotBase & { status: 'UNKNOWN'; unknownMaterial: UnknownMaterialFact });

interface PartConditionSummaryCache {
  conditionRegistryRef: ArtifactHashRef;
  conditionStateId: MaterialConditionStateId;
  sourceComponentIds: readonly [EntityId, ...EntityId[]];
  derivationLawRef: ArtifactHashRef;
}

type PartOrigin =
  | 'ORIGINAL' | 'PLANNED_EXPANSION' | 'PRESSURE_INFILL'
  | 'STATUS_EXPANSION' | 'REPLACEMENT' | 'ADAPTIVE_REUSE'
  | 'FIRE_REBUILD' | 'REPAIR';

interface MassPartQ {
  partId: EntityId;
  parentBodyId: EntityId;
  morphologyRole: MorphologyRole;          // arrangement/topology, not use
  functionalProgram: MassingKnowledge<FunctionalProgram>; // use, independent of shape/body kind
  solid: SolidPartQ;                       // footprint + support + closed quantized shell
  roof: RoofDisposition;                   // total disposition; UNKNOWN refuses DIMENSIONAL publish
  functionalVolume: MassingKnowledge<FunctionalVolume>; // hall void ≠ domestic floor ≠ storage loft
  floorProgram: FloorProgram;
  materialSlotSchemaRef: ArtifactHashRef;
  materials: readonly [MaterialSlotDisposition, ...MaterialSlotDisposition[]];
  conditionSummaryCache?: PartConditionSummaryCache; // derived only; component conditions own truth
  constructionEpoch: EpochId;
  removalEpoch?: EpochId;
  origin: MassingKnowledge<PartOrigin>;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

// A known exterior shell may coexist with UNKNOWN internal storey count. Projection reads only the
// shell/roof surfaces; it never defaults a floor count or converts an unknown interior into windows,
// capacity or height. KNOWN counts are nonnegative safe integers and resolve their exact evidence/
// authored provenance. Each part's function, floors, origin and lifecycle resolve its own record;
// body-level provenance cannot stand in for a later annex, inserted floor or replacement campaign.
// Every MassingKnowledge axis is total. UNKNOWN carries its own reason/coverage/provenance and no
// value; it cannot trigger a function-, floor-, volume- or origin-conditioned resolver. A known
// exterior shell may publish with unknown non-geometric internals only under this no-inference law.

type RoofDisposition =
  | { status: 'PRESENT'; form: RoofForm }
  | { status: 'NONE'; reason: 'OPEN_STRUCTURE' | 'UNROOFED_RUIN'
        | 'NO_DISTINCT_ROOF_ENVELOPE' | 'EXPLICIT_DESIGN'; provenanceRef: ProvenanceRef }
  | { status: 'UNKNOWN'; reason: 'NOT_OBSERVED' | 'OUTSIDE_COVERAGE'
        | 'CONFLICTING_EVIDENCE' | 'WITHHELD'; provenanceRef: ProvenanceRef };

interface MassAttachmentBase {
  attachmentId: EntityId;
  historicalRelation: 'CONTEMPORARY' | 'LATER_ADDITION' | 'REPLACEMENT'
                    | 'ABSORBED_EARLIER';
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface SolidContactRef {
  partId: EntityId;
  surfacePatchIds: readonly [EntityId, ...EntityId[]];
  edgeIds: readonly EntityId[];             // exact owning-solid topology refs, no copied geometry
}

type ClearanceLowerSubjectRef =
  | { kind: 'MASS_PART'; part: SolidContactRef }
  | { kind: 'ROUTE_CORRIDOR'; fabricRef: ArtifactHashRef;
      routeId: EntityId; corridorId: EntityId }
  | { kind: 'WATER_SURFACE'; sourceSpatialRef: ArtifactHashRef; surfaceId: EntityId };

type MassAttachment =
  | (MassAttachmentBase & {
      kind: 'SHARED_WALL' | 'BUTT_JOINT' | 'LEAN_TO_ABUTMENT' | 'TOWER_IN_WALL'
          | 'ROOF_VALLEY' | 'RIDGE_CONTINUATION';
      contacts: readonly [SolidContactRef, SolidContactRef];
      clearHeight?: never;
      separation?: never;
      connectionId?: never;
    })
  | (MassAttachmentBase & {
      kind: 'SPANS_BELOW';
      upperPart: SolidContactRef;
      lowerSubject: ClearanceLowerSubjectRef;
      clearanceProfileRef: ArtifactHashRef; // quantized derived free-volume/profile proof
      contacts?: never;
      clearHeight: HeightQ;
      separation?: never;
      connectionId?: never;
    })
  | (MassAttachmentBase & {
      kind: 'SUBTERRANEAN_UNDER';
      contacts: readonly [SolidContactRef, SolidContactRef];
      clearHeight?: never;
      separation: HeightQ;
      connectionId?: never;
    })
  | (MassAttachmentBase & {
      kind: 'TETHERED_ABOVE';
      contacts: readonly [SolidContactRef, SolidContactRef];
      clearHeight?: never;
      separation?: never;
      connectionId: EntityId;
    });

// Attachment geometry is resolved from the two owning solids' exact patch/edge IDs. Attachments
// live once in CanonicalArchitecturalMassingPhase.attachments, never under either endpoint body.
// The validator rejects copied boundaries, wrong-part refs, duplicate IDs/endpoint pairs,
// noncontacting contact kinds, missing/extra clearance or separation, and an unresolved tether.
// SPANS_BELOW is a clearance relation, not necessarily solid-solid contact: its lower subject
// resolves the actual route corridor, water surface or lower mass authority, and the exact
// clearance-profile artifact proves the quantized free volume against upperPart and clearHeight.

type RoofEdgeKind = 'RIDGE' | 'HIP' | 'VALLEY' | 'EAVE';
type RoofFormKind = 'GABLE'|'HIP'|'HALF_HIP'|'SHED'|'CROSS_GABLE'
  | 'COURTYARD_RANGE'|'TOWER_CAP'|'COMPOUND';
type RoofDrainageIntentId = string & { readonly __roofDrainageIntentId: unique symbol };

interface RoofSpecification {
  artifactKind: 'ROOF_SPECIFICATION';
  artifactId: ArtifactId;
  specificationId: EntityId;               // stable authored specification identity
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  ownerPartId: EntityId;
  kind: RoofFormKind;                       // explicit canon, never inferred by D3a
  drainageIntentId?: RoofDrainageIntentId;
  constructionEpoch: EpochId;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface RoofEdgeRef {
  edgeId: EntityId;
  kind: RoofEdgeKind;
  surfacePatchIds: readonly [EntityId, ...EntityId[]]; // one for eave; adjacent patches otherwise
}

interface RoofForm {
  roofId: EntityId; ownerPartId: EntityId;
  sourceSpecification: RoofSpecification;  // exact nested owner; no side-table/bare-id lookup
  kind: RoofFormKind;
  surfacePatchIds: readonly [EntityId, ...EntityId[]]; // refs owner solid.upperEnvelope only
  edgeRefs: readonly RoofEdgeRef[];         // topology refs; projection derives all ink
  constructionEpoch: EpochId;              // roof campaign is independent of wall/facade dates
  removalEpoch?: EpochId;
  structuralMaterialSlotIds: readonly [EntityId, ...EntityId[]];
  coveringMaterialSlotId: EntityId;         // total PRESENT/NONE/UNKNOWN part slot; never omission
  historyEventIds: readonly EntityId[];    // replacement/repair history, not solver fallback
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface RoofCompileReceipt {             // external diagnostic; never a RoofForm dependency
  artifactKind: 'ROOF_COMPILE_RECEIPT';
  artifactId: ArtifactId;
  schemaVersion: number;
  sourceSpecificationRef: ArtifactHashRef;
  sourceGeometryInputRef: ArtifactHashRef;
  completedMassingRef: ArtifactHashRef;
  roofId: EntityId;
  primaryAlgorithmVersion: string;
  completedAlgorithmVersion: string;
  outcome: 'PRIMARY' | 'PROVEN_EQUIVALENT_ALTERNATE';
  equivalenceProofRef?: ArtifactHashRef;    // required iff alternate; same spec/topology/geometry
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface RoofCompileFailureDiagnostic {   // refusal evidence, not a canonical roof
  artifactKind: 'ROOF_COMPILE_FAILURE';
  artifactId: ArtifactId;
  sourceSpecificationRef: ArtifactHashRef;
  sourceGeometryInputRef: ArtifactHashRef;
  attemptedAlgorithmVersion: string;
  refusal: 'ROOF_COMPILE_FAILED' | 'MASSING_CANON_INCOMPLETE';
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  contentHash: ContentHash;
}
```

Every `MassPartQ` owns one total `RoofDisposition`. `PRESENT` owns one `RoofForm`, and that roof owns
its exact hash-addressed `RoofSpecification`; `NONE` carries a closed reason and provenance;
`UNKNOWN` carries an epistemic reason and makes `DIMENSIONAL_V1` publication refuse. Omission is not
a fourth meaning. For PRESENT, specification/roof/part owner IDs, kind, construction epoch, law and
ABI must agree and both hashes participate in the massing artifact. No compiler or renderer may
recover a roof specification from an unowned side table or a bare entity ID.
Compiler algorithm/path diagnostics are external. A successful `RoofCompileReceipt` may bind an
already-complete massing artifact and prove that an alternate algorithm emitted exactly the same
specification, topology and quantized geometry, but the roof never depends on that receipt. A failed
compile emits only `RoofCompileFailureDiagnostic` and cannot publish a substitute roof. Equivalent
primary/alternate compilers therefore produce the same `RoofForm`/massing hash; result receipts may
differ without changing semantic geometry or creating an output-receipt hash cycle.

`UNKNOWN` is legal in evidence observations, imports and unresolved authoring drafts. It is not a
licence for projection to improvise. Before publishing a dimensional scene, the compiler must either
resolve every geometry-bearing field through canonical provenance, emit `MASSING_CANON_INCOMPLETE`,
or deliberately publish the recorded `PLANAR_V1` law with no dimensional claim. A renderer never
chooses a roof, pitch, floor programme, material or height to make a plate look finished.

A component may carry `localGrade` only with a full `MaterialSystemRef`, and that reference must
equal the `SUPPORTED` architectural-massing binding at domain + pack + pack-manifest ID/hash +
protocol ID + protocol version + law. A bare
material-system string or local grade is a compile refusal, not a fallback. `DIMENSIONAL_V1` bodies
are nonempty; planar compatibility uses the separate representation law rather than `parts: []`.
Campaign knowledge and material-identity knowledge are separate discriminated axes. `UNKNOWN`
material forbids material ID/system/grade and carries reason, coverage and provenance. Publication
must either use a declared material-independent neutral projection that contributes no inferred
material/transmission fact, or emit `MATERIAL_CANON_INCOMPLETE`; projection may never translate
unknown material into stone, timber, opacity, grade or a palette family by default.

Every part carries one nonempty, uniquely keyed `MaterialSlotDisposition` roster validated against
its exact `materialSlotSchemaRef`. The schema defines the required roles for that part/roof recipe.
`PRESENT` owns exactly one component whose `role` byte-equals its slot role; `NONE` carries a closed
structural reason; `UNKNOWN` carries an `UnknownMaterialFact`. No required slot may be omitted.
A PRESENT roof's nonempty structural slot IDs and single covering slot ID resolve in the containing
part, with `ROOF_STRUCTURE` and `ROOF_COVERING` roles respectively; an intentionally uncovered roof
therefore references a covering slot whose disposition is `NONE`, not an absent field. Duplicate,
wrong-role, cross-part or unresolved slot IDs refuse publication.

Component `condition` is the sole condition authority. It resolves an exact versioned registry
state, effective time, dated source operation and provenance. `conditionSummaryCache`, when present,
must list the complete contributing component IDs and be reproducible by its exact derivation law;
placement, material response and historical operations never read the cache as truth. A free part-
level condition string or disagreement between component conditions and the cache is invalid.

`RoofForm` contains **no coordinates**. Every `surfacePatchId` must resolve to a patch in the owning
part's `SolidPartQ.upperEnvelope`; every edge reference must resolve to the exact boundary or shared
boundary of those patches, and the edge set must completely classify the applicable envelope
adjacencies/boundaries without extras or omissions. `kind` is a pinned classifier over that topology,
not a second command to regenerate different faces. Ridge, hip, valley and eave ink is a projection
of the same topology. Eave,
wall-top and maximum heights are computed queries over the closed shell and referenced patches,
never stored fields. The compiler rejects an unresolved patch, non-adjacent edge, shell/patch
closure mismatch, source-specification mismatch or roof owner mismatch. Because a PRESENT roof is
nested in its owning `MassPartQ`, it
cannot disappear into a `roofForms.js` side table: `roof.ownerPartId` must equal the containing
`partId`, every `roofId` is unique across the canonical phase, epochs and material-component IDs
resolve inside that body, and no roof may be shared by two parts. Visually continuous roofs across
semantic parts use typed `RIDGE_CONTINUATION` attachments, never multiple ownership.

⚠ **`summaryHeight` IS A CACHE AND MUST BE PROVED TO BE ONE.** A source scan refuses any legality, shadow or census predicate that reads it. **`summaryHeight === maxZ(parts[].solid.closedShell)` is a pin, not a definition.**

#### §7.1.3 · The floating land

```ts
interface FloatingLandLifecycle {          // state carried by kind:'FLOATING_LAND' MassBody
  landId: EntityId;                        // === owning MassBody.bodyId
  maintainedSupportId: EntityId;           // === every cap/keel part's support.surfaceId
  capPartId: EntityId;                     // → owning MassBody.parts[morphologyRole=LAND_CAP]
  keelPartIds: readonly EntityId[];        // → closed LAND_KEEL parts
  anchors: readonly EntityId[];  // → ConnectionPoint
  ascensionEpoch: EpochId;
  highWaterArea: AreaQ;          // extent history; current area derives from cap solid
  liftBudget: MeasureQ;          // §6.7.2 — the maintained work
  causeRef: CauseRef;            // the authority + node that lift it
  regimeId: 'ARCANE_SOVEREIGN' | 'ARCANE_CHARTERED' | 'ARCANE_SUBORDINATE';
}
```

⛔ `FloatingLandLifecycle` stores **no second geometry**. Cap outline/area/radius, keel profile/depth
and altitude derive from the referenced `MassPartQ[].SolidPartQ` plus its single
`MAINTAINED_FREE_SPACE` support. Equality/ownership pins require exactly one cap, every keel id to
belong to the same body, and every referenced part to use `maintainedSupportId`; shadow, legality and
hashing read only the solids/support, never lifecycle summaries.

#### §7.1.4 · Light, shadow and the connection point

```ts
type SpatialSurfaceSubjectRef =
  | { kind: 'MASS_PART'; registryRef: ArtifactHashRef; bodyId: EntityId; partId: EntityId }
  | { kind: 'VEGETATION_TRUNK'; registryRef: ArtifactHashRef;
      bodyId: EntityId; partId: EntityId }
  | { kind: 'VEGETATION_CANOPY'; registryRef: ArtifactHashRef;
      bodyId: EntityId; canopyId: EntityId }
  | { kind: 'SUPPORT_SURFACE'; sourceSpatialRef: ArtifactHashRef; surfaceId: EntityId }
  | { kind: 'WATER_SURFACE'; sourceSpatialRef: ArtifactHashRef; surfaceId: EntityId }
  | { kind: 'VEGETATION_FIELD'; fieldKey: DerivationKey; fieldRef: ArtifactHashRef };

type SpatialAttenuationSubjectRef = {
  kind: 'ATTENUATION_VOLUME';
  volumeRef: ArtifactHashRef;
  owner:
    | Extract<SpatialSurfaceSubjectRef, { kind: 'MASS_PART' }>
    | Extract<SpatialSurfaceSubjectRef, { kind: 'VEGETATION_CANOPY' }>
    | Extract<SpatialSurfaceSubjectRef, { kind: 'VEGETATION_FIELD' }>;
};

type SpatialLightSubjectRef = SpatialSurfaceSubjectRef | SpatialAttenuationSubjectRef;

type SpatialSurfacePatchRef =
  | { kind: 'ENTITY_PATCH'; patchId: EntityId }
  | { kind: 'FIELD_PATCH'; fieldRef: ArtifactHashRef; fieldKey: DerivationKey;
      instanceIndex: number; patchOrdinal: number; derivationKey: DerivationKey };

interface ProjectedReceiverRef {
  viewSceneRef: ArtifactHashRef;
  fragmentId: FragmentId;
  sourcePatch: SpatialSurfacePatchRef;
  owner: SpatialSurfaceSubjectRef;
}

interface Vector2Q { x: WorldQ; y: WorldQ }
interface Vector3Q { x: WorldQ; y: WorldQ; z: HeightQ }
type LocalLightFalloffBandId = string & { readonly __localLightFalloffBandId: unique symbol };

interface ShadowCastBase {       // DERIVED artifact, per caster per receiver
  castId: ProjectionPrimitiveId;
  caster: SpatialLightSubjectRef; // exact part/trunk/canopy/field/attenuation provenance
  receiver: ProjectedReceiverRef;
  silhouette: PolygonQ;          // from the light-space hull — NOT the outline
  polygon: PolygonQ;             // clipped to the receiver
  lightProfileRef: ArtifactHashRef;
  mappingLawRef: ArtifactHashRef;
  lightId: EntityId;
}

type ShadowCast =
  | (ShadowCastBase & {
      sourceGeometry: 'GLOBAL_PARALLEL_DIRECTIONAL';
  directionIndex: AngleIndex;    // same global azimuth on every active leaf
  elevationIndex: AngleIndex;
  receiverVerticalSeparationQ: HeightQ;
  unclampedLengthQ: WorldQ;      // separation · cot(elevation), fixed-point/LUT
  appliedLengthQ: WorldQ;
  offsetVectorQ: Vector2Q;       // opposite global horizontal direction
  clamped: boolean;
  clampPolicyRef: ArtifactHashRef;
    })
  | (ShadowCastBase & {
      sourceGeometry: 'LOCAL_POINT_OR_AREA_APPROX';
      fixtureRef: ArtifactHashRef;
      activeStateRef: ArtifactHashRef;
      approximationLawId: LocalLightApproximationLawId;
      sourceToCasterVectorQ: Vector3Q;
      receiverRayVectorQ: Vector3Q;
      sourceDistanceQ: WorldQ;
      falloffBandId: LocalLightFalloffBandId;
      clamped: boolean;
      clampPolicyRef: ArtifactHashRef;
    });

// ShadeExposureReceipt is the closed §10.2 union branch derived from WorldSolarProfile,
// never from the plate's ProjectionLightProfile.

// For the GLOBAL_PARALLEL_DIRECTIONAL branch, every caster on every active leaf uses the same azimuth and
// elevation. Rays are parallel, have no distance falloff and never fan from the pointer. The exact
// fixed-point law is offsetVector = -horizontalDirection × receiverVerticalSeparation × cot(elevation),
// where cotangent and direction come from the coordinate-ABI LUT. Floating altitude is part of the
// receiver-relative separation, so equal silhouettes at greater altitude move farther. The applied
// length may differ from the unclamped length only through the exact readability/performance clamp
// policy and must disclose `clamped:true`; caster silhouette and receiver clipping remain canonical
// derivations. The local branch instead resolves the exact fixture position/state, source-to-caster
// and receiver ray vectors, distance/falloff band and registered point/area approximation law; it
// never fabricates directional cotangent fields. View occlusion never substitutes for either
// light-space calculation.

interface ConnectionPoint {      // §6.3 — ONE identity, TWO leaves
  connectionId: EntityId;
  schemaVersion: number;
  lawVersion: LawVersion;
  anchorXY: PointQ;              // ⭐ ONE position, shared by both leaves
  endpoints: readonly [
    { endpointId: EntityId; leaf: LeafIndex; hostId: EntityId;
      support: SupportSurfaceRef; heightAboveSupportQ: HeightQ },
    { endpointId: EntityId; leaf: LeafIndex; hostId: EntityId;
      support: SupportSurfaceRef; heightAboveSupportQ: HeightQ }
  ];
  kind: 'STAIR'|'SHAFT'|'CELLAR_DOOR'|'WELL'|'GRATE'|'ADIT'|'LADDER'
      | 'RAMP'|'CHAIN_HOIST'|'MOORING_MAST'|'TETHER_ANCHOR';
  clearHeight?: HeightQ;
  lensGate: 'PUBLIC' | 'DM';     // §168's covert discipline
  constructionEpoch: EpochId; removalEpoch?: EpochId;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}
```

`ProjectionLightProfile` has exactly one canonical declaration at §10.8; §7 consumes it and does
not redeclare it. `ConnectionPoint` above is the one durable aligned-connection type used by
`DimensionalScene`, modules and censuses. Its two endpoint leaves must be distinct. The identity key
uses the canonically sorted unordered leaf pair plus semantic slot, so reversing endpoint storage
cannot mint a second connection. A same-leaf link is never a `ConnectionPoint`; a `PortalLink` may
be same-leaf only when explicit canon supplies two distinct endpoint hosts/positions and its portal
law permits that topology.

#### §7.1.5 · Loss

```ts
type PositiveMeasureValueQ = number & { readonly __positiveMeasureValueQ: unique symbol };
interface PositiveVolumeQ {
  dimension: 'VOLUME';
  valueQ: PositiveMeasureValueQ;
  unitId: UnitId;                         // must resolve to a registered volume unit
}

interface LossRegionBase {
  lossId: EntityId;
  schemaVersion: number;
  lawVersion: LawVersion;
  outline: PolygonQ;
  leafIndex: LeafIndex;
  support: SupportSurfaceRef;
  causeEventId: EntityId;        // stable lineage only; never sufficient geometry authority
  causeOperationRef: ArtifactHashRef;
  footprintAuthorizationRef: ArtifactHashRef; // pre-existing constraint; cannot name after state
  effectiveAt: TimeKey;
  constructionEpoch: EpochId;
  removalEpoch?: EpochId;
  debrisBodyRefs: readonly { bodyId: EntityId; contentHash: ContentHash }[];
  recoveryOperationIds: readonly EntityId[]; // explicit dated reuse/rebuild actions
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type LossRegion =
  | (LossRegionBase & {
      kind: 'VOID';
      cadastreSurvives: true;
      excavatedVolume?: never;
      alteredSubstrate?: never;
      vacatedFabricRef: ArtifactHashRef;
    })
  | (LossRegionBase & {
      kind: 'CRATER';
      cadastreSurvives: false;
      excavatedVolume: PositiveVolumeQ;  // strictly positive, dimension-checked and conserved
      alteredSubstrate: { surface: GroundSurfaceRef; patchId: EntityId };
      vacatedFabricRef?: never;
    });
```

Every debris ref resolves to one body in the exact mass-body registry named by the containing
`CanonicalSpatialArtifact.massBodyRegistryRef`; recovery IDs
resolve inside its exact spatial-operations artifact and must occur after `effectiveAt` and before
removal where present. The pre-existing footprint authorization resolves the exact cause operation,
leaf/support and constraint footprint; it cannot contain an after-artifact ref, and `outline` equals
that licensed footprint. An external `DOMAIN_ACTION_RESULT` receipt later binds before state,
operation and completed after spatial artifact in the `ProvenanceReceiptIndex`; it is never a loss
region or after-artifact dependency. A VOID resolves the surviving/vacated fabric
artifact and alters no substrate. A CRATER resolves the exact modified substrate/excavation-surface
entry and patch in the root's `GroundSurfaceRegistry`; leaf/time/ABI/law match and the before→after
excavation geometry equals the operation footprint receipt. That altered patch enters scene,
receiver and occlusion geometry. Cause, lifecycle, provenance,
law/schema and all owned refs participate in the loss-region hash. `causeEventId` alone is never
treated as complete provenance.

---

### §7.2 · THE MODULE MAP

**New files, their single owner, and what each may import. ⛔ The derivation-graph walker enforces this — an undeclared edge reds.**

| module | owns | may import |
|---|---|---|
| `dimensional/leafRoster.js` | §6.7.13 — `leaves(settlement, year)` | epochAxis, waterWorks(strata), floatingLands |
| `dimensional/massing.js` | D3a — validate/compile explicit canonical `MassBody`/`MassPartQ`, functional volumes and quantized solids/heights; no demographic or historical defaults | solidKernel, supportSurfaces, materialAssembly, lineage |
| `dimensional/massingResolver.js` | D3b — apply scoped European function/structure-conditioned mechanisms and engineering ranges from a promoted `AMP-1` pack; no occurrence distribution | massing, canonicalBuildingProgram, canonicalCapacityOccupation, parcels, institutions, historicalMechanismRegistry, evidenceScopeBinding |
| `dimensional/roofCompiler.js` | D3a — pure compile of an explicit canonical/authored `RoofSpecification` against the owning `SolidPartQ`; footprint shape routes algorithms but never selects form | fabricGeometry, canonicalMassingInput |
| `dimensional/roofFormResolver.js` | D3b — derive a `RoofSpecification` only from an exact supported AMP mechanism/canonical cause; no footprint-only or occurrence default | canonicalBuildingProgram, historicalMechanismRegistry, evidenceScopeBinding |
| `dimensional/roofProjectionInk.js` | PROJECTION — derive ridge/hip/valley/eave ink only from stored owner-solid patch/edge topology | massing, viewOcclusionScene |
| `dimensional/materialAssembly.js` | §6.4.1/§7.1.2 — component-local base/frame/infill/cladding/floor/roof/repair facts and phase validation; no social inference | epochAxis, lineage, provenance |
| `dimensional/materialSystemResolver.js` | `AMP-1`-gated European function/resource/period/hazard/capital system; dormant without a promoted scope pack | materialAssembly, substrate(resources/terrain), historicalMechanismRegistry |
| `dimensional/volumeLaw.js` | §6.5 — `classifyVolumeRelationship`, the attachment vocabulary | fabricGeometry, groundLaw |
| `dimensional/vegetation.js` | §10.6 — materialise explicit persistent `VegetationMass` and deterministic bulk fields only from exact canonical vegetation aggregates; land-use-only state emits no SPATIAL field | substrate, canonicalVegetationAggregate, lineage, evidenceScopeBinding |
| `dimensional/projectionLightProfile.js` | §6.6/§10.8 — fixed cartographic sources and `cot ε` from the trig table | trigTable |
| `dimensional/spatialOcclusionIndex.js` | §10.7 — all active-leaf solid/attenuation query geometry; no camera, no paint | canonicalSpatialArtifact, leafRoster, volumeLaw, massing, vegetation |
| `dimensional/viewProjectionProfile.js` | §6.1/§10.7 — strict-plan orientation, scale and viewport | coordinateAbi |
| `dimensional/viewOcclusionScene.js` | §10.7 — project/split/clip/order one leaf's visible surface fragments | spatialOcclusionIndex, viewProjectionProfile |
| `dimensional/shadowCast.js` | §6.6 — silhouette → volume → visible receiver clip → `ShadowCast` | spatialOcclusionIndex, viewOcclusionScene, projectionLightProfile, volumeLaw |
| `dimensional/perLightIllumination.js` | §10.8 — preserve V_i and T_i, then add each source's direct contribution | spatialOcclusionIndex, viewOcclusionScene, shadowCast |
| `dimensional/hitRegions.js` | §10.7 — deterministic padded/aggregate hit geometry linked to every visible semantic primitive | addressableDrawList |
| `spatial/shadeExposure.js` | §6.7.4/§10.2 — time-indexed swept solar exposure receipt | canonicalSpatialArtifact, worldSolarProfile |
| `dimensional/connections.js` | §§6.3/10.9 — canonical `ConnectionPoint` + distinct `PortalLink` registries, lifecycle/privacy, and both-endpoint resolution | lineage, epochAxis, canonicalSpatialOperations, provenance |
| `dimensional/floatingLands.js` | §6.7 — validate/materialise a canonical ascension/maintenance lifecycle, form and position | magicGate, canonicalSpatialOperations, substrate, institutions, lineage |
| `dimensional/magicGate.js` | §6.7.1 — the world-law gate, and **the dormancy seam**; regex/name classification is diagnostic only | canonicalMagicState, canonicalCapacityOccupation, canonicalEconomicCapacity, canonicalSupply, canonicalAuthorityRelations, canonicalSpatialOperations |
| `dimensional/skyConservation.js` | §6.7.6 + §6.7.10 — souls/capital ledger over explicit transfers/operations | canonicalCapacityOccupation, parcels, institutions, canonicalSpatialOperations |
| `dimensional/lossRegion.js` | §6.7.12 — VOID vs CRATER, debris and explicit recovery operations | canonicalSpatialOperations, stateMarks, fabricGeometry |
| `dimensional/dimensionalCensus.js` | §7.7 — every census in one place | all of the above |

⛔⛔ **THE IMPORT DIRECTION IS ONE-WAY AND IT IS THE WHOLE POINT: `dimensional/**` MAY IMPORT FROM `fabric/**`; `fabric/**` MAY NEVER IMPORT FROM `dimensional/**`.** That single rule is what makes dormancy provable — with the gate unmet, nothing in `dimensional/` executes and the fabric cannot tell the difference. ⭐ *It is also what keeps the SCC walker green: a one-way boundary cannot create a cycle.*

⛔ **CROSS-DOMAIN GATE LAW.** D3b never imports the sandbox `habitation` or `tierGrammar` as a
historical cause: function, capacity and occupation are canonical inputs, and any rural-derived fact
requires either explicit canon or a `SUPPORTED` rural domain binding. Likewise `vegetation.js`
consumes only a `CanonicalVegetationAggregate` whose authority is explicit canon or an exact
`RSLP_SUPPORTED` source binding. `RuralLandscapePhase.landUse` alone is insufficient. If the
aggregate is absent/incomplete or its rural binding is unsupported, the module emits no SPATIAL
field (only a declared limitation/projection-neutral texture where allowed); it may not port the
sandbox `countryside` resolver through a dimensional seam.

**REUSE, NOT REINVENTION — three primitives already exist and must be used rather than re-spelled** (§3.3.9, *one predicate one home*):

```
capOutline        ⭐ fabricGeometry.organicBlob(cx, cy, R, rng, {rough})
                     — already a seeded 4-harmonic radial form on the
                       frozen trig table. Nothing new is needed.
keel profile      ⭐ THE SAME harmonic set, evaluated as a radial depth
                     curve, so cap and keel are ONE body by construction
all angles        ⭐ trigTable cosI/sinI + bearingIndex — ⛔ NEVER Math.cos,
                     never atan2, never radians in a stored field
cot ε             ⭐ derived from the table at profile construction and frozen
                     into ProjectionLightProfile — ⛔ never recomputed per shadow
```

---

### §7.3 · STAGE INTEGRATION — WHAT CHANGES IN S0…S23, EXACTLY

⭐⭐ **THE S0–S23 IDENTITIES ARE PUBLIC AND DO NOT RENUMBER.** Every receipt, law, test, hash fixture and architectural reference in this program keys on them. **§6 threads into existing stages; it does not insert new ones.** Where a stage gains an internal phase it is named `Sn.a` in prose only and is never a new stage id.

| stage | what §6 adds | status before | after |
|---|---|---|---|
| **S0** | `StrataExistencePlan` from already-held dated facts; identity/version/digest roots | — | ⛔ no final roster and no projection light at S0 (§10.3) |
| **S2** | terrain gains a **receiver surface** for shadow; relief already landed (§273) | PARTIAL | unchanged in derivation, extended in consumers |
| **S5** | `constructionEpoch`/`removalEpoch` flow onto every `MassPartQ` | BUILT | unchanged — parts inherit the epoch axis |
| **S10** | plot capacity feeds massing; `SPLIT`/`AMALGAMATION` carry the §6.7.10 cascade | PARTIAL | unchanged in derivation |
| **S11** | ⭐⭐ **THE LARGEST CHANGE. Footprints gain `MassPartQ[]`, quantized solids, roofs and explicit component-material slots.** D3a compiles supplied canon; no material or massing distribution is inferred, per §6.4/§6.4.1 | PARTIAL | **the dormant massing foundation's home; D3b owns evidence-gated derivation** |
| **S12** | backland may gain phase-owned parts; material differs only when an explicit construction/repair/reuse campaign says so (§6.4.1), never merely because the part is pressure infill | PARTIAL | the part/lineage join; material resolver remains `AMP-1`-gated |
| **S13** | ⭐ defences become composite: curtain run + parapet + wall-walk + tower + gatehouse, one `MassBody` | PARTIAL | ⭐ **tower shadow reach becomes free** — no styling rule |
| **S15** | extramural fabric may receive explicit dated displacement/occupation operations caused by a sky transition; the map never grows a ribbon merely because sky area changed | PARTIAL | **an operation destination, not an automatic sink** |
| **S16** | institutions gain composite massing and validate/project explicit dated leaf assignments, splits, relocations and regime facts (§6.7.11) | PARTIAL | ⛔ no function/status/authority resolver; missing assignment stays dormant |
| **S17** | water works gain vertical parts (wheelhouse, leat carriage) and shadow sensitivity | NOT BUILT | unchanged in priority |
| **S18** | ⭐ countryside may consume an earlier-tick `ShadeExposure` receipt; emits deterministic vegetation fields while notable/historical trees mint at the owning body stage | PARTIAL (weakest) | ⛔ never same-pass feedback (§10.2/§10.6/§10.8) |
| **S19** | ⭐⭐ vertical history: add/remove part, raise/replace roof, insert floor, and explicit dated loss/recovery/reuse/rebuild operations | PARTIAL | **the crater's event/history home; no automatic heal order** |
| **S20** | ⭐⭐⭐ **THE GROUND LAW BECOMES THE VOLUME LAW** (§6.5) | BUILT (2D) | ⛔ **must land before S11's massing** |
| **S21** | the §7.7 census roster joins the standing family | BUILT | + 20 censuses |
| **S22** | ⭐ consumes exact pre-existing observation, selected-leaf, `ViewProjectionProfile`, `ProjectionLightProfile` and audience-policy refs; emits final `LeafRoster`, one-leaf `DimensionalScene`, all-solid `SpatialOcclusionIndex`, `ViewOcclusionScene`, per-light casts/contributions, semantic DrawOps and hit regions | PARTIAL | **one leaf at a time** (§6.2/§10.3/§10.7–§10.8); profile artifacts belong to upstream manifest owners, never S22 |
| **S23** | the **light cartouche** (G-53); labels never darkened by world shadow | PARTIAL | + the rig's constants as truth |

⛔⛔ **THE ONE ORDERING THAT IS NOT NEGOTIABLE, RESTATED HERE BECAUSE IT IS THE EASIEST TO GET WRONG: S20's VOLUME LAW LANDS BEFORE S11's MASSING.** Build massing first and every legal vertical case — the gatehouse over the road, the bridge, the gallery under the cathedral — arrives as a census violation, and the cure will be an exemption list. **That is the G-34 disease, and this program has already paid for it twice.**

---

### §7.4 · THE IDENTITY AND KEY SPACES — `lineage.js` EXTENDED

**`lineage.js` today owns four key spaces (institution, district, parcel, road) under one law: ⭐ IDENTITY IS NOT ADDRESS — `institutionKey` takes no position argument and cannot be given one. §6 adds four more under the same law.**

```
partKey(bodyKey, role, birthEvent)
      ⭐ a part's identity is its ROLE and its BIRTH, never its footprint.
        A rebuilt west range is the same part; a NEW west range is not.

connectionKey(min(leafA, leafB), max(leafA, leafB), semanticSlot)
      ⛔⛔ THE HARDEST CASE IN THE WHOLE KEY SYSTEM: a connection point has
         TWO addresses and ONE identity. The key is derived from what it
         JOINS, never from where it sits — so a stair keeps its identity
         when the chamber below it is re-cut.

landKey(settlement, ascensionEvent, ordinal)
      ⭐ a floating land's identity is its ASCENSION, not its position or
        its size. It keeps its identity while it grows, shrinks and drifts
        through every budget it ever had.

lossKey(causeEventId)
      ⭐ a crater's identity IS the event that made it. Two disasters in one
        place are two losses, and the map can say so.
```

⚠⚠ **THE FAILURE THIS FORECLOSES, AND IT IS WORTH ONE SENTENCE BECAUSE IT WOULD BE INVISIBLE FOR MONTHS:** if a connection point's key encoded its coordinates, then re-cutting an undercity chamber would sever every stair into it, the surface leaf would keep the old mouth, and the census would read **two orphans instead of one move.** ⭐ *The existing law already prevents this — it just has to be applied to a shape that has two addresses.*

---

### §7.5 · THE RANDOM NAMESPACE REGISTRY

**Every draw in §6, named. ⛔ CI reds on an unregistered namespace, and the existing key-anchored law binds unchanged: `fabricRng(seed, entityKey, {variant, changeYear})`, never a stream, never a call-order dependence.**

```
land.capHarmonic             land.keelHarmonic         land.keelDepth
loss.debrisScatter
connection.slot
```

⭐⭐ **AND THE ONE THAT MUST **NOT** EXIST, STATED AS A REFUSAL SO NOBODY ADDS IT LATER: THERE IS NO `projection.*` OR `light.*` NAMESPACE.** The rig is deterministic and unseeded; a shadow is *computed*, never *drawn from*. ⛔ **A render-side draw that could reroll a world fact is the exact failure the WORLD/PROJECTION split exists to prevent** — and the cheapest guarantee is that the namespace simply does not exist.

⛔ **There is no material-identity residual stream.** Component identity, chronology, repair and
replacement are explicit canonical facts; a keyed paint texture may vary their projection without
changing those facts, but AMP range support cannot supply a material draw or social proxy.

⛔ **There is no live `massing.*` or geometry-bearing `roof.*` random namespace.** D3a compiles
explicit canonical values. AMP may promote scoped conditional engineering envelopes and coherence
predicates, but it cannot identify part counts, morphology/roof-form occurrence, storey/pitch
distributions or a random law within a legal range. D3b therefore cannot wake an occurrence selector
merely because AMP passes. A future resolver needs either an explicit canonical world cause/decision
law that determines the value or a separately registered probability protocol for a genuinely
stochastic choice; that future law registers its own versioned namespace. `FunctionalProgram` is
always a canonical fact. Ridge/path waver is a painted projection operation keyed to the visible
primitive; it is not stored roof geometry and there is no `roof.ridgeJitter` WORLD namespace.
Floating-land cap/keel and debris namespaces execute only inside an explicit canonical operation
that cites the exact registered fantasy-world form/recovery law; placement and altitude are supplied
operation facts, so no `land.placementResidual` or `land.altitudeResidual` exists.

---

### §7.6 · THE DERIVATION EDGES — hard, and stated as §4.3 states them

```
VOLUME LAW (G-48) ──BLOCKS──▶ ALL MASSING (G-49)
    ⛔ WHY: without it every legal span is a violation and the cure is an
       exemption list. This is the G-34 class, pre-empted.

OFFSET KERNEL ──BLOCKS──▶ EVERYTHING IN §6
    ⛔ WHY: 5 of 10 walled leaves ship a self-crossing ring (§274.3). A ring
       that crosses itself DOES NOT BOUND A SOLID — extrude it and there is
       no inside; light it and the silhouette is undefined.
    ⭐ It rides ALONE (the §278 shift ruling), before W3's content.

PROJECTION INSTRUMENT (G-51P) ──PRECEDES──▶ any GRADED roof-ink/tone verdict
AMP-1 WORLD INSTRUMENT (G-51W) ──PRECEDES──▶ D3b and any historical massing band
    ⚠ Plan pixels can grade legibility, never height/storeys/pitch/material.
      AMP-1 may support scoped conditional engineering ranges after its gates;
      occurrence distributions remain `NOT_IDENTIFIED`/`NONE` until a separate
      probability-sampling protocol. G-52 is settled with G-51P, not by AMP-1.

MATERIAL ASSEMBLY SCHEMA ──PRECEDES──▶ MASSING (G-49)
    ⭐ Component/phase slots and validators are evidence-invariant and land
      with D3a. The empirical MATERIAL SYSTEM RESOLVER (former G-63) is no
      longer bound to massing: it is D3b, blocked on AMP-1 and owns its own
      later declared shift. This separation lets canonical roofs exist
      without smuggling in a prosperity/material theory.

CONNECTION KEYS (G-54) ──MUST PRECEDE──▶ any second leaf
    ⚠ STRUCTURAL, not sequential — retrofitting identity onto two objects
      that "line up" is the expensive path. Mint the key space with the strata.

LEAF ROSTER (G-61) ──PRECEDES──▶ the sky leaf and the undercity leaf
CONSERVATION LEDGER (G-55) ══BOUND TO══ THE SKY LEAF
    ⛔ WITH it, never after — a sky that mints a second settlement's souls
      would look like a real feature for a long time.
DISPLACEMENT (G-58) ══BOUND TO══ CONSERVATION (G-55)
    ⚠ and the ledger MUST span intramural + extramural or it reads a
      displacement past the wall as a leak.
SHADE EXPOSURE (G-62) ──OBSERVES──▶ optional earlier-tick domain input
    ⛔ no same-pass edge to countryside, prosperity or siting
LOSS REGION (G-60) ──NEEDS──▶ the offset kernel (rims are offsets)
                   ──MATERIALISES──▶ explicit typed loss/recovery operations only
```

---

### §7.7 · THE CENSUS ROSTER — consolidated

**Twenty census definitions. ⛔ Each states what it reads and what it catches, but execution follows
the producer DAG rather than pretending downstream bytes exist at S21. ⚠ Every one is written
volume-true or area-true as its subject demands — never vertex-sampled (§274.4b's class at higher
dimension).**

| # | census | reads | catches |
|---|---|---|---|
| 1 | volume legality | 0 illegal intersections | the §6.5 family |
| 2 | attachment non-vacuity | withdraw a kind ⇒ **REDS** | an exemption list wearing a law's clothes |
| 3 | span clearance | every `SPANS_BELOW` resolves its exact upper part, route/water/lower-mass authority and quantized clearance-profile artifact and meets `clearHeight` | a gatehouse that blocks its road or bridge that checks the wrong lower surface |
| 4 | summary-height vacuity | no predicate reads `summaryHeight`; cache equals `maxZ(parts[].solid.closedShell)` | a scalar height becoming truth |
| 5 | roof/solid authority | nested roof IDs unique; owner/epoch/material refs resolve; patch refs resolve; edge refs completely/equally classify shell-patch topology; `kind` classifier matches; 0 closure/equality mismatches | an orphan/side-table roof, duplicate ownership, exploded roof or ink/solid disagreement |
| 6 | ridge/hip presence | ATLAS Table B row flips MISSES → MEETS | ⭐ **the row this section exists to cure** |
| 7 | self-intersection | 0 rings, 0 caps, 0 keels | §274.3, ordered and still open |
| 8 | shadow provenance | every cast names caster + light + receiver | a painted shadow with no body |
| 9 | shadow silhouette | cast derives from the hull, ≠ the plan outline | "copy the footprint and offset it" |
| 10 | no double-darkening | one shadow twice ⇒ same value; B on ⇒ never darker | sequential black overlays |
| 11 | profile invariance | rig change ⇒ **WORLD hash unchanged** | the renderer manufacturing world facts |
| 12 | component material completeness | every material names its component, phase/state and provenance; scalar `mixed` = 0 | structural zoning or repair collapsed into a social colour token |
| 13 | evidence-scope dormancy | 0 regional/material mappings execute without a promoted `AMP-1` scope pack | a synthetic or Wave-1 case becoming a hidden European prior |
| 14 | chronology separation | roof, facade, floor, frame and rear range may carry independent campaigns | one visible date silently dating the whole body |
| 15 | phase ≠ repair ≠ reuse | every difference is typed; no appearance-only cause inference | conflating age, damage, adaptation and decline |
| 16 | status non-inference | 0 household/institutional status facts inferred from height or material under test | a tall hall or durable survivor manufacturing prosperity |
| 17 | connection/portal resolution | endpoint IDs unique; host/support/height and lifecycle resolve; aligned connections have two distinct active leaves, share one XY and use one canonical unordered-pair key; reverse order cannot duplicate; same-leaf portals require explicit legal topology; provenance/lens gate present; 0 orphans | a stair to nowhere, duplicate reverse-key link, wrong-altitude endpoint, leaked DM link or one-ended portal |
| 18 | leaf roster | only `-2|-1|0|1`; substrate kind exactly matches the leaf; roster matches each year's contents; 0 mismatches | an invented leaf, sky terrain or a sky tab with no lands |
| 19 | conservation ledger | 0 net souls, 0 net capital, **intramural + extramural** | a sky minting a settlement |
| 20 | wall did not move | circuit byte-identical across sky change | re-sizing instead of re-sorting |

Rows 1–7, 12–16 and 19–20 run in world/solid validation nodes no later than S21 once their exact
inputs exist. Shadow/profile rows 8–11 run only in post-S22 illumination validation; connection and
final-roster rows 17–18 run after S22 emits the roster/index/view artifacts. S23 has its own
post-chrome equality/privacy node. The executable manifest owns every schedule edge and input; no
validator imports or reads a downstream stage. Product release joins these completed receipts after
S23 rather than moving their computation backward in time.

⭐ **Plus the sky-specific rows already in §6.7.9** (dormancy · activation provenance · sky morphology ·
shade-exposure provenance · high-water in the sky · altitude inertia · debris conservation · explicit
loss/recovery chronology), which are listed there rather than duplicated here — **one row, one home** (§3.3.9).

---

### §7.8 · THE WAVE SHEET — D0…D6

**⚠ These are DIMENSIONAL waves and they interleave with W3…W8 rather than replacing them. §6.9 argues the sequencing; this states the exit criteria in the base's own format.**

| wave | contents | EXIT CRITERIA (measurements) |
|---|---|---|
| **D0** · the kernel | real polygon offset; `properCross` ONE home; self-intersection census | self-intersection **11 → 0** · four drawn censuses **0** area-true · determinism 10/10 · **only the 5 broken leaves move, proved leaf-by-leaf** · no ceiling raised |
| **D1** · the volume law | S20 → `classifyVolumeRelationship`; the attachment vocabulary; `clearHeight`/`separation` | 0 illegal intersections on every leaf · **every attachment kind proved non-vacuous by counterfactual** · gatehouse/bridge/gallery fixtures pass · house-in-road still convicts |
| **D2** · projection instrument | G-51P; G-52 settled; the light cartouche | visual bands published only for roof-plane ink, ridge/hip density and per-face tone separation · `SHADOW_DIR`'s grade resolved or withdrawn · no world-height claim |
| **D3a** · dormant massing foundation | S11/S12/S13/S16 composite `MassPartQ[]`; functional volumes; explicit-input analytic roof compiler; component/phase material slots and typed alteration operations; no live empirical resolver | supplied canonical fixtures close, quantize and round-trip · roof/part ownership closes · hall/attic/storey fixtures remain distinct · component/chronology censuses 12–16 pass · live seeds remain byte-identical because no `AMP-1` prior executes · ⚠ explicit-fixture browser cost priced in the receipt (§220) |
| **D3b** · evidence-gated massing/material activation | scoped European function/structure-conditioned mechanisms and engineering ranges promoted only after `AMP-1` development, reliability and sealed-holdout gates; no occurrence distribution/activation weight | preregistered conditional-range/coherence thresholds pass · holdout result reported without retuning · scope/counterexamples/version/declared shift named · exact massing evidence binding matches · generated ATLAS ridge/hip row and visual bands pass without violating structural holdout · otherwise `UNCALIBRATED` or `HOLDOUT_FAILED`, not a guessed default |
| **D4** · light + shadow | rig; silhouette→volume→receiver; per-face tone; depth sort | the six adversarial fixtures pass · profile switch leaves WORLD hash unchanged · ground→wall-top→roof seam within tolerance · labels unaffected by world shadow |
| **D5** · strata | leaf roster; connection points; undercity leaf gains 2.5D | 0 orphan connections · roster matches contents at every year · **single-leaf law proved by source scan** · empty strata never render |
| **D6** · the sky | floating lands; conservation; explicit transfers; optional shade-exposure observation; loss regions | conservation ledger **0/0** · wall changes only under dated circuit operation · every land has an explicit canonical cause and no occurrence/count prior · sky fabric meets supported ground morphology law · shade receipt has licensed profile or is skipped · zero same-pass consumers · debris conserved · dormancy byte-identical |

⛔ **D6 IS PARKED UNTIL D0–D5 ARE GREEN AND W3's FABRIC WORK HAS LANDED.** §6.9 states why and it is the honest constraint: **S9 frontage is still NOT BUILT and is the #1 ranked gap in both studies.**

---

### §7.9 · DORMANCY AND MIGRATION — how absence is proved

⭐⭐ **THE DORMANCY LAW IS NOT A FEATURE FLAG; IT IS A HASH CLAIM, AND IT IS PROVED THREE WAYS:**

```
1  THE IMPORT BOUNDARY   fabric/** never imports dimensional/**
                         ⭐ a source scan, and it is the strongest of the
                           three because it is structural rather than
                           behavioural
2  THE HASH PIN          gate unmet ⇒ WORLD hash byte-identical to the
                         pre-§6 tip, on every exemplar
3  THE CENSUS SILENCE    gate unmet ⇒ the §7.7 roster does not run, and
                         reports that it did not run rather than
                         reporting zeros
```

⚠⚠ **THE THIRD IS THE ONE THAT WILL BE GOT WRONG.** A census that reports **0 violations** because it never executed is indistinguishable at the summary from one that executed and found none. ⛔ **"Skipped" and "clean" must never render the same** — this program has already banked that lesson (*"skipped due to environment can never read green"*).

**MIGRATION.** Every §6 field is additive and absent on pre-§6 stored artifacts, but absence must
not make an old map disappear. A pre-§6 settlement keeps its stored bytes/hash and reads through
the version-selected `PLANAR_V1` compatibility renderer (or an ephemeral `LEGACY_ADAPTER` part
excluded from the stored hash) under §10.11. Persisting dimensional truth requires an explicit,
receipted upgrade. ⭐ *That is what makes D0–D6 landable one wave at a time without falsifying old
maps or turning them blank.*

---

### §7.10 · PERFORMANCE INSTRUMENTATION

⚠⚠ **§220's APP-REALISTIC GATE IS OPEN — *"NOT ACHIEVABLE AT CURRENT GRAIN, BUT ACHIEVABLE"* — AND §6 MAKES IT HARDER. EVERY DIMENSIONAL WAVE PRICES ITS OWN COST IN ITS OWN RECEIPT.**

```
PER WAVE, REPORTED BOTH ALL-LEAF AND DISTINCT-SITE (§0.3b):
    primitives per leaf per lens        against the §217 ceiling
    buildFabric wall-ms                 cold and warm
    massing ms · roof ms · shadow ms    the three new hot paths
    first paint · pan/zoom p50/p95      in the real browser
    PDF projection ms                   ⚠ the folio cannot enter today's path

⭐ THE SINGLE-LEAF RELIEF, MEASURED NOT ASSUMED:
    a leaf not on screen costs ZERO to draw — but the world is whole
    even when the plate is not, so GENERATION and RENDER budgets
    DIVERGE here for the first time and must be reported apart.

⭐ THE §267.5(b) PREREQUISITE, ALREADY RULED FOR ANOTHER REASON:
    the fabric emits an ADDRESSABLE DRAW LIST, not an opaque SVG string.
    A draw list carrying per-element z, leaf and body identity is exactly
    what depth-sorted 2.5D needs. Build it once; it serves both.
```

⛔ **A CEILING RAISE IS OWNER-GATED UNDER §217 AND IS MEASURED FIRST — efficiency before capacity, the old figure and the new one both published, and re-pinned so it cannot drift.** ⚠ *An estimated 3–5× multiplier for massing is **PLAUSIBLE and unmeasured**; D3a's receipt replaces it with a number or the wave is not done.*

---

### §7.11 · WHAT IS EXPLICITLY NOT BUILT — the refusals, consolidated

**Recorded here so no later lane re-finds them as opportunities (§246.2's rule).**

| refused | why |
|---|---|
| oblique/tilted camera · facades · elevation vignettes | §153's era law as amended; ATLAS banned prior #5 |
| CSS/SVG blur/drop-shadow · screen-space AO · cinematic whole-frame bloom | renderer/screen effects are not semantic projection truth; §288 permits only finite renderer-neutral effect geometry/tone bands |
| microfacet/photoreal glare or invented material sheen | the atlas corpus supplies no optical coefficients; closed registered material response is separately permitted by §10.8 |
| ray/path-traced GI · participating media · volumetric marching | heavyweight transport is refused; §288 permits bounded analytic ambient/reflection/contact/environment terms with exact authority |
| GPU-authoritative geometry · WebGPU in the truth path | THE PROMISE — float variance breaks same-seed identity |
| a scalar `Building.height` as truth | §6.4 — parts are the authority |
| a straight skeleton as the default roof solver | analytic grammar first; skeleton for the irregular significant footprint only |
| a universal material or `rich ⇒ stone` | ⛔ **§6.4.1 / AMP-1** — material is component-, function-, resource-, period- and repair-local; no prosperity mapping executes without a promoted European cohort |
| a prosperity heatmap as canonical | derived visualisation only |
| a global optimiser for parcel allocation | ⛔ an invalidation barrier; the inertia law is the program's hardest-won property |
| ordinary-pointer or unregistered animated light | normal presentation uses a registered fixed-survey global source; explicit probe/pinned/world-time modes use §10.8 profiles and never mutate WORLD |
| compositing two leaves | §6.2 — and the contract has nowhere to put a second leaf |
| a `projection.*` random namespace | §7.5 — a render draw must be **incapable** of rerolling a world fact |
| street names | ⛔ §163, owner-refused. Not re-proposed, and a later lane that "discovers" them is re-finding a closed decision |

---


---

## ⟦FOLD §282⟧ §8 · THE AUTHORSHIP LAYER — EDITING WITHOUT LOSING THE TRUTH

### ⟦FOLD §282⟧ ARCHITECTED 2026-08-19 ON THE OWNER'S QUESTION. DESIGN ONLY — ⛔ NOTHING IMPLEMENTED.
### **The owner asks: the default must be true to the dossier — but may a user switch that off, author freely (a Whiterun), and still have a full map editor? And may the AI Surveyor drive it?** ⭐ **The answer is yes to all three, and the architecture that makes it safe is a LEDGER rather than a MODE SWITCH.**

### §8.0 · ⭐⭐⭐ THE GOVERNING RULING — DIVERGENCE IS MEASURED, NOT TOGGLED

> ⛔ **THERE IS NO "TRUE TO THE DOSSIER" SWITCH, BECAUSE A SWITCH IS THE WRONG SHAPE.**
> ⭐⭐⭐ **EVERY OBJECT ON THE MAP CARRIES ITS OWN PROVENANCE, AND THE SETTLEMENT PUBLISHES THE AGGREGATE. A "WHITERUN" IS SIMPLY A SETTLEMENT AT 100% AUTHORED — THE ENGINE DOES NOT REFUSE IT; IT CORRECTLY REPORTS THAT IT IS NOT EXPLAINING ANYTHING.**

⭐⭐ **WHY A LEDGER BEATS A MODE, AND IT IS NOT A COMPROMISE — IT IS STRICTLY MORE HONEST AND STRICTLY MORE FREE.** A mode switch forces a binary the product cannot honour: *derived* maps become unfree, and *authored* maps become unexplainable in one step, with no way back. **A per-object provenance ladder gives total freedom AND keeps the engine's claim exactly as large as it deserves to be** — the thesis was never *"every map is derived"*, it is ***"everything the engine derived, it can explain."*** Authoring does not falsify that. It reduces its scope, visibly.

```
THE PROVENANCE LADDER — one rung per object, on every leaf

  DERIVED     the generator made it from a dossier fact        ⭐ default
  REROLLED    the user chose another variant — still derived
  NUDGED      moved/resized WITHIN legality; the dossier fact
              it serves is unchanged
  DESIGNATED  the user changed WHAT IT IS (use, wealth, kind)
              ⚠ a dossier-shaped fact — see §8.2 Class C
  AUTHORED    the user created or overrode it
              ⛔ NO dossier fact backs it
  IMPORTED    from a template or another settlement
```

⭐ **THE SETTLEMENT THEN PUBLISHES ITS OWN HONESTY, and this is a shipping feature, not a debug view:**

```
   847 bodies · 91% derived · 5% nudged · 3% authored · 1% imported
   ⭐ CAUSAL COVERAGE 96%  — the share of the map the engine can explain
```

⭐⭐ **AND THE INSTRUMENT ALREADY EXISTS. G-43's counterfactual benchmark measures whether the map answers to the dossier; the SAME machinery measures how far an authored map has drifted from what the dossier would produce.** *A capability nobody else can offer, because nobody else has a derivation to diverge from.*

---

### §8.1 · ⛔ THE ONE HARD BOUNDARY — PORTRAIT VERSUS CANON MEMBER

**Freedom is total at rest. It is NOT total under a running clock, and this is the only place a real line must be drawn.**

| | **PORTRAIT** | **CANON MEMBER** |
|---|---|---|
| what it is | a settlement authored to be looked at | a settlement participating in the simulation |
| authoring | ⭐ **unlimited.** Whiterun, a memory, a module map | ⭐ unlimited, **but it owes reconciliation** |
| the clock | ⛔ does not advance it | advances it |
| when the world-pulse contradicts an authored object | n/a | ⭐⭐ **a TYPED CONFLICT, never a silent choice** |
| exports, lenses, PDF, gallery | identical | identical |

⭐⭐ **THE TYPED CONFLICT IS ALREADY THIS PROGRAM'S OWN LAW AND IT ONLY HAS TO BE HONOURED HERE.** The map-suite constitution states it: *"When the simulation advances and a building the user manually preserved would canonically be destroyed, the system should not silently choose. It should produce a typed conflict."*

```
{ "type": "AUTHORED_CANONICAL_CONFLICT",
  "entity": "sf:building:dragonsreach",
  "authoredIntent": "PRESERVE",
  "canonicalEvent": "FIRE_DESTROYED",
  "year": 143,
  "resolutions": ["KEEP_AUTHORED", "ACCEPT_CANONICAL", "DEMOTE_TO_PORTRAIT"] }
```

⭐ **`DEMOTE_TO_PORTRAIT` IS THE CLEAN ESCAPE AND IT SHOULD BE OFFERED PLAINLY:** *"this settlement is now a picture, not a participant."* ⛔ **What must never happen is the third thing — a canon member whose geometry the simulation quietly stops being able to reason about.** *That is how a simulator becomes a liar.*

---

### §8.2 · THE FIVE EDIT CLASSES — sorted by what they actually cost

⚠⚠ **THE OWNER'S LIST IS NOT ONE KIND OF EDIT. Colour, "make this quarter poor", "move this street" and "cut a crater" are four different architectural animals, and building them as one editor is how the surface becomes unshippable.**

| class | verbs | cost | law it must obey |
|---|---|---|---|
| **A · PRESENTATION** | lens, palette, labels, annotations, season pin, legend prefs; legacy pins/scene overrides remain V1 presentation only | ⭐ free; main app has 3 keys, sandbox has 9 | replayed, dormancy-proven, **never silently promoted to canonical geometry** (§10.12) |
| **B · SELECTION** | reroll this footprint · pick another legal roof form · another plot subdivision · another annex arrangement | ⭐⭐ **cheap, and it is where most user desire actually lives** | ⭐ **the engine already ENUMERATES the legal candidates — the user picks from them, so illegal output is unreachable** |
| **C · DESIGNATION** | this quarter is poor · this building is the temple · this street is the market · this block is a district | medium | ⚠⚠ **these are DOSSIER-shaped facts, not geometry — see below** |
| **D · GEOMETRY** | add/remove a building · move a street · change a footprint · re-cut a block | ⛔ expensive | ⭐⭐ **must run the SAME laws the generator runs** |
| **E · WORLD EVENTS** | a crater · a floating city · a fire · a wall built | ⛔ expensive | ⭐⭐⭐ **not map edits at all — see §8.4** |

#### ⭐⭐ CLASS C — A DESIGNATION IS A DOSSIER EDIT WEARING A MAP EDIT'S CLOTHES

**"Make this quarter poor" is not a drawing instruction. It is a claim about the world.** If it lives only on the map, the dossier and the map now disagree about a fact **the dossier owns** — and every surface that reads the dossier (the PDF, the AI, the gallery, the simulation) is silently wrong.

> ⭐ **THE RULING: A DESIGNATION WRITES BACK.** It edits the dossier fact and the map re-derives only through promoted, versioned mechanisms. **The user gets one coherent world fact, not an untracked recolour or a bundle of guessed consequences.**
> ⭐⭐ **PROPAGATION IS EVIDENCE-BOUNDED:** designating a quarter's current condition/prosperity may change already-owned occupancy, maintenance and active-use facts. It does **not** rewrite inherited streets, tighten grain, subdivide frontage, add pressure sheds or manufacture material patchwork merely because those would look poor. Each morphology/material effect needs its own dated operation and promoted law; `AMP-1`/`RSLP-1` mechanisms stay dormant until their gates pass.
> ⛔ Where a designation genuinely cannot be expressed as a dossier fact, it degrades to **AUTHORED** and the ledger records that the map now asserts something the world does not.

#### ⛔⛔ CLASS D — THE EDITOR RUNS THE GENERATOR'S OWN LAWS. NO EXCEPTIONS.

> **A HAND-PLACED BUILDING STANDING IN THE CARRIAGEWAY IS REFUSED EXACTLY AS A GENERATED ONE IS.**

⚠ **If authored geometry is exempt from the ground law, the volume law, frontage and access, then the map has two classes of object with two standards — and every census in the program becomes meaningless, because "0 violations" would only ever have meant "0 violations among the things we checked."** ⭐ *The laws are what make the drawing good. Exempting the user from them does not give them freedom; it gives them a worse map.*

**THE EDITOR'S CONTRACT:**

```
propose edit → run the SAME predicates (ground · volume · frontage · access)
   LEGAL     → apply, mark provenance, record the inverse for undo
   ILLEGAL   → ⭐ REFUSE WITH THE REASON, and offer the nearest legal
               alternative ("this overlaps the kerb line — shift 1.4 m
               back and it fits")
   ⛔ OVERRIDE → permitted, and it marks the object AUTHORED **and**
                 LAW-EXEMPT, which the census reports separately
                 and forever
```

⭐ **The override exists, and it is honest rather than hidden.** *A user who insists gets what they asked for; the plate carries no lie about it.*

---

### §8.3 · WHAT THE EDITOR SHOULD *BE* — the sharpest opinion in this section

> ⭐⭐⭐ **THE BEST EDITOR FOR THIS PRODUCT EDITS CAUSES, NOT PIXELS. DIRECT GEOMETRY EDITING IS THE ESCAPE HATCH, NEVER THE MAIN ROAD.**

⛔⛔ **THE STRATEGIC TRAP, NAMED SO IT IS NOT WALKED INTO: A FULL FREE-FORM DRAWING TOOL MAKES THIS A WORSE INKARNATE.** Inkarnate and Wonderdraft own hand-drawing; they are mature, they are cheap, and competing there means competing on their strength with none of ours. **Our differentiator is DERIVATION.** The editor should therefore be a **derivation editor** — and the verbs should read like world facts, not drawing tools:

```
⭐ THE VERBS WE SHOULD OWN                ⛔ THE VERBS WE SHOULD NOT CHASE
   "this quarter is poor"                    freehand polygon drawing
   "the market moved here in 1470"           per-vertex nudging as the primary UX
   "a fire took the north ward"              a brush, a fill bucket, a layer stack
   "found an abbey on this hill"             arbitrary sprite placement
   "the wall was built a century later"      pixel painting
   "raise this district"                     ⚠ these are Inkarnate's, and they are
   "cut this crater"                           better at them than we will be
```

⭐ *Every verb on the left produces a cascade the user could not have drawn by hand and would not have thought of — the dead ends, the grain, the patched materials, the fossil wall. That is the product.*

---

### §8.4 · ⭐⭐ CLASS E — WORLD EVENTS ARE AUTHORED AS CAUSES, NOT AS SHAPES

**A crater and a floating island are the two the owner named, and they are the clearest case for the whole §8.3 argument.**

```
⛔ THE WEAK UX          "draw a crater here"
                       → the user draws a circle. It has no cause, no
                         debris, no bearing, no history.
                         It is a hole in a picture.

⭐⭐ THE STRONG UX       "a disaster struck here, in 1462, of this kind"
                       → §6.7.12 does the rest: VOID or CRATER derived
                         from the cause · the location from the attack
                         bearing or the impact point · the debris fan
                         on the far side · spoil · robbed stone · the
                         dated loss state. Recovery/reuse/rebuilding
                         occurs only when later explicit world operations
                         say so; otherwise the seam remains
                       ⭐ LESS WORK FOR THE USER, AND ENORMOUSLY MORE MAP.
```

**Identically for the sky:** *"this city raised its arcane quarter in 1488"* proposes a typed world
operation. If accepted, its explicit authority/work relation, registered form/support law, supplied
geometry/budget/altitude, transfers and conservation receipt become canon; projection then derives
the shadow. The map does not optimize placement against shade, infer a social displacement cascade,
or offer an “AUTHORED anyway” bypass around missing authority. It reports the missing canonical
facts and lets the user propose lawful world changes through the domain-operation door.

---

### §8.5 · THE AI SURVEYOR'S CONTRACT

⛔⛔ **THE STANDING LAW IS UNCHANGED AND IS NOT NEGOTIABLE HERE: THE AI IS A CLERK, NEVER A WRITER. IT CLASSIFIES INTO OUR DETERMINISM, IS VALIDATED ON ARRIVAL, AND IS REJECTED OUT-OF-VOCABULARY — NEVER GEOMETRY, NEVER FREE TEXT.** ⭐ AI-emitted coordinates would break same-seed identity, THE PROMISE, and every census at once.

> ⭐⭐ **BUT THE LAW PERMITS FAR MORE THAN IT FIRST APPEARS, AND THIS IS THE UNLOCK: THE AI MAY NOT EMIT GEOMETRY — IT MAY EMIT *EDIT COMMANDS* FROM THE TYPED VOCABULARY.**

```
user:  "make the north quarter poorer and put a temple near the market"
         ↓
AI emits a COMMAND SEQUENCE, every argument from a closed vocabulary:
   { SET_CURRENT_DISTRICT_CONDITION, district: "north~2", band: "poor" }
   { PLACE_INSTITUTION,  kind: "temple",
     anchorSlot: "market.frontage.NE"   ← ⭐ chosen from the ENUMERATED
                                           legal anchors the engine offered }
         ↓
each validated on arrival · out-of-vocabulary REJECTED · each reversible
         ↓
⭐ THE ENGINE PLACES THE GEOMETRY. The AI never touched a coordinate.
```

⭐ **AND THE SURVEYOR SHOULD READ THE DIVERGENCE LEDGER AND BE HONEST ABOUT ITS OWN LIMITS:**

> *"I can tell you why the market is where it is, why the west gate carries the most traffic, and why the tanners are downstream. **The three buildings on the north ridge you placed yourself — I have no reason for them.**"*

⭐⭐ *An assistant that knows the boundary of its own knowledge is worth more than one that confabulates past it — and the divergence ledger is what lets it know.*

---

### ⟦FOLD §283⟧ §8.7 · THE INSTITUTION DISPOSITION LADDER — in the dossier, not on the map

> **THE QUESTION: may an institution exist in the dossier and not appear on the map? ⭐ YES — AND IT IS NOT AN EXCEPTION, IT IS FIVE DIFFERENT WORLD FACTS THAT THE CURRENT TOTALITY LAW COLLAPSES INTO ONE.**

⚠ **THE STANDING LAW TODAY IS TOTALITY:** *"no custom institution ever renders unshaped or unplaced; the silhouette walker proves the ladder resolves for every custom, or REDS."* ⭐ **That law is right about what it was defending — a silent omission — and wrong to assume the only lawful state is EMBODIED.**

```
⭐⭐ THE DISPOSITION LADDER — every institution carries exactly one rung,
   and the rung is DERIVED, not authored, except where marked

  EMBODIED    it has a building on this leaf              ⭐ the default
  FRONTED     ⛔ it renders AS ITS COVER — §168's UNIVERSAL FRONT.
              It IS on the map, wearing a mask. NOT absent.
  UNSITED     it holds a charter, a jurisdiction, a right or a property
              interest HERE, and its seat is ELSEWHERE
              ⭐ historically the commonest case of all — the religious
                house holding urban property, the guild with jurisdiction,
                the absentee lord, the order with a chapter and no house
  AGGREGATED  it is the fabric — 40 bakers are not 40 landmarks
              (the existing multiplicity class, unchanged)
  SUPPRESSED  ⚠ the AUTHOR chose to omit it. The ONLY authored rung,
              and the ledger records it as such
```

> ⭐⭐⭐ **THE TOTALITY LAW IS NOT REPEALED — IT IS SHARPENED. It changes from *"every institution renders"* to *"every institution carries a STATED DISPOSITION, and ZERO are silently missing."* That is a strictly stronger census, because today an institution that fails to place is indistinguishable from one that was never meant to.**

⭐ **AND THE DOSSIER STAYS TRUE, WHICH IS THE WHOLE POINT.** The dossier says the guild exists. The map says it is not embodied here. **Both are true, and the Surveyor can say so out loud:** *"The Merchants' Guild holds a charter in this town but keeps its hall in the capital."* ⭐ *That sentence is worth more than a building would have been.*

⚠ **THE CENSUS:** every institution resolves to exactly one rung; **0 unresolved**; and ⛔ **`SUPPRESSED` is reported separately and never counted as a derivation** — an author's omission must never read as a world fact.

---

### ⟦FOLD §283⟧ §8.8 · ⭐⭐⭐ THE REPRESENTATION RATIO — a city drawn at village density, and it is ALREADY LAW

> **THE QUESTION: Whiterun is a city, but the author wants only a village's worth of buildings for authenticity to the source. Is that allowed? Is it still true?**
> ⭐⭐⭐ **YES, IT IS ALREADY ARCHITECTED, AND IT IS NOT AUTHORSHIP AT ALL — IT IS A DECLARED MAP CONVENTION.**

⭐⭐ **THE MECHANISM EXISTS AND SHIPS IN THE CARTOUCHE TODAY.** S23's declared derivation already publishes exactly this: **`FABRIC 1:1.3 HOUSEHOLDS (REPRESENTATIVE)`**. **The map has never claimed to draw every house. It has always declared its own abstraction — and a Whiterun is simply that same ratio moved from 1:1.3 to 1:40.**

```
⭐ THE PRINCIPLE, AND IT IS AS OLD AS CARTOGRAPHY ITSELF:
   EVERY MAP ABSTRACTS. THE ONLY QUESTION IS WHETHER IT DECLARES
   WHAT IT ABSTRACTED.

   dossier      CITY · this population · these institutions · this economy
                ⭐ UNCHANGED. The simulator runs on this.
   household    exact canonical household-count artifact: 1,200 households
   map          30 anonymous residential bodies → reduced ratio 40:1
   cartouche    "FABRIC 1:40 HOUSEHOLDS (REPRESENTATIVE)"
                ⭐ THE TRUTH LAYER IS PRESERVED BECAUSE THE MAP SAYS
                  WHAT IT IS. It is not a lie; it is a stated scale.
```

⭐⭐ **THE RULE THAT MAKES IT WORK — ABSTRACT THE ANONYMOUS, PRESERVE THE NAMED.** The ratio applies to **ordinary fabric**, never to landmarks:

```
ratio APPLIES to      anonymous residential bodies only
ratio DOES NOT APPLY  ⭐ named institutions · the wall and its towers ·
                      gates · bridges · mills · quays · the market ·
                      anything with an identity · anonymous workshops/sheds/works
```

Anonymous ancillary/work bodies are derived through separately typed functional descendant/LOD
rules (or their own future dimensioned ratios). The household ratio never silently down-samples
workshops, backland sheds, production nodes or aggregated trades.

⭐ *That is exactly how historical plans and game maps have always worked, and it is why a 1:40 Whiterun still reads as Whiterun: the named things are all there and the anonymous mass is representative.*

⚠⚠ **THE CONSEQUENCES, AND THEY MUST BE HANDLED OR EVERY REPRESENTATIVE MAP REDS:**

| consequence | the rule |
|---|---|
| **the grain bands** | ⛔ **measured against the DECLARED RATIO, never the raw tier.** A 1:40 city graded against city grain fails by construction, and that failure would be the instrument's fault, not the map's |
| **density-derived signals** | ⚠ degrade gracefully — a low-detail leaf has fewer carriers. Street grain and plot rhythm may still report their own registered causes; material composition is not a fallback social signal and remains `AMP-1`-gated (§6.4.1) |
| **the tier ladder** | unchanged — ⭐ **tier is a DOSSIER fact and the ratio is a DRAWING fact.** They are on different axes and must never be conflated |
| **causal coverage** | ⭐ **unaffected. A representative map is still fully DERIVED** — it is coarser, not less true. ⛔ The ratio must never be scored as authorship |

⛔⛔ **AND THE ONE HARD RULE: THE RATIO IS PINNED PER SETTLEMENT AND DOES NOT DRIFT.** If the ratio moved between two years, a town would appear to grow when only the drawing changed — **which would corrupt the single most valuable thing the product does, the year-A-versus-year-B comparison.** ⭐ *At a fixed ratio, a population doubling draws twice the bodies, and the growth on the page is real.*

---

### ⟦FOLD §283⟧ §8.9 · ⭐⭐ AUTHORSHIP UNDER THE CLOCK — the four interactions, and the third is the subtle one

> **THE QUESTION: how does all of this work with the simulator and time?**
> ⭐⭐⭐ **THE REASSURANCE FIRST, BECAUSE IT IS THE ANSWER TO THE FEAR BEHIND THE QUESTION: THE SIMULATOR NEVER DEGRADES. IT RUNS ON THE DOSSIER, WHICH AUTHORSHIP BARELY TOUCHES. WHAT DEGRADES IS ONLY THE MAP'S FIDELITY TO IT — AND THE LEDGER MEASURES EXACTLY THAT.**

| # | interaction | what happens |
|---|---|---|
| **1** | ⛔ **CONTRADICTION** — the sim destroys what you authored | ⭐ **TYPED CONFLICT** (§8.1), never a silent choice. `KEEP_AUTHORED` · `ACCEPT_CANONICAL` · `DEMOTE_TO_PORTRAIT` |
| **2** | **GROWTH AROUND** — the sim adds fabric beside what you authored | ⭐⭐ **authored objects are LOCKED and the fabric FLOWS AROUND THEM.** This is the inertia law doing precisely what it was built for; `FeatureLock` is already the shape |
| **3** | ⚠⚠ **OBSOLESCENCE** — the sim changes the REASON, and the authored thing stays | ⭐⭐⭐ **THE SUBTLE ONE. Authoring does not decay; its JUSTIFICATION does** — see below |
| **4** | **DISPOSITION CHANGE** — an `UNSITED` institution builds a hall in 1470 | ⭐ a clean **event**: `UNSITED → EMBODIED`, dated, in the log. And a fire runs it backwards |

#### ⭐⭐⭐ THE OBSOLESCENCE CASE, AND IT IS THE BEST FEATURE IN THIS SUBSECTION

**You placed a row of merchant houses in 1450 because the market was there. In 1490 the market moves. Nothing is destroyed — so there is no conflict — but the map is now asserting something the world stopped supporting.**

```
⭐ CAUSAL COVERAGE IS TIME-VARYING, AND IT CAN FALL WITHOUT THE USER
  TOUCHING ANYTHING, BECAUSE THE WORLD MOVED AND THE AUTHORED PARTS
  DID NOT.

   year 1450   847 bodies · causal coverage 96%
   year 1490   871 bodies · causal coverage 88%
               ⚠ "the market moved in 1478; 14 authored buildings no
                  longer have a reason. Review · re-derive · keep."
```

⭐⭐ **THAT IS A GENUINELY NEW KIND OF PRODUCT BEHAVIOUR AND IT FALLS OUT OF THE ARCHITECTURE FOR FREE.** No other tool can tell a user that their map has quietly stopped agreeing with their world — because no other tool has a derivation to measure the disagreement against. ⭐ *And the fix is one click: re-derive the orphaned bodies and let them move to where the reason went.*

#### PROMOTION — Portrait to canon member

```
⭐ THE HONEST PROMPT, AT THE ONE MOMENT IT MATTERS:
   "This map is 78% authored. The simulator can reason about the
    derived 22%. Promote it to a canon member anyway?"
      · PROMOTE AS IS      — authored bodies become LOCKED facts
      · RE-DERIVE FIRST    — keep the dossier, redraw from it
      · STAY A PORTRAIT
```

⛔ **AND THE INVARIANT THAT HOLDS THROUGH ALL FOUR CASES, STATED ONCE SO NOBODY HAS TO INFER IT: AUTHORING THE MAP NEVER EDITS THE SIMULATION.** Only **Class C designations** write back, and they write to the dossier deliberately and visibly. ⭐ *A hand-drawn Whiterun still has a dossier that says CITY with its institutions and its economy, and the world-pulse runs on that dossier exactly as it would for any other settlement. The picture became less faithful; the world did not become less real.*

---

### ⟦FOLD §284⟧ §8.10 · ⭐⭐⭐ THE RESOLVE PASS — "make the rest of it true"

> **THE OWNER'S ASK: the user authors to their taste, the map is INCOMPLETE, and one button generates the remaining truth around what they made — authorship intact.**
> ⭐⭐⭐ **THIS IS NOT A NEW ENGINE. IT IS THE EXISTING ENGINE WITH A BIGGER SET OF PRE-PLACED FACTS — AND THE GENERATOR HAS DONE CONSTRAINED GENERATION SINCE THE DAY IT COULD DRAW A WALL.**

⭐ **WHY IT IS CHEAPER THAN IT SOUNDS.** The pipeline already generates *around* fixed things it did not choose: the wall is a hard constraint the fabric must respect; terrain refusal forbids ground; institutions hold reserved ground; the ground law clips every footprint against every claim it meets. **An authored building is just one more claim.** `FeatureLock` is already the shape.

```
RESOLVE(document) =
     freeze every AUTHORED / NUDGED / DESIGNATED object as a HARD CLAIM
   → run S6…S19 with those as pre-placed facts
   → fill only what is EMPTY
   → mark everything new as DERIVED
```

#### ⚠⚠ IT IS TWO OPERATIONS, NOT ONE, AND CONFLATING THEM IS THE TRAP

| | **FILL** | **RECONCILE** |
|---|---|---|
| what | ⭐ the map is **incomplete** — empty ground, no backland, no countryside | ⚠ the map **contradicts** the dossier — an authored temple the dossier does not have |
| safety | ⭐⭐ **purely additive and always safe** | ⛔ something must change — **and the user must choose which** |
| default | run it | ⭐ **surface it, never resolve it silently** |

> ⭐⭐ **AND THE RECONCILE HALF RUNS IN A DIRECTION NOBODY EXPECTS, WHICH IS WHY IT IS WORTH BUILDING: THE MAP CAN TEACH THE DOSSIER.**
> *"You placed a temple. The dossier has no temple. **Add it to the world**, or keep it as `AUTHORED`?"*
> ⭐ **That is Class C's write-back running backwards, and it matches how people actually work — they draw first and rationalise after.** A tool that lets them draw first and then makes the world agree is doing something no competitor attempts.

#### ⭐⭐ THE AUTHORED DENSITY IMPLIES THE RATIO — the join that makes this work on a Whiterun

**If the user has drawn 30 anonymous residential bodies and an exact canonical household artifact says 1,200 households, RESOLVE must not fill to 1,200 bodies.** It fills to whatever §8.8's **representation ratio** says — and if no ratio is set, **it proposes one from those two like-dimensioned quantities and asks:**

> *"The selected household artifact records 1,200 households and you drew 30 anonymous residential bodies. Set the fabric ratio to 1:40 and fill to match your density?"*

⭐ *One question turns an incoherent request into a declared map convention, and the plate comes out honest.*
If the canonical household count is absent, RESOLVE refuses the ratio proposal. It never converts
souls/population to households or mixes named and anonymous bodies to manufacture a denominator.

#### THE CONTRACT

```
DETERMINISM   RESOLVE(seed, dossier, authoredSet) is a pure function.
              The authored set joins the derivation inputs exactly as
              mapEdits already does.
IDEMPOTENT    ⭐ running RESOLVE twice changes nothing.
LOCAL         ⭐⭐ adding ONE authored building and re-resolving changes
              only that building's dependency cone — the inertia law,
              which is the property that makes this usable at all rather
              than a full redraw every time.
LEGALITY      authored objects that are LAW_EXEMPT stay exempt; RESOLVE
              fills AROUND them and does not silently repair them.
              ⛔ It never edits what the user made.
PROVENANCE    everything RESOLVE creates is DERIVED, and causal coverage
              ⭐ RISES accordingly — the button's visible reward
```

---

### ⟦FOLD §284⟧ §8.11 · UNDO AND REDO

**The design already exists — *"undo/redo should reverse commands, not snapshots alone"*, with an inverse command for the cheap cases and a compact pre-edit snapshot for topology, checkpointed to bound replay. This subsection adds the four things that will otherwise be got wrong.**

```
1 ⭐⭐ RESOLVE IS **ONE** UNDOABLE COMMAND, NOT N THOUSAND PLACEMENTS.
      ⛔ If the fill enters history as individual bodies, undo is useless
        on the exact operation most likely to need it.

2 ⭐ UNDO RESTORES THE **DOCUMENT HASH BYTE-IDENTICALLY**, and that is
      the pin — not "looks the same". Redo likewise.

3 LINEAR HISTORY. A new edit after an undo CLEARS the redo stack.
      ⛔ Do not build a branching tree; nobody asked for one and the
        merge semantics are a product of their own.

4 ⛔⛔ THE BOUNDARY THAT MUST BE EXPLICIT OR USERS WILL EXPECT OTHERWISE:
      **UNDO IS SCOPED TO THE DOCUMENT, NEVER TO THE WORLD.**
      Advancing the clock is NOT undoable through the map's undo — it
      has its own event and version machinery. ⚠ If the year moved
      between an edit and its undo, undoing the edit does NOT restore
      the prior world, and the UI must say so rather than imply it.
```

---

### ⟦FOLD §284⟧ §8.12 · ⭐⭐ PINNED — the map holds, the world moves

> **THE OWNER'S ASK: a persistence toggle for the MAP ALONE. It stays exactly as drawn; the dossier and the simulator carry on changing and interacting.**
> ⭐⭐⭐ **RULED, AND IT IS NOT THE SAME AS PORTRAIT — IT IS A SECOND, ORTHOGONAL AXIS, AND IT HANDS YOU A CAMPAIGN FEATURE FOR FREE.**

```
PORTRAIT vs CANON MEMBER   does the settlement PARTICIPATE in simulation?
LIVE vs PINNED             does the MAP RE-DERIVE when the world moves?
                           ⭐ these are INDEPENDENT
```

| | **LIVE** | **PINNED** |
|---|---|---|
| **PORTRAIT** | a picture that nothing advances | a picture, frozen. The Whiterun case at rest |
| **CANON MEMBER** | ⭐ the default and the full product | ⭐⭐ **the map holds; the world runs on without it** |

> ⭐⭐⭐ **AND THE SECOND USE, WHICH IS WORTH MORE THAN THE FIRST AND COSTS NOTHING EXTRA: A PINNED CANON MAP IS A PLAYER-KNOWLEDGE MAP.**
> **The players have the plate from when they visited. The world has moved on. That is not staleness — it is exactly what a map IS in a campaign**, and it joins the DM-lens machinery already in the program. *The DM sees the live town; the party's handout is the town as they last saw it.*

⭐ **A PINNED PLATE IS DATED, AND THE CARTOUCHE SAYS SO** — the truth layer covering its own currency:

```
   SURVEYED 1450 · WORLD YEAR 1490
```

⚠ **CAUSAL COVERAGE ON A PINNED MAP FALLS WITH TIME AND NO USER ACTION** — the §8.9 obsolescence case driven purely by the clock rather than by authorship. ⭐ **On a pinned map that is not a warning, it is the POINT**, and the reading should be framed as age rather than as error: *"this survey is 40 years out of date."*

**UNPINNING IS SAFE AND ITS DIFF IS ITSELF AN ARTIFACT:**

> ⭐⭐ *"Re-deriving to 1490 changes 37 things: the new quay, the burnt north ward, 12 buildings the fire took, the widened Bridge Street. **Show me the diff · Re-derive · Stay pinned.**"*
> ⭐ *That list is "what happened while you were away", drawn — and it is one of the most compelling things this product can put in front of a user.*

⛔ **WHAT PINNED DOES NOT DO, STATED SO IT IS NEVER ASSUMED: IT DOES NOT PAUSE THE SIMULATION, FREEZE THE DOSSIER, OR EXEMPT THE SETTLEMENT FROM ANY CONSEQUENCE.** The world-pulse runs, the economy moves, institutions open and close, events land in the log. ⭐ **Only the drawing holds.**

#### THE FOUR AXES COMPOSE — and all sixteen states are legal

```
participation   PORTRAIT ↔ CANON MEMBER      (does it simulate?)
currency        LIVE ↔ PINNED                (does the map re-derive?)
authorship      the provenance ledger        (continuous, 0–100%)
representation  the declared ratio           (1:1.3 … 1:400)

⭐ ORTHOGONAL BY CONSTRUCTION — no combination is forbidden, and none
  needs a special case. A 100%-authored, pinned, 1:400 portrait is a
  Whiterun; a 0%-authored, live, 1:1.3 canon member is the default
  product; and every point between is legal and means something.
```

---

### §8.6 · SEQUENCING, AND THE ONE THING THAT MUST BE DONE EARLY

| | build | when |
|---|---|---|
| ⭐⭐ **the provenance ladder + divergence ledger** | the per-object rung and the aggregate | ⛔ **ARCHITECT NOW.** Cheap today, unaffordable to retrofit — the same argument as connection points. **Every object minted before it exists has no rung and can never be given a true one** |
| **compatibility edit schema** | main app 3 keys; sandbox 9 keys, reclassified by §10.12 | now |
| **Class B selection** | reroll / pick-a-legal-variant | early — ⭐ **cheapest surface, largest share of real user desire** |
| **Class C designation** | with dossier write-back and the re-derive cascade | after W4 makes wealth structural |
| **Class D geometry** | the editor running the generator's own predicates | after the volume law (D1) |
| **Class E events** | the event vocabulary; craters and ascensions as causes | with §6's D6 |
| **AI command emission** | the typed command vocabulary + arrival validation | after Class B/C exist to be commanded |

⚠⚠ **AND THE HONEST SCOPE WARNING: THIS IS A SECOND PRODUCT SURFACE, NOT A FEATURE.** It has a UX, an undo model, a conflict-resolution flow, a permissions story and an AI contract. ⛔ **It must not be started while S9's frontage line is unbuilt** — an editor for a fabric that does not yet have frontage is an editor for the wrong drawing. ⭐ *Architect it now so nothing has to be re-derived; build it after the fabric it edits is worth editing.*

---


---

## ⟦FOLD §285⟧ §9 · THE AUTHORSHIP BUILD SHEET — HOW §8 IS ACTUALLY BUILT

### ⟦FOLD §285⟧ ARCHITECTED 2026-08-19 ON THE OWNER'S ORDER. DESIGN ONLY — ⛔ NOTHING IMPLEMENTED, NOTHING DISPATCHED.
### **§8 is law and product design. §9 is the substrate that makes it executable** — the document contract, the module map, the typed command vocabulary, the invalidation model, persistence and migration, the AI arrival gate, the censuses, the wave sheet and the refusals. It stands to §8 exactly as §7 stands to §6.

### §9.0 · HOW TO USE THIS

**The reader:** an engineer with no memory of this program, holding §8, who has to write the editor.

⭐⭐ **THE FIRST THING TO KNOW, AND IT CHANGES WHERE YOU START: COMPATIBILITY EDIT STATE ALREADY EXISTS.** The main application carries three top-level keys; the sandbox carries the **nine-key** vocabulary — `layoutVariant · pins · sceneOverrides · legendPrefs · styleLens · layoutLawVersion · annotations · bespokeStyles · seasonOverride` — with its denylist-safe naming trap, bounded vocabularies and dormancy defaults. ⛔ **DO NOT REPLACE OR OVERSTATE IT. §9 EXTENDS IT THROUGH THE §10.12 CLASSIFICATION.**

⚠⚠ **AND THE LAW IT ALREADY OBEYS IS THE ONE THIS WHOLE SECTION TURNS ON — THE EDIT-ANCHORING LAW:** legacy presentation keys remain replayed and dormancy-proven; they never silently become canonical geometry. `layoutVariant` is already generative candidate selection, and `layoutLawVersion` is META, so neither is truthfully Class A (§10.12). New canonical geometry verbs feed the drift substrate through typed commands/operations: tick T+1 derives from the edited constraints. ⛔⛔ **Presentation never silently promotes to generative.**

⚠ **TypeScript notation is interface notation, not a migration order** (as §7.0). ⛔ **No ratchet is raised here**, and ⛔ **no new work enters `buildFabric.js`**, which is at its ceiling.

---

### §9.1 · THE ARTIFACT CONTRACTS

```ts
interface MapDocument extends MapDocumentBase { // sole current AUTHORED layer above WORLD
  artifactKind: 'MAP_DOCUMENT';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  selectedSpatialRef: ArtifactHashRef;
  generationManifestRef: ArtifactHashRef;

  participation: 'PORTRAIT' | 'CANON_MEMBER';        // §8.1
  currencyState:                                   // §8.12 — invalid combinations unrepresentable
    | { currency: 'LIVE'; pinnedAt?: never }
    | { currency: 'PINNED'; pinnedAt: TimeKey };
  projectionSettingsRef: ArtifactHashRef;            // fixed/pinned/world-time light included

  commands: readonly EditCommand[];        // ⭐ the authored history

  locks: readonly FeatureLock[];
  provenanceLedgerRef: ArtifactHashRef;    // immutable origin + interventions; rung is derived UI
  conflicts: readonly ConflictRecord[];    // immutable open + resolved conflict history

  contentHash: ContentHash;                // ⭐ canonical document hash / undo pin (§8.11)
}

interface MapEditingSessionState {         // persisted separately; never part of MapDocument bytes
  sourceDocumentRef: ArtifactHashRef;
  redoStack: readonly EditCommand[];        // linear; cleared on new edit
  checkpointRefs: readonly ArtifactHashRef[]; // deterministic replay caches
}

interface SnapshotRef extends ArtifactHashRef {
  artifactKind: 'MAP_DOCUMENT_SNAPSHOT';
}

type EditInversePlan =
  | { kind: 'DERIVED_INVERSE_PAYLOAD'; inverseVerb: EditVerb;
      payloadRef: ArtifactHashRef; derivationReceiptRef: ArtifactHashRef }
  | { kind: 'PRE_EDIT_SNAPSHOT'; snapshotRef: SnapshotRef };

interface FeatureLock {
  lockId: EntityId;
  entityId: EntityId;
  lockedByCommandRef: ArtifactHashRef;
  effectiveAt: TimeKey;
  provenanceRef: ProvenanceRef;
}

interface DocumentCheckpoint {
  artifactKind: 'MAP_DOCUMENT_CHECKPOINT';
  artifactId: ArtifactId;
  schemaVersion: number;
  sourceDocumentRef: ArtifactHashRef;
  throughCommandOrdinal: number;
  snapshotRef: SnapshotRef;
  lawVersion: LawVersion;
  contentHash: ContentHash;
}

interface MapDocumentSnapshot {
  artifactKind: 'MAP_DOCUMENT_SNAPSHOT';
  artifactId: ArtifactId;
  schemaVersion: number;
  beforeDocumentRef: ArtifactHashRef;
  capturedBeforeCommandOrdinal: number;
  lawVersion: LawVersion;
  contentHash: ContentHash;
}

type ProvenanceRung =
  | 'DERIVED' | 'REROLLED' | 'NUDGED'
  | 'DESIGNATED' | 'AUTHORED' | 'IMPORTED';

interface ProvenanceIndex {
  rung: ReadonlyMap<EntityId, ProvenanceRung>;
  lawExempt: ReadonlySet<EntityId>;        // §8.2 Class D override
  authoredBy: ReadonlyMap<EntityId, number>;   // the command ordinal
}

// ProvenanceIndex is a derived compatibility/UI projection only. It is never stored as canonical
// MapDocument provenance and never participates in its contentHash; provenanceLedgerRef is authority.

interface CausalCoverageVector {
  entityCount: { explained: number; total: number };
  visibleArea: { explainedAreaQ: AreaQ; totalVisibleAreaQ: AreaQ };
  namedSemantics: { explained: number; total: number };
  causalStatusCounts: Readonly<Record<'EXPLAINED'|'PARTIAL'|'UNEXPLAINED'|'OBSOLETE_CAUSE', number>>;
  lawStatusCounts: Readonly<Record<'LAWFUL'|'DECLARED_EXEMPTION'|'CONFLICT', number>>;
}

interface DivergenceLedger {               // §8.0 — hash-addressed derived readout
  artifactId: ArtifactId;
  sourceDocumentRef: ArtifactHashRef;
  atTime: TimeKey;
  rungCounts: Readonly<Record<ProvenanceRung, number>>; // UI projection, never origin authority
  coverage: CausalCoverageVector;
  uiWeightingRef?: ArtifactHashRef;         // optional declared display weighting, never authority
  orphaned: readonly OrphanedJustification[];   // §8.9's obsolescence
  contentHash: ContentHash;
}

interface OrphanedJustification {          // ⭐ "no longer has a reason"
  entityId: EntityId;
  wasJustifiedBy: CauseRef;                // the cause that has since moved
  brokenAt: TimeKey;
  causeEventId: EntityId;
}

type ConflictResolution = 'KEEP_AUTHORED' | 'ACCEPT_CANONICAL' | 'DEMOTE_TO_PORTRAIT';

interface ConflictRecordBase {             // §8.1 — never silently resolved
  conflictId: EntityId;
  entityId: EntityId;
  authoredIntent: 'PRESERVE' | 'PLACE' | 'DESIGNATE';
  canonicalOperationOrEventRef: ArtifactHashRef;
  year: TimeKey;
  offered: readonly [ConflictResolution, ...ConflictResolution[]];
  recordHash: ContentHash;
}

type ConflictRecord =
  | (ConflictRecordBase & { status: 'OPEN'; resolvedAs?: never;
      resolutionProof?: never; resolvedAt?: never; beforeConflictHash?: never })
  | (ConflictRecordBase & { status: 'RESOLVED'; resolvedAs: 'KEEP_AUTHORED';
      beforeConflictHash: ContentHash;
      resolutionProof: { kind: 'COMMAND'; commandRef: ArtifactHashRef };
      resolvedAt: TimeKey })
  | (ConflictRecordBase & { status: 'RESOLVED'; resolvedAs: 'ACCEPT_CANONICAL';
      beforeConflictHash: ContentHash;
      resolutionProof: { kind: 'DOMAIN_RECEIPT'; receiptRef: ArtifactHashRef };
      resolvedAt: TimeKey })
  | (ConflictRecordBase & { status: 'RESOLVED'; resolvedAs: 'DEMOTE_TO_PORTRAIT';
      beforeConflictHash: ContentHash;
      resolutionProof: { kind: 'COMMAND'; commandRef: ArtifactHashRef };
      resolvedAt: TimeKey });

interface EditCommandPayloadByVerb {
  SET_LENS: { editClass: 'A'; effect: 'NONE'; args: { lensId: string } };
  SET_SEASON_PIN: { editClass: 'A'; effect: 'NONE'; args: { seasonRef: ArtifactHashRef | null } };
  ADD_PIN: { editClass: 'A'; effect: 'NONE'; args: { entityId: EntityId } };
  ADD_ANNOTATION: { editClass: 'A'; effect: 'NONE'; args: { annotationId: EntityId;
      text: string; anchorEntityId?: EntityId } };
  SET_LEGEND_PREFS: { editClass: 'A'; effect: 'NONE'; args: { preferenceSetRef: ArtifactHashRef } };
  SET_BESPOKE_STYLE: { editClass: 'A'; effect: 'NONE'; args: { styleRef: ArtifactHashRef } };
  PIN_GLOBAL_LIGHT: { editClass: 'A'; effect: 'NONE'; args: { finalizedLightProfileRef: ArtifactHashRef } };
  CLEAR_PINNED_LIGHT: { editClass: 'A'; effect: 'NONE'; args: { noArgs: true } };
  SET_LIGHT_OBSERVATION_MODE: { editClass: 'A'; effect: 'NONE'; args:
    | { mode: 'FIXED_SURVEY'; celestialLawRef?: never }
    | { mode: 'WORLD_TIME_OBSERVATION'; celestialLawRef: ArtifactHashRef } };
  SET_LAYOUT_VARIANT: { editClass: 'B'; effect: 'REROLLED'; args: { variant: number } };
  REROLL_ENTITY: { editClass: 'B'; effect: 'REROLLED'; args: { entityId: EntityId;
      namespaceId: string; candidateRef: ArtifactHashRef } };
  PICK_FOOTPRINT_CANDIDATE: { editClass: 'B'; effect: 'REROLLED'; args: {
      bodyId: EntityId; candidateRef: ArtifactHashRef } };
  PICK_SUBDIVISION: { editClass: 'B'; effect: 'REROLLED'; args: {
      parcelId: EntityId; candidateRef: ArtifactHashRef } };
  PICK_ANNEX_ARRANGEMENT: { editClass: 'B'; effect: 'REROLLED'; args: {
      bodyId: EntityId; candidateRef: ArtifactHashRef } };
  SET_CURRENT_DISTRICT_CONDITION: { editClass: 'C'; effect: 'DESIGNATED'; args: {
      districtId: EntityId; conditionStateId: string; operationProposalRef: ArtifactHashRef } };
  SET_DISTRICT_CATEGORY: { editClass: 'C'; effect: 'DESIGNATED'; args: {
      districtId: EntityId; categoryId: string; operationProposalRef: ArtifactHashRef } };
  DESIGNATE_INSTITUTION: { editClass: 'C'; effect: 'DESIGNATED'; args: {
      bodyId: EntityId; institutionTypeRef: ArtifactHashRef; operationProposalRef: ArtifactHashRef } };
  SET_INSTITUTION_DISPOSITION: { editClass: 'C'; effect: 'DESIGNATED'; args: {
      institutionId: EntityId; dispositionId: string; operationProposalRef: ArtifactHashRef } };
  SET_STREET_ROLE: { editClass: 'C'; effect: 'DESIGNATED'; args: {
      streetId: EntityId; roleId: string; operationProposalRef: ArtifactHashRef } };
  MERGE_DISTRICTS: { editClass: 'C'; effect: 'DESIGNATED'; args: {
      districtIds: readonly [EntityId, EntityId, ...EntityId[]]; operationProposalRef: ArtifactHashRef } };
  SPLIT_DISTRICT: { editClass: 'C'; effect: 'DESIGNATED'; args: {
      districtId: EntityId; splitPlanRef: ArtifactHashRef; operationProposalRef: ArtifactHashRef } };
  PLACE_BODY: { editClass: 'D'; effect: 'AUTHORED'; args: { bodySpecificationRef: ArtifactHashRef } };
  REMOVE_BODY: { editClass: 'D'; effect: 'AUTHORED'; args: { bodyId: EntityId } };
  MOVE_BODY: { editClass: 'D'; effect: 'NUDGED'; args: { bodyId: EntityId; targetAnchor: PointQ } };
  RESHAPE_FOOTPRINT: { editClass: 'D'; effect: 'AUTHORED'; args: {
      bodyId: EntityId; footprint: PolygonQ } };
  SET_BODY_HEIGHT: { editClass: 'D'; effect: 'AUTHORED'; args: { partId: EntityId; heightQ: HeightQ } };
  SET_MATERIAL_COMPONENT: { editClass: 'D'; effect: 'AUTHORED'; args: {
      partId: EntityId; role: MaterialComponentRole; candidateRef: ArtifactHashRef } };
  AUTHOR_ROOF_SPECIFICATION: { editClass: 'D'; effect: 'AUTHORED'; args: {
      partId: EntityId; specificationRef: ArtifactHashRef } };
  ADD_PART: { editClass: 'D'; effect: 'AUTHORED'; args: {
      bodyId: EntityId; partSpecificationRef: ArtifactHashRef } };
  REMOVE_PART: { editClass: 'D'; effect: 'AUTHORED'; args: { bodyId: EntityId; partId: EntityId } };
  ADD_STREET_EDGE: { editClass: 'D'; effect: 'AUTHORED'; args: { edgeSpecificationRef: ArtifactHashRef } };
  REMOVE_STREET_EDGE: { editClass: 'D'; effect: 'AUTHORED'; args: { edgeId: EntityId } };
  MOVE_STREET_NODE: { editClass: 'D'; effect: 'NUDGED'; args: { nodeId: EntityId; point: PointQ } };
  SPLIT_PARCEL: { editClass: 'D'; effect: 'AUTHORED'; args: {
      parcelId: EntityId; splitPlanRef: ArtifactHashRef } };
  MERGE_PARCELS: { editClass: 'D'; effect: 'AUTHORED'; args: {
      parcelIds: readonly [EntityId, EntityId, ...EntityId[]] } };
  PROPOSE_EVENT: { editClass: 'E'; effect: 'NONE'; args: {
      eventKindId: string; effectiveAt: TimeKey; proposalPayloadRef: ArtifactHashRef } };
  LOCK: { editClass: 'META'; effect: 'NONE'; args: { entityId: EntityId } };
  UNLOCK: { editClass: 'META'; effect: 'NONE'; args: { entityId: EntityId } };
  RESOLVE: { editClass: 'META'; effect: 'NONE'; args: { resolvePlanRef: ArtifactHashRef } };
  PIN_MAP: { editClass: 'META'; effect: 'NONE'; args: { atTime: TimeKey } };
  UNPIN_MAP: { editClass: 'META'; effect: 'NONE'; args: { rebaseProposalRef: ArtifactHashRef } };
  SET_REPRESENTATION_RATIO: { editClass: 'META'; effect: 'NONE'; args: {
      representationDecisionRef: ArtifactHashRef } };
  PROMOTE_TO_CANON: { editClass: 'META'; effect: 'NONE'; args: { operationProposalRef: ArtifactHashRef } };
  DEMOTE_TO_PORTRAIT: { editClass: 'META'; effect: 'NONE'; args: { noArgs: true } };
}

type EditVerb = keyof EditCommandPayloadByVerb;
type EditProvenanceEffect = 'NONE' | 'REROLLED' | 'NUDGED' | 'DESIGNATED' | 'AUTHORED';

interface EditVerbContract<V extends EditVerb> {
  contractId: EntityId;
  verb: V;
  argsSchemaRef: ArtifactHashRef;
  editClass: EditCommandPayloadByVerb[V]['editClass'];
  provenanceEffect: EditCommandPayloadByVerb[V]['effect'];
  legalityPredicateRef: ArtifactHashRef;
  inverseDerivationRef: ArtifactHashRef;
  invalidationConeDerivationRef: ArtifactHashRef;
}

interface EditCommandRegistry {
  artifactKind: 'EDIT_COMMAND_REGISTRY';
  artifactId: ArtifactId;
  schemaVersion: number;
  contracts: readonly [EditVerbContract<EditVerb>, ...EditVerbContract<EditVerb>[]];
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface EditCommandLegalityReceipt {
  artifactKind: 'EDIT_COMMAND_LEGALITY_RECEIPT';
  artifactId: ArtifactId;
  schemaVersion: number;
  commandRegistryRef: ArtifactHashRef;
  contractId: EntityId;
  beforeDocumentRef: ArtifactHashRef;
  commandPayloadHash: ContentHash;
  predicateRef: ArtifactHashRef;
  outcome: 'LEGAL';
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface EditCommandBase {
  artifactKind: 'EDIT_COMMAND';
  artifactId: ArtifactId;
  schemaVersion: number;
  ordinal: number;                         // monotone; the history index
  issuedBy: 'USER' | 'AI' | 'RESOLVE';     // ⭐ AI-issued is marked forever
  commandRegistryRef: ArtifactHashRef;
  contractId: EntityId;
  legalityReceiptRef: ArtifactHashRef;
  inverse: EditInversePlan;                // acyclic payload/snapshot; never reciprocal command refs
  cone: readonly EntityId[];               // equality-pinned output of contract cone law
  atTime: TimeKey;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type EditCommand = {
  [V in EditVerb]: EditCommandBase & {
    verb: V;
    args: Readonly<EditCommandPayloadByVerb[V]['args']>;
    editClass: EditCommandPayloadByVerb[V]['editClass'];
    provenanceEffect: EditCommandPayloadByVerb[V]['effect'];
  }
}[EditVerb];

interface ResolvePlan {                    // §8.10 — the button's dry run
  artifactKind: 'RESOLVE_PLAN';
  artifactId: ArtifactId;
  schemaVersion: number;
  generationManifestRef: ArtifactHashRef;
  fill: readonly GenerationNodeId[];       // exact manifest nodes in declared topological order
  hardClaims: readonly EntityId[];         // authored objects frozen as input
  contradictions: readonly Contradiction[];      // ⛔ FILL will not touch these
  ratioProposal?: {                        // pre-decision values; accepted decision may cite plan
    householdCountRef: ArtifactHashRef;
    householdsPerAnonymousBody: RatioQ;
    anonymousResidentialBodyCount: number;
    namedBodiesExcluded: true;
    ancillaryAndWorkBodiesExcluded: true;
  };
  estimatedNewBodies: number;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface Contradiction {                  // the RECONCILE half
  kind: 'AUTHORED_NOT_IN_DOSSIER' | 'DOSSIER_NOT_ON_MAP'
      | 'DENSITY_MISMATCH' | 'DISPOSITION_MISMATCH';
  entityId?: EntityId;
  dossierFact?: string;
  offered: readonly ('ADD_TO_DOSSIER' | 'KEEP_AUTHORED'
                   | 'SET_RATIO' | 'SUPPRESS')[];
}
```

⭐⭐ **`MapDocument.contentHash` IS THE DOCUMENT/UNDO PIN AND MUST BE A REAL DIGEST, NOT A COUNTER.** §8.11's contract is *byte-identical restoration*; a monotone version number cannot prove it. It hashes every canonical semantic field: schema/settlement, exact base-world and base-dossier refs, survey time, spatial law/ABI, selected spatial and generation-manifest refs, participation/currency, representation and household authority, projection settings, ordered commands, locks, provenance ledger and conflicts. Checkpoints and redo state live only in separately referenced `MapEditingSessionState`; they are not unhashed bytes inside the canonical document. No omitted canonical field may change while the digest holds.

The versioned `EditCommandRegistry` contains exactly one contract for every `EditVerb`, no extras.
Command args/class/effect equal that contract, the legality receipt proves its predicate against the
exact before document, and inverse/cone are recomputed from the registered laws and rejected on any
inequality. Callers never choose an inverse or invalidation cone. `SET_LIGHT_OBSERVATION_MODE` is
total: fixed survey forbids a celestial-law ref; world time requires one. Generated JSDoc/JSON
Schema, the table below and the registry must agree byte-for-byte.

Conflict history is append-only inside the document. OPEN carries no proof. RESOLVED preserves the
exact prior `recordHash` in `beforeConflictHash`, requires `resolvedAs` to occur in `offered`, and
uses the proof branch appropriate to that choice: KEEP_AUTHORED/DEMOTE cite a document command,
while ACCEPT_CANONICAL cites the core domain receipt that changed canon. The active-conflict UI is a
projection of OPEN rows; resolved rows remain for provenance and cannot be rewritten in place.

---

### §9.2 · THE MODULE MAP

| module | owns | may import |
|---|---|---|
| `authorship/mapDocument.js` | the document, its hash, checkpoints | lineage, hashing |
| `authorship/commands.js` | ⭐ the **CLOSED** verb registry: args schema · legality · inverse · cone · rung | (declarations only — no engine) |
| `authorship/apply.js` | apply/undo document, portrait and projection commands only; never write WORLD/dossier | commands, projection/document predicates |
| `authorship/undo.js` | undo/redo, checkpoint replay, the document-scope boundary | mapDocument, apply |
| `authorship/provenance.js` | immutable ledger records; rung/lawExempt/authoredBy are derived UI views | lineage, provenance ledger |
| `authorship/divergence.js` | coverage, orphaned justifications, the shipping readout | provenance, event log |
| `authorship/resolve.js` | ⭐ the RESOLVE pass — plan, FILL, and the RECONCILE surface | the whole generator, as a **caller** |
| `authorship/domainProposal.js` | one-way typed proposal adapter for Class C/E and any canonical D promotion | core operation declarations only |
| `authorship/reconcile.js` | contradictions and typed core-operation proposals; no direct dossier/world writes | operation declarations, provenance |
| `authorship/conflicts.js` | `AUTHORED_CANONICAL_CONFLICT` on clock advance | event log, provenance |
| `authorship/currency.js` | PINNED/LIVE, the dated cartouche, the unpin diff | mapDocument, the generator |
| `authorship/aiGate.js` | ⛔ the **ARRIVAL VALIDATOR** — the only door AI commands enter by | commands (declarations only) |
| `authorship/authorshipCensus.js` | §9.7 | all of the above |

> ⛔⛔ **THE IMPORT LAW, AND IT IS THE SAME ONE `dimensional/**` OBEYS: `authorship/**` MAY IMPORT THE ENGINE; THE ENGINE MAY NEVER IMPORT `authorship/**`.**
> ⭐ **That single rule is what keeps the generator headless and keeps a settlement with no document byte-identical to one generated before §8 existed.** The engine does not know an editor exists. **`resolve.js` is a CALLER of the pipeline, never a participant in it** — which is also why RESOLVE cannot accidentally become a stage.

---

### §9.3 · ⭐⭐⭐ THE COMMAND VOCABULARY — closed, typed, and the class boundary is machine-checked

**Every verb declares five things. ⛔ A verb missing any of the five cannot be registered, and CI reds.**

```
args      every value from a CLOSED vocabulary or a bounded numeric range
legality  the predicate it must satisfy — ⭐ THE GENERATOR'S OWN (§8.2 D)
inverse   an inverse command, or a compact pre-edit snapshot ref
cone      the invalidation scope it claims (§9.4)
rung      the ProvenanceRung it assigns
```

| verb | cls | legality | inverse | cone | rung |
|---|---|---|---|---|---|
| `SET_LENS` · `SET_SEASON_PIN` · `ADD_PIN` · `ADD_ANNOTATION` · `SET_LEGEND_PREFS` · `SET_BESPOKE_STYLE` · `PIN_GLOBAL_LIGHT` · `CLEAR_PINNED_LIGHT` · `SET_LIGHT_OBSERVATION_MODE` | **A** | closed projection vocabulary; pin requires finalized deterministic profile | prior projection-settings ref | ⭐ **none — PROJECTION** | unchanged |
| `SET_LAYOUT_VARIANT` | **B** | integer ≥ 0 | prior value | whole settlement | `REROLLED` |
| `REROLL_ENTITY(id, namespace)` | **B** | namespace registered | prior variant | ⭐ entity + descendants | `REROLLED` |
| `PICK_FOOTPRINT_CANDIDATE` · `PICK_SUBDIVISION` · `PICK_ANNEX_ARRANGEMENT` | **B** | ⭐ index into the enumerated candidates | prior index | body / block + descendants | `REROLLED` |
| `SET_CURRENT_DISTRICT_CONDITION` · `SET_DISTRICT_CATEGORY` | **C** | band ∈ vocab; core operation authority | prior value / domain receipt | district condition, occupancy and maintenance; **no inherited street or material-identity rewrite** | `DESIGNATED` |
| `DESIGNATE_INSTITUTION(bodyId, kind)` | **C** | kind ∈ catalog | prior kind / none | body + siting relations | `DESIGNATED` |
| `SET_INSTITUTION_DISPOSITION` | **C** | rung ∈ §8.7 ladder | prior rung | that institution | `DESIGNATED` |
| `SET_STREET_ROLE` · `MERGE_DISTRICTS` · `SPLIT_DISTRICT` | **C** | vocab + adjacency | inverse cmd | district(s) + boundary fabric | `DESIGNATED` |
| `PLACE_BODY` · `REMOVE_BODY` | **D** | ⛔ **ground law · volume law · frontage · access** | inverse cmd | body + neighbours in claim range | `AUTHORED` |
| `MOVE_BODY` · `RESHAPE_FOOTPRINT` · `SET_BODY_HEIGHT` | **D** | ⛔ same predicates | prior geometry snapshot | body + claim neighbours | `NUDGED` if legal & fact unchanged, else `AUTHORED` |
| `SET_MATERIAL_COMPONENT(partId, role, candidateId)` | **D** | candidate ∈ the legal component/system set enumerated under the active evidence scope | prior component snapshot | part + roof/projection descendants | `AUTHORED` |
| `AUTHOR_ROOF_SPECIFICATION(partId, specification)` | **D** | explicit authored RoofSpecification + solid/roof legality; historical change additionally uses typed operation/receipt | prior specification snapshot | part + roof/shadow descendants | `AUTHORED` |
| `ADD_PART` · `REMOVE_PART` | **D** | ⛔ volume law + attachment vocabulary | inverse cmd | body + its roofs + shadow | `AUTHORED` |
| `ADD_STREET_EDGE` · `REMOVE_STREET_EDGE` · `MOVE_STREET_NODE` | **D** | ⛔ planar topology + access | pre-edit snapshot | ⚠⚠ **edge + faces + frontage + parcels + buildings — the largest cone in the system** | `AUTHORED` |
| `SPLIT_PARCEL` · `MERGE_PARCELS` | **D** | cadastral legality | lineage inverse | parcel + descendants | `AUTHORED` |
| `PROPOSE_EVENT(kind, year, args)` | **E proposal** | kind ∈ event vocab; year ordered; core authority approves | discard unaccepted proposal; accepted event is not document-undoable | committed domain event's later derivation cone | `DERIVED` only after core receipt ⭐ |
| `LOCK` · `UNLOCK` | META | entity exists | inverse | none | unchanged |
| `RESOLVE` | META | — | ⭐⭐ **ONE snapshot (§8.11 hazard 1)** | everything it filled | `DERIVED` |
| `PIN_MAP` · `UNPIN_MAP` | META | — | inverse | ⭐ none on pin; full re-derive on unpin | unchanged |
| `SET_REPRESENTATION_RATIO` | META | ⛔ **once per settlement; changing it is owner-facing** | prior value | whole fabric | unchanged |
| `PROMOTE_TO_CANON` · `DEMOTE_TO_PORTRAIT` | META | — | inverse | none | unchanged |

⭐⭐⭐ **THE TWO ROWS THAT CARRY THE WHOLE DESIGN'S ARGUMENT, AND THEY ARE WORTH READING TWICE:**

**A current prosperity/condition designation does not rewrite inherited morphology.** It changes
occupancy, maintenance, surface condition and active use through a canonical domain operation; it
does not replace material components or manufacture historical patchwork without a dated operation.
Dead ends, grain and frontage change only under an explicit pre-canon historical REBASE or through
dated future construction/abandonment events (§10.13). ⭐ *The quarter becomes poor everywhere a
current condition should appear, without pretending its streets were rebuilt overnight.*

**An accepted domain event produces DERIVED consequences, but `MapDocument` does not record or
remove the event itself.** The map proposes a cause; the existing core operation/authority/outbox
door commits it and owns its receipt. Drawing a crater by hand remains AUTHORED; committing a
disaster through the domain lets the engine derive the debris/heal seam without inventing a second
event store (§10.13).

---

### §9.4 · THE INVALIDATION MODEL — what an edit costs

**Given changed roots `R`, the rebuild set is `I(R) = R ∪ descendants(R)` intersected with the entity-level dependency records — and nothing else.** ⭐ *This is the same dependency model §6's local reroll uses; the editor does not get a second one.*

| edit | invalidates | ⭐ MUST remain byte-identical |
|---|---|---|
| any Class **A** | ⭐ **nothing in WORLD** — PROJECTION only | every world hash |
| reroll one roof | that roof · its mesh · local shadow | streets, parcels, every other body |
| reroll one footprint | body · roof · its shadow | the block, the frontage, neighbours |
| move / reshape one body | body · **claim neighbours in range** | the street, the parcel, the block |
| add / remove a part | body · its roofs · local occlusion | the citywide street graph |
| split a parcel | parcel · its buildings · backland | ⭐ unrelated blocks |
| change current district condition/prosperity | occupancy · maintenance/material-condition **state** · active use in that district; no material identity/composition without a typed operation | ⭐ **all inherited topology/frontage/parcels, the wall, every other district** |
| ⚠⚠ change one street edge | ⛔ **subdivision · frontage · parcels · buildings · access — the largest cone there is** | upstream terrain, region, history, other districts |
| accepted core event | whatever its registered domain derivation reaches on later dated states | everything outside its declared causal cone |
| pin the map | nothing | everything |
| unpin the map | ⭐ full re-derive to the current year | the dossier |

⛔⛔ **THE HONESTY RULE, INHERITED VERBATIM FROM THE INVALIDATION DOCTRINE: A COMMAND MAY NOT CLAIM A CONE SMALLER THAN IT ACTUALLY TOUCHES.** If a verb's declared cone and its measured blast radius disagree, **the verb is wrong, not the measurement.** ⭐ *A "local" edit that quietly moves half the town is worse than an honestly global one, because the user trusted it.*

⭐ **AND THE ONE DECLARED BARRIER:** `SET_REPRESENTATION_RATIO` is a **whole-fabric barrier** and must say so. It cannot pretend to be local, which is also why §8.8 pins it once per settlement.

---

### §9.5 · PERSISTENCE, MIGRATION AND THE REPLAY MODEL

```
⭐⭐ THE DOCUMENT IS ADDITIVE AND ABSENT BY DEFAULT.
   A settlement with NO MapDocument generates byte-identically to one
   made before §8 existed. ⛔ That is a hash pin, not a claim.

⭐ DETERMINISM:   map(seed, dossier, tick, editHistory)
   The command list is an ORDERED input to derivation, exactly as
   mapEdits already is. Same list, same map, forever.

⭐ REPLAY COST is bounded by CHECKPOINTS:
      document = nearest checkpoint  +  the commands after it
      ⚠ checkpoint on: RESOLVE · a Class D burst · every N commands ·
        any clock advance
      ⛔ NEVER checkpoint mid-command — a half-applied topology edit is
        the one state that cannot be recovered from
```

⚠⚠ **THE MIGRATION HAZARD THAT WILL BITE, NAMED IN ADVANCE: A COMMAND LIST OUTLIVES THE VERB THAT WROTE IT.** A document authored at schema 3 must still replay when the engine is at schema 7 and a verb's arguments have changed shape.

> ⭐ **THE RULE: A VERB IS NEVER MUTATED IN PLACE. It is superseded by a new verb, and a registered MIGRATION rewrites old commands into new ones at load.** ⛔ A silently changed verb turns every saved document into a different map, and the user would have no way to know.

⭐ **AND THE PIN THAT CATCHES IT: a corpus of persisted fixture documents at every historical schema version replays to its recorded `MapDocument.contentHash` on every release.** *This is the same shape as the golden-master discipline, applied to authorship.*

---

### §9.6 · ⭐⭐⭐ THE AI ARRIVAL GATE — the only door AI commands enter by

⛔⛔ **THE STANDING LAW, RESTATED BECAUSE THIS IS WHERE IT WOULD BE EASIEST TO ERODE: THE AI CLASSIFIES INTO OUR DETERMINISM, IS VALIDATED ON ARRIVAL, AND IS REJECTED OUT-OF-VOCABULARY — NEVER GEOMETRY, NEVER FREE TEXT.** ⭐ AI-emitted coordinates would break same-seed identity, THE PROMISE and every census at once.

#### ⭐⭐ THE AFFORDANCE QUERY — the mechanism that makes a clerk powerful

**The AI never invents a position. The ENGINE enumerates what is legal and the AI PICKS.**

```
1  the AI asks           "where could a temple go?"
2  ⭐ THE ENGINE ANSWERS with a bounded, NAMED, legal set —
      [ "market.frontage.NE", "old-core.block-17.corner",
        "gate-road.ribbon.S" ]
      each already checked against ground law, volume law, frontage
      and access, each with a one-line reason
3  the AI emits          { PLACE_INSTITUTION, kind:"temple",
                           anchorSlot:"market.frontage.NE" }
4  ⛔ THE ARRIVAL GATE validates verb ∈ registry · every arg ∈ its
      closed vocabulary · the slot is still offered · legality re-run
5  the ENGINE places the geometry
```

⭐⭐⭐ **THE AI NEVER SEES A COORDINATE, NEVER EMITS ONE, AND CANNOT PRODUCE AN ILLEGAL RESULT — because it is choosing from a set the engine already proved legal.** *And the user gets full natural-language editing with zero determinism risk, which is the whole prize.*

#### THE GATE'S REFUSALS — and they are loud, never silent

```
unknown verb            ⛔ REJECT — never "closest match"
arg outside vocabulary  ⛔ REJECT — never coerce
a slot no longer offered ⛔ REJECT and RE-OFFER — the world moved
free-text where a typed value belongs   ⛔ REJECT
⛔⛔ ANY numeric coordinate, polygon, path or transform  ⇒ REJECT,
   AND IT IS A DEFECT REPORT, NOT A USER ERROR — the prompt or the
   tool schema let it through and both must be fixed
```

⭐ **EVERY AI-ISSUED COMMAND IS MARKED `issuedBy: 'AI'` FOREVER** — auditable, filterable, and undoable as a batch. ⚠ *A user who wants to see what the assistant changed can, and always will be able to.*

⭐⭐ **AND THE SURVEYOR READS THE DIVERGENCE LEDGER AND STATES ITS OWN LIMITS**, which is worth more than any capability in this subsection: *"I can tell you why the market is where it is. The three buildings on the north ridge you placed yourself — I have no reason for them."*

---

### §9.7 · THE CENSUSES

| census | must read | catches |
|---|---|---|
| **document absent ⇒ identical** | no document ⇒ WORLD hash byte-identical to pre-§8 | the editor leaking into plain generation |
| **engine ignorance** | source scan: **0** imports of `authorship/**` from the engine | ⛔ the headless boundary breaking |
| **verb completeness** | every registered verb declares all **five** fields | an unregisterable verb slipping in |
| **class boundary** | ⛔ **0 Class-A verbs with a non-empty WORLD cone** | *cosmetic silently promoting to generative* |
| **cone honesty** | declared cone ⊇ measured blast radius, every verb | ⭐ a "local" edit that moves half the town |
| **undo fidelity** | undo ⇒ `MapDocument.contentHash` **byte-identical**; redo likewise | the §8.11 contract |
| **RESOLVE is one command** | history gains **exactly one** entry | ⛔ the hazard that makes undo useless |
| **RESOLVE idempotent** | twice ⇒ no change | a fill that drifts |
| **RESOLVE locality** | +1 authored body ⇒ only that cone re-derives | a full redraw wearing a button |
| **RESOLVE never edits authorship** | authored geometry byte-identical after | the button "fixing" the user |
| **legality parity** | ⭐ authored bodies pass the **same** predicates as derived ones | ⛔ two standards, and meaningless censuses |
| **law-exempt is reported** | overrides counted separately, never folded into 0 | a silent exemption |
| **provenance totality** | every entity has exactly one rung; **0** unassigned | an object with no story |
| **coverage arithmetic** | rung counts sum to the body count | a ledger that does not balance |
| **AI gate** | **0** coordinates accepted; **0** out-of-vocab accepted | the clerk becoming a writer |
| **conflict surfacing** | every canonical/authored collision produces a record; **0** silent resolutions | ⛔ the simulator becoming a liar |
| **pinned isolation** | PINNED ⇒ map hash frozen **and** dossier/sim hashes still moving | a pin that quietly pauses the world |
| **replay** | fixture documents at every schema version replay to their recorded hash | ⛔ a mutated verb rewriting saved maps |

---

### §9.8 · THE WAVE SHEET — A0…A5

| wave | contents | EXIT CRITERIA |
|---|---|---|
| **A0** · the ledger | ⭐⭐ provenance rungs · `ProvenanceIndex` · `DivergenceLedger` · coverage readout | every entity carries a rung; counts balance; ⭐ **coverage renders on a plate**; document-absent ⇒ byte-identical |
| **A1** · document + undo | `MapDocument`, `contentHash`, commands, checkpoints, undo/redo | undo/redo byte-identical on every fixture; replay from checkpoint matches; **document-scope boundary enforced in UI** |
| **A2** · selection (Class B) | reroll · pick from enumerated candidates | ⭐ **illegal output unreachable by construction**; cone honesty holds; every pick reversible |
| **A3** · designation (Class C) | condition/category/institution/disposition, **with dossier write-back** | dossier and map agree afterwards; current condition may move only evidence-supported occupancy/maintenance signals. Street history never rewrites, and material composition changes only through a typed repair/replacement operation under a promoted `AMP-1` law |
| **A4** · geometry + RESOLVE (Class D + META) | the editor running the generator's predicates; refuse-with-reason; RESOLVE FILL + RECONCILE; PINNED | legality parity; RESOLVE one-command/idempotent/local; ratio inference offered; pinned isolation proved |
| **A5** · event proposals + AI gate | `PROPOSE_EVENT`; core-operation adapter; affordance query; arrival gate | ⭐ an accepted core disaster yields a DERIVED crater; **0** coordinates/out-of-vocab accepted; proposal batch undoable, accepted lived history outside document undo |

⛔ **A2 AND LATER ARE PARKED UNTIL S9's FRONTAGE LINE EXISTS.** ⭐ **A0 IS NOT** — the provenance ladder is cheap now and unaffordable to retrofit, because **every object minted before it exists has no rung and can never truthfully be given one.**

---

### §9.9 · PERFORMANCE

```
⭐ THE ONLY BUDGET THAT MATTERS FOR AN EDITOR IS THE FEEL OF ONE EDIT.
   Class A / B / META      near-instant — no WORLD re-derive at all
   one body, Class D       the local cone only
   one district, Class C   that district's fabric
   RESOLVE                 ⚠ a full generation — SHOW IT, and give it
                             the plan (§9.1's ResolvePlan) as a dry run
                             BEFORE it runs
   unpin                   a full re-derive, and the DIFF is the payoff

⭐⭐ EVERY VERB REPORTS ITS MEASURED BLAST RADIUS BESIDE ITS DECLARED CONE:
       B_edit = invalidated artifacts / total artifacts
   ⛔ A verb whose measured radius exceeds its declaration is a DEFECT.
```

⚠ **THE EDITOR INHERITS §220's OPEN GATE AND MUST NOT BE MEASURED SEPARATELY FROM IT** — an edit that feels instant on a village and stalls on a metropolis has not been measured.

---

### §9.10 · WHAT IS EXPLICITLY NOT BUILT

| refused | why |
|---|---|
| freehand drawing · brushes · fill buckets · layer stacks · pixel painting | ⛔ **§8.3 — that is Inkarnate's ground and they are better at it.** Our verbs are world facts |
| a branching undo tree | linear history; the merge semantics are a product of their own |
| undoing a clock advance through the map | ⛔ **document-scoped undo**; time has its own machinery |
| AI-emitted geometry, coordinates, polygons or transforms | ⛔ THE PROMISE, determinism, every census |
| coercing an out-of-vocabulary AI argument to the "closest match" | ⛔ silent coercion is how a clerk becomes a writer |
| exempting authored geometry from the generator's laws | ⛔ two standards ⇒ every census means nothing. The **override** exists and is marked, forever |
| a "true to dossier" mode switch | ⭐ §8.0 — provenance is per-object and measured; a switch is the wrong shape |
| a representation ratio that drifts over time | ⛔ §8.8 — it would corrupt year-A/year-B comparison, the most valuable thing the product does |
| PINNED pausing the simulation | ⭐ only the drawing holds |
| silently resolving an authored/canonical conflict | ⛔⛔ **that is how a simulator becomes a liar** |

---

### ⟦FOLD §286⟧ §9.11 · ⭐⭐ THE ENTITLEMENT SEAM — the map is free, changing it is paid

> **OWNER RULING (2026-08-19): the map generated with a settlement is FREE on anonymous and free accounts. EDITING IT IN ANY WAY IS PAID.**

⭐⭐⭐ **AND THE ARCHITECTURE ALREADY HAS EXACTLY THE RIGHT SHAPE FOR IT, BY ACCIDENT OF A RULE WRITTEN FOR ANOTHER REASON.** §9.2's import law says `authorship/**` may import the engine and **the engine may never import `authorship/**`**. So:

```
⭐⭐ THE ENTITLEMENT GATE SITS AT THE COMMAND-DISPATCH DOOR
   (authorship/apply.js), AND THE ENGINE LITERALLY CANNOT KNOW A
   TIER EXISTS — it holds no reference to the module that would tell it.
```

⛔⛔ **THAT IS THE STANDING LAW HONOURED BY CONSTRUCTION RATHER THAN BY DISCIPLINE: *"PREMIUM ISOLATION — TIER NEVER TOUCHES GENERATION."*** ⭐ *A free map and a paid map are byte-identical for the same seed and dossier. The tier does not gate quality, resolution, size, watermark or content — it gates only the verbs.*

#### THE SIXTH DECLARED FIELD

**§9.3's registry gains one field. A verb declaring five is no longer registrable; it must declare six.**

```
args · legality · inverse · cone · rung · ⭐ ENTITLEMENT
```

#### THE DISPOSITION, CLASS BY CLASS

| | anon | free acct | paid | why |
|---|:---:|:---:|:---:|---|
| **generate a settlement and its map** | ⭐ ● | ● | ● | the whole differentiator is visible for nothing |
| ⭐⭐ **export — SCREEN PNG** | ⭐ ● | ● | ● | ⭐⭐ **OWNER-RULED (2026-08-19). The shareable plate IS the marketing** — see the export line below |
| **export — PRINT PDF · SVG** | ⛔ ○ | ⛔ ○ | ● | the print-quality and **vector** artifact is what premium sells |
| ⭐ **"why is this here?"** — the explanation | ⭐ ● | ● | ● | ⛔ **never paywalled — it is the one thing no competitor can answer** |
| **the coverage readout** | ● | ● | ● | reads 100% on an unedited map; advertises the editor and the honesty at once |
| **switch lens / style** | ● | ● | ● | a *view*, costs nothing, sells the product |
| **follow the live season** (campaign clock) | ● | ● | ● | derivation, not editing |
| ⭐⭐ **whole-map reroll** (`SET_LAYOUT_VARIANT`) | ⛔ ○ | ⭐ ● | ● | ⭐⭐ **THE ACCOUNT-CREATION RUNG — owner-ruled, and see below** |
| **pin a season** | ○ | ○ | ● | choosing a state is authoring |
| **pins · annotations · legend prefs · bespoke styles** | ○ | ○ | ● | putting your own content on the page |
| **Class B — selection** (reroll one body, pick a roof) | ○ | ○ | ● | editing |
| **Class C — designation** (make this quarter poor) | ○ | ○ | ● | ⭐ and it writes to the dossier — doubly premium |
| **Class D — geometry** (place · move · remove) | ○ | ○ | ● | editing |
| **META** — RESOLVE · PIN/UNPIN · ratio · promote/demote | ○ | ○ | ● | editing |
| ⚠ **Class E proposal — `PROPOSE_EVENT`** | ○ | ○ | ● | ⚠ **commit authority belongs to the CAMPAIGN/domain operation, not the map editor** |

#### ⭐⭐⭐ THE EXPORT LINE — RULED 2026-08-19: SCREEN FREE, PRINT PAID

⚠ **SUPERSEDED FACTUAL PREMISE (retained only to explain the 2026-08-19 ruling):** the review
initially asserted that the dossier PDF had never contained a map. Live-source inspection disproved
that assertion: `SettlementPDF` already renders the legacy `TownMapPlate`. The format entitlement
below remains the owner-ratified rule for the future canonical plate, but it is **not** justified by
the false claim that map export was wholly new. The live-source correction after the census table is
binding.

> ⭐⭐⭐ **THE RULING: A SCREEN-RESOLUTION PNG IS FREE AT EVERY TIER, INCLUDING ANONYMOUS. THE PRINT-QUALITY PDF AND THE VECTOR SVG ARE PAID.**

```
FREE, EVERY TIER      one raster plate, screen resolution
                      ⛔ NO WATERMARK · NO CROPPING · NO MISSING LAYERS
                      ⭐ FULL CONTENT — the fabric, the walls, the fossils,
                        the countryside, the chrome, and the TRUE LABELS
                      ⭐ THE CARTOUCHE TRAVELS WITH IT: real names, the
                        declared derivation, the scale bar. The branding
                        and the differentiator are the same object.

PAID                  PDF at print resolution · SVG (scalable, editable,
                      semantic group ids, layer groups)
```

⭐⭐ **WHY THIS IS THE RIGHT LINE AND NOT A COMPROMISE: IT IS A RESOLUTION LINE, NOT A CONTENT LINE.** ⛔ **The free plate is not a lesser map — it is the same map, sampled for a screen.** That keeps the standing law intact by construction: *tier never touches generation*, and now **tier does not touch the drawing either — only the sample rate.** ⭐ *Every free plate that leaves the site is a complete, honest, un-defaced advertisement carrying our true labels, which is exactly what the corpus's own reference art cannot do.*

⚠⚠ **THE ONE NUMBER THIS RULING OWES, AND IT IS COMMERCIAL RATHER THAN TECHNICAL: THE RESOLUTION CEILING MUST BE PINNED, BECAUSE A PNG LARGE ENOUGH *IS* A PRINT ARTIFACT.** ⛔ Leave it unpinned and the line dissolves the first time someone asks for "a slightly bigger one." ⚠ **And a second use to price deliberately: a raster plate at VTT-usable resolution is a VTT battlemap backdrop** — which may be a welcome funnel or a given-away use case, and the ceiling decides which. **Raised for the owner; not set here.**

#### THE CENSUSES THIS LINE OWES

| census | must read | catches |
|---|---|---|
| **same map, different sample** | free PNG and paid PDF derive from **one** PROJECTION at one frozen viewport contract | ⛔ two renderers drifting apart |
| **no content gate** | free plate carries every layer, every label, the cartouche; **0** suppressed features | a crippled free tier |
| **no watermark** | source scan: **0** watermark or overlay paths | the thing this ruling exists to forbid |
| **ceiling pinned** | the raster ceiling is a named constant with a contract test | ⛔ a line that dissolves on request |
| **DM truth still gated** | free/anonymous plates carry **no** covert institution and no DM lens | the existing reveal-seam law, unchanged |

⭐ **LIVE-SOURCE CORRECTION:** the current build already imports, builds and renders `TownMapPlate`
inside `SettlementPDF`; whether the map joins the dossier PDF is therefore not an open architecture
question. The future canonical scene must replace that legacy plate through the shared projection
adapter, and §9.11 governs entitlement/output format without adding a second PDF map generator.

#### ⭐⭐ THE GATES THAT ALREADY EXIST — MEASURED, not assumed (`src/config/tierFacts.js`)

⚠⚠ **THIS SECTION WAS DRAFTED WITHOUT READING THE LANDED TIER CONFIG AND MADE TWO WRONG ASSUMPTIONS. BOTH ARE CORRECTED HERE.**

| | anon | free (wanderer) | premium (cartographer) |
|---|---|---|---|
| **max settlement size** | ⛔ **`town`** (`ANON_MAX_TIER`) | Metropolis — every size | Metropolis |
| **saves** | ⛔ **0** — no account, no saves | ⭐ **3** (`FREE_SAVE_LIMIT`) | unlimited |
| **PDF export** | per-dossier **$2.99** | per-dossier **$2.99** | ⭐ unlimited, free |
| **custom content** | ○ | ○ | ● |
| **generations per day by IP** | ⛔⛔ **NO SUCH GATE EXISTS** — searched `src/`, `api/`, `supabase/`; the only rate limits found are auth-recovery and edge-function limits (checkout, generate-narrative), none on settlement generation | — | — |

⭐⭐ **CORRECTION 1 — THE COST CENTRE THIS SECTION FLAGGED IS MUCH SMALLER THAN IT CLAIMED, AND THE REASON IS A GATE THAT ALREADY SHIPS.** ⛔ **An anonymous user is capped at TOWN and cannot generate a city or a metropolis at all.** The expensive case — the metropolis at ~1 s of compute and 8,226 primitives — **is not anonymously reachable.** *The unbounded-anonymous-compute worry was largely answered before it was raised.*

⚠ **CORRECTION 2 — "3" IS THE FREE TIER'S SAVE CAP, NOT AN ANONYMOUS GENERATION LIMIT.** `FREE_SAVE_LIMIT = 3` governs how many settlements a free account may *keep*. It says nothing about how many may be *generated*, by anyone.

⭐ **AND ONE INTERACTION WORTH SEEING RATHER THAN DISCOVERING: `ANON_MAX_TIER = 'town'` MEANS AN ANONYMOUS VISITOR CAN NEVER SEE A FLOATING LAND.** §6.7.1's gate requires a high-magic settlement of city grade or above, and anonymous stops at town. ⛔ **The most spectacular thing the map does is invisible in the top of the funnel.** *Recorded as a marketing fact for the owner, not decided here — the honest options are a curated showcase, a gallery plate, or nothing.*

#### ⭐⭐⭐ THE THREE-RUNG LADDER — owner-ruled, and it is better than the two-rung version this section first proposed

> **OWNER RULING (2026-08-19): ⛔ NO REROLLS FOR ANONYMOUS.**

⚠ **THIS SECTION FIRST ARGUED THAT REROLL SHOULD SIMPLY BE FREE, ON THE GROUND THAT A ONE-MAP FREE TIER LOSES TO WATABOU AT FIRST CONTACT. THE RULING IS BETTER AND THE ARGUMENT WAS TOO COARSE — it treated "free" as one thing when it is two.**

```
⭐⭐ THE LADDER, AND EVERY RUNG HAS AN HONEST, NON-CRIPPLING REASON TO CLIMB

  ANONYMOUS     one complete map. Uncrippled, unwatermarked, full
                CONTENT at the named screen raster ceiling.  ⛔ NO REROLL.
  FREE ACCOUNT  unlimited generation AND reroll.
                ⭐ THE ONLY THING IT COSTS IS AN ACCOUNT.
  PAID          editing — every verb in §9.3.
```

⭐⭐⭐ **WHY THE RULING IS RIGHT, AND IT IS THREE THINGS AT ONCE:**

**(1) REROLL IS THE BEST ACCOUNT-CREATION INCENTIVE THE PRODUCT HAS.** The user has just seen a map they like and immediately wants to see another. **That is the single lowest-friction conversion moment in the whole funnel, and it is POSITIVE** — nothing is taken away, more is offered. *A signup prompt that arrives at the exact moment of desire converts; one that blocks the first look does not.*

**(2) IT SOLVES THE COST CENTRE THIS SECTION RAISED, AND SOLVES IT AS A FEATURE RATHER THAN A THROTTLE.** Unlimited anonymous reroll was precisely the unbounded-compute case. ⭐ **The reroll gate IS the rate limit** — and *"make a free account"* is a far better thing to show a user than *"you have been rate limited."*

**(3) IT STILL MATCHES THE COMPETITOR AT FIRST CONTACT.** An anonymous visitor gets a complete, exportable plate for nothing. ⚠ *The comparison is not "one map versus infinite" — it is "one map, then ten seconds for infinite" versus "infinite", which is how essentially every freemium generator on the market already works.*

⭐ **AND THE UI RULE THAT FOLLOWS: DO NOT HIDE THE REROLL BUTTON FROM ANONYMOUS USERS.** Show it, and let the click *be* the prompt — *"want a different one? A free account takes ten seconds."* ⛔ **A hidden button wastes the conversion moment it was created to produce.**

⚠⚠ **THE COST QUESTION THE RULING DOES NOT FULLY CLOSE, RAISED RATHER THAN ASSUMED: IS AN ANONYMOUS USER LIMITED TO ONE *SETTLEMENT*, OR ONE *REROLL PER SETTLEMENT*?** Generating a **different** settlement costs the same compute as a reroll. ⭐ The friction differential does most of the work — a reroll is one click, a new settlement means the wizard again — **but if anonymous generation itself is unbounded, the bill is unbounded too.** *A per-session or per-IP generation cap is the normal answer and should be a deliberate decision.*

#### ⚠ THE SECOND WRINKLE — AN EVENT PROPOSAL IS NOT AN ACCEPTED WORLD EVENT

⭐ Proposing that a fire happened in 1462 may begin on the map; accepting it is a **simulation**
operation whose map consequence is derived. It belongs to the authority/tier that owns the campaign
and world clock, **not** the map editor's entitlement, and commits through the core operation door
(§10.13). ⛔ *Selling the accepted event as a map feature would put one capability behind two doors.*

#### ⭐⭐ WHAT THE FREE TIER MUST STILL SHOW, OR NOBODY CONVERTS

```
⭐ THE DIVERGENCE LEDGER AND THE COVERAGE READOUT RENDER ON THE FREE MAP.
     "847 bodies · 100% derived · causal coverage 100%"
   It advertises the editor's existence AND the product's honesty in one
   line, and on a free map it always reads 100% — which is itself the
   strongest possible statement of what the engine did unaided.

⭐ "WHY IS THIS HERE?" IS FREE.
   The explanation is the differentiator. Paywalling it would hide the
   one thing no competitor can answer.
```

#### ⭐ WHEN A SUBSCRIPTION LAPSES

> **The document persists and becomes READ-ONLY. The map still renders exactly as saved.**

⭐ **Architecturally this is free, because the document is data and the renderer does not consult a tier** — a lapsed account is simply an account whose commands are all refused at the door. ⛔ **The user never loses their work; they lose the ability to change it.** *Anything else would make the paid tier a hostage situation rather than a purchase.*

#### THE CENSUSES

| census | must read | catches |
|---|---|---|
| **tier never reaches generation** | source scan: **0** entitlement reads inside the engine | ⛔ premium isolation breaking |
| **free ≡ paid output** | same seed + dossier ⇒ **byte-identical** map at every tier | a crippled free tier |
| **verb entitlement totality** | every registered verb declares an entitlement; **0** unassigned | a verb slipping through unpriced |
| **free surface has no DM truth** | anonymous/free plates carry no covert institution, no DM-lens layer | ⛔ the existing reveal-seam law |
| **lapsed = read-only** | commands refused at the door; **the rendered map is unchanged** | ⛔ work held hostage |

⭐ **THE COMMERCIAL NOTE, NOW CORRECTED BY MEASUREMENT: §220's PERFORMANCE GATE STILL GAINS A COMMERCIAL DIMENSION, BUT A SMALLER ONE THAN THIS SECTION FIRST CLAIMED.** ⛔ Anonymous is capped at **town**, so the metropolis case is not anonymously reachable and the free tier's worst case is a town-scale generation. ⚠ **What remains genuinely unbounded is the COUNT** — no IP or session cap on generation exists anywhere in the tree. ⭐ *The reroll gate now bounds the one-click path; a per-session cap on NEW settlements is the remaining deliberate decision, and it is a much smaller one than it looked.*

---

## ⟦FOLD §287⟧ §10 · THE COHESION RECONCILIATION — THE DIMENSIONAL MAP, THE WORLD ENGINE AND AUTHORSHIP SHARE ONE CAUSAL SPINE

### ⟦FOLD §287⟧ ARCHITECTED 2026-08-20 AFTER A WHOLE-SYSTEM REVIEW. THIS SECTION CORRECTS §§6–9 WHERE THEY CONFLICT; IT DOES NOT AUTHORISE IMPLEMENTATION BY ITSELF.

**THE REVIEW READ THE WHOLE CURRENT MAP SPECIFICATION, THE 313-PLATE CORPUS AND ALL OF ITS MEASUREMENT/RECEIPT MACHINERY, THE LIVE APPLICATION'S MAP/PERSISTENCE/EVENT/SPATIAL-ENGINE SEAMS, THE W0–W3 SANDBOX, THE FOUR HISTORICAL RESEARCH REPORTS, THE OLDER MAP CONSTITUTIONS, AND THE EUROPEAN HISTORIC TOWNS ATLAS TRADITION THROUGH ITS OFFICIAL PROGRAMS, METHODS, ESSAYS, LEGENDS, PHASE MAPS AND REPRESENTATIVE TOWN SHEETS.** The conclusion is not that the architecture should be replaced. Its center is right: **one causal world, one strict-plan map, one leaf at a time, canonical massing, typed authorship and no renderer-authored facts.** The defects are boundary defects — a few types currently let WORLD, TEMPORAL, PROJECTION, EVIDENCE and DOCUMENT authority leak into one another.

> ⭐⭐⭐ **THE BINDING RECONCILIATION:**
>
> `DOMAIN STATE_t → CANONICAL SPATIAL ARTIFACT_t → SPATIAL EFFECT RECEIPT_t → DOMAIN STATE_t+1`
>
> `CANONICAL SPATIAL ARTIFACT_t → {ONE-LEAF DIMENSIONAL SCENE, ALL-ACTIVE-LEAF SPATIAL OCCLUSION INDEX}; BOTH + TEMPORAL OBSERVATION_t + VIEW PROFILE → VIEW OCCLUSION SCENE → PER-LIGHT ILLUMINATION → ADDRESSABLE DRAW LIST → {HIT REGIONS, RASTER, VECTOR}`
>
> `USER / AI PROPOSAL → DECLARED COMMAND OR CORE DOMAIN OPERATION → RECEIPT → THE SAME PIPELINE`
>
> **No arrow points backward in one pass. No projection value enters world truth. No document command bypasses the core operation door. No second map exists.**

### §10.0 · THE AUTHORITY ORDER — what wins when two documents disagree

1. **THE PROMISE, the simulation constitutions and the live domain operation law** own causal truth, dated history, authority and durability.
2. **This specification, including this reconciliation,** owns the settlement map's generation, dimensional, projection and authorship contracts. §10 is a corrective overlay over §§6–9; later builders must read both, and §10 wins on a direct conflict.
3. **Registered primary/scholarly historical evidence** owns bounded claims about real settlement form. European Historic Towns Atlas source maps, archaeological layers, gazetteers and scholarly reconstructions remain distinct evidence roles; no one layer is silently promoted to medieval truth. §10.20 owns the evidence contract.
4. **The 313-plate corpus** owns visual-register and hypothesis evidence only. It may calibrate restraint, line, tone and composition. It may suggest a mechanism to investigate. It may not establish history, height, causality, economics, prevalence or product authority.
5. **The four historical research reports** are background and mechanism studies. Their surviving mechanisms are folded below. Their tilted cameras, dual map profiles, heavyweight glare/GI/media implementations and global allocation are not revived. §288 separately permits deterministic analytic perceptual results without adopting those methods.
6. `DESIGN_SETTLEMENT_MAP.md`, `THE_MAP_SUITE_CONSTITUTION.md`, `THE_ARCHITECTURE_KERNEL_3D.md` and the map paragraph in `VISION_IDEALIZED_FINAL_PRODUCT.md` are historical at their conflicting seams; §10.17 states exactly what survives.

⛔ **NO IMPLEMENTER MAY RESOLVE A CONFLICT BY QUIETLY PICKING THE OLDER FILE.** A source-conformance gate (§10.14) makes this machine-visible.

### §10.1 · FOUR ARTIFACT DOMAINS, FOUR DIGESTS — `WORLD` was being asked to mean too much

The existing three digest names remain public. Their meanings are narrowed, not renumbered, and one missing domain is inserted between WORLD and PROJECTION:

| domain | authoritative contents | digest moves when | explicitly excluded |
|---|---|---|---|
| **WORLD / SPATIAL** | durable, ordered, quantized identities, topology, solids, support surfaces, material/condition state and dated construction/removal | a canonical spatial fact changes under a declared law/event | live season, occasion, selected leaf, camera/light, ink, document UI |
| **OBSERVATION** | campaign time, live seasonal/phenological state, active light state, current conditions and other time-indexed reads used for this survey | the observed time/state changes | durable geometry; paint |
| **PROJECTION** | selected leaf, visibility fragments, per-source illumination, addressable semantic DrawOps and chrome parameters | what this plate draws changes | pixels; hidden world bodies are still WORLD |
| **RASTER** | pixels under a fixed renderer/version/size | a reader would see different pixels | semantic authority |

`WORLD` in the existing harness remains an alias for the **durable spatial digest**, not a hash of the entire living campaign. Therefore §6.11's statement becomes precise: **changing only the observed season never moves the SPATIAL digest; it must move OBSERVATION and may move PROJECTION/RASTER.** A dated fire, demolition, ascension or reconstruction moves SPATIAL. A light-profile switch never does.

```ts
interface ArtifactIdentity {
  artifactId: ArtifactId;                  // identity, not content
  lawVersion: LawVersion;
  spatialHash: ContentHash;
  observationHash?: ContentHash;
  projectionHash?: ContentHash;
  rasterHash?: ContentHash;
}
```

⛔ **No aggregate digest is accepted as proof of a narrower invariant.** The gate for "the wall did not move" compares the circuit bytes; the gate for "season did not rewrite the world" compares `spatialHash`; the gate for "the screen did change" compares DrawOps and raster separately.

### §10.2 · THE TEMPORAL RECEIPT SEAM — the map may become physics, but never in the pass that drew it

§6.7's floating land currently casts shade, S18 consumes that shade, and S18 can affect prosperity/siting that helped decide what the floating land carries. That is a same-pass causal cycle even if the module graph is acyclic.

The legal seam is the spatial engine's established two-phase pattern:

```ts
type SpatialEffectKind = keyof SpatialEffectPayloadByKind;
type AccessModeId = string & { readonly __accessModeId: unique symbol };
type CapacityMeasureId = string & { readonly __capacityMeasureId: unique symbol };
type AccessClassId = string & { readonly __accessClassId: unique symbol };
type ConnectionStateId = string & { readonly __connectionStateId: unique symbol };
type DisplacementReasonId = string & { readonly __displacementReasonId: unique symbol };

interface SpatialObservationUncertaintyQ {
  methodId: string;
  spatialResolutionQ: WorldQ;
  temporalResolutionQ: MeasureQ;
  horizontalErrorBoundQ: WorldQ;
  exposureErrorBoundQ: RatioQ;
  coverage:
    | { kind: 'MEASURED'; observedRegionRef: ArtifactHashRef;
        eligibleDenominatorRegionRef: ArtifactHashRef;
        containmentProofRef: ArtifactHashRef; computedCoverageQ: RatioQ }
    | { kind: 'NOT_APPLICABLE'; reason: 'NON_SPATIAL_OBSERVATION' };
  provenanceRef: ProvenanceRef;
}

interface SpatialEffectPayloadByKind {
  SHADE_EXPOSURE: {
    solarProfileRef: { artifactId: ArtifactId; contentHash: ContentHash };
    sampleWindowId: EntityId;
    exposedSamples: number;
    totalSamples: number;
    receiverAreaQ: AreaQ;
    uncertainty: SpatialObservationUncertaintyQ;
  };
  ACCESS:
    | { temporalMode: 'STATIC_POTENTIAL'; originId: EntityId; destinationId: EntityId;
        modeId: AccessModeId; traversable: boolean; routeCostQ: MeasureQ }
    | { temporalMode: 'SEASONAL_OBSERVATION'; originId: EntityId; destinationId: EntityId;
        modeId: AccessModeId; traversable: boolean; routeCostQ: MeasureQ;
        season: CalendarSeasonRef };
  CAPACITY: {
    capacityId: CapacityMeasureId;
    amountQ: MeasureQ;                      // unitId lives exactly once inside MeasureQ
  };
  BLOCKAGE:
    | { temporalMode: 'STATIC_POTENTIAL'; connectionId: EntityId; blocked: boolean;
        availableClearanceQ?: HeightQ }
    | { temporalMode: 'SEASONAL_OBSERVATION'; connectionId: EntityId; blocked: boolean;
        availableClearanceQ?: HeightQ; season: CalendarSeasonRef };
  FRONTAGE: {
    routeId: EntityId;
    frontageLengthQ: WorldQ;
    accessClassId: AccessClassId;
  };
  CONNECTION:
    | { temporalMode: 'STATIC_POTENTIAL'; connectionId: EntityId;
        stateId: ConnectionStateId }
    | { temporalMode: 'SEASONAL_OBSERVATION'; connectionId: EntityId;
        stateId: ConnectionStateId; season: CalendarSeasonRef };
  DISPLACEMENT: {
    fromSupportId: EntityId;
    toSupportId?: EntityId;
    displacedAreaQ: AreaQ;
    reasonId: DisplacementReasonId;
  };
}

interface SpatialEffectDependencyRef<R extends
    'SPATIAL' | 'OBSERVATION' | 'CALENDAR' | 'SOLAR_PROFILE' | 'LAW'> {
  role: R;
  artifactId: ArtifactId;
  contentHash: ContentHash;
}

interface SpatialEffectReceiptCommon<K extends SpatialEffectKind> {
  artifactKind: 'SPATIAL_EFFECT_RECEIPT';
  artifactId: ArtifactId;
  receiptId: EntityId;
  receiptSchemaVersion: number;
  sourceSpatialRef: ArtifactHashRef;
  authority: DerivationAuthorityRef;
  observedAt: TimeKey;
  effectiveAt: TimeKey;                    // strictly later for feedback
  kind: K;
  sourceIds: readonly [EntityId, ...EntityId[]];
  affectedIds: readonly [EntityId, ...EntityId[]];
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type ObservationConditionedSpatialEffectKind = 'ACCESS' | 'BLOCKAGE' | 'CONNECTION';
type StaticOnlySpatialEffectKind = Exclude<SpatialEffectKind,
  'SHADE_EXPOSURE' | ObservationConditionedSpatialEffectKind>;
type StaticObservedPayload<K extends ObservationConditionedSpatialEffectKind> =
  Extract<SpatialEffectPayloadByKind[K], { temporalMode: 'STATIC_POTENTIAL' }>;
type SeasonalObservedPayload<K extends ObservationConditionedSpatialEffectKind> =
  Extract<SpatialEffectPayloadByKind[K], { temporalMode: 'SEASONAL_OBSERVATION' }>;

type ShadeExposureReceipt = SpatialEffectReceiptCommon<'SHADE_EXPOSURE'> & {
  payload: Readonly<SpatialEffectPayloadByKind['SHADE_EXPOSURE']>;
  sourceObservationRef: ArtifactHashRef;
  orderedDependencies: readonly [
    SpatialEffectDependencyRef<'SPATIAL'>,
    SpatialEffectDependencyRef<'OBSERVATION'>,
    SpatialEffectDependencyRef<'SOLAR_PROFILE'>,
    SpatialEffectDependencyRef<'LAW'>
  ];
};

type StaticObservationConditionedReceipt<K extends ObservationConditionedSpatialEffectKind> =
  SpatialEffectReceiptCommon<K> & {
    payload: Readonly<StaticObservedPayload<K>>;
    sourceObservationRef?: never;
    orderedDependencies: readonly [SpatialEffectDependencyRef<'SPATIAL'>,
      SpatialEffectDependencyRef<'LAW'>];
  };

type SeasonalObservationConditionedReceipt<K extends ObservationConditionedSpatialEffectKind> =
  SpatialEffectReceiptCommon<K> & {
    payload: Readonly<SeasonalObservedPayload<K>>;
    sourceObservationRef: ArtifactHashRef;
    orderedDependencies: readonly [
      SpatialEffectDependencyRef<'SPATIAL'>,
      SpatialEffectDependencyRef<'OBSERVATION'>,
      SpatialEffectDependencyRef<'CALENDAR'>,
      SpatialEffectDependencyRef<'LAW'>
    ];
  };

type StaticOnlySpatialEffectReceipt<K extends StaticOnlySpatialEffectKind> =
  SpatialEffectReceiptCommon<K> & {
    payload: Readonly<SpatialEffectPayloadByKind[K]>;
    sourceObservationRef?: never;
    orderedDependencies: readonly [SpatialEffectDependencyRef<'SPATIAL'>,
      SpatialEffectDependencyRef<'LAW'>];
  };

type SpatialEffectReceipt = ShadeExposureReceipt
  | { [K in ObservationConditionedSpatialEffectKind]:
      StaticObservationConditionedReceipt<K> | SeasonalObservationConditionedReceipt<K>
    }[ObservationConditionedSpatialEffectKind]
  | { [K in StaticOnlySpatialEffectKind]: StaticOnlySpatialEffectReceipt<K>
    }[StaticOnlySpatialEffectKind];
```

The id vocabularies used inside each payload (`AccessModeId`, `CapacityMeasureId`, `UnitId`,
`AccessClassId`, `ConnectionStateId`, `DisplacementReasonId`) are closed, versioned domain
registries in the executable manifest. They are deliberately not strings invented by a map lane.
The discriminant and payload are one union: a `SHADE_EXPOSURE` receipt carrying a frontage field is
unrepresentable and a new receipt kind cannot land without its schema, consumer and migration.
The dependency roster is closed by receipt kind **and temporal branch**, with no duplicate or extra
roles. Every receipt's single `SPATIAL` dependency equals `sourceSpatialRef` at artifact ID/hash. A shade receipt is
invalid without the durable spatial hash, observation hash and exact `WorldSolarProfile` content
hash that produced it; its payload `solarProfileRef` must equal the single `SOLAR_PROFILE` ordered
dependency and its single `OBSERVATION` dependency must equal `sourceObservationRef`, both at
artifact ID and content hash. Static ACCESS/BLOCKAGE/CONNECTION receipts describe only durable
potential and use exactly `SPATIAL, LAW`; they may not encode season/current-condition effects.
Their `SEASONAL_OBSERVATION` branches require exactly `SPATIAL, OBSERVATION, CALENDAR, LAW`;
`sourceObservationRef` equals the observation dependency and `payload.season.calendarRef` equals
the calendar dependency. Other static receipts forbid `sourceObservationRef` and use exactly
`SPATIAL, LAW`. Adding another causal constraint requires a new discriminated receipt branch rather
than an extra role in a tuple. An `EntityId` alias or mismatch is a compile/census
failure. `observedAt` alone is not dependency identity. The receipt artifact hash covers its kind,
schema/law, exact ordered dependency refs, source refs, times, subjects, payload and provenance;
every `ArtifactHashRef` to a receipt resolves that exact kind and identity.
For shade and seasonal branches, `observedAt` must byte-equal the resolved source observation's
`observedAt`; for static branches it must equal `sourceSpatialRef.effectiveAt`. `effectiveAt` is
strictly later than every resolved source time. `sourceIds` and `affectedIds` are nonempty and the
effect census proves the measured/changed subject set equals those rosters exactly; a genuine
no-effect result uses a separately typed diagnostic, never an empty causal receipt. A fabricated
earlier timestamp, omitted subject or extra affected entity is a publication failure.

1. `state_t` derives and publishes `CanonicalSpatialArtifact_t`.
2. Spatial predicates measure it and emit immutable, idempotent receipts dated for `t+1` or a later declared boundary.
3. The core simulation operation applies those receipts while advancing the domain state.
4. The next spatial artifact derives from `state_t+1`.

**Initial generation is one-way.** A newly generated shade band does not re-site the fields that generated it. Historical replay obtains feedback only by replaying dated states/events in order. A solver that iterates until a town "looks settled" is refused: it erases causality, makes invalidation global and makes the seed promise dependent on convergence trivia.

### §10.3 · THE STAGE REPAIR — existence is not a roster, and a cartographic lamp is not S0 truth

The public S0–S23 ids remain immutable. Their internal ownership is corrected:

| stage seam | binding output |
|---|---|
| **S0** | dossier projection, identity/version/hash roots, and a `StrataExistencePlan` containing only strata licensed by already-held dated facts; **no `LeafRoster`, no `ProjectionLightProfile`** |
| **S11–S19** | bodies, solids, connections and losses are actually derived; missing strata remain representable as planned/absent, never as empty published leaves |
| **post-S19 / pre-S22** | `LeafRoster` is derived from published bodies/connections for the selected year; surface is mandatory, every other leaf proves non-emptiness |
| **S22** | selected leaf + observation + view/light profiles resolve shadow-free `DimensionalScene`; the final `LeafRoster` resolves the all-active-leaf `SpatialOcclusionIndex`; both feed `ViewOcclusionScene`, per-light illumination, DrawOps and hit regions |
| **S23** | `MapChrome` declares the selected leaf, observed date/season, scale, light convention and any approximation warning; it alone may derive the registration ghost |

```ts
type MapAudience = 'PUBLIC' | 'DM';

interface AudienceProjectionPolicyBase {
  artifactKind: 'AUDIENCE_POLICY';
  artifactId: ArtifactId;
  schemaVersion: number;
  policyVersion: number;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type AudienceProjectionPolicy =
  | (AudienceProjectionPolicyBase & {
      audience: 'PUBLIC';
      allowedLensGates: readonly ['PUBLIC'];
    })
  | (AudienceProjectionPolicyBase & {
      audience: 'DM';
      allowedLensGates: readonly ['PUBLIC', 'DM'];
    });

interface RegistrationGhostChrome {
  sourceSpatialRef: ArtifactHashRef;
  viewProfileRef: ArtifactHashRef;
  sourceSemanticIds: readonly EntityId[];        // registered water/circuit/spine only
  primitives: readonly ChromePrimitive[];
  selectable: false;
  hitTestable: false;
  projectionHash: ContentHash;
}

type ChromeStyleTokenId = string & { readonly __chromeStyleTokenId: unique symbol };
type ChromePrimitive = {
  primitiveId: ProjectionPrimitiveId;
  sourceSemanticId: EntityId;
  geometry:
    | { kind: 'POINT'; point: PointQ }
    | { kind: 'POLYLINE'; line: PolylineQ }
    | { kind: 'POLYGON'; polygon: PolygonQ };
  styleTokenId: ChromeStyleTokenId;
  selectable: false;
  hitTestable: false;
};

type MapChromeWarningCode =
  | 'LOCAL_DATUM_APPROXIMATE_OVER_RELIEF'
  | 'SHADOW_HEIGHT_INSTRUMENT_OMITTED'
  | 'WORLD_TIME_LIGHT_FELL_BACK_TO_FIXED_SURVEY'
  | 'LIGHT_PROBE_ELEVATION_CLAMPED'
  | 'SHADOW_READABILITY_CLAMPED'
  | 'UNRESOLVED_CUSTOM_CONTENT'
  | 'STRUCTURAL_ONLY'
  | 'PLANAR_V1';

interface MapChromeWarning {
  code: MapChromeWarningCode;
  relatedArtifactIds: readonly ArtifactId[];
}

interface AppliedLightMetadata {
  requestedMode: GlobalLightDerivationMode;
  appliedMode: GlobalLightDerivationMode;
  requestedAuthorityRef: ArtifactHashRef;
  appliedAuthorityRef: ArtifactHashRef;
  resolution:
    | { status: 'AS_REQUESTED' }
    | { status: 'WARNED_FIXED_SURVEY_FALLBACK'; fallbackConventionId: GlobalLightConventionId;
        missingAuthorityRef: ArtifactHashRef };
  emitter: CelestialEmitter;
  conventionId?: GlobalLightConventionId;
  sourceType: 'DIRECTIONAL_PARALLEL_GLOBAL';
  directionIndex: AngleIndex;
  elevationIndex: AngleIndex;
  shadowLawRef: ArtifactHashRef;
  perceptualModelRef: ArtifactHashRef;
  clampPolicyRef: ArtifactHashRef;
  probeElevationClamped: boolean;
  anyShadowClamped: boolean;
  lawVersion: LawVersion;
}

interface MapChrome {
  artifactKind: 'MAP_CHROME';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  sourceSpatialRef: ArtifactHashRef;
  leafIndex: LeafIndex;
  observationRef: ArtifactHashRef;
  viewProfileRef: ArtifactHashRef;
  lightProfileRef: ArtifactHashRef;
  appliedLight: AppliedLightMetadata;       // equality-pinned view of exact profile/results
  audiencePolicyRef: ArtifactHashRef;
  contentResolutionReportRef: ArtifactHashRef;
  warnings: readonly MapChromeWarning[];
  registrationGhost?: RegistrationGhostChrome;
  contentHash: ContentHash;
}
```

`DimensionalScene` remains exactly one leaf. `LeafRoster` is settlement-level metadata and is not
embedded as a multi-leaf render scene. S23 derives a registration ghost only after scene projection;
the ghost is excluded from spatial/scene hashes, solids, DrawOp semantic authority and hit regions.
Its inline, nonaddressable `ChromePrimitive` coordinates and closed style tokens are owned by
`MapChrome`, resolve every listed source semantic ID exactly once, and only its projection/chrome
hashes may change with view or registration treatment. Displayed date/season, scale and light
convention resolve from the three exact artifact references rather than copied profile fields.
`MapChrome.contentHash` covers leaf, ordered refs/hashes, audience policy, warnings and ghost. The S23
validator requires exact
identity/hash equality with the S22 observation, `ViewProjectionProfile` and
`ProjectionLightProfile`, and the ghost's spatial/view refs must equal the selected-time
`CanonicalSpatialArtifact` and MapChrome view ref. Chrome from one observation, spatial revision or
rig cannot be paired with another scene. PUBLIC chrome is valid only under a PUBLIC policy artifact
whose closed allowed-gate list is exactly `['PUBLIC']`.
`AppliedLightMetadata` preserves requested and applied modes/authorities separately. A world-time
fallback must serialize `WARNED_FIXED_SURVEY_FALLBACK` and
`WORLD_TIME_LIGHT_FELL_BACK_TO_FIXED_SURVEY`; a clamped probe or shadow emits its corresponding
typed warning. Export metadata can therefore prove what was requested, what actually rendered and
why they differed rather than silently presenting a fallback as world time.
`MapChrome.contentResolutionReportRef` equals the projection/root report. It contains
`UNRESOLVED_CUSTOM_CONTENT` exactly when that report has a nonempty unresolved roster, and the
warning's related artifact IDs are the report plus affected recipe snapshots. Export input repeats
the same report ref and refuses a mismatch, so screen and every export format expose the same
read-only unresolved state rather than dropping it.

### §10.4 · THE COORDINATE AND HASH ABI — canonical truth is integer truth

Serialization-time rounding is not enough. Any raw floating result that decides topology, legality, ordering, identity or a content hash is nondeterministic authority.

```ts
type WorldQ = number & { readonly __worldQ: unique symbol };   // safe integer
type HeightQ = number & { readonly __heightQ: unique symbol }; // safe integer
type AreaQ = number & { readonly __areaQ: unique symbol };     // safe integer square quantum
type MeasureValueQ = number & { readonly __measureValueQ: unique symbol }; // safe integer
type UnitId = string & { readonly __unitId: unique symbol };
type UnitDimensionId = 'LENGTH' | 'AREA' | 'VOLUME' | 'DURATION' | 'CAPACITY'
  | 'COST' | 'MASS' | 'OTHER_REGISTERED';
interface MeasureQ {
  valueQ: MeasureValueQ;
  unitId: UnitId;                          // closed registry; dimension participates in validation
}
type AngleIndex = number & { readonly __angleIndex: unique symbol };
type NormalIndex = number & { readonly __normalIndex: unique symbol };
type RatioQ = { numerator: number; denominator: number };      // reduced integers

interface UnitDefinition {
  unitId: UnitId;
  dimensionId: UnitDimensionId;
  toCanonicalUnit: RatioQ;
}

interface UnitRegistry {
  artifactKind: 'UNIT_REGISTRY';
  artifactId: ArtifactId;
  schemaVersion: number;
  units: readonly [UnitDefinition, ...UnitDefinition[]];
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface CoordinateAbi {
  artifactKind: 'COORDINATE_ABI';
  artifactId: ArtifactId;
  schemaVersion: number;
  abiVersion: number;
  worldUnitsPerMapUnit: number;
  geometryQuantum: RatioQ;
  heightQuantum: RatioQ;
  angleTableSize: number;
  axisX: 'EAST';
  axisY: 'NORTH';
  axisZ: 'UP';
  azimuthZero: 'PAGE_NORTH';
  azimuthPositive: 'CLOCKWISE';
  elevationZero: 'HORIZON';
  elevationPositive: 'UP';
  canonicalRingOrientation: 'CCW_OUTER_CW_HOLE';
  boundaryRule: 'CLOSED';
  hashEncoding: 'DOMAIN_SEPARATED_CANONICAL_BYTES';
  unitRegistryRef: ArtifactHashRef;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface GenerationLawManifest {
  artifactKind: 'LAW_MANIFEST';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiRef: ArtifactHashRef;
  unitRegistryRef: ArtifactHashRef;
  ruleRegistryRefs: readonly [ArtifactHashRef, ...ArtifactHashRef[]];
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}
```

The current six-decimal serializer is evidence for a compatible quantum, not permission to keep unquantized storage. D1 chooses and versions the exact quantum, proves safe-integer bounds over the largest map, and makes published geometry integer-valued. **The complete world convention is +X east, +Y north, +Z up; azimuth is clockwise from page/geographic north and elevation is positive above the horizon.** Roof pitch, face normals, light azimuth/elevation and solar samples use registered integer/LUT indices. **No `Math.sin`, `Math.cos`, locale ordering, ambient random source or engine-dependent polygon iteration may enter a canonical artifact.**

`MeasureQ` is never a bare branded number: value and registered unit are hashed together. Every
consumer declares the accepted unit dimension and conversion law, so lift budget, temporal
resolution, route cost, capacity and area/volume quantities cannot be compared merely because their
integer payloads happen to match.
`CoordinateAbi.unitRegistryRef` and `GenerationLawManifest.unitRegistryRef` are byte-equal and
resolve the one closed `UnitRegistry`. Every artifact containing `MeasureQ` inherits that exact
registry through its law/ABI dependencies; a unit ID is valid only by membership, and conversion is
the registered reduced ratio for its dimension. Same-spelled units from another registry or a
cross-dimension comparison fail before hashing or replay.

Every digest is domain-separated by artifact kind, schema/law/ABI versions and ordered dependency hashes. `EntityId`, variant, `ArtifactId`, content hash and document revision remain five different concepts.

### §10.5 · SUPPORT SURFACES AND SOLIDS — one `zBase` cannot truthfully stand on a hill

The earlier scalar `MassPart.zBase` proposal is superseded rather than retained as storage. `MassPartQ` owns a `SolidPartQ`; canonical vertical placement is relative to an explicit support:

```ts
interface SupportSurfaceRefBase {
  surfaceId: EntityId;
  supportSchemaVersion: number;
  localDatumCache: HeightQ;                 // equality-pinned query result, never authority
}

type MassingSupportOwnerRef =
  | { scope: 'CONTAINING_MASSING_PHASE'; bodyId: EntityId; partId: EntityId }
  | { scope: 'EXTERNAL_MASSING_PHASE'; massingRegistryRef: ArtifactHashRef;
      bodyId: EntityId; partId: EntityId };

type SupportSurfaceRef =
  | (SupportSurfaceRefBase & { kind: 'WORLD_DATUM'; datumRegistryRef: ArtifactHashRef;
      datumId: EntityId })
  | (SupportSurfaceRefBase & { kind: 'TERRAIN_FACE'; groundSurfaceRef: GroundSurfaceRef;
      patchId: EntityId })
  | (SupportSurfaceRefBase & { kind: 'FLOOR_PLANE' | 'ROOF_FACE' | 'WALL_TOP' | 'LAND_CAP';
      owner: MassingSupportOwnerRef; patchId: EntityId })
  | (SupportSurfaceRefBase & { kind: 'MAINTAINED_FREE_SPACE';
      owner: { scope: 'CONTAINING_MASSING_PHASE'; bodyId: EntityId };
      supportOperationRef: ArtifactHashRef });

interface SolidPartQ {
  partId: EntityId;                         // === owning MassPartQ.partId, or tree trunk part ID
  footprint: PolygonQ;
  support: SupportSurfaceRef;
  lowerOffset: HeightQ;
  upperEnvelope: readonly [SurfacePatchQ, ...SurfacePatchQ[]]; // every patch has stable patchId
  closedShell: SolidQ;
}
```

`SupportSurfaceRefBase.surfaceId` is a deterministic owner-qualified key, not a free alias. For a
terrain face it equals the registered key of
`(groundSurfaceRef.registryRef, surfaceId, surfaceContentHash, patchId)`; for a massing face it
equals the registered key of its scope/body/part/patch; datum and maintained-space branches use
their exact datum/operation owners. Endpoint records store the complete `SupportSurfaceRef`, not a
bare surface ID. Validators reject a surface key whose owner, patch or registry differs, and every
terrain support resolves the same `GroundSurfaceRegistry`, leaf and effective time as the selected
spatial artifact.

A child value may never store an `ArtifactHashRef` to the artifact that contains it. A mass part
supported by another part in its own `CanonicalArchitecturalMassingPhase` uses
`CONTAINING_MASSING_PHASE` and resolves body/part/patch under that phase's local registry during
validation; it cannot cite the phase's not-yet-computable hash. `EXTERNAL_MASSING_PHASE` is legal
only when the support owner is genuinely outside the containing artifact—for example a vegetation
phase anchored to an already-published roof—and must not resolve back to the containing massing
phase. Maintained free space is likewise phase-local plus a pre-existing support-operation ref.
Support ownership forms one acyclic DAG. A part cannot support itself or any ancestor on which it
already depends; phase-local owner refs resolve in topological order to an independent world datum,
terrain face or maintained-space operation. An EXTERNAL_MASSING_PHASE ref must point to an already
published, lifecycle-compatible artifact whose own support ancestry cannot reach the current phase.
Self-part, two-part, descendant and two-phase cycles, as well as self-hash, cross-time,
missing-patch and local/external-alias fixtures, fail publication.

`closedShell` is the sole coordinate authority. `footprint` and `upperEnvelope` are mandatory
quantized indices derived from that shell: the footprint must equal its registered support-plane
section/projection, every upper-envelope patch must be a named shell surface, and no patch may carry
independent coordinates. `RoofForm` refers only to those stable patch IDs and their derived
adjacency. The compiler and census reject any byte/equality, closure, owner or adjacency mismatch;
render, occlusion, shadow, legality and height queries all read the same shell surfaces.
For every body registry entry, part IDs are unique across the phase,
`part.parentBodyId === containingBody.bodyId`, and `part.solid.partId === part.partId`; the same part
cannot appear in two bodies. A `VegetationMass.trunk.partId` instead equals its
`canopyAnchor.trunkPartId` and is uniquely owned by that vegetation body. Parent/solid/registry
mismatch is rejected before hashing or indexing.

`WORLD_DATUM` supports imported/free-standing canonical solids whose registered datum is not a
terrain face. `MAINTAINED_FREE_SPACE` is the support for the owning floating-land body's cap/keel
parts and references its maintenance/lift lifecycle; it is never a magical synonym for no support.
`FloatingLandLifecycle` is discriminated state inside `MassBody`, not a second spatial body type.
External datum, terrain and massing support branches name the exact owner artifact ID+hash. A
`CONTAINING_MASSING_PHASE` branch instead resolves body/part/patch under its enclosing artifact and
is covered by that artifact's hash without self-reference; maintained free space likewise resolves
its phase-local body plus pre-existing work operation. `surfaceId` cannot resolve through two
owners. `localDatumCache` is recomputed from that owner and rejected on inequality; it can never
move a solid independently. Support settlement/effective time/law/ABI must equal the dependent
solid's registry.

The vertical ground law is therefore:

1. broad-phase overlap in XY and conservative Z bounds;
2. exact/adaptive intersection of the closed quantized solids over the intersecting region;
3. acceptance only when disjoint or licensed by one typed attachment whose required clearance/contact predicate passes.

`overlapXY ∧ overlapZ` remains a useful broad-phase census, not the final legality proof. Bridges, gatehouses, roof-mounted works, sloped terrain and cross-gables make interval-only truth insufficient.

The plate's `H · cot ε` measurement is exact only against a declared planar receiver. On relief, shadow endpoints come from receiver ray-casting; S23 must either state **local datum / approximate over relief** or omit the height-reading claim. The map never advertises a precision the terrain model cannot deliver.

### §10.6 · VEGETATION IS A MASS — the temporal register already assumed a type that §7 omitted

Foliage cannot become seasonal if a tree has no canonical body. Add the missing vertical truth before `resolveMapDress`:

```ts
interface CanopyVolumeQ {
  canopyId: EntityId;
  ownerBodyId: EntityId;
  closedShell: SolidQ;                     // sole canopy coordinate authority
  receiverSurfacePatchIds: readonly [EntityId, ...EntityId[]];
  bounds: Bounds3Q;                        // derived cache; exact shell equality is censused
  speciesClassId: VegetationSpeciesClassId;
  contentHash: ContentHash;
}

interface VegetationMass {
  bodyId: EntityId;
  kind: 'VEGETATION';
  leafIndex: LeafIndex;
  trunk: SolidPartQ;                        // opaque, durable
  canopy: CanopyVolumeQ;                    // durable envelope/species class
  canopyAnchor: {
    trunkPartId: EntityId;                  // === trunk.partId
    offsetXYQ: PointQ;                      // quantized vector in the trunk/support frame
    baseHeightAboveSupportQ: HeightQ;
  };
  phenologyClass: 'EVERGREEN' | 'DECIDUOUS' | 'DROUGHT_DECIDUOUS' | 'BARREN';
  constructionEpoch: EpochId;
  removalEpoch?: EpochId;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type VegetationSpeciesClassId = string & { readonly __vegetationSpeciesClassId: unique symbol };
type VegetationDensityLawId = string & { readonly __vegetationDensityLawId: unique symbol };
type VegetationRecipeId = string & { readonly __vegetationRecipeId: unique symbol };

type VegetationPopulationDisposition =
  | { status: 'KNOWN_COUNT'; instanceCount: number }
  | { status: 'KNOWN_DENSITY'; densityQ: RatioQ; roundingLawId: VegetationDensityLawId }
  | { status: 'UNKNOWN'; reason: 'NOT_OBSERVED' | 'OUTSIDE_COVERAGE' | 'NOT_APPLICABLE' };

type VegetationClassDisposition<T> =
  | { status: 'KNOWN'; value: T }
  | { status: 'UNKNOWN'; reason: 'NOT_OBSERVED' | 'OUTSIDE_COVERAGE' | 'NOT_APPLICABLE' };

type VegetationAggregateAuthority =
  | { kind: 'EXPLICIT_CANON'; sourceArtifactRef: { artifactId: ArtifactId; contentHash: ContentHash } }
  | { kind: 'RSLP_SUPPORTED'; sourceArtifactRef: { artifactId: ArtifactId; contentHash: ContentHash };
      evidenceRequirement: { domain: 'RURAL_LANDSCAPE'; scopePackId: string;
        scopePackManifestRef: ArtifactHashRef; protocolId: 'RSLP-1';
        protocolVersion: string; lawVersion: LawVersion } };

interface VegetationSourceRegionRef {
  regionId: EntityId;
  leafIndex: LeafIndex;
  sourceArtifactRef: ArtifactHashRef;
  geometryHash: ContentHash;               // exact quantized support-region geometry
}

interface CanonicalVegetationAggregate {
  artifactId: ArtifactId;
  sourceRegionRef: VegetationSourceRegionRef;
  effectiveAt: TimeKey;
  authority: VegetationAggregateAuthority;
  materializationLaw: 'SINGLE_FIELD_EXACT_REGION';
  recipeId: VegetationRecipeId;
  recipeVersion: number;
  lawVersion: LawVersion;
  population: VegetationPopulationDisposition;
  species: VegetationClassDisposition<VegetationSpeciesClassId>;
  phenology: VegetationClassDisposition<
    'EVERGREEN' | 'DECIDUOUS' | 'DROUGHT_DECIDUOUS' | 'BARREN'
  >;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface VegetationInstanceField {         // deterministic bulk vegetation; no saved instance ids
  artifactId: ArtifactId;
  fieldKey: DerivationKey;
  leafIndex: LeafIndex;
  effectiveAt: TimeKey;
  supportRegion: PolygonQ;
  supportRegionHash: ContentHash;
  sourceRegionRef: VegetationSourceRegionRef;
  sourceAggregateRef: { artifactId: ArtifactId; contentHash: ContentHash };
  recipeId: VegetationRecipeId;
  recipeVersion: number;
  lawVersion: LawVersion;
  instanceCount: number;
  speciesClassId: VegetationSpeciesClassId;
  phenologyClass: 'EVERGREEN' | 'DECIDUOUS' | 'DROUGHT_DECIDUOUS' | 'BARREN';
  aggregateBounds: Bounds3Q;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface CanonicalVegetationPhase {        // sole durable owner; spatial root and scenes hold refs/slices
  artifactKind: 'VEGETATION_PHASE';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  effectiveAt: TimeKey;
  recipeRegistryRef: ArtifactHashRef;
  masses: readonly VegetationMass[];
  aggregates: readonly CanonicalVegetationAggregate[];
  fields: readonly VegetationInstanceField[];
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type VegetationOpacityBandId = string & { readonly __vegetationOpacityBandId: unique symbol };

interface VegetationObservation {
  artifactKind: 'VEGETATION_OBSERVATION';
  artifactId: ArtifactId;
  schemaVersion: number;
  observedAt: TimeKey;
  sourceSpatialRef: ArtifactHashRef;
  subject: { kind: 'MASS'; bodyId: EntityId }
      | { kind: 'INSTANCE_FIELD'; fieldKey: DerivationKey };
  register: 'DORMANT' | 'BUD' | 'LEAF' | 'SENESCENT';
  opacityBandId: VegetationOpacityBandId;  // closed/versioned manifest registry
  opacityRegistryRef: ArtifactHashRef;
  source: 'LIVE_CLOCK' | 'PIN' | 'SEASONLESS';
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}
```

`VegetationMass` has no second support: all placement reads `trunk.support`. The canopy anchor is a
quantized transform in that same trunk/support frame, must name `trunk.partId`, and is validated
against the canopy shell. `CanopyVolumeQ.closedShell` is its sole coordinate authority;
receiver-patch IDs resolve shell surfaces and `bounds` is an equality-pinned cache. Canopy owner ID,
body ID and species class must match the containing mass. Support truth rejects any consumer or
serialized cache that gives trunk
and canopy different ground authority. A durable/selectable mass carries entity provenance and its
own content hash. A bulk field carries no instance entity IDs, but its source artifact ID/hash,
effective phase, recipe/law versions and provenance are mandatory and included in its content hash;
the source must resolve to one exact `CanonicalVegetationAggregate`. The field may materialise only
when that aggregate supplies a known count or a known density plus deterministic rounding law and
one known species class and one known phenology class; field count/phase/region/recipe/law/species/
phenology must equal the aggregate. The aggregate's exact source artifact, leaf, region ID and
geometry hash must resolve; the field uses that same leaf and exact support-region hash. Under the
current `SINGLE_FIELD_EXACT_REGION` law, exactly one field may materialize one aggregate, so its
count cannot be replicated into overlapping fields. Subdivision requires separately authored,
pairwise-disjoint aggregates whose regions exhaust their declared parent and whose counts/densities
conserve the parent under a registered allocation/rounding law. One aggregate is one population cohort. Mixed stands require
separate aggregates whose regions/populations are explicitly partitioned; a compiler may not choose
from an unordered class set or replicate one total across classes. An
RSLP-derived aggregate carries the exact supported RSLP binding; explicit canon uses the separate
authority branch. A coarse `RuralLandUnit.landUse` such as `WOOD` or `ORCHARD` may drive only a
clearly projection-only neutral texture. It cannot mint population, density, species, phenology or
a `VegetationInstanceField`; absent aggregate means no field plus a typed limitation.

`CanonicalVegetationPhase` is the sole durable registry for persistent masses, aggregate authority
and bulk fields at one settlement/effective time. IDs are unique within it; every field resolves one
aggregate in that same phase, and every scene/index member is a byte-equal slice/ref rather than a
second owner. Every aggregate/field `recipeId` and version resolves the exact
`recipeRegistryRef`; free or cross-version recipe IDs fail. Its settlement, effective time, law and ABI must equal the compiling spatial snapshot
or an explicit as-of resolution receipt; an off-time or cross-settlement phase refuses publication.

Trunks and canopies cast, receive and occlude under the same geometry service as architecture. Phenology moves OBSERVATION/PROJECTION, not the durable tree geometry. Beer–Lambert attenuation and botanical simulation remain gated; a closed opacity band is enough for the current plate.

Every vegetation observation is time-, provenance- and spatial-revision-bound. Its opacity ID must
resolve in the declared manifest registry/version; a free number or a subject absent from the exact
source spatial artifact is invalid.

**Persistent/notable vegetation and bulk vegetation are different contracts.** A tree that is named,
selected, authored, supports or blocks a connection, owns dated history, or appears in a causal
receipt is a `VegetationMass` with a stable entity id. Orchard, woodland and scrub populations may
compile as a `VegetationInstanceField`: the field recipe and aggregate are deterministic SPATIAL
truth, but individual instances are regenerated from `(fieldKey, instanceIndex)`, carry no entity
id, are not individually persisted or selectable, and cannot be named by a domain receipt. Promoting
one instance mints a real `VegetationMass` through a declared operation and subtracts it from the
field recipe; a renderer may never promote one opportunistically.

### §10.7 · OCCLUSION IS NOT SHADOW, AND `zMax` SORTING IS NOT VISIBILITY

A global painter sort over body `zMax` fails when roof planes cross in screen depth, a canopy overlaps a lower roof, a bridge passes over a road, or floating-land silhouettes overlap. Three artifacts are required; collapsing any two loses either hidden blockers, view order or light provenance.

```ts
interface SpatialAttenuationVolumeBase {
  artifactId: ArtifactId;
  schemaVersion: number;
  sourceSpatialRef: ArtifactHashRef;
  owner:
    | Extract<SpatialSurfaceSubjectRef, { kind: 'MASS_PART' }>
    | Extract<SpatialSurfaceSubjectRef, { kind: 'VEGETATION_CANOPY' }>
    | Extract<SpatialSurfaceSubjectRef, { kind: 'VEGETATION_FIELD' }>;
  leafIndex: LeafIndex;
  bounds: Bounds3Q;                         // derived/equality-pinned cache
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type SpatialAttenuationVolume =
  | (SpatialAttenuationVolumeBase & {
      geometryKind: 'CANONICAL_SHELL_REF';
      owner: Extract<SpatialSurfaceSubjectRef, { kind: 'MASS_PART' | 'VEGETATION_CANOPY' }>;
      sourceShellHash: ContentHash;
      closedVolume?: never;
      fieldDerivationKey?: never;
    })
  | (SpatialAttenuationVolumeBase & {
      geometryKind: 'FIELD_RECIPE_DERIVATION';
      owner: Extract<SpatialSurfaceSubjectRef, { kind: 'VEGETATION_FIELD' }>;
      fieldDerivationKey: DerivationKey;
      closedVolume: SolidQ;                 // sole derived aggregate-volume geometry
      sourceShellHash?: never;
    });

interface SpatialOcclusionIndex {           // all solids/attenuators; no camera and no shadow paint
  artifactKind: 'SPATIAL_OCCLUSION_INDEX';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  sourceSpatialRef: ArtifactHashRef;
  leafRosterRef: ArtifactHashRef;
  settlementId: EntityId;
  activeLeaves: readonly LeafIndex[];
  solidRefs: readonly {
    subject: SpatialSurfaceSubjectRef;
    leafIndex: LeafIndex;
    bounds: Bounds3Q;
  }[];
  attenuationVolumeRefs: readonly {
    subject: SpatialAttenuationSubjectRef;
    leafIndex: LeafIndex;
    bounds: Bounds3Q;
  }[];
  bounds: Bounds3Q;
  contentHash: ContentHash;
}

type FragmentId = string & { readonly __fragmentId: unique symbol };
type ProjectionPrimitiveId = string & { readonly __projectionPrimitiveId: unique symbol };
type HitRegionId = string & { readonly __hitRegionId: unique symbol };

interface ViewProjectionProfile {
  artifactKind: 'VIEW_PROFILE';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  kind: 'STRICT_PLAN_ORTHOGRAPHIC';
  northIndex: AngleIndex;
  scaleQ: RatioQ;
  viewport: Bounds2Q;
  contentHash: ContentHash;
}

interface SurfaceFragmentQ {
  fragmentId: FragmentId;                   // projection-local identity, never WORLD entity identity
  owner: SpatialSurfaceSubjectRef;
  sourcePatch: SpatialSurfacePatchRef;
  plane: SurfacePatchQ;
  screenPolygon: PolygonQ;
  semanticRole: 'ROOF' | 'CAP' | 'CANOPY' | 'WALL_TOP' | 'GROUND' | 'WATER';
}

interface VisibleFragmentQ {
  fragmentId: FragmentId;                  // resolves exactly one SurfaceFragmentQ above
  visiblePolygon: PolygonQ;                // clipped subset of that fragment's screenPolygon
  depthOrderIndex: number;
  occluderFragmentIds: readonly FragmentId[];
}

interface ViewOcclusionScene {              // one strict-plan camera's visible surface fragments
  artifactKind: 'VIEW_OCCLUSION_SCENE';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  sourceSpatialRef: ArtifactHashRef;
  sourceDimensionalSceneRef: ArtifactHashRef;
  sourceOcclusionIndexRef: ArtifactHashRef;
  observationRef: ArtifactHashRef;
  leafIndex: LeafIndex;
  viewProfileRef: ArtifactHashRef;
  audiencePolicyRef: ArtifactHashRef;
  fragments: readonly SurfaceFragmentQ[];
  visible: readonly VisibleFragmentQ[];
  order: readonly FragmentId[];
  contentHash: ContentHash;
}

type VisiblePrimitiveSemantic =
  | { kind: 'ENTITY'; semanticId: EntityId; addressable: true }
  | { kind: 'VEGETATION_FIELD'; fieldKey: DerivationKey;
      fieldRef: ArtifactHashRef; addressable: false };

interface VisibleSemanticPrimitiveBase {
  primitiveId: ProjectionPrimitiveId;
  semantic: VisiblePrimitiveSemantic;
}

type VisibleSemanticPrimitiveRef =
  | (VisibleSemanticPrimitiveBase & { kind: 'SURFACE';
      source: { kind: 'VISIBLE_FRAGMENT'; viewSceneRef: ArtifactHashRef;
        fragmentId: FragmentId; semanticOwnerMappingRef: ArtifactHashRef };
      screenGeometry: { kind: 'AREA'; polygon: PolygonQ } })
  | (VisibleSemanticPrimitiveBase & { kind: 'STROKE';
      semantic: { kind: 'ENTITY'; semanticId: EntityId; addressable: true };
      source: { kind: 'CANONICAL_STROKE'; sourceSpatialRef: ArtifactHashRef;
        semanticId: EntityId; geometryRef: ArtifactHashRef; projectionLawRef: ArtifactHashRef }
      screenGeometry: { kind: 'LINE'; polyline: PolylineQ; strokeWidthQ: WorldQ } })
  | (VisibleSemanticPrimitiveBase & { kind: 'STROKE';
      semantic: { kind: 'VEGETATION_FIELD'; fieldKey: DerivationKey;
        fieldRef: ArtifactHashRef; addressable: false };
      source: { kind: 'VEGETATION_FIELD_STROKE'; fieldKey: DerivationKey;
        fieldRef: ArtifactHashRef; geometryRef: ArtifactHashRef;
        projectionLawRef: ArtifactHashRef };
      screenGeometry: { kind: 'LINE'; polyline: PolylineQ; strokeWidthQ: WorldQ } })
  | (VisibleSemanticPrimitiveBase & { kind: 'CONNECTION';
      semantic: { kind: 'ENTITY'; semanticId: EntityId; addressable: true };
      source: { kind: 'CANONICAL_CONNECTION'; sourceSpatialRef: ArtifactHashRef;
        connectionId: EntityId; projectionLawRef: ArtifactHashRef };
      screenGeometry:
        | { kind: 'LINE'; polyline: PolylineQ; strokeWidthQ: WorldQ }
        | { kind: 'POINT'; point: PointQ; radiusQ: WorldQ } })
  | (VisibleSemanticPrimitiveBase & { kind: 'SYMBOL';
      semantic: { kind: 'ENTITY'; semanticId: EntityId; addressable: true };
      source: { kind: 'REGISTERED_SYMBOL'; anchorRef: ArtifactHashRef;
        contentRef: ArtifactHashRef; placementLawRef: ArtifactHashRef };
      screenGeometry: { kind: 'POINT'; point: PointQ; radiusQ: WorldQ } });

interface VisiblePrimitiveSetArtifactBase {
  artifactKind: 'VISIBLE_PRIMITIVE_SET';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  sourceSpatialRef: ArtifactHashRef;
  observationRef: ArtifactHashRef;
  leafIndex: LeafIndex;
  viewProfileRef: ArtifactHashRef;
  audiencePolicyRef: ArtifactHashRef;
  primitives: readonly VisibleSemanticPrimitiveRef[];
  contentHash: ContentHash;
}

type VisiblePrimitiveSetArtifact =
  | (VisiblePrimitiveSetArtifactBase & { representationLaw: 'PLANAR_V1';
      viewSceneRef?: never })
  | (VisiblePrimitiveSetArtifactBase & { representationLaw: 'DIMENSIONAL_V1';
      viewSceneRef: ArtifactHashRef });

interface HitRegionBase {
  hitRegionId: HitRegionId;                  // projection-local identity
  semanticId: EntityId;                     // the same authority used by visible DrawOps
  sourceVisiblePrimitiveIds: readonly [ProjectionPrimitiveId, ...ProjectionPrimitiveId[]];
  polygon: PolygonQ;
}

type HitRegionQ =
  | (HitRegionBase & { derivation: 'VISIBLE_UNION'; paddingQ?: never;
      derivationPolicyRef?: never })
  | (HitRegionBase & { derivation: 'DETERMINISTIC_PAD'; paddingQ: WorldQ;
      derivationPolicyRef: ArtifactHashRef })
  | (HitRegionBase & { derivation: 'DETERMINISTIC_AGGREGATE'; paddingQ?: never;
      derivationPolicyRef: ArtifactHashRef });

type DrawStyleTokenId = string & { readonly __drawStyleTokenId: unique symbol };
type DrawOpId = string & { readonly __drawOpId: unique symbol };

interface DrawOpBase {
  drawOpId: DrawOpId;
  styleTokenId: DrawStyleTokenId;
}

type DrawOp =
  | (DrawOpBase & { kind: 'FILL'; target: { kind: 'VISIBLE_SEMANTIC';
      primitiveId: ProjectionPrimitiveId; primitiveKind: 'SURFACE' }; contentRef?: never })
  | (DrawOpBase & { kind: 'STROKE'; target: { kind: 'VISIBLE_SEMANTIC';
      primitiveId: ProjectionPrimitiveId; primitiveKind: 'SURFACE'|'STROKE'|'CONNECTION' };
      contentRef?: never })
  | (DrawOpBase & { kind: 'SYMBOL'; target: { kind: 'VISIBLE_SEMANTIC';
      primitiveId: ProjectionPrimitiveId; primitiveKind: 'SYMBOL' };
      contentRef: ArtifactHashRef })
  | (DrawOpBase & { kind: 'TEXT'; target: { kind: 'VISIBLE_SEMANTIC';
      primitiveId: ProjectionPrimitiveId; primitiveKind: VisibleSemanticPrimitiveRef['kind'] };
      contentRef: ArtifactHashRef })
  | (DrawOpBase & { kind: 'EFFECT_TONE'; target: { kind: 'PROJECTION_EFFECT';
      effectPrimitiveId: ProjectionPrimitiveId }; contentRef?: never });

interface SemanticDrawListArtifactBase {
  artifactKind: 'DRAW_LIST';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  sourceSpatialRef: ArtifactHashRef;
  observationRef: ArtifactHashRef;
  leafIndex: LeafIndex;
  viewProfileRef: ArtifactHashRef;
  audiencePolicyRef: ArtifactHashRef;
  visiblePrimitiveSetRef: ArtifactHashRef;
  applicationCoverageContractRef: ArtifactHashRef;
  drawOps: readonly DrawOp[];
  contentHash: ContentHash;
}

type SemanticDrawListArtifact =
  | (SemanticDrawListArtifactBase & {
      representationLaw: 'PLANAR_V1';
      viewSceneRef?: never;
      lightProfileRef: ArtifactHashRef;
      illuminationRefs: readonly [];
      perceptualCompositeRef?: never;
      projectionEffectRef?: never;
    })
  | (SemanticDrawListArtifactBase & {
      representationLaw: 'DIMENSIONAL_V1';
      viewSceneRef: ArtifactHashRef;
      lightProfileRef: ArtifactHashRef;
      illuminationRefs: readonly [ArtifactHashRef, ...ArtifactHashRef[]];
      perceptualCompositeRef: ArtifactHashRef;
      projectionEffectRef: ArtifactHashRef;
    });

interface HitRegionSetArtifactBase {
  artifactKind: 'HIT_REGION_SET';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  sourceSpatialRef: ArtifactHashRef;
  observationRef: ArtifactHashRef;
  leafIndex: LeafIndex;
  viewProfileRef: ArtifactHashRef;
  visiblePrimitiveSetRef: ArtifactHashRef; // light-independent, never derived from effect/draw style
  audiencePolicyRef: ArtifactHashRef;
  regions: readonly HitRegionQ[];
  contentHash: ContentHash;
}

type HitRegionSetArtifact =
  | (HitRegionSetArtifactBase & { representationLaw: 'PLANAR_V1'; viewSceneRef?: never })
  | (HitRegionSetArtifactBase & { representationLaw: 'DIMENSIONAL_V1';
      viewSceneRef: ArtifactHashRef });
```

`SpatialOcclusionIndex` is settlement-level and built once from **all registered solid and
attenuation volumes on every active leaf**, including sky casters that can shadow the surface and
objects hidden from this view. It serves exact/adaptive solid and light queries but contains no
screen polygons and no shadow paint. One-leaf view occlusion filters that index through the selected
`DimensionalScene` and `ViewProjectionProfile`; the index itself does not weaken the one-map/one-leaf
law. The view service projects quantized surface patches, finds
overlapping screen regions, splits at plane-order crossings, clips hidden fragments and
topologically sorts the resulting strict-above DAG with stable ids only as the final tie-break. A
cycle after required splitting is a RED, not an invitation to arbitrary painter order.
Every solid index row resolves an exact part in its mass-body/vegetation registry and carries that
registry artifact ID/hash; no synthetic `solidId` or ambiguous body/part owner is accepted.
Attenuation volumes have one nonrecursive entity-or-field owner, while the volume itself may be used
as a `SpatialLightSubjectRef`. Every `volumeRef` resolves one hash-addressed
`SpatialAttenuationVolume`: canonical-shell branches cite the exact mass-part/canopy shell hash;
bulk-field branches own one deterministic recipe-derived aggregate volume. Index rows are a
one-to-one ref/bounds slice, never another geometry owner. Registry/part/owner/leaf/bounds/law/ABI
disagreement or a duplicate/unresolved volume is a census failure.
Entity surfaces use `ENTITY_PATCH`; a deterministic bulk instance uses `FIELD_PATCH` with its exact
field ref/key, instance index, patch ordinal and recipe derivation key. The latter validates against
the field recipe/law, remains non-addressable and never mints an `EntityId`.

Audience filtering is part of projection identity, never a late CSS toggle. `ViewOcclusionScene`,
every per-light illumination, the semantic draw list, hit-region set, chrome and `MapSceneRoot`
carry the same exact `AudienceProjectionPolicy` artifact ref. Under PUBLIC, no fragment, blocker,
caster, contribution, DrawOp, visible primitive, hit region, connection, portal, warning or ghost
may resolve to a `DM`-gated subject. This prevents a secret body or passage leaking through a
shadow, cache key, export or hit target. DM may include both closed gates. A policy mismatch or any
PUBLIC reference to DM-only identity is `PUBLIC_LENS_LEAK` and refuses publication.

**Render and SVG/PDF export consume byte-identical visible fragment geometry.** Hit-testing and
selection consume `HitRegionQ` derived from the addressable draw list's
`VisibleSemanticPrimitiveRef` union, so visible strokes, symbols and connections have the same legal
path as surfaces. Only the `ENTITY/addressable:true` semantic branch may mint a `HitRegionQ`; a bulk
vegetation field remains visible and participates in occlusion/light through its exact artifact ref
but owns no selectable entity or hit region. Small or multipart targets may use deterministic screen-space padding/aggregation,
so accessible interaction is not falsely constrained to hairline ink. The padding is presentation
geometry, never WORLD, export geometry or a second semantic object. Shadows are illumination laid
onto visible receivers; they never decide whether the caster itself is visible. Hidden bodies
remain in WORLD and in the settlement-level index, so they may still block light or affect
simulation across leaves.

### §10.8 · TWO LIGHTING CONTRACTS — the map lamp cannot grow crops

`LightRig` is renamed at the ownership boundary:

```ts
interface ProjectionLightProfile {          // PROJECTION only
  artifactKind: 'LIGHT_PROFILE';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  derivationMode: GlobalLightDerivationMode;
  sources: readonly [GlobalDirectionalProjectionLightSource, ...LocalProjectionLightSource[]];
  perceptualModelRef: ArtifactHashRef;
  conventionRegistryRef: ArtifactHashRef;
  projectionBandRegistryRef: ArtifactHashRef;
  toneSteps: 4 | 5;
  contentHash: ContentHash;
}

type ProjectionIntensityBandId = string & { readonly __projectionIntensityBandId: unique symbol };
type ProjectionColorBandId = string & { readonly __projectionColorBandId: unique symbol };
type LocalLightApproximationLawId = string & { readonly __localLightApproximationLawId: unique symbol };
type GlobalLightConventionId = 'SURVEY_NNW_V1' | 'HIGH_NOON_V1' | 'HIGH_MOON_V1';
type GlobalLightDerivationMode = 'FIXED_SURVEY' | 'LIGHT_PROBE_PREVIEW'
  | 'PINNED_DOCUMENT' | 'WORLD_TIME_OBSERVATION' | 'CANONICAL_EXPORT';
type CelestialEmitter = 'SUN' | 'MOON';
type ShadowSoftnessBandId = string & { readonly __shadowSoftnessBandId: unique symbol };

interface ProjectionLightSourceBase {
  lightId: EntityId;
  intensityBandId: ProjectionIntensityBandId;
  colorBandId: ProjectionColorBandId;
}

interface GlobalDirectionalProjectionLightSourceBase extends ProjectionLightSourceBase {
  role: 'GLOBAL_CELESTIAL';
  kind: 'DIRECTIONAL';
  emitter: CelestialEmitter;
  distanceModel: 'EFFECTIVELY_INFINITE_PARALLEL';
  directionIndex: AngleIndex;
  elevationIndex: AngleIndex;
  softnessBandId: ShadowSoftnessBandId;
  mappingLawRef: ArtifactHashRef;
  fixtureRef?: never;
  activeStateRef?: never;
  approximationLawId?: never;
}

type GlobalDirectionalProjectionLightSource = GlobalDirectionalProjectionLightSourceBase & (
  | { sourceAuthority: 'REGISTERED_CONVENTION'; conventionId: GlobalLightConventionId;
      probePreviewRef?: never; projectionSettingsRef?: never; sourceObservationRef?: never }
  | { sourceAuthority: 'PROBE_MAPPING'; probePreviewRef: ArtifactHashRef;
      conventionId?: never; projectionSettingsRef?: never; sourceObservationRef?: never }
  | { sourceAuthority: 'PINNED_DOCUMENT'; projectionSettingsRef: ArtifactHashRef;
      conventionId?: never; probePreviewRef?: never; sourceObservationRef?: never }
  | { sourceAuthority: 'WORLD_TIME'; sourceObservationRef: ArtifactHashRef;
      conventionId?: never; probePreviewRef?: never; projectionSettingsRef?: never }
);

interface LocalProjectionLightSource extends ProjectionLightSourceBase {
  role: 'LOCAL_FIXTURE';
  kind: 'POINT' | 'AREA_APPROX';
  directionIndex?: never;
  elevationIndex?: never;
  fixtureRef: { artifactId: ArtifactId; fixtureId: EntityId; contentHash: ContentHash };
  activeStateRef: { artifactId: ArtifactId; contentHash: ContentHash };
  approximationLawId: LocalLightApproximationLawId;
}

type ProjectionLightSource = GlobalDirectionalProjectionLightSource | LocalProjectionLightSource;

interface GlobalLightConvention {
  conventionId: GlobalLightConventionId;
  emitter: CelestialEmitter;
  azimuthDegreesQ: RatioQ;
  elevationDegreesQ: RatioQ;
  directionIndex: AngleIndex;
  elevationIndex: AngleIndex;
  intensityBandId: ProjectionIntensityBandId;
  colorBandId: ProjectionColorBandId;
  softnessBandId: ShadowSoftnessBandId;
}

interface GlobalLightConventionRegistry {
  artifactKind: 'GLOBAL_LIGHT_CONVENTION_REGISTRY';
  artifactId: ArtifactId;
  schemaVersion: number;
  coordinateAbiVersion: number;
  conventions: readonly [GlobalLightConvention, ...GlobalLightConvention[]];
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface ProjectionLightingBandRegistry {
  artifactKind: 'PROJECTION_LIGHTING_BAND_REGISTRY';
  artifactId: ArtifactId;
  schemaVersion: number;
  coordinateAbiVersion: number;
  intensityBandIds: readonly [ProjectionIntensityBandId, ...ProjectionIntensityBandId[]];
  colorBandIds: readonly [ProjectionColorBandId, ...ProjectionColorBandId[]];
  softnessBandIds: readonly [ShadowSoftnessBandId, ...ShadowSoftnessBandId[]];
  localFalloffBandIds: readonly [LocalLightFalloffBandId, ...LocalLightFalloffBandId[]];
  resolvedTransmissionBandIds: readonly [ResolvedTransmissionBandId,
    ...ResolvedTransmissionBandId[]];
  combinedTransmissionBandIds: readonly [CombinedTransmissionBandId,
    ...CombinedTransmissionBandId[]];
  contributionBandIds: readonly [ProjectionContributionBandId,
    ...ProjectionContributionBandId[]];
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface CelestialDomeMappingProfile {
  artifactId: ArtifactId;
  schemaVersion: number;
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  coordinateAbiVersion: number;
  centerDeadZoneQ: WorldQ;
  radiusToElevationLut: readonly [{ radiusFractionQ: RatioQ; elevationIndex: AngleIndex },
    ...{ radiusFractionQ: RatioQ; elevationIndex: AngleIndex }[]];
  lowElevationClampIndex: AngleIndex;
  azimuthLaw: 'CENTER_TO_CONTROL_CLOCKWISE_FROM_NORTH';
  outsideMapLaw: 'CLAMP_TO_EDGE';
  controls: {
    pointerModeRequiresExplicitProbe: true;
    touchDial: true;
    keyboard: readonly ['ARROWS_STEP_AZIMUTH_ELEVATION', 'HOME_RESET', 'ENTER_PIN', 'ESCAPE_EXIT'];
    reducedMotion: 'STEPPED_COMMIT_ON_RELEASE';
  };
  lawVersion: LawVersion;
  contentHash: ContentHash;
}

interface LightProbePreviewRequest {       // ephemeral PROJECTION; never MapDocument/WORLD state
  artifactId: ArtifactId;
  schemaVersion: number;
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  baseProjectionRequestRef: ArtifactHashRef;
  mappingProfileRef: ArtifactHashRef;
  mapCenterQ: PointQ;
  controlPointQ: PointQ;
  inputMode: 'POINTER' | 'TOUCH_DIAL' | 'KEYBOARD';
  derivedDirectionIndex: AngleIndex;
  derivedElevationIndex: AngleIndex;
  clamped: boolean;
  temporary: true;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  contentHash: ContentHash;
}

type MapGlobalLightPreference =
  | { mode: 'FIXED_SURVEY'; conventionRegistryRef: ArtifactHashRef;
      conventionId: GlobalLightConventionId; coordinateAbiVersion: number }
  | { mode: 'PINNED_DOCUMENT'; pinnedLightProfileRef: ArtifactHashRef;
      pinnedByCommandRef: ArtifactHashRef; provenanceRef: ProvenanceRef }
  | { mode: 'WORLD_TIME_OBSERVATION'; celestialLawRef: ArtifactHashRef;
      unresolvedFallback: { kind: 'WARNED_FIXED_SURVEY'; conventionRegistryRef: ArtifactHashRef;
        conventionId: GlobalLightConventionId; coordinateAbiVersion: number } };

interface MapProjectionSettings {
  artifactKind: 'MAP_PROJECTION_SETTINGS';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  globalLight: MapGlobalLightPreference;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface SolarSampleQ {
  sampleId: EntityId;
  interval: { from: TimeKey; to: TimeKey };
  azimuthIndex: AngleIndex;
  elevationIndex: AngleIndex;
  exposureWeightQ: RatioQ;
  durationQ: MeasureQ;                     // registered time unit; must equal the interval
  uncertainty: SpatialObservationUncertaintyQ;
  provenanceRef: ProvenanceRef;
}

interface WorldSolarProfile {              // DOMAIN / OBSERVATION, never imports projection
  artifactKind: 'WORLD_SOLAR_PROFILE';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  provenance: CauseRef;
  latitudeBand?: string;
  climateBand: string;
  sourceRefs: readonly [ArtifactHashRef, ...ArtifactHashRef[]];
  samples: readonly [SolarSampleQ, ...SolarSampleQ[]];
  contentHash: ContentHash;
}

type MaterialTransmissionBandId = string & { readonly __materialTransmissionBandId: unique symbol };
type ProjectionContributionBandId = string & { readonly __projectionContributionBandId: unique symbol };
type ResolvedTransmissionBandId = string & { readonly __resolvedTransmissionBandId: unique symbol };
type CombinedTransmissionBandId = string & { readonly __combinedTransmissionBandId: unique symbol };
type ReceiverContributionId = string & { readonly __receiverContributionId: unique symbol };
type PathAttenuationContributionId = string & { readonly __pathAttenuationContributionId: unique symbol };
type LocalGlowContributionId = string & { readonly __localGlowContributionId: unique symbol };

interface ResolvedMaterialSurfaceRef {
  massingRegistryRef: ArtifactHashRef;
  bodyId: EntityId;
  partId: EntityId;
  partContentHash: ContentHash;
  componentId: EntityId;
  materialId: MaterialId;
  surfacePatch: SpatialSurfacePatchRef;
}

type AttenuationVolumeOwnerRef = SpatialAttenuationSubjectRef['owner'];
type MaterialAttenuationOwnerRef = Extract<AttenuationVolumeOwnerRef, { kind: 'MASS_PART' }>;
type VegetationAttenuationOwnerRef =
  | Extract<AttenuationVolumeOwnerRef, { kind: 'VEGETATION_CANOPY' }>
  | Extract<AttenuationVolumeOwnerRef, { kind: 'VEGETATION_FIELD' }>;
type VegetationReceiverOwnerRef =
  | Extract<SpatialSurfaceSubjectRef, { kind: 'VEGETATION_CANOPY' }>
  | Extract<SpatialSurfaceSubjectRef, { kind: 'VEGETATION_FIELD' }>;

type ReceiverResponseSource =
  | { kind: 'MATERIAL_BAND'; registryRef: ArtifactHashRef;
      bandId: MaterialTransmissionBandId;
      materialSurfaceRef: ResolvedMaterialSurfaceRef;
      mappingLawRef: ArtifactHashRef }
  | { kind: 'VEGETATION_OBSERVATION'; observationRef: ArtifactHashRef;
      subject: VegetationReceiverOwnerRef;
      opacityRegistryRef: ArtifactHashRef; opacityBandId: VegetationOpacityBandId }
  | { kind: 'NEUTRAL_UNASSERTED'; policyRef: ArtifactHashRef };

interface ResolvedAttenuatorMaterialRef {
  attenuationVolumeRef: ArtifactHashRef;
  owner: MaterialAttenuationOwnerRef;
  massingRegistryRef: ArtifactHashRef;
  bodyId: EntityId;
  partId: EntityId;
  componentId: EntityId;
  materialId: MaterialId;
}

type PathAttenuationSource =
  | { kind: 'MATERIAL_BAND'; registryRef: ArtifactHashRef;
      bandId: MaterialTransmissionBandId;
      attenuatorMaterialRef: ResolvedAttenuatorMaterialRef;
      mappingLawRef: ArtifactHashRef }
  | { kind: 'VEGETATION_OBSERVATION'; observationRef: ArtifactHashRef;
      subject: VegetationAttenuationOwnerRef;
      opacityRegistryRef: ArtifactHashRef; opacityBandId: VegetationOpacityBandId;
      mappingLawRef: ArtifactHashRef }
  | { kind: 'NEUTRAL_UNASSERTED'; policyRef: ArtifactHashRef;
      subject: AttenuationVolumeOwnerRef };

interface PathAttenuationContribution {
  contributionId: PathAttenuationContributionId;
  attenuator: SpatialAttenuationSubjectRef;
  source: PathAttenuationSource;
  resolvedBandId: ResolvedTransmissionBandId;
}

interface PerLightVisibility {
  lightId: EntityId;
  receiver: ProjectedReceiverRef;
  geometricVisibleFractionQ: RatioQ;        // V_i: unblocked fraction before material transmission
  receiverResponse: ReceiverResponseSource;
  blockers: readonly SpatialLightSubjectRef[];
  pathAttenuation: readonly PathAttenuationContribution[];
  attenuationCompositionLawRef: ArtifactHashRef;
  combinedTransmissionBandId: CombinedTransmissionBandId; // T_i, after ordered path composition
}

interface ReceiverContributionQ {
  contributionId: ReceiverContributionId;
  lightId: EntityId;
  receiver: ProjectedReceiverRef;
  contributionRegistryRef: ArtifactHashRef;
  directContributionBandId: ProjectionContributionBandId;
  lawVersion: LawVersion;
}

interface PerLightIllumination {
  artifactKind: 'PER_LIGHT_ILLUMINATION';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  lightId: EntityId;
  sourceSpatialRef: ArtifactHashRef;
  observationRef: ArtifactHashRef;
  leafIndex: LeafIndex;
  viewSceneRef: ArtifactHashRef;
  lightProfileRef: ArtifactHashRef;
  audiencePolicyRef: ArtifactHashRef;
  visibility: readonly PerLightVisibility[];
  casts: readonly ShadowCast[];
  contributions: readonly ReceiverContributionQ[];
  contentHash: ContentHash;
}

type PerceptualToneBandId = string & { readonly __perceptualToneBandId: unique symbol };
type MaterialOpticalResponseBandId = string & { readonly __materialOpticalResponseBandId: unique symbol };

interface ProjectionPerceptualLightingModel {
  artifactKind: 'PROJECTION_PERCEPTUAL_LIGHTING_MODEL';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  coordinateAbiVersion: number;
  ambientSkyBandId: PerceptualToneBandId;
  groundReflectionLawRef: ArtifactHashRef;
  contactOcclusionLawRef: ArtifactHashRef;
  materialOpticalRegistryRef: ArtifactHashRef;
  shadowEdgeProfileRef: ArtifactHashRef;
  environmentalPolicyRef: ArtifactHashRef;
  localGlowPolicyRef: ArtifactHashRef;
  cartographicProtectionPolicyRef: ArtifactHashRef; // labels/critical roads remain legible
  contentHash: ContentHash;
}

interface ReceiverPerceptualCompositeQ {
  receiver: ProjectedReceiverRef;
  directIlluminationRows: readonly {
    illuminationRef: ArtifactHashRef;
    lightId: EntityId;
    contributionId: ReceiverContributionId;
  }[];
  ambientSkyBandId: PerceptualToneBandId;
  reflectedColorBandId: PerceptualToneBandId;
  contactOcclusionBandId: PerceptualToneBandId;
  materialResponseBandId: MaterialOpticalResponseBandId;
  environmentalModulationBandId: PerceptualToneBandId;
  localGlowRows: readonly {
    contributionId: LocalGlowContributionId;
    fixtureRef: ArtifactHashRef;
    activeStateRef: ArtifactHashRef;
    glowLawRef: ArtifactHashRef;
    contributionBandId: ProjectionContributionBandId;
  }[];
  finalToneBandId: PerceptualToneBandId;
}

interface PerceptualLightingCompositeArtifact {
  artifactKind: 'PERCEPTUAL_LIGHTING_COMPOSITE';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  sourceSpatialRef: ArtifactHashRef;
  observationRef: ArtifactHashRef;
  viewSceneRef: ArtifactHashRef;
  lightProfileRef: ArtifactHashRef;
  modelRef: ArtifactHashRef;
  audiencePolicyRef: ArtifactHashRef;
  receivers: readonly ReceiverPerceptualCompositeQ[];
  contentHash: ContentHash;
}

type NonShadowProjectionEffectKind = 'CONTACT_TONE' | 'AMBIENT_REFLECTION_TONE'
  | 'ENVIRONMENTAL_OVERLAY' | 'LOCAL_GLOW';

interface PerceptualEffectGeometryArtifact {
  artifactKind: 'PERCEPTUAL_EFFECT_GEOMETRY';
  artifactId: ArtifactId;
  schemaVersion: number;
  kind: NonShadowProjectionEffectKind;
  compositeRef: ArtifactHashRef;
  sourceRefs: readonly [ArtifactHashRef, ...ArtifactHashRef[]];
  derivationLawRef: ArtifactHashRef;
  screenGeometry:
    | { kind: 'AREA'; polygon: PolygonQ }
    | { kind: 'LINE'; polyline: PolylineQ; widthQ: WorldQ };
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  contentHash: ContentHash;
}

type ProjectionEffectPrimitive =
  | { effectPrimitiveId: ProjectionPrimitiveId; kind: 'SHADOW';
      source: { kind: 'SHADOW_CAST'; illuminationRef: ArtifactHashRef;
        castId: ProjectionPrimitiveId }; addressable: false }
  | { effectPrimitiveId: ProjectionPrimitiveId; kind: NonShadowProjectionEffectKind;
      source: { kind: 'PERCEPTUAL_EFFECT_GEOMETRY'; geometryRef: ArtifactHashRef };
      addressable: false };

interface ProjectionEffectArtifact {
  artifactKind: 'PROJECTION_EFFECT';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  sourceSpatialRef: ArtifactHashRef;
  observationRef: ArtifactHashRef;
  viewSceneRef: ArtifactHashRef;
  lightProfileRef: ArtifactHashRef;
  perceptualCompositeRef: ArtifactHashRef;
  audiencePolicyRef: ArtifactHashRef;
  effects: readonly ProjectionEffectPrimitive[];
  contentHash: ContentHash;
}
```

The binding projection pipeline is therefore a join, not a mutation chain:

`CanonicalSpatialArtifact + leaf → DimensionalScene (no shadows)`
`CanonicalSpatialArtifact + LeafRoster → SpatialOcclusionIndex (all active-leaf solids)`
`DimensionalScene + SpatialOcclusionIndex + TemporalObservation + ViewProjectionProfile → ViewOcclusionScene`
`→ VisiblePrimitiveSetArtifact (light-independent addressable geometry)`
`→ PerLightIllumination[] (visible receivers, all blockers)`
`→ PerceptualLightingCompositeArtifact → ProjectionEffectArtifact → semantic DrawOps`
`→ HitRegionQ[] from the visible primitive set / raster / vector export from the same roots`.

Every dimensional profile contains **exactly one global celestial source in tuple position zero**.
It is the sun by day or moon by night, always directional at effectively infinite distance: every
leaf/object shares one azimuth/elevation, rays remain parallel, and there is no radial fanning or
distance falloff. Local point/area fixtures may follow in the tuple; they retain their own durable
fixture and observed active state and never rotate with the global source. Every source has a unique
`lightId`.
Every cast for tuple position zero uses `GLOBAL_PARALLEL_DIRECTIONAL` and exactly the source's
direction/elevation/mapping law. Every cast for a local source uses
`LOCAL_POINT_OR_AREA_APPROX`, resolves that source's fixture/state/approximation law and records its
quantized ray vectors, distance and registered falloff band; it carries no global cotangent fields.
Cross-branch, wrong-fixture, wrong-light and invented local-direction casts fail.

The profile's `conventionRegistryRef` and `projectionBandRegistryRef` resolve exact artifact ID/hash,
schema, law and ABI bytes. A `REGISTERED_CONVENTION` source equals the named convention's emitter,
direction/elevation, intensity/colour and softness fields byte-for-byte; every local/global band,
resolved/combined transmission and contribution ID resolves in the same exact band registry.
Pinned and export profiles retain these refs. A self-asserted convention ID, numeric-only registry
version, unknown band or ABI/law mismatch refuses projection.

The normal deterministic state is `FIXED_SURVEY`. `LIGHT_PROBE_PREVIEW` is an explicit temporary
projection mode, `PINNED_DOCUMENT` resolves an authored projection-settings artifact,
`WORLD_TIME_OBSERVATION` resolves a canonical celestial observation, and `CANONICAL_EXPORT`
resolves a registered export convention. Mode and source-authority discriminants must agree:
registered convention for fixed/export, probe-mapping ref for preview, projection-settings ref for
pinned, and exact observation ref for world time. Ordinary hover/pan never changes the light.
`HIGH_NOON_V1` is fixed at azimuth 337.5° and elevation 75°; `HIGH_MOON_V1` uses the same geometry
with its own intensity/colour bands. Both values compile to exact `AngleIndex` entries under the
selected ABI; 90° is forbidden because it destroys the useful short shadow. Any later bake-off
changes the convention ID/version, never these bytes in place.

Under `DIMENSIONAL_V1`, projection emits exactly one `PerLightIllumination` for every source, in profile-source order, with
no extra, missing or duplicate light ID. `MapSceneRoot` and `SemanticDrawListArtifact` carry the
same ordered illumination-ref list byte-for-byte; each ref resolves the corresponding source ID and
the same spatial, observation, leaf, view-scene, profile and audience-policy ID/hash.
`ViewOcclusionScene` likewise
hash-binds the exact observation and view profile rather than a bare profile ID. For source `i`,
every visible receiver has exactly one visibility row and one contribution row, even when the
registered result is zero; no receiver/source pair may be silently omitted. Conversely every row
resolves one visible receiver and that source. Each receiver composite cites the complete ordered
source-row bijection in profile-source order, with no extra, missing or duplicate nested row.
geometry produces `V_i`; the receiver response plus ordered path-attenuation rows produce `T_i`
under one registered composition law. Neither may overwrite the other. Opaque blockers appear in
`blockers`; every transmissive canopy or other licensed attenuator appears exactly once in
`pathAttenuation`, in deterministic light-path order, with its exact volume/owner and
material/vegetation/neutral source. Every path row has a stable contribution ID; its source binds
the attenuator rather than the receiver and maps to one generic `ResolvedTransmissionBandId` in the
projection-band registry. Material rows resolve the volume owner's shell component; vegetation
rows resolve the canopy/field owner and selected `VegetationObservation`; neutral policy is
explicitly attached to that attenuator. The source subject always byte-equals
`attenuator.owner`: material accepts only MASS_PART, vegetation only CANOPY/FIELD, and neutral only
the legal volume-owner union. A receiver VEGETATION_OBSERVATION row likewise carries a canopy/field
subject equal to `receiver.owner`; MASS observations match body ID and INSTANCE_FIELD observations
match exact field ref/key. Borrowing another tree/field's opacity, attaching material to water/
support/trunk or cross-branch owner substitution fails. The resolved row bands compose to
`combinedTransmissionBandId`; missing, extra, reordered or observation-unresolved rows fail. Direct
contributions add per source after that source's `V_i × T_i`; one source's shadow never subtracts
another's light. `LightFixture` existence is durable WORLD, `ActiveLightState` is OBSERVATION, and
the projection reads both without owning either.

The projection-band registry is closed and versioned in the executable manifest; deserialization
must resolve every branded intensity/color ID before hashing or rendering. A directional source is
unrenderable without both LUT indices. A local point/area source is dormant unless its exact durable
`LightFixture` artifact/entity and matching `ActiveLightState` observation/hash resolve, including
the fixture's canonical position, and its registered approximation law is compatible with the
source kind. No optional-field fallback, arbitrary number/free colour string or projection-minted
fixture is legal.

Receiver response and path attenuation are separate authorities. Receiver `T_i` response is resolved from a closed material-band registry, an exact `VegetationObservation` plus its
opacity registry, or a declared neutral/nonasserting policy artifact; an arbitrary ratio is illegal.
For `MATERIAL_BAND`, `materialSurfaceRef` must resolve through the selected massing-registry hash to
the exact receiver body/part and part content hash, its KNOWN component/material ID and the same
source patch named by `ProjectedReceiverRef`; `mappingLawRef` must deterministically map that
component/material to the selected registry/band. Wrong part, stale part hash, wrong component,
patch, material or band are negative fixtures. A path material source instead resolves the named
attenuation-volume owner/component and may not reuse the receiver surface; a vegetation path
source's subject equals that volume's canopy/field owner. Unknown material never becomes an opacity claim.
Each `ReceiverContributionQ` has a unique contribution ID and one matching visibility row
for the same light/receiver and its closed contribution band must equal the registered composition
of profile intensity, `V_i` and the resolved `T_i`. Local `activeStateRef`s and every vegetation
observation used by transmission must occur exactly once in the selected
`TemporalObservation.orderedSources`; a state from another observation cannot be paired with the
root. Each composite direct row resolves an exact illumination artifact, light ID and nested
contribution ID for the same receiver. Each glow row binds a unique contribution ID, exact fixture/
state, glow law and band. Bare illumination refs, missing/duplicate/cross-receiver rows and
unresolved glow rows fail.

Direct light is not the whole image. The receiver-level perceptual composite deterministically
combines direct source rows with analytic sky ambient, bounded ground/nearby reflected colour,
topology-derived contact occlusion, registered material optical response, observation-backed
environmental modulation, a versioned shadow-edge/softness profile and source-local glow from exact
active fixtures. A cast shadow suppresses only that source's direct contribution; it never turns
ambient or independent local sources black. Unknown material uses the declared neutral,
nonasserting branch. Fog, smoke, rain, snow or moisture require an exact environmental observation;
glow requires a real active fixture. Labels and critical route edges obey the registered
cartographic-protection mask.

These are **perceptual 2.5D approximations**, not a second physical renderer. Contact/reflection/
softness/glow/atmosphere compile to finite renderer-neutral polygons and closed tone/style bands in
`ProjectionEffectArtifact`; CSS/SVG blur, screen-space AO, cinematic whole-frame bloom, ray-traced
GI, path tracing, volumetric marching and GPU-authoritative geometry remain forbidden. Every shadow
effect cites one illumination/cast, uses the same primitive ID and polygon as that `ShadowCast`, and
has no hit authority; no extra shadow ink may be minted. Other effects cite their exact composite,
observation/fixture and a hash-addressed `PerceptualEffectGeometryArtifact`; their kind and screen
geometry equal that artifact, so the effect registry cannot mint a free polygon. The draw list alone
selects the closed style token. Nonzero empirical optical/material/environmental bands stay
dormant until a separate preregistered perceptual-lighting calibration supports them; the
architecture and neutral no-inference compositor may land first.

`VisiblePrimitiveSetArtifact` is the sole light-independent owner of addressable projected
geometry. Surface primitives resolve exactly one visible fragment and equal its clipped polygon;
their registered semantic-owner mapping maps that fragment owner to exactly the serialized entity
or field semantic—never another entity. Entity strokes require source and semantic `semanticId`
equality; field strokes require exact field ref/key equality and remain nonaddressable. Connection
semantic IDs equal `connectionId`, and symbol anchor/content laws resolve the same entity semantic.
stroke, connection and symbol primitives resolve their exact canonical geometry/anchor and
projection law. The draw list owns only style/application ops over visible or nonaddressable effect
IDs. Its exact registered `applicationCoverageContractRef` defines the required legal op roster for
each visible/effect primitive. Every target exists and its serialized kind matches; every required
visible/effect primitive is covered; forbidden or duplicate geometric ops and dangling targets
fail. An empty draw list cannot accompany a nonempty visible/effect set, and an addressable hit
primitive cannot be omitted from the rendered visibility contract. Hit/draw parity and
missing/extra/wrong-kind targets are negative fixtures. Hit regions derive only from the visible
primitive set, so changing probe/pinned/world-time
light leaves every semantic hit identity and polygon byte-identical. Effects never become hover or
click targets. Every hit region cites a nonempty set of `ENTITY/addressable:true` primitives with
the same `semanticId`; vegetation fields, effects and mixed identities are forbidden. `VISIBLE_UNION`
equals their exact geometric union and carries no padding. `DETERMINISTIC_PAD` names a policy and
required padding and equals that policy's padded union. `DETERMINISTIC_AGGREGATE` names its grouping
law and equals its declared aggregate. Empty refs, optional-policy ambiguity and arbitrary polygons
fail the hit census.

View, projection-light and world-solar hashes include exact `lawManifestRef` and
`coordinateAbiRef` plus their equality-pinned schema/law/ABI versions; any root or derived artifact
ref must match the exact refs and versions as well as artifact ID/content hash. Solar samples are
nonempty, time-ordered and nonoverlapping, use ABI angle indices, carry registered time duration,
weight, uncertainty and provenance, and exactly cover the declared sampling window. Duration must
equal its interval under the registered calendar/time-unit conversion. Invalid order, uncovered
gaps, duplicate samples, angle-table mismatch or free/unitless duration refuses the solar profile.

`VegetationObservation.opacityRegistryRef` resolves the exact opacity registry whose band contains
`opacityBandId`; its schema/law/ABI, source spatial revision and observed time must equal every
attenuation row that consumes it. A numeric registry version or same-named band from another
registry is invalid. `LightProbePreviewRequest` hash-binds schema/law/ABI, the exact projection
request and dome-mapping profile; it cannot be replayed under another angle table. FIXED_SURVEY and
the warned fixed fallback in `MapProjectionSettings` similarly bind the exact convention registry,
convention ID and ABI. Pinned profiles already carry their own exact registry refs. No setting may
re-resolve a bare convention or opacity ID against whichever registry is currently installed.

`ShadeBurden` is replaced by a time-indexed `ShadeExposure` receipt derived from
`WorldSolarProfile`, never from fixed/probe/pinned/export projection light. If the domain lacks a
licensed celestial fact, causal shade is absent/dormant; the renderer may still use the explicit
fixed-survey convention. Analytic perceptual fill/contact/reflection/softness/environment/glow live
only in PROJECTION under the contract above and cannot feed crops, prosperity, siting, events or the
campaign clock. Heavy physical/screen-space methods remain refused; their perceptual results are
not categorically forbidden.

### §10.9 · CONNECTIONS — shared anchors and portals are different mathematical objects

The one-identity/two-leaf law remains for physical aligned access. Its sole canonical type is
`ConnectionPoint` in §7.1.4, including `lensGate`, construction/removal epochs and provenance; no
adapter may erase those fields. A non-aligned portal is deliberately different:

```ts
type PortalTraversalLawId = string & { readonly __portalTraversalLawId: unique symbol };

interface PortalLink {
  portalId: EntityId;
  schemaVersion: number;
  lawVersion: LawVersion;
  endpoints: readonly [
    { endpointId: EntityId; leaf: LeafIndex; anchorXY: PointQ; hostId: EntityId;
      support: SupportSurfaceRef; heightAboveSupportQ: HeightQ },
    { endpointId: EntityId; leaf: LeafIndex; anchorXY: PointQ; hostId: EntityId;
      support: SupportSurfaceRef; heightAboveSupportQ: HeightQ }
  ];
  traversalLawId: PortalTraversalLawId;     // closed/versioned registry
  lensGate: 'PUBLIC' | 'DM';
  constructionEpoch: EpochId;
  removalEpoch?: EpochId;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}
```

`PORTAL` leaves `ConnectionPoint.kind`. A portal may connect different positions and cannot satisfy
the shared-anchor census by definition. The canonical spatial artifact owns the unique `PortalLink`
registry; each `DimensionalScene` contains only the links whose active endpoint lies on that leaf.
Both stable, unique endpoint identities belong to one `portalId`; neither is an independently
generated look-alike. The compiler rejects duplicate endpoint IDs, an unresolved/inactive leaf,
missing provenance/lifecycle/privacy state or a link whose two endpoints do not resolve in the
canonical artifact. Each endpoint must resolve its exact host and support surface, lie on that host
at the declared support-relative height within the coordinate quantum, and overlap the link's
lifecycle. `ConnectionPoint` applies the same endpoint/host law while additionally requiring the
two endpoints' XY to equal its one `anchorXY`; a portal deliberately does not. These refs participate
in content hashes and the endpoint census. Projection, hit-testing and export apply `lensGate`
exactly as for a connection.

### §10.10 · PROVENANCE IS NOT ONE RUNG — origin and intervention can both be true

The ladder remains good UI but is not canonical storage. A derived cathedral moved by a user is both **derived in origin** and **nudged in intervention**; forcing exactly one rung destroys information.

```ts
interface SpatialRecipeEntryRef {
  registrySnapshotRef: ArtifactHashRef;
  entryId: EntityId;
  entryContentHash: ContentHash;
  registryVersion: string;
}

type SpatialRecipeBinding =
  | { status: 'BOUND'; recipe: SpatialRecipeEntryRef }
  | { status: 'NOT_APPLICABLE'; reason: 'NON_RECIPE_CANONICAL_FACT' };

type CanonicalOrigin = { causeRefs: readonly CauseRef[] } & (
  | { kind: 'BUILT_IN'; sourceRegistryRef: ArtifactHashRef }
  | { kind: 'CUSTOM'; packageManifestRef: ArtifactHashRef;
      frozenRegistrySnapshotRef: ArtifactHashRef }
  | { kind: 'IMPORTED'; importReceiptRef: ArtifactHashRef; preservedSourceRef: ArtifactHashRef }
  | { kind: 'AUTHORED'; commandRef: ArtifactHashRef }
);

type ProvenanceSubjectRef =
  | { kind: 'ENTITY'; entityId: EntityId }
  | { kind: 'ARTIFACT'; artifactId: ArtifactId };

interface ProvenanceRecord {
  provenanceId: EntityId;
  subject: ProvenanceSubjectRef;
  schemaVersion: number;
  lawVersion: LawVersion;
  origin: CanonicalOrigin;
  recipeBinding: SpatialRecipeBinding;
  interventions: readonly {
    commandRef: ArtifactHashRef;
    kind: 'REROLLED' | 'NUDGED' | 'DESIGNATED' | 'RESHAPED' | 'RECONCILED';
    actor: 'USER' | 'AI_PROPOSAL' | 'RESOLVE' | 'MIGRATION';
    atTime: TimeKey;
  }[];
  causalStatus: 'EXPLAINED' | 'PARTIAL' | 'UNEXPLAINED' | 'OBSOLETE_CAUSE';
  lawStatus: 'LAWFUL' | 'DECLARED_EXEMPTION' | 'CONFLICT';
  contentHash: ContentHash;
}

interface ProvenanceLedger {
  artifactKind: 'PROVENANCE_LEDGER';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  priorLedgerRef?: ArtifactHashRef;
  records: readonly [ProvenanceRecord, ...ProvenanceRecord[]];
  orderedCommandRefs: readonly ArtifactHashRef[];
  lawVersion: LawVersion;
  contentHash: ContentHash;
}

interface ProvenanceReceiptIndex {          // external audit index; never a dependency of its subject
  artifactId: ArtifactId;
  schemaVersion: number;
  subjectArtifactRef: ArtifactHashRef;
  orderedReceiptRefs: readonly ArtifactHashRef[];
  lawVersion: LawVersion;
  contentHash: ContentHash;
}
```

Every canonical `provenanceRef` resolves one exact ledger artifact and one record whose
`provenanceId` and `contentHash` equal the pointer's ID/hash. Ledger records and pre-existing command/
operation/cause refs are deterministically ordered and unique; an optional prior-ledger ref forms an
acyclic history. The after artifact never points to a receipt that points back to it. External
`ProvenanceReceiptIndex` artifacts may bind completed effect receipts to that after-artifact ref for
audit, but are not dependencies of the subject or its ledger. Changing origin, intervention, cause
or law/causal status moves record and ledger hashes; changing the later audit index does not create a
cycle. A bare entity ID or mutable side table cannot satisfy provenance. Nested values may share
their owning artifact's ledger, but each pointer still names its exact record. Unresolved records,
cross-settlement ledgers, duplicate subjects and unreferenced command history are failures.

`currentRung` may be derived for display from the last material intervention; it is never the lossless record. Coverage is a vector:

- entity-count coverage;
- visible-area coverage on the selected leaf;
- named-semantic coverage for institutions/defences/connections;
- causal and law-status counts.

No single 0–100% scalar may silently weight these dimensions. A compact UI summary may show a declared weighting and must expose the components.

Pre-authorship maps are not unknowable. A migration may record `origin.kind='BUILT_IN'` with the
exact legacy registry entry/version and reconstruct known `mapEdits` interventions; uncertainty is
explicit rather than turning every old body into IMPORTED. The typed cause roster is the sole causal
roster—there is no second untyped cause-artifact list that can disagree with it. A0 is important,
but its entity schema lands only after D1 fixes canonical identities/geometry so it does not
fossilize the wrong object boundary.

### §10.11 · THE DOCUMENT PIN, REPRESENTATION RATIO AND LEGACY READER

```ts
interface MapRepresentationDecision {
  artifactKind: 'MAP_REPRESENTATION_DECISION';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  householdCountRef: ArtifactHashRef;
  householdsPerAnonymousBody: RatioQ;
  anonymousResidentialBodyCount: number;
  namedBodiesExcluded: true;
  ancillaryAndWorkBodiesExcluded: true;
  decidedAt: TimeKey;
  sourceResolvePlanRef?: ArtifactHashRef;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface MapDocumentBase {
  baseWorldRef: ArtifactHashRef;
  baseDossierRef: ArtifactHashRef;
  contentRegistryBundleRef: ArtifactHashRef;
  surveyedAt: TimeKey;
  spatialLawVersion: LawVersion;
  coordinateAbiVersion: number;
  representationDecisionRef?: ArtifactHashRef;
}
```

`MapDocument.contentHash` hashes this **base snapshot identity** plus every canonical field enumerated in §9.1:
schema/settlement, selected spatial, exact generation manifest, ordered commands, locks, participation/
currency, representation/household authority, projection settings, provenance ledger and conflicts.
The exact `contentRegistryBundleRef` is canonical too: a save never relies on whichever custom
registry happens to be installed when it is reopened.
Only deterministic checkpoints, redo stack and transient UI are excluded. It never hashes the
mutable current live-world hash. A LIVE document explicitly rebases through a core operation and
gets a new base; a PINNED document continues to point at the surveyed artifact while the world
advances.

`representationDecisionRef` resolves the complete immutable decision, and
`SET_REPRESENTATION_RATIO` carries that exact artifact rather than injecting a scalar or discovering
its denominator off-ledger. A hash-addressed `ResolvePlan` may contain the complete proposed tuple;
an accepted `MapRepresentationDecision.sourceResolvePlanRef` points one-way to that earlier plan.
The plan never points to the completed decision, avoiding a hash cycle. Settlement, household
authority, body census, exclusions, decision time, provenance and law must agree with the selected
spatial/document snapshot.

The representation ratio is households per **anonymous residential body**, never souls per body and
never households divided by named landmarks. Its numerator resolves an exact canonical household-
count artifact; its denominator counts only anonymous residential bodies. Use a reduced rational.
Named buildings and anonymous ancillary/work bodies are excluded and use their own semantic/LOD
rules. If household authority is unavailable the ratio is unresolved and RESOLVE refuses rather
than converting population. It may be absent during drafting; the first committed RESOLVE/canon
decision pins it, and changing it is a declared whole-fabric rebase. Migration negatives prove that
old soul arithmetic, scalar ratios and mixed residential/nonresidential denominators cannot enter
the current schema.

⛔ Pre-§6 artifacts do **not** read as `parts: []` and disappear. The migration contract is:

1. preserve stored bytes and legacy hashes;
2. select a read-time `PLANAR_V1` adapter/renderer from the stored law version;
3. optionally derive an ephemeral one-part planar compatibility mass for shared tools, clearly marked `LEGACY_ADAPTER` and excluded from the stored artifact hash;
4. require an explicit recanonize/upgrade operation to persist new-dimensional truth.

Generator improvements ride explicit law versions. Old worlds keep their old version unless a declared recanonize operation produces receipts and a new base hash. Fixtures prove old behavior under old law; they do not freeze improvement for new worlds.

### §10.12 · `mapEdits` WAS MISCOUNTED AND MISCLASSIFIED — compatibility data is not the new command model

The sandbox container has **nine**, not eight, top-level keys:

`layoutVariant · pins · sceneOverrides · legendPrefs · styleLens · layoutLawVersion · annotations · bespokeStyles · seasonOverride`.

Their binding classification is:

| field | authority |
|---|---|
| `legendPrefs`, `styleLens`, `annotations`, `bespokeStyles`, `seasonOverride` | Class A / PROJECTION or observation selection; never canonical geometry |
| `layoutVariant` | Class B whole-map candidate selection / reroll; it is generative and keeps the owner-ruled free-account entitlement |
| legacy `pins`, `sceneOverrides` | remain V1 presentation compatibility data only; canonical movement/shape/material changes require typed Class D/C commands and may not silently promote these keys |
| `layoutLawVersion` | META migration selector, immutable for a saved base; never cosmetic |

The live application's current three-key container is an earlier schema, not evidence that the additional six landed in the main worktree. Migration handles both by version; no documentation may claim all nine are live product machinery.

### §10.13 · AUTHORSHIP STOPS AT THE DOMAIN DOOR — causes are operations, not document inverses

The map document owns portrait edits and projection choices. It does **not** become a second settlement store.

1. Class A/B and portrait-only D commands may replay within `MapDocument` through the typed legality/invalidation system.
2. A canonical Class C designation becomes a proposal for an existing core/domain operation. It commits only through the operation registry, authority check, `ActionResult`, durable outbox/idempotency path and domain receipt.
3. `RECORD_EVENT` is removed from `EditVerb`. The map may author an `EventProposal`; an accepted event commits through the existing domain event operation. It is not removable by MapDocument undo. Any authorized rollback/branch remains a core world operation with its own receipt.
4. AI may directly execute only the declared low-risk document verbs the arrival gate permits. For canonical C/E actions it proposes typed operations; the user/authority layer approves. AI never silently mutates canon.
5. `authorship/**` may import engine query/command declarations; the engine never imports authorship. Canonical locks are engine-owned `SpatialConstraint`s produced by a core operation. Portrait locks remain document-local `FeatureLock`s.

`SET_DISTRICT_WEALTH` is split because current condition and inherited morphology move on different clocks:

| intent | legal operation | effect |
|---|---|---|
| change current district condition/prosperity | canonical Class C domain operation | occupancy, maintenance/material-condition state and active use; **no past street rewrite or material-composition inference** |
| author a pre-canon alternate history | explicit historical REBASE / scenario operation | full declared morphology rebuild under a new base/law receipt |
| prosperity changes during play | dated domain event/proposal | future construction, abandonment, reuse and maintenance through later ticks |

Dead ends, frontage, parcels and inherited street grain have inertia. A poverty designation cannot instantaneously rewrite the roads while the invalidation table claims street topology remained byte-identical.

### §10.14 · THE EXECUTABLE MANIFEST — architecture stops being prose at this seam

The strongest missing foundation from the historical workplan is restored. One generated/executable manifest owns:

```ts
type StageId = 'S0'|'S1'|'S2'|'S3'|'S4'|'S5'|'S6'|'S7'|'S8'|'S9'|'S10'|'S11'
  | 'S12'|'S13'|'S14'|'S15'|'S16'|'S17'|'S18'|'S19'|'S20'|'S21'|'S22'|'S23';

type CoreArtifactKind =
  | 'BASE_WORLD' | 'BASE_DOSSIER' | 'GENERATION_MANIFEST'
  | 'CANONICAL_FACT_PROJECTION'
  | 'SPATIAL_COMPILE_INPUT' | 'PROJECTION_INPUT' | 'EXPORT_INPUT'
  | 'FABRIC' | 'CADASTRAL_BOUNDARY_ARRANGEMENT' | 'GROUND_SURFACE_REGISTRY'
  | 'CANONICAL_SPATIAL' | 'MASSING_PHASE' | 'RURAL_PHASE'
  | 'VEGETATION_PHASE' | 'OPERATIONS' | 'EVIDENCE_SCOPE' | 'MECHANISM_REGISTRY'
  | 'CONTENT_REGISTRY_BUNDLE' | 'COORDINATE_ABI' | 'LAW_MANIFEST' | 'UNIT_REGISTRY'
  | 'EXECUTABLE_VOCABULARY' | 'PROVENANCE_LEDGER' | 'EDIT_COMMAND_REGISTRY'
  | 'GLOBAL_LIGHT_CONVENTION_REGISTRY' | 'PROJECTION_LIGHTING_BAND_REGISTRY'
  | 'TEMPORAL_OBSERVATION' | 'LEAF_ROSTER' | 'VIEW_PROFILE' | 'LIGHT_PROFILE'
  | 'AUDIENCE_POLICY' | 'DIMENSIONAL_SCENE' | 'SPATIAL_OCCLUSION_INDEX'
  | 'VIEW_OCCLUSION_SCENE' | 'VISIBLE_PRIMITIVE_SET' | 'PER_LIGHT_ILLUMINATION'
  | 'PERCEPTUAL_LIGHTING_COMPOSITE' | 'PERCEPTUAL_EFFECT_GEOMETRY'
  | 'PROJECTION_EFFECT' | 'DRAW_LIST'
  | 'HIT_REGION_SET' | 'MAP_CHROME' | 'MAP_SCENE_ROOT' | 'MAP_DOCUMENT'
  | 'MAP_DOCUMENT_CHECKPOINT' | 'MAP_DOCUMENT_SNAPSHOT'
  | 'EDIT_COMMAND' | 'EDIT_COMMAND_LEGALITY_RECEIPT'
  | 'RESOLVE_PLAN' | 'MAP_REPRESENTATION_DECISION' | 'VEGETATION_OBSERVATION'
  | 'WORLD_SOLAR_PROFILE' | 'HISTORICAL_MECHANISM_SCOPE'
  | 'SPATIAL_RECIPE_REGISTRY_SNAPSHOT' | 'REGISTERED_FANTASY_MECHANISM'
  | 'CONTENT_RESOLUTION_REPORT' | 'REGISTERED_FANTASY_MECHANISM_REGISTRY'
  | 'CUSTOM_CONTENT_PARITY_FIXTURES'
  | 'SPATIAL_EFFECT_RECEIPT' | 'ROOF_COMPILE_RECEIPT' | 'ROOF_COMPILE_FAILURE'
  | 'ROOF_SPECIFICATION' | 'MAP_PROJECTION_SETTINGS'
  | 'PROJECTION_PERCEPTUAL_LIGHTING_MODEL'
  | 'PLAN_INTENT' | 'PLAN_REALIZATION' | 'HISTORICAL_MECHANISM'
  | 'HISTORICAL_PLAN_RECEIPT'
  | 'CANONICAL_SPATIAL_OPERATION' | 'ARCHITECTURAL_HISTORY_OPERATION'
  | 'RURAL_CHANGE_OPERATION';
type RegisteredArtifactKindId = string & { readonly __registeredArtifactKindId: unique symbol };
type ArtifactKind = CoreArtifactKind | RegisteredArtifactKindId;

type CoreCensusId =
  | 'ARTIFACT_IDENTITY' | 'DEPENDENCY_CLOSURE' | 'ONE_LEAF_AUTHORITY'
  | 'SUPPORT_AND_SOLID_LEGALITY' | 'ATTACHMENT_NONVACUITY' | 'TEMPORAL_LIFECYCLE'
  | 'PROVENANCE_CLOSURE' | 'EVIDENCE_GATE' | 'PRIVACY_NONDISCLOSURE'
  | 'OCCLUSION_ORDER' | 'LIGHT_SOURCE_CLOSURE' | 'SHADOW_PROVENANCE'
  | 'VISIBLE_DRAW_EXPORT_PARITY' | 'HIT_REGION_INVARIANCE' | 'CUSTOM_CONTENT_PARITY'
  | 'DETERMINISTIC_REPLAY' | 'PERFORMANCE_BUDGET';
type RegisteredCensusId = string & { readonly __registeredCensusId: unique symbol };
type CensusId = CoreCensusId | RegisteredCensusId;

type CoreOperationKind =
  | 'CONSTRUCT' | 'DEMOLISH' | 'REPAIR' | 'REPLACE' | 'REUSE' | 'CONVERT'
  | 'RELOCATE' | 'ABANDON' | 'ASCEND' | 'DESCEND' | 'TRANSFER_CAPACITY'
  | 'REGISTER_FANTASY_WORK' | 'AUTHOR_SPATIAL_FACT' | 'IMPORT_SPATIAL_FACT';
type RegisteredOperationKindId = string & { readonly __registeredOperationKindId: unique symbol };
type OperationKind = CoreOperationKind | RegisteredOperationKindId;

interface ExecutableVocabularyRegistry {
  artifactKind: 'EXECUTABLE_VOCABULARY';
  artifactId: ArtifactId;
  schemaVersion: number;
  coreArtifactKinds: readonly CoreArtifactKind[];
  registeredArtifactKinds: readonly RegisteredArtifactKindId[];
  coreCensuses: readonly CoreCensusId[];
  registeredCensuses: readonly RegisteredCensusId[];
  coreOperationKinds: readonly CoreOperationKind[];
  registeredOperationKinds: readonly RegisteredOperationKindId[];
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type HistoricalEvidenceProtocolId = 'HEEP-1' | 'UCF-1' | 'AMP-1' | 'RSLP-1';

type ProtocolIdForDomain<D extends HistoricalEvidenceDomain> =
  D extends 'URBAN_MORPHOLOGY' ? 'HEEP-1' | 'UCF-1' :
  D extends 'ARCHITECTURAL_MASSING' ? 'AMP-1' : 'RSLP-1';

type EvidenceScopeRequirement = {
  scopePackId: string;
  scopePackManifestRef: ArtifactHashRef;
  protocolVersion: string;
  lawVersion: LawVersion;
} & (
  | { domain: 'URBAN_MORPHOLOGY'; protocolId: 'HEEP-1' | 'UCF-1' }
  | { domain: 'ARCHITECTURAL_MASSING'; protocolId: 'AMP-1' }
  | { domain: 'RURAL_LANDSCAPE'; protocolId: 'RSLP-1' }
);

type StageNonEvidenceGateAtom =
  | { kind: 'ALWAYS_ACTIVE' }
  | { kind: 'CANONICAL_INPUT'; requiredInputSlot: string; requiredInputKind: ArtifactKind }
  | { kind: 'FEATURE_GATE'; gateRegistryRef: ArtifactHashRef;
      gateId: string & { readonly __featureGateId: unique symbol } };

type StageNonEvidenceGateExpression =
  | StageNonEvidenceGateAtom
  | { kind: 'ALL'; gates: readonly [StageNonEvidenceGateExpression,
        ...StageNonEvidenceGateExpression[]] }
  | { kind: 'ANY'; gates: readonly [StageNonEvidenceGateExpression,
        ...StageNonEvidenceGateExpression[]] };

type StageGateExpression =
  | StageNonEvidenceGateExpression
  | { kind: 'EVIDENCE_REQUIRED'; requirement: EvidenceScopeRequirement;
      additionalGates: readonly StageNonEvidenceGateExpression[] };

interface ObservationAcceptancePolicy {
  effectKind: SpatialEffectKind;
  acceptedMethodIds: readonly string[];
  maxSpatialResolutionQ: WorldQ;
  maxTemporalResolutionQ: MeasureQ;
  maxHorizontalErrorBoundQ: WorldQ;
  maxExposureErrorBoundQ: RatioQ;
  minObservedCoverageQ: RatioQ;
}

type GenerationInputBinding =
  | { source: 'EXTERNAL_INPUT'; inputSlot: string; inputKind: ArtifactKind;
      externalRole: 'SPATIAL_REQUEST' | 'PROJECTION_REQUEST' | 'WORLD_FACT'
        | 'OBSERVATION' | 'REGISTRY' | 'LAW' }
  | { source: 'NODE_OUTPUT'; inputSlot: string; inputKind: ArtifactKind;
      producerNodeId: GenerationNodeId; producerOutputIndex: number };

type GenerationNodeId = string & { readonly __generationNodeId: unique symbol };

type GenerationOutputAuthorityContract =
  | { kind: 'NONE' }
  | { kind: 'CANONICAL_OPERATION'; operationKind: OperationKind }
  | { kind: 'HISTORICAL_MECHANISM'; mechanismDefinitionRef: ArtifactHashRef }
  | { kind: 'OBSERVATION_LAW'; lawManifestRef: ArtifactHashRef };

interface GenerationNodeManifest {
  nodeId: GenerationNodeId;                 // unique internal DAG node, e.g. S11.D3a / S11.D3b
  publicStageId: StageId;                    // stable public S0–S23 identity
  module: string;
  inputBindings: readonly GenerationInputBinding[];
  outputContracts: readonly [{ outputKind: ArtifactKind;
      receiptKind: HistoricalEffectReceiptKind | 'NONE';
      authority: GenerationOutputAuthorityContract }, ...{
      outputKind: ArtifactKind;
      receiptKind: HistoricalEffectReceiptKind | 'NONE';
      authority: GenerationOutputAuthorityContract }[]];
  allowedImports: readonly string[];
  randomNamespaces: readonly string[];
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  executableVocabularyRef: ArtifactHashRef;
  mechanismRegistryRef?: ArtifactHashRef;   // required for HISTORICAL_MECHANISM output contracts
  invariants: readonly CensusId[];
  invalidationRoots: readonly ArtifactKind[];
  gate: StageGateExpression;
  observationAcceptance: readonly ObservationAcceptancePolicy[];
}

interface GenerationManifest {
  artifactKind: 'GENERATION_MANIFEST';
  artifactId: ArtifactId;
  schemaVersion: number;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  executableVocabularyRef: ArtifactHashRef;
  customParityFixtureRegistryRef: ArtifactHashRef;
  requiredReleaseCensuses: readonly ['CUSTOM_CONTENT_PARITY', ...CensusId[]];
  nodes: readonly [GenerationNodeManifest, ...GenerationNodeManifest[]];
  topologicalNodeIds: readonly [GenerationNodeId, ...GenerationNodeId[]];
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}
```

CI generates or checks the internal-node DAG grouped under stable public S0–S23 IDs, schema/ABI versions, random namespaces, import boundaries,
metrics/censuses and invalidation declarations from this authority. It refuses undeclared stage
imports, lateral/downstream reads, unregistered randomness, generator reads of tier/authorship, and
manifest/source disagreement. Multi-output work such as S22 declares a nonempty ordered
output-contract list; mixed-gate work such as S11 is split into distinct nodes (`S11.D3a`
canonical-input compiler,
`S11.D3b` evidence-conditioned resolver) rather than weakening one stage-wide gate. Every node
declares a typed gate expression. An evidence-conditioned node uses the discriminated
`EVIDENCE_REQUIRED` branch; compiler execution requires its scope requirement to equal the
executing mechanism and the corresponding compile-input domain binding exactly. Existing prose
tables remain human-readable projections of the manifest; two competing authorities are forbidden.
Evidence never appears under general `ANY`: that operator exists only in the non-evidence grammar,
while `EVIDENCE_REQUIRED` dominates every additional gate and cannot be satisfied by
`ALWAYS_ACTIVE`. `CANONICAL_INPUT` identifies the exact declared input slot and kind, not merely an
artifact kind available elsewhere; `FEATURE_GATE` resolves a closed gate registry and registered ID.
The validator rejects nested bypasses, free gate strings, wrong slots or differing evidence
requirements. Each
ordered output contract names either its exact historical-effect receipt kind or `NONE`; duplicate
outputs, undeclared receipts and effects that do not resolve an exact output index/kind are failures.
Each output also declares its exact authority family. HISTORICAL_MECHANISM requires the exact
definition ref and matching registry used by the spatial request; CANONICAL_OPERATION requires its
registered operation kind; OBSERVATION_LAW requires its law manifest; NONE cannot emit a causal
receipt. Nonhistorical branches cannot impersonate a promoted definition, and a receipt's authority
must byte-equal the referenced output contract.
A `GenerationManifest` is the sole immutable owner of the unique node roster and DAG. Node IDs are
unique, `topologicalNodeIds` is the uniquely derived stable topological order, and every input/output, gate,
receipt, census, operation and registered vocabulary ID resolves under its exact manifest bytes.
Every input slot is unique and names either a closed external request/fact role or one exact producer
node/output index whose kind equals `inputKind`; no consumer selects merely “some producer of this
artifact kind.” Producer edges determine the DAG. Missing/ambiguous producers, wrong indices/kinds,
lateral reads, cycles or a supplied order that differs from the derived order fail.
The spatial compile request, canonical spatial artifact, projection request/root and MapDocument all
carry the same manifest ref; output/input law and ABI equal it. A free node array or stage label
outside that hash chain has no execution authority.
A node's `executableVocabularyRef` resolves the one versioned registry used by its artifact,
census and operation IDs. Core arrays must equal the closed unions exactly in canonical order;
registered IDs are valid only when present in that exact registry and accompanied by the owning
schema/operation contract. Unknown, stale, cross-registry or free string IDs fail before DAG
construction. The manifest, generated TypeScript/JSON Schema and human tables are projections of
that same registry, with negative fixtures for every unknown/stale kind.
A stage consuming a spatial observation must declare exactly one matching acceptance policy and
reject receipts whose method, resolution/error bounds or coverage fall outside it; producers and
non-consumers declare an empty list. The manifest validator refuses an observation input without a
policy or a policy with no declared input. Coverage is recomputed from the exact observed-region,
eligible-denominator and containment-proof artifact refs; a self-declared ratio is never accepted.
An observation with `coverage.kind='NOT_APPLICABLE'` cannot satisfy a spatial causal consumer's
minimum-coverage gate.

The counterfactual contract is component- and direction-aware. Before execution, each expected
token names an exact `{entityId, componentPath, directionalPredicateId, toleranceId}`. Let `E` be
that registered token set, `A` the observed `{entityId, componentPath}` tokens whose values moved
beyond their registered tolerances, `M` the members of `E` whose directional predicate passed, `D`
the changed expected tokens whose directional predicate failed, and `F` the forbidden component
tokens. Token identity ignores the predicate/tolerance suffix when intersecting `A` with `E` or `F`.
The benchmark must prove `E ∩ F = ∅` before it runs.

```
DirectionalResponsiveness = |M| / |E|
CausalPrecision            = |M| / |A|
CollateralShare            = |A \ E| / |A|
DirectionalViolationShare  = |D| / |A ∩ E|
hard safety                = A ∩ F = ∅
```

Zero-denominator handling is declared per benchmark before execution; it may not be improvised after
the result. A correct-direction change below tolerance is not counted in `A` or `M`; a wrong-direction
change is counted in `A` and `D`, not `M`; an unpredicted changed component is collateral. Thus
collateral is not merely the complement of precision. The manifest records `E`, every directional
predicate/tolerance and `F` before perturbation. The harness reports all four fractions plus raw
`E/A/M/D/F` sets, and the forbidden intersection is a hard RED independent of any average score.
Responsiveness without precision, direction and the forbidden set is incomplete.

### §10.15 · STREETGRAPH AND DCEL — semantic routes and cadastral faces are not the same object

`StreetGraph` remains route, access and street-role truth. A DCEL (half-edge topology) is the objectively stronger owner for S8/S9 planar faces, holes, adjacency, frontage and parcel boundaries. It does not replace the semantic graph and it does not cut over in one wave.

The DCEL input is a versioned, support-aware `CadastralBoundaryArrangement`, not an undefined graph
shortcut. It is constructed from quantized street right-of-way boundaries emitted by
`StreetGeometry`, together with active wall faces, water/shore boundaries, cliff or escarpment
boundaries and any other S8-registered hard block boundary. Intersections node only on the same
support surface. A bridge, tunnel or other grade-separated crossing remains topologically separate
unless a registered connection joins its two supports. `StreetGraph` supplies route semantics and
lineage; it is not itself a polygon boundary.

The migration runs dual in two deliberately separated gates:

1. **D1 foundation:** construct the DCEL from the sealed `CadastralBoundaryArrangement`; compare
   face/hole census, boundary orientation, adjacency, point-location and S8 legality verdicts against
   the legacy accessor over fixtures and fuzzed seeds;
2. **post-W3 ownership:** only after fresh W3 has produced frontage and parcel truth, compare
   frontage ownership, parcel boundaries and lineage against the legacy W3 path;
3. prove stable lineage mapping and bounded overhead: at most **1.50× peak memory** and **1.25×
   S7–S10 p95** against the sealed legacy accessor over the registered fixture/seed matrix, unless a
   later owner-ratified budget row names replacement ceilings before the run;
4. keep consumers on the legacy accessor until every equivalence gate passes;
5. cut one accessor at a time; retain the differential oracle through the next declared-shift wave.

Polygon soup, universal Voronoi parcels and a global constrained optimizer remain refused. DCEL is a topology representation, not a city-generating theory.

### §10.16 · THE REVISED BUILD ORDER — preserve wave ids, repair their prerequisites

1. **QUARANTINE THE KILLED W3 TIP.** It is evidence, not a base: partial loop surgery touched the shared offset path, left duplicate crossing machinery and did not complete the lane. Preserve it byte-for-byte for diffing.
2. **D0 starts from the sealed W2 base.** Preserve the legacy simple-offset output exactly when valid; invoke a versioned robust repair only on diagnosed invalid cases, or declare a new-law shift. "Correct offset agrees exactly everywhere" is not a mathematical requirement a new algorithm can satisfy.
3. **Foundation/D1:** executable manifest, coordinate/hash ABI, published fixed-point storage,
   support surfaces, exact solid legality, temporal spatial-receipt seam and the
   `CadastralBoundaryArrangement`/DCEL face-adjacency dual-run harness. Frontage/parcel equivalence is
   explicitly not a D1 exit because those artifacts do not yet exist.
4. **Resume W3 fresh** against those predicates; never continue the killed tip by accumulation. Then
   run the post-W3 frontage/parcel DCEL equivalence gate before any accessor cutover.
5. **D2:** instruments first — G-51P projection metrics, directional responsiveness, causal
   precision, collateral/direction-violation reporting, solid/occlusion fixtures, open
   real-historical street-structure comparison and the closed legacy pixel-evaluation protocol.
   `AMP-1`/G-51W runs as the separate architectural-world evidence program and never borrows its
   height/storey/pitch/material targets from D2's pixels.
6. **D3a:** composite massing types, functional-volume/floor distinctions, an explicit-input analytic
   roof compiler, component-local material slots and vegetation mass. The provenance origin schema
   mints with the final entity boundary here; live generation remains byte-identical. **D3b** is the
   later `AMP-1` activation lane for function-conditioned heights/storeys/roofs and material
   resolution. It is not part of the foundation receipt and is not a prerequisite for testing
   canonical geometry or projection against supplied fixtures.
7. **D4:** all-solid spatial index, view-occlusion scene, projection light sources, silhouette-derived receiver shadows, V/T-separated per-light illumination, hit regions, per-face tone and temporal dress. World solar exposure is a separate receipt lane.
8. **D5/D6:** registered strata, floating-land lifecycle and sky only after receipt-cycle, connection, volume, occlusion and conservation gates are green.
9. **A0–A5:** document migration/provenance first, portrait commands next, canonical proposals only after the core operation adapter exists. Frontage-dependent authoring stays parked until S9's frontage truth exists.

No dimensional/authorship work lands directly from the dirty ledger worktree. Each wave uses an exact sandbox base, exact manifest, scoped patch and measured receipt; unrelated owner work remains untouched.

**CURRENT STATUS OVERRIDE (2026-08-20).** Earlier S0–S23 BUILT/PARTIAL/MISSING labels are the
snapshot at the time that table was written; they are not silently refreshed evidence.

| program item | current evidenced state |
|---|---|
| W0 | closed with instruments/verification receipts |
| W1 / W1B | landed/closed in the sandbox program |
| W2 | lane completed and outputs/receipt exist; its own exit report is 7 met, 2 partial, 1 not built |
| W3 | **killed mid-lane**; no receipt, changed tests, manifest or W3 output set — not a result |
| §§6–§9 dimensional/authorship | design-only; no `DimensionalScene`, canonical `MassPartQ[]`, `MapDocument` or typed authoring implementation landed |
| §275 historical cohort/counterfactual/halo | design-only, not executed |
| §287 | architecture, governance and corpus-instrument repair only; no generator wave dispatched |

The owed Fable retrovalidation over §238–§274 remains a governance prerequisite. A targeted green
corpus gate or sandbox test is never reported as a green application tree.

### §10.17 · CORPUS AND DOCUMENT DISPOSITION — what the survey actually licenses

The corpus closes mechanically at **313 full plates = 313 previews = 313 CSV/calibration ids**, with
a closed **53-image legacy pixel-evaluation roster**. It is **not an untouched calibration
holdout**: all 313 images were previously viewed/measured, aggregate figures include them, and
earlier study/spec prose reasons from some ids that later entered the final roster. Removing those
citations now cannot restore blindness. A fresh evaluator can still withhold the 53 image files
from a new implementation lane and use them as a within-family pixel-evaluation subset. That proves
inventory/evaluation discipline, not historical independence. The images are synthetic aesthetic
evidence from related generation processes, and the roster has no trade/institution coverage.

The validation stack is therefore four different tests:

1. development corpus for visual-register discovery/calibration;
2. closed same-family legacy pixel roster, withheld from fresh implementation/evaluation lanes but
   explicitly **not** claimed as never studied;
3. registered historical evidence cohort for structural comparison; citation-only sources contribute
   bounded factual claims, and geometry enters only under an explicit compatible licence;
4. registered counterfactual causal benchmark for responsiveness **and causal precision**.

Vertical dimensions, prosperity laws and historical causation require external historical/architectural evidence records with region, period, function, sample, uncertainty and confidence. Corpus resemblance alone may never promote them into WORLD.

| older authority | binding disposition |
|---|---|
| `DESIGN_SETTLEMENT_MAP.md` | historical V1 implementation contract; library placement, hover legibility and **one truth** survive; view-time-only geometry and cosmetic-only reroll do not |
| `THE_MAP_SUITE_CONSTITUTION.md` | four-map/projection program superseded by one strict-plan map and one leaf; composite institution silhouette and deterministic DrawOps survive |
| `THE_ARCHITECTURE_KERNEL_3D.md` | retired from the settlement-map critical path; may inform a separately authorised future building inspector, never a dependency of this plate |
| `VISION_IDEALIZED_FINAL_PRODUCT.md` map paragraph | product intent survives; "pure dossier projection" is replaced by a canonical spatial artifact derived from dossier + dated world history, with typed authored constraints/operations |
| historical massing/workplan/prosperity/reconciliation reports | reference only; surviving manifest, DCEL, vegetation, occlusion, per-light and temporal-receipt seams are folded here; oblique/dual-profile/GI/global-optimizer proposals remain superseded |

### §10.18 · THE LIVE INSERTION ARCHITECTURE — four map authorities become one

The current product is not the dimensional architecture yet. It has four different candidates:

| current system | disposition |
|---|---|
| shipped `TownMapModel` | legacy V1/V2 reader and migration oracle only; its radial wedges, institution symbols and centroid wall are not the new fabric |
| hidden `townCartography/**` | do not extend as a second generator; its useful privacy/digest/budget envelope is retained around the new compiler |
| sandbox `fabric/**` | sole candidate geometry authority after W3 validity/frontage repair; port stages, predicates and lineage rather than its opaque SVG wrapper |
| dormant `arch/**` | optional future per-building detail provider after canonical `MassPartQ[]`; never the settlement-map authority and never a tilted/GPU dependency |

⛔ **DIMENSIONAL ADAPTER REFUSAL.** Sandbox `landmark.size`, `success`, `rung`, anonymous
`institutionShapes.solids[]` and decorative ridge/bay marks are 2D footprint/presentation
hypotheses only. They carry no part identity, support, closed solid, floor programme, roof campaign,
material component or construction event and may never be cast to `MassPartQ` by convenience. The
current institution-success fallback and its 2D size multiplier likewise do not imply height,
material, capital or part count. The
future D3b resolver must mint those facts through lineage, volume legality and promoted `AMP-1`
mechanisms. Stale sandbox comments about “culture profiles,” “cross-cultural constants” or
setting-agnostic forms do not survive the port; the actual `cultureId` remains absent from the
spatial derivation graph.

The product seam is one bounded, versioned adapter:

```ts
type HistoricalEvidenceDomain =
  | 'URBAN_MORPHOLOGY' | 'ARCHITECTURAL_MASSING' | 'RURAL_LANDSCAPE';

type HistoricalEvidenceDomainBinding<D extends HistoricalEvidenceDomain> =
  | {
      domain: D;
      status: 'SUPPORTED';
      scopePackId: string;
      scopePackManifestRef: ArtifactHashRef;
      protocolId: ProtocolIdForDomain<D>;
      protocolVersion: string;
      lawVersion: LawVersion;
      limitationIds: readonly string[];
    }
  | {
      domain: D;
      status: 'STRUCTURAL_ONLY' | 'UNSUPPORTED';
      scopePackId?: never;
      scopePackManifestRef?: never;
      protocolId?: never;
      protocolVersion?: never;
      lawVersion?: never;
      limitationIds: readonly string[];
      nonAuthorizingAuditRefIds?: readonly string[];
    };

interface HistoricalEvidenceScopeBinding {
  artifactKind: 'EVIDENCE_SCOPE';
  artifactId: ArtifactId;
  schemaVersion: number;
  mapTraditionId: 'EUROPEAN_FANTASY_BASE';
  domains: {
    urban: HistoricalEvidenceDomainBinding<'URBAN_MORPHOLOGY'>;
    massing: HistoricalEvidenceDomainBinding<'ARCHITECTURAL_MASSING'>;
    rural: HistoricalEvidenceDomainBinding<'RURAL_LANDSCAPE'>;
  };
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface BaseWorldSnapshotArtifact {
  artifactKind: 'BASE_WORLD';
  artifactId: ArtifactId;
  schemaVersion: number;
  worldId: EntityId;
  revisionId: EntityId;
  effectiveAt: TimeKey;
  eventLedgerRef: ArtifactHashRef;
  lawManifestRef: ArtifactHashRef;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface BaseDossierSnapshotArtifact {
  artifactKind: 'BASE_DOSSIER';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  sourceWorldRef: ArtifactHashRef;
  effectiveAt: TimeKey;
  dossierSchemaRef: ArtifactHashRef;
  payloadRef: ArtifactHashRef;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type CadastralBoundarySupport =
  | { kind: 'PLANAR_SURFACE'; leafIndex: 0 }
  | { kind: 'GROUND_SURFACE'; surface: GroundSurfaceRef };

interface CadastralBoundaryQ {
  boundaryId: EntityId;
  role: 'STREET_RIGHT_OF_WAY' | 'WALL_FACE' | 'WATER_OR_SHORE'
    | 'CLIFF_OR_ESCARPMENT' | 'REGISTERED_HARD_BLOCK';
  support: CadastralBoundarySupport;
  geometry: PolylineQ;
  sourceRef: ArtifactHashRef;
  provenanceRef: ProvenanceRef;
}

interface CadastralBoundaryArrangement {
  artifactKind: 'CADASTRAL_BOUNDARY_ARRANGEMENT';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  effectiveAt: TimeKey;
  boundaries: readonly [CadastralBoundaryQ, ...CadastralBoundaryQ[]];
  coordinateAbiRef: ArtifactHashRef;
  lawManifestRef: ArtifactHashRef;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface CanonicalFabricArtifact {
  artifactKind: 'FABRIC';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  effectiveAt: TimeKey;
  streetGraphRef: ArtifactHashRef;
  streetGeometryRef: ArtifactHashRef;
  cadastralBoundaryArrangementRef: ArtifactHashRef;
  dcelRef: ArtifactHashRef;
  frontageRegistryRef: ArtifactHashRef;
  parcelRegistryRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  lawManifestRef: ArtifactHashRef;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface CanonicalSpatialOperationsArtifact {
  artifactKind: 'OPERATIONS';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  effectiveAt: TimeKey;
  operationRefs: readonly ArtifactHashRef[]; // canonical empty artifact has []
  executableVocabularyRef: ArtifactHashRef;
  lawManifestRef: ArtifactHashRef;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface CanonicalArchitecturalMassingPhase {
  artifactKind: 'MASSING_PHASE';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  effectiveAt: TimeKey;
  bodies: readonly [MassBody, ...MassBody[]];
  attachments: readonly MassAttachment[];   // phase-owned once; may relate parts across bodies
  changeOperationRefs: readonly ArtifactHashRef[];
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

// CanonicalArchitecturalMassingPhase.attachments is the single ordered registry for intra- and
// inter-body relations. Every endpoint resolves once, attachment ID and canonical unordered
// endpoint-pair/kind keys are unique, and neither body may re-own it. Phase hash, volume law and
// non-vacuity census all read this registry.

type CanonicalKnowledgePayload<T> =
  | { status: 'KNOWN'; value: T }
  | { status: 'UNKNOWN'; reason: 'NOT_AVAILABLE' | 'OUTSIDE_COVERAGE' | 'NOT_APPLICABLE';
      provenanceRef: ProvenanceRef };

type SpatialCompileFactRole =
  | 'ROOT_SEED' | 'TERRAIN' | 'PROSPERITY' | 'POPULATION' | 'INSTITUTIONS'
  | 'RESOURCES' | 'NEIGHBOURS' | 'DEFENCES' | 'REGION' | 'ECONOMIC_FLOWS'
  | 'MAGIC_STATE' | 'CAPACITY_OCCUPATION' | 'ECONOMIC_CAPACITY' | 'SUPPLY'
  | 'AUTHORITY_RELATIONS';

interface CanonicalFactProjectionArtifact<R extends SpatialCompileFactRole, P> {
  artifactKind: 'CANONICAL_FACT_PROJECTION';
  artifactId: ArtifactId;
  schemaVersion: number;
  role: R;
  settlementId: EntityId;
  effectiveAt: TimeKey;
  sourceWorldRef: ArtifactHashRef;
  sourceDossierRef?: ArtifactHashRef;
  payloadSchemaRef: ArtifactHashRef;
  vocabularyRegistryRef: ArtifactHashRef;
  payload: CanonicalKnowledgePayload<P>;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface CanonicalFactArtifactRef<R extends SpatialCompileFactRole> extends ArtifactHashRef {
  role: R;
}

type MagicCapabilityBandId = string & { readonly __magicCapabilityBandId: unique symbol };
type CapacityClassId = string & { readonly __capacityClassId: unique symbol };
type EconomicCapacityClassId = string & { readonly __economicCapacityClassId: unique symbol };
type SupplyClassId = string & { readonly __supplyClassId: unique symbol };

interface CanonicalFactSnapshotBase {
  schemaVersion: number;
  settlementId: EntityId;
  effectiveAt: TimeKey;
  registryRef: ArtifactHashRef;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
}

interface CanonicalMagicState extends CanonicalFactSnapshotBase {
  kind: 'CANONICAL_MAGIC_STATE';
  level: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  capabilityBandIds: readonly MagicCapabilityBandId[];
  maintainedWorkOperationRefs: readonly ArtifactHashRef[];
}

interface CapacityOccupationEntry {
  subjectId: EntityId;
  capacityClassId: CapacityClassId;
  availableQ: MeasureQ;
  occupiedQ: MeasureQ;
  unitDimensionId: string;
  lifecycle: { constructedAt: TimeKey; removedAt?: TimeKey };
  provenanceRef: ProvenanceRef;
}

interface CanonicalCapacityOccupation extends CanonicalFactSnapshotBase {
  kind: 'CANONICAL_CAPACITY_OCCUPATION';
  entries: readonly CapacityOccupationEntry[];
}

interface EconomicCapacityEntry {
  subjectId: EntityId;
  capacityClassId: EconomicCapacityClassId;
  amountQ: MeasureQ;
  lifecycle: { activeFrom: TimeKey; inactiveFrom?: TimeKey };
  provenanceRef: ProvenanceRef;
}

interface CanonicalEconomicCapacity extends CanonicalFactSnapshotBase {
  kind: 'CANONICAL_ECONOMIC_CAPACITY';
  entries: readonly EconomicCapacityEntry[];
}

interface SupplyEntry {
  subjectId: EntityId;
  supplyClassId: SupplyClassId;
  amountQ: MeasureQ;
  sourceOperationRefs: readonly ArtifactHashRef[];
  lifecycle: { activeFrom: TimeKey; inactiveFrom?: TimeKey };
  provenanceRef: ProvenanceRef;
}

interface CanonicalSupply extends CanonicalFactSnapshotBase {
  kind: 'CANONICAL_SUPPLY';
  entries: readonly SupplyEntry[];
}

type CanonicalSpatialOperationAuthority =
  | { kind: 'CORE_OPERATION'; authorityRef: ArtifactHashRef }
  | { kind: 'REGISTERED_FANTASY_MECHANISM'; mechanismRegistryRef: ArtifactHashRef;
      mechanismDefinitionRef: ArtifactHashRef; contentRegistryBundleRef: ArtifactHashRef }
  | { kind: 'AUTHORED_DECISION'; commandRef: ArtifactHashRef }
  | { kind: 'IMPORTED_OPERATION'; importReceiptRef: ArtifactHashRef };

interface CanonicalSpatialOperation {
  artifactKind: 'CANONICAL_SPATIAL_OPERATION';
  artifactId: ArtifactId;
  schemaVersion: number;
  operationId: EntityId;
  operationKind: OperationKind;
  executableVocabularyRef: ArtifactHashRef;
  settlementId: EntityId;
  effectiveAt: TimeKey;
  authority: CanonicalSpatialOperationAuthority;
  beforeArtifactRefs: readonly ArtifactHashRef[];
  payloadRef: ArtifactHashRef;
  cause: CauseDisposition;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type CalendarSeasonId = string & { readonly __calendarSeasonId: unique symbol };
type ObservationOccasionId = string & { readonly __observationOccasionId: unique symbol };

interface CalendarSeasonRef {
  calendarRef: ArtifactHashRef;             // closed calendar/season registry
  seasonId: CalendarSeasonId;
}

type ObservationSeasonDisposition =
  | { status: 'KNOWN'; season: CalendarSeasonRef }
  | { status: 'SEASONLESS'; reason: 'CALENDAR_NOT_APPLICABLE' | 'FIXED_NON_SEASONAL_VIEW' }
  | { status: 'UNKNOWN'; reason: 'SOURCE_SILENT' | 'CALENDAR_UNRESOLVED' };

type ObservationOccasionDisposition =
  | { status: 'KNOWN'; occasionIds: readonly [ObservationOccasionId, ...ObservationOccasionId[]] }
  | { status: 'NONE' }
  | { status: 'UNKNOWN'; reason: 'SOURCE_SILENT' | 'STATE_UNRESOLVED' };

interface TemporalObservation {
  artifactKind: 'TEMPORAL_OBSERVATION';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  sourceSpatialRef: ArtifactHashRef;
  observedAt: TimeKey;
  selectedSpatialEffectiveAt: TimeKey;
  season: ObservationSeasonDisposition;
  occasion: ObservationOccasionDisposition;
  orderedSources: readonly [{
    role: 'WORLD_CLOCK' | 'ACTIVE_LIGHT_STATE' | 'VEGETATION_OBSERVATION'
        | 'CALENDAR' | 'OCCASION_STATE' | 'CELESTIAL_OBSERVATION'
        | 'ENVIRONMENTAL_LIGHT_STATE';
    ref: ArtifactHashRef;
  }, ...{
    role: 'WORLD_CLOCK' | 'ACTIVE_LIGHT_STATE' | 'VEGETATION_OBSERVATION'
        | 'CALENDAR' | 'OCCASION_STATE' | 'CELESTIAL_OBSERVATION'
        | 'ENVIRONMENTAL_LIGHT_STATE';
    ref: ArtifactHashRef;
  }[]];
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface MapSceneRootBase {
  artifactKind: 'MAP_SCENE_ROOT';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  leafIndex: LeafIndex;
  projectionRequestRef: ArtifactHashRef;
  generationManifestRef: ArtifactHashRef;
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  sourceSpatialRef: ArtifactHashRef;
  observationRef: ArtifactHashRef;
  leafRosterRef: ArtifactHashRef;
  viewProfileRef: ArtifactHashRef;
  lightProfileRef: ArtifactHashRef;
  audiencePolicyRef: ArtifactHashRef;
  contentRegistryBundleRef: ArtifactHashRef;
  contentResolutionReportRef: ArtifactHashRef;
  visiblePrimitiveSetRef: ArtifactHashRef;
  drawListRef: ArtifactHashRef;
  hitRegionSetRef: ArtifactHashRef;
  chromeRef: ArtifactHashRef;
  coordinateAbiVersion: number;
  lawVersion: LawVersion;
  contentHash: ContentHash;
}

type MapSceneRoot =
  | (MapSceneRootBase & {
      representationLaw: 'PLANAR_V1';
      dimensionalSceneRef?: never;
      spatialOcclusionIndexRef?: never;
      viewOcclusionSceneRef?: never;
      illuminationRefs: readonly [];
      perceptualCompositeRef?: never;
      projectionEffectRef?: never;
    })
  | (MapSceneRootBase & {
      representationLaw: 'DIMENSIONAL_V1';
      dimensionalSceneRef: ArtifactHashRef;
      spatialOcclusionIndexRef: ArtifactHashRef;
      viewOcclusionSceneRef: ArtifactHashRef;
      illuminationRefs: readonly [ArtifactHashRef, ...ArtifactHashRef[]];
      perceptualCompositeRef: ArtifactHashRef;
      projectionEffectRef: ArtifactHashRef;
    });

interface SettlementMapSpatialCompileInputBase {
  artifactKind: 'SPATIAL_COMPILE_INPUT';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  baseWorldRef: ArtifactHashRef;
  baseDossierRef: ArtifactHashRef;
  generationManifestRef: ArtifactHashRef;
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  rootSeedRef: CanonicalFactArtifactRef<'ROOT_SEED'>;
  mapTraditionId: 'EUROPEAN_FANTASY_BASE';
  historicalEvidenceScopeRef: ArtifactHashRef;
  historicalMechanismRegistryRef: ArtifactHashRef;
  contentRegistryBundleRef: ArtifactHashRef;
  spatialOperationsRef: ArtifactHashRef;   // exact CanonicalSpatialOperationsArtifact
  terrainFactRef: CanonicalFactArtifactRef<'TERRAIN'>;
  prosperityFactRef: CanonicalFactArtifactRef<'PROSPERITY'>;
  populationFactRef: CanonicalFactArtifactRef<'POPULATION'>;
  institutionFactsRef: CanonicalFactArtifactRef<'INSTITUTIONS'>;
  resourceAnalysisRef: CanonicalFactArtifactRef<'RESOURCES'>;
  neighbourFactsRef: CanonicalFactArtifactRef<'NEIGHBOURS'>;
  defenceFactsRef: CanonicalFactArtifactRef<'DEFENCES'>;
  regionFactRef: CanonicalFactArtifactRef<'REGION'>;
  economicFlowFactsRef: CanonicalFactArtifactRef<'ECONOMIC_FLOWS'>;
  ruralLandscapeRef: ArtifactHashRef;       // exact phase or canonical empty artifact
  vegetationPhaseRef: ArtifactHashRef;      // exact CanonicalVegetationPhase or canonical empty
  magicStateRef: CanonicalFactArtifactRef<'MAGIC_STATE'>;
  capacityOccupationRef: CanonicalFactArtifactRef<'CAPACITY_OCCUPATION'>;
  economicCapacityRef: CanonicalFactArtifactRef<'ECONOMIC_CAPACITY'>;
  supplyRef: CanonicalFactArtifactRef<'SUPPLY'>;
  authorityRelationsRef: CanonicalFactArtifactRef<'AUTHORITY_RELATIONS'>;
  coordinateAbiVersion: number;
  lawVersion: LawVersion;
  contentHash: ContentHash;
}

type SettlementMapSpatialCompileInput =
  | (SettlementMapSpatialCompileInputBase & {
      representationLaw: 'PLANAR_V1';
      groundSurfaceRegistryRef?: never;
      architecturalMassingRef?: never;
    })
  | (SettlementMapSpatialCompileInputBase & {
      representationLaw: 'DIMENSIONAL_V1';
      groundSurfaceRegistryRef: ArtifactHashRef;
      architecturalMassingRef: ArtifactHashRef;
    });

// Spatial compilation never consumes nominal/free-form fact placeholders. Every `*FactRef`,
// including the six sky/fantasy inputs, resolves one `CanonicalFactProjectionArtifact` whose role
// matches the input slot and whose sourceWorld/sourceDossier, settlement/effective time, schema,
// payload schema, vocabulary registry, law and provenance match the request/manifest. Optional
// knowledge lives inside that artifact's total KNOWN/UNKNOWN payload; UNKNOWN cannot carry a value
// and never triggers a fallback. Array-valued authority/operation facts therefore have the same
// snapshot identity and temporal envelope as scalar facts. Inline strings/numbers, undefined
// `*Fact` aliases, wrong-role refs or off-ledger discovery are invalid compile inputs.

interface SettlementMapProjectionInput {
  artifactKind: 'PROJECTION_INPUT';
  artifactId: ArtifactId;
  schemaVersion: number;
  settlementId: EntityId;
  representationLaw: 'PLANAR_V1' | 'DIMENSIONAL_V1';
  sourceSpatialRef: ArtifactHashRef;
  generationManifestRef: ArtifactHashRef;
  lawManifestRef: ArtifactHashRef;
  coordinateAbiRef: ArtifactHashRef;
  observationRef: ArtifactHashRef;
  leafRosterRef: ArtifactHashRef;
  leafIndex: LeafIndex;
  viewProfileRef: ArtifactHashRef;
  lightProfileRef: ArtifactHashRef;
  audiencePolicyRef: ArtifactHashRef;
  contentResolutionReportRef: ArtifactHashRef;
  coordinateAbiVersion: number;
  lawVersion: LawVersion;
  contentHash: ContentHash;
}

type SettlementMapExportFormat = 'SCREEN_PNG' | 'PNG' | 'SVG' | 'PDF' | 'PRINT'
  | 'THUMBNAIL';

type ExportLightChoice =
  | { kind: 'DEFAULT_CANONICAL'; lens: 'DAY'; conventionId: 'HIGH_NOON_V1' }
  | { kind: 'DEFAULT_CANONICAL'; lens: 'NIGHT'; conventionId: 'HIGH_MOON_V1' }
  | { kind: 'PINNED_DOCUMENT'; projectionSettingsRef: ArtifactHashRef }
  | { kind: 'WORLD_TIME'; observationRef: ArtifactHashRef; celestialLawRef: ArtifactHashRef }
  | { kind: 'CURRENT_FINALIZED'; lightProfileRef: ArtifactHashRef;
      allowedMode: 'FIXED_SURVEY' | 'PINNED_DOCUMENT' | 'WORLD_TIME_OBSERVATION' };

interface SettlementMapExportInput {
  artifactKind: 'EXPORT_INPUT';
  artifactId: ArtifactId;
  schemaVersion: number;
  baseProjectionRequestRef: ArtifactHashRef;
  contentResolutionReportRef: ArtifactHashRef;
  format: SettlementMapExportFormat;
  lightChoice: ExportLightChoice;
  deterministicRendererRef: ArtifactHashRef;
  crossFormatContractRef: ArtifactHashRef;
  temporaryProbeRef?: never;
  lawVersion: LawVersion;
  contentHash: ContentHash;
}

// Projection input validation is fail-closed: leafRosterRef resolves one roster whose
// sourceSpatialRef equals sourceSpatialRef, whose ascending leaf list is unique and contains
// surface leaf 0 exactly once, and whose selected leafIndex occurs exactly once with a nonempty
// registered substrate. SpatialOcclusionIndex carries that same roster ref and its activeLeaves
// equal roster.entries.map(e => e.leafIndex) byte-for-byte. Entries are strictly ascending, unique,
// contain exactly one surface entry, and every non-surface cause ref resolves active content on that
// leaf. An absent leaf or a roster from another spatial revision
// cannot produce a request, index, root or cache entry.

// TemporalObservation.orderedSources is a closed exact dependency roster, not a bag of optional
// context. Every consumed WORLD_CLOCK, ACTIVE_LIGHT_STATE, VEGETATION_OBSERVATION, CALENDAR,
// OCCASION_STATE, CELESTIAL_OBSERVATION and ENVIRONMENTAL_LIGHT_STATE artifact appears exactly once
// with its role and exact ID/hash; no unused or duplicate source is permitted. WORLD_TIME global
// sources and environmental composite/effect rows must resolve their refs in this same observation.
// A celestial/environmental/light/vegetation state from another observation is a negative fixture.

// Export never inherits pointer state. DEFAULT_CANONICAL resolves HIGH_NOON_V1 by day and
// HIGH_MOON_V1 by night. Pinned/world-time/current-finalized light requires explicit selection;
// CURRENT_FINALIZED rejects LIGHT_PROBE_PREVIEW. Every authoritative export recomputes through the
// deterministic fixed-point path even if a worker/GPU preview was shown. Screen, PNG, SVG, PDF,
// print and thumbnail consume the same visible/effect artifacts, while MapChrome/export metadata
// records the exact applied profile, convention/mode/emitter/angles, shadow/perceptual laws, clamp
// status and warnings.

type CompileRefusal =
  | 'REGION_DIRECTION_UNAVAILABLE'
  | 'NEIGHBOUR_BEARING_UNAVAILABLE'
  | 'ECONOMIC_FLOW_UNAVAILABLE'
  | 'HISTORICAL_EVIDENCE_SCOPE_UNSUPPORTED'
  | 'EVIDENCE_SCOPE_IDENTITY_MISMATCH'
  | 'MECHANISM_REGISTRY_IDENTITY_MISMATCH'
  | 'CONTENT_REGISTRY_IDENTITY_MISMATCH'
  | 'CUSTOM_CONTENT_UNRESOLVED'
  | 'RURAL_CANON_INCOMPLETE'
  | 'MASSING_CANON_INCOMPLETE'
  | 'DIMENSIONAL_MASSING_REQUIRED'
  | 'REPRESENTATION_LAW_MISMATCH'
  | 'MATERIAL_SYSTEM_SCOPE_MISMATCH'
  | 'MATERIAL_CANON_INCOMPLETE'
  | 'VEGETATION_CANON_INCOMPLETE'
  | 'BASE_WORLD_IDENTITY_MISMATCH'
  | 'BASE_DOSSIER_IDENTITY_MISMATCH'
  | 'TEMPORAL_OBSERVATION_REQUIRED'
  | 'AUDIENCE_POLICY_MISMATCH'
  | 'PUBLIC_LENS_LEAK'
  | 'SPATIAL_INPUT_SCHEMA_MISMATCH'
  | 'PROJECTION_INPUT_SCHEMA_MISMATCH';
```

`MapSceneRoot` is the only emitted product root. Its hash covers the exact projection request and
every ordered reference above.
For `DIMENSIONAL_V1`, the dimensional scene, all-leaf occlusion index, view scene, illuminations,
draw list, hit set and chrome cite the same exact spatial/observation/leaf/view and audience refs
where their contracts apply; illumination/composite/effect/draw/chrome also cite the selected light
profile. The hit set intentionally has no light/effect/style dependency and is a discriminated
PLANAR/DIMENSIONAL artifact, so a light-only change preserves its hash and geometry. A mismatch or
duplicate artifact ID refuses publication. The scene and index are
derived slices/indices, never co-owners of bodies. For `PLANAR_V1`, dimensional refs are
unrepresentable and the draw artifact must cite the same recorded planar spatial law. Screen,
PDF/SVG, thumbnail, token and hit testing all start from this root and cannot rebuild geometry.

Spatial compilation and projection are two acyclic requests. `SettlementMapSpatialCompileInput`
is itself hash-addressed, resolves `baseWorldRef`, `baseDossierRef`, the historical-evidence scope,
closed historical-mechanism registry and content-registry bundle,
the rural phase, vegetation phase and (for DIMENSIONAL) ground-surface and architectural-massing
registries before any
spatial node executes, and publishes `CanonicalSpatialArtifact`. It contains no observation,
selected leaf, view, light or audience field. `SettlementMapProjectionInput` then binds that exact
completed spatial artifact to one observation, roster/leaf, view profile, light profile and
audience policy plus one exact `ContentResolutionReport`, and alone may emit `MapSceneRoot`; this
removes the former forward-reference cycle
in which an observation had to hash-bind the spatial output before that output existed.
The published spatial artifact's `spatialCompileInputRef` equals the exact request at artifact ID
and hash; settlement, effective time, representation, law and ABI are validated across the join.
For `DIMENSIONAL_V1`, the request's `groundSurfaceRegistryRef`, the root field, every substrate ref,
every `TERRAIN_FACE` support and the sole `SUBSTRATE` dependency all resolve the same registry bytes;
its settlement/effective time/law/ABI equal the spatial snapshot. PLANAR forbids the field and role.
Because that request already hash-binds `baseWorldRef` and `baseDossierRef`, a spatial artifact can
never detach from or alias the world/dossier history that caused it.
The report's `sourceSpatialRef` equals the selected spatial artifact and its
`contentRegistryBundleRef` equals that artifact's bundle; the root repeats both refs exactly. An
`ALL_RESOLVED` report permits normal compilation/projection. A report with unresolved rows permits
read-only projection of preserved canonical bytes, emits `UNRESOLVED_CUSTOM_CONTENT` in chrome and
forbids recompile/mutation; it never authorizes deletion or recipe substitution.
The request's `spatialOperationsRef`, root field and sole `OPERATIONS` dependency are byte-equal.
Its operation refs are unique, lifecycle-ordered and resolve the exact typed operations; `[]` is
the only canonical empty form. The root's `fabricRef` and sole `FABRIC` dependency equal the
manifest-selected `CanonicalFabricArtifact`; that artifact binds the exact street graph/geometry,
`CadastralBoundaryArrangement`, DCEL, frontage and parcel registries. The arrangement owns every
quantized hard boundary once, with an exact source and support, so neither DCEL nor projection may
reconstruct a second boundary geometry.

Every inline world fact in the spatial request is an exact, schema-validated projection of
`baseWorldRef`; ID/value disagreement is `BASE_WORLD_IDENTITY_MISMATCH`. `baseDossierRef` replaces a
bare dossier hash and resolves a `BASE_DOSSIER` artifact whose settlement/effective time and exact
`sourceWorldRef` match the `BASE_WORLD` snapshot. The world/dossier artifact kinds, revision,
schema/law, provenance and hashes are validated before fact projections. Tier and narrative
culture are never present on a spatial request; they remain naming/narrative/UI compatibility
metadata only, so a spatial node cannot read them accidentally. `historicalEvidenceScopeRef`
and `historicalMechanismRegistryRef` plus `contentRegistryBundleRef` resolve immutable artifacts
before any spatial node executes. The root's exact content-registry field/dependency equals the
latter; every built-in/custom recipe version used by a canonical entity occurs in that bundle.
The mechanism registry's scope binding must equal the former; both corresponding dependency refs
must equal the spatial input. The evidence-scope
dependency in `CanonicalSpatialArtifact` must equal the former artifact ID/hash, and every
`SUPPORTED` domain must resolve its exact promoted scope-pack manifest ID/hash as well as matching
domain/pack/protocol/version/law semantics. The observation must name
this settlement, have `sourceSpatialRef` equal that artifact ID/hash,
`selectedSpatialEffectiveAt` equal its `effectiveAt`, and satisfy
`selectedSpatialEffectiveAt <= observedAt`; root, chrome and draw-list observation refs all equal
that artifact. Unknown season and occasion are explicit dispositions and never absent-field
fallbacks. Observation-source roles/refs are unique and closed. Every consumed
`VegetationObservation` and `ActiveLightState` appears exactly once in `orderedSources`, and every
listed state is actually consumed by the selected view/profile; mismatched, duplicate or unused
state refs refuse publication. `DIMENSIONAL_V1` requires a validated, nonempty canonical massing
artifact and an exact `CanonicalVegetationPhase`; their refs must equal the spatial root's
`MASSING` and `VEGETATION` dependencies and registry refs. A canonical empty vegetation phase is
legal; off-input discovery or land-use-to-population invention is not. Massing absence never
invokes D3b inference. `PLANAR_V1` forbids a massing registry and preserves the legacy/explicit
planar contract. Every selected massing, vegetation and rural phase (including a canonical-empty
artifact) must resolve the same settlement, effective time, law and coordinate ABI as the base
world/spatial snapshot; alternatively it must carry one exact registered as-of resolution receipt
whose interval contains that time. The compiler validates every member lifecycle at the resolved
time. Cross-settlement, off-time, off-law or off-ABI phase joins refuse, with negative fixtures.
Every published map also requires one
exact `TemporalObservation`; “now,” season and year are never inferred inside projection. The sky
gate reads only the six explicit canonical knowledge artifacts above. Any `UNKNOWN` input makes the
feature dormant; it never triggers a dossier/name/empty-array fallback. **Each
evidence domain is bound independently:**
an urban scope pack cannot unlock massing or rural derivation, an `AMP-1` pack cannot launder
sandbox habitation/countryside assumptions, and `RSLP-1` cannot unlock urban morphology. A
`SUPPORTED` binding must carry domain-constrained pack-manifest ID/hash,
protocol-ID/protocol-version/law identity;
dormant statuses cannot carry an
authorising pack. Manifest, mechanism and binding identities must match byte-for-byte before a
stage executes. Missing
facts or a missing/unsupported domain binding produce a typed dormant/refusal
record; they never silently alias an unrelated property or synthesize a direction. The owner-ratified
product scope is explicitly **European-fantasy-centered**, so every current settlement map binds
`mapTraditionId: 'EUROPEAN_FANTASY_BASE'` independently of the narrative culture token. The live
`arabic`, `east_asian`, `mesoamerican`, `south_asian` and `steppe` options remain naming/prose inputs,
consistent with the existing product copy that culture drives prose more than math; they activate
zero culture-conditioned spatial mechanisms and make no claim to reproduce those settlement
traditions. `mixed` and `random_culture` likewise do not select geometry. A future non-European map
tradition requires a separately owner-authorized evidence scope and law; until then a request for
one is `HISTORICAL_EVIDENCE_SCOPE_UNSUPPORTED`, not an analogy from European atlases. Under
`STRUCTURAL_ONLY`, the compiler may execute only evidence-invariant substrate/topology foundations,
publishes the limitation in provenance/explanation and keeps scoped mechanisms dormant. The
projection request then emits one `MapSceneRoot`; `DIMENSIONAL_V1` binds exactly one one-leaf
`DimensionalScene`, while
`PLANAR_V1` makes dimensional refs unrepresentable. Both bind renderer-neutral semantic DrawOps
with stable ids. **React SVG, screen PNG, PDF, print SVG, thumbnail, token and hit-testing consume
that same scene/draw list.** A format adapter may simplify paint, never rebuild geometry.

**A future geometry export is called GeoJSON only when the document carries an explicit, licensed
georeference and CRS transform that satisfies that format's coordinate contract.** SettlementForge's
ordinary abstract maps have a local +X-east/+Y-north quantized plan datum, not terrestrial longitude
and latitude; they export a versioned **local-planar geometry package** with unit/axis/ABI metadata.
Relabelling local coordinates as GeoJSON would manufacture a real-world location and a false
precision claim.

Reuse the product machinery that is already sound:

- TownScene's audience/privacy projection, fail-closed digest and budget envelope;
- `MapDress` as the resolver of campaign season, severity, siege, scars, rebirth and occasions,
  with its observation hash included so pulse changes cannot leave a stale scene;
- stable anchor/lineage ids, lazy chunk boundaries and durable operation/outbox seams;
- existing map-edit blobs as versioned migration input only.

The sandbox currently returns an opaque SVG and measured multi-second metropolis costs. Before
dimensional massing, it must return retained/addressable artifacts, run heavy compile work in the
declared worker boundary, cache by the four digest domains, and prove one representative leaf
through screen + PDF + thumbnail with identical semantic geometry. `validate:map` continues to
mean the vendored realm-map fork until renamed; it is not settlement-map certification. A new
corpus/canonical-scene gate must use an unambiguous name.

### §10.19 · THE GATES — cohesion is now falsifiable

| gate | must prove |
|---|---|
| artifact ownership | one canonical registry owns each ID; the spatial root's massing/vegetation refs equal the spatial-input and dependency artifact ID/hash, no body/vegetation bytes are reserialized as root-owned, phase-owned attachments occur once, every part has one containing body with exact parent/solid-part ID equality, and every scene body/field/loss equals its registry/root byte-for-byte; rural/massing/vegetation settlement/effective-time/law/ABI joins match; root-owned collections, scene/index slices and every `MapSceneRoot` request/dependency ref/hash agree; projection switch leaves SPATIAL unchanged; season-only change moves OBSERVATION but not SPATIAL |
| temporal causality | every spatial feedback carries `effectiveAt > observedAt`; declared same-pass cycle roster empty |
| manifest conformance | source imports, schemas, namespaces, invariants and invalidation equal the executable manifest |
| coordinate ABI | published canonical coordinates/heights are safe integers; cross-engine hashes agree |
| solid legality | broad-phase + exact solid predicate; every permitted overlap owns one valid attachment |
| support truth | every non-flat mass names one support surface; vegetation canopy anchors resolve through `trunk.support`; no duplicate support or canonical scalar `zBase` reader |
| vegetation | every seasonal foliage observation resolves by discriminant to either a durable/selectable, provenance-hashed `VegetationMass` or a deterministic nonpersistent field whose exact `CanonicalVegetationAggregate` count/density, classes, phase, RSLP/explicit authority, recipe/law and provenance resolve; land-use-only fields = 0; field instances own no entity ids or receipts |
| occlusion | all solids/attenuators enter the spatial index; visibility fragments cover each visible surface exactly once; no unresolved order cycle; render = export visible geometry |
| hit regions | every region derives only from an addressable `ENTITY` visible primitive (surface/stroke/symbol/connection), shares its semantic id, records deterministic screen-space pad/aggregate derivation, and never enters export/WORLD; bulk fields have zero hit regions |
| lighting | nonempty discriminated sources have unique IDs and closed bands; local fixture/state/law refs match the selected observation roster; under `DIMENSIONAL_V1`, profile sources ↔ per-light illuminations is an order-preserving bijection and root/draw ref lists are identical; under `PLANAR_V1`, both illumination lists are exactly empty; every dimensional visibility/contribution names the same typed source/receiver, geometric visibility and exact material/vegetation/neutral transmission authority, blockers and attenuators; derived contribution band matches; source additivity; shade payload solar artifact/hash equals its ordered dependency; cartographic profile never reaches a world receipt |
| connections | every endpoint resolves exact active leaf + host/support + support-relative height and lifecycle; aligned connections additionally coincide at one XY; portals prove two independent endpoint positions |
| provenance | every pointer resolves an exact record hash in one immutable ledger; every entity/artifact has one origin and zero-or-more ordered exact pre-existing command/operation/cause refs; completed effect receipts appear only in a nondependency `ProvenanceReceiptIndex`; ledger/record/subject/law hashes agree; component coverage balances and no after-artifact hash cycle exists |
| audience privacy | projection request/root/view/illumination/draw/hit/chrome carry one exact policy; PUBLIC policy admits only PUBLIC gates and has zero DM subjects, blockers, shadows, primitives, hit regions, warnings or ghosts; cache/export hashes differ by policy |
| persistence | all legacy fixtures render through their recorded law; stored bytes unchanged; pinned document hash ignores live-world drift |
| operation boundary | canonical C/E mutations produce registered `ActionResult`/domain receipts; document undo cannot remove accepted lived history |
| inertia | current prosperity changes condition, not inherited streets; dated changes affect later development only |
| loss truth | every one-leaf loss slice equals the root-owned record; cause operation/effect footprint, leaf/support and VOID fabric or CRATER substrate refs resolve; altered substrate enters receivers/occlusion; debris and positive volume units conserve; recovery is explicit only |
| causal precision | registered component predicates pass in the required direction/tolerance; report directional responsiveness, causal precision, collateral share and direction-violation share; `E ∩ F = ∅` before execution and `A ∩ F = ∅` after it |
| evidence | every historical claim resolves to a registered source role, represented period, scale/coverage, component certainty, legend and allowed use; legacy 53-roster is never described as untouched; visual corpus cannot satisfy historical/height/causal gates |
| evidence scope | every map resolves to the explicit `EUROPEAN_FANTASY_BASE` tradition and versioned `HistoricalEvidenceScopeBinding`; narrative culture tokens activate zero map grammars; any future unsupported tradition is refused rather than borrowing European priors |
| single-leaf/product | one render call accepts one leaf; anon/free screen PNG contains full map content but obeys a named screen ceiling; PDF/SVG remain print/vector entitlement |

### §10.20 · THE HISTORICAL URBANISM EVIDENCE CONTRACT — atlases bound mechanisms; they do not become a style oracle

The European Historic Towns Atlas tradition is the structural reference because its comparative
method deliberately separates source plan, regional situation, modern comparison, development
interpretation, gazetteer and essay. That rigor must survive ingestion. A redrawn first cadastral
survey can preserve medieval morphology without being a medieval snapshot; a reconstructed phase
polygon is a scholarly claim, not a primary observation; archaeological blank space can mean
unsampled ground; a symbol's dashed line can mean a different thing on the next sheet. **The source
document and its own legend remain the authority for what a mark means.**

```ts
type HistoricalSourceRole =
  | 'BASE_CADASTRE' | 'HISTORIC_PRIMARY_PLAN' | 'HISTORIC_VIEW'
  | 'ARCHAEOLOGY' | 'WRITTEN_GAZETTEER' | 'INTERPRETIVE_RECONSTRUCTION'
  | 'THEMATIC_ANALYSIS';

type HistoricalCertaintyLevel =
  | 'OBSERVED_EXISTING' | 'CERTAIN' | 'LIKELY' | 'HYPOTHETICAL' | 'UNKNOWN';

type HistoricalEvidenceRights =
  | { mode: 'CITATION_ONLY'; note?: string; geometryPayloadRef?: never }
  | { mode: 'FACT_METADATA_ONLY'; note?: string; termsRef?: ArtifactHashRef;
      geometryPayloadRef?: never }
  | { mode: 'OPEN_DERIVED_DATA'; licenseId: string; licenseUrl: string;
      licenseVersion?: string; termsRef: ArtifactHashRef;
      allowedDerivativeScope: readonly [
        'MEASURED_FACTS' | 'DERIVED_NETWORK' | 'DERIVED_GEOMETRY' | 'SOURCE_GEOMETRY',
        ...('MEASURED_FACTS' | 'DERIVED_NETWORK' | 'DERIVED_GEOMETRY' | 'SOURCE_GEOMETRY')[]
      ];
      verifiedAt: string;
      note?: string;
      geometryPayloadRef?: ArtifactHashRef };

interface HistoricalSpatialCoverageBase {
  kind: 'SPATIAL_MASK';
  maskRef: ArtifactHashRef;
  purpose: 'FEATURE_SEARCH' | 'ARCHAEOLOGICAL_COVERAGE' | 'PLAN_COVERAGE'
      | 'MEASUREMENT_ELIGIBILITY';
  horizontalError: MeasureQ;
  omissions: readonly string[];
}

type HistoricalEvidenceCoverage =
  | { kind: 'TEXTUAL_SCOPE'; description: string; omissions: readonly string[];
      absenceIsEvidence: false }
  | (HistoricalSpatialCoverageBase & { absenceIsEvidence: false })
  | (HistoricalSpatialCoverageBase & { absenceIsEvidence: true;
      eligibleSearchAreaRef: ArtifactHashRef;
      containmentProofRef: ArtifactHashRef;
      absenceJustification: string });

interface HistoricalUrbanEvidenceRecord {
  recordVersion: 1;
  recordId: EvidenceId;
  place: {
    name: string;
    polityOrRegion: string;
    atlasProgramId: AtlasProgramId;
  };
  representedPeriod: { fromYear?: number; toYear?: number; label: string };
  source: {
    publicationId: string;
    publisher: string;
    url: string;
    accessedAt: string;
    sourceDate?: string;
    baseMapDate?: string;
    role: HistoricalSourceRole;             // exactly one role/layer per record
    scale: { kind: 'DECLARED'; denominator: number }
        | { kind: 'NOT_APPLICABLE'; reason: string };
    legend: { kind: 'DECLARED'; ref: string }
        | { kind: 'NOT_APPLICABLE'; reason: string };
    geometryLineage: 'ORIGINAL_SOURCE' | 'REDRAWN_SOURCE' | 'GEOREFERENCED_SOURCE'
        | 'INTERPRETIVE_ONLY' | 'NO_GEOMETRY';
    planimetricQuality: 'SURVEYED' | 'GEOREFERENCED_CORRECTED' | 'SCHEMATIC'
        | 'OBLIQUE_OR_DISTORTED' | 'UNKNOWN';
    editorialState: 'ORIGINAL_SOURCE_STATE' | 'EDITORIALLY_SUPPLEMENTED' | 'COMPOSITE';
    georeference?: {
      crs?: string;
      transform: 'AFFINE' | 'HELMERT' | 'OTHER_DECLARED';
      groundControlPointCount: number;
      rmsError?: number;
      errorUnit?: string;
    };
    sheetOrPage?: string;
    rights: HistoricalEvidenceRights;
  };
  claim: {
    statement: string;                       // concise paraphrase, never copied map art
    mechanismIds: readonly HistoricalMechanismId[];
    evidenceMode: 'DIRECTLY_DEPICTED' | 'TEXT_ASSERTED' | 'SCHOLARLY_INTERPRETED'
        | 'REVIEW_INFERENCE';
    geometryStatus: 'NONE' | 'SYMBOLIC' | 'APPROXIMATE' | 'SOURCE_MEASURED';
  };
  certainty: readonly {
    aspect: 'EXISTENCE' | 'ALIGNMENT' | 'EXTENT' | 'DATE' | 'FUNCTION' | 'MATERIAL';
    level: HistoricalCertaintyLevel;
    basis: string;
  }[];
  coverage: HistoricalEvidenceCoverage;
  corroboratingRecordIds?: readonly EvidenceId[];
  cohort?: {
    cohortId: CohortId;
    inclusionRuleVersion: number;
    eligibleForPrevalence: boolean;
  };
  allowedUses: readonly (
    | 'POSSIBILITY_WITNESS' | 'MECHANISM_DESIGN' | 'COUNTEREXAMPLE'
    | 'COHORT_STATISTIC' | 'VALIDATION_CASE'
  )[];
  prohibitedUses: readonly (
    | 'DIRECT_GEOMETRY_COPY' | 'PIXEL_STYLE_COPY' | 'UNIVERSAL_RULE'
    | 'UNREGISTERED_PREVALENCE_PRIOR'
  )[];
}

// AMP-1 and RSLP-1 use claim-sized domain records, not an urban record with overloaded fields.
// They share the source/date/rights/coverage boundary above while preserving the domain facts that
// determine cohort eligibility and uncertainty. Neither record is a runtime cause.
type ArchitecturalMassingSourceRole =
  | 'MEASURED_BUILDING_SURVEY' | 'BUILDING_ARCHAEOLOGY' | 'VERNACULAR_INVENTORY'
  | 'DENDROCHRONOLOGY' | 'CONSERVATION_RECORD' | 'ARCHITECTURAL_SYNTHESIS'
  | 'HISTORIC_BUILDING_VIEW';

type RuralLandscapeSourceRole =
  | 'RURAL_EXCAVATION' | 'LANDSCAPE_SURVEY' | 'HISTORIC_LANDSCAPE_MAP'
  | 'TENURE_RIGHTS_RECORD' | 'ENVIRONMENTAL_HISTORY' | 'VERNACULAR_FARMSTEAD_SURVEY'
  | 'RURAL_SYNTHESIS';

type ArchitecturalMassingEvidenceSource =
  Omit<HistoricalUrbanEvidenceRecord['source'], 'role' | 'geometryLineage' | 'planimetricQuality'> & {
    role: ArchitecturalMassingSourceRole;
    evidenceLineage: 'DIRECT_MEASUREMENT' | 'FABRIC_OBSERVATION' | 'SCIENTIFIC_DATING'
        | 'INVENTORY_RECORD' | 'INTERPRETIVE_SYNTHESIS' | 'NO_GEOMETRY';
    metricQuality: 'MEASURED' | 'SCALED_RECORD' | 'QUALITATIVE_FABRIC'
        | 'SCHEMATIC' | 'UNKNOWN';
  };

type RuralLandscapeEvidenceSource =
  Omit<HistoricalUrbanEvidenceRecord['source'], 'role' | 'geometryLineage' | 'planimetricQuality'> & {
    role: RuralLandscapeSourceRole;
    evidenceLineage: 'DIRECT_FIELD_SURVEY' | 'EXCAVATED_CONTEXT'
        | 'GEOREFERENCED_LANDSCAPE_SOURCE' | 'DOCUMENTARY_RIGHTS_SOURCE'
        | 'INTERPRETIVE_SYNTHESIS' | 'NO_GEOMETRY';
    spatialQuality: 'SURVEYED' | 'GEOREFERENCED_CORRECTED' | 'SCHEMATIC'
        | 'TEXTUAL_ONLY' | 'UNKNOWN';
  };

interface HistoricalObservationBase {
  observationId: EntityId;
  methodId: string;                         // closed child-instrument registry
  resolution?: MeasureQ;
  coverageRef?: EvidenceCoverageRef;
  provenanceRef: ProvenanceRef;
}

type HistoricalObservedValue<T> =
  | { status: 'KNOWN'; value: T }
  | { status: 'ALTERNATIVES'; values: readonly [T, T, ...T[]] }
  | { status: 'UNKNOWN'; reason: 'NOT_OBSERVED' | 'OUTSIDE_COVERAGE'
        | 'CONFLICTING_EVIDENCE' | 'WITHHELD' };

type HistoricalMeasuredValue =
  | { status: 'EXACT'; value: MeasureQ; datumRef?: ArtifactHashRef }
  | { status: 'BOUNDED'; lower: MeasureQ; upper: MeasureQ; datumRef?: ArtifactHashRef }
  | { status: 'UNKNOWN'; reason: 'NOT_OBSERVED' | 'OUTSIDE_COVERAGE'
        | 'CONFLICTING_EVIDENCE' | 'WITHHELD'; datumRef?: ArtifactHashRef };

type ArchitecturalMassingObservation = HistoricalObservationBase & (
  | { field: 'EXISTENCE'; targetPartId?: string; value: HistoricalObservedValue<boolean> }
  | { field: 'HEIGHT'; targetPartId: string; value: HistoricalMeasuredValue;
      supportDatumRef: ArtifactHashRef }
  | { field: 'STOREY'; targetPartId: string;
      value: HistoricalObservedValue<StoreyCountQ> }
  | { field: 'ROOF_FORM'; targetPartId: string;
      value: HistoricalObservedValue<RoofFormKind> }
  | { field: 'PITCH'; targetPartId: string; value: HistoricalObservedValue<AngleIndex>;
      coordinateAbiVersion: number }
  | { field: 'MATERIAL'; targetPartId: string; componentId?: string;
      value: HistoricalObservedValue<MaterialId> }
  | { field: 'FUNCTION'; targetPartId?: string;
      value: HistoricalObservedValue<FunctionalProgram> }
  | { field: 'PHASE'; targetPartId?: string;
      value: HistoricalObservedValue<{ fromYear?: number; toYear?: number; label: string }> }
  | { field: 'SUPPORT'; targetPartId: string; value: HistoricalObservedValue<{
      supportKind: SupportSurfaceRef['kind']; datumRef?: ArtifactHashRef }> }
  | { field: 'SURVIVAL'; targetPartId?: string;
      value: HistoricalObservedValue<'SURVIVES' | 'PARTIAL' | 'REMOVED'> }
);

type RuralLandscapeObservation = HistoricalObservationBase & (
  | { field: 'EXISTENCE'; targetId?: string; value: HistoricalObservedValue<boolean> }
  | { field: 'SETTLEMENT_NODE'; targetId: string; value: HistoricalObservedValue<{
      kind: RuralSettlementNodeKindValue; occupancy: RuralOccupancyValue;
      geometryRef?: ArtifactHashRef }> }
  | { field: 'HOLDING'; targetId: string; value: HistoricalObservedValue<{
      holderIds: readonly string[]; landUnitIds: readonly string[] }> }
  | { field: 'RIGHT'; targetId: string; value: HistoricalObservedValue<
      'OCCUPY'|'CULTIVATE'|'GRAZE'|'MOW'|'WOOD'|'TURBARY'|'PASTURE'
        |'FISH'|'WATER'|'TRANSIT'|'EXTRACT'> }
  | { field: 'OCCUPANCY'; targetId: string;
      value: HistoricalObservedValue<RuralOccupancyValue> }
  | { field: 'LAND_USE'; targetId: string;
      value: HistoricalObservedValue<RuralLandUseValue> }
  | { field: 'BOUNDARY'; targetId: string;
      value: HistoricalObservedValue<RuralBoundaryKindValue> }
  | { field: 'ROUTE'; targetId: string; value: HistoricalObservedValue<{
      kind: RuralRouteKindValue; geometryRef?: ArtifactHashRef }> }
  | { field: 'HYDRAULIC'; targetId: string;
      value: HistoricalObservedValue<RuralHydraulicWorkKindValue> }
  | { field: 'DATE'; targetId?: string;
      value: HistoricalObservedValue<{ fromYear?: number; toYear?: number; label: string }> }
  | { field: 'EXTENT'; targetId: string; value: HistoricalMeasuredValue;
      supportDatumRef?: ArtifactHashRef }
  | { field: 'FUNCTION'; targetId: string;
      value: HistoricalObservedValue<RuralWorkComplexKindValue> }
);

interface ArchitecturalMassingEvidenceRecord {
  recordVersion: 1;
  recordId: EvidenceId;
  subject: {
    placeName: string;
    polityOrRegion: string;
    siteOrBuildingId: string;
    buildingOrComplexPhaseId: string;
    componentId?: string;
    partId?: string;
    functionalProgram?: FunctionalProgram;
    supportRelationId?: string;
  };
  representedPeriod: HistoricalUrbanEvidenceRecord['representedPeriod'];
  source: ArchitecturalMassingEvidenceSource;
  claim: HistoricalUrbanEvidenceRecord['claim'];
  observations: readonly [ArchitecturalMassingObservation, ...ArchitecturalMassingObservation[]];
  certainty: readonly {
    aspect: 'EXISTENCE' | 'HEIGHT' | 'STOREY' | 'ROOF_FORM' | 'PITCH'
        | 'MATERIAL' | 'FUNCTION' | 'PHASE' | 'SUPPORT' | 'SURVIVAL';
    level: HistoricalCertaintyLevel;
    basis: string;
  }[];
  coverage: HistoricalEvidenceCoverage;
  corroboratingRecordIds?: readonly EvidenceId[];
  cohort?: HistoricalUrbanEvidenceRecord['cohort'];
  allowedUses: HistoricalUrbanEvidenceRecord['allowedUses'];
  prohibitedUses: HistoricalUrbanEvidenceRecord['prohibitedUses'];
}

interface RuralLandscapeEvidenceRecord {
  recordVersion: 1;
  recordId: EvidenceId;
  subject: {
    placeName: string;
    polityOrRegion: string;
    siteOrLandscapeId: string;
    phaseId: string;
    settlementNodeId?: EntityId;
    holdingId?: EntityId;
    rightId?: EntityId;
    landUnitId?: EntityId;
    occupancyNodeId?: EntityId;
  };
  representedPeriod: HistoricalUrbanEvidenceRecord['representedPeriod'];
  source: RuralLandscapeEvidenceSource;
  claim: HistoricalUrbanEvidenceRecord['claim'];
  observations: readonly [RuralLandscapeObservation, ...RuralLandscapeObservation[]];
  certainty: readonly {
    aspect: 'EXISTENCE' | 'SETTLEMENT_NODE' | 'HOLDING' | 'RIGHT' | 'OCCUPANCY'
        | 'LAND_USE' | 'BOUNDARY' | 'ROUTE' | 'HYDRAULIC' | 'DATE' | 'EXTENT'
        | 'FUNCTION';
    level: HistoricalCertaintyLevel;
    basis: string;
  }[];
  coverage: HistoricalEvidenceCoverage;
  corroboratingRecordIds?: readonly EvidenceId[];
  cohort?: HistoricalUrbanEvidenceRecord['cohort'];
  allowedUses: HistoricalUrbanEvidenceRecord['allowedUses'];
  prohibitedUses: HistoricalUrbanEvidenceRecord['prohibitedUses'];
}
```

Urban, AMP and RSLP registries reject cross-domain source roles and lineages. A building survey may
not masquerade as an urban atlas plan, and a tenure/right or landscape source may not masquerade as
urban archaeology. Each child validator carries negative fixtures for every cross-domain role,
lineage/quality mismatch, incompatible geometry/scale claim and absent rights/coverage proof.
Every AMP/RSLP claim also carries at least one typed observation. Its subject/target, field,
certainty aspect, known/bounded/alternative/unknown disposition, units/datum/support, method,
resolution, provenance and coverage must agree; unit dimensions and bounded ordering are checked.
Free claim prose can explain an observation but can never substitute for one or enter cohort/range
measurement. Cross-subject, aspect/value, unit/datum and missing-method fixtures fail.

Spatial coverage inherits `source.role` and the record's discriminated declared scale; it never
redeclares either. `SPATIAL_MASK` is illegal when source scale is `NOT_APPLICABLE`, and its mask,
error unit, purpose and (for negative evidence) eligible-search/containment refs must be compatible
with that one source role/scale. This closes role inflation and false fine-scale absence claims.
Textual scope cannot authorize absence. Rights and coverage validators include mismatched-role,
mismatched-scale, missing-mask and textual-absence negative fixtures.

```ts
type HistoricalEffectReceiptKind = SpatialEffectReceipt['kind']
  | 'ARCHITECTURAL_HISTORY' | 'RURAL_CHANGE' | 'DOMAIN_ACTION_RESULT'
  | 'PLAN_INTENT_RESULT' | 'PLAN_REALIZATION_RESULT';

interface DomainActionResultReceipt {
  kind: 'DOMAIN_ACTION_RESULT';
  artifactId: ArtifactId;
  receiptId: EntityId;
  schemaVersion: number;
  lawVersion: LawVersion;
  authority: DerivationAuthorityRef;
  operationRef: ArtifactHashRef;
  beforeSpatialRef: ArtifactHashRef;
  afterSpatialRef: ArtifactHashRef;
  affectedIds: readonly [EntityId, ...EntityId[]];
  effectiveAt: TimeKey;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type ArchitecturalHistoryOperationKind =
  | 'ADD_MASS_PART' | 'REMOVE_MASS_PART' | 'INSERT_FLOOR' | 'REMOVE_FLOOR'
  | 'RAISE_EAVES' | 'REPLACE_ROOF' | 'REPLACE_FACADE' | 'ENCASE_FRAME'
  | 'REPAIR_COMPONENT' | 'REUSE_COMPONENT' | 'SUBDIVIDE_BODY' | 'AMALGAMATE_BODY';

interface ArchitecturalHistoryOperation {
  artifactKind: 'ARCHITECTURAL_HISTORY_OPERATION';
  artifactId: ArtifactId;
  operationId: EntityId;
  schemaVersion: number;
  lawVersion: LawVersion;
  kind: ArchitecturalHistoryOperationKind;
  bodyId: EntityId;
  affectedPartIds: readonly [EntityId, ...EntityId[]];
  effectiveAt: TimeKey;
  cause: CauseDisposition;
  beforeMassingRef: ArtifactHashRef;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface ArchitecturalHistoryReceipt {
  kind: 'ARCHITECTURAL_HISTORY';
  artifactId: ArtifactId;
  receiptId: EntityId;
  schemaVersion: number;
  lawVersion: LawVersion;
  authority: DerivationAuthorityRef;
  operationRef: ArtifactHashRef;
  beforeMassingRef: ArtifactHashRef;
  afterMassingRef: ArtifactHashRef;
  effectiveAt: TimeKey;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

// Operation artifacts reference only the before state. External receipts bind operation, before
// and after massing artifacts, avoiding a hash cycle when the after artifact records its source
// operation exactly once in `changeOperationRefs`. Rural operations/receipts obey the same one-way pattern. The mechanism compiler
// rejects an architectural or rural operation kind whose domain, stage, receipt kind, effective
// time or evidence requirement does not match the registered mechanism definition. A history/change
// operation always names at least one affected ID; kind-specific validators require the old/new
// endpoint identities needed by add/remove/relocate/split/merge kinds, and the external receipt's
// before→after diff must equal that declared affected set exactly. A no-target or unrelated-diff
// operation cannot publish an effect receipt.

interface HistoricalMechanismDerivationEffect {
  generationNodeId: GenerationNodeId;       // exact GenerationNodeManifest.nodeId
  publicStageId?: StageId;                  // derived label only; never gate identity
  inputBindings: readonly GenerationInputBinding[]; // exact equality with referenced node
  outputIndex: number;                      // exact GenerationNodeManifest.outputContracts index
  outputKind: ArtifactKind;
  receiptKind: HistoricalEffectReceiptKind;
}

type ProbabilitySamplingProtocolId = string & { readonly __probabilitySamplingProtocolId: unique symbol };

interface ProbabilitySamplingProtocolRef {
  registryKind: 'PROBABILITY_SAMPLING';
  protocolId: ProbabilitySamplingProtocolId;
  protocolVersion: string;
  manifestRef: ArtifactHashRef;
  targetPopulationId: string;
  estimandId: string;
  probabilityDesignId: string;
  inclusionProbabilityRef: ArtifactHashRef;
  nonresponseTreatmentId: string;
  designWeightsRef: ArtifactHashRef;
}

type HistoricalMechanismGeographyScope =
  | { kind: 'ALL_SUPPORTED_EUROPEAN_BASE' }
  | { kind: 'REGION_OR_POLITY_PREDICATES';
      predicateIds: readonly [PredicateId, ...PredicateId[]] };

type HistoricalMechanismPeriodScope =
  | { kind: 'ALL_SUPPORTED_PERIODS' }
  | { kind: 'CLOSED_INTERVAL'; from: TimeKey; through: TimeKey };

interface HistoricalMechanismScopePredicate {
  artifactKind: 'HISTORICAL_MECHANISM_SCOPE';
  artifactId: ArtifactId;
  schemaVersion: number;
  mapTraditionId: 'EUROPEAN_FANTASY_BASE';
  geography: HistoricalMechanismGeographyScope;
  representedPeriod: HistoricalMechanismPeriodScope;
  sourceEligibilityPredicateIds: readonly [PredicateId, ...PredicateId[]];
  coverageEligibilityPredicateIds: readonly [PredicateId, ...PredicateId[]];
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type HistoricalTemporalOperationRef =
  | { family: 'CORE'; kind: CoreOperationKind; schemaRef: ArtifactHashRef }
  | { family: 'ARCHITECTURAL_HISTORY'; kind: ArchitecturalHistoryOperationKind;
      schemaRef: ArtifactHashRef }
  | { family: 'RURAL_CHANGE'; kind: RuralChangeOperationKind;
      schemaRef: ArtifactHashRef }
  | { family: 'REGISTERED'; kind: RegisteredOperationKindId;
      schemaRef: ArtifactHashRef };

interface HistoricalMechanismDefinition {
  artifactKind: 'HISTORICAL_MECHANISM';
  artifactId: ArtifactId;
  schemaVersion: 1;
  lawVersion: LawVersion;
  mechanismId: HistoricalMechanismId;
  evidenceRequirement: EvidenceScopeRequirement;
  possibilityEvidenceIds: readonly EvidenceId[];
  counterexampleEvidenceIds: readonly EvidenceId[];
  chronologyPreconditionPredicateIds: readonly PredicateId[];
  stateTransitionPredicateIds: readonly PredicateId[];
  mustFollowMechanismIds: readonly HistoricalMechanismId[];
  temporalOperation: HistoricalTemporalOperationRef;
  derivationStages: readonly [HistoricalMechanismDerivationEffect,
    ...HistoricalMechanismDerivationEffect[]];
  scopePredicateRef: ArtifactHashRef;
  scopeNote: string;                        // display only; never executable authority
  activationWeightSource: 'NONE' | {
    probabilityProtocol: ProbabilitySamplingProtocolRef;
    cohortId: CohortId;
    statisticId: string;
  };
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface HistoricalMechanismRegistry {
  artifactKind: 'MECHANISM_REGISTRY';
  artifactId: ArtifactId;
  schemaVersion: number;
  mapTraditionId: 'EUROPEAN_FANTASY_BASE';
  scopeBindingRef: ArtifactHashRef;
  definitionRefs: readonly ArtifactHashRef[];
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

// Registry/compiler law: the probability-protocol registry is currently empty, so every current
// mechanism serializes activationWeightSource:'NONE'. Reject absent/unknown refs, self-declared
// booleans, missing target/estimand/probability/nonresponse/weight artifacts, and protocol IDs
// HEEP-1, UCF-1, AMP-1 or RSLP-1, which are structurally non-probability programs.
// A canonical empty HistoricalMechanismRegistry is legal and is the required current state while
// all reviewed records remain research-only. Empty means no historical mechanism can execute; a
// compiler may execute only definitions present by exact ref in the selected registry.
// Before execution, evidenceRequirement must equal the node's EVIDENCE_REQUIRED gate and the
// matching SUPPORTED compile-input domain binding at
// (domain, scopePackId, scopePackManifestRef, protocolId, protocolVersion, lawVersion).
// Every nonempty derivation effect resolves one exact GenerationNodeManifest.nodeId; its input bindings,
// output index/kind, gate and receipt kind must match that node. A public S-stage label cannot
// authorize work; one output contract cannot be claimed twice. There is no second singular receipt
// field that can disagree with the per-output node contract; a mechanism spanning multiple output
// receipt kinds declares each one only on its exact derivation effect.
// Before activation, scopePredicateRef resolves one immutable HistoricalMechanismScopePredicate;
// tradition, geography/polity, represented period, source eligibility and coverage eligibility all
// pass against the current compile/evidence inputs. Display prose cannot widen that predicate. A
// failed or unresolved predicate is dormant, never an invitation to apply a European witness
// universally within the product's European-fantasy map tradition.
// Every definition is an immutable artifact in one closed HistoricalMechanismRegistry. The spatial
// input/root dependency, executing node, resolver and any HISTORICAL_MECHANISM receipt all cite the
// same exact registry/definition ID+hash; definition order, evidence, scope, predicates, operation,
// output/receipt contracts and activation authority therefore cannot drift under mechanismId.
// `mustFollowMechanismIds` is the sole inter-mechanism chronology-edge authority. Across the closed
// registry it is unique, self-edge-free and acyclic; a reverse `mustPrecede` list is derived, never
// serialized. `temporalOperation` discriminates CORE, ARCHITECTURAL_HISTORY, RURAL_CHANGE and
// REGISTERED families before naming a kind and exact schema, so overlapping words such as
// RELOCATE/ABANDON cannot resolve to the wrong operation contract.

interface HistoricalPlanIntent {
  artifactKind: 'PLAN_INTENT';
  artifactId: ArtifactId;
  planId: EntityId;                       // stable historical-plan entity, not artifact identity
  schemaVersion: number;
  settlementId: EntityId;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  proposedAt: TimeKey;
  effectiveAt: TimeKey;
  legalGrantId?: EntityId;
  proposedAxesQ: readonly PolylineQ[];
  proposedModuleQ?: { frontage: WorldQ; depth: WorldQ };
  marketReserveQ?: PolygonQ;
  institutionalReserveQ: readonly PolygonQ[];
  predecessorAnchorIds: readonly EntityId[];
  orderedInputRefs: readonly [ArtifactHashRef, ...ArtifactHashRef[]];
  sourceOperationRef: ArtifactHashRef;       // pre-existing operation; never its output receipt
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface HistoricalPlanRealization {
  artifactKind: 'PLAN_REALIZATION';
  artifactId: ArtifactId;
  realizationId: EntityId;                // stable realization entity
  schemaVersion: number;
  settlementId: EntityId;
  planId: EntityId;
  intentRef: ArtifactHashRef;
  realizedAt: TimeKey;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  realizedStreetGeometryIds: readonly EntityId[];
  realizedFrontageSeedIds: readonly EntityId[];
  retainedPredecessorIds: readonly EntityId[];
  orderedInputRefs: readonly [ArtifactHashRef, ...ArtifactHashRef[]];
  sourceOperationRef: ArtifactHashRef;
  constraintReceiptRefs: readonly ArtifactHashRef[];
  execution: 'COMPLETE' | 'PARTIAL' | 'ABANDONED';
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type HistoricalPlanReceipt =
  | { artifactKind: 'HISTORICAL_PLAN_RECEIPT'; kind: 'PLAN_INTENT_RESULT';
      artifactId: ArtifactId; receiptId: EntityId; schemaVersion: number;
      operationRef: ArtifactHashRef; orderedInputRefs: readonly [ArtifactHashRef,
        ...ArtifactHashRef[]]; afterIntentRef: ArtifactHashRef; effectiveAt: TimeKey;
      authority: DerivationAuthorityRef; lawVersion: LawVersion;
      provenanceRef: ProvenanceRef; contentHash: ContentHash }
  | { artifactKind: 'HISTORICAL_PLAN_RECEIPT'; kind: 'PLAN_REALIZATION_RESULT';
      artifactId: ArtifactId; receiptId: EntityId; schemaVersion: number;
      operationRef: ArtifactHashRef; intentRef: ArtifactHashRef;
      constraintReceiptRefs: readonly ArtifactHashRef[]; afterRealizationRef: ArtifactHashRef;
      effectiveAt: TimeKey; authority: DerivationAuthorityRef; lawVersion: LawVersion;
      provenanceRef: ProvenanceRef; contentHash: ContentHash };
```

Plan and realization entity IDs preserve historical lineage; their artifact IDs/hashes preserve
byte identity. Every realization `intentRef` resolves the exact intent artifact and its `planId`,
settlement, law and ABI must agree. Operation, constraint and effect receipts are hash-bound
artifacts, never bare IDs. Intent/realization artifacts hash only pre-existing operation, input and
constraint refs. The external discriminated `HistoricalPlanReceipt` then binds that operation and
those inputs to the completed after-artifact; the after artifact never embeds the receipt that names
it. This is the same acyclic operation → after artifact → external receipt pattern as massing/rural.

**The record is claim-sized, not publication-sized.** One source can yield several records because
wall existence may be certain while its material is unknown, alignment likely and date broad. A
single confidence scalar would erase exactly the uncertainty the atlases worked to preserve.

The ingestion laws are binding:

1. **Keep evidence roles separate.** Base cadastre, historic primary map/view, archaeology,
   gazetteer text, interpretive reconstruction and thematic analysis are separate layers with
   separate provenance and claim records. One record has exactly one `source.role`; corroboration is
   an explicit edge between records, never a role array flattened into one polygon called
   `historicalTruth`.
2. **Period belongs to every claim.** Modern place name, base-map survey date, represented historic
   interval and source publication date are different fields. A nineteenth-century parcel line may
   witness persistence only when the essay/archaeology/reconstruction supports that inference.
3. **Certainty is component-specific and legend-local.** Existence, alignment, extent, date,
   function and material can disagree. The original legend phrase is mapped per source/layer; no
   global assumption that all dashed lines mean “probable” is legal.
4. **Absence is normally not evidence.** It becomes evidence only on the spatial-coverage branch,
   when exact mask and eligible-search-area artifacts, scale/error, source role/purpose and a
   containment proof establish that the source could record the absent feature. Textual scope can
   never authorize absence. Censored, damaged, archaeologically unsampled or symbolically
   generalized areas remain outside or omitted from the mask.
5. **A witness proves possibility, not frequency.** One town may license a candidate mechanism or
   counterexample. Activation rates, cultural priors and comparative claims require a
   pre-registered cohort with an inclusion rule fixed before counting. Opportunistic examples may
   never tune a probability.
6. **Mechanism activation still requires a SettlementForge cause.** A gate-route suburb, reclaimed
   wetland, merged multi-nuclear town, planted extension, inherited burgage series or rebuilt fire
   quarter can enter the library only with a dossier/world predicate, temporal stage and typed
   receipt. “This atlas town has one” is not a cause.
7. **Do not ingest copyrighted cartography by implication.** Unless a record's discriminated rights
   object carries an exact licence/terms artifact, verified URL/version and compatible derivative
   scope, the repository stores factual metadata, concise
   paraphrased claims and citations only—never traced lines, copied symbols, pixels or source
   coordinates. Empirical reference is not an art-asset licence.
8. **Preserve survey and transformation error.** A redrawn/georeferenced source records the base
   survey, control-point method, transform and error when published. Parcel topology may be exact
   relative to that source while its absolute placement is not; a modern overlay never retroactively
   makes the historic survey metrically exact.

The historical mechanism library is path-dependent rather than typological. Its common
**chronological dependency shape** is:

`substrate/hydrology/long routes → independent nuclei and institutions → dated growth/merger`
`→ route, gate, wall and water projects → frontage/parcels → later infill, reclamation, disaster`
`and rebuilding`.

This is not the compiler's S0–S23 dataflow order, and it is not a universal historical sequence.
`chronologyPreconditionPredicateIds` and the before/after edges say what must already have happened in
the settlement's dated history; `derivationStages` only say where the compiler materializes the
effects of that already-resolved history. The manifest rejects a chronology edge masquerading as an
import edge, an unversioned mechanism, an unregistered temporal operation, or a stage effect whose
receipt kind does not match its declaration. The evidence includes walls that precede plots, walls that follow
settled form, only one core enclosed, planned extensions beside inherited cores, multiple markets,
extramural institutions, wetlands that delay or channel growth, and disasters that selectively
rewrite districts. Therefore `HistoricalMechanismId` is a bounded library of alternative causal
operations with prerequisites and counterexamples—not one “organic medieval” grammar and not a
country-name style switch.

Planned settlements and extensions use two manifest-owned artifacts. `PLAN_INTENT` is emitted by
the `history/planning/intent` operation module and is a dated canonical proposal/grant, not geometry
that the map may silently invent. `PLAN_REALIZATION` is emitted by the
`fabric/planning/realization` derivation module after substrate, predecessor-route, institution,
immunity and ownership inputs resolve; both artifact kinds, their modules, inputs, law versions and
receipt invariants must appear in the executable `GenerationNodeManifest` before any mechanism can
leave `RESEARCH_ONLY`. `HistoricalPlanIntent` records the proposed module,
axes, market/reserve and legal grant; `HistoricalPlanRealization` records the built street/frontage geometry
after terrain, hydrology, predecessor routes, existing institutions, immunities, ownership and
partial execution deform it. A theoretical charter grid drawn over an atlas is evidence for intent,
not permission to emit a perfect grid as realized fabric.

`map-corpus/docs/HISTORICAL-URBANISM-EVIDENCE.md` is the human survey and bibliography;
`map-corpus/historical-evidence/` is the machine-readable registry. The registry validator refuses
missing legends/coverage, prevalence use without a registered cohort, textual or unmasked spatial
absence claims, a search area not contained in its exact coverage mask, missing scale/error/purpose,
or any geometry payload under citation/fact-only rights. `OPEN_DERIVED_DATA` additionally fails
without exact licence terms/hash/scope or when the requested derivative is outside that scope.
Evidence records are design/validation inputs; runtime generation reads only reviewed
`HistoricalMechanismDefinition`s. This prevents a newly added citation from silently changing every
seed and gives every mechanism a versioned causal door, scope and counterexample set.

### §10.21 · RESEARCH COMPLETION IS A GATE, NOT A RHETORICAL CLAIM

The 2026-08-20 registry is **Historical Urbanism Wave 1**: 32 claim records, 23 places, 20
research-only mechanisms, eight programs represented by claim records, zero prevalence cohorts and
zero probability-bearing statistics. Its architecture findings bind because they expose required
evidence types, uncertainty and counterexamples. Its case count does **not** calibrate all settlement
types, national/cultural frequencies or universal numeric ranges, and it is not called an exhaustive
survey of the roughly five hundred EHTA town fascicles.

`map-corpus/docs/HISTORICAL-EVIDENCE-EXPANSION-PROTOCOL.md` owns the next preregistered **balanced
comparative** research program. `HEEP-1`/`UCF-1` may test mechanism possibility, prerequisites,
counterexamples, structural ranges and held-out transfer. It is explicitly **not a probability
sample**, every cohort has `eligibleForPrevalence: false`, and it can never supply
`HistoricalMechanismDefinition.activationWeightSource`, national/cultural frequency or a historical
occurrence rate. Before a non-frequency historical mechanism or bounded structural range can become
executable law, that program must provide:

1. a balanced **80–120-town** sampling frame using only the frozen UCF axes—European macro-region,
   country ceiling, primary program, index phase, independently authorized scale/function band and
   independently authorized physical-context metadata—not a convenience list. Origin,
   fortification, planning/merger, prosperity, contraction and rupture are later mechanism-cohort
   variables (or `UNKNOWN`) unless an independent catalogue assigned them before outcome access;
   they are never retroactive selection or holdout inputs;
2. **30–40 complete-package deep audits** covering principal sheet, relevant phase maps, legend,
   complete essay/gazetteer, source discussion and archaeological qualification;
3. mechanism-specific eligible cohorts whose scale, represented date, coverage and evidence role
   can actually answer the question being counted;
4. a genuinely sealed **15–20% holdout** selected from metadata before its maps/essays are opened,
   kept out of mechanism design and tuning, and used later for structural transfer rather than plan
   imitation;
5. independent **European** evidence programs for rural settlements/landscape and for building height, storeys,
   roof, material, courtyard and construction massing; an urban parcel atlas may satisfy neither;
6. an explicit `EUROPEAN_FANTASY_BASE` product scope. Non-European comparative completion is not a
   gate for this owner-ratified program; narrative culture tokens do not select map morphology, and
   any future non-European map tradition requires a separately authorized evidence pack or receives
   `HISTORICAL_EVIDENCE_SCOPE_UNSUPPORTED`;
7. several independent witnesses and documented counterexamples per executable mechanism where
   available, plus two successive batches with no major new architectural mechanism, materially
   stable measured ranges and successful held-out structural validation.

Stable, non-statistical foundations may proceed in parallel: coordinate/identity ABI, evidence
types, temporal substrate, route/crossing lineage, frontage/parcel ownership, typed receipts,
manifest enforcement and source/reconstruction/generated separation. Numeric constants, cultural
weights, prevalence priors and universal morphology assumptions are **not debts that `HEEP-1` can
close**. Any future probability-bearing law requires a separately authorised probability-sampling
protocol with a defined target population, probability selection, non-response treatment, weights
and `eligibleForPrevalence: true`; absent that, activation remains `NONE` and canonical causes must
be explicit. Research completeness has a measured stopping condition; it is neither endless nor
declared by document length.

### §10.22 · `AMP-1` — MASSING TYPES MAY LAND; HISTORICAL DISTRIBUTIONS MAY NOT

`map-corpus/docs/ARCHITECTURAL-MASSING-EVIDENCE-WAVE1.md` is a European discovery survey, not the
`AMP-1` calibration cohort. Its thirty case/source entries establish the **shape of the evidence
contract** and several counterexamples: a body is a phased complex of supported parts; tall clear
volumes are not storeys; roof, facade, frame, floor and use may have different campaigns; material
is component-local; and survival, repair, reuse and recording depth are separate from social status.
They do not estimate height, storey, pitch, roof, material, courtyard or alteration frequencies.

The binding architectural observation keeps independent axes independent:

- `bodyKind` says what geometric body is being measured; `morphologyRole` says how a part relates to
  its complex; `functionalProgram` says what the volume does. None substitutes for another;
- every vertical measurement names its datum and support, with bounded/estimated values visibly
  different from measured ones;
- base, frame, infill, cladding, floor, roof covering and repair each carry their own material state,
  phase and provenance; one visible component never dates the whole body;
- roof campaigns and typed interventions refer to owned parts. A visually continuous ridge across
  two semantic bodies is an explicit `RIDGE_CONTINUATION` relation, not a shared roof owner; and
- evidence certainty for existence, extent, date, function and material remains component-specific.
  `UNKNOWN` is legal in research/import state, but a published dimensional scene either resolves
  every geometry-bearing field, emits `MASSING_CANON_INCOMPLETE`, or stays `PLANAR_V1`.

`AMP-1` must freeze its child frame before outcome inspection, cluster repeated buildings/phases
under site and source package, balance recording and survival bias, and assign its 18% holdout at
the **site/source-package cluster** so another edition, survey or phase cannot leak the same complex
into development. Its world instrument G-51W and source-reliability classes must be frozen before
measurement. Plan pixels and the G-51P projection instrument remain ineligible for world height,
pitch, storey, material or status bands.

This creates a hard two-lane implementation boundary. **D3a** may land the support-relative
`SolidPartQ`, composite `MassBody`/`MassPartQ`, functional-volume/floor distinctions,
component-material slots, typed architectural-history operations, analytic roof compiler and
explicit fixtures. It has no live resolver and must prove existing seeds byte-identical. **D3b**
may derive only scoped, function/structure-conditioned mechanisms and engineering ranges from a
promoted, versioned `AMP-1` scope pack after development, reliability, range-stability and
sealed-holdout gates pass. The balanced child frame cannot estimate historical occurrence
frequencies, roof/material/storey distributions or activation weights; those remain `NONE` absent a
separate probability-sampling protocol under §10.21. A failed or incomplete program yields
`UNCALIBRATED`/`HOLDOUT_FAILED`, never tuned defaults. In particular, §279's prosperity/material
inverted-U remains a named research hypothesis and is absent from D3a fixtures and exits.

### §10.23 · `RSLP-1` — THE COUNTRYSIDE IS A CANONICAL LANDSCAPE, NOT URBAN LEFTOVERS

`map-corpus/docs/RURAL-SETTLEMENT-LANDSCAPE-EVIDENCE-WAVE1.md` is likewise a European discovery
survey, not a registered `RSLP-1` cohort. Its cases establish that compact, dispersed, polyfocal,
seasonal, contracting and abandoned rural systems all require representation; that residence,
holding, right, production and visible boundary are different facts; and that field systems,
commons, farmsteads, routes and waterworks are dated regimes rather than settlement-tier dressing.
They do not validate the sandbox's binary nucleation selector, open-field default, food shares,
acreage/reach/rate/cap constants, two-/three-field counts, common radii, keeper or barn rules.

The evidence-invariant canonical boundary is a time-indexed artifact, not a particular agrarian
theory:

```ts
type RuralKnowledgeStatus = 'KNOWN' | 'PARTIAL' | 'UNKNOWN';

type RuralFieldId =
  | 'AGRARIAN_REGIME' | 'SETTLEMENT_NODES' | 'HOLDINGS' | 'WORK_COMPLEXES'
  | 'LAND_UNITS' | 'RIGHTS' | 'ROUTES' | 'HYDRAULICS' | 'PRODUCTION_NODES'
  | 'SEASONAL_LINKS' | 'CHANGE_OPERATIONS' | 'OCCUPANCY' | 'BOUNDARY'
  | 'LAND_USE' | 'TENURE' | 'PRODUCTION';

type RuralUnknownReason =
  | 'SOURCE_SILENT' | 'OUTSIDE_COVERAGE' | 'SOURCE_CONFLICT'
  | 'UNRESOLVED_TRANSFORM' | 'UNOBSERVED_PERIOD' | 'RIGHTS_RESTRICTED'
  | 'NOT_YET_RESEARCHED';

interface RuralUnknownFact {
  fieldId: RuralFieldId;
  reason: RuralUnknownReason;
  coverageRef?: EvidenceCoverageRef;
  provenanceRef: ProvenanceRef;
}

type RuralFieldKnowledge =
  | { status: 'KNOWN'; coverageRef?: EvidenceCoverageRef; provenanceRef: ProvenanceRef }
  | { status: 'PARTIAL'; limitationIds: readonly [string, ...string[]];
      coverageRef?: EvidenceCoverageRef; provenanceRef: ProvenanceRef }
  | { status: 'UNKNOWN'; reason: RuralUnknownReason;
      coverageRef?: EvidenceCoverageRef; provenanceRef: ProvenanceRef };

type RuralFieldKnowledgeMap = {
  readonly [K in RuralFieldId]: RuralFieldKnowledge;
};

type RuralValueKnowledge<T> =
  | { status: 'KNOWN'; value: T; coverageRef?: EvidenceCoverageRef; provenanceRef: ProvenanceRef }
  | { status: 'PARTIAL'; value: T; limitationIds: readonly [string, ...string[]];
      coverageRef?: EvidenceCoverageRef; provenanceRef: ProvenanceRef }
  | { status: 'UNKNOWN'; value?: never; reason: RuralUnknownReason;
      coverageRef?: EvidenceCoverageRef; provenanceRef: ProvenanceRef };

type RuralSeasonality =
  | { status: 'ALL_YEAR'; calendarRef: ArtifactHashRef; provenanceRef: ProvenanceRef }
  | { status: 'SEASONAL'; seasons: readonly [CalendarSeasonRef, ...CalendarSeasonRef[]];
      provenanceRef: ProvenanceRef }
  | { status: 'UNKNOWN'; reason: RuralUnknownReason; coverageRef?: EvidenceCoverageRef;
      provenanceRef: ProvenanceRef };

type RuralRegisteredVocabularyId = string & { readonly __ruralRegisteredVocabularyId: unique symbol };
type RuralVocabularyValue<TCore> =
  | { source: 'CORE'; value: TCore; registryRef?: never; registeredId?: never }
  | { source: 'REGISTERED'; value?: never; registryRef: ArtifactHashRef;
      registeredId: RuralRegisteredVocabularyId };

type RuralSettlementNodeKindValue = RuralVocabularyValue<
  'HAMLET' | 'FARMSTEAD' | 'SEASONAL_SITE' | 'SERVICE_NODE' | 'ABANDONED_SITE'>;
type RuralOccupancyValue = 'OCCUPIED' | 'SEASONAL' | 'VACANT' | 'ABANDONED';
type RuralWorkComplexKindValue = RuralVocabularyValue<
  'FARMYARD' | 'MILL_COMPLEX' | 'FISHERY' | 'EXTRACTION_YARD'
    | 'PROCESSING_GROUND' | 'STOCK_ENCLOSURE'>;
type RuralRouteKindValue = RuralVocabularyValue<
  'ROAD' | 'LANE' | 'TRACK' | 'DROVE' | 'CAUSEWAY' | 'WATER_ROUTE'>;
type RuralRouteRankValue = RuralVocabularyValue<
  'PRIMARY' | 'SECONDARY' | 'LOCAL' | 'ACCESS_ONLY' | 'UNRANKED'>;
type RuralHydraulicWorkKindValue = RuralVocabularyValue<
  'LEAT' | 'MILL_POND' | 'DRAIN' | 'DYKE' | 'WEIR' | 'IRRIGATION'
    | 'WATERING_POINT'>;
type RuralLandUseValue = RuralVocabularyValue<
  'ARABLE'|'PASTURE'|'MEADOW'|'HEATH'|'WOOD'|'ORCHARD'|'WETLAND'
    |'TERRACE'|'EXTRACTION'|'PROCESS_GROUND'|'WASTE'>;
type RuralBoundaryKindValue = RuralVocabularyValue<
  'HEDGE'|'BANK'|'DITCH'|'WALL'|'BAULK'|'FENCE'|'NONE'>;

type CoreAgrarianRegimeKind =
  | 'ARABLE' | 'PASTORAL' | 'MIXED' | 'HORTICULTURAL' | 'WOOD_PASTURE'
  | 'EXTRACTION_DOMINANT' | 'SEASONAL_MOBILE';

type RuralAgrarianRegime = RuralValueKnowledge<RuralVocabularyValue<CoreAgrarianRegimeKind>>;

type RuralNodeGeometry =
  | { kind: 'POINT'; anchor: PointQ }
  | { kind: 'AREA'; outline: PolygonQ };

interface RuralSettlementNode {
  nodeId: EntityId;
  kind: RuralValueKnowledge<RuralSettlementNodeKindValue>;
  geometry: RuralNodeGeometry;
  occupancy: RuralValueKnowledge<RuralOccupancyValue>;
  bodyIds: readonly EntityId[];
  holdingIds: readonly EntityId[];
  provenanceRef: ProvenanceRef;
}

interface RuralHolding {
  holdingId: EntityId;
  holderEntityIds: RuralValueKnowledge<readonly EntityId[]>;
  nodeIds: RuralValueKnowledge<readonly EntityId[]>;
  landUnitIds: RuralValueKnowledge<readonly EntityId[]>;
  rightIds: RuralValueKnowledge<readonly EntityId[]>;
  lifecycle: RuralValueKnowledge<{
    constructionEpoch: EpochId;
    removalEpoch?: EpochId;
  }>;
  provenanceRef: ProvenanceRef;
}

interface RuralWorkComplex {
  complexId: EntityId;
  kind: RuralValueKnowledge<RuralWorkComplexKindValue>;
  bodyIds: readonly EntityId[];              // references canonical spatial bodies
  landUnitIds: readonly EntityId[];
  productionNodeIds: readonly EntityId[];
  accessRouteIds: readonly EntityId[];
  provenanceRef: ProvenanceRef;
}

interface RuralRoute {
  routeId: EntityId;
  kind: RuralValueKnowledge<RuralRouteKindValue>;
  centreline: PolylineQ;
  rank: RuralValueKnowledge<RuralRouteRankValue>;
  accessRightIds: readonly EntityId[];
  seasonality: RuralSeasonality;
  constructionEpoch: EpochId;
  removalEpoch?: EpochId;
  provenanceRef: ProvenanceRef;
}

interface RuralHydraulicWork {
  workId: EntityId;
  kind: RuralValueKnowledge<RuralHydraulicWorkKindValue>;
  bodyIds: readonly EntityId[];
  channelIds: readonly EntityId[];
  upstreamWorkIds: readonly EntityId[];
  downstreamWorkIds: readonly EntityId[];
  provenanceRef: ProvenanceRef;
}

interface RuralProductionNode {
  productionNodeId: EntityId;
  kind: RuralValueKnowledge<
    RuralVocabularyValue<'CROP' | 'LIVESTOCK' | 'WOODLAND' | 'FISHERY' | 'EXTRACTION'
      | 'PROCESSING'>
  >;
  locationEntityIds: RuralValueKnowledge<readonly EntityId[]>;
  inputResourceIds: RuralValueKnowledge<readonly string[]>;
  outputResourceIds: RuralValueKnowledge<readonly string[]>;
  capacity: RuralValueKnowledge<MeasureQ | null>; // KNOWN null = attested not applicable
  provenanceRef: ProvenanceRef;
}

interface RuralSeasonalLink {
  linkId: EntityId;
  kind: RuralValueKnowledge<RuralVocabularyValue<
    'MIGRATION' | 'TRANSHUMANCE' | 'GRAZING' | 'CULTIVATION'
      | 'HARVEST' | 'MARKET_ACCESS'>>;
  fromEntityId: EntityId;
  toEntityId: EntityId;
  seasons: readonly [CalendarSeasonRef, ...CalendarSeasonRef[]];
  rightIds: readonly EntityId[];
  provenanceRef: ProvenanceRef;
}

type RuralChangeOperationKind =
  | 'CREATE' | 'REMOVE' | 'SPLIT' | 'MERGE' | 'ENCLOSE' | 'OPEN'
  | 'CONVERT_LAND_USE' | 'REASSIGN_RIGHT' | 'RELOCATE' | 'ABANDON'
  | 'REOCCUPY' | 'BUILD_WORK' | 'REMOVE_WORK';

interface RuralChangeOperation {
  artifactKind: 'RURAL_CHANGE_OPERATION';
  artifactId: ArtifactId;
  operationId: EntityId;
  schemaVersion: number;
  lawVersion: LawVersion;
  kind: RuralChangeOperationKind;
  affectedEntityIds: readonly [EntityId, ...EntityId[]];
  effectiveAt: TimeKey;
  cause: CauseDisposition;
  beforePhaseRef: ArtifactHashRef;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface RuralChangeReceipt {
  kind: 'RURAL_CHANGE';
  artifactId: ArtifactId;
  receiptId: EntityId;
  schemaVersion: number;
  lawVersion: LawVersion;
  authority: DerivationAuthorityRef;
  operationRef: ArtifactHashRef;
  beforePhaseRef: ArtifactHashRef;
  afterPhaseRef: ArtifactHashRef;
  effectiveAt: TimeKey;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface RuralLandscapePhase {
  artifactKind: 'RURAL_PHASE';
  artifactId: ArtifactId;
  phaseId: EntityId;                        // stable phase identity
  schemaVersion: number;
  settlementId: EntityId;
  effectiveAt: TimeKey;
  constructionEpoch: EpochId;
  removalEpoch?: EpochId;
  vocabularyRef: ArtifactHashRef;
  agrarianRegime: RuralAgrarianRegime;
  settlementNodes: readonly RuralSettlementNode[];
  holdings: readonly RuralHolding[];
  workComplexes: readonly RuralWorkComplex[];
  landUnits: readonly RuralLandUnit[];
  rights: readonly RuralRight[];
  routes: readonly RuralRoute[];
  hydraulics: readonly RuralHydraulicWork[];
  productionNodes: readonly RuralProductionNode[];
  seasonalLinks: readonly RuralSeasonalLink[];
  changeOperationRefs: readonly ArtifactHashRef[]; // operations only; receipts live externally
  fieldKnowledge: RuralFieldKnowledgeMap;
  lawVersion: LawVersion;
  coordinateAbiVersion: number;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface RuralLandUnit {
  landUnitId: EntityId;
  outline: PolygonQ;
  landUse: RuralValueKnowledge<RuralLandUseValue>;
  boundaryKind: RuralValueKnowledge<RuralBoundaryKindValue>;
  holdingIds: readonly EntityId[];
  rightIds: readonly EntityId[];       // visible enclosure is not ownership or exclusive use
  productionNodeIds: readonly EntityId[];
  provenanceRef: ProvenanceRef;
}

interface RuralRight {
  rightId: EntityId;
  kind: RuralValueKnowledge<
    'OCCUPY'|'CULTIVATE'|'GRAZE'|'MOW'|'WOOD'|'TURBARY'|'PASTURE'
      | 'FISH'|'WATER'|'TRANSIT'|'EXTRACT'
  >;
  holderEntityIds: RuralValueKnowledge<readonly EntityId[]>;
  landUnitIds: RuralValueKnowledge<readonly EntityId[]>;
  seasonality: RuralSeasonality;
  exclusions: RuralValueKnowledge<readonly string[]>;
  provenanceRef: ProvenanceRef;
}
```

`fieldKnowledge` is total: the validator requires exactly one closed disposition for every
`RuralFieldId`, rejects extra keys and checks status/data consistency. An empty array with `KNOWN`
means observed/attested empty within its coverage; an empty array with `UNKNOWN` is unobserved and
must carry a reason/provenance; `PARTIAL` must name limitations. The agrarian-regime disposition must
equal `agrarianRegime.status`. Every holding, production-node and right fact is independently
discriminated by `RuralValueKnowledge`: `UNKNOWN` cannot carry a value, `PARTIAL` carries a stated
value only with a nonempty limitation roster, and `KNOWN` carries the asserted value. A derived
whole-object status is `KNOWN` only when all fields are known, `UNKNOWN` only when all are unknown,
and otherwise `PARTIAL`; it is never serialized as a free scalar. Validator negatives include an
unknown field carrying holder, parcel, location, output, capacity or rights data. No consumer may
infer knowledge state from array length or treat a partial list as exhaustive.
Node kind/occupancy, work kind, route kind, hydraulic kind, production kind, seasonal-link kind,
agrarian regime, land use and boundary kind all use the same discriminated knowledge law. UNKNOWN
carries reason/coverage/provenance and no value; PARTIAL names limitations. A CORE vocabulary value
forbids registry fields. A REGISTERED value requires an exact registry artifact and ID equal to the
phase's `vocabularyRef`; free `OTHER_REGISTERED` strings and cross-version IDs are invalid. Phase
`fieldKnowledge` is derived/validated against every nested disposition, so a KNOWN field cannot hide
an UNKNOWN member.
Route rank is likewise total (`PRIMARY|SECONDARY|LOCAL|ACCESS_ONLY|UNRANKED` or a registered value)
inside `RuralValueKnowledge`; omission is not a rank. Projection may not default unknown rank to a
visual/causal priority.
All observation, route, seasonal-link and right seasons use `CalendarSeasonRef`; free strings are
invalid. A rural consumer joins only matching calendar artifact ID/hash and registered season ID.
All-year, seasonal and unknown are explicit dispositions, so an empty list cannot silently mean any
of them; observation-to-rural mismatches are negative fixtures.

`RuralLandscapePhase` is the exact hash-addressable artifact used by the spatial root's `RURAL`
dependency. A phase may name the operations that produced it, but it never embeds a receipt whose
`afterPhaseRef` would create a hash cycle. Each immutable `RuralChangeOperation` references only its
before phase; an external `RuralChangeReceipt` hash-binds operation, before phase and after phase.
Operation/receipt law, effective time, settlement and provenance must agree, and the after phase's
`changeOperationRefs` must include the operation—not the receipt—exactly once.

The ordering is causal, not merely cartographic. Terrain, hydrology and inherited rights/projects
may constrain both settlement and working land; rural and urban phases may then co-evolve through
dated operations. The compiler must therefore receive or derive a validated `RuralLandscapePhase`
beside the urban artifacts and reconcile their shared boundaries. It may not first finish an urban
umbrella and then treat every remainder as arable. Production class is one canonical typed input:
`ARABLE`, `PASTORAL`, `MIXED`, other registered regimes, or `UNKNOWN`; words such as wool/livestock
may not simultaneously trigger maximum tillage and rough pasture through separate readers.

The current sandbox's `habitation.js`, `fields.js`, `commons.js`, route fallbacks, resource siting
and institution-name heuristics remain experimental presentation/mechanism hypotheses. Shared-
vertex topology, area-true ground refusal, deterministic operation budgets and land-use drawing
primitives may be reused as engineering techniques. Until `RSLP-1` promotion, those modules may not
mint canonical supply, tenure, occupancy, road, common or field facts; missing canon yields
`STRUCTURAL_ONLY` output or a typed `RURAL_CANON_INCOMPLETE`, never fallback tillage. One canonical
polygon owns both common/open-ground reservation and rendering; a circle used for collision while a
different polygon is painted is a geometry-authority violation.

The eventual module boundary is one-way: `rural/landscapeArtifact.js` owns these types, validation
and hashes; `rural/landscapeResolver.js` is the `RSLP-1`-gated historical resolver;
`rural/landscapeProjection.js` maps already-canonical land/routes/bodies to T-23/T-24 DrawOps.
Projection never writes supply or world state, and urban fabric does not import a presentation
fallback as causal substrate.

`RSLP-1` maintains its own metadata-frozen child frame and 18% sealed holdout at the
site/source-package cluster. Agrarian regime, cluster topology, occupancy and condition observed
during audit are outcomes, not selection strata; a value unavailable from frozen metadata is
`UNKNOWN`. After its mechanism-specific eligible-cohort, rights/coverage, clustered-range,
counterexample, saturation and holdout gates pass, `RSLP-1` may promote only scoped conditional
engineering ranges and relationships. Occurrence rates, count distributions, regime/tenure
prevalence, keeper/barn/common frequencies and activation weights remain `NOT_IDENTIFIED`/`NONE`
unless a separate probability-sampling protocol supplies the eligible target population,
denominator and design. An explicit canonical world cause may deterministically activate or
instantiate this settlement, but those population-level probability fields remain
`NOT_IDENTIFIED`/`NONE`.

### §10.24 · BUILT-IN/CUSTOM PARITY — origin is provenance, never a geometry privilege

Every canonical spatial entity/artifact reaches one `ProvenanceRecord.origin` and therefore records
exactly one source class: `BUILT_IN`, `CUSTOM`, `IMPORTED` or `AUTHORED`. The geometry compiler does
not branch on that class. It consumes the same validated finite-semantic recipe and runs the same
placement, support/solid legality, identity, privacy, projection, export and persistence gates.

```ts
type SpatialRecipeKind = 'INSTITUTION' | 'BUILDING' | 'DEFENCE' | 'WORKS'
  | 'VEGETATION' | 'TERRAIN_FEATURE' | 'FLOATING_STRUCTURE' | 'OTHER_REGISTERED';
type RegisteredSemanticTypeId = string & { readonly __registeredSemanticTypeId: unique symbol };
type RegisteredSpatialRoleId = string & { readonly __registeredSpatialRoleId: unique symbol };

interface ValidatedSpatialRecipeEntry {
  entryId: EntityId;
  schemaVersion: number;
  recipeKind: SpatialRecipeKind;
  semanticTypeId: RegisteredSemanticTypeId;
  spatialRoleIds: readonly [RegisteredSpatialRoleId, ...RegisteredSpatialRoleId[]];
  massingRecipe:
    | { status: 'PRESENT'; recipeRef: ArtifactHashRef }
    | { status: 'NONE'; reason: 'NON_MASSING_RECIPE' };
  allowedOperationKinds: readonly OperationKind[];
  validationProfileRef: ArtifactHashRef;
  contentHash: ContentHash;
}

interface SpatialRecipeRegistrySnapshot {
  artifactKind: 'SPATIAL_RECIPE_REGISTRY_SNAPSHOT';
  artifactId: ArtifactId;
  schemaVersion: number;
  registryId: string;
  registryVersion: string;
  originClass: 'BUILT_IN' | 'CUSTOM';
  entries: readonly [ValidatedSpatialRecipeEntry, ...ValidatedSpatialRecipeEntry[]];
  migrationAdapterRefs: readonly ArtifactHashRef[];
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface CustomContentParityFixturePair {
  pairId: EntityId;
  semanticTypeId: RegisteredSemanticTypeId;
  builtInRecipe: SpatialRecipeEntryRef;
  customRecipe: SpatialRecipeEntryRef;
  invariantProfileRef: ArtifactHashRef;
}

interface CustomContentParityFixtureRegistry {
  artifactKind: 'CUSTOM_CONTENT_PARITY_FIXTURES';
  artifactId: ArtifactId;
  schemaVersion: number;
  pairs: readonly [CustomContentParityFixturePair, ...CustomContentParityFixturePair[]];
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface ContentRegistryBundle {
  artifactKind: 'CONTENT_REGISTRY_BUNDLE';
  artifactId: ArtifactId;
  schemaVersion: number;
  builtInRegistryRef: ArtifactHashRef;
  customRegistryRefs: readonly ArtifactHashRef[];
  frozenSnapshotRefs: readonly ArtifactHashRef[];
  fantasyMechanismRegistryRef: ArtifactHashRef; // exact registry; canonical empty is legal
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface ResolvedCustomContent {
  subject: ProvenanceSubjectRef;
  recipe: SpatialRecipeEntryRef;
}

interface UnresolvedCustomContent {
  subject: ProvenanceSubjectRef;
  requiredRecipe: SpatialRecipeEntryRef;
  preservedSubjectContentHash: ContentHash;
  reason: 'REGISTRY_REMOVED' | 'VERSION_UNAVAILABLE' | 'DEPENDENCY_MISSING'
    | 'VALIDATION_FAILED';
  allowedActions: readonly ['READ_PRESERVED_CANON'];
}

interface ContentResolutionReportBase {
  artifactKind: 'CONTENT_RESOLUTION_REPORT';
  artifactId: ArtifactId;
  schemaVersion: number;
  sourceSpatialRef: ArtifactHashRef;
  contentRegistryBundleRef: ArtifactHashRef;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

type ContentResolutionReport =
  | (ContentResolutionReportBase & { status: 'ALL_RESOLVED';
      resolved: readonly ResolvedCustomContent[]; unresolved?: never })
  | (ContentResolutionReportBase & { status: 'HAS_UNRESOLVED_CUSTOM_CONTENT';
      resolved: readonly ResolvedCustomContent[];
      unresolved: readonly [UnresolvedCustomContent, ...UnresolvedCustomContent[]] });

interface RegisteredFantasyMechanismDefinition {
  artifactKind: 'REGISTERED_FANTASY_MECHANISM';
  artifactId: ArtifactId;
  schemaVersion: number;
  claimClass: 'EXPLICIT_FANTASY_CANON';
  operationKinds: readonly [OperationKind, ...OperationKind[]];
  spatialRecipeRefs: readonly [SpatialRecipeEntryRef, ...SpatialRecipeEntryRef[]];
  validationProfileRef: ArtifactHashRef;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}

interface RegisteredFantasyMechanismRegistry {
  artifactKind: 'REGISTERED_FANTASY_MECHANISM_REGISTRY';
  artifactId: ArtifactId;
  schemaVersion: number;
  definitionRefs: readonly ArtifactHashRef[]; // canonical empty registry is legal
  executableVocabularyRef: ArtifactHashRef;
  lawVersion: LawVersion;
  provenanceRef: ProvenanceRef;
  contentHash: ContentHash;
}
```

The spatial compile request and root bind one exact `ContentRegistryBundle`; every built-in/custom
entry and version used by any entity is in that hash chain. Saves retain the immutable custom
registry snapshots needed by published canon. Removing/upgrading a live custom package therefore
cannot delete, reinterpret or corrupt an existing settlement: the last canonical spatial bytes and
snapshot remain readable. If required bytes truly cannot be resolved, the map preserves the entity,
shows `UNRESOLVED_CUSTOM_CONTENT`, and refuses recompile/mutation—never silently deletes it.
Canonical provenance keeps the original `ProvenanceRecord.recipeBinding` byte-stable and
orthogonal to `origin`; installed-package
availability never rewrites an origin or spatial hash. A `ContentResolutionReport` is a separate
load/projection artifact. Its resolved plus unresolved subject refs form an exact, duplicate-free
partition of every entity or artifact whose BOUND recipe resolves a registry snapshot with
`originClass:'CUSTOM'`, including IMPORTED or AUTHORED subjects that use a custom recipe.
`ALL_RESOLVED`
forbids unresolved rows; `HAS_UNRESOLVED_CUSTOM_CONTENT` requires at least one. Each row's recipe
entry ID/hash resolves the frozen registry snapshot in the selected bundle, and every unresolved
row preserves the subject hash and permits only read-only projection.
For a BUILT_IN origin with a BOUND recipe, `sourceRegistryRef` equals that recipe's snapshot; for a
CUSTOM origin, `frozenRegistrySnapshotRef` equals it. Imported/authored origins may bind either
built-in or custom recipes. Geometry modules receive only the normalized recipe binding and are
source-checked against reads of `origin.kind` or source-specific origin refs.

Built-in and custom entries for the same institution/recipe family run the identical conformance
suite: placement and volume legality, massing/spatial-role validation, deterministic hashes,
screen/vector/raster parity, export metadata, PUBLIC/DM privacy, save/reload/migration, removal and
version-change recovery. Expected hashes may differ because origin/registry identities differ;
behavioral and geometric invariants may not.
`GenerationManifest.requiredReleaseCensuses` contains `CUSTOM_CONTENT_PARITY` exactly once and its
fixture ref resolves a nonempty paired registry keyed by shared `semanticTypeId`. Every generation
node that consumes `CONTENT_REGISTRY_BUNDLE`, and every projection, hit, export, save/load and
migration adapter, declares that census in `invariants`; absence is a manifest failure. Each pair
executes the complete list above, including missing-package read-only recovery and version-change
migration. A custom-only compiler branch or weaker privacy/export path therefore cannot pass.
For the first supported content families, fixture pairs equal the complete intersection of
built-in and custom `semanticTypeId`s—sampling or hand-picking a passing pair is forbidden. A
custom building's package manifest, origin snapshot, bound recipe entry, bundle snapshot,
resolution row and fixture row must agree on registry ID/version plus entry ID/content hash.

A custom necromantic citadel, floating sanctuary or other fantasy mechanism requires explicit
SettlementForge canon, a registered recipe, typed canonical operation and receipt—not a fabricated
medieval citation. `EXPLICIT_FANTASY_CANON` may execute through `CANONICAL_OPERATION` authority and
never claims historical incidence. Historical evidence gates apply only when a feature claims
cultural/historical authenticity or a culture/period-conditioned default; historical prevalence,
population frequency or activation additionally requires a probability-sampling protocol. The automatic morphology pack
remains `EUROPEAN_FANTASY_BASE`. Non-European names and explicit custom canon remain valid, but the
engine makes no claim that European street/parcel laws authentically reproduce Arabic, East Asian,
Mesoamerican, South Asian or steppe settlement traditions; those require future separately
researched map-tradition packs.

The bundle's `fantasyMechanismRegistryRef` resolves the one closed mechanism registry. Every
`REGISTERED_FANTASY_MECHANISM` definition and every recipe it names is present in that same bundle.
A `CanonicalSpatialOperation` using `REGISTER_FANTASY_WORK` or a registered fantasy operation must
use the `REGISTERED_FANTASY_MECHANISM` authority branch; its registry, definition and bundle refs
match byte-for-byte, its operation kind is listed by the definition and its payload validates one
of the definition's recipe refs. A bare operation kind, historical mechanism or unregistered
definition cannot authorize the work.
Its generation node uses only a non-evidence gate (`CANONICAL_INPUT`/registered feature authority);
an `EVIDENCE_REQUIRED` gate on an `EXPLICIT_FANTASY_CANON` operation is invalid. A negative fixture
proves that historical-gate substitution cannot block or falsely authenticate explicit fantasy canon.

### §10.25 · CORE-FIRST IMPLEMENTATION BOUND — completeness does not outrank a working spine

The architecture is now bounded against runaway edge-case design. A finding blocks the first
implementation tranche only when it can affect a supported path by corrupting or losing saved
canon, creating a second geometry authority, breaking deterministic identity/replay, leaking DM
content, silently inventing missing facts, or making a false historical/cultural claim. Other valid
concerns remain recorded but do not expand the tranche.

The required vertical slice is deliberately small and complete: one built-in building and one
custom version of the same semantic type; one exact world/dossier/fabric/spatial save and reload;
one missing-custom-package read-only recovery; one registered explicit-fantasy construction
operation; one PUBLIC and one DM projection/export; and deterministic replay under the same
manifest/ABI/law/registry hashes. It uses `EUROPEAN_FANTASY_BASE`, surface leaf 0, explicit canonical
massing and the fixed-survey light convention. Passing this slice proves the owner laws without
requiring every portal, subterranean, multi-registry, historical-operation, world-time-light or
future map-tradition combination first.

Implementation order remains foundation/D1 → fresh W3/frontage → D3a explicit massing → D4 shared
occlusion/draw/export → the parity vertical slice. Work stops for a measured review at that point.
Probe/world-time light, D3b/AMP and RSLP promotion, additional fantasy-operation families,
cross-package dependency graphs, advanced migration combinations and non-European tradition packs
are later tranches. A deferred case is promoted only by a reproducible failure on the supported
slice, a security/privacy or data-loss risk, or a new owner decision—not by theoretical completeness
alone.

⭐⭐⭐ **THE RESULT IS ONE COHESIVE PRODUCT, NOT A COMPROMISE BETWEEN A SIMULATOR AND A DRAWING TOOL.** The generator owns lawful spatial truth. The living world changes it only through dated causes and receipts. The map observes one leaf at one time. The projection makes visibility and light legible without inventing matter. The editor may depart freely while preserving origin, interventions and conflicts. The AI proposes through the same typed doors. And every claim — visual, causal, historical, commercial — is graded only by the evidence that can actually support it.

---

## APPENDIX A · INSPIRATION, NOT DERIVABLE — and therefore NOT in the pipeline

**The rule this appendix exists to enforce (§246.2): a mechanism without a derivation home is
DECORATION and must be labelled so.** Everything below is something the corpus does well that
**no dossier fact I can identify would drive.** None of it may enter §1's stages. Each row states
what fact would be needed, so a future ruling can move it out of here rather than reinvent it.

| # | the thing | why it is not derivable | what would be needed |
|---|---|---|---|
| **A-1** | ⭐ **MICROCLIMATE — wind bearing, sun bearing, aspect, frost, salt exposure** | ⛔ **We hold NO bearing field of any kind** (the §7/E8 correction established this for hazards). It is the **most frequently drawn siting logic in the corpus** — eight independent plates: the shaded shore empty and the sunny shore strung with villages; the frost hollow left unplanted; every village upwind of the ash | a prevailing-wind bearing and a sun/aspect model. ⛔⛔ **A bearing invented at generation is a NEW WORLD FACT, and under THE PROMISE that is a SEED-PERMANENT commitment. §251.5 correctly refused it. OWNER-GATED, filed, NOT PROPOSED** |
| **A-2** | **SHORE TYPE** — shingle / sand / mud / cliff / reef | `coastal` is one token; two plates key their whole waterfront off shore type | a shore-type fact, or G-30's composite modifiers |
| **A-3** | **SOIL / DRAINAGE PROXY** | one plate's entire argument is *nucleated on the spring line, dispersed on the wet clay, absent on the dry down* | a soil axis. Partly proxied by `terrainType` + water mode; **not honestly derivable today** |
| **A-4** | **BUILDING MATERIAL as a grammar** | ⚠ ***Nearly* derivable** — `resources` × `terrainType` × dated function/phase exist or can be registered, but the mapping affects every footprint on every leaf; narrative culture is not an input | a bounded European AMP-1 ruling plus declared-shift receipt, not a guessed fact. **Flagged rather than assumed.** *(G-6 owns the gated candidate.)* |
| **A-5** | **CULTURAL PLAN GRAMMARS beyond material** — walled wards, rank belts, causeway cities | these are political/institutional histories, not output styles, and the current broad culture token is narrative | **OWNER-RULED OUT for `EUROPEAN_FANTASY_BASE`: culture selects no map grammar. A future map tradition requires a separate evidence program.** |
| **A-6** | **THE OBLIGATION GRAPH** — that hamlet X buries at church Y | we hold `neighbors` and `institutions` **separately**; nothing relates them as a dependency | a modelling decision, not a rendering one |
| **A-7** | **A RUIN REUSED AS AN ENCLOSURE** — a market place inside a roofless basilica; an amphitheatre converted to garden terraces | needs a notion of a ruin's **usable enclosed volume** | a volume/enclosure model for ruins |
| **A-8** | **THE SPECIFIC CHARM OF A MIS-SHAPED BLOCK** — a wedge, a swallowed lane | ⭐ **our version must come from §3.5's COLLISIONS; the corpus's comes from a model's hand, and the difference is not derivable** | nothing — this is correctly answered by G-10 + G-18, not by imitation |
| **A-9** | **THE DENSITY OF INCIDENTAL NAMED DETAIL** | our truth layer names things **correctly**, which is better; the *density* of incidental naming is a taste call | a taste ruling |
| **A-10** | **WHICH OF THE SIX CENTRE TYPES "FEELS RIGHT"** beyond §1.1.12c's causal rules | the rules cover most of it; **the residue is taste** | nothing |
| **A-11** | ⭐ **THE CORPUS'S WILLINGNESS TO LEAVE LARGE AREAS QUIET** | several of the best plates have a whole sector doing very little. **PLAN could find no derivation for RESTRAINT and suspects it is a composition judgment rather than a settlement fact** | ⚠ recorded honestly. *If a later lane finds a derivation for restraint it will be worth more than most of §4's ledger* |
| **A-12** | **hf338's UNFINISHED SURVEY** — one sheet in four states of completion grading into one another | ⭐ **it is not a settlement fact at all; it is A PICTURE OF OUR OWN RENDER PIPELINE** | nothing — it is the natural reference for progressive rendering, partial-detail LOD and any surveyed/unsurveyed fog concept, and **it needs no derivation home** |

⚠ **AND ONE WITHDRAWN FINDING, LEFT VISIBLE RATHER THAN RENUMBERED AWAY (PLAN §10.3).** A finding
about **desire paths** — informal worn tracks cutting the corners between formal radiating roads
outside a gate — was **WITHDRAWN entirely** because its only witness was inside the blind
holdout. ⭐⭐ **§250.7 made the discipline law: A STUDY TAKES THE LOSS RATHER THAN CONTAMINATE THE
then-believed HOLDOUT.** §10.17 now records that the final roster was not untouched; that correction
does not revive the finding. If a future lane wants it, it must obtain an **independent licensed
witness outside this synthetic corpus**. *(CONTEXT's CX-33 reaches worn approaches by a different
route and is in G-15; the desire-path finding specifically remains gone.)*

### ⟦FOLD §275⟧ A.13 · PARKED AND REJECTED AT §275 — recorded so nobody re-litigates them

| Item | Disposition | Why |
|---|---|---|
| **A full real-historical GIS/geometry corpus** (Historic Towns Atlas plans, ADS collections, HER data) | **PARKED** | The best sources carry commercial-use restrictions or per-collection licences — the §248/§254 IP discipline applies to DATA exactly as to code. G-45's open-data cohort is the lawful carve-out; anything beyond it needs a licensing review first. **§10.20's citation/metadata/concise-factual-claim registry is not a traced GIS corpus and does not unpark geometry ingestion.** |
| **The Rust/Wasm modernization plan** (kernel rewrite, schema migration, ~40–50 engineer-weeks) | ⛔ **REJECTED** | It solves a from-scratch problem this program does not have: determinism, lineage IDs, per-mechanism streams, epochs, area-true predicates and the acyclic graph are BUILT and receipted. Adopting it would rebuild the program back to wave one |
| **VTT/Foundry integration protocol** (the event vocabulary, iframe/postMessage surface, calendar sync) | **PARKED as reference** | Genuinely useful for a FUTURE integration surface — it documents what downstream tabletop consumers expect — but it is not current work and touches no current stage |
| **ML in the core generator** | Already ruled (§234) | Modern-city training data, and hard validity/determinism/editability outrank statistical imitation; optional style-prior/reranking territory only, after procedural metrics are strong |
| **Expert-historian judging panels** | **DEFERRED to launch phase** | The right final arbiter for causal-plausibility claims, but premature while known structural gaps remain on our own ledger |

---

## APPENDIX B · CHAIR QUESTIONS — holes this synthesis found, raised rather than filled

**Six questions. Three were NEW — nobody in §150–§253 had ruled on them and this synthesis
surfaced them by putting the studies beside the code. Three are CARRIED — already raised by a
lane and still open, restated here because a build sheet that omits them will run into them.**

⟦FOLD §264⟧ ⭐⭐ **AND THE FIRST THING THIS FOLD FOUND, WHICH IS THE §257.2 CLASS BITING THE VERY
DOCUMENT THAT NAMED IT: ALL THREE NEW QUESTIONS WERE RULED AT §257.3 — IN THE SAME LEDGER ROW THAT
COLLECTED THIS SPECIFICATION — AND THIS APPENDIX WENT ON CARRYING THEM AS OPEN.** *A ruling made
after a document is folded does not reach the document.* **Q-1, Q-2 and Q-3 now carry their rulings.
Q-4, Q-5 and Q-6 remain genuinely open**, and nothing else in this appendix is answered here.
⚠ **Q-2's ruling is not a footnote — it is a wave-nine-first-order defect (G-42) that would
otherwise have been discovered in W4, after the machinery it breaks had been built.**

### Q-1 · NEW · May a WITHDRAWN grading target remain a GENERATION input?

**The situation.** ATLAS T-01 ⛔ **withdrew** the thorp (8–14) and hamlet (18–26) grain rungs —
the instrument that produced them is invalid at those tiers, and §244.5 ordered every verdict
issued against them withdrawn too. **But the built `GRAIN_BAND` table consumes both numbers as
GENERATION inputs**, and `cells(pop)`'s seam construction reads through them: `GRAIN_SEAMS`
begins `8 → 16 → 28 → …`, so **the withdrawn rungs shape the curve at village tier as well.**

**Why it is a genuine hole.** The withdrawal is about **measurement validity**, not about whether
the numbers are a reasonable generation target. Deleting them leaves `cells(pop)` **undefined
below village**; replacing them with new numbers would be **tuning wearing measurement's
clothes**, which this program forbids by name.

**Three options, none taken:** (a) **KEEP them, labelled UNMEASURED in the code**, with a comment
citing §244.5 and a standing note that no grading verdict may be issued at those tiers — the
interim rule this spec uses; (b) **BUILD THE ROOF-COUNT INSTRUMENT FIRST** (§249.4c already queued
it; the plates carry 6–24 roofs so an eye count is *exact*) and re-derive both rungs from it,
which is the only option that restores them honestly; (c) **derive the low rungs from household
count rather than grain**, which J-B8-3 already half-does — *the roof count is the grain's
consequence above village and the household count's at and below it.*
**RECOMMENDATION (vetoable): (a) now, (b) queued.** ⚠ **But the chair must say so, because right
now the code silently spends a withdrawn number.**

⟦FOLD §264⟧ ✅ **RULED AT §257.3(b), AND THE RECOMMENDATION WAS TAKEN:** *"a WITHDRAWN GRADING
TARGET MAY REMAIN A GENERATION INPUT — the thorp/hamlet rungs were withdrawn because THE INSTRUMENT
cannot measure them (it counts hedges as buildings), not because the derivation is wrong; the
generator must still produce something at those tiers."* ⭐ **The rungs KEEP their numbers, are
labelled `UNVALIDATED-BY-INSTRUMENT` in the code so nobody mistakes "it generates" for "it measures
well", and no grading verdict may be issued against them. The roof-count instrument restores
validation.** *(a) now, (b) queued — exactly as recommended.* **Folded into C-3, G-33 and W0.**

### Q-2 · NEW · The epoch ladder is a CIRCUIT ladder. What derives a FABRIC epoch that no circuit marks?

**The situation.** §240's law is *core → wall → ring → wall → ring*, and the built `epochAxis.js`
implements exactly that: **one epoch per circuit, plus the suburb.** Every unwalled leaf
therefore gets **exactly ONE epoch** (`laneMFARCH2-receipt.md` §2.2 — thorp, hamlet, village,
mountain, fjord, year-018 all show `rings 0 → one unwalled epoch`).

**But PLAN §6.1 measures LEGIBLE FABRIC EPOCHS independently of circuits: village 1–2, town 2–3,
city 2–4, metropolis 3–4** — and a walled town with one circuit gets 2 epochs from the ladder
(walled + suburb) against a measured 2–3, while **an unwalled village measured at 2 epochs gets
1 by construction.**

**Why it matters and is not pedantic.** §240.3's vintage triad, PLAN §6.2's three dials and
W4's whole exit criteria are all **per-epoch**. If an unwalled settlement can have only one
epoch, then **no unwalled settlement can ever show a vintage difference, a bearing change or an
attachment mode** — and half the tier ladder is unwalled by §251's own measurement that *the
walled/unwalled split is essentially the tier line.*

**The question:** does a fabric epoch need its own derivation (from promotion events, prosperity
history and growth rate) independent of circuit events, with the circuit ladder becoming a
*subset* of the epoch ladder? ⚠ **The naive fix — minting epochs from population growth — is a
knob unless it is derived, and §240.2's "ring count is DERIVED, never a knob" is the binding
condition it must satisfy.** ~~**RAISED, NOT ANSWERED.**~~

⟦FOLD §264⟧ ⭐⭐⭐ **RULED AT §257.3(a), AND IT IS THE SHARPEST OF THE THREE:** *"**EPOCHS ARE
FABRIC EPOCHS, NOT CIRCUIT EPOCHS.** A wall is an EVENT WITHIN the epoch sequence, never its
definition; a village that grew over two centuries has two vintages and no wall at all. This does
NOT revise the owner's §240 law (which describes a WALLED settlement's sequence) — it corrects our
implementation's conflation, which would otherwise have made vintage difference impossible below the
wall line and made the walled/unwalled split silently equal the tier line. **Wave nine
first-order.**"*
⭐ **The answer to the question as asked is YES: the fabric epoch needs its own derivation and the
circuit ladder becomes a SUBSET of the epoch ladder.** ⚠ **The binding condition the question named
survives intact — the derivation comes from founding age, promotion events, prosperity history and
recorded growth, never from a population knob, and the measured ≤4-epoch ceiling bounds it.**
**Folded into S5-a, gap G-42 and W2.**

### Q-3 · NEW · Is `GRAIN_BAND` the MEASURED target or the DERIVATION target?

**The situation.** `cells(pop)` sets a **derivation** target; T-01 bands a **measured** quantity
on the rendered plate. **The code uses the same numbers for both.** At town and city that is
fine — the drawing resolves and the measured value lands in band. At metropolis the derivation
computes **≈113 cells** and the plate measures **70**: the drawing loses roughly 38%.
⭐ **MF-B8 named the mechanism precisely: *the grain instrument measures what RESOLVES, not what
EXISTS* — b7's town already carried 82 plot modules across its window and counted 24.8.**

**The question.** Two readings and they lead to different work. **(a) The band is the MEASURED
target**, the derivation should aim *above* it wherever the drawing loses, and the loss factor is
itself a measured quantity per tier. **(b) The band is BOTH**, and any measured shortfall is a
DRAWING defect to be cured (the countryside at low tiers, LOD/merge behaviour at metropolis) —
in which case the derivation must never be inflated to compensate.
⭐ **This spec's PLAUSIBLE reading is (b)** — inflating the derivation would hide a drawing defect
behind a number, and `MFB8-runprobe.py` exists precisely to separate the two. ~~⛔ **But the chair
has not ruled, and the metropolis miss sits on exactly this ambiguity.**~~

⟦FOLD §264⟧ ✅ **RULED AT §257.3(c), AND THE SPEC'S OWN READING WAS UPHELD:** *"**`GRAIN_BAND` IS
THE TARGET; the derivation aims at it and the DRAWN result is the truth** — but the metropolis
deriving ≈113 while drawing 70 is not a spec ambiguity, it is a **MEASURABLE DISAGREEMENT BETWEEN
INTENT AND OUTPUT.**"* ⭐⭐ **AND THE RULING CARRIES AN ORDER THIS DOCUMENT HAD NEVER RECORDED: a
new census is required — DERIVED GRAIN AND DRAWN GRAIN MUST AGREE WITHIN A STATED TOLERANCE, so the
loss between them can never again be invisible.** ⛔ **Reading (a) is therefore closed: the
derivation may NOT be inflated to compensate for a drawing loss.** **Folded into §2.6 and W0**, with
`MFB8-runprobe.py` as the instrument and the tolerance as the census.

### Q-4 · CARRIED · T-05's fill: measure the atlas's quantity, or band ours?

ATLAS's `open_share_in_core` is a **texture** measure (8×8 blocks by edge density); the built
census computes `1 − building area ÷ wash area`. **Different quantities, and the built one has no
measured band.** MF-B8 flagged it and declared its band **DERIVED-NOT-CORPUS** rather than
reporting sixteen leaves of failure. **Wave nine must either measure the atlas's own quantity on
the plate, or set a band for ours — and say which.**
⚠ **A related unruled finding travels with it: the market void is present at EVERY tier including
village, where T-04 says it belongs to town+.** Either the target is wrong or the generator is;
**MF-B8 reported it for the chair and it is still open.**

### Q-5 · CARRIED · Does the extent derivation home get restored from our own leaves?

§249.4c ruled the population fit **UNRESTORABLE from the corpus**. §1.2c argues the restoration
path is our **own leaves**, whose populations are facts — 16 per tier, byte-deterministic, with
published extents. **That is a new instrument and it touches §5's tier table**, which MF-B8
explicitly declined as *"a §5 tier-table question and it is the chair's, not mine."*
**RAISED with the experiment named (G-5); not taken.**

### Q-6 · CARRIED · §240.2 says a village earns zero circuits, and the module does not enforce it

`epochAxis.js` caps how many circuits a settlement **maintains**; **whether there is a wall at all
remains the landed model's (`meta.hasWalls`)**, because refusing a circuit the model asserts would
break the one-decider rule. ⚠ **No walled leaf in the corpus is below town tier, so nothing in the
corpus tests the difference** (J-A2-4, flagged rather than settled).

⛔ ⟦FOLD §297/§298⟧ **Q-6 IS OVERTAKEN AT ITS PREMISE (§297.3b): "a village earns zero circuits" is
part of §240.2's PER-TIER CEILING TABLE, WHICH IS WITHDRAWN AS BINDING NUMBERS.** Two sub-town
enclosures in the corpus contradict village-0 directly, and the corpus's only two three-circuit
plates (`hf347`, `hf385`) are both **towns**, not metropolises. **The question is therefore not
"should the module enforce the cap" but "what does the settlement's own fact set derive" — §240.2's
first sentence, which stands.** The caps are re-derived against the corpus (hf347/hf385 included,
the walled-thorp question decided) in the epoch-calibration work; Q-6 carries in that form.

---

## APPENDIX C · INSTRUMENT AND MODULE MAP, AND WHAT THIS LANE DID NOT DO

### C.1 · The instruments a builder will need

| instrument | what it measures | ⚠ |
|---|---|---|
| `MFS1-grain2.py` | fabric grain (`cells_across`) | kernel reproduces all 22 archived rows exactly; ⛔ **windows are HAND-SET — use `MFB8-plates.mjs` instead** |
| `MFB8-plates.mjs` | **windows derived from the fabric's own built-umbrella bbox** | ⭐ **the cure for the hand-keyed-address rot class — take the window from the thing it is a window on.** ⚠ conservative for lobed settlements (J-B8-13) |
| `MFB8-runprobe.py` | ⭐ **separates what RESOLVES from what EXISTS** — see Q-3 | should be standard |
| `MFS1-aesthetic.py` | grain σ, wash σ, tone IQR, stroke percentiles | reproduces all 12 archived rows exactly; ⚠ **ran on 12 plates only**; ⚠ **re-window before spending its numbers at the new grain** |
| `HFM1-palette.py` | paper / ink / L-percentiles | ⭐ **a RECOVERY, not the original** — calibrated to within 3/255 on ink hex over 49 published pairs |
| `MFS1-measure.py` | texture blocks, palette clusters, colour-family shares | ⛔ **`center_edge_ratio` is noisy (median 7%, max 44%) — DO NOT BAND IT** |
| `MFS1-streets.py` | street widths (scanline) | ⚠ **not re-run at scale; T-04 is unverified at thorp/hamlet** |
| `MFS2-bands.py` + `MFS2-bands.json` | the re-pinned aesthetic bands from the CSV | every band recomputed, **never transcribed** |
| `MFS3a-*` / `MFS3B-context-census.py` | the plan and context censuses | re-runnable beside their compendiums |
| `MFARCH2-scc.mjs` | the SCC diagnostic at binding **and** field granularity | ⚠ **an SCC is only as wide as its scan** — five write-backs hid inside `censusLeaf` |
| `MFARCH2-hashtiers.mjs` · `-engines.mjs` · `-det.mjs` · `-drawn.mjs` | the three hash tiers · four V8 modes · cross-process determinism · the drawn censuses | ⛔ RASTER exits non-zero when `sharp` is unavailable; a driver that cannot run is reported, never passed quietly |
| ⟦FOLD §264⟧ ⛔ **tower spacing** — *does not exist* | spacing CV along the circuit · towers per unit circuit length | **G-40(i), ORDERED at §263.6a, lands in W0.** Gates S13's corner rule, §3.4 #7's re-read and **SUB-3** |
| ⟦FOLD §264⟧ ⛔ **per-epoch material / tone contrast** — *does not exist* | a **between-region** fill-tone (and texture) separation | **G-40(ii), ORDERED at §263.6a, lands in W0.** ⚠ `fill_tone_iqr` and `wash_within_sigma` are **whole-plate** statistics and are not substitutes |
| ⟦FOLD §264⟧ ⛔ **footprint rectangularity** — *does not exist* | the building-scale analogue of `block_solidity_p50` | ⭐ **THIS LANE'S FINDING, vetoable.** CONFIRMED by enumerating the planmetric and voidmetric key sets: **the finest spatial SHAPE metric we hold is BLOCK-scale.** Gates **G-39 arm 2** |
| ⟦FOLD §264⟧ ⭐ **derived-grain vs drawn-grain tolerance** — *does not exist* | the disagreement between what `cells(pop)` intends and what the plate shows | **ORDERED at §257.3(c) and never recorded until this fold.** `MFB8-runprobe.py` is the instrument; the census is the tolerance around it. **W0** |

### C.2 · The module map at MF-ARCH-2's tip

`buildFabric.js` (790 eff — the assembly) · `epochAxis.js` (179 — the ladder and the containment
closure) · `lateGround.js` (43 — the ground law's late passes) · `wallCircuit.js` (292 — the
canonical circuit node) · `walls.js` (197) · `builtUmbrella.js` (197) · `leafCensus.js` (275) ·
`fabricGeometry.js` (425 — the two quanta) · `reservedGround.js` (one answer to *does this body
stand in reserved ground*) · `districtPartition.js` (§232 as a derivation) · `tierGrammar.js` (the
grain derivation) · `parcels.js` (the plot series) · `groundLaw.js` · `habitation.js` ·
`accessLaw.js` (stratum-agnostic) · `waterWorks.js` · `substrate.js` · `snapshot.js`.
⛔ **`wallCycle.js` is DELETED** — with the version axis explicit its bounded solve had nothing
left to solve. **There are now ZERO bounded solvers in the fabric.**
⚠ **`renderFolio.mjs` is HARNESS, not domain.**

### C.3 · What this lane did NOT do — stated affirmatively so nothing is re-found as a gap

1. **Executed nothing.** No build, no test run, no measurement, no render. Every CONFIRMED label
   cites a named upstream lane's executed evidence; **no number in this document was computed by
   me.**
2. **No git writes, no memory writes, no state-mutating command of any kind.** The one git command
   used was the read-only `git show refs/heads/review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md`
   the brief specifies.
3. **No new law was invented.** Where the synthesis found a hole, it is a numbered chair question
   in Appendix B, not a filled gap.
4. **This lane opened no image file from its then-current exclusion set.** ⚠ The final 53-roster
   was selected later; inherited studies and this compiled document cite ids that entered it.
   Therefore this is a lane-execution statement, **not** an untouched-holdout claim (§10.17).
5. **The atlas, both compendiums and the prior-art study were NOT edited.** Where this document
   disagrees with one of them it says so in §0.4 and rules with reasons; **it does not silently
   replace a figure in its source.**
6. **MF-W1's characterization landed mid-lane and IS folded in** (§0.3, §0.3a, §0.3b, §4.1a,
   G-34, W0). ⚠ **What I did NOT do is re-verify any of its figures** — the authoritative set,
   the 2×2 decomposition and the 92-of-127 arithmetic are quoted from its receipt, not
   recomputed.
7. **The plates from MF-ARCH-2 were NOT viewed by this lane** — that obligation belongs to W0 and
   is stated as such rather than quietly absorbed.
8. **No owner-gated item was decided**: the terrain vocabulary (G-30), `eventFootprint` (G-11),
   the faubourg district-id change, the click-region contract, microclimate bearings (A-1),
   §5's tier table (G-5/Q-5) and the metropolis op ceiling all remain raised, not settled.
9. **Nothing here is a pin.** Every band is a target for the chair to convert into a pin, a band,
   or a rejection (ATLAS §2.8.4, inherited).

### ⟦FOLD §264⟧ C.4 · WHAT **MF-SPEC2** DID NOT DO — stated affirmatively, on the same terms

1. **Executed nothing about the generator.** No build, no test, no render, no measurement of any
   plate. The only commands run were read-only: the ODQ `git show` the brief specifies, `grep`/`sed`
   over `map-corpus/docs/**`, one deterministic re-rank script over **this file only**, and two
   `python3` one-liners that printed the **key names** of `MFS3a-planmetrics.json`,
   `MFS3a-voidmetrics.json` and two CSV headers. ⭐ **Those key-name enumerations are the ONLY new
   evidence this fold produced, and they are what CONFIRMS that no footprint-scale shape metric
   exists** (§2.6 row 7, G-40(iii), §4.1c arm 2).
2. **No number was recomputed and no band was re-derived.** Every figure in this document still
   comes from the lane that measured it. **Where a figure changed, a ledger ruling superseded it and
   the row is cited.**
3. **No git write, no memory write, no `git add`, no commit.** ⚠ The main worktree's index carries
   staged deletions by design (§257.5 / §263.6b); it was **not** touched and **not** refreshed.
4. **No new law was invented and no owner gate was crossed.** The owner-gated set is unchanged:
   G-30's terrain vocabulary, G-11's `eventFootprint`, the faubourg district-id change, the
   click-region contract, A-1's microclimate bearings, §5's tier table, the metropolis op ceiling —
   ⛔ **and street names, which remain REFUSED under §163 and are not re-proposed anywhere in this
   fold** (§0.5).
5. **This fold opened no excluded image file.** ⚠ It inherited plate-id reasoning from earlier
   studies, and some ids later entered the final 53-roster. It makes no untouched-holdout claim
   (§10.17).
6. **The two prior-art studies, both compendiums and the atlas were NOT edited.** Where this
   document disagrees with one of them it says so and rules with reasons; **it does not silently
   replace a figure in its source.**
7. **No GPL source was read, cloned, quoted or executed by this lane.** Everything about either
   generator here is quoted from the two study documents, which did their own clean-room purge and
   verified it mechanically (§259.1, §263.1). ⚠ **Whether counsel should confirm the clean-room
   posture before anything traceable to those studies ships remains an open owner item (§264.4).**
8. **Three new chair questions were NOT opened.** §264.4 records that the owner's build order adds
   no new question, and this fold added none — **the two ordering consequences it found (G-35 vs
   G-25, and G-36's split seeding) were resolved inside the document as dependency edges and exit
   criteria**, which is where §5's own machinery already handles them.
9. ⭐ **Every leg (c) in this fold is a PREDICTION.** The direction arguments behind G-35, G-36,
   G-37 and the tail are reasoned from each mechanism's structural properties against our measured
   bands. **None has been tested, and the experiment that settles all of them is the same one:
   implement clean-room, run the existing harness, read the named band.** ⚠ *Until then every ADOPT
   verdict here is a recommendation to try, not a claim about outcome.*

---

**MF-SPEC's original body and ⟦FOLD §264⟧ MF-SPEC2 end here; the collected file continues through
the later dimensional/authorship folds and ⟦FOLD §287⟧ §10's binding reconciliation above the
appendices.** This document remains the map program's spine/build sheet per ODQ §246.3. Historical
"ends here" wording records lane scope only; it no longer identifies the file's controlling tail.

⭐⭐ **AND THE INSTRUCTION IN THE CLOSING LINE IS THE ONE THIS FOLD EXISTS TO HONOUR, SO IT IS
RESTATED RATHER THAN REPLACED: where this document and a later ODQ ruling disagree, THE ODQ RULING
WINS — and the disagreement must be folded back into this file.** *A build sheet that carries a
refuted figure builds every future wave against a lie* — and this fold found **three rulings and one
retracted framing** that had been sitting in the ledger, unfolded, since the day the document was
collected. ⚠ **The next lane should assume the same thing has happened again.**
