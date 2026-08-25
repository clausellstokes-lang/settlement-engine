# Lane TE-A1-REC — MF-A1 paint-pass recovery receipt

**Status: RECOVERED — all four routes closed, smoke green**
**Started** 2026-08-24 10:42 CDT · **Closed** ~11:20 CDT

## RESUME POINT
**LANE COMPLETE.** Routes 1, 2, 3, 4 all closed. All three MF-A1 source
artifacts + the 20,221 B lane receipt reconstructed into
`scratchpad/mf-a1-recovered/` and smoke-verified. Nothing further is pending.
If resumed: the only remaining work is the chair's — deciding where the module
lands for the wave-nine integration.

### Recovered file hashes (sha256)
```
ce25a90790d4048e5214979caa5461742fc9ac0e23c128f8a2c84f380ee72ba4  MFA1-paint.mjs
9a169b4f96049e68cee29218970d53a0364cc62865b48b070a6751bbaaeca079  MFA1-probe.svg
cb5d19ea2a80697121c97446f358e6a765d0c48b2ffff39019ae9af4ac32deb3  MFA1-sample.py
bd27a7d46683fff0b03412081489aa0ef55022af1c8129440c0cebe74b784a02  laneMFA1-receipt.md
```
The replay is **reproducible**: re-running it into a fresh path returns
`ce25a907…` again, so the reconstruction is a function of the transcript, not
of run order.

## SMOKE — CONFIRMED (executed, not reasoned)

Run on three real fabric leaves from `mf-proto-out/w2/` (which carry exactly the
group ids the module expects: `fields, squares, yards, fabric, landmarks`, a base
rect, and the 1000×1000 viewBox the aging overlay hardcodes).

| Leaf | base ops | painted ops | Δ | same-seed sha256 ×2 | alt-seed | `<g>` balance | defs filters |
|---|---|---|---|---|---|---|---|
| village-parchment | 176 | 184 | +8 | `63044dd3f84d2136` **IDENTICAL** | `4ba56ad4…` **DIVERGES** | 24/24 | 8 |
| city-darkFantasy | 407 | 419 | +12 | `9e6b0c50e2e09327` **IDENTICAL** | `dc205641…` **DIVERGES** | 26/26 | 8 |
| hamlet-darkFantasy | 91 | 103 | +12 | `e50e30d841e4167a` **IDENTICAL** | `ae03a2cf…` **DIVERGES** | 21/21 | 8 |

The alt-seed arm is the **negative control**: identical readings are also what a
dead instrument returns, so divergence-on-seed-change is what makes the
same-seed identity a measurement rather than a constant. The CLI entrypoint runs
too (`node MFA1-paint.mjs <in> <out> <seed>` → `painted … bankDups=0 fox=4`).

**Honest divergence from §211's figures.** §211 records +10/+6/+8 ops on the
frozen **b6** leaves (city 253→261). The smoke measures +8/+12/+12 on **w2**
leaves (city base 407, not 253) — a *different and later fabric generation*,
because the b6 exemplars were purged with everything else. The op delta stays
inside §211's band and far inside the 2,200 ceiling; it is **not** a re-measurement
of §211's claim, and must not be quoted as one. Re-measuring §211's exact
figures needs the frozen b6 inputs, which no longer exist anywhere on disk.

**Coherence check — no worktree needed.** The module's entire import surface is
`import { readFileSync, writeFileSync } from 'node:fs'` and its only export is
`paint(svgText, manifestSeed)`. There are **zero fabric imports to resolve**, so
the planned `ee0db96d3` resolution check is vacuous — the module is standalone
exactly as §211 describes it. I created no worktree.

**Unplanned finding, useful to wave nine:** the module was written against b6 and
runs **unchanged** on the w2 fabric. The integration target moved generations and
the paint pass still applies cleanly.

## THE VERDICT

`MFA1-paint.mjs` (14,912 B) reconstructed by replaying **22/22** Write/Edit ops
in transcript order — **zero OLD_NOT_FOUND, zero ambiguous matches**. The replay
is therefore an exact reconstruction of the file as it stood at the lane's last
edit, not a merge or a guess.

### Recovered files (all in `mf-a1-recovered/`)

| File | Bytes | Ops replayed | Provenance |
|---|---|---|---|
| `MFA1-paint.mjs` | 14,912 | 22 (2 Write + 20 Edit, all OK) | `a244e7a3.../subagents/agent-a098c59a46cc11f5e.jsonl` lines 111–224 |
| `MFA1-probe.svg` | 5,789 | 1 Write | same transcript, line 103 |
| `MFA1-sample.py` | 5,617 | 1 Write | same transcript, line 89 |
| `laneMFA1-receipt.md` | 20,221 | 1 Write | same transcript, line 268 |

Original path root: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad/mf-proto/aesthetic/`

### Corroboration against §211's acceptance figures

- §211: "texture lives in **8 defs filters**" → recovered module defines exactly
  8: `a1grain, a1stain, a1vig, a1hand, a1mottle, a1slop, a1shadow, a1block`. **MATCH.**
- §211 feature list → all present: grain (P2), stains (P3), vignette+fold (P4),
  tidemark rims (W3, in the parcel pass), wash mis-registration (W4 `a1slop`,
  feDisplacementMap scale 5.5), seeded line waver (I3 `a1hand`, scale 2.2),
  hard mass shadows (M1 feFlood+feComposite+feOffset(2,2)), three-tone water
  (A1 bank dup: `#45331F` wide / original / lightened heart), GAP-D
  block-perimeter pass (`a1block` feMorphology dilate r=0.9). **MATCH.**
- §211: deterministic, fnv1a→mulberry32 → module header and `paint()` confirm,
  with a **second independent stream** `::a1-parcel:v1` so parcel count never
  perturbs other draws.
- Recovered lane receipt line 84/86 confirms §211's op figures: town +10
  (202→212), city 261 ops = 11.9% of the 2,200 ceiling.

## ROUTE DENOMINATORS

**Route 1 — session transcripts.** Scanned **2,620 `.jsonl` files, 578,327 lines,
2,366,385,696 bytes** (all of `~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/`
including every `subagents/` and `subagents/workflows/` subdir). Pass A (20 markers):
3,962 hit lines across 185 files, 59 with high-signal markers. Pass B (write-path
scan over the same 2,620 files): **13 distinct written paths** matched
`MFA1|MF-A1|aesthetic/|det-A|det-B|paint`; only **4** are MF-A1 aesthetic
artifacts, all in ONE transcript. **No second version of the module exists in any
transcript** — the reconstruction is unambiguous, not a latest-of-many choice.

**Route 2 — repo object database.** `git fsck --unreachable --no-reflogs`:
3,693 unreachable objects (713 blob / 1,049 commit / 1,931 tree). All **713
unreachable blobs, 214,452,606 bytes**, read via `git cat-file --batch` and
scanned: **65 marker hits, ZERO code**. Every hit is a document — versions of
`OWNER_DECISION_QUEUE.md`, `THE GENERATION SPECIFICATION`, `HANDOFF_CURRENT.md`,
a rural-research doc, `mutationCoverageManifest` JSON, one mutation-sweep bash
script. The paint modules were never `hash-object`'d or staged in this repo.

**Route 4 — the ledger.** ODQ §211 (lines 7627–7664), §208 (7504–7530),
§209 (7532–7582), §569.3 (25364–25377) read and used as the reconstruction spec
and cross-check. The unreachable-blob sweep also surfaced **`THE GENERATION
SPECIFICATION`** (Lane MF-SPEC, ODQ §246.3) carrying the same markers — a
richer paint spec than §211 if the chair ever needs a rebuild reference.

**Route 3 — stray copies on disk.** Swept all **16** session scratchpad dirs
under `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/*/scratchpad/`,
the **7** worktrees under `.claude/worktrees/`, and `/private/tmp/*tree*`
(`MFINT1-tree`, `TE34-tree`). **Zero MF-A1 source files.** Confirmed empty at the
slot: `mf-proto/aesthetic/` (0 files), `mf-proto/det-A/`, `det-B/`, `src/`,
`mf-proto-out/a1/` (only empty `hi/ rd1/ rd2/`), and `mf-proto-out/b6/` — **the
frozen b6 inputs are purged too**, which is why §211's exact op figures can no
longer be re-measured. `mf-proto` totals 108 KB of empty dirs; `mf-proto-out`
still holds 34 MB, but only for *other* lanes (w2, b1–b8, w0/w1). `~/.Trash` is
**empty** (`total 0`) — nothing to restore, so no restore decision arises.

## NOTE ON THE EMPTY `det-A/` `det-B/` DIRS
The write-path scan found **no Write/Edit ops ever targeting `det-A`/`det-B`**.
Per the recovered lane receipt (line 134) those held `MFA1-det-*-r1/r2.svg`
determinism **renders** — generated output written by Bash redirection, not
source. Their emptiness costs nothing recoverable: they regenerate from
`MFA1-paint.mjs`. Same for `mf-proto-out/a1/` (painted SVGs, PNGs, side-by-sides,
crops) — all regenerable given the frozen b6 inputs.
