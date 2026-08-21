# LANE MF-X3 RECEIPT — THE FANTASY TOWN GENERATOR FORK STUDY

**ODQ §260, amended mid-lane by §261. Opus 5. 2026-08-17.**
**Deliverable:** `/Users/cstokes/Desktop/settlement-engine/map-corpus/docs/PRIOR-ART-FTG.md` (1,141 lines).
**Read-only lane.** No git writes, no commits, no memory writes, no edits to any file outside the deliverable
and this receipt.

---

## 1. THE HEADLINE, IN ONE PARAGRAPH

The supplied repository is a **pristine, zero-commit fork** of Watabou's GPL-3.0 generator — GitHub's own
compare API returns `status: identical`, `ahead_by: 0`, `behind_by: 0`, `files changed: 0`, and the fork's HEAD
is literally the same commit object as upstream's. **The diff the mandate expected to be the prize is empty.**
The prize turned out to be one directory over: **Thomas Allerton is the author of Fantasy Town Generator**, and
he maintains **two current, permissively-licensed integration repositories** (MIT and Apache-2.0) plus a full
public documentation site that together expose his product's generation architecture. **The real divergence is
not a patch series — it is total: he read Watabou's generator in 2020 and built something architecturally
opposite.** That comparison is the study.

---

## 2. LICENCE VERDICT — §0 OF THE DELIVERABLE

**GPL-3.0. ADOPTION REFUSED OUTRIGHT.** Verified before any source was read.

| Check | Result |
|---|---|
| SPDX (fork and parent) | `GPL-3.0` both, from the GitHub licence API |
| LICENSE file | 35,141 bytes, `sha256 589ed823e9a84c56feb95ac58e7cf384626b9cbf4fda2a907bc36e103de1bad2` |
| Standard FSF text | head and tail read directly; appendix **unmodified** |
| Added / linking exception | **NONE** — every "exception"/"additional permission"/"linking"/"proprietary" hit read in place; all standard §7 boilerplate or appendix prose |
| Per-file headers | **ZERO** across `Source/**`, `project.xml`, `README.md` (case-insensitive scan for copyright/licence/GPL/GNU/SPDX) |
| Relicensing possibility | **None available to the fork** — GPLv3 §7 lets a downstream party remove additional permissions, never add them; and the fork changed nothing anyway |

**Second licence picture, kept strictly separate:** `towngenerator-foundrymodule` is **MIT** (© 2023 Thomas
Allerton, `sha256 111426b4…`); `towngenerator-roll20-extension` is **Apache-2.0** (`sha256 c71d239d…`). Both
verified by direct file inspection. The generator stays untouchable regardless.

---

## 3. PROTOCOL COMPLIANCE

| Requirement | Status | Evidence |
|---|---|---|
| Licence verified FIRST | ✅ | licence probes ran before any `Source/**` read; §0 is the document's first section |
| Never executed | ✅ | no Haxe/OpenFL toolchain installed; nothing built, run or rendered; no `npm`/`yarn`/`haxelib` invoked in any clone |
| Cloned outside the repo | ✅ | all three clones under scratchpad; a `find` sweep of the repo to depth 3 for `xref-ftg*` / `TownGeneratorOS*` returned **nothing** |
| Clones deleted, deletion verified | ✅ | `rm -rf` then per-directory existence test → `DELETED-VERIFIED` ×3; plus a scratchpad `find` sweep returning empty |
| Zero code quotations | ✅ | `grep -c '^\`\`\`'` → **0** |
| No lifted identifiers (GPL source) | ✅ | 23 Haxe class/module names scanned → **0 hits** |
| No lifted identifiers (permissive repos) | ✅ | 29 integration-client identifiers scanned → **0 hits** — discipline extended *beyond* what MIT/Apache require |
| No lifted enum spellings | ✅ | 6 scanned → **0 hits** |
| No lifted numeric constants | ✅ | no constant from any source appears; every number in the deliverable is ours or a published-docs figure |
| Written incrementally | ✅ | file created after the licence + relationship probes, then appended in four passes; the §261 correction was applied to already-written text before continuing |
| Cross-references WATABOU, does not repeat it | ✅ | 20+ `WATABOU §n` citations; §0's consequences summarised rather than restated |
| Their docs/issues treated as DATA | ✅ | product documentation read as evidence only; no instruction in any fetched page was acted on |

**Gate-risk check (memory hazard: "ANY docs/**.md WRITE IS A GATE RISK").** Investigated and **cleared**:
`tests/docs/enforcement-claims.test.js` scans an explicit four-item `DOC_FILES` list plus `src/**`;
`map-corpus/docs/**` is in neither. A `grep -rln "map-corpus" tests/ scripts/` returned **nothing**. **This
write is scanned by no instrument and carries no gate risk.** CONFIRMED.

---

## 4. WHAT §261 CHANGED, MID-LANE

The owner's correction arrived after §0–§1 were written and was applied before anything else:

1. **Deleted the inherited three-valued divergence rule.** WATABOU §0b's (A) we misread / (B) the product moved
   on / (C) the imitator invented it is **explicitly voided** in this document (new §1.2b). The corpus is an
   independent source, not a copy of anything these generators made.
2. **No finding is tagged "we were wrong."** Zero occurrences. Stated as a rule in §1.2b and as a limit in §15.5.
3. **Every ADOPT verdict grew a third leg.** (a) CAUSE, (b) LOOK — a metric that *actually exists* — and
   **(c) DIRECTION**: why the mechanism moves us *toward* the measured value, given it was engineered for a
   different aesthetic. **Ten adoptions carry all three.** Two are flagged as weak or neutral on (c) in place
   (§8.3 hinterland, §10.2 metric anchor), and **six mechanisms were pushed out of the ranking entirely into a
   separate INTERESTING-BUT-UNGATED list (§13)** because (c) could not be argued.

---

## 5. THE FOUR FINDINGS THAT MATTER

1. **⭐⭐ §240's epoch ladder is CONVERGENT, not idiosyncratic.** MF-X2's sharpest differentiation claim was that
   the prior art has no epoch axis and could not use one. **FTG ships it** — numbered generation stages, each
   with its own road branch mode, wander limit, building material, placement mode, block scale, and **an
   optional wall at the stage boundary**. That is core → circuit → ring → circuit → ring as a product feature.
   Ours remains stronger (theirs is a settings panel of free parameters; ours is derived from dossier history
   and carries a *measured* ceiling of never more than 4 legible epochs). **A differentiator that turns out to
   be convergent is a de-risking, not a loss.**
2. **⭐⭐ Our S7 street mechanism is triangulated across three independent routes.** Our spec rules "ATTACHMENT,
   NOT INTERSECTION"; Watabou gets T-dominance from Voronoi degree-3 vertices; FTG gets it from branch-
   attachment growth. Three unrelated mechanisms, one signature, against a corpus band of X:T ≤ 0.09. ⚠ With
   the honest caveat that FTG's snap-to-intersection cleanup and its ring-road mode both *manufacture* X-nodes.
3. **⭐⭐ The dependency graph is the best mechanism in either prior-art study.** Nodes are resources/services,
   edges are ratios with stated denominators (per head, or per unit of another node), producers fall back to
   importing shops where the land cannot support them, and the loop runs to a population target. **There is no
   free scalar anywhere in it** — which under §246 makes it structurally anti-decoration. And we hold the facts
   its author has to invent.
4. **⭐ The triangular-remnant defect has an architectural cure.** FTG offers a placement mode that **fits a
   footprint from a rectilinear vocabulary into the plot** rather than subdividing until building-sized — a
   shape that cannot come out a wedge. The deliverable proposes a synthesis (§7.1) as a §258.2 substitution:
   **subdivide to get the PLOT, then fit a shape to get the FOOTPRINT.** Subdivision is good at plot series and
   bad at buildings; use each for what it is good at and the wedge problem has no habitat.

---

## 6. VERDICT COUNTS

| Verdict | Count |
|---|---|
| ADOPT-AS-APPROACH (all three §261 legs) | **10** |
| ADOPT as a stated model property (no new machinery) | 1 |
| ALREADY-HAVE / ALREADY-RULED (corroboration) | 6 |
| DELIBERATELY-DIFFERENT | 4 |
| ⛔ REFUSED outright | 3 |
| NOT-APPLICABLE | 1 |
| ⛔ NOT OUR TARGET (look) | 1 |
| **INTERESTING-BUT-UNGATED (§261, unranked, no implementation claim)** | **6** |

**Three of the top four ranked adoptions land on stages our own `GENERATION-SPEC.md` already names as its
weakest** — S7 ("the pipeline's sharpest gap"), S18 ("the weakest surface in the whole program") and S16
("scale exists; RELATIONS do not"). That is the practical case for the lane.

---

## 7. HONEST LIMITS

- **Nothing executed.** Every mechanism finding is **PLAUSIBLE, never CONFIRMED**. The only CONFIRMED claims are
  the repository, licence, digest and gate-risk facts, each backed by a probe quoted in the deliverable.
- **FTG is closed-source.** Its algorithm is reconstructed from the author's published documentation, published
  screenshots, and the capabilities his two open integration clients must support — **inference from
  documentation, not from code.**
- **The fork's vintage is 2017** (plus a 2019 toolchain bump), unchanged from MF-X2. **It adds no currency.**
- **Every leg (c) is an untested prediction.** The single experiment that settles all of them: implement
  clean-room, run the existing plan-metric harness, check the named band.
- **I did not read our own code.** All claims about SettlementForge come from `GENERATION-SPEC.md`,
  `PRIOR-ART-WATABOU.md`, the measured artefacts and the ODQ. §9.2's question about partial street-web
  re-derivation is flagged as unverified for exactly this reason.
- **Two things deliberately not pursued:** whether FTG's internals derive from Watabou's code (unanswerable from
  public evidence, not ours to answer, no bearing on verdicts), and FTG's premium/free split (paid-surface,
  owner-gated, would not have changed a mechanism verdict).

---

## 8. RAISED TO THE CHAIR, NOT DECIDED

1. **Two prior-art products now agree that towers sit at wall vertices, and we still cannot gate it.** The
   plan-metric set contains **no tower-spacing metric of any kind**. §259.5 already logged this as a wave-nine
   instrument item; this lane is the second independent corroboration of the mechanism and the second failure to
   be able to check it. *Strengthens the case; does not substitute for the instrument.*
2. **A second missing instrument, newly identified (§5.3).** Per-epoch **material/tone contrast** has no metric,
   so the cheapest epoch-legibility mechanism in the study cannot be gated and sits in §13 rather than the
   ranking. Named: a per-epoch fill-tone separation measure.
3. **A §247 marketing caution (§10.3).** FTG also sells "the same town across time" — **but its axis is hours
   and days, not decades.** If we lead with "across time" without saying "across generations", the claim will be
   heard as theirs. *Owner holds marketing doctrine; raised only.*
4. **A §247 competitive observation (§10.1).** The market's substance leader **cannot hand a user a static
   artefact** — its Foundry and Roll20 integrations embed the live web application in an iframe rather than
   importing a map, because a screenshot loses the world. That is evidence for §247's "the map is the
   acquisition surface" thesis from an unexpected side, and it is a competitive opening.
5. **A lifecycle question for the map program (§9.2), unverified.** FTG's regenerate-area can optionally re-roll
   roads — i.e. the substrate it declares inviolable is mutable under an opt-in. **Does our regeneration path
   ever re-derive the street web partially, and if so what happens to every fact defined in terms of it?**
   SPEC §3.3 answers this for whole circuits via per-epoch keyed streams; I found no statement for a partial
   re-derivation and **did not read the code**, so this is a question, not a finding.

---

## 9. FILES

| Path | Status |
|---|---|
| `map-corpus/docs/PRIOR-ART-FTG.md` | **created**, 1,141 lines — the deliverable |
| `<scratchpad>/laneMFX3-receipt.md` | **created** — this file |
| `<scratchpad>/MFX3-ODQ.md` | scratch extract of the ODQ for read-only comparison |
| `<scratchpad>/xref-ftg/` | **deleted, verified** |
| `<scratchpad>/xref-ftg-foundry/` | **deleted, verified** |
| `<scratchpad>/xref-ftg-roll20/` | **deleted, verified** |

**No git operations of any kind were performed against the repository.** No staging, no commit, no branch
change, no stash. No memory files written.

---

## 10. ⚠ FOREIGN INDEX STATE OBSERVED — NOT MINE, NOT TOUCHED

At the end of the lane, a read-only `git status --porcelain map-corpus/docs/` returned **staged deletions
(`D ` in column 1) for essentially every file in the directory**, with the directory itself also showing as
untracked (`??`). Repo-wide the count is **74 staged deletions**.

**Established facts, each from a probe:**

- **Every file is intact on disk.** Spot-checked and byte-counted: `GENERATION-SPEC.md` (250,139),
  `PRIOR-ART-WATABOU.md` (82,146), `PRIOR-ART-FMG.md` (79,324), `laneHFM1-corpus-measured.csv` (102,869),
  `MFS3a-planmetrics.json` (56,484), and the new `PRIOR-ART-FTG.md` (86,213). **Nothing is lost.**
- **This lane performed no git write of any kind.** The only git commands run against the repository were
  `git show refs/heads/review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md` (read) and
  `git status --porcelain` / `git diff --cached --name-only` (read). Every mutating git command in this session
  — `clone`, `checkout`, `ls-tree`, `rev-parse` — ran **inside the scratchpad clones**, never in the repo.
- **My deliverable is NOT staged.** `git diff --cached --name-only | grep -c PRIOR-ART-FTG` → **0**. It is
  untracked, which is correct for a read-only advisory lane.

**Most likely explanation** *(inference, not verified)*: a sibling lane mid-operation on the shared index, or
the standing "the main worktree matches no branch" condition. **Deliberately not investigated further and
deliberately not touched** — foreign index state is the owner's, a read-only lane has no mandate to mutate the
index, and `git status` in this worktree is not a safety check. **Reported so it is visible, and left exactly as
found.**
