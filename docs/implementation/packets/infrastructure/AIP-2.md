# Infrastructure / AIP-2 — the AI-provenance credit written back into the shipped files

- **Status:** LANDED
- **Implementation:** `264225618970eab64b85f34b42c3983c95e084da` on 2026-08-24 (the code half); this
  packet is the docs half and lands immediately after it. Do not redispatch.
- **Packet version:** `1`
- **Compiled by:** Lane TE-R3 2026-08-24, promoted in the same act; every figure below was
  executed at the verified base — see §8.
- **Verified base:** `claude/composite-r4` at `510c51b766a4ef329a697d61f3006e23d4fb2325`
- **Depends on:** TE-AIP-1, which built `scripts/ai-media-provenance.json`, the walker
  `tests/build/aiMediaProvenance.test.js`, and the two `.keepMetadata()` cures. AIP-2 is the
  follow-on that discharges the debt that register recorded.
- **Collision group:** `ai-media-provenance` — serialize against any lane touching the register,
  the walker, or the four media roots.
- **Census-holder:** ⭐ **AIP-2 HOLDS the estate-wide lighting-census row.** Its one test-file
  change moves `titles` +9 and `suiteTitles` +1; `files`, `parked` and `credited` cannot move
  because the file is an existing credited one. The row is re-recorded with a single-file
  revert control — see §6.
- **Deadline:** Higgsfield Terms of Use §5.5 binds this pre-existing account from **2026-08-27**.
  This packet lands three days ahead of it.

## 1. WHAT THIS IS

TE-AIP-1 established the damage and stopped it at source: a register naming every AI file under
the four media roots, a walker that refuses an unregistered file, and `.keepMetadata()` on both
sharp pipelines so nothing else gets stripped. What it could not do in its own scope was put the
markings back. **46 shipped files carried no provenance marking at all.** AIP-2 writes one into
each of them.

The obligation is dated. Higgsfield's §5.5 — "you will not remove, alter, or obscure any
provenance signals or markings" — binds this account from 2026-08-27, and BytePlus's §2(e)
already prohibits the same act upstream.

## 2. THE COUNT IS RE-DERIVED, NOT INHERITED

The brief carried "~46 bare files" and instructed that it be re-derived. It was, by execution
and not by trusting the register's own `_counts`:

| measurement | method | result |
|---|---|---|
| files under the four media roots | recursive walk of `public/backgrounds`, `public/evolution`, `public/media/journey-legs/bg`, `public/videos` | **75** |
| register rows | `Object.keys(register.assets).length` | **75** |
| on disk but unregistered | set difference | **0** |
| registered but missing | set difference | **0** |
| carrying any real marker | raw byte scan for `Made with Google AI`, `trainedAlgorithmicMedia`, `<x:xmpmeta`, `urn:c2pa`, `photoshop:Credit` | **6** |
| carrying none | the complement | **69** = 46 register-`absent` + 23 register-`n/a` |

**46 CONFIRMED.** The register and the tree agree exactly and there is nothing to reconcile.
The container split is `jpg 24 / webp 16 / mp4 6`, which is precisely why three injectors are
needed and not one. Total bytes of the 46: **52,755,638**.

The masters were re-measured too, and agree with the register: 82 media files, **32** carrying a
C2PA manifest, **25** carrying the Google credit, **35** carrying an `hf-job-id`, and **10**
carrying a job id and no Google marker at all.

## 3. THREE INJECTORS, CONTAINER-ONLY

`scripts/inject-ai-provenance.mjs` uses **no image library**. Re-encoding is the act that
destroyed this metadata in the first place, and it would also destroy any surviving SynthID
pixel watermark. Each injector edits the container and copies the coded bitstream verbatim.

1. **JPEG APP1.** A new `FFE1` segment carrying the `http://ns.adobe.com/xap/1.0/\0` namespace
   header and the XMP packet, spliced in after the JFIF `APP0` and any **Exif** `APP1`
   prologue. 16 of the 24 JPEGs have no `APPn` at all; 8 (village plus the seven stills) carry
   `APP0 + Exif APP1 + APP13`, and the existing `APP1` is Exif, so the XMP segment is **added
   alongside** rather than merged into it.
2. **WebP VP8X.** All 16 WebPs are simple lossy (`VP8 ` only). The simple form has no slot for
   metadata, so the file is promoted to the extended `VP8X` form — canvas dimensions read out of
   the VP8 frame header, XMP flag set — with the original `VP8 ` chunk copied byte-for-byte and
   an `XMP ` chunk appended.
3. **MP4 uuid.** A top-level `uuid` box with the standard XMP UUID
   `BE7ACFCB-97A9-42E8-9C71-999491E3AFAC`, **appended after the last existing box**. All six legs
   are `ftyp,moov,free,mdat` ending exactly at EOF. Appending is the only edit that preserves
   every prior box's **offset** as well as its bytes, which matters because `moov` addresses
   `mdat` by absolute file offset.

The write is **idempotent**: a file already carrying a packet is returned untouched, so a re-run
cannot stack a second packet. Proved by execution — the second run reports `0 file(s), 0 byte(s)`.

## 4. THE PIXEL-IDENTITY CONTROLS, AND THE MUTATIONS THAT CONVICT THEM

Injecting metadata into shipped art is only defensible if the art is unchanged. That is not
asserted here, it is measured.

**All 46 were decoded before and after and all 46 decode to identical raw pixel buffers** — the
JPEGs and WebPs through sharp's decoder to a raw RGB buffer compared by sha256, the MP4s through
an `mdat` byte-identity comparison plus a box-by-box offset and content check.

The walker now carries that comparison for one file per container, and each arm ends on a
**deliberate mutation proving it can fail**:

| injector | identity proof | convicting mutation | result |
|---|---|---|---|
| JPEG APP1 | decoded raw sha256 + dimensions | one byte of the entropy-coded scan flipped | decoded sha **differs** |
| WebP VP8X | decoded raw sha256 + `VP8 ` payload byte-equality + VP8X canvas agrees with the codec | one byte of the copied VP8 payload flipped | decoded sha **differs** |
| MP4 uuid | every prior box same bytes AND same offset; `mdat` sha256 | one byte inside `mdat` flipped | `mdat` sha **differs** |

Six mutations were also run against the **shipped tree** and each reds its intended arm, with a
clean run before and after:

| # | mutation | arm that red |
|---|---|---|
| M1 | JPEG injector corrupts the scan | JPEG pixel probe (+ round trip) |
| M2 | WebP injector truncates the VP8 bitstream | WebP pixel probe (+ round trip) |
| M3 | MP4 injector inserts `uuid` **before** `mdat` | MP4 offset probe (+ round trip) |
| M4 | `Made with Google AI` forged into a no-Google file | the `forbid` arm |
| M5 | an AI marker stamped onto a cohort-A file | the cohort-A arm and the re-planted CONTROL |
| M6 | one register row flipped back to `absent` | the ratchet, the present-set arm, the injector rail |

M0 and M7 (before and after the battery) were both 29 passed of 29 at exit 0.

**Out-of-band corroboration, not a gate dependency:** there is no ffmpeg in this repository, so
the MP4 arm is deliberately decoder-independent. Locally, `ffmpeg` decoded `leg-1` before and
after to an **identical 121-frame rgb24 stream** (sha256
`b8557c9172606f11fd38f44f6912117cb3a1fd07567741f9a3d4320dc2e02f9e`), and the mutated file to a
different one with h264 errors.

**The round-trip arm** is the strongest single statement available: strip the packet back out of
a shipped file, re-inject with the committed tool, and land on the **same bytes**. The shipped
art is provably the output of the committed tool.

## 5. WHAT IS A CREDIT AND WHAT IS GONE

Each packet carries the IPTC `DigitalSourceType` `trainedAlgorithmicMedia` tag, the generator,
the generation date, the Higgsfield job id where the master recorded one, and
`photoshop:Credit` **only where the master itself carried that credit**.

**The C2PA manifests are NOT restored, and this packet does not claim they are.** They are
signed by Google LLC and Byteplus Pte. Ltd.; a C2PA hash binding covers the asset's own bytes,
so a re-fetched manifest would not validate over a resized derivative; and minting a fresh one
needs a signing identity the estate does not hold. Every restored file **says so in its own
metadata**, so the disclaimer travels with the asset. Every restored row additionally
**FORBIDS** the string `urn:c2pa`, so a fabricated manifest cannot be slipped in later.

**The Google credit is not sprayed.** Ten masters carry a job id and no Google marker. Which
shipped files descend from them was settled by **measurement** — downscaled greyscale pixel RMS
against every master plate, with the winner and its margin recorded per row in the register —
not by filename. Five shipped files descend from two of those masters:

| shipped file | master | RMS / runner-up |
|---|---|---|
| `public/backgrounds/evolution-3-village.jpg` | `evolution-3-village.png` | 2.67 / 13.53 |
| `public/backgrounds/evolution-3-village.webp` | same, through its jpg twin | 2.67 / 13.53 |
| `public/backgrounds/export-dispatch.jpg` | `export-dispatch.png` | 3.92 / 49.21 |
| `public/backgrounds/export-dispatch.webp` | same, through its jpg twin | 3.92 / 49.21 |
| `public/evolution/village.jpg` | `evolution-3-village.png` | 5.86 / 14.22 |

Those five record the model as `not established` and forbid `Made with Google AI`. This also
explains a fact the register noted but did not account for: `public/evolution/village.jpg` was
the one evolution still lacking the credit its five siblings kept — because its master never
had one.

**The measurement settled an ambiguity a filename would have got wrong.** The masters hold both
`gallery-board.png` (no Google) and `gallery-crier-alive.png` (Google). `public/backgrounds/gallery.jpg`
matches **gallery-crier-alive** at RMS 3.71 against a runner-up of 52.38, so it correctly
receives the credit. A name-based mapping would plausibly have picked `gallery-board` and
suppressed a credit the file is entitled to.

**The video lineage is first-hand.** The six shipped legs and seven stills are sha256-identical
to the masters' `derived-legs/bg/` output, and the master films' C2PA manifests name
`BytePlus_ModelArk` v1.0.0, model `dreamina-seedance-2-0`, generated 2026-07-18. ⚠ Per-leg
timestamps differ across the six source films and the shipped legs are cuts of a **concatenation**
of them, so a per-leg time cannot be honestly assigned; the credit records the date `2026-07-18`
and no fabricated per-leg timestamp.

**COHORT A WAS NOT TOUCHED.** The injector refuses by construction any row not marked `absent`,
which excludes both the six `present` rows (including `realm-journey.mp4`, whose C2PA is still
VALID precisely because the file was never re-encoded — appending a box would break the hash
binding it currently satisfies) and all 23 cohort-A rows. A new walker arm measures on the files
themselves that no AI marking reached any of the 23. The walker's stripped-file CONTROL was
**re-planted onto cohort A**, because its former plant `founders-charter.jpg` now legitimately
carries the markers it used to lack.

## 6. THE CENSUS ROW

**AIP-2 takes the row.** `2,525/366/2,159/21,017/5,847` → `2,525/366/2,159/21,026/5,848`.

+0 files / +0 parked / +0 credited / **+9 titles** / **+1 suite title**. The car changes exactly
one test file, and it is an existing credited one, so no file figure can move.

⚠ **The delta is nine and a test count said eight.** The runtime count went 20 → 29; an early
hand reading of the base recorded 21 and would have published +8. The walked figure is the one
banked, and the miscount was caught by execution — which is the reason the row is asserted.

The attribution is a **single-file revert**: `git show <slot>:tests/build/aiMediaProvenance.test.js`
(20,791 bytes, printed before use) restored over the car's copy with the tuple pinned back to the
slot reading ran **33 passed of 33, exit 0**. Reverting this car's whole test delta lands on the
slot tuple to the digit and moves nothing else. Two negative controls, one per moved figure,
each guarded against a no-op edit by md5 and the file restored to
`dde3ab003321488afb1ee6eb08eae71a`, both red as predicted at 1 failed of 33.

## 7. THE PAYLOAD DELTA

**+71,229 bytes** across 52,755,638 bytes of art — between +1,489 and +1,606 per file, or about
**0.135%**. Both live asset budgets keep ample room, measured at the base:

- `WEBP_BUDGET_BYTES` is 491,520 and the tightest headroom was **151,682** bytes.
- Every webp must stay smaller than its jpg twin; the tightest headroom was **69,619** bytes, and
  since the same packet goes into both members of a pair the difference is preserved exactly.
- `tests/lint/sizeBaseline.test.js` walks `src/` only, so `public/` is outside it.

The unmarked-debt ratchet goes **46 → 0**. At zero it stops being a budget and becomes a floor:
any file that loses its marking, and any new AI file that arrives without one, reds.

## 8. FIGURES, ALL EXECUTED AT THE VERIFIED BASE

| figure | value |
|---|---|
| files under the four media roots / register rows | 75 / 75, 0 unregistered, 0 ghosts |
| bare files re-derived | 46 AI + 23 cohort A |
| bytes added | 71,229 (46 files) |
| decoded-pixel identity | 46 of 46 identical |
| walker tests | 20 → 29, all passing |
| census | 2,525/366/2,159/21,026/5,848 |
| typecheck ratchet | 173 errors, ceiling 173, no regression |
| register bytes | 16,855 → 45,592 |

## 9. WHAT THIS PACKET DOES NOT DO

Re-create or re-attach any C2PA manifest; assert an origin for cohort A; touch the six files that
kept their markings; sweep in `marketing/website/public/bg.mp4` (untracked and in no deploy
config — it inherits every obligation here the moment that changes); resolve the indemnity gap,
which no change in this repository can cure; or claim anything about the SynthID pixel watermark,
which no available detector can read in either direction.
