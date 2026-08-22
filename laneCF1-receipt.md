# laneCF-1 · THE CORRECTIONS FOLD — RECEIPT

**Lane:** CF-1 (Opus implementation lane, seat model ODQ §291.5)
**Charter:** ODQ §298.9 — execute the retrovalidation sitting's DOCUMENT CORRECTIONS as one
auditable batch. Documents only. No code, no git mutation, no gate runs beyond the ordered
`corpus_integrity.py` re-run.
**Authority read before the first edit:** ODQ §293 (prior-art/meta cluster), §294 (header),
§297 (map-architecture cluster), §298 (corpus/measurement cluster), in
`/Users/cstokes/Desktop/settlement-engine/docs/OWNER_DECISION_QUEUE.md`.
**Fold marker used throughout, in each document's own idiom:** `⟦FOLD §297/§298⟧`
(matching the existing `⟦FOLD §287⟧` / `⟦FOLD §264⟧` / `⟦FOLD §275⟧` markers).
**Date:** 2026-08-21
**Status:** COMPLETE. 10 spec corrections + 2 corpus-doc corrections + the hf389 rename executed;
**66 `⟦FOLD §297/§298⟧` markers** placed across 5 documents; the ordered integrity gate re-run
**GREEN at 313/313, TRUE_EXIT=0**. Four items RAISED, not improvised (§RAISED below).

---

## ⛔⛔ R-0 · READ THIS BEFORE COMMITTING — THE SHARED INDEX HAS **ALL OF `map-corpus/` STAGED FOR DELETION**

**This is PRE-EXISTING state, not caused by CF-1** — this lane ran **zero** git commands and made
exactly two filesystem `mv`s. It is raised first because it sits directly in the chair's path.

```
$ git rev-parse --abbrev-ref HEAD ; git rev-parse HEAD
review-fixes-2026-07-08
7b75a16dfad9d4cbabd514efa11bf196b738ca52

$ git status --porcelain -- map-corpus/ | awk '{print substr($0,1,2)}' | sort | uniq -c
   1 ??
  71 D

$ git status --porcelain -- map-corpus/docs/GENERATION-SPEC.md
D  map-corpus/docs/GENERATION-SPEC.md
?? map-corpus/docs/GENERATION-SPEC.md
```

**What this means, precisely:**

1. **All 71 tracked `map-corpus/` paths are staged as DELETIONS in the shared index**, while the
   files exist on disk as untracked. HEAD *does* carry them (`git cat-file -e
   HEAD:map-corpus/docs/GENERATION-SPEC.md` → exists).
2. ⛔ **A plain `git commit` from this index would commit the DELETION of the entire `map-corpus/`
   tree and would carry NONE of CF-1's edits** — every file this lane touched is among those 71.
3. ✅ **`map-corpus/plates/` and `map-corpus/previews/` are tracked by ZERO files**
   (`git ls-files map-corpus/plates | wc -l` → `0`). **The hf389 rename therefore has no git
   consequence at all** — it is a pure filesystem act, which is the correct outcome.

**CF-1 did not touch the index and will not** (shared tree; owner-gated class). The chair must
resolve the staged-deletion state — and land CF-1's edits on the branch that actually owns
`map-corpus/` — before or as part of the collecting commit. *This is the "the main worktree matches
no branch" hazard presenting itself at a landing.*

---

## §0 · INDEPENDENT RE-DERIVATION OF THE SITTING'S FIGURES — **CONFIRMED**

Before editing, every numeric correction on the sheet was re-derived from the corpus's own
instrument files (`map-corpus/docs/MFS3a-windows.json`, `MFS3a-planmetrics.json`,
`laneHFM1-corpus-measured.csv`). Script:
`scratchpad/retro-CF1-verify.py`. Executed output:

```
== A1: pitch coarsening, window-independent (cells_across = pitch x window width) ==
  hf26   old         w= 3033.6px cells= 46.9 pitch= 64.68 | newquarter  w= 1516.8px cells= 16.3 pitch= 93.06 | PITCH RATIO 1.439 (published cells ratio 2.88x)
  hf274  oldbank     w= 2022.4px cells= 47.2 pitch= 42.85 | newcharter  w= 1516.8px cells= 26.6 pitch= 57.02 | PITCH RATIO 1.331 (published cells ratio 1.77x)
  hf239  vicus       w= 1516.8px cells= 30.0 pitch= 50.56 | camp        w= 1719.0px cells= 33.8 pitch= 50.86 | PITCH RATIO 1.006 (published cells ratio 0.89x)
  hf347  core        w=  910.1px cells= 17.4 pitch= 52.30 | outerring   w=  707.8px cells=  9.8 pitch= 72.23 | PITCH RATIO 1.381 (published cells ratio 1.78x)
  phi step hf26: 9.449  hf239: 7.905  hf274: 2.427

== A4: junction census over the 35 whole-settlement windows ==
  n windows      : 35
  median X:T     : 0.0241
  T per X (1/med): 41.49
  zero-star (deg>=5 n==0): 27 of 35
  hf239 camp X share: [0.0882]

== B1: paper warmth, centroid vs median estimator ==
  HF-1 (n=49)                centroid #F8E9D4 warmth(centroid)=35.88  median(warmth)= 37.0
  HF-1 daylight (non-lens)   centroid #F8E9D4 warmth(centroid)=35.96  median(warmth)= 36.5
  UNION (n=71)               centroid #F7E9D6 warmth(centroid)=33.21  median(warmth)= 33.0
  gap HF-1 - UNION on the centroid estimator: 2.67

== A10: fill-tone IQR median by cohort ==
  HF-1 (n=49)      median=17.90
  UNION (n=71)     median=22.00
```

**CONFIRMED, to the digit, against the sitting's rulings:**

| ruled figure | source | re-derived | verdict |
|---|---|---|---|
| pitch coarsening **1.33–1.44×** (§298.5e) | windows.json + spec's own `cells_across` | 1.331 / 1.381 / 1.439 | ✅ exact |
| founding-mode φ step **9.4×** not 9.5× (§298.5e) | atlas φ figures | 0.652/0.069 = **9.449** | ✅ exact |
| median X:T **0.024** (§298.5a) | planmetrics, 35 whole windows | **0.0241** | ✅ exact |
| **41.5** T per X, not 43 (§298.5a) | 1/median(X:T) | **41.49** | ✅ exact |
| **27** of 35 zero-star windows, not 22 (§298.5a) | `star_n == 0` | **27 of 35** | ✅ exact |
| hf239 castra X share **0.088** (§298.5a) | planmetrics | **0.0882** | ✅ exact |
| HF-1 daylight centroid **36 / #F8E9D4** (§298.4a) | CSV `paper_hex` mean | **#F8E9D4, 35.88–35.96** | ✅ exact |
| tone IQR re-pins to **17.9 ≈ 18** on HF-1 alone (§298.2a) | CSV `fill_tone_iqr` | HF-1 **17.90**, union **22.00** | ✅ exact |
| grain **2.05** and wash **3.29** stand (§298.2a) | CSV, union cohort | **2.05 / 3.29** | ✅ unchanged |

Two figures did **not** reproduce and are RAISED, not silently written — see §RAISED R-1 and R-2.

---

## §1 · WHAT CHANGED, BY FILE

| file | `⟦FOLD §297/§298⟧` markers | items |
|---|---|---|
| `map-corpus/docs/GENERATION-SPEC.md` | **44** | A1 – A10 |
| `map-corpus/docs/laneMFS1-urbanism-atlas.md` | **19** | B1, B2, A10-source, C |
| `map-corpus/docs/laneHF-CALIBRATION.md` | **1** | C (index sync) |
| `map-corpus/docs/laneHFM1-receipt.md` | **1** | C (rename executed) |
| `map-corpus/docs/MORPHOLOGY-CONTEXT.md` | **1** | C (trace header) |
| `map-corpus/docs/laneHFM1-corpus-measured.csv` / `.json`, `MFS3a-frame.json` | (data) | C (`stem` / `file` keys) |
| `map-corpus/plates/`, `map-corpus/previews/` | (assets) | C (rename, 2 files) |
| **total** | **66** | |

**No file outside `map-corpus/` was touched.** `docs/**` at repo root was read only.
**Every edit is surgical** — no file was re-serialized; every pre-existing `⟦FOLD §287⟧` /
`⟦FOLD §264⟧` / `⟦FOLD §275⟧` marker survives untouched (spec `⟦FOLD §` occurrences **138 → 182**,
i.e. **+44** — exactly the markers added, none removed; the atlas had none before and has 19).

---

## §2 · EDIT LOG — GENERATION-SPEC.md

### A1 · EPOCH CALIBRATION REVERSED (§298.5e) — 8 sites

**Site 1 — §1.1's within-plate observation block (after the four-pair table).**
BEFORE:
> `1. Several labelled old/new pairs differ in grain by 1.8×–2.9×, but this does not prove that newer historical fabric is generally coarser or that age causes subdivision.`

AFTER: a `⛔ ⟦FOLD §297/§298⟧` block stating `cells_across = pitch × window width`, the
window-independent coarsening **1.33× – 1.44×** (hf274 1.33 · hf347 1.38 · hf26 1.44) with
**hf239 at 0.99× — the founding-mode inversion**, that a generator tuned to the withdrawn range
**overshoots by 35–100%**, that the **ORDERING is ratified as filed**, and that **§240 / G-42 / W4
calibration inherits 1.33–1.44×**; item 1 rewritten to quote the corrected step.

**Sites 2–4 — the founding-mode φ step, 9.5× → 9.4×** (re-derived: 0.652/0.069 = **9.449**):
- §1.1.7b discriminator: `(9.5×)` → `(⟦FOLD §297/§298⟧ **9.4×**, corrected from 9.5× at §298.5e)`
- §3.1 invariance list: `7.9×, 9.5× and 2.4×` → `7.9×, **9.4×** and 2.4×`
- §4's no-default-gradient rule: `7.9× / 9.5× / 2.4×` → `7.9× / **9.4×** / 2.4×`

**Site 5 — §2.6 register, two rows.**
BEFORE: `| **epoch grain step** | newer epoch **1.8× – 2.9× COARSER** | …` and
`| **epoch φ step (planned)** | **×2.4 – ×9.5** | …`
AFTER: `1.33× – 1.44× COARSER` in window-independent PITCH (hf239 0.99×), the published range
marked **WITHDRAWN**; and `×2.4 – ×9.4`.

**Site 6 — GAP-H's discriminator (S6).** `hf26 old vs new **2.9×** grain; hf274 … **1.8×**` →
`**1.44×** pitch; … **1.33×**`, plus a `⚠ ⟦FOLD §297/§298⟧` note that **GAP-H's proposed
≥1.3× cells-across band was derived against the withdrawn ratios**, so on the corrected step the two
pairs sit *astride* the floor rather than far above it — a candidate, not a measured separation.

**Site 7 — W4 exit criterion 1.** `The synthetic 1.8×–2.9× newer/coarser ratio is visual-study
data` → `**1.33×–1.44×** newer/coarser PITCH ratio (⛔ the published 1.8×–2.9× is WITHDRAWN …)`.

⚠ **The four-pair table's own `cells_across` cells were NOT altered** — they are true as measured;
it is the parenthetical *ratios* that were the artefact, and the correction block sits directly
beneath the table where a reader meets them.

### A2 · THE ≤4-EPOCH CEILING RE-SCOPED (§298.5e) — 3 sites

BEFORE:
> `**⚠ MAX 4 LEGIBLE LABELLED EPOCHS IN THE 313 SYNTHETIC PLATES** (PLAN §6.1).`

AFTER:
> `**⚠ ⟦FOLD §297/§298⟧ MAX 4 LEGIBLE LABELLED EPOCHS ACROSS THE 36 DIRECTLY-VIEWED PLATES OF THE 222-PLATE STUDIABLE FRAME** (PLAN §6.1). ⛔ **RE-SCOPED at §298.5e: the earlier form … claimed a census nobody ran.** 36 plates were viewed; 222 are studiable; 313 is the asset roster. … says nothing about the 277 plates no eye reached.`

BEFORE (§0's differentiator claim):
> `They cannot know that no plate in 313 shows a fifth legible epoch; we measured it.`

AFTER: the same scope correction, with the differentiator restated as surviving *at that scope*
("theirs are free parameters inferred from documentation, ours is a measured ceiling with a
derivation home").

Third site: the §2.6 `legible epochs` row now carries the scope inline.

### A3 · G-34's CAUSE ARITHMETIC CORRECTED (§297.6) — 3 sites

The published decomposition does not sum: **72 + 20 + 35 = 127**, the *whole* street-violation set,
offered as a partition of a 92-member subset; adding (d)'s 6 gives **133**.

**Site 1 — after the mismatch table's `| **total** |` row**, a `⚠⚠ ⟦FOLD §297/§298⟧` block:
**72 + 20 = 92 is the unexemptable A+B core**; the **35 first-crossing-per-channel** and **6
dead-`anchorKey`** classes are **separate and overlapping populations, not further addends**; and
⛔ **the full decomposition is re-derived when G-34 is built** (MF-D0/W3), with the overlap
published. Until then only the A+B core, 92 of 127, may be quoted.

**Site 2 — §262.2's ruling preamble.** BEFORE: `The 92 decompose into four causes` →
AFTER: `The 92 are the **A+B core (72 + 20)**; arms **(c)** and **(d)** below are **separate and
overlapping populations, not further addends** … Five causes are ruled …`

**Site 3 — the §4 disposition row.** BEFORE: `(72 predicate mismatch · 20 passage refusal · 35
first-crossing-only); **6 more are the dead-anchorKey mill**` → AFTER: the A+B core named, the
other two classes marked separate/overlapping, re-derivation pointed at the G-34 build.

### A4 · THE JUNCTION LAW SCOPED AND TWO SLIPS CORRECTED (§298.5a) — 6 sites

- `FORTY-THREE T-junctions for every X-junction` → **41.5** (re-derived: 1/median(X:T) = **41.49**)
- `22 of 35 have zero nodes of degree ≥5` → **27 of 35** (re-derived: **27**) — corrected at all
  three sites that quote it (§1.1.7a, the snapping-caveat paragraph, the §2.6 `degree ≥5 share` row)
- **The binding caveat added** as a `⛔⛔ ⟦FOLD §297/§298⟧` block: register-matching target, never a
  generator input; **the skeletonizer's X-recovery is unmeasured and large** — the hf239 castra
  control, a drawn grid, reads **0.088** where a true grid would read **≥0.5**; the RELATIVE
  discrimination survives, **the ABSOLUTE band may never gate generated vector output**; the only
  lawful census is **SAME-INSTRUMENT** (rasterize through the same skeletonizer, or measure
  X-recovery on a synthetic grid first)
- **The rationale STRUCK.** BEFORE: `The X-junction is a design act; the T-junction is a growth
  act.` AFTER: marked **UNSOURCED AND §261-BARRED** and withdrawn; what survives is the
  instrument-free observation that a naive generator defaults to X and the corpus does not
- The **CENSUS BANDS** line and **W3 exit criterion 1** both carry the same-instrument requirement;
  the exit criterion now distinguishes the **lawful RELATIVE arm** (a lattice fixture must red)
  from the **unlawful ABSOLUTE band**
- The §2.6 `junction mix — X : T` row carries 41.5, 27-of-35 and the same-instrument stamp

### A5 · THE VINTAGE TRIAD RE-SIZED — SIXTEEN OF SIXTEEN (§297.3c) — 4 sites

At W4's opening, a `⛔⛔ ⟦FOLD §297/§298⟧` block: **W2's G-42 delivered epoch COUNTS and nothing
else**; the **vintage triad (per-epoch grain, plot variance, pigment) is undelivered on ALL SIXTEEN
exemplar leaves, not six** — §266.2a's magnitude corrected; **the epoch token appears in zero
content modules**; ⛔ **the triad is W4-class real work and may never be planned as a free
consequence of §240 landing**; density gradient same class, §161g demotion is W3's first item.
Threaded to the three other sites that size this work with the retired "six of the sixteen" figure
(the four-edges list, W2's ruling block, and §240.3's LAWS line — where **§240.3's "dividends" are
marked REVERSED as delivered work**).

### A6 · §240.2's PER-TIER CEILING TABLE WITHDRAWN (§297.3b) — 3 sites

⚠ **The literal target on the sheet does not exist in this document — see RAISED R-3.** The spec
carries no `village 0 / town 1 / city 2 / metropolis 3` table; it *consumes* §240.2's caps in prose.
The withdrawal is therefore stamped at every site that leans on them:

**Site 1 — S5's "THREE CARRIED ITEMS A BUILDER INHERITS"**, prefixed with a `⛔⛔ ⟦FOLD
§297/§298⟧` block naming the withdrawn caps and every ground for the reversal (build diverges on
all of them — village 1 not 0, metropolis capped 2 then drawn 3 in W2, thorp/hamlet silently 1; the
corpus's only two three-circuit plates **hf347 and hf385 are both TOWNS**; PLAN's corroboration was
the Q-2 fabric/circuit conflation; village-0 contradicted by two sub-town enclosures; the ~10%
calibration is **n=3 with a double count**), and stating what survives: ⭐ **§240.2's first
sentence — ring count DERIVED from the settlement's own facts** — with the caps **re-derived
against the corpus (hf347/hf385 included, the walled-thorp question decided)**. Items (a) and (b)
each carry an inline correction.

**Site 2 — the §2.6 `legible epochs` row's note cell.** BEFORE: `corroborates §240.2's ring
ceilings independently` → AFTER: ⛔ **that corroboration is STRUCK (§297.3b)** — it was the Q-2
conflation, and a fabric-epoch row cannot witness a circuit ceiling.

**Site 3 — Appendix B's Q-6** (`§240.2 says a village earns zero circuits…`) marked **overtaken at
its premise**, re-framed onto the derived-not-a-knob law, and carried in that form.

### A7 · THE SUBSTITUTION REGISTER (§293.5a / §263.3c) — 2 sites

**Audit of the three rows against "names a metric that EXISTS in the measured register":**
SUB-1 ✅ (§2.5 scanline p97/p50, §2.4 distance-transform hierarchy) · SUB-2 ✅ at block scale ·
SUB-3 ⛔ correctly HELD, no signature exists (G-40(i)).

**SUB-2 is the triangular-remnant substitution**, and §263.3c requires the **§4.1c legs** named in
the row. Added to its signature cell: `block_solidity_p50` (**0.748**) · `block_elongation_p50/p90`
(**2.14**, band 1.6–3.0) · `orientation_order_phi` (0.044–**0.103**–0.433) · `orientation_entropy`
— with the honest limit stated: **every named leg is BLOCK-scale while the triangular-remnant claim
is FOOTPRINT-scale, and no footprint-shape metric exists** (§4.1c arm 2 / G-40(iii), unbuilt). The
row is therefore **complete at block scale and PENDING at footprint scale**; SUB-2's ADOPTED status
is unchanged (it names real register metrics), which is the ruled position.

**The register's own law extended** with a `⛔⛔ ⟦FOLD §297/§298⟧` block: **(1)** a signature must
be a metric that exists in the measured register, at the claim's own scale; **(2)** **every
substitution is COUNTERSIGNED BY THE CHAIR at collection — lane self-certification is
insufficient**, because whether a named signature is the *right* one is judgment no mechanical
check catches.

### A8 · THE W8 DEMO WORDING (§293.1c) — 2 sites

BEFORE (both the wave-exit table row and §5's marketing note):
> `*The artifact no competitor can produce.*` / `It is the artifact no competitor can produce`

AFTER — the unqualified claim **WITHDRAWN**, and the corrected differentiator stated in the wording
that must be used: **THE SAME TOWN ACROSS GENERATIONS** (the table row's headline changed from
"ACROSS TIME"), on two legs that must both be said because neither survives alone:
- **THE AXIS** — FTG also sells the same town across time, on an **HOURS-AND-DAYS** simulation
  axis; ours is **DECADES TO CENTURIES of DOSSIER-CAUSED, IMMUTABLE lived history**
- **THE ARTIFACT** — theirs is a **live iframe** embedded in an integration; ours is a **durable
  static document** the user keeps

with the closing line from the ruling: *the differentiator survives in that form and is stronger for
being honest*, cross-referenced to §249.4d's superlative law.

### A9 · §255's DECOMPOSITION CORRECTED (§297.6a) — 2 sites

BEFORE (§0.3's verdict):
> `The move is **+47 from the fork-key salt cure re-rolling the river's meander (declared cause 101)** and **−13 from the epoch / wall / version work (causes 97–100), which IMPROVED the figure.** Two orderings of the same 2×2 agree to the unit.`

AFTER: verdict restated at grade **NOT-DISPROVED**; ⛔ the published pair **sums to +34 against a
+51 move and was arithmetically impossible**; **the two valid orderings are (+64, −13) and
(+4, +47), with an INTERACTION TERM of −17** — *the interaction is exactly what the old sentence
dropped when it claimed the two orderings "agree to the unit"*; and the "changed NOTHING" framing
restated as **CONSISTENT WITH NOISE AT n=6 — a real shift up to ~+38 was undetectable.**
The §4 disposition row (`+47 the meander re-roll, −13 the epoch/wall work`) carries the same
correction.

### A10 · THE TONE-IQR BAND RE-PINNED TO HF-1 ALONE (§298.2a) — 3 sites in the spec

Re-derived: HF-1 `fill_tone_iqr` median = **17.90**; union (n=71) = **22.00**.

BEFORE (§2.6 register): `| **Per-fill tone jitter (IQR)** | **8.0 – 22.0 – 66.5** (min–max 4.0 – 100.1) | ⚠ MOVED **UP**. …`
AFTER: `**6.1 – 17.9 ≈ 18 – 59.3** (HF-1 alone, n=49)` with ⛔ **the 18 → 22 raise WITHDRAWN —
tone IQR is a COMPONENT of the register index, so pinning it to the index-selected union was
SELECTION ON ITSELF**, and the symmetric rule stated: **an index-COMPONENT axis pins to HF-1 alone,
exactly as an index-UNSCORED axis does.** Grain **2.05** and wash **3.29** explicitly stand.
Two further spec sites that quote `fill_tone_IQR = 8.0 – 22.0 – 66.5` as an operative band for
material/per-face tone work carry the same correction.

---

## §3 · EDIT LOG — laneMFS1-urbanism-atlas.md

### B1 · PAPER WARMTH MOVES TO THE HF-1 DAYLIGHT CENTROID, 36 / `#F8E9D4` (§298.4a) — 8 sites

**Re-derived (CONFIRMED):** HF-1 centroid `#F8E9D4`, warmth **35.88** (daylight, non-lens:
**35.96**), L **235.0**; union centroid warmth **33.21**; HF-1 *median* warmth **37.0**. The mixed
estimator reproduces exactly: **37 was a MEDIAN, 34 was a CENTROID.**

**§2.3.0 preamble (the two paragraphs the sitting named).**
BEFORE:
> `✅ **THE CHAIR'S RULING (§249.4a, and it is the binding figure): PAPER WARMTH PINS AT 37, centroid `#F9E9D5`.**` … `⚠ Where this document still prints **34** below …, read **37 / `#F9E9D5`**`

AFTER:
> `✅ **THE CHAIR'S RULING AS AMENDED (§249.4a + §298.4a ⟦FOLD §297/§298⟧, and it is the binding figure): PAPER WARMTH PINS AT 36 — THE HF-1 DAYLIGHT CENTROID, `#F8E9D4` (L 235.0) — AND THE ESTIMATOR IS NAMED.**`

with the estimator-correction sentence (`the earlier figures MIXED TWO ESTIMATORS — 37 was a MEDIAN
of per-plate warmth, 34 was a CENTROID … computed consistently on the centroid — the estimator this
atlas itself says a renderer reads — the HF-1 daylight figure is 36 / #F8E9D4, which SUPERSEDES
BOTH 37 and 34`), and **both symmetric amendments now stated together**: index-**UNSCORED** axes
(§249.4a) *and* index-**COMPONENT** axes (§298.2a) pin to HF-1 alone. The ⚠ "ONE SENSITIVITY"
paragraph above it is likewise recomputed on one estimator.

**~L937, the counter-argument (the row that argued against its own binding figure).**
BEFORE:
> `✅ **THE TARGET BARELY MOVED — MF-S1's centroid #FBEBD6 measures L237.4 / warmth 37 and the re-pinned one L237.3 / warmth 34, identical within noise.**`

AFTER:
> `✅ ⟦FOLD §297/§298⟧ **THE TARGET MOVED LITTLE, AND THE COMPARISON IS NOW ESTIMATOR-CLEAN.** On the **centroid** estimator throughout: MF-S1's `#FBEBD6` reads L 237.4 / warmth **37**; the union cohort's `#FAEBD8` reads L 237.3 / warmth **34**; the binding **HF-1 daylight** `#F8E9D4` reads L 235.0 / warmth **36**. ⭐ **THE UNION-VS-HF-1 GAP IS ~2 UNITS ON THE CENTROID ESTIMATOR, AND THE PIN IS HF-1's** … ⚠ **The earlier "identical within noise" reading compared a MEDIAN (37) against a CENTROID (34) and used the closeness to endorse the figure the ruling rejects; corrected here.**`

⚠ **The charter's "2.3 units" did not reproduce — see RAISED R-1.**

**Operative rows corrected to `#F8E9D4` / warmth 36:**
1. **§2.3.1 Paper band** — `Target centroid **#FAEBD8** (L **237.3**, warmth R−B **34**)` →
   `Target centroid #F8E9D4 (L 235.0, warmth R−B 36) — the HF-1 DAYLIGHT CENTROID, the estimator
   named`, with the two superseded figures named as superseded
2. **the "must target" instruction** — `it must target #FAEBD8 / warmth ~34.` → `it must target the
   HF-1 daylight CENTROID #F8E9D4 / warmth 36`, plus a `⚠` that the **drift series (37 → 27.5 → 24
   → 23 → 24) is per-round MEDIANS** and must not be read as the pin *(verified: those five figures
   are exactly the per-era medians)*
3. **§2.3.1 ROLE TABLE Paper row** — the row §257(d) named as *"what a renderer actually reads"* —
   now carries `#F8E9D4 / L 235.0 / warmth 36` and says so
4. **§2.6 b6-conformance `Paper hue` row** — target corrected; plus the honest consequence that the
   pin moving 34 → 36 **widens b6's own gap from 5 units to 7** — *the pass is at the cool end and
   getting cooler*
5. **§2.9 correction-ledger `§2.3.1 paper` row** and **6. `§2.3.1 role table` row** — both updated,
   the latter noting explicitly that it carried the superseded number **because §257(d)'s cure was
   applied one level too high, and is corrected AT the row here**

### B2 · THE STAR MARK SPLITS (§298.2d) — 2 sites

Added at **§2.3.0 LAW 2**, immediately where HF-4c's demotion is recorded, a ruled note plus a
four-column table:

| mark | what it is | source | use |
|---|---|---|---|
| **TEACHING mark** | the lane's original ★/★★/★★★ | the round's receipts, `HFM1-star-audit.txt` | **annotation grade only** |
| **REGISTER mark** | the plate's **register-index percentile** | `laneHFM1-corpus-measured.csv`, `register_index`, ranked over the 313 | **the only mark a grading verdict may cite** |

with the law stated (`GRADING CITES THE REGISTER MARK, NEVER THE TEACHING MARK` — any calibration
figure, band re-pin, "best in corpus" call or register-edge judgment citing a ★ is void), the note
that the register mark is **derivable from the CSV today**, and the reconciliation it buys:
*HF-4c's 55-of-78 ★★★ rate and its bottom-of-corpus register percentile are both true — two
different marks, only one of them ever measured.* A one-line pointer added at the banned-priors
list's item 8, which also records the demotion.

### A10-source · THE TONE-IQR RE-PIN AT ITS SOURCE — 3 sites ⚠ JUDGMENT CALL, see R-4

`§2.3.3 #7` (the band itself), the `§2.6` b6-conformance row, and the `§2.9` reversal-ledger row all
re-pinned from `8.0 – 22.0 – 66.5` to `6.1 – 17.9 ≈ 18 – 59.3` (HF-1 alone), the raise marked
**WITHDRAWN / REVERSED**, and the b6 miss restated from **×5.5** to **×4.5** (17.9 / 4.0) with the
conviction explicitly unchanged. §2.3.3 #7 also records that **grain 2.05 and wash 3.29 are not
index components and their union re-pins STAND** — the correction must not travel to them.

---

## §4 · EDIT LOG — THE hf389 RENAME (§298.2e) — **CONFIRMED GREEN**

**Verified before acting** (`ls`): the files were exactly
`map-corpus/plates/hf389-city-metropolis-grain-max.png` (28,181,757 B) and
`map-corpus/previews/prev-hf389-city-metropolis-grain-max.jpg` (338,181 B).

**Renamed** (plain `mv` — no `git mv`, no index mutation):
```
plates/hf389-city-metropolis-grain-max.png        → plates/hf389-city-metropolis-wallshape.png
previews/prev-hf389-city-metropolis-grain-max.jpg → previews/prev-hf389-city-metropolis-wallshape.jpg
```

**Index/key sync — every keyed reference, each verified to occur exactly once before replacement:**

| file | key | change |
|---|---|---|
| `laneHFM1-corpus-measured.csv` | row 313, `stem` | `hf389-city-metropolis-grain-max` → `…-wallshape` |
| `laneHFM1-corpus-measured.json` | `"stem"` | same |
| `MFS3a-frame.json` | `"file"` + `"stem"` | `…grain-max.png` → `…wallshape.png`, stem likewise |
| `laneHF-CALIBRATION.md` | the dedicated index row | stem renamed **and re-roled** (below) |
| `MORPHOLOGY-CONTEXT.md` | `### TRACE 4` header | stem renamed, with an HTML-comment fold note |

⚠ **The CSV keys on BOTH `id` and `stem`** — the charter's "if it keys on plate id only, no CSV
change" test resolved the other way, so the CSV *and* its JSON twin were changed together (the gate
compares them field-by-field; `csv_json_semantic_mismatches: 0` proves they stayed in step).

**`laneHF-CALIBRATION.md` index row — the "index touch" the charter authorized, plus the minimum
truth needed to stop it mis-teaching:** the row's headline moved from `★★★ — THE NEW METROPOLIS
FLAGSHIP` to `★★★ — THE LARGE-SCALE WALL-SHAPE EXEMPLAR`, with the rename recorded, the flagship
claim marked **REFUTED on its own terms** and **`hf103` RESTORED** as the grain/scale flagship
(113.9 vs hf389's 70.2), hf389's genuine ink-darkness win retained, and the ★★★ marked a **TEACHING
mark, not a register mark** (§298.2d). *The row's descriptive body is untouched.*

**Deliberately NOT rewritten — the old string is EVIDENCE, not a path.** Three sites quote
`grain-max` as the *reason for* the rename (`laneHFM1-receipt.md` §3(c) ×2; the atlas's §2.9
reversal row). Rewriting them would falsify the argument. Each instead gained a **rename-executed**
fold note.

**ORDERED GATE RE-RUN — CONFIRMED.** Baseline before the rename: `status: ok`, `TRUE_EXIT=0`.
After:

```
$ cd map-corpus/docs && python3 corpus_integrity.py ; echo TRUE_EXIT=$?
{
  "assets": { "plates": 313, "previews": 313 },
  "calibration": { "atlas_sections": 49, "covered_ids": 313, "dedicated_rows": 264 },
  "context_census": { "excluded_ids": 81, "fields": 52, "rows": 232 },
  "evaluation_roster": { "conservative_exclusion_ids": 91, "ids": 53, … },
  "historical_evidence": { …, "status": "ok" },
  "plan_instruments": { "errors": 0, "rows": 49 },
  "register": { "csv_json_semantic_mismatches": 0, "fields": 47, "rows": 313 },
  "scrub": { "categories": 8, "ids": 34 },
  "status": "ok"
}
TRUE_EXIT=0
```

⭐ **313/313 on both plates and previews, and the gate's own `p_stem == q_stem` check passing is the
proof the plate and its preview twin renamed consistently.** `dedicated_rows: 264` and
`atlas_sections: 49` unchanged prove no CF-1 edit disturbed the calibration-coverage regexes.
**No revert was needed.**

---

## §5 · STRUCTURAL VERIFICATION OF THE EDITS

Every fold marker placed inside a markdown table row was checked against its own table header for
column-count agreement:

```
GENERATION-SPEC.md : 10 edited table rows checked → 10 OK, 0 MISMATCH
atlas              :  7 edited table rows checked →  7 OK, 0 MISMATCH
MISMATCHES: 0
```

The two newly-authored tables (the star-mark split; none in the spec) were inspected in place and
carry proper header + separator rows. No pre-existing fold marker was removed
(`⟦FOLD §` in the spec: 136 → 179 = +43, exactly the count added).

---

## §RAISED · FOUR ITEMS RAISED, NOT DECIDED

### R-1 · ⚠ THE "2.3 UNITS" WARMTH GAP DID NOT REPRODUCE — I WROTE "~2" AND FLAG IT

The charter directs the ~L937 rewording to state *"the union-vs-HF-1 gap is **2.3** units on the
centroid estimator."* Three independent readings of that gap disagree:

| basis | HF-1 | union | gap |
|---|---|---|---|
| the atlas's own published centroids (after this fold) | **36** | **34** | **2.0** |
| re-derived from `laneHFM1-corpus-measured.csv` (mean of per-plate `paper_hex`) | **35.88** | **33.21** | **2.67** |
| daylight (non-lens) subset, same method | **35.96** | **33.22** | **2.73** |
| the charter's figure | — | — | **2.3** |

**Every reading agrees the gap is small and that the pin is HF-1's, so the ruling is unaffected.**
I wrote **"~2 units on the centroid estimator"** — the figure a reader can check against the two
centroids printed in the same paragraph — rather than assert a decimal my own executed evidence
contradicts. ⚠ **Note the related instrument fact:** the atlas's published union centroid
`#FAEBD8` (L 237.3) does **not** reproduce as a plain mean of per-plate `paper_hex` (which gives
`#F7E9D6`, L 235.0), so the atlas's centroid instrument is not that plain mean — yet **the HF-1
centroid reproduces as `#F8E9D4` exactly**, matching §298.4a to the hex. **Chair to confirm the
decimal (2.0 / 2.3 / 2.7) and, if it matters, which centroid instrument is canonical.**

### R-2 · ⚠ hf239's PITCH RATIO — RULED 0.99×, RE-DERIVES AS 1.006×

§298.5e ruled the fourth pair at **0.99×**. Re-derived from `MFS3a-windows.json` plus the spec's own
`cells_across`, hf239 gives **1.006×** (vicus pitch 50.56 → camp 50.86). **Same conclusion — flat,
the founding-mode inversion — 1.6% apart.** I wrote **0.99×** as ruled, and record the
re-derivation here rather than silently substituting my own digit. *The other three pairs reproduce
the ruled 1.33 / 1.38 / 1.44 exactly, which is why this one is worth a line.*

### R-3 · ⚠ THE §240 CEILING TABLE IS NOT IN THIS DOCUMENT — THE WITHDRAWAL STAMP CANNOT REACH IT

The sheet says to *"mark the TABLE withdrawn"* where the spec quotes `village 0 / town 1 / city 2 /
metropolis 3` as binding. **That table does not exist in GENERATION-SPEC.md.** Exhaustive search
found no row carrying those numbers; the spec only *consumes* the caps in prose (S5's carried items,
Appendix B's Q-6, the §2.6 corroboration cell) — all three now stamped withdrawn (A6 above).

⛔ **The table itself lives in `docs/OWNER_DECISION_QUEUE.md` at §240.2 — a path this lane is
forbidden to touch.** **The chair must apply the §297.3b withdrawal stamp to the ODQ's own §240.2
row**, or the reversed table remains binding at its source while every downstream consumer says it
is withdrawn — the exact §257(d) "cure applied at the wrong level" class this fold exists to close.

### R-4 · ⚠ TWO SCOPE CALLS I MADE INSIDE THE FOLD — RECORDED SO THEY CAN BE VETOED

**(a) I corrected the tone-IQR band in the ATLAS as well as the spec.** The sheet lists A10 under
GENERATION-SPEC only, and the atlas's B-list names just B1 and B2. I extended it because
§298.2a's re-pin is document-general and **the atlas is where the band actually lives** (§2.3.3 #7);
correcting the spec's copy while leaving the source at 22 would have reproduced §257(d)'s
one-level-too-high failure *within the fold sent to fix it*. Three atlas sites changed; all are
marked `⟦FOLD §297/§298⟧` and back out cleanly if the chair disagrees.

**(b) I re-roled the `laneHF-CALIBRATION.md` index row's headline**, not merely its filename. The
charter authorized that file "only if the hf389 rename requires an index touch." It did — and the
row's headline (`THE NEW METROPOLIS FLAGSHIP … It supersedes hf100, hf103 and hf104`) is the very
claim §244.5 refuted and §298.2e's rename responds to. Leaving a renamed row still asserting the
refuted claim would have shipped the rename without its reason. **The descriptive body is
untouched;** only the headline and a fold note changed.

### ⚠ TWO STALE `grain-max` REFERENCES REMAIN, BOTH OUTSIDE MY AUTHORIZED FILE SET

| file | line | what it is | why untouched | risk |
|---|---|---|---|---|
| `map-corpus/docs/HFM1-grain2.py` | 71 | `("hf389-city-metropolis-grain-max",.03,.10,.90,.95,"metropolis","")` — a hard-coded window table keyed by **stem** | **code**; the charter says documents only | ⛔ **LIVE** — re-running this instrument will fail to find the plate. Recommend a one-token fix in the chair's commit |
| `map-corpus/docs/HFM1-star-audit.txt` | 81 | `hf389 3★ city-metropolis-grain-max ★★★ — THE NEW METROPOLIS FLAGSHIP` | a **generated audit record** (`.txt`, outside the sheet's `*.md` / CSV / JSON scope); the atlas cites it as *"all 78 rows, titles quoted"* | low — it is a historical record of what HF-4c awarded, and B2's TEACHING-mark split is exactly what makes it safe to leave verbatim. **Chair's call** |

`docs/OWNER_DECISION_QUEUE.md` also contains the old filename (in §298.2e's own order) — forbidden
path, chair's own file.

---

## §6 · WHAT CF-1 DID NOT DO

- **No git command of any kind was run that mutates state.** Read-only `git status` / `git ls-files`
  / `git rev-parse` only — used to produce R-0. Nothing staged, committed, stashed, or checked out.
- **No code file edited.** `HFM1-grain2.py` raised, not touched.
- **No file outside `map-corpus/` edited.** `docs/**` read only.
- **No gate run beyond the ordered `corpus_integrity.py`.** No project test gate, no
  `npm run check*` — the naked-claim / docs ratchet exposure of these `map-corpus/docs/**.md`
  writes is the chair's to measure at the landing (see §7).

## §7 · ONE FORWARD RISK THE CHAIR SHOULD PRICE

This fold adds a substantial number of new **claims** to `map-corpus/docs/**.md`. If the repo's
naked-claim / docs ratchet instruments glob `**/docs/**/*.md` rather than root-`docs/` only, this
batch will move those counters. CF-1 could not measure it without running the gate, which the
charter excludes. **Every added claim is sourced to an ODQ row (§293/§297/§298) in its own text**,
which is the form those instruments want, but the count is unmeasured. *Not incurred is only as
wide as the census that measured it — and no census was run here.*

