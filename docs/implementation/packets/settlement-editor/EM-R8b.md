# `settlement-editor / tests-only mode` — EM-R8b: THE HISTORY RESTORE AFTER THE TAKE (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `50f611f4ae454567c77bd17238b4a26ee8b70f15` — EM-R8b: a rung's top-level take no longer moves THE PROMISE's lived history
- **Verified base:** `feat/em-r8b-history-restore` at `703fd5b6367da0168b293f7e8f5350ddb0fdacbd`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** the COMPILED PACKET `EM-R8b` in the chair kit's `packets-waiting/` (judgment 262).

**The charge, in one sentence.** A rung's top-level take no longer moves THE PROMISE's lived history: shape H held on numbers — `.repairs` 12 → 0 of 498, nothing else moved, +0 B.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `50f611f4a` | `ed696b994` | EM-R8b: a rung's top-level take no longer moves THE PROMISE's lived history |

| action | path |
|---|---|
| MODIFY | `src/domain/edit/mergeConsequence.js` |
| TEST | `tests/domain/mergeLadderHeldKeys.test.js` |
| CREATE | `tests/domain/mergeLadderHistory.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

- **H1** — every declared HISTORY sub-path is one the restore can address, under a key a rung takes — HISTORY rows 1, unaddressable 0, unreachable 0
- **H2** — the lived history is byte-identical in every trial, and the ladder explains itself — 0 moved of 120, 48 rung-firing, 48/48 tree-kept
- **H3** — the take is attributable: a rung writes nothing the post-pass pipeline had not written — 0 receipt fields moved over 48 trials
- **H4** — three constructed controls: a history is never rewritten, invented or made from absence — kept verbatim, [] stays [], hasOwnProperty false
- **H5** — nothing judges the restored history: no invariant check reads it — 33 checks, 0 readers

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/domain/mergeLadderHeldKeys.test.js tests/domain/mergeLadderHistory.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-r8b-history-restore`, built at `ed696b994`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions. The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `50f611f4a`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

Its `_note` on `guardMergedRecord` in EM-R8's own manifest row is stale after this member and is ANNOTATED, never rewritten, at the unfreeze (U4; judgment 262 Q3).
