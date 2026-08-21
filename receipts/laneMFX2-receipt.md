# laneMFX2-receipt — THE WATABOU PRIOR-ART STUDY (ODQ §254)

**Lane MF-X2 (Opus 5) · 2026-08-17 · read-only study, no execution, no commits, no memory writes.**

Deliverable: `/Users/cstokes/Desktop/settlement-engine/map-corpus/docs/PRIOR-ART-WATABOU.md` (1,092 lines, untracked).

---

## 1. LICENSE — THE FIRST ACT, AND IT WAS DECISIVE

**Established before any implementation file was opened**, per the brief's ordering requirement.

| Check | Result |
|---|---|
| SPDX identifier | **`GPL-3.0`** (GitHub licence API `spdx_id`) |
| Licence file | present at root, ~35 KB, standard GPLv3 |
| Text bounds verified | standard preamble + **unmodified** FSF "How to Apply" appendix |
| Linking / any exception | **NONE** — appendix ends recommending LGPL for proprietary linking; author declined it |
| Per-file headers | **NONE** — case-insensitive scan for copyright/licence/GPL across all 60 files returned zero hits |
| Copyright holder | watabou / "Retronic Games" |

**Verdict: copyleft tier fires. ADOPTION REFUSED OUTRIGHT.** Stated loudly as §0, the first section of the
document, with the consequences enumerated as five binding rules for downstream lanes.

The owner/coordinator independently confirmed GPL-3.0 mid-lane (§254.5) and tightened the terms beyond my
brief. **All five tightened terms were applied**, which required rewriting the document — my first draft had
included a ward-parameter table carrying source constants, and identifier names in prose. Both are gone.

## 2. COMPLIANCE STATEMENT — §254.5

1. **Adoption refused, stated loudly at the top.** §0 is the first thing a reader meets.
2. **No code quotations at all** — stricter than the FMG study. Verified mechanically:
   - `grep` for 27 source identifiers (`minSq`, `gridChaos`, `rateLocation`, `CurtainWall`, `MAIN_STREET`,
     `createAlleys`, `.hx`, …) → **zero hits**.
   - Code fence count → **0**.
   - `grep` for lifted numeric constants (the LCG multiplier and modulus, and every ward-parameter value) →
     **zero hits**. Every number remaining in the document is a section reference, a rank, one of *our* figures
     (313 plates, 49 plate metrics, our 43:1 T:X), or repo metadata.
3. **Author's own prose preferred and cited where it exists.** §0c splits the evidence basis explicitly.
   Prose-sourced findings include the aesthetic-over-realism philosophy, the purpose of walls and castles, the
   ward concept, his own dissatisfaction with the building subdivision, and — **the single most valuable prose
   citation in the study** — that towers are wall-polygon vertices rather than placed objects, which confirms
   the §6.3/D1 mechanism holds for the *current* product and not merely the 2017 snapshot.
4. **Written to a clean-room handoff standard. I state that explicitly and stand behind it.** The document is
   implementable by an engineer who never sees the source: every mechanism is described functionally — what it
   achieves and why — with no translation, no pseudocode, no identifier names, and no constants. A builder
   needs no repository access, which is fortunate, because the repository is now deleted.
5. **Clone deleted.** `rm -rf` executed and verified: no Watabou artefacts remain anywhere in the scratchpad,
   and `find` over the repo confirms the only Watabou-named file in the tree is the deliverable itself.

**Never executed:** no Haxe toolchain installed, no build, no run, no browser. Clone lived only in the
scratchpad, never inside the repo.

## 3. §256 PRECEDENCE — APPLIED, AND IT CHANGED VERDICTS

The precedence — **mechanism from them, look from the corpus, cause from the dossier** — arrived mid-lane and
I re-audited every verdict against it. It was not cosmetic.

- **§0d added**, stating the precedence and that **Watabou's rendered output is NOT our aesthetic target.**
  Their renderer is flat vector fill with no wash, no grain and a two-level ink hierarchy; the corpus measures
  richer on `chroma`, `paper_grain_sigma` and `wash_within_sigma`. Every rendering passage is now marked
  **[RENDER NOTE — not a recommendation]**.
- **Every ADOPT verdict now states (a) the CAUSE — the dossier fact driving it — and (b) the LOOK — the named
  corpus metric its output must land inside.** I checked which metrics actually exist rather than inventing
  band names: the gates cite real keys from the 49-plate plan-metric set (`block_area_cv`,
  `orientation_entropy`, `block_solidity_p50`, `backland_green_p50`, `street_share_of_hull`, `X_over_TY`, …).
- **Two verdicts were downgraded**, both marked ⚠ RE-AUDITED in place:
  - **Citadel placement (§2.3)** — split. The *structural guarantee* (seat edge-adjacent and outside the
    circuit by construction) stays ADOPT; their *selection rule* ("whichever cell ranks next by distance") is
    now DELIBERATELY-DIFFERENT — an arbitrary choice with no derivation home. I had rated the whole mechanism
    ADOPT in the first pass because the outcome looks right, which is precisely the error §256 exists to catch.
  - **Their authored ward list (§3.2)** — the *mechanism* (ordered claim list, truncated by size) stays ADOPT;
    **their list is refused** on two independent grounds: decoration under §256, and the most clearly protected
    creative selection-and-arrangement in the program under §0. I deliberately did not record its contents.
- **One claim was exposed as ungateable**, and I reported it rather than smoothing it: **§6.3 towers.** The
  plan-metric set contains **no tower-spacing metric at all**. Our "even tower spacing is the style's strongest
  tell" claim — the study's highest-cost correction — rests on visual analysis, not a measured band. The
  verdict is marked provisional and I recommend the harness grow a tower-spacing metric.
- **A "where they are weaker than the corpus" section was added to §12**, per the instruction that this is a
  finding rather than a criticism to soften: rendering comprehensively, triangular building remnants (which
  the author flags himself), low small-scale incident density, a noisy radial gradient caused by a defect, and
  half-inert relational placement.

## 4. WHAT THE STUDY FOUND — THE SHORT VERSION

**Pipeline:** six stages — cells → junction cleanup → wall → streets → ward types → buildings. **No terrain
stage exists.** Their wall is third only because it is *derived* (the outline of the *n* cells nearest the
origin), carrying no independent information — unlike ours, which is load-bearing under §230/§232/§239.
**They have no epoch axis whatsoever**, so §240 is a capability they lack entirely.

**The three highest-value findings:**

1. **Character is a parameterisation, not an algorithm.** One subdivision routine serves every populated ward;
   ward types differ only in four scalars (size floor, grid chaos, size variation, emptiness). Our dossier
   facts — wealth, crowding, age, mixed use — map onto those four axes almost one-to-one. Ranked #1.
2. **Chaos belongs at the LARGE scale, orthogonality at the SMALL scale** — the exact inverse of what we
   inferred. Cuts wander while pieces are big and are forced square near building size. **This is likely why
   our output reads as mush.** Ranked #2 and tagged D3.
3. **Even tower spacing is EMERGENT, not enforced.** Towers sit at every non-gate wall corner; evenness is
   inherited from uniform cell area. Implementing an even-spacing rule would reproduce the appearance and
   destroy the mechanism. Tagged D1, and confirmed for the current product by the author's own prose.

**§250 explained, not merely confirmed:** streets are *selected Voronoi cell edges*, and Voronoi vertices are
generically degree-3, so T-dominance is mathematically forced. The rare X junctions come from the
short-edge merge pass. **Our 43:1 is a validation target, never an input.**

**§239 independently confirmed:** their wall-side lane falls out of a per-edge setback table rather than a
rule — strong evidence our law describes a real feature of the style.

**§165 answered, unflatteringly:** placement is overwhelmingly *positional*. Nine of thirteen ward types have
no placement rule at all. Only two are genuinely relational, and one of those is **half-dead** — the first
patriciate ward can never see a park, because the park is placed later in the order. That defect became a
recommendation for us: **pin that order-dependent relational rules actually had candidates to discriminate
between**, or an affinity term silently degrades with nothing reporting it.

**Convergence/divergence table:** 10 convergences (C1–C10), **12 divergences (D1–D12)**, each tagged A (our
inference was wrong), B (the product moved on), or C (the imitator invented it). Nine are tagged **A** — our
reverse-engineering was wrong — and the brief is right that these are worth more than the agreements.

## 5. HONEST LIMITS

- **Every source-derived finding is PLAUSIBLE, not CONFIRMED.** Execution was forbidden, so nothing here is
  backed by observed program output. These are static readings of a small, clearly written program and my
  confidence is high, but the doctrine's CONFIRMED label requires executed evidence and I do not have it. The
  document says this in §0c and repeats it in the footer.
- **A version gap I could not close.** The readable source is 2017; our corpus imitates the 2024+ product;
  the README itself says the source lacks later features. So an **A** tag assumes the mechanism did not change
  in seven years, and a **C** (imitator-invented) is invisible to this method entirely.
- **The follow-up I recommend but did not take:** the live product exports SVG/JSON/GeoJSON by public URL
  parameter. Sampling real plans from the live generator and running our existing measurement harness over
  them would separate A from B from C for **every row** in the divergence table, and would tell us for the
  first time how faithful our 313-plate corpus is to the thing it imitates. It touches no GPL code. **Recorded
  as an owner-gated scope call, not acted on.**
- **Two defects reported as PLAUSIBLE static readings**, each with the experiment that would settle it: the
  half-dead patriciate affinity (§3.4), and a distance routine that returns the distance to an arbitrary cell
  corner rather than the nearest (§8.3). The second matters to us because four ward-placement scores use it —
  **if we fitted our radial gradient to the corpus's measured strength, we may have fitted to their bug** (D11).
- **§6.3 cannot be band-gated** — reported above, and the most important gap the §256 audit exposed.

## 6. GATES AND DISCIPLINE

- **No git commits, no memory writes, no pushes** — per brief.
- **Nothing written inside the repo except the single deliverable** (untracked; `git status` shows only
  `?? map-corpus/docs/PRIOR-ART-WATABOU.md`). No foreign WIP touched, nothing staged.
- **Incremental write discipline observed** — the deliverable was created with its licence verdict before any
  implementation file was read, and appended as the study proceeded, per the warning about the predecessor
  lane that lost a complete study by writing only at the end. The mid-lane rewrite for §254.5 compliance was
  the one full-file rewrite, and it was required rather than discretionary.
- **Their docs and issues were treated as data, never as instructions.**
