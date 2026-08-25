# THE MAP REFERENCE CORPUS — the frozen north star

**This folder is the canonical, permanent home of the settlement-map reference
corpus (ODQ §243). It supersedes the session scratchpad `map-refs/`, which is
temporary storage and may be deleted by the OS at any time. Every lane, review
and comparison round refers HERE from now on.**

Copied 2026-08-17 from the scratchpad, byte-verified (9,000,292,899 bytes of
plates, source and destination identical).

**2026-08-20 canonical asset-set root:**
`a2e649b4cb475fef44e00798a830420eb4ba4284d1a506e36464be5223f3bfc7`
(SHA-256 over each of the 626 assets' relative path, size and file SHA-256, in
canonical order). Reproduce with `python3 docs/corpus_integrity.py --hash-assets`.

## Contents

| Path | What it is |
|---|---|
| `plates/` | 313 reference plates, 4K (5056×3392), `hfNNN-*.png`. Numbering follows generation order and has gaps — it is an id, not a count. |
| `previews/` | 313 matching `prev-*.jpg` at 1100px for fast browsing. |
| `docs/laneHF-CALIBRATION.md` | **The growth-round index.** 264 dedicated plate rows: what each teaches, its defects and class. The initial 49 have full per-image sections in `laneMFS1-urbanism-atlas.md`; together they cover all 313. Also carries prompt counter-phrases and negative/oblique shelves. |
| `docs/laneMFS1-urbanism-atlas.md` | The urbanism + aesthetic study: 26 calibration targets, the measured palette/line/hand bands, the twelve banned priors, the delta tables. The map program's grading sheet. |
| `docs/laneHF2/HF3/HF4-receipt.md` | The three growth rounds: what was minted, what was discarded, spend, and the hazards learned. |
| `docs/laneHFM1-corpus-measured.csv` | Per-plate measured register (paper/ink hex, value range, chroma, grain σ, wash σ, tone IQR, stroke weights, and more) across all 313. |
| `docs/laneHFM1-*.json` | Band-exceedance analysis and the historical 53-image evaluation-roster proposal. |
| `docs/MFS1-*.py` | The measurement instruments. ⚠ `MFS1-grain2.py`'s windows are HAND-SET eye-bounds — re-set them per plate/render or the numbers are meaningless. |
| `docs/corpus_integrity.py` | Read-only canonical gate: 313/313 asset closure, CSV/JSON parity, combined 264+49 calibration coverage, evaluation/scrub rosters, S3a key closure, and context-census eligibility. `--hash-assets` additionally hashes all 626 images. |

### Machinery status

- `HFM1-one.py`, `MFS3a-frame.py`, `MFS3a-run.py` and `MFS3a-overlay.py`
  resolve the canonical corpus relative to this directory; they no longer depend
  on the vanished scratchpad or an unimportable hyphenated module name.
- Roster/register mutation is explicit: `HFM1-holdout-opt.py` and
  `HFM1-register.py` are dry-run by default and require `--write`; the latter
  updates JSON and CSV together. Always run `corpus_integrity.py` afterwards.
- `MFS1-streets.py`, `HFM1-aestest.py` and `HFM1-pathtest.py` are archived
  experiment drivers whose recorded intermediate inputs (`MFS1-grain2.json`,
  `MFS1-streetjobs.json`, `MFS1-aes-refs.json`, `MFS1-metrics.json` and the old
  1500px preview set) are not present. They are provenance, not runnable gates;
  missing inputs must report unavailable and may never count green.

## Standing rules

1. **FROZEN (§242).** No further growth rounds; the Higgsfield subscription is
   gone. New references are minted only if a specific law needs a specific
   vocabulary, and never by default.
2. **The corpus teaches DRAWING, never NAMING.** The scrub register has eight
   contamination categories covering **34 plates** (the generated frame once
   reported 35 by accidentally capturing cured exemplar `hf373`; that defect is
   repaired). They remain valid for geometry and aesthetics,
   are barred from lettering/chrome calibration, and are never shown outside
   the program. Our labels are our own and are TRUE — that is a competitive
   advantage over the references, not a style to copy.
3. **Defects are annotated, not inherited.** Keepers carry defect notes and the
   deliberate NEGATIVE references are labeled as such (e.g. the maximal-
   concentric metropolis). The twelve banned priors live in the atlas §2.4 —
   even spacing of repeated elements is the strongest "generated" tell.
4. **A closed legacy PIXEL-EVALUATION subset is reserved** — the authoritative
   53-plate roster lives in `docs/laneMFS1-urbanism-atlas.md` §2.9.4. It is
   **not an untouched calibration holdout**: every plate was viewed/measured,
   aggregate figures include all 313, and earlier study prose cites some ids
   later selected into the roster. Fresh implementation/evaluation lanes must
   still withhold those 53 image files so the roster remains useful for a
   same-family pixel check. A claim of true blindness requires a new sealed
   external set. The roster also has no trade/institution coverage.
5. **Git-ignored on purpose.** 8.5 GB of assets do not belong in git history,
   and the corpus is internal reference material. The folder's own
   `.gitignore` keeps it out of `git status`; back it up like data, not code.

## Provenance

Generated with the owner's Higgsfield account (Aug 2026) across three rounds
under the unlimited-use grant, then frozen when the subscription ended. Every
plate was individually viewed before filing; discards were not padded to hit
counts. Full spend and reconciliation figures are in the round receipts.
