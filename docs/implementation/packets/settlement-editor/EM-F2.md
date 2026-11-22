# `settlement-editor / tests-only mode` — EM-F2: PROMOTION — FORGING A PHANTOM (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `9a49c6dddc29fb959dcb85bbebfc71e26c069060` — EM-F2 (cure): the snapshot-promotion census records the forge's landing on a phantom's row
- **Verified base:** `feat/em-f2-promotion` at `5022eeca3720ef40e84caf2cb6f6f37d2adcf738`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-F2-tests-only.md` (the charter's Wave 5 row).

**The charge, in one sentence.** Forging a phantom's seed replaces its minimal record IN PLACE on the one generation action, and the snapshot-promotion census records the landing on the phantom's row as a FORWARD.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `32f23d727` | `3544c3d30` | EM-F2: forging a phantom's seed replaces its minimal record in place, on the one generation action |
| `f1fce5d3f` | `88992bdb7` | EM-F2 (cure): the phantoms leaf's A12 importer roster widened by its second importer, the generation action |
| `9a49c6ddd` | `394b24bcf` | EM-F2 (cure): the snapshot-promotion census records the forge's landing on a phantom's row |

| action | path |
|---|---|
| MODIFY | `src/store/settlementGenerateAction.js` |
| TEST | `tests/domain/phantoms.test.js` |
| TEST | `tests/lint/snapshotPromotion.census.walker.test.js` |
| CREATE | `tests/store/phantomPromotion.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

The acceptance cases are named BY TITLE in the commit body of `32f23d727`, `f1fce5d3f`, `9a49c6ddd`, with their count lines, and are not restated here: the body's shape is prose rather than an id table, and a record that re-words a receipt is a second source of truth.

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/domain/phantoms.test.js tests/lint/snapshotPromotion.census.walker.test.js tests/store/phantomPromotion.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-f2-promotion`, built at `3544c3d30`, `88992bdb7`, `394b24bcf`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (runs `35882132699`, `35887953396`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `32f23d727`, `f1fce5d3f`, `9a49c6ddd`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

Two cures rode its merge: the phantoms leaf's A12 importer roster widened by its second importer, and the snapshot-promotion census recording the forge's landing on a phantom's row as a FORWARD (shape W1), never a PROMOTER.
