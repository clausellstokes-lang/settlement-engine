# `settlement-editor / tests-only mode` — EM-E0: THE SIMULATION'S REGISTRATION (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `1bc628100d2d251bd142f688f96a272d3c3732c5` — EM-E0 (cure): the voice ratchet's per-file em-dash budget for the fork registry held at its baseline
- **Verified base:** `feat/em-e0-registration` at `51384b364ddd7adea37f0d4d8e7d5452dd7c874a`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-E0-tests-only.md` (the charter's Wave 3 row; design §19 ruling 1; the SIM-SEALS survey Table 4).

**The charge, in one sentence.** The survey's forty-four registration-owed draws gain habit-fork registry rows — four of them with a measured outcome vocabulary — and the totality walker holds the survey's Table 4 and the registration SET-EQUAL in both directions.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `52268f55c` | `fa5305b45` | EM-E0: the survey's forty-four registration-owed draws gain registry rows, four of them with a measured outcome vocabulary, and the walker's totality is re-derived |
| `1bc628100` | `c6728329c` | EM-E0 (cure): the voice ratchet's per-file em-dash budget for the fork registry held at its baseline |

| action | path |
|---|---|
| MODIFY | `src/domain/worldPulse/habitForkRegistry.js` |
| TEST | `tests/lint/chooserTotality.walker.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

The acceptance cases are named BY TITLE in the commit body of `52268f55c`, `1bc628100`, with their count lines, and are not restated here: the body's shape is prose rather than an id table, and a record that re-words a receipt is a second source of truth.

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/lint/chooserTotality.walker.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-e0-registration`, built at `fa5305b45`, `c6728329c`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (run `35868472048`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `52268f55c`, `1bc628100`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

ITS OWN ARM FOUND A LIVE DEFECT IN A PRE-EXISTING ROW: HBF-17 declares `STRATEGY_MOVES`, which `settlementStrategy.js` neither exports nor mentions — PINNED as a one-row register rather than flattened away (U12). EM-E0b carries the coup verdict's two bare draws (U10; judgment 265 (c)).
