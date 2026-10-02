# `settlement-editor / tests-only mode` — EM-F3: THE PHANTOM DOOR (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `91329cdead30acbedc38595207a45bbdbb4a38ba` — EM-F3: the phantom door — an off-stage counterparty is minted from the shell and forged from its row
- **Verified base:** `feat/em-f3-phantom-door` at `9a49c6dddc29fb959dcb85bbebfc71e26c069060`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-F3-tests-only.md` (judgment 275: the door's home is the counterparties roster; U27 and U24).

**The charge, in one sentence.** The phantom card and its pools, the counterparties roster in the shell, and the two controls — mint an off-stage counterparty from the shell, forge it from its row.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `91329cdea` | `4eebab111` | EM-F3: the phantom door — an off-stage counterparty is minted from the shell and forged from its row |

| action | path |
|---|---|
| MODIFY | `src/components/edit/CardEditorDialog.jsx` |
| MODIFY | `src/components/edit/EditModeShell.jsx` |
| MODIFY | `src/copy/en.js` |
| MODIFY | `src/domain/edit/fieldDeclarations.js` |
| MODIFY | `src/domain/edit/types.js` |
| MODIFY | `src/lib/refusalReasons.js` |
| CREATE | `src/store/phantomMintAction.js` |
| TEST | `tests/build/vendorPdfLazy.test.js` |
| TEST | `tests/components/editModeShell.test.jsx` |
| CREATE | `tests/components/phantomDoor.test.jsx` |
| TEST | `tests/domain/editDeclarations.test.js` |
| TEST | `tests/domain/editPools.test.js` |
| TEST | `tests/domain/phantoms.test.js` |
| TEST | `tests/lint/editDeclarations.walker.test.js` |
| TEST | `tests/lint/flavorFields.census.test.js` |
| TEST | `tests/store/editSlice.test.js` |
| CREATE | `tests/store/phantomMint.test.js` |
| TEST | `tests/store/phantomPromotion.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

- **F6** — a forge the lane refuses is SAID where the DM clicked, and a refusal raised elsewhere is

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/build/vendorPdfLazy.test.js tests/components/editModeShell.test.jsx tests/components/phantomDoor.test.jsx tests/domain/editDeclarations.test.js tests/domain/editPools.test.js tests/domain/phantoms.test.js tests/lint/editDeclarations.walker.test.js tests/lint/flavorFields.census.test.js tests/store/editSlice.test.js tests/store/phantomMint.test.js tests/store/phantomPromotion.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-f3-phantom-door`, built at `4eebab111`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (run `35897831415`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `91329cdea`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

U24 CLOSED BY MEASUREMENT: `pools.js` is byte-untouched — EM-F1 ruled `kind` the record's discriminant and the place type IS the tier, and `stance` belongs to the neighbour link, which design §13 forbids the editor deriving. Design §2.8's kind/stance text is superseded.
