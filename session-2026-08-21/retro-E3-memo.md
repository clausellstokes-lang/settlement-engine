# RETRO-E3 — EVIDENCE VERIFICATION MEMO
## Cluster: prior-art / IP / strategy / meta (§247, §248, §253, §254, §258, §259, §263, §265, §266)

**Role:** read-only evidence verifier. I do not rule. Every STATUS below grades the
EVIDENCE, not the judgment — the chair re-derives the judgment.
**Tree:** `/Users/cstokes/Desktop/settlement-engine`, branch `review-fixes-2026-07-08`,
HEAD `3e3366b9`. Shared dirty tree; no git write, no edit, no gate run performed.
**Sources read in full:** `docs/FABLE_RETROVALIDATION_QUEUE.md` (280 lines); the ODQ rows
at `docs/OWNER_DECISION_QUEUE.md:8879-10135`; the three study deliverables
(`map-corpus/docs/PRIOR-ART-FMG.md` 1,181 · `PRIOR-ART-WATABOU.md` 1,092 ·
`PRIOR-ART-FTG.md` 1,141); the three lane receipts in the old scratchpad
(`laneMFX1-receipt.md` · `laneMFX2-receipt.md` · `laneMFX3-receipt.md`); targeted reads of
`map-corpus/docs/GENERATION-SPEC.md`.
**Not done, per brief:** no external repository was fetched. All prior-art facts below are
graded as the receipts grade them — none is independently re-derived from upstream source.

⚠ **METHOD NOTE THAT CHANGED ONE OF MY OWN FINDINGS.** `git ls-files map-corpus/docs`
returns **0** in this worktree; `git ls-tree -r HEAD -- map-corpus/docs` returns **50**.
The index is the known "main worktree matches no branch" condition (laneMFX3 §10; ODQ
§263.6b). **Every tracking claim below is taken from HEAD's tree, never from the index.**

---

# §247 — THE MAP-AS-ACQUISITION STRATEGY

Queue entry: `docs/FABLE_RETROVALIDATION_QUEUE.md:93-98`. Row: `ODQ:8879-8926`.

### (a) Promoting the §220 performance gate to launch-blocking for the map surface

**EVIDENCE.** `ODQ:8906-8908` — *"the §220 performance gate is promoted to LAUNCH-BLOCKING
for the map surface — a wow moment that takes twenty seconds to render is not a wow
moment"*. Corroborated as an independent finding by the FMG lane:
`PRIOR-ART-FMG.md:1141` lists shipped interactive performance among the three items *"that
would cost us most if left unaddressed"*, and `ODQ:9305-9310` (§253.5) records it as
already launch-blocking under §247.3a. Downstream, `ODQ` §269 records the 2.05× metropolis
result as **not** clearing the gate on its own.

**STATUS: CONFIRMED** that the promotion is recorded, cross-referenced and treated as live
by later rows. The *engineering* premise (a slow map kills the acquisition mechanic) is
**PLAUSIBLE** — it is an argument, never measured against users.

**DOUBTS.** None on the mechanics. The gate is asserted as launch-blocking in three places
but no row states the numeric threshold that discharges it; "launch-blocking" without a
published number is a status, not a gate.

### (b) The free path must produce a good map with minimum friction

**EVIDENCE.** `ODQ:8909-8912` — *"gating the map behind signup would destroy the
acquisition mechanic the strategy depends on (owner-gated as a paid-surface decision;
raised, not settled)"*.

**STATUS: CONFIRMED** as correctly classified. The chair identified this as a paid-surface
class and did **not** decide it. That is the doctrine working.

**DOUBTS.** None. It remains open; the chair should check it has not since been assumed
settled by any wave that plans free-path behaviour.

### (c) "The same town across time" as the differentiator to lead with

**EVIDENCE.** `ODQ:8913-8918` — *"the artifact no competitor can produce is THE SAME TOWN
ACROSS TIME (year 1 → year 100 …) … RECOMMENDED AS A DELIBERATE MARKETING ARTIFACT and
slotted for wave nine's demo output."* Slotting verified in the spec:
`GENERATION-SPEC.md:298` puts it in **W8 · the closing loop** (W0–W8 = nine waves;
the "wave nine" phrasing is consistent, not an off-by-one).

⛔ **CONTRADICTING EVIDENCE THE CHAIR MUST SEE, AND IT NEVER REACHED THE LEDGER.** The FTG
lane raised a direct caution against the *exclusivity* half of this claim —
`laneMFX3-receipt.md:155-157`: *"FTG also sells 'the same town across time' — **but its
axis is hours and days, not decades.** If we lead with 'across time' without saying 'across
generations', the claim will be heard as theirs. Owner holds marketing doctrine; raised
only."* I grepped for it in both the ledger and the spec: `grep -inE "hours and days|hours,
not decades|across generations"` over `docs/OWNER_DECISION_QUEUE.md` returns **no §247- or
§263-related hit**, and over `map-corpus/docs/GENERATION-SPEC.md` returns **zero hits**.

**STATUS of the "no competitor can produce it" claim: DOWNGRADED TO CONTESTED.** The
artifact is not uncontested; a competitor sells an adjacent claim on a different time axis,
and the chair's row still reads *"the artifact no competitor can produce"* unqualified.

**DOUBTS.** This is the sharpest §247 problem. A marketing claim the owner is being told to
lead with carries a known collision that the lane found, flagged as owner-facing, and the
collecting row dropped. Two further §263 escalations were dropped with it — see §263 below.

### (d) The honest caveat

**EVIDENCE.** `ODQ:8919-8926`; the aesthetic-polish gap is anchored to §244's measured
deltas. **STATUS: CONFIRMED** as recorded. No doubt.

---

# §248 — THE FMG STUDY BRIEF AND ITS IP DISCIPLINE

Queue entry: `RETROVALIDATION_QUEUE.md:100-104`. Row: `ODQ:8928-8992` (incl. §248.4).

### (a) Is the clean-room discipline as written sufficient given the license the lane reports?

**EVIDENCE — the license, quoted from the receipt's own citations.**

1. **Top-level grant.** `PRIOR-ART-FMG.md:36-39` — *"`repo/LICENSE` is byte-identical to the
   separately fetched `xref-fmg/LICENSE.fetched` (both 1353 bytes). It is a standard MIT
   License, `Copyright 2017-2024 Max Haniyeu (Azgaar)`, with one **non-standard added
   paragraph**"*. The added paragraph is quoted at `:41-43` and correctly characterised at
   `:45` as *"a grant, not a restriction — it broadens rather than narrows"*.
   Independent second source cited at `:47-48` (`package.json` declares MIT).
   **Grade: CONFIRMED** — two independent artifacts, byte-comparison executed.

2. **The GPL carve-out.** `PRIOR-ART-FMG.md:63-67` — *"⛔ `public/libs/tinymce/` is
   GPLv2-or-later. `public/libs/tinymce/license.md` reads: 'Copyright (c) 2024, Ephox
   Corporation DBA Tiny Technologies, Inc. Licensed under the terms of GNU General Public
   License Version 2 or later'"*, with the version pinned at `:68-70` (*"TinyMCE 7.1.0
   (2024-05-08) … TinyMCE relicensed from LGPL to GPLv2+ at version 7, and this tree
   carries the post-relicense build"*). Enumeration method stated at `:59-61`
   (*"exactly two license files in the whole checkout (`find . -iname "*licen*"`, excluding
   `.git`)"*). **Grade: CONFIRMED** — an executed enumeration plus a quoted license file.

3. **The provenance trap.** `PRIOR-ART-FMG.md:661-669` — *"The Urquhart implementation
   carries its own provenance comment: `// code from
   https://observablehq.com/@mbostock/urquhart-graph` — `src/generators/routes-generator.ts:245`.
   **That code is not Azgaar's to license.** It is third-party code carried inside an
   MIT-licensed repository, and its actual terms are Mike Bostock's Observable notebook
   terms, not FMG's LICENSE."* The banked law is at `:670-673`.
   **Grade: CONFIRMED** — a quoted comment at a cited line, from the clone the lane read.

4. **Vendored variance beyond tinymce.** `PRIOR-ART-FMG.md:75-92` tables 20 further
   vendored libraries with their own headers, including two dual MIT-or-GPL
   (`jszip.min.js` MIT-or-GPLv3 at `:83`; `jquery.ui.touch-punch.min.js` MIT-or-GPLv2 at
   `:85`) and *"headers stripped in the minified build"* for four more (`:90-91`).
   Note `:92` flags `openwidget.min.js` as *"proprietary hosted widget — ships a hardcoded
   `organizationId`"*. **Grade: CONFIRMED**; the receipt also records a self-correction
   (`laneMFX1-receipt.md:48-49`: vendored count *"21→20"* re-verified before sealing).

**STATUS of the discipline's sufficiency: CONFIRMED SUFFICIENT AS APPLIED TO THE STUDY —
AND FALSIFIED AS APPLIED TO THE PRODUCT.** See the boxed finding below; it is the single
most consequential thing in this memo.

⛔⛔ **THE DISCIPLINE WAS NEVER TURNED ON OUR OWN TREE, AND OUR OWN TREE ALREADY CONTAINS
THE EXACT ARTIFACT §253.2 WARNED ABOUT.**

Executed evidence, all from this working tree:

| probe | result |
|---|---|
| `ls -d public/map` | exists — a vendored FMG at **25 MB** |
| `cat public/map/LICENSE-FMG.txt` | the FMG MIT text, *"Copyright 2017-2024 Max Haniyeu (Azgaar)"*, **including the same non-standard widening paragraph** the study identified |
| `git ls-tree -r --name-only HEAD -- public/map \| wc -l` | **636 files tracked in HEAD** |
| `ls public/map/libs/tinymce/license.md` | present — *"Licensed under the terms of [GNU General Public License Version 2 or later]"*, © 2024 Ephox/Tiny |
| `git ls-tree -r --name-only HEAD -- public/map/libs/tinymce \| wc -l` | **123 files tracked in HEAD**, 4.4 MB |
| `find dist/map/libs/tinymce -type f \| wc -l` | **123** — it reaches the build output (`vercel.json:3` `"outputDirectory": "dist"`) |
| `vercel.json:23` | a dedicated `"source": "/map/(.*)"` header block — `public/map` is a **served production surface**, with its own CSP |
| `git log --diff-filter=A -- public/map/LICENSE-FMG.txt` | added by `f386f48d "Add FMG map overlay, supply chain builder, and road network"` — **predates the map program** |

**Why this matters and why it is in scope for this cluster.** §253.2 banked the law
*"A PERMISSIVE TOP-LEVEL LICENSE DOES NOT LAUNDER THE PROVENANCE OF CODE THE PROJECT ITSELF
COPIED IN"* (`ODQ:9280-9282`), and §254.6 (`ODQ:9411-9421`) reasoned that
*"SettlementForge ships JavaScript to the user's browser, which IS conveying … There is no
SaaS exemption available to us."* Those two rulings, applied to our own repo, land on
`public/map/libs/tinymce/`. The study lanes examined a scratch clone and no row anywhere
asks whether our own vendored copy carries the same directory. It does.

**Mitigating facts I verified, so the chair does not over-read this.** The local copy is
**not referenced by our own code**: `public/map/modules/ui/notes-editor.js:67-68` loads
TinyMCE from `https://azgaar.github.io/Fantasy-Map-Generator/libs/tinymce/tinymce.min.js`,
i.e. the upstream CDN, not our path. So the 123 files appear to be **unreferenced vendored
weight** — but they are tracked in HEAD and copied into `dist/`, so they are distributed
from our origin regardless of whether our own pages load them.

**This is a finding, not a ruling.** Whether it is a real exposure, a stale-vendoring
cleanup, or already known to the owner is the chair's call and possibly counsel's
(§254.5.5 already parks the legal posture as owner-gated). I record only that the
program banked the law and never ran the check on itself.

### (b) Was source study of a competitor worth doing at this stage?

**EVIDENCE.** The yield is measurable against the brief's own predictions.
`laneMFX1-receipt.md:86-95` grades delivery row by row against `ODQ:8953-8966`, and
`ODQ:10028-10030` (§265.1) claims the studies were *"vindicated three times over — the
blind predicate, the mush inversion, the missing circuit demotion would each have been
BUILT WRONG"*.

**STATUS: CONFIRMED that the brief's stated yield was delivered.** The "would have been
built wrong" claim is **PLAUSIBLE** — it is a counterfactual and is not evidenced anywhere.

**DOUBTS.** One of the three vindications (the mush inversion) was materially downgraded
four rows later by §261.3 and is now a blocked, half-unrunnable test (see §259/§266). The
chair should note that §265's self-congratulation cites as vindication a finding that the
owner had already partly retracted.

### (c) The expected-yield ranking (world→settlement derivation first)

**EVIDENCE.** `ODQ:8953-8958` ranks world→settlement derivation first; the lane delivered
it as §1 with the root traced (`laneMFX1-receipt.md:24-26`: *"Root traced: `rankCells()` in
`public/main.js:1088` → `cells.s` → everything"*) and `PRIOR-ART-FMG.md:116-118` confirms
*"FMG derives a settlement's every property from a single scalar suitability field over
Voronoi cells."*

**STATUS: CONFIRMED** the ranking was correct ex post — that section carried the
delegation-contract parameter table (`PRIOR-ART-FMG.md:529-539`), which the study calls
*"the most directly reusable artifact in the codebase, because it is a **specification**,
not an implementation"* (`:526-527`).

**DOUBTS.** One declared method deviation: `laneMFX1-receipt.md:102-105` — the lane did not
fetch the issue tracker (charter priority 5), reading the no-refetch discipline as binding.
Declared, not hidden; §253.6 accepts it *"with cause"*. I agree it is correctly disclosed.

---

# §253 — THE FMG STUDY COLLECTED

Queue entry: `RETROVALIDATION_QUEUE.md:144-150`. Row: `ODQ:9259-9322`.

### (a) "Nobody ships the join" — what breadth of evidence supports it?

The queue itself asks the right question (`:145-147`: *"drawn from exhaustion over one repo
and deserves an independent sanity check"*). Here is exactly what the breadth is.

**EVIDENCE — the FMG half (strong).** `PRIOR-ART-FMG.md:491-500`:
*"**Evidence (CONFIRMED, by exhaustion).** A grep across all 248 files of `src/` for
`building`, `street`, `townplan`, `cityplan`, `blockShape` and neighbouring vocabulary
returns exactly three hits, all of them false positives … `src/renderers/` contains 28
renderers … and not one of them draws a street, a block, a plot or a building."*
Plus the positive account of what they do instead (`:505-510`, the URL delegation into
Watabou's generators at `burgs-generator.ts:548-709`).
**Grade: CONFIRMED, and the exhaustion is real** — it is a negative proven by enumeration
over a named, counted file set, with the delegation contract found as the positive
explanation. This is the strongest single piece of evidence in the whole cluster.

**EVIDENCE — the Watabou half (weaker at the time, corroborated later).** At §253 time the
claim *"the leading PLAN generator has plans and no world"* (`ODQ:9268-9270`) rested on
inference from FMG's delegation, not on any examination of Watabou. It was corroborated six
rows later by the independent MF-X2 study: `PRIOR-ART-WATABOU.md:175` — *"there is no
terrain stage at all"* — and `:200` — *"they have no epoch axis whatsoever"* — and `:204`
describes it as *"a one-shot generator with no world"*.
**Grade at §253 time: PLAUSIBLE (single-source inference). Grade today: PLAUSIBLE,
independently corroborated** — but note §259's own limit applies (below): the Watabou
corroboration is a static read of 2017 source, never executed.

**EVIDENCE — the "nobody" quantifier (weakest).** The universe examined is **two products**
(FMG, Watabou) plus, later, **one more** (FTG). No systematic market survey exists anywhere
in the receipts. The word "nobody" is doing work that "neither of the two leaders" would do
honestly.

**STATUS: the FMG half is CONFIRMED; the join claim as a market statement is PLAUSIBLE and
over-quantified.**

**DOUBTS.** The strategic weight §253.1 places on it — *"upgrades §247 from PLAUSIBLE to
STRUCTURAL"* (`ODQ:9262-9263`) — is a grade promotion that the evidence supports for the
*two named leaders* and does not support for the market. The chair should consider amending
the wording rather than the ranking; the underlying gap looks real.

### (b) Adopt-zero-code as the standing verdict

**EVIDENCE.** `PRIOR-ART-FMG.md:1161-1165` — *"⭐ NET RECOMMENDATION: ADOPT ZERO CODE. Every
genuinely bounded utility here is small enough that clean-room implementation costs less
than the attribution bookkeeping, and the one utility that would have been worth copying is
the one we may not copy."* The candidate table is at `:655-659` (three candidates, each
priced); the reasoning survives the trap at `:675-680`. Lane's own vetoable framing at
`laneMFX1-receipt.md:98-101`.

**STATUS: CONFIRMED.** The verdict is evidenced, priced, and reached the same place as
§248.4's engineering default by an independent route.

**DOUBTS.** None on the study. The verdict is about *future* adoption and says nothing
about the FMG code **already vendored in `public/map/`** — see the §248(a) box. The chair
may want to record explicitly that "adopt zero code" was a forward-looking rule and did not
audit the existing tree, so a successor does not read it as a clean bill of health.

### (c) The three architectural adoptions, especially the road reuse-discount

**EVIDENCE.** `ODQ:9284-9297` names all three. The reuse discount is described in the
deliverable's §2.3 and the row claims it *"CONVERGES WITH §250's GAP-C correction (width
quantises a derived graph load)"* (`ODQ:9295-9297`). The dither adoption is ranked #1 by the
lane over the more obviously useful street recipe, with the rationale stated and marked
vetoable (`laneMFX1-receipt.md:109-111`).

**STATUS: PLAUSIBLE.** These are static readings of unexecuted source. The convergence
claim with §250 is an argument made by the chair, not a measurement.

**DOUBTS.** Adoption (b) — per-stage stream derivation — carries *"AUDIT ORDERED against
our own pipeline"* (`ODQ:9291-9292`). I found no receipt for that audit. It should be
checked as an open order, not assumed discharged.

### (d) The gitignore correction's scope (docs tracked, binaries not)

**EVIDENCE — the claim.** `ODQ:9311-9318` — *"my §243 `map-corpus/.gitignore` was a single
`*`, which meant the graded urbanism atlas, both morphology compendiums, the measured
register and this study were LOCAL-ONLY AND UNBACKED. **CORRECTED: the ignore now covers
only `plates/` and `previews/` (8.5 GB of binaries); the 1.6 MB of `docs/` is TRACKED AND
COMMITTED**"*.

**EVIDENCE — verified.** `cat map-corpus/.gitignore` returns exactly `plates/`,
`previews/`, `*.png`, `*.jpg`. `git ls-tree -r --name-only HEAD -- map-corpus/docs | wc -l`
returns **50**. The fix landed and holds.

**STATUS: CONFIRMED — and the guarantee has since decayed.** On-disk count is **56**.
The six not in HEAD are:

```
ARCHITECTURAL-MASSING-EVIDENCE-WAVE1.md
HISTORICAL-EVIDENCE-EXPANSION-PROTOCOL.md
HISTORICAL-URBANISM-EVIDENCE.md
RURAL-SETTLEMENT-LANDSCAPE-EVIDENCE-WAVE1.md
corpus_integrity.py
historical_evidence_integrity.py
```

`git check-ignore -v` on each of the four `.md` files returns **NOT-IGNORED** — so this is
not a gitignore regression; they were simply never committed. `git log --all -- <path>`
returns **zero commits** for each. `HISTORICAL-URBANISM-EVIDENCE.md:4` self-describes as
*"Survey date: 2026-08-20"* and cites a *"Binding expansion protocol"*, i.e. these are
governance-bearing knowledge documents, exactly the class §253.6 existed to protect.

**DOUBTS.** The §253.6 cure was a one-time correction, not a mechanism. Four days later the
same failure mode is back with new documents. This is a candidate for structural prevention
rather than a second manual fix — but that is the chair's call, not mine.

---

# §254 — THE WATABOU STUDY BRIEF

Queue entry: `RETROVALIDATION_QUEUE.md:152-158`. Row: `ODQ:9324-9425` (incl. §254.5, §254.6).

### (a) The license discipline's severity tiers and the no-licence default reading

**EVIDENCE — the tiers as written, before the license was known.** `ODQ:9335-9349`:
*"**NO LICENSE FILE ⇒ default copyright: public visibility is not a licence** — read for
understanding only … **PERMISSIVE ⇒** adoption available with attribution but §248.4's
clean-room default holds for anything architectural. **COPYLEFT ⇒ adoption REFUSED
outright** for a commercial product and the study becomes read-only, said loudly at the top
of the deliverable."*

**EVIDENCE — the tier firing, and what the lane actually established.**
`laneMFX2-receipt.md:13-21` is a six-row probe table; the deliverable's own §0 repeats it at
`PRIOR-ART-WATABOU.md:16-26`: SPDX `GPL-3.0` from the GitHub licence API; licence file
present, ~35 KB, standard text; *"**Exceptions / linking exception**: **NONE.** The
appendix is unmodified and closes by recommending the LGPL to anyone wanting proprietary
linking — the author declined that option"*; *"Per-file headers: **NONE.** Zero of the 60
files carry any copyright or licence header"*; holder *"watabou / 'Retronic Games'"*.
Conclusion at `:27-28`: *"The root licence therefore governs the entire source tree
unqualified."*

**STATUS: CONFIRMED.** Each tier row is backed by a named probe. The pre-commitment is the
strongest structural feature here — `ODQ:9376-9378`: *"The refusal was PRE-COMMITTED in
§254.2's tiered discipline before the license was known, which is why it costs nothing to
apply now."* That is a real anti-motivated-reasoning device and I can verify the ordering:
the brief (§254, `ODQ:9324`) precedes the confirmation (§254.5, `ODQ:9368`) in the ledger.

**On the no-licence default reading specifically:** "public visibility is not a licence" is
the correct conservative reading of default copyright and it never had to fire (a licence
was found). **PLAUSIBLE as legal reasoning, correctly self-limited** — `ODQ:9402-9406`
states *"this is engineering hygiene, not legal advice"* and parks counsel confirmation as
owner-gated. §254.6 (`ODQ:9411-9425`) closes the GPL-vs-AGPL trap explicitly and is, in my
reading, the most careful piece of reasoning in this cluster.

**DOUBTS.** None on the tiers. One observation on hygiene consistency: §254.5.4 ordered the
clone deleted and the lane verified it (`laneMFX2-receipt.md:48-49`, and I confirmed no
`xref-ftg*`/`xref-watabou*` residue survives in the old scratchpad). But the **FMG clone is
still on disk** — `du -sh …/scratchpad/xref-fmg` returns **78 MB**, with
`xref-fmg/repo/public/libs/tinymce/license.md` (the GPLv2+ directory) present. §248 never
ordered deletion, so this is not a breach; it is an inconsistency between two studies'
hygiene, and the retained tree contains both a copyleft component and the
phone-home widget the study itself flagged (`PRIOR-ART-FMG.md:101-104`).

### (b) The guard against style capture — mechanism taken, derivation homes kept

**EVIDENCE — the ODQ statement.** `ODQ:9361-9366`: *"**THE STANDING GUARD AGAINST STYLE
CAPTURE**: their model has no world, no history, no dossier truth and no time. We take
MECHANISM and keep our DERIVATION HOMES — a mechanism adopted without one is decoration
(§246). The differentiator is not that our maps look like theirs; it is that ours are TRUE
and theirs cannot be."*

**EVIDENCE — the guard operationalised in the deliverable, which is stronger than the ODQ
summary.** `PRIOR-ART-WATABOU.md:122-134`:
*"## Their rendered output is NOT our aesthetic target … Our corpus is an image model's
**painterly imitation** of this style, and **it measures richer than the original on the
very axes we grade** … Watabou's renderer is flat vector fill over a small fixed palette,
with uniform stroke weights and no paper texture at all … **Chasing their look would land
us a rung BELOW the corpus.** Wherever this document describes how they *draw* something,
that is a **NOTE about mechanism**, never a recommendation about appearance. Such passages
are marked **[RENDER NOTE]**."*
The marking is real, not asserted: `[RENDER NOTE]` occurs inline at `:550` and `:926`.

**EVIDENCE — the guard changing verdicts rather than decorating them.**
`laneMFX2-receipt.md:67-74` records two downgrades made against the lane's own first pass:
the citadel's *selection rule* moved to DELIBERATELY-DIFFERENT (*"I had rated the whole
mechanism ADOPT in the first pass because the outcome looks right, which is precisely the
error §256 exists to catch"*), and their authored ward list refused with the note *"I
deliberately did not record its contents."*

**STATUS: CONFIRMED.** The guard is implemented, marked in the text, and demonstrably
reversed two of the lane's own verdicts.

**DOUBTS — one, and it is now a live inconsistency.** The guard's *justifying sentence*
("our corpus is an image model's painterly imitation **of this style**") is the framing
§261 retracted. The guard's *conclusion* survives §261 untouched and arguably gets
stronger — if the corpus is independent, chasing Watabou's look is even less defensible.
But the deliverable still argues it from the retracted premise. See §259/§261 below.

### (c) The convergence/divergence findings, especially where our reverse-engineering was wrong

Handled under §259 (the collection row) — the substance is identical and the §261 overlay
applies to both.

---

# §258 — THE INTENT-OVER-EXECUTION DOCTRINE

Queue entry: `RETROVALIDATION_QUEUE.md:177-182`. Row: `ODQ:9604-9657`.

### (a) The doctrine and its recorded-signature safeguard — exact wording

**EVIDENCE — the safeguard, verbatim.** `ODQ:9615-9625`:

> ⭐⭐ **THE DOCTRINE, BINDING ON EVERY LANE: read a law for its INTENT and its MEASURABLE
> SIGNATURE; a mechanism that achieves that intent better than the stated execution
> SUPERSEDES the stated execution.** The safeguard is the record, not a veto in advance:
> **every substitution is written as "law X's intent PRESERVED, execution changed from A to
> B, measurable signature Y unchanged (or improved),"** so the owner adjudicates outcomes at
> the end rather than approving mechanisms in advance. A substitution that cannot name the
> preserved signature is not a substitution — it is a quiet repeal, and it is forbidden.

**EVIDENCE — the second guard.** `ODQ:9651-9657`: *"a substitution must still satisfy §256's
precedence … and §246's derivation-home test. Intent-over-execution licenses better
machinery — never a free parameter, never a borrowed aesthetic, and never the loss of a
law's measurable signature."*

**EVIDENCE — the safeguard has a home and has already bitten.** It is not aspirational:
- `GENERATION-SPEC.md:250` records the doctrine with its destination —
  *"new **§3.6** (the substitution register)"*.
- `GENERATION-SPEC.md:3153` is the register itself: *"§3.6 · ⭐⭐ THE SUBSTITUTION REGISTER —
  EVERY PLACE A MECHANISM SUPERSEDES A LAW'S STATED EXECUTION (§258.2)"*.
- ⭐ **It has already blocked a substitution.** `GENERATION-SPEC.md:3172` (row SUB-3):
  *"⛔ **NO SIGNATURE EXISTS YET — G-40's tower-spacing instrument** (spacing CV along the
  circuit; towers per unit length) | ⚠⚠ **PROVISIONAL AND HELD.** §258.2's own rule forbids
  a substitution that cannot name its signature, so **this one is recorded as PENDING and
  may not land before W0 builds the instrument**"*.

**STATUS: CONFIRMED.** The safeguard is written, has a register, and has demonstrably
refused a substitution the chair wanted (the tower re-read — the study's own
highest-cost correction). That is the strongest evidence available that the guard is real.

**DOUBTS — the drift risk the chair is asked to weigh, stated precisely.** The safeguard is
**self-certified and after-the-fact**. It requires a lane to *name* a preserved signature;
nothing verifies that the named signature is (i) the law's actual load-bearing property, or
(ii) actually unchanged. The two guards that would close this — §256's precedence and
§246's derivation-home test — are also lane-applied. The SUB-3 hold shows the guard biting
in the one case where **no metric existed at all**, which is the easy case: absence is
detectable. The hard case — a signature that exists, is named, and is the *wrong* signature —
has no detector anywhere in the machinery I can find. The owner's adjudication is
end-loaded by design (`ODQ:9613-9614`: *"leaves ultimate execution decisions to the chair,
adjudicating at the end"*), so drift accumulates for the whole program before it is visible.
I flag this as the structural weakness; whether it is acceptable is the chair's ruling.

### (b) The three worked cases, particularly the setback synthesis

**EVIDENCE.** `ODQ:9628-9637` (wide main streets): the substitution is written in exactly
the mandated form — intent *"importance must be legible"*, signature *"the corpus's p97/p50
width ratio 16-30, widest channel 2.7-6.4 plot-widths"* PRESERVED, execution moved *"from
'stroke a wider line' to 'set buildings further back'"*, plus a claimed free consequence
(§239's wall-side street falls out). Corroborated by the study: `PRIOR-ART-WATABOU.md:906`
(C2) — *"Cell edges facing the wall receive the largest building setback, so a lane appears
automatically"* — and D5 at `:926`, *"hierarchy is setback, not stroke width"*.
`GENERATION-SPEC.md:1187` confirms it was entered in the register.

**STATUS: CONFIRMED that the case is correctly formed** (it is the only one of the three
that names a numeric signature). The *mechanism* claim is **PLAUSIBLE** — see §259(c);
it is an unexecuted static read of 2017 source.

**DOUBTS.** Cases (b) and (c) — districts and alleys — name no numeric signature.
`ODQ:9638-9644` (districts) is a *refusal* to substitute, so the safeguard does not apply;
`ODQ:9644-9650` (alleys) says *"the mechanism and the register compose"*, which is neither a
substitution nor a rejection. Only case (a) actually exercises the doctrine. The row's claim
of *"THREE CASES THE DOCTRINE RESOLVES IMMEDIATELY"* (`ODQ:9626`) is one substitution, one
refusal, and one composition.

### (c) Our district-organism model stands against weaker prior art

**EVIDENCE.** `ODQ:9638-9644`; the underlying finding is `PRIOR-ART-WATABOU.md:923` (D2):
*"**Placement is overwhelmingly positional.** Nine of thirteen ward types have *no placement
rule at all* and are placed at random. Only two are genuinely relational, and one of those
is half-dead"*. Corroborated in the receipt at `laneMFX2-receipt.md:110-114`, with the
half-dead defect explained (*"the first patriciate ward can never see a park, because the
park is placed later in the order"*).

**STATUS: PLAUSIBLE.** Static read, never executed; the half-dead defect is explicitly
reported as *"PLAUSIBLE static readings, each with the experiment that would settle it"*
(`laneMFX2-receipt.md:134-136`).

**DOUBTS.** "Prior art is weaker, therefore our model stands" is a comparative argument that
§261.4 later forbids in its general form (*"PRIOR ART IS NEVER EVIDENCE ABOUT THE CORPUS"*,
`ODQ:9825-9827`). Here it is used defensively (to *decline* a change), which is the benign
direction — but the chair should note that the positive claim *"is a differentiator, not a
gap"* (`ODQ:9642-9643`) is asserted against no corpus measurement at all.

---

# §259 — THE WATABOU STUDY COLLECTED (with the §261 overlay)

Queue entry: `RETROVALIDATION_QUEUE.md:184-191`, **partially superseded by**
`:193-202` (§261). Row: `ODQ:9659-9737`; retraction `ODQ:9774-9836`.

⚠ **THE OVERLAY, STATED FIRST BECAUSE IT CHANGES EVERY ITEM BELOW.** §261.2(b)
(`ODQ:9793-9801`): *"⭐ **§259.4's SCORING IS RE-READ: 'twelve of our inferences refuted,
nine of them our own reverse-engineering errors' IS WRONG AS ATTRIBUTED.** A disagreement
between Watabou's mechanism and something we MEASURED IN THE PLATES is not our error — it is
two independent sources differing, which is expected … The twelve divergences stand as
FACTS; their ATTRIBUTION is withdrawn pending re-reading against the corpus itself."*

### (a) The chaos-at-large-scale finding and its treatment as the mush diagnosis

**EVIDENCE — what the study actually recorded.** `PRIOR-ART-WATABOU.md:924` (D3):
*"| **D3** | **Organic irregularity comes from perturbing buildings** — irregularity applied
at the small scale | **Exactly inverted.** Chaos is applied at the *large* scale (block
cuts) and orthogonality is *restored* at the small scale near building size (§5.2) | **A** |
**This is why our output reads as mush rather than as a town.** … **Highest-value single
correction for our #1 aesthetic gap** |"*
The lane's own summary is slightly more hedged: `laneMFX2-receipt.md:96-98` — *"**This is
likely why our output reads as mush.** Ranked #2 and tagged D3."*

**EVIDENCE — the study's own evidence grade for it.** `PRIOR-ART-WATABOU.md:108-111`:
*"**Epistemic status of all source-derived findings: PLAUSIBLE, not CONFIRMED.** Execution
was forbidden, so no finding here is backed by observed program output. These are static
readings of a small, clearly written program, and my confidence is high — but the doctrine's
CONFIRMED label requires executed evidence and I do not have it."* D3 is a source-derived
finding (`:102-106` lists *"the recursive subdivision parameters and their qualitative
ranges"* under "rests on reading the source"), so **D3 is explicitly PLAUSIBLE**.

**EVIDENCE — how the ledger graded it.** `ODQ:9673-9679`: *"⭐⭐ **THE MUSH IS DIAGNOSED, AND
WE HAD IT EXACTLY BACKWARDS** … **this is very likely why our output reads as mush**"*.

**STATUS: the mechanism finding is PLAUSIBLE (self-graded); the header's word "DIAGNOSED"
is an OVERSTATEMENT of the study's own grade.** The lane wrote "likely"; the collecting row
wrote "DIAGNOSED" in a ⭐⭐ header, and the retrovalidation queue then wrote *"the decision
to treat it as the mush diagnosis — it will drive a large rework"* (`:185-186`). The grade
degraded across three hops in the same direction.

**EVIDENCE — the correction, and it is the right one.** `ODQ:9813-9817` (§261.3): the
principle *"is a HYPOTHESIS ABOUT OUR MUSH, not a description of our target — **it must be
tested against the corpus's own measured block elongation and plot variance before it drives
a rework**"*. This is now machinery, not prose: `GENERATION-SPEC.md:3307` (gap G-39) records
*"⛔ **§261.3 DOWNGRADED IT FROM A DESCRIPTION OF OUR TARGET TO A HYPOTHESIS ABOUT OUR
DEFECT** … ⛔⛔ **BLOCKS any S7 / S10 / S11 rework justified on this basis.**"*

**STATUS of the correction: CONFIRMED and correctly implemented.**

**DOUBTS.** The test is **half-unrunnable**: `GENERATION-SPEC.md:3470ff` (§4.1c) states
*"**ARM 2 — THE SMALL SCALE. ⛔ NOT RUNNABLE TODAY** … There is **no footprint-rectangularity
measure of any kind**"*, and — the sharp part — *"**Arm 1 is close to confirmed on our own
published figures. It is arm 2 that decides the hypothesis.**"* So the entire decision rests
on the arm that cannot run, pending an instrument (G-40(iii)) that is itself flagged as the
lane's own vetoable addition. Until W0 builds it, the highest-profile finding of the whole
prior-art programme drives nothing — which is exactly what §261 intended, and the chair
should confirm the wave plan is honest about that.

### (b) The re-reading of banned prior #7 (place by structure, never by spacing)

**EVIDENCE — the finding.** `PRIOR-ART-WATABOU.md:922` (D1): *"**There is no spacing rule.**
Towers are placed at *every non-gate wall corner*, opportunistically. Evenness is an emergent
consequence of uniform cell area (§6.3). Confirmed for the *current* product by the author's
own prose"*. The prose-versus-code split is explicit at `:94-100`, which names the tower
finding *"the single most valuable prose confirmation in the study, because it holds for the
*current* product"*.

**EVIDENCE — the ruling.** `ODQ:9690-9694`: *"RULED: banned prior #7 is re-read as **NEVER
PLACE BY SPACING — place by STRUCTURE (the corners that exist) and let the spacing be
whatever the structure gives.** Evenness that emerges is authentic; evenness that is dialled
is the tell."*

**EVIDENCE — the ungateable admission, reported rather than smoothed.** `ODQ:9712-9717`:
*"**one of our own claims was exposed as UNGATEABLE** — there is no tower-spacing metric
anywhere in our plan-metric set, so our highest-cost correction rests on visual analysis
rather than measurement."* Lane source: `laneMFX2-receipt.md:75-78`.

**STATUS: the mechanism is PLAUSIBLE-plus** — it is the one finding with a second,
version-current evidence source (the author's public prose), which materially beats the rest
of the study's 2017-only basis. The ruling's *consequence* is correctly held: SUB-3 is
PENDING and blocked (`GENERATION-SPEC.md:3172`).

**DOUBTS.** This item survives §261 better than any other, because it is a mechanism
explanation rather than a claim about the corpus — §261.3 says so explicitly
(`ODQ:9820-9824`: the T-dominance and tower findings *"survive as MECHANISM EXPLANATIONS of
numbers WE measured in the corpus — those two were corpus-measured first and are the
strongest surviving links"*). ⚠ But note the tower claim is **not** in that protected class
on the same footing as T-dominance: §259.5 says there is **no tower metric at all**, so
"corpus-measured first" cannot be true of tower spacing. §261.3 names it in the surviving
pair anyway. **That is a small internal contradiction between §259.5 and §261.3 and the
chair should resolve it** — it decides whether the tower re-read is a strong surviving link
or an ungated one.

### (c) Accepting twelve refutations on PLAUSIBLE, unexecuted, 2017-source evidence

This is the item the brief asked me to assess sharply. Here is the arithmetic and the grade.

**EVIDENCE — the count checks out.** `PRIOR-ART-WATABOU.md:901-914` is the convergence table
C1–C10 (**10 rows**). `:916-933` is the divergence table, rows **D1–D12** (12 rows;
D12 is inserted out of order at `:927`, between D5 and D6, which is why a naive read can
miscount). Tags: **A** on D1, D2, D3, D4, D5, D6, D8, D9, D11 = **nine**; **B** on D7;
**A/B** on D10; **"C-adjacent"** on D12. §259.4's *"ten … CONFIRMED, TWELVE REFUTED — nine of
those our own reverse-engineering errors"* (`ODQ:9695-9696`) is **arithmetically exact**
against the table.

**EVIDENCE — the study's own three-way limit, stated before the table.**
`PRIOR-ART-WATABOU.md:75-82` defines the tags and warns *"(C) The imitator invented it …
**This is the most dangerous case for us, because it means effort has gone into matching a
target that never existed.**"* And `:937-940`: *"Every row tagged **A** above assumes the
mechanism did not change in the intervening years; every row that might be **C** — an
imitator artefact — is invisible to this method."* The ledger carried this honestly forward
at `ODQ:9718-9723`.

**EVIDENCE — §261 pulls the floor out from under the tagging scheme entirely.**
`ODQ:9781-9790`: *"**THE OWNER CORRECTS: the 313 plates come from an IMAGE GENERATOR
(nano-banana-pro), not from Watabou, FTG, or any procedural generator** … **THE CORPUS IS AN
INDEPENDENT AESTHETIC ARTIFACT AND IT IS THE TARGET IN ITS OWN RIGHT.**"* The A/B/C scheme
presupposes a lineage that does not exist.

**STATUS: the twelve divergences are PLAUSIBLE FACTS ABOUT WATABOU'S 2017 SOURCE. Their
characterisation as "refutations of our inferences" is WITHDRAWN and, in my reading, was
never supportable — not merely mis-attributed.** The evidence grade the chair is asked
about is therefore **doubly weak**: unexecuted static reading (the lane's own admission)
*of a source that was never the corpus's ancestor* (the owner's correction).

**⛔ AND THE REMEDIATION §261 ORDERED WAS NOT PERFORMED.** `ODQ:9834-9836` closes:
*"Relayed to MF-X3 same-turn; **MF-X2's deliverable is annotated by this row rather than
rewritten.**"* I checked:

- `grep -n "261" map-corpus/docs/PRIOR-ART-WATABOU.md` → **zero hits**.
- `grep -inE "retract|owner correction|withdrawn|independent artifact|nano-banana"` over the
  same file → **zero hits**.
- `grep -ci "imitat" …/PRIOR-ART-WATABOU.md` → **15** occurrences of the retracted framing,
  still live, including the §0d style-capture guard at `:125` and the D12 tag at `:927`
  (*"the painterly richness is the **imitator's** contribution"*).
- By contrast the FTG deliverable **did** apply it: `PRIOR-ART-FTG.md:105` —
  *"## 1.2b ⛔ THE §261 PREMISE CORRECTION — AND IT VOIDS A RULE THIS DOCUMENT WOULD
  OTHERWISE HAVE INHERITED"* — with six further §261 citations at `:126, :357, :883, :987,
  :1044, :1123`.

So the correction propagated forward to the lane still running and never landed on the
document it was correcting. `PRIOR-ART-WATABOU.md` is tracked in HEAD and is the document a
successor will read; it currently teaches the retracted lineage as fact, with a
§10.2 header that reads *"DIVERGENCE — where our reverse-engineering was WRONG"* (`:916`).

**DOUBTS.** This is the highest-value concrete action item in the cluster. The chair asked
*"how much should the plan change on evidence of that grade?"* — my answer as verifier is
that the question is now moot for attribution (§261 settled it) and live for **document
hygiene**: the annotation the chair promised is absent, and the queue's own §261 entry
(`:196-197`) asks Fable to re-derive *"whether §259's twelve divergences carry any weight at
all"* — which cannot be done fairly from a document that still argues the retracted premise.

### (d) The conditions on the live-export follow-up

**EVIDENCE.** `ODQ:9724-9737` raises it with three conditions (modest sample; the service's
own terms checked before any output becomes a reference; used ONLY as a fidelity check,
never a new corpus, §242 standing). Lane source: `laneMFX2-receipt.md:129-133`.

**EVIDENCE — withdrawn.** `ODQ:9801-9808` (§261.2c): *"**§259.7's live-export FIDELITY CHECK
IS WITHDRAWN AS FRAMED** — sampling Watabou's exports cannot tell us 'how faithful our corpus
is,' because the corpus was never imitating Watabou … **The owner need not rule on it; I
withdraw the request**"*.

**STATUS: CONFIRMED withdrawn, and the withdrawal is correct on its own logic.** The
conditions were well-formed while it stood (the terms-check condition in particular is the
right instinct for a third-party service).

**DOUBTS.** None. The chair should simply note the item is closed, not pending.

---

# §263 — THE FTG STUDY COLLECTED

Queue entry: `RETROVALIDATION_QUEUE.md:204-210`. Row: `ODQ:9890-9963`.

### (a) The epoch-ladder convergence correction

**EVIDENCE — the correction.** `ODQ:9909-9919`: *"⭐⭐ **§240'S EPOCH LADDER IS CONVERGENT,
NOT IDIOSYNCRATIC — AND THAT IS GOOD NEWS HONESTLY REPORTED.** FTG SHIPS numbered generation
stages, each with its own road-branch mode, wander limit, material, placement mode, block
scale, **and an optional wall at the stage boundary** — the owner's core → wall → ring model,
shipped by someone else. MF-X2's claim that the prior art has no epoch axis is CORRECTED.
**Ours remains stronger for the reason that matters: theirs are FREE PARAMETERS IN A FORM;
ours are DOSSIER-DERIVED with a measured ≤4-epoch ceiling.**"*

**EVIDENCE — the claim it corrects.** `PRIOR-ART-WATABOU.md:200` — *"they have no epoch axis
whatsoever"* — and `:1080`, *"No epoch axis (§1.2) | **DELIBERATELY-DIFFERENT** — §240 is
capability they lack"*. The correction is real and lands on a specific prior claim.

**EVIDENCE — the lane's own framing.** `laneMFX3-receipt.md:84-90`, incl. *"**A
differentiator that turns out to be convergent is a de-risking, not a loss.**"*
Deliverable: `PRIOR-ART-FTG.md:400` (*"§240's EPOCH LADDER, SHIPPED BY SOMEONE ELSE"*),
`:406`, `:448-449` (*"count and stage settings are free parameters typed into a form. Ours
are **derived**: SPEC S5 records the epoch ladder as **BUILT**"*), `:1079-1083`.

**STATUS: the correction is CONFIRMED as recorded and honestly reported** (a chair
correcting its own prior row's differentiation claim, against interest). The FTG mechanism
description itself is **PLAUSIBLE and weaker-sourced than either prior study** — see doubts.

**DOUBTS on "dossier-derived vs free parameters" as the remaining differentiator.** Two
problems the chair should weigh:
1. **The evidence base is the weakest in the cluster.** `laneMFX3-receipt.md:131-133`:
   *"**FTG is closed-source.** Its algorithm is reconstructed from the author's published
   documentation, published screenshots, and the capabilities his two open integration
   clients must support — **inference from documentation, not from code.**"* So the claim
   "theirs are free parameters in a form" is inferred from a UI/docs surface. It is
   plausible but it is the sort of claim that a settings panel could hide a derivation
   behind.
2. **The differentiator is a claim about *provenance*, not about *output*.** Two systems
   producing the same epoch ladder differ in truth, not in pixels — which is exactly §247.3c's
   argument and equally unmeasured. The "measured ≤4-epoch ceiling" half **is** ours and is
   measured; that is the defensible half.

### (b) The dependency graph as rank-#1 approach

**EVIDENCE.** `ODQ:9920-9928`: *"nodes are resources, edges are ratios with STATED
DENOMINATORS, and producers fall back to importing shops where the land cannot support them
— **with NO FREE SCALAR ANYWHERE IN IT**, which makes it structurally anti-decoration under
§246. And the decisive asymmetry: **we HOLD the facts its author has to invent.**"*
Lane: `laneMFX3-receipt.md:95-99`. Deliverable verdict with three legs at
`PRIOR-ART-FTG.md:357` (*"**Verdict: ADOPT-AS-APPROACH — ranked #1 in this document.** Three
legs, per §261"*).

**STATUS: PLAUSIBLE.** Documentation-derived, never executed; leg (c) is by the lane's own
statement *"an untested prediction"* (`laneMFX3-receipt.md:135`).

**DOUBTS.** "No free scalar anywhere in it" is a strong structural claim made from
documentation about a closed product. It is the load-bearing reason for the #1 rank. The
chair should treat the rank as provisional on that one unverifiable property.

### (c) The triangular-remnant substitution under §258.2

**EVIDENCE.** `ODQ:9929-9935`: *"subdivide to get the PLOT, then FIT a footprint from a
rectilinear vocabulary — rather than subdividing until the piece IS the building. This
preserves the law's intent (organic plot geometry) while curing the wedge defect Watabou's
own author flagged. Our aspect-ratio constraint becomes a HARD FILTER rather than a
tendency."* Lane: `laneMFX3-receipt.md:100-104`.

**STATUS: PLAUSIBLE, and correctly formed as a §258.2 substitution** — intent named, cure
named, and the defect it cures has independent attestation (the upstream author's own stated
dissatisfaction, recorded at `PRIOR-ART-WATABOU.md:98-99` as a **prose-sourced** finding,
which is the study's strongest evidence class).

**DOUBTS.** It does not name a numeric preserved signature in the ODQ row. §4.1c's closing
note (`GENERATION-SPEC.md`, §4.1c) says this mechanism *"has its own three legs and its own
measured miss (the alley/sliver floor) and does not rest on this test at all"* — so a
signature does exist elsewhere. The chair may want it stated in the §3.6 register row rather
than inferred.

### (d) Ordering the two missing instruments built before their mechanisms are adopted — ARE THEY NAMED CONCRETELY?

**Yes — concretely, with the statistic specified, in three independent places.**

**EVIDENCE — the order.** `ODQ:9947-9953`: *"(a) **TWO MISSING INSTRUMENTS ARE NOW ORDERED
BUILT** — per-epoch material/tone contrast (this lane) and tower spacing (§259.5). Both gate
ranked mechanisms, both are cheap, and **two prior-art products now agree on the tower
mechanism while we still cannot check it against a number**, which is exactly the condition
that lets a plausible idea become an unmeasured habit. They join W0's instrument work."*

**EVIDENCE — the lane naming them.** `laneMFX3-receipt.md:148-154`, incl. *"A second missing
instrument, newly identified (§5.3). Per-epoch **material/tone contrast** has no metric …
**Named: a per-epoch fill-tone separation measure.**"*

**EVIDENCE — the deliverable stating why the existing metrics cannot substitute.**
`PRIOR-ART-FTG.md:1049`: *"**No corpus metric exists** for between-region tone or texture
contrast. `fill_tone_iqr` and `wash_within_sigma` are whole-plate statistics; SPEC §2.4's
epoch grain step is a *grain* band and using it here would gate one quantity with another's
number."* That is a precise, checkable argument, not a hand-wave.

**EVIDENCE — landed as a ledger row with the statistics specified.**
`GENERATION-SPEC.md:3286` (gap **G-40**): *"⛔⛔ **THE THREE MISSING INSTRUMENTS** — (i)
**tower spacing** (spacing CV along the circuit + towers per unit circuit length); (ii)
**per-epoch material / tone contrast** (a between-region fill-tone separation, not a
whole-plate statistic); (iii) ⟦lane finding⟧ **footprint-scale rectangularity**, absent from
the entire register … ⭐ **§263.6a ORDERED (i) AND (ii) BUILT; (iii) IS THIS LANE'S ADDITION
AND IS VETOABLE.** Cheap, and **all three land in W0**."* Each row names what it gates.

**STATUS: CONFIRMED.** Both ordered instruments are named as concrete statistics, sourced to
the lane that found them, routed to a wave, and each is bound to the mechanism it gates.
The §266 fold added a third and correctly marked it as the lane's own addition rather than
smuggling it in as previously ordered (`ODQ:10101-10104`).

**⛔ DOUBT — THE ROW COLLECTED TWO OF FIVE ESCALATIONS AND DROPPED THREE.**
`laneMFX3-receipt.md:146-166` is headed *"RAISED TO THE CHAIR, NOT DECIDED"* and contains
**five** numbered items. Items 1 and 2 (the two instruments) became §263.6a. I grepped for
the other three in both the ledger and the spec:

| escalation | receipt line | in ODQ? | in GENERATION-SPEC? |
|---|---|---|---|
| §247 marketing caution — FTG's "same town across time" runs on **hours and days** | `:155-157` | **no** | **no** |
| §247 competitive observation — the substance leader **cannot hand a user a static artefact**; its Foundry/Roll20 integrations embed a live iframe | `:158-161` | **no** | **no** |
| lifecycle question — *"Does our regeneration path ever re-derive the street web partially, and if so what happens to every fact defined in terms of it?"* | `:162-166` | **no** | **no** |

(Grep detail: `grep -inE "hours and days\|across generations\|hours, not decades"` over the
ODQ returns only `:8188` and `:8915`, neither related; over the spec, zero. `grep -inE
"partial re-deriv\|regenerate-area\|partial street"` returns zero in both. The single
`iframe/Foundry` spec hit at `:12105` is a later §287-era fold on a different subject.)

The third is the most serious as engineering: a partial-regeneration question about the
substrate every derived fact keys on is precisely the lifecycle class this program has been
bitten by before. It was raised as a question, not a finding, and it evaporated.

---

# §265 — THE CHAIR'S SELF-CRITIQUE AND THE INTEGRATION SPIKE

Queue entry: `RETROVALIDATION_QUEUE.md:212-217`. Row: `ODQ:10017-10072`.

### (a) Inserting an integration spike after W0 — right call given it costs a lane and lands nothing?

**EVIDENCE — the argument.** `ODQ:10053-10070`: *"⭐⭐ **THE CORRECTION, AND IT IS THE
SHARPEST OBJECTIVE CRITIQUE AVAILABLE: NOTHING FROM THE MAP PROGRAM HAS TOUCHED THE PRODUCT,
AND THE SANDBOX DIVERGES FURTHER WITH EVERY WAVE.** … **A spike that fails is worth more
than a wave that succeeds**, because it converts the program's largest unknown into a number
before eight more waves are built on top of it."* Mandate stated as measurement-only at
`:10063-10068`.

**EVIDENCE — the premise is verifiably true.** I checked directly:
- `find /Users/cstokes/Desktop/settlement-engine /private/tmp/claude-502 -path
  "*/townMap/fabric/immersion.js"` returns **ten hits, every one inside a scratchpad lane
  worktree** (`laneMFW0-tip`, `laneMFW1B-base`, `laneMFW2-cf`, `laneMFW3-tip`, …) and
  **none inside the repo**.
- The repo's own `src/domain/townMap/` contains exactly **five** files (`anchors.js`,
  `index.js`, `institutionAssignment.js`, `mapEdits.js`, `townMapModel.js`) — no `fabric/`
  directory at all.

**STATUS: CONFIRMED.** "Nothing from the map program has touched the product" is not
rhetoric; it is literally true at the filesystem level. The whole fabric — 47 modules at the
W3 tip — lives only in scratchpad lanes.

**DOUBTS.** None on the diagnosis. On the scheduling, §266.5 reversed it four rows later
(see §266(b)); the self-reversal is itself evidence the original scheduling was not
load-bearing.

### (b) The no-more-meta-documents ruling

**EVIDENCE — the ruling.** `ODQ:10036-10042`: *"(a) **THE PAPER-TO-CODE RATIO.** Tonight
produced studies, then a specification, then a fold ON the specification — three
documentation layers. **RULED: after MF-SPEC2 seals, NO further meta-documents. Only build
waves and their receipts.** If a future finding needs folding, it folds INTO the spec as one
edit, never into a new artifact."*

**EVIDENCE — partially honoured, and falsified within four days.**
*Honoured for folds:* `GENERATION-SPEC.md:9` shows later material (§261, §263, §259, §262.2,
§264.2, §257.3) folded **into** the spec, and later rows still fold in place (`⟦FOLD §278⟧`
at `:4235`, `⟦FOLD §284⟧` at `:7058`, `⟦FOLD §275⟧` at §4.1d) rather than spawning new
artifacts. That is the ruling working.
*Falsified for new documents:* four new `.md` documents appeared in `map-corpus/docs/`
after the ruling and are in **no commit on any ref** —
`ARCHITECTURAL-MASSING-EVIDENCE-WAVE1.md`, `HISTORICAL-EVIDENCE-EXPANSION-PROTOCOL.md`,
`HISTORICAL-URBANISM-EVIDENCE.md`, `RURAL-SETTLEMENT-LANDSCAPE-EVIDENCE-WAVE1.md`.
`HISTORICAL-URBANISM-EVIDENCE.md:3-6` dates itself *"Survey date: 2026-08-20"* and names a
*"Binding expansion protocol"* — i.e. a governance meta-document plus its own protocol
document, exactly the class the ruling closed.

**STATUS: the ruling is CONFIRMED as made and PARTIALLY FALSIFIED in practice.**

**DOUBTS / fairness note.** HEAD commits `85536035` (*"Assess the two research documents:
adopt the counterfactual benchmark (§275)"*) and `3e3366b9` (§276) indicate the owner
supplied research documents after the ruling, and an owner act supersedes a chair ruling.
So this may be authorised rather than drift — **but four documents plus two integrity
scripts appeared where "two research documents" were assessed, and none is committed.**
The chair should determine which are owner-supplied and which are lane-authored, then either
amend §265.2(a) or enforce it.

### (c) Is the retrovalidation queue creating a false sense of safety?

**EVIDENCE — the mitigation the chair already wrote.** `ODQ:10042-10047`: *"**THE
RETROVALIDATION DEBT IS GROWING** — every ruling since §237 is Opus-chaired and queued for
Fable, now ~25 entries. **The mitigation is a standing rule: every ruling must stand on its
own quoted evidence AT THE TIME IT IS MADE. The queue is a bonus audit, never a dependency**
— if Fable never returns, nothing in the program may be blocked by that."*

**EVIDENCE — the standing rule tested against this cluster.** Mixed, and the pattern is
informative. Rows that quote their own evidence at the time hold up under audit (§248/§253's
license findings; §263's instrument order). Rows that state a *grade* rather than quote
evidence drifted (§259's "DIAGNOSED"). And the one place the queue would have caught
something, it did not: §261's ordered annotation of `PRIOR-ART-WATABOU.md` never happened
and no queue entry tracks it — the queue records what Fable should *re-derive*, not what the
chair *promised to do*.

**STATUS: the concern is WELL-FOUNDED, and I can name the specific failure mode it does not
cover.** The queue audits judgments. It does not audit **chair-ordered remediations**. Two
in this cluster were ordered and not performed (the §261 annotation; §253.3's *"AUDIT
ORDERED against our own pipeline"* for per-stage stream derivation, for which I found no
receipt). Neither appears in the queue, because neither is a judgment.

**DOUBTS.** The row says *"now ~25 entries"*; `grep -c "^### §" docs/FABLE_RETROVALIDATION_QUEUE.md`
returns **30**, running through §274. Growth continued after the concern was named, which is
data for the chair on whether naming a concern changes behaviour. (The row's "~25" also
appears to count queue entries rather than Opus-chaired rows since §237 — the two differ,
since not every row generates an entry.)

---

# §266 — THE RECONCILIATION FOLD

Queue entry: `RETROVALIDATION_QUEUE.md:219-225`. Row: `ODQ:10074-10135`.

### (a) The rank ruling — "dependency governs rank, not excellence"

**EVIDENCE.** `ODQ:10108-10114`: *"⭐ **THE RANK AMBIGUITY IS RESOLVED AS THE LANE FOLDED IT:
the dependency graph is #1 AMONG PRIOR-ART ADOPTIONS, not gap-ledger rank 1.** The terrain
substrate keeps rank 1 because it UNBLOCKS OTHERS — a ruled law (§214's terrain arm) and six
of eight context traces — while the roster, however good, unblocks nothing. **Dependency
governs rank; excellence does not.**"*

**EVIDENCE — the two rank spaces are real and separate in the artifact.** The FTG
deliverable's own claim is scoped to its own document: `PRIOR-ART-FTG.md:357` reads
*"ranked #1 **in this document**"* — so the ambiguity was created by the collecting row
(`ODQ:9920-9921`, *"RANKED #1 AND ADOPTED AS APPROACH"*, unscoped), not by the lane.
The gap ledger keeps its own ordering (`GENERATION-SPEC.md:3286` is rank **5**; `:3307` is
rank **26**), confirming the two scales coexist.

**EVIDENCE — the order was mechanically checked.** `ODQ:10084-10086`: *"The gap ledger went
33 → 42 rows **with relative order MECHANICALLY ASSERTED UNCHANGED** — which is why the wave
plan survives the re-rank untouched."*

**STATUS: CONFIRMED** as a coherent resolution; the underlying ambiguity is traceable to a
specific unscoped phrase, and the fix restores the lane's own scoping.

**DOUBTS.** "Mechanically asserted unchanged" names no receipt, no script and no output. It
is the one mechanical claim in this row that I could not verify from any artifact. The chair
should ask for the assertion's receipt or downgrade the claim to PLAUSIBLE.

### (b) Pulling the integration spike forward against §265's own scheduling

**EVIDENCE.** `ODQ:10128-10135`: *"I had scheduled it after W0 sealed; on inspection it
collides with nothing — it touches the APP and a REAL DOSSIER, not the map sandbox W0 owns —
and the whole argument for it was that earlier evidence on the program's largest unknown is
worth more than later. **Waiting for a lane slot I do not actually need would have repeated
the error the spike exists to prevent.** Dispatched alongside W0."*

**EVIDENCE — the non-collision premise is verifiable and true.** As under §265(a): the map
fabric exists only in scratchpad lane worktrees; the app's `src/domain/townMap/` is the
five-file legacy surface. A spike touching the app genuinely cannot collide with W0's
sandbox.

**STATUS: CONFIRMED** on the non-collision premise; the scheduling judgment itself is the
chair's to re-derive. I note the reversal is self-consistent — §265's own argument (earlier
evidence beats later) argues for §266's schedule, not §265's.

**DOUBTS.** None on evidence. Worth observing that §265's original scheduling was made
without the inspection §266 performed, which is a small instance of a ruling made before its
own cheap check.

### (c) Is G-39's four-outcome decision rule genuinely falsifiable as written?

**EVIDENCE — the rule, quoted in full from `GENERATION-SPEC.md` §4.1c.**

> **THE DECISION RULE, written before the numbers so it cannot be fitted afterwards:**
>
> | outcome | what follows |
> |---|---|
> | **arm 1 disordered AND arm 2 rectangular** | ⭐ **hypothesis SUPPORTED.** … **This is the rework §261 is gating** |
> | **arm 1 disordered AND arm 2 ALSO irregular** | ⛔ **hypothesis REFUTED for our target.** The corpus's buildings are not rectangular and imitating a generator's squareness would move us *away* from it. **G-38 keeps its four axes; the chaos scoping is not adopted** |
> | **arm 1 ordered** (contradicting §2.4) | ⛔ **stop and re-examine the instrument, not the hypothesis** — it would contradict figures this document publishes as CONFIRMED |
> | **arm 2 unmeasurable** (G-40(iii) not built) | ⚠ **the hypothesis stays a hypothesis and drives nothing.** *An untestable diagnosis is not a licence to rework* |

**EVIDENCE — the ordering claim is corroborated.** `GENERATION-SPEC.md:3696`: *"**The
four-outcome decision rule is written in §4.1c and was written BEFORE the numbers so it
cannot be fitted afterwards**"*, and §4.1c is itself marked `⟦FOLD §264⟧`, predating any run.

**STATUS: YES — falsifiable, on one branch. Row 2 is a genuine falsification condition with
a stated consequence** (G-38 keeps its axes; the chaos scoping is not adopted). That is more
than most hypotheses in this program carry.

**DOUBTS — three, and the chair asked precisely this, so I will be blunt.**

1. **The rule is asymmetric: one branch is a pre-committed escape hatch.** Row 3 pre-assigns
   a result that contradicts the hypothesis's own premise to *instrument error* — *"stop and
   re-examine the instrument, not the hypothesis"*. A rule that can only be falsified in one
   direction, and attributes the other disconfirming direction to measurement fault before
   any measurement exists, is weaker than it looks. The justification given (it would
   contradict published CONFIRMED figures) is reasonable, but it is still a pre-registered
   refusal to update.
2. **The test reduces to the arm that cannot run.** §4.1c itself: *"**Arm 1 is close to
   confirmed on our own published figures. It is arm 2 that decides the hypothesis.**"* and
   *"**ARM 2 … ⛔ NOT RUNNABLE TODAY.**"* So rows 1 and 2 both hinge on G-40(iii), which
   §263/§266 record as *"THIS LANE'S ADDITION AND IS VETOABLE"* (`GENERATION-SPEC.md:3286`).
   A falsifiable test gated on a vetoable instrument is contingently falsifiable.
3. **⭐ The stakes are lower than the framing suggests, and the document says so.** §4.1c
   closes: *"even if the hypothesis is refuted, the MECHANISM it inspired survives
   independently. G-37's fit-the-footprint has its own three legs and its own measured miss
   … and does not rest on this test at all. ⚠ *What the test governs is whether we may say
   WHY we did it.*"* So a REFUTED outcome changes the **justification** and not the **build**.
   That is admirably honest, and it means the test's decision value is narrower than
   §259's "large rework" framing implied. The chair should decide whether a gate that cannot
   change what gets built is worth blocking S7/S10/S11 on.

### (d) "§12's immersion suite is already built and only its subject is deferred" — VERIFIED AT THE CODE LEVEL

**EVIDENCE — the claim.** `ODQ:10121-10127`: *"⭐⭐ **IMMERSION IS LESS DEFERRED THAN IT
SOUNDED, AND THIS MATTERS TO THE OWNER**: the fold found **§12's immersion suite is largely
ALREADY BUILT** — what dependency order defers is the suite's SUBJECT (what the marginalia,
heraldry and event marks are ABOUT), not the suite itself."* Spec version at
`GENERATION-SPEC.md:274-282`, naming the suite as *"marginalia, legend, heraldry, curved
lettering, event marks, walk rings, pentimento"*.

**EVIDENCE — I found the code and it substantiates the claim.** In the W3 lane tip
(`…/a244e7a3…/scratchpad/laneMFW3-tip/`):

- `src/domain/townMap/fabric/immersion.js` — **508 lines**, exporting
  `marginalia()` (`:105`), `deriveHeraldry()` (`:164`, with a frozen `CHARGES` table at
  `:150`), `deriveWalkRings()` (`:210`), `derivePentimento()` (`:243`), `deriveEventMarks()`
  (`:338`, with `EVENT_MARK_KIND` at `:327`), `deriveNeighbourEdges()` (`:431`), all composed
  by `buildImmersion()` (`:491-504`). Every derivation carries a `reason` string citing its
  §12 sub-law (e.g. `:195` *"§12.4 heraldry: … (seeded; a division carries no meaning)"*).
- `src/domain/townMap/fabric/lettering.js` — **391 lines**, curved lettering, with the chrome
  boxes handed in (`:19`).
- `harness/renderFolio.mjs` — `:1759` *"── 17 · THE FOLIO CHROME — cartouche + compass."*;
  `:1793` scale bar via `scaleBarFor`; `:1808-1813` *"⭐⭐ §12.4 THE DERIVED DEVICE, in the
  cartouche"*; `:1853-1894` the §12.7 legend box, rendered as `<g id="legend">`.

So cartouche, compass, scale bar, legend, heraldry, curved lettering, marginalia, event
marks, walk rings and pentimento all exist as executed-code surfaces, and the derivations
are keyed to settlement facts (`marginalia()` consumes `datedEvents(settlement)` at `:105`,
`:78`) — which is exactly why an absent biography leaves them empty. **The "subject, not
suite" characterisation is CONFIRMED at the code level.**

**EVIDENCE — the two exclusions are real too.** `grep -rn "chromeRung"` over the lane tip's
`src` and `harness` returns **zero hits**, confirming the spec's own carve-out at
`GENERATION-SPEC.md:2597` (*"T-25 · CHROME ESCALATES WITH TIER — ⛔ MISSING (GAP-I)"*) and
`:2611-2613` (*"**STATUS: PARTIAL.** Chrome, lettering, cartouche, compass, scale bar,
legend and heraldry are BUILT; the tier rung and the annotation contract are not. ⚠ Carried
defects: heraldic charges read coarse at cartouche size; no rank cartouches or district
sub-labels."*).

**STATUS: CONFIRMED, with two qualifications the ledger row omits.**

**DOUBTS.**
1. **"Built" means built in the sandbox, not in the product.** §266.4 is addressed to the
   owner (*"THIS MATTERS TO THE OWNER"*) and does not say where. Read beside §265.3 —
   *"NOTHING FROM THE MAP PROGRAM HAS TOUCHED THE PRODUCT"*, which I verified — an owner
   could reasonably read §266.4 as a shipping capability. It is not one. The spec's §0.5 is
   careful; the ledger row is not.
2. **The stage is PARTIAL, and the row's summary drops the carve-outs.** The spec states two
   un-built pieces plus two carried defects. §266.4's *"largely ALREADY BUILT … not the suite
   itself"* is true but rounder than its own source. Minor; worth a one-line amendment rather
   than a reversal.

---

# RANKED — SHARPEST DISCREPANCIES

**1. ⛔⛔ The program banked "a permissive top-level license does not launder vendored
provenance" and never ran that check on its own tree — where 123 tracked files of
GPLv2-or-later TinyMCE sit inside a vendored FMG at `public/map/`, reaching `dist/` and
served in production.** (§248/§253.) Evidence: `public/map/LICENSE-FMG.txt`;
`public/map/libs/tinymce/license.md`; 636 + 123 tracked files; `find dist/map/libs/tinymce
-type f | wc -l` → 123; `vercel.json:23`'s dedicated `/map/(.*)` header block. Predates the
map program (`f386f48d`). Mitigating: our own loader points at the upstream CDN
(`public/map/modules/ui/notes-editor.js:67-68`), so the local copy appears unreferenced.
§254.6 (`ODQ:9411-9421`) is the row that makes this matter — *"SettlementForge ships
JavaScript to the user's browser, which IS conveying … There is no SaaS exemption available
to us."* **Not a ruling — a check nobody ran.**

**2. ⛔ §261 ordered `PRIOR-ART-WATABOU.md` annotated; it was never annotated.** (§259.)
`ODQ:9834-9836` promises it; `grep -n "261"` over the file returns **zero hits**, while 15
occurrences of the retracted "imitator" framing remain live, including the §0d style-capture
guard (`:125`) and the D12 tag (`:927`). The FTG deliverable applied the correction properly
(`PRIOR-ART-FTG.md:105` + six citations), so the correction propagated forward and skipped
the document it was correcting. A successor reading the tracked deliverable learns the
retracted lineage as fact — and the queue asks Fable to re-derive the divergences' weight
from exactly this document.

**3. ⛔ Three of the FTG lane's five explicit "RAISED TO THE CHAIR" escalations reached
neither the ledger nor the spec.** (§263/§247.) Verified by grep over both.
Most consequential to the owner: `laneMFX3-receipt.md:155-157` — FTG also sells "the same
town across time" on an **hours-and-days** axis — which directly contests §247.3c's
*"the artifact no competitor can produce"*, the differentiator the chair told the owner to
lead with. Most consequential to engineering: `:162-166`'s partial street-web re-derivation
lifecycle question.

**4. §259's evidence grade degraded across three hops, in one direction.** The lane wrote
*"likely why our output reads as mush"* (`laneMFX2-receipt.md:96-98`) over a finding its own
document grades *"PLAUSIBLE, not CONFIRMED"* (`PRIOR-ART-WATABOU.md:108-111`); the ledger
header wrote *"THE MUSH IS DIAGNOSED"* (`ODQ:9673`); the queue wrote *"the mush diagnosis —
it will drive a large rework"* (`:185-186`). §261.3 corrected it to a hypothesis and G-39 now
blocks the rework — the correction worked, but the drift mechanism (a grade rising as a claim
moves up the ledger) has no guard.

**5. §253.6's backup cure was a one-time fix and has already decayed.** Four
governance-bearing knowledge documents (survey-dated 2026-08-20) plus two integrity scripts
sit in `map-corpus/docs/` in **no commit on any ref**; `git check-ignore` says they are not
ignored, so nothing is broken except that nobody committed them. Same failure mode §253.6
fixed, four days later, with new documents.

**6. G-39's decision rule is falsifiable but contingently and asymmetrically so.** One
branch pre-attributes a disconfirming result to instrument error; the deciding arm is not
runnable and depends on a vetoable instrument; and §4.1c itself concedes a REFUTED outcome
changes only *"whether we may say WHY we did it"*, not what gets built.

**7. §266.4's "immersion is already built" is true in the sandbox and could read to the
owner as a product capability.** Verified built (`immersion.js` 508 lines + `lettering.js`
391 + `renderFolio.mjs` §17 chrome); verified **not** in the product (`src/domain/townMap/`
holds five files, no `fabric/`); and the spec's own two carve-outs (`chromeRung` — grep
returns zero — and the annotation contract) are dropped from the ledger summary.

**8. Unreceipted orders and claims, each small, each worth closing.** (i) §253.3's *"AUDIT
ORDERED against our own pipeline"* for per-stage stream derivation — no receipt found.
(ii) §266.1's *"relative order MECHANICALLY ASSERTED UNCHANGED"* — no script, output or
receipt named. (iii) §259.5 says no tower metric exists while §261.3 lists the tower finding
among those *"corpus-measured first"* — an internal contradiction that decides whether the
tower re-read is a strong surviving link or an ungated one.
(iv) Hygiene asymmetry: the Watabou and FTG clones were deleted and verified
(`laneMFX2-receipt.md:48-49`; `laneMFX3-receipt.md:177-179`), while the **78 MB FMG clone
remains on disk** with its GPLv2+ tinymce directory and the flagged phone-home widget.
§248 never ordered deletion, so this is inconsistency, not breach.

**9. Quantifier overreach in two headline claims, both fixable by wording.** "Nobody ships
the join" rests on exhaustion over **one** repo (genuinely rigorous — 248 files, 28
renderers, `PRIOR-ART-FMG.md:491-500`) plus inference about a second and a survey of none;
and §258.3's *"THREE CASES THE DOCTRINE RESOLVES IMMEDIATELY"* is one substitution, one
refusal and one composition.

---

## WHAT I COULD NOT VERIFY

- **Any upstream fact.** No external repository was fetched, per the brief. Every claim about
  FMG, Watabou or FTG internals is reported at the grade the receipts assign it — and for
  Watabou and FTG that ceiling is **PLAUSIBLE** by the lanes' own statements
  (`PRIOR-ART-WATABOU.md:108-111`; `laneMFX3-receipt.md:129-133`).
- **The FTG mechanism claims** rest on documentation and integration clients, not code
  (`laneMFX3-receipt.md:131-133`) — the weakest evidence base in the cluster, supporting the
  #1-ranked adoption.
- **Whether the four uncommitted evidence documents are owner-supplied or lane-authored.**
  HEAD's §275/§276 commits suggest owner involvement; I did not open a determination.
- **Whether `public/map`'s vendored tinymce is known to the owner or already dispositioned.**
  I found no ODQ row addressing it; absence of a row is not absence of a decision.
