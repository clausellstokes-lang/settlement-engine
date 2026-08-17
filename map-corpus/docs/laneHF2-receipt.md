# LANE HF-2 RECEIPT — corpus growth round (2026-08-16, ODQ §218)

Owner order: "go absolutely wild in higgsfield references and refine your prompts … best references." Executed against the atlas §2.3 register + §2.4 banned priors as the quality bar. All spend on credits (unlim is NOT supported for nano_banana_pro — the platform refused it; consistent with the original corpus session's "owner-authorized spend" note). 30 images × 4 credits = 120 credits (+2 preflight-only calls at no charge); balance was 1102 before the round. Model honest-label: nano_banana_2, 4K 5056×3392 delivered on every job.

## Per-band before → after

| Band | Before | After | Target | Plates |
|---|---|---|---|---|
| Thorp | n=1 (hf10, under-inked) | **n=7** | ≥5 ✓ | hf85 riverside · hf86 upland · hf87 forest-edge/assart · hf88 crossroads · hf89 coastal-PLAN · hf90 plains-redo (+hf10 kept as the historical weak exemplar) |
| Hamlet | n≈0 clean (hf11 window contaminated by canopy stipple) | **n=6 clean** | ≥5 ✓ | hf91 green · hf92 mill · hf93 street/burgage-precursor · hf94 crossroads · hf95 riverside-bankside · hf96 upland (clean hachure window) |
| Metropolis | n=1 (hf34) | **n=7** (5 clean + hf100 flagged + hf34) | ≥4 ✓ | hf101 port ★ · hf102 sacred · hf103 rings ★★ · hf104 caravan · hf105 ribbon (anti-concentric proof) · hf100 flagged NEGATIVE-REFERENCE (morphology)/positive (grain) |
| §214 iconography | 2 adjacent (hf55 castle, hf36 countryside) | **+7 dedicated** | — | hf110 curtain-zoom · hf111 motte-bailey · hf112 hill-hachure ★★ · hf113 crag-cliff · hf114 forest-canopy · hf115 marsh-reed ★★ · hf116 terrace |
| Opportunistic | — | **+5** | — | hf120 burgage-frontage-zoom ★★ · hf121 demoted-town (decay ladder n=3) · hf122 quay-basin-zoom · hf123 wall-seam OBLIQUE (grammar-only shelf) · hf124 wall-seam-PLAN (the cure) |

Corpus: 49 → **79 files** (30 new files: 29 corpus plates + 1 grammar-only oblique). Every keeper individually viewed (previews at 1100px; native-res center crops additionally inspected for hf100/hf101/hf103 to verify no empty-block LOD defect — none found). 1100px prev-*.jpg written for all 30, matching the existing preview convention (which is 1100px wide, not the 400px the dispatch assumed).

## Prompt-refinement rounds, per target

- **Thorp/hamlet: 1 round, 12/12 kept.** The pre-loaded counter-phrases (anchor-fields-to-roads/streams, no-wall, ink-law, irregular hedgerow trees) all held. The hf10 washout class is cured by the explicit CRITICAL INK LAW block — measured value ranges 203–232L across the band vs hf10's 70L.
- **Metropolis: 2 rounds.** Round 1 (5 plates): grain law held 5/5 (fully resolved fabric, no empty blocks — the feared "big town" failure never appeared as grain failure), but the CONCENTRIC prior broke through as SHAPE on hf100 (maximum: oval + rings + even towers) and hf104 (oval, defensible-ish for a planned caravan city). Round 2 (hf105): the named-growth-axis counter-phrase ("THE CITY IS LONG, NOT ROUND … kinked patched wall, towers clustered/absent") produced a genuinely lopsided ribbon metropolis — the prior is beatable when you name an axis instead of asking for "irregular".
- **Iconography: 2 rounds, 1 failure cured.** Round 1: 6/7 correct-projection keepers; hf123 (wall-seam) came back full oblique — the only hard projection failure of the session (zoomed architectural subject + late-placed projection demand). Round 2 (hf124): leading the prompt with "every roof a FLAT color mass, every tower a plain CIRCLE in plan, no facades" cured it completely. hf123 retained on the oblique/grammar-only shelf beside hf54/hf70 rather than discarded (its five seam stages are all present and labeled).

## Discard rate — honest note

0 outright discards / 30 generated. That is not curation laxity: every plate was measured in-register (paper #F8E7CE–#FFFBEF, ink #010000–#33130B, range 193–234L, chroma 27–55) and individually inspected; defects found were of the recordable-note class (even-spacing, lettering entropy, one over-scaled barn, concentric shells on hf100/hf104/hf121) — the same classes the standing corpus carries on kept plates (hf15, hf42, hf57) — and are recorded per-plate in laneHF-CALIBRATION.md so the calibration study inherits none of them. The two genuine failures of the session were handled by demotion (hf123 → grammar-only) and re-roll (hf124), not by filing weak plates. The refined prompt suite (ink law, grain law, anchored fields, specimen-sheet frame) is simply hitting the register at a much higher rate than the original session's exploratory prompts did.

## Bands NOT filled to ideal, stated plainly

- **None missed target counts.** Residual quality caveats: hf100 and hf104 carry concentric circuits (kept because their grain/machinery teaching is real; hf100 explicitly flagged negative-reference for morphology). hf105's cross-axis grain (~40 cells) is below the 100–130 band — it is a RIBBON city; measure along the axis. A future taste round could add one more organically-lopsided COMPACT metropolis (hf103 is the only fully clean compact one at full strength; hf101/hf102 are clean but water-anchored/symmetric-ish respectively).
- **Numbering note:** hf97–hf99, hf106–hf109, hf117–hf119 deliberately left as gaps (band-grouped decades: 85–96 low tiers, 100–105 metropolis, 110–116 iconography, 120–124 opportunistic). Continue from hf125.

## Standing-hazard notes for successors

- `use_unlim: true` fails for nano_banana_pro ("Unlimited generations aren't supported") — submit with `use_unlim: false`, resolution "4k" (default is 1k, 2 credits; 4k costs 4).
- Reconstructing result URLs by hand is how files get corrupted — one URL was mangled this session; recover job ids/URLs from `show_generations` (or keep the jobs_wait output verbatim) rather than retyping UUIDs.
- Preview convention is 1100px-wide JPG (`prev-<name>.jpg`), quality ~80.
- Measurement scripts must be pure-PIL (no numpy on system python 3.9).
