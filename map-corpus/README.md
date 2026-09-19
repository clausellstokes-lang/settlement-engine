# THE MAP REFERENCE CORPUS — the frozen north star

**This folder is the canonical, permanent home of the settlement-map reference
corpus (ODQ §243). It supersedes the session scratchpad `map-refs/`, which is
temporary storage and may be deleted by the OS at any time. Every lane, review
and comparison round refers HERE from now on.**

Copied 2026-08-17 from the scratchpad, byte-verified (9,000,292,899 bytes of
plates, source and destination identical).

## Contents

| Path | What it is |
|---|---|
| `plates/` | 313 reference plates, 4K (5056×3392), `hfNNN-*.png`. Numbering follows generation order and has gaps — it is an id, not a count. |
| `previews/` | 313 matching `prev-*.jpg` at 1100px for fast browsing. |
| `docs/laneHF-CALIBRATION.md` | **The index.** One row per plate: what it teaches, its defects, its class. Also the prompt counter-phrases (#1–#35) and the negative/oblique shelves. |
| `docs/laneMFS1-urbanism-atlas.md` | The urbanism + aesthetic study: 26 calibration targets, the measured palette/line/hand bands, the twelve banned priors, the delta tables. The map program's grading sheet. |
| `docs/laneHF2/HF3/HF4-receipt.md` | The three growth rounds: what was minted, what was discarded, spend, and the hazards learned. |
| `docs/laneHFM1-corpus-measured.csv` | Per-plate measured register (paper/ink hex, value range, chroma, grain σ, wash σ, tone IQR, stroke weights, and more) across all 313. |
| `docs/laneHFM1-*.json` | Band-exceedance analysis and the blind-holdout proposal. |
| `docs/MFS1-*.py` | The measurement instruments. ⚠ `MFS1-grain2.py`'s windows are HAND-SET eye-bounds — re-set them per plate/render or the numbers are meaningless. |

## Standing rules

1. **FROZEN (§242).** No further growth rounds; the Higgsfield subscription is
   gone. New references are minted only if a specific law needs a specific
   vocabulary, and never by default.
2. **The corpus teaches DRAWING, never NAMING.** Eight plates carry real-world
   place names or dates in their labels (the scrub list in
   `docs/laneHF4-receipt.md`); they remain valid for geometry and aesthetics,
   are barred from lettering/chrome calibration, and are never shown outside
   the program. Our labels are our own and are TRUE — that is a competitive
   advantage over the references, not a style to copy.
3. **Defects are annotated, not inherited.** Keepers carry defect notes and the
   deliberate NEGATIVE references are labeled as such (e.g. the maximal-
   concentric metropolis). The twelve banned priors live in the atlas §2.4 —
   even spacing of repeated elements is the strongest "generated" tell.
4. **A blind HOLDOUT subset is reserved** — the authoritative 53-plate roster
   lives in `docs/laneMFS1-urbanism-atlas.md` §2.9.4 (era-balanced after the
   §244.6 twelve-swap fix). Holdout plates must never be studied, used to
   derive a calibration figure, or used to tune a wave: they exist so the
   final "indistinguishable from the corpus" claim can be tested against
   references the generator was never calibrated on. The exclusion rule bites
   on counter-phrase and A/B plates only (§244.6 — every plate is now a
   figure-derivation plate, which made the older rule vacuous).
5. **Git-ignored on purpose.** 8.5 GB of assets do not belong in git history,
   and the corpus is internal reference material. The folder's own
   `.gitignore` keeps it out of `git status`; back it up like data, not code.

## Provenance

Generated with the owner's Higgsfield account (Aug 2026) across three rounds
under the unlimited-use grant, then frozen when the subscription ended. Every
plate was individually viewed before filing; discards were not padded to hit
counts. Full spend and reconciliation figures are in the round receipts.
