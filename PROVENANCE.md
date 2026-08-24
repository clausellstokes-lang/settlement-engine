# MF-A1 recovered artifacts — provenance

Recovered 2026-08-24 by lane TE-A1-REC (read-only recovery, ODQ §569.3).
Source of record: session transcripts under
`~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/`.

**All four files come from ONE transcript:**
`a244e7a3-27d9-4152-b847-cf42cf4b08a7/subagents/agent-a098c59a46cc11f5e.jsonl`
(the MF-A1 lane agent, dispatched per ODQ §208.2 on the Fable seat).

| File | Bytes | sha256 (first 16) | Reconstruction | Transcript lines |
|---|---|---|---|---|
| `MFA1-paint.mjs` | 14,912 | `ce25a90790d4048e` | replay of 22 ops: 2 Write + 20 Edit, **all applied cleanly** (0 not-found, 0 ambiguous) | 111–224 |
| `MFA1-probe.svg` | 5,789 | `9a169b4f96049e68` | single Write, verbatim | 103 |
| `MFA1-sample.py` | 5,617 | `cb5d19ea2a806971` | single Write, verbatim | 89 |
| `laneMFA1-receipt.md` | 20,221 | `bd27a7d46683fff0` | single Write, verbatim | 268 |

Original on-disk location (now empty):
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad/mf-proto/aesthetic/`
(`laneMFA1-receipt.md` sat one level up, in `scratchpad/`).

**Completeness.** A write-path scan across all 2,620 transcripts (2.37 GB) found
no other MF-A1 aesthetic file ever written, and no second version of any of
these — so this is the lane's complete source set, not a latest-of-several pick.
Per the lane's own deliverables list (`laneMFA1-receipt.md` lines 130–135) every
other MF-A1 artifact was **generated output** (painted SVGs, PNGs, side-by-sides,
determinism renders, crops), regenerable from `MFA1-paint.mjs`.

**Verified.** Same-seed sha256-identical over two runs on three fabric leaves,
alt-seed divergent, `<g>` balance holds, 8 defs filters exactly as §211 records.
The module is standalone — its only import is `node:fs`.

⚠ The frozen **b6** inputs §211 measured against are purged from disk, so
§211's exact op figures (+10/+6/+8) cannot be re-measured. Deltas observed on
the later w2 fabric were +8/+12/+12 — in band, but a different corpus.
