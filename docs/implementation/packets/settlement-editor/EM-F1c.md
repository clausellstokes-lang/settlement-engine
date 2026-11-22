# `settlement-editor / tests-only mode` — EM-F1c: THE QUOTA GATES COUNT THROUGH THE ONE COUNTER (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `12c437de4b427c8663500e3df966ef8f20fa7b21` — EM-F1c: the three quota gates count only the saves the viewer can hold and reach
- **Verified base:** `feat/em-f1c-quota-siblings` at `2d82c462c83bb6ae35ff207d6b962770ef46578a`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-F1c-tests-only.md` (U31, from EM-F1b's notice 1).

**The charge, in one sentence.** The three raw-length quota gates in `src/store` count through `activeSaveCount`, so a library with hidden rows no longer refuses a viewer who has room.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `12c437de4` | `c808f13ed` | EM-F1c: the three quota gates count only the saves the viewer can hold and reach |

| action | path |
|---|---|
| MODIFY | `src/store/galleryImportMap.js` |
| MODIFY | `src/store/galleryImportSettlement.js` |
| MODIFY | `src/store/instantWorldBody.js` |
| TEST | `tests/store/phantomQuota.test.js` |
| CREATE | `tests/store/quotaGates.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

- **G0** — the fixture really is five rows the viewer can reach two of, and the control really is a full shelf
- **G1** — the gallery-settlement import ADMITS one more into that library, and still refuses a genuinely full shelf
- **G2** — the gallery-campaign import ADMITS a one-member campaign into that library, and still refuses a genuinely full shelf
- **G3** — the Instant World pre-flight ADMITS its realm when the reachable saves leave room, and refuses when they do not

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/store/phantomQuota.test.js tests/store/quotaGates.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-f1c-quota-siblings`, built at `c808f13ed`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (run `35891004370`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `12c437de4`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.
