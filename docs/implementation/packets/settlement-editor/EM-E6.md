# `settlement-editor / tests-only mode` — EM-E6: EVENTS, PREDETERMINED OR BY THE PARTY (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `63cf7fb2a4e38ca4180dca4f7df7dfc6e570975a` — EM-E6: a decree schedules an event from THE catalogue, and the party's hand is the one the simulation already has
- **Verified base:** `feat/em-e6-events` at `5b3bc89fad7d5fa9b6e7ff7a45ff683ea55be21a`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-E6-tests-only.md` (the charter's Wave 3 row).

**The charge, in one sentence.** A decree schedules an event from THE catalogue — a reader that binds both catalogues BY IMPORT and copies no event type or impact kind — and the party's hand is the hand the simulation already has.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `63cf7fb2a` | `427163939` | EM-E6: a decree schedules an event from THE catalogue, and the party's hand is the one the simulation already has |

| action | path |
|---|---|
| MODIFY | `src/domain/display/stateProse/decreeProsePools.js` |
| CREATE | `src/domain/edit/eventCatalogue.js` |
| TEST | `tests/domain/decreeProse.test.js` |
| TEST | `tests/lint/decreeCause.walker.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

The acceptance cases are named BY TITLE in the commit body of `63cf7fb2a`, with their count lines, and are not restated here: the body's shape is prose rather than an id table, and a record that re-words a receipt is a second source of truth.

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/domain/decreeProse.test.js tests/lint/decreeCause.walker.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-e6-events`, built at `427163939`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions. The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `63cf7fb2a`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

`eventCatalogue.js` owes a row in `vendorPdfLazy`'s editorTrain roster (U6), taken with EM-E5's `directions.js` (U29).
