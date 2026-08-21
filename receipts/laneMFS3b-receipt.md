# LANE MF-S3b RECEIPT — THE CONTEXT-STRUCTURE COMPENDIUM
### ODQ §245 (study the urban planning) as sharpened mid-lane by §246 (the reconstruction test). 2026-08-17. Opus 5.
### Advisory, read-only lane. No git commands were run. No memory writes were made.

---

## 1 · WHAT WAS DELIVERED

| artifact | path | size |
|---|---|---|
| The compendium | `/Users/cstokes/Desktop/settlement-engine/map-corpus/docs/MORPHOLOGY-CONTEXT.md` | 159,586 bytes |
| The instrument | `/Users/cstokes/Desktop/settlement-engine/map-corpus/docs/MFS3B-context-census.py` | 17,057 bytes |
| Its output | `/Users/cstokes/Desktop/settlement-engine/map-corpus/docs/MFS3B-context-census.csv` | 232 data rows + header |
| This receipt | scratchpad root, `laneMFS3b-receipt.md` | — |

The instrument is saved beside the doc per the brief's discipline clause. Nothing else was
written or edited anywhere.

---

## 2 · ⛔ THE HOLDOUT EXCLUSION — the count, and how it was computed

`docs/laneHFM1-holdout-proposal.json` was read and the **UNION** of three lists taken, per
the brief and §244.6 (the 12-swap fix is the adopted set):

| set | n |
|---|---|
| `proposed` | 53 |
| `minimal_swap.proposed` | 53 |
| `minimal_swap.added` | 12 |
| **UNION — EXCLUDED, never opened** | **81** |
| corpus on disk | 313 |
| **ELIGIBLE** | **232** |

The union exceeds either list because the swap replaced twelve members without the lists
being nested; excluding only one list would have leaked adopted-holdout plates into the
study. The exclusion is enforced in code (`holdout_union()`), not by hand.

**The 81 excluded ids:**
hf4 hf5 hf12 hf21 hf22 hf27 hf31 hf32 hf41 hf42 hf56 hf59 hf61 hf73 hf87 hf92 hf94 hf102
hf103 hf105 hf120 hf122 hf125 hf127 hf129 hf132 hf143 hf156 hf168 hf172 hf176 hf180 hf183
hf191 hf192 hf200 hf221 hf223 hf230 hf232 hf233 hf234 hf237 hf240 hf242 hf246 hf258 hf259
hf265 hf266 hf267 hf269 hf272 hf273 hf275 hf281 hf282 hf288 hf289 hf290 hf294 hf301 hf311
hf312 hf326 hf333 hf334 hf335 hf336 hf339 hf344 hf345 hf346 hf349 hf354 hf355 hf365 hf367
hf371 hf382 hf384

**The cost is stated in the compendium (§0.1), not hidden.** The holdout took the single
best plate for several of my sections — hf267 (extramural institution ring), hf311 (gate
suburb zoom), hf345 (bailey interior), hf344 (churchyard geography), hf346 (head of
navigation), hf371 (grain catchment), hf365 (walls decaying into property), hf326, hf335,
hf336, hf349, hf354, hf312, hf301. Findings resting on those are marked **[E-index]** and
were never promoted to [M-view].

**Scrub list:** 34 of the 232 eligible carry a text contamination. They are used for
geometry throughout and **cited for no lettering, naming or chrome observation anywhere in
the compendium.** The set is enumerated in the instrument (`SCRUB`).

---

## 3 · SAMPLE SIZES AND COMPOSITION

### 3.1 · [M-view] — plates I actually opened: **n = 12** (5.2% of eligible)

`hf62` bankside town · `hf318` unequal circuit (town) · `hf372` unequal circuit under siege ·
`hf385` three circuits · `hf389` metropolis · `hf373` contour hill town · `hf368` city water
works · `hf327` mud-brick river-and-caravan city · `hf332` shore ribbon town · `hf146` marsh
levels · `hf276` unbridged gorge · `hf381` the country's ways.

All viewed at 1100 px preview. **Deliberately biased** toward walled and water-bearing
settlements and toward setting diversity — that is what the brief is about. **It is not a
random sample and no share is projected from it to the corpus.** Every [M-view] figure in
the compendium states its n inline.

### 3.2 · [M-index] — the census: **n = 232 eligible**, of which **138 settlement-role**

Role split (computed, printed on every run): SETTLEMENT 138 · SUBSTRATE 39 · SPECIMEN 22 ·
ZOOM 15 · LENS 10 · UNDER 8. Morphology shares are taken over the 138.

### 3.3 · Sources read in full

`laneHF-CALIBRATION.md` (all 396 lines / ~84k tokens, every per-plate row) ·
`laneMFS1-urbanism-atlas.md` PART 2 §2.1–§2.8 in full and PART 1 via the instrument ·
`laneHF4-receipt.md` §6–§10 · `laneHFM1-holdout-proposal.json` ·
`laneHFM1-corpus-measured.csv` header + category columns · `README.md` ·
ODQ §200–§205, §214, §232, §239–§246 read from
`refs/heads/review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md` (read-only `git show`).

---

## 4 · THE INSTRUMENT — what it measures, and the three honesty bounds

`MFS3B-context-census.py` parses **two** description sources into one record per plate —
`laneHF-CALIBRATION.md` bullet rows (hf85→) and `laneMFS1-urbanism-atlas.md` PART 1 prose
blocks (hf3–hf84) — then counts 49 context features by regex across seven families.

**Coverage: 232 of 232 eligible plates described, zero gaps.** (The first draft parsed only
the calibration index and left 35 HF-1-era plates at zero on every feature, which would have
silently deflated every share. The second source was added for exactly that reason and the
run prints the gap count so a regression is visible.)

Three bounds, restated in the compendium §0.4 and binding on every figure:

1. **It measures PROSE, not pixels** — how often a feature was worth writing down. Every
   share is a **lower bound**. Figures are tagged `[M-index]` and never presented as pixel
   measurements.
2. **⚠ Description-length confound, MEASURED and printed:** atlas-sourced blocks run median
   **1,917 chars** (n=35), index-sourced rows median **508** (n=197) — a 3.8× verbosity gap
   that tracks the description's ERA. **No comparison between HF-1-era plates and later
   rounds is made anywhere in the compendium.**
3. **It systematically under-reports the obvious.** Sharpest instance, recorded because it
   nearly misled me: the census finds an explicit "towers absent on this flank" statement on
   **7 of 138 (5.1%)**, while **6 of the 7 walled plates I opened show exactly that
   asymmetry**. Rule adopted and stated: **a census share may falsify an "always" claim but
   may never establish a "rarely" one.**

**Re-runnable:** `python3 MFS3B-context-census.py [--csv out.csv]` from `map-corpus/docs/`.
Final verification run: **exit 0**, 232/232 described, CSV 233 lines. ⚠ MF-S2 is editing the
atlas concurrently; the parser reads whatever is on disk and prints its n, so a changed atlas
changes the reported denominator rather than silently changing a share.

---

## 5 · EPISTEMIC LABELS — what is CONFIRMED and what is PLAUSIBLE

### CONFIRMED (executed evidence in this lane)

- **The exclusion arithmetic.** 313 on disk, 81 in the union, 232 eligible — computed in
  code, printed, and re-verified on the final run.
- **Census coverage and all incidence figures**, at the stated bound. Exit 0, reproducible.
- **The description-length confound figures** (1,917 vs 508 median chars).
- **Our derivation vocabulary, read from source not memory:** `config.terrainType` is
  **seven tokens** (`src/components/gallery/galleryUtils.js`); `tradeRouteAccess` is five;
  `WATER_TERRAIN = {coastal, riverside}` (`src/generators/terrainHelpers.js`); walls exist
  as institutions with a `hasWalls` boolean (`src/generators/defenseGenerator.js`); the
  dossier field set (`src/domain/settlement.schema.js`). **This is the load-bearing fact
  behind §7's NOT-DERIVABLE verdicts and it was verified, not recalled.**
- **[M-view] tower asymmetry: 6 of 7 walled plates opened show towers absent on at least one
  flank, and in all six the bare flank is the terrain-defended one.**
- **[M-view] the §239.2 calibration: 7 of 7 walled plates opened have a wall-side street on
  SOME runs; 0 of 7 have one on EVERY run.**
- **[M-view] hf389 carries four markets, each at a different logistics terminal** (central
  spine / bridgehead / quay / edge gate).
- **[M-view] hf385's three circuits are non-concentric with a migrating centre of gravity.**

### PLAUSIBLE (reasoning from descriptions, or from a sample too small to generalise)

- The **extramural distance ladder** (§4.3, bands 0–6). Composited from six plates, **two of
  which (hf267, hf311) are holdout-excluded and were read only in the index.** The ordering
  is well-attested; the band boundaries are mine. *Experiment that would settle it: open
  hf267 and hf311 after the holdout test is spent, and measure gate-relative distances.*
- The **nine-way run taxonomy** (§3.1). Four plates opened, all four enumerated-cure plates.
  The types are read off labels the model was prompted to produce, so the taxonomy is partly
  a mirror of the prompt. *It is nonetheless the right engineering shape, because the causes
  it names are the causes our facts supply.* **Flagged as the one place where corpus
  evidence and prompt design are entangled.**
- The **three morphotype drivers** (material / water scarcity / mobility, §7.2). A reduction
  of a 20-row catalogue; defensible and unproven.
- Every **gate-count-by-tier** figure (§3.3): n = 7, [M-view], stated as such.

---

## 6 · THE HEADLINE FINDINGS (the compendium is the detail)

1. ⭐⭐ **A settlement sits at a SCARCITY, and the corpus draws the scarcity larger than the
   settlement.** 11 of 12 plates opened; in 9 the scarce thing dominates the frame.
2. ⭐⭐ **The circuit is a chain of TYPED RUNS, each with a cause** — nine types, every one
   derivable from facts we hold. This is the engineering translation of the corpus's own
   hardest-won prompt result (§242.2's enumeration cure at n=6).
3. ⭐⭐ **Water needs a second axis: EDGE / SPINE / OBSTACLE.** The mode (§5.0b) does not
   determine the morphology; the water's economic ROLE does, and the three produce opposite
   plans from the same "BANKSIDE" label.
4. ⭐⭐ **Material drives footprint grammar**, and §17.1/§17.4 encode the euro-temperate
   grammar as though it were the only one. **The setting-agnostic promise is structurally
   unmet, not cosmetically.**
5. ⭐ **Institutions have scale (§161n) and no RELATIONS.** The negative rules — never upwind,
   never above the clean take, never on a through route, never adjacent to a dwelling — are
   the cheap half and carry most of the realism.
6. ⭐ **The extramural world is an ordered ladder of six distance bands**, and the noxious
   trades occupy **one arc, not a ring**.
7. ⭐ **Superseded things fossilise rather than vanish** — the dead wall becomes a curving
   lane, a property line, a garden strip on the filled ditch, a dovecote tower. **This is
   §240's biggest unclaimed dividend and it makes a town look old without drawing a ruin.**
8. ⭐ **Ten dimensions nobody named** (§8): process ground · the catchment as the map's
   subject · surface texture as tenure · access cost as an organiser · obligation geography ·
   relocation as a first-class state · second/seasonal networks · microclimate siting · the
   unbuilt · custodian dwellings.
9. ⭐⭐ **The §246 answer in one line:** we would produce a plausible settlement with an
   implausible relationship to its world, and **almost none of the fix is a new rendering
   capability — it is four dossier fields (`supplyChains`, `neighbors`, `institutions`,
   `resources`) that the map today reads for labels and never for geometry.**

---

## 7 · THE RANKED GAP LIST (compendium §11.2 — headline only)

23 rows, each COVERED / PARTIAL / GAP with a named law or a mechanism sketch. Top eight:

| rank | item | verdict |
|---|---|---|
| 1 | Terrain substrate (gradient, aspect, land-form, buildable mask) | **GAP** — §214 depends on it |
| 2 | The circuit as an enumerated chain of typed runs | **PARTIAL** vs §205.3 / §161m / §240 |
| 3 | The region as a generation input | **GAP** |
| 4 | Footprint grammar by material | **GAP** — §17.1/§17.4 encode one grammar |
| 5 | Institution siting relations, especially the negative rules | **GAP** — §161n gives size only |
| 6 | Flow-ordered water chains + the domestic water ladder | **GAP** — §205.1 covers the channel only |
| 7 | The extramural distance ladder | **PARTIAL** vs §161c / §18.2 |
| 8 | The fossil ladder + relocation events | **GAP** — §240.3 lists other dividends |

### ⚠ Two findings that COMPLICATE a ruled law — surfaced now because late discovery costs a wave

1. **§200's wall-clearance census will red on correct output** once §239.2 lands, unless its
   exemption is keyed to **RUN TYPE**. Atlas T-22 already warned that inner-face abutment is
   normal in military compounds; my evidence widens that to *any run built along existing
   property*. §200.2's wording ("lawful only as an explicitly-derived variant") is
   compatible — **the derivation is the run type**, and saying so now is cheap.
2. **§240 and the run-chain are ONE piece of work.** §240 derives ring count correctly, but
   three rings derived without run typing come out concentric — the exact prior the corpus
   spent three growth rounds and eleven deformed plates failing to beat. **Landing §240
   first means shipping the corpus's worst defect and then removing it, which is a declared
   one-time shift paid twice.**

### Calibration of the ruled-but-not-built laws (compendium §11.1)

**§205.2** confirmed and extended (needs the role axis or it changes a width and nothing
else) · **§205.3** confirmed strongly, with an implementation-shape warning · **§214**
confirmed on drawing rules but ⛔ **BLOCKED: its terrain arm has no relief field to consume,
and I found that dependency recorded nowhere** · **§239.1** confirmed, add nothing ·
**§239.2** confirmed with the exception clause sharpened into a per-run derivation ·
**§239.3/§240** confirmed, plus two dividends the law does not list · **the underground
stratum** — the two-layer ghost idiom generalises to any non-fabric SYSTEM (#33), and carries
the ring prior into a new habitat (galleries must chase something, never radiate).

---

## 8 · JUDGMENT CALLS MADE IN THIS LANE

- **JUDGMENT: I recommended composite `terrainModifiers` over a widened terrain enum
  (CX-36), because a widened enum breaks the seven-token facet vocabulary the gallery and
  the server list RPC filter on (migration 063/071 alignment is noted in `galleryUtils.js`).
  Say "veto" to flip it.** ⛔ Recorded as **OWNER-GATED and NOT decided** — persistence shape
  is on judgment-ledger §3's list. It is filed as a proposal in §11.2 row 23.
- **JUDGMENT: I did not propose inventing a wind/sun bearing**, though it is the most
  frequently drawn siting logic in the corpus. A bearing invented at generation time is a new
  **world fact**, which under THE PROMISE is a seed-permanent commitment. Filed in §12 as
  owner-gated inspiration rather than as a mechanism. Say "veto" to have me propose it.
- **JUDGMENT: I labelled the census `[M-index]` throughout rather than `[M]`,** and adopted
  the rule that a census share may falsify an "always" but never establish a "rarely" — after
  the tower-asymmetry case showed the prose census under-reporting a fact present on 6 of 7
  viewed plates by a factor of ten.
- **JUDGMENT: I traced 8 plates rather than 10**, choosing to trace only plates I had opened
  so that every trace rests on [M-view] rather than on someone else's description. Two more
  traces from index-only plates were available and were declined on that ground.
- **JUDGMENT: I flagged the run taxonomy's entanglement** (the run labels exist because the
  prompt asked for enumerated runs) rather than presenting it as an unprompted observation.

---

## 9 · DEFERRED, DOCUMENTED — not bugs to re-find

1. **No pixel measurement of context features.** Would need per-plate hand-set windows — the
   hazard `MFS1-grain2.py`'s own header names. **Deliberately deferred, not skipped.** The
   one measurement worth doing later: gate-relative distances for the §4.3 band ladder, once
   the holdout test is spent and hf267/hf311 are readable.
2. **220 of 232 eligible plates were not opened.** The compendium's [M-view] claims are all
   n≤12 and say so.
3. **No reconciliation with MF-S3a.** Overlaps flagged in place (market as void vs terminal;
   the wedge block; the migrating centre; growth sequence). MF-SPEC is the synthesis point
   per §245.3.
4. **The atlas's T-10…T-24 tallies were not re-derived** and none of its figures is quoted as
   authoritative, because MF-S2 is amending it concurrently.
5. **Nothing was implemented and nothing was decided.** All 45 CX mechanisms are proposals.

---

## 10 · BRIEF COMPLIANCE

| requirement | status |
|---|---|
| Exclude the blind holdout (union incl. the 12-swap fix); state the count | ✔ **81 excluded, 232 eligible**, enforced in code |
| Exclude the 8-plate scrub list from lettering/naming observations only | ✔ 34 eligible plates flagged; zero lettering observations cite them |
| Write only `map-corpus/docs/MORPHOLOGY-CONTEXT.md` + this receipt (instruments beside the doc) | ✔ |
| Cite canonical `map-corpus/` paths, never the scratchpad mirror | ✔ |
| Cover the owner's 7 items + "anything else the plates teach" | ✔ §1–§7 + **§8's ten unnamed dimensions** |
| Every finding as a derivable rule; no-home findings filed separately | ✔ 45 CX rows with derivation homes; **§12 holds the 7 not-derivable** |
| [M] vs [E] per claim | ✔ three tiers, `[M-view]` / `[M-index]` / `[E]`, each with its n |
| Sample sizes and composition stated honestly | ✔ §0.3, §0.4, §3 above |
| Instruments saved beside the doc | ✔ `MFS3B-context-census.py` + `.csv` |
| §246 RECONSTRUCTION FORM on every finding (mechanism / derivation home / verdict) | ✔ all 45 |
| §246 RECONSTRUCTION TRACES, 6–10 plates, divergence ranked by breadth | ✔ **8 traces**, ranked ledger of **14 divergences** in §10 |
| Particular attention to §205 ×2, §214, §239, §240, the underground stratum | ✔ §11.1, one row each with confirm/sharpen/complicate |
| Gap analysis vs §150–§245, COVERED/PARTIAL/GAP, ranked by leverage | ✔ §11.2, 23 rows |
| Register-and-kind calibration, never pixel identity | ✔ stated in the header and applied in every trace |
| No git commands, no memory writes | ✔ neither was run |

---

**MF-S3b ends here.** The compendium stands alone; this receipt exists so the chair can check
the sample, the exclusions and the labels without reading it.
