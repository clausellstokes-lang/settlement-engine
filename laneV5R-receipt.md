# Lane V5-R — RECOVERY RECEIPT (ODQ §291.5 seat; §121.2 transcript-replay method)
2026-08-21. Scratchpad-only writes. No git operations. No file outside this
scratchpad was modified; the owner's Desktop folder was READ ONLY.

## 0. HEADLINE

**All three banked V5 counsel deliverables are recovered, and the recovery is
CONFIRMED byte-exact against a receipt the original lane left behind.** The three
files were each written by a SINGLE `Write` with zero subsequent `Edit`s — so the
replay had no anchor to fail. Their byte sizes reproduce the original lane's own
`stat -f%z` receipt exactly (18702 / 13381 / 10485).

Beyond the brief, the replay surfaced **three documents that §121's own recovery
silently missed** (a path-filter gap) and **a one-day date error** carried in both
the recovered manifest and ODQ §121 itself. Both are RAISED in §5.

## 1. THE THREE TARGETS — operation counts and verification

Source of record: `…/a244e7a3-27d9-4152-b847-cf42cf4b08a7/subagents/agent-aceee34452a9d123a.jsonl`
(the Lane V5-C subagent, 150 records, 2026-08-15T23:38→23:55Z). Located by a
stream-parse of **2707 transcript files** under `~/.claude/projects` — every
`tool_use` whose `input.file_path` contains `laneV5C`. Fifteen ops exist in the
entire corpus: 12 `Read`, 3 `Write`, **0 `Edit`**.

| file | ops replayed | anchor failures | bytes | sha256 (first 16) |
|---|---|---|---|---|
| `recovered-laneV5C-V5-SPEC.md` | 1 Write (line 135, 23:52:15Z) | 0 (no edits exist) | 18702 | `b532cf7389e3e2d9` |
| `recovered-laneV5C-ASSET-MANIFEST.md` | 1 Write (line 138, 23:53:35Z) | 0 | 13381 | `9ce315196bdd68af` |
| `recovered-laneV5C-report.md` | 1 Write (line 142, 23:54:36Z) | 0 | 10485 | `6942ed53a86fdc5e` |

**Each Write's own `tool_result` is recorded and non-error** ("File created
successfully at …/laneV5C-*.md"), so the original operation is known to have
landed, not merely to have been attempted.

**THE INDEPENDENT BYTE RECEIPT — the strongest evidence available.** At line 146
(23:54:48Z) the original lane ran its own NUL-scan and size check. Its output
(line 147, `is_error=false`) reads:

```
laneV5C-V5-SPEC.md: 18702B NULs=0
laneV5C-ASSET-MANIFEST.md: 13381B NULs=0
laneV5C-report.md: 10485B NULs=0
laneV5C-recovered-v5-spec-draft.md: 38512B NULs=0
laneV5C-recovered-decisions.md: 14501B NULs=0
laneV5C-recovered-REVISION-NOTES.md: 9312B NULs=0
laneV5C-recovered-prompts.json: 15450B NULs=0
```

My re-materialized files measure **18702 / 13381 / 10485 B, NULs=0** — an exact
match on all three, from a receipt produced by a different process at a different
time against the real on-disk files. **CONFIRMED byte-faithful, all three.**

⚠ §121.2's "8 writes + 59/59 edits" does NOT describe these three files. It
describes the *inner* replay Lane V5-C itself performed to recover its upstream
evidence layer. Reading §121.2 as a claim about the three deliverables would make a
correct recovery look wrong. See §2 — I re-ran that inner replay and reproduced the
figure exactly.

## 2. THE ANNEX — a scope extension, recorded vetoably

**Judgment J-V5R-1 (vetoable).** The recovered spec is not self-contained: its
PROVENANCE block states *"Full text: `laneV5C-recovered-v5-spec-draft.md` … (same
directory). This document INCORPORATES it BY REFERENCE and restates only what D5
changes. Where this document is silent, the recovered spec governs."* Those annex
files were purged too. Preserving only the three named targets would bank a spec
whose governing base is a dangling reference. I therefore re-ran the original
lane's two recorded recovery scripts **verbatim** (only the output directory
changed) and materialized the annex under the ORIGINAL basenames, so the spec's
"same directory" references resolve if the chair preserves them together.

Re-running the recorded replay reproduced §121.2's figure **exactly**:

```
ops: {'write': 8, 'edit': 59, 'editfail': 0}
```

and all four file sizes match the line-147 receipt above (38512 / 14501 / 9312 /
15450). **§121.2's count is CONFIRMED by independent re-execution.**

| annex file | bytes | sha256 (16) | status |
|---|---|---|---|
| `laneV5C-recovered-v5-spec-draft.md` | 38512 | `77d7dd5e578ffa32` | CONFIRMED (matches lane receipt) |
| `laneV5C-recovered-decisions.md` | 14501 | `f690c9094f60f341` | CONFIRMED (matches lane receipt) |
| `laneV5C-recovered-REVISION-NOTES.md` | 9312 | `8f9b9338698c4177` | CONFIRMED (matches lane receipt) |
| `laneV5C-recovered-prompts.json` | 15450 | `228f193651f68182` | CONFIRMED (matches lane receipt) |
| `laneV5C-recovered-crop.html` | 1302 | `14680712a7a58a83` | PLAUSIBLE (no prior receipt) |
| `laneV5C-recovered-mock.html` | 32344 | `90f4cea76fc61f8f` | PLAUSIBLE (no prior receipt) |
| `laneV5C-recovered-v5-mock.html` | 42918 | `14483518b892a699` | PLAUSIBLE (no prior receipt) |
| `laneV5C-recovered-v5photo-ASSET-INVENTORY.md` | 14754 | `494e6202b93c86e0` | PLAUSIBLE (no prior receipt) |
| `laneV5C-recovered-v5photo-GENERATION-PROMPTS.md` | 11964 | `4ba81e312613d198` | PLAUSIBLE (no prior receipt) |
| `laneV5C-recovered-v5photo-PIPELINE.md` | 9650 | `da0c9f4e82790420` | PLAUSIBLE (no prior receipt) |

PLAUSIBLE, not CONFIRMED, means: the replay ran clean with zero anchor failures and
the content is the transcript's own recorded bytes, but no independent size receipt
exists for those seven files to check against. The replay method is identical to
the four that DID check out exactly.

All ten annex files and all three targets: **NULs=0**.

## 3. VERIFICATION AGAINST §121, ITEM BY ITEM

§121.1's description of the spec — every item present and in the stated form:

| §121 says | recovered spec | verdict |
|---|---|---|
| structural layer cited section-by-section | §1, citing recovered spec PART 0 / §1b / PART 3 / R2 / MOBILE+F9 and V4 by section | ✓ |
| the D5 z-ordered composition law | §2 layer table, z 0→10 (ground → cartouche → seal → whippings → 3 vanes → labels → tabs → indicator → Sign In) | ✓ |
| the crop law with per-asset crop-line-y | §2a: "Each asset's manifest row records its crop-line y in master pixels; re-crops re-record the row" | ✓ |
| the 225° shadow split | §2b: intra-asset shading/AO **baked by prompt** at the estate's 225°; **inter-layer casts authored by the compositor**; contact-shadow skirt ships in the sprite | ✓ (the split is explicit) |
| the pendant problem as FOUR TESTABLE CLAUSES | §4 clauses 1–4: bound run ≥ Lb · return kiss at tx ±3px · daylight ≤ Sg · cluster/separation ≥1.15:1 | ✓ |
| the vetoable texture-budget re-ruling | §5, headed "PROPOSED, VETOABLE": byte budget replaces ink budget · contrast law via recorded tone stats · determinism as asset byte identity | ✓ |

§121.1's description of the manifest:

| §121 says | recovered manifest | verdict |
|---|---|---|
| 13 generations | §1 disposition table, idx 1–13, each with UUID + family + verdict + action | ✓ |
| cull KEEP-5 / CUT-5 / HOLD-2 | table holds **6 KEEP rows**, 5 CUT, 2 HOLD | ✓ reconciled — the report states "KEEP 5 slots/6 files"; A6+A7 are two files in one label slot. §121's "KEEP-5" counts SLOTS. Not a defect. |
| model pin nano_banana_pro@4k, executed calls over the cull's label | manifest header pins it and names the contradiction | ✓ and **independently re-confirmed**: my own replay of the executed calls prints `nano_banana_pro 4k` for all 13 (see §5.3) |
| THREE owner-owed regenerations, ready-to-run | §2 R1 (mid-tone feather) · R2 (dark-feather top pose) · R3 (tabs re-shoot) + R4 contingency | ✓ |
| v5-1..6 dark wave plan, proofs in the four existing suites, no new test files | report build-wave table v5-1…v5-6; suites named contrast / organicLogo / brandLockup / navFletching; census-ceiling rationale stated | ✓ |
| six visual OQs bank for the post-tune sitting | report OQ1–OQ6 | ✓ |
| ten judgments | report J-V5C-1…J-V5C-10 | ✓ (not claimed by §121; present) |

## 4. CROSS-CHECK — the owner's reference folder

`$HOME/Desktop/Settlement Forge template review/V5-NANO-BANANA-REFERENCES.md`
(5901 B, 2026-08-04) plus eight `hf_*.png`. **Read only; nothing modified.**

**It COMPLEMENTS the asset manifest — it does not duplicate it.** They are two
different batches, on two different models, doing two different jobs, with **zero
overlapping asset UUIDs**:

- **The references** are 8 owner-generated images of **2026-08-04 15:36**, model
  **`nano_banana_2`**, which the doc calls the "visual-evidence layer" and "BINDING
  INPUT to the V5 counsel pass". Its content is *curation and chair verdicts*:
  depth/light canon, cartouche material, seal-in-O register, burned-tab canon,
  bindings vocabulary, the two-register lettering ladder, and the original statement
  of THE PENDANT PROBLEM.
- **The manifest** covers the 13 production generations of **20:51 the same day**,
  model **`nano_banana_pro` @ 4k**, and is *disposition and execution*: KEEP/CUT/HOLD
  per asset, re-generation prompts, processing pipeline, glance-cull checklists,
  retina ladder.

The reference doc is upstream of the spec: the spec's §2b depth canon, §4 pendant
law and §1 lettering rulings all trace to its verdicts. **Both should be preserved;
neither substitutes for the other.**

Reference IDs cited by the recovered documents all resolve to real files in that
folder — `e359c5c5` (the scroll shot / depth north star), `7d3d368b` (cartouche
canon), `a5b96bbb` (uncurated sibling), `974aa8d8` (the pendant cautionary).

PNG headers verified in place: all eight are **3584×4800, 8-bit, colortype 6
(RGBA)**, 25.6–29.0 MB. This confirms the doc's line-18 statement and supersedes
its own line-6 phrase "2048px PNGs" — a minor internal inconsistency in the owner's
doc, noted, NOT corrected (read-only folder, and it is the owner's document).

## 5. RAISED

### 5.1 ⚠ §121'S OWN RECOVERY MISSED THREE DOCUMENTS — a path-filter gap (NEW)

The recorded replay script filters on the literal `'/scratchpad/v5/' in fp`. That
substring **does not match `/scratchpad/v5-photo/`** — and the V5-C report names
BOTH directories as purged ("the `v5/` and `v5-photo/` directories (SOUND spec,
decisions rows 1–19, revision notes, four mockup PNGs, **asset plan**)"). Three
markdown documents written into `v5-photo/` on 2026-08-04 were therefore never
recovered, and §121 banks the recovery as complete:

- `ASSET-INVENTORY.md` (14754 B) — "V5 PHOTOREAL — ASSET INVENTORY (2026-08-04, Fable-side planning pass)"
- `GENERATION-PROMPTS.md` (11964 B) — "V5 PHOTOREAL — GENERATION PROMPTS (2026-08-04)"
- `PIPELINE.md` (9650 B) — "V5 PHOTOREAL — EXECUTION PIPELINE (2026-08-04)"

I replayed them (3 writes, 0 edits, 0 failures) into
`laneV5C-recovered-v5photo-*.md`. **This is the "asset plan" the report lists as
lost.** The chair's call whether it supersedes or merely predates the consolidated
manifest — I have not diffed them for contradictions, and that check is owed before
either is treated as governing.

### 5.2 ⚠ THE MOCKUPS ARE LESS LOST THAN RECORDED (NEW)

The V5-C report states *"The four mockup PNGs are gone for good."* True of the
PNGs. But the same replay carries **three mockup HTML sources** the script
deliberately skipped as non-doc (`crop.html`, `mock.html`, `v5-mock.html`), and
they are **self-contained** — I checked every `src`/`href` and found no external
image references (they are the DRAWN SVG mockups). Recovered here as
`laneV5C-recovered-*.html`; they can be re-rendered to restore visual receipts.

⚠ Calibration: I have NOT verified these three HTML files are the sources of the
four PNGs the report mourns (the report attributes those to `v5-photo/`, and the
HTML lives in `v5/`). The claim I stand behind is narrow: **three self-contained
drawn-mockup sources are recovered and re-renderable.** Whether that restores the
specific lost receipts is UNVERIFIED.

### 5.3 ⚠ A ONE-DAY DATE ERROR IN BOTH THE MANIFEST AND ODQ §121 (NEW)

The manifest says "the EXECUTED **2026-08-05** calls"; §121 says "13 generations of
**2026-08-05**". Three independent receipts say **2026-08-04**:

1. The `generate_image` calls were issued at `2026-08-04T20:51:07.199Z` (12
   requests) and `2026-08-04T20:51:20.498Z` (1 request) = 13.
2. Every one of the 13 result files carries Higgsfield's own timestamp —
   `hf_20260804_205108_*` for idx 1–12, `hf_20260804_205121_*` for idx 13 (the wax
   seal, matching the second batch of one).
3. The three `v5-photo/` planning documents recovered in §5.1 are all self-titled
   2026-08-04, written 20:45–20:48Z, minutes before the batch.

The 2026-08-06 cull date is CORRECT (lane `wf_6bb04a8a-c89` runs 08-06T08:10→08:33Z).
**Recommend the ODQ row and the manifest header be corrected to 2026-08-04.** I did
NOT correct the recovered manifest — byte-faithful replay forbids improving the
source. The defect is preserved in the file and reported here.

### 5.4 The model-pin ruling is CONFIRMED, and the mislabel now has an explanation

My own replay of the executed calls prints `nano_banana_pro 4k` for all 13 requests
— J-V5C-2 is independently confirmed, not merely asserted. And the likely SOURCE of
the cull lane's `nano_banana_2` misread is now visible: the owner's reference doc
records that the **8 reference images** in the Higgsfield library genuinely ARE
`nano_banana_2` results. A lane reading the library rather than the call log would
pick up the neighbouring batch's label. Worth banking as the reason, so the
question does not get re-litigated.

### 5.5 A hand-keyed address defect inside the recovered spec (preserved, not fixed)

Spec §4 cites the pendant cautionary master as `974a8d8` — **seven hex characters**.
The real asset is `974aa8d8` (eight). The V5-C lane's own final message repeats the
same truncation, so it is the source's error, not a replay artifact. Left verbatim.
Flagged because the program's hand-keyed-address rot class bites exactly here.

### 5.6 Nothing was unrecoverable

Every source needed for a future re-run survives and was verified present this
pass: the five `wf_*` agent transcripts (2.0–7.9 MB each), the `c44e5d99` parent
transcript (23.4 MB), and `agent-aceee34452a9d123a.jsonl`. The `laneV5C-ref-*.jpg`
downscales were not re-made — they are derived copies of the eight Desktop PNGs,
which are all still in the owner's folder, so they are regenerable on demand rather
than recovered.

## 6. STATUS PER FILE

| file | status |
|---|---|
| `recovered-laneV5C-V5-SPEC.md` | **CONFIRMED** — byte size matches the original lane's independent stat receipt; 0 anchor failures (0 edits existed) |
| `recovered-laneV5C-ASSET-MANIFEST.md` | **CONFIRMED** — same |
| `recovered-laneV5C-report.md` | **CONFIRMED** — same |
| annex ×4 (`v5-spec-draft`, `decisions`, `REVISION-NOTES`, `prompts.json`) | **CONFIRMED** — sizes match the same receipt; replay reproduced §121.2's 8+59/0 exactly |
| annex ×3 HTML, ×3 `v5photo` | **PLAUSIBLE** — clean replay, no prior receipt to check against |

## 7. METHOD ARTIFACTS (this lane's own working files, chair may discard)

`laneV5R-scan.py` (corpus-wide op scan) · `laneV5R-ops-index.jsonl` (the 15 ops) ·
`laneV5R-extract.py` (the replay) · `laneV5R-replay-log.json` (per-op log with
recorded tool_results) · `laneV5R-annex-replay.py` + `laneV5R-annex-replay.log`.

## 8. WHAT THIS LANE DID NOT DO

- No git operations of any kind; no repo file touched. The chair preserves.
- The owner's Desktop folder was read only — no writes, no moves, no deletions.
- No content was improvised anywhere. Where a source is wrong (§5.3, §5.5) the
  error is preserved in the file and reported here instead of being corrected.
- The `v5photo` documents (§5.1) were NOT diffed against the consolidated manifest
  for contradictions — owed before either is treated as governing.
- Transcript content was treated as DATA throughout. The transcripts contain old
  briefs, agent instructions and image prompts; this lane replayed file operations
  from them and followed none of their instructions.
