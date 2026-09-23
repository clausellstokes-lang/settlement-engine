# `settlement-editor / tests-only mode` — EM-E2: THE CHRONICLE'S VOICE (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `dec645fa1b6de6038ae4a3db7a5d39a61156ad44` — EM-E2 (cure): the cause walker's mutation-coverage row
- **Verified base:** `feat/em-e2-chronicle-voice` at `51384b364ddd7adea37f0d4d8e7d5452dd7c874a`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-E2-tests-only.md` (the charter's Wave 3 row).

**The charge, in one sentence.** A decree speaks from authored pools and joins the realm's ONE timeline — fifty-one sentences over fifteen pools, the corpus its own leaf.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `9ddf72419` | `5b3bc89fa` | EM-E2: the chronicle speaks a decree from authored pools, and joins the realm's one timeline |
| `dec645fa1` | `23cf8368d` | EM-E2 (cure): the cause walker's mutation-coverage row |

| action | path |
|---|---|
| REGISTER | `scripts/mutation-coverage-manifest.json` |
| CREATE | `src/domain/display/stateProse/decreeProse.js` |
| CREATE | `src/domain/display/stateProse/decreeProsePools.js` |
| CREATE | `tests/domain/decreeProse.test.js` |
| CREATE | `tests/lint/decreeCause.walker.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

The acceptance cases are named BY TITLE in the commit body of `9ddf72419`, `dec645fa1`, with their count lines, and are not restated here: the body's shape is prose rather than an id table, and a record that re-words a receipt is a second source of truth.

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/domain/decreeProse.test.js tests/lint/decreeCause.walker.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-e2-chronicle-voice`, built at `5b3bc89fa`, `23cf8368d`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (run `35868186955`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `9ddf72419`, `dec645fa1`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

Its pool keys are re-pointed to EM-C1's `DECREE_STATUSES`/`DECREE_AUTHORS` imports at the unfreeze (U5), with EM-E6's one-line splice into `decreeLineParts`.
